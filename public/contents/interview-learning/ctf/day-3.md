# Day 3：Cookie越权——从0到1攻破身份验证

> **学习目标**：理解Cookie的工作原理，掌握Cookie修改和Session劫持技术
> 
> **学习时长**：2-3小时
> 
> **难度等级**：⭐⭐⭐

---

## 📚 今日内容概览

1. 什么是Cookie（用生活例子讲清楚）
2. Cookie的工作原理
3. Cookie的安全属性
4. F12修改Cookie实战
5. Cookie越权攻击
6. Session与Cookie的关系
7. 实战练习：CTFHub Cookie题目
8. 防御方法

---

## 一、什么是Cookie——用生活例子讲清楚

### 1.1 生活中的Cookie

```
想象你去健身房办卡：

第一次去健身房：
  你："我要办卡"
  前台："好的，这是你的会员卡（卡号：9527）"
  你：收到会员卡，放口袋里

之后每次去健身房：
  你：出示会员卡"我是9527号会员"
  前台："欢迎回来，张先生"
  
在这个例子中：
  健身房 = Web服务器
  会员卡 = Cookie
  卡号9527 = Cookie的值
  你的口袋 = 浏览器
  出示会员卡 = 每次请求自动带上Cookie
```

### 1.2 技术定义

```
Cookie是什么：
  网站存在你浏览器里的"小纸条"
  用来记住你的身份和状态

类比：
  就像去游乐园的手环
  戴上手环，所有项目都知道你是谁
  不用每次都买票

Cookie里面存什么：
  - 你的登录状态（是否登录）
  - 你的用户ID
  - 你的权限等级（普通用户/管理员）
  - 购物车内容
  - 浏览偏好
```

### 1.3 Cookie长什么样

```
真实的Cookie示例：

名称（Name）        值（Value）
----------------------------------------
username           admin
session_id         abc123def456
is_admin           0
theme              dark
last_visit         2024-01-15

翻译成中文：
  username = 用户名
  session_id = 会话编号（就像健身房会员卡号）
  is_admin = 是否是管理员（0=不是，1=是）
  theme = 界面主题
  last_visit = 上次访问时间
```

### 1.4 Cookie从哪来

```
Cookie的来源：

1. 服务器发送：
   你登录后，服务器说：
   "给你这个Cookie，以后凭这个来证明你是谁"

2. JavaScript设置：
   网页上的JS代码可以设置Cookie

3. 浏览器自动管理：
   浏览器帮你存着，每次访问自动带上

HTTP响应中的Cookie：
  HTTP/1.1 200 OK
  Set-Cookie: session_id=abc123; Path=/; Expires=Wed, 21 Oct 2024 07:28:00 GMT
  
  就像服务器给你一张会员卡，告诉你：
  - 卡号：abc123
  - 适用范围：整个网站（Path=/）
  - 有效期：到2024年10月21日
```

---

## 二、Cookie的工作原理

### 2.1 登录流程图解

```
第一次访问（没有Cookie）：

  浏览器                    服务器
    |                        |
    |--- 1. 访问登录页面 ---->|
    |                        |
    |<-- 2. 返回登录表单 -----|
    |                        |
    |--- 3. 提交用户名密码 --->|
    |                        |
    |<-- 4. 验证成功 ---------|
    |    Set-Cookie:         |
    |    session_id=abc123   |
    |                        |
    |（浏览器保存Cookie）      |

之后每次访问（自动带上Cookie）：

  浏览器                    服务器
    |                        |
    |--- 1. 访问页面 -------->|
    |    Cookie:             |
    |    session_id=abc123   |
    |                        |
    |<-- 2. 返回个性化内容 ----|
    |    "欢迎回来，admin!"   |
```

### 2.2 Cookie的传输过程

```
服务器 → 浏览器（设置Cookie）：
  HTTP响应头：
  Set-Cookie: name=value; 属性1; 属性2

浏览器 → 服务器（发送Cookie）：
  HTTP请求头：
  Cookie: name1=value1; name2=value2

就像：
  健身房给你卡（Set-Cookie）
  你每次去出示卡（Cookie）
```

### 2.3 Cookie的属性

