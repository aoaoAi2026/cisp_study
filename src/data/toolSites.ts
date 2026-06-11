export interface ToolSite {
  category: string;
  sites: {
    name: string;
    url: string;
    description: string;
    icon: string;
  }[];
}

export const toolSites: ToolSite[] = [
  {
    category: '学习网址',
    sites: [
      {
        name: 'FreeBuf',
        url: 'https://www.freebuf.com/',
        description: '国内领先的网络安全媒体与社区，专注于网络安全资讯和技术分享',
        icon: '🛡️'
      },
      {
        name: '安全客',
        url: 'https://www.anquanke.com/',
        description: '360旗下的安全新媒体平台，提供最新的安全资讯和技术文章',
        icon: '🔐'
      },
      {
        name: '先知社区',
        url: 'https://xz.aliyun.com/',
        description: '阿里云安全团队打造的安全社区，汇集行业顶尖技术分享',
        icon: '📖'
      },
      {
        name: '看雪论坛',
        url: 'https://bbs.pediy.com/',
        description: '中国知名的软件安全与逆向技术社区，历史悠久',
        icon: '❄️'
      },
      {
        name: 'i春秋',
        url: 'https://www.ichunqiu.com/',
        description: '网络安全在线教育平台，提供课程学习和实战演练',
        icon: '🎓'
      },
      {
        name: '嘶吼',
        url: 'https://www.4hou.com/',
        description: '专业的网络安全媒体，提供深度报道和技术文章',
        icon: '📢'
      },
      {
        name: 'HackerNews',
        url: 'https://news.ycombinator.com/',
        description: '国际知名技术社区，关注黑客文化和技术创业',
        icon: '📰'
      },
      {
        name: 'OWASP',
        url: 'https://owasp.org/',
        description: '开放Web应用安全项目，全球最具影响力的安全组织之一',
        icon: '🌐'
      }
    ]
  },
  {
    category: '免费靶场',
    sites: [
      {
        name: '攻防世界',
        url: 'https://adworld.xctf.org.cn/',
        description: '国内知名的CTF练习平台，提供多种难度和类型的题目',
        icon: '⚔️'
      },
      {
        name: 'BUUCTF',
        url: 'https://buuoj.cn/',
        description: '北京邮电大学CTF练习平台，题目丰富且更新频繁',
        icon: '🎯'
      },
      {
        name: 'PicoCTF',
        url: 'https://picoctf.org/',
        description: '国际著名的免费CTF练习平台，适合初学者入门',
        icon: '🏁'
      },
      {
        name: 'HackTheBox',
        url: 'https://www.hackthebox.com/',
        description: '在线虚拟机渗透测试平台，模拟真实企业环境',
        icon: '📦'
      },
      {
        name: 'TryHackMe',
        url: 'https://tryhackme.com/',
        description: '交互式网络安全学习平台， gamified学习体验',
        icon: '🎮'
      },
      {
        name: 'OverTheWire',
        url: 'https://overthewire.org/',
        description: '社区驱动的在线游戏，学习安全概念的绝佳选择',
        icon: '🌉'
      },
      {
        name: 'VulnHub',
        url: 'https://www.vulnhub.com/',
        description: '提供可下载的虚拟机镜像，用于练习渗透测试',
        icon: '🔧'
      },
      {
        name: 'root-me',
        url: 'https://www.root-me.org/',
        description: '国际免费CTF平台，涵盖各类安全挑战',
        icon: '🌱'
      }
    ]
  },
  {
    category: '等保测评',
    sites: [
      {
        name: '等保2.0官网',
        url: 'https://www.djbh.net/',
        description: '网络安全等级保护官方信息发布平台',
        icon: '📋'
      },
      {
        name: '国家网络安全等级保护网',
        url: 'http://www.gjbz.org.cn/',
        description: '提供等保测评相关政策、标准和技术信息',
        icon: '🏛️'
      },
      {
        name: 'CNITSEC',
        url: 'https://www.cnitsec.cn/',
        description: '中国信息安全测评中心官方网站',
        icon: '🔬'
      },
      {
        name: '等保测评知识库',
        url: 'https://www.dengbaozhinan.com/',
        description: '等保测评相关的专业知识库和技术指南',
        icon: '📚'
      }
    ]
  },
  {
    category: '渗透靶场',
    sites: [
      {
        name: 'OWASP Juice Shop',
        url: 'https://owasp.org/www-project-juice-shop/',
        description: '包含OWASP Top 10漏洞的现代Web应用程序靶场',
        icon: '🍹'
      },
      {
        name: 'DVWA',
        url: 'http://www.dvwa.co.uk/',
        description: 'Damn Vulnerable Web Application - 经典Web漏洞练习平台',
        icon: '🎯'
      },
      {
        name: 'bWAPP',
        url: 'http://www.itsecgames.com/',
        description: '含100+漏洞的Web应用，涵盖各类安全问题',
        icon: '🐝'
      },
      {
        name: 'WebGoat',
        url: 'https://owasp.org/www-project-webgoat/',
        description: 'OWASP官方的Web应用安全教育工具',
        icon: '🐐'
      },
      {
        name: 'Upload-Labs',
        url: 'https://github.com/c0ny1/upload-labs',
        description: '专注于文件上传漏洞的练习靶场',
        icon: '📤'
      },
      {
        name: 'SQLi-Labs',
        url: 'https://github.com/Audi-1/sqli-labs',
        description: 'SQL注入漏洞学习和练习平台',
        icon: '💉'
      },
      {
        name: 'XSS Game',
        url: 'https://xss-game.appspot.com/',
        description: 'Google官方的XSS学习游戏',
        icon: '🎮'
      },
      {
        name: 'Vulnhub',
        url: 'https://www.vulnhub.com/',
        description: '可下载的虚拟机靶场，模拟真实环境',
        icon: '💻'
      },
      {
        name: 'Pikachu',
        url: 'https://github.com/zhuifengshaonianhanlu/pikachu',
        description: '一个有趣的国产Web漏洞练习靶场',
        icon: '⚡'
      },
      {
        name: 'Bugku',
        url: 'https://ctf.bugku.com/',
        description: '国内知名的CTF平台，提供多种类型挑战',
        icon: '🐛'
      }
    ]
  },
  {
    category: '常用工具网站',
    sites: [
      {
        name: 'MD5在线解密',
        url: 'https://www.cmd5.com/',
        description: '免费MD5/SHA1等哈希在线查询和解密工具',
        icon: '🔓'
      },
      {
        name: 'Base64编解码',
        url: 'https://www.base64decode.org/',
        description: 'Base64编码解码在线工具',
        icon: '🔤'
      },
      {
        name: 'JSON格式化',
        url: 'https://www.json.cn/',
        description: 'JSON在线解析、格式化、校验工具',
        icon: '📄'
      },
      {
        name: '正则表达式测试',
        url: 'https://regex101.com/',
        description: '在线正则表达式测试和调试工具',
        icon: '🔍'
      },
      {
        name: 'IP查询',
        url: 'https://www.ip138.com/',
        description: 'IP地址归属地查询、域名查询等工具',
        icon: '🌍'
      },
      {
        name: 'URL编码解码',
        url: 'https://www.url-encode-decode.com/',
        description: 'URL编码解码在线工具',
        icon: '🔗'
      },
      {
        name: 'CyberChef',
        url: 'https://gchq.github.io/CyberChef/',
        description: '网络安全瑞士军刀，支持多种编码转换',
        icon: '🧰'
      },
      {
        name: 'Cryptii',
        url: 'https://cryptii.com/',
        description: '在线编码解码、加密解密工具',
        icon: '🔐'
      },
      {
        name: 'CrackStation',
        url: 'https://crackstation.net/',
        description: '在线密码哈希破解工具',
        icon: '🎰'
      },
      {
        name: 'SQL在线运行',
        url: 'https://www.runoob.com/sql/sql-tutorial.html',
        description: 'SQL语句在线学习和测试',
        icon: '🗃️'
      }
    ]
  },
  {
    category: '情报搜索引擎',
    sites: [
      {
        name: 'FoFa',
        url: 'https://fofa.info/',
        description: '网络空间资产搜索引擎，便于安全研究员发现资产',
        icon: '🔎'
      },
      {
        name: 'Shodan',
        url: 'https://www.shodan.io/',
        description: '互联网设备搜索引擎，发现暴露的服务',
        icon: '🌐'
      },
      {
        name: 'ZoomEye',
        url: 'https://www.zoomeye.org/',
        description: '网络空间搜索引擎，钟馗之眼',
        icon: '👁️'
      },
      {
        name: 'Censys',
        url: 'https://search.censys.io/',
        description: '互联网设备和网站证书搜索引擎',
        icon: '🔍'
      },
      {
        name: 'Hunter',
        url: 'https://hunter.qianxin.com/',
        description: '奇安信Hunter网络空间测绘系统',
        icon: '🏹'
      },
      {
        name: '360 Netlab',
        url: 'https://netlab.360.com/',
        description: '360网络安全实验室，提供威胁情报数据',
        icon: '🌐'
      },
      {
        name: 'DorkSearch',
        url: 'https://dorksearch.com/',
        description: 'Google Dork搜索引擎',
        icon: '🔦'
      }
    ]
  }
];

export default toolSites;
