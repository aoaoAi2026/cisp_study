import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Trophy, Clock, Eye, EyeOff, Download, Search, Filter } from 'lucide-react';
import { Card, Button } from '../../components/UI';
import type { CTFChallenge } from './types';

const ALL_CHALLENGES: CTFChallenge[] = [
  // === Crypto ===
  { id: 1,  title: 'Base64入门',       category: 'crypto', description: '解码以下字符串: V0VMQ09NRV9UT19DVEY=',           flag: 'WELCOME_TO_CTF',       hint: '最常用的编码方式，末尾常有=号', points: 50 },
  { id: 2,  title: 'ROT13加密',        category: 'crypto', description: 'PGVS{ebg13_vf_rnfl}',                                 flag: 'CTF{rot13_is_easy}',     hint: '字母旋转13位，ROT13是自反的', points: 100 },
  { id: 3,  title: 'XOR加密',          category: 'crypto', description: 'key=42, cipher=[85,83,75,91,65,81,84,95,85] 解密获得flag', flag: 'CTF{xor_crack}',      hint: '每个字节 XOR 42，XOR两次还原', points: 150 },
  { id: 4,  title: 'AES-CBC攻击',      category: 'crypto', description: '服务器使用AES-CBC加密，IV可被篡改。尝试修改IV来改变解密后的第一块数据', flag: 'CTF{cbc_bit_flip}',    hint: 'CBC模式中修改IV可以翻转对应位置的比特位', points: 300 },
  { id: 5,  title: 'Hash碰撞',         category: 'crypto', description: '找到两个不同字符串拥有相同的CRC32值，提示：4字节哈希极易碰撞', flag: 'CTF{hash_collision}', hint: 'CRC32只有4字节，生日攻击约2^16次尝试', points: 250 },
  // === Web ===
  { id: 6,  title: '查看源代码',       category: 'web',    description: '网页中隐藏着flag，你需要查看HTML源代码',                flag: 'CTF{html_source}',    hint: '按F12或右键查看源代码', points: 50 },
  { id: 7,  title: 'Cookie传参',       category: 'web',    description: '管理员Cookie: admin=0，你需要将其改为admin=1',           flag: 'CTF{cookie_bypass}',  hint: '修改浏览器的Cookie值，或在Console执行document.cookie', points: 100 },
  { id: 8,  title: '文件上传绕过',     category: 'web',    description: '上传恶意PHP文件被WAF拦截。尝试用 .pHp 绕过黑名单检测',  flag: 'CTF{upload_bypass}',  hint: '大小写混淆是经典绕过方法', points: 150 },
  { id: 9,  title: '条件竞争',         category: 'web',    description: '银行转账接口存在条件竞争漏洞，同时并发多个请求可超额转账',  flag: 'CTF{race_condition}', hint: '使用Burp Suite的Intruder并发发送请求', points: 250 },
  { id: 10, title: 'SQL注入登录绕过',  category: 'web',    description: '登录表单存在SQL注入，尝试以admin身份登录（无需密码）',     flag: 'CTF{sqli_login}',     hint: "经典的: admin' -- 或 admin' OR '1'='1", points: 200 },
  { id: 11, title: 'JWT伪造',          category: 'web',    description: 'JWT算法字段可被篡改为none。修改header的alg为none绕过签名', flag: 'CTF{jwt_none_attack}', hint: '将 {"alg":"HS256"} 改为 {"alg":"none"}', points: 280 },
  { id: 12, title: 'SSRF内网探测',     category: 'web',    description: 'URL参数可用于访问内部服务，尝试读取内网169.254.169.254的元数据', flag: 'CTF{ssrf_metadata}',  hint: 'URL: http://169.254.169.254/latest/meta-data/', points: 300 },
  // === Misc ===
  { id: 13, title: '图片隐写',         category: 'misc',   description: '图片文件的末尾藏着一段base64编码的flag',                  flag: 'CTF{stego_in_image}', hint: '用hex编辑器查看文件末尾的base64字符串', points: 200 },
  { id: 14, title: '流量分析',         category: 'misc',   description: 'pcap文件中有一段HTTP流量，flag在POST请求体中',              flag: 'CTF{pcap_flag}',      hint: '用Wireshark过滤 http.request.method==POST', points: 250 },
  { id: 15, title: '压缩包爆破',       category: 'misc',   description: 'zip文件密码是4位纯数字，使用字典或暴力破解解压',            flag: 'CTF{zip_crack}',      hint: '4位数字有10000种组合，用fcrackzip或John', points: 200 },
  { id: 16, title: '编码层叠',         category: 'misc',   description: 'Q1RGe2NoYWluX2VuY29kaW5nfQ== -> Hex -> ROT13 -> Base64', flag: 'CTF{chain_encoding}', hint: 'Base64解码 → Hex转文本 → ROT13 → Base64 → flag', points: 220 },
  // === Reverse ===
  { id: 17, title: '逆向工程入门',     category: 're',     description: '二进制程序检查输入是否等于 "SuperSecret123"',              flag: 'SuperSecret123',       hint: '用 strings 命令查看二进制文件中的字符串', points: 200 },
  { id: 18, title: '简单Keygen',       category: 're',     description: '程序验证序列号: serial[i] = name[i] XOR 0x37 + 3',         flag: 'CTF{keygen_logic}',    hint: '逆推算法编写注册机', points: 280 },
  { id: 19, title: '反调试检测',       category: 're',     description: '程序检测到调试器则退出，尝试绕过 ptrace 反调试',             flag: 'CTF{no_debugger}',    hint: 'LD_PRELOAD hook ptrace 或 patch二进制', points: 300 },
  { id: 20, title: '加壳脱壳',         category: 're',     description: 'UPX加壳的ELF文件，先用 upx -d 脱壳再分析',                   flag: 'CTF{upx_unpacked}',   hint: 'upx -d target.elf', points: 250 },
];

