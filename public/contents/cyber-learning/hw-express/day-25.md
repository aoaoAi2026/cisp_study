---
day: 25
title: 云安全基础——容器安全与K8s加固
phase: 第三阶段
difficulty: ⭐⭐⭐ 进阶
---

# Day 25：云安全基础——容器安全与K8s加固

> **阶段**：第三阶段 · 蓝队专项突破周（中级→高级岗达标） | **难度**：⭐⭐⭐ 进阶 | **课时**：3-4小时

---

## 📋 今日学习目标

1. **理解Docker/K8s的基本安全模型**：容器不是虚拟机——共享内核带来的安全问题
2. **掌握K8s的8大安全加固措施**：RBAC、NetworkPolicy、Pod Security、Secret管理、镜像安全、运行时安全、审计日志、准入控制
3. **学会识别容器环境的常见攻击面**：错误的挂载、特权容器、漏洞镜像、错误配置
4. **完成K8s安全基线检查**：用kubescape/kube-bench快速扫描你的集群
5. **理解护网中云安全的特殊关注点**：和传统机房不同的威胁模型

---

## 📖 核心知识讲解

### 一、容器安全的第一课——"容器≠虚拟机"

```
传统的误解："容器和虚拟机一样，都是隔离的"

虚拟机隔离：
┌─────────┐ ┌─────────┐ ┌─────────┐
│  App A  │ │  App B  │ │  App C  │
├─────────┤ ├─────────┤ ├─────────┤
│Guest OS │ │Guest OS │ │Guest OS │  ← 各自独立的内核
├─────────┤ ├─────────┤ ├─────────┤
│         Hypervisor (虚拟化层)      │
├───────────────────────────────────┤
│           Host OS (宿主机)         │
└───────────────────────────────────┘
→ 攻破Guest OS ≠ 攻破Host OS（有Hypervisor隔离）

容器隔离：
┌─────────┐ ┌─────────┐ ┌─────────┐
│  App A  │ │  App B  │ │  App C  │
├─────────┤ ├─────────┤ ├─────────┤
│         Container Runtime (Docker/containerd)  │
├───────────────────────────────────────────────┤
│              Host OS (共享内核!)               │
└───────────────────────────────────────────────┘
→ 所有容器共享同一个Linux内核！
→ 容器的安全高度依赖内核的Namespace和Cgroups隔离
→ 如果容器逃逸成功 = 直接拿到宿主机权限！

核心教训：
  1. 容器隔离 ≠ 虚拟机隔离（弱得多）
  2. 永远不要用root用户运行容器内的应用
  3. 内核漏洞对所有容器的影响是同等的
```

---

### 二、Docker安全核心5条

#### 1. 永远不要用root运行容器

```dockerfile
# ❌ 不安全的Dockerfile（默认以root运行）
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "server.js"]
# → 容器内的进程以root身份运行 → 如果容器被攻破，攻击者就是容器内的root

# ✅ 安全的Dockerfile（创建非root用户）
FROM node:18
WORKDIR /app
# 创建专用用户
RUN groupadd -r appgroup && useradd -r -g appgroup appuser
COPY --chown=appuser:appgroup . .
RUN npm install
USER appuser  # ← 切换到非root用户
CMD ["node", "server.js"]
```

#### 2. 最小化镜像——"不需要的东西别放进去"

```dockerfile
# ❌ 不安全的做法：使用通用发行版镜像
FROM ubuntu:latest  # Ubuntu基础镜像包含curl, wget, netcat, ssh...
# → 攻击者可以利用这些工具下载恶意软件、建立反向Shell

# ✅ 安全做法：使用distroless或alpine精简镜像
FROM node:18-alpine  # Alpine Linux只有5MB
# 或
FROM gcr.io/distroless/nodejs18  # Google distroless：没有包管理器，没有shell！
# → 攻击者拿到容器后：没有bash, 没有curl, 没有wget, 没有nc
# → 什么都干不了，只能执行Node.js进程的功能
```

