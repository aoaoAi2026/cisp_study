---
day: 11
title: 应急响应全流程（Webshell）
phase: 第二阶段
difficulty: ⭐⭐ 基础
---

# Day 11：应急响应全流程（Webshell）

> **阶段**：第二阶段 · 实战进阶周（初级→中级岗达标） | **难度**：⭐⭐ 基础 | **课时**：2-3小时

---

## 📋 今日学习目标

1. **掌握Webshell的检测方法**：文件内容特征、时间戳分析、日志关联三管齐下
2. **落地执行PDCERF在Webshell场景的完整应用**：从发现到闭环每一步怎么做
3. **掌握Windows/Linux应急排查五项核心动作**：进程→服务→启动项→计划任务→日志
4. **能独立完成一次Webshell应急处置全流程**：遏制→清除→加固→报告
5. **输出《Webshell应急处置SOP》**：以后遇到Webshell不用慌，按SOP走

---

## 📖 核心知识讲解

### 一、Webshell是什么？——攻击者的"遥控器"

你可以把Webshell理解为：**攻击者偷偷插在你服务器上的一个USB遥控器**。

```
正常Web文件：
  index.php → 显示网页内容给用户看

Webshell：
  shell.php → 远程执行系统命令、上传下载文件、操控数据库
  
一句话概括：
  Webshell = 可以远程执行系统命令的Web脚本
```

**Webshell存在的标志**：
- Web目录下出现非开发人员上传的脚本文件（.php / .jsp / .asp / .aspx）
- 文件名通常伪装成正常文件：`config.php`、`cache.php`、`themes.php`
- 一句话木马最经典的形式：`<?php @eval($_POST['cmd']); ?>`

---

### 二、Webshell检测三招——"找遥控器"

#### 第一招：文件内容特征

```bash
# ① 搜索常见的一句话木马特征
find /var/www -name "*.php" -exec grep -l "eval" {} \;
find /var/www -name "*.php" -exec grep -l "base64_decode" {} \;
find /var/www -name "*.php" -exec grep -l "system\|exec\|shell_exec\|passthru\|popen\|proc_open" {} \;
find /var/www -name "*.php" -exec grep -l '\$_POST\|\$_GET\|\$_REQUEST' {} \;

# ② 找异常的PHP文件——正常业务PHP不太可能同时包含 eval 和 \$_POST
find /var/www -name "*.php" -exec grep -l "eval" {} \; | xargs grep -l '\$_POST'

# ③ 搜索混淆/编码的Webshell
find /var/www -name "*.php" -exec grep -lP '[^\x00-\x7F]{100,}' {} \;
# ↑ 找包含大量非ASCII字符的文件（常见于编码混淆的Webshell）
```

**经典一句话木马大全（面试必备）**：
```php
<?php @eval($_POST['cmd']); ?>                    // PHP 经典一话
<?php system($_GET['cmd']); ?>                    // PHP system
<?php @preg_replace("/abc/e", $_POST['cmd'], ""); ?>  // PHP preg_replace
<%@ Page Language="Jscript"%><%eval(Request.Item["cmd"]);%>  // ASPX
<%execute(request("cmd"))%>                        // ASP 经典
```

#### 第二招：时间戳分析

```bash
# ① 查最近修改的PHP文件
find /var/www -name "*.php" -mtime -3 -ls          # 最近3天修改的
find /var/www -name "*.php" -mmin -120 -ls         # 最近2小时修改的

# ② 查比网站部署时间更新的文件
# 假设网站是1月1日部署的：
touch -t 202601010000 /tmp/deploy_time
find /var/www -name "*.php" -newer /tmp/deploy_time -ls

# ③ 对比——所有文件中最"新"的几个
ls -lt /var/www/html/ | head -20
```

#### 第三招：日志关联

```bash
# ① 在Web日志中找"上传"+"访问.php"的关联
grep "POST" access.log | grep "upload"    # 找上传请求
grep "\.php" access.log | grep -v "index\|login\|admin"  # 非标准PHP访问

# ② 同一IP在短时间内先POST上传→再GET访问对应文件
# 手工关联：先找上传的POST，记录时间和文件名 → 再找对应文件的GET访问

# ③ 找User-Agent异常或为空的.php文件访问
grep "\.php" access.log | grep -v "Mozilla" | awk '{print $1,$7,$11}'
```

---

### 三、Windows/Linux应急排查五项——"找后门的5个必查点"

#### Linux 五项排查

```bash
# ① 进程排查
ps auxf                          # 看进程树（f=forest格式，可以看到父子关系）
ps aux --sort=-%cpu | head -10   # CPU占用TOP10
ps aux --sort=-%mem | head -10   # 内存占用TOP10
# 重点看：以www-data/apache/nginx用户运行的bash/sh/python/perl

# ② 网络连接排查
netstat -anp | grep ESTABLISHED | grep -v "127.0.0.1"
ss -anp | grep ESTAB
# 重点看：非80/443端口的出站连接，尤其是境外IP

# ③ 启动项排查
systemctl list-units --type=service --state=running
cat /etc/rc.local
# 重点看：未知的服务名、异常的启动命令

# ④ 计划任务排查
crontab -l                        # 当前用户
for user in $(cat /etc/passwd | grep -v nologin | cut -d: -f1); do
  echo "=== $user ==="
  crontab -l -u $user 2>/dev/null
done                              # 遍历所有用户的crontab
cat /etc/crontab
ls -la /etc/cron.*                # 系统级cron目录

# ⑤ 用户和登录排查
last -n 30                        # 最近30次登录记录
cat /etc/passwd | grep -E "/bin/bash|/bin/sh"
who                               # 当前登录用户
grep "Accepted" /var/log/secure   # SSH登录成功记录
```

#### Windows 五项排查

