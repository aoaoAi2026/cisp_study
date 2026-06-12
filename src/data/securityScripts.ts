// 网络安全脚本仓库
export interface SecurityScript {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  language: string;
  platform: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  author: string;
  features: string[];
  requirements: string[];
  installation: string;
  usage: string;
  steps: ScriptStep[];
  examples: ScriptExample[];
  tips: string[];
  warnings: string[];
  tags: string[];
}

export interface ScriptStep {
  title: string;
  description: string;
  command?: string;
  code?: string;
  note?: string;
}

export interface ScriptExample {
  title: string;
  input: string;
  output: string;
  explanation: string;
}

export const securityScripts: SecurityScript[] = [
  // ==================== 信息收集类 ====================
  {
    id: 'subdomain-enum',
    name: '子域名枚举脚本',
    description: '自动化收集目标域名的所有子域名，支持多种数据源',
    category: '信息收集',
    subcategory: '域名枚举',
    language: 'Python',
    platform: ['Linux', 'Windows', 'macOS'],
    difficulty: 'medium',
    author: '安全研究',
    features: [
      '多数据源枚举（DNSdumpster, VirusTotal, CertSpotter等）',
      '暴力破解子域名',
      'DNS区域传输检测',
      '子域名接管检测',
      '结果去重和过滤'
    ],
    requirements: ['Python 3.8+', 'requests库', 'dnspython库'],
    installation: 'pip install -r requirements.txt',
    usage: 'python subdomains.py -d target.com -o output.txt',
    steps: [
      {
        title: '安装依赖',
        description: '安装脚本运行所需的Python库',
        command: 'pip install requests dnspython argparse'
      },
      {
        title: '准备目标域名',
        description: '确定要枚举的目标域名',
        note: '确保你有权限对该域名进行信息收集'
      },
      {
        title: '运行脚本',
        description: '使用目标域名运行脚本',
        command: 'python subdomains.py -d example.com'
      },
      {
        title: '保存结果',
        description: '将结果保存到文件',
        command: 'python subdomains.py -d example.com -o subdomains.txt'
      }
    ],
    examples: [
      {
        title: '基础枚举',
        input: 'python subdomains.py -d baidu.com',
        output: '[+] Found 23 subdomains:\n  - www.baidu.com\n  - mail.baidu.com\n  - admin.baidu.com\n  ...',
        explanation: '使用基础参数枚举百度域名'
      },
      {
        title: '深度扫描',
        input: 'python subdomains.py -d baidu.com --brute --threads 50',
        output: '[+] Brute force mode enabled\n[+] Found 45 subdomains (including 22 from brute force)',
        explanation: '启用暴力破解模式，增加线程数提高速度'
      }
    ],
    tips: [
      '结合多个数据源可以提高发现率',
      '暴力破解需要配合高质量字典',
      '注意请求频率避免被封禁IP',
      '结果需要人工验证'
    ],
    warnings: [
      '仅用于授权的安全测试',
      '遵守目标网站的使用条款',
      '不要过度频繁请求目标服务器'
    ],
    tags: ['子域名', '枚举', '信息收集', 'DNS']
  },

  {
    id: 'port-scanner',
    name: '高级端口扫描器',
    description: '多线程TCP/UDP端口扫描，支持服务识别和操作系统检测',
    category: '信息收集',
    subcategory: '端口扫描',
    language: 'Python',
    platform: ['Linux', 'macOS'],
    difficulty: 'hard',
    author: '渗透测试',
    features: [
      'TCP SYN/Connect扫描',
      'UDP端口扫描',
      '服务版本检测',
      '操作系统指纹识别',
      '绕过防火墙检测'
    ],
    requirements: ['Python 3.8+', 'scapy库', 'nmap（可选）'],
    installation: 'pip install scapy requests',
    usage: 'python portscan.py -t 192.168.1.1 -p 1-1000',
    steps: [
      {
        title: '安装Scapy',
        description: 'Scapy是强大的网络数据包处理库',
        command: 'pip install scapy'
      },
      {
        title: '基本扫描',
        description: '对目标IP进行常用端口扫描',
        command: 'python portscan.py -t 192.168.1.1'
      },
      {
        title: '全端口扫描',
        description: '扫描所有65535个端口',
        command: 'python portscan.py -t 192.168.1.1 -p 1-65535'
      },
      {
        title: '服务识别',
        description: '识别开放端口上运行的服务',
        command: 'python portscan.py -t 192.168.1.1 --service-detect'
      }
    ],
    examples: [
      {
        title: '快速扫描常用端口',
        input: 'python portscan.py -t 10.0.0.1 -p top-100',
        output: '[+] Scanning 10.0.0.1...\n[+] Open ports: 22(SSH), 80(HTTP), 443(HTTPS)\n[+] Scan completed in 5.2s',
        explanation: '使用内置的Top100端口列表快速扫描'
      }
    ],
    tips: [
      '扫描前确保有授权',
      '调整线程数避免被防火墙拦截',
      'UDP扫描较慢，建议单独使用'
    ],
    warnings: [
      '未经授权的端口扫描是违法行为',
      '扫描可能导致目标系统不稳定'
    ],
    tags: ['端口扫描', '网络扫描', '渗透测试']
  },

  {
    id: 'web-crawler',
    name: 'Web目录爬虫',
    description: '递归爬取Web目录，发现隐藏的管理后台和敏感文件',
    category: '信息收集',
    subcategory: 'Web爬虫',
    language: 'Python',
    platform: ['Linux', 'Windows', 'macOS'],
    difficulty: 'medium',
    author: 'Web安全',
    features: [
      '多线程爬取',
      '自定义字典',
      '递归目录发现',
      '响应码分析',
      '敏感文件检测'
    ],
    requirements: ['Python 3.8+', 'requests库', 'beautifulsoup4'],
    installation: 'pip install requests beautifulsoup4',
    usage: 'python dirscan.py -u http://target.com -w wordlist.txt',
    steps: [
      {
        title: '准备目录字典',
        description: '使用高质量的目录名字典',
        command: 'gobuster dir -u http://target.com -w common.txt'
      },
      {
        title: '启动爬虫',
        description: '对目标网站进行目录扫描',
        command: 'python dirscan.py -u http://example.com'
      },
      {
        title: '分析结果',
        description: '查找返回200状态码的目录',
        note: '重点关注/admin、/backup、/api等目录'
      }
    ],
    examples: [
      {
        title: '基础目录扫描',
        input: 'python dirscan.py -u http://testphp.vulnweb.com',
        output: '[200] http://testphp.vulnweb.com/admin/\n[200] http://testphp.vulnweb.com/login.php\n[403] http://testphp.vulnweb.com/.git/',
        explanation: '扫描常见目录和文件'
      }
    ],
    tips: [
      '结合多个字典使用效果更好',
      '注意区分大小写',
      '403不代表没有内容'
    ],
    warnings: [
      '禁止扫描政府、教育机构网站',
      '大量请求可能被视为DDoS攻击'
    ],
    tags: ['目录扫描', 'Web安全', '爬虫']
  },

  // ==================== 漏洞检测类 ====================
  {
    id: 'sql-injection-scanner',
    name: 'SQL注入检测器',
    description: '自动检测Web应用中的SQL注入漏洞，支持多种注入技术',
    category: '漏洞检测',
    subcategory: '注入漏洞',
    language: 'Python',
    platform: ['Linux', 'Windows', 'macOS'],
    difficulty: 'hard',
    author: '渗透测试',
    features: [
      'GET/POST参数检测',
      'Cookie注入检测',
      'Header注入检测',
      '布尔盲注',
      '时间盲注',
      'UNION联合查询'
    ],
    requirements: ['Python 3.8+', 'requests库'],
    installation: 'pip install requests colorama',
    usage: 'python sqlscan.py -u "http://target.com/page?id=1"',
    steps: [
      {
        title: '识别注入点',
        description: '通过添加单引号测试参数是否可注入',
        command: 'python sqlscan.py -u "http://target.com/product.php?id=5" --test'
      },
      {
        title: '完整扫描',
        description: '对所有参数进行全面检测',
        command: 'python sqlscan.py -u "http://target.com/search.php" --full-scan'
      },
      {
        title: '验证漏洞',
        description: '使用手工测试确认漏洞存在',
        command: "curl 'http://target.com/page?id=5' 2>&1 | grep 'error'"
      }
    ],
    examples: [
      {
        title: '检测GET参数',
        input: "python sqlscan.py -u 'http://testphp.vulnweb.com/list.php?cat=1'",
        output: '[!] Potential SQLi found in parameter: cat\n[+] Payload: cat=1\' OR \'1\'=\'1\n[+] Confirming with boolean-based injection...',
        explanation: '检测URL中的cat参数是否存在SQL注入'
      }
    ],
    tips: [
      '先测试单个参数，再全面扫描',
      '注意区分false positive',
      '手工验证比工具更可靠'
    ],
    warnings: [
      'SQL注入是严重违法行为',
      '仅在授权环境中测试',
      '不要修改或删除数据库数据'
    ],
    tags: ['SQL注入', '漏洞检测', '渗透测试']
  },

  {
    id: 'xss-detector',
    name: 'XSS漏洞扫描器',
    description: '自动检测跨站脚本(XSS)漏洞，支持多种XSS类型',
    category: '漏洞检测',
    subcategory: 'XSS漏洞',
    language: 'Python',
    platform: ['Linux', 'Windows', 'macOS'],
    difficulty: 'medium',
    author: 'Web安全',
    features: [
      '反射型XSS检测',
      '存储型XSS检测',
      'DOM型XSS检测',
      '多种绕过技术',
      '自动验证'
    ],
    requirements: ['Python 3.8+', 'requests库', 'selenium（可选）'],
    installation: 'pip install requests beautifulsoup4',
    usage: 'python xssscan.py -u "http://target.com/search?q=test"',
    steps: [
      {
        title: '准备测试URL',
        description: '识别所有可输入参数',
        command: 'python xssscan.py -u "http://target.com/page.php?param1=value1&param2=value2"'
      },
      {
        title: '启用绕过模式',
        description: '使用编码和混淆技术绕过过滤器',
        command: 'python xssscan.py -u "http://target.com/input" --bypass --level high'
      },
      {
        title: '完整扫描',
        description: '扫描所有链接和表单',
        command: 'python xssscan.py -u "http://target.com" --crawl --max-depth 3'
      }
    ],
    examples: [
      {
        title: '基本XSS检测',
        input: "python xssscan.py -u 'http://testphp.vulnweb.com/search.php?test=search'",
        output: '[!] Reflected XSS found in parameter: test\n[+] Payload: <script>alert(document.cookie)</script>\n[+] Confirmed: Cookie is reflected in response',
        explanation: '检测到反射型XSS漏洞'
      }
    ],
    tips: [
      'XSS过滤器可能被绕过',
      '存储型XSS需要验证持久性',
      '使用多种Payload测试'
    ],
    warnings: [
      'XSS测试可能影响用户会话',
      '不要在生产环境测试',
      '存储型XSS危害最大'
    ],
    tags: ['XSS', '跨站脚本', '漏洞检测']
  },

  {
    id: 'vulnerability-scanner',
    name: '综合漏洞扫描器',
    description: '基于Nuclei模板的综合漏洞扫描，支持自定义POC',
    category: '漏洞检测',
    subcategory: '综合扫描',
    language: 'Go',
    platform: ['Linux', 'Windows', 'macOS'],
    difficulty: 'medium',
    author: '社区维护',
    features: [
      '1000+漏洞模板',
      'CVE漏洞检测',
      '自定义POC支持',
      '结果导出',
      'API集成'
    ],
    requirements: ['Go 1.18+'],
    installation: 'go install -v github.com/projectdiscovery/nuclei/v2/cmd/nuclei@latest',
    usage: 'nuclei -u http://target.com',
    steps: [
      {
        title: '安装Nuclei',
        description: '使用Go安装Nuclei扫描器',
        command: 'go install -v github.com/projectdiscovery/nuclei/v2/cmd/nuclei@latest'
      },
      {
        title: '更新模板',
        description: '下载最新的漏洞检测模板',
        command: 'nuclei -update-templates'
      },
      {
        title: '基本扫描',
        description: '对目标URL进行漏洞扫描',
        command: 'nuclei -u http://target.com'
      },
      {
        title: '批量扫描',
        description: '从文件读取多个目标',
        command: 'nuclei -l targets.txt -o results.txt'
      },
      {
        title: '指定模板',
        description: '只扫描特定类型的漏洞',
        command: 'nuclei -u http://target.com -t vulnerabilities/cves/'
      }
    ],
    examples: [
      {
        title: 'CVE漏洞检测',
        input: 'nuclei -u http://target.com -t cves/',
        output: '[CVE-2021-44228] http://target.com:8080/\n[INFO] [cve-2021-44228] Apache Log4j RCE\n[CRITICAL] Host is vulnerable to Log4j RCE',
        explanation: '检测目标是否存在已知CVE漏洞'
      },
      {
        title: '技术栈检测',
        input: 'nuclei -u http://target.com -t technologies/',
        output: '[tech] http://target.com\n[+] Detected: WordPress 5.8.1\n[+] Detected: jQuery 3.6.0\n[+] Detected: Apache 2.4.48',
        explanation: '识别目标网站使用的技术栈'
      }
    ],
    tips: [
      '定期更新模板库',
      '使用-tags过滤减少误报',
      '结合其他工具使用效果更好'
    ],
    warnings: [
      '扫描可能触发安全设备告警',
      '高危漏洞验证需谨慎',
      '遵守授权范围'
    ],
    tags: ['漏洞扫描', 'CVE', 'POC', '综合检测']
  },

  // ==================== 密码攻击类 ====================
  {
    id: 'password-generator',
    name: '社工密码生成器',
    description: '基于社工信息生成个性化密码字典，用于密码破解测试',
    category: '密码攻击',
    subcategory: '密码生成',
    language: 'Python',
    platform: ['Linux', 'Windows', 'macOS'],
    difficulty: 'easy',
    author: '社会工程',
    features: [
      '基于规则生成',
      '人名+生日组合',
      '公司名+年份组合',
      '键盘路径生成',
      'LeetSpeak转换'
    ],
    requirements: ['Python 3.8+'],
    installation: '无需安装，Python内置库即可运行',
    usage: 'python password_generator.py -n "张三" -y 1990 -c "公司名"',
    steps: [
      {
        title: '收集信息',
        description: '收集目标的社工信息（姓名、生日、公司等）',
        note: '可以通过OSINT手段收集'
      },
      {
        title: '生成密码',
        description: '使用收集的信息生成密码字典',
        command: 'python password_generator.py -n "张三" -y 1990 -c "公司名" -o passwords.txt'
      },
      {
        title: '扩展字典',
        description: '使用LeetSpeak转换增加变体',
        command: 'python password_generator.py -n "张三" --leet --combinations -o passwords.txt'
      }
    ],
    examples: [
      {
        title: '基础生成',
        input: "python password_generator.py -n '张三' -y 1990",
        output: 'Generated 150 passwords:\n  - zhangsan1990\n  - zhang1990san\n  - 1990zhangsan\n  - zhangsan90\n  ...',
        explanation: '基于姓名和出生年生成密码'
      },
      {
        title: '高级生成',
        input: "python password_generator.py -n '张三' -y 1990 -c '公司名' --leet",
        output: 'Generated 520 passwords:\n  - zhangsan@1990\n  - Z#ng$an1990\n  - 公司名zhangsan1990\n  ...',
        explanation: '包含公司名和LeetSpeak转换'
      }
    ],
    tips: [
      '信息越多生成的密码越准确',
      '结合目标社交媒体信息效果更好',
      '密码顺序按可能性排列'
    ],
    warnings: [
      '密码破解需要授权',
      '社工行为涉及法律风险',
      '不要用于非法目的'
    ],
    tags: ['密码生成', '社会工程', '密码破解']
  },

  {
    id: 'hash-cracker',
    name: '哈希破解工具',
    description: '支持多种哈希算法的在线/离线破解工具',
    category: '密码攻击',
    subcategory: '哈希破解',
    language: 'Python',
    platform: ['Linux', 'Windows', 'macOS'],
    difficulty: 'medium',
    author: '密码研究',
    features: [
      'MD5/SHA1/SHA256破解',
      '字典攻击',
      '暴力破解（有限长度）',
      '查表攻击',
      'GPU加速支持'
    ],
    requirements: ['Python 3.8+', 'hashlib（内置）', 'pycuda（可选GPU加速）'],
    installation: 'pip install pycryptodome',
    usage: 'python hash_cracker.py -h "5f4dcc3b5aa765d61d8327deb882cf99" -w passwords.txt',
    steps: [
      {
        title: '识别哈希类型',
        description: '确定哈希的算法和长度',
        command: 'python hash_cracker.py --identify "5f4dcc3b5aa765d61d8327deb882cf99"'
      },
      {
        title: '字典攻击',
        description: '使用密码字典破解哈希',
        command: 'python hash_cracker.py -H md5 -h "哈希值" -w wordlist.txt'
      },
      {
        title: '在线查询',
        description: '使用在线哈希数据库查询',
        command: 'python hash_cracker.py --online "哈希值"'
      }
    ],
    examples: [
      {
        title: '识别哈希类型',
        input: "python hash_cracker.py --identify '5f4dcc3b5aa765d61d8327deb882cf99'",
        output: '[+] Hash length: 32 characters\n[+] Identified: MD5\n[+] Hash: 5f4dcc3b5aa765d61d8327deb882cf99\n[+] Cracking with dictionary...',
        explanation: '自动识别哈希算法类型'
      }
    ],
    tips: [
      '常用密码破解率最高',
      '结合彩虹表提高效率',
      'GPU加速可大幅提升速度'
    ],
    warnings: [
      '破解他人密码违法',
      '不要存储破解的密码',
      '在线查询可能泄露哈希'
    ],
    tags: ['哈希破解', '密码破解', 'MD5', 'SHA']
  },

  // ==================== 无线安全类 ====================
  {
    id: 'wifi-scanner',
    name: 'WiFi扫描与分析工具',
    description: '发现附近WiFi网络，分析加密方式，检测潜在风险',
    category: '无线安全',
    subcategory: 'WiFi扫描',
    language: 'Python',
    platform: ['Linux'],
    difficulty: 'hard',
    author: '无线安全',
    features: [
      'WiFi网络发现',
      '信号强度分析',
      '加密方式识别',
      '客户端设备扫描',
      '恶意热点检测'
    ],
    requirements: ['Python 3.8+', 'scapy库', '无线网卡（监听模式）'],
    installation: 'pip install scapy pandas',
    usage: 'sudo python wifi_scanner.py',
    steps: [
      {
        title: '设置监听模式',
        description: '将无线网卡设置为监听模式',
        command: 'sudo airmon-ng start wlan0'
      },
      {
        title: '扫描WiFi',
        description: '发现周围所有WiFi网络',
        command: 'sudo python wifi_scanner.py --scan'
      },
      {
        title: '分析结果',
        description: '查看扫描到的网络列表',
        command: 'python wifi_scanner.py --show'
      }
    ],
    examples: [
      {
        title: '发现WiFi网络',
        input: 'sudo python wifi_scanner.py --scan --duration 60',
        output: '[+] Scanning for 60 seconds...\n[+] Found 15 WiFi networks:\n  Network: FreeWiFi (Open)\n  Network: HomeNetwork (WPA2) Signal: -45dBm\n  Network: HiddenNet (WPA2) Signal: -67dBm',
        explanation: '扫描周围WiFi网络并显示信号强度'
      }
    ],
    tips: [
      '5GHz频段可能扫描不到',
      '信号强度不等于安全性',
      '隐藏SSID不等于安全'
    ],
    warnings: [
      '未授权WiFi破解违法',
      '只能在自有网络上测试',
      '监听模式需要root权限'
    ],
    tags: ['WiFi', '无线安全', '网络扫描']
  },

  // ==================== 逆向工程类 ====================
  {
    id: 'malware-analyser',
    name: '恶意软件分析器',
    description: '静态分析可执行文件，提取特征和行为模式',
    category: '逆向工程',
    subcategory: '恶意软件分析',
    language: 'Python',
    platform: ['Linux', 'Windows'],
    difficulty: 'hard',
    author: '恶意软件研究',
    features: [
      'PE/Mach-O/ELF分析',
      '字符串提取',
      '导入表分析',
      '病毒扫描集成',
      '熵值计算'
    ],
    requirements: ['Python 3.8+', 'yara（可选）', 'pefile库'],
    installation: 'pip install pefile yara-python stringsreader',
    usage: 'python malware_analyzer.py -f sample.exe',
    steps: [
      {
        title: '安装依赖',
        description: '安装PE分析所需的库',
        command: 'pip install pefile yara-python'
      },
      {
        title: '基础分析',
        description: '对样本进行静态分析',
        command: 'python malware_analyzer.py -f suspicious.exe'
      },
      {
        title: '深度扫描',
        description: '使用Yara规则进行模式匹配',
        command: 'python malware_analyzer.py -f sample.exe --scan --rules malware_rules.yar'
      },
      {
        title: '提取IoC',
        description: '提取可执行的指标',
        command: 'python malware_analyzer.py -f sample.exe --ioc'
      }
    ],
    examples: [
      {
        title: 'PE文件分析',
        input: 'python malware_analyzer.py -f trojan.exe',
        output: '[+] File: trojan.exe (Size: 156KB)\n[+] Entropy: 7.2 (Suspicious - high entropy)\n[+] PE Sections: .text, .rdata, .data, .rsrc\n[+] Import APIs: CreateProcess, InternetOpen, URLDownload\n[+] Strings found: 23 suspicious URLs, 5 IP addresses',
        explanation: '分析PE文件并提取关键信息'
      }
    ],
    tips: [
      '高熵值通常表示加壳',
      '注意可疑的API调用',
      '结合VirusTotal确认'
    ],
    warnings: [
      '在隔离环境中分析',
      '不要在真实系统运行样本',
      '做好防护措施'
    ],
    tags: ['恶意软件', '逆向分析', 'PE分析']
  },

  {
    id: 'de-obfuscator',
    name: 'JavaScript混淆代码解混淆器',
    description: '自动分析和还原被混淆的JavaScript代码',
    category: '逆向工程',
    subcategory: '代码解混淆',
    language: 'JavaScript',
    platform: ['Linux', 'Windows', 'macOS'],
    difficulty: 'medium',
    author: 'Web安全',
    features: [
      '变量名还原',
      '字符串解密',
      '控制流平坦化还原',
      '数组还原',
      '表达式简化'
    ],
    requirements: ['Node.js 14+'],
    installation: 'npm install -g js-deobfuscator',
    usage: 'node deobfuscator.js input.js output.js',
    steps: [
      {
        title: '安装工具',
        description: '全局安装解混淆工具',
        command: 'npm install -g js-beautify js-xpath esprima'
      },
      {
        title: '美化代码',
        description: '先格式化混淆代码',
        command: 'js-beautify obfuscated.js > formatted.js'
      },
      {
        title: '解混淆',
        description: '执行解混淆处理',
        command: 'node deobfuscator.js formatted.js -o clean.js'
      },
      {
        title: '分析结果',
        description: '查看解混淆后的代码',
        command: 'cat clean.js | head -50'
      }
    ],
    examples: [
      {
        title: '基础解混淆',
        input: 'node deobfuscator.js malicious.js',
        output: '[+] Parsing JavaScript...\n[+] Detected obfuscation: String encoding + Array shuffle\n[+] Deobfuscating...\n[+] Output saved to: deobfuscated.js',
        explanation: '对混淆的JS代码进行解混淆'
      }
    ],
    tips: [
      '有些混淆无法完全还原',
      '结合动态分析效果更好',
      '注意代码中的恶意逻辑'
    ],
    warnings: [
      '不要执行未确认的代码',
      '恶意代码可能造成危害',
      '遵守相关法律法规'
    ],
    tags: ['JavaScript', '混淆', '解混淆', 'Web安全']
  },

  // ==================== 应急响应类 ====================
  {
    id: 'log-analyser',
    name: '日志分析器',
    description: '自动分析系统日志，发现安全威胁和异常行为',
    category: '应急响应',
    subcategory: '日志分析',
    language: 'Python',
    platform: ['Linux', 'Windows'],
    difficulty: 'medium',
    author: '安全运维',
    features: [
      '多日志格式支持',
      '异常行为检测',
      '攻击模式匹配',
      '时间线分析',
      '报告生成'
    ],
    requirements: ['Python 3.8+', 'pandas库', '正则表达式'],
    installation: 'pip install pandas matplotlib',
    usage: 'python log_analyzer.py -f /var/log/auth.log',
    steps: [
      {
        title: '收集日志',
        description: '收集需要分析的日志文件',
        command: 'sudo python log_analyzer.py -f /var/log/auth.log --from "2024-01-01" --to "2024-01-31"'
      },
      {
        title: '执行分析',
        description: '运行自动化分析',
        command: 'python log_analyzer.py -f auth.log --analyze'
      },
      {
        title: '生成报告',
        description: '输出详细的分析报告',
        command: 'python log_analyzer.py -f auth.log --report -o analysis.html'
      },
      {
        title: '威胁检测',
        description: '检测已知攻击模式',
        command: 'python log_analyzer.py -f auth.log --threats'
      }
    ],
    examples: [
      {
        title: 'SSH暴力破解检测',
        input: 'python log_analyzer.py -f auth.log --pattern ssh_bruteforce',
        output: '[+] Analyzing SSH logs...\n[!] Alert: Possible SSH brute force attack\n[+] Source IPs:\n  - 192.168.1.100 (300+ failed attempts)\n  - 10.0.0.50 (150+ failed attempts)\n[+] Time range: 2024-01-15 02:00 - 04:30',
        explanation: '从SSH日志中检测暴力破解攻击'
      }
    ],
    tips: [
      '日志时间同步很重要',
      '结合多种日志源分析',
      '定期备份和分析日志'
    ],
    warnings: [
      '需要足够的日志存储空间',
      '敏感日志注意保密',
      '分析结果需要验证'
    ],
    tags: ['日志分析', '应急响应', '威胁检测']
  },

  {
    id: 'memory-forensics',
    name: '内存取证工具',
    description: '从内存转储中提取安全事件和恶意行为证据',
    category: '应急响应',
    subcategory: '内存取证',
    language: 'Python',
    platform: ['Linux', 'Windows'],
    difficulty: 'hard',
    author: '数字取证',
    features: [
      '进程分析',
      '网络连接检查',
      '恶意进程检测',
      '密码提取',
      '加密密钥恢复'
    ],
    requirements: ['Python 3.8+', 'volatility3', '内存镜像文件'],
    installation: 'pip install volatility3 yara-python',
    usage: 'python memory_forensics.py -f memory.dmp --profile Win10',
    steps: [
      {
        title: '获取内存镜像',
        description: '使用工具获取目标系统内存',
        command: 'sudo python memory_dump.py -o memory.dmp'
      },
      {
        title: '识别系统配置',
        description: '确定内存镜像的操作系统',
        command: 'python vol.py -f memory.dmp windows.info'
      },
      {
        title: '进程分析',
        description: '列出所有运行的进程',
        command: 'python vol.py -f memory.dmp windows.pslist'
      },
      {
        title: '网络连接',
        description: '查看进程的网络连接',
        command: 'python vol.py -f memory.dmp windows.netscan'
      },
      {
        title: '恶意软件检测',
        description: '使用Yara规则扫描',
        command: 'python vol.py -f memory.dmp yarascan -Y "malware_rule.yar"'
      }
    ],
    examples: [
      {
        title: '进程分析',
        input: 'python vol.py -f memory.dmp windows.pslist',
        output: 'Offset(P)  Name                PID    PPID   Threads  Handles\n---------- -------------------- ------ ------ -------- ---------\n0x...      explorer.exe         1232   1008      45     1200\n0x...      chrome.exe           4521   1232      25      800\n0x...      powershell.exe       7890   4000      12      450  <- Suspicious',
        explanation: '分析内存中的进程列表'
      }
    ],
    tips: [
      '内存获取要及时',
      '不同系统profile不同',
      '结合网络流量分析'
    ],
    warnings: [
      '需要管理员权限',
      '内存镜像需要妥善保管',
      '作为法律证据需要完整性校验'
    ],
    tags: ['内存取证', '数字取证', '应急响应', 'Volatility']
  },

  // ==================== 数据包分析类 ====================
  {
    id: 'pcap-analyser',
    name: 'PCAP数据包分析器',
    description: '分析网络流量包，发现攻击行为和异常通信',
    category: '数据包分析',
    subcategory: '流量分析',
    language: 'Python',
    platform: ['Linux', 'Windows', 'macOS'],
    difficulty: 'medium',
    author: '网络分析',
    features: [
      '协议分析',
      '会话重建',
      '文件提取',
      '恶意流量检测',
      '统计报告'
    ],
    requirements: ['Python 3.8+', 'scapy库', 'dpkt库'],
    installation: 'pip install scapy dpkt pandas',
    usage: 'python pcap_analyzer.py -f capture.pcap',
    steps: [
      {
        title: '捕获流量',
        description: '使用tcpdump或Wireshark捕获流量',
        command: 'sudo tcpdump -i eth0 -w capture.pcap'
      },
      {
        title: '基础分析',
        description: '分析PCAP文件的基本统计',
        command: 'python pcap_analyzer.py -f capture.pcap --stats'
      },
      {
        title: '协议分析',
        description: '按协议分类统计',
        command: 'python pcap_analyzer.py -f capture.pcap --protocols'
      },
      {
        title: '提取文件',
        description: '从流量中提取传输的文件',
        command: 'python pcap_analyzer.py -f capture.pcap --extract-files'
      },
      {
        title: '威胁检测',
        description: '检测恶意流量模式',
        command: 'python pcap_analyzer.py -f capture.pcap --detect-threats'
      }
    ],
    examples: [
      {
        title: 'HTTP流量分析',
        input: 'python pcap_analyzer.py -f capture.pcap --protocol http',
        output: '[+] HTTP Traffic Analysis\n[+] Total HTTP requests: 245\n[+] Top endpoints:\n  /login.php (POST) - 45 requests\n  /api/data (GET) - 120 requests\n[+] Suspicious: /admin/backup.sql detected',
        explanation: '分析HTTP流量并发现可疑端点'
      }
    ],
    tips: [
      '大文件PCAP需要高性能设备',
      '加密流量只能看到元数据',
      '结合Zeek分析效果更好'
    ],
    warnings: [
      '捕获流量可能涉及隐私',
      '敏感网络需要授权',
      '不要在生产环境大规模抓包'
    ],
    tags: ['流量分析', 'PCAP', '网络分析', 'Wireshark']
  },

  {
    id: 'network-recon',
    name: '网络侦察脚本',
    description: '自动化收集网络情报，发现潜在攻击面',
    category: '信息收集',
    subcategory: '网络侦察',
    language: 'Bash',
    platform: ['Linux', 'macOS'],
    difficulty: 'easy',
    author: '渗透测试',
    features: [
      '多维度扫描',
      '服务指纹识别',
      '漏洞探测',
      '报告生成'
    ],
    requirements: ['Bash', 'nmap', 'curl', 'whois'],
    installation: '#!/bin/bash # 依赖系统工具',
    usage: './network_recon.sh target.com',
    steps: [
      {
        title: '准备脚本',
        description: '创建并赋予执行权限',
        command: 'chmod +x network_recon.sh'
      },
      {
        title: '执行侦察',
        description: '对目标进行全面侦察',
        command: './network_recon.sh target.com'
      },
      {
        title: '查看报告',
        description: '查看生成的侦察报告',
        command: 'cat target.com_recon_report.txt'
      }
    ],
    examples: [
      {
        title: '基础侦察',
        input: './network_recon.sh example.com',
        output: '[*] Starting reconnaissance for example.com\n[*] Phase 1: DNS enumeration\n[+] Found 15 subdomains\n[*] Phase 2: Port scanning\n[+] Open ports: 22, 80, 443, 3306\n[*] Phase 3: Service detection\n[+] Services: SSH, Apache, MySQL\n[*] Report saved to: example.com_recon_report.txt',
        explanation: '执行完整的网络侦察流程'
      }
    ],
    tips: [
      '侦察是渗透测试的第一步',
      '收集的信息越多越好',
      '注意被动收集vs主动收集'
    ],
    warnings: [
      '主动扫描需要授权',
      '被动收集也可能被发现',
      '遵守规则和范围'
    ],
    tags: ['侦察', '信息收集', '渗透测试', 'Bash']
  },

  // ==================== 加密解密类 ====================
  {
    id: 'encrypt-toolkit',
    name: '加密工具集',
    description: '常用加密解密工具集合，支持多种算法',
    category: '加密解密',
    subcategory: '工具集',
    language: 'Python',
    platform: ['Linux', 'Windows', 'macOS'],
    difficulty: 'easy',
    author: '密码学应用',
    features: [
      '对称加密(AES/DES/3DES)',
      '非对称加密(RSA)',
      '哈希计算',
      'Base编码',
      '文件加密'
    ],
    requirements: ['Python 3.8+', 'cryptography库'],
    installation: 'pip install cryptography pycryptodome',
    usage: 'python encrypt_toolkit.py',
    steps: [
      {
        title: '安装依赖',
        description: '安装加密库',
        command: 'pip install cryptography'
      },
      {
        title: '哈希计算',
        description: '计算文件的哈希值',
        command: 'python encrypt_toolkit.py hash --algorithm sha256 --file document.pdf'
      },
      {
        title: 'AES加密',
        description: '使用AES加密文件',
        command: 'python encrypt_toolkit.py encrypt --algorithm aes256 --input secret.txt --output encrypted.bin'
      },
      {
        title: 'RSA加密',
        description: '使用RSA加密数据',
        command: 'python encrypt_toolkit.py rsa --encrypt --public-key pub.pem --input message.txt'
      },
      {
        title: 'Base64编码',
        description: '进行Base64编解码',
        command: 'python encrypt_toolkit.py base64 --encode --input data.bin'
      }
    ],
    examples: [
      {
        title: '哈希验证',
        input: 'python encrypt_toolkit.py hash --algorithm sha256 --file backup.zip',
        output: 'SHA256: a7b3c2d1e5f6...7g8h9i0j\nMD5: 1a2b3c4d5e6f...\nSHA1: 7g8h9i0j1k2l...',
        explanation: '计算文件的多种哈希值用于完整性验证'
      }
    ],
    tips: [
      '重要文件多重备份',
      '妥善保管密钥',
      '使用强密钥'
    ],
    warnings: [
      '丢失密钥无法恢复',
      '加密文件定期检查',
      '遵守加密法规'
    ],
    tags: ['加密', '解密', 'AES', 'RSA', '哈希']
  },

  // ==================== Web安全类 ====================
  {
    id: 'api-tester',
    name: 'API安全测试工具',
    description: '自动化测试REST API的安全性',
    category: 'Web安全',
    subcategory: 'API测试',
    language: 'Python',
    platform: ['Linux', 'Windows', 'macOS'],
    difficulty: 'medium',
    author: 'API安全',
    features: [
      '认证绕过测试',
      '参数篡改测试',
      'SQL注入测试',
      'XSS测试',
      '越权测试'
    ],
    requirements: ['Python 3.8+', 'requests库'],
    installation: 'pip install requests pyyaml',
    usage: 'python api_tester.py -f api_endpoints.yaml',
    steps: [
      {
        title: '准备API定义',
        description: '创建API端点配置文件',
        command: 'cat > api_endpoints.yaml << EOF\nendpoints:\n  - path: /api/users\n    method: GET\n    auth: Bearer\nEOF'
      },
      {
        title: '运行测试',
        description: '执行API安全测试',
        command: 'python api_tester.py -f api_endpoints.yaml --target https://api.target.com'
      },
      {
        title: '认证绕过测试',
        description: '测试身份验证绕过',
        command: 'python api_tester.py -f api.yaml --test auth-bypass'
      },
      {
        title: '越权测试',
        description: '测试水平/垂直越权',
        command: 'python api_tester.py -f api.yaml --test idor --users user1.txt user2.txt'
      }
    ],
    examples: [
      {
        title: '基础API测试',
        input: "python api_tester.py -u 'https://api.target.com/api/users/1'",
        output: '[+] Testing: GET /api/users/1\n[+] Testing IDOR...\n[!] Potential IDOR found\n[+] Response includes user data for user_id=1\n[+] Try manipulating the ID parameter',
        explanation: '测试API端点是否存在越权漏洞'
      }
    ],
    tips: [
      'API文档是最好的测试指南',
      '注意HTTP方法和状态码',
      '结合Burp Suite使用'
    ],
    warnings: [
      'API测试可能修改数据',
      '生产环境测试需谨慎',
      '遵守API使用限制'
    ],
    tags: ['API安全', 'REST', '渗透测试', 'Web安全']
  },

  {
    id: 'csp-bypass',
    name: 'CSP绕过工具',
    description: '测试和绕过Content Security Policy',
    category: 'Web安全',
    subcategory: 'CSP安全',
    language: 'JavaScript',
    platform: ['Linux', 'Windows', 'macOS'],
    difficulty: 'hard',
    author: 'XSS研究',
    features: [
      'CSP策略解析',
      '绕过技术测试',
      '白名单检测',
      '报告生成'
    ],
    requirements: ['Node.js 14+'],
    installation: 'npm install -g csp-bypass',
    usage: 'node csp_bypass.js https://target.com',
    steps: [
      {
        title: '分析CSP',
        description: '获取并分析目标网站的CSP策略',
        command: 'node csp_bypass.js https://target.com --analyze'
      },
      {
        title: '测试绕过',
        description: '测试可能的CSP绕过方法',
        command: 'node csp_bypass.js https://target.com --bypass'
      },
      {
        title: '生成POC',
        description: '生成可用的绕过POC',
        command: 'node csp_bypass.js https://target.com --generate-poc'
      }
    ],
    examples: [
      {
        title: 'CSP分析',
        input: "node csp_bypass.js 'https://vulnerable-site.com'",
        output: '[+] CSP Policy detected:\n[+] default-src: \'self\'\n[+] script-src: \'self\' cdn.trusted.com\n[+] img-src: *\n[!] Potential bypass: JSONP endpoint found in cdn.trusted.com',
        explanation: '分析CSP策略并发现潜在绕过点'
      }
    ],
    tips: [
      'CSP配置复杂，容易出错',
      '浏览器实现有差异',
      '关注JSONP和第三方脚本'
    ],
    warnings: [
      '绕过测试需要授权',
      '仅用于安全评估',
      '不要用于非法目的'
    ],
    tags: ['CSP', 'XSS', '绕过', 'Web安全']
  },

  // ==================== 云安全类 ====================
  {
    id: 'aws-security-checker',
    name: 'AWS安全检查工具',
    description: '检查AWS云环境的安全配置，发现风险',
    category: '云安全',
    subcategory: 'AWS检查',
    language: 'Python',
    platform: ['Linux', 'Windows', 'macOS'],
    difficulty: 'medium',
    author: '云安全',
    features: [
      'S3桶权限检查',
      'IAM策略分析',
      '安全组检查',
      '加密状态检查',
      '合规报告'
    ],
    requirements: ['Python 3.8+', 'boto3库', 'AWS凭证'],
    installation: 'pip install boto3 pandas',
    usage: 'python aws_security_check.py --profile default',
    steps: [
      {
        title: '配置AWS凭证',
        description: '配置AWS访问密钥',
        command: 'aws configure'
      },
      {
        title: '全面检查',
        description: '执行所有安全检查项',
        command: 'python aws_security_check.py --profile default --check all'
      },
      {
        title: 'S3检查',
        description: '专门检查S3存储桶',
        command: 'python aws_security_check.py --check s3'
      },
      {
        title: 'IAM检查',
        description: '检查IAM策略和用户',
        command: 'python aws_security_check.py --check iam'
      },
      {
        title: '生成报告',
        description: '输出安全报告',
        command: 'python aws_security_check.py --report -o aws_security_report.html'
      }
    ],
    examples: [
      {
        title: 'S3公开桶检测',
        input: 'python aws_security_check.py --check s3',
        output: '[+] Checking S3 buckets...\n[!] CRITICAL: Bucket "company-backups" is publicly accessible\n[!] WARNING: Bucket "logs-2024" allows full control to authenticated users\n[+] 45 buckets checked, 2 issues found',
        explanation: '检测AWS S3存储桶的公开访问权限'
      }
    ],
    tips: [
      '定期检查云环境',
      '使用最小权限原则',
      '启用所有日志记录'
    ],
    warnings: [
      '需要适当的AWS权限',
      '检查可能产生费用',
      '生产环境谨慎操作'
    ],
    tags: ['AWS', '云安全', '配置检查', 'S3']
  },

  // ==================== CTF工具类 ====================
  {
    id: 'ctf-decoder',
    name: 'CTF解码器工具箱',
    description: 'CTF比赛中常用的编码解码和加密解密工具',
    category: 'CTF工具',
    subcategory: '编码解码',
    language: 'Python',
    platform: ['Linux', 'Windows', 'macOS'],
    difficulty: 'easy',
    author: 'CTF选手',
    features: [
      'Base系列编码',
      'URL编码',
      'HTML编码',
      'Unicode转换',
      '十六进制转换',
      '凯撒密码',
      'ROT13',
      '摩斯电码'
    ],
    requirements: ['Python 3.8+'],
    installation: 'pip install pycryptodome',
    usage: 'python ctf_decoder.py',
    steps: [
      {
        title: 'Base64解码',
        description: '解码Base64字符串',
        command: 'python ctf_decoder.py --decode base64 "SGVsbG8gV29ybGQ="'
      },
      {
        title: '凯撒密码破解',
        description: '暴力破解凯撒密码',
        command: 'python ctf_decoder.py --caesar "Khoor Zruog"'
      },
      {
        title: 'Hex转换',
        description: '十六进制与字符串互转',
        command: 'python ctf_decoder.py --hex "48656C6C6F"'
      },
      {
        title: '摩斯电码',
        description: '摩斯电码编码解码',
        command: 'python ctf_decoder.py --morse ".... . .-.. .--. --..--  -....- ....- ....-"'
      },
      {
        title: 'Unicode转换',
        description: 'Unicode与中文互转',
        command: 'python ctf_decoder.py --unicode "\\u4e16\\u754c"'
      }
    ],
    examples: [
      {
        title: '多层编码',
        input: "python ctf_decoder.py --auto \"48 65 6c 6c 6f\"",
        output: '[+] Auto-detecting...\n[+] Detected: Hex\n[+] Decoded: Hello\n[+] Checking for further encoding...\n[+] Final result: Hello',
        explanation: '自动检测并解码多层编码'
      },
      {
        title: '凯撒密码',
        input: 'python ctf_decoder.py --caesar "Fdhvdu"',
        output: '[+] Caesar Cipher detected\n[+] Brute forcing all shifts...\nShift 3: Cipher\nShift 13: Sphinx\nShift 5: Cadbv (most likely: Shift 3)',
        explanation: '暴力破解凯撒密码的所有可能'
      }
    ],
    tips: [
      '观察字符串特征判断编码类型',
      '组合使用多种解码方法',
      '注意编码顺序'
    ],
    warnings: [
      '编码顺序很重要',
      '有些编码看起来相似',
      '善用自动检测功能'
    ],
    tags: ['CTF', '编码解码', '密码学', '工具箱']
  },

  {
    id: 'steganography-tool',
    name: '隐写术工具',
    description: '图片和音频隐写/解隐写工具',
    category: 'CTF工具',
    subcategory: '隐写术',
    language: 'Python',
    platform: ['Linux', 'Windows', 'macOS'],
    difficulty: 'medium',
    author: '隐写研究',
    features: [
      'LSB隐写分析',
      '文件分离',
      'PNG隐写检测',
      '音频隐写分析',
      '二维码隐写'
    ],
    requirements: ['Python 3.8+', 'PIL库', 'pydub'],
    installation: 'pip install Pillow pydub stegano',
    usage: 'python stego_tool.py extract image.png',
    steps: [
      {
        title: 'LSB提取',
        description: '从图片中提取LSB隐写数据',
        command: 'python stego_tool.py extract-lsb hidden.png'
      },
      {
        title: '元数据检查',
        description: '检查图片元数据',
        command: 'python stego_tool.py metadata image.png'
      },
      {
        title: '文件分离',
        description: '从图片末尾分离隐藏文件',
        command: 'python stego_tool.py carve image.png -o output/'
      },
      {
        title: 'PNG分析',
        description: '深度分析PNG结构',
        command: 'python stego_tool.py analyze-png suspicious.png'
      }
    ],
    examples: [
      {
        title: 'LSB隐写提取',
        input: 'python stego_tool.py extract-lsb stego.png',
        output: '[+] Analyzing PNG for LSB steganography...\n[+] Image size: 1920x1080\n[+] Extracting LSB data...\n[+] Found hidden data in RGB channels\n[+] Extracted: flag{LSB_steg0_is_fun}\n[+] Confidence: 95%',
        explanation: '从PNG图片中提取LSB隐写的flag'
      }
    ],
    tips: [
      '先用binwalk初步检查',
      '注意PNG的IDAT块',
      '结合多种工具分析'
    ],
    warnings: [
      '隐写分析需要耐心',
      '可能有陷阱',
      '工具只是辅助'
    ],
    tags: ['隐写术', 'LSB', 'PNG', 'CTF']
  },

  // ==================== 隐私保护类 ====================
  {
    id: 'vpn-config-guide',
    name: 'WireGuard VPN搭建完整教程（新手必读）',
    description: '最详细的WireGuard VPN搭建教程，从零开始教你5分钟搭建自己的VPN服务器，支持Windows/Mac/Linux全平台',
    category: '隐私保护',
    subcategory: 'VPN配置',
    language: 'Shell',
    platform: ['Linux', 'Windows', 'macOS'],
    difficulty: 'easy',
    author: '安全研究',
    features: ['5分钟快速搭建', '全平台客户端支持', '高清图文教程', '常见问题解答', '性能优化技巧'],
    requirements: ['一台境外VPS服务器', 'root访问权限', '基本的电脑操作能力'],
    installation: 'apt update && apt install wireguard -y',
    usage: 'wg-quick up wg0-client',
    steps: [
      {
        title: '第一步：购买并登录你的VPS服务器',
        description: '选择一家可靠的VPS服务商，购买一台境外服务器（如搬瓦工、DigitalOcean、Vultr等）。推荐配置：1核CPU、1GB内存、20GB硬盘、1000GB流量/月，价格约5-10美元/月。购买后你会收到服务器的IP地址、用户名（通常是root）和密码。使用SSH工具（如Windows的PowerShell或Mac的终端）连接到服务器。Windows用户打开PowerShell，输入：ssh root@你的服务器IP，然后按回车，输入密码时粘贴并回车。Mac用户打开终端，输入同样的命令即可。',
        note: '新手建议选择美国的VPS，延迟低、速度快、IP被封概率低。推荐使用BBR加速的服务器。'
      },
      {
        title: '第二步：在服务器上安装WireGuard',
        description: '成功登录服务器后，在终端中执行以下命令更新系统包：apt update && apt upgrade -y。这可能需要几分钟时间。更新完成后，安装WireGuard：apt install wireguard -y。如果提示是否继续安装，输入y并回车。安装完成后，验证安装：wg version，如果显示版本号（如v1.0.2020-12-21），说明安装成功。',
        command: 'apt update && apt upgrade -y && apt install wireguard -y && wg version'
      },
      {
        title: '第三步：生成服务器密钥对',
        description: 'WireGuard使用公钥加密来保证通信安全。首先进入WireGuard配置目录：cd /etc/wireguard。然后生成服务器私钥：umask 077 && wg genkey | tee server_privatekey | wg pubkey > server_publickey。这会创建两个文件：server_privatekey（服务器私钥，绝对保密）和server_publickey（服务器公钥，后面给客户端用）。查看生成的公钥：cat server_publickey，把这串字符复制保存，后面客户端配置需要用到。',
        command: 'cd /etc/wireguard && umask 077 && wg genkey | tee server_privatekey | wg pubkey > server_publickey && cat server_publickey'
      },
      {
        title: '第四步：创建服务器配置文件',
        description: '创建服务器配置文件：touch /etc/wireguard/wg0.conf。然后用nano或vim编辑器打开：nano /etc/wireguard/wg0.conf（新手推荐nano，更容易操作）。在编辑器中输入以下内容，将[Interface]下的PrivateKey替换为刚才生成的服务器私钥（运行cat server_privatekey查看），Address填10.0.0.1/24，ListenPort填51820（也可以用其他端口）。[Peer]部分保留为空，客户端会在这里添加。输入完成后按Ctrl+X退出，提示保存时按Y确认。',
        command: 'touch /etc/wireguard/wg0.conf && nano /etc/wireguard/wg0.conf'
      },
      {
        title: '第五步：开启服务器IP转发',
        description: '为了让VPN客户端能通过服务器访问互联网，需要开启IP转发功能。编辑sysctl配置：nano /etc/sysctl.conf，找到#net.ipv4.ip_forward=1这一行（可能在文件中间），删除前面的#号启用它。如果找不到这一行，在文件末尾添加：net.ipv4.ip_forward=1。保存退出后，执行sysctl -p使配置生效。可以用cat /proc/sys/net/ipv4/ip_forward查看，如果显示1表示开启成功。',
        command: 'echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf && sysctl -p'
      },
      {
        title: '第六步：配置防火墙（重要！）',
        description: '防火墙规则必须正确配置，否则VPN无法正常工作。安装ufw防火墙：apt install ufw -y。设置默认规则：ufw default allow outgoing（允许出站），ufw default deny incoming（拒绝入站）。开放WireGuard端口：ufw allow 51820/udp。开放SSH端口：ufw allow 22/tcp。启用防火墙：ufw enable，输入y确认。检查状态：ufw status，应该显示51820/udp和22/tcp都是ALLOW。',
        command: 'apt install ufw -y && ufw allow 22/tcp && ufw allow 51820/udp && ufw enable'
      },
      {
        title: '第七步：启动WireGuard服务',
        description: '现在可以启动WireGuard了！启动服务：wg-quick up wg0。如果成功，应该没有任何错误输出。设置开机自启（强烈推荐）：systemctl enable wg-quick@wg0，这样服务器重启后VPN会自动启动。查看VPN状态：wg show，能看到interface信息说明服务正常运行。停止服务用：wg-quick down wg0。',
        command: 'wg-quick up wg0 && systemctl enable wg-quick@wg0 && wg show'
      },
      {
        title: '第八步：为客户端生成密钥对',
        description: '每个需要连接VPN的设备都需要生成独立的密钥对。在服务器上继续执行（在/etc/wireguard目录下）：wg genkey | tee client1_privatekey | wg pubkey > client1_publickey && cat client1_publickey。把输出的公钥复制保存。然后查看私钥：cat client1_privatekey，这个私钥需要安全地传输给客户端（可以用加密的邮件或即时通讯工具发送）。',
        command: 'cd /etc/wireguard && wg genkey | tee client1_privatekey | wg pubkey > client1_publickey && cat client1_publickey'
      },
      {
        title: '第九步：在服务器添加客户端配置',
        description: '编辑服务器配置，添加客户端信息：nano /etc/wireguard/wg0.conf。在文件末尾添加[Peer]区块：[Peer] PublicKey = 客户端公钥 AllowedIPs = 10.0.0.2/32（注意：每个客户端用不同的IP，如client2用10.0.0.3/32）。保存后重启WireGuard：wg-quick down wg0 && wg-quick up wg0，或者直接执行：wg addconf wg0 <(wg-quick strip wg0)来热更新配置不需要断开连接。',
        command: 'nano /etc/wireguard/wg0.conf'
      },
      {
        title: '第十步：Windows客户端配置',
        description: '在Windows电脑上，访问WireGuard官网（wireguard.com/install）下载Windows客户端。安装后打开软件，点击"导入隧道"或"从文件创建隧道"。创建新隧道，隧道名称填"我的VPN"。在Interface部分：PrivateKey填客户端私钥（之前服务器上生成的client1_privatekey），Address填10.0.0.2/32。在Peer部分：PublicKey填服务器公钥（之前生成的server_publickey），AllowedIPs填0.0.0.0/0, ::/0（这表示所有流量都走VPN）。Endpoint填服务器IP:51820。点击"激活"连接。',
        note: 'Windows客户端下载地址：https://www.wireguard.com/install/'
      },
      {
        title: '第十一步：Mac/iOS客户端配置',
        description: 'Mac用户：在App Store搜索WireGuard并安装。打开应用，点击"添加隧道"，选择"从头创建"。Interface：PrivateKey填客户端私钥，Address填10.0.0.2/32。Peer：PublicKey填服务器公钥，AllowedIPs填0.0.0.0/0, ::/0，Endpoint填服务器IP:51820。点击"激活"。iOS用户同样在App Store下载WireGuard，配置方法相同。',
        note: 'App Store搜索WireGuard，或访问官网获取iOS版下载链接'
      },
      {
        title: '第十二步：Android客户端配置',
        description: 'Android用户：在Google Play商店搜索WireGuard并安装。或者从GitHub下载APK：github.com/WireGuard/wireguard-android/releases。安装后打开，点击右下角"+"按钮，选择"从头创建"或"从ZIP导入"（如果有导出的配置文件）。配置方法同Windows，将PrivateKey、Address、PublicKey、AllowedIPs、Endpoint填入相应位置。点击保存，然后点击开关按钮激活连接。',
        note: 'Google Play下载地址：play.google.com/store/apps/details?id=com.wireguard.android'
      },
      {
        title: '第十三步：验证VPN是否正常工作',
        description: '连接成功后，打开浏览器访问以下网站验证：访问 https://whatismyip.com 或 https://ip.sb 查看显示的IP是否是服务器IP。如果是，说明VPN工作正常。访问 https://dnsleaktest.com 点击"Extended test"检查是否有DNS泄露，应该显示DNS服务器是1.1.1.1或你的服务器IP。访问 https://ipleak.net 检查WebRTC是否泄露。',
        command: '浏览器访问 whatismyip.com 确认IP已变更为服务器IP'
      },
      {
        title: '第十四步：添加更多客户端',
        description: '如果需要给其他设备添加VPN连接，在服务器上重复第八步生成新的密钥对。记住：每个客户端需要唯一的私钥和IP地址（10.0.0.3/32, 10.0.0.4/32等）。然后在服务器wg0.conf中添加对应的[Peer]区块，公钥是新客户端的公钥，AllowedIPs是新分配的IP。重启WireGuard服务后，新客户端就可以连接了。',
        command: 'wg genkey | tee client2_privatekey | wg pubkey > client2_publickey'
      }
    ],
    examples: [
      {
        title: '服务器完整配置文件示例',
        input: '查看 /etc/wireguard/wg0.conf',
        output: '[Interface]\nPrivateKey = 服务器私钥（长字符串）\nAddress = 10.0.0.1/24\nListenPort = 51820\nPostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE\nPostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE\n\n[Peer]\nPublicKey = 客户端公钥\nAllowedIPs = 10.0.0.2/32',
        explanation: '这是完整的服务器配置，PostUp和PostDown用于NAT转发，让客户端能访问互联网'
      },
      {
        title: 'Windows客户端完整配置示例',
        input: 'WireGuard客户端配置',
        output: '[Interface]\nPrivateKey = 客户端私钥\nAddress = 10.0.0.2/32\nDNS = 8.8.8.8\n\n[Peer]\nPublicKey = 服务器公钥\nAllowedIPs = 0.0.0.0/0, ::/0\nEndpoint = 你的服务器IP:51820\nPersistentKeepalive = 25',
        explanation: 'DNS设置8.8.8.8避免DNS泄露，PersistentKeepalive保持连接稳定'
      }
    ],
    tips: [
      '建议使用Google Cloud或AWS的海外服务器，IP被封概率低',
      '定期更换密钥对，建议每3个月更换一次',
      '使用非默认端口（如51821）可以减少被扫描',
      '开启BBR加速可以显著提升VPN速度',
      '建议使用Cloudflare WARP作为备用方案',
      '保留服务器的root访问权限，定期更新系统包',
      '可以在路由器上配置WireGuard，所有设备自动科学上网'
    ],
    warnings: [
      '仅在合法合规的前提下使用VPN技术',
      '不要使用VPN进行任何非法活动',
      '服务器私钥和客户端私钥必须妥善保管，切勿泄露',
      '免费VPN服务存在严重隐私风险，数据可能被出售',
      '在中国大陆使用VPN需要使用获得政府批准的正规服务',
      '公共Wi-Fi下使用VPN可以有效防止中间人攻击',
      'VPN会降低网络速度，选择延迟低、带宽大的服务器'
    ],
    tags: ['WireGuard', 'VPN搭建', '新手教程', '全平台', '隐私保护', '加密通信']
  },

  {
    id: 'shadow-socks-config',
    name: 'Shadowsocks(R)科学上网完整教程（新手版）',
    description: '最适合新手的Shadowsocks代理配置教程，详细讲解从购买服务器到配置客户端的全过程，支持多种插件增强隐蔽性',
    category: '隐私保护',
    subcategory: '代理配置',
    language: 'Shell/Python',
    platform: ['Linux', 'Windows', 'macOS'],
    difficulty: 'easy',
    author: '安全研究',
    features: ['一键安装脚本', 'v2ray插件支持', '多用户管理', '流量统计', '详细图文教程'],
    requirements: ['境外VPS服务器', 'root权限', '基本的命令行操作能力'],
    installation: 'wget -N https://raw.githubusercontent.com/teddysun/shadowsocks_install/master/shadowsocks.sh && chmod +x shadowsocks.sh && ./shadowsocks.sh',
    usage: 'ssserver -c /etc/shadowsocks.json -d start',
    steps: [
      {
        title: '第一步：准备服务器环境',
        description: '推荐使用CentOS 7+/Ubuntu 16+/Debian 8+系统。首先SSH连接到你的服务器。更新系统包：Ubuntu/Debian执行apt update && apt upgrade -y；CentOS执行yum update -y。安装必要工具：apt install -y wget curl vim git unzip（Ubuntu/Debian）或yum install -y wget curl vim git unzip（CentOS）。建议使用root用户操作。',
        command: 'apt update && apt install -y wget curl vim git unzip'
      },
      {
        title: '第二步：使用一键脚本安装Shadowsocks',
        description: '推荐使用秋水逸冰的一键安装脚本，安全可靠。执行以下命令下载并运行安装脚本：wget --no-check-certificate -O shadowsocks.sh https://raw.githubusercontent.com/teddysun/shadowsocks_install/master/shadowsocks.sh。然后赋予执行权限：chmod +x shadowsocks.sh。最后运行脚本：./shadowsocks.sh。脚本会提示输入密码（建议使用16位以上强密码），选择加密方式（推荐chacha20-ietf-poly1305或aes-256-gcm），选择端口号（建议避开常用端口如22、80、443）。',
        command: 'wget -N https://raw.githubusercontent.com/teddysun/shadowsocks_install/master/shadowsocks.sh && chmod +x shadowsocks.sh && ./shadowsocks.sh'
      },
      {
        title: '第三步：记录安装信息',
        description: '安装成功后，脚本会显示重要信息，请务必记录下来：服务器IP、服务器端口（默认8388）、连接密码、加密方式（如aes-256-gcm）。这些信息配置客户端时必须用到。配置文件位置：/etc/shadowsocks.json。可以随时查看：cat /etc/shadowsocks.json。建议将这些信息保存到安全的地方。',
        command: 'cat /etc/shadowsocks.json'
      },
      {
        title: '第四步：安装BBR加速（重要！）',
        description: 'BBR是Google开发的TCP拥塞控制算法，可以显著提升网络速度。CentOS用户执行：rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org && rpm -Uvh http://www.elrepo.org/elrepo-release-7.0-2.el7.elrepo.noarch.rpm && yum install -y kernel-ml && grub2-set-default 0 && reboot。Ubuntu用户执行：echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf && echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf && sysctl -p。重启后验证：lsmod | grep bbr，看到tcp_bbr说明成功。',
        command: 'echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf && echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf && sysctl -p'
      },
      {
        title: '第五步：安装v2ray插件（增强隐蔽性）',
        description: '为了应对深度包检测（DPI），建议安装v2ray-plugin。下载插件：wget https://github.com/shadowsocks/v2ray-plugin/releases/download/v1.3.2/v2ray-plugin-linux-amd64-v1.3.2.tar.gz。解压：tar -zxvf v2ray-plugin-linux-amd64-v1.3.2.tar.gz。移动到系统目录：mv v2ray-plugin_linux_amd64 /etc/shadowsocks/v2ray-plugin。赋予执行权限：chmod +x /etc/shadowsocks/v2ray-plugin。',
        command: 'wget https://github.com/shadowsocks/v2ray-plugin/releases/download/v1.3.2/v2ray-plugin-linux-amd64-v1.3.2.tar.gz && tar -zxvf v2ray-plugin-linux-amd64-v1.3.2.tar.gz && mv v2ray-plugin_linux_amd64 /etc/shadowsocks/v2ray-plugin'
      },
      {
        title: '第六步：配置WebSocket模式（可选但推荐）',
        description: 'WebSocket模式可以让流量伪装成正常的HTTPS网页流量，更难被检测。编辑配置：nano /etc/shadowsocks.json。修改后的配置示例：\n{\n  "server":"0.0.0.0",\n  "server_port":8388,\n  "local_address":"127.0.0.1",\n  "local_port":1080,\n  "password":"你的密码",\n  "timeout":300,\n  "method":"aes-256-gcm",\n  "plugin":"v2ray-plugin",\n  "plugin_opts":"server;websocket;path=/v2ray;tls;cert=/path/to/cert.pem;key=/path/to/key.pem"\n}\n\n需要准备域名和SSL证书。',
        command: 'nano /etc/shadowsocks.json'
      },
      {
        title: '第七步：安装Nginx配置伪装网站（可选）',
        description: '为了更安全，建议配置一个正常的网站来伪装。安装Nginx：apt install nginx -y。创建一个简单的网站：mkdir -p /var/www/example.com && echo "<h1>Welcome!</h1>" > /var/www/example.com/index.html。配置Nginx：nano /etc/nginx/sites-available/default，添加server_name 你的域名。申请SSL证书（使用Let\'s Encrypt免费证书）：apt install certbot python3-certbot-nginx -y && certbot --nginx -d 你的域名。',
        command: 'apt install nginx certbot python3-certbot-nginx -y && certbot --nginx -d yourdomain.com'
      },
      {
        title: '第八步：重启Shadowsocks服务',
        description: '修改配置后需要重启服务使更改生效。停止服务：/etc/init.d/shadowsocks stop。启动服务：/etc/init.d/shadowsocks start。重启服务：/etc/init.d/shadowsocks restart。查看状态：/etc/init.d/shadowsocks status。查看日志：tail -f /var/log/shadowsocks.log。如果使用了一键脚本安装，可以用命令：ssserver -c /etc/shadowsocks.json -d restart。',
        command: '/etc/init.d/shadowsocks restart'
      },
      {
        title: '第九步：Windows客户端配置',
        description: '下载Shadowsocks Windows客户端：github.com/shadowsocks/shadowsocks-windows/releases 下载最新版本。下载v2ray-plugin：github.com/shadowsocks/v2ray-plugin/releases 下载对应版本（windows-amd64），重命名为v2ray-plugin.exe放入Shadowsocks同目录。打开Shadowsocks客户端，点击服务器->编辑服务器，填写：服务器IP、端口、密码、加密方式、插件选择v2ray-plugin，插件选项填：client;websocket;path=/v2ray。点击确定，然后点击启用系统代理。',
        note: 'Windows客户端：github.com/shadowsocks/shadowsocks-windows/releases'
      },
      {
        title: '第十步：浏览器配置（SwitchyOmega插件）',
        description: '为了更灵活地控制哪些网站走代理，推荐使用Chrome扩展SwitchyOmega。在Chrome应用商店搜索SwitchyOmega并安装。安装后点击扩展图标，点击"选项"。新建情景模式，名称随便填（如"代理"），类型选择"代理服务器"。代理协议选择SOCKS5，代理服务器填127.0.0.1，代理端口填1080。保存后点击扩展图标，选择刚创建的情景模式即可。也可以设置自动切换模式，根据规则决定哪些网站走代理。',
        note: 'SwitchyOmega下载：chrome.google.com/webstore/search/switchyomega'
      },
      {
        title: '第十一步：Mac客户端配置',
        description: 'Mac用户有多个选择。方式一：使用ShadowsocksX-NG，GitHub下载dmg文件安装。方式二（推荐）：使用ClashX，支持更多协议和规则配置。ClashX安装后，在配置文件中添加Shadowsocks服务器信息，包括服务器IP、端口、密码、加密方式。配置URL或订阅链接自动更新节点列表。',
        command: 'brew install shadowsocks-libev'
      },
      {
        title: '第十二步：iOS客户端配置',
        description: 'iOS由于系统限制，需要使用付费的客户端App Store应用。最推荐的是Surge（功能强大但较贵，约328元）或Shadowrocket（便宜，约25元）。也可以使用免费的小火箭（Shadowrocket类似），但可能不够稳定。购买后添加服务器信息：服务器地址、端口、密码、加密方式、协议插件（如启用了v2ray-plugin需开启相关选项）。',
        note: 'App Store搜索Shadowrocket或Surge，价格请以实际为准'
      },
      {
        title: '第十三步：Android客户端配置',
        description: 'Android推荐使用Shadowsocks安卓版（免费）和Clash for Android（更强大）。下载APK：github.com/shadowsocks/shadowsocks-android/releases 或者在Google Play下载。安装后点击右上角"+"添加服务器，填写服务器信息。如果使用了v2ray-plugin，在插件选项中配置。配置完成后点击连接按钮。Clash for Android需要导入配置文件，包含服务器节点信息。',
        command: 'github.com/shadowsocks/shadowsocks-android/releases'
      },
      {
        title: '第十四步：验证代理是否正常工作',
        description: '连接成功后，打开浏览器访问以下网站验证：访问 https://ipleak.net 查看IP是否是服务器IP。访问 https://dnsleaktest.com 点击"Extended test"检查DNS是否泄露。访问 https://webqr.appspot.com/zh/ 测试WebRTC是否泄露。访问 https://speedtest.net 测试网速是否正常。如果一切正常，说明代理工作正常。',
        command: '浏览器访问 ipleak.net 确认IP已变更为服务器IP'
      }
    ],
    examples: [
      {
        title: '基础配置文件示例',
        input: 'cat /etc/shadowsocks.json',
        output: '{\n  "server":"0.0.0.0",\n  "server_port":8388,\n  "local_address":"127.0.0.1",\n  "local_port":1080,\n  "password":"你的强密码",\n  "timeout":300,\n  "method":"aes-256-gcm",\n  "fast_open":false\n}',
        explanation: '这是基础配置的JSON文件，包含了连接所需的所有信息'
      },
      {
        title: 'v2ray-plugin WebSocket模式配置',
        input: '修改后的配置',
        output: '{\n  "server":"0.0.0.0",\n  "server_port":8388,\n  "password":"你的密码",\n  "method":"aes-256-gcm",\n  "plugin":"v2ray-plugin",\n  "plugin_opts":"server;websocket;path=/v2ray;tls;cert=/etc/letsencrypt/live/yourdomain.com/fullchain.pem;key=/etc/letsencrypt/live/yourdomain.com/privkey.pem"\n}',
        explanation: '启用了TLS和WebSocket的伪装配置，流量看起来像正常的HTTPS网站'
      }
    ],
    tips: [
      '建议使用Chacha20加密，移动设备性能更好；AES加密在桌面设备更快',
      '定期更换密码，建议每1-2个月更换一次',
      '使用v2ray-plugin可以有效对抗GFW的深度包检测',
      '配合CDN使用（如Cloudflare）可以进一步隐藏服务器IP',
      '多台服务器做负载均衡可以提高稳定性',
      '订阅链接可以方便地批量管理多个节点',
      '如果速度慢，尝试更换加密方式或启用BBR加速'
    ],
    warnings: [
      '仅在学习和技术研究中使用，请遵守当地法律法规',
      '不要使用代理服务进行任何非法活动',
      '免费代理存在严重安全隐患，不要在重要场合使用',
      '代理服务器管理员可以看到你的流量内容，请选择可信的服务',
      '在中国大陆，未经批准的个人建立或使用VPN是违法行为',
      '公共Wi-Fi下使用代理可以防止被中间人攻击',
      '部分网站可能检测到代理并限制访问'
    ],
    tags: ['Shadowsocks', '科学上网', 'v2ray', '代理配置', '防检测', 'WebSocket']
  },

  {
    id: 'anti-tracking-tools',
    name: '反追踪与隐私保护完全指南（新手篇）',
    description: '从零开始保护你的网络隐私，详细讲解浏览器指纹、追踪器拦截、DNS隐私、Cookie管理等全套隐私保护技能',
    category: '隐私保护',
    subcategory: '反追踪',
    language: 'Browser Extension',
    platform: ['Linux', 'Windows', 'macOS'],
    difficulty: 'easy',
    author: '安全研究',
    features: ['浏览器指纹防护', '追踪器全面拦截', 'DNS隐私保护', 'Cookie管理', '隐私搜索引擎'],
    requirements: ['现代浏览器（Chrome/Firefox/Edge）', '愿意花时间配置隐私设置'],
    installation: '在各浏览器扩展商店搜索安装',
    usage: '启用扩展并配置相应的隐私规则',
    steps: [
      {
        title: '第一步：了解什么是网络追踪（基础知识）',
        description: '在开始配置之前，先了解网站是如何追踪你的。追踪技术包括：1) Cookies：网站存储在你电脑上的小文件，可以记住你的登录状态和偏好，但也被用于追踪；2) 浏览器指纹：通过收集你的浏览器版本、插件、屏幕分辨率、字体等信息创建一个独特的"指纹"来识别你；3) 追踪像素：小图片（1x1像素）嵌入网页或邮件，用于记录你是否打开了页面；4) Web存储：类似Cookie但容量更大，包括localStorage和sessionStorage；5) DNS查询：你的ISP可以记录你访问的所有网站；6) IP地址：每个设备都有唯一的IP地址，可以定位大致位置。理解这些追踪方式有助于更好地保护隐私。',
        note: '没有任何单一方法可以完全防止追踪，需要多层防护'
      },
      {
        title: '第二步：选择更隐私的浏览器 - Firefox',
        description: 'Firefox是目前最重视隐私的主流浏览器。下载地址：mozilla.org/firefox。安装后建议进行以下配置优化隐私：1) 在地址栏输入about:config回车，点击"接受风险并继续"；2) 搜索privacy.resistFingerprinting，双击设为true（启用指纹防护）；3) 搜索webgl.disabled，双击设为true（禁用WebGL）；4) 搜索geo.enabled，双击设为false（禁用地理位置API）；5) 搜索media.navigator.enabled，双击设为false（禁用麦克风/摄像头指纹）。这些设置可以显著降低浏览器指纹的独特性。',
        command: 'Firefox地址栏输入 about:config 进行高级隐私设置'
      },
      {
        title: '第三步：安装uBlock Origin（广告和追踪器拦截）',
        description: 'uBlock Origin是最受欢迎的广域网广告拦截器，比AdBlock Plus更轻量且效果更好。在Firefox中：打开菜单->附加组件和主题，搜索uBlock Origin点击安装。在Chrome中：访问Chrome应用商店，搜索uBlock Origin安装（如果无法访问，可以使用开发者模式安装）。安装后点击扩展图标，点击右上角的电源按钮开启拦截功能。建议进入扩展设置，将"阻止泄露到第三方的请求"设为"严格"模式。',
        note: '下载地址：ublockorigin.com 或各浏览器扩展商店'
      },
      {
        title: '第四步：安装Privacy Badger（智能追踪拦截）',
        description: 'Privacy Badger是电子前沿基金会（EFF）开发的追踪拦截扩展，与uBlock Origin互补。它使用机器学习自动检测追踪器，不同于简单的黑名单拦截。安装方法：Firefox附加组件商店或Chrome应用商店搜索"Privacy Badger"安装。安装后会自动检测页面上的追踪器，用不同颜色显示：红色=已阻止，黄色=部分允许（需要cookies但限制使用），绿色=未检测到追踪。Privacy Badger还会发送"不追踪"信号给网站，要求其不要追踪你。',
        note: '下载地址：privacybadger.org 或扩展商店'
      },
      {
        title: '第五步：安装HTTPS Everywhere（强制HTTPS）',
        description: 'HTTPS Everywhere由EFF和Tor项目联合开发，强制网站使用加密的HTTPS连接，防止中间人攻击。安装：各浏览器扩展商店搜索"HTTPS Everywhere"。安装后会自动工作，不需要额外配置。它包含一个大型规则列表，告诉浏览器哪些网站支持HTTPS。对于不支持HTTPS的网站，会显示警告。建议与uBlock Origin和Privacy Badger一起使用，形成完整的隐私保护套件。',
        note: '下载地址：eff.org/https-everywhere 或扩展商店'
      },
      {
        title: '第六步：配置浏览器隐私设置 - Chrome/Edge',
        description: 'Chrome设置路径：设置->隐私和安全。1) 启用"使用安全DNS"：点击"自定义DNS"，选择Cloudflare(1.1.1.1)或其他隐私DNS；2) 禁用"帮助改善Chrome"和"向Google发送使用统计"；3) 清除"Cookie和其他网站数据"时选择"退出Chrome时清除"；4) 禁用"预测操作以改善搜索建议"；5) 在"网站设置"中禁用摄像头和麦克风访问权限。Edge设置类似：设置->隐私和服务。可以导入Chrome的扩展。',
        command: 'Chrome: 设置->隐私和安全->安全DNS 启用隐私DNS'
      },
      {
        title: '第七步：配置浏览器隐私设置 - Firefox',
        description: 'Firefox隐私设置路径：设置->隐私与安全。1) 选择"严格"跟踪保护，会拦截所有已知追踪器；2) Cookies和网站数据：勾选"接受第三方Cookie"设为"从不"，勾选"在关闭Firefox时清除Cookie"；3) 历史记录：设为"使用自定义历史记录设置"，取消勾选"始终使用私人浏览模式"之外的选项；4) 登录密码：建议禁用"显示已保存的登录信息"提示；5) 证书：勾选"查询OCSP服务器确认证书当前有效"。',
        command: 'Firefox: 设置->隐私与安全 选择"严格"跟踪保护'
      },
      {
        title: '第八步：配置隐私DNS（防止ISP窥探）',
        description: 'DNS是将域名转换为IP地址的服务，默认由你的ISP提供，他们会记录你访问的所有网站。配置隐私DNS：Windows 10/11：设置->网络和Internet->适配器选项->属性->IPv4->使用以下DNS服务器：首选1.1.1.1，备用1.0.0.1（Cloudflare DNS）或9.9.9.9（Quad9）。Mac：系统偏好设置->网络->高级->DNS，添加相同地址。路由器：在路由器设置页面找到DNS设置，填入隐私DNS地址。验证：访问dnsleaktest.com点击Standard test，应显示1.1.1.1或你选择的DNS服务器。推荐DNS：Cloudflare(1.1.1.1/1.0.0.1)、Quad9(9.9.9.9/149.112.112.112)、Google(8.8.8.8/8.8.4.4慎用)。',
        command: 'DNS设置: 首选 1.1.1.1 备用 1.0.0.1'
      },
      {
        title: '第九步：安装Canvas Blocker（防止指纹追踪）',
        description: 'Canvas指纹是一种通过在Canvas上绘制文字/图形来识别你的技术。Canvas Blocker扩展可以阻止或混淆Canvas指纹。安装：Firefox附加组件或Chrome应用商店搜索"Canvas Blocker"。配置：点击扩展图标，在设置中选择模式。推荐选择"Fake"模式，它会生成虚假的Canvas指纹；或选择"Prompt"模式，每次有网站尝试读取Canvas时询问你。另一个选择是Canvas Defender，安装后会为每个网站生成不同的Canvas噪声，使你无法被追踪。',
        note: '下载地址：扩展商店搜索Canvas Blocker或Canvas Defender'
      },
      {
        title: '第十步：安装User-Agent Switcher（伪装UA）',
        description: 'User-Agent是浏览器告诉网站"我是谁"的字符串，网站用它来判断你使用什么浏览器和系统。安装扩展：搜索"User-Agent Switcher and Manager"安装。配置：点击扩展图标，选择一个常用的User-Agent（如Chrome on Windows、Firefox on Linux等）。建议选择最常见的配置，使你融入人群。高级用户可以设置自动切换，根据不同网站使用不同UA。注意：某些网站会验证User-Agent一致性，切换UA可能导致登录问题。',
        note: '下载地址：扩展商店搜索User-Agent Switcher'
      },
      {
        title: '第十一步：使用隐私搜索引擎替代Google',
        description: 'Google会记录你的搜索历史来构建用户画像。推荐替代搜索引擎：1) DuckDuckGo：duckduckgo.com，不追踪搜索历史，界面类似Google，是最流行的隐私搜索引擎；2) Startpage：startpage.com，使用Google搜索结果但隐藏你的IP；3) Searx：searx.me，开源的去中心化搜索引擎，可以自建；4) Qwant：qwant.com，法国搜索引擎，不追踪用户。设置方法：Chrome/Edge在设置->搜索引擎中更改默认搜索引擎；Firefox在地址栏输入about:config，搜索keyword.url修改。',
        command: '浏览器默认搜索引擎改为 DuckDuckGo'
      },
      {
        title: '第十二步：使用浏览器隐私模式/无痕模式',
        description: '虽然隐私模式不能防止追踪，但可以防止在同一设备上留下本地痕迹。Chrome：Ctrl+Shift+N打开无痕窗口，特点是：不保存浏览历史、Cookie、本地存储、表单数据，扩展可能仍会运行，下载的文件和书签会保留。Firefox：Ctrl+Shift+P打开隐私窗口，特点类似，但可以选择更强的保护级别。更强的方式：Firefox的"仅限此窗口"模式，完全隔离当前窗口，与其他窗口完全隔离使用独立的Cookie和历史记录。',
        command: '快捷键 Ctrl+Shift+N (Chrome) 或 Ctrl+Shift+P (Firefox)'
      },
      {
        title: '第十三步：定期清理浏览器数据',
        description: '即使采取了各种保护措施，定期清理浏览器数据仍然是必要的。手动清理方法：Chrome: Ctrl+Shift+Delete，选择要清除的内容（浏览历史、Cookie、缓存图片和文件等），选择时间范围，点击清除数据。Firefox: Ctrl+Shift+Delete，同样的设置。自动化清理：安装"Click&Clean"扩展，可以一键清理或在关闭浏览器时自动清理。Cookie管理器：安装"Cookie AutoDelete"扩展，自动删除未访问站点的Cookie，设置保留白名单（如银行等需要保持登录的站点）。',
        command: 'Ctrl+Shift+Delete 打开清除浏览数据对话框'
      },
      {
        title: '第十四步：使用独立的浏览器配置文件',
        description: '浏览器配置文件可以让你在同一浏览器中创建完全独立的环境，适合分离工作与个人浏览、不同用途。Chrome创建新配置文件：点击头像图标->添加->管理个人资料。设置独立的配置文件，每个配置文件有独立的Cookie、历史记录、扩展和书签。建议配置：Profile 1用于日常浏览（开启所有隐私保护）、Profile 2用于需要登录重要账号（更严格的设置）、Profile 3用于测试/开发。Firefox用户：在菜单->新建用户配置文件启动配置文件管理器。',
        command: 'Chrome: 头像图标->添加 创建新配置文件'
      }
    ],
    examples: [
      {
        title: '检测你的浏览器指纹',
        input: '访问以下网站检测指纹',
        output: '1. amIunique.org - 查看你的指纹是否独特\n2. coveryourtracks.eff.org - EFF的指纹测试\n3. browserleaks.com - 全面检测各种指纹\n4. privacytests.org - Firefox专用指纹测试\n\n如果显示"独特"或"部分独特"，说明你容易被追踪',
        explanation: '这些网站可以全面检测你的浏览器指纹情况，帮助你了解隐私保护效果'
      },
      {
        title: '推荐的隐私扩展组合',
        input: '安装以下扩展',
        output: '1. uBlock Origin - 广告和追踪器拦截（必装）\n2. Privacy Badger - 智能追踪拦截\n3. HTTPS Everywhere - 强制HTTPS\n4. Canvas Blocker/Defender - 指纹防护\n5. Cookie AutoDelete - 自动清理Cookie\n6. Decentraleyes - 本地化CDN，减少追踪\n7. NoScript/ScriptSafe - JavaScript控制（高级用户）',
        explanation: '这个组合可以提供全面的隐私保护，同时保持良好的浏览体验'
      }
    ],
    tips: [
      'Firefox的隐私保护比Chrome更强，隐私敏感用户建议使用Firefox',
      'Tor浏览器提供最高级别的匿名，但速度较慢，适合高敏感场景',
      '使用隐私模式时安装的扩展仍可能追踪，建议配合使用',
      '浏览器之外的追踪：IM通讯、输入法、操作系统都可能有追踪',
      '移动端的隐私保护同样重要，iOS比Android更注重隐私',
      '定期检查haveibeenpwned.com，看你的邮箱是否泄露',
      '重要账号使用独立的浏览器和设备访问',
      '避免使用来历不明的免费VPN或代理服务'
    ],
    warnings: [
      '没有任何方法可以100%匿名上网',
      'Tor浏览器的匿名性也不是绝对的，国家级攻击者仍可追踪',
      '不要在社交媒体上分享真实个人信息',
      '即使使用了所有隐私保护工具，行为模式分析仍可识别你',
      '隐私保护不应成为从事非法活动的工具',
      '在工作中使用隐私工具可能违反公司政策',
      '某些网站拒绝访问如果检测到广告拦截器',
      '过于独特的隐私设置反而会让你更显眼'
    ],
    tags: ['反追踪', '隐私保护', '浏览器指纹', 'Cookie管理', 'DNS隐私', '广告拦截', '新手教程']
  },

  {
    id: 'browser-fingerprint-defense',
    name: '浏览器指纹防护深度配置教程',
    description: '深入讲解浏览器指纹的原理及各种防护技术，从基础配置到高级脚本编写，适合想要深入了解隐私保护的技术爱好者',
    category: '隐私保护',
    subcategory: '指纹防护',
    language: 'JavaScript',
    platform: ['Linux', 'Windows', 'macOS'],
    difficulty: 'hard',
    author: '安全研究',
    features: ['指纹原理详解', 'Canvas指纹防护', 'WebGL指纹混淆', '字体指纹防护', '脚本配置'],
    requirements: ['Tampermonkey或Violentmonkey扩展', '基础的JavaScript知识', '愿意进行深入配置'],
    installation: '安装Tampermonkey扩展',
    usage: '安装反指纹用户脚本',
    steps: [
      {
        title: '第一步：理解什么是浏览器指纹',
        description: '浏览器指纹是一种识别技术，通过收集浏览器的各种特征来创建一个独特的"指纹"。收集的特征包括：1) User-Agent：浏览器名称、版本、操作系统；2) 屏幕分辨率和颜色深度：window.screen对象；3) 时区和语言：系统时区和语言设置；4) Canvas指纹：在Canvas上绘制特定图形产生的独特像素差异；5) WebGL指纹：显卡渲染器信息和WebGL参数；6) 字体列表：安装的系统字体；7) 插件列表：已安装的浏览器插件（如Flash）；8) 硬件信息：CPU核心数、GPU型号、内存大小；9) Audio指纹：音频处理生成的独特值；10) 电池状态：部分浏览器暴露的Battery API。这些特征组合起来，即使不用Cookie也能识别你。',
        note: '指纹识别不需要任何Cookies或本地存储，是最难防御的追踪方式'
      },
      {
        title: '第二步：安装用户脚本管理器Tampermonkey',
        description: '用户脚本管理器允许你运行自定义的JavaScript代码来修改网页行为。首先安装Tampermonkey：Chrome/Edge：在Chrome应用商店搜索"Tampermonkey"安装；Firefox：在附加组件商店搜索安装；其他浏览器：访问tampermonkey.net下载。安装完成后，浏览器右上角会出现Tampermonkey图标（一个黑色矩形）。点击图标可以管理脚本、添加新脚本、查看仪表板等。Tampermonkey支持GreasyFork和OpenUserJS等脚本托管平台的大量现成脚本。',
        note: '下载地址：tampermonkey.net 或各浏览器扩展商店'
      },
      {
        title: '第三步：安装Canvas Blocker扩展（推荐方式）',
        description: 'Canvas指纹是最常用的指纹技术，推荐使用Canvas Blocker扩展而不是纯脚本，因为它在内核层面拦截更有效。安装方法：扩展商店搜索"Canvas Blocker"或"Canvas Defender"。配置Canvas Blocker：点击扩展图标->Options->Mode，推荐选择"Fake Random"模式（随机虚假值）或"Prompt"模式（每次询问）。Fake模式下，所有网站会看到虚假的Canvas指纹，不同网站看到的值不同。Prompt模式下，你可以选择阻止、允许或使用虚假值。另一种选择是Canvas Defender，它为每个网站生成不同的噪声，使你无法被关联。',
        command: '扩展商店搜索 Canvas Blocker 或 Canvas Defender'
      },
      {
        title: '第四步：安装反指纹用户脚本（脚本方式）',
        description: '除了扩展，你也可以手动编写或安装用户脚本来防护指纹。在Tampermonkey中点击"+"号创建新脚本，删除默认内容，粘贴以下代码模板开始。这是一个拦截Canvas API的基础示例：\n\n// ==UserScript==\n// @name Anti-Fingerprint Basic\n// @namespace http://tampermonkey.net/\n// @version 1\n// @description 基础反指纹脚本\n// @match *://*/*\n// @grant none\n// ==/UserScript==\n\n(function() {\n  "use strict";\n  // Canvas指纹拦截代码\n})();',
        command: 'Tampermonkey面板->添加新脚本->粘贴代码模板'
      },
      {
        title: '第五步：拦截Canvas API（详细代码）',
        description: 'Canvas API被广泛用于生成指纹。在Tampermonkey中添加以下代码拦截：\n\n(function() {\n  "use strict";\n  // 保存原始方法\n  const origGetContext = HTMLCanvasElement.prototype.getContext;\n  \n  // 重写getContext\n  HTMLCanvasElement.prototype.getContext = function(type, attributes) {\n    const context = origGetContext.call(this, type, attributes);\n    if (type === "2d" && context) {\n      // 获取原始toDataURL和toBlob方法\n      const origToDataURL = context.toDataURL;\n      const origToBlob = context.toBlob;\n      \n      // 混淆getImageData\n      const origGetImageData = context.getImageData;\n      context.getImageData = function(sx, sy, sw, sh) {\n        const imageData = origGetImageData.call(this, sx, sy, sw, sh);\n        // 添加随机噪声\n        const data = imageData.data;\n        for (let i = 0; i < data.length; i += 4) {\n          data[i] = data[i] + (Math.random() - 0.5) * 2;\n          data[i+1] = data[i+1] + (Math.random() - 0.5) * 2;\n          data[i+2] = data[i+2] + (Math.random() - 0.5) * 2;\n        }\n        return imageData;\n      };\n      \n      // 混淆toDataURL\n      context.toDataURL = function() {\n        return origToDataURL.apply(this, arguments);\n      };\n    }\n    return context;\n  };\n})();',
        command: '在Tampermonkey中创建新脚本，粘贴此代码'
      },
      {
        title: '第六步：拦截WebGL API',
        description: 'WebGL用于获取GPU信息和渲染指纹。添加以下代码到Tampermonkey脚本中拦截WebGL指纹：\n\n(function() {\n  "use strict";\n  \n  // 存储原始getParameter\n  const origGetParameter = WebGLRenderingContext.prototype.getParameter;\n  const origGetExtension = WebGLRenderingContext.prototype.getExtension;\n  \n  // WebGL指纹参数表\n  const paramValues = {\n    37445: "Intel Open Source Technology Center", // VENDOR\n    37446: "Mesa DRI Intel(R) Ivybridge Mobile", // RENDERER\n  };\n  \n  WebGLRenderingContext.prototype.getParameter = function(param) {\n    if (paramValues.hasOwnProperty(param)) {\n      return paramValues[param];\n    }\n    return origGetParameter.call(this, param);\n  };\n  \n  // 随机化UNMASKED_VENDOR_WEBGL和UNMASKED_RENDERER_WEBGL\n  const vendorIdx = WebGLRenderingContext.prototype.getExtension ? \n    Object.getOwnPropertyNames(WebGLRenderingContext.prototype).indexOf("getParameter") : -1;\n})();',
        command: '在Tampermonkey脚本中添加WebGL拦截代码'
      },
      {
        title: '第七步：拦截Navigator API',
        description: 'Navigator对象包含大量指纹特征，包括userAgent、platform、language等。添加以下代码拦截：\n\n(function() {\n  "use strict";\n  \n  // 伪装User-Agent\n  Object.defineProperty(navigator, "userAgent", {\n    get: function() {\n      return "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";\n    }\n  });\n  \n  // 伪装平台\n  Object.defineProperty(navigator, "platform", {\n    get: function() {\n      return "Win32";\n    }\n  });\n  \n  // 随机化CPU核心数\n  Object.defineProperty(navigator, "hardwareConcurrency", {\n    get: function() {\n      return 4; // 返回一个常见的值\n    }\n  });\n  \n  // 伪装设备内存\n  Object.defineProperty(navigator, "deviceMemory", {\n    get: function() {\n      return 8;\n    }\n  });\n})();',
        command: '添加Navigator API拦截代码到Tampermonkey'
      },
      {
        title: '第八步：拦截Screen API',
        description: 'Screen对象暴露屏幕分辨率和颜色深度等特征：\n\n(function() {\n  "use strict";\n  \n  // 伪装屏幕分辨率\n  Object.defineProperty(screen, "availWidth", {\n    get: function() { return 1920; }\n  });\n  Object.defineProperty(screen, "availHeight", {\n    get: function() { return 1040; }\n  });\n  Object.defineProperty(screen, "width", {\n    get: function() { return 1920; }\n  });\n  Object.defineProperty(screen, "height", {\n    get: function() { { return 1080; }\n  });\n  \n  // 伪装颜色深度\n  Object.defineProperty(screen, "colorDepth", {\n    get: function() { return 24; }\n  });\n  \n  // 伪装像素比\n  Object.defineProperty(window, "devicePixelRatio", {\n    get: function() { return 1; }\n  });\n})();',
        command: '添加Screen API拦截代码'
      },
      {
        title: '第九步：使用现成的反指纹脚本',
        description: '除了自己编写，你也可以使用社区现成的脚本，更新维护更方便。推荐脚本网站：1) GreasyFork：greasyfork.org，搜索"fingerprint"找到反指纹脚本；2) OpenUserJS：openuserjs.org，同上有大量脚本。推荐的脚本包括：- "Canvas Blocker"（有扩展和脚本版本）；- "Privacy.sexy"；- "User-Agent Switcher"；- "Random User-Agent"。安装方法：在GreasyFork找到脚本，点击"安装此脚本"，Tampermonkey会弹出确认对话框，点击确认即可自动安装。建议同时安装多个互补的脚本以获得更全面的保护。',
        note: 'GreasyFork: greasyfork.org 搜索 anti-fingerprint'
      },
      {
        title: '第十步：测试指纹防护效果',
        description: '安装完防护措施后，需要测试效果。访问以下网站测试：1) amIunique.org：最权威的指纹测试，会告诉你你的指纹是否独特；2) coveryourtracks.eff.org：EFF的测试，会显示你的"独特性百分比"；3) browserleaks.com/canvas：专门测试Canvas指纹；4) browserleaks.com/webgl：测试WebGL指纹；5) browserleaks.com/fonts：测试字体指纹。理想的结果是：amIunique显示"不独特"，coveryourtracks显示"你是人群中普通的一个"。如果仍然显示独特，继续增强防护。',
        command: '访问 amIunique.org 和 coveryourtracks.eff.org 测试'
      },
      {
        title: '第十一步：Firefox的高级指纹防护配置',
        description: 'Firefox有内置的指纹防护功能。在Firefox中优化指纹防护：1) 地址栏输入about:config；2) 搜索privacy.resistFingerprinting，设为true；3) 这个设置会统一所有用户的指纹，使你融入人群。配合Canvas Blocker等扩展效果更好。注意：启用resistFingerprinting可能导致某些网站显示异常（如视频播放问题），可以针对特定网站禁用。添加网站到例外：about:config中搜索privacy.resistFingerprinting.block_list，添加不需要防护的域名。',
        command: 'Firefox about:config 设置 privacy.resistFingerprinting=true'
      },
      {
        title: '第十二步：使用Tor浏览器（终极方案）',
        description: 'Tor浏览器提供了最全面的指纹防护。它基于Firefox，内置了：1) 统一的浏览器指纹，所有Tor用户看起来完全一样；2) 阻止Canvas和WebGL指纹；3) 限制字体指纹；4) 禁用或伪装大量可识别的API。使用方法：1) 下载Tor浏览器：torproject.org/download；2) 安装后启动，它会自动连接Tor网络；3) 第一次启动可能需要几分钟配置；4) 使用专门的Tor浏览器窗口浏览，不要和普通浏览器混用。限制：速度较慢，某些网站可能无法访问，下载大文件效率低。不要安装额外的扩展，不要登录真实账号，不要调整窗口大小（窗口大小也是指纹）。',
        command: '下载Tor: torproject.org/download'
      }
    ],
    examples: [
      {
        title: '完整的反指纹脚本示例',
        input: 'Tampermonkey完整脚本模板',
        output: '// ==UserScript==\n// @name Complete Anti-Fingerprint\n// @namespace http://tampermonkey.net/\n// @version 1.0\n// @description 完整的浏览器指纹防护脚本\n// @match *://*/*\n// @grant none\n// ==/UserScript==\n\n(function() {\n  "use strict";\n  \n  // Canvas防护\n  const origCanvasGetContext = HTMLCanvasElement.prototype.getContext;\n  HTMLCanvasElement.prototype.getContext = function(type, ...args) {\n    const ctx = origCanvasGetContext.call(this, type, ...args);\n    if (type === "2d" && ctx) {\n      const origGetImageData = ctx.getImageData.bind(ctx);\n      ctx.getImageData = function(...args) {\n        const data = origGetImageData(...args);\n        // 添加噪声\n        for (let i = 0; i < data.data.length; i += 4) {\n          data.data[i] += Math.random() * 0.1;\n        }\n        return data;\n      };\n    }\n    return ctx;\n  };\n  \n  // Navigator防护\n  Object.defineProperty(navigator, "userAgent", {\n    get: () => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"\n  });\n  \n  // Screen防护\n  Object.defineProperty(screen, "width", { get: () => 1920 });\n  Object.defineProperty(screen, "height", { get: () => 1080 });\n})();',
        explanation: '这是一个综合的反指纹脚本模板，涵盖了最常用的防护点'
      },
      {
        title: '指纹防护效果测试网站',
        input: '访问以下网站测试',
        output: '1. amIunique.org - 查看指纹是否独特\n2. coveryourtracks.eff.org - EFF指纹测试\n3. browserleaks.com - 全面指纹检测\n4. privacytests.org - Firefox专用测试\n5. dnsleaktest.com - DNS泄露测试\n6. ipleak.net - IP和WebRTC泄露测试\n\n测试前：应该显示你的真实指纹特征\n测试后（启用防护后）：应该显示虚假或统一的特征',
        explanation: '这些网站可以帮助你验证指纹防护是否有效'
      }
    ],
    tips: [
      '使用Firefox + Canvas Blocker + Tor Browser组合效果最佳',
      '不要禁用JavaScript，否则会产生更独特的指纹',
      '使用标准的屏幕分辨率和时区，避免成为少数派',
      '定期更新反指纹脚本，因为网站会更新检测技术',
      '考虑使用多台设备分别用于不同用途',
      '隐私保护不是一次配置就完事，需要持续关注和更新',
      'Tor浏览器是最强的指纹防护，但使用不便',
      '组合使用多种防护比单一方法更有效'
    ],
    warnings: [
      '过度的指纹随机化可能产生反效果，使你更独特',
      '某些网站会检测并阻止使用反指纹工具的用户',
      'Tampermonkey脚本可能被恶意利用，只安装可信来源的脚本',
      '反指纹脚本可能影响某些网站的正常功能',
      '指纹只是隐私保护的一个方面，还有DNS、WebRTC等需要防护',
      '浏览器之外的因素（输入法、操作系统）也可能泄露信息',
      '技术防护不能替代良好的隐私习惯',
      '不要在受信任的网站上随意安装用户脚本'
    ],
    tags: ['浏览器指纹', 'Canvas', 'WebGL', '反追踪', '用户脚本', 'Tampermonkey', '高级隐私']
  },

  // ==================== WiFi与物联网安全 ====================
  {
    id: 'wifi-security-guide',
    name: 'WiFi安全防护完整指南（防止被蹭网和监控）',
    description: '详细讲解如何保护你的WiFi网络不被他人蹭网、监控和攻击，包括路由器安全设置、加密配置、访客网络隔离等',
    category: '隐私保护',
    subcategory: 'WiFi安全',
    language: 'Router Config',
    platform: ['路由器', 'Windows', 'macOS'],
    difficulty: 'easy',
    author: '安全研究',
    features: ['路由器安全设置', '防止蹭网', '防止WiFi监控', '访客网络隔离', '隐藏SSID'],
    requirements: ['拥有路由器的管理权限', '能够访问路由器管理页面', '基本的网络知识'],
    installation: '登录路由器管理页面进行配置',
    usage: '修改路由器设置后保存生效',
    steps: [
      {
        title: '第一步：了解WiFi安全风险',
        description: 'WiFi网络面临的安全风险包括：1) 蹭网：他人连接你的WiFi占用带宽，可能进行非法活动；2) 中间人攻击：攻击者拦截你与网站之间的通信，窃取密码和敏感数据；3) WiFi监控：攻击者监控你的网络流量，查看你访问的网站和传输的内容；4) 路由器入侵：攻击者获取路由器控制权，可以监控所有设备、修改DNS设置、植入恶意软件；5) 恶意热点：攻击者创建同名热点诱骗你连接。了解这些风险才能更好地防护。',
        note: 'WiFi安全是家庭网络安全的第一道防线，必须重视'
      },
      {
        title: '第二步：登录路由器管理页面',
        description: '首先需要登录路由器管理页面进行配置。常见路由器管理地址：TP-Link: 192.168.1.1 或 tplinkwifi.net；华为: 192.168.3.1；小米: 192.168.31.1 或 miwifi.com；华硕: 192.168.1.1 或 router.asus.com；Netgear: 192.168.1.1 或 routerlogin.net。在浏览器地址栏输入管理地址，回车后输入用户名和密码（默认通常在路由器背面标签上）。强烈建议首次登录后立即修改默认密码！',
        command: '浏览器访问 192.168.1.1 或路由器说明书上的管理地址'
      },
      {
        title: '第三步：修改路由器管理员密码',
        description: '这是最重要的安全设置！默认密码通常很简单（如admin/admin、admin/123456），攻击者很容易猜到。修改方法：登录管理页面后，找到"系统设置"或"管理设置"中的"管理员密码"或"登录密码"选项。新密码要求：至少12位，包含大小写字母、数字和特殊符号，不要使用生日、手机号等容易猜测的信息。修改后保存，以后每次登录都需要新密码。建议将密码写在纸上贴在路由器背面（仅限家庭内部使用）。',
        note: '管理员密码是保护路由器的关键，务必设置强密码'
      },
      {
        title: '第四步：设置WPA3或WPA2-PSK加密',
        description: 'WiFi加密方式决定了他人能否破解你的密码。加密方式选择：WPA3-PSK（最新最安全，但部分旧设备不支持）；WPA2-PSK（AES加密，目前最常用，安全性高）；WPA-PSK（较老，不推荐）；WEP（极不安全，已被破解，绝对不要使用）。设置方法：在路由器管理页面找到"无线设置"或"WiFi设置"，选择加密方式为WPA2-PSK或WPA3-PSK，加密算法选择AES。设置WiFi密码：至少8位，建议12位以上，包含大小写字母、数字和符号。',
        command: '路由器设置: 无线设置 -> 安全设置 -> WPA2-PSK(AES)'
      },
      {
        title: '第五步：隐藏WiFi名称（SSID）',
        description: '隐藏SSID可以让你的WiFi不在周围设备的扫描列表中显示，减少被发现和攻击的概率。设置方法：在路由器管理页面找到"无线设置"或"基本设置"，找到"隐藏SSID"或"关闭广播"选项，勾选启用。隐藏后，新设备需要手动输入WiFi名称和密码才能连接。已连接的设备不受影响。注意：隐藏SSID不是绝对安全，专业工具仍可发现隐藏的网络，但可以防止普通蹭网者。',
        command: '路由器设置: 无线设置 -> 隐藏SSID -> 启用'
      },
      {
        title: '第六步：设置访客网络',
        description: '访客网络可以让客人上网，但与你的主网络隔离，防止他们访问你的电脑、手机和智能家居设备。设置方法：在路由器管理页面找到"访客网络"或"Guest Network"选项，启用访客网络。设置独立的WiFi名称（如"Guest-xxx"）和密码。关键设置：启用"客户端隔离"或"AP隔离"，防止访客设备之间通信；禁用"访问内网资源"，防止访客访问你的局域网设备；限制访客网络带宽，防止占用过多流量。',
        command: '路由器设置: 访客网络 -> 启用 -> 客户端隔离'
      },
      {
        title: '第七步：关闭WPS功能',
        description: 'WPS（WiFi Protected Setup）是一种简化连接的功能，但存在严重安全漏洞，可以在几小时内被破解。关闭方法：在路由器管理页面找到"WPS设置"或"一键加密"选项，将其关闭或禁用。部分路由器WPS按钮是物理按钮，建议不要按下。关闭WPS后，连接WiFi需要手动输入密码，虽然麻烦但更安全。如果路由器不支持关闭WPS，建议更换路由器。',
        command: '路由器设置: WPS设置 -> 关闭/禁用'
      },
      {
        title: '第八步：关闭远程管理功能',
        description: '远程管理允许从互联网访问路由器管理页面，存在被攻击的风险。关闭方法：在路由器管理页面找到"远程管理"或"Web管理"或"远程访问"选项，将其关闭或禁用。如果确实需要远程管理（如出差时管理家里网络），必须：修改远程管理端口（不要用80或8080）；设置访问IP白名单（只允许特定IP访问）；使用HTTPS加密连接；设置非常复杂的管理员密码。',
        command: '路由器设置: 远程管理 -> 关闭'
      },
      {
        title: '第九步：设置MAC地址过滤（可选）',
        description: 'MAC地址过滤可以只允许特定设备连接WiFi。设置方法：在路由器管理页面找到"MAC地址过滤"或"访问控制"选项。选择"允许模式"（只允许列表中的设备连接）。添加设备MAC地址：在设备上查看MAC地址（Windows: ipconfig /all，Mac: 系统偏好设置->网络->高级->硬件，手机: 设置->WiFi->点击已连接网络查看）。注意：MAC地址可以被伪造，专业攻击者可以绕过此限制，但可以防止普通蹭网者。',
        command: '路由器设置: MAC过滤 -> 允许模式 -> 添加设备MAC'
      },
      {
        title: '第十步：修改WiFi名称避免暴露信息',
        description: 'WiFi名称（SSID）不要包含个人信息，如姓名、地址、手机号等。攻击者可能利用这些信息进行针对性攻击。建议使用中性名称：如"HomeWiFi"、"Network123"等，不要用"张三的家"、"朝阳区xxx小区"等。也不要用挑衅性名称如"黑客来试试"，可能引来攻击。定期更换WiFi名称和密码（建议每3-6个月）可以增加安全性。',
        note: 'WiFi名称不要暴露任何个人信息'
      },
      {
        title: '第十一步：检查已连接设备列表',
        description: '定期检查路由器的已连接设备列表，发现未知设备。检查方法：在路由器管理页面找到"已连接设备"或"客户端列表"或"DHCP客户端"选项。查看列表中的设备，核对MAC地址和设备名称。发现未知设备：如果发现不认识的设备，可能是蹭网者，立即修改WiFi密码；如果发现奇怪设备名称（如"黑客"、"attack"等），立即断开并修改密码。建议每周检查一次。',
        command: '路由器设置: 已连接设备 -> 查看列表'
      },
      {
        title: '第十二步：更新路由器固件',
        description: '路由器固件更新可以修复安全漏洞，提升安全性。更新方法：在路由器管理页面找到"系统工具"或"固件升级"选项。检查是否有新版本，如有则下载更新。部分路由器支持自动更新，建议启用。更新注意事项：更新过程中不要断电，否则可能损坏路由器；更新后可能需要重新配置部分设置；如果路由器太旧没有更新，建议更换新路由器。',
        command: '路由器设置: 系统工具 -> 固件升级 -> 检查更新'
      },
      {
        title: '第十三步：设置DNS服务器',
        description: 'DNS服务器影响你访问网站的解析，使用可信DNS可以防止DNS劫持和钓鱼。设置方法：在路由器管理页面找到"网络设置"或"WAN设置"或"DNS设置"选项。将DNS服务器设置为：首选DNS: 1.1.1.1（Cloudflare隐私DNS）；备用DNS: 8.8.8.8（Google DNS）或 9.9.9.9（Quad9安全DNS）。不要使用ISP默认DNS，他们可能记录你的访问记录。Cloudflare DNS承诺不记录IP地址，Quad9还会拦截恶意网站。',
        command: '路由器DNS设置: 首选 1.1.1.1 备用 8.8.8.8'
      },
      {
        title: '第十四步：防止WiFi钓鱼（恶意热点）',
        description: 'WiFi钓鱼是攻击者创建与你WiFi同名的热点，诱骗你连接。识别方法：连接WiFi时注意名称是否完全一致（包括大小写）；如果突然出现两个同名WiFi，其中一个可能是钓鱼；连接后如果弹出奇怪的登录页面，可能是钓鱼。防护措施：设置复杂的WiFi名称（包含特殊字符）；记住你的WiFi名称和密码，不要随意连接同名网络；在公共场所不要连接陌生WiFi；使用VPN加密通信，即使连接钓鱼WiFi也无法窃取内容。',
        note: '公共场所WiFi风险最高，建议使用VPN或手机热点'
      }
    ],
    examples: [
      {
        title: '路由器安全配置检查清单',
        input: '检查以下设置是否完成',
        output: '1. 管理员密码已修改为强密码\n2. WiFi加密方式为WPA2-PSK或WPA3\n3. WiFi密码为12位以上复杂密码\n4. SSID已隐藏或不包含个人信息\n5. WPS功能已关闭\n6. 远程管理已关闭\n7. 访客网络已启用并隔离\n8. DNS已设置为隐私DNS\n9. 固件已更新到最新版本\n10. 已连接设备列表已检查',
        explanation: '完成以上检查可以确保WiFi基本安全'
      },
      {
        title: '发现蹭网者后的处理',
        input: '发现未知设备连接WiFi',
        output: '步骤:\n1. 立即断开该设备（路由器管理页面操作）\n2. 修改WiFi密码\n3. 检查是否启用了WPS，如有则关闭\n4. 检查WiFi密码是否太简单\n5. 考虑启用MAC地址过滤\n6. 检查路由器是否有漏洞并更新固件',
        explanation: '发现蹭网后立即采取措施防止再次发生'
      }
    ],
    tips: [
      '路由器放在房屋中心位置，信号覆盖更均匀，减少外部接收',
      '定期（每3-6个月）更换WiFi密码',
      '不要将WiFi密码告诉陌生人或写在显眼位置',
      '智能电视、智能音箱等设备也需要安全设置',
      '公共WiFi风险极高，使用VPN或手机热点',
      '酒店WiFi尤其危险，不要登录重要账号',
      '邻居的WiFi也可能被攻击，不要随意连接',
      '5GHz频段比2.4GHz更安全，穿墙能力弱但干扰少'
    ],
    warnings: [
      '默认密码必须修改，否则路由器可被轻易入侵',
      'WEP加密已被完全破解，绝对不要使用',
      'WPS功能存在严重漏洞，必须关闭',
      '远程管理功能风险极高，建议关闭',
      '路由器被入侵后所有设备都可能被监控',
      '不要连接名称相似的陌生WiFi',
      '公共WiFi不要登录银行、支付等敏感账号',
      'WiFi密码泄露后立即修改'
    ],
    tags: ['WiFi安全', '路由器', '蹭网防护', 'WPA2', 'WPS', '访客网络', 'DNS']
  },

  {
    id: 'smart-home-security',
    name: '智能家居与物联网设备安全指南',
    description: '详细讲解如何保护智能电视、智能音箱、智能摄像头、智能门锁等物联网设备不被远程控制和监控',
    category: '隐私保护',
    subcategory: '物联网安全',
    language: 'Device Config',
    platform: ['智能电视', '智能音箱', '智能摄像头', '智能门锁', '智能插座'],
    difficulty: 'easy',
    author: '安全研究',
    features: ['智能摄像头安全', '智能音箱隐私', '智能电视防护', '智能门锁安全', '设备隔离'],
    requirements: ['拥有智能设备的控制权', '能够访问设备设置', '了解设备型号和品牌'],
    installation: '在各设备APP或设置页面配置',
    usage: '修改设备安全设置后生效',
    steps: [
      {
        title: '第一步：了解物联网设备风险',
        description: '智能家居设备面临的风险：1) 远程监控：智能摄像头可能被黑客入侵，实时监控你的家庭；2) 语音窃听：智能音箱可能被激活录音，窃取私人对话；3) 视频窃取：智能电视可能被入侵，观看内容被记录；4) 门锁控制：智能门锁可能被远程打开，造成安全隐患；5) 设备劫持：设备被加入僵尸网络，用于攻击其他目标；6) 数据泄露：设备收集的语音、视频、位置数据可能被泄露。了解风险才能针对性防护。',
        note: '物联网设备是家庭隐私的重要风险点，必须重视'
      },
      {
        title: '第二步：智能摄像头安全设置',
        description: '智能摄像头是最危险的设备，可能被远程监控。安全设置：1) 修改默认密码：首次使用立即修改，密码要复杂（12位以上）；2) 禁用远程查看：如不需要远程查看，在APP中关闭此功能；3) 启用移动检测：只在检测到移动时录像，减少数据传输；4) 设置录像存储位置：优先本地存储（SD卡），减少云端泄露风险；5) 定期检查观看记录：在APP中查看谁在什么时间观看了录像；6) 物理遮挡：不需要时用盖子遮挡镜头。推荐品牌：选择有安全认证的品牌（如小米、华为、TP-Link），避免杂牌。',
        command: '摄像头APP: 设置 -> 安全设置 -> 修改密码 -> 关闭远程查看'
      },
      {
        title: '第三步：智能音箱隐私设置',
        description: '智能音箱（如小米音箱、天猫精灵、小度音箱）会收集语音数据。隐私设置：1) 关闭语音历史记录：在APP中找到"隐私设置"，关闭"保存语音记录"；2) 删除历史语音：定期删除已保存的语音指令；3) 关闭麦克风：不需要时物理关闭麦克风（部分音箱有开关）；4) 禁用"始终聆听"：改为"按键唤醒"，减少误触发录音；5) 限制技能权限：检查已安装的技能/插件，删除不需要的；6) 关闭购物功能：防止语音误触发购物。注意：智能音箱可能在你不知情时录音，敏感对话时建议关闭。',
        command: '音箱APP: 设置 -> 隐私设置 -> 关闭语音记录 -> 删除历史'
      },
      {
        title: '第四步：智能电视安全设置',
        description: '智能电视可能收集观看数据和语音信息。安全设置：1) 关闭语音控制：如不需要语音控制，在设置中关闭；2) 关闭观看数据收集：在隐私设置中关闭"收集观看数据"或"个性化推荐"；3) 限制应用权限：检查已安装应用，删除不需要的，限制权限；4) 关闭自动内容识别（ACR）：此功能会识别你观看的所有内容并上报；5) 定期清理缓存：在存储设置中清理缓存数据；6) 不登录账号：如不需要同步功能，不登录账号可以减少数据收集。',
        command: '电视设置: 系统 -> 隐私 -> 关闭数据收集 -> 关闭语音控制'
      },
      {
        title: '第五步：智能门锁安全设置',
        description: '智能门锁关系到家庭安全，必须谨慎设置。安全设置：1) 修改管理员密码：首次使用立即修改，密码要复杂；2) 设置临时密码：给访客设置临时密码，过期自动失效；3) 关闭远程开锁：如不需要，关闭远程开锁功能；4) 启用开锁记录：记录每次开锁时间和方式，定期检查；5) 设置异常报警：多次密码错误时报警；6) 保留物理钥匙：智能锁故障时可以物理开锁；7) 定期更换电池：电量不足可能导致功能异常；8) 检查固件更新：及时更新修复漏洞。',
        command: '门锁APP: 设置 -> 安全设置 -> 修改密码 -> 启用开锁记录'
      },
      {
        title: '第六步：智能插座和开关安全',
        description: '智能插座虽然风险较低，但也可能被控制。安全设置：1) 修改默认密码：首次使用修改密码；2) 关闭远程控制：如不需要远程开关，关闭此功能；3) 设置定时规则：使用定时功能而非远程控制，减少网络暴露；4) 不连接重要设备：不要将智能插座用于关键设备（如安防系统）；5) 检查用电记录：异常用电可能是被远程控制。建议：智能插座主要用于灯具等非关键设备。',
        command: '插座APP: 设置 -> 关闭远程控制 -> 设置定时规则'
      },
      {
        title: '第七步：将物联网设备隔离到独立网络',
        description: '将智能设备与电脑手机隔离，即使设备被入侵也无法攻击其他设备。隔离方法：1) 创建独立WiFi：在路由器设置中创建专门用于智能设备的WiFi（如"IoT-Devices"）；2) 启用网络隔离：在路由器设置中启用"AP隔离"或"客户端隔离"，防止设备间通信；3) 限制带宽：给智能设备网络设置较低带宽，防止被利用攻击；4) 禁止访问内网：设置路由器防火墙规则，禁止智能设备网络访问主网络。部分高端路由器支持"物联网网络"功能，可以直接启用。',
        command: '路由器设置: 创建IoT WiFi -> 启用AP隔离 -> 禁止访问内网'
      },
      {
        title: '第八步：定期检查设备固件更新',
        description: '固件更新可以修复安全漏洞。检查方法：在各设备APP中找到"设置"->"关于"->"检查更新"，如有新版本立即更新。部分设备支持自动更新，建议启用。更新注意事项：更新过程中设备可能无法使用；更新后检查设置是否被重置；如果设备太旧没有更新，考虑更换。建议每月检查一次所有设备的固件版本。',
        command: '各设备APP: 设置 -> 关于 -> 检查更新'
      },
      {
        title: '第九步：检查设备账号安全',
        description: '智能设备通常需要账号登录，账号安全很重要。检查方法：1) 修改账号密码：使用强密码，不要与其他账号共用；2) 启用两步验证：如有此功能，务必启用；3) 检查登录记录：查看是否有异常登录；4) 绑定手机/邮箱：确保可以找回账号；5) 不要使用社交账号登录：避免社交账号泄露影响设备；6) 定期更换密码：建议每3-6个月更换。',
        command: '设备APP: 账号设置 -> 安全设置 -> 启用两步验证'
      },
      {
        title: '第十步：关闭不需要的功能',
        description: '减少功能可以减少风险。关闭建议：1) 远程控制：如不需要远程操作，关闭此功能；2) 云存储：优先使用本地存储，减少云端风险；3) 语音控制：如不需要，关闭语音唤醒；4) 社交分享：关闭将数据分享到社交平台的功能；5) 第三方集成：关闭与第三方服务的连接；6) 自动化场景：检查自动化规则，删除不需要的。原则：只启用必要功能，其他全部关闭。',
        command: '各设备APP: 设置 -> 功能管理 -> 关闭不需要的功能'
      },
      {
        title: '第十一步：物理安全措施',
        description: '物理措施是最可靠的防护。建议：1) 摄像头遮挡：不需要时遮挡镜头；2) 音箱静音：敏感对话时关闭麦克风；3) 断电：长期不在家时断开智能设备电源；4) 遮挡屏幕：智能电视不需要时遮挡屏幕；5) 物理钥匙：智能门锁保留物理钥匙备用；6) 位置选择：摄像头不要对着卧室、浴室等私密区域；7) 设备数量：减少不必要的智能设备，每台设备都是风险点。',
        note: '物理措施是最安全的防护，建议配合使用'
      },
      {
        title: '第十二步：选择安全的品牌',
        description: '品牌选择影响设备安全性。推荐品牌：小米/米家（国内安全认证，定期更新）；华为HiLink（企业级安全）；TP-Link（网络安全品牌）；Apple HomeKit（苹果安全标准）；Amazon Alexa（国际安全认证）。避免品牌：无品牌/杂牌（无安全更新，漏洞多）；小众品牌（安全投入少）；二手设备（可能被篡改）；破解版设备（安全功能被禁用）。购买前查看：是否有安全认证；是否有定期固件更新；是否有隐私政策；用户评价中是否有安全问题。',
        note: '选择大品牌可以降低安全风险'
      }
    ],
    examples: [
      {
        title: '智能家居安全检查清单',
        input: '检查以下设置是否完成',
        output: '1. 所有设备密码已修改为强密码\n2. 不需要的远程功能已关闭\n3. 语音历史记录已关闭并删除\n4. 观看数据收集已关闭\n5. 摄像头已设置遮挡\n6. 设备已隔离到独立网络\n7. 固件已更新到最新版本\n8. 账号已启用两步验证\n9. 开锁/观看记录定期检查\n10. 不需要的设备已断电',
        explanation: '完成以上检查可以确保智能家居基本安全'
      },
      {
        title: '发现设备异常时的处理',
        input: '发现智能设备有异常行为',
        output: '步骤:\n1. 立即断开设备电源\n2. 检查设备账号是否有异常登录\n3. 修改设备密码和账号密码\n4. 检查设备固件是否需要更新\n5. 检查是否有未授权的用户\n6. 恢复出厂设置重新配置\n7. 如仍异常，联系厂商或更换设备',
        explanation: '发现异常立即采取措施防止进一步风险'
      }
    ],
    tips: [
      '减少智能设备数量，每台设备都是潜在风险',
      '摄像头不要对着私密区域（卧室、浴室）',
      '敏感对话时关闭智能音箱麦克风',
      '长期外出时断开智能设备电源',
      '定期检查设备登录和操作记录',
      '不要使用破解版或二手智能设备',
      '智能门锁必须保留物理钥匙备用',
      '选择有安全认证的大品牌设备'
    ],
    warnings: [
      '智能摄像头可能被远程监控，必须设置强密码',
      '智能音箱可能在不知情时录音，敏感对话要关闭',
      '智能门锁被入侵可能导致财产损失',
      '杂牌设备通常没有安全更新，漏洞多',
      '设备账号密码不要与其他账号共用',
      '不要将摄像头放在私密区域',
      '远程功能增加风险，不需要时关闭',
      '设备固件必须定期更新修复漏洞'
    ],
    tags: ['智能家居', '物联网', '智能摄像头', '智能音箱', '智能门锁', '设备隔离', '隐私保护']
  },

  {
    id: 'mobile-phone-privacy',
    name: '手机隐私保护完整指南（iOS/Android）',
    description: '详细讲解如何保护手机隐私，防止被监控、追踪和数据泄露，包括定位隐私、应用权限、数据加密等',
    category: '隐私保护',
    subcategory: '手机安全',
    language: 'iOS/Android Settings',
    platform: ['iOS', 'Android'],
    difficulty: 'easy',
    author: '安全研究',
    features: ['定位隐私保护', '应用权限管理', '数据加密', '追踪防护', '安全备份'],
    requirements: ['智能手机', '能够访问系统设置', '了解手机型号和系统版本'],
    installation: '在手机设置中进行配置',
    usage: '修改设置后立即生效',
    steps: [
      {
        title: '第一步：了解手机隐私风险',
        description: '手机面临的隐私风险：1) 定位追踪：GPS定位可以追踪你的实时位置和历史轨迹；2) 应用权限滥用：应用可能获取不必要的权限（如通讯录、相机、麦克风）；3) 数据收集：应用可能收集你的通话记录、短信、浏览历史等；4) 广告追踪：广告商通过IDFA/GAID追踪你的行为；5) 云端泄露：备份数据可能泄露隐私；6) 恶意软件：恶意应用可能窃取数据或监控；7) WiFi/蓝牙追踪：商场等场所通过WiFi/蓝牙追踪顾客。了解风险才能针对性防护。',
        note: '手机是最重要的隐私设备，必须全面保护'
      },
      {
        title: '第二步：iOS定位隐私设置',
        description: 'iPhone定位设置路径：设置->隐私与安全->定位服务。关键设置：1) 关闭不需要定位的应用：逐个检查应用，将不需要定位的应用设为"永不"；2) 使用"使用期间"：需要定位的应用（如地图）设为"使用期间"，而非"始终"；3) 关闭"重要地点"：系统设置->隐私与安全->定位服务->系统服务->重要地点，关闭此功能，防止记录常去地点；4) 关闭"基于位置的提醒"和"基于位置的建议"；5) 关闭"显著地点"历史记录清除：定期清除已记录的地点历史。',
        command: 'iOS: 设置 -> 隐私与安全 -> 定位服务 -> 逐个设置应用权限'
      },
      {
        title: '第三步：Android定位隐私设置',
        description: 'Android定位设置路径：设置->位置信息（或隐私->权限管理器->位置）。关键设置：1) 关闭位置信息：不需要时完全关闭GPS；2) 应用权限管理：逐个检查应用位置权限，关闭不需要的；3) 关闭位置历史：Google设置->位置共享->位置历史，关闭并删除历史；4) 关闭Google位置记录：账户设置->数据与隐私->位置记录，关闭；5) 关闭"改进位置精度"：设置->位置信息->Google位置精度，关闭；6) 使用临时权限：Android 12+支持"仅本次允许"，优先选择。',
        command: 'Android: 设置 -> 位置信息 -> 应用权限 -> 逐个关闭'
      },
      {
        title: '第四步：iOS应用权限管理',
        description: 'iPhone应用权限设置：设置->隐私与安全。逐个检查以下权限：1) 相机：只给需要拍照的应用（如相机、微信），其他关闭；2) 麦克风：只给需要录音的应用，其他关闭；3) 通讯录：只给需要的应用（如微信、WhatsApp），其他关闭；4) 照片：选择"所选照片"，只给必要照片访问权限；5) 日历/提醒事项：关闭不需要的应用权限；6) 健康/运动：关闭不需要的应用权限；7) 文件与文件夹：限制应用访问文件；8) 蓝牙：关闭不需要的应用权限；9) 本地网络：关闭不需要的应用权限。',
        command: 'iOS: 设置 -> 隐私与安全 -> 逐个检查各权限'
      },
      {
        title: '第五步：Android应用权限管理',
        description: 'Android应用权限设置：设置->隐私->权限管理器（或应用->应用权限）。逐个检查：1) 位置：关闭不需要的应用；2) 相机：只给需要的应用；3) 麦克风：只给需要的应用；4) 通讯录/电话：关闭不需要的应用；5) 照片/媒体：限制访问范围；6) 存储空间：Android 11+使用分区存储，限制访问；7) 附近设备：关闭不需要的应用；8) 传感器：关闭身体活动等传感器权限；9) 应用列表：Android 12+限制应用查看已安装应用列表。建议使用系统自带权限管理器，不要用第三方权限管理应用。',
        command: 'Android: 设置 -> 隐私 -> 权限管理器 -> 逐个检查'
      },
      {
        title: '第六步：关闭广告追踪（IDFA/GAID）',
        description: '广告商通过广告ID追踪你的行为。iOS关闭方法：设置->隐私与安全->Apple广告->个性化广告，关闭。iOS 14.5+还支持应用追踪透明度：设置->隐私与安全->追踪，逐个拒绝应用的追踪请求。Android关闭方法：设置->Google设置->广告->删除广告ID或重置广告ID。部分Android手机在设置->隐私->广告中关闭"个性化广告"。关闭后广告商无法通过广告ID追踪你，但仍可能通过其他方式追踪。',
        command: 'iOS: 设置 -> 隐私与安全 -> 追踪 -> 要求应用不追踪'
      },
      {
        title: '第七步：iOS系统隐私设置',
        description: 'iPhone系统级隐私设置：设置->隐私与安全->分析改进：关闭"共享iPhone分析"和"共享iCloud分析"，防止数据发送给Apple。设置->隐私与安全->Apple广告：关闭"个性化广告"。设置->Safari浏览器：启用"防止跨网站追踪"，启用"隐藏IP地址"，启用"检查已知欺诈网站"。设置->邮件：启用"保护邮件活动"。设置->隐私与安全->App隐私报告：查看各应用实际使用的权限和数据访问。',
        command: 'iOS: 设置 -> 隐私与安全 -> 分析改进 -> 全部关闭'
      },
      {
        title: '第八步：Android系统隐私设置',
        description: 'Android系统级隐私设置：设置->Google->数据与隐私：关闭"位置记录"、"网页和应用活动"、"YouTube历史记录"。设置->隐私->使用与诊断：关闭"发送使用与诊断数据"。设置->隐私->广告：关闭"个性化广告"。设置->隐私->权限管理器->附近设备：关闭不需要的应用。Chrome浏览器设置：关闭"同步"，关闭"自动填充"，清除浏览数据。使用隐私浏览器：Firefox Focus、DuckDuckGo浏览器。',
        command: 'Android: 设置 -> Google -> 数据与隐私 -> 关闭位置记录'
      },
      {
        title: '第九步：手机数据加密',
        description: '加密可以防止数据被窃取。iOS加密：iPhone默认启用全盘加密，确保设置强密码（6位以上数字或复杂密码），Touch ID/Face ID只是便捷解锁，密码才是加密密钥。设置->面容ID与密码：设置强密码，启用"数据擦除"（10次错误密码后擦除数据）。Android加密：设置->安全->加密与凭据，确保"加密手机"已启用。设置->安全->屏幕锁定：设置强密码或PIN（不要用简单图案）。Android 10+默认启用加密，但需要设置强密码才能有效。',
        command: 'iOS: 设置 -> 面容ID与密码 -> 设置强密码 -> 启用数据擦除'
      },
      {
        title: '第十步：安全备份设置',
        description: '备份数据也需要保护。iOS备份：iCloud备份默认加密，但建议启用"高级数据保护"（端到端加密）：设置->iCloud->高级数据保护->启用。本地备份（iTunes/Finder）：勾选"加密本地备份"，设置备份密码。Android备份：Google备份默认不是端到端加密，敏感数据建议本地备份。设置->Google->备份：关闭不需要的备份项目。敏感数据（如密码、私密照片）不要备份到云端，使用本地加密存储。',
        command: 'iOS: 设置 -> iCloud -> 高级数据保护 -> 启用'
      },
      {
        title: '第十一步：关闭不必要的连接功能',
        description: 'WiFi/蓝牙/NFC可能被用于追踪。关闭方法：iOS：控制中心关闭WiFi和蓝牙（注意：这只是断开连接，完全关闭需要在设置中操作）。设置->蓝牙：关闭不需要的设备连接。设置->WiFi：关闭"自动加入热点"，关闭"询问是否加入网络"。Android：设置->网络和互联网->WiFi：关闭"自动开启WiFi"，关闭"网络推荐"。设置->连接->蓝牙：关闭不需要的设备。设置->连接->NFC：不需要时关闭。外出时关闭WiFi和蓝牙可以防止商场等场所追踪。',
        command: '外出时关闭WiFi和蓝牙防止追踪'
      },
      {
        title: '第十二步：检查应用安全',
        description: '应用是主要风险来源。检查方法：iOS：设置->隐私与安全->App隐私报告，查看各应用实际访问的权限和数据。发现异常：如果某应用频繁访问位置、相机、麦克风但你不知道原因，立即卸载。Android：设置->隐私->权限管理器，查看各权限被哪些应用使用。定期检查：每月检查一次已安装应用，卸载不需要的应用。安装来源：只从官方应用商店安装，不要安装第三方来源应用。iOS不要越狱，Android不要root，这会大大增加风险。',
        command: 'iOS: 设置 -> 隐私与安全 -> App隐私报告 -> 查看应用行为'
      },
      {
        title: '第十三步：使用隐私保护应用',
        description: '推荐隐私保护应用：浏览器：Firefox Focus（自动清除历史）、DuckDuckGo浏览器（不追踪）、Brave（广告拦截）。密码管理：Bitwarden（开源免费）、1Password（付费但安全）。加密通讯：Signal（端到端加密）、Telegram（可选加密）。VPN：Mullvad（匿名付费）、ProtonVPN（瑞士隐私法）。文件加密：Cryptomator（云端加密）、Veracrypt（本地加密）。注意：不要使用来历不明的"隐私保护"应用，可能本身就是恶意软件。',
        note: '选择开源、可信的隐私保护应用'
      },
      {
        title: '第十四步：手机丢失后的处理',
        description: '手机丢失后立即采取措施：iOS：登录iCloud.com，使用"查找"功能定位或标记为丢失。标记为丢失会锁定手机并显示联系信息。如确定无法找回，使用"抹掉iPhone"远程清除数据。Android：登录android.com/find，使用"查找我的设备"定位、锁定或清除。提前设置：确保"查找我的iPhone"（iOS）或"查找我的设备"（Android）已启用。记录IMEI号：手机背面或设置中查看，丢失后提供给运营商和警方。',
        command: 'iOS: iCloud.com -> 查找 -> 标记为丢失或抹掉'
      }
    ],
    examples: [
      {
        title: '手机隐私检查清单',
        input: '检查以下设置是否完成',
        output: '1. 定位权限已逐个检查并限制\n2. 应用权限已逐个检查并关闭不必要的\n3. 广告追踪已关闭\n4. 系统分析数据已关闭\n5. 强密码已设置\n6. 数据加密已启用\n7. 备份已加密\n8. WiFi/蓝牙外出时关闭\n9. App隐私报告已检查\n10. 查找功能已启用',
        explanation: '完成以上检查可以确保手机基本隐私安全'
      },
      {
        title: '发现应用异常时的处理',
        input: '发现某应用异常访问权限',
        output: '步骤:\n1. 立即在设置中关闭该应用的相关权限\n2. 检查该应用是否有异常行为\n3. 如确认异常，立即卸载应用\n4. 清除该应用的缓存和数据\n5. 检查是否有其他类似应用\n6. 修改可能泄露的密码\n7. 如涉及支付，联系银行冻结',
        explanation: '发现异常立即处理防止数据泄露'
      }
    ],
    tips: [
      'iOS隐私保护比Android更好，优先选择iPhone',
      '定期（每月）检查应用权限和隐私报告',
      '只从官方应用商店安装应用',
      '不要越狱或root手机',
      '敏感数据不要备份到云端',
      '外出时关闭WiFi和蓝牙防止追踪',
      '使用Signal等加密通讯应用',
      '手机丢失后立即远程锁定或清除'
    ],
    warnings: [
      '定位权限"始终允许"会持续追踪位置',
      '应用可能获取不必要的权限并滥用',
      '广告ID可以追踪你的行为',
      '系统分析数据会发送给厂商',
      '不加密备份可能泄露隐私',
      'WiFi/蓝牙可用于商场追踪',
      '第三方应用来源可能包含恶意软件',
      '越狱/root大大增加安全风险'
    ],
    tags: ['手机隐私', 'iOS', 'Android', '定位隐私', '应用权限', '数据加密', '广告追踪']
  },

  {
    id: 'data-wipe-trace-clean',
    name: '数据擦除与访问痕迹清理完整指南',
    description: '详细讲解如何彻底清除电脑和手机上的数据、浏览痕迹、使用记录，防止被他人查询到你的隐私',
    category: '隐私保护',
    subcategory: '痕迹清理',
    language: 'System Tools',
    platform: ['Windows', 'macOS', 'iOS', 'Android'],
    difficulty: 'medium',
    author: '安全研究',
    features: ['浏览器痕迹清理', '系统使用记录清除', '文件安全删除', '硬盘数据擦除', '手机数据清除'],
    requirements: ['电脑或手机', '能够访问系统设置', '了解数据存储位置'],
    installation: '使用系统自带工具或专业擦除软件',
    usage: '定期执行清理操作',
    steps: [
      {
        title: '第一步：了解数据痕迹类型',
        description: '设备上留下的痕迹类型：1) 浏览器痕迹：浏览历史、Cookie、缓存、下载记录、表单数据；2) 系统使用记录：最近打开文件、搜索历史、剪贴板历史、通知历史；3) 应用数据：聊天记录、文档历史、照片元数据；4) 系统日志：事件日志、错误日志、启动记录；5) 回收站/废纸篓：已删除但可恢复的文件；6) 磁盘残留：已删除文件的磁盘残留数据；7) 云端同步：云端备份的历史数据。了解这些痕迹才能全面清理。',
        note: '普通删除不能彻底清除数据，需要专门方法'
      },
      {
        title: '第二步：Windows浏览器痕迹清理',
        description: 'Chrome清理：设置->隐私和安全->清除浏览数据，选择"所有时间"，勾选：浏览记录、Cookie和其他网站数据、缓存的图片和文件、下载记录、密码（谨慎）、自动填充表单数据。点击"清除数据"。Edge清理：设置->隐私、搜索和服务->清除浏览数据，同上选择。Firefox清理：设置->隐私与安全->Cookie和网站数据->清除数据，历史记录->清除历史。建议：每次敏感浏览后清除，或设置退出浏览器时自动清除。',
        command: 'Chrome: Ctrl+Shift+Delete -> 选择所有时间 -> 全部勾选 -> 清除'
      },
      {
        title: '第三步：Mac浏览器痕迹清理',
        description: 'Safari清理：设置->隐私->管理网站数据->移除所有。设置->通用->历史记录->清除历史记录。Safari菜单->清除历史记录->所有历史记录。Chrome/Firefox/Firefox清理方法同Windows。建议：使用Safari的"隐私浏览模式"（文件->新建隐私窗口）浏览敏感内容，关闭窗口后自动清除。',
        command: 'Safari: 设置 -> 隐私 -> 管理网站数据 -> 移除所有'
      },
      {
        title: '第四步：Windows系统痕迹清理',
        description: 'Windows系统痕迹清理：1) 清除最近打开文件：右键任务栏->属性->清除最近打开文件列表。或设置->个性化->开始->关闭"显示最近打开的项目"。2) 清除搜索历史：设置->搜索->权限和历史->清除设备搜索历史。3) 清除剪贴板历史：设置->系统->剪贴板->清除剪贴板数据。4) 清除运行历史：Win+R输入regedit，定位到HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\RunMRU，删除所有值。5) 清除资源管理器历史：资源管理器->查看->选项->清除文件资源管理器历史。',
        command: 'Windows设置: 个性化 -> 开始 -> 关闭显示最近项目'
      },
      {
        title: '第五步：Mac系统痕迹清理',
        description: 'Mac系统痕迹清理：1) 清除最近项目：苹果菜单->最近使用的项目->清除菜单。2) 清除Spotlight搜索历史：系统偏好设置->Spotlight->搜索结果，取消不需要的类别。终端命令：sudo mdutil -E / 清除索引。3) 清除剪贴板：终端输入pbcopy < /dev/null清除。4) 清除通知历史：通知中心->清除所有通知。5) 清除Quick Look历史：终端输入qlmanage -r清除缓存。6) 清除系统日志：终端输入sudo rm -rf /var/log/*（谨慎操作）。',
        command: 'Mac: 苹果菜单 -> 最近使用的项目 -> 清除菜单'
      },
      {
        title: '第六步：Windows文件安全删除',
        description: '普通删除（删除到回收站）可以恢复数据，需要安全删除。方法一：使用cipher命令：cipher /w:C:\\folder（将C:\\folder替换为要清理的目录，会擦除已删除文件的残留）。方法二：使用SDelete工具（微软提供）：下载sdelete.exe，命令sdelete -s -z filename安全删除文件。方法三：使用第三方工具：Eraser（免费开源）、Secure Delete。方法四：格式化时选择"完全格式化"而非"快速格式化"（Windows 8+默认完全格式化会擦除数据）。',
        command: 'cipher /w:C:\\ 清除C盘已删除文件残留'
      },
      {
        title: '第七步：Mac文件安全删除',
        description: 'Mac安全删除方法：方法一：废纸篓安全清空：废纸篓菜单->安全清空废纸篓（会多次覆写数据）。注意：SSD硬盘Mac可能没有此选项，因为SSD覆写会损坏硬盘。方法二：使用终端命令：rm -P filename（覆写3次后删除）。方法三：使用第三方工具：Permanent Eraser（免费）、ShredIt（付费）。方法四：磁盘工具抹掉：磁盘工具->抹掉->安全抹掉选项（选择覆写次数）。SSD注意事项：SSD硬盘不要多次覆写，使用加密后删除即可（FileVault加密后删除数据无法恢复）。',
        command: '废纸篓: 菜单 -> 安全清空废纸篓'
      },
      {
        title: '第八步：Windows系统日志清理',
        description: 'Windows事件日志记录了系统所有活动。清理方法：1) 事件查看器：Win+R输入eventvwr.msc，Windows日志->右键各日志->清除日志。2) PowerShell命令：wevtutil el列出所有日志，wevtutil cl "System"清除系统日志，wevtutil cl "Application"清除应用日志。3) 清除Prefetch：C:\\Windows\\Prefetch目录记录了应用启动历史，删除其中文件（需要管理员权限）。4) 清除临时文件：C:\\Windows\\Temp和%TEMP%目录，删除所有文件。',
        command: 'eventvwr.msc -> Windows日志 -> 右键清除'
      },
      {
        title: '第九步：应用数据清理',
        description: '各应用的数据需要单独清理。微信：设置->通用->存储空间->清理缓存。聊天记录：设置->聊天->清空聊天记录（谨慎）。QQ：设置->清理缓存数据。Office：文件->选项->保存->清除缓存。Adobe：编辑->首选项->清除缓存。视频应用：清除观看历史和缓存。音乐应用：清除播放历史。建议：定期检查各应用的缓存和历史设置，敏感内容使用后立即清除。',
        command: '微信: 设置 -> 通用 -> 存储空间 -> 清理缓存'
      },
      {
        title: '第十步：硬盘/分区完全擦除',
        description: '出售或丢弃电脑前必须完全擦除硬盘。Windows：方法一：重置此电脑：设置->系统->恢复->重置此电脑->删除所有内容->选择"完全清理驱动器"（会多次覆写）。方法二：使用DBAN（Darik\'s Boot and Nuke）：下载DBAN制作启动U盘，启动后选择硬盘擦除。方法三：使用专业工具：KillDisk、Active KillDisk。Mac：方法一：抹掉所有内容和设置：系统偏好设置->抹掉所有内容和设置（T2芯片Mac）。方法二：恢复模式：Command+R启动->磁盘工具->抹掉->安全抹掉。方法三：FileVault加密后删除密钥。',
        command: 'Windows: 设置 -> 系统 -> 恢复 -> 重置此电脑 -> 删除所有内容'
      },
      {
        title: '第十一步：手机数据清除',
        description: 'iPhone清除：设置->通用->传输或还原iPhone->抹掉所有内容和设置。输入密码确认，数据会被加密擦除。iPhone安全特性：硬件加密密钥会被销毁，数据无法恢复。Android清除：设置->系统->重置选项->抹掉所有数据（恢复出厂设置）。Android注意：部分Android手机恢复出厂设置不安全，数据可能恢复。安全方法：先启用加密（设置->安全->加密），再恢复出厂。或使用专业工具：Android Data Eraser。出售前：确保所有账号已退出，SIM卡已取出，存储卡已取出或擦除。',
        command: 'iPhone: 设置 -> 通用 -> 抹掉所有内容和设置'
      },
      {
        title: '第十二步：云端数据清除',
        description: '云端数据也需要清除。iCloud：登录icloud.com，逐个删除照片、文档、备忘录等。设置->iCloud->管理存储空间->删除不需要的备份。彻底删除：设置->iCloud->删除账户（会删除所有云端数据）。Google：登录myaccount.google.com，数据与隐私->删除服务或账户->删除Google账户和数据。会删除所有Google服务数据。其他云服务：登录各云服务，删除所有文件，取消订阅，删除账户。注意：云端数据删除后可能保留一段时间（30-90天），彻底删除需要联系客服。',
        command: 'iCloud.com -> 设置 -> 数据与隐私 -> 删除数据'
      },
      {
        title: '第十三步：定期自动清理设置',
        description: '设置自动清理可以减少手动操作。Windows：设置存储感知：设置->系统->存储->存储感知，启用并设置自动清理规则。浏览器：设置退出时清除数据：Chrome设置->隐私和安全->Cookie和其他网站数据->关闭浏览器时清除Cookie和网站数据。Mac：使用CleanMyMac等工具设置自动清理。iPhone：设置消息保留时间：设置->信息->保留信息->选择30天或1年。Android：设置存储管理器自动清理。',
        command: 'Chrome: 设置 -> 退出时清除Cookie和网站数据'
      },
      {
        title: '第十四步：使用专业清理工具',
        description: '专业工具可以更彻底清理。Windows推荐：BleachBit（免费开源，类似CCleaner）、PrivaZer（深度清理）、CCleaner（经典工具，注意不要被捆绑软件）。Mac推荐：CleanMyMac X（付费，全面清理）、AppCleaner（免费，卸载应用）、Onyx（免费，系统清理）。手机推荐：iPhone使用系统自带清除即可；Android使用SD Maid（清理残留）。注意：使用清理工具时选择可信来源，部分清理工具可能收集数据。',
        note: 'BleachBit是开源免费的安全清理工具'
      }
    ],
    examples: [
      {
        title: '敏感浏览后的完整清理流程',
        input: '完成敏感浏览后执行',
        output: '1. Ctrl+Shift+Delete清除浏览器所有数据\n2. 清除剪贴板历史\n3. 清除系统搜索历史\n4. 清除最近打开文件列表\n5. 清除下载文件夹中的文件\n6. 清除临时文件夹\n7. 清除回收站\n8. 如使用应用，清除应用缓存',
        explanation: '敏感浏览后立即完整清理所有痕迹'
      },
      {
        title: '出售电脑前的完整清理流程',
        input: '出售或丢弃电脑前执行',
        output: '1. 备份需要保留的数据\n2. 退出所有账号（微软、iCloud等）\n3. 取出存储卡和SIM卡\n4. Windows: 重置此电脑 -> 删除所有内容 -> 完全清理驱动器\n5. Mac: 抹掉所有内容和设置\n6. 或使用DBAN完全擦除硬盘\n7. 确认数据无法恢复\n8. 如有云端数据，删除云端账户',
        explanation: '出售前必须彻底擦除所有数据'
      }
    ],
    tips: [
      '敏感浏览后立即清除浏览器数据',
      '设置浏览器退出时自动清除',
      '定期清除系统临时文件和缓存',
      '删除敏感文件使用安全删除工具',
      'SSD硬盘不要多次覆写，使用加密后删除',
      '出售设备前必须完全擦除',
      '云端数据也需要清除',
      '使用开源可信的清理工具'
    ],
    warnings: [
      '普通删除可以恢复数据，必须安全删除',
      '浏览器历史可能暴露隐私',
      '系统日志记录了所有活动',
      '回收站文件可以恢复',
      '云端数据删除后可能保留一段时间',
      'SSD硬盘安全删除方法不同于HDD',
      '清理工具可能收集数据，选择可信来源',
      '出售设备前必须彻底擦除硬盘'
    ],
    tags: ['数据擦除', '痕迹清理', '安全删除', '浏览器清理', '系统清理', '隐私保护']
  },

  {
    id: 'windows-privacy-settings',
    name: 'Windows 10/11隐私设置完整指南',
    description: '详细讲解Windows系统的隐私设置，关闭数据收集、定位追踪、广告ID、活动历史等功能',
    category: '隐私保护',
    subcategory: '系统隐私',
    language: 'Windows Settings',
    platform: ['Windows 10', 'Windows 11'],
    difficulty: 'easy',
    author: '安全研究',
    features: ['关闭数据收集', '定位隐私', '活动历史', '广告ID', 'Cortana隐私'],
    requirements: ['Windows 10/11系统', '管理员权限'],
    installation: '在Windows设置中配置',
    usage: '修改设置后立即生效',
    steps: [
      {
        title: '第一步：了解Windows隐私设置入口',
        description: 'Windows隐私设置集中在"设置->隐私"中。打开方法：Win+I打开设置，点击"隐私和安全"（Windows 11）或"隐私"（Windows 10）。左侧列出所有隐私类别：常规、语音、打字活动、诊断和反馈、活动历史记录、位置、摄像头、麦克风等。逐个检查每个类别，关闭不需要的功能。',
        command: 'Win+I -> 设置 -> 隐私和安全'
      },
      {
        title: '第二步：关闭常规隐私设置',
        description: '设置->隐私->常规。关闭以下选项：1) "让应用使用广告ID"：关闭，防止广告商追踪；2) "让网站通过语言列表访问本地信息"：关闭；3) "让应用通过访问我的其他应用来启动"：关闭；4) "让Windows跟踪应用启动以改善开始菜单和搜索结果"：关闭。这些设置会减少Microsoft和应用对你的追踪。',
        command: '设置 -> 隐私 -> 常规 -> 全部关闭'
      },
      {
        title: '第三步：关闭语音和打字活动',
        description: '设置->隐私->语音激活：关闭"让应用使用语音激活"，关闭"在线语音识别"。设置->隐私->墨迹书写和打字个性化：关闭"发送墨迹书写和打字数据给Microsoft"。这些设置会停止语音和输入数据发送给Microsoft。注意：关闭后语音输入功能可能受限，但隐私更重要。',
        command: '设置 -> 隐私 -> 语音 -> 关闭在线语音识别'
      },
      {
        title: '第四步：关闭诊断和反馈',
        description: '设置->隐私->诊断和反馈。关键设置：1) "诊断数据"：选择"发送必要的诊断数据"而非"可选诊断数据"；2) "发送反馈频率"：选择"从不"；3) "改进墨迹书写和打字"：关闭；4) "定制体验"：关闭；5) "删除诊断数据"：点击删除按钮清除已收集的数据。这些设置会大幅减少发送给Microsoft的数据。',
        command: '设置 -> 隐私 -> 诊断和反馈 -> 发送必要诊断数据'
      },
      {
        title: '第五步：关闭活动历史记录',
        description: '设置->隐私->活动历史记录。关闭"存储此设备上的活动历史记录"，关闭"向Microsoft发送活动历史记录"。点击"清除活动历史记录"删除已记录的活动。活动历史记录了你打开的应用、访问的文件、浏览的网页等，是重要的隐私数据。关闭后Windows不再记录你的活动。',
        command: '设置 -> 隐私 -> 活动历史记录 -> 全部关闭并清除'
      },
      {
        title: '第六步：关闭位置追踪',
        description: '设置->隐私->位置。关闭"位置服务"。如需要某些应用使用位置，可以保持开启但逐个设置应用权限："让应用访问你的位置信息"设为关闭，然后逐个开启需要位置的应用（如地图）。清除位置历史：点击"清除此设备上的位置历史"。关闭"允许应用访问精确位置"可以只提供大致位置。',
        command: '设置 -> 隐私 -> 位置 -> 关闭位置服务'
      },
      {
        title: '第七步：管理设备权限',
        description: '设置->隐私中逐个管理以下权限：摄像头：关闭"让应用访问你的摄像头"，逐个检查应用权限。麦克风：关闭"让应用访问你的麦克风"。通知：关闭"让应用发送通知"。联系人：关闭"让应用访问你的联系人"。日历：关闭"让应用访问你的日历"。电话：关闭"让应用访问你的电话"。通话历史：关闭"让应用访问你的通话历史"。电子邮件：关闭"让应用访问你的电子邮件"。任务：关闭"让应用访问你的任务"。应用诊断：关闭"让应用访问诊断信息"。文件系统：关闭"让应用访问文件系统"。',
        command: '设置 -> 隐私 -> 各权限 -> 逐个关闭'
      },
      {
        title: '第八步：关闭Cortana隐私',
        description: 'Cortana会收集大量个人数据。关闭方法：设置->Cortana（或搜索Cortana）。关闭"让Cortana响应你好Cortana"。关闭"让Cortana访问我的位置"。关闭"让Cortana访问我的联系人、电子邮件等"。清除Cortana数据：登录Microsoft账户隐私页面（account.microsoft.com/privacy），删除Cortana活动历史。Windows 11已默认禁用Cortana，但仍需检查设置。',
        command: '设置 -> Cortana -> 全部关闭'
      },
      {
        title: '第九步：关闭OneDrive同步',
        description: 'OneDrive会同步文件到云端，可能泄露隐私。关闭方法：右键OneDrive图标->设置->取消勾选"自动保存截图和照片到OneDrive"。设置->账户->取消勾选"让Windows同步我的设置"。设置->备份->关闭"自动备份我的文件"。如不需要OneDrive，可以卸载：控制面板->程序->卸载OneDrive。敏感文件不要放在OneDrive同步目录。',
        command: 'OneDrive设置 -> 取消自动保存和同步'
      },
      {
        title: '第十步：关闭Windows追踪功能',
        description: 'Windows还有其他追踪功能需要关闭。设置->系统->通知和操作：关闭"获取有关Windows的提示、技巧和建议"。设置->个性化->开始：关闭"显示最近添加的应用"，关闭"显示最常用的应用"，关闭"在开始菜单或任务栏的跳转列表中显示最近打开的项目"。设置->个性化->锁屏：关闭"在锁屏上获取提示、技巧和建议"。设置->搜索->权限和历史：关闭"设备搜索历史"，关闭"搜索历史"，关闭"基于位置的搜索结果"。',
        command: '设置 -> 个性化 -> 开始 -> 关闭显示最近项目'
      },
      {
        title: '第十一步：关闭遥测服务',
        description: 'Windows遥测服务会持续发送数据给Microsoft。关闭方法（需要管理员权限）：Win+R输入services.msc，找到"Connected User Experiences and Telemetry"服务，双击->启动类型设为"禁用"，点击停止。找到"dmwappushservice"服务，同样禁用。注册表修改（高级）：regedit定位到HKEY_LOCAL_MACHINE\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection，创建DWORD值"AllowTelemetry"，设为0。',
        command: 'services.msc -> Connected User Experiences -> 禁用'
      },
      {
        title: '第十二步：使用隐私工具',
        description: '第三方工具可以一键关闭更多隐私设置。推荐工具：O&O ShutUp10（免费，一键关闭Windows隐私设置，可恢复）：下载运行后点击"Actions"->"Apply all recommended settings"。Winaero Tweaker（免费，更多系统设置）。注意：使用工具后某些功能可能异常，建议只关闭推荐设置，不要关闭所有设置。创建还原点：使用工具前创建系统还原点，出问题可以恢复。',
        note: 'O&O ShutUp10是免费的Windows隐私工具'
      },
      {
        title: '第十三步：清除已收集的数据',
        description: 'Microsoft已经收集的数据可以删除。登录account.microsoft.com/privacy，查看并删除：浏览历史、搜索历史、位置历史、Cortana活动、应用活动、媒体活动。点击"清除活动历史"删除所有数据。注意：删除后Microsoft可能仍保留部分数据（如法律要求），但可以减少隐私泄露。',
        command: 'account.microsoft.com/privacy -> 清除活动历史'
      },
      {
        title: '第十四步：定期检查隐私设置',
        description: 'Windows更新可能重置隐私设置，需要定期检查。建议每月检查一次所有隐私设置。Windows更新后立即检查隐私设置是否被重置。使用O&O ShutUp10可以锁定设置防止被重置。关注Windows隐私相关新闻，了解新发现的隐私问题。',
        note: 'Windows更新可能重置隐私设置，需要定期检查'
      }
    ],
    examples: [
      {
        title: 'Windows隐私设置检查清单',
        input: '检查以下设置是否完成',
        output: '1. 广告ID已关闭\n2. 语音识别已关闭\n3. 诊断数据设为必要\n4. 活动历史已关闭并清除\n5. 位置服务已关闭或限制\n6. 各权限已逐个关闭\n7. Cortana已关闭\n8. OneDrive同步已关闭\n9. 遥测服务已禁用\n10. Microsoft账户数据已清除',
        explanation: '完成以上检查可以确保Windows基本隐私'
      },
      {
        title: '使用O&O ShutUp10一键设置',
        input: '下载并运行O&O ShutUp10',
        output: '步骤:\n1. 下载O&O ShutUp10（官网oosoftware.com）\n2. 运行程序（无需安装）\n3. 点击Actions -> Apply all recommended settings\n4. 程序会自动关闭所有推荐的隐私设置\n5. 如有问题，点击Actions -> Reset all settings恢复\n6. 建议创建系统还原点备用',
        explanation: 'O&O ShutUp10可以一键关闭大量隐私设置'
      }
    ],
    tips: [
      'Windows更新后检查隐私设置是否被重置',
      '使用O&O ShutUp10可以锁定隐私设置',
      '敏感文件不要放在OneDrive同步目录',
      '定期清除Microsoft账户中的活动历史',
      '关闭遥测服务可以减少数据发送',
      '只给必要的应用权限',
      '使用本地账户而非Microsoft账户',
      '考虑使用Linux系统获得更好的隐私'
    ],
    warnings: [
      'Windows默认收集大量数据，必须手动关闭',
      '诊断数据会发送给Microsoft',
      '活动历史记录了所有操作',
      '位置服务会持续追踪',
      'Cortana收集语音和个人数据',
      'OneDrive同步可能泄露隐私',
      '遥测服务会持续发送数据',
      'Windows更新可能重置隐私设置'
    ],
    tags: ['Windows隐私', '数据收集', '遥测', '活动历史', '位置追踪', 'Cortana', '广告ID']
  },

  {
    id: 'prevent-remote-control',
    name: '防止电脑手机被远程控制完整指南',
    description: '详细讲解如何防止黑客远程控制你的电脑和手机，包括关闭远程服务、防火墙设置、恶意软件防护等',
    category: '隐私保护',
    subcategory: '远程控制防护',
    language: 'System Settings',
    platform: ['Windows', 'macOS', 'iOS', 'Android'],
    difficulty: 'medium',
    author: '安全研究',
    features: ['关闭远程服务', '防火墙配置', '恶意软件防护', '远程桌面安全', '端口管理'],
    requirements: ['电脑或手机', '管理员权限', '基础网络知识'],
    installation: '在系统设置中配置',
    usage: '配置后持续有效',
    steps: [
      {
        title: '第一步：了解远程控制风险',
        description: '远程控制的风险：1) 屏幕监控：攻击者可以看到你的屏幕内容；2) 文件窃取：攻击者可以复制你的文件；3) 键盘记录：攻击者可以记录你输入的密码；4) 摄像头/麦克风：攻击者可以激活摄像头和麦克风；5) 系统控制：攻击者可以安装软件、修改设置；6) 数据加密勒索：攻击者可以加密文件勒索赎金。远程控制通常通过：恶意软件、远程桌面漏洞、弱密码、网络服务漏洞等方式实现。',
        note: '远程控制是最严重的隐私威胁，必须全面防护'
      },
      {
        title: '第二步：Windows关闭远程桌面',
        description: '远程桌面是Windows最危险的远程控制入口。关闭方法：设置->系统->远程桌面->关闭"启用远程桌面"。如必须使用远程桌面：1) 设置强密码：账户必须有复杂密码；2) 修改默认端口：注册表HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server\\WinStations\\RDP-Tcp，修改PortNumber（默认3389改为其他）；3) 启用网络级别身份验证（NLA）；4) 设置IP白名单：只允许特定IP连接；5) 使用VPN：通过VPN连接后再远程桌面。',
        command: '设置 -> 系统 -> 远程桌面 -> 关闭'
      },
      {
        title: '第三步：Windows关闭其他远程服务',
        description: 'Windows还有其他远程服务需要关闭。services.msc关闭以下服务：1) "Remote Registry"：远程修改注册表，禁用；2) "Remote Desktop Services"：远程桌面服务，禁用；3) "Remote Desktop Configuration"：禁用；4) "Telnet"：远程登录，禁用；5) "Remote Access Connection Manager"：远程访问，禁用；6) "Remote Procedure Call (RPC)"：不建议禁用，但检查是否有异常；7) "Windows Remote Management (WS-Management)"：禁用。',
        command: 'services.msc -> Remote Registry -> 禁用'
      },
      {
        title: '第四步：Windows防火墙配置',
        description: '防火墙可以阻止外部连接。设置方法：控制面板->Windows Defender防火墙->高级设置。入站规则：检查并禁用不需要的入站规则，特别是"远程桌面"相关规则。创建阻止规则：新建规则->端口->TCP->特定端口（如3389、445、139）->阻止连接。出站规则：检查出站规则，阻止可疑程序的出站连接。启用防火墙：确保防火墙对所有网络类型（域、专用、公用）都启用。',
        command: '控制面板 -> Windows防火墙 -> 高级设置 -> 入站规则'
      },
      {
        title: '第五步：Windows关闭危险端口',
        description: '关闭容易被攻击的端口。危险端口：3389（远程桌面）、445（SMB文件共享）、139（NetBIOS）、23（Telnet）、21（FTP）、80/443（Web服务，如不需要）、135（RPC）。关闭方法：防火墙高级设置->入站规则->新建规则->端口->TCP->特定端口->阻止连接。PowerShell命令：New-NetFirewallRule -DisplayName "Block RDP" -Direction Inbound -Protocol TCP -LocalPort 3389 -Action Block。',
        command: '防火墙: 新建规则 -> 端口 -> TCP 3389,445,139 -> 阻止'
      },
      {
        title: '第六步：Windows关闭文件共享',
        description: '文件共享可能被利用入侵。关闭方法：控制面板->网络和共享中心->高级共享设置。关闭"启用网络发现"，关闭"启用文件和打印机共享"。如需要局域网共享：1) 设置共享密码：共享文件夹需要密码访问；2) 限制共享范围：只共享必要文件夹；3) 设置访问权限：只给特定用户访问权限；4) 禁用Guest账户：控制面板->用户账户->管理其他账户->Guest账户->关闭。',
        command: '网络和共享中心 -> 高级共享设置 -> 关闭文件共享'
      },
      {
        title: '第七步：Windows安装防护软件',
        description: '防护软件可以检测和阻止恶意软件。Windows Defender：已内置，启用实时保护。设置->更新和安全->Windows安全->病毒和威胁防护->管理设置->启用所有选项。第三方防护：Malwarebytes（恶意软件检测）、HitmanPro（深度扫描）、GlassWire（网络监控）。注意：不要安装多个实时防护软件，会冲突。定期扫描：每周进行一次完整扫描。',
        command: 'Windows安全 -> 病毒和威胁防护 -> 启用实时保护'
      },
      {
        title: '第八步：Mac防止远程控制',
        description: 'Mac远程控制防护：1) 关闭远程登录：系统偏好设置->共享->关闭"远程登录"。2) 关闭远程管理：系统偏好设置->共享->关闭"远程管理"。3) 关闭屏幕共享：系统偏好设置->共享->关闭"屏幕共享"。4) 关闭文件共享：系统偏好设置->共享->关闭"文件共享"。5) 启用防火墙：系统偏好设置->安全性与隐私->防火墙->启用。6) 防火墙选项：点击"防火墙选项"，阻止所有传入连接，逐个允许需要的应用。',
        command: '系统偏好设置 -> 共享 -> 关闭所有远程服务'
      },
      {
        title: '第九步：检查异常进程和连接',
        description: '定期检查是否有异常进程或网络连接。Windows检查：任务管理器->详细信息：查看是否有可疑进程。命令行：netstat -ano查看网络连接，检查是否有异常外部连接。资源监视器：查看网络活动，检查哪些程序在通信。Mac检查：活动监视器：查看进程和网络活动。终端：lsof -i查看网络连接。发现异常：如发现可疑进程，立即结束进程，查找来源，进行病毒扫描。',
        command: 'netstat -ano 查看所有网络连接'
      },
      {
        title: '第十步：防止恶意软件安装',
        description: '恶意软件是远程控制的主要途径。防护措施：1) 只从官方来源安装软件；2) 不打开来历不明的邮件附件；3) 不点击可疑链接；4) 不下载破解软件和盗版软件；5) 安装软件时注意捆绑软件，取消不需要的；6) 定期更新系统和软件；7) 使用沙箱运行可疑程序（Windows Sandbox）；8) 使用虚拟机运行高风险程序。',
        note: '不安装来历不明的软件是最重要的防护'
      },
      {
        title: '第十一步：设置强密码防止破解',
        description: '弱密码容易被破解，导致远程控制。Windows密码设置：设置->账户->登录选项->密码->设置强密码（12位以上，包含大小写字母、数字、符号）。启用两步验证：Microsoft账户启用两步验证。Mac密码设置：系统偏好设置->用户与群组->更改密码。启用FileVault加密：系统偏好设置->安全性与隐私->FileVault。密码管理：使用密码管理器（如Bitwarden）管理密码，不要重复使用密码。',
        command: '设置 -> 账户 -> 登录选项 -> 设置强密码'
      },
      {
        title: '第十二步：手机防止远程控制',
        description: '手机远程控制防护：iOS：设置->隐私与安全->定位服务->逐个限制应用权限。设置->隐私与安全->相机/麦克风->逐个限制。不要越狱。只从App Store安装应用。Android：设置->安全->屏幕锁定->设置强密码。设置->安全->查找我的设备->启用。不要root。只从Google Play安装应用。检查应用权限：设置->隐私->权限管理器。安装防护应用：Malwarebytes Mobile。',
        command: '手机: 设置强密码 -> 不越狱/root -> 只从官方商店安装'
      },
      {
        title: '第十三步：检查摄像头和麦克风',
        description: '摄像头和麦克风可能被远程激活。Windows检查：设置->隐私->摄像头/麦克风->关闭"让应用访问"，逐个开启需要的应用。物理遮挡：摄像头贴纸或滑盖遮挡镜头。Mac检查：系统偏好设置->安全性与隐私->隐私->相机/麦克风。物理遮挡：Mac摄像头指示灯亮起时表示正在使用，但仍建议遮挡。手机检查：设置中限制应用权限，敏感场合物理遮挡。',
        command: '摄像头物理遮挡是最可靠的防护'
      },
      {
        title: '第十四步：发现被远程控制后的处理',
        description: '发现异常迹象（鼠标自动移动、文件被修改、摄像头亮起等）后的处理：1) 立即断开网络：拔网线或关闭WiFi；2) 结束可疑进程：任务管理器结束可疑进程；3) 病毒扫描：使用Malwarebytes等工具完整扫描；4) 检查远程设置：检查远程桌面等是否被开启；5) 修改密码：修改所有重要密码；6) 检查账号：检查是否有异常登录；7) 恢复系统：如确认被控制，恢复系统或重装；8) 报警：如涉及财产损失，报警处理。',
        command: '发现异常立即断网并扫描'
      }
    ],
    examples: [
      {
        title: '远程控制防护检查清单',
        input: '检查以下设置是否完成',
        output: '1. 远程桌面已关闭\n2. 远程服务已禁用\n3. 防火墙已启用\n4. 危险端口已阻止\n5. 文件共享已关闭\n6. 防护软件已安装\n7. 强密码已设置\n8. 摄像头已遮挡\n9. 无异常进程\n10. 只从官方来源安装软件',
        explanation: '完成以上检查可以防止远程控制'
      },
      {
        title: '发现被控制的迹象',
        input: '注意以下异常现象',
        output: '1. 鼠标/键盘自动操作\n2. 文件被修改或删除\n3. 摄像头指示灯亮起\n4. 程序自动启动\n5. 网络流量异常\n6. 系统运行缓慢\n7. 弹出奇怪窗口\n8. 收到勒索信息\n\n发现以上迹象立即断网检查',
        explanation: '及时发现异常可以减少损失'
      }
    ],
    tips: [
      '远程桌面如不需要必须关闭',
      '防火墙阻止危险端口',
      '摄像头物理遮挡是最可靠的',
      '只从官方来源安装软件',
      '定期检查异常进程和连接',
      '设置强密码防止破解',
      '不要越狱或root手机',
      '发现异常立即断网处理'
    ],
    warnings: [
      '远程桌面是主要的远程控制入口',
      '弱密码容易被破解',
      '恶意软件是远程控制的主要途径',
      '文件共享可能被利用入侵',
      '摄像头可能被远程激活',
      '危险端口（3389、445）必须阻止',
      '破解软件通常包含恶意代码',
      '发现异常立即断网防止进一步损失'
    ],
    tags: ['远程控制', '远程桌面', '防火墙', '端口安全', '恶意软件', '摄像头', '安全防护']
  },

  // ==================== 社会工程学 ====================
  {
    id: 'social-engineering-attacks',
    name: '社会工程学攻击与防御完整指南',
    description: '详细讲解钓鱼邮件制作、鱼叉式钓鱼、水坑攻击、身份伪装等社会工程学攻击原理及防护措施',
    category: '社会工程学',
    subcategory: '社工攻击',
    language: 'Multi',
    platform: ['Windows', 'Linux', 'macOS'],
    difficulty: 'medium',
    author: '安全研究',
    features: ['钓鱼邮件制作', '鱼叉式钓鱼', '水坑攻击', '身份伪装', '社工防御'],
    requirements: ['基本的网络知识', '了解心理学原理', '基础的命令行操作'],
    installation: '使用Python和SET等工具',
    usage: '在授权环境中进行安全测试',
    steps: [
      {
        title: '第一步：理解社会工程学原理',
        description: '社会工程学是利用人性弱点而非技术漏洞的攻击方式。核心原理：1) 权威：人们倾向于服从权威人士；2) 稀缺性：人们害怕错过机会；3) 社会认同：人们跟随大众行为；4) 互惠：人们回报收到的恩惠；5) 承诺与一致：人们遵守自己的承诺；6) 喜好：人们容易答应认识喜欢的人。攻击者利用这些原理诱骗受害者。常见攻击类型：钓鱼邮件、鱼叉式钓鱼、电话诈骗、冒充客服、U盘投递等。',
        note: '社会工程学是最有效的攻击方式，需要提高警惕'
      },
      {
        title: '第二步：钓鱼邮件攻击原理与防御',
        description: '钓鱼邮件是最常见的社会工程攻击。攻击原理：发送伪装成合法机构的邮件，诱导用户点击恶意链接或提供敏感信息。识别钓鱼邮件：1) 发件人地址异常；2) 语法错误和拼写错误；3) 紧急或威胁性语言；4) 链接指向可疑域名；5) 要求提供敏感信息。防御措施：1) 不点击可疑邮件中的链接；2) 直接访问官网而非通过邮件链接；3) 使用邮件安全网关；4) 启用双因素认证；5) 举报可疑邮件。',
        note: '收到可疑邮件先验证发件人身份'
      },
      {
        title: '第三步：鱼叉式钓鱼攻击与防护',
        description: '鱼叉式钓鱼针对特定目标定制攻击。攻击特点：针对特定个人或组织、使用收集的情报定制内容、高度可信但成本高。攻击步骤：1) 情报收集：通过LinkedIn、社交媒体、公司网站收集目标信息；2) 邮件定制：使用收集的信息制作个性化邮件；3) 诱饵准备：创建恶意链接或附件；4) 发送攻击：发送定制钓鱼邮件。防御措施：1) 员工安全意识培训；2) 邮件签名验证；3) 敏感信息最小化公开；4) 异常邮件告警；5) 定期模拟钓鱼演练。',
        command: '收集目标公开信息用于定制钓鱼内容（仅授权测试）'
      },
      {
        title: '第四步：SET（Social Engineering Toolkit）使用',
        description: 'SET是Kali Linux集成的社工攻击框架。安装：Kali Linux已预装。启动：sudo setoolkit。常用功能：1) 钓鱼邮件攻击；2) 网站攻击向量；3) 短信欺骗；4) RFID欺骗。注意事项：仅用于授权测试，否则违法。',
        command: 'sudo setoolkit'
      },
      {
        title: '第五步：钓鱼网站克隆与防御',
        description: '克隆合法网站诱导用户输入凭据。攻击方法（SET）：选择Website Attack Vectors -> Credential Harvester Attack Method -> Site Cloner。防御措施：1) 检查URL是否正确；2) 查看SSL证书；3) 不在链接点击后的页面输入敏感信息；4) 使用密码管理器自动识别钓鱼网站。',
        command: 'SET: Website Attack -> Credential Harvester -> Site Cloner'
      },
      {
        title: '第六步：USB攻击（BadUSB）与防护',
        description: '通过恶意U盘传播恶意软件。攻击方式：预置恶意软件的U盘、外壳伪装成正常U盘。攻击步骤：1) 制作恶意USB设备；2) 丢弃在目标区域；3) 等待受害者插入电脑。防御措施：1) 不插入来历不明的USB设备；2) 禁用USB自动运行；3) 使用USB安全锁；4) 企业使用USB白名单；5) 定期安全培训。',
        command: 'Windows: 组策略禁用自动运行'
      },
      {
        title: '第七步：密码猜测与防护',
        description: '通过猜测而非技术手段获取密码。攻击方式：1) 利用泄露的密码库；2) 社会工程学猜测；3) 键盘记录器；4) 肩窥（偷看输入）。防御措施：1) 使用强密码（12位以上）；2) 不同网站使用不同密码；3) 使用密码管理器；4) 启用双因素认证；5) 注意遮挡输入。',
        command: '使用Bitwarden等密码管理器生成和存储强密码'
      }
    ],
    examples: [
      {
        title: '识别钓鱼邮件检查清单',
        input: '收到可疑邮件时检查',
        output: '1. 发件人地址是否异常？2. 是否要求紧急操作？3. 是否包含可疑链接？4. 是否有语法错误？5. 是否索要敏感信息？6. 附件是否可疑？',
        explanation: '遇到可疑邮件先核实身份'
      },
      {
        title: 'SET钓鱼邮件模板（仅授权测试）',
        input: '使用SET创建钓鱼邮件',
        output: 'SET配置: 1. sudo setoolkit 2. Spear Phishing Attack 3. Create Payload 4. 配置邮件参数 5. 发送测试邮件。警告：仅授权测试使用',
        explanation: 'SET可以快速创建钓鱼邮件攻击，仅授权测试使用'
      }
    ],
    tips: ['社会工程学是最有效的攻击方式', '任何要求提供密码或转账的都是诈骗', '官方机构不会通过邮件或电话索要密码', '发现被钓鱼后立即更改密码', '定期进行员工社会工程学培训', '使用密码管理器避免被钓鱼', '启用双因素认证增加安全层', '可疑邮件举报给相关部门'],
    warnings: ['社会工程学攻击在授权测试外是违法行为', 'SET等工具仅用于授权渗透测试', '钓鱼攻击是犯罪行为', '制作和使用恶意USB设备违法', '冒充他人进行社工攻击违法', '保护自己的信息安全是每个人的责任', '发现被攻击及时报警', '企业必须进行员工安全意识培训'],
    tags: ['社会工程学', '钓鱼攻击', '鱼叉式钓鱼', 'SET', '安全意识', '防范']
  },

  {
    id: 'wireless-attacks-defensive',
    name: '无线网络攻击与防御完整教程',
    description: '详细讲解WiFi密码破解、WPA2握手捕获、Evil Twin攻击、无线入侵检测等无线网络安全知识',
    category: '无线安全',
    subcategory: '无线攻击',
    language: 'Bash',
    platform: ['Kali Linux', 'Linux'],
    difficulty: 'hard',
    author: '安全研究',
    features: ['WiFi密码破解', '握手捕获', 'Evil Twin', '无线入侵检测', 'WPA3安全'],
    requirements: ['Kali Linux系统', '支持监控模式的无线网卡'],
    installation: 'apt install aircrack-ng wireshark',
    usage: '在授权环境中进行安全测试',
    steps: [
      {
        title: '第一步：无线安全基础与攻击原理',
        description: '无线网络安全基础：加密方式演变WEP（已破解，不安全）-> WPA（过渡方案）-> WPA2（目前主流）-> WPA3（最新标准）。WPA2-PSK攻击原理：捕获四次握手包，使用字典攻击破解预共享密钥。攻击前提：1) 无线网卡支持监控模式；2) 能接收目标WiFi信号；3) 有目标客户端连接。推荐网卡芯片：RTL8812AU、RT3572、AR9271。',
        note: '仅在授权环境中测试无线网络安全'
      },
      {
        title: '第二步：Aircrack-ng工具套件使用',
        description: 'Aircrack-ng是无线安全测试的核心工具套件。核心工具：1) airmon-ng：开启监控模式；2) airodump-ng：嗅探无线网络；3) aireplay-ng：注入攻击包；4) aircrack-ng：破解密码。基础命令：airmon-ng start wlan0（开启监控）；airodump-ng wlan0mon（扫描网络）。',
        command: 'airmon-ng start wlan0 && airodump-ng wlan0mon'
      },
      {
        title: '第三步：WPA2-PSK握手捕获',
        description: '捕获WPA2四次握手包是破解的前提。步骤：1) 开启监控模式airmon-ng start wlan0；2) 扫描目标airodump-ng wlan0mon -c 信道 --bssid MAC地址 -w cap文件；3) 等待客户端连接或强制断开aireplay-ng -0 5 -a AP_MAC wlan0mon；4) 捕获握手包。握手包成功捕获标志：[WPA handshake: XX:XX:XX:XX:XX:XX]。',
        command: 'airodump-ng wlan0mon -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture'
      },
      {
        title: '第四步：字典攻击破解WiFi密码',
        description: '使用捕获的握手包进行字典攻击。准备字典：可以使用crunch生成或下载现成字典（如rockyou.txt）。破解命令：aircrack-ng capture-01.cap -w wordlist.txt。GPU加速使用hashcat：hashcat -m 2500 capture.hccapx wordlist.txt。',
        command: 'aircrack-ng capture-01.cap -w rockyou.txt'
      },
      {
        title: '第五步：Evil Twin攻击原理与防御',
        description: '创建恶意热点诱骗用户连接。攻击原理：1) 扫描附近WiFi；2) 创建同名WiFi；3) 用户连接恶意热点；4) 中间人拦截流量。防御措施：1) 启用路由器WPA3；2) 不自动连接陌生WiFi；3) 使用VPN；4) 检查SSL证书；5) 不在公共WiFi处理敏感业务。',
        command: 'airbase-ng -e "TargetWiFi" -c 6 wlan0mon'
      },
      {
        title: '第六步：保护家庭WiFi安全',
        description: '家庭WiFi安全配置清单：1) 使用WPA3或WPA2-SAE加密；2) 设置12位以上复杂密码；3) 关闭WPS；4) 隐藏SSID；5) 定期检查连接设备；6) 更新路由器固件；7) 关闭远程管理；8) 使用访客网络隔离访客。检查方法：定期登录路由器查看连接设备列表，发现陌生设备立即断开并修改密码。',
        command: '路由器: WPA3 + 强密码 + 关闭WPS'
      },
      {
        title: '第七步：公共WiFi安全使用',
        description: '公共WiFi的风险：数据可能被窃听、可能存在恶意热点、网络可能被监控。使用建议：1) 尽量使用移动数据；2) 使用VPN加密所有流量；3) 避免访问敏感网站；4) 不进行网上银行操作；5) 使用HTTPS浏览；6) 禁用文件共享；7) 使用手机热点代替公共WiFi。',
        note: '公共WiFi下必须使用VPN'
      }
    ],
    examples: [
      {
        title: '完整WPA2破解流程（授权测试）',
        input: '使用Aircrack-ng套件',
        output: '1. airmon-ng start wlan0 2. airodump-ng wlan0mon 扫描 3. airodump-ng -c 6 --bssid XX -w cap wlan0mon 4. aireplay-ng -0 10 -a XX wlan0mon 强制断开 5. aircrack-ng capture-01.cap -w wordlist.txt',
        explanation: '完整的无线安全测试流程，仅授权测试使用'
      },
      {
        title: '无线安全加固检查清单',
        input: '检查家庭WiFi安全设置',
        output: '1. 加密方式WPA3或WPA2-SAE 2. 密码12位以上 3. WPS已关闭 4. SSID隐藏或无个人信息 5. 固件最新版本 6. 远程管理已关闭 7. 访客网络已启用并隔离 8. 连接设备已检查无异常',
        explanation: '完成以上检查确保WiFi基本安全'
      }
    ],
    tips: ['WPA3是最安全的WiFi加密标准', 'WPS功能必须关闭', '公共WiFi必须使用VPN', '定期检查路由器连接设备', '使用复杂密码避免被字典破解', '企业应部署无线入侵检测系统', '发现恶意AP立即举报', '无线安全测试必须获得授权'],
    warnings: ['破解他人WiFi是违法行为', '无线攻击测试必须获得书面授权', 'WEP加密已被完全破解', '公共WiFi数据可能被窃听', 'Evil Twin攻击是犯罪行为', '使用无线攻击工具需遵守法律', '未授权的无线入侵测试违法', '保护自己的无线网络安全是必要的'],
    tags: ['无线安全', 'WiFi破解', 'Aircrack-ng', 'WPA2', 'Evil Twin', '无线防御']
  },

  {
    id: 'malware-analysis-basic',
    name: '恶意软件分析基础完整教程',
    description: '详细讲解恶意软件类型、分析环境搭建、静态分析、动态分析等恶意软件分析基础知识',
    category: '恶意软件分析',
    subcategory: '样本分析',
    language: 'Python/Assembly',
    platform: ['Windows', 'Linux', '虚拟机'],
    difficulty: 'hard',
    author: '安全研究',
    features: ['静态分析', '动态分析', '沙箱分析', '行为分析', '逆向基础'],
    requirements: ['虚拟机环境', '分析工具', '了解操作系统原理'],
    installation: '安装FlareVM、Cuckoo等分析环境',
    usage: '在隔离环境中分析恶意样本',
    steps: [
      {
        title: '第一步：了解恶意软件类型',
        description: '常见恶意软件分类：1) 病毒：自我复制，感染其他文件；2) 蠕虫：自我复制通过网络传播；3) 木马：伪装成正常程序，远程控制；4) 勒索软件：加密文件勒索赎金；5) 间谍软件：窃取用户信息；6) 广告软件：强制展示广告；7) 挖矿木马：利用系统资源挖矿；8) Rootkit：隐藏自身和攻击痕迹。理解类型有助于分析方向。',
        note: '分析恶意软件务必在隔离环境中进行'
      },
      {
        title: '第二步：搭建分析环境',
        description: '安全的分析环境搭建：1) 使用虚拟机VirtualBox或VMware；2) 隔离网络Host-Only或仅主机模式；3) 快照功能：分析前创建快照；4) 监控工具：Process Monitor、API Monitor、Process Explorer；5) 网络工具Wireshark、Fiddler；6) 调试器x64dbg、IDA；7) 反编译工具Ghidra、JADX。推荐分析系统FlareVM（Windows）、REMnux（Linux）。',
        command: '使用VirtualBox创建隔离的Windows分析虚拟机'
      },
      {
        title: '第三步：静态分析基础',
        description: '不运行样本的分析方法。分析步骤：1) 文件属性：查看文件大小、创建时间、签名；2) 字符串分析strings命令提取可疑字符串；3) 文件哈希md5sum/sha256sum计算哈希值；4) 导入表分析查看DLL和函数；5) PE头分析检查节表、入口点；6) 壳检测查看是否加壳。常用工具PEiD（壳检测）、Detect It Easy（查壳）、Exeinfo PE、CFF Explorer。',
        command: 'strings malware.exe && file malware.exe && sha256sum malware.exe'
      },
      {
        title: '第四步：恶意样本哈希查询',
        description: '使用哈希值查询已知恶意软件。查询网站：1) VirusTotalvirustotal.com最全面；2) Malware Bazaarbazaar.abuse.ch；3) Hybrid Analysishybrid-analysis.com；4) Any.Runany.run交互式分析；5) Joe Sandboxjoesandbox.com。查询步骤：将样本哈希粘贴到搜索框，查看各安全厂商的检测结果和样本信息。',
        command: '访问 virustotal.com，输入文件哈希查询'
      },
      {
        title: '第五步：动态行为分析',
        description: '在隔离环境中运行样本观察行为。监控内容：1) 文件操作创建、修改、删除文件；2) 注册表操作添加启动项、修改配置；3) 进程活动创建新进程、注入其他进程；4) 网络活动连接C2服务器、DNS查询；5) API调用使用API Monitor监控。工具：Process Monitor（文件/注册表）、Process Explorer（进程）、TCPView（网络连接）。',
        command: 'ProcessMonitor开启后运行样本，观察文件注册表进程活动'
      },
      {
        title: '第六步：网络流量分析',
        description: '分析样本的网络通信行为。工具：1) Wireshark抓包分析；2) Fiddler HTTP/HTTPS代理分析；3) FakeNet模拟网络环境。分析内容：1) DNS查询解析哪些域名；2) C2通信连接的命令控制服务器；3) 数据外传上传什么数据；4) 协议分析使用什么协议通信。',
        command: 'Wireshark捕获流量，过滤dns.qry.name'
      },
      {
        title: '第七步：沙箱分析',
        description: '使用自动化沙箱分析样本。推荐沙箱：1) Any.Run交互式分析；2) Hybrid Analysis详细报告；3) Joe Sandbox深度分析；4) Any.run在线分析。使用方法上传样本或哈希，选择分析配置，等待报告。优点无需本地搭建环境，自动完成多种分析。缺点样本公开可能泄露，需注意敏感样本。',
        command: '访问 any.run 或 hybrid-analysis.com 上传样本分析'
      },
      {
        title: '第八步：勒索软件分析特殊处理',
        description: '勒索软件分析的特殊注意事项：1) 绝对不能在真实环境中运行；2) 勒索软件可能加密整个磁盘；3) 使用只读快照；4) 准备文件备份；5) 断开网络；6) 准备好解密工具。勒索软件特征加密大量文件、修改文件扩展名、创建勒索信。预防措施使用强大的杀毒软件、定期备份重要数据。',
        note: '勒索软件极其危险，分析必须极度小心'
      }
    ],
    examples: [
      {
        title: '基本静态分析命令',
        input: '分析可疑可执行文件',
        output: 'file sample.exe / 计算哈希 sha256sum sample.exe / 提取字符串 strings sample.exe / 查看导入表 objdump -x sample.exe',
        explanation: '基本的静态分析命令组合用于初步分析样本'
      },
      {
        title: '恶意软件分析检查清单',
        input: '分析开始前的准备工作',
        output: '1. 虚拟机快照已创建 2. 隔离网络已配置 3. 监控工具已就绪 4. 文件已备份 5. 分析计划已制定 6. 样本哈希已记录 7. 分析环境整洁 8. 准备记录工具',
        explanation: '分析前确保环境安全和准备充分'
      }
    ],
    tips: ['分析环境必须与宿主机隔离', '运行恶意软件前创建快照', '敏感样本不要上传到在线沙箱', '使用哈希值查询已知样本', '静态分析优先于动态分析', '记录所有发现', '关注IOC指标', '保持工具和知识更新'],
    warnings: ['恶意软件分析必须使用隔离环境', '不要在真实环境中运行恶意软件', '勒索软件可能加密整个磁盘', '敏感样本不要上传到公开沙箱', '分析后彻底清理虚拟机', '接触恶意样本需要专业培训', '不要分享恶意软件样本', '遵守相关法律法规'],
    tags: ['恶意软件分析', '静态分析', '动态分析', '沙箱', '逆向工程', '恶意样本']
  },

  {
    id: 'incident-response-guide',
    name: '网络安全应急响应完整指南',
    description: '详细讲解安全事件响应流程、取证收集、事件分析、系统恢复等应急响应知识',
    category: '应急响应',
    subcategory: '事件响应',
    language: 'Multi',
    platform: ['Windows', 'Linux'],
    difficulty: 'hard',
    author: '安全研究',
    features: ['事件分类', '证据收集', '日志分析', '系统恢复', '溯源分析'],
    requirements: ['应急响应知识', '系统管理经验', '取证工具使用能力'],
    installation: '安装Volatility、Autopsy等取证工具',
    usage: '在安全事件发生时执行',
    steps: [
      {
        title: '第一步：应急响应流程概述',
        description: '标准化应急响应流程PDCERF：1) 准备阶段Preparation建立响应团队、制定预案、准备工具；2) 发现阶段Identification识别安全事件、初步评估；3) 遏制阶段Containment隔离受影响系统、阻止扩散；4) 消除阶段Eradication清除恶意软件、修复漏洞；5) 恢复阶段Recovery恢复系统、验证安全；6) 总结阶段Lessons Learned复盘总结、改进预案。',
        note: '制定应急响应预案是预防工作的关键'
      },
      {
        title: '第二步：事件识别与初步评估',
        description: '识别安全事件的信号：1) 系统异常运行缓慢、频繁崩溃、未知进程；2) 网络异常大量出站流量、异常连接、DNS查询异常；3) 账户异常未知账户、权限提升、异常登录；4) 文件异常未知文件、文件被修改、系统文件丢失。初步评估：1) 影响范围哪些系统受影响；2) 严重程度机密性、完整性、可用性影响；3) 业务影响是否影响核心业务。',
        command: '检查系统日志安全日志网络连接初步判断事件'
      },
      {
        title: '第三步：证据收集与保全',
        description: '证据收集原则：1) 完整性收集所有相关证据；2) 可追溯性记录收集时间和方法；3) 合法性证据获取需合法。收集内容：1) 系统日志Windows事件日志、Linux syslog；2) 内存镜像使用FTK Imager、DumpIt；3) 磁盘镜像使用DD、FTK Imager；4) 网络流量PCAP文件；5) 注册表Hive文件。',
        command: 'FTK Imager采集内存和磁盘镜像，记录哈希值'
      },
      {
        title: '第四步：Windows日志分析',
        description: 'Windows关键日志：1) 安全日志Security登录事件、账户变更、策略变更；2) 系统日志System驱动加载、服务状态；3) 应用程序日志Application应用错误。分析工具：1) Windows事件查看器；2) LogParser命令行日志分析；3) Timeline Explorer时间线分析；4) EVTXtract日志恢复。关注事件：4624登录成功、4625登录失败、4672特权分配。',
        command: 'LogParser SELECT FROM Security.evtx WHERE EventID=4624'
      },
      {
        title: '第五步：内存取证分析',
        description: '内存分析工具Volatility：1) 进程分析pslist、psscan、pstree；2) 网络连接netscan、connections；3) 注册表hivelist、printkey；4) 命令历史cmdscan；5) 恶意软件检测malfind、yarascan。分析步骤：1) 识别操作系统配置文件；2) 列出进程；3) 检查隐藏/恶意进程；4) 分析网络连接；5) 检查注册表改动；6) 提取可疑数据。',
        command: 'volatility -f memory.dmp --profile=Win10x64_19041 pslist'
      },
      {
        title: '第六步：恶意软件检测与清除',
        description: '检测方法：1) 杀毒软件扫描使用多个引擎；2) 哈希查询VirusTotal等；3) 行为分析沙箱运行观察；4) YARA规则扫描。清除步骤：1) 隔离系统；2) 终止恶意进程；3) 删除恶意文件和注册表项；4) 修复被篡改的系统文件；5) 重置被入侵账户密码；6) 更新补丁；7) 监控系统确保清除干净。',
        command: '杀毒软件全盘扫描，记录并清除检测到的威胁'
      },
      {
        title: '第七步：溯源分析与攻击链路重构',
        description: '溯源分析方法：1) 日志关联时间线串联所有事件；2) IOC匹配IP、域名、文件哈希查询；3) 攻击指纹恶意软件特征、攻击手法；4) 社交媒体了解攻击者背景。工具MISP（威胁情报平台）、VirusTotal、Shodan、Censys。重构攻击链路：1) 入口点如何入侵；2) 横向移动如何在系统间移动；3) 目标达成最终目的。',
        command: '使用MISP收集IOC，构建完整攻击时间线'
      }
    ],
    examples: [
      {
        title: 'Windows安全事件快速检查',
        input: '发现可疑事件时快速检查',
        output: '检查最近登录 Get-WinEvent -FilterHashtable 搜索 Security事件 / 检查异常进程 tasklist /v / 检查网络连接 netstat -ano / 检查启动项 wmic startup list',
        explanation: '快速收集Windows安全事件信息用于初步判断'
      },
      {
        title: '应急响应准备检查清单',
        input: '准备阶段的检查项',
        output: '1. 应急响应团队已组建 2. 联系方式已更新 3. 应急工具包已准备 4. 预案文档已编写 5. 备份已验证 6. 隔离环境已准备 7. 日志存储空间充足 8. 团队培训已完成',
        explanation: '准备充分才能有效应对安全事件'
      }
    ],
    tips: ['制定详细的应急响应预案', '定期进行应急演练', '保持工具和环境更新', '重要数据定期备份', '日志保留足够长时间', '保持与执法部门的沟通渠道', '事件响应记录要详细', '事后复盘总结经验教训'],
    warnings: ['证据收集必须合法合规', '修改系统可能破坏证据', '应急响应需要专业培训', '涉及法律案件需咨询专业人士', '不要在未隔离的环境中运行可疑程序', '日志删除可能影响溯源', '应急响应人员需要冷静判断', '事后整改必须彻底'],
    tags: ['应急响应', '事件响应', '取证', '溯源', '日志分析', '内存取证']
  },

  {
    id: 'digital-forensics-guide',
    name: '数字取证分析完整教程',
    description: '详细讲解硬盘取证、手机取证、网络取证、内存取证等数字取证技术',
    category: '取证分析',
    subcategory: '数字取证',
    language: 'Multi',
    platform: ['Windows', 'Linux'],
    difficulty: 'hard',
    author: '安全研究',
    features: ['硬盘取证', '手机取证', '网络取证', '文件恢复', '证据链'],
    requirements: ['取证工具', '操作系统知识', '法律知识基础'],
    installation: '安装Autopsy、Forensics Toolkit等',
    usage: '在合法授权下进行取证',
    steps: [
      {
        title: '第一步：数字取证基础与原则',
        description: '数字取证定义使用科学方法收集、分析、提交数字证据。核心原则：1) 完整性证据必须保持原始状态；2) 可追溯性记录所有操作；3) 可靠性方法经过验证；4) 合法性收集过程合法。取证流程：1) 识别证据；2) 保存证据；3) 分析证据；4) 呈现结果。涉及法律电子数据可以作为法庭证据，但需满足真实性、合法性要求。',
        note: '取证工作必须遵守法律法规'
      },
      {
        title: '第二步：硬盘镜像采集',
        description: '硬盘取证的第一步是制作镜像。采集工具：1) FTK Imager免费可视化工具；2) DD/Linux命令行镜像工具；3) Guymager Linux图形化工具；4) Cellebrite手机取证。采集步骤：1) 记录硬盘信息型号、序列号、容量；2) 计算原始哈希MD5/SHA256；3) 制作镜像文件；4) 验证镜像哈希与原始一致。',
        command: 'dd if=/dev/sdb of=disk_image.dd bs=4M status=progress && sha256sum disk_image.dd'
      },
      {
        title: '第三步：文件系统分析',
        description: '分析硬盘上的文件系统结构。NTFS分析MFT表、USN日志、文件时间戳。Ext分析inode、超级块、日志。工具：1) Autopsy综合取证平台；2) Sleuth Kit命令行工具集；3) FTK综合取证软件。分析内容：1) 已删除文件恢复；2) 文件时间线分析；3) 分区表分析；4) 自由空间分析；5) 交换文件分析。',
        command: 'autopsy打开镜像文件进行综合分析'
      },
      {
        title: '第四步：文件恢复与深度分析',
        description: '恢复已删除或损坏的文件。工具：1) Recuva Windows文件恢复；2) TestDisk分区和文件恢复；3) Foremost基于文件头恢复；4) PhotoRec跨平台文件恢复。分析内容：1) 文件签名识别；2) 文件雕刻从磁盘原始数据提取文件；3) 隐藏数据发现；4) 加密检测。',
        command: 'foremost -i disk_image.dd -o output_directory'
      },
      {
        title: '第五步：时间线分析',
        description: '构建系统活动时间线。时间戳类型：1) MAC时间修改、访问、创建时间；2) NTFS MACE时间；3) 注册表键值修改时间。时间线工具：1) Plaso/log2timeline自动时间线生成；2) Timeline Explorer可视化时间线。时间线分析可以还原攻击者活动顺序，识别异常事件。',
        command: 'log2timeline.py image.raw timeline.plaso && psort.py timeline.plaso timeline.csv'
      },
      {
        title: '第六步：手机取证',
        description: '移动设备取证方法。Android取证：1) 逻辑提取ADB备份；2) 物理提取DD镜像需要root；3) 云提取Google账户数据。工具：Cellebrite UFED、Oxygen Forensic Detective、ADB Backup Extractor。iPhone取证：1) 逻辑提取iTunes备份；2) 物理提取越狱设备；3) 云提取iCloud备份。提取内容通讯录、通话记录、短信、微信/QQ聊天记录、位置历史、照片视频、应用数据。',
        command: 'adb backup -apk -shared -all -f backup.ab'
      }
    ],
    examples: [
      {
        title: '基础硬盘取证流程',
        input: '使用Autopsy进行取证分析',
        output: '1. 创建磁盘镜像记录哈希值 2. 在Autopsy中创建案例 3. 加载镜像文件 4. 配置数据源和模块 5. 运行分析 6. 标记和注释重要发现 7. 生成取证报告',
        explanation: '完整的Autopsy取证分析流程'
      },
      {
        title: '文件恢复工具对比',
        input: '选择合适的恢复工具',
        output: 'Recuva易用Windows快速扫描 / TestDisk强分区恢复支持多种文件系统 / Foremost文件雕刻基于文件签名 / PhotoRec跨平台支持400+文件类型',
        explanation: '不同工具适用于不同场景'
      }
    ],
    tips: ['取证前确保证据完整性', '哈希验证是证据可信的关键', '时间线分析有助于还原事件', '注册表包含丰富的用户活动信息', '手机取证需要了解系统特性', '网络流量可以揭示隐藏的攻击', '取证报告必须详细准确', '必要时寻求专业法律意见'],
    warnings: ['未经授权的取证是违法行为', '证据收集必须合法合规', '修改原始证据会失去法律效力', '取证人员需要专业培训', '涉及隐私的数据需保密', '法庭质证需要专家证人', '跨境取证有特殊法律规定', '证据链必须完整'],
    tags: ['数字取证', '硬盘取证', '手机取证', '网络取证', '证据链', '取证工具']
  },

  {
    id: 'network-scanning-tools',
    name: '网络扫描与信息收集完整教程',
    description: '详细讲解Nmap高级扫描、资产发现、端口服务识别、漏洞扫描等网络信息收集技术',
    category: '信息收集',
    subcategory: '网络扫描',
    language: 'Bash/Python',
    platform: ['Linux', 'Kali Linux'],
    difficulty: 'medium',
    author: '安全研究',
    features: ['资产发现', '端口扫描', '服务识别', '漏洞扫描', 'NSE脚本'],
    requirements: ['网络基础知识', 'Linux命令行', 'TCP/IP协议理解'],
    installation: 'apt install nmap masscan',
    usage: '在授权范围内进行扫描',
    steps: [
      {
        title: '第一步：Nmap基础与主机发现',
        description: 'Nmap是最强大的网络扫描工具。基础扫描：nmap 192.168.1.1。主机发现选项：-sn只做主机发现不扫描端口；-Pn跳过主机发现强制扫描所有IP；-PS/PA/PU TCP SYN/ACK/UDP发现；-PR ARP发现局域网最有效。示例：nmap -sn 192.168.1.0/24扫描整个网段在线主机。',
        command: 'nmap -sn 192.168.1.0/24'
      },
      {
        title: '第二步：端口扫描技术',
        description: '端口扫描发现开放服务。扫描类型：1) TCP Connect -sT完整三次握手；2) SYN扫描 -sS半开放扫描需要root；3) UDP扫描 -sU扫描UDP端口；4) 综合扫描 -sV版本检测；5) 操作系统检测 -O。端口范围：-p 80,443指定端口；-p 1-1000端口范围；-p-所有端口。速度控制 -T1到-T5从慢到快。',
        command: 'nmap -sS -p 1-1000 -T4 192.168.1.100'
      },
      {
        title: '第三步：服务与版本识别',
        description: '识别端口上运行的服务和版本。命令：nmap -sV 192.168.1.1。-sV选项会发送探测包识别服务版本。输出示例：PORT STATE SERVICE VERSION 22/tcp open ssh OpenSSH 7.4。版本信息对于漏洞评估很重要。--version-intensity控制探测强度1-9。',
        command: 'nmap -sV --version-intensity 5 192.168.1.0/24'
      },
      {
        title: '第四步：NSE脚本使用',
        description: 'Nmap Scripting Engine扩展扫描能力。脚本位置：/usr/share/nmap/scripts/。常用脚本：1) vuln系列漏洞检测；2) discovery系列服务发现；3) auth系列认证检测；4) brute系列暴力破解。使用命令：nmap --script=vuln 192.168.1.1。指定脚本：--script=http-enum,http-title。更新脚本：nmap --script-updatedb。',
        command: 'nmap --script=vuln -p 80,443 192.168.1.1'
      },
      {
        title: '第五步：Masscan高速扫描',
        description: 'Masscan支持异步高速扫描适合大规模扫描。安装：apt install masscan。特点比Nmap快100倍，可设置任意速率。限制不检测版本，不检测操作系统。命令：masscan 0.0.0.0/0 -p0-65535 --rate 100000。注意事项高速扫描可能触发IDS，需要授权。',
        command: 'masscan 10.0.0.0/8 -p22,80,443 --rate=10000'
      },
      {
        title: '第六步：漏洞扫描器使用',
        description: '自动化漏洞检测工具。开源工具：1) OpenVAS综合漏洞扫描器；2) Nessus功能强大付费；3) Nikto Web服务器漏洞。安装OpenVAS：apt install openvas；openvas-setup。扫描命令：openvas-cli scan-targets。Web漏洞扫描：nikto -h https://target.com。',
        command: 'nikto -h http://192.168.1.1 -o scan_report.txt'
      },
      {
        title: '第七步：DNS信息收集',
        description: '收集DNS记录和子域名。工具：1) dig查询DNS记录；2) nslookup DNS查询；3) host DNS查找；4) dnsenum DNS枚举；5) amass子域名发现。查询示例：dig example.com ANY；dnsenum example.com。子域名收集：amass enum -passive -o subdomains.txt -d example.com。',
        command: 'dnsenum example.com && amass enum -passive -d target.com'
      }
    ],
    examples: [
      {
        title: '综合网络扫描命令',
        input: '完整的内网安全评估扫描',
        output: '主机发现: nmap -sn 192.168.1.0/24 / 端口扫描: nmap -sS -sV -O -p- -T4 192.168.1.0/24 / 漏洞扫描: nmap --script=vuln 192.168.1.0/24 / Web漏洞: nikto -h http://192.168.1.x',
        explanation: '完整的安全评估扫描流程'
      },
      {
        title: '扫描结果分析检查清单',
        input: '分析扫描报告时的检查项',
        output: '1. 是否有不必要的服务运行？2. 开放端口是否符合预期？3. 服务版本是否有已知漏洞？4. 高危端口是否暴露在公网？5. 是否有未打补丁的系统？6. 认证机制是否安全？7. SSL/TLS配置是否正确？8. 是否有信息泄露风险？',
        explanation: '系统性分析扫描结果'
      }
    ],
    tips: ['扫描前确保获得授权', '使用速率限制避免触发告警', '结果要验证避免误报', '关注高危端口和服务', '结合多种工具交叉验证', '保留扫描日志作为证据', '定期扫描监控变化', '扫描报告要详细准确'],
    warnings: ['未经授权的扫描是违法行为', '高速扫描可能触发防火墙', '某些扫描可能影响业务系统', '扫描结果可能被攻击者利用', '需要书面授权文件', '扫描活动要保密', '遵守相关法律法规', '负责任的披露漏洞'],
    tags: ['Nmap', '网络扫描', '端口扫描', '漏洞扫描', '信息收集', '安全评估']
  },

  {
    id: 'api-security-testing',
    name: 'API安全测试完整教程',
    description: '详细讲解REST API安全测试，包括认证测试、注入测试、越权测试、接口安全等',
    category: 'Web安全',
    subcategory: 'API安全',
    language: 'Python/Bash',
    platform: ['Windows', 'Linux'],
    difficulty: 'medium',
    author: '安全研究',
    features: ['REST API测试', 'GraphQL测试', '认证测试', '越权测试', '模糊测试'],
    requirements: ['HTTP协议基础', 'REST API概念', 'Burp Suite使用'],
    installation: '安装Burp Suite、Postman',
    usage: '在授权范围内进行API测试',
    steps: [
      {
        title: '第一步：API安全测试基础',
        description: 'API安全测试概述：API是应用程序接口，常见类型REST、SOAP、GraphQL。常见安全问题：1) 失效的对象级授权BOLA；2) 失效的用户认证；3) 过度数据泄露；4) 缺乏资源和速率限制；5) 批量赋值；6) 错误配置；7) 注入；8) 资产管理不当。测试工具Burp Suite、Postman、SOAPUI、Insomnia。',
        note: 'API安全是Web安全的重要组成'
      },
      {
        title: '第二步：API信息收集与端点发现',
        description: '收集API信息：1) 查看API文档/swagger-ui；2) 抓包分析移动APP；3) Google Hacking查找暴露的API；4) 目录扫描发现API端点。工具：1) Burp Suite抓包分析；2) dirsearch目录扫描；3) Swagger等工具查看文档。分析请求识别API版本、认证方式、数据格式JSON/XML。',
        command: 'dirsearch -u https://api.target.com -e json,xml,html'
      },
      {
        title: '第三步：Burp Suite拦截与重放',
        description: 'Burp Suite核心功能使用。配置代理：浏览器设置Burp Suite代理127.0.0.1:8080。拦截请求：Proxy->Intercept开启拦截，修改请求后Forward。历史记录：Proxy->HTTP History查看所有请求。重放工具：Repeater修改请求重发。Intruder自动化参数fuzzing。配置SSL：安装Burp Suite证书以拦截HTTPS。',
        command: 'Burp Suite Proxy配置 -> Intercept开启 -> 修改请求 -> Repeater重放'
      },
      {
        title: '第四步：认证与授权测试',
        description: '测试API认证机制。认证测试：1) JWT测试验证签名、算法更改、过期时间；2) API Key测试是否可预测、是否在URL中泄露；3) OAuth测试重定向URI验证、Token强度。越权测试：1) IDOR测试修改用户ID查看他人数据；2) 水平越权同级别用户数据访问；3) 垂直越权普通用户访问管理员功能。',
        command: 'jwt_tool.py JWT令牌尝试破解JWT'
      },
      {
        title: '第五步：SQL注入与NoSQL注入',
        description: 'API注入漏洞测试。REST参数注入：/api/user?id=1 UNION SELECT...。JSON Body注入：username admin password OR 1=1--。NoSQL注入MongoDB：$gt。测试方法在所有输入点尝试注入payload。自动化工具sqlmap。SQLMap命令：sqlmap -u http://api.target.com/?id=1 --batch。',
        command: 'sqlmap -u http://api.target.com/user?id=1 --batch --dbs'
      },
      {
        title: '第六步：速率限制与暴力破解',
        description: '测试API防暴力机制。速率限制测试：1) 短时间内发送大量请求；2) 检查返回429 Too Many Requests；3) 绕过技术尝试修改IP、X-Forwarded-For。暴力破解测试：1) 登录接口暴力破解；2) 验证码暴力枚举；3) 密码喷洒尝试常见密码。工具Burp Intruder、hydra。',
        command: 'Burp Intruder配置payload进行暴力破解测试'
      }
    ],
    examples: [
      {
        title: 'API安全测试检查清单',
        input: 'API测试时的必检项',
        output: '1. 认证机制是否安全JWT/OAuth？2. 是否存在IDOR漏洞？3. 输入验证是否充分？4. 速率限制是否有效？5. 敏感数据是否泄露？6. CORS配置是否正确？7. 错误处理是否安全？8. API版本是否管理？',
        explanation: '系统性API安全测试要点'
      },
      {
        title: '常见API漏洞Payload',
        input: 'API测试常用测试字符串',
        output: 'SQL注入: OR 1=1-- / NoSQL: $gt $ne null / XSS: script alert 1 /s   JWT算法攻击: alg:none / 路径遍历: ../etc/passwd / 命令注入: ls -la',
        explanation: '常用API测试payload用于发现漏洞'
      }
    ],
    tips: ['API文档是测试的重要参考', '关注认证和授权两个核心安全点', '使用自动化工具辅助测试', '验证所有用户输入点', '测试边界条件和异常输入', '注意API的认证机制实现', '检查第三方API的安全性', '保持API安全测试的持续性'],
    warnings: ['API测试必须在授权范围内', '暴力破解测试可能影响业务', '测试可能产生垃圾数据', '测试结果需要妥善保管', '遵守API使用条款', '发现漏洞需负责任披露', '测试前确保有书面授权', '遵守相关法律法规'],
    tags: ['API安全', 'REST API', 'GraphQL', 'Burp Suite', '渗透测试', 'Web安全']
  },

  {
    id: 'cryptography-practical',
    name: '密码学应用与加密解密实用教程',
    description: '详细讲解对称加密、非对称加密、哈希函数、数字签名、证书管理等密码学知识及其应用',
    category: '加密解密',
    subcategory: '密码学',
    language: 'Python/命令行',
    platform: ['Windows', 'Linux'],
    difficulty: 'medium',
    author: '安全研究',
    features: ['对称加密', '非对称加密', '哈希算法', '数字签名', '证书管理'],
    requirements: ['基础的密码学概念', '命令行操作能力'],
    installation: 'openssl, gpg, Python cryptography库',
    usage: '理解和使用各种加密技术',
    steps: [
      {
        title: '第一步：密码学基础概念',
        description: '密码学核心概念：1) 机密性确保信息只有授权者能读取；2) 完整性确保信息未被篡改；3) 认证验证信息发送者身份；4) 不可否认性发送者不能否认发送过信息。密码学分类：1) 对称加密加密解密使用相同密钥速度快；2) 非对称加密公钥加密私钥解密速度慢；3) 哈希函数不可逆摘要完整性验证；4) 数字签名身份认证和完整性。',
        note: '理解基础概念是正确使用加密技术的前提'
      },
      {
        title: '第二步：OpenSSL命令行使用',
        description: 'OpenSSL是强大的加密工具。常用命令：1) 生成随机数openssl rand -hex 32；2) Base64编码openssl base64 -e/-d；3) 哈希计算openssl dgst -sha256 file.txt；4) 对称加密openssl enc -aes-256-cbc -in file.txt -out file.enc；5) 生成密钥openssl genrsa -out key.pem 2048。',
        command: 'openssl genrsa -aes256 -out private_key.pem 4096 && openssl rsa -in private_key.pem -pubout -out public_key.pem'
      },
      {
        title: '第三步：对称加密实践',
        description: '对称加密算法：AES最常用推荐256位、DES已不安全、3DES过渡方案。加密命令openssl enc -aes-256-cbc -salt -in plaintext.txt -out ciphertext.bin。解密命令openssl enc -d -aes-256-cbc -in ciphertext.bin -out plaintext.txt。参数说明：-salt添加盐增加安全性，-iter指定迭代次数PBKDF2。',
        command: 'openssl enc -aes-256-cbc -salt -pbkdf2 -iter 100000 -in secret.txt -out secret.enc'
      },
      {
        title: '第四步：非对称加密与密钥对',
        description: 'RSA密钥生成openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048。提取公钥openssl rsa -in private.pem -pubout -out public.pem。加密openssl pkeyutl -encrypt -pubin -inkey public.pem -in data.txt -out data.enc。解密openssl pkeyutl -decrypt -inkey private.pem -in data.enc -out data.txt。',
        command: '生成RSA 2048位密钥对并测试加解密'
      },
      {
        title: '第五步：哈希函数与消息认证',
        description: '常见哈希算法MD5已不安全、SHA-1已不安全、SHA-256推荐、SHA-3最新标准。计算哈希openssl dgst -sha256 file.txt。HMAC带密钥的哈希openssl dgst -sha256 -hmac secretkey file.txt。应用密码存储、文件完整性验证、数字签名。密码存储不要明文存储密码，使用bcrypt、Argon2等专业算法。',
        command: 'openssl dgst -sha256 -hmac your-secret-key data.txt'
      },
      {
        title: '第六步：数字签名与验证',
        description: '数字签名保证消息真实性和完整性。签名过程哈希消息->用私钥加密哈希->发送消息+签名+公钥。命令openssl dgst -sha256 -sign private.pem -out signature.sha256 message.txt。验证签名openssl dgst -sha256 -verify public.pem -signature signature.sha256 message.txt。应用代码签名、文档签名、SSL/TLS证书。',
        command: 'openssl dgst -sha256 -sign private_key.pem -out signature.bin document.pdf && openssl dgst -sha256 -verify public_key.pem -signature signature.bin document.pdf'
      },
      {
        title: '第七步：SSL/TLS证书管理',
        description: '证书概念数字证书绑定公钥和实体身份。创建自签名证书openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365。查看证书信息openssl x509 -in cert.pem -text -noout。生成CSRopenssl req -new -key key.pem -out request.csr。',
        command: 'openssl req -x509 -newkey rsa:4096 -nodes -keyout server.key -out server.crt -days 365 -subj /CN=localhost'
      }
    ],
    examples: [
      {
        title: '安全文件加密流程',
        input: '使用GPG加密敏感文件',
        output: '1. 导入接收者公钥 gpg --import recipient_pub.asc 2. 验证公钥 gpg --fingerprint recipient 3. 加密文件 gpg -e -r recipient file.txt 4. 签名加密 gpg -se -r recipient file.txt 5. 发送加密文件和安全删除原文件',
        explanation: '完整的GPG加密工作流程'
      },
      {
        title: '加密算法选择指南',
        input: '不同场景的算法选择',
        output: '对称加密: AES-256-GCM首选 ChaCha20-Poly1305 / 非对称加密: RSA-4096 或 ECIES / 哈希算法: SHA-256或SHA-3 / 密码存储: Argon2id首选 bcrypt scrypt / TLS: TLS 1.3',
        explanation: '根据安全需求选择合适算法'
      }
    ],
    tips: ['不要自己发明加密算法', '使用成熟的开源库', '密钥比算法更重要', 'HTTPS不等于绝对安全', '加密数据也需要备份', '密钥丢失数据无法恢复', '定期更新加密方案', '密码和密钥是最后防线'],
    warnings: ['MD5和SHA1已不安全', 'DES加密已可被破解', '错误使用加密反而更危险', '密钥硬编码在代码中是漏洞', '加密不能防止内存泄露', '量子计算威胁现有RSA', '密钥管理不当会导致全面失败', '加密不是安全的唯一保障'],
    tags: ['密码学', '对称加密', '非对称加密', '哈希', 'OpenSSL', 'GPG', '证书']
  }
];

