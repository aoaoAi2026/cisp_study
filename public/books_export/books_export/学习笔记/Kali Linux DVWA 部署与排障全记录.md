好的，我帮你整理了一份完整的操作文档，涵盖了我们这一小时内从遇到问题到最终解决的全过程。你可以保存为 `DVWA_部署记录.md` 或 `DVWA_setup_log.txt` 备用。

---

# Kali Linux DVWA 部署与排障全记录（2026-06-28）

## 1. 概述
- **环境**：Kali Linux（虚拟机），IP `192.168.108.128`
- **目标**：通过一键安装 `dvwa` 包，并配置 Apache 监听 `9111` 端口，使外部主机可通过 `http://192.168.108.128:9111/dvwa` 访问。
- **最终状态**：Apache 正常运行，DVWA 数据库初始化成功，可正常登录 `admin/password`。

---

## 2. 初始尝试与问题
### 2.1 使用 `php -S` 启动（失败）
```bash
sudo php -S 0.0.0.0:9111
```
- **问题**：DVWA 页面报数据库连接错误，因为缺少 PHP MySQL 扩展。
- **解决**：安装 `php-mysql` 并重启服务，但后来决定改用 Apache。

### 2.2 尝试使用 `dvwa-start` 命令
- **问题**：`dvwa-start` 默认绑定 80 端口，外部无法访问（因为虚拟机 NAT 或防火墙）。
- **决定**：将 Apache 端口改为 9111（此前 `php -S` 已验证该端口外网可通）。

---

## 3. 修改 Apache 监听端口为 9111
### 3.1 编辑配置文件
```bash
sudo nano /etc/apache2/ports.conf
```
将 `Listen 80` 改为：
```
Listen 0.0.0.0:9111
```

```bash
sudo nano /etc/apache2/sites-available/000-default.conf
```
将 `<VirtualHost *:80>` 改为：
```
<VirtualHost *:9111>
```

### 3.2 重启 Apache 报错
```bash
sudo systemctl restart apache2
```
**报错**：`Job for apache2.service failed`，但后来执行 `sudo apache2ctl configtest` 显示 `Syntax OK`，说明语法正确，可能是端口占用或服务未完全停止。

### 3.3 检查端口占用
```bash
sudo netstat -tulpn | grep 9111
```
之前运行的 `php -S` 占用了该端口，需要先停掉：
```bash
sudo pkill -f "php -S"
```

### 3.4 再次启动 Apache
```bash
sudo systemctl start apache2
sudo systemctl status apache2
```
状态 `active (running)`，但访问 `http://192.168.108.128:9111` 显示 Apache 默认欢迎页（`It works!`），说明 Apache 已启动，但未指向 DVWA。

---

## 4. 部署 DVWA 到 Apache 网站目录
### 4.1 查找 DVWA 安装位置
```bash
ls /usr/share/dvwa
```
确认存在 `index.php`、`config` 等文件。

### 4.2 创建软链接到 `/var/www/html`
```bash
sudo ln -s /usr/share/dvwa /var/www/html/dvwa
ls -l /var/www/html/dvwa   # 验证链接
```
显示 `lrwxrwxrwx 1 root root 15 ... /var/www/html/dvwa -> /usr/share/dvwa`

### 4.3 访问 DVWA 页面
浏览器访问 `http://192.168.108.128:9111/dvwa/login.php`，出现 **500 Internal Server Error**。

---

## 5. 排查 500 错误（数据库连接问题）
### 5.1 查看 Apache 错误日志
```bash
sudo tail -30 /var/log/apache2/error.log
```
**关键错误**：
```
PHP Fatal error: Uncaught mysqli_sql_exception: Access denied for user 'root'@'localhost'
```
表明配置文件中的数据库密码不正确。

### 5.2 检查 MySQL root 密码
```bash
mysql -u root -e "exit"
```
若提示 `Access denied`，说明 root 有密码；若成功退出，则密码为空。

在本例中，root 有密码，但 `config.inc.php` 中 `db_password` 为空，导致拒绝访问。

### 5.3 解决方案（二选一）

#### 方案 A：将 MySQL root 密码改为空（推荐，简单）
```bash
sudo mysql   # 用系统 root 免密登录
```
在 MySQL 命令行中执行：
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY '';
FLUSH PRIVILEGES;
EXIT;
```
验证：
```bash
mysql -u root -e "exit"   # 应无密码直接退出
```

#### 方案 B：把正确密码写入 `config.inc.php`
编辑配置文件：
```bash
sudo nano /usr/share/dvwa/config/config.inc.php
```
找到 `$_DVWA['db_password']` 一行，将空字符串改为实际密码（例如 `'your_password'`）。

### 5.4 重启 Apache
```bash
sudo systemctl restart apache2
```

---

## 6. 初始化 DVWA 数据库
### 6.1 访问设置页面
浏览器打开 `http://192.168.108.128:9111/dvwa/setup.php`
### 6.2 点击 `Create / Reset Database` 按钮
初始化成功后自动跳转登录页。

### 6.3 登录
默认账号 `admin` / 密码 `password`。

登录成功，DVWA 可正常使用。

---

## 7. 遇到的次要问题与忽略项
- **日志中的 `mprotect() failed [13] Permission denied`**：与 AppArmor 相关，不影响功能，暂不处理。
- **默认欢迎页干扰**：由于 `/var/www/html/index.html` 存在，访问根路径会显示欢迎页，但访问 `/dvwa` 已正常。
- **`dvwa-start` 命令不再使用**：因为手动修改了端口，该命令会重置配置，后续手动管理 Apache 即可。

---

## 8. 总结：当前正确的启动方式
### 8.1 手动启动所有服务
```bash
sudo systemctl start mysql
sudo systemctl start apache2
```
### 8.2 访问地址
- 外部：`http://<Kali-IP>:9111/dvwa`
- 本机：`http://127.0.0.1:9111/dvwa`

### 8.3 停止服务
```bash
sudo systemctl stop apache2 mysql
```

### 8.4 设置开机自启（可选）
```bash
sudo systemctl enable apache2 mysql
```

---

## 9. 附录：关键命令速查
- **查看 Apache 错误日志**：`sudo tail -f /var/log/apache2/error.log`
- **测试 Apache 配置语法**：`sudo apache2ctl configtest`
- **检查端口监听**：`sudo netstat -tulpn | grep 9111`
- **MySQL 无密码登录**：`sudo mysql`（使用系统 root）
- **修改 MySQL 密码**：`ALTER USER 'root'@'localhost' IDENTIFIED BY '新密码';`

---

## 10. 结语
经过此轮操作，DVWA 已成功部署在 Kali 虚拟机中，外部主机可通过 9111 端口访问。所有问题均已解决，记录可作日后参考或重装时快速复现。

---

**文档结束**  
记录时间：2026-06-28 22:00