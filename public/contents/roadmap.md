# 网络安全学习路线总览（22 大方向 · 四阶段 · 全网安百宝箱）

---

## 🚩 路线总览

```
零基础阶段 (0-3个月) ──▶ 方向分化 (3-12个月) ──▶ 深度突破 (12-24个月) ──▶ 专家深耕 (24个月+)
```

---

## 📚 第一阶段：通用基础（0-3 个月）—— 所有人必过

> 无论你以后走哪个方向，以下都是地基。

### 1.1 计算机基础

| 模块 | 核心内容 | 推荐资源 |
|------|---------|---------|
| **操作系统** | 进程/线程、内存管理、文件系统、用户态/内核态 | 《现代操作系统》、操作系统MIT 6.S081 |
| **Linux 实战** | 命令行、shell脚本、权限管理、systemd、cron | 《鸟哥的Linux私房菜》、OverTheWire Bandit |
| **计算机网络** | OSI/TCP-IP、HTTP/HTTPS/DNS/TCP握手、Wireshark抓包 | 《计算机网络自顶向下》、《图解TCP/IP》 |
| **编程语言** | **Python**（必精）、**C语言**（懂指针/内存）、JavaScript（看懂） | Python官方教程、《C程序设计语言》 |

### 1.2 安全通识

| 内容 | 要求 |
|------|------|
| OWASP Top 10 概念 | 理解每种漏洞的原理（不要求会利用） |
| CIA 三要素 | 机密性/完整性/可用性 |
| 密码学基础 | 对称加密/非对称加密/哈希/数字签名 |
| 网络攻击链（Kill Chain） | 侦察→武器化→投递→利用→安装→C2→行动 |
| 法律法规 | 《网络安全法》《数据安全法》《个人信息保护法》基本框架 |

---

## 🎯 第二阶段：分方向入门（3-12 个月）

> 选择 1-2 个主方向深入学习，其他方向了解即可。

---

### 方向 A：渗透测试 / 红队

```
3个月破门 → 6个月web打透 → 12个月内网全链路
```

| 阶段 | 内容 | 靶场/资料 |
|------|------|----------|
| Web渗透 | SQL注入/XSS/SSRF/XXE/文件上传/逻辑漏洞/CSRF/RCE | DVWA, Pikachu, PortSwigger Web Academy |
| 信息收集 | 子域名/端口/指纹/目录/WAF识别 | OneForAll, Amass, httpx, nuclei |
| 中间件&框架 | Nginx/Apache/Tomcat/Weblogic/Struts2/Spring | Vulhub, Vulfocus |
| 内网渗透 | 域环境/横向移动/Kerberos攻击/凭据提取 | Vulnstack红日靶场, GOAD |
| 后渗透 | CS/MSF/免杀/权限维持/痕迹清理 | HackTheBox, TryHackMe |

**认证路径**：OSCP → OSCE³ → CRTP → CRTO
**推荐靶场**：HTB Academy → VulnHub → Proving Grounds → CRTP Labs

---

### 方向 B：护网工程 / 蓝队防御

```
3个月基础防御 → 6个月日志分析/EDR → 12个月应急响应/SOC
```

| 阶段 | 内容 | 工具/资料 |
|------|------|----------|
| 主机安全 | OS加固、基线核查、组策略、AppLocker/WDAC | CIS Benchmark, Microsoft Security Baselines |
| 网络防御 | 防火墙策略、IDS/IPS、WAF、蜜罐、流量分析 | Suricata, Snort, Zeek, T-Pot蜜罐 |
| 日志分析 | Windows Event ID、Linux syslog、Web日志、DNS日志 | ELK, Wazuh, Sigma规则 |
| 端点检测 | EDR告警分析、进程链溯源、恶意代码分析 | Sysmon, Velociraptor, oletools |
| 应急响应 | 勒索/钓鱼/Webshell排查、内存取证、磁盘取证 | Volatility, Autopsy, Redline |

