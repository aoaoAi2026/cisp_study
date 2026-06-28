# 第二章：Nmap - 网络扫描与探测

## 2.1 Nmap 简介

<svg viewBox="0 0 1080 560" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts01" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs01" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars01" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs01"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs01)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts01)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-1 什么是 Nmap？网络探测与安全审计的瑞士军刀</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">Gordon Lyon (Fyodor) 1997 年发布 → 至今仍是渗透测试第一步</text>
  <rect x="60" y="130" width="300" height="180" rx="10" fill="#0ea5e9" fill-opacity=".18" stroke="#0ea5e9" stroke-width="1.6" filter="url(#shs01)"/>
  <text x="210.0" y="156" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">核心定义</text>
  <text x="74" y="182" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">Network Mapper = 网络映射器</text>
  <text x="74" y="200" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">开源免费（GPLv2）</text>
  <text x="74" y="218" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">跨平台 Win/Linux/mac</text>
  <text x="74" y="236" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">C/C++ 编写 + Lua NSE</text>
  <rect x="400" y="130" width="300" height="180" rx="10" fill="#8b5cf6" fill-opacity=".18" stroke="#8b5cf6" stroke-width="1.6" filter="url(#shs01)"/>
  <text x="550.0" y="156" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">典型使用场景</text>
  <text x="414" y="182" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">内网资产测绘 / 存活主机</text>
  <text x="414" y="200" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">TCP/UDP 端口开放状态</text>
  <text x="414" y="218" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">OS 指纹 + 服务版本识别</text>
  <text x="414" y="236" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">漏洞扫描（NSE 脚本）</text>
  <rect x="740" y="130" width="280" height="180" rx="10" fill="#10b981" fill-opacity=".18" stroke="#10b981" stroke-width="1.6" filter="url(#shs01)"/>
  <text x="880.0" y="156" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">与同类对比优势</text>
  <text x="754" y="182" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">最快的 SYN 半开扫描</text>
  <text x="754" y="200" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">TCP 栈指纹全球最全</text>
  <text x="754" y="218" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">NSE 脚本 600+ 社区活跃</text>
  <text x="754" y="236" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">输出格式标准化易集成</text>
  <rect x="60" y="340" width="960" height="180" rx="10" fill="#b45309" fill-opacity=".18" stroke="#b45309" stroke-width="1.6" filter="url(#shs01)"/>
  <text x="540.0" y="366" text-anchor="middle" fill="#fde68a" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">渗透测试标准流程里 Nmap 的位置（靠前！）</text>
  <text x="74" y="392" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">① 信息收集：Whois / DNS → ② 主机发现（nmap -sn）→ ③ 端口扫描（nmap -sS / -sT / -sU）→ ④ 服务识别（-sV）+ OS 识别（-O）→ ⑤ 漏洞探测（--script vuln）→ ⑥ 生成报告交给 Metasploit/SQLMap</text>
  <text x="74" y="410" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">记住：没有 Nmap 端口清单，后续任何漏洞利用工具都无的放矢！</text>
</svg>


<svg viewBox="0 0 1080 620" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts02" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs02" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars02" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs02"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs02)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts02)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-2 Nmap 能做什么？8 大功能全景</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">从主机发现到漏洞挖掘的全功能覆盖</text>
  <rect x="60" y="160" width="200" height="170" rx="10" fill="#0ea5e9" fill-opacity=".18" stroke="#0ea5e9" stroke-width="1.6" filter="url(#shs02)"/>
  <text x="160.0" y="186" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">主机存活探测</text>
  <text x="74" y="212" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">nmap -sn</text>
  <text x="74" y="230" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">ICMP / ARP / TCP</text>
  <text x="74" y="248" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">-Pn 跳过 Ping 扫</text>
  <rect x="290" y="160" width="200" height="170" rx="10" fill="#8b5cf6" fill-opacity=".18" stroke="#8b5cf6" stroke-width="1.6" filter="url(#shs02)"/>
  <text x="390.0" y="186" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">端口开放扫描</text>
  <text x="304" y="212" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">65535 TCP/UDP 全端口</text>
  <text x="304" y="230" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">-p- / -p22,80,443</text>
  <text x="304" y="248" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">1000 常用端口（默认）</text>
  <rect x="520" y="160" width="200" height="170" rx="10" fill="#10b981" fill-opacity=".18" stroke="#10b981" stroke-width="1.6" filter="url(#shs02)"/>
  <text x="620.0" y="186" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">指纹识别</text>
  <text x="534" y="212" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">OS 指纹 -O</text>
  <text x="534" y="230" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">服务版本 -sV</text>
  <text x="534" y="248" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">设备厂商识别</text>
  <rect x="750" y="160" width="200" height="170" rx="10" fill="#f59e0b" fill-opacity=".18" stroke="#f59e0b" stroke-width="1.6" filter="url(#shs02)"/>
  <text x="850.0" y="186" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">NSE 脚本扩展</text>
  <text x="764" y="212" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">vuln / brute / auth</text>
  <text x="764" y="230" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">600+ 预置脚本</text>
  <text x="764" y="248" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">Lua 自定义扩展</text>
  <rect x="60" y="360" width="200" height="170" rx="10" fill="#ec4899" fill-opacity=".18" stroke="#ec4899" stroke-width="1.6" filter="url(#shs02)"/>
  <text x="160.0" y="386" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">防火墙/IDS 规避</text>
  <text x="74" y="412" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">分片-f / MTU</text>
  <text x="74" y="430" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">诱饵-D &lt;decoy&gt;</text>
  <text x="74" y="448" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">源端口 g 欺骗</text>
  <rect x="290" y="360" width="200" height="170" rx="10" fill="#06b6d4" fill-opacity=".18" stroke="#06b6d4" stroke-width="1.6" filter="url(#shs02)"/>
  <text x="390.0" y="386" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">性能控制</text>
  <text x="304" y="412" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">-T0~T5 速度档</text>
  <text x="304" y="430" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">--min-parallelism</text>
  <text x="304" y="448" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">--host-timeout</text>
  <rect x="520" y="360" width="200" height="170" rx="10" fill="#a855f7" fill-opacity=".18" stroke="#a855f7" stroke-width="1.6" filter="url(#shs02)"/>
  <text x="620.0" y="386" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">输出格式</text>
  <text x="534" y="412" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">-oN normal / -oX XML</text>
  <text x="534" y="430" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">-oG grepable</text>
  <text x="534" y="448" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">-oA 全部 + JSON</text>
  <rect x="750" y="360" width="200" height="170" rx="10" fill="#059669" fill-opacity=".18" stroke="#059669" stroke-width="1.6" filter="url(#shs02)"/>
  <text x="850.0" y="386" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">Zenmap GUI</text>
  <text x="764" y="412" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">图形化命令生成</text>
  <text x="764" y="430" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">Profile 预设保存</text>
  <text x="764" y="448" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">Topology 拓扑图</text>
</svg>


<svg viewBox="0 0 1080 580" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts03" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs03" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars03" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs03"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs03)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts03)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-3 Nmap 发展史 + 组成结构</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">Phrack Magazine #51 首次发布 → 20+ 年仍在活跃维护</text>
  <line x1="60" y1="210" x2="1020" y2="210" stroke="#38bdf8" stroke-width="3"/>  <circle cx="110" cy="210" r="11" fill="#0ea5e9"/>  <text x="110" y="175" text-anchor="middle" fill="#e0f2fe" font-size="12.5" font-weight="bold" font-family="Microsoft YaHei,Arial">1997 Phrack #51</text>  <text x="110" y="245" text-anchor="middle" fill="#93c5fd" font-size="11.5" font-family="Microsoft YaHei,Arial">1.0 发布 SYN/UDP/ACK</text>  <circle cx="300" cy="210" r="11" fill="#0ea5e9"/>  <text x="300" y="175" text-anchor="middle" fill="#e0f2fe" font-size="12.5" font-weight="bold" font-family="Microsoft YaHei,Arial">2000 开源社区爆发</text>  <text x="300" y="245" text-anchor="middle" fill="#93c5fd" font-size="11.5" font-family="Microsoft YaHei,Arial">nmap.org 官网；-O OS 指纹</text>  <circle cx="490" cy="210" r="11" fill="#0ea5e9"/>  <text x="490" y="175" text-anchor="middle" fill="#e0f2fe" font-size="12.5" font-weight="bold" font-family="Microsoft YaHei,Arial">2007 Nmap 4.50</text>  <text x="490" y="245" text-anchor="middle" fill="#93c5fd" font-size="11.5" font-family="Microsoft YaHei,Arial">NSE 脚本引擎 + Zenmap</text>  <circle cx="680" cy="210" r="11" fill="#0ea5e9"/>  <text x="680" y="175" text-anchor="middle" fill="#e0f2fe" font-size="12.5" font-weight="bold" font-family="Microsoft YaHei,Arial">2012 Nmap 6.0</text>  <text x="680" y="245" text-anchor="middle" fill="#93c5fd" font-size="11.5" font-family="Microsoft YaHei,Arial">IPv6 / Ndiff / Nping</text>  <circle cx="870" cy="210" r="11" fill="#0ea5e9"/>  <text x="870" y="175" text-anchor="middle" fill="#e0f2fe" font-size="12.5" font-weight="bold" font-family="Microsoft YaHei,Arial">2024+ Nmap 7.94+</text>  <text x="870" y="245" text-anchor="middle" fill="#93c5fd" font-size="11.5" font-family="Microsoft YaHei,Arial">NSE 700+ / HTTP/2 / TLS1.3</text>  <rect x="60" y="300" width="1000" height="210" rx="10" fill="#0ea5e9" fill-opacity=".18" stroke="#0ea5e9" stroke-width="1.6" filter="url(#shs03)"/>
  <text x="560.0" y="326" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">Nmap 套件 8 大组成（不是只有 nmap 一个程序！）</text>
  <text x="74" y="352" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">① nmap         → 核心扫描二进制  ② Zenmap       → 官方 GUI + 拓扑可视化</text>
  <text x="74" y="370" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">③ Ndiff        → 两次 nmap XML 报告 diff（看资产变化）  ④ Nping        → Hping3 风格的包生成工具（TCP/ICMP/ARP 探测）</text>
  <text x="74" y="388" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">⑤ Ncat         → Netcat 加强版（TLS/代理/端口转发）  ⑥ NSE 脚本集  → /usr/share/nmap/scripts/*.nse</text>
  <text x="74" y="406" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">⑦ OS DB        → nmap-os-db（几千条 TCP/IP 指纹库）  ⑧ Service DB   → nmap-service-probes（服务 Banner 匹配库）</text>
</svg>


### 什么是Nmap？

想象你是一个快递员，要送包裹到一栋大楼。但你不知道：
- 大楼有哪些门？
- 哪些门是开着的？
- 门后面是什么房间？
- 房间里住着什么人？

**Nmap**（Network Mapper）就像一个"建筑测绘员"，它可以帮你：
- 找出目标主机有哪些端口开着
- 确定这些端口运行什么服务
- 识别目标主机的操作系统
- 发现网络中存在哪些主机

简单来说，Nmap是**网络探测和安全扫描的神器**，被誉为网络安全界的"瑞士军刀"。

### Nmap能做什么？

| 功能 | 说明 | 通俗理解 |
|------|------|----------|
| 主机发现 | 找出网络中的主机 | 像敲门，看家里有人吗 |
| 端口扫描 | 找出开着的端口 | 像检查所有门窗是否开着 |
| 服务探测 | 识别端口运行的服务 | 像看门上贴的标签，知道是什么房间 |
| 操作系统探测 | 识别目标操作系统 | 像看房子的装修风格，知道是什么类型 |
| 漏洞扫描 | 使用脚本探测漏洞 | 像检查门窗锁是否牢固 |

### Nmap的历史

Nmap由Gordon Lyon（Fyodor）开发，1997年首次发布，至今已超过25年。它是：
- 最流行的网络扫描工具
- 渗透测试必备工具
- 安全审计标准工具
- 电影中常出现的黑客工具（如《黑客帝国》）

### Nmap的组成

Nmap不仅仅是一个命令行工具，还包括：

| 组成 | 说明 |
|------|------|
| Nmap核心 | 命令行扫描引擎 |
| Ncat | Netcat的增强版 |
| Ndiff | 比较扫描结果的差异 |
| Nping | 网络探测工具 |
| Zenmap | 图形化界面（已停止开发） |

---

## 2.2 Windows系统安装教程

<svg viewBox="0 0 1080 560" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts04" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs04" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars04" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs04"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs04)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts04)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-4 Windows 安装 Nmap 4 步走（安装包方式）</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">nmap.org/download.html 下载 nmap-&lt;ver&gt;-setup.exe</text>
  <circle cx="140" cy="240" r="22" fill="#0ea5e9" fill-opacity=".16" stroke="#0ea5e9" stroke-width="2"/>
  <text x="140" y="245" text-anchor="middle" fill="#0ea5e9" font-size="16" font-weight="bold" font-family="Arial">1</text>
  <text x="140" y="286" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">下载官方安装包</text>
  <path d="M180,240 L320,240" stroke="#38bdf8" stroke-width="2" marker-end="url(#ars04)" fill="none"/>
  <circle cx="360" cy="240" r="22" fill="#0ea5e9" fill-opacity=".16" stroke="#0ea5e9" stroke-width="2"/>
  <text x="360" y="245" text-anchor="middle" fill="#0ea5e9" font-size="16" font-weight="bold" font-family="Arial">2</text>
  <text x="360" y="286" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">一路 Next（勾上 Zenmap + Npcap）</text>
  <path d="M400,240 L540,240" stroke="#38bdf8" stroke-width="2" marker-end="url(#ars04)" fill="none"/>
  <circle cx="580" cy="240" r="22" fill="#0ea5e9" fill-opacity=".16" stroke="#0ea5e9" stroke-width="2"/>
  <text x="580" y="245" text-anchor="middle" fill="#0ea5e9" font-size="16" font-weight="bold" font-family="Arial">3</text>
  <text x="580" y="286" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">安装 Npcap 驱动（Win10/11 必需）</text>
  <path d="M620,240 L760,240" stroke="#38bdf8" stroke-width="2" marker-end="url(#ars04)" fill="none"/>
  <circle cx="820" cy="240" r="22" fill="#0ea5e9" fill-opacity=".16" stroke="#0ea5e9" stroke-width="2"/>
  <text x="820" y="245" text-anchor="middle" fill="#0ea5e9" font-size="16" font-weight="bold" font-family="Arial">4</text>
  <text x="820" y="286" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">cmd 里 nmap --version 验证</text>
  <rect x="60" y="370" width="480" height="150" rx="10" fill="#16a34a" fill-opacity=".18" stroke="#16a34a" stroke-width="1.6" filter="url(#shs04)"/>
  <text x="300.0" y="396" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">Npcap 安装必须勾的 3 项（少了扫不了内网）</text>
  <text x="74" y="422" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">✔ Support raw 802.11 traffic（可选）</text>
  <text x="74" y="440" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">✔ Install Npcap in WinPcap API-compatible Mode</text>
  <text x="74" y="458" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">✔ Restrict Npcap driver access to Administrators only</text>
  <rect x="580" y="370" width="440" height="150" rx="10" fill="#dc2626" fill-opacity=".18" stroke="#dc2626" stroke-width="1.6" filter="url(#shs04)"/>
  <text x="800.0" y="396" text-anchor="middle" fill="#fecaca" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">常见失败解决</text>
  <text x="594" y="422" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">旧版 WinPcap 先卸载干净</text>
  <text x="594" y="440" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">杀毒软件关掉 raw socket 拦截</text>
  <text x="594" y="458" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">Windows Defender 排除 nmap.exe</text>
</svg>


<svg viewBox="0 0 1080 560" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts05" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs05" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars05" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs05"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs05)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts05)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-5 Windows PATH 环境变量 + 防火墙放行</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">不把 Nmap 目录加进 PATH → PowerShell 里永远弹 nmap 不是内部或外部命令</text>
  <rect x="60" y="140" width="960" height="140" rx="10" fill="#0ea5e9" fill-opacity=".18" stroke="#0ea5e9" stroke-width="1.6" filter="url(#shs05)"/>
  <text x="540.0" y="166" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">① 环境变量 PATH 添加 2 条目录（根据实际安装路径）</text>
  <text x="74" y="192" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">C:\Program Files (x86)\Nmap\       → 含 nmap.exe / zenmap.exe / ncat.exe</text>
  <text x="74" y="210" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">C:\Program Files (x86)\Nmap\Npcap\ → 含 Npcap 相关驱动 DLL</text>
  <text x="74" y="228" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">Win+R → sysdm.cpl → 高级 → 环境变量 → 系统变量 Path → 新建 → 粘贴以上两条 → 关闭所有 PowerShell 重开！</text>
  <rect x="60" y="310" width="480" height="210" rx="10" fill="#16a34a" fill-opacity=".18" stroke="#16a34a" stroke-width="1.6" filter="url(#shs05)"/>
  <text x="300.0" y="336" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">② Windows Defender 防火墙放行 nmap</text>
  <text x="74" y="362" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">控制面板 → 系统和安全 → Windows Defender 防火墙 → 允许应用或功能通过防火墙</text>
  <text x="74" y="380" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">→ 更改设置 → 允许其他应用 → 浏览选择 nmap.exe 和 zenmap.exe</text>
  <text x="74" y="398" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">→ ✔ 专用（家里/公司内网） ✔ 公用（WiFi 扫外网）</text>
  <rect x="580" y="310" width="440" height="210" rx="10" fill="#b45309" fill-opacity=".18" stroke="#b45309" stroke-width="1.6" filter="url(#shs05)"/>
  <text x="800.0" y="336" text-anchor="middle" fill="#fde68a" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">③ 安装后验证（三条全 PASS 才算 OK）</text>
  <text x="594" y="362" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">PS&gt; nmap --version   → 显示版本号</text>
  <text x="594" y="380" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">PS&gt; nmap -sn 127.0.0.1 → 返回 Host is up</text>
  <text x="594" y="398" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">PS&gt; ncat --version   → Ncat: Version 7.xx</text>
</svg>


### 方式一：安装包安装（推荐）

**步骤1：下载安装包**

1. 访问官网：https://nmap.org/download.html
2. 找到Windows版本
3. 下载最新的安装包（如`nmap-7.94-setup.exe`）

**步骤2：安装Nmap**

1. 双击安装包
2. 选择安装目录（默认C:\Program Files (x86)\Nmap）
3. 选择安装组件：
   - **Nmap Core Files**：核心文件（必选）
   - **Ncat**：增强版Netcat（推荐）
   - **Ndiff**：结果比较工具（可选）
   - **Nping**：探测工具（推荐）
   - **Zenmap**：图形界面（可选，已停止更新）
4. 点击Install开始安装
5. 安装完成后，关闭窗口

**步骤3：验证安装**

打开命令提示符，输入：
```batch
nmap --version
```

如果显示版本信息，如`Nmap version 7.94`，说明安装成功。

### 方式二：命令行安装（高级）

使用PowerShell安装：
```powershell
# 下载安装包
Invoke-WebRequest -Uri "https://nmap.org/dist/nmap-7.94-setup.exe" -OutFile "nmap-setup.exe"

# 运行安装
Start-Process -FilePath "nmap-setup.exe" -ArgumentList "/S" -Wait

# 验证安装
nmap --version
```

### 环境变量配置

如果安装后命令提示符找不到nmap命令，需要添加环境变量：

1. 右键"此电脑" → "属性" → "高级系统设置"
2. 点击"环境变量"
3. 在"系统变量"中找到"Path"，点击"编辑"
4. 添加Nmap安装目录（如`C:\Program Files (x86)\Nmap`）
5. 点击"确定"保存

### Windows防火墙设置

Nmap可能会被Windows防火墙阻止：

1. 第一次运行Nmap时，Windows会弹出防火墙提示
2. 点击"允许访问"
3. 或者手动添加防火墙规则：
   - 控制面板 → Windows Defender防火墙 → 允许应用通过防火墙
   - 找到Nmap，勾选"允许"

---

## 2.3 Linux/Kali系统安装教程

