# Binwalk 固件分析工具完全指南

> 分类：工具指南 | 难度：进阶 | 阅读时间：约45分钟

## 概述

Binwalk 是由 Craig Heffner 开发的固件分析神器，专门用于分析嵌入式设备固件镜像。它通过扫描二进制文件中的文件签名（Magic Bytes），自动识别和提取其中包含的文件系统、压缩数据、内核镜像、引导加载程序等组件。在 IoT 安全测试、路由器逆向、嵌入式设备漏洞挖掘中，Binwalk 是第一步也是最重要的一步。

**核心能力**：
- 文件系统识别（SquashFS、JFFS2、YAFFS、CramFS等）
- 压缩数据检测（LZMA、Gzip、Zlib、XZ 等）
- 自动提取（-e/--extract 递归解包）
- 熵值分析（-E/--entropy 可视化）
- 十六进制比较（-W/--hexdump）
- 自定义魔数签名（--magic）

## 核心知识点

- 固件分析基础流程
- Binwalk 扫描与提取
- 熵值分析的解读
- 自定义签名编写
- 固件模拟运行（配合 QEMU）
- 后续分析工具链

---

## 一、安装

### 1.1 Kali Linux（预装）

```bash
binwalk --version
sudo apt install binwalk -y
```

### 1.2 Ubuntu/Debian

```bash
# 通过 apt
sudo apt install binwalk -y

# 从源码（最新版/完整功能）
git clone https://github.com/ReFirmLabs/binwalk.git
cd binwalk
sudo python3 setup.py install

# 安装依赖（提取功能需要）
sudo apt install -y mtd-utils gzip bzip2 tar arj lhasa p7zip \
  p7zip-full cabextract cramfsprogs cramfsswap squashfs-tools \
  zlib1g-dev liblzma-dev liblzo2-dev
```

### 1.3 macOS

```bash
brew install binwalk
```

---

## 二、基础使用

### 2.1 扫描固件

```bash
# 基础扫描
binwalk firmware.bin

# 输出示例
DECIMAL       HEXADECIMAL     DESCRIPTION
-----------------------------------------------------------
0             0x0             uImage header, header size: 64 bytes
64            0x40            LZMA compressed data
1548288       0x17A000        Squashfs filesystem, little endian
```

### 2.2 扫描选项

```bash
# 详细输出（包括熵值）
binwalk -f firmware.bin        # 只显示固件中字符串
binwalk -B firmware.bin        # 扫描字节码签名

# 指定魔术文件
binwalk --magic /path/to/custom_magic firmware.bin

# 深度扫描（包含熵值分析）
binwalk -Me firmware.bin       # M: 魔术分析, e: 提取
binwalk --dd='type:ext:cmd'    # 自定义提取

# 显示所有签名（包括低置信度的）
binwalk -I firmware.bin        # 包含无效结果
binwalk -A firmware.bin        # 仅显示已知类型
```

---

## 三、文件提取

### 3.1 自动提取

```bash
# 递归提取（最常用）
binwalk -e firmware.bin
# -e: 提取已知文件类型

# 提取到指定目录
binwalk -e --directory=/tmp/extracted firmware.bin

# 完整提取（递归+包含所有文件）
binwalk -Me firmware.bin
# -M: 递归扫描提取的文件
# -e: 提取已知类型

# 提取并保留提取物
binwalk -Me -r firmware.bin
cd _firmware.bin.extracted/
ls -la
```

### 3.2 自定义提取规则

```bash
# 使用 --dd 自定义提取
binwalk --dd='lzma:lzma:lzma -d %e' firmware.bin
# --dd='type:extension:command'
# type: lzma（Binwalk 识别的类型）
# extension: lzma（保存的扩展名）
# command: lzma -d %e（提取命令，%e是文件路径占位符）

# 提取多个类型
binwalk --dd='lzma:7z:7z x %e' --dd='gzip:gz:gzip -d %e' firmware.bin

# 提取指定偏移范围
binwalk --dd='raw:bin:dd if=%e of=output.bin bs=1 skip=START count=LENGTH' \
  --start=0x17A000 --end=0x200000 firmware.bin
```

---

## 四、熵值分析

### 4.1 熵值扫描

```bash
# 生成熵值图
binwalk -E firmware.bin

# 保存熵值图
binwalk -E -J firmware.bin       # 保存为 PNG 图

# 熵值解读
# 0.0 - 低熵值：空数据/重复数据（0x00 或 0xFF 填充）
# 1.0 - 低熵值：文本文档/配置文件
# 3.0-5.0 - 中熵值：代码/结构化二进制
# 6.0-7.0 - 中高熵值：压缩数据
# 7.5-8.0 - 高熵值：加密数据/随机数据（可能需要密钥）
```

