import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Search, X, BookOpen } from 'lucide-react';
import type { Snippet } from './types';

export const CodeSnippetsPanel: React.FC<{
  show: boolean;
  onClose: () => void;
  language: string;
  languageIcon: string;
  snippets: Snippet[];
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (cat: string | null) => void;
  onLoadSnippet: (snippet: Snippet) => void;
}> = ({ show, onClose, language, languageIcon, snippets, categories, selectedCategory, onCategoryChange, onLoadSnippet }) => {
  if (!show) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}>
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
          className="glass-card bg-[#111827] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#0d1520]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                <Code size={16} className="text-black" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-100">代码片段库 <span className="text-lg ml-1">{languageIcon}</span></h3>
                <p className="text-xs text-gray-500">{language} · {snippets.length} 个预置示例</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <select value={selectedCategory || ''}
                  onChange={e => onCategoryChange(e.target.value || null)}
                  className="pl-8 pr-3 py-1.5 bg-[#0a0f18] border border-white/10 rounded-lg text-xs text-gray-300 appearance-none cursor-pointer">
                  <option value="">全部分类</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-gray-200 hover:bg-white/10 transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>
          <div className="p-4 max-h-[65vh] overflow-auto space-y-3">
            {snippets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-600 gap-2">
                <BookOpen size={32} className="opacity-30" />
                <span className="text-xs">该分类下暂无片段</span>
              </div>
            ) : (
              snippets.map(snippet => (
                <div key={snippet.id}
                  className="bg-[#0a0f18] border border-white/5 rounded-xl p-4 hover:border-blue-400/20 transition-all cursor-pointer group"
                  onClick={() => onLoadSnippet(snippet)}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-200 group-hover:text-blue-400 transition-colors">{snippet.title}</h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500">{snippet.category}</span>
                      </div>
                      <p className="text-xs text-gray-500">{snippet.description}</p>
                    </div>
                  </div>
                  <pre className="text-xs bg-black/30 rounded-lg p-3 font-mono text-gray-400 overflow-auto max-h-32 mt-2 group-hover:border-blue-400/20 border border-transparent transition-all">
                    {snippet.code.split('\n').slice(0, 8).join('\n')}
                    {snippet.code.split('\n').length > 8 && '\n...'}
                  </pre>
                  <div className="flex justify-end mt-2">
                    <span className="text-[10px] text-blue-400/60 group-hover:text-blue-400 transition-colors">
                      点击加载 →
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
