# 第五章 磁盘取证

> 第5章 | 55页

5.1 磁盘取证基础

- 磁盘镜像制作原则：只读、完整、校验
- 镜像格式：RAW（dd）、E01（EnCase）、AFF
- 哈希校验：MD5、SHA1、SHA256
- 写保护设备：硬件写保护、软件写保护

5.2 磁盘镜像工具

- dd：Linux/Unix内置工具
  语法：dd if=/dev/sda of=/evidence/sda.dd bs=4M conv=noerror,sync

- FTK Imager：Windows下常用镜像工具
- ddrescue：损坏磁盘镜像工具
- Guymager：Linux下图形化镜像工具

5.3 文件系统分析

Windows文件系统：
- FAT32
- NTFS：MFT、ADS、USN日志
- ReFS

Linux文件系统：
- ext2/ext3/ext4
- XFS
- Btrfs

5.4 NTFS深入分析

- MFT（主文件表）
- $MFT、$MFTMirr
- 属性类型：$STANDARD_INFORMATION、$FILE_NAME、$DATA
- 备用数据流（ADS）
- USN变更日志
- 回收站分析
- Prefetch预读取文件
- LNK快捷方式文件
- Jumplists跳转列表

5.5 文件恢复

- 已删除文件恢复
- 格式化恢复
- RAW恢复
- 碎片文件恢复

5.6 取证分析工具

- Autopsy：开源数字取证平台
- X-Ways Forensics：商业取证工具
- FTK：Forensic Toolkit
- EnCase：经典取证工具
