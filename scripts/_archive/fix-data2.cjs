const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'learningData.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 问题：脚本插入时 quiz 数组结束和 recommendedTools/labEnvironments 之间的位置不正确
// 需要修复的 day 对象有：day-19, day-20, day-22, day-23, day-24, day-25, day-26, day-27, day-28, day-30
// 实际上，让我修复所有损坏的结构

const lines = content.split('\n');
const newLines = [];
let i = 0;
let fixes = 0;

while (i < lines.length) {
  const line = lines[i];

  // 检测模式：codeExample 的 closing 后直接是 recommendedTools（缺少 quiz）
  // 或 recommendedTools 和 labEnvironments 在 quiz 之前
  // 或 labEnvironments 结束后有额外的 closing }
  
  // 模式1: 检测 `  ],` 后跟 quiz，但 recommendedTools 已经插入在 quiz 前
  // 让我查找有问题的行：`    quiz: [` 之前有 `  ]`（labEnvironments 数组结束）
  
  if (line.trim() === 'quiz: [' || line.trim().startsWith('quiz: [')) {
    // 查找 quiz 数组的开始位置，检查前面是否有 recommendedTools/labEnvironments
    // 然后修复顺序
    
    // 先看 quiz 数组的 closing
    let quizEnd = i + 1;
    while (quizEnd < lines.length && !(lines[quizEnd].trim() === '],' && lines[quizEnd].trim() === '],')) {
      if (lines[quizEnd].trim() === '],' || lines[quizEnd].trim() === '],') {
        break;
      }
      quizEnd++;
    }
    
    // 简化：直接输出 quiz 及其内容
    newLines.push(line);
    i++;
    while (i < lines.length && !(lines[i].trim() === '],')) {
      newLines.push(lines[i]);
      i++;
    }
    // 输出 quiz 的 closing
    newLines.push('    ],');
    i++;
    
    // 现在跳过后面的 recommendedTools/labEnvironments（我们会在修复好的代码中重新插入或处理）
    // 检查 recommendedTools 是否存在
    let j = i;
    let hasRecTools = false;
    let hasLabEnv = false;
    let recToolsLines = [];
    let labEnvLines = [];
    let recToolsStart = -1;
    let labEnvStart = -1;
    
    // 扫描找到 recommendedTools 和 labEnvironments
    while (j < lines.length && j < i + 200) {
      const l = lines[j].trim();
      if (l.startsWith("id: 'day-") && l !== '' && recToolsStart >= 0) break;
      if (l.startsWith('recommendedTools:') && !hasRecTools) {
        hasRecTools = true;
        recToolsStart = j;
        // 收集 recommendedTools 的所有行
        let k = j;
        while (k < lines.length) {
          const kl = lines[k].trim();
          recToolsLines.push(lines[k]);
          if (kl === ']' || kl === '],') break;
          k++;
        }
      }
      if (l.startsWith('labEnvironments:') && !hasLabEnv) {
        hasLabEnv = true;
        labEnvStart = j;
        let k = j;
        while (k < lines.length) {
          const kl = lines[k].trim();
          labEnvLines.push(lines[k]);
          if (kl === ']' || kl === '],') break;
          k++;
        }
      }
      j++;
    }
    
    // 现在处理 labEnvironments 后的额外 closing
    // 跳过 quiz closing 后的 closing 大括号
    if (lines[i] && lines[i].trim() === '},') {
      i++; // 跳过这个 closing
    }
    
    // 跳过 recommendedTools 和 labEnvironments 的原始行（它们位置错误）
    // 找到下一个 day 对象的开始
    while (i < lines.length) {
      const l = lines[i].trim();
      if (l.startsWith("id: 'day-")) break;
      if (l === '},' || l === '},' || l === ']' || l === '],') {
        // 检查是否是 recommendedTools 或 labEnvironments 的 closing
        const prevLines = lines.slice(Math.max(0, i-5), i).join('\n');
        if (prevLines.includes('recommendedTools:') || prevLines.includes('labEnvironments:')) {
          // 跳过这个 closing
          i++;
          continue;
        }
      }
      if (l.startsWith('recommendedTools:') || l.startsWith('labEnvironments:')) {
        // 跳过这些块
        let k = i;
        while (k < lines.length) {
          const kl = lines[k].trim();
          k++;
          if (kl === ']' || kl === '],') break;
        }
        i = k;
        continue;
      }
      break;
    }
    
    // 现在输出修复后的 recommendedTools 和 labEnvironments（正确缩进）
    if (hasRecTools) {
      fixes++;
      newLines.push('    recommendedTools: [');
      for (let k = 1; k < recToolsLines.length; k++) {
        if (recToolsLines[k].trim() === '' || recToolsLines[k].trim() === ']' || recToolsLines[k].trim() === '],') continue;
        newLines.push(recToolsLines[k]);
      }
      newLines.push('  ],');
    }
    
    if (hasLabEnv) {
      fixes++;
      newLines.push('    labEnvironments: [');
      for (let k = 1; k < labEnvLines.length; k++) {
        if (labEnvLines[k].trim() === '' || labEnvLines[k].trim() === ']' || labEnvLines[k].trim() === '],') continue;
        newLines.push(labEnvLines[k]);
      }
      newLines.push('  ]');
    }
    
    // day 对象的 closing
    newLines.push('  },');
    continue;
  }
  
  // 检测模式2: codeExample 的 closing 缩进错误
  // `  },` 后跟 `    recommendedTools:` 且前面是 codeExample description
  if ((line.trim() === '},' || line.trim() === '},') && 
      i > 0 && lines[i-1].includes("description: '") && 
      !lines[i-1].includes('quiz') &&
      !lines[i-1].includes('recommendedTools') &&
      !lines[i-1].includes('labEnvironments')) {
    // 这个 closing 可能是 codeExample 的 closing，但缩进错误
    // 检查后面是否有 recommendedTools
    
    const currentIndent = line.length - line.trimStart().length;
    
    if (currentIndent === 2) {
      // 应该是 4 空格缩进
      newLines.push('    },');
      fixes++;
      i++;
      continue;
    }
  }
  
  newLines.push(line);
  i++;
}

fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
console.log(`Attempted ${fixes} fixes in learningData.ts`);
