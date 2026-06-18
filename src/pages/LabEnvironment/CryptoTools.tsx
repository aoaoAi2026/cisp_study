import React, { useState } from 'react';
import { Wrench, Copy, Info, Lock, Unlock, Shield, CheckCircle } from 'lucide-react';
import { Card, Button } from '../../components/UI';

type CryptoTool = 'base64'|'hash'|'jwt'|'aes'|'rsa'|'compare';

const toolMeta: Record<CryptoTool, {name:string; icon:string; desc:string; keys:string[]}> = {
  base64: { name:'Base64 编解码', icon:'🔤', desc:'Base64是一种编码方式而非加密算法。它将二进制数据转换为ASCII字符，常用于在HTTP、JSON等文本协议中传输二进制数据。', keys:['编码≠加密','可逆编码','常用于数据传输'] },
  hash:   { name:'Hash 计算', icon:'#️⃣', desc:'哈希函数将任意长度输入映射为固定长度输出。用于密码存储、数据完整性校验。常见算法: MD5(已破解)、SHA-1(已破解)、SHA-256、SHA-3。', keys:['单向不可逆','雪崩效应','抗碰撞性'] },
  jwt:    { name:'JWT 调试器', icon:'🎫', desc:'JWT (JSON Web Token) 由 Header.Payload.Signature 三部分组成。用于无状态身份认证。常见漏洞: 签名未验证(alg:none)、密钥泄露、过期时间过长。', keys:['无状态认证','三段式结构','注意alg:none攻击'] },
  aes:    { name:'AES 加解密', icon:'🔒', desc:'AES (Advanced Encryption Standard) 对称加密算法。加密和解密使用相同密钥。支持128/192/256位密钥长度。AES-256-GCM 为当前推荐配置。', keys:['对称加密','密钥管理关键','GCM模式推荐'] },
  rsa:    { name:'RSA 非对称加密', icon:'🔑', desc:'RSA使用公钥加密、私钥解密。基于大数分解难题。常用于密钥交换、数字签名。RSA-2048为当前最低安全标准。', keys:['非对称加密','公钥加密私钥解密','RSA-2048以上'] },
  compare:{ name:'编码 vs 加密', icon:'⚖️', desc:'编码(Encoding)和加密(Encryption)的本质区别：编码是可逆的数据格式转换，无安全保护；加密需要密钥且旨在保护数据机密性。', keys:['编码≠加密','Hash≠加密','Base64只是编码'] },
};

const hashAlgos = [
  { name:'MD5', bits:128, broken:true, sample:'d41d8cd98f00b204e9800998ecf8427e' },
  { name:'SHA-1', bits:160, broken:true, sample:'da39a3ee5e6b4b0d3255bfef95601890afd80709' },
  { name:'SHA-256', bits:256, broken:false, sample:'e3b0c44298fc1c14...' },
  { name:'SHA-512', bits:512, broken:false, sample:'cf83e1357eefb8bd...' },
  { name:'BLAKE2', bits:256, broken:false, sample:'现代高性能Hash' },
];

