# CMS / 框架指纹识别与 0day / Nday 利用

> **📘 文档定位**：CISP 考试 漏洞挖掘 核心 | 难度：⭐⭐⭐ | 预计阅读：25 分钟
>
> 系统讲解 CMS/框架指纹识别技术、Nday 漏洞利用流程及 0day 挖掘思路，覆盖 WordPress/Drupal/Joomla 等主流 CMS 的安全分析方法。

---

## 导航目录

- [一、指纹识别概述](#一指纹识别概述)
- [二、主动指纹识别技术](#二主动指纹识别技术)
- [三、被动指纹识别技术](#三被动指纹识别技术)
- [四、Nday 漏洞利用流程](#四nday-漏洞利用流程)
- [五、0day 挖掘思路](#五0day-挖掘思路)
- [六、安全部署 Checklist](#六安全部署-checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 一、指纹识别概述

指纹识别（Fingerprinting）是通过分析 HTTP 响应特征、路径结构、静态资源哈希、Cookie 名称等信息，判断目标使用的 CMS、框架、中间件、开发语言及其版本。准确识别是后续 0day / Nday 漏洞利用的前提。

| 类型 | 常见识别目标 |
|------|------------|
| CMS | WordPress、Joomla、Drupal、Discuz、PHPCMS、DedeCMS、Typecho、Confluence、Zimbra |
| 国内 CMS | 织梦、帝国 CMS、PHPCMS V9、ECShop、ThinkCMF、DzzOffice、禅道、宝塔 |
| 应用框架 | Spring Boot、Django、Flask、ThinkPHP、Laravel、Struts2、Node.js (Express/Nest) |
| 中间件 / 服务器 | Nginx、Apache、IIS、Tomcat、Jetty、Weblogic、JBoss、Lighttpd、Caddy |

## 2. 常见指纹识别方法

### 2.1 HTTP Header 识别

```
# X-Powered-By
X-Powered-By: PHP/7.3.4
X-Powered-By: ASP.NET
X-Powered-By: Express

# Server
Server: Apache/2.4.29 (Ubuntu)
Server: nginx/1.14.0 (Ubuntu)
Server: Microsoft-IIS/8.5

# 框架特有 Header
X-Frame-Options: SAMEORIGIN
X-AspNet-Version: 4.0.30319
X-AspNetMvc-Version: 5.2
X-Drupal-Cache: MISS
Set-Cookie: PHPSESSID=...       # PHP
Set-Cookie: JSESSIONID=...       # Java
Set-Cookie: sessionid=...        # Django
Set-Cookie: connect.sid=...      # Express session
```

### 2.2 静态文件路径与版本号

```
# WordPress
/wp-content/themes/
/wp-content/plugins/
/readme.html                    # 版本信息

# Drupal
/misc/drupal.js
/core/CHANGELOG.txt

# Joomla
/administrator/manifests/files/joomla.xml

# Discuz
/static/image/common/logo.png   # 默认 logo 哈希

# Spring Boot Actuator
/actuator/
/actuator/env
/actuator/heapdump

# ThinkPHP
/thinkphp/library/think/View.class.php
/?s=captcha                     # 经典路由
```

### 2.3 常见文件探测清单

```
/robots.txt
/favicon.ico                     # 哈希比对 (OWASP favicon database)
/crossdomain.xml
/.git/HEAD
/.svn/entries
/.DS_Store
/backup/                         # 备份目录
/admin/                          # 管理后台
/phpinfo.php
/info.php
/console/
/swagger-ui.html
/actuator/
/health
/env
/metrics
```

## 3. 自动化工具

### 3.1 Nuclei + 指纹模板

```bash
# 全面扫描目标指纹
nuclei -u https://target.com -t ~/nuclei-templates/technologies/

# 目录级 CVE 扫描
nuclei -u https://target.com -t ~/nuclei-templates/cves/

# 常见 CMS 扫描
nuclei -u https://target.com -t ~/nuclei-templates/exposed-panels/
```

### 3.2 WhatWeb / Wappalyzer / EHole

```bash
whatweb https://target.com -v

# 子域名批量指纹识别
subfinder -d target.com -silent | httpx -title -tech-detect -status-code
```

### 3.3 CMSeeK / CMSmap

```bash
# CMS 专向探测
cmseek -u https://target.com
python3 cmsmap.py https://target.com -f W
```

## 4. 0day / Nday 利用流程

### 4.1 信息收集 → 匹配目标

1. 通过指纹识别得到目标框架 + 版本（如 `WordPress 5.3.2`）
2. 搜集可能影响该版本的公开漏洞 / CVE
3. 在以下渠道查找 PoC / EXP：
   - GitHub（关键字：`CVE-XXXX-YYYY`、框架名、`RCE`、`LFI` 等）
   - `www.exploit-db.com`、packetstormsecurity
   - `fofa.info`、`shodan.io` 同指纹资产统计
   - 国内安全论坛 / 公众号 / SSR 报告

### 4.2 验证 PoC 有效性

1. 本地搭建靶场（Docker / Vulhub / Vulfocus）
2. 复现漏洞 → 理解原理 → 测试目标环境
3. 针对目标环境调整 payload（不同 PHP / JDK 版本差异）

### 4.3 构造最终 EXP

1. 准备目标 URL / Cookie / Token
2. 使用 Burp 构造请求，或使用现成工具脚本
3. 命令执行 / 文件上传 / 数据库读取

### 4.4 典型 Nday 示例清单

| 组件 | 经典 Nday | 利用效果 |
|------|----------|---------|
| ThinkPHP 5.x | 5.0.23 RCE、5.0.24 captcha 反序列化 | 未授权 RCE |
| Struts2 | S2-045 / S2-057 / S2-061 | RCE |
| Shiro | Shiro-550 默认密钥反序列化 | 未授权 RCE |
| Confluence | CVE-2022-26134 OGNL | 未授权 RCE |
| WebLogic | T3 / CVE-2020-2555 / CVE-2020-14882 | 未授权 RCE |
| Spring Core | CVE-2022-22965 (Spring4Shell) | Tomcat WAR 部署写入 JSP |
| WordPress 插件 | File Upload、SQLi、LFI、RCE | 后台 RCE / 前台注入 |
| DedeCMS 织梦 | install 重装、后台 getshell、变量覆盖 | 整站控制 |

## 5. 修复建议

1. **隐藏版本信息**：关闭 `X-Powered-By`、`Server` header，使用通用错误页
2. **限制调试接口**：生产环境关闭 Actuator、Swagger、phpinfo、Console 等
3. **定期升级**：关注组件官方安全更新，升级至最新稳定版
4. **屏蔽敏感文件**：`.git`、`.svn`、`backup`、`install`、`setup` 等路径禁止外网访问
5. **部署 WAF**：作为边界补充防护，拦截已知 Nday payload
6. **定期扫描**：结合 Nuclei / Nessus / AWVS 定期自检，及时发现未修补漏洞
