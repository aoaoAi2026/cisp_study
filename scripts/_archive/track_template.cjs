const fs = require('fs');
const c = fs.readFileSync('cyberPenetration.ts', 'utf8');
const lines = c.split('\n');

// 追踪模板字符串的状态
let inTemplate = false;
let templateStart = -1;
let errors = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 查找 content: 后面跟着反引号
    if (line.includes('content:')) {
        const match = line.match(/content:\s*`/);
        if (match) {
            inTemplate = true;
            templateStart = i + 1;
            console.log(`Template starts at line ${templateStart}`);
        }
    }
    
    // 如果在模板字符串中，查找结束标记
    if (inTemplate) {
        // 查找 `, 后跟空白或 } 或 keyPoints
        if (line.trim() === '`,' || line.trim().endsWith('`,')) {
            console.log(`Template likely ends at line ${i + 1}`);
            inTemplate = false;
        }
        
        // 查找 content: 出现在模板字符串中间（错误）
        if (line.includes('content:') && !line.includes('content: `')) {
            errors.push(`Line ${i + 1}: content: appears inside template at line ${templateStart}`);
        }
    }
}

if (errors.length > 0) {
    console.log('\nErrors found:');
    errors.forEach(e => console.log(e));
} else {
    console.log('\nNo errors found');
}
