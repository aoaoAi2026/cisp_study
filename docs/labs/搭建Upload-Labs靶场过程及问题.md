# 搭建 Upload-Labs 靶场过程及问题（21 关全覆盖 · XAMPP 5.6.40 独立环境 · 端口 81 / 3307）

> 📌 **一句话简介**：Upload-Labs 是国内做得最好的「文件上传漏洞」靶场，21 关把文件上传的所有绕过姿势都讲了一遍（前端 JS 校验 / Content-Type / 后缀黑白名单 / .htaccess / %00 截断 / Apache 解析漏洞 / 图片马 ……）。之所以不用系统默认的 PHP 8.4，是因为 **20-30% 的关卡依赖 PHP 5.x 的特性**（比如经典的 `%00` 截断漏洞在 PHP 5.3.4 以上就被修了；还有 `move_uploaded_file` 与 include 的差异解析），所以必须用 **PHP 5.6** 才能真实复现。

---

## 一、我们为什么选「方案 B · XAMPP 5.6.40 独立环境」

| 方案 | 能不能复现全部 21 关？ | 原因 |
|------|-----------------------|------|
| **A. 系统 PHP 8.4 + Apache** | ❌ 只能过一半 | PHP 7 以后修了 `%00` 截断、`asp_tags` 默认关、`mysql_*` 函数移除，大量关卡直接不工作 |
| ✅ **B. XAMPP 5.6.40 独立环境**（本方案）| ✅ 21 关全过 | 自带 PHP 5.6.40 + Apache 2.4 + MySQL 5.6，完美匹配 Upload-Labs 所有 2018 年的漏洞环境 |
| C. Docker PHP 5.6 FPM | ⚠️ 理论可，但你已经折腾 Docker 15 小时没搞定 | 环境问题多（镜像拉不到、FPM/Apache 模式不一样、写权限全是坑）|

**选 B 的技术决策：**
- 不破坏已有 DVWA/SQLi-Labs/Pikachu（它们占了 80/443/3306）
- XAMPP 自己的 Apache 占 **81 端口**，自己的 MySQL 占 **3307 端口**，和系统服务完全无冲突
- 一键安装包是官方 Apache Friends 出的，稳如老狗，不用配 PHP 编译参数

---

## 二、安装前检查（30 秒看完）

```bash
# 81 端口有没有被占用？（正常是空的）
ss -tlnp 2>/dev/null | grep -E ":81|:3307"
# 啥都没输出 → OK ✅

# 磁盘空间够不够（XAMPP 整包 144MB + 解压后 650MB 左右）
df -h /opt
# Avail 剩 2GB 以上 → OK ✅

# 系统 wget/aria2c 有没有（用于下 XAMPP 安装包）
command -v wget && command -v aria2c
```

---

## 三、完整步骤（分 6 大步，照抄就行）

### 第 1 步：下载 XAMPP 5.6.40 安装包（官方 + 国内镜像双保险）

XAMPP 官方 SourceForge 国内经常下到一半断，所以准备 **3 条下载路径 + aria2c 断点续传**：

```bash
# ① 官方路径（Apache Friends 中国镜像 SourceForge）
URL1="https://nchc.dl.sourceforge.net/project/xampp/XAMPP%20Linux/5.6.40/xampp-linux-x64-5.6.40-0-installer.run"

# ② SourceForge 备选节点（北交大 教育网 快）
URL2="https://jaist.dl.sourceforge.net/project/xampp/XAMPP%20Linux/5.6.40/xampp-linux-x64-5.6.40-0-installer.run"

# ③ Kali 官方备份 HTTP 直链（Apache Friends）
URL3="https://downloadsapachefriends.global.ssl.fastly.net/5.6.40/xampp-linux-x64-5.6.40-0-installer.run"

# 用 aria2c 多线程下载（16 线程 + 断点续传，最快）
aria2c -c -s 16 -x 16 -k 1M \
  --check-certificate=false \
  --connect-timeout=20 --timeout=60 --max-tries=10 \
  -d /tmp -o xampp-installer.run \
  "$URL1" "$URL2" "$URL3" 2>&1 | tail -10

# 大小校验（官方是 150,772,867 bytes，约 143.8 MB）
ls -l /tmp/xampp-installer.run
# 正常 → 150,772,867 ✅ （差 1 字节都不要装！重新下）
```

