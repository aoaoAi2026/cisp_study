import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  unlockedAt?: string;
}

interface AchievementState {
  badges: Badge[];
  points: number;
  unlockedBadgeIds: string[];
  checkAndUnlockBadge: (condition: string) => void;
  addPoints: (points: number) => void;
  resetAchievements: () => void;
}

const defaultBadges: Badge[] = [
  {
    id: 'beginner',
    name: '初学者',
    description: '完成第一天学习',
    icon: '🌱',
    condition: 'complete_day_1',
  },
  {
    id: 'week_streak',
    name: '好学生',
    description: '连续学习7天',
    icon: '📚',
    condition: 'streak_7',
  },
  {
    id: 'month_streak',
    name: '坚持者',
    description: '连续学习30天',
    icon: '🔥',
    condition: 'streak_30',
  },
  {
    id: 'code_master',
    name: '黑客小子',
    description: '完成所有代码实验',
    icon: '💻',
    condition: 'complete_all_labs',
  },
  {
    id: 'quiz_master',
    name: '模拟大师',
    description: '模拟考试90分以上',
    icon: '🏆',
    condition: 'quiz_90',
  },
  {
    id: 'knowledge_king',
    name: '知识渊博',
    description: '学习完所有知识点',
    icon: '📖',
    condition: 'complete_all_days',
  },
  {
    id: 'speedster',
    name: '速成选手',
    description: '30天内完成基础学习',
    icon: '⚡',
    condition: 'complete_30_days',
  },
  {
    id: 'perfect_week',
    name: '完美一周',
    description: '一周内完成所有任务',
    icon: '⭐',
    condition: 'complete_week_1',
  },
  {
    id: 'lab_explorer',
    name: '实验探索者',
    description: '完成5个代码实验',
    icon: '🔬',
    condition: 'complete_5_labs',
  },
  {
    id: 'quiz_warrior',
    name: '测验战士',
    description: '完成10次测验',
    icon: '⚔️',
    condition: 'complete_10_quizzes',
  },
  {
    id: 'first_blood',
    name: '初露锋芒',
    description: '完成第一次测验',
    icon: '🗡️',
    condition: 'first_quiz',
  },
  {
    id: 'early_bird',
    name: '早起鸟',
    description: '第一天学习',
    icon: '🐦',
    condition: 'day_1',
  },
];

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      badges: defaultBadges,
      points: 0,
      unlockedBadgeIds: [],

      checkAndUnlockBadge: (condition) => {
        const state = get();
        const badge = state.badges.find((b) => b.condition === condition);

        if (badge && !state.unlockedBadgeIds.includes(badge.id)) {
          set((s) => ({
            unlockedBadgeIds: [...s.unlockedBadgeIds, badge.id],
            points: s.points + 100,
          }));
        }
      },

      addPoints: (points) =>
        set((s) => ({
          points: s.points + points,
        })),

      resetAchievements: () =>
        set({
          points: 0,
          unlockedBadgeIds: [],
        }),
    }),
    {
      name: 'cisp_achievements',
    }
  )
);

export const getLevel = (points: number) => {
  if (points >= 5000) return { level: 5, name: '安全专家', color: 'gold' };
  if (points >= 3000) return { level: 4, name: '安全工程师', color: 'green' };
  if (points >= 1500) return { level: 3, name: '安全爱好者', color: 'blue' };
  if (points >= 500) return { level: 2, name: '安全学员', color: 'purple' };
  return { level: 1, name: '安全小白', color: 'gray' };
};
