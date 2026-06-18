# Day 5：DNS安全深层分析
> [DNS安全面试核心] DNS协议安全/DNS隧道/DNSSEC/DNS劫持/域名安全
## 核心知识点
### Q: DNS隧道(DNS Tunneling)的原理、利用和检测
原理：将TCP/UDP数据编码在DNS查询/响应中。客户端编码数据→发起DNS TXT/MX/CNAME查询→DNS隧道服务器(权威DNS)解码数据→上网代理→返回响应编码为DNS响应。工具：iodine/dnscat2。

为什么有效：DNS通常不被防火墙严格检查(很多企业出口放行UDP 53端口)。数据隐藏在合法的DNS流量中

检测方法：①DNS查询频率异常(正常用户不会每秒发几十次DNS查询) ②查询域名长度异常(正常域名短，隧道域名长)→统计FQDN平均长度>50字符 ③查询类型异常(正常多为A/AAAA，隧道多TXT/MX/CNAME) ④DNS熵值分析→隧道用base32/hex编码→字符分布均匀(高熵)
### Q: DNSSEC解决了什么问题？为什么推广这么慢？
DNSSEC通过数字签名确保DNS响应的完整性和真实性——防止DNS缓存投毒。工作方式：DNS记录用区域私钥签名→递归DNS用DS记录中的公钥验证。信任链从根域(.root)向下逐级签名。

推广慢的原因：①配置复杂——密钥管理(KSK/ZSK)、签名过期自动轮换 ②放大攻击——DNSSEC响应包远大于请求(ANY查询可放大50x)→被利用做DDoS ③不完全加密——DNSSEC只签名不加密→DNS查询内容仍明文可见(DoH/DoT解决加密) ④域名注册商支持不足
### Q: DNS劫持的多种形式和防御
形式：①本地Hosts文件劫持(恶意软件修改) ②路由器DNS劫持(篡改DHCP下发的DNS) ③DNS缓存投毒(Kaminsky攻击—伪造DNS响应塞入递归DNS缓存) ④注册商/域名劫持(社工/漏洞窃取域名管理权) ⑤BGP劫持(劫持IP前缀→DNS服务器运维团队的告配置错误)

防御：DNSSEC防止缓存投毒、DoH/DoT防止本地网络劫持、域名注册商开启WHOIS隐私+域名锁(Transfer Lock)+双因素认证、监控DNS记录变更(用DNSTwist等发现伪造)
### Q: DoH(DNS over HTTPS)和DoT(DNS over TLS)的对比和安全影响
DoH：DNS查询伪装成HTTPS→端口443→和Web流量完全混合→防火墙无法区分DNS和Web。隐私好(运营商看不见DNS请求)但安全运维变难(内部DNS监控失效)
DoT：DNS查询走TLS→专用端口853→企业可针对性监控/过滤。隐私弱于DoH(端口分流可见)但安全运维更可控

安全影响：企业正面临安全与隐私的权衡——DoH让传统DNS监控系统失明，需要从端点(EDR/浏览器策略)做DNS安全
## 面试陷阱
- DNS隧道不是只在CTF中有用——真实APT组织(OilRig/APT29)大量使用DNS隧道做C2
- DNSSEC的加密≠DoH的加密——DNSSEC是完整性签名，DoH是传输加密
- DoH在Chrome/Firefox的默认开启意味着很多企业员工已经在绕开公司DNS过滤——这是安全团队普遍低估的问题

## 今日检测
1. 用iodine/dnscat2搭建DNS隧道→Wireshark抓包分析特征
2. 用dig +dnssec查询一个开启DNSSEC的域名→分析RRSIG记录
3. 用DNSTwist生成域名的typosquatting候选列表
