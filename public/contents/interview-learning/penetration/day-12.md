# Day 12：内网信息收集与枚举

> 🎯 面试目标：掌握内网侦察技术(网络拓扑/服务发现/AD枚举)、BloodHound分析、凭据收集面试考点

## 知识速览

### 核心概念
- **内网侦察四阶段**：网络发现(存活主机/网段)→端口扫描(服务/版本识别)→目录/AD枚举(用户/组/计算机/信任关系)→敏感数据挖掘(SMB共享文件/SharePoint/邮件)
- **BloodHound分析**：用图论分析AD攻击路径——SharpHound收集器→导入BloodHound→运行预置分析查询(Find Shortest Path to Domain Admins等)→可视化攻击路径
- **LLMNR/NBT-NS投毒**：利用Windows多播名称解析协议的缺陷→Responder工具欺骗广播请求→捕获Net-NTLMv2哈希→离线破解或中继
- **SYSVOL/GPP密码**：域控的SYSVOL共享中Groups.xml可能包含加密的用户名密码，Microsoft发布AES密钥(已公开)→任何人都能解密这些密码
- **SPN枚举**：Service Principal Name扫描→发现域内所有服务账户→识别高权限服务→后续Kerberoasting攻击

### 必问考点
| 面试官可能怎么问 | 你应该怎么答 |
|------------------|--------------|
| 内网信息收集的第一步做什么？怎么判断当前所处的网络环境？ | 三看定位法：一看出网能力(能否访问外网→判断有无HTTP代理/DNS出网)；二看内网IP段(ipconfig/ip route→判断有无多网卡/辅助网段)；三看域环境(systeminfo中的域字段/nltest→判断是否在域中、域控是谁)。拿到这三个信息就基本判断了当前处境和下一步行动策略。 |
| BloodHound中的'Shortest Path to Domain Admins'分析原理？ | BloodHound将AD对象(用户/组/计算机/GPO等)建模为图的节点，将关系(组成员/本地管理员/会话/ACL等)建模为边。'Shortest Path to Domain Admins'是在图中用Dijkstra/BFS算法寻找当前节点(已控用户/计算机)到目标节点(Domain Admins组)的最短路径。最短可能是2-3跳：已控用户→该用户是某计算机的本地管理员→DA在该计算机上有活跃会话→DCSync→域控。 |
| Responder的工作原理和如何检测？ | 原理：Windows在DNS解析失败后→回退到LLMNR(链路本地多播名称解析)→再失败回退到NBT-NS(NetBIOS名称服务)。当目标请求受害主机不存在的名称时→Responder响应'我就是那个主机'→目标发送认证请求→Responder捕获Net-NTLMv2哈希。检测：1)监控LLMNR/NBT-NS流量(这些协议在生产网络本不应大量出现) 2)检测单IP对大量不同名称的响应(正常的LLMNR应答不会响应几十个不同名字) 3)部署NBNSpoofing检测规则。 |
| AD CS(证书服务)有哪些常见攻击面？ | ESC1-8八大攻击路径：ESC1(任意用户可为任意主体申请证书，可指定SAN→冒充域控)→ESC2(证书模板允许Any Purpose EKU)→ESC3(注册代理EKU→代理申请证书)→ESC4(低权限用户可修改证书模板→提升EKU)→ESC8(NTLM中继到AD CS HTTP端点→获取证书)。面试能说出至少ESC1/ESC4/ESC8攻击路径和Certipy工具即可。 |
| 如何发现和利用SYSVOL中的凭据？ | \domaincontroller\SYSVOL\domain\Policies\ 路径下递归搜索Groups.xml/Services.xml/ScheduledTasks.xml→找到cpassword字段(加密后的密码)→Microsoft在MSDN发布了解密用的AES密钥(32字节静态密钥)→用PowerShell函数或在线解密工具解密。面试补充：这虽然是2014年的漏洞(MS14-025)但在很多老旧的域环境中依然有效，体现了'配置管理漏洞'的持久性。 |

### 技术细节
**SharpHound + BloodHound 分析流程**：
```powershell
# 1. 运行收集器
SharpHound.exe -c All -d corp.local --secureldap

# 2. 导入到BloodHound
# 将生成的.zip拖入BloodHound GUI

# 3. 运行预置分析查询
# - Find Shortest Paths to Domain Admins
# - Find Principals with DCSync Rights
# - Find Computers with Unconstrained Delegation
# - Find AS-REP Roastable Users
```
**内网信息收集一体化脚本(PowerView)**：
```powershell
Get-NetDomain                # 当前域信息
Get-NetForest                # 森林信息
Get-NetDomainController      # 域控列表
Get-NetUser -SPN             # 所有服务账户
Get-NetGroup "Domain Admins" # DA组成员
Get-NetComputer -Ping        # 存活计算机
Find-LocalAdminAccess        # 检查本地管理员权限
Get-NetSession -Computer dc  # 谁在DC上有会话
```

## 常见陷阱
- ⚠️ 过度扫描触发告警——高速端口扫描和内网大范围枚举是IDS/EDR的高置信度告警源，应采用低速慢扫或利用WMI等合法通道
- ⚠️ BloodHound数据过期——会话和组成员信息是快照，1小时前的DA登录可能已过期，需刷新收集
- ⚠️ 忽视非域环境——不是所有内网都有域，工作组环境的横向移动依赖本地账号密码重用+WMI/PSEXEC

## 今日检测
1. 搭建一个Windows小型域环境，运行SharpHound+BloodHound分析攻击路径
2. 用Responder在内网中测试一次LLMNR投毒，观察生成的哈希文件
3. 写一个PowerShell脚本做基础内网侦察(IPConfig→当前域→域控→存活主机→开放端口)