```
① 进程排查
  tasklist /v                      # 详细进程列表
  tasklist /svc                    # 进程对应的服务
  wmic process get Name,ProcessId,CommandLine /format:csv
  # 重点看：陌生进程名、cmd.exe/powershell被非正常调用

② 网络连接排查
  netstat -ano | findstr ESTABLISHED
  netstat -ano | findstr LISTENING
  # 重点看：非80/443端口的监听、向境外IP的连接

③ 启动项排查
  msconfig → 启动选项卡
  regedit → HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
  regedit → HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
  # 重点看：可疑路径、随机文件名

④ 计划任务排查
  schtasks /query /fo LIST /v | more
  # 重点看：未知任务名、以SYSTEM权限运行的非系统任务

⑤ 用户和登录排查
  net user                         # 查看所有用户
  net localgroup administrators    # 管理员组成员
  query user                       # 当前登录会话
  事件查看器 → 安全 → 筛选4624/4625
```

---

### 四、Webshell应急响应——PDCERF完整应用

```
═══════════════════════════════════════════════
    Webshell 应急处置 SOP
═══════════════════════════════════════════════

【P - 准备】
□ 确认应急联系人列表（系统管理员、应用负责人、网络管理员）
□ 准备取证工具（备份脚本、恶意文件扫描器）
□ 确认Web目录路径和应用架构
□ 确保有最近的代码备份和数据库备份

【D - 检测】
□ 确认Webshell文件位置、创建时间、文件hash
□ 通过Web日志确认上传时间、来源IP、上传方式
□ 通过系统日志确认Webshell是否被执行、执行过什么命令
□ 检查是否有权限提升（如www-data执行了sudo）
□ 确认影响范围（只有Webshell，还是已被横向移动？）

【C - 遏制】
动作清单（按优先级执行）：
□ 1. 立即将受影响Web服务器从负载均衡中摘除（切换维护页）
□ 2. 备份证据：复制Webshell样本、导出相关日志、备份系统状态
       cp -r /var/www /backup/evidence_20260618/
       netstat -anp > /backup/netstat_20260618.txt
       ps auxf > /backup/ps_20260618.txt
□ 3. 防火墙封禁攻击源IP
□ 4. 检查是否有来自该服务器的异常外连（C2通信）
□ 5. 禁用被入侵的Web服务用户（如www-data的shell）
       usermod -s /sbin/nologin www-data（极端情况使用）

【E - 根除】
□ 1. 删除确认的Webshell文件（保留证据备份）
     rm /var/www/html/uploads/shell.php
□ 2. 全盘搜索其他可能的Webshell
     find /var/www -name "*.php" -mtime -7 -exec grep -l "eval\|system\|base64_decode" {} \;
□ 3. 检查是否有新增的系统用户
□ 4. 检查计划任务和启动项是否有恶意添加
□ 5. 【最关键】修复文件上传漏洞
     - 限制上传文件类型（白名单：只允许.jpg/.png/.pdf）
     - 上传文件存储目录禁止脚本执行
     - 对上传文件内容做安全检查
□ 6. 如果发生了提权，收紧sudo权限配置
□ 7. 重置所有相关账户密码和SSH密钥

【R - 恢复】
□ 1. 从Git/备份恢复干净的网站代码
□ 2. 验证Webshell已清除、漏洞已修复
□ 3. 测试网站功能正常（内部测试）
□ 4. 灰度恢复上线（先内部验证→20%流量→100%流量）
□ 5. 上线后加强监控：
     - 文件完整性监控（监控Web目录文件变更）
     - Web日志实时告警（异常.php文件访问）

【F - 跟踪】
□ 1. 编写《Webshell应急处置报告》
     - 包含：时间线、根因、影响、处置过程、改进措施
□ 2. 组织复盘会议
□ 3. 更新应急响应预案
□ 4. 对全站Web应用进行安全扫描
□ 5. 将发现的新IOC加入黑名单
═══════════════════════════════════════════════
```

---

## 🔧 实操任务

### 任务1：Webshell文件分析（20分钟）

分析以下PHP文件，判断哪些是Webshell，哪些不是：

```php
// 文件A
<?php
$conn = mysqli_connect("localhost","root","password","db");
$result = mysqli_query($conn,"SELECT * FROM users");
while($row = mysqli_fetch_array($result)){
    echo $row['name'];
}
?>

// 文件B
<?php @eval($_POST['x']); ?>

// 文件C
<?php
$page = $_GET['page'];
include("templates/$page.html");
?>

// 文件D
<?php
$f = $_POST['file'];
echo file_get_contents("/var/www/uploads/$f");
?>

// 文件E
<?php system($_GET['cmd']); ?>
```

```
分析结果：
A - 正常数据库查询文件（非Webshell）
    但注意：如果$conn的用户名密码是明文硬编码的，存在信息泄露风险

B - 明确的一句话木马Webshell
    核心特征：eval($_POST['x']) —— 执行任意通过POST传入的PHP代码
    危害程度：最高，攻击者可通过此文件执行任意PHP代码

C - 可能存在文件包含漏洞（非Webshell但很危险）
    如果$page参数未经过滤，攻击者可做路径穿越：?page=../../etc/passwd
    不一定是Webshell，但可能是攻击入口

D - 可能存在路径穿越漏洞（非Webshell但很危险）
    如果$f参数未经过滤，攻击者可读取任意文件：?file=../../etc/passwd
    不一定是Webshell，但可能被利用来读取敏感信息

E - 明确的系统命令执行Webshell
    核心特征：system($_GET['cmd']) —— 执行任意系统命令
    危害程度：最高
```

### 任务2：模拟Webshell应急响应（25分钟）

**场景**：公司官网（Ubuntu + Nginx + PHP）被发现有Webshell。文件位置：`/var/www/html/assets/images/logo.php`。内容为：`<?php @eval($_REQUEST['x']); ?>`。通过Web日志确认为外部IP 45.33.32.156 在昨天下午上传。

