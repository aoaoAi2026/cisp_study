import React from 'react';
import { History, Columns2, Trash2 } from 'lucide-react';
import type { Runtime, HistoryEntry } from './types';

export const ExecutionHistoryPanel: React.FC<{
  show: boolean;
  history: HistoryEntry[];
  runtimes: Runtime[];
  diffLeft: HistoryEntry | null;
  diffRight: HistoryEntry | null;
  onLoad: (entry: HistoryEntry) => void;
  onClear: () => void;
  onSetDiffLeft: (entry: HistoryEntry) => void;
  onSetDiffRight: (entry: HistoryEntry) => void;
  onShowDiff: () => void;
}> = ({ show, history, runtimes, diffLeft, diffRight, onLoad, onClear, onSetDiffLeft, onSetDiffRight, onShowDiff }) => {
  if (!show) return null;
  const langIcon = (lang: string) => runtimes.find(r => r.id === lang)?.icon || '📄';
  return (
    <div className="w-72 border-l border-white/5 bg-[#0d1520] flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <History size={14} className="text-gray-400" />
          <h4 className="text-sm font-semibold text-gray-200">执行历史</h4>
          <span className="text-xs text-gray-600">({history.length})</span>
        </div>
        <div className="flex gap-1">
          <button onClick={onShowDiff} disabled={!diffLeft || !diffRight}
            className="p-1.5 rounded text-gray-500 hover:text-gray-200 hover:bg-white/10 disabled:opacity-30" title="Diff 对比">
            <Columns2 size={14} />
          </button>
          <button onClick={onClear} disabled={history.length === 0}
            className="p-1.5 rounded text-red-500/70 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30" title="清空历史">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-600 p-6 gap-2">
            <History size={20} className="opacity-40" />
            <span className="text-xs">暂无执行记录</span>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {history.slice().reverse().map((entry) => (
              <div key={entry.id}
                className={`rounded-lg p-2 border transition-all cursor-pointer hover:border-blue-400/30 ${
                  diffLeft?.id === entry.id ? 'bg-yellow-500/10 border-yellow-500/30' :
                  diffRight?.id === entry.id ? 'bg-cyan-500/10 border-cyan-500/30' :
                  'bg-[#0a0f18] border-white/5 hover:bg-[#0e1525]'
                }`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{langIcon(entry.language)}</span>
                    <span className="text-xs font-medium text-gray-300">{entry.language}</span>
                  </div>
                  <span className="text-[10px] text-gray-600">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-xs text-gray-500 font-mono truncate mb-2">{entry.code.substring(0, 50)}...</p>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${entry.result.success ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {entry.result.success ? '成功' : `退出 ${entry.result.exitCode}`}
                  </span>
                  <span className="text-[10px] text-gray-600">{entry.result.executionTime}ms</span>
                </div>
                <div className="flex gap-1 mt-2 pt-2 border-t border-white/5">
                  <button onClick={() => onLoad(entry)}
                    className="flex-1 text-xs py-1 rounded bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200 transition-colors">加载</button>
                  <button onClick={() => onSetDiffLeft(entry)}
                    className={`text-xs px-2 py-1 rounded transition-colors ${diffLeft?.id === entry.id ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-gray-500 hover:bg-yellow-500/10 hover:text-yellow-400'}`}>L</button>
                  <button onClick={() => onSetDiffRight(entry)}
                    className={`text-xs px-2 py-1 rounded transition-colors ${diffRight?.id === entry.id ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-gray-500 hover:bg-cyan-500/10 hover:text-cyan-400'}`}>R</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
