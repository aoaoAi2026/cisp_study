# ZTNA 与 SASE：零信任网络接入落地指南

---

## 一、ZTNA 替代传统 VPN

```
VPN 的固有缺陷：
  ✗ 网络层接入 → 暴露全网攻击面 → 横向移动
  ✗ 静态访问控制 → "一旦进入，全部可访问"
  ✗ 缺乏应用层可见性 → 无法识别和拦截APT
  ✗ 隧道加密但无内容检测 → 恶意流量加密穿越
  ✗ 性能瓶颈 → 流量回源(Hairpinning) + 单点故障

ZTNA 如何解决：
  ✓ 应用层接入 → 每个应用独立授权
  ✓ 动态信任评估 → 身份+设备+行为持续验证
  ✓ 应用层可见性 → 7层DPI + 数据防泄漏
  ✓ 双向TLS → 客户端也验证服务端（防中间人）
  ✓ 边缘接入 → 就近接入点(PoP)消除回源
```

---

## 二、ZTNA 产品对比

| 产品 | 类型 | 接入方式 | 特点 |
|------|------|---------|------|
| **Zscaler Private Access (ZPA)** | 商业 | 客户端+云代理 | 全球150+PoP，最成熟 |
| **Cloudflare Access** | 商业 | 客户端/浏览器 | 集成WARP+CDN，免费额度 |
| **Netskope Private Access** | 商业 | 云原生SASE | NG-SWG+CASB+ZTNA一体 |
| **Palo Alto Prisma Access** | 商业 | 云交付 | NGFW+ZTNA统一 |
| **OpenZiti** | 开源 | Overlay网络 | 全开源，嵌入式SDK |
| **Pomerium** | 开源 | 反向代理 | 身份感知代理，OIDC集成 |
| **Ory Oathkeeper** | 开源 | 反向代理 | IAM决策代理，K8s原生 |

---

## 三、Cloudflare Access 实战

```bash
# Cloudflare Access (Zero Trust) 配置流程

# 1. 安装 cloudflared (隧道客户端)
# 下载: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/

# 2. 认证 cloudflared
cloudflared tunnel login

# 3. 创建隧道
cloudflared tunnel create my-tunnel
# → 返回 Tunnel UUID 和 credentials.json

# 4. 配置DNS与隧道路由
# config.yml
tunnel: <Tunnel-UUID>
credentials-file: /path/to/credentials.json

ingress:
  - hostname: app.example.com
    service: http://localhost:3000  # 内网应用，无需公网IP
  - service: http_status:404

# 5. 启动隧道
cloudflared tunnel run my-tunnel

# 6. Cloudflare Zero Trust Dashboard配置Access Policy:
#   Application: app.example.com
#   Policy: Allow if:
#     - Email ends with @example.com
#     - Country is China
#     - Device posture: OS version ≥ Win 10, Antivirus running

# 用户访问: app.example.com → Cloudflare边缘验证 → 隧道转发到内网
```

---

## 四、SASE 架构全景

### 4.1 SASE = SD-WAN + SSE

```
Gartner SASE定义 (2019):

SASE (Secure Access Service Edge) =
  SD-WAN (软件定义广域网)   +   SSE (安全服务边缘)

SSE = ZTNA + CASB + SWG + FWaaS + DLP

组件详解：
┌─────────────────────────────────────────────────┐
│ SD-WAN                                          │
│  ├── 智能路径选择（延迟最低/带宽最大）             │
│  ├── 应用感知路由 (Application-Aware Routing)    │
│  └── 多云/多链路负载均衡                          │
├─────────────────────────────────────────────────┤
│ SSE (Security Service Edge)                     │
│  ├── ZTNA  (零信任网络接入)                       │
│  ├── SWG   (安全Web网关) — URL过滤/恶意软件检测    │
│  ├── CASB  (云访问安全代理) — SaaS安全+DLP        │
│  ├── FWaaS (防火墙即服务) — NGFW+IPS云交付        │
│  └── DLP   (数据防泄漏)                           │
└─────────────────────────────────────────────────┘
```

### 4.2 从 VPN 到 ZTNA 四步转型

```
Phase 1: 并存期（1-3个月）
  VPN和ZTNA并行运行
  将非关键应用先迁移到ZTNA
  收集用户反馈和性能数据

Phase 2: 关键迁移（3-6个月）
  核心业务系统迁移到ZTNA
  Web应用优先使用反向代理模式
  非Web应用使用客户端模式

Phase 3: 优化加固（6-9个月）
  关闭VPN接入通道（仅保留紧急模式）
  部署SWG+CASB完善SSE
  接入SD-WAN优化全球访问体验

Phase 4: SASE成熟（9-12个月）
  统一SASE平台运营
  AI驱动的威胁检测
  零信任策略全覆盖
```

---

## 五、ZTNA 客户端 vs 无客户端

```
客户端模式 (Client-based)：
  适用：所有应用（包括非Web协议 SSH/RDP/SMB）
  优势：全协议支持，设备信任评估
  劣势：需要安装客户端
  例子：Zscaler ZCC, Cloudflare WARP, OpenZiti Client

无客户端模式 (Clientless / Browser-based)：
  适用：Web应用（HTTP/HTTPS）
  优势：无需安装，BYOD友好
  劣势：仅HTTP协议，不支持SSH/RDP等
  例子：Cloudflare Access (Browser), Azure App Proxy, Pomerium

混合模式（推荐）：
  Web应用 → 无客户端（浏览器）
  非Web应用 → 客户端
  第三方/BYOD → 无客户端
  内网办公 → 客户端（完整设备信任）
```

---

## 六、Checklist

- [ ] 选择ZTNA方案（商业/开源/混合）
- [ ] 应用资产全量盘点与分类
- [ ] 优先迁移Web应用（Browser Access）
- [ ] 非Web应用部署ZTNA客户端
- [ ] 配置身份源集成（IDP/OIDC/SAML）
- [ ] 设备信任策略（OS版本/EDR状态/加密磁盘）
- [ ] 应用访问策略（最小权限原则）
- [ ] 与现有VPN并行运行过渡
- [ ] DNS安全检查（DNS-over-HTTPS拦截）
- [ ] 逐步下线VPN（保留紧急备用）
- [ ] 评估SASE框架扩展（CASB/SWG/FWaaS）
- [ ] 持续监控 + 用户反馈优化
