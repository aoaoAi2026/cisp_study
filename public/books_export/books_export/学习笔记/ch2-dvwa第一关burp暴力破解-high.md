# DVWA Brute Force High 难度 6 套通关方法 超极致详细完整版

统一前置固定信息

靶场页面地址：`http://192.168.108.128:9111/vulnerabilities/brute/`

DVWA 登录页：`http://192.168.108.128:9111/login.php`

固定登录账号：用户名`admin`

正确弱密码：`password`

成功页面唯一标识文本：`Welcome to the password protected area admin`

High 核心限制：`user_token`一次性，**每一次登录提交必须先访问页面获取全新 token，旧 token 提交直接失效、302 跳转回登录表单**

## 方法一：Burp 原生宏 + Session 会话规则（教学标准方案，你当前实操成功的方法）

### 1. 底层完整原理

DVWA High 每次加载页面后端随机生成单次数值 token，存入当前会话 Cookie 绑定；提交登录时后端校验 token 是否为本会话最新生成、且未使用过。

Burp 宏录制纯页面 GET 请求，会话规则强制 Intruder 在发送每一条爆破密码请求前，自动执行宏刷新页面，自动从页面 HTML 提取最新 token，自动替换登录请求内的旧 token；全程自动化，仅依靠 Burp 自带功能，无插件、无代码、断网 / 考场环境均可使用。

### 2. 分步极致详细操作（分 6 大阶段，每一步附带操作位置、操作动作、操作原因、漏做后果）

#### 阶段 1：浏览器环境预处理 + DVWA 等级切换



1. 打开 Firefox/Chrome 无痕隐私窗口

   操作原因：普通浏览器会持久缓存`PHPSESSID`会话 Cookie，残留旧会话会导致宏抓取过期 token；无痕模式关闭本地 Cookie 持久化。

   漏做后果：Burp Cookie Jar 和浏览器本地 Cookie 冲突，token 永久失效。

2. 浏览器代理设置：IP`127.0.0.1`，端口`8080`

   操作原因：Burp 默认监听 8080 端口，端口不匹配无法捕获靶场数据包。

3. 访问 DVWA 登录页，输入账号`admin`、密码`password`，点击 Login 登录 DVWA 后台

4. 左侧导航栏点击【DVWA Security】，Security Level 下拉选择`High`，点击 Submit 按钮保存配置

   操作原因：先切换 High 等级，页面才会生成一次性`user_token`隐藏输入框；若先进 Brute 再切等级，页面缓存不会刷新 token 代码。

   漏做后果：页面无 user\_token，所有方法全部失效。

5. 左侧菜单点击【Brute Force】进入暴力破解关卡页面

#### 阶段 2：抓取 2 条核心数据包，加入靶场作用域



1. Brute 页面表单随便填写：用户名`1`，密码`1`，点击 Login 提交登录

2. 切换 Burp 顶部【Proxy】→【HTTP history】，筛选出两条关键数据包

   包 A（宏专用刷新包）：请求方式 GET，URL`/vulnerabilities/brute/`，URL 末尾无任何`username/password/user_token`参数，状态码 200

   包 B（爆破提交包）：请求方式 GET，URL 携带`?username=1&password=1&Login=Login&user_token=xxx`全部登录参数

3. 右键包 A → `Add to scope`；右键包 B → `Add to scope`

   操作原因：加入 scope 后，后续会话规则可自动匹配靶场 IP，无需手动填写 URL 域名，防止规则匹配失效。

   漏做后果：会话规则不识别靶场地址，不会自动执行宏刷新 token。

#### 阶段 3：清空 Burp 历史 Cookie 缓存，消除会话冲突



1. Burp 软件右上角齿轮⚙️图标，点击打开【Settings】全局设置

2. 设置窗口左侧菜单栏切换【Project】标签（禁止点击 User，User 是全局永久配置，Project 仅作用当前靶场项目）

3. 右侧页面向下滚动，找到【Cookie jar】独立板块

4. 板块内点击按钮【Open cookie jar】，弹出 Cookie jar viewer 窗口

