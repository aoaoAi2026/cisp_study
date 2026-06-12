# 支付逻辑与竞争条件漏洞测试（双花/并发）

> 支付与订单系统是企业最敏感的业务逻辑。本文系统梳理支付接口常见漏洞：金额篡改、负数金额、精度丢失、优惠券重复、双花、并发竞争条件（TOCTOU）、回调签名伪造与重放。

## 1. 支付流程回顾

一个典型的支付流程通常包括 5 步：

```
1. 创建订单         POST /api/order/create     → 返回 orderId
2. 计算金额         POST /api/order/amount       → 返回 price, discount, coupon
3. 发起支付         POST /api/pay                → 返回第三方支付链接
4. 第三方支付回调   POST /api/pay/callback       → 支付平台（支付宝/微信/PayPal）通知我方
5. 发货/入账        POST /api/order/confirm      → 内部业务逻辑：修改余额 / 发放优惠券 / 发货
```

每一步都可能产生不同类型的漏洞。

## 2. 典型金额类漏洞

### 2.1 负数金额

请求中提交 `amount: -100`，后端若未校验符号，可能导致：

- 用户余额 **增加**；
- 优惠券面额变成负数，反而让用户"赚到"钱；
- 支付接口向第三方支付 `0 元 / 负数金额`，部分第三方支付会报错，一部分会放行。

```
POST /api/pay
{
  "orderId": "ORD2024001",
  "amount": -99.99,
  "currency": "CNY"
}
```

### 2.2 精度缺失与小数溢出

- 后端用 `float` 存金额（`0.1 + 0.2 != 0.3`）；
- 使用 `int` + "分" 作为单位，但客户端提交"元"；
- 金额字段 `amount: 9.9999999` 经四舍五入后变成 `9.99`，或变成 `10.00`；
- 货币单位混用：`USD` / `CNY` / `JPY` 无换算。

### 2.3 参数篡改

- 前端提交 `price: 9999` → 改成 `price: 0.01`；
- 前端提交 `discount: 10` → 改成 `discount: 10000`；
- 前端提交 `couponId: 0` → 改成 `couponId: 任意已存在的优惠券 ID`；
- 前端提交 `vip: false` → 改成 `vip: true`；
- 前端提交 `currency: CNY` → 改成 `currency: JPY`（单价更小）。

### 2.4 商品数量

- `qty: -1` → 总金额为负，可能被退款；
- `qty: 0` → 总金额为 0；
- `qty: 999999999` → 超出整数上限 → 溢出 → 负数。

### 2.5 组合字段

- `actualPrice`（实付）与 `totalPrice`（原价）不一致；
- 支付参数中 `totalPrice=0` 但 `actualPrice=99`（或反过来），后端取错字段；
- 多个商品时，只校验最后一个商品价格；
- 参数污染：`price=999&price=0.01`，部分后端取后者。

## 3. 优惠券 / 折扣 / 积分类漏洞

### 3.1 优惠券重复使用

- 同一张优惠券在并发下被多次核销（竞争条件）；
- 优惠券状态在支付成功后才被置为"已使用"，而判断时没加锁；
- 退款后优惠券未重新置为可用，或置为可用但用户已经重新发起支付。

### 3.2 积分 / 余额抵扣负数

- `usePoints = -100000` → 系统把积分加给用户；
- `useBalance = -9999` → 反而给用户加钱；
- 折扣比例 `discountRate` 为负 → 总金额 = 原价 - 负数 = 高于原价的金额（异常），或者部分后端走特殊分支。

### 3.3 叠加优惠

- 多张优惠券同时使用（系统只允许 1 张，但前端拼接多个 couponId）；
- 同一张优惠券在不同订单中同时使用；
- 积分 + 余额 + 优惠券叠加后，总金额为 0 或负数。

## 4. 竞争条件（Race Condition / TOCTOU）

竞争条件是支付系统最常见、也最隐蔽的漏洞之一。

### 4.1 原理：Time Of Check, Time Of Use

```
T0：检查余额（检查通过）
T1：（存在并发窗口）                    ← 另一条同样的请求也到达 T0
T2：扣减余额 / 发货
```

当两条几乎同时到达的请求都在 T0 判断 "余额够 / 券可用 / 库存>0"，然后都走到 T2 执行扣减时，就出现了竞争。

### 4.2 典型攻击场景

| 场景 | 攻击方式 |
|------|----------|
| **优惠券并发核销** | 同一张优惠券被并发扣减 n 次，均成功 |
| **积分并发扣除** | 余额 100 元，并发购买 3 件 100 元商品，可能成功 2 次 |
| **库存扣减** | 库存 1，并发购买 n 次 → 卖出 n 件 |
| **提现并发** | 100 元余额 → 并发发起 2 次 100 元提现 → 成功 2 次 |
| **抽奖 / 签到 / 转盘** | 并发点击 n 次 → 奖励被发放 n 次 |
| **领取礼包** | 同一用户并发领取限 1 次礼包 → 实际领取 n 次 |
| **验证码并发** | 同一条短信验证码被多次使用（如果校验后未立即失效） |

