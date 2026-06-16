const express = require('express');
const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const router = express.Router();

const TEMP_DIR = path.join(os.tmpdir(), 'cisp-executor');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

// ───── 安全审计规则库 ─────
const AUDIT_RULES = [
  // Python
  { id: 'PY001', lang: 'python', severity: 'critical', pattern: /\bos\.system\s*\(/g, desc: '使用 os.system() 可执行任意系统命令', fix: '使用 subprocess.run([...]) 并禁用 shell=True' },
  { id: 'PY002', lang: 'python', severity: 'high', pattern: /\bexec\s*\(/g, desc: 'exec() 可执行任意 Python 代码', fix: '避免使用 exec()，改用安全的数据结构' },
  { id: 'PY003', lang: 'python', severity: 'high', pattern: /\beval\s*\(/g, desc: 'eval() 可执行任意 Python 表达式', fix: '使用 ast.literal_eval() 或 json.loads()' },
  { id: 'PY004', lang: 'python', severity: 'medium', pattern: /\bpickle\.loads?\s*\(/g, desc: 'pickle 反序列化存在代码注入风险', fix: '使用 json 代替 pickle，或对来源进行签名验证' },
  { id: 'PY005', lang: 'python', severity: 'medium', pattern: /yaml\.load\s*\(/g, desc: 'yaml.load() 不安全，可执行任意代码', fix: '使用 yaml.safe_load()' },
  { id: 'PY006', lang: 'python', severity: 'medium', pattern: /\binput\s*\(/g, desc: 'Python 2 中 input() 等同于 eval(raw_input())', fix: 'Python 3 中 input() 是安全的，确认运行环境' },
  { id: 'PY007', lang: 'python', severity: 'low', pattern: /subprocess\.(call|run)\([^)]*shell\s*=\s*True/gi, desc: 'shell=True 可能导致命令注入', fix: '移除 shell=True，使用列表参数形式' },
  { id: 'PY008', lang: 'python', severity: 'low', pattern: /password\s*=\s*['"][^'"]+['"]/gi, desc: '硬编码密码/凭证', fix: '使用环境变量或密钥管理服务' },

  // JavaScript / Node.js
  { id: 'JS001', lang: 'javascript', severity: 'critical', pattern: /\bchild_process\s*\.\s*exec\s*\(/g, desc: 'child_process.exec() 会启动 shell，存在命令注入风险', fix: '使用 child_process.execFile() 或 spawn()' },
  { id: 'JS002', lang: 'javascript', severity: 'high', pattern: /\beval\s*\(/g, desc: 'eval() 可执行任意 JS 代码', fix: '避免使用 eval()，使用 JSON.parse() 或函数式方法' },
  { id: 'JS003', lang: 'javascript', severity: 'high', pattern: /new\s+Function\s*\(/g, desc: 'new Function() 等同于 eval()', fix: '避免动态创建函数' },
  { id: 'JS004', lang: 'javascript', severity: 'medium', pattern: /\.query\s*\(\s*['"`].*?\$\{/g, desc: 'SQL 字符串拼接可能存在注入漏洞', fix: '使用参数化查询或 ORM' },
  { id: 'JS005', lang: 'javascript', severity: 'medium', pattern: /\bfs\s*\.\s*unlink\s*\(/g, desc: '使用 fs.unlink() 可能删除重要文件', fix: '操作前验证文件路径和权限' },
  { id: 'JS006', lang: 'javascript', severity: 'medium', pattern: /\bfs\s*\.\s*rmdir\s*\(/g, desc: '使用 fs.rmdir() 可能删除重要目录', fix: '操作前验证目录路径和权限' },
  { id: 'JS007', lang: 'javascript', severity: 'low', pattern: /password\s*[=:]\s*['"`][^'"`]+['"`]/gi, desc: '硬编码密码/凭证', fix: '使用环境变量 process.env.SECRET' },
  { id: 'JS008', lang: 'javascript', severity: 'low', pattern: /api[_-]?key\s*[=:]\s*['"`][^'"`]+['"`]/gi, desc: '硬编码 API Key', fix: '使用环境变量 process.env.API_KEY' },

  // Java
  { id: 'JV001', lang: 'java', severity: 'critical', pattern: /\bRuntime\s*\.\s*getRuntime\s*\(\s*\)\s*\.\s*exec\s*\(/g, desc: 'Runtime.exec() 可执行系统命令', fix: '避免动态执行系统命令，使用 NIO 等安全 API' },
  { id: 'JV002', lang: 'java', severity: 'high', pattern: /\bProcessBuilder\s*\(/g, desc: 'ProcessBuilder 可启动系统进程', fix: '严格校验输入，使用白名单限制可执行程序' },
  { id: 'JV003', lang: 'java', severity: 'high', pattern: /\bStatement\s+.*?=\s*.*?\.createStatement\s*\(/g, desc: 'Statement 存在 SQL 注入风险', fix: '使用 PreparedStatement' },
  { id: 'JV004', lang: 'java', severity: 'medium', pattern: /DriverManager\s*\.\s*getConnection\s*\(\s*['"][^'"]*['"]\s*\+\s*/g, desc: 'JDBC 连接字符串拼接可能存在注入', fix: '使用连接池或配置文件管理连接字符串' },
  { id: 'JV005', lang: 'java', severity: 'low', pattern: /(password|passwd|secret)\s*=\s*['"][^'"]+['"]\s*;/gi, desc: '硬编码密码/凭证', fix: '使用环境变量或配置文件管理敏感信息' },
  { id: 'JV006', lang: 'java', severity: 'low', pattern: /System\s*\.\s*exit\s*\(/g, desc: 'System.exit() 会终止整个JVM', fix: '在应用代码中避免使用 System.exit()' },
];

function readProjects() {
  try {
    if (fs.existsSync(PROJECTS_FILE)) return JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
  } catch (_) {}
  return [];
}
function writeProjects(data) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

const TIMEOUTS = { python: 10000, javascript: 10000, java: 15000 };
const MAX_OUTPUT = 100 * 1024; // 100KB

// ✨ 跟踪运行中的进程，支持主动取消
const runningProcesses = new Map();

function executeCommand(cmd, args, timeout, input, execId) {
  return new Promise((resolve) => {
    const start = Date.now();
    let stdout = '';
    let stderr = '';

    const child = execFile(cmd, args, {
      timeout,
      maxBuffer: MAX_OUTPUT * 2,
      cwd: TEMP_DIR,
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
    });

    // 注册到全局跟踪表
    if (execId) runningProcesses.set(execId, child);

    if (input) {
      child.stdin.write(input);
      child.stdin.end();
    }

    child.stdout.on('data', (data) => {
      if (stdout.length < MAX_OUTPUT) stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      if (stderr.length < MAX_OUTPUT) stderr += data.toString();
    });

    const cleanup = () => {
      if (execId) runningProcesses.delete(execId);
    };

    child.on('close', (code, signal) => {
      cleanup();
      const elapsed = Date.now() - start;
      const killedByUser = signal === 'SIGTERM' || signal === 'SIGKILL';
      if (killedByUser || code === null) {
        const reason = killedByUser ? '用户手动停止' : `超时 ${timeout / 1000}s`;
        resolve({
          stdout: stdout.slice(0, MAX_OUTPUT),
          stderr: (stderr + `\n[进程被终止: ${reason}]`).slice(0, MAX_OUTPUT),
          exitCode: 124,
          executionTime: elapsed,
          killed: true,
        });
      } else {
        resolve({
          stdout: stdout.slice(0, MAX_OUTPUT),
          stderr: stderr.slice(0, MAX_OUTPUT),
          exitCode: code ?? 1,
          executionTime: elapsed,
          killed: false,
        });
      }
    });

    child.on('error', (err) => {
      cleanup();
      resolve({
        stdout: '',
        stderr: `执行错误: ${err.message}`,
        exitCode: 1,
        executionTime: Date.now() - start,
        killed: false,
      });
    });
  });
}

// Python 执行
async function executePython(code, stdin, execId, args) {
  const filePath = path.join(TEMP_DIR, `py_${Date.now()}.py`);
  fs.writeFileSync(filePath, code, 'utf-8');
  const cmdArgs = [filePath, ...(args || [])];
  const result = await executeCommand('python', cmdArgs, TIMEOUTS.python, stdin || null, execId);
  try { fs.unlinkSync(filePath); } catch (_) { /* ignore */ }
  return result;
}

// JavaScript (Node.js) 执行
async function executeJavaScript(code, stdin, execId, args) {
  const filePath = path.join(TEMP_DIR, `js_${Date.now()}.js`);
  fs.writeFileSync(filePath, code, 'utf-8');
  const cmdArgs = ['--max-old-space-size=128', filePath, ...(args || [])];
  const result = await executeCommand('node', cmdArgs, TIMEOUTS.javascript, stdin || null, execId);
  try { fs.unlinkSync(filePath); } catch (_) { /* ignore */ }
  return result;
}

// Java 执行
async function executeJava(code, stdin, execId, args) {
  // 提取类名
  const classMatch = code.match(/public\s+class\s+(\w+)/);
  const className = classMatch ? classMatch[1] : `J${Date.now().toString(36)}`;

  // 若类名不匹配，替换为文件名对应的类名
  let finalCode = code;
  if (classMatch && classMatch[1] !== className) {
    finalCode = code.replace(new RegExp(`\\b${classMatch[1]}\\b`, 'g'), className);
  }
  if (!classMatch) {
    // 包装代码
    finalCode = `public class ${className} {\n  public static void main(String[] args) {\n${code.split('\n').map(l => '    ' + l).join('\n')}\n  }\n}`;
  }

  const javaFile = path.join(TEMP_DIR, `${className}.java`);
  fs.writeFileSync(javaFile, finalCode, 'utf-8');

  // 编译
  const compileResult = await executeCommand('javac', ['-encoding', 'UTF-8', javaFile], 10000, null, null);
  if (compileResult.exitCode !== 0) {
    try { fs.unlinkSync(javaFile); } catch (_) { /* ignore */ }
    return {
      ...compileResult,
      stderr: compileResult.stderr || compileResult.stdout || '编译失败',
      stdout: compileResult.stdout,
    };
  }

  // 运行
  const runResult = await executeCommand('java', ['-Dfile.encoding=UTF-8', '-cp', TEMP_DIR, className, ...(args || [])], TIMEOUTS.java, stdin || null, execId);

  // 清理
  try { fs.unlinkSync(javaFile); } catch (_) { /* ignore */ }
  try { fs.unlinkSync(path.join(TEMP_DIR, `${className}.class`)); } catch (_) { /* ignore */ }

  return runResult;
}

router.post('/', async (req, res) => {
  const { language, code, stdin, args } = req.body;

  if (!code || typeof code !== 'string' || code.trim().length === 0) {
    return res.status(400).json({ error: '请提供要执行的代码' });
  }

  if (!['python', 'javascript', 'java'].includes(language)) {
    return res.status(400).json({ error: '不支持的语言类型，可选: python, javascript, java' });
  }

  // G. 解析命令行参数
  const cliArgs = args && typeof args === 'string' && args.trim()
    ? args.trim().split(/\s+/).filter(Boolean)
    : [];

  const execId = crypto.randomUUID();

  try {
    let result;
    switch (language) {
      case 'python':
        result = await executePython(code, stdin, execId, cliArgs);
        break;
      case 'javascript':
        result = await executeJavaScript(code, stdin, execId, cliArgs);
        break;
      case 'java':
        result = await executeJava(code, stdin, execId, cliArgs);
        break;
    }

    res.json({
      success: result.exitCode === 0 && !result.killed,
      language,
      execId,
      ...result,
    });
  } catch (e) {
    res.status(500).json({ error: '执行失败', detail: e.message });
  }
});

// ✨ 取消正在运行的执行
router.post('/cancel/:execId', (req, res) => {
  const { execId } = req.params;
  const child = runningProcesses.get(execId);
  if (!child) {
    return res.status(404).json({ error: '未找到该执行进程，可能已完成' });
  }
  try {
    // Windows 上用 taskkill /T 杀整个进程树，Unix 用 SIGTERM
    if (process.platform === 'win32') {
      execFile('taskkill', ['/PID', child.pid.toString(), '/T', '/F'], { timeout: 3000 }, () => {});
    } else {
      child.kill('SIGTERM');
    }
    runningProcesses.delete(execId);
    res.json({ cancelled: true, execId });
  } catch (e) {
    res.status(500).json({ error: '取消失败', detail: e.message });
  }
});

// 获取可用的运行时环境
router.get('/runtimes', (req, res) => {
  const runtimes = [];

  // 检测 Python
  execFile('python', ['--version'], { timeout: 3000 }, (err, stdout, stderr) => {
    const pyVersion = (stdout || stderr || '').trim();
    if (!err || pyVersion) {
      runtimes.push({
        id: 'python',
        name: 'Python',
        version: pyVersion.replace('Python ', ''),
        icon: '🐍',
        color: '#3776AB',
        extensions: ['.py'],
        template: `# Python 示例代码\nprint("Hello, 代码运行中心!")\n\n# 试试看: 计算斐波那契数列\ndef fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b\n\nfor num in fibonacci(10):\n    print(num, end=' ')`,
      });
    }
    pushJavascript();
  });

  function pushJavascript() {
    execFile('node', ['--version'], { timeout: 3000 }, (err, stdout) => {
      if (!err && stdout) {
        runtimes.push({
          id: 'javascript',
          name: 'JavaScript (Node.js)',
          version: stdout.trim().replace('v', ''),
          icon: '⚡',
          color: '#F7DF1E',
          extensions: ['.js', '.mjs'],
          template: `// JavaScript 示例代码\nconsole.log("Hello, 代码运行中心!");\n\n// 试试看: 计算阶乘\nfunction factorial(n) {\n  return n <= 1 ? 1 : n * factorial(n - 1);\n}\n\nconsole.log('5! =', factorial(5));\n\n// 对象操作\nconst user = { name: '安全工程师', level: 3 };\nconsole.log('User:', JSON.stringify(user, null, 2));`,
        });
      }
      pushJava();
    });
  }

  function pushJava() {
    execFile('java', ['--version'], { timeout: 3000 }, (err, stdout, stderr) => {
      const jv = (stdout || stderr || '').split('\n')[0].trim();
      if (!err || jv) {
        // 也检查 javac
        execFile('javac', ['--version'], { timeout: 3000 }, (err2, out2, err2Str) => {
          const jcv = (out2 || err2Str || '').trim();
          runtimes.push({
            id: 'java',
            name: 'Java',
            version: jv,
            icon: '☕',
            color: '#ED8B00',
            extensions: ['.java'],
            template: `// Java 示例 - 类名必须是 Main\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, 代码运行中心!");\n        \n        // 试试看: 计算质数\n        int count = 0;\n        for (int i = 2; i <= 100; i++) {\n            boolean isPrime = true;\n            for (int j = 2; j <= Math.sqrt(i); j++) {\n                if (i % j == 0) { isPrime = false; break; }\n            }\n            if (isPrime) {\n                System.out.print(i + " ");\n                count++;\n            }\n        }\n        System.out.println("\\n共 " + count + " 个质数");\n    }\n}`,
            hasJavac: !!(err2 === null || jcv),
          });
          res.json({ runtimes });
        });
      } else {
        res.json({ runtimes });
      }
    });
  }
});

// ───── C. 安全代码审计 ─────
router.post('/audit', (req, res) => {
  const { language, code } = req.body;
  if (!code || !language) return res.status(400).json({ error: '请提供 language 和 code' });

  const lines = code.split('\n');
  const findings = [];

  AUDIT_RULES
    .filter(r => r.lang === language)
    .forEach(rule => {
      // 重新匹配以获取行号
      const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
      lines.forEach((line, idx) => {
        let match;
        while ((match = regex.exec(line)) !== null) {
          findings.push({
            ruleId: rule.id,
            severity: rule.severity,
            line: idx + 1,
            column: match.index + 1,
            description: rule.desc,
            suggestion: rule.fix,
            snippet: line.trim().substring(0, 80),
          });
          if (!regex.flags.includes('g')) break;
        }
      });
    });

  findings.sort((a, b) => {
    const sev = { critical: 0, high: 1, medium: 2, low: 3 };
    return sev[a.severity] - sev[b.severity] || a.line - b.line;
  });

  const summary = {
    total: findings.length,
    critical: findings.filter(f => f.severity === 'critical').length,
    high: findings.filter(f => f.severity === 'high').length,
    medium: findings.filter(f => f.severity === 'medium').length,
    low: findings.filter(f => f.severity === 'low').length,
  };

  res.json({ language, findings, summary, scannedLines: lines.length });
});

// ───── F. 命名项目保存/加载 ─────
router.get('/projects', (req, res) => {
  const projects = readProjects();
  // 只返回摘要，不返回完整代码
  const summaries = projects.map(p => ({
    id: p.id,
    name: p.name,
    tabCount: p.tabs?.length || 0,
    languages: [...new Set((p.tabs || []).map(t => t.language))],
    updatedAt: p.updatedAt,
  }));
  res.json({ projects: summaries });
});

router.get('/projects/:id', (req, res) => {
  const projects = readProjects();
  const project = projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: '项目不存在' });
  res.json(project);
});

router.post('/projects', (req, res) => {
  const { name, tabs, activeTabId } = req.body;
  if (!name || !tabs) return res.status(400).json({ error: '请提供项目名称和标签页' });

  const projects = readProjects();
  const id = crypto.randomUUID();
  const now = Date.now();

  const project = { id, name, tabs, activeTabId: activeTabId || tabs[0]?.id, createdAt: now, updatedAt: now };
  projects.push(project);

  // 最多保留50个项目
  const trimmed = projects.slice(-50);
  writeProjects(trimmed);
  res.json(project);
});

router.put('/projects/:id', (req, res) => {
  const projects = readProjects();
  const idx = projects.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: '项目不存在' });

  const { name, tabs, activeTabId } = req.body;
  if (name) projects[idx].name = name;
  if (tabs) projects[idx].tabs = tabs;
  if (activeTabId) projects[idx].activeTabId = activeTabId;
  projects[idx].updatedAt = Date.now();
  writeProjects(projects);
  res.json(projects[idx]);
});

router.delete('/projects/:id', (req, res) => {
  const projects = readProjects();
  const filtered = projects.filter(p => p.id !== req.params.id);
  if (filtered.length === projects.length) return res.status(404).json({ error: '项目不存在' });
  writeProjects(filtered);
  res.json({ deleted: true, id: req.params.id });
});

module.exports = router;