<svg viewBox="0 0 1080 560" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts06" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs06" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars06" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs06"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs06)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts06)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-6 Linux/Kali/Ubuntu/CentOS/macOS 安装命令速查</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">Kali 默认已装；其它系统 1 行命令搞定</text>
  <rect x="40" y="140" width="240" height="360" rx="10" fill="#0ea5e9" fill-opacity=".18" stroke="#0ea5e9" stroke-width="1.6" filter="url(#shs06)"/>
  <text x="160.0" y="166" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">Kali / Parrot（默认自带）</text>
  <text x="54" y="192" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">$ nmap --version</text>
  <text x="54" y="210" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">若缺失：</text>
  <text x="54" y="228" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">  $ sudo apt update</text>
  <text x="54" y="246" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">  $ sudo apt install -y nmap</text>
  <text x="54" y="264" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">  $ sudo apt install -y zenmap</text>
  <text x="54" y="282" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">验证：nmap -iflist</text>
  <rect x="290" y="140" width="240" height="360" rx="10" fill="#10b981" fill-opacity=".18" stroke="#10b981" stroke-width="1.6" filter="url(#shs06)"/>
  <text x="410.0" y="166" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">Ubuntu / Debian</text>
  <text x="304" y="192" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">$ sudo apt update</text>
  <text x="304" y="210" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">$ sudo apt install -y nmap</text>
  <text x="304" y="228" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">源码编译（最新版）：</text>
  <text x="304" y="246" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">  $ sudo apt build-dep nmap</text>
  <text x="304" y="264" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">  $ wget nmap.org/dist/nmap-7.94.tar.bz2</text>
  <text x="304" y="282" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">  $ bzip2 -cd xxx | tar xf -</text>
  <text x="304" y="300" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">  $ ./configure &amp;&amp; make</text>
  <text x="304" y="318" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">  $ sudo make install</text>
  <rect x="540" y="140" width="240" height="360" rx="10" fill="#8b5cf6" fill-opacity=".18" stroke="#8b5cf6" stroke-width="1.6" filter="url(#shs06)"/>
  <text x="660.0" y="166" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">CentOS / RHEL / Rocky</text>
  <text x="554" y="192" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">$ sudo dnf install -y nmap</text>
  <text x="554" y="210" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">或 yum：</text>
  <text x="554" y="228" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">  $ sudo yum install -y nmap</text>
  <text x="554" y="246" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">EPEL 源（最小化安装必开）：</text>
  <text x="554" y="264" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">  $ sudo dnf install epel-release</text>
  <text x="554" y="282" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">  $ sudo dnf repolist</text>
  <text x="554" y="300" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">  $ sudo dnf install nmap-ncat</text>
  <text x="554" y="318" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">必要时：setcap cap_net_raw+ep</text>
  <rect x="790" y="140" width="250" height="360" rx="10" fill="#f59e0b" fill-opacity=".18" stroke="#f59e0b" stroke-width="1.6" filter="url(#shs06)"/>
  <text x="915.0" y="166" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">macOS（两种）</text>
  <text x="804" y="192" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">(推荐) Homebrew：</text>
  <text x="804" y="210" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">  $ brew install nmap</text>
  <text x="804" y="228" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">  # 完成直接可用</text>
  <text x="804" y="246" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">官方 pkg 安装：</text>
  <text x="804" y="264" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">  nmap.org/dist/nmap-7.94.dmg</text>
  <text x="804" y="282" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">  → 一路继续，注意 M1/M2/Intel 架构</text>
  <text x="804" y="300" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">验证：nmap -A scanme.nmap.org</text>
</svg>


### Kali Linux（预装）

Kali Linux预装了Nmap，无需安装！

检查是否已安装：
```bash
nmap --version
```

如果显示版本，说明已安装。

更新到最新版本：
```bash
sudo apt update
sudo apt upgrade nmap
```

### Ubuntu/Debian安装

**方式一：apt安装**
```bash
sudo apt update
sudo apt install nmap
```

**方式二：源码安装（获取最新版本）**
```bash
# 安装依赖
sudo apt install build-essential libssl-dev libpcap-dev

# 下载源码
wget https://nmap.org/dist/nmap-7.94.tar.bz2

# 解压
tar -xjf nmap-7.94.tar.bz2
cd nmap-7.94

# 编译安装
./configure
make
sudo make install

# 验证
nmap --version
```

### CentOS/RHEL安装

**方式一：yum安装**
```bash
sudo yum install nmap
```

**方式二：dnf安装（RHEL 8+）**
```bash
sudo dnf install nmap
```

---

## 2.4 macOS系统安装教程

### 方式一：Homebrew安装（推荐）

```bash
# 安装Homebrew（如果还没有）
# 参考 https://brew.sh

# 安装Nmap
brew install nmap

# 验证
nmap --version
```

### 方式二：官方安装包

1. 访问官网：https://nmap.org/download.html
2. 下载macOS版本（如`nmap-7.94.dmg`）
3. 双击dmg文件，将Nmap拖拽到Applications
4. 验证安装：
   ```bash
   /Applications/Nmap/nmap --version
   ```

---

## 2.5 基础扫描命令详解

<svg viewBox="0 0 1080 560" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts07" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs07" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars07" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs07"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs07)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts07)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-7 最简扫描 + 端口状态 6 种含义图解</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">最基础：nmap &lt;目标&gt;</text>
  <rect x="60" y="120" width="300" height="170" rx="10" fill="#0ea5e9" fill-opacity=".18" stroke="#0ea5e9" stroke-width="1.6" filter="url(#shs07)"/>
  <text x="210.0" y="146" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">最简扫描命令（默认扫前 1000 端口）</text>
  <text x="74" y="172" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">$ nmap 192.168.1.1</text>
  <text x="74" y="190" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">$ nmap 10.0.0.0/24</text>
  <text x="74" y="208" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">$ nmap example.com</text>
  <text x="74" y="226" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">$ nmap scanme.nmap.org</text>
  <text x="74" y="244" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">参数：不写 -p → 默认 Top 1000 常用</text>
  <rect x="390" y="120" width="630" height="170" rx="10" fill="#b45309" fill-opacity=".18" stroke="#b45309" stroke-width="1.6" filter="url(#shs07)"/>
  <text x="705.0" y="146" text-anchor="middle" fill="#fde68a" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">输出中端口状态的 6 种标准含义（面试常考！）</text>
  <text x="404" y="172" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">● open          → 端口开放（应用在 listen，核心目标！）</text>
  <text x="404" y="190" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">● closed        → 端口关闭（主机可达但无应用监听，排除项）</text>
  <text x="404" y="208" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">● filtered      → 被防火墙/IDS/ACL 拦截（SYN 包无响应）</text>
  <text x="404" y="226" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">● unfiltered    → ACK 扫可达，但无法判断是否开放（-sA 常见）</text>
  <text x="404" y="244" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">● open|filtered → 无响应（UDP / FIN / NULL / Xmas 扫无法区分）</text>
  <text x="404" y="262" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">● closed|filtered→ IP ID 扫无法区分 closed 或 filtered</text>
  <rect x="60" y="320" width="960" height="210" rx="10" fill="#0ea5e9" fill-opacity=".18" stroke="#0ea5e9" stroke-width="1.6" filter="url(#shs07)"/>
  <text x="540.0" y="346" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">实战输出示例解读（一眼就知道结果在哪看）</text>
  <text x="74" y="372" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">Nmap scan report for 192.168.1.100 (192.168.1.100)        ← 报告头：IP + 反解析 PTR</text>
  <text x="74" y="390" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">Host is up (0.0015s latency).                               ← 主机存活 + RTT 往返时延</text>
  <text x="74" y="408" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">PORT     STATE SERVICE         VERSION</text>
  <text x="74" y="426" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">22/tcp   open  ssh             OpenSSH 8.2p1 Ubuntu 4ubuntu0.5  ← 端口/协议/状态/服务名/版本号 核心</text>
  <text x="74" y="444" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">80/tcp   open  http            Apache httpd 2.4.41 ((Ubuntu))</text>
  <text x="74" y="462" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">443/tcp  open  ssl/http        nginx 1.18.0 (Ubuntu)</text>
  <text x="74" y="480" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">MAC Address: 00:0C:29:XX:XX:XX (VMware)                      ← 内网还有 ARP MAC + 厂商</text>
</svg>


<svg viewBox="0 0 1080 620" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts08" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs08" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars08" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs08"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs08)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts08)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-8 指定扫描目标的 8 种写法（多个目标/排除）</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">Nmap 目标表达式 = 空格分隔 / CIDR / 连字符 / 逗号 + -iL 列表文件 + --exclude 排除</text>
  <rect x="40" y="120" width="460" height="90" rx="10" fill="#1e3a8a" fill-opacity=".22" stroke="#60a5fa" stroke-width="1.3"/>  <text x="60" y="155" fill="#93c5fd" font-size="12" font-family="Consolas,Monospace">$ nmap 192.168.1.1                             </text>  <text x="60" y="185" fill="#dbeafe" font-size="13.5" font-family="Microsoft YaHei,Arial">→ 单个 IP</text>  <rect x="40" y="230" width="460" height="90" rx="10" fill="#1e3a8a" fill-opacity=".22" stroke="#60a5fa" stroke-width="1.3"/>  <text x="60" y="265" fill="#93c5fd" font-size="12" font-family="Consolas,Monospace">$ nmap 192.168.1.1 10.0.0.1 172.16.0.5         </text>  <text x="60" y="295" fill="#dbeafe" font-size="13.5" font-family="Microsoft YaHei,Arial">→ 空格分隔多个 IP</text>  <rect x="40" y="340" width="460" height="90" rx="10" fill="#1e3a8a" fill-opacity=".22" stroke="#60a5fa" stroke-width="1.3"/>  <text x="60" y="375" fill="#93c5fd" font-size="12" font-family="Consolas,Monospace">$ nmap 192.168.1.0/24                          </text>  <text x="60" y="405" fill="#dbeafe" font-size="13.5" font-family="Microsoft YaHei,Arial">→ CIDR：254 个主机</text>  <rect x="40" y="450" width="460" height="90" rx="10" fill="#1e3a8a" fill-opacity=".22" stroke="#60a5fa" stroke-width="1.3"/>  <text x="60" y="485" fill="#93c5fd" font-size="12" font-family="Consolas,Monospace">$ nmap 10.0.0-31.1-254                         </text>  <text x="60" y="515" fill="#dbeafe" font-size="13.5" font-family="Microsoft YaHei,Arial">→ 八进制范围：32 x 254 台</text>  <rect x="560" y="120" width="460" height="90" rx="10" fill="#1e3a8a" fill-opacity=".22" stroke="#60a5fa" stroke-width="1.3"/>  <text x="580" y="155" fill="#93c5fd" font-size="12" font-family="Consolas,Monospace">$ nmap 10.0.0.1,2,3,5,7,11                     </text>  <text x="580" y="185" fill="#dbeafe" font-size="13.5" font-family="Microsoft YaHei,Arial">→ 逗号枚举（奇质数主机）</text>  <rect x="560" y="230" width="460" height="90" rx="10" fill="#1e3a8a" fill-opacity=".22" stroke="#60a5fa" stroke-width="1.3"/>  <text x="580" y="265" fill="#93c5fd" font-size="12" font-family="Consolas,Monospace">$ nmap company.com / *.company.com             </text>  <text x="580" y="295" fill="#dbeafe" font-size="13.5" font-family="Microsoft YaHei,Arial">→ 域名（DNS A 解析）</text>  <rect x="560" y="340" width="460" height="90" rx="10" fill="#1e3a8a" fill-opacity=".22" stroke="#60a5fa" stroke-width="1.3"/>  <text x="580" y="375" fill="#93c5fd" font-size="12" font-family="Consolas,Monospace">$ nmap -iL targets.txt                         </text>  <text x="580" y="405" fill="#dbeafe" font-size="13.5" font-family="Microsoft YaHei,Arial">→ 文件内每行一个目标 / CIDR</text>  <rect x="560" y="450" width="460" height="90" rx="10" fill="#1e3a8a" fill-opacity=".22" stroke="#60a5fa" stroke-width="1.3"/>  <text x="580" y="485" fill="#93c5fd" font-size="12" font-family="Consolas,Monospace">$ nmap 10.0.0.0/8 --exclude 10.88.0.0/16       </text>  <text x="580" y="515" fill="#dbeafe" font-size="13.5" font-family="Microsoft YaHei,Arial">→ 排除：不扫蜜罐网段</text></svg>


<svg viewBox="0 0 1080 560" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts09" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs09" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars09" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs09"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs09)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts09)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-9 指定端口的 10 种写法 + TopN 机制</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">不指定端口 ≠ 扫全部！默认只扫 Top1000 TCP 端口，漏掉 98% 端口</text>
  <rect x="60" y="140" width="960" height="340" rx="10" fill="#0ea5e9" fill-opacity=".18" stroke="#0ea5e9" stroke-width="1.6" filter="url(#shs09)"/>
  <text x="540.0" y="166" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">端口参数速查表（-p 后面可以接任意组合）</text>
  <text x="74" y="192" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">$ nmap -p 22 10.0.0.1                    → 只扫单个端口 22（查 SSH 是否开）</text>
  <text x="74" y="210" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">$ nmap -p 22,80,443,3389,6379 10.0.0.1   → 指定多个端口，逗号分隔（高频 5 件套）</text>
  <text x="74" y="228" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">$ nmap -p 1-10000 10.0.0.1               → 扫连续范围 1~10000</text>
  <text x="74" y="246" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">$ nmap -p- 10.0.0.1                      → 全 65535 TCP 端口（实战必加！漏扫=漏洞没发现）</text>
  <text x="74" y="264" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">$ nmap -p T:21-25,80,443,U:53,161 10.0.0.1→ 同时扫指定 TCP + UDP 端口（T: / U: 前缀）</text>
  <text x="74" y="282" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">$ nmap --top-ports 100 10.0.0.1          → 只扫 互联网最常开 100 端口，超快速内网点位</text>
  <text x="74" y="300" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">$ nmap --top-ports 10000 10.0.0.1        → 扫 Top1 万，速度与覆盖率平衡</text>
  <text x="74" y="318" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">$ nmap -p ssh,http,https,mysql 10.0.0.1  → 用服务名！根据 /etc/services 自动转端口号</text>
  <text x="74" y="336" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">$ nmap -p 1-65535 --exclude-ports 139,445 10.0.0.1  → 避开触毒端口（139/445 容易杀软报警）</text>
  <text x="540" y="520" text-anchor="middle" fill="#60a5fa" font-size="11.5" font-family="Microsoft YaHei,Arial">实战习惯：内网扫 -p- 全端口 + -sS SYN 半开 ；外网初筛 --top-ports 3000，命中后再 -p- 复查</text>
</svg>


<svg viewBox="0 0 1080 580" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts10" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs10" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars10" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs10"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs10)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts10)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-10 TCP 扫描 7 种方式原理对比</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">默认 root = -sS SYN 半开；非 root = -sT 全连接；隐蔽扫描用于绕过防火墙日志</text>
  <rect x="60" y="120" width="130" height="45" fill="#1e293b" stroke="#334155" stroke-width="1" rx="3"/>  <text x="125.0" y="147.5" text-anchor="middle" fill="#bfdbfe" font-size="12" font-family="Microsoft YaHei,Arial">类型</text>  <rect x="200" y="120" width="130" height="45" fill="#1e293b" stroke="#334155" stroke-width="1" rx="3"/>  <text x="265.0" y="147.5" text-anchor="middle" fill="#bfdbfe" font-size="12" font-family="Microsoft YaHei,Arial">参数</text>  <rect x="340" y="120" width="150" height="45" fill="#1e293b" stroke="#334155" stroke-width="1" rx="3"/>  <text x="415.0" y="147.5" text-anchor="middle" fill="#bfdbfe" font-size="12" font-family="Microsoft YaHei,Arial">TCP 握手</text>  <rect x="500" y="120" width="170" height="45" fill="#1e293b" stroke="#334155" stroke-width="1" rx="3"/>  <text x="585.0" y="147.5" text-anchor="middle" fill="#bfdbfe" font-size="12" font-family="Microsoft YaHei,Arial">优点</text>  <rect x="680" y="120" width="150" height="45" fill="#1e293b" stroke="#334155" stroke-width="1" rx="3"/>  <text x="755.0" y="147.5" text-anchor="middle" fill="#bfdbfe" font-size="12" font-family="Microsoft YaHei,Arial">缺点</text>  <rect x="840" y="120" width="180" height="45" fill="#1e293b" stroke="#334155" stroke-width="1" rx="3"/>  <text x="930.0" y="147.5" text-anchor="middle" fill="#bfdbfe" font-size="12" font-family="Microsoft YaHei,Arial">适用场景</text>  <rect x="60" y="165" width="130" height="45" fill="#0b1530" stroke="#334155" stroke-width="1" rx="3"/>  <text x="125.0" y="192.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">默认 半开扫描（推荐）</text>  <rect x="200" y="165" width="130" height="45" fill="#0b1530" stroke="#334155" stroke-width="1" rx="3"/>  <text x="265.0" y="192.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">-sS</text>  <rect x="340" y="165" width="150" height="45" fill="#0b1530" stroke="#334155" stroke-width="1" rx="3"/>  <text x="415.0" y="192.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">SYN → SYN/ACK→RST</text>  <rect x="500" y="165" width="170" height="45" fill="#0b1530" stroke="#334155" stroke-width="1" rx="3"/>  <text x="585.0" y="192.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">快+稳+不记日志</text>  <rect x="680" y="165" width="150" height="45" fill="#0b1530" stroke="#334155" stroke-width="1" rx="3"/>  <text x="755.0" y="192.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">需 root/管理员</text>  <rect x="840" y="165" width="180" height="45" fill="#0b1530" stroke="#334155" stroke-width="1" rx="3"/>  <text x="930.0" y="192.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">所有 TCP 端口首选</text>  <rect x="60" y="210" width="130" height="45" fill="#111c35" stroke="#334155" stroke-width="1" rx="3"/>  <text x="125.0" y="237.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">全连接扫描</text>  <rect x="200" y="210" width="130" height="45" fill="#111c35" stroke="#334155" stroke-width="1" rx="3"/>  <text x="265.0" y="237.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">-sT</text>  <rect x="340" y="210" width="150" height="45" fill="#111c35" stroke="#334155" stroke-width="1" rx="3"/>  <text x="415.0" y="237.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">完整 SYN-SYN/ACK-ACK</text>  <rect x="500" y="210" width="170" height="45" fill="#111c35" stroke="#334155" stroke-width="1" rx="3"/>  <text x="585.0" y="237.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">无需 root</text>  <rect x="680" y="210" width="150" height="45" fill="#111c35" stroke="#334155" stroke-width="1" rx="3"/>  <text x="755.0" y="237.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">最慢，目标会记日志</text>  <rect x="840" y="210" width="180" height="45" fill="#111c35" stroke="#334155" stroke-width="1" rx="3"/>  <text x="930.0" y="237.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">无权限时备选</text>  <rect x="60" y="255" width="130" height="45" fill="#0b1530" stroke="#334155" stroke-width="1" rx="3"/>  <text x="125.0" y="282.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">ACK 扫描</text>  <rect x="200" y="255" width="130" height="45" fill="#0b1530" stroke="#334155" stroke-width="1" rx="3"/>  <text x="265.0" y="282.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">-sA</text>  <rect x="340" y="255" width="150" height="45" fill="#0b1530" stroke="#334155" stroke-width="1" rx="3"/>  <text x="415.0" y="282.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">ACK 包 → 无响应 / RST window&gt;0</text>  <rect x="500" y="255" width="170" height="45" fill="#0b1530" stroke="#334155" stroke-width="1" rx="3"/>  <text x="585.0" y="282.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">识别有无状态防火墙</text>  <rect x="680" y="255" width="150" height="45" fill="#0b1530" stroke="#334155" stroke-width="1" rx="3"/>  <text x="755.0" y="282.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">无法判断 open/closed</text>  <rect x="840" y="255" width="180" height="45" fill="#0b1530" stroke="#334155" stroke-width="1" rx="3"/>  <text x="930.0" y="282.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">判断防火墙</text>  <rect x="60" y="300" width="130" height="45" fill="#111c35" stroke="#334155" stroke-width="1" rx="3"/>  <text x="125.0" y="327.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">窗口扫描</text>  <rect x="200" y="300" width="130" height="45" fill="#111c35" stroke="#334155" stroke-width="1" rx="3"/>  <text x="265.0" y="327.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">-sW</text>  <rect x="340" y="300" width="150" height="45" fill="#111c35" stroke="#334155" stroke-width="1" rx="3"/>  <text x="415.0" y="327.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">类似 ACK，看 TCP Window 大小</text>  <rect x="500" y="300" width="170" height="45" fill="#111c35" stroke="#334155" stroke-width="1" rx="3"/>  <text x="585.0" y="327.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">部分 OS 可判断 open</text>  <rect x="680" y="300" width="150" height="45" fill="#111c35" stroke="#334155" stroke-width="1" rx="3"/>  <text x="755.0" y="327.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">不通用（TCP/IP 栈差异）</text>  <rect x="840" y="300" width="180" height="45" fill="#111c35" stroke="#334155" stroke-width="1" rx="3"/>  <text x="930.0" y="327.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">特定老系统</text>  <rect x="60" y="345" width="130" height="45" fill="#0b1530" stroke="#334155" stroke-width="1" rx="3"/>  <text x="125.0" y="372.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">Maimon 扫描</text>  <rect x="200" y="345" width="130" height="45" fill="#0b1530" stroke="#334155" stroke-width="1" rx="3"/>  <text x="265.0" y="372.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">-sM</text>  <rect x="340" y="345" width="150" height="45" fill="#0b1530" stroke="#334155" stroke-width="1" rx="3"/>  <text x="415.0" y="372.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">FIN/ACK 包 → NULL/RST</text>  <rect x="500" y="345" width="170" height="45" fill="#0b1530" stroke="#334155" stroke-width="1" rx="3"/>  <text x="585.0" y="372.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">绕过 BSD PF 防火墙</text>  <rect x="680" y="345" width="150" height="45" fill="#0b1530" stroke="#334155" stroke-width="1" rx="3"/>  <text x="755.0" y="372.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">其它系统常失效</text>  <rect x="840" y="345" width="180" height="45" fill="#0b1530" stroke="#334155" stroke-width="1" rx="3"/>  <text x="930.0" y="372.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">*BSD / mac 老版本</text>  <rect x="60" y="390" width="130" height="45" fill="#111c35" stroke="#334155" stroke-width="1" rx="3"/>  <text x="125.0" y="417.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">隐蔽三剑客 Null/FIN/Xmas</text>  <rect x="200" y="390" width="130" height="45" fill="#111c35" stroke="#334155" stroke-width="1" rx="3"/>  <text x="265.0" y="417.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">-sN / -sF / -sX</text>  <rect x="340" y="390" width="150" height="45" fill="#111c35" stroke="#334155" stroke-width="1" rx="3"/>  <text x="415.0" y="417.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">无 Flag / FIN / URG+PSH+FIN</text>  <rect x="500" y="390" width="170" height="45" fill="#111c35" stroke="#334155" stroke-width="1" rx="3"/>  <text x="585.0" y="417.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">Windows 必全 closed</text>  <rect x="680" y="390" width="150" height="45" fill="#111c35" stroke="#334155" stroke-width="1" rx="3"/>  <text x="755.0" y="417.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">UNIX 才可能生效</text>  <rect x="840" y="390" width="180" height="45" fill="#111c35" stroke="#334155" stroke-width="1" rx="3"/>  <text x="930.0" y="417.5" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">非 Windows 系统绕过 IDS</text>  <rect x="60" y="510" width="960" height="40" rx="10" fill="#bbf7d0" fill-opacity=".18" stroke="#bbf7d0" stroke-width="1.6" filter="url(#shs10)"/>
  <text x="540.0" y="536" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">默认参数：UID=0 → nmap 默认用 -sS；UID≠0 → 默认用 -sT。记一条足矣：sudo nmap -sS -p- &lt;IP&gt;</text>
  <text x="74" y="562" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">#</text>
  <text x="74" y="580" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">1</text>
  <text x="74" y="598" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">6</text>
  <text x="74" y="616" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">a</text>
  <text x="74" y="634" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">3</text>
  <text x="74" y="652" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">4</text>
  <text x="74" y="670" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">a</text>
