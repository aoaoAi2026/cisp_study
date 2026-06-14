# 敏感信息泄露排查实战

> **📘 文档定位**：CISP 考试安全运维与审计内容 | 难度：⭐⭐⭐ | 预计阅读：20 分钟
> 敏感信息泄露是数据安全的第一道防线失守。本文从信息分类、代码扫描、Web 泄露路径到日志脱敏，系统梳理敏感信息泄露的排查与治理。

---

## 导航目录
- [一、敏感信息分类与常见形态](#一敏感信息分类与常见形态)
- [二、源代码中搜索敏感信息 (grep / ripgrep)](#二源代码中搜索敏感信息-grep--ripgrep)
- [三、自动化扫描工具](#三自动化扫描工具)
- [四、Web 应用中信息泄露的常见漏洞](#四web-应用中信息泄露的常见漏洞)
- [五、数据库 / 文件系统中的敏感数据](#五数据库--文件系统中的敏感数据)
- [六、日志脱敏规范](#六日志脱敏规范)
- [七、容器 / 配置中心 / 环境变量](#七容器--配置中心--环境变量)
- [八、合规视角 (GDPR / PIPL / 等保)](#八合规视角-gdpr--pipl--等保)
- [九、CheckList](#九checklist)
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

## 一、敏感信息分类与常见形态

| 类别 | 典型信息 | 风险等级 |
|------|---------|---------|
| **认证凭据** | 密码 / API Key / AccessKey / SecretKey / Token / OAuth Client Secret | 严重 |
| **数据库连接** | DB username:password@host:port, Redis/ES/Mongo URI | 严重 |
| **TLS / SSH 私钥** | `-----BEGIN RSA PRIVATE KEY-----` / id_rsa / .p12 / .pfx | 严重 |
| **内部 URL / IP** | 内网 IP 段、管理后台地址、监控面板、测试环境 | 高 |
| **个人信息 (PII)** | 身份证号、手机号、邮箱、住址、银行卡号 | 高 |
| **支付信息** | 银行卡完整号 / CVV / 支付密码 hash | 严重 |
| **日志泄漏** | 错误日志含 SQL、账号、堆栈、请求参数 | 高 |
| **备份文件** | `www.zip` / `app.zip` / `dump.sql` / `.git` | 严重 |
| **配置文件** | `.env` / `.env.local` / `config.ini` / `application-prod.yml` | 高 |
| **注释 / TODO** | 代码注释中包含"密码"、"内网地址"、"临时调试 token" | 中 |
| **Cookie / JWT** | `HttpOnly=false` / 硬编码 `secret` / 可伪造签名 | 高 |
| **源代码版本控制** | `.git` / `.svn` / `.hg` 目录可直接下载还原源码 | 严重 |

## 二、源代码中搜索敏感信息 (grep / ripgrep)

```bash
# 1. 基础关键字 (Python/PHP/Node.js/Java/.NET 通用)
grep -rnE "(password|passwd|pwd|secret|token|apikey|api_key|private[_ ]?key|access[_ ]?key|ak/sk|accessToken|refreshToken)" src/ | grep -v "test\|mock\|example"

# 2. 硬编码 AK/SK 前缀 (各云厂商 + 第三方)
grep -rnE "(AKIA|ASIA|LTAI|AIza|ghp_|xoxb-|xoxa-|xoxp-|slack_token|SQ0csp|q5C|rk_live|pk_live|pk_test|rk_test|eyJ)" src/

# 3. 私钥 / PEM 格式
grep -rnE "BEGIN (RSA |EC |DSA |OPENSSH |PGP |)PRIVATE KEY" src/
grep -rnE "BEGIN CERTIFICATE" src/

# 4. URL 中的账号密码 (jdbc / redis:// / mongodb://)
grep -rnE "(jdbc:mysql|jdbc:postgresql|mongodb://|redis://|postgres://)[^\s]*:[^\s]+@" src/

# 5. .env / config 文件中明显的高敏感值
#    APP_SECRET=xxx / DB_PASS=xxx / AWS_SECRET=xxx
```

## 三、自动化扫描工具

```bash
# 1. gitleaks (Git 历史 + 当前代码)
gitleaks detect --source ./my-repo --verbose   # 扫描当前代码
gitleaks protect                                # 作为 pre-commit 阻断提交

# 2. trufflehog (包含"凭据有效性验证", 可检测 AWS AK 是否真的可用)
trufflehog filesystem ./my-repo --no-update
trufflehog git https://github.com/owner/repo   # 扫描 GitHub 仓库

# 3. detect-secrets (Yelp 开源, 配合 pre-commit)
detect-secrets scan src/ > .secrets.baseline
detect-secrets audit .secrets.baseline         # 人工复核 false-positive

# 4. Semgrep p/secrets
semgrep --config p/secrets src/

# 5. pre-commit hooks (必须在开发阶段阻断)
#    - .pre-commit-config.yaml 中加入 gitleaks / detect-secrets
#    - CI (GitHub Actions / GitLab CI) 中再跑一次作为第二道防线
```

## 四、Web 应用中信息泄露的常见漏洞

### 4.1 Git 源码泄露

```bash
# 1. 探测
#    GET /.git/HEAD → ref: refs/heads/master
#    GET /.git/config → [remote "origin"] url = ...

# 2. 工具
#    - GitHack: python GitHack.py http://target.com/.git/
#    - dvcs-ripper: rip-git.pl -v -u http://target.com/.git/
#    - GitDumper / scrabble (重构整个仓库)

# 3. 修复
#    - 不要把 .git 目录放进 Web 根目录; 若不可避免, Nginx 禁止访问:
location ~ /\.git { deny all; }
#    - 使用 .gitignore + git clean
#    - 不要把敏感文件 (哪怕一次) commit 进仓库 (使用 git-secret / git-crypt)
```

### 4.2 .env / 配置文件泄露

```
GET /.env
GET /.env.local
GET /config.php.bak
GET /config.ini
GET /www.zip / /backup.zip / /db.zip / /phpinfo.php
GET /app_dev.php (Symfony 旧版本调试入口)
GET /nginx_status
GET /server-status (Apache)
GET /phpmyadmin / /pma
```

### 4.3 错误页面 / 堆栈泄漏

```
典型:
  - Spring Boot Whitelabel Error Page 打印堆栈
  - Django Debug 页面显示 SQL/参数/版本
  - ASP.NET Yellow screen of death (YSOD)
  - PHP display_errors=On
  - JavaScript 异常堆栈泄漏内部域名
```

### 4.4 JWT / Cookie 弱配置

```jwt
// 典型弱 JWT
HEADER: { "alg": "none" }           // 可绕过签名校验
PAYLOAD:
{
  "sub": "1001",
  "name": "Admin User",
  "admin": true,
  "iat": 1516239022
}
// SECRET: 123456 (弱密码, 可被 hashcat 爆破 HS256)
```

### 4.5 JS 前端 map 文件 / SourceMap

```
# 生产残留 source map:
GET /static/js/main.abc123.js.map
# 可通过 reverse-sourcemap 还原源码
npm install -g reverse-sourcemap
reverse-sourcemap --output-dir ./src main.abc123.js.map
```

### 4.6 调试接口 / Spring Actuator

```
GET /actuator
GET /actuator/env              → 打印 Spring Environment (含 DB 密码 / secret)
GET /actuator/heapdump         → 下载 heap dump, 离线提取密钥
GET /actuator/httptrace        → 最近请求 (cookie/token)
GET /actuator/jolokia          → JMX over HTTP (可 RCE)
GET /debug/vars (Go expvar)
GET /internal/metrics (Prometheus 暴露路径)
```

## 五、数据库 / 文件系统中的敏感数据

| 目标 | 风险 | 修复 |
|------|------|------|
| `users.password` 明文 | 拖库后直接使用 | 切换为 bcrypt/Argon2id/ scrypt, 不存储明文 |
| `users.phone` 明文 | 可被批量用于社工 | 加盐 hash 或字段级加密 |
| 日志中打印 token / password | 日志被窃取即凭据泄露 | `logging.filter` 中 mask 敏感字段 |
| 数据库备份文件未加密 | 备份文件被下载即拖库 | AGE / GPG 加密备份; 限制备份桶权限 |
| 图片 EXIF 元数据 | 用户上传的照片含 GPS/设备信息 | 上传前清除 EXIF (`exiftool -all=`) |

## 六、日志脱敏规范

```
# 推荐日志脱敏规则
#   - 手机号:    138****1234
#   - 身份证号:  110101********1234
#   - 邮箱:      s***@example.com
#   - 银行卡号:  6222************1234
#   - 密码字段:  永远不记录 (mask)
#   - 会话 Cookie / Authorization Header:  只记录 hash 或 truncate

# 示例 (Java Slf4j 模式):
<pattern>
  %d{ISO8601} %-5level %logger{36} - %replace(%msg){'(password=|pwd=|token=|Authorization: Bearer )[\w-]+', '$1***'}%n
</pattern>

# 示例 (Elasticsearch / Logstash 字段级):
filter {
  mutate { gsub => ["message", "1[3-9]\d{9}", "1*******",
                      "message", "(\d{6})\d{8}(\d{4})", "\1********\2"] }
}
```

## 七、容器 / 配置中心 / 环境变量

| 场景 | 风险 | 正确姿势 |
|------|------|---------|
| `docker inspect` 可查看环境变量 | Docker exec / docker-compose config 中可见 | 避免 `environment: DB_PASS=xxx`; 改用 Docker secrets / Kubernetes secrets |
| `kubectl describe pod` 暴露 env | CI/CD 输出打印 env | `envFrom[secretRef]` + Vault / KMS |
| 云实例 user-data / cloud-init 含密钥 | CloudTrail / 控制台可见 | 改用 IAM role / workload identity, 不存密钥 |
| CI 日志中暴露 `$AWS_SECRET_ACCESS_KEY` | 公开 PR 日志 | Mask secrets (GitHub Actions `::add-mask::`) |

## 八、合规视角 (GDPR / PIPL / 等保)

- **个人信息最小化**: 不收集非必须信息; 收集了就加密, 且有过期/删除机制
- **数据分级**: 公开/内部/秘密/机密, 每级加密/权限策略不同
- **访问留痕**: 敏感数据列的 SELECT/UPDATE 必须审计, 谁什么时候读了哪条
- **跨境传输**: 按法律做安全评估 / 标准合同条款 (SCC)
- **用户权利**: 提供"查询/更正/删除/导出"入口 (PIPL 要求 15 工作日响应)

## 九、CheckList

- [ ] pre-commit + CI 跑 gitleaks / trufflehog / detect-secrets, 发现密钥立即阻断提交
- [ ] `.git` / `.svn` / `.hg` / `.env` / `.DS_Store` 等敏感路径在生产 Nginx 中全部 `deny all`
- [ ] 生产 `display_errors=Off` / `DEBUG=False` / `include stacktrace=False`
- [ ] Spring Actuator 只开放 health/info, 其他 endpoint 需鉴权 + 内网白名单; 关闭 Jolokia
- [ ] 生产 JS 去除 source map, 或把 .map 文件放到内网
- [ ] 数据库账号信息从环境变量/Vault/KMS 获取, 不硬编码到代码仓库
- [ ] 日志中 phone/email/password/card/token 全部脱敏
- [ ] 数据库 `password` 列使用 bcrypt/Argon2id/scrypt, 不存明文或弱 hash (MD5/SHA1)
- [ ] 用户上传文件前清除 EXIF; 服务器端禁止执行上传目录
- [ ] 所有外部服务 (API/DB/Redis/MQ) 的密钥按季度轮换
- [ ] 配置中心 (Nacos/Apollo/Vault) 的访问权限收敛, 仅业务账号只读其命名空间
- [ ] 代码库的历史 commit 中若有密钥, 必须 BFG / git-filter-repo 清洗, 并立即轮换密钥
- [ ] 建立"信息泄露事件响应"SOP: 发现 → 轮换 → 审计影响面 → 整改

---

## 十、高分考点与知识巧记

> 🔑 **高分考点**：敏感信息泄露考点集中在信息分类、扫描工具、Web 泄露路径、合规要求。Git 泄露、Actuator 暴露、日志脱敏是三大高频场景。

| 考点 | 频次 | 核心记忆点 |
|:---|:---:|:---|
| 敏感信息分类 | ⭐⭐⭐⭐ | 认证凭据 > 数据库连接 > 私钥 > PII > 支付信息 |
| 扫描工具 | ⭐⭐⭐⭐ | gitleaks(历史+当前)、trufflehog(有效性验证)、detect-secrets(pre-commit) |
| Web 泄露路径 | ⭐⭐⭐⭐⭐ | .git 源码、.env 配置、Actuator、source map、错误页面 |
| 日志脱敏 | ⭐⭐⭐ | 手机号/身份证/邮箱/密码/token 全部 mask |
| 合规要求 | ⭐⭐⭐ | 最小化收集、加密存储、访问留痕、用户权利 |

> 💡 **知识巧记**：Web 泄露六路径记"Git 源 Env 配 Actuator 暴 Map 反编 Error 泄"——.git 源码泄露、.env 配置文件、Actuator 端点暴露、source map 反编译、错误页面堆栈。扫描三剑客：gitleaks 扫历史、trufflehog 验有效性、detect-secrets 做基线。

### 高分考点速查表

| 考察维度 | 关键结论 | 常见干扰项 |
|:---|:---|:---|
| .git 泄露 | .git/HEAD 可访问，GitHack/dvcs-ripper 还原源码 | "删除 .git 文件夹即可" ❌ |
| Actuator 安全 | 生产只保留 health/info，env 含密钥 | "Actuator 默认配置安全" ❌ |
| source map | 可还原混淆代码，生产不应暴露 | "source map 不含敏感信息" ❌ |
| 日志脱敏 | 密码字段永远不记录，手机/身份证掩码 | "日志脱敏影响排错" ❌ |
| pre-commit | gitleaks 阻断敏感数据入库 | "CI 阶段扫描就够了" ❌ |

### 知识巧记口诀

> **敏感信息泄露排查口诀**：
> 认证凭据私钥为首，gitleaks 历史当前搜。
> .git .env Actuator 暴，source map 错误页面漏。
> 日志脱敏五字段，手机证号邮卡密全遮。
> pre-commit 阻断入库，发现泄露轮换审计改。