#### 3. 限制容器资源——防止DoS

```bash
# 不加限制的容器可以耗尽宿主机资源
docker run -d --name app nginx:latest

# 安全的资源限制
docker run -d --name app \
  --cpus="1" \              # 最多用1个CPU核心
  --memory="512m" \          # 最多用512MB内存
  --memory-swap="512m" \     # 不允许使用swap
  --pids-limit=100 \         # 最多100个进程（防止fork炸弹）
  --read-only \              # 根文件系统只读（除特定挂载点）
  --tmpfs /tmp:noexec \      # /tmp不允许执行文件
  nginx:latest
```

#### 4. 镜像漏洞扫描

```bash
# 在CI/CD流水线中扫描镜像
# 工具：Trivy (推荐，开源免费)

# 扫描一个镜像
trivy image nginx:latest

# 在CI中阻断包含Critical漏洞的镜像
trivy image --exit-code 1 --severity CRITICAL myapp:latest
# → 如果有CRITICAL级别漏洞 → 构建失败 → 禁止部署

# 只关心"已有修复"的漏洞（忽略还没补丁的0day）
trivy image --ignore-unfixed myapp:latest
```

#### 5. Docker Bench Security检查

```bash
# Docker官方发布的安全基线检查工具
docker run --rm --net host --pid host --userns host \
  --cap-add audit_control \
  -v /etc:/etc:ro \
  -v /usr/bin/docker-containerd:/usr/bin/docker-containerd:ro \
  -v /usr/bin/docker-runc:/usr/bin/docker-runc:ro \
  -v /usr/lib/systemd:/usr/lib/systemd:ro \
  -v /var/lib:/var/lib:ro \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  --label docker_bench_security \
  docker/docker-bench-security

# 输出举例：
# [WARN] 1.2.2 - Ensure the container host has been Hardened
# [PASS] 2.1 - Ensure network traffic is restricted between containers
# [WARN] 4.1 - Ensure that a user for the container has been created
```

---

### 三、Kubernetes安全——"8大加固措施"

#### 加固1：RBAC——权限最小化

```yaml
# ❌ 不安全的权限：给了集群管理员权限
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: developer-admin
subjects:
- kind: User
  name: developer@company.com
roleRef:
  kind: ClusterRole
  name: cluster-admin  # ← 集群管理员！可以删任何东西

# ✅ 安全的权限：只给需要的权限，且限定命名空间
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: developer-app-access
  namespace: app-team  # ← 只在这个命名空间生效
subjects:
- kind: User
  name: developer@company.com
roleRef:
  kind: Role
  name: app-developer  # ← 自定义角色：只能看Pod日志、不能删资源
```

**权限最小化检查：**

```bash
# 检查谁有cluster-admin权限
kubectl get clusterrolebindings -o json | \
  jq -r '.items[] | select(.roleRef.name=="cluster-admin") | .subjects[] | "\(.kind):\(.name)"'

# 罗列出所有ClusterRoleBinding和其中的主体
kubectl get clusterrolebindings -o wide
```

#### 加固2：NetworkPolicy——Pod间零信任

```yaml
# K8s默认：所有Pod之间可以互相通信（非常不安全！）
# NetworkPolicy：明确定义哪些Pod能和哪些Pod通信

# 策略1：拒绝所有入站流量（默认拒绝）
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-ingress
spec:
  podSelector: {}  # 选择所有Pod
  policyTypes:
  - Ingress
  # 没有ingress规则 = 拒绝所有入站流量

# 策略2：只允许前端Pod访问后端API Pod
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-api
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: api-server  # 目标：API服务Pod
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend  # 来源：只允许前端Pod
    ports:
    - protocol: TCP
      port: 8080  # 只允许8080端口

# 策略3：只允许监控系统抓取指标
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-monitoring
spec:
  podSelector: {}  # 所有Pod
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: monitoring  # 只允许monitoring命名空间
    ports:
    - port: 9090
```