</svg>


<svg viewBox="0 0 1080 560" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts11" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs11" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars11" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs11"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs11)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts11)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-11 UDP 扫描原理 + 提速技巧（-sU -sV --min-rate）</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">UDP 无三次握手，ICMP 端口不可达 = closed；无响应 = open|filtered。慢是因为超时重传。</text>
  <rect x="60" y="130" width="450" height="350" rx="10" fill="#0ea5e9" fill-opacity=".18" stroke="#0ea5e9" stroke-width="1.6" filter="url(#shs11)"/>
  <text x="285.0" y="156" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">UDP 扫的响应判定矩阵</text>
  <text x="74" y="182" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">目标返回 UDP 响应包       → open（极少见，只有 DNS 161/SNMP/NTP 这种有响应）</text>
  <text x="74" y="200" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">目标返回 ICMP type3 code3（端口不可达）  → closed</text>
  <text x="74" y="218" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">目标返回 ICMP type3 code1/2/9/10/13 → filtered（被防火墙）</text>
  <text x="74" y="236" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">多次重传无任何响应           → open|filtered（最大概率是 open + 应用不回包）</text>
  <text x="74" y="254" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">→ 解决无响应的办法：加 -sV 让 Nmap 按服务探针发 UDP payload（比如 DNS 请求、NTP monlist）</text>
  <text x="74" y="272" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial"></text>
  <text x="74" y="290" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">命令：$ sudo nmap -sU -sV --version-intensity 5 -p53,67,68,69,123,161,500,5060 10.0.0.1</text>
  <rect x="540" y="130" width="480" height="350" rx="10" fill="#dc2626" fill-opacity=".18" stroke="#dc2626" stroke-width="1.6" filter="url(#shs11)"/>
  <text x="780.0" y="156" text-anchor="middle" fill="#fecaca" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">UDP 提速到「可接受」的 5 条参数（否则单端口秒级）</text>
  <text x="554" y="182" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">① --min-rate 1000      → 每秒 ≥1000 包（不关心网络稳定性的话 3000~5000）</text>
  <text x="554" y="200" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">② --max-retries 1      → 最多重传 1 次（丢包就不纠结）</text>
  <text x="554" y="218" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">③ --host-timeout 30m   → 主机超时 30min（长扫描必设）</text>
  <text x="554" y="236" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">④ -Pn                  → 跳过 Ping（ICMP 被防火墙丢的情况）</text>
  <text x="554" y="254" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">⑤ 不要扫全 UDP 65535！只扫 Top 20~100：-sU --top-ports 100</text>
  <text x="554" y="272" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial"></text>
  <text x="554" y="290" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">推荐最终命令：$ sudo nmap -sU -sV --top-ports 20 --min-rate 2000 --max-retries 1 -Pn &lt;目标&gt;</text>
</svg>


<svg viewBox="0 0 1080 600" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts12" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs12" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars12" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs12"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs12)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts12)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-12 8 种场景选型速查卡</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">按你的目标 / 权限 / 环境选择最合适的，默认 -sS 解决 90%</text>
  <rect x="40" y="120" width="480" height="95" rx="10" fill="#16a34a" fill-opacity=".15" stroke="#16a34a" stroke-width="1.5"/>  <text x="60" y="148" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Microsoft YaHei,Arial">日常渗透扫端口</text>  <text x="60" y="175" fill="#fde68a" font-size="13" font-family="Consolas,Monospace">$ nmap -sS -p- -T4 -Pn</text>  <text x="60" y="200" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">sudo/管理员，最通用</text>  <rect x="560" y="120" width="480" height="95" rx="10" fill="#0ea5e9" fill-opacity=".15" stroke="#0ea5e9" stroke-width="1.5"/>  <text x="580" y="148" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Microsoft YaHei,Arial">无权限 Windows cmd</text>  <text x="580" y="175" fill="#fde68a" font-size="13" font-family="Consolas,Monospace">$ nmap -sT --top-ports 1000 -T3</text>  <text x="580" y="200" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">非 root，慢但能跑</text>  <rect x="40" y="230" width="480" height="95" rx="10" fill="#8b5cf6" fill-opacity=".15" stroke="#8b5cf6" stroke-width="1.5"/>  <text x="60" y="258" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Microsoft YaHei,Arial">判断是否有防火墙</text>  <text x="60" y="285" fill="#fde68a" font-size="13" font-family="Consolas,Monospace">$ nmap -sA -p80,443</text>  <text x="60" y="310" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">ACK 扫区分 unfiltered</text>  <rect x="560" y="230" width="480" height="95" rx="10" fill="#f59e0b" fill-opacity=".15" stroke="#f59e0b" stroke-width="1.5"/>  <text x="580" y="258" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Microsoft YaHei,Arial">DNS/NTP/SNMP(UDP)</text>  <text x="580" y="285" fill="#fde68a" font-size="13" font-family="Consolas,Monospace">$ nmap -sU -sV --top-ports 20</text>  <text x="580" y="310" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">UDP 服务识别必备</text>  <rect x="40" y="340" width="480" height="95" rx="10" fill="#ec4899" fill-opacity=".15" stroke="#ec4899" stroke-width="1.5"/>  <text x="60" y="368" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Microsoft YaHei,Arial">IDS 较多的外网</text>  <text x="60" y="395" fill="#fde68a" font-size="13" font-family="Consolas,Monospace">$ nmap -sN -f -D RND:5</text>  <text x="60" y="420" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">隐蔽 Null+分片+5 个随机 IP 诱饵</text>  <rect x="560" y="340" width="480" height="95" rx="10" fill="#06b6d4" fill-opacity=".15" stroke="#06b6d4" stroke-width="1.5"/>  <text x="580" y="368" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Microsoft YaHei,Arial">内网资产盘点</text>  <text x="580" y="395" fill="#fde68a" font-size="13" font-family="Consolas,Monospace">$ nmap -sn 10.0.0.0/8</text>  <text x="580" y="420" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">只看存活不扫端口，速度秒级</text>  <rect x="40" y="450" width="480" height="95" rx="10" fill="#84cc16" fill-opacity=".15" stroke="#84cc16" stroke-width="1.5"/>  <text x="60" y="478" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Microsoft YaHei,Arial">Web 漏洞扫描前置</text>  <text x="60" y="505" fill="#fde68a" font-size="13" font-family="Consolas,Monospace">$ nmap -sS -p80,443,8080-8090 -sV</text>  <text x="60" y="530" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">Web 服务端口+版本号</text>  <rect x="560" y="450" width="480" height="95" rx="10" fill="#b45309" fill-opacity=".15" stroke="#b45309" stroke-width="1.5"/>  <text x="580" y="478" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Microsoft YaHei,Arial">跨国/VPN 慢网</text>  <text x="580" y="505" fill="#fde68a" font-size="13" font-family="Consolas,Monospace">$ nmap -T2 --max-retries 2 --min-rate 300</text>  <text x="580" y="530" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">保守参数避免熔断</text></svg>


### 最简单的扫描

```bash
nmap 192.168.1.1
```

这是最基础的扫描命令：
- 扫描目标：192.168.1.1
- 默认扫描：最常用的1000个端口
- 扫描方式：TCP SYN扫描

输出示例：
```
Starting Nmap 7.94 ( https://nmap.org ) at 2024-01-01 10:00
Nmap scan report for 192.168.1.1
Host is up (0.001s latency).
Not shown: 997 closed ports
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
```

### 状态说明

Nmap会报告每个端口的状态：

| 状态 | 说明 | 通俗理解 |
|------|------|----------|
| open | 端口开启，有服务响应 | 门开着，里面有人 |
| closed | 端口关闭，无服务 | 门关着，敲门没人应 |
| filtered | 端口被防火墙过滤 | 门被保安拦着，看不到里面 |
| unfiltered | 端口可访问，但无法确定状态 | 能敲门，但不清楚门是否开 |
| open|filtered | 端口开启或被过滤 | 可能开着，也可能被拦 |

### 扫描多个目标

**扫描多个IP：**
```bash
nmap 192.168.1.1 192.168.1.2 192.168.1.3
```

**扫描IP范围：**
```bash
nmap 192.168.1.1-10
```
扫描192.168.1.1到192.168.1.10

**扫描子网：**
```bash
nmap 192.168.1.0/24
```
扫描整个192.168.1.x子网（256个IP）

**扫描IP范围（另一种方式）：**
```bash
nmap 192.168.1.0-255
```

**扫描随机主机：**
```bash
nmap -iR 10
```
随机扫描10个互联网主机

### 扫描指定端口

**扫描单个端口：**
```bash
nmap -p 80 192.168.1.1
```

**扫描多个端口：**
```bash
nmap -p 22,80,443 192.168.1.1
```

**扫描端口范围：**
```bash
nmap -p 1-100 192.168.1.1
```
扫描1到100号端口

**扫描所有端口：**
```bash
nmap -p- 192.168.1.1
```
扫描全部65535个端口（速度较慢）

**扫描常见端口：**
```bash
nmap -F 192.168.1.1
```
快速扫描，只扫描最常用的100个端口

**按服务名称扫描：**
```bash
nmap -p http,ssh 192.168.1.1
```
扫描HTTP和SSH对应的端口

### TCP扫描方式详解

#### TCP Connect扫描（-sT）

```bash
nmap -sT 192.168.1.1
```

**工作原理：**
- 完整建立TCP连接（三次握手）
- 适合没有root权限的用户
- 容易被目标日志记录

**通俗理解：** 像正常敲门，先问"你好吗"，对方回答"你好"，你再说"我是来拜访的"。这样对方会记得你来访过。

#### TCP SYN扫描（-sS，默认）

```bash
nmap -sS 192.168.1.1
```

**工作原理：**
- 只发送SYN包，不完成连接（半连接）
- 需要root权限
- 速度快，不易被记录

**通俗理解：** 像悄悄敲门，听到里面有回应就立刻跑开。这样对方可能没注意到你。

#### TCP FIN扫描（-sF）

```bash
nmap -sF 192.168.1.1
```

**工作原理：**
- 发送FIN包（正常用于关闭连接）
- 用于绕过某些防火墙
- Windows系统对此响应不同

**通俗理解：** 像敲门说"我要走了"，正常情况下对方应该知道你走了，但如果对方还在家，会有奇怪的反应。

#### TCP Xmas扫描（-sX）

```bash
nmap -sX 192.168.1.1
```

**工作原理：**
- 发送FIN、PSH、URG标志的包
- 用于绕过某些防火墙

**通俗理解：** 像敲门同时说三句话，对方可能会困惑。

#### TCP Null扫描（-sN）

```bash
nmap -sN 192.168.1.1
```

**工作原理：**
- 发送没有任何标志的包
- 用于绕过某些防火墙

**通俗理解：** 像敲门但什么都不说，对方可能会奇怪。

#### TCP ACK扫描（-sA）

```bash
nmap -sA 192.168.1.1
```

**工作原理：**
- 发送ACK包
- 用于探测防火墙规则

**通俗理解：** 像敲门说"谢谢你"，看看保安是否会拦你。

#### TCP Window扫描（-sW）

```bash
nmap -sW 192.168.1.1
```

**工作原理：**
- 发送ACK包，检查窗口大小
- 用于探测某些系统的端口状态

### UDP扫描详解

#### UDP扫描（-sU）

```bash
nmap -sU 192.168.1.1
```

**工作原理：**
- 发送UDP包，等待响应
- 无响应可能表示端口开启（UDP不总是响应）
- 速度较慢

**通俗理解：** UDP像寄信，不发回执。如果对方回复，说明收到了；不回复可能收到了，也可能没收到。

**常用UDP端口：**
| 端口 | 服务 |
|------|------|
| 53 | DNS |
| 67/68 | DHCP |
| 69 | TFTP |
| 123 | NTP |
| 161 | SNMP |
| 500 | IKE |

#### UDP扫描优化

```bash
nmap -sU --top-ports 20 192.168.1.1
```
只扫描最常用的20个UDP端口，节省时间。

### 扫描方式对比

| 扫描方式 | 命令 | 需要root | 速度 | 隐蔽性 | 适用场景 |
|----------|------|----------|------|--------|----------|
| TCP Connect | -sT | 不需要 | 慢 | 低 | 无root权限 |
| TCP SYN | -sS | 需要 | 快 | 中 | 常规扫描 |
| TCP FIN | -sF | 需要 | 中 | 高 | 绕过防火墙 |
| TCP Xmas | -sX | 需要 | 中 | 高 | 绕过防火墙 |
| TCP Null | -sN | 需要 | 中 | 高 | 绕过防火墙 |
| UDP | -sU | 需要 | 很慢 | 中 | UDP服务探测 |

---

## 2.6 高级扫描技术详解

<svg viewBox="0 0 1080 560" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts13" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs13" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars13" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs13"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs13)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts13)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-13 操作系统探测 -O / -O --osscan-guess 原理</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">TCP/IP 栈指纹识别：TTL / DF 位 / Window Size / TOS / MTU → 比对 nmap-os-db</text>
  <rect x="60" y="130" width="250" height="360" rx="10" fill="#0ea5e9" fill-opacity=".18" stroke="#0ea5e9" stroke-width="1.6" filter="url(#shs13)"/>
  <text x="185.0" y="156" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">6 个指纹维度</text>
  <text x="74" y="182" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">① IP TTL 初始值</text>
  <text x="74" y="200" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">② IP Don't Fragment 位</text>
  <text x="74" y="218" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">③ TCP Window 大小</text>
  <text x="74" y="236" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">④ TCP Options 顺序/组合</text>
  <text x="74" y="254" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">⑤ ICMP ECHO 响应特征</text>
  <text x="74" y="272" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">⑥ TCP ISN 序列号变化规律</text>
  <rect x="340" y="130" width="380" height="360" rx="10" fill="#8b5cf6" fill-opacity=".18" stroke="#8b5cf6" stroke-width="1.6" filter="url(#shs13)"/>
  <text x="530.0" y="156" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">判定输出 4 条信息怎么读</text>
  <text x="354" y="182" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">Device type: general purpose|router|switch|WAP|firewall</text>
  <text x="354" y="200" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">Running (JUST GUESSING): Linux 5.X (95%) | Linux 4.X (92%)</text>
  <text x="354" y="218" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">OS CPE: cpe:/o:linux:linux_kernel:5  → 可对接 CVE 数据库</text>
  <text x="354" y="236" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">Aggressive OS guesses: Linux 5.15 (94%), Linux 5.10 (92%)</text>
  <text x="354" y="254" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">→ 90%+ 直接信；&lt;80% 结合 -sV 服务 Banner 交叉验证</text>
  <rect x="750" y="130" width="270" height="360" rx="10" fill="#dc2626" fill-opacity=".18" stroke="#dc2626" stroke-width="1.6" filter="url(#shs13)"/>
  <text x="885.0" y="156" text-anchor="middle" fill="#fecaca" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">无法识别？用这些参数增强</text>
  <text x="764" y="182" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">$ sudo nmap -O --osscan-guess &lt;IP&gt;   → 强制猜（即使只开1端口）</text>
  <text x="764" y="200" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">$ sudo nmap -O --max-os-tries 9 &lt;IP&gt; → 重试 9 次（默认 5）</text>
  <text x="764" y="218" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">至少需要 1 open + 1 closed TCP 端口。建议先 -p- 全扫完再 -O 追加</text>
</svg>


<svg viewBox="0 0 1080 560" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts14" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs14" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars14" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs14"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs14)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts14)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-14 服务版本识别 -sV 强度 0~9 的使用</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">匹配 nmap-service-probes 数据库 → 按强度选择发多少探针 + 正则提取版本号</text>
  <rect x="70" y="155" width="80" height="42" rx="4" fill="#16a34a" fill-opacity=".3" stroke="#16a34a"/>  <text x="110" y="180" text-anchor="middle" fill="#e0f2fe" font-size="14" font-family="Arial" font-weight="bold">0</text>  <rect x="164" y="155" width="80" height="42" rx="4" fill="#16a34a" fill-opacity=".3" stroke="#16a34a"/>  <text x="204" y="180" text-anchor="middle" fill="#e0f2fe" font-size="14" font-family="Arial" font-weight="bold">1</text>  <rect x="258" y="155" width="80" height="42" rx="4" fill="#16a34a" fill-opacity=".3" stroke="#16a34a"/>  <text x="298" y="180" text-anchor="middle" fill="#e0f2fe" font-size="14" font-family="Arial" font-weight="bold">2</text>  <rect x="352" y="155" width="80" height="42" rx="4" fill="#0ea5e9" fill-opacity=".3" stroke="#0ea5e9"/>  <text x="392" y="180" text-anchor="middle" fill="#e0f2fe" font-size="14" font-family="Arial" font-weight="bold">3</text>  <rect x="446" y="155" width="80" height="42" rx="4" fill="#0ea5e9" fill-opacity=".3" stroke="#0ea5e9"/>  <text x="486" y="180" text-anchor="middle" fill="#e0f2fe" font-size="14" font-family="Arial" font-weight="bold">4</text>  <rect x="540" y="155" width="80" height="42" rx="4" fill="#0ea5e9" fill-opacity=".3" stroke="#0ea5e9"/>  <text x="580" y="180" text-anchor="middle" fill="#e0f2fe" font-size="14" font-family="Arial" font-weight="bold">5</text>  <rect x="634" y="155" width="80" height="42" rx="4" fill="#b45309" fill-opacity=".3" stroke="#b45309"/>  <text x="674" y="180" text-anchor="middle" fill="#e0f2fe" font-size="14" font-family="Arial" font-weight="bold">6</text>  <rect x="728" y="155" width="80" height="42" rx="4" fill="#b45309" fill-opacity=".3" stroke="#b45309"/>  <text x="768" y="180" text-anchor="middle" fill="#e0f2fe" font-size="14" font-family="Arial" font-weight="bold">7</text>  <rect x="822" y="155" width="80" height="42" rx="4" fill="#dc2626" fill-opacity=".3" stroke="#dc2626"/>  <text x="862" y="180" text-anchor="middle" fill="#e0f2fe" font-size="14" font-family="Arial" font-weight="bold">8</text>  <rect x="916" y="155" width="80" height="42" rx="4" fill="#dc2626" fill-opacity=".3" stroke="#dc2626"/>  <text x="956" y="180" text-anchor="middle" fill="#e0f2fe" font-size="14" font-family="Arial" font-weight="bold">9</text>  <rect x="70" y="220" width="940" height="60" rx="10" fill="#2563eb" fill-opacity=".18" stroke="#2563eb" stroke-width="1.6" filter="url(#shs14)"/>
  <text x="540.0" y="246" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">强度说明：0 = 最轻（只发 NULL probe 抓 Banner）；5=默认；7=常用加强；9=最重（所有 probe 都发，容易触发 WAF）</text>
  <text x="84" y="272" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">#</text>
  <text x="84" y="290" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">0</text>
  <text x="84" y="308" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">e</text>
  <text x="84" y="326" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">a</text>
  <text x="84" y="344" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">5</text>
  <text x="84" y="362" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">e</text>
  <text x="84" y="380" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">9</text>
  <rect x="70" y="300" width="940" height="220" rx="10" fill="#8b5cf6" fill-opacity=".18" stroke="#8b5cf6" stroke-width="1.6" filter="url(#shs14)"/>
  <text x="540.0" y="326" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">5 个强度档位典型命令 + 适用</text>
  <text x="84" y="352" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">--version-intensity 0  → $ nmap -sV --version-intensity 0 10.0.0.1  → 秒级，只看 banner（内网大量 HTTP）</text>
  <text x="84" y="370" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">--version-intensity 2  → 轻量，只发已知该端口的 probe（25 发 SMTP HELO、21 发 FTP USER）</text>
  <text x="84" y="388" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">--version-intensity 5  → 默认，平衡速度与精度，90% 情况够用</text>
  <text x="84" y="406" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">--version-intensity 7  → 实战首选加强，额外发 20% 冷门 probe，发现 OpenSSL/nginx 精确版本</text>
  <text x="84" y="424" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">--version-intensity 9  → 所有探针全发，适合单个目标精细资产测绘（慢 ~3 倍）；加 --version-trace 看过程</text>
