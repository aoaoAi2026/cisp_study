const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'learningData.ts');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// 找到所有 day 对象的开始行
let dayStarts = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim().startsWith("id: 'day-")) {
    // 找到 day 对象的实际开始（{ 行）
    let start = i;
    while (start > 0 && lines[start - 1].trim() !== '{') start--;
    dayStarts.push(start);
  }
}

// 找到每个 day 对象的结束行
let dayBlocks = [];
for (let d = 0; d < dayStarts.length; d++) {
  const start = dayStarts[d];
  const nextStart = d < dayStarts.length - 1 ? dayStarts[d + 1] : lines.length;
  
  // 找 day 对象结束（在 nextStart 之前）
  let end = nextStart - 1;
  while (end > start && lines[end].trim() === '') end--;
  
  dayBlocks.push({ start, end });
}

console.log('Total day blocks:', dayBlocks.length);

// 对于每个 day block，分析其结构
// 我们需要检测：codeExample 是否有多行？quiz 在哪里？recommendedTools 在哪里？
// 如果 recommendedTools 在 quiz 之前，那这个 day 是损坏的

let brokenIndices = [];
for (let d = 0; d < dayBlocks.length; d++) {
  const { start, end } = dayBlocks[d];
  
  let quizPos = -1;
  let recPos = -1;
  let codeEndBraceIndent = -1;
  let hasMultiLineCode = false;
  
  for (let i = start; i < end; i++) {
    const t = lines[i].trim();
    if (t.startsWith('codeExample: {') && !t.includes('}')) {
      hasMultiLineCode = true;
      // 找多行 codeExample 的结束
      for (let j = i + 1; j < end; j++) {
        if (lines[j].trim() === '},' || (lines[j].trim() === '}' && lines[j + 1] && lines[j + 1].trim().startsWith('quiz'))) {
          codeEndBraceIndent = lines[j].length - lines[j].trimStart().length;
          break;
        }
      }
    }
    if (t.startsWith('quiz: [') && quizPos === -1) quizPos = i;
    if (t.startsWith('recommendedTools:') && recPos === -1) recPos = i;
  }
  
  if (recPos !== -1 && quizPos !== -1 && recPos < quizPos) {
    brokenIndices.push(d);
    console.log(`Broken day #${d}: line ${start + 1}, codeEndIndent=${codeEndBraceIndent}, multiLineCode=${hasMultiLineCode}`);
  }
}

console.log('Total broken:', brokenIndices.length);

// 现在修复每个损坏的 day 对象
// 策略：对于每个损坏的 day，提取:
// 1. 从头开始到 codeExample 结束（包含 },）
// 2. quiz 块
// 3. recommendedTools 块
// 4. labEnvironments 块
// 然后按正确顺序重新组合

const result = [];
let cursor = 0;

