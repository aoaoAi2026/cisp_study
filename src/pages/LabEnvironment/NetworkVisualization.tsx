import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RefreshCw, Trash2, Shield, Zap, Network, AlertTriangle } from 'lucide-react';
import { Card, Button } from '../../components/UI';

type AttackType = 'arp'|'dns'|'mitm'|'syn'|'dhcp'|'smurf';

interface AttackInfo {
  name: string;
  category: string;
  desc: string;
  cwe: string;
  realCase: string;
}

const attackInfo: Record<AttackType, AttackInfo> = {
  arp:   { name:'ARP欺骗', category:'链路层', desc:'攻击者发送伪造的ARP响应，将网关IP映射到攻击者MAC地址，实现流量劫持', cwe:'CWE-290', realCase:'公共WiFi中常见，攻击者伪装网关窃取密码' },
  dns:   { name:'DNS劫持', category:'应用层', desc:'篡改DNS查询响应，将受害者重定向到钓鱼网站或恶意服务器', cwe:'CWE-350', realCase:'2016年巴西银行DNS劫持事件' },
  mitm:  { name:'中间人攻击', category:'传输层', desc:'攻击者插入通信双方之间，窃取或篡改传输中的数据', cwe:'CWE-300', realCase:'DigiNotar CA被入侵导致大规模MITM' },
  syn:   { name:'SYN Flood', category:'传输层', desc:'发送大量SYN请求耗尽服务器半连接队列，使其无法响应正常请求', cwe:'CWE-770', realCase:'2016 Dyn DNS遭Mirai僵尸网络SYN Flood攻击' },
  dhcp:  { name:'DHCP欺骗', category:'链路层', desc:'部署伪造DHCP服务器，分配恶意DNS/网关配置，劫持全网流量', cwe:'CWE-923', realCase:'企业内网常见攻击，重定向用户到钓鱼页面' },
  smurf: { name:'Smurf放大攻击', category:'网络层', desc:'向广播地址发送ICMP请求，源IP伪造为受害者，利用网络放大效应实施DDoS', cwe:'CWE-405', realCase:'90年代末著名DDoS攻击手法，放大倍数可达100x' },
};

const steps: Record<AttackType, string[]> = {
  arp: [
    '👤 受害者(192.168.1.10) 发送ARP请求: "谁是192.168.1.1?"',
    '🌐 网关(192.168.1.1) 正常响应: "我是，MAC=aa:bb:cc:dd:ee:ff"',
    '👺 攻击者(192.168.1.99) 发送伪造ARP响应: "192.168.1.1的MAC是 11:22:33:44:55:66"',
    '📋 受害者ARP缓存被污染! 流量将被发送到攻击者MAC',
    '📤 受害者发送给网关的所有数据 → 实际到达攻击者',
    '⚠️ 攻击者可拦截/修改/转发所有流量 (中间人)!',
  ],
  dns: [
    '👤 用户浏览器请求解析 bank.example.com',
    '📤 DNS查询包从53端口发出 → DNS服务器',
    '👺 攻击者拦截DNS查询 (在网关/路由器/DNS路径上)',
    '📬 攻击者伪造DNS响应: bank.example.com → 192.168.1.99',
    '🌐 浏览器将用户重定向到攻击者控制的钓鱼页面',
    '🔑 用户输入凭据 → 被攻击者窃取!',
  ],
  mitm: [
    '🤝 Alice 向 Bob 发起加密通信请求',
    '🔑 Alice 发送公钥 → 等待 Bob 响应',
    '👺 攻击者截获 Alice 的公钥 → 替换为自己的公钥 → 转发给 Bob',
    '🔑 Bob 用攻击者的公钥加密 → 回复消息',
    '👺 攻击者用自己私钥解密 → 读取内容 → 用 Alice 公钥加密 → 转发',
    '🔄 双向通信均被攻击者解密、记录、篡改',
    '⚠️ Alice和Bob均未察觉! 通信完全被窃听!',
  ],
  syn: [
    '👺 攻击者伪造源IP发送SYN包 → 服务器',
    '📊 SYN包 #1: src=192.168.1.100:12345 SYN',
    '🖥️ 服务器回复 SYN-ACK → 192.168.1.100 (不存在或不应答)',
    '📊 SYN包 #2-1000: 大量伪造SYN包涌入...',
    '⏳ 服务器半连接队列逐渐填满...',
    '🚫 半连接队列达到上限 (默认1024-2048)!',
    '❌ 服务器拒绝新的合法连接请求',
    '⚠️ DOS成功! 合法用户无法访问服务',
  ],
  dhcp: [
    '📶 新设备加入网络 → 广播 DHCP Discover',
    '🖥️ 合法DHCP服务器正在响应中...',
    '👺 伪造DHCP服务器抢先响应 DHCP Offer',
    '📋 伪造Offer: IP=192.168.1.200, DNS=攻击者IP, 网关=攻击者IP',
    '📬 受害者接受伪造DHCP配置',
    '🌐 所有DNS查询和网关流量 → 被攻击者劫持',
    '⚠️ 攻击者控制全网流量的DNS解析和路由!',
  ],
  smurf: [
    '👺 攻击者构造ICMP Echo Request (Ping)',
    '📤 目标: 192.168.1.255 (广播地址)',
    '📋 源IP伪造为: 10.0.0.1 (受害者IP)',
    '🌐 广播地址 → 网络中所有主机 (可能数百台)',
    '📥 所有主机都响应 → 向伪造源IP 10.0.0.1 回复 ICMP Echo Reply',
    '💥 攻击流量被放大 100-200倍!',
    '⚠️ 受害者被海量ICMP回复淹没 → 带宽耗尽',
  ],
};