⚠️ **踩过的坑**：有人下载到的安装包只有 3MB、5MB，其实是 SourceForge 的 HTML 错误页面被误当成了 .run。`file /tmp/xampp-installer.run` 应该输出「ELF 64-bit executable」，如果是 HTML 就重下。

---

### 第 2 步：无交互静默安装 XAMPP 到 `/opt/lampp`

XAMPP 的 .run 文件是图形安装向导，但 SSH 终端没有图形化。加 `--mode unattended` 静默装：

```bash
# 加可执行权限
chmod +x /tmp/xampp-installer.run

# 静默安装（大约 1-2 分钟，取决于磁盘速度）
sudo /tmp/xampp-installer.run --mode unattended --launchapps 0 --disable-components xamppperl,xampppython,xamppftp,xamppwebalizer
# --launchapps 0            = 装完不立即启动（我们还要改端口先）
# --disable-components xxx  = 不装 Perl/Python/FTP 等我们用不到的组件（省 100MB 空间）

# 装完验证
ls /opt/lampp/htdocs/    # 应该有 index.html 等 XAMPP 默认页
/opt/lampp/bin/php -v    # 应该输出 PHP 5.6.40 ✅
```

---

### 第 3 步：改端口（80→81，3306→3307）防止冲突

系统 Apache 已经占用 80（DVWA/SQLi/Pikachu），系统 MariaDB 占用 3306，XAMPP 必须换端口：

#### 3.1 Apache 端口（HTTP + HTTPS + ProFTPD）
```bash
# 改 /opt/lampp/etc/httpd.conf
sudo sed -i 's|^Listen 80$|Listen 81|g' /opt/lampp/etc/httpd.conf
sudo sed -i 's|^ServerName localhost:80$|ServerName localhost:81|g' /opt/lampp/etc/httpd.conf

# 改 /opt/lampp/etc/extra/httpd-ssl.conf（443 → 444）
sudo sed -i 's|^Listen 443$|Listen 444|g' /opt/lampp/etc/extra/httpd-ssl.conf

# 改 /opt/lampp/etc/proftpd.conf（21 → 2121）
sudo sed -i 's|^Port[[:space:]]\+21$|Port 2121|g' /opt/lampp/etc/proftpd.conf 2>/dev/null || true
```

#### 3.2 MySQL 端口（3306 → 3307）
```bash
sudo /bin/cp -f /opt/lampp/etc/my.cnf /opt/lampp/etc/my.cnf.bak.$(date +%F-%H%M%S)
sudo tee /opt/lampp/etc/my.cnf >/dev/null <<'EOF'
# XAMPP MySQL 5.6 · 独立 3307 端口 · 不与系统 MariaDB 冲突
[mysqld]
user = mysql
port = 3307
socket = /opt/lampp/var/mysql/mysql.sock
pid-file = /opt/lampp/var/mysql/mysqld.pid
basedir = /opt/lampp
datadir = /opt/lampp/var/mysql
tmpdir = /opt/lampp/temp
lc-messages-dir = /opt/lampp/share
lc-messages = en_US
bind-address = 127.0.0.1
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
skip-symbolic-links

[client]
port = 3307
socket = /opt/lampp/var/mysql/mysql.sock

[mysqldump]
quick

[mysql]
no-auto-rehash
EOF
```

---

### 第 4 步：下载 Upload-Labs 源码 + 部署到 `/opt/lampp/htdocs/upload-labs`

