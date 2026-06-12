# APT 事件应急响应全流程深度指南

---

## 📋 目录

1. [APT vs 普通攻击](#一apt特征)
2. [识别 APT 攻击信号](#二识别信号)
3. [六阶段应急响应](#三六阶段)
4. [网络隔离策略](#四隔离策略)
5. [APT 取证特殊要求](#五apt取证)
6. [外部协同流程](#六外部协同)
7. [完整案例：某金融 APT 响应](#七完整案例)

---

## 一、APT 特征

```
APT (Advanced Persistent Threat) = 高级持续性威胁

与普通攻击的本质区别:

┌──────────┬──────────────┬──────────────┐
│          │ 普通攻击      │ APT 攻击      │
├──────────┼──────────────┼──────────────┤
│ 目标     │ 快速获利      │ 长期情报获取  │
│ 时间     │ 小时-天       │ 月-年        │
│ 隐蔽性   │ 低(不关心)    │ 极高         │
│ 工具     │ 公开工具      │ 定制化        │
│ 0day     │ 很少         │ 常见         │
│ 攻击者   │ 个人/小团体   │ 国家支持      │
└──────────┴──────────────┴──────────────┘

APT 攻击链 (典型 6-12 个月):
  初始入侵 → 建立据点 → 权限提升 → 内部侦察 → 
  横向移动 → 数据收集 → 数据外传 → 长期维护
```

---

## 二、识别信号

### 2.1 网络层

```
C2 通信特征:
  ✦ DNS 查询高熵域名(DGA)
  ✦ HTTPS 非标准端口出站(非443)
  ✦ 心跳式通信(每隔固定秒数发送小包)
  ✦ 数据在非工作时间外传
  ✦ ICMP/DNS 隧道

检测方法:
  # DNS DGA 检测
  tshark -r capture.pcap -Y "dns" -T fields -e dns.qry.name | 
    while read domain; do
      entropy=$(echo "$domain" | ent | awk '{print $1}')
      [ $(echo "$entropy > 4.0" | bc) -eq 1 ] && echo "[!] $domain ($entropy)"
    done

  # 心跳检测(NetFlow)
  # 查询规律出站连接: 60/120/300秒间隔
```

### 2.2 主机层

```
APT 主机特征:
  ✦ 未知计划任务(名称仿冒系统任务)
  ✦ WMI 永久事件订阅
  ✦ DLL 侧载(利用合法签名进程)
  ✦ 内存中执行的恶意代码(无文件落地)
  ✦ LSASS 异常访问
  ✦ 异常的进程父子关系
```

### 2.3 账户层

```
  ✦ 非工作时间域管登录
  ✦ 服务账户被用于交互式登录
  ✦ 大量 Kerberos TGS 请求(Kerberoasting)
  ✦ 异地+短时间内多IP登录同一账号
  ✦ 新建域用户(无HR记录)
```

---

## 三、六阶段

### Phase 1: 准备 (Preparation)

```
APT应急需提前准备的:
  □ 加密通信通道(Signal/Wickr)
  □ 应急响应专用设备(隔离笔记本)
  □ 外部联系人清单(CERT/监管/厂商)
  □ APT攻击剧本(Playbook)
  □ 取证工具包(U盘/写保护器/磁盘复制器)
```

### Phase 2: 检测分析

```bash
# 确认攻击者是否仍在系统中

# 1. 检查当前活跃连接
ss -antp | grep -v "127.0.0.1\|10\.\|192.168"

# 2. 检查最近的活动
last -20
ausearch -ts recent 2>/dev/null | head -50

# 3. 进程树分析
ps auxf | grep -E "\./tmp|/dev/shm|\.cache"

# 4. 检查是否有正在进行的C2通信
# 使用 Zeek/Suricata 实时监控，或 SIEM 回溯

# 5. 确定攻击时间窗口
# 找到最早的异常事件 → 计算入侵时长
```

### Phase 3: 遏制

```
短期遏制(30分钟):
  □ 隔离受影响主机(不影响取证)
  □ 重置已泄露的凭据
  □ 封锁已知C2 IP/域名
  
长期遏制(1-2天):
  □ 修补初始入侵点
  □ 重置所有受影响域凭据
  □ 加固安全配置

注意: 不要立即重启/关机主机!
  → 内存中的驻留程序和C2信息会丢失
  → 先取证, 再清除
```

### Phase 4: 根除

```bash
# 清除 APT 植入:

# 1. 清除计划任务
schtasks /query /fo LIST | grep -i "update\|sync\|check\|monitor"
schtasks /delete /tn "MicrosoftEdgeUpdateTask" /f

# 2. 清除注册表自启动
reg delete HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run /v "Update" /f

# 3. 清除 WMI 事件
Get-WmiObject -Namespace root\subscription -Class __EventFilter | Remove-WmiObject
Get-WmiObject -Namespace root\subscription -Class CommandLineEventConsumer | Remove-WmiObject

# 4. 清除 Golden Ticket
# KRBTGT 密码需要重置两次! (Active Directory 安全实践)
Reset-ADAccountPassword -Identity krbtgt -Reset
# 等待域复制完成
Reset-ADAccountPassword -Identity krbtgt -Reset

# 5. 重置所有受影响账户密码(包括服务账户)
# 6. 清除 Kerberos 票据缓存
klist purge
```

### Phase 5-6: 恢复 + 复盘

```
恢复:
  ① 从已知干净的备份恢复系统
  ② 增强监控(至少2周强化监控)
  ③ 实施新的检测规则(针对发现的 TTPs)

复盘:
  ① 攻击时间线完整还原
  ② ATT&CK 矩阵映射
  ③ 安全短板清单
  ④ 改进计划(技术+流程+人员)
```

---

## 四、隔离策略

```
根据 APT 阶段选择不同的隔离力度:

检测阶段: 不惊动攻击者
  ✦ 镜像流量分析(SPAN/TAP)
  ✦ EDR 静默模式(只记录不阻断)
  ✦ 网络层监控(Flow日志/DNS日志)

确认入侵后: 逐步升级
  ✦ 非核心主机 → 直接隔离
  ✦ 核心服务器 → 非工作时间隔离
  ✦ 域控 → 谨慎(可能影响全网)

关键系统: 选择性遏制
  ✦ DNS C2 → 只拦截C2域名(不影响正常DNS)
  ✦ HTTP C2 → 只拦截C2 IP/域名
```

---

## 五、APT 取证

```
APT 取证 vs 普通取证:

时间跨度大:
  → 需要历史日志(≥6个月, 理想≥1年)
  → CloudTrail/ActionTrail → 长期存储
  → SIEM → 冷数据归档

攻击者可能仍在系统中:
  → 取证过程不能惊动攻击者
  → 优先离线分析(从备份/镜像)
  → 网络侧监控优于主机侧(不被攻击者察觉)

多阶段攻击链:
  → 使用时间线工具(Plaso/log2timeline)
  → 关联多个日志源:
    - 防火墙日志
    - DNS日志
    - Windows Event Log
    - EDR日志
    - 邮件日志
    - VPN日志
```

---

## 六、外部协同

```
需要协同的各方:

监管(网信办/公安): 24小时内通报(关基系统)
行业 CERT: 技术协助 + 情报共享
安全厂商: 高级取证 + 样本分析
云厂商: AWS/Azure/阿里云日志 + 快照
法律顾问: 合规评估 + 通报措辞

协作原则:
  ✦ 信息通过加密通道传输
  ✦ 划分保密等级(TLP:RED/AMBER/GREEN)
  ✦ 指定单一对外发言人
```

---

## 七、完整案例

```
背景: 某基金公司, 信息安全部发现异常

Day 1: 发现
  SOC分析师在SIEM中发现:
  ✦ 凌晨 2:34: 域用户 svc_backup 从境外IP登录
  ✦ 凌晨 2:45: svc_backup 执行大量文件访问
  ✦ 过去3个月有类似模式! → APT特征!

Day 1-2: 初步调查
  ✓ 确认: svc_backup 账号被盗
  ✓ 溯源: 3个月前通过钓鱼邮件(VPN凭据被钓)
  ✓ 时间窗口: 攻击者已潜伏 3个月
  ✓ 横向范围: 已登录 8台服务器

Day 2-3: 取证
  ✓ 离线分析8台服务器的镜像(不在线 → 不惊动攻击者)
  ✓ Plaso时间线: 攻击者以每周1-2次的频率活动
  ✓ 外传数据: 约 2GB (通过HTTPS分批次外传)
  ✓ 外传内容: 基金持仓+客户信息

Day 3: 遏制
  ✓ 周六凌晨(非交易日):
    - 重置 svc_backup 密码
    - 隔离8台受影响服务器
    - 封禁C2 IP
    - 重置所有可能泄露的凭据

Day 4-14: 恢复
  ✓ 重装系统 + 从备份恢复
  ✓ 增强监控(额外检测规则)
  ✓ 全员钓鱼培训 + 强制MFA

教训:
  ✦ 服务账户不应有VPN权限
  ✦ 异常登录应自动告警(非工作时间+境外IP)
  ✦ MFA 应覆盖所有外部接入
```

---

## ✅ APT应急 Checklist

- [ ] 确认攻击仍在进行? 还是历史入侵?
- [ ] 收集所有相关日志(≥6个月)
- [ ] 构建攻击时间线
- [ ] 识别所有受影响主机
- [ ] 隔离受影响主机
- [ ] 重置所有受影响凭据
- [ ] 清除持久化机制
- [ ] 修补初始入侵点
- [ ] 通知监管(如需要)
- [ ] 复盘 + 持续监控(≥2周)
