import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSearch, RefreshCw, BarChart3, Shield, AlertTriangle, TrendingUp, Filter, Clock } from 'lucide-react';
import { Card, Button } from '../../components/UI';

type LogType = 'nginx'|'ssh'|'firewall'|'ids';

interface LogEntry {
  line: string;
  malicious: boolean;
  reason: string;
  severity: 'low'|'medium'|'high'|'critical';
  sourceIp?: string;
}

// === Log data ===
const nginxLogs: LogEntry[] = [
  { line:'192.168.1.10 - - [10/Jun/2026:14:30:00 +0800] "GET /index.html HTTP/1.1" 200 2326', malicious:false, reason:'正常页面访问', severity:'low', sourceIp:'192.168.1.10' },
  { line:'192.168.1.10 - - [10/Jun/2026:14:30:05 +0800] "GET /admin.php HTTP/1.1" 403 162', malicious:true, reason:'未授权访问管理后台', severity:'medium', sourceIp:'192.168.1.10' },
  { line:'10.0.0.99 - - [10/Jun/2026:14:31:00 +0800] "GET /?id=1\' UNION SELECT * FROM users-- HTTP/1.1" 200 445', malicious:true, reason:'SQL注入攻击 (UNION注入)', severity:'critical', sourceIp:'10.0.0.99' },
  { line:'10.0.0.99 - - [10/Jun/2026:14:31:02 +0800] "GET /search?q=<script>alert(1)</script> HTTP/1.1" 200 892', malicious:true, reason:'XSS攻击 (反射型)', severity:'high', sourceIp:'10.0.0.99' },
  { line:'192.168.1.10 - - [10/Jun/2026:14:32:00 +0800] "GET /images/logo.png HTTP/1.1" 200 12500', malicious:false, reason:'正常资源请求', severity:'low', sourceIp:'192.168.1.10' },
  { line:'10.0.0.99 - - [10/Jun/2026:14:33:00 +0800] "POST /wp-login.php HTTP/1.1" 200 452', malicious:true, reason:'暴力破解WordPress登录', severity:'high', sourceIp:'10.0.0.99' },
  { line:'10.0.0.99 - - [10/Jun/2026:14:33:05 +0800] "POST /wp-login.php HTTP/1.1" 200 452', malicious:true, reason:'暴力破解尝试(第2次)', severity:'high', sourceIp:'10.0.0.99' },
  { line:'10.0.0.99 - - [10/Jun/2026:14:33:10 +0800] "POST /wp-login.php HTTP/1.1" 200 452', malicious:true, reason:'暴力破解尝试(第3次)', severity:'high', sourceIp:'10.0.0.99' },
  { line:'10.0.0.99 - - [10/Jun/2026:14:34:00 +0800] "GET /api/users/../../../etc/passwd HTTP/1.1" 403 178', malicious:true, reason:'路径遍历攻击', severity:'high', sourceIp:'10.0.0.99' },
  { line:'192.168.1.20 - - [10/Jun/2026:14:35:00 +0800] "GET /about.html HTTP/1.1" 200 890', malicious:false, reason:'正常页面访问', severity:'low', sourceIp:'192.168.1.20' },
  { line:'10.0.0.99 - - [10/Jun/2026:14:36:00 +0800] "POST /api/upload HTTP/1.1" 200 1024', malicious:true, reason:'可疑文件上传 (.php文件)', severity:'critical', sourceIp:'10.0.0.99' },
  { line:'192.168.1.10 - - [10/Jun/2026:14:37:00 +0800] "GET /products HTTP/1.1" 200 4500', malicious:false, reason:'正常页面访问', severity:'low', sourceIp:'192.168.1.10' },
];

