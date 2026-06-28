# 第三十四章：kubectl - Kubernetes命令行工具

## 34.1 kubectl 简介

### 什么是 kubectl？

想象一下，你有一个庞大的城市，城市里有很多建筑（Pod）、道路（网络）、电力系统（存储）和管理部门（控制器）。你需要一个高效的指挥中心来管理这个城市的一切。

**kubectl**就是这样一个"城市指挥中心"——它是Kubernetes的命令行工具，允许你与Kubernetes集群进行交互。你可以用它来管理Pod、Service、Deployment等资源，查看集群状态，执行命令等。

简单来说，kubectl是一个**Kubernetes命令行管理工具**，它可以：
- 管理Pod、Service、Deployment
- 查看集群状态
- 执行容器命令
- 部署应用
- 配置资源

### kubectl 能做什么？

| 功能 | 说明 | 通俗理解 |
|------|------|----------|
| Pod管理 | 创建、删除、查看Pod | 管理城市里的建筑 |
| Service管理 | 创建、删除、查看Service | 管理城市里的道路和交通 |
| Deployment管理 | 创建、更新、回滚Deployment | 管理城市的建设项目 |
| 集群状态 | 查看节点、命名空间、资源使用 | 查看城市的整体状况 |
| 日志查看 | 查看Pod日志 | 查看建筑的运行记录 |
| 命令执行 | 在Pod内执行命令 | 在建筑内操作 |

### 为什么需要kubectl？

使用kubectl的好处：

1. **全面管理**：可以管理Kubernetes集群的所有资源
2. **自动化操作**：支持自动化脚本和CI/CD集成
3. **快速部署**：一键部署应用到集群
4. **问题排查**：快速查看日志和状态，定位问题
5. **灵活配置**：支持各种资源配置和定制

---

## 34.2 安装教程

### 系统环境要求

kubectl需要：
- Kubernetes集群（可以是Minikube、K3s、EKS、GKE等）
- 支持Linux、Windows、macOS

### 安装方法

**方法一：使用curl安装（Linux/macOS）**

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
```

**方法二：使用brew安装（macOS）**

```bash
brew install kubectl
```

**方法三：使用snap安装（Linux）**

```bash
sudo snap install kubectl --classic
```

**方法四：使用choco安装（Windows）**

```powershell
choco install kubernetes-cli
```

**方法五：从GitHub下载**

从 https://github.com/kubernetes/kubernetes/releases 下载对应平台的版本。

### 验证安装

```bash
kubectl version --client
```

如果显示版本信息，说明安装成功：

```
Client Version: v1.27.0
Kustomize Version: v5.0.1
```

### 配置kubectl

配置kubectl连接到Kubernetes集群：

```bash
# 设置集群配置
kubectl config set-cluster my-cluster --server=https://api.example.com

# 设置用户认证
kubectl config set-credentials my-user --token=my-token

# 设置上下文
kubectl config set-context my-context --cluster=my-cluster --user=my-user

# 使用上下文
kubectl config use-context my-context
```

或者直接复制kubeconfig文件：

```bash
cp kubeconfig ~/.kube/config
```

---

## 34.3 核心概念详解

### Kubernetes架构

Kubernetes集群由两个主要部分组成：

1. **控制平面（Control Plane）**：集群的大脑，负责管理和调度
   - API Server：集群的入口，处理所有请求
   - etcd：分布式键值存储，保存集群状态
   - Scheduler：调度器，决定Pod运行在哪个节点
   - Controller Manager：控制器管理器，维护期望状态

2. **节点（Node）**：集群的工作节点，运行Pod
   - Kubelet：节点代理，管理Pod
   - Kube-proxy：网络代理，管理网络规则
   - Container Runtime：容器运行时，如Docker、containerd

### 核心资源类型

| 资源类型 | 说明 | 通俗理解 |
|----------|------|----------|
| Pod | 最小部署单元，包含一个或多个容器 | 城市里的建筑 |
| Service | 服务发现和负载均衡 | 城市里的道路和交通 |
| Deployment | 部署管理，确保指定数量的Pod运行 | 城市的建设项目 |
| StatefulSet | 有状态应用部署 | 城市里的重要设施 |
| DaemonSet | 每个节点运行一个Pod | 城市里的基础设施 |
| ConfigMap | 配置管理 | 城市的规章制度 |
| Secret | 敏感信息管理 | 城市的机密文件 |
| Namespace | 资源隔离 | 城市里的不同区域 |

---

## 34.4 基本命令详解

### 查看集群信息

```bash
# 查看集群信息
kubectl cluster-info

# 查看节点列表
kubectl get nodes

# 查看节点详细信息
kubectl describe node <node-name>
```

### 查看资源

```bash
# 查看所有资源
kubectl get all