</svg>


<svg viewBox="0 0 1080 560" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts15" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs15" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars15" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs15"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs15)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts15)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-15 终极一键全扫：-A = -sV -O -sC --traceroute 四合一</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">新手最爱！一键开 4 大功能：版本 + OS + 默认脚本 + 路由追踪</text>
  <circle cx="170" cy="250" r="22" fill="#0ea5e9" fill-opacity=".16" stroke="#0ea5e9" stroke-width="2"/>
  <text x="170" y="255" text-anchor="middle" fill="#0ea5e9" font-size="16" font-weight="bold" font-family="Arial">1</text>
  <text x="170" y="296" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">-sV 服务版本</text>
  <circle cx="360" cy="250" r="22" fill="#8b5cf6" fill-opacity=".16" stroke="#8b5cf6" stroke-width="2"/>
  <text x="360" y="255" text-anchor="middle" fill="#8b5cf6" font-size="16" font-weight="bold" font-family="Arial">2</text>
  <text x="360" y="296" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">-O  OS 识别</text>
  <circle cx="550" cy="250" r="22" fill="#10b981" fill-opacity=".16" stroke="#10b981" stroke-width="2"/>
  <text x="550" y="255" text-anchor="middle" fill="#10b981" font-size="16" font-weight="bold" font-family="Arial">3</text>
  <text x="550" y="296" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">-sC 默认脚本</text>
  <circle cx="740" cy="250" r="22" fill="#f59e0b" fill-opacity=".16" stroke="#f59e0b" stroke-width="2"/>
  <text x="740" y="255" text-anchor="middle" fill="#f59e0b" font-size="16" font-weight="bold" font-family="Arial">4</text>
  <text x="740" y="296" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">traceroute</text>
  <circle cx="910" cy="250" r="22" fill="#ec4899" fill-opacity=".16" stroke="#ec4899" stroke-width="2"/>
  <text x="910" y="255" text-anchor="middle" fill="#ec4899" font-size="16" font-weight="bold" font-family="Arial">A</text>
  <text x="910" y="296" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">合成 -A</text>
  <path d="M210,250 L320,250" stroke="#38bdf8" stroke-width="2" marker-end="url(#ars15)" fill="none"/>
  <path d="M400,250 L510,250" stroke="#38bdf8" stroke-width="2" marker-end="url(#ars15)" fill="none"/>
  <path d="M590,250 L700,250" stroke="#38bdf8" stroke-width="2" marker-end="url(#ars15)" fill="none"/>
  <path d="M780,250 L890,250" stroke="#38bdf8" stroke-width="2" marker-end="url(#ars15)" fill="none"/>
  <rect x="60" y="360" width="960" height="170" rx="10" fill="#ec4899" fill-opacity=".18" stroke="#ec4899" stroke-width="1.6" filter="url(#shs15)"/>
  <text x="540.0" y="386" text-anchor="middle" fill="#fbcfe8" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">完整命令（外网单目标最佳：稳准狠）+ 各部分怎么读</text>
  <text x="74" y="412" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">$ sudo nmap -A -T4 -p- -v &lt;目标 IP&gt;</text>
  <text x="74" y="430" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">→ 扫完后输出里的 PORT 表格会有 SERVICE + VERSION（来自-sV）、末尾有 OS details（来自-O）、</text>
  <text x="74" y="448" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">→ 还有 | ssh-hostkey / |_http-title / |_ssl-date 这类竖线开头 NSE 脚本执行结果（来自-sC）、</text>
  <text x="74" y="466" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">→ 最后 TRACEROUTE 小节显示经过的路由跳数（ASN 信息）。非常适合写入扫描报告！</text>
  <text x="540" y="550" text-anchor="middle" fill="#60a5fa" font-size="11.5" font-family="Microsoft YaHei,Arial">警告：-A 会触发 HTTP 请求 + SSL 握手 + 脚本执行，大量并发容易被封 IP，对外网批量请慎用。</text>
</svg>


<svg viewBox="0 0 1080 620" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts16" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs16" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars16" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs16"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs16)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts16)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-16 防火墙 / IDS / WAF 规避 8 招 + 组合拳</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">Nmap 本身就是最专业的包修饰工具；关键要「慢 + 变 + 混 + 拆」</text>
  <rect x="40" y="120" width="480" height="70" rx="8" fill="#dc2626" fill-opacity=".15" stroke="#dc2626" stroke-width="1.3"/>  <text x="55" y="144" fill="#e0f2fe" font-size="13.5" font-weight="bold" font-family="Microsoft YaHei,Arial">分片 MTU</text>  <text x="220" y="144" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">-f / --mtu 24</text>  <text x="55" y="170" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">IP 头拆成 8/24 byte 碎片，绕过简单规则</text>  <rect x="560" y="120" width="480" height="70" rx="8" fill="#f59e0b" fill-opacity=".15" stroke="#f59e0b" stroke-width="1.3"/>  <text x="575" y="144" fill="#e0f2fe" font-size="13.5" font-weight="bold" font-family="Microsoft YaHei,Arial">诱饵 IP 混源</text>  <text x="740" y="144" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">-D 1.1.1.1,2.2.2.2,RND:5,ME</text>  <text x="575" y="170" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">混 5 个随机 IP + 自己 ME，真实 IP 埋在里面</text>  <rect x="40" y="205" width="480" height="70" rx="8" fill="#8b5cf6" fill-opacity=".15" stroke="#8b5cf6" stroke-width="1.3"/>  <text x="55" y="229" fill="#e0f2fe" font-size="13.5" font-weight="bold" font-family="Microsoft YaHei,Arial">源 IP Spoof</text>  <text x="220" y="229" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">-S 10.0.0.88 -e eth0</text>  <text x="55" y="255" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">源 IP 改成网段内其他机器（需要能接回包）</text>  <rect x="560" y="205" width="480" height="70" rx="8" fill="#10b981" fill-opacity=".15" stroke="#10b981" stroke-width="1.3"/>  <text x="575" y="229" fill="#e0f2fe" font-size="13.5" font-weight="bold" font-family="Microsoft YaHei,Arial">源 MAC 欺骗</text>  <text x="740" y="229" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">--spoof-mac Cisco / Dell / Huawei</text>  <text x="575" y="255" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">伪造厂商前缀 MAC，内网交换机 ACL 绕过</text>  <rect x="40" y="290" width="480" height="70" rx="8" fill="#0ea5e9" fill-opacity=".15" stroke="#0ea5e9" stroke-width="1.3"/>  <text x="55" y="314" fill="#e0f2fe" font-size="13.5" font-weight="bold" font-family="Microsoft YaHei,Arial">源端口伪装</text>  <text x="220" y="314" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">-g 53 / --source-port 443</text>  <text x="55" y="340" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">把源端口伪装成 DNS(53)/HTTPS(443)，出向防火墙放行</text>  <rect x="560" y="290" width="480" height="70" rx="8" fill="#06b6d4" fill-opacity=".15" stroke="#06b6d4" stroke-width="1.3"/>  <text x="575" y="314" fill="#e0f2fe" font-size="13.5" font-weight="bold" font-family="Microsoft YaHei,Arial">随机化排序</text>  <text x="740" y="314" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">--randomize-hosts --scan-delay 1000ms</text>  <text x="575" y="340" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">主机/端口打乱 + 每包间隔 1s，防速率检测</text>  <rect x="40" y="375" width="480" height="70" rx="8" fill="#ec4899" fill-opacity=".15" stroke="#ec4899" stroke-width="1.3"/>  <text x="55" y="399" fill="#e0f2fe" font-size="13.5" font-weight="bold" font-family="Microsoft YaHei,Arial">Bad Sum</text>  <text x="220" y="399" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">--badsum</text>  <text x="55" y="425" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">错的 TCP/UDP 校验和，只对有漏洞的系统响应</text>  <rect x="560" y="375" width="480" height="70" rx="8" fill="#b45309" fill-opacity=".15" stroke="#b45309" stroke-width="1.3"/>  <text x="575" y="399" fill="#e0f2fe" font-size="13.5" font-weight="bold" font-family="Microsoft YaHei,Arial">IP 选项</text>  <text x="740" y="399" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">--ip-options "S 10.0.0.1"</text>  <text x="575" y="425" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">Record Route / Loose Source Route，老网络设备绕过</text></svg>


### 操作系统探测（-O）

```bash
nmap -O 192.168.1.1
```

**工作原理：**
- 分析TCP/IP协议栈的特征
- 每个操作系统有独特的"指纹"
- 通过指纹识别操作系统

**通俗理解：** 像看房子的装修风格，Windows的房子、Linux的房子各有特色。

**输出示例：**
```
OS details: Linux 3.2 - 4.9
```

**限制：**
- 需要至少一个开启的端口
- 需要root权限
- 有时会误判

**更详细的探测：**
```bash
nmap -O --osscan-guess 192.168.1.1
```
即使不确定，也会猜测最可能的操作系统。

### 服务版本探测（-sV）

```bash
nmap -sV 192.168.1.1
```

**工作原理：**
- 与端口的服务进行交互
- 发送特定的探测包
- 根据响应识别服务版本

**通俗理解：** 像和门卫聊天，问他是什么软件、什么版本。

**输出示例：**
```
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 7.4 (protocol 2.0)
80/tcp   open  http    Apache httpd 2.4.6 ((CentOS))
```

**探测强度控制：**
```bash
nmap -sV --version-intensity 9 192.168.1.1
```

强度级别：
| 级别 | 说明 |
|------|------|
| 0-2 | 轻度探测，只探测常见服务 |
| 3-7 | 中度探测（默认） |
| 8-9 | 重度探测，探测所有服务 |

### 全扫描（-A）

```bash
nmap -A 192.168.1.1
```

**包含内容：**
- 操作系统探测（-O）
- 服务版本探测（-sV）
- 脚本扫描（-sC）
- 路由跟踪（--traceroute）

**通俗理解：** 全面体检，检查所有项目。

### 防火墙规避技术

#### 分片扫描（-f）

```bash
nmap -f 192.168.1.1
```

**工作原理：**
- 将探测包分成小片段
- 一些防火墙不检查分片包

**通俗理解：** 像把信拆成几页分别发送，保安可能只检查每一页，不会组合看完整内容。

**指定分片大小：**
```bash
nmap -f --data-length 24 192.168.1.1
```

#### 指定源端口

```bash
nmap --source-port 53 192.168.1.1
```

**工作原理：**
- 从DNS端口（53）发送探测包
- 一些防火墙信任DNS流量

#### 使用诱饵（-D）

```bash
nmap -D decoy1,decoy2,decoy3,ME 192.168.1.1
```

**工作原理：**
- 伪造多个源IP同时发送
- 目标难以区分真实扫描者

**通俗理解：** 像让几个人同时敲门，目标不知道谁是真正来拜访的。

#### 空闲扫描（-sI）

```bash
nmap -sI zombie_host 192.168.1.1
```

**工作原理：**
- 利用"僵尸主机"发送探测包
- 目标看到的是僵尸主机在扫描
- 完全隐藏真实IP

**通俗理解：** 像让别人帮你敲门，目标只会记录敲门的人，不知道是你指使的。

#### MAC地址欺骗

```bash
nmap --spoof-mac Apple 192.168.1.1
```

**工作原理：**
- 伪造MAC地址
- 目标看到的是伪造的MAC

**预设厂商：**
- Apple
- Cisco
- Dell
- Microsoft
- 或自定义MAC地址

---

## 2.7 Nmap脚本引擎（NSE）详解

<svg viewBox="0 0 1080 640" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts17" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs17" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars17" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs17"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs17)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts17)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-17 NSE 脚本引擎 6 大分类 + 执行阶段</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">Nmap Scripting Engine = Lua 5.4 编写的插件系统，14 大执行阶段 600+ 脚本</text>
  <rect x="60" y="120" width="960" height="100" rx="10" fill="#2563eb" fill-opacity=".18" stroke="#2563eb" stroke-width="1.6" filter="url(#shs17)"/>
  <text x="540.0" y="146" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">14 个钩子阶段（按扫描顺序）：prerule → host 发现 → port 发现 → portrule（端口匹配）→ hostrule → postrule → 最终输出</text>
  <text x="74" y="172" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">#</text>
  <text x="74" y="190" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">0</text>
  <text x="74" y="208" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">e</text>
  <text x="74" y="226" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">a</text>
  <text x="74" y="244" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">5</text>
  <text x="74" y="262" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">e</text>
  <text x="74" y="280" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">9</text>
  <rect x="40" y="240" width="190" height="100" rx="8" fill="#dc2626" fill-opacity=".15" stroke="#dc2626" stroke-width="1.3"/>  <text x="135" y="264" text-anchor="middle" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Consolas,Monospace">auth</text>  <text x="50" y="286" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">鉴权类  45+</text>  <text x="50" y="306" fill="#fde68a" font-size="11.5" font-family="Consolas,Monospace">ssh-brute / http-brute</text>  <text x="50" y="326" fill="#dbeafe" font-size="11" font-family="Microsoft YaHei,Arial">绕过认证/弱口令爆破</text>  <rect x="245" y="240" width="190" height="100" rx="8" fill="#f59e0b" fill-opacity=".15" stroke="#f59e0b" stroke-width="1.3"/>  <text x="340" y="264" text-anchor="middle" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Consolas,Monospace">brute</text>  <text x="255" y="286" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">暴力破解  60+</text>  <text x="255" y="306" fill="#fde68a" font-size="11.5" font-family="Consolas,Monospace">ftp-brute / mysql-brute / smb-brute</text>  <text x="255" y="326" fill="#dbeafe" font-size="11" font-family="Microsoft YaHei,Arial">字典攻击密码爆破</text>  <rect x="450" y="240" width="190" height="100" rx="8" fill="#0ea5e9" fill-opacity=".15" stroke="#0ea5e9" stroke-width="1.3"/>  <text x="545" y="264" text-anchor="middle" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Consolas,Monospace">default</text>  <text x="460" y="286" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">默认脚本 -sC  120+</text>  <text x="460" y="306" fill="#fde68a" font-size="11.5" font-family="Consolas,Monospace">http-title / ssl-cert / smb-os-discovery</text>  <text x="460" y="326" fill="#dbeafe" font-size="11" font-family="Microsoft YaHei,Arial">日常扫一键启用</text>  <rect x="655" y="240" width="190" height="100" rx="8" fill="#10b981" fill-opacity=".15" stroke="#10b981" stroke-width="1.3"/>  <text x="750" y="264" text-anchor="middle" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Consolas,Monospace">discovery</text>  <text x="665" y="286" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">服务发现  70+</text>  <text x="665" y="306" fill="#fde68a" font-size="11.5" font-family="Consolas,Monospace">snmp-sysdescr / smb-enum-shares</text>  <text x="665" y="326" fill="#dbeafe" font-size="11" font-family="Microsoft YaHei,Arial">账号/共享/服务枚举</text>  <rect x="860" y="240" width="190" height="100" rx="8" fill="#ec4899" fill-opacity=".15" stroke="#ec4899" stroke-width="1.3"/>  <text x="955" y="264" text-anchor="middle" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Consolas,Monospace">dos</text>  <text x="870" y="286" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">拒绝服务  10+</text>  <text x="870" y="306" fill="#fde68a" font-size="11.5" font-family="Consolas,Monospace">http-slowloris</text>  <text x="870" y="326" fill="#dbeafe" font-size="11" font-family="Microsoft YaHei,Arial">压力测试（慎用！）</text>  <rect x="40" y="355" width="190" height="100" rx="8" fill="#dc2626" fill-opacity=".15" stroke="#dc2626" stroke-width="1.3"/>  <text x="135" y="379" text-anchor="middle" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Consolas,Monospace">exploit</text>  <text x="50" y="401" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">漏洞利用  35+</text>  <text x="50" y="421" fill="#fde68a" font-size="11.5" font-family="Consolas,Monospace">ms17-010 / shellshock / log4shell</text>  <text x="50" y="441" fill="#dbeafe" font-size="11" font-family="Microsoft YaHei,Arial">直接打 RCE / EXP</text>  <rect x="245" y="355" width="190" height="100" rx="8" fill="#8b5cf6" fill-opacity=".15" stroke="#8b5cf6" stroke-width="1.3"/>  <text x="340" y="379" text-anchor="middle" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Consolas,Monospace">external</text>  <text x="255" y="401" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">调用第三方 API  8+</text>  <text x="255" y="421" fill="#fde68a" font-size="11.5" font-family="Consolas,Monospace">http-google-malware / virustotal</text>  <text x="255" y="441" fill="#dbeafe" font-size="11" font-family="Microsoft YaHei,Arial">VT 检测、威胁情报</text>  <rect x="450" y="355" width="190" height="100" rx="8" fill="#b45309" fill-opacity=".15" stroke="#b45309" stroke-width="1.3"/>  <text x="545" y="379" text-anchor="middle" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Consolas,Monospace">fuzzer</text>  <text x="460" y="401" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">模糊测试  12+</text>  <text x="460" y="421" fill="#fde68a" font-size="11.5" font-family="Consolas,Monospace">http-fuzz / dns-fuzz</text>  <text x="460" y="441" fill="#dbeafe" font-size="11" font-family="Microsoft YaHei,Arial">畸形包探测未知漏洞</text>  <rect x="655" y="355" width="190" height="100" rx="8" fill="#dc2626" fill-opacity=".15" stroke="#dc2626" stroke-width="1.3"/>  <text x="750" y="379" text-anchor="middle" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Consolas,Monospace">intrusive</text>  <text x="665" y="401" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">侵入性（高风险）  50+</text>  <text x="665" y="421" fill="#fde68a" font-size="11.5" font-family="Consolas,Monospace">http-shellshock</text>  <text x="665" y="441" fill="#dbeafe" font-size="11" font-family="Microsoft YaHei,Arial">可能导致目标崩/封</text>  <rect x="860" y="355" width="190" height="100" rx="8" fill="#f59e0b" fill-opacity=".15" stroke="#f59e0b" stroke-width="1.3"/>  <text x="955" y="379" text-anchor="middle" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Consolas,Monospace">malware</text>  <text x="870" y="401" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">恶意软件识别  5+</text>  <text x="870" y="421" fill="#fde68a" font-size="11.5" font-family="Consolas,Monospace">smb-check-vulns</text>  <text x="870" y="441" fill="#dbeafe" font-size="11" font-family="Microsoft YaHei,Arial">检测后门/木马</text>  <rect x="40" y="470" width="190" height="100" rx="8" fill="#16a34a" fill-opacity=".15" stroke="#16a34a" stroke-width="1.3"/>  <text x="135" y="494" text-anchor="middle" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Consolas,Monospace">safe</text>  <text x="50" y="516" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">安全（无副作用）  200+</text>  <text x="50" y="536" fill="#fde68a" font-size="11.5" font-family="Consolas,Monospace">whois-ip / http-headers</text>  <text x="50" y="556" fill="#dbeafe" font-size="11" font-family="Microsoft YaHei,Arial">CTF/合规必用</text>  <rect x="245" y="470" width="190" height="100" rx="8" fill="#8b5cf6" fill-opacity=".15" stroke="#8b5cf6" stroke-width="1.3"/>  <text x="340" y="494" text-anchor="middle" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Consolas,Monospace">version</text>  <text x="255" y="516" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">服务版本增强  80+</text>  <text x="255" y="536" fill="#fde68a" font-size="11.5" font-family="Consolas,Monospace">http-apache-server-status</text>  <text x="255" y="556" fill="#dbeafe" font-size="11" font-family="Microsoft YaHei,Arial">配合 -sV 精度升级</text>  <rect x="450" y="470" width="190" height="100" rx="8" fill="#dc2626" fill-opacity=".15" stroke="#dc2626" stroke-width="1.3"/>  <text x="545" y="494" text-anchor="middle" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Consolas,Monospace">vuln</text>  <text x="460" y="516" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">漏洞扫描  70+</text>  <text x="460" y="536" fill="#fde68a" font-size="11.5" font-family="Consolas,Monospace">cve-2021-44228 / ms08-067</text>  <text x="460" y="556" fill="#dbeafe" font-size="11" font-family="Microsoft YaHei,Arial">CVE 一键验证</text></svg>