请按PDCERF执行完整的应急处置：

```
【P - 准备】已完成：
  - 网站代码有Git备份
  - 有每日数据库备份
  - 应急联系人已确认

【D - 检测】
  确认：
  ○ Webshell文件：/var/www/html/assets/images/logo.php
  ○ 创建时间：昨天 15:30（通过stat logo.php确认）
  ○ 上传源IP：45.33.32.156
  ○ 上传方式：通过 /admin/upload.php（文件上传功能未校验类型）
  ○ 执行记录：access.log中昨晚23:00有多次对logo.php的POST请求
  ○ 提权检查：secure.log中www-data在23:05执行了sudo命令
  ○ 影响范围：Web服务器已被完全控制（www-data提权到root）

【C - 遏制】
  □ 1. Nginx切换维护页面，摘除服务器（vim nginx.conf → return 503）
  □ 2. 备份证据：
       cp logo.php /tmp/evidence/
       cp /var/log/nginx/access.log /tmp/evidence/
       netstat -anp > /tmp/evidence/netstat.txt
       ps auxf > /tmp/evidence/ps.txt
       crontab -l > /tmp/evidence/cron.txt
  □ 3. iptables -I INPUT -s 45.33.32.156 -j DROP
  □ 4. netstat -anp | grep www-data → 检查异常外连

【E - 根除】
  □ 1. rm /var/www/html/assets/images/logo.php
  □ 2. find /var/www -name "*.php" -mtime -7 | xargs grep -l "eval\|system\|base64_decode"
      → 确认无其他Webshell
  □ 3. cat /etc/passwd | grep bash → 确认无新增用户
  □ 4. cat /etc/sudoers → 收紧www-data的sudo权限
  □ 5. 修复文件上传漏洞（upload.php）
      → 添加白名单：仅允许 jpg, png, gif, pdf
      → 上传目录添加 .htaccess：禁止执行PHP
  □ 6. passwd → 修改root密码
  □ 7. 重新生成SSH密钥

【R - 恢复】
  □ 1. git checkout（恢复到干净代码）
  □ 2. 重新应用upload.php的安全修复
  □ 3. 内部测试完毕
  □ 4. 灰度上线 → 确认正常 → 全量上线
  □ 5. 部署文件完整性监控（如 osquery/inotify）

【F - 跟踪】
  □ 1. 编写应急响应报告
  □ 2. 组织复盘会议（时间线+根因+改进）
  □ 3. 更新《Webshell应急处置SOP》
  □ 4. 全站安全扫描
```

### 任务3：Linux五项排查实战（15分钟）

在你的测试环境执行Linux五项排查：

```bash
# ① 进程
ps auxf
# 看看有没有以www-data运行的bash/sh

# ② 网络
netstat -anp | grep -v "127.0.0.1\|::1" | grep ESTABLISHED
# 看看有没有非本地的外连

# ③ 启动项
systemctl list-units --type=service | grep -v "loaded active running"

# ④ 计划任务
crontab -l

# ⑤ 用户
last -n 20
who
```

---

## ✅ 验收标准

- [ ] 能识别常见的一句话木马（PHP/ASP/JSP至少各知道一种形式）
- [ ] 能执行Linux五项排查并解读输出
- [ ] 能在模拟Webshell场景中按PDCERF完整走通全流程
- [ ] 能输出《Webshell应急处置SOP》
- [ ] 知道怎么找Webshell的上传来源（通过Web日志）

---

## 📝 今日小结

今天你把Day 5学的PDCERF框架落地到了最经典的应急场景——Webshell。从理论到实战，你完成了从"知道PDCERF"到"会用PDCERF"的跨越。

三个核心：
1. **检测Webshell三招**：看内容（eval/system关键词）、看时间（新文件）、看日志（上传+访问关联）
2. **排查五项必查**：进程→网络→启动项→计划任务→用户，一个都不能少
3. **根除的关键不是删文件，是堵漏洞**——删了Webshell不修上传漏洞=白干

---

## 📚 延伸阅读

- WebShell检测工具：D盾、河马、VirusTotal
- PHP Webshell特征库
- ATT&CK T1505.003（Webshell）技术细节

---

## 🎯 蓝队面试高频题（Day 11 主题）

**Q1：发现服务器被上传了Webshell，你的第一步操作是什么？**

> 回答：第一步是遏制——立即把受影响服务器从负载均衡摘除，防止攻击者继续操作或进一步渗透。同时备份证据：复制Webshell样本、导出进程列表和网络连接快照、备份相关日志。很多人第一反应是"删文件"，这是错的——先遏制（止血），再取证，最后才根治。删了文件但没保留证据，就无法分析攻击来源和根因。

**Q2：怎么在一台Linux服务器上排查是否还有其他Webshell？**

> 回答：多管齐下：①内容搜索——`find /var/www -name "*.php" -exec grep -lE "eval|system|shell_exec|passthru|base64_decode" {} \;` 找出含危险函数的文件；②时间搜索——`find /var/www -name "*.php" -mtime -7` 找最近一周修改的PHP文件；③日志关联——在access.log中搜索对非标准.php文件的访问记录；④大小异常——Webshell通常比正常文件大（含加密payload）。

**Q3：你删除Webshell文件后就算处置完毕了吗？为什么？**

> 回答：不算。删除文件只是"表面清理"。真正完整的处置还需要：①检查攻击者是否留了多个后门（通常会留多个）；②检查攻击者是否提权、是否新增用户账户；③检查计划任务和启动项是否有持久化；④最重要的是修复被利用的漏洞（如文件上传未限制类型），否则攻击者可以用同一方式再次上传。只删文件不修漏洞="打扫了房间但没换锁，小偷还有钥匙"。

---

## ⚠️ 新手常见误区纠正