#### 加固3：Pod Security Standards——禁止特权容器

```yaml
# K8s安全标准三级：Privileged → Baseline → Restricted

# ❌ 不安全的Pod（Privileged级别）
apiVersion: v1
kind: Pod
metadata:
  name: bad-pod
spec:
  containers:
  - name: app
    image: nginx
    securityContext:
      privileged: true  # ← 特权模式！可以访问宿主机所有设备
      # 等价于 docker run --privileged

# ✅ 安全的Pod（Restricted级别）
apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
spec:
  securityContext:
    runAsNonRoot: true  # ← 必须以非root用户运行
    seccompProfile:
      type: RuntimeDefault  # ← 使用默认seccomp（减少系统调用）
  containers:
  - name: app
    image: nginx
    securityContext:
      allowPrivilegeEscalation: false  # ← 禁止提权
      capabilities:
        drop: ["ALL"]  # ← 丢弃所有capabilities
      readOnlyRootFilesystem: true  # ← 根文件系统只读
```

**检查集群中的特权Pod：**

```bash
# 查找所有特权容器
kubectl get pods --all-namespaces -o json | \
  jq -r '.items[] | select(.spec.containers[].securityContext.privileged==true) | 
         "\(.metadata.namespace)/\(.metadata.name)"'

# 查找所有以root运行的容器
kubectl get pods --all-namespaces -o json | \
  jq -r '.items[] | select(.spec.containers[].securityContext.runAsNonRoot!=true) |
         "\(.metadata.namespace)/\(.metadata.name)"'
```

#### 加固4：Secret管理——密码不能明文

```yaml
# ❌ 不安全的做法：密码写在环境变量中
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: app
    env:
    - name: DB_PASSWORD
      value: "SuperSecret123!"  # ← 明文密码！任何人kubectl describe都能看到

# ❌ 仍然不够安全：Base64编码 ≠ 加密
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
data:
  password: U3VwZXJTZWNyZXQxMjMh  # ← Base64编码，解码即明文！

# ✅ 最佳实践：
# 1. 使用外部密钥管理服务（如HashiCorp Vault、AWS Secrets Manager）
# 2. 通过CSI驱动将密钥挂载为文件
# 3. 应用启动时从文件读取密钥，不经过环境变量

# 或者使用Sealed Secrets（加密的Secret，可以安全存储在Git中）
# kubeseal工具会把Secret加密成SealedSecret，只有集群中的控制器能解密
```

#### 加固5：镜像安全策略

```yaml
# 限制可以使用的镜像源（防止从不明来源拉取镜像）
# 使用准入控制器（如OPA Gatekeeper）

# OPA策略：禁止使用latest标签
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sAllowedRepos
metadata:
  name: require-specific-image-registry
spec:
  match:
    kinds:
    - apiGroups: [""]
      kinds: ["Pod"]
  parameters:
    repos:
    - "myregistry.com/"  # 只允许来公司私有仓库的镜像
    - "k8s.gcr.io/"      # 只允许官方K8s镜像
    # 拒绝所有公共Docker Hub镜像（防止供应链攻击）
```

#### 加固6：运行时安全——检测容器异常行为

```bash
# Falco = 容器运行时的"摄像头"，检测异常系统调用

# Falco能检测到的行为（部分规则）：
# - 容器内执行了shell（/bin/bash）
# - 容器内读取了敏感文件（/etc/shadow）
# - 容器内创建了新的网络监听端口
# - 容器内执行了包管理命令（apt/apk/yum）
# - 容器挂载了宿主机的敏感目录
# - 容器尝试修改系统二进制文件

# 安装Falco
helm repo add falcosecurity https://falcosecurity.github.io/charts
helm install falco falcosecurity/falco --set falco.jsonOutput=true

# Falco示例告警输出：
# 10:30:15.123456789: Warning Shell in a container 
#   (user=root container_id=a1b2c3d4 container_name=nginx 
#    shell=bash parent=containerd-shim cmdline=bash -i)
# → 有人通过某种方式在nginx容器里打开了bash shell！
```

