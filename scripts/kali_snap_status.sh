#!/bin/bash
# 10秒状态快照：看 Upload-Labs(XAMPP) + Docker 3 框架靶场 的真实进度
export KALI_PASS="kail"
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
SUDO="sudo"
sep="------------------------------------------------------------"

echo ""
echo "【1】Upload-Labs / XAMPP 5.6 状态"
echo "$sep"
if [ -x /opt/lampp/bin/php ]; then
  echo "  ✅ /opt/lampp 目录存在：PHP 版本=$(/opt/lampp/bin/php -r 'echo PHP_VERSION;')"
  if [ -d /opt/lampp/htdocs/upload-labs ]; then
    echo "  ✅ /opt/lampp/htdocs/upload-labs 已部署，文件数=$(find /opt/lampp/htdocs/upload-labs -maxdepth 1 -type f 2>/dev/null | wc -l)"
  else
    echo "  ⚠️  upload-labs 源码还没部署到 htdocs"
  fi
  echo "  📡 XAMPP 端口监听:"
  ss -tlnp 2>/dev/null | grep -E ":(81|3307|444)\b" || echo "     （暂时未监听，XAMPP 可能还没 start）"
  systemctl list-unit-files --type=service 2>/dev/null | grep xampp | head -3
else
  echo "  ❌ /opt/lampp 还不存在（XAMPP 安装包可能还在下载中 / 或上条脚本被你 skip 了）"
fi
echo ""
ls -lh /tmp/xampp-installer.run 2>/dev/null && echo "   ↳ /tmp 已有安装包（大小：$(stat -c %s /tmp/xampp-installer.run 2>/dev/null) bytes）" || echo "   ↳ /tmp 暂无 xampp-installer.run（下载未完成或尚未跑那条脚本）"

echo ""
echo "【2】Docker 框架靶场状态"
echo "$sep"
echo "  本地已有镜像:"
$SUDO docker images 2>&1 | grep -E "REPOSITORY|vulhub|weblogic|thinkphp|struts|tomcat" | head -12
echo ""
echo "  运行中的容器:"
$SUDO docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}" 2>&1 | head -15
echo ""
echo "  4 个关键端口 HTTP 响应码:"
for p in 8080 8081 8082 8083; do
  C=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 "http://127.0.0.1:$p/" 2>&1 || echo 000)
  INFO=""
  case $p in
    8080) INFO="(Tomcat CVE-2017-12615 Demo)"; [ "$C" = "200" ] && TAG="✅" || TAG="❌";;
    8081) INFO="(ThinkPHP 5 RCE)"; [ "$C" != "000" ] && [ "$C" != "502" ] && TAG="✅" || TAG="⬜";;
    8082) INFO="(Struts2 S2-045 Tomcat)"; [ "$C" != "000" ] && [ "$C" != "502" ] && TAG="✅" || TAG="⬜";;
    8083) INFO="(WebLogic CVE-2017-10271)"; WS=$(curl -s --max-time 8 "http://127.0.0.1:8083/ws-wsat/CoordinatorPortType" 2>&1 | wc -c); [ "$WS" -gt 200 ] && TAG="✅ HTTP Body=$WS bytes" || { [ "$C" != "000" ] && [ "$C" != "502" ] && TAG="⏳ 根路径 HTTP $C" || TAG="⬜"; };;
  esac
  printf "    $TAG  :$p  %-40s -> HTTP %s\n" "$INFO" "$C"
done
echo ""
echo "【3】系统资源占用（剩多少磁盘/内存）"
echo "$sep"
df -h / /var/lib/docker /opt 2>/dev/null | grep -v "^tmpfs" | head -5
echo ""
free -h
echo ""
echo "DONE."
