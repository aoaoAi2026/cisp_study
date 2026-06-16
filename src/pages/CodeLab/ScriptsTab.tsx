import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, CheckCircle, ChevronDown, Terminal as TerminalIcon,
  Copy, Info, Play, Lightbulb, BookOpen, Shield, FileCode, AlertOctagon, Package, Loader2,
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { securityScripts, scriptCategories } from '../../data/securityScripts';
import { Card, Badge } from '../../components/UI';
import { difficultyColors, categoryIcons, usePyodide } from './shared';

const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export const ScriptsTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedScript, setSelectedScript] = useState<string | null>(null);
  const [scriptOutputs, setScriptOutputs] = useState<Record<string, string>>({});
  const [runningScript, setRunningScript] = useState<string | null>(null);
  const scriptPy = usePyodide();

  const runScriptCode = useCallback(async (scriptId: string, code: string) => {
    setRunningScript(scriptId);
    try {
      const output = await scriptPy.runCode(code);
      setScriptOutputs(prev => ({ ...prev, [scriptId]: output }));
    } catch (e: any) {
      setScriptOutputs(prev => ({ ...prev, [scriptId]: `❌ 错误：${e.message}` }));
    } finally {
      setRunningScript(null);
    }
  }, [scriptPy]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="搜索脚本名称、描述或标签..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-cyber-purple/20 border border-cyber-green/20 rounded-lg focus:outline-none focus:border-cyber-green/50 text-white placeholder-gray-500" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg transition-colors ${selectedCategory === null ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/30' : 'bg-cyber-purple/20 text-gray-400 border border-cyber-green/10 hover:text-white'}`}>全部</button>
          {scriptCategories.map((cat) => (
            <button key={cat.name} onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-lg transition-colors ${selectedCategory === cat.name ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/30' : 'bg-cyber-purple/20 text-gray-400 border border-cyber-green/10 hover:text-white'}`}>
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {securityScripts
          .filter(script => {
            const matchesCategory = !selectedCategory || script.category === selectedCategory;
            const matchesSearch = !searchQuery ||
              script.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              script.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              script.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
          })
          .map((script) => {
            const ScriptIcon = categoryIcons[script.category] || TerminalIcon;
            return (
              <motion.div key={script.id} variants={itemVariants}>
                <Card className={`cursor-pointer group transition-all duration-200 ${selectedScript === script.id ? 'ring-2 ring-cyber-green/50' : ''}`}
                  onClick={() => setSelectedScript(selectedScript === script.id ? null : script.id)}>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-lg bg-cyber-purple/60 flex items-center justify-center flex-shrink-0">
                      <ScriptIcon size={28} className="text-gray-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-white group-hover:text-cyber-green transition-colors truncate">{script.name}</h3>
                        <Badge variant={difficultyColors[script.difficulty]}>{script.difficulty === 'easy' ? '入门' : script.difficulty === 'medium' ? '进阶' : '高级'}</Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-2 line-clamp-2">{script.description}</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs text-cyber-blue">{script.language}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-400">{script.subcategory}</span>
                      </div>
                    </div>
                    <ChevronDown size={20} className={`text-gray-400 transition-transform flex-shrink-0 ${selectedScript === script.id ? 'rotate-180' : ''}`} />
                  </div>

                  <AnimatePresence>
                    {selectedScript === script.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="mt-4 pt-4 border-t border-cyber-green/10 space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-cyber-green mb-2 flex items-center gap-2"><CheckCircle size={14} /> 主要功能</h4>
                            <div className="flex flex-wrap gap-2">
                              {script.features.map((feature, i) => <span key={i} className="text-xs px-2 py-1 bg-cyber-purple/30 text-gray-300 rounded">{feature}</span>)}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-cyber-blue mb-2 flex items-center gap-2"><Info size={14} /> 环境要求</h4>
                              <ul className="text-xs text-gray-400 space-y-1">{script.requirements.map((req, i) => <li key={i}>• {req}</li>)}</ul>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-cyber-gold mb-2 flex items-center gap-2"><TerminalIcon size={14} /> 安装命令</h4>
                              <div className="relative">
                                <code className="text-xs bg-black/30 px-3 py-2 rounded block text-cyber-green break-all">{script.installation}</code>
                                <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(script.installation); }} className="absolute right-2 top-2 text-gray-400 hover:text-white"><Copy size={14} /></button>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-cyber-purple mb-2 flex items-center gap-2"><TerminalIcon size={14} /> 使用方法</h4>
                            <div className="relative">
                              <code className="text-xs bg-black/30 px-3 py-2 rounded block text-cyber-green break-all">{script.usage}</code>
                              <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(script.usage); }} className="absolute right-2 top-2 text-gray-400 hover:text-white"><Copy size={14} /></button>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-cyber-green mb-2 flex items-center gap-2"><BookOpen size={14} /> 详细操作步骤</h4>
                            <div className="space-y-3">
                              {script.steps.map((step, i) => (
                                <div key={i} className="bg-cyber-purple/10 rounded-lg p-3">
                                  <div className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-cyber-green/20 flex items-center justify-center text-xs text-cyber-green flex-shrink-0">{i + 1}</span>
                                    <div className="flex-1">
                                      <h5 className="text-sm font-medium text-white mb-1">{step.title}</h5>
                                      <p className="text-xs text-gray-400 mb-2">{step.description}</p>
                                      {step.command && (
                                        <div className="relative">
                                          <code className="text-xs bg-black/30 px-2 py-1 rounded block text-cyber-green break-all">{step.command}</code>
                                          <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(step.command || ''); }} className="absolute right-1 top-1 text-gray-400 hover:text-white"><Copy size={12} /></button>
                                        </div>
                                      )}
                                      {step.note && <p className="text-xs text-cyber-gold mt-1">💡 {step.note}</p>}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-cyber-gold/5 border border-cyber-gold/20 rounded-lg p-3">
                            <h4 className="text-sm font-medium text-cyber-gold mb-2 flex items-center gap-2"><Lightbulb size={14} /> 使用小贴士</h4>
                            <ul className="space-y-1">{script.tips.map((tip, i) => <li key={i} className="text-xs text-gray-300 flex items-start gap-2"><span className="text-cyber-gold">•</span>{tip}</li>)}</ul>
                          </div>

                          <div className="bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3">
                            <h4 className="text-sm font-medium text-cyber-red mb-2 flex items-center gap-2"><AlertOctagon size={14} /> 安全警告</h4>
                            <ul className="space-y-1">{script.warnings.map((warning, i) => <li key={i} className="text-xs text-gray-300 flex items-start gap-2"><span className="text-cyber-red">⚠</span>{warning}</li>)}</ul>
                          </div>

                          {script.examples.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-cyber-blue mb-2 flex items-center gap-2"><FileCode size={14} /> 使用示例</h4>
                              <div className="space-y-3">
                                {script.examples.map((example, i) => (
                                  <div key={i} className="bg-black/20 rounded-lg p-3">
                                    <h5 className="text-xs font-medium text-white mb-2">{example.title}</h5>
                                    <div className="space-y-2">
                                      <div><span className="text-xs text-gray-500">输入：</span><code className="text-xs text-cyber-green block bg-black/30 px-2 py-1 rounded mt-1 break-all">{example.input}</code></div>
                                      <div><span className="text-xs text-gray-500">输出：</span><pre className="text-xs text-gray-300 bg-black/30 px-2 py-1 rounded mt-1 whitespace-pre-wrap">{example.output}</pre></div>
                                      <div className="text-xs text-gray-400 italic">💬 {example.explanation}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {script.language === 'Python' && (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-medium text-cyber-green flex items-center gap-2"><Play size={14} /> 在线运行</h4>
                                {scriptPy.loading && <span className="text-xs text-cyber-gold flex items-center gap-1"><Loader2 size={12} className="animate-spin" />加载Python环境...</span>}
                              </div>
                              <div className="border border-cyber-purple/30 rounded-lg overflow-hidden">
                                <div className="h-48">
                                  <Editor height="100%" defaultLanguage="python" theme="vs-dark"
                                    value={script.examples[0]?.input || '# 在这里输入代码\n'}
                                    options={{ minimap: { enabled: false }, fontSize: 12, lineNumbers: 'on', scrollBeyondLastLine: false, wordWrap: 'on', padding: { top: 8 } }} />
                                </div>
                              </div>
                              <div className="mt-2 flex gap-2">
                                <button onClick={(e) => { e.stopPropagation(); const code = script.examples[0]?.input || 'print("Hello")'; runScriptCode(script.id, code); }}
                                  disabled={runningScript === script.id}
                                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyber-green/20 text-cyber-green hover:bg-cyber-green/30 transition-colors disabled:opacity-50">
                                  {runningScript === script.id ? <><Loader2 size={14} className="animate-spin" />运行中...</> : <><Play size={14} />运行脚本</>}
                                </button>
                              </div>
                              {scriptOutputs[script.id] && (
                                <div className="mt-3 bg-cyber-black/80 border border-cyber-purple/20 rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-400">运行结果</span>
                                    <button onClick={() => setScriptOutputs(prev => { const n = { ...prev }; delete n[script.id]; return n; })} className="text-xs text-gray-600 hover:text-gray-400">清除</button>
                                  </div>
                                  <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">{scriptOutputs[script.id]}</pre>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 pt-2">
                            {script.tags.map((tag, i) => <span key={i} className="text-xs px-2 py-1 bg-cyber-purple/30 text-gray-400 rounded-full">#{tag}</span>)}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
      </div>

      <Card className="bg-cyber-blue/5 border-cyber-blue/20">
        <div className="flex items-start gap-3">
          <Shield size={24} className="text-cyber-blue flex-shrink-0" />
          <div>
            <h3 className="font-medium text-cyber-blue mb-1">脚本使用须知</h3>
            <p className="text-sm text-gray-400">所有脚本仅供学习和授权的安全测试使用。请遵守相关法律法规，不要对未授权的系统使用这些工具。脚本仓库中的工具涵盖信息收集、漏洞检测、密码攻击、逆向工程等多个领域。</p>
          </div>
        </div>
      </Card>
    </>
  );
};
