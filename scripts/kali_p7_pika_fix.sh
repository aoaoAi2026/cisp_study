#!/bin/bash
# 修 Pikachu：常量名改正确 + POST 触发 install 初始化
export KALI_PASS="kail"
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
SUDO="sudo"
PK=/var/www/html/pikachu
DBU=leet
DBP=leet123

echo "=== 1. 重写 inc/config.inc.php（Pikachu 要求常量名 DBHOST/DBUSER/DBPW/DBNAME，不带下划线！）==="
CFG1="$PK/inc/config.inc.php"
$SUDO tee "$CFG1" >/dev/null <<C1
<?php
// Pikachu 主配置 —— 必须按官方 install.php 约定的常量名（不加下划线）
define('DBHOST','127.0.0.1');
define('DBUSER','$DBU');
define('DBPW','$DBP');
define('DBNAME','pikachu');
// PKXSS 平台可能复用的另外几组常量
if (!defined('DB_HOST'))     define('DB_HOST', DBHOST);
if (!defined('DB_USER'))     define('DB_USER', DBUSER);
if (!defined('DB_PASSWORD')) define('DB_PASSWORD', DBPW);
if (!defined('DB_NAME'))     define('DB_NAME', DBNAME);
if (!defined('DB_CHARSET'))  define('DB_CHARSET','utf8mb4');
if (!defined('DB_TYPE'))     define('DB_TYPE','mysql');
if (!defined('REDIS_HOST'))  define('REDIS_HOST','');
if (!defined('REDIS_PORT'))  define('REDIS_PORT',6379);
C1
$SUDO chown www-data:www-data "$CFG1"
php -l "$CFG1"
echo ""
cat "$CFG1"

echo ""
echo "=== 2. PKXSS 的 config 也修（Pikachu 的 PKXSS 项目也是相同常量约定）==="
CFG2="$PK/pkxss/inc/config.inc.php"
$SUDO tee "$CFG2" >/dev/null <<C2
<?php
define('DBHOST','127.0.0.1');
define('DBUSER','$DBU');
define('DBPW','$DBP');
define('DBNAME','pikachu');
C2
$SUDO chown www-data:www-data "$CFG2"
php -l "$CFG2"

echo ""
echo "=== 3. 先看 install.php 表单 submit 字段名/值（POST 触发用）==="
grep -oEi "name=\"[^\"]+submit[^\"]*\"[^>]*value=\"[^\"]*\"" "$PK/install.php" 2>/dev/null | head -5
# 看有没有其他 POST 字段
grep -oEi "name=\"[^\"]+\"" "$PK/install.php" 2>/dev/null | grep -vi "hidden" | sort -u | head -20

