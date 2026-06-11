import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileQuestion,
  Clock,
  CheckCircle,
  Target,
  Trophy,
  BookOpen,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useLearningStore, useAchievementStore } from '../store';
import { learningData } from '../data/learningData';
import { Card, Badge, Button } from '../components/UI';
import { ProgressRing } from '../components/UI/ProgressRing';

interface QuizResult {
  dayId: string;
  score: number;
  date: string;
  totalQuestions: number;
  correctAnswers: number;
}

export const QuizCenter: React.FC = () => {
  const navigate = useNavigate();
  const { completedDays, quizResults, saveQuizResult } = useLearningStore();
  const { checkAndUnlockBadge } = useAchievementStore();
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  // Get all available quizzes (from completed days)
  const availableQuizzes = learningData
    .filter(day => completedDays.some(cd => cd.dayId === day.id) && day.quiz && day.quiz.length > 0)
    .map(day => ({
      ...day,
      bestScore: quizResults[day.id]?.score || 0,
    }));

  // Full mock exam questions (combining all quizzes)
  const mockExamQuestions = learningData
    .flatMap(day => day.quiz || [])
    .slice(0, 20);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleStartQuiz = (dayId: string) => {
    setSelectedQuiz(dayId);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setQuizStarted(true);
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const handleSubmitQuiz = () => {
    const day = learningData.find(d => d.id === selectedQuiz);
    if (!day?.quiz) return;

    const correct = day.quiz.filter(q => answers[q.id] === q.correctIndex).length;
    const score = Math.round((correct / day.quiz.length) * 100);

    saveQuizResult(selectedQuiz!, score);
    setShowResult(true);

    if (score >= 90) {
      checkAndUnlockBadge('quiz_90');
    }
    checkAndUnlockBadge('first_quiz');
  };

  const currentDay = learningData.find(d => d.id === selectedQuiz);
  const currentQuizQuestion = currentDay?.quiz?.[currentQuestion];
  const totalQuizzesCompleted = Object.keys(quizResults).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-orbitron text-2xl font-bold text-cyber-green">
            测验中心
          </h1>
          <p className="text-gray-400 mt-1">
            检验你的学习成果，巩固知识点
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-400">已完成测验</p>
            <p className="text-xl font-bold text-white">{totalQuizzesCompleted}</p>
          </div>
          <ProgressRing
            progress={(totalQuizzesCompleted / 90) * 100}
            size={60}
            strokeWidth={5}
          />
        </div>
      </div>

      {!quizStarted ? (
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card
              className="cursor-pointer hover:border-cyber-gold/30 transition-all"
              onClick={() => handleStartQuiz('mock-exam')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-cyber-gold/20 flex items-center justify-center">
                    <Trophy size={28} className="text-cyber-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-lg">模拟考试</h3>
                    <p className="text-sm text-gray-400">
                      完整CISP模拟题，共{mockExamQuestions.length}题，限时60分钟
                    </p>
                  </div>
                </div>
                <Badge variant="gold">推荐</Badge>
              </div>
            </Card>
          </motion.div>

          {/* Chapter Quizzes */}
          <motion.div variants={itemVariants}>
            <h2 className="font-orbitron text-lg text-cyber-green mb-4 flex items-center gap-2">
              <BookOpen size={20} />
              章节测验
            </h2>
            {availableQuizzes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableQuizzes.map((quiz) => (
                  <Card
                    key={quiz.id}
                    className="cursor-pointer group hover:border-cyber-green/30"
                    onClick={() => handleStartQuiz(quiz.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cyber-purple/60 flex items-center justify-center text-cyber-green font-bold">
                          {quiz.day}
                        </div>
                        <div>
                          <h3 className="font-medium text-white group-hover:text-cyber-green transition-colors">
                            Day {quiz.day}: {quiz.title}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {quiz.quiz?.length}道题
                          </p>
                        </div>
                      </div>
                      {quizResults[quiz.id] ? (
                        <div className="text-right">
                          <p className="text-lg font-bold text-cyber-green">
                            {quizResults[quiz.id].score}%
                          </p>
                          <p className="text-xs text-gray-500">最佳成绩</p>
                        </div>
                      ) : (
                        <ChevronRight size={20} className="text-gray-500" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-8">
                <FileQuestion size={48} className="mx-auto mb-3 text-gray-500" />
                <p className="text-gray-400">完成每天的学习后才能解锁章节测验</p>
                <Button
                  className="mt-4"
                  onClick={() => navigate('/learning')}
                >
                  去学习
                </Button>
              </Card>
            )}
          </motion.div>
        </motion.div>
      ) : (
        // Quiz Taking View
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-orbitron text-lg text-cyber-green">
                  {currentDay?.title || '模拟考试'}
                </h2>
                <p className="text-sm text-gray-400">
                  第{currentQuestion + 1}题 / 共{currentDay?.quiz?.length || mockExamQuestions.length}题
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuizStarted(false);
                  setSelectedQuiz(null);
                }}
              >
                退出测验
              </Button>
            </div>

            {!showResult ? (
              <>
                {/* Progress Bar */}
                <div className="w-full h-2 bg-cyber-purple/40 rounded-full mb-6">
                  <div
                    className="h-full bg-cyber-green rounded-full transition-all"
                    style={{
                      width: `${((currentQuestion + 1) / (currentDay?.quiz?.length || 1)) * 100}%`
                    }}
                  />
                </div>

                {/* Question */}
                {currentQuizQuestion && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">
                      {currentQuizQuestion.question}
                    </h3>
                    <div className="space-y-2">
                      {currentQuizQuestion.options.map((option, i) => (
                        <div
                          key={i}
                          className={`
                            quiz-option
                            ${answers[currentQuizQuestion.id] === i ? 'selected' : ''}
                          `}
                          onClick={() => handleAnswerSelect(currentQuizQuestion.id, i)}
                        >
                          <span className="font-medium mr-2">
                            {String.fromCharCode(65 + i)}.
                          </span>
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    disabled={currentQuestion === 0}
                    onClick={() => setCurrentQuestion(prev => prev - 1)}
                  >
                    上一题
                  </Button>
                  {currentQuestion < (currentDay?.quiz?.length || 1) - 1 ? (
                    <Button onClick={() => setCurrentQuestion(prev => prev + 1)}>
                      下一题
                    </Button>
                  ) : (
                    <Button onClick={handleSubmitQuiz}>
                      提交测验
                    </Button>
                  )}
                </div>
              </>
            ) : (
              // Results View
              <div className="text-center py-8">
                <div className="mb-6">
                  <ProgressRing
                    progress={quizResults[selectedQuiz!]?.score || 0}
                    size={120}
                    strokeWidth={8}
                    color={quizResults[selectedQuiz!]?.score >= 60 ? '#00ff88' : '#ff3366'}
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {quizResults[selectedQuiz!]?.score >= 60 ? '恭喜通过!' : '继续努力'}
                </h3>
                <p className="text-gray-400 mb-6">
                  你的得分: {quizResults[selectedQuiz!]?.score}%
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setQuizStarted(false);
                      setSelectedQuiz(null);
                    }}
                  >
                    返回测验中心
                  </Button>
                  <Button onClick={() => handleStartQuiz(selectedQuiz!)}>
                    再次挑战
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default QuizCenter;