**认证路径**：Security+ → GCIH → GCFA → CISSP
**练习方式**：Boss of the SOC (Splunk)、LetsDefend、CyberDefenders

---

### 方向 C：等保测评 / 合规

```
3个月标准熟悉 → 6个月测评上手 → 12个月独立出报告
```

| 阶段 | 内容 |
|------|------|
| 法规标准 | GB/T 22239等保2.0、GB/T 28448测评要求、GB/T 39786密码应用 |
| 测评流程 | 定级→备案→建设整改→测评→监督检查 |
| 测评技术 | 文档审查/访谈/配置核查/漏洞扫描/渗透测试 |
| 整改方案 | 高风险判定、差距分析、整改建议书编写 |

**认证**：CISP、等级保护测评师

---

### 方向 D：CTF 比赛

```
2个月工具熟悉 → 4个月单方向突破 → 8个月组队打比赛
```

| 方向 | 入门题源 | 进阶题源 |
|------|---------|---------|
| **Web** | DVWA, PortSwigger Academy | CTFHub, BUUCTF, XCTF攻防世界 |
| **Pwn** | pwnable.kr, pwn.college | pwnable.tw, how2heap, heap-exploitation |
| **Reverse** | crackmes.one, reversing.kr | Tuts4You, CTF题目复现 |
| **Crypto** | cryptopals, CryptoHack | 各大赛WP复现 |
| **Misc** | CTFHub杂项 | 流量分析/隐写/取证综合 |

**比赛入口**：校内赛 → 省级赛 → XCTF联赛 → DEFCON CTF

---

### 方向 E：漏洞研究 / CVE挖掘

```
3个月基础漏洞复现 → 6个月PoC编写 → 12个月独立挖洞
```

| 内容 | 资料 |
|------|------|
| 漏洞类型 | 缓冲区溢出/UAF/类型混淆/竞态条件/逻辑漏洞 |
| 模糊测试 | AFL++, LibFuzzer, Honggfuzz, syzkaller |
| 代码审计 | PHP/Java/.NET源码审计；Semgrep/CodeQL规则编写 |
| PoC/EXP开发 | Python/C写出完整利用链 |

---

### 方向 F：云安全

```
2个月云基础 → 4个月产品安全 → 8个月云原生安全
```

| 内容 | 工具/资料 |
|------|----------|
| 云厂商安全产品 | 阿里云安全中心、腾讯云安全、AWS Security Hub |
| K8s安全 | Pod安全策略、RBAC、NetworkPolicy、运行时安全(Falco) |
| 容器安全 | Dockerfile安全、镜像扫描、容器逃逸、Docker Bench |
| 云IAM安全 | 角色/策略/权限边界、SCP权限治理 |
| 云安全态势管理(CSPM) | Prowler, ScoutSuite, CloudSploit |

**认证**：AWS Security Specialty、CCSK、CKA+CKS

---

### 方向 G：移动安全

```
3个月移动基础 → 6个月逆向 → 12个月APP合规测试
```

| 内容 | 工具 |
|------|------|
| Android安全 | APK反编译(jadx/apktool)、动态调试(Frida/Xposed)、四大组件漏洞 |
| iOS安全 | IPA逆向、越狱检测绕过、Mach-O文件分析 |
| 小程序安全 | 微信/支付宝小程序逆向、数据包抓取 |
| APP合规 | 权限过度/个人信息收集/SDK安全 |

---

### 方向 H：代码审计

| 内容 | 工具 |
|------|------|
| PHP | RIPS, Seay源代码审计系统 |
| Java | 反序列化/JNDI/表达式注入、IDEA调试追踪 |
| .NET | dnSpy、反序列化/ViewState |
| Python | SSTI/反序列化/Pickle安全 |
| 通用 | Semgrep, CodeQL, SonarQube SAST |

---

### 方向 I：威胁情报

```
2个月基础概念 → 6个月IOC运营 → 12个月APT分析
```