### 4.3 实战：使用 Turbo Intruder 并发 100 次

1. 在 Burp 中捕获支付 / 核销 / 领取 / 提现请求；
2. 右键 → Extensions → Turbo Intruder；
3. 选择一个 payload 位置（如果不需要变化 payload，就写 `range(1, 101)`）；
4. 设置并发 `concurrency=100, requestsPerConnection=100, pipeline=True`；
5. 观察响应中 "success" 的次数；

```python
def queueRequests(target, wordlists):
    engine = RequestEngine(endpoint=target.endpoint,
                           concurrentConnections=100,
                           requestsPerConnection=100,
                           pipeline=False)
    for _ in range(100):
        engine.queue(target.req, None)

def handleResponse(req, interesting):
    if 'success' in req.response:
        table.add(req)
```

### 4.4 其他并发工具

- **burp-repeater + send group**：按住 Ctrl 选中多个相同请求，右键 "send group in parallel"（新版 Burp 功能）；
- **racepwn**（需编译，开源并发工具）；
- **自定义脚本**：Python `threading` / `asyncio`、Golang `sync.WaitGroup`。

并发脚本示例（概念版）：

```python
import threading, requests

URL = "https://target.com/api/coupon/redeem"
HEADER = {"Authorization": "Bearer <token>",
          "Content-Type": "application/json"}
BODY = '{"couponId":"CP-FREE100"}'

success = 0
lock = threading.Lock()

def worker():
    global success
    r = requests.post(URL, headers=HEADER, data=BODY, timeout=10)
    if r.status_code == 200 and '"success":true' in r.text:
        with lock:
            success += 1

threads = [threading.Thread(target=worker) for _ in range(100)]
for t in threads: t.start()
for t in threads: t.join()

print(f"[+] Total success: {success}")
```

## 5. 支付回调（Notify）安全

支付回调是支付流程中最脆弱的一环，常见漏洞：

### 5.1 回调签名未校验 / 可伪造

```
# 微信 / 支付宝回调通知
POST /api/pay/callback
out_trade_no=ORD2024001&total_fee=1&sign=xxx

漏洞：
- 后端只校验 sign 是否存在，不校验内容；
- sign 用 MD5(key+params)，key 可预测 / 为空 / 硬编码在前端；
- 攻击者自算合法 sign，伪造 "支付成功" 通知。
```

### 5.2 回调重放

- 相同的回调通知被重复提交多次 → 订单被重复入账 / 发货；
- `out_trade_no` 未做幂等；
- 没有 `nonce` / `timestamp` 校验。

### 5.3 回调金额/状态篡改

- 攻击者在回调中把 `total_fee` 从 `999` 改成 `1`（分），订单状态被置为成功；
- 未把回调中的金额 / 订单状态与数据库中保存的订单金额做对比；
- 只看 `trade_status=SUCCESS`，不校验金额。

### 5.4 回调来源未校验

- 回调接口公网可访问；
- 未校验请求来源 IP（如未限制支付宝 IP 段）；
- 未做 HTTPS + 证书校验。

### 5.5 回调测试清单

- [ ] 回调接口是否校验 sign？sign 的 key 是否硬编码？
- [ ] 是否可自算 sign（用 MD5 / HMAC-SHA256 手动验证）？
- [ ] 回调参数 `total_fee` / `trade_status` / `out_trade_no` 是否与原订单一致？
- [ ] 同一回调多次重放是否被重复入账？
- [ ] 回调接口是否公网可访问？是否限制来源 IP？
- [ ] 回调金额为 0 / 1 分时订单是否被置为成功？
- [ ] 异步回调 + 前端轮询时，是否存在前端返回 "支付成功" 即可跳过后端校验？
- [ ] 调试接口 `POST /api/pay/success?orderId=ORD2024001` 是否对外暴露？

## 6. 订单状态与退款漏洞

- **订单状态篡改**：`status=pending → paid`，前端直接改；
- **订单价格修改**：创建订单后、支付前，订单可由用户修改价格；
- **退款重放**：同一订单多次申请退款；
- **退款金额为负**：`refundAmount = -9999` → 反向给用户加钱；
- **部分退款 / 全退款后券是否收回**：未收回可能被用户再次使用；
- **退款后余额 + 积分 + 券三种资产只回滚部分**：组合式套利。

## 7. 双花攻击实战场景

**场景一：余额支付**
- 用户余额 1000 元，商品 1000 元；
- 并发 10 次"下单 + 扣款"；
- 后端未加行锁 / 事务隔离级别不够 → 最终扣款 n 次，余额为负数；
- 进一步可并发提现，形成"双花 + 套现"。

**场景二：优惠券核销**
- 限 1 次使用的优惠券；
- 并发 10 次核销请求，若 3 次成功 → 3 笔订单共用同一张券；
- 若优惠券同时叠加"满 999 减 999"，则用户 3 次都 0 元下单。

