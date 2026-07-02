#!/bin/bash
# SQLi-Labs 数据库配置 + SHIM + 初始化库
export KALI_PASS="kail"
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
SUDO="sudo"
WEB=/var/www/html
SL="$WEB/sqli-labs"
DBU="leet"
DBP="leet123"
DB_INC=""
for p in sql-connections/db-creds.inc includes/db-creds.inc config/db-creds.inc sqlconn/db-creds.inc; do
  [ -f "$SL/$p" ] && DB_INC="$SL/$p" && break
done
if [ -z "$DB_INC" ]; then
  # 官方原版一般在 sql-connections/
  mkdir -p "$SL/sql-connections"
  DB_INC="$SL/sql-connections/db-creds.inc"
fi
echo "DB creds file: $DB_INC"

$SUDO tee "$DB_INC" >/dev/null <<CREDS
<?php
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
echo "--- db-creds.inc ---"; cat "$DB_INC"

# --- 写 mysql -> mysqli 兼容 SHIM ---
SHIM="$SL/sql-connections/mysql2mysqli.php"
$SUDO tee "$SHIM" >/dev/null <<'SHIMPHP'
<?php
$__ms_l = null;
function __ms_link(){
  global $__ms_l, $host, $dbuser, $dbpass, $dbname;
  if($__ms_l) return $__ms_l;
  @include __DIR__.'/db-creds.inc';
  $dbuser = $dbuser ?? (defined('DB_USER')?DB_USER:'leet');
  $dbpass = $dbpass ?? (defined('DB_PASSWORD')?DB_PASSWORD:'leet123');
  $host   = $host   ?? (defined('DB_HOST')?DB_HOST:'127.0.0.1');
  $dbname = $dbname ?? (defined('DB_NAME')?DB_NAME:'security');
  $__ms_l = @mysqli_connect($host,$dbuser,$dbpass);
  if(!$__ms_l){ $__ms_l = @mysqli_connect('127.0.0.1','leet','leet123'); }
  if($__ms_l){ @mysqli_select_db($__ms_l,$dbname); @mysqli_query($__ms_l,'SET NAMES utf8'); }
  return $__ms_l;
}
if(!function_exists('mysql_connect')){
  function mysql_connect($h='',$u='',$p=''){ $GLOBALS['__ms_l']=@mysqli_connect($h,$u,$p); return $GLOBALS['__ms_l']; }
  function mysql_select_db($n,$l=null){ return @mysqli_select_db($l??$GLOBALS['__ms_l']??__ms_link(),$n); }
  function mysql_query($q,$l=null){ return @mysqli_query($l??$GLOBALS['__ms_l']??__ms_link(),$q); }
  function mysql_fetch_array($r,$t=MYSQLI_BOTH){ return @mysqli_fetch_array($r,$t); }
  function mysql_fetch_row($r){ return @mysqli_fetch_row($r); }
  function mysql_fetch_assoc($r){ return @mysqli_fetch_assoc($r); }
  function mysql_fetch_object($r){ return @mysqli_fetch_object($r); }
  function mysql_num_rows($r){ return @mysqli_num_rows($r); }
  function mysql_affected_rows($l=null){ return @mysqli_affected_rows($l??$GLOBALS['__ms_l']); }
  function mysql_insert_id($l=null){ return @mysqli_insert_id($l??$GLOBALS['__ms_l']); }
  function mysql_error($l=null){ return @mysqli_error($l??$GLOBALS['__ms_l']??__ms_link()); }
  function mysql_errno($l=null){ return @mysqli_errno($l??$GLOBALS['__ms_l']); }
  function mysql_real_escape_string($s,$l=null){ return @mysqli_real_escape_string($l??$GLOBALS['__ms_l']??__ms_link(),$s); }
  function mysql_close($l=null){ return $l?@mysqli_close($l):true; }
  function mysql_ping($l=null){ $l=$l??$GLOBALS['__ms_l']; return $l?@mysqli_ping($l):false; }
  function mysql_data_seek($r,$n){ return @mysqli_data_seek($r,$n); }
  function mysql_free_result($r){ return @mysqli_free_result($r); }
  function mysql_result($r,$row,$f=0){ @mysqli_data_seek($r,$row); $x=@mysqli_fetch_array($r); return $x[$f] ?? null; }
  function mysql_client_encoding($l=null){ return @mysqli_character_set_name($l??$GLOBALS['__ms_l']); }
  function mysql_get_server_info($l=null){ return @mysqli_get_server_info($l??$GLOBALS['__ms_l']); }
  function mysql_thread_id($l=null){ return @mysqli_thread_id($l??$GLOBALS['__ms_l']); }
  function mysql_list_dbs($l=null){ return @mysqli_query($l??__ms_link(),'SHOW DATABASES'); }
  if(!defined('MYSQL_BOTH'))  define('MYSQL_BOTH',  MYSQLI_BOTH);
  if(!defined('MYSQL_ASSOC')) define('MYSQL_ASSOC', MYSQLI_ASSOC);
  if(!defined('MYSQL_NUM'))   define('MYSQL_NUM',   MYSQLI_NUM);
}
SHIMPHP
$SUDO chown www-data:www-data "$SHIM"
echo ""
echo "SHIM 写好: $SHIM"

