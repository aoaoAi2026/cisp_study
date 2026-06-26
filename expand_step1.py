# -*- coding: utf-8 -*-
filepath = r'e:\\internal_safe\\cisp1\\cisp\\public\\books_export\\books_export\\Linux安全加固实战\\ch05-系统服务加固.md'

new_section_5_1_2_to_5_1_5 = '''

### 5.1.2 systemd与SysV Init深度对比

**systemd的优势**

1. **并行启动**：systemd能够并行启动不依赖的服务，大大缩短启动时间
2. **按需激活**：服务只在需要时才启动，减少资源消耗
3. **单元文件管理**：使用声明式单元文件，比Shell脚本更易维护
4. **依赖管理**：自动解析服务依赖关系，确保启动顺序正确
5. **资源控制**：支持CPU、内存、IO等资源限制
6. **快照与恢复**：支持系统状态快照和恢复
7. **日志管理**：集成journald，提供集中式日志管理

**SysV Init的特点**

1. **简单可靠**：使用Shell脚本，逻辑清晰易懂
2. **广泛兼容**：几乎所有Linux发行版都支持
3. **启动级别**：使用runlevel概念，管理简单
4. **稳定成熟**：经过长期实践验证

**命令对照表**

| 功能 | systemd命令 | SysV Init命令 |
|------|------------|--------------|
| 启动服务 | systemctl start httpd | /etc/init.d/httpd start |
| 停止服务 | systemctl stop httpd | /etc/init.d/httpd stop |
| 重启服务 | systemctl restart httpd | /etc/init.d/httpd restart |
| 查看状态 | systemctl status httpd | /etc/init.d/httpd status |
| 开机启用 | systemctl enable httpd | chkconfig --level 35 httpd on |
| 开机禁用 | systemctl disable httpd | chkconfig --level 35 httpd off |
| 重新加载 | systemctl reload httpd | /etc/init.d/httpd reload |
| 检查是否启用 | systemctl is-enabled httpd | chkconfig --list httpd |
| 查看所有服务 | systemctl list-units --type=service | chkconfig --list |
| 查看失败服务 | systemctl --failed --type=service | chkconfig --list | grep off |

### 5.1.3 服务依赖关系分析

理解服务依赖关系对于故障排除和安全加固至关重要。

**查看服务依赖**

```bash
# 查看服务的依赖关系（该服务依赖哪些）
systemctl list-dependencies nginx.service

# 查看反向依赖（哪些服务依赖该服务）
systemctl list-dependencies --reverse nginx.service

# 查看服务依赖的单元
systemctl cat nginx.service

# 分析服务依赖树（图形化）
systemctl list-dependencies nginx.service --plain | dot -Tsvg > deps.svg
```

**示例输出**

```bash
$ systemctl list-dependencies nginx.service
nginx.service
* ├─nginx.socket
* ├─system.slice
* └─sysinit.target
*   ├─-.slice
*   ├─systemd-journald.socket
*   └─sysinit.target.wants
*     ├─auditd.service
*     ├─firewalld.service
*     └─vmtoolsd.service
```

**SysV服务依赖查看**

```bash
# 使用lsb函数查看依赖
grep -E "Required-Start|Required-Stop" /etc/init.d/httpd

# 使用chkconfig查看运行级别
chkconfig --list httpd
```

### 5.1.4 服务启动时间分析

优化启动时间是提升系统性能和安全的重要手段。

**systemd-analyze分析启动时间**

```bash
# 查看整体启动时间和各服务耗时
systemd-analyze

# 示例输出
# Startup finished in 1.234s (kernel) + 2.567s (userspace) = 3.801s
# graphical.target reached after 2.123s

# 查看各服务详细耗时（按时间排序）
systemd-analyze blame

# 示例输出（截取前20个最慢服务）
# 1.234s mariadb.service
# 0.876s NetworkManager.service
# 0.543s postfix.service
# 0.432s firewalld.service
# 0.321s rsyslog.service

# 查看关键链（最影响启动时间的链）
systemd-analyze critical-chain

# 示例输出
# The time after the unit is active or started is printed after the "@" character.
# The time the unit takes to start is printed after the "+" character.
#
# graphical.target @2.123s
# └─multi-user.target @2.120s
#   └─nginx.service @1.890s +230ms
#     └─network.target @1.885s
#       └─NetworkManager.service @1.020s +865ms
```

**生成启动报告**

```bash
# 生成HTML格式报告
systemd-analyze plot > startup.svg

# 生成JSON格式
systemd-analyze dot | jq > startup.json

# 查看服务状态转换
systemd-analyze transition
```

**SysV启动时间分析**

```bash
# CentOS/RHEL使用bootchart
yum install bootchart2
bootchartd start

# 查看dmesg中的启动时间信息
dmesg | grep -E "Freeing SMP|EXT4-fs"

# 分析init脚本执行时间
grep -E "Starting|Stopped" /var/log/boot.log
```

### 5.1.5 服务启动管理
'''

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 在### 5.1.2 服务启动管理之前插入新内容
target = '### 5.1.2 服务启动管理'
if target in content:
    content = content.replace(target, new_section_5_1_2_to_5_1_5 + '\n' + target)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully inserted section 5.1.2-5.1.5")
    print("New file size:", len(content))
else:
    print("Target not found:", target)
