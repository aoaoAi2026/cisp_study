const fs = require('fs');
const c = fs.readFileSync('cyberPenetration.ts', 'utf8');
const lines = c.split('\n');

// 检查 745 行到 836 行之间的双引号
// 在模板字符串中，未转义的双引号会导致问题

let depth = 0;
for (let i = 744; i <= 835; i++) {
    const line = lines[i];
    
    // 查找 content: 后面跟着反引号（模板字符串开始）
    if (line.includes('content:')) {
        const match = line.match(/content:\s*`/);
        if (match) depth++;
    }
    
    // 查找 `, 出现在行尾（模板字符串结束）
    const trimmed = line.trim();
    if (trimmed === '`,' || trimmed.endsWith('`,')) {
        depth--;
    }
    
    // 检查行中是否有未转义的双引号
    // 在模板字符串中，应该没有 \" 这样的转义双引号
    // 但是 content 中的双引号可能是合法的
    if (depth > 0) {
        // 检查是否有 \" 之外的单独双引号
        const matches = line.match(/(?<!\\)"/g);
        if (matches) {
            console.log(`Line ${i + 1}: Found ${matches.length} unescaped double quotes: "${line.substring(0, 60)}..."`);
        }
    }
}
