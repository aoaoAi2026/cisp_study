// 网络安全学习 - 每日课程详情页
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cyberBasicPlan, CyberLearningPlan, CyberDay, QuizQuestion } from '../data/cyberBasic';
import { cyberPenetrationPlan } from '../data/cyberPenetration';
import { cyberDefensePlan } from '../data/cyberDefense';
import { cyberAiPlan } from '../data/cyberAi';
import { Pomodoro } from '../components/Pomodoro';
import { saveData, loadData } from '../data/persistData';
import { useQuizPractice, useWrongQuestionBook, checkQuizAnswer } from '../hooks';

// 静态导入所有课程 .md 文件，避免运行时 fetch 路径问题
const mdModules = import.meta.glob<{ default: string }>('../../public/contents/cyber-learning/**/*.md', {
  query: '?raw',
  eager: true,
});

/** 根据 planId 和 day 获取 .md 内容 */
function getMdFile(planId: string, day: number): string | null {
  // 尝试多种可能的 key 格式
  const candidates = [
    `../../public/contents/cyber-learning/${planId}/day-${day}.md`,
    `/src/contents/cyber-learning/${planId}/day-${day}.md`,
  ];
  for (const key of candidates) {
    if (mdModules[key]) return (mdModules[key] as any).default || (mdModules[key] as any);
  }
  // glob 返回的 key 可能是绝对路径或不同格式，遍历匹配
  for (const [modKey, mod] of Object.entries(mdModules)) {
    if (modKey.includes(`/${planId}/day-${day}.md`)) {
      return (mod as any).default || (mod as any);
    }
  }
  return null;
}

const plans: Record<string, CyberLearningPlan> = {
  basic: cyberBasicPlan,
  penetration: cyberPenetrationPlan,
  defense: cyberDefensePlan,
  ai: cyberAiPlan
};