5. 窗口右侧按钮【Empty cookie jar】，一键清空表格内所有`PHPSESSID`、`security=high`缓存 Cookie

6. 点击 Close 关闭 Cookie 窗口，切回无痕浏览器，刷新 Brute Force 页面

   操作原因：清空历史测试残留会话，浏览器刷新后 Burp 捕获全新纯净会话 Cookie 存入 Jar，宏每次读取全新会话，不会拿到过期 token。

   漏做后果：宏复用旧 Cookie，所有爆破请求提示`CSRF token incorrect`，全部 302 跳转登录页。

#### 阶段 4：创建自动刷新 token 宏（Macro5），配置 Cookie 隔离与 token 提取规则



1. 保持在 Settings→Project→Sessions 页面，下滑找到【Macros】板块，点击板块左侧【Add】按钮

2. 弹出 Macro Recorder 录制窗口，数据包列表**仅勾选第 1 行纯页面 GET 包 A**，其余带登录参数、状态码 302 的数据包全部取消勾选，点击右下角 OK，自动生成新宏 Macro5

   操作原因：只有无参数纯页面会返回完整 HTML 源码，包含`<input name="user_token">`隐藏标签；带登录参数的提交包会重复提交错误密码，直接销毁 DVWA 登录会话，无法提取有效 token。

   选错包后果：宏每次执行都会发送错误登录请求，会话直接退出，Cookie 失效，无 token 可提取。

3. Macros 列表选中 Macro5，点击窗口右侧【Configure item】，弹出宏核心配置弹窗

4. Cookie handling 区域严格勾选：

   ✅ 勾选：`Add cookies received in responses to the session handling cookie jar`

   操作原因：宏刷新页面后，服务端返回全新会话 Cookie，自动存入 Burp Cookie Jar，维持 DVWA 登录状态，不会退出靶场。

   ❌ 取消勾选：`Use cookies from the session handling cookie jar in requests`

   操作原因（核心关键）：禁止宏发起页面请求时读取 Cookie 罐内旧会话 Cookie，彻底隔绝过期缓存会话干扰新 token 获取，不取消 100% 爆破全部失败。

   漏取消勾选后果：宏复用旧 Cookie 缓存，抓取过期 token，所有爆破请求 302 跳转登录页。

5. 弹窗最下方【Custom parameter locations in response】板块，点击右侧【Add】按钮，弹出 Define Custom Parameter 参数提取窗口

6. 提取窗口逐项精准填写，无多余勾选：

   Parameter name：`user_token`（必须和登录请求 CSRF 参数名完全一致，大小写不能错）

   Start after expression：`name="user_token" value="`

   End at delimiter：`"`

   取消勾选`Extracted value is URL-encoded`，其余选项保持默认不勾选

   操作原理：DVWA 页面 token 固定 HTML 格式`<input name="user_token" value="随机token字符串">`，从`name="user_token" value=`文字后方开始截取，匹配到双引号`"`立刻停止，精准抓取动态一次性 token；参数名写错则会话规则无法自动替换爆破请求内的 token。

   填写错误后果：宏无法抓取到任何 token，爆破登录请求不带有效 token，服务端直接拦截跳转登录页。

7. 点击提取窗口 OK 保存规则，回到宏配置弹窗，列表自动新增`user_token`条目，点击弹窗 OK 保存宏配置；再点击 Macro Editor 窗口右下角 OK，完成宏全部创建配置。

#### 阶段 5：新建 Session Handling Rule 会话规则，绑定 Macro5（90% 用户全 302 报错的核心漏步骤）



1. 回到 Settings→Project→Sessions 主页面，页面顶部【Session handling rules】板块点击【Add】新建规则 Rule2

2. 规则弹窗默认停留在 Details 标签页，【Rule actions】区域点击 Add 下拉按钮，选择`Run a macro`

3. 弹出宏选择窗口，选中我们配置完成的 Macro5，点击 OK 确认绑定

4. 选中刚添加的`Run a macro`动作条目，点击右侧【Edit】，弹出 Session handling action-editor 动作编辑窗口

