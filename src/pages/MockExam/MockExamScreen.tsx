import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Pause, PlayCircle, ArrowRight } from 'lucide-react';
import { Card, Badge } from '../../components/UI';
import { ParticleBackground } from '../../components/UI/ParticleBackground';
import type { ExamSession } from './constants';

interface MockExamScreenProps {
  session: ExamSession;
  answeredCount: number;
  onSelectAnswer: (label: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onFinish: () => void;
  onTogglePause: () => void;
  onGoToQuestion: (index: number) => void;
  formatTime: (seconds: number) => string;
}

export { type ExamSession } from './constants';

export const MockExamScreen: React.FC<MockExamScreenProps> = ({
  session,
  answeredCount,
  onSelectAnswer,
  onNext,
  onPrev,
  onFinish,
  onTogglePause,
  onGoToQuestion,
  formatTime,
}) => {
  const currentQ = session.questions[session.currentIndex];
  const timeWarning = session.timeLeft < 300;

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10"
      >
        {/* Header / Timer */}
        <div className="sticky top-0 z-20 bg-cyber-black/90 backdrop-blur-xl border-b border-white/10 py-4">
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
                onClick={onTogglePause}
                className="p-2 rounded-lg border border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-all"
              >
                {session.isPaused ? <PlayCircle className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

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
                  onClick={onTogglePause}
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
                          onClick={() => onSelectAnswer(option.label)}
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
                      onClick={onPrev}
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
                        onClick={onFinish}
                        className="px-8 py-3 rounded-lg bg-cyber-green text-white font-bold hover:bg-cyber-green/90 transition-all"
                      >
                        交卷
                      </button>
                    ) : (
                      <button
                        onClick={onNext}
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
                      onClick={() => onGoToQuestion(index)}
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
                onClick={onFinish}
                className="w-full mt-4 py-3 rounded-lg bg-cyber-green text-white font-medium hover:bg-cyber-green/90 transition-all"
              >
                立即交卷
              </button>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
