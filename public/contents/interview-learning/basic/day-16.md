# Day 16：访问控制模型进阶

> 🎯 面试目标：深入掌握DAC/MAC/RBAC/ABAC四种访问控制模型、动态访问控制和面试高阶考点

## 知识速览

### 核心概念
- **DAC(自主访问控制)**：资源所有者自主决定访问权限(如Linux chmod 755)，灵活但易权限蔓延，无法集中管控
- **MAC(强制访问控制)**：系统强制策略决定访问(如SELinux/AppArmor)，基于安全标签，严格但配置复杂，适用于军事/政府
- **RBAC(基于角色的访问控制)**：权限绑定到角色而非用户，简化管理，NIST标准模型(RBAC0→RBAC1层级→RBAC2约束→RBAC3混合)
- **ABAC(基于属性的访问控制)**：动态评估用户属性+资源属性+环境属性+动作属性→策略决策，最灵活，核心是XACML策略语言
- **PBAC(基于策略的访问控制)/ReBAC(基于关系的访问控制)**：PBAC是ABAC的策略驱动实现，ReBAC适用于社交图谱场景(如Google Zanzibar)

### 必问考点
| 面试官可能怎么问 | 你应该怎么答 |
|------------------|--------------|
| RBAC和ABAC各适合什么场景？如何选型？ | RBAC适合：角色相对稳定的企业(如银行：柜员/主管/经理)，权限模型简单，用户量大但角色种类少。ABAC适合：需要细粒度动态控制的场景(如：'仅允许工作时间从公司IP访问PII数据')，属性维度多(时间/地点/设备/数据分类)。趋势：大型企业往往RBAC(粗粒度)+ABAC(细粒度补充)混合使用。 |
| SELinux的三种模式及其区别？ | Enforcing(强制模式)：违反策略的操作被拒绝并记录日志。Permissive(宽容模式)：不拒绝但记录违反日志(调试用)。Disabled：完全关闭。面试关键点：SELinux基于类型强制(TE)+多级安全(MLS)+多类别安全(MCS)，核心是'默认拒绝'——只有策略显式允许的才能执行。 |
| Privilege Creep(权限蔓延)是什么？如何治理？ | 权限蔓延：员工换岗/升职过程中不断累积权限而旧权限未回收→大量用户拥有不必要的高权限→攻击者一旦获取得手。治理方案：1)定期权限认证(每季一次) 2)自动化权限审查(工具：SailPoint/Okta IGA) 3)基于角色的入职/转岗/离职(JML)流程自动化 4)异常权限告警(如：'你部门平均权限数5个，你有15个')。 |
| Google Zanzibar为什么被认为是最先进的授权系统？ | Zanzibar核心设计：1)基于关系图的数据模型(userset:=object#relation) 2)支持群体成员(如'group:eng#member包含user:bob') 3)支持Zookies(一致性令牌)防止TOCTOU竞态 4)亚10ms延迟+99.999%可用性。面试展示：了解Zanzibar的设计权衡——全局一致性vs性能，它选择了低延迟(使用分布式缓存+最终一致性检查)。 |
| 什么是JIT(Just-In-Time)权限访问？和传统静态权限有什么不同？ | JIT：平时用户没有高权限，需要时经过审批→临时授予(通常1-4小时)→超时自动回收。对比静态权限：减少常驻攻击面、满足合规(定期认证)、支持零信任理念。实现：AWS IAM通过AssumeRole获取临时凭证(STS Token)、HashiCorp Vault动态数据库凭证。 |

### 技术细节
**SELinux策略紧急排查实战**：
```bash
# 1. 查看当前SELinux状态
getenforce
sestatus

# 2. 查看最近的拒绝日志
ausearch -m avc -ts recent | grep denied
sealert -a /var/log/audit/audit.log

# 3. 分析具体拒绝原因
audit2why < /var/log/audit/audit.log

# 4. 临时放行(调试用)
audit2allow -a -M my_policy
semodule -i my_policy.pp

# 5. 永久策略修改
semanage fcontext -a -t httpd_sys_content_t "/web/custom(/.*)?"
restorecon -Rv /web/custom
```
**访问控制审计视角**：SOC团队应关注的异常访问模式——非工作时间的高权限访问、地理异常登录、权限提升后的横向移动、敏感数据的大批量访问。

## 常见陷阱
- ⚠️ 把SELinux当bug处理而不是安全特性——遇到SELinux拒绝就关掉(Permissive/Disabled)，这是最常见的运维反模式
- ⚠️ RBAC角色爆炸——过度细分角色导致成千上万个角色→退化为变相的DAC，需要定期合并相似角色
- ⚠️ 忽视第三方/API访问控制——OAuth2.0的scope设计不当可能导致过度授权(如：一个只需要读头像的应用获得了写Posts权限)

## 今日检测
1. 在Linux虚拟机上启用SELinux Enforcing模式，部署一个简单Web服务，排查所有AVC拒绝
2. 用draw.io画一个你公司的RBAC角色层级图，标注各角色的最小权限
3. 研究一个你常用的SaaS应用的权限模型(如Notion/GitHub)，分析它的授权粒度
