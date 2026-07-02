import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Flame,
  Lock,
  Play
} from 'lucide-react';
import { useLearningStore } from '../store';
import { learningData, weekThemes } from '../data/learningData';
import { Card, Badge, Button } from '../components/UI';
import { ProgressRing } from '../components/UI/ProgressRing';

export const LearningPath: React.FC = () => {
  const navigate = useNavigate();
  const { completedDays, currentDay, streak } = useLearningStore();
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const [studyMode, setStudyMode] = useState<'full' | 'sprint'>('full');

  const progress = studyMode === 'full' ? (completedDays.length / 90) * 100 : (completedDays.length / 30) * 100;

  // Full: 90 days across 12 weeks, Sprint: first 30 days across 4 weeks
  const displayWeeks = studyMode === 'full' ? weekThemes : weekThemes.slice(0, 4);
  const displayDays = studyMode === 'full' ? learningData : learningData.filter(d => d.day <= 30);

  // Group learning data by week
  const weeksData = displayWeeks.map((theme, weekIndex) => {
    const days = displayDays.filter(d => d.week === weekIndex + 1);
    return { ...theme, week: weekIndex + 1, days };
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-orbitron text-2xl font-bold text-cyber-green">
            学习路径
          </h1>
          <p className="text-gray-400 mt-1">
            {studyMode === 'full' ? '90天系统学习计划，完成你的CISP认证之路' : '30天强化冲刺，快速掌握核心考点'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-cyber-red" />
            <span className="text-white font-medium">{streak}天连续学习</span>
          </div>
          <ProgressRing progress={progress} size={80} strokeWidth={6} />
        </div>
      </div>

      {/* Mode Selector */}
      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => { setStudyMode('full'); setExpandedWeek(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              studyMode === 'full'
                ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Badge variant="green">完整模式</Badge>
            <span>90天系统学习</span>
          </button>
          <button
            onClick={() => { setStudyMode('sprint'); setExpandedWeek(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              studyMode === 'sprint'
                ? 'bg-cyber-gold/20 text-cyber-gold border border-cyber-gold/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Badge variant="gold">冲刺模式</Badge>
            <span>30天强化学习</span>
          </button>
        </div>
      </Card>

      {/* Timeline */}
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {weeksData.map((week) => {
          const isCompleted = completedDays.length >= week.week * 7;
          const isCurrent = currentDay > (week.week - 1) * 7 && currentDay <= week.week * 7;
          const isLocked = currentDay < (week.week - 1) * 7 + 1;

          return (
            <motion.div key={week.week} variants={itemVariants}>
              <Card
                className={`
                  overflow-hidden transition-all
                  ${isCurrent ? 'border-cyber-green/30 glow-green' : ''}
                  ${isLocked ? 'opacity-60' : ''}
                `}
              >
                {/* Week Header */}
                <div
                  className={`
                    flex items-center justify-between p-4 cursor-pointer
                    ${expandedWeek === week.week ? 'border-b border-cyber-green/10' : ''}
                  `}
                  onClick={() => setExpandedWeek(expandedWeek === week.week ? null : week.week)}
                >
                  <div className="flex items-center gap-4">
                    {/* Week Number */}
                    <div
                      className={`
                        w-12 h-12 rounded-lg flex items-center justify-center font-orbitron text-lg font-bold
                        ${isCompleted ? 'bg-cyber-green text-cyber-black' : ''}
                        ${isCurrent ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30' : ''}
                        ${isLocked ? 'bg-gray-700 text-gray-500' : ''}
                      `}
                    >
                      {isCompleted ? <CheckCircle size={24} /> : week.week}
                    </div>

                    {/* Week Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white">{week.theme}</h3>
                        {isCurrent && <Badge variant="blue">进行中</Badge>}
                        {isCompleted && <Badge variant="green">已完成</Badge>}
                      </div>
                      <p className="text-sm text-gray-500">
                        Day {(week.week - 1) * 7 + 1} - {week.week * 7}
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-400">
                        {completedDays.filter(cd => {
                          const day = learningData.find(d => d.id === cd.dayId);
                          return day?.week === week.week;
                        }).length} / 7
                      </p>
                    </div>
                    {expandedWeek === week.week ? (
                      <ChevronUp size={20} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedWeek === week.week && (
                  <div className="p-4 pt-0 space-y-2">
                    {week.days.map((day) => {
                      const isDayCompleted = completedDays.some(cd => cd.dayId === day.id);
                      const isToday = day.day === currentDay;
                      const isAvailable = day.day <= currentDay || isDayCompleted;

                      return (
                        <div
                          key={day.id}
                          className={`
                            flex items-center gap-3 p-3 rounded-lg transition-all
                            ${isDayCompleted ? 'bg-cyber-green/5 border border-cyber-green/20' : ''}
                            ${isToday ? 'bg-cyber-blue/10 border border-cyber-blue/20' : ''}
                            ${!isAvailable ? 'opacity-50' : ''}
                            ${isAvailable && !isDayCompleted ? 'cursor-pointer hover:bg-cyber-purple/20' : ''}
                          `}
                          onClick={() => isAvailable && navigate(`/learning/${day.id}`)}
                        >
                          {/* Day Status */}
                          <div
                            className={`
                              w-8 h-8 rounded-full flex items-center justify-center
                              ${isDayCompleted ? 'bg-cyber-green text-cyber-black' : ''}
                              ${isToday ? 'bg-cyber-blue text-cyber-black' : ''}
                              ${!isAvailable ? 'bg-gray-700 text-gray-500' : ''}
                              ${isAvailable && !isDayCompleted && !isToday ? 'bg-cyber-purple text-white' : ''}
                            `}
                          >
                            {isDayCompleted ? (
                              <CheckCircle size={16} />
                            ) : isAvailable ? (
                              <Play size={12} />
                            ) : (
                              <Lock size={12} />
                            )}
                          </div>

                          {/* Day Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-white">
                                Day {day.day}
                              </span>
                              <span className="text-sm text-gray-400">{day.title}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {day.objectives?.slice(0, 2).map((obj, i) => (
                                <span key={i} className="text-xs text-gray-500">
                                  {obj}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Quick Actions */}
                          {isAvailable && !isDayCompleted && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/learning/${day.id}`);
                              }}
                            >
                              {isToday ? '继续' : '开始'}
                            </Button>
                          )}
                          {isDayCompleted && (
                            <span className="text-xs text-cyber-green">已完成</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default LearningPath;
