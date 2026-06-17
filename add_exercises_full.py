#!/usr/bin/env python3
"""批量向渗透测试和防御计划添加编程练习 (codingExercises)"""
import json, os, re

# ============================================================
# 通用注入函数
# ============================================================
def find_day_end_before(next_id_pos, content):
    for i in range(next_id_pos - 1, -1, -1):
        if content[i] == '}': return i
    return -1

def inject_coding_exercises(filepath, exercises_map, id_prefix):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    day_positions = []
    for day_id in exercises_map:
        for fmt in [f"id: '{day_id}'", f'id: "{day_id}"']:
            p = content.find(fmt)
            if p != -1:
                day_positions.append((day_id, p))
                break
    day_positions.sort(key=lambda x: x[1])
    modified = 0
    for idx in range(len(day_positions) - 1, -1, -1):
        day_id, day_start = day_positions[idx]
        exercises = exercises_map[day_id]
        if idx + 1 < len(day_positions):
            end_pos = find_day_end_before(day_positions[idx + 1][1], content)
            if end_pos == -1:
                end_pos = content.rfind('}', day_start, day_positions[idx + 1][1])
        else:
            last_bracket = content.rfind(']')
            end_pos = content.rfind('}', day_start, last_bracket) if last_bracket > 0 else -1
        if end_pos == -1:
            print(f"  警告: 找不到 {day_id} 结束位置")
            continue
        segment = content[day_start:end_pos]
        if 'codingExercises' in segment:
            print(f"  跳过 {day_id}: 已有")
            continue
        exercises_json = json.dumps(exercises, ensure_ascii=False, separators=(',', ':'))
        injection = f',\n    codingExercises: {exercises_json}\n  '
        content = content[:end_pos] + injection + content[end_pos:]
        modified += 1
        print(f"  已注入 {day_id}: {len(exercises)} 道")
    if modified > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  共修改 {modified} 天, 已保存 {filepath}")
    return modified

# ============================================================
# 快速生成单道练习题的工具函数
# ============================================================
def mk_ex(ex_id, title, difficulty, description, template, solution, hints, expected, desc_tc):
    return [{
        "id": ex_id, "title": title, "difficulty": difficulty,
        "description": description, "template": template, "solution": solution,
        "testCases": [{"input": "输入", "expectedOutput": expected, "description": desc_tc}],
        "hints": hints
    }]

# ============================================================
# 渗透测试练习 (30天)
# ============================================================
P = {}
P["pen-1"] = mk_ex("ex-p1-1","渗透测试授权验证器","easy",
"验证渗透测试授权信息：检查必填字段和有效期。",
'from datetime import datetime\ndef check_auth(info):\n    # TODO: 检查必填字段和有效期\n    pass\nauth = {"授权方":"Example Corp","测试范围":"web.example.com","有效期至":"2025-12-31"}\nprint(check_auth(auth))',
'from datetime import datetime\ndef check_auth(info):\n    fields=["授权方","测试范围","有效期至"]\n    missing=[k for k in fields if k not in info]\n    if missing: return f"[风险] 缺少: {missing}"\n    if datetime.strptime(info["有效期至"],"%Y-%m-%d")<datetime.now():\n        return "[风险] 授权已过期"\n    return f"[通过] 范围: {info[\"测试范围\"]}"\nauth={"授权方":"Example Corp","测试范围":"web.example.com","有效期至":"2025-12-31"}\nprint(check_auth(auth))',
["datetime.strptime解析日期","列表推导检查缺失字段","未授权渗透测试违法"],
"检查通过", "授权验证")

P["pen-2"] = mk_ex("ex-p2-1","WHOIS信息解析","easy",
"解析WHOIS查询记录,提取注册人、DNS服务器。",
'import re\ndata="""Domain: EXAMPLE.COM\nRegistrar: GoDaddy\nNS: NS1.EXAMPLE.COM\nNS: NS2.EXAMPLE.COM\n"""\ndef parse(data):\n    # TODO: 提取域名/注册商/DNS\n    return {}\nprint(parse(data))',
'import re\ndata="""Domain: EXAMPLE.COM\nRegistrar: GoDaddy\nNS: NS1.EXAMPLE.COM\nNS: NS2.EXAMPLE.COM\n"""\ndef parse(d):\n    return {"domain":re.search(r"Domain:\\s*(\\S+)",d).group(1),"registrar":re.search(r"Registrar:\\s*(.+)",d).group(1),"ns":re.findall(r"NS:\\s*(\\S+)",d)}\nprint(parse(data))',
["re.search获取第一个匹配","re.findall获取全部匹配","WHOIS是公开信息源"],
"提取3个字段", "WHOIS解析")

P["pen-3"] = mk_ex("ex-p3-1","DNS记录分组分析","medium",
"按记录类型分组,识别SPF和MX。",
'dns=[("A","ex.com","1.2.3.4"),("MX","ex.com","mail.ex.com"),("TXT","ex.com","v=spf1 ~all")]\ndef analyze(records):\n    # TODO: 按类型分组,识别SPF\n    pass\nanalyze(dns)',
'dns=[("A","ex.com","1.2.3.4"),("MX","ex.com","mail.ex.com"),("TXT","ex.com","v=spf1 ~all")]\ndef analyze(records):\n    g={};[g.setdefault(r[0],[]).append(r[1:]) for r in records]\n    for t,es in g.items():\n        print(f"[{t}] {len(es)}条")\n        for n,v in es:\n            if t=="TXT" and v.startswith("v=spf1"): print(f"  SPF: {v}")',
["dict.setdefault处理分组","TXT记录含SPF,DKIM,DMARC","MX记录用于邮件服务器发现"],
"分组并识别SPF", "DNS分析")

P["pen-4"] = mk_ex("ex-p4-1","Nmap扫描结果解析","medium",
"统计开放端口和服务分布,找出多主机共现服务。",
'from collections import Counter\nresults=[{"host":"192.168.1.1","ports":[{"port":22,"state":"open","svc":"ssh"},{"port":80,"state":"open","svc":"http"}]},{"host":"192.168.1.10","ports":[{"port":22,"state":"open","svc":"ssh"},{"port":443,"state":"open","svc":"https"}]}]\ndef analyze(r):\n    # TODO: 统计开放端口,找出共现服务\n    pass\nanalyze(results)',
'from collections import Counter\nresults=[{"host":"192.168.1.1","ports":[{"port":22,"state":"open","svc":"ssh"},{"port":80,"state":"open","svc":"http"}]},{"host":"192.168.1.10","ports":[{"port":22,"state":"open","svc":"ssh"},{"port":443,"state":"open","svc":"https"}]}]\ndef analyze(r):\n    svcs=Counter();opened=0\n    for h in r:\n        opens=[p for p in h["ports"] if p["state"]=="open"]\n        opened+=len(opens);svcs.update(p["svc"] for p in opens)\n        print(f\'{h["host"]}: {\",\".join(f\"{p[\"port\"]}/{p[\"svc\"]}\" for p in opens)}\')\n    print(f"共{opened}个开放端口");print(f"多主机服务: {[s for s,c in svcs.items() if c>1]}")\nanalyze(results)',
["列表推导过滤open端口","Counter统计服务频率","ssh(22)和http(80)最常见"],
"ssh出现在2台主机", "Nmap分析")

P["pen-5"] = mk_ex("ex-p5-1","OS指纹识别","medium",
"根据TTL和TCP窗口大小匹配操作系统。",
'fp=[{"os":"Linux","ttl":64,"win":5840},{"os":"Windows","ttl":128,"win":65535},{"os":"FreeBSD","ttl":64,"win":65535}]\ndef match(ttl,win):\n    # TODO: 精确/模糊匹配OS\n    return "未知"\ntests=[(64,5840),(128,65535),(64,29200)]\nfor t,w in tests:print(f"TTL={t} Win={w} -> {match(t,w)}")',
'fp=[{"os":"Linux","ttl":64,"win":5840},{"os":"Windows","ttl":128,"win":65535},{"os":"FreeBSD","ttl":64,"win":65535}]\ndef match(ttl,win):\n    for f in fp:\n        if f["ttl"]==ttl and f["win"]==win: return f"[精确] {f[\"os\"]}"\n    for f in fp:\n        if f["ttl"]==ttl: return f"[TTL匹配] 可能是 {f[\"os\"]}"\n    return "未知"\ntests=[(64,5840),(128,65535),(64,29200)]\nfor t,w in tests:print(f"TTL={t} Win={w} -> {match(t,w)}")',
["Linux TTL=64, Windows=128, Cisco=255","TCP Window不同OS差异大","Nmap -O用多种探针做OS检测"],
"识别Linux和Windows", "OS指纹")

P["pen-6"] = mk_ex("ex-p6-1","目录扫描模拟","easy",
"模拟Web目录爆破,按HTTP状态码判断路径是否存在。",
'responses={"/admin":200,"/login":200,"/.git":403,"/shell.php":404,"/robots.txt":200}\nwordlist=["/admin","/login","/.git","/shell.php","/robots.txt","/config"]\ndef scan(wordlist,resp):\n    # TODO: 200=发现 403=存在 404=不存在\n    found=[]\n    return found\nresults=scan(wordlist,responses)\nprint(f"发现{len(results)}条:",results)',
'responses={"/admin":200,"/login":200,"/.git":403,"/shell.php":404,"/robots.txt":200}\nwordlist=["/admin","/login","/.git","/shell.php","/robots.txt","/config"]\ndef scan(wl,resp):\n    found=[]\n    for p in wl:\n        code=resp.get(p,404)\n        if code==200: found.append(f"{p} 已发现")\n        elif code==403: found.append(f"{p} 存在(禁止)")\n    return found\nresults=scan(wordlist,responses)\nprint(f"发现{len(results)}条:");[print(f" {r}") for r in results]',
["200=成功 403=存在 404=不存在","robots.txt常暴露敏感路径","实际使用gobuster/dirbuster"],
"发现4条路径", "目录扫描")

