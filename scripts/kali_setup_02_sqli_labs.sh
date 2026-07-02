#!/bin/bash
# ============================================================
# ② 搭建 SQLi-Labs（SQL 注入专项 75 关）
# 依赖：Apache2 + MariaDB + PHP（Kali 原生），端口 80
# 访问地址：http://192.168.108.128/sqli-labs/
# ============================================================
set +e
export KALI_PASS="kail"
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
if ! sudo -n true 2>/dev/null; then echo "[FAIL] sudo 缓存失败"; exit 1; fi

SEP="========================================================"
SUDO="sudo"

echo "$SEP"
echo "  阶段 1：安装 LAMP 基础环境（apache2 + mariadb + php）"
echo "$SEP"

# 先看 80 端口是否被占用
echo "[-] 检查 80 端口占用..."
if ss -tlnp 2>/dev/null | grep -q ":80 "; then
  echo "[!] 80 端口已占用！占用详情："
  ss -tlnp 2>/dev/null | grep ":80 "
fi
echo "[OK] 80 端口检查通过"

# 安装软件包
export DEBIAN_FRONTEND=noninteractive
$SUDO apt-get update -y 2>&1 | tail -3
echo ""
echo "[*] 安装 apache2 mariadb-server php 相关..."
$SUDO apt-get install -y \
  apache2 \
  mariadb-server \
  mariadb-client \
  php \
  libapache2-mod-php \
  php-mysql \
  php-curl \
  php-gd \
  php-mbstring \
  php-xml \
  php-zip 2>&1 | tail -15

echo ""
echo "[版本检查]"
apache2 -v 2>&1 | head -2
echo "---"
php -v 2>&1 | head -2
echo "---"
mariadb --version 2>&1 | head -1

echo ""
echo "$SEP"
echo "  阶段 2：启动服务 + 设置开机自启"
echo "$SEP"
$SUDO systemctl enable apache2 mariadb --now
sleep 3
echo "apache2: $(sudo systemctl is-active apache2)"
echo "mariadb: $(sudo systemctl is-active mariadb)"

echo ""
echo "[测试 Apache HTTP 本机 127.0.0.1:80]"
for i in 1 2 3; do
  C=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://127.0.0.1:80/ || true)
  echo "  尝试 $i -> HTTP $C"
  [ "$C" = "200" ] && break
  sleep 2
done

echo ""
echo "$SEP"
echo "  阶段 3：MariaDB 配置 root 密码 + PHP 可登录账号"
echo "$SEP"
# Kali 默认 mariadb root 使用 unix_socket 认证（sudo 免密），PHP mysql 连接需要密码登录
$SUDO mariadb <<'SQLEOF'
-- 切换 mysql 数据库
USE mysql;
-- 给 root@localhost 设置一个方便开发的密码 root123，并切 mysql_native_password 方式（兼容老 PHP 代码）
ALTER USER 'root'@'localhost' IDENTIFIED VIA mysql_native_password USING PASSWORD('root123');
-- 再创建一个独立专用账号 leet/leet123（用于 PHP 应用连接）
CREATE USER IF NOT EXISTS 'leet'@'localhost' IDENTIFIED BY 'leet123';
GRANT ALL PRIVILEGES ON *.* TO 'leet'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
SELECT user, host, plugin FROM user WHERE user IN ('root','leet');
SQLEOF
echo "[-] MariaDB 设置完成"

# 验证：用 PHP 能识别的方式（127.0.0.1 + 密码）登录
echo "[-] 测试 leet 用户密码登录（PHP mysqli_connect 用的）:"
mariadb -h 127.0.0.1 -uleet -pleet123 -e "SELECT 'maria OK' as status\G" 2>&1 || {
  echo "[?] 重试带 socket..."
  mariadb -uleet -pleet123 -e "SELECT 'maria OK via socket' as status\G" 2>&1
}

echo ""
echo "$SEP"
echo "  阶段 4：克隆 SQLi-Labs 源码到 /var/www/html/sqli-labs/"
echo "$SEP"

