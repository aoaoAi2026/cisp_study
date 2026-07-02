import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Flame,
  Trophy,
  BookOpen,
  Code,
  FileQuestion,
  Users,
  ArrowRight,
  CheckCircle,
  Target,
  Zap,
  Shield,
  Clock,
  Brain,
  Award,
  MessageSquare,
  Library,
  Terminal,
  FileText,
  ClipboardList,
  Bug,
  Wrench,
  GraduationCap,
  Network,
  Lock,
  Cpu,
  BookMarked,
  Lightbulb,
  Globe,
  Server,
  Gavel,
  Database,
  Flag,
  Key,
  Globe2,
  FileSearch,
  FileCode,
  Sparkles,
  Monitor,
  ShieldAlert,
  ExternalLink,
} from 'lucide-react';
import { useUserStore, useLearningStore, useAchievementStore, getLevel } from '../store';
import { learningData, weekThemes } from '../data/learningData';
import { pastPapers } from '../data/pastPapers';
import { ProgressRing, Card, StatCard, Badge, Button } from '../components/UI';
import { ParticleBackground } from '../components/UI/ParticleBackground';

const DailyQuotes = [
  '安全不是口号，而是习惯。',
  '每一个漏洞都是一次学习的机会。',
  '防御的深度决定安全的高度。',
  '最小的权限是最强的防线。',
  '今天的安全，明天的安心。',
  '知识是防护，技能是武器。',
  '安全之路，永无止境。',
  '每一个字符都可能成为突破口。',
  '了解攻击，才能更好地防御。',
  '代码审计是安全的第一道防线。',
];

// 每日挑战系统
const DailyChallenges = [
  { title: '完成今日学习任务', points: 50, icon: '📚' },
  { title: '完成3道测验题', points: 30, icon: '❓' },
  { title: '使用闪卡学习10次', points: 40, icon: '🃏' },
  { title: '阅读一篇工具网站介绍', points: 20, icon: '🔧' },
  { title: '在社区发表评论', points: 30, icon: '💬' },
  { title: '完成代码实验', points: 60, icon: '💻' },
  { title: '记录学习笔记', points: 40, icon: '📝' },
  { title: '观看一段视频教程', points: 35, icon: '🎬' },
];

// 学习小贴士
const LearningTips = [
  { tip: '试试用番茄工作法学习，25分钟专注学习，5分钟休息', icon: '🍅' },
  { tip: '每天复盘当天学习内容，加深记忆', icon: '📖' },
  { tip: '把学到的知识讲给别人听，教学相长', icon: '👨‍🏫' },
  { tip: '遇到不懂的问题，及时在社区提问', icon: '❓' },
  { tip: '定期复习旧知识，防止遗忘', icon: '🔄' },
  { tip: '多动手实践，不要只看不练', icon: '💪' },
  { tip: '建立知识体系，形成自己的知识网络', icon: '🕸️' },
  { tip: '保持好奇心，探索未知领域', icon: '🔍' },
];

