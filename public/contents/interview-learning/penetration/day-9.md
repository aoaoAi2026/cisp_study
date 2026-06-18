# Day 9：渗透测试工具精通
> [工具面试核心] Nmap/Burp/SQLMap/Metasploit参数与原理/选型场景
## 核心知识点
### Q: Nmap的-sS和-sT区别及选型
-sS(SYN半开)：发SYN→收SYN+ACK→发RST，不完成三次握手。速度更快，不触发应用日志。需root(raw socket)
-sT(Connect)：完整三次握手→RST断开。不需root，但慢且被应用日志记录。在内网无root时使用

高级参数：-sV(服务版本)、-O(OS指纹)、-sC(默认脚本)、--min-rate 1000 -T4(快速扫描)、-Pn(跳过ICMP探测，防火墙后目标必用)
### Q: SQLMap的--os-shell原理和前提条件
原理：利用SQL注入点→INTO OUTFILE将webshell写入Web目录→通过HTTP访问执行OS命令
必要条件(缺一不可)：DBA权限(如MySQL root)、知道Web根目录、目录有写入权限、INTO OUTFILE可用
局限：SELinux/AppArmor限制MySQL写范围、open_basedir限制PHP读路径→现代环境成功率低
### Q: Burp Suite在API测试中的五步法
1. 流量捕获：代理拦截APP/前端API调用→分析Restful/GraphQL
2. 自动扫描：Scanner Active Scan→检测参数级漏洞
3. 篡改参数：Repeater修改JWT的sub字段(IDOR)、分页参数、价格参数
4. 批量测试：Intruder+常见漏洞字典(admin=true/role=admin/price=0)
5. GraphQL：Introspection查询→测试Mutation敏感操作权限→嵌套查询NoSQL注入

插件：JWT Editor/AuthMatrix/Autorize
### Q: Metasploit的Meterpreter vs 普通Reverse Shell
Meterpreter：加密TLS(TLV协议)、stable(多频道+心跳)、文件/进程/截图/提权/hashdump/键盘记录、可迁移Session到其他进程、端口转发打内网、内存运行无文件落地
普通Shell：纯TCP流(Ctrl+C即断)、仅命令行→提升为Meterpreter可用`sessions -u`

面试说：护网中更多用Cobalt Strike因为Beacon比Meterpreter更隐蔽——多种C2协议+Sleep Jitter+Malleable Profile
## 面试陷阱
- 面试时只列举工具不谈方法→说你用Amass/Subfinder/OneForAll做了什么发现才是重点
- Nmap默认-sT -sV太慢→提--min-rate/-T4/--top-ports体现效率意识
- Cobalt Strike不只是钓鱼工具→Beacon是后渗透操作平台

## 今日检测
1. Nmap扫描MetaSploitable2→练习-sS/-sV/-sC/-O组合
2. SQLMap对DVWA做全自动测试(--risk=3 --level=5)
3. Burp Intruder+API字典测试RESTful接口参数
