import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Card, Button } from '../../components/UI';
import type { CTFChallenge } from './types';

export const CTFChallengesComp: React.FC = () => {
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
