// 游戏化系统：XP / 等级 / 连续打卡 / 成就徽章 / 活跃度
import { useState, useCallback, useRef } from 'react';
import { saveData, loadData } from '../data/persistData';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const ALL_BADGES: Record<string, Badge> = {
  first_day: { id: 'first_day', name: '初次启程', icon: '🚀', description: '完成第一天的学习' },
  streak_3: { id: 'streak_3', name: '连续打卡', icon: '🔥', description: '连续学习 3 天' },
  streak_7: { id: 'streak_7', name: '周复一周', icon: '⭐', description: '连续学习 7 天' },
  streak_14: { id: 'streak_14', name: '半月坚持', icon: '💎', description: '连续学习 14 天' },
  streak_30: { id: 'streak_30', name: '月度战神', icon: '👑', description: '连续学习 30 天' },
  perfect_quiz: { id: 'perfect_quiz', name: '满分试卷', icon: '💯', description: '首次取得满分测验' },
  level_5: { id: 'level_5', name: '初级学者', icon: '📚', description: '达到 5 级' },
  level_10: { id: 'level_10', name: '进阶高手', icon: '⚡', description: '达到 10 级' },
  level_15: { id: 'level_15', name: '网络安全专家', icon: '🛡️', description: '达到 15 级' },
  quiz_10: { id: 'quiz_10', name: '测验达人', icon: '📝', description: '完成 10 次测验' },
  code_5: { id: 'code_5', name: '代码尖兵', icon: '💻', description: '完成 5 个编程练习' },
  all_days: { id: 'all_days', name: '全勤通关', icon: '🏆', description: '完成全部学习天数' },
};

const XP_PER_LEVEL_BASE = 120;
const XP_SCALE = 1.25;

export function xpForLevel(level: number): number {
  let total = 0;
  for (let l = 1; l <= level; l++) {
    total += Math.round(XP_PER_LEVEL_BASE * Math.pow(XP_SCALE, l - 1));
  }
  return total;
}

export function levelFromXp(xp: number): number {
  let level = 0;
  let acc = 0;
  while (true) {
    const need = Math.round(XP_PER_LEVEL_BASE * Math.pow(XP_SCALE, level));
    if (acc + need > xp) break;
    acc += need;
    level++;
  }
  return Math.max(0, level);
}

interface GameState {
  xp: number;
  badges: string[];
  streak: number;
  lastActiveDate: string | null;
  activityMap: Record<string, number>;
  totalQuizzes: number;
  totalCodeExercises: number;
}

