# Day086 靶场2 SQLi-Labs 和 Day088 靶场4 Pikachu 验证过程

> 本文档存放于 docs/labs 目录中
>
> 本文档：待手动验证两个靶场在 Kali 192.168.108.128 上的当前状态。
> 以下给出完整验证脚本 + 各种情况（路径不存在 / 文件存在但 HTTP 404 / 正常 200）的处理方案与备用 Docker 一键启动命令。

---

## 一、验证流程总览

请在 Kali 终端依次执行以下命令，并把输出填到「三、验证结果记录区」。

```bash
# ─────────────────────────────────────────────
# 验证 1：SQLi-Labs 目录和 HTTP 状态
# ─────────────────────────────────────────────
echo "==== [1] SQLi-Labs 本地目录检查 ===="
ls -la /var/www/html/sqli-labs/ 2>&1 | head -20

echo ""
echo "==== [2] SQLi-Labs HTTP 状态 ===="
curl -s -o /tmp/sqli_body.html -w "HTTP_CODE:%{http_code}\n" http://127.0.0.1/sqli-labs/
echo "关键字命中数:"
grep -c -i "sql.*lab\|Less-1\|mysqli\|sql injection" /tmp/sqli_body.html 2>/dev/null || echo 0

# ─────────────────────────────────────────────
# 验证 2：Pikachu 目录和 HTTP 状态
# ─────────────────────────────────────────────
echo ""
echo "==== [3] Pikachu 本地目录检查 ===="
ls -la /var/www/html/pikachu/ 2>&1 | head -20

echo ""
echo "==== [4] Pikachu HTTP 状态 ===="
curl -s -o /tmp/pika_body.html -w "HTTP_CODE:%{http_code}\n" http://127.0.0.1/pikachu/
echo "关键字命中数:"
grep -c -i "pikachu\|皮卡丘\|install\|漏洞" /tmp/pika_body.html 2>/dev/null || echo 0

# ─────────────────────────────────────────────
# 验证 3：数据库连通性（两个靶场都依赖 MySQL/MariaDB）
# ─────────────────────────────────────────────
echo ""
echo "==== [5] MariaDB 服务状态 ===="
systemctl is-active mariadb 2>&1
echo "MySQL 3306 端口:"
ss -tlnp 2>/dev/null | grep -c 3306 || netstat -tlnp 2>/dev/null | grep -c 3306 || echo "ss/netstat 不可用"
```

---

## 二、分情况处理方案

### 场景 A：目录 `/var/www/html/sqli-labs/` 不存在

**建议**：直接使用 `c0ny1/sqli-labs:latest` Docker 镜像（5 分钟内拉起）。

```bash
# 一键启动 SQLi-Labs Docker
docker run -d \
  --name sqli-labs \
  --restart unless-stopped \
  -p 8085:80 \
  c0ny1/sqli-labs:latest

# 等待 10 秒初始化
sleep 10

# 验证
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8085/
# 预期：200
```

**Docker 启动后访问地址**：
```
http://192.168.108.128:8085/
```
首次进入点「Setup/reset Database for labs」完成建库（镜像内通常已自带 DB 初始化脚本，会自动创建 security 库和 1~75 关 users 表）。

---

### 场景 B：目录存在但访问 HTTP 404（SQLi-Labs）

**常见原因排查步骤**：

```bash
# (1) Apache2 是否在跑
systemctl status apache2 --no-pager
# 若 dead:
sudo systemctl start apache2

# (2) 目录权限是否正确（www-data 可读取）
ls -ld /var/www/html/sqli-labs/
# 应为 drwxr-xr-x www-data www-data 或至少 755
# 修复:
sudo chown -R www-data:www-data /var/www/html/sqli-labs/
sudo chmod -R 755 /var/www/html/sqli-labs/

# (3) 是否子目录层级错了（常见 clone 时多嵌套了一层）
find /var/www/html/sqli-labs -name "Less-1*" -maxdepth 3 2>/dev/null
# 如果 Less-1.php 在 /var/www/html/sqli-labs/sqli-labs/Less-1.php，需要移一层
# mv /var/www/html/sqli-labs/sqli-labs/* /var/www/html/sqli-labs/ && rmdir /var/www/html/sqli-labs/sqli-labs/

# (4) Apache 配置是否允许 .htaccess / AllowOverride
grep -r "AllowOverride" /etc/apache2/sites-enabled/ /etc/apache2/apache2.conf
# /var/www/html 段应为 AllowOverride All

# (5) 查看 Apache error.log 精准定位
tail -n 50 /var/log/apache2/error.log
```

若 15 分钟排查不出 → 直接走「场景 A Docker 方案」兜底。

---

### 场景 C：目录 `/var/www/html/pikachu/` 不存在

**建议**：使用 Pikachu 对应 Docker 镜像（搜索 Docker Hub 可得，或使用以下通用 Dockerfile 自建）。

**方案 1：Docker Hub 现成镜像（优先）**
```bash
# 搜索到的常用镜像名示例（不同作者 tag 可能不同）
docker search pikachu
# 拉取并启动（以下为常见可用镜像，若 tag 不存在请 docker search 后替换）
docker run -d \
  --name pikachu \
  --restart unless-stopped \
  -p 8086:80 \
  area39/pikachu:latest

# 验证
sleep 10
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8086/
```

