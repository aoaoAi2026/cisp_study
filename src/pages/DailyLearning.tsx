import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Copy,
  Play,
  ChevronLeft,
  ChevronRight,
  Target,
  BookOpen,
  Code,
  FileQuestion,
  Clock,
  Wrench,
  Terminal,
  Server,
  ExternalLink,
  StickyNote,
  Award,
  User
} from 'lucide-react';
import { useLearningStore, useAchievementStore } from '../store';
import { learningData, weekThemes } from '../data/learningData';
import { Card, Badge, Button } from '../components/UI';
import { Pomodoro } from '../components/Pomodoro';

export const DailyLearning: React.FC = () => {
  const { dayId } = useParams<{ dayId: string }>();
  const navigate = useNavigate();
  const { markDayComplete, completedDays } = useLearningStore();
  const { checkAndUnlockBadge } = useAchievementStore();

  const [activeTab, setActiveTab] = useState<'content' | 'code' | 'quiz' | 'expert'>('content');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [note, setNote] = useState('');
  const [noteSavedAt, setNoteSavedAt] = useState<number | null>(null);
  const noteSaveTimer = useRef<number | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('cisp_notes');
    if (raw) {
      try {
        const obj = JSON.parse(raw);
        if (dayId && obj[dayId]) {
          setNote(obj[dayId].text || '');
          setNoteSavedAt(obj[dayId].updatedAt);
        } else {
          setNote('');
        }
      } catch {
        setNote('');
      }
    } else {
      setNote('');
    }
  }, [dayId]);

  const handleNoteChange = (value: string) => {
    setNote(value);
    if (noteSaveTimer.current) window.clearTimeout(noteSaveTimer.current);
    noteSaveTimer.current = window.setTimeout(() => {
      const raw = localStorage.getItem('cisp_notes') || '{}';
      let obj: Record<string, { text: string; updatedAt: number }> = {};
      try { obj = JSON.parse(raw); } catch {}
      if (dayId) {
        obj[dayId] = { text: value, updatedAt: Date.now() };
        localStorage.setItem('cisp_notes', JSON.stringify(obj));
        setNoteSavedAt(Date.now());
      }
    }, 800);
  };

  const currentDay = learningData.find(d => d.id === dayId) || learningData[0];
  const dayIndex = learningData.findIndex(d => d.id === dayId);
  const prevDay = dayIndex > 0 ? learningData[dayIndex - 1] : null;
  const nextDay = dayIndex < learningData.length - 1 ? learningData[dayIndex + 1] : null;

  const isCompleted = completedDays.some(cd => cd.dayId === dayId);
  const weekInfo = weekThemes[currentDay.week - 1];

  const handleMarkComplete = () => {
    if (!isCompleted) {
      markDayComplete(dayId!);
      checkAndUnlockBadge('complete_day_1');
      if (currentDay.day === 1) {
        checkAndUnlockBadge('day_1');
        checkAndUnlockBadge('first_quiz');
      }
      if (dayIndex === 6) {
        checkAndUnlockBadge('complete_week_1');
      }
    }
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    let correct = 0;
    currentDay.quiz?.forEach(q => {
      if (quizAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    const score = (correct / currentDay.quiz!.length) * 100;
    if (score >= 90) {
      checkAndUnlockBadge('quiz_90');
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/learning')}
        >
          返回路径
        </Button>
        <div className="flex items-center gap-2">
          {prevDay && (
            <Button
              variant="outline"
              size="sm"
              icon={ChevronLeft}
              onClick={() => navigate(`/learning/${prevDay.id}`)}
            >
              前一天
            </Button>
          )}
          {nextDay && (
            <Button
              variant="outline"
              size="sm"
              icon={ChevronRight}
              onClick={() => navigate(`/learning/${nextDay.id}`)}
            >
              下一天
            </Button>
          )}
        </div>
      </div>

      {/* Header */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="blue">第{currentDay.week}周</Badge>
              <Badge>Day {currentDay.day}</Badge>
              <span
                className="text-sm"
                style={{ color: weekInfo?.color }}
              >
                {weekInfo?.theme}
              </span>
            </div>
            <h1 className="font-orbitron text-2xl font-bold text-white mb-2">
              {currentDay.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Target size={14} />
                {currentDay.objectives?.length}个学习目标
              </span>
              <span className="flex items-center gap-1">
                <BookOpen size={14} />
                {currentDay.content?.length}字符
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                约30分钟
              </span>
            </div>
          </div>

          {isCompleted && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-green/10 border border-cyber-green/30">
              <CheckCircle size={20} className="text-cyber-green" />
              <span className="text-cyber-green font-medium">已完成</span>
            </div>
          )}
        </motion.div>

        {/* Learning Objectives */}
        <motion.div variants={itemVariants}>
          <Card className="mt-4">
            <h3 className="font-medium text-cyber-green mb-3 flex items-center gap-2">
              <Target size={18} />
              学习目标
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentDay.objectives?.map((obj, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-cyber-green/20 text-cyber-green text-xs flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-300">{obj}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recommended Tools & Lab Environments */}
        {(currentDay.recommendedTools?.length > 0 || currentDay.labEnvironments?.length > 0) && (
          <motion.div variants={itemVariants}>
            <Card className="mt-4">
              <h3 className="font-medium text-cyber-green mb-3 flex items-center gap-2">
                <Wrench size={18} />
                推荐工具与靶场
              </h3>

              {currentDay.recommendedTools?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm text-cyber-blue mb-2 flex items-center gap-2">
                    <Terminal size={14} />
                    安全工具
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {currentDay.recommendedTools.map((tool) => (
                      <a
                        key={tool.id}
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 rounded-lg bg-cyber-purple/30 border border-cyber-green/10 hover:border-cyber-green/30 hover:bg-cyber-purple/50 transition-all group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-cyber-green text-sm group-hover:text-white transition-colors">
                            {tool.name}
                          </span>
                          <ExternalLink size={12} className="text-gray-400 group-hover:text-cyber-green transition-colors" />
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {tool.description}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {currentDay.labEnvironments?.length > 0 && (
                <div>
                  <h4 className="text-sm text-cyber-blue mb-2 flex items-center gap-2">
                    <Server size={14} />
                    练习靶场
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {currentDay.labEnvironments.map((lab) => (
                      <a
                        key={lab.id}
                        href={lab.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 rounded-lg bg-cyber-blue/10 border border-cyber-blue/20 hover:border-cyber-blue/40 hover:bg-cyber-blue/20 transition-all group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-cyber-blue text-sm group-hover:text-white transition-colors">
                            {lab.name}
                          </span>
                          <ExternalLink size={12} className="text-gray-400 group-hover:text-cyber-blue transition-colors" />
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {lab.description}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* 学习笔记 & 番茄钟 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-cyber-green flex items-center gap-2">
                  <StickyNote size={18} /> 我的笔记
                </h3>
                <span className="text-xs text-gray-500">
                  {noteSavedAt ? '已保存 ' + new Date(noteSavedAt).toLocaleTimeString() : '自动保存'}
                </span>
              </div>
              <textarea
                value={note}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder="在这里记录你的学习心得、疑问或重点知识..."
                className="w-full h-48 bg-cyber-purple/10 border border-cyber-purple/30 rounded-lg p-3 text-sm text-white outline-none focus:border-cyber-green resize-y placeholder:text-gray-500"
              />
              <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                <span>共 {note.length} 字 · 自动保存到本地浏览器</span>
                <span>cisp_notes · {dayId}</span>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Pomodoro />
          </motion.div>
        </div>

        {/* Tabs */}
        <motion.div variants={itemVariants} className="flex gap-2 mt-6">
          {[
            { id: 'content', label: '知识点', icon: BookOpen },
            { id: 'code', label: '代码示例', icon: Code },
            { id: 'quiz', label: '练习题', icon: FileQuestion },
            ...(currentDay.expertNotes && currentDay.expertNotes.length > 0
              ? [{ id: 'expert', label: '大神笔记', icon: Award }]
              : []),
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                ${activeTab === tab.id
                  ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/30'
                  : 'text-gray-400 hover:text-white hover:bg-cyber-purple/40'
                }
              `}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div variants={itemVariants}>
          <Card className="mt-4">
            {activeTab === 'content' && (
              <div className="prose prose-invert max-w-none">
                <div className="text-gray-300 leading-relaxed">
                  <ReactMarkdown>
                    {currentDay.content || '# 暂无内容'}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {activeTab === 'code' && (
              <div className="space-y-4">
                {currentDay.codeExample ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-white">{currentDay.codeExample.description}</h3>
                        <p className="text-sm text-gray-400">
                          语言: {currentDay.codeExample.language}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Copy}
                        onClick={() => {
                          navigator.clipboard.writeText(currentDay.codeExample?.code || '');
                        }}
                      >
                        复制代码
                      </Button>
                    </div>
                    <pre className="code-block overflow-x-auto">
                      <code>{currentDay.codeExample.code}</code>
                    </pre>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        icon={Play}
                        onClick={() => {
                          // In a real app, this would run the code
                          alert('代码执行功能需要在真实环境中运行');
                        }}
                      >
                        运行代码
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-8">暂无代码示例</p>
                )}
              </div>
            )}

            {activeTab === 'quiz' && (
              <div className="space-y-6">
                {currentDay.quiz?.map((q, qIndex) => (
                  <div key={q.id} className="space-y-3">
                    <h4 className="font-medium text-white">
                      {qIndex + 1}. {q.question}
                    </h4>
                    <div className="space-y-2">
                      {q.options.map((opt, oIndex) => {
                        let optionClass = 'quiz-option';
                        if (quizSubmitted) {
                          if (oIndex === q.correctIndex) {
                            optionClass += ' correct';
                          } else if (oIndex === quizAnswers[q.id] && oIndex !== q.correctIndex) {
                            optionClass += ' incorrect';
                          }
                        } else if (quizAnswers[q.id] === oIndex) {
                          optionClass += ' selected';
                        }

                        return (
                          <div
                            key={oIndex}
                            className={optionClass}
                            onClick={() => !quizSubmitted && setQuizAnswers({ ...quizAnswers, [q.id]: oIndex })}
                          >
                            <span className="font-medium mr-2">
                              {String.fromCharCode(65 + oIndex)}.
                            </span>
                            {opt}
                          </div>
                        );
                      })}
                    </div>
                    {quizSubmitted && (
                      <div className="p-3 rounded-lg bg-cyber-purple/20 border border-cyber-green/10">
                        <p className="text-sm text-cyber-green">
                          <strong>解析:</strong> {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex gap-3 pt-4 border-t border-cyber-green/10">
                  {!quizSubmitted ? (
                    <Button onClick={handleQuizSubmit} disabled={Object.keys(quizAnswers).length < (currentDay.quiz?.length || 0)}>
                      提交答案
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-cyber-green font-medium">
                        得分: {
                          Math.round(
                            (currentDay.quiz?.filter(q => quizAnswers[q.id] === q.correctIndex).length || 0) /
                            (currentDay.quiz?.length || 1) * 100
                          )
                        }%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'expert' && currentDay.expertNotes && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award size={18} className="text-cyber-gold" />
                  <span className="text-cyber-gold font-medium">大神笔记</span>
                  <span className="text-xs text-gray-500">行业专家的实战经验分享</span>
                </div>
                {currentDay.expertNotes.map((note, i) => (
                  <div key={i} className="p-4 rounded-lg bg-gradient-to-r from-cyber-gold/5 to-cyber-purple/5 border border-cyber-gold/20 hover:border-cyber-gold/40 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <User size={14} className="text-cyber-gold" />
                      <span className="text-sm font-medium text-cyber-gold">{note.author}</span>
                      <span className="text-xs text-gray-500">·</span>
                      <span className="text-xs text-gray-400">{note.title}</span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{note.content}</p>
                    {note.url && (
                      <a
                        href={note.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-xs text-cyber-gold hover:text-cyber-green transition-colors"
                      >
                        <ExternalLink size={12} />
                        查看原文
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div variants={itemVariants} className="flex justify-between mt-6">
          <div>
            {prevDay && (
              <Button
                variant="outline"
                icon={ArrowLeft}
                onClick={() => navigate(`/learning/${prevDay.id}`)}
              >
                {prevDay.title}
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            {!isCompleted && (
              <Button onClick={handleMarkComplete}>
                <CheckCircle size={16} />
                完成今日学习
              </Button>
            )}
            {nextDay && (
              <Button
                icon={ArrowRight}
                onClick={() => navigate(`/learning/${nextDay.id}`)}
              >
                下一节
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DailyLearning;