# 双重注入：1) db-creds.inc 顶部第一行先 require shim  2) PHP .user.ini  auto_prepend_file
# ------ 1. 改 db-creds.inc 顶部
$SUDO python3 - <<PY
p='$DB_INC'
with open(p,'r',encoding='utf-8',errors='ignore') as f: c=f.read()
if 'mysql2mysqli.php' not in c:
    c="<?php require_once __DIR__ . '/mysql2mysqli.php'; ?>\n" + c.lstrip('<?php').lstrip()
with open(p,'w',encoding='utf-8') as f: f.write(c)
PY
echo "--- db-creds.inc 顶部 5 行 (已注入 shim) ---"
head -5 "$DB_INC"
# ------ 2. .user.ini 在 sqli-labs 根目录（Apache mod_php 对 PERDIR 模式支持 .user.ini auto_prepend）
UINI="$SL/.user.ini"
echo "auto_prepend_file = $SHIM" | $SUDO tee "$UINI" >/dev/null
$SUDO chown www-data:www-data "$UINI"
echo ""
echo "--- .user.ini ---"; cat "$UINI"

# ------ 3. 创建 security 库 + 触发 setup-db.php（让官方 SQL 文件跑起来建 users/emails 等表）
echo ""
echo "--- DB 初始化 ---"
mariadb -h127.0.0.1 -u$DBU -p$DBP <<'EOF'
CREATE DATABASE IF NOT EXISTS security DEFAULT CHARACTER SET utf8mb4;
CREATE DATABASE IF NOT EXISTS challenges DEFAULT CHARACTER SET utf8mb4;
SHOW DATABASES;
EOF
echo ""
SETUPP=""
for p in setup-db.php setup.php sql-connections/setup-db.php; do
  [ -f "$SL/$p" ] && SETUPP="$p" && break
done
echo "Setup page: $SETUPP"
if [ -n "$SETUPP" ]; then
  for i in 1 2 3; do
    OUT=$(curl -sL --max-time 60 "http://127.0.0.1/sqli-labs/$SETUPP" 2>&1)
    echo "触发 #$i  长度=$(echo "$OUT" | wc -c)"
    echo "$OUT" | grep -oiE "database|reset|created|purge|old database|security|error" | sort -u | head -15 | awk '{print "   KEY: "$0}'
    sleep 2
  done
fi
echo ""
echo "--- security 库的表 ---"
mariadb -h127.0.0.1 -u$DBU -p$DBP -e "SHOW TABLES FROM security;" 2>&1 | head -20
echo ""
echo "--- HTTP 健康检查 ---"
for u in \
  "http://127.0.0.1/sqli-labs/" \
  "http://127.0.0.1/sqli-labs/Less-1/?id=1" \
  "http://127.0.0.1/sqli-labs/Less-2/?id=1" \
  "http://127.0.0.1/sqli-labs/Less-11/?uname=admin&passwd=123&submit=Submit"; do
  C=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$u" 2>&1 || true)
  TXT=$(curl -s --max-time 15 "$u" 2>/dev/null)
  echo "$C  $u"
  echo "$TXT" | grep -oiE "Your Login name|Dumb|Angelina|Warning|Fatal error|SQL syntax|Welcome|Username" | sort -u | head -5 | awk '{print "   -> "$0}'
done
echo "DONE."
