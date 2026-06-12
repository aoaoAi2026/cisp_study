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
  Award
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
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-purple/40 border border-cyber-green/20">
            <Shield size={16} className="text-cyber-green" />
            <span className="text-sm text-gray-300">{todayQuote}</span>
          </div>
        </motion.div>

        {/* 每日挑战和打卡 */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 每日挑战 */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-cyber-gold/10 to-cyber-purple/10">
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
                  if (todayChallenge.title.includes('测验')) navigate('/quiz');
                  else if (todayChallenge.title.includes('闪卡')) navigate('/flashcards');
                  else if (todayChallenge.title.includes('工具')) navigate('/tools');
                  else if (todayChallenge.title.includes('社区')) navigate('/community');
                  else if (todayChallenge.title.includes('实验')) navigate('/lab');
                  else if (todayChallenge.title.includes('笔记')) navigate(`/learning/day-${currentDay}`);
                  else navigate('/learning');
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
                        ${day.isToday ? 'bg-cyber-green/30 border-2 border-cyber-green' : 'bg-cyber-purple/20'}
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
          <Card className="bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10">
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
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    onClick={() => navigate(`/learning/day-${currentDay}`)}
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
                    onClick={() => navigate(`/learning/${day.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyber-purple/60 flex items-center justify-center text-sm font-medium text-cyber-green">
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

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <h2 className="font-orbitron text-lg text-cyber-green mb-4">快捷入口</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card
              className="text-center cursor-pointer group"
              onClick={() => navigate('/learning')}
              glow
            >
              <BookOpen size={32} className="mx-auto mb-2 text-cyber-green group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-white">学习路径</p>
              <p className="text-xs text-gray-500">90天计划</p>
            </Card>
            <Card
              className="text-center cursor-pointer group"
              onClick={() => navigate('/lab')}
              glow
            >
              <Code size={32} className="mx-auto mb-2 text-cyber-blue group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-white">代码实验室</p>
              <p className="text-xs text-gray-500">安全实验</p>
            </Card>
            <Card
              className="text-center cursor-pointer group"
              onClick={() => navigate('/quiz')}
              glow
            >
              <FileQuestion size={32} className="mx-auto mb-2 text-cyber-gold group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-white">测验中心</p>
              <p className="text-xs text-gray-500">章节测验</p>
            </Card>
            <Card
              className="text-center cursor-pointer group"
              onClick={() => navigate('/community')}
              glow
            >
              <Users size={32} className="mx-auto mb-2 text-cyber-red group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-white">社区交流</p>
              <p className="text-xs text-gray-500">学习笔记</p>
            </Card>
          </div>
        </motion.div>

        {/* Week Overview */}
        <motion.div variants={itemVariants}>
          <h2 className="font-orbitron text-lg text-cyber-green mb-4">学习路径总览</h2>
          <Card>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-2">
              {weekThemes.map((week, i) => (
                <div
                  key={i}
                  className={`
                    relative group p-3 rounded-lg border transition-all cursor-pointer
                    ${i + 1 <= currentWeek
                      ? 'bg-cyber-green/10 border-cyber-green/30'
                      : 'bg-cyber-purple/20 border-cyber-green/10 hover:border-cyber-green/20'
                    }
                  `}
                  onClick={() => navigate('/learning')}
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

        {/* 学习数据统计 */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="flex flex-col items-center text-center py-6 bg-gradient-to-br from-cyber-green/10 to-cyber-purple/10">
              <div className="relative w-32 h-32 mb-3">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" strokeWidth="8" fill="none" className="text-cyber-purple/30" stroke="currentColor" />
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
              <div className="w-full h-1.5 mt-3 rounded-full bg-cyber-purple/30 overflow-hidden">
                <div
                  className="h-full bg-cyber-blue"
                  style={{ width: `${extraStats.flashAnswered > 0 ? Math.round((extraStats.flashCorrect / extraStats.flashAnswered) * 100) : 0}%` }}
                />
              </div>
              <Button size="sm" className="mt-3" onClick={() => navigate('/flashcards')}>
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
                        : 'bg-cyber-purple/30'
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
      </motion.div>
    </div>
  );
};

export default Dashboard;
