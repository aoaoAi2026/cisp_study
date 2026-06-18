import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, Zap, Clock, Shield, Hash, AlertTriangle, CheckCircle, Info, Database, Cpu, ArrowRight } from 'lucide-react';
import { Card, Button } from '../../components/UI';

// Simple hash function for demo (simulates various outputs)
const hashImpl = (input: string, type: string): string => {
  let h = 0;
  for (let i = 0; i < input.length; i++) { h = ((h << 5) - h + input.charCodeAt(i)) | 0; }
  const base = (h >>> 0).toString(16).padStart(8, '0');
  switch (type) {
    case 'md5':    return base + base.substring(0, 24); // 32 chars
    case 'sha1':   return base + base.substring(0, 24) + base.substring(0, 8); // 40 chars
    case 'sha256': return base + base + base + base + base + base + base + base.substring(0, 8); // 64 chars
    case 'ntlm':   return base + base + base + base.substring(0, 8); // 32 chars uppercase
    case 'bcrypt': return `$2b$12$${base}${base}${base.substring(0, 13)}`; // bcrypt 格式
    default:       return base;
  }
};

// Extended dictionary (50+ common passwords categorized)
const DICT_BY_CATEGORY: Record<string, string[]> = {
  '数字序列': ['123456', '12345678', '123456789', '1234567890', '111111', '000000', '666666', '888888', '999999', '123123'],
  '常见单词': ['password', 'admin', 'qwerty', 'letmein', 'monkey', 'dragon', 'master', 'football', 'baseball', 'sunshine', 'iloveyou', 'trustno1', 'welcome', 'shadow', 'michael'],
  '中文拼音': ['woaini', 'woaiwojia', 'nihao', 'baobao', 'xiaohei', 'mima123', 'zhanghao', 'denglu', 'weixin', 'qq123456'],
  '键盘模式': ['qwerty', 'qwerty123', '1qaz2wsx', 'asdfgh', 'zxcvbnm', 'qazwsx', '!@#$%^', '1q2w3e4r'],
  '日期生日': ['19900101', '20000101', '19951020', '19880606', 'abc123', 'test123', 'changeme', 'passwd', 'p@ssw0rd', 'Pa$$w0rd'],
};

const ALL_DICT = Object.values(DICT_BY_CATEGORY).flat();

// Hash type metadata
const HASH_TYPES = [
  { id: 'md5', name: 'MD5', length: 32, regex: /^[a-f0-9]{32}$/i, color: '#f59e0b', cracked: true },
  { id: 'sha1', name: 'SHA-1', length: 40, regex: /^[a-f0-9]{40}$/i, color: '#ef4444', cracked: true },
  { id: 'sha256', name: 'SHA-256', length: 64, regex: /^[a-f0-9]{64}$/i, color: '#3b82f6', cracked: false },
  { id: 'ntlm', name: 'NTLM', length: 32, regex: /^[a-f0-9]{32}$/i, color: '#8b5cf6', cracked: true },
  { id: 'bcrypt', name: 'bcrypt', length: 60, regex: /^\$2[aby]\$\d+\$/, color: '#10b981', cracked: false },
];

interface CrackResult {
  found: boolean;
  password: string;
  method: string;
  attempts: number;
  duration: number;
}

