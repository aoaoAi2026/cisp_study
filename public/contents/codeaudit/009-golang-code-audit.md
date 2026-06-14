# Go 语言代码审计实战指南

> **📘 文档定位**：CISP 考试代码审计进阶内容 | 难度：⭐⭐⭐ | 预计阅读：15 分钟
> Go 语言代码审计关注模板注入、命令注入、SSRF 和供应链安全。本文梳理 Go 生态中 text/template vs html/template 的关键差异及审计要点。

---

## 导航目录
- [一、模板注入](#一模板注入)
- [二、命令注入](#二命令注入)
- [三、SSRF](#三ssrf)
- [四、Go Module 供应链安全](#四go-module-供应链安全)
- [五、Checklist](#五checklist)
- [六、高分考点与知识巧记](#六高分考点与知识巧记)

---

## 一、模板注入

```go
// ❌ text/template — 不安全
import "text/template"
tmpl := template.New("test")
tmpl.Parse("Hello {{.}}")   // 用户输入可插入模板语法
tmpl.Execute(w, userInput)   // → SSTI!

// ✅ html/template — 安全（默认转义）
import "html/template"
tmpl := template.New("test")
tmpl.Parse("<p>Hello {{.}}</p>")
tmpl.Execute(w, userInput)  // {{.}}被自动HTML转义

// ⚠️ 审计点：代码中使用了 text/template 处理用户输入
```

---

## 二、命令注入

```go
// ❌ 危险：os/exec 拼接用户输入
cmd := exec.Command("sh", "-c", "ls "+userInput)
cmd.Run()
// userInput = "; rm -rf /" → 命令注入

// ✅ 安全：使用参数数组
cmd := exec.Command("ls", userInput)  // userInput作为参数传递
cmd.Run()

// ✅ 安全：使用 exec.CommandContext 带超时
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()
cmd := exec.CommandContext(ctx, "ls", userInput)
```

---

## 三、SSRF

```go
// ❌ 直接使用用户提供的URL
resp, err := http.Get(userURL)

// ✅ 校验URL
func safeHTTPGet(rawURL string) (*http.Response, error) {
    u, err := url.Parse(rawURL)
    if err != nil {
        return nil, err
    }
    
    // 禁止内网IP
    ips, _ := net.LookupIP(u.Hostname())
    for _, ip := range ips {
        if ip.IsLoopback() || ip.IsPrivate() {
            return nil, errors.New("internal IP not allowed")
        }
    }
    
    // 仅允许HTTPS
    if u.Scheme != "https" {
        return nil, errors.New("only HTTPS allowed")
    }
    
    // 自定义Transport（超时等）
    client := &http.Client{Timeout: 10 * time.Second}
    return client.Get(u.String())
}
```

---

## 四、Go Module 供应链安全

```
审计要点：
  ✦ go.sum — 完整性验证，是否被提交到版本控制？
  ✦ go.mod — 是否引入了不必要/不安全的依赖？
  ✦ replace 指令 — 是否将依赖替换到了不可信源？
  
  // ❌ 可疑
  replace github.com/trusted/lib => github.com/unknown/lib v0.0.1
  
  ✦ //go:embed 嵌入的文件是否可能含敏感信息？
  ✦ import 了哪些网络/文件操作包(os/os/exec/net/http)?
```

```bash
# Go 漏洞扫描
govulncheck ./...              # Go官方漏洞扫描
go list -m -u all              # 查看可升级的依赖
```

---

## 五、Checklist

- [ ] text/template → html/template 替换
- [ ] os/exec 无命令字符串拼接
- [ ] SSRF防护(URL白名单+内网IP过滤)
- [ ] go.sum完整性验证
- [ ] govulncheck 定期扫描

---

## 六、高分考点与知识巧记

> 🔑 **高分考点**：Go 语言审计考点集中在 text/template vs html/template 的安全差异、命令注入防护、SSRF URL 校验。Go 的静态编译特性使得供应链安全尤为重要。

| 考点 | 频次 | 核心记忆点 |
|:---|:---:|:---|
| text/template vs html/template | ⭐⭐⭐⭐ | text/template 无转义可 SSTI，html/template 默认转义 |
| exec.Command 安全 | ⭐⭐⭐ | 参数数组安全，"sh -c" 拼接危险 |
| SSRF 防护 | ⭐⭐⭐ | url.Parse → 检查 Scheme + IP(IsLoopback/IsPrivate) |
| govulncheck | ⭐⭐⭐ | Go 官方漏洞扫描，检查依赖 CVE |
| go.sum | ⭐⭐ | 完整性验证，必须提交到版本控制 |

> 💡 **知识巧记**：Go 模板安全记"text 险 html 安"——text/template 无转义可注入，html/template 自动 HTML 编码。命令注入口诀：exec.Command 用数组，避开 "sh -c" 字符串拼接。

### 高分考点速查表

| 考察维度 | 关键结论 | 常见干扰项 |
|:---|:---|:---|
| text/template | 不转义用户输入，可导致 SSTI | "text/template 会自动转义" ❌ |
| exec.Command | 参数数组形式安全，shell 拼接危险 | "exec.Command 自动防注入" ❌ |
| SSRF | net.LookupIP + IsLoopback/IsPrivate 过滤 | "url.Parse 自动过滤内网" ❌ |
| go.sum | 依赖完整性校验文件，防篡改 | "go.sum 不需要提交" ❌ |

### 知识巧记口诀

> **Go 审计口诀**：
> 模板 text 险 html 安，命令数组避 shell 串。
> SSRF 校验 Scheme + IP，内网回环全阻断。
> govulncheck 定期扫，go.sum 提交防篡改。
