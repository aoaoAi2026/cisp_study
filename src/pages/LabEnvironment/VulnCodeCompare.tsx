import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle, Code2, Lightbulb, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../../components/UI';

interface Scenario {
  id: number;
  title: string;
  cwe: string;
  unsafe: string;
  safe: string;
  desc: string;
  why: string;
  language: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1, title: 'SQL注入', cwe: 'CWE-89', language: 'Python',
    unsafe: `# ❌ 不安全：字符串拼接SQL
user_id = request.GET.get('id')
query = "SELECT * FROM users WHERE id = " + user_id
cursor.execute(query)`,
    safe: `# ✅ 安全：参数化查询
user_id = request.GET.get('id')
query = "SELECT * FROM users WHERE id = %s"
cursor.execute(query, (user_id,))`,
    desc: '使用参数化查询防止SQL注入',
    why: '参数化查询将SQL结构与数据分离，数据库将输入视为数据而非SQL代码，从根本上杜绝了注入。',
  },
  {
    id: 2, title: 'XSS攻击', cwe: 'CWE-79', language: 'JavaScript',
    unsafe: `// ❌ 不安全：直接拼接HTML
element.innerHTML = userComment;
// 用户输入 <img src=x onerror=alert(1)> 将执行`,
    safe: `// ✅ 安全方案1：使用textContent
element.textContent = userComment;

// ✅ 安全方案2：使用DOMPurify白名单过滤
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userComment);`,
    desc: '使用textContent或HTML净化库防止XSS',
    why: 'innerHTML会解析HTML标签和事件处理器，textContent将所有内容视为纯文本。DOMPurify使用白名单允许安全标签。',
  },
  {
    id: 3, title: '命令注入', cwe: 'CWE-77', language: 'Python',
    unsafe: `# ❌ 不安全：shell=True拼接命令
host = request.GET.get('host')
os.system("ping " + host)
# 输入: 127.0.0.1; rm -rf /`,
    safe: `# ✅ 安全：参数列表方式，禁用shell
import subprocess
host = request.GET.get('host')
# 验证输入是否为合法IP/域名
if re.match(r'^[a-zA-Z0-9.-]+$', host):
    subprocess.run(["ping", "-c", "4", host], shell=False)`,
    desc: '使用参数列表替代字符串拼接，禁用shell模式',
    why: 'shell=True时将命令字符串传递给shell解析，攻击者可注入命令分隔符(;|&&)。shell=False时直接调用可执行文件，参数不经过shell。',
  },
  {
    id: 4, title: '不安全的反序列化', cwe: 'CWE-502', language: 'Python',
    unsafe: `# ❌ 不安全：pickle可执行任意代码
import pickle
data = request.get_data()
obj = pickle.loads(data)
# 恶意pickle数据可执行系统命令`,
    safe: `# ✅ 安全：使用JSON等安全格式
import json
data = request.get_data()
try:
    obj = json.loads(data)
except json.JSONDecodeError:
    return {"error": "invalid data"}`,
    desc: '避免使用pickle等不安全反序列化，使用JSON',
    why: 'pickle在反序列化时会执行对象的__reduce__方法，攻击者可构造恶意序列化数据导致RCE。JSON只支持基本数据类型。',
  },
  {
    id: 5, title: '路径遍历', cwe: 'CWE-22', language: 'Python',
    unsafe: `# ❌ 不安全：直接拼接路径
filename = request.GET.get('file')
with open("/var/www/files/" + filename) as f:
    return f.read()
# 输入: ../../../etc/passwd`,
    safe: `# ✅ 安全：规范化路径并验证前缀
import os
filename = request.GET.get('file')
base_dir = os.path.realpath("/var/www/files/")
safe_path = os.path.realpath(os.path.join(base_dir, filename))
if not safe_path.startswith(base_dir):
    raise Exception("Path traversal detected!")
with open(safe_path) as f:
    return f.read()`,
    desc: '使用os.path.realpath规范化路径并验证路径前缀',
    why: 'realpath将../解析为实际路径，再检查是否仍在允许目录内。绝不要信任用户输入的文件路径。',
  },
  {
    id: 6, title: '硬编码密钥', cwe: 'CWE-798', language: 'Python',
    unsafe: `# ❌ 不安全：密钥写在代码中
API_KEY = "sk-abc123def456ghijk"
DB_PASSWORD = "MyS3cret!2024"
JWT_SECRET = "super-secret-key-123"
# Git提交 → 密钥泄露 → 安全事故`,
    safe: `# ✅ 安全：环境变量 + 密钥管理
import os
from cryptography.fernet import Fernet

API_KEY = os.environ.get("API_KEY")
DB_PASSWORD = os.environ.get("DB_PASSWORD")
JWT_SECRET = os.environ.get("JWT_SECRET")

# 或使用密钥管理服务(AWS KMS/Azure Key Vault)`,
    desc: '使用环境变量或密钥管理服务存储敏感信息',
    why: '代码中硬编码的密钥会随Git仓库泄露。使用环境变量将配置与代码分离，定期轮换密钥。',
  },
  {
    id: 7, title: '弱加密算法', cwe: 'CWE-327', language: 'Python',
    unsafe: `# ❌ 不安全：弱加密算法
import hashlib, md5
from Crypto.Cipher import DES

# MD5已可碰撞，不适合密码存储
password_hash = hashlib.md5(password.encode()).hexdigest()

# DES密钥56位，可暴力破解
cipher = DES.new(key, DES.MODE_ECB)
encrypted = cipher.encrypt(data)`,
    safe: `# ✅ 安全：现代加密算法
import hashlib, os
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2

# 密码哈希：加盐 + 迭代
salt = os.urandom(16)
hashed = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 600000)

# 对称加密：AES-256-GCM（认证加密）
from Crypto.Cipher import AES
nonce = os.urandom(16)
cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)`,
    desc: '使用SHA256+PBKDF2和AES-GCM替代MD5和DES',
    why: 'MD5可被碰撞攻击破解，DES密钥太短。SHA256+盐值+PBDKF2增加破解难度，AES-GCM提供认证加密防篡改。',
  },
  {
    id: 8, title: '无速率限制', cwe: 'CWE-307', language: 'Python',
    unsafe: `# ❌ 不安全：无限尝试登录
@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    # 攻击者可用工具每秒发送数千次请求
    return check_credentials(username, password)`,
    safe: `# ✅ 安全：速率限制 + 账号锁定
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(app, key_func=get_remote_address)

@app.route('/login', methods=['POST'])
@limiter.limit("5 per minute")  # 每分钟5次
def login():
    username = request.form['username']
    password = request.form['password']
    
    # 检查失败次数
    if get_failed_attempts(username) >= 5:
        return "Account locked, try again later", 429
        
    if check_credentials(username, password):
        reset_failed_attempts(username)
        return "Success"
    else:
        increment_failed_attempts(username)
        return "Invalid credentials", 401`,
    desc: '添加速率限制和账号锁定机制防止暴力破解',
    why: '暴力破解依赖大量尝试。速率限制(如5次/分钟)和账号锁定(5次失败后锁定)可有效阻止此类攻击。',
  },
  {
    id: 9, title: 'SSRF攻击', cwe: 'CWE-918', language: 'Python',
    unsafe: `# ❌ 不安全：允许访问任意URL
url = request.GET.get('url')
response = requests.get(url)
# 输入: http://169.254.169.254/metadata → 云元数据泄露`,
    safe: `# ✅ 安全：URL白名单 + 内网IP黑名单
import requests, socket, ipaddress
from urllib.parse import urlparse

def is_internal_ip(hostname):
    ip = socket.gethostbyname(hostname)
    return ipaddress.ip_address(ip).is_private

url = request.GET.get('url')
hostname = urlparse(url).hostname

# 1. 域名白名单
ALLOWED = ['api.example.com', 'cdn.example.com']
if hostname not in ALLOWED:
    return "Domain not allowed", 403

# 2. 禁止访问内网IP
if is_internal_ip(hostname):
    return "Internal IP forbidden", 403

response = requests.get(url, timeout=5)`,
    desc: '使用URL白名单并检查目标IP是否为内网地址',
    why: '攻击者通过SSRF访问内网服务或云平台元数据接口。双重验证(域名+IP)可有效防范。',
  },
  {
    id: 10, title: 'IDOR越权', cwe: 'CWE-639', language: 'Python',
    unsafe: `# ❌ 不安全：未验证用户对资源的访问权限
@app.route('/api/orders/<order_id>')
def get_order(order_id):
    order = db.query(Order).get(order_id)
    return jsonify(order)
# 用户A可查看用户B的订单(修改URL中的ID)`,
    safe: `# ✅ 安全：每次请求验证所有权
@app.route('/api/orders/<order_id>')
@login_required
def get_order(order_id):
    order = db.query(Order).get(order_id)
    if not order:
        return "Not found", 404
    # 关键：验证当前用户是否为订单所有者
    if order.user_id != current_user.id:
        return "Forbidden", 403
    return jsonify(order)`,
    desc: '每次请求验证用户对资源的访问权限',
    why: 'IDOR(不安全的直接对象引用)是最常见的越权漏洞。永远不要仅依赖隐藏ID，必须验证权限。',
  },
];

