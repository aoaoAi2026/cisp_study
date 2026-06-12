# Burp Suite 高级利用技巧与插件实战

> 本文面向已经掌握 Burp Suite 基础使用的安全研究员，聚焦在 Session Handling、插件开发、Turbo Intruder、HTTP/2 及自定义扫描规则等进阶能力。

## 1. Session Handling Rules 与 Macro 实战

在真实项目中，许多目标的会话会随时间失效，或每次请求都需要携带一个由响应生成的动态 Token。仅靠手动重放无法实现规模化测试。Burp 的 **Session Handling Rules** 可以让 Intruder、Scanner、Repeater 在发包前自动完成登录、获取 Token、刷新 Cookie 等前置动作。

### 1.1 核心思路

1. 在 `Settings → Sessions → Session Handling Rules` 中新建规则；
2. 在 `Actions` 中选择 **Run a macro**，并在 Macro 编辑器中录制一个完整的登录/获取 Token 流程；
3. 通过 `Add Custom Parameter` 或 `Configure Cookie Jar`，将 Macro 中的响应字段（如 `csrfToken`、`sessionid`）提取并注入到下一个请求中；
4. 在 `Tool Scope` 中勾选 Scanner / Intruder / Repeater，并限定 URL Scope。

### 1.2 典型场景：CSRF Token 自动注入

假设目标每次登录后的响应体返回 `{"csrf":"a1b2c3d4"}`，后续所有 POST 均需携带该 Token。配置步骤如下：

- 新建 Macro：包含一次 `POST /login` 登录请求，再跟一次 `GET /dashboard` 用于获取页面中嵌入的 CSRF Token；
- 在 Macro 的 `Custom Parameter Locations` 中新增一条：
  - **Type**：`Body`
  - **Name**：`csrf`
  - **Value**：从响应中通过 `grep` 正则 `(?:"csrf":")([^"]+)` 提取分组 1；
- 在 Session Handling Rule 中启用该 Macro，限定仅对目标站点生效。

> 配置完成后，所有 Intruder 攻击载荷在发送前会自动执行 Macro，刷新 Token，从而避免 401 或 "Invalid CSRF" 的误报。

### 1.3 命令示例：使用 Burp 内置正则提取器

```
响应片段示例：
<input type="hidden" name="csrf_token" value="a1b2c3d4e5f6">

Burp Macro Extract 正则：
name="csrf_token" value="([^"]+)"

提取分组：1
```

## 2. Turbo Intruder 与并发攻击

Turbo Intruder 是 Burp 官方推出的高性能并发攻击插件，相比标准 Intruder 支持 HTTP/2、百万级请求、以及自定义 Python 脚本。适合用来做**竞争条件**、**短信轰炸**、**优惠券并发扣减**等场景。

### 2.1 基础使用

```python
# Turbo Intruder Python 模板 —— 并发 100 条请求
def queueRequests(target, wordlists):
    engine = RequestEngine(endpoint=target.endpoint,
                           concurrentConnections=100,
                           requestsPerConnection=100,
                           pipeline=True,
                           engine=Engine.BURP2)
    for userId in range(100000, 110000):
        engine.queue(target.req, str(userId))

def handleResponse(req, interesting):
    if interesting:
        table.add(req)
```

### 2.2 关键参数

| 参数 | 含义 | 推荐值（攻击端稳定） |
|------|------|------|
| `concurrentConnections` | 并发连接数 | 50 ~ 200 |
| `requestsPerConnection` | 每条连接复用次数 | 100 |
| `pipeline` | 是否启用 HTTP 管道 | `True` |
| `engine=Engine.BURP2` | 使用 HTTP/2 引擎 | 视目标支持而定 |

### 2.3 实战：竞争条件（双花）

在支付/优惠券接口中，同时发送 100 条使用同一优惠券的请求：

1. 捕获目标请求（如 `POST /api/coupon/apply`）；
2. 右键发送到 Turbo Intruder，参数 `couponCode` 作为 payload 位置；
3. 使用 `range(1, 101)` 作为 payload；
4. 观察响应中 `status=success` 的次数是否 **大于 1**。若大于 1，则存在并发竞争条件。

## 3. Montoya API 插件开发入门

Burp Suite 自 2022 起全面切换到 **Montoya API**，相比旧版 Extender API，使用体验更加现代、类型安全。以下是一个最小可用的被动扫描插件骨架，用于在响应中检测 Git 泄漏关键字。

