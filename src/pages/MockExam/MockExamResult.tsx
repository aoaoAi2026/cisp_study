import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, AlertTriangle, CheckCircle, XCircle, RotateCcw, Clock } from 'lucide-react';
import { Card } from '../../components/UI';
import { ParticleBackground } from '../../components/UI/ParticleBackground';
import type { MockQuestion } from './constants';

interface MockExamResultProps {
  results: {
    correct: number;
    total: number;
    percentage: number;
    byDomain: Record<string, { correct: number; total: number }>;
  };
  session: {
    questions: MockQuestion[];
    answers: Record<number, string>;
  };
  answeredCount: number;
  examDuration: number;
  timeLeft: number;
  onReset: () => void;
  formatTime: (seconds: number) => string;
}

export { type MockQuestion } from './constants';

export const MockExamResult: React.FC<MockExamResultProps> = ({
  results,
  session,
  answeredCount,
  examDuration,
  timeLeft,
  onReset,
  formatTime,
}) => {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 space-y-6 py-8"
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
              <div className="text-3xl font-bold text-cyber-yellow">{formatTime(examDuration - timeLeft)}</div>
              <div className="text-gray-400">用时</div>
            </div>
          </div>

          <button
            onClick={onReset}
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
    </div>
  );
};
