// 网络安全学习 - 每日课程详情页
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Target,
  Wrench,
  Terminal,
  Server,
  ExternalLink,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Play,
  Star,
  AlertTriangle,
  Copy,
  Check,
  Award,
  User,
  AlertCircle
} from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';
import { cyberBasicPlan, CyberLearningPlan, CyberDay, QuizQuestion } from '../data/cyberBasic';
import { cyberPenetrationPlan } from '../data/cyberPenetration';
import { cyberDefensePlan } from '../data/cyberDefense';
import { Pomodoro } from '../components/Pomodoro';

const plans: Record<string, CyberLearningPlan> = {
  basic: cyberBasicPlan,
  penetration: cyberPenetrationPlan,
  defense: cyberDefensePlan
};

const planColor = (planId: string) => {
  if (planId === 'basic') return { main: 'text-cyber-green', bg: 'bg-cyber-green', border: 'border-cyber-green' };
  if (planId === 'penetration') return { main: 'text-cyber-red', bg: 'bg-cyber-red', border: 'border-cyber-red' };
  return { main: 'text-cyber-blue', bg: 'bg-cyber-blue', border: 'border-cyber-blue' };
};

export const CyberDailyLearning: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();

  const plan = planId ? plans[planId] : null;

  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<(number | number[] | string | null)[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [noteSavedAt, setNoteSavedAt] = useState<number | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [wrongQuestions, setWrongQuestions] = useState<Array<{ planId: string; day: number; questionIndex: number; consecutiveCorrect: number }>>([]);
  const saveTimer = React.useRef<number | null>(null);

  useEffect(() => {
    if (!planId) return;
    try {
      const raw = localStorage.getItem('cisp_cyber_progress');
      if (raw) {
        const data = JSON.parse(raw);
        if (data[planId]?.completedDays) {
          setCompletedDays(new Set(data[planId].completedDays));
        }
      }
    } catch {}
    // 加载错题本
    try {
      const raw = localStorage.getItem('cisp_wrong_questions');
      if (raw) {
        setWrongQuestions(JSON.parse(raw));
      }
    } catch {}
  }, [planId]);

  useEffect(() => {
    if (!planId) return;
    const noteKey = `cyber_${planId}_${currentDay}`;
    const raw = localStorage.getItem(noteKey);
    if (raw) {
      try { setNote(raw); setNoteSavedAt(Date.now()); } catch {}
    } else {
      setNote(''); setNoteSavedAt(null);
    }
  }, [planId, currentDay]);

  useEffect(() => {
    // 重置测验状态
    setCurrentQuizIndex(0);
    setQuizAnswers([]);
    setShowAnswer(false);
  }, [currentDay, planId]);

  const handleNoteChange = (val: string) => {
    setNote(val);
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      if (!planId) return;
      const noteKey = `cyber_${planId}_${currentDay}`;
      localStorage.setItem(noteKey, val);
      setNoteSavedAt(Date.now());
    }, 800);
  };

  const saveWrongQuestion = (questionIndex: number, isCorrect: boolean) => {
    if (!planId) return;
    
    const key = `${planId}_${currentDay}_${questionIndex}`;
    let updated = [...wrongQuestions];
    
    if (isCorrect) {
      // 答对了，更新连续答对次数
      const idx = updated.findIndex(w => `${w.planId}_${w.day}_${w.questionIndex}` === key);
      if (idx >= 0) {
        updated[idx].consecutiveCorrect += 1;
        // 连续答对3次，移除错题本
        if (updated[idx].consecutiveCorrect >= 3) {
          updated.splice(idx, 1);
        }
      }
    } else {
      // 答错了，添加或重置连续答对次数
      const idx = updated.findIndex(w => `${w.planId}_${w.day}_${w.questionIndex}` === key);
      if (idx >= 0) {
        updated[idx].consecutiveCorrect = 0;
      } else {
        updated.push({ planId, day: currentDay, questionIndex, consecutiveCorrect: 0 });
      }
    }
    
    setWrongQuestions(updated);
    localStorage.setItem('cisp_wrong_questions', JSON.stringify(updated));
  };

  const handleQuizAnswer = (answer: number | number[] | string) => {
    const question = day?.quiz?.[currentQuizIndex];
    if (!question || showAnswer) return;
    
    const newAnswers = [...quizAnswers];
    newAnswers[currentQuizIndex] = answer;
    setQuizAnswers(newAnswers);
    setShowAnswer(true);
    
    // 判断是否正确
    let isCorrect = false;
    if (question.type === 'single') {
      isCorrect = answer === question.correctIndex;
    } else if (question.type === 'multiple') {
      const correctIndices = question.correctIndices || [];
      const userIndices = Array.isArray(answer) ? answer : [];
      isCorrect = correctIndices.length === userIndices.length && 
                  correctIndices.every(i => userIndices.includes(i));
    } else if (question.type === 'boolean') {
      isCorrect = answer === question.correctIndex;
    } else if (question.type === 'fill') {
      isCorrect = String(answer).toLowerCase().trim() === String(question.correctAnswer).toLowerCase().trim();
    }
    
    saveWrongQuestion(currentQuizIndex, isCorrect);
  };

  const handleMultipleSelect = (index: number) => {
    const current = quizAnswers[currentQuizIndex];
    const currentArray = Array.isArray(current) ? current : [];
    let newSelection: number[];
    
    if (currentArray.includes(index)) {
      newSelection = currentArray.filter(i => i !== index);
    } else {
      newSelection = [...currentArray, index].sort((a, b) => a - b);
    }
    
    const newAnswers = [...quizAnswers];
    newAnswers[currentQuizIndex] = newSelection;
    setQuizAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (!day?.quiz || currentQuizIndex >= day.quiz.length - 1) {
      // 完成所有题目
      markComplete();
    } else {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setShowAnswer(false);
    }
  };

  const markComplete = () => {
    if (!planId) return;
    const newSet = new Set(completedDays);
    if (newSet.has(currentDay)) {
      newSet.delete(currentDay);
    } else {
      newSet.add(currentDay);
    }
    setCompletedDays(newSet);
    const raw = localStorage.getItem('cisp_cyber_progress') || '{}';
    let data: any = {};
    try { data = JSON.parse(raw); } catch {}
    data[planId] = { ...data[planId], completedDays: Array.from(newSet) };
    localStorage.setItem('cisp_cyber_progress', JSON.stringify(data));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCmd(id);
      setTimeout(() => setCopiedCmd(null), 2000);
    });
  };

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertTriangle size={48} className="text-cyber-gold mb-4" />
        <h2 className="font-orbitron text-xl text-white mb-2">学习计划不存在</h2>
        <Button onClick={() => navigate('/cyber-learning')}>返回学习中心</Button>
      </div>
    );
  }

  const day = plan.days.find(d => d.day === currentDay);
  const color = planColor(planId!);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/cyber-learning')}
            className="p-2 rounded-lg border border-cyber-purple/30 hover:bg-cyber-purple/20 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className={`font-orbitron text-xl font-bold ${color.main}`}>
                {plan.icon} {plan.name}
              </span>
              <Badge
                className={planId === 'basic' ? 'bg-cyber-green/20 text-cyber-green' :
                           planId === 'penetration' ? 'bg-cyber-red/20 text-cyber-red' :
                           'bg-cyber-blue/20 text-cyber-blue'}
              >
                第{currentDay}天
              </Badge>
            </div>
            <p className="text-sm text-gray-400">{plan.description}</p>
          </div>
        </div>
        <Button
          onClick={markComplete}
          variant={completedDays.has(currentDay) ? 'outline' : 'primary'}
          className={completedDays.has(currentDay) ? `${color.border} text-${planId === 'basic' ? 'cyber-green' : planId === 'penetration' ? 'cyber-red' : 'cyber-blue'}` : ''}
        >
          {completedDays.has(currentDay) ? (
            <><CheckCircle size={16} /> 已完成</>
          ) : (
            <><Star size={16} /> 完成今日学习</>
          )}
        </Button>
      </motion.div>

      {/* Day Navigation */}
      <motion.div variants={itemVariants}>
        <Card className={`border-${planId === 'basic' ? 'cyber-green' : planId === 'penetration' ? 'cyber-red' : 'cyber-blue'}/20`}>
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            {[...plan.days].sort((a, b) => a.day - b.day).map((d) => (
              <button
                key={d.day}
                onClick={() => { setCurrentDay(d.day); }}
                className={`
                  flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium
                  transition-all duration-200
                  ${currentDay === d.day
                    ? `${color.bg}/20 ${color.main} border ${color.border}/30`
                    : completedDays.has(d.day)
                      ? 'bg-cyber-green/10 text-cyber-green border border-cyber-green/20'
                      : 'bg-cyber-purple/10 text-gray-400 border border-cyber-purple/20 hover:bg-cyber-purple/20'
                  }
                `}
              >
                {completedDays.has(d.day) ? <CheckCircle size={16} /> : d.day}
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Main Content */}
      {day && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* 课程标题 */}
          <motion.div variants={itemVariants}>
            <Card>
              <h2 className="font-orbitron text-xl font-bold text-white mb-1">
                {day.title}
              </h2>
              <p className="text-sm text-gray-500 mb-4">{day.subtitle}</p>

              {/* 学习目标 */}
              <div className="mb-4">
                <h3 className={`text-sm font-medium ${color.main} mb-2 flex items-center gap-2`}>
                  <Target size={16} />
                  学习目标
                </h3>
                <div className="space-y-1">
                  {day.objectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className={`${color.main} mt-0.5`}>▸</span>
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 核心要点 */}
              <div className="bg-cyber-purple/5 rounded-lg p-4">
                <h3 className={`text-sm font-medium ${color.main} mb-3 flex items-center gap-2`}>
                  <BookOpen size={16} />
                  核心知识点
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {day.keyPoints.map((kp, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-cyber-purple mt-0.5">★</span>
                      <span>{kp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* 课程内容 */}
          <motion.div variants={itemVariants}>
            <Card>
              <button
                onClick={() => setExpanded(expanded === 'content' ? null : 'content')}
                className="flex items-center justify-between w-full mb-3"
              >
                <h3 className={`text-sm font-medium ${color.main} flex items-center gap-2`}>
                  <BookOpen size={16} />
                  课程内容
                </h3>
                {expanded === 'content' ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </button>
              {expanded !== 'content' && (
                <div
                  className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: day.content.replace(/\n/g, '<br/>').replace(/### /g, '<h4 class="text-cyber-purple font-medium mt-3 mb-2">').replace(/## /g, '<h3 class="text-white font-medium mt-4 mb-2">').replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyber-green">$1</strong>').replace(/`([^`]+)`/g, '<code class="bg-cyber-purple/20 text-cyber-green px-1 py-0.5 rounded text-xs">$1</code>').replace(/```[\s\S]*?```/g, (m) => '<pre class="bg-cyber-black/50 border border-cyber-purple/20 rounded p-3 text-xs overflow-x-auto my-2"><code>' + m.replace(/```\w*\n?/g, '').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code></pre>') }}
                />
              )}
            </Card>
          </motion.div>

          {/* 代码示例 */}
          {day.codeExamples && day.codeExamples.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <h3 className={`text-sm font-medium ${color.main} mb-3 flex items-center gap-2`}>
                  <Terminal size={16} />
                  代码示例
                </h3>
                <div className="space-y-4">
                  {day.codeExamples.map((example, i) => (
                    <div key={i} className="border border-cyber-purple/20 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-2 bg-cyber-purple/10 border-b border-cyber-purple/20">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-300">{example.title}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-cyber-green/20 text-cyber-green">
                            {example.language}
                          </span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(example.code, `code-${i}`)}
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-cyber-green transition-colors"
                        >
                          {copiedCmd === `code-${i}` ? <Check size={14} /> : <Copy size={14} />}
                          {copiedCmd === `code-${i}` ? '已复制' : '复制'}
                        </button>
                      </div>
                      <pre className="bg-cyber-black/50 p-4 text-xs overflow-x-auto">
                        <code className="text-gray-300 font-mono">{example.code}</code>
                      </pre>
                      <div className="px-3 py-2 bg-cyber-purple/5 border-t border-cyber-purple/20">
                        <p className="text-xs text-gray-400">
                          <span className="text-cyber-green mr-1">💡</span>
                          {example.explanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* 推荐工具 */}
          {day.recommendedTools && day.recommendedTools.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <h3 className={`text-sm font-medium ${color.main} mb-3 flex items-center gap-2`}>
                  <Wrench size={16} />
                  推荐工具
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {day.recommendedTools.map((tool, i) => (
                    <a
                      key={i}
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3 rounded-lg bg-cyber-purple/10 border border-cyber-purple/20 hover:border-cyber-purple/40 transition-colors group"
                    >
                      <Terminal size={18} className={`${color.main} mt-0.5`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white group-hover:text-cyber-green transition-colors">
                          {tool.name}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">{tool.description}</div>
                      </div>
                      <ExternalLink size={14} className="text-gray-500 group-hover:text-cyber-green flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* 靶场环境 */}
          {day.labEnvironment && day.labEnvironment.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className={`border-${planId === 'basic' ? 'cyber-green' : planId === 'penetration' ? 'cyber-red' : 'cyber-blue'}/20`}>
                <h3 className={`text-sm font-medium ${color.main} mb-3 flex items-center gap-2`}>
                  <Server size={16} />
                  实验靶场
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {day.labEnvironment.map((lab, i) => (
                    <div
                      key={i}
                      className={`
                        block p-4 rounded-lg border transition-all
                        ${lab.type === 'docker'
                          ? 'bg-cyber-green/5 border-cyber-green/20 hover:border-cyber-green/40'
                          : lab.type === 'online'
                            ? 'bg-cyber-blue/5 border-cyber-blue/20 hover:border-cyber-blue/40'
                            : 'bg-cyber-purple/5 border-cyber-purple/20 hover:border-cyber-purple/40'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-medium text-sm ${color.main}`}>
                          {lab.name}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          lab.type === 'docker' ? 'bg-cyber-green/20 text-cyber-green' :
                          lab.type === 'online' ? 'bg-cyber-blue/20 text-cyber-blue' :
                          'bg-cyber-purple/20 text-cyber-purple'
                        }`}>
                          {lab.type === 'docker' ? 'Docker' : lab.type === 'online' ? '在线' : '本地'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">{lab.description}</p>
                      
                      {lab.setup && (
                        <div className="mb-2 p-2 bg-cyber-black/30 rounded text-xs">
                          <p className="text-gray-400 mb-1">📋 搭建步骤：</p>
                          <pre className="text-gray-300 whitespace-pre-wrap font-mono">{lab.setup}</pre>
                        </div>
                      )}
                      
                      {lab.expectedOutput && (
                        <div className="mb-2 p-2 bg-cyber-green/10 rounded text-xs">
                          <p className="text-cyber-green mb-1">✅ 预期效果：</p>
                          <span className="text-gray-300">{lab.expectedOutput}</span>
                        </div>
                      )}
                      
                      <a
                        href={lab.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-cyber-green transition-colors"
                      >
                        <ExternalLink size={12} />
                        访问
                      </a>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* 学习资源 */}
          {day.resources && day.resources.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <h3 className={`text-sm font-medium ${color.main} mb-3 flex items-center gap-2`}>
                  <BookOpen size={16} />
                  学习资源
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {day.resources.map((resource, i) => (
                    <a
                      key={i}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-cyber-purple/10 border border-cyber-purple/20 hover:border-cyber-purple/40 transition-colors group"
                    >
                      <div className={`w-8 h-8 rounded flex items-center justify-center ${
                        resource.type === 'article' ? 'bg-cyber-blue/20' :
                        resource.type === 'video' ? 'bg-cyber-red/20' :
                        'bg-cyber-green/20'
                      }`}>
                        {resource.type === 'article' ? (
                          <BookOpen size={16} className="text-cyber-blue" />
                        ) : resource.type === 'video' ? (
                          <Play size={16} className="text-cyber-red" />
                        ) : (
                          <Star size={16} className="text-cyber-green" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white group-hover:text-cyber-green transition-colors">
                          {resource.name}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {resource.type === 'article' ? '文章' : resource.type === 'video' ? '视频' : '书籍'}
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-gray-500 group-hover:text-cyber-green flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* 随堂测验 */}
          {day.quiz && day.quiz.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-sm font-medium ${color.main} flex items-center gap-2`}>
                    <Target size={16} />
                    随堂测验
                  </h3>
                  <span className="text-xs text-gray-400">
                    {currentQuizIndex + 1} / {day.quiz.length}
                  </span>
                </div>
                
                {day.quiz[currentQuizIndex] && (() => {
                  const question = day.quiz[currentQuizIndex] as QuizQuestion;
                  const userAnswer = quizAnswers[currentQuizIndex];
                  
                  const isCorrect = (() => {
                    if (!showAnswer) return null;
                    if (question.type === 'single' || question.type === 'boolean') {
                      return userAnswer === question.correctIndex;
                    } else if (question.type === 'multiple') {
                      const correctIndices = question.correctIndices || [];
                      const userIndices = Array.isArray(userAnswer) ? userAnswer : [];
                      return correctIndices.length === userIndices.length && 
                             correctIndices.every(i => userIndices.includes(i));
                    } else if (question.type === 'fill') {
                      return String(userAnswer).toLowerCase().trim() === String(question.correctAnswer).toLowerCase().trim();
                    }
                    return false;
                  })();
                  
                  return (
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <span className={`text-xs px-2 py-1 rounded mr-2 ${
                          question.type === 'single' ? 'bg-cyber-blue/20 text-cyber-blue' :
                          question.type === 'multiple' ? 'bg-cyber-green/20 text-cyber-green' :
                          question.type === 'boolean' ? 'bg-cyber-gold/20 text-cyber-gold' :
                          'bg-cyber-purple/20 text-cyber-purple'
                        }`}>
                          {question.type === 'single' ? '单选' :
                           question.type === 'multiple' ? '多选' :
                           question.type === 'boolean' ? '判断' : '填空'}
                        </span>
                        <p className="text-sm text-white font-medium leading-relaxed flex-1">
                          {question.question}
                        </p>
                      </div>
                      
                      {/* 选择题选项 */}
                      {question.options && (question.type === 'single' || question.type === 'boolean' || question.type === 'multiple') && (
                        <div className="space-y-2">
                          {question.options.map((opt, i) => {
                            const isSelected = question.type === 'multiple' 
                              ? (Array.isArray(userAnswer) && userAnswer.includes(i))
                              : userAnswer === i;
                            
                            let cls = `${color.border}/30 bg-cyber-purple/10 hover:${color.border}/40`;
                            if (showAnswer) {
                              const isCorrectOption = question.type === 'multiple' 
                                ? (question.correctIndices || []).includes(i)
                                : i === question.correctIndex;
                              
                              if (isCorrectOption) cls = 'border-cyber-green/50 bg-cyber-green/10';
                              else if (isSelected) cls = 'border-cyber-red/50 bg-cyber-red/10';
                              else cls = `${color.border}/20 bg-transparent opacity-50`;
                            }
                            
                            return (
                              <button
                                key={i}
                                onClick={() => {
                                  if (!showAnswer) {
                                    if (question.type === 'multiple') {
                                      handleMultipleSelect(i);
                                    } else {
                                      handleQuizAnswer(i);
                                    }
                                  }
                                }}
                                disabled={showAnswer}
                                className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${cls}`}
                              >
                                <span className="text-sm font-mono mr-2 text-gray-400">
                                  {String.fromCharCode(65 + i)}.
                                </span>
                                <span className="text-sm text-gray-200">{opt}</span>
                                {question.type === 'multiple' && !showAnswer && (
                                  <span className={`ml-auto text-xs ${isSelected ? 'text-cyber-green' : 'text-gray-500'}`}>
                                    {isSelected ? '✓' : '○'}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      
                      {/* 填空题输入框 */}
                      {question.type === 'fill' && (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={String(userAnswer || '')}
                            onChange={(e) => {
                              const newAnswers = [...quizAnswers];
                              newAnswers[currentQuizIndex] = e.target.value;
                              setQuizAnswers(newAnswers);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !showAnswer) {
                                handleQuizAnswer((userAnswer as string) || '');
                              }
                            }}
                            disabled={showAnswer}
                            className="w-full px-4 py-3 bg-cyber-purple/10 border border-cyber-purple/30 rounded-lg text-white text-sm outline-none focus:border-cyber-green"
                            placeholder="请输入答案..."
                          />
                          {!showAnswer && (
                            <button
                              onClick={() => handleQuizAnswer((userAnswer as string) || '')}
                              className={`w-full py-2 rounded-lg ${color.bg}/20 text-${color.main} border border-${color.border}/30 hover:border-${color.border}/50 transition-colors`}
                            >
                              提交答案
                            </button>
                          )}
                        </div>
                      )}
                      
                      {/* 提交按钮（多选） */}
                      {question.type === 'multiple' && !showAnswer && (
                        <button
                          onClick={() => handleQuizAnswer(userAnswer as number[] || [])}
                          className={`w-full py-2 rounded-lg ${color.bg}/20 text-${color.main} border border-${color.border}/30 hover:border-${color.border}/50 transition-colors`}
                        >
                          提交答案
                        </button>
                      )}
                      
                      {/* 答案解析 */}
                      {showAnswer && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-lg bg-cyber-purple/10 border border-cyber-purple/20"
                        >
                          <div className={`flex items-center gap-2 mb-2 ${isCorrect ? 'text-cyber-green' : 'text-cyber-red'}`}>
                            {isCorrect ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                            <span className="font-medium text-sm">
                              {isCorrect ? '回答正确！' : '回答错误'}
                            </span>
                          </div>
                          {question.type === 'fill' && question.correctAnswer && (
                            <div className="text-sm text-cyber-green mb-2">
                              <span className="text-gray-400">正确答案：</span>{question.correctAnswer}
                            </div>
                          )}
                          <p className="text-sm text-gray-300 leading-relaxed">{question.explanation}</p>
                        </motion.div>
                      )}
                      
                      {/* 下一题按钮 */}
                      {showAnswer && (
                        <button
                          onClick={nextQuestion}
                          className={`w-full py-2 rounded-lg ${color.bg}/20 text-${color.main} border border-${color.border}/30 hover:border-${color.border}/50 transition-colors`}
                        >
                          {currentQuizIndex >= day.quiz.length - 1 ? '完成测验' : '下一题'}
                        </button>
                      )}
                    </div>
                  );
                })()}
              </Card>
            </motion.div>
          )}

          {/* 大神笔记 */}
          {day.expertNotes && day.expertNotes.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-cyber-gold/5 to-cyber-purple/5 border-cyber-gold/20">
                <h3 className="text-sm font-medium text-cyber-gold mb-3 flex items-center gap-2">
                  <Award size={16} />
                  大神笔记
                </h3>
                <div className="space-y-4">
                  {day.expertNotes.map((note, i) => (
                    <div key={i} className="p-4 rounded-lg bg-cyber-black/30 border border-cyber-gold/10">
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
              </Card>
            </motion.div>
          )}

          {/* 错题本入口 */}
          {wrongQuestions.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="bg-cyber-red/5 border-cyber-red/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-cyber-red flex items-center gap-2">
                    <AlertCircle size={16} />
                    错题本
                    <Badge className="bg-cyber-red/20 text-cyber-red">{wrongQuestions.length}道错题</Badge>
                  </h3>
                  <span className="text-xs text-gray-500">连续答对3次可移除</span>
                </div>
                <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                  {wrongQuestions.slice(0, 5).map((wq, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-cyber-black/30">
                      <div className="text-xs">
                        <span className="text-cyber-green">第{wq.day}天</span>
                        <span className="text-gray-500">· 题{wq.questionIndex + 1}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        连续答对 {wq.consecutiveCorrect}/3
                      </span>
                    </div>
                  ))}
                  {wrongQuestions.length > 5 && (
                    <div className="text-center text-xs text-gray-500 py-1">
                      还有 {wrongQuestions.length - 5} 道错题...
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-cyber-green flex items-center gap-2">
                    📝 学习笔记
                  </h3>
                  <span className="text-xs text-gray-500">
                    {noteSavedAt ? '已保存' : '自动保存'}
                  </span>
                </div>
                <textarea
                  value={note}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  placeholder="记录学习心得、疑问、重点..."
                  className="w-full h-48 bg-cyber-purple/10 border border-cyber-purple/30 rounded-lg p-3 text-sm text-white outline-none focus:border-cyber-green resize-y placeholder:text-gray-500"
                />
                <div className="mt-2 text-xs text-gray-500">
                  共 {note.length} 字 · 第{currentDay}天笔记
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Pomodoro />
            </motion.div>
          </div>

          {/* 导航按钮 */}
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <Button
              onClick={() => { setCurrentDay(Math.max(1, currentDay - 1)); }}
              disabled={currentDay === 1}
              variant="outline"
            >
              <ArrowLeft size={16} />
              上一天
            </Button>
            <span className="text-sm text-gray-400">
              第 {currentDay} 天 / 共 {plan.totalDays} 天
            </span>
            <Button
              onClick={() => {
                if (currentDay < plan.totalDays) {
                  setCurrentDay(currentDay + 1);
                }
              }}
              disabled={currentDay === plan.totalDays}
              variant="outline"
            >
              下一天
              <ArrowRight size={16} />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default CyberDailyLearning;
