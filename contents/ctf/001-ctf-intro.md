# CTF 入门手册：Pwn / Web / Crypto / Reverse / Misc

> CTF（Capture The Flag）夺旗赛，选手在题目环境中寻找 flag（通常形如 `flag{xxx...}`）提交得分。

## 1. 五大方向总览

| 方向 | 说明 | 典型考点 |
|------|------|---------|
| **Web** | Web 应用漏洞利用 | SQL 注入、XSS、SSRF、XXE、反序列化、文件上传、模板注入、JWT、原型污染、逻辑漏洞 |
| **Pwn** | 二进制漏洞利用 | 栈溢出、堆利用（UAF/Double-Free/Heap Overflow）、格式化字符串、Canary/NX/PIE/RELRO 绕过 |
| **Reverse** | 逆向工程 | 静态/动态分析、算法还原、反混淆、脱壳、花指令、VM 保护分析 |
| **Crypto** | 密码学 | RSA、AES、ECC、经典密码、分组密码模式、哈希扩展攻击、格攻击（Lattice） |
| **Misc** | 杂项 | 隐写、流量分析、编码/压缩/压缩包密码、音频/视频/图片隐写、二维码、编码杂题 |

## 2. 常见题型与解题流程

### 2.1 Web 题

1. 打开题目 → 观察 URL 参数 / Cookie / 响应头
2. 目录扫描（dirsearch / gobuster / 御剑）
3. 识别技术栈（Wappalyzer / whatweb）
4. 尝试常见漏洞：SQL 注入 / XSS / SSRF / 文件上传 / 反序列化 / SSTI
5. 读源码：`?source` / `/index.php.bak` / `.git` / `www.zip` / webpack sourcemap
6. 读敏感文件：`/etc/passwd`、`/flag`、`/proc/self/environ`、`config.php`

### 2.2 Pwn 题

1. `checksec` 查看保护机制（NX / Canary / PIE / RELRO / Fortify Source）
2. 分析程序逻辑，定位溢出点 / UAF / 格式化字符串
3. 写 exploit（pwntools / pwnlib），本地测试
4. 远程打：`nc ip port` 或 `socat`

### 2.3 Reverse 题

1. `file` 查看文件类型，`strings` 粗看字符串
2. IDA Pro / Ghidra 加载，找到关键函数
3. 分析加密算法（常见：XOR、TEA、AES、Base64、自定义算法）
4. 动态调试：x64dbg / GDB + pwndbg / GEF
5. 还原 flag 或写出解密脚本

### 2.4 Crypto 题

1. 观察已知参数（n, e, c, p, q ...）、寻找弱密钥
2. 判断题型：RSA 低加密指数、共模攻击、Wiener 攻击、Pohlig-Hellman、CRT、格攻击
3. 使用 SageMath / PyCryptodome / gmpy2 / RsaCtfTool
4. 对于对称密码：看 IV、是否 ECB/CBC、是否 Padding Oracle

### 2.5 Misc 题

1. `file` / `binwalk` / `foremost` / `010 Editor` 看文件结构
2. 图片：Stegsolve / zsteg / exiftool / StegHide / OutGuess / F5
3. 音频：Audacity 看波形 / 频谱 / LSB / 摩斯码 / DTMF
4. 流量：Wireshark + tshark，找 HTTP 对象、TCP 流、TLS 握手
5. 二维码：QRazyBox / CQR（定位点、掩码、Reed-Solomon 纠错）

## 3. 必备工具

| 方向 | 工具 |
|------|------|
| 通用 | Kali/ParrotOS + Python3 + pip + pwntools + Git + WSL2 |
| Web | Burp Suite、sqlmap、dirsearch、ffuf、nuclei、wfuzz、tplmap |
| Pwn | pwntools、GDB + pwndbg/GEF、PEDA、ROPgadget、one_gadget、patchelf、glibc-all-in-one |
| Reverse | IDA Pro、Ghidra、x64dbg、OllyDbg、die、frida、angr、pintool |
| Crypto | SageMath、PyCryptodome、gmpy2、RsaCtfTool、yafu、msieve、z3-solver |
| Misc | binwalk、foremost、010 Editor、Stegsolve、zsteg、exiftool、Audacity、Wireshark、CyberChef |

## 4. 常用在线平台与资源

| 类型 | 资源 |
|------|------|
| 题库 | CTFHub、BUUCTF、NSSCTF、攻防世界、PicoCTF、HackTheBox、TryHackMe、Root-Me |
| 赛事 | 强网杯、XCTF、*CTF（N1CTF / DASCTF / 安洵杯...）、Google CTF、Real World CTF |
| Writeups | ctfhub.com/writeup、github.com/ctftraining、ctftime.org |
| CTF 工具集合 | github.com/apsdehal/awesome-ctf |
| 编码工具 | CyberChef（gchq.github.io/CyberChef） |

## 5. 学习路径建议（6 个月）

- **第 1 个月**：熟悉 Linux 基础、Python、Burp、抓包、Web 基础漏洞（SQL 注入/XSS/SSRF）
- **第 2 个月**：Web 进阶（反序列化、模板注入、JWT、原型污染）+ 选一个方向深入
- **第 3 个月**：Pwn / Reverse / Crypto 选方向；做 PicoCTF、BUUCTF 入门题
- **第 4-6 个月**：打线上赛、写 Writeup；加入战队（如 Nu1L、r3kapig、AAA、DAS 等）
- **持续**：关注赛棍社区、CTFtime 赛事日历，每季度至少参赛 2 次

---

> CTF 学习曲线陡峭但进步飞速。从一题不会到能独立解题，关键在于反复练习与看 Writeup。保持耐心！
