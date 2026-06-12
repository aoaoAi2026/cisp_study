# JavaScript / Node.js 代码审计实战

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