# 查看Pod
kubectl get pods

# 查看Pod详细信息
kubectl get pods -o wide

# 查看Deployment
kubectl get deployments

# 查看Service
kubectl get services

# 查看Namespace
kubectl get namespaces

# 查看ConfigMap
kubectl get configmaps

# 查看Secret
kubectl get secrets
```

### 创建资源

```bash
# 从文件创建资源
kubectl apply -f deployment.yaml

# 从目录创建所有资源
kubectl apply -f ./manifests/

# 在线创建资源
kubectl create deployment nginx --image=nginx

# 创建Service
kubectl expose deployment nginx --port=80 --type=NodePort
```

### 删除资源

```bash
# 从文件删除资源
kubectl delete -f deployment.yaml

# 删除Deployment
kubectl delete deployment nginx

# 删除Pod
kubectl delete pod <pod-name>

# 删除所有Pod
kubectl delete pods --all
```

### 查看日志

```bash
# 查看Pod日志
kubectl logs <pod-name>

# 实时查看日志
kubectl logs -f <pod-name>

# 查看指定容器日志
kubectl logs <pod-name> -c <container-name>

# 查看最近N行日志
kubectl logs --tail=100 <pod-name>
```

### 执行命令

```bash
# 在Pod内执行命令
kubectl exec -it <pod-name> -- /bin/bash

# 执行单个命令
kubectl exec <pod-name> -- ls /

# 指定容器执行命令
kubectl exec -it <pod-name> -c <container-name> -- /bin/bash
```

---

## 34.5 Deployment管理详解

### 创建Deployment

```bash
# 在线创建
kubectl create deployment nginx --image=nginx --replicas=3

# 从文件创建
kubectl apply -f deployment.yaml
```

**deployment.yaml示例**：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80
```

### 查看Deployment

```bash
kubectl get deployments
kubectl describe deployment nginx-deployment
```

### 扩缩容

```bash
# 扩展副本数
kubectl scale deployment nginx-deployment --replicas=5

# 自动扩缩容
kubectl autoscale deployment nginx-deployment --min=3 --max=10 --cpu-percent=80
```

### 更新Deployment

```bash
# 更新镜像
kubectl set image deployment nginx-deployment nginx=nginx:1.25

# 编辑Deployment配置
kubectl edit deployment nginx-deployment
```

### 回滚Deployment

```bash
# 查看历史版本
kubectl rollout history deployment nginx-deployment

# 查看特定版本
kubectl rollout history deployment nginx-deployment --revision=2

# 回滚到上一版本
kubectl rollout undo deployment nginx-deployment

# 回滚到指定版本
kubectl rollout undo deployment nginx-deployment --to-revision=2
```

---

## 34.6 Service管理详解

### 创建Service

```bash
# 创建NodePort Service
kubectl expose deployment nginx-deployment --port=80 --type=NodePort

# 创建ClusterIP Service
kubectl expose deployment nginx-deployment --port=80 --type=ClusterIP

# 创建LoadBalancer Service
kubectl expose deployment nginx-deployment --port=80 --type=LoadBalancer
```

**service.yaml示例**：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  type: NodePort
  selector:
    app: nginx
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080
```

### 查看Service

```bash
kubectl get services
kubectl describe service nginx-service
```

### 删除Service

```bash
kubectl delete service nginx-service
```

---

## 34.7 配置管理详解

### ConfigMap

```bash
# 创建ConfigMap
kubectl create configmap my-config --from-literal=key1=value1 --from-literal=key2=value2

# 从文件创建ConfigMap
kubectl create configmap my-config --from-file=config.ini

# 查看ConfigMap
kubectl get configmaps
kubectl describe configmap my-config

# 删除ConfigMap
kubectl delete configmap my-config
```

### Secret

```bash
# 创建Secret
kubectl create secret generic my-secret --from-literal=username=admin --from-literal=password=secret

# 从文件创建Secret
kubectl create secret generic my-secret --from-file=./credentials

# 查看Secret
kubectl get secrets
kubectl describe secret my-secret

# 查看Secret内容
kubectl get secret my-secret -o yaml

# 删除Secret
kubectl delete secret my-secret
```

---

## 34.8 安全相关命令

### RBAC管理

```bash
# 创建Role
kubectl create role pod-reader --verb=get,list,watch --resource=pods

# 创建RoleBinding
kubectl create rolebinding pod-reader-binding --role=pod-reader --user=my-user

# 创建ClusterRole
kubectl create clusterrole cluster-admin --verb=* --resource=*

# 创建ClusterRoleBinding
kubectl create clusterrolebinding admin-binding --clusterrole=cluster-admin --user=admin

