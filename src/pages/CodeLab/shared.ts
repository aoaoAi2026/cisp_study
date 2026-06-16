import React, { useState, useCallback } from 'react';
import {
  Search, Terminal, Database, Shield, Network, Lock, Bug,
  Key, Wifi, Activity, Cloud, Trophy,
  Terminal as TerminalIcon,
} from 'lucide-react';

// ───── 常量 ─────
export const difficultyColors = {
  easy: 'green',
  medium: 'gold',
  hard: 'red',
} as const;

export const categoryIcons: Record<string, any> = {
  'sql-injection': Database,
  'xss-demo': Terminal,
  'password-crack': Shield,
  'log-analysis': Network,
  'hash-demo': Lock,
  'encrypt-decrypt': Shield,
  'firewall-rules': Network,
  '信息收集': Search,
  '漏洞检测': Bug,
  '密码攻击': Key,
  '无线安全': Wifi,
  '逆向工程': TerminalIcon,
  '应急响应': Activity,
  '数据包分析': Network,
  '加密解密': Lock,
  'Web安全': Shield,
  '云安全': Cloud,
  'CTF工具': Trophy,
  '隐私保护': Lock,
};

// ───── 通用 Pyodide Hook ─────
export function usePyodide() {
  const pyodideRef = React.useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const initPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true);
    try {
      if (!(window as any).loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Pyodide 加载失败，请检查网络'));
          document.head.appendChild(script);
        });
      }
      pyodideRef.current = await (window as any).loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
      });
      setReady(true);
      return pyodideRef.current;
    } finally {
      setLoading(false);
    }
  }, []);

  const runCode = useCallback(async (code: string) => {
    const pyodide = await initPyodide();
    let output = '';
    pyodide.setStdout({ batched: (text: string) => { output += text + '\n'; } });
    pyodide.setStderr({ batched: (text: string) => { output += '[stderr] ' + text + '\n'; } });
    await pyodide.runPythonAsync(code);
    return output || '(代码执行完毕，无输出)';
  }, [initPyodide]);

  return { ready, loading, initPyodide, runCode };
}