P["pen-7"] = mk_ex("ex-p7-1","社工信息提取","easy",
"从文本中提取邮箱地址和社交账号。",
'import re\ntext="contact: admin@ex.com, @dev_team, github.com/proj-x, hr@corp.org"\ndef extract(t):\n    # TODO: 提取邮箱和@用户名\n    return{"emails":[],"social":[],"github":[]}\nr=extract(text);print(f"邮箱:{len(r[\'emails\'])} 社交:{len(r[\'social\'])}")',
'import re\ntext="contact: admin@ex.com, @dev_team, github.com/proj-x, hr@corp.org"\ndef extract(t):\n    emails=re.findall(r"[\\w.-]+@[\\w.-]+\\.\\w+",t)\n    social=re.findall(r"@(\\w+)",t)\n    github=re.findall(r"github\\.com/([\\w-]+)",t)\n    return{"emails":emails,"social":social,"github":github}\nr=extract(text);print(f"邮箱:{len(r[\"emails\"])} 社交:{len(r[\"social\"])} GitHub:{r[\"github\"]}")',
["邮箱正则: [\\w.-]+@[\\w.-]+\\.\\w+","@username提取社交账号","GitHub仓库用re.findall"],
"2邮箱/1社交/1GitHub", "社工信息")

P["pen-8"] = mk_ex("ex-p8-1","HTTP请求注入检测","medium",
"检测HTTP请求中的SQL注入和XSS模式。",
'import re\nreqs=["GET /login?user=admin&pass=123","GET /search?q=hello","POST /api {\\"id\\":\\"1 OR 1=1\\"}","GET /x?a=<script>"]\ndef detect(r):\n    # TODO: 检测SQL注入和XSS\n    issues=[]\n    return issues\nfor r in reqs:\n    issues=detect(r);[print(f"  {i}") for i in issues] if issues else print("安全")',
'import re\nreqs=["GET /login?user=admin&pass=123","GET /search?q=hello","POST /api {\\"id\\":\\"1 OR 1=1\\"}","GET /x?a=<script>"]\ndef detect(r):\n    i=[]\n    if re.search(r"\\bOR\\s+\\d+\\s*=\\s*\\d+|UNION\\s+SELECT",r,re.I): i.append("[SQL注入]")\n    if re.search(r"<script|<iframe|javascript:",r,re.I): i.append("[XSS]")\n    return i\nfor r in reqs:\n    i=detect(r);m=r.split()[0]\n    print(f"[{m}]:",*i if i else ["安全"])',
["re.search检测SQL注入模式","检测<script>/javascript:等XSS向量","Burp Suite自动识别注入点"],
"检测到SQL注入和XSS", "请求分析")

P["pen-9"] = mk_ex("ex-p9-1","SQL注入Payload生成","medium",
"生成联合查询/报错注入/盲注的SQLi Payload。",
'def gen_payloads(param,val):\n    # TODO: 生成3类注入payload\n    return []\nfor p in gen_payloads("id","1"):print(p)',
'def gen_payloads(param,val):\n    return[\n        f"{val}\\\' UNION SELECT 1,2,3-- -",\n        f"{val}\\\' AND extractvalue(1,concat(0x7e,version()))-- -",\n        f"{val}\\\' AND SLEEP(5)-- -",\n        f"{val}\\\' AND 1=1-- -",\n    ]\nfor p in gen_payloads("id","1"):print(p)',
["UNION SELECT用于联合查询","extractvalue/updatexml用于报错注入","SLEEP()用于时间盲注"],
"生成4种payload", "SQL注入")

P["pen-10"] = mk_ex("ex-p10-1","XSS Payload分类","easy",
"对XSS payload按注入方式分类并评估危险等级。",
'payloads=["<script>alert(1)</script>","<img src=x onerror=alert(1)>","javascript:alert(1)"]\ndef classify(p):\n    # TODO: 分类为Script标签/事件/javascipt协议\n    return"未知"\nfor p in payloads:print(f"{classify(p)}: {p[:40]}")',
'payloads=["<script>alert(1)</script>","<img src=x onerror=alert(1)>","javascript:alert(1)"]\ndef classify(p):\n    if"<script>"in p:return"Script标签(高危)"\n    if any(e in p for e in["onerror","onload"]):return"事件注入(中危)"\n    if p.startswith("javascript:"):return"javascript协议(高危)"\n    return"未知"\nfor p in payloads:print(f"{classify(p)}: {p[:40]}")',
["<script>直接脚本注入","onerror/onload是事件处理器XSS","javascript:可用于链接注入"],
"3种正确分类", "XSS分类")

P["pen-11"] = mk_ex("ex-p11-1","CSRF Token生成器","easy",
"生成安全的随机CSRF Token并验证。",
'import hashlib,random,time\ndef gen_token():\n    # TODO: 用时间戳+随机数+sha256生成32位token\n    pass\ntok=gen_token();print(f"Token: {tok}")',
'import hashlib,random,time\ndef gen_token():\n    data=f"{time.time()}{random.getrandbits(128)}"\n    return hashlib.sha256(data.encode()).hexdigest()[:32]\ntok=gen_token();print(f"Token: {tok}");print(f"长度: {len(tok)} (应>=32)")',
["hashlib.sha256生成不可预测token","Token必须绑定用户会话","SameSite Cookie也是CSRF防御"],
"生成32位token", "CSRF防护")

P["pen-12"] = mk_ex("ex-p12-1","路径遍历检测器","medium",
"检测路径遍历攻击的多种变种(../, 编码, ....//)。",
'import urllib.parse\npaths=["/view?f=report.pdf","/view?f=../../../etc/passwd","/view?f=..%2f..%2f..%2fetc%2fpasswd"]\ndef detect(p):\n    # TODO: 检测../ 和URL编码变种\n    return"安全"\nfor p in paths:print(f"{detect(p)}: {p[:50]}")',
'import re,urllib.parse\npaths=["/view?f=report.pdf","/view?f=../../../etc/passwd","/view?f=..%2f..%2fetc%2fpasswd"]\ndef detect(p):\n    d=urllib.parse.unquote(p)\n    if re.search(r"\\.\\./|\\.\\.\\\\",d):return"高危-../模式"\n    if re.search(r"\\.\\.%2f|\\.\\.%5c",p,re.I):return"高危-URL编码"\n    return"安全"\nfor p in paths:print(f"{detect(p)}: {p[:50]}")',
["urllib.parse.unquote解码","../和..\\\\都需要检测","%2f和%5c是/和\\的编码"],
"检测2个遍历攻击", "路径遍历")

P["pen-13"] = mk_ex("ex-p13-1","文件上传安全检测","medium",
"检查上传文件的扩展名、双扩展名和MIME类型。",
'import os\nALLOWED={".jpg",".png",".pdf"}\nDANGER={".php",".jsp",".exe",".sh"}\ndef check(fname,mime):\n    # TODO: 白名单检查+双扩展名检测\n    return"安全"\ntests=[("pic.jpg","image/jpeg"),("shell.php","image/jpeg"),("shell.php.jpg","image/jpeg")]\nfor f,m in tests:print(f"{check(f,m)}: {f}")',
'import os;ALLOWED={".jpg",".png",".pdf"};DANGER={".php",".jsp",".exe",".sh"}\ndef check(fname,mime):\n    ext=os.path.splitext(fname)[1].lower()\n    if ext not in ALLOWED:return f"风险-{ext}不在白名单"\n    parts=fname.rsplit(".",2)\n    if len(parts)==3 and parts[-2].lower() in DANGER:return"风险-双扩展名"\n    return"安全"\ntests=[("pic.jpg","image/jpeg"),("shell.php","image/jpeg"),("shell.php.jpg","image/jpeg")]\nfor f,m in tests:print(f"{check(f,m)}: {f}")',
["os.path.splitext获取扩展名","rsplit检测双扩展名","MIME也可伪造,需Magic Bytes验证"],
"检测2个风险文件", "上传安全")

P["pen-14"] = mk_ex("ex-p14-1","缓冲区溢出模拟","hard",
"模拟栈溢出:向固定buffer写入超长数据。",
'def simulate(data,buf_size=16):\n    # TODO: 模拟拷贝到固定buffer,检测溢出\n    pass\nsimulate("Hello");simulate("A"*30)',
'def simulate(data,buf_size=16):\n    overflow=len(data)>buf_size\n    print(f"写入{len(data)}B到{buf_size}B缓冲: {\"溢出!\" if overflow else \"安全\"}")\nsimulate("Hello");simulate("A"*30)',
["超过buf_size即发生溢出","真实栈溢出可覆盖返回地址","ASLR和Canary是防护措施"],
"长输入检测溢出", "缓冲区溢出")

P["pen-15"] = mk_ex("ex-p15-1","SUID提权检测","easy",
"扫描SUID二进制,识别GTFOBins中可提权的条目。",
'KNOWN={"find","python","vim","nmap","bash","less"}\nbinaries=[{"path":"/usr/bin/find","owner":"root"},{"path":"/usr/bin/passwd","owner":"root"},{"path":"/usr/bin/vim","owner":"root"}]\ndef check(kl,bl):\n    # TODO: 检查SUID+root+GTFOBins\n    risks=[]\n    return risks\nprint(check(KNOWN,binaries))',
'KNOWN={"find","python","vim","nmap","bash","less"}\nbinaries=[{"path":"/usr/bin/find","owner":"root"},{"path":"/usr/bin/passwd","owner":"root"},{"path":"/usr/bin/vim","owner":"root"}]\ndef check(kl,bl):\n    risks=[]\n    for b in bl:\n        name=b["path"].split("/")[-1]\n        if name in kl and b["owner"]=="root": risks.append(b["path"])\n    return risks\nr=check(KNOWN,binaries);print(f"可提权: {r}")',
["GTFOBins记录了所有可提权SUID","find -exec可执行任意命令","实际命令: find . -exec /bin/sh -p \\;"],
"发现find和vim", "权限提升")