| 内容 | 工具/平台 |
|------|----------|
| IOC采集 | VirusTotal, OTX, MISP, 微步在线 |
| YARA规则 | 编写+检测+社区规则集 |
| MITRE ATT&CK | 战术/技术映射、TTP分析 |
| APT分析 | 攻击链还原、攻击组织画像、TTP提取 |

---

### 方向 J：逆向分析

| 内容 | 工具 |
|------|------|
| x86/x64逆向 | IDA Pro, Ghidra, x64dbg |
| 脱壳 | UPX/ASPack手动脱、VMProtect/Themida分析 |
| 恶意代码分析 | 静态(PE结构)+动态(沙箱Cuckoo/CAPE) |
| 算法还原 | 加密算法/序列号生成算法逆向 |
| Linux ELF | GDB+peda/pwndbg, radare2, angr |

**练习**：crackmes.one, reversing.kr, Tuts4You

---

### 方向 K：安全知识体系

> 这方向适合入门/交叉学习

- TCP/IP协议栈深入：《TCP/IP详解》卷一
- HTTP/HTTPS/TLS 1.3 协议细节
- DNS协议与安全（DNSSEC/DNS-over-HTTPS）
- 密码学深入：AES/RSA/ECC/后量子密码
- 操作系统安全：Windows内核/Linux内核安全机制

---

### 方向 L：数据安全

```
2个月法规学通 → 4个月分级分类 → 8个月DLP+隐私计算
```

| 内容 | 标准/工具 |
|------|----------|
| 法规合规 | 数据安全法、个人信息保护法、数据出境安全评估 |
| 数据分类分级 | GB/T 38667、GB/T 37973、行业分类标准 |
| 数据脱敏 | 静态脱敏/动态脱敏/K-匿名/差分隐私 |
| DLP体系 | 终端DLP/网络DLP/邮件DLP/云DLP |
| 隐私计算 | 联邦学习(FATE)、多方安全计算(隐语)、TEE(SGX/TDX) |

---

### 方向 M：供应链安全

```
2个月基础链 → 4个月SBOM工具 → 8个月CI/CD安全
```

| 内容 | 工具 |
|------|------|
| SBOM标准 | SPDX/CycloneDX、Syft/Trivy生成 |
| 依赖管理 | Dependabot/Renovate、npm audit/pip-audit |
| 代码签名 | Sigstore/Cosign无密钥签名、SLSA框架 |
| CI/CD安全 | GitHub Actions/GitLab CI安全配置 |
| 开源治理 | 许可证合规(ScanCode)、漏洞管理(OSV-Scanner) |

---

### 方向 N：AI/LLM安全

```
2个月AI基础 → 4个月对抗攻防 → 8个月LLM应用安全
```

| 内容 | 工具/资源 |
|------|----------|
| OWASP LLM Top 10 | Prompt注入/数据泄露/模型投毒 |
| Prompt Engineering | 直接注入/间接注入/越狱攻击技术 |
| 对抗样本 | FGSM/PGD/C&W、ART/Foolbox框架 |
| LLM应用安全 | RAG权限控制、输出过滤、NeMo Guardrails |
| AI合规 | EU AI Act、中国生成式AI管理、算法备案 |

---

### 方向 O：零信任/身份安全

```
2个月身份基础 → 4个月MFA/SSO → 8个月ZTNA架构
```

| 内容 | 工具/标准 |
|------|----------|
| IAM | Keycloak/Casdoor部署、OAuth2.0/OIDC/SAML协议 |
| MFA | FIDO2/WebAuthn/Passkey、TOTP、YubiKey集成 |
| PAM | Teleport/堡垒机、JIT最小权限、会话审计 |
| SSO联邦 | CAS/OIDC/SAML单点登录、跨域认证 |
| ZTNA/SASE | NIST SP 800-207、Cloudflare Access/OpenZiti |

---

### 方向 P：工控/IoT安全

