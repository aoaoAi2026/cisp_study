// 纯前端代码执行 Hook - 使用 Pyodide (Python) 和原生 eval (JavaScript)
// 支持离线/打包成 APK 后仍能运行代码

import { useState, useEffect, useCallback, useRef } from 'react';

// Pyodide 类型定义
declare global {
  interface Window {
    loadPyodide: (config: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<any>;
  runPython: (code: string) => any;
  setStdout: (options: { batched: (msg: string) => void }) => void;
  setStderr: (options: { batched: (msg: string) => void }) => void;
  globals: { get: (name: string) => any; set: (name: string, value: any) => void };
  loadPackage: (packages: string[]) => Promise<void>;
}

export interface ExecutionResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTime: number;
  language: string;
}

export interface RuntimeInfo {
  id: string;
  name: string;
  version: string;
  template: string;
}

let pyodideInstance: PyodideInterface | null = null;
let pyodideLoading: Promise<PyodideInterface> | null = null;
let pyodideLoadingResolve: ((pyodide: PyodideInterface) => void) | null = null;

const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/';

// 加载 Pyodide
async function loadPyodide(): Promise<PyodideInterface> {
  if (pyodideInstance) return pyodideInstance;
  
  if (pyodideLoading) return pyodideLoading;
  
  pyodideLoading = new Promise(async (resolve, reject) => {
    pyodideLoadingResolve = resolve;
    
    try {
      // 加载 Pyodide 脚本
      if (!window.loadPyodide) {
        await new Promise<void>((res, rej) => {
          const script = document.createElement('script');
          script.src = `${PYODIDE_CDN}pyodide.js`;
          script.onload = () => res();
          script.onerror = () => rej(new Error('Failed to load Pyodide script'));
          document.head.appendChild(script);
        });
      }
      
      // 初始化 Pyodide
      const pyodide = await window.loadPyodide({ indexURL: PYODIDE_CDN });
      pyodideInstance = pyodide;
      resolve(pyodide);
    } catch (err) {
      pyodideLoading = null;
      reject(err);
    }
  });
  
  return pyodideLoading;
}

// 执行 Python 代码
async function executePython(code: string, stdin?: string): Promise<ExecutionResult> {
  const start = Date.now();
  let stdout = '';
  let stderr = '';
  
  try {
    const pyodide = await loadPyodide();
    
    // 设置 stdout/stderr 捕获
    pyodide.setStdout({ batched: (msg) => { stdout += msg + '\n'; } });
    pyodide.setStderr({ batched: (msg) => { stderr += msg + '\n'; } });
    
    // 如果有 stdin 输入，设置 sys.stdin
    if (stdin) {
      await pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdin = StringIO(${JSON.stringify(stdin)})
      `);
    }
    
    // 执行代码
    await pyodide.runPythonAsync(code);
    
    // 去除末尾多余的换行
    stdout = stdout.replace(/\n+$/, '');
    stderr = stderr.replace(/\n+$/, '');
    
    return {
      success: true,
      stdout,
      stderr,
      exitCode: 0,
      executionTime: Date.now() - start,
      language: 'python',
    };
  } catch (err: any) {
    let errorMsg = err.message || String(err);
    
    // 清理 Pyodide 错误信息
    if (errorMsg.includes('PythonError:')) {
      errorMsg = errorMsg.replace(/^PythonError: Traceback.*?\n/, '').replace(/^PythonError: /, '');
    }
    
    return {
      success: false,
      stdout,
      stderr: errorMsg,
      exitCode: 1,
      executionTime: Date.now() - start,
      language: 'python',
    };
  }
}

// 执行 JavaScript 代码
async function executeJavaScript(code: string, stdin?: string): Promise<ExecutionResult> {
  const start = Date.now();
  let stdout = '';
  let stderr = '';
  
  // 创建模拟 console
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.log = (...args) => {
    stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') + '\n';
  };
  console.error = (...args) => {
    stderr += args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') + '\n';
  };
  console.warn = (...args) => {
    stdout += '[WARN] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') + '\n';
  };
  
  // 如果有 stdin，使用 prompt 模拟（但不太可靠，仅用于简单场景）
  if (stdin) {
    // 将 stdin 分割成行
    const stdinLines = stdin.split('\n');
    let lineIndex = 0;
    const originalPrompt = window.prompt;
    window.prompt = (msg?: string) => {
      if (lineIndex < stdinLines.length) {
        return stdinLines[lineIndex++];
      }
      return null;
    };
  }
  
  try {
    // 使用 Function 构造器执行代码，更安全一些
    const fn = new Function(`
      return (async () => {
        ${code}
      })();
    `);
    
    await fn();
    
    // 清理
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
    if (stdin) {
      (window as any).prompt = undefined;
    }
    
    stdout = stdout.replace(/\n+$/, '');
    stderr = stderr.replace(/\n+$/, '');
    
    return {
      success: true,
      stdout,
      stderr,
      exitCode: 0,
      executionTime: Date.now() - start,
      language: 'javascript',
    };
  } catch (err: any) {
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
    if (stdin) {
      (window as any).prompt = undefined;
    }
    
    return {
      success: false,
      stdout,
      stderr: err.message || String(err),
      exitCode: 1,
      executionTime: Date.now() - start,
      language: 'javascript',
    };
  }
}

// 前端运行时列表
const FRONTEND_RUNTIMES: RuntimeInfo[] = [
  {
    id: 'python',
    name: 'Python',
    version: '3.11 (Pyodide)',
    template: '# Python 代码示例\nprint("Hello, World!")\n\n# 计算\nresult = 2 + 2\nprint(f"2 + 2 = {result}")\n\n# 列表操作\nfruits = ["apple", "banana", "cherry"]\nfor fruit in fruits:\n    print(f"I like {fruit}")',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    version: 'ES2022 (Node.js风格)',
    template: '// JavaScript 代码示例\nconsole.log("Hello, World!");\n\n// 计算\nconst result = 2 + 2;\nconsole.log(`2 + 2 = ${result}`);\n\n// 数组操作\nconst fruits = ["apple", "banana", "cherry"];\nfruits.forEach(fruit => {\n    console.log(`I like ${fruit}`);\n});',
  },
];

export function useFrontendExecutor() {
  const [runtimes] = useState<RuntimeInfo[]>(FRONTEND_RUNTIMES);
  const [isLoading, setIsLoading] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [pyodideError, setPyodideError] = useState<string | null>(null);

  // 预加载 Pyodide
  useEffect(() => {
    loadPyodide()
      .then(() => setPyodideReady(true))
      .catch((err) => setPyodideError(err.message));
  }, []);

  // 执行代码
  const execute = useCallback(async (
    language: string,
    code: string,
    stdin?: string
  ): Promise<ExecutionResult> => {
    setIsLoading(true);
    
    try {
      if (language === 'python') {
        return await executePython(code, stdin);
      } else if (language === 'javascript') {
        return await executeJavaScript(code, stdin);
      } else {
        return {
          success: false,
          stdout: '',
          stderr: `不支持的语言: ${language}`,
          exitCode: 1,
          executionTime: 0,
          language,
        };
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    runtimes,
    execute,
    isLoading,
    pyodideReady,
    pyodideError,
    isSupported: (lang: string) => ['python', 'javascript'].includes(lang),
  };
}

export default useFrontendExecutor;