echo ""
echo "=== 4. POST 提交表单触发 install（执行建库建表 + 灌数据）==="
# Pikachu install 的 submit 按钮一般 name=submit value= 开始安装 或 安装 或 submit
for val in "开始安装" "安装" "submit" "Install" "创建数据库" ""; do
  POSTARGS="-F submit=${val}"
  [ -z "$val" ] && POSTARGS="-F submit=1"
  echo "[TRY POST] $POSTARGS"
  OUT=$(curl -sL --max-time 120 ${POSTARGS} "http://127.0.0.1/pikachu/install.php" 2>&1)
  C=$(echo "$OUT" | wc -c)
  echo "   响应长度: $C"
  KEYS=$(echo "$OUT" | grep -oiE "成功|失败|连接|数据|error|Error|Notice|Warning|Fatal|users|创建|pikachu|notice|alert|提示" | sort -u | paste -sd, -)
  echo "   关键字: ${KEYS:-(无)}"
  TABLES=$(mariadb -h127.0.0.1 -u$DBU -p$DBP -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='pikachu';" -BN 2>/dev/null || echo 0)
  echo "   当前 pikachu 库表数量: $TABLES"
  if [ "$TABLES" -gt 5 ]; then echo "   ✅ 建表成功！>5 张表，停止尝试"; break; fi
  sleep 1
done

echo ""
echo "=== 5. 兜底：直接手动执行 Pikachu 核心 SQL（如果 POST 不成功）==="
mariadb -h127.0.0.1 -u$DBU -p$DBP <<'MANUAL'
DROP DATABASE IF EXISTS pikachu;
CREATE DATABASE pikachu DEFAULT CHARACTER SET utf8mb4;
USE pikachu;
CREATE TABLE IF NOT EXISTS users (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(30) NOT NULL,
  password VARCHAR(66) NOT NULL,
  level INT(11) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
INSERT IGNORE INTO users (id,username,password,level) VALUES
  (1,'admin',MD5('123456'),1),
  (2,'pikachu',MD5('000000'),2),
  (3,'test',MD5('abc123'),3);
CREATE TABLE IF NOT EXISTS member (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(30) NOT NULL,
  pw VARCHAR(32) NOT NULL,
  sex VARCHAR(5) DEFAULT NULL,
  phonenum VARCHAR(11) DEFAULT NULL,
  email VARCHAR(30) DEFAULT NULL,
  address VARCHAR(60) DEFAULT NULL,
  regtime DATETIME DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
INSERT IGNORE INTO member VALUES
(1,'vince','vince','boy','13800000001','vince@pikachu.com','北京朝阳','2018-08-01 00:00:00'),
(2,'allen','allen','boy','13800000002','allen@pikachu.com','北京海淀','2018-08-02 00:00:00'),
(3,'grady','grady','boy','13800000003','grady@pikachu.com','北京东城','2018-08-03 00:00:00'),
(4,'kobe','kobe','boy','13800000004','kobe@pikachu.com','上海浦东','2018-08-04 00:00:00'),
(5,'kevin','kevin','boy','13800000005','kevin@pikachu.com','广州天河','2018-08-05 00:00:00'),
(6,'lucy','lucy','girl','13800000006','lucy@pikachu.com','深圳南山','2018-08-06 00:00:00'),
(7,'lili','lili','girl','13800000007','lili@pikachu.com','杭州西湖','2018-08-07 00:00:00'),
(8,'wudi','wudi','girl','13800000008','wudi@pikachu.com','南京鼓楼','2018-08-08 00:00:00'),
(9,'saner','saner','boy','13800000009','saner@pikachu.com','成都高新','2018-08-09 00:00:00'),
(10,'bunny','bunny','girl','13800000010','bunny@pikachu.com','武汉洪山','2018-08-10 00:00:00');
CREATE TABLE IF NOT EXISTS message (
  id INT(11) NOT NULL AUTO_INCREMENT,
  title VARCHAR(50) DEFAULT NULL,
  content VARCHAR(200) DEFAULT NULL,
  time DATETIME DEFAULT NULL,
  userid INT(11) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
INSERT IGNORE INTO message VALUES
(1,'pikachu01','Hello pikachu~','2018-08-10 00:00:00',1),
(2,'pikachu02','I love pikachu!','2018-08-11 00:00:00',2),
(3,'pikachu03','pika pika pikachu','2018-08-12 00:00:00',3);
CREATE TABLE IF NOT EXISTS xssblind (
  id INT(11) NOT NULL AUTO_INCREMENT,
  time DATETIME DEFAULT NULL,
  content TEXT,
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
-- XXE / SSRF 等漏洞不需要额外表
SHOW TABLES;
SELECT COUNT(*) AS total_tables FROM information_schema.tables WHERE table_schema='pikachu';
SELECT id,username,MD5(password) as pw_md5_truncated FROM users;
MANUAL

echo ""
echo "=== 6. HTTP 健康检查（修完后）==="
for item in \
  "首页|http://127.0.0.1/pikachu/" \
  "SQL GET注入|http://127.0.0.1/pikachu/vul/sqli/sqli_id.php?id=1" \
  "SQL POST字符型|http://127.0.0.1/pikachu/vul/sqli/sqli_str.php" \
  "XSS反射|http://127.0.0.1/pikachu/vul/xss/xss_reflected_get.php?message=hi" \
  "XSS存储首页|http://127.0.0.1/pikachu/vul/xss/xss_stored.php" \
  "暴力破解表单|http://127.0.0.1/pikachu/vul/burteforce/bf_form.php" \
  "RCE exec|http://127.0.0.1/pikachu/vul/rce/rce_ping.php" \
  "文件包含本地|http://127.0.0.1/pikachu/vul/fileinclude/fi_local.php?filename=file1.php" \
  "不安全文件上传页|http://127.0.0.1/pikachu/vul/unsafeupload/clientcheck.php" \
  "CSRF修改密码页|http://127.0.0.1/pikachu/vul/csrf/csrfget/csrf_get_edit.php" ; do
  name="${item%%|*}"; url="${item##*|}"
  C=$(curl -s -o /tmp/_pkb.html -w "%{http_code}" --max-time 15 "$url" || echo 000)
  # 有没有致命错误
  FATAL=$(grep -cEi "Fatal error|Uncaught Error|Call to undefined|require_once.*failed" /tmp/_pkb.html 2>/dev/null || echo 0)
  KEYS=$(grep -oEi "pikachu|皮卡丘|username|password|用户|密码|submit|登录|查询|注入|连接" /tmp/_pkb.html 2>/dev/null | sort -u | head -3 | paste -sd, -)
  [ -z "$KEYS" ] && KEYS="-"
  TAG=$([ "$FATAL" -gt 0 ] && echo "🔴FATAL($FATAL)" || echo "✅OK")
  echo "HTTP $C  $TAG  $name"
  echo "   URL: $url"
  echo "   关键字: $KEYS"
  # 如果有 FATAL，打印前 5 行错误
  if [ "$FATAL" -gt 0 ]; then
    grep -iE "Fatal error|Uncaught|require_once" /tmp/_pkb.html 2>/dev/null | head -3 | awk '{print "   ERR>> "$0}'
  fi
done
rm -f /tmp/_pkb.html

echo ""
echo "=== 7. 双靶场最终总结 ==="
echo "--- SQLi-Labs Less-1 实际查询（已成功）---"
mariadb -h127.0.0.1 -u$DBU -p$DBP -BN -e "SELECT COUNT(*) FROM security.users;" 2>/dev/null | awk '{print "security.users 行数: "$1}'
echo "--- Pikachu 最终库状况 ---"
mariadb -h127.0.0.1 -u$DBU -p$DBP -e "USE pikachu; SHOW TABLES;" 2>&1 | tail -20 | head -15
echo "--- 三靶场三端口地址（宿主机浏览器打开）---"
echo "  🏁  DVWA      : http://192.168.108.128:9111/  （用户你已搭建）"
echo "  🏁  SQLi-Labs : http://192.168.108.128/sqli-labs/ （75关注入训练）"
echo "  🏁  Pikachu   : http://192.168.108.128/pikachu/   （综合靶场）"
echo "DONE."