```
2个月工控基础 → 4个月协议分析 → 8个月安全测试
```

| 内容 | 工具/标准 |
|------|----------|
| ICS/SCADA | Purdue模型、IEC 62443标准、等保工控扩展 |
| 工控协议 | Modbus TCP/DNP3/OPC-UA/S7comm协议分析 |
| PLC安全 | PLC攻击面、固件分析、梯形图篡改检测 |
| IoT固件 | binwalk/EMBA/FACT固件分析、硬件接口(UART/JTAG) |
| 关基保护 | CII合规、态势感知平台、GB/T 43258整车安全 |

---

### 方向 Q：商用密码/密评

```
2个月密码法 → 4个月国密算法 → 8个月密评实战
```

| 内容 | 标准/工具 |
|------|----------|
| 法规标准 | 《密码法》、商密条例、GB/T 39786 |
| 国密算法 | SM2签名/加密、SM3哈希、SM4对称、GmSSL编程 |
| 国密TLS | TLCP协议(GB/T 38636)、铜锁Nginx部署 |
| 密评实践 | GM/T 0115/0116测评方法、密码应用方案、整改案例 |

---

### 方向 R：安全运营/SOC

```
2个月SIEM基础 → 4个月规则开发 → 8个月SOAR+狩猎
```

| 内容 | 工具 |
|------|------|
| SIEM | ELK/Wazuh/Splunk部署、Sigma规则、范式化 |
| SOAR | Shuffle/TheHive自动化Playbook、MTTD/MTTR度量 |
| 威胁狩猎 | PEAK方法论、Velociraptor、ATT&CK狩猎矩阵 |
| 态势感知 | 资产/漏洞/威胁/事件四维大屏、告警降噪 |
| 运营KPI | 检出率/误报率/自动化率/SLA体系 |

---

### 方向 S：车联网安全

```
2个月车载基础 → 4个月CAN/以太网 → 8个月整车测试
```

| 内容 | 工具/标准 |
|------|----------|
| 车载总线 | CAN/CAN FD、车载以太网、SocketCAN/SavvyCAN |
| 组件安全 | T-Box/IVI/OTA三大件攻防、TARA风险分析 |
| V2X通信 | C-V2X PKI假名证书、IEEE 1609.2 |
| 法规合规 | UN R155 CSMS、UN R156 SUMS、GB/T 43258 |
| 功能安全 | ISO 26262 ASIL等级、ISO 21448 SOTIF |

---

### 方向 T：Web3/区块链安全

```
2个月链基础 → 4个月智能合约 → 8个月DeFi安全
```

| 内容 | 工具/资源 |
|------|----------|
| 区块链安全 | PoW/PoS共识攻击、51%/日蚀/女巫攻击 |
| 智能合约审计 | Solidity漏洞(重入/溢出/AccessControl)、Slither/Mythril/Foundry |
| DeFi攻击 | 闪电贷/预言机操纵/TWAP防御、真实案例复现 |
| 跨链桥 | Wormhole/Ronin/PolyNetwork攻击复盘 |
| MEV | 三明治攻击/抢跑、PBS/Flashbots防御 |

---

### 方向 U：应急响应

```
1个月流程建设 → 3个月工具集 → 6个月独立值班
```

| 内容 | 工具 |
|------|------|
| 入侵排查 | Linux/Windows入侵排查Checklist |
| 勒索处置 | 勒索病毒应急响应SOP |
| Webshell检测 | D盾/河马/WebshellKiller + 手动排查 |
| 取证 | Volatility内存取证/Autopsy磁盘取证/网络取证 |
| 溯源反制 | 攻击路径还原、IOC提取 |

---

### 方向 V：逆向分析（高级）

| 方向 | 进阶内容 |
|------|---------|
| Windows内核 | 驱动逆向、Rootkit分析、ETW/AMSI绕过 |
| Linux内核 | 内核模块分析、eBPF安全 |
| 移动逆向进阶 | Android SO分析/OLLVM反混淆、iOS内核 |
| 固件逆向 | IoT/路由器/摄像头固件逆向 |

