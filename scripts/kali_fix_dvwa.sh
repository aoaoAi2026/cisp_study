#!/bin/bash
# ============================================================
# DVWA 修复（精准版 v2）：
#   · 第一候选凭证 leet/leet123（Pikachu 实际在用的）
#   · 给 leet 用户授权 dvwa DB
#   · 把 DVWA(/etc/dvwa/config) 配置改成同一套 leet/leet123
#   · 修 Pikachu 两套常量名 (DB_HOST 风格 + DBHOST 风格) + DBPORT + MYSQL_ASSOC
# ============================================================
export KALI_PASS="kail"
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
SUDO="sudo"

# 候选凭证池（按命中率高低排序）
CANDIDATES=(
  "leet:leet123:127.0.0.1:3306"  # 第1位 Pikachu SQLi 实际在用的
  "root:leet123:127.0.0.1:3306"  # 第2位 SQLi cfg 里 root 默认密码
  "root::127.0.0.1:3306"         # 第3位 root 空密码
  "root:kail:127.0.0.1:3306"
  "root:password:127.0.0.1:3306"
  "root:kali:127.0.0.1:3306"
  "root:123456:127.0.0.1:3306"
  "dvwa:p@ssw0rd:127.0.0.1:3306" # DVWA 官方默认
  "dvwa:dvwa:127.0.0.1:3306"
  "root:toor:127.0.0.1:3306"
)

DBUSER="" DBPW="" DBHOST="" DBPORT=""

echo "=== Step 1: 遍历候选凭证找能连上的 ==="
FOUND=0
for line in "${CANDIDATES[@]}"; do
  IFS=: read -r u p h port <<< "$line"
  OUT=$($SUDO mysql -u"$u" -h"$h" -P"$port" --password="$p" -e "SELECT USER() AS me;" 2>&1 | tail -1)
  RC=$?
  echo "  试 $u@$h:$port/$p -> exit=$RC  output=$OUT"
  if [ $RC -eq 0 ]; then
    DBUSER="$u"; DBPW="$p"; DBHOST="$h"; DBPORT="$port"
    FOUND=1
    echo "    ✅ 匹配！用凭证 $DBUSER:$DBPW@$DBHOST:$DBPORT"
    break
  fi
done
if [ $FOUND -eq 0 ]; then
  echo "  ❌ 所有候选都连不上？ 看看 MariaDB unix socket 能不能用 sudo mysql："
  OUT=$($SUDO mysql -e "SELECT USER();" 2>&1 | tail -1)
  RC=$?
  echo "    sudo mysql (socket) -> exit=$RC $OUT"
  if [ $RC -eq 0 ]; then
    echo "    Socket 能用，给 root@127.0.0.1 设密码 leet123，再创建 leet 用户授权全部："
    $SUDO mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'leet123'; CREATE USER IF NOT EXISTS 'leet'@'127.0.0.1' IDENTIFIED BY 'leet123'; GRANT ALL PRIVILEGES ON *.* TO 'leet'@'127.0.0.1' WITH GRANT OPTION; FLUSH PRIVILEGES;" 2>&1 | sed 's/^/      /'
    DBUSER="leet"; DBPW="leet123"; DBHOST="127.0.0.1"; DBPORT="3306"
    echo "    已设，凭证：leet/leet123"
    FOUND=1
  else
    echo "  ❌❌ 彻底连不上，请人工重置 MariaDB root 密码"; exit 2
  fi
fi

echo ""
echo "=== Step 2: 建 dvwa 库 + 给 leet 授权 + 导入 DVWA 官方 init SQL ==="
$SUDO mysql -u"$DBUSER" -h"$DBHOST" -P"$DBPORT" --password="$DBPW" -e "CREATE DATABASE IF NOT EXISTS dvwa DEFAULT CHARACTER SET utf8mb4; GRANT ALL PRIVILEGES ON dvwa.* TO '$DBUSER'@'$DBHOST'; FLUSH PRIVILEGES;" 2>&1 | sed 's/^/    /'
echo "  现在的数据库："
$SUDO mysql -u"$DBUSER" -h"$DBHOST" -P"$DBPORT" --password="$DBPW" -e "SHOW DATABASES;" 2>&1 | grep -vE "performance_schema|Using a password" | sed 's/^/    /'

# 如果 dvwa.users 表不存在（空库），导入官方 dvwa.sql（/usr/share/dvwa 里应该有）
DVWA_SQL=$(ls /usr/share/dvwa/config/setup.sql /usr/share/dvwa/dvwa/setup.sql /usr/share/dvwa*/dvwa.sql 2>/dev/null | head -1)
if [ -n "$DVWA_SQL" ] && ! $SUDO mysql -u"$DBUSER" --password="$DBPW" -e "SHOW TABLES FROM dvwa;" 2>/dev/null | grep -qw users; then
  echo "  dvwa 是空库，导入 SQL=$DVWA_SQL："
  $SUDO mysql -u"$DBUSER" -h"$DBHOST" -P"$DBPORT" --password="$DBPW" dvwa < "$DVWA_SQL" 2>&1 | tail -5 | sed 's/^/      /'
  echo "  导入后 dvwa 表："
  $SUDO mysql -u"$DBUSER" --password="$DBPW" -e "USE dvwa; SHOW TABLES;" 2>&1 | sed 's/^/      /'
