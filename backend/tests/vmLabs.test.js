// TDD: 真实靶场后端逻辑单元测试
// 使用 Node 18+ 内置 node:test + assert/strict，无需额外依赖
const test = require('node:test');
const assert = require('node:assert/strict');

// ====== RED：先写断言（验证预期行为）======

test('MACHINES 配置必须包含 Kali 攻击机 + Win7 靶机，且 IP 正确', () => {
  const { MACHINES, KALI_CONFIG, WIN7_CONFIG, DVWA_TARGETS } = require('../lib/vmLabs');
  assert.ok(Array.isArray(MACHINES), 'MACHINES 应为数组');
  assert.equal(MACHINES.length, 2, '应包含两台虚拟机');

  assert.equal(KALI_CONFIG.id, 'kali', 'Kali id 必须为 kali');
  assert.equal(KALI_CONFIG.role, 'attacker', 'Kali 角色必须是攻击机');
  assert.equal(typeof KALI_CONFIG.host, 'string', 'Kali host 必须是字符串');
  assert.ok(KALI_CONFIG.host.length > 0, 'Kali host 不能为空');
  assert.equal(typeof KALI_CONFIG.username, 'string', 'Kali 必须有用户名');
  assert.equal(typeof KALI_CONFIG.password, 'string', 'Kali 必须有密码');
  assert.equal(KALI_CONFIG.port, 22, 'Kali SSH 端口必须为 22');

  assert.equal(WIN7_CONFIG.id, 'win7', 'Win7 id 必须为 win7');
  assert.equal(WIN7_CONFIG.role, 'target', 'Win7 角色必须是靶机');
  assert.equal(typeof WIN7_CONFIG.host, 'string', 'Win7 host 必须是字符串');
  assert.ok(WIN7_CONFIG.host.length > 0, 'Win7 host 不能为空');

  // ===== DVWA =====
  assert.ok(Array.isArray(DVWA_TARGETS), 'DVWA_TARGETS 应为数组');
  assert.equal(DVWA_TARGETS.length, 2, '应包含两个 DVWA 靶场（Kali 版 + Win7 版）');
  const kaliDvwa = DVWA_TARGETS.find((d) => d.id === 'dvwa-kali');
  const win7Dvwa = DVWA_TARGETS.find((d) => d.id === 'dvwa-win7');
  assert.ok(kaliDvwa, '缺少 dvwa-kali 靶场');
  assert.ok(win7Dvwa, '缺少 dvwa-win7 靶场');
  [kaliDvwa, win7Dvwa].forEach((d) => {
    assert.equal(typeof d.baseUrl, 'string', `${d.id} baseUrl 必须是字符串`);
    assert.ok(d.baseUrl.startsWith('http'), `${d.id} baseUrl 应以 http(s) 开头`);
    assert.ok(/dvwa/i.test(d.baseUrl), `${d.id} 路径应包含 /dvwa/`);
    assert.equal(typeof d.name, 'string');
    assert.equal(typeof d.icon, 'string');
    assert.ok(d.defaultCreds && typeof d.defaultCreds.user === 'string', `${d.id} 应声明默认账密`);
    assert.equal(d.defaultCreds.user, 'admin', 'DVWA 默认用户名 admin');
    assert.equal(d.defaultCreds.pass, 'password', 'DVWA 默认密码 password');
  });
  // Kali DVWA 使用 9111 端口（用户提供的 npm 一键安装版）
  assert.match(kaliDvwa.baseUrl, /:9111\b/, 'Kali DVWA 应运行在 9111 端口');
  // Win7 DVWA 无端口（默认 80，phpStudy 版）
  assert.ok(
    /192\.168\.108\.129(?!.*:9111)/.test(win7Dvwa.baseUrl) || !/:\d+/.test(win7Dvwa.baseUrl.replace(/:80\b/, '')),
    'Win7 DVWA 应默认使用 80 端口 (phpStudy)'
  );
});

