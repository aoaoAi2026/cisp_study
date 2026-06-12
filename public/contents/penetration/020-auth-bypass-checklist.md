# 鉴权绕过与未授权访问测试清单

> "未授权访问"与"鉴权绕过"是 Web 安全中最常见、也是最容易被忽视的高危风险。本文整理了一套可直接落地的测试清单，覆盖前端控制、越权访问、Session/Cookie、Token、SSO、路径穿越、以及常见中间件未授权访问。

## 1. 核心概念

- **鉴权（Authentication）**：判断「你是谁」（登录、Token、证书）
- **授权（Authorization）**：判断「你能不能做这件事」（角色、权限、数据范围）
- **越权访问（Broken Access Control）**：能访问他人的数据或他人的功能
  - **水平越权**：同等角色下访问他人数据（IDOR：`?userId=1001 → ?userId=1002`）
  - **垂直越权**：普通用户访问管理员功能（`/admin`、`/api/v1/admin/*`）
- **未授权访问**：完全不需要鉴权就能访问敏感功能或数据（如未密码的 Redis、Jenkins）

## 2. 前端控制绕过

### 2.1 常见手法

| 手法 | 说明 |
|------|------|
| **直接访问 URL** | `https://target.com/#/admin` 前端拦截 403，实际接口 `/api/admin/user` 可能未拦截 |
| **修改响应** | 登录响应 `{"role":"user"}` → 改造成 `{"role":"admin","success":true}` 让前端放行 |
| **JS 爆破路由** | 前端 SPA 的 `router.js` 里常包含完整路由表，直接 grep 出 `/admin`、`/settings` 等 |
| **禁用 JS** | 看服务端是否在无 JS 情况下仍然返回数据 |
| **F12 改 DOM** | 隐藏按钮改 `display:block`，disabled 属性删掉 |

### 2.2 实战步骤

```
1. 正常登录后抓包，记录所有 /api/** 路径；
2. 退出登录，用新的 clean session，不带 Cookie / Token 重新请求这些接口；
3. 观察是否仍然 200 OK + 数据返回；
4. 对每个接口尝试：GET/POST/PUT/DELETE/PATCH/OPTIONS 切换；
5. 对 /admin/ 路径尝试：/admin/../api/user、/aDmIn、/%61dmin 等。
```

## 3. 水平越权（IDOR）测试清单

### 3.1 典型参数位置

```
?userId=1001
?orderId=ORD202401001
?customerId=C0001
/profile/1001
/api/v1/order/detail/2024001
POST body: {"uid":1001}
POST body: <user><id>1001</id></user>
JSON Web Token Payload: {"sub":"user1001"}
Cookie: userid=1001
```

### 3.2 测试方法

- **递增/递减 ID**：`1001 → 1002 → 1003`；
- **GUID / UUID**：看是否在某个接口能列出所有用户 ID（`/api/users`、`/search`、`/timeline`）；
- **随机 ID**：用已有 ID + Burp Intruder 跑 payload；
- **负值 / 0 / 空**：`userId=0`、`userId=-1`、`userId=""` 可能触发特殊逻辑分支；
- **参数污染**：`?userId=1001&userId=1002` 后端可能取第二个；
- **替换请求体字段**：`POST /api/pay {"uid":1001, "targetUid":1002}` → 把 1001 的钱转给 1002；
- **跨接口 IDOR**：A 接口返回订单列表，B 接口 `GET /api/order/{id}` 可以遍历所有订单。

### 3.3 经典案例

```
GET /api/v1/account/detail?uid=1001        200 OK → 返回自己的余额
GET /api/v1/account/detail?uid=1002        200 OK → 返回他人余额  →  水平越权
```

## 4. 垂直越权测试清单

- 普通用户访问管理员路径：`/admin`、`/manage`、`/console`、`/api/v1/admin/**`
- 测试 HTTP 方法：`GET /admin` 403 → `POST /admin`、`PUT /admin`、`OPTIONS /admin`、`DELETE /admin/x`
- 修改 role 参数：`POST /login` 返回 `{"role":"user"}` → 伪造 `{"role":"admin"}`
- 低权限 Token 请求高权限接口：`Bearer user-token` 请求 `/api/admin/users`
- 可预测的 admin path：`/admin/login`、`/admin.html`、`/admin123`、`/backend`、`/system`
- 中间件默认路径：`/actuator`、`/console`、`/h2-console`、`/swagger-ui`、`/wp-admin`

## 5. Session / Cookie 伪造

### 5.1 可预测 Session ID

- `sessionid=1001`、`PHPSESSID=abc1` → 尝试递增；
- `token=2024010100001` → 基于时间戳生成；
- `jwt=...` → 检查签名 / 算法 / secret。

