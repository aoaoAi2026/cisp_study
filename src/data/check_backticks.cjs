const fs = require('fs');
const c = fs.readFileSync('cyberPenetration.ts', 'utf8');
const lines = c.split('\n');
for (let i = 744; i < 836; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
        if (line[j] === '`') {
            console.log('Line', i + 1, 'pos', j, ':', line.substring(Math.max(0, j - 10), j + 10));
        }
    }
}