1. **误区**："发现Webshell，第一反应是删了它"
   - **真相**：先遏制+取证，再删除。直接删除会：①丢失证据（无法溯源攻击来源）；②可能触发攻击者的"自毁"机制；③没保留样本就无法分析攻击手法
   - **正确做法**：先备份Webshell样本和系统状态 → 摘除服务器 → 再开始排查和清除

2. **误区**："找了1个Webshell文件，删了就认为干净了"
   - **真相**：攻击者通常会上传多个后门（以防被发现后清除）。找到一个意味着可能还有更多
   - **正确做法**：全盘搜索所有最近修改的可疑文件，全面排查进程/计划任务/启动项

3. **误区**："查Webshell就用grep eval就完了"
   - **真相**：很多Webshell用编码/加密/gzinflate等方法混淆，单纯grep eval查不到
   - **正确做法**：多维度排查——内容特征+时间特征+大小特征+访问日志+进程审计

---

## 🏋️ 额外实操挑战

### 挑战1：编写Webshell扫描脚本
写一个shell脚本 `scan_webshell.sh`，对指定目录递归扫描，输出所有疑似Webshell的文件路径和可疑特征。

### 挑战2：收集Webshell样本特征
在网上搜索5种不同类型的Webshell代码，分析它们的特征和检测方法。

### 挑战3：设计Webshell监控方案
设计一个"实时发现Webshell"的监控方案（包含：用什么工具、监控哪些指标、告警规则如何写）。

---

## 🎯 实战思维训练

### "如果是你，你怎么防？"——Webshell专题

- **预防层**：
  - 文件上传严格白名单（类型+内容双重校验）
  - 上传目录禁用脚本执行（nginx/apache配置）
  - 最小化Web服务用户权限（去掉sudo）
  
- **检测层**：
  - 文件完整性监控（inotify/osquery监控Web目录文件变更）
  - Web日志中对非标准.php文件访问告警
  - 进程审计（www-data用户不应执行bash）

- **响应层**：
  - 预置Webshell应急处置SOP
  - 备好扫描脚本，一键全盘搜索Webshell

- **复盘层**：
  - 每次Webshell事件做完整复盘，形成案例库

---

## 📈 学习效果自测

1. 说出至少3种PHP一句话木马的形式
2. Linux应急排查的五项核心动作是哪些？
3. 发现Webshell后，为什么遏制（C）要在根除（E）之前？遏制时要注意什么？
4. 如何通过Web日志找到攻击者的上传方式和时间？
5. 删了Webshell文件后发现第二天又出现了，可能是什么原因？

---

## 🔗 知识链接

- **前置依赖**：Day 5 PDCERF模型、Day 6 Linux命令、Day 10 多源关联
- **后续关联**：Day 24-25 护网模拟中的Webshell应急
- **岗位对标**：中级岗必须能独立完成Webshell全流程应急处置

---

## 📓 学习笔记模板

```
【知识卡片：Webshell应急响应】
日期：

检测三招：
1. 内容特征 → grep eval|system|base64_decode
2. 时间特征 → find -mtime -7
3. 日志关联 → 上传POST + 访问GET 关联

排查五项（Linux）：
① ps auxf    ② netstat  ③ systemctl+crontab
④ last+who   ⑤ passwd+secure日志

PDCERF要点：
C遏制→摘除服务器+备份证据（不是删文件！）
E根除→删Webshell+搜全盘+修漏洞（不是只删文件！）
F跟踪→报告+复盘+更新SOP

一句话木马速查：
PHP: <?php @eval($_POST['x']); ?>
ASP: <%execute(request("cmd"))%>
JSP: <%Runtime.getRuntime().exec(request.getParameter("cmd"));%>

---

## 🔬 深度扩展：Webshell的"三十六变"——高级检测技巧

### 混淆型Webshell检测

现代Webshell已经不再是简单的 `<?php @eval($_POST['cmd']); ?>` 了。攻击者会使用各种混淆手法：

```
混淆手法1：字符串拼接
  <?php 
  $a = 'ev'.'al';
  $b = $_POST['x'];
  $a($b);
  ?>
  检测：grep单纯搜索eval查不到！需要AST分析或运行时检测

混淆手法2：编码执行
  <?php
  eval(base64_decode($_POST['x']));
  ?>
  → POST参数x = c3lzdGVtKCdpZCcp → 解码后 = system('id')
  检测：要搜 base64_decode 配合 $_POST

混淆手法3：变量变量
  <?php
  $x = 'assert';
  $y = 'x';
  $$y($_POST['cmd']);
  ?>
  检测：极难通过静态模式匹配发现

混淆手法4：利用回调函数
  <?php
  array_map('assert', array($_POST['x']));
  ?>
  <?php
  preg_replace('/.*/e', $_POST['x'], '');
  ?>
  检测：需要搜索危险的回调函数模式

混淆手法5：利用反序列化
  <?php
  class Shell {
      function __destruct() {
          system($this->cmd);
      }
  }
  $obj = unserialize($_POST['data']);
  ?>
  检测：需搜索unserialize配合危险函数

混淆手法6：文件包含型
  <?php
  include($_GET['page'] . '.php');
  ?>
  看似是文件包含漏洞，但攻击者配合日志污染或文件上传，
  可以实现Webshell功能
```

### Webshell检测的"纵深防线"

```
防线1：静态文件扫描（上传时）
  - 文件类型白名单：只允许.jpg/.png/.pdf/.docx
  - 文件内容扫描：用杀毒引擎扫上传内容
  - 文件头校验：检查真实MIME类型
  - 禁止多层扩展名：拒绝 .php.jpg 这种文件名

防线2：文件系统监控（运行时）
  - inotify/osquery：监控Web目录文件创建/修改事件
  - 对新创建的.php/.jsp文件立刻触发告警
  - 对Web目录下的可执行权限变更告警

防线3：进程行为检测（运行时）
  - Web服务用户（www-data）不应该执行bash/sh/python
  - 监控Web服务用户创建的子进程
  - 检测Web服务用户是否发起了网络连接（正常Web进程只响应请求）

