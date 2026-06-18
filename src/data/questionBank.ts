// ============================================================
// 统一习题库 - 合并 mockExamPool / pastPapers / learningData
// ============================================================
import { mockExamPool, MockQuestion } from './mockExamPool';
import { getAllPastPaperQuestions } from './pastPapers';
import type { PastPaperQuestion } from './pastPapers';

// ---------- 统一题目接口 ----------
export interface BankQuestion {
  /** 全局唯一 ID */
  id: string;
  /** 题目文本 */
  question: string;
  /** 选项列表 */
  options: string[];
  /** 正确答案索引 (0-based) */
  correctIndex: number;
  /** 解析 */
  explanation: string;
  /** 知识域 */
  domain: string;
  /** 来源 */
  source: 'mockExam' | 'pastPapers' | 'learningData';
  /** 来源标签（如 "2024 CISP 卷一"） */
  sourceLabel: string;
}

// ---------- 知识域列表（按 CISP 分类） ----------
export const questionDomains = [
  '信息安全保障',
  '信息安全监管',
  '信息安全管理体系',
  '业务连续性',
  '安全工程与运营',
  '安全评估',
  '访问控制',
  '加密技术',
  '物理安全',
  '网络安全',
  '应用安全',
  '安全开发',
  '法律法规',
  '等级保护',
  '安全管理',
  '信息安全法规与标准',
  '信息安全管理',
  '信息安全技术',
] as const;

export type QuestionDomain = (typeof questionDomains)[number];

// ---------- 数据归一化 ----------

function normalizeMockExam(): BankQuestion[] {
  return mockExamPool.map((q: MockQuestion) => {
    const options = q.options.map(o => o.text);
    const correctIndex = q.options.findIndex(o => o.label === q.correct);
    return {
      id: `mock-${q.id}`,
      question: q.question,
      options,
      correctIndex: correctIndex >= 0 ? correctIndex : 0,
      explanation: q.explanation,
      domain: q.domain,
      source: 'mockExam' as const,
      sourceLabel: '模拟考试题库',
    };
  });
}

function normalizePastPapers(): BankQuestion[] {
  return getAllPastPaperQuestions().map((q: PastPaperQuestion) => ({
    id: q.id,
    question: q.question,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
    domain: q.domain,
    source: 'pastPapers' as const,
    sourceLabel: `${q.year}年 ${q.session}`,
  }));
}

/** 全量统一题库（懒加载缓存） */
let _cached: BankQuestion[] | null = null;

export function getFullBank(): BankQuestion[] {
  if (_cached) return _cached;
  _cached = [...normalizeMockExam(), ...normalizePastPapers()];
  return _cached;
}

// ---------- 筛选函数 ----------

export function filterBank(filters: {
  domains?: string[];
  sources?: BankQuestion['source'][];
  keyword?: string;
}): BankQuestion[] {
  let result = getFullBank();
  if (filters.domains?.length) {
    result = result.filter(q => filters.domains!.includes(q.domain));
  }
  if (filters.sources?.length) {
    result = result.filter(q => filters.sources!.includes(q.source));
  }
  if (filters.keyword?.trim()) {
    const kw = filters.keyword.trim().toLowerCase();
    result = result.filter(q =>
      q.question.toLowerCase().includes(kw) ||
      q.options.some(o => o.toLowerCase().includes(kw))
    );
  }
  return result;
}

export function getBankByDomain(domain: string): BankQuestion[] {
  return getFullBank().filter(q => q.domain === domain);
}

export function getRandomBankQuestions(count: number): BankQuestion[] {
  const all = getFullBank();
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// ---------- 统计 ----------

export function getBankStats() {
  const all = getFullBank();
  const byDomain: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  all.forEach(q => {
    byDomain[q.domain] = (byDomain[q.domain] || 0) + 1;
    bySource[q.sourceLabel] = (bySource[q.sourceLabel] || 0) + 1;
  });
  return {
    total: all.length,
    byDomain,
    bySource,
    domainList: Object.keys(byDomain).sort(),
  };
}
