const fs = require('fs');
const c = fs.readFileSync('cyberPenetration.ts', 'utf8');
const lines = c.split('\n');

// 检查从 365 行到 475 行之间的模板字符串结束标记
for (let i = 364; i < 475; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.endsWith('`,')) {
        console.log('Possible end at line', i + 1, ':', trimmed.substring(0, 60));
    }
}
