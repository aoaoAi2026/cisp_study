import React from 'react';
import { Loader2, Shield, Check } from 'lucide-react';
import type { AuditResult } from './types';

export const SecurityAudit: React.FC<{
  isAuditing: boolean;
  auditResult: AuditResult | null;
  severityColor: (s: string) => string;
}> = ({ isAuditing, auditResult, severityColor }) => {
  if (isAuditing) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 gap-2">
        <Loader2 size={16} className="animate-spin" />
        <span>正在扫描代码安全问题...</span>
      </div>
    );
  }
  if (!auditResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-3 p-6">
        <Shield size={32} className="opacity-50" />
        <div className="text-sm text-center">
          <p className="font-medium text-gray-400 mb-1">尚未执行安全审计</p>
          <p className="text-xs text-gray-600">点击顶部工具栏的 安全审计 按钮检测代码安全问题</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 h-full overflow-auto">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-200">安全审计结果</h4>
          <span className="text-xs text-gray-500">{auditResult.language} · {auditResult.scannedLines} 行</span>
        </div>
        <div className="grid grid-cols-5 gap-2 text-xs">
          {(['critical', 'high', 'medium', 'low'] as const).map(sev => (
            <div key={sev} className={`rounded-lg p-2 border ${severityColor(sev)} text-center`}>
              <div className="font-bold text-base">{auditResult.summary[sev]}</div>
              <div className="text-[10px] opacity-80">{sev === 'critical' ? '严重' : sev === 'high' ? '高危' : sev === 'medium' ? '中危' : '低危'}</div>
            </div>
          ))}
          <div className="rounded-lg p-2 border border-white/10 bg-white/5 text-center">
            <div className="font-bold text-base text-gray-300">{auditResult.summary.total}</div>
            <div className="text-[10px] opacity-80">总计</div>
          </div>
        </div>
      </div>

      {auditResult.findings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-green-400 gap-2">
          <Check size={24} />
          <span className="text-sm">未发现安全问题</span>
        </div>
      ) : (
        <div className="space-y-2">
          {auditResult.findings.map((f, i) => (
            <div key={i} className={`rounded-lg p-3 border ${severityColor(f.severity)}`}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wide">
                  {f.severity === 'critical' ? '严重' : f.severity === 'high' ? '高危' : f.severity === 'medium' ? '中危' : '低危'}
                </span>
                <span className="text-[10px] opacity-60">第 {f.line} 行</span>
              </div>
              <p className="text-xs text-gray-300 mb-2">{f.description}</p>
              <pre className="text-xs bg-black/30 rounded p-2 font-mono text-gray-400 overflow-auto max-h-16 mb-2">{f.snippet}</pre>
              <p className="text-xs text-blue-300">💡 {f.suggestion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
