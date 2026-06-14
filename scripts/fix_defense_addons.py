"""
安全插入 resources, recommendedTools, labEnvironment 到 cyberDefense.ts
策略：在每个 day 对象的 expertNotes 字段前插入新字段
"""
import re, json, os, sys
sys.stdout.reconfigure(encoding='utf-8')

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPATH = os.path.join(BASE, 'src/data/cyberDefense.ts')

# ===== Data: recommendedTools =====
TOOLS = {
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

# ===== Data: labEnvironment (def-2~def-30 only, def-1 already has) =====
LABS = {
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

# ===== Data: resources =====
RES = {
    'def-1': [{'name': 'NIST CSF框架', 'url': 'https://www.nist.gov/cyberframework', 'type': 'article'}, {'name': 'SOC建设指南(FreeBuf)', 'url': 'https://www.freebuf.com/articles/es/267825.html', 'type': 'article'}, {'name': 'SOC分析师技能路线图', 'url': 'https://www.sans.org/security-resources/', 'type': 'article'}, {'name': '安全运营入门(SANS)', 'url': 'https://www.sans.org/white-papers/36812/', 'type': 'article'}],
    'def-2': [{'name': 'Elasticsearch官方文档', 'url': 'https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html', 'type': 'article'}, {'name': 'Logstash入门教程', 'url': 'https://www.elastic.co/guide/en/logstash/current/getting-started-with-logstash.html', 'type': 'article'}, {'name': 'Windows事件ID速查', 'url': 'https://learn.microsoft.com/zh-cn/windows/security/threat-protection/auditing/', 'type': 'article'}],
    'def-3': [{'name': 'ELK Stack部署教程', 'url': 'https://www.elastic.co/guide/en/elastic-stack/current/installing-elastic-stack.html', 'type': 'article'}, {'name': 'Sigma规则仓库', 'url': 'https://github.com/SigmaHQ/sigma', 'type': 'article'}, {'name': 'SIEM告警规则设计指南', 'url': 'https://www.sans.org/white-papers/36812/', 'type': 'article'}],
    'def-4': [{'name': 'Snort用户手册', 'url': 'https://www.snort.org/documents', 'type': 'article'}, {'name': 'Suricata官方文档', 'url': 'https://suricata.readthedocs.io/', 'type': 'article'}, {'name': 'ET规则仓库', 'url': 'https://rules.emergingthreats.net/', 'type': 'article'}],
    'def-5': [{'name': 'MITRE ATT&CK', 'url': 'https://attack.mitre.org/', 'type': 'article'}, {'name': 'Sigma规则编写指南', 'url': 'https://github.com/SigmaHQ/sigma/wiki', 'type': 'article'}, {'name': 'UEBA技术白皮书', 'url': 'https://www.splunk.com/en_us/software/user-behavior-analytics.html', 'type': 'article'}],
    'def-6': [{'name': 'NIST SP 800-61 应急指南', 'url': 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf', 'type': 'article'}, {'name': 'TheHive事件管理', 'url': 'https://thehive-project.org/', 'type': 'article'}, {'name': '事件分级标准', 'url': 'https://www.sans.org/security-resources/', 'type': 'article'}],
    'def-7': [{'name': 'PDCERF流程详解', 'url': 'https://www.nist.gov/cyberframework', 'type': 'article'}, {'name': '应急响应CheckList', 'url': 'https://www.sans.org/security-resources/', 'type': 'article'}, {'name': 'Velociraptor取证指南', 'url': 'https://docs.velociraptor.app/', 'type': 'article'}],
    'def-8': [{'name': 'iptables官方文档', 'url': 'https://www.netfilter.org/documentation/', 'type': 'article'}, {'name': 'pfSense手册', 'url': 'https://docs.netgate.com/pfsense/en/latest/', 'type': 'article'}, {'name': '防火墙策略管理', 'url': 'https://www.sans.org/white-papers/368/', 'type': 'article'}],
    'def-9': [{'name': 'OWASP ModSecurity CRS', 'url': 'https://coreruleset.org/', 'type': 'article'}, {'name': 'WAF部署最佳实践', 'url': 'https://www.cloudflare.com/waf/', 'type': 'article'}, {'name': 'ModSecurity手册', 'url': 'https://github.com/SpiderLabs/ModSecurity/wiki', 'type': 'article'}],
    'def-10': [{'name': 'OpenVPN HOWTO', 'url': 'https://openvpn.net/community-resources/how-to/', 'type': 'article'}, {'name': 'WireGuard快速入门', 'url': 'https://www.wireguard.com/quickstart/', 'type': 'article'}, {'name': '零信任架构(NIST)', 'url': 'https://www.nist.gov/publications/zero-trust-architecture', 'type': 'article'}],
    'def-11': [{'name': 'Snort规则优化指南', 'url': 'https://www.snort.org/documents', 'type': 'article'}, {'name': 'IDS告警分析入门', 'url': 'https://www.freebuf.com/articles/es/258934.html', 'type': 'article'}, {'name': 'Suricata性能调优', 'url': 'https://suricata.readthedocs.io/en/latest/performance/', 'type': 'article'}],
    'def-12': [{'name': 'Cloudflare DDoS防护', 'url': 'https://www.cloudflare.com/learning/ddos/what-is-a-ddos-attack/', 'type': 'article'}, {'name': 'AWS Shield指南', 'url': 'https://aws.amazon.com/shield/', 'type': 'article'}, {'name': 'SYN Cookie原理', 'url': 'https://www.freebuf.com/articles/network/235678.html', 'type': 'article'}],
    'def-13': [{'name': 'DNSSEC部署指南', 'url': 'https://www.cloudflare.com/dns/dnssec/how-dnssec-works/', 'type': 'article'}, {'name': 'DNS安全入门', 'url': 'https://www.cloudflare.com/learning/dns/dns-security/', 'type': 'article'}, {'name': 'DoH/DoT说明', 'url': 'https://developers.cloudflare.com/1.1.1.1/encryption/', 'type': 'article'}],
    'def-14': [{'name': 'CDN安全配置', 'url': 'https://www.cloudflare.com/learning/cdn/what-is-a-cdn/', 'type': 'article'}, {'name': '高可用架构设计', 'url': 'https://www.freebuf.com/articles/es/268934.html', 'type': 'article'}, {'name': '多CDN架构考量', 'url': 'https://www.freebuf.com/articles/es/268934.html', 'type': 'article'}],
    'def-15': [{'name': 'Lynis安全审计', 'url': 'https://cisofy.com/lynis/', 'type': 'article'}, {'name': 'CIS Benchmark', 'url': 'https://www.cisecurity.org/cis-benchmarks/', 'type': 'article'}, {'name': 'RHEL安全加固', 'url': 'https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/security_guide/', 'type': 'article'}],
    'def-16': [{'name': 'BloodHound使用指南', 'url': 'https://github.com/BloodHoundAD/BloodHound/wiki', 'type': 'article'}, {'name': 'AD安全最佳实践', 'url': 'https://learn.microsoft.com/zh-cn/windows-server/identity/ad-ds/plan/security-best-practices/', 'type': 'article'}, {'name': 'PingCastle文档', 'url': 'https://www.pingcastle.com/documentation/', 'type': 'article'}],
    'def-17': [{'name': 'MySQL安全指南', 'url': 'https://dev.mysql.com/doc/refman/8.0/en/security.html', 'type': 'article'}, {'name': 'SQL注入防护速查', 'url': 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html', 'type': 'article'}, {'name': '数据库审计方案', 'url': 'https://www.freebuf.com/articles/database/267890.html', 'type': 'article'}],
    'def-18': [{'name': 'Docker安全文档', 'url': 'https://docs.docker.com/engine/security/', 'type': 'article'}, {'name': 'Trivy容器扫描', 'url': 'https://github.com/aquasecurity/trivy', 'type': 'article'}, {'name': 'K8s安全入门', 'url': 'https://kubernetes.io/docs/concepts/security/', 'type': 'article'}],
    'def-19': [{'name': '云安全共享责任模型', 'url': 'https://www.cloudflare.com/learning/privacy/what-is-the-cloud-shared-responsibility-model/', 'type': 'article'}, {'name': 'AWS安全最佳实践', 'url': 'https://docs.aws.amazon.com/security/', 'type': 'article'}, {'name': 'Prowler安全审计', 'url': 'https://github.com/prowler-cloud/prowler', 'type': 'article'}],
    'def-20': [{'name': 'OWASP API Security', 'url': 'https://owasp.org/www-project-api-security/', 'type': 'article'}, {'name': 'OAuth 2.0安全考量', 'url': 'https://oauth.net/2/security-considerations/', 'type': 'article'}, {'name': 'API网关选型', 'url': 'https://konghq.com/learning-center/', 'type': 'article'}],
    'def-21': [{'name': 'Microsoft SDL实践', 'url': 'https://www.microsoft.com/en-us/securityengineering/sdl', 'type': 'article'}, {'name': 'OWASP威胁建模', 'url': 'https://owasp.org/www-community/Threat_Modeling', 'type': 'article'}, {'name': 'OWASP Top 10 2021', 'url': 'https://owasp.org/www-project-top-ten/', 'type': 'article'}, {'name': 'SAST工具对比', 'url': 'https://www.freebuf.com/articles/es/301234.html', 'type': 'article'}],
    'def-22': [{'name': '等保2.0标准全文', 'url': 'https://www.gov.cn/', 'type': 'article'}, {'name': '等保2.0解读(FreeBuf)', 'url': 'https://www.freebuf.com/articles/es/234567.html', 'type': 'article'}, {'name': 'CIS Benchmark', 'url': 'https://www.cisecurity.org/cis-benchmarks/', 'type': 'article'}, {'name': '等保测评机构名录', 'url': 'https://www.djbh.net/', 'type': 'article'}],
    'def-23': [{'name': '等保整改指南', 'url': 'https://www.freebuf.com/articles/es/289012.html', 'type': 'article'}, {'name': '等保建设方案模板', 'url': 'https://www.freebuf.com/articles/security-management/301456.html', 'type': 'article'}, {'name': 'OpenSCAP合规扫描', 'url': 'https://www.open-scap.org/', 'type': 'article'}],
    'def-24': [{'name': 'NIST SP 800-30', 'url': 'https://csrc.nist.gov/publications/detail/sp/800-30/rev-1/final', 'type': 'article'}, {'name': 'FRAP方法论', 'url': 'https://www.freebuf.com/articles/es/267890.html', 'type': 'article'}, {'name': 'FAIR风险量化', 'url': 'https://www.fairinstitute.org/', 'type': 'article'}],
    'def-25': [{'name': 'NIST SP 800-34', 'url': 'https://csrc.nist.gov/publications/detail/sp/800-34/rev-1/final', 'type': 'article'}, {'name': '灾备演练指南', 'url': 'https://www.freebuf.com/articles/es/245678.html', 'type': 'article'}, {'name': '备份恢复最佳实践', 'url': 'https://www.freebuf.com/articles/network/256789.html', 'type': 'article'}],
    'def-26': [{'name': 'NIST CSF框架', 'url': 'https://www.nist.gov/cyberframework', 'type': 'article'}, {'name': '安全策略编写指南', 'url': 'https://www.sans.org/security-resources/policies/', 'type': 'article'}, {'name': '密码策略(NIST)', 'url': 'https://pages.nist.gov/800-63-3/sp800-63b.html', 'type': 'article'}],
    'def-27': [{'name': 'Gophish文档', 'url': 'https://getgophish.com/documentation/', 'type': 'article'}, {'name': '安全意识培训(SANS)', 'url': 'https://www.sans.org/security-awareness-training/', 'type': 'article'}, {'name': '社会工程防御', 'url': 'https://www.freebuf.com/articles/es/278934.html', 'type': 'article'}],
    'def-28': [{'name': 'Atomic Red Team', 'url': 'https://github.com/redcanaryco/atomic-red-team/wiki', 'type': 'article'}, {'name': 'ATT&CK对抗模拟', 'url': 'https://attack.mitre.org/resources/adversary-emulation/', 'type': 'article'}, {'name': 'Caldera平台', 'url': 'https://github.com/mitre/caldera', 'type': 'article'}],
    'def-29': [{'name': 'MISP项目文档', 'url': 'https://www.circl.lu/doc/misp/', 'type': 'article'}, {'name': 'VirusTotal API', 'url': 'https://developers.virustotal.com/', 'type': 'article'}, {'name': '威胁情报入门', 'url': 'https://www.freebuf.com/articles/es/278934.html', 'type': 'article'}],
    'def-30': [{'name': 'Wazuh部署指南', 'url': 'https://documentation.wazuh.com/', 'type': 'article'}, {'name': 'SOC建设白皮书', 'url': 'https://www.sans.org/security-resources/', 'type': 'article'}, {'name': '安全运营KPI', 'url': 'https://www.freebuf.com/articles/security-management/289012.html', 'type': 'article'}],
}

def mkj(items):
    """构建 JSON 数组字符串"""
    return '[' + ','.join(json.dumps(it, ensure_ascii=False) for it in items) + ']'

def process_day(day_id):
    with open(FPATH, 'r', encoding='utf-8') as f:
        text = f.read()
    
    # 找到该 day 的 expertNotes 位置
    pattern = rf"(id:\s*'{day_id}'.+?)expertNotes:"
    m = re.search(pattern, text, re.DOTALL)
    if not m:
        print(f'  {day_id}: 未找到expertNotes')
        return
    
    insert_pos = m.end() - len('expertNotes:')
    parts = []
    
    # resources
    if day_id in RES:
        parts.append(f'resources: {mkj(RES[day_id])}')
    
    # recommendedTools
    if day_id in TOOLS:
        parts.append(f'recommendedTools: {mkj(TOOLS[day_id])}')
    
    # labEnvironment (skip def-1)
    if day_id != 'def-1' and day_id in LABS:
        parts.append(f'labEnvironment: {mkj([LABS[day_id]])}')
    
    if not parts:
        return
    
    insert_str = ',\n      '.join(parts) + ',\n      '
    new_text = text[:insert_pos] + insert_str + text[insert_pos:]
    
    with open(FPATH, 'w', encoding='utf-8') as f:
        f.write(new_text)
    
    labels = []
    if day_id in RES: labels.append('res')
    if day_id in TOOLS: labels.append('tools')
    if day_id != 'def-1' and day_id in LABS: labels.append('lab')
    print('  {}: {}'.format(day_id, '+'.join(labels)))

if __name__ == '__main__':
    print('=== Defense 补全: resources + recommendedTools + labEnvironment ===\n')
    for i in range(1, 31):
        process_day(f'def-{i}')
    print('\n=== 完成 ===')
