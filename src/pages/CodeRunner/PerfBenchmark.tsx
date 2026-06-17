import React from 'react';
import { Gauge } from 'lucide-react';
import type { BenchmarkResult } from './types';

export const PerfBenchmark: React.FC<{
  isBenchmarking: boolean;
  benchmarkResult: BenchmarkResult | null;
  benchmarkRuns: number;
  onBenchmarkRunsChange: (n: number) => void;
  onStartBenchmark: () => void;
  onReturnOutput: () => void;
  hasCode: boolean;
}> = ({ isBenchmarking, benchmarkResult, benchmarkRuns, onBenchmarkRunsChange, onStartBenchmark, onReturnOutput, hasCode }) => {
  if (isBenchmarking) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3 p-6">
        <Gauge size={32} className="animate-spin" />
        <span className="text-sm">正在执行基准测试 ({benchmarkRuns} 次)...</span>
      </div>
    );
  }
  if (!benchmarkResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-3 p-6">
        <Gauge size={32} className="opacity-50" />
        <div className="text-sm text-center">
          <p className="font-medium text-gray-400 mb-2">性能基准测试</p>
          <p className="text-xs text-gray-600 mb-4">重复执行代码并统计性能指标</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0a0f18] rounded-lg p-3 border border-white/5">
          <span className="text-xs text-gray-400">执行次数:</span>
          <select value={benchmarkRuns} onChange={e => onBenchmarkRunsChange(Number(e.target.value))}
            className="bg-[#1a2235] border border-white/10 rounded px-2 py-1 text-xs text-gray-200">
            <option value={5}>5 次</option>
            <option value={10}>10 次</option>
            <option value={20}>20 次</option>
            <option value={50}>50 次</option>
          </select>
          <button onClick={onStartBenchmark} disabled={!hasCode}
            className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-xs hover:bg-blue-500/30 transition-colors disabled:opacity-30">
            开始测试
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 h-full overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-gray-200">性能测试结果</h4>
        <button onClick={onReturnOutput} className="text-xs text-gray-500 hover:text-gray-300">← 返回输出</button>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg p-3 border border-white/10 bg-white/5">
          <div className="text-xs text-gray-500 mb-1">最小耗时</div>
          <div className="text-lg font-bold text-green-400">{benchmarkResult.min.toFixed(0)}ms</div>
        </div>
        <div className="rounded-lg p-3 border border-white/10 bg-white/5">
          <div className="text-xs text-gray-500 mb-1">最大耗时</div>
          <div className="text-lg font-bold text-red-400">{benchmarkResult.max.toFixed(0)}ms</div>
        </div>
        <div className="rounded-lg p-3 border border-white/10 bg-white/5">
          <div className="text-xs text-gray-500 mb-1">平均耗时</div>
          <div className="text-lg font-bold text-blue-400">{benchmarkResult.avg.toFixed(0)}ms</div>
        </div>
        <div className="rounded-lg p-3 border border-white/10 bg-white/5">
          <div className="text-xs text-gray-500 mb-1">中位数</div>
          <div className="text-lg font-bold text-yellow-400">{benchmarkResult.median.toFixed(0)}ms</div>
        </div>
      </div>
      <div className="rounded-lg p-3 border border-white/10 bg-white/5 mb-4">
        <div className="flex justify-between text-xs mb-2"><span className="text-gray-400">成功率</span><span className="text-gray-300 font-medium">{benchmarkResult.successRate.toFixed(1)}%</span></div>
        <div className="flex justify-between text-xs mb-2"><span className="text-gray-400">标准差</span><span className="text-gray-300 font-mono">{benchmarkResult.stddev.toFixed(2)}</span></div>
        <div className="flex justify-between text-xs"><span className="text-gray-400">执行次数</span><span className="text-gray-300 font-medium">{benchmarkResult.runs.length} 次</span></div>
      </div>
      <div className="border border-white/5 rounded-lg overflow-hidden">
        <div className="px-3 py-2 bg-[#0d1520] border-b border-white/5"><span className="text-xs text-gray-400">各次执行耗时 (ms)</span></div>
        <div className="p-3 max-h-32 overflow-auto font-mono text-xs text-gray-500">
          {benchmarkResult.runs.map((r, i) => <span key={i} className="inline-block mr-3">[{i + 1}] {r.time.toFixed(0)}</span>)}
        </div>
      </div>
    </div>
  );
};