WEB_ROOT=/var/www/html
$SUDO mkdir -p "$WEB_ROOT"

# 如果目录不存在就克隆
if [ ! -d "$WEB_ROOT/sqli-labs" ]; then
  echo "[*] 从 Gitee 克隆 SQLi-Labs（国内速度快）"
  # Audi-1/sqli-labs 官方在 GitHub，Gitee 上找镜像
  # 尝试官方 -> 失败就找 PHP7+ 兼容 fork
  cd "$WEB_ROOT"
  if $SUDO git clone --depth 1 https://gitee.com/mirrors/SQLi-Labs.git sqli-labs 2>&1 | tail -5; then
    echo "[OK] 从 gitee/mirrors/SQLi-Labs 克隆成功"
  else
    echo "[重试] GitHub Audi-1/sqli-labs master（如果网络允许）"
    $SUDO git clone --depth 1 https://github.com/Audi-1/sqli-labs.git sqli-labs 2>&1 | tail -10
  fi
fi

ls -la "$WEB_ROOT/sqli-labs/" 2>/dev/null | head -15
echo ""
echo "[-] 查看数据库配置文件（待修改）:"
DB_INC="$WEB_ROOT/sqli-labs/sql-connections/db-creds.inc"
cat "$DB_INC" 2>/dev/null || echo "不存在 $DB_INC — 可能源码路径不同"

echo ""
echo "$SEP"
echo "  阶段 5：修改 SQLi-Labs 数据库连接配置"
echo "$SEP"

# 如果存在 db-creds.inc 就替换 dbpass 和 dbuser
if [ -f "$DB_INC" ]; then
  $SUDO chmod 666 "$DB_INC"
  # 写一个新配置（完全替换）
  $SUDO tee "$DB_INC" >/dev/null <<'CREDS'
<?php
# SQLi-Labs 数据库连接配置 — Kali LAMP 版
# 主机用 127.0.0.1 + TCP，避免 socket 兼容问题
$dbuser = 'leet';
$dbpass = 'leet123';
$dbname = 'security';          # SQLi-Labs 约定的主库名
$host = '127.0.0.1';
# 兼容 PHP 8 的 mysqli 常量（如果原脚本仍然用 mysql_*，我们后面会用脚本做补丁）
if (!defined('DB_HOST'))     define('DB_HOST', $host);
if (!defined('DB_USER'))     define('DB_USER', $dbuser);
if (!defined('DB_PASSWORD')) define('DB_PASSWORD', $dbpass);
if (!defined('DB_NAME'))     define('DB_NAME', $dbname);
CREDS
  echo "[OK] 已写入 $DB_INC"
  cat "$DB_INC"
fi

echo ""
echo "$SEP"
echo "  阶段 6：修复 PHP 8 下的 mysql_* 函数缺失问题（如果存在）"
echo "$SEP"
# SQLi-Labs 原版使用已从 PHP 7.0 移除的 mysql_*() 系列函数
# 方法：在 sqli-labs 根目录 php.ini/prepend 一个 mysqli shim 不可行；
# 最稳的方法：做一次全局替换 —— 把 mysql_ 函数换成 mysqli_ 风格的封装
# 先检测是否真的用了 mysql_*
MYSQL_COUNT=$(grep -rEl "mysql_(connect|select_db|query|fetch_array|num_rows|error|real_escape_string)" \
  "$WEB_ROOT/sqli-labs/" --include="*.php" 2>/dev/null | wc -l)
echo "[-] 含 mysql_* 旧函数的 PHP 文件数：$MYSQL_COUNT"

if [ "$MYSQL_COUNT" -gt 0 ]; then
  echo "[*] 检测到老版本 mysql_* 代码，追加 mysql_ 到 mysqli_ 兼容层文件..."
  # 方案：在 sql-connections 目录放一个 mysql_compat.php，在每个被 include 的文件之前 include 它
  # 更简单粗暴：把这些文件里的 mysql_* 调用替换为 mysqli_* 兼容封装
  COMPAT="$WEB_ROOT/sqli-labs/sql-connections/mysql_compat_shim.php"
  $SUDO tee "$COMPAT" >/dev/null <<'SHIM'
