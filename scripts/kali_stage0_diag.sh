#!/bin/bash
# ============================================================
# Kali 状态诊断 + 清理之前半拉子环境（准备干净的搭建基础）
# ============================================================
export KALI_PASS="kail"
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
if ! sudo -n true 2>/dev/null; then echo "[FAIL] sudo fail"; exit 1; fi
SUDO="sudo"
SEP="========================================================"

echo "$SEP"
echo " 1/7 基础信息"
echo "$SEP"
echo "HOSTNAME: $(hostname)"
echo "IPs: $(hostname -I 2>/dev/null)"
echo "RELEASE: $(lsb_release -ds 2>/dev/null || cat /etc/os-release 2>/dev/null | head -2)"
echo "DISK: $(df -h / 2>/dev/null | tail -1 | awk '{print $2, $3, $4, $5}')"
echo "MEM: $(free -h | awk 'NR==2{print $2, $3, $4, $7}')"
echo "DATE: $(date)"
echo "UPTIME: $(uptime -p 2>/dev/null)"

echo ""
echo "$SEP"
echo " 2/7 已装软件状态（重点：LAMP + Docker + XAMPP）"
echo "$SEP"
for pkg in apache2 mariadb-server mariadb-client docker.io docker-compose php; do
  if dpkg -l 2>/dev/null | grep -qE "^ii\s+${pkg}(\s|:)"; then
    echo "  ✅ $pkg 已安装"
  else
    echo "  ⚪ $pkg 未安装"
  fi
done
echo ""
for bin in php apache2 mariadb docker docker-compose mysqld; do
  p=$(command -v $bin 2>/dev/null)
  [ -n "$p" ] && echo "  🛠️  $bin -> $p ($($bin --version 2>&1 | head -1 | cut -c1-80))"
done
echo ""
[ -d /opt/lampp ] && echo "  📦 XAMPP 已存在于 /opt/lampp (version: $($SUDO /opt/lampp/version 2>/dev/null || cat /opt/lampp/version 2>/dev/null || 未知))"
[ -d ~/vulhub ] && echo "  📦 vulhub 源码已存在 ~/vulhub"
[ -d /var/www/html/sqli-labs ] && echo "  📦 SQLi-Labs 目录已存在 /var/www/html/sqli-labs"
[ -d /var/www/html/pikachu ] && echo "  📦 Pikachu 目录已存在 /var/www/html/pikachu"
[ -d /var/www/html/upload-labs ] && echo "  📦 Upload-Labs 目录已存在 /var/www/html/upload-labs"

echo ""
echo "$SEP"
echo " 3/7 端口占用检查（重点：80/81/443/3306/3307/8080/9111）"
echo "$SEP"
$SUDO ss -tlnp 2>/dev/null | awk 'NR==1 || /:(80|81|443|3306|3307|8080|8081|8082|8083|9111)\s/' || true
# 用 nc 挨个测一下（非 root 只能看有没有监听）
for p in 22 80 81 443 3306 3307 8080 9111; do
  if bash -c "</dev/tcp/127.0.0.1/$p" 2>/dev/null; then
    echo "  🔴 127.0.0.1:$p OPEN"
  else
    echo "  ⚪ 127.0.0.1:$p CLOSED"
  fi
done

echo ""
echo "$SEP"
echo " 4/7 Service 状态（apache2/mariadb/docker/ssh）"
echo "$SEP"
for svc in apache2 mariadb docker ssh mysql; do
  if systemctl list-unit-files 2>/dev/null | grep -q "${svc}.service"; then
    state=$(systemctl is-active $svc 2>&1 | head -1)
    boot=$(systemctl is-enabled $svc 2>&1 | head -1)
    echo "  $svc: active=$state  enabled=$boot"
  else
    echo "  $svc: (无此 unit)"
  fi
done

echo ""
echo "$SEP"
echo " 5/7 Docker 残留检查（镜像、容器）"
echo "$SEP"
if command -v docker >/dev/null 2>&1; then
  echo "Images:"
  $SUDO docker images 2>&1 | head -15 | awk '{print "    "$0}'
  echo "Containers:"
  $SUDO docker ps -a 2>&1 | head -15 | awk '{print "    "$0}'
  # 镜像加速器
  echo "Registry mirrors:"
  $SUDO docker info 2>&1 | grep -A 10 "Registry Mirrors" | awk '{print "    "$0}'
  # daemon.json
  [ -f /etc/docker/daemon.json ] && echo "daemon.json:" && python3 -c "import json,sys; print(json.dumps(json.load(open('/etc/docker/daemon.json')), indent=2, ensure_ascii=False))" 2>&1 | awk '{print "    "$0}'
else
  echo "  (docker 命令不存在)"
fi

echo ""
echo "$SEP"
echo " 6/7 MariaDB 账号（leet/root）连通性测试"
echo "$SEP"
if command -v mariadb >/dev/null 2>&1; then
  echo "  - leet@127.0.0.1:"
  mariadb -h 127.0.0.1 -uleet -pleet123 -e "SELECT 'leet OK' as s\G" 2>&1 | head -5 | awk '{print "    "$0}'
  echo "  - root@localhost via socket sudo:"
  $SUDO mariadb -e "SELECT 'root OK' as s\G; SHOW DATABASES;" 2>&1 | head -15 | awk '{print "    "$0}'
fi

echo ""
echo "$SEP"
echo " 7/7 Apache 站点 + /var/www 权限"
echo "$SEP"
ls -la /var/www/html/ 2>&1 | awk '{print "    "$0}' | head -25
echo ""
echo "a2enmod 状态:"
for m in rewrite php8.2 php8.3 php8.4; do
  $SUDO a2query -m $m 2>&1 | head -1 | awk '{print "    "$0}'
done
echo ""
echo "000-default.conf -> DocumentRoot:"
grep -E "DocumentRoot|Directory /var" /etc/apache2/sites-available/000-default.conf 2>&1 | head -10 | awk '{print "    "$0}'

echo ""
echo "DONE."