export const VulnCodeCompare: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const scenario = SCENARIOS[current];
  const total = SCENARIOS.length;

  const goNext = () => setCurrent((current + 1) % total);
  const goPrev = () => setCurrent((current - 1 + total) % total);

  return (
    <div className="space-y-4">
      {/* Scenario tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {SCENARIOS.map((s, i) => (
          <button key={s.id} onClick={() => { setCurrent(i); setShowExplanation(false); }}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm transition ${
              current === i ? 'bg-amber-500 text-black font-medium' : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
            }`}>
            {s.title}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <button onClick={goPrev} className="flex items-center gap-1 hover:text-gray-300 transition">
          <ChevronLeft size={14} /> 上一个
        </button>
        <span className="font-mono">{current + 1} / {total}</span>
        <button onClick={goNext} className="flex items-center gap-1 hover:text-gray-300 transition">
          下一个 <ChevronRight size={14} />
        </button>
      </div>

      <Card className="border-amber-500/20">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-amber-400 font-medium mb-1">{scenario.title}</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono">{scenario.cwe}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-500/20 text-gray-400 font-mono">{scenario.language}</span>
            </div>
          </div>
          <button onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-cyber-black/50 text-gray-500 hover:text-amber-400 transition">
            <Lightbulb size={12} /> {showExplanation ? '隐藏解释' : '为什么会这样?'}
          </button>
        </div>

        {/* Why explanation */}
        {showExplanation && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg mb-4">
            <div className="flex items-start gap-2">
              <Lightbulb size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-400 leading-relaxed">{scenario.why}</p>
            </div>
          </motion.div>
        )}

        {/* Code comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Unsafe */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <XCircle size={14} className="text-red-400" />
              <span className="text-xs text-red-400 font-medium">❌ 不安全代码</span>
            </div>
            <pre className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg text-[11px] text-red-300 overflow-x-auto font-mono leading-relaxed whitespace-pre-wrap">
              {scenario.unsafe}
            </pre>
          </div>

          {/* Safe */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={14} className="text-green-400" />
              <span className="text-xs text-green-400 font-medium">✅ 安全修复</span>
            </div>
            <pre className="p-3 bg-green-500/5 border border-green-500/20 rounded-lg text-[11px] text-green-300 overflow-x-auto font-mono leading-relaxed whitespace-pre-wrap">
              {scenario.safe}
            </pre>
          </div>
        </div>

        {/* Fix description */}
        <div className="mt-4 p-3 bg-amber-500/5 rounded-lg border border-amber-500/10">
          <p className="text-xs text-gray-400">
            <span className="text-amber-400 font-medium">修复方法：</span>{scenario.desc}
          </p>
        </div>
      </Card>

      {/* Progress dots */}
      <div className="flex justify-center gap-1">
        {SCENARIOS.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition ${
              i === current ? 'bg-amber-500 w-4' : 'bg-gray-700 hover:bg-gray-600'
            }`} />
        ))}
      </div>
    </div>
  );
};
