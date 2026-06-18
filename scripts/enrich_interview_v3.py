#!/usr/bin/env python3
"""
面试突击模块内容V3 — 为每个Day生成硬核面试内容。
策略：为每个具体的Day标题写紧凑但实质的知识库 → 生成markdown。
"""

import os

BASE = r'e:\internal_safe\cisp1\cisp\public\contents\interview-learning'

def wrap_md(title, subtitle, qa_blocks, traps, checks):
    """组装完整markdown"""
    lines = [f"# {title}\n", f"> {subtitle}\n", "## 核心知识点\n"]
    
    for qa in qa_blocks:
        lines.append(f"### Q: {qa['q']}\n")
        lines.append(f"{qa['a']}\n")
    
    lines.append("## 面试陷阱\n")
    for t in traps:
        lines.append(f"- {t}\n")
    
    lines.append("\n## 今日检测\n")
    for i, c in enumerate(checks, 1):
        lines.append(f"{i}. {c}\n")
    
    return "".join(lines)

# ===================== 知识库 =====================
# 格式：{ module_plan_day: (title, subtitle, [qas], [traps], [checks]) }
# qas: [{'q':..., 'a':...}, ...]

def basic_day19():
    qas = [
        {'q':'IoT设备有哪些主要攻击面？请按层次梳理',
         'a':'**四层攻击面**：\n\n1. **硬件层**：JTAG/SWD调试口可读取Flash和修改内存；UART串口常输出debug日志含WiFi密码；SPI Flash可用编程器直接dump固件（即使有读保护也可用电压毛刺绕过）\n2. **固件层**：binwalk解包→分析/etc/shadow中的哈希、硬编码API Key、后门账户、未签名的OTA升级包\n3. **通信层**：ZigBee/Z-Wave/BLE配对过程可嗅探→ZigBee默认信任中心Link Key（5A:69:67:42:65:65:41:6C:6C:69:61:6E…ZigBeeAlliance09）全网已知；MQTT未开TLS→用户名密码明文\n4. **云端/APP层**：API认证缺陷（JWT未验证签名→修改payload中userid可越权控制他人设备）；APP逆向→jadx提取硬编码密钥→调用云API\n\n**加分项**：能举例CVE-2020-6007（Philips Hue灯泡通过ZigBee固件漏洞被远程控制→蠕虫传播）、CVE-2019-…系列'},
        {'q':'如何对智能家居设备做安全测试？描述完整流程',
         'a':'**IoT测试五步法**：\n\n1. **信息收集**：FCC ID查射频参数→拆机看芯片型号(SOC datasheet)→识别UART波特率(常见115200/57600)→APP抓包分析API\n2. **固件提取**：官网下载/OTA抓包(拦截update.bin)→`binwalk -Me firmware.bin`解包→分析squashfs-root下的/etc/passwd、启动脚本、www/cgi-bin\n3. **通信分析**：Ubertooth/HackRF抓BLE配对→Wireshark分析GATT→重放攻击测试（特征值写入）\n4. **Web/API测试**：设备Web管理界面→Burp扫描→测试认证绕过/MQTT注入；APP逆向→抓包分析证书固定(Certificate Pinning)\n5. **硬件攻击**：UART连接→尝试uboot中断→进入single mode；JTAG→OpenOCD连接→dump内存'},
        {'q':'MQTT协议在IoT中有哪些安全问题？',
         'a':'MQTT(Message Queuing Telemetry Transport)是IoT最常用消息协议，默认端口1883。安全缺陷：\n\n1. **明文传输**：未开TLS时用户名密码+消息内容全部明文→`tcpdump -i eth0 port 1883`可嗅探。必须强制TLS(8883端口)\n2. **认证薄弱**：clientId可预测(username_001, username_002)导致遍历；允许匿名连接\n3. **Topic权限未隔离**：设备subscribe了`#`通配符可收到所有消息；`device/+/control`被恶意设备利用\n4. **Broker暴露公网**：Mosquitto默认无ACL→Shodan搜`port:1883`可找到大量敞开的MQTT服务\n5. **遗嘱消息滥用**：LWT(Last Will Testament)可被用来植入恶意指令\n\n**防御**：TLS+客户端证书认证、ACL限制Topic、仅内网监听、开启审计日志'},
        {'q':'固件分析中binwalk的关键参数和实战技巧',
         'a':'核心命令：`binwalk -Me firmware.bin`\n- `-e`：自动提取squashfs/jffs2/cramfs等文件系统\n- `-M`：递归扫描提取出的文件\n- `-A`：自动识别CPU架构(ARM/MIPS/x86)\n\n实战流程：解包后在`_firmware.bin.extracted/squashfs-root/`中→`grep -r "password\\|secret\\|key\\|admin" .`→找硬编码凭据；`strings /usr/sbin/* | grep "dropbear\\|ssh\\|telnet"`→找后门服务；`find . -name "*.cgi" -o -name "*.lua"`→分析Web CGI逻辑\n\n面试加分：能提到Firmwalker自动化固件审计脚本→自动提取密码/证书/后门/弱配置等'},
        {'q':'CVE-2020-9054(Zyxel NAS硬编码后门)对IoT安全合规的启示',
         'a':'漏洞本质：Zyxel NAS设备固件中硬编码超级管理员账户`zyfwp:PrOw!aN_fXp`，通过Web管理口即可获取root权限(CVE-2020-9054)。启示：\n1. **CWE-798(硬编码凭据)** 必须进SDLC检查清单——安全需求阶段就应禁止\n2. **SBOM(软件物料清单)** 对于IoT设备合规越来越重要——FDA/US Gov已强制要求医疗IoT设备提供SBOM\n3. **FCC/CE认证** 将逐步纳入网络安全要求(NIST IR 8259系列)\n4. **供应链审计**：设备厂商的固件可能来自ODM，安全责任归属不清晰'},
    ]
    traps = [
        "⚠️ 只谈理论不谈实操——IoT安全面试官通常做过实际项目，能判断你是否真的拆过设备。准备好回答'JTAG的SWDIO一般是GPIO几号引脚'这类实操问题",
        "⚠️ 忽略供应链风险——芯片选型阶段的安全（如某MCU的Secure Boot有已知绕过）也属于IoT安全范畴",
        "⚠️ 把IoT安全等同于Web安全——虽然Web界面是攻击面之一，但固件(UBoot/TrustZone)和硬件(Side-Channel)是IoT独特部分"
    ]
    checks = [
        "用Wireshark安装MQTT插件→分析MQTT CONNECT报文的认证字段",
        "下载TP-Link/D-Link的公开固件→用binwalk解包→找到/etc/passwd和启动脚本中的后门服务",
        "整理一份'IoT安全面试30秒自我介绍'：你做过什么项目/用过什么工具/发现过什么漏洞"
    ]
    return wrap_md("Day 19：物联网安全", "🎯 面试目标：掌握IoT安全面试核心考点——攻击面分析/协议安全/固件安全，能流畅回答IoT相关的技术面试题", qas, traps, checks)