P["pen-16"] = mk_ex("ex-p16-1","字典攻击模拟","medium",
"使用字典爆破MD5密码哈希。",
'import hashlib\nhashes={"admin":hashlib.md5(b"admin123").hexdigest(),"user":hashlib.md5(b"password").hexdigest()}\nwordlist=["admin","password","admin123","123456"]\ndef crack(hashes,wl):\n    # TODO: 字典攻击\n    cracked={}\n    return cracked\nc=crack(hashes,wordlist);print(f"破解{len(c)}/" + str(len(hashes)))',
'import hashlib\nhashes={"admin":hashlib.md5(b"admin123").hexdigest(),"user":hashlib.md5(b"password").hexdigest()}\nwordlist=["admin","password","admin123","123456"]\ndef crack(hashes,wl):\n    cracked={}\n    for w in wl:\n        wh=hashlib.md5(w.encode()).hexdigest()\n        for user,h in hashes.items():\n            if wh==h: cracked[user]=w;print(f"[CRACKED] {user}:{w}")\n    return cracked\nc=crack(hashes,wordlist);print(f"破解{len(c)}/{len(hashes)}")',
["hashlib.md5(w.encode()).hexdigest()","加盐(Salt)可防字典攻击","实际用hashcat/John the Ripper"],
"2/2破解", "密码破解")

P["pen-17"] = mk_ex("ex-p17-1","令牌窃取检测","medium",
"检测进程持有的token与用户身份不一致(令牌窃取)。",
'procs=[{"pid":1234,"name":"explorer.exe","user":"DOMAIN\\\\user","token":"user"},{"pid":5678,"name":"meterp.exe","user":"DOMAIN\\\\admin","token":"SYSTEM"}]\ndef detect(ps):\n    # TODO: 找token!=user的进程\n    return[]\nr=detect(procs);[print(f"  {a}") for a in r]',
'procs=[{"pid":1234,"name":"explorer.exe","user":"DOMAIN\\\\user","token":"user"},{"pid":5678,"name":"meterp.exe","user":"DOMAIN\\\\admin","token":"SYSTEM"}]\ndef detect(ps):\n    a=[]\n    for p in ps:\n        u=p["user"].split("\\\\")[-1]\n        if p["token"]=="SYSTEM" and u!="SYSTEM":\n            a.append(f"[令牌窃取] PID={p[\"pid\"]} {p[\"name\"]} ({p[\"user\"]})")\n    return a\nr=detect(procs);print(f"检测到{len(r)}个:");[print(f"  {x}") for x in r]',
["SYSTEM是高权限令牌","非SYSTEM用户持有SYSTEM令牌=可疑","Mimikatz可窃取令牌"],
"检测到meterp.exe", "令牌窃取")

P["pen-18"] = mk_ex("ex-p18-1","Linux弱点扫描","medium",
"扫描Linux系统:旧内核/可写敏感文件/危险sudo规则。",
'info={"kernel":"2.6.32-754.el6","writable":["/etc/passwd","/tmp/b.sh"],"sudo":["(ALL) NOPASSWD:/usr/bin/find"]}\nDANGER={"find","vim","python","bash"}\ndef scan(info):\n    # TODO: 检查内核版本/可写文件/危险sudo\n    f=[]\n    return f\nfor x in scan(info):print(x)',
'info={"kernel":"2.6.32-754.el6","writable":["/etc/passwd","/tmp/b.sh"],"sudo":["(ALL) NOPASSWD:/usr/bin/find"]}\nDANGER={"find","vim","python","bash"}\ndef scan(info):\n    f=[]\n    if info["kernel"].startswith("2."): f.append(f\'[高] 旧内核 {info["kernel"]}\')\n    for w in info["writable"]:\n        if"passwd"in w: f.append(f"[严重] {w} 可写!")\n    for r in info["sudo"]:\n        cmd=r.split("/")[-1]\n        if cmd in DANGER: f.append(f"[高危] sudo免密执行{cmd}")\n    return f\nfor x in scan(info):print(x)',
["内核2.x可能有DirtyCow漏洞","可写/etc/passwd=可添加root","sudo免密+危险命令=直接提权"],
"发现3个弱点", "Linux弱点")

P["pen-19"] = mk_ex("ex-p19-1","隐蔽隧道检测","hard",
"检测DNS隧道:大包+固定间隔的心跳行为。",
'pkts=[{"proto":"DNS","size":80,"t":0},{"proto":"DNS","size":1200,"t":5},{"proto":"DNS","size":1150,"t":10}]\ndef detect(ps):\n    # TODO: 检测大包和固定间隔\n    return[]\nfor x in detect(pkts):print(x)',
'pkts=[{"proto":"DNS","size":80,"t":0},{"proto":"DNS","size":1200,"t":5},{"proto":"DNS","size":1150,"t":10}]\ndef detect(ps):\n    a=[]\n    for i,p in enumerate(ps):\n        if p["proto"]=="DNS" and p["size"]>500:\n            a.append(f"[DNS隧道] 包#{i} {p[\"size\"]}B (正常<512B)")\n    dnsp=[p for p in ps if p["proto"]=="DNS"]\n    for i in range(1,len(dnsp)):\n        if dnsp[i]["t"]-dnsp[i-1]["t"]==5:\n            a.append("[心跳] 固定5s间隔")\n    return a\nfor x in detect(pkts):print(x)',
["正常DNS<512字节","隧道用长域名编码数据外传","固定间隔心跳=Beacon C2通信"],
"检测到大包+心跳", "隧道检测")

P["pen-20"] = mk_ex("ex-p20-1","后门检测脚本","medium",
"扫描计划任务中可疑路径和脚本文件。",
'tasks=[{"name":"WinUpdate","path":"C:\\\\Win\\\\sys32\\\\wu.exe","trig":"daily"},{"name":"AdobeUp","path":"C:\\\\Win\\\\temp\\\\bk.exe","trig":"logon"}]\nSUS_DIR=["temp","tmp","public"]\ndef find_bd(ts):\n    # TODO: 检查可疑目录和脚本\n    return[]\nfor x in find_bd(tasks):print(x)',
'tasks=[{"name":"WinUpdate","path":"C:\\\\Win\\\\sys32\\\\wu.exe","trig":"daily"},{"name":"AdobeUp","path":"C:\\\\Win\\\\temp\\\\bk.exe","trig":"logon"}]\nSUS_DIR=["temp","tmp","public"]\ndef find_bd(ts):\n    s=[]\n    for t in ts:\n        p=t["path"].lower()\n        if any(d in p for d in SUS_DIR): s.append(f"[后门] {t[\"name\"]} 在可疑目录")\n        if p.endswith((".vbs",".ps1",".bat")): s.append(f"[脚本后门] {t[\"name\"]}")\n    return s\nfor x in find_bd(tasks):print(x)',
["temp/public是后门常驻目录",".vbs/.ps1常用于无文件攻击","计划任务是最常见的持久化手法"],
"检测到AdobeUp", "后门检测")

P["pen-21"] = mk_ex("ex-p21-1","日志篡改检测","easy",
"检测日志中的时间倒退和清除标记。",
'from datetime import datetime\nlogs=["2024-01-15 10:00:01 INFO log","2024-01-15 10:05:33 INFO file","2024-01-15 15:30:00 AUDIT cleared"]\ndef detect(es):\n    # TODO: 时间倒退/清除关键字\n    return[]\nfor x in detect(logs):print(x)',
'from datetime import datetime\nlogs=["2024-01-15 10:00:01 log","2024-01-15 10:05:33 log","2024-01-15 15:30:00 cleared"]\ndef detect(es):\n    a=[];prev=None\n    for e in es:\n        ts=datetime.strptime(e[:19],"%Y-%m-%d %H:%M:%S")\n        if prev and ts<prev: a.append("[时间倒退] "+e[:19])\n        prev=ts\n        if any(k in e.lower() for k in["cleared","wiped","deleted"]):\n            a.append("[日志清除] "+e[:50])\n    return a\nfor x in detect(logs):print(x)',
["datetime.strptime解析时间戳","时间倒退=日志被手动修改","cleared/wiped=攻击者尝试清理痕迹"],
"检测到日志清除", "痕迹清理")

P["pen-22"] = mk_ex("ex-p22-1","内网子网扫描","easy",
"扫描/24子网的存活主机。",
'import ipaddress\nnet=ipaddress.IPv4Network("192.168.1.0/24")\nlive={"192.168.1.1":"router","192.168.1.10":"web"}\ndef scan(net,live):\n    # TODO: 遍历子网查存活\n    d={}\n    return d\nscan(net,live)',
'import ipaddress\nnet=ipaddress.IPv4Network("192.168.1.0/24")\nlive={"192.168.1.1":"router","192.168.1.10":"web"}\ndef scan(net,live):\n    d={}\n    for ip in net.hosts():\n        s=str(ip)\n        if s in live:\n            d[s]=live[s];print(f"[UP] {s} ({live[s]})")\n    print(f"存活{len(d)}/254台")\n    return d\nscan(net,live)',
["ipaddress.IPv4Network定义子网","network.hosts()遍历主机","/24有254个可用IP"],
"发现2台存活", "内网扫描")

