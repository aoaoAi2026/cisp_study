const { execSync } = require('child_process');
let r = '';
try {
  execSync('npx tsc -b --noEmit 2>&1', { maxBuffer: 10 * 1024 * 1024, encoding: 'utf-8' });
} catch(e) {
  r = (e.stdout || '') + (e.stderr || '');
}
let lines = r.split('\n').filter(l => l.includes('error TS'));
console.log('Total:', lines.length, 'errors\n');

let errs = {};
let files = {};
for (let l of lines) {
  let m = l.match(/error (TS\d+)/);
  let f = l.match(/src\/.*?\.tsx?/);
  if (m) errs[m[1]] = (errs[m[1]] || 0) + 1;
  if (f) files[f[0]] = (files[f[0]] || 0) + 1;
}
console.log('By error code:');
Object.entries(errs).sort((a,b) => b[1] - a[1]).forEach(([k,v]) => console.log('  ' + k + ': ' + v));

console.log('\nBy file:');
Object.entries(files).sort((a,b) => b[1] - a[1]).forEach(([k,v]) => console.log('  ' + v.toString().padStart(3) + ' ' + k));

console.log('\n--- Full errors ---');
lines.forEach(l => console.log(l));