防线4：网络行为检测（运行时）
  - Web服务器主动发起的出站连接 → 不正常
  - Web服务器连接非标准端口 → 高度可疑
  - Web服务器连接境外IP → 可能是C2通信

防线5：日志关联（事后检测）
  - Web日志中.php文件的POST访问（Webshell交互特征）
  - 同一文件先POST上传、后GET/POST访问的关联
  - 非浏览器的User-Agent访问.php文件
```

---

## 🛠️ Windows 应急排查深度补充

### Windows 日志分析进阶

```
关键事件ID速查扩展表：
┌────────┬──────────────────────────────┬──────────────────────────┐
│事件ID   │ 含义                          │ 蓝队需要关注的字段       │
├────────┼──────────────────────────────┼──────────────────────────┤
│ 4624   │ 登录成功                       │ 登录类型、源IP、进程名    │
│ 4625   │ 登录失败                       │ 失败原因、源IP、账户名    │
│ 4648   │ 使用显式凭据登录(runas)        │ 目标账户、进程名          │
│ 4672   │ 分配特殊权限                   │ 权限名（如SeDebugPrivilege）│
│ 4688   │ 新进程创建                     │ 进程名、命令行、父进程PID │
│ 4689   │ 进程终止                       │ 进程名、退出状态          │
│ 4697   │ 服务安装（可能是后门）         │ 服务名、服务文件名        │
│ 4698   │ 计划任务创建                   │ 任务名、任务内容          │
│ 4700   │ 计划任务启用                   │ 任务名                    │
│ 4702   │ 计划任务更新                   │ 任务名、修改内容          │
│ 4720   │ 用户账户创建                   │ 新账户名                  │
│ 4722   │ 用户账户启用                   │ 账户名                    │
│ 4728   │ 成员加入安全全局组             │ 成员名、目标组            │
│ 4732   │ 成员加入安全本地组             │ 成员名、目标组            │
│ 4740   │ 用户账户被锁定                 │ 账户名、来源计算机        │
│ 4768   │ Kerberos TGT请求              │ 账户名、加密类型、源IP    │
│ 4769   │ Kerberos ST请求               │ 账户名、SPN、加密类型     │
│ 4776   │ NTLM认证（可能是PTH攻击）      │ 源工作站、账户名          │
│ 4798   │ 枚举用户本地组成员             │ 操作者账户                │
│ 4799   │ 枚举安全本地组成员             │ 操作者账户                │
│ 5140   │ 网络共享访问                   │ 共享路径、源IP            │
│ 5145   │ 网络共享对象访问(详细)         │ 共享路径、相对路径、源IP  │
│ 5156   │ Windows过滤平台允许连接       │ 方向、源IP、目标IP、端口  │
│ 5158   │ WFP允许本地端口绑定           │ 进程ID、端口              │
└────────┴──────────────────────────────┴──────────────────────────┘
```

### Windows 应急响应一键检查脚本

```powershell
# Windows应急响应一键检查 PowerShell脚本
# 以管理员权限运行

Write-Host "=== Windows 应急响应检查 ===" -ForegroundColor Red

# 1. 进程检查
Write-Host "`n[1] 进程信息..." -ForegroundColor Yellow
Get-Process | Select-Object Name, Id, CPU, StartTime | Sort-Object CPU -Descending | Select-Object -First 10
Write-Host "`n无签名进程：" -ForegroundColor Yellow
Get-Process | ForEach-Object { 
    try { 
        $sig = Get-AuthenticodeSignature $_.Path
        if ($sig.Status -ne "Valid") { Write-Host "$($_.Name) ($($_.Id)) - 无有效数字签名" }
    } catch {}
}

# 2. 网络连接检查
Write-Host "`n[2] 网络连接..." -ForegroundColor Yellow
netstat -ano | findstr ESTABLISHED
netstat -ano | findstr LISTENING | findstr -v "127.0.0.1"

# 3. 启动项检查
Write-Host "`n[3] 启动项..." -ForegroundColor Yellow
Get-CimInstance Win32_StartupCommand | Select-Object Name, Command, Location, User

# 4. 计划任务检查
Write-Host "`n[4] 计划任务..." -ForegroundColor Yellow
Get-ScheduledTask | Where-Object { $_.State -eq "Ready" -or $_.State -eq "Running" } | 
    Select-Object TaskName, State | Sort-Object TaskName

# 5. 用户账户检查
Write-Host "`n[5] 用户账户..." -ForegroundColor Yellow
Get-LocalUser | Select-Object Name, Enabled, LastLogon
Write-Host "`n管理员组成员：" -ForegroundColor Yellow
Get-LocalGroupMember -Group "Administrators"

# 6. 服务检查
Write-Host "`n[6] 服务..." -ForegroundColor Yellow
Get-Service | Where-Object { $_.Status -eq "Running" -and $_.StartType -eq "Automatic" } |
    Select-Object Name, DisplayName | Sort-Object Name

# 7. 最近修改的文件
Write-Host "`n[7] 最近24小时修改的可执行文件：" -ForegroundColor Yellow
Get-ChildItem C:\ -Recurse -Include *.exe,*.dll,*.bat,*.ps1,*.vbs -ErrorAction SilentlyContinue |
    Where-Object { $_.LastWriteTime -gt (Get-Date).AddHours(-24) } |
    Select-Object FullName, LastWriteTime

# 8. 安全日志快速查询
Write-Host "`n[8] 最近10条登录失败：" -ForegroundColor Yellow
Get-WinEvent -LogName Security -MaxEvents 500 | 
    Where-Object { $_.Id -eq 4625 } | 
    Select-Object -First 10 TimeCreated, 
        @{N='User';E={$_.Properties[5].Value}},
        @{N='SourceIP';E={$_.Properties[18].Value}}