### 4.2 熵值分析实战

```bash
# 模式识别
# 平坦高熵区域 = 加密或压缩
# 低熵区域 = 文本/配置/空数据
# 高→低转换 = 压缩数据未压缩部分 + 元数据

# 示例：提取高熵区域
# 如果偏移 0x100000-0x200000 区域熵值持续 > 7.5
# 可能是加密的固件更新包
# 需要找到解密密钥才能进一步分析
```

---

## 五、高级分析

### 5.1 十六进制转储与比较

```bash
# 十六进制并排比较
binwalk -W firmware1.bin firmware2.bin
# 用于对比固件版本差异/补丁分析

# 十六进制+签名标注
binwalk -H firmware.bin
```

### 5.2 固件文件系统提取后分析

```bash
# 1. 提取
binwalk -Me firmware.bin
cd _firmware.bin.extracted/

# 2. 找到文件系统
find . -name "squashfs-root" -type d
# 或查找 etc/passwd
find . -path "*/etc/passwd"

# 3. 进入文件系统
cd squashfs-root/
ls -la etc/ bin/ lib/ usr/

# 4. 分析关键文件
cat etc/passwd            # 用户账户
cat etc/shadow            # 密码哈希（可能为空/弱）
cat etc/rc.d/             # 启动脚本
find . -name "*.conf"     # 配置文件
find . -name "*.pem"      # 证书/密钥
find . -name "*.key"
```

### 5.3 搜索硬编码凭据

```bash
# 在提取的文件系统中搜索
grep -r "password" .
grep -r "admin" ./etc/
grep -r "secret" .
grep -rE "BEGIN (RSA|DSA|EC) PRIVATE KEY" .
find . -name "*.db" -exec strings {} \; | grep -iE "user|pass"
```

---

## 六、自定义签名

```bash
# 创建自定义魔术文件
cat > my_magic.txt << 'EOF'
# 自定义固件类型
0    string    \xDE\xAD\xBE\xEF    Custom Firmware Header
>4   lelong    x                    Version: %d
>8   lelong    x                    Size: %d bytes
>12  lelong    x                    Entry point: 0x%X
EOF

# 安装自定义签名
binwalk --magic my_magic.txt firmware.bin

# 永久安装
sudo cp my_magic.txt /etc/binwalk/magic/
binwalk -u    # 更新魔术数据库
```

---

## 七、工具链集成

### 固件分析完整流程

```
获取固件
  ↓
binwalk -Me → 识别+提取
  ↓
分析文件系统（etc/passwd, 启动脚本, 二进制）
  ↓
┌──────────────┬──────────────┬──────────────┐
│ 静态分析      │ 动态分析      │ 网络分析      │
│ Ghidra/IDA   │ QEMU模拟     │ Wireshark    │
│ 逆向二进制    │ 运行固件      │ 抓包分析      │
└──────────────┴──────────────┴──────────────┘
  ↓
漏洞发现 → 编写 PoC
```

### QEMU 固件模拟

```bash
# 模拟运行提取的固件（需要匹配架构）
# ARM 架构固件
sudo apt install qemu-user-static
cp /usr/bin/qemu-arm-static squashfs-root/usr/bin/
sudo chroot squashfs-root /usr/bin/qemu-arm-static /bin/sh

# MIPS 架构
cp /usr/bin/qemu-mipsel-static squashfs-root/usr/bin/
sudo chroot squashfs-root /usr/bin/qemu-mipsel-static /bin/sh
```

---

## 八、常见问题

| 问题 | 解决方案 |
|:---|:---|
| 无法提取（签名不识别） | 使用 `--dd` 手动指定提取命令 |
| 提取不完整 | 检查偏移、手动 `dd` 截取 |
| 加密文件系统 | 搜索密钥/密码，尝试常见弱密码 |
| 大文件内存耗尽 | 使用 `--depth` 限制扫描深度 |
| 嵌套提取失败 | 手动 `binwalk -e` 每个提取物 |

---

## 九、速查卡

```
扫描:        binwalk firmware.bin
提取:        binwalk -e firmware.bin
递归提取:    binwalk -Me firmware.bin
熵值分析:    binwalk -E firmware.bin
熵值图:      binwalk -E -J firmware.bin
十六进制:    binwalk -H firmware.bin
对比:        binwalk -W file1 file2
自定义魔数:  binwalk --magic magic.txt firmware.bin
提取目录:    cd _firmware.bin.extracted/

工具链:  Binwalk → Ghidra/IDA → QEMU → Wireshark → Exploit
```

---

> 📖 本文为"网安百宝箱"课程配套读物。
> 参考：Binwalk 官方 https://github.com/ReFirmLabs/binwalk
> 更新于 2026-06-18