**方案 2：若以上镜像拉不到，使用通用 PHP+Apache Dockerfile 自建**
```bash
sudo mkdir -p /opt/labs-manual/pikachu-docker
cd /opt/labs-manual/pikachu-docker

# 写 Dockerfile
cat > Dockerfile << 'DOCKEREOF'
FROM php:7.4-apache
RUN docker-php-ext-install mysqli pdo_mysql && \
    apt-get update && apt-get install -y unzip wget && \
    wget -O /tmp/pikachu.zip https://githubfast.com/zhuifengshaonianhanlu/pikachu/archive/refs/heads/master.zip && \
    unzip /tmp/pikachu.zip -d /tmp/ && \
    rm -rf /var/www/html/* && \
    cp -r /tmp/pikachu-master/* /var/www/html/ && \
    chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html && \
    rm -rf /tmp/pikachu-master /tmp/pikachu.zip && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
EXPOSE 80
CMD ["apache2-foreground"]
DOCKEREOF

# 构建 + 启动
docker build -t local/pikachu:1.0 .
docker run -d --name pikachu --restart unless-stopped -p 8086:80 local/pikachu:1.0
```

**Pikachu Docker 访问地址**：
```
http://192.168.108.128:8086/
```
首次访问点击「安装/初始化」完成数据库建表。

---

### 场景 D：目录存在但访问 HTTP 404（Pikachu）

**排查步骤同 SQLi-Labs，增加以下两点**：

```bash
# (a) 检查 Pikachu 配置文件 inc/config.inc.php 中数据库连接是否正确
cat /var/www/html/pikachu/inc/config.inc.php 2>/dev/null | grep -E "db|host|user|pass"
# 若 db 账号密码不对，改为当前 MariaDB 可用账号（如 leet/leet123 或 root/当前密码）
# 并确保 pikachu 库已存在（不存在则先 create database pikachu;）

# (b) Pikachu 有些版本要求开启 Apache rewrite
sudo a2enmod rewrite
sudo systemctl restart apache2

# (c) 查看错误日志
tail -n 30 /var/log/apache2/error.log
```

若 15 分钟仍不行 → 走「场景 C Docker 方案」兜底。

---

### 场景 E：两个靶场 HTTP 200 且关键字命中 → OK

**请完成以下最终功能验证（手动点一遍）**：
- SQLi-Labs：首页能看到 Less-1 ~ Less-75 列表，点 Less-1 传 `?id=1'` 能看到 SQL 报错或页面异常
- Pikachu：首页「漏洞测试」菜单齐全，随便选一个漏洞（如「SQL注入」→「数字型注入」）能正常打开页面

**然后把结果写入下方第三节。**

---

## 三、验证结果记录区（请执行完第一节命令后手动填写）

### 3.1 SQLi-Labs（Day086 靶场2）

| 检查项 | 结果（填 Y/N 或内容） |
|-------|----------------------|
| 目录 /var/www/html/sqli-labs/ 是否存在 | ____________________ |
| ls -la 下是否能看到 Less-1.php / index.php | ____________________ |
| curl HTTP 状态码 | ____________________ |
| grep 关键字命中数 | ____________________ |
| Apache2 服务 active? | ____________________ |
| MariaDB 服务 active? | ____________________ |
| **最终判定** | □ 正常可用 / □ 需排查（走场景 B） / □ 目录缺失（走场景 A） |

**最终访问地址确认**：
```
□  http://192.168.108.128/sqli-labs/           (Apache 原生 80)
□  http://192.168.108.128:8085/                (Docker 方式)
□  暂未部署（需补）
```

---

### 3.2 Pikachu（Day088 靶场4）

| 检查项 | 结果（填 Y/N 或内容） |
|-------|----------------------|
| 目录 /var/www/html/pikachu/ 是否存在 | ____________________ |
| ls -la 下是否能看到 index.php / install.php | ____________________ |
| curl HTTP 状态码 | ____________________ |
| grep 关键字命中数 | ____________________ |
| Apache2 服务 active? | ____________________ |
| MariaDB 服务 active? | ____________________ |
| inc/config.inc.php 数据库配置正确? | ____________________ |
| **最终判定** | □ 正常可用 / □ 需排查（走场景 D） / □ 目录缺失（走场景 C） |

**最终访问地址确认**：
```
□  http://192.168.108.128/pikachu/             (Apache 原生 80)
□  http://192.168.108.128:8086/                (Docker 方式)
□  暂未部署（需补）
```

---

### 3.3 验证时间与验证人

- 验证执行日期：____________________
- 验证人：____________________
- 备注 / 异常：
  ________________________________________________________
  ________________________________________________________

---

## 四、验证截图位置

请将验证过程与最终成功截图放到以下目录（不存在请创建）：

```
docs/labs/screenshots/sqli-labs/
  ├─ directory-ls.png            # ls -la /var/www/html/sqli-labs/ 结果
  ├─ curl-http-200.png           # curl HTTP 200 + 关键字输出
  ├─ less1-page.png              # Less-1 页面 + 传 id=1' 的 SQL 报错截图（若可用）
  └─ docker-ps-if-used.png       # 若用了 Docker 方式，附 docker ps 截图

docs/labs/screenshots/pikachu/
  ├─ directory-ls.png            # ls -la /var/www/html/pikachu/ 结果
  ├─ curl-http-200.png           # curl HTTP 200 + 关键字输出
  ├─ home-menu.png               # Pikachu 首页 + 漏洞测试菜单截图（若可用）
  └─ docker-ps-if-used.png       # 若用了 Docker 方式，附 docker ps 截图
```