#### 加固7：审计日志

```yaml
# K8s审计日志 = 记录"谁在什么时候对K8s做了什么操作"

# 审计策略文件
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
  # 记录所有Secret的创建和删除
  - level: Metadata
    resources:
    - group: ""
      resources: ["secrets"]
    verbs: ["create", "delete", "patch"]

  # 记录所有权限变更（RBAC修改）
  - level: RequestResponse  # 记录请求内容和响应内容
    resources:
    - group: "rbac.authorization.k8s.io"
      resources: ["*"]

  # 记录所有Pod exec操作（有人进入容器执行命令）
  - level: Request
    resources:
    - group: ""
      resources: ["pods/exec"]
    verbs: ["create"]
```

#### 加固8：准入控制——部署前拦截

```yaml
# OPA/Rego策略：拒绝所有以root运行的Pod
package k8s.security

deny[msg] {
  input.request.kind.kind == "Pod"
  containers := input.request.object.spec.containers
  container := containers[_]
  not container.securityContext.runAsNonRoot
  msg := sprintf("Pod %v: container %v must run as non-root", 
                 [input.request.object.metadata.name, container.name])
}

# OPA策略：禁止使用hostNetwork（Pod使用宿主机网络栈）
# 原因：hostNetwork可以绕过NetworkPolicy，直接访问内网
deny[msg] {
  input.request.object.spec.hostNetwork
  msg := "hostNetwork is not allowed"
}
```

---

### 四、K8s安全基线——用kubescape一键检查

```bash
# kubescape = K8s安全合规检查工具（开源，CNCF项目）
# 基于NSA/CISA K8s安全加固指南

# 安装
curl -s https://raw.githubusercontent.com/kubescape/kubescape/master/install.sh | /bin/bash

# 全量安全扫描
kubescape scan

# 输出示例：
# ┌────────────────────────────────────────────────────────────┐
# │ Control: 禁止特权容器                                       │
# │ Status: FAILED                                             │
# │ Failed Resources:                                          │
# │   - Pod: default/bad-pod                                   │
# │ Remediation: Remove securityContext.privileged from pod    │
# ├────────────────────────────────────────────────────────────┤
# │ Control: 资源限制                                           │
# │ Status: FAILED                                             │
# │ Failed Resources:                                          │
# │   - Deployment: default/nginx (no resource limits)         │
# │ Remediation: Set resources.limits and resources.requests   │
# └────────────────────────────────────────────────────────────┘
```

---

### 五、护网中的云安全特殊关注点

```
云环境与传统机房的差异（护网蓝队必须知道）：

1. 攻击面不同
   传统：攻击服务器IP和端口
   云：攻击S3桶、IAM角色、Serverless函数、API Gateway
   → 需要理解每种云服务的攻击面和防御方法

2. 共享责任模型
   ┌──────────────────────────────────────────────┐
   │  云厂商负责：物理安全、网络、虚拟化、宿主机   │
   │  你负责：容器内应用、IAM配置、网络策略、数据 │
   │  共同：取决于IaaS/PaaS/SaaS模式              │
   └──────────────────────────────────────────────┘
   → 不要以为"上云了就安全了"
   → 你配置错一个S3桶权限，数据就全泄露了

3. 凭证泄露的后果更严重
   传统：泄露一个密码→影响一台服务器
   云：泄露一个IAM Access Key→可能影响整个AWS账户所有资源
   → 护网中监控IAM异常活动是P0优先级

4. 弹性扩缩容的监控难度
   传统：服务器数量固定，容易监控
   云：容器/Pod动态创建和销毁，来去无踪
   → 攻击者在某个Pod里运行了恶意进程，Pod销毁后痕迹也没了
   → 必须用Falco等运行时安全工具持续监控
```

---

## 🧪 实操练习

### 练习1：检查一个Dockerfile的安全性

