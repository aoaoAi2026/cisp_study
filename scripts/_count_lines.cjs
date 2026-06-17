const fs = require('fs');
const path = require('path');

function walk(dir, cb) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(d => {
    const p = path.join(dir, d.name);
    if (d.isDirectory() && !d.name.startsWith('.') && d.name !== 'node_modules') walk(p, cb);
    else if (/\.(ts|tsx)$/.test(d.name)) cb(p);
  });
}

const files = [];
walk('src', p => {
  const l = fs.readFileSync(p, 'utf-8').split('\n').length;
  files.push({ p, l });
});

files.sort((a, b) => b.l - a.l)
  .filter(f => f.l > 300)
  .forEach(f => console.log(f.l + '\t' + f.p.replace('src' + path.sep, '')));
