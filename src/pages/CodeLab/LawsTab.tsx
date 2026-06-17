import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Shield, Lightbulb, Search, CheckCircle,
  FileCode, Trophy, ChevronDown, Info, AlertOctagon, ExternalLink,
} from 'lucide-react';
import { laws, lawCategories } from '../../data/laws';
import { Card, Badge } from '../../components/UI';

const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export const LawsTab: React.FC = () => {
  const [selectedLaw, setSelectedLaw] = useState<string | null>(null);
  const [selectedLawCategory, setSelectedLawCategory] = useState<string | null>(null);
  const [lawSearchQuery, setLawSearchQuery] = useState('');
  const [showLawQuiz, setShowLawQuiz] = useState<Record<string, boolean>>({});
  const [lawQuizAnswers, setLawQuizAnswers] = useState<Record<string, number | number[]>>({});
  const [lawQuizSubmitted, setLawQuizSubmitted] = useState<Record<string, boolean>>({});

  return (
    <>
      {/* Laws Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <BookOpen size={32} className="mx-auto mb-2 text-cyber-blue" />
          <p className="text-2xl font-bold text-white">{laws.length}</p>
          <p className="text-sm text-gray-400">法规总数</p>
        </Card>
        <Card className="text-center">
          <Shield size={32} className="mx-auto mb-2 text-cyber-green" />
          <p className="text-2xl font-bold text-white">{lawCategories.length}</p>
          <p className="text-sm text-gray-400">分类</p>
        </Card>
        <Card className="text-center">
          <Lightbulb size={32} className="mx-auto mb-2 text-cyber-gold" />
          <p className="text-2xl font-bold text-white">
            {laws.reduce((acc, l) => acc + l.importantClauses.length, 0)}
          </p>
          <p className="text-sm text-gray-400">重点条款</p>
        </Card>
      </div>

      {/* Laws Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="搜索法律法规名称、内容或标签..."
            value={lawSearchQuery}
            onChange={(e) => setLawSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-cyber-purple/20 border border-cyber-green/20 rounded-lg focus:outline-none focus:border-cyber-green/50 text-white placeholder-gray-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedLawCategory(null)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedLawCategory === null
                ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/30'
                : 'bg-cyber-purple/20 text-gray-400 border border-cyber-green/10 hover:text-white'
            }`}
          >全部</button>
          {lawCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedLawCategory(cat.name)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedLawCategory === cat.name
                  ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/30'
                  : 'bg-cyber-purple/20 text-gray-400 border border-cyber-green/10 hover:text-white'
              }`}
            >{cat.name} ({cat.count})</button>
          ))}
        </div>
      </div>

      {/* Laws Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {laws
          .filter(law => {
            const matchesCategory = !selectedLawCategory || law.category === selectedLawCategory;
            const matchesSearch = !lawSearchQuery ||
              law.name.toLowerCase().includes(lawSearchQuery.toLowerCase()) ||
              law.fullName.toLowerCase().includes(lawSearchQuery.toLowerCase()) ||
              law.summary.toLowerCase().includes(lawSearchQuery.toLowerCase()) ||
              law.tags.some(tag => tag.toLowerCase().includes(lawSearchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
          })
          .map((law) => (
            <motion.div key={law.id} variants={itemVariants}>
              <Card
                className={`cursor-pointer group transition-all duration-200 ${
                  selectedLaw === law.id ? 'ring-2 ring-cyber-green/50' : ''
                }`}
                onClick={() => setSelectedLaw(selectedLaw === law.id ? null : law.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-lg bg-cyber-purple/60 flex items-center justify-center flex-shrink-0">
                    <BookOpen size={28} className="text-gray-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-medium text-white group-hover:text-cyber-green transition-colors">{law.name}</h3>
                      <Badge variant="blue">{law.level}</Badge>
                      <Badge variant="gold">{law.subcategory}</Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-2 line-clamp-2">{law.summary}</p>
                    <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500">
                      <span>发布：{law.issueDate}</span>
                      <span>•</span>
                      <span>实施：{law.effectiveDate}</span>
                      <span>•</span>
                      <span>{law.issuingAuthority}</span>
                    </div>
                  </div>
                  <ChevronDown size={20} className={`text-gray-400 transition-transform flex-shrink-0 ${selectedLaw === law.id ? 'rotate-180' : ''}`} />
                </div>

                {/* Expanded Law Content */}
                <AnimatePresence>
                  {selectedLaw === law.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                      <div className="mt-4 pt-4 border-t border-cyber-green/10 space-y-4">
                        {/* Key Provisions */}
                        <div>
                          <h4 className="text-sm font-medium text-cyber-green mb-2 flex items-center gap-2"><CheckCircle size={14} /> 核心制度与关键规定</h4>
                          <div className="flex flex-wrap gap-2">
                            {law.keyProvisions.map((provision, i) => (
                              <span key={i} className="text-xs px-2 py-1 bg-cyber-purple/30 text-gray-300 rounded">{provision}</span>
                            ))}
                          </div>
                        </div>

                        {/* Important Clauses */}
                        {law.importantClauses.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-cyber-blue mb-2 flex items-center gap-2"><FileCode size={14} /> 重点条款解读</h4>
                            <div className="space-y-3">
                              {law.importantClauses.map((clause, i) => (
                                <div key={i} className="bg-cyber-purple/10 rounded-lg p-3">
                                  <div className="text-xs font-medium text-cyber-green mb-1">{clause.clause}</div>
                                  <p className="text-xs text-gray-300 mb-2">{clause.content}</p>
                                  <p className="text-xs text-cyber-gold border-l-2 border-cyber-gold/30 pl-2 italic">
                                    💡 {clause.explanation}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Quiz */}
                        <div className="bg-cyber-green/5 border border-cyber-green/20 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-cyber-green flex items-center gap-2"><Trophy size={14} /> 知识测验</h4>
                            {!showLawQuiz[law.id] && (
                              <button onClick={() => setShowLawQuiz(prev => ({ ...prev, [law.id]: true }))}
                                className="px-3 py-1 rounded bg-cyber-green/20 text-cyber-green hover:bg-cyber-green/30 text-xs transition-colors">开始测验</button>
                            )}
                          </div>

                          {showLawQuiz[law.id] && (
                            <div className="space-y-4">
                              <div className="space-y-3">
                                {/* Question 1 */}
                                <div>
                                  <p className="text-xs text-gray-300 mb-2">1. 根据《{law.name}》，以下哪项描述是正确的？</p>
                                  <div className="space-y-2">
                                    {[
                                      law.keyProvisions[0] || '规定了重要的安全保护要求',
                                      law.applicableScope[0] || '适用于各类网络运营者',
                                      law.penalties[0] || '明确了法律责任',
                                      '以上都不是'
                                    ].map((option, i) => (
                                      <label key={i}
                                        className={`flex items-start gap-2 p-2 rounded cursor-pointer transition-colors ${
                                          lawQuizAnswers[`${law.id}-1`] === i
                                            ? lawQuizSubmitted[law.id]
                                              ? i === 0 ? 'bg-cyber-green/20 border border-cyber-green/40' : 'bg-cyber-red/20 border border-cyber-red/40'
                                              : 'bg-cyber-purple/10 border border-cyber-purple/20 hover:bg-cyber-purple/20'
                                            : lawQuizSubmitted[law.id] && i === 0
                                              ? 'bg-cyber-green/20 border border-cyber-green/40'
                                              : 'bg-cyber-purple/10 border border-cyber-purple/20 hover:bg-cyber-purple/20'
                                        }`}>
                                        <input type="radio" name={`${law.id}-1`} value={i}
                                          checked={lawQuizAnswers[`${law.id}-1`] === i}
                                          onChange={() => !lawQuizSubmitted[law.id] && setLawQuizAnswers(prev => ({ ...prev, [`${law.id}-1`]: i }))}
                                          disabled={lawQuizSubmitted[law.id]} className="mt-1" />
                                        <span className="text-xs text-gray-300">{option}</span>
                                      </label>
                                    ))}
                                  </div>
                                  {lawQuizSubmitted[law.id] && lawQuizAnswers[`${law.id}-1`] !== 0 && (
                                    <p className="text-xs text-cyber-gold mt-1">💡 提示：{law.keyProvisions[0] || '建议查看上面的核心制度内容'}</p>
                                  )}
                                </div>

                                {/* Question 2 - multi-select */}
                                <div>
                                  <p className="text-xs text-gray-300 mb-2">2. {law.name}的适用范围包括哪些？（多选）</p>
                                  <div className="space-y-2">
                                    {[...law.applicableScope.slice(0, 2), '仅限外资企业', '个人用户'].map((option, i) => {
                                      const selectedAnswers = lawQuizAnswers[`${law.id}-2`] as number[] || [];
                                      const isSelected = selectedAnswers.includes(i);
                                      const isCorrect = i < 2;
                                      return (
                                        <label key={i}
                                          className={`flex items-start gap-2 p-2 rounded cursor-pointer transition-colors ${
                                            lawQuizSubmitted[law.id]
                                              ? isCorrect ? 'bg-cyber-green/20 border border-cyber-green/40'
                                              : isSelected ? 'bg-cyber-red/20 border border-cyber-red/40'
                                              : 'bg-cyber-purple/10 border border-cyber-purple/20'
                                              : isSelected ? 'bg-cyber-purple/20 border border-cyber-purple/40'
                                              : 'bg-cyber-purple/10 border border-cyber-purple/20 hover:bg-cyber-purple/20'
                                          }`}>
                                          <input type="checkbox" checked={isSelected}
                                            onChange={() => {
                                              if (!lawQuizSubmitted[law.id]) {
                                                const newAnswers = isSelected ? selectedAnswers.filter(a => a !== i) : [...selectedAnswers, i];
                                                setLawQuizAnswers(prev => ({ ...prev, [`${law.id}-2`]: newAnswers }));
                                              }
                                            }} disabled={lawQuizSubmitted[law.id]} className="mt-1" />
                                          <span className="text-xs text-gray-300">{option}</span>
                                        </label>
                                      );
                                    })}
                                  </div>
                                  {lawQuizSubmitted[law.id] && (
                                    <p className="text-xs text-cyber-gold mt-1">💡 正确答案：{law.applicableScope.slice(0, 2).join('、')}</p>
                                  )}
                                </div>
                              </div>

                              {!lawQuizSubmitted[law.id] ? (
                                <button onClick={() => setLawQuizSubmitted(prev => ({ ...prev, [law.id]: true }))}
                                  disabled={lawQuizAnswers[`${law.id}-1`] === undefined}
                                  className="px-4 py-2 rounded bg-cyber-green text-black font-medium hover:bg-cyber-green/90 disabled:opacity-50 disabled:cursor-not-allowed text-xs">提交答案</button>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Badge variant="green" className="flex items-center gap-1"><CheckCircle size={12} />测验完成</Badge>
                                  <button onClick={() => {
                                    setLawQuizAnswers(prev => ({ ...prev, [`${law.id}-1`]: undefined, [`${law.id}-2`]: [] }));
                                    setLawQuizSubmitted(prev => ({ ...prev, [law.id]: false }));
                                  }} className="px-3 py-1 rounded bg-cyber-purple/20 text-gray-300 hover:bg-cyber-purple/30 text-xs">重新测验</button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Applicable Scope & Penalties */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-cyber-blue mb-2 flex items-center gap-2"><Info size={14} /> 适用范围</h4>
                            <ul className="text-xs text-gray-400 space-y-1">
                              {law.applicableScope.map((scope, i) => <li key={i}>• {scope}</li>)}
                            </ul>
                          </div>
                          {law.penalties.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-cyber-red mb-2 flex items-center gap-2"><AlertOctagon size={14} /> 法律责任</h4>
                              <ul className="text-xs text-gray-400 space-y-1">
                                {law.penalties.map((penalty, i) => <li key={i}>• {penalty}</li>)}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Related Laws */}
                        {law.relatedLaws.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-cyber-purple mb-2 flex items-center gap-2"><ExternalLink size={14} /> 相关法规</h4>
                            <div className="flex flex-wrap gap-2">
                              {law.relatedLaws.map((related, i) => (
                                <span key={i} className="text-xs px-2 py-1 bg-cyber-blue/10 text-cyber-blue rounded-full">{related}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          {law.tags.map((tag, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-cyber-purple/30 text-gray-400 rounded-full">#{tag}</span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
      </div>

      {/* Laws Info Box */}
      <Card className="bg-cyber-blue/5 border-cyber-blue/20">
        <div className="flex items-start gap-3">
          <Shield size={24} className="text-cyber-blue flex-shrink-0" />
          <div>
            <h3 className="font-medium text-cyber-blue mb-1">法规学习说明</h3>
            <p className="text-sm text-gray-400">
              本栏目整理了网络安全领域的主要法律法规和国家标准，供学习参考使用。内容以官方正式发布版本为准。
              包括《网络安全法》《数据安全法》《个人信息保护法》等基础性法律，以及网络安全等级保护（等保2.0）相关的国家标准和政策文件。
            </p>
          </div>
        </div>
      </Card>
    </>
  );
};
