// 网络安全学习综合页面
import React, { useState } from 'react';
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
  Cpu
} from 'lucide-react';
import { Card } from '../components/UI';
import { cyberBasicPlan, CyberLearningPlan } from '../data/cyberBasic';
import { cyberPenetrationPlan } from '../data/cyberPenetration';
import { cyberDefensePlan } from '../data/cyberDefense';
import { learningData as cispLearningData } from '../data/learningData';

interface CyberLearningMainProps {}

const plans: CyberLearningPlan[] = [
  cyberBasicPlan,
  cyberPenetrationPlan,
  cyberDefensePlan
];

const difficultyIcon = (d: string) => {
  if (d === '入门') return <Zap size={14} className="text-cyber-green" />;
  if (d === '进阶') return <Star size={14} className="text-cyber-gold" />;
  return <Lock size={14} className="text-cyber-red" />;
};

const planIcon = (id: string) => {
  if (id === 'basic') return <Shield size={40} />;
  if (id === 'penetration') return <Target size={40} />;
  return <Cpu size={40} />;
};

const planBg = (id: string) => {
  if (id === 'basic') return 'from-cyber-green/5 to-cyber-purple/5';
  if (id === 'penetration') return 'from-cyber-red/5 to-cyber-purple/5';
  return 'from-cyber-blue/5 to-cyber-purple/5';
};

const planBorder = (id: string) => {
  if (id === 'basic') return 'border-cyber-green/30';
  if (id === 'penetration') return 'border-cyber-red/30';
  return 'border-cyber-blue/30';
};

const planHover = (id: string) => {
  if (id === 'basic') return 'hover:border-cyber-green/50';
  if (id === 'penetration') return 'hover:border-cyber-red/50';
  return 'hover:border-cyber-blue/50';
};

export const CyberLearningMain: React.FC<CyberLearningMainProps> = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(null);

  // 读取各计划的完成进度
  const getProgress = (planId: string) => {
    try {
      const raw = localStorage.getItem('cisp_cyber_progress');
      if (!raw) return 0;
      const data = JSON.parse(raw);
      const plan = data[planId];
      if (!plan || !plan.completedDays) return 0;
      return plan.completedDays.length;
    } catch {
      return 0;
    }
  };

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
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyber-purple/30 to-cyber-green/20 flex items-center justify-center">
            <Globe size={32} className="text-cyber-green" />
          </div>
          <div>
            <h1 className="font-orbitron text-2xl font-bold text-cyber-green">
              网络安全学习中心
            </h1>
            <p className="text-gray-400 mt-1">
              三个阶段 · 90天系统学习 · 从基础到高级
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
            <div className="text-2xl font-bold text-cyber-green">90</div>
            <div className="text-xs text-gray-400 mt-1">总学习天数</div>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="text-center py-4">
            <div className="text-2xl font-bold text-cyber-purple">
              {getProgress('basic') + getProgress('penetration') + getProgress('defense')}
            </div>
            <div className="text-xs text-gray-400 mt-1">已完成天数</div>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="text-center py-4">
            <div className="text-2xl font-bold text-cyber-blue">3</div>
            <div className="text-xs text-gray-400 mt-1">学习阶段</div>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="text-center py-4">
            <div className="text-2xl font-bold text-cyber-gold">
              {getProgress('basic') > 0 || getProgress('penetration') > 0 || getProgress('defense') > 0
                ? Math.round(((getProgress('basic') + getProgress('penetration') + getProgress('defense')) / 90) * 100)
                : 0}%
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
                      <div className="flex-1 h-2 rounded-full bg-cyber-purple/20 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            plan.id === 'basic' ? 'bg-cyber-green' :
                            plan.id === 'penetration' ? 'bg-cyber-red' : 'bg-cyber-blue'
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
                        className="mt-4 pt-4 border-t border-cyber-purple/20 space-y-3"
                      >
                        {/* 先决条件 */}
                        <div>
                          <h4 className="text-xs font-medium text-cyber-purple mb-2">📋 学习前提</h4>
                          <div className="flex flex-wrap gap-2">
                            {plan.prerequisites.map((p, i) => (
                              <span key={i} className="text-xs px-2 py-1 rounded bg-cyber-purple/20 text-gray-300">
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                        {/* 证书方向 */}
                        <div>
                          <h4 className="text-xs font-medium text-cyber-purple mb-2">🎓 完成后方向</h4>
                          <p className="text-xs text-gray-400">{plan.certification}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* 右侧按钮 */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => setExpanded(expanded === plan.id ? null : plan.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                        plan.id === 'basic' ? 'border-cyber-green/30 text-cyber-green hover:bg-cyber-green/10' :
                        plan.id === 'penetration' ? 'border-cyber-red/30 text-cyber-red hover:bg-cyber-red/10' :
                        'border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/10'
                      }`}
                    >
                      {expanded === plan.id ? '收起' : '详情'}
                    </button>
                    <button
                      onClick={() => navigate(`/cyber-learning/${plan.id}`)}
                      className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                        plan.id === 'basic' ? 'bg-cyber-green/20 text-cyber-green hover:bg-cyber-green/30' :
                        plan.id === 'penetration' ? 'bg-cyber-red/20 text-cyber-red hover:bg-cyber-red/30' :
                        'bg-cyber-blue/20 text-cyber-blue hover:bg-cyber-blue/30'
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
        <Card className="bg-gradient-to-br from-cyber-gold/5 to-cyber-purple/5 border border-cyber-gold/20">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-xl bg-cyber-gold/20 flex items-center justify-center flex-shrink-0">
              <Trophy size={32} className="text-cyber-gold" />
            </div>
            <div className="flex-1">
              <h2 className="font-orbitron text-lg font-bold text-cyber-gold mb-1">
                🏆 CISP认证学习
              </h2>
              <p className="text-sm text-gray-400">
                CISP官方教材配套学习，涵盖信息安全保障、风险管理、安全运营等核心知识域
              </p>
            </div>
            <button
              onClick={() => navigate('/learning')}
              className="flex items-center gap-2 px-5 py-3 rounded-lg bg-cyber-gold/20 text-cyber-gold hover:bg-cyber-gold/30 font-medium transition-colors flex-shrink-0"
            >
              <BookOpen size={18} />
              进入学习
              <ChevronRight size={16} />
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default CyberLearningMain;
