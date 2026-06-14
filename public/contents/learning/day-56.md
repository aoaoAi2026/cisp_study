# Day 56：第八周总结与测验

> **所属周**：Week 8 — 应用安全 · **主题**：Web应用安全全体系回顾与模拟测验

---

## 📑 目录

1. [第八周知识地图](#一第八周知识地图)
2. [每日精华回顾](#二每日精华回顾)
3. [核心对比表汇总](#三核心对比表汇总)
4. [模拟测验（15题）](#四模拟测验15题)
5. [OWASP Top 10速查卡](#五owasp-top-10速查卡)
6. [常用工具速查](#六常用工具速查)
7. [下周预览](#七下周预览)
8. [学习进度检查](#八学习进度检查)

---

## 一、第八周知识地图

```
                    应用安全知识体系

                    ┌─────────────┐
                    │  OWASP Top 10│
                    │   (Day 50)    │
                    └──────┬──────┘
                           │
    ┌──────────────────────┼──────────────────────┐
    │                      │                      │
┌───▼────┐          ┌─────▼─────┐          ┌────▼─────┐
│ SQL注入 │          │    XSS    │          │   CSRF   │
│(Day 51)│          │  (Day 52)  │          │ (Day 53) │
├────────┤          ├───────────┤          ├──────────┤
│·Union  │          │·反射/存储/DOM│        │·Token   │
│·Boolean│          │·DOM XSS深入│          │·SameSite│
│·Time   │          │·mXSS      │          │·SSRF    │
│·二次注入│          │·CSP绕过   │          │         │
└───┬────┘          └─────┬─────┘          └────┬─────┘
    │                      │                      │
    └──────────────────────┼──────────────────────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
      ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐
      │ 文件上传   │ │ 安全编码   │ │  总结测验  │
      │ (Day 54)  │ │ (Day 55)  │ │ (Day 56)  │
      ├───────────┤ ├───────────┤ ├───────────┤
      │·绕过技术   │ │·SDL流程   │ │·知识回顾  │
      │·图片马    │ │·输入验证   │ │·模拟考试  │
      │·LFI/RFI  │ │·SAST/DAST│ │           │
      │·安全上传   │ │·供应链安全 │ │           │
      └───────────┘ └───────────┘ └───────────┘
```

---

## 二、每日精华回顾

### Day 50：Web安全基础
```
核心掌握：
  · OWASP Top 10 (2021)：A01失效访问控制登顶
  · 关键安全头：CSP, HSTS, X-Frame-Options, X-Content-Type-Options
  · Cookie属性：Secure + HttpOnly + SameSite
  · CORS配置：不能Origin:* + Credentials:true
```

### Day 51：SQL注入深入
```
核心掌握：
  · 盲注分类：Boolean(页面差异) vs Time-based(时间延迟)
  · 二次注入：存储时转义≠安全，取出再拼接仍危险
  · WAF绕过：编码+注释+大小写+等价函数
  · 根本防御：参数化查询(PreparedStatement)
```

### Day 52：XSS深入
```
核心掌握：
  · DOM XSS：Source→Sink，不经过服务器
  · mXSS：浏览器HTML解析/序列化的不一致性
  · CSP绕过：JSONP、AngularJS、文件上传
  · Trusted Types：浏览器原生防御机制
```

### Day 53：CSRF攻击
```
核心掌握：
  · 防御层次：SameSite Cookie + Anti-CSRF Token + Referer验证
  · XSS存在时CSRF防御失效
  · SSRF让服务器发起请求，攻击内网
  · GET请求不应有副作用
```

### Day 54：文件上传漏洞
```
核心掌握：
  · 安全上传=白名单扩展名+魔数检查+随机命名+非Web目录
  · 绕过技术：大小写/双扩展/特殊扩展/.htaccess/图片马
  · LFI：include用户输入→任意文件读取
  · RFI：allow_url_include→远程代码执行
```

### Day 55：安全编码实践
```
核心掌握：
  · 微软SDL：培训→需求→设计→实现→验证→发布→响应
  · 输入验证：白名单优先，服务端强制
  · SAST vs DAST：白盒静态vs黑盒动态
  · DevSecOps：Shift Left，安全融入CI/CD
```

---

## 三、核心对比表汇总

### OWASP Top 10 新旧对比

| 2021排名 | 风险 | 2017排名 | 变化 |
|----------|------|---------|------|
| A01 | 失效的访问控制 | A05 | ↑ 升到第一 |
| A02 | 加密失效 | A03 | 扩大范围 |
| A03 | 注入 | A01 | ↓ 降到第三 |
| A04 | 不安全设计 | 新增 | NEW |
| A05 | 安全配置错误 | A06 | ↑ 上升 |
| A06 | 易受攻击组件 | A09 | ↑ 上升 |
| A07 | 识别和认证失败 | A02 | ↓ 下降 |
| A08 | 软件数据完整性失败 | A08 | NEW |
| A09 | 日志和监控不足 | A10 | ↑ 上升 |
| A10 | SSRF | 新增 | NEW |

### XSS三类型对比

| 类型 | 存储位置 | 传播方式 | 检测难度 |
|------|---------|---------|---------|
| 反射型 | URL参数 | 诱导点击 | 容易 |
| 存储型 | 服务器DB | 自动触达所有用户 | 一般 |
| DOM型 | 客户端JS | URL Hash/Referer | 困难(WAF不可见) |

---

## 四、模拟测验（15题）

**1. OWASP Top 10 (2021)中排名第一的风险是？**

A. SQL注入 B. XSS C. 失效的访问控制 D. 安全配置错误

<details><summary>答案</summary>**C** — 失效的访问控制在2021版升至第一位。</details>

---

**2. SQL注入的Boolean盲注和Time盲注的关键区别是？**

A. 没有区别  
B. Boolean看页面内容差异，Time看响应时间差异  
C. Boolean需要WAITFOR DELAY  
D. Time盲注只适用于MySQL  

<details><summary>答案</summary>**B** — Boolean通过页面返回差异判断，Time通过延迟时间判断。</details>

---

**3. 以下哪项不是防御XSS的正确方法？**

A. HTML实体编码输出 B. 使用CSP限制脚本来源 C. 黑名单过滤用户输入中的`<script>` D. 使用Trusted Types API

<details><summary>答案</summary>**C** — 黑名单过滤不可靠，容易绕过。正确方法是输出编码 + CSP。</details>

---

**4. SameSite Cookie设置为Lax时，哪种跨站请求会携带Cookie？**

A. 跨站form POST提交  B. 跨站img加载  C. 用户点击链接的GET导航  D. 跨站fetch请求

<details><summary>答案</summary>**C** — Lax模式允许顶级GET导航携带Cookie。</details>

---

**5. 二次注入的关键问题是什么？**

A. 第一次没有验证输入  
B. 数据从数据库取出后被认为安全，不再转义就拼SQL  
C. WAF配置错误  
D. 数据库版本过旧  

<details><summary>答案</summary>**B** — 数据存储时已转义，但取出后再次拼接SQL时才触发注入。</details>

---

**6. DOM XSS的典型特征是？**

A. 在服务器端执行 B. 需要存储到数据库 C. 恶意数据不经过服务器，在客户端JS中触发 D. 只能通过Cookie触发

<details><summary>答案</summary>**C** — DOM XSS中Source→Sink的完整流程都在客户端，不经过服务器。</details>

---

**7. 以下哪种是文件上传最安全的检查方式？**

A. 前端JS验证扩展名 B. 检查Content-Type C. 白名单+Magic Bytes+随机命名+非Web目录 D. 黑名单禁止.php

<details><summary>答案</summary>**C** — 多重检查组合是最安全的。</details>

---

**8. LFI漏洞通常如何防御？**

A. 让用户访问文件  
B. 使用白名单映射而非直接使用用户输入的文件名  
C. 在PHP中启用allow_url_include  
D. 不进行任何检查  

<details><summary>答案</summary>**B** — 使用白名单将输入映射到预定文件路径。</details>

---

**9. SAST和DAST的关键区别？**

A. SAST需要运行应用  
B. DAST是白盒测试  
C. SAST是静态白盒(代码级)，DAST是动态黑盒(运行时)  
D. 两者完全相同  

<details><summary>答案</summary>**C** — SAST分析源码不需要运行，DAST测试运行中的应用。</details>

---

**10. 防止CSRF最推荐的三层组合是？**

A. 仅依赖HTTPS  
B. SameSite Cookie + Anti-CSRF Token + 合理使用HTTP方法  
C. 仅检查Referer头  
D. 使用验证码替代一切  

<details><summary>答案</summary>**B** — SameSite + Token + GET只读 = 纵深防御。</details>

---

**11-15. 判断题**

**11. CSP可以完全消除XSS风险。**
<details><summary>答案</summary>❌ CSP只是缓解措施之一，配置错误可被绕过，需配合输出编码。</details>

**12. SSRF利用的是客户端浏览器发起请求。**
<details><summary>答案</summary>❌ SSRF利用的是服务器端发起请求。</details>

**13. SVG文件可以包含可执行的JavaScript代码。**
<details><summary>答案</summary>✅ 正确 — SVG支持`<script>`标签。</details>

**14. 使用ORM框架后就不需要担心SQL注入。**
<details><summary>答案</summary>❌ ORM中如果使用了原生SQL拼接，仍然存在SQL注入风险。</details>

**15. 安全的文件上传应该使用白名单而非黑名单来控制允许的文件类型。**
<details><summary>答案</summary>✅ 正确 — 白名单只允许已知安全的类型，比黑名单更安全。</details>

---

## 五、OWASP Top 10速查卡

```
A01 失效的访问控制    → 权限检查不严格     → RBAC/ABAC, 默认拒绝
A02 加密失效          → 敏感数据明文        → AES-GCM, TLS 1.3
A03 注入              → 命令/SQL/LDAP拼接   → 参数化, 输入验证
A04 不安全设计         → 缺乏安全需求        → SDL, 威胁建模
A05 安全配置错误       → 默认配置未改        → 加固基线, 定期审计
A06 易受攻击组件       → 依赖版本过旧        → SCA扫描, 及时更新
A07 认证失败          → 弱密码/无MFA        → MFA, 密码策略
A08 完整性失败         → 未签名的更新        → 代码签名, SLSA
A09 监控不足          → 无日志/无告警       → SIEM, 实时监控
A10 SSRF             → 服务器请求未验证     → URL白名单, 网络分段
```

---

## 六、常用工具速查

| 类别 | 工具 | 用途 |
|------|------|------|
| Web代理 | Burp Suite, ZAP | 请求拦截/修改/扫描 |
| SQL注入 | SQLMap | 自动化注入检测 |
| XSS | Dalfox, XSStrike | XSS自动化 |
| 目录爆破 | ffuf, gobuster | 隐藏目录/文件 |
| 漏洞扫描 | Nuclei, Nikto | 自动化漏洞检测 |
| WAF识别 | wafw00f | WAF检测 |
| SAST | Semgrep, SonarQube | 静态代码分析 |
| SCA | OWASP DepCheck | 依赖漏洞检测 |

---

## 七、下周预览

### Week 9：物理安全

```
Day 57 → 物理安全概述（分层防护、安全区域分级）
Day 58 → 物理访问控制（门禁系统、生物识别物理安全）
Day 59 → 环境安全（防火、防水、电力、温湿度）
Day 60 → 数据中心安全（Tier分级、冗余设计）
Day 61 → 容灾备份（3-2-1原则、异地备份）
Day 62 → 监控系统（CCTV、入侵报警系统）
Day 63 → 第九周总结与测验
```

---

## 八、学习进度检查

```
✅ Week 1-7：信息安全基础 → 网络安全     ████████ 完成
✅ Week 8：应用安全 (Day 50-56)           ████████ 完成
⬜ Week 9：物理安全 (Day 57-63)           ░░░░░░░░ 待学习
⬜ Week 10：安全工程 (Day 64-70)          ░░░░░░░░ 待学习
⬜ Week 11：业务安全 (Day 71-77)          ░░░░░░░░ 待学习
⬜ Week 12：模拟考试 (Day 78-84)          ░░░░░░░░ 待学习

────────────────────────────────────────────
总体进度：56/84 (67%)
```

---

> **🎯 Week 8完成！** 应用安全是防御体系的最终防线。掌握OWASP Top 10和各项攻击防御技术，才能在实战中保护应用。继续前进，下周将学习物理安全。
