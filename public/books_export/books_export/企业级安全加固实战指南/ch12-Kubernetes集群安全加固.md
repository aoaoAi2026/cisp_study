# 第十二章 Kubernetes集群安全加固

## 12.1 Kubernetes安全概述

Kubernetes（K8s）已成为容器编排的事实标准，但其复杂的架构也带来了多样的安全挑战。K8s的安全加固需要从集群、节点、工作负载、网络等多个维度进行。

### 12.1.1 K8s安全风险矩阵

```
Kubernetes安全风险全景：
┌──────────────────────────────────────────────────┐
│ 控制平面风险                                     │
│ ├── API Server未授权访问                          │
│ ├── etcd未加密/未认证                            │
│ ├── kubelet未认证/未授权                          │
│ ├── Dashboard暴露公网/弱口令                     │
│ └── 敏感数据明文存储（Secret）                    │
├──────────────────────────────────────────────────┤
│ 工作负载风险                                     │
│ ├── 特权容器运行                                 │
│ ├── 容器以root运行                               │
│ ├── 挂载宿主敏感目录                             │
│ ├── 资源未限制导致DoS                            │
│ └── 镜像包含漏洞                                 │
├──────────────────────────────────────────────────┤
│ 网络风险                                         │
│ ├── Pod间无网络隔离                              │
│ ├── 服务暴露到公网                               │
│ ├── DNS劫持                                      │
│ └── 横向移动                                     │
├──────────────────────────────────────────────────┤
│ 身份与权限风险                                   │
│ ├── RBAC权限过大                                 │
│ ├── Service Account权限滥用                      │
│ ├── 默认ServiceAccount被挂载                     │
│ └── 角色绑定范围过大                             │
├──────────────────────────────────────────────────┤
│ 数据风险                                         │
│ ├── Secret明文存储                               │
│ ├── ConfigMap泄露敏感信息                        │
│ ├── PV/PVC数据泄露                              │
│ └── etcd数据未加密                               │
└──────────────────────────────────────────────────┘
```

### 12.1.2 K8s安全加固四层模型

```
Kubernetes安全四层模型：

第1层：集群安全（Cluster Security）
├── API Server安全
├── etcd安全
├── kubelet安全
├── RBAC权限控制
├── 审计日志
└── 准入控制

第2层：网络安全（Network Security）
├── Network Policy
├── 服务网格（Istio）
├── Ingress安全
├── 网络命名空间
└── TLS加密

第3层：工作负载安全（Workload Security）
├── Pod安全标准（PSA）
├── 非root用户
├── 只读根文件系统
├── 资源限制
├── 安全上下文
└── 镜像安全

第4层：数据安全（Data Security）
├── Secret加密
├── etcd加密
├── 存储加密
├── 敏感数据保护
└── 备份安全
```

## 12.2 API Server安全

### 12.2.1 认证加固

```yaml
# kube-apiserver.yaml 配置加固
apiVersion: v1
kind: Pod
metadata:
  name: kube-apiserver
  namespace: kube-system
spec:
  containers:
  - command:
    - kube-apiserver
    
    # ===== 认证方式 =====
    - --anonymous-auth=false              # 禁用匿名访问
    - --basic-auth-file=                 # 禁用基本认证（空）
    - --token-auth-file=                 # 禁用静态Token（空）
    
    # 启用X509客户端证书认证
    - --client-ca-file=/etc/kubernetes/pki/ca.crt
    
    # ServiceAccount认证
    - --service-account-key-file=/etc/kubernetes/pki/sa.pub
    - --service-account-issuer=https://kubernetes.default.svc.cluster.local
    - --service-account-signing-key-file=/etc/kubernetes/pki/sa.key
    
    # OIDC认证（可选，企业SSO）
    # - --oidc-issuer-url=https://oidc.example.com
    # - --oidc-client-id=kubernetes
    # - --oidc-username-claim=email
    # - --oidc-groups-claim=groups
    
    # ===== 授权 =====
    - --authorization-mode=Node,RBAC
    
    # ===== 准入控制 =====
    - --enable-admission-plugins=NodeRestriction,PodSecurity,NamespaceLifecycle,LimitRanger,ServiceAccount,PersistentVolumeClaimResize,DefaultStorageClass,DefaultTolerationSeconds,MutatingAdmissionWebhook,ValidatingAdmissionWebhook,ResourceQuota
    
    - --disable-admission-plugins=
    
    # ===== etcd =====
    - --etcd-servers=https://127.0.0.1:2379
    - --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt
    - --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt
    - --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key
    
    # ===== etcd加密 =====
    - --encryption-provider-config=/etc/kubernetes/encryption-config.yaml
    
    # ===== 审计日志 =====
    - --audit-log-path=/var/log/kubernetes/audit.log
    - --audit-log-maxage=30
    - --audit-log-maxbackup=10
    - --audit-log-maxsize=100
    - --audit-policy-file=/etc/kubernetes/audit-policy.yaml
    
    # ===== kubelet安全 =====
    - --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt
    - --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key
    - --kubelet-certificate-authority=/etc/kubernetes/pki/ca.crt
    - --kubelet-https=true
    
    # ===== 网络 =====
    - --bind-address=0.0.0.0          # 生产环境建议绑定内网IP
    - --secure-port=6443
    - --insecure-port=0               # 禁用不安全端口
    - --insecure-bind-address=127.0.0.1
    
    # ===== TLS =====
    - --tls-cert-file=/etc/kubernetes/pki/apiserver.crt
    - --tls-private-key-file=/etc/kubernetes/pki/apiserver.key
    - --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305
    - --tls-min-version=VersionTLS12
    
    # ===== 请求限制 =====
    - --max-requests-inflight=400
    - --max-mutating-requests-inflight=200
    - --request-timeout=60s
    
    # ===== 其他 =====
    - --profiling=false               # 禁用性能分析
    - --enable-aggregator-routing=false
```

