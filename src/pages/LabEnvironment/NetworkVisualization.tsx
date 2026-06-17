import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RefreshCw, Trash2 } from 'lucide-react';
import { Card, Button } from '../../components/UI';

export const NetworkVisualization: React.FC = () => {
  const [attack, setAttack] = useState<'arp'|'dns'|'mitm'|'syn'>('arp');
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const attacks = {
    arp: { name: 'ARP欺骗', desc: '攻击者伪装成网关，拦截受害者的网络流量' },
    dns: { name: 'DNS劫持', desc: '篡改DNS响应，将受害者重定向到钓鱼网站' },
    mitm: { name: '中间人攻击', desc: '攻击者插入通信双方之间，窃取或篡改数据' },
    syn: { name: 'SYN Flood', desc: '发送大量SYN请求耗尽服务器连接资源' },
  };

  const steps: Record<string, string[]> = {
    arp: [
      '👤 受害者(192.168.1.10) 发送ARP请求: "谁是192.168.1.1?"',
      '🌐 网关(192.168.1.1) 响应: "我是，MAC=aa:bb:cc:dd:ee:ff"',
      '👺 攻击者(192.168.1.99) 发送伪造ARP响应: "192.168.1.1 的MAC是 11:22:33:44:55:66"',
      '📋 受害者ARP缓存被污染! 流量将被发送到攻击者',
      '⚠️ 攻击者现在可以拦截、修改或转发所有流量',
    ],
    dns: [
      '👤 用户请求解析 bank.example.com',
      '👺 攻击者拦截DNS查询并伪造响应',
      '📬 DNS响应: bank.example.com → 192.168.1.99 (攻击者IP)',
      '🌐 用户被重定向到伪造的银行网站',
      '⚠️ 用户输入凭据被窃取!',
    ],
    mitm: [
      '🤝 Alice ↔ Bob 建立通信',
      '👺 攻击者插入通信链路',
      '📤 Alice → 攻击者："这是我的公钥"',
      '👺 攻击者 → Bob："这是我的公钥"(替换后的)',
      '📥 Bob → 攻击者：加密消息',
      '👺 攻击者解密 → 读取 → 重新加密 → Alice',
      '⚠️ 通信内容被完全窃听!',
    ],
    syn: [
      '👺 攻击者发送大量SYN包 → 服务器',
      '📊 SYN包 #1: src=192.168.1.100:12345',
      '📊 SYN包 #2: src=192.168.1.101:23456',
      '... 持续发送数千个伪造SYN包 ...',
      '🖥️ 服务器半连接队列已满!',
      '🚫 服务器拒绝新连接: SYN queue overflow',
      '⚠️ 合法用户无法访问服务!',
    ],
  };

  const handleRun = () => {
    setRunning(true);
    setLog([]);
    const s = steps[attack];
    s.forEach((step, i) => {
      setTimeout(() => {
        setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step}`]);
        if (i === s.length - 1) setRunning(false);
      }, (i + 1) * 1200);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {(['arp','dns','mitm','syn'] as const).map(a => (
          <button key={a} onClick={() => { setAttack(a); setLog([]); setRunning(false); }}
            className={`px-4 py-2 rounded-lg text-sm transition ${attack===a ? 'bg-green-500 text-white' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}>
            {attacks[a].name}
          </button>
        ))}
      </div>
      <Card className="border-green-500/20">
        <p className="text-sm text-gray-400 mb-3">{attacks[attack].desc}</p>
        <div className="flex items-center gap-4 mb-4">
          <Button onClick={handleRun} disabled={running} className="!bg-green-400 !text-black hover:!bg-green-300">
            <Play size={16}/> {running ? '运行中...' : '开始模拟'}
          </Button>
          <button onClick={() => setLog([])}
            className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition">
            <Trash2 size={14} className="inline mr-1"/> 清除日志
          </button>
        </div>
        <div className="bg-black/70 rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-y-auto border border-gray-700">
          {log.length === 0 && !running && (
            <p className="text-gray-500 text-sm text-center py-8">点击"开始模拟"查看攻击过程</p>
          )}
          {log.map((line, i) => (
            <motion.div key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}
              className="text-xs font-mono text-gray-300 py-0.5">
              <span className="text-gray-500 mr-2">{i+1}.</span>{line}
            </motion.div>
          ))}
          {running && <RefreshCw size={16} className="animate-spin text-green-400 mt-2"/>}
        </div>
      </Card>
    </div>
  );
};