def basic_day20():
    qas = [
        {'q':'工控安全与传统IT安全的本质区别是什么？',
         'a':'**核心差异表**：\n\n| 维度 | IT安全 | OT/工控安全 |\n|------|--------|------------|\n| 优先级 | CIA(机密性>完整性>可用性) | AIC(可用性>完整性>机密性) |\n| 补丁周期 | 月度 | 年度停产检修期，部分系统10年不打补丁 |\n| 生命周期 | 3-5年 | 10-20年 |\n| 主动扫描 | nmap -A通常安全 | 主动扫描可能导致PLC宕机 |\n| 杀软/EDR | 每台服务器可装 | PLC/RTU不能装第三方软件 |\n| 网络延时要求 | ms级可接受 | 微秒级(L1)→ms级(L2) |\n| 认证 | AD域/SSO/MFA | 往往是共享账号/无认证 |\n\n**一句话**：IT安全假设系统可重启、可打补丁、可装Agent；工控安全假设系统不能停、不能改、不能装任何东西。'},
        {'q':'Modbus TCP有哪些安全缺陷？如何在不替换设备的情况下做安全防护？',
         'a':'**Modbus TCP安全缺陷**：无认证（任何IP都可读写寄存器）、无加密（线圈/寄存器值明文）、无完整性校验（可篡改PDU）、无重放保护、功能码08(Diagnostics)可能用于DoS。\n\n**不替换设备的防护方案**：\n1. **网络隔离**：PLC单独VLAN，ACL限制只允许SCADA IP段访问502端口\n2. **DPI工控防火墙**：Tofino/Nozomi→白名单允许读功能码(03/04)，拒绝写(06/16)和诊断(08)\n3. **单向网闸**：Waterfall→物理只允许OT→IT单向数据流，反向不可达\n4. **被动旁路监控**：镜像端口抓Modbus包→分析异常功能码/频率/寄存器操作→SIEM告警\n5. **物理安全**：机柜上锁+操作审计录像，减少物理接触攻击面'},
        {'q':'Stuxnet震网病毒的攻击链给工控安全带来什么启示？',
         'a':'Stuxnet(2010年)针对伊朗Natanz核设施的精密工控攻击，启示深刻：\n\n1. **气隙不等于安全**：病毒通过USB摆渡突破物理隔离→工控内网不能只靠网络隔离\n2. **供应链是OT最大威胁**：通过Siemens Step7工程软件传播→工控软件供应链安全(SBOM/签名)至关重要\n3. **PLC固件级篡改**：修改S7-315 PLC的OB1代码块→HMI上显示正常波形但实际控制离心机超速→**HMI不可信**\n4. **数字签名盗窃**：使用窃取的合法签名(Realtek和JMicron)→数字签名不是银弹\n5. **多层次攻击**：4个0day(MS10-046/MS10-061/MS08-067/打印机后台) + Rootkit + PLC逻辑炸弹→工控APT深远\n\n**面试金句**：你打了所有Windows补丁，但PLC固件可能已经被篡改了——OT安全监控必须覆盖到L1层'},
        {'q':'等保2.0工控扩展要求有哪些关键点？',
         'a':'等保2.0(GB/T 22239-2019)新增的工业控制系统安全扩展要求：\n\n- **室外控制设备防护**：防雷/防水/防尘/温湿度/防电磁干扰→物理安全\n- **网络隔离**：IT与OT在边界部署访问控制设备，不允许多网卡跨网直连\n- **无线控制**：工控现场无线设备需MAC白名单，非授权无线热点(员工手机热点)检测告警\n- **拨号/远程维护**：Modem必须有回拨认证和操作审计→远程维护需审批+全程录屏\n- **安全审计**：PLC停机/重启/程序下载必须有日志记录(但PLC本身日志能力有限→需外挂日志网关)\n- **补偿控制**：不能打补丁的设备→提供补偿方案(增强监控/物理隔离/访问控制收紧)'},
        {'q':'你如何看待IT-OT融合趋势下的安全挑战？',
         'a':'IT-OT融合是工业4.0的必然趋势，但带来三大挑战：\n\n1. **攻击面扩大**：OT接入IT→更多远程攻击入口；IIoT设备(传感器/智能网关)安全能力弱→成为跳板\n2. **人员断层**：IT团队不懂OT协议和流程(停机=事故)，OT团队不懂网络安全→需要培养"OT安全工程师"这一角色\n3. **责任模糊**：OT出安全事故属于生产部门还是安全部门？技术层面打补丁可能由IT安全定方案，但执行窗口由生产部门定\n\n**我的观点**：未来3-5年OT安全工程师是稀缺岗位。关键在于"在理解OT限制的前提下应用IT安全的思维"——不是照搬IT方案到OT'},
    ]
    traps = [
        "⚠️ 用nmap扫描OT网络——面试官问'你怎么做资产发现'，答nmap -A是致命的。正确：用被动流量分析(GRASSMARLIN)或看EPC移交的网络拓扑图",
        "⚠️ 说'工业防火墙可以解决所有问题'——OT老工程师会反问：你敢在运行了15年的PLC前面串防火墙？万一防火墙宕机整条产线就停了",
        "⚠️ 不懂DCS和SCADA的区别—— DCS用于过程控制(炼化/化工→连续+闭环控制)，SCADA用于数据采集(电力/水务→广域+监控)"
    ]
    checks = [
        "用Wireshark抓取Modbus TCP报文(功能码03/06)，手动解析PDU结构(TID/PID/Length/UID/FuncCode/Data)",
        "安装Conpot工控蜜罐：`docker run -p 102:102 honeynet/conpot`→用nmap扫描查看指纹",
        "阅读NIST SP 800-82r3工控安全指南→提炼3个面试可引用的论点"
    ]
    return wrap_md("Day 20：工控系统安全", "🎯 面试目标：掌握工控安全面试核心——ICS/SCADA架构/Modbus协议安全/等保2.0工控扩展", qas, traps, checks)

