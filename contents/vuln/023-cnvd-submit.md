# CNVD / CNNVD 漏洞报送流程与规范

## 1. 平台简介

| 平台 | 全称 | 入口 |
|------|------|------|
| **CNVD** | 国家信息安全漏洞共享平台（China National Vulnerability Database） | https://www.cnvd.org.cn |
| **CNNVD** | 国家信息安全漏洞库（China National Vulnerability Database of Information Security） | http://www.cnnvd.org.cn |

两家平台均由国家相关部委支持运营，面向安全研究者、厂商与用户，负责漏洞的收录、验证、通报与编号分配。

## 2. 报送前准备

### 2.1 确认漏洞唯一性

1. 在 CNVD / CNNVD / CVE / GitHub / 厂商安全公告中搜索是否已有同类漏洞；
2. 确认漏洞影响的产品 / 版本 / 组件是否尚未有公开编号；
3. 若为通用组件，优先考虑同时申请 CVE 与 CNVD，提升影响力。

### 2.2 所需材料清单

- 漏洞标题（简洁准确，建议 `厂商 产品 版本 漏洞类型`）
- 漏洞类型（SQL 注入 / XSS / 反序列化 / 越权 / 文件上传 ...）
- 影响版本（精确到小版本，如 `1.0 <= v < 1.2.3`）
- 复现步骤 / PoC / 截图 / 流量文件（含完整 HTTP 请求与响应）
- 漏洞原理描述（必要时附源码引用或调试截图）
- 修复建议（尽量给出补丁 diff 或临时缓解方案）
- 研究人员信息（真实姓名 / 工作单位 / 邮箱 / 电话 / 身份证号 - 部分平台要求实名认证）

### 2.3 厂商自行修复的建议

对于大型厂商产品，可先联系厂商 PSIRT（Product Security Incident Response Team），给予 30-90 天修复窗口，再行披露：

- 华为 PSIRT：psirt@huawei.com
- 阿里云：security@aliyun.com
- 腾讯：sec@tencent.com
- 百度：security@baidu.com
- 一般邮件标题：`[漏洞上报] 厂商名 产品名 漏洞描述 - 研究者署名`

## 3. CNVD 报送流程

### 3.1 注册与登录

1. 访问 https://www.cnvd.org.cn/
2. 注册账号并完成实名认证（需要身份证 + 手机号 + 工作单位）
3. 进入 `个人中心 → 漏洞报送`

### 3.2 表单结构

```
1. 漏洞基本信息
   - 漏洞标题（必填）
   - 漏洞类型（下拉选择，可手动输入未收录类型）
   - 漏洞等级（严重 / 高危 / 中危 / 低危）
   - 影响产品 / 组件（必填）
   - 影响版本（必填，建议使用区间表示法）

2. 厂商信息
   - 厂商名称（必填）
   - 厂商官网
   - 是否为通用软硬件 / 行业应用 / IoT / 工控系统

3. 漏洞详情
   - 漏洞描述
   - 复现步骤（逐条列出）
   - PoC / EXP 说明（文本 / 附件）
   - 修复建议

4. 附件上传
   - HTTP 请求 raw 文件（建议 .txt）
   - 复现录屏 / 截图（建议 .png / .jpg / .mp4）
   - 靶场复现脚本（可选）
```

### 3.3 提交后的流程

1. **初审（1-3 个工作日）**：CNVD 工作人员核对资料完整性；
2. **厂商验证（15-90 天）**：CNVD 同步漏洞给受影响厂商，厂商验证与修复；
3. **审核通过**：分配 `CNVD-YYYY-XXXXXX` 编号；
4. **公开收录**：厂商修复或时间窗口到期后，在官网公开收录页面。

## 4. CNNVD 报送流程

1. 访问 http://www.cnnvd.org.cn/
2. 注册账号并实名认证（部分高校邮箱可快速认证）
3. 进入 `漏洞报送` 或 `漏洞共享` 入口
4. 填写表单（字段与 CNVD 相似）
5. 审核通过后分配 `CNNVD-YYYY-XXXXXX` 编号

