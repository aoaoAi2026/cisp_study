# Go 语言代码审计实战指南

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
