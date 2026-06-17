import { useState, useCallback } from 'react';

interface CodeExecResult {
  output: string;
  exitCode?: number;
  executionTime?: number;
}

export function useCodeExecutor() {
  const [codeOutput, setCodeOutput] = useState<string | null>(null);
  const [codeRunning, setCodeRunning] = useState(false);

  const execute = useCallback(async (code: string, lang: string): Promise<void> => {
    setCodeRunning(true);
    setCodeOutput(null);

    let language = lang.toLowerCase();
    if (language === 'py') language = 'python';
    if (language === 'js' || language === 'typescript') language = 'javascript';

    if (!['python', 'javascript', 'java'].includes(language)) {
      if (language === 'bash') {
        setCodeOutput('[错误] Bash/Shell 需要在终端环境中执行，请使用本地终端或 CodeLab。\n后端支持的语言: Python / JavaScript / Java');
      } else if (language === 'sql') {
        setCodeOutput('[错误] SQL 需要连接数据库执行，后端暂不支持。\n后端支持的语言: Python / JavaScript / Java');
      } else {
        setCodeOutput(`[提示] ${lang} 语言暂不支持后端执行，仅支持: Python / JavaScript / Java`);
      }
      setCodeRunning(false);
      return;
    }

    try {
      const resp = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code }),
      });
      const data = await resp.json();
      if (resp.ok) {
        const out = [
          data.stdout ? data.stdout.trimEnd() : '',
          data.stderr ? `\n[stderr]\n${data.stderr.trimEnd()}` : '',
          `\n--- 退出码: ${data.exitCode} | 耗时: ${data.executionTime}ms ---`,
        ].filter(Boolean).join('');
        setCodeOutput(out || '(无输出)');
      } else {
        setCodeOutput(`[请求失败] ${data.error || '未知错误'}\n${data.detail || ''}`);
      }
    } catch (e: any) {
      setCodeOutput(`[网络错误] ${e.message}\n请确认后端服务已启动 (node backend/server.js)`);
    } finally {
      setCodeRunning(false);
    }
  }, []);

  return { codeOutput, setCodeOutput, codeRunning, execute };
}
