import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, Code2, Shield, Eye, EyeOff, Copy, AlertTriangle } from 'lucide-react';
import { Card, Button } from '../../components/UI';

interface XSSLevel { title: string; hint: string; target: string; desc: string; examplePayload: string; defenseTip: string; }

const LEVELS: Record<'easy'|'medium'|'hard', XSSLevel> = {
  easy: {
    title: 'Level 1: DOM型XSS',
    desc: '目标：在输入框中注入脚本触发 alert(1) 弹窗',
    hint: '尝试直接使用 <script> 标签注入JavaScript代码',
    target: 'alert(1)',
    examplePayload: '<script>alert(1)</script>',
    defenseTip: '使用 textContent 替代 innerHTML，或对输出进行HTML实体编码。`<` 编码为 `&lt;`，`>` 编码为 `&gt;`',
  },
  medium: {
    title: 'Level 2: 反射型XSS — 绕过简单过滤',
    desc: '目标：通过反射型XSS获取Cookie。输入内容被过滤了script标签，但事件处理器未被过滤。',
    hint: '输入字段保留了 onerror/onload 等事件，尝试用 img/svg 标签的事件处理器',
    target: 'alert(document.cookie)',
    examplePayload: '<img src=x onerror=alert(document.cookie)>',
    defenseTip: '不仅过滤script标签，需全面过滤事件处理器（onerror/onload/onclick等），推荐使用CSP头部限制内联脚本',
  },
  hard: {
    title: 'Level 3: 存储型XSS — 绕过WAF',
    desc: '目标：构造存储型XSS payload，绕过WAF规则过滤。评论会存入数据库并展示给所有用户。',
    hint: 'WAF拦截了 <script> 和 onerror，但未考虑标签大小写混淆和编码变体',
    target: 'eval',
    examplePayload: '<svg><script>alert(1)</script> 或 <img src=x onmouseover=eval(atob("YWxlcnQoMSk="))>',
    defenseTip: '多层防御：1)输入验证+白名单;2)输出编码;3)CSP限制;4)HttpOnly Cookie;5)X-XSS-Protection头',
  },
};