export const PasswordCracking: React.FC = () => {
  const [hash, setHash] = useState('');
  const [mode, setMode] = useState<'dict' | 'brute' | 'rainbow' | 'hybrid'>('dict');
  const [result, setResult] = useState<CrackResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState<CrackResult[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Hash type detection
  const detectedType = useMemo(() => {
    if (!hash.trim()) return null;
    for (const t of HASH_TYPES) {
      if (t.regex.test(hash.trim())) return t;
    }
    return null;
  }, [hash]);

  // Password strength meter (0-100)
  const passwordStrength = useMemo(() => {
    return (pw: string): { score: number; label: string; color: string } => {
      if (!pw) return { score: 0, label: '无', color: 'bg-gray-500' };
      let s = 0;
      if (pw.length >= 8) s += 25; else if (pw.length >= 6) s += 10;
      if (pw.length >= 12) s += 15;
      if (/[A-Z]/.test(pw)) s += 15;
      if (/[a-z]/.test(pw)) s += 10;
      if (/[0-9]/.test(pw)) s += 15;
      if (/[^A-Za-z0-9]/.test(pw)) s += 20;
      if (/(.)\1{2,}/.test(pw)) s -= 10; // repeated chars
      if (/^[0-9]+$/.test(pw)) s -= 20; // all numbers
      const final = Math.max(0, Math.min(100, s));
      return {
        score: final,
        label: final <= 25 ? '极弱' : final <= 50 ? '弱' : final <= 70 ? '中等' : final <= 85 ? '强' : '非常强',
        color: final <= 25 ? 'bg-red-500' : final <= 50 ? 'bg-orange-500' : final <= 70 ? 'bg-yellow-500' : final <= 85 ? 'bg-green-500' : 'bg-cyber-green',
      };
    };
  }, []);

  const handleCrack = () => {
    const targetHash = hash.trim().toLowerCase();
    if (!targetHash) { setResult({ found: false, password: '', method: '', attempts: 0, duration: 0 }); return; }
    setRunning(true);
    setProgress(0);
    setResult(null);

    if (mode === 'dict') {
      // Dictionary attack: iterate through all dict entries
      let foundPwd = '';
      let found = false;
      const startTime = Date.now();
      const totalSteps = ALL_DICT.length;
      let step = 0;
      const iv = setInterval(() => {
        if (step >= totalSteps || found) {
          clearInterval(iv);
          setRunning(false);
          setProgress(100);
          const r: CrackResult = found
            ? { found: true, password: foundPwd, method: '字典攻击', attempts: step, duration: Date.now() - startTime }
            : { found: false, password: '', method: '字典攻击', attempts: step, duration: Date.now() - startTime };
          setResult(r);
          setHistory(prev => [r, ...prev.slice(0, 19)]);
          return;
        }
        const pwd = ALL_DICT[step];
        if (hashImpl(pwd, detectedType?.id || 'md5') === targetHash || pwd === hash.trim()) {
          foundPwd = pwd;
          found = true;
        }
        setProgress(Math.floor(((step + 1) / totalSteps) * 100));
        step++;
      }, 30);
    } else if (mode === 'brute') {
      // Brute force simulation
      const startTime = Date.now();
      let pct = 0;
      const iv = setInterval(() => {
        pct += Math.random() * 8;
        if (pct >= 100) {
          pct = 100;
          clearInterval(iv);
          setRunning(false);
          const totalAttempts = Math.floor(100000 + Math.random() * 5000000);
          const r: CrackResult = { found: true, password: 'p@ssw0rd!', method: '暴力破解', attempts: totalAttempts, duration: Date.now() - startTime };
          setResult(r);
          setHistory(prev => [r, ...prev.slice(0, 19)]);
        }
        setProgress(Math.floor(pct));
      }, 200);
    } else if (mode === 'rainbow') {
      // Rainbow table simulation
      const startTime = Date.now();
      setTimeout(() => { setProgress(30); }, 200);
      setTimeout(() => { setProgress(60); }, 500);
      setTimeout(() => {
        setProgress(100);
        setRunning(false);
        const crackPwd = ALL_DICT[Math.floor(Math.random() * ALL_DICT.length)];
        const r: CrackResult = { found: true, password: crackPwd, method: '彩虹表 (rockyou_rainbow_v3)', attempts: 1, duration: Date.now() - startTime };
        setResult(r);
        setHistory(prev => [r, ...prev.slice(0, 19)]);
      }, 800);
    } else {
      // Hybrid: dict + rules
      const startTime = Date.now();
      let pct = 0;
      const iv = setInterval(() => {
        pct += 5 + Math.random() * 5;
        if (pct >= 100) {
          pct = 100;
          clearInterval(iv);
          setRunning(false);
          const crackPwd = ALL_DICT[Math.floor(Math.random() * ALL_DICT.length)] + '123';
          const r: CrackResult = { found: true, password: crackPwd, method: '混合攻击 (字典+规则)', attempts: ALL_DICT.length * 3, duration: Date.now() - startTime };
          setResult(r);
          setHistory(prev => [r, ...prev.slice(0, 19)]);
        }
        setProgress(Math.floor(pct));
      }, 100);
    }
  };

  // Estimate crack time based on hashed value
  const crackTimeEstimate = useMemo(() => {
    const pw = hash.trim();
    if (!pw) return null;
    const len = pw.length;
    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);
    const hasDigit = /[0-9]/.test(pw);
    const hasSpecial = /[^A-Za-z0-9]/.test(pw);
    const charset = (hasLower ? 26 : 0) + (hasUpper ? 26 : 0) + (hasDigit ? 10 : 0) + (hasSpecial ? 32 : 0);
    if (charset === 0) return null;
    const combos = Math.pow(charset, len);
    // Assume 1 billion guesses/sec for MD5
    const seconds = combos / 1e9;
    if (seconds < 1) return '秒级';
    if (seconds < 60) return `${Math.floor(seconds)} 秒`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} 分钟`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} 小时`;
    if (seconds < 365 * 86400) return `${Math.floor(seconds / 86400)} 天`;
    return `${Math.floor(seconds / 365 / 86400)} 年`;
  }, [hash]);

  return (
    <div className="space-y-4">
      {/* === Top stats row === */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: <Database size={16} />, label: '字典大小', value: `${ALL_DICT.length} 条`, color: 'text-purple-400' },
          { icon: <Cpu size={16} />, label: '攻击模式', value: { dict: '字典', brute: '暴力', rainbow: '彩虹表', hybrid: '混合' }[mode], color: 'text-blue-400' },
          { icon: <Hash size={16} />, label: 'Hash类型', value: detectedType?.name || '未知', color: detectedType ? 'text-yellow-400' : 'text-gray-500' },
          { icon: <Clock size={16} />, label: '预计耗时', value: crackTimeEstimate || '—', color: 'text-green-400' },
        ].map((item, i) => (
          <div key={i} className="bg-cyber-purple/5 border border-cyber-purple/10 rounded-xl p-3 flex items-center gap-2">
            <span className={item.color}>{item.icon}</span>
            <div>
              <div className="text-[10px] text-gray-500">{item.label}</div>
              <div className="text-sm font-medium text-white">{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* === Mode selector === */}
      <div className="flex gap-2 flex-wrap">
        {([
          { id: 'dict', name: '📖 字典攻击', desc: '使用常见密码列表逐一尝试', color: 'purple' },
          { id: 'brute', name: '⚡ 暴力破解', desc: '穷举所有可能的字符组合', color: 'red' },
          { id: 'rainbow', name: '🌈 彩虹表', desc: '预计算Hash→密码映射表', color: 'blue' },
          { id: 'hybrid', name: '🔀 混合攻击', desc: '字典+规则变换（如加后缀）', color: 'green' },
        ] as const).map(m => (
          <button key={m.id} onClick={() => { setMode(m.id); setResult(null); setProgress(0); }}
            className={`px-4 py-2.5 rounded-lg text-sm transition flex flex-col items-start ${mode === m.id
              ? `bg-${m.color}-500 text-white shadow-lg shadow-${m.color}-500/20` : `bg-${m.color}-500/10 text-${m.color}-400 hover:bg-${m.color}-500/20`}`}>
            <span className="font-medium">{m.name}</span>
            <span className="text-[10px] opacity-70">{m.desc}</span>
          </button>
        ))}
      </div>

      <Card className="border-purple-500/20">
        {/* === Hash input === */}
        <div className="mb-4">
          <label className="text-sm text-gray-400 mb-1.5 block flex items-center gap-2">
            <Hash size={14} className="text-purple-400" /> Hash值
            {detectedType && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full border`}
                style={{ borderColor: detectedType.color + '40', color: detectedType.color, backgroundColor: detectedType.color + '10' }}>
                {detectedType.name} ({detectedType.length}位)
              </span>
            )}
          </label>
          <input value={hash} onChange={e => setHash(e.target.value)}
            placeholder="输入MD5/SHA1/SHA256/NTLM/bcrypt..."
            className="w-full px-4 py-2.5 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-purple-500 font-mono" />
          <div className="flex gap-2 mt-2 flex-wrap">
            {['5d41402abc4b2a76b9719d911017c592', '7c6a180b36896a0a8c02787eeafb0e4c', 'e38ad214943daad1d64c102faec29de4afe9da3d'].map(sample => (
              <button key={sample} onClick={() => setHash(sample)}
                className="text-[10px] px-2 py-1 rounded bg-cyber-black/30 border border-gray-700 text-gray-500 hover:border-purple-500/50 hover:text-purple-400 font-mono transition truncate max-w-[200px]">
                {sample.substring(0, 16)}...
              </button>
            ))}
          </div>
        </div>

        {/* === Hash type detection info === */}
        {detectedType && (
          <div className="mb-4 p-3 rounded-lg border flex items-start gap-3"
            style={{ borderColor: detectedType.color + '30', backgroundColor: detectedType.color + '08' }}>
            <Info size={16} style={{ color: detectedType.color }} className="mt-0.5 flex-shrink-0" />
            <div className="text-xs" style={{ color: detectedType.color }}>
              <div className="font-medium mb-1">{detectedType.name} — {detectedType.cracked ? '⚠️ 已被破解，不建议使用' : '✅ 目前安全，难以破解'}</div>
              <div className="opacity-70">
                {detectedType.id === 'md5' && 'MD5被设计为快速Hash，不适合密码存储。应使用bcrypt/Argon2替代。'}
                {detectedType.id === 'sha1' && 'SHA-1已于2017年被Google宣布冲突攻击成功，不应再使用。'}
                {detectedType.id === 'sha256' && 'SHA-256相对安全但速度太快。密码存储应使用慢Hash算法。'}
                {detectedType.id === 'ntlm' && 'NTLM是Windows早期认证Hash，无加盐且使用MD4，极易被彩虹表破解。'}
                {detectedType.id === 'bcrypt' && 'bcrypt是专门为密码存储设计的慢Hash算法，内置加盐和工作因子，破解难度极高。'}
              </div>
            </div>
          </div>
        )}

        {/* === Action button + progress === */}
        <Button onClick={handleCrack} disabled={running} className="!bg-purple-500 text-white hover:!bg-purple-400 w-full mb-3">
          <Key size={16} /> {running ? '破解中...' : '开始破解'}
        </Button>
        {progress > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>进度</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #a855f7, #7c3aed)' }}
                animate={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* === Result panel === */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border ${result.found ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
            <div className="flex items-center gap-2 mb-2">
              {result.found ? <CheckCircle size={18} className="text-green-400" /> : <AlertTriangle size={18} className="text-red-400" />}
              <span className={`text-sm font-medium ${result.found ? 'text-green-400' : 'text-red-400'}`}>
                {result.found ? '破解成功！' : '破解失败'}
              </span>
            </div>
            {result.found && (
              <div className="space-y-1.5 text-xs">
                <div className="flex gap-2"><span className="text-gray-500 w-16 flex-shrink-0">密码:</span><code className="font-mono text-green-300 bg-black/30 px-2 py-0.5 rounded">{result.password}</code></div>
                <div className="flex gap-2"><span className="text-gray-500 w-16 flex-shrink-0">方法:</span><span className="text-gray-300">{result.method}</span></div>
                <div className="flex gap-2"><span className="text-gray-500 w-16 flex-shrink-0">尝试次数:</span><span className="text-gray-300">{result.attempts.toLocaleString()} 次</span></div>
                <div className="flex gap-2"><span className="text-gray-500 w-16 flex-shrink-0">耗时:</span><span className="text-gray-300">{result.duration < 1000 ? `${result.duration}ms` : `${(result.duration / 1000).toFixed(2)}s`}</span></div>
              </div>
            )}
            {!result.found && (
              <p className="text-xs text-gray-400">密码不在当前字典中。尝试切换攻击模式或检查Hash是否正确。</p>
            )}
            {/* Password strength if cracked */}
            {result.found && (
              <div className="mt-3 pt-3 border-t border-gray-700/50">
                <div className="text-[10px] text-gray-500 mb-1">密码强度</div>
                {(() => {
                  const ps = passwordStrength(result.password);
                  return (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${ps.color}`} style={{ width: `${ps.score}%` }} />
                        </div>
                        <span className="text-xs text-gray-400">{ps.score}分</span>
                      </div>
                      <span className={`text-xs font-medium`} style={{ color: ps.score <= 25 ? '#ef4444' : ps.score <= 50 ? '#f97316' : ps.score <= 70 ? '#eab308' : '#22c55e' }}>{ps.label}</span>
                    </>
                  );
                })()}
              </div>
            )}
          </motion.div>
        )}
      </Card>

      {/* === Dictionary explorer === */}
      <Card className="border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Database size={14} className="text-purple-400" /> 内置字典 (共{ALL_DICT.length}条)
          </h4>
          <button onClick={() => setShowAnalysis(!showAnalysis)}
            className="text-xs text-gray-500 hover:text-purple-400 transition">
            {showAnalysis ? '收起' : '展开分类'}
          </button>
        </div>
        {showAnalysis && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-3">
            {Object.entries(DICT_BY_CATEGORY).map(([category, words]) => (
              <div key={category} className="bg-cyber-black/30 border border-gray-700/50 rounded-lg p-2">
                <div className="text-[10px] text-purple-400 mb-1 font-medium">{category} ({words.length})</div>
                <div className="space-y-0.5">
                  {words.slice(0, 5).map((w, i) => (
                    <button key={i} onClick={() => setHash(hashImpl(w, 'md5'))}
                      className="block w-full text-left text-[10px] text-gray-500 hover:text-purple-300 font-mono truncate transition">
                      {w}
                    </button>
                  ))}
                  {words.length > 5 && <span className="text-[10px] text-gray-600">... 等{words.length}条</span>}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-1">
          {ALL_DICT.slice(0, showAnalysis ? 0 : 15).map((w, i) => (
            <button key={i} onClick={() => setHash(hashImpl(w, 'md5'))}
              className="text-[10px] px-2 py-0.5 rounded bg-cyber-black/30 border border-gray-700/50 text-gray-500 hover:text-purple-400 hover:border-purple-500/30 font-mono transition">
              {w}
            </button>
          ))}
          {!showAnalysis && <span className="text-[10px] text-gray-600 self-center ml-1">... 展开查看更多</span>}
        </div>
      </Card>

      {/* === Crack history === */}
      {history.length > 0 && (
        <Card className="border-gray-700">
          <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <Clock size={14} className="text-blue-400" /> 破解记录 ({history.length})
          </h4>
          <div className="space-y-1.5">
            {history.slice(0, 8).map((h, i) => (
              <div key={i} className="flex items-center gap-3 text-xs p-2 rounded bg-cyber-black/30 border border-gray-700/30">
                <span className={h.found ? 'text-green-400' : 'text-red-400'}>{h.found ? '✅' : '❌'}</span>
                {h.found && <code className="font-mono text-green-300/80 bg-black/20 px-1.5 py-0.5 rounded">{h.password}</code>}
                <span className="text-gray-500">{h.method}</span>
                <span className="text-gray-600 ml-auto">{h.attempts.toLocaleString()}次 / {h.duration < 1000 ? `${h.duration}ms` : `${(h.duration/1000).toFixed(1)}s`}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* === Defense tips === */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: <Shield size={14} />, title: '使用慢Hash', desc: 'bcrypt/Argon2id替代MD5/SHA，增加破解成本', color: 'text-green-400' },
          { icon: <Zap size={14} />, title: '加盐存储', desc: '每个密码独立随机Salt，彩虹表攻击失效', color: 'text-yellow-400' },
          { icon: <AlertTriangle size={14} />, title: '账号锁定', desc: 'N次失败后锁定+多因素认证', color: 'text-red-400' },
        ].map((tip, i) => (
          <div key={i} className="bg-cyber-purple/5 border border-cyber-purple/10 rounded-xl p-3 flex gap-2">
            <span className={`${tip.color} mt-0.5 flex-shrink-0`}>{tip.icon}</span>
            <div>
              <div className="text-xs font-medium text-gray-300">{tip.title}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{tip.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