### 5.2 Cookie 关键属性

```
Set-Cookie: sessionId=xxx; HttpOnly; Secure; SameSite=Strict
```

| 缺失属性 | 影响 |
|----------|------|
| **HttpOnly** | XSS 可以通过 `document.cookie` 读取 session |
| **Secure** | HTTP 场景下 Cookie 可能被明文窃取 |
| **SameSite=None** | 容易被 CSRF 利用 |
| **Path 过宽** | 同域不同应用间可能共享敏感 Cookie |

### 5.3 Session 未销毁

- 退出登录后 Cookie 是否仍有效；
- 修改密码后旧 Session 是否失效；
- 多端登录是否同时失效；
- "记住我"Token 是否可预测。

## 6. JWT / Token 攻击

详见《API 接口渗透测试》一文，这里列出绕过清单：

- [ ] `alg: none` 无算法；
- [ ] 弱密钥爆破（HS256）；
- [ ] `RS256 → HS256` 算法混淆；
- [ ] `kid`、`jku`、`x5u` 参数注入；
- [ ] `exp`、`nbf` 未校验；
- [ ] `iss`、`aud` 未校验；
- [ ] 签名完全不校验；
- [ ] `cve` / `cty`、`typ` 缺失导致解析差异。

## 7. SSO / OAuth2 绕过

### 7.1 OAuth2 常见缺陷

| 问题 | 说明 |
|------|------|
| **redirect_uri 未白名单** | `redirect_uri=https://evil.com/cb` 泄漏 code |
| **state / nonce 缺失** | CSRF 绑定受害者账号到攻击者账号 |
| **PKCE 缺失 + code 泄漏** | 移动端 App 授权码被中间人窃取后可换 token |
| **code 可重复使用** | 一个 code 被多次使用获取 token |
| **scope 过大** | 第三方应用可以获取 `email` / `profile` / `openid` 之外范围 |
| **implicit flow** | token 直接出现在 URL `#` 之后，容易泄漏 |
| **token 绑定缺失** | 攻击者的 access_token 可以用于受害者的 client_id |

### 7.2 SSO 登录绕过典型 Payload

```
# 构造自己的 redirect_uri（通配符白名单）
https://sso.target.com/oauth/authorize?
  response_type=code&
  client_id=abc&
  redirect_uri=https://target.com.evil.com/cb&
  state=xyz
```

## 8. 路径穿越与目录遍历

- `?file=../../etc/passwd`
- `?path=..%2f..%2fetc%2fpasswd`
- `?file=..%5c..%5cwindows%5cwin.ini`（Windows `\`）
- `?file=%252e%252e%252fetc%252fpasswd`（双编码）
- `?file=....//....//etc/passwd`（`....//` 编码绕过）
- Spring Actuator 路径：`/actuator`、`/actuator/env`、`/actuator/heapdump`、`/actuator/trace`

## 9. 常见组件与面板未授权访问清单

这是实战中最值得跑的一份清单，强烈建议每次测试都用 Nuclei / 手动扫一遍：

| 组件 | 默认路径 | 风险 |
|------|----------|------|
| **Jenkins** | `/`、`/script`、`/manage` | RCE via Groovy script |
| **Druid Monitor** | `/druid/` | SQL 监控、Session、请求详情泄漏 |
| **Spring Boot Actuator** | `/actuator`、`/actuator/env`、`/actuator/heapdump` | environment、heapdump 泄漏明文密码 |
| **Swagger / OpenAPI** | `/swagger-ui.html`、`/v2/api-docs`、`/openapi.json` | 接口定义泄漏 |
| **Kibana** | `/app/kibana` | 日志/数据查询 |
| **Grafana** | `/login`（默认 admin/admin） | 图表+数据源 |
| **Consul** | `/ui`、`/v1/kv/` | 配置泄漏 |
| **Nacos** | `/nacos`（默认 nacos/nacos） | 配置中心 + 注册中心 |
| **Eureka** | `/` | 服务列表泄漏 |
| **Redis** | TCP 6379，无密码 | `INFO`、`KEYS *`、`CONFIG GET dir` |
| **MongoDB** | TCP 27017 | 未鉴权直接访问 |
| **ElasticSearch** | TCP 9200 | 数据读写 |
| **Jupyter Notebook** | `/tree`、`/notebooks` | 命令执行 |
| **Solr** | `/solr/admin/` | 未授权访问+RCE（某些版本） |
| **H2 Console** | `/h2-console` | JDBC RCE |
| **Prometheus** | `/prometheus`、`/metrics` | 指标泄漏 |
| **GitLab CI / Jenkins / Drone** | `/admin`、`/api/v4/admin/users` | 管理后台 |
| **Node-RED** | `/` | 可视化节点编辑→RCE |
| **phpMyAdmin** | `/phpmyadmin/`、`/pma/` | 弱口令 → 数据库控制 |
| **WordPress** | `/wp-admin/` | 后台弱口令 |
| **MinIO / S3 浏览器** | `/minio/login` | 文件读写 |
| **Harbor / Registry** | `/v2/_catalog` | 镜像列表泄漏 |
| **Zookeeper** | TCP 2181 | `ruok`、`dump` |
| **Dubbo** | TCP 20880 | 未鉴权调用 |
| **Apollo / Nacos / Spring Cloud Config** | `/configfiles/json/application/default` | 配置泄漏 |
| **CouchDB** | `/_all_dbs` | 数据库列表 |
| **RabbitMQ** | `:15672`（默认 guest/guest） | 队列管理 |
| **Confluence / Jira** | `/` | 默认凭证 / CVE |

