import { execSync } from 'child_process';

try {
  const r = execSync('npx tsc --noEmit 2>&1', { 
    maxBuffer: 20 * 1024 * 1024, 
    encoding: 'utf-8',
    timeout: 120000 
  });
  console.log('SUCCESS: No TypeScript errors!');
} catch (e) {
  const output = e.stdout || e.stderr || '';
  const lines = output.split('\n').filter(l => l.includes('error TS'));
  console.log(`Errors: ${lines.length}`);
  
  const codes = {};
  const files = {};
  for (const l of lines) {
    const m = l.match(/error (TS\d+)/);
    if (m) codes[m[1]] = (codes[m[1]] || 0) + 1;
    const f = l.match(/(src\/[^(]*\.tsx?)/);
    if (f) files[f[1]] = (files[f[1]] || 0) + 1;
  }
  
  console.log('\nBy error code:');
  for (const [k, v] of Object.entries(codes).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k}: ${v}`);
  }
  
  console.log('\nBy file:');
  for (const [k, v] of Object.entries(files).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${v.toString().padStart(3)} ${k}`);
  }
  
  console.log('\nFirst 20 errors:');
  for (const l of lines.slice(0, 20)) {
    console.log(l.trim().substring(0, 200));
  }
}
