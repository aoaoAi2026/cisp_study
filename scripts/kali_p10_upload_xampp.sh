#!/bin/bash
# ============================================================
# ③ 搭建 Upload-Labs（B 方案：XAMPP 5.6.40 独立环境）
# 系统 Apache 已经占了 80，MariaDB 占了 3306
# 所以 XAMPP 独立用: Apache :81 / MySQL :3307 / ProFTPD 关闭
# PHP 版本目标：5.6.40，完美复现 %00 截断、老解析漏洞等 21 关全部
# ============================================================
export KALI_PASS="kail"
echo "$KALI_PASS" | sudo -S -v -p "" 2>/dev/null
if ! sudo -n true 2>/dev/null; then echo "[FAIL] sudo"; exit 1; fi
SUDO="sudo"
SEP="========================================================"

# ===== 端口检查 =====
for port in 81 3307; do
  if ss -tln 2>/dev/null | grep -qE ":${port}\s"; then
    echo "[!] 端口 $port 已经被占用！退出检查"
    ss -tlnp 2>/dev/null | grep -E ":${port}\s"
    exit 2
  fi
done
echo "[OK] 81 / 3307 端口空闲"

echo ""
echo "$SEP"
echo " 1/8 下载 XAMPP 5.6.40 for Linux x64 (144MB)"
echo "$SEP"
XAMPP_URLS=(
  # SourceForge 官方下载（多个 mirror）
  "https://downloads.sourceforge.net/project/xampp/XAMPP%20Linux/5.6.40/xampp-linux-x64-5.6.40-0-installer.run?r=https%3A%2F%2Fwww.apachefriends.org%2F&ts=$(date +%s)"
  # 备用：校内/教育网 mirror
  "https://nchc.dl.sourceforge.net/project/xampp/XAMPP%20Linux/5.6.40/extras/xampp-linux-x64-5.6.40-0-installer.run"
  "https://master.dl.sourceforge.net/project/xampp/XAMPP%20Linux/5.6.40/xampp-linux-x64-5.6.40-0-installer.run"
  "https://versaweb.dl.sourceforge.net/project/xampp/XAMPP%20Linux/5.6.40/xampp-linux-x64-5.6.40-0-installer.run"
)
XAMPP_FILE="/tmp/xampp-linux-x64-5.6.40.run"
[ -f "$XAMPP_FILE" ] && SIZE_EXIST=$(stat -c%s "$XAMPP_FILE" 2>/dev/null || echo 0) || SIZE_EXIST=0

if [ "$SIZE_EXIST" -gt 140000000 ]; then
  echo "[跳过] XAMPP installer 已存在且大小 > 140MB"
else
  $SUDO rm -f "$XAMPP_FILE"
  OK=0
  for url in "${XAMPP_URLS[@]}"; do
    echo "[TRY] $(echo $url | cut -c1-90) ..."
    if wget --no-check-certificate --timeout=120 --tries=2 -O "$XAMPP_FILE" "$url" 2>&1 | tail -5; then
      SZ=$(stat -c%s "$XAMPP_FILE" 2>/dev/null || echo 0)
      echo "   大小: $SZ bytes"
      if [ "$SZ" -gt 140000000 ]; then OK=1; break; fi
    fi
    $SUDO rm -f "$XAMPP_FILE"
  done
  if [ $OK -eq 0 ]; then
    echo "[FAIL] 所有 XAMPP 下载源失败（SourceForge 网络不通）"
    echo "建议：在宿主机 Windows 浏览器手动下载 https://www.apachefriends.org/zh_cn/download.html 选 5.6.40 Linux x64"
    echo "然后通过 scp/winscp 传到 Kali /tmp/xampp-linux-x64-5.6.40.run 再重新运行本脚本"
    exit 3
  fi
fi
$SUDO chmod +x "$XAMPP_FILE"
ls -lh "$XAMPP_FILE"

echo ""
echo "$SEP"
echo " 2/8 卸载旧版 XAMPP（/opt/lampp 已存在的话）+ 静默安装新的"
echo "$SEP"
if [ -d /opt/lampp ]; then
  echo "[-] 检测到 /opt/lampp 已存在，先卸载旧版"
  if [ -x /opt/lampp/uninstall ]; then
    $SUDO /opt/lampp/uninstall --mode unattended 2>&1 | tail -5
  fi
  $SUDO rm -rf /opt/lampp
fi

