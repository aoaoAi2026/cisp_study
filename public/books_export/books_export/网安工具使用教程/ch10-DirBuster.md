# 第十章：DirBuster - 目录扫描工具

## 10.1 DirBuster 简介

### 什么是 DirBuster？

想象你要探索一座大楼，找出所有隐藏的房间。**DirBuster**就是这样的工具——一个目录和文件扫描工具。

**DirBuster**可以：
- 扫描网站的隐藏目录
- 发现隐藏文件
- 查找备份文件
- 发现后台页面

简单来说，DirBuster帮你**找到网站隐藏的角落**。

---

## 10.2 Java环境安装

### 为什么需要Java？

DirBuster是Java程序，需要Java环境。

### 安装Java

**Windows：**
访问 https://java.com 下载安装。

**Linux：**
```bash
sudo apt install default-jre
```

### 验证安装

```bash
java -version
```

---

## 10.3 Windows 系统安装教程

### 下载安装

1. 访问：https://github.com/FXAdmin/DirBuster
2. 下载DirBuster jar文件
3. 保存到固定目录

### 运行DirBuster

```batch
java -jar DirBuster.jar
```

---

## 10.4 Linux 系统安装教程

### Kali Linux

Kali可能包含DirBuster（较旧），建议使用DirSearch替代。

### 手动安装

```bash
wget https://github.com/FXAdmin/DirBuster/releases/download/v1.0/DirBuster.jar
java -jar DirBuster.jar
```

---

## 10.5 界面介绍与基本操作

### 界面布局

DirBuster主界面包含：

| 区域 | 功能 |
|------|------|
| Target URL | 目标网站地址 |
| Work Method | 工作方式（GET/POST） |
| Thread Count | 线程数 |
| Wordlist | 字典文件 |
| Start Button | 开始扫描 |

### 基本使用

**步骤1：输入目标**
- 在Target URL输入目标地址

**步骤2：选择字典**
- 点击"Browse"选择字典文件
- DirBuster自带字典在`wordlists`目录

**步骤3：设置线程**
- 一般设置为10-20

**步骤4：开始扫描**
- 点击"Start"

---

## 10.6 扫描配置详解

### 字典选择

常用字典：
| 字典 | 说明 |
|------|------|
| directory-list-2.3-medium.txt | 中等大小（推荐） |
| directory-list-2.3-small.txt | 小型字典 |
| directory-list-2.3-big.txt | 大型字典 |

### 线程设置

- 太少：扫描慢
- 太多：可能被封禁
- 推荐：10-20线程

### 扫描类型

- **纯目录扫描**：只扫描目录
- **文件扫描**：扫描特定文件
- **混合扫描**：目录和文件都扫描

---

## 10.7 字典配置详解

### 字典格式

字典是文本文件，每行一个路径：
```
admin
backup
config
login
uploads
...
```

### 自定义字典

可以创建自己的字典，根据目标特点定制。

---

## 10.8 结果分析详解

### 查看结果

扫描完成后，结果显示在"Results"区域。

**结果列：**
| 列 | 说明 |
|------|------|
| URL | 发现的路径 |
| Response Code | 状态码 |
| Response Size | 响应大小 |

### 状态码含义

| 状态码 | 说明 |
|------|------|
| 200 | 存在，可访问 |
| 301/302 | 重定向，可能存在 |
| 403 | 禁止访问，但存在 |
| 404 | 不存在 |
| 500 | 服务器错误 |

### 重要发现

重点关注：
- 200状态码的路径
- 403状态码的路径（可能需要认证）
- 备份文件（.bak、.zip）
- 配置文件（.conf、.ini）
- 后台目录（admin、dashboard）

---

## 10.9 实战案例：敏感目录发现

### 场景说明

目标：`http://target.example.com`

### 执行扫描

1. 输入目标URL
2. 选择medium字典
3. 开始扫描

### 发现结果

可能发现：
```
/admin          200
/backup.zip     200
/config.ini     403
/phpinfo.php    200
/.git           403
```

这些发现可以进一步测试！

---

## 总结

本章介绍了DirBuster的使用：

1. **安装配置**：Java环境、工具安装
2. **界面操作**：基本使用方法
3. **扫描配置**：线程、字典设置
4. **结果分析**：状态码含义

DirBuster是发现网站隐藏目录的基础工具。

下一章我们将学习DirSearch——更现代的目录扫描工具！