5. 窗口内逐项勾选配置：

   ✅ `Update current request with parameters matched from final macro response`

   操作原因：把宏从页面抓取到的最新有效 token，自动替换到即将发送的爆破登录请求内。

   单选`Update only the following parameters and headers`，下方输入框填写`user_token`

   操作原因：仅替换 CSRF 令牌，不会覆盖我们爆破遍历的`password`参数，防止密码 payload 被自动清空。

   ✅ `Update current request with cookies from session handling cookie jar`

   操作原因：同步宏获取的全新会话 Cookie，保证服务端识别为已登录用户，不会拦截爆破请求。

   漏勾选任意一项后果：宏成功抓取新 token，但不会自动替换到爆破请求，发包依旧携带过期旧 token，全部 302 跳转。

6. 点击动作编辑窗口 OK 保存，回到规则弹窗，顶部切换【Scope】标签页（极易遗漏的关键页面）

7. Tools Scope 工具生效范围设置：取消全选，**仅勾选 Intruder、Proxy**

   操作原因：Burp 会话规则仅对勾选的工具生效，不勾选 Intruder，爆破工具发包前不会自动执行宏刷新 token，token 全程过期。

   漏勾选 Intruder 后果：整套宏配置完全失效，爆破全程使用过期 token，所有请求 302 跳转登录页。

8. URL Scope 域名匹配范围：选择`Use suite scope`

   操作原因：前置步骤已将 DVWA 加入靶场作用域，自动匹配靶场 IP，无需手动填写 URL，避免域名匹配失败导致规则不生效。

9. 所有弹窗依次点击 OK，完整关闭 Burp 全部 Settings 设置窗口。

#### 阶段 6：Intruder 爆破专属硬性配置，启动爆破识别成功包



1. Burp Proxy→HTTP history 找到包 B（带完整登录参数的 GET 提交包），右键`Send to Intruder`，切换到 Intruder 窗口

2. 切换 Intruder【Positions】标签：点击【Clear §】清空 Burp 自动添加的所有标记符`§`；仅选中 URL 内`password=1`的数字`1`，点击【Add §】，最终效果`password=§1§`；攻击类型选择`Sniper`狙击手模式

   操作原因：用户名固定为`admin`不需要爆破，仅遍历密码；Sniper 单 payload 模式逻辑最简单，不会多余遍历用户名，减少无意义爆破请求。

   多标记参数后果：同时爆破账号 + 密码，请求量翻倍，浪费大量爆破时间。

3. 切换【Payloads】标签：Payload set 选择`1`，Payload type 保持默认`Simple list`；点击【Load】按钮，加载 Burp 内置字典路径`Burp Suite → payloads → passwords.txt`

   操作原因：Burp 内置 passwords.txt 字典自带 DVWA 标准弱密码`password`，无需手动新建、导入自定义字典。

4. 切换【Options】标签，强制修改两项核心配置：

   ① Redirections 重定向下拉选择`Always follow redirections`

   操作原因：宏刷新页面会触发 302 跳转，不跟随跳转无法加载完整 HTML 页面，提取不到 user\_token。

   选错后果：宏获取页面源码残缺，无 token 数据。

   ② Resource pool 线程池 Concurrent requests 并发线程改为`1`

   操作原因：High 难度 token 一次性，多线程会同时共用同一个旧 token，并发请求 token 全部校验失败；单线程保证每一条爆破请求前，单独执行宏刷新全新 token。

   选错后果：并发线程 > 1，所有请求 token 失效，统一 302 跳转。

5. 可选优化配置 Grep-Extract：点击 Add，匹配文本填写`Welcome to the password protected area admin`，自定义列名`登录成功标识`

   操作作用：爆破结果表格新增一列标识，一键区分登录成功的请求，不用逐个点开响应内容手动搜索文字。

6. 点击 Intruder 窗口右上角【Start attack】启动爆破

