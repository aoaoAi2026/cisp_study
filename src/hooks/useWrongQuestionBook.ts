import { useState, useEffect, useCallback } from 'react';
import type { QuizQuestion } from './useQuiz';

export interface WrongQuestionEntry {
  key: string;          // 唯一标识: `${planId}_${day}_${questionIndex}` 或 `${planId}_wrong_${uuid}`
  planId: string;
  day: number;
  questionIndex: number;
  consecutiveCorrect: number;
  question: QuizQuestion;  // 存储完整题目，便于跨天复现
}

const STORAGE_KEY = 'cisp_wrong_questions';

function loadEntries(): WrongQuestionEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

function saveEntries(entries: WrongQuestionEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

/**
 * 错题本 Hook
 *
 * 规则：
 * - 答错 → 加入错题本，consecutiveCorrect 置 0
 * - 答对 → consecutiveCorrect + 1
 * - 连续答对 3 次 → 自动从错题本移除
 */
export function useWrongQuestionBook() {
  const [entries, setEntries] = useState<WrongQuestionEntry[]>([]);

  // 初始化加载
  useEffect(() => {
    setEntries(loadEntries());
  }, []);

  const recordAnswer = useCallback(
    (key: string, question: QuizQuestion, planId: string, day: number, questionIndex: number, isCorrect: boolean) => {
      setEntries(prev => {
        const idx = prev.findIndex(e => e.key === key);

        if (isCorrect) {
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], consecutiveCorrect: updated[idx].consecutiveCorrect + 1 };
            // 连续答对 3 次移除
            if (updated[idx].consecutiveCorrect >= 3) {
              updated.splice(idx, 1);
            }
            saveEntries(updated);
            return updated;
          }
          // 没在错题本就忽略
          return prev;
        } else {
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], consecutiveCorrect: 0 };
            saveEntries(updated);
            return updated;
          } else {
            const updated = [...prev, { key, question, planId, day, questionIndex, consecutiveCorrect: 0 }];
            saveEntries(updated);
            return updated;
          }
        }
      });
    },
    [],
  );

  return {
    entries,
    recordAnswer,
  };
}