fi

echo ""
echo "=== Step 3: 改 /etc/dvwa/config/config.inc.php （DVWA 真实配置文件）==="
DVWA_CFG_REAL="/etc/dvwa/config/config.inc.php"
$SUDO cp -f "$DVWA_CFG_REAL" "${DVWA_CFG_REAL}.bak.$(date +%F-%H%M%S)" 2>/dev/null
# 直接写完整一份，兼容 getenv 风格，占位符全替换
$SUDO tee "$DVWA_CFG_REAL" >/dev/null <<DVWACFG
<?php
# Kali LAMP 修复版 (2026-07-02)
if (getenv('DB_SERVER'))     $_DVWA[ 'db_server' ]   = getenv('DB_SERVER');     else $_DVWA[ 'db_server' ]   = '$DBHOST';
if (getenv('DB_PORT'))       $_DVWA[ 'db_port']      = getenv('DB_PORT');       else $_DVWA[ 'db_port' ]    = '$DBPORT';
if (getenv('DB_DATABASE'))   $_DVWA[ 'db_database' ] = getenv('DB_DATABASE');   else $_DVWA[ 'db_database' ] = 'dvwa';
if (getenv('DB_USER'))       $_DVWA[ 'db_user' ]     = getenv('DB_USER');       else $_DVWA[ 'db_user' ]     = '$DBUSER';
if (getenv('DB_PASSWORD'))   $_DVWA[ 'db_password' ] = getenv('DB_PASSWORD');   else $_DVWA[ 'db_password' ] = '$DBPW';

$_DVWA[ 'default_security_level' ] = 'impossible';   # 用 impossible 初始化安全，用户可切 low
$_DVWA[ 'default_user_id' ] = 'admin';
$_DVWA[ 'default_password' ] = 'password';

if (getenv('RECAPTCHA_PUB_KEY'))  $_DVWA[ 'recaptcha_public_key' ]  = getenv('RECAPTCHA_PUB_KEY');  else $_DVWA[ 'recaptcha_public_key' ]  = '';
if (getenv('RECAPTCHA_PRIV_KEY')) $_DVWA[ 'recaptcha_private_key' ] = getenv('RECAPTCHA_PRIV_KEY'); else $_DVWA[ 'recaptcha_private_key' ] = '';

$_DVWA[ 'allow_url_include' ] = (bool)ini_get('allow_url_include');
if (!isset($_DVWA[ 'disable_authentication' ])) $_DVWA[ 'disable_authentication' ] = false;
DVWACFG
grep -E "db_" "$DVWA_CFG_REAL" | sed 's/^/    /'
# 软链目标文件同样要同步（防止 include 路径差异）
[ -f /var/www/html/dvwa/config/config.inc.php ] && { $SUDO cp -f "$DVWA_CFG_REAL" /var/www/html/dvwa/config/config.inc.php; echo "    同步到软链目标 /var/www/html/dvwa/config 完成"; }

echo ""
echo "=== Step 4: 修 Pikachu 两套常量 + DBPORT + MYSQL_ASSOC ==="
PK_CFG=/var/www/html/pikachu/inc/config.inc.php
if [ -f $PK_CFG ]; then
  echo "  备份原始：${PK_CFG}.bak.$(date +%F-%H%M%S)"
  $SUDO cp -f "$PK_CFG" "${PK_CFG}.bak.$(date +%F-%H%M%S)"
  # 直接重写完整一份（两套 define 都齐 + 端口 + 兼容）
  $SUDO tee "$PK_CFG" >/dev/null <<PKCFG
<?php
// Pikachu 主配置 Kali 修复版（2026-07-02 两套常量风格齐全+DBPORT+MYSQL_ASSOC兼容）
// --- 风格1：下划线 ---
define('DB_HOST',    '$DBHOST');
define('DB_PORT',    '$DBPORT');
define('DB_USER',    '$DBUSER');
define('DB_PASSWORD','$DBPW');
define('DB_NAME',    'pikachu');
define('DB_TYPE',    'mysql');
define('DB_CHARSET', 'utf8mb4');
define('REDIS_HOST', '');
define('REDIS_PORT', 6379);

// --- 风格2：紧凑版（mysql.inc.php 里用的） ---
if (!defined('DBHOST')) define('DBHOST', DB_HOST);
if (!defined('DBPORT')) define('DBPORT', DB_PORT);
if (!defined('DBUSER')) define('DBUSER', DB_USER);
if (!defined('DBPW'))   define('DBPW',   DB_PASSWORD);
if (!defined('DBNAME')) define('DBNAME', DB_NAME);