```dockerfile
FROM ubuntu:latest
RUN apt-get update && apt-get install -y curl wget netcat
COPY . /app
WORKDIR /app
CMD ["python", "app.py"]
```

找出至少5个安全问题并写出修复方案。

<details>
<summary>点击查看答案</summary>

1. 使用ubuntu:latest（基础镜像臃肿，攻击面大）→ 改用 python:3-slim 或 distroless
2. 以root用户运行（默认）→ 添加USER指令切换到非root
3. 安装了curl/wget/netcat（攻击者可以利用的下载工具）→ 不在生产镜像中安装
4. 使用了latest标签（不可重复构建）→ 使用具体版本标签
5. 没有.dockerignore文件（可能COPY了.git/等敏感目录）→ 添加.dockerignore
6. RUN apt-get update后没有清理apt缓存 → 增加 RUN rm -rf /var/lib/apt/lists/*
</details>

### 练习2：K8s安全命令速查

```bash
# 1. 查看所有以root运行的Pod
kubectl get pods --all-namespaces -o json | \
  jq '.items[] | select(.spec.containers[].securityContext.runAsNonRoot != true) | 
       {namespace: .metadata.namespace, name: .metadata.name}'

# 2. 查看所有没有资源限制的Pod
kubectl get pods --all-namespaces -o json | \
  jq '.items[] | select(.spec.containers[].resources.limits == null) |
       {namespace: .metadata.namespace, name: .metadata.name}'

# 3. 查看所有使用默认ServiceAccount的Pod
kubectl get pods --all-namespaces -o json | \
  jq '.items[] | select(.spec.serviceAccountName == "default") |
       {namespace: .metadata.namespace, name: .metadata.name}'
```

---

## 📊 面试模拟

**Q1："Docker容器的root用户和宿主机的root用户是同一个吗？"**

> **标准回答**：这个问题是容器安全面试的经典题。答案是否定的——默认情况下，Docker容器内的root用户和宿主机root用户不是同一个。Docker使用Linux的User Namespace技术将容器内的root（UID 0）映射到宿主机上的一个普通用户（如UID 1000）。所以容器内的root在没有权限提升的情况下不能操作宿主机资源。但是！如果你用 `--privileged` 运行容器，或者没有正确配置User Namespace，容器root就可能获得宿主机root权限——这就是容器逃逸的安全风险来源。

---

## ⚠️ 常见误区

| 误区 | 真相 |
|:---|:---|
| ❌ "容器安全就是镜像扫描" | 镜像扫描只是第一道防线。还需要运行时安全（Falco）、网络安全（NetworkPolicy）、配置安全（RBAC/PodSecurity）——缺一不可。 |
| ❌ "K8s默认配置就很安全" | K8s的很多默认配置是不安全的：Pod间网络不隔离、ServiceAccount自动挂载、Secret只是Base64编码。必须主动加固。 |

---

## 📈 学习进度自检

1. **【基础】** 容器和虚拟机在安全隔离上的核心区别是什么？
2. **【基础】** K8s的8大安全加固措施是什么？
3. **【进阶】** NetworkPolicy解决了什么问题？如果没有NetworkPolicy会怎样？
4. **【进阶】** 为什么要禁止容器以root运行？如果应用"必须"以root运行怎么办？

---

## 📝 今日总结

> **Day 25 核心收获：**
>
> 1. 容器≠虚拟机——容器共享内核，安全隔离弱于虚拟机，需要多层加固
> 2. Docker安全五条：非root运行、最小化镜像、资源限制、镜像扫描、安全基线检查
> 3. K8s安全八个维度：RBAC/NetworkPolicy/PodSecurity/Secret管理/镜像策略/运行时安全/审计日志/准入控制
> 4. 容器安全不是"配一次就完"——需要CI/CD中的持续扫描+Falco运行时监控+定期基线检查
> 5. 云环境中IAM凭证泄露的后果比传统环境严重得多——因为一个AccessKey可能控制整个云账户

---

## 🔬 深度案例：三次真实的云安全事件

### 案例1：S3桶公开泄露——1.23亿用户数据暴露

```markdown
背景：2018年，某数据分析公司的一个AWS S3桶被设置为"公开可读"，
其中包含1.23亿美国家庭的敏感数据。

事件还原：
  → 桶名：customer-analytics-backup（看起来像"备份桶"，实际是主桶）
  → 权限：Everyone - Read（任何知道桶名的人都可以读取）
  → 内容：姓名、家庭地址、年龄、性别、收入估算、购买行为分析
  → 发现者：安全研究人员在渗透测试中偶然发现了该桶
  → 暴露时间：未知（可能长达数月）
  → 影响：1.23亿美国家庭 ≈ 全美约60%的家庭

蓝队教训：
  ✅ 永远对S3桶启用 "Block Public Access" 默认设置
  ✅ 使用AWS Config Rules自动检测"公开可读"的S3桶
  ✅ 命名规范：桶名中不要暴露数据类型或用途
     （"customer-analytics-backup" 等于告诉了全世界桶里有什么）
  ✅ 所有人离开公司 → IAM用户和Access Key必须立刻禁用
     （如果这个桶的权限是某个离职员工修改的呢？）
```

### 案例2：容器逃逸——从Web应用Pod到宿主机root

```markdown
背景：某企业的K8s集群中，攻击者从一个有漏洞的Web应用Pod中，
成功突破到了宿主机节点，获取了该节点上所有Pod的访问权限。

攻击链还原：
  ① 攻击者利用Web应用的一个文件上传漏洞，上传了Webshell
  ② 容器内Webshell以 root 用户运行（因为Pod没设置 runAsNonRoot！）
  ③ 攻击者在容器内发现 /var/run/docker.sock 被挂载了！
     （运维为了"方便管理"把docker.sock挂进了容器）
  ④ docker.sock = Docker API的Unix套接字
     拥有它 = 可以控制宿主机上的Docker守护进程
  ⑤ 攻击者使用 docker run -v /:/host 创建了一个新容器，
     把宿主机根目录挂载到新容器的 /host 路径
  ⑥ 现在攻击者可以在 /host 路径下读取/修改宿主机上的任何文件
  ⑦ 通过写入 SSH public key 或 crontab 获得了宿主机持久访问
  ⑧ 从宿主机上，攻击者可以访问该节点上所有Pod的进程、网络、文件

蓝队检测线索：
  → Pod以root运行（SA violation）
  → Pod挂载了 /var/run/docker.sock（极度危险！）
  → 进程审计日志中出现了 docker run 命令（不是正常业务行为）
  → 宿主机上出现了计划任务或SSH Key的新增

防护措施：
  ✅ PodSecurity：禁止挂载宿主机敏感路径
  ✅ 准入控制：OPA/Kyverno检测 /var/run/docker.sock 挂载请求
  ✅ Falco规则：检测容器内执行 docker 命令
  ✅ CI/CD：镜像扫描时标记那些需要/var/run/docker.sock的容器
```

### 案例3：K8s RBAC配置错误导致的全集群沦陷

```markdown
背景：某公司使用K8s部署微服务。运维为每个微服务创建了独立的
ServiceAccount。但是——为了方便，给了所有SA cluster-admin 权限。

攻击链：
  ① 攻击者攻破了其中一个最小权限的微服务Pod（仅需一个SQL注入）
  ② 该Pod的SA Token自动挂载在 /var/run/secrets/kubernetes.io/serviceaccount/token
  ③ 攻击者用这个Token查询K8s API：
     curl -H "Authorization: Bearer $(cat /var/run/secrets/kubernetes.io/serviceaccount/token)" 
          https://kubernetes.default.svc/api/v1/namespaces/default/secrets
  
  ④ 因为SA被赋予了cluster-admin，攻击者可以：
     - 读取所有namespace中的所有Secret（包括其他微服务的数据库密码）
     - 创建新的特权Pod（可以直接挂载宿主机文件系统）
     - 删除现有的所有Pod（全集群拒绝服务）
     - 修改Deployment镜像为挖矿程序

蓝队教训：
  ✅ RBAC是最后一道防线——不要把 cluster-admin 随便给人
  ✅ 每个ServiceAccount应该只有"刚好够用"的权限
  ✅ 不要让Pod自动挂载SA Token（如果不需要）
     automountServiceAccountToken: false
  ✅ 审计K8s API日志——谁的SA在访问它不该访问的API？
```

---

## 🛡️ 云安全检测的"护网七剑"

以下7个工具/命令可以直接用于护网中的云环境安全检查：

```bash
# ═══════════════════════════════════════════
# 云安全七剑——护网值守中的快速检查命令
# ═══════════════════════════════════════════

# 剑1：prowler — AWS多账户安全审计
# 基于CIS AWS Foundations Benchmark
prowler aws --profile production
# 检查项包括：S3公开桶、IAM密码策略、CloudTrail是否开启、
# GuardDuty是否启用、SecurityHub是否配置等

# 剑2：scoutsuite — 多云安全态势检查
# 支持 AWS / Azure / GCP
pip install scoutsuite
scout aws --profile production
# 生成HTML报告，包含所有资源的可视化安全风险地图

# 剑3：trivy — 容器镜像+IaC文件漏洞扫描
# 扫描Docker镜像
trivy image nginx:latest
# 扫描K8s YAML配置
trivy config ./k8s/
# 扫描Terraform文件（发现不安全配置）
trivy config ./terraform/

# 剑4：kube-bench — K8s集群CIS合规检查
kubectl apply -f https://raw.githubusercontent.com/aquasecurity/kube-bench/main/job.yaml
kubectl logs job/kube-bench
# 输出每种检查的 PASS/WARN/FAIL 状态

# 剑5：K8s Pod安全快速审计（jq一行命令）
kubectl get pods --all-namespaces -o json | jq -r '
  .items[] | 
  select(.spec.containers[].securityContext.runAsNonRoot != true or
         .spec.containers[].securityContext.privileged == true) |
  "\(.metadata.namespace)/\(.metadata.name)"'

# 剑6：cloudsplaining — AWS IAM最小权限分析
# 分析哪些IAM策略给了过多的权限
cloudsplaining download
cloudsplaining scan --input-file iam.json --output report/

# 剑7：kube-hunter — K8s渗透测试（从攻击者视角看）
# 被动模式（不攻击，只检测风险）
kube-hunter --mode passive
# 如果发现了已知漏洞，kube-hunter会给出利用建议
# 帮助蓝队理解攻击者会从哪里下手
```

---

## 🧪 扩展实操练习

### 练习3：构建一个安全的K8s Pod

```yaml
# 以下是给你的"不安全的Pod模板"，找出所有问题并重写为安全版本：
apiVersion: v1
kind: Pod
metadata:
  name: bad-pod
spec:
  containers:
  - name: web
    image: nginx:latest
    ports:
    - containerPort: 80
    volumeMounts:
    - name: docker-sock
      mountPath: /var/run/docker.sock
    env:
    - name: DB_PASSWORD
      value: "SuperSecretPassword123"
  volumes:
  - name: docker-sock
    hostPath:
      path: /var/run/docker.sock
```

<details>
<summary>参考答案——修复版</summary>

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: good-pod
  namespace: web-app
  labels:
    app: web
    compliance: pci-dss
spec:
  # 修复1：设置Pod安全上下文
  securityContext:
    runAsNonRoot: true
    runAsUser: 1001
    fsGroup: 1001
    seccompProfile:
      type: RuntimeDefault
  
  # 修复2：添加ServiceAccount（非default）
  serviceAccountName: web-sa
  
  containers:
  - name: web
    # 修复3：使用具体版本标签
    image: nginx:1.25-alpine-slim
    
    ports:
    - containerPort: 80
      protocol: TCP
    
    # 修复4：容器级别安全上下文
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
        - ALL
        add:
        - NET_BIND_SERVICE
    
    # 修复5：资源限制
    resources:
      requests:
        memory: "64Mi"
        cpu: "50m"
      limits:
        memory: "128Mi"
        cpu: "100m"
    
    # 修复6：删除docker.sock挂载！不需要！
    
    # 修复7：使用Secret引用替代明文密码
    env:
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: password
---
# 修复8：创建专用的Secret
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
  namespace: web-app
type: Opaque
data:
  password: U3VwZXJTZWN1cmVQYXNzd29yZDEyMw==  # Base64
---
# 修复9：添加NetworkPolicy（不是Pod的一部分，但安全配套需要）
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: web-policy
  namespace: web-app
spec:
  podSelector:
    matchLabels:
      app: web
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 80
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: backend
    ports:
    - protocol: TCP
      port: 8080
```

</details>

### 练习4：CloudTrail/IAM异常检测

```bash
# 用CloudTrail日志检测云环境中的可疑活动

# 1. 检查是否有人在枚举IAM用户（踩点行为）
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=ListUsers \
  --query 'Events[].{Time:EventTime,User:Username}' \
  --output table

# 2. 检查是否有人创建了新的Access Key（可能用于持久化）
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=CreateAccessKey \
  --query 'Events[].{Time:EventTime,User:Username,Details:CloudTrailEvent}'

# 3. 检查Root账户是否有活动（Root不应该做日常操作！）
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=UserIdentity,AttributeValue=root \
  --query 'Events[].{Time:EventTime,Event:EventName,Source:SourceIPAddress}'

# 4. 检查是否有创建/修改IAM策略的动作（提权行为）
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=AttachUserPolicy \
  --query 'Events[].{Time:EventTime,User:Username}'
# 同样查 AttachRolePolicy, PutUserPolicy, CreatePolicyVersion

# 5. 检查是否有S3桶权限被修改为公开（数据泄露前兆）
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=PutBucketAcl \
  --query 'Events[].{Time:EventTime,User:Username}'
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=PutBucketPolicy
```

---

## 🗺️ 云安全责任共担模型面试话术

```markdown
面试官问："上云了，安全是云厂商的事还是我的事？"

标准回答：
"这是一个面试高频题。答案是——取决于你用什么模式。

在IaaS（如AWS EC2）模式下：
  云厂商负责：物理安全、网络、虚拟化、宿主机操作系统
  你负责：虚拟机的操作系统加固、应用安全、数据安全、
         网络配置、IAM权限、访问控制
  → 你管"云里面的东西"，云厂商管"云本身"

在PaaS（如RDS）模式下：
  云厂商负责：IaaS的全部 + 数据库引擎的漏洞修复和配置
  你负责：数据库中的数据安全、访问控制、加密密钥
  → 云厂商管得更多了，但数据始终是你的责任

在SaaS（如Office 365）模式下：
  云厂商负责：所有基础设施和应用的运行
  你负责：用户身份管理、访问控制、数据分类和DLP
  → 应用和数据的使用安全仍然是你的责任

核心原则（面试金句）：
'在云上，数据安全永远是你的责任，无论哪种模式。'
'你把数据放在别人的电脑上，你要确保锁和钥匙是你自己在管。'

如果面试官追问'出事了到底谁赔偿'：
'如果因为云厂商的基础设施漏洞导致数据泄露，云厂商通常只
按服务费用的一定倍数赔偿（通常在合同里约定了上限）。
但你的数据被泄露造成的业务损失、声誉损失、监管罚款——
这些云厂商是不赔的。所以不能因为上云就放松安全。'
```

---

**📎 下节预告**：Day 26「第三阶段验收考核」，综合检验流量分析、APT分析、DDoS防护、代码审计、数据安全、云安全等高级主题的掌握程度。