7. 识别成功数据包判断标准（对应你上传的爆破结果截图）

   ① 表格 Length 长度区分：绝大多数密码 Length=4792（登录失败页面），Payload=password 一行 Length=4830（登录成功页面，页面 HTML 内容更多）

   ② Response 关键字搜索：选中 password 行，下方 Response→Pretty 面板按`Ctrl+F`，搜索`Welcome to the password protected area admin`，高亮文字即代表登录成功。

### 3. 整套方法优缺点

优点：



1. Burp 官方原生功能，线下考场、断网环境、无网络均可使用，无任何插件、代码依赖；

2. 可视化结果表格，支持字典批量遍历，自带结果筛选、Grep 标记，直观区分成功包；

3. 宏与会话规则逻辑通用，所有带一次性 CSRF 令牌靶场（XSS、SQL 注入、文件上传关卡）均可复用这套配置思路。

   缺点：

   配置步骤多达二十余步，新手极易漏勾选 Scope、单线程、Cookie 隔离选项，导致全部 302 报错。

### 4. 适用场景

Web 安全入门学习、DVWA 靶场练习、线下渗透考试、无网络断网环境实操。



***

## 方法二：Burp Repeater 手动循环半自动爆破（零配置，仅适合少量密码测试）

### 1. 底层完整原理

完全不使用 Sessions 宏、会话规则，纯人工手动操作：两个 Repeater 标签页分工，第一个标签发送纯页面 GET 请求，手动复制页面内最新 token；第二个标签修改密码参数、替换全新 token 后提交登录，逐条人工测试密码，无任何自动化逻辑。

### 2. 分步极致详细操作

#### 阶段 1：抓包发送至 Repeater 双标签



1. 无痕浏览器代理登录 DVWA，切换 High 等级，进入 Brute Force 页面，随便输入 1/1 提交登录，Proxy 捕获包 A、包 B

2. 右键包 A（纯页面 GET）→ Send to Repeater，自动生成 Tab1

3. 右键包 B（完整登录提交包）→ Send to Repeater，自动生成 Tab2

#### 阶段 2：单条密码完整手动循环操作流程



1. 切换 Repeater Tab1（纯页面刷新包），点击右上角【Send】发送请求

2. 右侧 Response 面板滚动 HTML 源码，找到隐藏输入框`<input name="user_token" value="随机字符串">`，鼠标双引号之间的随机字符全部复制（全新有效 token）

   操作原因：必须每次刷新页面再复制 token，旧 token 提交直接失效，页面跳转登录失败。

3. 切换 Repeater Tab2（登录提交包），修改两处内容：

   ① URL 内`password=`后的字符改为当前待测试密码；

   ② URL 内`user_token=`后的旧字符串删除，粘贴刚复制的全新 token；

4. 点击 Tab2 右上角【Send】提交登录请求

5. 右侧 Response 面板激活窗口，快捷键`Ctrl+F`搜索`Welcome to the password protected area admin`

   匹配到文字 = 密码正确；无匹配文字 = 密码错误，重复循环测试下一条密码。

#### 阶段 3：批量密码重复操作说明

字典内有多少条密码，就要完整重复一遍上述 5 步流程，全程手动复制粘贴 token、修改密码。

### 3. 整套方法优缺点

优点：



1. 零 Sessions 复杂配置，零基础新手不用学习宏、会话规则概念，快速上手；

2. 无需加载字典、配置 Intruder，仅测试 5\~10 个少量密码时操作速度更快。

   缺点：

   纯人工重复复制粘贴操作，字典上百条密码工作量极大，无法自动化批量跑；长时间重复操作极易手误复制错误 token，导致误判密码失效。

### 4. 适用场景

临时验证少量弱密码、课堂演示一次性 token 失效原理、零基础快速理解 High 防护逻辑。



***

## 方法三：Burp BApp CSRF 自动化插件（一键自动处理 token，简化配置）

### 1. 底层完整原理

联网下载 Burp 第三方扩展插件`CSRF Token Tracker`，插件底层自动监听靶场所有 HTTP 请求，自动识别页面`user_token`隐藏参数；Intruder 每发送一条爆破请求前，插件自动前置发起页面 GET 请求抓取全新 token，自动替换登录请求内旧 token，完全替代手动录制宏、编写 token 提取规则、配置会话规则整套流程。

