# SBOM（软件物料清单）标准与实践指南

> **📘 文档定位**：CISP 考试供应链安全技术内容 | 难度：⭐⭐⭐ | 预计阅读：18 分钟
> SBOM 是软件供应链透明化的基础。本文从 SPDX/CycloneDX 标准到 SBOM 生成与消费，系统梳理软件物料清单实践。

---

## 导航目录
- [一、SBOM 概念与价值](#一sbom-概念与价值)

### 1.1 什么是SBOM

```
SBOM（Software Bill of Materials）：
软件组件、依赖项及其关系的正式结构化清单。

类比：
  食品配料表 → 知道吃了什么
  SBOM → 知道软件由哪些组件构成、有哪些已知漏洞
  
价值：
  - 供应链透明度：明确软件用了哪些开源组件
  - 漏洞管理：快速定位受影响的组件
  - 许可证合规：审查开源许可证合规性
  - 出口管制：满足各国网络安全法规要求
```

### 1.2 法规驱动

```
美国：
  - Executive Order 14028（2021）：联邦采购须提供SBOM
  - FDA医疗器械网络安全指南：要求SBOM

欧盟：
  - Cyber Resilience Act：数字产品需提供SBOM
  - NIS2指令

中国：
  - 《网络安全审查办法》：供应链安全审查
  - 《关键信息基础设施安全保护条例》
  - 信创产品供应链安全评估
```

---

## 二、三大SBOM标准对比

### 2.1 SPDX

```
SPDX（Software Package Data Exchange）：
Linux基金会维护，ISO/IEC 5962:2021国际标准

版本：SPDX 3.0（2024年发布）

格式：JSON / YAML / RDF / tag-value / JSON-LD

示例（SPDX JSON）：
{
  "spdxVersion": "SPDX-2.3",
  "dataLicense": "CC0-1.0",
  "SPDXID": "SPDXRef-DOCUMENT",
  "name": "my-app",
  "packages": [
    {
      "SPDXID": "SPDXRef-nginx",
      "name": "nginx",
      "versionInfo": "1.24.0",
      "supplier": "Organization: nginx",
      "downloadLocation": "https://nginx.org/download/nginx-1.24.0.tar.gz",
      "licenseConcluded": "BSD-2-Clause",
      "externalRefs": [
        {
          "referenceCategory": "SECURITY",
          "referenceType": "cpe23Type",
          "referenceLocator": "cpe:2.3:a:nginx:nginx:1.24.0:*:*:*:*:*:*:*"
        }
      ]
    }
  ],
  "relationships": [
    {
      "spdxElementId": "SPDXRef-DOCUMENT",
      "relatedSpdxElement": "SPDXRef-nginx",
      "relationshipType": "CONTAINS"
    }
  ]
}

优势：最全面的元数据支持、国际标准、法律引用
局限：较复杂，学习曲线陡峭
```

### 2.2 CycloneDX

```
CycloneDX：
OWASP维护的轻量级SBOM标准

版本：1.6（2024年）

格式：JSON / XML

示例（CycloneDX JSON）：
{
  "bomFormat": "CycloneDX",
  "specVersion": "1.5",
  "serialNumber": "urn:uuid:3e671687-395b-41f5-a30f-a58921a69b79",
  "version": 1,
  "components": [
    {
      "type": "library",
      "name": "lodash",
      "version": "4.17.21",
      "purl": "pkg:npm/lodash@4.17.21",
      "licenses": [{"license": {"id": "MIT"}}],
      "cpe": "cpe:2.3:a:lodash:lodash:4.17.21:*:*:*:*:*:*:*"
    }
  ],
  "vulnerabilities": [
    {
      "id": "CVE-2021-23337",
      "source": {"name": "NVD"},
      "ratings": [{"severity": "high", "score": 7.2}],
      "affects": [{"ref": "pkg:npm/lodash@4.17.21"}]
    }
  ]
}

优势：可直接嵌入漏洞信息、PURL全球包标识符、简洁
局限：元数据不如SPDX丰富
```

### 2.3 SWID

```
SWID（Software Identification Tags）：
ISO/IEC 19770-2标准

格式：XML

适用场景：传统软件/商业软件/固件

示例（SWID XML）：
<?xml version="1.0" encoding="UTF-8"?>
<SoftwareIdentity
  xmlns="http://standards.iso.org/iso/19770/-2/2015/schema.xsd"
  name="MyApp"
  version="2.3.1"
  tagId="com.example.myapp-2.3.1"
  tagVersion="1">
  <Entity name="Example Corp" role="softwareCreator"/>
</SoftwareIdentity>

优势：ISO标准、企业软件友好
局限：XML格式、生态不如前两者活跃
```

### 2.4 标准对比

| 维度 | SPDX | CycloneDX | SWID |
|------|------|-----------|------|
| 维护方 | Linux基金会 | OWASP | ISO |
| 格式 | JSON/YAML/RDF/tag | JSON/XML | XML |
| 许可证 | ★★★★★ | ★★★ | ★ |
| 漏洞信息 | ★★★ | ★★★★★ | ★ |
| 依赖关系 | ★★★★ | ★★★★ | ★★ |
| 简洁性 | ★★ | ★★★★ | ★★★ |
| 中国采纳 | 参考 | 较少 | 政务/信创 |
| 工具生态 | ★★★★ | ★★★★★ | ★★ |

---

## 三、SBOM生成工具

### 3.1 开源工具

```bash
# Syft（最流行的SBOM生成工具）
# 安装
curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh

# 使用
syft packages dir:. -o spdx-json              # SPDX格式
syft packages dir:. -o cyclonedx-json          # CycloneDX格式
syft image nginx:latest -o spdx-json           # 容器镜像
syft packages /path/to/binary                  # 二进制文件

# Trivy（集成了SBOM + 漏洞扫描）
trivy image --format cyclonedx nginx:latest
trivy fs --format spdx-json /path/to/repo

# CDXGen（专门生成CycloneDX）
npm install -g @cyclonedx/cdxgen
cdxgen -o bom.json -t js

# SPDX-Tools
pip install spdx-tools
pyspdxtools convert --infile bom.spdx.json --outfile bom.spdx.rdf

# Tern（容器镜像SBOM深度分析）
tern report -i nginx:latest -f spdxtagvalue -o tern-report.spdx
```

### 3.2 商业/云平台

| 平台 | SBOM支持 | 特点 |
|------|---------|------|
| **Snyk** | CycloneDX/SPDX | 集成漏洞管理+修复建议 |
| **FOSSA** | 全面支持 | 许可证合规+SBOM管理 |
| **Black Duck** | SPDX | 老牌SCA产品 |
| **Dependency-Track** | CycloneDX | OWASP开源，SBOM消费平台 |
| **GitHub Dependency Graph** | SPDX | 原生支持导出SPDX |
| **JFrog Xray** | CycloneDX/SPDX | 制品库集成 |

---

## 四、SBOM消费与漏洞关联

### 4.1 SBOM → 漏洞关联流程

```
┌─────────┐    ┌──────────┐    ┌──────────────┐    ┌─────────┐
│ SBOM    │───→│ PURL/CPE │───→│ 漏洞数据库     │───→│ 漏洞    │
│ 生成    │    │ 提取     │    │ NVD/OSV/GHSA   │    │ 报告    │
└─────────┘    └──────────┘    └──────────────┘    └─────────┘

PURL (Package URL):
  格式: pkg:<type>/<namespace>/<name>@<version>
  示例: pkg:npm/lodash@4.17.21
        pkg:pypi/django@3.2.0
        pkg:maven/org.springframework/spring-core@5.3.0

CPE (Common Platform Enumeration):
  格式: cpe:2.3:<part>:<vendor>:<product>:<version>:... 
  示例: cpe:2.3:a:apache:log4j:2.14.1:*:*:*:*:*:*:*
```

### 4.2 漏洞数据库

```bash
# OSV（Open Source Vulnerabilities）- Google维护
# 查询单个包的漏洞
curl https://api.osv.dev/v1/query -d '{
  "package": {"purl": "pkg:npm/lodash@4.17.21"}
}'

# 批量扫描项目
osv-scanner scan -r /path/to/project

# NVD API v2
curl "https://services.nvd.nist.gov/rest/json/cves/2.0?cpeName=cpe:2.3:a:apache:log4j:2.14.1"

# GitHub Advisory Database
gh api /advisories?ecosystem=npm&affects=lodash
```

### 4.3 Dependency-Track部署

```yaml
# docker-compose.yml 示例
version: '3'
services:
  dtrack-apiserver:
    image: dependencytrack/apiserver:latest
    ports:
      - "8081:8080"
    environment:
      - ALPINE_DATABASE_MODE=external
      - ALPINE_DATABASE_URL=jdbc:postgresql://postgres:5432/dtrack
    volumes:
      - dtrack-data:/data
      
  dtrack-frontend:
    image: dependencytrack/frontend:latest
    ports:
      - "8080:8080"
    environment:
      - API_BASE_URL=http://dtrack-apiserver:8080

# 上传SBOM（API方式）
curl -X POST http://localhost:8081/api/v1/bom \
  -H "X-Api-Key: ${API_KEY}" \
  -H "Content-Type: multipart/form-data" \
  -F "autoCreate=true" \
  -F "project=my-app" \
  -F "bom=@sbom.json"
```

---

## 五、SBOM实践路线

### 5.1 实施步骤

```
Phase 1: 工具选型与PoC
- 选择SBOM生成工具（Syft/Trivy/CDXGen）
- 选择SBOM格式（推荐CycloneDX或SPDX）
- 对1-2个关键项目试点

Phase 2: CI/CD集成
- 每次构建自动生成SBOM
- SBOM随制品一起存储/签名
- 集成漏洞扫描（Trivy/Grype/Dependency-Track）

Phase 3: SBOM管理平台
- 部署SBOM管理平台（Dependency-Track）
- 建立组件-项目-漏洞映射
- 配置告警规则（新漏洞通知）

Phase 4: 供应商SBOM要求
- 要求第三方供应商提供SBOM
- 入库制品自动解析/验证SBOM
- SBOM质量评估与标准化

Phase 5: 持续运营
- 漏洞零日应急（根据SBOM快速定位）
- SBOM数据质量度量
- 合规报告输出
```

### 5.2 CI/CD 集成示例

```yaml
# GitHub Actions 示例
name: Generate SBOM
on:
  push:
    branches: [main]
  release:
    types: [published]

jobs:
  sbom:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Generate SBOM with Syft
        uses: anchore/sbom-action@v0
        with:
          format: cyclonedx-json
          output-file: sbom.cdx.json
          
      - name: Sign SBOM with Cosign
        run: |
          cosign sign-blob --key cosign.key sbom.cdx.json
          
      - name: Upload SBOM
        uses: actions/upload-artifact@v4
        with:
          name: sbom
          path: sbom.cdx.json
          
      - name: Upload to Dependency-Track
        run: |
          curl -X POST https://dtrack.example.com/api/v1/bom \
            -H "X-Api-Key: ${{ secrets.DTRACK_KEY }}" \
            -H "Content-Type: multipart/form-data" \
            -F "autoCreate=true" \
            -F "project=${{ github.event.repository.name }}" \
            -F "bom=@sbom.cdx.json"
```

---

## 六、Checklist

- [ ] 选型SBOM标准和格式（SPDX / CycloneDX）
- [ ] 部署SBOM生成工具（Syft/Trivy/CDXGen）
- [ ] CI/CD流水线集成SBOM自动生成
- [ ] SBOM随制品签名与存储
- [ ] 部署SBOM消费平台（Dependency-Track等）
- [ ] 建立SBOM→漏洞关联自动化
- [ ] 配置漏洞告警（严重/Critical级别即时通知）
- [ ] 要求第三方供应商提供SBOM
- [ ] SBOM质量评估指标建立
- [ ] 定期SBOM审计（≥季度）
- [ ] SBOM应急响应流程（0-day漏洞快速定位）

---

## 高分考点与知识巧记

> 🔑 **高分考点**：SBOM 考点集中在两大标准(SPDX/CycloneDX)、SBOM 三大要素、与 SLSA 的关系。

| 考点 | 频次 | 核心记忆点 |
|:---|:---:|:---|
| SPDX vs CycloneDX | ⭐⭐⭐⭐ | SPDX(Linux基金会)、CycloneDX(OWASP)，都支持 JSON/XML |
| SBOM 三大要素 | ⭐⭐⭐⭐ | 组件名称+版本+依赖关系 |
| SBOM 消费场景 | ⭐⭐⭐ | 漏洞匹配(CVE)、许可证审计、供应链透明度 |

> 💡 **知识巧记**：SBOM 三要素记"名版依"——组件名称、版本号、依赖关系。

### 高分考点速查表

| 考察维度 | 关键结论 | 常见干扰项 |
|:---|:---|:---|
| SBOM 不是安全产品 | 是透明化工具，需配合扫描工具使用 | "有 SBOM 就安全了" ❌ |
| NTIA 最小要素 | 供应商、组件名、版本、依赖、作者、时间戳 | "SBOM 只需组件名和版本" ❌ |

### 知识巧记口诀

> **SBOM 口诀**：
> 两大标准 S 和 C，名版依三要素记。
> 漏洞匹配许可证审计，透明化基础不替代安全。