const planColor = (planId: string) => {
  if (planId === 'basic') return {
    main: 'text-cyber-green',
    bg: 'bg-cyber-green',
    border: 'border-cyber-green',
    bgLight: 'bg-cyber-green/20',
    borderLight: 'border-cyber-green/40',
    borderFaint: 'border-cyber-green/50',
    borderSoft: 'border-cyber-green/50',
    borderStrong: 'border-cyber-green/70',
    cardBorder: 'border-cyber-green/30',
    textColor: 'text-cyber-green',
    optionDefault: 'border-cyber-green/40 bg-white/5 hover:border-cyber-green/70 hover:bg-cyber-green/15',
    optionCorrect: 'border-cyber-green/60 bg-cyber-green/20',
    optionWrong: 'border-cyber-red/60 bg-cyber-red/20',
    optionDim: 'border-cyber-green/20 bg-transparent opacity-40',
    btnDefault: 'bg-[#00cc66] text-black font-semibold hover:bg-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,0.3)] hover:shadow-[0_0_20px_rgba(0,255,136,0.5)]',
  };
  if (planId === 'penetration') return {
    main: 'text-cyber-red',
    bg: 'bg-cyber-red',
    border: 'border-cyber-red',
    bgLight: 'bg-cyber-red/20',
    borderLight: 'border-cyber-red/40',
    borderFaint: 'border-cyber-red/50',
    borderSoft: 'border-cyber-red/50',
    borderStrong: 'border-cyber-red/70',
    cardBorder: 'border-cyber-red/30',
    textColor: 'text-cyber-red',
    optionDefault: 'border-cyber-red/40 bg-white/5 hover:border-cyber-red/70 hover:bg-cyber-red/15',
    optionCorrect: 'border-cyber-green/60 bg-cyber-green/20',
    optionWrong: 'border-cyber-red/60 bg-cyber-red/20',
    optionDim: 'border-cyber-red/20 bg-transparent opacity-40',
    btnDefault: 'bg-[#e04444] text-white font-semibold hover:bg-[#ff5555] shadow-[0_0_12px_rgba(255,68,68,0.3)] hover:shadow-[0_0_20px_rgba(255,68,68,0.5)]',
  };
  if (planId === 'ai') return {
    main: 'text-gray-200',
    bg: 'bg-cyber-purple',
    border: 'border-cyber-purple',
    bgLight: 'bg-cyber-purple/15',
    borderLight: 'border-white/15',
    borderFaint: 'border-white/25',
    borderSoft: 'border-white/30',
    borderStrong: 'border-white/40',
    cardBorder: 'border-white/10',
    textColor: 'text-gray-300',
    optionDefault: 'border-white/30 bg-white/5 text-gray-200 hover:border-white/50 hover:bg-white/10',
    optionCorrect: 'border-cyber-green/60 bg-cyber-green/20',
    optionWrong: 'border-cyber-red/60 bg-cyber-red/20',
    optionDim: 'border-white/15 bg-transparent opacity-40',
    btnDefault: 'bg-[#7b6ba8] text-white font-semibold hover:bg-[#9588c0] shadow-[0_0_12px_rgba(123,107,168,0.35)] hover:shadow-[0_0_18px_rgba(123,107,168,0.5)]',
  };
  return {
    main: 'text-cyber-blue',
    bg: 'bg-cyber-blue',
    border: 'border-cyber-blue',
    bgLight: 'bg-cyber-blue/20',
    borderLight: 'border-cyber-blue/40',
    borderFaint: 'border-cyber-blue/50',
    borderSoft: 'border-cyber-blue/50',
    borderStrong: 'border-cyber-blue/70',
    cardBorder: 'border-cyber-blue/30',
    textColor: 'text-cyber-blue',
    optionDefault: 'border-cyber-blue/40 bg-white/5 hover:border-cyber-blue/70 hover:bg-cyber-blue/15',
    optionCorrect: 'border-cyber-green/60 bg-cyber-green/20',
    optionWrong: 'border-cyber-red/60 bg-cyber-red/20',
    optionDim: 'border-cyber-blue/20 bg-transparent opacity-40',
    btnDefault: 'bg-[#3388ee] text-white font-semibold hover:bg-[#5599ff] shadow-[0_0_12px_rgba(51,136,238,0.3)] hover:shadow-[0_0_20px_rgba(51,136,238,0.5)]',
  };
};

