const fs = require('fs');
const c = fs.readFileSync('cyberPenetration.ts', 'utf8');
const lines = c.split('\n');

// 更精确地追踪模板字符串的开闭
let depth = 0;
let lastContentStart = -1;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 查找 content: 后面跟着反引号（模板字符串开始）
    const contentMatch = line.match(/content:\s*`/);
    if (contentMatch) {
        lastContentStart = i + 1;
        depth++;
        console.log(`Line ${lastContentStart}: Template depth +1 = ${depth}`);
    }
    
    // 查找 `, 出现在行尾（模板字符串结束）
    const trimmed = line.trim();
    if (trimmed === '`,' || trimmed.endsWith('`,')) {
        if (depth > 0) {
            depth--;
            console.log(`Line ${i + 1}: Template depth -1 = ${depth} (started at line ${lastContentStart})`);
            if (depth === 0) lastContentStart = -1;
        } else {
            console.log(`Line ${i + 1}: WARNING: Unmatched template end`);
        }
    }
    
    // 检查 745 行附近
    if (i + 1 >= 740 && i + 1 <= 750) {
        console.log(`Line ${i + 1}: depth=${depth} lastContentStart=${lastContentStart} "${line.substring(0, 50)}..."`);
    }
}

console.log(`\nFinal depth: ${depth}`);
if (depth > 0) {
    console.log(`WARNING: ${depth} template(s) not closed, last started at line ${lastContentStart}`);
}
