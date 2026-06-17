import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, Activity, Shield, Lightbulb, Search,
  Info, AlertOctagon, CheckCircle, ChevronDown, Terminal as TerminalIcon,
  Code, Copy, Briefcase,
} from 'lucide-react';
import { emergencyScenarios } from '../../data/emergencyResponse';
import { Card, Badge } from '../../components/UI';

const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export const EmergencyTab: React.FC = () => {
  const [selectedEmergency, setSelectedEmergency] = useState<string | null>(null);
  const [selectedEmergencyCategory, setSelectedEmergencyCategory] = useState<string | null>(null);
  const [emergencySearchQuery, setEmergencySearchQuery] = useState('');
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [expandedScript, setExpandedScript] = useState<string | null>(null);
  const [emergencyDrillStep, setEmergencyDrillStep] = useState<Record<string, number>>({});
  const [emergencyChoices, setEmergencyChoices] = useState<Record<string, number>>({});

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <AlertTriangle size={32} className="mx-auto mb-2 text-cyber-red" />
          <p className="text-2xl font-bold text-white">{emergencyScenarios.length}</p>
          <p className="text-sm text-gray-400">应急场景</p>
        </Card>
        <Card className="text-center">
          <Activity size={32} className="mx-auto mb-2 text-cyber-blue" />
          <p className="text-2xl font-bold text-white">
            {emergencyScenarios.filter(s => s.severity === 'critical').length}
          </p>
          <p className="text-sm text-gray-400">高危场景</p>
        </Card>
        <Card className="text-center">
          <Shield size={32} className="mx-auto mb-2 text-cyber-green" />
          <p className="text-2xl font-bold text-white">
            {new Set(emergencyScenarios.map(s => s.category)).size}
          </p>
          <p className="text-sm text-gray-400">分类数量</p>
        </Card>
        <Card className="text-center">
          <Lightbulb size={32} className="mx-auto mb-2 text-cyber-gold" />
          <p className="text-2xl font-bold text-white">
            {emergencyScenarios.reduce((acc, s) => acc + (s.caseStudies?.length || 0), 0)}
          </p>
          <p className="text-sm text-gray-400">真实案例</p>
        </Card>
      </div>

      {/* Emergency Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="搜索应急场景、影响行业或处理步骤..."
            value={emergencySearchQuery} onChange={(e) => setEmergencySearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-cyber-purple/20 border border-cyber-green/20 rounded-lg focus:outline-none focus:border-cyber-green/50 text-white placeholder-gray-500" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setSelectedEmergencyCategory(null)}
            className={`px-4 py-2 rounded-lg transition-colors ${selectedEmergencyCategory === null ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/30' : 'bg-cyber-purple/20 text-gray-400 border border-cyber-green/10 hover:text-white'}`}>全部</button>
          {[...new Set(emergencyScenarios.map(s => s.category))].map((cat) => (
            <button key={cat} onClick={() => setSelectedEmergencyCategory(cat)}
              className={`px-4 py-2 rounded-lg transition-colors ${selectedEmergencyCategory === cat ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/30' : 'bg-cyber-purple/20 text-gray-400 border border-cyber-green/10 hover:text-white'}`}>
              {cat} ({emergencyScenarios.filter(s => s.category === cat).length})
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Scenarios Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {emergencyScenarios
          .filter(scenario => {
            const matchesCategory = !selectedEmergencyCategory || scenario.category === selectedEmergencyCategory;
            const matchesSearch = !emergencySearchQuery ||
              scenario.title.toLowerCase().includes(emergencySearchQuery.toLowerCase()) ||
              scenario.overview.toLowerCase().includes(emergencySearchQuery.toLowerCase()) ||
              scenario.affectedSectors.some(s => s.toLowerCase().includes(emergencySearchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
          })
          .map((scenario) => {
            const severityColor = scenario.severity === 'critical' ? 'red' : scenario.severity === 'high' ? 'red' : scenario.severity === 'medium' ? 'gold' : 'green';
            return (
              <motion.div key={scenario.id} variants={itemVariants}>
                <Card className={`cursor-pointer group transition-all duration-200 ${selectedEmergency === scenario.id ? 'ring-2 ring-cyber-green/50' : ''}`}
                  onClick={() => setSelectedEmergency(selectedEmergency === scenario.id ? null : scenario.id)}>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-lg bg-cyber-purple/60 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle size={28} className={scenario.severity === 'critical' ? 'text-cyber-red' : 'text-cyber-gold'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-medium text-white group-hover:text-cyber-green transition-colors">{scenario.title}</h3>
                        <Badge variant={severityColor}>
                          {scenario.severity === 'critical' ? '严重' : scenario.severity === 'high' ? '高危' : scenario.severity === 'medium' ? '中等' : '一般'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-2 line-clamp-2">{scenario.overview}</p>
                      <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500">
                        <span className="text-cyber-blue">{scenario.category}</span>
                        <span>•</span>
                        <span>影响：{scenario.impact}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {scenario.affectedSectors.slice(0, 3).map((sector, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-cyber-purple/30 text-gray-300 rounded">{sector}</span>
                        ))}
                        {scenario.affectedSectors.length > 3 && (
                          <span className="text-xs px-2 py-0.5 bg-cyber-purple/30 text-gray-400 rounded">+{scenario.affectedSectors.length - 3}</span>
                        )}
                      </div>
                    </div>
                    <ChevronDown size={20} className={`text-gray-400 transition-transform flex-shrink-0 ${selectedEmergency === scenario.id ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Expanded Emergency Content */}
                  <AnimatePresence>
                    {selectedEmergency === scenario.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="mt-4 pt-4 border-t border-cyber-green/10 space-y-4">
                          {/* Overview */}
                          <div className="bg-cyber-purple/10 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-cyber-green mb-2 flex items-center gap-2"><Info size={14} /> 事件概述</h4>
                            <p className="text-sm text-gray-300">{scenario.overview}</p>
                          </div>

                          {/* Affected Sectors */}
                          <div>
                            <h4 className="text-sm font-medium text-cyber-blue mb-2 flex items-center gap-2"><Shield size={14} /> 适用行业</h4>
                            <div className="flex flex-wrap gap-2">
                              {scenario.affectedSectors.map((sector, i) => (
                                <span key={i} className="text-xs px-2 py-1 bg-cyber-blue/10 text-cyber-blue rounded">{sector}</span>
                              ))}
                            </div>
                          </div>

                          {/* Impact */}
                          <div>
                            <h4 className="text-sm font-medium text-cyber-red mb-2 flex items-center gap-2"><AlertOctagon size={14} /> 影响范围</h4>
                            <p className="text-sm text-gray-300">{scenario.impact}</p>
                          </div>

                          {/* Response Phases */}
                          <div>
                            <h4 className="text-sm font-medium text-cyber-purple mb-2 flex items-center gap-2"><Activity size={14} /> 应急响应阶段</h4>
                            <div className="space-y-3">
                              {scenario.phases.map((phase, i) => (
                                <div key={i} className="bg-cyber-purple/10 rounded-lg overflow-hidden">
                                  <div className="p-3 cursor-pointer flex items-center justify-between"
                                    onClick={() => setExpandedPhase(expandedPhase === `${scenario.id}-${i}` ? null : `${scenario.id}-${i}`)}>
                                    <div className="flex items-center gap-2">
                                      <span className="w-6 h-6 rounded-full bg-cyber-green/20 flex items-center justify-center text-xs text-cyber-green font-medium">{i + 1}</span>
                                      <div>
                                        <h5 className="text-sm font-medium text-white">{phase.phase}</h5>
                                        <p className="text-xs text-gray-500">{phase.duration}</p>
                                      </div>
                                    </div>
                                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${expandedPhase === `${scenario.id}-${i}` ? 'rotate-180' : ''}`} />
                                  </div>
                                  <AnimatePresence>
                                    {expandedPhase === `${scenario.id}-${i}` && (
                                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                        <div className="px-3 pb-3 space-y-3">
                                          {phase.actions.map((action, j) => (
                                            <div key={j} className="bg-black/20 rounded-lg p-3">
                                              <div className="flex items-start gap-2 mb-2">
                                                <span className="w-5 h-5 rounded-full bg-cyber-blue/20 flex items-center justify-center text-xs text-cyber-blue flex-shrink-0">{action.step}</span>
                                                <div className="flex-1">
                                                  <h6 className="text-sm font-medium text-white">{action.title}</h6>
                                                  <p className="text-xs text-gray-400 mt-1">{action.description}</p>
                                                </div>
                                              </div>
                                              {action.commands && action.commands.length > 0 && (
                                                <div className="mt-2 space-y-2">
                                                  {action.commands.map((cmd, k) => (
                                                    <div key={k} className="bg-black/30 rounded p-2">
                                                      <div className="flex items-center gap-2 mb-1">
                                                        <code className="text-xs text-cyber-green">{cmd.description}</code>
                                                        <Badge variant="blue">{cmd.platform}</Badge>
                                                      </div>
                                                      <code className="text-xs bg-black/50 px-2 py-1 rounded block text-cyber-green break-all">{cmd.command}</code>
                                                      {cmd.risk && <p className="text-xs text-cyber-red mt-1">⚠️ {cmd.risk}</p>}
                                                    </div>
                                                  ))}
                                                </div>
                                              )}
                                              {action.responsible && (
                                                <p className="text-xs text-gray-500 mt-2"><span className="text-cyber-gold">负责人：</span>{action.responsible}</p>
                                              )}
                                              {action.tools && action.tools.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                  {action.tools.map((tool, l) => (
                                                    <span key={l} className="text-xs px-2 py-0.5 bg-cyber-purple/30 text-gray-300 rounded">{tool}</span>
                                                  ))}
                                                </div>
                                              )}
                                              {action.verification && (
                                                <p className="text-xs text-cyber-green mt-2">✓ 验证：{action.verification}</p>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Checklists */}
                          {scenario.checklists && scenario.checklists.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-cyber-gold mb-2 flex items-center gap-2"><CheckCircle size={14} /> 应急检查清单</h4>
                              {scenario.checklists.map((checklist, i) => (
                                <div key={i} className="mb-3">
                                  <h5 className="text-xs font-medium text-white mb-2">{checklist.section}</h5>
                                  <div className="space-y-1">
                                    {checklist.items.map((item, j) => (
                                      <label key={j} className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer hover:text-white">
                                        <input type="checkbox" className="w-4 h-4 rounded border-cyber-green/30 bg-cyber-purple/20 text-cyber-green focus:ring-cyber-green/50" />
                                        <span className={`${item.priority === 'critical' ? 'text-cyber-red' : item.priority === 'high' ? 'text-cyber-gold' : 'text-gray-400'}`}>{item.item}</span>
                                        <Badge variant={item.priority === 'critical' ? 'red' : item.priority === 'high' ? 'gold' : 'green'}>
                                          {item.priority === 'critical' ? '紧急' : item.priority === 'high' ? '重要' : '一般'}
                                        </Badge>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Scripts */}
                          {scenario.scripts && scenario.scripts.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-cyber-purple mb-2 flex items-center gap-2"><TerminalIcon size={14} /> 应急脚本</h4>
                              <div className="space-y-2">
                                {scenario.scripts.map((script, i) => (
                                  <div key={i} className="bg-cyber-purple/10 rounded-lg overflow-hidden">
                                    <div className="p-3 cursor-pointer flex items-center justify-between"
                                      onClick={() => setExpandedScript(expandedScript === `${scenario.id}-script-${i}` ? null : `${scenario.id}-script-${i}`)}>
                                      <div className="flex items-center gap-2">
                                        <Code size={14} className="text-cyber-purple" />
                                        <span className="text-sm text-white">{script.name}</span>
                                        <Badge variant="blue">{script.platform}</Badge>
                                      </div>
                                      <ChevronDown size={16} className={`text-gray-400 transition-transform ${expandedScript === `${scenario.id}-script-${i}` ? 'rotate-180' : ''}`} />
                                    </div>
                                    <AnimatePresence>
                                      {expandedScript === `${scenario.id}-script-${i}` && (
                                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                          <div className="px-3 pb-3">
                                            <p className="text-xs text-gray-400 mb-2">{script.description}</p>
                                            <div className="relative">
                                              <pre className="text-xs bg-black/50 px-3 py-2 rounded text-cyber-green overflow-x-auto"><code>{script.content}</code></pre>
                                              <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(script.content); }} className="absolute right-2 top-2 text-gray-400 hover:text-white p-1"><Copy size={14} /></button>
                                            </div>
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Case Studies */}
                          {scenario.caseStudies && scenario.caseStudies.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-cyber-blue mb-2 flex items-center gap-2"><Lightbulb size={14} /> 真实案例</h4>
                              {scenario.caseStudies.map((caseStudy, i) => (
                                <div key={i} className="bg-cyber-blue/10 rounded-lg p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Briefcase size={14} className="text-cyber-blue" />
                                    <span className="text-sm font-medium text-white">{caseStudy.organization}</span>
                                  </div>
                                  <p className="text-xs text-gray-400 mb-3">{caseStudy.incident}</p>
                                  <div className="mb-3">
                                    <h6 className="text-xs font-medium text-cyber-green mb-2">事件时间线：</h6>
                                    <div className="space-y-1">
                                      {caseStudy.timeline.map((t, j) => (
                                        <div key={j} className="flex items-start gap-2 text-xs">
                                          <span className="text-cyber-gold whitespace-nowrap">{t.time}</span>
                                          <span className="text-gray-400">{t.event}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <h6 className="text-xs font-medium text-cyber-red mb-2">经验教训：</h6>
                                    <ul className="space-y-1">
                                      {caseStudy.lessons.map((lesson, k) => (
                                        <li key={k} className="text-xs text-gray-300 flex items-start gap-2"><span className="text-cyber-red">•</span>{lesson}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Drill Simulation */}
                          <div className="bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-medium text-cyber-red flex items-center gap-2"><Activity size={14} /> 模拟演练</h4>
                              {emergencyDrillStep[scenario.id] !== undefined && emergencyDrillStep[scenario.id] > 0 && (
                                <button onClick={() => {
                                  setEmergencyDrillStep(prev => ({ ...prev, [scenario.id]: 0 }));
                                  setEmergencyChoices(prev => ({ ...prev, [scenario.id]: undefined }));
                                }} className="px-3 py-1 rounded bg-cyber-purple/20 text-gray-300 hover:bg-cyber-purple/30 text-xs">重新开始</button>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mb-3">模拟一个 {scenario.title} 场景，测试您的应急响应能力</p>

                            <div className="space-y-3">
                              {/* Step 1 */}
                              <div className={`p-3 rounded-lg ${emergencyDrillStep[scenario.id] === 0 ? 'bg-cyber-red/20 border border-cyber-red/30' : emergencyChoices[scenario.id] !== undefined ? 'bg-cyber-green/10 border border-cyber-green/20' : 'bg-cyber-purple/10'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="w-6 h-6 rounded-full bg-cyber-red/20 flex items-center justify-center text-xs text-cyber-red font-medium">1</span>
                                  <span className="text-sm font-medium text-white">发现异常：{scenario.phases[0]?.actions[0]?.title || '检测到安全事件'}</span>
                                </div>
                                {emergencyDrillStep[scenario.id] === undefined && (
                                  <>
                                    <p className="text-xs text-gray-400 mb-2">{scenario.phases[0]?.actions[0]?.description?.substring(0, 50)}...</p>
                                    <div className="space-y-2 mt-3">
                                      <p className="text-xs text-gray-400">您应该怎么做？</p>
                                      {[
                                        { choice: '立即断网，防止扩散', correct: true, result: '正确！第一时间断网可以有效阻止威胁扩散。' },
                                        { choice: '继续观察，等事态扩大', correct: false, result: '错误！这可能导致威胁进一步扩大。' },
                                        { choice: '立即报告管理层', correct: true, result: '正确！及时报告是应急响应的关键步骤。' }
                                      ].map((option, i) => (
                                        <button key={i} onClick={() => {
                                          setEmergencyDrillStep(prev => ({ ...prev, [scenario.id]: 1 }));
                                          setEmergencyChoices(prev => ({ ...prev, [scenario.id]: i }));
                                        }} className={`w-full text-left p-2 rounded text-xs transition-colors ${
                                          emergencyChoices[scenario.id] === i
                                            ? option.correct ? 'bg-cyber-green/30 border border-cyber-green/40' : 'bg-cyber-red/30 border border-cyber-red/40'
                                            : 'bg-cyber-purple/10 border border-cyber-purple/20 hover:bg-cyber-purple/20'
                                        }`}>{option.choice}</button>
                                      ))}
                                    </div>
                                  </>
                                )}
                                {emergencyChoices[scenario.id] !== undefined && (
                                  <div className="mt-2">
                                    <p className={`text-xs ${['bg-cyber-green/20', 'bg-cyber-red/20', 'bg-cyber-green/20'][emergencyChoices[scenario.id]]} p-2 rounded`}>
                                      {['正确！第一时间断网可以有效阻止威胁扩散。', '错误！这可能导致威胁进一步扩大。', '正确！及时报告是应急响应的关键步骤。'][emergencyChoices[scenario.id]]}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Step 2 */}
                              <div className={`p-3 rounded-lg ${emergencyDrillStep[scenario.id] === 1 ? 'bg-cyber-gold/20 border border-cyber-gold/30' : 'bg-cyber-purple/10'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="w-6 h-6 rounded-full bg-cyber-gold/20 flex items-center justify-center text-xs text-cyber-gold font-medium">2</span>
                                  <span className="text-sm font-medium text-white">遏制威胁</span>
                                </div>
                                {emergencyDrillStep[scenario.id] === 1 && (
                                  <>
                                    <p className="text-xs text-gray-400 mb-2">威胁已被发现，现在需要采取措施遏制其扩散。</p>
                                    <div className="space-y-2 mt-3">
                                      {[
                                        { choice: '隔离受感染主机', correct: true },
                                        { choice: '直接格式化硬盘', correct: false }
                                      ].map((option, i) => (
                                        <button key={i} onClick={() => setEmergencyDrillStep(prev => ({ ...prev, [scenario.id]: 2 }))}
                                          className="w-full text-left p-2 rounded text-xs transition-colors bg-cyber-purple/10 border border-cyber-purple/20 hover:bg-cyber-purple/20">{option.choice}</button>
                                      ))}
                                    </div>
                                  </>
                                )}
                              </div>

                              {/* Step 3 */}
                              <div className={`p-3 rounded-lg ${emergencyDrillStep[scenario.id] === 2 ? 'bg-cyber-blue/20 border border-cyber-blue/30' : 'bg-cyber-purple/10'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="w-6 h-6 rounded-full bg-cyber-blue/20 flex items-center justify-center text-xs text-cyber-blue font-medium">3</span>
                                  <span className="text-sm font-medium text-white">根除威胁</span>
                                </div>
                                {emergencyDrillStep[scenario.id] === 2 && (
                                  <>
                                    <p className="text-xs text-gray-400 mb-2">威胁已得到遏制，现在需要彻底清除。</p>
                                    <button onClick={() => setEmergencyDrillStep(prev => ({ ...prev, [scenario.id]: 3 }))}
                                      className="w-full text-left p-2 rounded text-xs transition-colors bg-cyber-purple/10 border border-cyber-purple/20 hover:bg-cyber-purple/20">清除恶意软件并修复漏洞</button>
                                  </>
                                )}
                              </div>

                              {/* Step 4 */}
                              <div className={`p-3 rounded-lg ${emergencyDrillStep[scenario.id] === 3 ? 'bg-cyber-green/20 border border-cyber-green/30' : 'bg-cyber-purple/10'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="w-6 h-6 rounded-full bg-cyber-green/20 flex items-center justify-center text-xs text-cyber-green font-medium">4</span>
                                  <span className="text-sm font-medium text-white">恢复正常运营</span>
                                </div>
                                {emergencyDrillStep[scenario.id] === 3 && (
                                  <>
                                    <p className="text-xs text-gray-400 mb-2">威胁已清除，现在恢复系统正常运营。</p>
                                    <button onClick={() => setEmergencyDrillStep(prev => ({ ...prev, [scenario.id]: 4 }))}
                                      className="w-full text-left p-2 rounded text-xs transition-colors bg-cyber-purple/10 border border-cyber-purple/20 hover:bg-cyber-purple/20">恢复备份并加强监控</button>
                                  </>
                                )}
                              </div>

                              {/* Completed */}
                              {emergencyDrillStep[scenario.id] === 4 && (
                                <div className="bg-cyber-green/20 border border-cyber-green/30 rounded-lg p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle size={20} className="text-cyber-green" />
                                    <span className="text-sm font-medium text-cyber-green">演练完成</span>
                                  </div>
                                  <p className="text-xs text-gray-300">恭喜您完成了 {scenario.title} 的应急响应演练！您已经了解了处理该类安全事件的基本流程。</p>
                                  <p className="text-xs text-cyber-gold mt-2">💡 提示：以上为简化演练流程，真实的应急响应需要更详细的步骤和专业的安全人员参与。</p>
                                </div>
                              )}
                            </div>
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

      {/* Emergency Info Box */}
      <Card className="bg-cyber-red/5 border-cyber-red/20">
        <div className="flex items-start gap-3">
          <Shield size={24} className="text-cyber-red flex-shrink-0" />
          <div>
            <h3 className="font-medium text-cyber-red mb-1">应急响应说明</h3>
            <p className="text-sm text-gray-400">
              本栏目提供各类网络安全事件的应急处理方案，包括勒索病毒、零日漏洞、数据泄露等。每个方案都包含详细的处理阶段、操作步骤、命令脚本和真实案例。
              应急响应遵循PDCERF模型（准备、检测、遏制、根除、恢复、跟踪），
              适用于政府机构、医疗单位、金融机构、企事业单位等各类组织。遇到真实事件时请根据实际情况调整操作，重要系统操作前请做好备份。
            </p>
          </div>
        </div>
      </Card>
    </>
  );
};