```
Cookie有哪些属性：

1. Name（名称）
   Cookie的名字，比如"session_id"

2. Value（值）
   Cookie的具体内容，比如"abc123"

3. Domain（域名）
   Cookie属于哪个网站
   比如：example.com
   
4. Path（路径）
   Cookie在哪个路径下有效
   比如：/（整个网站）或 /admin（仅后台）

5. Expires/Max-Age（过期时间）
   Cookie什么时候失效
   比如：2024-12-31 或 3600秒

6. Secure（安全标志）
   只在HTTPS连接时发送
   防止Cookie被窃听

7. HttpOnly（仅HTTP）
   禁止JavaScript读取
   防止XSS攻击窃取Cookie

8. SameSite（同站限制）
   控制跨站请求时是否发送Cookie
   Strict：严格限制
   Lax：宽松限制
   None：不限制（需要Secure）
```

---

## 三、Cookie的安全属性详解

### 3.1 Secure属性

```
Secure是什么意思：
  加了Secure的Cookie，只能通过HTTPS发送
  不能通过HTTP发送

为什么需要：
  防止Cookie在传输过程中被窃听
  
就像：
  普通会员卡：谁都能看
  Secure会员卡：只有加密通道才能出示

检查方法：
  F12 → Application → Cookies
  看Secure列是否打勾

CTF中的利用：
  如果Secure没设置：
  可以通过HTTP获取Cookie
  或者通过中间人攻击窃取
```

### 3.2 HttpOnly属性

```
HttpOnly是什么意思：
  加了HttpOnly的Cookie，JavaScript读不到
  只能通过HTTP请求自动发送

为什么需要：
  防止XSS攻击窃取Cookie
  
就像：
  普通会员卡：谁都能看卡号
  HttpOnly会员卡：卡号印在里面，只有刷卡机才能读

检查方法：
  F12 → Application → Cookies
  看HttpOnly列是否打勾

CTF中的利用：
  如果HttpOnly没设置：
  可以通过XSS脚本读取Cookie
  document.cookie就能拿到
```

### 3.3 SameSite属性

```
SameSite是什么意思：
  控制从其他网站跳转过来时，是否发送Cookie

三个值：
  Strict：最严格
    只有从同站点跳转才发Cookie
    从其他网站点击链接过来，不发Cookie
    
  Lax：中等（大多数浏览器默认）
    GET请求会发Cookie
    POST请求不发
    
  None：不限制
    任何请求都发Cookie
    但必须同时设置Secure

为什么需要：
  防止CSRF攻击
  
就像：
  Strict：只在健身房里面用卡
  Lax：从健身房门口进来可以用卡
  None：在哪都能用卡（但不安全）

CTF中的利用：
  如果SameSite=None：
  更容易受到CSRF攻击
```

### 3.4 安全属性对比

| 属性 | 作用 | 不设置的后果 |
|:---|:---|:---|
| Secure | 只允许HTTPS | HTTP可窃取Cookie |
| HttpOnly | 禁止JS读取 | XSS可窃取Cookie |
| SameSite | 限制跨站发送 | CSRF攻击风险 |

---

## 四、F12修改Cookie实战

### 4.1 打开Cookie面板

```
操作步骤：

方法一（推荐）：
  1. 按F12打开开发者工具
  2. 点击顶部菜单"Application"（应用）
  3. 左侧找到"Storage"（存储）
  4. 点击"Cookies"
  5. 选择当前网站的域名

方法二：
  1. F12打开开发者工具
  2. 点击顶部菜单"Storage"（存储）
  3. 直接看到Cookies

你会看到：
  +------------+----------+--------+-------+---------+----------+
  | Name       | Value    | Domain | Path  | Expires | HttpOnly |
  +------------+----------+--------+-------+---------+----------+
  | session_id | abc123   | .ctf.  | /     | 2024... | ✓        |
  | is_admin   | 0        | .ctf.  | /     | 2024... | ✗        |
  +------------+----------+--------+-------+---------+----------+
```

### 4.2 修改Cookie值

```
修改步骤：

1. 找到要修改的Cookie
   比如：is_admin = 0

2. 双击Value列的值
   0 变成可编辑状态

3. 改成你想要的值
   把 0 改成 1

4. 按回车确认
   修改完成！

5. 刷新页面
   看看效果

就像：
  健身房的会员卡等级：
  普通会员 = 0
  VIP会员 = 1
  
  你把普通会员卡改成VIP
  就能享受VIP待遇了！
```

