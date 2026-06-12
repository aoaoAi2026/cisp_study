# SOC 自动化响应剧本 Top 10 模板

> 📅 2026-06-12 | 🎯 精通 | ⏱ 25 min | 分类：安全运营/SOC

## 📋 提纲

1. Playbook 设计原则
2. 钓鱼邮件自动处置
3. 暴力破解自动封禁
4. EDR恶意告警自动取证
5. DGA域名检测与阻断
6. 可疑进程自动隔离
7. 数据外泄自动拦截
8. 漏洞扫描结果自动派单
9. 新IOC自动回溯搜索
10. VPN异常登录自动锁定
11. 蜜罐告警自动情报富化

---

## 1. Playbook 设计原则

```
好的Playbook = 触发条件清晰 + 决策逻辑简单 + 执行步骤原子化 + 可回滚

每条Playbook包含：
├─ 触发条件 (Trigger)
├─ 决策逻辑 (Decision Tree)
├─ 执行步骤 (Actions)
├─ 回滚方案 (Rollback)
└─ 通知规则 (Notification)
```

---

## Playbook 1: 钓鱼邮件自动处置

**触发条件**：SIEM检测到钓鱼邮件告警

```
[触发] 钓鱼邮件告警
   ↓
[Step 1] 提取IOC（发件人/IP/URL/附件Hash）
   ↓
[Step 2] 多引擎检测（VT/AbuseIPDB/OTX）
   ↓
[Step 3] 判定
   ├─ 确认钓鱼 → [Step 4] 自动处置
   └─ 不确定 → [Step 5] 创建Tier2工单
   ↓
[Step 4] 自动处置
   ├─ 撤回所有同类邮件
   ├─ 封禁发件人域名/IP
   ├─ 检查是否有员工点击 → 隔离终端
   └─ 创建工单 + 钉钉通知
   ↓
[Step 5] 回滚条件：误判 → 解封IP/域名 + 撤回工单
```

---

## Playbook 2: 暴力破解自动封禁

**触发条件**：同一IP对SSH/RDP/VPN失败登录≥20次/5min

```
[触发] 暴力破解告警
   ↓
[决策] 源IP判断
   ├─ 内网IP → 不封禁，创建高优先级工单
   └─ 外网IP → 继续
   ↓
[Step 1] 威胁情报查询（OTX + AbuseIPDB）
   ↓
[Step 2] 自动封禁（iptables + 防火墙API）
   ↓
[Step 3] 检查是否有成功登录
   ├─ 有成功登录 → 启动P1应急 + T3通知
   └─ 无成功登录 → 记录工单 + 24h解封
   ↓
[Step 4] 通知：钉钉群 + Tier2工单
```

---

## Playbook 3: EDR恶意告警自动取证

**触发条件**：EDR检测到恶意软件/可疑进程

```
[触发] EDR告警（Malware/Inject/Mimikatz）
   ↓
[Step 1] 确认Agent在线 → 下发收集指令
   ├─ 进程列表 (tasklist / ps aux)
   ├─ 网络连接 (netstat -an)
   ├─ 进程内存dump (Sysinternals procdump / gcore)
   ├─ 文件Hash (sha256)
   └─ 注册表/自启动项
   ↓
[Step 2] 自动分析
   ├─ Hash → VT/MISP查询
   ├─ 网络连接 → 威胁情报匹配
   └─ 内存dump → Volatility自动分析（可选）
   ↓
[Step 3] 判定
   ├─ 确认恶意 → 隔离终端 + P1工单
   ├─ 可疑 → 加强监控 + P2工单
   └─ 误报 → 白名单 + 规则调优
   ↓
[Step 4] 通知 Tier2 + 相关业务负责人
```

---

## Playbook 4: DGA域名检测与阻断

**触发条件**：Zeek/Suricata检测到疑似DGA域名

```
[触发] DGA域名告警
   ↓
[Step 1] 域名特征分析
   ├─ 熵值计算（>3.5 = DGA特征）
   ├─ NXDOMAIN响应率
   └─ 域名Whois（新注册？隐私保护？）
   ↓
[Step 2] 关联受影响主机
   ├─ DNS查询源IP → 主机名
   └─ 过去24h该主机的其他行为
   ↓
[Step 3] 判定
   ├─ 确认DGA → 自动封禁域名 + 隔离主机 + P1工单
   └─ 不确定 → 加强DNS监控 + P2工单
   ↓
[Step 4] 通知 + IOC同步MISP
```

---

## Playbook 5: 可疑进程自动隔离

**触发条件**：检测到未知/可疑进程执行

```
[触发] 可疑进程告警
   ↓
[Step 1] 进程Hash → VT检测
   ↓
[Step 2] 进程行为分析
   ├─ 网络连接（外联IP/端口）
   ├─ 子进程（是否有下载执行）
   ├─ 文件操作（Release目录）
   └─ 注册表修改
   ↓
[Step 3] 判定
   ├─ VT检出≥5 → 恶意 → 隔离 + 内存dump
   ├─ 首次出现+外联 → 可疑 → 加强监控
   └─ 已知正常 → 白名单
   ↓
[Step 4] 隔离操作
   ├─ Wazuh Active Response 断网
   ├─ EDR进程终止
   └─ 防火墙出站规则阻断
```

---

## Playbook 6: 数据外泄自动拦截

**触发条件**：检测到大量数据外传（>100MB/10min）

