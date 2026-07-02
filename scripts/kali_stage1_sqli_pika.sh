#!/bin/bash
# ============================================================
# 阶段 1：修 Apache（Listen 80+9111，启用 rewrite）
# 阶段 2：部署 SQLi-Labs / Pikachu 到 /var/www/html 下
# ============================================================
export KALI_PASS="kail"
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
if ! sudo -n true 2>/dev/null; then echo "[FAIL] sudo fail"; exit 1; fi
SUDO="sudo"
SEP="========================================================"
WEB=/var/www/html
DBU="leet"
DBP="leet123"

echo "$SEP"
echo " 1/8 修复 Apache：ports.conf 同时监听 80+9111"
echo "$SEP"
# 先看现有的 ports.conf
echo "[-] 当前 ports.conf 监听配置:"
grep -nE "Listen|NameVirtualHost" /etc/apache2/ports.conf 2>/dev/null || echo "(不存在?)"

# 重写 ports.conf，同时监听 80 和 9111（兼容 DVWA 已占的 9111 和我们新的 80）
$SUDO tee /etc/apache2/ports.conf >/dev/null <<'PORTS'
# 同时监听 80（SQLi-Labs/Pikachu/默认） 和 9111（DVWA 保留）
Listen 0.0.0.0:80
Listen 0.0.0.0:9111

<IfModule ssl_module>
	Listen 443
</IfModule>

<IfModule mod_gnutls.c>
	Listen 443
</IfModule>
PORTS
echo "[OK] 已写入 ports.conf"
cat /etc/apache2/ports.conf

echo ""
echo "$SEP"
echo " 2/8 启用 rewrite + 确认 PHP8 模块 + AllowOverride All"
echo "$SEP"
# 启用 rewrite 模块（Kali 2026 模块名可能是 rewrite，不是 rewrite_module）
echo "[-] 所有可用 mods-available:"
ls /etc/apache2/mods-available/ 2>/dev/null | grep -iE "rewrite|php" | head -10
$SUDO a2enmod rewrite 2>&1 | tail -3
$SUDO a2enmod php8.4 2>&1 | tail -3
# 确认状态
$SUDO a2query -m rewrite 2>&1
$SUDO a2query -m php8.4 2>&1

# 全局 AllowOverride All（/etc/apache2/apache2.conf 中 <Directory /var/www/> 改成 AllowOverride All）
echo "[-] 更新 /etc/apache2/apache2.conf 中 Directory 配置:"
if [ -f /etc/apache2/apache2.conf ]; then
  # 替换 <Directory /var/www/> 下面 AllowOverride None -> All
  $SUDO python3 <<'PY'
import re
p = '/etc/apache2/apache2.conf'
with open(p,'r',encoding='utf-8',errors='ignore') as f:
    c = f.read()
# 在 <Directory /var/www/> ... </Directory> 块中，把 AllowOverride None 改成 AllowOverride All
def fix(m):
    return re.sub(r'(?im)^(\s*AllowOverride\s+)None', r'\1All', m.group(0))
c2 = re.sub(r'(?is)<Directory\s+/var/www/>.*?</Directory>', fix, c)
# 在 <Directory /> ... </Directory> 也把 AllowOverride None 改成 All 以防万一
def fix2(m):
    return re.sub(r'(?im)^(\s*AllowOverride\s+)None', r'\1All', m.group(0))
c2 = re.sub(r'(?is)<Directory\s*/>.*?</Directory>', fix2, c2)
with open(p,'w',encoding='utf-8') as f:
    f.write(c2)
PY
  # 验证
  echo "  /var/www/ AllowOverride 改为:"
  $SUDO python3 -c "
import re
with open('/etc/apache2/apache2.conf','r',errors='ignore') as f: c=f.read()
m=re.search(r'(?is)<Directory\s+/var/www/>.*?</Directory>', c)
print(m.group(0) if m else 'NOT FOUND')
"
fi

# 给所有靶场建独立的 conf
$SUDO tee /etc/apache2/conf-available/99-labs.conf >/dev/null <<'APACHECONF'
<Directory /var/www/html/>
    Options Indexes FollowSymLinks MultiViews
    AllowOverride All
    Require all granted
</Directory>

# SQLi-Labs 兼容配置（安全关闭，方便练习）
<Directory /var/www/html/sqli-labs/>
    php_flag display_errors On
    php_flag allow_url_include On
    php_flag allow_url_fopen On
    php_flag magic_quotes_gpc Off
    php_flag register_globals Off
    php_value error_reporting 32767
</Directory>

