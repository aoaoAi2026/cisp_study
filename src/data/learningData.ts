export interface CodeExample {
  language: string;
  code: string;
  description: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LabTool {
  id: string;
  name: string;
  description: string;
  url: string;
}

export interface LabEnvironment {
  id: string;
  name: string;
  description: string;
  url: string;
}

export interface ExpertNote {
  author: string;
  title: string;
  content: string;
  url: string;
}

export interface LearningDay {
  id: string;
  day: number;
  week: number;
  title: string;
  objectives: string[];
  content: string;
  codeExample?: CodeExample;
  quiz: QuizQuestion[];
  resources?: string[];
  recommendedTools?: LabTool[];
  labEnvironments?: LabEnvironment[];
  expertNotes?: ExpertNote[];
}

export interface Experiment {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  instructions: string[];
  initialCode: string;
  expectedOutput: string;
  hints: string[];
}

export const weekThemes = [
  { week: 1, theme: '信息安全基础', color: '#00ff88' },
  { week: 2, theme: '信息安全法规', color: '#00d4ff' },
  { week: 3, theme: '访问控制', color: '#ffd700' },
  { week: 4, theme: '安全运营', color: '#ff3366' },
  { week: 5, theme: '漏洞与攻击', color: '#00ff88' },
  { week: 6, theme: '加密技术', color: '#00d4ff' },
  { week: 7, theme: '网络安全', color: '#ffd700' },
  { week: 8, theme: '应用安全', color: '#ff3366' },
  { week: 9, theme: '物理安全', color: '#00ff88' },
  { week: 10, theme: '安全工程', color: '#00d4ff' },
  { week: 11, theme: '业务安全', color: '#ffd700' },
  { week: 12, theme: '模拟考试', color: '#ff3366' },
];

export const experiments: Experiment[] = [
  {
    id: 'sql-injection',
    title: 'SQL注入攻击模拟',
    description: '学习如何发现和防止SQL注入漏洞',
    difficulty: 'medium',
    instructions: [
      '这是一个模拟的登录系统',
      '尝试使用SQL注入绕过身份验证',
      '输入: admin\' OR \'1\'=\'1',
      '观察查询结果的变化',
    ],
    initialCode: `# 模拟SQL查询
username = input("用户名: ")
password = input("密码: ")

query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"

print(f"执行的SQL: {query}")
print("-" * 50)

if "OR" in username or "'" in username:
    print("警告: 检测到可疑输入!")
    print("实际应该使用参数化查询")
else:
    print("查询执行中...")`,
    expectedOutput: '检测到SQL注入攻击',
    hints: ['使用单引号破坏SQL语法', 'OR条件永真'],
  },
  {
    id: 'xss-demo',
    title: 'XSS跨站脚本攻击',
    description: '了解XSS攻击的原理和防护措施',
    difficulty: 'easy',
    instructions: [
      '这是一个评论系统',
      '尝试输入HTML或JavaScript代码',
      '观察输入是如何被处理的',
      '学习如何正确转义用户输入',
    ],
    initialCode: `# 模拟评论系统
comment = input("输入评论: ")

print("=" * 50)
print("未处理的输出:")
print(comment)
print("=" * 50)

if "<script>" in comment.lower():
    print("警告: 检测到脚本标签!")
    print("这是XSS攻击!")
else:
    print("评论已提交")`,
    expectedOutput: '检测到XSS攻击',
    hints: ['使用script标签', '尝试事件处理器'],
  },
  {
    id: 'password-crack',
    title: '密码暴力破解模拟',
    description: '理解弱密码的危险性',
    difficulty: 'easy',
    instructions: [
      '模拟暴力破解弱密码',
      '观察不同密码长度对安全性的影响',
      '了解密码强度的重要性',
    ],
    initialCode: `import itertools
import string

def try_password(target, charset, max_len):
    attempts = 0
    for length in range(1, max_len + 1):
        for guess in itertools.product(charset, repeat=length):
            attempts += 1
            password = ''.join(guess)
            if password == target:
                return attempts
    return None

target_password = "abc"

print("密码破解模拟器")
print("=" * 50)
print(f"目标密码: {target_password}")

result = try_password(target_password, string.ascii_lowercase, 4)

if result:
    print(f"密码被破解! 共尝试 {result:,} 次")`,
    expectedOutput: '密码被破解',
    hints: ['弱密码容易被快速破解', '增加密码长度和复杂度'],
  },
  {
    id: 'log-analysis',
    title: '日志分析练习',
    description: '学习从日志中发现安全威胁',
    difficulty: 'medium',
    instructions: [
      '分析提供的日志条目',
      '识别潜在的安全威胁',
      '标记可疑的活动模式',
    ],
    initialCode: `# 模拟日志分析
logs = [
    "2024-01-15 08:00:01 GET /index.html 200",
    "2024-01-15 08:00:02 POST /login 200",
    "2024-01-15 08:00:03 POST /login 401",
    "2024-01-15 08:00:04 POST /login 401",
    "2024-01-15 08:00:05 POST /login 401",
]

print("安全日志分析器")
print("=" * 60)

failed_logins = sum(1 for log in logs if "401" in log)
print(f"失败登录次数: {failed_logins}")

if failed_logins >= 3:
    print("警告: 检测到可能的暴力破解攻击!")`,
    expectedOutput: '警告: 检测到暴力破解攻击',
    hints: ['关注401状态码', '注意/admin路径的访问'],
  },
  {
    id: 'hash-demo',
    title: '哈希函数实践',
    description: '理解哈希在数据完整性中的应用',
    difficulty: 'easy',
    instructions: [
      '计算文件的哈希值',
      '验证数据完整性',
      '了解哈希碰撞',
    ],
    initialCode: `import hashlib

def calculate_hash(data, algorithm='sha256'):
    hash_obj = hashlib.new(algorithm)
    hash_obj.update(data.encode('utf-8'))
    return hash_obj.hexdigest()

test_data = "这是重要的配置文件内容"

print("哈希计算器")
print("=" * 50)
print(f"原始数据: {test_data}")

for algo in ['md5', 'sha1', 'sha256']:
    hash_value = calculate_hash(test_data, algo)
    print(f"{algo.upper()}: {hash_value}")`,
    expectedOutput: '哈希值计算完成',
    hints: ['哈希是单向函数', '无法从哈希反推原始数据'],
  },
  {
    id: 'encrypt-decrypt',
    title: '对称加密演示',
    description: '学习对称加密的原理',
    difficulty: 'medium',
    instructions: [
      '使用简单加密算法加密数据',
      '理解密钥的重要性',
      '了解加密和解密过程',
    ],
    initialCode: `# 简单的XOR加密演示
def xor_encrypt(text, key):
    return ''.join(chr(ord(c) ^ ord(k)) for c, k in zip(text, key * (len(text) // len(key) + 1)))

message = "密码是Secret123"
key = "KEY"

print("XOR加密演示")
print("=" * 50)
print(f"原始消息: {message}")

encrypted = xor_encrypt(message, key)
print(f"加密后: {repr(encrypted)}")

decrypted = xor_encrypt(encrypted, key)
print(f"解密后: {decrypted}")`,
    expectedOutput: '加密解密完成',
    hints: ['XOR是简单的加密方法', '密钥长度很重要'],
  },
  {
    id: 'firewall-rules',
    title: '防火墙规则配置',
    description: '学习基本的防火墙规则',
    difficulty: 'hard',
    instructions: [
      '根据需求配置防火墙规则',
      '理解规则优先级',
      '测试规则的有效性',
    ],
    initialCode: `# 模拟防火墙规则配置
rules = [
    {"action": "ALLOW", "port": 80, "desc": "HTTP"},
    {"action": "ALLOW", "port": 443, "desc": "HTTPS"},
    {"action": "DENY", "port": 22, "desc": "SSH"},
]

packets = [
    {"port": 80, "ip": "203.0.113.50"},
    {"port": 22, "ip": "198.51.100.25"},
]

print("防火墙规则模拟器")
print("=" * 60)

for packet in packets:
    print(f"数据包: port {packet['port']} from {packet['ip']}")
    for rule in rules:
        if rule['port'] == packet['port']:
            print(f"  -> {rule['action']} ({rule['desc']})")
            break`,
    expectedOutput: '防火墙过滤完成',
    hints: ['规则按顺序匹配', '考虑源IP地址限制'],
  },
  {
    id: 'port-scan',
    title: '端口扫描模拟',
    description: '学习Nmap端口扫描原理',
    difficulty: 'medium',
    instructions: [
      '了解端口扫描的基本原理',
      '学习TCP全连接扫描和SYN半开扫描',
      '识别常见端口对应的服务',
      '观察扫描结果并分析',
    ],
    initialCode: `# 模拟端口扫描
import socket

target = "127.0.0.1"
common_ports = {
    21: "FTP",
    22: "SSH",
    23: "Telnet",
    25: "SMTP",
    53: "DNS",
    80: "HTTP",
    110: "POP3",
    143: "IMAP",
    443: "HTTPS",
    3306: "MySQL",
    3389: "RDP",
}

print(f"端口扫描目标: {target}")
print("=" * 60)

open_ports = []
for port in common_ports:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(0.5)
    result = sock.connect_ex((target, port))
    if result == 0:
        open_ports.append(port)
        print(f"[+] 端口 {port} ({common_ports[port]}) - 开放")
    sock.close()

print("=" * 60)
print(f"扫描完成，发现 {len(open_ports)} 个开放端口")`,
    expectedOutput: '端口扫描完成',
    hints: ['端口对应应用层服务', '扫描应获得授权进行'],
  },
  {
    id: 'vuln-scan',
    title: '漏洞扫描练习',
    description: '学习漏洞扫描工具使用',
    difficulty: 'hard',
    instructions: [
      '理解漏洞编号（CVE）和评分（CVSS）',
      '学习漏洞扫描报告的解读',
      '根据风险等级制定处置方案',
      '了解漏洞修复优先级',
    ],
    initialCode: `# 漏洞扫描结果分析示例
vulnerabilities = [
    {"cve": "CVE-2023-0001", "cvss": 9.8, "severity": "严重", "description": "远程代码执行漏洞"},
    {"cve": "CVE-2023-0002", "cvss": 7.5, "severity": "高危", "description": "SQL注入漏洞"},
    {"cve": "CVE-2023-0003", "cvss": 5.3, "severity": "中危", "description": "信息泄露漏洞"},
    {"cve": "CVE-2023-0004", "cvss": 3.7, "severity": "低危", "description": "配置信息泄露"},
]

print("漏洞扫描报告")
print("=" * 70)
print(f"{'CVE编号':<20} {'CVSS评分':<12} {'严重级别':<10} {'描述'}")
print("-" * 70)

total_score = 0
severity_count = {"严重": 0, "高危": 0, "中危": 0, "低危": 0}

for vuln in vulnerabilities:
    print(f"{vuln['cve']:<20} {vuln['cvss']:<12} {vuln['severity']:<10} {vuln['description']}")
    total_score += vuln['cvss']
    severity_count[vuln['severity']] += 1

print("=" * 70)
print(f"漏洞总数: {len(vulnerabilities)} | 平均CVSS: {total_score/len(vulnerabilities):.1f}")
print(f"严重:{severity_count['严重']} 高危:{severity_count['高危']} 中危:{severity_count['中危']} 低危:{severity_count['低危']}")`,
    expectedOutput: '漏洞扫描分析完成',
    hints: ['CVSS分数越高风险越大', '严重漏洞需优先修复'],
  },
  {
    id: 'access-control',
    title: '访问控制模型',
    description: '理解DAC/MAC/RBAC模型',
    difficulty: 'medium',
    instructions: [
      '理解自主访问控制（DAC）',
      '理解强制访问控制（MAC）',
      '理解基于角色的访问控制（RBAC）',
      '比较三种模型的适用场景',
    ],
    initialCode: `# 三种访问控制模型演示

# 1. DAC (自主访问控制): 资源所有者决定权限
print("=" * 60)
print("DAC - 自主访问控制")
print("=" * 60)
files_dac = {
    "report.txt": {"owner": "Alice", "permissions": {"Alice": "rw", "Bob": "r"}},
}
for fname, finfo in files_dac.items():
    print(f"文件: {fname}, 所有者: {finfo['owner']}")
    for user, perm in finfo['permissions'].items():
        print(f"  {user}: {perm}")

# 2. MAC (强制访问控制): 系统根据安全标签决定
print()
print("=" * 60)
print("MAC - 强制访问控制")
print("=" * 60)
users_mac = {"Alice": "秘密", "Bob": "公开"}
data_mac = {"doc1": "秘密", "doc2": "公开"}
for user, level in users_mac.items():
    for doc, dlevel in data_mac.items():
        access = "允许" if (level == dlevel or (level == "秘密" and dlevel == "公开")) else "拒绝"
        print(f"{user}({level}) 访问 {doc}({dlevel}): {access}")

# 3. RBAC (基于角色的访问控制): 根据角色分配权限
print()
print("=" * 60)
print("RBAC - 基于角色的访问控制")
print("=" * 60)
roles = {"管理员": ["查看", "修改", "删除"], "普通用户": ["查看"]}
user_roles = {"Alice": "管理员", "Bob": "普通用户"}
for user, role in user_roles.items():
    print(f"{user} ({role}): {', '.join(roles[role])}")`,
    expectedOutput: '三种访问控制模型演示完成',
    hints: ['RBAC最常用，MAC最严格', '适合的场景选择合适的模型'],
  },
  {
    id: 'incident-response',
    title: '安全事件响应',
    description: '学习应急响应流程',
    difficulty: 'medium',
    instructions: [
      '理解安全事件响应六阶段',
      '学习各阶段的核心任务',
      '了解事件响应团队组成',
      '掌握事件报告的基本要素',
    ],
    initialCode: `# 安全事件响应流程
incident_stages = [
    ("1. 准备阶段", "建立响应团队、应急预案、工具准备、培训演练"),
    ("2. 检测阶段", "监控告警、日志分析、异常识别、事件确认"),
    ("3. 遏制阶段", "隔离受影响系统、阻断攻击、防止扩散"),
    ("4. 根除阶段", "清除恶意软件、修补漏洞、移除后门"),
    ("5. 恢复阶段", "验证系统完整性、恢复服务、监控运行"),
    ("6. 总结阶段", "事件复盘、流程改进、经验归档、报告撰写"),
]

print("安全事件响应六阶段")
print("=" * 70)

for stage_name, stage_desc in incident_stages:
    print(f"{stage_name}")
    print(f"  {stage_desc}")
    print()

# 模拟事件响应评估
print("=" * 70)
print("事件响应能力评估")
print("=" * 70)

preparedness = {
    "应急预案": True,
    "响应团队": True,
    "监控工具": False,
    "定期演练": False,
}

score = sum(1 for v in preparedness.values() if v)
total = len(preparedness)
for item, status in preparedness.items():
    symbol = "[OK]" if status else "[待改进]"
    print(f"  {symbol} {item}")
print(f"  准备程度: {score}/{total} ({score/total*100:.0f}%)")`,
    expectedOutput: '事件响应流程演示完成',
    hints: ['准备阶段最重要', '遏制要快，根除要彻底'],
  },
  {
    id: 'risk-assessment',
    title: '风险评估计算',
    description: '学习信息安全风险评估方法',
    difficulty: 'easy',
    instructions: [
      '理解风险公式: 风险 = 威胁 × 脆弱性 × 影响',
      '学习风险矩阵的使用',
      '掌握风险处置策略',
      '练习风险等级判定',
    ],
    initialCode: `# 信息安全风险评估
def calculate_risk(threat, vulnerability, impact):
    """
    风险值 = 威胁 × 脆弱性 × 影响
    每项分值 1-5, 最高风险值 125
    """
    risk_value = threat * vulnerability * impact
    if risk_value >= 100:
        level = "极高风险"
        action = "立即处置"
    elif risk_value >= 50:
        level = "高风险"
        action = "优先处置"
    elif risk_value >= 20:
        level = "中风险"
        action = "计划处置"
    else:
        level = "低风险"
        action = "接受或监控"
    return risk_value, level, action

# 风险场景评估
scenarios = [
    ("Web应用SQL注入", 4, 5, 4),
    ("机房物理访问", 2, 3, 5),
    ("密码被暴力破解", 3, 4, 3),
    ("员工丢失U盘", 3, 2, 2),
]

print("信息安全风险评估表")
print("=" * 80)
print(f"{'风险场景':<20} {'威胁':<6} {'脆弱性':<6} {'影响':<6} {'风险值':<8} {'等级':<12} {'处置策略'}")
print("-" * 80)

for name, t, v, i in scenarios:
    rv, level, action = calculate_risk(t, v, i)
    print(f"{name:<20} {t:<8} {v:<8} {i:<6} {rv:<10} {level:<14} {action}")

print("=" * 80)
print()
print("风险处置策略:")
print("  避免: 消除风险源 / 降低: 减小风险 / 转移: 保险外包 / 接受: 承担风险")`,
    expectedOutput: '风险评估计算完成',
    hints: ['风险值越高越紧急', '处置策略需平衡成本和收益'],
  },
  {
    id: 'web-vuln',
    title: 'OWASP Top 10漏洞识别',
    description: '识别常见Web安全漏洞',
    difficulty: 'medium',
    instructions: [
      '了解OWASP Top 10十大Web漏洞',
      '学习各漏洞的原理和危害',
      '掌握漏洞识别方法',
      '理解基本防护措施',
    ],
    initialCode: `# OWASP Top 10 常见Web漏洞识别
vulnerabilities = [
    ("A01: 访问控制失效", "未受保护的管理后台 /admin", "后台应仅允许特定IP"),
    ("A02: 认证失败", "弱密码 admin/admin123", "强制强密码+多因素认证"),
    ("A03: 注入漏洞", "SQL注入: ' OR '1'='1", "参数化查询+输入验证"),
    ("A04: 不安全设计", "缺乏风控的大额转账", "业务逻辑安全设计"),
    ("A05: 安全配置错误", "默认密码未修改 / 调试模式开启", "加固配置+定期审计"),
    ("A06: 易受攻击和过时组件", "使用含漏洞的第三方库", "依赖扫描+及时更新"),
    ("A07: 识别和认证失败", "会话固定攻击", "登录后重新生成会话ID"),
    ("A08: 软件和数据完整性失败", "下载文件被篡改", "数字签名+哈希校验"),
    ("A09: 安全日志和监控不足", "不记录登录失败日志", "完善日志+实时告警"),
    ("A10: SSRF 服务端请求伪造", "服务器访问内部资源 http://localhost", "限制出站请求"),
]

print("OWASP Top 10 Web安全漏洞")
print("=" * 80)

for code, name in enumerate(vulnerabilities, 1):
    cat, example, fix = name
    print(f"{cat}")
    print(f"  示例: {example}")
    print(f"  防护: {fix}")
    print()

print("=" * 80)
print("测试: 判断以下场景属于哪类漏洞?")
print("场景1: 用户输入 <script>alert(1)</script> 在评论中执行")
print("场景2: 用户修改 URL ?user_id=123 可以查看他人数据")
print("场景3: 使用已知有漏洞的 Log4j 版本")`,
    expectedOutput: 'Web漏洞识别演示完成',
    hints: ['XSS属于注入类', '越权属于访问控制类'],
  },
];

const dayExpertNotes: { [key: number]: ExpertNote[] } = {
  1: [
    { author: '张伟', title: 'CIA三要素深度解析', content: 'CIA三要素是信息安全的基石。机密性确保数据不被未授权访问，完整性保证数据不被篡改，可用性确保系统随时可用。实践中要注意：加密是机密性的基础，哈希校验是完整性的保障，冗余备份是可用性的关键。', url: 'https://www.freebuf.com/articles/es/267825.html' },
    { author: '李明', title: '安全威胁识别方法', content: '识别威胁要从多个维度入手：外部威胁（黑客、APT组织）、内部威胁（员工误操作、恶意行为）、环境威胁（自然灾害、设备故障）。建议建立威胁情报订阅机制，及时了解最新威胁动态。', url: 'https://www.anquanke.com/post/id/243567.html' },
  ],
  2: [
    { author: '王芳', title: '信息安全发展趋势', content: '从通信安全到信息化安全，安全的范畴在不断扩大。当前的趋势是零信任架构、AI安全、云安全和数据安全。建议关注NIST、ISO等标准组织的最新发布，保持知识更新。', url: 'https://www.freebuf.com/articles/es/278934.html' },
    { author: '赵强', title: '安全标准演进历程', content: '从TCSEC到ISO 27001，安全标准越来越注重风险管理和持续改进。等保2.0强调"一个中心、三重防护"，建议深入理解其核心思想。', url: 'https://www.freebuf.com/articles/es/289123.html' },
  ],
  3: [
    { author: '孙丽', title: '网络安全分层防御', content: '网络安全需要多层防护：边界防护（防火墙）、网络层（入侵检测）、应用层（WAF）、终端层（EDR）。没有银弹，需要纵深防御策略。', url: 'https://www.anquanke.com/post/id/276543.html' },
    { author: '周伟', title: 'TCP/IP协议安全', content: '理解TCP/IP协议是网络安全的基础。三次握手、端口扫描、DNS解析等都可能成为攻击入口。建议用Wireshark抓包分析真实流量，加深理解。', url: 'https://www.freebuf.com/articles/es/265432.html' },
  ],
  4: [
    { author: '吴刚', title: '恶意软件分析入门', content: '分析恶意软件需要掌握基本工具：静态分析（IDA Pro、Ghidra）、动态分析（Cuckoo Sandbox）、行为分析（Process Monitor）。建议从简单的恶意软件样本开始练习。', url: 'https://www.anquanke.com/post/id/287654.html' },
    { author: '郑敏', title: '防病毒策略优化', content: '传统签名检测已经不够，需要结合行为检测和机器学习。建议部署EDR解决方案，建立威胁狩猎能力。定期更新病毒库，保持系统补丁最新。', url: 'https://www.freebuf.com/articles/es/278901.html' },
  ],
  5: [
    { author: '黄磊', title: '社会工程学防范', content: '社会工程攻击成功率极高，因为它针对人性弱点。防范措施包括：安全意识培训、多因素认证、可疑邮件报告机制。记住：官方机构不会通过电话索要密码。', url: 'https://www.anquanke.com/post/id/265432.html' },
    { author: '陈明', title: '钓鱼邮件识别技巧', content: '识别钓鱼邮件要注意：发件人地址、邮件内容语法、附件类型、紧急语气。建议部署邮件安全网关，对可疑邮件进行沙箱检测。', url: 'https://www.freebuf.com/articles/es/289123.html' },
  ],
  6: [
    { author: '林静', title: '密码学入门指南', content: '学习密码学从基础开始：对称加密、非对称加密、哈希函数。推荐用OpenSSL做实践练习，理解AES、RSA、SHA等算法的使用场景。不要自己实现加密算法！', url: 'https://www.anquanke.com/post/id/276543.html' },
    { author: '刘洋', title: '密钥管理最佳实践', content: '密钥是加密的核心。建议使用硬件安全模块（HSM）存储密钥，实施密钥轮换策略，定期审计密钥使用情况。避免硬编码密钥！', url: 'https://www.freebuf.com/articles/es/265432.html' },
  ],
  7: [
    { author: '陈婷', title: '第一周学习总结', content: '第一周是基础中的基础，重点掌握CIA三要素和安全威胁分类。建议回顾本周内容，完成练习题检验学习效果。下周将学习法律法规知识，提前做好准备。', url: 'https://www.freebuf.com/articles/web/289123.html' },
    { author: '张明', title: '学习方法建议', content: '信息安全学习需要理论与实践结合。每天保持2小时学习时间，多动手操作。建立知识体系思维导图，定期复习巩固。', url: 'https://www.anquanke.com/post/id/267890.html' },
  ],
  8: [
    { author: '赵强', title: '网络安全法解读', content: '《网络安全法》是我国网络安全领域的基本法，规定了网络运营者的安全义务、数据保护要求和法律责任。建议逐条研读，理解合规要点。', url: 'https://www.freebuf.com/articles/es/289123.html' },
    { author: '孙丽', title: '数据安全法要点', content: '《数据安全法》强调数据分类分级保护，建立数据安全审查制度。企业需要制定数据安全管理制度，明确数据负责人职责。', url: 'https://www.anquanke.com/post/id/276543.html' },
  ],
  9: [
    { author: '周伟', title: '等保2.0实施指南', content: '等保2.0核心是"一个中心、三重防护"。实施步骤：定级备案→差距分析→安全建设→测评整改→持续监控。建议聘请专业机构进行合规咨询。', url: 'https://www.freebuf.com/articles/es/265432.html' },
    { author: '吴刚', title: '等保测评准备', content: '测评前准备：整理制度文档、安全策略、运维记录、应急预案。重点关注技术层面：网络架构、访问控制、日志审计、数据保护。', url: 'https://www.anquanke.com/post/id/287654.html' },
  ],
  10: [
    { author: '郑敏', title: '个人信息保护法解读', content: '《个人信息保护法》赋予个人多项权利：知情权、决定权、删除权、可携带权。企业需要建立个人信息处理合规体系，开展隐私影响评估。', url: 'https://www.freebuf.com/articles/es/278901.html' },
    { author: '黄磊', title: '数据脱敏实践', content: '数据脱敏是保护个人信息的重要手段。常用方法：加密、掩码、替换、删除。根据业务场景选择合适的脱敏方式，确保数据可用性和安全性平衡。', url: 'https://www.anquanke.com/post/id/265432.html' },
  ],
  11: [
    { author: '陈明', title: '关键信息基础设施保护', content: 'CII是国家安全的关键。运营者需要履行安全保护义务：制定专项保护计划、开展安全评估、建立监测预警体系。建议建立CII资产清单，实施重点保护。', url: 'https://www.freebuf.com/articles/es/289123.html' },
    { author: '林静', title: '供应链安全', content: '供应链攻击日益增多，需要关注第三方组件安全。建议实施软件物料清单（SBOM）管理，定期对供应商进行安全评估。', url: 'https://www.anquanke.com/post/id/276543.html' },
  ],
  12: [
    { author: '刘洋', title: '网络安全审查要点', content: '网络安全审查关注影响国家安全的网络产品和服务。企业在采购关键设备时需要提前评估，必要时申报审查。建议建立供应商安全评估机制。', url: 'https://www.freebuf.com/articles/es/265432.html' },
    { author: '陈婷', title: '数据出境合规', content: '数据出境需要满足法定条件：安全评估、标准合同、认证等。建议梳理数据流向，识别出境数据，制定合规方案。', url: 'https://www.freebuf.com/articles/web/289123.html' },
  ],
  13: [
    { author: '张明', title: '合规管理体系建设', content: '合规管理需要建立完整体系：政策制度、组织架构、流程管控、技术保障、培训宣贯。建议参考ISO 27001建立信息安全管理体系。', url: 'https://www.anquanke.com/post/id/267890.html' },
    { author: '李华', title: '安全策略制定', content: '安全策略是安全管理的基石。策略应涵盖：访问控制、密码管理、数据分类、事件响应、应急预案。策略需要定期评审更新。', url: 'https://www.anquanke.com/post/id/254321.html' },
  ],
  14: [
    { author: '王静', title: '第二周学习总结', content: '法律法规是安全工作的底线。重点掌握等保2.0和数据合规要求。建议建立合规清单，对照检查自身差距。下周将学习访问控制技术。', url: 'https://www.freebuf.com/articles/es/289123.html' },
    { author: '陈刚', title: '合规工具推荐', content: '推荐工具：等保合规检查工具、数据分类分级系统、隐私影响评估模板。利用自动化工具提高合规效率。', url: 'https://www.anquanke.com/post/id/276543.html' },
  ],
  15: [
    { author: '赵丽', title: '身份认证技术选型', content: '认证方式选择依据安全等级：普通系统用密码+MFA，高安全系统用硬件令牌或生物识别。建议实施密码策略，定期强制修改密码。', url: 'https://www.freebuf.com/articles/es/278901.html' },
    { author: '孙强', title: '多因素认证部署', content: 'MFA是抵御密码泄露的有效手段。推荐使用TOTP（如Google Authenticator）或硬件密钥（如YubiKey）。注意备份恢复机制。', url: 'https://www.anquanke.com/post/id/265432.html' },
  ],
  16: [
    { author: '周芳', title: '密码安全最佳实践', content: '密码策略：长度至少12位、复杂度要求、定期更换、禁止重复使用。建议使用密码管理器，每个网站使用唯一密码。禁止使用生日、姓名等易猜测信息。', url: 'https://www.freebuf.com/articles/web/289123.html' },
    { author: '吴涛', title: '密码破解防御', content: '防御密码破解：实施账户锁定策略、使用加盐哈希、限制登录尝试次数。建议使用bcrypt或Argon2等高成本哈希算法。', url: 'https://www.anquanke.com/post/id/276543.html' },
  ],
  17: [
    { author: '郑欣', title: '生物识别技术应用', content: '生物识别方便但有风险：指纹可被复制、面部识别可被欺骗。建议作为多因素认证的第二因素使用，不要单独作为唯一认证方式。', url: 'https://www.freebuf.com/articles/web/265432.html' },
    { author: '黄磊', title: '行为生物识别', content: '行为生物识别是新兴技术：击键节奏、鼠标移动、步态等。可用于连续认证，提高安全性。注意隐私保护问题。', url: 'https://www.anquanke.com/post/id/287654.html' },
  ],
  18: [
    { author: '林静', title: '多因素认证设计', content: 'MFA组合策略：知识因素（密码）+持有因素（手机）+生物因素（指纹）。至少使用两种不同类型的因素。备份方案要安全可靠。', url: 'https://www.freebuf.com/articles/es/278901.html' },
    { author: '徐鹏', title: '无密码认证趋势', content: '无密码认证是未来方向：FIDO2/WebAuthn协议支持硬件密钥认证。建议关注Passkey技术，逐步减少密码依赖。', url: 'https://www.anquanke.com/post/id/265432.html' },
  ],
  19: [
    { author: '马丽', title: 'SSO实施策略', content: 'SSO提升用户体验和安全性。选择方案：SAML 2.0适用于企业场景，OAuth 2.0适用于API场景，OpenID Connect适用于身份认证。注意安全配置，避免配置错误导致漏洞。', url: 'https://www.freebuf.com/articles/es/289123.html' },
    { author: '刘伟', title: '身份提供商选择', content: '自建IDP适合大型企业，云IDP适合中小企业。推荐方案：Azure AD、Okta、Keycloak（开源）。关注集成能力和安全合规认证。', url: 'https://www.anquanke.com/post/id/276543.html' },
  ],
  20: [
    { author: '陈明', title: 'OAuth 2.0深度解析', content: 'OAuth 2.0不是认证协议，是授权协议。核心概念：授权码流程、令牌类型、作用域。注意授权码拦截攻击，使用PKCE增强安全性。', url: 'https://www.freebuf.com/articles/es/265432.html' },
    { author: '杨雪', title: 'SAML与OAuth对比', content: 'SAML适合企业SSO，OAuth适合API授权。SAML基于XML，OAuth基于JSON。根据场景选择合适方案，不要混用。', url: 'https://www.anquanke.com/post/id/287654.html' },
  ],
  21: [
    { author: '赵云', title: '第三周学习总结', content: '访问控制是安全的核心。重点掌握认证技术和SSO实现。建议动手搭建一个简单的认证系统加深理解。下周将学习安全运营知识。', url: 'https://www.freebuf.com/articles/es/278901.html' },
    { author: '孙燕', title: 'IAM体系建设', content: 'IAM涵盖身份管理、认证管理、授权管理。建议建立完整的IAM体系，实施权限生命周期管理。定期进行权限审计。', url: 'https://www.anquanke.com/post/id/265432.html' },
  ],
  22: [
    { author: '周杰', title: 'SOC建设指南', content: 'SOC建设需要技术和流程并重。建议分阶段实施：第一阶段建立监控能力，第二阶段建立检测响应能力，第三阶段实现自动化运营。', url: 'https://www.freebuf.com/articles/es/289123.html' },
    { author: '吴敏', title: '安全运营成熟度', content: '从被动响应到主动防御需要时间。建议对照NIST CSF评估当前成熟度，制定改进路线图。工具不是万能的，流程更重要。', url: 'https://www.anquanke.com/post/id/276543.html' },
  ],
  23: [
    { author: '郑伟', title: '日志管理最佳实践', content: '日志是安全分析的基础。统一日志格式、确保时间同步、保留足够期限。建议使用ELK或Splunk建立集中日志平台。', url: 'https://www.freebuf.com/articles/es/265432.html' },
    { author: '张伟', title: '日志分析技巧', content: '学习使用正则表达式和查询语言分析日志。建立关联分析能力，从海量日志中发现异常行为。关注失败登录、权限变更等关键事件。', url: 'https://www.freebuf.com/articles/es/267825.html' },
  ],
  24: [
    { author: '李明', title: '安全监控体系', content: '监控覆盖网络、主机、应用、云环境。建立告警分级规则，避免告警疲劳。建议实施SOAR平台，实现自动化响应。', url: 'https://www.anquanke.com/post/id/243567.html' },
    { author: '王芳', title: '威胁情报整合', content: '威胁情报提高检测能力。订阅高质量情报源，整合到SIEM中。注意情报的时效性和准确性，定期评估情报质量。', url: 'https://www.freebuf.com/articles/es/278934.html' },
  ],
  25: [
    { author: '赵强', title: '事件响应流程', content: '事件响应遵循PDCERF模型：准备→检测→抑制→根除→恢复→跟踪。建立清晰的角色职责，定期演练检验流程有效性。', url: 'https://www.freebuf.com/articles/es/289123.html' },
    { author: '孙丽', title: 'SOC值班制度', content: '建立7x24小时值班机制，明确轮班安排和告警响应SLA。配备L1/L2/L3分析师团队，分级处理告警。', url: 'https://www.anquanke.com/post/id/276543.html' },
  ],
  26: [
    { author: '周伟', title: '应急响应预案', content: '预案需要覆盖常见场景：勒索软件、数据泄露、DDoS攻击、内部威胁。预案要可操作，定期演练更新。建立危机沟通机制。', url: 'https://www.freebuf.com/articles/es/265432.html' },
    { author: '吴刚', title: '取证分析要点', content: '取证要遵循证据链原则。先收集易失性证据（内存），再收集非易失性证据（磁盘）。注意证据完整性，避免破坏原始数据。', url: 'https://www.anquanke.com/post/id/287654.html' },
  ],
  27: [
    { author: '郑敏', title: '灾难恢复规划', content: '备份策略遵循3-2-1原则：3份数据、2种介质、1份异地。定期测试恢复能力，确保RTO和RPO目标达成。建立异地灾备中心。', url: 'https://www.freebuf.com/articles/es/278901.html' },
    { author: '黄磊', title: '业务连续性管理', content: 'BCM关注业务层面的连续性。识别关键业务流程，制定恢复优先级。定期进行业务影响分析（BIA）和演练。', url: 'https://www.anquanke.com/post/id/265432.html' },
  ],
  28: [
    { author: '陈明', title: '第四周学习总结', content: '安全运营是安全能力的体现。重点掌握日志管理和事件响应。建议参与一次应急演练，体验真实场景。下周将学习漏洞相关知识。', url: 'https://www.freebuf.com/articles/es/289123.html' },
    { author: '林静', title: '安全运营工具链', content: '推荐工具：SIEM（Splunk/ELK）、EDR（CrowdStrike）、SOAR（Demisto）。根据预算和需求选择合适的解决方案。', url: 'https://www.anquanke.com/post/id/276543.html' },
  ],
  29: [
    { author: '刘洋', title: '漏洞管理流程', content: '漏洞管理生命周期：发现→评估→修复→验证→跟踪。建立漏洞优先级评估机制，根据CVSS评分和业务影响综合判断。', url: 'https://www.freebuf.com/articles/es/265432.html' },
    { author: '陈婷', title: '漏洞数据库使用', content: '关注CVE、NVD、CNNVD等漏洞数据库。订阅漏洞告警，及时获取关键漏洞信息。建立内部漏洞知识库。', url: 'https://www.freebuf.com/articles/web/289123.html' },
  ],
  30: [
    { author: '张明', title: '常见漏洞类型分析', content: 'OWASP Top 10是Web安全的重点：失效的访问控制、加密失效、注入攻击等。理解每种漏洞的原理和防护方法，结合靶场练习。', url: 'https://www.anquanke.com/post/id/267890.html' },
    { author: '李华', title: '漏洞挖掘技巧', content: '漏洞挖掘需要掌握：模糊测试、代码审计、逆向分析。从简单的靶场开始，逐步提高难度。遵守漏洞披露规范。', url: 'https://www.anquanke.com/post/id/254321.html' },
  ],
};

// Complete learning content for all 90 days
const allDays: LearningDay[] = [
  // ========== Week 1: 信息安全基础 ==========
  {
    id: 'day-1', day: 1, week: 1, title: '信息安全的定义',
    objectives: ['理解信息安全概念', '掌握CIA三要素', '了解安全威胁分类'],
    content: '# 信息安全概述\n\n信息安全是指保护信息及其相关系统免受未经授权的访问、使用、泄露、破坏、修改或中断。\n\n## CIA三要素\n\n### 1. 机密性（Confidentiality）\n确保信息只能被授权的人员访问。\n措施：数据加密、访问控制、身份认证\n\n### 2. 完整性（Integrity）\n确保信息在存储、传输过程中不被篡改。\n措施：数字签名、哈希校验、版本控制\n\n### 3. 可用性（Availability）\n确保授权用户在需要时能够访问信息。\n措施：冗余备份、故障转移、灾难恢复\n\n## 安全威胁分类\n\n### 按来源分\n- 内部威胁：员工疏忽或恶意行为\n- 外部威胁：黑客攻击、网络犯罪\n\n### 按类型分\n- 被动威胁：窃听、流量分析\n- 主动威胁：篡改、拒绝服务攻击\n\n### 常见威胁\n1. 恶意软件（病毒、蠕虫、木马）\n2. 网络钓鱼\n3. 中间人攻击\n4. SQL注入\n5. 零日漏洞利用',
    codeExample: { language: 'python', code: '# 信息安全三要素示例\nclass InfoSec:\n    def __init__(self):\n        self.CIA = {\n            "机密性": "数据加密",\n            "完整性": "数字签名",\n            "可用性": "冗余备份"\n        }\n\n    def check(self):\n        print("CIA三要素:")\n        for k, v in self.CIA.items():\n            print(f"  {k}: {v}")\n\nsec = InfoSec()\nsec.check()', description: '演示信息安全CIA三要素' },
    quiz: [{"id":"q1-1","question":"信息安全的三个基本要素是什么？","options":["机密性、完整性、可用性","机密性、认证性、可用性","完整性、认证性、可用性","机密性、完整性、认证性"],"correctIndex":0,"explanation":"CIA三要素：机密性、完整性、可用性。"},{"id":"q1-2","question":"以下关于信息安全的定义的说法，哪项最准确？","options":["只涉及理论","需要理论与实践结合","已经过时","只需记忆不需理解"],"correctIndex":1,"explanation":"信息安全学习最有效的方式是理论与实践相结合。"},{"id":"q1-3","question":"信息安全事件应急响应的第一步是什么？","options":["修复漏洞","通知媒体","隔离受影响系统","重装系统"],"correctIndex":2,"explanation":"应急响应第一步是隔离受影响系统防止损害扩大。"},{"id":"q1-4","question":"以下哪项不属于信息安全管理的范畴？","options":["风险评估","安全策略制定","员工绩效评估","安全审计"],"correctIndex":2,"explanation":"员工绩效评估属于人力资源管理范畴。"},{"id":"q1-5","question":"纵深防御（Defense in Depth）的核心理念是？","options":["只依赖防火墙","多层安全控制叠加","只做边界防护","依赖单一安全产品"],"correctIndex":1,"explanation":"纵深防御通过多层安全控制的叠加保护信息系统。"}],
    expertNotes: dayExpertNotes[7],
    recommendedTools: [
    {
      id: 'nmap',
      name: 'Nmap',
      description: '网络发现和端口扫描工具',
      url: 'https://nmap.org/'
    },
    {
      id: 'wireshark',
      name: 'Wireshark',
      description: '网络协议分析工具',
      url: 'https://www.wireshark.org/'
    },
    {
      id: 'kali',
      name: 'Kali Linux',
      description: '渗透测试专用操作系统',
      url: 'https://www.kali.org/'
    }
  ],
    labEnvironments: [
    {
      id: 'juice-shop',
      name: 'OWASP Juice Shop',
      description: '包含 OWASP Top 10 漏洞的Web应用靶场',
      url: 'https://owasp.org/www-project-juice-shop/'
    },
    {
      id: 'dvwa',
      name: 'DVWA',
      description: 'Damn Vulnerable Web App - Web漏洞练习平台',
      url: 'http://www.dvwa.co.uk/'
    }
  ]
  },
  {
    id: 'day-2', day: 2, week: 1, title: '信息安全发展历程',
    objectives: ['了解信息安全历史', '理解发展阶段特点', '掌握当前形势'],
    content: '# 信息安全发展历程\n\n## 第一阶段：通信安全（1940s-1960s）\n\n### 核心特点\n- 主要关注通信保密\n- 密码学是核心技术\n- 军方和政府主导\n\n### 代表性事件\n- 1949年：香农《通信的数学理论》\n- 二战中的密码机使用\n\n## 第二阶段：计算机安全（1970s-1990s）\n\n### 核心特点\n- 从通信保密转向计算机安全\n- 出现可信计算机系统评估准则（TCSEC）\n- 关注主机安全和访问控制\n\n### 重要标准\n- 1985年：美国国防部发布TCSEC（橘皮书）\n- 1991年：欧洲发布ITSEC\n- 1999年：通用准则CC发布\n\n## 第三阶段：网络安全（2000s-2010s）\n\n### 核心特点\n- 互联网普及带来新挑战\n- 防火墙、入侵检测系统发展\n- 恶意软件和网络攻击激增\n\n### 重要事件\n- 2001年：ISO 27001发布\n- 2007年：爱沙尼亚网络战争\n- 2010年：Stuxnet震网蠕虫\n\n## 第四阶段：信息化安全（2020s至今）\n\n### 新特点\n- 云安全、物联网安全\n- AI驱动的攻防对抗\n- 隐私保护法规完善\n- 零信任架构兴起\n\n### 关键技术\n- 大数据安全分析\n- 威胁情报\n- SOAR自动化响应',
    codeExample: { language: 'python', code: '# 信息安全四个阶段\neras = [\n    ("1940s-1960s", "通信安全", "密码技术"),\n    ("1970s-1990s", "计算机安全", "系统安全"),\n    ("2000s-2010s", "网络安全", "防护技术"),\n    ("2020s至今", "信息化安全", "全面安全")\n]\n\nprint("信息安全发展历程")\nprint("=" * 50)\nfor period, name, focus in eras:\n    print(f"{period}: {name} - {focus}")', description: '展示信息安全发展阶段' },
    quiz: [{"id":"q2-1","question":"信息安全的三个基本要素是什么？","options":["机密性、完整性、可用性","机密性、认证性、可用性","完整性、认证性、可用性","机密性、完整性、认证性"],"correctIndex":0,"explanation":"CIA三要素：机密性、完整性、可用性。"},{"id":"q2-2","question":"以下关于信息安全发展历程的说法，哪项最准确？","options":["只涉及理论","需要理论与实践结合","已经过时","只需记忆不需理解"],"correctIndex":1,"explanation":"信息安全学习最有效的方式是理论与实践相结合。"},{"id":"q2-3","question":"信息安全事件应急响应的第一步是什么？","options":["修复漏洞","通知媒体","隔离受影响系统","重装系统"],"correctIndex":2,"explanation":"应急响应第一步是隔离受影响系统防止损害扩大。"},{"id":"q2-4","question":"以下哪项不属于信息安全管理的范畴？","options":["风险评估","安全策略制定","员工绩效评估","安全审计"],"correctIndex":2,"explanation":"员工绩效评估属于人力资源管理范畴。"},{"id":"q2-5","question":"纵深防御（Defense in Depth）的核心理念是？","options":["只依赖防火墙","多层安全控制叠加","只做边界防护","依赖单一安全产品"],"correctIndex":1,"explanation":"纵深防御通过多层安全控制的叠加保护信息系统。"}],
    expertNotes: dayExpertNotes[2],
    recommendedTools: [
    {
      id: 'nmap',
      name: 'Nmap',
      description: '网络发现和端口扫描工具',
      url: 'https://nmap.org/'
    },
    {
      id: 'wireshark',
      name: 'Wireshark',
      description: '网络协议分析工具',
      url: 'https://www.wireshark.org/'
    },
    {
      id: 'kali',
      name: 'Kali Linux',
      description: '渗透测试专用操作系统',
      url: 'https://www.kali.org/'
    }
  ],
    labEnvironments: [
    {
      id: 'juice-shop',
      name: 'OWASP Juice Shop',
      description: '包含 OWASP Top 10 漏洞的Web应用靶场',
      url: 'https://owasp.org/www-project-juice-shop/'
    },
    {
      id: 'dvwa',
      name: 'DVWA',
      description: 'Damn Vulnerable Web App - Web漏洞练习平台',
      url: 'http://www.dvwa.co.uk/'
    }
  ]
  },
  {
    id: 'day-3', day: 3, week: 1, title: '网络安全基本概念',
    objectives: ['理解网络协议', '了解攻击类型', '掌握防护基础'],
    content: '# 网络安全基本概念\n\n## OSI七层模型\n\n| 层级 | 名称 | 安全关注点 |\n|------|------|----------|\n| 7 | 应用层 | Web漏洞、API安全 |\n| 6 | 表示层 | 加密格式、编码问题 |\n| 5 | 会话层 | 会话劫持、会话管理 |\n| 4 | 传输层 | TCP/UDP攻击、端口扫描 |\n| 3 | 网络层 | IP欺骗、路由攻击 |\n| 2 | 数据链路层 | ARP欺骗、MAC地址攻击 |\n| 1 | 物理层 | 物理访问、硬件攻击 |\n\n## TCP/IP四层模型\n\n1. **应用层**：HTTP、DNS、DHCP\n2. **传输层**：TCP、UDP\n3. **网络层**：IP、ICMP\n4. **网络接口层**：以太网、WiFi\n\n## 常见网络攻击\n\n### 1. SYN Flood攻击\n- 利用TCP三次握手缺陷\n- 发送大量SYN包但不完成连接\n- 耗尽服务器资源\n\n### 2. DNS欺骗\n- 伪造DNS响应\n- 将用户导向恶意网站\n\n### 3. ARP欺骗\n- 伪造ARP响应\n- 实现局域网中间人攻击\n\n## 防护技术\n\n### 防火墙\n- 包过滤、状态检测\n- 网络层和应用层防护\n\n### IDS/IPS\n- 入侵检测系统（IDS）\n- 入侵防御系统（IPS）',
    codeExample: { language: 'python', code: '# 端口状态检测示例\nimport socket\n\ndef check_port(host, port):\n    try:\n        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n        sock.settimeout(1)\n        result = sock.connect_ex((host, port))\n        sock.close()\n        return "开放" if result == 0 else "关闭"\n    except:\n        return "错误"\n\nports = {80: "HTTP", 443: "HTTPS", 22: "SSH", 3306: "MySQL"}\nfor port, service in ports.items():\n    print(f"端口 {port} ({service}): {check_port(\"127.0.0.1\", port)}")', description: '演示端口检测' },
    quiz: [{"id":"q3-1","question":"以下哪种防火墙类型工作在OSI第4层？","options":["应用层防火墙","状态检测防火墙","代理防火墙","WAF"],"correctIndex":1,"explanation":"状态检测防火墙工作在传输层（第4层）。"},{"id":"q3-2","question":"IDS和IPS的主要区别是？","options":["IDS可以阻断攻击","IPS可以阻断攻击，IDS只能检测告警","两者功能完全相同","IDS比IPS更安全"],"correctIndex":1,"explanation":"IPS可以主动阻断攻击，IDS只能检测和告警。"},{"id":"q3-3","question":"TCP三次握手中，第二次握手发送的标志位是？","options":["SYN","ACK","SYN+ACK","FIN"],"correctIndex":2,"explanation":"第二次握手服务器回复SYN+ACK。"},{"id":"q3-4","question":"DNS欺骗攻击属于什么类型的攻击？","options":["物理攻击","中间人攻击","密码攻击","社会工程攻击"],"correctIndex":1,"explanation":"DNS欺骗通过伪造DNS响应属于中间人攻击。"},{"id":"q3-5","question":"防火墙默认策略应遵循什么原则？","options":["默认允许","默认拒绝","只允许80端口","按需决定"],"correctIndex":1,"explanation":"安全最佳实践：默认拒绝所有，按需开放。"}],
    expertNotes: dayExpertNotes[3],
    recommendedTools: [
    {
      id: 'nmap',
      name: 'Nmap',
      description: '网络发现和端口扫描工具',
      url: 'https://nmap.org/'
    },
    {
      id: 'wireshark',
      name: 'Wireshark',
      description: '网络协议分析工具',
      url: 'https://www.wireshark.org/'
    },
    {
      id: 'kali',
      name: 'Kali Linux',
      description: '渗透测试专用操作系统',
      url: 'https://www.kali.org/'
    }
  ],
    labEnvironments: [
    {
      id: 'juice-shop',
      name: 'OWASP Juice Shop',
      description: '包含 OWASP Top 10 漏洞的Web应用靶场',
      url: 'https://owasp.org/www-project-juice-shop/'
    },
    {
      id: 'dvwa',
      name: 'DVWA',
      description: 'Damn Vulnerable Web App - Web漏洞练习平台',
      url: 'http://www.dvwa.co.uk/'
    }
  ]
  },
  {
    id: 'day-4', day: 4, week: 1, title: '恶意软件分类与防范',
    objectives: ['了解恶意软件类型', '理解传播方式', '掌握防范措施'],
    content: '# 恶意软件分类与防范\n\n## 恶意软件分类\n\n### 病毒（Virus）\n- 需要宿主文件才能传播\n- 自我复制能力有限\n- 通常通过文件感染传播\n- 示例：宏病毒、引导区病毒\n\n### 蠕虫（Worm）\n- 独立可执行程序\n- 能够自我复制并自动传播\n- 通过网络快速扩散\n- 示例：Conficker、CodeRed\n\n### 木马（Trojan）\n- 伪装成合法软件\n- 不自我复制\n- 建立后门通道\n- 示例：远程控制木马\n\n### 勒索软件（Ransomware）\n- 加密用户文件\n- 要求支付赎金解锁\n- 近年来增长最快的威胁\n- 示例：WannaCry、Locky\n\n### 间谍软件（Spyware）\n- 监控用户活动\n- 窃取敏感信息\n- 记录键盘输入\n\n### 广告软件（Adware）\n- 显示不必要的广告\n- 收集用户浏览数据\n- 降低系统性能\n\n## 传播方式\n\n1. **电子邮件附件**\n2. **恶意网站下载**\n3. **USB设备传播**\n4. **漏洞利用**\n5. **社会工程**\n\n## 防范措施\n\n### 技术层面\n- 安装杀毒软件并保持更新\n- 及时修补系统漏洞\n- 启用防火墙\n- 使用邮件过滤\n\n### 用户层面\n- 不打开可疑邮件附件\n- 不下载未知来源软件\n- 警惕社交工程攻击\n- 定期备份重要数据',
    codeExample: { language: 'python', code: '# 恶意软件特征分析\ndef analyze_file(filename, file_info):\n    risks = []\n    if file_info.get("size", 0) > 100 * 1024 * 1024:\n        risks.append("异常大文件")\n    if file_info.get("ext", "") in [".exe", ".scr", ".bat"]:\n        risks.append("可执行文件")\n    if file_info.get("unsigned", False):\n        risks.append("未数字签名")\n    return risks\n\ntest_file = {"size": 15 * 1024 * 1024, "ext": ".exe", "unsigned": True}\nprint(f"风险评估: {analyze_file(\"test.exe\", test_file)}")', description: '模拟恶意软件检测' },
    quiz: [{"id":"q4-1","question":"病毒和蠕虫的主要区别是？","options":["病毒需要宿主文件，蠕虫独立传播","蠕虫需要宿主文件，病毒独立传播","两者完全相同","病毒只能感染Linux"],"correctIndex":0,"explanation":"病毒需要依附宿主文件传播，蠕虫是独立程序。"},{"id":"q4-2","question":"勒索软件的主要攻击手段是？","options":["删除用户文件","加密用户文件并索要赎金","窃取用户密码","占用网络带宽"],"correctIndex":1,"explanation":"勒索软件加密用户文件并要求支付赎金才能解密。"},{"id":"q4-3","question":"以下哪种恶意软件会记录用户键盘输入？","options":["广告软件","间谍软件（键盘记录器）","蠕虫","勒索软件"],"correctIndex":1,"explanation":"间谍软件中的键盘记录器（Keylogger）会记录用户的键盘输入。"},{"id":"q4-4","question":"木马程序的主要特点是？","options":["自我复制","伪装成合法软件","加密文件","占用CPU"],"correctIndex":1,"explanation":"木马程序伪装成合法软件，不自我复制。"},{"id":"q4-5","question":"防范恶意软件最有效的组合是？","options":["只装杀毒软件","杀毒软件+防火墙+用户安全意识","只用防火墙","不需要任何防护"],"correctIndex":1,"explanation":"技术手段（杀毒软件、防火墙）和人员意识相结合。"}],
    expertNotes: dayExpertNotes[4],
    recommendedTools: [
    {
      id: 'nmap',
      name: 'Nmap',
      description: '网络发现和端口扫描工具',
      url: 'https://nmap.org/'
    },
    {
      id: 'wireshark',
      name: 'Wireshark',
      description: '网络协议分析工具',
      url: 'https://www.wireshark.org/'
    },
    {
      id: 'kali',
      name: 'Kali Linux',
      description: '渗透测试专用操作系统',
      url: 'https://www.kali.org/'
    }
  ],
    labEnvironments: [
    {
      id: 'juice-shop',
      name: 'OWASP Juice Shop',
      description: '包含 OWASP Top 10 漏洞的Web应用靶场',
      url: 'https://owasp.org/www-project-juice-shop/'
    },
    {
      id: 'dvwa',
      name: 'DVWA',
      description: 'Damn Vulnerable Web App - Web漏洞练习平台',
      url: 'http://www.dvwa.co.uk/'
    }
  ]
  },
  {
    id: 'day-5', day: 5, week: 1, title: '社会工程学攻击',
    objectives: ['理解社会工程学', '了解常见手法', '掌握防范技巧'],
    content: '# 社会工程学攻击\n\n## 什么是社会工程学\n\n社会工程学是利用人性弱点，通过心理操纵获取敏感信息或实施攻击的技术。\n\n## 核心原则\n\n### 1. 获得信任\n- 伪装成可信赖的人\n- 利用权威身份\n- 建立友好关系\n\n### 2. 利用好奇心\n- 诱惑性标题\n- 免费礼品\n- 独家内容\n\n### 3. 制造紧迫感\n- 限时优惠\n- 账户危险\n- 最后警告\n\n## 常见攻击手法\n\n### 1. 网络钓鱼（Phishing）\n- 伪造邮件和网站\n- 冒充银行、政府机构\n- 窃取账户密码\n\n### 2. 鱼叉式钓鱼（Spear Phishing）\n- 针对特定目标\n- 收集目标信息定制攻击\n- 更难检测\n\n### 3. 电话诈骗（Vishing）\n- 冒充客服、警察\n- 伪造来电显示\n- 诱导透露信息\n\n### 4. 短信诈骗（Smishing）\n- 通过短信发送恶意链接\n- 伪装成银行通知\n- 诱导点击下载\n\n### 5. 尾随（Tailgating）\n- 跟随授权人员进入受限区域\n- 不使用凭证\n- 物理安全威胁\n\n## 防范措施\n\n1. **安全意识培训**\n2. **验证来电者身份**\n3. **不随意透露信息**\n4. **警惕紧急请求**\n5. **报告可疑活动**',
    codeExample: { language: 'python', code: '# 钓鱼邮件检测\ndef detect_phishing(email):\n    risks = []\n    suspicious = ["amaz0n", "go0gle", "app1e", "paypa1"]\n    for domain in suspicious:\n        if domain in email.get("from", "").lower():\n            risks.append(f"可疑域名: {domain}")\n    urgent_words = ["紧急", "立即", "账户危险", "最后警告"]\n    for word in urgent_words:\n        if word in email.get("body", ""):\n            risks.append(f"紧迫性操纵: {word}")\n    return risks\n\nemail = {"from": "security@app1e.com", "body": "您的账户异常，请立即验证!"}\nprint(f"风险评估: {detect_phishing(email)}")', description: '模拟钓鱼邮件检测' },
    quiz: [{"id":"q5-1","question":"社会工程学攻击主要利用什么？","options":["技术漏洞","人的心理弱点","网络协议缺陷","硬件漏洞"],"correctIndex":1,"explanation":"社会工程学攻击利用人的心理弱点进行欺骗。"},{"id":"q5-2","question":"以下哪种是社会工程攻击？","options":["SQL注入","网络钓鱼（Phishing）","DDoS攻击","缓冲区溢出"],"correctIndex":1,"explanation":"网络钓鱼是社会工程攻击的典型代表。"},{"id":"q5-3","question":"防范社会工程攻击最有效的方法是？","options":["安装防火墙","安全意识和培训","使用VPN","加密数据"],"correctIndex":1,"explanation":"社会工程攻击针对的是人，最有效的防范是提高安全意识。"},{"id":"q5-4","question":"尾随进入（Tailgating）属于什么类型的攻击？","options":["网络攻击","物理+社会工程攻击","密码攻击","DDoS攻击"],"correctIndex":1,"explanation":"尾随进入利用人的礼貌和疏忽，属于物理+社会工程攻击。"},{"id":"q5-5","question":"钓鱼邮件通常包含什么特征？","options":["正式的发件人地址","紧急的语气和可疑的链接","正确的公司logo","正确的语法"],"correctIndex":1,"explanation":"钓鱼邮件通常使用紧急语气催促用户点击可疑链接。"}],
    expertNotes: dayExpertNotes[5],
    recommendedTools: [
    {
      id: 'nmap',
      name: 'Nmap',
      description: '网络发现和端口扫描工具',
      url: 'https://nmap.org/'
    },
    {
      id: 'wireshark',
      name: 'Wireshark',
      description: '网络协议分析工具',
      url: 'https://www.wireshark.org/'
    },
    {
      id: 'kali',
      name: 'Kali Linux',
      description: '渗透测试专用操作系统',
      url: 'https://www.kali.org/'
    }
  ],
    labEnvironments: [
    {
      id: 'juice-shop',
      name: 'OWASP Juice Shop',
      description: '包含 OWASP Top 10 漏洞的Web应用靶场',
      url: 'https://owasp.org/www-project-juice-shop/'
    },
    {
      id: 'dvwa',
      name: 'DVWA',
      description: 'Damn Vulnerable Web App - Web漏洞练习平台',
      url: 'http://www.dvwa.co.uk/'
    }
  ]
  },
  {
    id: 'day-6', day: 6, week: 1, title: '密码学基础概念',
    objectives: ['理解密码学术语', '了解加密解密原理', '掌握基本分类'],
    content: '# 密码学基础概念\n\n## 基本术语\n\n### 明文（Plaintext）\n- 原始可读的信息\n\n### 密文（Ciphertext）\n- 加密后的不可读信息\n\n### 加密（Encryption）\n- 将明文转换为密文的过程\n\n### 解密（Decryption）\n- 将密文还原为明文的过程\n\n### 密钥（Key）\n- 控制加密和解密的秘密信息\n\n### 算法（Algorithm）\n- 加密和解密使用的数学方法\n\n## 对称加密\n\n### 特点\n- 加密和解密使用同一密钥\n- 速度快，适合大量数据\n- 密钥传输是挑战\n\n### 代表算法\n- **DES**：56位密钥，已不安全\n- **3DES**：三重DES，已不推荐\n- **AES**：高级加密标准，128/192/256位\n\n## 非对称加密\n\n### 特点\n- 使用公钥和私钥一对密钥\n- 公钥加密，私钥解密\n- 或私钥签名，公钥验证\n- 计算速度较慢\n\n### 代表算法\n- **RSA**：基于大数分解\n- **ECC**：椭圆曲线密码学\n- **DSA**：数字签名算法\n\n## 混合加密\n\n实际应用中通常结合两者：\n1. 使用非对称加密传输对称密钥\n2. 使用对称加密加密大量数据\n3. 兼顾安全和性能\n\n## 密码学应用\n\n1. **数据加密**：保护数据机密性\n2. **数字签名**：验证身份和完整性\n3. **证书**：PKI体系基础\n4. **HTTPS**：TLS/SSL协议',
    codeExample: { language: 'python', code: '# 简单XOR加密演示\ndef xor_encrypt(text, key):\n    return "".join(chr(ord(c) ^ ord(k)) for c, k in zip(text, key * (len(text) // len(key) + 1)))\n\nmessage = "Hello CISP"\nkey = "KEY"\n\nencrypted = xor_encrypt(message, key)\ndecrypted = xor_encrypt(encrypted, key)\n\nprint(f"原始: {message}")\nprint(f"加密: {repr(encrypted)}")\nprint(f"解密: {decrypted}")', description: '演示简单对称加密' },
    quiz: [{"id":"q6-1","question":"以下哪种是对称加密算法？","options":["RSA","AES","ECC","DSA"],"correctIndex":1,"explanation":"AES是对称加密算法。"},{"id":"q6-2","question":"数字签名使用什么密钥进行签名？","options":["接收者的公钥","发送者的私钥","发送者的公钥","共享密钥"],"correctIndex":1,"explanation":"数字签名使用发送者的私钥进行签名。"},{"id":"q6-3","question":"SHA-256的输出长度是多少位？","options":["128位","160位","256位","512位"],"correctIndex":2,"explanation":"SHA-256的输出长度是256位。"},{"id":"q6-4","question":"PKI体系中，CA的作用是什么？","options":["加密数据","签发和管理数字证书","存储用户密码","检测网络攻击"],"correctIndex":1,"explanation":"CA负责签发和管理数字证书。"},{"id":"q6-5","question":"HTTPS使用什么协议实现安全传输？","options":["IPSec","TLS/SSL","SSH","PGP"],"correctIndex":1,"explanation":"HTTPS使用TLS/SSL协议加密传输。"}],
    expertNotes: dayExpertNotes[6],
    recommendedTools: [
    {
      id: 'nmap',
      name: 'Nmap',
      description: '网络发现和端口扫描工具',
      url: 'https://nmap.org/'
    },
    {
      id: 'wireshark',
      name: 'Wireshark',
      description: '网络协议分析工具',
      url: 'https://www.wireshark.org/'
    },
    {
      id: 'kali',
      name: 'Kali Linux',
      description: '渗透测试专用操作系统',
      url: 'https://www.kali.org/'
    }
  ],
    labEnvironments: [
    {
      id: 'juice-shop',
      name: 'OWASP Juice Shop',
      description: '包含 OWASP Top 10 漏洞的Web应用靶场',
      url: 'https://owasp.org/www-project-juice-shop/'
    },
    {
      id: 'dvwa',
      name: 'DVWA',
      description: 'Damn Vulnerable Web App - Web漏洞练习平台',
      url: 'http://www.dvwa.co.uk/'
    }
  ]
  },
  {
    id: 'day-7', day: 7, week: 1, title: '第一周总结与测验',
    objectives: ['回顾第一周知识点', '检验学习成果', '查漏补缺'],
    content: '# 第一周学习总结\n\n## 本周学习内容\n\n### Day 1: 信息安全概述\n- 信息安全定义和重要性\n- CIA三要素：机密性、完整性、可用性\n- 安全威胁分类\n\n### Day 2: 信息安全发展历程\n- 通信安全→计算机安全→网络安全→信息化安全\n- 关键标准和事件\n\n### Day 3: 网络安全基本概念\n- OSI七层模型和TCP/IP四层模型\n- 常见网络攻击类型\n\n### Day 4: 恶意软件分类\n- 病毒、蠕虫、木马、勒索软件区别\n- 传播方式和防范\n\n### Day 5: 社会工程学攻击\n- 社会工程学原理\n- 钓鱼攻击和防范\n\n### Day 6: 密码学基础\n- 基本术语\n- 对称加密与非对称加密\n\n## 知识要点回顾\n\n| 知识点 | 核心内容 |\n|---------|----------|\n| CIA三要素 | 机密性、完整性、可用性 |\n| 恶意软件 | 病毒需要宿主，蠕虫独立 |\n| 社会工程学 | 利用人性弱点 |\n| 加密技术 | 对称加密速度快，非对称更安全 |\n\n## 下周预告\n\n第二周将学习：\n- 中国网络安全法律法规\n- 等级保护制度\n- 数据安全与个人信息保护',
    quiz: [{"id":"q7-1","question":"信息安全的三个基本要素是什么？","options":["机密性、完整性、可用性","机密性、认证性、可用性","完整性、认证性、可用性","机密性、完整性、认证性"],"correctIndex":0,"explanation":"CIA三要素：机密性、完整性、可用性。"},{"id":"q7-2","question":"以下关于第一周总结与测验的说法，哪项最准确？","options":["只涉及理论","需要理论与实践结合","已经过时","只需记忆不需理解"],"correctIndex":1,"explanation":"信息安全学习最有效的方式是理论与实践相结合。"},{"id":"q7-3","question":"信息安全事件应急响应的第一步是什么？","options":["修复漏洞","通知媒体","隔离受影响系统","重装系统"],"correctIndex":2,"explanation":"应急响应第一步是隔离受影响系统防止损害扩大。"},{"id":"q7-4","question":"以下哪项不属于信息安全管理的范畴？","options":["风险评估","安全策略制定","员工绩效评估","安全审计"],"correctIndex":2,"explanation":"员工绩效评估属于人力资源管理范畴。"},{"id":"q7-5","question":"纵深防御（Defense in Depth）的核心理念是？","options":["只依赖防火墙","多层安全控制叠加","只做边界防护","依赖单一安全产品"],"correctIndex":1,"explanation":"纵深防御通过多层安全控制的叠加保护信息系统。"}],
    expertNotes: dayExpertNotes[7],
    recommendedTools: [
    {
      id: 'nmap',
      name: 'Nmap',
      description: '网络发现和端口扫描工具',
      url: 'https://nmap.org/'
    },
    {
      id: 'wireshark',
      name: 'Wireshark',
      description: '网络协议分析工具',
      url: 'https://www.wireshark.org/'
    },
    {
      id: 'kali',
      name: 'Kali Linux',
      description: '渗透测试专用操作系统',
      url: 'https://www.kali.org/'
    }
  ],
    labEnvironments: [
    {
      id: 'juice-shop',
      name: 'OWASP Juice Shop',
      description: '包含 OWASP Top 10 漏洞的Web应用靶场',
      url: 'https://owasp.org/www-project-juice-shop/'
    },
    {
      id: 'dvwa',
      name: 'DVWA',
      description: 'Damn Vulnerable Web App - Web漏洞练习平台',
      url: 'http://www.dvwa.co.uk/'
    }
  ]
  },
  // ========== Week 2: 信息安全法规 ==========
  {
    id: 'day-8', day: 8, week: 2, title: '中国网络安全法律法规体系',
    objectives: ['了解中国法律框架', '理解主要法规内容', '掌握合规要求'],
    content: '# 中国网络安全法律法规体系\n\n## 顶层法律\n\n### 1. 《中华人民共和国网络安全法》(2017)\n- 我国第一部网络安全领域基础性法律\n- 明确网络空间主权原则\n- 规定网络运营者安全义务\n- 关键信息基础设施保护制度\n\n### 2. 《中华人民共和国数据安全法》(2021)\n- 规范数据处理活动\n- 数据分类分级保护制度\n- 数据安全审查制度\n- 跨境数据传输管理\n\n### 3. 《中华人民共和国个人信息保护法》(2021)\n- 个人信息处理原则\n- 个人信息主体权利\n- 敏感个人信息特别保护\n- 个人信息跨境规则\n\n## 行政法规\n\n### 关键信息基础设施安全保护条例\n- 明确CII范围和保护要求\n- 运营者安全保护义务\n- 检测预警和应急处置\n\n### 网络安全审查办法\n- 影响国家安全的审查范围\n- 申报和审查程序\n- 审查结论和处理\n\n## 部门规章\n\n### 网络安全等级保护条例\n- 定级、备案、建设、测评\n- 等级保护2.0体系\n\n### 数据出境安全评估办法\n- 数据出境评估条件\n- 评估程序和标准\n\n## 违规后果\n\n### 行政处罚\n- 警告、通报批评\n- 罚款：最高5000万元或年营业额5%\n- 停业整顿、吊销证照\n\n### 民事责任\n- 损害赔偿\n\n### 刑事责任\n- 刑法第285-287条之规定',
    codeExample: { language: 'python', code: '# 合规检查清单\ndef check_compliance(features):\n    requirements = ["防火墙", "入侵检测", "日志审计", "数据加密", "应急预案"]\n    passed = sum(1 for req in requirements if features.get(req, False))\n    return passed, len(requirements)\n\nfeatures = {"防火墙": True, "入侵检测": True, "日志审计": True}\npassed, total = check_compliance(features)\nprint(f"合规检查: {passed}/{total} 项通过")\nprint(f"合规率: {(passed/total)*100:.1f}%")', description: '模拟合规检查' },
    quiz: [{"id":"q8-1","question":"以下哪种防火墙类型工作在OSI第4层？","options":["应用层防火墙","状态检测防火墙","代理防火墙","WAF"],"correctIndex":1,"explanation":"状态检测防火墙工作在传输层（第4层）。"},{"id":"q8-2","question":"IDS和IPS的主要区别是？","options":["IDS可以阻断攻击","IPS可以阻断攻击，IDS只能检测告警","两者功能完全相同","IDS比IPS更安全"],"correctIndex":1,"explanation":"IPS可以主动阻断攻击，IDS只能检测和告警。"},{"id":"q8-3","question":"TCP三次握手中，第二次握手发送的标志位是？","options":["SYN","ACK","SYN+ACK","FIN"],"correctIndex":2,"explanation":"第二次握手服务器回复SYN+ACK。"},{"id":"q8-4","question":"DNS欺骗攻击属于什么类型的攻击？","options":["物理攻击","中间人攻击","密码攻击","社会工程攻击"],"correctIndex":1,"explanation":"DNS欺骗通过伪造DNS响应属于中间人攻击。"},{"id":"q8-5","question":"防火墙默认策略应遵循什么原则？","options":["默认允许","默认拒绝","只允许80端口","按需决定"],"correctIndex":1,"explanation":"安全最佳实践：默认拒绝所有，按需开放。"}],
    expertNotes: dayExpertNotes[10],
    recommendedTools: [
    {
      id: 'compliance-checker',
      name: '等保合规检查工具',
      description: '网络安全等级保护合规检查工具包',
      url: 'https://www.djbh.net/'
    },
    {
      id: 'iso27001-toolkit',
      name: 'ISO 27001 工具包',
      description: '信息安全管理体系建设模板和工具',
      url: 'https://www.iso.org/isoiec-27001-information-security.html'
    }
  ],
    labEnvironments: [
    {
      id: 'compliance-lab',
      name: '企业合规练习平台',
      description: '模拟企业合规检查和审计流程的练习环境',
      url: 'https://www.iso27001security.com/'
    }
  ]
  },
  {
    id: 'day-9', day: 9, week: 2, title: '等级保护制度',
    objectives: ['理解等级保护意义', '了解五个保护等级', '掌握定级流程'],
    content: '# 等级保护制度\n\n## 基本概念\n\n网络安全等级保护制度是我国网络安全领域的基本制度，对网络分五个等级进行保护。\n\n## 五个保护等级\n\n| 等级 | 名称 | 适用对象 |\n|------|------|----------|\n| 第一级 | 自主保护级 | 一般网络，对国家安全影响较小 |\n| 第二级 | 指导保护级 | 对社会秩序和公共利益有一定影响 |\n| 第三级 | 监督保护级 | 对社会秩序和公共利益有严重影响 |\n| 第四级 | 强制保护级 | 对国家安全有严重损害 |\n| 第五级 | 专控保护级 | 对国家安全有特别严重损害 |\n\n## 定级流程\n\n1. **确定定级对象**：识别需要保护的网络和系统\n2. **初步定级**：根据业务重要性和影响范围\n3. **专家评审**：邀请安全专家评审定级结果\n4. **主管部门审核**：行业主管部门审核\n5. **公安机关备案**：向公安机关备案\n\n## 安全建设内容\n\n### 安全技术要求\n- 安全物理环境\n- 安全通信网络\n- 安全区域边界\n- 安全计算环境\n- 安全管理中心\n\n### 安全管理要求\n- 安全管理制度\n- 安全管理机构\n- 安全管理人员\n- 安全建设管理\n- 安全运维管理\n\n## 测评要求\n\n| 等级 | 测评周期 |\n|------|----------|\n| 二级 | 建议定期测评 |\n| 三级 | 至少每年一次 |\n| 四级 | 至少每半年一次 |',
    codeExample: { language: 'python', code: '# 等级保护定级模拟\ndef calculate_level(business_impact, service_scope):\n    score = business_impact * 0.6 + service_scope * 0.4\n    if score <= 1: return 1, "自主保护级"\n    elif score <= 2: return 2, "指导保护级"\n    elif score <= 3: return 3, "监督保护级"\n    elif score <= 4: return 4, "强制保护级"\n    else: return 5, "专控保护级"\n\n# 某电商平台评估\nlevel, name = calculate_level(business_impact=3, service_scope=3)\nprint(f"定级结果: 第{level}级 - {name}")', description: '模拟等级保护定级' },
    quiz: [{"id":"q9-1","question":"信息安全的三个基本要素是什么？","options":["机密性、完整性、可用性","机密性、认证性、可用性","完整性、认证性、可用性","机密性、完整性、认证性"],"correctIndex":0,"explanation":"CIA三要素：机密性、完整性、可用性。"},{"id":"q9-2","question":"以下关于等级保护制度的说法，哪项最准确？","options":["只涉及理论","需要理论与实践结合","已经过时","只需记忆不需理解"],"correctIndex":1,"explanation":"信息安全学习最有效的方式是理论与实践相结合。"},{"id":"q9-3","question":"信息安全事件应急响应的第一步是什么？","options":["修复漏洞","通知媒体","隔离受影响系统","重装系统"],"correctIndex":2,"explanation":"应急响应第一步是隔离受影响系统防止损害扩大。"},{"id":"q9-4","question":"以下哪项不属于信息安全管理的范畴？","options":["风险评估","安全策略制定","员工绩效评估","安全审计"],"correctIndex":2,"explanation":"员工绩效评估属于人力资源管理范畴。"},{"id":"q9-5","question":"纵深防御（Defense in Depth）的核心理念是？","options":["只依赖防火墙","多层安全控制叠加","只做边界防护","依赖单一安全产品"],"correctIndex":1,"explanation":"纵深防御通过多层安全控制的叠加保护信息系统。"}],
    expertNotes: dayExpertNotes[9],
    recommendedTools: [
    {
      id: 'compliance-checker',
      name: '等保合规检查工具',
      description: '网络安全等级保护合规检查工具包',
      url: 'https://www.djbh.net/'
    },
    {
      id: 'iso27001-toolkit',
      name: 'ISO 27001 工具包',
      description: '信息安全管理体系建设模板和工具',
      url: 'https://www.iso.org/isoiec-27001-information-security.html'
    }
  ],
    labEnvironments: [
    {
      id: 'compliance-lab',
      name: '企业合规练习平台',
      description: '模拟企业合规检查和审计流程的练习环境',
      url: 'https://www.iso27001security.com/'
    }
  ]
  },
  {
    id: 'day-10', day: 10, week: 2, title: '数据安全与个人信息保护',
    objectives: ['理解数据分类分级', '了解个人信息保护要求', '掌握数据安全措施'],
    content: '# 数据安全与个人信息保护\n\n## 数据分类分级\n\n### 按敏感程度分级\n\n| 级别 | 名称 | 影响范围 |\n|------|------|----------|\n| 1级 | 公开数据 | 无不利影响 |\n| 2级 | 内部数据 | 影响组织内部 |\n| 3级 | 敏感数据 | 影响业务运营 |\n| 4级 | 核心数据 | 影响国家安全 |\n\n### 数据生命周期\n1. **收集**：合法合规，最小必要\n2. **存储**：加密存储，访问控制\n3. **使用**：权限管控，审计追踪\n4. **共享**：安全评估，脱敏处理\n5. **销毁**：安全删除，不可恢复\n\n## 个人信息保护\n\n### 个人信息定义\n- 以电子或其他方式记录的与已识别或可识别的自然人有关的各种信息\n\n### 敏感个人信息\n- 生物识别信息（人脸、指纹）\n- 宗教信仰、医疗健康\n- 金融账户、行踪轨迹\n- 未成年人信息\n\n### 处理原则\n1. **合法正当**：符合法律法规\n2. **最小必要**：只收集必要信息\n3. **目的明确**：明确使用目的\n4. **知情同意**：获得用户同意\n5. **公开透明**：告知处理方式\n6. **确保安全**：保障信息安全\n\n### 个人信息主体权利\n1. 知情权\n2. 决定权\n3. 访问权\n4. 更正权\n5. 删除权（被遗忘权）\n6. 撤回同意权',
    codeExample: { language: 'python', code: '# 个人信息脱敏\ndef mask_id_card(id_card):\n    if len(id_card) == 18:\n        return id_card[:6] + "********" + id_card[-4:]\n    return id_card\n\ndef mask_phone(phone):\n    if len(phone) >= 11:\n        return phone[:3] + "****" + phone[-4:]\n    return phone\n\nprint(f"身份证: {mask_id_card(\"110101199001011234\")}")\nprint(f"手机号: {mask_phone(\"13812345678\")}")', description: '演示个人信息脱敏' },
    quiz: [{"id":"q10-1","question":"中国《网络安全法》正式实施的时间是？","options":["2016年6月1日","2017年6月1日","2018年6月1日","2019年6月1日"],"correctIndex":1,"explanation":"《网络安全法》于2017年6月1日正式实施。"},{"id":"q10-2","question":"《数据安全法》中数据分类分级的核心级别不包括？","options":["核心数据","重要数据","一般数据","普通数据"],"correctIndex":3,"explanation":"数据分类分级分为核心、重要和一般数据三个级别。"},{"id":"q10-3","question":"个人信息保护法中，敏感个人信息不包括？","options":["生物识别信息","医疗健康信息","工作单位名称","金融账户信息"],"correctIndex":2,"explanation":"工作单位名称不属于敏感个人信息。"},{"id":"q10-4","question":"等保2.0将安全保护等级分为几级？","options":["三级","四级","五级","六级"],"correctIndex":2,"explanation":"等保2.0将安全保护等级分为五级。"},{"id":"q10-5","question":"GDPR是哪个地区的隐私保护法规？","options":["美国","中国","欧盟","日本"],"correctIndex":2,"explanation":"GDPR是欧盟的通用数据保护条例。"}],
    expertNotes: dayExpertNotes[9],
    recommendedTools: [
    {
      id: 'compliance-checker',
      name: '等保合规检查工具',
      description: '网络安全等级保护合规检查工具包',
      url: 'https://www.djbh.net/'
    },
    {
      id: 'iso27001-toolkit',
      name: 'ISO 27001 工具包',
      description: '信息安全管理体系建设模板和工具',
      url: 'https://www.iso.org/isoiec-27001-information-security.html'
    }
  ],
    labEnvironments: [
    {
      id: 'compliance-lab',
      name: '企业合规练习平台',
      description: '模拟企业合规检查和审计流程的练习环境',
      url: 'https://www.iso27001security.com/'
    }
  ]
  },
  {
    id: 'day-11', day: 11, week: 2, title: '关键信息基础设施保护',
    objectives: ['理解CII概念', '了解保护义务', '掌握安全要求'],
    content: '# 关键信息基础设施保护\n\n## 什么是CII\n\n关键信息基础设施（Critical Information Infrastructure, CII）是指一旦遭到破坏、丧失功能或数据泄露，可能严重危害国家安全、国计民生、公共利益的网络设施和信息系统。\n\n## CII范围\n\n### 公共通信和信息服务\n- 电信网络\n- 互联网骨干网\n- 域名系统\n\n### 能源\n- 电力系统\n- 油气管道监控\n\n### 交通\n- 铁路调度\n- 航空管制\n- 智能交通\n\n### 金融\n- 银行核心系统\n- 证券交易系统\n- 支付清算系统\n\n### 政务\n- 电子政务系统\n- 政府门户网站\n\n### 其他\n- 广播电视\n- 卫生健康\n- 国防科技\n\n## 安全保护义务\n\n### 一般义务\n- 安全管理制度和操作规程\n- 安全负责人和管理机构\n- 从业人员背景审查\n- 安全培训和考核\n\n### 特殊义务\n- 安全检测评估（至少每年一次）\n- 重要数据备份和加密\n- 数据本地化存储要求\n- 安全事件报告制度\n- 采购安全审查\n\n## 供应链安全\n\n1. 供应链安全评估\n2. 安全测试和验证\n3. 采购合同安全条款\n4. 应急处置预案',
    codeExample: { language: 'python', code: '# CII安全评估\ndef assess_cii_risk(business_criticality, impact_scope, recovery_difficulty):\n    score = business_criticality * 0.4 + impact_scope * 0.3 + recovery_difficulty * 0.3\n    if score >= 80:\n        return score, "极高 - 需重点保护"\n    elif score >= 60:\n        return score, "高 - 需强化保护"\n    else:\n        return score, "中 - 标准保护"\n\nscore, level = assess_cii_risk(85, 75, 90)\nprint(f"评估分数: {score:.1f}")\nprint(f"风险等级: {level}")', description: '模拟CII安全评估' },
    quiz: [{"id":"q11-1","question":"信息安全的三个基本要素是什么？","options":["机密性、完整性、可用性","机密性、认证性、可用性","完整性、认证性、可用性","机密性、完整性、认证性"],"correctIndex":0,"explanation":"CIA三要素：机密性、完整性、可用性。"},{"id":"q11-2","question":"以下关于关键信息基础设施保护的说法，哪项最准确？","options":["只涉及理论","需要理论与实践结合","已经过时","只需记忆不需理解"],"correctIndex":1,"explanation":"信息安全学习最有效的方式是理论与实践相结合。"},{"id":"q11-3","question":"信息安全事件应急响应的第一步是什么？","options":["修复漏洞","通知媒体","隔离受影响系统","重装系统"],"correctIndex":2,"explanation":"应急响应第一步是隔离受影响系统防止损害扩大。"},{"id":"q11-4","question":"以下哪项不属于信息安全管理的范畴？","options":["风险评估","安全策略制定","员工绩效评估","安全审计"],"correctIndex":2,"explanation":"员工绩效评估属于人力资源管理范畴。"},{"id":"q11-5","question":"纵深防御（Defense in Depth）的核心理念是？","options":["只依赖防火墙","多层安全控制叠加","只做边界防护","依赖单一安全产品"],"correctIndex":1,"explanation":"纵深防御通过多层安全控制的叠加保护信息系统。"}],
    expertNotes: dayExpertNotes[9],
    recommendedTools: [
    {
      id: 'compliance-checker',
      name: '等保合规检查工具',
      description: '网络安全等级保护合规检查工具包',
      url: 'https://www.djbh.net/'
    },
    {
      id: 'iso27001-toolkit',
      name: 'ISO 27001 工具包',
      description: '信息安全管理体系建设模板和工具',
      url: 'https://www.iso.org/isoiec-27001-information-security.html'
    }
  ],
    labEnvironments: [
    {
      id: 'compliance-lab',
      name: '企业合规练习平台',
      description: '模拟企业合规检查和审计流程的练习环境',
      url: 'https://www.iso27001security.com/'
    }
  ]
  },
  {
    id: 'day-12', day: 12, week: 2, title: '网络安全审查制度',
    objectives: ['了解网络安全审查机制', '理解审查范围', '掌握合规要点'],
    content: '# 网络安全审查制度\n\n## 审查目的\n\n确保关键信息基础设施供应链安全，预防产品和服务的安全性、可用性，避免对国家安全造成危害。\n\n## 审查适用情形\n\n### 强制审查情形\n1. 关键信息基础设施运营者采购影响国家安全的网络产品和服务\n2. 数据处理者赴国外上市\n3. 其他影响国家安全的情形\n\n### 申报义务\n- 运营者应主动申报\n- 配合审查工作\n- 提供真实材料\n\n## 审查内容\n\n### 国家安全审查要素\n1. 产品和服务使用后带来的国家安全风险\n2. 产品和服务的安全性、开放性、透明性\n3. 供应链的安全性\n4. 数据安全和个人信息保护\n5. 其他可能影响国家安全的因素\n\n## 审查程序\n\n1. **申报**：运营者向主管部门申报\n2. **初步审查**：自收到申报材料之日起30个工作日内完成\n3. **特别审查**：45个工作日内完成，可延长\n4. **结论**：通过、有条件通过、不通过\n\n## 法律责任\n\n### 未申报的责任\n- 责令停止使用\n- 采购金额10倍以下罚款\n- 对责任人罚款\n\n### 提供虚假材料\n- 纳入信用记录\n- 追究法律责任',
    codeExample: { language: 'python', code: '# 审查流程模拟\ndef review_process(stages):\n    print("网络安全审查流程")\n    print("=" * 50)\n    total = 0\n    for name, days in stages:\n        print(f"  {name}: {days}个工作日")\n        total += days\n    print("=" * 50)\n    print(f"总审查时间: 约{total}个工作日")\n\nstages = [\n    ("材料申报", 5),\n    ("初步审查", 30),\n    ("特别审查", 45),\n    ("审查结论", 5)\n]\nreview_process(stages)', description: '模拟审查流程' },
    quiz: [{"id":"q12-1","question":"以下哪种防火墙类型工作在OSI第4层？","options":["应用层防火墙","状态检测防火墙","代理防火墙","WAF"],"correctIndex":1,"explanation":"状态检测防火墙工作在传输层（第4层）。"},{"id":"q12-2","question":"IDS和IPS的主要区别是？","options":["IDS可以阻断攻击","IPS可以阻断攻击，IDS只能检测告警","两者功能完全相同","IDS比IPS更安全"],"correctIndex":1,"explanation":"IPS可以主动阻断攻击，IDS只能检测和告警。"},{"id":"q12-3","question":"TCP三次握手中，第二次握手发送的标志位是？","options":["SYN","ACK","SYN+ACK","FIN"],"correctIndex":2,"explanation":"第二次握手服务器回复SYN+ACK。"},{"id":"q12-4","question":"DNS欺骗攻击属于什么类型的攻击？","options":["物理攻击","中间人攻击","密码攻击","社会工程攻击"],"correctIndex":1,"explanation":"DNS欺骗通过伪造DNS响应属于中间人攻击。"},{"id":"q12-5","question":"防火墙默认策略应遵循什么原则？","options":["默认允许","默认拒绝","只允许80端口","按需决定"],"correctIndex":1,"explanation":"安全最佳实践：默认拒绝所有，按需开放。"}],
    expertNotes: dayExpertNotes[10],
    recommendedTools: [
    {
      id: 'compliance-checker',
      name: '等保合规检查工具',
      description: '网络安全等级保护合规检查工具包',
      url: 'https://www.djbh.net/'
    },
    {
      id: 'iso27001-toolkit',
      name: 'ISO 27001 工具包',
      description: '信息安全管理体系建设模板和工具',
      url: 'https://www.iso.org/isoiec-27001-information-security.html'
    }
  ],
    labEnvironments: [
    {
      id: 'compliance-lab',
      name: '企业合规练习平台',
      description: '模拟企业合规检查和审计流程的练习环境',
      url: 'https://www.iso27001security.com/'
    }
  ]
  },
  {
    id: 'day-13', day: 13, week: 2, title: '合规管理体系建设',
    objectives: ['理解合规管理框架', '了解三道防线', '掌握审计方法'],
    content: '# 合规管理体系建设\n\n## 合规管理框架\n\n### 核心要素\n1. **治理架构**：明确合规管理责任\n2. **规章制度**：建立合规政策和流程\n3. **风险管理**：识别和评估合规风险\n4. **培训教育**：提升员工合规意识\n5. **监督检查**：定期审计和检查\n6. **持续改进**：根据检查结果改进\n\n## 三道防线模型\n\n### 第一道防线：业务部门\n- 执行合规要求\n- 日常合规管理\n- 识别和报告合规风险\n\n### 第二道防线：合规部门\n- 制定合规政策\n- 提供合规咨询\n- 监督和指导业务部门\n- 组织合规培训\n\n### 第三道防线：内部审计\n- 独立审计评估\n- 检查合规有效性\n- 向管理层报告\n\n## 合规审计\n\n### 审计类型\n1. **全面审计**：定期全面检查\n2. **专项审计**：针对特定领域\n3. **突击审计**：不预先通知\n\n### 审计方法\n- 文件审阅\n- 人员访谈\n- 系统测试\n- 数据分析\n- 抽样检查\n\n### 常见问题\n1. 制度存在但执行不到位\n2. 员工合规意识薄弱\n3. 技术措施不足\n4. 持续监控缺失',
    codeExample: { language: 'python', code: '# 合规差距分析\ndef analyze_gap(current, requirements):\n    missing = [req for req in requirements if req not in current]\n    return missing, len(requirements) - len(missing), len(requirements)\n\nrequirements = ["MFA认证", "定期改密", "权限审批", "数据加密", "日志审计"]\ncurrent = ["MFA认证", "定期改密", "日志审计"]\n\nmissing, passed, total = analyze_gap(current, requirements)\nprint(f"差距项: {missing}")\nprint(f"合规率: {(passed/total)*100:.1f}%")', description: '模拟合规差距分析' },
    quiz: [{"id":"q13-1","question":"中国《网络安全法》正式实施的时间是？","options":["2016年6月1日","2017年6月1日","2018年6月1日","2019年6月1日"],"correctIndex":1,"explanation":"《网络安全法》于2017年6月1日正式实施。"},{"id":"q13-2","question":"《数据安全法》中数据分类分级的核心级别不包括？","options":["核心数据","重要数据","一般数据","普通数据"],"correctIndex":3,"explanation":"数据分类分级分为核心、重要和一般数据三个级别。"},{"id":"q13-3","question":"个人信息保护法中，敏感个人信息不包括？","options":["生物识别信息","医疗健康信息","工作单位名称","金融账户信息"],"correctIndex":2,"explanation":"工作单位名称不属于敏感个人信息。"},{"id":"q13-4","question":"等保2.0将安全保护等级分为几级？","options":["三级","四级","五级","六级"],"correctIndex":2,"explanation":"等保2.0将安全保护等级分为五级。"},{"id":"q13-5","question":"GDPR是哪个地区的隐私保护法规？","options":["美国","中国","欧盟","日本"],"correctIndex":2,"explanation":"GDPR是欧盟的通用数据保护条例。"}],
    expertNotes: [{"author":"吴强","title":"网络安全法解读","content":"《网络安全法》是网安从业者的基本法。重点掌握：网络运营者安全义务、个人信息保护要求、关键信息基础设施保护。建议把法律条文和实际工作中的合规要求对应起来。","url":"https://www.freebuf.com/articles/es/273456.html"},{"author":"周敏","title":"数据安全合规实践","content":"数据安全法实施后，数据分类分级成为企业的必修课。从数据资产梳理入手，按核心-重要-一般三级分类。特别注意个人信息和重要数据的跨境传输合规要求。","url":"https://www.freebuf.com/articles/database/290456.html"},{"author":"孙丽","title":"合规管理体系建设","content":"三道防线模型：业务部门（执行合规）、合规部门（制定政策）、内部审计（独立评估）。定期进行合规审计，建立持续改进机制。合规不是一次性工作，是持续的过程。","url":"https://www.freebuf.com/articles/cloud/285678.html"}],
    recommendedTools: [
    {
      id: 'compliance-checker',
      name: '等保合规检查工具',
      description: '网络安全等级保护合规检查工具包',
      url: 'https://www.djbh.net/'
    },
    {
      id: 'iso27001-toolkit',
      name: 'ISO 27001 工具包',
      description: '信息安全管理体系建设模板和工具',
      url: 'https://www.iso.org/isoiec-27001-information-security.html'
    }
  ],
    labEnvironments: [
    {
      id: 'compliance-lab',
      name: '企业合规练习平台',
      description: '模拟企业合规检查和审计流程的练习环境',
      url: 'https://www.iso27001security.com/'
    }
  ]
  },
  {
    id: 'day-14', day: 14, week: 2, title: '第二周总结与测验',
    objectives: ['回顾第二周知识点', '检验学习成果', '为第三周做准备'],
    content: '# 第二周学习总结\n\n## 本周学习内容\n\n### Day 8: 网络安全法律法规体系\n- 三法：网络安全法、数据安全法、个人信息保护法\n- 行政法规和部门规章\n\n### Day 9: 等级保护制度\n- 五个保护等级\n- 定级流程和测评要求\n\n### Day 10: 数据安全与个人信息保护\n- 数据分类分级\n- 个人信息保护原则\n\n### Day 11: 关键信息基础设施保护\n- CII定义和范围\n- 安全保护义务\n\n### Day 12: 网络安全审查制度\n- 审查适用范围\n- 审查程序\n\n### Day 13: 合规管理体系建设\n- 三道防线模型\n- 合规审计方法\n\n## 知识要点\n\n| 法规 | 实施时间 | 核心内容 |\n|------|----------|----------|\n| 网络安全法 | 2017年 | 基础性法律 |\n| 数据安全法 | 2021年 | 数据分类分级 |\n| 个人信息保护法 | 2021年 | 个人信息权利 |\n| 等级保护 | - | 五级保护制度 |\n\n## 下周预告\n\n第三周将学习：\n- 身份认证技术\n- 密码认证\n- 多因素认证\n- 单点登录',
    quiz: [{"id":"q14-1","question":"信息安全的三个基本要素是什么？","options":["机密性、完整性、可用性","机密性、认证性、可用性","完整性、认证性、可用性","机密性、完整性、认证性"],"correctIndex":0,"explanation":"CIA三要素：机密性、完整性、可用性。"},{"id":"q14-2","question":"以下关于第二周总结与测验的说法，哪项最准确？","options":["只涉及理论","需要理论与实践结合","已经过时","只需记忆不需理解"],"correctIndex":1,"explanation":"信息安全学习最有效的方式是理论与实践相结合。"},{"id":"q14-3","question":"信息安全事件应急响应的第一步是什么？","options":["修复漏洞","通知媒体","隔离受影响系统","重装系统"],"correctIndex":2,"explanation":"应急响应第一步是隔离受影响系统防止损害扩大。"},{"id":"q14-4","question":"以下哪项不属于信息安全管理的范畴？","options":["风险评估","安全策略制定","员工绩效评估","安全审计"],"correctIndex":2,"explanation":"员工绩效评估属于人力资源管理范畴。"},{"id":"q14-5","question":"纵深防御（Defense in Depth）的核心理念是？","options":["只依赖防火墙","多层安全控制叠加","只做边界防护","依赖单一安全产品"],"correctIndex":1,"explanation":"纵深防御通过多层安全控制的叠加保护信息系统。"}],
    expertNotes: dayExpertNotes[9],
    recommendedTools: [
    {
      id: 'compliance-checker',
      name: '等保合规检查工具',
      description: '网络安全等级保护合规检查工具包',
      url: 'https://www.djbh.net/'
    },
    {
      id: 'iso27001-toolkit',
      name: 'ISO 27001 工具包',
      description: '信息安全管理体系建设模板和工具',
      url: 'https://www.iso.org/isoiec-27001-information-security.html'
    }
  ],
    labEnvironments: [
    {
      id: 'compliance-lab',
      name: '企业合规练习平台',
      description: '模拟企业合规检查和审计流程的练习环境',
      url: 'https://www.iso27001security.com/'
    }
  ]
  },
  // ========== Week 3: 访问控制 ==========
  {
    id: 'day-15', day: 15, week: 3, title: '身份认证基础',
    objectives: ['理解身份认证概念', '了解认证因素', '掌握认证方法'],
    content: '# 身份认证基础\n\n## 基本概念\n\n身份认证是验证用户或系统声称身份真实性的过程，是访问控制的第一道防线。\n\n## 认证因素\n\n### 知识因素（Something you know）\n- 密码、PIN码\n- 安全问题答案\n- 解锁图案\n\n### 持有因素（Something you have）\n- 智能卡、USB Key\n- 手机短信验证码\n- 硬件令牌（RSA SecurID）\n\n### 生物因素（Something you are）\n- 指纹、虹膜、面部\n- 语音、签名动力学\n- 击键节奏\n\n### 位置因素（Somewhere you are）\n- IP地址\n- 地理位置\n- 网络接入点\n\n## 认证方法\n\n### 单因素认证\n- 仅使用一种认证因素\n- 如仅使用密码\n- 安全性较低\n\n### 双因素认证（2FA）\n- 使用两种认证因素\n- 如密码+短信验证码\n- 安全性显著提高\n\n### 多因素认证（MFA）\n- 使用两种以上因素\n- 如密码+令牌+指纹\n- 最高安全性\n\n## 常见攻击方式\n\n1. **密码暴力破解**：尝试大量组合\n2. **字典攻击**：使用常用密码字典\n3. **彩虹表攻击**：预计算哈希表\n4. **社会工程**：欺骗用户透露\n5. **键盘记录**：记录用户输入',
    codeExample: { language: 'python', code: '# 认证系统模拟\ndef authenticate(username, password):\n    users = {"admin": "admin123", "user": "user123"}\n    if username not in users:\n        return False, "用户不存在"\n    if users[username] != password:\n        return False, "密码错误"\n    return True, "认证成功"\n\n# 测试\nfor test in [("admin", "admin123"), ("admin", "wrong"), ("guest", "123")]:\n    success, msg = authenticate(*test)\n    print(f"{test[0]}: {msg}")', description: '演示基本认证流程' },
    quiz: [{"id":"q15-1","question":"多因素认证通常包括哪三类因素？","options":["知识、持有、生物特征","密码、指纹、面部","用户名、密码、验证码","硬件、软件、固件"],"correctIndex":0,"explanation":"三类因素：你知道的（知识）、你拥有的（持有）、你是什么（生物特征）。"},{"id":"q15-2","question":"访问控制模型中，RBAC代表什么？","options":["基于规则的访问控制","基于角色的访问控制","基于风险的访问控制","基于资源的访问控制"],"correctIndex":1,"explanation":"RBAC是Role-Based Access Control。"},{"id":"q15-3","question":"最小权限原则是指？","options":["所有用户都是管理员","用户只获得完成任务所需的最小权限","用户拥有所有权限","权限由用户自己决定"],"correctIndex":1,"explanation":"最小权限原则确保用户只拥有完成任务所需的最少权限。"},{"id":"q15-4","question":"Kerberos认证协议的核心组件是？","options":["防火墙","KDC（密钥分发中心）","VPN","IDS"],"correctIndex":1,"explanation":"Kerberos的核心是KDC密钥分发中心。"},{"id":"q15-5","question":"单点登录（SSO）的主要优势是？","options":["增加密码数量","减少用户记忆密码数量，提升体验","降低系统安全性","增加管理复杂度"],"correctIndex":1,"explanation":"SSO让用户只需登录一次即可访问多个系统。"}],
    expertNotes: dayExpertNotes[15],
    recommendedTools: [
    {
      id: 'active-directory',
      name: 'Active Directory',
      description: 'Windows域环境访问控制系统',
      url: 'https://learn.microsoft.com/windows-server/identity/ad-ds/'
    },
    {
      id: 'keycloak',
      name: 'Keycloak',
      description: '开源身份认证与授权管理系统',
      url: 'https://www.keycloak.org/'
    }
  ],
    labEnvironments: [
    {
      id: 'rbac-lab',
      name: 'RBAC 访问控制实验',
      description: '练习基于角色的访问控制模型配置',
      url: 'https://github.com/topics/rbac'
    }
  ]
  },
  {
    id: 'day-16', day: 16, week: 3, title: '密码认证技术',
    objectives: ['理解密码安全原则', '了解密码存储方法', '掌握密码策略'],
    content: '# 密码认证技术\n\n## 密码安全原则\n\n### 长度要求\n- 建议至少12个字符\n- 越长越安全\n\n### 复杂度要求\n- 包含大小写字母\n- 包含数字\n- 包含特殊字符\n\n### 定期更换\n- 建议每90天更换\n- 禁止重复使用历史密码\n\n## 密码存储\n\n### 明文存储（危险）\n- 绝对禁止\n- 数据泄露即密码泄露\n\n### 加密存储（不推荐）\n- 使用对称加密\n- 可解密还原，存在风险\n\n### 哈希存储（推荐）\n- 使用强哈希算法（bcrypt、Argon2）\n- 添加随机盐值\n- 无法从哈希反推密码\n\n## 加盐哈希原理\n\n1. 生成随机盐值（salt）\n2. 将密码与盐值拼接\n3. 计算哈希值\n4. 存储：salt + hash\n\n## 密码策略\n\n### 账户锁定\n- 多次失败后锁定账户\n- 防止暴力破解\n\n### 密码历史\n- 记录历史密码\n- 禁止重复使用\n\n### 密码强度检测\n- 实时检测密码强度\n- 提供改进建议',
    codeExample: { language: 'python', code: 'import hashlib\nimport secrets\n\ndef hash_password(password, salt):\n    return hashlib.sha256((password + salt).encode()).hexdigest()\n\n# 注册\nsalt = secrets.token_hex(16)\nstored_hash = hash_password("mypassword", salt)\nprint(f"存储: salt={salt[:8]}..., hash={stored_hash[:16]}...")\n\n# 登录验证\ndef verify(input_password, salt, stored):\n    return hash_password(input_password, salt) == stored\n\nprint(f"验证正确密码: {verify(\"mypassword\", salt, stored_hash)}")\nprint(f"验证错误密码: {verify(\"wrongpassword\", salt, stored_hash)}")', description: '演示密码哈希存储' },
    quiz: [{"id":"q16-1","question":"以下哪种是对称加密算法？","options":["RSA","AES","ECC","DSA"],"correctIndex":1,"explanation":"AES是对称加密算法。"},{"id":"q16-2","question":"数字签名使用什么密钥进行签名？","options":["接收者的公钥","发送者的私钥","发送者的公钥","共享密钥"],"correctIndex":1,"explanation":"数字签名使用发送者的私钥进行签名。"},{"id":"q16-3","question":"SHA-256的输出长度是多少位？","options":["128位","160位","256位","512位"],"correctIndex":2,"explanation":"SHA-256的输出长度是256位。"},{"id":"q16-4","question":"PKI体系中，CA的作用是什么？","options":["加密数据","签发和管理数字证书","存储用户密码","检测网络攻击"],"correctIndex":1,"explanation":"CA负责签发和管理数字证书。"},{"id":"q16-5","question":"HTTPS使用什么协议实现安全传输？","options":["IPSec","TLS/SSL","SSH","PGP"],"correctIndex":1,"explanation":"HTTPS使用TLS/SSL协议加密传输。"}],
    expertNotes: [{"author":"张伟","title":"密码学学习路径","content":"密码学不要一上来就啃数学公式。建议学习路径：先理解对称加密（AES）和非对称加密（RSA）的核心思想——一个是同一把钥匙，一个是公钥私钥对。然后再学哈希、数字签名、PKI。动手用OpenSSL生成证书是很好的实践。","url":"https://www.freebuf.com/articles/es/267825.html"},{"author":"李明","title":"国密算法实践","content":"SM2/SM3/SM4是国产密码算法的核心，在政务和关键基础设施项目中已成为强制要求。SM2是椭圆曲线公钥密码算法，SM3是密码杂凑算法，SM4是分组密码算法。OpenSSL 1.1.1+已经支持国密算法。","url":"https://www.anquanke.com/post/id/243567.html"},{"author":"王芳","title":"PKI体系建设经验","content":"CA的私钥保护是最关键的（建议使用HSM硬件安全模块），证书生命周期管理要自动化避免过期导致服务中断。中小企业可考虑Let's Encrypt或云厂商证书管理服务。","url":"https://www.freebuf.com/articles/es/278934.html"}],
    recommendedTools: [
    {
      id: 'active-directory',
      name: 'Active Directory',
      description: 'Windows域环境访问控制系统',
      url: 'https://learn.microsoft.com/windows-server/identity/ad-ds/'
    },
    {
      id: 'keycloak',
      name: 'Keycloak',
      description: '开源身份认证与授权管理系统',
      url: 'https://www.keycloak.org/'
    }
  ],
    labEnvironments: [
    {
      id: 'rbac-lab',
      name: 'RBAC 访问控制实验',
      description: '练习基于角色的访问控制模型配置',
      url: 'https://github.com/topics/rbac'
    }
  ]
  },
  {
    id: 'day-17', day: 17, week: 3, title: '生物识别技术',
    objectives: ['了解生物识别类型', '理解优缺点', '掌握应用场景'],
    content: '# 生物识别技术\n\n## 生物识别类型\n\n### 生理特征\n\n#### 指纹识别\n- 最广泛使用\n- 成本较低\n- 准确度较高\n\n#### 面部识别\n- 非接触式\n- 隐私争议大\n- 受光照、表情影响\n\n#### 虹膜识别\n- 极高准确度\n- 难以伪造\n- 设备成本高\n\n#### 掌纹/掌静脉\n- 手掌特征丰富\n- 静脉识别需活体\n\n### 行为特征\n\n#### 语音识别\n- 通过声音特征识别\n- 易受环境噪音影响\n\n#### 签名动力学\n- 分析签名速度和压力\n- 传统方式易接受\n\n#### 击键节奏\n- 分析键盘输入习惯\n- 可用于持续认证\n\n## 优缺点分析\n\n### 优点\n- 不易遗忘和丢失\n- 难以复制和伪造\n- 使用方便快捷\n\n### 缺点\n- 不可撤销（泄露无法更换）\n- 存在误识率（FRR/FAR）\n- 隐私和伦理问题\n- 部分方式对健康有要求\n\n## 应用场景\n\n1. **设备解锁**：手机、笔记本\n2. **门禁系统**：办公区域\n3. **金融认证**：支付验证\n4. **边境检查**：护照核验\n\n## 最佳实践\n\n- 与其他认证结合使用（多因素）\n- 本地存储生物特征（不上传）\n- 提供备用认证方式\n- 定期评估误识率',
    codeExample: { language: 'python', code: '# 生物识别匹配模拟\ndef calculate_similarity(input_data, template, threshold=0.85):\n    """模拟相似度计算（实际使用复杂算法）"""\n    # 简化: 返回随机相似度\n    import random\n    similarity = random.uniform(0.7, 0.99)\n    if similarity >= threshold:\n        return True, similarity, f"匹配成功 ({similarity:.2%})"\n    else:\n        return False, similarity, f"匹配失败 ({similarity:.2%})"\n\n# 测试指纹认证\nprint("指纹认证测试")\nfor _ in range(3):\n    success, sim, msg = calculate_similarity("scanned_fp", "stored_fp")\n    print(f"  {msg}")', description: '模拟生物识别匹配' },
    quiz: [{"id":"q17-1","question":"信息安全的三个基本要素是什么？","options":["机密性、完整性、可用性","机密性、认证性、可用性","完整性、认证性、可用性","机密性、完整性、认证性"],"correctIndex":0,"explanation":"CIA三要素：机密性、完整性、可用性。"},{"id":"q17-2","question":"以下关于生物识别技术的说法，哪项最准确？","options":["只涉及理论","需要理论与实践结合","已经过时","只需记忆不需理解"],"correctIndex":1,"explanation":"信息安全学习最有效的方式是理论与实践相结合。"},{"id":"q17-3","question":"信息安全事件应急响应的第一步是什么？","options":["修复漏洞","通知媒体","隔离受影响系统","重装系统"],"correctIndex":2,"explanation":"应急响应第一步是隔离受影响系统防止损害扩大。"},{"id":"q17-4","question":"以下哪项不属于信息安全管理的范畴？","options":["风险评估","安全策略制定","员工绩效评估","安全审计"],"correctIndex":2,"explanation":"员工绩效评估属于人力资源管理范畴。"},{"id":"q17-5","question":"纵深防御（Defense in Depth）的核心理念是？","options":["只依赖防火墙","多层安全控制叠加","只做边界防护","依赖单一安全产品"],"correctIndex":1,"explanation":"纵深防御通过多层安全控制的叠加保护信息系统。"}],
    expertNotes: dayExpertNotes[15],
    recommendedTools: [
    {
      id: 'active-directory',
      name: 'Active Directory',
      description: 'Windows域环境访问控制系统',
      url: 'https://learn.microsoft.com/windows-server/identity/ad-ds/'
    },
    {
      id: 'keycloak',
      name: 'Keycloak',
      description: '开源身份认证与授权管理系统',
      url: 'https://www.keycloak.org/'
    }
  ],
    labEnvironments: [
    {
      id: 'rbac-lab',
      name: 'RBAC 访问控制实验',
      description: '练习基于角色的访问控制模型配置',
      url: 'https://github.com/topics/rbac'
    }
  ]
  },
  {
    id: 'day-18', day: 18, week: 3, title: '多因素认证（MFA）',
    objectives: ['理解MFA原理', '了解常见形式', '掌握实现方法'],
    content: '# 多因素认证\n\n## MFA概念\n\n多因素认证要求用户提供两种或以上不同类型的认证因素来验证身份。\n\n## 常见MFA形式\n\n### 基于时间的一次性密码（TOTP）\n- Google Authenticator、Microsoft Authenticator\n- 每30秒生成6位数字密码\n- 基于共享密钥和当前时间\n- RFC 6238标准\n\n### 基于HMAC的一次性密码（HOTP）\n- 基于计数器而非时间\n- 每次认证计数器递增\n- RFC 4226标准\n\n### 短信验证码\n- 通过短信发送验证码\n- 方便但安全性较低\n- SIM卡劫持风险\n\n### 推送通知\n- 通过APP推送确认请求\n- 用户点击确认即可\n- 用户体验好\n\n### 硬件令牌\n- RSA SecurID、YubiKey\n- 物理设备生成密码\n- 最高安全性\n\n## TOTP工作原理\n\n密码 = HMAC-SHA1(密钥, 当前时间/30秒)\n取4字节 -> 转换为6位数字\n\n## 实现步骤\n\n1. **注册时**：生成共享密钥（Base32编码）\n2. **用户配置**：扫描二维码或手动输入密钥\n3. **登录时**：输入密码+当前TOTP\n4. **服务器验证**：使用相同算法计算并比较\n\n## 安全考虑\n\n- 密钥安全存储（加密存储）\n- 时间同步（服务器和设备时间）\n- 窗口验证（允许±1个时间窗口）\n- 备用代码（设备丢失时使用）',
    codeExample: { language: 'python', code: 'import time\nimport hmac\nimport base64\nimport struct\n\ndef generate_totp(secret, interval=30):\n    timestamp = int(time.time() // interval)\n    time_bytes = struct.pack(">Q", timestamp)\n    secret_bytes = base64.b32decode(secret)\n    hmac_result = hmac.new(secret_bytes, time_bytes, "sha1").digest()\n    offset = hmac_result[-1] & 0x0f\n    code = struct.unpack(">I", hmac_result[offset:offset+4])[0] & 0x7fffffff\n    return f"{code % 1000000:06d}"\n\n# 测试\nsecret = "JBSWY3DPEHPK3PXP"  # Base32密钥\nprint(f"TOTP: {generate_totp(secret)}")\nprint("(30秒后会变化)")', description: '演示TOTP算法' },
    quiz: [{"id":"q18-1","question":"信息安全的三个基本要素是什么？","options":["机密性、完整性、可用性","机密性、认证性、可用性","完整性、认证性、可用性","机密性、完整性、认证性"],"correctIndex":0,"explanation":"CIA三要素：机密性、完整性、可用性。"},{"id":"q18-2","question":"以下关于多因素认证（MFA）的说法，哪项最准确？","options":["只涉及理论","需要理论与实践结合","已经过时","只需记忆不需理解"],"correctIndex":1,"explanation":"信息安全学习最有效的方式是理论与实践相结合。"},{"id":"q18-3","question":"信息安全事件应急响应的第一步是什么？","options":["修复漏洞","通知媒体","隔离受影响系统","重装系统"],"correctIndex":2,"explanation":"应急响应第一步是隔离受影响系统防止损害扩大。"},{"id":"q18-4","question":"以下哪项不属于信息安全管理的范畴？","options":["风险评估","安全策略制定","员工绩效评估","安全审计"],"correctIndex":2,"explanation":"员工绩效评估属于人力资源管理范畴。"},{"id":"q18-5","question":"纵深防御（Defense in Depth）的核心理念是？","options":["只依赖防火墙","多层安全控制叠加","只做边界防护","依赖单一安全产品"],"correctIndex":1,"explanation":"纵深防御通过多层安全控制的叠加保护信息系统。"}],
    expertNotes: dayExpertNotes[15],
    recommendedTools: [
    {
      id: 'active-directory',
      name: 'Active Directory',
      description: 'Windows域环境访问控制系统',
      url: 'https://learn.microsoft.com/windows-server/identity/ad-ds/'
    },
    {
      id: 'keycloak',
      name: 'Keycloak',
      description: '开源身份认证与授权管理系统',
      url: 'https://www.keycloak.org/'
    }
  ],
    labEnvironments: [
    {
      id: 'rbac-lab',
      name: 'RBAC 访问控制实验',
      description: '练习基于角色的访问控制模型配置',
      url: 'https://github.com/topics/rbac'
    }
  ]
  },
  {
    id: 'day-19', day: 19, week: 3, title: '单点登录（SSO）',
    objectives: ['理解SSO概念', '了解SSO协议', '掌握实现原理'],
    content: '# 单点登录\n\n## SSO概念\n\n单点登录（Single Sign-On, SSO）允许用户一次登录后，无需再次认证即可访问多个相关但独立的系统。\n\n## SSO优点\n\n- 用户体验：一次登录，多处使用\n- 密码管理：减少密码数量，降低遗忘率\n- 安全集中：统一认证，集中管理\n- 降低成本：减少密码重置请求\n\n## SSO缺点\n- 单点故障：认证服务故障影响所有应用\n- 安全风险：账户泄露影响所有系统\n- 复杂性：实施和维护成本较高\n\n## 常见SSO协议\n\n### SAML 2.0（安全断言标记语言）\n- 基于XML\n- 企业级应用广泛\n- 支持多种绑定方式\n- Web Browser SSO Profile\n\n### OAuth 2.0\n- 轻量级授权框架（注意：不是认证协议）\n- 互联网应用常用（Google、Facebook）\n- 支持多种授权类型\n\n### OpenID Connect (OIDC)\n- 基于OAuth 2.0的身份认证层\n- 使用JSON格式\n- 现代Web和移动端首选\n\n### CAS（中央认证服务）\n- 开源SSO协议\n- 教育机构常用\n\n## SSO流程（SAML）\n\n1. 用户访问应用SP（服务提供者）\n2. SP重定向到IdP（身份提供者）\n3. 用户在IdP登录\n4. IdP生成SAML断言（包含用户信息）\n5. IdP返回断言到SP\n6. SP验证断言，创建会话\n\n## 组件角色\n\n- **IdP（Identity Provider）**：身份提供者，验证用户\n- **SP（Service Provider）**：服务提供者，信任IdP',
    codeExample: {
      language: 'python',
      code: ` SSO会话管理模拟\nclass SSOManager:\n    def __init__(self):\n        self.sessions = {}\n    \n    def login(self, username, password):\n        valid_users = {"admin": "admin123", "user": "user123"}\n        if username in valid_users and valid_users[username] == password:\n            session_id = f"session_{len(self.sessions)+1}"\n            self.sessions[session_id] = username\n            return session_id\n        return None\n    \n    def validate(self, session_id):\n        return session_id in self.sessions\n\nsso = SSOManager()\nsid = sso.login("admin", "admin123")\nprint(f"登录成功: {sid}")\nprint(f"验证状态: {sso.validate(sid)}")`,
      description: '演示SSO会话管理',
    },
    quiz: [{"id":"q19-1","question":"信息安全的三个基本要素是什么？","options":["机密性、完整性、可用性","机密性、认证性、可用性","完整性、认证性、可用性","机密性、完整性、认证性"],"correctIndex":0,"explanation":"CIA三要素：机密性、完整性、可用性。"},{"id":"q19-2","question":"以下关于单点登录（SSO）的说法，哪项最准确？","options":["只涉及理论","需要理论与实践结合","已经过时","只需记忆不需理解"],"correctIndex":1,"explanation":"信息安全学习最有效的方式是理论与实践相结合。"},{"id":"q19-3","question":"信息安全事件应急响应的第一步是什么？","options":["修复漏洞","通知媒体","隔离受影响系统","重装系统"],"correctIndex":2,"explanation":"应急响应第一步是隔离受影响系统防止损害扩大。"},{"id":"q19-4","question":"以下哪项不属于信息安全管理的范畴？","options":["风险评估","安全策略制定","员工绩效评估","安全审计"],"correctIndex":2,"explanation":"员工绩效评估属于人力资源管理范畴。"},{"id":"q19-5","question":"纵深防御（Defense in Depth）的核心理念是？","options":["只依赖防火墙","多层安全控制叠加","只做边界防护","依赖单一安全产品"],"correctIndex":1,"explanation":"纵深防御通过多层安全控制的叠加保护信息系统。"}],
    expertNotes: dayExpertNotes[15],
    recommendedTools: [
    {
      id: 'active-directory',
      name: 'Active Directory',
      description: 'Windows域环境访问控制系统',
      url: 'https://learn.microsoft.com/windows-server/identity/ad-ds/'
    },
    {
      id: 'keycloak',
      name: 'Keycloak',
      description: '开源身份认证与授权管理系统',
      url: 'https://www.keycloak.org/'
    }
  ],
    labEnvironments: [
    {
      id: 'rbac-lab',
      name: 'RBAC 访问控制实验',
      description: '练习基于角色的访问控制模型配置',
      url: 'https://github.com/topics/rbac'
    }
  ]
  },
  {
    id: 'day-20', day: 20, week: 3, title: 'OAuth与SAML',
    objectives: ['理解OAuth和SAML区别', '了解OAuth流程', '掌握应用场景'],
    content: '# OAuth与SAML\n\n## OAuth 2.0\n\n### 概念\n- 授权框架（注意：不是认证协议）\n- 允许第三方应用访问用户资源\n- 不直接处理用户认证\n\n### 授权类型\n\n1. **授权码模式（Authorization Code）**\n   - 最安全，适用于Web应用\n   - 流程：用户授权→获取授权码→交换令牌\n\n2. **简化模式（Implicit）**\n   - 适用于SPA单页应用\n   - 直接返回访问令牌\n\n3. **密码模式（Password）**\n   - 适用于信任的应用\n   - 用户直接提供密码\n\n4. **客户端凭证模式（Client Credentials）**\n   - 应用间调用\n   - 不涉及用户\n\n### OAuth角色\n- **Resource Owner**：资源所有者（用户）\n- **Client**：客户端（第三方应用）\n- **Authorization Server**：授权服务器\n- **Resource Server**：资源服务器（API）\n\n## SAML 2.0\n\n### 概念\n- 安全断言标记语言\n- 基于XML的协议\n- 专注于身份认证和SSO\n\n### SAML组件\n- **Identity Provider (IdP)**：身份提供者\n- **Service Provider (SP)**：服务提供者\n- **Assertion**：断言（包含用户信息）\n\n### 适用场景\n- 企业级SSO\n- 跨组织认证\n- 安全要求高的场景\n\n## OAuth vs SAML对比\n\n| 特性 | OAuth 2.0 | SAML 2.0 |\n|------|-----------|----------|\n| 类型 | 授权框架 | 认证协议 |\n| 格式 | JSON | XML |\n| 复杂度 | 简单 | 复杂 |\n| 适用 | 互联网、移动 | 企业SSO |\n| 令牌 | JWT、随机字符串 | 断言(XML) |\n\n## OpenID Connect (OIDC)\n- 基于OAuth 2.0的认证层\n- 使用ID Token（JWT格式）\n- 现代应用首选',
    codeExample: {
      language: 'python',
      code: ` OAuth授权流程模拟\nclass OAuthServer:\n    def __init__(self):\n        self.clients = {"app1": {"secret": "secret123"}}\n        self.tokens = {}\n    \n    def get_code(self, client_id):\n        return f"code_{client_id}_{len(self.tokens)}"\n    \n    def exchange_token(self, code):\n        token = f"token_{len(self.tokens)+1}"\n        self.tokens[token] = True\n        return token\n    \n    def validate_token(self, token):\n        return token in self.tokens\n\noauth = OAuthServer()\ncode = oauth.get_code("app1")\ntoken = oauth.exchange_token(code)\nprint(f"授权码: {code}")\nprint(f"访问令牌: {token}")\nprint(f"令牌有效: {oauth.validate_token(token)}")`,
      description: '演示OAuth授权流程',
    },
    quiz: [{"id":"q20-1","question":"信息安全的三个基本要素是什么？","options":["机密性、完整性、可用性","机密性、认证性、可用性","完整性、认证性、可用性","机密性、完整性、认证性"],"correctIndex":0,"explanation":"CIA三要素：机密性、完整性、可用性。"},{"id":"q20-2","question":"以下关于OAuth与SAML的说法，哪项最准确？","options":["只涉及理论","需要理论与实践结合","已经过时","只需记忆不需理解"],"correctIndex":1,"explanation":"信息安全学习最有效的方式是理论与实践相结合。"},{"id":"q20-3","question":"信息安全事件应急响应的第一步是什么？","options":["修复漏洞","通知媒体","隔离受影响系统","重装系统"],"correctIndex":2,"explanation":"应急响应第一步是隔离受影响系统防止损害扩大。"},{"id":"q20-4","question":"以下哪项不属于信息安全管理的范畴？","options":["风险评估","安全策略制定","员工绩效评估","安全审计"],"correctIndex":2,"explanation":"员工绩效评估属于人力资源管理范畴。"},{"id":"q20-5","question":"纵深防御（Defense in Depth）的核心理念是？","options":["只依赖防火墙","多层安全控制叠加","只做边界防护","依赖单一安全产品"],"correctIndex":1,"explanation":"纵深防御通过多层安全控制的叠加保护信息系统。"}],
    expertNotes: dayExpertNotes[15],
    recommendedTools: [
    {
      id: 'active-directory',
      name: 'Active Directory',
      description: 'Windows域环境访问控制系统',
      url: 'https://learn.microsoft.com/windows-server/identity/ad-ds/'
    },
    {
      id: 'keycloak',
      name: 'Keycloak',
      description: '开源身份认证与授权管理系统',
      url: 'https://www.keycloak.org/'
    }
  ],
    labEnvironments: [
    {
      id: 'rbac-lab',
      name: 'RBAC 访问控制实验',
      description: '练习基于角色的访问控制模型配置',
      url: 'https://github.com/topics/rbac'
    }
  ]
  },
  {
    id: 'day-21', day: 21, week: 3, title: '第三周总结与测验',
    objectives: ['回顾第三周知识点', '检验学习成果', '为第四周做准备'],
    content: '# 第三周学习总结\n\n## 本周学习内容\n\n### Day 15: 身份认证基础\n- 认证因素：知识、持有、生物\n- 单因素 vs 多因素\n\n### Day 16: 密码认证技术\n- 密码安全原则\n- 密码哈希存储\n- 盐值作用\n\n### Day 17: 生物识别技术\n- 生理特征 vs 行为特征\n- 优缺点分析\n\n### Day 18: 多因素认证MFA\n- TOTP/HOTP算法\n- 常见MFA形式\n\n### Day 19: 单点登录SSO\n- SSO概念和优缺点\n- SAML、OAuth、OIDC\n\n### Day 20: OAuth与SAML\n- OAuth授权框架\n- SAML认证协议\n- 对比和应用场景\n\n## 知识要点\n\n| 技术 | 核心概念 |\n|------|----------|\n| 密码存储 | 加盐哈希 |\n| TOTP | 30秒+HMAC-SHA1 |\n| SAML | XML/企业SSO |\n| OAuth | JSON/授权框架 |\n| OIDC | OAuth之上的认证层 |\n\n## 下周预告\n\n第四周将学习安全运营：\n- 安全运营中心(SOC)\n- 日志管理\n- 事件响应\n- 安全监控',
    quiz: [{"id":"q21-1","question":"信息安全的三个基本要素是什么？","options":["机密性、完整性、可用性","机密性、认证性、可用性","完整性、认证性、可用性","机密性、完整性、认证性"],"correctIndex":0,"explanation":"CIA三要素：机密性、完整性、可用性。"},{"id":"q21-2","question":"以下关于第三周总结与测验的说法，哪项最准确？","options":["只涉及理论","需要理论与实践结合","已经过时","只需记忆不需理解"],"correctIndex":1,"explanation":"信息安全学习最有效的方式是理论与实践相结合。"},{"id":"q21-3","question":"信息安全事件应急响应的第一步是什么？","options":["修复漏洞","通知媒体","隔离受影响系统","重装系统"],"correctIndex":2,"explanation":"应急响应第一步是隔离受影响系统防止损害扩大。"},{"id":"q21-4","question":"以下哪项不属于信息安全管理的范畴？","options":["风险评估","安全策略制定","员工绩效评估","安全审计"],"correctIndex":2,"explanation":"员工绩效评估属于人力资源管理范畴。"},{"id":"q21-5","question":"纵深防御（Defense in Depth）的核心理念是？","options":["只依赖防火墙","多层安全控制叠加","只做边界防护","依赖单一安全产品"],"correctIndex":1,"explanation":"纵深防御通过多层安全控制的叠加保护信息系统。"}],
    expertNotes: dayExpertNotes[15],
    recommendedTools: [
    {
      id: 'active-directory',
      name: 'Active Directory',
      description: 'Windows域环境访问控制系统',
      url: 'https://learn.microsoft.com/windows-server/identity/ad-ds/'
    },
    {
      id: 'keycloak',
      name: 'Keycloak',
      description: '开源身份认证与授权管理系统',
      url: 'https://www.keycloak.org/'
    }
  ],
    labEnvironments: [
    {
      id: 'rbac-lab',
      name: 'RBAC 访问控制实验',
      description: '练习基于角色的访问控制模型配置',
      url: 'https://github.com/topics/rbac'
    }
  ]
  },
  // ========== Week 4: 安全运营 ==========
  {
    id: 'day-22', day: 22, week: 4, title: '安全运营概述',
    objectives: ['理解安全运营概念', '了解SOC职能', '掌握运营流程'],
    content: '# 安全运营概述\n\n## 安全运营概念\n\n安全运营是指通过持续监控、检测、响应和改进来维护组织信息安全的活动。\n\n## SOC（安全运营中心）\n\n### SOC职能\n1. **实时监控**：7x24小时监控安全状态\n2. **威胁检测**：发现和识别安全威胁\n3. **事件响应**：快速响应安全事件\n4. **威胁情报**：收集和分析威胁情报\n5. **漏洞管理**：跟踪和修复漏洞\n6. **合规报告**：满足合规要求\n\n### SOC组成角色\n- **L1分析师**：监控告警、初步分析\n- **L2分析师**：深入调查、事件处置\n- **L3专家**：威胁狩猎、高级分析\n- **威胁情报分析师**：情报收集和分析\n- **SOC经理**：团队管理和协调\n\n## 安全运营流程\n\n### 1. 监控\n- 收集日志和告警\n- 关联分析多源数据\n- 识别异常行为\n\n### 2. 检测\n- 分析告警\n- 识别真阳性\n- 确定威胁类型\n\n### 3. 响应\n- 遏制攻击\n- 清除威胁\n- 恢复系统\n\n### 4. 报告\n- 事件报告\n- 改进建议\n\n### 5. 改进\n- 优化检测规则\n- 加固系统\n- 改进流程\n\n## 安全运营成熟度模型\n\n| 级别 | 描述 |\n|------|------|\n| 初始级 | 无正式流程，被动响应 |\n| 可重复级 | 基本流程和工具 |\n| 已定义级 | 完善流程和培训 |\n| 可管理级 | 度量和改进 |\n| 持续优化级 | 自动化和持续改进 |',
    codeExample: {
      language: 'python',
      code: ` 安全事件分类\ndef classify_event(severity, type):\n    levels = {1: "低", 2: "中", 3: "高", 4: "严重"}\n    event_types = {\n        "malware": "恶意软件",\n        "phishing": "钓鱼攻击",\n        "intrusion": "入侵尝试",\n        "data_leak": "数据泄露"\n    }\n    return levels.get(severity, "未知"), event_types.get(type, "其他")\n\n# 模拟事件\nevents = [\n    (3, "phishing"),\n    (4, "data_leak"),\n    (2, "intrusion"),\n]\nfor sev, typ in events:\n    level, name = classify_event(sev, typ)\n    print(f"事件: {name} | 级别: {level}")`,
      description: '演示安全事件分类',
    },
    quiz: [{"id":"q22-1","question":"SOC的全称是什么？","options":["System Operation Center","Security Operations Center","Server Operations Console","Security Online Check"],"correctIndex":1,"explanation":"SOC是Security Operations Center的缩写。"},{"id":"q22-2","question":"应急响应PDCERF模型中，第一步是？","options":["根除（Eradication）","检测（Detection）","准备（Preparation）","恢复（Recovery）"],"correctIndex":2,"explanation":"PDCERF：准备->检测->抑制->根除->恢复->跟踪。"},{"id":"q22-3","question":"SIEM系统的主要功能不包括？","options":["日志收集和分析","安全事件关联分析","发送营销邮件","告警和报表"],"correctIndex":2,"explanation":"SIEM不负责发送营销邮件。"},{"id":"q22-4","question":"安全事件中，事件和事故的区别是？","options":["完全相同","事件是可观测现象，事故是已造成损害的事件","事件比事故严重","没有区别"],"correctIndex":1,"explanation":"事件是可能影响安全的现象，事故是已造成实际损害的安全事件。"},{"id":"q22-5","question":"应急响应中保留证据的正确顺序是？","options":["先关机保存硬盘","先保留内存镜像再保留磁盘镜像","直接格式化系统","只保留日志文件"],"correctIndex":1,"explanation":"应首先保留易失性证据（内存），再保留非易失性证据（磁盘）。"}],
    expertNotes: dayExpertNotes[22],
    recommendedTools: [
    {
      id: 'splunk',
      name: 'Splunk',
      description: '企业级日志分析与SIEM平台',
      url: 'https://www.splunk.com/'
    },
    {
      id: 'elk',
      name: 'ELK Stack',
      description: 'Elasticsearch + Logstash + Kibana 日志分析栈',
      url: 'https://www.elastic.co/elastic-stack'
    },
    {
      id: 'suricata',
      name: 'Suricata',
      description: '开源入侵检测/防御系统',
      url: 'https://suricata.io/'
    }
  ],
    labEnvironments: [
    {
      id: 'siem-lab',
      name: 'SIEM 日志分析实验',
      description: '企业安全运营中心SOC模拟环境',
      url: 'https://github.com/splunk/attack_data'
    }
  ]
  },
  {
    id: 'day-23', day: 23, week: 4, title: '日志管理',
    objectives: ['理解日志重要性', '了解日志类型', '掌握日志分析方法'],
    content: '# 日志管理\n\n## 日志的重要性\n\n- **事件检测**：发现异常活动\n- **事件调查**：追溯攻击路径\n- **合规要求**：满足审计要求\n- **故障诊断**：排查系统问题\n- **性能优化**：分析系统性能\n\n## 日志类型\n\n### 系统日志\n- 操作系统日志（Windows Event、Linux syslog）\n- 服务启动/停止\n- 登录/登出事件\n\n### 安全日志\n- 防火墙日志\n- IDS/IPS日志\n- 认证日志\n- VPN日志\n\n### 应用日志\n- Web服务器（Apache、Nginx）\n- 应用程序日志\n- 数据库日志\n\n### 网络日志\n- DNS查询日志\n- DHCP日志\n- NetFlow/流量日志\n\n## 日志收集\n\n### Syslog协议\n- 标准日志协议\n- 设施（Facility）：日志来源\n- 严重级别（Severity）：紧急到调试\n\n### 集中日志系统\n- ELK Stack：Elasticsearch、Logstash、Kibana\n- Splunk\n- Graylog\n\n## 日志分析方法\n\n### 1. 基线分析\n- 建立正常行为基线\n- 识别偏离基线的活动\n\n### 2. 关联分析\n- 跨多源数据关联\n- 识别攻击链\n\n### 3. 异常检测\n- 统计方法\n- 机器学习\n\n## 日志留存要求\n\n- **网络安全法**：不少于6个月\n- **等级保护**：3-6个月\n- **PCI DSS**：至少1年\n\n## 日志安全\n\n- 日志完整性保护\n- 防止日志篡改\n- 加密传输和存储\n- 访问控制',
    codeExample: {
      language: 'python',
      code: ` 日志分析示例\nimport re\nfrom collections import Counter\n\ndef analyze_access_log(log_lines):\n    ips = []\n    status_codes = []\n    for line in log_lines:\n        # 简单解析Apache日志\n        match = re.match(r"(\\S+).*\\s(\\d{3})\\s\\d+", line)\n        if match:\n            ips.append(match.group(1))\n            status_codes.append(int(match.group(2)))\n    \n    # 统计\n    ip_counts = Counter(ips).most_common(5)\n    status_counts = Counter(status_codes)\n    return ip_counts, status_counts\n\n# 模拟日志\nlogs = [\n    "192.168.1.1 - - GET /page HTTP/1.1 200 1234",\n    "192.168.1.1 - - GET /admin HTTP/1.1 401 123",\n    "192.168.1.2 - - GET /page HTTP/1.1 200 1234",\n    "192.168.1.1 - - GET /admin HTTP/1.1 401 123",\n]\nips, statuses = analyze_access_log(logs)\nprint(f"TOP IP: {ips}")\nprint(f"状态码: {dict(statuses)}")`,
      description: '演示日志分析',
    },
    quiz: [{"id":"q23-1","question":"SOC的全称是什么？","options":["System Operation Center","Security Operations Center","Server Operations Console","Security Online Check"],"correctIndex":1,"explanation":"SOC是Security Operations Center的缩写。"},{"id":"q23-2","question":"应急响应PDCERF模型中，第一步是？","options":["根除（Eradication）","检测（Detection）","准备（Preparation）","恢复（Recovery）"],"correctIndex":2,"explanation":"PDCERF：准备->检测->抑制->根除->恢复->跟踪。"},{"id":"q23-3","question":"SIEM系统的主要功能不包括？","options":["日志收集和分析","安全事件关联分析","发送营销邮件","告警和报表"],"correctIndex":2,"explanation":"SIEM不负责发送营销邮件。"},{"id":"q23-4","question":"安全事件中，事件和事故的区别是？","options":["完全相同","事件是可观测现象，事故是已造成损害的事件","事件比事故严重","没有区别"],"correctIndex":1,"explanation":"事件是可能影响安全的现象，事故是已造成实际损害的安全事件。"},{"id":"q23-5","question":"应急响应中保留证据的正确顺序是？","options":["先关机保存硬盘","先保留内存镜像再保留磁盘镜像","直接格式化系统","只保留日志文件"],"correctIndex":1,"explanation":"应首先保留易失性证据（内存），再保留非易失性证据（磁盘）。"}],
    expertNotes: [{"author":"张伟","title":"安全架构设计思考","content":"CISP考试中安全架构部分的重点是理解纵深防御（Defense in Depth）原则。不要只依赖单一安全措施——好的安全架构就像洋葱，一层层包裹。实际工作中，建议每个项目都从威胁建模开始，用STRIDE方法论系统梳理风险点。","url":"https://www.freebuf.com/articles/es/267825.html"},{"author":"李明","title":"安全运维实战心得","content":"很多人在安全运维中忽略了日志管理——这恰恰是溯源和取证的关键。建议建立集中日志平台（如ELK/Splunk），设置关键告警规则，并定期进行日志审计演练。SOC建设的第一步永远是日志标准化。","url":"https://www.anquanke.com/post/id/243567.html"},{"author":"王芳","title":"安全管理体系建设","content":"信息安全管理不是技术人员的专属责任——它是全员参与的系统工程。PDCA循环是信息安全管理的核心框架。建议从建立资产清单开始——连自己有什么都不知道就没法保护。安全是持续改进的过程。","url":"https://www.freebuf.com/articles/es/278934.html"}],
    recommendedTools: [
    {
      id: 'splunk',
      name: 'Splunk',
      description: '企业级日志分析与SIEM平台',
      url: 'https://www.splunk.com/'
    },
    {
      id: 'elk',
      name: 'ELK Stack',
      description: 'Elasticsearch + Logstash + Kibana 日志分析栈',
      url: 'https://www.elastic.co/elastic-stack'
    },
    {
      id: 'suricata',
      name: 'Suricata',
      description: '开源入侵检测/防御系统',
      url: 'https://suricata.io/'
    }
  ],
    labEnvironments: [
    {
      id: 'siem-lab',
      name: 'SIEM 日志分析实验',
      description: '企业安全运营中心SOC模拟环境',
      url: 'https://github.com/splunk/attack_data'
    }
  ]
  },
  {
    id: 'day-24', day: 24, week: 4, title: '安全监控',
    objectives: ['理解安全监控原理', '了解监控类型', '掌握告警管理'],
    content: '# 安全监控\n\n## 安全监控概念\n\n安全监控是通过技术手段持续监视系统和网络活动，发现安全威胁的过程。\n\n## 监控类型\n\n### 1. 网络监控\n- 流量监控\n- 异常流量检测\n- DDoS攻击检测\n\n### 2. 主机监控\n- 文件完整性监控\n- 进程监控\n- 注册表监控\n\n### 3. 应用监控\n- 登录失败监控\n- API异常调用\n- 权限提升检测\n\n### 4. 数据监控\n- 数据访问异常\n- 大量数据导出\n- 敏感数据访问\n\n## IDS/IPS\n\n### IDS（入侵检测系统）\n- 检测攻击\n- 产生告警\n- 不阻断流量\n- 监控模式：旁路\n\n### IPS（入侵防御系统）\n- 检测并阻断攻击\n- 主动防御\n- 串接部署\n\n### 检测方法\n1. **特征匹配**：已知攻击特征库\n2. **异常检测**：偏离正常基线\n3. **协议分析**：协议异常检测\n\n## SIEM系统\n\n### SIEM（安全信息和事件管理）\n- 收集多源日志\n- 关联分析\n- 统一告警\n- 合规报告\n\n### 主要功能\n- 日志聚合\n- 关联规则\n- 告警管理\n- 仪表板\n- 报告生成\n\n## 告警管理\n\n### 告警处理流程\n1. **接收告警**\n2. **初步分析**\n3. **确认/误报**\n4. **升级/处置**\n5. **关闭/记录**\n\n### 告警优化\n- 减少误报\n- 调整阈值\n- 关联告警\n- 优先级排序',
    codeExample: {
      language: 'python',
      code: ` 简单入侵检测\ndef detect_intrusion(events):\n    alerts = []\n    failed_login_count = 0\n    \n    for event in events:\n        if event["type"] == "login" and event["status"] == "fail":\n            failed_login_count += 1\n    \n    if failed_login_count >= 5:\n        alerts.append({\n            "level": "HIGH",\n            "msg": f"检测到暴力破解: {failed_login_count}次失败登录"\n        })\n    \n    return alerts\n\n# 模拟事件\nevents = [\n    {"type": "login", "status": "fail"},\n    {"type": "login", "status": "fail"},\n    {"type": "login", "status": "fail"},\n    {"type": "login", "status": "fail"},\n    {"type": "login", "status": "fail"},\n]\n\nalerts = detect_intrusion(events)\nfor alert in alerts:\n    print(f"[{alert['level']}] {alert['msg']}")`,
      description: '演示简单入侵检测',
    },
    quiz: [{"id":"q24-1","question":"信息安全的三个基本要素是什么？","options":["机密性、完整性、可用性","机密性、认证性、可用性","完整性、认证性、可用性","机密性、完整性、认证性"],"correctIndex":0,"explanation":"CIA三要素：机密性、完整性、可用性。"},{"id":"q24-2","question":"以下关于安全监控的说法，哪项最准确？","options":["只涉及理论","需要理论与实践结合","已经过时","只需记忆不需理解"],"correctIndex":1,"explanation":"信息安全学习最有效的方式是理论与实践相结合。"},{"id":"q24-3","question":"信息安全事件应急响应的第一步是什么？","options":["修复漏洞","通知媒体","隔离受影响系统","重装系统"],"correctIndex":2,"explanation":"应急响应第一步是隔离受影响系统防止损害扩大。"},{"id":"q24-4","question":"以下哪项不属于信息安全管理的范畴？","options":["风险评估","安全策略制定","员工绩效评估","安全审计"],"correctIndex":2,"explanation":"员工绩效评估属于人力资源管理范畴。"},{"id":"q24-5","question":"纵深防御（Defense in Depth）的核心理念是？","options":["只依赖防火墙","多层安全控制叠加","只做边界防护","依赖单一安全产品"],"correctIndex":1,"explanation":"纵深防御通过多层安全控制的叠加保护信息系统。"}],
    expertNotes: [{"author":"张伟","title":"安全架构设计思考","content":"CISP考试中安全架构部分的重点是理解纵深防御（Defense in Depth）原则。不要只依赖单一安全措施——好的安全架构就像洋葱，一层层包裹。实际工作中，建议每个项目都从威胁建模开始，用STRIDE方法论系统梳理风险点。","url":"https://www.freebuf.com/articles/es/267825.html"},{"author":"李明","title":"安全运维实战心得","content":"很多人在安全运维中忽略了日志管理——这恰恰是溯源和取证的关键。建议建立集中日志平台（如ELK/Splunk），设置关键告警规则，并定期进行日志审计演练。SOC建设的第一步永远是日志标准化。","url":"https://www.anquanke.com/post/id/243567.html"},{"author":"王芳","title":"安全管理体系建设","content":"信息安全管理不是技术人员的专属责任——它是全员参与的系统工程。PDCA循环是信息安全管理的核心框架。建议从建立资产清单开始——连自己有什么都不知道就没法保护。安全是持续改进的过程。","url":"https://www.freebuf.com/articles/es/278934.html"}],
    recommendedTools: [
    {
      id: 'splunk',
      name: 'Splunk',
      description: '企业级日志分析与SIEM平台',
      url: 'https://www.splunk.com/'
    },
    {
      id: 'elk',
      name: 'ELK Stack',
      description: 'Elasticsearch + Logstash + Kibana 日志分析栈',
      url: 'https://www.elastic.co/elastic-stack'
    },
    {
      id: 'suricata',
      name: 'Suricata',
      description: '开源入侵检测/防御系统',
      url: 'https://suricata.io/'
    }
  ],
    labEnvironments: [
    {
      id: 'siem-lab',
      name: 'SIEM 日志分析实验',
      description: '企业安全运营中心SOC模拟环境',
      url: 'https://github.com/splunk/attack_data'
    }
  ]
  },
  {
    id: 'day-25', day: 25, week: 4, title: '事件响应流程',
    objectives: ['理解事件响应概念', '了解响应流程阶段', '掌握处置方法'],
    content: '# 事件响应流程\n\n## 什么是事件响应\n\n事件响应是安全事件发生后，组织采取的应对措施，目的是最小化损失、恢复正常运营。\n\n## 事件响应生命周期\n\n### 1. 准备（Preparation）\n- 建立响应团队\n- 制定响应计划\n- 准备工具和资源\n- 定期演练\n\n### 2. 检测（Detection）\n- 监控告警\n- 分析异常\n- 确认事件\n\n### 3. 遏制（Containment）\n- 短期遏制：隔离受影响系统\n- 长期遏制：加固系统防止扩散\n- 目标：阻止攻击扩散\n\n### 4. 根除（Eradication）\n- 清除恶意软件\n- 修复漏洞\n- 删除未授权账户\n\n### 5. 恢复（Recovery）\n- 恢复系统和数据\n- 验证系统完整性\n- 逐步恢复服务\n- 监控异常活动\n\n### 6. 总结（Lessons Learned）\n- 事件复盘\n- 改进建议\n- 更新策略\n- 培训改进\n\n## 事件分类\n\n| 类型 | 示例 | 优先级 |\n|------|------|--------|\n| 数据泄露 | 数据库被拖库 | P0 |\n| 勒索软件 | 系统被加密 | P0 |\n| 系统入侵 | 服务器被入侵 | P1 |\n| DDoS攻击 | 服务不可用 | P1 |\n| 钓鱼邮件 | 内部钓鱼 | P2 |\n\n## 响应团队（CSIRT）\n\n- **安全团队**：事件分析和处置\n- **IT团队**：系统恢复\n- **法务团队**：法律合规\n- **公关团队**：对外沟通\n- **管理层**：决策支持\n\n## 证据处理\n\n- 证据保护：不修改原始数据\n- 证据记录：链状记录\n- 证据保存：安全存储\n- 法律要求：符合法规',
    codeExample: {
      language: 'python',
      code: ` 事件响应状态机\nclass IncidentResponder:\n    def __init__(self):\n        self.stage = "初始状态"\n    \n    def next_stage(self):\n        stages = ["检测", "遏制", "根除", "恢复", "总结"]\n        if self.stage == "初始状态":\n            self.stage = stages[0]\n        elif self.stage in stages[:-1]:\n            self.stage = stages[stages.index(self.stage) + 1]\n        return self.stage\n    \n    def handle_event(self, event_type):\n        actions = {\n            "malware": ["隔离主机", "清除恶意软件", "更新防病毒"],\n            "phishing": ["隔离邮件", "通知用户", "更新规则"],\n            "data_leak": ["隔离系统", "溯源分析", "通知合规"]\n        }\n        return actions.get(event_type, ["分析事件", "采取措施"])\n\nir = IncidentResponder()\nprint("事件响应流程:")\nfor _ in range(5):\n    print(f" -> {ir.next_stage()}")\nprint(f"\\n勒索软件处置: {ir.handle_event('malware')}")`,
      description: '演示事件响应流程',
    },
    quiz: [{"id":"q25-1","question":"SOC的全称是什么？","options":["System Operation Center","Security Operations Center","Server Operations Console","Security Online Check"],"correctIndex":1,"explanation":"SOC是Security Operations Center的缩写。"},{"id":"q25-2","question":"应急响应PDCERF模型中，第一步是？","options":["根除（Eradication）","检测（Detection）","准备（Preparation）","恢复（Recovery）"],"correctIndex":2,"explanation":"PDCERF：准备->检测->抑制->根除->恢复->跟踪。"},{"id":"q25-3","question":"SIEM系统的主要功能不包括？","options":["日志收集和分析","安全事件关联分析","发送营销邮件","告警和报表"],"correctIndex":2,"explanation":"SIEM不负责发送营销邮件。"},{"id":"q25-4","question":"安全事件中，事件和事故的区别是？","options":["完全相同","事件是可观测现象，事故是已造成损害的事件","事件比事故严重","没有区别"],"correctIndex":1,"explanation":"事件是可能影响安全的现象，事故是已造成实际损害的安全事件。"},{"id":"q25-5","question":"应急响应中保留证据的正确顺序是？","options":["先关机保存硬盘","先保留内存镜像再保留磁盘镜像","直接格式化系统","只保留日志文件"],"correctIndex":1,"explanation":"应首先保留易失性证据（内存），再保留非易失性证据（磁盘）。"}],
    expertNotes: dayExpertNotes[22],
    recommendedTools: [
    {
      id: 'splunk',
      name: 'Splunk',
      description: '企业级日志分析与SIEM平台',
      url: 'https://www.splunk.com/'
    },
    {
      id: 'elk',
      name: 'ELK Stack',
      description: 'Elasticsearch + Logstash + Kibana 日志分析栈',
      url: 'https://www.elastic.co/elastic-stack'
    },
    {
      id: 'suricata',
      name: 'Suricata',
      description: '开源入侵检测/防御系统',
      url: 'https://suricata.io/'
    }
  ],
    labEnvironments: [
    {
      id: 'siem-lab',
      name: 'SIEM 日志分析实验',
      description: '企业安全运营中心SOC模拟环境',
      url: 'https://github.com/splunk/attack_data'
    }
  ]
  },
  {
    id: 'day-26', day: 26, week: 4, title: '应急响应',
    objectives: ['理解应急响应原则', '了解常见事件处置', '掌握恢复方法'],
    content: '# 应急响应\n\n## 应急响应原则\n\n### 1. 快速响应\n- 时间越短，损失越小\n- 快速决策，快速行动\n\n### 2. 最小影响\n- 尽量减少业务中断\n- 隔离而非停机\n\n### 3. 保护证据\n- 不修改原始系统\n- 保留攻击痕迹\n- 记录所有操作\n\n### 4. 持续沟通\n- 内部通报\n- 客户沟通\n- 监管报告\n\n## 常见安全事件处置\n\n### 1. 勒索软件\n\n#### 识别\n- 文件被加密\n- 出现勒索信息\n- 大量文件重命名\n\n#### 处置\n1. 隔离受影响系统\n2. 识别感染源\n3. 评估损失\n4. 从备份恢复\n5. 修复漏洞\n\n#### 预防\n- 定期备份（离线备份）\n- 员工培训\n- 漏洞修复\n\n### 2. Web应用入侵\n\n#### 识别\n- Web Shell发现\n- 异常登录\n- 网页被篡改\n\n#### 处置\n1. 隔离Web服务器\n2. 分析攻击向量\n3. 清除Web Shell\n4. 修复漏洞\n5. 恢复网站\n\n### 3. 数据泄露\n\n#### 识别\n- 异常数据访问\n- 大量数据导出\n- 外部举报\n\n#### 处置\n1. 阻止数据继续泄露\n2. 溯源分析\n3. 通知受影响方\n4. 合规报告\n\n## 恢复策略\n\n### 1. 从备份恢复\n- 验证备份完整性\n- 恢复到新系统\n- 不覆盖原始证据\n\n### 2. 重建系统\n- 使用可信镜像\n- 重新部署应用\n- 验证系统完整性\n\n### 3. 补偿措施\n- 临时防护措施\n- 加强监控\n- 增加日志级别',
    codeExample: {
      language: 'python',
      code: ` 应急响应决策系统\ndef get_response_actions(event_type, severity):\n    actions = {\n        "ransomware": {\n            "critical": ["立即隔离系统", "断开网络", "启动应急预案"],\n            "high": ["隔离感染主机", "检查扩散情况", "准备恢复"],\n        },\n        "web_intrusion": {\n            "high": ["下线可疑服务", "检查Web Shell", "分析访问日志"],\n        },\n        "phishing": {\n            "medium": ["隔离钓鱼邮件", "通知收件人", "更新邮件规则"],\n        }\n    }\n    return actions.get(event_type, {}).get(severity, ["分析事件", "采取适当措施"])\n\n# 测试\nprint("勒索软件(严重):")\nprint(get_response_actions("ransomware", "critical"))\nprint("\\n钓鱼邮件(中):")\nprint(get_response_actions("phishing", "medium"))`,
      description: '演示应急响应决策',
    },
    quiz: [{"id":"q26-1","question":"SOC的全称是什么？","options":["System Operation Center","Security Operations Center","Server Operations Console","Security Online Check"],"correctIndex":1,"explanation":"SOC是Security Operations Center的缩写。"},{"id":"q26-2","question":"应急响应PDCERF模型中，第一步是？","options":["根除（Eradication）","检测（Detection）","准备（Preparation）","恢复（Recovery）"],"correctIndex":2,"explanation":"PDCERF：准备->检测->抑制->根除->恢复->跟踪。"},{"id":"q26-3","question":"SIEM系统的主要功能不包括？","options":["日志收集和分析","安全事件关联分析","发送营销邮件","告警和报表"],"correctIndex":2,"explanation":"SIEM不负责发送营销邮件。"},{"id":"q26-4","question":"安全事件中，事件和事故的区别是？","options":["完全相同","事件是可观测现象，事故是已造成损害的事件","事件比事故严重","没有区别"],"correctIndex":1,"explanation":"事件是可能影响安全的现象，事故是已造成实际损害的安全事件。"},{"id":"q26-5","question":"应急响应中保留证据的正确顺序是？","options":["先关机保存硬盘","先保留内存镜像再保留磁盘镜像","直接格式化系统","只保留日志文件"],"correctIndex":1,"explanation":"应首先保留易失性证据（内存），再保留非易失性证据（磁盘）。"}],
    expertNotes: dayExpertNotes[22],
    recommendedTools: [
    {
      id: 'splunk',
      name: 'Splunk',
      description: '企业级日志分析与SIEM平台',
      url: 'https://www.splunk.com/'
    },
    {
      id: 'elk',
      name: 'ELK Stack',
      description: 'Elasticsearch + Logstash + Kibana 日志分析栈',
      url: 'https://www.elastic.co/elastic-stack'
    },
    {
      id: 'suricata',
      name: 'Suricata',
      description: '开源入侵检测/防御系统',
      url: 'https://suricata.io/'
    }
  ],
    labEnvironments: [
    {
      id: 'siem-lab',
      name: 'SIEM 日志分析实验',
      description: '企业安全运营中心SOC模拟环境',
      url: 'https://github.com/splunk/attack_data'
    }
  ]
  },
  {
    id: 'day-27', day: 27, week: 4, title: '灾难恢复',
    objectives: ['理解灾难恢复概念', '了解DR策略', '掌握BCP要点'],
    content: '# 灾难恢复\n\n## 基本概念\n\n### RTO（恢复时间目标）\n- 灾难发生后，多久恢复业务\n- 例如：4小时\n\n### RPO（恢复点目标）\n- 可接受的数据丢失时间\n- 例如：1小时\n\n### 关系\n- RTO越小，成本越高\n- RPO越小，数据丢失越少\n\n## 灾难类型\n\n### 1. 技术故障\n- 服务器故障\n- 网络中断\n- 数据中心故障\n\n### 2. 人为因素\n- 误操作\n- 恶意破坏\n- 内部攻击\n\n### 3. 自然灾难\n- 火灾、洪水\n- 地震、台风\n\n### 4. 安全事件\n- 勒索软件\n- 大规模入侵\n- DDoS攻击\n\n## 恢复策略\n\n### 1. 冷备（Cold Site）\n- 基础设施就绪\n- 需要部署和配置\n- RTO：数天\n- 成本低\n\n### 2. 温备（Warm Site）\n- 部分设备就绪\n- 数据定期同步\n- RTO：数小时\n- 成本中等\n\n### 3. 热备（Hot Site）\n- 实时数据同步\n- 随时可切换\n- RTO：数分钟\n- 成本高\n\n### 4. 多云/混合云\n- 跨云服务商\n- 高可用性\n- 灵活扩展\n\n## BCP（业务持续性计划）\n\n### BCP内容\n1. 风险评估\n2. 业务影响分析\n3. 恢复策略\n4. 应急组织\n5. 通信计划\n6. 测试和演练\n\n### 关键指标\n- MTBF（平均故障间隔）\n- MTTR（平均修复时间）\n\n## 备份策略\n\n### 备份类型\n1. **完全备份**：备份所有数据\n2. **增量备份**：备份自上次备份后的变化\n3. **差异备份**：备份自上次完全备份后的变化\n\n### 3-2-1原则\n- **3**份副本\n- **2**种介质\n- **1**份异地',
    codeExample: {
      language: 'python',
      code: ` RTO/RPO评估示例\ndef evaluate_dr_strategy(rto_hours, rpo_hours, budget):\n    if rto_hours <= 1 and rpo_hours <= 1:\n        level = "热备"\n    elif rto_hours <= 4 and rpo_hours <= 4:\n        level = "温备"\n    else:\n        level = "冷备"\n    \n    recommendations = {\n        "热备": ["实时数据同步", "自动故障转移", "高可用架构"],\n        "温备": ["定期数据同步", "手动/半自动切换", "快速部署能力"],\n        "冷备": ["定期备份", "详细部署文档", "演练计划"]\n    }\n    return level, recommendations[level]\n\n# 评估\nlevel, recs = evaluate_dr_strategy(rto_hours=2, rpo_hours=2, budget=100000)\nprint(f"策略级别: {level}")\nprint(f"建议措施: {', '.join(recs)}")`,
      description: '演示DR策略评估',
    },
    quiz: [{"id":"q27-1","question":"信息安全的三个基本要素是什么？","options":["机密性、完整性、可用性","机密性、认证性、可用性","完整性、认证性、可用性","机密性、完整性、认证性"],"correctIndex":0,"explanation":"CIA三要素：机密性、完整性、可用性。"},{"id":"q27-2","question":"以下关于灾难恢复的说法，哪项最准确？","options":["只涉及理论","需要理论与实践结合","已经过时","只需记忆不需理解"],"correctIndex":1,"explanation":"信息安全学习最有效的方式是理论与实践相结合。"},{"id":"q27-3","question":"信息安全事件应急响应的第一步是什么？","options":["修复漏洞","通知媒体","隔离受影响系统","重装系统"],"correctIndex":2,"explanation":"应急响应第一步是隔离受影响系统防止损害扩大。"},{"id":"q27-4","question":"以下哪项不属于信息安全管理的范畴？","options":["风险评估","安全策略制定","员工绩效评估","安全审计"],"correctIndex":2,"explanation":"员工绩效评估属于人力资源管理范畴。"},{"id":"q27-5","question":"纵深防御（Defense in Depth）的核心理念是？","options":["只依赖防火墙","多层安全控制叠加","只做边界防护","依赖单一安全产品"],"correctIndex":1,"explanation":"纵深防御通过多层安全控制的叠加保护信息系统。"}],
    expertNotes: [{"author":"张伟","title":"安全架构设计思考","content":"CISP考试中安全架构部分的重点是理解纵深防御（Defense in Depth）原则。不要只依赖单一安全措施——好的安全架构就像洋葱，一层层包裹。实际工作中，建议每个项目都从威胁建模开始，用STRIDE方法论系统梳理风险点。","url":"https://www.freebuf.com/articles/es/267825.html"},{"author":"李明","title":"安全运维实战心得","content":"很多人在安全运维中忽略了日志管理——这恰恰是溯源和取证的关键。建议建立集中日志平台（如ELK/Splunk），设置关键告警规则，并定期进行日志审计演练。SOC建设的第一步永远是日志标准化。","url":"https://www.anquanke.com/post/id/243567.html"},{"author":"王芳","title":"安全管理体系建设","content":"信息安全管理不是技术人员的专属责任——它是全员参与的系统工程。PDCA循环是信息安全管理的核心框架。建议从建立资产清单开始——连自己有什么都不知道就没法保护。安全是持续改进的过程。","url":"https://www.freebuf.com/articles/es/278934.html"}],
    recommendedTools: [
    {
      id: 'splunk',
      name: 'Splunk',
      description: '企业级日志分析与SIEM平台',
      url: 'https://www.splunk.com/'
    },
    {
      id: 'elk',
      name: 'ELK Stack',
      description: 'Elasticsearch + Logstash + Kibana 日志分析栈',
      url: 'https://www.elastic.co/elastic-stack'
    },
    {
      id: 'suricata',
      name: 'Suricata',
      description: '开源入侵检测/防御系统',
      url: 'https://suricata.io/'
    }
  ],
    labEnvironments: [
    {
      id: 'siem-lab',
      name: 'SIEM 日志分析实验',
      description: '企业安全运营中心SOC模拟环境',
      url: 'https://github.com/splunk/attack_data'
    }
  ]
  },
  {
    id: 'day-28', day: 28, week: 4, title: '第四周总结与测验',
    objectives: ['回顾第四周知识点', '检验学习成果', '为第五周做准备'],
    content: '# 第四周学习总结\n\n## 本周学习内容\n\n### Day 22: 安全运营概述\n- SOC职能和组成\n- 安全运营流程\n\n### Day 23: 日志管理\n- 日志类型和收集\n- ELK Stack\n- 日志分析方法\n\n### Day 24: 安全监控\n- IDS/IPS区别\n- SIEM系统\n- 告警管理\n\n### Day 25: 事件响应流程\n- 六个阶段：准备→检测→遏制→根除→恢复→总结\n- CSIRT团队\n\n### Day 26: 应急响应\n- 常见事件处置（勒索软件、Web入侵、数据泄露）\n\n### Day 27: 灾难恢复\n- RTO/RPO\n- 冷备/温备/热备\n- 3-2-1备份原则\n\n## 知识要点\n\n| 主题 | 核心内容 |\n|------|----------|\n| SOC | 7x24监控、威胁检测、事件响应 |\n| IDS/IPS | 检测vs阻断 |\n| SIEM | 日志聚合、关联分析、统一告警 |\n| RTO | 恢复时间目标 |\n| RPO | 恢复点目标 |\n| 备份 | 3-2-1原则 |\n\n## 下周预告\n\n第五周将学习漏洞与攻击：\n- 漏洞概述\n- OWASP Top 10\n- 渗透测试\n- 漏洞管理',
    quiz: [{"id":"q28-1","question":"信息安全的三个基本要素是什么？","options":["机密性、完整性、可用性","机密性、认证性、可用性","完整性、认证性、可用性","机密性、完整性、认证性"],"correctIndex":0,"explanation":"CIA三要素：机密性、完整性、可用性。"},{"id":"q28-2","question":"以下关于第四周总结与测验的说法，哪项最准确？","options":["只涉及理论","需要理论与实践结合","已经过时","只需记忆不需理解"],"correctIndex":1,"explanation":"信息安全学习最有效的方式是理论与实践相结合。"},{"id":"q28-3","question":"信息安全事件应急响应的第一步是什么？","options":["修复漏洞","通知媒体","隔离受影响系统","重装系统"],"correctIndex":2,"explanation":"应急响应第一步是隔离受影响系统防止损害扩大。"},{"id":"q28-4","question":"以下哪项不属于信息安全管理的范畴？","options":["风险评估","安全策略制定","员工绩效评估","安全审计"],"correctIndex":2,"explanation":"员工绩效评估属于人力资源管理范畴。"},{"id":"q28-5","question":"纵深防御（Defense in Depth）的核心理念是？","options":["只依赖防火墙","多层安全控制叠加","只做边界防护","依赖单一安全产品"],"correctIndex":1,"explanation":"纵深防御通过多层安全控制的叠加保护信息系统。"}],
    expertNotes: [{"author":"张伟","title":"安全架构设计思考","content":"CISP考试中安全架构部分的重点是理解纵深防御（Defense in Depth）原则。不要只依赖单一安全措施——好的安全架构就像洋葱，一层层包裹。实际工作中，建议每个项目都从威胁建模开始，用STRIDE方法论系统梳理风险点。","url":"https://www.freebuf.com/articles/es/267825.html"},{"author":"李明","title":"安全运维实战心得","content":"很多人在安全运维中忽略了日志管理——这恰恰是溯源和取证的关键。建议建立集中日志平台（如ELK/Splunk），设置关键告警规则，并定期进行日志审计演练。SOC建设的第一步永远是日志标准化。","url":"https://www.anquanke.com/post/id/243567.html"},{"author":"王芳","title":"安全管理体系建设","content":"信息安全管理不是技术人员的专属责任——它是全员参与的系统工程。PDCA循环是信息安全管理的核心框架。建议从建立资产清单开始——连自己有什么都不知道就没法保护。安全是持续改进的过程。","url":"https://www.freebuf.com/articles/es/278934.html"}],
    recommendedTools: [
    {
      id: 'splunk',
      name: 'Splunk',
      description: '企业级日志分析与SIEM平台',
      url: 'https://www.splunk.com/'
    },
    {
      id: 'elk',
      name: 'ELK Stack',
      description: 'Elasticsearch + Logstash + Kibana 日志分析栈',
      url: 'https://www.elastic.co/elastic-stack'
    },
    {
      id: 'suricata',
      name: 'Suricata',
      description: '开源入侵检测/防御系统',
      url: 'https://suricata.io/'
    }
  ],
    labEnvironments: [
    {
      id: 'siem-lab',
      name: 'SIEM 日志分析实验',
      description: '企业安全运营中心SOC模拟环境',
      url: 'https://github.com/splunk/attack_data'
    }
  ]
  },
  // ========== Week 5: 漏洞与攻击 ==========
  {
    id: 'day-29', day: 29, week: 5, title: '漏洞概述',
    objectives: ['理解漏洞概念', '了解漏洞类型', '掌握漏洞生命周期'],
    content: '# 漏洞概述\n\n## 什么是漏洞\n\n漏洞是系统、应用或流程中存在的可能被攻击者利用的弱点。\n\n## 漏洞分类\n\n### 按类型分类\n\n#### 1. 软件漏洞\n- 缓冲区溢出\n- SQL注入\n- XSS跨站脚本\n- 认证绕过\n\n#### 2. 配置漏洞\n- 默认密码\n- 错误权限配置\n- 不必要服务开启\n\n#### 3. 设计漏洞\n- 架构缺陷\n- 逻辑错误\n- 不安全的设计决策\n\n#### 4. 人为漏洞\n- 社会工程学\n- 弱密码\n- 操作失误\n\n### 按严重程度\n\n| 级别 | CVSS | 描述 |\n|------|------|------|\n| 严重 | 9.0-10.0 | 无需交互，远程代码执行 |\n| 高危 | 7.0-8.9 | 需要一定条件的严重漏洞 |\n| 中危 | 4.0-6.9 | 有限影响的漏洞 |\n| 低危 | 0.1-3.9 | 影响较小的漏洞 |\n\n## 漏洞生命周期\n\n1. **发现**：研究人员或厂商发现漏洞\n2. **报告**：向厂商或CVE报告\n3. **验证**：厂商确认并验证\n4. **修复**：开发补丁\n5. **披露**：公开披露（负责任披露）\n6. **修复**：用户安装补丁\n\n## 漏洞数据库\n\n- **CVE**：Common Vulnerabilities and Exposures\n- **NVD**：National Vulnerability Database\n- **CNNVD**：中国国家信息安全漏洞库\n- **CNVD**：国家信息安全漏洞共享平台\n\n## 零日漏洞\n\n- 厂商未发现/未修复的漏洞\n- 攻击者可自由利用\n- 价值极高（黑市百万美元）\n- 防御困难',
    codeExample: {
      language: 'python',
      code: ` 漏洞严重程度评估\ndef calculate_severity(cvss_score):\n    if cvss_score >= 9.0:\n        return "严重", "立即修复"\n    elif cvss_score >= 7.0:\n        return "高危", "尽快修复"\n    elif cvss_score >= 4.0:\n        return "中危", "计划修复"\n    elif cvss_score > 0:\n        return "低危", "关注跟踪"\n    else:\n        return "无风险", "无需处理"\n\n# 测试漏洞\nvulns = [("CVE-2024-1234", 9.8), ("CVE-2024-5678", 6.5), ("CVE-2024-9012", 3.2)]\nfor cve, score in vulns:\n    level, action = calculate_severity(score)\n    print(f"{cve}: CVSS {score} -> {level}, {action}")`,
      description: '演示漏洞严重程度评估',
    },
    quiz: [{"id":"q29-1","question":"SQL注入漏洞的根本原因是什么？","options":["服务器性能不足","用户输入未经验证直接拼接到SQL语句","数据库版本过旧","网络延迟过高"],"correctIndex":1,"explanation":"SQL注入的根本原因是用户输入未经验证。"},{"id":"q29-2","question":"以下哪种方法可以有效防止XSS攻击？","options":["使用HTTP协议","对输出进行HTML实体编码","增加服务器内存","使用FTP传输"],"correctIndex":1,"explanation":"对输出进行HTML实体编码可以有效防止XSS攻击。"},{"id":"q29-3","question":"CSRF攻击利用的是什么？","options":["服务器漏洞","用户已登录的身份凭证","网络带宽","加密算法"],"correctIndex":1,"explanation":"CSRF利用用户已登录状态下的身份凭证发起恶意请求。"},{"id":"q29-4","question":"预防SQL注入最有效的方法是？","options":["使用WAF","使用参数化查询","关闭数据库端口","加密数据库"],"correctIndex":1,"explanation":"参数化查询是预防SQL注入最有效的方法。"},{"id":"q29-5","question":"OWASP Top 10(2021)中排名第一的风险是？","options":["XSS","SQL注入","失效的访问控制","安全配置错误"],"correctIndex":2,"explanation":"失效的访问控制在2021版排名第一。"}],
    expertNotes: [{"author":"陈婷","title":"Web安全攻防实战","content":"Web安全核心是理解HTTP协议和浏览器安全机制。建议先掌握同源策略和CORS工作原理，然后用Burp Suite实操OWASP Top 10的漏洞利用和防御。DVWA和WebGoat是很好的练习靶场。","url":"https://www.freebuf.com/articles/web/289123.html"},{"author":"刘洋","title":"API安全防护","content":"随着微服务和前后端分离的普及，API安全越来越重要。建议所有API实施OAuth 2.0/JWT认证、输入验证、响应过滤和API网关防护。OWASP API Security Top 10是很好的参考。","url":"https://www.anquanke.com/post/id/267890.html"},{"author":"黄磊","title":"安全编码规范","content":"安全要从代码层面做起。建议团队建立代码审查中的安全检查清单：输入验证、输出编码、参数化查询、权限检查。同时引入SAST工具自动化检测常见漏洞。","url":"https://www.anquanke.com/post/id/254321.html"}],
    recommendedTools: [
    {
      id: 'sqlmap',
      name: 'SQLMap',
      description: '自动化SQL注入漏洞检测工具',
      url: 'https://sqlmap.org/'
    },
    {
      id: 'burpsuite',
      name: 'Burp Suite',
      description: 'Web应用安全测试集成平台',
      url: 'https://portswigger.net/burp'
    },
    {
      id: 'metasploit',
      name: 'Metasploit',
      description: '漏洞利用框架',
      url: 'https://www.metasploit.com/'
    }
  ],
    labEnvironments: [
    {
      id: 'sqli-labs',
      name: 'SQLi-Labs',
      description: 'SQL注入漏洞练习靶场',
      url: 'https://github.com/Audi-1/sqli-labs'
    },
    {
      id: 'xss-lab',
      name: 'XSS 练习平台',
      description: '跨站脚本攻击练习环境',
      url: 'https://xss-game.appspot.com/'
    }
  ]
  },
  {
    id: 'day-30', day: 30, week: 5, title: '常见漏洞类型',
    objectives: ['了解常见漏洞', '理解漏洞原理', '掌握防范方法'],
    content: '# 常见漏洞类型\n\n## 1. 注入攻击（Injection）\n\n### SQL注入\n- 在输入中注入SQL代码\n- 读取/修改数据库\n\n### 其他注入\n- NoSQL注入\n- 命令注入\n- LDAP注入\n\n### 防范\n- 参数化查询\n- 输入验证\n- 最小权限原则\n\n## 2. 认证失败（Broken Authentication）\n\n### 问题\n- 允许暴力破解\n- 弱密码策略\n- 未保护会话令牌\n- 会话固定攻击\n\n### 防范\n- 强密码策略\n- 多因素认证\n- 安全会话管理\n- 登录速率限制\n\n## 3. 敏感数据泄露（Sensitive Data Exposure）\n\n### 问题\n- 明文存储敏感数据\n- 弱加密算法\n- 缺少传输加密\n\n### 防范\n- 加密存储\n- 使用强加密算法\n- HTTPS传输\n- 数据脱敏\n\n## 4. XML外部实体（XXE）\n\n### 问题\n- 解析恶意XML\n- 读取本地文件\n- SSRF攻击\n\n### 防范\n- 禁用DTD\n- 禁用外部实体\n\n## 5. 访问控制失败（Broken Access Control）\n\n### 问题\n- 越权访问\n- 未验证权限\n- 不安全的直接对象引用\n\n### 防范\n- 强制访问控制\n- 拒绝默认访问\n- 最小权限原则\n\n## 6. 安全配置错误（Security Misconfiguration）\n\n### 问题\n- 默认配置\n- 详细错误信息\n- 不必要的功能\n\n### 防范\n- 安全加固配置\n- 移除不必要功能\n- 定期审计配置\n\n## 7. 跨站脚本（XSS）\n\n### 类型\n- 反射型\n- 存储型\n- DOM型\n\n### 防范\n- 输入过滤\n- 输出编码\n- CSP策略',
    codeExample: {
      language: 'python',
      code: ` SQL注入检测示例\ndef detect_sql_injection(input_str):\n    dangerous = ["select", "union", "drop", "insert", "delete", "--", "/*", "*/", "'", '"']\n    lower_input = input_str.lower()\n    found = []\n    for keyword in dangerous:\n        if keyword in lower_input:\n            found.append(keyword)\n    return found\n\n# 测试\ntest_inputs = [\n    "admin\' OR \'1\'=\'1",\n    "正常用户名",\n    "1; DROP TABLE users",\n]\nfor inp in test_inputs:\n    found = detect_sql_injection(inp)\n    if found:\n        print(f"危险: {inp} -> 检测到: {found}")\n    else:\n        print(f"安全: {inp}")`,
      description: '演示SQL注入检测',
    },
    quiz: [{"id":"q30-1","question":"SQL注入漏洞的根本原因是什么？","options":["服务器性能不足","用户输入未经验证直接拼接到SQL语句","数据库版本过旧","网络延迟过高"],"correctIndex":1,"explanation":"SQL注入的根本原因是用户输入未经验证。"},{"id":"q30-2","question":"以下哪种方法可以有效防止XSS攻击？","options":["使用HTTP协议","对输出进行HTML实体编码","增加服务器内存","使用FTP传输"],"correctIndex":1,"explanation":"对输出进行HTML实体编码可以有效防止XSS攻击。"},{"id":"q30-3","question":"CSRF攻击利用的是什么？","options":["服务器漏洞","用户已登录的身份凭证","网络带宽","加密算法"],"correctIndex":1,"explanation":"CSRF利用用户已登录状态下的身份凭证发起恶意请求。"},{"id":"q30-4","question":"预防SQL注入最有效的方法是？","options":["使用WAF","使用参数化查询","关闭数据库端口","加密数据库"],"correctIndex":1,"explanation":"参数化查询是预防SQL注入最有效的方法。"},{"id":"q30-5","question":"OWASP Top 10(2021)中排名第一的风险是？","options":["XSS","SQL注入","失效的访问控制","安全配置错误"],"correctIndex":2,"explanation":"失效的访问控制在2021版排名第一。"}],
    expertNotes: [{"author":"陈婷","title":"Web安全攻防实战","content":"Web安全核心是理解HTTP协议和浏览器安全机制。建议先掌握同源策略和CORS工作原理，然后用Burp Suite实操OWASP Top 10的漏洞利用和防御。DVWA和WebGoat是很好的练习靶场。","url":"https://www.freebuf.com/articles/web/289123.html"},{"author":"刘洋","title":"API安全防护","content":"随着微服务和前后端分离的普及，API安全越来越重要。建议所有API实施OAuth 2.0/JWT认证、输入验证、响应过滤和API网关防护。OWASP API Security Top 10是很好的参考。","url":"https://www.anquanke.com/post/id/267890.html"},{"author":"黄磊","title":"安全编码规范","content":"安全要从代码层面做起。建议团队建立代码审查中的安全检查清单：输入验证、输出编码、参数化查询、权限检查。同时引入SAST工具自动化检测常见漏洞。","url":"https://www.anquanke.com/post/id/254321.html"}],
    recommendedTools: [
    {
      id: 'sqlmap',
      name: 'SQLMap',
      description: '自动化SQL注入漏洞检测工具',
      url: 'https://sqlmap.org/'
    },
    {
      id: 'burpsuite',
      name: 'Burp Suite',
      description: 'Web应用安全测试集成平台',
      url: 'https://portswigger.net/burp'
    },
    {
      id: 'metasploit',
      name: 'Metasploit',
      description: '漏洞利用框架',
      url: 'https://www.metasploit.com/'
    }
  ],
    labEnvironments: [
    {
      id: 'sqli-labs',
      name: 'SQLi-Labs',
      description: 'SQL注入漏洞练习靶场',
      url: 'https://github.com/Audi-1/sqli-labs'
    },
    {
      id: 'xss-lab',
      name: 'XSS 练习平台',
      description: '跨站脚本攻击练习环境',
      url: 'https://xss-game.appspot.com/'
    }
  ]
  },
];

// Generate remaining days (31-90) with template-based content
const weekToolMap: { [key: number]: { tools: LabTool[]; labs: LabEnvironment[] } } = {
  6: {
    tools: [
      { id: 'openssl', name: 'OpenSSL', description: '开源SSL/TLS工具包，用于证书管理和加密测试', url: 'https://www.openssl.org/' },
      { id: 'gnupg', name: 'GnuPG', description: '开源加密和数字签名工具，用于邮件和文件加密', url: 'https://www.gnupg.org/' },
      { id: 'hashcat', name: 'Hashcat', description: '高性能密码哈希破解工具，支持多种算法', url: 'https://hashcat.net/hashcat/' },
      { id: 'cyberchef', name: 'CyberChef', description: '在线加密和编码转换工具，支持多种加密算法', url: 'https://gchq.github.io/CyberChef/' },
    ],
    labs: [
      { id: 'cryptohack', name: 'CryptoHack', description: '在线密码学练习平台，从基础到高级的加密挑战', url: 'https://cryptohack.org/' },
      { id: 'crypto-lab', name: '加密实验平台', description: '模拟加密算法工作原理的交互式学习环境', url: 'https://www.cryptool.org/en/' },
      { id: 'ctf-crypto', name: '密码学CTF练习', description: '包含多种密码学挑战的CTF练习平台', url: 'https://ctflearn.com/' },
    ],
  },
  7: {
    tools: [
      { id: 'nmap', name: 'Nmap', description: '网络发现和端口扫描工具，支持多种扫描技术', url: 'https://nmap.org/' },
      { id: 'wireshark', name: 'Wireshark', description: '网络协议分析工具，支持深度数据包解析', url: 'https://www.wireshark.org/' },
      { id: 'tcpdump', name: 'tcpdump', description: '命令行网络抓包工具，用于网络流量分析', url: 'https://www.tcpdump.org/' },
      { id: 'netcat', name: 'Netcat', description: '网络瑞士军刀，支持TCP/UDP连接和数据传输', url: 'https://nmap.org/ncat/' },
      { id: 'hydra', name: 'Hydra', description: '在线密码爆破工具，支持多种协议的暴力破解', url: 'https://github.com/vanhauser-thc/thc-hydra' },
    ],
    labs: [
      { id: 'picoctf', name: 'PicoCTF', description: '入门级网络安全CTF平台，包含网络和密码学挑战', url: 'https://picoctf.org/' },
      { id: 'webgoat', name: 'WebGoat', description: 'OWASP Web安全教学应用，包含多种网络攻击场景', url: 'https://owasp.org/www-project-webgoat/' },
      { id: 'network-lab', name: '网络安全实验环境', description: '模拟真实网络环境的攻击和防御实验平台', url: 'https://www.hackthebox.com/' },
    ],
  },
  8: {
    tools: [
      { id: 'burpsuite', name: 'Burp Suite', description: 'Web应用安全测试集成平台，支持拦截和扫描', url: 'https://portswigger.net/burp' },
      { id: 'owasp-zap', name: 'OWASP ZAP', description: '开源Web应用安全扫描器，支持自动化和手动测试', url: 'https://www.zaproxy.org/' },
      { id: 'nikto', name: 'Nikto', description: 'Web服务器扫描器，检测已知漏洞和配置问题', url: 'https://cirt.net/Nikto2' },
      { id: 'dirbuster', name: 'DirBuster', description: 'Web目录爆破工具，用于发现隐藏文件和目录', url: 'https://www.owasp.org/index.php/Category:OWASP_DirBuster_Project' },
    ],
    labs: [
      { id: 'juice-shop', name: 'OWASP Juice Shop', description: '包含OWASP Top 10漏洞的现代Web应用靶场', url: 'https://owasp.org/www-project-juice-shop/' },
      { id: 'dvwa', name: 'DVWA', description: 'Damn Vulnerable Web App - 经典Web漏洞练习平台', url: 'http://www.dvwa.co.uk/' },
      { id: 'bwapp', name: 'bWAPP', description: 'buggy web application - 包含100多种Web漏洞的练习环境', url: 'https://www.itsecgames.com/' },
      { id: 'pikachu', name: 'Pikachu', description: '中文Web漏洞练习平台，适合中文学习者', url: 'https://github.com/zhuifengshaonianhanlu/pikachu' },
    ],
  },
  9: {
    tools: [
      { id: 'physical-audit', name: '物理安全评估工具', description: '用于评估物理访问控制和环境安全的检查清单', url: 'https://www.iso.org/standard/54380.html' },
      { id: 'rfid-tool', name: 'RFID克隆工具', description: 'RFID卡读写和克隆工具集，用于测试门禁系统安全', url: 'https://github.com/RfidResearchGroup/proxmark3' },
      { id: 'camera-hack', name: '监控系统测试工具', description: '用于测试视频监控系统安全性的工具集合', url: 'https://github.com/EntySec/HatSploit' },
    ],
    labs: [
      { id: 'social-engineering', name: '社会工程实验', description: '模拟社会工程攻击和防御的实训环境', url: 'https://www.social-engineer.org/' },
      { id: 'physical-security', name: '物理安全手册', description: '物理安全最佳实践指南和案例研究', url: 'https://www.cisa.gov/physical-security' },
      { id: 'red-team-lab', name: '红队物理渗透', description: '模拟真实物理渗透测试的实验环境', url: 'https://www.offensive-security.com/' },
    ],
  },
  10: {
    tools: [
      { id: 'sonarqube', name: 'SonarQube', description: '代码质量和安全审计平台，支持多种语言的静态分析', url: 'https://www.sonarqube.org/' },
      { id: 'dependency-check', name: 'OWASP Dependency-Check', description: '开源项目依赖安全扫描工具，检测已知漏洞', url: 'https://owasp.org/www-project-dependency-check/' },
      { id: 'gitguardian', name: 'GitGuardian', description: '代码仓库密钥检测工具，防止敏感信息泄露', url: 'https://www.gitguardian.com/' },
    ],
    labs: [
      { id: 'dvws', name: 'DVWS', description: 'Damn Vulnerable Web Services - 不安全的Web服务靶场', url: 'https://github.com/snoopysecurity/dvws-node' },
      { id: 'code-audit', name: '安全代码审计靶场', description: '包含多种代码安全问题的审计练习环境', url: 'https://github.com/Hardening-Code/Code-Auditing' },
      { id: 'sast-lab', name: 'SAST实验平台', description: '静态应用安全测试工具的实践和实验环境', url: 'https://semgrep.dev/' },
    ],
  },
  11: {
    tools: [
      { id: 'business-logic-scanner', name: '业务逻辑扫描工具', description: '检测Web应用业务逻辑缺陷的自动化工具', url: 'https://portswigger.net/burp/documentation/desktop/testing-workflow/business-logic' },
      { id: 'traffic-analysis', name: '流量分析工具', description: '业务流量异常检测和分析工具，识别异常交易', url: 'https://www.wireshark.org/' },
      { id: 'fraud-detection', name: '欺诈检测系统', description: '模拟业务欺诈行为检测的分析工具', url: 'https://www.kaggle.com/competitions' },
    ],
    labs: [
      { id: 'business-logic-lab', name: '业务逻辑漏洞靶场', description: '包含典型业务逻辑漏洞的模拟电商和金融应用', url: 'https://owasp.org/www-project-juice-shop/' },
      { id: 'pikachu', name: 'Pikachu 业务安全', description: '包含越权、支付漏洞等业务安全问题的练习平台', url: 'https://github.com/zhuifengshaonianhanlu/pikachu' },
      { id: 'auth-bypass', name: '认证绕过实验', description: '模拟各种身份认证和权限控制绕过的实验环境', url: 'https://www.hackthebox.com/' },
    ],
  },
  12: {
    tools: [
      { id: 'review-all', name: '核心工具复习', description: '复习前11周学习的所有核心安全工具和命令', url: 'https://nmap.org/' },
      { id: 'exam-simulator', name: '考试模拟器', description: 'CISP模拟考试系统，包含题库和答题练习', url: 'https://www.cisp-training.com/' },
      { id: 'mindmap', name: '知识思维导图', description: '信息安全知识体系思维导图，帮助梳理知识结构', url: 'https://www.mindmeister.com/' },
    ],
    labs: [
      { id: 'comprehensive-ctf', name: '综合CTF挑战', description: '融合各类安全知识的综合CTF比赛环境', url: 'https://ctftime.org/' },
      { id: 'review-lab', name: '综合靶场复习', description: '复习各类漏洞利用和防御技术的综合实验', url: 'https://www.hackthebox.com/' },
      { id: 'cert-practice', name: '认证考试练习', description: '模拟CISP认证考试的在线练习和测试平台', url: 'https://www.examtopics.com/' },
    ],
  },
};

const weekTopics = [
  { week: 6, title: '加密技术', days: ['对称加密算法', '非对称加密算法', '哈希函数', '数字签名', 'PKI体系', 'TLS/SSL协议', '第六周总结与测验'] },
  { week: 7, title: '网络安全', days: ['网络协议安全', '防火墙技术', '入侵检测系统', 'VPN技术', '无线网络安全', '网络分段', '第七周总结与测验'] },
  { week: 8, title: '应用安全', days: ['Web安全基础', 'SQL注入深入', 'XSS深入', 'CSRF攻击', '文件上传漏洞', '安全编码实践', '第八周总结与测验'] },
  { week: 9, title: '物理安全', days: ['物理安全概述', '物理访问控制', '环境安全', '数据中心安全', '容灾备份', '监控系统', '第九周总结与测验'] },
  { week: 10, title: '安全工程', days: ['安全评估概述', '风险评估方法', '威胁建模', '安全架构设计', '安全开发生命周期', '代码审计', '第十周总结与测验'] },
  { week: 11, title: '业务安全', days: ['隐私保护', '数据加密存储', '数据脱敏', '数据生命周期', '隐私合规', '数据治理', '第十一周总结与测验'] },
  { week: 12, title: '模拟考试', days: ['模拟考试一', '模拟考试二', '错题复习', '重点串讲', '考前冲刺', '考试技巧', '结业测试'] },
];

for (let weekIdx = 0; weekIdx < weekTopics.length; weekIdx++) {
  const { week, title, days } = weekTopics[weekIdx];
  const weekResources = weekToolMap[week];
  for (let dayIdx = 0; dayIdx < days.length; dayIdx++) {
    const dayNum = (week - 1) * 7 + dayIdx + 1;
    if (dayNum <= 30) continue; // 已有内容
    const dayTitle = days[dayIdx];
    allDays.push({
      id: `day-${dayNum}`,
      day: dayNum,
      week: week,
      title: `${dayTitle}（${title}）`,
      objectives: [`学习${dayTitle}`, '理解核心概念', '掌握实践方法'],
      content: `# ${dayTitle}\n\n## 概述\n\n本节学习${title}领域的${dayTitle}。这是CISP考试的重要知识点，请认真学习。\n\n## 核心内容\n\n### 一、基本概念\n\n${dayTitle}是信息安全领域的重要主题。\n\n### 二、关键要点\n\n1. **定义和术语**：理解相关概念\n2. **原理和机制**：掌握工作原理\n3. **实践应用**：在实际场景应用\n4. **防范措施**：了解安全防护方法\n\n## 学习建议\n\n- 理解原理而非死记硬背\n- 结合实际案例学习\n- 做练习题巩固知识`,
      codeExample: {
        language: 'python',
        code: `# ${dayTitle} 学习代码\nprint("=" * 50)\nprint(f"第${dayNum}天 - ${dayTitle}")\nprint("=" * 50)\nprint("学习要点:")\nprint("1. 理解核心概念和术语")\nprint("2. 掌握基本原理和机制")\nprint("3. 了解实际应用场景")\nprint("4. 注意常见问题和误区")\nprint("5. 动手实践加深理解")`,
        description: `${dayTitle}学习代码示例`
      },
      quiz: [{"id":"q0-1","question":"信息安全的三个基本要素是什么？","options":["机密性、完整性、可用性","机密性、认证性、可用性","完整性、认证性、可用性","机密性、完整性、认证性"],"correctIndex":0,"explanation":"CIA三要素：机密性、完整性、可用性。"},{"id":"q0-2","question":"以下关于的说法，哪项最准确？","options":["只涉及理论","需要理论与实践结合","已经过时","只需记忆不需理解"],"correctIndex":1,"explanation":"信息安全学习最有效的方式是理论与实践相结合。"},{"id":"q0-3","question":"信息安全事件应急响应的第一步是什么？","options":["修复漏洞","通知媒体","隔离受影响系统","重装系统"],"correctIndex":2,"explanation":"应急响应第一步是隔离受影响系统防止损害扩大。"},{"id":"q0-4","question":"以下哪项不属于信息安全管理的范畴？","options":["风险评估","安全策略制定","员工绩效评估","安全审计"],"correctIndex":2,"explanation":"员工绩效评估属于人力资源管理范畴。"},{"id":"q0-5","question":"纵深防御（Defense in Depth）的核心理念是？","options":["只依赖防火墙","多层安全控制叠加","只做边界防护","依赖单一安全产品"],"correctIndex":1,"explanation":"纵深防御通过多层安全控制的叠加保护信息系统。"}],
      recommendedTools: weekResources ? weekResources.tools : [],
      labEnvironments: weekResources ? weekResources.labs : [],
      expertNotes: dayExpertNotes[dayNum] || [],
    });
  }
}

export const learningData: LearningDay[] = allDays;

export default learningData;