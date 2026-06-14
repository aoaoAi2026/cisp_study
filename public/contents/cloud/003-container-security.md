# 容器安全从入门到精通：Docker / containerd 安全基线

> **📘 文档定位**：CISP 考试容器安全核心内容 | 难度：⭐⭐⭐ | 预计阅读：18 分钟
> 容器安全覆盖构建、分发、运行、销毁全生命周期。本文从 Dockerfile 最佳实践、运行时安全基线、镜像签名到 rootless 沙箱，全面梳理容器安全知识体系。

---

## 导航目录
- [一、容器安全生命周期四阶段](#一容器安全生命周期四阶段)
- [二、Dockerfile 安全最佳实践](#二dockerfile-安全最佳实践)
- [三、运行时安全基线](#三运行时安全基线)
- [四、镜像签名与信任链](#四镜像签名与信任链)
- [五、rootless 容器与沙箱方案](#五rootless-容器与沙箱方案)
- [六、生产环境加固 Checklist](#六生产环境加固-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 一、容器安全生命周期四阶段

从镜像构建到运行时销毁，容器安全需要覆盖**构建（Build）、分发（Ship）、运行（Run）、销毁（Destroy）**四个阶段。

| 阶段 | 关键活动 | 典型工具 |
|------|---------|---------|
| 构建 | 基础镜像选择、Dockerfile 加固、依赖扫描 | Trivy、Snyk、hadolint |
| 分发 | 镜像签名、仓库访问控制、签名验证 | Cosign、Notary、Harbor |
| 运行 | 运行时监控、seccomp/AppArmor、rootless | Falco、gVisor、Kata Containers |
| 销毁 | 资源回收、密钥轮换、日志归档 | - |

## 二、Dockerfile 安全最佳实践

一个不安全的 Dockerfile 是所有问题的源头：

```dockerfile
# ❌ 错误示范
FROM ubuntu:latest                          # latest 不可追溯
USER root                                   # 默认 root 运行
RUN apt-get update && apt-get install curl  # 缓存中残留敏感包
COPY . /app                                 # 复制了 .env、密钥等文件
EXPOSE 22                                   # 容器内开 SSH
CMD ["python", "app.py"]
```

```dockerfile
# ✅ 正确示范（多阶段构建 + 非 root + 扫描）
FROM golang:1.22-alpine AS builder
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /out/app ./cmd/server

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=builder /out/app /app
USER 65532:65532
EXPOSE 8080
CMD ["/app"]
```

**关键规则**：

- 使用官方维护的基础镜像，锁定具体 `sha256` 摘要而非 tag
- 多阶段构建降低攻击面（distroless / scratch）
- 永远不要以 root 运行业务进程
- `.dockerignore` 排除敏感文件（密钥、env、.git）
- 避免安装调试工具（curl/wget/nc/bash 精简替换为 busybox）

## 三、运行时安全基线

### 3.1 内核安全特性

```bash
# 容器启动时启用 seccomp 限制系统调用
docker run --rm \
  --security-opt seccomp=/path/to/seccomp-profile.json \
  --security-opt no-new-privileges \
  --cap-drop=ALL \
  --cap-add=NET_BIND_SERVICE \
  --read-only \
  --tmpfs /tmp \
  my-app:latest
```

### 3.2 常见危险参数清单

| 参数 | 风险 | 何时允许 |
|------|------|---------|
| `--privileged` | 完全主机访问 | 绝不应出现在业务容器 |
| `--net=host` | 共享宿主机网络栈 | 仅监控/网络工具 |
| `--pid=host` | 可见宿主机所有进程 | 仅故障排查 |
| `-v /var/run/docker.sock` | 可逃逸出容器 | 仅 CI Runner，且需严格隔离 |
| `--cap-add SYS_ADMIN` | 近似 root 能力 | 几乎从不 |

### 3.3 镜像扫描实战

```bash
# Trivy 快速扫描 CVE + 敏感信息 + 密钥
trivy image --severity CRITICAL,HIGH myregistry/myapp:v1.2.3
trivy filesystem --skip-dirs node_modules ./src
trivy config ./k8s-manifests/  # IaC 配置扫描
```

## 四、镜像签名与信任链

使用 Sigstore/Cosign 方案：

```bash
# 1. 生成密钥对
cosign generate-key-pair

# 2. 推送镜像后签名
cosign sign --key cosign.key myregistry/myapp:v1.2.3

# 3. 部署前验证签名（CI/CD 流水线或准入控制器）
cosign verify --key cosign.pub myregistry/myapp:v1.2.3
```

## 五、rootless 容器与沙箱方案

- **Rootless Docker / Podman**：以非特权用户运行 daemon，容器逃逸也拿不到宿主机 root
- **gVisor runsc**：用户态内核，syscall 走独立沙箱进程
- **Kata Containers**：每个 Pod 一个轻量 VM，硬件级隔离

```bash
# 验证 containerd 是否启用了非特权运行
cat /etc/containerd/config.toml | grep -A3 "rootless"
```

## 六、生产环境加固 Checklist

- [ ] 所有容器以非 root 用户运行（UID ≥ 10000）
- [ ] 启用 seccomp + AppArmor/SELinux 配置
- [ ] 镜像仓库启用镜像签名 + 策略引擎验证
- [ ] 宿主机内核保持最新（CVE-2022-0492 等逃逸类漏洞依赖内核补丁）
- [ ] 部署 Falco / Tracee 做运行时异常行为检测
- [ ] 使用 CIS Docker Benchmark 定期自查
- [ ] 开启 container registry 不可变 tag（防止 tag 被覆盖投毒）

---

## 七、高分考点与知识巧记

> 🔑 **高分考点**：容器安全高频考点集中在 Dockerfile 加固原则、危险参数识别、镜像签名机制。考试侧重"什么不能做"而非"怎么做"，尤其关注 `--privileged`、`--net=host`、docker.sock 挂载等危险配置。

| 考点 | 频次 | 核心记忆点 |
|:---|:---:|:---|
| Dockerfile 安全原则 | ⭐⭐⭐⭐⭐ | 非 root、多阶段构建、锁定 sha256、.dockerignore |
| 危险容器参数 | ⭐⭐⭐⭐ | --privileged、--net=host、-v docker.sock、--cap-add SYS_ADMIN |
| seccomp/AppArmor | ⭐⭐⭐⭐ | seccomp 限制系统调用，AppArmor 限制文件/网络访问 |
| 镜像签名 | ⭐⭐⭐ | Cosign + Sigstore，推送签名、部署验证 |
| rootless 方案 | ⭐⭐⭐ | Rootless Docker/Podman、gVisor、Kata Containers |

> 💡 **知识巧记**：容器安全生命周期记作"建分运销"——构建（Build）、分发（Ship）、运行（Run）、销毁（Destroy）。危险参数五兄弟：privileged 全权限、host 网络栈、pid 看进程、docker.sock 可逃逸、SYS_ADMIN 近 root。加固口诀：非 root 运行 + drop ALL cap + 只读根文件系统 + seccomp 兜底。

### 高分考点速查表

| 考察维度 | 关键结论 | 常见干扰项 |
|:---|:---|:---|
| 镜像 tag | 锁定 sha256 摘要，避免 latest | "使用 latest 是安全的" ❌ |
| 运行用户 | 必须非 root，UID ≥ 10000 | "容器内 root 不等于宿主机 root" ⚠️ 部分真 |
| privileged | 绝不应出现在业务容器中 | "特权容器仅用于调试，用完即删" ⚠️ |
| docker.sock | 挂载即等于宿主机 root 权限 | "只读挂载 docker.sock 就安全" ❌ |
| seccomp | RuntimeDefault 是推荐的默认配置 | "禁用 seccomp 提高兼容性" ❌ |

### 知识巧记口诀

> **容器安全加固口诀**：
> 构建锁定 sha256，多阶段构建减攻击。
> 非 root 运行是铁律，敏感文件 ignore 弃。
> 危险参数五大忌，特权套接字 SYS_ADMIN 去。
> 镜像签名 Cosign 记，部署之前先 verify。
> seccomp 兜底限调用，rootless 逃逸也无效。
