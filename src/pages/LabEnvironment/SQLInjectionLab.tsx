import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Terminal, Database, CheckCircle, Eye, Code2, ChevronDown } from 'lucide-react';
import { Card, Button } from '../../components/UI';

interface DBRow { id: number; username: string; password: string; email: string; role: string; }

const MOCK_DB: DBRow[] = [
  { id: 1, username: 'admin', password: 'supersecret123', email: 'admin@cisp.local', role: 'admin' },
  { id: 2, username: 'user', password: 'password456', email: 'user@cisp.local', role: 'user' },
  { id: 3, username: 'guest', password: 'guest789', email: 'guest@cisp.local', role: 'guest' },
  { id: 4, username: 'devops', password: 'deploy2024!', email: 'devops@cisp.local', role: 'admin' },
  { id: 5, username: 'test', password: 'test1234', email: 'test@cisp.local', role: 'user' },
];

const DB_SCHEMA = `CREATE TABLE users (
  id       INTEGER PRIMARY KEY,
  username VARCHAR(50),
  password VARCHAR(100),
  email    VARCHAR(100),
  role     VARCHAR(20)
);

-- 原始查询（存在SQL注入漏洞）
SELECT * FROM products WHERE id = [用户输入]`;

export const SQLInjectionLab: React.FC = () => {
  const [mode, setMode] = useState<'union' | 'blind' | 'error' | 'boolean'>('union');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [solved, setSolved] = useState(false);
  const [showDB, setShowDB] = useState(false);
  const [showSchema, setShowSchema] = useState(false);

  const modeLabels: Record<string, { name: string; emoji: string; desc: string; example: string }> = {
    union:    { name: '联合查询',  emoji: '🔗', desc: '使用UNION SELECT将攻击者控制的查询结果附加到原查询结果中', example: "1' UNION SELECT id,username,password,email,role FROM users--" },
    blind:    { name: '时间盲注',  emoji: '⏱️',  desc: '通过数据库响应时间差异推断数据，使用SLEEP/BENCHMARK函数', example: "1' AND IF((SELECT LENGTH(password) FROM users WHERE id=1)>5, SLEEP(3), 0)--" },
    error:    { name: '报错注入',  emoji: '💥', desc: '利用数据库错误信息泄露数据，使用EXTRACTVALUE/UPDATEXML等函数', example: "1' AND EXTRACTVALUE(1,CONCAT(0x7e,(SELECT password FROM users LIMIT 1)))--" },
    boolean:  { name: '布尔盲注',  emoji: '🟢', desc: '通过页面返回的布尔差异逐字符推断数据', example: "1' AND (SELECT SUBSTRING(password,1,1) FROM users WHERE id=1)='s'--" },
  };

  const handleExecute = () => {
    if (!query.trim()) { setResult('⚠️ 请输入SQL注入payload'); return; }

    const q = query.trim().toLowerCase();
    let feedback = '';
    let isSolved = false;

    if (mode === 'union') {
      if (q.includes('union') && q.includes('select') && q.includes('from users') && q.includes('--')) {
        isSolved = true;
        feedback = `✅ UNION注入成功！成功提取了users表的全部数据！

📊 泄露的数据库记录：
${MOCK_DB.map(r => `  ├─ [${r.id}] ${r.username} | ${r.password} | ${r.email} | ${r.role}`).join('\n')}
  └─ 共 ${MOCK_DB.length} 条记录

💡 攻击者可以用这些凭据登录其他系统（凭证复用攻击）`;
      } else if (q.includes('union') && q.includes('select')) {
        feedback = `⚠️ UNION SELECT部分正确，但缺少 FROM users 和注释符 --
💡 完整payload格式: 1' UNION SELECT col1,col2,col3,col4,col5 FROM users--`;
      } else {
        feedback = `❌ 请尝试使用 UNION SELECT 语句
📝 示例: ${modeLabels.union.example}`;
      }
    } else if (mode === 'blind') {
      if ((q.includes('sleep(') || q.includes('benchmark(')) && q.includes('and')) {
        isSolved = true;
        feedback = `✅ 时间盲注成功！
⏱️ 服务器响应延迟了5秒，确认SQL注入点存在

📊 利用时间差可逐字符提取数据：
  ├─ 检测密码长度: SLEEP(5) → 密码长度 > 5 ✓
  ├─ 检测首字符: IF(SUBSTR(password,1,1)='s', SLEEP(3), 0) → 延迟3秒 ✓
  └─ 逐字符提取完整密码: supersecret123

💡 MySQL中常用 SLEEP(n)/BENCHMARK(), PostgreSQL用 pg_sleep(n)`;
      } else {
        feedback = `❌ 请尝试基于时间的盲注函数
📝 示例: ${modeLabels.blind.example}`;
      }
    } else if (mode === 'error') {
      if ((q.includes('extractvalue') || q.includes('updatexml')) && q.includes('concat')) {
        isSolved = true;
        feedback = `✅ 报错注入成功！

💥 数据库错误泄露了敏感信息：
  ├─ 数据库用户: root@localhost
  ├─ 数据库名: cisp_db
  ├─ 版本: MySQL 8.0.36
  └─ 第一条密码: supersecret123

⚠️ 攻击者可通过此方法逐条泄露所有用户数据`;
      } else if (q.includes('extractvalue') || q.includes('updatexml')) {
        feedback = `⚠️ 使用了报错函数但需要配合 CONCAT 拼接查询内容
📝 示例: ${modeLabels.error.example}`;
      } else {
        feedback = `❌ 请尝试报错注入函数
📝 示例: ${modeLabels.error.example}`;
      }
    } else {
      // boolean
      if (q.includes('substring') || q.includes('substr') || q.includes('length(') || q.includes('ascii(')) {
        isSolved = true;
        feedback = `✅ 布尔盲注成功！

🟢 通过布尔差异判断：
  ├─ AND 1=1 → 正常响应（条件为真）✓
  ├─ AND 1=2 → 无数据（条件为假）✗
  ├─ SUBSTRING(password,1,1)='s' → 正常响应 → 首字符是 's' ✓
  └─ 逐字符推断可得完整密码

💡 这是最隐蔽的SQL注入类型，不会产生错误或延迟`;
      } else {
        feedback = `❌ 请尝试布尔盲注函数
📝 示例: ${modeLabels.boolean.example}`;
      }
    }

    setResult(feedback);
    setSolved(isSolved);
    setQuery('');
  };

  const switchMode = (m: typeof mode) => {
    setMode(m);
    setResult('');
    setSolved(false);
    setQuery('');
  };

  return (
    <div className="space-y-4">
      {/* Mode selector */}
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(modeLabels) as Array<typeof mode>).map(m => (
          <button key={m} onClick={() => switchMode(m)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              mode === m ? 'bg-orange-500 text-white' : 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20'
            }`}>
            {modeLabels[m].emoji} {modeLabels[m].name}
          </button>
        ))}
      </div>

      <Card className="border-orange-500/20">
        {/* Mode description */}
        <div className="p-3 bg-orange-500/5 rounded-lg mb-4 border border-orange-500/20">
          <p className="text-xs text-orange-300/80 font-medium mb-1">{modeLabels[mode].emoji} {modeLabels[mode].name}</p>
          <p className="text-xs text-gray-400">{modeLabels[mode].desc}</p>
        </div>

        {/* Simulated SQL */}
        <div className="flex items-center justify-between mb-3">
          <div className="p-3 bg-cyber-black/50 rounded-lg text-xs text-gray-400 flex-1 font-mono">
            <Terminal size={14} className="inline mr-1 text-orange-400" />
            <span>SELECT * FROM products WHERE id = </span>
            <span className="text-orange-400 font-bold">[用户输入]</span>
          </div>
          <button onClick={() => setShowSchema(!showSchema)}
            className="ml-2 text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 flex-shrink-0">
            <ChevronDown size={14} className={`transition-transform ${showSchema ? 'rotate-180' : ''}`} />
             Schema
          </button>
        </div>
        {showSchema && (
          <motion.pre initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="text-[11px] text-gray-500 bg-cyber-black/70 p-3 rounded-lg mb-3 font-mono whitespace-pre overflow-x-auto border border-gray-700/50">
            {DB_SCHEMA}
          </motion.pre>
        )}

        {/* Input */}
        <div className="flex gap-2 mb-4">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleExecute()}
            placeholder={`输入SQL注入payload... (示例: ${modeLabels[mode].example})`}
            className="flex-1 px-4 py-2.5 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-orange-500 font-mono"
          />
          <Button onClick={handleExecute} className="!bg-orange-500 text-white hover:!bg-orange-400">
            <Play size={16} /> 执行
          </Button>
        </div>

        {/* Result */}
        {result && (
          <motion.pre initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg text-xs whitespace-pre-wrap border font-mono ${
              solved
                ? 'bg-green-500/5 border-green-500/30 text-green-300'
                : 'bg-yellow-500/5 border-yellow-500/30 text-yellow-300'
            }`}>
            {result}
          </motion.pre>
        )}

        {/* Success notice */}
        {solved && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={18} className="text-green-400" />
              <span className="text-green-400 text-sm font-semibold">🎉 {modeLabels[mode].name}注入成功！</span>
            </div>
            <p className="text-xs text-gray-400">
              🛡️ <span className="text-green-400 font-medium">最佳防御：</span>
              使用参数化查询(Prepared Statements)。不要拼接SQL字符串，不要仅依赖过滤/转义输入。
            </p>
          </motion.div>
        )}

        {/* Quick payloads */}
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <p className="text-[10px] text-gray-600 mb-2">快速填充payload：</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              "1' UNION SELECT id,username,password,email,role FROM users--",
              "1' AND IF((SELECT LENGTH(password) FROM users WHERE id=1)>5,SLEEP(3),0)--",
              "1' AND EXTRACTVALUE(1,CONCAT(0x7e,(SELECT password FROM users LIMIT 1)))--",
              "1' AND (SELECT SUBSTRING(password,1,1) FROM users WHERE id=1)='s'--",
              "' OR '1'='1'--",
              "1'; DROP TABLE users;--",
            ].map((payload, i) => (
              <button key={i} onClick={() => setQuery(payload)}
                className="text-[10px] px-2 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400/70 hover:bg-orange-500/20 hover:text-orange-300 transition font-mono truncate max-w-[320px]">
                {payload.length > 45 ? payload.substring(0, 45) + '...' : payload}
              </button>
            ))}
          </div>
        </div>

        {/* DB viewer toggle */}
        <div className="mt-3 pt-3 border-t border-gray-700/50">
          <button onClick={() => setShowDB(!showDB)}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-orange-400 transition">
            <Database size={12} />
            {showDB ? '隐藏' : '查看'} 模拟数据库
          </button>
        </div>
      </Card>

      {/* Database viewer */}
      {showDB && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-gray-700/50">
            <h4 className="text-sm text-gray-400 mb-3 flex items-center gap-2">
              <Database size={14} /> users表 ({MOCK_DB.length} 条记录)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-2 text-gray-500 font-medium">ID</th>
                    <th className="text-left p-2 text-gray-500 font-medium">username</th>
                    <th className="text-left p-2 text-gray-500 font-medium">password</th>
                    <th className="text-left p-2 text-gray-500 font-medium">email</th>
                    <th className="text-left p-2 text-gray-500 font-medium">role</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_DB.map(row => (
                    <tr key={row.id} className="border-b border-gray-700/30 hover:bg-orange-500/5 transition">
                      <td className="p-2 text-gray-600 font-mono">{row.id}</td>
                      <td className="p-2 text-orange-300 font-mono">{row.username}</td>
                      <td className="p-2 text-gray-500 font-mono">{'*'.repeat(row.password.length)}</td>
                      <td className="p-2 text-gray-500 font-mono">{row.email}</td>
                      <td className="p-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          row.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>{row.role}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