### 4.3 添加新Cookie

```
添加步骤：

1. 在Cookie面板空白处双击
   或者右键→Add new cookie

2. 输入Name和Value
   Name: is_admin
   Value: 1

3. 设置其他属性（可选）
   Domain: 当前域名
   Path: /
   Expires: 会话结束

4. 按回车确认

5. 刷新页面测试

注意：
  有些Cookie修改后需要刷新页面才生效
  有些需要重新发送请求才生效
```

### 4.4 删除Cookie

```
删除步骤：

1. 找到要删除的Cookie

2. 右键→Delete
   或者选中按Delete键

3. 刷新页面

用途：
  - 清除登录状态（相当于退出登录）
  - 清除跟踪Cookie
  - 测试不同身份
```

---

## 五、Cookie越权攻击

### 5.1 什么是越权

```
越权攻击是什么：
  用普通用户的身份，做管理员才能做的事
  
就像：
  你用普通会员卡，混进了VIP专属区域
  或者：
  你捡到了经理的门禁卡，进了经理办公室

两种越权：
  1. 水平越权：
     访问同级别其他用户的数据
     比如：用户A看到用户B的订单
     
  2. 垂直越权：
     普通用户获得管理员权限
     比如：把is_admin从0改成1
```

### 5.2 越权攻击流程

```
攻击步骤：

第一步：收集信息
  - 登录普通用户账号
  - 查看Cookie内容
  - 记录所有Cookie名称和值

第二步：分析Cookie
  - 找可能有权限相关的Cookie
  - 比如：role、is_admin、level、type

第三步：尝试修改
  - 把0改成1
  - 把user改成admin
  - 把false改成true

第四步：验证权限
  - 刷新页面
  - 访问管理员页面
  - 尝试管理员操作

第五步：获取Flag
  - 如果成功获得管理员权限
  - 找到Flag并提交
```

### 5.3 常见越权Cookie

```
常见需要关注的Cookie：

权限相关：
  is_admin = 0 → 改成 1
  role = user → 改成 admin
  level = 1 → 改成 999
  type = normal → 改成 super
  privilege = false → 改成 true

身份相关：
  user_id = 1001 → 改成 1（管理员通常是1）
  username = guest → 改成 admin
  uid = 12345 → 改成其他用户的ID

状态相关：
  login = 0 → 改成 1
  auth = false → 改成 true
  verified = no → 改成 yes
```

### 5.4 实战示例

```
场景：某CTF题目，登录后Cookie如下：

原始Cookie：
  session_id = abc123
  username = guest
  role = user
  is_vip = 0

攻击过程：
  1. 修改role：
     role = user → role = admin
     刷新页面，发现多了后台入口
     
  2. 修改is_vip：
     is_vip = 0 → is_vip = 1
     发现可以访问VIP专属内容
     
  3. 修改user_id：
     尝试改成其他数字
     发现可以看到其他用户的数据
     
  4. 组合修改：
     role = admin + is_vip = 1
     获得最高权限，拿到Flag

常见Flag位置：
  - 管理员后台页面
  - VIP专属内容
  - 其他用户的敏感信息
  - 隐藏的功能菜单
```

---

## 六、Session与Cookie的关系

### 6.1 Session是什么

```
Session（会话）：
  服务器端保存的用户状态
  就像健身房的服务器里存的会员档案

Cookie vs Session：
  
  Cookie：
    - 存在浏览器端
    - 像会员卡（轻量）
    - 用户可以查看和修改
    
  Session：
    - 存在服务器端
    - 像档案柜（详细）
    - 用户看不到

关系：
  Cookie里存SessionID → 服务器根据ID查档案
  
  就像：
    会员卡号 → 健身房查档案柜 → 显示会员信息
```

### 6.2 Session工作原理

```
登录流程：

1. 用户登录
   浏览器：发送用户名密码
   
2. 服务器验证
   服务器：验证成功，创建Session
           Session里存：用户名、权限、登录时间
           给Session一个ID：session_id = xyz789
           
3. 发送Cookie
   服务器：Set-Cookie: session_id=xyz789
   浏览器：保存Cookie
   
4. 后续访问
   浏览器：Cookie: session_id=xyz789
   服务器：查到Session档案
           "哦，是admin，权限等级10"
   
5. 返回内容
   服务器：根据权限返回对应内容
```