P["pen-23"] = mk_ex("ex-p23-1","Pass-The-Hash模拟","medium",
"模拟用捕获的NTLM hash做横向认证。",
'import hashlib\nusers={"admin":hashlib.md5(b"P@sswd").hexdigest(),"alice":hashlib.md5(b"Alice1").hexdigest()}\ncap=hashlib.md5(b"P@sswd").hexdigest()\ndef pth(cap,targets):\n    # TODO: hash比对\n    m=[]\n    return m\nm=pth(cap,users);print(f"攻破{len(m)}账户:{m}")',
'import hashlib\nusers={"admin":hashlib.md5(b"P@sswd").hexdigest(),"alice":hashlib.md5(b"Alice1").hexdigest()}\ncap=hashlib.md5(b"P@sswd").hexdigest()\ndef pth(cap,targets):\n    m=[]\n    for u,h in targets.items():\n        if cap==h:m.append(u);print(f"[PTH] {u} 认证成功")\n    return m\nm=pth(cap,users);print(f"攻破{len(m)}账户:{m}")',
["PTH不需要明文密码","Mimikatz获取NTLM hash","防御:禁用NTLM+Credential Guard"],
"攻破admin", "PTH攻击")

P["pen-24"] = mk_ex("ex-p24-1","横向移动路径分析","easy",
"分析可达主机和服务端口,找出横向移动路径。",
'conns=[("WS001","192.168.1.10",445,"open"),("WS001","192.168.1.50",3389,"open")]\nHV={445:"SMB",3389:"RDP",5985:"WinRM",22:"SSH"}\ndef find_paths(cs,src):\n    # TODO: 找到src可触及的高价值端口\n    return[]\np=find_paths(conns,"WS001");[print(f" -> {d}:{port}({svc})") for d,port,svc in p]',
'conns=[("WS001","192.168.1.10",445,"open"),("WS001","192.168.1.50",3389,"open")]\nHV={445:"SMB",3389:"RDP",5985:"WinRM",22:"SSH"}\ndef find_paths(cs,src):\n    return[(d,port,HV.get(port,f"port{port}")) for s,d,port,st in cs if s==src and st=="open"]\np=find_paths(conns,"WS001");print(f"从WS001可达:");[print(f" -> {d}:{port}({svc})") for d,port,svc in p]',
["SMB(445)横向移动最常用","RDP(3389)远程桌面跳板","WinRM(5985)PowerShell Remoting"],
"发现2条路径", "横向移动")

P["pen-25"] = mk_ex("ex-p25-1","CVE Exploit匹配","medium",
"根据目标OS和开放端口匹配已知CVE exploit。",
'cve={"CVE-2017-0144":{"name":"EternalBlue","port":445,"os":"Windows"},"CVE-2019-0708":{"name":"BlueKeep","port":3389,"os":"Windows"}}\ndef match(os,ports,cve):\n    # TODO: 匹配exploit\n    return[]\nm=match("Windows",[80,445,3389],cve);[print(f"{c}:{n} port{p}") for c,n,p in m]',
'cve={"CVE-2017-0144":{"name":"EternalBlue","port":445,"os":"Windows"},"CVE-2019-0708":{"name":"BlueKeep","port":3389,"os":"Windows"}}\ndef match(os,ports,cve):\n    return[(c,i["name"],i["port"]) for c,i in cve.items() if i["os"] in os and i["port"] in ports]\nm=match("Windows",[80,445,3389],cve)\nprint(f"目标:Windows,端口:[80,445,3389],匹配{len(m)}个:");[print(f" {c} ({n}) port {p}") for c,n,p in m]',
["EternalBlue(SMB port 445)","BlueKeep(RDP port 3389)","根据OS+端口匹配最有效"],
"匹配2个exploit", "Exploit匹配")

P["pen-26"] = mk_ex("ex-p26-1","Shellcode编码混淆","hard",
"对shellcode进行XOR加密和Base64编码。",
'import base64\nshellcode=bytes.fromhex("90909090CCCCCCCC")\ndef encode(sc,key=0xAA):\n    # TODO: XOR+Base64\n    return""\ne=encode(shellcode);print(f"编码: {e}")',
'import base64\nshellcode=bytes.fromhex("90909090CCCCCCCC")\ndef encode(sc,key=0xAA):\n    xorred=bytes(b^key for b in sc)\n    return base64.b64encode(xorred).decode()\ne=encode(shellcode);print(f"原始:{len(shellcode)}B,编码:{e}")',
["XOR加密: byte ^ key","base64.b64encode编码","免杀通过混淆绕过签名检测"],
"Base64输出", "免杀技术")

P["pen-27"] = mk_ex("ex-p27-1","WiFi握手包分析","easy",
"分析WPA2四步握手帧,提取SSID和BSSID。",
'frames=[{"frame":1,"type":"ANonce","ssid":"OfficeWiFi"},{"frame":2,"type":"SNonce+MIC","bssid":"AA:BB:CC:DD:EE:FF"}]\ndef analyze(fs):\n    # TODO: 提取SSID/BSSID,确认握手完整\n    return{}\nr=analyze(frames);print(r)',
'frames=[{"frame":1,"type":"ANonce","ssid":"OfficeWiFi"},{"frame":2,"type":"SNonce+MIC","bssid":"AA:BB:CC:DD:EE:FF"}]\ndef analyze(fs):\n    info={}\n    for f in fs:\n        if"ssid"in f:info["SSID"]=f["ssid"]\n        if"bssid"in f:info["BSSID"]=f["bssid"]\n    info["frames"]=len(fs)\n    return info\nr=analyze(frames);print(f\'SSID:{r.get("SSID")} BSSID:{r.get("BSSID")} 帧数:{r["frames"]}\')',
["WPA2四步握手至少需4帧","Airodump-ng捕获握手","hashcat用PBKDF2破解WPA2"],
"提取SSID/BSSID", "WiFi分析")

P["pen-28"] = mk_ex("ex-p28-1","Shellcode验证器","medium",
"验证shellcode属性:长度、null字节、NOP sled。",
'sc=bytes([0x31,0xc0,0x50,0x68,0x2f,0x2f,0x73,0x68,0x68,0x2f,0x62,0x69,0x6e,0x89,0xe3,0x50,0x53,0x89,0xe1,0xb0,0x0b,0xcd,0x80])\ndef verify(sc):\n    # TODO: 检查长度/Null字节\n    return{}\nr=verify(sc);print(r)',
'sc=bytes([0x31,0xc0,0x50,0x68,0x2f,0x2f,0x73,0x68,0x68,0x2f,0x62,0x69,0x6e,0x89,0xe3,0x50,0x53,0x89,0xe1,0xb0,0x0b,0xcd,0x80])\ndef verify(sc):\n    has_null=b"\\x00"in sc\n    return{"len":len(sc),"has_null":has_null,"safe":not has_null}\nr=verify(sc);print(f\'长度:{r["len"]}B 含Null:{r["has_null"]} 可用:{r["safe"]}\')',
["Null字节会截断字符串函数","xor eax,eax避免Null产生","int 0x80是Linux系统调用"],
"23B,无Null,可用", "Shellcode验证")

P["pen-29"] = mk_ex("ex-p29-1","渗透报告生成器","medium",
"根据发现列表生成按严重度排序的渗透测试报告。",
'findings=[{"title":"弱密码","severity":"高","port":22},{"title":"SQL注入","severity":"紧急","port":8080}]\nORD={"紧急":0,"高":1,"中":2,"低":3}\ndef report(fs):\n    # TODO: 排序+统计\n    pass\nreport(findings)',
'findings=[{"title":"弱密码","severity":"高","port":22},{"title":"SQL注入","severity":"紧急","port":8080}]\nORD={"紧急":0,"高":1,"中":2,"低":3}\ndef report(fs):\n    s=sorted(fs,key=lambda f:ORD.get(f["severity"],99))\n    print("="*40)\n    print("  渗透测试报告")\n    print("="*40)\n    for f in s:print(f\'[{f["severity"]}] port {f["port"]} - {f["title"]}\')\n    print("="*40)\nreport(findings)',
["按severity排序:紧急>高>中>低","报告=概要+详情+修复建议","PTES标准要求完整报告"],
"紧急优先排序", "渗透报告")

P["pen-30"] = mk_ex("ex-p30-1","自动化报告模板","easy",
"生成包含执行摘要和修复建议的完整报告模板。",
'data={"client":"Example","date":"2024-06-15","total":12,"critical":2,"high":4,"medium":5,"low":1}\ndef gen(data):\n    # TODO: 格式化输出\n    pass\ngen(data)',
'data={"client":"Example","date":"2024-06-15","total":12,"critical":2,"high":4,"medium":5,"low":1}\ndef gen(data):\n    print("="*50)\n    print("渗透测试报告 - "+data["client"]+" ("+data["date"]+")")\n    print("="*50)\n    t=data["total"];c=data["critical"];h=data["high"];m=data["medium"];l=data["low"]\n    print(f"共{t}个漏洞: 紧急{c} 高{h} 中{m} 低{l}")\n    print("紧急7天内修复,高危30天内修复")\n    print("="*50)\ngen(data)',
["报告给管理层看:简洁+统计","给技术人员看:详细+修复步骤","按严重度给出修复时间建议"],
"格式化报告", "报告模板")]

# ============================================================
# 防御计划练习 (30天)
# ============================================================
D = {}
D["def-1"] = mk_ex("ex-d1-1","SOC告警分诊","easy",
"对安全告警按严重度排序,统计并找出最多攻击源。",
'from collections import Counter\nalerts=[{"id":1,"type":"暴力破解","severity":"高","src":"10.0.0.5"},{"id":2,"type":"恶意软件","severity":"紧急","src":"192.168.1.50"},{"id":3,"type":"扫描","severity":"低","src":"10.0.0.5"}]\nSV={"紧急":0,"高":1,"中":2,"低":3}\ndef triage(alerts):\n    # TODO: 排序+统计\n    pass\ntriage(alerts)',
'from collections import Counter\nalerts=[{"id":1,"type":"暴力破解","severity":"高","src":"10.0.0.5"},{"id":2,"type":"恶意软件","severity":"紧急","src":"192.168.1.50"},{"id":3,"type":"扫描","severity":"低","src":"10.0.0.5"}]\nSV={"紧急":0,"高":1,"中":2,"低":3}\ndef triage(alerts):\n    s=sorted(alerts,key=lambda a:SV.get(a["severity"],99))\n    c=Counter(a["severity"]for a in s)\n    top=Counter(a["src"]for a in s).most_common(1)[0]\n    print(f"统计: {dict(c)} 最多攻击源: {top}")\n    for a in s:print(f\' [{a["severity"]}] {a["type"]} from {a["src"]}\')\ntriage(alerts)',
["sorted自定义severity排序","Counter统计高频项","紧急告警必须立即响应"],
"紧急排在第一位", "SOC分诊")

