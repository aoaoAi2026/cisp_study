import React, { useState } from 'react';
import { Play, Terminal } from 'lucide-react';
import { Card, Button } from '../../components/UI';

export const SQLInjectionLab: React.FC = () => {
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