const sshLogs: LogEntry[] = [
  { line:'Jun 10 14:30:00 server sshd[12345]: Accepted password for admin from 192.168.1.10', malicious:false, reason:'正常管理员登录', severity:'low', sourceIp:'192.168.1.10' },
  { line:'Jun 10 14:31:00 server sshd[12346]: Failed password for root from 10.0.0.99', malicious:true, reason:'非法尝试以root登录', severity:'high', sourceIp:'10.0.0.99' },
  { line:'Jun 10 14:31:05 server sshd[12347]: Failed password for root from 10.0.0.99', malicious:true, reason:'重复root登录尝试', severity:'high', sourceIp:'10.0.0.99' },
  { line:'Jun 10 14:31:10 server sshd[12348]: Failed password for admin from 10.0.0.99', malicious:true, reason:'暴力破解admin账号', severity:'high', sourceIp:'10.0.0.99' },
  { line:'Jun 10 14:31:15 server sshd[12349]: Failed password for ubuntu from 10.0.0.99', malicious:true, reason:'暴力破解继续(ubuntu)', severity:'high', sourceIp:'10.0.0.99' },
  { line:'Jun 10 14:31:20 server sshd[12350]: Failed password for debian from 10.0.0.99', malicious:true, reason:'暴力破解继续(debian)', severity:'high', sourceIp:'10.0.0.99' },
  { line:'Jun 10 14:32:00 server sshd[12351]: Accepted publickey for devuser from 192.168.1.20', malicious:false, reason:'正常密钥登录', severity:'low', sourceIp:'192.168.1.20' },
  { line:'Jun 10 14:33:00 server sshd[12352]: Failed password for nobody from 10.0.0.99', malicious:true, reason:'暴力破解持续(nobody)', severity:'high', sourceIp:'10.0.0.99' },
  { line:'Jun 10 14:34:00 server sshd[12353]: Accepted password for admin from 192.168.1.10', malicious:false, reason:'管理员的正常退出/重连', severity:'low', sourceIp:'192.168.1.10' },
  { line:'Jun 10 14:35:00 server sshd[12354]: error: maximum authentication attempts exceeded for root from 10.0.0.99', malicious:true, reason:'达到最大认证尝试次数(暴力破解确认)', severity:'critical', sourceIp:'10.0.0.99' },
];

const firewallLogs: LogEntry[] = [
  { line:'Jun 10 14:00:01 fw kernel: IN=eth0 OUT= MAC=... SRC=10.0.0.99 DST=192.168.1.10 PROTO=TCP SPT=45678 DPT=22', malicious:true, reason:'外部IP扫描SSH端口(22)', severity:'medium', sourceIp:'10.0.0.99' },
  { line:'Jun 10 14:00:02 fw kernel: IN=eth0 OUT= MAC=... SRC=10.0.0.99 DST=192.168.1.10 PROTO=TCP SPT=45679 DPT=3306', malicious:true, reason:'MySQL端口扫描(3306)', severity:'medium', sourceIp:'10.0.0.99' },
  { line:'Jun 10 14:00:03 fw kernel: IN=eth0 OUT= MAC=... SRC=10.0.0.99 DST=192.168.1.10 PROTO=TCP SPT=45680 DPT=6379', malicious:true, reason:'Redis端口扫描(6379)', severity:'medium', sourceIp:'10.0.0.99' },
  { line:'Jun 10 14:30:00 fw kernel: IN=eth0 OUT= MAC=... SRC=192.168.1.10 DST=8.8.8.8 PROTO=UDP SPT=12345 DPT=53', malicious:false, reason:'正常DNS查询', severity:'low', sourceIp:'192.168.1.10' },
  { line:'Jun 10 14:31:00 fw kernel: IN=eth0 OUT= MAC=... SRC=10.0.0.99 DST=192.168.1.10 PROTO=TCP SPT=45999 DPT=3389', malicious:true, reason:'RDP端口扫描(3389)', severity:'high', sourceIp:'10.0.0.99' },
  { line:'Jun 10 14:32:00 fw kernel: IN=eth0 OUT= MAC=... SRC=10.0.0.99 DST=192.168.1.10 PROTO=TCP SPT=46000 DPT=445', malicious:true, reason:'SMB端口扫描(445)', severity:'high', sourceIp:'10.0.0.99' },
  { line:'Jun 10 14:33:00 fw kernel: IN=eth0 OUT= MAC=... SRC=192.168.1.20 DST=192.168.1.10 PROTO=TCP SPT=52443 DPT=443', malicious:false, reason:'正常HTTPS访问', severity:'low', sourceIp:'192.168.1.20' },
  { line:'Jun 10 14:34:00 fw kernel: IN=eth0 OUT= MAC=... SRC=10.0.0.99 DST=192.168.1.10 PROTO=ICMP TYPE=8 CODE=0', malicious:true, reason:'ICMP Ping探测', severity:'low', sourceIp:'10.0.0.99' },
  { line:'Jun 10 14:35:00 fw kernel: IN=eth0 OUT= MAC=... SRC=10.0.0.88 DST=192.168.1.10 PROTO=TCP SPT=60000 DPT=80', malicious:true, reason:'Web应用扫描(80端口)', severity:'medium', sourceIp:'10.0.0.88' },
  { line:'Jun 10 14:36:00 fw kernel: DROP IN=eth0 OUT= MAC=... SRC=10.0.0.99 DST=192.168.1.10 PROTO=TCP SPT=46111 DPT=23', malicious:true, reason:'Telnet端口被防火墙DROP', severity:'medium', sourceIp:'10.0.0.99' },
];