**场景三：签到 / 抽奖**
- 每日限抽 1 次；
- 并发点击 50 次 → 被发放 50 次奖励；
- 与优惠券/积分/余额叠加后可套利。

## 8. 支付测试 Checklist

### 8.1 金额类

- [ ] `amount` 为 0 / 0.00 / 0.01 / -1 / -9999；
- [ ] `amount` 为超大整数（溢出）；
- [ ] 货币单位混用（元/分）；
- [ ] `currency` 篡改（CNY / USD / JPY）；
- [ ] 浮点数精度问题（`0.1 + 0.2`）；
- [ ] `actualPrice`、`totalPrice`、`paidAmount` 取错字段；
- [ ] `qty` 为 0 / 负数 / 大数；
- [ ] 参数污染（`amount=999&amount=1`）。

### 8.2 优惠券 / 积分 / 余额

- [ ] 优惠券是否限 1 次；
- [ ] 并发使用同一张优惠券是否成功多次；
- [ ] `couponId` 是否可替换为他人/更大面额；
- [ ] `usePoints` / `useBalance` 为负；
- [ ] 多张优惠券能否同时使用；
- [ ] 折扣率为负数/超过 100%。

### 8.3 并发与幂等

- [ ] 创建订单 100 次并发，是否重复生成相同 orderId；
- [ ] 同一支付回调通知 100 次并发，是否重复入账；
- [ ] 优惠券 100 次并发，是否被核销多次；
- [ ] 余额支付是否被并发双花；
- [ ] 提现 / 签到 / 抽奖 / 领取礼包是否被并发；
- [ ] 所有写接口是否有幂等 key（`orderId` / `idempotency_key`）。

### 8.4 回调与第三方支付

- [ ] sign 是否校验；sign key 是否可预测；
- [ ] 回调参数是否可自算；
- [ ] 回调金额是否与订单金额一致；
- [ ] 回调 0/1 分是否也成功入账；
- [ ] 回调能否重放；
- [ ] 来源 IP 是否限制；
- [ ] 调试接口（`/pay/success`）是否暴露。

### 8.5 订单状态与退款

- [ ] 订单状态是否可由前端直接修改；
- [ ] 支付前能否修改价格；
- [ ] 退款金额是否可被篡改为负；
- [ ] 同一订单能否多次退款；
- [ ] 退款后券 / 积分 / 余额是否全部回滚。

## 9. 防御建议

1. **金额校验**：服务端根据商品 ID + 价格表重新计算金额，不相信任何客户端提交的金额；
2. **类型与符号校验**：金额必须 `> 0`，货币必须在白名单，积分/余额抵扣必须 `≥ 0`；
3. **整型 + "分" 存金额**：避免浮点误差；
4. **事务 + 行锁 / 悲观锁 / 乐观锁**：
   - MySQL：`SELECT ... FOR UPDATE`；
   - Redis：`SETNX` + Lua 脚本；
   - 版本号 / `updated_at` 实现乐观锁；
5. **幂等 key**：所有写操作必须携带 `idempotency_key`（如 `orderId` / `nonce`），同一 key 多次提交只执行一次；
6. **回调签名**：强密钥 + SHA256withRSA / HMAC-SHA256；校验金额、订单号、交易状态；限制来源 IP；
7. **订单状态机**：`pending → paid → delivered → refunded`，状态不可逆；
8. **并发限流**：单用户 1 秒内最多 n 次支付请求；
9. **日志审计**：关键接口记录完整请求+响应+时间戳；
10. **安全测试**：每次上线前做支付逻辑专项渗透测试。

## 10. 综合实战案例

```
目标：某电商 APP 优惠券核销
接口：POST /api/coupon/redeem   {"couponId":"CP-FREE100"}

测试步骤：
1. 用户注册 → 获得限 1 次使用的 100 元优惠券；
2. 捕获 redeem 请求，在 Burp 中右键 → Turbo Intruder；
3. 使用 range(1, 101) 并发 100 条相同请求；
4. 观察响应中 "success" 的次数（共 7 次，说明存在竞争条件）；
5. 进入订单列表，发现 7 个订单都使用了同一张 couponId 核销；
6. 进一步把 7 个订单全部申请退款 → 退款到余额，优惠券未被收回；
7. 循环该流程，理论上可无限套取余额。

修复：
- 核销接口在事务中：SELECT ... FOR UPDATE 锁定 coupon 记录；
- 校验 coupon.status == 'UNUSED'；
- 更新 coupon.status = 'USED'；
- 幂等 key = userId + couponId，同 key 只执行一次；
- 退款流程需同步将 coupon.status 置为 'REFUNDED'（不可再次使用）。
```

支付系统的漏洞直接关联资金损失，务必结合 **金额校验 + 事务隔离 + 幂等 + 签名 + 并发限流** 做纵深防御。