D["def-2"] = mk_ex("ex-d2-1","暴力破解检测","medium",
"从Windows安全日志中检测登录失败事件(EventID 4625)。",
'import re,collections\nlogs=["EventID=4625 Account=admin Source=10.0.0.5","EventID=4625 Account=admin Source=10.0.0.5","EventID=4625 Account=admin Source=10.0.0.5","EventID=4624 Account=user Source=192.168.1.1"]\nTH=3\ndef detect(logs,th):\n    # TODO: 筛选4625,分组统计\n    return[]\nfor a in detect(logs,TH):print(a)',
'import re,collections\nlogs=["EventID=4625 Account=admin Source=10.0.0.5","EventID=4625 Account=admin Source=10.0.0.5","EventID=4625 Account=admin Source=10.0.0.5","EventID=4624 Account=user Source=192.168.1.1"]\nTH=3\ndef detect(logs,th):\n    m=collections.defaultdict(int)\n    for l in logs:\n        if"4625"in l:\n            a=re.search(r"Account=(\\S+)",l).group(1)\n            s=re.search(r"Source=(\\S+)",l).group(1)\n            m[f"{a}@{s}"]+=1\n    return[f"[暴力破解] {k} 失败{v}次" for k,v in m.items() if v>=th]\nfor a in detect(logs,TH):print(a)',
["EventID 4625=登录失败","按用户@IP分组统计","多次失败=暴力破解,须告警"],
"检测到admin暴力破解", "日志分析")

D["def-3"] = mk_ex("ex-d3-1","ES查询DSL构建","medium",
"构建Elasticsearch查询DSL用于SIEM日志检索。",
'import json\ndef build(kw,sev=None):\n    q={"query":{"bool":{"must":[],"filter":[]}},"size":50}\n    # TODO: 添加关键词搜索和严重度过滤\n    return q\nprint(json.dumps(build("failed login","high"),indent=2,ensure_ascii=False))',
'import json\ndef build(kw,sev=None):\n    q={"query":{"bool":{"must":[],"filter":[]}},"size":50}\n    if kw:q["query"]["bool"]["must"].append({"match":{"message":kw}})\n    if sev:q["query"]["bool"]["filter"].append({"term":{"severity":sev}})\n    return q\nprint(json.dumps(build("failed login","high"),indent=2,ensure_ascii=False))',
["bool.must=搜索关键词","bool.filter=精确过滤","Elasticsearch是SIEM核心存储"],
"构建完整DSL", "SIEM查询")

D["def-4"] = mk_ex("ex-d4-1","Snort规则匹配器","medium",
"解析Snort规则并匹配数据包内容。",
'import re\nrules=[("msg:\\"SQL\\"; content:\\"union select\\"; sid:1001;","union select")]\npkts=[b"GET /?q=union select * HTTP/1.1"]\ndef match(rules,pkts):\n    # TODO: 解析规则,匹配包\n    return[]\nfor a in match(rules,pkts):print(a)',
'import re\nrules=[("alert tcp any any -> any 80 (msg:\\"SQL\\";content:\\"union select\\";sid:1001;)","union select")]\npkts=[b"GET /?q=hello",b"GET /?q=union select *"]\ndef match(rules,pkts):\n    a=[]\n    for r,c in rules:\n        msg=re.search(r\'msg:\\"(.+?)\\"\',r).group(1)\n        sid=re.search(r"sid:(\\d+)",r).group(1)\n        for i,p in enumerate(pkts):\n            if c.encode() in p:a.append(f"[SID:{sid}] {msg} 匹配包#{i}")\n    return a\nfor x in match(rules,pkts):print(x)',
["re.search提取规则元信息","content字段匹配包内容","sid是规则唯一标识"],
"匹配到SQL注入", "Snort匹配")

D["def-5"] = mk_ex("ex-d5-1","异常登录时间检测","easy",
"用Z-Score检测异常时间点的登录行为。",
'import numpy as np\nhistory=[8,9,8,10,9,11,14,15,16,9,10,8,11,15,14,9,10,8,16,15]\nnew=[(3,2),(10,3),(23,1)]\ndef detect(hist,new):\n    # TODO: Z-Score检测\n    pass\ndetect(history,new)',
'import numpy as np\nhistory=[8,9,8,10,9,11,14,15,16,9,10,8,11,15,14,9,10,8,16,15]\nnew=[(3,2),(10,3),(23,1)]\ndef detect(hist,new):\n    m,s=np.mean(hist),np.std(hist)\n    print(f"正常时段: {m:.1f}+/-{s:.1f}h")\n    for h,c in new:\n        z=(h-m)/s\n        s2="异常" if abs(z)>2 else "正常"\n        print(f"[{s2}] {h}:00 登录{c}次 Z={z:.1f}")\ndetect(history,new)',
["np.mean/std计算基线","|Z|>2=显著偏离","UEBA核心:偏离行为基线=可疑"],
"凌晨3点和23点告警", "异常检测")

D["def-6"] = mk_ex("ex-d6-1","事件自动分级","easy",
"按事件类型和影响系统自动分级并给出SLA。",
'SLA={"紧急":"15min","高":"1h","中":"4h","低":"24h"}\nCORE={"财务系统","核心DB","域控"}\ndef grade(etype,systems):\n    # TODO: 分级逻辑\n    return"低"\ntests=[("勒索软件",["文件服务器"]),("钓鱼",["邮箱"]),("扫描",["外围IP"])]\nfor e,s in tests:print(f"{e}: [{grade(e,s)}]")',
'SLA={"紧急":"15min","高":"1h","中":"4h","低":"24h"}\nCORE={"财务系统","核心DB","域控"}\ndef grade(etype,systems):\n    if etype in["勒索软件","数据泄露"]:return"紧急",SLA["紧急"]\n    if any(s in CORE for s in systems):return"高",SLA["高"]\n    if etype in["钓鱼","异常登录"]:return"中",SLA["中"]\n    return"低",SLA["低"]\ntests=[("勒索软件",["文件服务器"]),("钓鱼",["邮箱"]),("扫描",["外围IP"])]\nfor e,s in tests:\n    lv,sla=grade(e,s);print(f"{e}: [{lv}] SLA:{sla}")',
["紧急:全局业务中断","高:核心系统受损","中:部分功能影响低:轻微"],
"正确三级分级", "事件分级")

D["def-7"] = mk_ex("ex-d7-1","PDCERF流程引擎","easy",
"实现六阶段应急响应流程的状态机。",
'PHASES=["准备","检测","遏制","根除","恢复","总结"]\nACTIONS={"准备":["激活团队","确认预案"],"检测":["确认类型","评估范围"],"遏制":["隔离系统"],"根除":["清除恶意代码"],"恢复":["恢复服务"],"总结":["写报告"]}\ndef run(name):\n    # TODO: 遍历阶段执行\n    tl=[]\n    return tl\nrun("勒索软件")',
'PHASES=["准备","检测","遏制","根除","恢复","总结"]\nACTIONS={"准备":["激活团队","确认预案"],"检测":["确认类型","评估范围"],"遏制":["隔离系统"],"根除":["清除恶意代码"],"恢复":["恢复服务"],"总结":["写报告"]}\ndef run(name):\n    print(f"=== PDCERF: {name} ===")\n    for p in PHASES:\n        print(f"[{p}]")\n        for a in ACTIONS[p]:print(f"  OK {a}")\n    print("事件完成")\nrun("勒索软件")',
["PDCERF=Prepare-Detection-Containment-Eradication-Recovery-Follow-up","遏制阶段防扩散","Follow-up防止复发"],
"六阶段完成", "应急响应")

D["def-8"] = mk_ex("ex-d8-1","iptables规则审计","easy",
"审计iptables防火墙规则的安全性。",
'import re\nrules=["-P INPUT DROP","-A INPUT -i lo -j ACCEPT","-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT","-A INPUT -p tcp --dport 22 -j ACCEPT"]\ndef audit(rs):\n    # TODO: 检查默认策略/回环/状态跟踪/开放端口\n    return{}\nr=audit(rules);print(r)',
'import re\nrules=["-P INPUT DROP","-A INPUT -i lo -j ACCEPT","-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT","-A INPUT -p tcp --dport 22 -j ACCEPT"]\ndef audit(rs):\n    chk={}\n    txt=" ".join(rs)\n    chk["default"]="DROP" if"DROP"in rules[0] else"WARN"\n    chk["loopback"]=bool("-i lo"in txt)\n    chk["state"]=bool("ESTABLISHED"in txt)\n    ports=re.findall(r"--dport (\\d+)",txt)\n    chk["ports"]=ports\n    chk["score"]=sum([chk["default"]=="DROP",chk["loopback"],chk["state"]])\n    return chk\nr=audit(rules);print(f\'策略:{r["default"]} 回环:{r["loopback"]} 状态跟踪:{r["state"]}\')\nprint(f\'端口:{r["ports"]} 评分:{r["score"]}/3\')',
["默认策略应为DROP(白名单)","回环lo必须放行","ESTABLISHED允已建立连接"],
"评分3/3", "防火墙审计")

