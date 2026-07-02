export const EXAM_DURATION = 30 * 60; // 30 minutes
export const QUESTION_COUNT = 25;

export interface MockQuestion {
  id: number;
  question: string;
  options: { label: string; text: string }[];
  correct: string;
  domain: string;
  explanation: string;
}

export interface ExamSession {
  questions: MockQuestion[];
  answers: Record<number, string>;
  currentIndex: number;
  timeLeft: number;
  isStarted: boolean;
  isFinished: boolean;
  isPaused: boolean;
}