### 2. 分步极致详细操作

#### 阶段 1：联网安装插件（必须有稳定网络）



1. 打开 Burp，顶部导航栏【Extensions】→【BApp Store】应用商店

2. 商店搜索框输入`CSRF Token Tracker`，选中插件，点击右侧【Install】按钮自动下载安装

3. 安装完成后，弹窗提示重启 Burp，关闭软件重新打开，插件生效。

   操作限制：离线、企业内网、考场断网环境无法访问 BApp 商店，不能安装插件。

#### 阶段 2：DVWA 基础环境配置



1. 无痕浏览器代理登录 DVWA，切换安全等级 High，进入 Brute Force 页面，提交 1/1 登录，Proxy 捕获完整登录提交包 B。

2. 右键包 B → Send to Intruder。

#### 阶段 3：插件自动识别 CSRF token，无需宏配置



1. Burp 顶部【Extensions】→【CSRF Token Tracker】打开插件控制面板

2. 点击【Auto Detect Tokens】自动扫描当前 scope 内靶场页面，插件自动识别`user_token`为一次性 CSRF 参数

3. 开启开关【Auto update token in Intruder requests】（默认开启，无需手动配置提取规则、录制宏）

#### 阶段 4：Intruder 基础爆破配置



1. Positions 标签：Clear § 清空标记，仅标记 password 参数，攻击模式 Sniper

2. Payloads 标签：加载 Burp 自带 passwords.txt 密码字典

3. Options 标签强制两项设置：

   ① Redirections：Always follow redirections

   ② Resource pool 并发线程 = 1（插件仅自动更新 token，无法解决一次性 token 并发冲突，多线程依旧全部失效）

4. 点击 Start attack 启动爆破，插件全程自动刷新、替换 token。

### 3. 整套方法优缺点

优点：

省去宏、会话规则二十步复杂配置，一键自动识别 CSRF 令牌，操作极简，节省大量配置时间。

缺点：



1. 强依赖稳定网络，线下断网、企业内网、考试环境无法下载安装插件；

2. 部分新版 Burp、老旧版本存在插件兼容崩溃 bug，易导致 Burp 闪退；

3. 绝大多数 Web 安全线下考试明确禁止安装第三方插件，仅允许使用 Burp 原生自带功能。

### 4. 适用场景

有稳定外网、日常线上在线靶场练习、不想手动配置宏会话规则的用户，不用于考核、线下实操考试。



***

## 方法四：Python 脚本自动化爆破（代码自定义，完全脱离 Burp 工具）

### 1. 底层完整原理

使用 Python`requests`库维持持久浏览器会话，自动保存 DVWA 登录`PHPSESSID` Cookie，不会退出登录；循环执行固定两步逻辑：① GETBrute 页面，使用`BeautifulSoup`解析 HTML，精准提取页面全新`user_token`；② 携带最新 token 与当前测试密码提交登录 GET 请求；正则匹配页面成功关键字判断密码是否正确，匹配成功直接终止循环输出正确密码。

### 2. 分步极致详细操作

#### 阶段 1：环境依赖安装（Kali 系统自带 Python，Windows 需手动安装）

打开终端 / CMD，执行安装解析库命令：



```
pip install requests beautifulsoup4
```



* requests：模拟浏览器发送 HTTP 请求，维持会话 Cookie

* beautifulsoup4：解析 HTML 页面，精准提取隐藏 input 内 token，无需手写复杂正则表达式

#### 阶段 2：完整可直接运行脚本，逐行注释讲解



