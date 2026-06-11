const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'learningData.ts');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// 找到 day-30 的位置
let day30Line = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim().startsWith("id: 'day-30'")) {
    day30Line = i;
    break;
  }
}

console.log('day-30 at line:', day30Line);

// 找到 day-30 块的结束位置（最后的 closing }）
let endOfDay30 = -1;
for (let i = day30Line; i < lines.length; i++) {
  if (lines[i].trim() === '},' && lines[i+1] && (lines[i+1].trim() === '' || lines[i+1].trim().startsWith('export') || lines[i+1].trim() === '];')) {
    endOfDay30 = i;
    break;
  }
}

console.log('End of day-30 at line:', endOfDay30);

// 现在在 day-30 的 closing 之后添加 `];` 和生成代码部分
const restContent = lines.slice(endOfDay30 + 1).join('\n');
console.log('Rest content starts with:', restContent.substring(0, 100));

// 检查是否已经有 ];
if (!restContent.trim().startsWith('];')) {
  console.log('Need to add ]; and remaining code');
  
  // 从备份文件获取缺失的部分
  const bakPath = path.join(__dirname, '..', 'src', 'data', 'learningData.ts.bak');
  const bakContent = fs.readFileSync(bakPath, 'utf8');
  const bakLines = bakContent.split('\n');
  
  // 找到备份文件中 day-30 的位置
  let bakDay30Line = -1;
  for (let i = 0; i < bakLines.length; i++) {
    if (bakLines[i].trim().startsWith("id: 'day-30'")) {
      bakDay30Line = i;
      break;
    }
  }
  
  // 找到备份文件中 ]; 的位置（在 day-30 之后）
  let bakArrayEnd = -1;
  for (let i = bakDay30Line; i < bakLines.length; i++) {
    if (bakLines[i].trim() === '];') {
      bakArrayEnd = i;
      break;
    }
  }
  
  console.log('Backup array ends at:', bakArrayEnd);
  
  // 获取备份中 ]; 之后的所有内容
  const bakRemaining = bakLines.slice(bakArrayEnd).join('\n');
  console.log('Backup remaining first 200 chars:', bakRemaining.substring(0, 200));
  
  // 重建文件
  const newContent = lines.slice(0, endOfDay30 + 1).join('\n') + '\n' + bakRemaining;
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('Fixed!');
} else {
  console.log('File seems OK already');
}
