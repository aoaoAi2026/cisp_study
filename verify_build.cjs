const esbuild = require('./node_modules/esbuild');
const fs = require('fs');
try {
  esbuild.transformSync(fs.readFileSync('src/data/learningData.ts', 'utf-8'), { loader: 'ts' });
  console.log('SUCCESS');
} catch(e) {
  console.log('FAIL:', e.message);
  if (e.errors) e.errors.forEach(err => console.log('Line ' + err.location.line + ': ' + err.text));
}
