# 取证分析实战：流量包 + 内存取证解题攻略

> **📘 文档定位**：CISP 考试 CTF 安全 核心 | 难度：⭐⭐⭐⭐ | 预计阅读：28 分钟
>
> 系统讲解 CTF 取证分析的核心技能：Wireshark 流量分析、Volatility 内存取证、注册表分析及磁盘取证工具链。

---

## 导航目录

- [一、取证分析框架](#一取证分析框架)
- [二、流量包分析实战](#二流量包分析实战)
- [三、内存取证实战](#三内存取证实战)
- [四、注册表分析](#四注册表分析)
- [五、磁盘取证工具链](#五磁盘取证工具链)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 流量包分析

```bash
# Wireshark
# 过滤器:
http                       # HTTP流量
http.request.method == POST
dns.qry.name contains "flag"
ftp-data                   # FTP传输文件

# 文件导出
File → Export Objects → HTTP → Save All

# 追踪流
右键 → Follow → TCP Stream → 查看完整请求/响应

# USB键盘流量
# 提取HID Data → 映射键码:
# 04=a 05=b 06=c ... 28=Enter
tshark -r usb.pcap -T fields -e usb.capdata | grep -E "^[0-9a-f]{16}$"
```

---

## 内存取证

```bash
# 基础流程
vol -f memory.raw windows.info        # OS版本
vol -f memory.raw windows.pslist      # 进程列表
vol -f memory.raw windows.netscan     # 网络连接
vol -f memory.raw windows.cmdline     # 命令行

# 找 flag
vol -f memory.raw windows.memmap --pid 1234 --dump
strings pid.1234.dmp | grep flag

# 浏览器数据
# Chrome/Firefox密码/历史记录
# 用 HackBrowserData 或 volatility 浏览器插件

# TrueCrypt/VeraCrypt
# 搜索加密容器的密码(可能在内存中明文存在)
# strings memory.raw | grep -A5 -B5 "truecrypt\|veracrypt"
```

---

## 磁盘取证

```bash
# 挂载磁盘镜像
mount -o ro,loop disk.img /mnt/disk

# 文件恢复
foremost -i disk.img -o recovered/
photorec disk.img

# NTFS日志分析($LogFile, $UsnJrnl)
# 查看删除/修改记录

# Windows 注册表
# 加载 SAM/SOFTWARE/SYSTEM hive
# regedit → Load Hive → 查看:
# - 计算机名/最后登录
# - 安装的软件
# - USB设备历史
```
