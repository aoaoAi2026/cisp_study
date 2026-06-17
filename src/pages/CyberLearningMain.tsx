// 网络安全学习综合页面
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Target,
  Lock,
  ChevronRight,
  Clock,
  BookOpen,
  Trophy,
  Star,
  Zap,
  Globe,
  Cpu,
  Brain,
  GraduationCap
} from 'lucide-react';
import { Card } from '../components/UI';
import { cyberBasicPlan, CyberLearningPlan } from '../data/cyberBasic';
import { cyberPenetrationPlan } from '../data/cyberPenetration';
import { cyberDefensePlan } from '../data/cyberDefense';
import { cyberAiPlan } from '../data/cyberAi';
import { cyberHwPlan } from '../data/cyberHw';
import { learningData as cispLearningData } from '../data/learningData';
import { loadData } from '../data/persistData';
import { useLearningStore } from '../store';

interface CyberLearningMainProps {}

const plans: CyberLearningPlan[] = [
  cyberBasicPlan,
  cyberPenetrationPlan,
  cyberDefensePlan,
  cyberAiPlan,
  cyberHwPlan
];

const difficultyIcon = (d: string) => {
  if (d === '入门') return <Zap size={14} className="text-cyber-green" />;
  if (d === '进阶') return <Star size={14} className="text-cyber-gold" />;
  return <Lock size={14} className="text-cyber-red" />;
};

const planIcon = (id: string) => {
  if (id === 'basic') return <Shield size={40} />;
  if (id === 'penetration') return <Target size={40} />;
  if (id === 'ai') return <Brain size={40} />;
  if (id === 'hw') return <Globe size={40} />;
  return <Cpu size={40} />;
};

const planBg = (id: string) => {
  if (id === 'basic') return 'from-cyber-green/5 to-transparent';
  if (id === 'penetration') return 'from-cyber-red/5 to-transparent';
  if (id === 'ai') return 'from-white/[0.03] to-transparent';
  if (id === 'hw') return 'from-cyber-gold/5 to-transparent';
  return 'from-cyber-blue/5 to-transparent';
};

const planBorder = (id: string) => {
  if (id === 'basic') return 'border-cyber-green/30';
  if (id === 'penetration') return 'border-cyber-red/30';
  if (id === 'ai') return 'border-white/15';
  if (id === 'hw') return 'border-cyber-gold/30';
  return 'border-cyber-blue/30';
};

const planHover = (id: string) => {
  if (id === 'basic') return 'hover:border-cyber-green/50';
  if (id === 'penetration') return 'hover:border-cyber-red/50';
  if (id === 'ai') return 'hover:border-white/30';
  if (id === 'hw') return 'hover:border-cyber-gold/50';
  return 'hover:border-cyber-blue/50';
};

