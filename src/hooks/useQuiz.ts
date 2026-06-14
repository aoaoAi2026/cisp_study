import { useState, useCallback } from 'react';

/**
 * 统一测验题目接口，兼容 CISP 和网络安全两条路线
 */
export interface QuizQuestion {
  id?: string;
  type?: 'single' | 'multiple' | 'boolean' | 'fill';
  question: string;
  options?: string[];
  correctIndex?: number;
  correctIndices?: number[];
  correctAnswer?: string;
  explanation: string;
}

export type QuizAnswer = number | number[] | string | null;

/* ──────── 通用判题工具 ──────── */

export function checkQuizAnswer(
  q: QuizQuestion,
  answer: QuizAnswer,
): boolean {
  const type = q.type || 'single';
  if (type === 'single' || type === 'boolean') {
    return answer === q.correctIndex;
  }
  if (type === 'multiple') {
    const correctIndices = q.correctIndices || [];
    const userIndices = Array.isArray(answer) ? answer : [];
    return (
      correctIndices.length === userIndices.length &&
      correctIndices.every(i => userIndices.includes(i))
    );
  }
  if (type === 'fill') {
    return (
      String(answer ?? '').toLowerCase().trim() ===
      String(q.correctAnswer ?? '').toLowerCase().trim()
    );
  }
  return false;
}

/* ──────── 考试模式：一次性展示所有题，最后提交 ──────── */

export function useQuizExam(questions: QuizQuestion[]) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const setAnswer = useCallback((qIndex: number, optionIndex: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIndex]: optionIndex }));
  }, [submitted]);

  const submit = useCallback((): {
    correct: number;
    total: number;
    score: number;
    correctIndices: number[];
    wrongIndices: number[];
  } => {
    setSubmitted(true);
    let correct = 0;
    const correctIndices: number[] = [];
    const wrongIndices: number[] = [];
    questions.forEach((q, i) => {
      if (checkQuizAnswer(q, answers[i])) {
        correct++;
        correctIndices.push(i);
      } else {
        wrongIndices.push(i);
      }
    });
    const total = questions.length;
    return {
      correct,
      total,
      score: total > 0 ? Math.round((correct / total) * 100) : 0,
      correctIndices,
      wrongIndices,
    };
  }, [questions, answers]);

  const allAnswered = questions.length > 0 && Object.keys(answers).length >= questions.length;

  const getOptionClass = useCallback(
    (qIndex: number, oIndex: number): string => {
      const q = questions[qIndex];
      let cls = 'quiz-option';
      if (submitted) {
        if (oIndex === q.correctIndex) cls += ' correct';
        else if (answers[qIndex] === oIndex && oIndex !== q.correctIndex)
          cls += ' incorrect';
      } else if (answers[qIndex] === oIndex) {
        cls += ' selected';
      }
      return cls;
    },
    [questions, answers, submitted],
  );

  const reset = useCallback(() => {
    setAnswers({});
    setSubmitted(false);
  }, []);

  return {
    answers,
    submitted,
    setAnswer,
    submit,
    getOptionClass,
    allAnswered,
    reset,
  };
}

/* ──────── 练习模式：逐题作答，即时反馈 ──────── */

export function useQuizPractice(questions: QuizQuestion[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentQuestion = questions[currentIndex] ?? null;

  const answerOne = useCallback(
    (answer: QuizAnswer): boolean => {
      const newAnswers = [...answers];
      newAnswers[currentIndex] = answer;
      setAnswers(newAnswers);
      setShowAnswer(true);
      return checkQuizAnswer(questions[currentIndex], answer);
    },
    [answers, currentIndex, questions],
  );

  const toggleMultiple = useCallback(
    (optionIndex: number) => {
      const current = answers[currentIndex];
      const arr = Array.isArray(current) ? current : [];
      const newSelection = arr.includes(optionIndex)
        ? arr.filter(i => i !== optionIndex)
        : [...arr, optionIndex].sort((a, b) => a - b);
      const newAnswers = [...answers];
      newAnswers[currentIndex] = newSelection;
      setAnswers(newAnswers);
    },
    [answers, currentIndex],
  );

  const setCurrentAnswer = useCallback(
    (answer: QuizAnswer) => {
      const newAnswers = [...answers];
      newAnswers[currentIndex] = answer;
      setAnswers(newAnswers);
    },
    [answers, currentIndex],
  );

  const nextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    }
  }, [currentIndex, questions.length]);

  const isLastQuestion = currentIndex >= questions.length - 1;

  const getScore = useCallback(() => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (checkQuizAnswer(q, answers[i])) correct++;
    });
    const total = questions.length;
    return { correct, total, score: total > 0 ? Math.round((correct / total) * 100) : 0 };
  }, [questions, answers]);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setAnswers([]);
    setShowAnswer(false);
  }, []);

  return {
    currentIndex,
    currentQuestion,
    answers,
    showAnswer,
    answerOne,
    toggleMultiple,
    setCurrentAnswer,
    nextQuestion,
    isLastQuestion,
    getScore,
    reset,
  };
}