### 6.3 Session攻击

```
Session固定攻击：
  攻击者让用户使用已知的SessionID
  用户登录后，攻击者用同样的ID访问

Session劫持：
  窃取用户的SessionID Cookie
  冒充用户身份

防御方法：
  - 登录后重新生成SessionID
  - 使用HttpOnly防止XSS窃取
  - 使用Secure防止传输窃取
  - 设置合理的过期时间
```

---

## 七、实战练习：CTFHub Cookie题目

### 7.1 题目分析

```
题目名称：Cookie
题目描述：通过修改Cookie获取Flag

预期解法：
  1. 查看页面提示
  2. 找到关键Cookie
  3. 修改Cookie值
  4. 刷新获取Flag
```

### 7.2 解题步骤

```
步骤1：查看页面
  - 打开题目页面
  - 看到提示："你不是管理员"
  - 或者看到："请登录管理员账号"

步骤2：查看Cookie
  F12 → Application → Cookies
  看到：
    session_id = xxx
    username = guest
    is_admin = 0

步骤3：修改Cookie
  双击is_admin的值
  把0改成1

步骤4：刷新页面
  按F5刷新
  页面显示："欢迎，管理员！"
  或者Flag直接显示

步骤5：获取Flag
  flag{xxxxxx}
```

### 7.3 进阶练习

```
练习1：修改多个Cookie
  同时修改：
    is_admin = 1
    role = admin
    level = 999

练习2：尝试其他值
  布尔值：true/false, yes/no, on/off
  数字：0/1, 1/2/3
  字符串：user/admin, guest/root

练习3：组合攻击
  先修改Cookie
  再访问/admin路径
  看是否有隐藏页面
```

### 7.4 使用Console修改Cookie

```
方法1：直接修改（简单）
  document.cookie = "is_admin=1";
  
  这会添加或修改Cookie
  但不会删除已有的同名Cookie
  （如果有Domain或Path不同的话）

方法2：完整设置
  document.cookie = "is_admin=1; path=/; domain=.example.com";

方法3：查看所有Cookie
  console.log(document.cookie);
  
  输出：
  "session_id=abc123; username=guest; is_admin=0"

注意：
  HttpOnly的Cookie不能用JS读取和修改
  必须用F12的Application面板修改
```

---

## 八、防御方法

### 8.1 后端验证

```
正确的做法：
  不要只信任Cookie里的权限信息
  
错误：
  if ($_COOKIE['is_admin'] == 1) {
    show_admin_panel();
  }
  
正确：
  $user_id = $_SESSION['user_id'];
  $user = get_user_by_id($user_id);
  if ($user['role'] == 'admin') {
    show_admin_panel();
  }
  
解释：
  错误做法：直接看Cookie，用户可修改
  正确做法：根据Session查数据库，用户改不了
```

### 8.2 Cookie安全设置

```
设置安全的Cookie：

1. 使用HttpOnly
   Set-Cookie: session_id=abc123; HttpOnly
   
2. 使用Secure
   Set-Cookie: session_id=abc123; Secure
   
3. 使用SameSite
   Set-Cookie: session_id=abc123; SameSite=Strict
   
4. 设置合理过期时间
   Set-Cookie: session_id=abc123; Max-Age=3600
   
5. 登录后重生成SessionID
   session_regenerate_id(true);

完整示例：
  Set-Cookie: session_id=abc123; 
    Path=/; 
    Domain=.example.com;
    Max-Age=3600;
    Secure;
    HttpOnly;
    SameSite=Strict
```

### 8.3 权限设计原则

```
最小权限原则：
  用户只能访问必需的资源
  默认拒绝，显式允许

纵深防御：
  前端校验 + 后端校验
  Cookie校验 + Session校验 + 数据库校验

日志记录：
  记录敏感操作
  发现异常行为

定期审计：
  检查权限配置
  清理过期Session
```

---

## 九、今日总结

### 9.1 知识点回顾

