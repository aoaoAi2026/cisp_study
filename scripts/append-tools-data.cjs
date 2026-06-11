const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'learningData.ts');

let content = fs.readFileSync(filePath, 'utf8');

// Week themes mapping
const week1Tools = [
  {
    id: 'nmap', name: 'Nmap', description: '网络发现和端口扫描工具',
    url: 'https://nmap.org/'
  },
  {
    id: 'wireshark', name: 'Wireshark', description: '网络协议分析工具',
    url: 'https://www.wireshark.org/'
  },
  {
    id: 'kali', name: 'Kali Linux', description: '渗透测试专用操作系统',
    url: 'https://www.kali.org/'
  }
];

const week1Labs = [
  {
    id: 'juice-shop', name: 'OWASP Juice Shop',
    description: '包含 OWASP Top 10 漏洞的Web应用靶场',
    url: 'https://owasp.org/www-project-juice-shop/'
  },
  {
    id: 'dvwa', name: 'DVWA',
    description: 'Damn Vulnerable Web App - Web漏洞练习平台',
    url: 'http://www.dvwa.co.uk/'
  }
];

const week2Tools = [
  {
    id: 'compliance-checker', name: '等保合规检查工具',
    description: '网络安全等级保护合规检查工具包',
    url: 'https://www.djbh.net/'
  },
  {
    id: 'iso27001-toolkit', name: 'ISO 27001 工具包',
    description: '信息安全管理体系建设模板和工具',
    url: 'https://www.iso.org/isoiec-27001-information-security.html'
  }
];

const week2Labs = [
  {
    id: 'compliance-lab', name: '企业合规练习平台',
    description: '模拟企业合规检查和审计流程的练习环境',
    url: 'https://www.iso27001security.com/'
  }
];

const week3Tools = [
  {
    id: 'active-directory', name: 'Active Directory',
    description: 'Windows域环境访问控制系统',
    url: 'https://learn.microsoft.com/windows-server/identity/ad-ds/'
  },
  {
    id: 'keycloak', name: 'Keycloak',
    description: '开源身份认证与授权管理系统',
    url: 'https://www.keycloak.org/'
  }
];

const week3Labs = [
  {
    id: 'rbac-lab', name: 'RBAC 访问控制实验',
    description: '练习基于角色的访问控制模型配置',
    url: 'https://github.com/topics/rbac'
  }
];

const week4Tools = [
  {
    id: 'splunk', name: 'Splunk',
    description: '企业级日志分析与SIEM平台',
    url: 'https://www.splunk.com/'
  },
  {
    id: 'elk', name: 'ELK Stack',
    description: 'Elasticsearch + Logstash + Kibana 日志分析栈',
    url: 'https://www.elastic.co/elastic-stack'
  },
  {
    id: 'suricata', name: 'Suricata',
    description: '开源入侵检测/防御系统',
    url: 'https://suricata.io/'
  }
];

const week4Labs = [
  {
    id: 'siem-lab', name: 'SIEM 日志分析实验',
    description: '企业安全运营中心SOC模拟环境',
    url: 'https://github.com/splunk/attack_data'
  }
];

const week5Tools = [
  {
    id: 'sqlmap', name: 'SQLMap',
    description: '自动化SQL注入漏洞检测工具',
    url: 'https://sqlmap.org/'
  },
  {
    id: 'burpsuite', name: 'Burp Suite',
    description: 'Web应用安全测试集成平台',
    url: 'https://portswigger.net/burp'
  },
  {
    id: 'metasploit', name: 'Metasploit',
    description: '漏洞利用框架',
    url: 'https://www.metasploit.com/'
  }
];

const week5Labs = [
  {
    id: 'sqli-labs', name: 'SQLi-Labs',
    description: 'SQL注入漏洞练习靶场',
    url: 'https://github.com/Audi-1/sqli-labs'
  },
  {
    id: 'xss-lab', name: 'XSS 练习平台',
    description: '跨站脚本攻击练习环境',
    url: 'https://xss-game.appspot.com/'
  }
];

