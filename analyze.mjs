import { readFileSync } from 'fs';

const content = readFileSync('./src/data/cyberPenetration.ts', 'utf8');

// Extract all day blocks
const dayBlocks = [];

// Find all blocks that look like { id: 'pen-XXX', day: N
const dayRegex = /\{\s*id:\s*['"]pen-(\d+)['"],\s*day:\s*(\d+)/g;
let m;
const dayNumbers = [];
while ((m = dayRegex.exec(content)) !== null) {
  dayNumbers.push({ id: parseInt(m[1]), day: parseInt(m[2]), pos: m.index });
}
console.log(`找到 ${dayNumbers.length} 个 day 对象`);
console.log('Day numbers:', dayNumbers.map(d => d.day));
console.log();

// Now check for individual sections for each day. Use simple regex to extract each top-level day block
// We need to parse each day object by counting braces. Let's use a simpler approach:
// Split on "id: 'pen-" and check presence of each field per day.

// Extract day blocks via crude brace matcher.
const dayStarts = [...content.matchAll(/\{\s*id:\s*['"]pen-\d+['"],\s*day:\s*\d+/g)].map(m => m.index);

function extractDayBlocks(text, startIdx) {
  // Find matching close brace. We need to handle strings/comments too but let's use brace balance.
  let depth = 0;
  let inStr = false;
  let strCh = '';
  let inTpl = false;
  let inLineComment = false;
  let inBlockComment = false;
  let i = startIdx;
  while (i < text.length) {
    const c = text[i];
    const next = text[i+1];
    if (inLineComment) {
      if (c === '\n') inLineComment = false;
      i++;
      continue;
    }
    if (inBlockComment) {
      if (c === '*' && next === '/') { inBlockComment = false; i+=2; continue; }
      i++;
      continue;
    }
    if (inTpl) {
      if (c === '\\') { i+=2; continue; }
      if (c === '`') inTpl = false;
      i++;
      continue;
    }
    if (inStr) {
      if (c === '\\') { i+=2; continue; }
      if (c === strCh) inStr = false;
      i++;
      continue;
    }
    if (c === '/' && next === '/') { inLineComment = true; i+=2; continue; }
    if (c === '/' && next === '*') { inBlockComment = true; i+=2; continue; }
    if (c === '`') { inTpl = true; i++; continue; }
    if (c === '"' || c === "'") { inStr = true; strCh = c; i++; continue; }
    if (c === '{') depth++;
    if (c === '}') { depth--; if (depth === 0) { i++; break; } }
    i++;
  }
  return text.substring(startIdx, i);
}

const days = [];
for (const start of dayStarts) {
  const block = extractDayBlocks(content, start);
  days.push(block);
}

// Check each day for sections
function checkField(dayText, fieldName, requiredSubFields) {
  // Find 'fieldName: [' or 'fieldName: ['
  const regex = new RegExp(`${fieldName}:\\s*\\[`, '');
  const match = dayText.match(regex);
  if (!match) {
    return { exists: false, entries: 0, details: null };
  }
  // Find end bracket - scan from match index, count [ vs ]
  const start = match.index;
  let depth = 0;
  let i = start;
  while (i < dayText.length) {
    const c = dayText[i];
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) break; }
    i++;
  }
  const arrText = dayText.substring(start, i + 1);
  // Count entries (entries separated by comma at depth 1, but let's just count object literals with requiredSubFields
  const entryRegex = /\{[^}]*\}/g;
  const entries = arrText.match(entryRegex) || [];
  // Check each entry for required sub-fields
  const entryDetails = entries.map(e => {
    const checks = {};
    for (const sf of requiredSubFields) {
      // Check presence of key:
      const re = new RegExp(`${sf}\\s*:`);
      checks[sf] = re.test(e);
    }
    return checks;
  });
  return { exists: true, entries: entries.length, details: entryDetails };
}

// Individual day title
function getDayTitle(dayText) {
  const idMatch = dayText.match(/id:\s*['"](pen-\d+)['"]/);
  const dayMatch = dayText.match(/day:\s*(\d+)/);
  const titleMatch = dayText.match(/title:\s*['"]([^'"]+)['"]/);
  return { id: idMatch?.[1], day: dayMatch?.[1], title: titleMatch?.[1] };
}

const results = days.map(dayText => {
  const info = getDayTitle(dayText);
  const codeExamples = checkField(dayText, 'codeExamples', ['title', 'language', 'code', 'explanation']);
  const labEnvironment = checkField(dayText, 'labEnvironment', ['name', 'type', 'description', 'setup', 'expectedOutput', 'url']);
  const resources = checkField(dayText, 'recommendedTools', ['name', 'type', 'url']);
  const quiz = checkField(dayText, 'quiz', ['question', 'type', 'options']);
  const expertNotes = checkField(dayText, 'expertNotes', ['author', 'title', 'content', 'url']);
  return { ...info, codeExamples, labEnvironment, resources, quiz, expertNotes };
});

// Print report
console.log('================= 数据完整性报告 =================');
console.log();

const features = [
  { key: 'codeExamples', label: 'codeExamples', sub: ['title', 'language', 'code', 'explanation'] },
  { key: 'labEnvironment', label: 'labEnvironment', sub: ['name', 'type', 'description', 'setup', 'expectedOutput', 'url'] },
  { key: 'resources', label: 'recommendedTools (resources)', sub: ['name', 'type', 'url'] },
  { key: 'quiz', label: 'quiz', sub: ['question', 'type', 'options', 'correctIndex/correctAnswer'] },
  { key: 'expertNotes', label: 'expertNotes', sub: ['author', 'title', 'content', 'url'] },
];

for (const f of features) {
  let withData = 0;
  let missing = 0;
  const withDataDays = [];
  const missingDays = [];
  for (const r of results) {
    if (r[f.key].exists && r[f.key].entries > 0) {
      withData++;
      withDataDays.push(r.day);
    } else {
      missing++;
      missingDays.push(r.day);
    }
  }
  console.log(`【${f.label}】`);
  console.log(`  有数据: ${withData} 天 (Days: ${withDataDays.join(', ')})`);
  console.log(`  缺失:   ${missing} 天 (Days: ${missingDays.join(', ')})`);

  // Per-day entry count
  console.log('  每Day条目数:');
  for (const r of results) {
    const d = r[f.key];
    // Simpler: print entry count
    console.log(`    Day ${r.day} (${r.title}): ${d.exists ? d.entries + ' 条' : '缺失'}`);
  }
  console.log();
}

// Per-day summary
console.log('======== 按 Day 详细逐天检查 =========');
for (const r of results) {
  console.log(`\nDay ${r.day} - ${r.title} (${r.id})`);
  for (const f of features) {
    const d = r[f.key];
    if (d.exists && d.entries > 0) {
      console.log(`  ✓ ${f.label}: ${d.entries} entries`);
      if (d.details) {
        d.details.forEach((entry, idx) => {
          const missingKeys = Object.entries(entry).filter(([k, v]) => !v).map(([k]) => k);
          if (missingKeys.length > 0) {
            console.log(`    [${idx}] 缺少字段: ${missingKeys.join(', ')}`);
          } else {
            console.log(`    [${idx}] 所有字段完整`);
          }
        });
      }
    } else {
      console.log(`  ✗ ${f.label}: 缺失`);
    }
  }
}

// Summary totals
console.log('\n======== 总结 =========');
for (const f of features) {
  let withData = 0, missing = 0;
  for (const r of results) {
    if (r[f.key].exists && r[f.key].entries > 0) withData++;
    else missing++;
  }
  console.log(`${f.label}: 有数据 ${withData}/30 天, 缺失 ${missing}/30 天`);
}
