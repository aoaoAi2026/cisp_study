export interface ToolSite {
  category: string;
  sites: {
    name: string;
    url: string;
    description: string;
    icon: string;
    features?: string[];
    usage?: string;
    tips?: string;
    installed?: boolean;  // 本地是否已安装
    installCmd?: string;  // 安装命令
    checkCmd?: string;    // 检测命令
  }[];
}

export const toolSitesData: ToolSite[] = [
  {
    category: '在线工具',
    sites: [
      {
        name: '🔧 在线工具箱（200+工具，首页）',
        url: '/online-tools',
        description: '200+在线工具一站式，纯前端，免登录，点击即用',
        icon: '🔧',
        features: ['编码解码', '哈希计算', '进制转换', '安全工具', '开发工具', '生成器', '文本处理', '颜色图像', '时间日期', '网络工具', '计算换算'],
      },
      {
        name: '📦 Base64 / Base32 / Base58 / Base62 / Base85 / MIME / UUEncode',
        url: '/online-tools',
        description: '7种Base类编解码，支持中文与二进制',
        icon: '📦',
        features: ['Base64编码/解码', 'Base32', 'Base58', 'Base62', 'Base85', 'MIME编码', 'UUEncode', 'Data-URL', 'Punycode', '支持中文', '一键复制'],
      },
      {
        name: '🔗 URL / Unicode / HTML / HEX / BIN 编解码',
        url: '/online-tools',
        description: '常用转义与十六/二进制互转',
        icon: '🔗',
        features: ['URL编码/解码', 'Unicode编码', 'HTML实体', 'HEX十六进制', 'BIN二进制', 'OCT八进制', 'ASCII码', 'Quoted-Printable', '全/半角'],
      },
      {
        name: '🔐 MD5 / SHA1 / SHA256 / SHA512 / SHA3 / CRC32 / BLAKE2b 哈希计算',
        url: '/online-tools',
        description: '15+种主流哈希算法，即时计算',
        icon: '🔐',
        features: ['MD5', 'SHA1', 'SHA256', 'SHA512', 'SHA384', 'SHA3-256', 'SHA3-512', 'CRC16', 'CRC32', 'Adler32', 'FNV-1a', 'Murmur3', 'XXHash', 'BLAKE2b', 'BLAKE3'],
      },
      {
        name: '🔀 进制转换 & 颜色格式（RGB/HEX/HSL/HSV）',
        url: '/online-tools',
        description: '多进制互转 + 颜色代码转换',
        icon: '🔀',
        features: ['十进制→二进制', '二进制→十进制', '十进制→十六进制', '十六进制→十进制', '十进制→八进制', '八进制→十进制', 'RGB↔HEX', 'RGB↔HSL', 'RGB↔HSV', '颜色代码', '颜色对比度', '颜色混合', '渐变色生成'],
      },
      {
        name: '📋 JWT解码 / HMAC签名 / PBKDF2 / Argon2 / Scrypt / CSRF Token',
        url: '/online-tools',
        description: 'JWT解析与签名生成密钥派生',
        icon: '📋',
        features: ['JWT Header', 'JWT Payload', 'JWT过期检查', 'HMAC-MD5', 'HMAC-SHA', 'PBKDF2演示', 'Argon2演示', 'Scrypt演示', 'CSRF Token', '随机签名'],
      },
      {
        name: '🔢 XOR / Vigenère / Atbash / 栅栏密码 / ROT13 / 凯撒 / 摩斯 / RSA',
        url: '/online-tools',
        description: '8+古典与现代加密算法',
        icon: '🔢',
        features: ['XOR加密/解密', 'Vigenère', 'Atbash', '栅栏密码', 'ROT13', '凯撒密码', '摩斯密码', 'RSA演示', '密码强度可视化', '弱密码检测', '密码字典'],
      },
      {
        name: '📄 JSON格式化 / 压缩 / 验证 / 排序 / 对比 / Schema / 合并',
        url: '/online-tools',
        description: 'JSON全功能处理，一键美化/压缩/对比',
        icon: '📄',
        features: ['JSON格式化', 'JSON压缩', 'JSON验证', 'JSON排序', 'JSON对比', 'JSON合并', 'JSON Schema生成', 'JSON数组去重', 'JSON→TypeScript接口', 'JSON路径查询', 'JSON表格', 'JSON筛选'],
      },
      {
        name: '📑 XML / YAML / TOML / CSV 格式化与互转',
        url: '/online-tools',
        description: '多格式数据文件处理',
        icon: '📑',
        features: ['XML格式化', 'XML压缩', 'YAML格式化', 'YAML↔JSON', 'TOML↔JSON', 'CSV↔JSON', 'XML↔JSON'],
      },
      {
        name: '🗄️ SQL / CSS / JS / HTML 代码美化压缩',
        url: '/online-tools',
        description: '开发代码美化与压缩',
        icon: '🗄️',
        features: ['SQL美化', 'SQL关键字大写', 'CSS格式化', 'CSS压缩', 'JS格式化', 'HTML美化', '代码缩进调整', '注释统计'],
      },
      {
        name: '🔑 密码生成器 / 批量密码 / 强度计 / 弱密码检测',
        url: '/online-tools',
        description: '密码生成与强度检查全功能',
        icon: '🔑',
        features: ['随机密码', '批量密码(100个)', '自定义字符集', '密码强度可视化', '弱密码检测', '密码字典生成', '大小写/数字/特殊字符'],
      },
      {
        name: '🆔 UUID / ULID / NanoID / GUID / MongoDB ObjectId / 雪花ID / Base62ID / Token',
        url: '/online-tools',
        description: '10+种ID生成器，批量输出',
        icon: '🆔',
        features: ['UUID v4', 'ULID', 'NanoID', 'GUID', 'MongoDB ObjectId', '雪花算法ID', 'Base62短ID', '随机Token', 'API Key', '批量生成(100个)'],
      },
      {
        name: '📊 文本处理（字数/去重/排序/大小写/反转/换行/拼音/繁简）',
        url: '/online-tools',
        description: '20+项文本处理工具',
        icon: '📊',
        features: ['高级字数统计', '字符/字节/词/行/段', '去重复行', '按行排序', '大小写转换', '文本反转', '首字母大写/标题化', '行号添加', '合并行', '换行控制', '去除空白', '提取数字/字母/汉字', '中文繁简转换', '拼音转换', 'Markdown↔HTML', 'ASCII艺术字', '文字对齐'],
      },
      {
        name: '🔍 正则表达式测试 / 生成 / URL参数解析 / Slug',
        url: '/online-tools',
        description: '正则表达式开发调试工具',
        icon: '🔍',
        features: ['正则匹配', '正则替换', '正则生成', '实时预览', 'URL参数解析', 'Slug生成', '驼峰/下划线命名'],
      },
      {
        name: '⏰ 时间戳 / 日期间隔 / 倒计时 / 时区转换 / 周数 / 年龄',
        url: '/online-tools',
        description: '时间日期10+项工具',
        icon: '⏰',
        features: ['时间戳→日期', '日期→时间戳', '当前Unix时间', '周数计算', '日期间隔', '年龄计算', '倒计时', '多时区转换', '农历公历', '日期格式化'],
      },
      {
        name: '🎨 颜色代码 / 调色板 / 对比度 / 渐变 / 反色 / 随机颜色',
        url: '/online-tools',
        description: '颜色设计8+项工具',
        icon: '🎨',
        features: ['HEX/RGB互转', '颜色代码生成', '颜色对比度', '颜色混合', '反色/补色', '调色板生成', 'CSS渐变', '随机颜色代码', '随机Emoji'],
      },
      {
        name: '📱 随机数据（手机号/身份证/邮箱/姓名/银行卡/IP/经纬度/日期）',
        url: '/online-tools',
        description: '测试用随机数据生成',
        icon: '📱',
        features: ['手机号生成', '身份证号生成', '随机邮箱', '随机中英文姓名', '随机银行卡号', '随机IPv4', '随机经纬度', '随机日期范围', '随机Emoji'],
      },
      {
        name: '🏠 房贷月供 / 个税计算 / BMI / 折扣百分比 / 数字格式化',
        url: '/online-tools',
        description: '生活计算工具',
        icon: '🏠',
        features: ['房贷月供', '等额本息', '总利息', '个人所得税', 'BMI指数', '折扣百分比', '数字格式化', '千分位'],
      },
      {
        name: '📐 单位换算（长度/重量/存储/时间/速度/温度）',
        url: '/online-tools',
        description: '多维度单位换算',
        icon: '📐',
        features: ['长度换算(米/厘米/英尺/英寸)', '重量换算(千克/克/磅/盎司/斤)', '存储单位(GB/MB/KB/TB)', '时间换算(天/时/分/秒/周/月/年)', '速度换算(km/h/m/s/mph/节)', '温度(℃/℉/K)'],
      },
      {
        name: '🌐 IP子网 / CIDR / User-Agent解析 / HTTP状态码 / MIME类型',
        url: '/online-tools',
        description: '网络工具5项',
        icon: '🌐',
        features: ['IP子网计算', 'CIDR地址范围', 'UA解析(浏览器/系统/设备)', 'HTTP状态码查询', 'MIME类型查询', '子网掩码'],
      },
      {
        name: '✨ ASCII艺术字 / 随机JSON数据 / 中文乱数文本 / 数学表达式计算',
        url: '/online-tools',
        description: '创意与测试数据生成',
        icon: '✨',
        features: ['ASCII Banner大字', 'ASCII Art', '随机JSON对象', '中文乱数文本生成', '列表/数组数据', '数学表达式求值'],
      },
      {
        name: '📐 驼峰命名 / Slug / 代码美化 / Gitignore模板 / 随机数据',
        url: '/online-tools',
        description: '开发辅助工具',
        icon: '📐',
        features: ['驼峰↔下划线命名', 'Slug URL生成', '代码美化缩进', '.gitignore模板', '数学表达式计算', '一键复制'],
      },
      {
        name: '🧪 图片Base64 / 二维码 / Data-URL',
        url: '/online-tools',
        description: '图像处理工具',
        icon: '🧪',
        features: ['图片→Base64', '二维码文本', 'Data-URL生成', 'MIME编码', 'UUEncode'],
      },
    ]
  },
  {
    category: '学习网址',
    sites: [
      {
        name: 'FreeBuf',
        url: 'https://www.freebuf.com/',
        description: '国内领先的网络安全媒体与社区，专注于网络安全资讯和技术分享',
        icon: '🛡️',
        features: ['安全资讯', '技术文章', '工具下载', '安全招聘'],
        usage: '浏览首页获取最新安全资讯，通过搜索查找技术文章，参与社区讨论交流学习心得。',
        tips: '建议订阅邮件推送，及时获取最新安全动态。技术文章质量较高，适合深度阅读学习。'
      },
      {
        name: '安全客',
        url: 'https://www.anquanke.com/',
        description: '360旗下的安全新媒体平台，提供最新的安全资讯和技术文章',
        icon: '🔐',
        features: ['安全资讯', '漏洞预警', '技术专栏', '安全培训'],
        usage: '关注"漏洞预警"栏目获取最新漏洞信息，阅读技术专栏学习安全知识。',
        tips: '网站的漏洞预警非常及时，建议设置浏览器书签方便快速查看。'
      },
      {
        name: '先知社区',
        url: 'https://xz.aliyun.com/',
        description: '阿里云安全团队打造的安全社区，汇集行业顶尖技术分享',
        icon: '📖',
        features: ['技术分享', '漏洞报告', 'CTF比赛', '安全招聘'],
        usage: '阅读技术文章学习渗透测试技巧，参与CTF比赛提升实战能力。',
        tips: '社区的漏洞分析文章非常专业，可以学习到很多实战经验和技巧。'
      },
      {
        name: '看雪论坛',
        url: 'https://bbs.pediy.com/',
        description: '中国知名的软件安全与逆向技术社区，历史悠久',
        icon: '❄️',
        features: ['逆向工程', '软件安全', '脱壳破解', '技术交流'],
        usage: '在论坛发帖交流逆向技术，下载学习资料，参与技术讨论。',
        tips: '论坛有很多高质量的逆向教程，适合想要深入学习软件安全的用户。'
      },
      {
        name: 'i春秋',
        url: 'https://www.ichunqiu.com/',
        description: '网络安全在线教育平台，提供课程学习和实战演练',
        icon: '🎓',
        features: ['在线课程', '实战靶场', '认证考试', '职业培训'],
        usage: '选择感兴趣的课程进行学习，在实战靶场进行练习，准备认证考试。',
        tips: '平台提供免费课程，可以先体验再决定是否购买付费课程。'
      },
      {
        name: '嘶吼',
        url: 'https://www.4hou.com/',
        description: '专业的网络安全媒体，提供深度报道和技术文章',
        icon: '📢',
        features: ['深度报道', '安全研究', '行业资讯', '会议活动'],
        usage: '阅读深度报道了解行业动态，关注会议活动获取行业交流机会。',
        tips: '嘶吼的深度报道质量很高，可以了解到很多行业内幕和趋势分析。'
      },
      {
        name: 'HackerNews',
        url: 'https://news.ycombinator.com/',
        description: '国际知名技术社区，关注黑客文化和技术创业',
        icon: '📰',
        features: ['技术新闻', '创业讨论', 'Ask HN', 'Show HN'],
        usage: '浏览首页获取最新技术新闻，参与讨论交流技术观点。',
        tips: '建议使用浏览器翻译插件阅读，虽然是英文但内容质量很高。'
      },
      {
        name: 'OWASP',
        url: 'https://owasp.org/',
        description: '开放Web应用安全项目，全球最具影响力的安全组织之一',
        icon: '🌐',
        features: ['OWASP Top 10', '安全指南', '工具项目', '社区活动'],
        usage: '学习OWASP Top 10了解Web安全最佳实践，使用OWASP工具进行安全测试。',
        tips: 'OWASP的文档是Web安全领域的权威资料，建议收藏以备查阅。'
      },
      {
        name: 'SecWiki',
        url: 'https://www.sec-wiki.com/',
        description: '安全技术知识库，汇集各类安全资源和工具导航',
        icon: '📚',
        features: ['安全知识库', '工具导航', '漏洞库', '技术文章'],
        usage: '使用搜索功能查找安全知识，浏览工具导航发现实用工具。',
        tips: '工具导航非常全面，可以发现很多实用的在线工具和资源网站。'
      },
      {
        name: 'BleepingComputer',
        url: 'https://www.bleepingcomputer.com/',
        description: '国际知名安全资讯和技术教程网站',
        icon: '💻',
        features: ['安全新闻', '恶意软件分析', '技术教程', '工具下载'],
        usage: '阅读恶意软件分析文章，学习安全技术，下载安全工具。',
        tips: '网站的恶意软件分析非常专业，可以学习到很多分析技巧。'
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
        description: '交互式网络安全学习平台，游戏化学习体验',
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
      },
      {
        name: 'PortSwigger Web Security Academy',
        url: 'https://portswigger.net/web-security',
        description: 'Burp Suite官方出品的免费Web安全学习平台，含大量实验',
        icon: '🏫'
      },
      {
        name: 'PentesterLab',
        url: 'https://pentesterlab.com/',
        description: 'Web渗透测试练习平台，提供从入门到高级的练习',
        icon: '🧪'
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
        icon: '📋',
        features: ['等保2.0政策解读', '等级保护标准下载', '测评机构查询', '等保咨询服务'],
        usage: '访问首页可获取最新等保政策和标准文件，点击"资料下载"获取等级保护相关文档，通过"测评机构"查询认证的测评机构。',
        tips: '建议关注政策法规栏目，及时了解等保相关法规更新。下载的标准文件建议保存备份，便于离线查阅。'
      },
      {
        name: '国家网络安全等级保护网',
        url: 'http://www.gjbz.org.cn/',
        description: '提供等保测评相关政策、标准和技术信息',
        icon: '🏛️',
        features: ['等保标准体系', '测评流程指南', '案例分析', '技术文章'],
        usage: '浏览"标准体系"了解等保相关国标和行业标准，通过"测评流程"了解定级、备案、测评的完整流程。',
        tips: '网站提供的案例分析非常有价值，可以学习其他单位的等保建设经验，避免重复踩坑。'
      },
      {
        name: 'CNITSEC',
        url: 'https://www.cnitsec.cn/',
        description: '中国信息安全测评中心官方网站',
        icon: '🔬',
        features: ['信息安全测评', '资质认证', '技术服务', '培训认证'],
        usage: '查询信息安全测评服务项目，了解CISP等认证考试信息，获取专业技术服务咨询。',
        tips: 'CISP认证考试报名和培训信息在"培训认证"栏目，建议定期关注考试时间安排。'
      },
      {
        name: '等保测评知识库',
        url: 'https://www.dengbaozhinan.com/',
        description: '等保测评相关的专业知识库和技术指南',
        icon: '📚',
        features: ['等保知识库', '测评模板下载', 'FAQ问答', '技术博客'],
        usage: '使用搜索功能查找等保相关知识，下载测评所需的模板文件，查看FAQ解答常见问题。',
        tips: '测评模板非常实用，可以直接参考使用，但需要根据实际情况进行调整。'
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
      },
      {
        name: 'Vulhub',
        url: 'https://vulhub.org/',
        description: '基于Docker-Compose的漏洞环境集合，一键部署各种漏洞环境',
        icon: '🐳'
      },
      {
        name: 'Pentester Academy',
        url: 'https://www.pentesteracademy.com/',
        description: '提供高级渗透测试实验环境，含AD攻击等企业级场景',
        icon: '🎓'
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
      },
      {
        name: 'SSL Labs',
        url: 'https://www.ssllabs.com/ssltest/',
        description: 'SSL/TLS服务器安全配置检测工具',
        icon: '🔒'
      },
      {
        name: 'Mozilla Observatory',
        url: 'https://observatory.mozilla.org/',
        description: '网站安全头部配置检测工具',
        icon: '🔭'
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
      },
      {
        name: 'GreyNoise',
        url: 'https://www.greynoise.io/',
        description: '区分恶意扫描和正常互联网背景噪音',
        icon: '📡'
      }
    ]
  },
  {
    category: '代码审计与开发安全',
    sites: [
      {
        name: 'SonarCloud',
        url: 'https://sonarcloud.io/',
        description: '云端代码质量和安全分析平台，支持多种语言',
        icon: '☁️'
      },
      {
        name: 'Snyk',
        url: 'https://snyk.io/',
        description: '开源组件安全漏洞扫描和修复平台',
        icon: '🛡️'
      },
      {
        name: 'GitHub Security Advisories',
        url: 'https://github.com/advisories',
        description: 'GitHub官方安全漏洞公告数据库',
        icon: '⚠️'
      },
      {
        name: 'NVD (国家漏洞数据库)',
        url: 'https://nvd.nist.gov/',
        description: '美国国家漏洞数据库，最权威的CVE信息源',
        icon: '📊'
      },
      {
        name: 'Exploit-DB',
        url: 'https://www.exploit-db.com/',
        description: '漏洞利用代码数据库，Offensive Security维护',
        icon: '💥'
      },
      {
        name: 'CVE Details',
        url: 'https://www.cvedetails.com/',
        description: 'CVE漏洞详情和统计查询平台',
        icon: '📈'
      }
    ]
  },
  {
    category: '威胁情报平台',
    sites: [
      {
        name: 'VirusTotal',
        url: 'https://www.virustotal.com/',
        description: '文件和URL多引擎扫描平台，必备威胁分析工具',
        icon: '🦠'
      },
      {
        name: 'AlienVault OTX',
        url: 'https://otx.alienvault.com/',
        description: '开源威胁情报交换平台，社区驱动的IOC共享',
        icon: '👽'
      },
      {
        name: 'IBM X-Force Exchange',
        url: 'https://exchange.xforce.ibmcloud.com/',
        description: 'IBM威胁情报交换平台',
        icon: '☁️'
      },
      {
        name: 'ThreatMiner',
        url: 'https://www.threatminer.org/',
        description: '免费威胁情报数据挖掘平台',
        icon: '⛏️'
      },
      {
        name: 'URLhaus',
        url: 'https://urlhaus.abuse.ch/',
        description: '恶意URL分发站点追踪数据库',
        icon: '🔗'
      },
      {
        name: 'MalwareBazaar',
        url: 'https://bazaar.abuse.ch/',
        description: '恶意软件样本共享数据库',
        icon: '🧬'
      },
      {
        name: 'Pulsedive',
        url: 'https://pulsedive.com/',
        description: '免费威胁情报和IOC查询平台',
        icon: '💓'
      }
    ]
  },
  {
    category: '在线沙箱与分析',
    sites: [
      {
        name: 'Any.Run',
        url: 'https://app.any.run/',
        description: '交互式恶意软件在线沙箱分析平台',
        icon: '🏃'
      },
      {
        name: 'Hybrid Analysis',
        url: 'https://www.hybrid-analysis.com/',
        description: '免费恶意软件分析服务，CrowdStrike旗下',
        icon: '🔬'
      },
      {
        name: 'Joe Sandbox',
        url: 'https://www.joesandbox.com/',
        description: '深度恶意软件行为分析平台',
        icon: '📦'
      },
      {
        name: 'URLScan.io',
        url: 'https://urlscan.io/',
        description: 'URL扫描和分析服务，查看网站截图和详情',
        icon: '📸'
      },
      {
        name: 'Browserling',
        url: 'https://www.browserling.com/',
        description: '在线跨浏览器测试，安全分析常用',
        icon: '🌐'
      }
    ]
  },
  {
    category: '本地安全工具',
    sites: [
      {
        name: 'Nmap - 网络扫描神器',
        url: 'https://nmap.org/download.html',
        description: '最强大的网络发现和安全审计工具，支持端口扫描、服务识别、漏洞检测',
        icon: '🗺️',
        features: ['端口扫描', '服务识别', '操作系统检测', '脚本扩展'],
        usage: 'nmap -sV -sC target_ip 进行服务和脚本扫描，nmap -A 全面扫描',
        tips: '配合Nmap脚本引擎(NSE)可以检测大量漏洞，建议学习常用脚本用法',
        installed: false,
        installCmd: '下载地址: https://nmap.org/download.html#windows',
        checkCmd: 'nmap --version'
      },
      {
        name: 'Burp Suite - Web渗透利器',
        url: 'https://portswigger.net/burp/communitydownload',
        description: 'Web应用安全测试行业标准工具，支持代理、扫描、渗透测试',
        icon: '🧰',
        features: ['代理拦截', '漏洞扫描', '渗透测试', '插件扩展'],
        usage: '配置浏览器代理，拦截HTTP请求，使用Scanner模块自动扫描漏洞',
        tips: '专业版功能更强大，社区版足够入门学习，建议掌握核心模块使用',
        installed: false,
        installCmd: '下载地址: https://portswigger.net/burp/communitydownload',
        checkCmd: '检查桌面是否有Burp Suite图标'
      },
      {
        name: 'Wireshark - 网络协议分析',
        url: 'https://www.wireshark.org/download.html',
        description: '世界最流行的网络协议分析器，深入分析网络流量',
        icon: '🦈',
        features: ['流量捕获', '协议分析', '数据包过滤', '流量统计'],
        usage: '捕获网络流量，使用显示过滤器(filter)分析特定协议',
        tips: '掌握常用过滤表达式：tcp.port==80, http, dns等，是网络分析必备技能',
        installed: false,
        installCmd: '下载地址: https://www.wireshark.org/download.html',
        checkCmd: 'wireshark --version'
      },
      {
        name: 'Metasploit - 渗透测试框架',
        url: 'https://www.metasploit.com/',
        description: '最强大的渗透测试框架，包含大量漏洞利用模块',
        icon: '💣',
        features: ['漏洞利用', 'Payload生成', '后渗透模块', '模块开发'],
        usage: 'msfconsole启动，search搜索漏洞，use选择模块，set配置参数，exploit执行',
        tips: 'MSF是渗透测试核心工具，建议系统学习模块使用和Payload定制',
        installed: false,
        installCmd: 'Windows版下载: https://github.com/rapid7/metasploit-framework/releases',
        checkCmd: 'msfconsole --version'
      },
      {
        name: 'IDA Pro - 逆向工程神器',
        url: 'https://hex-rays.com/ida-free/',
        description: '最专业的反汇编和逆向分析工具，支持多平台多架构',
        icon: '🔧',
        features: ['反汇编', '调试分析', '插件扩展', '脚本支持'],
        usage: '加载目标文件，F5反编译查看伪代码，分析程序逻辑',
        tips: 'IDA是逆向神器，免费版IDA Free功能有限但足够入门',
        installed: false,
        installCmd: 'IDA Free下载: https://hex-rays.com/ida-free/',
        checkCmd: '检查桌面是否有IDA图标'
      },
      {
        name: 'Ghidra - NSA逆向工具',
        url: 'https://ghidra-sre.org/',
        description: 'NSA开源的逆向工程工具套件，免费且功能强大',
        icon: '🐲',
        features: ['反汇编', '反编译', '脚本开发', '团队协作'],
        usage: '创建项目导入目标文件，使用CodeBrowser分析代码',
        tips: 'Ghidra免费开源，功能媲美IDA，是逆向学习首选',
        installed: false,
        installCmd: '下载地址: https://ghidra-sre.org/',
        checkCmd: '检查是否安装了Ghidra'
      },
      {
        name: 'Hashcat - 密码破解',
        url: 'https://hashcat.net/hashcat/',
        description: 'GPU加速的密码破解工具，支持数百种哈希算法',
        icon: '🔓',
        features: ['GPU加速', '多算法支持', '字典攻击', '规则引擎'],
        usage: 'hashcat -m 0 -a 0 hash.txt wordlist.txt 破解MD5哈希',
        tips: '配合高质量字典和规则可以大幅提高破解效率',
        installed: false,
        installCmd: '下载地址: https://hashcat.net/hashcat/',
        checkCmd: 'hashcat --version'
      },
      {
        name: 'John the Ripper',
        url: 'https://www.openwall.com/john/',
        description: '经典密码破解工具，支持多种哈希和加密格式',
        icon: '🗡️',
        features: ['密码破解', '多格式支持', '自动识别', '规则攻击'],
        usage: 'john --wordlist=password.txt hashes.txt 破解密码哈希',
        tips: 'JtR自动识别哈希类型，适合快速破解测试',
        installed: false,
        installCmd: 'Windows版: https://www.openwall.com/john/',
        checkCmd: 'john --version'
      },
      {
        name: 'Sqlmap - SQL注入自动化',
        url: 'https://github.com/sqlmapproject/sqlmap',
        description: '自动化SQL注入检测和利用工具，支持多种数据库',
        icon: '💉',
        features: ['自动检测', '数据库枚举', '数据提取', '提权利用'],
        usage: 'sqlmap -u "url?id=1" --dbs 自动检测并枚举数据库',
        tips: 'sqlmap功能强大，建议掌握常用参数和利用技巧',
        installed: false,
        installCmd: 'pip install sqlmap 或 git clone https://github.com/sqlmapproject/sqlmap',
        checkCmd: 'python -m sqlmap --version'
      },
      {
        name: 'Hydra - 暴力破解工具',
        url: 'https://github.com/vanhauser-thc/thc-hydra',
        description: '快速网络登录暴力破解工具，支持多种协议',
        icon: '🐍',
        features: ['多协议支持', '并行破解', '字典攻击', '灵活配置'],
        usage: 'hydra -l user -P pass.txt ssh://target 暴力破解SSH',
        tips: '配合高质量字典，可以快速测试弱密码',
        installed: false,
        installCmd: 'Windows版: https://github.com/vanhauser-thc/thc-hydra',
        checkCmd: 'hydra --version'
      },
      {
        name: 'Aircrack-ng - WiFi安全测试',
        url: 'https://www.aircrack-ng.org/',
        description: 'WiFi网络安全评估和密码破解工具套件',
        icon: '📡',
        features: ['流量捕获', '密码破解', 'WiFi攻击', '安全评估'],
        usage: 'airmon-ng启用监听模式，airodump-ng捕获流量，aircrack-ng破解密码',
        tips: 'WiFi安全测试必备工具，注意合法使用',
        installed: false,
        installCmd: '下载地址: https://www.aircrack-ng.org/',
        checkCmd: 'aircrack-ng --version'
      },
      {
        name: 'Nuclei - 模板化漏洞扫描',
        url: 'https://github.com/projectdiscovery/nuclei',
        description: '基于模板的快速漏洞扫描器，社区模板丰富',
        icon: '⚡',
        features: ['模板扫描', '快速检测', '自定义规则', '批量扫描'],
        usage: 'nuclei -u target.com -t templates/ 使用模板扫描目标',
        tips: '模板社区活跃，新漏洞模板更新快，适合批量资产扫描',
        installed: false,
        installCmd: 'go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest',
        checkCmd: 'nuclei --version'
      },
      {
        name: 'Frida - 动态插桩工具',
        url: 'https://frida.re/',
        description: '动态插桩框架，支持多平台Hook和分析',
        icon: '💉',
        features: ['动态Hook', '实时分析', '脚本编写', '多平台支持'],
        usage: 'frida -U -f com.app -l script.js Hook移动应用',
        tips: 'Frida是移动安全和逆向的神器，建议深入学习',
        installed: false,
        installCmd: 'pip install frida-tools',
        checkCmd: 'frida --version'
      },
      {
        name: 'Gobuster - 目录爆破',
        url: 'https://github.com/OJ/gobuster',
        description: '快速目录和子域名暴力破解工具',
        icon: '📂',
        features: ['目录扫描', '子域名发现', '快速高效', '多模式支持'],
        usage: 'gobuster dir -u url -w wordlist.txt 扫描目录',
        tips: '配合高质量字典可以快速发现隐藏路径',
        installed: false,
        installCmd: 'go install github.com/OJ/gobuster/v3@latest',
        checkCmd: 'gobuster --version'
      },
      {
        name: 'Subfinder - 子域名发现',
        url: 'https://github.com/projectdiscovery/subfinder',
        description: '快速被动子域名发现工具，多源聚合',
        icon: '🌐',
        features: ['被动发现', '多源聚合', '快速扫描', 'API集成'],
        usage: 'subfinder -d domain.com -o results.txt 发现子域名',
        tips: 'ProjectDiscovery系列工具质量都很高',
        installed: false,
        installCmd: 'go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest',
        checkCmd: 'subfinder --version'
      }
    ]
  },
  {
    category: '安全工具下载',
    sites: [
      {
        name: 'Kali Linux',
        url: 'https://www.kali.org/',
        description: '最流行的渗透测试Linux发行版',
        icon: '🐉'
      },
      {
        name: 'Parrot OS',
        url: 'https://parrotsec.org/',
        description: '安全导向的Linux发行版，轻量级替代Kali',
        icon: '🦜'
      },
      {
        name: 'Nmap',
        url: 'https://nmap.org/',
        description: '网络发现和安全审计工具',
        icon: '🗺️'
      },
      {
        name: 'Wireshark',
        url: 'https://www.wireshark.org/',
        description: '世界最流行的网络协议分析器',
        icon: '🦈'
      },
      {
        name: 'Burp Suite',
        url: 'https://portswigger.net/burp',
        description: 'Web应用安全测试的行业标准工具',
        icon: '🧰'
      },
      {
        name: 'Metasploit',
        url: 'https://www.metasploit.com/',
        description: '最强大的渗透测试框架',
        icon: '💣'
      },
      {
        name: 'Ghidra',
        url: 'https://ghidra-sre.org/',
        description: 'NSA开源的逆向工程工具套件',
        icon: '🐲'
      },
      {
        name: 'IDA Free',
        url: 'https://hex-rays.com/ida-free/',
        description: '著名反汇编工具的免费版本',
        icon: '🔧'
      }
    ]
  },
  {
    category: 'AI安全项目',
    sites: [
      {
        name: 'GPTSecurity',
        url: 'https://github.com/mooyoul/GPTSecurity',
        description: 'AI安全领域开源项目合集，涵盖LLM安全、AI攻防等',
        icon: '🤖',
        features: ['LLM安全研究', 'AI攻防工具', '安全Prompt', '模型安全'],
        usage: '浏览项目列表了解AI安全研究方向，克隆项目进行本地实验。',
        tips: 'AI安全是新兴领域，建议关注项目更新，学习最新的AI攻防技术。'
      },
      {
        name: 'LLM Security',
        url: 'https://github.com/llm-security/llm-security',
        description: '大语言模型安全研究项目，包含Prompt注入等攻击技术',
        icon: '🧠',
        features: ['Prompt注入', '模型越狱', '安全评估', '防御策略'],
        usage: '学习LLM安全攻击技术，测试模型安全性，开发防御方案。',
        tips: 'Prompt注入是当前AI安全的热点，建议深入学习相关技术。'
      },
      {
        name: 'AI-Security-Learning',
        url: 'https://github.com/0xAX/AI-Security-Learning',
        description: 'AI安全学习资源汇总，包含论文、工具和教程',
        icon: '📚',
        features: ['学习资源', '论文合集', '工具推荐', '教程指南'],
        usage: '按目录结构学习AI安全知识，阅读论文了解前沿研究。',
        tips: '建议从基础开始学习，循序渐进掌握AI安全知识体系。'
      },
      {
        name: 'PromptInject',
        url: 'https://github.com/agencyenterprise/PromptInject',
        description: 'Prompt注入攻击框架，用于测试LLM应用安全性',
        icon: '💉',
        features: ['注入攻击', '安全测试', '漏洞检测', '防御评估'],
        usage: '使用框架测试LLM应用的Prompt注入漏洞，评估防御效果。',
        tips: '测试时注意合规，不要对生产环境进行未授权测试。'
      },
      {
        name: 'Garak (LLM Probe)',
        url: 'https://github.com/NVIDIA/garak',
        description: 'NVIDIA开源的LLM安全探测工具，检测模型漏洞',
        icon: '🔍',
        features: ['模型探测', '漏洞扫描', '安全评估', '报告生成'],
        usage: '运行探测工具扫描LLM模型，生成安全评估报告。',
        tips: 'NVIDIA出品，质量可靠，适合企业级LLM安全评估。'
      },
      {
        name: 'AI Red Team',
        url: 'https://github.com/anthropics/anthropic-cookbook',
        description: 'Anthropic官方AI安全红队测试指南和工具',
        icon: '🔴',
        features: ['红队测试', '安全评估', '攻击模拟', '防御建议'],
        usage: '学习Anthropic的AI安全测试方法论，应用于实际项目。',
        tips: 'Anthropic是Claude的开发者，其安全实践值得学习。'
      },
      {
        name: 'AI-Sec-Tools',
        url: 'https://github.com/OWASP/owasp-ai-security',
        description: 'OWASP AI安全项目，提供AI应用安全指南',
        icon: '🌐',
        features: ['安全指南', '最佳实践', '风险评估', '合规建议'],
        usage: '参考OWASP AI安全指南进行AI应用安全开发。',
        tips: 'OWASP出品，权威可靠，建议作为AI安全开发的标准参考。'
      },
      {
        name: 'DeepExploit',
        url: 'https://github.com/13o-bbr-bbq/machine_learning_security',
        description: '基于机器学习的渗透测试工具，智能漏洞挖掘',
        icon: '🎯',
        features: ['智能渗透', '漏洞挖掘', 'ML驱动', '自动化测试'],
        usage: '使用ML模型辅助渗透测试，提高漏洞发现效率。',
        tips: '结合传统渗透测试方法，AI辅助可以大幅提高效率。'
      },
      {
        name: 'AI-Malware-Detection',
        url: 'https://github.com/AI-Malware-Detection/AI-Malware-Detection',
        description: '基于AI的恶意软件检测项目，包含多种模型',
        icon: '🦠',
        features: ['恶意检测', 'AI模型', '特征提取', '实时分析'],
        usage: '部署AI模型进行恶意软件检测，提升安全防护能力。',
        tips: 'AI检测可以作为传统检测的补充，提高检出率。'
      },
      {
        name: 'SecBERT',
        url: 'https://github.com/epicosy/SecBERT',
        description: '安全领域专用BERT模型，用于安全文本分析',
        icon: '📝',
        features: ['安全NLP', '文本分析', '威胁识别', '日志解析'],
        usage: '使用SecBERT进行安全日志分析、威胁情报处理。',
        tips: '专用模型比通用模型在安全领域表现更好。'
      }
    ]
  },
  {
    category: 'GitHub安全项目',
    sites: [
      {
        name: 'Awesome Hacking',
        url: 'https://github.com/Hack-with-Github/Awesome-Hacking',
        description: 'GitHub安全项目精选合集，涵盖各类安全工具',
        icon: '⭐',
        features: ['工具合集', '分类导航', '开源推荐', '持续更新'],
        usage: '浏览分类找到需要的安全工具，克隆项目进行使用。',
        tips: '这是最全面的安全工具合集之一，建议收藏定期查看更新。'
      },
      {
        name: 'Awesome Security',
        url: 'https://github.com/sbilly/awesome-security',
        description: '安全资源大全，包含工具、书籍、教程等',
        icon: '🛡️',
        features: ['资源大全', '工具推荐', '学习资料', '社区导航'],
        usage: '按分类查找安全资源，获取学习资料和工具。',
        tips: '资源非常全面，适合作为安全学习的起点。'
      },
      {
        name: 'Penetration Testing',
        url: 'https://github.com/enaqx/awesome-pentest',
        description: '渗透测试工具和资源大全',
        icon: '🎯',
        features: ['渗透工具', '测试框架', '攻击技术', '靶场推荐'],
        usage: '查找渗透测试工具，学习攻击技术。',
        tips: '渗透测试资源丰富，适合专业渗透测试人员。'
      },
      {
        name: 'CTF Tools',
        url: 'https://github.com/zardus/ctf-tools',
        description: 'CTF比赛常用工具集合，一键安装',
        icon: '⚔️',
        features: ['CTF工具', '一键安装', '分类整理', '持续维护'],
        usage: '克隆项目后一键安装CTF所需工具。',
        tips: 'CTF新手必备，可以快速搭建比赛环境。'
      },
      {
        name: 'SecLists',
        url: 'https://github.com/danielmiessler/SecLists',
        description: '安全测试常用字典和列表集合',
        icon: '📋',
        features: ['密码字典', '用户名列表', 'Payload集合', 'Fuzz列表'],
        usage: '使用字典进行密码破解、用户名枚举、Fuzz测试。',
        tips: '字典质量很高，是渗透测试必备资源。'
      },
      {
        name: 'PayloadsAllTheThings',
        url: 'https://github.com/swisskyrepo/PayloadsAllTheThings',
        description: '各类漏洞Payload集合，渗透测试必备',
        icon: '💥',
        features: ['Payload集合', '漏洞利用', '绕过技术', '攻击示例'],
        usage: '查找特定漏洞的Payload，学习攻击技术。',
        tips: 'Payload非常全面，覆盖几乎所有常见漏洞类型。'
      },
      {
        name: 'HackTools',
        url: 'https://github.com/LasCC/Hack-Tools',
        description: '浏览器扩展版渗透测试工具集',
        icon: '🔧',
        features: ['浏览器扩展', '快速访问', '工具集成', '便携使用'],
        usage: '安装浏览器扩展，快速访问常用渗透工具。',
        tips: '浏览器扩展形式，方便随时使用。'
      },
      {
        name: 'AutoRecon',
        url: 'https://github.com/Tib3rius/AutoRecon',
        description: '自动化网络侦察工具，多线程扫描',
        icon: '🔍',
        features: ['自动侦察', '多线程', '服务识别', '报告生成'],
        usage: '运行工具自动扫描目标，生成侦察报告。',
        tips: '自动化程度高，适合大规模网络侦察。'
      },
      {
        name: 'Nuclei',
        url: 'https://github.com/projectdiscovery/nuclei',
        description: '基于模板的快速漏洞扫描器',
        icon: '⚡',
        features: ['模板扫描', '快速检测', '自定义规则', '批量扫描'],
        usage: '使用模板快速扫描目标漏洞，自定义检测规则。',
        tips: '模板社区活跃，新漏洞模板更新很快。'
      },
      {
        name: 'Subfinder',
        url: 'https://github.com/projectdiscovery/subfinder',
        description: '快速子域名发现工具',
        icon: '🌐',
        features: ['子域名发现', '多源聚合', '快速扫描', '被动侦察'],
        usage: '运行工具发现目标子域名，扩大攻击面。',
        tips: 'ProjectDiscovery系列工具质量都很高。'
      },
      {
        name: 'Assetnote Wordlists',
        url: 'https://github.com/assetnote/wordlists',
        description: '高质量安全测试字典集合',
        icon: '📝',
        features: ['高质量字典', '持续更新', '分类整理', '实战验证'],
        usage: '使用字典进行目录扫描、参数Fuzz等。',
        tips: '字典来自实战经验，质量很高。'
      }
    ]
  },
  {
    category: '漏洞情报平台',
    sites: [
      {
        name: 'CNNVD',
        url: 'http://www.cnnvd.org.cn/',
        description: '中国国家信息安全漏洞库',
        icon: '🇨🇳',
        features: ['国家漏洞库', '漏洞公告', '风险预警', '标准规范'],
        usage: '查询国内漏洞信息，获取风险预警。',
        tips: '国内最权威的漏洞信息来源，建议定期关注。'
      },
      {
        name: 'CNVD',
        url: 'https://www.cnvd.org.cn/',
        description: '国家计算机网络入侵防范中心漏洞库',
        icon: '🏛️',
        features: ['漏洞通报', '事件预警', '技术支持', '协调处置'],
        usage: '查看漏洞通报，了解最新安全事件。',
        tips: 'CNVD通报及时，是国内重要的漏洞信息来源。'
      },
      {
        name: 'Seebug',
        url: 'https://www.seebug.org/',
        description: '知道创宇漏洞平台，提供漏洞详情和PoC',
        icon: '🐛',
        features: ['漏洞详情', 'PoC发布', '漏洞评级', '影响分析'],
        usage: '查询漏洞详情，获取PoC进行验证。',
        tips: '知道创宇的漏洞分析质量很高。'
      },
      {
        name: 'Vulners',
        url: 'https://vulners.com/',
        description: '漏洞数据库和搜索引擎',
        icon: '🔎',
        features: ['漏洞搜索', '数据库', 'API接口', '订阅服务'],
        usage: '搜索漏洞信息，订阅漏洞更新。',
        tips: '搜索功能强大，可以快速找到相关漏洞。'
      },
      {
        name: 'SecurityFocus',
        url: 'https://www.securityfocus.com/',
        description: 'Bugtraq漏洞邮件列表存档',
        icon: '📧',
        features: ['漏洞存档', '邮件列表', '历史漏洞', '讨论记录'],
        usage: '查阅历史漏洞讨论，了解漏洞发展。',
        tips: '历史悠久，是经典漏洞信息的来源。'
      },
      {
        name: 'ZeroDay Initiative',
        url: 'https://www.zerodayinitiative.com/',
        description: 'ZDI零日漏洞研究平台',
        icon: '⚡',
        features: ['零日漏洞', '漏洞收购', '技术研究', '漏洞披露'],
        usage: '了解零日漏洞信息，学习漏洞研究。',
        tips: 'ZDI是知名的漏洞收购平台，披露的漏洞质量很高。'
      },
      {
        name: 'Intrinio Security',
        url: 'https://security.intrinio.com/',
        description: '企业级漏洞情报服务',
        icon: '🏢',
        features: ['企业情报', '漏洞追踪', '风险评估', 'API服务'],
        usage: '订阅企业漏洞情报，进行风险评估。',
        tips: '适合企业用户，提供专业的漏洞情报服务。'
      }
    ]
  },
  {
    category: '安全认证培训',
    sites: [
      {
        name: 'ISC2',
        url: 'https://www.isc2.org/',
        description: '国际信息系统安全认证联盟，CISSP认证机构',
        icon: '🎓',
        features: ['CISSP认证', 'CCSP认证', '培训课程', '会员服务'],
        usage: '了解CISSP等认证考试信息，报名培训。',
        tips: 'CISSP是安全领域最权威的认证之一。'
      },
      {
        name: 'CompTIA Security+',
        url: 'https://www.comptia.org/certifications/security',
        description: 'CompTIA Security+认证，入门级安全认证',
        icon: '📜',
        features: ['Security+认证', '入门认证', '考试指南', '学习资源'],
        usage: '准备Security+考试，获取入门认证。',
        tips: '适合安全入门者，是国际认可的入门认证。'
      },
      {
        name: ' Offensive Security',
        url: 'https://www.offensive-security.com/',
        description: 'OSCP等渗透测试认证机构',
        icon: '⚔️',
        features: ['OSCP认证', 'OSCE认证', '实战考试', '培训课程'],
        usage: '准备OSCP考试，获取渗透测试认证。',
        tips: 'OSCP是最受认可的渗透测试认证，考试难度较大。'
      },
      {
        name: 'EC-Council',
        url: 'https://www.eccouncil.org/',
        description: 'CEH认证机构，道德黑客认证',
        icon: '👨‍💻',
        features: ['CEH认证', 'CHFI认证', '培训课程', '认证考试'],
        usage: '准备CEH考试，获取道德黑客认证。',
        tips: 'CEH是入门级渗透测试认证，适合初学者。'
      },
      {
        name: 'SANS Institute',
        url: 'https://www.sans.org/',
        description: 'SANS安全培训和GIAC认证',
        icon: '📚',
        features: ['专业培训', 'GIAC认证', '安全课程', '研究资源'],
        usage: '参加SANS培训，准备GIAC认证。',
        tips: 'SANS培训质量很高，是业界顶级安全培训机构。'
      },
      {
        name: 'ISACA',
        url: 'https://www.isaca.org/',
        description: 'CISA/CISM等审计和管理认证机构',
        icon: '📊',
        features: ['CISA认证', 'CISM认证', '审计管理', '培训资源'],
        usage: '准备CISA/CISM考试，获取审计管理认证。',
        tips: '适合从事安全审计和管理的人员。'
      }
    ]
  },
  {
    category: '安全会议活动',
    sites: [
      {
        name: 'Black Hat',
        url: 'https://www.blackhat.com/',
        description: '全球顶级安全技术会议',
        icon: '🎩',
        features: ['技术会议', '培训课程', '工具发布', '研究展示'],
        usage: '关注会议日程，观看演讲视频，学习最新技术。',
        tips: 'Black Hat是全球最顶级的安全会议，演讲质量很高。'
      },
      {
        name: 'DEF CON',
        url: 'https://defcon.org/',
        description: '全球最大黑客大会',
        icon: '🤖',
        features: ['黑客大会', 'CTF比赛', '技术讲座', '社区活动'],
        usage: '参加大会活动，观看演讲，参与CTF。',
        tips: 'DEF CON氛围轻松，是黑客文化的代表。'
      },
      {
        name: 'RSA Conference',
        url: 'https://www.rsaconference.com/',
        description: 'RSA安全大会，企业安全焦点',
        icon: '🔐',
        features: ['企业安全', '行业峰会', '产品展示', '专家演讲'],
        usage: '了解企业安全趋势，观看演讲视频。',
        tips: 'RSA偏向企业安全，适合安全管理人员。'
      },
      {
        name: 'CanSecWest',
        url: 'https://cansecwest.com/',
        description: '加拿大安全技术会议',
        icon: '🍁',
        features: ['技术会议', 'Pwn2Own', '漏洞研究', '黑客竞赛'],
        usage: '关注Pwn2Own比赛，观看技术演讲。',
        tips: 'Pwn2Own是著名的漏洞利用比赛。'
      },
      {
        name: 'HITB',
        url: 'https://conference.hitb.org/',
        description: 'Hack In The Box安全会议',
        icon: '📦',
        features: ['技术会议', '黑客竞赛', '培训课程', '亚洲举办'],
        usage: '参加亚洲地区的安全会议活动。',
        tips: 'HITB在亚洲影响力很大，适合亚洲安全从业者。'
      },
      {
        name: '安全客沙龙',
        url: 'https://www.anquanke.com/activity',
        description: '安全客线下技术沙龙活动',
        icon: '🎤',
        features: ['线下沙龙', '技术分享', '行业交流', '免费参与'],
        usage: '报名参加线下沙龙，进行技术交流。',
        tips: '免费活动，适合国内安全从业者参与。'
      }
    ]
  },
  {
    category: '安全博客资源',
    sites: [
      {
        name: 'Project Zero Blog',
        url: 'https://googleprojectzero.blogspot.com/',
        description: 'Google Project Zero研究博客',
        icon: '🔍',
        features: ['漏洞研究', '深度分析', '零日发现', '技术细节'],
        usage: '阅读漏洞研究文章，学习深度分析技术。',
        tips: 'Project Zero的研究质量极高，是学习漏洞研究的最佳资源。'
      },
      {
        name: ' Krebs on Security',
        url: 'https://krebsonsecurity.com/',
        description: 'Brian Krebs安全新闻博客',
        icon: '📰',
        features: ['安全新闻', '深度调查', '犯罪追踪', '行业爆料'],
        usage: '阅读安全新闻，了解行业动态。',
        tips: 'Krebs的调查报道非常有深度，经常揭露重大安全事件。'
      },
      {
        name: 'Schneier on Security',
        url: 'https://www.schneier.com/',
        description: 'Bruce Schneier安全专家博客',
        icon: '🎓',
        features: ['安全思考', '政策分析', '加密研究', '学术观点'],
        usage: '阅读安全专家观点，了解安全哲学。',
        tips: 'Schneier是安全领域的权威学者，观点很有深度。'
      },
      {
        name: 'The Hacker News',
        url: 'https://thehackernews.com/',
        description: '黑客新闻资讯网站',
        icon: '📰',
        features: ['安全资讯', '漏洞新闻', '技术文章', '每日更新'],
        usage: '获取最新安全新闻，了解漏洞动态。',
        tips: '新闻更新及时，适合每日浏览。'
      },
      {
        name: 'Dark Reading',
        url: 'https://www.darkreading.com/',
        description: '企业安全资讯和分析',
        icon: '🌙',
        features: ['企业安全', '威胁分析', '最佳实践', '产品评测'],
        usage: '了解企业安全趋势，学习最佳实践。',
        tips: '偏向企业安全，适合安全管理人员。'
      },
      {
        name: 'Troy Hunt Blog',
        url: 'https://www.troyhunt.com/',
        description: 'Troy Hunt安全专家博客',
        icon: '👨‍💻',
        features: ['安全教程', 'Have I Been Pwned', 'API安全', '实战经验'],
        usage: '学习安全实践，使用Have I Been Pwned查询。',
        tips: 'Troy的教程很实用，适合初学者。'
      }
    ]
  },
  {
    category: '逆向工程资源',
    sites: [
      {
        name: 'OpenRCE',
        url: 'https://www.openrce.org/',
        description: '逆向代码工程资源站',
        icon: '🔧',
        features: ['逆向资源', '技术文章', '工具推荐', '社区讨论'],
        usage: '学习逆向工程技术，获取工具资源。',
        tips: '经典逆向资源站，适合深入学习逆向。'
      },
      {
        name: 'Reversing.IDA',
        url: 'https://github.com/REhints/Publications',
        description: 'IDA Pro逆向教程和技巧',
        icon: '📖',
        features: ['IDA教程', '逆向技巧', '脚本开发', '插件推荐'],
        usage: '学习IDA Pro使用技巧，提高逆向效率。',
        tips: 'IDA是逆向神器，掌握技巧很重要。'
      },
      {
        name: 'Beginners.RE',
        url: 'https://www.beginners.re/',
        description: '逆向工程入门教程',
        icon: '🚀',
        features: ['入门教程', '实例讲解', '工具介绍', '循序渐进'],
        usage: '从零开始学习逆向工程。',
        tips: '非常适合逆向入门者。'
      },
      {
        name: 'ARM Assembly',
        url: 'https://azeria-labs.com/writing-arm-assembly-part-1/',
        description: 'ARM汇编和逆向教程',
        icon: '📱',
        features: ['ARM汇编', '移动逆向', '实战教程', '详细讲解'],
        usage: '学习ARM汇编，进行移动端逆向。',
        tips: '移动安全必备知识。'
      },
      {
        name: 'LiveOverflow',
        url: 'https://www.youtube.com/c/LiveOverflow',
        description: '逆向和漏洞利用视频教程',
        icon: '🎬',
        features: ['视频教程', '漏洞利用', '逆向分析', '实战演示'],
        usage: '观看视频学习逆向和漏洞利用。',
        tips: '视频质量很高，讲解清晰易懂。'
      }
    ]
  },
  {
    category: '移动安全资源',
    sites: [
      {
        name: 'Mobile Security Framework',
        url: 'https://github.com/MobSF/Mobile-Security-Framework-MobSF',
        description: '移动应用安全分析框架',
        icon: '📱',
        features: ['应用分析', '自动扫描', '静态分析', '动态分析'],
        usage: '部署MobSF进行移动应用安全测试。',
        tips: '开源免费，功能强大，是移动安全必备工具。'
      },
      {
        name: 'Android Security',
        url: 'https://github.com/ashishb/android-security-awesome',
        description: 'Android安全资源大全',
        icon: '🤖',
        features: ['Android安全', '工具合集', '逆向资源', '漏洞研究'],
        usage: '查找Android安全工具和资源。',
        tips: 'Android安全资源非常全面。'
      },
      {
        name: 'iOS Security',
        url: 'https://github.com/ashishb/ios-security-awesome',
        description: 'iOS安全资源大全',
        icon: '🍎',
        features: ['iOS安全', '越狱资源', '逆向工具', '漏洞研究'],
        usage: '查找iOS安全工具和资源。',
        tips: 'iOS安全资源收集全面。'
      },
      {
        name: 'Drozer',
        url: 'https://github.com/WithSecureLabs/drozer',
        description: 'Android安全评估框架',
        icon: '🎯',
        features: ['安全评估', '漏洞发现', '交互测试', '报告生成'],
        usage: '使用Drozer进行Android应用安全测试。',
        tips: 'Android安全测试经典工具。'
      },
      {
        name: 'Frida',
        url: 'https://frida.re/',
        description: '动态插桩工具，支持多平台',
        icon: '💉',
        features: ['动态插桩', 'Hook技术', '多平台支持', '脚本编写'],
        usage: '使用Frida进行动态分析和Hook。',
        tips: 'Frida是现代逆向和调试的神器。'
      },
      {
        name: 'Objection',
        url: 'https://github.com/sensepost/objection',
        description: '基于Frida的移动安全测试工具',
        icon: '🔍',
        features: ['移动测试', 'Frida封装', '快捷命令', '自动化'],
        usage: '使用Objection快速进行移动安全测试。',
        tips: '简化Frida使用，适合快速测试。'
      }
    ]
  },
  {
    category: '云安全资源',
    sites: [
      {
        name: 'Cloud Security Alliance',
        url: 'https://cloudsecurityalliance.org/',
        description: '云安全联盟，云安全标准制定者',
        icon: '☁️',
        features: ['云安全标准', '最佳实践', '认证培训', '研究报告'],
        usage: '学习云安全最佳实践，获取CCSK认证。',
        tips: 'CSA是云安全领域的权威组织。'
      },
      {
        name: 'Prowler',
        url: 'https://github.com/prowler-cloud/prowler',
        description: 'AWS安全评估工具',
        icon: '🔍',
        features: ['AWS扫描', '安全检查', '合规评估', '报告生成'],
        usage: '运行Prowler扫描AWS环境安全。',
        tips: 'AWS安全必备工具，检查项非常全面。'
      },
      {
        name: 'ScoutSuite',
        url: 'https://github.com/nccgroup/ScoutSuite',
        description: '多云安全审计工具',
        icon: '🎯',
        features: ['多云支持', '安全审计', '风险发现', '报告生成'],
        usage: '使用ScoutSuite审计多个云平台。',
        tips: '支持AWS、Azure、GCP等多个云平台。'
      },
      {
        name: 'CloudGoat',
        url: 'https://github.com/RhinoSecurityLabs/cloudgoat',
        description: 'AWS漏洞模拟靶场',
        icon: '🐐',
        features: ['漏洞模拟', 'AWS靶场', '实战练习', '场景多样'],
        usage: '部署CloudGoat进行AWS安全练习。',
        tips: 'Rhino Security Labs出品，场景设计很棒。'
      },
      {
        name: 'Hammer',
        url: 'https://github.com/Dark-Code-Lab/hammer',
        description: '云安全漏洞扫描工具',
        icon: '🔨',
        features: ['漏洞扫描', '配置检查', '多云支持', '自动化'],
        usage: '使用Hammer扫描云环境漏洞。',
        tips: '轻量级工具，适合快速扫描。'
      },
      {
        name: 'Steampipe',
        url: 'https://steampipe.io/',
        description: '用SQL查询云资产的工具',
        icon: '📊',
        features: ['SQL查询', '资产管理', '安全检查', '可视化'],
        usage: '用SQL语句查询和分析云资产。',
        tips: '创新的方式管理云资产，非常方便。'
      }
    ]
  },
  {
    category: '漏洞复现环境',
    sites: [
      {
        name: 'Vulhub',
        url: 'https://github.com/vulhub/vulhub',
        description: 'Docker漏洞环境集合，一键复现',
        icon: '🐳',
        features: ['漏洞复现', 'Docker部署', '一键启动', '环境丰富'],
        usage: '克隆项目，docker-compose启动漏洞环境。',
        tips: '最方便的漏洞复现方式，强烈推荐。'
      },
      {
        name: 'VulApps',
        url: 'https://github.com/Medicean/VulApps',
        description: '各类应用漏洞环境集合',
        icon: '📦',
        features: ['应用漏洞', 'Docker镜像', '快速部署', '分类清晰'],
        usage: '拉取Docker镜像启动漏洞环境。',
        tips: '应用漏洞覆盖全面。'
      },
      {
        name: 'SpringBootVulExploit',
        url: 'https://github.com/LandGrey/SpringBootVulExploit',
        description: 'SpringBoot漏洞复现项目',
        icon: '🍃',
        features: ['SpringBoot漏洞', '复现教程', '利用脚本', '详细分析'],
        usage: '学习SpringBoot漏洞利用技术。',
        tips: 'SpringBoot漏洞研究很深入。'
      },
      {
        name: 'CVE-Master',
        url: 'https://github.com/Threekiii/CVE-Master',
        description: 'CVE漏洞复现和利用集合',
        icon: '📋',
        features: ['CVE复现', '利用脚本', '漏洞分析', '持续更新'],
        usage: '查找CVE漏洞复现方法。',
        tips: 'CVE覆盖全面，复现教程详细。'
      },
      {
        name: 'Awesome-Exploit',
        url: 'https://github.com/Threekiii/Awesome-Exploit',
        description: '漏洞利用工具和资源集合',
        icon: '💥',
        features: ['利用工具', 'PoC集合', '漏洞研究', '分类整理'],
        usage: '查找漏洞利用工具。',
        tips: '工具和资源非常全面。'
      }
    ]
  },
  {
    category: '安全开发指南',
    sites: [
      {
        name: 'OWASP Secure Coding Practices',
        url: 'https://owasp.org/www-project-secure-coding-practices/',
        description: 'OWASP安全编码实践指南',
        icon: '📝',
        features: ['编码规范', '安全检查', '最佳实践', '检查清单'],
        usage: '参考指南进行安全编码。',
        tips: '安全开发必备参考。'
      },
      {
        name: 'Security Code Review Guide',
        url: 'https://github.com/OWASP/Code-Review-Guide',
        description: 'OWASP代码审查指南',
        icon: '🔍',
        features: ['代码审查', '安全检查', '审查流程', '检查点'],
        usage: '按照指南进行安全代码审查。',
        tips: '代码审查的标准参考。'
      },
      {
        name: 'Secure Coding Dojo',
        url: 'https://github.com/OWASP/SecureCodingDojo',
        description: '安全编码练习平台',
        icon: '🥋',
        features: ['编码练习', '漏洞修复', '实战训练', '学习路径'],
        usage: '在平台练习安全编码。',
        tips: '通过练习掌握安全编码技能。'
      },
      {
        name: 'DevSecOps Guide',
        url: 'https://github.com/devsecops/devsecops-guide',
        description: 'DevSecOps实践指南',
        icon: '🔄',
        features: ['DevSecOps', '安全集成', 'CI/CD安全', '自动化'],
        usage: '学习DevSecOps实践方法。',
        tips: '现代安全开发的最佳实践。'
      },
      {
        name: 'API Security Best Practices',
        url: 'https://github.com/OWASP/API-Security',
        description: 'OWASP API安全项目',
        icon: '🔌',
        features: ['API安全', 'Top 10', '最佳实践', '测试指南'],
        usage: '学习API安全最佳实践。',
        tips: 'API安全是现代应用安全的重要领域。'
      }
    ]
  },
  {
    category: '密码学资源',
    sites: [
      {
        name: 'CryptoHack',
        url: 'https://cryptohack.org/',
        description: '密码学挑战学习平台',
        icon: '🔐',
        features: ['密码学挑战', '交互学习', '难度分级', '社区讨论'],
        usage: '完成挑战学习密码学知识。',
        tips: '最好的密码学学习平台之一。'
      },
      {
        name: 'Cryptopals',
        url: 'https://cryptopals.com/',
        description: '密码学编程挑战',
        icon: '🎯',
        features: ['编程挑战', '实战练习', '循序渐进', '经典题目'],
        usage: '完成编程挑战学习密码学。',
        tips: '经典密码学挑战，质量很高。'
      },
      {
        name: 'Practical Cryptography',
        url: 'https://practicalcryptography.com/',
        description: '实用密码学教程',
        icon: '📚',
        features: ['密码学教程', '算法讲解', '实例代码', '实用指南'],
        usage: '学习实用密码学知识。',
        tips: '偏向实用，适合开发者。'
      },
      {
        name: 'Awesome Cryptography',
        url: 'https://github.com/sobolevn/awesome-cryptography',
        description: '密码学资源大全',
        icon: '⭐',
        features: ['资源合集', '工具推荐', '学习资料', '分类整理'],
        usage: '查找密码学学习资源。',
        tips: '密码学资源非常全面。'
      },
      {
        name: 'Hashcat',
        url: 'https://hashcat.net/hashcat/',
        description: 'GPU密码破解工具',
        icon: '🔓',
        features: ['密码破解', 'GPU加速', '多种算法', '高性能'],
        usage: '使用Hashcat进行密码破解测试。',
        tips: '最强的密码破解工具。'
      }
    ]
  },
  {
    category: '社工库资源',
    sites: [
      {
        name: 'Have I Been Pwned',
        url: 'https://haveibeenpwned.com/',
        description: '查询邮箱是否泄露',
        icon: '📧',
        features: ['泄露查询', '邮箱检测', '密码检查', 'API接口'],
        usage: '输入邮箱查询是否在泄露数据中。',
        tips: '最权威的泄露查询服务。'
      },
      {
        name: 'DeHashed',
        url: 'https://dehashed.com/',
        description: '泄露数据搜索引擎',
        icon: '🔍',
        features: ['数据搜索', '泄露查询', '多类型支持', '订阅服务'],
        usage: '搜索泄露数据记录。',
        tips: '搜索功能强大，覆盖面广。'
      },
      {
        name: 'LeakCheck',
        url: 'https://leakcheck.io/',
        description: '泄露数据检测服务',
        icon: '🔎',
        features: ['泄露检测', '实时监控', 'API服务', '批量查询'],
        usage: '检测账号是否泄露。',
        tips: '适合企业批量检测。'
      },
      {
        name: 'IntelX',
        url: 'https://intelx.io/',
        description: '情报和数据搜索引擎',
        icon: '🕵️',
        features: ['情报搜索', '数据泄露', '文档搜索', '历史数据'],
        usage: '搜索各类情报和泄露数据。',
        tips: '搜索范围广泛，功能强大。'
      }
    ]
  },
  {
    category: '网络安全论坛',
    sites: [
      {
        name: '吾爱破解',
        url: 'https://www.52pojie.cn/',
        description: '国内知名软件安全与逆向论坛',
        icon: '❤️',
        features: ['逆向技术', '软件安全', '工具分享', '技术交流'],
        usage: '参与论坛讨论，学习逆向技术。',
        tips: '国内最活跃的逆向论坛之一。'
      },
      {
        name: '吾爱编程',
        url: 'https://www.52coding.com/',
        description: '编程技术交流论坛',
        icon: '💻',
        features: ['编程交流', '技术分享', '学习资源', '问答互助'],
        usage: '参与编程技术讨论。',
        tips: '编程学习的好去处。'
      },
      {
        name: '安全脉搏',
        url: 'https://www.secpulse.com/',
        description: '安全技术社区',
        icon: '💓',
        features: ['技术文章', '漏洞分析', '工具推荐', '社区交流'],
        usage: '阅读技术文章，参与社区讨论。',
        tips: '文章质量不错，适合学习。'
      },
      {
        name: 'T00ls',
        url: 'https://www.t00ls.com/',
        description: '网络安全从业者论坛',
        icon: '🔧',
        features: ['行业交流', '技术分享', '招聘信息', '资源下载'],
        usage: '参与行业交流，获取资源。',
        tips: '适合安全从业者交流。'
      },
      {
        name: 'Hack80',
        url: 'https://www.hack80.com/',
        description: '黑客技术学习论坛',
        icon: '🔥',
        features: ['黑客技术', '教程分享', '工具下载', '问答交流'],
        usage: '学习黑客技术，下载工具。',
        tips: '适合初学者学习。'
      }
    ]
  },
  {
    category: '安全公众号',
    sites: [
      {
        name: '安全研究',
        url: 'https://mp.weixin.qq.com/',
        description: '微信安全公众号合集',
        icon: '📱',
        features: ['公众号推荐', '文章聚合', '资讯获取', '移动阅读'],
        usage: '关注安全公众号获取资讯。',
        tips: '公众号是获取国内安全资讯的重要渠道。'
      },
      {
        name: '腾讯安全应急响应中心',
        url: 'https://security.tencent.com/',
        description: '腾讯SRC官方博客',
        icon: '🐧',
        features: ['漏洞分析', '安全研究', 'SRC活动', '奖励计划'],
        usage: '提交漏洞获取奖励，阅读研究文章。',
        tips: '大厂SRC，奖励丰厚。'
      },
      {
        name: '阿里安全',
        url: 'https://security.alibaba.com/',
        description: '阿里安全官方博客',
        icon: '🛒',
        features: ['安全研究', '技术分享', 'SRC活动', '安全产品'],
        usage: '阅读阿里安全研究成果。',
        tips: '阿里安全研究质量很高。'
      },
      {
        name: '百度安全',
        url: 'https://security.baidu.com/',
        description: '百度安全官方博客',
        icon: '🔍',
        features: ['安全研究', 'AI安全', 'SRC活动', '技术文章'],
        usage: '阅读百度安全研究文章。',
        tips: '百度在AI安全方面研究深入。'
      }
    ]
  }
];

export const toolSites = toolSitesData;
export default toolSites;
