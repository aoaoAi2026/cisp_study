#!/bin/bash
# Pikachu 配置：改 2 个 config.inc.php + 建库 + 触发 install.php + HTTP 验证
# 顺便修 SQLi-Labs challenges 库的 $dbname1
export KALI_PASS="kail"
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
SUDO="sudo"
PK=/var/www/html/pikachu
DBU=leet
DBP=leet123

# ------- 顺手修 SQLi-Labs challenges 库的 $dbname1 -------
echo "=== 修 SQLi-Labs challenges: \$dbname1 未定义问题 ==="
SL=/var/www/html/sqli-labs
CFGB="$SL/sql-connections/db-creds.inc"
# db-creds.inc 现在没定义 $dbname1，追加
grep -q "dbname1" "$CFGB" 2>/dev/null || {
  echo "define('DB_CHALLENGES','challenges'); \$dbname1='challenges';" | \
    $SUDO tee -a "$CFGB" >/dev/null
  echo "已追加 \$dbname1 定义到 db-creds.inc，最后 3 行:"
  tail -3 "$CFGB"
}
# 重新触发 setup-db.php 让 challenges 完整
echo "重新触发 setup-db.php:"
curl -sL --max-time 60 "http://127.0.0.1/sqli-labs/sql-connections/setup-db.php" 2>&1 | \
  grep -oiE "creating|challenge|success|error|fatal|created|purged" | sort -u | head -20 | awk '{print "   KEY: "$0}'
echo ""

# ------- 配置 Pikachu -------
echo "=== Pikachu: 写主配置 inc/config.inc.php ==="
CFG1="$PK/inc/config.inc.php"
$SUDO tee "$CFG1" >/dev/null <<C1
<?php
// Pikachu 主配置（Kali LAMP 版）
define('DB_HOST','127.0.0.1');
define('DB_USER','$DBU');
define('DB_PASSWORD','$DBP');
define('DB_NAME','pikachu');
define('DB_TYPE','mysql');
define('DB_CHARSET','utf8mb4');
define('REDIS_HOST','');
define('REDIS_PORT',6379);
C1
$SUDO chown www-data:www-data "$CFG1"
cat "$CFG1"
echo ""
echo "=== Pikachu: 写 PKXSS 平台配置 pkxss/inc/config.inc.php ==="
CFG2="$PK/pkxss/inc/config.inc.php"
$SUDO mkdir -p "$(dirname $CFG2)"
$SUDO tee "$CFG2" >/dev/null <<C2
<?php
// Pikachu PKXSS 跨站脚本管理平台 配置（Kali LAMP版）
// PKXSS 是 Pikachu 独立的小后台，复用同一账号
define('DB_HOST','127.0.0.1');
define('DB_USER','$DBU');
define('DB_PASSWORD','$DBP');
define('DB_NAME','pikachu');
define('DB_CHARSET','utf8mb4');
C2
$SUDO chown www-data:www-data "$CFG2"
cat "$CFG2"

echo ""
echo "=== 创建 pikachu 库（如果不存在） ==="
mariadb -h127.0.0.1 -u$DBU -p$DBP <<'SQL1'
CREATE DATABASE IF NOT EXISTS pikachu DEFAULT CHARACTER SET utf8mb4;
SHOW DATABASES LIKE 'pikachu';
SQL1

echo ""
echo "=== PHP 语法检查 ==="
php -l "$CFG1" 2>&1
php -l "$CFG2" 2>&1

echo ""
echo "=== 触发 Pikachu install.php（首次初始化建表 + 灌示例数据） ==="
# Pikachu install.php 一般会：PDO 连 DB → 建表 → 跳转到 index.php
for i in 1 2 3; do
  BODY=$(curl -sL --max-time 60 "http://127.0.0.1/pikachu/install.php" 2>&1)
  C=$(echo "$BODY" | wc -c)
  echo "触发 #$i  响应长度 = $C"
  echo "$BODY" | grep -oiE "数据库|表|创建|成功|初始化|install|表结构|导入|MySQL|PDO|连接|error|Warning|Fatal|pikachu" | sort -u | head -20 | awk '{print "   KEY: "$0}'
  sleep 2
done

echo ""
echo "=== pikachu 库的表列表 ==="
mariadb -h127.0.0.1 -u$DBU -p$DBP -e "
USE pikachu;
SHOW TABLES;
SELECT COUNT(*) AS total_tables FROM information_schema.tables WHERE table_schema='pikachu';
" 2>&1 | head -40

echo ""
echo "=== HTTP 健康检查（Pikachu 各模块）==="
CHK=(
  "首页|http://127.0.0.1/pikachu/"
  "SQL注入(GET数字型)|http://127.0.0.1/pikachu/vul/sqli/sqli_id.php?id=1"
  "SQL注入(POST字符型)|http://127.0.0.1/pikachu/vul/sqli/sqli_str.php"
  "XSS(反射型)|http://127.0.0.1/pikachu/vul/xss/xss_reflected_get.php?message=hello"
  "文件上传漏洞点|http://127.0.0.1/pikachu/vul/unsafeupload/uploads/"
  "命令执行(rce)|http://127.0.0.1/pikachu/vul/rce/rce_ping.php"
  "文件包含|http://127.0.0.1/pikachu/vul/fileinclude/fi_local.php?filename=file1.php"
  "PKXSS平台|http://127.0.0.1/pikachu/pkxss/index.php"
)
for item in "${CHK[@]}"; do
  name="${item%%|*}"; url="${item##*|}"
  C=$(curl -s -o /tmp/_pkb.html -w "%{http_code}" --max-time 15 "$url" || echo "000")
  # 如果是 302/301 可能有跳转
  KEYS=$(grep -oEi "vulnerability|皮卡丘|SQL|XSS|注入|pikachu|Pikachu|Dumb|admin|username|password|上传|文件|Warning|Fatal|error" /tmp/_pkb.html 2>/dev/null | sort -u | head -4 | paste -sd, -)
  [ -z "$KEYS" ] && KEYS="(无明显关键字)"
  echo "HTTP $C  $name"
  echo "   URL: $url"
  echo "   页面关键字: $KEYS"
done
rm -f /tmp/_pkb.html

echo ""
echo "=== 总结报告 ==="
echo "SQLi-Labs Less-1 实际查询（Dumb用户有没有数据？）:"
mariadb -h127.0.0.1 -u$DBU -p$DBP -e "
USE security;
SELECT id,username,password FROM users LIMIT 5;
SELECT COUNT(*) FROM users;
" 2>&1
echo ""
echo "双靶场都已启动。请在宿主机浏览器访问："
echo "  SQLi-Labs : http://192.168.108.128/sqli-labs/"
echo "  Pikachu   : http://192.168.108.128/pikachu/"
echo "  DVWA(保留): http://192.168.108.128:9111/"
echo "DONE."