for (const d of brokenIndices) {
  const { start, end } = dayBlocks[d];
  
  // 输出 cursor 到 day 开始
  while (cursor < start) {
    result.push(lines[cursor]);
    cursor++;
  }
  
  // 现在解析这个 day 对象的结构
  let j = start;
  let blockStart = start;
  
  // 输出 day 对象的 {
  result.push(lines[j]);
  j++;
  
  // 输出 id, objectives, content 行
  // 直到 codeExample 开始
  while (j < end && !lines[j].trim().startsWith('codeExample:')) {
    result.push(lines[j]);
    j++;
  }
  
  // 输出 codeExample 块
  if (lines[j].trim().startsWith('codeExample:')) {
    const codeLine = lines[j];
    if (codeLine.trim().endsWith('},') || codeLine.trim().endsWith('}')) {
      // 单行 codeExample
      result.push(codeLine);
      j++;
    } else {
      // 多行 codeExample
      result.push(lines[j]); // codeExample: {
      j++;
      while (j < end) {
        const t = lines[j].trim();
        if (t === '},' || t === '}' ) {
          // 检查这是否是 codeExample 的 closing
          // 如果下一行是 recommendedTools 或 quiz 等，说明这是 closing
          const nextLine = lines[j + 1] ? lines[j + 1].trim() : '';
          if (nextLine.startsWith('quiz:') || nextLine.startsWith('recommendedTools:') || 
              nextLine.startsWith('labEnvironments:') || nextLine.startsWith(']') || nextLine.startsWith('},')) {
            result.push('    },');
            j++;
            break;
          }
        }
        result.push(lines[j]);
        j++;
      }
    }
  }
  
  // 现在收集 quiz, recommendedTools, labEnvironments 块（顺序可能混乱）
  let quizLines = [];
  let recLines = [];
  let labLines = [];
  
  while (j < end) {
    const t = lines[j].trim();
    
    if (t.startsWith('quiz: [')) {
      quizLines.push(lines[j]);
      j++;
      while (j < end) {
        const jt = lines[j].trim();
        quizLines.push(lines[j]);
        j++;
        if (jt === '],') break;
      }
      continue;
    }
    
    if (t.startsWith('recommendedTools:') || t.startsWith('recommendedTools: [')) {
      recLines.push(lines[j]);
      j++;
      while (j < end) {
        const jt = lines[j].trim();
        if (jt === ']' || jt === '],') break;
        recLines.push(lines[j]);
        j++;
      }
      // 跳过 closing ] 行
      if (j < end && (lines[j].trim() === ']' || lines[j].trim() === '],')) j++;
      continue;
    }
    
    if (t.startsWith('labEnvironments:') || t.startsWith('labEnvironments: [')) {
      labLines.push(lines[j]);
      j++;
      while (j < end) {
        const jt = lines[j].trim();
        if (jt === ']' || jt === '],') break;
        labLines.push(lines[j]);
        j++;
      }
      // 跳过 closing ] 行
      if (j < end && (lines[j].trim() === ']' || lines[j].trim() === '],')) j++;
      continue;
    }
    
    // 跳过多余的 closing 大括号
    if (t === '},' || t === '  },' || t === '    },') {
      const nextLine = j + 1 < end ? lines[j + 1].trim() : '';
      if (nextLine.startsWith("id: 'day-") || nextLine === ']' || nextLine === '') {
        j++;
        break;
      }
      j++;
      continue;
    }
    
    // 跳过其他空行和 closing 行
    if (t === '' || t === '}' || t === '}') {
      j++;
      continue;
    }
    
    j++;
  }
  
  // 按正确顺序输出：quiz, recommendedTools, labEnvironments
  
  // 输出 quiz（修复缩进）
  if (quizLines.length > 0) {
    for (let q = 0; q < quizLines.length; q++) {
      const line = quizLines[q];
      const t = line.trim();
      if (t === '') continue;
      if (t.startsWith('quiz: [')) {
        result.push('    quiz: [');
      } else if (t === '],') {
        result.push('    ],');
      } else {
        result.push(line);
      }
    }
  }
  
  // 输出 recommendedTools
  if (recLines.length > 0) {
    result.push('    recommendedTools: [');
    for (let r = 1; r < recLines.length; r++) {
      const line = recLines[r];
      if (line.trim() === '' || line.trim() === ']' || line.trim() === '],') continue;
      // 修复数组元素对象的 closing
      if (line.trim() === '},') {
        result.push(line);
        continue;
      }
      result.push(line);
    }
    result.push('  ],');
  }
  
  // 输出 labEnvironments
  if (labLines.length > 0) {
    result.push('    labEnvironments: [');
    for (let r = 1; r < labLines.length; r++) {
      const line = labLines[r];
      if (line.trim() === '' || line.trim() === ']' || line.trim() === '],') continue;
      result.push(line);
    }
    result.push('  ]');
  }
  
  // 输出 day 对象 closing
  result.push('  },');
  
  cursor = j;
}

// 输出剩余内容
while (cursor < lines.length) {
  result.push(lines[cursor]);
  cursor++;
}

fs.writeFileSync(filePath, result.join('\n'), 'utf8');
console.log('Fixed!');