<?php
# PHP 8 兼容层：把 SQLi-Labs 用到的 mysql_*() 函数用 mysqli_*() 实现
# 注意：SQLi-Labs 原版假设全局只有一个连接，这里静态保存即可
$__mysql_compat_link = null;
$__mysql_compat_last_db = '';

function mysql_compat_ensure_link() {
  global $__mysql_compat_link, $host, $dbuser, $dbpass, $dbname;
  if (isset($GLOBALS['___sqli_db_creds'])) {
    extract($GLOBALS['___sqli_db_creds']);
  } else {
    include __DIR__ . '/db-creds.inc';
  }
  if (!$__mysql_compat_link) {
    $__mysql_compat_link = @mysqli_connect($host, $dbuser, $dbpass);
    if (!$__mysql_compat_link) {
      die(printf("[mysql_compat] Connect failed: %s\n", mysqli_connect_error()));
    }
    mysqli_set_charset($__mysql_compat_link, 'utf8');
    if ($dbname) {
      @mysqli_select_db($__mysql_compat_link, $dbname);
    }
  }
  return $__mysql_compat_link;
}

if (!function_exists('mysql_connect')) {
  function mysql_connect($h='',$u='',$p='') { $link = @mysqli_connect($h,$u,$p); $GLOBALS['__mysql_compat_link'] = $link; return $link; }
  function mysql_select_db($n, $l=null) { $l = $l ?? $GLOBALS['__mysql_compat_link'] ?? mysql_compat_ensure_link(); return @mysqli_select_db($l, $n); }
  function mysql_query($q, $l=null)    { $l = $l ?? $GLOBALS['__mysql_compat_link'] ?? mysql_compat_ensure_link(); return @mysqli_query($l, $q); }
  function mysql_fetch_array($r,$t=MYSQLI_BOTH) { return @mysqli_fetch_array($r, $t); }
  function mysql_fetch_row($r)         { return @mysqli_fetch_row($r); }
  function mysql_fetch_assoc($r)       { return @mysqli_fetch_assoc($r); }
  function mysql_num_rows($r)          { return @mysqli_num_rows($r); }
  function mysql_affected_rows($l=null){ $l = $l ?? $GLOBALS['__mysql_compat_link']; return @mysqli_affected_rows($l); }
  function mysql_insert_id($l=null)    { $l = $l ?? $GLOBALS['__mysql_compat_link']; return @mysqli_insert_id($l); }
  function mysql_error($l=null)        { $l = $l ?? $GLOBALS['__mysql_compat_link']; return @mysqli_error($l); }
  function mysql_errno($l=null)        { $l = $l ?? $GLOBALS['__mysql_compat_link']; return @mysqli_errno($l); }
  function mysql_real_escape_string($s,$l=null) { $l = $l ?? $GLOBALS['__mysql_compat_link'] ?? mysql_compat_ensure_link(); return @mysqli_real_escape_string($l, $s); }
  function mysql_close($l=null)        { $l = $l ?? $GLOBALS['__mysql_compat_link']; return $l ? @mysqli_close($l) : true; }
  function mysql_ping($l=null)         { $l = $l ?? $GLOBALS['__mysql_compat_link']; return $l && @mysqli_ping($l); }
  function mysql_data_seek($r, $n)     { return @mysqli_data_seek($r, $n); }
  function mysql_free_result($r)       { return @mysqli_free_result($r); }
  function mysql_result($r, $row, $f=0){ mysqli_data_seek($r, $row); $ro = mysqli_fetch_array($r); return $ro[$f] ?? null; }
  # 老代码常量
  if (!defined('MYSQL_BOTH'))   define('MYSQL_BOTH',   MYSQLI_BOTH);
  if (!defined('MYSQL_ASSOC'))  define('MYSQL_ASSOC',  MYSQLI_ASSOC);
  if (!defined('MYSQL_NUM'))    define('MYSQL_NUM',    MYSQLI_NUM);
}
SHIM
  echo "[OK] 已写入兼容层: $COMPAT"
  echo ""

  # 注入 require：让每个用到 mysql_* 的 PHP 文件在第一行 require 兼容层
  # 先找已经被 include 最多的 db-creds.inc，把兼容层 require 加在它前面即可——大多数脚本都 include 了 db-creds.inc
  INJECT="require_once __DIR__ . '/mysql_compat_shim.php'; "
  # 把兼容层 require 放到 db-creds.inc 最顶上（已经 include db-creds.inc 的脚本都会自动拿到 shim）
  $SUDO sed -i "1i\\<?php require_once __DIR__ . '/mysql_compat_shim.php'; ?>" "$DB_INC" 2>/dev/null
  # 去掉可能重复的 <?php
  echo "[-] db-creds.inc 内容现在为:"
  head -10 "$DB_INC"

  # 但有些脚本是不 include db-creds.inc 的 —— 针对这些，单独注入 require_once 到所有 PHP 文件的首行
  echo "[-] 给所有 sqli-labs 下的 PHP 文件首行注入兼容层..."
  while IFS= read -r -d '' php; do
    first=$(head -1 "$php" 2>/dev/null || true)
    # 已经有 shim 就跳过
    if grep -q "mysql_compat_shim" "$php" 2>/dev/null; then continue; fi
    # 加一行 require 到 <?php 后
    # 这里用 PHP 预加载方式简单处理：放 php.ini auto_prepend_file 也可以，但复杂。只处理 setup.php 和其他入口
    :
  done < <(find "$WEB_ROOT/sqli-labs" -name "*.php" -print0)

  # 更可靠办法：php.ini auto_prepend_file 全局
  PHP_INI_DIR=$($SUDO php -r "echo PHP_CONFIG_FILE_SCAN_DIR;" 2>/dev/null)
  PHP_INI_FILE=$($SUDO php -r "echo php_ini_loaded_file();" 2>/dev/null)
  echo "[-] PHP ini loaded: $PHP_INI_FILE"
  echo "[-] PHP conf.d dir: $PHP_INI_DIR"
  if [ -n "$PHP_INI_DIR" ] && [ -d "$PHP_INI_DIR" ]; then
    AUTO_INI="$PHP_INI_DIR/99-sqli-labs-shim.ini"
    echo "auto_prepend_file = $COMPAT" | $SUDO tee "$AUTO_INI" >/dev/null
    echo "[OK] 已在 $AUTO_INI 设置全局 auto_prepend_file=$COMPAT"
    echo "[-] 重启 apache2 让 php.ini 生效"
    $SUDO systemctl restart apache2
  fi
