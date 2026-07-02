import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, Eye, CheckCircle, XCircle, RotateCcw, Trophy, Brain } from 'lucide-react';
import { pastPapers } from '../data/pastPapers';
import { Card, Button } from '../components/UI';

interface FlashCard {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  domain: string;
}

export const Flashcards: React.FC = () => {
  const allQuestions: FlashCard[] = useMemo(() => {
    const out: FlashCard[] = [];
    for (const paper of pastPapers) {
      for (const q of paper.questions) {
        out.push({
          id: paper.id + '-' + q.id,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          domain: q.domain,
        });
      }
    }
    return out;
  }, []);

  const [currentIdx, setCurrentIdx] = useState(() => Math.floor(Math.random() * Math.max(1, allQuestions.length)));
  const [showAnswer, setShowAnswer] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [stats, setStats] = useState({ answered: 0, correct: 0 });
  const [seen, setSeen] = useState<Set<number>>(new Set());

  const current = allQuestions[currentIdx] || {
    id: 'empty',
    question: '暂无题目',
    options: [],
    correctIndex: 0,
    explanation: '',
    domain: '',
  };

  useEffect(() => {
    const raw = localStorage.getItem('cisp_flash_stats');
    if (raw) {
      try { setStats(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cisp_flash_stats', JSON.stringify(stats));
  }, [stats]);

  const next = () => {
    if (allQuestions.length === 0) return;
    let idx = Math.floor(Math.random() * allQuestions.length);
    if (allQuestions.length > 1) {
      while (idx === currentIdx) idx = Math.floor(Math.random() * allQuestions.length);
    }
    setCurrentIdx(idx);
    setShowAnswer(false);
    setSelected(null);
    setSeen((s) => new Set(s).add(idx));
  };

  const select = (i: number) => {
    if (showAnswer) return;
    setSelected(i);
    setShowAnswer(true);
    setStats((s) => ({
      answered: s.answered + 1,
      correct: s.correct + (i === current.correctIndex ? 1 : 0),
    }));
  };

  const reset = () => {
    setStats({ answered: 0, correct: 0 });
    setSeen(new Set());
    next();
  };

  const progressPct = allQuestions.length > 0
    ? Math.round((seen.size / Math.min(50, allQuestions.length)) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-orbitron text-2xl font-bold text-cyber-green flex items-center gap-2">
          <Brain size={28} /> 知识点闪卡
        </h1>
        <p className="text-gray-400 mt-1">从 {allQuestions.length} 道真题中随机抽题，强化记忆</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <div className="text-xs text-gray-400">题库</div>
          <div className="text-xl font-bold text-white mt-1">{allQuestions.length}</div>
        </Card>
        <Card>
          <div className="text-xs text-gray-400">已查看</div>
          <div className="text-xl font-bold text-cyber-blue mt-1">{seen.size}</div>
        </Card>
        <Card>
          <div className="text-xs text-gray-400">已作答</div>
          <div className="text-xl font-bold text-cyber-gold mt-1">{stats.answered}</div>
        </Card>
        <Card>
          <div className="text-xs text-gray-400">正确率</div>
          <div className="text-xl font-bold text-cyber-green mt-1">
            {stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : 0}%
          </div>
        </Card>
      </div>

      <div className="h-2 rounded-full bg-cyber-purple/20 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyber-green to-cyber-blue transition-all"
          style={{ width: `${Math.min(100, progressPct)}%` }}
        />
      </div>

      <motion.div
        key={currentIdx}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="min-h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs px-3 py-1 rounded-full bg-cyber-purple/30 text-cyber-green">
              {current.domain || '综合'}
            </span>
            <span className="text-xs text-gray-500">#{currentIdx + 1} / {allQuestions.length}</span>
          </div>

          <h2 className="text-lg font-medium text-white leading-relaxed mb-6">
            {current.question}
          </h2>

          <div className="space-y-2 mb-6">
            {current.options.map((opt, i) => {
              const isCorrect = i === current.correctIndex;
              const isSelected = selected === i;
              let cls = 'border-cyber-purple/30 bg-cyber-purple/10';
              if (showAnswer) {
                if (isCorrect) cls = 'border-cyber-green bg-cyber-green/20';
                else if (isSelected) cls = 'border-red-500 bg-red-500/10';
                else cls = 'border-cyber-purple/20 bg-cyber-purple/5 opacity-50';
              } else if (selected === i) {
                cls = 'border-cyber-green bg-cyber-green/10';
              }
              return (
                <button
                  key={i}
                  onClick={() => select(i)}
                  disabled={showAnswer || current.options.length === 0}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${cls} ${!showAnswer ? 'hover:border-cyber-green/50' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-md bg-cyber-purple/40 flex items-center justify-center text-sm font-medium text-white">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-sm text-gray-200">{opt}</span>
                    {showAnswer && isCorrect && <CheckCircle size={18} className="ml-auto text-cyber-green" />}
                    {showAnswer && isSelected && !isCorrect && <XCircle size={18} className="ml-auto text-red-400" />}
                  </div>
                </button>
              );
            })}
          </div>

          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="pt-4 border-t border-cyber-purple/20"
            >
              <div className="flex items-start gap-2">
                <Trophy size={18} className="text-cyber-gold mt-0.5" />
                <div>
                  <div className="text-xs text-cyber-gold mb-1">答案解析</div>
                  <p className="text-sm text-gray-300 leading-relaxed">{current.explanation}</p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex items-center gap-3 mt-6">
            <Button icon={Shuffle} onClick={next}>下一题</Button>
            {!showAnswer && (
              <Button variant="outline" icon={Eye} onClick={() => setShowAnswer(true)}>
                直接查看答案
              </Button>
            )}
            <Button variant="outline" icon={RotateCcw} onClick={reset}>重置统计</Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Flashcards;