// --- PHP 8.x 兼容 shim（MYSQL_ASSOC -> MYSQLI_ASSOC） ---
if (!defined('MYSQL_ASSOC'))  define('MYSQL_ASSOC',  MYSQLI_ASSOC);
if (!defined('MYSQL_NUM'))    define('MYSQL_NUM',    MYSQLI_NUM);
if (!defined('MYSQL_BOTH'))   define('MYSQL_BOTH',   MYSQLI_BOTH);
PKCFG
  $SUDO chown www-data:www-data "$PK_CFG"
  # 同样修 PKXSS 平台
  PKXSS_CFG=/var/www/html/pikachu/pkxss/inc/config.inc.php
  if [ -f $PKXSS_CFG ]; then
    $SUDO cp -f "$PKXSS_CFG" "${PKXSS_CFG}.bak.$(date +%F-%H%M%S)"
    $SUDO tee "$PKXSS_CFG" >/dev/null <<XSSCFG
<?php
// Pikachu PKXSS 配置修复版
define('DB_HOST',    '$DBHOST');
define('DB_PORT',    '$DBPORT');
define('DB_USER',    '$DBUSER');
define('DB_PASSWORD','$DBPW');
define('DB_NAME',    'pikachu');
define('DB_CHARSET', 'utf8mb4');
if (!defined('DBHOST')) define('DBHOST', DB_HOST);
if (!defined('DBPORT')) define('DBPORT', DB_PORT);
if (!defined('MYSQL_ASSOC')) define('MYSQL_ASSOC', MYSQLI_ASSOC);
XSSCFG
    $SUDO chown www-data:www-data "$PKXSS_CFG"
    echo "    PKXSS 平台配置同步 OK"
  fi
  echo "  Pikachu 双风格常量 + DBPORT + MYSQL_ASSOC 兼容补丁打入："
  grep -E "^define" $PK_CFG | sed 's/^/    /'
fi

echo ""
echo "=== Step 5: Apache reload + 健康检查 ==="
$SUDO systemctl restart apache2 mariadb 2>&1 | sed 's/^/    /'
sleep 4
echo "  服务状态: $(systemctl is-active apache2) / $(systemctl is-active mariadb)"

echo ""
echo "=== Step 6: 回归 HTTP (curl 各靶场 + 看 title / 无 fatal error) ==="
for URL in "http://127.0.0.1/dvwa/" "http://127.0.0.1/dvwa/login.php" "http://127.0.0.1/pikachu/" "http://127.0.0.1/pikachu/vul/burteforce/bf_form.php" "http://127.0.0.1/sqli-labs/" "http://127.0.0.1:8081/" "http://127.0.0.1:8082/" "http://127.0.0.1:8080/"; do
  CODE=$(curl -s -o /tmp/.rc -w "%{http_code}" --max-time 12 "$URL" 2>&1 || echo 000)
  TITLE=$(grep -oE "<title>[^<]+</title>" /tmp/.rc 2>/dev/null | head -1 | cut -c1-100)
  FATAL=$(grep -oE "Fatal error|Access denied|Undefined constant|mysqli_sql_exception" /tmp/.rc 2>/dev/null | head -1)
  SZ=$(wc -c </tmp/.rc 2>/dev/null)
  TAG="✅"
  [ -n "$FATAL" ] && TAG="❌ $FATAL"
  [ "$CODE" = "000" ] && TAG="❌"
  [ -z "$TITLE" ] && TITLE="(size=${SZ})"
  printf "  $TAG HTTP=%-5s  %-55s  %s\n" "$CODE" "$URL" "$TITLE"
done

echo ""
echo "=== Step 7: 回归日志（最近 100 行 Apache error 里有没有 PHP Fatal）==="
FATAL_N=$($SUDO tail -80 /var/log/apache2/error.log 2>&1 | grep -c "Fatal error\|Access denied.*dvwa\|Undefined constant")
echo "  最近 80 行 error.log 致命错误数: $FATAL_N"
if [ "$FATAL_N" -gt 0 ]; then
  $SUDO tail -5 /var/log/apache2/error.log 2>&1 | grep -E "Fatal|Access|Undefined" | sed 's/^/    /'
else
  echo "    ✅ 无 Fatal error！回归通过"
fi
echo ""
echo "【最终用户登录信息】"
echo "   DVWA 登录地址： http://192.168.108.128/dvwa/login.php"
echo "   DVWA 默认账号： admin / password"
echo "   Pikachu 账号：自己点首页注册一个（或者用 admin/123456 试试）"
echo "   MariaDB 通用凭证（三靶场通）： $DBUSER / $DBPW  (IP $DBHOST 端口 $DBPORT)"
echo ""
echo "REPAIR_V2_DONE."
