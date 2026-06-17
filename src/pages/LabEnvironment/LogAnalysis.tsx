import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSearch, RefreshCw } from 'lucide-react';
import { Card, Button } from '../../components/UI';

export const LogAnalysis: React.FC = () => {
  const [logType, setLogType] = useState<'nginx'|'ssh'>('nginx');
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState('');

  const nginxLogs = [
    { line: '192.168.1.10 - - [10/Jun/2026:14:30:00 +0800] "GET /index.html HTTP/1.1" 200 2326', malicious: false, reason: '正常页面访问' },
    { line: '192.168.1.10 - - [10/Jun/2026:14:30:05 +0800] "GET /admin.php HTTP/1.1" 403 162', malicious: true, reason: '尝试访问管理后台' },
    { line: '10.0.0.99 - - [10/Jun/2026:14:31:00 +0800] "GET /?id=1\' UNION SELECT * FROM users-- HTTP/1.1" 200 445', malicious: true, reason: 'SQL注入攻击' },
    { line: '10.0.0.99 - - [10/Jun/2026:14:31:02 +0800] "GET /search?q=<script>alert(1)</script> HTTP/1.1" 200 892', malicious: true, reason: 'XSS攻击尝试' },
    { line: '192.168.1.10 - - [10/Jun/2026:14:32:00 +0800] "GET /images/logo.png HTTP/1.1" 200 12500', malicious: false, reason: '正常资源请求' },
    { line: '10.0.0.99 - - [10/Jun/2026:14:33:00 +0800] "POST /wp-login.php HTTP/1.1" 200 452', malicious: true, reason: '暴力破解WordPress登录' },
  ];

  const sshLogs = [
    { line: 'Jun 10 14:30:00 server sshd[12345]: Accepted password for admin from 192.168.1.10 port 22345', malicious: false, reason: '正常管理员登录' },
    { line: 'Jun 10 14:31:00 server sshd[12346]: Failed password for root from 10.0.0.99 port 33456', malicious: true, reason: '尝试以root登录' },
    { line: 'Jun 10 14:31:05 server sshd[12347]: Failed password for root from 10.0.0.99 port 33457', malicious: true, reason: '反复尝试root登录（暴力破解）' },
    { line: 'Jun 10 14:31:10 server sshd[12348]: Failed password for admin from 10.0.0.99 port 33458', malicious: true, reason: '暴力破解admin账号' },
    { line: 'Jun 10 14:32:00 server sshd[12349]: Accepted publickey for devuser from 192.168.1.20 port 44567', malicious: false, reason: '正常密钥登录' },
    { line: 'Jun 10 14:33:00 server sshd[12350]: Failed password for nobody from 10.0.0.99 port 33459', malicious: true, reason: '暴力破解继续尝试其他用户' },
  ];

  const logs = logType === 'nginx' ? nginxLogs : sshLogs;

  const toggleMark = (i: number) => {
    const newMarked = new Set(marked);
    if (newMarked.has(i)) newMarked.delete(i);
    else newMarked.add(i);
    setMarked(newMarked);
  };

  const handleCheck = () => {
    const correct = logs.filter((l,i) => l.malicious === marked.has(i));
    setFeedback(`分析结果: ${correct.length}/${logs.length} 正确识别`);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['nginx','ssh'] as const).map(t => (
          <button key={t} onClick={() => { setLogType(t); setMarked(new Set()); setFeedback(''); }}
            className={`px-4 py-2 rounded-lg text-sm transition ${logType===t ? 'bg-lime-500 text-black font-medium' : 'bg-lime-500/10 text-lime-400 hover:bg-lime-500/20'}`}>
            {t === 'nginx' ? 'Nginx访问日志' : 'SSH认证日志'}
          </button>
        ))}
      </div>
      <Card className="border-lime-500/20">
        <p className="text-xs text-gray-500 mb-3">📋 点击每行标记可疑的攻击行为，然后提交验证</p>
        <div className="space-y-1 mb-4">
          {logs.map((l, i) => (
            <div key={i} onClick={() => toggleMark(i)}
              className={`p-2 rounded text-xs font-mono cursor-pointer transition border ${
                marked.has(i) ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-black/30 border-gray-700/50 text-gray-400 hover:border-gray-500'
              }`}>
              <span className="mr-2">{marked.has(i) ? '🔴' : '⚪'}</span>
              {l.line}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCheck} className="!bg-lime-400 !text-black hover:!bg-lime-300">
            <FileSearch size={16}/> 提交分析
          </Button>
          <Button variant="outline" onClick={() => { setMarked(new Set()); setFeedback(''); }}>
            <RefreshCw size={16}/> 重置
          </Button>
        </div>
        {feedback && (
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
            className="mt-3 p-3 bg-lime-500/10 border border-lime-500/30 rounded-lg">
            <p className="text-sm text-lime-400">{feedback}</p>
            <div className="mt-2 space-y-1">
              {logs.map((l,i) => (
                <p key={i} className="text-xs">
                  {marked.has(i) === l.malicious ? (
                    <span className="text-green-400">✅ {l.reason}</span>
                  ) : (
                    <span className={l.malicious ? 'text-red-400' : 'text-gray-400'}>
                      {l.malicious ? `⚠️ 漏报: ${l.reason}` : `ℹ️ 误报: ${l.reason}`}
                    </span>
                  )}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </Card>
    </div>
  );
};