```
\# 导入依赖库

import requests

from bs4 import BeautifulSoup

\# ==========固定靶场配置参数，根据你的IP修改==========

brute\_url = "http://192.168.108.128:9111/vulnerabilities/brute/"

dvwa\_login\_url = "http://192.168.108.128:9111/login.php"

\# 密码字典列表，可替换读取外部txt超大字典

word\_list = \["123456","root","admin","111111","password","admin123","passw0rd"]

\# 创建持久会话对象，自动保存PHPSESSID、security会话Cookie

session = requests.Session()

\# 第一步：登录DVWA后台，获取有效登录会话Cookie

login\_form\_data = {

&#x20;   "username":"admin",

&#x20;   "password":"password",

&#x20;   "Login":"Login"

}

\# POST提交登录表单，持久化会话

session.post(dvwa\_login\_url, data=login\_form\_data)

\# 循环遍历字典内每一条待测试密码

for test\_pwd in word\_list:

&#x20;   \# 1.每次循环先访问Brute页面，强制抓取全新一次性user\_token

&#x20;   page\_response = session.get(brute\_url)

&#x20;   \# 解析页面HTML源码

&#x20;   html\_soup = BeautifulSoup(page\_response.text, "html.parser")

&#x20;   \# 定位name=user\_token的隐藏input标签，提取value内token值

&#x20;   new\_token = html\_soup.find("input", {"name":"user\_token"})\["value"]

&#x20;   \# 2.拼接携带全新token、当前测试密码的登录请求参数

&#x20;   login\_params = {

&#x20;       "username":"admin",

&#x20;       "password":test\_pwd,

&#x20;       "Login":"Login",

&#x20;       "user\_token":new\_token

&#x20;   }

&#x20;   \# 提交登录验证请求

&#x20;   login\_response = session.get(brute\_url, params=login\_params)

&#x20;   \# 3.判断页面是否包含登录成功专属文本

&#x20;   success\_text = "Welcome to the password protected area admin"

&#x20;   if success\_text in login\_response.text:

&#x20;       print(f"【爆破成功！DVWA Brute High正确密码】：{test\_pwd}")

&#x20;       \# 找到密码直接终止循环，不再遍历剩余字典

&#x20;       break

&#x20;   else:

&#x20;       print(f"密码错误：{test\_pwd}，继续测试下一条")
```

#### 阶段 3：脚本运行操作



1. 将全部代码复制，保存文件命名为`dvwa_high_brute.py`

2. 终端进入文件所在目录，执行运行命令：



```
python3 dvwa\_high\_brute.py
```



1. 程序自动循环遍历密码，输出正确密码后自动停止运行。

### 3. 整套方法优缺点

优点：



1. 完全脱离 Burp 工具，无图形界面、低配电脑、纯服务器均可运行；

2. 高度自定义拓展：可自定义请求延时、单 / 多线程、读取外部超大 txt 字典、日志文件导出、代理转发；

3. 离线完全可用，无网络依赖，考场 / 线下环境均可使用。

   缺点：

   需要基础 Python 代码阅读、修改、调试能力，纯零基础新手看不懂代码报错；Windows 系统需要手动安装依赖库，配置环境。

### 4. 适用场景

程序员安全练习、Linux 服务器无图形化界面批量爆破、需要自定义复杂爆破逻辑的用户。



***

## 方法五：OWASP ZAP 自动化暴力破解（独立开源渗透工具，替代 Burp）

### 1. 底层完整原理

OWASP ZAP 是开源免费 Web 渗透工具，内置上下文 Context 管理、全局 CSRF 令牌识别功能；配置靶场上下文并添加`user_token`为全局 CSRF 参数后，ZAP 自动化爬虫每次发包前自动刷新页面抓取全新 token；内置 Fuzzer 模糊测试模块批量遍历密码字典，自动匹配成功页面文本识别正确密码。

### 2. 分步极致详细操作

#### 阶段 1：ZAP 代理配置、DVWA 登录抓包



1. 打开 OWASP ZAP，工具代理端口默认`8080`，浏览器无痕模式代理设置`127.0.0.1:8080`

2. 浏览器访问 DVWA 登录页，输入 admin/password 登录，切换安全等级 High，进入 Brute Force 页面，随便输入 1/1 提交登录

3. ZAP 左侧站点树自动捕获靶场`192.168.108.128:9111`全部数据包

#### 阶段 2：创建靶场 Context 上下文



