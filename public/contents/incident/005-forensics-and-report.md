# 事件取证与报告撰写实战

> **📘 文档定位**：CISP 考试 应急响应 核心 | 难度：⭐⭐⭐ | 预计阅读：25 分钟
>
> 系统讲解安全事件取证流程（证据保全/镜像/时间线）、报告撰写规范与模板、数字取证工具链及法律合规要求，覆盖从技术取证到正式报告的完整闭环。

---

## 导航目录

- [一、取证基本原则](#一取证基本原则)
- [二、证据保全与镜像](#二证据保全与镜像)
- [三、时间线分析](#三时间线分析)
- [四、取证工具链](#四取证工具链)
- [五、报告撰写规范](#五报告撰写规范)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 📋 目录

1. [取证原则](#一取证原则)
2. [内存取证 (Volatility)](#二内存取证)
3. [磁盘取证](#三磁盘取证)
4. [日志取证与时间轴](#四时间轴)
5. [事件报告模板](#五报告模板)

---

## 一、取证原则

```
电子取证黄金法则:
  ① 不改变原始证据 (写保护/镜像)
  ② 记录哈希 (MD5/SHA256)
  ③ 证据链(Custody Chain) → 每一步有记录
  ④ 可重复性 → 另一人用同样方法得出相同结论

取证工具链:
  内存: Volatility 3
  磁盘: Autopsy (Sleuth Kit GUI)
  文件恢复: foremost, photorec
  时间轴: plaso (log2timeline)
  密码破解: hashcat, john
```

---

## 二、内存取证

### 采集

```bash
# Windows
# dumpit.exe / winpmem.exe → memory.raw

# Linux
# LiME:
insmod lime.ko "path=/tmp/memory.lime format=lime"
# 或通过TCP传送到取证服务器:
insmod lime.ko "path=tcp:192.168.1.100:4444 format=lime"
```

### Volatility 分析

```bash
# 基础分析流程
vol -f memory.raw windows.info
vol -f memory.raw windows.pslist       # 进程列表
vol -f memory.raw windows.pstree       # 进程树
vol -f memory.raw windows.netscan      # 网络连接
vol -f memory.raw windows.cmdline      # 命令行历史
vol -f memory.raw windows.malfind      # 恶意代码检测
vol -f memory.raw windows.dlllist      # 加载的DLL
vol -f memory.raw windows.filescan     # 文件对象

# 提取可疑进程
vol -f memory.raw windows.dumpfiles --pid 1234
vol -f memory.raw windows.memmap --pid 1234 --dump

# 提取凭据
vol -f memory.raw windows.hashdump     # NTLM Hash
vol -f memory.raw windows.lsadump      # LSA Secrets
```

---

## 三、磁盘取证

### Autopsy

```
Autopsy = Sleuth Kit 的 GUI 界面

功能:
  ✦ 文件系统浏览(含已删除文件)
  ✦ 文件分类(图片/文档/视频/可执行文件)
  ✦ 关键字搜索
  ✦ 时间线分析
  ✦ Web 浏览器历史恢复
  ✦ 邮件恢复

创建案例:
  New Case → 选择数据源(磁盘镜像/分区/文件夹)
  → Ingest Modules → 运行所有模块
  → 查看结果: 文件/邮件/Web/Cookie等
```

### 文件恢复

```bash
# foremost — 基于文件头的恢复
foremost -i disk.img -o recovered/

# photorec — 图片/文档恢复
photorec disk.img

# extundelete — ext3/ext4 删除恢复
extundelete /dev/sda1 --restore-all

# strings — 提取文本
strings memory.raw | grep -E "(password|admin|secret)" > strings.txt
```

---

## 四、时间轴

```bash
# plaso/log2timeline — 构建时间线
psteal.py --source memory.raw --source disk.img \
  -o l2tcsv -w timeline.csv

# 分析时间线
psort.py -o l2tcsv -w sorted_timeline.csv timeline.plaso

# Excel/Numbers 打开 → 按时间排序 → 还原攻击过程

# 关键时间点:
# ① 首次入侵时间
# ② 可疑进程启动时间
# ③ 文件修改/创建时间
# ④ 网络连接时间
# ⑤ 登录时间
```

---

## 五、事件报告模板

```markdown
# 安全事件调查报告

## 1. 事件概述
- 事件ID: INC-20260615-001
- 事件类型: Web入侵 / 勒索病毒 / 数据泄露
- 发现时间: 2026-06-15 03:30
- 影响范围: 2台Web服务器 + 1台数据库
- 当前状态: 已遏制 / 处理中 / 已恢复

## 2. 时间线
| 时间 | 事件 | 证据来源 |
|------|------|---------|
| 06-14 23:15 | 攻击者通过SQLi获取shell | Web日志 |
| 06-14 23:45 | 上传恶意文件 | 文件创建时间 |
| 06-15 01:00 | 内网扫描 | 连接日志 |
| 06-15 02:30 | 数据外传 | 流量日志(NetFlow) |

## 3. 攻击链分析
初始入口: Web应用 SQL 注入 (product.php?id=1)
权限提升: Linux SUID 提权(toor)
横向移动: SSH密钥窃取 → 内网DB服务器
数据外传: 通过DNS隧道外传约500MB数据

## 4. IOC (失陷指标)
IP: 45.xxx.xxx.xxx (45天前注册VPS)
域名: evil-c2.xyz (注册商:Namecheap)
文件Hash: MD5:abc123, SHA256:def456
进程名: /tmp/.cache/apache2
C2通信: HTTPS 每60秒 POST /api/health

## 5. 根因分析
直接原因: SQL注入未修复
间接原因: WAF规则未覆盖 / 审计日志未告警

## 6. 修复建议
短期:
  □ 修复SQL注入(参数化查询)
  □ 清除后门 Webshell
  □ 重置所有受影响的凭据

长期:
  □ 部署RASP/加强WAF规则
  □ 启用数据库审计
  □ 员工安全培训
  □ 定期渗透测试
```

---

## ✅ 取证 Checklist

- [ ] 现场保护(不关机不重启)
- [ ] 内存dump + 磁盘镜像
- [ ] 哈希记录(MD5/SHA256)
- [ ] Volatility 进程/网络/文件分析
- [ ] Autopsy 磁盘分析
- [ ] 时间轴构建(plaso)
- [ ] IOC 提取
- [ ] 报告编写 + 证据归档