D["def-9"] = mk_ex("ex-d9-1","WAF规则测试","medium",
"测试WAF规则对SQL注入和XSS的拦截效果。",
'import re\nrules=[(r"(?i)union\\s+select","SQL注入"),(r"(?i)<script","XSS")]\nreqs=["/search?q=hello","/login?u=admin union select *"]\ndef test(rules,reqs):\n    # TODO: 测试每条规则\n    pass\ntest(rules,reqs)',
'import re\nrules=[(r"(?i)union\\s+select","SQL注入"),(r"(?i)<script","XSS")]\nreqs=["/search?q=hello","/login?u=admin union select *"]\ndef test(rules,reqs):\n    b=0\n    for r in reqs:\n        for pat,label in rules:\n            if re.search(pat,r):\n                print(f"[拦截] {label}: {r[:60]}");b+=1;break\n        else:print(f"[通过] {r[:60]}")\n    print(f"拦截率:{b}/{len(reqs)}")\ntest(rules,reqs)',
["(?i)不区分大小写","WAF部署在Web服务器前端","ModSecurity是开源WAF"],
"拦截1/2", "WAF测试")

D["def-10"] = mk_ex("ex-d10-1","WireGuard配置生成","easy",
"自动生成WireGuard VPN客户端和服务端配置。",
'cfg={"server":{"addr":"10.0.0.1/24","port":51820},"client":{"addr":"10.0.0.2/24","dns":"1.1.1.1"},"ep":"vpn.ex.com"}\ndef gen(cfg):\n    # TODO: 生成服务端和客户端配置\n    return"",""\nsc,cc=gen(cfg);print(sc);print(cc)',
'cfg={"server":{"addr":"10.0.0.1/24","port":51820},"client":{"addr":"10.0.0.2/24","dns":"1.1.1.1"},"ep":"vpn.ex.com"}\ndef gen(cfg):\n    sc=f"""[Interface]\nAddress={cfg["server"]["addr"]}\nListenPort={cfg["server"]["port"]}\nPrivateKey=<server_key>\n\n[Peer]\nPublicKey=<client_pub>\nAllowedIPs=10.0.0.2/32\n"""\n    cc=f"""[Interface]\nAddress={cfg["client"]["addr"]}\nPrivateKey=<client_key>\nDNS={cfg["client"]["dns"]}\n\n[Peer]\nPublicKey=<server_pub>\nEndpoint={cfg["ep"]}:{cfg["server"]["port"]}\nAllowedIPs=0.0.0.0/0\n"""\n    return sc,cc\nsc,cc=gen(cfg);print("===服务端===\\n"+sc);print("===客户端===\\n"+cc)',
["WireGuard比OpenVPN更快更简洁","AllowedIPs控制路由","wg-quick up wg0启动"],
"生成双端配置", "VPN配置")

D["def-11"] = mk_ex("ex-d11-1","告警质量评估","medium",
"计算IDS/IPS告警的精确率、召回率和误报率。",
'class AlertQuality:\n    def __init__(self):\n        self.tp=self.fp=self.tn=self.fn=0\n    def add(self,attack,alert):\n        # TODO: 更新混淆矩阵\n        pass\n    def report(self):\n        # TODO: 计算Precision/Recall/FPR\n        pass\naq=AlertQuality()\nfor _ in range(45):aq.add(True,True)\nfor _ in range(5):aq.add(True,False)\nfor _ in range(12):aq.add(False,True)\nfor _ in range(38):aq.add(False,False)\naq.report()',
'class AlertQuality:\n    def __init__(self):self.tp=self.fp=self.tn=self.fn=0\n    def add(self,attack,alert):\n        if attack and alert:self.tp+=1\n        elif not attack and alert:self.fp+=1\n        elif not attack and not alert:self.tn+=1\n        else:self.fn+=1\n    def report(self):\n        p=self.tp/(self.tp+self.fp)if self.tp+self.fp>0 else 0\n        r=self.tp/(self.tp+self.fn)if self.tp+self.fn>0 else 0\n        f=self.fp/(self.fp+self.tn)if self.fp+self.tn>0 else 0\n        print(f"Recall:{r:.1%} Precision:{p:.1%} FPR:{f:.1%}")\n        if f>0.1:print("FPR过高,需调优!")\naq=AlertQuality()\nfor _ in range(45):aq.add(True,True)\nfor _ in range(5):aq.add(True,False)\nfor _ in range(12):aq.add(False,True)\nfor _ in range(38):aq.add(False,False)\naq.report()',
["TP正确告警 FP误报 FN漏报","Precision=TP/(TP+FP)","Recall=TP/(TP+FN)"],
"Recall 90%,FPR 24%", "告警质量")

D["def-12"] = mk_ex("ex-d12-1","SYN Flood检测","medium",
"基于计数器检测SYN Flood攻击源。",
'from collections import defaultdict\npkts=[("10.0.0.99","SYN")]*150+[("192.168.1.1","SYN")]*10\ndef detect(pkts,th=100):\n    # TODO: 统计每个IP的SYN包数\n    return set()\na=detect(pkts,100);print(f"攻击源:{a}")',
'from collections import defaultdict\npkts=[("10.0.0.99","SYN")]*150+[("192.168.1.1","SYN")]*10\ndef detect(pkts,th=100):\n    cnt=defaultdict(int);attackers=set()\n    for ip,t in pkts:\n        if t=="SYN":cnt[ip]+=1\n        if cnt[ip]>=th:attackers.add(ip)\n    return attackers\na=detect(pkts,100);print(f"检测到{len(a)}攻击源: {a}")',
["SYN Flood消耗半连接资源","阈值检测最简单有效","synacookies是内核级防护"],
"检测到10.0.0.99", "DDoS防护")

D["def-13"] = mk_ex("ex-d13-1","DNS隧道检测","medium",
"检测DNS隧道:长域名、高熵值和可疑TLD。",
'queries=["www.google.com","ABC"*15+".evil.xyz","api.github.com"]\nSUSP_TLD=[".tk",".ml",".ga",".xyz"]\ndef detect(queries):\n    # TODO: 长度/熵值/TLD\n    return[]\nfor a in detect(queries):print(a)',
'queries=["www.google.com","ABC"*15+".evil.xyz","api.github.com"]\nSUSP_TLD=[".tk",".ml",".ga",".xyz"]\ndef detect(queries):\n    a=[]\n    for q in queries:\n        if len(q)>50:a.append(f"[DNS隧道] 长域名({len(q)}字符)")\n        sub=q.split(".")[0]\n        if len(set(sub))/max(len(sub),1)>0.5 and len(sub)>10:\n            a.append(f"[DGA] 高熵域名: {q[:50]}")\n        if any(q.endswith(t) for t in SUSP_TLD):a.append(f"[可疑TLD] {q}")\n    return a\nfor x in detect(queries):print(x)',
["正常DNS<253字符","长域名可能编码数据外传","DGA域名有高熵随机特征"],
"检测隧道和DGA", "DNS安全")

D["def-14"] = mk_ex("ex-d14-1","CDN缓存命中率","easy",
"监控CDN缓存命中率,识别需要优化的情况。",
'import random;random.seed(42)\ndef monitor(n=100,ratio=0.90):\n    # TODO: 模拟请求,统计命中率\n    pass\nmonitor(100,0.90)',
'import random;random.seed(42)\ndef monitor(n=100,ratio=0.90):\n    hits=misses=0\n    for i in range(n):\n        if random.random()<ratio:hits+=1\n        else:misses+=1\n    rate=hits/n*100\n    print(f"请求:{n} 命中:{hits} 回源:{misses} 命中率:{rate:.1f}%")\n    if rate<80:print("命中率偏低,需优化!")\nmonitor(100,0.90)',
["缓存命中率=hits/total","回源率越低源站压力越小","静态资源应设更长TTL"],
"命中率≈90%", "CDN监控")

D["def-15"] = mk_ex("ex-d15-1","Linux安全基线","easy",
"检查Linux系统的SSH、密码和防火墙配置。",
'cfg={"ssh_root":False,"ssh_pass":True,"ssh_port":22,"pass_days":99999,"selinux":"disabled","fw":"inactive"}\ndef audit(c):\n    # TODO: 检查各项安全配置\n    f=[]\n    return f\nfor x in audit(cfg):print(x)',
'cfg={"ssh_root":False,"ssh_pass":True,"ssh_port":22,"pass_days":99999,"selinux":"disabled","fw":"inactive"}\ndef audit(c):\n    f=[]\n    if c["ssh_root"]:f.append("[高] SSH允许root登录")\n    if c["ssh_pass"]:f.append("[中] 建议用密钥认证")\n    if c["pass_days"]>90:f.append(f\'[中] 密码有效期{c["pass_days"]}天过长\')\n    if c["selinux"]=="disabled":f.append("[高] SELinux已禁用")\n    if c["fw"]=="inactive":f.append("[高] 防火墙未激活")\n    return f\nfor x in audit(cfg):print(x)',
["禁用root直登SSH","密钥认证替代密码","SELinux提供MAC强制控制"],
"发现4个问题", "Linux加固")

D["def-16"] = mk_ex("ex-d16-1","AD组策略审计","medium",
"审计Windows AD GPO中的安全问题。",
'gpo={"pass_complex":False,"pass_hist":0,"lockout":0,"audit_logon":"Disabled","lm_hash":True}\ndef audit(g):\n    # TODO: 检查密码/锁定/审计/LM Hash\n    f=[]\n    return f\nfor x in audit(gpo):print(x)',
'gpo={"pass_complex":False,"pass_hist":0,"lockout":0,"audit_logon":"Disabled","lm_hash":True}\ndef audit(g):\n    f=[]\n    if not g["pass_complex"]:f.append("[高] 密码复杂度未启用")\n    if g["lockout"]==0:f.append("[高] 账户锁定未配置")\n    if g["audit_logon"]=="Disabled":f.append("[中] 登录审计未启用")\n    if g["lm_hash"]:f.append("[高] LM Hash仍存储(极易破解)")\n    return f\nfor x in audit(gpo):print(x)',
["LM Hash极易彩虹表破解","账户锁定防暴力破解","审计日志是事件追溯基础"],
"发现4个安全问题", "AD审计")

