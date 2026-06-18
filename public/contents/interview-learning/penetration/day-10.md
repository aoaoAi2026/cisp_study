# Day 10：密码攻击与哈希破解

> 🎯 面试目标：掌握哈希原理、常见破解方法(字典/彩虹表/暴力)、Pass-the-Hash技术和防御措施

## 知识速览

### 核心概念
- **哈希函数安全属性**：单向性(不可逆)、抗碰撞性(找不到两个不同输入产生相同哈希)、雪崩效应(微小输入变化导致输出剧烈变化)。MD5/SHA1已碰撞破解，工业标准为SHA-256/512
- **Windows NTLM哈希**：LM Hash(已废弃，分两段7字符大写DES加密，极弱)→NTLM Hash(MD4 of Unicode password，无盐值)→Net-NTLMv2(挑战-响应认证，含Nonce防重放)
- **Pass-the-Hash(PtH)原理**：无需破解明文密码，直接用NTLM Hash通过NTLM认证访问远程服务。Windows不验证你是否知道密码，只验证哈希是否正确
- **Kerberoasting**：请求域内任何SPN(服务主体名称)的TGS票据，TGS票据用服务账户的NTLM哈希加密→导出后对TGS票据做离线破解→获取服务账户明文密码
- **密码破解效率排序**：在线破解<离线字典<离线规则字典<彩虹表<暴力破解(GPU加速)，Hashcat在RTX 4090上可达300GH/s(NTLM)

### 必问考点
| 面试官可能怎么问 | 你应该怎么答 |
|------------------|--------------|
| 常见哈希算法(如MD5/SHA1/SHA256/bcrypt)在安全场景中怎么选？ | MD5/SHA1：已破解，仅用于非安全场景(如数据去重)。SHA256：快速哈希，适合文件完整性校验/数字签名，但不适合存密码(太快→暴力破解成本低)。bcrypt/scrypt/Argon2：'慢哈希'——故意消耗大量CPU/内存增加破解成本，是密码存储的唯一正确选择。面试话术：'存密码我用bcrypt(cost=12)，验证文件我用SHA-256。' |
| Pass-the-Hash攻击的完整流程和防御？ | 攻击流程：1)获得目标主机SYSTEM权限(Mimikatz sekurlsa::logonpasswords提取哈希) 2)使用提取的NTLM Hash通过psexec/wmiexec横向移动(不需要明文密码) 3)重复提单→横向的过程直到域控。关键防御：1)Credential Guard(虚拟化隔离LSASS) 2)Protected Users组(禁止NTLM认证、禁止缓存明文凭据) 3)LAPS(本地管理员密码随机化) 4)网络分段+特权访问工作站(PAW)。 |
| Kerberoasting如何检测和防御？ | 检测：监控Event ID 4769(请求TGS票据)，过滤加密类型为0x17(RC4-HMAC)的请求→Alert。高频Kerberoasting的TGS请求会在短时间内有大量不同SPN的4769事件。防御：1)服务账户使用长且复杂的密码(>25字符随机) 2)使用Group Managed Service Accounts(gMSA，自动轮换密码) 3)将高权限服务账户加入Protected Users组 4)AES加密替代RC4。 |
| 什么是Overpass-the-Hash？和PtH有什么区别？ | Overpass-the-Hash：用NTLM Hash请求Kerberos TGT票据→拿到TGT后可以请求任何服务的TGS票据，本质是'用NTLM Hash换取Kerberos票据'。和PtH区别：PtH走NTLM认证协议，Overpass走Kerberos协议。影响：防御了NTLM(PtH)但没防御Kerberos(Overpass)，所以两者都要防御。Mimikatz命令：sekurlsa::pth /user:admin /domain:corp.local /ntlm:<hash>自动尝试获取TGT。 |
| 有什么工具可以自动化密码审计和哈希破解？怎么在红队中使用？ | 自动化审计：1)Responder(LLMNR/NBT-NS/mDNS欺骗捕获Net-NTLMv2哈希) 2)ntlmrelayx(中继Net-NTLMv2认证到其他服务) 3)CrackMapExec(批量密码喷洒+PtH横向)。破解工具链：Hashcat(最快GPU破解)+ hashcat-utils(规则生成)+ statsprocessor(马尔可夫攻击)。组合使用：Responder抓到hash→提取→Hashcat规则破解→CrackMapExec用破解的密码批量验证。 |

### 技术细节
**Mimikatz 经典命令及含义**：
```powershell
# 提权到SYSTEM
privilege::debug
token::elevate

# 导出所有登录凭据
sekurlsa::logonpasswords          # NTLM Hash + 明文密码(如果WDigest启用)

# 从LSASS进程转储
sekurlsa::minidump lsass.dmp      # 离线分析
sekurlsa::logonpasswords

# 导出Kerberos票据
sekurlsa::tickets /export          # .kirbi票据文件
kerberos::ptt ticket.kirbi         # 导入票据(Pass-the-Ticket)

# DCSync(模拟域控从其他DC同步密码哈希)
lsadump::dcsync /user:krbtgt
```
**Hashcat 破解速度参考(RTX 4090)**：NTLM ~300 GH/s, SHA256 ~8 GH/s, WPA2 ~2 MH/s, bcrypt ~100 kH/s。慢哈希(bcrypt/Argon2)即使GPU也极慢，这就是为什么必须用慢哈希存储密码。

## 常见陷阱
- ⚠️ 在生产域控上运行Mimikatz——会被EDR/AV立即检测并触发事件，应该先在实验环境练手
- ⚠️ 混淆LM/NTLM/Net-NTLM——三者用途不同：LM/NTLM是存储格式，Net-NTLM是认证协议中传输的挑战-响应值
- ⚠️ 以为用SHA256存密码就安全——SHA256是快哈希，RTX 4090每秒80亿次，8位密码<1秒破解

## 今日检测
1. 搭建一个Windows域实验环境，用Mimikatz完整走一遍PtH→DCSync流程
2. 用Hashcat对一份NTLM Hash样本做字典+规则+掩码破解，记录时间和成功率
3. 写一个Python脚本检测EventID 4769中0x17加密类型的异常频率