# 静默安装 XAMPP（官方 bitrock installer 支持 unattended 模式）
echo "[-] 开始静默安装（根据磁盘 IO 大约 1~5 分钟）..."
$SUDO "$XAMPP_FILE" --mode unattended --launch-stack-provider-installer 0 --enable-components '' 2>&1 | tail -20
sleep 2
echo ""
if [ ! -d /opt/lampp ]; then
  echo "[FAIL] 安装完成后 /opt/lampp 不存在？请检查 installer 是否崩溃"
  exit 4
fi
echo "[OK] /opt/lampp 目录已建立，大小: $(du -sh /opt/lampp | cut -f1)"

echo ""
echo "$SEP"
echo " 3/8 改 XAMPP Apache 端口 80 → 81（避免跟系统 Apache 冲突）"
echo "$SEP"
HTTPD="/opt/lampp/etc/httpd.conf"
HTTPD_SSL="/opt/lampp/etc/extra/httpd-ssl.conf"

echo "--- 修改前 关键端口配置 ---"
grep -nE "Listen|ServerName" "$HTTPD" 2>/dev/null | head -10

# httpd.conf 修改
$SUDO python3 <<PY
import re
p = "$HTTPD"
with open(p, 'r', encoding='utf-8', errors='ignore') as f: c = f.read()
# Listen 80 -> Listen 81（Listen 0.0.0.0:80 和 Listen [::]:80 都替换）
c = re.sub(r'Listen\s+(\S+:)?80\b', r'Listen \181', c)
# ServerName localhost:80 -> ServerName localhost:81
c = re.sub(r'ServerName\s+(\S+):80\b', r'ServerName \1:81', c)
with open(p, 'w', encoding='utf-8') as f: f.write(c)
print("  httpd.conf 已替换 Listen 80→81, ServerName port→81")
PY
# 改 SSL Listen 443 → 不配置，避免冲突，关掉 SSL（我们靶场只需要 HTTP 练习）
if [ -f "$HTTPD_SSL" ]; then
  grep -qE "^Include.*httpd-ssl.conf" "$HTTPD" 2>/dev/null && {
    echo "  注释掉 httpd-ssl.conf 引用（避免 443 冲突）"
    $SUDO sed -i -E 's|^Include(.*/extra/httpd-ssl\.conf.*)$|#Include\1|' "$HTTPD"
  }
fi
echo "--- 修改后 关键端口配置 ---"
grep -nE "Listen|ServerName" "$HTTPD" 2>/dev/null | head -10

echo ""
echo "$SEP"
echo " 4/8 改 XAMPP MySQL (MariaDB) 端口 3306 → 3307（避免系统 MariaDB 冲突）"
echo "$SEP"
XMYCNF="/opt/lampp/etc/my.cnf"
[ -f "$XMYCNF" ] || XMYCNF="/opt/lampp/mysql/my.cnf"
echo "  XAMPP MySQL 配置文件: $XMYCNF"
$SUDO python3 <<PY
import re
p = "$XMYCNF"
with open(p, 'r', encoding='utf-8', errors='ignore') as f: c = f.read()
# [mysqld] 段的 port=3306 → 3307
changed = False
sections = c.split('[')
out = []
for sec in sections:
    if sec.lower().startswith('mysqld]'):
        # 替换所有 port = 3306 或 port=3306
        new_sec, n = re.subn(r'(port\s*=\s*)3306\b', r'\g<1>3307', sec)
        if n == 0:
            # 找不到 port 行就插一行在 [mysqld] 后面
            new_sec = re.sub(r'(mysqld]\s*\n)', r'\1port = 3307\n', sec, count=1)
            changed = True
        else:
            changed = True
        out.append(new_sec)
    else:
        out.append(sec)
c2 = '['.join(out)
with open(p, 'w', encoding='utf-8') as f: f.write(c2)
print(f"  my.cnf 修改完成, changed={changed}")
PY
grep -nE "port\s*=" "$XMYCNF" 2>/dev/null | head -10

echo ""
echo "$SEP"
echo " 5/8 关闭 XAMPP 不必要的服务（ProFTPD、SSL）+ 启动 Apache+MySQL"
echo "$SEP"
# 防止和系统 systemd 的 mysql 服务抢 socket —— XAMPP 的 mysql.sock 改到自己目录
# 先关之前启动过的 lampp（防止有残留进程）
$SUDO /opt/lampp/lampp stop 2>&1 | tail -5 || true
sleep 2