const defenseStrategies: Record<AttackType, {title:string; items:string[]}[]> = {
  arp: [
    {title:'检测',items:['ARP监控工具(arpwatch)','MAC地址变化告警','网络流量异常检测']},
    {title:'防御',items:['静态ARP表绑定(重要设备)','交换机端口安全+DAI(Dynamic ARP Inspection)','802.1X认证防止未授权接入']},
  ],
  dns: [
    {title:'检测',items:['DNS响应TTL异常检测','DNS查询频率监控','域名白名单比对']},
    {title:'防御',items:['DNSSEC签名验证','DNS over HTTPS/TLS(DoH/DoT)','使用可信DNS服务器(如8.8.8.8)']},
  ],
  mitm: [
    {title:'检测',items:['证书透明度(CT)日志监控','公钥指纹比对','TLS握手异常检测']},
    {title:'防御',items:['HTTPS+TLS 1.3','HSTS头强制HTTPS','Certificate Pinning(证书锁定)','mTLS双向认证']},
  ],
  syn: [
    {title:'检测',items:['SYN速率监控(netstat -s)','连接队列深度超标告警','DDoS流量特征分析']},
    {title:'防御',items:['SYN Cookies','增大半连接队列(backlog)','SYN Proxy(中间代理)','云WAF DDoS清洗']},
  ],
  dhcp: [
    {title:'检测',items:['DHCP服务器异常检测','多DHCP响应冲突告警','非授权DHCP服务器扫描']},
    {title:'防御',items:['交换机DHCP Snooping','端口安全+信任端口配置','802.1X网络准入控制']},
  ],
  smurf: [
    {title:'检测',items:['ICMP流量突增监控','广播地址ICMP异常','源IP与入站接口不匹配']},
    {title:'防御',items:['路由器禁止IP定向广播(no ip directed-broadcast)','入口/出口过滤(RFC 2827)','速率限制ICMP']},
  ],
};

// Network topology visualization ASCII art per attack
const topologyArt: Record<AttackType, string> = {
  arp: `    [受害者]              [网关]
  192.168.1.10          192.168.1.1
      \\   ╲                /
       \\    ╲  正常ARP     /
        \\     ╲========= /
         \\         ✘      /
          ╲              /
           ╲ 伪造ARP    /
            ╲========= /
            [攻击者]
           192.168.1.99`,
  dns: `  [用户] ----DNS查询----> [DNS服务器]
    |                          |
    |                    [攻击者截获]
    |                          |
    +<---伪造响应(恶意IP)------+`,
  mitm: `  [Alice] -----> [攻击者] -----> [Bob]
    |              |   ↑              |
    |              解密/篡改          |
    +<---- [攻击者] <----+           |
           加密转发`,
  syn: `  [攻击者] --大量SYN--> [服务器]
   伪造IP1 ──→  半连接队列
   伪造IP2 ──→  [■■■■■■■■■■] 100%
   伪造IP3 ──→  SYN Queue Overflow
               [合法用户] ✘ 拒绝`,
  dhcp: `  [新设备] --Discover--> [合法DHCP]
      |                  / 
      +---------------> [伪造DHCP] ← 更快响应!
      |                    |
      +<--恶意配置--------+`,
  smurf: `  [攻击者] --ICMP Echo--> [广播地址]
   srcIP伪造             192.168.1.255
                          /  |  \\
                     [主机A][主机B][主机C]...
                          \\  |  /
                     ICMP Reply × N倍
                           ↓
                       [受害者] 带宽耗尽!`,
};