# 查看Role
kubectl get roles
kubectl describe role pod-reader
```

### 资源限制

```bash
# 创建ResourceQuota
kubectl create resourcequota my-quota --hard=cpu=4,memory=8Gi,pods=10

# 创建LimitRange
kubectl create limitrange my-limit --min=cpu=100m,memory=256Mi --max=cpu=2,memory=4Gi

# 查看ResourceQuota
kubectl get resourcequotas

# 查看LimitRange
kubectl get limitranges
```

### 网络策略

```bash
# 创建NetworkPolicy
kubectl apply -f network-policy.yaml

# 查看NetworkPolicy
kubectl get networkpolicies

# 删除NetworkPolicy
kubectl delete networkpolicy my-policy
```

**network-policy.yaml示例**：

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```

---

## 34.9 高级功能详解

### 标签和选择器

```bash
# 添加标签
kubectl label pods <pod-name> app=nginx

# 修改标签
kubectl label pods <pod-name> app=web --overwrite

# 删除标签
kubectl label pods <pod-name> app-

# 按标签筛选
kubectl get pods -l app=nginx

# 按标签筛选多个条件
kubectl get pods -l "app=nginx,env=prod"
```

### 注解

```bash
# 添加注解
kubectl annotate pods <pod-name> description="This is a test pod"

# 修改注解
kubectl annotate pods <pod-name> description="Updated description" --overwrite

# 删除注解
kubectl annotate pods <pod-name> description-

# 查看注解
kubectl describe pod <pod-name>
```

### 端口转发

```bash
# 端口转发到Pod
kubectl port-forward <pod-name> 8080:80

# 端口转发到Service
kubectl port-forward svc/nginx-service 8080:80

# 后台端口转发
kubectl port-forward <pod-name> 8080:80 &
```

### 复制文件

```bash
# 从Pod复制文件到本地
kubectl cp <pod-name>:/path/to/file ./local-file

# 从本复制文件到Pod
kubectl cp ./local-file <pod-name>:/path/to/file
```

### 查看资源使用

```bash
# 查看Pod资源使用
kubectl top pods

# 查看节点资源使用
kubectl top nodes
```

---

## 34.10 实战案例：应用部署

### 场景说明

假设你需要部署一个Web应用到Kubernetes集群，包括Deployment和Service。

### 步骤

**步骤1：创建Deployment**

```bash
kubectl create deployment my-webapp --image=nginx:latest --replicas=3
```

**步骤2：查看Deployment状态**

```bash
kubectl get deployments
kubectl get pods
```

**步骤3：创建Service**

```bash
kubectl expose deployment my-webapp --port=80 --type=NodePort
```

**步骤4：查看Service信息**

```bash
kubectl get services
```

**步骤5：访问应用**

```bash
# 获取NodePort
NODE_PORT=$(kubectl get svc my-webapp -o jsonpath='{.spec.ports[0].nodePort}')

# 访问应用
curl http://<node-ip>:$NODE_PORT
```

**步骤6：更新应用**

```bash
kubectl set image deployment my-webapp nginx=nginx:1.25
```

**步骤7：回滚应用**

```bash
kubectl rollout undo deployment my-webapp
```

---

## 34.11 实战案例：集群审计

### 场景说明

假设你需要审计Kubernetes集群的安全配置，检查是否存在安全风险。

### 步骤

**步骤1：查看所有资源**

```bash
kubectl get all --all-namespaces
```

**步骤2：检查Secret**

```bash
kubectl get secrets --all-namespaces
kubectl describe secret <secret-name> -n <namespace>
```

**步骤3：检查RBAC配置**

```bash
kubectl get roles --all-namespaces
kubectl get rolebindings --all-namespaces
kubectl get clusterroles
kubectl get clusterrolebindings
```

**步骤4：检查资源限制**

```bash
kubectl get resourcequotas --all-namespaces
kubectl get limitranges --all-namespaces
```

**步骤5：检查网络策略**

```bash
kubectl get networkpolicies --all-namespaces
```

**步骤6：检查Pod安全配置**

```bash
kubectl get pods --all-namespaces -o yaml | grep -E "securityContext|privileged|runAsRoot"
```

**步骤7：生成审计报告**

```bash
# 检查是否有特权容器
kubectl get pods --all-namespaces -o jsonpath='{range .items[*]}{@.metadata.namespace}{"/"}{@.metadata.name}{"\n"}{end}' | while read pod; do
    if kubectl get pod $pod -o yaml | grep -q "privileged: true"; then
        echo "Privileged pod found: $pod"
    fi
done
```

---

## 34.12 实战案例：问题排查

### 场景说明

假设你的应用部署后无法正常运行，需要排查问题。

### 步骤

**步骤1：查看Pod状态**

