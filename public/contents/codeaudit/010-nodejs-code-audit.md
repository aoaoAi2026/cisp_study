# JavaScript / Node.js 代码审计实战

> **📘 文档定位**：CISP 考试代码审计内容 | 难度：⭐⭐⭐ | 预计阅读：15 分钟
> Node.js 代码审计关注原型链污染、命令注入、JWT 安全与 npm 供应链风险。原型链污染是 JavaScript 特有的高危漏洞类型。

---

## 导航目录
- [一、原型链污染](#一原型链污染)
- [二、命令注入](#二命令注入)
- [三、JWT 安全](#三jwt-安全)
- [四、npm 依赖审计](#四npm-依赖审计)
- [五、Serverless 安全](#五serverless-安全)
- [六、Checklist](#六checklist)
- [七、高分考点与知识巧记](#七高分考点与知识巧记)

---

## 一、原型链污染

```javascript
// CVE-2019-10744: lodash.defaultsDeep ＜ 4.6.0

// ❌ 不安全的合并
const _ = require('lodash');
_.defaultsDeep({}, JSON.parse(userInput));
// userInput = {"__proto__":{"isAdmin":true}} 
// → 全局 Object.prototype.isAdmin = true
// → 所有对象的 isAdmin 都是 true！

// ✅ 安全：使用 safeMerge/白名单属性
function safeMerge(target, source) {
    for (const key of Object.keys(source)) {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
            continue;  // 跳过危险key
        }
        target[key] = source[key];
    }
}
// 或使用Object.create(null)创建无原型的对象
const safe = Object.create(null);
```

---

## 二、命令注入

```javascript
// ❌ child_process.exec 字符串拼接
const { exec } = require('child_process');
exec(`ping ${userInput}`, (err, stdout) => {});

// ✅ spawn 使用参数数组
const { spawn } = require('child_process');
const proc = spawn('ping', [userInput]);

// ⚠️ eval/Function 也是命令执行入口
eval(userInput);  // ⚠️ 高危！
new Function(userInput)();  // ⚠️ 高危！
```

---

## 三、JWT 安全

```javascript
// ❌ alg=none 攻击
// jwt.verify 没有指定 algorithms 参数
jwt.verify(token, 'secret');
// 攻击者构造: {"alg":"none","typ":"JWT"}.{"admin":true}.
// → 无签名验证 → JWT验证通过

// ✅ 强制指定 algorithms
jwt.verify(token, 'secret', { algorithms: ['HS256'] });

// ❌ 弱密钥
const token = jwt.sign(payload, '123456');  // 弱密钥！

// ✅ 强密钥 + 环境变量
const token = jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '1h'
});
```

---

## 四、npm 依赖审计

```bash
# 依赖漏洞扫描
npm audit
npm audit --audit-level=high

# 使用 --production 只扫描生产依赖
npm audit --production

# Snyk 深入分析
npx snyk test
npx snyk monitor

# 常见高危依赖漏洞：
# - 原型链污染 (lodash/merge-deep等)
# - RCE漏洞 (node-serialize/parse-url等)
# - ReDoS 正则拒绝服务
```

---

## 五、Serverless 安全

```
Serverless 函数(如AWS Lambda)审计要点：
  ✦ 环境变量中的密钥是否加密存储？
  ✦ 函数超时配置是否过大？（默认3秒建议）
  ✦ IAM Role是否最小权限？
  ✦ 是否有未使用的触发器(Triggers)？
  ✦ 冷启动时的初始化代码是否有漏洞？
  ✦ 第三方层(Layer)来源是否可信？
```

---

## 六、Checklist

- [ ] 原型链污染防护（__proto__过滤）
- [ ] child_process.spawn替代exec
- [ ] JWT algorithms强制指定
- [ ] npm audit + Snyk 定期扫描
- [ ] Serverless IAM最小权限

---

## 七、高分考点与知识巧记

> 🔑 **高分考点**：Node.js 审计核心考点是原型链污染（JavaScript 特有）、exec vs spawn 安全性、JWT alg:none 攻击。原型链污染是高频考点，lodash.defaultsDeep 是经典案例。

| 考点 | 频次 | 核心记忆点 |
|:---|:---:|:---|
| 原型链污染 | ⭐⭐⭐⭐⭐ | __proto__/constructor 注入，lodash < 4.6.0 |
| exec vs spawn | ⭐⭐⭐⭐ | exec 字符串拼接危险，spawn 参数数组安全 |
| JWT alg:none | ⭐⭐⭐⭐ | 不指定 algorithms 可被 none 绕过 |
| npm audit | ⭐⭐⭐ | npm audit --production + snyk test |
| Serverless 安全 | ⭐⭐⭐ | 环境变量加密、IAM 最小权限、超时配置 |

> 💡 **知识巧记**：原型链污染核心记"__proto__ 全局改，Object.create(null) 无原型安"。Node.js 命令注入记"exec 拼 spawn 数"——exec 拼接字符串危险，spawn 参数数组安全。JWT 三防：指定 algorithms、强密钥、短有效期。

### 高分考点速查表

| 考察维度 | 关键结论 | 常见干扰项 |
|:---|:---|:---|
| 原型链污染 | 通过 __proto__ 修改 Object.prototype，影响所有对象 | "原型链污染只影响当前对象" ❌ |
| exec vs spawn | exec 默认 shell 解析，spawn 不经过 shell | "exec 和 spawn 安全性相同" ❌ |
| JWT none | 不指定 algorithms 参数可被 none 算法绕过 | "JWT 库默认禁止 none" ❌ |
| npm audit | 仅扫描生产依赖，devDependencies 也需关注 | "npm audit 自动修复所有漏洞" ❌ |

### 知识巧记口诀

> **Node.js 审计口诀**：
> 原型链污染是特产，__proto__ 过滤 create(null) 安。
> 命令执行 spawn 替 exec，参数数组避 shell 串。
> JWT 三防护 none，强密钥短有效期 algorithms 限。
> npm audit 定期扫，Serverless IAM 最小权。
