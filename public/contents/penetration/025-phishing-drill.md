# 钓鱼攻击演练全流程

> **📘 文档定位**：CISP 考试 渗透测试 核心 | 难度：⭐⭐⭐ | 预计阅读：25 分钟
>
> 系统讲解钓鱼攻击演练的完整流程：方案设计→目标选择→钓鱼站点搭建→邮件/IM投递→数据收集→复盘报告，是安全意识验证的核心工具。

---

## 导航目录

- [一、演练方案设计](#一演练方案设计)
- [二、钓鱼场景搭建](#二钓鱼场景搭建)
- [三、投递与执行](#三投递与执行)
- [四、数据收集与分析](#四数据收集与分析)
- [五、复盘与培训改进](#五复盘与培训改进)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 一、演练四阶段

```
钓鱼演练生命周期：

  策划(1-2周) → 执行(1天) → 检测(1周) → 复盘(1周)
```

---

## 二、Gophish 钓鱼平台搭建

```bash
# 下载 Gophish
wget https://github.com/gophish/gophish/releases/download/v0.12.1/gophish-v0.12.1-linux-64bit.zip
unzip gophish-v0.12.1-linux-64bit.zip
./gophish

# 访问 https://localhost:3333
# 默认 admin / admin（首次登录强制改密码）

# 配置：Sending Profiles → Landing Pages → Email Templates → Campaigns
```

```
Gophish 配置要点：
  ✓ SMTP中继：使用企业邮件服务器或SendGrid API
  ✓ SPF/DKIM/DMARC：确保发件不被标记为垃圾邮件
  ✓ Landing Page：仿冒企业VPN/OA/邮箱登录页
  ✓ 数据捕获：记录谁提交了密码 → 仅用于培训统计
```

---

## 三、邮件伪造评估

```
企业邮件安全三件套检查：

SPF (Sender Policy Framework):
  定义哪些IP可以代表该域名发邮件
  检查：dig TXT company.com | grep spf
  
DKIM (DomainKeys Identified Mail):
  邮件签名 → 接收服务器验证 → 防伪造
  检查：邮件头中DKIM-Signature字段

DMARC:
  综合SPF+DKIM → 定义失败后的策略(reject/quarantine/none)
  检查：dig TXT _dmarc.company.com

演练前检查项：
  SPF记录是否完整？
  DKIM是否启用？
  DMARC策略是否为reject？(none=形同虚设)
```

---

## 四、演练指标

```
钓鱼演练核心指标：

打开率 = 打开邮件人数 / 收到邮件人数
→ 目标：< 30%

点击率 = 点击链接人数 / 打开邮件人数
→ 目标：< 10%

凭证输入率 = 输入密码人数 / 点击链接人数
→ 目标：< 5%

上报率 = 主动举报钓鱼邮件人数 / 收到邮件人数
→ 目标：> 50% （越高越好）

改进方法：
  • 对"中招"员工进行针对性安全意识培训
  • 每季度进行一次钓鱼演练
  • 对比各次演练指标 → 观测趋势
```

---

## 五、Checklist

- [ ] Gophish/钓鱼平台搭建
- [ ] SPF/DKIM/DMARC 邮件安全配置审计
- [ ] 演练邮件模板设计
- [ ] Landing Page 制作（不存储明文密码）
- [ ] 演练通知高层审批
- [ ] 执行 → 统计 → 分析
- [ ] 复盘报告 + 针对性培训
- [ ] 每季度重复 → 跟踪改进
