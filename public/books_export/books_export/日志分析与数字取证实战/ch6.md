# 第六章 内存取证

> 第6章 | 55页

6.1 内存取证概述

内存取证是对计算机的内存（RAM）进行镜像和分析，以获取系统运行状态、进程、网络连接、加密密钥等信息的取证技术。

内存取证的价值：
- 获取运行中的进程信息
- 发现无文件恶意软件（Fileless Malware）
- 获取网络连接信息
- 提取加密密钥
- 获取内存中的密码
- 发现内核级Rootkit

6.2 内存镜像工具

Windows内存镜像：
- WinPmem
- DumpIt
- FTK Imager
- Memoryze

Linux内存镜像：
- LiME（Linux Memory Extractor）
- /dev/mem（部分系统）
- fmem

6.3 Volatility内存取证框架

Volatility是最流行的开源内存取证框架，支持Windows、Linux、MacOS等系统。

常用插件：
- imageinfo：获取镜像信息
- pslist：列出进程
- pstree：进程树
- psscan：扫描进程（可发现隐藏进程）
- netscan：网络连接扫描
- cmdscan：命令历史
- consoles：控制台历史
- hashdump：提取密码哈希
- malfind：查找可疑内存
- filescan：扫描文件
- handles：句柄列表
- svcscan：服务扫描
- modscan：驱动模块扫描

6.4 实战：恶意代码内存分析

1. 获取内存镜像
2. 确认系统版本（imageinfo）
3. 进程分析（pslist/psscan）
4. 网络连接分析（netscan）
5. DLL分析（dlllist）
6. 注入检测（malfind）
7. 服务分析（svcscan）
8. 驱动分析（modscan）
9. 命令历史（cmdscan/consoles）