1. 左侧站点树右键靶场 IP 地址 → 【Add to Context】，命名上下文`DVWA`，确认包含全部靶场 URL

2. 顶部菜单栏【Tools】→【Options】→【CSRF Tokens】令牌配置面板

3. 点击 Add 按钮，填入令牌参数名称`user_token`，点击 OK 保存；ZAP 全局自动识别页面该一次性令牌，每次发包自动刷新更新。

#### 阶段 3：启动 Fuzzer 模糊测试（等价 Burp Intruder 爆破）



1. ZAP 左侧站点树找到带完整登录参数的 GET 提交请求，右键数据包 → 【Attack】→【Fuzz】

2. Fuzzer 配置面板：选中 URL 内`password=1`的数字 1，仅添加此处模糊标记，其余参数不标记；模糊类型 Simple list，加载内置密码字典

3. Fuzzer 高级设置：

   ① Follow redirects：勾选永久跟随重定向

   ② Concurrent threads 并发线程：设置为 1（适配一次性 token 机制）

4. 点击 Start Fuzzer 启动批量爆破

#### 阶段 4：筛选成功数据包

Fuzzer 结果面板，筛选 Response 正文包含`Welcome to the password protected area admin`的请求，对应 Payload 即为正确密码`password`。

### 3. 整套方法优缺点

优点：



1. 开源免费轻量化，低配老旧电脑流畅运行，无 Burp 付费弹窗、功能限制；

2. 一体化集成爬虫、漏洞扫描、暴力破解模块，单一工具完成整套靶场练习；

3. 离线完全可用，无插件、网络依赖，线下考场可使用。

   缺点：

   操作界面、功能逻辑和 Burp 差异极大，长期使用 Burp 的用户学习成本高；全网教学教程、报错排查资料远少于 Burp，出现问题很难找到解决方案。

### 4. 适用场景

低配老旧电脑、不想使用 Burp 软件、开源安全工具专项学习、无 Windows 图形界面 Linux 主机。



***

## 方法六：Linux 终端 curl+Shell 脚本 纯命令行爆破（无任何图形界面）

### 1. 底层完整原理

纯 Kali Linux 终端原生命令组合，`curl`模拟浏览器发送 HTTP 请求，`grep+awk`文本正则截取页面内`user_token`值；Shell while 循环逐行读取外部密码字典文件，每次循环先 curl 刷新页面抓取全新 token，拼接完整登录请求提交；正则匹配响应内成功关键字，匹配到则输出正确密码并终止脚本。全程无图形界面，后台静默运行，占用系统资源极低。

### 2. 分步极致详细操作

#### 阶段 1：创建密码字典文件

新建文本文件`pass.txt`，每行一条弱密码，内容示例：



```
123456

root

admin

111111

password

admin123

passw0rd
```

#### 阶段 2：创建自动化 Shell 爆破脚本

新建文件`brute_dvwa.sh`，写入完整带注释脚本：



```
\#!/bin/bash

\# DVWA靶场固定地址配置

BRUTE\_PAGE="http://192.168.108.128:9111/vulnerabilities/brute/"

LOGIN\_PAGE="http://192.168.108.128:9111/login.php"

\# 密码字典文件路径

WORDLIST\_FILE="./pass.txt"

\# 临时Cookie存储文件，持久保存PHPSESSID会话

COOKIE\_TMP=\$(mktemp)

\# 第一步：curl POST登录DVWA，保存登录会话Cookie到临时文件

curl -s -c \$COOKIE\_TMP -X POST \$LOGIN\_PAGE -d "username=admin\&password=password\&Login=Login"

\# 循环逐行读取字典内每一条测试密码

while read -r test\_password

do

&#x20;   \# 1.curl访问页面，grep+awk正则提取全新user\_token

&#x20;   NEW\_TOKEN=\$(curl -s -b \$COOKIE\_TMP \$BRUTE\_PAGE | grep -o 'name="user\_token" value="\[^"]\*"' | awk -F'"' '{print \$4}')

&#x20;   \# 2.拼接携带新token与测试密码的完整登录请求

&#x20;   LOGIN\_RESPONSE=\$(curl -s -b \$COOKIE\_TMP "\$BRUTE\_PAGE?username=admin\&password=\$test\_password\&Login=Login\&user\_token=\$NEW\_TOKEN")

&#x20;   \# 3.匹配成功页面专属文本，判断密码是否正确

&#x20;   SUCCESS\_TEXT="Welcome to the password protected area admin"

&#x20;   if echo "\$LOGIN\_RESPONSE" | grep -q "\$SUCCESS\_TEXT"; then

&#x20;       echo "=====爆破成功！正确密码：\$test\_password ====="

&#x20;       \# 删除临时Cookie文件，脚本直接退出

&#x20;       rm -f \$COOKIE\_TMP

&#x20;       exit 0

&#x20;   fi

&#x20;   echo "密码错误：\$test\_password"

done < "\$WORDLIST\_FILE"

\# 循环结束清理临时Cookie文件

rm -f \$COOKIE\_TMP
```

