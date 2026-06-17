import type { DiffLine } from './types';

export function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

export function computeDiff(left: string, right: string): DiffLine[] {
  const la = left.split('\n'), ra = right.split('\n');
  const m = la.length, n = ra.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = la[i - 1] === ra[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);

  const result: DiffLine[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && la[i - 1] === ra[j - 1]) {
      result.unshift({ type: 'same', content: la[i - 1], lineNumLeft: i, lineNumRight: j });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'added', content: ra[j - 1], lineNumRight: j });
      j--;
    } else {
      result.unshift({ type: 'removed', content: la[i - 1], lineNumLeft: i });
      i--;
    }
  }
  return result;
}

export function isTabular(text: string): boolean {
  const lines = text.trim().split('\n').filter(l => l.trim());
  if (lines.length < 2) return false;
  const hasTabs = lines.filter(l => l.includes('\t')).length >= lines.length * 0.8;
  const hasMultipleSpaces = lines.filter(l => /\s{3,}/.test(l)).length >= lines.length * 0.8;
  return hasTabs || hasMultipleSpaces;
}

export function parseTable(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.trim().split('\n').filter(l => l.trim());
  const sep = text.includes('\t') ? '\t' : /\s{2,}/;
  const data = lines.map(l => l.split(sep).map(c => c.trim()).filter(c => c));
  const maxCols = Math.max(...data.map(r => r.length));
  return { headers: data[0], rows: data.slice(1).map(r => [...r, ...Array(maxCols - r.length).fill('')]) };
}

export function parseErrorLines(stderr: string): number[] {
  const lines: number[] = [];
  const patterns = [/line\s+(\d+)/gi, /:(\d+):(\d+)/g, /\.java:(\d+)/g];
  for (const p of patterns) {
    let m; while ((m = p.exec(stderr)) !== null) lines.push(parseInt(m[1], 10));
  }
  return [...new Set(lines)].filter(n => n > 0);
}

export function stats(nums: number[]) {
  if (!nums.length) return { min: 0, max: 0, avg: 0, median: 0, stddev: 0 };
  const s = [...nums].sort((a, b) => a - b);
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  const mid = Math.floor(s.length / 2);
  const median = s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
  const variance = nums.reduce((sum, n) => sum + (n - avg) ** 2, 0) / nums.length;
  return { min: s[0], max: s[s.length - 1], avg: Math.round(avg * 100) / 100, median, stddev: Math.round(Math.sqrt(variance) * 100) / 100 };
}