// 实验环境11大模块
const LabModules = [
  { id: 'xss', name: 'XSS沙箱', icon: Bug, color: '#ff4444', desc: '3级难度XSS攻击实验室' },
  { id: 'sqli', name: 'SQL注入', icon: Database, color: '#ff8800', desc: '联合查询/盲注/报错注入' },
  { id: 'ctf', name: 'CTF挑战', icon: Flag, color: '#ffd700', desc: '10关夺旗挑战' },
  { id: 'password', name: '密码破解', icon: Key, color: '#ff44ff', desc: '字典/暴力/彩虹表破解' },
  { id: 'crypto', name: '密码学工具', icon: Wrench, color: '#44aaff', desc: 'AES/RSA加解密/JWT调试' },
  { id: 'network', name: '网络攻击可视化', icon: Globe, color: '#44ff88', desc: 'ARP/DNS/中间人演示' },
  { id: 'vulncode', name: '漏洞代码对比', icon: FileCode, color: '#ffaa00', desc: '8场景不安全代码对比' },
  { id: 'burp', name: 'Burp模拟器', icon: Globe2, color: '#ff6600', desc: 'HTTP拦截/重放模拟' },
  { id: 'waf', name: 'WAF规则构建', icon: Shield, color: '#00ccff', desc: '正则拦截10关挑战' },
  { id: 'log', name: '日志分析', icon: FileSearch, color: '#88ff44', desc: 'Nginx/SSH日志分析' },
  { id: 'logic', name: '逻辑漏洞', icon: Brain, color: '#ff6688', desc: '越权/价格篡改/竞态' },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { currentDay, completedDays, streak } = useLearningStore();
  const { points, unlockedBadgeIds } = useAchievementStore();

  const levelInfo = getLevel(points);
  const progress = (completedDays.length / 90) * 100;
  const todayQuote = DailyQuotes[new Date().getDay() % DailyQuotes.length];

  // 获取今日挑战
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const todayChallenge = DailyChallenges[dayOfYear % DailyChallenges.length];
  const todayTip = LearningTips[dayOfYear % LearningTips.length];

  // 获取本周学习记录
  const getWeekDays = () => {
    const days = [];
    const currentDayOfWeek = today.getDay() || 7; // 将周日的0转换为7
    for (let i = 1; i <= currentDayOfWeek; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (currentDayOfWeek - i));
      days.push({
        date: date.getDate(),
        isToday: i === currentDayOfWeek,
        hasStreak: Math.random() > 0.3, // 模拟数据
      });
    }
    return days;
  };
  const weekDays = getWeekDays();

  // 额外统计
  const [extraStats, setExtraStats] = useState({
    flashAnswered: 0,
    flashCorrect: 0,
    pomodoroCount: 0,
    notesCount: 0,
  });

  useEffect(() => {
    const flashRaw = localStorage.getItem('cisp_flash_stats');
    const pomoRaw = localStorage.getItem('cisp_pomodoro');
    const notesRaw = localStorage.getItem('cisp_notes');
    const flash = flashRaw ? JSON.parse(flashRaw) : { answered: 0, correct: 0 };
    const pomo = pomoRaw ? JSON.parse(pomoRaw) : { completed: 0 };
    let notes = 0;
    if (notesRaw) {
      try { notes = Object.keys(JSON.parse(notesRaw)).length; } catch {}
    }
    setExtraStats({
      flashAnswered: flash.answered || 0,
      flashCorrect: flash.correct || 0,
      pomodoroCount: pomo.completed || 0,
      notesCount: notes,
    });
  }, []);

  const totalQuestions = pastPapers.reduce((sum, p) => sum + p.questions.length, 0);
  const overallProgress = Math.round(
    ((completedDays.length / learningData.length) * 50 +
     (extraStats.flashAnswered / Math.max(1, totalQuestions)) * 30 +
     (unlockedBadgeIds.length / 8) * 20)
  );

  // Get today's tasks (next uncompleted days)
  const upcomingDays = learningData
    .filter(d => !completedDays.some(cd => cd.dayId === d.id))
    .slice(0, 4);

  const currentDayData = learningData.find(d => d.day === currentDay) || learningData[0];

  // Get current week info
  const currentWeek = Math.ceil(currentDay / 7);
  const weekInfo = weekThemes[currentWeek - 1] || weekThemes[0];

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
    <div className="relative min-h-screen">
      <ParticleBackground />

      <motion.div
        className="relative z-10 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center py-8">
          <h1 className="font-orbitron text-3xl md:text-4xl font-bold mb-2">
            <span className="text-cyber-green glow-text-green">{user?.name}</span>
            <span className="text-white">，加油!</span>
          </h1>
          <p className="text-gray-400 text-lg">
            你正在学习第 <span className="text-cyber-green font-bold">{currentDay}</span> 天 · {weekInfo.theme}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/15">
            <Shield size={16} className="text-cyber-green" />
            <span className="text-sm text-gray-300">{todayQuote}</span>
          </div>
        </motion.div>

        {/* 每日挑战和打卡 */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 每日挑战 */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-cyber-gold/8 to-white/[0.04]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-gold/5 rounded-full -mr-16 -mt-16" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">{todayChallenge.icon}</span>
                <div>
                  <h3 className="font-orbitron text-lg text-cyber-gold">今日挑战</h3>
                  <p className="text-xs text-gray-400">完成挑战可获得 {todayChallenge.points} 积分</p>
                </div>
              </div>
              <p className="text-white font-medium mb-4">{todayChallenge.title}</p>
              <Button
                className="w-full bg-cyber-gold/20 hover:bg-cyber-gold/30 border-cyber-gold/30"
                onClick={() => {
                  if (todayChallenge.title.includes('测验')) navigate('/question-bank/quiz');
                  else if (todayChallenge.title.includes('闪卡')) navigate('/question-bank/past-papers');
                  else if (todayChallenge.title.includes('工具')) navigate('/tool-sites');
                  else if (todayChallenge.title.includes('社区')) navigate('/community');
                  else if (todayChallenge.title.includes('实验')) navigate('/lab');
                  else if (todayChallenge.title.includes('笔记')) navigate(`/cyber-learning/cisp/day-${currentDay}`);
                  else navigate('/cyber-learning');
                }}
              >
                接受挑战 <Target size={16} />
              </Button>
            </div>
          </Card>

          {/* 本周打卡 */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-green/5 rounded-full -mr-16 -mt-16" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Flame size={24} className="text-cyber-red" />
                <h3 className="font-orbitron text-lg text-cyber-green">本周打卡</h3>
              </div>
              <div className="flex justify-around mb-4">
                {weekDays.map((day, index) => (
                  <div key={index} className="text-center">
                    <div
                      className={`
                        w-10 h-10 rounded-lg flex items-center justify-center mb-1
                        ${day.isToday ? 'bg-cyber-green/30 border-2 border-cyber-green' : 'bg-white/[0.08]'}
                        ${day.hasStreak ? 'text-cyber-green' : 'text-gray-500'}
                      `}
                    >
                      {day.hasStreak ? '✓' : day.date}
                    </div>
                    <span className="text-xs text-gray-400">
                      {['一', '二', '三', '四', '五', '六', '日'][index]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-center text-sm text-gray-400">
                连续学习 <span className="text-cyber-red font-bold">{streak}</span> 天
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 学习小贴士 */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-cyber-blue/8 to-white/[0.04]">
            <div className="flex items-start gap-4">
              <div className="text-4xl">{todayTip.icon}</div>
              <div>
                <h3 className="font-orbitron text-sm text-cyber-blue mb-2">💡 今日学习小贴士</h3>
                <p className="text-gray-300">{todayTip.tip}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={Calendar}
            label="学习天数"
            value={completedDays.length}
            color="#00ff88"
          />
          <StatCard
            icon={Flame}
            label="连续学习"
            value={`${streak}天`}
            color="#ff6b6b"
          />
          <StatCard
            icon={Trophy}
            label="获得成就"
            value={unlockedBadgeIds.length}
            color="#ffd700"
          />
          <StatCard
            icon={Zap}
            label="积分"
            value={points}
            color="#00d4ff"
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Progress */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="text-center">
              <h2 className="font-orbitron text-lg text-cyber-green mb-4">学习进度</h2>
              <div className="flex justify-center mb-6">
                <ProgressRing progress={progress} size={160} strokeWidth={10} />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">当前周数</span>
                  <span className="text-white">第{currentWeek}周/共12周</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">本周主题</span>
                  <span className="text-cyber-green">{weekInfo.theme}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">等级</span>
                  <Badge variant={levelInfo.color as 'green' | 'blue' | 'gold'}>{levelInfo.name}</Badge>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-6"
                onClick={() => navigate('/achievements')}
              >
                查看成就
              </Button>
            </Card>
          </motion.div>

          {/* Middle Column - Today's Tasks */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-orbitron text-lg text-cyber-green flex items-center gap-2">
                  <Target size={20} />
                  今日任务
                </h2>
                <Badge>Day {currentDay}</Badge>
              </div>

              {currentDayData && (
                <div className="mb-4 p-4 rounded-lg bg-cyber-black/30 border border-cyber-green/10">
                  <h3 className="text-white font-medium mb-2">{currentDayData.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {currentDayData.objectives?.slice(0, 3).map((obj, i) => (
                      <span key={i} className="text-xs text-gray-400 flex items-center gap-1">
                        <CheckCircle size={12} className="text-cyber-green" />
                        {obj}
                      </span>
                    ))}
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => navigate(`/cyber-learning/cisp/day-${currentDay}`)}
                  >
                    开始学习 <ArrowRight size={16} />
                  </Button>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="text-sm text-gray-400">待完成任务</h4>
                {upcomingDays.slice(0, 3).map((day) => (
                  <div
                    key={day.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-cyber-black/20 border border-cyber-green/5 hover:border-cyber-green/20 transition-colors cursor-pointer"
                    onClick={() => navigate(`/cyber-learning/cisp/${day.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyber-blue/20 flex items-center justify-center text-sm font-medium text-cyber-green">
                        {day.day}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{day.title}</p>
                        <p className="text-xs text-gray-500">第{day.week}周 · {day.objectives?.length}个学习目标</p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-gray-500" />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions - 14个功能入口 */}
        <motion.div variants={itemVariants}>
          <h2 className="font-orbitron text-lg text-cyber-green mb-4">快捷入口</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
            <Card
              className="text-center cursor-pointer group border-cyber-green/30 bg-gradient-to-br from-cyber-green/10 to-transparent"
              onClick={() => navigate('/cyber-learning')}
              glow
            >
              <BookOpen size={24} className="mx-auto mb-1 text-cyber-green group-hover:scale-110 transition-transform" />
              <p className="text-xs font-medium text-white">学习路径</p>
              <p className="text-[10px] text-gray-500">6大专项</p>
            </Card>
            <Card
              className="text-center cursor-pointer group"
              onClick={() => navigate('/interview-learning')}
              glow
            >
              <MessageSquare size={24} className="mx-auto mb-1 text-cyber-gold group-hover:scale-110 transition-transform" />
              <p className="text-xs font-medium text-white">面试突击</p>
              <p className="text-[10px] text-gray-500">5大方向</p>
            </Card>
            <Card
              className="text-center cursor-pointer group"
              onClick={() => navigate('/question-bank')}
              glow
            >
              <Library size={24} className="mx-auto mb-1 text-cyber-cyan group-hover:scale-110 transition-transform" />
              <p className="text-xs font-medium text-white">习题库</p>
              <p className="text-[10px] text-gray-500">错题/练习</p>
            </Card>
            <Card
              className="text-center cursor-pointer group"
              onClick={() => navigate('/question-bank/mock-exam')}
              glow
            >
              <ClipboardList size={24} className="mx-auto mb-1 text-cyber-red group-hover:scale-110 transition-transform" />
              <p className="text-xs font-medium text-white">模拟考试</p>
              <p className="text-[10px] text-gray-500">限时模考</p>
            </Card>
            <Card
              className="text-center cursor-pointer group"
              onClick={() => navigate('/question-bank/past-papers')}
              glow
            >
              <FileText size={24} className="mx-auto mb-1 text-purple-400 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-medium text-white">历年真题</p>
              <p className="text-[10px] text-gray-500">CISP真题</p>
            </Card>
            <Card
              className="text-center cursor-pointer group"
              onClick={() => navigate('/outline')}
              glow
            >
              <Gavel size={24} className="mx-auto mb-1 text-orange-400 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-medium text-white">考试大纲</p>
              <p className="text-[10px] text-gray-500">考点速览</p>
            </Card>
            <Card
              className="text-center cursor-pointer group"
              onClick={() => navigate('/books')}
              glow
            >
              <BookMarked size={24} className="mx-auto mb-1 text-rose-400 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-medium text-white">安全书库</p>
              <p className="text-[10px] text-gray-500">在线阅读</p>
            </Card>
            <Card
              className="text-center cursor-pointer group"
              onClick={() => navigate('/lab')}
              glow
            >
              <Code size={24} className="mx-auto mb-1 text-cyber-blue group-hover:scale-110 transition-transform" />
              <p className="text-xs font-medium text-white">代码实验室</p>
              <p className="text-[10px] text-gray-500">安全实验</p>
            </Card>
            <Card
              className="text-center cursor-pointer group"
              onClick={() => navigate('/lab/environment')}
              glow
            >
              <Server size={24} className="mx-auto mb-1 text-indigo-400 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-medium text-white">实验环境</p>
              <p className="text-[10px] text-gray-500">11大模块</p>
            </Card>
            {/* ✨ 新增：真实靶场 VM Labs */}
            <Card
              className="text-center cursor-pointer group border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-cyber-purple/5 ring-1 ring-rose-500/20"
              onClick={() => navigate('/lab/vm-labs')}
              glow
            >
              <Monitor size={24} className="mx-auto mb-1 text-rose-400 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-medium text-white">真实靶场</p>
              <p className="text-[10px] text-gray-500">Kali+Win7</p>
            </Card>
            <Card
              className="text-center cursor-pointer group"
              onClick={() => navigate('/online-tools')}
              glow
            >
              <Wrench size={24} className="mx-auto mb-1 text-amber-400 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-medium text-white">在线工具</p>
              <p className="text-[10px] text-gray-500">编码解码</p>
            </Card>
            <Card
              className="text-center cursor-pointer group"
              onClick={() => navigate('/tool-sites')}
              glow
            >
              <Globe size={24} className="mx-auto mb-1 text-teal-400 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-medium text-white">工具网站</p>
              <p className="text-[10px] text-gray-500">资源导航</p>
            </Card>
            <Card
              className="text-center cursor-pointer group"
              onClick={() => navigate('/study-tips')}
              glow
            >
              <Lightbulb size={24} className="mx-auto mb-1 text-yellow-400 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-medium text-white">学习技巧</p>
              <p className="text-[10px] text-gray-500">高效方法</p>
            </Card>
            <Card
              className="text-center cursor-pointer group"
              onClick={() => navigate('/achievements')}
              glow
            >
              <Award size={24} className="mx-auto mb-1 text-cyber-green group-hover:scale-110 transition-transform" />
              <p className="text-xs font-medium text-white">成就系统</p>
              <p className="text-[10px] text-gray-500">等级/徽章</p>
            </Card>
          </div>
        </motion.div>

        {/* 功能模块概览 - 6大模块 */}
        <motion.div variants={itemVariants}>
          <h2 className="font-orbitron text-lg text-cyber-green mb-4">功能模块</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 学习系统 */}
            <Card className="p-4 bg-gradient-to-br from-cyber-green/10 to-transparent border-cyber-green/20">
              <div className="flex items-center gap-3 mb-3">
                <GraduationCap size={28} className="text-cyber-green" />
                <div>
                  <h3 className="font-medium text-white">学习系统</h3>
                  <p className="text-xs text-gray-400">6大专项学习路径</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs px-2 py-1 rounded bg-cyber-green/20 text-cyber-green">CISP备考</span>
                <span className="text-xs px-2 py-1 rounded bg-cyber-blue/20 text-cyber-blue">基础入门</span>
                <span className="text-xs px-2 py-1 rounded bg-cyber-red/20 text-cyber-red">渗透测试</span>
                <span className="text-xs px-2 py-1 rounded bg-cyber-gold/20 text-cyber-gold">防御运营</span>
                <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400">AI安全</span>
                <span className="text-xs px-2 py-1 rounded bg-orange-500/20 text-orange-400">护网行动</span>
              </div>
              <Button size="sm" variant="outline" className="w-full" onClick={() => navigate('/cyber-learning')}>
                开始学习
              </Button>
            </Card>

            {/* 面试突击 */}
            <Card className="p-4 bg-gradient-to-br from-cyber-gold/10 to-transparent border-cyber-gold/20">
              <div className="flex items-center gap-3 mb-3">
                <MessageSquare size={28} className="text-cyber-gold" />
                <div>
                  <h3 className="font-medium text-white">面试突击</h3>
                  <p className="text-xs text-gray-400">5大方向面试准备</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs px-2 py-1 rounded bg-cyber-green/20 text-cyber-green">CISP面试</span>
                <span className="text-xs px-2 py-1 rounded bg-cyber-blue/20 text-cyber-blue">基础面试</span>
                <span className="text-xs px-2 py-1 rounded bg-cyber-red/20 text-cyber-red">渗透面试</span>
                <span className="text-xs px-2 py-1 rounded bg-cyber-gold/20 text-cyber-gold">防御面试</span>
                <span className="text-xs px-2 py-1 rounded bg-orange-500/20 text-orange-400">护网面试</span>
              </div>
              <Button size="sm" variant="outline" className="w-full" onClick={() => navigate('/interview-learning')}>
                开始面试准备
              </Button>
            </Card>

            {/* 实验平台 */}
            <Card className="p-4 bg-gradient-to-br from-cyber-blue/10 to-transparent border-cyber-blue/20">
              <div className="flex items-center gap-3 mb-3">
                <Server size={28} className="text-cyber-blue" />
                <div>
                  <h3 className="font-medium text-white">实验平台</h3>
                  <p className="text-xs text-gray-400">在线实验 + 真实 VM 靶场</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs px-2 py-1 rounded bg-cyber-red/20 text-cyber-red">XSS/SQLi</span>
                <span className="text-xs px-2 py-1 rounded bg-cyber-gold/20 text-cyber-gold">CTF挑战</span>
                <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400">密码破解</span>
                <span className="text-xs px-2 py-1 rounded bg-rose-500/20 text-rose-400">真实VM靶场</span>
                <span className="text-xs px-2 py-1 rounded bg-cyber-blue/20 text-cyber-blue">Burp模拟</span>
                <span className="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-400">日志分析</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" onClick={() => navigate('/lab/environment')}>
                  在线实验
                </Button>
                <Button size="sm" variant="danger" onClick={() => navigate('/lab/vm-labs')}>
                  真实靶场
                </Button>
              </div>
            </Card>

            {/* 题库系统 */}
            <Card className="p-4 bg-gradient-to-br from-cyber-red/10 to-transparent border-cyber-red/20">
              <div className="flex items-center gap-3 mb-3">
                <Library size={28} className="text-cyber-red" />
                <div>
                  <h3 className="font-medium text-white">题库系统</h3>
                  <p className="text-xs text-gray-400">练习/真题/模考/错题</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs px-2 py-1 rounded bg-cyber-gold/20 text-cyber-gold">历年真题</span>
                <span className="text-xs px-2 py-1 rounded bg-cyber-red/20 text-cyber-red">错题本</span>
                <span className="text-xs px-2 py-1 rounded bg-cyber-green/20 text-cyber-green">章节测验</span>
                <span className="text-xs px-2 py-1 rounded bg-cyber-blue/20 text-cyber-blue">模拟考试</span>
                <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400">每日一练</span>
              </div>
              <Button size="sm" variant="outline" className="w-full" onClick={() => navigate('/question-bank')}>
                进入题库
              </Button>
            </Card>

            {/* 工具资源 */}
            <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
              <div className="flex items-center gap-3 mb-3">
                <Wrench size={28} className="text-purple-400" />
                <div>
                  <h3 className="font-medium text-white">工具资源</h3>
                  <p className="text-xs text-gray-400">在线工具+网站导航</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs px-2 py-1 rounded bg-cyber-green/20 text-cyber-green">在线工具</span>
                <span className="text-xs px-2 py-1 rounded bg-cyber-blue/20 text-cyber-blue">编码转换</span>
                <span className="text-xs px-2 py-1 rounded bg-cyber-red/20 text-cyber-red">Hash计算</span>
                <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400">网站导航</span>
                <span className="text-xs px-2 py-1 rounded bg-cyber-gold/20 text-cyber-gold">漏洞情报</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" onClick={() => navigate('/online-tools')}>
                  在线工具
                </Button>
                <Button size="sm" variant="outline" onClick={() => navigate('/tool-sites')}>
                  工具网站
                </Button>
              </div>
            </Card>

            {/* 辅助功能 */}
            <Card className="p-4 bg-gradient-to-br from-rose-500/10 to-transparent border-rose-500/20">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles size={28} className="text-rose-400" />
                <div>
                  <h3 className="font-medium text-white">备考辅助</h3>
                  <p className="text-xs text-gray-400">书库/大纲/技巧/资料</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs px-2 py-1 rounded bg-rose-500/20 text-rose-400">安全书库</span>
                <span className="text-xs px-2 py-1 rounded bg-cyber-gold/20 text-cyber-gold">考试大纲</span>
                <span className="text-xs px-2 py-1 rounded bg-cyber-blue/20 text-cyber-blue">学习技巧</span>
                <span className="text-xs px-2 py-1 rounded bg-cyber-green/20 text-cyber-green">安全资源</span>
                <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400">文档资料</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" onClick={() => navigate('/books')}>
                  安全书库
                </Button>
                <Button size="sm" variant="outline" onClick={() => navigate('/resources')}>
                  资源库
                </Button>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* 实验环境11大模块展示 */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-orbitron text-lg text-cyber-green">实验环境 · 11大模块</h2>
            <div
              onClick={() => navigate('/lab/environment')}
              className="cursor-pointer inline-flex items-center"
            >
              <Badge>
                全部实验 <ArrowRight size={12} />
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {LabModules.map((mod) => (
              <Card
                key={mod.id}
                className="text-center cursor-pointer group transition-all hover:scale-[1.03] hover:-translate-y-1"
                onClick={() => navigate('/lab/environment')}
              >
                <div
                  className="w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center"
                  style={{ background: `${mod.color}20` }}
                >
                  <mod.icon size={22} style={{ color: mod.color }} />
                </div>
                <p className="text-xs font-medium text-white mb-1">{mod.name}</p>
                <p className="text-[10px] text-gray-500 leading-tight">{mod.desc}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* 真实靶场展示 Kali + Win7 */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-orbitron text-lg text-rose-400 flex items-center gap-2">
              <Monitor size={20} /> 真实靶场 · Kali + Win7
            </h2>
            <div
              onClick={() => navigate('/lab/vm-labs')}
              className="cursor-pointer inline-flex items-center"
            >
              <Badge className="!border-rose-500/30 !text-rose-300">
                进入靶场 <ArrowRight size={12} />
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Kali */}
            <Card
              className="p-5 cursor-pointer group bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent border-cyan-500/25 hover:border-cyan-500/40 transition-colors"
              onClick={() => navigate('/lab/vm-labs')}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-2xl">
                  🐉
                </div>
                <div>
                  <div className="font-semibold text-cyan-300">Kali Linux · 攻击机</div>
                  <div className="text-xs text-gray-500 font-mono">192.168.108.128:22</div>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-gray-400">
                <div className="flex gap-2"><Cpu size={12} className="text-cyan-400 mt-0.5 shrink-0" /><span>渗透测试平台，预装 Nmap/MSF/Hydra/...</span></div>
                <div className="flex gap-2"><Terminal size={12} className="text-cyan-400 mt-0.5 shrink-0" /><span>SSH 终端直连，命令实时输出</span></div>
                <div className="flex gap-2"><Network size={12} className="text-cyan-400 mt-0.5 shrink-0" /><span>与 Win7 靶机互通，可发起真实攻击</span></div>
              </div>
            </Card>

            {/* 中间链路图 */}
            <Card
              className="p-5 cursor-pointer group bg-gradient-to-br from-cyber-purple/10 via-cyber-black to-cyber-purple/10 border-cyber-purple/25 hover:border-cyber-purple/50 transition-colors"
              onClick={() => navigate('/lab/vm-labs')}
            >
              <div className="h-full flex flex-col justify-center">
                <div className="text-center mb-4">
                  <div className="text-xs font-semibold text-cyber-purple mb-2">攻击链路</div>
                  <div className="flex items-center justify-center gap-3">
                    <div className="text-xs px-2 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono">
                      Kali
                    </div>
                    <div className="flex items-center text-cyber-green text-xs font-bold">
                      <span>nmap / msf / hydra ...</span>
                      <ArrowRight size={14} className="ml-2 animate-pulse" />
                    </div>
                    <div className="text-xs px-2 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono">
                      Win7
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 space-y-1.5 border-t border-white/5 pt-3">
                  <div className="flex gap-2"><ShieldAlert size={12} className="text-rose-400 mt-0.5 shrink-0" /><span>针对 SMB(445) 的 MS17-010 / MS08-067</span></div>
                  <div className="flex gap-2"><Key size={12} className="text-amber-400 mt-0.5 shrink-0" /><span>RDP(3389) / SMB 密码爆破</span></div>
                  <div className="flex gap-2"><Bug size={12} className="text-purple-400 mt-0.5 shrink-0" /><span>HTTP(80) 目录探测 / SQLMap 注入</span></div>
                </div>
              </div>
            </Card>

            {/* Win7 */}
            <Card
              className="p-5 cursor-pointer group bg-gradient-to-br from-amber-500/10 via-transparent to-transparent border-amber-500/25 hover:border-amber-500/40 transition-colors"
              onClick={() => navigate('/lab/vm-labs')}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-2xl">
                  🪟
                </div>
                <div>
                  <div className="font-semibold text-amber-300">Windows 7 · 靶机</div>
                  <div className="text-xs text-gray-500 font-mono">192.168.108.129</div>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-gray-400">
                <div className="flex gap-2"><Lock size={12} className="text-amber-400 mt-0.5 shrink-0" /><span>空密码 Administrator，SMB/RDP 开放</span></div>
                <div className="flex gap-2"><FileQuestion size={12} className="text-amber-400 mt-0.5 shrink-0" /><span>经典 Win7 未打补丁：MS17-010 等</span></div>
                <div className="flex gap-2"><Target size={12} className="text-amber-400 mt-0.5 shrink-0" /><span>扫描 → 利用 → 爆破 → 后渗透全流程</span></div>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* DVWA Web 漏洞靶场展示 */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-orbitron text-lg text-violet-400 flex items-center gap-2">
              <Target size={20} /> DVWA Web 漏洞靶场 · 双机部署
            </h2>
            <div className="flex items-center gap-2">
              <a
                href="http://192.168.108.128:9111/dvwa/"
                target="_blank"
                rel="noreferrer"
                className="cursor-pointer inline-flex items-center"
              >
                <Badge className="!border-cyan-500/30 !text-cyan-300">
                  DVWA (Kali) <ExternalLink size={12} className="ml-1" />
                </Badge>
              </a>
              <a
                href="http://192.168.108.129/dvwa/"
                target="_blank"
                rel="noreferrer"
                className="cursor-pointer inline-flex items-center"
              >
                <Badge className="!border-amber-500/30 !text-amber-300">
                  DVWA (Win7) <ExternalLink size={12} className="ml-1" />
                </Badge>
              </a>
              <div
                onClick={() => navigate('/lab/vm-labs')}
                className="cursor-pointer inline-flex items-center"
              >
                <Badge className="!border-violet-500/30 !text-violet-300">
                  进入靶场 <ArrowRight size={12} />
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* DVWA Kali */}
            <Card
              className="p-5 cursor-pointer group bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10 border-cyan-500/25 hover:border-violet-500/50 transition-colors"
              onClick={() => navigate('/lab/vm-labs')}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-2xl">
                  🐲
                </div>
                <div>
                  <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                    DVWA · Kali Node 版
                    <a
                      href="http://192.168.108.128:9111/dvwa/"
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title="新标签打开"
                    >
                      <ExternalLink size={12} className="text-gray-400 hover:text-cyan-300" />
                    </a>
                  </div>
                  <div className="text-xs text-gray-500 font-mono break-all">
                    http://192.168.108.128:9111/dvwa/
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-gray-400">
                <div className="flex gap-2"><Globe2 size={12} className="text-cyan-400 mt-0.5 shrink-0" /><span>npm install dvwa 一键 Node.js 部署</span></div>
                <div className="flex gap-2"><Key size={12} className="text-amber-400 mt-0.5 shrink-0" /><span>默认账密: admin / password</span></div>
                <div className="flex gap-2"><Bug size={12} className="text-rose-400 mt-0.5 shrink-0" /><span>暴力破解 · XSS · SQLi · 文件包含 · 上传 · CSRF</span></div>
              </div>
            </Card>

            {/* 中间：DVWA 攻击矩阵 */}
            <Card
              className="p-5 cursor-pointer group bg-gradient-to-br from-violet-500/10 via-cyber-black to-violet-500/10 border-violet-500/25 hover:border-violet-500/50 transition-colors"
              onClick={() => navigate('/lab/vm-labs')}
            >
              <div className="h-full flex flex-col justify-center">
                <div className="text-center mb-3">
                  <div className="text-xs font-semibold text-violet-300 mb-2">DVWA 漏洞矩阵 (low 难度)</div>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                    {[
                      ['Brute Force', 'rose'],
                      ['Command Inj.', 'cyan'],
                      ['CSRF', 'emerald'],
                      ['File Upload', 'amber'],
                      ['File Incl.', 'indigo'],
                      ['SQL Injection', 'violet'],
                      ['XSS (Refl.)', 'pink'],
                      ['XSS (Stored)', 'pink'],
                    ].map(([name, color]) => (
                      <div
                        key={name}
                        className={`px-1.5 py-1 rounded border bg-black/30 text-${color}-300 border-${color}-500/30 truncate`}
                      >
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-gray-400 space-y-1.5 border-t border-white/5 pt-3">
                  <div className="flex gap-2"><Terminal size={12} className="text-cyan-400 mt-0.5 shrink-0" /><span>curl/sqlmap/nikto/gobuster 全自动</span></div>
                  <div className="flex gap-2"><ShieldAlert size={12} className="text-amber-400 mt-0.5 shrink-0" /><span>低/中/高/不可用 四级安全难度</span></div>
                  <div className="flex gap-2"><ExternalLink size={12} className="text-violet-400 mt-0.5 shrink-0" /><span>直接在浏览器中手动体验漏洞</span></div>
                </div>
              </div>
            </Card>

            {/* DVWA Win7 */}
            <Card
              className="p-5 cursor-pointer group bg-gradient-to-br from-amber-500/10 via-transparent to-violet-500/10 border-amber-500/25 hover:border-violet-500/50 transition-colors"
              onClick={() => navigate('/lab/vm-labs')}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-2xl">
                  🪟
                </div>
                <div>
                  <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                    DVWA · Win7 phpStudy 版
                    <a
                      href="http://192.168.108.129/dvwa/"
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title="新标签打开"
                    >
                      <ExternalLink size={12} className="text-gray-400 hover:text-amber-300" />
                    </a>
                  </div>
                  <div className="text-xs text-gray-500 font-mono break-all">
                    http://192.168.108.129/dvwa/
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-gray-400">
                <div className="flex gap-2"><Database size={12} className="text-amber-400 mt-0.5 shrink-0" /><span>phpStudy 一键 Apache + PHP + MySQL</span></div>
                <div className="flex gap-2"><Key size={12} className="text-amber-400 mt-0.5 shrink-0" /><span>默认账密: admin / password (需 Setup 建表)</span></div>
                <div className="flex gap-2"><Shield size={12} className="text-rose-400 mt-0.5 shrink-0" /><span>经典 Windows PHP 环境，LFI → win.ini / webshell</span></div>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Week Overview */}
        <motion.div variants={itemVariants}>
          <h2 className="font-orbitron text-lg text-cyber-green mb-4">CISP 学习路径总览</h2>
          <Card>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-2">
              {weekThemes.map((week, i) => (
                <div
                  key={i}
                  className={`
                    relative group p-3 rounded-lg border transition-all cursor-pointer
                    ${i + 1 <= currentWeek
                      ? 'bg-cyber-green/10 border-cyber-green/30'
                      : 'bg-white/[0.05] border-white/10 hover:border-white/20'
                    }
                  `}
                  onClick={() => navigate('/cyber-learning')}
                >
                  <div className="text-xs text-gray-400 mb-1">第{i + 1}周</div>
                  <div
                    className="text-xs font-medium truncate"
                    style={{ color: week.color }}
                  >
                    {week.theme.substring(0, 4)}
                  </div>
                  {i + 1 < currentWeek && (
                    <CheckCircle
                      size={12}
                      className="absolute top-1 right-1 text-cyber-green"
                    />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* 专项学习计划 */}
        <motion.div variants={itemVariants}>
          <h2 className="font-orbitron text-lg text-cyber-green mb-4">专项学习计划</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { id: 'cisp', name: 'CISP备考', desc: '90天', color: '#00ff88', icon: '📚', path: '/cyber-learning' },
              { id: 'basic', name: '基础入门', desc: '30天', color: '#00d4ff', icon: '🔰', path: '/cyber-learning/basic' },
              { id: 'penetration', name: '渗透测试', desc: '30天', color: '#ff6b6b', icon: '🎯', path: '/cyber-learning/penetration' },
              { id: 'defense', name: '防御运营', desc: '30天', color: '#ffd700', icon: '🛡️', path: '/cyber-learning/defense' },
              { id: 'ai', name: 'AI安全', desc: '168天', color: '#a855f7', icon: '🤖', path: '/cyber-learning/ai' },
              { id: 'hw', name: '护网行动', desc: '120天', color: '#f97316', icon: '🔴', path: '/cyber-learning/hw' },
            ].map((plan) => (
              <Card
                key={plan.id}
                className="text-center cursor-pointer group transition-all hover:scale-[1.02]"
                onClick={() => navigate(plan.path)}
              >
                <span className="text-2xl block mb-1">{plan.icon}</span>
                <p className="text-xs font-medium text-white">{plan.name}</p>
                <p className="text-[10px] text-gray-500">{plan.desc}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* 面试突击计划 */}
        <motion.div variants={itemVariants}>
          <h2 className="font-orbitron text-lg text-cyber-gold mb-4">面试突击计划</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { id: 'interview-cisp', name: 'CISP面试', desc: '45天', color: '#00ff88', icon: '💼', path: '/interview-learning/cisp' },
              { id: 'interview-basic', name: '基础面试', desc: '45天', color: '#00d4ff', icon: '📝', path: '/interview-learning/basic' },
              { id: 'interview-pen', name: '渗透面试', desc: '45天', color: '#ff6b6b', icon: '🔍', path: '/interview-learning/penetration' },
              { id: 'interview-def', name: '防御面试', desc: '45天', color: '#ffd700', icon: '🔒', path: '/interview-learning/defense' },
              { id: 'interview-hw', name: '护网面试', desc: '45天', color: '#f97316', icon: '🚨', path: '/interview-learning/hw' },
            ].map((plan) => (
              <Card
                key={plan.id}
                className="text-center cursor-pointer group transition-all hover:scale-[1.02] bg-gradient-to-br from-cyber-gold/5 to-transparent border-cyber-gold/20"
                onClick={() => navigate(plan.path)}
              >
                <span className="text-2xl block mb-1">{plan.icon}</span>
                <p className="text-xs font-medium text-white">{plan.name}</p>
                <p className="text-[10px] text-gray-500">{plan.desc}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* 学习数据统计 */}
        <motion.div variants={itemVariants}>
          <h2 className="font-orbitron text-lg text-cyber-green mb-4">学习数据统计</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="flex flex-col items-center text-center py-6 bg-gradient-to-br from-cyber-green/8 to-transparent">
              <div className="relative w-32 h-32 mb-3">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" strokeWidth="8" fill="none" className="text-white/10" stroke="currentColor" />
                  <circle
                    cx="50" cy="50" r="42" strokeWidth="8" fill="none"
                    className="text-cyber-green" stroke="currentColor"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={2 * Math.PI * 42 * (1 - Math.min(1, overallProgress / 100))}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold text-white">{overallProgress}%</div>
                  <div className="text-xs text-gray-400">整体进度</div>
                </div>
              </div>
              <h3 className="text-white font-medium mt-2">学习总进度</h3>
              <p className="text-xs text-gray-400 mt-1">
                已完成 {completedDays.length} / {learningData.length} 天
              </p>
            </Card>

            <Card className="flex flex-col items-center text-center py-6">
              <Brain size={32} className="text-cyber-blue mb-2" />
              <div className="text-3xl font-bold text-white">{extraStats.flashAnswered}</div>
              <h3 className="text-white font-medium mt-2">闪卡练习</h3>
              <p className="text-xs text-gray-400 mt-1">
                正确率 {extraStats.flashAnswered > 0 ? Math.round((extraStats.flashCorrect / extraStats.flashAnswered) * 100) : 0}%
              </p>
              <div className="w-full h-1.5 mt-3 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-cyber-blue"
                  style={{ width: `${extraStats.flashAnswered > 0 ? Math.round((extraStats.flashCorrect / extraStats.flashAnswered) * 100) : 0}%` }}
                />
              </div>
              <Button size="sm" className="mt-3" onClick={() => navigate('/question-bank/past-papers')}>
                继续练习
              </Button>
            </Card>

            <Card className="flex flex-col items-center text-center py-6">
              <Clock size={32} className="text-cyber-gold mb-2" />
              <div className="text-3xl font-bold text-white">{extraStats.pomodoroCount}</div>
              <h3 className="text-white font-medium mt-2">专注番茄</h3>
              <p className="text-xs text-gray-400 mt-1">
                约 {extraStats.pomodoroCount * 25} 分钟专注学习
              </p>
              <div className="flex gap-1 mt-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <span
                    key={i}
                    className={`w-2 h-6 rounded-full ${
                      i <= Math.min(5, Math.ceil(extraStats.pomodoroCount / 2))
                        ? 'bg-cyber-gold'
                        : 'bg-white/15'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {extraStats.pomodoroCount < 10 ? '加油，积累专注时间!' : '很棒，继续保持!'}
              </p>
            </Card>

            <Card className="flex flex-col items-center text-center py-6">
              <Award size={32} className="text-cyber-green mb-2" />
              <div className="text-3xl font-bold text-white">{extraStats.notesCount}</div>
              <h3 className="text-white font-medium mt-2">学习笔记</h3>
              <p className="text-xs text-gray-400 mt-1">
                共 {extraStats.notesCount} 节课做了笔记
              </p>
              <div className="mt-3 flex gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-cyber-green/20 text-cyber-green">
                  {unlockedBadgeIds.length} 个徽章
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-cyber-blue/20 text-cyber-blue">
                  {points} 积分
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">等级: {levelInfo.name}</p>
            </Card>
          </div>
        </motion.div>

        {/* 社区与成就快捷入口 */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20 cursor-pointer hover:border-purple-500/40 transition-colors"
              onClick={() => navigate('/achievements')}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                  <Trophy size={28} className="text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">成就系统</h3>
                  <p className="text-xs text-gray-400 mt-1">解锁徽章、积累经验值、提升等级</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="gold">{points} XP</Badge>
                    <Badge variant="green">{unlockedBadgeIds.length} 徽章</Badge>
                    <Badge variant="blue">Lv.{levelInfo.level}</Badge>
                  </div>
                </div>
                <ArrowRight size={20} className="text-gray-500" />
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-cyber-blue/10 to-transparent border-cyber-blue/20 cursor-pointer hover:border-cyber-blue/40 transition-colors"
              onClick={() => navigate('/community')}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-cyber-blue/20 flex items-center justify-center">
                  <Users size={28} className="text-cyber-blue" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">社区交流</h3>
                  <p className="text-xs text-gray-400 mt-1">与千万安全爱好者一起交流进步</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="green">提问讨论</Badge>
                    <Badge variant="blue">经验分享</Badge>
                    <Badge variant="gold">技术文章</Badge>
                  </div>
                </div>
                <ArrowRight size={20} className="text-gray-500" />
              </div>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