const idsLogs: LogEntry[] = [
  { line:'[1:2001:5] WEB-ATTACKS /etc/passwd access attempt [Classification: Attempted Information Leak] [Priority: 2] 10.0.0.99:45999 -> 192.168.1.10:80', malicious:true, reason:'路径遍历: 尝试访问/etc/passwd', severity:'high', sourceIp:'10.0.0.99' },
  { line:'[1:1001:8] WEB-ATTACKS SQL Injection attempt [Classification: Web Application Attack] [Priority: 1] 10.0.0.99:46000 -> 192.168.1.10:80', malicious:true, reason:'SQL注入攻击检测', severity:'critical', sourceIp:'10.0.0.99' },
  { line:'[1:3001:3] WEB-ATTACKS XSS attempt [Classification: Web Application Attack] [Priority: 2] 10.0.0.99:46001 -> 192.168.1.10:80', malicious:true, reason:'XSS跨站脚本攻击', severity:'high', sourceIp:'10.0.0.99' },
  { line:'[1:4001:6] SHELLCODE x86 NOOP [Classification: Executable Code Detected] [Priority: 1] 10.0.0.99:46002 -> 192.168.1.10:80', malicious:true, reason:'检测到Shellcode (NOP sled)', severity:'critical', sourceIp:'10.0.0.99' },
  { line:'[1:5001:2] BACKDOOR PHP Webshell access [Classification: System Shellcode] [Priority: 1] 10.0.0.99:46003 -> 192.168.1.10:80', malicious:true, reason:'PHP Webshell连接尝试', severity:'critical', sourceIp:'10.0.0.99' },
  { line:'[3:6001:4] SCAN NMAP TCP [Classification: Attempted Reconnaissance] [Priority: 3] 10.0.0.88:55555 -> 192.168.1.10', malicious:true, reason:'Nmap扫描检测(TCP SYN)', severity:'low', sourceIp:'10.0.0.88' },
  { line:'[1:7001:1] MALWARE-CNC Win.Trojan.CobaltStrike outbound connection [Classification: A Network Trojan was Detected] [Priority: 1] 192.168.1.10:49152 -> 10.0.0.99:443', malicious:true, reason:'CobaltStrike C2通信(已失陷主机)', severity:'critical', sourceIp:'192.168.1.10' },
  { line:'[3:8001:1] PROTOCOL-DNS DNS zone transfer attempt [Classification: Attempted Information Leak] [Priority: 3] 10.0.0.99:53 -> 192.168.1.10:53', malicious:true, reason:'DNS区域传送尝试', severity:'medium', sourceIp:'10.0.0.99' },
  { line:'[1:9001:7] EXPLOIT MS17-010 EternalBlue SMB remote code execution [Classification: Attempted Administrator Privilege Gain] [Priority: 1] 10.0.0.99:445 -> 192.168.1.10:445', malicious:true, reason:'永恒之蓝(EternalBlue)漏洞利用', severity:'critical', sourceIp:'10.0.0.99' },
  { line:'192.168.1.10 -> 93.184.216.34:443 HTTPS Normal outbound traffic', malicious:false, reason:'正常HTTPS出站流量', severity:'low', sourceIp:'192.168.1.10' },
];

const logDataMap: Record<LogType, {name:string; logs:LogEntry[]; desc:string}> = {
  nginx:   { name:'Nginx访问日志', desc:'Web服务器访问日志，记录所有HTTP请求', logs:nginxLogs },
  ssh:     { name:'SSH认证日志', desc:'SSH登录认证日志，记录成功/失败登录', logs:sshLogs },
  firewall:{ name:'防火墙日志', desc:'iptables/netfilter内核日志，记录网络层连接', logs:firewallLogs },
  ids:     { name:'IDS/IPS告警日志', desc:'入侵检测系统(Snort/Suricata)规则告警', logs:idsLogs },
};

