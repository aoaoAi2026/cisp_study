# Day 11：入侵检测系统(IDS/IPS)深度实践

> 🎯 面试目标：掌握IDS/IPS部署架构、Snort/Suricata规则编写、告警分析流程和调优方法

## 知识速览

### 核心概念
- **IDS vs IPS vs IDPS**：IDS(旁路检测，只告警不阻断)，IPS(串联在线，实时阻断)，IDPS(兼具检测+防御)。关键权衡：IDS不增加延迟不造成单点故障，IPS可以自动防御但可能误杀业务
- **检测引擎类型**：基于签名(Signature-based——已知攻击模式匹配)、基于异常(Anomaly-based——正常行为基线偏离)、基于协议分析(Protocol-aware——RFC合规性检查)、基于威胁情报(IOC匹配)
- **Suricata vs Snort**：Suricata支持多线程(GPU加速)、高级应用层协议解析(TLS/HTTP/DNS等自动提取元数据)、支持Lua脚本扩展；Snort更轻量、社区规则更成熟。企业多选用Suricata做高性能NIDS
- **告警三要素**：误报(False Positive，FP)——正常流量被标记为攻击、漏报(False Negative，FN)——攻击未被检测、准确告警(True Positive)。IDS调优的核心：降低FP的同时不提高FN
- **威胁狩猎(Threat Hunting)**：不被动等告警，主动基于假设搜索入侵迹象(IOC→IOA行为指标)，常用Sysmon日志+Sigma规则+Splunk/ELK查询

### 必问考点
| 面试官可能怎么问 | 你应该怎么答 |
|------------------|--------------|
| 如何设计一个企业级NIDS部署方案？ | 四层设计：第一层边界IPS(NG防火墙集成IPS)→第二层DMZ IDS(东西向流量检测)→第三层核心交换镜像端口(Suricata集群，全流量分析)→第四层端点HIDS(Osquery/Wazuh)。关键点：不能只靠边界IPS，内网横向移动不会经过边界。面试亮点：提及TAP(Test Access Point)与SPAN(Mirror Port)的区别——TAP是硬件分光更可靠。 |
| 一条Suricata规则的结构？写一条检测PowerShell Empire C2的规则？ | Suricata规则结构：action protocol src_ip src_port → dst_ip dst_port (msg, sid, rev, etc; content/pcre; classtype;)。Empire C2检测规则示例：`alert http $HOME_NET any → $EXTERNAL_NET any (msg:"Empire C2 Activity"; flow:to_server,established; content:"GET"; http_method; content:"/admin/get.php"; http_uri; content:"sessionID="; http_cookie; pcre:"/Cookie: .*sessionID=[A-Za-z0-9+\/=]{20,}/i"; classtype:trojan-activity; sid:1000001; rev:1;)`。 |
| IDS产生大量误报的根本原因和缓解方法？ | 根本原因：1)签名过于宽泛(如检测'select'字符串→匹配正常SQL查询) 2)缺乏业务上下文(不清楚正常业务流量特征) 3)加密流量盲区(TLS加密后内容不可见)。缓解方法：1)阈值调优(如相同告警10次/30秒才报警) 2)规则抑制(对已知误报添加suppress/bypass规则) 3)资产权重(关键资产告警优先级>非关键资产) 4)结合UEBA(用行为基线过滤掉常见模式)。 |
| Suricata如何分析TLS加密流量？有哪些可用信息？ | 虽然TLS加密了Payload，但Suricata可以从Client Hello/Server Hello中提取：SNI(访问的域名)→TLS版本(是否有弱加密套件)→证书信息(主题/颁发者/有效期→检测自签名证书/过期证书)→JA3/JA3S指纹(恶意软件TLS特征)。JA3指纹可以识别恶意软件家族(如TrickBot/Emotet有独特的TLS握手特征)即使流量被加密。 |
| 告警分层处理流程？一个SOC分析师处理一条IDS告警的标准步骤？ | Triage(分诊)三问：1)告警方向性(inbound→可能外部攻击，outbound→可能失陷主机外联C2) 2)资产重要性(是否核心服务器/数据库) 3)告警频率(单次偶发→可能误报，批量爆发→可能真攻击)。深入分析：查PCAP(是否有payload下载)→查主机日志(对应时间段是否有异常进程/网络连接)→查威胁情报(VirusTotal/IP信誉)。结论三类：TP→创建安全事件→启动响应流程；FP→添加抑制规则；可疑→升级给L2/L3分析师。 |

### 技术细节
**Suricata 企业部署架构**：
```yaml
# suricata.yaml 关键配置
af-packet:
  - interface: eth0         # 监听接口
    threads: 4              # CPU亲和力
    cluster-id: 99
    cluster-type: cluster_flow # 按流分配保证同一会话的包到同一线程
    defrag: yes

outputs:
  - eve-log:
      enabled: yes
      filetype: redis        # 送Redis给Logstash消费
      redis:
        server: 127.0.0.1
        port: 6379
        mode: list
        key: suricata
      types:
        - alert
        - http
        - dns
        - tls
```
**规则管理**：定期从ET(Emerging Threats)/ETPRO更新规则（`suricata-update`），自定义规则命名规范：`sid:1XXXXXX`为本地规则，优先级分1(高)-4(低)。

## 常见陷阱
- ⚠️ 只买设备不调优——IDS部署后不花时间做基线调优，告警量大到没人看→形同虚设
- ⚠️ 规则更新滞后——新漏洞(0day/N-day)的检测规则如果不及时同步，IDS对最新攻击0检测能力
- ⚠️ 只靠签名检测——APT攻击常使用0day+定制工具→签名无效，必须结合异常检测和威胁狩猎

## 今日检测
1. 在实验环境部署Suricata，对一段恶意PCAP做重放检测，分析EVE JSON输出
2. 写5条Suricata规则：检测SQL注入、XSS、目录遍历、Webshell上传、DNS隧道
3. 用Splunk/ELK搭建一个基本的IDS告警Dashboard，展示Top10告警类型和趋势图