```
[触发] 大量数据外传告警
   ↓
[Step 1] 确认外传信息
   ├─ 源主机 + 进程
   ├─ 目标IP/域名 + 端口
   ├─ 传输量 + 时长
   └─ 协议（HTTP/DNS/FTP/Cloud API）
   ↓
[Step 2] 判定
   ├─ 目标为已知云存储（aliyun OSS/AWS S3）→ 可能正常
   ├─ 目标为境内IP → 低风险
   ├─ 目标为境外IP+非标准端口 → 高风险
   └─ 敏感文件路径 → 高风险
   ↓
[Step 3] 高风险处置
   ├─ 立即阻断网络连接
   ├─ 隔离源主机
   ├─ P1工单 + T3通知
   └─ 启动数据泄露应急
   ↓
[Step 4] 低风险处置
   └─ 创建P2工单 + 人工核实
```

---

## Playbook 7: 漏洞扫描结果自动派单

**触发条件**：漏洞扫描完成，发现新漏洞

```
[触发] 漏洞扫描完成
   ↓
[Step 1] 解析扫描结果
   ├─ Critical: 立即处理
   ├─ High: 24h内派单
   ├─ Medium: 周报汇总
   └─ Low: 季度处理
   ↓
[Step 2] 资产信息匹配（CMDB）
   ├─ 资产负责人
   ├─ 业务系统
   └─ 是否为公网资产
   ↓
[Step 3] 自动创建Jira/工单
   ├─ 标题: [漏洞] {CVE-ID} - {资产名称}
   ├─ 到期日: SLA计算
   └─ 分配给: 资产负责人
   ↓
[Step 4] 周报/月报自动生成
```

---

## Playbook 8: 新IOC自动回溯搜索

**触发条件**：威胁情报平台推送新IOC

```
[触发] 新IOC入库（IP/域名/Hash）
   ↓
[Step 1] IOC去重（避免重复搜索）
   ↓
[Step 2] 全量ES回溯（7天/30天/90天可选）
   ├─ IP → 防火墙/代理/DNS日志
   ├─ 域名 → DNS/代理日志
   └─ Hash → EDR/文件系统日志
   ↓
[Step 3] 发现匹配
   ├─ 有匹配 → 告警 + 调查该主机
   └─ 无匹配 → 仅记录
   ↓
[Step 4] IOC加入检测规则（Sigma+Wazuh+防火墙）
```

---

## Playbook 9: VPN异常登录自动锁定

**触发条件**：UEBA检测到VPN异常登录

```
[触发] VPN异常登录（异常时间/地理位置/设备）
   ↓
[Step 1] 异常判定
   ├─ 境外登录（该用户从未境外登录）
   ├─ 凌晨3点登录（正常9-18点）
   └─ 新设备指纹
   ↓
[Step 2] 确认
   ├─ 单一异常 → 加强监控 + 邮件通知用户
   └─ 多重异常 → 高风险
   ↓
[Step 3] 高风险处置
   ├─ 立即踢出VPN会话
   ├─ 临时禁用该账号
   ├─ 通知用户 + 上级主管
   ├─ P1工单
   └─ 排查过去活动
   ↓
[Step 4] 恢复
   └─ 用户确认 + 重置密码 + MFA → 恢复
```

---

## Playbook 10: 蜜罐告警自动情报富化

**触发条件**：蜜罐检测到攻击交互

```
[触发] 蜜罐告警
   ↓
[Step 1] 提取攻击者信息
   ├─ IP → GeoIP + ASN
   ├─ User-Agent/工具指纹
   ├─ 攻击载荷
   └─ 攻击目标（蜜罐类型）
   ↓
[Step 2] 威胁情报查询
   ├─ OTX + AbuseIPDB + VT
   └─ 是否已知APT IP
   ↓
[Step 3] 攻击者画像
   ├─ 扫描器/脚本小子（低交互）
   ├─ 定向攻击（高交互+专业工具）
   └─ 已知APT（威胁情报匹配）
   ↓
[Step 4] 自动响应
   ├─ 已知恶意IP → 自动封禁
   ├─ 攻击载荷 → 提取IOC → MISP
   ├─ 恶意样本 → 自动沙箱分析
   └─ 创建工单
   ↓
[Step 5] 关联生产系统
   └─ 该IP是否访问过生产系统 → 紧急排查
```

---

## 部署建议

```yaml
# Shuffle Workflow 部署配置
playbooks:
  deploy_order:
    1: "playbook_2_bruteforce"     # 最高频，立即部署
    2: "playbook_1_phishing"       # 高频
    3: "playbook_9_vpn_anomaly"    # 高价值
    4: "playbook_3_edr_forensics"  # 中频高价值
    5: "playbook_7_vuln_dispatch"  # 运维效率
    6: "playbook_8_ioc_retro"      # 情报驱动
    7: "playbook_6_data_exfil"     # 高风险
    8: "playbook_4_dga"            # 检测增强
    9: "playbook_5_process_isolate"# 处置增强
    10: "playbook_10_honeypot"     # 情报增强

  testing:
    mode: "shadow"  # 先影子模式运行1周，确认无误后再切生产
    shadow_duration_days: 7
    max_auto_actions_per_hour: 100  # 限制自动操作频率
```

---

## ✅ Playbook 部署 Checklist

- [ ] Top 5 Playbook 设计完成
- [ ] Shuffle/n8n Workflow 实现
- [ ] 影子模式测试（7天）
- [ ] 误操作回滚方案确认
- [ ] 自动操作频率限制
- [ ] 生产环境切换
- [ ] 监控Panel（执行成功率+误操作率）

> 📚 延伸阅读：SOC/003-SOAR自动化 | SOC/001-SOC建设 | HW/009-护网SOC
