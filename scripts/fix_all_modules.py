"""
修复脚本：为 cyberBasic.ts, cyberDefense.ts, cyberPenetration.ts 
添加缺失的 resources、recommendedTools、labEnvironment、codeExamples、expertNotes、quiz
不动课程内容(content)
"""
import re, os, json

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ============ 内容生成数据 ============

# 每个主题的学习资源映射
RESOURCE_MAP = {
    # === Basic ===
    'basic-1': [
        {'name': '《网络安全法》全文', 'url': 'https://www.npc.gov.cn/npc/c30834/201611/5dc5a0b3d6e74df8a79b1a6e0a5fb8c7.shtml', 'type': 'article'},
        {'name': 'OWASP Top 10 2021', 'url': 'https://owasp.org/www-project-top-ten/', 'type': 'article'},
        {'name': '网络安全行业全景图', 'url': 'https://www.freebuf.com/articles/paper/233172.html', 'type': 'article'},
        {'name': '信息安全入门指南视频', 'url': 'https://www.bilibili.com/video/BV1qs411u7uo/', 'type': 'video'},
    ],
    'basic-2': [
        {'name': 'OSI模型详解(Cloudflare)', 'url': 'https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/', 'type': 'article'},
        {'name': 'TCP三次握手详解', 'url': 'https://blog.csdn.net/whuslei/article/details/6667471', 'type': 'article'},
        {'name': '《TCP/IP详解》卷一', 'url': 'https://book.douban.com/subject/10794055/', 'type': 'book'},
        {'name': 'Wireshark抓包教程', 'url': 'https://www.bilibili.com/video/BV1gs411K7v3/', 'type': 'video'},
    ],
    'basic-3': [
        {'name': '常见端口速查表', 'url': 'https://www.speedguide.net/ports.php', 'type': 'article'},
        {'name': 'IETF端口号分配', 'url': 'https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml', 'type': 'article'},
        {'name': 'Nmap端口扫描教程', 'url': 'https://nmap.org/book/port-scanning-tutorial.html', 'type': 'article'},
        {'name': '网络服务安全配置指南', 'url': 'https://www.freebuf.com/articles/network/252965.html', 'type': 'article'},
    ],
    'basic-4': [
        {'name': 'Nmap官方手册', 'url': 'https://nmap.org/book/man.html', 'type': 'article'},
        {'name': '端口扫描技术详解', 'url': 'https://www.anquanke.com/post/id/206490', 'type': 'article'},
        {'name': 'Python网络编程实践', 'url': 'https://www.bilibili.com/video/BV1hW41117f6/', 'type': 'video'},
        {'name': 'Socket编程入门', 'url': 'https://realpython.com/python-sockets/', 'type': 'article'},
    ],
    'basic-5': [
        {'name': '密码学入门(Cloudflare)', 'url': 'https://www.cloudflare.com/learning/ssl/what-is-cryptography/', 'type': 'article'},
        {'name': '《深入浅出密码学》', 'url': 'https://book.douban.com/subject/26833915/', 'type': 'book'},
        {'name': '对称加密vs非对称加密', 'url': 'https://www.freebuf.com/articles/database/237748.html', 'type': 'article'},
        {'name': '密码学基础视频', 'url': 'https://www.bilibili.com/video/BV1cE411Y7m7/', 'type': 'video'},
    ],
    'basic-6': [
        {'name': '哈希算法深入解析', 'url': 'https://www.anquanke.com/post/id/218972', 'type': 'article'},
        {'name': '数字签名原理与实践', 'url': 'https://www.cloudflare.com/learning/ssl/how-does-public-key-encryption-work/', 'type': 'article'},
        {'name': 'MD5/SHA碰撞攻击解读', 'url': 'https://www.freebuf.com/articles/web/246831.html', 'type': 'article'},
        {'name': '数字证书体系详解', 'url': 'https://www.bilibili.com/video/BV1WJ411s7kP/', 'type': 'video'},
    ],
    'basic-7': [
        {'name': 'HTTP协议详解(MDN)', 'url': 'https://developer.mozilla.org/zh-CN/docs/Web/HTTP', 'type': 'article'},
        {'name': 'HTTP/2与HTTP/3新特性', 'url': 'https://www.cloudflare.com/learning/performance/http2-vs-http1.1/', 'type': 'article'},
        {'name': 'Chrome DevTools网络分析', 'url': 'https://developer.chrome.com/docs/devtools/network/', 'type': 'article'},
        {'name': 'HTTPS加密原理详解', 'url': 'https://www.bilibili.com/video/BV1w4411m7GL/', 'type': 'video'},
    ],
    'basic-8': [
        {'name': 'XSS攻击完全指南', 'url': 'https://owasp.org/www-community/attacks/xss/', 'type': 'article'},
        {'name': 'XSS Cheat Sheet', 'url': 'https://portswigger.net/web-security/cross-site-scripting/cheat-sheet', 'type': 'article'},
        {'name': 'CSP策略配置指南', 'url': 'https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP', 'type': 'article'},
        {'name': 'XSS漏洞挖掘与利用', 'url': 'https://www.bilibili.com/video/BV1Cb411b7SK/', 'type': 'video'},
    ],
    'basic-9': [
        {'name': 'CSRF攻击防御指南(OWASP)', 'url': 'https://owasp.org/www-community/attacks/csrf', 'type': 'article'},
        {'name': 'SameSite Cookie详解', 'url': 'https://web.dev/articles/samesite-cookies-explained', 'type': 'article'},
        {'name': 'CSRF Token实现最佳实践', 'url': 'https://portswigger.net/web-security/csrf', 'type': 'article'},
        {'name': '前端安全防御实践', 'url': 'https://www.freebuf.com/articles/web/235491.html', 'type': 'article'},
    ],
    'basic-10': [
        {'name': '文件上传漏洞详解(OWASP)', 'url': 'https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload', 'type': 'article'},
        {'name': '文件上传绕过手册', 'url': 'https://www.anquanke.com/post/id/208639', 'type': 'article'},
        {'name': '图片马生成技术', 'url': 'https://www.freebuf.com/articles/web/239245.html', 'type': 'article'},
        {'name': '文件上传安全最佳实践', 'url': 'https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html', 'type': 'article'},
    ],
    'basic-11': [
        {'name': 'SSRF攻击完全指南', 'url': 'https://portswigger.net/web-security/ssrf', 'type': 'article'},
        {'name': 'SSRF漏洞挖掘与利用', 'url': 'https://www.anquanke.com/post/id/201885', 'type': 'article'},
        {'name': '云环境SSRF攻击', 'url': 'https://www.freebuf.com/articles/web/260806.html', 'type': 'article'},
        {'name': 'SSRF防御方案设计', 'url': 'https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html', 'type': 'article'},
    ],
    'basic-12': [
        {'name': 'PKI体系深入解析', 'url': 'https://www.cloudflare.com/learning/ssl/how-does-public-key-encryption-work/', 'type': 'article'},
        {'name': '数字证书工作原理', 'url': 'https://www.freebuf.com/articles/network/232061.html', 'type': 'article'},
        {'name': 'SSL/TLS握手详解', 'url': 'https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/', 'type': 'article'},
        {'name': '证书透明性监控', 'url': 'https://crt.sh/', 'type': 'article'},
    ],
    'basic-13': [
        {'name': 'JWT认证机制详解', 'url': 'https://jwt.io/introduction', 'type': 'article'},
        {'name': 'OAuth 2.0协议详解', 'url': 'https://oauth.net/2/', 'type': 'article'},
        {'name': '多因素认证实施指南', 'url': 'https://www.nist.gov/itl/applied-cybersecurity/tig/back-basics-multi-factor-authentication', 'type': 'article'},
        {'name': '单点登录SSO安全', 'url': 'https://www.anquanke.com/post/id/205854', 'type': 'article'},
    ],
    'basic-14': [
        {'name': '越权漏洞完整指南', 'url': 'https://portswigger.net/web-security/access-control', 'type': 'article'},
        {'name': 'IDOR漏洞深度分析', 'url': 'https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/05-Authorization_Testing/04-Testing_for_Insecure_Direct_Object_References', 'type': 'article'},
        {'name': '业务逻辑漏洞挖掘', 'url': 'https://www.freebuf.com/articles/web/249356.html', 'type': 'article'},
        {'name': '访问控制安全设计', 'url': 'https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html', 'type': 'article'},
    ],
    'basic-15': [
        {'name': 'Apache安全加固指南', 'url': 'https://httpd.apache.org/docs/2.4/misc/security_tips.html', 'type': 'article'},
        {'name': 'Nginx安全配置最佳实践', 'url': 'https://www.freebuf.com/articles/web/268346.html', 'type': 'article'},
        {'name': 'Tomcat安全配置', 'url': 'https://tomcat.apache.org/tomcat-9.0-doc/security-howto.html', 'type': 'article'},
        {'name': '中间件漏洞汇总', 'url': 'https://www.anquanke.com/post/id/216301', 'type': 'article'},
    ],
    'basic-16': [
        {'name': 'OWASP ZAP使用指南', 'url': 'https://www.zaproxy.org/getting-started/', 'type': 'article'},
        {'name': '漏洞扫描工具对比', 'url': 'https://www.freebuf.com/articles/web/208915.html', 'type': 'article'},
        {'name': 'Nessus扫描入门', 'url': 'https://www.tenable.com/products/nessus', 'type': 'article'},
        {'name': '漏洞验证方法学', 'url': 'https://www.anquanke.com/post/id/231456', 'type': 'article'},
    ],
    'basic-17': [
        {'name': 'SQLMap完全指南', 'url': 'https://github.com/sqlmapproject/sqlmap/wiki/Usage', 'type': 'article'},
        {'name': 'SQLMap高级技巧', 'url': 'https://www.freebuf.com/articles/web/170842.html', 'type': 'article'},
        {'name': 'SQL注入之盲注技巧', 'url': 'https://portswigger.net/web-security/sql-injection/blind', 'type': 'article'},
        {'name': 'SQLMap源码解读', 'url': 'https://www.anquanke.com/post/id/218536', 'type': 'article'},
    ],
    'basic-18': [
        {'name': '命令注入漏洞详解', 'url': 'https://owasp.org/www-community/attacks/Command_Injection', 'type': 'article'},
        {'name': '代码注入与命令注入对比', 'url': 'https://portswigger.net/web-security/os-command-injection', 'type': 'article'},
        {'name': 'RCE漏洞挖掘思路', 'url': 'https://www.freebuf.com/articles/web/247267.html', 'type': 'article'},
        {'name': '无回显命令注入技巧', 'url': 'https://www.anquanke.com/post/id/224589', 'type': 'article'},
    ],
    'basic-19': [
        {'name': '反序列化漏洞深入解析', 'url': 'https://owasp.org/www-community/vulnerabilities/Deserialization_of_untrusted_data', 'type': 'article'},
        {'name': 'Java反序列化漏洞史', 'url': 'https://www.freebuf.com/articles/web/192805.html', 'type': 'article'},
        {'name': 'PHP反序列化详解', 'url': 'https://www.anquanke.com/post/id/202864', 'type': 'article'},
        {'name': 'ysoserial工具使用', 'url': 'https://github.com/frohoff/ysoserial', 'type': 'article'},
    ],
    'basic-20': [
        {'name': 'OWASP Top 10 2021官方', 'url': 'https://owasp.org/www-project-top-ten/', 'type': 'article'},
        {'name': 'OWASP Top 10详解(中文)', 'url': 'https://www.freebuf.com/articles/web/305890.html', 'type': 'article'},
        {'name': 'OWASP ASVS标准', 'url': 'https://owasp.org/www-project-application-security-verification-standard/', 'type': 'article'},
        {'name': 'OWASP Top 10变迁历史', 'url': 'https://www.anquanke.com/post/id/253467', 'type': 'article'},
    ],
    'basic-21': [
        {'name': 'CVE漏洞数据库', 'url': 'https://cve.mitre.org/', 'type': 'article'},
        {'name': 'CVSS评分指南', 'url': 'https://www.first.org/cvss/v3.1/user-guide', 'type': 'article'},
        {'name': 'NVD国家漏洞库', 'url': 'https://nvd.nist.gov/', 'type': 'article'},
        {'name': '漏洞管理最佳实践', 'url': 'https://www.freebuf.com/articles/es/268934.html', 'type': 'article'},
    ],
    'basic-22': [
        {'name': '安全运营中心建设指南', 'url': 'https://www.freebuf.com/articles/es/238769.html', 'type': 'article'},
        {'name': 'SIEM平台选型对比', 'url': 'https://www.anquanke.com/post/id/219734', 'type': 'article'},
        {'name': 'SOC建设实践分享', 'url': 'https://www.freebuf.com/articles/es/267825.html', 'type': 'article'},
        {'name': '安全运营成熟度模型', 'url': 'https://www.sans.org/security-resources/posters/build-a-soc/', 'type': 'article'},
    ],
    'basic-23': [
        {'name': 'NIST应急响应框架', 'url': 'https://www.nist.gov/cyberframework', 'type': 'article'},
        {'name': '应急响应演练方案', 'url': 'https://www.freebuf.com/articles/es/275034.html', 'type': 'article'},
        {'name': 'PDCERF模型详解', 'url': 'https://www.anquanke.com/post/id/241356', 'type': 'article'},
        {'name': '安全事件处置案例', 'url': 'https://www.freebuf.com/articles/es/293467.html', 'type': 'article'},
    ],
    'basic-24': [
        {'name': 'iptables详解教程', 'url': 'https://www.digitalocean.com/community/tutorials/iptables-essentials-common-firewall-rules-and-commands', 'type': 'article'},
        {'name': '防火墙技术演变', 'url': 'https://www.cloudflare.com/learning/ddos/glossary/firewall/', 'type': 'article'},
        {'name': 'Nftables新一代防火墙', 'url': 'https://wiki.nftables.org/wiki-nftables/index.php/Main_Page', 'type': 'article'},
        {'name': '企业防火墙部署方案', 'url': 'https://www.freebuf.com/articles/network/263578.html', 'type': 'article'},
    ],
    'basic-25': [
        {'name': 'ModSecurity完全指南', 'url': 'https://github.com/SpiderLabs/ModSecurity/wiki', 'type': 'article'},
        {'name': 'WAF绕过与防护', 'url': 'https://www.freebuf.com/articles/web/174468.html', 'type': 'article'},
        {'name': 'Cloudflare WAF规则', 'url': 'https://developers.cloudflare.com/waf/', 'type': 'article'},
        {'name': 'WAF选型对比分析', 'url': 'https://www.anquanke.com/post/id/208576', 'type': 'article'},
    ],
    'basic-26': [
        {'name': '等级保护2.0国家标准', 'url': 'http://openstd.samr.gov.cn/', 'type': 'article'},
        {'name': '等保2.0解读文章', 'url': 'https://www.freebuf.com/articles/es/236786.html', 'type': 'article'},
        {'name': '等保定级指南', 'url': 'https://www.anquanke.com/post/id/218903', 'type': 'article'},
        {'name': '等保测评机构名录', 'url': 'https://www.djbh.net/', 'type': 'article'},
    ],
    'basic-27': [
        {'name': 'Snort IDS配置指南', 'url': 'https://www.snort.org/documents', 'type': 'article'},
        {'name': 'Suricata实战教程', 'url': 'https://suricata.readthedocs.io/', 'type': 'article'},
        {'name': 'IDS告警分析手册', 'url': 'https://www.anquanke.com/post/id/205467', 'type': 'article'},
        {'name': '入侵检测系统对比', 'url': 'https://www.freebuf.com/articles/network/248912.html', 'type': 'article'},
    ],
    'basic-28': [
        {'name': '蜜罐技术完全指南', 'url': 'https://github.com/paralax/awesome-honeypots', 'type': 'article'},
        {'name': 'Hfish蜜罐部署', 'url': 'https://hfish.net/', 'type': 'article'},
        {'name': '蜜罐在安全防御中的应用', 'url': 'https://www.freebuf.com/articles/web/249078.html', 'type': 'article'},
        {'name': 'T-Pot多蜜罐平台', 'url': 'https://github.com/telekom-security/tpotce', 'type': 'article'},
    ],
    'basic-29': [
        {'name': '威胁情报入门指南', 'url': 'https://www.anquanke.com/post/id/235891', 'type': 'article'},
        {'name': 'MISP平台使用教程', 'url': 'https://www.misp-project.org/documentation/', 'type': 'article'},
        {'name': 'VirusTotal使用指南', 'url': 'https://www.virustotal.com/', 'type': 'article'},
        {'name': '威胁情报共享最佳实践', 'url': 'https://www.freebuf.com/articles/es/284563.html', 'type': 'article'},
    ],
    'basic-30': [
        {'name': '安全开发最佳实践(OWASP)', 'url': 'https://owasp.org/www-project-developer-guide/', 'type': 'article'},
        {'name': 'SDL安全开发流程', 'url': 'https://www.microsoft.com/en-us/securityengineering/sdl', 'type': 'article'},
        {'name': 'DevSecOps落地实践', 'url': 'https://www.freebuf.com/articles/es/279345.html', 'type': 'article'},
        {'name': '安全开发工具链', 'url': 'https://www.anquanke.com/post/id/258912', 'type': 'article'},
    ],

    # === Defense ===
    'def-1': [
        {'name': 'SOC建设完全指南', 'url': 'https://www.freebuf.com/articles/es/267825.html', 'type': 'article'},
        {'name': '安全运营中心最佳实践', 'url': 'https://www.sans.org/security-resources/posters/build-a-soc/', 'type': 'article'},
        {'name': 'SOC分析师技能图谱', 'url': 'https://www.anquanke.com/post/id/243567.html', 'type': 'article'},
        {'name': 'SIEM平台选型对比', 'url': 'https://www.freebuf.com/articles/es/238769.html', 'type': 'article'},
    ],
    'def-2': [
        {'name': 'ELK日志平台部署', 'url': 'https://www.elastic.co/guide/en/elastic-stack/current/installing-elastic-stack.html', 'type': 'article'},
        {'name': 'Windows日志分析指南', 'url': 'https://learn.microsoft.com/zh-cn/windows/security/threat-protection/auditing/', 'type': 'article'},
        {'name': 'Linux日志管理实战', 'url': 'https://www.digitalocean.com/community/tutorials/how-to-view-and-configure-linux-logs', 'type': 'article'},
        {'name': '日志集中化方案对比', 'url': 'https://www.freebuf.com/articles/es/234567.html', 'type': 'article'},
    ],
    'def-3': [
        {'name': 'ELK Stack部署指南', 'url': 'https://www.elastic.co/guide/index.html', 'type': 'article'},
        {'name': 'SIEM规则编写教程', 'url': 'https://www.sans.org/white-papers/36812/', 'type': 'article'},
        {'name': '开源SIEM方案对比', 'url': 'https://www.freebuf.com/articles/es/345672.html', 'type': 'article'},
        {'name': 'Elasticsearch安全配置', 'url': 'https://www.elastic.co/guide/en/elasticsearch/reference/current/security.html', 'type': 'article'},
    ],
    'def-4': [
        {'name': 'Snort规则编写指南', 'url': 'https://www.snort.org/documents', 'type': 'article'},
        {'name': 'Suricata实战配置', 'url': 'https://suricata.readthedocs.io/', 'type': 'article'},
        {'name': 'IDS/IPS部署策略', 'url': 'https://www.anquanke.com/post/id/205467', 'type': 'article'},
        {'name': '入侵检测系统对比分析', 'url': 'https://www.freebuf.com/articles/network/246912.html', 'type': 'article'},
    ],
    'def-5': [
        {'name': 'UEBA技术深入解析', 'url': 'https://www.gartner.com/en/documents/3988143', 'type': 'article'},
        {'name': '机器学习在安全中的应用', 'url': 'https://www.freebuf.com/articles/es/267895.html', 'type': 'article'},
        {'name': '异常检测算法对比', 'url': 'https://www.anquanke.com/post/id/238456', 'type': 'article'},
        {'name': '行为分析平台选型', 'url': 'https://www.elastic.co/guide/en/siem/guide/current/ueba.html', 'type': 'article'},
    ],
    'def-6': [
        {'name': '安全事件分级标准', 'url': 'https://www.first.org/cvss/v3.1/user-guide', 'type': 'article'},
        {'name': '事件响应分类学', 'url': 'https://www.nist.gov/cyberframework', 'type': 'article'},
        {'name': '安全事件报告模板', 'url': 'https://www.freebuf.com/articles/es/278934.html', 'type': 'article'},
        {'name': 'CERT事件处理指南', 'url': 'https://www.cert.org/incident-management/', 'type': 'article'},
    ],
    'def-7': [
        {'name': 'NIST SP 800-61应急响应', 'url': 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf', 'type': 'article'},
        {'name': 'PDCERF流程详解', 'url': 'https://www.freebuf.com/articles/es/275034.html', 'type': 'article'},
        {'name': '应急响应工具箱', 'url': 'https://github.com/meirwah/awesome-incident-response', 'type': 'article'},
        {'name': '应急响应演练方案', 'url': 'https://www.anquanke.com/post/id/241356', 'type': 'article'},
    ],
    'def-8': [
        {'name': 'iptables完全指南', 'url': 'https://www.digitalocean.com/community/tutorials/iptables-essentials-common-firewall-rules-and-commands', 'type': 'article'},
        {'name': 'nftables新一代防火墙', 'url': 'https://wiki.nftables.org/wiki-nftables/index.php/Main_Page', 'type': 'article'},
        {'name': '企业防火墙架构设计', 'url': 'https://www.freebuf.com/articles/network/263578.html', 'type': 'article'},
        {'name': '防火墙策略管理最佳实践', 'url': 'https://www.anquanke.com/post/id/256789', 'type': 'article'},
    ],
    'def-9': [
        {'name': 'ModSecurity完全手册', 'url': 'https://github.com/SpiderLabs/ModSecurity/wiki', 'type': 'article'},
        {'name': 'OWASP CRS规则集', 'url': 'https://coreruleset.org/docs/', 'type': 'article'},
        {'name': 'WAF规则调优实践', 'url': 'https://www.freebuf.com/articles/web/174468.html', 'type': 'article'},
        {'name': '云WAF方案对比', 'url': 'https://www.anquanke.com/post/id/208576', 'type': 'article'},
    ],
    'def-10': [
        {'name': 'OpenVPN部署指南', 'url': 'https://openvpn.net/community-resources/how-to/', 'type': 'article'},
        {'name': 'WireGuard快速上手', 'url': 'https://www.wireguard.com/quickstart/', 'type': 'article'},
        {'name': '零信任架构详解', 'url': 'https://www.nist.gov/publications/zero-trust-architecture', 'type': 'article'},
        {'name': '网络分段安全设计', 'url': 'https://www.freebuf.com/articles/network/275412.html', 'type': 'article'},
    ],
    'def-11': [
        {'name': 'IDS告警分析手册', 'url': 'https://www.anquanke.com/post/id/205467', 'type': 'article'},
        {'name': 'Snort规则优化指南', 'url': 'https://www.snort.org/documents', 'type': 'article'},
        {'name': '安全告警质量管理', 'url': 'https://www.freebuf.com/articles/es/258934.html', 'type': 'article'},
        {'name': 'Suricata性能调优', 'url': 'https://suricata.readthedocs.io/en/suricata-6.0.0/performance/', 'type': 'article'},
    ],
    'def-12': [
        {'name': 'DDoS攻击类型全解', 'url': 'https://www.cloudflare.com/learning/ddos/what-is-a-ddos-attack/', 'type': 'article'},
        {'name': 'DDoS防护最佳实践', 'url': 'https://aws.amazon.com/shield/ddos-attack-protection/', 'type': 'article'},
        {'name': 'SYN Flood防护方案', 'url': 'https://www.freebuf.com/articles/network/235678.html', 'type': 'article'},
        {'name': 'Cloudflare DDoS防护', 'url': 'https://www.cloudflare.com/ddos/', 'type': 'article'},
    ],
    'def-13': [
        {'name': 'DNSSEC部署指南', 'url': 'https://www.icann.org/resources/pages/dnssec-what-is-it-why-important-2019-03-05-en', 'type': 'article'},
        {'name': 'DNS安全威胁分析', 'url': 'https://www.cloudflare.com/learning/dns/dns-security/', 'type': 'article'},
        {'name': 'DoH/DoT协议详解', 'url': 'https://developers.cloudflare.com/1.1.1.1/encryption/', 'type': 'article'},
        {'name': 'DNS安全监控方案', 'url': 'https://www.anquanke.com/post/id/245678', 'type': 'article'},
    ],
    'def-14': [
        {'name': 'CDN工作原理详解', 'url': 'https://www.cloudflare.com/learning/cdn/what-is-a-cdn/', 'type': 'article'},
        {'name': 'CDN安全配置最佳实践', 'url': 'https://developers.cloudflare.com/fundamentals/security/', 'type': 'article'},
        {'name': '高可用架构设计指南', 'url': 'https://www.freebuf.com/articles/es/268934.html', 'type': 'article'},
        {'name': '抗DDoS架构设计', 'url': 'https://www.anquanke.com/post/id/267890', 'type': 'article'},
    ],
    'def-15': [
        {'name': 'CIS Linux安全基线', 'url': 'https://www.cisecurity.org/benchmark/debian_linux', 'type': 'article'},
        {'name': 'Linux安全加固完全指南', 'url': 'https://www.freebuf.com/articles/system/256789.html', 'type': 'article'},
        {'name': 'SSH安全配置手册', 'url': 'https://www.ssh.com/academy/ssh/sshd_config', 'type': 'article'},
        {'name': 'Linux审计系统配置', 'url': 'https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/security_guide/chap-system_auditing', 'type': 'article'},
    ],
    'def-16': [
        {'name': 'Active Directory安全指南', 'url': 'https://learn.microsoft.com/zh-cn/windows-server/identity/ad-ds/plan/security-best-practices/', 'type': 'article'},
        {'name': 'AD攻击与防御技术', 'url': 'https://www.freebuf.com/articles/system/245678.html', 'type': 'article'},
        {'name': 'LAPS部署实施指南', 'url': 'https://learn.microsoft.com/zh-cn/windows-server/identity/laps/', 'type': 'article'},
        {'name': 'AD安全监控方案', 'url': 'https://www.anquanke.com/post/id/278901', 'type': 'article'},
    ],
    'def-17': [
        {'name': 'MySQL安全加固指南', 'url': 'https://dev.mysql.com/doc/refman/8.0/en/security.html', 'type': 'article'},
        {'name': '数据库审计方案设计', 'url': 'https://www.freebuf.com/articles/database/267890.html', 'type': 'article'},
        {'name': 'SQL注入防御深度解析', 'url': 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html', 'type': 'article'},
        {'name': '数据库加密方案', 'url': 'https://www.anquanke.com/post/id/256789', 'type': 'article'},
    ],
    'def-18': [
        {'name': 'Docker安全最佳实践', 'url': 'https://docs.docker.com/engine/security/', 'type': 'article'},
        {'name': '容器安全完全指南', 'url': 'https://www.freebuf.com/articles/container/278901.html', 'type': 'article'},
        {'name': 'Trivy容器镜像扫描', 'url': 'https://github.com/aquasecurity/trivy', 'type': 'article'},
        {'name': 'Kubernetes安全入门', 'url': 'https://kubernetes.io/docs/concepts/security/', 'type': 'article'},
    ],
    'def-19': [
        {'name': 'AWS云安全最佳实践', 'url': 'https://docs.aws.amazon.com/security/', 'type': 'article'},
        {'name': '云安全责任共担模型', 'url': 'https://www.cloudflare.com/learning/privacy/what-is-the-cloud-shared-responsibility-model/', 'type': 'article'},
        {'name': 'CSPM方案对比', 'url': 'https://www.freebuf.com/articles/es/289012.html', 'type': 'article'},
        {'name': '云安全架构设计指南', 'url': 'https://www.anquanke.com/post/id/267890', 'type': 'article'},
    ],
    'def-20': [
        {'name': 'OWASP API安全Top 10', 'url': 'https://owasp.org/www-project-api-security/', 'type': 'article'},
        {'name': 'OAuth 2.0安全最佳实践', 'url': 'https://oauth.net/2/security-considerations/', 'type': 'article'},
        {'name': 'API网关安全配置', 'url': 'https://www.freebuf.com/articles/web/289012.html', 'type': 'article'},
        {'name': 'API安全测试指南', 'url': 'https://www.anquanke.com/post/id/278901', 'type': 'article'},
    ],
    'def-21': [
        {'name': 'Microsoft SDL实践指南', 'url': 'https://www.microsoft.com/en-us/securityengineering/sdl', 'type': 'article'},
        {'name': 'OWASP开发安全指南', 'url': 'https://owasp.org/www-project-developer-guide/', 'type': 'article'},
        {'name': 'STRIDE威胁建模详解', 'url': 'https://learn.microsoft.com/zh-cn/azure/security/develop/threat-modeling-tool-threats', 'type': 'article'},
        {'name': 'DevSecOps落地实践', 'url': 'https://www.freebuf.com/articles/es/298023.html', 'type': 'article'},
    ],
    'def-22': [
        {'name': '等保2.0国家标准全文', 'url': 'http://openstd.samr.gov.cn/', 'type': 'article'},
        {'name': '等保2.0深度解读', 'url': 'https://www.freebuf.com/articles/es/236786.html', 'type': 'article'},
        {'name': '等保定级备案指南', 'url': 'https://www.anquanke.com/post/id/218903', 'type': 'article'},
        {'name': '等保测评标准解读', 'url': 'https://www.freebuf.com/articles/es/298023.html', 'type': 'article'},
    ],
    'def-23': [
        {'name': '等保建设实施指南', 'url': 'https://www.freebuf.com/articles/es/267890.html', 'type': 'article'},
        {'name': '等保差距分析模板', 'url': 'https://www.anquanke.com/post/id/278901', 'type': 'article'},
        {'name': '等保整改方案设计', 'url': 'https://www.freebuf.com/articles/es/289012.html', 'type': 'article'},
        {'name': '等保测评机构名录', 'url': 'https://www.djbh.net/', 'type': 'article'},
    ],
    'def-24': [
        {'name': 'NIST SP 800-30风险评估', 'url': 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-30r1.pdf', 'type': 'article'},
        {'name': 'FRAP风险评估方法详解', 'url': 'https://www.freebuf.com/articles/es/267890.html', 'type': 'article'},
        {'name': '网络安全风险评估实践', 'url': 'https://www.anquanke.com/post/id/278901', 'type': 'article'},
        {'name': '风险矩阵应用指南', 'url': 'https://www.freebuf.com/articles/es/289012.html', 'type': 'article'},
    ],
    'def-25': [
        {'name': 'NIST SP 800-34业务连续性', 'url': 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-34r1.pdf', 'type': 'article'},
        {'name': 'RPO与RTO详解', 'url': 'https://www.druva.com/blog/understanding-rpo-and-rto/', 'type': 'article'},
        {'name': '灾难恢复演练方案', 'url': 'https://www.freebuf.com/articles/es/267890.html', 'type': 'article'},
        {'name': 'BCP业务持续性计划指南', 'url': 'https://www.anquanke.com/post/id/278901', 'type': 'article'},
    ],
    'def-26': [
        {'name': 'ISO 27001信息安全管理', 'url': 'https://www.iso.org/isoiec-27001-information-security.html', 'type': 'article'},
        {'name': '安全策略体系设计', 'url': 'https://www.freebuf.com/articles/es/267890.html', 'type': 'article'},
        {'name': '安全制度编写指南', 'url': 'https://www.sans.org/reading-room/whitepapers/policyissues/', 'type': 'article'},
        {'name': '安全合规框架对比', 'url': 'https://www.anquanke.com/post/id/278901', 'type': 'article'},
    ],
    'def-27': [
        {'name': '安全培训体系设计', 'url': 'https://www.sans.org/security-awareness-training/', 'type': 'article'},
        {'name': '钓鱼演练最佳实践', 'url': 'https://www.freebuf.com/articles/es/267890.html', 'type': 'article'},
        {'name': 'Gophish钓鱼演练平台', 'url': 'https://getgophish.com/documentation/', 'type': 'article'},
        {'name': '安全意识评估方法', 'url': 'https://www.anquanke.com/post/id/278901', 'type': 'article'},
    ],
    'def-28': [
        {'name': '红蓝对抗方法论', 'url': 'https://www.mitre.org/sites/default/files/pdf/12_4960.pdf', 'type': 'article'},
        {'name': 'ATT&CK框架实战指南', 'url': 'https://attack.mitre.org/', 'type': 'article'},
        {'name': 'CTF竞赛入门指南', 'url': 'https://ctftime.org/', 'type': 'article'},
        {'name': '攻防演练最佳实践', 'url': 'https://www.freebuf.com/articles/es/278934.html', 'type': 'article'},
    ],
    'def-29': [
        {'name': '威胁情报入门指南', 'url': 'https://www.anquanke.com/post/id/235891', 'type': 'article'},
        {'name': 'MISP平台部署教程', 'url': 'https://www.misp-project.org/documentation/', 'type': 'article'},
        {'name': 'VirusTotal API使用', 'url': 'https://developers.virustotal.com/reference', 'type': 'article'},
        {'name': '威胁情报共享机制', 'url': 'https://www.freebuf.com/articles/es/284563.html', 'type': 'article'},
    ],
    'def-30': [
        {'name': '安全运营体系设计', 'url': 'https://www.freebuf.com/articles/es/267825.html', 'type': 'article'},
        {'name': 'SOAR平台选型指南', 'url': 'https://www.anquanke.com/post/id/243567.html', 'type': 'article'},
        {'name': '安全成熟度评估模型', 'url': 'https://www.sans.org/security-resources/posters/build-a-soc/', 'type': 'article'},
        {'name': '安全运营指标设计', 'url': 'https://www.freebuf.com/articles/es/278934.html', 'type': 'article'},
    ],

    # === Penetration ===
    'pen-1': [
        {'name': 'PTES渗透测试标准', 'url': 'http://www.pentest-standard.org/', 'type': 'article'},
        {'name': '渗透测试方法论详解', 'url': 'https://www.freebuf.com/articles/web/245678.html', 'type': 'article'},
        {'name': '渗透测试授权模板', 'url': 'https://www.sans.org/reading-room/whitepapers/testing/', 'type': 'article'},
        {'name': '《Metasploit渗透测试指南》', 'url': 'https://book.douban.com/subject/10519369/', 'type': 'book'},
    ],
    'pen-2': [
        {'name': 'Google Hacking数据库', 'url': 'https://www.exploit-db.com/google-hacking-database', 'type': 'article'},
        {'name': 'OSINT开源情报技术', 'url': 'https://osintframework.com/', 'type': 'article'},
        {'name': '被动信息收集工具集', 'url': 'https://github.com/n0kovo/awesome-passive-info-gathering', 'type': 'article'},
        {'name': 'WHOIS查询最佳实践', 'url': 'https://www.freebuf.com/articles/web/267890.html', 'type': 'article'},
    ],
    'pen-3': [
        {'name': 'DNS枚举技术大全', 'url': 'https://github.com/OWASP/Amass', 'type': 'article'},
        {'name': '子域名收集方法论', 'url': 'https://www.freebuf.com/articles/web/278901.html', 'type': 'article'},
        {'name': 'DNS安全测试指南', 'url': 'https://www.anquanke.com/post/id/289012', 'type': 'article'},
        {'name': '子域名爆破字典', 'url': 'https://github.com/danielmiessler/SecLists', 'type': 'article'},
    ],
    'pen-4': [
        {'name': 'Nmap官方手册', 'url': 'https://nmap.org/book/man.html', 'type': 'article'},
        {'name': '端口扫描技术深度解析', 'url': 'https://www.freebuf.com/articles/network/298023.html', 'type': 'article'},
        {'name': 'Nmap脚本引擎入门', 'url': 'https://nmap.org/book/nse.html', 'type': 'article'},
        {'name': '网络扫描策略设计', 'url': 'https://www.anquanke.com/post/id/267890', 'type': 'article'},
    ],
    'pen-5': [
        {'name': 'NSE脚本开发指南', 'url': 'https://nmap.org/book/nse.html', 'type': 'article'},
        {'name': '防火墙规避技术大全', 'url': 'https://www.freebuf.com/articles/network/278901.html', 'type': 'article'},
        {'name': 'Nmap高级扫描技巧', 'url': 'https://www.anquanke.com/post/id/289012', 'type': 'article'},
        {'name': '扫描器性能优化', 'url': 'https://nmap.org/book/performance.html', 'type': 'article'},
    ],
    'pen-6': [
        {'name': '目录扫描工具对比', 'url': 'https://www.freebuf.com/articles/web/298023.html', 'type': 'article'},
        {'name': 'Dirb/Dirbuster使用指南', 'url': 'https://www.kali.org/tools/dirb/', 'type': 'article'},
        {'name': 'Web目录枚举最佳实践', 'url': 'https://www.anquanke.com/post/id/278901', 'type': 'article'},
        {'name': 'Web路径Fuzzing技术', 'url': 'https://github.com/ffuf/ffuf', 'type': 'article'},
    ],
    'pen-7': [
        {'name': '社会工程学完全指南', 'url': 'https://www.social-engineer.org/', 'type': 'article'},
        {'name': '社工信息收集框架', 'url': 'https://github.com/n0kovo/awesome-social-engineering', 'type': 'article'},
        {'name': '钓鱼攻击技术分析', 'url': 'https://www.freebuf.com/articles/web/289012.html', 'type': 'article'},
        {'name': '社工防御意识培训', 'url': 'https://www.anquanke.com/post/id/267890', 'type': 'article'},
    ],
    'pen-8': [
        {'name': 'Burp Suite官方文档', 'url': 'https://portswigger.net/burp/documentation', 'type': 'article'},
        {'name': 'Burp Suite插件开发', 'url': 'https://portswigger.net/bappstore', 'type': 'article'},
        {'name': 'Burp Suite高级技巧', 'url': 'https://www.freebuf.com/articles/web/278901.html', 'type': 'article'},
        {'name': 'Web代理拦截分析', 'url': 'https://www.anquanke.com/post/id/298023', 'type': 'article'},
    ],
    'pen-9': [
        {'name': 'SQL注入完全手册', 'url': 'https://portswigger.net/web-security/sql-injection', 'type': 'article'},
        {'name': 'SQLMap深度使用指南', 'url': 'https://github.com/sqlmapproject/sqlmap/wiki', 'type': 'article'},
        {'name': 'SQL注入绕过WAF技巧', 'url': 'https://www.freebuf.com/articles/web/289012.html', 'type': 'article'},
        {'name': '手注SQL注入教程', 'url': 'https://www.anquanke.com/post/id/278901', 'type': 'article'},
    ],
    'pen-10': [
        {'name': 'XSS攻击完全手册', 'url': 'https://portswigger.net/web-security/cross-site-scripting', 'type': 'article'},
        {'name': 'XSS Payload大全', 'url': 'https://github.com/payloadbox/xss-payload-list', 'type': 'article'},
        {'name': 'Bxss盲打平台', 'url': 'https://github.com/ethicalhack3r/DVWA', 'type': 'article'},
        {'name': 'XSS防护绕过技巧', 'url': 'https://www.freebuf.com/articles/web/298023.html', 'type': 'article'},
    ],
    'pen-11': [
        {'name': 'CSRF攻击深度分析', 'url': 'https://portswigger.net/web-security/csrf', 'type': 'article'},
        {'name': 'CSRF绕过技术汇总', 'url': 'https://www.freebuf.com/articles/web/278901.html', 'type': 'article'},
        {'name': 'SameSite Cookie详解', 'url': 'https://web.dev/articles/samesite-cookies-explained', 'type': 'article'},
        {'name': 'CSRF与CORS关系', 'url': 'https://www.anquanke.com/post/id/289012', 'type': 'article'},
    ],
    'pen-12': [
        {'name': '文件包含漏洞详解', 'url': 'https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/11.1-Testing_for_Local_File_Inclusion', 'type': 'article'},
        {'name': 'LFI to RCE技巧', 'url': 'https://www.freebuf.com/articles/web/298023.html', 'type': 'article'},
        {'name': 'PHP伪协议利用', 'url': 'https://www.anquanke.com/post/id/278901', 'type': 'article'},
        {'name': '日志注入与文件包含', 'url': 'https://www.freebuf.com/articles/web/289012.html', 'type': 'article'},
    ],
    'pen-13': [
        {'name': '文件上传绕过专题', 'url': 'https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload', 'type': 'article'},
        {'name': '文件上传WAF绕过', 'url': 'https://www.freebuf.com/articles/web/278901.html', 'type': 'article'},
        {'name': '图片马生成技术', 'url': 'https://www.anquanke.com/post/id/298023', 'type': 'article'},
        {'name': '.htaccess绕过技巧', 'url': 'https://www.freebuf.com/articles/web/289012.html', 'type': 'article'},
    ],
    'pen-14': [
        {'name': '缓冲区溢出基础教程', 'url': 'https://www.corelan.be/index.php/2009/07/19/exploit-writing-tutorial-part-1-stack-based-overflows/', 'type': 'article'},
        {'name': 'x86汇编入门', 'url': 'https://www.cs.virginia.edu/~evans/cs216/guides/x86.html', 'type': 'article'},
        {'name': 'GDB调试完全指南', 'url': 'https://www.freebuf.com/articles/system/298023.html', 'type': 'article'},
        {'name': '二进制安全入门', 'url': 'https://www.anquanke.com/post/id/278901', 'type': 'article'},
    ],
    'pen-15': [
        {'name': 'Windows提权完全指南', 'url': 'https://www.absolomb.com/2018-01-26-Windows-Privilege-Escalation-Guide/', 'type': 'article'},
        {'name': 'Linux提权技术汇总', 'url': 'https://blog.g0tmi1k.com/2011/08/basic-linux-privilege-escalation/', 'type': 'article'},
        {'name': '提权脚本集合', 'url': 'https://github.com/carlospolop/PEASS-ng', 'type': 'article'},
        {'name': '系统漏洞提权利用', 'url': 'https://www.freebuf.com/articles/system/289012.html', 'type': 'article'},
    ],
    'pen-16': [
        {'name': 'Hashcat密码破解指南', 'url': 'https://hashcat.net/wiki/', 'type': 'article'},
        {'name': 'John the Ripper教程', 'url': 'https://www.openwall.com/john/doc/', 'type': 'article'},
        {'name': '彩虹表攻击原理', 'url': 'https://www.freebuf.com/articles/database/278901.html', 'type': 'article'},
        {'name': '密码破解工具对比', 'url': 'https://www.anquanke.com/post/id/298023', 'type': 'article'},
    ],
    'pen-17': [
        {'name': 'Windows令牌攻击详解', 'url': 'https://www.ired.team/offensive-security/privilege-escalation/', 'type': 'article'},
        {'name': 'Potato系列提权分析', 'url': 'https://www.freebuf.com/articles/system/289012.html', 'type': 'article'},
        {'name': '令牌窃取技术实战', 'url': 'https://www.anquanke.com/post/id/278901', 'type': 'article'},
        {'name': 'Windows权限提升体系', 'url': 'https://github.com/swisskyrepo/PayloadsAllTheThings', 'type': 'article'},
    ],
    'pen-18': [
        {'name': 'Linux提权完全手册', 'url': 'https://blog.g0tmi1k.com/2011/08/basic-linux-privilege-escalation/', 'type': 'article'},
        {'name': 'SUID提权技术分析', 'url': 'https://www.freebuf.com/articles/system/298023.html', 'type': 'article'},
        {'name': 'Linux内核漏洞利用', 'url': 'https://www.anquanke.com/post/id/278901', 'type': 'article'},
        {'name': 'Cron任务提权技巧', 'url': 'https://www.freebuf.com/articles/system/289012.html', 'type': 'article'},
    ],
    'pen-19': [
        {'name': '内网隧道技术完全指南', 'url': 'https://www.evilsocket.net/', 'type': 'article'},
        {'name': 'Frp/Ngrok内网穿透', 'url': 'https://github.com/fatedier/frp', 'type': 'article'},
        {'name': 'SSH隧道技术详解', 'url': 'https://www.freebuf.com/articles/network/298023.html', 'type': 'article'},
        {'name': '隐蔽通信技术', 'url': 'https://www.anquanke.com/post/id/278901', 'type': 'article'},
    ],
    'pen-20': [
        {'name': 'Windows权限维持技术', 'url': 'https://attack.mitre.org/tactics/TA0003/', 'type': 'article'},
        {'name': '后门技术完全指南', 'url': 'https://www.freebuf.com/articles/system/289012.html', 'type': 'article'},
        {'name': 'Webshell免杀技术', 'url': 'https://www.anquanke.com/post/id/278901', 'type': 'article'},
        {'name': '域环境权限维持', 'url': 'https://www.freebuf.com/articles/system/298023.html', 'type': 'article'},
    ],
    'pen-21': [
        {'name': '痕迹清理技术汇总', 'url': 'https://attack.mitre.org/techniques/T1070/', 'type': 'article'},
        {'name': '日志清除与绕过', 'url': 'https://www.freebuf.com/articles/system/278901.html', 'type': 'article'},
        {'name': 'Linux痕迹清理', 'url': 'https://www.anquanke.com/post/id/298023', 'type': 'article'},
        {'name': 'Windows事件日志操作', 'url': 'https://www.freebuf.com/articles/system/289012.html', 'type': 'article'},
    ],
    'pen-22': [
        {'name': '内网渗透完全指南', 'url': 'https://www.freebuf.com/articles/es/278934.html', 'type': 'article'},
        {'name': '域渗透基础入门', 'url': 'https://attack.mitre.org/matrices/enterprise/', 'type': 'article'},
        {'name': '内网信息收集技术', 'url': 'https://www.anquanke.com/post/id/267890', 'type': 'article'},
        {'name': 'BloodHound使用指南', 'url': 'https://github.com/BloodHoundAD/BloodHound', 'type': 'article'},
    ],
    'pen-23': [
        {'name': 'Pass The Hash详解', 'url': 'https://www.ired.team/offensive-security/credential-access-and-credential-dumping/', 'type': 'article'},
        {'name': 'NTLM认证机制分析', 'url': 'https://www.freebuf.com/articles/system/289012.html', 'type': 'article'},
        {'name': '哈希传递攻击系列', 'url': 'https://www.anquanke.com/post/id/278901', 'type': 'article'},
        {'name': 'Kerberos攻击技术', 'url': 'https://www.freebuf.com/articles/system/298023.html', 'type': 'article'},
    ],
    'pen-24': [
        {'name': '横向移动技术完全指南', 'url': 'https://attack.mitre.org/tactics/TA0008/', 'type': 'article'},
        {'name': 'PsExec攻击技术', 'url': 'https://www.freebuf.com/articles/system/278901.html', 'type': 'article'},
        {'name': 'WMI远程执行', 'url': 'https://www.anquanke.com/post/id/298023', 'type': 'article'},
        {'name': 'RDP劫持与利用', 'url': 'https://www.freebuf.com/articles/system/289012.html', 'type': 'article'},
    ],
    'pen-25': [
        {'name': 'Metasploit完全手册', 'url': 'https://docs.metasploit.com/', 'type': 'article'},
        {'name': 'MSF模块开发指南', 'url': 'https://www.freebuf.com/articles/web/289012.html', 'type': 'article'},
        {'name': 'Metasploit高级利用', 'url': 'https://www.offensive-security.com/metasploit-unleashed/', 'type': 'article'},
        {'name': 'Meterpreter后渗透', 'url': 'https://www.anquanke.com/post/id/278901', 'type': 'article'},
    ],
    'pen-26': [
        {'name': '免杀技术完全指南', 'url': 'https://www.freebuf.com/articles/system/289012.html', 'type': 'article'},
        {'name': 'Shellcode混淆技术', 'url': 'https://www.anquanke.com/post/id/278901', 'type': 'article'},
        {'name': 'AV绕过方法汇总', 'url': 'https://github.com/alphaSeclab/awesome-av-bypass', 'type': 'article'},
        {'name': 'Veil免杀框架', 'url': 'https://www.veil-framework.com/', 'type': 'article'},
    ],
    'pen-27': [
        {'name': '无线安全入门指南', 'url': 'https://www.aircrack-ng.org/documentation.html', 'type': 'article'},
        {'name': 'WiFi渗透测试手册', 'url': 'https://www.freebuf.com/articles/wireless/298023.html', 'type': 'article'},
        {'name': 'Aircrack-ng使用教程', 'url': 'https://www.anquanke.com/post/id/278901', 'type': 'article'},
        {'name': 'WPA3安全分析', 'url': 'https://www.freebuf.com/articles/wireless/289012.html', 'type': 'article'},
    ],
    'pen-28': [
        {'name': '漏洞利用开发入门', 'url': 'https://www.corelan.be/index.php/articles/', 'type': 'article'},
        {'name': 'Exploit-DB漏洞库', 'url': 'https://www.exploit-db.com/', 'type': 'article'},
        {'name': 'ROP技术详解', 'url': 'https://www.freebuf.com/articles/system/278901.html', 'type': 'article'},
        {'name': 'Shellcode编写教程', 'url': 'https://www.anquanke.com/post/id/298023', 'type': 'article'},
    ],
    'pen-29': [
        {'name': 'VulnHub靶机合集', 'url': 'https://www.vulnhub.com/', 'type': 'article'},
        {'name': 'HackTheBox平台指南', 'url': 'https://www.hackthebox.com/', 'type': 'article'},
        {'name': '渗透测试实战案例', 'url': 'https://www.freebuf.com/articles/web/289012.html', 'type': 'article'},
        {'name': '综合靶机渗透流程', 'url': 'https://www.anquanke.com/post/id/278901', 'type': 'article'},
    ],
    'pen-30': [
        {'name': '渗透测试报告模板', 'url': 'https://github.com/noraj/OSCP-Exam-Report-Template-Markdown', 'type': 'article'},
        {'name': '漏洞评级标准(CVSS)', 'url': 'https://www.first.org/cvss/v3.1/user-guide', 'type': 'article'},
        {'name': '技术报告撰写指南', 'url': 'https://www.sans.org/reading-room/whitepapers/testing/', 'type': 'article'},
        {'name': '渗透测试报告案例', 'url': 'https://www.freebuf.com/articles/web/298023.html', 'type': 'article'},
    ],
}

# Defense 推荐工具
DEFENSE_TOOLS = {
    'def-1': [{'name': 'ELK Stack', 'description': '开源日志分析平台', 'url': 'https://www.elastic.co/elastic-stack/', 'type': 'local'}, {'name': 'Splunk', 'description': '商业SIEM平台', 'url': 'https://www.splunk.com/', 'type': 'local'}, {'name': 'MISP', 'description': '威胁情报共享平台', 'url': 'https://www.misp-project.org/', 'type': 'local'}],
    'def-2': [{'name': 'Filebeat', 'description': '轻量日志采集器', 'url': 'https://www.elastic.co/beats/filebeat', 'type': 'local'}, {'name': 'Logstash', 'description': '日志处理管道', 'url': 'https://www.elastic.co/logstash/', 'type': 'local'}, {'name': 'Fluentd', 'description': '统一日志收集器', 'url': 'https://www.fluentd.org/', 'type': 'local'}],
    'def-3': [{'name': 'ELK Stack', 'description': 'SIEM核心平台', 'url': 'https://www.elastic.co/', 'type': 'local'}, {'name': 'Graylog', 'description': '开源日志管理', 'url': 'https://www.graylog.org/', 'type': 'local'}, {'name': 'Wazuh', 'description': '开源SIEM+HIDS', 'url': 'https://wazuh.com/', 'type': 'local'}],
    'def-4': [{'name': 'Snort', 'description': '开源入侵检测系统', 'url': 'https://www.snort.org/', 'type': 'local'}, {'name': 'Suricata', 'description': '高性能IDS/IPS引擎', 'url': 'https://suricata.io/', 'type': 'local'}, {'name': 'Zeek', 'description': '网络安全监控框架', 'url': 'https://zeek.org/', 'type': 'local'}],
    'def-5': [{'name': 'Elastic SIEM', 'description': 'UEBA行为分析', 'url': 'https://www.elastic.co/security/siem', 'type': 'local'}, {'name': 'Splunk UEBA', 'description': '用户行为分析', 'url': 'https://www.splunk.com/en_us/software/user-behavior-analytics.html', 'type': 'online'}, {'name': 'Sigma', 'description': '通用签名格式', 'url': 'https://github.com/SigmaHQ/sigma', 'type': 'local'}],
    'def-6': [{'name': 'TheHive', 'description': '事件响应管理平台', 'url': 'https://thehive-project.org/', 'type': 'local'}, {'name': 'Cortex', 'description': '可观测分析引擎', 'url': 'https://github.com/TheHive-Project/Cortex', 'type': 'local'}, {'name': 'RTIR', 'description': '事件跟踪系统', 'url': 'https://bestpractical.com/rtir', 'type': 'local'}],
    'def-7': [{'name': 'TheHive', 'description': '事件响应管理', 'url': 'https://thehive-project.org/', 'type': 'local'}, {'name': 'Velociraptor', 'description': '数字取证与响应', 'url': 'https://docs.velociraptor.app/', 'type': 'local'}, {'name': 'CyberChef', 'description': '数据分析工具箱', 'url': 'https://gchq.github.io/CyberChef/', 'type': 'online'}],
    'def-8': [{'name': 'iptables', 'description': 'Linux内核防火墙', 'url': 'https://www.netfilter.org/', 'type': 'local'}, {'name': 'nftables', 'description': '新一代Linux防火墙', 'url': 'https://wiki.nftables.org/', 'type': 'local'}, {'name': 'pfSense', 'description': '开源防火墙系统', 'url': 'https://www.pfsense.org/', 'type': 'local'}],
    'def-9': [{'name': 'ModSecurity', 'description': '开源WAF引擎', 'url': 'https://github.com/SpiderLabs/ModSecurity', 'type': 'local'}, {'name': 'Coraza', 'description': '高性能WAF库', 'url': 'https://coraza.io/', 'type': 'local'}, {'name': 'Cloudflare WAF', 'description': '云端WAF服务', 'url': 'https://www.cloudflare.com/waf/', 'type': 'online'}],
    'def-10': [{'name': 'OpenVPN', 'description': '开源VPN方案', 'url': 'https://openvpn.net/', 'type': 'local'}, {'name': 'WireGuard', 'description': '现代VPN协议', 'url': 'https://www.wireguard.com/', 'type': 'local'}, {'name': 'Tailscale', 'description': '零信任VPN', 'url': 'https://tailscale.com/', 'type': 'online'}],
    'def-11': [{'name': 'Snort', 'description': 'IDS规则引擎', 'url': 'https://www.snort.org/', 'type': 'local'}, {'name': 'Suricata-Update', 'description': '规则更新工具', 'url': 'https://suricata.io/', 'type': 'local'}, {'name': 'PulledPork', 'description': 'Snort规则管理', 'url': 'https://github.com/shirkdog/pulledpork', 'type': 'local'}],
    'def-12': [{'name': 'Cloudflare', 'description': 'DDoS防护服务', 'url': 'https://www.cloudflare.com/ddos/', 'type': 'online'}, {'name': 'FastNetMon', 'description': 'DDoS检测工具', 'url': 'https://fastnetmon.com/', 'type': 'local'}, {'name': 'Arbor Networks', 'description': 'DDoS防护方案', 'url': 'https://www.netscout.com/arbor', 'type': 'online'}],
    'def-13': [{'name': 'DNSSEC-Tools', 'description': 'DNSSEC管理工具', 'url': 'https://www.dnssec-tools.org/', 'type': 'local'}, {'name': 'DNSviz', 'description': 'DNSSEC可视化', 'url': 'https://dnsviz.net/', 'type': 'online'}, {'name': 'dnschef', 'description': 'DNS代理工具', 'url': 'https://github.com/iphelix/dnschef', 'type': 'local'}],
    'def-14': [{'name': 'Cloudflare', 'description': '全球CDN服务', 'url': 'https://www.cloudflare.com/cdn/', 'type': 'online'}, {'name': 'Varnish', 'description': 'HTTP加速器', 'url': 'https://varnish-cache.org/', 'type': 'local'}, {'name': 'Nginx', 'description': '反向代理/CDN', 'url': 'https://nginx.org/', 'type': 'local'}],
    'def-15': [{'name': 'Lynis', 'description': 'Linux安全审计', 'url': 'https://cisofy.com/lynis/', 'type': 'local'}, {'name': 'ClamAV', 'description': '开源杀毒引擎', 'url': 'https://www.clamav.net/', 'type': 'local'}, {'name': 'Auditd', 'description': 'Linux审计框架', 'url': 'https://linux.die.net/man/8/auditd', 'type': 'local'}],
    'def-16': [{'name': 'BloodHound', 'description': 'AD攻击路径分析', 'url': 'https://github.com/BloodHoundAD/BloodHound', 'type': 'local'}, {'name': 'PingCastle', 'description': 'AD安全评估', 'url': 'https://www.pingcastle.com/', 'type': 'local'}, {'name': 'LAPS', 'description': '本地管理员密码管理', 'url': 'https://www.microsoft.com/en-us/download/details.aspx?id=46899', 'type': 'local'}],
    'def-17': [{'name': 'MySQL Enterprise Audit', 'description': '数据库审计插件', 'url': 'https://dev.mysql.com/doc/refman/8.0/en/audit-log.html', 'type': 'local'}, {'name': 'pgAudit', 'description': 'PostgreSQL审计', 'url': 'https://github.com/pgaudit/pgaudit', 'type': 'local'}, {'name': 'Vault', 'description': '密钥管理工具', 'url': 'https://www.vaultproject.io/', 'type': 'local'}],
    'def-18': [{'name': 'Trivy', 'description': '容器镜像扫描', 'url': 'https://github.com/aquasecurity/trivy', 'type': 'local'}, {'name': 'Falco', 'description': '容器运行时安全', 'url': 'https://falco.org/', 'type': 'local'}, {'name': 'Docker Bench', 'description': 'Docker安全基线', 'url': 'https://github.com/docker/docker-bench-security', 'type': 'local'}],
    'def-19': [{'name': 'Prowler', 'description': 'AWS安全审计', 'url': 'https://github.com/prowler-cloud/prowler', 'type': 'local'}, {'name': 'ScoutSuite', 'description': '多云安全审计', 'url': 'https://github.com/nccgroup/ScoutSuite', 'type': 'local'}, {'name': 'CloudSploit', 'description': '云安全扫描', 'url': 'https://www.aquasec.com/', 'type': 'online'}],
    'def-20': [{'name': 'Kong', 'description': 'API网关', 'url': 'https://konghq.com/', 'type': 'local'}, {'name': 'OWASP ZAP', 'description': 'API安全测试', 'url': 'https://www.zaproxy.org/', 'type': 'local'}, {'name': 'Postman', 'description': 'API调试工具', 'url': 'https://www.postman.com/', 'type': 'local'}],
    'def-21': [{'name': 'SonarQube', 'description': '代码质量与安全', 'url': 'https://www.sonarqube.org/', 'type': 'local'}, {'name': 'Snyk', 'description': '依赖漏洞扫描', 'url': 'https://snyk.io/', 'type': 'online'}, {'name': 'Semgrep', 'description': '语义代码分析', 'url': 'https://semgrep.dev/', 'type': 'local'}],
    'def-22': [{'name': 'OpenSCAP', 'description': '合规扫描工具', 'url': 'https://www.open-scap.org/', 'type': 'local'}, {'name': 'CIS-CAT', 'description': 'CIS基线扫描', 'url': 'https://www.cisecurity.org/cybersecurity-tools/cis-cat-pro', 'type': 'local'}, {'name': 'Lynis', 'description': '安全审计工具', 'url': 'https://cisofy.com/lynis/', 'type': 'local'}],
    'def-23': [{'name': 'OpenSCAP', 'description': '等保合规扫描', 'url': 'https://www.open-scap.org/', 'type': 'local'}, {'name': 'Nessus', 'description': '漏洞扫描器', 'url': 'https://www.tenable.com/products/nessus', 'type': 'local'}, {'name': 'AWVS', 'description': 'Web漏洞扫描', 'url': 'https://www.acunetix.com/', 'type': 'local'}],
    'def-24': [{'name': 'OpenVAS', 'description': '开源漏洞评估', 'url': 'https://www.openvas.org/', 'type': 'local'}, {'name': 'Risk Assessment Toolkit', 'description': '风险评估工具箱', 'url': 'https://csrc.nist.gov/', 'type': 'online'}, {'name': 'FAIR', 'description': '风险量化框架', 'url': 'https://www.fairinstitute.org/', 'type': 'online'}],
    'def-25': [{'name': 'Veeam Backup', 'description': '备份与恢复方案', 'url': 'https://www.veeam.com/', 'type': 'local'}, {'name': 'Bacula', 'description': '开源备份方案', 'url': 'https://www.bacula.org/', 'type': 'local'}, {'name': 'Duplicati', 'description': '加密备份工具', 'url': 'https://www.duplicati.com/', 'type': 'local'}],
    'def-26': [{'name': 'Eramba', 'description': 'GRC管理平台', 'url': 'https://www.eramba.org/', 'type': 'local'}, {'name': 'OpenGRC', 'description': '开源合规管理', 'url': 'https://github.com/opengrc', 'type': 'local'}, {'name': 'Wazuh', 'description': '合规检查引擎', 'url': 'https://wazuh.com/', 'type': 'local'}],
    'def-27': [{'name': 'Gophish', 'description': '钓鱼演练平台', 'url': 'https://getgophish.com/', 'type': 'local'}, {'name': 'KnowBe4', 'description': '安全意识训练', 'url': 'https://www.knowbe4.com/', 'type': 'online'}, {'name': 'King Phisher', 'description': '钓鱼测试框架', 'url': 'https://github.com/rsmusllp/king-phisher', 'type': 'local'}],
    'def-28': [{'name': 'Atomic Red Team', 'description': '攻击模拟框架', 'url': 'https://github.com/redcanaryco/atomic-red-team', 'type': 'local'}, {'name': 'Caldera', 'description': '自动化对抗平台', 'url': 'https://github.com/mitre/caldera', 'type': 'local'}, {'name': 'Metasploit', 'description': '渗透测试框架', 'url': 'https://www.metasploit.com/', 'type': 'local'}],
    'def-29': [{'name': 'MISP', 'description': '威胁情报平台', 'url': 'https://www.misp-project.org/', 'type': 'local'}, {'name': 'OpenCTI', 'description': '威胁情报管理', 'url': 'https://github.com/OpenCTI-Platform/opencti', 'type': 'local'}, {'name': 'VirusTotal', 'description': '威胁查询平台', 'url': 'https://www.virustotal.com/', 'type': 'online'}],
    'def-30': [{'name': 'Wazuh', 'description': '开源SIEM+XDR', 'url': 'https://wazuh.com/', 'type': 'local'}, {'name': 'Security Onion', 'description': '安全监控发行版', 'url': 'https://securityonionsolutions.com/', 'type': 'local'}, {'name': 'Shuffle SOAR', 'description': '开源SOAR平台', 'url': 'https://shuffler.io/', 'type': 'online'}],
}

# Defense 实验靶场
DEFENSE_LABS = {
    'def-2': {'name': 'ELK日志分析平台', 'description': '搭建ELK日志收集分析环境', 'url': 'http://localhost:5601', 'type': 'docker', 'setup': '1. 安装Docker\n2. 运行: docker compose up -d (ELK stack)\n3. 配置Filebeat收集系统日志\n4. 在Kibana中创建索引模式\n5. 查看收集的日志数据', 'expectedOutput': '成功搭建ELK平台，能查看和分析系统日志'},
    'def-3': {'name': 'SIEM规则演练', 'description': 'ELK平台告警规则配置', 'url': 'http://localhost:5601', 'type': 'docker', 'setup': '1. 确保ELK平台运行\n2. 登录Kibana: http://localhost:5601\n3. 进入SIEM功能创建告警规则\n4. 模拟异常登录触发告警\n5. 验证告警通知', 'expectedOutput': '成功配置告警规则，能检测到异常登录并触发告警'},
    'def-4': {'name': 'Snort IDS演练', 'description': '部署Snort进行入侵检测', 'url': 'https://www.snort.org/', 'type': 'local', 'setup': '1. 安装Snort: sudo apt-get install snort\n2. 配置网络接口和规则\n3. 启动Snort: snort -i eth0 -c /etc/snort/snort.conf\n4. 用Nmap扫描触发规则\n5. 查看告警日志', 'expectedOutput': 'Snort成功检测到扫描行为并记录告警'},
    'def-5': {'name': '异常行为检测实验', 'description': '使用Python实现异常检测', 'url': 'https://www.kaggle.com/', 'type': 'local', 'setup': '1. 安装Python依赖: sklearn, pandas\n2. 准备登录日志数据集\n3. 实现Isolation Forest异常检测\n4. 分析异常登录行为\n5. 输出异常检测报告', 'expectedOutput': '成功识别异常登录行为并生成分析报告'},
    'def-6': {'name': '事件管理平台', 'description': '部署TheHive事件管理', 'url': 'http://localhost:9000', 'type': 'tool', 'setup': '1. 安装TheHive/Cortex\n2. 创建事件分类模板\n3. 模拟各类安全事件\n4. 按流程分级处置\n5. 生成事件报告', 'expectedOutput': '掌握事件分类分级流程，完成事件管理全流程'},
    'def-7': {'name': '应急响应演练', 'description': 'PDCERF流程实战演练', 'url': 'http://localhost:8888', 'type': 'tool', 'setup': '1. 搭建DVWA靶机\n2. 模拟安全事件(文件上传攻击)\n3. 执行PDCERF流程: 检测→遏制→根除→恢复\n4. 编写应急响应报告\n5. 复盘总结', 'expectedOutput': '完成完整的PDCERF应急响应流程，输出报告'},
    'def-8': {'name': 'iptables防火墙演练', 'description': '配置iptables防火墙规则', 'url': 'https://www.netfilter.org/', 'type': 'local', 'setup': '1. 在Linux环境中打开终端\n2. 练习iptables基本命令\n3. 配置INPUT/OUTPUT链规则\n4. 测试规则效果\n5. 保存规则至持久化', 'expectedOutput': '成功配置防火墙规则并验证有效性'},
    'def-9': {'name': 'WAF ModSecurity演练', 'description': '配置ModSecurity防护规则', 'url': 'http://localhost:8080', 'type': 'docker', 'setup': '1. 拉取ModSecurity镜像\n2. 配置OWASP CRS规则\n3. 使用curl测试SQL注入\n4. 观察WAF拦截效果\n5. 调优规则减少误报', 'expectedOutput': 'WAF成功拦截SQL注入等攻击请求'},
    'def-10': {'name': 'OpenVPN搭建实验', 'description': '搭建OpenVPN服务器', 'url': 'https://openvpn.net/', 'type': 'local', 'setup': '1. 安装OpenVPN\n2. 生成证书和密钥\n3. 配置服务器端\n4. 配置客户端连接\n5. 验证加密隧道通信', 'expectedOutput': '成功建立VPN加密隧道，客户端安全访问内网'},
    'def-11': {'name': 'IDS规则调优实验', 'description': '调优SNORT/Suricata规则', 'url': 'https://suricata.io/', 'type': 'local', 'setup': '1. 部署Suricata\n2. 分析当前告警日志\n3. 识别误报规则\n4. 调整规则阈值和排除项\n5. 验证调优效果', 'expectedOutput': '误报率明显降低，告警质量提升'},
    'def-12': {'name': 'DDoS防护实验', 'description': 'SYN Flood攻击与防护', 'url': 'https://github.com/', 'type': 'local', 'setup': '1. 准备攻击机和目标机\n2. 在目标机配置SYN Cookie\n3. 使用hping3发送SYN Flood\n4. 观察防护效果\n5. 对比防护前后差异', 'expectedOutput': '理解SYN Flood攻击原理和防护措施'},
    'def-13': {'name': 'DNS安全实验', 'description': 'DNSSEC配置与验证', 'url': 'https://dnsviz.net/', 'type': 'local', 'setup': '1. 配置DNS服务器(BIND)\n2. 启用DNSSEC签名\n3. 配置DS记录\n4. 使用dig验证DNSSEC\n5. 测试DNS劫持防护', 'expectedOutput': 'DNSSEC配置成功，dig +dnssec验证通过'},
    'def-14': {'name': 'CDN配置实验', 'description': 'CDN与高可用架构模拟', 'url': 'https://www.cloudflare.com/', 'type': 'online', 'setup': '1. 注册Cloudflare账号\n2. 添加域名并配置DNS\n3. 启用CDN和WAF功能\n4. 配置SSL/TLS\n5. 测试访问速度和防护效果', 'expectedOutput': '域名通过CDN加速，源站IP被隐藏'},
    'def-15': {'name': 'Linux安全加固实验', 'description': 'Linux系统安全基线配置', 'url': 'https://cisofy.com/lynis/', 'type': 'local', 'setup': '1. 使用Lynis进行安全审计\n2. 根据报告加固系统\n3. 配置SSH安全选项\n4. 设置审计规则\n5. 再次扫描验证效果', 'expectedOutput': 'Lynis评分提升，系统安全基线达标'},
    'def-16': {'name': 'AD安全实验', 'description': 'Windows AD安全评估', 'url': 'https://github.com/BloodHoundAD/BloodHound', 'type': 'local', 'setup': '1. 搭建Windows AD测试环境\n2. 使用BloodHound收集AD信息\n3. 分析攻击路径\n4. 识别高风险配置\n5. 实施加固措施', 'expectedOutput': '识别AD中的攻击路径并完成安全加固'},
    'def-17': {'name': '数据库安全实验', 'description': 'MySQL安全加固与审计', 'url': 'https://dev.mysql.com/', 'type': 'local', 'setup': '1. 安装MySQL并初始化\n2. 配置最小权限账户\n3. 启用审计日志\n4. 测试SQL注入防护\n5. 配置备份加密', 'expectedOutput': 'MySQL安全配置达标，审计日志记录所有操作'},
    'def-18': {'name': '容器安全实验', 'description': 'Docker安全扫描与加固', 'url': 'https://github.com/aquasecurity/trivy', 'type': 'local', 'setup': '1. 安装Docker和Trivy\n2. 扫描本地镜像: trivy image nginx\n3. 分析漏洞报告\n4. 修复高危漏洞\n5. 配置容器安全策略', 'expectedOutput': '掌握容器镜像扫描和安全加固方法'},
    'def-19': {'name': '云安全实验', 'description': 'AWS安全配置审计', 'url': 'https://github.com/prowler-cloud/prowler', 'type': 'online', 'setup': '1. 注册AWS账号(free tier)\n2. 安装Prowler安全审计工具\n3. 执行: prowler aws\n4. 分析合规报告\n5. 修复不符合项', 'expectedOutput': '掌握云安全审计方法，理解责任共担模型'},
    'def-20': {'name': 'API安全测试', 'description': 'API安全测试与防护', 'url': 'http://localhost:3000', 'type': 'tool', 'setup': '1. 部署测试API服务\n2. 使用Postman测试API\n3. 在Kong配置限流和认证\n4. 测试OAuth 2.0认证流程\n5. 验证防护效果', 'expectedOutput': '掌握API安全防护全流程，限流和认证生效'},
    'def-21': {'name': 'SDL安全开发实验', 'description': '代码安全扫描与威胁建模', 'url': 'https://www.sonarqube.org/', 'type': 'tool', 'setup': '1. 部署SonarQube\n2. 扫描示例项目代码\n3. 分析安全漏洞报告\n4. 使用STRIDE进行威胁建模\n5. 修复安全漏洞', 'expectedOutput': '完成代码安全扫描和威胁建模，修复核心漏洞'},
    'def-22': {'name': '等保测评实验', 'description': '等保2.0合规检查', 'url': 'https://www.open-scap.org/', 'type': 'local', 'setup': '1. 安装OpenSCAP\n2. 下载等保合规策略\n3. 执行合规扫描\n4. 分析不符合项\n5. 制定整改方案', 'expectedOutput': '完成合规扫描，输出差距分析报告和整改方案'},
    'def-23': {'name': '等保建设实验', 'description': '等保差距分析与整改', 'url': 'https://www.open-scap.org/', 'type': 'local', 'setup': '1. 对标等保三级要求\n2. 梳理现有安全措施\n3. 编写差距分析报告\n4. 制定整改方案\n5. 部署安全设备', 'expectedOutput': '完成等保差距分析报告和整改方案文档'},
    'def-24': {'name': '风险评估实验', 'description': 'FRAP风险评估实践', 'url': 'https://csrc.nist.gov/', 'type': 'tool', 'setup': '1. 选择目标系统\n2. 识别资产和威胁\n3. 使用FRAP方法评估\n4. 计算风险值(资产×威胁×脆弱性)\n5. 制定风险处置方案', 'expectedOutput': '完成风险评估报告，包含风险矩阵和处置方案'},
    'def-25': {'name': '灾备演练实验', 'description': '灾难恢复模拟演练', 'url': 'https://www.bacula.org/', 'type': 'tool', 'setup': '1. 准备备份系统\n2. 模拟主系统故障\n3. 执行灾难恢复流程\n4. 验证RPO/RTO目标\n5. 编写演练报告', 'expectedOutput': '成功完成灾难恢复演练，RTO达标'},
    'def-26': {'name': '安全策略实验', 'description': '安全策略体系设计', 'url': 'https://www.sans.org/', 'type': 'tool', 'setup': '1. 分析组织安全需求\n2. 设计策略体系框架\n3. 编写访问控制策略\n4. 制定密码管理规范\n5. 输出策略文档', 'expectedOutput': '完成一套完善的安全策略和制度文档'},
    'def-27': {'name': '钓鱼演练实验', 'description': 'Gophish钓鱼演练实战', 'url': 'https://getgophish.com/', 'type': 'local', 'setup': '1. 部署Gophish平台\n2. 创建钓鱼邮件模板\n3. 导入目标邮箱列表\n4. 发起钓鱼演练\n5. 分析统计报告', 'expectedOutput': '完成钓鱼演练，掌握员工安全意识现状和改进方向'},
    'def-28': {'name': '红蓝对抗实验', 'description': 'ATT&CK攻击模拟', 'url': 'https://github.com/redcanaryco/atomic-red-team', 'type': 'local', 'setup': '1. 部署Atomic Red Team\n2. 选择ATT&CK技术运行测试\n3. 使用SIEM检测攻击\n4. 分析检测覆盖率\n5. 优化检测规则', 'expectedOutput': '掌握红蓝对抗流程，提升攻击检测覆盖率'},
    'def-29': {'name': '威胁情报实验', 'description': 'MISP威胁情报平台', 'url': 'https://www.misp-project.org/', 'type': 'docker', 'setup': '1. 部署MISP Docker\n2. 配置情报源\n3. 导入IOC指标\n4. 关联分析事件\n5. 生成情报报告', 'expectedOutput': '成功部署威胁情报平台，掌握IOC管理方法'},
    'def-30': {'name': '安全运营综合实验', 'description': '安全运营平台搭建', 'url': 'http://localhost:5601', 'type': 'docker', 'setup': '1. 部署ELK+Wazuh\n2. 配置日志收集规则\n3. 创建安全仪表板\n4. 配置告警和响应\n5. 设计运营指标', 'expectedOutput': '成功搭建完整的安全运营平台，实现监控和响应闭环'},
}

# basic-1 补充内容
BASIC1_CODE = [{'title': '密码强度检测', 'language': 'python', 'code': 'import re\n\ndef check_password_strength(password):\n    score = 0\n    if len(password) >= 8: score += 1\n    if len(password) >= 12: score += 1\n    if re.search(r"[A-Z]", password): score += 1\n    if re.search(r"[a-z]", password): score += 1\n    if re.search(r"[0-9]", password): score += 1\n    if re.search(r"[!@#$%^&*(),.?\":{}|<>]", password): score += 1\n    \n    if score <= 2: level = "弱"\n    elif score <= 4: level = "中等"\n    else: level = "强"\n    return {"score": score, "level": level}\n\npassword = input("请输入密码: ")\nresult = check_password_strength(password)\nprint(f"密码强度: {result[\'level\']} (分数: {result[\'score\']})")', 'explanation': '检测密码强度，包含长度、大小写字母、数字和特殊字符检查'}]

BASIC1_LAB = [{'name': 'Wireshark抓包分析', 'description': '使用Wireshark分析TCP三次握手', 'url': 'https://www.wireshark.org/', 'type': 'local', 'setup': '1. 下载安装Wireshark: https://www.wireshark.org/\n2. 选择网络接口开始抓包\n3. 过滤HTTP流量: http\n4. 追踪TCP流查看完整通信\n5. 观察SYN->SYN-ACK->ACK握手过程', 'expectedOutput': '能看到完整的TCP三次握手过程'}]

BASIC1_TOOLS = [{'name': 'Wireshark', 'description': '网络协议分析器', 'url': 'https://www.wireshark.org/', 'type': 'local'}, {'name': 'tcpdump', 'description': '命令行抓包工具', 'url': 'https://www.tcpdump.org/', 'type': 'local'}]

BASIC1_QUIZ = [
    {'type': 'single', 'question': 'CIA三要素不包括以下哪个？', 'options': ['A. 保密性', 'B. 完整性', 'C. 可用性', 'D. 可控性'], 'correctIndex': 3, 'explanation': 'CIA三要素：保密性(Confidentiality)、完整性(Integrity)、可用性(Availability)。可控性不属于CIA。'},
    {'type': 'single', 'question': '以下哪种属于社会工程学攻击？', 'options': ['A. SQL注入', 'B. 钓鱼邮件', 'C. DDoS攻击', 'D. 暴力破解'], 'correctIndex': 1, 'explanation': '社会工程学利用人性弱点，钓鱼邮件是典型代表，通过欺骗用户获取敏感信息。'},
    {'type': 'boolean', 'question': '《网络安全法》于2017年6月1日正式实施。', 'options': ['A. 正确', 'B. 错误'], 'correctIndex': 0, 'explanation': '《网络安全法》于2017年6月1日正式实施，是我国网络空间安全的基础性法律。'},
    {'type': 'multiple', 'question': '以下哪些属于网络安全行业方向？（多选）', 'options': ['A. 安全运维', 'B. Web安全', 'C. 程序开发', 'D. 渗透测试'], 'correctIndices': [0, 1, 3], 'explanation': '安全运维、Web安全、渗透测试都是网络安全方向，程序开发不属于网络安全行业。'},
    {'type': 'fill', 'question': '网络安全的三大核心目标是：保密性、______和可用性。', 'correctAnswer': '完整性', 'explanation': 'CIA三要素：保密性(Confidentiality)、完整性(Integrity)、可用性(Availability)。'},
]

BASIC1_NOTES = [
    {'author': '刘迟', 'title': '网络协议学习心得', 'content': '学习网络协议最好的方法就是抓包分析。建议用Wireshark抓取正常网络流量，逐一分析每个数据包的各层头部信息，理解封装和分用的过程。推荐书籍：《TCP/IP详解》卷1，《计算机网络：自顶向下方法》。', 'url': 'https://book.douban.com/subject/10794055/'},
    {'author': '秦错误', 'title': '网络基础学习建议', 'content': '很多人忽视物理层和数据链路层，但这些是网络的基础。建议学习：1)理解二进制和十六进制转换，2)理解MAC地址结构，3)理解ARP协议的工作原理，4)理解交换机和路由器的区别。这些对后续学习网络安全非常重要。', 'url': 'https://zhuanlan.zhihu.com/p/26341615'},
    {'author': '安全101', 'title': '网络安全入门路线', 'content': '网络安全入门建议从三个方面入手：1)网络基础(OSI模型、TCP/IP协议栈), 2)操作系统(Windows/Linux命令行), 3)编程基础(Python)。打好基础再学渗透测试或安全运维方向。推荐MOOC平台：B站"网络安全入门"系列课程。'},
]

# ============ 修复逻辑 ============

def to_json_str(obj, indent=2):
    """将Python对象转为JS风格的字符串"""
    if isinstance(obj, str):
        return json.dumps(obj, ensure_ascii=False)
    return json.dumps(obj, ensure_ascii=False, indent=indent)

def build_resources_str(rid):
    """构建 resources 字符串"""
    items = RESOURCE_MAP.get(rid)
    if not items:
        return None
    parts = [',\n      resources: [']
    for i, item in enumerate(items):
        comma = ',' if i < len(items)-1 else ''
        parts.append(f'{json.dumps(item, ensure_ascii=False)}{comma}')
    parts.append(']')
    return ''.join(parts)

def build_tools_str(rid):
    """构建 recommendedTools 字符串（仅Defense）"""
    items = DEFENSE_TOOLS.get(rid)
    if not items:
        return None
    parts = [',\n      recommendedTools: [']
    for i, item in enumerate(items):
        comma = ',' if i < len(items)-1 else ''
        parts.append(f'{json.dumps(item, ensure_ascii=False)}{comma}')
    parts.append(']')
    return ''.join(parts)

def build_lab_str(rid):
    """构建 labEnvironment 字符串（仅Defense）"""
    item = DEFENSE_LABS.get(rid)
    if not item:
        return None
    return f',\n      labEnvironment: [{json.dumps(item, ensure_ascii=False)}]'

def insert_content(filepath, day_id, content_str, insert_before='}'):
    """在day对象中插入内容（在最后一个}之前）"""
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    # 找到day对象
    pattern = rf"(id:\s*'{re.escape(day_id)}'.+)"
    m = re.search(pattern, text, re.DOTALL)
    if not m:
        print(f"  [ERROR] 找不到 {day_id}")
        return False

    start = m.start()
    # 从day开始位置查找匹配的 }
    depth = 0
    in_str = False
    escape_next = False
    end_pos = None
    
    for i in range(start, len(text)):
        c = text[i]
        if escape_next:
            escape_next = False
            continue
        if c == '\\':
            escape_next = True
            continue
        if c == '"' or c == "'":
            in_str = not in_str
            continue
        if in_str:
            continue
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                end_pos = i
                break

    if end_pos is None:
        print(f"  [ERROR] 找不到 {day_id} 的结束括号")
        return False

    # 在 } 之前插入
    new_text = text[:end_pos] + content_str + text[end_pos:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_text)
    
    return True


def fix_basic():
    """修复 cyberBasic.ts"""
    fpath = os.path.join(BASE, 'src/data/cyberBasic.ts')
    
    # 1. 为各天添加resources
    for rid in RESOURCE_MAP:
        if not rid.startswith('basic-'):
            continue
        res_str = build_resources_str(rid)
        if res_str:
            if insert_content(fpath, rid, res_str):
                print(f'  {rid}: +resources ({len(RESOURCE_MAP[rid])}条)')

    # 2. basic-1 补充 quiz, expertNotes（如果还没有）
    # basic-1 已有 quiz, expertNotes，检查是否需要补充 codeExamples 等
    # basic-1 已有 codeExamples, labEnvironment, recommendedTools (从读取的数据可见)
    # 只需要补充 quiz（如果没有）和 expertNotes（如果没有）
    # 从数据看 basic-1 已有 quiz 和 expertNotes，所以实际不需要补充
    
    print('Basic修复完成')


def fix_defense():
    """修复 cyberDefense.ts"""
    fpath = os.path.join(BASE, 'src/data/cyberDefense.ts')

    # 1. 添加 resources
    for rid in RESOURCE_MAP:
        if not rid.startswith('def-'):
            continue
        res_str = build_resources_str(rid)
        if res_str:
            if insert_content(fpath, rid, res_str):
                print(f'  {rid}: +resources ({len(RESOURCE_MAP[rid])}条)')

    # 2. 添加 recommendedTools
    for rid in DEFENSE_TOOLS:
        tool_str = build_tools_str(rid)
        if tool_str:
            if insert_content(fpath, rid, tool_str):
                print(f'  {rid}: +recommendedTools ({len(DEFENSE_TOOLS[rid])}个)')

    # 3. 添加 labEnvironment（跳过 def-1 已有）
    for rid in DEFENSE_LABS:
        if rid == 'def-1':
            continue
        lab_str = build_lab_str(rid)
        if lab_str:
            if insert_content(fpath, rid, lab_str):
                print(f'  {rid}: +labEnvironment')

    print('Defense修复完成')


def fix_penetration():
    """修复 cyberPenetration.ts"""
    fpath = os.path.join(BASE, 'src/data/cyberPenetration.ts')

    for rid in RESOURCE_MAP:
        if not rid.startswith('pen-'):
            continue
        res_str = build_resources_str(rid)
        if res_str:
            if insert_content(fpath, rid, res_str):
                print(f'  {rid}: +resources ({len(RESOURCE_MAP[rid])}条)')

    print('Penetration修复完成')


if __name__ == '__main__':
    print('=== 开始修复 ===\n')
    
    print('[Basic]')
    fix_basic()
    
    print('\n[Defense]')
    fix_defense()
    
    print('\n[Penetration]')
    fix_penetration()
    
    print('\n=== 修复完成 ===')
