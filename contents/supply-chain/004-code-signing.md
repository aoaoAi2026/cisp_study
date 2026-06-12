# 代码签名与软件完整性验证

---

## 一、代码签名的本质

```
代码签名解决的问题：
  1. 身份认证：这个软件确实来自声称的发布者
  2. 完整性：软件在传输/存储过程中未被篡改
  3. 不可否认：发布者不能否认发布过该软件

传统PKI签名的局限：
  - 私钥泄露风险（SolarWinds签名密钥被滥用）
  - 证书管理复杂（过期、吊销、链式信任）
  - 无法证明构建过程的完整性（只证明"谁来签名"，不证明"怎么构建的"）
```

---

## 二、传统代码签名

### 2.1 Windows Authenticode

```powershell
# 查看签名信息
Get-AuthenticodeSignature .\myapp.exe

# 使用signtool签名
signtool sign /fd SHA256 /a /f mycert.pfx /p password .\myapp.exe

# 时间戳签名（证书过期后依然有效）
signtool sign /fd SHA256 /a /f mycert.pfx /p password `
  /tr http://timestamp.digicert.com /td SHA256 .\myapp.exe

# 验证签名
signtool verify /pa /v .\myapp.exe
```

### 2.2 macOS 公证

```bash
# macOS应用签名（codesign）
codesign --deep --force --verify --verbose \
  --sign "Developer ID Application: My Company (TEAMID)" \
  MyApp.app

# 验证签名
codesign --verify --verbose MyApp.app
spctl --assess --verbose MyApp.app

# 公证（Notarization）- 提交Apple审核
xcrun notarytool submit MyApp.dmg \
  --apple-id "dev@company.com" \
  --team-id "TEAMID" \
  --password "@keychain:AC_PASSWORD" \
  --wait

# 装订票据（Staple）
xcrun stapler staple MyApp.dmg
```

### 2.3 GPG签名

```bash
# 生成GPG密钥
gpg --full-generate-key

# 签名文件
gpg --detach-sign --armor myapp.tar.gz    # 生成 .asc 签名文件
gpg --sign --armor myapp.tar.gz            # 嵌入签名

# 验证签名
gpg --verify myapp.tar.gz.asc myapp.tar.gz

# Git commit/tag 签名
git config --global commit.gpgsign true
git config --global user.signingkey YOUR_KEY_ID
git commit -S -m "signed commit"
git tag -s v1.0.0 -m "signed release tag"
```

---

## 三、新一代签名方案：Sigstore

### 3.1 核心思想

```
Sigstore = 无密钥签名 + 透明日志 + OIDC身份

传统签名问题：
  - 需要管理长期私钥（生成/存储/轮换/吊销）
  - 私钥泄露等于完全攻破

Sigstore方案：
  - 基于OIDC身份（GitHub/Google账户）作为信任根
  - 每次签名自动生成短期密钥对（用完即弃）
  - 签名记录写入透明日志（Rekor）→ 不可抵赖
  - 证书写入证书透明度日志（Fulcio）
```

### 3.2 Cosign 实战

```bash
# 安装
go install github.com/sigstore/cosign/v2/cmd/cosign@latest

# 无密钥签名（Keyless Signing - 基于OIDC）
cosign sign myregistry/myapp:v1.0.0

# 交互流程：
# 1. OIDC认证（浏览器跳转GitHub/Google登录）
# 2. Fulcio颁发短期证书
# 3. 生成临时密钥对
# 4. 签名并记录到Rekor透明度日志
# 5. 丢弃私钥

# 验证签名
cosign verify myregistry/myapp:v1.0.0 \
  --certificate-identity "https://github.com/myorg/myrepo/.github/workflows/release.yml@refs/heads/main" \
  --certificate-oidc-issuer "https://token.actions.githubusercontent.com"

# 使用密钥对签名（传统方式）
cosign generate-key-pair
cosign sign --key cosign.key myapp:v1.0.0
cosign verify --key cosign.pub myapp:v1.0.0

# 签名并附加SBOM
cosign attach sbom --sbom sbom.spdx.json myapp:v1.0.0
cosign sign --key cosign.key --attachment sbom myapp:v1.0.0

# 签名任意blob
cosign sign-blob --key cosign.key release.tar.gz
cosign verify-blob --key cosign.pub --signature release.tar.gz.sig release.tar.gz
```

### 3.3 GitHub Actions CI/CD集成

```yaml
name: Build and Sign
on:
  push:
    tags: ['v*']

jobs:
  build-sign:
    runs-on: ubuntu-latest
    permissions:
      id-token: write   # 必需：用于OIDC
      contents: read
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Docker Image
        run: docker build -t ghcr.io/${{ github.repository }}:${{ github.ref_name }} .
      
      - name: Install Cosign
        uses: sigstore/cosign-installer@v3
      
      - name: Sign Image (Keyless)
        run: |
          cosign sign \
            --yes \
            ghcr.io/${{ github.repository }}:${{ github.ref_name }}
      
      - name: Verify Signature
        run: |
          cosign verify \
            --certificate-identity "https://github.com/${{ github.repository }}/.github/workflows/build.yml@${{ github.ref }}" \
            --certificate-oidc-issuer "https://token.actions.githubusercontent.com" \
            ghcr.io/${{ github.repository }}:${{ github.ref_name }}