D["def-17"] = mk_ex("ex-d17-1","SQL安全审计SQL","easy",
"生成数据库安全审计查询(无密码/超级权限/危险插件)。",
'def gen_audit():\n    # TODO: 生成审计SQL\n    return[]\nfor s in gen_audit():print(s)',
'def gen_audit():\n    return["-- 无密码用户","SELECT user,host FROM mysql.user WHERE authentication_string=\\\'\\\';","","-- 超级权限+远程","SELECT user,host FROM mysql.user WHERE Grant_priv=\\\'Y\\\' AND host!=\\\'localhost\\\';","","-- 旧密码插件","SELECT user,host,plugin FROM mysql.user WHERE plugin=\\\'mysql_native_password\\\';"]\nfor s in gen_audit():print(s)',
["空authentication_string=无密码","mysql_native_password已过时","推荐caching_sha2_password"],
"4组审计SQL", "DB审计")

D["def-18"] = mk_ex("ex-d18-1","Docker安全扫描","medium",
"扫描Docker容器的特权模式/敏感挂载/端口暴露。",
'cs=[{"name":"web","priv":False,"mounts":["/var/www"]},{"name":"db","priv":True,"mounts":["/var/run/docker.sock"]}]\ndef audit(ct):\n    # TODO: 检查特权/docker.sock挂载\n    f=[]\n    return f\nfor c in cs:\n    f=audit(c);print(f\'{c["name"]}:{"安全" if not f else str(len(f))+"个问题"}\')',
'cs=[{"name":"web","priv":False,"mounts":["/var/www"]},{"name":"db","priv":True,"mounts":["/var/run/docker.sock"]}]\ndef audit(ct):\n    f=[]\n    if ct["priv"]:f.append("[严重] 特权模式")\n    if any("docker.sock"in m for m in ct["mounts"]):f.append("[严重] 挂载docker.sock=逃逸")\n    return f\nfor c in cs:\n    f=audit(c);s="安全"if not f else f"{len(f)}个问题";print(f\'{c["name"]}: {s}\')\n    for x in f:print(f"  {x}")',
["特权模式可访问所有宿主设备","挂载docker.sock等于拥有root","用非root用户运行容器"],
"db容器2个严重问题", "Docker安全")

D["def-19"] = mk_ex("ex-d19-1","IAM策略审计","medium",
"审计云IAM策略中的过度权限和危险权限。",
'policies=[{"user":"alice","perms":["ec2:Describe*"]},{"user":"bob","perms":["*:*"]}]\nDANGER=["*:*","iam:CreateUser","iam:*"]\ndef audit(ps):\n    # TODO: 检测通配权限和危险操作\n    f=[]\n    return f\nfor x in audit(policies):print(x)',
'policies=[{"user":"alice","perms":["ec2:Describe*"]},{"user":"bob","perms":["*:*"]}]\nDANGER=["*:*","iam:CreateUser","iam:*"]\ndef audit(ps):\n    f=[]\n    for p in ps:\n        for perm in p["perms"]:\n            if perm=="*:*":f.append(f\'[严重] {p["user"]} 拥有全部权限!\')\n            if perm.startswith("iam:"):f.append(f\'[高危] {p["user"]} {perm}\')\n    return f\nfor x in audit(policies):print(x)',
["*:*=最大权限,极度危险","iam:CreateUser可创建后门","最小权限原则:按需分配"],
"发现bob的*:*权限", "云IAM审计")

D["def-20"] = mk_ex("ex-d20-1","API密钥扫描","easy",
"扫描代码中泄露的API密钥和Token。",
'import re\ncode="""\nAPI_KEY=\\"sk-abc123def456\\";\nTOKEN=\\"ghp_1a2b3c4d5e\\";\n"""\ndef scan(code):\n    # TODO: 检测OpenAI/GitHub/AWS密钥\n    f=[]\n    return f\nfor x in scan(code):print(x)',
'import re\ncode="""\nAPI_KEY=\\"sk-abc123def456\\";\nTOKEN=\\"ghp_1a2b3c4d5e\\";\n"""\ndef scan(code):\n    f=[];patterns={r"sk-[\\w-]{10,}":"OpenAI Key",r"ghp_[\\w]{10,}":"GitHub Token",r"AKIA[\\w]{16}":"AWS Key"}\n    for pat,label in patterns.items():\n        m=re.findall(pat,code)\n        if m:f.append(f"[泄露] {label}: {m[0][:20]}...")\n    return f\nfor x in scan(code):print(x)',
["sk-是OpenAI Key前缀","ghp_是GitHub Token","永远不要硬编码密钥"],
"发现2个密钥泄露", "密钥扫描")

D["def-21"] = mk_ex("ex-d21-1","SDL检查清单","easy",
"评估安全开发生命周期各阶段完成度。",
'phases={"需求":["安全需求","威胁建模"],"设计":["安全架构评审"],"实现":["SAST","依赖检查"]}\ndone=["安全需求","威胁建模","安全架构评审"]\ndef evaluate(phases,done):\n    # TODO: 计算各阶段完成率\n    pass\nevaluate(phases,done)',
'phases={"需求":["安全需求","威胁建模"],"设计":["安全架构评审"],"实现":["SAST","依赖检查"]}\ndone=["安全需求","威胁建模","安全架构评审"]\ndef evaluate(ph,done):\n    total=sum(len(v)for v in ph.values());d=0\n    print("=== SDL清单 ===")\n    for p,items in ph.items():\n        pd=sum(1 for i in items if i in done);d+=pd\n        bar="#"*pd+"-"*(len(items)-pd)\n        print(f"[{p}] {bar} {pd}/{len(items)}")\n    print(f"\\n总完成度: {d}/{total} ({d/total:.0%})")\nevaluate(phases,done)',
["SDL各阶段:需求/设计/实现/测试/部署","SAST=静态分析 DAST=动态测试","威胁建模在设计阶段关键"],
"完成度60%", "SDL检查")

D["def-22"] = mk_ex("ex-d22-1","等保合规检查","easy",
"检查等级保护2.0各安全域的控制覆盖度。",
'controls={"物理安全":["门禁","监控"],"网络安全":["防火墙","IDS"],"主机安全":["访问控制","审计"]}\ndone=["门禁","监控","防火墙"]\ndef check(ct,done):\n    # TODO: 计算各域覆盖率和总合规率\n    pass\ncheck(controls,done)',
'controls={"物理安全":["门禁","监控"],"网络安全":["防火墙","IDS"],"主机安全":["访问控制","审计"]}\ndone=["门禁","监控","防火墙"]\ndef check(ct,done):\n    total=sum(len(v)for v in ct.values());d=0\n    print("=== 等保2.0合规检查 ===")\n    for domain,items in ct.items():\n        dd=sum(1 for i in items if i in done);d+=dd\n        r=dd/len(items)*100;s="OK"if r>=67 else"!!"if r>=33 else"XX"\n        print(f"{s} {domain}: {r:.0f}%");missing=[i for i in items if i not in done]\n        if missing:print(f"  缺失:{missing}")\n    print(f"总体: {d}/{total} ({d/total:.0%})")\ncheck(controls,done)',
["等保2.0=网络安全等级保护","五个安全域:物理/网络/主机/应用/数据","67%以上为合规"],
"总体合规率50%", "等保检查")

D["def-23"] = mk_ex("ex-d23-1","等级保护差距分析","medium",
"对比当前状态与等保要求,计算各控制项差距和优先级。",
'req={"物理安全":["门禁","监控","温控"],"网络安全":["防火墙","IDS","WAF"],"主机安全":["访问控制","审计","杀毒"]}\ncurrent=["门禁","防火墙","访问控制"]\ndef gap(req,cur):\n    # TODO: 分析缺失控制项,按优先级排序\n    return[]\nfor g in gap(req,current):print(g)',
'req={"物理安全":["门禁","监控","温控"],"网络安全":["防火墙","IDS","WAF"],"主机安全":["访问控制","审计","杀毒"]}\ncurrent=["门禁","防火墙","访问控制"]\ndef gap(req,cur):\n    gaps=[];total=0;done=0\n    for d,items in req.items():\n        t=len(items);total+=t;d2=sum(1 for i in items if i in cur);done+=d2\n        m=[i for i in items if i not in cur]\n        if m:gaps.append((d,m,t-d2,"高"if t-d2>1 else"中"))\n    print(f"合规: {done}/{total} ({done/total:.0%})")\n    for d,m,cnt,p in sorted(gaps,key=lambda x:cnt,reverse=True):\n        print(f"[{p}] {d} 缺{cnt}项: {m}")\ngap(req,current)',
["差距分析=当前vs要求","按缺失项数排序优先级","等保建设需要整改计划"],
"网络安全缺2项等级最高", "等保差距")