## 5. CVE 申请（可选，提升国际影响力）

若漏洞涉及国际通用产品（开源软件、国际硬件/软件厂商），可同时通过 MITRE 申请 CVE 编号：

1. 访问 https://cve.mitre.org/
2. 使用 CVE Request Web Form（https://cveform.mitre.org/）提交
3. 字段要求：
   - Product / Vendor / Version
   - Attack type / Impact
   - PoC 或 advisory 链接
   - 研究者信息
4. 一般 5-10 个工作日收到 `CVE-YYYY-XXXXXX` 分配编号

> 注：GitHub Advisory Database、NVD 等也会自动聚合 CVE 信息。

## 6. 报告质量检查清单

- [ ] 标题清晰、简洁、不包含敏感个人信息
- [ ] 明确厂商 + 产品 + 版本 + 官方下载地址
- [ ] 复现步骤一步一步，每个步骤附截图
- [ ] PoC 可执行：包含完整 HTTP 请求（URL、Method、Body、Headers）
- [ ] 原理分析到位，引用代码行 / 配置行
- [ ] 修复建议具体：升级版本 / 临时补丁 / 配置修改均可
- [ ] 附件命名规范：`产品名_版本_漏洞类型_请求.txt` / `复现截图.png`
- [ ] 不含无关敏感数据（他人账号、真实生产环境 Token 等）

## 7. 常见坑点与应对

| 问题 | 原因 | 应对 |
|------|------|------|
| 初审被退回，"信息不足" | 缺少版本、影响范围、厂商信息 | 补齐基本字段后重新提交 |
| 审核周期过长 | 厂商验证慢 / 漏洞较复杂 | 通过站内信 / 邮件联系管理员，提供补充材料 |
| 厂商认为非漏洞 | 业务逻辑判定争议 / 需要的功能设计 | 提供更完整的危害论证 / 实际业务场景 |
| 同一漏洞多平台同时提交 | 研究者分散提交 | 在报告中声明已同时提交 CNVD / CNNVD / CVE |
| 编号被他人抢注 | 已有相同漏洞提交 | 作为复现人参与，或补充更深入分析作为独立漏洞 |

## 8. 报告模板示例

```
【漏洞标题】
XXCMS v1.2.3 login.php 接口 SQL 注入漏洞

【厂商】
XXCMS Team / 北京 XX 科技有限公司

【影响版本】
XXCMS v1.2.3 及以下版本

【漏洞类型】
SQL 注入 (SQL Injection)

【复现步骤】
1. 访问 https://target.com/login.php
2. 在 username 输入 admin' or '1'='1
3. password 任意输入、提交
4. 返回用户中心，说明注入成功

【PoC】
POST /login.php HTTP/1.1
Host: target.com
Content-Type: application/x-www-form-urlencoded

username=admin' or '1'='1&password=xxx

【响应】
HTTP/1.1 302 Found
Location: /admin/dashboard.php

【原理】
login.php 未对 username 参数使用预编译语句，直接拼接 SQL：
$username = $_POST['username'];
$sql = "SELECT * FROM users WHERE username = '$username' AND password = md5('$password')";

【修复建议】
1. 使用 PDO / mysqli 预编译语句
2. 对 username 做白名单校验（字母 + 数字 + 下划线）
3. 最小权限数据库账号，避免 FILE / SUPER 权限
```

## 9. 注意事项

1. **合规**：提交前确认你有合法授权访问目标系统；
2. **不攻击生产**：若使用真实业务系统验证，必须在授权范围内并提前报备；
3. **不泄漏他人数据**：报告中模糊化真实用户名、手机号、身份证等；
4. **时间窗口**：对厂商友好，给予合理修复时间；
5. **持续跟进**：审核期间可能多次沟通，定期登录平台查看状态；
6. **学术诚信**：多人合作时明确署名顺序，避免重复提交；
7. **安全意识**：账号、身份证、邮箱等信息防止钓鱼与社工诈骗。
