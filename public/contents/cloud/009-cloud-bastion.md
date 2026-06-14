# 云堡垒机与零信任运维安全

> **📘 文档定位**：CISP 考试运维安全核心内容 | 难度：⭐⭐⭐⭐ | 预计阅读：20 分钟
> 堡垒机是运维安全的最后一道闸门。本文从传统运维四大顽疾、堡垒机八大核心能力、零信任三原则到高危命令拦截实践，全面梳理安全运维体系。

---

## 导航目录
- [一、运维安全面临的核心问题](#一运维安全面临的核心问题)
- [二、云堡垒机（JumpServer）核心能力](#二云堡垒机jumpserver核心能力)
- [三、零信任架构（ZTNA）的三个核心原则](#三零信任架构ztna的三个核心原则)
- [四、典型部署与配置实战](#四典型部署与配置实战)
- [五、审计与应急响应](#五审计与应急响应)
- [六、常见问题与应对](#六常见问题与应对)
- [七、落地 CheckList](#七落地-checklist)
- [八、高分考点与知识巧记](#八高分考点与知识巧记)

---

## 一、运维安全面临的核心问题

传统运维方式存在**四大顽疾**：

1. **账号管理混乱**：多对多映射——多工程师登录同一 server，一工程师登录多 server，无审计
2. **密码 / 密钥分散**：密钥保存在本地、微信、Wiki、LastPass；离职后权限未及时回收
3. **高危操作无拦截**：`rm -rf /`、`DROP TABLE`、`iptables -F` 直接执行
4. **无统一入口**：SSH 公网裸奔、RDP 未走 VPN、数据库 3306 公网暴露

## 二、云堡垒机（JumpServer）核心能力

| 模块 | 能力 | 实现方式 |
|------|------|---------|
| 统一入口 | 一台堡垒机接入所有资产 | 公网→堡垒机→内网资产 |
| 账号管理 | 集中纳管主机、数据库、K8s、Web | 协议代理：SSH / RDP / Telnet / MySQL / K8s API |
| 权限控制 | 基于用户 / 角色 / 部门的最小权限 | RBAC + 授权工单 |
| 会话审计 | 全程录像 + 命令级记录 | 视频回放 + OCR 文字搜索 |
| 命令拦截 | 高危命令黑名单 / 白名单 | 正则匹配 + 二次确认 |
| 双因子认证 | 登录 + 主机二次 MFA | TOTP / 硬件 Key / 短信 |
| 自动改密 | 主机密码 / 数据库密码自动轮换 | 调度任务 + KMS 加密存储 |
| 工单审批 | 高权限访问需审批 | 钉钉 / 飞书 / 邮件工作流 |

## 三、零信任架构（ZTNA）的三个核心原则

```
1) 永不信任，始终验证（Never Trust, Always Verify）
   - 即使来自内网，也需完整身份 + 设备 + 网络校验

2) 基于最小权限的访问控制（Least Privilege）
   - 每个连接都是"按需授权"，时间窗口 + IP 绑定 + 动作受限

3) 假设被攻破（Assume Breach）
   - 任何一次访问都被审计、加密、记录；横向移动被阻止
```

### 3.1 零信任落地参考架构

```
  +----------+     +-------------+     +------------+     +-----------+
  |   用户    |────▶│  IdP (SSO)  │────▶│   堡垒机    │────▶│  目标资产  │
  +----------+     +-------------+     +------------+     +-----------+
         │                │                  │                  │
         │                │                  │                  │
       MFA         身份+设备健康       RBAC+命令审计       短时动态凭证
    (TOTP/FIDO)   (MDM/EDR 状态)     (工单+IP白名单)   (SSH Cert / JWT)
```

## 四、典型部署与配置实战

### 4.1 资产纳管方式

```bash
# 1. 纳管 Linux 主机（SSH 协议）
#   - 基于密钥：堡垒机生成密钥对，公钥写入目标主机 ~/.ssh/authorized_keys
#   - 基于密码：堡垒机保存密码（必须使用 HSM/KMS 加密）
#   - 推荐：SSH 证书认证（OpenSSH 5.4+ 支持），短期有效期

# 2. 纳管 Windows 主机（RDP 协议）
#   - AD 域账号统一管理
#   - 禁止本地 Administrator 直登

# 3. 纳管数据库（MySQL / PostgreSQL / Redis / MongoDB）
#   - 通过协议代理，数据库密码对运维不可见
#   - 高危 DML/DDL 需审批：DROP / TRUNCATE / DELETE without WHERE
```

### 4.2 高危命令拦截规则示例

```yaml
# rules.yml - 高危命令黑白名单
blacklist:
  - pattern: "^rm\\s+-rf\\s+/.*"          # rm -rf / 及子目录
    action: block                          # 直接拦截不允许执行
    alert: true

  - pattern: "^(reboot|shutdown|init\\s+0)" # 关机/重启
    action: confirm                        # 二次确认
    approvers: [leader-oncall]

  - pattern: "^iptables\\s+-F|^firewall-cmd\\s+--permanent\\s+--remove"
    action: block                          # 防火墙策略操作

  - pattern: "DROP\\s+TABLE|TRUNCATE|DELETE\\s+FROM\\s+\\w+\\s*(?!.*WHERE)"
    action: ticket                         # 必须先走审批工单
```

### 4.3 SSO 对接 Keycloak（零信任统一认证）

```bash
# 在堡垒机配置 SAML/OIDC 对接企业 IdP：
#   SSO URL:     https://idp.corp.com/auth/realms/ops/protocol/saml
#   Entity ID:   https://bastion.corp.com/
#   NameID:      EmailAddress
#   Attributes:  username, department, mfa_enabled, device_health
#
# 额外策略：设备必须满足 EDR 在线 + 不在境外 IP + 未越狱
# Keycloak 自定义 Authenticator 调用 EDR API 查询状态
```

## 五、审计与应急响应

```bash
# 典型审计查询（堡垒机内置搜索）
# 1. 过去 24 小时执行过 rm / drop 的会话
SELECT * FROM audit_cmd
WHERE cmd ~ '(^rm\\s|DROP\\s+TABLE|TRUNCATE)'
  AND created_at > now() - interval '24h';

# 2. 按用户统计高危操作数量（Top 10）
SELECT username, count(*) cnt
FROM audit_cmd
WHERE risk_level in ('HIGH', 'CRITICAL')
GROUP BY username ORDER BY cnt DESC LIMIT 10;

# 3. 会话录像回放索引（OCR 文本搜索）
SELECT session_id, user, start_time, end_time
FROM session_ocr
WHERE text LIKE '%password%' OR text LIKE '%secret%';
```

## 六、常见问题与应对

| 风险场景 | 应对策略 |
|---------|---------|
| 堡垒机自身被攻陷 | 1) 堡垒机独立 VPC + 限制源 IP 白名单；2) 关键命令走二次审批；3) 堡垒机本身也要装 EDR + 做补丁管理 |
| 工程师绕过堡垒机直连主机 | 1) 安全组默认禁止 22/3389 公网；2) 主机级 iptables 仅允许堡垒机 CIDR；3) 主机 sshd_config 仅接受堡垒机签发的 SSH 证书 |
| 数据库超级密码被滥用 | 1) DBA 登录数据库走堡垒机协议代理，密码不可复制；2) DDL / DROP 自动创建审批工单；3) 数据库开启审计插件 |
| 应急场景需要跳开审批 | 维护"紧急通道"：P1 故障单 + 双岗确认 + 审计加标记"EMERGENCY"，事后复盘 |

