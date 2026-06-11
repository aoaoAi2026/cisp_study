const express = require('express');
const {
  labContainers,
  startContainer,
  stopContainer,
  getAllStatuses,
  getContainerStatus,
} = require('../lib/dockerLabs');

const router = express.Router();

router.get('/list', async (req, res) => {
  try {
    const statuses = await getAllStatuses();
    res.json({ containers: statuses, total: statuses.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/status/:containerId', async (req, res) => {
  try {
    const container = labContainers.find((c) => c.id === req.params.containerId);
    if (!container) {
      return res.status(404).json({ error: '容器不存在' });
    }
    const status = await getContainerStatus(req.params.containerId);
    res.json({ ...container, ...status });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/start/:containerId', async (req, res) => {
  try {
    const result = await startContainer(req.params.containerId);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/stop/:containerId', async (req, res) => {
  try {
    const result = await stopContainer(req.params.containerId);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/tools', (req, res) => {
  const tools = [
    {
      id: 'nmap',
      name: 'Nmap',
      description: '最流行的网络扫描工具，用于主机发现、端口扫描、服务探测',
      commands: [
        { name: '基础扫描', cmd: 'nmap 192.168.1.1', description: '扫描单个IP的常用端口' },
        { name: '全端口扫描', cmd: 'nmap -p- 192.168.1.1', description: '扫描所有65535个端口' },
        { name: '服务版本探测', cmd: 'nmap -sV 192.168.1.1', description: '识别目标端口上运行的服务版本' },
        { name: '操作系统识别', cmd: 'nmap -O 192.168.1.1', description: '尝试识别目标操作系统' },
        { name: '综合扫描', cmd: 'nmap -A -T4 192.168.1.1', description: '综合扫描：OS+版本+脚本+traceroute' },
        { name: '主机发现', cmd: 'nmap -sn 192.168.1.0/24', description: '扫描整个子网内的存活主机' },
      ],
      officialSite: 'https://nmap.org/',
    },
    {
      id: 'burpsuite',
      name: 'Burp Suite',
      description: 'Web应用安全测试的瑞士军刀，包含代理、扫描器、爬虫等工具',
      commands: [
        { name: '启动代理', cmd: 'Burp Suite -> Proxy -> Intercept is ON', description: '开启浏览器代理拦截功能' },
        { name: '主动扫描', cmd: 'Target -> Site map -> Right click -> Scan', description: '对目标站点进行主动漏洞扫描' },
        { name: '重放请求', cmd: 'Repeater -> Paste request -> Send', description: '手动重放和修改HTTP请求' },
        { name: '暴力破解', cmd: 'Intruder -> Positions -> Payloads -> Start attack', description: '对参数进行爆破攻击' },
      ],
      officialSite: 'https://portswigger.net/burp',
    },
    {
      id: 'sqlmap',
      name: 'SQLMap',
      description: '自动化SQL注入工具，可检测和利用数据库漏洞',
      commands: [
        { name: '基本注入检测', cmd: 'sqlmap -u "http://example.com/page?id=1"', description: '检测URL参数是否存在SQL注入' },
        { name: '获取数据库', cmd: 'sqlmap -u "http://example.com/page?id=1" --dbs', description: '枚举所有数据库' },
        { name: '获取表', cmd: 'sqlmap -u "http://example.com/page?id=1" -D dbname --tables', description: '列出指定数据库的表' },
        { name: '获取字段', cmd: 'sqlmap -u "http://example.com/page?id=1" -D dbname -T users --columns', description: '列出表的列名' },
        { name: '获取数据', cmd: 'sqlmap -u "http://example.com/page?id=1" -D dbname -T users --dump', description: '导出表数据' },
        { name: '获取shell', cmd: 'sqlmap -u "http://example.com/page?id=1" --os-shell', description: '尝试获取操作系统shell' },
      ],
      officialSite: 'https://sqlmap.org/',
    },
    {
      id: 'hydra',
      name: 'Hydra',
      description: '强大的在线密码爆破工具，支持多种协议',
      commands: [
        { name: 'SSH爆破', cmd: 'hydra -l root -P wordlist.txt ssh://192.168.1.1', description: 'SSH密码爆破' },
        { name: 'FTP爆破', cmd: 'hydra -L users.txt -P pass.txt ftp://192.168.1.1', description: 'FTP用户名密码爆破' },
        { name: 'HTTP POST表单', cmd: 'hydra -l admin -P pass.txt 192.168.1.1 http-post-form "/login:username=^USER^&password=^PASS^:F=failed"', description: 'Web登录表单爆破' },
        { name: 'SMB爆破', cmd: 'hydra -L users.txt -P pass.txt smb://192.168.1.1', description: 'Windows SMB密码爆破' },
      ],
      officialSite: 'https://github.com/vanhauser-thc/thc-hydra',
    },
    {
      id: 'john',
      name: 'John the Ripper',
      description: '经典的密码破解工具，支持多种哈希格式',
      commands: [
        { name: '破解MD5哈希', cmd: 'john --format=raw-md5 hashes.txt', description: '暴力破解MD5哈希' },
        { name: '破解Linux密码', cmd: 'john /etc/shadow', description: '破解Linux系统密码' },
        { name: '破解Windows密码', cmd: 'john --format=nt hashes.txt', description: '破解Windows NT哈希' },
        { name: '使用字典', cmd: 'john --wordlist=rockyou.txt hashes.txt', description: '使用字典文件进行爆破' },
        { name: '显示已破解', cmd: 'john --show hashes.txt', description: '显示已破解的密码' },
      ],
      officialSite: 'https://www.openwall.com/john/',
    },
    {
      id: 'wireshark',
      name: 'Wireshark',
      description: '最流行的网络协议分析工具，抓包分析利器',
      commands: [
        { name: '启动抓包', cmd: 'wireshark -> 选择网卡 -> Start', description: '开始捕获网络流量' },
        { name: '过滤HTTP', cmd: 'http.request or http.response', description: '只显示HTTP流量' },
        { name: '过滤TCP流', cmd: 'tcp.stream eq 0', description: '查看第一条TCP流的全部内容' },
        { name: '查找特定IP', cmd: 'ip.addr == 192.168.1.1', description: '只显示与特定IP相关的流量' },
        { name: '查找特定端口', cmd: 'tcp.port == 80 or tcp.port == 443', description: '只显示特定端口的流量' },
        { name: '导出HTTP对象', cmd: 'File -> Export Objects -> HTTP', description: '导出所有HTTP请求和响应' },
      ],
      officialSite: 'https://www.wireshark.org/',
    },
    {
      id: 'metasploit',
      name: 'Metasploit',
      description: '最强大的渗透测试框架，包含数千个漏洞利用模块',
      commands: [
        { name: '启动控制台', cmd: 'msfconsole', description: '启动Metasploit交互控制台' },
        { name: '搜索模块', cmd: 'search ms17_010', description: '搜索特定漏洞的利用模块' },
        { name: '使用模块', cmd: 'use exploit/windows/smb/ms17_010_eternalblue', description: '加载EternalBlue利用模块' },
        { name: '查看选项', cmd: 'show options', description: '查看模块需要配置的参数' },
        { name: '设置目标', cmd: 'set RHOSTS 192.168.1.100', description: '配置目标IP地址' },
        { name: '执行攻击', cmd: 'exploit', description: '执行漏洞利用攻击' },
      ],
      officialSite: 'https://www.metasploit.com/',
    },
    {
      id: 'openssl',
      name: 'OpenSSL',
      description: '强大的加密和SSL/TLS工具，证书管理和加密测试必备',
      commands: [
        { name: '生成RSA私钥', cmd: 'openssl genrsa -out private.key 2048', description: '生成2048位RSA私钥' },
        { name: '生成证书请求', cmd: 'openssl req -new -key private.key -out cert.csr', description: '生成CSR证书请求' },
        { name: '自签名证书', cmd: 'openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365', description: '生成自签名SSL证书' },
        { name: '检查证书', cmd: 'openssl x509 -in cert.pem -text -noout', description: '查看证书的详细信息' },
        { name: '测试SSL连接', cmd: 'openssl s_client -connect example.com:443', description: '测试HTTPS网站的SSL配置' },
        { name: '加密文件', cmd: 'openssl enc -aes-256-cbc -salt -in file.txt -out file.enc', description: '使用AES加密文件' },
        { name: '解密文件', cmd: 'openssl enc -d -aes-256-cbc -in file.enc -out file.txt', description: '解密AES加密的文件' },
        { name: '计算文件哈希', cmd: 'openssl dgst -sha256 file.txt', description: '计算文件的SHA-256哈希值' },
      ],
      officialSite: 'https://www.openssl.org/',
    },
  ];

  res.json({ tools });
});

module.exports = router;