<svg viewBox="0 0 1080 620" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts18" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs18" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars18" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs18"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs18)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts18)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-18 脚本调用 7 种写法（默认/分类/单脚本/表达式/多参数）</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">记住 4 条：-sC = --script=default；脚本名支持通配符 *；分类名写分类；多个用逗号</text>
  <rect x="40" y="140" width="480" height="80" rx="8" fill="#1e293b" stroke="#60a5fa" stroke-width="1.3"/>  <text x="55" y="172" fill="#fde68a" font-size="13" font-family="Consolas,Monospace">$ nmap -sC &lt;目标&gt;</text>  <text x="55" y="200" fill="#dbeafe" font-size="13" font-family="Microsoft YaHei,Arial">→ 启用 default 分类脚本（120+）</text>  <rect x="40" y="240" width="480" height="80" rx="8" fill="#1e293b" stroke="#60a5fa" stroke-width="1.3"/>  <text x="55" y="272" fill="#fde68a" font-size="13" font-family="Consolas,Monospace">$ nmap --script vuln &lt;目标&gt;</text>  <text x="55" y="300" fill="#dbeafe" font-size="13" font-family="Microsoft YaHei,Arial">→ 启用 vuln 分类（70+ 漏洞扫）</text>  <rect x="40" y="340" width="480" height="80" rx="8" fill="#1e293b" stroke="#60a5fa" stroke-width="1.3"/>  <text x="55" y="372" fill="#fde68a" font-size="13" font-family="Consolas,Monospace">$ nmap --script=http-title,http-robots &lt;目标&gt;</text>  <text x="55" y="400" fill="#dbeafe" font-size="13" font-family="Microsoft YaHei,Arial">→ 指定多个单脚本，逗号分隔</text>  <rect x="40" y="440" width="480" height="80" rx="8" fill="#1e293b" stroke="#60a5fa" stroke-width="1.3"/>  <text x="55" y="472" fill="#fde68a" font-size="13" font-family="Consolas,Monospace">$ nmap --script "http-*" &lt;目标&gt;</text>  <text x="55" y="500" fill="#dbeafe" font-size="13" font-family="Microsoft YaHei,Arial">→ 通配符，跑所有 http- 开头脚本</text>  <rect x="560" y="140" width="480" height="80" rx="8" fill="#1e293b" stroke="#60a5fa" stroke-width="1.3"/>  <text x="575" y="172" fill="#fde68a" font-size="13" font-family="Consolas,Monospace">$ nmap --script "not intrusive" &lt;目标&gt;</text>  <text x="575" y="200" fill="#dbeafe" font-size="13" font-family="Microsoft YaHei,Arial">→ Lua 表达式：排除 intrusive 类</text>  <rect x="560" y="240" width="480" height="80" rx="8" fill="#1e293b" stroke="#60a5fa" stroke-width="1.3"/>  <text x="575" y="272" fill="#fde68a" font-size="13" font-family="Consolas,Monospace">$ nmap --script-args user=admin,pass=toor &lt;目标&gt;</text>  <text x="575" y="300" fill="#dbeafe" font-size="13" font-family="Microsoft YaHei,Arial">→ 脚本传参数（指定用户/字典）</text>  <rect x="560" y="340" width="480" height="80" rx="8" fill="#1e293b" stroke="#60a5fa" stroke-width="1.3"/>  <text x="575" y="372" fill="#fde68a" font-size="13" font-family="Consolas,Monospace">$ nmap --script-help=smb-enum-shares</text>  <text x="575" y="400" fill="#dbeafe" font-size="13" font-family="Microsoft YaHei,Arial">→ 脚本帮助文档：必读！脚本不传参白跑</text>  <rect x="40" y="540" width="1000" height="50" rx="10" fill="#2563eb" fill-opacity=".18" stroke="#2563eb" stroke-width="1.6" filter="url(#shs18)"/>
  <text x="540.0" y="566" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">高级：脚本数据传递 → --script-args-file args.txt 批量传参；调试脚本用 -d -v 看 NSE 每步输出 trace</text>
  <text x="54" y="592" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">#</text>
  <text x="54" y="610" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">8</text>
  <text x="54" y="628" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">b</text>
  <text x="54" y="646" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">5</text>
  <text x="54" y="664" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">c</text>
  <text x="54" y="682" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">f</text>
  <text x="54" y="700" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">6</text>
</svg>


<svg viewBox="0 0 1080 640" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts19" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs19" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars19" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs19"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs19)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts19)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-19 十大常用 NSE 脚本实战命令 + 触发端口条件</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">面试 + 实战必会：每个脚本什么端口触发、输出什么、能直接当 POC 的要记牢</text>
  <rect x="40" y="110" width="200" height="42" fill="#1e293b" stroke="#60a5fa"/>  <text x="140.0" y="136" text-anchor="middle" fill="#bfdbfe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">脚本名称</text>  <rect x="250" y="110" width="70" height="42" fill="#1e293b" stroke="#60a5fa"/>  <text x="285.0" y="136" text-anchor="middle" fill="#bfdbfe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">端口号</text>  <rect x="330" y="110" width="380" height="42" fill="#1e293b" stroke="#60a5fa"/>  <text x="520.0" y="136" text-anchor="middle" fill="#bfdbfe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">能做什么</text>  <rect x="720" y="110" width="320" height="42" fill="#1e293b" stroke="#60a5fa"/>  <text x="880.0" y="136" text-anchor="middle" fill="#bfdbfe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">命令（可直接复制执行）</text>  <rect x="40" y="152" width="200" height="42" fill="#111c35" stroke="#334155"/>  <rect x="250" y="152" width="70" height="42" fill="#111c35" stroke="#334155"/>  <rect x="330" y="152" width="380" height="42" fill="#111c35" stroke="#334155"/>  <rect x="720" y="152" width="320" height="42" fill="#111c35" stroke="#334155"/>  <rect x="40" y="194" width="200" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="250" y="194" width="70" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="330" y="194" width="380" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="720" y="194" width="320" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="40" y="236" width="200" height="42" fill="#111c35" stroke="#334155"/>  <rect x="250" y="236" width="70" height="42" fill="#111c35" stroke="#334155"/>  <rect x="330" y="236" width="380" height="42" fill="#111c35" stroke="#334155"/>  <rect x="720" y="236" width="320" height="42" fill="#111c35" stroke="#334155"/>  <rect x="40" y="278" width="200" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="250" y="278" width="70" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="330" y="278" width="380" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="720" y="278" width="320" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="40" y="320" width="200" height="42" fill="#111c35" stroke="#334155"/>  <rect x="250" y="320" width="70" height="42" fill="#111c35" stroke="#334155"/>  <rect x="330" y="320" width="380" height="42" fill="#111c35" stroke="#334155"/>  <rect x="720" y="320" width="320" height="42" fill="#111c35" stroke="#334155"/>  <rect x="40" y="362" width="200" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="250" y="362" width="70" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="330" y="362" width="380" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="720" y="362" width="320" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="40" y="404" width="200" height="42" fill="#111c35" stroke="#334155"/>  <rect x="250" y="404" width="70" height="42" fill="#111c35" stroke="#334155"/>  <rect x="330" y="404" width="380" height="42" fill="#111c35" stroke="#334155"/>  <rect x="720" y="404" width="320" height="42" fill="#111c35" stroke="#334155"/>  <rect x="40" y="446" width="200" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="250" y="446" width="70" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="330" y="446" width="380" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="720" y="446" width="320" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="40" y="488" width="200" height="42" fill="#111c35" stroke="#334155"/>  <rect x="250" y="488" width="70" height="42" fill="#111c35" stroke="#334155"/>  <rect x="330" y="488" width="380" height="42" fill="#111c35" stroke="#334155"/>  <rect x="720" y="488" width="320" height="42" fill="#111c35" stroke="#334155"/>  <rect x="40" y="530" width="200" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="250" y="530" width="70" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="330" y="530" width="380" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="720" y="530" width="320" height="42" fill="#0b1530" stroke="#334155"/>  <text x="140.0" y="177" text-anchor="middle" fill="#fde68a" font-size="11.5" font-family="Consolas,Monospace">smb-vuln-ms17-010</text>  <text x="285.0" y="177" text-anchor="middle" fill="#e0f2fe" font-size="12" font-family="Arial">445/tcp</text>  <text x="340" y="177" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">永恒之蓝 RCE 检测（Win7/2008 必扫）</text>  <text x="728" y="177" fill="#93c5fd" font-size="10.5" font-family="Consolas,Monospace">$ nmap -p445 --script smb-vuln-ms17-010 10.0.0.10</text>  <text x="140.0" y="219" text-anchor="middle" fill="#fde68a" font-size="11.5" font-family="Consolas,Monospace">http-vuln-cve2021-44228</text>  <text x="285.0" y="219" text-anchor="middle" fill="#e0f2fe" font-size="12" font-family="Arial">80/443/8080</text>  <text x="340" y="219" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">Log4Shell JNDI 注入（最常见 Log4j 漏洞）</text>  <text x="728" y="219" fill="#93c5fd" font-size="10.5" font-family="Consolas,Monospace">$ nmap -sV --script http-vuln-cve2021-44228 --script-args uri=/api/login 10.0.0.1</text>  <text x="140.0" y="261" text-anchor="middle" fill="#fde68a" font-size="11.5" font-family="Consolas,Monospace">ssl-heartbleed</text>  <text x="285.0" y="261" text-anchor="middle" fill="#e0f2fe" font-size="12" font-family="Arial">443/tcp</text>  <text x="340" y="261" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">OpenSSL 心脏滴血（CVE-2014-0160 读内存）</text>  <text x="728" y="261" fill="#93c5fd" font-size="10.5" font-family="Consolas,Monospace">$ nmap -p443 --script ssl-heartbleed example.com</text>  <text x="140.0" y="303" text-anchor="middle" fill="#fde68a" font-size="11.5" font-family="Consolas,Monospace">http-shellshock</text>  <text x="285.0" y="303" text-anchor="middle" fill="#e0f2fe" font-size="12" font-family="Arial">80/443</text>  <text x="340" y="303" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">Bash CVE-2014-6271 破壳（老 Unix CGI 服务器）</text>  <text x="728" y="303" fill="#93c5fd" font-size="10.5" font-family="Consolas,Monospace">$ nmap -sV --script http-shellshock --script-args uri=/cgi-bin/test.cgi target</text>  <text x="140.0" y="345" text-anchor="middle" fill="#fde68a" font-size="11.5" font-family="Consolas,Monospace">smb-enum-shares</text>  <text x="285.0" y="345" text-anchor="middle" fill="#e0f2fe" font-size="12" font-family="Arial">139/445</text>  <text x="340" y="345" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">SMB 共享枚举（匿名可读的话直接拿内网资料）</text>  <text x="728" y="345" fill="#93c5fd" font-size="10.5" font-family="Consolas,Monospace">$ nmap -p139,445 --script smb-enum-shares,smb-ls --script-args smbusername=guest 10.0.0.1</text>  <text x="140.0" y="387" text-anchor="middle" fill="#fde68a" font-size="11.5" font-family="Consolas,Monospace">ftp-brute</text>  <text x="285.0" y="387" text-anchor="middle" fill="#e0f2fe" font-size="12" font-family="Arial">21/tcp</text>  <text x="340" y="387" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">FTP 匿名登录 + 口令爆破（配合 --script-args userdb/passdb）</text>  <text x="728" y="387" fill="#93c5fd" font-size="10.5" font-family="Consolas,Monospace">$ nmap -p21 --script ftp-brute --script-args userdb=users.txt,passdb=pass.txt target</text>  <text x="140.0" y="429" text-anchor="middle" fill="#fde68a" font-size="11.5" font-family="Consolas,Monospace">ssh-brute</text>  <text x="285.0" y="429" text-anchor="middle" fill="#e0f2fe" font-size="12" font-family="Arial">22/tcp</text>  <text x="340" y="429" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">SSH 弱口令爆破（千万不要对生产无授权跑）</text>  <text x="728" y="429" fill="#93c5fd" font-size="10.5" font-family="Consolas,Monospace">$ nmap -p22 --script ssh-brute --script-args userdb=user.lst,passdb=rockyou-500.txt target</text>  <text x="140.0" y="471" text-anchor="middle" fill="#fde68a" font-size="11.5" font-family="Consolas,Monospace">http-wordpress-enum</text>  <text x="285.0" y="471" text-anchor="middle" fill="#e0f2fe" font-size="12" font-family="Arial">80/443</text>  <text x="340" y="471" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">WordPress 用户名/插件/CVE 枚举，配合 wpscan</text>  <text x="728" y="471" fill="#93c5fd" font-size="10.5" font-family="Consolas,Monospace">$ nmap -sV --script http-wordpress-* target</text>  <text x="140.0" y="513" text-anchor="middle" fill="#fde68a" font-size="11.5" font-family="Consolas,Monospace">dns-recursion</text>  <text x="285.0" y="513" text-anchor="middle" fill="#e0f2fe" font-size="12" font-family="Arial">53/udp</text>  <text x="340" y="513" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">DNS 开放递归放大攻击 DDoS 肉鸡扫描</text>  <text x="728" y="513" fill="#93c5fd" font-size="10.5" font-family="Consolas,Monospace">$ sudo nmap -sU -p53 --script dns-recursion 8.8.8.8</text>  <text x="140.0" y="555" text-anchor="middle" fill="#fde68a" font-size="11.5" font-family="Consolas,Monospace">snmp-sysdescr</text>  <text x="285.0" y="555" text-anchor="middle" fill="#e0f2fe" font-size="12" font-family="Arial">161/udp</text>  <text x="340" y="555" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">SNMP public 默认团体字 → 设备 OS/接口/ARP 表全泄露</text>  <text x="728" y="555" fill="#93c5fd" font-size="10.5" font-family="Consolas,Monospace">$ sudo nmap -sU -p161 --script snmp-* --script-args snmpcommunity=public 10.0.0.1</text></svg>


<svg viewBox="0 0 1080 600" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts20" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs20" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars20" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs20"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs20)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts20)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-20 SMB 漏洞实战 4 步：枚举 → 匿名读 → 漏洞扫 → 口令爆破</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">445 端口是内网渗透第一靶场：永恒之蓝/永恒浪漫/SMBGhost/坏獾都靠 SMB</text>
  <circle cx="150" cy="220" r="22" fill="#8b5cf6" fill-opacity=".16" stroke="#8b5cf6" stroke-width="2"/>
  <text x="150" y="225" text-anchor="middle" fill="#8b5cf6" font-size="16" font-weight="bold" font-family="Arial">1</text>
  <text x="150" y="266" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">SMB 端口 + OS 探测</text>
  <path d="M190,220 L340,220" stroke="#38bdf8" stroke-width="2" marker-end="url(#ars20)" fill="none"/>
  <circle cx="380" cy="220" r="22" fill="#8b5cf6" fill-opacity=".16" stroke="#8b5cf6" stroke-width="2"/>
  <text x="380" y="225" text-anchor="middle" fill="#8b5cf6" font-size="16" font-weight="bold" font-family="Arial">2</text>
  <text x="380" y="266" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">共享/用户枚举</text>
  <path d="M420,220 L570,220" stroke="#38bdf8" stroke-width="2" marker-end="url(#ars20)" fill="none"/>
  <circle cx="610" cy="220" r="22" fill="#8b5cf6" fill-opacity=".16" stroke="#8b5cf6" stroke-width="2"/>
  <text x="610" y="225" text-anchor="middle" fill="#8b5cf6" font-size="16" font-weight="bold" font-family="Arial">3</text>
  <text x="610" y="266" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">漏洞扫描（MS17/MS08）</text>
  <path d="M650,220 L800,220" stroke="#38bdf8" stroke-width="2" marker-end="url(#ars20)" fill="none"/>
  <circle cx="840" cy="220" r="22" fill="#8b5cf6" fill-opacity=".16" stroke="#8b5cf6" stroke-width="2"/>
  <text x="840" y="225" text-anchor="middle" fill="#8b5cf6" font-size="16" font-weight="bold" font-family="Arial">4</text>
  <text x="840" y="266" text-anchor="middle" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">SMB 口令爆破</text>
  <rect x="40" y="320" width="1000" height="40" rx="10" fill="#2563eb" fill-opacity=".18" stroke="#2563eb" stroke-width="1.6" filter="url(#shs20)"/>
  <text x="540.0" y="346" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">每步对应的 Nmap 命令（内网横向第 1 套套餐，复制即可跑）</text>
  <text x="54" y="372" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">#</text>
  <text x="54" y="390" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">8</text>
  <text x="54" y="408" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">b</text>
  <text x="54" y="426" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">5</text>
  <text x="54" y="444" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">c</text>
  <text x="54" y="462" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">f</text>
  <text x="54" y="480" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">6</text>
  <rect x="40" y="380" width="1000" height="36" rx="5" fill="#1e293b" stroke="#60a5fa" stroke-width="1"/>  <text x="60" y="404" fill="#dbeafe" font-size="12" font-family="Consolas,Monospace">① $ sudo nmap -sS -p135,139,445,3389 -O -sV 10.0.0.0/24 → 批量定位 SMB 主机 + OS</text>  <rect x="40" y="424" width="1000" height="36" rx="5" fill="#1e293b" stroke="#60a5fa" stroke-width="1"/>  <text x="60" y="448" fill="#dbeafe" font-size="12" font-family="Consolas,Monospace">② $ nmap -p139,445 --script smb-enum-shares,smb-enum-users,smb-ls,smb-os-discovery 10.0.0.10 → 匿名枚举共享/用户</text>  <rect x="40" y="468" width="1000" height="36" rx="5" fill="#1e293b" stroke="#60a5fa" stroke-width="1"/>  <text x="60" y="492" fill="#dbeafe" font-size="12" font-family="Consolas,Monospace">③ $ nmap -p445 --script smb-vuln-* 10.0.0.10  → 一键扫 smb-vuln-ms17-010 / ms08-067 / cve-2020-0796(SMBGhost)</text>  <rect x="40" y="512" width="1000" height="36" rx="5" fill="#1e293b" stroke="#60a5fa" stroke-width="1"/>  <text x="60" y="536" fill="#dbeafe" font-size="12" font-family="Consolas,Monospace">④ $ nmap -p445 --script smb-brute --script-args userdb=./users.txt,passdb=./rockyou-1k.txt 10.0.0.10 → 本地账号爆破</text>  <text x="540" y="570" text-anchor="middle" fill="#60a5fa" font-size="11.5" font-family="Microsoft YaHei,Arial">扫出 VULNERABLE 之后，下一步 Metasploit：use exploit/windows/smb/ms17_010_eternalblue。CISP 考试 MS17/永恒蓝高频！</text>
</svg>