// 分类统计
export const scriptCategories = [
  {
    name: '信息收集',
    description: '用于收集目标信息的脚本和工具',
    count: securityScripts.filter(s => s.category === '信息收集').length
  },
  {
    name: '漏洞检测',
    description: '自动化漏洞检测和扫描工具',
    count: securityScripts.filter(s => s.category === '漏洞检测').length
  },
  {
    name: '密码攻击',
    description: '密码破解和猜测工具',
    count: securityScripts.filter(s => s.category === '密码攻击').length
  },
  {
    name: '无线安全',
    description: '无线网络和安全分析工具',
    count: securityScripts.filter(s => s.category === '无线安全').length
  },
  {
    name: '逆向工程',
    description: '恶意软件分析和逆向工具',
    count: securityScripts.filter(s => s.category === '逆向工程').length
  },
  {
    name: '应急响应',
    description: '事件响应和取证分析工具',
    count: securityScripts.filter(s => s.category === '应急响应').length
  },
  {
    name: '数据包分析',
    description: '网络流量分析工具',
    count: securityScripts.filter(s => s.category === '数据包分析').length
  },
  {
    name: '加密解密',
    description: '加密解密工具集',
    count: securityScripts.filter(s => s.category === '加密解密').length
  },
  {
    name: 'Web安全',
    description: 'Web应用安全测试工具',
    count: securityScripts.filter(s => s.category === 'Web安全').length
  },
  {
    name: '云安全',
    description: '云平台安全检查工具',
    count: securityScripts.filter(s => s.category === '云安全').length
  },
  {
    name: 'CTF工具',
    description: 'CTF比赛常用工具',
    count: securityScripts.filter(s => s.category === 'CTF工具').length
  },
  {
    name: '隐私保护',
    description: 'VPN、代理、反追踪与浏览器指纹防护工具',
    count: securityScripts.filter(s => s.category === '隐私保护').length
  },
  {
    name: '社会工程学',
    description: '钓鱼攻击、身份伪装与社工防御工具',
    count: securityScripts.filter(s => s.category === '社会工程学').length
  },
  {
    name: '恶意软件分析',
    description: '恶意软件静态分析、动态分析与沙箱工具',
    count: securityScripts.filter(s => s.category === '恶意软件分析').length
  },
  {
    name: '取证分析',
    description: '硬盘取证、手机取证与数字证据分析工具',
    count: securityScripts.filter(s => s.category === '取证分析').length
  }
];

export default securityScripts;