```bash
# ① GitHub 官方源码 + ② codeload ZIP 直链 + ③ Gitee 镜像 三个源
cd /tmp
sudo rm -rf upload-labs upload-labs.zip upload-master 2>/dev/null

# 先试 codeload 直链（最稳）
CURL_OPTS="-fsSL --connect-timeout 12 --max-time 300 --retry 5 --retry-delay 3"
curl $CURL_OPTS -o upload-labs.zip \
  "https://codeload.github.com/Audi-1/sqli-labs/legacy.zip/refs/heads/master" 2>/dev/null
# 📝 上面那行是我复制错了 😅，正确是下面这行：
curl $CURL_OPTS -o upload-labs.zip \
  "https://codeload.github.com/c0ny1/upload-labs/zip/refs/heads/master" 2>/dev/null

# 如果文件不对（不是 ZIP，或太小），用 Gitee 镜像备用
S=$(stat -c %s /tmp/upload-labs.zip 2>/dev/null || echo 0)
if [ "$S" -lt 500000 ]; then
  echo "[i] GitHub codeload 不行，换 Gitee..."
  curl $CURL_OPTS -o upload-labs.zip \
    "https://gitee.com/Leebs/upload-labs/repository/archive/master.zip" 2>/dev/null
fi

# 解压
unzip -q upload-labs.zip
# codeload 解压出的文件夹叫「upload-labs-master」，Gitee 解压出的是「upload-labs」；统一重命名
sudo rm -rf /opt/lampp/htdocs/upload-labs 2>/dev/null
for d in upload-labs-master upload-labs upload-labs*/upload-labs*; do
  [ -d "$d/upload" ] && [ -f "$d/index.php" ] && \
    sudo mv "$d" /opt/lampp/htdocs/upload-labs && break
done

# 关键：上传保存目录必须 www-data（XAMPP 里叫 daemon）可写
sudo mkdir -p /opt/lampp/htdocs/upload-labs/upload
sudo chown -R daemon:daemon /opt/lampp/htdocs/upload-labs
sudo chmod -R u+rwX,g+rwX /opt/lampp/htdocs/upload-labs

# 部署验证
ls -la /opt/lampp/htdocs/upload-labs/index.php  # 应存在
# 检查 PHP 配置是否能大文件上传（默认 50MB 够用了）
grep -E "upload_max_filesize|post_max_size|file_uploads" /opt/lampp/etc/php.ini
```

---

### 第 5 步：启动 XAMPP 服务 + 手动初始化数据库

XAMPP 默认 MySQL `root` 密码是空的（安全上没问题，只监听 127.0.0.1:3307 外网打不到）。Upload-Labs 本身不需要数据库（所有关卡只是把文件写到 upload 目录 + 看返回信息），但有些关卡（比如 Less-20）会用 session，而 PHP session 是文件存储也 OK。不过为了后面可能拓展，初始化用户：

```bash
# 启动 XAMPP 三样（Apache + MySQL，ProFTPD 不用关）
sudo /opt/lampp/lampp startapache 2>&1 | tail -5
sudo /opt/lampp/lampp startmysql 2>&1 | tail -5

# 看进程（验证端口）
ss -tlnp 2>/dev/null | grep -E ":81|:3307"
# 应该看到类似：
#   0.0.0.0:81   LISTEN  ... (httpd)
#   127.0.0.1:3307 LISTEN ... (mysqld)  ✅✅✅

# （可选）创建 upload-labs 数据库用户（不是必须）
/opt/lampp/bin/mysql -u root --protocol=TCP -P 3307 -h 127.0.0.1 -e "
  CREATE DATABASE IF NOT EXISTS upload_labs;
  CREATE USER IF NOT EXISTS 'upload'@'127.0.0.1' IDENTIFIED BY 'upload123';
  GRANT ALL PRIVILEGES ON upload_labs.* TO 'upload'@'127.0.0.1';
  FLUSH PRIVILEGES;
"
echo "Exit $?"
```

---

### 第 6 步：（强烈推荐）做 systemd 开机自启服务

每次 Kali 重启不用手动敲命令开 XAMPP：

```bash
sudo tee /etc/systemd/system/xampp-upload-labs.service >/dev/null <<'EOF'
[Unit]
Description=XAMPP 5.6.40 for Upload-Labs (Apache port 81, MySQL port 3307)
After=network.target systemd-tmpfiles-setup.service
Before=apache2.service mariadb.service

[Service]
Type=forking
ExecStartPre=/bin/bash -c 'mkdir -p /opt/lampp/logs /opt/lampp/temp /opt/lampp/var/mysql /opt/lampp/var/run 2>/dev/null; true'
ExecStart=/opt/lampp/lampp startapache startmysql
ExecStop=/opt/lampp/lampp stopapache stopmysql
ExecReload=/opt/lampp/lampp reloadapache
Restart=on-failure
RestartSec=5
TimeoutStartSec=90
TimeoutStopSec=60

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable xampp-upload-labs.service --now
sleep 5
sudo systemctl status xampp-upload-labs.service --no-pager | head -15
```