<svg viewBox="0 0 1080 600" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts21" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs21" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars21" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs21"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs21)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts21)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-21 Web 服务 NSE 漏洞链：Headers → 目录爆破 → CVE 验证 → 暴力登录</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">80/443/8080 端口：扫完 Nmap → 直接转 Burp / SQLmap / dirsearch / nuclei</text>
  <rect x="40" y="110" width="1000" height="80" rx="8" fill="#1e293b" stroke="#8b5cf6" stroke-width="1.4"/>  <circle cx="78" cy="150" r="20" fill="#8b5cf6" fill-opacity=".2" stroke="#8b5cf6" stroke-width="2"/>  <text x="78" y="156" text-anchor="middle" fill="#e9d5ff" font-size="16" font-weight="bold" font-family="Arial">1</text>  <text x="120" y="142" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Microsoft YaHei,Arial">基础 HTTP 指纹</text>  <text x="120" y="162" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">http-headers / http-server-header / http-title / http-methods</text>  <text x="120" y="182" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">知道用了 Apache 2.4.41 + OpenSSL 1.1.1k，CVE 就能直接对上</text>  <rect x="40" y="202" width="1000" height="80" rx="8" fill="#1e293b" stroke="#8b5cf6" stroke-width="1.4"/>  <circle cx="78" cy="242" r="20" fill="#8b5cf6" fill-opacity=".2" stroke="#8b5cf6" stroke-width="2"/>  <text x="78" y="248" text-anchor="middle" fill="#e9d5ff" font-size="16" font-weight="bold" font-family="Arial">2</text>  <text x="120" y="234" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Microsoft YaHei,Arial">隐藏路径/后台</text>  <text x="120" y="254" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">http-enum（NIKTO 数据库）/ http-default-accounts</text>  <text x="120" y="274" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">常见 /admin /manager/html /phpMyAdmin 一键扫出</text>  <rect x="40" y="294" width="1000" height="80" rx="8" fill="#1e293b" stroke="#8b5cf6" stroke-width="1.4"/>  <circle cx="78" cy="334" r="20" fill="#8b5cf6" fill-opacity=".2" stroke="#8b5cf6" stroke-width="2"/>  <text x="78" y="340" text-anchor="middle" fill="#e9d5ff" font-size="16" font-weight="bold" font-family="Arial">3</text>  <text x="120" y="326" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Microsoft YaHei,Arial">Web CVE 扫描</text>  <text x="120" y="346" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">http-vuln-*（cve2021-44228 / shellshock / struts2）</text>  <text x="120" y="366" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">CISSP 常考：Log4j2、Shiro550、Spring4Shell、ThinkPHP RCE</text>  <rect x="40" y="386" width="1000" height="80" rx="8" fill="#1e293b" stroke="#8b5cf6" stroke-width="1.4"/>  <circle cx="78" cy="426" r="20" fill="#8b5cf6" fill-opacity=".2" stroke="#8b5cf6" stroke-width="2"/>  <text x="78" y="432" text-anchor="middle" fill="#e9d5ff" font-size="16" font-weight="bold" font-family="Arial">4</text>  <text x="120" y="418" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Microsoft YaHei,Arial">暴力登录后台</text>  <text x="120" y="438" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">http-brute / http-form-brute（指定 form path + params）</text>  <text x="120" y="458" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">DVWA Brute Force：--script-args http-form-brute.path='/login.php',uservar='username',passvar='password'</text>  <rect x="40" y="478" width="1000" height="80" rx="8" fill="#1e293b" stroke="#8b5cf6" stroke-width="1.4"/>  <circle cx="78" cy="518" r="20" fill="#8b5cf6" fill-opacity=".2" stroke="#8b5cf6" stroke-width="2"/>  <text x="78" y="524" text-anchor="middle" fill="#e9d5ff" font-size="16" font-weight="bold" font-family="Arial">5</text>  <text x="120" y="510" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Microsoft YaHei,Arial">SSL/TLS 审计</text>  <text x="120" y="530" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">ssl-enum-ciphers / ssl-cert / ssl-date</text>  <text x="120" y="550" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">TLS1.0/RC4/POODLE/BEAST/SWEET32 不合规项一键全部输出</text></svg>


### 什么是NSE？

NSE（Nmap Scripting Engine）是Nmap的脚本引擎，可以：
- 自动探测漏洞
- 检查服务配置
- 进行高级探测

**通俗理解：** 像请专家来检查每个房间，不同的专家有不同的检查能力。

### 脚本分类

Nmap内置500+脚本，分为14类：

| 类别 | 说明 | 用途 |
|------|------|------|
| auth | 认证相关 | 检查弱认证、匿名访问 |
| broadcast | 广播探测 | 发现本地网络服务 |
| brute | 暴力破解 | 尝试破解密码 |
| default | 默认脚本 | 常用安全检查 |
| discovery | 信息发现 | 发现更多服务信息 |
| exploit | 漏洞利用 | 利用已知漏洞 |
| external | 外部资源 | 查询外部数据库 |
| fuzzer | 模糊测试 | 发送畸形数据测试 |
| intrusive | 入侵性脚本 | 可能影响目标 |
| malware | 恶意软件 | 检查恶意软件痕迹 |
| safe | 安全脚本 | 无影响的探测 |
| version | 版本探测 | 更详细的版本信息 |
| vuln | 漏洞检测 | 检测已知漏洞 |

### 使用脚本的方法

#### 默认脚本（-sC）

```bash
nmap -sC 192.168.1.1
```
运行默认类别的安全脚本

#### 指定脚本（--script）

```bash
nmap --script http-title 192.168.1.1
```
只运行http-title脚本

**运行多个脚本：**
```bash
nmap --script http-title,http-headers 192.168.1.1
```

**运行类别脚本：**
```bash
nmap --script vuln 192.168.1.1
```
运行所有漏洞检测脚本

**运行多个类别：**
```bash
nmap --script "auth,vuln" 192.168.1.1
```

### 常用脚本详解

#### 信息发现脚本

| 脚本 | 命令 | 功能 |
|------|------|------|
| http-title | `--script http-title` | 获取网页标题 |
| http-headers | `--script http-headers` | 获取HTTP头 |
| http-robots.txt | `--script http-robots.txt` | 检查robots.txt |
| http-sitemap-generator | `--script http-sitemap-generator` | 生成站点地图 |
| ftp-anon | `--script ftp-anon` | 检查FTP匿名访问 |
| smb-os-discovery | `--script smb-os-discovery` | SMB系统信息 |
| ssh-hostkey | `--script ssh-hostkey` | SSH密钥信息 |

#### 漏洞检测脚本

| 脚本 | 命令 | 检测内容 |
|------|------|----------|
| http-sql-injection | `--script http-sql-injection` | SQL注入 |
| http-xss | `--script http-xss` | XSS漏洞 |
| http-csrf | `--script http-csrf` | CSRF漏洞 |
| http-fileupload | `--script http-fileupload` | 文件上传 |
| http-enum | `--script http-enum` | 目录枚举 |
| smb-vuln-ms17-010 | `--script smb-vuln-ms17-010` | 永恒之蓝 |
| ssh-vuln-cve2014-6271 | `--script ssh-vuln-cve2014-6271` | Shellshock |
| ssl-heartbleed | `--script ssl-heartbleed` | 心脏出血 |

#### 暴力破解脚本

| 脚本 | 命令 | 目标服务 |
|------|------|----------|
| ssh-brute | `--script ssh-brute` | SSH |
| ftp-brute | `--script ftp-brute` | FTP |
| http-brute | `--script http-brute` | HTTP认证 |
| mysql-brute | `--script mysql-brute` | MySQL |
| smb-brute | `--script smb-brute` | SMB |

### 脚本实战示例

#### 检测永恒之蓝漏洞

```bash
nmap --script smb-vuln-ms17-010 -p445 192.168.1.1
```

输出示例：
```
PORT    STATE SERVICE
445/tcp open  microsoft-ds

| smb-vuln-ms17-010:
|   VULNERABLE:
|   Eternal Blue SMB Remote Code Execution Vulnerability
|   State: VULNERABLE
```

#### 检测心脏出血漏洞

```bash
nmap --script ssl-heartbleed -p443 192.168.1.1
```

#### 扫描Web漏洞

```bash
nmap --script "http-vuln*" -p80 192.168.1.1
```

#### 检查SSH配置

```bash
nmap --script "ssh-*" -p22 192.168.1.1
```

### 自定义NSE脚本

NSE脚本使用Lua语言编写。一个简单的脚本结构：

```lua
description = "检测HTTP服务标题"

categories = {"discovery", "safe"}

author = "Your Name"
license = "Same as Nmap"

portrule = shortport.http

action = function(host, port)
  local result = http.get(host, port, "/")
  if result and result.body then
    local title = string.match(result.body, "<title>([^<]+)</title>")
    if title then
      return "网页标题: " .. title
    end
  end
end
```

---

## 2.8 Zenmap图形化界面使用

<svg viewBox="0 0 1080 560" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts22" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs22" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars22" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs22"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs22)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts22)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-22 Zenmap 主界面 5 大功能区说明（GUI 版 Nmap）</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">Zenmap = Nmap GUI，Kali：sudo zenmap 打开；Windows：开始菜单 Zenmap</text>
  <rect x="60" y="110" width="960" height="410" fill="#0e1626" stroke="#38bdf8" stroke-width="2" rx="8"/>  <rect x="60" y="110" width="960" height="34" fill="#1e3a8a" rx="8"/>  <text x="90" y="134" fill="#e0f2fe" font-size="14" font-family="Consolas,Monospace" font-weight="bold">Zenmap by Nmap   -   sudo nmap -A 192.168.1.0/24</text>  <rect x="70" y="156" width="940" height="54" fill="#111c35" stroke="#334155" rx="5"/>  <text x="80" y="178" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial" font-weight="bold">① 目标 + 配置 Profile 栏</text>  <text x="80" y="198" fill="#fde68a" font-size="12.5" font-family="Consolas,Monospace">Target: 192.168.1.0/24      Profile: [Intense scan (nmap -T4 -A -v) ▾]     [Scan] 按钮</text>  <rect x="70" y="220" width="260" height="286" fill="#0b1530" stroke="#334155" rx="5"/>  <text x="85" y="244" fill="#bfdbfe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">② Profile 编辑器</text>  <rect x="80" y="258" width="26" height="22" fill="#1e293b" stroke="#334155" rx="2"/>  <text x="93" y="274" text-anchor="middle" fill="#93c5fd" font-size="10" font-family="Arial">Profile</text>  <rect x="108" y="258" width="26" height="22" fill="#1e293b" stroke="#334155" rx="2"/>  <text x="121" y="274" text-anchor="middle" fill="#93c5fd" font-size="10" font-family="Arial">Ping</text>  <rect x="136" y="258" width="26" height="22" fill="#1e293b" stroke="#334155" rx="2"/>  <text x="149" y="274" text-anchor="middle" fill="#93c5fd" font-size="10" font-family="Arial">Scan</text>  <rect x="164" y="258" width="26" height="22" fill="#1e293b" stroke="#334155" rx="2"/>  <text x="177" y="274" text-anchor="middle" fill="#93c5fd" font-size="10" font-family="Arial">Source</text>  <rect x="192" y="258" width="26" height="22" fill="#1e293b" stroke="#334155" rx="2"/>  <text x="205" y="274" text-anchor="middle" fill="#93c5fd" font-size="10" font-family="Arial">Other</text>  <rect x="220" y="258" width="26" height="22" fill="#1e293b" stroke="#334155" rx="2"/>  <text x="233" y="274" text-anchor="middle" fill="#93c5fd" font-size="10" font-family="Arial">Target</text>  <rect x="248" y="258" width="26" height="22" fill="#1e293b" stroke="#334155" rx="2"/>  <text x="261" y="274" text-anchor="middle" fill="#93c5fd" font-size="10" font-family="Arial">Time</text>  <rect x="276" y="258" width="26" height="22" fill="#1e293b" stroke="#334155" rx="2"/>  <text x="289" y="274" text-anchor="middle" fill="#93c5fd" font-size="10" font-family="Arial">Script</text>  <rect x="304" y="258" width="26" height="22" fill="#1e293b" stroke="#334155" rx="2"/>  <text x="317" y="274" text-anchor="middle" fill="#93c5fd" font-size="10" font-family="Arial">Output</text>  <text x="85" y="310" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">▸ 点 Scan 页签：-sS / -sT / -sU</text>  <text x="85" y="335" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">▸ 点 Ping 页签：-Pn 跳过 ICMP</text>  <text x="85" y="360" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">▸ 点 Script 页签：选脚本分类</text>  <text x="85" y="385" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">▸ 点 Time 页签：-T0~-T5 档</text>  <text x="85" y="480" fill="#93c5fd" font-size="12" font-family="Microsoft YaHei,Arial">命令框实时预览你选的参数</text>  <rect x="340" y="220" width="680" height="160" fill="#0b1530" stroke="#334155" rx="5"/>  <text x="355" y="244" fill="#bfdbfe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">③ Nmap Output 输出 Tab</text>  <text x="355" y="272" fill="#dbeafe" font-size="12" font-family="Consolas,Monospace">Nmap scan report for 192.168.1.1</text>  <text x="355" y="292" fill="#dbeafe" font-size="12" font-family="Consolas,Monospace">PORT   STATE SERVICE VERSION</text>  <text x="355" y="312" fill="#dbeafe" font-size="12" font-family="Consolas,Monospace">22/tcp open  ssh     OpenSSH 7.9</text>  <text x="355" y="332" fill="#dbeafe" font-size="12" font-family="Consolas,Monospace">80/tcp open  http    nginx 1.14.2</text>  <text x="355" y="352" fill="#dbeafe" font-size="12" font-family="Consolas,Monospace">|_http-title: 欢迎使用路由器</text>  <rect x="340" y="390" width="330" height="116" fill="#0b1530" stroke="#334155" rx="5"/>  <text x="355" y="414" fill="#bfdbfe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">④ Hosts 列表</text>  <text x="355" y="440" fill="#dbeafe" font-size="11.5" font-family="Consolas,Monospace">● 192.168.1.1 (网关)</text>  <text x="355" y="458" fill="#dbeafe" font-size="11.5" font-family="Consolas,Monospace">● 192.168.1.100</text>  <text x="355" y="476" fill="#dbeafe" font-size="11.5" font-family="Consolas,Monospace">● 192.168.1.105</text>  <text x="355" y="494" fill="#dbeafe" font-size="11.5" font-family="Consolas,Monospace">● 192.168.1.199</text>  <rect x="680" y="390" width="340" height="116" fill="#0b1530" stroke="#334155" rx="5"/>  <text x="695" y="414" fill="#bfdbfe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">⑤ Topology 拓扑图</text>  <circle cx="760" cy="455" r="12" fill="#38bdf8"/><circle cx="840" cy="455" r="12" fill="#10b981"/><circle cx="920" cy="455" r="12" fill="#f59e0b"/>  <circle cx="850" cy="485" r="12" fill="#ec4899"/>  <path d="M772,455 L828,455 M852,455 L908,455 M840,467 L850,473" stroke="#64748b" stroke-width="1.5"/></svg>


<svg viewBox="0 0 1080 640" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts23" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs23" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars23" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs23"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs23)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts23)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-23 Zenmap 10 大默认 Profile 对应命令速查</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">每个 Profile 生成一条完整 nmap 命令；点击 Command 标签能看见并复制；可自己保存自定义</text>
  <rect x="50" y="120" width="220" height="42" fill="#1e293b" stroke="#38bdf8"/>  <text x="160.0" y="146" text-anchor="middle" fill="#bfdbfe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">Profile 名称</text>  <rect x="275" y="120" width="250" height="42" fill="#1e293b" stroke="#38bdf8"/>  <text x="400.0" y="146" text-anchor="middle" fill="#bfdbfe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">自动生成的命令</text>  <rect x="530" y="120" width="480" height="42" fill="#1e293b" stroke="#38bdf8"/>  <text x="770.0" y="146" text-anchor="middle" fill="#bfdbfe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">用途说明</text>  <rect x="50" y="162" width="220" height="42" fill="#111c35" stroke="#334155"/>  <rect x="275" y="162" width="250" height="42" fill="#111c35" stroke="#334155"/>  <rect x="530" y="162" width="480" height="42" fill="#111c35" stroke="#334155"/>  <text x="160.0" y="187" text-anchor="middle" fill="#e0f2fe" font-size="12" font-family="Microsoft YaHei,Arial">Intense scan</text>  <text x="285" y="187" fill="#fde68a" font-size="11" font-family="Consolas,Monospace">-T4 -A -v</text>  <text x="540" y="187" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">一键全扫（默认推荐），-A 四合一 + T4 快</text>  <rect x="50" y="204" width="220" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="275" y="204" width="250" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="530" y="204" width="480" height="42" fill="#0b1530" stroke="#334155"/>  <text x="160.0" y="229" text-anchor="middle" fill="#e0f2fe" font-size="12" font-family="Microsoft YaHei,Arial">Intense scan plus UDP</text>  <text x="285" y="229" fill="#fde68a" font-size="11" font-family="Consolas,Monospace">-sS -sU -T4 -A -v</text>  <text x="540" y="229" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">TCP + UDP 双栈全扫（内网精细测绘）</text>  <rect x="50" y="246" width="220" height="42" fill="#111c35" stroke="#334155"/>  <rect x="275" y="246" width="250" height="42" fill="#111c35" stroke="#334155"/>  <rect x="530" y="246" width="480" height="42" fill="#111c35" stroke="#334155"/>  <text x="160.0" y="271" text-anchor="middle" fill="#e0f2fe" font-size="12" font-family="Microsoft YaHei,Arial">Intense scan, all TCP ports</text>  <text x="285" y="271" fill="#fde68a" font-size="11" font-family="Consolas,Monospace">-p 1-65535 -T4 -A -v</text>  <text x="540" y="271" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">全 TCP 端口全扫（推荐所有实战必用）</text>  <rect x="50" y="288" width="220" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="275" y="288" width="250" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="530" y="288" width="480" height="42" fill="#0b1530" stroke="#334155"/>  <text x="160.0" y="313" text-anchor="middle" fill="#e0f2fe" font-size="12" font-family="Microsoft YaHei,Arial">Intense scan, no ping</text>  <text x="285" y="313" fill="#fde68a" font-size="11" font-family="Consolas,Monospace">-T4 -A -v -Pn</text>  <text x="540" y="313" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">扫外网/禁 Ping 目标，跳过主机发现阶段</text>  <rect x="50" y="330" width="220" height="42" fill="#111c35" stroke="#334155"/>  <rect x="275" y="330" width="250" height="42" fill="#111c35" stroke="#334155"/>  <rect x="530" y="330" width="480" height="42" fill="#111c35" stroke="#334155"/>  <text x="160.0" y="355" text-anchor="middle" fill="#e0f2fe" font-size="12" font-family="Microsoft YaHei,Arial">Ping scan</text>  <text x="285" y="355" fill="#fde68a" font-size="11" font-family="Consolas,Monospace">-sn</text>  <text x="540" y="355" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">纯主机存活（ARP/ICMP/80/443 探测），不扫端口</text>  <rect x="50" y="372" width="220" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="275" y="372" width="250" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="530" y="372" width="480" height="42" fill="#0b1530" stroke="#334155"/>  <text x="160.0" y="397" text-anchor="middle" fill="#e0f2fe" font-size="12" font-family="Microsoft YaHei,Arial">Quick scan</text>  <text x="285" y="397" fill="#fde68a" font-size="11" font-family="Consolas,Monospace">-T4 -F</text>  <text x="540" y="397" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">100 个热门端口超快扫（内网赶时间）</text>  <rect x="50" y="414" width="220" height="42" fill="#111c35" stroke="#334155"/>  <rect x="275" y="414" width="250" height="42" fill="#111c35" stroke="#334155"/>  <rect x="530" y="414" width="480" height="42" fill="#111c35" stroke="#334155"/>  <text x="160.0" y="439" text-anchor="middle" fill="#e0f2fe" font-size="12" font-family="Microsoft YaHei,Arial">Quick scan plus</text>  <text x="285" y="439" fill="#fde68a" font-size="11" font-family="Consolas,Monospace">-sV -T4 -O -F --version-light</text>  <text x="540" y="439" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">Quick + 指纹，快速知道服务器牌子</text>  <rect x="50" y="456" width="220" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="275" y="456" width="250" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="530" y="456" width="480" height="42" fill="#0b1530" stroke="#334155"/>  <text x="160.0" y="481" text-anchor="middle" fill="#e0f2fe" font-size="12" font-family="Microsoft YaHei,Arial">Quick traceroute</text>  <text x="285" y="481" fill="#fde68a" font-size="11" font-family="Consolas,Monospace">-sn --traceroute</text>  <text x="540" y="481" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">纯路由追踪，测 CDN/云 WAF 几跳</text>  <rect x="50" y="498" width="220" height="42" fill="#111c35" stroke="#334155"/>  <rect x="275" y="498" width="250" height="42" fill="#111c35" stroke="#334155"/>  <rect x="530" y="498" width="480" height="42" fill="#111c35" stroke="#334155"/>  <text x="160.0" y="523" text-anchor="middle" fill="#e0f2fe" font-size="12" font-family="Microsoft YaHei,Arial">Regular scan</text>  <text x="285" y="523" fill="#fde68a" font-size="11" font-family="Consolas,Monospace">（空）→ 默认 nmap</text>  <text x="540" y="523" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">Top1000 标准扫描</text>  <rect x="50" y="540" width="220" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="275" y="540" width="250" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="530" y="540" width="480" height="42" fill="#0b1530" stroke="#334155"/>  <text x="160.0" y="565" text-anchor="middle" fill="#e0f2fe" font-size="12" font-family="Microsoft YaHei,Arial">Slow comprehensive scan</text>  <text x="285" y="565" fill="#fde68a" font-size="11" font-family="Consolas,Monospace">-sS -sU -T2 -A -v -Pn -p- -g 53 --mtu 24</text>  <text x="540" y="565" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">慢且全，T2 + 65535 + 隐蔽参数，防 IDS 触发</text>  <rect x="50" y="580" width="970" height="30" rx="10" fill="#bbf7d0" fill-opacity=".18" stroke="#bbf7d0" stroke-width="1.6" filter="url(#shs23)"/>
  <text x="535.0" y="606" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">小技巧：Profile 里勾完参数 → 点 [Save Profile] → 下次打开 Zenmap 直接选中你保存的！</text>
  <text x="64" y="632" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">#</text>
  <text x="64" y="650" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">1</text>
  <text x="64" y="668" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">6</text>
  <text x="64" y="686" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">a</text>
  <text x="64" y="704" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">3</text>
  <text x="64" y="722" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">4</text>
  <text x="64" y="740" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">a</text>