### 12.2.2 etcd加密配置

```yaml
# /etc/kubernetes/encryption-config.yaml
# etcd静态加密配置
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
    - secrets
    - configmaps
    - namespaces
    - serviceaccounts
    providers:
    - aescbc:
        keys:
        - name: key1
          secret: <base64编码的32字节密钥>
    - identity: {}
```

```bash
# 生成加密密钥
head -c 32 /dev/urandom | base64

# 加密现有的Secret
kubectl get secrets --all-namespaces -o json | kubectl replace -f -

# 验证加密
ETCDCTL_API=3 etcdctl \
  --cacert /etc/kubernetes/pki/etcd/ca.crt \
  --cert /etc/kubernetes/pki/etcd/server.crt \
  --key /etc/kubernetes/pki/etcd/server.key \
  get /registry/secrets/default/my-secret
# 如果前面有k8s:enc:aescbc:v1: 前缀，说明已加密
```

### 12.2.3 审计策略

```yaml
# /etc/kubernetes/audit-policy.yaml
apiVersion: audit.k8s.io/v1
kind: Policy
omitStages:
  - "RequestReceived"
rules:
  # 不记录的低价值请求
  - level: None
    users: ["system:kube-proxy"]
    verbs: ["watch"]
    resources:
      - group: ""
        resources: ["endpoints", "services", "services/status"]
  
  - level: None
    users: ["system:kubelet"]
    verbs: ["get"]
    resources:
      - group: ""
        resources: ["nodes", "nodes/status"]
  
  - level: None
    users: ["system:apiserver"]
    verbs: ["get", "list", "watch"]
  
  # 不记录k8s.io命名空间的事件
  - level: None
    namespaces: ["kube-system"]
    resources:
      - group: ""
        resources: ["configmaps"]
        resourceNames: ["extension-apiserver-authentication"]
  
  # Secret和ConfigMap变更记录Metadata级别
  - level: Metadata
    resources:
      - group: ""
        resources: ["secrets", "configmaps"]
  
  # 核心资源的get/list/watch记录Metadata
  - level: Metadata
    verbs: ["get", "list", "watch"]
    resources:
      - group: ""
        resources: ["nodes", "pods", "deployments", "services", "namespaces"]
  
  # RBAC变更记录Request级别
  - level: Request
    resources:
      - group: "rbac.authorization.k8s.io"
      - group: "authorization.k8s.io"
  
  # 其他所有请求记录Metadata
  - level: Metadata
    omitStages:
      - "RequestReceived"
```

## 12.3 RBAC权限控制

### 12.3.1 RBAC最佳实践

```yaml
# ❌ 危险：给用户集群管理员权限
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: dev-admin
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin  # 最大权限，非常危险
subjects:
- kind: User
  name: developer
  apiGroup: rbac.authorization.k8s.io

---
# ✅ 安全：最小权限原则
# 命名空间级别权限
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: app-team
  name: developer-role
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log", "pods/exec"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["", "apps"]
  resources: ["deployments", "replicasets", "services", "configmaps"]
  verbs: ["get", "list", "watch", "create", "update", "patch"]
- apiGroups: ["batch"]
  resources: ["jobs", "cronjobs"]
  verbs: ["get", "list", "watch", "create"]

---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: developer-binding
  namespace: app-team
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: developer-role
subjects:
- kind: User
  name: developer
  apiGroup: rbac.authorization.k8s.io
- kind: Group
  name: dev-team
  apiGroup: rbac.authorization.k8s.io
```

