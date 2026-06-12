# 勒索病毒应急处置与恢复实战

---

## 📋 目录

1. [勒索病毒概述](#一勒索病毒概述)
2. [识别勒索家族](#二识别勒索家族)
3. [应急处置流程](#三应急处置流程)
4. [解密与恢复](#四解密与恢复)
5. [溯源与加固](#五溯源与加固)
6. [完整案例](#六完整案例)

---

## 一、勒索病毒概述

```
勒索病毒生命周期：
  入侵 → 潜伏 → 提权 → 横向 → 加密 → 勒索

主要入侵方式：
  ① RDP爆破 — 最常见的入口(45%)
  ② 钓鱼邮件 — 含恶意附件/链接(25%)
  ③ 漏洞利用 — VPN/Web漏洞(20%)
  ④ 其他 — 弱口令/U盘等(10%)

加密特征：
  ✦ 文件被加密，后缀改变(如 .lockbit, .xxx, .encrypted)
  ✦ 出现勒索信(README.txt/HOW_TO_RECOVER.html)
  ✦ 壁纸被更改为勒索信息
  ✦ 系统恢复/卷影副本被删除
  ✦ 备份文件被加密/删除
```

---

## 二、识别勒索家族

```
识别方法：

1. 勒索信内容
   勒索信 → 包含勒索家族名称/联系方式的特征
   例: "LockBit 3.0" / "Your files are encrypted by Conti"

2. 加密文件后缀
   .lockbit → LockBit
   .conti → Conti
   .blackcat → ALPHV (BlackCat)
   .xxx → 多个家族

3. 在线识别工具:
   ID Ransomware: https://id-ransomware.malwarehunterteam.com
   → 上传勒索信或加密文件样本

识别后的查找:
   https://www.nomoreransom.org → 欧刑警解密工具
   各安全厂商的解密工具
```

---

## 三、应急处置流程

### Phase 1: 立即响应 (0-30分钟)

```bash
# 1. 物理/网络隔离
# 立即断网! (拔网线 / 防火墙隔离)
# 如果多台 → 全子网隔离

# 2. 确定感染范围
# 检查哪些主机文件被加密
find / -name "*.lockbit" -o -name "*.encrypted" 2>/dev/null

# 3. 保存证据
# 保留加密样本 + 勒索信
cp README.txt ~/forensics/
cp ~/Documents/*.encrypted ~/forensics/
# 内存dump (如还有价值)
# volatility / LiME

# 4. 通知管理层 + IT + 安全
```

### Phase 2: 范围评估 (30分钟-2小时)

```
确定:
  ✦ 哪些服务器被加密?
  ✦ 备份是否安全?
  ✦ 加密还在进行吗?
  ✦ 入侵时间和入口?

扩散控制:
  ✦ 关闭所有受影响主机的网络
  ✦ 重置所有可能泄露的凭据
  ✦ 检查备份系统是否也被感染
```

### Phase 3: 恢复 (2-24小时)

```
恢复优先级:
  ① 从离线备份恢复(最可靠)
  ② 尝试解密(如解密工具可用)
  ③ 从卷影副本恢复(如未被删除)
  
恢复步骤:
  ① 重装或清除受影响系统
  ② 从已知干净的备份还原
  ③ 验证系统完整性
  ④ 逐步恢复上线

注意: 不推荐支付赎金!
  ✦ 不一定能恢复(部分家族解密有bug)
  ✦ 资助犯罪组织
  ✦ 可能被再次攻击
```

---

## 四、解密与恢复

### 卷影副本恢复

```powershell
# 查看可用的卷影副本
vssadmin list shadows

# 从卷影副本恢复文件
copy "\\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy1\Users\admin\Documents\*" C:\Restore\

# 如果卷影副本被删除 → 尝试DiskGenius等恢复工具
```

### 备份恢复

```bash
# 从备份服务器恢复
# Windows Server Backup / Veeam / Acronis 等
# 务必验证备份是否也被加密
```

---

## 五、溯源与加固

### 溯源入口

```bash
# 检查 RDP 登录日志
# Event ID 4624 (LogonType 10)
wevtutil qe Security "/q:*[System[(EventID=4624)]]" /c:50 /f:text

# 检查最近安装的软件
Get-WmiObject Win32_Product | Select Name,InstallDate

# 检查计划任务
schtasks /query /fo LIST /v

# 检查注册表自启动
reg query HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
```

### 加固

```
立即执行:
  ☐ 修改所有受影响账户密码
  ☐ 关闭不必要的RDP/网络共享
  ☐ 部署EDR
  ☐ 更新补丁

长期加固:
  ☐ RDP → VPN访问，禁止直接暴露公网
  ☐ 多因素认证(MFA)
  ☐ 网络分段(隔离关键系统)
  ☐ 定期备份(3-2-1原则)
  ☐ 员工安全意识培训
```

---

## 六、完整案例

```
某制造企业，300台Windows主机

Day 1: 发现
  员工上班发现文件打不开，后缀均为 .lockbit
  勒索信: "Your data is stolen and encrypted"

Day 1-2: 处置
  ✓ 全公司断网(防止扩散)
  ✓ 确认: 核心ERP/文件服务器全被加密
  ✓ 确认: 备份服务器被入侵 → 备份也被加密
  ✓ 识别: LockBit 3.0 → 目前无免费解密工具

Day 2-3: 恢复
  ✗ 无离线备份 → 无法恢复
  ✗ 无解密工具 → 无法解密
  ✓ 发现开发部门有2周前的测试备份(U盘) → 部分恢复

Day 4-7: 重建
  ✓ 重装所有系统
  ✓ 从U盘恢复+重建数据库
  ✓ 1周后恢复70%业务

溯源:
  入口: RDP暴露公网 + Administrator弱口令
  → 攻击者爆破登录 → 横向传播 → 加密

损失:
  ✦ 停产1周(损失约800万)
  ✦ 数据永久丢失30%

教训:
  ✓ RDP必须通过VPN访问
  ✓ 必须有离线备份(不能只在线的)
  ✓ 必须部署EDR
  ✓ 3-2-1备份原则
```

---

## ✅ Checklist

- [ ] 断网隔离
- [ ] 识别勒索家族
- [ ] 保留证据(加密样本+勒索信)
- [ ] 检查备份可用性
- [ ] 查找解密工具(NoMoreRansom)
- [ ] 从干净备份恢复
- [ ] 溯源入口
- [ ] 加固(关闭RDP/弱口令/部署EDR)
