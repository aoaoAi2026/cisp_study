const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'learningData.ts');
let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// 找到所有需要修复的 day 对象
// 特征：quiz 在 recommendedTools 之后
let dayStarts = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim().startsWith("id: 'day-")) {
    dayStarts.push(i);
  }
}

console.log('Total days:', dayStarts.length);

// 对于每个 day，检查 quiz 是否在 recommendedTools 之前
let brokenDays = [];
for (let d = 0; d < dayStarts.length; d++) {
  const start = dayStarts[d];
  const end = d < dayStarts.length - 1 ? dayStarts[d + 1] : lines.length;
  
  let quizPos = -1;
  let recPos = -1;
  
  for (let j = start; j < end; j++) {
    const t = lines[j].trim();
    if (t.startsWith('quiz: [') && quizPos === -1) quizPos = j;
    if (t.startsWith('recommendedTools:') && recPos === -1) recPos = j;
  }
  
  if (recPos !== -1 && quizPos !== -1 && recPos < quizPos) {
    brokenDays.push({ start, quizPos, recPos, end });
    console.log(`Broken: line ${start + 1} (${lines[start].trim()})`);
  }
}

console.log('Broken days:', brokenDays.length);

// 重新构建：对于每个损坏的 day，重新组织
const result = [];
let cursor = 0;

for (let b = 0; b < brokenDays.length; b++) {
  const { start, end } = brokenDays[b];
  
  // 先输出 cursor 到 day 对象开始前的内容
  while (cursor < start) {
    result.push(lines[cursor]);
    cursor++;
  }
  
  // 提取 day 对象结构：
  // 1. 开头行（{）
  // 2. id, objectives, content
  // 3. codeExample 块
  // 4. quiz 块
  // 5. recommendedTools 块
  // 6. labEnvironments 块
  // 7. closing
  
  let j = start;
  
  // 输出 day 开始行
  result.push(lines[j]); // id 行
  j++;
  
  // 输出 objectives
  result.push(lines[j]);
  j++;
  
  // 输出 content
  result.push(lines[j]);
  j++;
  
  // 找到 codeExample 块
  // 多行形式或单行形式
  if (lines[j].trim().startsWith('codeExample: {')) {
    // 多行 codeExample
    result.push(lines[j]);
    j++;
    while (j < end && !lines[j].trim().startsWith('}')) {
      result.push(lines[j]);
      j++;
    }
    // codeExample closing - 修复缩进和逗号
    result.push('    },');
    j++;
  } else {
    result.push(lines[j]);
    j++;
  }
  
  // 现在需要收集: quiz, recommendedTools, labEnvironments
  // 但它们顺序可能混乱
  
  let quizLines = [];
  let recLines = [];
  let labLines = [];
  
  while (j < end) {
    const t = lines[j].trim();
    
    if (t.startsWith('quiz: [')) {
      quizLines.push(lines[j]);
      j++;
      while (j < end && !lines[j].trim().startsWith('],')) {
        quizLines.push(lines[j]);
        j++;
      }
      quizLines.push(lines[j]); // closing of quiz
      j++;
      continue;
    }
    
    if (t.startsWith('recommendedTools: [') || t.startsWith('recommendedTools:')) {
      recLines.push(lines[j]);
      j++;
      while (j < end) {
        const t2 = lines[j].trim();
        if (t2 === ']' || t2 === '],') break;
        recLines.push(lines[j]);
        j++;
      }
      // closing
      recLines.push('  ],');
      j++;
      continue;
    }
    
    if (t.startsWith('labEnvironments: [') || t.startsWith('labEnvironments:')) {
      labLines.push(lines[j]);
      j++;
      while (j < end) {
        const t2 = lines[j].trim();
        if (t2 === ']' || t2 === '],') break;
        labLines.push(lines[j]);
        j++;
      }
      labLines.push('  ]');
      j++;
      continue;
    }
    
    // 跳过额外的 closing 大括号
    if (t === '},' || t === '  },' || t === '    },') {
      // 检查是否是 day 对象 closing
      const nextLine = j + 1 < end ? lines[j+1].trim() : '';
      if (nextLine.startsWith("id: 'day-") || nextLine === '];' || nextLine === '') {
        j++;
        break;
      }
      j++;
      continue;
    }
    
    j++;
  }
  
  // 输出 quiz 块（正确缩进）
  for (const ql of quizLines) {
    if (ql.trim() === '' ) continue;
    if (ql.trim().startsWith('quiz: [') ) {
      result.push('    quiz: [');
    } else if (ql.trim().startsWith('],')) {
      result.push('    ],');
    } else {
      result.push(ql);
    }
  }
  
  // 输出 recommendedTools（正确缩进）
  if (recLines.length > 0) {
    result.push('    recommendedTools: [');
    for (let k = 1; k < recLines.length - 1; k++) {
      if (recLines[k].trim() === '' || recLines[k].trim() === ']' || recLines[k].trim() === '],') continue;
      result.push(recLines[k]);
    }
    result.push('  ],');
  }
  
  // 输出 labEnvironments（正确缩进）
  if (labLines.length > 0) {
    result.push('    labEnvironments: [');
    for (let k = 1; k < labLines.length - 1; k++) {
      if (labLines[k].trim() === '' || labLines[k].trim() === ']' || labLines[k].trim() === '],') continue;
      result.push(labLines[k]);
    }
    result.push('  ]');
  }
  
  // day 对象 closing
  result.push('  },');
  
  cursor = j;
}

// 输出剩余内容
while (cursor < lines.length) {
  result.push(lines[cursor]);
  cursor++;
}

fs.writeFileSync(filePath, result.join('\n'), 'utf8');
console.log('Done!');
