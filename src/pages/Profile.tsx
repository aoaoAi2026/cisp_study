import React from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Settings,
  Bell,
  Shield,
  Database,
  Clock,
  Award,
  BookOpen,
  Code,
  FileQuestion,
  LogOut,
  RefreshCcw
} from 'lucide-react';
import { useUserStore, useLearningStore, useAchievementStore, getLevel } from '../store';
import { Card, Badge, Button } from '../components/UI';
import { ProgressRing } from '../components/UI/ProgressRing';

export const Profile: React.FC = () => {
  const { user, logout, settings, updateSettings } = useUserStore();
  const { completedDays, completedLabs, streak, quizResults, resetProgress } = useLearningStore();
  const { badges, unlockedBadgeIds, points, resetAchievements } = useAchievementStore();

  const levelInfo = getLevel(points);
  const totalQuizzes = Object.keys(quizResults).length;

  const handleResetProgress = () => {
    if (window.confirm('确定要重置所有学习进度吗？此操作不可撤销！')) {
      resetProgress();
      resetAchievements();
    }
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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyber-green to-cyber-blue mx-auto mb-4 flex items-center justify-center">
          <span className="text-4xl font-bold text-cyber-black">
            {user?.name?.charAt(0) || 'U'}
          </span>
        </div>
        <h1 className="font-orbitron text-2xl font-bold text-white">
          {user?.name}
        </h1>
        <p className="text-gray-400 mt-1">{user?.email}</p>
        <div className="mt-3">
          <Badge
            variant={
              levelInfo.color === 'gold' ? 'gold' :
              levelInfo.color === 'green' ? 'green' : 'blue'
            }
          >
            {levelInfo.name} · {points} 积分
          </Badge>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={BookOpen} label="完成天数" value={completedDays.length} color="#00ff88" />
          <StatCard icon={Code} label="完成实验" value={completedLabs.length} color="#00d4ff" />
          <StatCard icon={FileQuestion} label="完成测验" value={totalQuizzes} color="#ffd700" />
          <StatCard icon={RefreshCcw} label="连续学习" value={`${streak}天`} color="#ff3366" />
        </div>
      </motion.div>

      {/* Progress Section */}
      <motion.div variants={itemVariants}>
        <Card>
          <h2 className="font-orbitron text-lg text-cyber-green mb-4 flex items-center gap-2">
            <Award size={20} />
            学习成就
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">总体进度</span>
                <span className="text-white">{Math.round((completedDays.length / 90) * 100)}%</span>
              </div>
              <div className="w-full h-3 bg-cyber-purple/40 rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-cyber-green to-cyber-blue rounded-full transition-all"
                  style={{ width: `${(completedDays.length / 90) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">徽章收集</span>
                <span className="text-white">{unlockedBadgeIds.length}/{badges.length}</span>
              </div>
              <div className="w-full h-3 bg-cyber-purple/40 rounded-full">
                <div
                  className="h-full bg-cyber-gold rounded-full transition-all"
                  style={{ width: `${(unlockedBadgeIds.length / badges.length) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">实验完成</span>
                <span className="text-white">{completedLabs.length}/7</span>
              </div>
              <div className="w-full h-3 bg-cyber-purple/40 rounded-full">
                <div
                  className="h-full bg-cyber-blue rounded-full transition-all"
                  style={{ width: `${(completedLabs.length / 7) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Settings Section */}
      <motion.div variants={itemVariants}>
        <Card>
          <h2 className="font-orbitron text-lg text-cyber-green mb-4 flex items-center gap-2">
            <Settings size={20} />
            设置
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-cyber-green/10">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-gray-400" />
                <div>
                  <p className="text-white">消息通知</p>
                  <p className="text-xs text-gray-500">接收学习提醒和成就通知</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => updateSettings({ notifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyber-green"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-cyber-green/10">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-gray-400" />
                <div>
                  <p className="text-white">隐私设置</p>
                  <p className="text-xs text-gray-500">管理你的数据隐私</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                管理
              </Button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Database size={20} className="text-gray-400" />
                <div>
                  <p className="text-white">学习数据</p>
                  <p className="text-xs text-gray-500">导出或重置学习进度</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-cyber-red border-cyber-red/30 hover:bg-cyber-red/10"
                onClick={handleResetProgress}
              >
                重置进度
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Account Section */}
      <motion.div variants={itemVariants}>
        <Card>
          <h2 className="font-orbitron text-lg text-cyber-green mb-4 flex items-center gap-2">
            <User size={20} />
            账户信息
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between py-2">
              <span className="text-gray-400">用户名</span>
              <span className="text-white">{user?.name}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">邮箱</span>
              <span className="text-white">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">注册时间</span>
              <span className="text-white">
                {user?.joinDate ? new Date(user.joinDate).toLocaleDateString('zh-CN') : '-'}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-cyber-green/10">
            <Button
              variant="outline"
              className="w-full text-cyber-red border-cyber-red/30 hover:bg-cyber-red/10"
              icon={LogOut}
            >
              退出登录
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Version Info */}
      <motion.div variants={itemVariants} className="text-center text-sm text-gray-500">
        <p>CISP学习平台 v1.0</p>
        <p className="mt-1">90天成为安全专家</p>
      </motion.div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: any;
  label: string;
  value: string | number;
  color: string;
}> = ({ icon: Icon, label, value, color }) => (
  <Card className="text-center">
    <Icon size={24} className="mx-auto mb-2" style={{ color }} />
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-xs text-gray-400">{label}</p>
  </Card>
);

export default Profile;
