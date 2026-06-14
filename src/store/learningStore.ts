import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../api/client';

interface LearningProgress {
  dayId: string;
  completedAt: string;
  quizScore?: number;
}

interface LearningState {
  currentDay: number;
  completedDays: LearningProgress[];
  streak: number;
  lastStudyDate: string;
  mode: 'full' | 'intensive';
  completedLabs: string[];
  quizResults: Record<string, { score: number; date: string }>;

  loadFromServer: () => Promise<void>;
  markDayComplete: (dayId: string, quizScore?: number) => Promise<void>;
  setCurrentDay: (day: number) => Promise<void>;
  setMode: (mode: 'full' | 'intensive') => Promise<void>;
  completeLab: (labId: string) => Promise<void>;
  saveQuizResult: (quizId: string, score: number) => Promise<void>;
  resetProgress: () => Promise<void>;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      currentDay: 1,
      completedDays: [],
      streak: 0,
      lastStudyDate: '',
      mode: 'full',
      completedLabs: [],
      quizResults: {},

      async loadFromServer() {
        const token = await api.getToken();
        if (!token) return;
        try {
          const data = await api.getProgress();
          set({
            currentDay: data.currentDay || 1,
            completedDays: data.completedDays || [],
            completedLabs: data.completedLabs || [],
            quizResults: data.quizResults || {},
            mode: data.mode || 'full',
            streak: data.streak || 0,
            lastStudyDate: data.lastStudyDate || '',
          });
        } catch (err: any) {
          console.error('从服务器加载进度失败:', err);
        }
      },

      async markDayComplete(dayId: string, quizScore?: number) {
        try {
          const result = await api.completeDay(dayId, quizScore);
          const now = new Date().toISOString();
          const alreadyExists = get().completedDays.some((d) => d.dayId === dayId);
          const newCompletedDays = alreadyExists
            ? get().completedDays
            : [...get().completedDays, { dayId, completedAt: now, quizScore }];

          const newCurrentDay = result.currentDay || get().currentDay;

          set({
            completedDays: newCompletedDays,
            currentDay: newCurrentDay,
            lastStudyDate: now.split('T')[0],
            streak: get().streak + 1,
          });
        } catch (err: any) {
          console.error('保存日进度失败:', err);
        }
      },

  async setCurrentDay(day: number) {
    set({ currentDay: day });
    try {
      await api.updatePreferences({ currentDay: day });
    } catch (err: any) {
      console.error('更新当前天数失败:', err);
    }
  },

  async setMode(mode: 'full' | 'intensive') {
    set({ mode });
    try {
      await api.updatePreferences({ mode });
    } catch (err: any) {
      console.error('更新模式失败:', err);
    }
  },

  async completeLab(labId: string) {
    set((s) => ({
      completedLabs: s.completedLabs.includes(labId) ? s.completedLabs : [...s.completedLabs, labId],
    }));
    try {
      await api.completeLab(labId);
    } catch (err: any) {
      console.error('保存实验室进度失败:', err);
    }
  },

  async saveQuizResult(quizId: string, score: number) {
    set((s) => ({
      quizResults: { ...s.quizResults, [quizId]: { score, date: new Date().toISOString() } },
    }));
    try {
      await api.saveQuiz(quizId, score);
    } catch (err: any) {
      console.error('保存测验结果失败:', err);
    }
  },

  async resetProgress() {
    set({
      currentDay: 1,
      completedDays: [],
      streak: 0,
      lastStudyDate: '',
      completedLabs: [],
      quizResults: {},
    });
    try {
      await api.resetProgress();
    } catch (err: any) {
      console.error('重置进度失败:', err);
    }
  },
    }),
    {
      name: 'cisp_learning',
    },
  ),
);