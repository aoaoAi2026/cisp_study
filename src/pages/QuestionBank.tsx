import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Library, Search, ChevronRight,
  CheckCircle, Trash2, Target,
  Zap, BarChart3, AlertCircle,
  Lightbulb
} from 'lucide-react';
import { Card, Button, QuizQuestion } from '../components/UI';
import type { QuizQuestionData } from '../components/UI';
import { ProgressRing } from '../components/UI/ProgressRing';
import {
  filterBank, getRandomBankQuestions, getBankStats,
  type BankQuestion
} from '../data/questionBank';
import { saveData, loadData, removeData } from '../data/persistData';

// =========================== 类型 ===========================

interface WrongItem {
  questionId: string;
  question: string;
  options: string[];
  correctIndex: number;
  yourAnswer: number;
  explanation: string;
  domain: string;
  date: string;
  consecutiveCorrect: number; // 连续答对次数（3次自动移除）
}

type TabId = 'browse' | 'practice' | 'daily' | 'wrongbook';

interface DailyRecord { date: string; correct: number; total: number; }

// =========================== 动画 ===========================

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// =========================== 辅助 ===========================

function getDomainColor(domain: string): string {
  const map: Record<string, string> = {
    '信息安全保障': '#3b82f6', '信息安全监管': '#8b5cf6',
    '信息安全管理体系': '#06b6d4', '业务连续性': '#10b981',
    '安全工程与运营': '#06b6d4', '安全评估': '#f97316',
    '访问控制': '#6366f1', '加密技术': '#ec4899',
    '物理安全': '#f59e0b', '网络安全': '#0ea5e9',
    '应用安全': '#f43f5e', '安全开发': '#84cc16',
    '法律法规': '#ef4444', '等级保护': '#7c3aed',
    '安全管理': '#6b7280', '信息安全法规与标准': '#dc2626',
    '信息安全管理': '#0891b2', '信息安全技术': '#2563eb',
  };
  return map[domain] || '#6b7280';
}

function optionLabel(i: number): string {
  return String.fromCharCode(65 + i);
}

// =========================== 组件 ===========================

// =========================== 布局壳 ===========================