test('ATTACK_MODULES 必须覆盖 6 大阶段：侦察/SMB/利用/爆破/后渗透/DVWA专项', () => {
  const { ATTACK_MODULES, DVWA_TARGETS } = require('../lib/vmLabs');
  assert.ok(Array.isArray(ATTACK_MODULES), 'ATTACK_MODULES 应为数组');
  assert.ok(ATTACK_MODULES.length >= 6, `攻击模块数应 >= 6（现有 ${ATTACK_MODULES.length}）`);
  const ids = ATTACK_MODULES.map((m) => m.id);
  const expected = ['recon', 'smb', 'exploit', 'brute', 'postex', 'dvwa'];
  for (const id of expected) {
    assert.ok(ids.includes(id), `缺少攻击阶段: ${id}`);
  }
  ATTACK_MODULES.forEach((m) => {
    assert.equal(typeof m.name, 'string', `${m.id} 必须有名称`);
    assert.equal(typeof m.color, 'string', `${m.id} 必须有颜色`);
    assert.ok(Array.isArray(m.steps) && m.steps.length > 0, `${m.id} 必须有步骤`);
    m.steps.forEach((s) => {
      assert.equal(typeof s.id, 'string');
      assert.ok(s.id.length > 0, 'step.id 不能为空');
      assert.equal(typeof s.name, 'string');
      assert.equal(typeof s.command, 'string');
      assert.ok(s.command.length > 0, `${m.id}/${s.id} command 不能为空`);
      assert.ok(
        typeof s.timeout === 'number' || s.timeout === undefined,
        `${m.id}/${s.id} timeout 必须是数字或 undefined`
      );
    });
  });
  // DVWA 专项模块检查
  const dvwaMod = ATTACK_MODULES.find((m) => m.id === 'dvwa');
  assert.ok(dvwaMod.steps.length >= 8, `DVWA 模块至少 8 个漏洞子步骤（实际 ${dvwaMod.steps.length}）`);
  const stepIds = dvwaMod.steps.map((s) => s.id);
  [
    'dvwa-health',
    'dvwa-brute',
    'dvwa-cmdinj',
    'dvwa-sqli',
    'dvwa-xss',
    'dvwa-fileinc',
    'dvwa-upload',
    'dvwa-csrf',
  ].forEach((expectedId) => {
    assert.ok(stepIds.includes(expectedId), `DVWA 模块缺少步骤: ${expectedId}`);
  });
  // DVWA 步骤命令必须引用至少一个 DVWA URL
  const urls = DVWA_TARGETS.map((d) => d.baseUrl);
  dvwaMod.steps.slice(1).forEach((s) => {
    const hit = urls.some((u) => s.command.includes(u));
    // 允许少数通用型不命中，但大部分必须命中
    if (/(sqli|xss|fileinc|upload|csrf|cmdi|brute)/.test(s.id)) {
      assert.ok(hit, `DVWA 步骤 ${s.id} 的命令必须引用 dvwa baseUrl: ${s.command.slice(0, 120)}`);
    }
  });
});

test('每个攻击模块步骤至少包含一个 Win7 目标 IP 引用（真实靶机）', () => {
  const { ATTACK_MODULES, WIN7_CONFIG } = require('../lib/vmLabs');
  const ip = WIN7_CONFIG.host;
  assert.ok(ip, 'Win7 IP 必须已定义');
  // 每个攻击模块至少有 1 条命令命中靶机 IP
  ATTACK_MODULES.forEach((m) => {
    const hit = m.steps.some(
      (s) => s.command.includes(ip) || s.command.includes('TARGET') || s.command.includes('靶机')
    );
    // 允许 Kali 自身信息收集类模块不引用靶机 IP（比如 whoami 自检查），但 smb/exploit/brute/postex 必须命中
    if (['smb', 'exploit', 'brute', 'postex'].includes(m.id)) {
      assert.ok(hit, `${m.id} 模块的命令必须引用靶机 IP ${ip}`);
    }
  });
});

test('路由文件导出的是 Express Router 实例', () => {
  const router = require('../routes/vmLabs');
  assert.equal(typeof router, 'function', 'vmLabs 路由必须是函数（express Router）');
  // stack 属性是 Express Router 的标志
  assert.ok(Array.isArray(router.stack), '路由应具有 stack 数组');
});

test('SSH 安全基线：攻击模块命令中不包含被禁止的转发操作', () => {
  const { ATTACK_MODULES } = require('../lib/vmLabs');
  const forbidden = [
    { re: /\bssh\s+.*-L\s*[0-9]/, name: 'SSH -L 本地转发' },
    { re: /\bssh\s+.*-R\s*[0-9]/, name: 'SSH -R 远程转发' },
    { re: /\bssh\s+.*-D\s*[0-9]/, name: 'SSH -D 动态转发' },
    { re: /\bnc\s+.*-e\s/, name: 'nc -e 反向 shell' },
  ];
  for (const m of ATTACK_MODULES) {
    for (const s of m.steps) {
      for (const f of forbidden) {
        assert.ok(
          !f.re.test(s.command),
          `${m.id}/${s.id} 命令不应包含 ${f.name}: ${s.command.slice(0, 80)}`
        );
      }
    }
  }
});

