const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'learningData.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Fix: 当 codeExample 的 description 后面直接是 recommendedTools 时，需要添加 },
// Pattern: `description: '...'\n    recommendedTools`
let fixedCount = 0;
const lines = content.split('\n');
const newLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const nextLine = lines[i + 1] || '';

  if (
    line.trim().startsWith("description: '") &&
    line.trim().endsWith("'") &&
    nextLine.trim().startsWith('recommendedTools:')
  ) {
    // 应该是 codeExample 的 closing，需要加 `  },`
    newLines.push(line.replace(/'$/, "',"));
    newLines.push('  },');
    fixedCount++;
    continue;
  }

  newLines.push(line);
}

fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
console.log(`Fixed ${fixedCount} entries in learningData.ts`);

// 同样修复 pastPapers.ts - questions 数组结束和 practiceEnvironment 之间缺少逗号
const pastPapersPath = path.join(__dirname, '..', 'src', 'data', 'pastPapers.ts');
let pastContent = fs.readFileSync(pastPapersPath, 'utf8');

const pastLines = pastContent.split('\n');
const pastNewLines = [];
let pastFixedCount = 0;

for (let i = 0; i < pastLines.length; i++) {
  const line = pastLines[i];
  const nextLine = pastLines[i + 1] || '';

  if (line.trim() === ']' && nextLine.trim().startsWith('practiceEnvironment:')) {
    pastNewLines.push('],');
    pastFixedCount++;
    continue;
  }

  pastNewLines.push(line);
}

fs.writeFileSync(pastPapersPath, pastNewLines.join('\n'), 'utf8');
console.log(`Fixed ${pastFixedCount} entries in pastPapers.ts`);