## 七、落地 CheckList

- [ ] 所有公网 22 / 3389 / 数据库端口关闭，仅堡垒机可达
- [ ] 工程师个人主机 SSH 密钥禁用，统一走堡垒机下发证书
- [ ] 强制登录 + 操作双因子 MFA
- [ ] 高危命令（rm -rf /、DROP TABLE、iptables -F）必须二次确认或审批
- [ ] 会话录像 + OCR 全文检索，保留 ≥ 180 天
- [ ] 主机密码 / 数据库密码每 90 天自动轮换
- [ ] 堡垒机独立 VPC，安全组仅放通办公网 + VPN
- [ ] 建立"绕过堡垒机直连"自动巡检机制（每日扫描 22/3389 直连）

---

## 八、高分考点与知识巧记

> 🔑 **高分考点**：堡垒机与零信任是 CISP 运维安全核心考点。零信任三原则、堡垒机八大能力、高危命令拦截机制是高频考点。考试常出场景题——"某运维人员绕过堡垒机直连服务器，应如何防范？"

| 考点 | 频次 | 核心记忆点 |
|:---|:---:|:---|
| 零信任三原则 | ⭐⭐⭐⭐⭐ | 永不信任始终验证、最小权限、假设被攻破 |
| 堡垒机核心能力 | ⭐⭐⭐⭐ | 统一入口、账号管理、权限控制、会话审计、命令拦截、MFA、自动改密、工单审批 |
| 高危命令拦截 | ⭐⭐⭐⭐ | rm -rf /、DROP TABLE、iptables -F、reboot/shutdown |
| 绕过防护 | ⭐⭐⭐⭐ | 安全组禁 22/3389、iptables 白名单、SSH 证书认证 |
| 会话审计 | ⭐⭐⭐ | 全程录像 + OCR 检索，保留 ≥ 180 天 |

> 💡 **知识巧记**：零信任三原则记"永最假"——永不信任、最小权限、假设被攻破。堡垒机八能力记"统账权审令双改工"——统一入口、账号管理、权限控制、会话审计、命令拦截、双因子认证、自动改密、工单审批。高危命令四大忌：删根(rm -rf /)、删表(DROP TABLE)、清墙(iptables -F)、关机(reboot)。

### 高分考点速查表

| 考察维度 | 关键结论 | 常见干扰项 |
|:---|:---|:---|
| 零信任 vs 传统 | 即使内网也不信任，每次访问完整验证 | "内网就是安全区域" ❌ |
| 堡垒机本质 | 统一运维入口 + 协议代理 + 全程审计 | "堡垒机只是跳板机" ❌ |
| 防绕过 | 安全组 + iptables + SSH 证书三重防护 | "只靠制度约束即可" ❌ |
| SSH 证书 vs 密钥 | 证书短期有效、集中签发、可吊销 | "SSH 密钥和证书一样" ❌ |
| 紧急通道 | P1 故障单 + 双岗确认 + 标记 EMERGENCY | "紧急情况可跳过所有审批" ❌ |

### 知识巧记口诀

> **堡垒机零信任口诀**：
> 零信任三则永最假，内网外网同验证。
> 堡垒八能统账权审令双改工，全程录像可回溯查。
> 高危命令四不碰，删根删表清墙关。
> 防绕过三重锁，安全组 iptables 证书加。
> 紧急通道双岗确，事后复盘不可落。