---

## 🧗 第三阶段：深度突破（12-24 个月）

- **渗透方向**：代码审计 + 高级内网 + C2开发 + APT复现
- **蓝队方向**：ATT&CK检测覆盖、SIEM/SOAR体系搭建、UEBA分析
- **等保方向**：密评评估师、关基CII评估
- **CTF方向**：加入强队、稳定参赛、输出WP
- **云安全**：K8s源码审计、容器逃逸链研究、云原生检测开发
- **AI安全**：大模型红队测试、对抗样本研究
- **工控安全**：PLC漏洞挖掘、工控协议Fuzz、关基评估师
- **Web3**：EVM底层安全、形式化验证、链上数据分析

---

## 🎓 第四阶段：专家深耕（24 个月+）

- 漏洞研究：CVE编号 + 高质量漏洞报告
- 工具开发：开源安全工具（GitHub 500+ Stars）
- 行业输出：技术博客、会议演讲（KCon/ISC/CIS等）
- 团队建设：组建红蓝队/SOC/安全实验室
- 跨领域融合：AI+安全、车联网+安全、区块链+安全

---

## 📦 全方向工具推荐

| 分类 | 工具 |
|------|------|
| **信息收集** | Nmap, Masscan, OneForAll, Amass, subfinder, FOFA, Shodan |
| **Web渗透** | Burp Suite, sqlmap, nuclei, ffuf, dirsearch |
| **Pwn/调试** | pwntools, GDB+pwndbg, Ghidra, IDA, x64dbg, Frida, angr |
| **密码学** | GmSSL, OpenSSL, SageMath, CyberChef |
| **固件分析** | binwalk, EMBA, FACT, firmware-mod-kit, flashrom |
| **工控** | Wireshark(Modbus/S7comm插件), Boofuzz, ISF |
| **区块链** | Slither, Mythril, Foundry, Echidna, Etherscan API |
| **车联网** | SocketCAN, SavvyCAN, ICSim, Caring Caribou |
| **SOC/蓝队** | ELK, Wazuh, Splunk, Sigma, Velociraptor, TheHive, Shuffle |
| **取证** | Volatility, Autopsy, Redline, Velociraptor |
| **云安全** | trivy, kube-bench, Falco, Prowler, ScoutSuite |
| **AI安全** | ART, Foolbox, Garak, NeMo Guardrails |
| **笔记** | Obsidian, Notion, Typora, 自建知识库 |

---

## 🌐 推荐社区与平台

| 类型 | 资源 |
|------|------|
| **社区** | 先知社区、安全客、Freebuf、嘶吼、T00ls、看雪 |
| **靶场** | HackTheBox, TryHackMe, VulnHub, Vulhub, 攻防世界 |
| **CTF** | CTFTime, XCTF联赛, DEFCON CTF, 强网杯 |
| **SRC** | 补天、漏洞盒子、HackerOne, Bugcrowd |
| **情报** | 微步在线、360Netlab、奇安信威胁情报中心 |
| **认证** | CISP, CISSP, OSCP, OSCE³, AWS Security |

---

## ⚠️ 道德与法律红线

```
✓ 始终在授权范围内测试
✓ 未经授权的入侵/数据访问 = 违法
✓ 漏洞遵循「负责任披露」原则（先通知厂商，确定修复后再公开）
✓ CTF/靶场环境与真实生产严格隔离
✓ 遵守《网络安全法》《数据安全法》《个人信息保护法》《密码法》
✓ 护网期间严格遵守护网规则与保密协议
✗ 绝不能用学到的技术去攻击未授权目标
```

---

> 网络安全是「终身学习」赛道。  
> 技术每半年一变，但底层原理不变。  
> 打好基础，选对方向，坚持 1000 天，你会感谢现在努力的自己。
