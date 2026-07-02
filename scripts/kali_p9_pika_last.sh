#!/bin/bash
# 修 Pikachu 最后一个 MYSQL_ASSOC 常量
export KALI_PASS="kail"
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
SUDO="sudo"
PK=/var/www/html/pikachu

# 在 inc/config.inc.php 顶部追加 PHP 兼容常量（MYSQL_ASSOC/ NUM/ BOTH）
CFG="$PK/inc/config.inc.php"
grep -q "MYSQL_ASSOC" "$CFG" 2>/dev/null || {
  $SUDO sed -i "10a\\\n// 🏷️ PHP 8 兼容：老版本 PHP mysql_* 系列的 fetch 常量，PHP 7+ 已移除但老代码仍在用\nif (!defined('MYSQL_BOTH'))  define('MYSQL_BOTH',  MYSQLI_BOTH);\nif (!defined('MYSQL_ASSOC')) define('MYSQL_ASSOC', MYSQLI_ASSOC);\nif (!defined('MYSQL_NUM'))   define('MYSQL_NUM',   MYSQLI_NUM);\n" "$CFG"
}
head -20 "$CFG"
echo ""
echo "--- 复检：抓 CSRF GET 编辑页 ---"
curl -s --max-time 10 "http://127.0.0.1/pikachu/vul/csrf/csrfget/csrf_get_edit.php" -o /tmp/pk_csrf.html 2>&1
FC=$(grep -cEi "Fatal error|Uncaught|Undefined constant" /tmp/pk_csrf.html 2>/dev/null || echo 0)
echo "FATAL: $FC"
[ "$FC" -gt 0 ] && grep -iE "Fatal error|Uncaught|Undefined" /tmp/pk_csrf.html | head -3 | sed 's/<[^>]*>//g' | awk '{print "   ERR: "$0}'
echo "--- 页面关键字 ---"
grep -oEi "username|password|pikachu|vince|token|submit" /tmp/pk_csrf.html 2>/dev/null | sort -u | head -5
rm -f /tmp/pk_csrf.html
echo "DONE."
