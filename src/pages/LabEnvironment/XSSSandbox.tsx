import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle } from 'lucide-react';
import { Card, Button } from '../../components/UI';

export const XSSSandbox: React.FC = () => {
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
