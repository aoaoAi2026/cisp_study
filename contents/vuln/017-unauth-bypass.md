# 未授权访问与认证绕过

## 1. 漏洞概述

未授权访问（Unauthorized Access）是指系统某个接口 / 管理面板 / 数据库服务 / 调试控制台没有任何鉴权或鉴权可被绕过，攻击者可直接读取或操作敏感数据。认证绕过（Authentication Bypass）则是通过篡改请求让系统把攻击者识别为已认证用户，或让鉴权判断逻辑失效。

| 场景 | 表现 | 危害 |
|------|------|------|
| 管理后台无鉴权 | `/admin/index.html` 直接访问即可进入 | 全站接管 |
| Redis / ES 未绑定密码 | TCP 可连 + 默认空密码 | 数据泄露 / RCE |
| JWT 签名伪造 | 使用 `none` 算法 / 弱密钥暴力破解 | 登录任意账号 |
| 调试接口暴露 | `/actuator/env`、`/console`、`/phpinfo.php` | 泄漏配置 / 源码 |
| 短信验证码绕过 | 无速率限制 / 码值回显 / 任意码通用 | 账号接管 |

## 2. 常见未授权访问资产

### 2.1 Web 管理面板 / 接口

```
/admin              # 管理后台
/phpmyadmin         # 数据库管理
/jenkins            # CI/CD
/swagger-ui.html    # 接口文档（可能暴露测试接口）
/actuator           # Spring Boot Actuator
/console            # Flask Werkzeug / H2 Database Console
/.git/config        # Git 仓库源码泄露
/.DS_Store          # 目录结构泄露
/backup.zip         # 备份包
```

### 2.2 数据库 / 缓存 / 消息队列

| 服务 | 默认端口 | 典型未授权条件 |
|------|---------|---------------|
| Redis | 6379 | 默认无密码，默认绑定 0.0.0.0 |
| MongoDB | 27017 | 老版本默认无鉴权 |
| Elasticsearch | 9200 | 默认无鉴权，REST 接口暴露 |
| Memcached | 11211 | 默认无鉴权，UDP 可放大攻击 |
| Zookeeper | 2181 | 默认无鉴权，可读取节点信息 |
| Kafka | 9092 | `allow.everyone.if.no.acl.found=true` |
| CouchDB | 5984 | 旧版本默认无鉴权，有 `/_users` / `/_all_dbs` |
| Docker API | 2375 | 默认无鉴权，可直接创建容器 → RCE |
| SMB | 445 | 匿名访问 `net use \\IP` |
| NFS | 2049 | `showmount -e IP` 暴露共享路径 |
| Rsync | 873 | 匿名拉取 / 推送模块 |

### 2.3 识别工具

```bash
# 端口扫描 + 指纹识别
masscan 10.0.0.0/8 -p 6379,27017,9200,2375,8080,7001
nmap -sV -T4 target

# 指纹框架识别
nuclei -u http://target -t ~/nuclei-templates/
whatweb http://target

# Redis 未授权
redis-cli -h target ping    # 若返回 PONG 则未授权

# ES 未授权
curl http://target:9200/_cat/indices

# Docker 未授权
docker -H tcp://target:2375 ps
```

## 3. JWT 安全问题

### 3.1 常见缺陷

| 缺陷 | 描述 | 利用 |
|------|------|------|
| none 算法 | 将 header `alg` 改为 `none`，空签名 | `eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VyIjoiYWRtaW4ifQ.` |
| 密钥可暴力 | `HS256` 使用弱密码 | `jwt_tool -t URL -rc "session=JWT" -C` |
| 密钥硬编码泄露 | `/public_key.pem` 泄漏公钥后伪造 `RS256` | 使用公钥转 `HS256` / 直接用私钥签名 |
| 未校验 `exp` | 旧 token 可永久使用 | 保存 token 长期使用 |
| `kid` 参数 LFI | `{"alg":"HS256","kid":"/etc/passwd"}` | 拼接 `../../../../` 读取密钥 |

### 3.2 工具

```bash
# jwt_tool：扫描 / 爆破 / 伪造
python3 jwt_tool.py "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -C -w wordlist.txt

# 在线：jwt.io 可手工修改 payload 再用弱密钥重签
# 命令行伪造：
pip install pyjwt
python3 -c "import jwt;print(jwt.encode({'user':'admin'}, key='', algorithm='none'))"
```

## 4. OAuth / SSO 常见绕过

1. **回调劫持 `redirect_uri`**：白名单不严谨，使用 `evil.com` / `good.com.evil.com` / URL 解析差异劫持授权码
2. **Implicit Flow 误用**：`response_type=token`，token 落入浏览器历史 / Referer / URL 日志
3. **`state` 参数缺失**：CSRF 攻击，攻击者先绑定自己账号，再让受害者使用同一授权码
4. **`code` 泄露**：日志 / Referer / 302 URL 中暴露，可被兑换 token
5. **开放注册 / 任意邮箱**：使用对手公司邮箱注册 → 登录后在站内获取其权限资源

## 5. Session 与 Cookie 绕过

1. **Session 固定**：登录前给受害者植入攻击者已知 SessionID，登录后该 SessionID 升级为已登录
2. **Cookie 可预测**：Session ID 使用时间戳 / 自增 / 短随机数
3. **HttpOnly 缺失**：XSS 下可读取 Session Cookie
4. **Domain 过宽**：`Set-Cookie session=xx; domain=.example.com` 影响子域，配合子域 XSS 即可拿主站会话
5. **CSRF Token 缺失**：配合受害者登录态构造页面即可执行状态变更操作

## 6. 验证码 / 安全问题绕过

| 问题 | 绕过思路 |
|------|---------|
| 图形验证码可预测 | 验证码 seed 基于时间戳 / 可重放 |
| 图形验证码简单 | OCR 工具（ddddocr / tesseract）批量识别 |
| 短信验证码不限速 | Burp Intruder 暴力 4 位数字 |
| 短信验证码回显 | 在 API 响应体中直接返回验证码 |
| 验证码无会话绑定 | 获取到 1111 后在任何账户的登录请求中都能使用 |
| 验证码可复用 | 同一验证码未失效，可反复使用 |

## 7. 修复建议

1. **统一认证中间件**：默认所有接口需要认证，白名单接口显式放行（如 `/login`、`/healthz`）。
2. **服务默认鉴权**：Redis、ES、MongoDB、Kafka、Zookeeper 必须设置密码 / ACL；绑定 `127.0.0.1` 或内网 VPC。
3. **JWT 安全**：使用 `RS256` / `ES256` 非对称密钥；严格校验 `exp`、`iss`、`aud`；禁用 `none`；密钥足够随机。
4. **安全配置检查**：生产环境关闭 Actuator / Swagger / Debug Console / `phpinfo` 等调试接口。
5. **速率限制与失败冻结**：登录、短信、验证码、注册等接口强制速率限制；多次失败后冻结。
6. **密码策略**：至少 8 位、复杂度要求、定期轮换；多因素认证（MFA）。
7. **日志与告警**：对登录失败、未授权访问、高权限操作等事件集中采集并告警。