def basic_day21():
    qas = [
        {'q':'解释云安全中的"共享责任模型"，并举例说明可能的责任不清漏洞',
         'a':'共享责任模型(Shared Responsibility Model)核心：云厂商负责"云的安全"(Security OF the Cloud)，用户负责"云中的安全"(Security IN the Cloud)。\n\n**典型责任不清漏洞**：\n1. **S3桶公开(最经典)**：用户以为S3默认私有→但Block Public Access不是默认开启→Capital One 2019年1亿用户数据泄露的根因\n2. **RDS快照公开共享**：设置为public→任何人可用你的快照启动DB实例\n3. **安全组0.0.0.0/0开放22/3389**：暴力破解和0day漏洞不关心你有密钥\n4. **IAM密钥泄露**：代码仓库意外commit了AccessKey→被扫描机器人抓取→创建EC2挖矿\n\n**面试金句**：云厂商永远不会替你管好IAM和S3权限，用ScoutSuite/Prowler检查你"应做但没做"的配置'},
        {'q':'Docker/K8s容器安全有哪些面试必问点？',
         'a':'**Docker安全**：①不以root运行→`USER 1000` ②只读根文件系统→`--read-only` ③限制Capabilities→`--cap-drop=ALL --cap-add=NET_BIND_SERVICE` ④镜像扫描→Trivy/Clair找CVE ⑤资源限制→`--memory=512m --cpus=1`\n\n**K8s安全(CIS Benchmark关键点)**：①RBAC最小权限→不允许cluster-admin绑定default SA ②Pod Security Standards→禁止privileged/hostNetwork ③NetworkPolicy→入站白名单 ④Secret etcd加密→不用base64当加密 ⑤准入控制→OPA/Gatekeeper拒绝不安全配置\n\n**面试亮点**：提到`kube-bench`/`kube-hunter`/`Falco`这些工具说明你做过K8s安全实践'},
        {'q':'什么是云原生攻击链？攻击者如何从公网打到内网？',
         'a':'**云原生攻击链7步**：\n1. 初始访问：Web SSRF→169.254.169.254/IMDSv1获取IAM临时凭证\n2. 信息收集：`aws sts get-caller-identity`确认权限→`aws ec2 describe-instances`枚举资源\n3. 权限提升：IAM Role链Assume→Lambda函数中有Admin权限被利用\n4. 横向移动：SSRF入侵VPC内EKS的kubelet→拿到kubeconfig控制Pod\n5. 凭据访问：Lambda环境变量/env→ECS Task Definition→Secrets Manager\n6. 数据收集：S3批量下载→RDS dump→DynamoDB scan\n7. 持久化：创建新IAM用户→跨账号信任→Lambda定时触发器反弹shell\n\n**面试加分**：Capital One SSRF通过IMDS获取S3的IAM Role→强调IMDSv2强制PUT获取Token是核心防御'},
        {'q':'云架构中的"纵深防御"如何实现？给一个三层示例',
         'a':'**三层纵深防御(Web上云为例)**：\n\n**L1-边缘**：CloudFront+WAF→过滤SQL注入/XSS/DDoS→ALB TLS终结→仅443入站\n**L2-网络**：ALB在Public Subnet→Web/App在Private Subnet→DB在最内层→出站只放3306→DB无公网IP\n**L3-身份与数据**：Web容器用指定Role读S3→数据库密码从Secrets Manager获取(自动轮换)→CloudTrail记录API→GuardDuty异常检测→自动隔离被入侵EC2\n\n**加分项**：HashiCorp Vault管理动态DB凭据(租约到期回收)+ Lambda自动响应GuardDuty'},
        {'q':'什么是IMDS(实例元数据服务)？IMDSv1和IMDSv2的区别？',
         'a':'IMDS(169.254.169.254)是AWS实例获取临时凭证和配置的内部端点，仅限实例内部访问。\n\n**IMDSv1**：只需GET请求就能拿到IAM Role临时凭证→SSRF可直接利用\n**IMDSv2**：先PUT获取Token(需X-aws-ec2-metadata-token-ttl-seconds头)→再GET带Token→SSRF攻击者通常只能发GET(不能带自定义Header)\n\n**面试必知**：2024年起AWS新账号默认强制IMDSv2，但老账号可能还是v1。`MetadataNoToken` CloudWatch指标可监控仍有v1请求的实例'}
    ]
    traps = [
        "⚠️ S3公开桶的四种'公开'混淆——Block Public Access(桶级)/Bucket Policy(策略级)/ACL(对象级)/Object URL(直接访问)→面试官可能每种都问",
        "⚠️ Security Group和NACL的区别——SG有状态+实例级，NACL无状态+子网级→搞混暴露基础不牢",
        "⚠️ 把KMS「密钥管理」和「加密」混为一谈——KMS不存数据，只做密钥管理和加解密API调用"
    ]
    checks = [
        "用AWS CLI `aws sts get-caller-identity`确认当前身份→`aws s3 ls`列桶→用ScoutSuite扫描你的AWS测试账号",
        "手动发送IMDSv1和IMDSv2请求：`curl http://169.254.169.254/latest/meta-data/iam/security-credentials/` →对比差异",
        "用Trivy扫描Docker镜像：`trivy image nginx:latest`"
    ]
    return wrap_md("Day 21：云计算基础与安全", "🎯 面试目标：掌握云安全面试高频题——共享责任模型/IAM/容器安全/云原生攻击面", qas, traps, checks)