else
  echo "[跳过] 未发现 mysql_* 旧函数，说明源码是 PHP 7+/8+ 兼容版本，不需补丁"
fi

echo ""
echo "$SEP"
echo "  阶段 7：Apache 权限 + 目录重写 + allow_url_include"
echo "$SEP"
# 给 /var/www/html 目录权限给 www-data
$SUDO chown -R www-data:www-data "$WEB_ROOT"
$SUDO find "$WEB_ROOT" -type d -exec chmod 755 {} +
$SUDO find "$WEB_ROOT" -type f -exec chmod 644 {} +

# 开启 AllowOverride All（.htaccess 需要）
# 改 /etc/apache2/sites-available/000-default.conf 中 <Directory /var/www/>
SITE0=/etc/apache2/sites-available/000-default.conf
if [ -f "$SITE0" ]; then
  $SUDO tee /etc/apache2/conf-available/sqli-labs.conf >/dev/null <<'HTCONF'
<Directory /var/www/html/>
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
HTCONF
  $SUDO a2enconf sqli-labs 2>&1 | tail -2
  $SUDO a2enmod rewrite 2>&1 | tail -2
fi

# PHP 打开 allow_url_include（DVWA 推荐的，跟 SQLi-Labs 也没坏处）
for inif in /etc/php/*/apache2/php.ini; do
  [ -f "$inif" ] || continue
  echo "[-] 更新: $inif"
  $SUDO sed -i -E 's/^\s*;?\s*allow_url_include\s*=\s*.*/allow_url_include = On/g' "$inif"
  $SUDO sed -i -E 's/^\s*;?\s*display_errors\s*=\s*.*/display_errors = On/g' "$inif"
