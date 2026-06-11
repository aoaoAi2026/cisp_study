const fs = require('fs');
const c = fs.readFileSync('cyberPenetration.ts', 'utf8');
const lines = c.split('\n');

// 检查从 475 行开始的 content 模板字符串何时结束
// 查找第一个以 `, 结尾且后面有空行的行

for (let i = 474; i < 744; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.endsWith('`,')) {
        console.log('Possible end at line', i + 1, ':', trimmed.substring(0, 60));
        // 检查下一行是否是空行
        if (lines[i + 1] && lines[i + 1].trim() === '') {
            console.log('Next line is empty, this is likely the end');
            break;
        }
    }
}