```bash
kubectl get pods
```

**步骤2：查看Pod详细信息**

```bash
kubectl describe pod <pod-name>
```

**步骤3：查看Pod日志**

```bash
kubectl logs <pod-name>
kubectl logs -f <pod-name>
```

**步骤4：查看容器状态**

```bash
kubectl get pods -o jsonpath='{range .items[*]}{@.metadata.name}{"\n"}{@.status.containerStatuses[*].state}{"\n"}{end}'
```

**步骤5：执行诊断命令**

```bash
kubectl exec -it <pod-name> -- /bin/bash
```

**步骤6：检查事件**

```bash
kubectl get events
```

**步骤7：检查节点状态**

```bash
kubectl get nodes
kubectl describe node <node-name>
```

---

## 34.13 防御方法

### RBAC强化

1. **最小权限原则**：只为用户授予必要的权限
2. **定期审查**：定期审查Role和RoleBinding配置
3. **避免使用cluster-admin**：限制cluster-admin角色的使用

### 网络隔离

1. **使用NetworkPolicy**：限制Pod之间的网络访问
2. **隔离命名空间**：使用命名空间隔离不同环境
3. **限制外部访问**：只允许必要的外部访问

### 资源限制

1. **设置ResourceQuota**：限制命名空间的资源使用
2. **设置LimitRange**：限制Pod的资源使用
3. **避免资源耗尽**：防止单个Pod占用过多资源

### 安全上下文

1. **禁止特权容器**：禁止使用privileged模式
2. **非root运行**：使用非root用户运行容器
3. **限制权限**：使用securityContext限制容器权限

### Secret管理

1. **加密Secret**：使用etcd加密或外部密钥管理
2. **避免明文Secret**：不要在配置文件中硬编码Secret
3. **定期轮换**：定期轮换Secret

---

## 34.14 常见问题与解决方案

### 问题1：无法连接集群

**现象**：kubectl命令返回"Unable to connect to the server"

**原因**：kubeconfig配置错误，或API Server不可达

**解决方案**：
- 检查kubeconfig配置：`kubectl config view`
- 检查API Server地址：`kubectl cluster-info`
- 验证网络连接：`ping <api-server-ip>`

### 问题2：Pod状态异常

**现象**：Pod状态显示Pending、CrashLoopBackOff、ImagePullBackOff等

**原因**：资源不足、镜像拉取失败、配置错误等

**解决方案**：
- 查看Pod详细信息：`kubectl describe pod <pod-name>`
- 查看Pod日志：`kubectl logs <pod-name>`
- 检查节点资源：`kubectl top nodes`

### 问题3：Service无法访问

**现象**：无法通过Service访问应用

**原因**：Service配置错误、Pod未就绪、网络策略限制等

**解决方案**：
- 查看Service配置：`kubectl describe service <service-name>`
- 检查Endpoint：`kubectl get endpoints <service-name>`
- 检查网络策略：`kubectl get networkpolicies`

### 问题4：资源耗尽

**现象**：集群资源使用过高

**原因**：Pod数量过多、资源限制未设置

**解决方案**：
- 查看资源使用：`kubectl top pods`
- 设置资源限制：创建LimitRange和ResourceQuota
- 扩缩容：调整Deployment副本数

### 问题5：权限不足

**现象**：kubectl命令返回"Forbidden"或"Unauthorized"

**原因**：用户权限不足，RBAC配置错误

**解决方案**：
- 检查当前用户：`kubectl config current-context`
- 检查Role配置：`kubectl get roles`
- 检查RoleBinding：`kubectl get rolebindings`

---

## 总结

本章详细介绍了kubectl的使用：

1. **什么是kubectl**：Kubernetes命令行管理工具，用于管理集群资源
2. **安装配置**：支持多种安装方式，需要配置kubeconfig连接集群
3. **核心概念**：Kubernetes架构和核心资源类型
4. **基本命令**：查看集群信息、资源管理、日志查看、命令执行
5. **Deployment管理**：创建、扩缩容、更新、回滚
6. **Service管理**：创建、查看、删除Service
7. **配置管理**：ConfigMap和Secret管理
8. **安全相关**：RBAC、资源限制、网络策略
9. **高级功能**：标签、注解、端口转发、文件复制、资源使用
10. **实战案例**：应用部署、集群审计、问题排查
11. **防御方法**：RBAC强化、网络隔离、资源限制、安全上下文、Secret管理
12. **常见问题**：连接问题、Pod异常、Service访问、资源耗尽、权限不足的解决方案

kubectl是Kubernetes管理的必备工具，掌握它可以高效地管理和运维Kubernetes集群。

下一章我们将学习kube-hunter——Kubernetes安全扫描！