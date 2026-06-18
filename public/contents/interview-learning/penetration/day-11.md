# Day 11：社会工程学攻击

> 🎯 面试目标：掌握社工攻击链(信息收集→钓鱼→Payload投递)、钓鱼基础设施搭建、攻防对抗面试考点

## 知识速览

### 核心概念
- **社工攻击链**：OSINT信息收集(LinkedIn/GitHub/社交媒体)→目标画像分析→钓鱼场景设计(主题/紧迫性/权威性)→钓鱼基础设施搭建(域名/邮件服务器/钓鱼页面)→Payload投递→持久化与横向
- **GoPhish钓鱼框架**：开源钓鱼模拟平台，支持邮件模板管理、目标群组管理、点击追踪、凭证捕获、可视化Dashboard
- **域名伪装技术**：IDN同形异义字(如раypal.com用西里尔字母a)、子域名欺骗(如paypal.com.attacker.com)、域名仿冒(如paypa1.com数字1替代l)
- **实时钓鱼代理(Reverse Proxy Phishing)**：工具Modlishka/Evilginx在用户和真实网站之间做中间人→用户在「真网站」登录→代理捕获Session Token+密码→完全绕过MFA
- **宏文档攻击(Macro-based)**：利用Office VBA宏执行恶意代码，仍是成功率最高的钓鱼Payload投递方式之一(MalDoc)

### 必问考点
| 面试官可能怎么问 | 你应该怎么答 |
|------------------|--------------|
| 如何搭建一次完整的钓鱼演练？ | 七步：1)目标选择(管理层/财务/全员) 2)OSINT收集(确定兴趣点和诱饵) 3)注册伪装域名(提前7-14天) 4)配置GoPhish(SPF/DKIM/DMARC配置以提升送达率) 5)邮件模板编写(不包含可疑链接/拼写错误这种低级错误——真实攻击者不会犯) 6)发送+追踪(选择非休假日的周二三四上午9-11点) 7)结果分析+分部门定制培训。面试加分：强调演练的道德边界(不过度羞辱目标、不收集真实密码)。 |
| 域前置(Domain Fronting)在钓鱼C2通信中的原理？ | 域前置利用CDN(如CloudFront/Azure CDN)的共享证书特性：CDN边缘节点对不同Host头的请求路由到同一IP，检测只看SNI(看到的CDN域名是合法的如ajax.googleapis.com)，实际Host头指向C2。2021年后各大CDN逐渐封堵此技术，已被CDN域前置检测机制取代。替代方案：使用Cloudflare Workers等边缘计算平台做流量转发。 |
| CS(钴击)的Malleable C2 Profile在钓鱼中的重要性？ | Malleable C2 Profile允许自定义C2通信流量的特征：1)修改TLS/JA3指纹(模仿Chrome/Firefox浏览器) 2)自定义HTTP请求/响应格式(模仿正常API调用如Microsoft/Google API) 3)Host头变换(避免域名黑名单) 4)流量时序随机化(避免固定心跳被检测)。好的Profile能绕过80%的NIDS/NGFW流量检测。面试可以举例：把C2流量伪装成Microsoft Teams或Windows Update的通信模式。 |
| 如何对抗企业邮件网关的高级钓鱼检测？ | 进攻视角：1)预热域名(域名注册后先发几周正常邮件→建立正面信誉) 2)DMARC合规配置(SPF+DKIM正确设置，很多网关只看合规不看内容) 3)避免URL重定向(不要用短链接，用真实域名做301重定向) 4)HTML走私(HTML Smuggling——将Payload内嵌在HTML中下载，绕过文件类型检测) 5)使用合法的云服务(SharePoint/OneDrive/Dropbox托管Payload，网关不敢轻易拦截)。 |
| 水坑攻击(Watering Hole)和传统鱼叉钓鱼的区别？场景选择？ | 区别：传统钓鱼是钓鱼者去找鱼(主动发送诱饵)，水坑攻击是在鱼去的地方放饵(感染目标常访问的网站，被动等待)。场景：目标安全意识强、邮件网关严格时，水坑攻击绕过了邮件这一检测关口。面试点名：2015年Forbes网站被植入恶意广告针对国防工业、2017年CCleaner供应链污染是水坑+供应链的经典案例。 |

### 技术细节
**GoPhish 快速搭建指南**：
```bash
# 安装
wget https://github.com/gophish/gophish/releases/latest
unzip gophish*.zip && chmod +x gophish

# 配置config.json
"admin_server": {"listen_url": "0.0.0.0:3333"}
"phish_server": {"listen_url": "0.0.0.0:443", "use_tls": true}

# 启动
./gophish
```
**域名基础设施**：
- 购买相似域名(typosquatting)：paypaI.com, micr0soft.com
- 配置SSL证书(Let's Encrypt免费)
- SPF记录允许发送邮件：`v=spf1 mx a -all`
- DKIM配置(提升送达率)
**防御视角**：企业SOC应部署DMARC报告分析工具(如parsedmarc)，每天检查未授权发件源。

## 常见陷阱
- ⚠️ 钓鱼演练的目标是教育不是羞辱——不应该在全员大会上公布'XXX点到了钓鱼链接'
- ⚠️ 忽视合法的云服务——现代钓鱼大量使用Google Forms/Office 365/SharePoint，无法简单靠域名黑名单防御
- ⚠️ 钓鱼不仅限于邮件——电话(Vishing)、短信(Smishing)、社交媒体私信、QR码钓鱼(Quishing)都是有效载体

## 今日检测
1. 用GoPhish搭建一次模拟钓鱼演练(在自己授权的域名上)，测试送达率和点击率
2. 注册一个IDN同形异义域名，观察浏览器的Punycode显示差异
3. 分析你收到的最近10封营销邮件(尤其是拼写/链接/发件人)，判断是否有钓鱼特征