export const LogAnalysis: React.FC = () => {
  const [logType, setLogType] = useState<LogType>('nginx');
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const logData = logDataMap[logType];
  const logs = logData.logs;

  const filteredLogs = filterSeverity==='all' ? logs : logs.filter(l => l.severity===filterSeverity);

  const toggleMark = (i: number) => {
    const newMarked = new Set(marked);
    if (newMarked.has(i)) newMarked.delete(i);
    else newMarked.add(i);
    setMarked(newMarked);
  };

  const handleSelectAllMalicious = () => {
    const maliciousIdx = new Set<number>();
    filteredLogs.forEach((l,i) => {if(l.malicious) maliciousIdx.add(i);});
    setMarked(maliciousIdx);
  };

  const handleCheck = () => {
    const checked = filteredLogs;
    const tp = checked.filter((l,i) => l.malicious && marked.has(i)).length; // true positive
    const fp = checked.filter((l,i) => !l.malicious && marked.has(i)).length; // false positive
    const fn = checked.filter((l,i) => l.malicious && !marked.has(i)).length; // false negative
    const tn = checked.filter((l,i) => !l.malicious && !marked.has(i)).length; // true negative
    const accuracy = ((tp+tn)/checked.length*100).toFixed(1);
    const precision = tp+fp===0?'N/A':(tp/(tp+fp)*100).toFixed(1);
    const recall = tp+fn===0?'N/A':(tp/(tp+fn)*100).toFixed(1);

    setFeedback(`📊 分析报告:\n\n✅ 正确标记(TP): ${tp} | ✅ 正确忽略(TN): ${tn}\n❌ 误报(FP): ${fp} | ❌ 漏报(FN): ${fn}\n\n📈 准确率(Accuracy): ${accuracy}%\n🎯 精确率(Precision): ${precision}%\n🔍 召回率(Recall): ${recall}%\n\n${fn===0?'🎉 完美！所有攻击行为已被识别':'⚠️ 有 '+fn+' 个攻击行为被漏报！'}`);
  };

  // Statistics
  const totalMalicious = logs.filter(l=>l.malicious).length;
  const uniqueAttackIPs = [...new Set(logs.filter(l=>l.malicious).map(l=>l.sourceIp).filter(Boolean))];
  const severityCount = {
    critical: logs.filter(l=>l.malicious&&l.severity==='critical').length,
    high: logs.filter(l=>l.malicious&&l.severity==='high').length,
    medium: logs.filter(l=>l.malicious&&l.severity==='medium').length,
    low: logs.filter(l=>l.malicious&&l.severity==='low').length,
  };
  const severityColors = {
    critical:'text-red-400 bg-red-500/10',
    high:'text-orange-400 bg-orange-500/10',
    medium:'text-yellow-400 bg-yellow-500/10',
    low:'text-blue-400 bg-blue-500/10',
  };

  const formatLine = (line: string) => {
    // Highlight IPs and key patterns
    return line
      .replace(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g, '<span class="text-cyan-400">$1</span>')
      .replace(/(Failed password|Accepted password|Accepted publickey)/g, '<span class="text-yellow-400">$1</span>')
      .replace(/(DROP|REJECT)/g, '<span class="text-red-400">$1</span>');
  };

  return (
    <div className="space-y-4">
      {/* Source type tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {(Object.keys(logDataMap) as LogType[]).map(t => (
          <button key={t} onClick={() => { setLogType(t); setMarked(new Set()); setFeedback(''); setFilterSeverity('all'); }}
            className={`px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1 ${
              logType===t ? 'bg-lime-500 text-black font-medium shadow-lg shadow-lime-500/20' : 'bg-lime-500/10 text-lime-400 hover:bg-lime-500/20'}`}>
              {{nginx:'🌐',ssh:'🔐',firewall:'🔥',ids:'🛡️'}[t]} {logDataMap[t].name}
          </button>
        ))}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2 rounded-lg bg-black/30 border border-gray-700/30">
          <p className="text-[10px] text-gray-500">总日志数</p>
          <p className="text-sm font-mono font-bold text-gray-300">{logs.length}</p>
        </div>
        <div className="p-2 rounded-lg bg-red-500/5 border border-red-500/20">
          <p className="text-[10px] text-gray-500">恶意行为</p>
          <p className="text-sm font-mono font-bold text-red-400">{totalMalicious}</p>
        </div>
        <div className="p-2 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
          <p className="text-[10px] text-gray-500">攻击源IP</p>
          <p className="text-sm font-mono font-bold text-cyan-400">{uniqueAttackIPs.length}</p>
        </div>
        <div className="p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
          <p className="text-[10px] text-gray-500">高危/严重</p>
          <p className="text-sm font-mono font-bold text-yellow-400">{severityCount.critical+severityCount.high}</p>
        </div>
      </div>

      {/* Severity breakdown */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-gray-500">严重等级:</span>
        {(['critical','high','medium','low'] as const).map(s => (
          <button key={s} onClick={() => setFilterSeverity(filterSeverity===s?'all':s)}
            className={`px-2 py-0.5 rounded text-[10px] transition ${severityColors[s]} ${
              filterSeverity===s ? 'ring-1 ring-lime-400' : 'opacity-60 hover:opacity-100'}`}>
            {s.toUpperCase()} ({severityCount[s]})
          </button>
        ))}
        {filterSeverity!=='all' && (
          <button onClick={() => setFilterSeverity('all')}
            className="text-[10px] text-lime-400 hover:underline">清除筛选</button>
        )}
      </div>

      {/* Log table */}
      <Card className="border-lime-500/20">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <p className="text-xs text-gray-500">
            📋 {logData.desc} — 点击每行标记可疑行为
            {filterSeverity!=='all' && (
              <span className="text-lime-400 ml-1">（已筛选: {filterSeverity.toUpperCase()}）</span>
            )}
          </p>
          <button onClick={handleSelectAllMalicious}
            className="text-[10px] text-lime-400 hover:underline">
            🔍 自动标记所有恶意行为
          </button>
        </div>
        <div className="space-y-1 mb-3 max-h-[500px] overflow-y-auto">
          {filteredLogs.map((l, i) => (
            <div key={i} onClick={() => toggleMark(i)}
              className={`p-2 rounded text-xs font-mono cursor-pointer transition border flex items-start gap-2 ${
                marked.has(i) ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-black/30 border-gray-700/50 text-gray-400 hover:border-gray-500'
              }`}>
              <span className={`text-[10px] px-1 rounded flex-shrink-0 mt-0.5 ${severityColors[l.severity]}`}>
                {l.severity.toUpperCase()}
              </span>
              <span className="flex-shrink-0 mt-0.5">{marked.has(i) ? '🔴' : '⚪'}</span>
              <span className="flex-1 break-all leading-relaxed">
                {l.line.split(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g).map((part, pi) =>
                  /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(part)
                    ? <span key={pi} className="text-cyan-400 font-bold">{part}</span>
                    : part
                )}
              </span>
            </div>
          ))}
          {filteredLogs.length === 0 && (
            <p className="text-gray-600 text-sm py-8 text-center">无匹配日志</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleCheck} className="!bg-lime-400 !text-black hover:!bg-lime-300">
            <FileSearch size={16}/> 提交分析
          </Button>
          <Button variant="outline" onClick={() => { setMarked(new Set()); setFeedback(''); }}>
            <RefreshCw size={16}/> 重置
          </Button>
          <span className="text-[11px] text-gray-600 flex items-center gap-1 ml-auto">
            <Filter size={12}/> 已标记: {marked.size}/{filteredLogs.length}
          </span>
        </div>

        {/* Feedback panel */}
        {feedback && (
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
            className="mt-4 p-3 bg-lime-500/10 border border-lime-500/30 rounded-lg">
            <pre className="text-xs text-lime-300 whitespace-pre-wrap font-mono">{feedback}</pre>
            <div className="mt-3 space-y-1.5">
              <p className="text-[11px] text-gray-500">📋 详细结果:</p>
              {filteredLogs.map((l,i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  {marked.has(i) === l.malicious ? (
                    <span className="text-green-400">✅ {l.reason}</span>
                  ) : (
                    <span className={l.malicious ? 'text-red-400' : 'text-yellow-400'}>
                      {l.malicious ? `⚠️ 漏报(FN): ${l.reason}` : `ℹ️ 误报(FP): ${l.reason}`}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </Card>
    </div>
  );
};
