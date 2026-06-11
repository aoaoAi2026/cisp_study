const fs = require('fs');
const c = fs.readFileSync('cyberPenetration.ts', 'utf8');
const lines = c.split('\n');

// 检查 2668-2676 行之间的引号平衡
let singleQuotes = 0;
let doubleQuotes = 0;
let backticks = 0;

for (let i = 2667; i <= 2675; i++) {
    const line = lines[i];
    for (const char of line) {
        if (char === "'") singleQuotes++;
        else if (char === '"') doubleQuotes++;
        else if (char === '`') backticks++;
    }
    console.log(`Line ${i + 1}: '=${singleQuotes} "=${doubleQuotes} \`=${backticks}`);
}
