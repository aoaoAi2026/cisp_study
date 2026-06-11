const fs = require('fs');
const c = fs.readFileSync('cyberPenetration.ts', 'utf8');
const lines = c.split('\n');

// 检查 2648 行到 2676 行之间的反引号位置
for (let i = 2647; i <= 2675; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
        if (line[j] === '`') {
            console.log(`Line ${i + 1} pos ${j}: "${line.substring(Math.max(0, j - 20), j + 20)}"`);
        }
    }
}