export const NetworkVisualization: React.FC = () => {
  const [attack, setAttack] = useState<AttackType>('arp');
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [showDefense, setShowDefense] = useState(false);

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
      {/* Info card */}
      <Card className="border-green-500/15 bg-green-500/[0.02]">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-green-400 font-medium text-sm">{attackInfo[attack].name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-300">{attackInfo[attack].cwe}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-300">{attackInfo[attack].category}</span>
            </div>
            <p className="text-xs text-gray-400">{attackInfo[attack].desc}</p>
            <p className="text-[11px] text-gray-600 mt-1">📋 案例: {attackInfo[attack].realCase}</p>
          </div>
        </div>
      </Card>

      {/* Attack tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {(Object.keys(attackInfo) as AttackType[]).map(a => (
          <button key={a} onClick={() => { setAttack(a); setLog([]); setRunning(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1 ${
              attack===a ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}>
            <Zap size={12}/> {attackInfo[a].name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Topology + Controls */}
        <div className="lg:col-span-1 space-y-4">
          {/* Network Topology */}
          <Card className="border-green-500/20">
            <h4 className="text-xs text-green-400 mb-2 flex items-center gap-1">
              <Network size={12}/> 网络拓扑
            </h4>
            <pre className="text-[10px] text-gray-400 font-mono whitespace-pre overflow-x-auto bg-black/40 p-2 rounded-lg">
              {topologyArt[attack]}
            </pre>
          </Card>

          {/* Defense strategies */}
          <Card className="border-green-500/20">
            <button onClick={() => setShowDefense(!showDefense)}
              className="w-full flex items-center justify-between text-xs text-green-400">
              <span className="flex items-center gap-1"><Shield size={12}/> 防御方案</span>
              <span className="text-gray-600">{showDefense?'▲':'▼'}</span>
            </button>
            {showDefense && defenseStrategies[attack] && (
              <div className="mt-3 space-y-2">
                {defenseStrategies[attack].map((section, si) => (
                  <div key={si} className="bg-black/30 rounded-lg p-2">
                    <p className="text-[10px] text-green-300 font-medium mb-1">{section.title}</p>
                    {section.items.map((item, ii) => (
                      <p key={ii} className="text-[10px] text-gray-500 ml-2">• {item}</p>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right: Simulation */}
        <div className="lg:col-span-2">
          <Card className="border-green-500/20">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <Button onClick={handleRun} disabled={running} className="!bg-green-400 !text-black hover:!bg-green-300">
                <Play size={16}/> {running ? '运行中...' : '开始模拟'}
              </Button>
              <Button variant="outline" onClick={() => setLog([])}
                className="border-gray-600 text-gray-400">
                <Trash2 size={14}/> 清除日志
              </Button>
              <span className="text-[11px] text-gray-600">
                {running ? '⏳ 攻击进行中...' : log.length > 0 ? `✅ 完成 (${log.length}步)` : '⏸️ 等待执行'}
              </span>
            </div>

            {/* Attack step visualization */}
            <div className="bg-black/70 rounded-lg p-4 min-h-[280px] max-h-[500px] overflow-y-auto border border-gray-700">
              {log.length === 0 && !running && (
                <div className="text-center py-12">
                  <AlertTriangle size={32} className="text-gray-600 mx-auto mb-2"/>
                  <p className="text-gray-500 text-sm">点击"开始模拟"查看 {attackInfo[attack].name} 的完整攻击过程</p>
                  <p className="text-gray-600 text-[11px] mt-2">共 {steps[attack].length} 个步骤逐步演示</p>
                </div>
              )}
              {log.map((line, i) => (
                <motion.div key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}
                  className="text-xs font-mono text-gray-300 py-1 px-2 rounded hover:bg-white/5 transition">
                  <span className="text-gray-600 mr-2">{String(i+1).padStart(2,'0')}.</span>
                  {line}
                </motion.div>
              ))}
              {running && (
                <div className="flex items-center gap-2 text-green-400 text-xs mt-3">
                  <RefreshCw size={14} className="animate-spin"/>
                  <span>攻击进行中...</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
