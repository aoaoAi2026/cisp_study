import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Calendar,
  Target,
  Shuffle,
  Filter,
  BookOpen,
  Trophy,
  BarChart3,
  RefreshCw,
  Server,
  ExternalLink
} from 'lucide-react';
import { Card, Badge } from '../components/UI';
import { ParticleBackground } from '../components/UI/ParticleBackground';
import {
  pastPapers,
  cispDomains,
  domainQuestions,
  getAllPastPaperQuestions,
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
  const [viewMode, setViewMode] = useState<'paper' | 'domain' | 'random'>('paper');
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [randomCount, setRandomCount] = useState(50);
  const [randomQuestions, setRandomQuestions] = useState<PastPaperQuestion[]>([]);

  const stats = getPastPaperStats();

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
      case '基础': return 'bg-green-100 text-green-800';
      case '中等': return 'bg-yellow-100 text-yellow-800';
      case '中高': return 'bg-orange-100 text-orange-800';
      case '高': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDomainColor = (domain: string) => {
    const colors: Record<string, string> = {
      '信息安全保障': 'bg-blue-100 text-blue-800',
      '信息安全监管': 'bg-purple-100 text-purple-800',
      '信息安全管理体系': 'bg-teal-100 text-teal-800',
      '业务连续性': 'bg-emerald-100 text-emerald-800',
      '安全工程与运营': 'bg-cyan-100 text-cyan-800',
      '安全评估': 'bg-orange-100 text-orange-800',
      '访问控制': 'bg-indigo-100 text-indigo-800',
      '加密技术': 'bg-pink-100 text-pink-800',
      '物理安全': 'bg-amber-100 text-amber-800',
      '网络安全': 'bg-sky-100 text-sky-800',
      '应用安全': 'bg-rose-100 text-rose-800',
      '安全开发': 'bg-lime-100 text-lime-800',
      '法律法规': 'bg-red-100 text-red-800',
      '等级保护': 'bg-violet-100 text-violet-800',
      '安全管理': 'bg-gray-100 text-gray-800',
      '信息安全概念': 'bg-blue-100 text-blue-800',
      '信息安全技术': 'bg-cyan-100 text-cyan-800',
      '密码学': 'bg-pink-100 text-pink-800',
      '系统安全': 'bg-rose-100 text-rose-800',
      '通信安全': 'bg-sky-100 text-sky-800',
    };
    return colors[domain] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative">
      <ParticleBackground />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            🛡️ CISP 历年真题库
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            涵盖 {stats.totalQuestions}+ 道精选历年真题，覆盖全部 CISP 知识域
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-6 mt-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow">
              <div className="text-2xl font-bold text-blue-600">{stats.totalQuestions}</div>
              <div className="text-xs text-slate-500">总题数</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow">
              <div className="text-2xl font-bold text-green-600">{Object.keys(stats.byDomain).length}</div>
              <div className="text-xs text-slate-500">知识域</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow">
              <div className="text-2xl font-bold text-purple-600">{pastPapers.length}</div>
              <div className="text-xs text-slate-500">历年试卷</div>
            </div>
          </div>
        </motion.div>

        {/* View Mode Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="p-4">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => { setViewMode('paper'); resetQuiz(); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'paper'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                历年试卷
              </button>
              <button
                onClick={() => { setViewMode('domain'); resetQuiz(); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'domain'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                知识域
              </button>
              <button
                onClick={generateRandomQuiz}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'random'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Shuffle className="w-4 h-4" />
                随机练习
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
            className="mb-6"
          >
            <Card className="p-4">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                选择年份
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {pastPapers.map((paper, index) => (
                  <button
                    key={paper.id}
                    onClick={() => switchPaper(index)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      activePaper === index && viewMode === 'paper'
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-semibold text-slate-800">{paper.year}年 {paper.month}</div>
                    <div className="text-sm text-slate-500 mt-1">
                      {paper.questions.length} 题 · {paper.difficulty}
                    </div>
                    <div className="text-xs text-blue-600 mt-2">
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
            className="mb-6"
          >
            <Card className="p-4">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
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
                      className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                        selectedDomain === domain
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-medium text-slate-700 text-sm">{domain}</div>
                      <div className="text-xs text-blue-600 mt-1">{count} 题</div>
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
            className="mb-6"
          >
            <Card className="p-4">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Shuffle className="w-5 h-5 text-blue-600" />
                随机练习设置
              </h2>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-600">题目数量：</label>
                  <select
                    value={randomCount}
                    onChange={(e) => setRandomCount(Number(e.target.value))}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
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
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  生成新题目
                </button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Current Paper Info */}
        <motion.div
          key={`${viewMode}-${viewMode === 'paper' ? activePaper : viewMode === 'domain' ? selectedDomain : 'random'}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Card className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
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
                      <Badge className="bg-blue-100 text-blue-800">
                        {currentQuestions.length} 题
                      </Badge>
                    </>
                  )}
                  {viewMode === 'domain' && (
                    <Badge className={getDomainColor(selectedDomain)}>
                      {stats.byDomain[selectedDomain] || 0} 题
                    </Badge>
                  )}
                  {viewMode === 'random' && (
                    <Badge className="bg-purple-100 text-purple-800">
                      {currentQuestions.length} 题随机抽取
                    </Badge>
                  )}
                </div>
              </div>
              {showResults && (
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {calculateScore().correct} / {calculateScore().total}
                  </div>
                  <div className="text-sm text-slate-500">
                    正确率: {Math.round((calculateScore().correct / calculateScore().total) * 100)}%
                    {Math.round((calculateScore().correct / calculateScore().total) * 100) >= 70 && (
                      <span className="text-green-600 ml-2">✅ 通过</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Practice Environments - Only show in paper mode */}
        {viewMode === 'paper' && pastPapers[activePaper]?.practiceEnvironment?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Server className="w-5 h-5 text-green-600" />
                推荐练习环境
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastPapers[activePaper].practiceEnvironment.map((env) => (
                  <a
                    key={env.id}
                    href={env.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-xl border-2 border-slate-200 hover:border-green-400 hover:bg-green-50/50 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-800 group-hover:text-green-700 transition-colors">
                        {env.name}
                      </h4>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-green-600 transition-colors" />
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {env.description}
                    </p>
                  </a>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Questions */}
        <div className="space-y-4">
          {currentQuestions.map((q, index) => {
            const userAnswer = answers[q.uniqueId];
            const correctAnswer = q.options[q.correctIndex];
            const isCorrect = userAnswer === correctAnswer;
            const hasAnswered = !!userAnswer;

            return (
              <motion.div
                key={q.uniqueId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card className={`p-5 transition-all duration-200 ${
                  showResults
                    ? hasAnswered
                      ? isCorrect
                        ? 'border-green-300 bg-green-50/50'
                        : 'border-red-300 bg-red-50/50'
                      : 'border-slate-200'
                    : 'border-slate-200'
                }`}>
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-sm font-medium text-slate-500">
                          第 {index + 1} 题
                        </span>
                        <Badge className={getDomainColor(q.domain)}>
                          {q.domain}
                        </Badge>
                        <Badge className="bg-slate-100 text-slate-600">
                          {q.year}年 · {q.session}
                        </Badge>
                      </div>
                      <h3 className="text-base font-medium text-slate-800 leading-relaxed">
                        {q.question}
                      </h3>
                    </div>
                    {showResults && (
                      <div className="ml-4 flex-shrink-0">
                        {hasAnswered ? (
                          isCorrect ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-500" />
                          )
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                            <span className="text-slate-500 text-xs">未答</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Options */}
                  <div className="space-y-2 mb-4">
                    {q.options.map((option, optIdx) => {
                      const optionLabel = String.fromCharCode(65 + optIdx);
                      const isSelected = userAnswer === option;
                      const isCorrectOption = option === correctAnswer;

                      return (
                        <button
                          key={optIdx}
                          onClick={() => !showResults && handleAnswer(q.uniqueId, option)}
                          disabled={showResults}
                          className={`w-full p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                            isSelected
                              ? showResults
                                ? isCorrectOption
                                  ? 'border-green-500 bg-green-100'
                                  : 'border-red-500 bg-red-100'
                                : 'border-blue-500 bg-blue-50'
                              : showResults && isCorrectOption
                              ? 'border-green-500 bg-green-100'
                              : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                          } ${showResults ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          {option.startsWith(optionLabel + '.') ? option.slice(2).trim() : option}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {showResults && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4"
                    >
                      <button
                        onClick={() => setExpandedQuestion(
                          expandedQuestion === q.uniqueId ? null : q.uniqueId
                        )}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {expandedQuestion === q.uniqueId ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                        {expandedQuestion === q.uniqueId ? '收起解析' : '查看解析'}
                      </button>
                      
                      {expandedQuestion === q.uniqueId && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-3 p-4 bg-white rounded-lg border border-slate-200"
                        >
                          <div className="mb-3">
                            <span className="font-medium text-slate-700">正确答案: </span>
                            <span className="font-bold text-green-600">{correctAnswer}</span>
                          </div>
                          <div className="mb-3">
                            <span className="font-medium text-slate-700">解析: </span>
                            <span className="text-slate-600 text-sm leading-relaxed">{q.explanation}</span>
                          </div>
                          <div className="flex items-start gap-2 bg-yellow-50 p-3 rounded-lg">
                            <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-medium text-slate-700">核心考点: </span>
                              <span className="text-slate-600 text-sm">{q.explanation.split('。')[0]}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex justify-center gap-4 flex-wrap"
        >
          {!showResults ? (
            <button
              onClick={() => setShowResults(true)}
              disabled={Object.keys(answers).length === 0}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-200 flex items-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              提交答案 ({Object.keys(answers).length}/{currentQuestions.length})
            </button>
          ) : (
            <>
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-slate-600 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors shadow-lg shadow-slate-200 flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                重新答题
              </button>
              {viewMode === 'random' && (
                <button
                  onClick={generateRandomQuiz}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 flex items-center gap-2"
                >
                  <Shuffle className="w-5 h-5" />
                  再来一组
                </button>
              )}
            </>
          )}
        </motion.div>

        {/* Progress Info */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>💡 提示：CISP 考试合格分数线为 70%，建议正确率达到 80% 以上再参加正式考试</p>
        </div>
      </div>
    </div>
  );
};