```

---

## 四、SLSA 出处证明

### 4.1 SLSA Provenance

```json
{
  "_type": "https://in-toto.io/Statement/v1",
  "subject": [
    {
      "name": "ghcr.io/myorg/myapp",
      "digest": {"sha256": "abc123..."}
    }
  ],
  "predicateType": "https://slsa.dev/provenance/v1",
  "predicate": {
    "buildDefinition": {
      "buildType": "https://slsa.dev/container-based-build/v0.1",
      "externalParameters": {
        "source": {
          "uri": "git+https://github.com/myorg/myapp@refs/tags/v1.0.0",
          "digest": {"sha1": "def456..."}
        }
      },
      "internalParameters": {
        "builderImage": "node:20-slim@sha256:..."
      },
      "resolvedDependencies": [
        {
          "uri": "pkg:npm/lodash@4.17.21",
          "digest": {"sha256": "..."}
        }
      ]
    },
    "runDetails": {
      "builder": {
        "id": "https://github.com/slsa-framework/slsa-github-generator/.github/workflows/builder_docker-based_slsa3.yml@refs/tags/v2.0.0"
      },
      "buildMetadata": {
        "invocationId": "https://github.com/myorg/myapp/actions/runs/1234567890/attempts/1",
        "startedOn": "2024-06-01T10:00:00Z",
        "finishedOn": "2024-06-01T10:05:00Z"
      }
    }
  }
}
```

### 4.2 SLSA GitHub Generator

```yaml
# 使用官方slsa-github-generator生成SLSA 3出处证明
name: SLSA Build and Provenance
on:
  release:
    types: [published]

jobs:
  build:
    outputs:
      hashes: ${{ steps.hash.outputs.hashes }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build
        run: |
          docker build -t myapp .
          docker save myapp > myapp.tar
      
      - name: Generate hashes
        id: hash
        run: |
          echo "hashes=$(sha256sum myapp.tar | base64 -w0)" >> $GITHUB_OUTPUT

  provenance:
    needs: [build]
    permissions:
      actions: read
      id-token: write
      contents: write
    uses: slsa-framework/slsa-github-generator/.github/workflows/generator_generic_slsa3.yml@v2.0.0
    with:
      base64-subjects: "${{ needs.build.outputs.hashes }}"
```

### 4.3 in-toto 证明框架

```
in-toto 证明链：

┌──────────┐    ┌──────────┐    ┌──────────┐
│ 源码审查  │───→│ 构建     │───→│ 测试     │
│ (Review) │    │ (Build)  │    │ (Test)   │
└────┬─────┘    └────┬─────┘    └────┬─────┘
     │               │               │
     ▼               ▼               ▼
  link文件        link文件        link文件
  (review.link)  (build.link)   (test.link)
     │               │               │
     └───────────────┼───────────────┘
                     ▼
              layout文件（定义供应链流程）
                     │
                     ▼
              最终验证结果
              (in-toto-verify)
```

---

## 五、容器镜像安全签名

### 5.1 Docker Content Trust (Notary)

```bash
# 启用内容信任
export DOCKER_CONTENT_TRUST=1

# 签名推送
docker trust sign myregistry/myapp:latest
# 交互式输入签名密钥密码

# 拉取时自动验证
docker pull myregistry/myapp:latest
# 签名无效则拉取失败

# 管理签名密钥
docker trust key generate mykey
docker trust signer add --key mykey.pub alice myregistry/myapp

# 查看镜像签名信息
docker trust inspect --pretty myregistry/myapp:latest
```

### 5.2 Kubernetes 准入控制

```yaml
# OPA/Kyverno 策略：拒绝未签名的镜像
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: verify-image
spec:
  validationFailureAction: Enforce
  rules:
    - name: check-image-signature
      match:
        any:
        - resources:
            kinds:
              - Pod
      verifyImages:
      - imageReferences:
        - "ghcr.io/myorg/*:*"
        attestors:
        - count: 1
          entries:
          - keyless:
              subject: "https://github.com/myorg/*"
              issuer: "https://token.actions.githubusercontent.com"
              rekor:
                url: https://rekor.sigstore.dev
```

---

## 六、防御体系总览

### 6.1 多层签名验证

```
层1：源码层
  - Git Commit/Tag GPG签名
  - 分支保护规则（要求签名提交）

层2：构建层
  - SLSA出处证明（Provenance Attestation）
  - 密封构建环境
  - 构建日志签名

层3：制品层
  - Cosign签名容器镜像 / OCI制品
  - SBOM签名随附
  - 第三方依赖签名验证

层4：部署层
  - 准入控制器（OPA/Kyverno）验证签名
  - 运行时完整性校验
  - SPIFFE/SPIRE工作负载身份
```

### 6.2 密钥管理

```
私钥保护：
├── HSMs (Hardware Security Modules)
│   ├── YubiHSM / Nitrokey HSM
│   ├── AWS CloudHSM / Azure Dedicated HSM
│   └── SoftHSM (开发测试)
├── KMS (Key Management Service)
│   ├── AWS KMS / GCP KMS / Azure Key Vault
│   ├── Hashicorp Vault
│   └── 加密即服务（密钥从不离开KMS）
└── Sigstore无密钥签名（推荐）
    └── 无需管理长期私钥
```

---

## 七、Checklist

- [ ] Git Commit/Tag启用GPG签名
- [ ] CI/CD流水线集成Cosign/Sigstore无密钥签名
- [ ] SBOM随制品签名（签名后再分发）
- [ ] 部署SLSA出处证明（至少SLSA 3级）
- [ ] Kubernetes集群配置镜像签名验证准入控制
- [ ] 代码签名私钥使用HSM/KMS保护（或使用无密钥方案）
- [ ] 建立签名验证流程（CI验证 + 运行时验证）
- [ ] 签名证书生命周期管理（TLS/Code Signing证书）
- [ ] 签名吊销机制（私钥泄露应急预案）
- [ ] 定期审计签名和出处证明链路
