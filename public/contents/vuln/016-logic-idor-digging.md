# 逻辑漏洞 / 越权访问 / IDOR 挖掘思路

> **📘 文档定位**：CISP 考试 漏洞挖掘 核心 | 难度：⭐⭐⭐⭐ | 预计阅读：28 分钟
>
> 系统讲解逻辑漏洞（越权/IDOR/支付/流程绕过）的挖掘思路与方法论，覆盖水平越权、垂直越权、不安全的直接对象引用等核心概念与实战技巧。

---

## 导航目录

- [一、漏洞概述](#一漏洞概述)
- [二、水平越权挖掘](#二水平越权挖掘)
- [三、垂直越权挖掘](#三垂直越权挖掘)
- [四、IDOR 漏洞挖掘](#四idor-漏洞挖掘)
- [五、业务流程漏洞](#五业务流程漏洞)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 一、漏洞概述

逻辑漏洞（Business Logic Vulnerability）是指应用在业务流程实现上存在逻辑缺陷，攻击者无需通过注入 / 溢出等技术手段，仅通过正常业务参数的顺序、取值、数量、身份进行"合法调用"即可突破权限或业务约束。IDOR（Insecure Direct Object Reference，不安全的对象引用）是最典型的一类逻辑漏洞。

| 分类 | 示例 |
|------|------|
| 水平越权 | 用户 A 通过 `?uid=1002` 查看 / 修改用户 B 的资料 |
| 垂直越权 | 普通用户通过 `admin/user` 接口执行管理操作 |
| IDOR | 修改订单 ID 下载他人发票 |
| 交易逻辑 | 价格 / 数量为负数或超大值导致金额倒算 |
| 流程绕过 | 跳过短信验证码步骤直接访问下一步接口 |
| 密码重置 | 遍历 token / 修改 user_id 参数重置任意账号 |

## 2. 关键接口与参数清单

### 2.1 重点关注参数

```
uid=, user_id=, id=, account=, owner=, order_id=,
shop_id=, item_id=, role=, group_id=, tenant_id=,
admin=, is_admin=, permission=, level=, org_id=,
email=, phone=, token=, code=, trans_id=, receiver=
```

### 2.2 重点关注接口

- 个人中心：`/user/profile?uid=...`
- 订单 / 发票：`/order/detail?id=...`、`/invoice/download?id=...`
- 管理后台：`/admin/*`
- 数据导出：`/api/export?ids=1,2,3`
- 登录 / 注册 / 重置：`/reset?token=...`
- 批量操作：`/batch/delete?ids[]=1&ids[]=2`

## 3. 水平越权 / IDOR 挖掘方法

### 3.1 双人测试法

1. 注册两个账号 A、B，分别登录（如浏览器 A + 浏览器 B / 两个 Burp 会话）。
2. 账号 A 获取一个自己资源的链接： `/api/profile?uid=1001` 或 `/order?id=ord-a`。
3. 把参数改为账号 B 的资源 ID，在 A 的会话中访问：
   - 能正常返回 B 的信息 → **水平越权读**
   - 能修改 / 删除 B 的资源 → **水平越权写**
4. 用 Burp "Request in browser → in current browser session" 快速切换。

### 3.2 多 ID 格式猜测

```
数字递增：   uid=1001 → 1002 → 1003 ...
UUID：       user_id=8a8c...a → ?
Base64：     id=MjAyMy0wMTAw → 解码后遍历
日期+哈希：  ref=20240101-abcd → 遍历日期或后缀
```

### 3.3 批量发现脚本

使用 Burp Intruder / ffuf / 自定义脚本遍历 ID：

```bash
# 使用 ffuf 遍历 uid
ffuf -w wordlist.txt -u "https://target.com/api/profile?uid=FUZZ" \
     -H "Cookie: session=<A-cookie>" -fs 150 -fc 403,401

# 使用 Intruder：设置 payload 为数字 1000-1100，根据响应长度差异判断命中
```

## 4. 垂直越权挖掘方法

### 4.1 访问控制矩阵

整理目标系统的接口，形成"角色 × 接口"矩阵，测试每格是否能被非授权角色访问：

| 接口 | 未登录 | 普通用户 | 商家 | 管理员 |
|------|--------|---------|------|--------|
| `/api/user/profile` | 预期× | 是 | 是 | 是 |
| `/admin/user/list` | 预期× | 预期× | 预期× | 是 |
| `/order/refund` | 预期× | 是（仅自己） | 是 | 是 |
| `/api/admin/login_as_user` | 预期× | 预期× | 预期× | 是 |

### 4.2 权限绕过 Payload

```
# 1. 直接访问管理员路径
GET /admin/user/list

# 2. 伪装参数
POST /api/user/delete
{ "uid": 1001, "is_admin": 1 }

# 3. HTTP Header 注入
X-Admin: 1
X-Role: admin
X-Forwarded-For: 127.0.0.1
X-Original-URL: /admin/user/list

# 4. 方法篡改
把 POST /admin/user/delete 改为 GET /admin/user/delete?id=1001

# 5. 路径绕过
/admin/../api/user/info?id=1001
/api/user/info%0a/admin/list   # 某些解析器会把 \n 当作路径分隔符
```

### 4.3 测试清单

- 管理员接口在未登录 / 普通用户会话下是否返回数据
- 管理路径是否存在 `/debug`、`/actuator`、`/swagger-ui.html`、`/console`
- 接口是否支持 HTTP Method 切换
- 是否存在通过特殊 Header 切换角色的逻辑
- 是否能通过 JSON 参数 `"user_role":"admin"` 越权

## 5. 交易与业务流程逻辑

### 5.1 订单 / 支付 / 钱包常见漏洞

- **价格修改**：提交订单时，前端计算价格传给后端，后端未校验，直接改 `price` 为 0.01
- **数量修改**：`num=-1` 导致余额反而增加
- **优惠券叠加**：同一优惠券反复使用 / 多张不同券叠加超限
- **并发重复提交**：在支付回调 / 领取优惠券 / 积分兑换接口，使用 Burp `20 requests in parallel` 触发竞争条件
- **库存溢出**：`num` 极大导致 int32 溢出 / short 溢出

### 5.2 密码重置 / 短信验证码常见漏洞

1. 密码重置链接 `?token=xxx&uid=1001`，修改 `uid` 为他人
2. 重置 token 太短或可预测（基于时间戳 / 自增）
3. 短信验证码可暴力（无速率限制）
4. 短信验证码回显在响应体中
5. 验证码对任意手机号通用 / 无会话绑定

### 5.3 注册 / 登录逻辑

- 批量注册：无速率限制 → 自动注册百万用户
- 用户名覆盖：注册 `admin` 覆盖已存在账号
- 邀请码：邀请码可无限复用 / 任意字符都通过校验
- Session 固定：登录前后 `sessionid` 未刷新 → 钓鱼可劫持

## 6. 修复建议

1. **统一鉴权中间件**：所有接口经过统一权限校验，避免"某个接口忘记校验"。
2. **数据级 Owner 校验**：查询 / 修改数据时，强制附加 `owner_id = current_user_id`，避免直接以客户端传入的 `id` 做查询。
3. **随机化 ID**：使用 UUID / 雪花 ID 而非自增数字，降低遍历攻击可行性。
4. **关键操作二次验证**：支付、改密、注销、绑定等高危操作要求短信 / 邮件 / 人脸识别二次验证。
5. **幂等性与速率限制**：对支付、领券、下单等接口加分布式锁 + 时间窗口速率限制。
6. **流程状态机**：严格跟踪流程状态，拒绝跳步（如未付款就访问"已发货"接口）。
7. **审计日志**：记录每次越权尝试，便于后续追踪与取证。
