const fs = require('fs');
const c = fs.readFileSync('cyberPenetration.ts', 'utf8');
const lines = c.split('\n');

// 检查 745 行到 836 行之间的模板字符串
// 745 行开始模板字符串，836 行结束
// 我们需要检查是否有孤立的双引号或其他问题

// 检查 745 行到 836 行之间是否有反引号
for (let i = 744; i < 836; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
        if (line[j] === '`') {
            console.log('Backtick inside template at line', i + 1, 'pos', j, ':', line.substring(Math.max(0, j - 20), j + 20));
        }
    }
}