const CAT_TAGS: Record<string, { name: string; bg: string; text: string }> = {
  web:    { name: 'Web',    bg: 'bg-blue-500/20',   text: 'text-blue-400' },
  crypto: { name: '密码学', bg: 'bg-purple-500/20', text: 'text-purple-400' },
  misc:   { name: '杂项',   bg: 'bg-green-500/20',  text: 'text-green-400' },
  re:     { name: '逆向',   bg: 'bg-red-500/20',    text: 'text-red-400' },
};

const DIFFICULTY_BADGE: Record<string, { label: string; cls: string }> = {
  easy:   { label: '入门', cls: 'bg-green-500/15 text-green-400 border-green-500/20' },
  medium: { label: '进阶', cls: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20' },
  hard:   { label: '困难', cls: 'bg-red-500/15 text-red-400 border-red-500/20' },
};

// Challenge write-ups shown after solving
const WRITEUPS: Record<number, string> = {
  1:  'Base64是最常见的编码方式，将3字节映射为4个可打印ASCII字符。识别特征：只含A-Za-z0-9+/=，末尾常有=号填充。在线工具或命令行`echo "... " | base64 -d`即可解码。',
  2:  'ROT13是凯撒密码的特例（偏移13），因为是26个字母的一半，所以加密解密使用同一算法。CTF中常见，因为简单且不需要密钥。',
  6:  '查看网页源代码是Web安全的第一步。开发者可能将敏感信息写在HTML注释、隐藏的div或JavaScript变量中。',
  7:  'Cookie是浏览器存储的键值对，客户端可以任意修改。服务端必须对Cookie做签名校验（如JWT），不可信任客户端传来的值。',
  10: 'SQL注入登录绕过是最经典的Web漏洞。当登录查询是 `SELECT * FROM users WHERE username=\'$user\' AND password=\'$pass\'` 时，注入 `admin\' -- ` 会使密码部分被注释掉。',
};

export const CTFChallengesComp: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [solved, setSolved] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<string>('all');
  const [showHints, setShowHints] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState('');
  const [expandedWriteup, setExpandedWriteup] = useState<number | null>(null);
  const [showSolved, setShowSolved] = useState(true);
  const [timer, setTimer] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsed, setElapsed] = useState<number>(0);

  // Timer effect
  React.useEffect(() => {
    if (!timer || solved.size === ALL_CHALLENGES.length) return;
    const now = Date.now();
    if (!startTime) setStartTime(now);
    const iv = setInterval(() => setElapsed(Math.floor(((startTime || now) ? Date.now() - (startTime || now) : 0) / 1000)), 1000);
    return () => clearInterval(iv);
  }, [timer, startTime, solved.size]);

  const handleSubmit = (challenge: CTFChallenge) => {
    const ans = (answers[challenge.id] || '').trim();
    if (ans.toLowerCase() === challenge.flag.toLowerCase()) {
      const next = new Set(solved);
      next.add(challenge.id);
      setSolved(next);
    }
  };

  const getDifficulty = (c: CTFChallenge) => {
    if (c.points <= 100) return 'easy';
    if (c.points <= 250) return 'medium';
    return 'hard';
  };

  const filtered = useMemo(() => {
    let list = filter === 'all' ? ALL_CHALLENGES : ALL_CHALLENGES.filter(c => c.category === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }
    if (!showSolved) list = list.filter(c => !solved.has(c.id));
    return list;
  }, [filter, search, showSolved, solved]);

  const totalScore = ALL_CHALLENGES.filter(c => solved.has(c.id)).reduce((s, c) => s + c.points, 0);
  const maxScore = ALL_CHALLENGES.reduce((s, c) => s + c.points, 0);
  const completionPct = ((solved.size / ALL_CHALLENGES.length) * 100).toFixed(1);
  const catProgress = Object.keys(CAT_TAGS).map(cat => {
    const tc = ALL_CHALLENGES.filter(c => c.category === cat);
    const sc = tc.filter(c => solved.has(c.id)).length;
    return { cat, name: CAT_TAGS[cat].name, solved: sc, total: tc.length };
  });

  return (
    <div className="space-y-4">
      {/* === Top Stats Bar === */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-cyber-purple/5 border border-cyber-purple/10 rounded-xl p-3">
          <div className="text-[10px] text-gray-500 mb-1">已完成</div>
          <div className="font-orbitron text-xl font-bold text-cyber-green">{solved.size}/{ALL_CHALLENGES.length}</div>
          <div className="w-full h-1 bg-gray-700 rounded-full mt-2"><div className="h-full bg-cyber-green rounded-full transition-all" style={{ width: `${completionPct}%` }} /></div>
        </div>
        <div className="bg-cyber-purple/5 border border-cyber-purple/10 rounded-xl p-3">
          <div className="text-[10px] text-gray-500 mb-1">总分</div>
          <div className="font-orbitron text-xl font-bold text-yellow-400">{totalScore}<span className="text-xs text-gray-600">/{maxScore}</span></div>
        </div>
        <div className="bg-cyber-purple/5 border border-cyber-purple/10 rounded-xl p-3">
          <div className="text-[10px] text-gray-500 mb-1">题目数</div>
          <div className="font-orbitron text-xl font-bold text-white">{ALL_CHALLENGES.length}</div>
          <div className="text-[10px] text-gray-600">Web {ALL_CHALLENGES.filter(c=>c.category==='web').length} / Crypto {ALL_CHALLENGES.filter(c=>c.category==='crypto').length} / Misc {ALL_CHALLENGES.filter(c=>c.category==='misc').length} / RE {ALL_CHALLENGES.filter(c=>c.category==='re').length}</div>
        </div>
        <div className="bg-cyber-purple/5 border border-cyber-purple/10 rounded-xl p-3">
          <div className="text-[10px] text-gray-500 mb-1">{timer ? '计时中' : '计时器'}</div>
          <div className="font-orbitron text-xl font-bold text-gray-300">
            {timer ? `${Math.floor(elapsed/60)}:${String(elapsed%60).padStart(2,'0')}` : '--:--'}
          </div>
          <button onClick={() => { setTimer(!timer); if (!timer) { setStartTime(Date.now()); setElapsed(0); } }}
            className={`text-[10px] mt-1 px-2 py-0.5 rounded border transition ${timer ? 'border-red-500/30 text-red-400 bg-red-500/10' : 'border-gray-600 text-gray-500 hover:text-gray-300'}`}>
            {timer ? '停止' : '开始计时'}
          </button>
        </div>
      </div>

      {/* === Category Progress === */}
      <div className="flex gap-3 flex-wrap">
        {catProgress.map(cp => (
          <div key={cp.cat} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${CAT_TAGS[cp.cat].bg} border border-gray-600/20`}>
            <span className={CAT_TAGS[cp.cat].text}>{cp.name}</span>
            <span className="text-gray-400">{cp.solved}/{cp.total}</span>
            <div className="w-12 h-1 bg-gray-700 rounded-full">
              <div className="h-full rounded-full transition-all" style={{ width: `${(cp.solved/cp.total)*100}%`, backgroundColor: CAT_TAGS[cp.cat].text.includes('blue') ? '#60a5fa' : CAT_TAGS[cp.cat].text.includes('purple') ? '#c084fc' : CAT_TAGS[cp.cat].text.includes('green') ? '#4ade80' : '#f87171' }} />
            </div>
          </div>
        ))}
      </div>

      {/* === Toolbar === */}
      <div className="flex gap-2 flex-wrap items-center">
        {/* Category filter */}
        {[{ id: 'all', name: '全部' }, ...Object.entries(CAT_TAGS).map(([k, v]) => ({ id: k, name: v.name }))].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-sm transition ${filter === f.id ? 'bg-cyber-gold text-black font-medium' : 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'}`}>
            {f.name}
          </button>
        ))}
        <div className="flex-1" />
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索题目..."
            className="pl-9 pr-3 py-1.5 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-yellow-500 w-40" />
        </div>
        {/* Toggle solved */}
        <button onClick={() => setShowSolved(!showSolved)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition ${showSolved ? 'border-gray-600 text-gray-400' : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'}`}>
          {showSolved ? <Eye size={14} /> : <EyeOff size={14} />}
          {showSolved ? '显示已解' : '仅未解'}
        </button>
      </div>

      {/* === Challenge Grid === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(c => {
          const isSolved = solved.has(c.id);
          const diff = getDifficulty(c);
          const tag = CAT_TAGS[c.category];
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              layout
            >
              <Card className={`border transition ${isSolved ? 'border-green-500/30 bg-green-500/5' : 'border-yellow-500/20 hover:border-yellow-500/40'}`}>
                {/* Header row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-orbitron text-cyber-gold text-sm">#{c.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${DIFFICULTY_BADGE[diff].cls}`}>{DIFFICULTY_BADGE[diff].label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${tag.bg} ${tag.text}`}>{tag.name}</span>
                  </div>
                  <span className="text-xs text-cyber-gold font-mono">{c.points}pts</span>
                </div>
                <h4 className="text-white font-medium text-sm mb-1">{c.title}</h4>
                <p className="text-xs text-gray-400 mb-3 leading-relaxed">{c.description}</p>

                {isSolved ? (
                  <>
                    <div className="flex items-center gap-2 text-green-400 text-sm mb-2">
                      <CheckCircle size={16} /> 已解决! Flag: <code className="font-mono text-xs bg-green-500/10 px-2 py-0.5 rounded">{c.flag}</code>
                    </div>
                    {/* Write-up expand */}
                    {WRITEUPS[c.id] && (
                      <div className="mt-2">
                        <button onClick={() => setExpandedWriteup(expandedWriteup === c.id ? null : c.id)}
                          className="text-xs text-gray-500 hover:text-cyber-green transition flex items-center gap-1">
                          {expandedWriteup === c.id ? <EyeOff size={12} /> : <Eye size={12} />}
                          {expandedWriteup === c.id ? '收起解析' : '查看题解'}
                        </button>
                        {expandedWriteup === c.id && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                            className="mt-2 p-3 bg-cyber-green/5 border border-cyber-green/10 rounded-lg text-xs text-gray-400 leading-relaxed">
                            {WRITEUPS[c.id]}
                          </motion.div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        value={answers[c.id] || ''}
                        onChange={e => setAnswers({ ...answers, [c.id]: e.target.value })}
                        onKeyDown={e => e.key === 'Enter' && handleSubmit(c)}
                        placeholder="输入Flag..."
                        className="flex-1 px-3 py-1.5 bg-cyber-black/50 border border-gray-700 rounded text-white text-sm outline-none focus:border-yellow-500 font-mono"
                      />
                      <Button size="sm" onClick={() => handleSubmit(c)} className="!bg-yellow-500 !text-black hover:!bg-yellow-400">
                        提交
                      </Button>
                    </div>
                    {!showHints.has(c.id) ? (
                      <button onClick={() => setShowHints(new Set([...showHints, c.id]))}
                        className="text-xs text-gray-500 hover:text-yellow-400 transition flex items-center gap-1">
                        💡 查看提示
                        <span className="text-[10px] text-gray-600">(不影响分数)</span>
                      </button>
                    ) : (
                      <div className="p-2 bg-yellow-500/5 border border-yellow-500/10 rounded-lg">
                        <p className="text-xs text-yellow-400/80">💡 {c.hint}</p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* === Empty state === */}
      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Trophy size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">{showSolved ? '没有匹配的题目' : '全部解决！🎉'}</p>
          {solved.size === ALL_CHALLENGES.length && (
            <p className="text-xs mt-1 text-cyber-green">恭喜你完成了全部 {ALL_CHALLENGES.length} 道CTF挑战！</p>
          )}
        </div>
      )}

      {/* === Footer tips === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: <Search size={14} />, title: '信息收集', desc: '先查看源代码、HTTP头、Cookie、隐藏表单' },
          { icon: <Filter size={14} />, title: '工具辅助', desc: 'CyberChef的Magic模式可自动识别编码' },
          { icon: <Trophy size={14} />, title: '循序渐进', desc: '从50分的入门题开始，逐渐挑战高分题' },
          { icon: <Clock size={14} />, title: '计时挑战', desc: '开启计时器，争取在最短时间内完成全部' },
        ].map((tip, i) => (
          <div key={i} className="bg-cyber-purple/5 border border-cyber-purple/10 rounded-xl p-3 flex gap-2">
            <span className="text-cyber-gold mt-0.5 flex-shrink-0">{tip.icon}</span>
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