### 12.3.2 Service Account安全

```yaml
# ❌ 危险：Pod挂载默认SA（可能有权限）
apiVersion: v1
kind: Pod
metadata:
  name: unsafe-pod
spec:
  containers:
  - name: app
    image: myapp:latest
  # 默认会自动挂载SA的Token

---
# ✅ 安全：禁用自动挂载SA
apiVersion: v1
kind: Pod
metadata:
  name: safe-pod
spec:
  automountServiceAccountToken: false  # 禁用自动挂载
  containers:
  - name: app
    image: myapp:latest

---
# 如果需要SA，使用最小权限的SA
apiVersion: v1
kind: ServiceAccount
metadata:
  name: app-sa
  namespace: app-team
automountServiceAccountToken: false  # 默认不挂载
```

## 12.4 Pod安全标准（PSA）

### 12.4.1 Pod安全准入

```yaml
# 启用Pod Security Admission
# 在API Server的--enable-admission-plugins中添加PodSecurity

# 命名空间级别的Pod安全标准
# 标签控制命名空间的Pod安全级别
apiVersion: v1
kind: Namespace
metadata:
  name: restricted-ns
  labels:
    # 强制级别：privileged, baseline, restricted
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/enforce-version: latest
    
    # 警告级别（不阻止，只警告）
    pod-security.kubernetes.io/warn: restricted
    pod-security.kubernetes.io/warn-version: latest
    
    # 审计级别
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/audit-version: latest
```

### 12.4.2 Pod安全上下文

```yaml
# Restricted级别的Pod安全配置示例
apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
spec:
  # 安全上下文（Pod级别）
  securityContext:
    runAsNonRoot: true              # 禁止root运行
    runAsUser: 1000                 # 运行用户ID
    runAsGroup: 3000                # 运行组ID
    fsGroup: 2000                   # 文件系统组
    supplementalGroups: [4000]      # 附加组
    seccompProfile:
      type: RuntimeDefault          # seccomp配置
    seLinuxOptions:
      level: "s0:c123,c456"        # SELinux标签
  
  # 不自动挂载SA Token
  automountServiceAccountToken: false
  
  containers:
  - name: app
    image: myapp:latest
    
    # 安全上下文（容器级别）
    securityContext:
      allowPrivilegeEscalation: false  # 禁止提权
      readOnlyRootFilesystem: true     # 只读根文件系统
      capabilities:
        drop:
          - ALL                        # 删除所有能力
        add:
          - NET_BIND_SERVICE           # 只添加需要的
      runAsNonRoot: true
      runAsUser: 1000
      privileged: false                # 非特权模式
    
    # 资源限制
    resources:
      requests:
        cpu: "100m"
        memory: "128Mi"
      limits:
        cpu: "500m"
        memory: "512Mi"
    
    # 临时目录（只读根文件系统需要）
    volumeMounts:
    - name: tmp
      mountPath: /tmp
    - name: cache
      mountPath: /var/cache
  
  volumes:
  - name: tmp
    emptyDir: {}
  - name: cache
    emptyDir: {}
```

## 12.5 网络安全

### 12.5.1 Network Policy

```yaml
# 默认拒绝所有入站流量
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
  namespace: app-team
spec:
  podSelector: {}
  policyTypes:
  - Ingress

---
# 默认拒绝所有出站流量
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-egress
  namespace: app-team
spec:
  podSelector: {}
  policyTypes:
  - Egress

---
# 允许Web服务从Ingress访问
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-web-ingress
  namespace: app-team
spec:
  podSelector:
    matchLabels:
      app: web
  policyTypes:
  - Ingress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 80

---
# 允许App服务访问数据库
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-app-to-db
  namespace: app-team
spec:
  podSelector:
    matchLabels:
      app: db
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: app
    ports:
    - protocol: TCP
      port: 3306

---
# 允许DNS解析（出站策略）
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-dns-egress
  namespace: app-team
spec:
  podSelector: {}
  policyTypes:
  - Egress
  egress:
  - to:
    - namespaceSelector: {}
      podSelector:
        matchLabels:
          k8s-app: kube-dns
    ports:
    - protocol: UDP
      port: 53
    - protocol: TCP
      port: 53
```