```
✅ Cookie是什么
  - 网站存在浏览器里的"小纸条"
  - 用来记住你的身份和状态

✅ Cookie的工作原理
  - 服务器设置 → 浏览器保存 → 每次请求带上

✅ Cookie的属性
  - Name, Value, Domain, Path
  - Expires, Secure, HttpOnly, SameSite

✅ F12修改Cookie
  - Application → Cookies
  - 双击修改值
  - 添加/删除Cookie

✅ 越权攻击
  - 修改权限相关Cookie
  - 水平越权和垂直越权

✅ Session
  - 服务器端的用户状态
  - 通过SessionID关联Cookie

✅ 防御方法
  - 后端验证
  - 安全属性
  - 最小权限原则
```

### 9.2 关键记忆点

```
记住这三句话：

1. Cookie是会员卡，可以伪造
   → 后端不能全信Cookie

2. HttpOnly = JS读不了
   → XSS偷不了Cookie

3. 越权 = 改Cookie提权
   → 找is_admin/role这类Cookie

黄金Payload：
  is_admin = 0 → 1
  role = user → admin
  level = 1 → 999
```

### 9.3 今日作业

```
必做题：
  1. 完成CTFHub「Cookie」题目
  2. 用F12修改至少3种不同的Cookie值
  3. 记录每种修改的效果

选做题：
  1. 尝试用Console的document.cookie修改
  2. 测试HttpOnly Cookie能否被JS读取
  3. 分析一个真实网站的Cookie结构

提交内容：
  - 解题截图
  - Cookie修改记录
  - 学习笔记
```

### 9.4 明日预告

```
Day 4：状态码与跳转——302跳转的奥秘

学习内容：
  - HTTP状态码详解
  - 301 vs 302跳转
  - Location响应头
  - F12追踪跳转
  - CTFHub 302题目

准备工作：
  - 复习常见状态码
  - 了解重定向原理
```

---

## 十、常见问题FAQ

### Q1: 修改Cookie没效果？

```
可能原因：
  1. 页面缓存：Ctrl+F5强制刷新
  2. Cookie没保存：检查Domain和Path
  3. 后端有验证：不是只看Cookie
  4. 需要重新登录：修改后需要重新认证

解决方法：
  - 清空缓存再试
  - 检查Cookie属性是否正确
  - 看Network面板确认Cookie是否发送
```

### Q2: 看不到Cookie？

```
可能原因：
  1. HttpOnly：JS看不到，但F12能看到
  2. 第三方Cookie：被浏览器阻止
  3. 已过期：Cookie已失效

解决方法：
  - 用F12的Application面板看
  - 检查浏览器隐私设置
  - 重新登录生成新Cookie
```

### Q3: 如何判断哪个Cookie控制权限？

```
方法：
  1. 看名字：admin, role, level, type
  2. 试修改：逐个修改看效果
  3. 看提示：页面提示"你不是管理员"
  4. 猜语义：is_admin明显是权限

常见权限Cookie名：
  - is_admin, admin, role
  - level, grade, rank
  - type, class, group
  - privilege, permission
```

### Q4: Cookie和LocalStorage的区别？

```
对比：

Cookie：
  - 自动随请求发送
  - 有大小限制（4KB）
  - 可设置过期时间
  - 可设置HttpOnly
  
LocalStorage：
  - 不会自动发送
  - 大小限制大（5MB）
  - 永久保存（除非手动删除）
  - JS可以读写

CTF中：
  权限控制一般用Cookie（自动发送）
  前端存储用LocalStorage（需手动读取）
```

---

## 十一、笔记模板

```
Day 3 学习笔记
====================

日期：____年__月__日
学习时长：___小时

一、Cookie基础
---------------
Cookie是什么：
  

Cookie工作原理：
  

二、Cookie属性
--------------
Secure：
  

HttpOnly：
  

SameSite：
  

三、越权攻击实战
----------------
发现的Cookie：
  Name: ____ Value: ____
  Name: ____ Value: ____

修改尝试：
  修改: ____ → ____
  效果: ____

四、CTFHub解题
--------------
题目：Cookie
解题步骤：
  1. 
  2. 
  3. 
Flag：

五、防御方法
------------
后端应该怎么做：
  

六、明日计划
------------
1. 
2. 
```

---

**恭喜你完成Day 3的学习！记住：Cookie就像会员卡，后端别太相信它！** 🎉
