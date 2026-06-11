import React from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Trophy,
  Star,
  Flame,
  Lock,
  CheckCircle,
  Zap,
  BookOpen,
  Code,
  Target,
  Shield,
  Crown
} from 'lucide-react';
import { useAchievementStore, useLearningStore, getLevel } from '../store';
import { Card, Badge } from '../components/UI';
import { ProgressRing } from '../components/UI/ProgressRing';

const badgeIcons: Record<string, any> = {
  'beginner': Star,
  'week_streak': Flame,
  'month_streak': Trophy,
  'code_master': Code,
  'quiz_master': Target,
  'knowledge_king': BookOpen,
  'speedster': Zap,
  'perfect_week': Award,
  'lab_explorer': Shield,
  'quiz_warrior': Target,
  'first_blood': Star,
  'early_bird': Star,
};

export const Achievements: React.FC = () => {
  const { badges, unlockedBadgeIds, points } = useAchievementStore();
  const { completedDays, completedLabs, streak } = useLearningStore();
  const levelInfo = getLevel(points);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  const nextLevelPoints = levelInfo.level < 5 ? (levelInfo.level * 1000) : null;
  const currentLevelPoints = (levelInfo.level - 1) * 1000;
  const levelProgress = nextLevelPoints
    ? ((points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100
    : 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-orbitron text-2xl font-bold text-cyber-green mb-2">
          成就系统
        </h1>
        <p className="text-gray-400">
          完成学习任务，解锁各种成就徽章
        </p>
      </div>

      {/* Level Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-green/5 to-cyber-blue/5" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div
                  className={`
                    w-24 h-24 rounded-full flex items-center justify-center
                    ${levelInfo.color === 'gold' ? 'bg-cyber-gold/20' : ''}
                    ${levelInfo.color === 'green' ? 'bg-cyber-green/20' : ''}
                    ${levelInfo.color === 'blue' ? 'bg-cyber-blue/20' : ''}
                    ${levelInfo.color === 'purple' ? 'bg-purple-500/20' : ''}
                    ${levelInfo.color === 'gray' ? 'bg-gray-500/20' : ''}
                  `}
                >
                  <Crown
                    size={40}
                    className={
                      levelInfo.color === 'gold' ? 'text-cyber-gold' :
                      levelInfo.color === 'green' ? 'text-cyber-green' :
                      levelInfo.color === 'blue' ? 'text-cyber-blue' :
                      'text-gray-400'
                    }
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-cyber-black border-2 border-cyber-green flex items-center justify-center">
                  <span className="text-xs font-bold text-cyber-green">{levelInfo.level}</span>
                </div>
              </div>
              <div>
                <h2 className="font-orbitron text-xl font-bold text-white">
                  {levelInfo.name}
                </h2>
                <p className="text-gray-400 mt-1">
                  当前积分: <span className="text-cyber-green font-bold">{points}</span>
                </p>
                {nextLevelPoints && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">
                        距离{getLevel(nextLevelPoints).name}:
                      </span>
                      <span className="text-cyber-green">
                        {nextLevelPoints - points} 积分
                      </span>
                    </div>
                    <div className="w-48 h-2 bg-cyber-purple/40 rounded-full mt-1">
                      <div
                        className="h-full bg-cyber-green rounded-full transition-all"
                        style={{ width: `${levelProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{completedDays.length}</p>
                <p className="text-xs text-gray-400">完成天数</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{completedLabs.length}</p>
                <p className="text-xs text-gray-400">完成实验</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-cyber-red">{streak}</p>
                <p className="text-xs text-gray-400">连续学习</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Badges Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="font-orbitron text-lg text-cyber-green mb-4">
          全部徽章 ({unlockedBadgeIds.length}/{badges.length})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {badges.map((badge) => {
            const isUnlocked = unlockedBadgeIds.includes(badge.id);
            const IconComponent = badgeIcons[badge.id] || Award;

            return (
              <motion.div key={badge.id} variants={itemVariants}>
                <Card
                  className={`
                    text-center transition-all
                    ${isUnlocked
                      ? 'border-cyber-green/30 bg-cyber-green/5'
                      : 'opacity-50'
                    }
                  `}
                >
                  <div
                    className={`
                      w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center
                      ${isUnlocked
                        ? 'bg-cyber-gold/20'
                        : 'bg-gray-700/50'
                      }
                    `}
                  >
                    {isUnlocked ? (
                      <IconComponent size={32} className="text-cyber-gold" />
                    ) : (
                      <Lock size={24} className="text-gray-500" />
                    )}
                  </div>
                  <h3 className={`font-medium mb-1 ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                    {badge.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {badge.description}
                  </p>
                  {isUnlocked && (
                    <div className="mt-2">
                      <Badge variant="gold">已解锁</Badge>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Achievement Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-cyber-purple/20 border-cyber-purple/30">
          <h3 className="font-medium text-cyber-green mb-3">成就小贴士</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <Star size={14} className="text-cyber-gold mt-1 flex-shrink-0" />
              每天坚持学习是获取成就的关键
            </li>
            <li className="flex items-start gap-2">
              <Trophy size={14} className="text-cyber-gold mt-1 flex-shrink-0" />
              完成所有代码实验可以解锁"黑客小子"成就
            </li>
            <li className="flex items-start gap-2">
              <Target size={14} className="text-cyber-gold mt-1 flex-shrink-0" />
              模拟考试90分以上可获得"模拟大师"徽章
            </li>
          </ul>
        </Card>
      </motion.div>
    </div>
  );
};

export default Achievements;