export const CyberDailyLearning: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();

  const plan = planId ? plans[planId] : null;

  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [noteSavedAt, setNoteSavedAt] = useState<number | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [mdContent, setMdContent] = useState<string | null>(null);
  const [mdLoading, setMdLoading] = useState(false);
  const [mdError, setMdError] = useState<string | null>(null);
  const saveTimer = React.useRef<number | null>(null);

  // 测验和错题本 hooks
  const day = useMemo(
    () => plan?.days.find(d => d.day === currentDay),
    [plan, currentDay],
  );
  const quiz = useQuizPractice(day?.quiz || []);
  const wrongQuestionBook = useWrongQuestionBook();

  // 切换天时重置测验
  const resetQuiz = useCallback(() => { quiz.reset(); }, [quiz.reset]);
  useEffect(() => {
    resetQuiz();
  }, [resetQuiz]);

  useEffect(() => {
    if (!planId) return;
    async function load() {
      const data = await loadData<any>('cisp_cyber_progress', {});
      if (data[planId]?.completedDays) {
        setCompletedDays(new Set(data[planId].completedDays));
      }
    }
    load();
  }, [planId]);

  useEffect(() => {
    if (!planId) return;
    async function load() {
      const noteKey = `cyber_${planId}_${currentDay}`;
      const raw = await loadData<string>(noteKey, '');
      if (raw) { setNote(raw); setNoteSavedAt(Date.now()); } else { setNote(''); setNoteSavedAt(null); }
    }
    load();
  }, [planId, currentDay]);

  // 加载 .md 课程内容（静态导入，无需网络请求）
  useEffect(() => {
    if (!planId) return;
    const content = getMdFile(planId, currentDay);
    setMdContent(content);
    setMdLoading(false);
    setMdError(content ? null : null); // 无文件时静默 fallback 到 day.content
  }, [planId, currentDay]);

  const handleNoteChange = (val: string) => {
    setNote(val);
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      if (!planId) return;
      const noteKey = `cyber_${planId}_${currentDay}`;
      await saveData(noteKey, val);
      setNoteSavedAt(Date.now());
    }, 800);
  };

  const handleQuizAnswer = (answer: number | number[] | string) => {
    if (quiz.showAnswer) return;
    const isCorrect = quiz.answerOne(answer);
    wrongQuestionBook.recordAnswer(planId!, currentDay, quiz.currentIndex, isCorrect);
  };

  const handleMultipleSelect = (index: number) => {
    quiz.toggleMultiple(index);
  };

  const nextQuestion = () => {
    if (quiz.isLastQuestion) {
      markComplete();
    } else {
      quiz.nextQuestion();
    }
  };

  const markComplete = async () => {
    if (!planId) return;
    const newSet = new Set(completedDays);
    if (newSet.has(currentDay)) { newSet.delete(currentDay); } else { newSet.add(currentDay); }
    setCompletedDays(newSet);
    const data = await loadData<any>('cisp_cyber_progress', {});
    data[planId] = { ...data[planId], completedDays: Array.from(newSet) };
    await saveData('cisp_cyber_progress', data);
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
                           planId === 'ai' ? 'bg-[#6b5b95]/25 text-gray-200 border border-[#6b5b95]/30' :
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
          colorScheme={planId}
          className={completedDays.has(currentDay) ? `${color.border} ${color.textColor}` : ''}
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
        <Card className={color.cardBorder}>
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            {[...plan.days].sort((a, b) => a.day - b.day).map((d) => (
              <button
                key={d.day}
                onClick={() => { setCurrentDay(d.day); }}
                className={`
                  flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium
                  transition-all duration-200
                  ${currentDay === d.day
                    ? `${color.bgLight} ${color.main} border ${color.borderFaint}`
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
              {expanded === 'content' && (
                <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed">
                  {mdLoading && (
                    <div className="text-sm text-gray-400 italic">正在加载课程内容...</div>
                  )}
                  {!mdLoading && mdContent && (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{mdContent}</ReactMarkdown>
                  )}
                  {!mdLoading && !mdContent && (
                    <div
                      className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: day.content.replace(/\n/g, '<br/>').replace(/### /g, '<h4 class="text-cyber-purple font-medium mt-3 mb-2">').replace(/## /g, '<h3 class="text-white font-medium mt-4 mb-2">').replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyber-green">$1</strong>').replace(/`([^`]+)`/g, '<code class="bg-cyber-purple/20 text-cyber-green px-1 py-0.5 rounded text-xs">$1</code>').replace(/```[\s\S]*?```/g, (m) => '<pre class="bg-cyber-black/50 border border-cyber-purple/20 rounded p-3 text-xs overflow-x-auto my-2"><code>' + m.replace(/```\w*\n?/g, '').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code></pre>') }}
                    />
                  )}
                </div>
              )}
              {expanded !== 'content' && (
                <div className="text-xs text-gray-500 italic">点击展开查看课程内容</div>
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
              <Card className={color.cardBorder}>
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
                          'bg-[#6b5b95]/20 text-gray-300'
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
                    {quiz.currentIndex + 1} / {day.quiz.length}
                  </span>
                </div>
                
                {day.quiz[quiz.currentIndex] && (() => {
                  const rawQ = day.quiz[quiz.currentIndex] as QuizQuestion;
                  const question: QuizQuestion = {
                    ...rawQ,
                    type: rawQ.type || (rawQ.options && rawQ.options.length > 0 ? 'single' : 'fill'),
                  };
                  const userAnswer = quiz.answers[quiz.currentIndex];
                  
                  const isCorrect = quiz.showAnswer
                    ? checkQuizAnswer(question, userAnswer)
                    : null;
                  
                  return (
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <span className={`text-xs px-2 py-1 rounded mr-2 ${
                          question.type === 'single' ? 'bg-cyber-blue/20 text-cyber-blue' :
                          question.type === 'multiple' ? 'bg-cyber-green/20 text-cyber-green' :
                          question.type === 'boolean' ? 'bg-cyber-gold/20 text-cyber-gold' :
                          'bg-[#6b5b95]/20 text-gray-300'
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
                            
                            let cls = color.optionDefault;
                            if (quiz.showAnswer) {
                              const isCorrectOption = question.type === 'multiple' 
                                ? (question.correctIndices || []).includes(i)
                                : i === question.correctIndex;
                              
                              if (isCorrectOption) cls = color.optionCorrect;
                              else if (isSelected) cls = color.optionWrong;
                              else cls = color.optionDim;
                            }
                            
                            return (
                              <button
                                key={i}
                                onClick={() => {
                                  if (!quiz.showAnswer) {
                                    if (question.type === 'multiple') {
                                      handleMultipleSelect(i);
                                    } else {
                                      handleQuizAnswer(i);
                                    }
                                  }
                                }}
                                disabled={quiz.showAnswer}
                                className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${cls}`}
                              >
                                <span className="text-sm font-mono mr-2 text-gray-400">
                                  {String.fromCharCode(65 + i)}.
                                </span>
                                <span className="text-sm text-gray-200">{opt}</span>
                                {question.type === 'multiple' && !quiz.showAnswer && (
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
                              quiz.setCurrentAnswer(e.target.value);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !quiz.showAnswer) {
                                handleQuizAnswer((userAnswer as string) || '');
                              }
                            }}
                            disabled={quiz.showAnswer}
                            className="w-full px-4 py-3 bg-cyber-purple/10 border border-cyber-purple/30 rounded-lg text-white text-sm outline-none focus:border-cyber-green"
                            placeholder="请输入答案..."
                          />
                          {!quiz.showAnswer && (
                            <button
                              onClick={() => handleQuizAnswer((userAnswer as string) || '')}
                              className={`w-full py-2 rounded-lg ${color.btnDefault} transition-colors`}
                            >
                              提交答案
                            </button>
                          )}
                        </div>
                      )}
                      
                      {/* 提交按钮（多选） */}
                      {question.type === 'multiple' && !quiz.showAnswer && (
                        <button
                          onClick={() => handleQuizAnswer(userAnswer as number[] || [])}
                          className={`w-full py-2 rounded-lg ${color.btnDefault} transition-colors`}
                        >
                          提交答案
                        </button>
                      )}
                      
                      {/* 答案解析 */}
                      {quiz.showAnswer && (
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
                      {quiz.showAnswer && (
                        <button
                          onClick={nextQuestion}
                          className={`w-full py-2 rounded-lg ${color.btnDefault} transition-colors`}
                        >
                          {quiz.isLastQuestion ? '完成测验' : '下一题'}
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
          {wrongQuestionBook.entries.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="bg-cyber-red/5 border-cyber-red/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-cyber-red flex items-center gap-2">
                    <AlertCircle size={16} />
                    错题本
                    <Badge className="bg-cyber-red/20 text-cyber-red">{wrongQuestionBook.entries.length}道错题</Badge>
                  </h3>
                  <span className="text-xs text-gray-500">连续答对3次可移除</span>
                </div>
                <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                  {wrongQuestionBook.entries.slice(0, 5).map((entry, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-cyber-black/30">
                      <div className="text-xs">
                        <span className="text-cyber-green">第{entry.day}天</span>
                        <span className="text-gray-500">· 题{entry.questionIndex + 1}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        连续答对 {entry.consecutiveCorrect}/3
                      </span>
                    </div>
                  ))}
                  {wrongQuestionBook.entries.length > 5 && (
                    <div className="text-center text-xs text-gray-500 py-1">
                      还有 {wrongQuestionBook.entries.length - 5} 道错题...
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
