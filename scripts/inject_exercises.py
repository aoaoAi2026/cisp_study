#!/usr/bin/env python3
"""批量向渗透测试和防御计划注入编程练习"""
import json, os, re, sys

def make_ex(ex_id, title, difficulty, desc, template, hints, expected, tc_desc, solution=None):
    """生成一道编程练习的字典"""
    return {
        "id": ex_id, "title": title, "difficulty": difficulty,
        "description": desc,
        "template": template,
        "solution": solution or template,
        "testCases": [{"input": "输入", "expectedOutput": expected, "description": tc_desc}],
        "hints": hints
    }

def find_obj_end_for(day_pos, content):
    """从day的id位置，用深度追踪找到该CyberDay对象的闭合}"""
    # 1. 找该对象的{
    obj_start = -1
    for i in range(day_pos, -1, -1):
        if content[i] == '{':
            obj_start = i
            break
    if obj_start == -1:
        return -1
    
    # 2. 从{开始向前追踪深度找到匹配的}
    depth = 0
    for i in range(obj_start, len(content)):
        ch = content[i]
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                return i
    return -1

def inject(filepath, exercises):
    """将练习注入TS文件"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 收集所有day id位置
    positions = []
    for day_id in exercises:
        p = content.find(f"id: '{day_id}'")
        if p != -1:
            positions.append((day_id, p))
    positions.sort(key=lambda x: x[1])

    modified = 0
    # 从后往前处理，避免位置偏移
    for idx in range(len(positions) - 1, -1, -1):
        day_id, pos = positions[idx]
        exs = exercises[day_id]

        # 用深度追踪找到当前CyberDay对象的闭合}
        end = find_obj_end_for(pos, content)
        if end == -1:
            print(f"  警告: 找不到 {day_id} 结束位置")
            continue

        if 'codingExercises' in content[pos:end]:
            print(f"  跳过 {day_id}: 已有")
            continue

        ex_json = json.dumps(exs, ensure_ascii=False, separators=(',', ':'))
        content = content[:end] + f',\n    codingExercises: {ex_json}\n  ' + content[end:]
        modified += 1
        print(f"  已注入 {day_id}: {len(exs)}道")

    if modified > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  => 共修改 {modified} 天, 已保存")
    return modified

# ============================================================
# 渗透测试练习 (30天)
# ============================================================
PEN = {}

PEN["pen-1"] = [make_ex("ex-p1-1", "渗透测试授权验证器", "easy",
'验证渗透测试授权信息：检查必填字段和有效期。',
'''from datetime import datetime

def check_auth(info):
    required = ['授权方', '测试范围', '有效期至']
    missing = [k for k in required if k not in info]
    if missing:
        return f"[风险] 缺少: {missing}"
    expiry = datetime.strptime(info['有效期至'], '%Y-%m-%d')
    if expiry < datetime.now():
        return "[风险] 授权已过期"
    return f"[通过] 范围: {info['测试范围']}"

auth = {
    '授权方': 'Example Corp',
    '授权编号': 'PT-2024-001',
    '测试范围': 'web.example.com',
    '有效期至': '2025-12-31',
}
print(check_auth(auth))''',
['datetime.strptime解析日期', '列表推导检查缺失字段', '未授权渗透测试违法'],
"通过或风险警告", "授权验证")]

PEN["pen-2"] = [make_ex("ex-p2-1", "WHOIS信息解析", "easy",
"解析WHOIS查询记录，提取注册人、DNS服务器和创建日期。",
'''import re

data = """Domain Name: EXAMPLE.COM
Registrar: GoDaddy.com, LLC
Creation Date: 1995-08-14T04:00:00Z
Name Server: NS1.EXAMPLE.COM
Name Server: NS2.EXAMPLE.COM
"""

def parse_whois(text):
    info = {}
    info['domain'] = re.search(r'Domain Name:\s*(\S+)', text).group(1)
    info['registrar'] = re.search(r'Registrar:\s*(.+)', text).group(1)
    info['ns'] = re.findall(r'Name Server:\s*(\S+)', text)
    info['created'] = re.search(r'Creation Date:\s*(\S+)', text).group(1)
    return info

result = parse_whois(data)
for key, val in result.items():
    print(f"{key}: {val}")''',
["re.search获取第一个匹配", "re.findall获取全部匹配", "WHOIS是被动信息收集的重要来源"],
"提取域名/注册商/DNS/日期", "WHOIS解析")]

PEN["pen-3"] = [make_ex("ex-p3-1", "DNS记录分组分析", "medium",
"按记录类型分组DNS查询结果，识别SPF和MX记录。",
'''dns = [
    ('A', 'example.com', '93.184.216.34'),
    ('MX', 'example.com', 'mail.example.com'),
    ('NS', 'example.com', 'ns1.example.com'),
    ('TXT', 'example.com', 'v=spf1 include:_spf.google.com ~all'),
    ('CNAME', 'www.example.com', 'example.com'),
]

grouped = {}
for rtype, name, value in dns:
    grouped.setdefault(rtype, []).append((name, value))

for rtype, entries in grouped.items():
    print(f"[{rtype}] ({len(entries)}条)")
    for name, val in entries:
        print(f"  {name} -> {val}")
        if rtype == 'TXT' and val.startswith('v=spf1'):
            print(f"    [SPF] 发件策略")''',
["dict.setdefault处理分组", "TXT记录含SPF/DKIM/DMARC", "MX记录用于发现邮件服务器"],
"识别SPF和MX", "DNS分析")]

PEN["pen-4"] = [make_ex("ex-p4-1", "Nmap扫描结果解析", "medium",
"解析Nmap主机发现结果，统计开放端口和服务分布。",
'''from collections import Counter

results = [
    {'host': '192.168.1.1', 'ports': [{'port': 22, 'state': 'open', 'svc': 'ssh'}, {'port': 80, 'state': 'open', 'svc': 'http'}]},
    {'host': '192.168.1.10', 'ports': [{'port': 22, 'state': 'open', 'svc': 'ssh'}, {'port': 443, 'state': 'open', 'svc': 'https'}]},
    {'host': '192.168.1.20', 'ports': [{'port': 8080, 'state': 'open', 'svc': 'http-proxy'}]},
]

svc_hosts = Counter()
total_open = 0
for host in results:
    open_ports = [p for p in host['ports'] if p['state'] == 'open']
    total_open += len(open_ports)
    svc_hosts.update(p['svc'] for p in open_ports)
    svcs = ', '.join(f"{p['port']}/{p['svc']}" for p in open_ports)
    print(f"{host['host']}: {svcs}")

print(f"\\n总开放端口: {total_open}")
multi = [s for s, c in svc_hosts.items() if c > 1]
print(f"多主机服务: {multi}")''',
["列表推导过滤open端口", "Counter统计服务频率", "ssh(22)是多主机共现服务"],
"ssh出现在2台主机", "Nmap分析")]

PEN["pen-5"] = [make_ex("ex-p5-1", "OS指纹识别", "medium",
"根据TTL值和TCP窗口大小匹配操作系统。",
'''fp = [
    {'os': 'Linux', 'ttl': 64, 'win': 5840},
    {'os': 'Windows', 'ttl': 128, 'win': 65535},
    {'os': 'FreeBSD', 'ttl': 64, 'win': 65535},
    {'os': 'Cisco', 'ttl': 255, 'win': 4128},
]

def match_os(ttl, window):
    for f in fp:
        if f['ttl'] == ttl and f['win'] == window:
            return f"[精确匹配] {f['os']}"
    for f in fp:
        if f['ttl'] == ttl:
            return f"[TTL匹配] 可能是 {f['os']}"
    return "[未知OS]"

tests = [(64, 5840), (128, 65535), (64, 29200)]
for t, w in tests:
    print(f"TTL={t} Win={w} -> {match_os(t, w)}")''',
["Linux TTL=64, Windows=128", "TCP Window大小也用于指纹", "Nmap -O用多种探针做OS检测"],
"识别Linux和Windows", "OS指纹")]

# 剩余26天使用程序化生成
TITLES_PEN = {
    6: ("目录扫描模拟", "easy", "模拟Web目录爆破，按HTTP状态码判断路径是否存在。",
        '''responses = {'/admin': 200, '/login': 200, '/.git': 403, '/shell.php': 404, '/robots.txt': 200}
wordlist = ['/admin', '/login', '/.git', '/shell.php', '/robots.txt', '/config']

found = []
for path in wordlist:
    code = responses.get(path, 404)
    if code == 200:
        found.append(f"{path} 已发现")
    elif code == 403:
        found.append(f"{path} 存在(禁止访问)")

print(f"扫描 {len(wordlist)} 条路径, 发现 {len(found)} 条:")
for f in found:
    print(f"  {f}")''',
        ["200=成功 403=存在 404=不存在", "robots.txt常暴露敏感路径", "实际使用gobuster/dirbuster"],
        "发现4条路径", "目录扫描"),

    7: ("社工信息提取", "easy", "从文本中提取邮箱地址和社交账号等社工信息。",
        '''import re
text = "contact: admin@ex.com, @dev_team, github.com/proj-x, hr@corp.org"
emails = re.findall(r'[\\w.-]+@[\\w.-]+\\.\\w+', text)
social = re.findall(r'@(\\w+)', text)
github = re.findall(r'github\\.com/([\\w-]+)', text)
print(f"邮箱({len(emails)}): {emails}")
print(f"社交({len(social)}): {social}")
print(f"GitHub: {github}")''',
        ["邮箱正则: [\\w.-]+@[\\w.-]+\\\\.\\w+", "@username提取社交账号", "GitHub仓库地址暴露技术栈"],
        "2邮箱/1社交/1GitHub", "社工信息"),

    8: ("HTTP请求注入检测", "medium", "检测HTTP请求中的SQL注入和XSS攻击模式。",
        '''import re
reqs = [
    'GET /login?user=admin&pass=123',
    'GET /search?q=hello',
    'POST /api {"id":"1 OR 1=1"}',
    'GET /x?a=<script>',
]
def detect(req):
    issues = []
    if re.search(r'\\bOR\\s+\\d+\\s*=\\s*\\d+|UNION\\s+SELECT', req, re.I):
        issues.append("[SQL注入]")
    if re.search(r'<script|<iframe|javascript:', req, re.I):
        issues.append("[XSS]")
    return issues

for req in reqs:
    method = req.split()[0]
    issues = detect(req)
    if issues:
        print(f"[{method}] 检测到: {issues}")
    else:
        print(f"[{method}] 安全")''',
        ["re.search检测SQL注入模式", "<script>/javascript:是XSS向量", "Burp Suite自动识别注入点"],
        "检测到SQL注入和XSS", "请求分析"),

    9: ("SQL注入Payload生成", "medium", "生成联合查询、报错注入和盲注的SQL注入Payload。",
        '''def gen_payloads(param, val):
    return [
        f"{val}' UNION SELECT 1,2,3-- -",
        f"{val}' AND extractvalue(1,concat(0x7e,version()))-- -",
        f"{val}' AND SLEEP(5)-- -",
        f"{val}' AND 1=1-- -",
        f"{val}' AND 1=2-- -",
    ]
for p in gen_payloads("id", "1"):
    print(p)''',
        ["UNION SELECT用于联合查询", "extractvalue用于报错注入", "SLEEP()用于时间盲注"],
        "生成5种Payload", "SQL注入"),

    10: ("XSS Payload分类器", "easy", "对XSS Payload按注入方式分类并评估危险等级。",
         '''payloads = [
    '<script>alert(1)</script>',
    '<img src=x onerror=alert(1)>',
    'javascript:alert(document.cookie)',
    '<svg onload=alert(1)>',
]
def classify(p):
    if '<script>' in p:
        return 'Script标签', '高危'
    if any(e in p for e in ['onerror', 'onload', 'onmouseover']):
        return '事件注入', '中危'
    if p.startswith('javascript:'):
        return 'javascript协议', '高危'
    return '未知', '待评估'

for p in payloads:
    cat, level = classify(p)
    print(f"[{level}] {cat}: {p[:40]}...")''',
         ["<script>是经典XSS向量", "onerror/onload无需script标签", "javascript:协议可用于链接注入"],
         "正确分类4种类型", "XSS分类"),

    11: ("CSRF Token生成器", "easy", "生成安全随机CSRF Token并验证其安全性。",
         '''import hashlib, random, time

def gen_token():
    data = f"{time.time()}{random.getrandbits(128)}"
    return hashlib.sha256(data.encode()).hexdigest()[:32]

def validate(token, stored):
    if len(token) < 16:
        return "过短"
    if not all(c in '0123456789abcdef' for c in token):
        return "格式异常"
    if token != stored:
        return "不匹配"
    return "有效"

tok = gen_token()
print(f"生成Token: {tok} (长度{len(tok)})")
print(f"验证: {validate(tok, tok)}")
print(f"恶意验证: {validate('short', tok)}")''',
         ["hashlib.sha256生成不可预测token", "Token须绑定用户会话", "SameSite Cookie也是CSRF防御"],
         "生成32位token并验证", "CSRF防护"),

    12: ("路径遍历检测器", "medium", "检测路径遍历攻击的多种变种(../, URL编码, ....//)。",
         '''import re, urllib.parse
paths = [
    '/view?f=report.pdf',
    '/view?f=../../../etc/passwd',
    '/view?f=..%2f..%2fetc%2fpasswd',
    '/view?f=....//....//etc/passwd',
]
def detect(path):
    decoded = urllib.parse.unquote(path)
    if re.search(r'\\.\\./', decoded) or re.search(r'\\.\\.\\\\', decoded):
        return '高危', '../遍历'
    if re.search(r'\\.\\.%2f|\\.\\.%5c', path, re.I):
        return '高危', 'URL编码遍历'
    if re.search(r'\\.\\.\\.\\./+', path):
        return '中危', '遍历变种'
    return '安全', '无'

for p in paths:
    level, detail = detect(p)
    print(f"[{level}] {detail}: {p[:50]}")''',
         ["urllib.parse.unquote解码URL", "../和..\\\\都需要检测", "....//是绕过..过滤的变种"],
         "识别3种遍历变种", "路径遍历"),

    13: ("文件上传安全检查", "medium", "检查上传文件的扩展名、双扩展名和MIME类型绕过。",
         '''import os
ALLOWED = {'.jpg', '.png', '.pdf'}
DANGER = {'.php', '.jsp', '.exe', '.sh'}

def check(filename, mime):
    issues = []
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ALLOWED:
        issues.append(f"扩展名 {ext} 不在白名单")
    parts = filename.rsplit('.', 2)
    if len(parts) == 3 and parts[-2].lower() in DANGER:
        issues.append(f"双扩展名: {parts[-2]}.{parts[-1]}")
    return issues

tests = [
    ('photo.jpg', 'image/jpeg'),
    ('shell.php', 'image/jpeg'),
    ('shell.php.jpg', 'image/jpeg'),
    ('doc.pdf', 'application/pdf'),
]
for fname, mime in tests:
    issues = check(fname, mime)
    status = '安全' if not issues else f'{len(issues)}问题'
    print(f"[{status}] {fname}")''',
         ["os.path.splitext获取扩展名", "rsplit检测双扩展名", "MIME可伪造需Magic Bytes验证"],
         "检测2个风险文件", "上传安全"),

    14: ("缓冲区溢出模拟", "hard", "模拟栈缓冲区溢出原理：向固定buffer写入超长数据。",
         '''def simulate(data, buf_size=16):
    overflow = len(data) > buf_size
    print(f"写入 {len(data)}B 到 {buf_size}B 缓冲区: {'溢出!' if overflow else '安全'}")

simulate("Hello")
simulate("A" * 30)''',
         ["超过buf_size即溢出", "真实栈溢出可覆盖返回地址", "ASLR和Canary是防护措施"],
         "长输入检测溢出", "缓冲区溢出"),

    15: ("SUID提权检测器", "medium", "扫描SUID二进制，识别GTFOBins中可提权的条目。",
         '''KNOWN = {'find', 'python', 'vim', 'nmap', 'bash', 'less'}
binaries = [
    {'path': '/usr/bin/find', 'owner': 'root'},
    {'path': '/usr/bin/passwd', 'owner': 'root'},
    {'path': '/usr/bin/vim', 'owner': 'root'},
    {'path': '/usr/bin/ls', 'owner': 'root'},
]
risks = []
for b in binaries:
    name = b['path'].split('/')[-1]
    if name in KNOWN and b['owner'] == 'root':
        risks.append(f"{b['path']} (GTFOBins可提权)")

print(f"发现 {len(risks)} 个可提权SUID:")
for r in risks:
    print(f"  [高危] {r}")''',
         ["GTFOBins记录了所有可提权SUID", "find -exec可执行任意命令", "实际命令: find . -exec /bin/sh -p \\;"],
         "发现find和vim", "权限提升"),

    16: ("密码哈希破解模拟", "medium", "实现字典攻击模拟，比对MD5密码哈希。",
         '''import hashlib
hashes = {
    'admin': hashlib.md5(b'admin123').hexdigest(),
    'user': hashlib.md5(b'password').hexdigest(),
}
wordlist = ['admin', 'root', 'password', 'admin123', '123456', 'toor']
cracked = {}
for word in wordlist:
    wh = hashlib.md5(word.encode()).hexdigest()
    for user, target in hashes.items():
        if wh == target:
            cracked[user] = word
            print(f"[CRACKED] {user}:{word}")

print(f"破解 {len(cracked)}/{len(hashes)} ({len(cracked)/len(hashes):.0%})")''',
         ["hashlib.md5(word.encode()).hexdigest()", "加盐(Salt)可防字典攻击", "实际用hashcat/John the Ripper"],
         "2/2破解成功", "密码破解"),

    17: ("令牌窃取检测", "medium", "检测进程持有的token与用户身份不一致的令牌窃取行为。",
         '''processes = [
    {'pid': 1234, 'name': 'explorer.exe', 'user': 'DOMAIN\\\\user', 'token': 'user'},
    {'pid': 5678, 'name': 'meterp.exe', 'user': 'DOMAIN\\\\admin', 'token': 'SYSTEM'},
    {'pid': 9012, 'name': 'cmd.exe', 'user': 'DOMAIN\\\\user', 'token': 'SYSTEM'},
]
alerts = []
for p in processes:
    u = p['user'].split('\\\\')[-1]
    if p['token'] == 'SYSTEM' and u != 'SYSTEM':
        alerts.append(f"[令牌窃取] PID={p['pid']} {p['name']} ({p['user']})")

print(f"检测到 {len(alerts)} 个可疑令牌:")
for a in alerts:
    print(f"  {a}")''',
         ["SYSTEM是高权限令牌", "非SYSTEM用户持有SYSTEM令牌=可疑", "Mimikatz可窃取令牌"],
         "检测到2个令牌窃取", "令牌窃取"),

    18: ("Linux弱点扫描", "medium", "扫描Linux系统弱点：旧内核、可写敏感文件、危险sudo规则。",
         '''info = {
    'kernel': '2.6.32-754.el6.x86_64',
    'writable': ['/etc/passwd', '/tmp/backup.sh'],
    'sudo': ['(ALL) NOPASSWD: /usr/bin/find', '(root) /usr/bin/vim'],
}
DANGER = {'find', 'vim', 'nmap', 'python', 'bash', 'less'}
findings = []

if info['kernel'].startswith('2.'):
    findings.append(f"[高] 旧内核 {info['kernel']} (可能有DirtyCow)")
for f in info['writable']:
    if 'passwd' in f:
        findings.append(f"[严重] {f} 可写!")
for rule in info['sudo']:
    cmd = rule.split('/')[-1].split()[0]
    if cmd in DANGER:
        findings.append(f"[高危] sudo免密执行 {cmd}")

print(f"发现 {len(findings)} 个弱点:")
for f in findings:
    print(f"  {f}")''',
         ["内核2.x可能有DirtyCow漏洞", "可写/etc/passwd=可添加root", "sudo免密+危险命令=直接提权"],
         "发现3个弱点", "Linux弱点"),

    19: ("隐蔽隧道检测", "hard", "检测DNS隧道：异常大包大小和固定间隔的心跳行为。",
         '''packets = [
    {'proto': 'DNS', 'size': 80, 't': 0},
    {'proto': 'DNS', 'size': 1200, 't': 5},
    {'proto': 'HTTP', 'size': 500, 't': 10},
    {'proto': 'DNS', 'size': 1150, 't': 15},
    {'proto': 'DNS', 'size': 1100, 't': 20},
]
anomalies = []
for i, p in enumerate(packets):
    if p['proto'] == 'DNS' and p['size'] > 500:
        anomalies.append(f"[DNS隧道] 包#{i} {p['size']}B (正常<512B)")

dnsp = [p for p in packets if p['proto'] == 'DNS']
for i in range(1, len(dnsp)):
    if dnsp[i]['t'] - dnsp[i-1]['t'] == 5:
        anomalies.append("[心跳模式] 固定5秒间隔")

print(f"发现 {len(anomalies)} 个隧道迹象:")
for a in anomalies:
    print(f"  {a}")''',
         ["正常DNS查询<512字节", "隧道用长域名编码数据外传", "心跳是C2 beacon通信特征"],
         "检测大包+心跳", "隧道检测"),

    20: ("后门检测脚本", "medium", "扫描计划任务中可疑路径和脚本文件(权限维持检测)。",
         '''tasks = [
    {'name': 'WindowsUpdate', 'path': 'C:\\\\Windows\\\\system32\\\\wuauclt.exe'},
    {'name': 'AdobeUpdate', 'path': 'C:\\\\Windows\\\\temp\\\\backdoor.exe'},
    {'name': 'SystemCheck', 'path': 'C:\\\\Users\\\\public\\\\syscheck.vbs'},
]
SUS_DIR = ['temp', 'tmp', 'Users\\\\public', 'AppData\\\\Roaming']
SUS_EXT = {'.vbs', '.ps1', '.bat', '.cmd'}

suspicious = []
for t in tasks:
    p = t['path'].lower()
    if any(d.lower() in p for d in SUS_DIR):
        suspicious.append(f"[后门] {t['name']} 在临时目录: {t['path']}")
    ext = '.' + t['path'].rsplit('.', 1)[-1].lower()
    if ext in SUS_EXT:
        suspicious.append(f"[脚本后门] {t['name']}: {ext}")

print(f"发现 {len(suspicious)} 个可疑项:")
for s in suspicious:
    print(f"  {s}")''',
         ["temp/public是后门常驻目录", ".vbs/.ps1常用于无文件攻击", "计划任务是最常见的持久化手法"],
         "发现2个可疑后门", "后门检测"),

    21: ("日志篡改检测", "easy", "检测安全日志中的时间倒退和清除标记(痕迹清理)。",
         '''from datetime import datetime
logs = [
    '2024-01-15 10:00:01 [INFO] Login',
    '2024-01-15 15:30:00 [INFO] Login',
    '2024-01-15 10:10:22 [INFO] Check',
    '2024-01-15 23:59:59 [AUDIT] Log cleared',
]
anomalies = []
prev = None
for entry in logs:
    ts = datetime.strptime(entry[:19], '%Y-%m-%d %H:%M:%S')
    if prev and ts < prev:
        anomalies.append(f"[时间倒退] {entry[:19]} 早于前一条")
    prev = ts
    if any(k in entry.lower() for k in ['cleared', 'wiped', 'deleted']):
        anomalies.append(f"[日志清除] {entry[:50]}...")

print(f"检测到 {len(anomalies)} 个异常:")
for a in anomalies:
    print(f"  {a}")''',
         ["datetime.strptime解析时间戳", "时间倒退=日志被手动修改", "cleared/wiped=攻击者清理痕迹"],
         "检测到时间倒退和清除", "日志安全"),

    22: ("内网子网扫描", "easy", "使用Python扫描/24子网的存活主机。",
         '''import ipaddress
net = ipaddress.IPv4Network('192.168.1.0/24')
live_hosts = {
    '192.168.1.1': 'router',
    '192.168.1.10': 'web-server',
    '192.168.1.50': 'db-server',
}
discovered = {}
count = 0
for ip in net.hosts():
    count += 1
    s = str(ip)
    if s in live_hosts:
        discovered[s] = live_hosts[s]
        print(f"[UP] {s} ({live_hosts[s]})")

print(f"\\n扫描 {count} 个IP, 存活 {len(discovered)} 台")''',
         ["ipaddress.IPv4Network定义子网", "network.hosts()遍历主机", "/24子网有254个可用IP"],
         "发现3台存活主机", "内网扫描"),

    23: ("Pass-The-Hash模拟", "medium", "模拟用捕获的NTLM哈希做横向认证。",
         '''import hashlib
users = {
    'admin': hashlib.md5(b'P@ssw0rd').hexdigest(),
    'alice': hashlib.md5(b'Alice123').hexdigest(),
}
captured = hashlib.md5(b'P@ssw0rd').hexdigest()
print(f"持有hash: {captured[:16]}...")

matched = []
for user, h in users.items():
    if captured == h:
        matched.append(user)
        print(f"[PTH成功] 以 {user} 身份认证")

print(f"攻破 {len(matched)} 个账户: {matched}")''',
         ["PTH不需要明文密码", "Mimikatz获取NTLM hash", "防御: 禁用NTLM + Credential Guard"],
         "攻破admin账户", "PTH攻击"),

    24: ("横向移动路径分析", "medium", "分析网络连接找出横向移动可达的高价值目标。",
         '''conns = [
    ('WS001', '192.168.1.10', 445, 'open'),
    ('WS001', '192.168.1.50', 3389, 'open'),
    ('DC01', '192.168.1.1', 88, 'open'),
]
HI_VAL = {445: 'SMB', 3389: 'RDP', 5985: 'WinRM', 22: 'SSH'}

paths = [(dst, port, HI_VAL.get(port, f'port{port}'))
         for src, dst, port, st in conns
         if src == 'WS001' and st == 'open']

print("从 WS001 横向移动可达:")
for dst, port, svc in paths:
    print(f"  -> {dst}:{port} ({svc})")''',
         ["SMB(445)横向移动最常用", "RDP(3389)远程桌面跳板", "WinRM(5985)用于PowerShell Remoting"],
         "发现SMB和RDP路径", "横向移动"),

    25: ("CVE Exploit匹配器", "medium", "根据目标OS和开放端口匹配已知CVE exploit。",
         '''cve_db = {
    'CVE-2017-0144': {'name': 'EternalBlue', 'port': 445, 'os': 'Windows'},
    'CVE-2019-0708': {'name': 'BlueKeep', 'port': 3389, 'os': 'Windows'},
    'CVE-2014-0160': {'name': 'Heartbleed', 'port': 443, 'os': 'Linux'},
}
target_os = 'Windows'
target_ports = [80, 443, 445, 3389]

matches = [(cve, info['name'], info['port'])
           for cve, info in cve_db.items()
           if info['os'] in target_os and info['port'] in target_ports]

print(f"目标 {target_os} 匹配 {len(matches)} 个exploit:")
for cve, name, port in matches:
    print(f"  {cve} ({name}) port {port}")''',
         ["EternalBlue利用SMB(445)", "BlueKeep利用RDP(3389)", "Heartbleed影响OpenSSL(TLS 443)"],
         "匹配EternalBlue和BlueKeep", "CVE匹配"),

    26: ("Shellcode编码混淆", "hard", "对Shellcode进行XOR加密和Base64编码(免杀基础)。",
         '''import base64
shellcode = bytes.fromhex('90909090CCCCCCCC')

def encode(sc, key=0xAA):
    xorred = bytes(b ^ key for b in sc)
    return base64.b64encode(xorred).decode()

encoded = encode(shellcode)
print(f"原始: {len(shellcode)}B")
print(f"XOR(0xAA)后: {bytes(b^0xAA for b in shellcode).hex()}")
print(f"Base64: {encoded}")''',
         ["XOR加密: byte ^ key", "base64.b64encode编码", "免杀通过混淆绕过签名检测"],
         "成功编码为Base64", "免杀技术"),

    27: ("WiFi握手包分析", "easy", "分析WPA2四步握手帧，提取SSID和BSSID。",
         '''frames = [
    {'frame': 1, 'type': 'ANonce', 'ssid': 'OfficeWiFi'},
    {'frame': 2, 'type': 'SNonce+MIC', 'bssid': 'AA:BB:CC:DD:EE:FF'},
    {'frame': 3, 'type': 'GTK+MIC'},
    {'frame': 4, 'type': 'ACK'},
]
info = {}
for f in frames:
    if 'ssid' in f:
        info['SSID'] = f['ssid']
    if 'bssid' in f:
        info['BSSID'] = f['bssid']
info['complete'] = len(frames) == 4

print(f"SSID: {info.get('SSID', 'N/A')}")
print(f"BSSID: {info.get('BSSID', 'N/A')}")
print(f"握手完整: {info['complete']}")
print(f"可用于破解: {info['complete']}")''',
         ["WPA2四步握手至少需4帧", "Airodump-ng捕获握手", "hashcat用PBKDF2破解WPA2"],
         "提取SSID/BSSID", "WiFi分析"),

    28: ("Shellcode验证器", "medium", "验证shellcode属性：长度、Null字节安全性。",
         '''sc = bytes([
    0x31, 0xc0, 0x50, 0x68, 0x2f, 0x2f, 0x73, 0x68,
    0x68, 0x2f, 0x62, 0x69, 0x6e, 0x89, 0xe3, 0x50,
    0x53, 0x89, 0xe1, 0xb0, 0x0b, 0xcd, 0x80,
])

has_null = b'\\x00' in sc
print(f"长度: {len(sc)} bytes")
print(f"含Null字节: {has_null}")
print(f"安全性: {'可用' if not has_null else '有问题'}")
print(f"十六进制: {sc.hex()[:40]}...")''',
         ["Null字节会截断字符串函数", "xor eax,eax避免Null产生", "int 0x80是Linux系统调用号"],
         "23B,无Null,可用", "Shellcode验证"),

    29: ("渗透报告生成器", "medium", "根据发现列表生成按严重度排序的渗透测试报告。",
         '''findings = [
    {'title': 'SQL注入', 'severity': '紧急', 'port': 8080},
    {'title': '弱密码', 'severity': '高', 'port': 22},
    {'title': '目录列表', 'severity': '中', 'port': 80},
    {'title': '信息泄露', 'severity': '低', 'port': 443},
]
ORDER = {'紧急': 0, '高': 1, '中': 2, '低': 3}
sorted_f = sorted(findings, key=lambda f: ORDER.get(f['severity'], 99))

print("=" * 45)
print("         渗透测试报告")
print("=" * 45)
print(f"\\n发现 {len(findings)} 个漏洞:")
for f in sorted_f:
    print(f"  [{f['severity']}] port {f['port']} - {f['title']}")
print("\\n建议: 紧急7天内, 高危30天内修复")
print("=" * 45)''',
         ["按severity排序:紧急>高>中>低", "报告=概要+详情+修复建议", "PTES标准要求完整报告"],
         "紧急优先排序", "渗透报告"),

    30: ("自动化报告模板", "easy", "生成包含执行摘要和修复建议的完整报告模板。",
         '''data = {
    'client': 'Example Corp', 'date': '2024-06-15',
    'scope': 'web.example.com', 'total': 12,
    'critical': 2, 'high': 4, 'medium': 5, 'low': 1,
}

print("=" * 60)
print(f"渗透测试报告 - {data['client']} ({data['date']})")
print(f"测试范围: {data['scope']}")
print("=" * 60)
print(f"共 {data['total']} 个漏洞:")
print(f"  紧急: {data['critical']}  |  高: {data['high']}")
print(f"  中:   {data['medium']}  |  低: {data['low']}")
print()
print("【修复建议】")
print("紧急漏洞: 7天内修复")
print("高危漏洞: 30天内修复")
print("中危漏洞: 90天内修复")
print("=" * 60)''',
         ["报告给管理层看:简洁+统计", "给技术人员看:详细+修复步骤", "按严重度给出修复时间建议"],
         "格式化输出完整报告", "报告模板"),
}

# ============================================================
# 防御计划练习 (30天)
# ============================================================
DEF = {}

TITLES_DEF = {
    1: ("SOC告警分诊系统", "easy", "对安全告警按严重度排序，统计并找出最多攻击源。",
        '''from collections import Counter
alerts = [
    {'id': 1, 'type': '暴力破解', 'severity': '高', 'src': '10.0.0.5'},
    {'id': 2, 'type': '恶意软件', 'severity': '紧急', 'src': '192.168.1.50'},
    {'id': 3, 'type': '扫描探测', 'severity': '低', 'src': '10.0.0.5'},
]
SV = {'紧急': 0, '高': 1, '中': 2, '低': 3}
sorted_a = sorted(alerts, key=lambda a: SV.get(a['severity'], 99))
counts = Counter(a['severity'] for a in sorted_a)
top = Counter(a['src'] for a in sorted_a).most_common(1)[0]

print(f"统计: {dict(counts)}")
print(f"最多攻击源: {top}")
print("按优先级排序:")
for a in sorted_a:
    print(f"  [{a['severity']}] {a['type']} from {a['src']}")''',
        ["sorted自定义severity排序", "Counter统计高频项", "紧急告警必须立即响应"],
        "紧急排在第一位", "SOC分诊"),

    2: ("暴力破解检测", "medium", "从Windows安全日志中检测暴力破解(EventID 4625)。",
        '''import re
logs = [
    'EventID=4625 Account=admin Source=192.168.1.100',
    'EventID=4624 Account=user01 Source=192.168.1.50',
    'EventID=4625 Account=admin Source=192.168.1.100',
    'EventID=4625 Account=admin Source=192.168.1.100',
    'EventID=4624 Account=SYSTEM Source=127.0.0.1',
]
TH = 3
fails = {}
for log in logs:
    if '4625' in log:
        acc = re.search(r'Account=(\S+)', log).group(1)
        src = re.search(r'Source=(\S+)', log).group(1)
        key = f'{acc}@{src}'
        fails[key] = fails.get(key, 0) + 1

for key, count in fails.items():
    if count >= TH:
        print(f'[暴力破解] {key} 失败 {count} 次!')''',
        ["EventID 4625=登录失败", "按用户@IP分组统计", "多次失败=暴力破解,须告警"],
        "检测到admin暴力破解", "日志分析"),

    3: ("ES查询DSL构建器", "medium", "构建Elasticsearch查询DSL用于SIEM日志检索。",
        '''import json
def build_query(keyword, severity=None):
    q = {
        'query': {'bool': {'must': [], 'filter': []}},
        'size': 100,
        'sort': [{'@timestamp': 'desc'}],
    }
    if keyword:
        q['query']['bool']['must'].append({'match': {'message': keyword}})
    if severity:
        q['query']['bool']['filter'].append({'term': {'severity': severity}})
    q['query']['bool']['filter'].append({
        'range': {'@timestamp': {'gte': 'now-24h'}}
    })
    return q

print(json.dumps(build_query('failed login', 'high'), indent=2, ensure_ascii=False))''',
        ["bool.must=搜索关键词", "bool.filter=精确过滤", "Elasticsearch是SIEM核心存储"],
        "输出完整DSL查询", "SIEM查询"),

    4: ("Snort规则匹配器", "medium", "解析Snort IDS规则并匹配数据包内容。",
        '''import re
rules = [('alert tcp any any -> any 80 (msg:"SQL Injection";content:"union select";sid:1000001;)', 'union select')]
packets = [
    b'GET /index.html HTTP/1.1',
    b'GET /search?q=union select * from users HTTP/1.1',
]

alerts = []
for rule_str, content in rules:
    msg = re.search(r'msg:"(.+?)"', rule_str).group(1)
    sid = re.search(r'sid:(\d+)', rule_str).group(1)
    for i, pkt in enumerate(packets):
        if content.encode() in pkt:
            alerts.append(f'[SID:{sid}] {msg} -> 包#{i}')

for a in alerts:
    print(a)''',
        ["re.search提取规则元信息", "content字段匹配包内容", "sid是规则唯一标识"],
        "匹配SQL注入告警", "Snort匹配"),

    5: ("异常登录时间检测", "easy", "用Z-Score检测异常时间点的登录行为。",
        '''import numpy as np
history = [8, 9, 8, 10, 9, 11, 14, 15, 16, 9, 10, 8, 11, 15, 14, 9, 10, 8, 16, 15]
new = [(3, 2), (10, 3), (23, 1)]

mean_h = np.mean(history)
std_h = np.std(history)
print(f"正常登录时段: {mean_h:.1f} +/- {std_h:.1f} 小时")

for hour, count in new:
    z = (hour - mean_h) / std_h
    status = "异常" if abs(z) > 2 else "正常"
    print(f"[{status}] {hour}:00 登录 {count} 次 (Z-Score={z:.1f})")''',
        ["np.mean/std计算基线", "|Z|>2=显著偏离", "UEBA核心:偏离基线=可疑"],
        "凌晨3点和23点告警", "异常检测"),

    6: ("事件自动分级", "easy", "按事件类型和影响系统自动确定响应级别和SLA。",
        '''SLA = {'紧急': '15分钟', '高': '1小时', '中': '4小时', '低': '24小时'}
CORE = {'财务系统', '核心数据库', '域控服务器'}

def grade(event_type, systems):
    if event_type in ['勒索软件', '数据泄露']:
        return '紧急', SLA['紧急']
    if any(s in CORE for s in systems):
        return '高', SLA['高']
    if event_type in ['钓鱼', '异常登录']:
        return '中', SLA['中']
    return '低', SLA['低']

tests = [('勒索软件', ['文件服务器']), ('钓鱼', ['邮箱']), ('扫描', ['外围IP'])]
for etype, systems in tests:
    lv, sla = grade(etype, systems)
    print(f"{etype}: [{lv}] SLA={sla}")''',
        ["紧急:全局业务中断", "高:核心系统受损", "SLA定义了响应时间窗口"],
        "正确三级分级", "事件分级"),

    7: ("PDCERF流程引擎", "easy", "实现六阶段应急响应流程的状态机。",
        '''PHASES = ['准备', '检测', '遏制', '根除', '恢复', '总结']
ACTIONS = {
    '准备': ['激活团队', '确认预案'],
    '检测': ['确认类型', '评估范围'],
    '遏制': ['隔离系统', '阻断路径'],
    '根除': ['清除恶意代码', '修复漏洞'],
    '恢复': ['恢复服务', '验证完整性'],
    '总结': ['写报告', '复盘改进'],
}

print("=== PDCERF应急响应 ===")
for phase in PHASES:
    print(f"\\n[{phase}]")
    for action in ACTIONS[phase]:
        print(f"  OK {action}")
steps = sum(len(v) for v in ACTIONS.values())
print(f"\\n完成! 共 {steps} 步骤")''',
        ["PDCERF=Prepare-Detection-Containment-Eradication-Recovery-Follow-up", "遏制阶段防止扩散", "总结阶段防止再次发生"],
        "六阶段12步骤完成", "应急响应"),

    8: ("iptables规则审计", "easy", "审计iptables防火墙规则的安全配置。",
        '''import re
rules = [
    '-P INPUT DROP',
    '-A INPUT -i lo -j ACCEPT',
    '-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT',
    '-A INPUT -p tcp --dport 22 -j ACCEPT',
]
txt = ' '.join(rules)
checks = {
    '默认策略': 'DROP' if 'DROP' in rules[0] else 'WARN',
    '回环规则': '-i lo' in txt,
    '状态跟踪': 'ESTABLISHED' in txt,
    '开放端口': re.findall(r'--dport (\d+)', txt),
}
score = sum([checks['默认策略'] == 'DROP', checks['回环规则'], checks['状态跟踪']])
print(f"防火墙审计: 评分 {score}/3")
for k, v in checks.items():
    print(f"  {k}: {v}")''',
        ["默认策略应为DROP(白名单)", "回环lo必须放行", "ESTABLISHED允许已连接流量"],
        "评分3/3", "防火墙审计"),

    9: ("WAF规则测试器", "medium", "测试WAF规则对SQL注入和XSS的拦截效果。",
        '''import re
rules = [
    (r'(?i)union\\s+select|1=.1', 'SQL注入'),
    (r'(?i)<script|<iframe|javascript:', 'XSS'),
    (r'(?i)\\.\\./|\\.\\.\\\\|%2e%2e', '路径遍历'),
]
reqs = [
    '/search?q=hello',
    '/login?u=admin union select *',
    '/profile?id=<script>alert(1)</script>',
    '/file?path=../../etc/passwd',
]
blocked = 0
for req in reqs:
    for pat, name in rules:
        if re.search(pat, req):
            print(f'[拦截] {name}: {req[:60]}')
            blocked += 1
            break
    else:
        print(f'[通过] {req[:60]}')
print(f"\\n拦截率: {blocked}/{len(reqs)} = {blocked/len(reqs):.0%}")''',
        ["(?i)不区分大小写", "WAF部署在Web服务器前端", "ModSecurity是开源WAF引擎"],
        "拦截3/4个攻击请求", "WAF测试"),

    10: ("WireGuard配置生成", "easy", "自动生成WireGuard VPN客户端和服务端配置。",
         '''cfg = {
    'server': {'addr': '10.0.0.1/24', 'port': 51820},
    'client': {'addr': '10.0.0.2/24', 'dns': '1.1.1.1'},
    'endpoint': 'vpn.example.com',
}
print("=== 服务端配置 ===")
print(f"[Interface]\\nAddress = {cfg['server']['addr']}\\nListenPort = {cfg['server']['port']}\\nPrivateKey = <server_private_key>")
print(f"\\n[Peer]\\nPublicKey = <client_public_key>\\nAllowedIPs = 10.0.0.2/32")

print("\\n=== 客户端配置 ===")
print(f"[Interface]\\nAddress = {cfg['client']['addr']}\\nPrivateKey = <client_private_key>\\nDNS = {cfg['client']['dns']}")
print(f"\\n[Peer]\\nPublicKey = <server_public_key>\\nEndpoint = {cfg['endpoint']}:{cfg['server']['port']}\\nAllowedIPs = 0.0.0.0/0")''',
         ["WireGuard比OpenVPN更快更简洁", "AllowedIPs控制路由", "wg-quick up wg0启动接口"],
         "生成双端配置", "VPN配置"),

    11: ("告警质量评估器", "medium", "计算IDS告警的精确率、召回率(FPR)和误报率。",
         '''class AlertQuality:
    def __init__(self):
        self.tp = self.fp = self.tn = self.fn = 0
    def add(self, attack, alert):
        if attack and alert: self.tp += 1
        elif not attack and alert: self.fp += 1
        elif not attack and not alert: self.tn += 1
        else: self.fn += 1
    def report(self):
        p = self.tp/(self.tp+self.fp) if self.tp+self.fp>0 else 0
        r = self.tp/(self.tp+self.fn) if self.tp+self.fn>0 else 0
        f = self.fp/(self.fp+self.tn) if self.fp+self.tn>0 else 0
        print(f"Recall={r:.1%} Precision={p:.1%} FPR={f:.1%}")
        if f > 0.1: print("!! FPR过高需调优")

import random; random.seed(42)
aq = AlertQuality()
for _ in range(45): aq.add(True, True)
for _ in range(5): aq.add(True, False)
for _ in range(12): aq.add(False, True)
for _ in range(38): aq.add(False, False)
aq.report()''',
         ["TP=正确告警 FP=误报 FN=漏报", "Precision=TP/(TP+FP)", "Recall=TP/(TP+FN)"],
         "Recall 90%, FPR 24%", "告警质量"),

    12: ("SYN Flood检测器", "medium", "基于计数器检测SYN Flood攻击源。",
         '''from collections import defaultdict
packets = [('10.0.0.99', 'SYN')] * 150 + [('192.168.1.50', 'SYN')] * 10
TH = 100

cnt = defaultdict(int)
attackers = set()
for ip, ptype in packets:
    if ptype == 'SYN':
        cnt[ip] += 1
        if cnt[ip] >= TH:
            attackers.add(ip)

print(f"检测到 {len(attackers)} 个攻击源:")
for ip in attackers:
    print(f"  [SYN Flood] {ip} ({cnt[ip]} SYN包)")''',
         ["SYN Flood消耗半连接队列", "阈值检测最简单有效", "synacookies是内核级防护"],
         "检测到10.0.0.99", "DDoS防护"),

    13: ("DNS隧道检测器", "medium", "检测DNS隧道:长域名、高熵值DGA和可疑TLD。",
         '''queries = [
    'www.google.com',
    'abcdefgh123456789data.malware.xyz',
    'A' * 50 + '.evil.tk',
    'api.github.com',
]
SUSP_TLD = {'.tk', '.ml', '.ga', '.xyz'}

alerts = []
for q in queries:
    if len(q) > 50:
        alerts.append(f"[DNS隧道] 长域名 ({len(q)}字符)")
    sub = q.split('.')[0]
    if len(set(sub)) / max(len(sub), 1) > 0.5 and len(sub) > 10:
        alerts.append(f"[DGA] 高熵域名: {q[:50]}...")
    if any(q.endswith(tld) for tld in SUSP_TLD):
        alerts.append(f"[可疑TLD] {q}")

print(f"检测到 {len(alerts)} 个异常DNS:")
for a in alerts:
    print(f"  {a}")''',
         ["正常DNS<253字符", "隧道用长域名编码数据外传", "DGA域名有高熵随机特征"],
         "检测2个隧道和DGA", "DNS安全"),

    14: ("CDN缓存命中率监控", "easy", "监控CDN缓存命中率,评估CDN防护效果。",
         '''import random; random.seed(42)
hits, misses, n = 0, 0, 100
for i in range(n):
    if random.random() < 0.90:
        hits += 1
    else:
        misses += 1
        print(f'[Miss] 请求#{i} -> 回源')

rate = hits / n * 100
print(f'\\n请求: {n} | 命中: {hits} | 回源: {misses}')
print(f'缓存命中率: {rate:.1f}%')
if rate < 80:
    print('命中率偏低,需优化CDN缓存策略!')''',
         ["缓存命中率=hits/total", "回源率越低源站压力越小", "静态资源应设更长TTL"],
         "命中率约90%", "CDN监控"),

    15: ("Linux安全基线检查", "easy", "检查Linux的SSH/密码策略/SELinux/防火墙配置。",
         '''config = {
    'ssh_root': False, 'ssh_pass': True,
    'pass_max_days': 99999, 'selinux': 'disabled',
    'firewall': 'inactive',
}
findings = []
if config['ssh_root']:
    findings.append('[高] SSH允许root登录')
if config['ssh_pass']:
    findings.append('[中] 建议用密钥替代密码认证')
if config['pass_max_days'] > 90:
    findings.append(f'[中] 密码有效期{config["pass_max_days"]}天过长')
if config['selinux'] == 'disabled':
    findings.append('[高] SELinux已禁用')
if config['firewall'] == 'inactive':
    findings.append('[高] 防火墙未激活')

print(f"发现 {len(findings)} 个安全问题:")
for f in findings:
    print(f"  {f}")''',
         ["禁用root直登SSH", "密钥认证替代密码", "SELinux提供MAC强制访问控制"],
         "发现4个安全问题", "Linux加固"),

    16: ("AD组策略审计", "medium", "审计Windows AD GPO中的密码/锁定/审计安全配置。",
         '''gpo = {
    'pass_complex': False, 'pass_hist': 0,
    'lockout': 0, 'audit_logon': 'Disabled',
    'lm_hash': True,
}
findings = []
if not gpo['pass_complex']:
    findings.append('[高] 密码复杂度未启用')
if gpo['lockout'] == 0:
    findings.append('[高] 账户锁定未配置(可暴力破解)')
if gpo['audit_logon'] == 'Disabled':
    findings.append('[中] 登录审计未启用')
if gpo['lm_hash']:
    findings.append('[高] LM Hash仍存储(极易破解)')

print(f"发现 {len(findings)} 个GPO安全问题:")
for f in findings:
    print(f"  {f}")''',
         ["LM Hash极易彩虹表破解", "账户锁定防暴力破解", "审计日志是事件追溯基础"],
         "发现4个安全问题", "AD审计"),

    17: ("SQL安全审计查询", "easy", "生成数据库安全审计SQL(无密码/超级权限/旧插件)。",
         '''queries = [
    "-- 1. 无密码用户",
    "SELECT user,host FROM mysql.user WHERE authentication_string='' OR authentication_string IS NULL;",
    "",
    "-- 2. 超级权限+远程访问",
    "SELECT user,host FROM mysql.user WHERE Grant_priv='Y' AND host!='localhost';",
    "",
    "-- 3. 旧认证插件",
    "SELECT user,host,plugin FROM mysql.user WHERE plugin='mysql_native_password';",
]
for q in queries:
    print(q)''',
         ["空authentication_string=无密码", "mysql_native_password已过时", "推荐caching_sha2_password"],
         "输出3组审计SQL", "DB审计"),

    18: ("Docker安全扫描", "medium", "扫描Docker容器的特权模式/敏感挂载风险。",
         '''containers = [
    {'name': 'web', 'priv': False, 'mounts': ['/var/www/html']},
    {'name': 'db', 'priv': True, 'mounts': ['/var/run/docker.sock']},
    {'name': 'mon', 'priv': False, 'mounts': ['/', '/etc']},
]
print("=== Docker安全审计 ===")
for c in containers:
    issues = []
    if c['priv']:
        issues.append('[严重] 特权模式')
    if any('docker.sock' in m for m in c['mounts']):
        issues.append('[严重] 挂载docker.sock=可逃逸')
    if any(m == '/' for m in c['mounts']):
        issues.append('[高危] 挂载宿主根目录')
    status = f'{len(issues)}问题' if issues else '安全'
    print(f"{c['name']}: [{status}]")
    for i in issues:
        print(f"  {i}")''',
         ["特权模式可访问所有宿主设备", "挂载docker.sock等于拥有root", "使用非root用户运行容器"],
         "db和mon容器有问题", "Docker安全"),

    19: ("IAM策略审计", "medium", "审计云IAM策略中的过度权限和危险权限组合。",
         '''policies = [
    {'user': 'alice', 'perms': ['ec2:Describe*', 's3:GetObject']},
    {'user': 'bob', 'perms': ['*:*']},
    {'user': 'monitor', 'perms': ['s3:*', 'iam:CreateUser']},
]
findings = []
for p in policies:
    for perm in p['perms']:
        if perm == '*:*':
            findings.append(f"[严重] {p['user']} 拥有全部权限!")
        if perm.startswith('iam:'):
            findings.append(f"[高危] {p['user']} 有IAM权限: {perm}")

print(f"发现 {len(findings)} 个IAM风险:")
for f in findings:
    print(f"  {f}")''',
         ["*:*=最大权限,极度危险", "iam:CreateUser可创建后门", "最小权限原则:按需分配"],
         "bob和monitor有风险", "云IAM审计"),

    20: ("API密钥安全扫描", "easy", "扫描代码中泄露的API密钥和Token模式。",
         '''import re
code = \"\"\"
API_KEY = "sk-abc123def456ghi789"
TOKEN = "ghp_1a2b3c4d5e6f7g8h9i0j"
AWS_KEY = "AKIAIOSFODNN7EXAMPLE"
\"\"\"
patterns = {
    r'sk-[\\w-]{10,}': 'OpenAI Key',
    r'ghp_[\\w]{10,}': 'GitHub Token',
    r'AKIA[\\w]{16}': 'AWS Key',
    r'-----BEGIN\\s(?:RSA |EC )?PRIVATE KEY-----': 'Private Key',
}
for pat, label in patterns.items():
    m = re.findall(pat, code)
    if m:
        print(f'[泄露] {label}: {m[0][:25]}...')

print("\\n建议: 使用.gitignore + 环境变量管理密钥")''',
         ["sk-是OpenAI Key前缀", "ghp_是GitHub Token", "永远不要硬编码密钥在代码中"],
         "发现3个密钥泄露", "密钥扫描"),

    21: ("SDL检查清单评估", "easy", "评估安全开发生命周期(SDL)各阶段的完成度。",
         '''phases = {
    '需求': ['安全需求', '威胁建模', '隐私评估'],
    '设计': ['安全架构评审', '加密方案'],
    '实现': ['SAST扫描', '依赖检查', '代码审查'],
    '测试': ['DAST测试', '渗透测试', '模糊测试'],
    '部署': ['安全配置检查', '密钥管理'],
}
done = ['安全需求', '威胁建模', '安全架构评审', 'SAST扫描', '依赖检查']
print("=== SDL检查清单 ===")
total = sum(len(v) for v in phases.values())
d_count = 0
for phase, items in phases.items():
    pd = sum(1 for i in items if i in done)
    d_count += pd
    bar = '\u2588' * pd + '\u2591' * (len(items) - pd)
    print(f"[{phase}] {bar} {pd}/{len(items)}")
print(f"\\n总完成度: {d_count}/{total} ({d_count/total:.0%})")''',
         ["SDL各阶段:需求/设计/实现/测试/部署", "SAST=静态分析 DAST=动态测试", "威胁建模在设计阶段最关键"],
         "完成度约38%", "SDL检查"),

    22: ("等保合规检查", "easy", "检查等级保护2.0各安全域的控制覆盖度。",
         '''controls = {
    '物理安全': ['门禁', '监控', '温控'],
    '网络安全': ['防火墙', 'IDS', '网络审计'],
    '主机安全': ['访问控制', '安全审计', '入侵防范'],
    '应用安全': ['身份鉴别', '访问控制', '通信加密'],
    '数据安全': ['数据加密', '备份恢复', '数据脱敏'],
}
done_item = ['门禁', '监控', '防火墙', 'IDS', '访问控制', '身份鉴别', '通信加密', '数据加密', '备份恢复']
print("=== 等保2.0合规检查 ===")
total = sum(len(v) for v in controls.values()); d = 0
for domain, items in controls.items():
    dd = sum(1 for i in items if i in done_item); d += dd
    rate = dd / len(items) * 100
    flag = 'OK' if rate >= 67 else '!!' if rate >= 33 else 'XX'
    print(f"{flag} {domain}: {rate:.0f}%")
    missing = [i for i in items if i not in done_item]
    if missing:
        print(f"  缺失: {missing}")
print(f"\\n总体合规率: {d}/{total} ({d/total:.0%})")''',
         ["等保2.0=网络安全等级保护", "五个安全域:物理/网络/主机/应用/数据", "67%以上为合规"],
         "总体合规率60%", "等保检查"),

    23: ("等级保护差距分析", "medium", "对比当前状态与等保要求,计算差距并按优先级排序。",
         '''req = {
    '物理安全': ['门禁', '监控', '温控'],
    '网络安全': ['防火墙', 'IDS', 'WAF'],
    '主机安全': ['访问控制', '审计', '杀毒'],
}
cur = ['门禁', '防火墙', '访问控制']
total = sum(len(v) for v in req.values()); done = 0
gaps = []
for d, items in req.items():
    t = len(items); done += sum(1 for i in items if i in cur)
    missing = [i for i in items if i not in cur]
    if missing:
        gaps.append((d, len(missing), missing))

print(f"合规: {done}/{total} ({done/total:.0%})")
gaps.sort(key=lambda x: x[1], reverse=True)
for d, cnt, items in gaps:
    print(f"[缺{cnt}项] {d}: {items}")''',
         ["差距分析=当前vs要求", "按缺失项数排序优先级", "等保建设需要整改计划"],
         "网络安全缺2项排第一", "等保差距"),

    24: ("风险评估计算器", "easy", "计算风险值=资产价值x威胁等级x脆弱性等级。",
         '''assets = [
    {'name': '核心数据库', 'value': 5, 'threat': 4, 'vuln': 3},
    {'name': '企业官网', 'value': 2, 'threat': 2, 'vuln': 2},
]
print("=== 风险评估 ===")
for a in assets:
    risk = a['value'] * a['threat'] * a['vuln']
    lv = '严重' if risk >= 40 else '高' if risk >= 20 else '中' if risk >= 10 else '低'
    print(f"[{lv}] {a['name']}: {risk}分 (资产{a['value']} x 威胁{a['threat']} x 脆弱性{a['vuln']})")''',
         ["风险=资产价值x威胁x脆弱性", "优先级按风险值排序", "GB/T 20984是风险评估标准"],
         "核心数据库60分严重", "风险评估"),

    25: ("RTO/RPO计算器", "easy", "计算系统灾难恢复的RTO和RPO,按停机成本排序。",
         '''systems = [
    {'name': '核心交易', 'rto': 15, 'rpo': 5, 'cost': 100000},
    {'name': '邮件系统', 'rto': 240, 'rpo': 60, 'cost': 10000},
    {'name': '内网门户', 'rto': 480, 'rpo': 1440, 'cost': 5000},
]
print(f"{'系统':12s} {'RTO(min)':10s} {'RPO(min)':10s} {'停机成本/h':12s} {'优先级'}")
print("-" * 60)
for s in sorted(systems, key=lambda x: x['cost'], reverse=True):
    p = '紧急' if s['rto'] <= 15 else '高' if s['rto'] <= 60 else '中' if s['rto'] <= 240 else '低'
    print(f"{s['name']:12s} {s['rto']:<10d} {s['rpo']:<10d} {s['cost']:>10,}元     [{p}]")''',
         ["RTO=恢复时间目标", "RPO=可接受数据丢失量", "停机成本决定恢复优先级"],
         "核心交易紧急,邮件中级", "灾备评估"),

    26: ("安全策略模板生成", "easy", "生成密码策略、访问控制等安全制度文档框架。",
         '''policies = ['密码管理', '访问控制', '应急响应', '数据分类']
for policy in policies:
    print("=" * 50)
    print(f"  {policy}策略")
    print("=" * 50)
    print(f"版本: v1.0  生效日: ____  责任人: ____")
    print(f"目的: 明确{policy}的管理要求和标准")
    print(f"范围: 公司全体员工及信息系统")
    print(f"违规: 按信息安全管理制度处理")
    print()''',
         ["安全策略是安全管理的基础", "制度文档需版本+责任人+审批人", "等保要求建立安全管理制度"],
         "生成4个策略模板", "安全策略"),

    27: ("钓鱼邮件模拟器", "easy", "生成钓鱼邮件测试,统计点击率和安全意识得分。",
         '''import random; random.seed(42)
users = ['alice', 'bob', 'charlie', 'diana', 'eve', 'frank', 'grace', 'henry']
clicked = [u for u in users if random.random() < 0.3]
reported = [u for u in users if random.random() < 0.4]

print(f"发送 {len(users)} 封钓鱼测试邮件")
print(f"点击钓鱼链接: {len(clicked)}人 ({len(clicked)/len(users):.0%})")
print(f"主动报告钓鱼: {len(reported)}人 ({len(reported)/len(users):.0%})")
score = (len(users) - len(clicked)) / len(users) * 100
print(f"安全意识得分: {score:.0f}/100")''',
         ["钓鱼测试量化安全意识", "报告钓鱼邮件也是好行为", "定期演练提升防范意识"],
         "安全得分约70分", "安全意识"),

    28: ("红蓝对抗评分", "medium", "根据红队攻击路径和蓝队检测结果计算对抗得分。",
         '''red = {'webshell': True, 'priv_esc': True, 'lateral': False, 'exfil': False}
blue = {'detect_webshell': True, 'detect_priv_esc': False, 'block_lateral': True}

r_score = sum(1 for v in red.values() if v) * 25
b_score = sum(1 for v in blue.values() if v) * 33

print("=== 红蓝对抗评分 ===")
print(f"红队 (攻击达成): {r_score}/100")
print(f"蓝队 (检测阻断): {b_score}/100")
if b_score >= 50:
    print("结论: 蓝队防御有效!")
else:
    print("结论: 蓝队需加强检测和响应能力")''',
         ["红蓝对抗=攻防演练", "红队目标:渗透成功", "蓝队目标:发现并阻断攻击"],
         "红队50/蓝队67", "红蓝对抗"),

    29: ("威胁情报IOC提取", "easy", "从安全报告中提取IP/域名/哈希等IOC指标。",
         '''import re
report = \"\"\"
攻击源IP: 10.0.0.99, 192.168.1.100
C2域名: evil.xyz, bad.tk
文件MD5: d41d8cd98f00b204e9800998ecf8427e
SHA256: e3b0c44298fc1c149afbf4c8996fb924
\"\"\"
ips = re.findall(r'\\d+\\.\\d+\\.\\d+\\.\\d+', report)
domains = re.findall(r'[\\w-]+\\.(?:xyz|tk|com|org)', report)
md5s = re.findall(r'[a-f0-9]{32}', report, re.I)

print(f"IP({len(ips)}): {ips}")
print(f"域名({len(domains)}): {domains}")
print(f"MD5({len(md5s)}): {md5s}")
print(f"\\n共提取 {len(ips)+len(domains)+len(md5s)} 个IOC")''',
         ["IOC=Indicator of Compromise", "IP/域名/Hash是常见IOC", "MISP是威胁情报共享平台"],
         "提取5个IOC指标", "IOC提取"),

    30: ("SOC成熟度评估", "medium", "评估安全运营中心在人员/流程/技术三维的成熟度。",
         '''dims = {
    '人员': {'技能培训': 2, '人员配置': 3, '值班制度': 4},
    '流程': {'事件响应': 3, '变更管理': 2, 'SOP标准': 3},
    '技术': {'SIEM平台': 4, 'SOAR编排': 2, 'UEBA分析': 1},
}
print("=== SOC成熟度评估 ===")
total, cnt = 0, 0
for cat, items in dims.items():
    avg = sum(items.values()) / len(items)
    total += sum(items.values()); cnt += len(items)
    lv = '成熟' if avg >= 4 else '发展中' if avg >= 3 else '初级' if avg >= 2 else '起步'
    print(f"\\n[{cat}] {avg:.1f}/5 ({lv})")
    for k, v in items.items():
        stars = '\u2605' * v + '\u2606' * (5 - v)
        print(f"  {k}: {stars} {v}/5")
avg = total / cnt
print(f"\\n总体成熟度: {avg:.1f}/5")''',
         ["CMM成熟度模型:1-5级", "三维评估:人员/流程/技术", "5级=持续优化 3级=已定义"],
         "总体2.6/5(发展中)", "SOC成熟度"),
}


# ============================================================
# 构建完整的练习字典
# ============================================================
for day_num, (title, diff, desc, code, hints, expected, tc_desc) in TITLES_PEN.items():
    if day_num not in [1, 2, 3, 4, 5]:  # 已手动定义1-5
        day_id = f"pen-{day_num}"
        ex_id = f"ex-p{day_num}-1"
        PEN[day_id] = [make_ex(ex_id, title, diff, desc, code, hints, expected, tc_desc)]

for day_num, (title, diff, desc, code, hints, expected, tc_desc) in TITLES_DEF.items():
    day_id = f"def-{day_num}"
    ex_id = f"ex-d{day_num}-1"
    DEF[day_id] = [make_ex(ex_id, title, diff, desc, code, hints, expected, tc_desc)]

# ============================================================
# 主流程
# ============================================================
def main():
    base = os.path.dirname(os.path.abspath(__file__))
    src = os.path.join(base, 'src', 'data')

    # 验证数据
    print(f"渗透测试练习: {len(PEN)} 天 ({sum(len(v) for v in PEN.values())} 道)")
    print(f"防御练习: {len(DEF)} 天 ({sum(len(v) for v in DEF.values())} 道)")
    print()

    for name, file_part, ex_map, prefix in [
        ("渗透测试计划", "cyberPenetration.ts", PEN, "pen"),
        ("防御计划", "cyberDefense.ts", DEF, "def"),
    ]:
        fpath = os.path.join(src, file_part)
        if os.path.exists(fpath):
            print(f"=== 处理 {name} ===")
            n = inject(fpath, ex_map)
            print(f"完成: {n} 天\n")
        else:
            print(f"文件不存在: {fpath}")

    print("=" * 60)
    print("全部完成! 请运行:")
    print("  cd cisp && npx tsc --noEmit")
    print("=" * 60)

if __name__ == '__main__':
    main()
