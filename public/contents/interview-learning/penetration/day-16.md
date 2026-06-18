# Day 16：Linux后渗透与横向移动
> [Linux后渗透面试核心] 凭据收集/SSH劫持/持久化/痕迹清理
## 核心知识点
### Q: Linux后渗透的五步标准流程
1.凭据收集：/etc/shadow→hashcat爆破。~/.ssh/id_rsa→SSH横向。~/.bash_history + .env + web配置文件→找明文密码
2.内网发现：ip addr; arp -a; cat /etc/hosts; bash端口扫描for循环
3.横向移动：SSH密钥直连、收集到的凭据复用、Redis/Memcached未授权→打内网
4.持久化：crontab反向shell、SSH key追加、SUID后门cp /bin/bash /tmp/.bash→chmod 4755、PAM后门
5.痕迹清理：unset HISTFILE; rm ~/.bash_history; ln -s /dev/null ~/.bash_history
## 面试陷阱
- 忘收集数据库凭据→Web配置文件的DB密码可能通用
- SSH密钥没检查known_hosts→拿了私钥不知道连哪个目标
- 横向移动大流量扫描→触发内网告警

## 今日检测
1. chisel在两台Linux间搭SOCKS5→proxychains扫描内网
2. SSH Agent Forwarding实验：A→B→C,B被控→利用agent连接C
3. 手动排查Linux后门(对照后门清单逐条检查)
