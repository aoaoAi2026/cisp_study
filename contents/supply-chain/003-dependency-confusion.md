# 依赖混淆与包管理器攻击实战防御

---

## 一、依赖混淆攻击原理

### 1.1 攻击模型

```
场景：
  公司内部使用名为 "internal-utils" 的私有包
  package.json 中依赖: "internal-utils": "^1.0.0"

攻击：
  攻击者在公共 npm 注册表上传同名包 "internal-utils"
  由于某些包管理器优先从公共源拉取 → 安装攻击者的恶意包

通用模式：
  ┌──────────────┐
  │ 私有包       │ ← 内部仓库 (private.internal-registry.com)
  │ my-lib v1.0  │
  └──────────────┘
         vs
  ┌──────────────┐
  │ 恶意包       │ ← 公共仓库 (registry.npmjs.org / pypi.org)
  │ my-lib v99.0 │   版本号极高 → 依赖解析优先选择
  └──────────────┘
```

### 1.2 变种攻击

```
1. 依懒混淆 (Dependency Confusion)
   同名包 × 高版本号 → 包管理器选择公共源高版本

2. 域名抢注 (Typosquatting)
   riptide → reqvest (o→e)
   django → dajngo (j位置错)
   lodash → lod4sh (a→4)
   安装时拼写错误 → 下载恶意包

3. 品牌劫持 (Brandjacking)
   伪装成知名包的镜像/增强版：
   lodash-pro / lodash-plus / lodash-ultimate

4. 命名空间劫持 (Namespace Confusion)
   @company/package → @c0mpany/package
   (利用Unicode字符或相似字符)

5. 组合攻击
   恶意包作为普通包的依赖项被间接引入
   例：event-stream 被恶意维护者添加 flatmap-stream 依赖
```

---

## 二、各语言生态风险

### 2.1 npm (Node.js)

```bash
# 风险场景
npm install              # 可能从公共源拉取
npm install --registry https://private-registry.com  # 未全局配置

# .npmrc 配置避免
# 方案1：scope绑定私有仓库
@mycompany:registry=https://npm.mycompany.com/

# 方案2：全局私有仓库代理
registry=https://npm.mycompany.com/

# 方案3：package.json 使用 scope
{
  "name": "@mycompany/my-app",
  "dependencies": {
    "@mycompany/internal-lib": "^1.0.0"
  }
}
# scope为@mycompany的包从私有仓库拉取，其他从公有源

# 扫描工具
npm audit
npm audit --audit-level=high
npx auditjs ossi
```

### 2.2 PyPI (Python)

```bash
# 风险场景
pip install internal-package  # 如果PyPI上有同名包

# 方案1：配置私有索引
# ~/.config/pip/pip.conf
[global]
index-url = https://pypi.mycompany.com/simple
extra-index-url = https://pypi.org/simple

# 方案2：使用 --index-url 指定
pip install --index-url https://pypi.mycompany.com/simple my-pkg

# 方案3：使用 requirements.txt 锁定
my-pkg @ https://pypi.mycompany.com/packages/my-pkg-1.0.0.tar.gz

# 扫描工具
pip-audit
safety check
safety check --json
```

### 2.3 Maven (Java)

```xml
<!-- 风险：如果公共Maven Central有同名包 -->
<!-- pom.xml 优先从私有仓库解析 -->
<repositories>
    <repository>
        <id>internal-repo</id>
        <url>https://nexus.mycompany.com/repository/maven-releases/</url>
        <releases><enabled>true</enabled></releases>
        <snapshots><enabled>false</enabled></snapshots>
    </repository>
</repositories>

<!-- 私有仓库代理模式（推荐） -->
<!-- Nexus/Artifactory 配置上游代理，所有请求走私有仓库 -->
<!-- 禁止开发环境直接访问公网注册表 -->
```

### 2.4 Go Modules

```bash
# 风险：GOPROXY 配置不当
# 方案1：私有 GOPROXY
export GOPROXY=https://goproxy.mycompany.com,direct
export GONOSUMCHECK=*.mycompany.com
export GONOSUMDB=*.mycompany.com
export GOPRIVATE=*.mycompany.com

# 方案2：Go Module Mirror 私有实例
# 部署 Athens 或 GoCenter 作为私有 proxy
```

### 2.5 Docker / 容器镜像

```bash
# 风险：从 Docker Hub 拉取被投毒的镜像
# Docker Hub 上大量与官方名称相似的恶意镜像

# 防御：
# 1. 使用私有镜像仓库（Harbor）
# 2. 配置镜像代理缓存
# 3. 镜像签名验证
docker trust verify nginx:latest

# 4. 配置 /etc/docker/daemon.json
{
  "registry-mirrors": ["https://harbor.mycompany.com"],
  "insecure-registries": [],
  "content-trust": true
}
```

---

## 三、防御体系

### 3.1 架构设计