const week6Tools = [
  {
    id: 'openssl', name: 'OpenSSL',
    description: '强大的SSL/TLS协议实现和加密工具',
    url: 'https://www.openssl.org/'
  },
  {
    id: 'hashcat', name: 'Hashcat',
    description: '高速密码哈希破解工具',
    url: 'https://hashcat.net/hashcat/'
  },
  {
    id: 'john', name: 'John the Ripper',
    description: '经典密码哈希破解工具',
    url: 'https://www.openwall.com/john/'
  }
];

const week6Labs = [
  {
    id: 'crypto-lab', name: 'CryptoHack',
    description: '在线密码学学习和练习平台',
    url: 'https://cryptohack.org/'
  },
  {
    id: 'picoctf-crypto', name: 'PicoCTF 密码学',
    description: '密码学CTF练习题目集',
    url: 'https://picoctf.org/'
  }
];

const week7Tools = [
  {
    id: 'nmap', name: 'Nmap',
    description: '网络发现和安全审计工具',
    url: 'https://nmap.org/'
  },
  {
    id: 'netcat', name: 'Netcat',
    description: '网络调试和数据传输工具',
    url: 'https://nc110.sourceforge.net/'
  },
  {
    id: 'tcpdump', name: 'Tcpdump',
    description: '命令行网络数据包分析工具',
    url: 'https://www.tcpdump.org/'
  }
];

const week7Labs = [
  {
    id: 'hack-the-box', name: 'Hack The Box',
    description: '在线网络安全实验平台',
    url: 'https://www.hackthebox.com/'
  },
  {
    id: 'tryhackme', name: 'TryHackMe',
    description: '交互式网络安全学习平台',
    url: 'https://tryhackme.com/'
  }
];

const week8Tools = [
  {
    id: 'owasp-zap', name: 'OWASP ZAP',
    description: '开源Web应用安全扫描工具',
    url: 'https://www.zaproxy.org/'
  },
  {
    id: 'nikto', name: 'Nikto',
    description: 'Web服务器漏洞扫描器',
    url: 'https://cirt.net/Nikto2'
  },
  {
    id: 'dirb', name: 'dirb',
    description: 'Web目录爆破工具',
    url: 'https://dirb.sourceforge.net/'
  }
];

const week8Labs = [
  {
    id: 'bwapp', name: 'bWAPP',
    description: '含100+漏洞的Web应用靶场',
    url: 'http://www.itsecgames.com/'
  },
  {
    id: 'webgoat', name: 'WebGoat',
    description: 'OWASP官方Web安全教学应用',
    url: 'https://owasp.org/www-project-webgoat/'
  },
  {
    id: 'upload-labs', name: 'Upload-Labs',
    description: '文件上传漏洞练习靶场',
    url: 'https://github.com/c0ny1/upload-labs'
  }
];

const week9Tools = [
  {
    id: 'opencanary', name: 'OpenCanary',
    description: '开源蜜罐系统',
    url: 'https://github.com/thinkst/opencanary'
  },
  {
    id: 'security-onion', name: 'Security Onion',
    description: '网络安全监控平台',
    url: 'https://securityonionsolutions.com/'
  }
];

const week9Labs = [
  {
    id: 'physical-lab', name: '物理安全实验环境',
    description: '模拟机房环境的安全监控练习',
    url: 'https://www.securityonionsolutions.com/'
  }
];

const week10Tools = [
  {
    id: 'terraform', name: 'Terraform',
    description: '基础设施即代码工具',
    url: 'https://www.terraform.io/'
  },
  {
    id: 'ansible', name: 'Ansible',
    description: '自动化运维工具',
    url: 'https://www.ansible.com/'
  },
  {
    id: 'checkov', name: 'Checkov',
    description: '基础设施即代码静态分析工具',
    url: 'https://www.checkov.io/'
  }
];

const week10Labs = [
  {
    id: 'devsecops-lab', name: 'DevSecOps 实验',
    description: '安全开发运维一体化练习',
    url: 'https://www.devsecops.org/'
  }
];

