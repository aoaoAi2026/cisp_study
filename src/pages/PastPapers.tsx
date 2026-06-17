import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  CheckCircle,
  XCircle,
  Calendar,
  Shuffle,
  Filter,
  BookOpen,
  Trophy,
  RefreshCw,
  Server,
  ExternalLink,
  Brain,
  Eye,
  RotateCcw,
} from 'lucide-react';
import { Card, Badge, Button, QuizQuestion } from '../components/UI';
import {
  pastPapers,
  cispDomains,
  getRandomQuestions,
  getQuestionsByDomain,
  getPastPaperStats,
  type PastPaperQuestion
} from '../data/pastPapers';

export const PastPapers: React.FC = () => {
  const [activePaper, setActivePaper] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'paper' | 'domain' | 'random' | 'flashcard'>('paper');
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [randomCount, setRandomCount] = useState(50);
  const [randomQuestions, setRandomQuestions] = useState<PastPaperQuestion[]>([]);

  const stats = getPastPaperStats();

  // ---- 闪卡模式状态 ----
  const allFlashQuestions: PastPaperQuestion[] = useMemo(() => {
    const out: PastPaperQuestion[] = [];
    for (const paper of pastPapers) {
      for (const q of paper.questions) out.push(q);
    }
    return out;
  }, []);
  const [flashIdx, setFlashIdx] = useState(() => Math.floor(Math.random() * Math.max(1, allFlashQuestions.length)));
  const [flashShowAnswer, setFlashShowAnswer] = useState(false);
  const [flashSelected, setFlashSelected] = useState<number | null>(null);
  const [flashStats, setFlashStats] = useState({ answered: 0, correct: 0 });
  const [flashSeen, setFlashSeen] = useState<Set<number>>(new Set());

  const flashCurrent = allFlashQuestions[flashIdx] || allFlashQuestions[0];
  useEffect(() => {
    const raw = localStorage.getItem('cisp_flash_stats');
    if (raw) { try { setFlashStats(JSON.parse(raw)); } catch { /* ignore */ } }
  }, []);
  useEffect(() => {
    localStorage.setItem('cisp_flash_stats', JSON.stringify(flashStats));
  }, [flashStats]);

  const flashNext = () => {
    if (allFlashQuestions.length === 0) return;
    let idx = Math.floor(Math.random() * allFlashQuestions.length);
    if (allFlashQuestions.length > 1) {
      while (idx === flashIdx) idx = Math.floor(Math.random() * allFlashQuestions.length);
    }
    setFlashIdx(idx);
    setFlashShowAnswer(false);
    setFlashSelected(null);
    setFlashSeen((s) => new Set(s).add(idx));
  };

  const flashSelect = (i: number) => {
    if (flashShowAnswer) return;
    setFlashSelected(i);
    setFlashShowAnswer(true);
    setFlashStats((s) => ({
      answered: s.answered + 1,
      correct: s.correct + (i === flashCurrent.correctIndex ? 1 : 0),
    }));
  };

  const flashReset = () => {
    setFlashStats({ answered: 0, correct: 0 });
    setFlashSeen(new Set());
    flashNext();
  };

  const flashProgressPct = allFlashQuestions.length > 0
    ? Math.round((flashSeen.size / Math.min(50, allFlashQuestions.length)) * 100) : 0;

  // 获取当前显示的题目
  const getCurrentQuestions = (): (PastPaperQuestion & { uniqueId: number })[] => {
    if (viewMode === 'random' && randomQuestions.length > 0) {
      return randomQuestions.map((q, i) => ({ ...q, uniqueId: i }));
    }
    if (viewMode === 'domain' && selectedDomain) {
      return getQuestionsByDomain(selectedDomain).map((q, i) => ({ ...q, uniqueId: i }));
    }
    return pastPapers[activePaper].questions.map((q, i) => ({ ...q, uniqueId: i }));
  };

  const currentQuestions = getCurrentQuestions();

  const handleAnswer = (uniqueId: number, answer: string) => {
    setAnswers({ ...answers, [uniqueId]: answer });
  };

  const calculateScore = () => {
    let correct = 0;
    currentQuestions.forEach(q => {
      if (answers[q.uniqueId] === q.options[q.correctIndex]) correct++;
    });
    return { correct, total: currentQuestions.length };
  };

  const resetQuiz = () => {
    setAnswers({});
    setShowResults(false);
    setExpandedQuestion(null);
  };

  const switchPaper = (index: number) => {
    setActivePaper(index);
    resetQuiz();
    setViewMode('paper');
  };

  const generateRandomQuiz = () => {
    setRandomQuestions(getRandomQuestions(randomCount));
    resetQuiz();
    setViewMode('random');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '基础': return 'bg-green-500/20 text-green-400';
      case '中等': return 'bg-yellow-500/20 text-yellow-400';
      case '中高': return 'bg-orange-500/20 text-orange-400';
      case '高': return 'bg-red-500/20 text-red-400';
      default: return 'bg-cyber-purple/30 text-gray-400';
    }
  };

  const getDomainColor = (domain: string): string => {
    const map: Record<string, string> = {
      '信息安全保障': '#3b82f6', '信息安全监管': '#8b5cf6',
      '信息安全管理体系': '#06b6d4', '业务连续性': '#10b981',
      '安全工程与运营': '#06b6d4', '安全评估': '#f97316',
      '访问控制': '#6366f1', '加密技术': '#ec4899',
      '物理安全': '#f59e0b', '网络安全': '#0ea5e9',
      '应用安全': '#f43f5e', '安全开发': '#84cc16',
      '法律法规': '#ef4444', '等级保护': '#7c3aed',
      '安全管理': '#6b7280', '信息安全概念': '#3b82f6',
      '信息安全技术': '#2563eb', '密码学': '#ec4899',
      '系统安全': '#f43f5e', '通信安全': '#0ea5e9',
    };
    return map[domain] || '#6b7280';
  };

  return (
    <div className="space-y-6">

      {/* View Mode Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => { setViewMode('paper'); resetQuiz(); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'paper'
                  ? 'bg-cyber-green/20 text-cyber-green shadow-lg shadow-cyber-green/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText size={16} />
              历年试卷
            </button>
            <button
              onClick={() => { setViewMode('domain'); resetQuiz(); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'domain'
                  ? 'bg-cyber-green/20 text-cyber-green shadow-lg shadow-cyber-green/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen size={16} />
              知识域
            </button>
            <button
              onClick={generateRandomQuiz}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'random'
                  ? 'bg-cyber-green/20 text-cyber-green shadow-lg shadow-cyber-green/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shuffle size={16} />
              随机练习
            </button>
            <button
              onClick={() => { setViewMode('flashcard'); resetQuiz(); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'flashcard'
                  ? 'bg-cyber-green/20 text-cyber-green shadow-lg shadow-cyber-green/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Brain size={16} />
              闪卡复习
            </button>
          </div>
        </Card>
      </motion.div>

        {/* Paper Selection - Only in paper mode */}
        {viewMode === 'paper' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card>
              <h2 className="font-medium text-white mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-cyber-green" />
                选择年份
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {pastPapers.map((paper, index) => (
                  <button
                    key={paper.id}
                    onClick={() => switchPaper(index)}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                      activePaper === index && viewMode === 'paper'
                        ? 'border-cyber-green/50 bg-cyber-green/10'
                        : 'border-cyber-purple/30 hover:border-cyber-green/30 hover:bg-white/5'
                    }`}
                  >
                    <div className="font-medium text-white">{paper.year}年 {paper.month}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {paper.questions.length} 题 · {paper.difficulty}
                    </div>
                    <div className="text-xs text-cyber-green mt-2">
                      {paper.title.split('·')[1] || paper.title}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Domain Selection - Only in domain mode */}
        {viewMode === 'domain' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card>
              <h2 className="font-medium text-white mb-4 flex items-center gap-2">
                <Filter size={16} className="text-cyber-green" />
                选择知识域
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {cispDomains.map(domain => {
                  const count = stats.byDomain[domain] || 0;
                  return (
                    <button
                      key={domain}
                      onClick={() => {
                        setSelectedDomain(domain);
                        resetQuiz();
                        setViewMode('domain');
                      }}
                      className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                        selectedDomain === domain
                          ? 'border-cyber-green/50 bg-cyber-green/10'
                          : 'border-cyber-purple/30 hover:border-cyber-green/30 hover:bg-white/5'
                      }`}
                    >
                      <div className="text-sm text-gray-300">{domain}</div>
                      <div className="text-xs text-cyber-green mt-1">{count} 题</div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Random Quiz Settings */}
        {viewMode === 'random' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card>
              <h2 className="font-medium text-white mb-4 flex items-center gap-2">
                <Shuffle size={16} className="text-cyber-green" />
                随机练习设置
              </h2>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-400">题目数量：</label>
                  <select
                    value={randomCount}
                    onChange={(e) => setRandomCount(Number(e.target.value))}
                    className="px-3 py-2 rounded-lg bg-cyber-purple/20 border border-cyber-purple/40 text-white text-sm focus:outline-none focus:border-cyber-green/50"
                  >
                    <option value={10}>10 题</option>
                    <option value={20}>20 题</option>
                    <option value={50}>50 题</option>
                    <option value={100}>100 题</option>
                    <option value={200}>200 题</option>
                    <option value={stats.totalQuestions}>全部 {stats.totalQuestions} 题</option>
                  </select>
                </div>
                <button
                  onClick={generateRandomQuiz}
                  className="px-4 py-2 bg-cyber-green/20 text-cyber-green border border-cyber-green/30 rounded-lg hover:bg-cyber-green/30 transition-colors flex items-center gap-2 text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  生成新题目
                </button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Current Paper Info / Flashcard Stats */}
        {(viewMode !== 'flashcard') && (
        <motion.div
          key={`${viewMode}-${viewMode === 'paper' ? activePaper : viewMode === 'domain' ? selectedDomain : 'random'}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  {viewMode === 'paper' && pastPapers[activePaper]?.title}
                  {viewMode === 'domain' && `📚 ${selectedDomain}`}
                  {viewMode === 'random' && `🎲 随机练习`}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {viewMode === 'paper' && (
                    <>
                      <Badge className={getDifficultyColor(pastPapers[activePaper]?.difficulty || '中等')}>
                        难度: {pastPapers[activePaper]?.difficulty}
                      </Badge>
                      <Badge className="bg-cyber-blue/20 text-cyber-blue">
                        {currentQuestions.length} 题
                      </Badge>
                    </>
                  )}
                  {viewMode === 'domain' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-white/10 text-gray-300" style={{ borderLeft: `2px solid ${getDomainColor(selectedDomain)}` }}>
                      {stats.byDomain[selectedDomain] || 0} 题
                    </span>
                  )}
                  {viewMode === 'random' && (
                    <Badge className="bg-cyber-purple/30 text-cyber-purple">
                      {currentQuestions.length} 题随机抽取
                    </Badge>
                  )}
                </div>
              </div>
              {showResults && (
                <div className="text-right">
                  <div className="text-3xl font-bold text-cyber-green">
                    {calculateScore().correct} / {calculateScore().total}
                  </div>
                  <div className="text-sm text-gray-400">
                    正确率: {Math.round((calculateScore().correct / calculateScore().total) * 100)}%
                    {Math.round((calculateScore().correct / calculateScore().total) * 100) >= 70 && (
                      <span className="text-green-400 ml-2">✅ 通过</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
        )}

        {/* ---- 闪卡复习模式 ---- */}
        {viewMode === 'flashcard' && flashCurrent && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card>
                <div className="text-xs text-gray-400">题库</div>
                <div className="text-xl font-bold text-white mt-1">{allFlashQuestions.length}</div>
              </Card>
              <Card>
                <div className="text-xs text-gray-400">已查看</div>
                <div className="text-xl font-bold text-cyber-blue mt-1">{flashSeen.size}</div>
              </Card>
              <Card>
                <div className="text-xs text-gray-400">已作答</div>
                <div className="text-xl font-bold text-cyber-gold mt-1">{flashStats.answered}</div>
              </Card>
              <Card>
                <div className="text-xs text-gray-400">正确率</div>
                <div className="text-xl font-bold text-cyber-green mt-1">
                  {flashStats.answered > 0 ? Math.round((flashStats.correct / flashStats.answered) * 100) : 0}%
                </div>
              </Card>
            </div>
            <div className="h-2 rounded-full bg-cyber-purple/20 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyber-green to-cyber-blue transition-all"
                style={{ width: `${Math.min(100, flashProgressPct)}%` }}
              />
            </div>
            <motion.div
              key={flashIdx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="min-h-[400px]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-3 py-1 rounded-full bg-cyber-purple/30 text-cyber-green">
                    {flashCurrent.domain || '综合'}
                  </span>
                  <span className="text-xs text-gray-500">#{flashIdx + 1} / {allFlashQuestions.length}</span>
                </div>
                <h2 className="text-lg font-medium text-white leading-relaxed mb-6">
                  {flashCurrent.question}
                </h2>
                <div className="space-y-2 mb-6">
                  {flashCurrent.options.map((opt, i) => {
                    const isCorrect = i === flashCurrent.correctIndex;
                    const isSelected = flashSelected === i;
                    let cls = 'border-cyber-purple/30 bg-cyber-purple/10';
                    if (flashShowAnswer) {
                      if (isCorrect) cls = 'border-cyber-green bg-cyber-green/20';
                      else if (isSelected) cls = 'border-red-500 bg-red-500/10';
                      else cls = 'border-cyber-purple/20 bg-cyber-purple/5 opacity-50';
                    } else if (flashSelected === i) {
                      cls = 'border-cyber-green bg-cyber-green/10';
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => flashSelect(i)}
                        disabled={flashShowAnswer || flashCurrent.options.length === 0}
                        className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${cls} ${!flashShowAnswer ? 'hover:border-cyber-green/50' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-md bg-cyber-purple/40 flex items-center justify-center text-sm font-medium text-white">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="text-sm text-gray-200">{opt}</span>
                          {flashShowAnswer && isCorrect && <CheckCircle size={18} className="ml-auto text-cyber-green" />}
                          {flashShowAnswer && isSelected && !isCorrect && <XCircle size={18} className="ml-auto text-red-400" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {flashShowAnswer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-4 border-t border-cyber-purple/20"
                  >
                    <div className="flex items-start gap-2">
                      <Trophy size={18} className="text-cyber-gold mt-0.5" />
                      <div>
                        <div className="text-xs text-cyber-gold mb-1">答案解析</div>
                        <p className="text-sm text-gray-300 leading-relaxed">{flashCurrent.explanation}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div className="flex items-center gap-3 mt-6">
                  <Button icon={Shuffle} onClick={flashNext}>下一题</Button>
                  {!flashShowAnswer && (
                    <Button variant="outline" icon={Eye} onClick={() => setFlashShowAnswer(true)}>
                      直接查看答案
                    </Button>
                  )}
                  <Button variant="outline" icon={RotateCcw} onClick={flashReset}>重置统计</Button>
                </div>
              </Card>
            </motion.div>
          </>
        )}

        {/* Practice Environments - Only show in paper mode */}
        {viewMode === 'paper' && pastPapers[activePaper]?.practiceEnvironment?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <h3 className="font-medium text-white mb-4 flex items-center gap-2">
                <Server size={16} className="text-cyber-green" />
                推荐练习环境
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastPapers[activePaper].practiceEnvironment.map((env) => (
                  <a
                    key={env.id}
                    href={env.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-xl border border-cyber-purple/30 hover:border-cyber-green/40 hover:bg-cyber-green/5 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white group-hover:text-cyber-green transition-colors">
                        {env.name}
                      </h4>
                      <ExternalLink size={14} className="text-gray-500 group-hover:text-cyber-green transition-colors" />
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {env.description}
                    </p>
                  </a>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Questions (隐藏闪卡模式) */}
        {viewMode !== 'flashcard' && (
        <div className="space-y-4">
          {currentQuestions.map((q, index) => {
            const userAnswer = answers[q.uniqueId];
            const hasAnswered = !!userAnswer;
            const userIdx = hasAnswered ? q.options.indexOf(userAnswer) : null;
            const isCorrect = userIdx === q.correctIndex;

            return (
              <motion.div
                key={q.uniqueId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card className={`transition-all duration-200 ${
                  showResults
                    ? hasAnswered
                      ? isCorrect
                        ? 'border-green-500/30 bg-green-500/5'
                        : 'border-red-500/30 bg-red-500/5'
                      : ''
                    : ''
                }`}>
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-sm text-gray-400">
                          第 {index + 1} 题
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-white/10 text-gray-300" style={{ borderLeft: `2px solid ${getDomainColor(q.domain)}` }}>
                          {q.domain}
                        </span>
                        <Badge className="bg-cyber-purple/30 text-gray-400">
                          {q.year}年 · {q.session}
                        </Badge>
                      </div>
                      <h3 className="text-base text-white leading-relaxed">
                        {q.question}
                      </h3>
                    </div>
                    {showResults && (
                      <div className="ml-4 flex-shrink-0">
                        {hasAnswered ? (
                          isCorrect ? (
                            <CheckCircle size={20} className="text-green-400" />
                          ) : (
                            <XCircle size={20} className="text-red-400" />
                          )
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-cyber-purple/30 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">未答</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 使用共享 QuizQuestion 组件 */}
                  <QuizQuestion
                    question={{
                      id: q.uniqueId,
                      question: q.question,
                      options: q.options,
                      correctIndex: q.correctIndex,
                      explanation: q.explanation,
                    }}
                    selectedIndex={userIdx}
                    showResult={showResults}
                    onSelect={(i) => handleAnswer(q.uniqueId, q.options[i])}
                    expanded={expandedQuestion === q.uniqueId}
                    onToggleExpand={() => setExpandedQuestion(
                      expandedQuestion === q.uniqueId ? null : q.uniqueId
                    )}
                  />
                </Card>
              </motion.div>
            );
          })}
        </div>
        )}

        {/* Action Buttons (隐藏闪卡模式) */}
        {viewMode !== 'flashcard' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex justify-center gap-4 flex-wrap"
        >
          {!showResults ? (
            <Button
              onClick={() => setShowResults(true)}
              disabled={Object.keys(answers).length === 0}
            >
              <Trophy size={16} className="mr-1" />
              提交答案 ({Object.keys(answers).length}/{currentQuestions.length})
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={resetQuiz}>
                <RefreshCw size={16} className="mr-1" />重新答题
              </Button>
              {viewMode === 'random' && (
                <Button onClick={generateRandomQuiz}>
                  <Shuffle size={16} className="mr-1" />再来一组
                </Button>
              )}
            </>
          )}
        </motion.div>
        )}

        {/* Progress Info (隐藏闪卡模式) */}
        {viewMode !== 'flashcard' && (
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>💡 提示：CISP 考试合格分数线为 70%，建议正确率达到 80% 以上再参加正式考试</p>
        </div>
        )}
    </div>
  );
};