```java
// Burp Montoya 插件骨架（伪代码）
import burp.api.montoya.MontoyaApi;
import burp.api.montoya.BurpExtension;
import burp.api.montoya.proxy.http.*;

public class GitLeakDetector implements BurpExtension, ProxyResponseHandler {
    private MontoyaApi api;

    @Override
    public void initialize(MontoyaApi api) {
        this.api = api;
        api.extension().setName("GitLeak Detector");
        api.proxy().registerResponseHandler(this);
    }

    @Override
    public ResponseReceivedAction handleResponseReceived(InterceptedResponse response) {
        String body = response.response().bodyToString();
        if (body.contains("ref: refs/heads/main") || body.contains("GIT_DIR")) {
            api.logging().logToOutput("[!] Possible .git leak at: " + response.initiatingRequest().url());
        }
        return ResponseReceivedAction.continueWith(response);
    }
}
```

### 3.1 插件打包发布

```bash
# Gradle 构建 fatJar（自包含 jar）
./gradlew shadowJar
# 输出：build/libs/gitleak-detector-1.0-all.jar
```

然后在 Burp `Extensions → Installed → Add` 中导入 jar 文件即可。常用的插件还包括 **Logger++**（查看全部日志）、**JWT Editor**（JWT 签名伪造）、**InQL**（GraphQL Introspection）、**403 Bypasser**（权限绕过）、**Request Smuggler**（HTTP 请求走私）等，可直接在 **BApp Store** 中搜索安装。

## 4. 主动与被动扫描器深度定制

默认的 Burp Scanner 已经足够强大，但针对特殊的鉴权体系（如自定义 HMAC 签名、双重 Token），需要结合 **Insertion Point** 和 **Session Rules** 做二次开发。

### 4.1 自定义 Insertion Point

当目标的请求体是 JSON 嵌套结构（如 `{"data":{"userId":123}}`），默认扫描器可能只扫描表层字段。此时可以：

1. 在 Repeater 中右键 `Insertion point types → JSON`；
2. 指定扫描 `$.data.userId`、`$.data.userName` 等深层字段；
3. 对这些位置运行 **Active scan → selected insertion points**。

### 4.2 自定义扫描检查（通过插件）

Montoya API 中的 `Scanner.registerScanCheck()` 可以注册自定义的被动扫描器。例如，检测响应中是否包含 `-----BEGIN RSA PRIVATE KEY-----`、`accessKeyId`、`AKIA` 等敏感关键字，一旦命中就通过 `AuditIssue` 上报到 Scanner 视图。

### 4.3 误报控制

- 在 `Settings → Scan` 中将 **Audit Checks** 按照风险等级分档；
- 对某些高危但误报率高的检查（如 **File Path Manipulation**、**SQL Injection - Original**）可设为 "Passive only"；
- 使用 `Live Passive Scan` 代理所有历史流量，边浏览边做被动扫描。

## 5. HTTP/2 与请求走私

Burp 自 2021.9 起原生支持 HTTP/2，并且在 Repeater 左上角可一键切换 `HTTP/1` / `HTTP/2`。HTTP/2 带来了 **二进制分帧**、**头部压缩**、**多路复用** 等特性，但也引入了 **H2.CL**、**H2.TE**、**H2.Tunneling** 等新的请求走私向量。

测试思路：

```
H2.TE 测试（在 HTTP/2 下伪造 Transfer-Encoding）

:method       POST
:path         /api/ping
:authority    target.com
content-type  application/x-www-form-urlencoded
transfer-encoding  chunked

5
hello
0

```

如果目标的反向代理（如 Nginx 旧版本）将 HTTP/2 转成 HTTP/1 转发给后端时，会优先读取 `Transfer-Encoding`，从而造成请求体解析不一致，形成 **TE.CL** 走私。

## 6. 实战综合案例：绕过签名的 Web API 扫描

某目标的所有 API 要求请求头 `X-Sign=md5(path+body+key)`：

1. 先用 Session Handling Rule 写一个 Macro 调用本地 Python 脚本计算签名；
2. 再用 Montoya 插件监听 `RequestHandler`，对每个即将发出的请求动态添加 `X-Sign`；
3. Scanner / Intruder 正常运行；所有发出的请求会自动带上合法签名。

```bash
# 本地签名脚本 sign.py
import sys, hashlib
path, body, key = sys.argv[1], sys.argv[2], sys.argv[3]
print(hashlib.md5((path+body+key).encode()).hexdigest())
```

在 Burp 中通过 Macro 执行 `python3 sign.py {path} {body} secret123` 即可得到签名，再将结果注入到 `X-Sign` 请求头。

## 7. 总结与进一步学习

Burp Suite 的真正威力在于 **"组合能力"**：Session Handling + Intruder + 自定义插件 + 被动扫描器 可以应对几乎所有 Web 目标。建议进阶路线：

1. 掌握 Montoya API 写 3 个以上插件（GitLeak / JWT伪造 / 自定义签名计算）；
2. 熟练使用 Turbo Intruder 做并发与竞争条件测试；
3. 阅读 BApp Store 中高星插件源码（如 **Logger++**、**Retire.js**）学习设计模式；
4. 结合 **OWASP ZAP** / **Xray** / **Nuclei** 形成完整工具链。