# Pikachu
<Directory /var/www/html/pikachu/>
    php_flag display_errors On
    php_flag allow_url_include On
    php_flag allow_url_fopen On
</Directory>

# Upload-Labs PHP 8 版本（放在80端口的 /upload-labs，供对比；XAMPP PHP5.6 在 81 端口放主环境）
<Directory /var/www/html/upload-labs/>
    php_flag display_errors On
    php_flag file_uploads On
    php_value upload_max_filesize 50M
    php_value post_max_size 50M
</Directory>
APACHECONF
$SUDO a2enconf 99-labs 2>&1 | tail -2

# 测试配置
$SUDO apache2ctl configtest 2>&1 | tail -3
# 重启
$SUDO systemctl restart apache2
sleep 3
echo "  service: $(sudo systemctl is-active apache2)"
echo "  端口监听:"
$SUDO ss -tlnp 2>/dev/null | grep apache2 || true

echo ""
echo "$SEP"
echo " 3/8 验证 80 / 9111 端口 HTTP 可达"
echo "$SEP"
for p in 80 9111; do
  C=$(curl -s -o /dev/null -w "HTTP %{http_code}" --max-time 5 http://127.0.0.1:$p/ 2>&1)
  echo "  127.0.0.1:$p  -> $C"
done

echo ""
echo "$SEP"
echo " 4/8 下载 SQLi-Labs 源码到 $WEB/sqli-labs/（Gitee PHP8 兼容优先）"
echo "$SEP"
# 先找一个 PHP8 兼容版本的 sqli-labs。SkyBluee/zhuifengshaonian233 fork 有 mysqli 版。
# 策略：1. gitee.com/zhuifengshaonian233/sqli-labs-php7  2. 官方 Audi-1
SL="$WEB/sqli-labs"
if [ -d "$SL" ]; then
  echo "[-] 目录已存在，备份重命名为 sqli-labs.old"
  $SUDO mv "$SL" "${SL}.old.$(date +%s)"
fi

TRY_LIST=(
  "https://gitee.com/zhuifengshaonian233/sqli-labs-php7.git|sqli-labs"
  "https://gitee.com/zyhsyz/sqli-labs-php7.git|sqli-labs"
  "https://gitee.com/mirrors/SQLi-Labs.git|SQLi-Labs"
  "https://github.com/Audi-1/sqli-labs.git|sqli-labs"
)

OK=0
for entry in "${TRY_LIST[@]}"; do
  url="${entry%%|*}"
  dir="${entry##*|}"
  echo "[-] 尝试: $url"
  if $SUDO git clone --depth 1 "$url" "$WEB/__tmp_sqli" 2>&1 | tail -5; then
    # 如果目录名不同，手动重命名
    $SUDO mv "$WEB/__tmp_sqli" "$SL"
    OK=1
    echo "[OK] 克隆成功 -> $SL"
    break
  fi
  $SUDO rm -rf "$WEB/__tmp_sqli" 2>/dev/null
done
if [ $OK -eq 0 ]; then
  echo "[FAIL] 所有克隆源都失败了，准备离线方式（见文末故障排查）"
  exit 2
fi
$SUDO chown -R www-data:www-data "$SL"
echo "  文件数: $(find $SL -name '*.php' | wc -l)  目录大小: $(du -sh $SL | cut -f1)"
ls "$SL" 2>/dev/null | head -20 | awk '{print "    "$0}'

echo ""
echo "$SEP"
echo " 5/8 SQLi-Labs：配置 DB 连接 + 写兼容层 + 初始化数据库"
echo "$SEP"
# 找 db-creds.inc
DB_INC=""
for p in sql-connections/db-creds.inc includes/db-creds.inc config/db-creds.inc; do
  [ -f "$SL/$p" ] && DB_INC="$SL/$p" && break
done
echo "  DB creds 文件位置: $DB_INC"
if [ -z "$DB_INC" ]; then
  # 自己造一个 sql-connections/
  $SUDO mkdir -p "$SL/sql-connections"
  DB_INC="$SL/sql-connections/db-creds.inc"
fi
$SUDO chmod 666 "$DB_INC" 2>/dev/null
# 写 db-creds.inc（同时兼容旧版 MySQL 常量和新版）
$SUDO tee "$DB_INC" >/dev/null <<CREDS
<?php
/* Kali LAMP 版 SQLi-Labs 数据库连接配置 */
\$host = '127.0.0.1';
\$dbuser = '$DBU';
\$dbpass = '$DBP';
\$dbname = 'security';

if (!defined('DB_HOST'))     define('DB_HOST', \$host);
if (!defined('DB_USER'))     define('DB_USER', \$dbuser);
if (!defined('DB_PASSWORD')) define('DB_PASSWORD', \$dbpass);
if (!defined('DB_NAME'))     define('DB_NAME', \$dbname);
CREDS
echo "[OK] 写入 $DB_INC 内容:"
cat "$DB_INC"

# 检测是否包含老版 mysql_* 调用（如果是 PHP7 版 fork，应该用的是 mysqli_*，就不用 shim）
SHIM_NEEDED=0
if grep -rEl "mysql_(connect|select_db|query|fetch_array|num_rows|error|real_escape_string)" "$SL" --include="*.php" 2>/dev/null | head -1 | grep -q .; then
  SHIM_NEEDED=1
  echo "  -> 检测到老版 mysql_* 调用，需要写 mysqli 兼容层"
else
  echo "  -> 源码已是 mysqli 版，不需 shim，PHP8.4 直接可用 ✅"
fi

if [ $SHIM_NEEDED -eq 1 ]; then
  # 写 mysql -> mysqli 兼容 shim，并通过 php.ini auto_prepend_file 让所有 PHP 文件自动加载（最简单，不用一个个改）
  SHIMFILE="$SL/sql-connections/mysql2mysqli_shim.php"
  $SUDO tee "$SHIMFILE" >/dev/null <<'SHIM'
<?php
# 把 SQLi-Labs 用到的 mysql_*() 函数重写成 mysqli_*()，面向全局单连接
$__mysql_link = null;
function __ms_c(){
  global $__mysql_link, $host, $dbuser, $dbpass;
  if (!$__mysql_link) {
    @include __DIR__ . '/db-creds.inc';
    $GLOBALS['dbuser'] = $GLOBALS['dbuser'] ?? (defined('DB_USER')?DB_USER:'leet');
    $GLOBALS['dbpass'] = $GLOBALS['dbpass'] ?? (defined('DB_PASSWORD')?DB_PASSWORD:'leet123');
    $GLOBALS['host']   = $GLOBALS['host']   ?? (defined('DB_HOST')?DB_HOST:'127.0.0.1');
    $GLOBALS['dbname'] = $GLOBALS['dbname'] ?? (defined('DB_NAME')?DB_NAME:'security');
    $__mysql_link = @mysqli_connect($GLOBALS['host'],$GLOBALS['dbuser'],$GLOBALS['dbpass']);
    if (!$__mysql_link) { $__mysql_link = @mysqli_connect('127.0.0.1','leet','leet123'); }
    if ($__mysql_link) { @mysqli_select_db($__mysql_link, $GLOBALS['dbname']); @mysqli_query($__mysql_link,"SET NAMES utf8"); }
  }
  return $__mysql_link;
}
if (!function_exists('mysql_connect')) {
  function mysql_connect($h='',$u='',$p=''){ $GLOBALS['__mysql_link']=@mysqli_connect($h,$u,$p); return $GLOBALS['__mysql_link']; }
  function mysql_select_db($n,$l=null){ return @mysqli_select_db($l??$GLOBALS['__mysql_link']??__ms_c(),$n); }
  function mysql_query($q,$l=null){     return @mysqli_query($l??$GLOBALS['__mysql_link']??__ms_c(),$q); }
  function mysql_fetch_array($r,$t=MYSQLI_BOTH){ return @mysqli_fetch_array($r,$t); }
  function mysql_fetch_row($r){         return @mysqli_fetch_row($r); }
  function mysql_fetch_assoc($r){       return @mysqli_fetch_assoc($r); }
  function mysql_fetch_object($r){      return @mysqli_fetch_object($r); }
  function mysql_num_rows($r){          return @mysqli_num_rows($r); }
  function mysql_affected_rows($l=null){return @mysqli_affected_rows($l??$GLOBALS['__mysql_link']); }
  function mysql_insert_id($l=null){    return @mysqli_insert_id($l??$GLOBALS['__mysql_link']); }
  function mysql_error($l=null){        return @mysqli_error($l??$GLOBALS['__mysql_link']??__ms_c()); }
  function mysql_errno($l=null){        return @mysqli_errno($l??$GLOBALS['__mysql_link']); }
  function mysql_real_escape_string($s,$l=null){ return @mysqli_real_escape_string($l??$GLOBALS['__mysql_link']??__ms_c(),$s); }
  function mysql_close($l=null){        return $l?@mysqli_close($l):true; }
  function mysql_ping($l=null){         $l=$l??$GLOBALS['__mysql_link']; return $l?@mysqli_ping($l):false; }
  function mysql_data_seek($r,$n){      return @mysqli_data_seek($r,$n); }
  function mysql_free_result($r){       return @mysqli_free_result($r); }
  function mysql_result($r,$row,$f=0){  @mysqli_data_seek($r,$row); $x=@mysqli_fetch_array($r); return $x[$f] ?? null; }
  function mysql_client_encoding($l=null){ return @mysqli_character_set_name($l??$GLOBALS['__mysql_link']); }
  if (!defined('MYSQL_BOTH'))  define('MYSQL_BOTH',  MYSQLI_BOTH);
  if (!defined('MYSQL_ASSOC')) define('MYSQL_ASSOC', MYSQLI_ASSOC);
  if (!defined('MYSQL_NUM'))   define('MYSQL_NUM',   MYSQLI_NUM);
}
SHIM
  echo "[OK] 写好 shim -> $SHIMFILE"

  # 方法：在 sqli-labs 目录放一个 .user.ini （CGI/FPM/PHP-CLI 模式支持），或在 PHP conf.d 设置 auto_prepend_file
  # 因为 Kali 2026 apache2 用 libapache2-mod-php8.4，它对 .user.ini 支持是 PHP_INI_PERDIR。
  # 双保险：1. .user.ini   2. 给每个 include 最常见的 db-creds.inc 第一行加 require_once
  echo "auto_prepend_file = $SHIMFILE" | $SUDO tee "$SL/.user.ini" >/dev/null
  $SUDO chown www-data:www-data "$SL/.user.ini"
  # 在 db-creds.inc 顶部再加一行（双重保险）
  $SUDO sed -i "1i <?php require_once __DIR__ . '/mysql2mysqli_shim.php'; ?>" "$DB_INC"
  # 去掉重复的 <?php
  echo "  db-creds.inc 前 5 行:"
  head -5 "$DB_INC"
fi

# 初始化数据库：先 curl 访问 setup-db.php；不行再手动
echo "[-] 初始化 security / challenges 数据库..."
mariadb -h127.0.0.1 -u$DBU -p$DBP <<'DBINIT'
CREATE DATABASE IF NOT EXISTS security DEFAULT CHARACTER SET utf8mb4;
CREATE DATABASE IF NOT EXISTS challenges DEFAULT CHARACTER SET utf8mb4;
SHOW DATABASES;
DBINIT

# 触发 setup
for page in setup-db.php setup.php; do
  [ -f "$SL/$page" ] || continue
  echo "  -> 触发: /sqli-labs/$page"
  OUT=$(curl -sL --max-time 30 "http://127.0.0.1/sqli-labs/$page" 2>&1)
  C=$(echo "$OUT" | wc -c)
  echo "     响应长度: $C"
  echo "$OUT" | grep -oiE "database|has been reset|created|error" | sort -u | head -10 | awk '{print "     关键字: "$0}'
done

echo "[-] 检查 security 库是否有 users 表:"
mariadb -h127.0.0.1 -u$DBU -p$DBP -e "SHOW TABLES FROM security;" 2>&1 | head -20

echo ""
echo "$SEP"
echo " 6/8 下载 Pikachu 到 $WEB/pikachu/"
echo "$SEP"
PK="$WEB/pikachu"
if [ -d "$PK" ]; then $SUDO mv "$PK" "${PK}.old.$(date +%s)"; fi

PK_SOURCES=(
  "https://gitee.com/zhuifengshaonian233/pikachu.git"
  "https://gitee.com/mirrors/pikachu.git"
  "https://gitee.com/songboy/pikachu.git"
  "https://github.com/zhuifengshaonianhanlu/pikachu.git"
)
OK2=0
for url in "${PK_SOURCES[@]}"; do
  echo "[-] 尝试: $url"
  if $SUDO git clone --depth 1 "$url" "$WEB/__tmp_pika" 2>&1 | tail -5; then
    $SUDO mv "$WEB/__tmp_pika" "$PK"
    OK2=1
    break
  fi
  $SUDO rm -rf "$WEB/__tmp_pika" 2>/dev/null
done
if [ $OK2 -eq 0 ]; then echo "[FAIL] Pikachu 全部源失败"; exit 3; fi
$SUDO chown -R www-data:www-data "$PK"
echo "  PHP 文件数: $(find $PK -name '*.php' | wc -l)  目录大小: $(du -sh $PK | cut -f1)"
ls "$PK" 2>/dev/null | head -20 | awk '{print "    "$0}'

echo ""
echo "$SEP"
echo " 7/8 Pikachu：创建数据库 + 修改 inc/config.inc.php + 初始化"
echo "$SEP"
# 找配置文件
PKCFG=""
for p in inc/config.inc.php pkx/config.inc.php config/config.inc.php; do
  [ -f "$PK/$p" ] && PKCFG="$PK/$p" && break
done
if [ -z "$PKCFG" ]; then
  # 没找到，Pikachu 官方项目里有个 install.php 来创建，用默认路径
  if [ -f "$PK/install.php" ]; then
    echo "  发现 install.php"
    PKCFG="$PK/inc/config.inc.php"
  else
    echo "[FAIL] 找不到 config 文件"
    exit 4
  fi
fi
echo "  使用配置文件: $PKCFG"

# 创建 pikachu 库
mariadb -h127.0.0.1 -u$DBU -p$DBP <<'PKDB'
CREATE DATABASE IF NOT EXISTS pikachu DEFAULT CHARACTER SET utf8mb4;
SHOW DATABASES LIKE 'pikachu';
PKDB

# 写入/覆盖配置
$SUDO mkdir -p "$(dirname $PKCFG)"
$SUDO tee "$PKCFG" >/dev/null <<PKCONF
<?php
// Pikachu Kali 版数据库配置
define('DB_HOST','127.0.0.1');
define('DB_USER','$DBU');
define('DB_PASSWORD','$DBP');
define('DB_NAME','pikachu');
// Redis（可选，没装就留空）
define('REDIS_HOST','');
define('REDIS_PORT','6379');
PKCONF
echo "[OK] 写入 $PKCFG"
cat "$PKCFG"

# 触发安装 install.php / 初始化
for initp in install.php index.php; do
  [ -f "$PK/$initp" ] || continue
  echo "  -> 触发: /pikachu/$initp"
  OUT=$(curl -sL --max-time 30 "http://127.0.0.1/pikachu/$initp" 2>&1)
  C=$(echo "$OUT" | wc -c)
  echo "     响应长度 $C, HTTP code: $(curl -s -o /dev/null -w '%{http_code}' --max-time 20 http://127.0.0.1/pikachu/$initp)"
  # 有关键字就打出来
  echo "$OUT" | grep -oiE "pikachu|install|数据库|表|创建|成功|初始化|MySQL|charset|PDO|error" | sort -u | head -20 | awk '{print "     关键字: "$0}'
done
echo "[-] pikachu 库的表:"
mariadb -h127.0.0.1 -u$DBU -p$DBP -e "SHOW TABLES FROM pikachu;" 2>&1 | head -30

echo ""
echo "$SEP"
echo " 8/8 HTTP 健康检查 & 最终汇总"
echo "$SEP"
declare -A CHK=(
  ["sqli-labs 首页"]="http://127.0.0.1/sqli-labs/"
  ["sqli-labs Less-1 注入"]="http://127.0.0.1/sqli-labs/Less-1/?id=1"
  ["pikachu 首页"]="http://127.0.0.1/pikachu/"
  ["pikachu SQL注入 GET"]="http://127.0.0.1/pikachu/vul/sqli/sqli_id.php?id=1"
  ["Apache 80 根目录"]="http://127.0.0.1/"
  ["DVWA 9111 端口（之前）"]="http://127.0.0.1:9111/"
  ["Vulhub Tomcat 8080"]="http://127.0.0.1:8080/"
)
for name in "${!CHK[@]}"; do
  url="${CHK[$name]}"
  C=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>&1 || true)
  echo "  $name => HTTP $C"
done

echo ""
echo "========== ①② SQLi-Labs + Pikachu 部署报告 =========="
echo "代码目录:"
echo "  SQLi-Labs : $SL"
echo "  Pikachu   : $PK"
echo "访问地址（宿主机浏览器即可打开）:"
echo "  SQLi-Labs : http://192.168.108.128/sqli-labs/"
echo "  Less-1 测试: http://192.168.108.128/sqli-labs/Less-1/?id=1"
echo "  Pikachu   : http://192.168.108.128/pikachu/"
echo "  Pikachu SQL注入 GET: http://192.168.108.128/pikachu/vul/sqli/sqli_id.php?id=1"
echo "数据库账号（两靶场共用）: 127.0.0.1:3306 / leet / leet123"
echo "  - security   (SQLi-Labs 默认库)"
echo "  - challenges (SQLi-Labs 闯关库)"
echo "  - pikachu    (Pikachu 库)"
echo "Apache 监听: $(sudo ss -tlnp 2>/dev/null | grep apache2 | awk '{print $4}' | paste -sd, -)"
echo "DVWA 仍在: http://192.168.108.128:9111/ （原端口保留不受影响）"
echo "DONE."
