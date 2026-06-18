# Day 7：CSRF与SSRF攻击
> [CSRF/SSRF面试核心] SameSite Cookie/CSRF Token绕过/SSRF打内网/Gopher协议/Redis攻击
## 核心知识点
### Q: SameSite Cookie的Lax/Strict/None三种模式
SameSite控制Cookie是否随跨站请求发送：
Strict：仅同站→从邮件点链接也会被当作未登录→最安全但体验差
Lax：导航GET顶级跳转带Cookie，POST/AJAX跨站不带→Chrome默认Lax
None：任何跨站请求都带Cookie→必须Secure(HTTPS)否则浏览器拒绝

SameSite解决了传统CSRF的根本问题——从协议层让浏览器不发跨站Cookie。仍需注意GET请求包含敏感操作的应用(如转账?to=attacker&amount=100)在Lax下依然可被攻击
### Q: SSRF打内网的九种绕过技巧
IP格式变换：127.0.0.1→2130706433(十进制)→0x7f000001(十六进制)→0177.0.0.1(八进制)→127.0.0.1.nip.io
URL重定向：短地址→302跳转→最终走内网地址
DNS Rebinding：域名第一次解析公网IP(过白名单)→第二次解析内网IP→底层TOCTOU漏洞
协议利用：file:///etc/passwd、gopher://(发任意TCP包打Redis)、dict://(探测服务版本)、ftp://

面试亮点：SSRF不只是file://和http://，gopher/dict/ftp构成'SSRF协议武器库'
### Q: SSRF打内网Redis(未授权)的完整攻击链
前置条件：SSRF漏洞+Redis无密码+protected-mode no+bind 0.0.0.0
攻击流程：①用gopher协议发送Redis的RESP数据 ②CONFIG SET dir /var/www/html→设置持久化目录 ③CONFIG SET dbfilename shell.php→设置文件名 ④SET key webshell代码 ⑤SAVE→shell.php写入Web根目录
防御：Redis密码requirepass、bind 127.0.0.1、protected-mode yes、rename危险命令(CONFIG/EVAL/FLUSHALL)、防火墙白名单
### Q: CSRF Token的常见绕过方法
①Token在GET参数中(Referer泄露) ②Token校验失败不拒绝请求(仅警告) ③Token可重用(一次使用不失效) ④弱PRNG生成可预测Token ⑤CORS配置错误(ACAO:*+ACAC:true→攻击者跨域读取Token) ⑥Token基于User-Agent且无其他随机源
## 面试陷阱
- SSRF不只HTTP协议——gopher/dict/ftp/file是攻击者的协议武器库
- 内网地址黑名单防不了SSRF——DNS Rebinding/302重定向/IP变换轻松绕过
- CSRF在现代SSO/SPA应用中仍有风险——不当的CORS/OAuth配置反而造成新型CSRF

## 今日检测
1. Burp Collaborator检测SSRF是否可达外网
2. 本地Redis无认证环境用Gopherus工具测试gopher SSRF攻击链
3. 检查几个主流Web应用的SameSite Cookie配置对比差异