Write-Host "`n检查完成！" -ForegroundColor Green
```

---

## 🧪 Webshell应急——从发现到关闭的黄金15分钟

### 实战时间线演练

```markdown
以下是你在一线值守中的真实应急时间线。请用手表计时，模拟每一步：

00:00 — EDR/SIEM告警："Web-03服务器 /var/www/uploads/ 目录出现新文件 image.php"
00:01 — 你查看文件内容：发现 <?php @eval($_POST['cmd']);?> → 确认为Webshell
00:02 — 立即执行遏制：在网络层隔离Web-03（保留SSH访问以便取证）
        iptables -A INPUT -s !192.168.1.0/24 -j DROP  # 只允许管理网络访问
00:03 — 通知主管："Web-03确认被上传Webshell，正在处置，已隔离"
00:05 — 取证第一步：保存关键证据
        ps auxf > /tmp/forensic/processes.txt           # 进程树
        netstat -anp > /tmp/forensic/connections.txt    # 网络连接
        last -20 > /tmp/forensic/logins.txt             # 登录记录
        crontab -l > /tmp/forensic/crontab.txt          # 定时任务
00:08 — 取证第二步：找到攻击入口
        grep "image.php" /var/log/nginx/access.log      # 谁上传的？
        # → 发现：45.33.32.156 POST /upload.php → 上传了image.php
        grep "45.33.32.156" /var/log/nginx/access.log | grep "45.33.32.156" | grep "upload.php"
00:10 — 取证第三步：攻击者通过Webshell做了什么？
        grep "image.php" /var/log/nginx/access.log      # 所有对webshell的请求
        # → 发现攻击者执行了：id、whoami、wget后门、添加SSH公钥
00:12 — 根除操作：
        删除Webshell文件（保留备份副本）
        全盘搜索其他新建php/jsp文件
        删除攻击者添加的SSH公钥
        删除新增的crontab条目
        删除新增的系统用户
00:14 — 修复入口：
        在upload.php添加文件类型白名单
        上传目录添加 .htaccess 禁止执行PHP
        重置所有相关密码
00:15 — 向主管汇报："Web-03已处置完成。攻击者通过upload.php上传webshell，
        执行了信息收集和后门安装，但未发现横向移动和数据外传。入口已修复。"
```

---

## 🧪 应急响应"事后复盘"模板——让每一次应急都成为团队的资产

每次应急响应结束后，在48小时内完成这份复盘。不填=白做了：

```markdown
═══════════════════════════════════════════════
  应急响应事后复盘（After Action Review）
═══════════════════════════════════════════════

事件编号：INC-2024-____  |  日期：2024-__-__  |  复盘人：____

【事件概要】（一句话）
  _________________________________________________

【时间线】
  攻击开始时间：________  蓝队发现时间：________  MTTD：____分钟
  检测开始时间：________  遏制完成时间：________  MTTC：____分钟
  处置完成时间：________  总耗时：____小时____分钟

【我们做对了什么？】（保持！下次继续这样做）
  ① _________________________________________________
  ② _________________________________________________
  ③ _________________________________________________

【我们做错了什么？】（改进！下次不能再犯）
  ① _________________________________________________
  ② _________________________________________________
  ③ _________________________________________________

【如果重来一次，我会…】（最宝贵的思考）
  ① _________________________________________________
  ② _________________________________________________

【检测缺口】（为什么没在更早的阶段发现？）
  □ 没有这个检测能力 → 需要新增：_________________
  □ 有检测但规则没生效 → 原因：_________________
  □ 有告警但被忽略了 → 原因：_________________

【此次事件的IOC】（供未来检测使用）
  IP地址：________________________________________
  域名：__________________________________________
  文件Hash（MD5/SHA256）：_________________________
  其他指标（URL路径/注册表键值/进程名）：_________

【SOP需要更新吗？】
  □ 不需要，现有SOP已足够
  □ 需要更新：在SOP第____步增加 _________________
  
【分享给团队的一句话经验】
  _________________________________________________
═══════════════════════════════════════════════
```

**复盘的真实案例：**

```
INC-2024-0531复盘摘要：

我们做对了：① Web-03隔离速度很快（从发现到隔离<3分钟）；② 上报路径清晰（组长在发现后5分钟内被通知）；③ 取证步骤完整（没有遗漏关键证据）

我们做错了：① 第一次处置只检查了Web-03，没有排查攻击者是否横向移动到了Web-04和Web-05（直到第二天才发现另外两台也被黑）——这是本次应急最大的教训；② 没有立刻封锁攻击IP的外网出站能力（攻击者在被隔离的服务器上仍然能通过跳板C2通信）；③ 事后复盘推迟了整整一周——很多细节已经记不清了

如果重来一次：我会在确认Web-03被getshell后，立刻对同网段的所有Web服务器（Web-01到Web-06）做进程列表和网络连接的批量检查——从这台03的root权限来看，攻击者极有可能已经横向移动了

检测缺口：文件完整性监控缺失——攻击者上传Webshell已经超过72小时，如果当时有FIM（File Integrity Monitoring），在文件被创建的3分钟内就应该告警