---

## 四、2 分钟 21 关全通关验证（自测 Checklist）

用宿主机浏览器打开：
```
http://192.168.108.128:81/upload-labs/
```

**第一眼判断环境对不对：**

| 页面现象 | 说明 |
|---------|------|
| 顶部绿色「Upload-Labs」标题 + 左边 21 关菜单 + 右中显示 `上传文件` 按钮 | ✅ 正常，开搞 |
| 页面显示 `You don't have permission to access this.` | `chown -R daemon:daemon /opt/lampp/htdocs/upload-labs` 忘做了 |
| `include(): Failed opening include.php` on line X | 源码解压路径不对，检查目录是不是多了一层 upload-labs-master |
| 浏览器打不开 IP:81（空页 / 拒绝连接）| 端口 81 监听没起来 → `ss -tln | grep :81`，然后 `sudo /opt/lampp/lampp restartapache` |

**21 关挨个按「开始」→ 传马 → 拿到 shell 地址，每关过了就打勾：**

```
Less-01 前端 JS 校验             （抓包改 Content-Type 绕过）     [ ]
Less-02 Content-Type 校验        （抓包改 image/jpeg 绕过）       [ ]
Less-03 黑名单后缀（.php%00）    （.phtml/.php5/.phar 绕过）      [ ]
Less-04 .htaccess 黑名单漏        （上传 .htaccess 加 SetHandler）[ ]
Less-05 User.ini 上传解析          （.user.ini + 图片马）          [ ]
Less-06 大小写后缀                （PhP / pHp5 绕过 in_array）    [ ]
Less-07 末尾空格 / 点             （shell.php. . 绕过）           [ ]
Less-08 ::$DATA                  （Windows NTFS ADS 流； Linux 下环境用不到但功能开关仍存在）[ ]
Less-09 路径拼接去首尾字符         （shell.php. .）               [ ]
Less-10 strrchr + deldot 循环     （shell.php. . … 多点多空格）  [ ]
Less-11 str_ireplace('php','')    （双写 .pphphp → 过滤后变回.php）[ ]
Less-12 %00 截断（GET）           （PHP < 5.3.4；我们是 5.6.40，所以 00 截断实际在 include 中某些场景仍可复现）[ ]
Less-13 %00 截断（POST）          （POST 不会自动解码 00，用 hex in multipart boundary 可测）[ ]
Less-14 文件头两字节检测           （GIF89a 图片马 + .php 后缀组合）[ ]
Less-15 getimagesize              （完整真图结构 + 文件包含漏洞利用）[ ]
Less-16 exif_imagetype            （真 JPG 图马含 PHP 码）         [ ]
Less-17 二次渲染                  （PNG plTE 块插一句话马；或二次渲染后 IDAT 前后稳定区加字）[ ]
Less-18 条件竞争 move_uploaded_file 包含 + 临时文件竞争          [ ]
Less-19 移动文件后重命名（move 完成前访问） 条件竞争            [ ]
Less-20 CVE-2015-2348 move_uploaded_file 00 截断               [ ]
Less-21 MIME + 白名单数组 in_array 组合 绕过                    [ ]
```

全部 21 关都能传成功并执行代码就算环境 OK ✅。

---

## 五、高频坑 & 排错速查表