const week11Tools = [
  {
    id: 'owasp-top10', name: 'OWASP Top 10',
    description: 'Web应用安全风险十大排名',
    url: 'https://owasp.org/www-project-top-ten/'
  },
  {
    id: 'mitre-attack', name: 'MITRE ATT&CK',
    description: ' adversary战术和技术知识库',
    url: 'https://attack.mitre.org/'
  }
];

const week11Labs = [
  {
    id: 'business-security', name: '业务安全演练',
    description: '模拟真实业务场景的安全练习',
    url: 'https://attack.mitre.org/'
  }
];

const week12Tools = [
  {
    id: 'cisp-exam', name: 'CISP 模拟考试系统',
    description: '注册信息安全专业人员备考资源',
    url: 'https://www.cisp.com.cn/'
  }
];

const week12Labs = [
  {
    id: 'exam-review', name: '综合考试复习',
    description: '90天学习的全面回顾和巩固',
    url: 'https://www.cisp.com.cn/'
  }
];

const weekData = {
  1: { tools: week1Tools, labs: week1Labs },
  2: { tools: week2Tools, labs: week2Labs },
  3: { tools: week3Tools, labs: week3Labs },
  4: { tools: week4Tools, labs: week4Labs },
  5: { tools: week5Tools, labs: week5Labs },
  6: { tools: week6Tools, labs: week6Labs },
  7: { tools: week7Tools, labs: week7Labs },
  8: { tools: week8Tools, labs: week8Labs },
  9: { tools: week9Tools, labs: week9Labs },
  10: { tools: week10Tools, labs: week10Labs },
  11: { tools: week11Tools, labs: week11Labs },
  12: { tools: week12Tools, labs: week12Labs }
};

function formatTools(tools) {
  if (!tools || tools.length === 0) return '';
  const items = tools.map(t => 
    `    {\n      id: '${t.id}',\n      name: '${t.name}',\n      description: '${t.description}',\n      url: '${t.url}'\n    }`
  ).join(',\n');
  return `[\n${items}\n  ]`;
}

function getWeekForDay(dayNum) {
  return Math.ceil(dayNum / 7);
}

// Process each day entry
// Pattern: match each day object and add the new fields before the closing }
// We match from `id: 'day-XX'` to the closing `  },`

let outputLines = [];
const lines = content.split('\n');

let i = 0;
while (i < lines.length) {
  const line = lines[i];
  const dayMatch = line.match(/id:\s*'(day-\d+)'/);
  
  if (dayMatch) {
    // Found a day entry, collect until we find the closing `  },`
    const dayNumMatch = dayMatch[1].match(/day-(\d+)/);
    const dayNum = parseInt(dayNumMatch[1]);
    const week = getWeekForDay(dayNum);
    
    outputLines.push(line);
    i++;
    
    // Collect remaining lines of this object
    let objectLines = [];
    let foundClosing = false;
    
    while (i < lines.length && !foundClosing) {
      const innerLine = lines[i];
      
      // Check for recommendedTools or labEnvironments already present
      if (innerLine.includes('recommendedTools') || innerLine.includes('labEnvironments')) {
        // Skip existing entries
        while (i < lines.length && !lines[i].includes('],')) {
          i++;
        }
        i++; // skip the `  ],` line
        continue;
      }
      
      // Check for the closing of this object
      if (innerLine.trim() === '},' || innerLine.trim() === '};') {
        // Add the new fields before closing
        const data = weekData[week] || weekData[1];
        const toolsStr = formatTools(data.tools);
        const labsStr = formatTools(data.labs);
        
        objectLines.push(`    recommendedTools: ${toolsStr},`);
        objectLines.push(`    labEnvironments: ${labsStr}`);
        objectLines.push(innerLine);
        foundClosing = true;
      } else {
        objectLines.push(innerLine);
      }
      i++;
    }
    
    outputLines.push(...objectLines);
  } else {
    outputLines.push(line);
    i++;
  }
}

const result = outputLines.join('\n');
fs.writeFileSync(filePath, result, 'utf8');
console.log('Successfully updated learningData.ts');
