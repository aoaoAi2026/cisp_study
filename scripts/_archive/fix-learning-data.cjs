const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'learningData.ts');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// 查找所有有问题的 day 对象
let problemDays = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim().startsWith("id: 'day-")) {
    let quizPos = -1;
    let recToolsPos = -1;
    for (let j = i; j < Math.min(i + 150, lines.length); j++) {
      if (lines[j].trim().startsWith('quiz: [') && quizPos === -1) quizPos = j;
      if (lines[j].trim().startsWith('recommendedTools:') && recToolsPos === -1) recToolsPos = j;
    }
    
    if (recToolsPos !== -1 && quizPos !== -1 && recToolsPos < quizPos) {
      problemDays.push({ line: i+1, index: i });
    }
  }
}

console.log('Found', problemDays.length, 'problematic day objects');

// 现在修复：对于每个问题 day，将 quiz 移到 recommendedTools 和 labEnvironments 之前
// 并修复缩进
const result = [];
let i = 0;

while (i < lines.length) {
  // 检测这是否是问题 day 的开始
  const isProblemDay = problemDays.some(d => d.index === i);
  
  if (isProblemDay) {
    // 扫描 day 的完整内容，重新组织
    let dayStart = i;
    let dayContent = [];
    let quizBlock = [];
    let recToolsBlock = [];
    let labEnvBlock = [];
    let j = i;
    
    // 收集整个 day 对象的内容
    while (j < lines.length && j < i + 150) {
      const line = lines[j];
      const trimmed = line.trim();
      
      if (trimmed.startsWith('quiz: [')) {
        // 收集 quiz 块
        quizBlock.push(line);
        j++;
        while (j < lines.length) {
          const ql = lines[j];
          const qt = ql.trim();
          quizBlock.push(ql);
          j++;
          if (qt === '],' || qt === '  ],') break;
        }
        continue;
      }
      
      if (trimmed.startsWith('recommendedTools: [')) {
        recToolsBlock.push(line);
        j++;
        while (j < lines.length) {
          const rl = lines[j];
          const rt = rl.trim();
          recToolsBlock.push(rl);
          j++;
          if (rt === ']' || rt === '],' || rt === '  ]' || rt === '  ],') break;
        }
        continue;
      }
      
      if (trimmed.startsWith('labEnvironments: [')) {
        labEnvBlock.push(line);
        j++;
        while (j < lines.length) {
          const ll = lines[j];
          const lt = ll.trim();
          labEnvBlock.push(ll);
          j++;
          if (lt === ']' || lt === '],' || lt === '  ]' || lt === '  ],') break;
        }
        continue;
      }
      
      // 跳过 day 对象的 closing（我们会重新构建）
      // 检查是否是 day 对象结束
      const nextLine = lines[j+1] ? lines[j+1].trim() : '';
      const isDayClosing = (trimmed === '},' || trimmed === '  },' || trimmed === '    },') && 
        (nextLine.startsWith("id: 'day-") || nextLine === '];' || nextLine === '');
      
      if (isDayClosing) {
        // 跳过这个 closing，后面会重新添加
        j++;
        break;
      }
      
      dayContent.push(line);
      j++;
      
      if (j >= lines.length || lines[j].trim().startsWith("id: 'day-") || lines[j].trim() === '];') {
        break;
      }
    }
    
    // 重新组织 day 内容
    // dayContent (到 codeExample 结束) + quiz + recommendedTools + labEnvironments + closing
    for (const line of dayContent) {
      // 确保 codeExample 的 closing 有正确的逗号
      if (line.trim() === '}' || line.trim() === '  }') {
        result.push('    },');
      } else {
        result.push(line);
      }
    }
    
    // 添加 quiz（正确缩进）
    if (quizBlock.length > 0) {
      for (let k = 0; k < quizBlock.length; k++) {
        const ql = quizBlock[k];
        const qt = ql.trim();
        if (qt === '' && k === quizBlock.length - 1) continue;
        if (k === 0) {
          // quiz 开始行
          result.push('    quiz: [');
        } else if (qt === '],' || qt === '  ],') {
          result.push('    ],');
        } else {
          result.push(ql);
        }
      }
    }
    
    // 添加 recommendedTools
    if (recToolsBlock.length > 0) {
      result.push('    recommendedTools: [');
      for (let k = 1; k < recToolsBlock.length; k++) {
        const rl = recToolsBlock[k];
        const rt = rl.trim();
        if (rt === ']' || rt === '],' || rt === '  ]' || rt === '  ],') break;
        if (rt === '') continue;
        result.push(rl);
      }
      result.push('  ],');
    }
    
    // 添加 labEnvironments
    if (labEnvBlock.length > 0) {
      result.push('    labEnvironments: [');
      for (let k = 1; k < labEnvBlock.length; k++) {
        const ll = labEnvBlock[k];
        const lt = ll.trim();
        if (lt === ']' || lt === '],' || lt === '  ]' || lt === '  ],') break;
        if (lt === '') continue;
        result.push(ll);
      }
      result.push('  ]');
    }
    
    // day closing
    result.push('  },');
    i = j;
    continue;
  }
  
  result.push(lines[i]);
  i++;
}

fs.writeFileSync(filePath, result.join('\n'), 'utf8');
console.log('Fixed!');