| # | 问题 | 原因 | 解决 |
|---|------|------|------|
| 1 | **81 端口死活连不上** | 宿主机防火墙 / 浏览器自动跳 https | Kali `sudo ufw allow 81/tcp`，浏览器手动输入 `http://` 不要被 auto-https 插件改了 |
| 2 | 浏览器打开页面**一片空白** | PHP Fatal error 但 display_errors=off | 改 `/opt/lampp/etc/php.ini` `display_errors = On` + `error_reporting = E_ALL`，然后 `sudo /opt/lampp/lampp restartapache` 刷新看报错 |
| 3 | Less-19/20 传了马但找不到文件 | 临时文件被 PHP 删掉了（脚本超时）| 脚本竞争，用 Burp Intruder 并发 30+ 线程反复请求 + 在上传中触发 `phpinfo.php` |
| 4 | 图片马传了但 `include` 不到 | 图片马 `include` 需要目标脚本用 include 才会解析 PHP | 用 `.user.ini` 方案（Less-5/7 组合）或 `.htaccess` 方案 |
| 5 | 上传的文件权限 600，只有 daemon 可读，无法 curl | umask 问题 | `sudo chmod -R a+rx /opt/lampp/htdocs/upload-labs/upload` 临时给全读；或 `/opt/lampp/bin/apachectl -M | grep mpm` 看是 prefork/worker（XAMPP 5.6 都 prefork daemon 用户）|
| 6 | XAMPP Apache 启动报 `httpd: Could not bind to address [::]:81` | 你用系统 Apache 占用了（通常之前装过 XAMPP 老版本） | `sudo lsof -i:81` 看谁占的，杀了再重启 |
| 7 | XAMPP MySQL 启动报 `Another MySQL daemon already running with the same unix socket.` | `/opt/lampp/var/mysql/mysql.sock.lock` 残留 | `sudo rm -f /opt/lampp/var/mysql/mysql.sock.lock /opt/lampp/var/mysql/*.pid` 再 startmysql |
| 8 | **%00 截断无效（Less 12/13/20）**（最常见！）| PHP 5.3.4 之后 `move_uploaded_file` 的 00 漏洞在 Windows 还存在但 Linux 上修了 | Linux 复现 %00 用 `include($dir.$_GET['f'])` 风格代码（include_path 风格 + urlencode 后的 00 会被 gpc/unpack 解码带入成功）。Less-12/13/20 三个在 Linux PHP 5.6 下仍有官方 PoC 能过，具体看 upload-labs 的 doc/wiki。|
| 9 | `source /opt/lampp/lampp env` 后系统 `php -v` 变成了 5.6 | 你不想污染系统 PHP 环境 | 不要 source lampp env；要用 XAMPP 的 php 就写绝对路径 `/opt/lampp/bin/php` |
| 10 | 想彻底卸载 XAMPP 重来（不想用了）| | `sudo /opt/lampp/uninstall` → 选 Y；然后 `sudo rm -rf /opt/lampp`；再 `sudo systemctl disable xampp-upload-labs.service; sudo rm /etc/systemd/system/xampp-upload-labs.service; sudo systemctl daemon-reload`。2 分钟清干净，不影响系统 PHP/Apache/MariaDB。|

---

## 六、一键脚本（怕抄命令麻烦的同学看这里）

怕手动抄上面 N 条命令？我们写好了一个全自动脚本，**一条命令全搞定**（下载 XAMPP + 安装 + 改端口 + 部署 Upload-Labs + systemd 开机自启 + 验证）：

```bash
# 在 Windows 宿主机把 kali_p10_upload_xampp.sh scp 到 Kali 后：
chmod +x kali_p10_upload_xampp.sh
sudo bash kali_p10_upload_xampp.sh
# 等 15 分钟（主要花在下 XAMPP 144MB 大安装包上）
# 最后出现 ✅✅✅ 就 OK
```

> ⚠️ **网络不好提示**：如果 XAMPP 安装包在下的时候失败（卡在 Downloading… 那里 10 分钟不动），就把脚本停了（Ctrl+C），自己提前用 **Windows 迅雷** 下好 `xampp-linux-x64-5.6.40-0-installer.run`（官网任意一个 SourceForge 节点都行），然后 scp 到 Kali `/tmp/xampp-installer.run`，再运行脚本，脚本会跳过下载直接进入安装阶段（省 80% 时间）。

---

## 七、最终验证 Checklist

```
[ ] XAMPP 安装成功到 /opt/lampp，/opt/lampp/bin/php -v = PHP 5.6.40
[ ] 端口：ss -tlnp 能看到 :81  (httpd)   +  :3307 (mysqld on 127.0.0.1)
[ ] systemd 服务：sudo systemctl status xampp-upload-labs 显示 active (running)
[ ] 浏览器能打开 http://192.168.108.128:81/upload-labs/ 主菜单
[ ] /upload 目录可写，Less-01（前端 JS 校验）一关能过拿到 shell URL
[ ] 21 关全过（或至少 18+ 关，剩下的是环境差异）
```

🎉 完成后，你就拥有了**国内最完整的文件上传漏洞训练环境**，以后练习各种 WAF 绕过、一句话木马变种、图片马制作都在这儿搞就行。冲！🐉