### 12.5.2 Ingress安全

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
  namespace: app-team
  annotations:
    # TLS重定向
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    
    # 限制请求体大小
    nginx.ingress.kubernetes.io/proxy-body-size: 10m
    
    # 限流
    nginx.ingress.kubernetes.io/limit-rps: "10"
    nginx.ingress.kubernetes.io/limit-rpm: "600"
    
    # WAF/ModSecurity
    nginx.ingress.kubernetes.io/enable-modsecurity: "true"
    nginx.ingress.kubernetes.io/modsecurity-snippet: |
      SecRuleEngine On
      SecRule ARGS "@rx (?i)(union|select|insert|update|delete|drop)" "id:1000,phase:2,deny,msg:'SQL Injection'"
    
    # 安全响应头
    nginx.ingress.kubernetes.io/configuration-snippet: |
      more_set_headers "X-Frame-Options: SAMEORIGIN";
      more_set_headers "X-Content-Type-Options: nosniff";
      more_set_headers "X-XSS-Protection: 1; mode=block";
      more_set_headers "Strict-Transport-Security: max-age=31536000; includeSubDomains";
      more_set_headers "Content-Security-Policy: default-src 'self'";
      more_set_headers "Referrer-Policy: strict-origin-when-cross-origin";
    
    # 禁止暴露的header
    nginx.ingress.kubernetes.io/server-snippet: |
      proxy_hide_header X-Powered-By;
      server_tokens off;
spec:
  tls:
  - hosts:
    - www.example.com
    secretName: example-tls
  rules:
  - host: www.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80
```

## 12.6 Kubelet安全

```yaml
# kubelet配置加固
# /var/lib/kubelet/config.yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration

# ===== 认证 =====
authentication:
  anonymous:
    enabled: false                    # 禁用匿名认证
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
  webhook:
    enabled: true

# ===== 授权 =====
authorization:
  mode: Webhook                       # Webhook授权模式
  webhook:
    cacheAuthorizedTTL: "5m"
    cacheUnauthorizedTTL: "30s"

# ===== 只读端口 =====
readOnlyPort: 0                       # 禁用只读端口（10255）

# ===== 端口 =====
port: 10250

# ===== 证书 =====
tlsCertFile: /var/lib/kubelet/pki/kubelet.crt
tlsPrivateKeyFile: /var/lib/kubelet/pki/kubelet.key
tlsCipherSuites:
- TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
- TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
- TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
- TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
tlsMinVersion: VersionTLS12

# ===== Pod安全 =====
protectKernelDefaults: true
makeIPTablesUtilChains: true

# ===== 镜像拉取 =====
serializeImagePulls: false

# ===== 系统保留 =====
systemReserved:
  cpu: 500m
  memory: 500Mi
kubeReserved:
  cpu: 200m
  memory: 200Mi

# ===== 驱逐阈值 =====
evictionHard:
  memory.available: "100Mi"
  nodefs.available: "10%"
  nodefs.inodesFree: "5%"
  imagefs.available: "15%"

# ===== 其他 =====
rotateCertificates: true
serverTLSBootstrap: true
```

## 12.7 Secret与数据安全

### 12.7.1 Secret管理最佳实践

```yaml
# ❌ 不好的做法：直接用YAML定义Secret，提交到Git
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  username: YWRtaW4=          # base64编码，不是加密！
  password: cGFzc3dvcmQxMjM=  # 可以直接解码
```

```bash
# ✅ 推荐的Secret管理方案：

# 方案1：Sealed Secrets（加密后可提交到Git）
# 安装控制器
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/controller.yaml

# 安装kubeseal CLI
# 创建SealedSecret
kubeseal --format yaml < secret.yaml > sealed-secret.yaml

# 方案2：External Secrets Operator (ESO)
# 从外部密钥管理系统同步
# 支持HashiCorp Vault, AWS Secrets Manager, GCP Secret Manager等

# 方案3：HashiCorp Vault
# 通过Vault Agent Sidecar注入Secret

# 方案4：KMS加密etcd
# 见前面的etcd加密配置
```

### 12.7.2 容器使用Secret

```yaml
# 方式1：作为环境变量（不推荐，容易泄露）
apiVersion: v1
kind: Pod
metadata:
  name: pod-env-secret
spec:
  containers:
  - name: app
    image: myapp:latest
    env:
    - name: DB_USERNAME
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: username
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: password

---
# 方式2：挂载为文件（推荐）
apiVersion: v1
kind: Pod
metadata:
  name: pod-volume-secret
