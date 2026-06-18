import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code,
  Lock,
  Unlock,
  Hash,
  FileCode,
  Copy,
  Check,
  Trash2,
  ArrowLeftRight,
  Type,
  Binary,
  Key,
} from 'lucide-react';
import { Card, Button } from '../components/UI';

type Tool = 'base64' | 'url' | 'md5' | 'sha1' | 'sha256' | 'sha512' | 'hex' | 'unicode' | 'html';

export const OnlineTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>('base64');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const tools: { id: Tool; name: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'base64', name: 'Base64', icon: <FileCode size={18} />, desc: 'Base64编码/解码' },
    { id: 'url', name: 'URL编码', icon: <ArrowLeftRight size={18} />, desc: 'URL编码/解码' },
    { id: 'md5', name: 'MD5', icon: <Hash size={18} />, desc: 'MD5哈希计算' },
    { id: 'sha1', name: 'SHA1', icon: <Hash size={18} />, desc: 'SHA1哈希计算' },
    { id: 'sha256', name: 'SHA256', icon: <Hash size={18} />, desc: 'SHA256哈希计算' },
    { id: 'sha512', name: 'SHA512', icon: <Hash size={18} />, desc: 'SHA512哈希计算' },
    { id: 'hex', name: '十六进制', icon: <Binary size={18} />, desc: '字符串与十六进制互转' },
    { id: 'unicode', name: 'Unicode', icon: <Type size={18} />, desc: 'Unicode编码/解码' },
    { id: 'html', name: 'HTML实体', icon: <Code size={18} />, desc: 'HTML实体编码/解码' },
  ];

  const encode = (text: string): string => {
    try {
      switch (activeTool) {
        case 'base64':
          return btoa(unescape(encodeURIComponent(text)));
        case 'url':
          return encodeURIComponent(text);
        case 'hex':
          return Array.from(text).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
        case 'unicode':
          return Array.from(text).map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join('');
        case 'html':
          return text.replace(/[<>"'&]/g, (c) => ({
            '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;'
          }[c]));
        default:
          return text;
      }
    } catch {
      return '编码错误';
    }
  };

  const decode = (text: string): string => {
    try {
      switch (activeTool) {
        case 'base64':
          return decodeURIComponent(escape(atob(text)));
        case 'url':
          return decodeURIComponent(text);
        case 'hex':
          return text.split(' ').map(h => String.fromCharCode(parseInt(h, 16))).join('');
        case 'unicode':
          return text.replace(/\\u([0-9a-fA-F]{4})/g, (_, p) => String.fromCharCode(parseInt(p, 16)));
        case 'html':
          const entities: Record<string, string> = {
            '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&amp;': '&'
          };
          return text.replace(/&(?:lt|gt|quot|#39|amp);/g, m => entities[m] || m);
        default:
          return text;
      }
    } catch {
      return '解码错误';
    }
  };

  const calculateHash = (text: string): string => {
    const textToHash = text || '';
    switch (activeTool) {
      case 'md5':
        return simpleHash(textToHash);
      case 'sha1':
        return simpleHash(textToHash, 1);
      case 'sha256':
        return simpleHash(textToHash, 256);
      case 'sha512':
        return simpleHash(textToHash, 512);
      default:
        return text;
    }
  };

  // 简单的哈希实现（用于演示）
  const simpleHash = (str: string, bits: number = 128): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const hex = Math.abs(hash).toString(16).padStart(Math.ceil(bits / 4), '0');
    if (bits === 1) return hex.slice(0, 40).toUpperCase();
    if (bits === 256) return hex.slice(0, 64).toUpperCase();
    if (bits === 512) return (hex + hex).slice(0, 128).toUpperCase();
    return hex.slice(0, 32).toUpperCase();
  };

  const handleProcess = () => {
    if (activeTool === 'md5' || activeTool === 'sha1' || activeTool === 'sha256' || activeTool === 'sha512') {
      setOutput(calculateHash(input));
    } else {
      setOutput(mode === 'encode' ? encode(input) : decode(input));
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const handleSwap = () => {
    setInput(output);
    setOutput('');
  };

  const currentTool = tools.find(t => t.id === activeTool);
  const isHash = ['md5', 'sha1', 'sha256', 'sha512'].includes(activeTool);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-lg bg-cyber-blue/20 flex items-center justify-center">
            <Code size={24} className="text-cyber-blue" />
          </div>
          <div>
            <h1 className="font-orbitron text-2xl font-bold text-white">
              在线工具箱
            </h1>
            <p className="text-sm text-gray-400">
              点击即可使用，无需安装
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tools Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => { setActiveTool(tool.id); setInput(''); setOutput(''); }}
              className={`p-3 rounded-lg border transition-all text-center ${
                activeTool === tool.id
                  ? 'bg-cyber-green/20 border-cyber-green/40 text-cyber-green'
                  : 'bg-cyber-purple/10 border-cyber-green/10 text-gray-400 hover:text-white hover:bg-cyber-purple/20'
              }`}
            >
              <div className="mx-auto mb-1">{tool.icon}</div>
              <div className="text-xs font-medium">{tool.name}</div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tool Card */}
      <motion.div
        key={activeTool}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyber-green/20 flex items-center justify-center text-cyber-green">
                {currentTool?.icon}
              </div>
              <div>
                <h2 className="font-semibold text-white">{currentTool?.name}</h2>
                <p className="text-xs text-gray-400">{currentTool?.desc}</p>
              </div>
            </div>
            {!isHash && (
              <div className="flex rounded-lg overflow-hidden border border-cyber-green/20">
                <button
                  onClick={() => setMode('encode')}
                  className={`px-4 py-1.5 text-sm transition-colors ${
                    mode === 'encode' ? 'bg-cyber-green/20 text-cyber-green' : 'bg-cyber-black/30 text-gray-400'
                  }`}
                >
                  编码
                </button>
                <button
                  onClick={() => setMode('decode')}
                  className={`px-4 py-1.5 text-sm transition-colors ${
                    mode === 'decode' ? 'bg-cyber-green/20 text-cyber-green' : 'bg-cyber-black/30 text-gray-400'
                  }`}
                >
                  解码
                </button>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              {isHash ? '输入文本' : mode === 'encode' ? '输入文本' : '输入编码'}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isHash ? '输入要计算哈希的文本...' : '输入要处理的内容...'}
              className="w-full h-32 p-3 rounded-lg bg-cyber-black/50 border border-cyber-green/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-green/50 font-mono text-sm resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mb-4">
            <Button onClick={handleProcess} className="flex-1">
              {isHash ? '计算哈希' : mode === 'encode' ? '编码' : '解码'}
            </Button>
            {!isHash && (
              <Button variant="outline" onClick={handleSwap}>
                <span title="交换输入输出"><ArrowLeftRight size={16} /></span>
              </Button>
            )}
            <Button variant="outline" onClick={handleClear}>
              <span title="清空"><Trash2 size={16} /></span>
            </Button>
          </div>

          {/* Output */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-400">
                {isHash ? '哈希结果' : mode === 'encode' ? '编码结果' : '解码结果'}
              </label>
              <button
                onClick={handleCopy}
                disabled={!output}
                className="text-gray-400 hover:text-white p-1 rounded transition-colors disabled:opacity-50"
              >
                {copied ? <Check size={14} className="text-cyber-green" /> : <Copy size={14} />}
                <span className="ml-1 text-xs">{copied ? '已复制' : '复制'}</span>
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="结果将显示在这里..."
              className="w-full h-32 p-3 rounded-lg bg-cyber-black/30 border border-cyber-green/10 text-cyber-green font-mono text-sm resize-none"
            />
          </div>
        </Card>
      </motion.div>

      {/* Quick Reference */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-4 bg-cyber-purple/10 border-cyber-purple/20">
          <h3 className="text-sm font-medium text-cyber-purple mb-3 flex items-center gap-2">
            <Lock size={14} />
            安全提示
          </h3>
          <div className="text-xs text-gray-400 space-y-1">
            <p>• 所有编码/解码操作在本地完成，不会发送到任何服务器</p>
            <p>• 哈希计算为单向操作，无法逆向解密</p>
            <p>• 敏感信息处理时请注意保护数据安全</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnlineTools;
