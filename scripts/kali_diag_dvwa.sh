#!/bin/bash
# ============================================================
# 纯诊断脚本 · DVWA 访问不了
# 只执行读操作，不修改任何文件/服务/权限
# ============================================================
export KALI_PASS="kail"
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
SUDO="sudo"
HR="============================================================"

echo "$HR"
echo " [H1/H5/H6]  DocumentRoot + /var/www/html 目录存在性 + 权限"
echo "$HR"
echo " Apache 默认站点 conf:"
grep -E "DocumentRoot|Directory|ServerName" /etc/apache2/sites-enabled/000-default.conf 2>&1 | sed 's/^/   /'
echo ""
echo " /var/www/html ls -la (全部一级目录，不递归)："
ls -la /var/www/html/ 2>&1 | sed 's/^/   /'
echo ""
echo " 有没有 dvwa 相关目录？(大小写全 grep)"
ls -la /var/www/html/ 2>&1 | grep -iE "dvwa|DVWA" | sed 's/^/   DVWA FOUND: /'
echo "   (上面无输出=目录不存在)"
echo ""
if [ -d /var/www/html/dvwa ]; then
  echo " [/var/www/html/dvwa] 属主/权限:"
  ls -ld /var/www/html/dvwa /var/www/html/dvwa/config 2>&1 | sed 's/^/   /'
fi
if [ -d /var/www/html/dvwa2 ]; then
  echo " [/var/www/html/dvwa2] 属主/权限:"
  ls -ld /var/www/html/dvwa2 /var/www/html/dvwa2/config 2>&1 | sed 's/^/   /'
fi

echo ""
echo "$HR"
echo " [H2] Apache 启用的模块（PHP/rewrite）"
echo "$HR"
$SUDO apache2ctl -M 2>&1 | grep -iE "php|rewrite|mpm" | sed 's/^/   /'
echo "   (期望看到 php8_4_module / php_module / rewrite_module)"
echo ""
$SUDO a2query -m 2>&1 | grep -iE "php|rewrite" | sed 's/^/   /'

echo ""
echo "$HR"
echo " [H3] MariaDB 服务状态"
echo "$HR"
systemctl status mariadb --no-pager 2>&1 | head -12 | sed 's/^/   /'
echo ""
echo " 监听端口 3306:"
ss -tlnp 2>/dev/null | grep 3306 | sed 's/^/   /'
echo ""
echo " 能匿名连 MariaDB 吗？(测试 DB 引擎活着)"
mysqladmin -u root --protocol=TCP -h 127.0.0.1 ping 2>&1 | head -3 | sed 's/^/   /'
mysql -u root -e "SELECT User,Host FROM mysql.user;" 2>&1 | head -10 | sed 's/^/   /'

echo ""
echo "$HR"
echo " [H4] DVWA config 文件（DB用户名/密码/DB名）"
echo "$HR"
for D in /var/www/html/dvwa /var/www/html/dvwa2 /var/www/html/DVWA; do
  if [ -f "$D/config/config.inc.php" ]; then
    echo "   ✅ Found: $D/config/config.inc.php -> "
    grep -E "db_user|db_password|db_database|db_server|DB_" "$D/config/config.inc.php" 2>&1 | grep -v "^[[:space:]]*#" | sed 's/^/      /'
  fi
done

echo ""
echo "$HR"
echo " 实际 HTTP 级验证（模拟用户访问）"
echo "$HR"
for URL in "http://127.0.0.1/" "http://127.0.0.1/dvwa/" "http://127.0.0.1/dvwa2/" "http://127.0.0.1/DVWA/" "http://127.0.0.1/sqli-labs/" "http://127.0.0.1/pikachu/" "http://127.0.0.1:8081/" "http://127.0.0.1:8082/"; do
  CODE=$(curl -s -o /tmp/.dvwa_body -w "%{http_code}" --max-time 10 "$URL" 2>&1 || echo 000)
  TITLE=$(grep -oE "<title>[^<]+</title>" /tmp/.dvwa_body 2>/dev/null | head -1 | cut -c1-100)
  DB_ERR=$(grep -iE "Could not connect|database|mysql|SQLSTATE|Access denied" /tmp/.dvwa_body 2>/dev/null | head -1 | sed 's/^[[:space:]]*//' | cut -c1-120)
  [ -z "$TITLE" ] && TITLE="(无 title 标签，size=$(wc -c </tmp/.dvwa_body) bytes)"
  EXTRA=""
  [ -n "$DB_ERR" ] && EXTRA=" DB_ERR=$DB_ERR"
  printf "   HTTP=%-5s  %-50s  title=%s%s\n" "$CODE" "$URL" "$TITLE" "$EXTRA"
done
echo ""
echo " 🔍 Apache error.log 最近 30 行（DVWA 报 PHP 致命错误会打在这里）"
$SUDO tail -30 /var/log/apache2/error.log 2>&1 | tail -30 | sed 's/^/   /'
echo ""
echo "DIAG_DONE."