spec:
  containers:
  - name: app
    image: myapp:latest
    volumeMounts:
    - name: db-secret
      mountPath: /etc/secrets
      readOnly: true
  volumes:
  - name: db-secret
    secret:
      secretName: db-secret
      defaultMode: 0400  # 权限限制
```

## 12.8 K8s安全审计工具

```bash
# 1. kube-bench（CIS Kubernetes基准）
# 安装
curl -L https://github.com/aquasecurity/kube-bench/releases/download/v0.6.2/kube-bench_0.6.2_linux_amd64.deb -o kube-bench.deb
dpkg -i kube-bench.deb

# 运行检查
kube-bench
kube-bench --config-dir cfg --config cfg/config.yaml

# 检查特定项目
kube-bench run --targets master,node,etcd

# 2. kube-hunter（渗透测试工具）
# 安装
pip install kube-hunter

# 运行被动扫描
kube-hunter --remote cluster-ip

# 主动扫描
kube-hunter --remote cluster-ip --active

# 3. Trivy（K8s扫描）
# 扫描集群漏洞
trivy k8s --report=summary all

# 扫描命名空间
trivy k8s --namespace kube-system cluster

# 4. Kubescape
# 安装
curl -s https://raw.githubusercontent.com/kubescape/kubescape/master/install.sh | /bin/bash

# 扫描集群
kubescape scan framework nsa
kubescape scan framework mitre
kubescape scan framework cis-v1.23-t1.0.1
```

## 12.9 加固检查清单

```
Kubernetes安全加固检查清单：

□ API Server安全
  □ 禁用匿名认证
  □ 禁用基本认证和静态Token
  □ 启用RBAC授权
  □ 启用NodeRestriction准入控制
  □ 启用PodSecurity准入控制
  □ 启用审计日志
  □ 禁用不安全端口(10255/insecure-port)
  □ TLS 1.2+强加密
  □ etcd启用TLS
  □ etcd数据静态加密
  □ Profiling已禁用

□ RBAC权限
  □ 遵循最小权限原则
  □ 不滥用cluster-admin
  □ Service Account最小权限
  □ 自动挂载SA Token已禁用
  □ 定期审计RBAC权限
  □ 命名空间级权限隔离
  □ 角色绑定范围明确

□ Pod安全
  □ Pod Security Admission已启用
  □ 非root用户运行
  □ 只读根文件系统
  □ 禁止特权模式
  □ 禁止权限提升
  □ 丢弃所有能力，按需添加
  □ Seccomp配置
  □ 资源限制（CPU/内存）
  □ 进程数限制
  □ 安全上下文配置正确

□ 网络安全
  □ 默认拒绝Network Policy
  □ 服务间网络隔离
  □ Ingress TLS加密
  □ Ingress安全响应头
  □ 限流配置
  □ 敏感服务不暴露公网
  □ NetworkPolicy覆盖所有命名空间
  □ DNS策略

□ 数据安全
  □ etcd静态加密
  □ Secret加密存储
  □ 不在镜像中硬编码密钥
  □ Secret通过文件挂载（非环境变量）
  □ 密钥轮转机制
  □ PV/PVC访问控制
  □ 存储加密
  □ 备份加密

□ 节点安全
  □ kubelet认证启用
  □ kubelet授权模式Webhook
  □ kubelet只读端口禁用
  □ 节点安全加固（见Linux加固）
  □ 工作节点不部署控制平面
  □ 节点定期打补丁
  □ 容器运行时安全

□ 日志审计
  □ 审计日志已启用
  □ 审计策略合理
  □ 日志集中收集
  □ 日志轮转
  □ 异常告警
  □ 操作审计
```

## 12.10 本章小结

本章全面介绍了Kubernetes集群安全加固：

1. **API Server安全**：认证、授权、准入控制、etcd加密、审计日志
2. **RBAC权限控制**：最小权限原则、SA安全、角色绑定管理
3. **Pod安全标准**：PSA准入控制、安全上下文、Restricted级别
4. **网络安全**：Network Policy、Ingress安全、TLS配置
5. **Kubelet安全**：认证授权、只读端口、TLS配置
6. **数据安全**：Secret管理、etcd加密、敏感数据保护
7. **安全审计工具**：kube-bench、kube-hunter、Trivy、Kubescape

下一章将学习云主机与云服务安全加固。

---

**实战作业：**
1. 运行kube-bench检查你的K8s集群安全状态
2. 配置Pod Security Admission，将命名空间设为restricted级别
3. 编写完整的Network Policy实现微服务间隔离
