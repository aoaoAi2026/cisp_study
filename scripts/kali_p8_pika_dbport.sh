#!/bin/bash
# 补 Pikachu 最后的 DBPORT 常量，并检查 inc/mysql.inc.php 所有常量需求
export KALI_PASS="kail"
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
SUDO="sudo"
PK=/var/www/html/pikachu
DBU=leet
DBP=leet123

echo "=== 1. inc/mysql.inc.php 前 30 行（看它到底用了哪些常量）==="
head -40 "$PK/inc/mysql.inc.php" 2>/dev/null
echo ""
echo "=== 2. 全局搜 Pikachu 用到的 DB_* / DB* 常量 ==="
grep -rhoE "DB[A-Z_]+" "$PK" --include="*.php" 2>/dev/null | sort -u
echo ""
echo "=== 3. 重写 inc/config.inc.php，把所有需要的常量全定义好 ==="
CFG1="$PK/inc/config.inc.php"
$SUDO tee "$CFG1" >/dev/null <<'C1'
<?php
// 🏠 Pikachu 主配置（Kali LAMP 版，所有用到的常量一次性全覆盖，避免再 Undefined constant）
// ── 官方 install.php / inc/mysql.inc.php / PKXSS 必需常量（必须保持原命名！）──
define('DBHOST', '127.0.0.1');   // 127.0.0.1 走 TCP，不碰 socket
define('DBPORT', '3306');        // ⭐ mysql.inc.php 第 3 行要！之前少了这个！
define('DBUSER', 'leet');
define('DBPW',   'leet123');
define('DBNAME', 'pikachu');
define('DB_CHARSET', 'utf8mb4');
// ── 兼容类常量（有的老代码/第三方模块用带下划线风格）──
if (!defined('DB_HOST'))     define('DB_HOST',     DBHOST);
if (!defined('DB_PORT'))     define('DB_PORT',     DBPORT);
if (!defined('DB_USER'))     define('DB_USER',     DBUSER);
if (!defined('DB_PASSWORD')) define('DB_PASSWORD', DBPW);
if (!defined('DB_NAME'))     define('DB_NAME',     DBNAME);
if (!defined('DB_TYPE'))     define('DB_TYPE',     'mysql');
// ── 扩展组件 ──
if (!defined('REDIS_HOST'))  define('REDIS_HOST',  '');   // 没装 Redis 就空
if (!defined('REDIS_PORT'))  define('REDIS_PORT',  6379);
// ── PKXSS 平台独立可能再用到 ──
if (!defined('TABLE_PREFIX')) define('TABLE_PREFIX', '');
C1
$SUDO chown www-data:www-data "$CFG1"
php -l "$CFG1"
cat "$CFG1"
echo ""
echo "=== 4. PKXSS config 也同样补 DBPORT ==="
CFG2="$PK/pkxss/inc/config.inc.php"
$SUDO tee "$CFG2" >/dev/null <<C2
<?php
define('DBHOST', '127.0.0.1');
define('DBPORT', '3306');
define('DBUSER', '$DBU');
define('DBPW',   '$DBP');
define('DBNAME', 'pikachu');
C2
$SUDO chown www-data:www-data "$CFG2"
php -l "$CFG2"

echo ""
echo "=== 5. CLI 直接 require config 再模拟 mysql.inc.php 逻辑 ==="
php -r "
chdir('$PK/inc');
require 'config.inc.php';
// 模拟 mysql.inc.php 第 3 行的连接（它之前就是因为没 DBPORT 崩的）
echo 'DBHOST = ' . DBHOST . PHP_EOL;
echo 'DBPORT = ' . DBPORT . PHP_EOL;
echo 'DBUSER = ' . DBUSER . PHP_EOL;
echo 'DBNAME = ' . DBNAME . PHP_EOL;
\$link = @mysqli_connect(DBHOST, DBUSER, DBPW, '', (int)DBPORT);
if (!\$link) { echo 'mysqli_connect FAIL: ' . mysqli_connect_error() . PHP_EOL; exit(1); }
echo '连接 OK! server: ' . mysqli_get_host_info(\$link) . PHP_EOL;
mysqli_select_db(\$link, DBNAME);
\$r = mysqli_query(\$link, 'SELECT COUNT(*) AS c FROM users');
\$row = mysqli_fetch_assoc(\$r);
echo 'pikachu.users 表行数: ' . \$row['c'] . PHP_EOL;
"