### 9.1 自动化检测命令（示例）

```bash
# 使用 Nuclei 批量扫描
nuclei -l targets.txt \
  -t ~/nuclei-templates/exposed-panels/ \
  -t ~/nuclei-templates/exposed-apis/ \
  -t ~/nuclei-templates/misconfiguration/ \
  -s high,critical,medium \
  -o nuclei-unauth.jsonl -j

# 手动探测 Spring Actuator（小字典）
for t in $(cat targets.txt); do
  for p in /actuator /actuator/env /actuator/heapdump /actuator/gateway/routes; do
    code=$(curl -sk -o /dev/null -w "%{http_code}" "$t$p" -m 5)
    echo "$code $t$p"
  done
done
```

## 10. CORS / CSRF 辅助绕过

- `Origin: evil.com` + `Access-Control-Allow-Origin: evil.com` + `Access-Control-Allow-Credentials: true` → 敏感数据被跨域读取；
- `Origin: null` → 某些后端把 `null` 当作可信 Origin；
- `Origin: target.com.evil.com` → 白名单匹配可能只看前缀/后缀；
- CSRF Token：值固定、值可预测、值在 Cookie 与 body 相同、值仅前端校验、删除 Token 也能通过；
- 没有 SameSite Cookie → 老版浏览器中容易被 CSRF 利用。

## 11. 综合检查清单（Checklist）

- [ ] 未登录能否访问用户信息接口？
- [ ] `?userId=1002` 能否看到他人数据？
- [ ] 普通用户能否调用 `/api/v1/admin/**`？
- [ ] JWT 是否支持 `alg: none`？secret 能否爆破？
- [ ] Cookie 是否带 `HttpOnly` / `Secure` / `SameSite`？
- [ ] 退出登录 / 修改密码后旧 Session 是否失效？
- [ ] `OPTIONS` / `POST` / `PUT` / `DELETE` 方法是否有独立鉴权？
- [ ] `%2e%2e%2f`、`..%5c`、`....//` 等路径编码是否被拦截？
- [ ] Spring Actuator / Druid / Jenkins / Kibana / Nacos / Swagger 等默认面板是否暴露？
- [ ] CORS 配置是否允许任意 Origin + 允许凭证？
- [ ] CSRF Token 是否存在且校验？是否仅前端校验？
- [ ] SSO / OAuth2 的 redirect_uri 是否白名单？state/nonce 是否缺失？
- [ ] 短信/邮箱/验证码接口是否存在未授权调用？
- [ ] 是否存在 `Content-Type: application/json;charset=utf-8` 被后端误当表单解析？

## 12. 防御建议（给甲方的修复参考）

1. **统一鉴权中间件**：所有敏感接口强制通过同一个 Gateway / Filter 做鉴权；
2. **数据范围校验**：不仅校验登录态，还要校验「这条数据是否属于当前用户」；
3. **默认拒绝**：除白名单接口外，所有接口默认需鉴权；
4. **最小权限**：给角色/用户最小必要权限；
5. **Session 安全**：HttpOnly + Secure + SameSite；登出/改密/多端登录失效；
6. **JWT 安全**：强算法、强密钥、校验 `exp` / `iss` / `aud` / `nbf`；
7. **Spring Actuator**：生产环境关闭敏感端点；至少加 Basic Auth + IP 白名单；
8. **面板组件**：Jenkins / Druid / Nacos 等默认密码全部修改；暴露在外网的面板必须强鉴权；
9. **定期扫描**：定期用自动化工具（Nuclei / Xray）做资产扫描；
10. **安全培训**：让开发团队了解 IDOR、越权、业务逻辑漏洞的原理。