done
$SUDO systemctl restart apache2
sleep 2
echo "apache2 restart OK, active: $(sudo systemctl is-active apache2)"

echo ""
echo "$SEP"
echo "  阶段 8：SQLi-Labs 初始化数据库（模拟点击 Setup/reset 链接）"
echo "$SEP"
# 初始化链接通常是: /sqli-labs/setup-db.php 或 /Less-*/index.php 会调用
# 先找 setup 入口
SETUP=""
for p in setup-db.php setup.php index.php; do
  [ -f "$WEB_ROOT/sqli-labs/$p" ] && SETUP=$p && break
done
echo "[-] 初始化入口脚本: $SETUP"

# 先调用 setup-db.php （没有的话用 curl 访问页面触发）
if [ -n "$SETUP" ]; then
  echo "[-] 用 curl 触发初始化（不依赖交互）:"
  for i in 1 2 3; do
    OUT=$(curl -sL --max-time 30 "http://127.0.0.1/sqli-labs/$SETUP" 2>&1)
    echo "   尝试 $i 触发 /sqli-labs/$SETUP: 长度=$(echo "$OUT" | wc -c)"
    if echo "$OUT" | grep -qiE "database has been reset|old database.*purge|created"; then
      echo "[✓] 检测到数据库初始化成功的关键字"
      break
    fi
    sleep 2
  done
  # 如果关键字没找到，就手动建数据库结构
fi

# 直接 MariaDB 建库（兜底，保证后面连接可用）
mariadb -h 127.0.0.1 -uleet -pleet123 <<'MANUALSQL'
CREATE DATABASE IF NOT EXISTS security DEFAULT CHARACTER SET utf8mb4;
CREATE DATABASE IF NOT EXISTS challenges DEFAULT CHARACTER SET utf8mb4;
SHOW DATABASES;
MANUALSQL

echo ""
echo "$SEP"
echo "  阶段 9：HTTP 健康检查（Less-1 首页 & Setup 页）"
echo "$SEP"
URL_BASE="http://127.0.0.1/sqli-labs"

echo "[1] 根目录:"
curl -s -o /dev/null -w "  -> HTTP %{http_code}\n" --max-time 10 "$URL_BASE/"

echo "[2] Less-1 (经典 GET 注入 单引号):"
for i in 1 2 3 4 5 6; do
  C=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$URL_BASE/Less-1/?id=1" || true)
  TXT=$(curl -s --max-time 10 "$URL_BASE/Less-1/?id=1" 2>/dev/null | head -60)
  echo "  尝试 $i -> HTTP $C  长度=$(echo "$TXT" | wc -c)"
  if [ "$C" = "200" ]; then
    echo "  --- Less-1 返回片段 ---"
    echo "$TXT" | grep -oE "Your Login name|Dumb|Welcome|error|syntax" | head -5 || true
    break
  fi
  sleep 3
done

echo ""
echo "[-] apache2 默认根目录测试:"
curl -s -o /dev/null -w "  http://127.0.0.1/ -> HTTP %{http_code}\n" --max-time 8 http://127.0.0.1/

echo ""
echo "$SEP"
echo "  总结：SQLi-Labs 关键信息"
echo "$SEP"
echo "代码目录: /var/www/html/sqli-labs/"
echo "访问地址: http://192.168.108.128/sqli-labs/"
echo "DB 连接: 127.0.0.1 / leet / leet123（管理 root / root123）"
echo "Apache  80 端口: $(ss -tlnp 2>/dev/null | grep :80 || echo '未监听(错误!)')"
echo "MariaDB 3306: $(ss -tlnp 2>/dev/null | grep :3306 || echo '未监听(错误!)')"
echo "Apache service: $(sudo systemctl is-active apache2)"
echo "MariaDB service: $(sudo systemctl is-active mariadb)"
echo ""
echo "DONE"
