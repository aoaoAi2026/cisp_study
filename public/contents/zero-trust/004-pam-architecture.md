# 特权访问管理(PAM)体系搭建

> **📘 文档定位**：CISP 考试 零信任特权安全 核心 | 难度：⭐⭐⭐⭐ | 预计阅读：28 分钟
>
> 系统讲解 PAM 四大核心能力（凭据保险柜/会话管理/权限提升/JIT访问）、主流商业与开源方案对比、Teleport 开源堡垒机实战部署及特权账户全生命周期管理，覆盖国内外信创合规要求。

---

## 导航目录

- [一、PAM 核心能力](#一pam-核心能力)
- [二、凭据管理技术](#二凭据管理技术)
- [三、会话管理与审计](#三会话管理与审计)
- [四、JIT 与零常权](#四jit-与零常权)
- [五、主流方案对比](#五主流方案对比)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 一、PAM 核心能力

```
PAM (Privileged Access Management) 四大核心：

  1. 凭据保险箱 (Credential Vault)
     集中存储特权账户凭据，自动轮换密码

  2. 会话代理 (Session Proxy)
     代理所有特权会话，不暴露目标凭据给用户

  3. 权限管控 (Privilege Control)
     命令过滤/权限提权审批/JIT最小权限

  4. 审计录像 (Session Recording)
     全量操作录像/命令审计/实时告警
```

---

## 二、特权账户类型与管理

### 2.1 账户分类

```
特权账户全景：
├── 系统管理员账户
│   ├── root (Linux), Administrator (Windows)
│   ├── 域管理员 (Domain Admin)
│   └── 本地管理员 (Local Admin)
├── 应用账户 (Application/Service Accounts)
│   ├── 数据库 (sa/oracle/postgres)
│   ├── 中间件 (WebLogic/WebSphere/Tomcat)
│   ├── CI/CD (Jenkins/GitLab Runner/K8s SA)
│   └── 云服务 IAM (AWS IAM Role/GCP SA)
├── 网络设备账户
│   ├── enable/configure 模式
│   └── SNMP 读写团体字
├── 第三方/供应商账户
│   └── VPN + 堡垒机审批
└── 紧急账户 (Break Glass)
    └── 物理保险柜封存，多人开启
```

### 2.2 密码自动轮换

```python
# 堡垒机凭据轮换逻辑 (伪代码)
class PasswordRotation:
    def rotate(self, account: str, target: str):
        """自动轮换凭据"""
        # 1. 检查目标可达性
        if not self.check_connectivity(target):
            raise Exception("Target unreachable, skip rotation to avoid locking")
        
        # 2. 锁定账户（防止并发修改）
        self.acquire_lock(account)
        
        try:
            # 3. 连接目标（使用当前凭据）
            client = self.connect(target, current_credential)
            
            # 4. 生成新密码
            new_password = self.generate_password(
                length=32,
                uppercase=True, lowercase=True,
                digits=True, symbols="!@#$%^&*"
            )
            
            # 5. 修改密码
            client.change_password(account, new_password)
            
            # 6. 验证新密码可用
            self.verify_connectivity(target, new_password)
            
            # 7. 更新保险柜
            self.vault.update(account, new_password)
            
            # 8. 同步到依赖方（如更新服务配置）
            self.notify_dependents(account)
        finally:
            self.release_lock(account)
    
    def generate_password(self, length=32, **char_sets):
        """强密码生成：满足各平台复杂度要求"""
        import secrets, string
        
        alphabet = ""
        if char_sets.get('uppercase'): alphabet += string.ascii_uppercase
        if char_sets.get('lowercase'): alphabet += string.ascii_lowercase
        if char_sets.get('digits'): alphabet += string.digits
        if char_sets.get('symbols'): alphabet += "!@#$%^&*"
        
        return ''.join(secrets.choice(alphabet) for _ in range(length))
```

---

## 三、JIT 最小权限 (Just-in-Time)

```
传统模式 vs JIT 模式：

传统：
  用户 → "我是运维，给我root权限" → 永久赋予 → 长期风险

JIT：
  用户 → "我需要root权限，原因：给DB打补丁/工单#12345"
       → 审批(Epic/Geneva + 上级+安全部) 
       → 临时授权(有效期2小时) 
       → 过期自动撤销
       → 操作录像可供审计

实现方式：
  1. 堡垒机 JIT：审批后临时加入sudoers，到期移除
  2. 云IAM JIT：AWS IAM临时凭据(STS AssumeRole)，有效期≤1小时
  3. K8s JIT：临时ClusterRoleBinding，到期自动删除
```

---

## 四、会话代理与审计

### 4.1 堡垒机会话代理

```
SSH代理流程：
  用户 → 堡垒机(SSH网关) → 目标服务器

  1. 用户SSH到堡垒机身份验证
  2. 堡垒机检查授权策略
  3. 堡垒机使用托管凭据SSH到目标
  4. 全程录像(script/ttyrec/auditd)
  5. 命令过滤：危险命令实时阻断或告警

数据库代理：
  用户 → 堡垒机(DB Proxy) → 数据库

  MySQL/PostgreSQL代理（如Teleport DB Access）：
  - 不暴露数据库地址和密码
  - SQL审计全量记录
  - 危险SQL拦截(DROP TABLE/ALTER USER)
```

### 4.2 审计录像回放

```bash
# Linux auditd 审计配置
# /etc/audit/rules.d/pam.rules
-a always,exit -F arch=b64 -S execve -k command_exec
-w /etc/passwd -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/sudoers -p wa -k sudoers
-w /var/log/lastlog -p wa -k login

# 搜索某用户的所有命令执行
ausearch -ui zhangsan -k command_exec --format text

# 堡垒机自动回放
# TTYrec/tmux/screen 录像
# 搜索关键操作: "rm -rf", "DROP TABLE", "shutdown"
```

---

## 五、主流方案对比

| 产品 | 类型 | 核心优势 | 说明 |
|------|------|---------|------|
| **CyberArk PAM** | 商业 | 市场领导者，功能最全 | 大型金融/政务 |
| **BeyondTrust P-Series** | 商业 | 漏洞管理+PAM整合 | 中大型企业 |
| **Delinea (Thycotic)** | 商业 | 性价比高，易部署 | 中型企业 |
| **Teleport** | 开源 | 云原生、K8s友好 | 技术公司/云原生 |
| **Apache Guacamole** | 开源 | 无客户端RDP/SSH/VNC | 中小型/概念验证 |
| **齐治堡垒机** | 商业(国产) | 信创适配、密评支持 | 国内政务/金融 |
| **安恒明御** | 商业(国产) | 数据库审计+堡垒机一体化 | 国内企业 |
| **麒麟堡垒机** | 商业(国产) | 国产化全栈 | 信创环境 |

### Teleport 部署示例

```bash
# Teleport快速部署
curl https://goteleport.com/static/install.sh | bash -s 16.0.0

# 启动Auth/Proxy服务
teleport start \
  --roles=auth,proxy,node \
  --auth-server=localhost:3025 \
  --token=my-join-token

# 创建用户和角色
tctl users add zhangsan --roles=editor --logins=root,ubuntu

# 启用会话录像
# teleport.yaml
teleport:
  auth_service:
    session_recording: "node"    # 节点级录像
```

---

## 六、Checklist

- [ ] 特权账户全量盘点（系统/应用/网络/云）
- [ ] 部署凭据保险柜（密码集中管理）
- [ ] 自动密码轮换（特权账户/应用账户）
- [ ] 会话代理（不直接暴露目标凭据）
- [ ] 全量会话录像与审计
- [ ] 命令过滤(Dangerous Command Interception)
- [ ] JIT最小权限（按需临时授权）
- [ ] 紧急访问(Break Glass)流程
- [ ] 第三方/供应商访问管控
- [ ] 特权账户定期审计（≥月度）
- [ ] SIEM同步特权操作日志
- [ ] 异常行为实时告警（非工作时间特权操作）

---

## 七、高分考点与知识巧记

### 高分考点速查表

| 序号 | 考点 | 频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
| 1 | PAM 四大核心能力 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | 凭据保险柜/会话管理/权限提升/JIT访问 |
| 2 | JIT 零常权原则 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 默认无权限→按需申请→审批后临时授权→到期自动收回 |
| 3 | 会话审计要素 | ⭐⭐⭐⭐ | ⭐⭐⭐ | 录像+命令记录+操作回放+异常告警 |
| 4 | 凭据轮换策略 | ⭐⭐⭐⭐ | ⭐⭐⭐ | 自动轮换(密码/密钥/证书)、轮换周期≤90天 |
| 5 | Break Glass 紧急访问 | ⭐⭐⭐ | ⭐⭐⭐⭐ | 紧急情况下绕过审批流程，事后全量审计 |
| 6 | 国产堡垒机合规 | ⭐⭐⭐ | ⭐⭐⭐ | 等保/密评/信创，齐治/安恒/麒麟 |

### 知识巧记口诀

> 🎵 **PAM 四件套**："存凭据、管会话、升权限、JIT给"
>
> 🎵 **JIT 流程**："申请→审批→授权→用完即收"
>
> 🎵 **特权安全铁律**："零常权、全录像、定期审、急有路"

---

### 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
| "堡垒机=PAM" | ❌ 堡垒机是PAM的一部分（会话管理），PAM还包括凭据保险柜、JIT、权限分析 |
| "JIT 就是临时授权" | ❌ JIT 更强调"零常权"——常态下没有任何特权，每次都需要申请 |
| "Break Glass 可以随便用" | ❌ 紧急访问必须事后全量审计，滥用需追责，且触发最高级别告警 |

---

> **PAM 守护的是"王国的钥匙"——特权账户是企业最危险的安全盲区，JIT+零常权是唯一正确的打开方式。**
