import React, { useState } from 'react';
import { Wrench } from 'lucide-react';
import { Card, Button } from '../../components/UI';

export const CryptoTools: React.FC = () => {
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