# ======= 先启动 Apache 看 PHP 版本 ========
echo "[-] 启动 Apache..."
$SUDO /opt/lampp/lampp startapache 2>&1 | tail -5
sleep 3
echo "[-] 端口检查 81 :"
ss -tln 2>/dev/null | grep ":81\s" || echo "NOT LISTENING"
echo "[-] PHP 版本（/opt/lampp/bin/php）:"
/opt/lampp/bin/php -v 2>&1 | head -3
echo "[-] HTTP 测试 http://127.0.0.1:81/dashboard/phpinfo.php:"
for i in 1 2 3; do
  C=$(curl -s --max-time 10 "http://127.0.0.1:81/dashboard/phpinfo.php" 2>&1 | head -60)
  V=$(echo "$C" | grep -oEi "PHP Version [0-9]+\.[0-9]+\.[0-9]+" | head -1)
  echo "   尝试 $i -> $V"
  [ -n "$V" ] && break
  sleep 2
done

echo ""
echo "[-] 启动 XAMPP MySQL（端口 3307）..."
$SUDO /opt/lampp/lampp startmysql 2>&1 | tail -5
sleep 5
echo "[-] 端口检查 3307 :"
ss -tln 2>/dev/null | grep ":3307\s" || echo "NOT LISTENING"
echo "[-] MySQL 登录测试（XAMPP 的 mysql 默认 root 空密码）:"
/opt/lampp/bin/mysql -h127.0.0.1 -P3307 -uroot -e "SELECT 'xampp_mysql OK' AS s, VERSION() AS v;" 2>&1 | head -5

echo ""
echo "$SEP"
echo " 6/8 下载 Upload-Labs 源码（GitHub c0ny1/upload-labs 原版）到 /opt/lampp/htdocs/upload-labs/"
echo "$SEP"
UL=/opt/lampp/htdocs/upload-labs
$SUDO rm -rf "$UL" "${UL}.old"

UL_ZIPS=(
  "https://codeload.github.com/c0ny1/upload-labs/zip/refs/heads/master|/tmp/ul_master.zip"
  "https://gitee.com/zhuifengshaonian233/upload-labs/repository/archive/master.zip|/tmp/ul_p1.zip"
  "https://gitee.com/mirrors/upload-labs/repository/archive/master.zip|/tmp/ul_m.zip"
)
DL_OK=0
for entry in "${UL_ZIPS[@]}"; do
  url="${entry%%|*}"; zf="${entry##*|}"
  echo "[TRY] $url"
  if wget --timeout=90 --tries=2 -O "$zf" "$url" 2>&1 | tail -3; then
    SZ=$(stat -c%s "$zf" 2>/dev/null || echo 0)
    echo "   大小: $SZ bytes"
    if [ "$SZ" -gt 200000 ]; then
      $SUDO rm -rf /tmp/ul_ext && mkdir -p /tmp/ul_ext
      if unzip -o -q "$zf" -d /tmp/ul_ext 2>&1 | tail -2; then
        SRC=$(find /tmp/ul_ext -maxdepth 3 -name "index.php" -type f 2>/dev/null | head -1 | xargs dirname)
        if [ -z "$SRC" ]; then SRC=$(find /tmp/ul_ext -maxdepth 3 -type d -name "Pass-01*" -o -name "Pass-1*" 2>/dev/null | head -1 | xargs dirname); fi
        if [ -n "$SRC" ] && [ "$SRC" != "/" ]; then
          $SUDO cp -r "$SRC" "$UL"
          DL_OK=1
          echo "[OK] Upload-Labs 解压到 $UL"
          break
        fi
      fi
    fi
  fi
  rm -f "$zf"
done
if [ $DL_OK -eq 0 ]; then
  echo "[FAIL] Upload-Labs 下载失败"
  exit 5
fi
$SUDO chown -R daemon:daemon "$UL" 2>/dev/null  # XAMPP Apache 运行用户是 daemon
$SUDO find "$UL" -type d -exec chmod 755 {} +
$SUDO find "$UL" -type f -exec chmod 644 {} +
# 上传目录必须给写权限
$SUDO chmod -R 777 "$UL/upload" 2>/dev/null
$SUDO mkdir -p "$UL/upload"
$SUDO chmod -R 777 "$UL/upload"
echo "[OK] $UL 权限设置完成，大小: $(du -sh $UL | cut -f1)"
echo "--- ls $UL ---"
ls "$UL" 2>&1 | head -30
echo "Pass 目录数: $(find $UL -maxdepth 1 -type d -name "Pass*" | wc -l)"

