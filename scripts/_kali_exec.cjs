// Kali SSH 执行小工具（复用 vmLabs.js）
// 用法:
//   1) 单行命令：
//      node.exe .\scripts\_kali_exec.cjs "whoami && uname -a"
//      node.exe .\scripts\_kali_exec.cjs "whoami" 30000        # 第2个参数可传超时(ms)
//   2) 复杂脚本（彻底避开 PowerShell/Bash 多层转义）：
//      node.exe .\scripts\_kali_exec.cjs --script .\scripts\my.sh
//      node.exe .\scripts\_kali_exec.cjs --script .\scripts\my.sh 300000
const path = require('path');
const fs = require('fs');

process.env.KALI_HOST = process.env.KALI_HOST || '192.168.108.128';
process.env.KALI_USER = process.env.KALI_USER || 'kail';
process.env.KALI_PASS = process.env.KALI_PASS || 'kail';
process.env.KALI_PORT = process.env.KALI_PORT || 22;

const { connectKali, execOnKali, closeSshClient } = require(path.join(__dirname, '..', 'backend', 'lib', 'vmLabs.js'));

function parseArgs(argv) {
  const args = argv.slice(2);
  // 默认超时
  let timeout = 600_000;
  // 如果最后一个参数是纯数字，认为是超时
  if (args.length >= 2 && /^\d+$/.test(args[args.length - 1])) {
    timeout = Number(args.pop());
  }
  let cmd = null;
  if (args[0] === '--script' && args[1]) {
    const local = path.resolve(args[1]);
    if (!fs.existsSync(local)) {
      console.error('本地脚本不存在:', local);
      process.exit(1);
    }
    const text = fs.readFileSync(local, 'utf-8');
    const b64 = Buffer.from(text.replace(/\r\n/g, '\n'), 'utf-8').toString('base64');
    // Kali 端解码到临时 sh 再执行
    cmd = `TMP=/tmp/kali_script_$$.sh; echo '${b64}' | base64 -d > "$TMP" && chmod +x "$TMP" && bash "$TMP"; RC=$?; rm -f "$TMP"; exit $RC`;
  } else if (args[0]) {
    cmd = args[0];
  }
  return { cmd, timeout };
}

const { cmd, timeout } = parseArgs(process.argv);

if (!cmd) {
  console.error(
    [
      '用法：',
      '  # 单行命令',
      '  node scripts/_kali_exec.cjs "whoami && uname -a" [超时ms]',
      '  # 复杂脚本（推荐，无转义烦恼）',
      '  node scripts/_kali_exec.cjs --script ./本地脚本.sh [超时ms]',
    ].join('\n')
  );
  process.exit(1);
}

(async () => {
  try {
    console.log(`[KALI] 正在连接 ${process.env.KALI_USER}@${process.env.KALI_HOST}:${process.env.KALI_PORT} ...`);
    await connectKali();
    console.log(`[KALI] 连接成功，超时=${timeout}ms；正在执行：\n-----BEGIN-----\n${cmd.length < 400 ? cmd : cmd.slice(0, 400) + '\n...(命令过长已截断)'}\n------END------\n`);
    const res = await execOnKali(cmd, timeout);
    console.log('===== STDOUT =====');
    console.log(res.stdout || '(空)');
    if ((res.stderr || '').trim()) {
      console.log('\n===== STDERR =====');
      console.log(res.stderr);
    }
    console.log('\n===== EXIT CODE:', res.exitCode, '=====');
    process.exit(res.exitCode === 0 ? 0 : (res.exitCode ?? 99));
  } catch (e) {
    console.error('[KALI] 执行失败:', e.message || e);
    try { closeSshClient('kali'); } catch (_) {}
    process.exit(2);
  }
})();