export function useGameSystem(planId: string) {
  const [xp, setXp] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [activityMap, setActivityMap] = useState<Record<string, number>>({});
  const [lastNewBadge, setLastNewBadge] = useState<string | null>(null);
  const [leveledUp, setLeveledUp] = useState(false);
  const prevLevelRef = useRef(0);
  const totalQuizzesRef = useRef(0);
  const totalCodeRef = useRef(0);
  const initializedRef = useRef(false);
  const saveTimerRef = useRef<number>(0);

  const level = levelFromXp(xp);
  const xpForNext = xpForLevel(level + 1) - xpForLevel(level);
  const xpProgress = xpForLevel(level);
  const xpInCurrentLevel = xp - xpProgress;

  const persist = useCallback(async (state: Partial<GameState>) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(async () => {
      const data = await loadData<any>('cisp_cyber_progress', {});
      const current = data[planId]?.gameSystem || {};
      data[planId] = { ...data[planId], gameSystem: { ...current, ...state } };
      await saveData('cisp_cyber_progress', data);
    }, 300);
  }, [planId]);

  // 初始化：从持久化存储加载
  const init = useCallback(async () => {
    if (initializedRef.current) return;
    const data = await loadData<any>('cisp_cyber_progress', {});
    const gs: GameState = data[planId]?.gameSystem || {};
    if (gs.xp !== undefined) setXp(gs.xp);
    if (gs.badges) setBadges(gs.badges);
    if (gs.streak !== undefined) setStreak(gs.streak);
    if (gs.activityMap) setActivityMap(gs.activityMap);
    if (gs.totalQuizzes) totalQuizzesRef.current = gs.totalQuizzes;
    if (gs.totalCodeExercises) totalCodeRef.current = gs.totalCodeExercises;
    prevLevelRef.current = levelFromXp(gs.xp || 0);
    initializedRef.current = true;
  }, [planId]);

  const addXP = useCallback((amount: number) => {
    setXp(prev => {
      const next = prev + amount;
      const newLevel = levelFromXp(next);
      if (newLevel > prevLevelRef.current) {
        setLeveledUp(true);
        setTimeout(() => setLeveledUp(false), 3000);
        prevLevelRef.current = newLevel;
        // 检查升级徽章
        if (newLevel >= 5 && !badges.includes('level_5')) {
          setBadges(b => { const nb = [...b, 'level_5']; setLastNewBadge('level_5'); setTimeout(() => setLastNewBadge(null), 4000); return nb; });
        }
        if (newLevel >= 10 && !badges.includes('level_10')) {
          setBadges(b => { const nb = [...b, 'level_10']; setLastNewBadge('level_10'); setTimeout(() => setLastNewBadge(null), 4000); return nb; });
        }
        if (newLevel >= 15 && !badges.includes('level_15')) {
          setBadges(b => { const nb = [...b, 'level_15']; setLastNewBadge('level_15'); setTimeout(() => setLastNewBadge(null), 4000); return nb; });
        }
      }
      persist({ xp: next });
      return next;
    });
  }, [badges, persist]);

  const recordActivity = useCallback((dateStr: string, intensity = 1) => {
    setActivityMap(prev => {
      const next = { ...prev, [dateStr]: Math.min(4, (prev[dateStr] || 0) + intensity) };
      // 计算连续打卡
      const today = new Date();
      const dateMap = new Map<string, boolean>();
      Object.keys(next).forEach(d => { if (next[d] > 0) dateMap.set(d, true); });
      let s = 0;
      const check = new Date(today);
      while (true) {
        const key = `${check.getFullYear()}-${String(check.getMonth() + 1).padStart(2, '0')}-${String(check.getDate()).padStart(2, '0')}`;
        if (!dateMap.has(key)) break;
        s++;
        check.setDate(check.getDate() - 1);
      }
      setStreak(s);

      // 检查连续打卡徽章
      const newBadges: string[] = [];
      const checks: [number, string][] = [[3, 'streak_3'], [7, 'streak_7'], [14, 'streak_14'], [30, 'streak_30']];
      for (const [days, id] of checks) {
        if (s >= days && !badges.includes(id) && !newBadges.includes(id)) {
          newBadges.push(id);
        }
      }
      if (newBadges.length > 0) {
        setBadges(b => {
          const nb = [...b];
          for (const id of newBadges) {
            if (!nb.includes(id)) {
              nb.push(id);
              setLastNewBadge(id);
            }
          }
          return nb;
        });
        setTimeout(() => setLastNewBadge(null), 4000);
      }

      persist({ activityMap: next, streak: s });
      return next;
    });
  }, [badges, persist]);

  const awardBadge = useCallback((badgeId: string) => {
    if (!badges.includes(badgeId) && ALL_BADGES[badgeId]) {
      setBadges(b => {
        const nb = [...b, badgeId];
        setLastNewBadge(badgeId);
        setTimeout(() => setLastNewBadge(null), 4000);
        persist({ badges: nb });
        return nb;
      });
      return true;
    }
    return false;
  }, [badges, persist]);

  const recordQuizComplete = useCallback(() => {
    totalQuizzesRef.current += 1;
    if (totalQuizzesRef.current >= 10) {
      awardBadge('quiz_10');
    }
    persist({ totalQuizzes: totalQuizzesRef.current });
  }, [awardBadge, persist]);

  const recordCodeComplete = useCallback(() => {
    totalCodeRef.current += 1;
    if (totalCodeRef.current >= 5) {
      awardBadge('code_5');
    }
    persist({ totalCodeExercises: totalCodeRef.current });
  }, [awardBadge, persist]);

  return {
    xp, level, streak, badges, activityMap,
    xpForNext, xpInCurrentLevel, xpProgress,
    lastNewBadge, leveledUp,
    init, addXP, recordActivity, awardBadge,
    recordQuizComplete, recordCodeComplete,
  };
}