echo ""
echo "$SEP"
echo " 7/8 Upload-Labs 配置 config.php（一般不改，默认就用了）"
echo "$SEP"
CFG=""
for p in config.php include/config.php inc/config.php; do
  [ -f "$UL/$p" ] && CFG="$UL/$p" && break
done
[ -n "$CFG" ] && { echo "Config file: $CFG"; head -30 "$CFG" 2>/dev/null; } || echo "没找到 config.php（一般 Upload-Labs 不需要，全用默认）"

echo ""
echo "$SEP"
echo " 8/8 HTTP 健康检查 + 写 systemd 开机自启 + 汇总"
echo "$SEP"
echo "=== HTTP 检查 ==="
for item in \
  "XAMPP 控制面板 :81|http://127.0.0.1:81/dashboard/" \
  "PHP 5.6 phpinfo|http://127.0.0.1:81/dashboard/phpinfo.php" \
  "Upload-Labs 首页|http://127.0.0.1:81/upload-labs/" \
  "Upload-Labs Pass-01|http://127.0.0.1:81/upload-labs/Pass-01/index.php" \
  "Upload-Labs Pass-19|http://127.0.0.1:81/upload-labs/Pass-19/index.php" \
  "Upload-Labs Pass-20|http://127.0.0.1:81/upload-labs/Pass-20/index.php" ; do
  name="${item%%|*}"; url="${item##*|}"
  C=$(curl -s -o /tmp/_ulb.html -w "%{http_code}" --max-time 15 "$url" 2>/dev/null || echo 000)
  PHPV=$(grep -oEi "PHP Version 5\.6\.[0-9]+" /tmp/_ulb.html 2>/dev/null | head -1)
  TITLE=$(grep -oEi "<title>[^<]+</title>" /tmp/_ulb.html 2>/dev/null | head -1 | sed 's/<[^>]*>//g')
  FC=$(grep -cEi "Fatal error|Uncaught" /tmp/_ulb.html 2>/dev/null || echo 0)
  echo "HTTP $C  FATAL=$FC  $name"
  [ -n "$PHPV" ]  && echo "   PHP版本: $PHPV"
  [ -n "$TITLE" ] && echo "   页面TITLE: $TITLE"
done
rm -f /tmp/_ulb.html

echo ""
echo "=== systemd 开机自启服务（lampp-start）==="
# 写一个简单的 systemd service
$SUDO tee /etc/systemd/system/xampp-labs.service >/dev/null <<SVC
[Unit]
Description=XAMPP 5.6.40 for Upload-Labs (Apache:81 MySQL:3307)
After=network.target

[Service]
Type=forking
ExecStart=/opt/lampp/lampp startapache startmysql
ExecStop=/opt/lampp/lampp stopapache stopmysql
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
SVC
$SUDO systemctl daemon-reload 2>&1 | tail -2
$SUDO systemctl enable xampp-labs 2>&1 | tail -3
echo "xampp-labs enabled status: $(sudo systemctl is-enabled xampp-labs 2>&1)"

echo ""
echo "======================== 最终报告 ========================"
echo " 🎉 Upload-Labs 部署完成！"
echo " 📂 代码目录: /opt/lampp/htdocs/upload-labs/"
echo " 🌐 访问地址: http://192.168.108.128:81/upload-labs/  (宿主机浏览器)"
echo " 🌐 XAMPP Dashboard: http://192.168.108.128:81/dashboard/"
echo " 🌐 PHP 5.6.40 phpinfo: http://192.168.108.128:81/dashboard/phpinfo.php"
echo " 🔌 Apache :81  监听: $(ss -tln 2>/dev/null | grep ':81 ')"
echo " 🔌 MySQL  :3307 监听: $(ss -tln 2>/dev/null | grep ':3307')"
echo " 💾 XAMPP MySQL: 127.0.0.1:3307  root（空密码）"
echo " 📚 Pass 关卡数: $(find /opt/lampp/htdocs/upload-labs -maxdepth 1 -type d -name "Pass*" | wc -l)"
echo " 🔄 启动: systemctl start xampp-labs  停止: systemctl stop xampp-labs"
echo " 🔄 或 /opt/lampp/lampp startapache/startmysql   /opt/lampp/lampp stopapache/stopmysql"
echo "======================== 完成 ========================"
echo "DONE."
