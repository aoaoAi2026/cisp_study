# HW 行动前资产梳理与风险自查 Checklist

> 开战前 7 天内完成。每一项都应在工单系统中留下完成记录与责任人。

## 1. 资产清单

- [ ] 完整业务系统清单（含名称、负责人、承载业务、优先级 T0/T1/T2）
- [ ] 公网 IP 段 / 域名列表（含子域名）
- [ ] 云资产清单（ECS/OSS/RDS/SLB/VPC 等）
- [ ] IDC / 机房资产清单
- [ ] 第三方厂商 / 外包系统资产（代运维、SaaS 化系统）
- [ ] 对外开放端口与服务清单（80/443/22/3389/3306/6379 等）
- [ ] 内部网段与 VLAN 规划
- [ ] 网络拓扑图（最新版）
- [ ] 安全设备清单（防火墙 / WAF / IPS / 日志平台 / EDR）

## 2. 账号与认证

- [ ] 统一梳理所有系统管理员账号
- [ ] 停用离职 / 外包人员账号
- [ ] 关键系统启用双因素认证（MFA / 动态令牌）
- [ ] 检查默认口令 / 弱口令（admin/admin、root/123456 等）
- [ ] 禁用共享账号 / test/guest 账号
- [ ] SSH 禁止 root 远程直接登录（PermitRootLogin no）
- [ ] Windows 本地管理员账号改名 + 强口令

## 3. 端口与服务最小化

- [ ] 关闭所有非必要对外端口
- [ ] Redis / Memcached / MongoDB / Elasticsearch 不对外暴露
- [ ] 数据库监听限制内网源 IP 访问
- [ ] RMI / JMX / Dubbo 管理端口不对外暴露
- [ ] Docker API 默认 2375 端口不得对外
- [ ] K8s API Server 限制来源与启用 TLS 客户端认证
- [ ] NTP/DNS/ICMP 仅对必要对象开放

## 4. 常见漏洞与 1day 核查

- [ ] Log4j2 CVE-2021-44228 版本核查（升级或临时补丁）
- [ ] Spring Framework RCE（CVE-2022-22965）
- [ ] ThinkPHP 5.x RCE、SQL 注入
- [ ] Shiro 550 / 721 反序列化
- [ ] Fastjson 反序列化
- [ ] Solr / Druid / Elasticsearch 未授权访问与 RCE
- [ ] Apache HTTP Server（CVE-2021-41773/42013）
- [ ] Nginx 解析漏洞 / 目录穿越
- [ ] Exchange Server（ProxyShell / ProxyNotShell 等）
- [ ] Confluence / Jira（CVE-2022-26134 等）
- [ ] VMware vCenter / Horizon 系列漏洞
- [ ] OpenSSH 高危版本（CVE-2024-6387 regreSSHion 等）

## 5. 弱口令 / 默认凭据扫描

- [ ] SSH 弱口令
- [ ] RDP 弱口令
- [ ] MySQL / PostgreSQL / MSSQL / MongoDB / Redis 弱口令
- [ ] Web 管理后台（admin / manager / console 等）
- [ ] VPN / OA / 邮件系统弱口令
- [ ] API / Token / SecretKey 硬编码检查
- [ ] Git 仓库历史泄漏凭据检查（gitleaks / trufflehog）

## 6. Web 应用安全

- [ ] 全站 HTTPS；HTTP 301 跳转 HTTPS
- [ ] HSTS 响应头启用
- [ ] 关键 Cookie 设置 HttpOnly / Secure / SameSite
- [ ] 文件上传目录不可执行、限制大小与后缀
- [ ] 后台管理接口限制源 IP / VPN
- [ ] 登录失败锁定策略
- [ ] WAF 已部署并开启默认规则
- [ ] 接口鉴权校验，防止越权（IDOR）
- [ ] 禁用 Swagger / Actuator / Druid 对外暴露
- [ ] 日志脱敏（身份证、手机号、密码等）

## 7. 日志与监测

- [ ] 关键服务器日志（登录/进程/网络/文件）集中收集
- [ ] Web 访问日志开启并集中存储（>6 个月）
- [ ] 数据库审计日志开启（失败登录、管理操作等）
- [ ] 防火墙 / WAF / IPS 日志上送 SIEM
- [ ] 告警通道（短信/邮件/微信/电话）已验证可用
- [ ] 值班人员已熟悉告警查看与研判流程

## 8. 备份与应急

- [ ] 核心数据库每日备份 + 异地存储 + 定期还原演练
- [ ] 关键 Web 应用代码/镜像备份
- [ ] 应急账号与应急访问通道预先获批
- [ ] 应急预案/处置手册打印并分发
- [ ] 各系统负责人 7×24 联系方式表

## 9. 外包与供应链

- [ ] 第三方供应商 VPN / 跳板机访问权限最小化
- [ ] 外包账号使用期限 + 强口令 + 审计
- [ ] 第三方接口调用鉴权、频率限制、签名校验
- [ ] 供应链组件（npm/pip/maven/golang）已知漏洞核查：npm audit / Trivy

## 10. 安全意识与培训

- [ ] 护网前全员安全意识邮件/短信提醒（勿点击陌生邮件附件与链接）
- [ ] 关键运维/开发/财务岗位重点提醒
- [ ] 防钓鱼专项演练（如有条件）

## 完成记录

| 检查项 | 完成日期 | 责任人 | 备注 |
|--------|---------|--------|------|
| 资产清单 | | | |
| 账号与认证 | | | |
| 端口与服务 | | | |
| 漏洞核查 | | | |
| 弱口令扫描 | | | |
| Web 应用 | | | |
| 日志与监测 | | | |
| 备份与应急 | | | |
| 外包与供应链 | | | |
| 安全意识 | | | |
