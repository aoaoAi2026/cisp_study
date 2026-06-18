# Day 10：身份与访问管理(IAM)
> [IAM面试核心] 零信任身份模型/IAM四大组件/SSO/MFA/条件访问
## 核心知识点
### Q: IAM(身份与访问管理)的核心组件和零信任身份模型
IAM四大组件：①认证(Authentication)你是谁→AD/LDAP/SAML/OIDC ②授权(Authorization)你能做什么→RBAC/ABAC/PBAC ③身份生命周期管理→入职自动创建/调岗自动调整/离职自动回收 ④审计与合规→谁在什么时候做了什么

零信任身份原则：身份是新的边界→不再信任内网IP→每次访问都验证身份→最小权限(Just-in-Time/JIT访问)→持续验证(即使登录了也持续评估→如果行为异常→撤销会话)

面试举例：Google BeyondCorp从2011年起实践零信任→员工不需要VPN→通过身份感知代理(Identity-Aware Proxy)统一接入→基于设备+用户+上下文做动态授权
## 面试陷阱
- IAM不是只有SSO——权限回收/周期性权限审计(Access Review)更重要
- 零信任不是产品而是一种架构思维——说买了某个厂商就是零信任暴露你对概念理解肤浅

## 今日检测
1. 用Azure AD或Okta免费版体验条件访问策略配置
2. 审计你所在公司的AD→列出特权组(Domain/Enterprise Admins)成员→评估是否有过度授权