def basic_day22():
    qas = [
        {'q':'Hadoop集群的安全架构如何设计？Kerberos+Ranger的协作流程',
         'a':'**Hadoop安全架构三层**：\n\n1. **网络层**：集群节点放私有VLAN→只有Gateway/Edge Node双网卡→Kerberos仅对外暴露\n2. **认证层(Kerberos)**：用户kinit→获取TGT→访问HDFS时用TGT换Service Ticket→NameNode验证→放行。Keytab文件必须400权限\n3. **授权层(Ranger)**：Ranger Admin创建Service和Policy→Plugin拉取Policy到本地缓存(低延迟)→支持基于Tag的动态授权(先打标签PII→再按标签授权)\n\n**外部用户接入(KNOX)**：Knox Gateway→LDAP/Kerberos认证→转发→Ranger二次授权'},
        {'q':'请解释"差分隐私"的原理，并给出一个实际应用场景',
         'a':'差分隐私(Differential Privacy)核心：对数据库查询结果添加可控的随机噪声(拉普拉斯/高斯分布)，确保任何外部观察者无法判断特定个体的数据是否在数据集中。\n\n**数学本质(ε-差分隐私)**：Pr[M(D1)∈S] ≤ e^ε × Pr[M(D2)∈S]。ε越小隐私越强。\n\n**实际场景——医疗统计**：统计某疾病平均住院天数，不加噪=15.3天(可能推断张三是否在数据集中)→加噪声后返回15.3±随机扰动→攻击者无法区分"15天"和"16天"\n\n**面试亮点**：Apple从iOS10起用差分隐私收集键盘预测/Emoji建议/健康数据→不上传原始数据，上传加噪后的统计摘要'},
        {'q':'Kafka在安全场景中的作用和自身安全配置',
         'a':'Kafka在安全领域广泛用于SIEM日志管道+威胁检测实时流处理。\n\n**Kafka自身安全配置**：\n- 认证：推荐mTLS双向证书→SASL/SCRAM→SASL/PLAIN(不安全)\n- 授权：ACL控制→`kafka-acls --add --allow-principal User:app --operation Read --topic security-events`\n- 加密：TLS加密(security.protocol=SSL)+磁盘加密\n- 网络：仅内网监听(listeners=INTERNAL://host:9092)→外部通过REST Proxy\n\n**安全场景实战**：Kafka←Logstash推送原始日志→Flink实时关联分析(5分钟内同IP多次登录失败)→存入ES→Kibana展示'},
        {'q':'大数据平台如何做到"可用不可见"的数据共享？',
         'a':'四种方案：\n\n1. **联邦学习(Federated Learning)**：原始数据不出本地→各方在本地训练→仅上传梯度→中央聚合。Google Gboard用此训练键盘预测\n2. **安全多方计算(SMPC)**：多方各自私有输入→加密协议(混淆电路/秘密共享)协同计算→结果可见但中间输入不可见\n3. **可信执行环境(TEE)**：Intel SGX/AMD SEV→CPU内加密Enclave→数据仅在Enclave内解密。蚂蚁Occlum/Google Asylo\n4. **数据沙箱(Clean Room)**：甲方提供脱敏数据→乙方在沙箱分析→结果审核后才能带出。Databricks/AWS Clean Rooms'},
        {'q':'传统数据库审计和大数据审计有何不同？',
         'a':'传统审计(Database Audit)是表级别：`AUDIT SELECT ON hr.employees BY ACCESS`。大数据审计需覆盖HDFS文件级+表级+列级+行级。\n\nRanger审计插件能记录到具体用户/时间/IP/访问的HDFS路径/Hive列。更重要是需结合Atlas/Apache Griffin做数据血缘追踪——敏感字段从哪里来→经过哪些ETL转换→被谁访问。这是大数据审计区别于传统审计的关键维度'}
    ]
    traps = [
        "⚠️ Kerberos跨域信任配置容易被攻击——Hadoop的`[domain_realm]`配置错误可能导致域间信任被滥用",
        "⚠️ Kafka offset存储本身无认证——如果ZooKeeper无ACL，可读取consumer group消费进度推断业务信息",
        "⚠️ Hive的UDF可执行任意代码——Java UDF可调用Runtime.exec()，必须有沙箱机制"
    ]
    checks = [
        "搭建本地Hadoop单节点→配置Kerberos认证→用kinit+klist验证",
        "用Apache Ranger创建一条Policy：限制某用户只读HDFS `/user/hr/salary`",
        "阅读《数据安全法》中数据处理者义务条款→提炼3个面试论据"
    ]
    return wrap_md("Day 22：大数据安全", "🎯 面试目标：掌握大数据安全面试核心——Kerberos/Ranger权限管理/数据脱敏/差分隐私/数据湖治理", qas, traps, checks)

