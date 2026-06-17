const esbuild = require('esbuild');
const fs = require('fs');

try {
    esbuild.transformSync(fs.readFileSync('src/data/learningData.ts', 'utf-8'), {
        loader: 'ts',
        format: 'esm',
    });
    console.log('SUCCESS');
} catch (e) {
    console.log(e.message);
    if (e.errors) {
        e.errors.forEach(err => {
            console.log('Line ' + err.location.line + ', Col ' + err.location.column + ': ' + err.text);
        });
    }
}