</svg>


### 什么是Zenmap？

Zenmap是Nmap的图形化界面，让不熟悉命令行的用户也能使用Nmap。

**注意：** Zenmap已停止开发，但仍可使用。推荐使用Python 2环境。

### Zenmap安装

Zenmap通常随Nmap安装包一起安装。

在Windows中，可以通过桌面快捷方式启动。
在Linux中，需要单独安装：
```bash
sudo apt install zenmap
```

### Zenmap界面

Zenmap主界面分为几个部分：

| 区域 | 功能 |
|------|------|
| 目标输入 | 输入扫描目标 |
| 扫描模式 | 选择预设扫描模式 |
| 命令显示 | 显示实际执行的命令 |
| 输出显示 | 显示扫描结果 |
| 标签页 | 显示不同格式的结果 |

### 预设扫描模式

Zenmap提供多种预设模式：

| 模式 | 命令 | 说明 |
|------|------|------|
| Intense Scan | `nmap -T4 -A -v` | 全面扫描 |
| Intense Scan plus UDP | `nmap -T4 -A -v -sU` | 加上UDP扫描 |
| Intense Scan all TCP ports | `nmap -T4 -A -v -p-` | 全端口扫描 |
| Quick Scan | `nmap -T4 -F` | 快速扫描 |
| Quick Scan Plus | `nmap -T4 -F -sV -O` | 快速加版本探测 |
| Ping Scan | `nmap -sn` | 只探测存活主机 |

### 使用Zenmap扫描

**步骤1：输入目标**
- 在"Target"输入框输入IP或域名

**步骤2：选择模式**
- 从"Profile"下拉框选择扫描模式

**步骤3：点击扫描**
- 点击"Scan"按钮开始扫描

**步骤4：查看结果**
- 结果会在下方区域显示

---

## 2.9 输出格式详解

<svg viewBox="0 0 1080 580" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts24" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs24" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars24" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs24"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs24)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts24)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-24 Nmap 4 大输出格式（N/X/G/S+XML 转 JSON/HTML）</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">-oA 一次输出 4 种格式是好习惯；后续 Ndiff / Nmap-Parser / Metasploit 都能直接吃 XML</text>
  <rect x="40" y="120" width="230" height="50" fill="#1e293b" stroke="#38bdf8"/>  <text x="155.0" y="150" text-anchor="middle" fill="#bfdbfe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">格式参数</text>  <rect x="280" y="120" width="160" height="50" fill="#1e293b" stroke="#38bdf8"/>  <text x="360.0" y="150" text-anchor="middle" fill="#bfdbfe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">扩展名</text>  <rect x="450" y="120" width="300" height="50" fill="#1e293b" stroke="#38bdf8"/>  <text x="600.0" y="150" text-anchor="middle" fill="#bfdbfe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">文件里内容长啥样</text>  <rect x="760" y="120" width="260" height="50" fill="#1e293b" stroke="#38bdf8"/>  <text x="890.0" y="150" text-anchor="middle" fill="#bfdbfe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">后续可以对接什么工具</text>  <rect x="40" y="170" width="230" height="50" fill="#111c35" stroke="#334155"/>  <rect x="280" y="170" width="160" height="50" fill="#111c35" stroke="#334155"/>  <rect x="450" y="170" width="300" height="50" fill="#111c35" stroke="#334155"/>  <rect x="760" y="170" width="260" height="50" fill="#111c35" stroke="#334155"/>  <text x="50" y="200" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">-oN scan.log</text>  <text x="360.0" y="200" text-anchor="middle" fill="#e0f2fe" font-size="14" font-family="Consolas,Monospace">.nmap</text>  <text x="460" y="200" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">人类可读文本：PORT STATE SERVICE 表格</text>  <text x="770" y="200" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">复制粘贴进报告 / cat + grep 筛选</text>  <rect x="40" y="220" width="230" height="50" fill="#0b1530" stroke="#334155"/>  <rect x="280" y="220" width="160" height="50" fill="#0b1530" stroke="#334155"/>  <rect x="450" y="220" width="300" height="50" fill="#0b1530" stroke="#334155"/>  <rect x="760" y="220" width="260" height="50" fill="#0b1530" stroke="#334155"/>  <text x="50" y="250" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">-oX scan.xml</text>  <text x="360.0" y="250" text-anchor="middle" fill="#e0f2fe" font-size="14" font-family="Consolas,Monospace">.xml</text>  <text x="460" y="250" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">XML 结构化，&lt;host&gt;&lt;ports&gt;&lt;port&gt;</text>  <text x="770" y="250" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">db_nmap 导 MSF / Python xml.etree / naxsi / nuclei</text>  <rect x="40" y="270" width="230" height="50" fill="#111c35" stroke="#334155"/>  <rect x="280" y="270" width="160" height="50" fill="#111c35" stroke="#334155"/>  <rect x="450" y="270" width="300" height="50" fill="#111c35" stroke="#334155"/>  <rect x="760" y="270" width="260" height="50" fill="#111c35" stroke="#334155"/>  <text x="50" y="300" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">-oG scan.gnmap</text>  <text x="360.0" y="300" text-anchor="middle" fill="#e0f2fe" font-size="14" font-family="Consolas,Monospace">.gnmap</text>  <text x="460" y="300" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">每行 Host: xxx Ports:22/open///...</text>  <text x="770" y="300" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">awk 一行命令提取 open 端口（最常用 grep 格式）</text>  <rect x="40" y="320" width="230" height="50" fill="#0b1530" stroke="#334155"/>  <rect x="280" y="320" width="160" height="50" fill="#0b1530" stroke="#334155"/>  <rect x="450" y="320" width="300" height="50" fill="#0b1530" stroke="#334155"/>  <rect x="760" y="320" width="260" height="50" fill="#0b1530" stroke="#334155"/>  <text x="50" y="350" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">-oA basename</text>  <text x="360.0" y="350" text-anchor="middle" fill="#e0f2fe" font-size="14" font-family="Consolas,Monospace">4 种全出</text>  <text x="460" y="350" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">一次生成 .nmap/.xml/.gnmap/.xml4 全系列</text>  <text x="770" y="350" fill="#dbeafe" font-size="11.5" font-family="Microsoft YaHei,Arial">归档最佳实践：脚本结果统一放 scan_output/</text>  <rect x="40" y="420" width="480" height="100" rx="10" fill="#0ea5e9" fill-opacity=".18" stroke="#0ea5e9" stroke-width="1.6" filter="url(#shs24)"/>
  <text x="280.0" y="446" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">进阶：XML → JSON / HTML 一键转换</text>
  <text x="54" y="472" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">$ xsltproc scan.xml -o scan.html        → 官方提供 nmap.xsl 样式表，浏览器可直接美化看</text>
  <text x="54" y="490" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">$ nmap-parse-output scan.xml html out   → 社区工具 nmap-parse-output 输出 Markdown/CSV/JSON</text>
  <text x="54" y="508" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">$ python3 -c "import xmltodict; ..." → 写脚本导入 MySQL 资产库</text>
  <rect x="540" y="420" width="480" height="100" rx="10" fill="#8b5cf6" fill-opacity=".18" stroke="#8b5cf6" stroke-width="1.6" filter="url(#shs24)"/>
  <text x="780.0" y="446" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">最实用：awk grepable 快速提取存活主机的开放端口</text>
  <text x="554" y="472" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">$ awk '/open/' scan.gnmap                 → 所有包含 open 的行（核心信息）</text>
  <text x="554" y="490" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">$ grep 'Host: ' scan.gnmap | awk '{print $2}' → 只提取 IP 列表（丢给其他工具）</text>
  <text x="554" y="508" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">$ awk -F '[/ ]' '{for(i=1;i&lt;=NF;i++) if($i=="open") print $(i-4)"/"$(i-2)}'  → 一行导出端口列表</text>
</svg>


### Nmap输出格式

Nmap支持多种输出格式：

| 格式 | 参数 | 说明 |
|------|------|------|
| Normal | -oN | 正常可读格式 |
| XML | -oX | XML格式 |
| Grepable | -oG | grep友好格式 |
| JSON | -oJ | JSON格式 |
| All | -oA | 所有格式 |

### 使用示例

```bash
# Normal格式
nmap -oN result.txt 192.168.1.1

# XML格式
nmap -oX result.xml 192.168.1.1

# Grepable格式
nmap -oG result.gnmap 192.168.1.1

# JSON格式
nmap -oJ result.json 192.168.1.1

# 所有格式
nmap -oA result 192.168.1.1
# 会生成result.nmap, result.xml, result.gnmap
```

### 详细程度控制

| 参数 | 说明 |
|------|------|
| -v | 详细输出 |
| -vv | 更详细输出 |
| -d | 调试输出 |
| -dd | 更详细调试 |

### 输出内容解析

**Normal格式示例：**
```
# Nmap 7.94 scan initiated at 2024-01-01 10:00
Nmap scan report for 192.168.1.1
Host is up (0.001s latency).
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 7.4
80/tcp   open  http    Apache 2.4.6
```

**Grepable格式示例：**
```
Host: 192.168.1.1 () Status: Up
Host: 192.168.1.1 () Ports: 22/open/tcp//ssh//OpenSSH 7.4/, 80/open/tcp//http//Apache 2.4.6/
```

**解析Grepable输出：**
```bash
grep "open" result.gnmap | awk '{print $2}'
```
获取所有开端口的主机

---

## 2.10 实战案例：端口扫描与服务识别

<svg viewBox="0 0 1080 640" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts25" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs25" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars25" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs25"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs25)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts25)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-25 内网 C 段渗透 Nmap 标准工作流（5 阶段）</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">拿到一个内网 IP 段后的「标准作业流程」，严格按顺序来不要跳，跳过 = 漏洞</text>
  <rect x="40" y="110" width="1000" height="90" rx="8" fill="#0ea5e9" fill-opacity=".13" stroke="#0ea5e9" stroke-width="1.5"/>  <text x="60" y="140" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Microsoft YaHei,Arial">① 存活发现 / 资产盘点</text>  <text x="60" y="164" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">$ nmap -sn 10.0.0.0/24 -oA 01_hosts</text>  <text x="60" y="188" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">ICMP + ARP + TCP 80/443 探测，得到 192.168.1.1~254 中 Host is up 的主机列表，存成 XML + gnmap</text>  <rect x="40" y="208" width="1000" height="90" rx="8" fill="#16a34a" fill-opacity=".13" stroke="#16a34a" stroke-width="1.5"/>  <text x="60" y="238" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Microsoft YaHei,Arial">② 全端口 TCP 批量扫（核心！）</text>  <text x="60" y="262" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">$ nmap -sS -p- -T4 -Pn -iL live_hosts.txt -oA 02_fulltcp</text>  <text x="60" y="286" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">把上一步 -oG 提取的存活主机当 -iL 输入，65535 全端口扫出来，防止漏掉 8080/8443/18080 这类非主流端口</text>  <rect x="40" y="306" width="1000" height="90" rx="8" fill="#8b5cf6" fill-opacity=".13" stroke="#8b5cf6" stroke-width="1.5"/>  <text x="60" y="336" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Microsoft YaHei,Arial">③ 服务版本 + OS 指纹</text>  <text x="60" y="360" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">$ nmap -sV --version-intensity 7 -O -sC -p '开的端口' -iL live.txt -oA 03_finger</text>  <text x="60" y="384" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">只针对开的端口做深度识别：nginx1.14 / OpenSSH7.4 / SMB Win2008R2，出来 CPE 直接去 CVE 搜漏洞</text>  <rect x="40" y="404" width="1000" height="90" rx="8" fill="#dc2626" fill-opacity=".13" stroke="#dc2626" stroke-width="1.5"/>  <text x="60" y="434" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Microsoft YaHei,Arial">④ NSE 漏洞 + 弱口令扫</text>  <text x="60" y="458" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">$ nmap --script vuln,auth,brute -sV -p21,22,80,443,445,3306,3389,6379 -iL live.txt -oA 04_vuln</text>  <text x="60" y="482" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">MS17-010（永恒之蓝）/ Redis 未授权 / MySQL 弱口令 / FTP anonymous / Tomcat manager 弱口令 全输出</text>  <rect x="40" y="502" width="1000" height="90" rx="8" fill="#b45309" fill-opacity=".13" stroke="#b45309" stroke-width="1.5"/>  <text x="60" y="532" fill="#e0f2fe" font-size="14" font-weight="bold" font-family="Microsoft YaHei,Arial">⑤ 报告 + 归档 + Ndiff 变化</text>  <text x="60" y="556" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">$ ndiff 03_finger.xml 03_finger_v2.xml &gt; diff.txt；统一打包 scan_2024_xx_xx.zip</text>  <text x="60" y="580" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">隔一段时间重扫看新开放端口 = 新上线系统；把 XML 直接导进 Metasploit：db_import nmap.xml 自动填 workspace</text>  <text x="540" y="620" text-anchor="middle" fill="#60a5fa" font-size="11.5" font-family="Microsoft YaHei,Arial">5 条命令走一遍，内网渗透的 90% 资产信息就全了。剩下的就是拿 Nmap 结果去开 MSF / Hydra / Burp。</text>
</svg>


### 场景：扫描内网服务器

**目标：** 发现内网服务器有哪些开放端口，运行什么服务。

**步骤：**

**步骤1：主机发现**
```bash
nmap -sn 192.168.1.0/24
```
先找出哪些主机存活，不扫描端口。

输出示例：
```
Nmap scan report for 192.168.1.1
Host is up (0.001s latency).
Nmap scan report for 192.168.1.10
Host is up (0.001s latency).
Nmap scan report for 192.168.1.100
Host is up (0.001s latency).
```

**步骤2：端口扫描**
```bash
nmap -sS -p 1-1000 192.168.1.1,10,100
```
扫描存活主机的常用端口。

**步骤3：服务探测**
```bash
nmap -sV -p 22,80,443,3306 192.168.1.1
```
探测发现端口的服务版本。

输出示例：
```
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 7.4 (Ubuntu Linux)
80/tcp   open  http    Apache httpd 2.4.29 (Ubuntu)
443/tcp  open  ssl/http Apache httpd 2.4.29
3306/tcp open  mysql   MySQL 5.7.31
```

**步骤4：操作系统探测**
```bash
nmap -O 192.168.1.1
```
识别目标操作系统。

输出示例：
```
OS details: Linux 4.15 - 5.4 (Ubuntu)
```

### 场景：快速扫描大量主机

```bash
nmap -T4 -F --min-rate 1000 192.168.0.0/16
```

参数说明：
- `-T4`：速度模板（0-5，4较快）
- `-F`：快速扫描（100端口）
- `--min-rate 1000`：最少每秒1000包

---

## 2.11 实战案例：操作系统探测

### 场景：识别目标服务器操作系统

```bash
nmap -O 192.168.1.1
```

输出示例：
```
Running: Linux 4.X
OS CPE: cpe:/o:linux:linux_kernel:4
OS details: Linux 4.15 - 5.6
Network Distance: 1 hop
```

### 更详细的探测

```bash
nmap -O --osscan-guess 192.168.1.1
```

即使不确定，也会猜测最可能的系统。

### Windows系统探测

```bash
nmap -O --osscan-limit 192.168.1.1
```

限制只探测Windows系统，节省时间。

---

## 2.12 实战案例：内网资产发现

### 场景：发现内网所有资产

**步骤1：主机发现**
```bash
nmap -sn 10.0.0.0/8
```
扫描整个10.x.x.x网络（65536个主机）

**优化：加快扫描**
```bash
nmap -sn -T5 --min-rate 5000 10.0.0.0/8
```

**步骤2：端口扫描存活主机**

先保存存活主机：
```bash
nmap -sn -oG alive.gnmap 192.168.0.0/16
grep "Up" alive.gnmap | awk '{print $2}' > hosts.txt
```

然后扫描：
```bash
nmap -iL hosts.txt -F
```

**步骤3：全端口扫描关键主机**

找出开放端口最多的主机，进行详细扫描：
```bash
nmap -p- -sV -O critical_host
```

---

## 2.13 实战案例：漏洞探测脚本实战

<svg viewBox="0 0 1080 670" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts26" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs26" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars26" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs26"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs26)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts26)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-26 外网授权渗透目标：从域名 → 子域 → 端口 → 漏洞 的完整 Nmap 链路</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">典型场景：授权渗透 www.target.cn（一级域名）→ Nmap 只负责一层，前后用的工具也要知道</text>
  <rect x="40" y="110" width="1000" height="72" rx="6" fill="#0ea5e9" fill-opacity=".13" stroke="#0ea5e9" stroke-width="1.3"/>  <text x="60" y="138" fill="#e0f2fe" font-size="13.5" font-weight="bold" font-family="Microsoft YaHei,Arial">子域枚举</text>  <text x="240" y="138" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">Amass / subfinder / OneForAll</text>  <text x="60" y="162" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">→ 得到 128 个子域 + 256 个 IP</text>  <rect x="40" y="190" width="1000" height="72" rx="6" fill="#8b5cf6" fill-opacity=".13" stroke="#8b5cf6" stroke-width="1.3"/>  <text x="60" y="218" fill="#e0f2fe" font-size="13.5" font-weight="bold" font-family="Microsoft YaHei,Arial">CDN 判断 / 去 CDN</text>  <text x="240" y="218" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">dig + 多地 ping / DNSDB</text>  <text x="60" y="242" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">→ 剩下 42 个真实源站 IP 段</text>  <rect x="40" y="270" width="1000" height="72" rx="6" fill="#10b981" fill-opacity=".13" stroke="#10b981" stroke-width="1.3"/>  <text x="60" y="298" fill="#e0f2fe" font-size="13.5" font-weight="bold" font-family="Microsoft YaHei,Arial">主机存活（Nmap #1）</text>  <text x="240" y="298" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">nmap -sn -PE -PP -iL ips.txt</text>  <text x="60" y="322" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">→ 31 个 Host is up 真实机</text>  <rect x="40" y="350" width="1000" height="72" rx="6" fill="#f59e0b" fill-opacity=".13" stroke="#f59e0b" stroke-width="1.3"/>  <text x="60" y="378" fill="#e0f2fe" font-size="13.5" font-weight="bold" font-family="Microsoft YaHei,Arial">全端口（Nmap #2）</text>  <text x="240" y="378" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">nmap -sS -p- -T4 -Pn -iL live.txt</text>  <text x="60" y="402" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">→ 开了 27 个非标准端口，包括 8443/8888</text>  <rect x="40" y="430" width="1000" height="72" rx="6" fill="#dc2626" fill-opacity=".13" stroke="#dc2626" stroke-width="1.3"/>  <text x="60" y="458" fill="#e0f2fe" font-size="13.5" font-weight="bold" font-family="Microsoft YaHei,Arial">指纹 + NSE（Nmap #3）</text>  <text x="240" y="458" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">nmap -sV --version-intensity 7 -O --script vuln,auth,discovery,default -p 开的端口</text>  <text x="60" y="482" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">→ 关键命中：Log4j + Heartbleed + Redis 未授权</text>  <rect x="40" y="510" width="1000" height="72" rx="6" fill="#ec4899" fill-opacity=".13" stroke="#ec4899" stroke-width="1.3"/>  <text x="60" y="538" fill="#e0f2fe" font-size="13.5" font-weight="bold" font-family="Microsoft YaHei,Arial">漏洞利用</text>  <text x="240" y="538" fill="#fde68a" font-size="12" font-family="Consolas,Monospace">MSF / Burp / SQLmap / Nuclei</text>  <text x="60" y="562" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">→ 6 个高危 RCE + 12 中危 + 报告提交</text>  <rect x="40" y="600" width="1000" height="40" rx="10" fill="#fbcfe8" fill-opacity=".18" stroke="#fbcfe8" stroke-width="1.6" filter="url(#shs26)"/>
  <text x="540.0" y="626" text-anchor="middle" fill="#bfdbfe" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">核心：Nmap 在这个链路里做的是「③~④~⑤」步，不是单独一件武器，而是 3 次递进扫描的武器组合！</text>
  <text x="54" y="652" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">#</text>
  <text x="54" y="670" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">e</text>
  <text x="54" y="688" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">c</text>
  <text x="54" y="706" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">4</text>
  <text x="54" y="724" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">8</text>
  <text x="54" y="742" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">9</text>
  <text x="54" y="760" fill="#dbeafe" font-size="12.5" font-family="Microsoft YaHei,Arial">9</text>
</svg>


### 场景：批量漏洞扫描

**检测常见漏洞：**
```bash
nmap --script vuln 192.168.1.1
```

**检测特定漏洞：**