D["def-24"] = mk_ex("ex-d24-1","风险评估计算器","easy",
"计算风险值=资产价值×威胁等级×脆弱性等级。",
'assets=[{"name":"核心DB","value":5,"threat":4,"vuln":3},{"name":"官网","value":2,"threat":2,"vuln":2}]\ndef calc_risk(assets):\n    # TODO: 风险=value*threat*vuln\n    return[]\nfor r in calc_risk(assets):print(r)',
'assets=[{"name":"核心DB","value":5,"threat":4,"vuln":3},{"name":"官网","value":2,"threat":2,"vuln":2}]\ndef calc_risk(assets):\n    rs=[]\n    for a in assets:\n        r=a["value"]*a["threat"]*a["vuln"]\n        lv="严重"if r>=40 else "高"if r>=20 else "中"if r>=10 else"低"\n        rs.append(f\'[{lv}] {a["name"]}: {r}分 (V{a["value"]}*T{a["threat"]}*V{a["vuln"]})\')\n    return rs\nfor r in calc_risk(assets):print(r)',
["风险=资产×威胁×脆弱性","优先级按风险值排序","GB/T 20984是风险评估标准"],
"核心DB风险60分", "风险评估")

D["def-25"] = mk_ex("ex-d25-1","RTO/RPO计算器","easy",
"计算灾难恢复的RTO(恢复时间)和RPO(数据丢失量)。",
'systems=[{"name":"核心交易","rto_mins":15,"rpo_mins":5,"cost_per_hour":100000},{"name":"邮件","rto_mins":240,"rpo_mins":60,"cost_per_hour":10000}]\ndef evaluate(ss):\n    # TODO: 按停机成本和RTO排序\n    pass\nevaluate(systems)',
'systems=[{"name":"核心交易","rto_mins":15,"rpo_mins":5,"cost_h":100000},{"name":"邮件","rto_mins":240,"rpo_mins":60,"cost_h":10000}]\ndef evaluate(ss):\n    print("=== BCP/DR 评估 ===\\n"+"="*60)\n    print(f\'{"系统":12s} {"RTO":8s} {"RPO":8s} {"停机成本/h":12s} {"优先级"}\')\n    print("-"*60)\n    srt=sorted(ss,key=lambda s:s["cost_h"],reverse=True)\n    for s in srt:\n        p="紧急"if s["rto_mins"]<=15 else"高"if s["rto_mins"]<=60 else"中"\n        print(f\'{s["name"]:12s} {s["rto_mins"]}min {s["rpo_mins"]:5d}min {s["cost_h"]:>10,}元 {"["+p+"]"}\')\nevaluate(systems)',
["RTO=恢复时间目标","RPO=可接受数据丢失量","停机成本决定恢复优先级"],
"核心交易紧急,邮件中级", "灾备评估")

D["def-26"] = mk_ex("ex-d26-1","安全策略模板生成","easy",
"生成密码策略、访问控制策略等安全制度文档框架。",
'policies=["密码管理","访问控制","应急响应"]\ndef gen_policy(name):\n    # TODO: 生成策略模板\n    pass\nfor p in policies:gen_policy(p)',
'def gen_policy(name):\n    t=f"""\n=== {name}策略 ===\n版本: v1.0  生效日: ____\n责任人: ____  审批人: ____\n\n【目的】\n明确{name}的管理要求和执行标准\n\n【适用范围】\n公司全体员工及信息系统\n\n【违规处罚】\n违反本制度按公司信息安全管理制度处理\n{"="*40}\n"""\n    print(t)\npolicies=["密码管理","访问控制","应急响应"]\nfor p in policies:gen_policy(p)',
["安全策略是安全管理的基础","制度文档需有版本号和责任人","等保要求建立安全管理制度"],
"生成3个策略模板", "安全策略")

D["def-27"] = mk_ex("ex-d27-1","钓鱼邮件模拟器","easy",
"生成钓鱼邮件并分析用户点击行为,计算安全意识得分。",
'import random;random.seed(42)\nusers=["alice","bob","charlie","diana","eve"]\ndef simulate_phishing(users):\n    # TODO: 模拟发送,统计点击率\n    pass\nsimulate_phishing(users)',
'import random;random.seed(42)\nusers=["alice","bob","charlie","diana","eve"]\ndef simulate_phishing(users):\n    clicked=[u for u in users if random.random()<0.3]\n    reported=[u for u in users if random.random()<0.5]\n    print(f"发送{len(users)}封钓鱼测试邮件")\n    print(f"点击: {len(clicked)}人 ({len(clicked)/len(users):.0%})")\n    print(f"报告: {len(reported)}人 ({len(reported)/len(users):.0%})")\n    rate=(len(users)-len(clicked))/len(users)*100\n    print(f"安全得分: {rate:.0f}/100")\nsimulate_phishing(users)',
["钓鱼测试是安全意识培训的量化手段","报告钓鱼邮件也是好行为","定期演练提升防范意识"],
"安全得分70分", "安全意识")

D["def-28"] = mk_ex("ex-d28-1","红蓝对抗评分","medium",
"根据红队攻击路径和蓝队检测结果计算对抗得分。",
'red_tm={"webshell":True,"priv_esc":True,"lateral":False,"exfil":False}\nblue_tm={"detect_webshell":True,"detect_priv_esc":False,"block_lateral":True}\ndef score(rt,bt):\n    # TODO: 计算红蓝队得分\n    return{}\nr=score(red_tm,blue_tm);print(r)',
'red_tm={"webshell":True,"priv_esc":True,"lateral":False,"exfil":False}\nblue_tm={"detect_webshell":True,"detect_priv_esc":False,"block_lateral":True}\ndef score(rt,bt):\n    red=sum(1 for v in rt.values() if v)*20\n    blue=sum(1 for v in bt.values() if v)*25\n    print(f"=== 红蓝对抗评分 ===")\n    print(f"红队(攻击): {red}/100 ({sum(1 for v in rt.values() if v)}/4达成)")\n    print(f"蓝队(检测): {blue}/100 ({sum(1 for v in bt.values() if v)}/3检出)")\n    if blue>=50:print("结论: 蓝队防御有效!")\n    else:print("结论: 蓝队需加强检测能力")\nscore(red_tm,blue_tm)',
["红蓝对抗=攻防演练","红队目标:渗透成功","蓝队目标:发现并阻断攻击"],
"红队40/蓝队50", "红蓝对抗")

D["def-29"] = mk_ex("ex-d29-1","威胁情报IOC提取","easy",
"从安全报告中提取IP/域名/哈希等IOC指标。",
'import re\nreport="""\n攻击源IP: 10.0.0.99, 192.168.1.100\nC2域名: evil.xyz, bad.tk\n文件MD5: d41d8cd98f00b204e9800998ecf8427e\n"""\ndef extract(report):\n    # TODO: 提取IP/域名/哈希\n    return{}\nr=extract(report);print(r)',
'import re\nreport="""\n攻击源IP: 10.0.0.99, 192.168.1.100\nC2域名: evil.xyz, bad.tk\n文件MD5: d41d8cd98f00b204e9800998ecf8427e\n"""\ndef extract(report):\n    ips=re.findall(r"\\d+\\.\\d+\\.\\d+\\.\\d+",report)\n    domains=re.findall(r"[\\w-]+\\.(?:xyz|tk|com|org)",report)\n    hashes=re.findall(r"[a-f0-9]{32}",report,re.I)\n    return{"ips":ips,"domains":domains,"hashes":hashes}\nr=extract(report);print(f"IP({len(r[\"ips\"])}): {r[\"ips\"]}")\nprint(f"域名({len(r[\"domains\"])}): {r[\"domains\"]}")\nprint(f"Hash({len(r[\"hashes\"])}): {r[\"hashes\"]}")',
["IOC=Indicator of Compromise","IP/域名/Hash是常见IOC","MISP是威胁情报共享平台"],
"2IP/2域名/1Hash", "IOC提取")

D["def-30"] = mk_ex("ex-d30-1","SOC成熟度评估","medium",
"评估安全运营中心的人/流程/技术三维成熟度。",
'dims={"人员":{"技能培训":2,"人员配置":3,"值班制度":4},"流程":{"事件响应":3,"变更管理":2,"SOP标准":3},"技术":{"SIEM平台":4,"SOAR编排":2,"UEBA分析":1}}\ndef assess(dims):\n    # TODO: 计算成熟度评分 (1-5分)\n    pass\nassess(dims)',
'dims={"人员":{"技能培训":2,"人员配置":3,"值班制度":4},"流程":{"事件响应":3,"变更管理":2,"SOP标准":3},"技术":{"SIEM平台":4,"SOAR编排":2,"UEBA分析":1}}\ndef assess(dims):\n    print("=== SOC成熟度评估 ===")\n    total=0;cnt=0\n    for cat,items in dims.items():\n        avg=sum(items.values())/len(items)\n        total+=sum(items.values());cnt+=len(items)\n        lv="成熟"if avg>=4 else"发展中"if avg>=3 else"初级"if avg>=2 else"起步"\n        print(f"[{cat}] {avg:.1f}/5 ({lv})")\n        for k,v in items.items():print(f"  {k}: {\"★\"*v}{\"☆\"*(5-v)} {v}/5")\n    avg=total/cnt;print(f"\\n总体: {avg:.1f}/5")\nassess(dims)',
["CMM成熟度模型:1-5级","三维:人员/流程/技术","5级=持续优化,3级=已定义"],
"总体2.6/5(发展中)", "SOC成熟度")

# ============================================================
# 主流程
# ============================================================
def main():
    base = os.path.dirname(os.path.abspath(__file__))
    src = os.path.join(base, 'src', 'data')

    for name, file_part, ex_map, prefix in [
        ("渗透测试计划", "cyberPenetration.ts", P, "pen"),
        ("防御计划", "cyberDefense.ts", D, "def"),
    ]:
        fpath = os.path.join(src, file_part)
        if os.path.exists(fpath):
            print(f"\n{'='*60}\n=== 处理 {name} ({file_part}) ===\n{'='*60}")
            inject_coding_exercises(fpath, ex_map, prefix)
        else:
            print(f"文件不存在: {fpath}")

    print("\n" + "="*60)
    print("全部完成! 请验证:")
    print("  cd cisp && npx tsc --noEmit")
    print("="*60)

if __name__ == '__main__':
    main()