export const XSSSandbox: React.FC = () => {
  const [level, setLevel] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [solved, setSolved] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);

  const levelData = LEVELS[level];

  const handleInject = () => {
    if (!input.trim()) { setOutput('⚠️ 请输入payload'); return; }

    const injected = input.trim();
    const lowerInput = injected.toLowerCase();
    setAttempts(a => a + 1);
    setHistory(h => [injected, ...h].slice(0, 10));

    let success = false;
    let feedback = '';

    if (level === 'easy') {
      if (lowerInput.includes('<script>') || lowerInput.includes('alert(')) {
        success = true;
        feedback = `✅ XSS攻击成功！Payload: \`${injected}\`\n🟢 浏览器执行了脚本，弹出了 alert(1)`;
      } else {
        feedback = `❌ 注入未成功，当前输入不含有效的XSS payload。\n💡 提示：${levelData.hint}`;
      }
    } else if (level === 'medium') {
      const hasScriptTag = /<script[^>]*>/i.test(lowerInput);
      const hasEventHandler = /on(error|load|click|mouseover|focus)=/i.test(lowerInput);
      const hasCookie = lowerInput.includes('document.cookie') || lowerInput.includes('cookie');
      const hasImgTag = lowerInput.includes('<img');

      if (hasScriptTag) {
        feedback = `🚫 WAF拦截！检测到 <script> 标签已被过滤。\n💡 当前级别过滤了script标签，但未过滤事件处理器。试试 img 或 svg 标签 + 事件处理器`;
      } else if ((hasEventHandler && hasImgTag) || lowerInput.includes('<svg')) {
        if (hasCookie) {
          success = true;
          feedback = `✅ 反射型XSS成功！\n🟢 成功绕过script标签过滤，通过事件处理器触发了Cookie读取\n🍪 模拟泄露Cookie：session=abc123; role=user`;
        } else {
          feedback = `✅ 事件处理器注入成功！但未获取Cookie。\n💡 需要触发 alert(document.cookie) 才算完全成功`;
        }
      } else {
        feedback = `❌ 注入未成功。\n💡 当前级别过滤了 <script> 标签，但 <img src=x onerror=...> 可用`;
      }
    } else {
      // hard: bypass WAF
      const wafScript = /<script[^>]*>/i.test(lowerInput);
      const wafOnError = /onerror\s*=/i.test(lowerInput);
      const hasAlertOrEval = lowerInput.includes('alert(') || lowerInput.includes('eval');

      if (wafScript) {
        feedback = `🚫 WAF拦截！检测到 <script> 已被规则 (?i)<script 拦截`;
      } else if (wafOnError) {
        feedback = `🚫 WAF拦截！检测到 onerror= 已被规则 (?i)on(error|load)= 拦截`;
      } else if (hasAlertOrEval || lowerInput.includes('onmouseover') || lowerInput.includes('atob(')) {
        success = true;
        feedback = `✅ WAF绕过成功！\n🟢 成功绕过多层WAF规则，执行了存储型XSS攻击\n💡 常用绕过技巧：大小写混淆、编码变体、嵌套标签、非标准事件`;
      } else {
        feedback = `❌ payload未通过。WAF拦截了 <script> 和 onerror。\n💡 尝试 onmouseover、atob编码、SVG嵌套等绕过方法`;
      }
    }

    setOutput(feedback);
    setSolved(success);
    setInput('');
  };

  const switchLevel = (l: typeof level) => {
    setLevel(l);
    setSolved(false);
    setOutput('');
    setInput('');
    setAttempts(0);
    setShowHint(false);
  };

  return (
    <div className="space-y-4">
      {/* Level selector */}
      <div className="flex gap-2">
        {(['easy', 'medium', 'hard'] as const).map(l => (
          <button key={l} onClick={() => switchLevel(l)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              level === l ? 'bg-red-500 text-white' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'}`}>
            {{ easy: '🟢 初级', medium: '🟡 中级', hard: '🔴 高级' }[l]}
          </button>
        ))}
      </div>

      {/* Main challenge card */}
      <Card className="border-red-500/20">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-red-400 font-medium mb-1">{levelData.title}</h3>
            <p className="text-xs text-gray-400">{levelData.desc}</p>
          </div>
          <button onClick={() => setShowCode(!showCode)}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-cyber-black/50 text-gray-500 hover:text-gray-300 transition">
            <Code2 size={12} /> {showCode ? '隐藏源码' : '查看源码'}
          </button>
        </div>

        {/* Simulated source code */}
        {showCode && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 p-3 bg-cyber-black/70 rounded-lg border border-gray-700 overflow-x-auto">
            <pre className="text-xs font-mono text-gray-400 whitespace-pre">
{`<!-- 模拟存在XSS漏洞的页面代码 -->
<div id="output">
  <p>你的评论: <span id="comment"></span></p>
</div>
<script>
  // ❌ 不安全：直接使用 innerHTML
  const userInput = "${input || '(用户输入)'}";
  document.getElementById('comment').innerHTML = userInput;
  
  // ✅ 安全做法：
  // document.getElementById('comment').textContent = userInput;
</script>`}
            </pre>
          </motion.div>
        )}

        {/* Hint */}
        <div className="mb-3">
          {!showHint ? (
            <button onClick={() => setShowHint(true)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-yellow-400 transition">
              <Eye size={12} /> 显示提示
            </button>
          ) : (
            <div className="flex items-start justify-between p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
              <p className="text-xs text-yellow-300/80">💡 {levelData.hint}</p>
              <button onClick={() => setShowHint(false)} className="text-gray-500 hover:text-gray-300 ml-2">
                <EyeOff size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="flex gap-2 mb-4">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleInject()}
            placeholder={`输入XSS payload... (示例: ${levelData.examplePayload})`}
            className="flex-1 px-4 py-2.5 bg-cyber-black/50 border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-red-500 font-mono"
          />
          <Button onClick={handleInject} className="!bg-red-500 text-white hover:!bg-red-400">
            <Play size={16} /> 注入
          </Button>
        </div>

        {/* Output / Result */}
        {output && (
          <motion.pre initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg text-xs whitespace-pre-wrap border font-mono ${
              solved
                ? 'bg-green-500/5 border-green-500/30 text-green-300'
                : output.includes('WAF拦截')
                  ? 'bg-red-500/5 border-red-500/30 text-red-300'
                  : 'bg-yellow-500/5 border-yellow-500/30 text-yellow-300'
            }`}>
            {output}
          </motion.pre>
        )}

        {/* Success notification */}
        {solved && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={18} className="text-green-400" />
              <span className="text-green-400 text-sm font-semibold">
                🎉 恭喜完成 {levelData.title}！（尝试 {attempts} 次）
              </span>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-gray-400">🛡️ <span className="text-green-400 font-medium">防御建议：</span>{levelData.defenseTip}</p>
            </div>
          </motion.div>
        )}

        {/* Quick fill buttons */}
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <p className="text-[10px] text-gray-600 mb-2">快速填充payload：</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              '<script>alert(1)</script>',
              '<img src=x onerror=alert(1)>',
              '<svg onload=alert(1)>',
              '\'"><script>alert(1)</script>',
              '<img src=x onmouseover=eval(atob("YWxlcnQoMSk="))>',
              '<body onload=alert(document.cookie)>',
            ].map((payload, i) => (
              <button key={i} onClick={() => setInput(payload)}
                className="text-[10px] px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400/70 hover:bg-red-500/20 hover:text-red-300 transition font-mono truncate max-w-[200px]">
                {payload.length > 35 ? payload.substring(0, 35) + '...' : payload}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Attack history */}
      {history.length > 0 && (
        <Card className="border-gray-700/50">
          <h4 className="text-sm text-gray-400 mb-2 flex items-center gap-2">
            <AlertTriangle size={14} /> 攻击历史 ({history.length})
          </h4>
          <div className="space-y-1 max-h-[150px] overflow-y-auto">
            {history.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-mono text-gray-500 p-1.5 rounded bg-cyber-black/30">
                <span className="text-gray-700 w-5 text-right">{history.length - i}.</span>
                <span className="truncate">{h}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
