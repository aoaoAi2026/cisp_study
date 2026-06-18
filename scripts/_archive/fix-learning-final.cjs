const fs = require('fs');
const path = require('path');

// 分析：备份文件中有10个 day 对象（day-19,20,22,23,24,25,26,27,29,30）有这个问题：
// codeExample 是多行格式，但是 quiz 在 recommendedTools/labEnvironments 之前
// 同时有缩进和 closing 问题

// 策略：
// 1. 找到每个问题 day 对象
// 2. 提取这些块：id/objectives/content, codeExample, quiz, recommendedTools, labEnvironments
// 3. 按正确顺序重建：id, objectives, content, codeExample, quiz, recommendedTools, labEnvironments, closing

const filePath = path.join(__dirname, '..', 'src', 'data', 'learningData.ts');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const PROBLEM_DAYS = ['day-19', 'day-20', 'day-22', 'day-23', 'day-24', 'day-25', 'day-26', 'day-27', 'day-29', 'day-30'];

const result = [];
let i = 0;

while (i < lines.length) {
  const trimmed = lines[i].trim();
  
  // 检测是否是问题 day 对象的开始（id 行）
  let isProblemDay = false;
  let problemDayId = '';
  for (const dayId of PROBLEM_DAYS) {
    if (trimmed.startsWith(`id: '${dayId}'`)) {
      isProblemDay = true;
      problemDayId = dayId;
      break;
    }
  }
  
  if (isProblemDay) {
    console.log(`Fixing ${problemDayId} at line ${i+1}`);
    
    // 找到 day 对象的起始 `{` 行（在上一行）
    let dayStart = i;
    while (dayStart > 0 && lines[dayStart].trim() !== '{') dayStart--;
    
    // 输出 `{` 行
    result.push(lines[dayStart]);
    i = dayStart + 1;
    
    // 输出 id, objectives, content 行直到 codeExample
    while (i < lines.length) {
      const t = lines[i].trim();
      if (t.startsWith('codeExample:')) break;
      result.push(lines[i]);
      i++;
    }
    
    // 现在处理 codeExample 块（多行）
    if (i < lines.length && lines[i].trim().startsWith('codeExample:')) {
      const codeLine = lines[i];
      if (codeLine.trim().endsWith('},') || codeLine.trim().endsWith('}')) {
        // 单行 codeExample（不应该出现在问题 day 中，但以防万一）
        result.push(codeLine);
        i++;
      } else {
        // 多行 codeExample
        result.push(lines[i]); // codeExample: {
        i++;
        while (i < lines.length) {
          const t = lines[i].trim();
          if (t === '}' || t === '},') {
            // 这是 codeExample 的 closing
            // 检查下一行是否是 quiz, recommendedTools 等
            const nextT = lines[i+1] ? lines[i+1].trim() : '';
            if (nextT.startsWith('quiz:') || nextT.startsWith('recommendedTools:') || 
                nextT.startsWith('labEnvironments:') || nextT.startsWith(']') || 
                nextT.startsWith('},') || nextT === '') {
              result.push('    },'); // 正确缩进
              i++;
              break;
            }
          }
          result.push(lines[i]);
          i++;
        }
      }
    }
    
    // 现在扫描剩余的内容，收集 quiz, recommendedTools, labEnvironments 块
    // 但它们的顺序可能混乱，我们需要分别收集
    let quizBlock = null;
    let recBlock = null;
    let labBlock = null;
    
    while (i < lines.length) {
      const t = lines[i].trim();
      
      // 收集 quiz 块
      if (t.startsWith('quiz: [') && quizBlock === null) {
        const start = i;
        i++;
        while (i < lines.length && lines[i].trim() !== '],') {
          i++;
        }
        const end = i;
        i++; // 跳过 ],
        quizBlock = { start, end };
        continue;
      }
      
      // 收集 recommendedTools 块
      if (t.startsWith('recommendedTools:') && recBlock === null) {
        const start = i;
        i++;
        while (i < lines.length) {
          const lt = lines[i].trim();
          if (lt === ']' || lt === '],') {
            break;
          }
          i++;
        }
        const end = i;
        i++; // 跳过 ] 或 ],
        recBlock = { start, end };
        continue;
      }
      
      // 收集 labEnvironments 块
      if (t.startsWith('labEnvironments:') && labBlock === null) {
        const start = i;
        i++;
        while (i < lines.length) {
          const lt = lines[i].trim();
          if (lt === ']' || lt === '],') {
            break;
          }
          i++;
        }
        const end = i;
        i++; // 跳过 ] 或 ],
        labBlock = { start, end };
        continue;
      }
      
      // 跳过空行
      if (t === '') {
        i++;
        continue;
      }
      
      // 跳过 closing 大括号
      if (t === '},' || t === '}' || t === '  },' || t === '    },') {
        const nextLine = lines[i+1] ? lines[i+1].trim() : '';
        // 检查是否是新的 day 对象开始或数组结束
        if (nextLine.startsWith("id: 'day-") || nextLine === ']' || nextLine === '];' || nextLine.startsWith('const ') || nextLine.startsWith('// ') || nextLine.startsWith('export ')) {
          i++;
          break;
        }
        i++;
        continue;
      }
      
      // 检查是否已经到了下一个 day 对象或结束
      if (t.startsWith("id: 'day-") || t.startsWith('const ') || t.startsWith('export ') || t.startsWith('// ') || t === ']' || t === '];') {
        break;
      }
      
      i++;
    }
    
    // 按正确顺序输出块
    // quiz
    if (quizBlock !== null) {
      result.push('    quiz: [');
      for (let q = quizBlock.start + 1; q <= quizBlock.end - 1; q++) {
        const line = lines[q];
        if (line.trim() === '') continue;
        result.push(line);
      }
      result.push('    ],');
    }
    
    // recommendedTools
    if (recBlock !== null) {
      result.push('    recommendedTools: [');
      for (let r = recBlock.start + 1; r <= recBlock.end - 1; r++) {
        const line = lines[r];
        if (line.trim() === '') continue;
        result.push(line);
      }
      result.push('  ],');
    }
    
    // labEnvironments
    if (labBlock !== null) {
      result.push('    labEnvironments: [');
      for (let r = labBlock.start + 1; r <= labBlock.end - 1; r++) {
        const line = lines[r];
        if (line.trim() === '') continue;
        result.push(line);
      }
      result.push('  ]');
    }
    
    // day 对象 closing
    result.push('  },');
    
    continue;
  }
  
  // 非问题行，直接输出
  result.push(lines[i]);
  i++;
}

fs.writeFileSync(filePath, result.join('\n'), 'utf8');
console.log('Done!');