一句话经验：一台机器被getshell后，不要只查这一台——攻击者的横向移动比你想象的要快得多
```

---

## ⚡ 应急响应者必知的"三个不"

> **不慌张**：你是收到告警的人，也是第一个行动的人。你慌了对整个事件处置都是灾难。深呼吸，按PDCERF一步一个脚印来。
>
> **不假设**：不要假设"攻击者只在这一台机器上"，不要假设"他只上传了一个Webshell"，不要假设"日志是完整的"。应急响应的第一原则是"Assume Breach, Assume Worst"（假设已被入侵，假设最坏情况）。
>
> **不拖延**：确认Webshell存在后的每一分钟、攻击者可能都在扩大战果。处置和调查可以并行——一边隔离做遏制，一边取证做溯源。不要等"调查清楚再处置"，因为等你调查清楚，攻击者可能已经把数据传走了。

---

## 🚑 应急响应中最容易犯的"5个致命错误"——提前知道=提前避免

以下每个错误都是真实发生过的，提前记下来可以救命：

```markdown
错误1：直接删除Webshell，不做任何取证
  危害：你以为"清理干净了"，但你已经销毁了所有证据。
        → 无法知道攻击者通过webshell做了什么
        → 无法知道攻击者还留了哪些后门
        → 无法确认攻击者是否已横向移动
        → 如果涉及法律追溯，你毁了关键证据
  正确做法：
    → 第一步：给webshell及其所在目录做完整备份（tar+sha256校验）
    → 第二步：记录webshell的创建时间、所有者、权限
    → 第三步：分析webshell的代码（它是怎么和C2通信的？有哪些功能？）
    → 第四步：检查webshell创建时间前后的所有Web日志，还原攻击者行为
    → 第五步：只有确认完整取证后，才能删除webshell

错误2：发现一台服务器被入侵，只处理这一台
  危害：攻击者可能已经横向移动到了同网段的其他服务器。
        你清了Web-01 → 攻击者从Web-02重新进来 → 白忙了。
  正确做法：
    → 发现服务器A被入侵→立刻批量检查同网段所有服务器是否有同样特征
    → 脚本化排查（不要一台台手动登）：
      for host in web-0{1..10}; do
        ssh $host "find /var/www -name '*.php' -mtime -1 -ls"
      done
    → 即使没发现，也要持续监控（攻击者可能看到你清理了A，暂时躲起来了）

错误3：应急时"急中生乱"——同时做太多事
  危害：同时做5件事 → 每件都做了一半 → 什么都没做好。
        比如一边查日志，一边删文件，一边封IP，一边打电话报告 →
        结果日志查错了、文件删错了、IP封错了。
  正确做法：
    → PDCERF是线性流程——先遏制扩散，再逐阶段推进
    → 如果只有你一个人 → 做完一件事再做下一件，不要同时做
    → 明确优先级：遏制扩散 > 收集证据 > 分析溯源 > 清除加固

错误4：惊慌失措——"怎么办怎么办"循环
  危害：在"确认这是真实攻击"后陷入恐慌，大脑空白，手忙脚乱。
        这相当于给了攻击者更多的时间来扩大战果。
  正确做法：
    → 深呼吸3秒（这是技术动作，不是鸡汤）
    → 打开你的应急响应checklist（Day 11的PDCERFchecklist）
    → 按步骤走，不要自己"思考"下一步该干什么
    → 如果你的checklist不够详细 → 事后补充，但此刻先按现有步骤走

错误5：瞒报或延迟上报——"我先自己解决，不给领导添麻烦"
  危害：你一个人应对P0事件，没有支援，事件处理不及时。
        领导从别的地方（如业务部门投诉）知道了这件事 → 
        你不但没处理好事件，还失去了领导的信任。
  正确做法：
    → 确认P0事件后 → 5分钟内通知直接上级
    → 报告格式要简短清晰："在X服务器发现Y类型的入侵，我已做了Z处置，
      需要以下支援：1...2...3..."
    → "升级"不是"推卸责任"，是"专业素养"的体现
```

---

## 🔒 应急响应的"法律边界"——什么能做，什么绝对不能做

应急中你可能接触敏感数据、查看用户文件、截取系统状态——每一步都可能触及法律和隐私边界。以下红线必须遵守：

```markdown
【绝对红线——做了可能坐牢的事】

红线1：未经授权查看用户私人数据
  场景：你发现某员工电脑有异常外联→你远程登上去看他桌面→无意中打开了他的私人微信聊天记录
  → 即使是公司设备，你也不能查看员工的私人通信内容！
  → 正确做法：只检查安全的、与事件相关的系统信息（进程、网络、日志），不触碰个人文件

红线2：利用取证权限做工作之外的事
  场景：你在做应急取证时顺便浏览了公司高管的邮件→"好奇他现在在谈什么项目"
  → 这是严重的职业道德和法律问题！取证权限仅用于应急目的。
  → 正确做法：取证期间的操作必须严格记录在案，每一条命令都有安全事件的业务目的

红线3：擅自对外公开安全事件细节
  场景：你处理了一个很酷的APT事件→在朋友圈/技术社区描述了事件细节→
       被人根据细节推测出是你们公司→竞争对手利用此信息打击你们
  → 所有安全事件的细节都是公司机密！
  → 正确做法：对外分享之前必须经过法务/合规/安全主管审批，做彻底的脱敏

红线4：私自保留取证数据
  场景：你把应急取证中的日志、内存dump、pcap拷到自己U盘→"回家继续分析方便"
  → 取证数据包含敏感信息，离开公司环境是严重违规
  → 正确做法：所有取证数据只能在公司指定的安全环境中处理和分析

红线5：冒充攻击者进行"反击"（Hack Back）
  场景：你溯源到了攻击者的C2服务器→你想"反攻"回去→黑了攻击者的服务器
  → 这是违法的！即使对方是攻击者，你也没有法律授权去攻击他的系统！
  → 正确做法：收集所有证据→移交给执法部门→由执法部门按法律程序处理
```

**应急响应中的合法操作框架：**

```markdown
问自己三个问题，全部答"是"才能做：

① 这个操作是不是为了解决当前安全事件所必需的？
  （不是"感兴趣"，不是"方便"，不是"以防万一"——是"必须"）

② 这个操作有没有在你们的事件响应授权范围内？
  （你是否被正式授权做这个级别的取证？还是需要更高权限？）

③ 这个操作有没有被记录和可被审计？
  （你的每一步操作是否都有日志？能否在事后完整还原你的行为？）

