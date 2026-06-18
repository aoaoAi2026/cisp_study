import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Square, RotateCcw, Copy, Check, Loader2,
  Clock, Terminal, Trash2, Maximize2,
  Minimize2, AlertTriangle, Info, PanelLeftClose, PanelLeftOpen,
  BookOpen, X, Keyboard, FileDown, Eraser, Brush,
  Shield, Gauge, GitCompare, Save, FolderOpen, Plus, Columns2,
} from 'lucide-react';
import Editor from '@monaco-editor/react';

import type { Runtime, Snippet, HistoryEntry, Tab, SavedProject, ProjectSummary, AuditResult, BenchmarkResult } from './CodeRunner/types';
import { SNIPPETS, SNIPPET_CATEGORIES, API_BASE } from './CodeRunner/snippets';
import { genId, computeDiff, isTabular, parseTable, parseErrorLines, stats } from './CodeRunner/utils';
import { SecurityAudit } from './CodeRunner/SecurityAudit';
import { PerfBenchmark } from './CodeRunner/PerfBenchmark';
import { ExecutionHistoryPanel } from './CodeRunner/ExecutionHistory';
import { CodeSnippetsPanel } from './CodeRunner/CodeSnippets';

// ───── 主组件 ─────
export const CodeRunner: React.FC<{ embedded?: boolean }> = ({ embedded = false }) => {
  // ── 运行时数据 ──
  const [runtimes, setRuntimes] = useState<Runtime[]>([]);
  const [runtimesLoading, setRuntimesLoading] = useState(true);
  const [runtimesError, setRuntimesError] = useState('');

  // ── 多标签页系统 (A) ──
  const [tabs, setTabs] = useState<Tab[]>(() => {
    try {
      const saved = localStorage.getItem('coderunner_tabs');
      if (saved) { const arr = JSON.parse(saved); if (arr.length) return arr; }
    } catch (_) {}
    return [{ id: genId(), name: '代码 1', language: 'python', code: '', stdin: '', args: '', result: null }];
  });
  const [activeTabId, setActiveTabId] = useState(() => tabs[0]?.id || '');
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingTabName, setEditingTabName] = useState('');

  // 持久化 tabs
  const persistTabs = useCallback((t: Tab[]) => {
    try { localStorage.setItem('coderunner_tabs', JSON.stringify(t)); } catch (_) {}
  }, []);

  const updateActiveTab = useCallback((partial: Partial<Tab>) => {
    setTabs(prev => {
      const next = prev.map(t => t.id === activeTabId ? { ...t, ...partial } : t);
      persistTabs(next);
      return next;
    });
  }, [activeTabId, persistTabs]);

  const addTab = useCallback((lang?: string) => {
    const rt = runtimes.find(r => r.id === (lang || activeTab.language));
    const newTab: Tab = {
      id: genId(), name: `代码 ${tabs.length + 1}`,
      language: lang || activeTab.language,
      code: rt?.template || '', stdin: '', args: '', result: null,
    };
    setTabs(prev => { const n = [...prev, newTab]; persistTabs(n); return n; });
    setActiveTabId(newTab.id);
  }, [activeTab, runtimes, tabs.length, persistTabs]);

  const closeTab = useCallback((tabId: string) => {
    setTabs(prev => {
      if (prev.length <= 1) return prev;
      const idx = prev.findIndex(t => t.id === tabId);
      const next = prev.filter(t => t.id !== tabId);
      persistTabs(next);
      if (tabId === activeTabId) {
        const newIdx = Math.min(idx, next.length - 1);
        setActiveTabId(next[newIdx]?.id || next[0]?.id);
      }
      return next;
    });
  }, [activeTabId, persistTabs]);

  const renameTab = useCallback((tabId: string, name: string) => {
    setTabs(prev => { const n = prev.map(t => t.id === tabId ? { ...t, name } : t); persistTabs(n); return n; });
  }, [persistTabs]);

  // ── 视图 & UI 状态 ──
  const [viewMode, setViewMode] = useState<'stacked' | 'split'>('stacked'); // B. 分屏
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState<'output' | 'audit' | 'benchmark'>('output');

  // ── 执行状态 ──
  const [isRunning, setIsRunning] = useState(false);
  const [showSnippets, setShowSnippets] = useState(false);
  const [snippetCategory, setSnippetCategory] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try { const s = localStorage.getItem('coderunner_history'); return s ? JSON.parse(s) : []; } catch (_) { return []; }
  });

  // ── C. 安全审计 ──
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  // ── D. 性能基准 ──
  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkResult | null>(null);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [benchmarkRuns, setBenchmarkRuns] = useState(10);

  // ── E. 代码 Diff ──
  const [showDiff, setShowDiff] = useState(false);
  const [diffLeft, setDiffLeft] = useState<HistoryEntry | null>(null);
  const [diffRight, setDiffRight] = useState<HistoryEntry | null>(null);

  // ── F. 命名项目 ──
  const [showProjects, setShowProjects] = useState(false);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [projectName, setProjectName] = useState('');
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // ── Refs ──
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);
  const execIdRef = useRef<string | null>(null);
  const codeRef = useRef(activeTab?.code || '');
  codeRef.current = activeTab?.code || '';
  const langRef = useRef(activeTab?.language || 'python');
  langRef.current = activeTab?.language || 'python';
  const stdinRef = useRef(activeTab?.stdin || '');
  stdinRef.current = activeTab?.stdin || '';
  const argsRef = useRef(activeTab?.args || '');
  argsRef.current = activeTab?.args || '';
  const inited = useRef(false);
  const pendingSnippetRef = useRef<Snippet | null>(null);

  // ── 加载运行时 ──
  useEffect(() => {
    fetch(`${API_BASE}/runtimes`)
      .then(r => r.json())
      .then(data => {
        const list: Runtime[] = data.runtimes || [];
        setRuntimes(list);
        if (list.length > 0 && !inited.current) {
          inited.current = true;
          setTabs(prev => {
            if (prev.length === 1 && !prev[0].code) {
              const tpl = list[0]?.template || '';
              const updated = [{ ...prev[0], code: tpl, language: list[0].id }];
              persistTabs(updated);
              return updated;
            }
            return prev;
          });
        }
      })
      .catch(err => setRuntimesError('无法获取运行环境: ' + err.message))
      .finally(() => setRuntimesLoading(false));
  }, [persistTabs]);

  // ── 快捷键 ──
  const runCodeRef = useRef<() => void>(() => {});
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); runCodeRef.current(); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // ── 切换语言 ──
  const switchLanguage = useCallback((langId: string) => {
    const rt = runtimes.find(r => r.id === langId);
    if (!rt) return;
    updateActiveTab({ language: langId, code: activeTab.code || rt.template, result: null });
  }, [activeTab, runtimes, updateActiveTab]);

  // ── 代码执行 ──
  const runCode = useCallback(async () => {
    const currentCode = codeRef.current;
    const currentLang = langRef.current;
    const currentStdin = stdinRef.current;
    const currentArgs = argsRef.current;
    if (!currentCode.trim() || isRunning) return;
    setIsRunning(true);
    updateActiveTab({ result: null });

    const start = Date.now();
    try {
      const res = await fetch(`${API_BASE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: currentLang, code: currentCode, stdin: currentStdin || undefined, args: currentArgs || undefined }),
      });
      const data: any = await res.json();
      execIdRef.current = data.execId || null;

      updateActiveTab({ result: data });
      setHistory(prev => {
        const entry: HistoryEntry = {
          id: Date.now().toString(36), language: currentLang, code: currentCode,
          stdin: currentStdin || undefined, args: currentArgs || undefined,
          result: data, timestamp: Date.now(),
        };
        const trimmed = [entry, ...prev].slice(0, 50);
        try { localStorage.setItem('coderunner_history', JSON.stringify(trimmed)); } catch (_) {}
        return trimmed;
      });

      // I. 错误行标注
      if (!data.success && data.stderr) {
        const errLines = parseErrorLines(data.stderr);
        if (errLines.length && editorRef.current) {
          const d = errLines.map(lineNum => ({
            range: new (window as any).monaco.Range(lineNum, 1, lineNum, 1),
            options: {
              isWholeLine: true,
              glyphMarginClassName: 'error-glyph',
              glyphMarginHoverMessage: { value: `第 ${lineNum} 行编译/运行错误` },
              className: 'error-line-highlight',
            },
          }));
          decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, d);
        }
      }

      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err: any) {
      updateActiveTab({
        result: { success: false, language: currentLang, stdout: '', stderr: `网络错误: ${err.message}`, exitCode: 1, executionTime: Date.now() - start },
      });
    } finally {
      setIsRunning(false);
      execIdRef.current = null;
    }
  }, [isRunning, updateActiveTab]);
  runCodeRef.current = runCode;

  // ── 停止执行 ──
  const handleStop = async () => {
    setIsRunning(false);
    if (execIdRef.current) {
      try { await fetch(`${API_BASE}/cancel/${execIdRef.current}`, { method: 'POST' }); } catch (_) {}
      execIdRef.current = null;
    }
  };

  // ── C. 安全审计 ──
  const handleAudit = async () => {
    if (!activeTab.code.trim()) return;
    setIsAuditing(true);
    setRightPanelTab('audit');
    try {
      const res = await fetch(`${API_BASE}/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: activeTab.language, code: activeTab.code }),
      });
      const data: AuditResult = await res.json();
      setAuditResult(data);

      // 标注审计发现问题行
      if (editorRef.current && data.findings.length) {
        const d = data.findings.map(f => ({
          range: new (window as any).monaco.Range(f.line, f.column, f.line, f.column + 1),
          options: {
            isWholeLine: true,
            glyphMarginClassName: f.severity === 'critical' ? 'audit-critical' : f.severity === 'high' ? 'audit-high' : f.severity === 'medium' ? 'audit-medium' : 'audit-low',
            glyphMarginHoverMessage: { value: `[${f.severity.toUpperCase()}] ${f.description}\n建议: ${f.suggestion}` },
            className: `audit-line-${f.severity}`,
          },
        }));
        decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, d);
      }
    } catch (err: any) {
      setAuditResult({ language: activeTab.language, findings: [], summary: { total: 0, critical: 0, high: 0, medium: 0, low: 0 }, scannedLines: 0 });
    } finally {
      setIsAuditing(false);
    }
  };

  // ── D. 性能基准测试 ──
  const handleBenchmark = async () => {
    if (!activeTab.code.trim() || isRunning) return;
    setIsBenchmarking(true);
    setRightPanelTab('benchmark');
    setBenchmarkResult(null);
    const times: { time: number; exitCode: number }[] = [];

    for (let i = 0; i < benchmarkRuns; i++) {
      const start = Date.now();
      try {
        const res = await fetch(`${API_BASE}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language: activeTab.language, code: activeTab.code, stdin: activeTab.stdin || undefined, args: activeTab.args || undefined }),
        });
        const data = await res.json();
        times.push({ time: data.executionTime, exitCode: data.exitCode });
      } catch {
        times.push({ time: Date.now() - start, exitCode: -1 });
      }
    }

    const s = stats(times.map(t => t.time));
    const successCount = times.filter(t => t.exitCode === 0).length;
    setBenchmarkResult({
      runs: times, ...s, successRate: Math.round((successCount / times.length) * 100),
    });
    setIsBenchmarking(false);
  };

  // ── F. 项目操作 ──
  const loadProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const res = await fetch(`${API_BASE}/projects`);
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (_) {
      setProjects([]);
    } finally {
      setIsLoadingProjects(false);
      setShowProjects(true);
    }
  };

  const saveProject = async () => {
    if (!projectName.trim()) return;
    try {
      await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName.trim(), tabs, activeTabId }),
      });
      setProjectName('');
      setShowProjects(false);
    } catch (_) {}
  };

  const loadProject = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`);
      const data: SavedProject = await res.json();
      setTabs(data.tabs);
      persistTabs(data.tabs);
      setActiveTabId(data.activeTabId);
      setShowProjects(false);
    } catch (_) {}
  };

  const deleteProject = async (id: string) => {
    try {
      await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (_) {}
  };

  // ── 重置/清除/复制 ──
  const handleReset = () => {
    const rt = runtimes.find(r => r.id === activeTab.language);
    updateActiveTab({ code: rt?.template || '', stdin: '', args: '', result: null });
  };

  const clearOutput = () => {
    updateActiveTab({ result: null });
    decorationsRef.current = editorRef.current?.deltaDecorations(decorationsRef.current, []) || [];
    setAuditResult(null);
    setBenchmarkResult(null);
  };

  const copyOutput = () => {
    const r = activeTab.result;
    const text = r ? (r.stdout || '') + (r.stderr ? '\n--- STDERR ---\n' + r.stderr : '') : '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extMap: Record<string, string> = { python: '.py', javascript: '.js', java: '.java' };
    const blob = new Blob([activeTab.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `code_${Date.now()}${extMap[activeTab.language] || '.txt'}`;
    a.click(); URL.revokeObjectURL(url);
  };

  const handleFormat = () => {
    editorRef.current?.getAction('editor.action.formatDocument')?.run();
  };

  const loadFromHistory = (entry: HistoryEntry) => {
    updateActiveTab({ language: entry.language, code: entry.code, stdin: entry.stdin || '', args: entry.args || '', result: entry.result });
  };

  const clearHistory = () => { setHistory([]); localStorage.removeItem('coderunner_history'); };

  // ── 代码片段 ──
  useEffect(() => {
    const snippet = pendingSnippetRef.current;
    if (!snippet) return;
    if (snippet.language === activeTab.language) {
      updateActiveTab({ code: snippet.code });
      pendingSnippetRef.current = null;
    }
  }, [activeTab.language, updateActiveTab]);

  const loadSnippet = (snippet: Snippet) => {
    setShowSnippets(false);
    setSnippetCategory(null);
    if (snippet.language !== activeTab.language) {
      pendingSnippetRef.current = snippet;
      switchLanguage(snippet.language);
    } else {
      updateActiveTab({ code: snippet.code });
    }
  };

  // ── 全屏 ──
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => editorRef.current?.layout(), 200);
  };
  useEffect(() => {
    if (!isFullscreen) return;
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsFullscreen(false); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [isFullscreen]);

  const activeRuntime = runtimes.find(r => r.id === activeTab.language);

  // 片段筛选
  const filteredSnippets = SNIPPETS.filter(s => s.language === activeTab.language && (!snippetCategory || s.category === snippetCategory));

  // Diff 计算
  const diffLines = (diffLeft && diffRight) ? computeDiff(diffLeft.code, diffRight.code) : [];

  // H. 表格检测
  const outputIsTabular = activeTab.result?.stdout ? isTabular(activeTab.result.stdout) : false;
  const tableData = outputIsTabular && activeTab.result?.stdout ? parseTable(activeTab.result.stdout) : null;

  const severityColor = (s: string) => s === 'critical' ? 'text-red-400 bg-red-500/10 border-red-500/30' : s === 'high' ? 'text-orange-400 bg-orange-500/10 border-orange-500/30' : s === 'medium' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' : 'text-blue-400 bg-blue-500/10 border-blue-500/30';

  return (
    <div className={`${embedded && !isFullscreen ? 'h-full' : 'min-h-screen'} bg-[#0a0f18] text-gray-100 ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`${isFullscreen ? 'h-screen flex flex-col p-3' : embedded ? 'h-full' : 'max-w-7xl mx-auto px-4 py-6'}`}>
        {/* 头部 */}
        {!isFullscreen && !embedded && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-green to-emerald-500 flex items-center justify-center">
                <Terminal size={22} className="text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyber-green to-emerald-400 bg-clip-text text-transparent">代码运行中心</h1>
                <p className="text-gray-500 text-sm">多标签编辑 · 安全审计 · 性能基准 · 分屏模式 · Ctrl+Enter 运行</p>
              </div>
            </div>
          </motion.div>
        )}

        <div className={`${isFullscreen ? 'flex-1 flex flex-col min-h-0' : `grid gap-3 ${showHistory && !isFullscreen ? 'lg:grid-cols-[1fr,280px]' : 'grid-cols-1'}`}`}>
          {/* 主区域 */}
          <div className={`space-y-3 ${isFullscreen ? 'flex-1 flex flex-col min-h-0' : ''}`}>
            {/* A. 标签栏 */}
            <div className="flex items-center gap-1 bg-[#111827]/80 border border-white/10 rounded-xl p-2 overflow-x-auto">
              {tabs.map(tab => (
                <div key={tab.id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all cursor-pointer whitespace-nowrap group ${
                  tab.id === activeTabId ? 'bg-cyber-green/15 text-cyber-green border border-cyber-green/20' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                }`}>
                  {editingTabId === tab.id ? (
                    <input
                      className="bg-transparent border-b border-cyber-green/50 outline-none w-20 text-center text-xs"
                      value={editingTabName}
                      onChange={e => setEditingTabName(e.target.value)}
                      onBlur={() => { renameTab(tab.id, editingTabName || tab.name); setEditingTabId(null); }}
                      onKeyDown={e => { if (e.key === 'Enter') { renameTab(tab.id, editingTabName || tab.name); setEditingTabId(null); } }}
                      autoFocus
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    <span
                      onClick={() => setActiveTabId(tab.id)}
                      onDoubleClick={() => { setEditingTabId(tab.id); setEditingTabName(tab.name); }}
                      className="text-xs max-w-[100px] truncate"
                      title={tab.name}
                    >
                      {tab.name}
                    </span>
                  )}
                  {tab.result && (
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${tab.result.success ? 'bg-green-400' : tab.result.killed ? 'bg-yellow-400' : 'bg-red-400'}`} />
                  )}
                  {tabs.length > 1 && (
                    <button onClick={e => { e.stopPropagation(); closeTab(tab.id); }} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={() => addTab()} className="p-1.5 rounded-lg text-gray-500 hover:text-cyber-green hover:bg-white/5 transition-all flex-shrink-0" title="新建标签页">
                <Plus size={16} />
              </button>
            </div>

            {/* 工具栏 */}
            <div className="glass-card rounded-xl p-3 border border-white/10 bg-[#111827]/80">
              <div className="flex items-center justify-between flex-wrap gap-2">
                {/* 运行时选择 */}
                <div className="flex items-center gap-2">
                  {runtimesLoading ? (
                    <div className="flex items-center gap-2 text-gray-500"><Loader2 size={14} className="animate-spin" /><span className="text-xs">检测中...</span></div>
                  ) : runtimesError ? (
                    <div className="flex items-center gap-2 text-red-400"><AlertTriangle size={14} /><span className="text-xs">{runtimesError}</span></div>
                  ) : (
                    <div className="flex bg-[#1a2235] rounded-lg p-1 gap-1">
                      {runtimes.map(rt => (
                        <button key={rt.id} onClick={() => switchLanguage(rt.id)}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                            activeTab.language === rt.id ? 'bg-cyber-green/20 text-cyber-green' : 'text-gray-400 hover:text-gray-200'
                          }`}
                        ><span>{rt.icon}</span><span className="hidden sm:inline">{rt.name}</span></button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 操作按钮组 */}
                <div className="flex items-center gap-1 flex-wrap">
                  {/* B. 分屏切换 */}
                  <button onClick={() => setViewMode(v => v === 'stacked' ? 'split' : 'stacked')}
                    className={`p-1.5 rounded-lg transition-colors ${viewMode === 'split' ? 'text-cyber-green bg-cyber-green/10' : 'text-gray-400 hover:text-gray-200'}`}
                    title={viewMode === 'split' ? '切换为上下布局' : '切换为左右分屏'}
                  ><Columns2 size={16} /></button>
                  <span className="w-px h-5 bg-white/10 mx-0.5" />

                  {/* C. 安全审计 */}
                  <button onClick={handleAudit} disabled={isAuditing || !activeTab.code.trim()}
                    className={`p-1.5 rounded-lg transition-colors ${rightPanelTab === 'audit' && auditResult ? 'text-purple-400 bg-purple-500/10' : 'text-gray-400 hover:text-purple-400'}`}
                    title="安全代码审计"
                  >{isAuditing ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}</button>

                  {/* D. 性能基准 */}
                  <button onClick={handleBenchmark} disabled={isBenchmarking || !activeTab.code.trim()}
                    className={`p-1.5 rounded-lg transition-colors ${rightPanelTab === 'benchmark' && benchmarkResult ? 'text-cyan-400 bg-cyan-500/10' : 'text-gray-400 hover:text-cyan-400'}`}
                    title="性能基准测试"
                  ><Gauge size={16} /></button>

                  {/* E. 代码Diff */}
                  <button onClick={() => { setShowDiff(true); setDiffLeft(null); setDiffRight(null); }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-yellow-400 transition-colors" title="代码Diff对比"
                  ><GitCompare size={16} /></button>
                  <span className="w-px h-5 bg-white/10 mx-0.5" />

                  {/* F. 项目保存/加载 */}
                  <button onClick={loadProjects} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-400 transition-colors" title="项目保存/加载">
                    <FolderOpen size={16} /></button>

                  <button onClick={() => setShowSnippets(true)} className="p-1.5 rounded-lg text-gray-400 hover:text-amber-400 transition-colors" title="代码片段库">
                    <BookOpen size={16} /></button>
                  <button onClick={handleReset} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 transition-colors" title="重置">
                    <RotateCcw size={16} /></button>
                  <button onClick={handleFormat} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-400 transition-colors" title="格式化">
                    <Brush size={16} /></button>
                  <button onClick={handleDownload} disabled={!activeTab.code.trim()} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-400 transition-colors disabled:opacity-30" title="下载代码">
                    <FileDown size={16} /></button>
                  <button onClick={() => setShowHistory(!showHistory)}
                    className={`p-1.5 rounded-lg transition-colors ${showHistory ? 'text-cyber-green bg-cyber-green/10' : 'text-gray-400'}`}
                    title="历史面板"
                  >{showHistory ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}</button>
                  <button onClick={toggleFullscreen} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 transition-colors" title="全屏">
                    {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</button>

                  {/* 运行按钮 */}
                  <button onClick={runCode} disabled={isRunning || !activeTab.code.trim()}
                    className={`px-4 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-all ml-1 ${
                      isRunning ? 'bg-yellow-600/30 text-yellow-400' : !activeTab.code.trim() ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyber-green to-emerald-500 text-black hover:shadow-lg hover:shadow-cyber-green/25 active:scale-95'
                    }`}
                  >{isRunning ? <><Loader2 size={14} className="animate-spin" />执行中</> : <><Play size={14} />运行 <span className="text-xs opacity-60 hidden sm:inline">⌃↵</span></>}</button>
                  {isRunning && <button onClick={handleStop} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10" title="停止"><Square size={14} /></button>}
                </div>
              </div>

              {/* 运行时信息栏 */}
              {activeRuntime && (
                <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400" />{activeRuntime.name} {activeRuntime.version}</span>
                  <span className="flex items-center gap-1"><Clock size={10} />超时: {activeRuntime.id === 'java' ? '15s' : '10s'}</span>
                  <span className="flex items-center gap-1"><Keyboard size={10} />Ctrl+Enter 运行</span>
                  {activeRuntime.id === 'java' && !activeRuntime.hasJavac && <span className="flex items-center gap-1 text-yellow-400"><AlertTriangle size={10} />javac 未检测到</span>}
                  <span className="flex items-center gap-1 text-amber-600/70 ml-auto"><AlertTriangle size={10} />代码拥有完整系统权限，请勿执行不受信任的代码</span>
                </div>
              )}
            </div>

            {/* G. stdin + 命令行参数输入 */}
            <div className="glass-card rounded-xl border border-white/10 bg-[#111827]/80 p-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">📥 标准输入 (stdin)</span>
                  </div>
                  <textarea value={activeTab.stdin} onChange={e => updateActiveTab({ stdin: e.target.value })}
                    placeholder="input() / Scanner 读取的数据，每行一个值..."
                    rows={2} className="w-full bg-[#0a0e14] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-gray-300 font-mono resize-none focus:outline-none focus:border-cyber-green/30 placeholder-gray-600"
                  />
                </div>
                {/* G. 命令行参数 */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">⚙️ 命令行参数 (CLI Args)</span>
                  </div>
                  <input value={activeTab.args} onChange={e => updateActiveTab({ args: e.target.value })}
                    placeholder="空格分隔的参数，如: --debug --port 8080 input.txt"
                    className="w-full bg-[#0a0e14] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-gray-300 font-mono focus:outline-none focus:border-cyber-green/30 placeholder-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* B. 分屏：代码编辑器 + 输出面板 */}
            <div className={`${viewMode === 'split' ? 'grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1 min-h-0' : 'space-y-3'}`}>
              {/* 代码编辑器 */}
              <motion.div layout className="rounded-xl overflow-hidden border border-white/10 bg-[#111827] flex flex-col"
                style={{ minHeight: isFullscreen ? 0 : embedded ? '300px' : (viewMode === 'split' ? '500px' : '400px'), flex: isFullscreen ? 1 : undefined }}>
                <Editor
                  height={isFullscreen ? '100%' : embedded ? '300px' : (viewMode === 'split' ? '500px' : '400px')}
                  language={activeTab.language === 'javascript' ? 'javascript' : activeTab.language === 'java' ? 'java' : 'python'}
                  value={activeTab.code}
                  onChange={v => updateActiveTab({ code: v || '' })}
                  theme="vs-dark"
                  onMount={editor => {
                    editorRef.current = editor;
                    editor.addAction({ id: 'run-code', label: '运行代码', keybindings: [2048 | 3], run: () => runCodeRef.current() });
                  }}
                  options={{
                    fontSize: isFullscreen ? 15 : 14,
                    fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',Consolas,monospace",
                    minimap: { enabled: false }, lineNumbers: 'on', renderWhitespace: 'selection',
                    tabSize: 4, bracketPairColorization: { enabled: true }, automaticLayout: true,
                    scrollBeyondLastLine: false, padding: { top: 16 }, wordWrap: 'on', glyphMargin: true,
                  }}
                />
              </motion.div>

              {/* 右侧面板：输出 / 审计 / 基准 */}
              <motion.div layout ref={outputRef} className="rounded-xl border border-white/10 bg-[#111827] overflow-hidden flex flex-col"
                style={{ minHeight: viewMode === 'split' ? 0 : '120px', maxHeight: viewMode === 'split' ? undefined : '400px' }}>
                {/* 面板标签 */}
                <div className="flex items-center border-b border-white/5 bg-[#0d1520]">
                  {(['output', 'audit', 'benchmark'] as const).map(panel => (
                    <button key={panel} onClick={() => setRightPanelTab(panel)}
                      className={`px-4 py-2.5 text-xs font-medium transition-all border-b-2 ${
                        rightPanelTab === panel ? 'border-cyber-green text-cyber-green' : 'border-transparent text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {panel === 'output' ? <>📤 输出结果 {activeTab.result && <span className="ml-1 text-green-400">●</span>}</>
                        : panel === 'audit' ? <>🛡️ 安全审计 {auditResult && <span className={`ml-1 ${auditResult.summary.total > 0 ? 'text-red-400' : 'text-green-400'}`}>●</span>}</>
                        : <>⚡ 基准测试 {benchmarkResult && <span className="ml-1 text-cyan-400">●</span>}</>}
                    </button>
                  ))}
                  <div className="ml-auto flex items-center gap-1 pr-2">
                    {activeTab.result && <button onClick={clearOutput} className="p-1 rounded text-gray-500 hover:text-gray-300" title="清除"><Eraser size={12} /></button>}
                    {activeTab.result && (activeTab.result.stdout || activeTab.result.stderr) && (
                      <button onClick={copyOutput} className="p-1 rounded text-gray-500 hover:text-gray-300" title="复制">{copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}</button>
                    )}
                  </div>
                </div>

                <div className="p-4 font-mono text-sm overflow-auto flex-1 bg-[#0a0e14]">
                  {/* 输出面板 */}
                  {rightPanelTab === 'output' && (
                    isRunning ? <div className="flex items-center gap-2 text-yellow-400"><Loader2 size={14} className="animate-spin" />执行中...</div>
                    : activeTab.result ? (
                      <div className="space-y-2">
                        {activeTab.result.stdout && (
                          outputIsTabular && tableData ? (
                            /* H. 表格渲染 */
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs border-collapse">
                                <thead>
                                  <tr className="bg-[#1a2235]">{tableData.headers.map((h, i) => <th key={i} className="border border-white/10 px-2 py-1 text-left text-cyber-green">{h}</th>)}</tr>
                                </thead>
                                <tbody>
                                  {tableData.rows.map((row, ri) => (
                                    <tr key={ri} className="hover:bg-white/5">
                                      {row.map((cell, ci) => <td key={ci} className="border border-white/5 px-2 py-0.5 text-gray-300">{cell}</td>)}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : <pre className="text-green-300 whitespace-pre-wrap break-words leading-relaxed">{activeTab.result.stdout}</pre>
                        )}
                        {activeTab.result.stderr && <pre className="text-red-400 whitespace-pre-wrap break-words leading-relaxed border-t border-red-500/10 pt-2 mt-2">{activeTab.result.stderr}</pre>}
                        {!activeTab.result.stdout && !activeTab.result.stderr && <span className="text-gray-500 italic">(无输出)</span>}
                        {activeTab.result.executionTime != null && (
                          <div className="text-xs text-gray-500 pt-2 border-t border-white/5 mt-2">
                            执行耗时: {activeTab.result.executionTime}ms · 退出码: {activeTab.result.exitCode}
                            {activeTab.result.killed ? ' · 进程被终止' : ''}
                          </div>
                        )}
                      </div>
                    ) : <div className="flex items-center gap-2 text-gray-600"><Info size={14} /><span>点击「运行」或 Ctrl+Enter 查看输出</span></div>
                  )}

                  {/* C. 审计面板 */}
                  {rightPanelTab === 'audit' && (
                    <SecurityAudit isAuditing={isAuditing} auditResult={auditResult} severityColor={severityColor} />
                  )}

                  {/* D. 基准测试面板 */}
                  {rightPanelTab === 'benchmark' && (
                    <PerfBenchmark
                      isBenchmarking={isBenchmarking}
                      benchmarkResult={benchmarkResult}
                      benchmarkRuns={benchmarkRuns}
                      onBenchmarkRunsChange={setBenchmarkRuns}
                      onStartBenchmark={handleBenchmark}
                      onReturnOutput={() => setRightPanelTab('output')}
                      hasCode={!!activeTab.code.trim()}
                    />
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* 历史侧边栏 */}
          {!isFullscreen && (
            <ExecutionHistoryPanel
              show={showHistory}
              history={history}
              runtimes={runtimes}
              diffLeft={diffLeft}
              diffRight={diffRight}
              onLoad={loadFromHistory}
              onClear={clearHistory}
              onSetDiffLeft={setDiffLeft}
              onSetDiffRight={setDiffRight}
              onShowDiff={() => setShowDiff(true)}
            />
          )}
        </div>
      </div>

      {/* ───── 弹窗：代码片段库 ───── */}
      <CodeSnippetsPanel
        show={showSnippets}
        onClose={() => setShowSnippets(false)}
        language={activeTab.language}
        languageIcon={activeRuntime?.icon || ''}
        snippets={filteredSnippets}
        categories={SNIPPET_CATEGORIES.filter(cat => SNIPPETS.some(s => s.language === activeTab.language && s.category === cat))}
        selectedCategory={snippetCategory}
        onCategoryChange={setSnippetCategory}
        onLoadSnippet={loadSnippet}
      />

      {/* ───── E. 弹窗：代码 Diff ───── */}
      <AnimatePresence>
        {showDiff && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDiff(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="glass-card bg-[#111827] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#0d1520]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center"><GitCompare size={16} className="text-black" /></div>
                  <div><h3 className="text-sm font-semibold text-gray-100">代码 Diff 对比</h3><p className="text-xs text-gray-500">从执行历史中选择两次记录进行对比</p></div>
                </div>
                <button onClick={() => { setShowDiff(false); setDiffLeft(null); setDiffRight(null); }} className="p-2 rounded-full text-gray-400 hover:text-gray-200"><X size={18} /></button>
              </div>

              {!diffLeft || !diffRight ? (
                <div className="p-8 text-center">
                  <p className="text-gray-400 mb-4">请从执行历史中分别选择左侧和右侧代码</p>
                  <div className="grid grid-cols-2 gap-4 text-left max-h-[50vh] overflow-auto">
                    {history.slice(0, 20).map(entry => (
                      <div key={entry.id} className="flex items-center justify-between bg-[#0a0f18] rounded-lg p-2 border border-white/5">
                        <div className="min-w-0">
                          <span className="text-xs text-gray-400">{new Date(entry.timestamp).toLocaleTimeString()} · {entry.language}</span>
                          <p className="text-xs text-gray-500 truncate">{entry.code.substring(0, 60)}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0 ml-2">
                          <button onClick={() => setDiffLeft(entry)} className={`text-xs px-2 py-1 rounded ${diffLeft?.id === entry.id ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-gray-500'}`}>L</button>
                          <button onClick={() => setDiffRight(entry)} className={`text-xs px-2 py-1 rounded ${diffRight?.id === entry.id ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-gray-500'}`}>R</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="overflow-auto max-h-[70vh] font-mono text-xs">
                  <div className="grid grid-cols-2 divide-x divide-white/5">
                    {/* 左侧信息栏 */}
                    <div className="px-3 py-1.5 bg-[#0d1520] text-gray-500 flex items-center justify-between border-b border-white/5">
                      <span>{new Date(diffLeft.timestamp).toLocaleTimeString()} · {diffLeft.language}</span>
                      <button onClick={() => setDiffLeft(null)} className="text-gray-600 hover:text-red-400"><X size={12} /></button>
                    </div>
                    {/* 右侧信息栏 */}
                    <div className="px-3 py-1.5 bg-[#0d1520] text-gray-500 flex items-center justify-between border-b border-white/5">
                      <span>{new Date(diffRight.timestamp).toLocaleTimeString()} · {diffRight.language}</span>
                      <button onClick={() => setDiffRight(null)} className="text-gray-600 hover:text-red-400"><X size={12} /></button>
                    </div>
                  </div>
                  <div className="divide-y divide-white/5">
                    {diffLines.map((dl, i) => (
                      <div key={i} className={`grid grid-cols-2 divide-x divide-white/5 ${dl.type === 'added' ? 'bg-green-500/10' : dl.type === 'removed' ? 'bg-red-500/10' : ''}`}>
                        <div className={`px-3 py-0.5 ${dl.type === 'removed' ? 'bg-red-500/10 text-red-300' : dl.type === 'same' ? 'text-gray-400' : 'text-gray-700'}`}>
                          <span className="text-gray-600 mr-2 select-none">{dl.lineNumLeft || ''}</span>
                          {dl.type !== 'added' ? dl.content : ''}
                        </div>
                        <div className={`px-3 py-0.5 ${dl.type === 'added' ? 'bg-green-500/10 text-green-300' : dl.type === 'same' ? 'text-gray-400' : 'text-gray-700'}`}>
                          <span className="text-gray-600 mr-2 select-none">{dl.lineNumRight || ''}</span>
                          {dl.type !== 'removed' ? dl.content : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───── F. 弹窗：项目管理 ───── */}
      <AnimatePresence>
        {showProjects && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowProjects(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="glass-card bg-[#111827] border border-white/10 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#0d1520]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center"><FolderOpen size={16} className="text-black" /></div>
                  <div><h3 className="text-sm font-semibold text-gray-100">项目管理</h3><p className="text-xs text-gray-500">保存当前标签页到项目，或加载已有项目</p></div>
                </div>
                <button onClick={() => setShowProjects(false)} className="p-2 rounded-full text-gray-400 hover:text-gray-200"><X size={18} /></button>
              </div>

              {/* 保存当前 */}
              <div className="px-5 py-3 border-b border-white/5 bg-[#0a0f18]/50">
                <div className="flex items-center gap-2">
                  <Save size={14} className="text-gray-500" />
                  <span className="text-xs text-gray-400">保存当前工作区 ({tabs.length} 个标签页):</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <input value={projectName} onChange={e => setProjectName(e.target.value)}
                    placeholder="输入项目名称..."
                    className="flex-1 bg-[#1a2235] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-200 outline-none focus:border-blue-400/30"
                    onKeyDown={e => e.key === 'Enter' && saveProject()}
                  />
                  <button onClick={saveProject} disabled={!projectName.trim()}
                    className="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors disabled:opacity-30">
                    保存
                  </button>
                </div>
              </div>

              {/* 项目列表 */}
              <div className="overflow-auto max-h-[45vh] p-4 space-y-2">
                {isLoadingProjects ? (
                  <div className="flex items-center justify-center py-8 text-gray-500"><Loader2 size={20} className="animate-spin" /></div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-8 text-gray-600"><FolderOpen size={24} className="mx-auto mb-2 opacity-50" /><p className="text-sm">暂无保存的项目</p></div>
                ) : projects.map(p => (
                  <div key={p.id} className="flex items-center justify-between bg-[#0a0f18] rounded-lg p-3 border border-white/5 hover:border-blue-400/20 transition-all group">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-gray-200">{p.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">{p.tabCount} 个标签页</span>
                        <span className="text-xs text-gray-600">{p.languages.join(', ')}</span>
                        <span className="text-xs text-gray-700">{new Date(p.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => loadProject(p.id)} className="p-1.5 rounded text-blue-400 hover:bg-blue-500/10" title="加载"><FolderOpen size={14} /></button>
                      <button onClick={() => deleteProject(p.id)} className="p-1.5 rounded text-red-400 hover:bg-red-500/10" title="删除"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS */}
      <style>{`
        .glass-card { backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2d3748; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #4a5568; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .error-line-highlight { background: rgba(239,68,68,0.15); }
        .error-glyph { background: rgba(239,68,68,0.8); width: 4px !important; margin-left: 5px; border-radius: 2px; }
        .audit-line-critical { background: rgba(239,68,68,0.15); }
        .audit-line-high { background: rgba(249,115,22,0.15); }
        .audit-line-medium { background: rgba(234,179,8,0.15); }
        .audit-line-low { background: rgba(59,130,246,0.1); }
        .audit-critical { background: rgba(239,68,68,0.8); width: 4px !important; margin-left: 5px; border-radius: 2px; }
        .audit-high { background: rgba(249,115,22,0.8); width: 4px !important; margin-left: 5px; border-radius: 2px; }
        .audit-medium { background: rgba(234,179,8,0.8); width: 4px !important; margin-left: 5px; border-radius: 2px; }
        .audit-low { background: rgba(59,130,246,0.5); width: 4px !important; margin-left: 5px; border-radius: 2px; }
      `}</style>
    </div>
  );
};

export default CodeRunner;
