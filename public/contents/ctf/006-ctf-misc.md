# Misc 常见隐写术速查

> **📘 文档定位**：CISP 考试 CTF 安全 核心 | 难度：⭐⭐⭐ | 预计阅读：25 分钟
>
> 系统整理 CTF Misc 方向常见隐写术的速查手册，覆盖图片/音频/压缩包/流量/内存取证等经典题型。

---

## 导航目录

- [一、图片隐写](#一图片隐写)
- [二、音频隐写](#二音频隐写)
- [三、压缩包隐写](#三压缩包隐写)
- [四、流量分析](#四流量分析)
- [五、安全部署 Checklist](#五安全部署-checklist)
- [六、高分考点与知识巧记](#六高分考点与知识巧记)

---

## 一、图片隐写

```bash
# 基础检查
file image.jpg
strings image.jpg | grep flag
exiftool image.jpg          # 元数据中可能有flag
binwalk -e image.jpg        # 文件拼接/嵌入

# PNG
zsteg image.png              # LSB隐写检测
pngcheck image.png           # 检查IDAT块异常
# IDAT块尺寸异常 → 可能有隐藏数据

# JPEG
# DCT系数隐写
steghide extract -sf image.jpg
# 需要密码: stegseek image.jpg rockyou.txt

# GIF
# 逐帧分析(用Stegsolve)
# Frame Browser → 逐帧查看
```

---

## 二、音频隐写

```bash
# 频谱图查看
# Audacity → File → Open → 查看声波

# MP3 隐写
mp3stego -x -p password hidden.mp3

# 波形分析
# 摩斯密码: 长短音
# DTMF: 电话拨号音
```

---

## 三、压缩包

```bash
# 伪加密
# ZIP加密标志未正确设置
zip -FF flag.zip --out fixed.zip
# 或用 010 Editor 修改加密标志位

# 爆破密码
fcrackzip -b -c a -l 1-6 -u flag.zip
zip2john flag.zip > hash.txt
john --wordlist=rockyou.txt hash.txt

# CRC碰撞(已知文件内容, 爆破文件名)
# 小文件(如flag.txt内容已知为"flag{xxx}")
python crc32.py flag.zip <zip内部文件名长度>
```

---

## 四、流量分析

```bash
# Wireshark 基本操作
# 过滤器:
http                     # HTTP流量
dns                      # DNS查询
tcp.port == 8080         # 特定端口

# 文件提取
# File → Export Objects → HTTP
# → 导出传输的所有文件

# 命令行
tshark -r capture.pcap -Y "http" -T fields -e http.request.uri

# USB流量
# 键盘/鼠标流量 → 还原按键
# USB HID Keyboard → 按键码映射
```

---

## 五、内存取证

```bash
vol -f memory.raw windows.pslist    # 进程
vol -f memory.raw windows.filescan  # 文件
vol -f memory.raw windows.cmdline   # 命令行
vol -f memory.raw windows.memmap --pid 1234 --dump  # dump进程

# 常见flag位置:
# ✦ notepad.exe 内存中(未保存的文本)
# ✦ 浏览器内存中(访问的页面)
# ✦ 剪贴板内容
```
