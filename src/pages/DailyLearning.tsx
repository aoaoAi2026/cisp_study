import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Copy,
  Play,
  Video,
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
  User,
  RefreshCw,
  TrendingUp,
  Trophy,
  Keyboard,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { useLearningStore, useAchievementStore } from '../store';
import { useQuizExam, useWrongQuestionBook, useGamification, useCodeExecutor } from '../hooks';
import { learningData, weekThemes } from '../data/learningData';
import { Card, Badge, Button } from '../components/UI';
import { Pomodoro } from '../components/Pomodoro';
import TextToSpeechPlayer from '../components/TextToSpeechPlayer';

export const DailyLearning: React.FC = () => {
  const { dayId } = useParams<{ dayId: string }>();
  const navigate = useNavigate();

  const basePath = '/cyber-learning/cisp';
  const backPath = '/cyber-learning';
  const { markDayComplete, completedDays } = useLearningStore();
  const { checkAndUnlockBadge } = useAchievementStore();

  const [activeTab, setActiveTab] = useState<'content' | 'video' | 'code' | 'quiz' | 'expert'>('content');
  const [note, setNote] = useState('');
  const [noteSavedAt, setNoteSavedAt] = useState<number | null>(null);
  const [mdContent, setMdContent] = useState<string | null>(null);
  const [mdLoading, setMdLoading] = useState<boolean>(true);
  const [mdError, setMdError] = useState<string | null>(null);
  const { codeOutput, setCodeOutput, codeRunning, execute: executeCode } = useCodeExecutor();
  const [bilibiliBvid, setBilibiliBvid] = useState<string | null>(null);
  const [bilibiliVideoTitle, setBilibiliVideoTitle] = useState<string>('');
  const [videoLoading, setVideoLoading] = useState(false);
  const noteSaveTimer = useRef<number | null>(null);

  const wrongQuestionBook = useWrongQuestionBook();
  const [quizResult, setQuizResult] = useState<{ correct: number; total: number; score: number } | null>(null);

  // Gamification (共享hook)
  const gamify = useGamification({ storageKey: 'cisp_gamify' });
  const { xp, userLevel, streakHeatmap, quizAvg, showLevelUp, setShowLevelUp, showConfetti, addXp, bumpHeatmap } = gamify;
  const [showStats, setShowStats] = useState(true);

  // Monaco editor
  const [editorCode, setEditorCode] = useState('');
  const [editorLang, setEditorLang] = useState('python');

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

  useEffect(() => {
    if (!dayId) return;
    const controller = new AbortController();
    setMdLoading(true);
    setMdError(null);
    fetch(`/contents/learning/${dayId}.md`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        setMdContent(text);
        setMdLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setMdError(err.message || '加载失败');
        setMdLoading(false);
      });
    return () => controller.abort();
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

  // Bilibili 视频搜索
  useEffect(() => {
    if (activeTab !== 'video') return;
    const day = learningData.find(d => d.id === dayId);
    if (!day) return;
    setVideoLoading(true);
    setBilibiliBvid(null);
    const keyword = encodeURIComponent(day.title + ' CISP 网络安全');
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
  }, [activeTab, dayId]);

  const currentDay = learningData.find(d => d.id === dayId) || learningData[0];
  const quiz = useQuizExam(currentDay.quiz || []);
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
      bumpHeatmap();
      addXp(100);
    }
  };

  const handleQuizSubmit = () => {
    const result = quiz.submit();
    setQuizResult(result);
    // 记录错题
    if (currentDay.quiz) {
      currentDay.quiz.forEach((q, i) => {
        const isCorrect = result.correctIndices.includes(i);
        const qKey = `cisp_${currentDay.day}_${i}`;
        wrongQuestionBook.recordAnswer(qKey, q, 'cisp', currentDay.day, i, isCorrect);
      });
    }
    if (result.score >= 90) {
      checkAndUnlockBadge('quiz_90');
    }
    addXp(result.score >= 80 ? 50 : 20);
  };

  // XP / Level system —— 已迁移到 useGamification hook

  // Editor code init
  useEffect(() => {
    if (currentDay.codeExample) {
      setEditorCode(currentDay.codeExample.code || '');
      setEditorLang((currentDay.codeExample.language || 'python').toLowerCase());
    }
  }, [dayId]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target as HTMLElement)?.closest?.('.monaco-editor')) return;
      if (e.key === 'ArrowLeft' && prevDay) { e.preventDefault(); navigate(`${basePath}/${prevDay.id}`); }
      if (e.key === 'ArrowRight' && nextDay) { e.preventDefault(); navigate(`${basePath}/${nextDay.id}`); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prevDay, nextDay, navigate]);

  // 代码执行 —— 已迁移到 useCodeExecutor hook
  const handleRunCode = async (code: string, lang: string) => {
    await executeCode(code, lang);
    addXp(5);
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
          onClick={() => navigate(backPath)}
        >
          返回路径
        </Button>
        <div className="flex items-center gap-2">
          {prevDay && (
            <Button
              variant="outline"
              size="sm"
              icon={ChevronLeft}
              onClick={() => navigate(`${basePath}/${prevDay.id}`)}
            >
              前一天
            </Button>
          )}
          {nextDay && (
            <Button
              variant="outline"
              size="sm"
              icon={ChevronRight}
              onClick={() => navigate(`${basePath}/${nextDay.id}`)}
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
                {mdContent?.length || currentDay.content?.length || 0}字符
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

        {/* Gamification Stats Panel */}
        <motion.div variants={itemVariants}>
          <Card className="mt-4 border-cyber-blue/20 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-cyber-blue flex items-center gap-2">
                <TrendingUp size={16} /> 学习统计
              </h3>
              <button
                onClick={() => setShowStats(!showStats)}
                className="text-xs text-gray-500 hover:text-cyber-blue transition-colors"
              >
                {showStats ? '收起 ▲' : '展开 ▼'}
              </button>
            </div>
            {showStats && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  <div className="bg-cyber-blue/10 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-400 mb-1">经验值</div>
                    <div className="text-lg font-bold text-cyber-blue">{xp}</div>
                    <div className="w-full bg-cyber-blue/20 rounded-full h-1.5 mt-1">
                      <div className="bg-cyber-blue h-1.5 rounded-full" style={{ width: `${(xp % 500) / 5}%` }} />
                    </div>
                  </div>
                  <div className="bg-cyber-green/10 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-400 mb-1">等级</div>
                    <div className="text-lg font-bold text-cyber-green">Lv.{userLevel}</div>
                  </div>
                  <div className="bg-cyber-gold/10 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-400 mb-1">连续完成</div>
                    <div className="text-lg font-bold text-cyber-gold">
                      {completedDays.filter(cd => cd.dayId?.startsWith('day-')).length}天
                    </div>
                  </div>
                  <div className="bg-cyber-purple/10 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-400 mb-1">测验均分</div>
                    <div className="text-lg font-bold text-cyber-purple">{quizAvg > 0 ? `${quizAvg}%` : '--'}</div>
                  </div>
                  <div className="bg-cyber-gold/10 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-400 mb-1">徽章</div>
                    <div className="text-lg font-bold text-cyber-gold">{Math.floor(xp / 100)}</div>
                  </div>
                </div>
                {/* Weekly heatmap */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs text-gray-500 whitespace-nowrap">本周:</span>
                  {streakHeatmap.map((count, i) => (
                    <div
                      key={i}
                      className="flex-1 h-6 rounded"
                      style={{
                        background: count > 0
                          ? `rgba(51,136,238,${0.3 + Math.min(count / 5, 1) * 0.7})`
                          : 'rgba(75,85,99,0.15)',
                      }}
                      title={`Day ${i + 1}: 完成${count}次`}
                    />
                  ))}
                </div>
              </>
            )}
          </Card>
        </motion.div>

        {/* Day Navigation */}
        <motion.div variants={itemVariants}>
          <Card className="mt-4 border-cyber-blue/20">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {learningData.map((d) => {
                const done = completedDays.some(cd => cd.dayId === d.id);
                return (
                  <button
                    key={d.id}
                    onClick={() => navigate(`${basePath}/${d.id}`)}
                    className={`
                      flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-xs font-medium
                      transition-all duration-200
                      ${d.id === dayId
                        ? 'bg-cyber-blue/30 text-cyber-blue border border-cyber-blue/40'
                        : done
                          ? 'bg-cyber-green/10 text-cyber-green border border-cyber-green/20'
                          : 'bg-cyber-purple/10 text-gray-400 border border-cyber-purple/20 hover:bg-cyber-purple/20'
                      }
                    `}
                  >
                    {done ? <CheckCircle size={14} /> : d.day}
                  </button>
                );
              })}
            </div>
          </Card>
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
        <motion.div variants={itemVariants} className="overflow-x-auto scrollbar-hide mt-6">
          <div className="flex gap-2 min-w-max">
            {[
              { id: 'content', label: '课程内容', icon: BookOpen },
              { id: 'video', label: '视频教程', icon: Video },
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
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap
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
          </div>
        </motion.div>

        {/* Content */}
        <motion.div variants={itemVariants}>
          <Card className="mt-4">
            {activeTab === 'content' && (
              <div className="prose prose-invert max-w-none">
                <TextToSpeechPlayer text={mdContent || currentDay.content || ''} isDark={true} />
                <div className="text-gray-300 leading-relaxed">
                  {mdLoading ? (
                    <div className="py-8 text-center text-gray-500">正在加载课程内容...</div>
                  ) : mdError ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {currentDay.content || '# 暂无内容'}
                    </ReactMarkdown>
                  ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {mdContent || currentDay.content || '# 暂无内容'}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'video' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Video size={18} className="text-cyber-blue" />
                  <span className="text-cyber-blue font-medium">视频教程</span>
                  <span className="text-xs text-gray-500">Day {currentDay.day} · {currentDay.title}</span>
                </div>

                {/* Bilibili 嵌入式播放器（API 动态搜索） */}
                {videoLoading && (
                  <div className="relative w-full rounded-lg bg-gray-800/40 border border-cyber-blue/10" style={{ paddingBottom: '56.25%' }}>
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
                      className="absolute inset-0 w-full h-full rounded-lg border border-cyber-blue/20"
                      allowFullScreen
                      title={bilibiliVideoTitle || `Day ${currentDay.day} 视频教程`}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bilibili 搜索 */}
                  <a
                    href={`https://search.bilibili.com/all?keyword=${encodeURIComponent(currentDay.title + ' 网络安全')}&order=click`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-lg bg-gradient-to-br from-pink-500/10 to-blue-500/10 border border-pink-500/20 hover:border-pink-500/50 hover:from-pink-500/20 hover:to-blue-500/20 transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                        <Play size={20} className="text-pink-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white group-hover:text-pink-300 transition-colors">Bilibili 搜索</h4>
                        <p className="text-xs text-gray-500">搜索「{currentDay.title}」相关视频</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">在 Bilibili 上搜索网络安全相关教程，包含实战演示和技术讲解</p>
                  </a>

                  {/* YouTube 搜索 */}
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(currentDay.title + ' cybersecurity tutorial')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-lg bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 hover:border-red-500/50 hover:from-red-500/20 hover:to-orange-500/20 transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <Play size={20} className="text-red-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white group-hover:text-red-300 transition-colors">YouTube 搜索</h4>
                        <p className="text-xs text-gray-500">搜索「{currentDay.title}」英文教程</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">在 YouTube 上搜索网络安全英文教程，包含国际认证备考和实验演示</p>
                  </a>
                </div>

                {/* 通用视频平台入口 */}
                <div className="mt-4 p-4 rounded-lg bg-cyber-blue/5 border border-cyber-blue/15">
                  <h4 className="text-sm font-medium text-cyber-blue mb-3 flex items-center gap-2">
                    <ExternalLink size={14} />
                    更多视频平台
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: '腾讯课堂', url: `https://ke.qq.com/course/list/${encodeURIComponent(currentDay.title + ' 网络安全')}` },
                      { name: '网易云课堂', url: `https://study.163.com/search.htm?p=${encodeURIComponent(currentDay.title + ' 网络安全')}` },
                      { name: '慕课网', url: `https://www.imooc.com/search/?words=${encodeURIComponent(currentDay.title + ' 安全')}` },
                      { name: 'FreeBuf', url: `https://www.freebuf.com/search?q=${encodeURIComponent(currentDay.title)}` },
                    ].map(platform => (
                      <a
                        key={platform.name}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-xs rounded-full bg-cyber-blue/10 text-cyber-blue hover:bg-cyber-blue/20 transition-colors border border-cyber-blue/20"
                      >
                        {platform.name}
                      </a>
                    ))}
                  </div>
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
                          navigator.clipboard.writeText(editorCode || '');
                        }}
                      >
                        复制代码
                      </Button>
                    </div>

                    {/* Monaco 代码编辑器 */}
                    <div className="relative border border-gray-700 rounded-lg overflow-hidden" style={{ height: 320 }}>
                      <Editor
                        language={
                          editorLang === 'py' ? 'python' :
                          editorLang === 'js' ? 'javascript' :
                          editorLang === 'bash' ? 'shell' :
                          editorLang === 'sql' ? 'sql' :
                          editorLang
                        }
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
                        loading={
                          <div className="flex items-center justify-center h-full text-gray-500">
                            <RefreshCw size={20} className="animate-spin mr-2" />
                            加载编辑器...
                          </div>
                        }
                      />
                    </div>

                    <div className="flex gap-2 items-center">
                      <select
                        value={editorLang}
                        onChange={e => setEditorLang(e.target.value)}
                        className="bg-cyber-purple/20 border border-cyber-purple/30 rounded-lg px-3 py-1.5 text-xs text-white"
                      >
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                        <option value="java">Java</option>
                        <option value="bash">Bash</option>
                        <option value="sql">SQL</option>
                      </select>
                      <Button
                        size="sm"
                        icon={Play}
                        onClick={() => handleRunCode(editorCode, editorLang)}
                        loading={codeRunning}
                      >
                        运行代码
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={RotateCcw}
                        onClick={() => {
                          setEditorCode(currentDay.codeExample?.code || '');
                          setCodeOutput(null);
                        }}
                      >
                        重置
                      </Button>
                      <span className="text-xs text-gray-500 ml-auto">Ctrl+Enter 快速运行</span>
                    </div>
                    {codeOutput && (
                      <pre className="mt-3 p-3 bg-black/70 rounded-lg text-xs text-green-400 overflow-x-auto font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                        {codeOutput}
                      </pre>
                    )}
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
                        const optionClass = quiz.getOptionClass(qIndex, oIndex);

                        return (
                          <div
                            key={oIndex}
                            className={optionClass}
                            onClick={() => quiz.setAnswer(qIndex, oIndex)}
                          >
                            <span className="font-medium mr-2">
                              {String.fromCharCode(65 + oIndex)}.
                            </span>
                            {opt}
                          </div>
                        );
                      })}
                    </div>
                    {quiz.submitted && (
                      <div className="p-3 rounded-lg bg-cyber-purple/20 border border-cyber-green/10">
                        <p className="text-sm text-cyber-green">
                          <strong>解析:</strong> {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex gap-3 pt-4 border-t border-cyber-green/10">
                  {!quiz.submitted ? (
                    <Button onClick={handleQuizSubmit} disabled={!quiz.allAnswered}>
                      提交答案
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-cyber-green font-medium">
                        得分: {quizResult?.score ?? 0}%
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
                      <span className="text-cyber-green">Day {entry.day}</span>
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

        {/* Actions */}
        <motion.div variants={itemVariants} className="flex justify-between mt-6">
          <div>
            {prevDay && (
              <Button
                variant="outline"
                icon={ArrowLeft}
                onClick={() => navigate(`${basePath}/${prevDay.id}`)}
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
                onClick={() => navigate(`${basePath}/${nextDay.id}`)}
              >
                下一节
              </Button>
            )}
          </div>
        </motion.div>

        {/* Keyboard shortcut hints */}
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-6 text-xs text-gray-500 mt-4">
          <span className="flex items-center gap-1">
            <Keyboard size={12} />
            <kbd className="px-1.5 py-0.5 bg-cyber-purple/30 rounded text-gray-300">←</kbd>
            <kbd className="px-1.5 py-0.5 bg-cyber-purple/30 rounded text-gray-300">→</kbd>
            <span>切换天</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-cyber-purple/30 rounded text-gray-300">Ctrl+Enter</kbd>
            <span>运行代码</span>
          </span>
        </motion.div>
      </motion.div>

      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, y: -50, x: Math.random() * window.innerWidth }}
                animate={{ opacity: 0, y: window.innerHeight + 50, x: Math.random() * window.innerWidth }}
                transition={{ duration: 1.5 + Math.random(), delay: Math.random() * 0.5 }}
                className="absolute w-2 h-2 rounded-full"
                style={{ background: ['#ffd700', '#ff4444', '#44ff88', '#44aaff', '#ff44ff'][i % 5] }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Level Up Modal */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setShowLevelUp(false)}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              className="bg-slate-900 border border-cyber-gold/30 rounded-2xl p-8 text-center max-w-sm mx-4"
              onClick={e => e.stopPropagation()}
            >
              <Trophy size={64} className="mx-auto mb-4 text-cyber-gold" />
              <h2 className="font-orbitron text-2xl text-cyber-gold mb-2">
                <Sparkles size={20} className="inline mr-2" />
                升级了！
              </h2>
              <p className="text-white text-lg mb-1">
                恭喜达到{' '}
                <span className="text-cyber-gold font-bold">Level {userLevel}</span>
              </p>
              <p className="text-gray-400 text-sm mb-4">继续努力学习，解锁更多成就！</p>
              <Button onClick={() => { setShowLevelUp(false); }}>
                太棒了！
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DailyLearning;
