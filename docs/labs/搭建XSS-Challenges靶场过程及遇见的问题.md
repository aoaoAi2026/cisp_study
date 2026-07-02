# 搭建XSS-Challenges靶场过程及遇见的问题

> 本文档存放于 docs/labs 目录中

## 一、搭建过程

### 1.1 靶场来源
Day087 靶场3：XSS 专项练习（4 关过滤由弱到强）

### 1.2 环境信息
- 操作系统：Kali Linux
- IP 地址：192.168.108.128
- Web 服务：Apache2
- 部署路径：`/var/www/html/xss`
- 技术栈：PHP

### 1.3 搭建步骤

1. **尝试 clone GitHub 仓库（失败）**
   尝试克隆两个常见 XSS Challenges GitHub 仓库，因网络原因超时/失败，放弃直接 clone。

2. **手动编写 4 关 PHP 代码**
   直接在 Kali 上编写 `/var/www/html/xss/index.php`，包含 4 个关卡：
   - **Level 1**：无任何过滤，直接输出用户输入
   - **Level 2**：使用 `str_ireplace('script', '', $input)` 过滤（大小写不敏感替换 script 标签）
   - **Level 3**：使用 `preg_replace('/<script.*?>.*?<\/script>/is', '', $input)` 正则过滤 script 块
   - **Level 4**：使用 `htmlspecialchars($input, ENT_NOQUOTES)` 转义 HTML 特殊字符（但不转义引号）

3. **遇到 PowerShell 5 here-string token 解析冲突**
   Windows 端 PowerShell 5 在处理 PHP 代码中的 `'`（单引号）、`` ` ``（反引号）、`,`（逗号）等特殊字符时，here-string 解析器出现 token 冲突，无法直接通过 here-string 传递 PHP 代码。

4. **改用 base64 跨端编码方案（成功）**
   - Windows 端：将 PHP 代码通过 UTF-8 编码为 Base64 字符串
   - Kali 端：使用 `base64 -d` 解码后落盘到目标路径
   ```bash
   # Kali 端示例（假设 base64 字符串已传递）
   echo '<BASE64_STRING>' | base64 -d > /var/www/html/xss/index.php
   sudo chown www-data:www-data /var/www/html/xss/index.php
   sudo chmod 644 /var/www/html/xss/index.php
   ```

5. **验证部署成功**
   ```bash
   curl -s http://127.0.0.1/xss/index.php | grep "XSS Challenges Day087"
   ```
   - HTTP 状态码 200
   - grep 命中关键词 2 处 → 验证成功

---

## 二、遇见的问题及解决方案

### 问题 1：GitHub clone 慢 / 超时

**现象**：
两个 XSS Challenges 相关 GitHub 仓库 clone 时，要么连接超时，要么下载速度极慢（KB/s 级别），超过 5 分钟仍未完成。

**原因**：
国内访问 GitHub.com 网络不稳定，丢包严重。

**解决方案**：
放弃直接 clone，改为手动编写核心 4 关 PHP 代码（代码量不大，逻辑清晰）。

---

### 问题 2：PowerShell 5 与 PHP 代码符号冲突

**现象**：
使用 PowerShell 5 here-string（`@' ... '@`）包裹 PHP 代码时：
- PHP 中的 `'` 单引号与 PowerShell here-string 结束符冲突
- PHP 中的 `` ` `` 反引号被 PowerShell 解析为转义字符
- PHP 数组中的 `,` 逗号在部分上下文中被误解析

导致代码落盘后内容残缺、语法错误。

**解决方案**：
使用 **Base64 跨端编码** 作为稳定的传参方案：
1. Windows 端将 PHP 代码以 UTF-8 编码为 Base64（无特殊字符，纯 ASCII）
2. 通过剪贴板或文本文件将 Base64 字符串传到 Kali
3. Kali 端 `base64 -d` 解码后直接落盘
4. 该方案不受特殊字符影响，稳定可靠

---

## 三、访问地址与验证截图

### 访问地址
```
# Level 1（无过滤）
http://192.168.108.128/xss/index.php?level=1

# Level 2（str_ireplace script）
http://192.168.108.128/xss/index.php?level=2

# Level 3（preg_replace script）
http://192.168.108.128/xss/index.php?level=3

# Level 4（htmlspecialchars ENT_NOQUOTES）
http://192.168.108.128/xss/index.php?level=4
```

### 验证截图位置
截图存放于项目 `docs/labs/screenshots/xss-challenges/` 目录下（如不存在请手动创建并补充截图）：
- `level1-page.png`：Level 1 页面 + 触发 XSS 弹窗截图
- `level2-bypass.png`：Level 2 绕过 str_ireplace 的 payload 截图
- `level3-bypass.png`：Level 3 绕过 preg_replace 的 payload 截图
- `level4-bypass.png`：Level 4 绕过 htmlspecialchars ENT_NOQUOTES 的 payload 截图