export const CyberLearningMain: React.FC<CyberLearningMainProps> = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const { completedDays } = useLearningStore();

  const cispCompleted = completedDays.filter(cd => cd.dayId?.startsWith('day-')).length;
  const cispTotal = cispLearningData.length;
  const cispPct = Math.round((cispCompleted / cispTotal) * 100);
  // 下一个未完成的天
  const cispNextDay = useMemo(() => {
    const doneIds = new Set(completedDays.map(cd => cd.dayId));
    const firstUndone = cispLearningData.find(d => !doneIds.has(d.id));
    return firstUndone?.id || 'day-1';
  }, [completedDays]);

  useEffect(() => {
    loadData<any>('cisp_cyber_progress', {}).then(data => {
      const map: Record<string, number> = {};
      for (const key of Object.keys(data)) {
        map[key] = data[key]?.completedDays?.length || 0;
      }
      setProgressMap(map);
    });
  }, []);

  const getProgress = (planId: string) => progressMap[planId] || 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/[0.06] to-cyber-green/10 flex items-center justify-center">
            <Globe size={32} className="text-cyber-green" />
          </div>
          <div>
            <h1 className="font-orbitron text-2xl font-bold text-cyber-green">
              网络安全学习中心
            </h1>
            <p className="text-gray-400 mt-1">
              五个阶段 · 实战学习 · 从基础到高级
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants}>
          <Card className="text-center py-4">
            <div className="text-2xl font-bold text-cyber-green">{plans.reduce((s, p) => s + p.totalDays, 0)}</div>
            <div className="text-xs text-gray-400 mt-1">总学习天数</div>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="text-center py-4">
            <div className="text-2xl font-bold text-gray-200">
            </div>
            <div className="text-xs text-gray-400 mt-1">已完成天数</div>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="text-center py-4">
            <div className="text-2xl font-bold text-cyber-blue">{plans.length}</div>
            <div className="text-xs text-gray-400 mt-1">学习阶段</div>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="text-center py-4">
            <div className="text-2xl font-bold text-cyber-gold">
              {(() => {
                const totalDays = plans.reduce((s, p) => s + p.totalDays, 0);
                const completed = getProgress('basic') + getProgress('penetration') + getProgress('defense') + getProgress('ai') + getProgress('hw');
                return completed > 0 ? Math.round((completed / totalDays) * 100) : 0;
              })()}%
            </div>
            <div className="text-xs text-gray-400 mt-1">总进度</div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Plan Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {plans.map((plan) => {
          const completed = getProgress(plan.id);
          const pct = Math.round((completed / plan.totalDays) * 100);

          return (
            <motion.div key={plan.id} variants={itemVariants}>
              <Card
                className={`
                  bg-gradient-to-br ${planBg(plan.id)} border ${planBorder(plan.id)} ${planHover(plan.id)}
                  transition-all duration-300
                `}
              >
                <div className="flex items-start gap-5">
                  {/* 左侧图标 */}
                  <div
                    className={`
                      w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0
                      ${plan.id === 'basic' ? 'bg-cyber-green/20 text-cyber-green' : ''}
                      ${plan.id === 'penetration' ? 'bg-cyber-red/20 text-cyber-red' : ''}
                      ${plan.id === 'defense' ? 'bg-cyber-blue/20 text-cyber-blue' : ''}
                      ${plan.id === 'ai' ? 'bg-white/[0.08] text-white' : ''}
                      ${plan.id === 'hw' ? 'bg-cyber-gold/20 text-cyber-gold' : ''}
                    `}
                  >
                    {planIcon(plan.id)}
                  </div>

                  {/* 中间内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="font-orbitron text-lg font-bold text-white">
                        {plan.icon} {plan.name}
                      </h2>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                          plan.difficulty === '入门' ? 'border-cyber-green/30 text-cyber-green' :
                          plan.difficulty === '进阶' ? 'border-cyber-gold/30 text-cyber-gold' :
                          'border-cyber-red/30 text-cyber-red'
                        }`}
                      >
                        {difficultyIcon(plan.difficulty)}
                        {plan.difficulty}
                      </span>
                    </div>

                    <p className="text-sm text-gray-400 mb-3">{plan.description}</p>

                    {/* 进度条 */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            plan.id === 'basic' ? 'bg-cyber-green' :
                            plan.id === 'penetration' ? 'bg-cyber-red' :
                            plan.id === 'ai' ? 'bg-[#7a8a9a]' :
                            plan.id === 'hw' ? 'bg-cyber-gold' : 'bg-cyber-blue'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {completed}/{plan.totalDays} 天 ({pct}%)
                      </span>
                    </div>

                    {/* 展开详情 */}
                    {expanded === plan.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-white/10 space-y-3"
                      >
                        {/* 先决条件 */}
                        <div>
                          <h4 className="text-xs font-medium text-white mb-2">📋 学习前提</h4>
                          <div className="flex flex-wrap gap-2">
                            {plan.prerequisites.map((p, i) => (
                              <span key={i} className="text-xs px-2 py-1 rounded bg-white/10 text-gray-300">
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                        {/* 证书方向 */}
                        <div>
                          <h4 className="text-xs font-medium text-white mb-2">🎓 完成后方向</h4>
                          <p className="text-xs text-gray-400">{plan.certification}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* 右侧按钮 */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => setExpanded(expanded === plan.id ? null : plan.id)}
                      className={`text-xs px-4 py-2 rounded-lg border bg-white/5 backdrop-blur-sm transition-all duration-200 ${
                        plan.id === 'basic'
                          ? 'border-cyber-green/50 text-cyber-green hover:bg-cyber-green/20 hover:border-cyber-green/80'
                        : plan.id === 'penetration'
                          ? 'border-cyber-red/50 text-cyber-red hover:bg-cyber-red/20 hover:border-cyber-red/80'
                        : plan.id === 'ai'
                          ? 'border-gray-500/50 text-gray-300 hover:bg-white/10 hover:border-gray-400'
                        : plan.id === 'hw'
                          ? 'border-cyber-gold/50 text-cyber-gold hover:bg-cyber-gold/20 hover:border-cyber-gold/80'
                        : 'border-cyber-blue/50 text-cyber-blue hover:bg-cyber-blue/20 hover:border-cyber-blue/80'
                      }`}
                    >
                      {expanded === plan.id ? '收起 ▲' : '详情 ▼'}
                    </button>
                    <button
                      onClick={() => navigate(`/cyber-learning/${plan.id}`)}
                      className={`flex items-center gap-1 text-xs px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                        plan.id === 'basic'
                          ? 'bg-[#00cc66] text-black hover:bg-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,0.3)] hover:shadow-[0_0_20px_rgba(0,255,136,0.5)]'
                        : plan.id === 'penetration'
                          ? 'bg-[#e04444] text-white hover:bg-[#ff5555] shadow-[0_0_12px_rgba(255,68,68,0.3)] hover:shadow-[0_0_20px_rgba(255,68,68,0.5)]'
                        : plan.id === 'ai'
                          ? 'bg-[#5b7a8a] text-white hover:bg-[#789aa8] shadow-[0_0_10px_rgba(91,122,138,0.3)] hover:shadow-[0_0_16px_rgba(91,122,138,0.45)]'
                        : plan.id === 'hw'
                          ? 'bg-[#e8a020] text-black hover:bg-[#ffb830] shadow-[0_0_12px_rgba(232,160,32,0.35)] hover:shadow-[0_0_20px_rgba(232,160,32,0.5)]'
                        : 'bg-[#3388ee] text-white hover:bg-[#5599ff] shadow-[0_0_12px_rgba(51,136,238,0.3)] hover:shadow-[0_0_20px_rgba(51,136,238,0.5)]'
                      }`}
                    >
                      {completed > 0 ? '继续学习' : '开始学习'}
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* CISP学习入口 */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-cyber-gold/5 to-transparent border border-cyber-gold/20 hover:border-cyber-gold/40 transition-all duration-300">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-xl bg-cyber-gold/20 flex items-center justify-center flex-shrink-0">
              <GraduationCap size={40} className="text-cyber-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="font-orbitron text-lg font-bold text-cyber-gold">
                  🏆 CISP 认证学习
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full border border-cyber-gold/30 text-cyber-gold flex items-center gap-1">
                  <Trophy size={10} />
                  认证备考
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                70天系统化备考 CISP 认证，涵盖信息安全保障、风险管理、安全工程等核心知识域
              </p>
              {/* 进度条 */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyber-gold to-yellow-400 transition-all duration-500 rounded-full"
                    style={{ width: `${cispPct}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {cispCompleted}/{cispTotal} 天 ({cispPct}%)
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button
                onClick={() => navigate(`/cyber-learning/cisp/${cispNextDay}`)}
                className="flex items-center gap-2 px-5 py-3 rounded-lg bg-cyber-gold/20 text-cyber-gold hover:bg-cyber-gold/30 font-medium transition-colors"
              >
                <BookOpen size={18} />
                {cispCompleted > 0 ? '继续学习' : '开始学习'}
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => navigate('/cyber-learning/cisp/day-1')}
                className="text-xs text-gray-500 hover:text-cyber-gold transition-colors text-center"
              >
                从第1天开始
              </button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default CyberLearningMain;