export const QuestionBank: React.FC = () => {
  const stats = useMemo(() => getBankStats(), []);
  const [wrongList, setWrongList] = useState<WrongItem[]>([]);

  useEffect(() => { loadData<WrongItem[]>('cisp_wrong_bank', []).then(setWrongList); }, []);

  const tabBtn = (to: string, end: boolean, label: string, icon: string) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
          isActive
            ? 'bg-cyber-green/20 text-cyber-green shadow-lg shadow-cyber-green/10'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`
      }
    >
      {icon} {label}
    </NavLink>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-orbitron text-2xl font-bold text-cyber-green">
            🎯 习题库
          </h1>
          <p className="text-gray-400 mt-1">
            {stats.total} 道 CISP 练习题 · 覆盖 {stats.domainList.length} 个知识域
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-gray-500">错题本</p>
            <p className="text-lg font-bold text-cyber-red">{wrongList.length} 题</p>
          </div>
        </div>
      </div>

      {/* Top-level navigation */}
      <div className="flex gap-1 p-1 rounded-xl bg-cyber-purple/20 overflow-x-auto">
        {tabBtn('/question-bank', true, '习题练习', '📚')}
        {tabBtn('/question-bank/quiz', false, '章节测验', '🎯')}
        {tabBtn('/question-bank/past-papers', false, '历年真题', '📝')}
        {tabBtn('/question-bank/mock-exam', false, '模拟考试', '🏆')}
      </div>

      <Outlet />
    </div>
  );
};

// =========================== 习题练习（原 5 标签页） ===========================

export const QuestionBankTabs: React.FC = () => {
  const navigate = useNavigate();
  const stats = useMemo(() => getBankStats(), []);

  // ---- tab 状态 ----
  const [tab, setTab] = useState<TabId>('browse');

  // ---- 错题本 ----
  const [wrongList, setWrongList] = useState<WrongItem[]>([]);
  const [wrongReviewIdx, setWrongReviewIdx] = useState(0);
  const [showWrongReview, setShowWrongReview] = useState(false);

  useEffect(() => { loadData<WrongItem[]>('cisp_wrong_bank', []).then(setWrongList); }, []);

  const saveWrongList = useCallback(async (list: WrongItem[]) => {
    setWrongList(list);
    await saveData('cisp_wrong_bank', list);
  }, []);

  const addWrong = useCallback(async (item: WrongItem) => {
    const merged = wrongList.filter(w => w.questionId !== item.questionId);
    const updated = [...merged, item];
    await saveWrongList(updated);
  }, [wrongList, saveWrongList]);

  const removeWrong = useCallback(async (questionId: string) => {
    const updated = wrongList.filter(w => w.questionId !== questionId);
    await saveWrongList(updated);
    if (updated.length < wrongReviewIdx) setWrongReviewIdx(Math.max(0, updated.length - 1));
  }, [wrongList, wrongReviewIdx, saveWrongList]);

  // ---- 每日一练 ----
  const [dailyRecord, setDailyRecord] = useState<DailyRecord | null>(null);
  useEffect(() => {
    loadData<DailyRecord>('cisp_daily_record', null).then(r => {
      if (r && r.date === new Date().toISOString().slice(0, 10)) setDailyRecord(r);
    });
  }, []);

  // ---- 题库浏览 ----
  const [browseDomains, setBrowseDomains] = useState<string[]>([]);
  const [browseKeyword, setBrowseKeyword] = useState('');
  const [browsePage, setBrowsePage] = useState(0);
  const browsePageSize = 30;

  const filtered = useMemo(() =>
    filterBank({ domains: browseDomains, keyword: browseKeyword }),
    [browseDomains, browseKeyword]
  );

  const pagedQuestions = useMemo(() =>
    filtered.slice(browsePage * browsePageSize, (browsePage + 1) * browsePageSize),
    [filtered, browsePage]
  );

  useEffect(() => setBrowsePage(0), [browseDomains, browseKeyword]);

  // ---- 逐题练习 ----
  const [practiceQuestions, setPracticeQuestions] = useState<BankQuestion[]>([]);
  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceAnswer, setPracticeAnswer] = useState<number | null>(null);
  const [practiceShowHint, setPracticeShowHint] = useState(false);
  const [practiceScore, setPracticeScore] = useState({ correct: 0, total: 0 });
  const [practiceActive, setPracticeActive] = useState(false);

  const startPractice = useCallback(() => {
    const qs = getRandomBankQuestions(50);
    setPracticeQuestions(qs);
    setPracticeIdx(0);
    setPracticeAnswer(null);
    setPracticeShowHint(false);
    setPracticeScore({ correct: 0, total: 0 });
    setPracticeActive(true);
  }, []);

  const answerPractice = useCallback((ans: number) => {
    if (practiceAnswer !== null) return;
    setPracticeAnswer(ans);
    const q = practiceQuestions[practiceIdx];
    const isCorrect = ans === q.correctIndex;
    setPracticeScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
    if (!isCorrect) {
      addWrong({
        questionId: q.id, question: q.question, options: q.options,
        correctIndex: q.correctIndex, yourAnswer: ans, explanation: q.explanation,
        domain: q.domain, date: new Date().toISOString(), consecutiveCorrect: 0,
      });
    }
  }, [practiceAnswer, practiceIdx, practiceQuestions, addWrong]);

  const nextPractice = useCallback(() => {
    if (practiceIdx < practiceQuestions.length - 1) {
      setPracticeIdx(i => i + 1);
      setPracticeAnswer(null);
      setPracticeShowHint(false);
    } else {
      setPracticeActive(false);
    }
  }, [practiceIdx, practiceQuestions.length]);

  // ---- 每日一练 ----
  const [dailyQuestions, setDailyQuestions] = useState<BankQuestion[]>([]);
  const [dailyIdx, setDailyIdx] = useState(0);
  const [dailyAnswer, setDailyAnswer] = useState<number | null>(null);
  const [dailyCorrect, setDailyCorrect] = useState(0);
  const [dailyActive, setDailyActive] = useState(false);

  const startDaily = useCallback(() => {
    const qs = getRandomBankQuestions(10);
    setDailyQuestions(qs);
    setDailyIdx(0);
    setDailyAnswer(null);
    setDailyCorrect(0);
    setDailyActive(true);
  }, []);

  const answerDaily = useCallback((ans: number) => {
    if (dailyAnswer !== null) return;
    setDailyAnswer(ans);
    const q = dailyQuestions[dailyIdx];
    const isCorrect = ans === q.correctIndex;
    const newCorrect = dailyCorrect + (isCorrect ? 1 : 0);
    setDailyCorrect(newCorrect);
    if (!isCorrect) {
      addWrong({
        questionId: q.id, question: q.question, options: q.options,
        correctIndex: q.correctIndex, yourAnswer: ans, explanation: q.explanation,
        domain: q.domain, date: new Date().toISOString(), consecutiveCorrect: 0,
      });
    }
    // 最后一题完成
    if (dailyIdx >= dailyQuestions.length - 1) {
      const today = new Date().toISOString().slice(0, 10);
      const rec: DailyRecord = { date: today, correct: newCorrect, total: dailyQuestions.length };
      setDailyRecord(rec);
      saveData('cisp_daily_record', rec);
    }
  }, [dailyAnswer, dailyIdx, dailyQuestions, dailyCorrect, addWrong]);

  const nextDaily = useCallback(() => {
    if (dailyIdx < dailyQuestions.length - 1) {
      setDailyIdx(i => i + 1);
      setDailyAnswer(null);
    } else {
      setDailyActive(false);
    }
  }, [dailyIdx, dailyQuestions.length]);

  // ---- 错题本分析 ----
  const wrongDomainStats = useMemo(() => {
    const map: Record<string, number> = {};
    wrongList.forEach(w => { map[w.domain] = (map[w.domain] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [wrongList]);

  // =========================== 渲染 ===========================

  const tabs: { id: TabId; label: string; icon: React.ReactNode; count?: string }[] = [
    { id: 'browse', label: '题库浏览', icon: <Library size={16} />, count: `${stats.total}题` },
    { id: 'practice', label: '逐题练习', icon: <Zap size={16} /> },
    { id: 'daily', label: '每日一练', icon: <Target size={16} /> },
    { id: 'wrongbook', label: '错题本', icon: <AlertCircle size={16} />, count: wrongList.length ? `${wrongList.length}` : undefined },
  ];

  return (
    <div className="space-y-6">
      {/* Sub Tab Bar */}
      <div className="flex gap-1 p-1 rounded-xl bg-cyber-purple/20 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              tab === t.id
                ? 'bg-cyber-green/20 text-cyber-green shadow-lg shadow-cyber-green/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {t.icon} {t.label}
            {t.count && <span className="text-xs text-gray-500 ml-0.5">({t.count})</span>}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* =================== 题库浏览 =================== */}
        {tab === 'browse' && (
          <motion.div key="browse" variants={fadeIn} initial="hidden" animate="visible" exit="hidden" className="space-y-4">
            {/* Filters */}
            <Card>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    value={browseKeyword}
                    onChange={e => setBrowseKeyword(e.target.value)}
                    placeholder="搜索题目关键词..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-cyber-purple/20 border border-cyber-purple/40 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyber-green/50"
                  />
                </div>
              </div>

              {/* Domain chips */}
              <div className="flex flex-wrap gap-1.5 mt-3 max-h-24 overflow-y-auto">
                <button
                  onClick={() => setBrowseDomains([])}
                  className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                    browseDomains.length === 0
                      ? 'bg-cyber-green/30 text-cyber-green border border-cyber-green/40'
                      : 'bg-cyber-purple/20 text-gray-400 border border-transparent hover:border-cyber-green/30'
                  }`}
                >
                  全部 ({filtered.length})
                </button>
                {stats.domainList.map(d => {
                  const count = stats.byDomain[d] || 0;
                  const active = browseDomains.includes(d);
                  return (
                    <button
                      key={d}
                      onClick={() => setBrowseDomains(active ? browseDomains.filter(x => x !== d) : [...browseDomains, d])}
                      className={`px-2.5 py-1 rounded-md text-xs transition-colors border ${
                        active
                          ? 'border-cyber-green/40 bg-cyber-green/20 text-cyber-green'
                          : 'border-transparent bg-cyber-purple/20 text-gray-400 hover:border-cyber-green/20'
                      }`}
                      style={active ? {} : { borderLeftColor: getDomainColor(d), borderLeftWidth: 2 }}
                    >
                      {d} <span className="text-gray-600">({count})</span>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Results */}
            <p className="text-sm text-gray-500">共 {filtered.length} 道匹配题目</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pagedQuestions.map((q, i) => (
                <QuestionCard key={q.id} q={q} idx={browsePage * browsePageSize + i + 1} />
              ))}
            </div>

            {/* Pagination */}
            {filtered.length > browsePageSize && (
              <div className="flex items-center justify-center gap-3">
                <Button size="sm" variant="outline" disabled={browsePage === 0}
                  onClick={() => setBrowsePage(p => p - 1)}>上一页</Button>
                <span className="text-sm text-gray-400">
                  {browsePage + 1} / {Math.ceil(filtered.length / browsePageSize)}
                </span>
                <Button size="sm" variant="outline"
                  disabled={(browsePage + 1) * browsePageSize >= filtered.length}
                  onClick={() => setBrowsePage(p => p + 1)}>下一页</Button>
              </div>
            )}
          </motion.div>
        )}

        {/* =================== 逐题练习 =================== */}
        {tab === 'practice' && (
          <motion.div key="practice" variants={fadeIn} initial="hidden" animate="visible" exit="hidden" className="space-y-4">
            {!practiceActive ? (
              <Card className="text-center py-12">
                <Zap size={48} className="mx-auto mb-4 text-cyber-gold" />
                <h3 className="text-lg font-medium text-white mb-2">逐题练习模式</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  随机抽取 50 题，一题一答，即时显示正误和解析。答错的题目自动进入错题本。
                </p>
                <div className="flex justify-center gap-4">
                  <Button onClick={startPractice}>开始练习 (50题)</Button>
                </div>
                {practiceScore.total > 0 && (
                  <div className="mt-4 flex justify-center gap-6 text-sm text-gray-400">
                    <span>上次: <span className="text-cyber-green">{practiceScore.correct}</span>/{practiceScore.total}</span>
                  </div>
                )}
              </Card>
            ) : (
              <PracticeView
                question={practiceQuestions[practiceIdx]}
                idx={practiceIdx} total={practiceQuestions.length}
                answer={practiceAnswer} showHint={practiceShowHint}
                onAnswer={answerPractice} onNext={nextPractice}
                onToggleHint={() => setPracticeShowHint(!practiceShowHint)}
                score={practiceScore}
              />
            )}
          </motion.div>
        )}

        {/* =================== 每日一练 =================== */}
        {tab === 'daily' && (
          <motion.div key="daily" variants={fadeIn} initial="hidden" animate="visible" exit="hidden" className="space-y-4">
            {!dailyActive ? (
              <Card className="text-center py-12">
                <Target size={48} className="mx-auto mb-4 text-cyber-gold" />
                <h3 className="text-lg font-medium text-white mb-2">每日一练</h3>
                <p className="text-gray-400 mb-2">每天 10 道随机题，保持做题手感</p>
                {dailyRecord && dailyRecord.date === new Date().toISOString().slice(0, 10) ? (
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <ProgressRing progress={(dailyRecord.correct / dailyRecord.total) * 100} size={80} strokeWidth={6}
                        color={dailyRecord.correct >= 7 ? '#00ff88' : '#ffaa00'} />
                    </div>
                    <p className="text-white font-medium">
                      今日已完成：<span className="text-cyber-green">{dailyRecord.correct}</span>/{dailyRecord.total}
                    </p>
                    <p className="text-xs text-gray-500">明天再来挑战吧 🔥</p>
                    <Button variant="outline" size="sm" onClick={startDaily}>再练一组</Button>
                  </div>
                ) : (
                  <Button onClick={startDaily}>开始今日练习</Button>
                )}
              </Card>
            ) : (
              <PracticeView
                question={dailyQuestions[dailyIdx]}
                idx={dailyIdx} total={dailyQuestions.length}
                answer={dailyAnswer} showHint={false}
                onAnswer={answerDaily} onNext={nextDaily}
                onToggleHint={() => {}}
                score={{ correct: dailyCorrect, total: dailyIdx + (dailyAnswer !== null ? 1 : 0) }}
                label="每日一练"
              />
            )}
          </motion.div>
        )}

        {/* =================== 错题本 =================== */}
        {tab === 'wrongbook' && (
          <motion.div key="wrongbook" variants={fadeIn} initial="hidden" animate="visible" exit="hidden" className="space-y-4">
            {wrongList.length === 0 ? (
              <Card className="text-center py-12">
                <CheckCircle size={48} className="mx-auto mb-4 text-cyber-green" />
                <h3 className="text-lg font-medium text-white mb-2">错题本是空的</h3>
                <p className="text-gray-400">开始练习后，答错的题目会自动出现在这里</p>
              </Card>
            ) : !showWrongReview ? (
              <>
                {/* Domain weakness analysis */}
                <Card>
                  <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                    <BarChart3 size={16} className="text-cyber-gold" />
                    薄弱知识域分析
                  </h3>
                  <div className="space-y-2">
                    {wrongDomainStats.slice(0, 5).map(([domain, count]) => (
                      <div key={domain} className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-28 truncate" title={domain}>{domain}</span>
                        <div className="flex-1 h-2 rounded-full bg-cyber-purple/30">
                          <div className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, (count / wrongDomainStats[0][1]) * 100)}%`,
                              backgroundColor: getDomainColor(domain),
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-8 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                  {wrongDomainStats.length > 0 && (
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" onClick={() => {
                        setTab('browse');
                        setBrowseDomains([wrongDomainStats[0][0]]);
                      }}>
                        专项突破「{wrongDomainStats[0][0]}」
                      </Button>
                    </div>
                  )}
                </Card>

                {/* Wrong list */}
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white flex items-center gap-2">
                    <XCircle size={16} className="text-cyber-red" />
                    全部错题 ({wrongList.length})
                  </h3>
                  <Button size="sm" variant="outline" onClick={async () => {
                    await removeData('cisp_wrong_bank');
                    setWrongList([]);
                  }}>清空全部</Button>
                </div>

                {wrongList.map((w, i) => (
                  <Card key={w.questionId} className="cursor-pointer hover:border-cyber-red/30 transition-colors"
                    onClick={() => { setShowWrongReview(true); setWrongReviewIdx(i); }}>
                    <div className="flex items-start gap-3">
                      <span className="text-xs text-gray-500 mt-0.5">{i + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white line-clamp-2">{w.question}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-1.5 py-0.5 rounded text-xs"
                            style={{ backgroundColor: getDomainColor(w.domain) + '30', color: getDomainColor(w.domain) }}>
                            {w.domain}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(w.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-500 flex-shrink-0" />
                    </div>
                  </Card>
                ))}
              </>
            ) : (
              <WrongReviewView
                item={wrongList[wrongReviewIdx]}
                index={wrongReviewIdx} total={wrongList.length}
                onPrev={() => setWrongReviewIdx(i => Math.max(0, i - 1))}
                onNext={() => setWrongReviewIdx(i => Math.min(wrongList.length - 1, i + 1))}
                onRemove={() => removeWrong(wrongList[wrongReviewIdx].questionId)}
                onBack={() => setShowWrongReview(false)}
                onMarkCorrect={async () => {
                  const item = wrongList[wrongReviewIdx];
                  const newConsecutive = item.consecutiveCorrect + 1;
                  if (newConsecutive >= 3) {
                    await removeWrong(item.questionId);
                  } else {
                    const updated = wrongList.map((w, i) =>
                      i === wrongReviewIdx ? { ...w, consecutiveCorrect: newConsecutive } : w
                    );
                    await saveWrongList(updated);
                  }
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// =========================== 子组件 ===========================

/** 题库浏览 - 题目卡片 */
const QuestionCard: React.FC<{ q: BankQuestion; idx: number }> = ({ q, idx }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card className="cursor-pointer hover:border-cyber-green/20 transition-colors" onClick={() => setExpanded(!expanded)}>
      <div className="flex items-start gap-2">
        <span className="text-xs text-gray-500 mt-0.5 flex-shrink-0">{idx}.</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white mb-2">{q.question}</p>
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span className="px-1.5 py-0.5 rounded text-xs"
              style={{ backgroundColor: getDomainColor(q.domain) + '30', color: getDomainColor(q.domain) }}>
              {q.domain}
            </span>
            <span className="px-1.5 py-0.5 rounded text-xs bg-cyber-purple/30 text-gray-400">
              {q.sourceLabel}
            </span>
          </div>
          {/* Options preview */}
          <div className="space-y-0.5 text-xs text-gray-500">
            {q.options.slice(0, 2).map((o, i) => (
              <p key={i}>{optionLabel(i)}. {o.length > 40 ? o.slice(0, 40) + '...' : o}</p>
            ))}
            {q.options.length > 2 && <p className="text-gray-600">...共 {q.options.length} 个选项</p>}
          </div>
          {/* Expanded explanation */}
          {expanded && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 pt-3 border-t border-cyber-purple/30">
              <p className="text-xs text-cyber-green mb-1">
                ✓ 正确答案: {optionLabel(q.correctIndex)}. {q.options[q.correctIndex]}
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">{q.explanation}</p>
            </motion.div>
          )}
        </div>
      </div>
    </Card>
  );
};

/** 练习视图（逐题练习 + 每日一练 公用） */
const PracticeView: React.FC<{
  question: BankQuestion;
  idx: number; total: number;
  answer: number | null; showHint: boolean;
  onAnswer: (ans: number) => void;
  onNext: () => void;
  onToggleHint: () => void;
  score: { correct: number; total: number };
  label?: string;
}> = ({ question, idx, total, answer, showHint, onAnswer, onNext, onToggleHint, score, label }) => {
  // 将 BankQuestion 映射为 QuizQuestionData
  const qData: QuizQuestionData = {
    id: question.id,
    question: question.question,
    options: question.options,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
  };

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-sm text-gray-400">
            {label || '逐题练习'} · {idx + 1}/{total}
          </span>
          <span className="ml-3 text-xs text-gray-500">
            正确: <span className="text-cyber-green">{score.correct}</span>/{score.total}
          </span>
        </div>
        <div className="w-24 h-1.5 rounded-full bg-cyber-purple/30">
          <div className="h-full bg-cyber-green/50 rounded-full transition-all"
            style={{ width: `${((idx + 1) / total) * 100}%` }} />
        </div>
      </div>

      {/* 使用共享 QuizQuestion 组件 */}
      <QuizQuestion
        question={qData}
        selectedIndex={answer}
        showResult={answer !== null}
        onSelect={onAnswer}
        expanded={showHint}
        onToggleExpand={onToggleHint}
      />

      {/* Next */}
      {answer !== null && (
        <div className="flex justify-end mt-4">
          <Button onClick={onNext}>
            {idx < total - 1 ? '下一题' : '完成'} <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </Card>
  );
};

/** 错题回顾 */
const WrongReviewView: React.FC<{
  item: WrongItem;
  index: number; total: number;
  onPrev: () => void; onNext: () => void;
  onRemove: () => void; onBack: () => void;
  onMarkCorrect: () => void;
}> = ({ item, index, total, onPrev, onNext, onRemove, onBack, onMarkCorrect }) => (
  <Card>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={onBack}>← 列表</Button>
        <span className="text-sm text-gray-400">{index + 1}/{total}</span>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={onMarkCorrect}
          title="标记为已掌握（连续3次答对自动移除）">我会了</Button>
        <Button size="sm" variant="outline" className="text-red-400 border-red-400/30" onClick={onRemove}>
          <Trash2 size={14} className="mr-1" />移除
        </Button>
      </div>
    </div>

    <QuizQuestion
      question={{
        id: item.questionId,
        question: item.question,
        options: item.options,
        correctIndex: item.correctIndex,
        explanation: item.explanation,
      }}
      selectedIndex={item.yourAnswer}
      showResult={true}
      onSelect={() => {}}
      readOnly
      variant="compact"
    />

    <div className="flex justify-between mt-4">
      <Button size="sm" variant="outline" disabled={index === 0} onClick={onPrev}>上一题</Button>
      <Button size="sm" disabled={index >= total - 1} onClick={onNext}>下一题</Button>
    </div>
  </Card>
);

export default QuestionBank;
