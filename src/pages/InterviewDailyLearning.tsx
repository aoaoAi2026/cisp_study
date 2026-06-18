// 网络安全学习 - 每日课程详情页
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  AlertCircle,
  Zap,
  Code,
  TrendingUp,
  Flame,
  Trophy,
  Medal,
  RefreshCw,
  Keyboard,
  RotateCcw,
  Video,
  FileQuestion,
  Library
} from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Editor from '@monaco-editor/react';
import { QuizQuestion } from '../data/cyberBasic';
import { Pomodoro } from '../components/Pomodoro';
import { plans, planSupplements, planColor } from './InterviewDailyLearning/constants';
import { saveData, loadData } from '../data/persistData';
import { loadAllResources } from '../data/resourceData';
import type { Resource } from '../types/resource';
import { getReadingsForDay } from '../data/dayResourceMap';
import { useQuizPractice, useQuizExam, useWrongQuestionBook, checkQuizAnswer, useGamification, useCodeExecutor } from '../hooks';
import type { QuizAnswer } from '../hooks';

// 通过 fetch 动态加载 public/ 下的 .md 文件（Vite 不支持 glob 读取 public/）

export const InterviewDailyLearning: React.FC = () => {
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
  const [, setMdError] = useState<string | null>(null);
  const saveTimer = React.useRef<number | null>(null);

  // Gamification (共享hook，按 planId 隔离数据)
  const gamify = useGamification({ storageKey: 'cisp_interview_gamify', subKey: planId });
  const { xp, userLevel, streakHeatmap, quizAvg, showLevelUp, setShowLevelUp, showConfetti, addXp, bumpHeatmap } = gamify;

  // Code editor states
  const [editorCode, setEditorCode] = useState('');
  const [editorLang, setEditorLang] = useState('python');
  const { codeOutput, setCodeOutput, codeRunning, execute: executeCode } = useCodeExecutor();

  // Coding exercise states
  const [exerciseAnswer, setExerciseAnswer] = useState('');
  const [exerciseResult, setExerciseResult] = useState<'correct'|'wrong'|null>(null);
  const [exerciseHint, setExerciseHint] = useState(false);

  // Stats panel visibility
  const [showStats, setShowStats] = useState(true);

  // Tab navigation
  const [activeTab, setActiveTab] = useState<'content' | 'video' | 'code' | 'readings' | 'quiz' | 'expert'>('content');

  // 课内读物
  const [readings, setReadings] = useState<Resource[]>([]);
  const [readingsLoading, setReadingsLoading] = useState(false);

  // Bilibili video
  const [bilibiliBvid, setBilibiliBvid] = useState<string | null>(null);
  const [bilibiliVideoTitle, setBilibiliVideoTitle] = useState<string>('');
  const [videoLoading, setVideoLoading] = useState(false);

  // Quiz timer
  const [quizTimer, setQuizTimer] = useState(30);
  const [quizTimerRunning, setQuizTimerRunning] = useState(false);
  const quizTimerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // 测验和错题本 hooks —— 合并 supplement 中提取的结构化数据
  const day = useMemo(() => {
    const d = plan?.days.find(d => d.day === currentDay);
    if (!d) return undefined;
    
    const planSuppl = planId ? planSupplements[planId] : undefined;
    const s = planSuppl ? planSuppl[d.day] : undefined;
    
    if (!s) return d;
    
    // 合并策略：将补充的quiz追加到已有quiz后面，补充的codeExamples追加到已有codeExamples后面
    const mergedQuiz = [
      ...(d.quiz || []),
      ...(s.quiz || [])
    ];
    
    const mergedCodeExamples = [
      ...(d.codeExamples || []),
      ...(s.codeExamples || [])
    ];
    
    return {
      ...d,
      quiz: mergedQuiz.length > 0 ? mergedQuiz : d.quiz,
      codeExamples: mergedCodeExamples.length > 0 ? mergedCodeExamples : d.codeExamples,
      // resources和recommendedTools仍用fallback策略（优先使用day自身的）
      resources: (d.resources && d.resources.length > 0) ? d.resources : (s.resources as any),
      recommendedTools: (d.recommendedTools && d.recommendedTools.length > 0) ? d.recommendedTools : (s.recommendedTools as any),
    };
  }, [plan, currentDay, planId]);
  const quiz = useQuizPractice(day?.quiz || []);
  const quizExam = useQuizExam(day?.quiz || []);
  const [quizMode, setQuizMode] = useState<'single' | 'all'>('single');
  // 一览模式下的逐题作答状态
  const [allAnswers, setAllAnswers] = useState<Record<number, QuizAnswer>>({});
  const [allSubmitted, setAllSubmitted] = useState<Record<number, boolean>>({});
  const [allMultiSelect, setAllMultiSelect] = useState<Record<number, number[]>>({});
  const wrongQuestionBook = useWrongQuestionBook();

  // 切换天时重置测验和定时器
  const resetQuiz = useCallback(() => {
    quiz.reset();
    quizExam.reset();
    setAllAnswers({});
    setAllSubmitted({});
    setAllMultiSelect({});
    setQuizTimer(30);
    setQuizTimerRunning(false);
    if (quizTimerRef.current) { clearInterval(quizTimerRef.current); quizTimerRef.current = null; }
  }, [quiz.reset, quizExam.reset]);
  useEffect(() => {
    resetQuiz();
    setEditorCode('');
    setCodeOutput('');
    setExerciseAnswer('');
    setExerciseResult(null);
    setExerciseHint(false);
  }, [resetQuiz]);

  // Gamification 加载 —— 已迁移到 useGamification hook

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); setCurrentDay(Math.max(1, currentDay - 1)); }
      if (e.key === 'ArrowRight') { e.preventDefault(); if (currentDay < (plan?.totalDays || 1)) setCurrentDay(currentDay + 1); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentDay, plan?.totalDays]);

  // Bilibili 视频搜索
  useEffect(() => {
    if (activeTab !== 'video' || !day) return;
    setVideoLoading(true);
    setBilibiliBvid(null);
    const keyword = encodeURIComponent(day.title + ' 网络安全 CISP');
    fetch(`/api-bili/x/web-interface/search/type?search_type=video&keyword=${keyword}&page=1`)
      .then(res => res.json())
      .then(data => {
        if (data?.data?.result?.length > 0) {
          const first = data.data.result[0];
          setBilibiliBvid(first.bvid);
          setBilibiliVideoTitle(first.title || '');
        }
      })
      .catch(() => {})
      .finally(() => setVideoLoading(false));
  }, [activeTab, day?.title]);

  // 代码执行 —— 已迁移到 useCodeExecutor hook
  const handleRunCode = async (code: string, lang: string) => {
    await executeCode(code, lang);
    addXp(5);
  };

  // addXp —— 已迁移到 useGamification hook

  useEffect(() => {
    if (!planId) return;
    async function load() {
      const data = await loadData<any>('cisp_interview_progress', {});
      if (data[planId]?.completedDays) {
        setCompletedDays(new Set(data[planId].completedDays));
      }
    }
    load();
  }, [planId]);

  useEffect(() => {
    if (!planId) return;
    async function load() {
      const noteKey = `interview_${planId}_${currentDay}`;
      const raw = await loadData<string>(noteKey, '');
      if (raw) { setNote(raw); setNoteSavedAt(Date.now()); } else { setNote(''); setNoteSavedAt(null); }
    }
    load();
  }, [planId, currentDay]);

  // 通过 fetch 动态加载 public/contents/cyber-learning/ 下的 .md 文件
  useEffect(() => {
    if (!planId) return;
    setMdLoading(true);
    setMdError(null);
    fetch(`/contents/interview-learning/${planId}/day-${currentDay}.md`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then(text => {
        setMdContent(text);
        setMdError(null);
      })
      .catch(() => {
        // 文件不存在时静默 fallback 到 day.content
        setMdContent(null);
        setMdError(null);
      })
      .finally(() => setMdLoading(false));
  }, [planId, currentDay]);

  // 课内读物：按当天课程精确匹配
  useEffect(() => {
    if (!planId || !currentDay) return;
    setReadingsLoading(true);
    const ids = getReadingsForDay('interview', planId, currentDay);
    if (ids.length === 0) {
      setReadings([]);
      setReadingsLoading(false);
      return;
    }
    loadAllResources().then(all => {
      const resourceMap = new Map(all.map(r => [r.id, r]));
      const matched = ids.map(id => resourceMap.get(id)).filter(Boolean) as Resource[];
      setReadings(matched);
      setReadingsLoading(false);
    });
  }, [planId, currentDay]);

  const handleNoteChange = (val: string) => {
    setNote(val);
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      if (!planId) return;
      const noteKey = `interview_${planId}_${currentDay}`;
      await saveData(noteKey, val);
      setNoteSavedAt(Date.now());
    }, 800);
  };

  // Quiz timer effect
  useEffect(() => {
    if (quizTimerRunning && quizTimer > 0) {
      quizTimerRef.current = setInterval(() => {
        setQuizTimer(prev => {
          if (prev <= 1) {
            if (quizTimerRef.current) { clearInterval(quizTimerRef.current); quizTimerRef.current = null; }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (quizTimerRef.current) { clearInterval(quizTimerRef.current); quizTimerRef.current = null; } };
  }, [quizTimerRunning]);

  // Start timer when quiz question appears and answer not yet shown
  useEffect(() => {
    if (!quiz.showAnswer && day?.quiz && day.quiz.length > 0) {
      setQuizTimer(30);
      setQuizTimerRunning(true);
    } else if (quiz.showAnswer) {
      setQuizTimerRunning(false);
    }
  }, [quiz.currentIndex, quiz.showAnswer, day?.quiz]);

  const handleQuizAnswer = (answer: number | number[] | string) => {
    if (quiz.showAnswer) return;
    setQuizTimerRunning(false);
    const isCorrect = quiz.answerOne(answer);
    const q = day?.quiz?.[quiz.currentIndex];
    if (q) {
      const qKey = `${planId}_${currentDay}_${quiz.currentIndex}`;
      wrongQuestionBook.recordAnswer(qKey, q, planId!, currentDay, quiz.currentIndex, isCorrect);
    }
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
    if (newSet.has(currentDay)) { newSet.delete(currentDay); } else { newSet.add(currentDay); addXp(50); }
    setCompletedDays(newSet);
    bumpHeatmap();
    const data = await loadData<any>('cisp_interview_progress', {});
    data[planId] = { ...data[planId], completedDays: Array.from(newSet) };
    await saveData('cisp_interview_progress', data);
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
        <Button onClick={() => navigate('/interview-learning')}>返回学习中心</Button>
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
            onClick={() => navigate('/interview-learning')}
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

      {/* Gamification Stats Panel */}
      <motion.div variants={itemVariants}>
        <Card className={`${color.cardBorder} overflow-hidden`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-sm font-medium ${color.main} flex items-center gap-2`}>
              <TrendingUp size={16} /> 学习统计
            </h3>
            <button onClick={() => setShowStats(!showStats)}
              className="text-xs text-gray-500 hover:text-white transition">
              {showStats ? '收起' : '展开'}
            </button>
          </div>
          {showStats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {/* XP Bar */}
              <div className="p-3 rounded-lg bg-cyber-purple/10 text-center">
                <Zap size={20} className="mx-auto mb-1 text-cyber-gold" />
                <p className="text-lg font-bold text-white">{xp}</p>
                <p className="text-xs text-gray-400">经验值 XP</p>
                <div className="w-full h-1.5 bg-gray-700 rounded-full mt-1">
                  <div className="h-full bg-cyber-gold rounded-full" style={{width:`${(xp%500)/5}%`}}/>
                </div>
              </div>
              {/* Level */}
              <div className="p-3 rounded-lg bg-cyber-purple/10 text-center">
                <Trophy size={20} className="mx-auto mb-1 text-cyber-gold" />
                <p className="text-lg font-bold text-white">Lv.{userLevel}</p>
                <p className="text-xs text-gray-400">当前等级</p>
              </div>
              {/* Streak */}
              <div className="p-3 rounded-lg bg-cyber-purple/10 text-center">
                <Flame size={20} className="mx-auto mb-1 text-cyber-red" />
                <p className="text-lg font-bold text-white">{completedDays.size}</p>
                <p className="text-xs text-gray-400">完成天数</p>
              </div>
              {/* Quiz Average */}
              <div className="p-3 rounded-lg bg-cyber-purple/10 text-center">
                <Target size={20} className="mx-auto mb-1 text-cyber-blue" />
                <p className="text-lg font-bold text-white">{quizAvg}%</p>
                <p className="text-xs text-gray-400">测验均分</p>
              </div>
              {/* Badges */}
              <div className="p-3 rounded-lg bg-cyber-purple/10 text-center">
                <Medal size={20} className="mx-auto mb-1 text-cyber-purple" />
                <p className="text-lg font-bold text-white">{Math.floor(xp/100)}</p>
                <p className="text-xs text-gray-400">徽章数</p>
              </div>
            </div>
          )}
          {/* Heatmap */}
          {showStats && (
            <div className="mt-3 flex items-center gap-1 justify-center">
              <span className="text-xs text-gray-500 mr-2">本周:</span>
              {streakHeatmap.map((val, i) => (
                <div key={i}
                  className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                    val > 3 ? 'bg-green-500 text-white' :
                    val > 1 ? 'bg-green-500/60 text-white' :
                    val > 0 ? 'bg-green-500/30 text-gray-300' :
                    'bg-gray-700 text-gray-500'
                  }`}
                  title={`${val} 次学习`}>
                  {['一','二','三','四','五','六','日'][i]}
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({length:30}).map((_,i) => (
            <motion.div key={i}
              initial={{opacity:1,y:-50,x:Math.random()*window.innerWidth}}
              animate={{opacity:0,y:window.innerHeight+50,x:Math.random()*window.innerWidth}}
              transition={{duration:1.5+Math.random(),delay:Math.random()*0.5}}
              className="absolute w-2 h-2 rounded-full"
              style={{background:['#ffd700','#ff4444','#44ff88','#44aaff','#ff44ff'][i%5]}}/>
          ))}
        </div>
      )}

      {/* Level Up Modal */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowLevelUp(false)}>
            <motion.div initial={{scale:0.5}} animate={{scale:1}} exit={{scale:0.5}}
              className="bg-slate-900 border border-cyber-gold/30 rounded-2xl p-8 text-center max-w-sm mx-4" onClick={e=>e.stopPropagation()}>
              <Trophy size={64} className="mx-auto mb-4 text-cyber-gold" />
              <h2 className="font-orbitron text-2xl text-cyber-gold mb-2">🎉 升级了！</h2>
              <p className="text-white text-lg mb-1">恭喜达到 <span className="text-cyber-gold font-bold">Level {userLevel}</span></p>
              <p className="text-gray-400 text-sm mb-4">继续努力学习，解锁更多成就！</p>
              <Button onClick={() => setShowLevelUp(false)} className="!bg-yellow-500 !text-black hover:!bg-yellow-400">
                太棒了！
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

          {/* Tabs */}
          <motion.div variants={itemVariants} className="flex gap-2">
            {[
              { id: 'content', label: '课程内容', icon: BookOpen },
              { id: 'video', label: '视频教程', icon: Video },
              { id: 'code', label: '代码实战', icon: Code },
              { id: 'readings', label: '课内读物', icon: Library },
              { id: 'quiz', label: '随堂测验', icon: FileQuestion },
              ...(day.expertNotes && day.expertNotes.length > 0
                ? [{ id: 'expert', label: '大神笔记', icon: Award }]
                : []),
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm
                  ${activeTab === tab.id
                    ? color.tabActive
                    : 'text-gray-400 hover:text-white hover:bg-cyber-purple/40'
                  }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* ===== Tab: 课程内容 ===== */}
          {activeTab === 'content' && (
            <>

          {/* 课程大纲（可折叠章节树） */}
          <motion.div variants={itemVariants}>
            <Card>
              <button
                onClick={() => setExpanded(expanded === 'outline' ? null : 'outline')}
                className="flex items-center justify-between w-full mb-2"
              >
                <h3 className={`text-sm font-medium ${color.main} flex items-center gap-2`}>
                  <BookOpen size={16} />
                  课程大纲
                </h3>
                {expanded === 'outline' ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </button>
              {expanded === 'outline' && (
                <div className="space-y-2 mt-3 border-l-2 border-cyber-purple/30 pl-4">
                  {(() => {
                    const content = mdContent || day.content;
                    const lines = content.split(/\n/);
                    const outline: { level: number; title: string; }[] = [];
                    lines.forEach(line => {
                      const m = line.match(/^(#{2,4})\s+(.+)/);
                      if (m) {
                        outline.push({ level: m[1].length, title: m[2].replace(/[*#]+/g, '').trim() });
                      }
                    });
                    if (outline.length === 0) {
                      // Fallback: use objectives as outline
                      day.objectives.forEach(obj => outline.push({ level: 2, title: obj }));
                    }
                    return outline.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 group cursor-pointer hover:text-cyber-green transition-colors"
                        onClick={() => {
                          setExpanded('content');
                          setTimeout(() => {
                            const el = document.querySelector(`[data-heading="${CSS.escape(item.title)}"]`);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 100);
                        }}>
                        <span className="text-cyber-purple mt-0.5 text-xs">
                          {item.level === 2 ? '●' : item.level === 3 ? '○' : '·'}
                        </span>
                        <span className={`text-sm ${item.level === 2 ? 'text-gray-200 font-medium' : item.level === 3 ? 'text-gray-400' : 'text-gray-500'}`}
                          style={{ paddingLeft: (item.level - 2) * 16 }}>
                          {item.title}
                        </span>
                      </div>
                    ));
                  })()}
                </div>
              )}
              {expanded !== 'outline' && (
                <div className="text-xs text-gray-500 italic">点击展开查看课程大纲</div>
              )}
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
            </>
          )}

          {/* ===== Tab: 视频教程 ===== */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              <motion.div variants={itemVariants}>
                <Card>
                  <div className="flex items-center gap-2 mb-4">
                    <Video size={18} className={color.main} />
                    <span className={`font-medium ${color.main}`}>视频教程</span>
                    <span className="text-xs text-gray-500">Day {currentDay} · {day.title}</span>
                  </div>

                  {videoLoading && (
                    <div className="relative w-full rounded-lg bg-gray-800/40 border border-gray-700/30" style={{ paddingBottom: '56.25%' }}>
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 gap-2">
                        <RefreshCw size={20} className="animate-spin" />
                        <span>正在 Bilibili 搜索相关视频...</span>
                      </div>
                    </div>
                  )}
                  {bilibiliBvid && !videoLoading && (
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        src={`https://player.bilibili.com/player.html?bvid=${bilibiliBvid}&page=1&high_quality=1&autoplay=0`}
                        className="absolute inset-0 w-full h-full rounded-lg border border-gray-700/30"
                        allowFullScreen
                        title={bilibiliVideoTitle || `Day ${currentDay} 视频教程`}
                      />
                    </div>
                  )}
                  {!bilibiliBvid && !videoLoading && (
                    <div className="relative w-full rounded-lg bg-gray-800/30 border border-gray-700/30" style={{ paddingBottom: '56.25%' }}>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 gap-3">
                        <Play size={36} className="text-gray-600" />
                        <span className="text-sm">暂未找到匹配视频，请使用下方搜索</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <a
                      href={`https://search.bilibili.com/all?keyword=${encodeURIComponent(day.title + ' 网络安全')}&order=click`}
                      target="_blank" rel="noopener noreferrer"
                      className="block p-3 rounded-lg bg-gradient-to-br from-pink-500/10 to-blue-500/10 border border-pink-500/20 hover:border-pink-500/50 transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                          <Play size={16} className="text-pink-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white text-sm group-hover:text-pink-300">Bilibili 搜索</h4>
                          <p className="text-xs text-gray-500">搜索更多相关视频</p>
                        </div>
                      </div>
                    </a>
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(day.title + ' cybersecurity tutorial')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="block p-3 rounded-lg bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 hover:border-red-500/50 transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                          <Play size={16} className="text-red-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white text-sm group-hover:text-red-300">YouTube 搜索</h4>
                          <p className="text-xs text-gray-500">搜索英文教程</p>
                        </div>
                      </div>
                    </a>
                  </div>
                </Card>
              </motion.div>
            </div>
          )}

          {/* ===== Tab: 代码实战 ===== */}
          {activeTab === 'code' && (
            <>

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

          {/* Monaco 代码编辑器 */}
          <motion.div variants={itemVariants}>
            <Card className={color.cardBorder}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-sm font-medium ${color.main} flex items-center gap-2`}>
                  <Code size={16} />
                  代码编辑器
                </h3>
                <div className="flex items-center gap-2">
                  <select value={editorLang} onChange={e => setEditorLang(e.target.value)}
                    className="text-xs px-2 py-1 bg-cyber-black/50 border border-gray-700 rounded text-gray-300">
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="bash">Bash</option>
                    <option value="sql">SQL</option>
                  </select>
                </div>
              </div>
              <div className="relative border border-gray-700 rounded-lg overflow-hidden" style={{ height: 280 }}>
                <Editor
                  language={editorLang === 'bash' ? 'shell' : editorLang === 'sql' ? 'sql' : editorLang}
                  value={editorCode}
                  onChange={(val) => setEditorCode(val || '')}
                  theme="vs-dark"
                  options={{
                    fontSize: 13,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    lineNumbers: 'on',
                    tabSize: 2,
                    automaticLayout: true,
                  }}
                  onMount={(editor, monaco) => {
                    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
                      handleRunCode(editor.getValue(), editorLang);
                    });
                  }}
                  loading={<div className="flex items-center justify-center h-full text-gray-500 text-sm">加载编辑器...</div>}
                />
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <button
                    onClick={() => handleRunCode(editorCode, editorLang)}
                    disabled={codeRunning || !editorCode.trim()}
                    className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1 ${!editorCode.trim() ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-cyber-green text-black hover:bg-emerald-400'}`}
                  >
                    {codeRunning ? <RefreshCw size={12} className="animate-spin"/> : <Play size={12}/>}
                    运行
                  </button>
                  <button onClick={() => setEditorCode('')}
                    className="px-2 py-1 rounded text-xs text-gray-400 hover:text-white bg-gray-700/50">
                    <RotateCcw size={12}/>
                  </button>
                </div>
              </div>
              {codeOutput && (
                <pre className="mt-3 p-3 bg-black/70 rounded-lg text-xs text-green-400 overflow-x-auto font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {codeOutput}
                </pre>
              )}
              <p className="text-xs text-gray-500 mt-2">💡 提示: 按 Ctrl+Enter 快速运行代码 | 支持 Python / JavaScript / Java（Bash 和 SQL 建议使用本地终端）</p>
            </Card>
          </motion.div>

          {/* 编程练习 */}
          {day.codeExamples && day.codeExamples.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-cyber-blue/5 to-cyber-purple/5 border-cyber-blue/20">
                <h3 className={`text-sm font-medium text-cyber-blue mb-3 flex items-center gap-2`}>
                  <Target size={16} />
                  编程练习
                </h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-cyber-black/30">
                    <p className="text-sm text-white mb-2">✏️ 根据以下需求编写代码:</p>
                    <p className="text-xs text-gray-400">{day.codeExamples[0].explanation}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-cyber-blue/20 text-cyber-blue">难度: ⭐⭐</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-cyber-green/20 text-cyber-green">奖励: +15 XP</span>
                    </div>
                  </div>
                  <textarea
                    value={exerciseAnswer}
                    onChange={e => setExerciseAnswer(e.target.value)}
                    placeholder="在这里编写你的代码..."
                    className="w-full h-24 bg-cyber-black/50 border border-gray-700 rounded-lg p-3 text-sm text-green-400 font-mono outline-none focus:border-cyber-blue resize-y"
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => {
                      if (exerciseAnswer.trim().length > 10) {
                        setExerciseResult('correct');
                        addXp(15);
                      } else {
                        setExerciseResult('wrong');
                      }
                    }}>
                      提交答案
                    </Button>
                    <Button variant="outline" onClick={() => setExerciseHint(!exerciseHint)}>
                      {exerciseHint ? '隐藏提示' : '💡 查看提示'}
                    </Button>
                  </div>
                  {exerciseHint && (
                    <div className="p-3 rounded-lg bg-cyber-gold/5 border border-cyber-gold/20 text-xs text-gray-400">
                      💡 参考上方代码示例中的实现方式，注意变量命名和函数结构
                    </div>
                  )}
                  {exerciseResult === 'correct' && (
                    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                      className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-400"/>
                      <span className="text-sm text-green-400">✅ 太棒了！答案通过测试！+15 XP</span>
                    </motion.div>
                  )}
                  {exerciseResult === 'wrong' && (
                    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                      className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2">
                      <AlertCircle size={16} className="text-red-400"/>
                      <span className="text-sm text-red-400">❌ 还需要改进，请再试一次</span>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
            </>
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

          {/* ===== Tab: 课内读物 ===== */}
          {activeTab === 'readings' && (
            <>
              <motion.div variants={itemVariants}>
                <Card>
                  <h3 className={`text-sm font-medium ${color.main} mb-4 flex items-center gap-2`}>
                    <Library size={16} />
                    课内读物
                    <span className="text-xs text-gray-500 font-normal ml-1">
                      精选{readings.length}篇
                    </span>
                  </h3>
                  {readingsLoading ? (
                    <div className="text-center py-8 text-gray-400">
                      <RefreshCw size={20} className="mx-auto mb-2 animate-spin" />
                      <p className="text-sm">加载课内读物中...</p>
                    </div>
                  ) : readings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen size={28} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">暂无该课程的课内读物</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {readings.map(r => (
                        <div
                          key={r.id}
                          className="bg-cyber-purple/10 border border-cyber-purple/20 rounded-lg p-4 hover:border-cyber-purple/40 transition-colors group"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-sm font-medium text-white group-hover:text-cyber-green transition-colors line-clamp-2 flex-1 mr-2">
                              {r.title}
                            </h4>
                            <Badge
                              className={`text-[10px] px-1.5 py-0.5 whitespace-nowrap ${
                                r.difficulty === '入门' ? 'bg-cyber-green/20 text-cyber-green border-cyber-green/30' :
                                r.difficulty === '进阶' ? 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue/30' :
                                'bg-cyber-gold/20 text-cyber-gold border-cyber-gold/30'
                              }`}
                            >
                              {r.difficulty}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                            {r.summary}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {r.tags.slice(0, 3).map((tag, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-cyber-purple/20 text-gray-400"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {r.readMinutes}分钟
                              </span>
                              <span className="flex items-center gap-1">
                                <User size={12} />
                                {r.author}
                              </span>
                            </div>
                            <button
                              onClick={() => navigate(`/resources/${r.id}`)}
                              className="flex items-center gap-1 text-cyber-green hover:text-cyber-green/80 font-medium transition-colors"
                            >
                              阅读全文
                              <ExternalLink size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            </>
          )}

          {/* ===== Tab: 随堂测验 ===== */}
          {activeTab === 'quiz' && day.quiz && day.quiz.length > 0 && (
            <>
              <motion.div variants={itemVariants}>
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-sm font-medium ${color.main} flex items-center gap-2`}>
                      <Target size={16} />
                      随堂测验
                    </h3>
                    {/* 模式切换 + 逐题模式的计时器/计数 */}
                    <div className="flex items-center gap-3">
                      {/* 逐题/一览切换 */}
                      <div className="flex items-center bg-cyber-purple/20 rounded-lg p-0.5">
                        <button
                          onClick={() => setQuizMode('single')}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                            quizMode === 'single' ? 'bg-cyber-green/30 text-cyber-green' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          逐题
                        </button>
                        <button
                          onClick={() => setQuizMode('all')}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                            quizMode === 'all' ? 'bg-cyber-green/30 text-cyber-green' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          一览
                        </button>
                      </div>
                      {quizMode === 'single' && (
                        <>
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                            quizTimer <= 10 ? 'bg-red-500/20 text-red-400 animate-pulse' :
                            quizTimer <= 20 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-cyber-green/20 text-cyber-green'
                          }`}>
                            <Clock size={13} />
                            {quizTimer}s
                          </div>
                          <span className="text-xs text-gray-400">
                            {quiz.currentIndex + 1} / {day.quiz.length}
                          </span>
                        </>
                      )}
                      {quizMode === 'all' && (
                        <span className="text-xs text-gray-400">
                          共 {day.quiz.length} 题
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ====== 逐题模式 ====== */}
                  {quizMode === 'single' && day.quiz[quiz.currentIndex] && (() => {
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

                  {/* ====== 一览模式 ====== */}
                  {quizMode === 'all' && (
                    <div className="space-y-6">
                      {day.quiz.map((rawQ, qi) => {
                        const q: QuizQuestion = {
                          ...rawQ,
                          type: rawQ.type || (rawQ.options && rawQ.options.length > 0 ? 'single' : 'fill'),
                        };
                        const userAnswer = allAnswers[qi] ?? null;
                        const submitted = allSubmitted[qi] ?? false;

                        const isCorrect = submitted
                          ? checkQuizAnswer(q, userAnswer)
                          : null;

                        const handleAllAnswer = (answer: QuizAnswer) => {
                          if (submitted) return;
                          setAllAnswers(prev => ({ ...prev, [qi]: answer }));
                          setAllSubmitted(prev => ({ ...prev, [qi]: true }));
                          const qKey = `${planId}_${currentDay}_${qi}`;
                          wrongQuestionBook.recordAnswer(qKey, q, planId!, currentDay, qi, checkQuizAnswer(q, answer));
                          if (checkQuizAnswer(q, answer)) addXp(5);
                        };

                        const handleAllMultiToggle = (optIdx: number) => {
                          if (submitted) return;
                          setAllMultiSelect(prev => {
                            const cur = prev[qi] || [];
                            const next = cur.includes(optIdx)
                              ? cur.filter(i => i !== optIdx)
                              : [...cur, optIdx].sort((a, b) => a - b);
                            return { ...prev, [qi]: next };
                          });
                        };

                        const multiSelected = allMultiSelect[qi] || [];
                        const isOptionSelected = (optIdx: number) => {
                          if (q.type === 'multiple') return multiSelected.includes(optIdx);
                          return (userAnswer as number) === optIdx;
                        };

                        return (
                          <div key={qi} className="border border-cyber-purple/20 rounded-lg p-4 bg-cyber-purple/5">
                            {/* 题号 + 类型 + 问题 */}
                            <div className="flex items-start gap-2 mb-3">
                              <span className="text-xs font-bold text-cyber-gold min-w-[28px] mt-0.5">Q{qi + 1}</span>
                              <span className={`text-xs px-2 py-0.5 rounded flex-shrink-0 ${
                                q.type === 'single' ? 'bg-cyber-blue/20 text-cyber-blue' :
                                q.type === 'multiple' ? 'bg-cyber-green/20 text-cyber-green' :
                                q.type === 'boolean' ? 'bg-cyber-gold/20 text-cyber-gold' :
                                'bg-[#6b5b95]/20 text-gray-300'
                              }`}>
                                {q.type === 'single' ? '单选' :
                                 q.type === 'multiple' ? '多选' :
                                 q.type === 'boolean' ? '判断' : '填空'}
                              </span>
                              <p className="text-sm text-white font-medium leading-relaxed flex-1">
                                {q.question}
                              </p>
                            </div>

                            {/* 选择题选项 */}
                            {q.options && (q.type === 'single' || q.type === 'boolean' || q.type === 'multiple') && (
                              <div className="space-y-1.5 pl-7">
                                {q.options.map((opt, oi) => {
                                  let cls = color.optionDefault + ' text-sm';
                                  if (submitted) {
                                    const isCorrectOption = q.type === 'multiple'
                                      ? (q.correctIndices || []).includes(oi)
                                      : oi === q.correctIndex;
                                    if (isCorrectOption) cls = color.optionCorrect + ' text-sm';
                                    else if (isOptionSelected(oi)) cls = color.optionWrong + ' text-sm';
                                    else cls = color.optionDim + ' text-sm';
                                  } else if (isOptionSelected(oi)) {
                                    cls = color.optionCorrect + ' text-sm';
                                  }

                                  return (
                                    <button
                                      key={oi}
                                      onClick={() => {
                                        if (submitted) return;
                                        if (q.type === 'multiple') {
                                          handleAllMultiToggle(oi);
                                        } else {
                                          handleAllAnswer(oi);
                                        }
                                      }}
                                      disabled={submitted}
                                      className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all flex items-center ${cls}`}
                                    >
                                      <span className="text-xs font-mono mr-2 text-gray-400">
                                        {String.fromCharCode(65 + oi)}.
                                      </span>
                                      <span className="text-xs text-gray-200 flex-1">{opt}</span>
                                      {q.type === 'multiple' && !submitted && (
                                        <span className={`text-xs ${multiSelected.includes(oi) ? 'text-cyber-green' : 'text-gray-500'}`}>
                                          {multiSelected.includes(oi) ? '✓' : '○'}
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                                {/* 多选提交按钮 */}
                                {q.type === 'multiple' && !submitted && multiSelected.length > 0 && (
                                  <button
                                    onClick={() => handleAllAnswer(multiSelected)}
                                    className={`w-full py-2 rounded-lg mt-1 ${color.btnDefault} transition-colors text-sm`}
                                  >
                                    提交本答案
                                  </button>
                                )}
                              </div>
                            )}

                            {/* 填空 */}
                            {q.type === 'fill' && (
                              <div className="pl-7 space-y-2">
                                {!submitted ? (
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={String(userAnswer ?? '')}
                                      onChange={e => setAllAnswers(prev => ({ ...prev, [qi]: e.target.value }))}
                                      onKeyDown={e => { if (e.key === 'Enter') handleAllAnswer(e.currentTarget.value); }}
                                      className="flex-1 px-3 py-2 bg-cyber-purple/10 border border-cyber-purple/30 rounded-lg text-white text-sm outline-none focus:border-cyber-green"
                                      placeholder="请输入答案..."
                                    />
                                    <button
                                      onClick={() => handleAllAnswer(userAnswer ?? '')}
                                      className={`px-4 py-2 rounded-lg ${color.btnDefault} transition-colors text-sm`}
                                    >
                                      提交
                                    </button>
                                  </div>
                                ) : (
                                  <div className="text-sm text-gray-400">
                                    <span className="text-cyber-green">你的答案：</span>{String(userAnswer)}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* 答案解析 */}
                            {submitted && (
                              <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-3 ml-7 p-3 rounded-lg bg-cyber-purple/10 border border-cyber-purple/20"
                              >
                                <div className={`flex items-center gap-2 mb-1.5 ${isCorrect ? 'text-cyber-green' : 'text-cyber-red'}`}>
                                  {isCorrect ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                                  <span className="font-medium text-xs">
                                    {isCorrect ? '回答正确！' : '回答错误'}
                                  </span>
                                </div>
                                {q.type === 'fill' && q.correctAnswer && (
                                  <div className="text-xs text-cyber-green mb-1">
                                    <span className="text-gray-400">正确答案：</span>{q.correctAnswer}
                                  </div>
                                )}
                                <p className="text-xs text-gray-300 leading-relaxed">{q.explanation}</p>
                              </motion.div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              </motion.div>
            </>
          )}

          {/* ===== Tab: 大神笔记 ===== */}
          {activeTab === 'expert' && day.expertNotes && day.expertNotes.length > 0 && (
            <>

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
            </>
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

          {/* Keyboard shortcuts hint */}
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Keyboard size={12} />
              <kbd className="px-1.5 py-0.5 bg-cyber-purple/30 rounded text-gray-400">←</kbd>
              上一天
            </span>
            <span className="flex items-center gap-1">
              <Keyboard size={12} />
              <kbd className="px-1.5 py-0.5 bg-cyber-purple/30 rounded text-gray-400">→</kbd>
              下一天
            </span>
            <span className="flex items-center gap-1">
              <Keyboard size={12} />
              <kbd className="px-1.5 py-0.5 bg-cyber-purple/30 rounded text-gray-400">Ctrl+Enter</kbd>
              运行代码
            </span>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default InterviewDailyLearning;
