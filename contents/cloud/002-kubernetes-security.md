# Kubernetes 安全攻防实战：RBAC / 准入控制 / 审计

---

## 一、K8s 集群攻击面总览

Kubernetes 安全涉及四大层面：**基础设施层**（节点/内核）、**集群层**（API Server、etcd、控制面）、**工作负载层**（Pod/容器）、**应用层**（业务代码/服务）。

| 组件 | 默认监听 | 风险 |
|------|---------|------|
| kube-apiserver | 6443/tcp | 未鉴权访问、匿名用户、RBAC 过大 |
| kubelet | 10250/tcp | readOnlyPort 默认开、证书泄露 |
| etcd | 2379/tcp | 明文通信、快照未加密 |
| kube-scheduler / controller | 10251/10252 | 未启用 TLS |
| Dashboard | 30000+ | admin 特权 token 泄露 |

## 二、RBAC 权限配置与审计

RBAC 是 K8s 最核心的权限模型，由 **Role/ClusterRole** 描述权限，**RoleBinding/ClusterRoleBinding** 将主体（User/Group/ServiceAccount）与权限绑定。

### 2.1 常见错误配置

```yaml
# ❌ 风险：default ServiceAccount 绑定了 cluster-admin
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: bad-binding
subjects:
- kind: ServiceAccount
  name: default
  namespace: default
roleRef:
  kind: ClusterRole
  name: cluster-admin
  apiGroup: rbac.authorization.k8s.io
```

### 2.2 最小权限实践

```bash
# 扫描高权限绑定
kubectl get clusterrolebindings -o json | \
  jq '.items[] | select(.roleRef.name=="cluster-admin") | .subjects'

# 查看某 ServiceAccount 实际可执行的操作
kubectl auth can-i --list --as=system:serviceaccount:default:default
```

### 2.3 推荐工具链

- `kubiscan`：扫描高风险 RBAC 绑定
- `rbac-lookup`：快速查询用户实际权限
- `rbac-manager`：自动生成最小权限 Role

## 三、准入控制与 Pod 安全

从 Kubernetes 1.25 起，`PodSecurityPolicy` 被移除，官方推荐用 **Pod Security Admission (PSA)** 或第三方 **Kyverno / OPA Gatekeeper**。

```yaml
# ✅ 命名空间级别启用 PSA 限制模式
apiVersion: v1
kind: Namespace
metadata:
  name: secure-ns
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/enforce-version: latest
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

**容器安全基线要点**：

| 项 | 建议 |
|----|------|
| 运行用户 | `runAsNonRoot: true` + 指定 UID |
| 特权模式 | `privileged: false` |
| root 文件系统 | `readOnlyRootFilesystem: true` |
| Linux Capabilities | drop ALL，按需 add |
| Host 命名空间 | hostNetwork / hostPID / hostIPC 均为 false |

## 四、审计日志与威胁检测

```bash
# 查看 API Server 当前审计策略
kubectl describe pod kube-apiserver -n kube-system

# 推荐启用的审计规则子集（精简版）
# RequestReceived → ResponseStarted → ResponseComplete → Panic
```

常见威胁行为特征：

- 频繁 `watch secrets` 操作
- 对 `kube-system` 创建 Pod
- 挂载主机敏感目录 `/var/run/docker.sock`
- `kubectl exec` 进入 Pod 执行可疑命令
- 使用 `kubectl cp` 写入 webshell

## 五、实战加固 Checklist

- [ ] API Server 开启 `--anonymous-auth=false`
- [ ] 所有 kubelet 开启 x509 客户端证书认证
- [ ] etcd 通信启用 mTLS，快照加密
- [ ] 集群安装 Falco 做运行时行为检测
- [ ] 审计日志写入独立对象存储并接入 SIEM
- [ ] 命名空间打 PSA 标签，按业务分级
- [ ] ServiceAccount token 自动轮转（Bound Service Account Tokens）