#### 阶段 3：赋予脚本执行权限并运行

打开 Kali 终端，进入脚本、字典所在文件夹，依次执行两条命令：



```
\# 赋予脚本可执行权限

chmod +x brute\_dvwa.sh

\# 运行自动化爆破脚本

./brute\_dvwa.sh
```

终端自动输出每条密码测试结果，匹配到正确密码`password`后脚本立刻停止。

### 3. 整套方法优缺点

优点：

完全无图形界面，可在纯 Linux 服务器、后台静默执行爆破任务，内存 CPU 占用极低；Kali 系统原生自带 curl/grep/awk 工具，无需额外安装任何依赖库。

缺点：

Shell 正则文本过滤语法晦涩难懂，报错调试难度极高；无可视化结果表格，仅纯文字输出；超大密码字典循环运行效率极低，速度远低于 Burp、Python 脚本。

### 4. 适用场景

纯 Linux 服务器无桌面环境、运维安全人员、后台离线批量扫描、无图形界面服务器专项练习。



***

# 六套完整方法统一对比明细表



| 序号 | 实现方法             | 依赖环境              | 自动化程度   | 上手难度      | 线下 / 考试允许使用     | 核心限制               |
| -- | ---------------- | ----------------- | ------- | --------- | --------------- | ------------------ |
| 1  | Burp 宏 + 会话规则    | Burp 原生功能，无插件     | 全自动     | 中等        | ✅ 完全允许          | 配置步骤繁琐，极易漏勾选       |
| 2  | Repeater 手动循环    | Burp 原生功能，无插件     | 纯手动人工操作 | 极低        | ✅ 临时验证可用        | 大批量字典效率极低          |
| 3  | Burp CSRF 插件     | Burp + 外网下载插件     | 全自动     | 低         | ❌ 绝大多数考场禁止第三方插件 | 强依赖网络，存在兼容崩溃 bug   |
| 4  | Python 自动化脚本     | Python+requests 库 | 全自动     | 高（需代码基础）  | ✅ 离线完全可用        | 需要代码修改调试能力         |
| 5  | OWASP ZAP Fuzzer | 独立开源 ZAP 工具       | 全自动     | 中等        | ✅ 完全允许          | 操作逻辑与 Burp 差异大，教程少 |
| 6  | Shell curl 脚本    | Linux 终端原生命令      | 全自动     | 极高（命令行语法） | ✅ 纯服务器可用        | 正则调试困难，运行速度慢       |

# 统一避坑核心总结



1. 全部批量自动化方法，并发线程必须固定设置为 1，High 一次性 token 机制无法支持多线程并发，多线程全部 token 失效、302 跳转；

2. 直接裸跑 Intruder 不处理 token 不属于有效通关方法，仅第一条密码有效，后续全部 token 过期，无法完整遍历字典；

3. 6 套方法底层核心逻辑完全一致：**每次提交登录请求前，先访问页面刷新获取全新 user\_token**，仅工具、代码载体、操作界面不同。

> （注：文档部分内容可能由 AI 生成）