如果以上任何一个问题的答案是"否" → 不要做，先向组长确认。
```

---

## 🏥 应急响应中的"团队协作"——一个人扛不住的实战真相

护网中遇到P0级别的事件，靠一个人从检测到处置走完PDCERF全流程几乎不可能。真相是：**应急响应是一场团队接力赛，不是个人马拉松。**

### 真实应急中的角色分工

```markdown
【应急响应中的四角色模型】

角色1：一线值班员（Tier 1 SOC Analyst）——你的角色
  职责：
  → 第一时间发现告警并进行初步研判（告警是真还是假？）
  → 执行第一手遏制措施（隔离主机、封禁IP、停用账号）
  → 收集第一手证据（进程列表、网络连接、日志快照）
  → 5分钟内将事件升级给Tier 2
  你的关键词：速度、准确性、不慌张

角色2：应急响应工程师（Tier 2 IR Engineer）——你升级的对象
  职责：
  → 深度分析攻击者的TTP（用了什么工具？横向移动了吗？）
  → 制定根除方案（不只是删webshell，还要彻底清理后门）
  → 排查横向移动（你只看到了冰山，他们负责查整座冰山）
  → 生产IOC和检测规则（防止同类事件再次发生）

角色3：安全运营经理（SOC Manager）
  职责：
  → 判断事件优先级（P0/P1/P2/P3？需要全公司通报吗？）
  → 协调跨部门资源（需要运维重启服务器？需要法务评估合规风险？）
  → 对外沟通（是否通知客户数据泄露？是否报警？）
  → 做"停止业务"vs"继续应急"的艰难决定

角色4：系统/网络管理员（IT Operations）
  职责：
  → 在你隔离服务器时确保业务不中断
  → 在你需要密码重置时执行全局密码轮换
  → 在你需要系统镜像时提供备份系统进行还原
  → 配合你执行防火墙/路由层面的封禁
```

### 应急中的"信息通报铁律"——不通报比通报错更致命

```markdown
真实案例：某次护网中，SOC值班员发现了内网横向移动告警，
自己闷头调查了3小时还没找到攻击范围——结果攻击者在这3小时内
从1台机器扩散到了12台。如果他在发现异常后15分钟内通报了Tier 2，
Tier 2的应急工程师一眼就能认出这是典型的PsExec横向移动模式，
5分钟就能部署应急防火墙规则阻断445端口的内网流量。
→ 这是"不通报"的代价：损失从1台变成12台。

【信息通报的黄金法则】

法则1：先通报再深入（Don't Wait Until You're Sure）
  你不需要100%确认才通知别人。
  标准动作：发现异常→60秒自我判断（是真告警吗？）→如果怀疑度>30%→
            立即发出第一条通报："正在调查X告警，可能涉及Y系统，初步观察Z现象，
            正在深入分析，如有更新会立即同步。"
  → 这样做的好处：
    → Tier 2已经接收到信号，可以提前准备
    → 即使你后来确认是误报，也没关系——"通报后发现是误报"远好于"没通报导致真攻击蔓延"

法则2：通报要"结构化"，不要"写作文"
  ❌ 错误通报："帮我看一下，刚刚SIEM弹了很多告警，有个IP一直在访问我们的
      服务器，感觉不正常，日志里全是错误的登录，我不知道怎么回事，好慌..."
  ✅ 正确通报：
    "【时间】06:32 【来源】SIEM 【级别】P1可疑
     【现象】192.168.1.88对10台服务器有445端口扫描+暴力破解登录（1小时5000+次尝试）
     【我已做的】①在防火墙临时封禁192.168.1.88 ②保存了相关日志片段
     【我需要】①Tier 2帮我确认是否为横向移动 ②网络组帮我查192.168.1.88的资产信息
     【紧急程度】高——445端口的横向扫描可能意味着攻击者已获得内网立足点"

法则3：通报的"金字塔原则"——不同人物要不同版本
  → 对Tier 2工程师：全部技术细节（IP、端口、攻击特征、日志摘录）
  → 对安全经理：事件概要 + 当前状态 + 需要什么支持 + 预计影响
  → 对业务部门主管：非技术语言——"目前X业务不可用，预计Y时间恢复，原因是有非法访问"
  → 对外/客户通知（如果需要）：经过法务审批的版本——只说必要的、不说猜测的
```

### 应急中的"交接铁律"——换班时绝对不能在交接上出错

```markdown
护网通常是7×24三班倒。应急事件恰好发生在交接班时是最危险的——
上一班的人急着走，下一班的人还没进入状态。以下交接铁律必须遵守：

【应急事件交接Checklist（不填完不能走！）】
□ 事件编号是什么？（没有编号的要让SOC经理分配一个）
□ 事件当前处于PDCERF的哪个阶段？（准备/检测/遏制/根除/恢复/跟踪？）
□ 已经确认的受感染主机/账号有哪些？（列出清单）
□ 已经执行的处置操作有哪些？（隔离了哪几台？封了什么IP？重置了什么密码？）
□ 正在进行的调查有哪些？（在查什么的日志？在等谁的回复？）
□ 还有哪些待确认的怀疑？（"我觉得Web-04也有问题但还没查完"）
□ 所有相关日志/证据保存在哪里？（路径 + 文件名 + 访问方式）
□ 当前和哪些人沟通了这件事？（Tier 2？运维？经理？列出人名和联系方式）
□ 下一班最需要优先做的事是什么？（"先把Web-04排查完"）

【交接的"不许"清单】
❌ 不许口头交接——所有交接内容必须写在共享文档/Wiki/工单系统中
❌ 不许交接"大概情况"——必须精确到"哪些IP、哪些主机、什么状态"
❌ 不许在交班前做"大动作"（如重启服务器）——留给下一班做，
   因为如果重启后出现问题，只有下一班的人在线
❌ 不许不在交接文档记录"我的直觉"——"我觉得这事还没完，攻击者还留着后门"
   这种直觉对下一班非常有价值
```

---

未解决的问题：
```
