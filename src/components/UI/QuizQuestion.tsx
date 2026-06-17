import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────

export interface QuizQuestionData {
  id: string | number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface QuizQuestionProps {
  question: QuizQuestionData;
  /** 用户选中的选项索引，null = 未作答 */
  selectedIndex: number | null;
  /** 是否展示结果（正误高亮 + 解析） */
  showResult: boolean;
  onSelect?: (index: number) => void;

  // 可选定制
  /** 选项是否可被点击（false 时只读展示） */
  readOnly?: boolean;
  /** 是否展开解析（受控） */
  expanded?: boolean;
  onToggleExpand?: () => void;
  /** 变体：'full' 显示全部分，'compact' 不自动显示解析区 */
  variant?: 'full' | 'compact';
  /** 自定义选项前缀，默认 A/B/C/D */
  labelFn?: (i: number) => string;
  className?: string;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

const defaultLabel = (i: number) => String.fromCharCode(65 + i);

const OPTION_CLASS =
  'p-3.5 rounded-lg border-2 border-gray-700 cursor-pointer transition-all duration-300';
const OPTION_BG = 'rgba(26, 26, 46, 0.4)';
const OPTION_HOVER = 'rgba(0, 255, 136, 0.05)';
const OPTION_SELECTED_BG = 'rgba(0, 255, 136, 0.1)';
const OPTION_CORRECT_BG = 'rgba(34, 197, 94, 0.1)';
const OPTION_INCORRECT_BG = 'rgba(239, 68, 68, 0.1)';

// ── Component ───────────────────────────────────────────────────────────────

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  selectedIndex,
  showResult,
  onSelect,
  readOnly = false,
  expanded: expandedProp,
  onToggleExpand,
  variant = 'full',
  labelFn = defaultLabel,
  className = '',
}) => {
  const isSelectable = !readOnly && !showResult;
  const isCorrect = selectedIndex === question.correctIndex;

  const getOptionStyle = (i: number): React.CSSProperties & { borderColor: string } => {
    let bg = OPTION_BG;
    let border = 'border-gray-700';

    if (showResult) {
      if (i === question.correctIndex) {
        bg = OPTION_CORRECT_BG;
        border = 'border-green-500';
      } else if (selectedIndex === i && i !== question.correctIndex) {
        bg = OPTION_INCORRECT_BG;
        border = 'border-red-500';
      }
    } else if (selectedIndex === i) {
      bg = OPTION_SELECTED_BG;
      border = 'border-[#00ff88]';
    }

    return { background: bg, borderColor: border.split('-').slice(1).join('-') || 'gray-700' };
  };

  return (
    <div className={className}>
      {/* Question text */}
      <h3 className="text-base font-medium text-white mb-4 leading-relaxed">
        {question.question}
      </h3>

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((opt, i) => {
          const style = getOptionStyle(i);
          const isOptCorrect = i === question.correctIndex;

          return (
            <button
              key={i}
              type="button"
              onClick={() => isSelectable && onSelect?.(i)}
              disabled={!isSelectable}
              style={{ background: style.background, borderColor: style.borderColor }}
              className={`${OPTION_CLASS} w-full text-left text-sm flex items-start gap-3 group
                ${isSelectable ? '' : 'pointer-events-none'}
                ${!showResult && !readOnly ? 'hover:border-[#00ff88]' : ''}
                ${style.borderColor !== 'gray-700' ? `!border-[${style.borderColor}]` : ''}
              `}
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-md bg-cyber-purple/40 flex items-center justify-center text-sm font-medium text-white">
                {labelFn(i)}
              </span>
              <span className="text-gray-200 flex-1">
                {opt.startsWith(labelFn(i) + '.') ? opt.slice(2).trim() : opt}
                {opt.startsWith(labelFn(i) + '、') ? opt.slice(2).trim() : opt}
              </span>
              {showResult && isOptCorrect && (
                <CheckCircle size={16} className="flex-shrink-0 text-green-400" />
              )}
              {showResult && selectedIndex === i && !isOptCorrect && (
                <XCircle size={16} className="flex-shrink-0 text-red-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Result & Explanation */}
      <AnimatePresence>
        {showResult && variant === 'full' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.25 }}
          >
            <div
              className="mt-4 p-3.5 rounded-lg"
              style={{
                background: isCorrect
                  ? 'rgba(0,255,136,0.08)'
                  : 'rgba(255,51,102,0.08)',
              }}
            >
              <p
                className={`text-sm font-medium mb-1 ${
                  isCorrect ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {isCorrect ? '✓ 回答正确！' : '✗ 回答错误'}
              </p>

              {!isCorrect && question.explanation && (
                <>
                  <p className="text-xs text-gray-400 mb-1">
                    正确答案: {labelFn(question.correctIndex)}.{' '}
                    {question.options[question.correctIndex]?.replace(
                      new RegExp(`^${labelFn(question.correctIndex)}[.、]\\s*`),
                      ''
                    )}
                  </p>
                  {onToggleExpand ? (
                    <button
                      onClick={onToggleExpand}
                      className="text-xs text-cyber-gold hover:underline"
                    >
                      {expandedProp ? (
                        <span className="flex items-center gap-1">
                          <ChevronUp size={12} /> 收起解析
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <ChevronDown size={12} /> 查看解析
                        </span>
                      )}
                    </button>
                  ) : null}
                  {(!onToggleExpand || expandedProp) && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-gray-400 mt-1 leading-relaxed"
                    >
                      {question.explanation}
                    </motion.p>
                  )}
                </>
              )}

              {isCorrect && question.explanation && (
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {question.explanation}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizQuestion;