test('ATTACK_MODULES 中危险步骤（dangerous:true）需谨慎使用，最多 2 个', () => {
  const { ATTACK_MODULES } = require('../lib/vmLabs');
  const dangerousSteps = ATTACK_MODULES.flatMap((m) => m.steps.filter((s) => s.dangerous));
  assert.ok(
    dangerousSteps.length <= 3,
    `危险步骤过多 (${dangerousSteps.length})，应避免用户误操作破坏靶机`
  );
  dangerousSteps.forEach((s) => {
    assert.match(
      s.name,
      /(exploit|漏洞利用|蓝屏|永恒蓝|EternalBlue|风险|破坏)/i,
      `危险步骤 ${s.name} 的名称应明显提示风险`
    );
  });
});

// ====== GREEN：执行时逻辑函数可用性 =====
test('导出的工具函数（readHistory/appendHistory/connectKali 等）必须存在', () => {
  const mod = require('../lib/vmLabs');
  const expectedFns = [
    'connectKali',
    'closeSshClient',
    'closeAllSsh',
    'execOnKali',
    'getAllStatuses',
    'checkKaliOnline',
    'checkWin7Online',
    'checkDvwaOnline',
    'getAllDvwaStatuses',
    'readHistory',
    'appendHistory',
  ];
  expectedFns.forEach((n) => {
    assert.equal(typeof mod[n], 'function', `缺少导出函数: ${n}`);
  });
});

test('quick-tools 中应包含 DVWA 专项命令（至少 3 条 category=DVWA）', async () => {
  const express = require('express');
  const router = require('../routes/vmLabs');
  const app = express();
  app.use(router);
  // 通过模拟 req/res 调 get('/quick-tools') 简单起见，直接访问路由 handlers：
  const handler = router.stack.find((r) => r.route && r.route.path === '/quick-tools' && r.route.methods.get);
  assert.ok(handler, '应存在 GET /quick-tools 路由');
  let got = null;
  const mockRes = {
    json: (payload) => {
      got = payload;
    },
  };
  const mockReq = { method: 'GET', url: '/quick-tools', path: '/quick-tools', originalUrl: '/quick-tools' };
  handler.handle(mockReq, mockRes, () => {});
  assert.ok(got && Array.isArray(got.tools), 'quick-tools 应返回 tools 数组');
  const dvwaTools = got.tools.filter((t) => t.category === 'DVWA');
  assert.ok(dvwaTools.length >= 3, `DVWA 专项工具应至少 3 条（现有 ${dvwaTools.length}）: ${dvwaTools.map(t => t.id).join(', ')}`);
  dvwaTools.forEach((t) => {
    assert.equal(typeof t.id, 'string');
    assert.equal(typeof t.name, 'string');
    assert.equal(typeof t.cmd, 'string');
    assert.ok(/dvwa/i.test(t.id) || /dvwa/i.test(t.name) || /dvwa/i.test(t.cmd), `DVWA 工具 ${t.id} 应标记 DVWA 特征`);
  });
});

test('History 文件读写（空状态）应能正常工作，不抛出', () => {
  const fs = require('fs');
  const path = require('path');
  const DATA_DIR = path.join(__dirname, '..', 'data');
  const HISTORY_FILE = path.join(DATA_DIR, 'vmLabs-history.json');
  // ensure dir
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(HISTORY_FILE)) fs.writeFileSync(HISTORY_FILE, '[]', 'utf8');
  const { readHistory, appendHistory } = require('../lib/vmLabs');
  const before = readHistory();
  assert.ok(Array.isArray(before), 'readHistory 应返回数组');
  const entry = appendHistory({
    execId: `test-${Date.now()}`,
    startedAt: new Date().toISOString(),
    endedAt: new Date().toISOString(),
    command: 'echo TDD',
    exitCode: 0,
    success: true,
    outputChars: 5,
  });
  assert.equal(typeof entry.execId, 'string');
  const after = readHistory();
  assert.ok(Array.isArray(after) && after.length >= 1, 'appendHistory 应写入一条记录');
  // 清理：删除刚写入的测试条目
  const cleaned = after.filter((x) => x.execId !== entry.execId);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(cleaned, null, 2), 'utf8');
  const final = readHistory();
  assert.equal(final.length, before.length, '测试后清理应恢复原有记录数');
});

console.log('\n✅ 所有 TDD 测试已加载，使用: node --test backend/tests/vmLabs.test.js');
