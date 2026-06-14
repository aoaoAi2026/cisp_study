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
  // 新增趣味成就
  {
    id: 'night_owl',
    name: '夜猫子',
    description: '晚上10点后学习',
    icon: '🦉',
    condition: 'night_study',
  },
  {
    id: 'morning_riser',
    name: '早起达人',
    description: '早上6点前学习',
    icon: '🌅',
    condition: 'morning_study',
  },
  {
    id: 'quiz_bomb',
    name: '刷题狂人',
    description: '一天完成50道题',
    icon: '💣',
    condition: 'quiz_50',
  },
  {
    id: 'perfect_score',
    name: '满分选手',
    description: '单次测验满分',
    icon: '💯',
    condition: 'perfect_quiz',
  },
  {
    id: 'note_taker',
    name: '笔记达人',
    description: '完成10篇笔记',
    icon: '📝',
    condition: 'notes_10',
  },
  {
    id: 'first_comment',
    name: '社交达人',
    description: '在社区发布第一条评论',
    icon: '💬',
    condition: 'first_comment',
  },
  {
    id: 'helper',
    name: '热心肠',
    description: '帮助其他学员解答问题',
    icon: '🤝',
    condition: 'help_others',
  },
  {
    id: 'share_knowledge',
    name: '知识分享官',
    description: '分享学习笔记到社区',
    icon: '📤',
    condition: 'share_note',
  },
  {
    id: 'lab_wizard',
    name: '实验魔法师',
    description: '完成10个实验环境',
    icon: '🧙',
    condition: 'complete_10_labs',
  },
  {
    id: 'flashcard_master',
    name: '闪卡大师',
    description: '使用闪卡学习100次',
    icon: '🃏',
    condition: 'flashcard_100',
  },
  {
    id: 'curious_cat',
    name: '好奇猫咪',
    description: '查看所有工具网站',
    icon: '🐱',
    condition: 'view_all_tools',
  },
  {
    id: 'exam_ready',
    name: '备考达人',
    description: '完成5套模拟题',
    icon: '📋',
    condition: 'mock_exam_5',
  },
  {
    id: 'first_step',
    name: '第一步',
    description: '完成第一课学习',
    icon: '👣',
    condition: 'complete_day_1',
  },
  {
    id: 'week_warrior',
    name: '周挑战者',
    description: '完成一个完整周的学习',
    icon: '🗓️',
    condition: 'complete_one_week',
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