```
                    ┌─────────────────────┐
                    │   开发者终端         │
                    │   (不允许直连公网)   │
                    └─────────┬───────────┘
                              │
                    ┌─────────▼───────────┐
                    │   私有包管理仓库     │
                    │   (Nexus/Artifactory│
                    │    /Harbor/Verdaccio)│
                    │                     │
                    │  ├── 代理仓库(Proxy) │ ← 代理npm/PyPI/Maven
                    │  ├── 托管仓库(Hosted)│ ← 存放内部包
                    │  └── 群组仓库(Group) │ ← 统一入口
                    └─────────┬───────────┘
                              │ (白名单放行)
                    ┌─────────▼───────────┐
                    │   安全扫描网关       │
                    │   (防火墙DLP集成)   │
                    └─────────┬───────────┘
                              │
                    ┌─────────▼───────────┐
                    │   公共注册表         │
                    │   npm/PyPI/Maven    │
                    └─────────────────────┘

关键原则：
1. 开发者终端不允许直连公共注册表
2. 所有依赖必须通过私有仓库代理
3. 私有仓库开启恶意包扫描
4. 上传包前安全审查
```

### 3.2 私有仓库部署

```bash
# Verdaccio (轻量级npm私有仓库)
docker run -d -p 4873:4873 --name verdaccio verdaccio/verdaccio

# 配置上游代理
# config.yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
    
packages:
  '@mycompany/*':
    access: $authenticated
    publish: $authenticated
  '**':
    access: $all
    proxy: npmjs

# Nexus (企业级通用制品仓库)
docker run -d -p 8081:8081 sonatype/nexus3

# Harbor (容器镜像+Helm Charts仓库)
# 支持镜像漏洞扫描(Trivy集成)、签名验证、内容信任
```

### 3.3 锁定文件

```bash
# npm: package-lock.json
# 锁定了每个依赖的精确版本和完整性哈希
# 必须提交到版本控制！

# 完整性验证
{
  "node_modules/lodash": {
    "version": "4.17.21",
    "resolved": "https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz",
    "integrity": "sha512-v2kDEe57lecTulaDIuNTPyS3s..."
  }
}
# npm install 时验证 integrity 哈希

# yarn: yarn.lock
# pnpm: pnpm-lock.yaml
# pip: requirements.txt (使用hash)
pip install --require-hashes -r requirements.txt

# Go: go.sum (自动生成完整性哈希)
# Maven: mvn verify  + 校验和插件
```

---

## 四、检测工具

### 4.1 主动扫描

```bash
# npm 审计
npm audit
npm audit fix

# OSV-Scanner (Google开源)
osv-scanner scan -r /path/to/project
osv-scanner scan --lockfile package-lock.json

# Snyk CLI
snyk test
snyk monitor

# Socket.dev (检测恶意包行为)
npm install -g @socketsecurity/cli
socket scan .

# 检测依赖混淆
confused  # 开源工具，扫描PyPI/npm上的内部包名冲突
```

### 4.2 持续监控

```yaml
# Dependabot 配置示例 (.github/dependabot.yml)
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "daily"
    open-pull-requests-limit: 10
    # 只允许安全更新
    allow:
      - dependency-type: "direct"
    # 忽略某些包
    ignore:
      - dependency-name: "lodash"
        versions: ["<5.0.0"]

# Renovate 配置（更灵活的自动更新）
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:base"],
  "packageRules": [
    {
      "matchUpdateTypes": ["patch"],
      "automerge": true
    },
    {
      "matchPackagePatterns": ["^@mycompany/"],
      "matchUpdateTypes": ["minor", "patch"],
      "automerge": true,
      "groupName": "internal packages"
    }
  ]
}
```

---

## 五、应急响应

### 5.1 发现恶意包后

```
1. 立即隔离
   - 从依赖中移除恶意包
   - 在私有仓库中下架/屏蔽恶意包
   - 通知受影响团队

2. 影响评估
   - 审计恶意包代码（行为分析）
   - 确认恶意包在构建/运行中是否被执行
   - 检查数据/凭据是否被泄露
   - 扫描所有使用该包的项目

3. 修复
   - 发布热修复版本
   - 替换为安全版本
   - 轮换可能泄露的凭据
   - 审计日志回溯

4. 加固
   - 更新扫描规则
   - 增加准入控制
   - 更新安全意识培训
```

### 5.2 安全最佳实践

```bash
# 1. 使用文件完整性校验
npm ci          # 严格按照 package-lock.json 安装，不更新依赖树
pip install --require-hashes -r requirements.txt

# 2. 锁定依赖版本（不要使用 ^ 或 ~）
# 好的做法:
"lodash": "4.17.21"
# 避免:
"lodash": "^4.17.21"

# 3. 审查第三方依赖更新
# 每个依赖更新PR必须Review：
# - 检查更新内容（changelog / diff）
# - 检查引入的新依赖
# - 检查仓库/维护者信誉

# 4. 最小依赖原则
# 定期清理未使用的依赖
npx depcheck
pip check  # Python依赖冲突检查
mvn dependency:analyze  # Maven未使用依赖分析
```

---

## 六、Checklist

- [ ] 部署私有制品仓库（Verdaccio/Nexus/Artifactory/Harbor）
- [ ] 配置开发者环境禁止直连公共注册表
- [ ] 使用 scope/命名空间隔离内部包（如 @company/*）
- [ ] 锁定文件（lockfile）必须提交到版本控制
- [ ] 启用 npm ci / pip --require-hashes / mvn verify
- [ ] CI/CD中集成依赖安全扫描（npm audit/osv-scanner/snyk）
- [ ] 配置 Dependabot/Renovate 自动安全更新
- [ ] 新包引入/包更新需要Code Review
- [ ] 内部包名进行公共注册表预占位（防止被抢注）
- [ ] 定期清理未使用的依赖
- [ ] 建立第三方包安全评估流程
- [ ] 员工供应链安全意识培训