def basic_day23():
    qas = [
        {'q':'什么是对抗样本(Adversarial Example)？解释FGSM攻击原理',
         'a':'对抗样本是在原始样本上叠加精心构造的微小扰动→人眼不可分辨→但模型输出完全错误的结果。\n\n**FGSM攻击**：x_adv = x + ε × sign(∇_x J(θ, x, y))。沿损失梯度的方向加ε扰动→最大化损失。单步攻击，速度快但成功率相对较低。\n\n**PGD(Projected Gradient Descent)**是FGSM的多步迭代版→k步迭代，每步后投影回ε-ball→攻击更强，是当前白盒攻击的Baseline。\n\n**防御**：对抗训练→将对抗样本加入训练集→模型学会抵抗此类扰动'},
        {'q':'LLM的Prompt Injection如何防范？',
         'a':'分层防御：\n\n1. **输入层**：特殊token分隔系统Prompt和用户输入→检测用户输入中是否含类似分隔符\n2. **过滤层**：关键词(ignore/forget/system/previously)+语义检测(用另一个模型判断是否含指令注入意图)\n3. **结构层**：Post-prompting→系统指令放用户输入之后→用户越狱指令覆盖安全限制\n4. **验证层**：输出前用分类器检查LLM输出是否违反安全策略→拦截重试\n\n**关键诚实**：目前没有100%可靠的防御。OpenAI/Anthropic/Google持续投入安全对齐，但攻击者的绕过速度和方式始终领先。面试时诚实讨论反而加分'},
        {'q':'联邦学习中的安全威胁有哪些？',
         'a':'1. **梯度泄露**：通过Deep Leakage from Gradients(DLG)从梯度恢复原始数据→差分隐私加噪缓解\n2. **投毒攻击**：恶意参与者上传被篡改模型更新(放大某label梯度10倍)→聚合后全局模型偏向恶意方向→Krum/Trimmed Mean鲁棒聚合防御\n3. **推理攻击(Membership Inference)**：通过多次查询推断某数据是否在训练集→差分隐私缓解\n4. **拜占庭故障**：假设f个恶意参与者→Krum选择梯度方向与多数人一致者聚合'},
        {'q':'一个安全工程师如何评估某家公司是否已为AI安全做好准备？',
         'a':'**AI安全成熟度5维度**：\n\n1. **数据治理**：训练数据来源可信任？投毒检测机制？数据溯源和回滚能力？\n2. **模型安全**：完整性校验(Hash+签名)？对抗鲁棒性测试？\n3. **推理安全**：API Rate Limiting防模型窃取？Prompt Injection过滤？输出内容审核？\n4. **供应链**：预训练模型来源(HuggingFace/GitHub)？模型文件签名验证？Python依赖CVE扫描？\n5. **组织与流程**：AI安全责任人？模型红队测试？定期安全培训？\n\n**面试点睛**：引述OWASP Top 10 for LLM作为业界标准化框架'},
        {'q':'AI对齐(Alignment)和AI安全(Safety)的区别？',
         'a':'AI对齐是指让AI系统的目标与人类价值观保持一致(它**自己**想做什么)。AI安全是防止AI被恶意攻击或产生意外危害(**别人**对它做什么以及它偶然做什么)。举例：做一个不骂人的LLM是Alignment问题；防止别人通过Prompt注入让它骂人是Safety问题。面试中能分清两者说明知识体系比较系统'}
    ]
    traps = [
        "⚠️ 说对抗样本攻击很容易防御——学术圈做了十年，防御一个被破一个，目前没有通用方案",
        "⚠️ 把Model Inversion和Membership Inference搞混——前者是恢复训练数据特征，后者只是判断某数据是否在训练集中",
        "⚠️ 认为加了RLHF的LLM就彻底安全——RLHF只是提高了攻击成本门槛，训练新向量做越狱依然存在"
    ]
    checks = [
        "安装CleverHans/ART库→对ResNet18生成FGSM对抗样本→观察模型分类变化",
        "尝试用DAN角色扮演Prompt对ChatGPT做越狱(理解攻击原理而非实际破坏)",
        "阅读OWASP Top 10 for LLM清单→记录每条处理建议"
    ]
    return wrap_md("Day 23：人工智能安全", "🎯 面试目标：掌握AI安全面试核心——对抗样本/模型后门/数据投毒/Prompt注入/联邦学习安全", qas, traps, checks)

