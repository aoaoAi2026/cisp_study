#!/bin/bash
# 诊断 Pikachu 安装失败：抓 install.php 报错 + 检查 pdo_mysql 扩展
export KALI_PASS="kail"
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
SUDO="sudo"
PK=/var/www/html/pikachu

echo "=== 1. 检查 PHP 扩展：pdo / pdo_mysql / mysqli ==="
php -m 2>&1 | grep -iE "pdo|mysql|mysqli"
echo ""
php -r "var_dump(class_exists('PDO'), extension_loaded('pdo_mysql'), extension_loaded('mysqli'));" 2>&1
echo ""
echo "=== 2. 用 PHP CLI 试 PDO 连接（和 pikachu install 一样走 PDO）==="
php -r "
define('DB_HOST','127.0.0.1');
define('DB_USER','leet');
define('DB_PASSWORD','leet123');
define('DB_NAME','pikachu');
define('DB_CHARSET','utf8mb4');
\$dsn = 'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8mb4';
try{
  \$pdo = new PDO(\$dsn, DB_USER, DB_PASSWORD, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
  ]);
  echo 'PDO connect OK! ' . \$pdo->getAttribute(PDO::ATTR_SERVER_VERSION) . PHP_EOL;
  \$r = \$pdo->query('SELECT 1+1 AS s')->fetch();
  echo 'SELECT 1+1 = ' . var_export(\$r['s'], true) . PHP_EOL;
} catch (Exception \$e) {
  echo 'PDO FAIL: ' . \$e->getMessage() . PHP_EOL;
}
"
echo ""
echo "=== 3. 抓 install.php 前 200 行原始 HTML（看报错栈）==="
curl -sL --max-time 60 "http://127.0.0.1/pikachu/install.php" 2>&1 | head -200
echo ""
echo "=== 4. install.php 源码前 60 行（看逻辑）==="
head -60 "$PK/install.php" 2>/dev/null
echo ""
echo "=== 5. inc/function.php 或 common.php 里是否 require config ==="
find $PK -maxdepth 2 -name "*.php" | xargs grep -l "require.*config" 2>/dev/null | head -5
echo ""
echo "=== 6. inc/config.inc.php 现在内容 + 语法校验 ==="
php -l "$PK/inc/config.inc.php" 2>&1
head -25 "$PK/inc/config.inc.php"
echo ""
echo "=== 7. Apache 看有没有 pdo_mysql（mod_php8.4 要和 CLI 同样的扩展）==="
# 用 phpinfo() 临时看
echo '<?php phpinfo(INFO_MODULES); ?>' | $SUDO tee "$PK/_info.php" >/dev/null
sleep 1
INFO=$(curl -s --max-time 10 "http://127.0.0.1/pikachu/_info.php" 2>/dev/null)
echo "$INFO" | grep -oiE "pdo_mysql|pdo_mysql Support|enabled|disabled" | head -10
# 抓 mysqli 是否 enabled
echo "$INFO" | grep -oiE "Mysqli Support|mysqli.default_socket" | head -5
# 清掉 phpinfo 文件（防留风险）
$SUDO rm -f "$PK/_info.php"
echo ""
echo "DONE."
