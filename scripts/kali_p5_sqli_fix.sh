#!/bin/bash
# 修 SQLi-Labs db-creds.inc（php标签搞坏了）+ 抓详细错误 + 建表兜底
export KALI_PASS="kail"
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
SUDO="sudo"
SL=/var/www/html/sqli-labs
DBU=leet
DBP=leet123
DB_INC=$SL/sql-connections/db-creds.inc
SHIM=$SL/sql-connections/mysql2mysqli.php

# 1. 完整重写 db-creds.inc：一个 <?php 标签，先引入 shim，再定义变量
$SUDO tee "$DB_INC" >/dev/null <<CREDS
<?php
// ===== Kali LAMP：先加载 mysql -> mysqli 兼容层（保证 PHP8 兼容）=====
require_once __DIR__ . '/mysql2mysqli.php';

// ===== 数据库连接参数 =====
\$host = '127.0.0.1';
\$dbuser = '$DBU';
\$dbpass = '$DBP';
\$dbname = 'security';

if (!defined('DB_HOST'))     define('DB_HOST', \$host);
if (!defined('DB_USER'))     define('DB_USER', \$dbuser);
if (!defined('DB_PASSWORD')) define('DB_PASSWORD', \$dbpass);
if (!defined('DB_NAME'))     define('DB_NAME', \$dbname);
CREDS
$SUDO chown www-data:www-data "$DB_INC"
echo "=== db-creds.inc（新）==="
cat "$DB_INC"
echo ""
echo "=== PHP 语法检查 ==="
php -l "$DB_INC" 2>&1
php -l "$SHIM" 2>&1

echo ""
echo "=== 直接用 CLI 测试连接（模拟 db-creds.inc）==="
php -r "
chdir('$SL/sql-connections');
require '$DB_INC';
\$link = @mysqli_connect(\$host, \$dbuser, \$dbpass);
if(!\$link){ echo 'CLI连接失败: ' . mysqli_connect_error() . PHP_EOL; exit(1);}
echo 'CLI连接成功! ' . mysqli_get_host_info(\$link) . PHP_EOL;
mysqli_select_db(\$link, 'information_schema');
\$r = mysqli_query(\$link, 'SELECT 1+1 AS s');
\$row = mysqli_fetch_row(\$r);
echo 'SELECT 1+1 = ' . \$row[0] . PHP_EOL;
"
echo ""

echo "=== 抓 Less-1/?id=1 完整错误 ==="
curl -s --max-time 15 "http://127.0.0.1/sqli-labs/Less-1/?id=1" 2>&1 | head -100
echo ""
echo "--- grep 错误关键字 ---"
curl -s --max-time 15 "http://127.0.0.1/sqli-labs/Less-1/?id=1" 2>&1 | grep -oiE "Fatal error|Uncaught|Warning|Error|on line|Call to|Your Login|Dumb|Angelina" | head -20

echo ""
echo "=== setup-db.php 完整输出（诊断建表报错）==="
curl -sL --max-time 30 "http://127.0.0.1/sqli-labs/sql-connections/setup-db.php" 2>&1 | head -200
echo ""
echo "--- setup 里的 SQL 文件（看官方准备了哪些 SQL）---"
ls $SL/sql-connections/*.sql 2>&1
find $SL -name "*.sql" -type f 2>&1 | head -20

echo ""
echo "=== 兜底：扫描所有 .sql 文件并在 security 库手动执行 ==="
# 先找官方 setup 时准备的 sql dump
for sqlf in $SL/sql-connections/*.sql $(find $SL -maxdepth 2 -name "*.sql" -type f 2>/dev/null); do
  [ -f "$sqlf" ] || continue
  echo "--- 找到: $sqlf (size=$(stat -c%s $sqlf 2>/dev/null)) ---"
  head -20 "$sqlf" 2>/dev/null | sed 's/^/   /'
  echo "..."
done
echo ""
# 最关键的 users / emails / referers / uagents 表如果不在，就自动建
echo "=== 在 security 库检查 users 表，不在就建 + 灌数据 ==="
mariadb -h127.0.0.1 -u$DBU -p$DBP security <<'USQL'
-- 如果 users 表不存在就建一个官方默认的 users 表（Less1-65 用的核心表）
CREATE TABLE IF NOT EXISTS users (
  id INT(3) NOT NULL AUTO_INCREMENT,
  username VARCHAR(20) NOT NULL,
  password VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 检查有没有数据
SELECT COUNT(*) as users_count FROM users;
USQL

echo ""
echo "=== 诊断表是否存在 security 库 ==="
mariadb -h127.0.0.1 -u$DBU -p$DBP -e "
USE security;
SHOW TABLES;
SELECT COUNT(*) AS cnt FROM information_schema.tables WHERE table_schema='security';
" 2>&1 | head -30

echo ""
echo "=== HTTP 最终检查（修完后）==="
for u in \
  "http://127.0.0.1/sqli-labs/" \
  "http://127.0.0.1/sqli-labs/Less-1/?id=1" \
  "http://127.0.0.1/sqli-labs/Less-2/?id=1" \
  "http://127.0.0.1/sqli-labs/Less-11/" ; do
  C=$(curl -s -o /tmp/_sl_body.html -w "%{http_code}" --max-time 15 "$u" || true)
  echo "HTTP $C  $u"
  grep -oEi "Your Login name|Dumb|Angelina|I Dumb|You are in|Fatal error|syntax|Warning|Username|Password" /tmp/_sl_body.html 2>/dev/null | sort -u | head -5 | awk '{print "   -> "$0}'
done
rm -f /tmp/_sl_body.html
echo "DONE."