def basic_day24():
    qas = [
        {'q':'检测到一台服务器被Ransomware加密了，你的应急响应步骤是什么？',
         'a':'**按PDCERF拆解——黄金7分钟动作**：\n\n**0分钟(确认)**：确认文件扩展名/勒索信/CPU IO冲高是否真的被加密\n**1分钟(遏制-隔离)**：不关机！先拔网线或防火墙限制出站→停止横向扩散到NAS/共享存储\n**2分钟(取证)**：`ps aux; netstat -antp`截图→`tcpdump -i eth0 -w capture.pcap`抓C2通信→EDR导出进程树\n**3分钟(确认入口)**：最近被登录账号？VPN异常登录？RDP爆破(Event ID 4625)？钓鱼邮件附件？\n**5分钟(通知)**：安全负责人+受影响业务方+合规部门\n**1小时(根除)**：查NoMoreRansom是否有解密工具→无则准备从备份恢复\n**事后(复盘)**：三问：怎么进来的(Root Cause)/为什么没拦住(Detection Gap)/下次怎么避免(Remediation)'},
        {'q':'如何排查Linux服务器是否被植入Rootkit？',
         'a':'多维度交叉验证(不能只信一个工具)：\n\n1. **进程**：`ps aux` vs `/proc/`目录对比→ps看不到但/proc下有→被hook隐藏。`pstree -p`找名字奇怪的进程\n2. **网络**：`ss -tlnp` vs `cat /proc/net/tcp`对比→ss被篡改的证据。外部nmap扫描vs内部netstat对比\n3. **文件完整性**：`rpm -Va`(CentOS)/`dpkg --verify`(Debian)→验证包安装文件的完整性\n4. **内核模块**：`lsmod` vs `/proc/modules`对比→隐藏的内核模块\n5. **专用工具**：chkrootkit/rkhunter→怀疑高级rootkit→内存镜像+Volatility分析\n\n**关键原则**：用已知干净的静态编译BusyBox替换系统的ls/ps/netstat等命令再做排查'},
        {'q':'Windows应急响应中，你最常关注的10个Event ID和理由',
         'a':'| Event ID | 含义 | 关注理由 |\n|----------|------|----------|\n| 4624 | 登录成功 | Logon Type 3(网络)/10(远程)是重点 |\n| 4625 | 登录失败 | 短时间大量出现=暴力破解 |\n| 4672 | 特权分配 | 管理员权限分配→Token窃取或UAC绕过 |\n| 4688 | 进程创建 | cmd/powershell→异常父子进程关系 |\n| 4697 | 服务安装 | sc/psexec安装后门服务 |\n| 5140 | 网络共享访问 | IPC$/C$访问→横向移动信号 |\n| 5156 | WFP网络连接允许 | 非标准端口出站→C2心跳 |\n| 1102 | 审计日志清除 | 攻击者掩盖痕迹 |\n| 4104 | PowerShell脚本块 | 记录完整PS脚本→即使用-enc也能解码 |\n\n**加分**：Sysmon的Event ID 1(进程+命令行)/3(网络连接)/7(DLL加载)/11(文件创建)→比Windows自带日志更详细'},
        {'q':'应急响应中如何进行内存取证？',
         'a':'**黄金法则**：优先获取内存→再磁盘→最后才关机。内存是一切活动的实时快照！\n\n**采集**：Windows→DumpIt/WinPmem/FTK Imager。Linux→LiME。macOS→osxpmem\n\n**Volatility3分析**：\n1. `vol -f mem.dump windows.info`→OS版本\n2. `vol -f mem.dump windows.pslist/pstree`→进程树，找异常父子进程\n3. `vol -f mem.dump windows.netscan`→网络连接→C2通信\n4. `vol -f mem.dump windows.cmdline`→进程命令行→攻击者执行了什么\n5. `vol -f mem.dump windows.malfind`→Malfind注入检测\n6. `vol -f mem.dump windows.dlllist --pid <PID>`→DLL加载列表→找未签名/路径怪异的\n7. `vol -f mem.dump windows.memmap --pid <PID> --dump`→dump进程空间做逆向'},
        {'q':'如何判断一起安全事件应该上报给监管机构？',
         'a':'依据《网络安全法》和《数据安全法》：\n\n①是否涉及个人信息泄露→达到一定数量需24-72小时内上报网信办\n②是否涉及关键信息基础设施(CII)遭到破坏或功能丧失→需通报主管部门\n③是否可能导致国家安全和社会公共利益受到危害\n\n**内部判断标准**：受影响系统范围(核心还是非核心)/涉及数据类型和量级(个人信息量级)/攻击者能力和动机(APT/经济动机/破坏)/是否已公开或已被媒体关注。建议：有疑问时先通知法务/合规部门评估'}
    ]
    traps = [
        "⚠️ '先把服务器关机'——最经典的面试错误回答。关机=内存丢失=无法追踪攻击来源。先取证再关机！",
        "⚠️ 说'我们有备份不用担心'——Ransomware攻击者通常先潜伏几周再加密→策略之一就是先破坏备份。问清楚如何验证备份完整性和离线可恢复性",
        "⚠️ 只关注技术排查忽略沟通——应急响应中「向上通报的时机」「对外沟通策略」也是重要扣分点"
    ]
    checks = [
        "安装Volatility3→下载公开恶意软件内存镜像→做一次完整分析练习",
        "在测试Windows上开启Sysmon+Winlogbeat→模拟攻击→用Event ID追踪全过程",
        "写一份勒索软件应急响应「口袋卡片」(10条以内checklist)"
    ]
    return wrap_md("Day 24：应急响应完整流程", "🎯 面试目标：掌握应急响应面试全部考点——PDCERF六阶段/入侵排查命令/内存取证/勒索响应", qas, traps, checks)

# ========================= 主程序 =========================

def main():
    """处理所有仍为模板的文件"""
    files_to_fix = {
        # BASIC
        ('basic', 'day-19.md'): basic_day19,
        ('basic', 'day-20.md'): basic_day20,
        ('basic', 'day-21.md'): basic_day21,
        ('basic', 'day-22.md'): basic_day22,
        ('basic', 'day-23.md'): basic_day23,
        ('basic', 'day-24.md'): basic_day24,
    }
    
    fixed = 0
    for (module, filename), generator in files_to_fix.items():
        fp = os.path.join(BASE, module, filename)
        if not os.path.exists(fp):
            print(f"SKIP (not found): {module}/{filename}")
            continue
        
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if still template
        if not ('概念一：' in content and '的定义与范围' in content) and not ('请简单介绍一下' in content):
            print(f"SKIP (already enriched): {module}/{filename}")
            continue
        
        new_content = generator()
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        fixed += 1
        print(f"FIXED: {module}/{filename} ({len(new_content)} chars)")
    
    print(f"\nFixed: {fixed} files")

if __name__ == '__main__':
    main()
