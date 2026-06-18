import { useState, useEffect, useCallback } from 'react';
import { saveData, loadData } from '../data/persistData';

interface UseGamificationOptions {
  /** localStorage 键名 */
  storageKey: string;
  /** 数据路径（用于嵌套key的场景，如 planId） */
  subKey?: string;
  /** 每次升级需经验值 */
  xpPerLevel?: number;
}

export function useGamification(options: UseGamificationOptions) {
  const { storageKey, subKey, xpPerLevel = 500 } = options;

  const [xp, setXp] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [streakHeatmap, setStreakHeatmap] = useState<number[]>(Array(7).fill(0));
  const [quizAvg, setQuizAvg] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newBadge, setNewBadge] = useState<string | null>(null);

  // 加载存档
  useEffect(() => {
    loadData<any>(storageKey, {}).then(data => {
      const s = subKey ? (data[subKey] || {}) : data;
      setXp(s.xp || 0);
      setUserLevel(s.level || 1);
      setStreakHeatmap(s.heatmap || Array(7).fill(0));
      setQuizAvg(s.quizAvg || 0);
    });
  }, [storageKey, subKey]);

  const addXp = useCallback(
    async (amount: number) => {
      setXp(prev => {
        const newXp = prev + amount;
        const newLevel = Math.floor(newXp / xpPerLevel) + 1;
        if (newLevel > userLevel) {
          setUserLevel(newLevel);
          setShowLevelUp(true);
          setShowConfetti(true);
          setTimeout(() => setShowLevelUp(false), 3000);
          setTimeout(() => setShowConfetti(false), 2000);
        }
        // 保存
        (async () => {
          const data = await loadData<any>(storageKey, {});
          const payload = { xp: newXp, level: newLevel, heatmap: streakHeatmap, quizAvg };
          if (subKey) {
            data[subKey] = { ...data[subKey], ...payload };
            await saveData(storageKey, data);
          } else {
            await saveData(storageKey, payload);
          }
        })();
        return newXp;
      });
    },
    [xpPerLevel, userLevel, streakHeatmap, quizAvg, storageKey, subKey],
  );

  /** 更新热力图（通常完成一天后调用） */
  const bumpHeatmap = useCallback(() => {
    setStreakHeatmap(prev => {
      const today = new Date().getDay();
      const idx = today === 0 ? 6 : today - 1;
      const updated = [...prev];
      updated[idx] = (updated[idx] || 0) + 1;
      return updated;
    });
  }, []);

  /** 更新测验均分 */
  const updateQuizAvg = useCallback((newAvg: number) => {
    setQuizAvg(newAvg);
  }, []);

  /** 解锁徽章 */
  const unlockBadge = useCallback((badgeId: string) => {
    setNewBadge(badgeId);
    setTimeout(() => setNewBadge(null), 3000);
  }, []);

  const levelProgress = (xp % xpPerLevel) / xpPerLevel;

  return {
    xp, userLevel, streakHeatmap, quizAvg,
    showLevelUp, setShowLevelUp,
    showConfetti, setShowConfetti,
    newBadge, setNewBadge,
    addXp, bumpHeatmap, updateQuizAvg, unlockBadge,
    levelProgress,
  };
}
