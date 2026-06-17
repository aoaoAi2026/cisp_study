// ───── 接口定义 ─────
export interface Runtime {
  id: string; name: string; version: string; icon: string;
  color: string; extensions: string[]; template: string; hasJavac?: boolean;
}

export interface Snippet {
  id: string; language: string; category: string;
  title: string; description: string; code: string;
}

export interface ExecutionResult {
  success: boolean; language: string; stdout: string; stderr: string;
  exitCode: number; executionTime: number; killed?: boolean;
}

export interface HistoryEntry {
  id: string; language: string; code: string; stdin?: string;
  args?: string; result: ExecutionResult; timestamp: number;
}

export interface Tab {
  id: string; name: string; language: string;
  code: string; stdin: string; args: string;
  result: ExecutionResult | null;
}

export interface SavedProject {
  id: string; name: string; tabs: Tab[]; activeTabId: string;
  createdAt: number; updatedAt: number;
}

export interface ProjectSummary {
  id: string; name: string; tabCount: number;
  languages: string[]; updatedAt: number;
}

export interface AuditFinding {
  ruleId: string; severity: 'critical' | 'high' | 'medium' | 'low';
  line: number; column: number; description: string;
  suggestion: string; snippet: string;
}

export interface AuditResult {
  language: string; findings: AuditFinding[];
  summary: { total: number; critical: number; high: number; medium: number; low: number };
  scannedLines: number;
}

export interface BenchmarkResult {
  runs: { time: number; exitCode: number }[];
  min: number; max: number; avg: number; median: number; stddev: number;
  successRate: number;
}

export interface DiffLine {
  type: 'same' | 'added' | 'removed'; content: string;
  lineNumLeft?: number; lineNumRight?: number;
}
