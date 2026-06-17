import { spawn } from 'child_process';

const pages = [
  { name: '3.6  CyberDailyLearning', url: 'http://localhost:6776/cyber-learning/basic' },
];

// Use agent-browser via CLI
function visit(url, name) {
  return new Promise((resolve) => {
    const cmd = spawn('agent-browser', ['open', url], { shell: true, cwd: 'e:/internal_safe/cisp1/cisp' });
    let output = '';
    cmd.stdout.on('data', (d) => { output += d.toString(); });
    cmd.stderr.on('data', (d) => { output += d.toString(); });
    cmd.on('close', () => {
      // Wait for load
      setTimeout(() => {
        const cmd2 = spawn('agent-browser', ['snapshot'], { shell: true, cwd: 'e:/internal_safe/cisp1/cisp' });
        let out2 = '';
        cmd2.stdout.on('data', (d) => { out2 += d.toString(); });
        cmd2.stderr.on('data', (d) => { out2 += d.toString(); });
        cmd2.on('close', () => {
          // Extract main heading from snapshot
          const match = out2.match(/heading\s+"([^"]+)"/);
          const heading = match ? match[1] : 'NOT FOUND';
          const hasContent = out2.length > 500;
          console.log(`${hasContent ? '✅' : '❌'} ${name} → ${heading} (${out2.length} chars)`);
          resolve();
        });
      }, 2000);
    });
  });
}

async function main() {
  // First login
  await visit('http://localhost:6776/auth', 'Auth');
  // Snapshot to get guest button ref
  // Actually, let's just do remote snapshots of key pages
  for (const p of pages) {
    await visit(p.url, p.name);
  }
  // Close browser
  spawn('agent-browser', ['close'], { shell: true });
}

main().catch(console.error);