export const CryptoTools: React.FC = () => {
  const [tool, setTool] = useState<CryptoTool>('base64');
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encrypt'|'decrypt'>('encrypt');
  const [showInfo, setShowInfo] = useState(false);

  const demoHash = (s: string, algo: string) => {
    let h=0x67452301;
    for(let i=0;i<s.length;i++){h=((h<<5)-h+s.charCodeAt(i)+(algo.length*31))|0;}
    return (h>>>0).toString(16).padStart(8,'0');
  };

  const handleProcess = () => {
    if (!input.trim()) return;
    switch (tool) {
      case 'base64':
        try {
          if (mode === 'encrypt') setOutput(btoa(unescape(encodeURIComponent(input))));
          else setOutput(decodeURIComponent(escape(atob(input))));
        } catch { setOutput('❌ 解码失败，请检查输入是否为有效Base64'); }
        break;
      case 'hash':
        setOutput(`📊 Hash计算结果 (演示模式):\n\n${hashAlgos.map(a => 
          `${a.broken?'⚠️':'✅'} ${a.name}(${a.bits}bit): ${demoHash(input,a.name)}${a.broken?' ← 已不安全!':''}`
        ).join('\n')}\n\n⚠️ 此为JavaScript演示Hash，非真实密码学计算\n💡 生产环境请使用 Web Crypto API 或 crypto 库`);
        break;
      case 'jwt':
        try {
          const parts = input.split('.');
          if (parts.length !== 3) { setOutput('❌ 无效的JWT格式（需要 header.payload.signature）'); break; }
          const header = JSON.parse(atob(parts[0]));
          const payload = JSON.parse(atob(parts[1]));
          const warnings: string[] = [];
          if (header.alg === 'none') warnings.push('🚨 高危: alg=none 允许绕过签名验证!');
          if (!header.typ) warnings.push('⚠️ 缺少 typ 字段');
          if (payload.exp && payload.exp * 1000 < Date.now()) warnings.push('⚠️ Token已过期');
          if (!payload.exp) warnings.push('⚠️ 未设置过期时间(exp)');
          setOutput(`📋 JWT解析:\n\nHeader:\n${JSON.stringify(header, null, 2)}\n\nPayload:\n${JSON.stringify(payload, null, 2)}\n\nSignature:\n${parts[2].substring(0,30)}...\n\n${warnings.length>0?'🔍 安全检查:\n'+warnings.join('\n'):'✅ 未发现明显安全问题'}\n\n⚠️ 签名未做密码学验证（演示模式）`);
        } catch { setOutput('❌ JWT解析失败，请检查格式'); }
        break;
      case 'aes':
        if (!key) { setOutput('❌ AES加密需要密钥'); break; }
        if (key.length < 8) { setOutput('⚠️ 密钥过短（< 8字符），实际应用中不安全'); break; }
        setOutput(mode==='encrypt'
          ? `🔒 AES加密 (演示):\n\n明文: ${input}\n密钥: ${'*'.repeat(Math.min(key.length,16))}\n模式: AES-256-GCM (推荐)\n\n密文(Base64):\n${btoa(unescape(encodeURIComponent(`[AES-GCM]${input}[keyHash:${demoHash(key,'aes')}]`)))}\n\n⚠️ 演示模式，非真实AES加密\n💡 真实使用请: crypto.subtle.encrypt('AES-GCM', ...)`
          : `🔓 AES解密 (演示):\n演示模式不支持真实解密\n\n💡 生产环境示例:\nconst decrypted = await crypto.subtle.decrypt(\n  { name: 'AES-GCM', iv },\n  key,\n  ciphertext\n);`);
        break;
      case 'rsa':
        const pubPart = Array.from({length:16},()=>Math.floor(Math.random()*16).toString(16)).join('');
        const privPart = Array.from({length:32},()=>Math.floor(Math.random()*16).toString(16)).join('');
        setOutput(`🔑 RSA密钥对 (演示):\n\n📤 公钥:\ne = 65537\nn = ${pubPart}...\n用途: 加密 / 验证签名\n\n📥 私钥:\nd = ${privPart}...\n用途: 解密 / 生成签名\n\n⚠️ 演示模式，非真实密钥对\n💡 真实生成: openssl genrsa -out private.pem 2048`);
        break;
      case 'compare':
        setOutput(`⚖️ 编码 vs 加密 vs 哈希 对比:\n\n📝 Base64编码:\n  - 输入: "${input}"\n  - 编码后: "${btoa(unescape(encodeURIComponent(input)))}"\n  - 类型: 可逆编码，无需密钥\n  - 用途: 数据传输格式化\n\n🔐 哈希:\n  - SHA-256(演示): ${demoHash(input,'sha256')}\n  - 类型: 单向不可逆\n  - 用途: 密码存储、完整性校验\n\n❌ Base64不是加密!\n❌ MD5不是加密!\n✅ AES/RSA/ChaCha20才是加密`);
        break;
    }
  };

  const demoPayloads: Record<string, string[]> = {
    base64: ['Hello World!', '网络安全实验', '{"user":"admin"}'],
    hash: ['password123', 'admin', 'Hello World'],
    jwt: ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'],
    aes: ['这是需要加密的敏感数据', 'password=admin123'],
    rsa: [],
    compare: ['admin:password123'],
  };

  return (
    <div className="space-y-4">
      {/* Tool tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {(Object.keys(toolMeta) as CryptoTool[]).map(t => (
          <button key={t} onClick={() => { setTool(t); setOutput(''); setInput(''); setKey(''); }}
            className={`px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1 ${
              tool===t ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'}`}>
            <span>{toolMeta[t].icon}</span>{toolMeta[t].name}
          </button>
        ))}
      </div>

      {/* Tool info */}
      <Card className="border-blue-500/15 bg-blue-500/[0.02]">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-blue-400 font-medium text-sm flex items-center gap-2">
              {toolMeta[tool].icon} {toolMeta[tool].name}
            </h3>
            <p className="text-xs text-gray-400 mt-1">{toolMeta[tool].desc}</p>
            {showInfo && (
              <div className="mt-2 flex gap-1.5 flex-wrap">
                {toolMeta[tool].keys.map((k,i) => (
                  <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300">{k}</span>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setShowInfo(!showInfo)}
            className="text-xs text-gray-600 hover:text-blue-400 transition flex-shrink-0 ml-2">
            <Info size={14}/>
          </button>
        </div>
      </Card>

      {/* Mode toggle for base64 & aes */}
      {['aes','base64','compare'].includes(tool) && (
        <div className="flex gap-2 flex-wrap">
          {(tool==='compare'?[
            {v:'compare' as const,label:'编码/加密 对比'}
          ]:[
            {v:'encrypt' as const,label:tool==='base64'?'🔤 编码':'🔒 加密'},
            {v:'decrypt' as const,label:tool==='base64'?'🔓 解码':'🔓 解密'},
          ]).map(m => (
            <button key={m.v} onClick={() => setMode(m.v)}
              className={`px-3 py-1.5 rounded-lg text-xs transition ${
                mode===m.v ? 'bg-blue-500 text-white' : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'}`}>
              {m.label}
            </button>
          ))}
        </div>
      )}

      {/* Hash algorithm cards */}
      {tool === 'hash' && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {hashAlgos.map(a => (
            <div key={a.name} className={`p-2 rounded-lg border text-center ${
              a.broken ? 'bg-red-500/5 border-red-500/20' : 'bg-green-500/5 border-green-500/20'}`}>
              <p className={`text-xs font-mono font-bold ${a.broken?'text-red-400':'text-green-400'}`}>{a.name}</p>
              <p className="text-[10px] text-gray-500">{a.bits}bit</p>
              <p className="text-[10px]">{a.broken?'⚠️ 已破解':'✅ 安全'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Main card */}
      <Card className="border-blue-500/20">
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              {tool==='jwt'?'JWT Token:' : '输入:'}
            </label>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              placeholder={{
                base64:'输入要编码/解码的文本...',
                hash:'输入要计算哈希的文本...',
                jwt:'粘贴JWT Token (xxxxx.yyyyy.zzzzz)...',
                aes:'输入要加密/解密的文本...',
                rsa:'点击执行生成RSA密钥对...',
                compare:'输入文本对比编码与加密的区别...',
              }[tool]}
              className="w-full px-4 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-blue-500 h-24 resize-none font-mono"/>
            {demoPayloads[tool]?.length > 0 && (
              <div className="flex gap-1.5 flex-wrap mt-2">
                <span className="text-[10px] text-gray-600">快速填充:</span>
                {demoPayloads[tool].map((p,i) => (
                  <button key={i} onClick={() => setInput(p)}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition font-mono truncate max-w-[200px]">
                    {p.length>30?p.substring(0,30)+'...':p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {tool === 'aes' && (
            <div>
              <label className="text-sm text-gray-400 mb-1 block">密钥:</label>
              <input value={key} onChange={e => setKey(e.target.value)}
                placeholder="输入AES密钥（至少8字符，推荐32字符用于AES-256）..."
                className="w-full px-4 py-2 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-blue-500 font-mono"/>
              {key.length > 0 && key.length < 8 && (
                <p className="text-[10px] text-red-400 mt-1">⚠️ 密钥过短（{key.length}/8），不安全</p>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleProcess} className="!bg-blue-500 text-white hover:!bg-blue-400 flex-1">
              <Wrench size={16}/> 执行
            </Button>
            {output && (
              <Button variant="outline" onClick={() => {
                navigator.clipboard.writeText(output).catch(()=>{});
              }} className="border-gray-600 text-gray-400">
                <Copy size={14}/>
              </Button>
            )}
          </div>

          {output && (
            <pre className="p-3 bg-black/50 rounded-lg text-xs text-gray-300 whitespace-pre-wrap border border-gray-700 font-mono max-h-[400px] overflow-y-auto">
              {output}
            </pre>
          )}
        </div>
      </Card>

      {/* Key concepts card */}
      {tool === 'compare' && (
        <Card className="border-yellow-500/20">
          <h4 className="text-yellow-400 font-medium text-sm mb-3">⚖️ 常见误区对照表</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-500 border-b border-gray-700">
                  <th className="text-left py-2 px-2">特性</th>
                  <th className="text-left py-2 px-2">Base64编码</th>
                  <th className="text-left py-2 px-2">哈希(Hash)</th>
                  <th className="text-left py-2 px-2">加密(Encryption)</th>
                </tr>
              </thead>
              <tbody className="text-gray-400">
                <tr className="border-b border-gray-700/30">
                  <td className="py-2 px-2">需要密钥</td>
                  <td className="py-2 px-2 text-red-400">❌ 不需要</td>
                  <td className="py-2 px-2 text-red-400">❌ 不需要</td>
                  <td className="py-2 px-2 text-green-400">✅ 需要</td>
                </tr>
                <tr className="border-b border-gray-700/30">
                  <td className="py-2 px-2">可逆</td>
                  <td className="py-2 px-2 text-green-400">✅ 可逆</td>
                  <td className="py-2 px-2 text-red-400">❌ 不可逆</td>
                  <td className="py-2 px-2 text-green-400">✅ 可逆(有密钥)</td>
                </tr>
                <tr className="border-b border-gray-700/30">
                  <td className="py-2 px-2">输出长度</td>
                  <td className="py-2 px-2">可变(~1.33×输入)</td>
                  <td className="py-2 px-2 text-green-400">固定</td>
                  <td className="py-2 px-2">可变</td>
                </tr>
                <tr className="border-b border-gray-700/30">
                  <td className="py-2 px-2">安全性</td>
                  <td className="py-2 px-2 text-red-400">❌ 无安全保护</td>
                  <td className="py-2 px-2 text-yellow-400">⚠️ 防篡改/不防泄露</td>
                  <td className="py-2 px-2 text-green-400">✅ 机密性保护</td>
                </tr>
                <tr>
                  <td className="py-2 px-2">典型用途</td>
                  <td className="py-2 px-2">URL/JSON传输</td>
                  <td className="py-2 px-2">密码存储/完整性</td>
                  <td className="py-2 px-2">数据加密/通信安全</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
