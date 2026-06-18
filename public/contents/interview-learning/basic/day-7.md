# Day 7：Web安全基础

> 🎯 面试目标：掌握OWASP Top 10核心漏洞的原理、利用方式和防御措施，能回答Web安全面试高频题

## 知识速览

### 核心概念
- **SQL注入（SQLi）**：攻击者通过构造恶意输入拼接SQL语句，实现对数据库的未授权访问。核心防御：参数化查询（Prepared Statement）+ 输入校验 + 最小权限数据库账户。永远不要相信用户输入
- **跨站脚本（XSS）**：攻击者在目标网站注入恶意脚本，当用户访问时执行。分为存储型（持久化到数据库）、反射型（URL参数触发）、DOM型（客户端JS漏洞）。防御：输出编码 + CSP + HttpOnly Cookie
- **跨站请求伪造（CSRF）**：攻击者诱导用户在已登录状态下执行非预期操作。防御：CSRF Token（最常用）、SameSite Cookie、Referer/Origin校验。面试中CSRF常与XSS联动考察

### 必问考点
| 面试官可能怎么问 | 你应该怎么答 |
|------------------|--------------|
| SQL注入怎么防御？不要只说参数化查询 | 分层防御：1)参数化查询/ORM是第一道防线 2)输入校验白名单 3)数据库账户最小权限 4)Web应用防火墙(WAF)做外层过滤 5)错误信息不暴露数据库结构 6)定期代码审计和渗透测试。单一手段不可靠 |
| XSS的三种类型有什么区别？ | 存储型XSS最危险，恶意代码持久保存在服务器，所有访问者受影响；反射型需要用户点击恶意链接，一次性触发；DOM型完全在客户端执行，服务器日志中看不到攻击痕迹。防御方法各有侧重 |
| 如何设计一个安全的文件上传功能？ | 1)白名单限制文件类型(MIME+扩展名双重校验) 2)限制文件大小 3)文件重命名(随机UUID) 4)存储到Web根目录外 5)杀毒扫描 6)设置上传目录不可执行脚本 7)如果是图片，可进行重编码去除恶意代码 |

### 技术细节

**SQL注入常见类型与payload：**
```sql
-- 经典Union注入
' UNION SELECT username, password FROM users--

-- 盲注（布尔型）
' AND 1=1--   （页面正常）
' AND 1=2--   （页面异常）

-- 盲注（时间型）
' AND IF(1=1, SLEEP(5), 0)--

-- 堆叠查询
'; DROP TABLE users; --

-- 二次注入（先存储后触发）
-- 注册用户名为 admin'-- ，之后修改密码时可能修改admin的密码
```

**XSS防御实战代码（输出编码）：**
```html
<!-- HTML上下文 -->
<div>数据：&lt;script&gt;alert(1)&lt;/script&gt;</div>

<!-- JavaScript上下文 -->
<script>
var username = "\x3Cscript\x3Ealert(1)\x3C/script\x3E";
</script>

<!-- 属性上下文 -->
<input value="&quot; onfocus=&quot;alert(1)&quot; autofocus=&quot;">
```

**CSP（内容安全策略）示例：**
```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'nonce-random123';
  style-src 'self' 'unsafe-inline';
  img-src *;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

## 常见陷阱
- ⚠️ "用存储过程就能防SQL注入"——不完全是。如果在存储过程内部仍然拼接SQL字符串（动态SQL），同样存在注入风险。必须用参数化调用存储过程
- ⚠️ "用黑名单过滤特殊字符就能防XSS"——黑名单永远不完整。必须用白名单+上下文相关的输出编码，HTML实体编码不能解决所有上下文的问题（如JS中的XSS）

## 今日检测
1. 手写一个简单的参数化查询示例（任意语言），并说明为什么它比字符串拼接安全
2. 画出CSRF攻击的完整流程，并说明CSRF Token如何防御
3. 列举至少5个OWASP Top 10（2021版）的漏洞类别
