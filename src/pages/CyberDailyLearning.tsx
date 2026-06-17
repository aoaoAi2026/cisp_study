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
  Eye,
  RefreshCw,
  Keyboard,
  X,
  RotateCcw
} from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';
import ReactMarkdown from 'react-markdown';
import supplement from '../data/cyberAiSupplement';
import remarkGfm from 'remark-gfm';
import Editor from '@monaco-editor/react';
import { cyberBasicPlan, CyberLearningPlan, CyberDay, QuizQuestion } from '../data/cyberBasic';
import { cyberPenetrationPlan } from '../data/cyberPenetration';
import { cyberDefensePlan } from '../data/cyberDefense';
import { cyberAiPlan } from '../data/cyberAi';
import basicSupplement from '../data/cyberBasicSupplement';
import penetrationSupplement from '../data/cyberPenetrationSupplement';
import defenseSupplement from '../data/cyberDefenseSupplement';
import { Pomodoro } from '../components/Pomodoro';
import { saveData, loadData } from '../data/persistData';
import { useQuizPractice, useWrongQuestionBook, checkQuizAnswer } from '../hooks';

// 通过 fetch 动态加载 public/ 下的 .md 文件（Vite 不支持 glob 读取 public/）

const plans: Record<string, CyberLearningPlan> = {
  basic: cyberBasicPlan,
  penetration: cyberPenetrationPlan,
  defense: cyberDefensePlan,
  ai: cyberAiPlan
};

// 计划补充数据映射
const planSupplements: Record<string, Record<number, any>> = {
  basic: basicSupplement,
  penetration: penetrationSupplement,
  defense: defenseSupplement,
  ai: supplement, // 使用原有的AI补充数据
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

  // Gamification states
  const [xp, setXp] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [streakHeatmap, setStreakHeatmap] = useState<number[]>(Array(7).fill(0));
  const [quizAvg, setQuizAvg] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newBadge, setNewBadge] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Code editor states
  const [editorCode, setEditorCode] = useState('');
  const [editorLang, setEditorLang] = useState('python');
  const [codeOutput, setCodeOutput] = useState('');
  const [codeRunning, setCodeRunning] = useState(false);

  // Coding exercise states
  const [exerciseAnswer, setExerciseAnswer] = useState('');
  const [exerciseResult, setExerciseResult] = useState<'correct'|'wrong'|null>(null);
  const [exerciseHint, setExerciseHint] = useState(false);

  // Stats panel visibility
  const [showStats, setShowStats] = useState(true);

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
  const wrongQuestionBook = useWrongQuestionBook();

  // 切换天时重置测验和定时器
  const resetQuiz = useCallback(() => {
    quiz.reset();
    setQuizTimer(30);
    setQuizTimerRunning(false);
    if (quizTimerRef.current) { clearInterval(quizTimerRef.current); quizTimerRef.current = null; }
  }, [quiz.reset]);
  useEffect(() => {
    resetQuiz();
    setEditorCode('');
    setCodeOutput('');
    setExerciseAnswer('');
    setExerciseResult(null);
    setExerciseHint(false);
  }, [resetQuiz]);

  // Load gamification data
  useEffect(() => {
    if (!planId) return;
    loadData<any>('cisp_cyber_gamify', {}).then(data => {
      const pData = data[planId] || {};
      setXp(pData.xp || 0);
      setUserLevel(pData.level || 1);
      setStreakHeatmap(pData.heatmap || Array(7).fill(0));
      setQuizAvg(pData.quizAvg || 0);
    });
  }, [planId]);

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

  // 真实代码执行 —— 调用后端 API
  const handleRunCode = async (code: string, lang: string) => {
    const supportedLangs = ['python', 'javascript', 'java'];
    const mappedLang = lang === 'bash' || lang === 'shell' ? 'bash-not-supported' :
                       lang === 'sql' ? 'sql-not-supported' :
                       lang === 'typescript' ? 'javascript' : lang;
    if (!supportedLangs.includes(mappedLang)) {
      if (mappedLang === 'bash-not-supported') {
        setCodeOutput('[错误] Bash/Shell 需要在终端环境中执行，请使用本地终端或 CodeLab。\n后端支持的语言: Python / JavaScript / Java');
      } else if (mappedLang === 'sql-not-supported') {
        setCodeOutput('[错误] SQL 需要连接数据库执行，后端暂不支持。请参考试题中的 SQL 样例。\n后端支持的语言: Python / JavaScript / Java');
      } else {
        setCodeOutput(`[错误] 不支持的语言: ${lang}\n支持的语言: Python / JavaScript / Java`);
      }
      return;
    }
    setCodeRunning(true);
    setCodeOutput('');
    try {
      const resp = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: mappedLang, code }),
      });
      const data = await resp.json();
      if (resp.ok) {
        const out = [
          data.stdout ? data.stdout.trimEnd() : '',
          data.stderr ? `\n[stderr]\n${data.stderr.trimEnd()}` : '',
          `\n--- 退出码: ${data.exitCode} | 耗时: ${data.executionTime}ms ---`,
        ].filter(Boolean).join('');
        setCodeOutput(out || '(无输出)');
        if (data.success) addXp(5);
      } else {
        setCodeOutput(`[请求失败] ${data.error || '未知错误'}\n${data.detail || ''}`);
      }
    } catch (e: any) {
      setCodeOutput(`[网络错误] ${e.message}\n请确认后端服务已启动 (node backend/server.js)`);
    } finally {
      setCodeRunning(false);
    }
  };

  const addXp = async (amount: number) => {
    const newXp = xp + amount;
    const newLevel = Math.floor(newXp / 500) + 1;
    setXp(newXp);
    if (newLevel > userLevel) {
      setUserLevel(newLevel);
      setShowLevelUp(true);
      setShowConfetti(true);
      setTimeout(() => setShowLevelUp(false), 3000);
      setTimeout(() => setShowConfetti(false), 2000);
    }
    if (planId) {
      const data = await loadData<any>('cisp_cyber_gamify', {});
      data[planId] = { ...data[planId], xp: newXp, level: newLevel, heatmap: streakHeatmap, quizAvg };
      await saveData('cisp_cyber_gamify', data);
    }
  };

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

  // 通过 fetch 动态加载 public/contents/cyber-learning/ 下的 .md 文件
  useEffect(() => {
    if (!planId) return;
    setMdLoading(true);
    setMdError(null);
    fetch(`/contents/cyber-learning/${planId}/day-${currentDay}.md`)
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
    if (newSet.has(currentDay)) { newSet.delete(currentDay); } else { newSet.add(currentDay); addXp(50); }
    setCompletedDays(newSet);
    // Update heatmap
    const today = new Date().getDay();
    const newHeatmap = [...streakHeatmap];
    newHeatmap[today === 0 ? 6 : today - 1] = (newHeatmap[today === 0 ? 6 : today - 1] || 0) + 1;
    setStreakHeatmap(newHeatmap);
    const data = await loadData<any>('cisp_cyber_progress', {});
    data[planId] = { ...data[planId], completedDays: Array.from(newSet) };
    await saveData('cisp_cyber_progress', data);
    // Save gamification
    const gData = await loadData<any>('cisp_cyber_gamify', {});
    gData[planId] = { ...gData[planId], xp, level: userLevel, heatmap: newHeatmap, quizAvg };
    await saveData('cisp_cyber_gamify', gData);
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
                  <div className="flex items-center gap-3">
                    {/* 30秒计时器 */}
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
                  </div>
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

export default CyberDailyLearning;
