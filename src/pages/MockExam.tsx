import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Clock,
  CheckCircle,
  XCircle,
  Target,
  Trophy,
  ArrowRight,
  AlertTriangle,
  RotateCcw,
  Pause,
  PlayCircle
} from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';
import { mockExamPool, type MockQuestion } from '../data/mockExamPool';

interface ExamSession {
  questions: MockQuestion[];
  answers: Record<number, string>;
  currentIndex: number;
  timeLeft: number;
  isStarted: boolean;
  isFinished: boolean;
  isPaused: boolean;
}

const EXAM_DURATION = 30 * 60; // 30 minutes
const QUESTION_COUNT = 25;

export const MockExam: React.FC = () => {
  const [session, setSession] = useState<ExamSession>({
    questions: [],
    answers: {},
    currentIndex: 0,
    timeLeft: EXAM_DURATION,
    isStarted: false,
    isFinished: false,
    isPaused: false
  });

  // Timer effect
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (session.isStarted && !session.isFinished && !session.isPaused && session.timeLeft > 0) {
      timer = setInterval(() => {
        setSession(prev => ({
          ...prev,
          timeLeft: Math.max(0, prev.timeLeft - 1)
        }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [session.isStarted, session.isFinished, session.isPaused, session.timeLeft]);

  // Auto-finish when time runs out
  useEffect(() => {
    if (session.timeLeft === 0 && session.isStarted && !session.isFinished) {
      setSession(prev => ({ ...prev, isFinished: true }));
    }
  }, [session.timeLeft, session.isStarted, session.isFinished]);

  const startExam = () => {
    const shuffled = [...mockExamPool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, QUESTION_COUNT);
    setSession({
      questions: selected,
      answers: {},
      currentIndex: 0,
      timeLeft: EXAM_DURATION,
      isStarted: true,
      isFinished: false,
      isPaused: false
    });
  };

  const selectAnswer = (label: string) => {
    const currentQ = session.questions[session.currentIndex];
    setSession(prev => ({
      ...prev,
      answers: { ...prev.answers, [currentQ.id]: label }
    }));
  };

  const goToQuestion = (index: number) => {
    setSession(prev => ({ ...prev, currentIndex: index }));
  };

  const nextQuestion = () => {
    if (session.currentIndex < session.questions.length - 1) {
      setSession(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
    }
  };

  const prevQuestion = () => {
    if (session.currentIndex > 0) {
      setSession(prev => ({ ...prev, currentIndex: prev.currentIndex - 1 }));
    }
  };

  const finishExam = () => {
    setSession(prev => ({ ...prev, isFinished: true }));
  };

  const togglePause = () => {
    setSession(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const resetExam = () => {
    setSession({
      questions: [],
      answers: {},
      currentIndex: 0,
      timeLeft: EXAM_DURATION,
      isStarted: false,
      isFinished: false,
      isPaused: false
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate results
  const results = useMemo(() => {
    if (!session.isFinished) return null;
    let correct = 0;
    const byDomain: Record<string, { correct: number; total: number }> = {};
    
    session.questions.forEach(q => {
      const isCorrect = session.answers[q.id] === q.correct;
      if (isCorrect) correct++;
      
      if (!byDomain[q.domain]) {
        byDomain[q.domain] = { correct: 0, total: 0 };
      }
      byDomain[q.domain].total++;
      if (isCorrect) byDomain[q.domain].correct++;
    });
    
    return {
      correct,
      total: session.questions.length,
      percentage: Math.round((correct / session.questions.length) * 100),
      byDomain
    };
  }, [session.isFinished, session.questions, session.answers]);

  const answeredCount = Object.keys(session.answers).length;
  const currentQ = session.questions[session.currentIndex];
  const timeWarning = session.timeLeft < 300; // < 5 minutes

  // Welcome Screen
  if (!session.isStarted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
          <Card className="max-w-xl w-full p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center">
              <Target className="w-10 h-10 text-cyber-green" />
            </div>
            <h1 className="font-orbitron text-3xl font-bold text-white mb-4">
              CISP 模拟考试
            </h1>
            <p className="text-gray-400 mb-8">
              全真模拟考试环境，检验你的学习成果
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-cyber-green">{QUESTION_COUNT}</div>
                <div className="text-sm text-gray-400">题目数量</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-cyber-blue">30</div>
                <div className="text-sm text-gray-400">考试分钟</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-cyber-yellow">70%</div>
                <div className="text-sm text-gray-400">及格线</div>
              </div>
            </div>

            <div className="text-left mb-8 p-4 rounded-lg bg-cyber-purple/20 border border-cyber-purple/30">
              <h3 className="font-bold text-white mb-3">考试须知</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• 考试时间 30 分钟，超时自动交卷</li>
                <li>• 共 {QUESTION_COUNT} 道选择题，随机抽取</li>
                <li>• 答题过程中可随时返回修改答案</li>
                <li>• 每道题只有一个正确答案</li>
                <li>• 达到 70% 正确率为合格</li>
              </ul>
            </div>

            <button
              onClick={startExam}
              className="w-full py-4 rounded-lg bg-cyber-green text-white font-bold text-lg hover:bg-cyber-green/90 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              开始考试
            </button>
          </Card>
        </motion.div>
    );
  }

  // Results Screen
  if (session.isFinished && results) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
          <Card className="bg-gradient-to-br from-cyber-purple/50 to-cyber-blue/20 border-cyber-blue/30 text-center p-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center">
              {results.percentage >= 70 ? (
                <Trophy className="w-12 h-12 text-cyber-green" />
              ) : (
                <AlertTriangle className="w-12 h-12 text-cyber-yellow" />
              )}
            </div>
            <div className="text-7xl font-bold text-white mb-2">{results.percentage}%</div>
            <div className="text-2xl text-cyber-green mb-4">
              {results.correct} / {results.total} 正确
            </div>
            <div className={`text-xl font-medium mb-6 ${
              results.percentage >= 90 ? 'text-cyber-green' :
              results.percentage >= 80 ? 'text-cyber-blue' :
              results.percentage >= 70 ? 'text-cyber-yellow' :
              'text-cyber-pink'
            }`}>
              {results.percentage >= 90 ? '🏆 优秀！掌握扎实！' :
               results.percentage >= 80 ? '🎉 良好！继续努力！' :
               results.percentage >= 70 ? '✅ 合格！建议复习错题。' :
               '📚 需要加强学习，加油！'}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-8">
              <div className="p-4 rounded-lg bg-white/5">
                <div className="text-3xl font-bold text-cyber-green">{results.correct}</div>
                <div className="text-gray-400">答对</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <div className="text-3xl font-bold text-cyber-pink">{results.total - results.correct}</div>
                <div className="text-gray-400">答错</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <div className="text-3xl font-bold text-white">{results.total - answeredCount}</div>
                <div className="text-gray-400">未答</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <div className="text-3xl font-bold text-cyber-yellow">{formatTime(EXAM_DURATION - session.timeLeft)}</div>
                <div className="text-gray-400">用时</div>
              </div>
            </div>

            <button
              onClick={resetExam}
              className="px-8 py-3 rounded-lg bg-cyber-green text-white font-medium hover:bg-cyber-green/90 transition-all flex items-center justify-center gap-2 mx-auto"
            >
              <RotateCcw className="w-5 h-5" />
              重新考试
            </button>
          </Card>

          {/* Domain breakdown */}
          <Card>
            <h3 className="text-lg font-bold text-white mb-4">各知识域得分</h3>
            <div className="space-y-3">
              {Object.entries(results.byDomain).map(([domain, stats]) => {
                const percent = Math.round((stats.correct / stats.total) * 100);
                return (
                  <div key={domain}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{domain}</span>
                      <span className={percent >= 70 ? 'text-cyber-green' : 'text-cyber-yellow'}>
                        {stats.correct}/{stats.total} ({percent}%)
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        className={`h-full ${percent >= 70 ? 'bg-cyber-green' : 'bg-cyber-yellow'}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Question review */}
          <Card>
            <h3 className="text-lg font-bold text-white mb-4">答题详情</h3>
            <div className="space-y-4">
              {session.questions.map((q, index) => {
                const userAnswer = session.answers[q.id];
                const isCorrect = userAnswer === q.correct;
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-lg border ${
                      isCorrect ? 'border-cyber-green/30 bg-cyber-green/5' : 'border-cyber-pink/30 bg-cyber-pink/5'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-cyber-green flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-5 h-5 text-cyber-pink flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <div className="text-xs text-gray-400 mb-1">第 {index + 1} 题 · {q.domain}</div>
                        <p className="text-white mb-2">{q.question}</p>
                        <div className="text-sm space-y-1">
                          <p>
                            <span className="text-gray-400">你的答案：</span>
                            <span className={isCorrect ? 'text-cyber-green' : 'text-cyber-pink'}>
                              {userAnswer || '未作答'}
                            </span>
                            {!isCorrect && (
                              <>
                                <span className="text-gray-400 ml-4">正确答案：</span>
                                <span className="text-cyber-green">{q.correct}</span>
                              </>
                            )}
                          </p>
                          <div className="mt-2 p-2 rounded bg-white/5 text-xs text-gray-400">
                            {q.options.find(o => o.label === q.correct)?.text}
                          </div>
                          <div className="mt-2 p-2 rounded bg-cyber-yellow/10 text-xs text-gray-300">
                            💡 {q.explanation}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
    );
  }

  // Exam Screen
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
        {/* Header / Timer */}
        <Card className="sticky top-0 z-10 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">
                进度：<span className="text-white font-bold">{answeredCount}/{session.questions.length}</span>
              </div>
              <div className="text-sm text-gray-400">
                当前：<span className="text-cyber-green font-bold">第 {session.currentIndex + 1} 题</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`text-2xl font-mono font-bold ${timeWarning ? 'text-cyber-pink animate-pulse' : 'text-cyber-green'}`}>
                <Clock className="w-5 h-5 inline mr-2" />
                {formatTime(session.timeLeft)}
              </div>
              <button
                onClick={togglePause}
                className="p-2 rounded-lg border border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-all"
              >
                {session.isPaused ? <PlayCircle className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </Card>

        {/* Pause overlay */}
        <AnimatePresence>
          {session.isPaused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-cyber-black/80 backdrop-blur-sm z-30 flex items-center justify-center"
            >
              <Card className="max-w-md text-center p-8">
                <Pause className="w-16 h-16 mx-auto text-cyber-yellow mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">考试已暂停</h2>
                <p className="text-gray-400 mb-6">点击继续按钮恢复答题</p>
                <button
                  onClick={togglePause}
                  className="px-8 py-3 rounded-lg bg-cyber-green text-white font-medium hover:bg-cyber-green/90 transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  <PlayCircle className="w-5 h-5" />
                  继续考试
                </button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={session.currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-cyber-green font-bold">第 {session.currentIndex + 1} 题</span>
                    <span className="text-gray-600">/</span>
                    <span className="text-gray-400">{session.questions.length}</span>
                    <Badge variant="blue" className="text-xs ml-2">{currentQ.domain}</Badge>
                  </div>
                  
                  <h2 className="text-xl text-white font-medium mb-8">
                    {currentQ.question}
                  </h2>

                  <div className="space-y-3">
                    {currentQ.options.map((option) => {
                      const isSelected = session.answers[currentQ.id] === option.label;
                      return (
                        <button
                          key={option.label}
                          onClick={() => selectAnswer(option.label)}
                          className={`
                            w-full flex items-start gap-4 p-5 rounded-xl border text-left transition-all
                            ${isSelected
                              ? 'bg-cyber-green/10 border-cyber-green/50 shadow-lg shadow-cyber-green/10'
                              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'
                            }
                          `}
                        >
                          <span className={`
                            w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0
                            ${isSelected ? 'bg-cyber-green text-white' : 'bg-white/10 text-gray-400'}
                          `}>
                            {option.label}
                          </span>
                          <span className={`text-lg pt-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                            {option.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                    <button
                      onClick={prevQuestion}
                      disabled={session.currentIndex === 0}
                      className={`px-6 py-3 rounded-lg border transition-all ${
                        session.currentIndex === 0
                          ? 'border-white/10 text-gray-500 cursor-not-allowed'
                          : 'border-white/20 text-white hover:bg-white/5'
                      }`}
                    >
                      上一题
                    </button>

                    {session.currentIndex === session.questions.length - 1 ? (
                      <button
                        onClick={finishExam}
                        className="px-8 py-3 rounded-lg bg-cyber-green text-white font-bold hover:bg-cyber-green/90 transition-all"
                      >
                        交卷
                      </button>
                    ) : (
                      <button
                        onClick={nextQuestion}
                        className="px-6 py-3 rounded-lg bg-cyber-blue text-white font-medium hover:bg-cyber-blue/90 transition-all flex items-center gap-2"
                      >
                        下一题
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Question navigator */}
          <div className="lg:col-span-1">
            <Card>
              <h3 className="text-sm font-bold text-white mb-4">答题卡</h3>
              <div className="grid grid-cols-5 gap-2">
                {session.questions.map((q, index) => {
                  const isAnswered = session.answers[q.id] !== undefined;
                  const isCurrent = session.currentIndex === index;
                  return (
                    <button
                      key={q.id}
                      onClick={() => goToQuestion(index)}
                      className={`
                        w-10 h-10 rounded-lg text-sm font-bold transition-all
                        ${isCurrent
                          ? 'bg-cyber-green text-white ring-2 ring-cyber-green/50'
                          : isAnswered
                            ? 'bg-cyber-blue/30 text-cyber-blue border border-cyber-blue/50'
                            : 'bg-white/5 text-gray-500 border border-white/10 hover:bg-white/10'
                        }
                      `}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-cyber-green" />
                  <span className="text-gray-400">当前题目</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-cyber-blue/30 border border-cyber-blue/50" />
                  <span className="text-gray-400">已作答</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-white/5 border border-white/10" />
                  <span className="text-gray-400">未作答</span>
                </div>
              </div>

              <div className="mt-6 p-3 rounded-lg bg-cyber-yellow/10 border border-cyber-yellow/30 text-xs text-cyber-yellow">
                已作答 {answeredCount}/{session.questions.length}
                <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${(answeredCount / session.questions.length) * 100}%` }}
                    className="h-full bg-cyber-yellow"
                  />
                </div>
              </div>

              <button
                onClick={finishExam}
                className="w-full mt-4 py-3 rounded-lg bg-cyber-green text-white font-medium hover:bg-cyber-green/90 transition-all"
              >
                立即交卷
              </button>
            </Card>
          </div>
        </div>
      </motion.div>
  );
};