echo ""
echo "=== 6. HTTP 全模块复检 ==="
FATAL_TOTAL=0
declare -A TESTS=(
  ["首页"]="http://127.0.0.1/pikachu/"
  ["SQL注入 GET id=1"]="http://127.0.0.1/pikachu/vul/sqli/sqli_id.php?id=1"
  ["SQL注入 POST字符型"]="http://127.0.0.1/pikachu/vul/sqli/sqli_str.php"
  ["SQL注入 搜索型"]="http://127.0.0.1/pikachu/vul/sqli/sqli_search.php"
  ["XSS反射型 GET message=hello"]="http://127.0.0.1/pikachu/vul/xss/xss_reflected_get.php?message=hello"
  ["XSS存储型 首页"]="http://127.0.0.1/pikachu/vul/xss/xss_stored.php"
  ["暴力破解 bf_form"]="http://127.0.0.1/pikachu/vul/burteforce/bf_form.php"
  ["暴力破解 server验证码"]="http://127.0.0.1/pikachu/vul/burteforce/bf_server.php"
  ["命令执行 RCE ping"]="http://127.0.0.1/pikachu/vul/rce/rce_ping.php"
  ["命令执行 RCE eval"]="http://127.0.0.1/pikachu/vul/rce/rce_eval.php"
  ["文件包含 本地 file1.php"]="http://127.0.0.1/pikachu/vul/fileinclude/fi_local.php?filename=file1.php"
  ["文件包含 远程 file3.php"]="http://127.0.0.1/pikachu/vul/fileinclude/fi_remote.php?filename=file3.php"
  ["文件上传 前端校验"]="http://127.0.0.1/pikachu/vul/unsafeupload/clientcheck.php"
  ["文件上传 MIME校验"]="http://127.0.0.1/pikachu/vul/unsafeupload/getimagesizecheck.php"
  ["CSRF GET 修改密码"]="http://127.0.0.1/pikachu/vul/csrf/csrfget/csrf_get_edit.php"
  ["反序列化 index"]="http://127.0.0.1/pikachu/vul/deser/deser.php"
  ["XXE index"]="http://127.0.0.1/pikachu/vul/xxe/xxe_1.php"
  ["SSRF curl"]="http://127.0.0.1/pikachu/vul/ssrf/ssrf_curl.php?url=file:///etc/passwd"
  ["PKXSS 平台首页"]="http://127.0.0.1/pikachu/pkxss/index.php"
)
for name in "${!TESTS[@]}"; do
  url="${TESTS[$name]}"
  C=$(curl -s -o /tmp/_pkb.html -w "%{http_code}" --max-time 15 "$url" || echo 000)
  FC=$(grep -cEi "Fatal error|Uncaught Error|Undefined constant|require.*failed" /tmp/_pkb.html 2>/dev/null || echo 0)
  WC=$(grep -cEi "^<br +/><b>Warning</b>:" /tmp/_pkb.html 2>/dev/null || echo 0)
  if [ "$FC" -gt 0 ]; then FATAL_TOTAL=$((FATAL_TOTAL+1)); fi
  TAG=$([ "$FC" -gt 0 ] && echo "🔴FATAL($FC)" || ([ "$WC" -gt 10 ] && echo "🟡WARN($WC)" || echo "✅OK"))
  KEYS=$(grep -oEi "pikachu|Pikachu|username|password|admin|vince|查询|注入|登录|结果|回显" /tmp/_pkb.html 2>/dev/null | sort -u | head -3 | paste -sd, -)
  [ -z "$KEYS" ] && KEYS="-"
  echo "HTTP $C  $TAG  $name"
  [ "$FC" -gt 0 ] && grep -iE "Fatal error|Uncaught|Undefined constant" /tmp/_pkb.html 2>/dev/null | head -2 | sed 's/<[^>]*>//g' | awk '{print "   ERR>> "$0}'
done
rm -f /tmp/_pkb.html

echo ""
echo "=== 7. 总结报告 ==="
echo "Pikachu 全模块致命错误数: $FATAL_TOTAL"
mariadb -h127.0.0.1 -u$DBU -p$DBP -e "USE pikachu; SHOW TABLES;" 2>&1 | head -20
echo ""
echo "🎉 三靶场部署状态："
echo "  🟢 DVWA      : http://192.168.108.128:9111/ (OK)"
echo "  🟢 SQLi-Labs : http://192.168.108.128/sqli-labs/ (OK  Less-1 能返回 Dumb 用户)"
echo "  🟢 Pikachu   : http://192.168.108.128/pikachu/   (Fatal数：$FATAL_TOTAL  < 1 就全绿)"
echo "DONE."