**永恒之蓝：**
```bash
nmap --script smb-vuln-ms17-010 -p445 192.168.1.0/24
```

**心脏出血：**
```bash
nmap --script ssl-heartbleed -p443 target.example.com
```

**BlueKeep：**
```bash
nmap --script rdp-vuln-ms12-020 -p3389 192.168.1.0/24
```

### 场景：Web服务漏洞扫描

```bash
nmap --script "http-vuln*" -p80,443 target.example.com
```

输出示例：
```
PORT   STATE SERVICE
80/tcp open  http
| http-vuln-cve2011-3192:
|   VULNERABLE:
|   Apache byterange filter DoS
```

---

## 2.14 性能优化技巧

<svg viewBox="0 0 1080 640" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts27" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs27" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars27" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs27"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs27)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts27)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-27 Nmap 初学者最常踩的 10 个坑 + 解决方案</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">出问题先对照这个表，90% 的报错/扫不出来都在里面</text>
  <rect x="40" y="110" width="310" height="44" fill="#1e293b" stroke="#38bdf8"/>  <text x="195.0" y="138" text-anchor="middle" fill="#bfdbfe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">常见现象</text>  <rect x="360" y="110" width="680" height="44" fill="#1e293b" stroke="#38bdf8"/>  <text x="700.0" y="138" text-anchor="middle" fill="#bfdbfe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">一句话解决 / 参数</text>  <rect x="40" y="154" width="310" height="44" fill="#111c35" stroke="#334155"/>  <rect x="360" y="154" width="680" height="44" fill="#111c35" stroke="#334155"/>  <text x="195.0" y="180" text-anchor="middle" fill="#fecaca" font-size="11.5" font-family="Microsoft YaHei,Arial">全部主机都是 Host seems down</text>  <text x="370" y="180" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">-Pn！目标禁 ICMP 或防火墙吞包，跳过 Ping 扫</text>  <rect x="40" y="198" width="310" height="44" fill="#0b1530" stroke="#334155"/>  <rect x="360" y="198" width="680" height="44" fill="#0b1530" stroke="#334155"/>  <text x="195.0" y="224" text-anchor="middle" fill="#fecaca" font-size="11.5" font-family="Microsoft YaHei,Arial">Windows 提示 'nmap' 不是内部命令</text>  <text x="370" y="224" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">PATH 没加 Nmap 目录；或没以管理员打开 cmd/PowerShell</text>  <rect x="40" y="242" width="310" height="44" fill="#111c35" stroke="#334155"/>  <rect x="360" y="242" width="680" height="44" fill="#111c35" stroke="#334155"/>  <text x="195.0" y="268" text-anchor="middle" fill="#fecaca" font-size="11.5" font-family="Microsoft YaHei,Arial">很多端口 filtered 或者漏扫</text>  <text x="370" y="268" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">用 root / 管理员！-sS 需要 raw socket；普通用户只能 -sT</text>  <rect x="40" y="286" width="310" height="44" fill="#0b1530" stroke="#334155"/>  <rect x="360" y="286" width="680" height="44" fill="#0b1530" stroke="#334155"/>  <text x="195.0" y="312" text-anchor="middle" fill="#fecaca" font-size="11.5" font-family="Microsoft YaHei,Arial">扫一个 IP 超过 1 小时</text>  <text x="370" y="312" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">加 --min-rate 3000 --max-retries 1 -T4，限速放宽</text>  <rect x="40" y="330" width="310" height="44" fill="#111c35" stroke="#334155"/>  <rect x="360" y="330" width="680" height="44" fill="#111c35" stroke="#334155"/>  <text x="195.0" y="356" text-anchor="middle" fill="#fecaca" font-size="11.5" font-family="Microsoft YaHei,Arial">扫到一半崩溃 / 内存爆</text>  <text x="370" y="356" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">加 --host-timeout 30m，加上 --max-parallelism 64，分网段跑</text>  <rect x="40" y="374" width="310" height="44" fill="#0b1530" stroke="#334155"/>  <rect x="360" y="374" width="680" height="44" fill="#0b1530" stroke="#334155"/>  <text x="195.0" y="400" text-anchor="middle" fill="#fecaca" font-size="11.5" font-family="Microsoft YaHei,Arial">-O 无法猜系统 (no fingerprints)</text>  <text x="370" y="400" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">至少需要 1 open + 1 closed TCP，用 --osscan-guess 强制猜</text>  <rect x="40" y="418" width="310" height="44" fill="#111c35" stroke="#334155"/>  <rect x="360" y="418" width="680" height="44" fill="#111c35" stroke="#334155"/>  <text x="195.0" y="444" text-anchor="middle" fill="#fecaca" font-size="11.5" font-family="Microsoft YaHei,Arial">-sV 服务识别全是 unknown</text>  <text x="370" y="444" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">--version-intensity 7/9，或者先扫出 open 端口再单独 -sV</text>  <rect x="40" y="462" width="310" height="44" fill="#0b1530" stroke="#334155"/>  <rect x="360" y="462" width="680" height="44" fill="#0b1530" stroke="#334155"/>  <text x="195.0" y="488" text-anchor="middle" fill="#fecaca" font-size="11.5" font-family="Microsoft YaHei,Arial">NSE 脚本啥都没输出</text>  <text x="370" y="488" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">--script-help 看脚本触发条件；端口对不上、参数缺了都不跑</text>  <rect x="40" y="506" width="310" height="44" fill="#111c35" stroke="#334155"/>  <rect x="360" y="506" width="680" height="44" fill="#111c35" stroke="#334155"/>  <text x="195.0" y="532" text-anchor="middle" fill="#fecaca" font-size="11.5" font-family="Microsoft YaHei,Arial">扫外网被云主机 WAF 封 IP</text>  <text x="370" y="532" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">-T2 + --scan-delay 1s + -D RND:3 混诱饵 IP + -f 分片</text>  <rect x="40" y="550" width="310" height="44" fill="#0b1530" stroke="#334155"/>  <rect x="360" y="550" width="680" height="44" fill="#0b1530" stroke="#334155"/>  <text x="195.0" y="576" text-anchor="middle" fill="#fecaca" font-size="11.5" font-family="Microsoft YaHei,Arial">输出表格太乱不好贴报告</text>  <text x="370" y="576" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">统一用 -oA 导 XML，xsltproc 转 html 或 nmap-parse-output md</text></svg>


### 扫描速度控制

Nmap提供速度模板（-T0到-T5）：

| 模板 | 说明 | 适用场景 |
|------|------|----------|
| T0 | 极慢（ Paranoid） | 避免被检测 |
| T1 | 慢 Sneaky） | 慢慢扫描 |
| T2 | 适中 Polite） | 减少带宽占用 |
| T3 | 正常 Normal） | 默认速度 |
| T4 | 快 Aggressive） | 快速扫描 |
| T5 | 极快 Insane） | 最快，可能丢包 |

```bash
nmap -T4 192.168.1.1
```

### 自定义速度参数

```bash
nmap --min-rate 1000 --max-rate 5000 192.168.1.1
```

**参数说明：**
- `--min-rate`：最小发包速率
- `--max-rate`：最大发包速率
- `--max-retries`：最大重试次数

### 并发控制

```bash
nmap --min-hostgroup 50 --max-hostgroup 100 192.168.0.0/16
```

**参数说明：**
- `--min-hostgroup`：最小并发主机数
- `--max-hostgroup`：最大并发主机数

### 超时控制

```bash
nmap --host-timeout 30m 192.168.1.1
```

每个主机最多扫描30分钟，超时跳过。

---

## 2.15 其他常用参数

<svg viewBox="0 0 1080 650" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts28" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs28" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars28" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs28"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs28)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts28)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-28 Nmap 最佳实践 10 条（规范 + 性能 + 合规）</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">CTF / 红队 / 合规审计 / 日常巡检 都适用的标准化习惯，养成少走 3 年弯路</text>
  <rect x="40" y="110" width="170" height="48" fill="#1e293b" stroke="#38bdf8"/>  <text x="125.0" y="138" text-anchor="middle" fill="#bfdbfe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">最佳实践</text>  <rect x="220" y="110" width="820" height="48" fill="#1e293b" stroke="#38bdf8"/>  <text x="630.0" y="138" text-anchor="middle" fill="#bfdbfe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">解读 + 理由</text>  <rect x="40" y="158" width="170" height="48" fill="#111c35" stroke="#334155"/>  <rect x="220" y="158" width="820" height="48" fill="#111c35" stroke="#334155"/>  <text x="125.0" y="186" text-anchor="middle" fill="#e0f2fe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">授权第一</text>  <text x="235" y="186" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">写扫描前先确认书面授权，nmap -sP 也是触网行为，误封 80 端口也算事故</text>  <rect x="40" y="206" width="170" height="48" fill="#0b1530" stroke="#334155"/>  <rect x="220" y="206" width="820" height="48" fill="#0b1530" stroke="#334155"/>  <text x="125.0" y="234" text-anchor="middle" fill="#e0f2fe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">多阶段扫</text>  <text x="235" y="234" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">不要一次 -A -p- /24；先 -sn → -sS Top1000 → 全端口 → -sV → NSE 分步走</text>  <rect x="40" y="254" width="170" height="48" fill="#111c35" stroke="#334155"/>  <rect x="220" y="254" width="820" height="48" fill="#111c35" stroke="#334155"/>  <text x="125.0" y="282" text-anchor="middle" fill="#e0f2fe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">备份输出</text>  <text x="235" y="282" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">每条扫都加 -oA scan/xxx_&lt;IP段&gt;_&lt;日期&gt;，扫崩了继续 --resume 接着来</text>  <rect x="40" y="302" width="170" height="48" fill="#0b1530" stroke="#334155"/>  <rect x="220" y="302" width="820" height="48" fill="#0b1530" stroke="#334155"/>  <text x="125.0" y="330" text-anchor="middle" fill="#e0f2fe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">sudo/root</text>  <text x="235" y="330" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">Linux 一定 sudo nmap...；Windows 一定管理员身份开 PowerShell/cmd</text>  <rect x="40" y="350" width="170" height="48" fill="#111c35" stroke="#334155"/>  <rect x="220" y="350" width="820" height="48" fill="#111c35" stroke="#334155"/>  <text x="125.0" y="378" text-anchor="middle" fill="#e0f2fe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">不要默认端口</text>  <text x="235" y="378" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">-p- 是实战底线；Top1000 漏掉 98.5% 端口；很多系统喜欢跑 8081/9090</text>  <rect x="40" y="398" width="170" height="48" fill="#0b1530" stroke="#334155"/>  <rect x="220" y="398" width="820" height="48" fill="#0b1530" stroke="#334155"/>  <text x="125.0" y="426" text-anchor="middle" fill="#e0f2fe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">-sV 加强度</text>  <text x="235" y="426" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">--version-intensity 7 起步；强度 5 很多中间件版本扫不精确</text>  <rect x="40" y="446" width="170" height="48" fill="#111c35" stroke="#334155"/>  <rect x="220" y="446" width="820" height="48" fill="#111c35" stroke="#334155"/>  <text x="125.0" y="474" text-anchor="middle" fill="#e0f2fe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">-Pn 外网默认</text>  <text x="235" y="474" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">80% 云主机禁 ICMP，习惯性加 -Pn 避免 Host seems down</text>  <rect x="40" y="494" width="170" height="48" fill="#0b1530" stroke="#334155"/>  <rect x="220" y="494" width="820" height="48" fill="#0b1530" stroke="#334155"/>  <text x="125.0" y="522" text-anchor="middle" fill="#e0f2fe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">内网 UDP 必扫</text>  <text x="235" y="522" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">-sU --top-ports 20 -sV（53/67/123/161/500/5060），漏了=SNMP 漏洞没了</text>  <rect x="40" y="542" width="170" height="48" fill="#111c35" stroke="#334155"/>  <rect x="220" y="542" width="820" height="48" fill="#111c35" stroke="#334155"/>  <text x="125.0" y="570" text-anchor="middle" fill="#e0f2fe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">速率匹配环境</text>  <text x="235" y="570" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">机房万兆：-T5 --min-rate 8000；跨国：-T2 --scan-delay 500ms</text>  <rect x="40" y="590" width="170" height="48" fill="#0b1530" stroke="#334155"/>  <rect x="220" y="590" width="820" height="48" fill="#0b1530" stroke="#334155"/>  <text x="125.0" y="618" text-anchor="middle" fill="#e0f2fe" font-size="13" font-weight="bold" font-family="Microsoft YaHei,Arial">报告标准化</text>  <text x="235" y="618" fill="#dbeafe" font-size="12" font-family="Microsoft YaHei,Arial">XML + HTML 交付客户；gnmap + awk 提取导入 Excel 资产台账</text></svg>


### 主机发现参数

| 参数 | 说明 |
|------|------|
| -sn | 只探测存活，不扫描端口 |
| -PS | TCP SYN Ping |
| -PA | TCP ACK Ping |
| -PU | UDP Ping |
| -PE | ICMP Echo Ping |
| -PP | ICMP Timestamp Ping |
| -PM | ICMP Address Mask Ping |
| -PR | ARP Ping（局域网最快） |

### 禁用Ping

```bash
nmap -Pn 192.168.1.1
```
跳过主机发现，直接扫描端口。

### 源地址控制

```bash
nmap -S 192.168.1.100 192.168.1.1
```
指定源IP地址。

```bash
nmap -e eth0 192.168.1.1
```
指定网络接口。

### DNS控制

```bash
nmap -n 192.168.1.1
```
不进行DNS解析。

```bash
nmap -R 192.168.1.1
```
进行DNS反向解析。

---

## 总结

<svg viewBox="0 0 1080 680" width="100%" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1080px;margin:18px auto;display:block;border:1px solid #1a2e4a;border-radius:14px;background:#0a1020;">
  <defs>
    <linearGradient id="gts29" x1="0" x2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    <linearGradient id="gbs29" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0b1530"/><stop offset="100%" stop-color="#050816"/></linearGradient>
    <marker id="ars29" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker>
    <filter id="shs29"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".6"/></filter>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#gbs29)" rx="14"/>
  <text x="540" y="44" text-anchor="middle" fill="url(#gts29)" font-size="22" font-weight="bold" font-family="Microsoft YaHei,Arial">图 2-29 Nmap 终极速查海报：命令按功能分 9 张卡牌，贴显示器！</text>
  <text x="540" y="72" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Microsoft YaHei,Arial">记住 9 张卡牌里的命令，日常遇到任何扫描需求 3 秒内就能写出完整命令</text>
  <rect x="40" y="110" width="320" height="160" rx="12" fill="#0ea5e9" fill-opacity=".14" stroke="#0ea5e9" stroke-width="1.8" filter="url(#shs29)"/>  <rect x="40" y="110" width="320" height="32" fill="#0ea5e9" fill-opacity=".6" rx="12"/>  <text x="200" y="132" text-anchor="middle" fill="#fff" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">1 主机发现</text>  <text x="60" y="176" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">-sn 10.0.0.0/24</text>  <text x="60" y="198" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">-PE -PP -PM -PR</text>  <text x="60" y="220" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">-n -R -iL list.txt</text>  <text x="60" y="242" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">--traceroute</text>  <rect x="375" y="110" width="320" height="160" rx="12" fill="#8b5cf6" fill-opacity=".14" stroke="#8b5cf6" stroke-width="1.8" filter="url(#shs29)"/>  <rect x="375" y="110" width="320" height="32" fill="#8b5cf6" fill-opacity=".6" rx="12"/>  <text x="535" y="132" text-anchor="middle" fill="#fff" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">2 端口扫描</text>  <text x="395" y="176" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">-sS -p- -T4 -Pn</text>  <text x="395" y="198" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">-sT -F（无权限）</text>  <text x="395" y="220" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">-sA 判断防火墙</text>  <text x="395" y="242" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">-sN -sF -sX 隐蔽</text>  <rect x="710" y="110" width="320" height="160" rx="12" fill="#10b981" fill-opacity=".14" stroke="#10b981" stroke-width="1.8" filter="url(#shs29)"/>  <rect x="710" y="110" width="320" height="32" fill="#10b981" fill-opacity=".6" rx="12"/>  <text x="870" y="132" text-anchor="middle" fill="#fff" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">3 UDP 扫描</text>  <text x="730" y="176" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">-sU -sV --top-ports 20</text>  <text x="730" y="198" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">-sU -p53,67,161</text>  <text x="730" y="220" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">--min-rate 2000</text>  <text x="730" y="242" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">--max-retries 1</text>  <rect x="40" y="285" width="320" height="160" rx="12" fill="#f59e0b" fill-opacity=".14" stroke="#f59e0b" stroke-width="1.8" filter="url(#shs29)"/>  <rect x="40" y="285" width="320" height="32" fill="#f59e0b" fill-opacity=".6" rx="12"/>  <text x="200" y="307" text-anchor="middle" fill="#fff" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">4 指纹识别</text>  <text x="60" y="351" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">-sV --version-intensity 7</text>  <text x="60" y="373" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">-O --osscan-guess</text>  <text x="60" y="395" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">-A（-sV+-O+-sC+--traceroute）</text>  <text x="60" y="417" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">--version-trace</text>  <rect x="375" y="285" width="320" height="160" rx="12" fill="#dc2626" fill-opacity=".14" stroke="#dc2626" stroke-width="1.8" filter="url(#shs29)"/>  <rect x="375" y="285" width="320" height="32" fill="#dc2626" fill-opacity=".6" rx="12"/>  <text x="535" y="307" text-anchor="middle" fill="#fff" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">5 NSE 脚本</text>  <text x="395" y="351" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">-sC（default）</text>  <text x="395" y="373" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">--script vuln</text>  <text x="395" y="395" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">--script smb-vuln-*</text>  <text x="395" y="417" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">--script-help xxx 看用法</text>  <rect x="710" y="285" width="320" height="160" rx="12" fill="#ec4899" fill-opacity=".14" stroke="#ec4899" stroke-width="1.8" filter="url(#shs29)"/>  <rect x="710" y="285" width="320" height="32" fill="#ec4899" fill-opacity=".6" rx="12"/>  <text x="870" y="307" text-anchor="middle" fill="#fff" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">6 弱口令爆破</text>  <text x="730" y="351" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">--script ftp-brute</text>  <text x="730" y="373" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">--script ssh-brute</text>  <text x="730" y="395" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">--script smb-brute</text>  <text x="730" y="417" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">--script http-brute</text>  <rect x="40" y="460" width="320" height="160" rx="12" fill="#a855f7" fill-opacity=".14" stroke="#a855f7" stroke-width="1.8" filter="url(#shs29)"/>  <rect x="40" y="460" width="320" height="32" fill="#a855f7" fill-opacity=".6" rx="12"/>  <text x="200" y="482" text-anchor="middle" fill="#fff" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">7 规避 IDS</text>  <text x="60" y="526" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">-f / --mtu 24</text>  <text x="60" y="548" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">-D RND:5,ME 诱饵</text>  <text x="60" y="570" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">-g 53 源端口伪装</text>  <text x="60" y="592" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">--spoof-mac Huawei</text>  <rect x="375" y="460" width="320" height="160" rx="12" fill="#06b6d4" fill-opacity=".14" stroke="#06b6d4" stroke-width="1.8" filter="url(#shs29)"/>  <rect x="375" y="460" width="320" height="32" fill="#06b6d4" fill-opacity=".6" rx="12"/>  <text x="535" y="482" text-anchor="middle" fill="#fff" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">8 性能速率</text>  <text x="395" y="526" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">-T0 偏执 / -T5 疯狂</text>  <text x="395" y="548" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">--min-rate 3000</text>  <text x="395" y="570" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">--max-parallelism 128</text>  <text x="395" y="592" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">--host-timeout 30m</text>  <rect x="710" y="460" width="320" height="160" rx="12" fill="#059669" fill-opacity=".14" stroke="#059669" stroke-width="1.8" filter="url(#shs29)"/>  <rect x="710" y="460" width="320" height="32" fill="#059669" fill-opacity=".6" rx="12"/>  <text x="870" y="482" text-anchor="middle" fill="#fff" font-size="15" font-weight="bold" font-family="Microsoft YaHei,Arial">9 输出报告</text>  <text x="730" y="526" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">-oA prefix（4 种全出）</text>  <text x="730" y="548" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">-oX scan.xml（导入 MSF）</text>  <text x="730" y="570" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">--resume xxx.nmap 恢复</text>  <text x="730" y="592" fill="#dbeafe" font-size="13" font-family="Consolas,Monospace">-oG grepable 给 awk</text></svg>


本章详细介绍了Nmap的使用：

1. **安装配置**：Windows/Linux/macOS安装方法
2. **基础扫描**：主机发现、端口扫描、扫描方式
3. **高级技术**：操作系统探测、服务探测、防火墙规避
4. **脚本引擎**：NSE脚本使用、漏洞探测
5. **实战案例**：资产发现、漏洞扫描、操作系统探测

Nmap是网络安全的基础工具，掌握Nmap是进行安全测试的第一步。

下一章我们将学习Metasploit——渗透测试框架！