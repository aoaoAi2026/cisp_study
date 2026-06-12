# 渗透测试资产测绘与信息收集实战手册

> 📅 2026-06-12 | 🎯 进阶 | ⏱ 20 min | 分类：渗透测试

## 📋 提纲

1. 信息收集七阶段
2. 子域名收集全套工具
3. 指纹识别与CMS识别
4. JavaScript信息泄露
5. 目录/文件爆破
6. GitHub/网盘信息泄露

---

## 1. 信息收集七阶段

```
阶段1: 被动收集（不接触目标）
  搜索引擎/证书透明度/DNS历史/Whois/社交媒体

阶段2: DNS枚举
  子域名爆破/域传送/DNS记录分析

阶段3: 网络层探测
  端口扫描/C段探测/ASN发现

阶段4: Web层信息收集
  指纹识别/目录爆破/JS分析/API发现

阶段5: 代码仓库泄露
  GitHub/GitLab/网盘/源码泄露

阶段6: 企业信息收集
  组织架构/员工信息/第三方供应商

阶段7: 汇总分析
  资产清单+攻击面分析
```

---

## 2. 子域名全收集

```bash
#!/bin/bash
# subdomain_enum.sh - 全量子域名收集

DOMAIN="$1"

echo "=== 子域名全量收集: $DOMAIN ==="

# 1. 被动收集
echo "[1] 被动收集..."
# crt.sh
curl -s "https://crt.sh/?q=%25.$DOMAIN&output=json" | jq -r '.[].name_value' | sed 's/\*\.//g' | sort -u > subs_crtsh.txt

# AlienVault OTX
curl -s "https://otx.alienvault.com/api/v1/indicators/domain/$DOMAIN/passive_dns" | jq -r '.passive_dns[].hostname' | sort -u > subs_otx.txt

# SecurityTrails (需API)
curl -s "https://api.securitytrails.com/v1/domain/$DOMAIN/subdomains" -H "APIKEY: $ST_KEY" | jq -r '.subdomains[]' | sed "s/$/.$DOMAIN/" >> subs_st.txt

# 2. 字典爆破
echo "[2] DNS字典爆破..."
# 使用shuffledns + massdns
shuffledns -d $DOMAIN -w /usr/share/wordlists/subdomains-top1million-5000.txt -r resolvers.txt -o subs_brute.txt

# 3. 合并去重
cat subs_*.txt | sort -u > all_subdomains.txt
echo "  发现 $(wc -l < all_subdomains.txt) 个唯一子域名"

# 4. DNS解析
echo "[3] DNS解析..."
cat all_subdomains.txt | dnsx -silent -a -resp -o resolved_subs.txt
echo "  解析成功: $(wc -l < resolved_subs.txt)"

# 5. HTTP探测
echo "[4] HTTP服务探测..."
cat resolved_subs.txt | httpx -silent -title -status-code -tech-detect -o alive_websites.txt
echo "  发现Web服务: $(wc -l < alive_websites.txt)"
```

---

## 3. 指纹识别

```python
#!/usr/bin/env python3
"""Web指纹识别工具"""

import requests
import re
from urllib.parse import urljoin

class WebFingerprint:
    FINGERPRINTS = {
        'ThinkPHP': [
            {'path': '/index.php?s=index/think\\app/invokefunction', 'status': [200, 500]},
            {'header': 'X-Powered-By', 'pattern': 'ThinkPHP'},
        ],
        'Shiro': [
            {'cookie': 'rememberMe=deleteMe', 'check': 'Set-Cookie'},
        ],
        'Spring Boot': [
            {'path': '/actuator/health', 'status': 200},
            {'path': '/error', 'pattern': 'Whitelabel Error Page'},
        ],
        'Struts2': [
            {'path': '/struts/webconsole.html', 'status': 200},
            {'ext': '.action;.do', 'status': [200, 404]},
            {'path': '/.action', 'status': 200},
            {'path': '/index.action', 'status': 200},
        ],
        'Fastjson': [
            {'post': '{"test":"test"}', 'header': 'Content-Type', 'hval': 'application/json',
             'check_status': 200, 'check_body': 'fastjson'},
        ],
        'Swagger': [
            {'path': '/swagger-ui.html', 'status': 200},
            {'path': '/swagger-resources', 'status': 200},
            {'path': '/v2/api-docs', 'status': 200},
            {'path': '/v3/api-docs', 'status': 200},
        ],
        'Druid': [
            {'path': '/druid/index.html', 'status': 200},
            {'path': '/druid/login.html', 'status': 200},
        ],
    }

    def scan(self, url):
        found = []
        for name, checks in self.FINGERPRINTS.items():
            for check in checks:
                if self.check_fingerprint(url, check):
                    found.append(name)
                    break
        return found

    def check_fingerprint(self, url, check):
        try:
            if 'path' in check:
                resp = requests.get(urljoin(url, check['path']), verify=False, timeout=5, allow_redirects=False)
                if 'pattern' in check:
                    return check['pattern'] in resp.text
                if 'status' in check:
                    return resp.status_code in (check['status'] if isinstance(check['status'], list) else [check['status']])
            if 'header' in check:
                resp = requests.get(url, verify=False, timeout=5)
                return check['pattern'] in resp.headers.get(check['header'], '')
            if 'cookie' in check:
                resp = requests.get(url, cookies={'rememberMe': 'deleteMe'}, verify=False, timeout=5)
                return check['check'] in resp.headers.get('Set-Cookie', '')
        except:
            pass
        return False
```

---

## 4. JS信息泄露分析

```bash
# 1. 提取所有JS文件
cat alive_websites.txt | gau --js | sort -u > js_files.txt

# 2. 从JS提取敏感信息
cat js_files.txt | while read url; do
    curl -sk "$url" | grep -iE '(api[_-]?key|api[_-]?secret|access[_-]?key|auth[_-]?token|password|secret|token|aws_access|private_key|AKIA|bearer|authorization)' >> js_secrets.txt
done

# 3. 提取JS中的路径/API
cat js_files.txt | while read url; do
    curl -sk "$url" | grep -oE '["'"'"'](/[a-zA-Z0-9_/.-]+)["'"'"']' | sort -u >> js_apis.txt
done

# 4. 使用 LinkFinder 深度提取
python3 LinkFinder.py -i "$url" -o cli >> js_endpoints.txt
```

---

## 5. 目录爆破

```bash
# 使用 ffuf 快速目录爆破
ffuf -u https://target.com/FUZZ \
    -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt \
    -fc 403,404 \
    -t 50 \
    -o dir_results.json

# 重点路径
for path in .git/config .env .svn/entries .DS_Store \
    wp-config.php.bak config.php.bak database.yml.bak \
    backup/ admin/ phpmyadmin/ .htaccess robots.txt; do
    status=$(curl -sk -o /dev/null -w "%{http_code}" "https://target.com/$path")
    [ "$status" != "404" ] && echo "$path → $status"
done
```

---

## ✅ 信息收集 Checklist

- [ ] 子域名全收集（被动+字典+证书）
- [ ] DNS解析+HTTP探测
- [ ] Web指纹/中间件/CMS识别
- [ ] JS信息泄露分析
- [ ] 目录/文件爆破（含.git/.env等）
- [ ] GitHub/网盘源码泄露
- [ ] 资产清单+攻击面汇总

> 📚 延伸阅读：Penetration/001-Web流程 | HW/002-资产自查 | Cloud/001-云安全
