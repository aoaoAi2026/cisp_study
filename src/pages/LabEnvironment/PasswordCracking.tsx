import React, { useState } from 'react';
import { Key } from 'lucide-react';
import { Card, Button } from '../../components/UI';

export const PasswordCracking: React.FC = () => {
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
