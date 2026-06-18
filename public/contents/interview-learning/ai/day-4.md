# Day 4：HTTP/HTTPS深入与安全
> [Web协议面试核心] TLS握手/HTTP安全头/请求走私/HTTP3安全
## 核心知识点
### Q: HTTPS的TLS握手完整过程和安全考点
TLS 1.3握手(RTT减少为1次)：ClientHello(支持的密码套件+客户端随机数+DH公钥)→ServerHello(选定的套件+服务器随机数+DH公钥+证书+Finished)→Client Finished→开始加密传输

安全面试考点：①证书链验证——根CA→中间CA→服务器证书→任何一环被攻破整个链崩溃 ②Heartbleed(CVE-2014-0160)——TLS心跳扩展漏洞，读取服务器内存(含私钥) ③降级攻击——强制降为弱密码套件(RC4/DES)→POODLE攻击迫使服务器从TLS降为SSLv3 ④中间人——如果客户端不验证证书(如忽略证书错误的APP/API调用)→Burp/Fiddler可直接解密HTTPS
### Q: HTTP安全头(CSP/HSTS/X-Frame-Options等)的作用和配置要点
CSP(Content-Security-Policy)：限制页面资源来源→`default-src 'self'; script-src 'self' 'nonce-{rnd}'`。最强配置用nonce+strict-dynamic
HSTS(Strict-Transport-Security)：强制浏览器只用HTTPS→`max-age=31536000; includeSubDomains; preload`。一旦preload→浏览器内置列表中，HTTP永不访问。但首次访问(TOFU)仍有风险
X-Frame-Options：防止点击劫持→DENY/SAMEORIGIN。CSP的frame-ancestors更强大可替代
X-Content-Type-Options: nosniff：防止MIME类型嗅探→攻击者上传含JS的图片文件
Referrer-Policy：控制Referer头泄露→strict-origin-when-cross-origin(仅同站发送完整URL)

面试亮点：用securityheaders.com扫描目标展示安全头质量
### Q: HTTP请求走私(Request Smuggling)的原理和利用
原理：前端代理(nginx/HAProxy)和后端服务器对Content-Length和Transfer-Encoding的解析差异→攻击者发送一个被前端和前一个请求合并、后端当作两个请求的HTTP包→第二个请求走私进入下一个用户的请求位置。

类型：CL.TE(前端看Content-Length，后端看Transfer-Encoding→前端说请求体长X，后端看到chunked截断到0\r\n→剩余部分成为下个请求)。TE.CL和TE.TE类似思路

利用：①Cache Poisoning→走私请求被后端当作正常请求缓存→其他用户拿到被篡改的内容 ②WAF绕过→走私请求绕过了WAF检查 ③Session劫持→走私请求偷取其他用户的Cookie

防御：前后端使用相同方式解析(统一用HTTP/2禁用chunked)、WAF/firewall做请求规范性检查
### Q: HTTP/2和HTTP/3(QUIC)带来的安全变化
HTTP/2：多路复用(一个TCP连接多个Stream)→HTTP/1.1的请求排队问题解决了但也带来了新攻击面——HPACK压缩导致的头部压缩信息泄露(CRIME攻击变种)
HTTP/3(QUIC)：基于UDP而非TCP→加密在传输协议内置(不像TLS跑在TCP之上)→0-RTT恢复连接(重连时在第一个包就发数据)→0-RTT重放风险(攻击者可重放0-RTT数据→服务端需保证幂等)

面试加分：HTTP/3的普及意味着DDoS防御不能再只靠SYN Cookie(TCP层防御失效)，需要在UDP层做流量清洗
## 面试陷阱
- TLS版本号做假——TLS 1.3在ClientHello中Version字段仍写TLS 1.2以兼容→用supported_versions扩展声明真正的1.3
- HSTS preload一旦提交很难移除——你的域名需要先确认长期只用HTTPS
- HTTP请求走私常常是CTF考点，企业面试问得少但理解它体现HTTP协议功底深

## 今日检测
1. 用openssl s_client分析目标网站TLS握手详情
2. 用securityheaders.com检查你的网站安全头评分
3. 在Burp里手动构造一个HTTP请求走私Payload(CL.TE型)
