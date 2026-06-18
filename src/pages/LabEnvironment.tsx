import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bug, Database, Flag, Key, Wrench, Globe, FileCode,
  Globe2, Shield, FileSearch, Brain,
  Zap, Target, TrendingUp, BookOpen, ArrowRight, Star,
  AlertTriangle, Cpu, Info, Lightbulb, Code2, ExternalLink, Bookmark
} from 'lucide-react';
import { XSSSandbox } from './LabEnvironment/XSSSandbox';
import { SQLInjectionLab } from './LabEnvironment/SQLInjectionLab';
import { CTFChallengesComp } from './LabEnvironment/CTFChallenges';
import { PasswordCracking } from './LabEnvironment/PasswordCracking';
import { CryptoTools } from './LabEnvironment/CryptoTools';
import { NetworkVisualization } from './LabEnvironment/NetworkVisualization';
import { VulnCodeCompare } from './LabEnvironment/VulnCodeCompare';
import { BurpSimulator } from './LabEnvironment/BurpSimulator';
import { WAFRulesBuilder } from './LabEnvironment/WAFRulesBuilder';
import { LogAnalysis } from './LabEnvironment/LogAnalysis';
import { LogicVulnerabilities } from './LabEnvironment/LogicVulnerabilities';
import { LAB_MODULES } from './LabEnvironment/modules';
import { MODULE_KNOWLEDGE } from './LabEnvironment/moduleKnowledge';
import type { ModuleKnowledge } from './LabEnvironment/types';

// ===== Helpers =====
const CATEGORY_MAP: Record<string, { name: string; icon: React.ReactNode; desc: string }> = {
  web:    { name: 'Web安全',   icon: React.createElement(Globe, { size: 16 }),   desc: 'XSS、SQL注入、逻辑漏洞等Web应用安全实验' },
  crypto: { name: '密码学',    icon: React.createElement(Key, { size: 16 }),     desc: '加解密算法、编码转换、Hash计算与破解' },
  network:{ name: '网络攻防',  icon: React.createElement(Cpu, { size: 16 }),     desc: '网络攻击可视化、协议分析与防御' },
  tool:   { name: '安全工具',  icon: React.createElement(Wrench, { size: 16 }),  desc: 'Burp模拟、WAF规则、日志分析等实战工具' },
  ctf:    { name: 'CTF竞赛',   icon: React.createElement(Flag, { size: 16 }),    desc: '夺旗挑战赛，综合实战能力检验' },
};

const MODULE_CATEGORY: Record<string, string> = {
  xss: 'web', sqli: 'web', logic: 'web',
  password: 'crypto', crypto: 'crypto',
  network: 'network',
  burp: 'tool', waf: 'tool', log: 'tool', vulncode: 'tool',
  ctf: 'ctf',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  '简单': 'bg-green-500/20 text-green-400 border-green-500/30',
  '中等': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  '困难': 'bg-red-500/20 text-red-400 border-red-500/30',
};

const LEARNING_PATH = [
  { step: 1, title: '基础入门', modules: ['vulncode'], desc: '先通过代码对比了解常见漏洞形态' },
  { step: 2, title: 'Web安全实战', modules: ['xss', 'sqli', 'logic'], desc: '掌握三大Web安全核心攻击类型' },
  { step: 3, title: '工具链掌握', modules: ['burp', 'waf', 'log'], desc: '学会使用安全测试与分析工具' },
  { step: 4, title: '密码与网络', modules: ['crypto', 'password', 'network'], desc: '深入密码学与网络协议攻击' },
  { step: 5, title: '综合挑战', modules: ['ctf'], desc: '通过CTF竞赛检验综合实战能力' },
];

// ===== Knowledge Sidebar =====
const KnowledgePanel: React.FC<{ knowledge: ModuleKnowledge; moduleColor: string }> = ({ knowledge, moduleColor }) => (
  <aside className="space-y-4 lg:sticky lg:top-4">
    {/* 攻击原理 */}
    <div className="rounded-xl border border-cyber-purple/20 bg-cyber-purple/5 p-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: moduleColor }}>
        <Info size={16} /> 攻击原理
      </h3>
      <p className="text-xs text-gray-400 leading-relaxed">{knowledge.theory}</p>
    </div>

    {/* 常见攻击向量 */}
    <div className="rounded-xl border border-cyber-purple/20 bg-cyber-purple/5 p-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: moduleColor }}>
        <Bug size={16} /> 常见攻击向量
      </h3>
      <div className="space-y-2">
        {knowledge.vectors.map((v, i) => (
          <div key={i} className="text-xs text-gray-400 bg-cyber-black/30 rounded-lg p-2 border border-gray-700/50 font-mono leading-relaxed">
            {v}
          </div>
        ))}
      </div>
    </div>

    {/* 防御策略 */}
    <div className="rounded-xl border border-cyber-purple/20 bg-cyber-purple/5 p-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: moduleColor }}>
        <Shield size={16} /> 防御策略
      </h3>
      <ul className="space-y-1.5">
        {knowledge.defenses.map((d, i) => (
          <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
            <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
            <span>{d}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* CISP考点 */}
    {knowledge.cispPoints.length > 0 && (
      <div className="rounded-xl border border-cyber-purple/20 bg-cyber-purple/5 p-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: moduleColor }}>
          <Bookmark size={16} /> CISP 考点
        </h3>
        <ul className="space-y-1.5">
          {knowledge.cispPoints.map((p, i) => (
            <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
              <span className="text-cyber-green mt-0.5 flex-shrink-0">●</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* 相关CVE */}
    {knowledge.cves.length > 0 && (
      <div className="rounded-xl border border-cyber-purple/20 bg-cyber-purple/5 p-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: moduleColor }}>
          <AlertTriangle size={16} /> 相关 CVE
        </h3>
        <div className="space-y-1.5">
          {knowledge.cves.map((cve, i) => (
            <div key={i} className="text-xs text-gray-400 bg-cyber-black/30 rounded-lg p-2 border border-gray-700/50 font-mono">
              {cve}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* 推荐工具 */}
    {knowledge.tools.length > 0 && (
      <div className="rounded-xl border border-cyber-purple/20 bg-cyber-purple/5 p-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: moduleColor }}>
          <Wrench size={16} /> 推荐工具
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {knowledge.tools.map((t, i) => (
            <span key={i} className="text-xs px-2 py-1 rounded-md bg-cyber-black/30 border border-gray-700/50 text-gray-400 font-mono">
              {t}
            </span>
          ))}
        </div>
      </div>
    )}
  </aside>
);

// ===== Module Knowledge Banners (compact inline version) =====
const ModuleKnowledgeBar: React.FC<{ knowledge: ModuleKnowledge; moduleColor: string }> = ({ knowledge, moduleColor }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
    <div className="bg-cyber-purple/5 border border-cyber-purple/10 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb size={14} style={{ color: moduleColor }} />
        <span className="text-xs font-medium text-gray-300">核心原理</span>
      </div>
      <p className="text-[11px] text-gray-500 line-clamp-3 leading-relaxed">{knowledge.theory.substring(0, 120)}...</p>
    </div>
    <div className="bg-cyber-purple/5 border border-cyber-purple/10 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-2">
        <Bug size={14} style={{ color: moduleColor }} />
        <span className="text-xs font-medium text-gray-300">攻击向量</span>
      </div>
      <p className="text-[11px] text-gray-500">{knowledge.vectors.length} 种攻击方式</p>
      <p className="text-[11px] text-gray-600 mt-1 truncate">{knowledge.vectors[0]}</p>
    </div>
    <div className="bg-cyber-purple/5 border border-cyber-purple/10 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-2">
        <Shield size={14} style={{ color: moduleColor }} />
        <span className="text-xs font-medium text-gray-300">防御策略</span>
      </div>
      <p className="text-[11px] text-gray-500">{knowledge.defenses.length} 条防御建议</p>
      <p className="text-[11px] text-gray-600 mt-1 truncate">{knowledge.defenses[0]}</p>
    </div>
    <div className="bg-cyber-purple/5 border border-cyber-purple/10 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-2">
        <Code2 size={14} style={{ color: moduleColor }} />
        <span className="text-xs font-medium text-gray-300">推荐工具</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {knowledge.tools.slice(0, 4).map((t, i) => (
          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-cyber-black/30 text-gray-500 font-mono">{t}</span>
        ))}
      </div>
    </div>
  </div>
);

// ===== Main Component =====
export const LabEnvironment: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string>('xss');
  const [activeTab, setActiveTab] = useState<'modules' | 'path'>('modules');
  const [showKnowledge, setShowKnowledge] = useState(false);

  const stats = useMemo(() => {
    const diffCount: Record<string, number> = {};
    const catCount: Record<string, number> = {};
    LAB_MODULES.forEach(m => {
      diffCount[m.difficulty] = (diffCount[m.difficulty] ?? 0) + 1;
      const cat = MODULE_CATEGORY[m.id] ?? 'other';
      catCount[cat] = (catCount[cat] ?? 0) + 1;
    });
    return { diffCount, catCount, total: LAB_MODULES.length };
  }, []);

  const currentModule = LAB_MODULES.find(m => m.id === activeModule);
  const currentKnowledge = MODULE_KNOWLEDGE[activeModule];

  const renderModule = () => {
    switch (activeModule) {
      case 'xss': return <XSSSandbox />;
      case 'sqli': return <SQLInjectionLab />;
      case 'ctf': return <CTFChallengesComp />;
      case 'password': return <PasswordCracking />;
      case 'crypto': return <CryptoTools />;
      case 'network': return <NetworkVisualization />;
      case 'vulncode': return <VulnCodeCompare />;
      case 'burp': return <BurpSimulator />;
      case 'waf': return <WAFRulesBuilder />;
      case 'log': return <LogAnalysis />;
      case 'logic': return <LogicVulnerabilities />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* ===== Hero Banner ===== */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyber-purple/20 via-cyber-black/80 to-cyber-green/10 border border-cyber-purple/30 p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-green/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center">
              <Zap size={24} className="text-cyber-green" />
            </div>
            <div>
              <h1 className="font-orbitron text-2xl font-bold text-cyber-green">安全实验环境</h1>
              <p className="text-gray-400 text-sm">Interactive Security Lab — 动手实操，学以致用</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm max-w-3xl leading-relaxed">
            本实验环境提供 <span className="text-cyber-green font-semibold">{stats.total}</span> 个交互式安全实验模块，
            覆盖 <span className="text-cyber-green font-semibold">Web安全、密码学、网络攻防、安全工具</span> 四大领域。
            每个模块包含完整的攻击→防御知识体系，在浏览器中即可体验真实安全场景。
          </p>
        </div>
      </div>

      {/* ===== Stats Bar ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '实验模块', value: stats.total, icon: React.createElement(Target, { size: 18 }), color: 'text-cyber-green' },
          { label: '简单', value: stats.diffCount['简单'] ?? 0, icon: React.createElement(Star, { size: 18 }), color: 'text-green-400' },
          { label: '中等', value: stats.diffCount['中等'] ?? 0, icon: React.createElement(TrendingUp, { size: 18 }), color: 'text-yellow-400' },
          { label: '困难', value: stats.diffCount['困难'] ?? 0, icon: React.createElement(AlertTriangle, { size: 18 }), color: 'text-red-400' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-cyber-purple/10 border border-cyber-purple/20 rounded-xl p-4 flex items-center gap-3"
          >
            <div className={`${item.color} opacity-70`}>{item.icon}</div>
            <div>
              <div className="font-orbitron text-xl font-bold text-white">{item.value}</div>
              <div className="text-xs text-gray-500">{item.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ===== Category Overview ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {Object.entries(CATEGORY_MAP).map(([key, cat]) => (
          <div key={key} className="bg-cyber-purple/5 border border-cyber-purple/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-400">{cat.icon}</span>
              <span className="text-sm font-medium text-gray-300">{cat.name}</span>
              <span className="ml-auto text-xs text-gray-600 font-mono">
                {stats.catCount[key] ?? 0} 模块
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{cat.desc}</p>
          </div>
        ))}
      </div>

      {/* ===== Tab Switcher ===== */}
      <div className="flex items-center justify-between border-b border-cyber-purple/20 pb-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('modules')}
            className={`flex items-center gap-2 text-sm font-medium pb-2 -mb-3 border-b-2 transition ${
              activeTab === 'modules'
                ? 'text-cyber-green border-cyber-green'
                : 'text-gray-500 border-transparent hover:text-gray-300'
            }`}
          >
            <Cpu size={16} /> 全部模块
          </button>
          <button
            onClick={() => setActiveTab('path')}
            className={`flex items-center gap-2 text-sm font-medium pb-2 -mb-3 border-b-2 transition ${
              activeTab === 'path'
                ? 'text-cyber-green border-cyber-green'
                : 'text-gray-500 border-transparent hover:text-gray-300'
            }`}
          >
            <BookOpen size={16} /> 推荐学习路径
          </button>
        </div>
        {currentModule && (
          <button
            onClick={() => setShowKnowledge(!showKnowledge)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition ${
              showKnowledge
                ? 'border-cyber-green/30 bg-cyber-green/10 text-cyber-green'
                : 'border-cyber-purple/20 text-gray-500 hover:text-gray-300'
            }`}
          >
            <Bookmark size={14} />
            {showKnowledge ? '隐藏知识面板' : '显示知识面板'}
          </button>
        )}
      </div>

      {/* ===== Module Grid (Tab 1) ===== */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {LAB_MODULES.map(mod => {
            const isActive = activeModule === mod.id;
            return (
              <motion.button
                key={mod.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveModule(mod.id)}
                className={`
                  p-4 rounded-xl border text-left transition-all relative overflow-hidden group
                  ${isActive
                    ? `${mod.bgColor} ${mod.borderColor} shadow-lg ring-1 ring-offset-1 ring-offset-cyber-black ${mod.borderColor}`
                    : 'bg-cyber-purple/5 border-cyber-purple/10 hover:bg-cyber-purple/15 hover:border-cyber-purple/30'
                  }
                `}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                  style={{ background: `radial-gradient(circle at center, ${mod.color}10, transparent 70%)` }} />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div style={{ color: isActive ? mod.color : '#666' }} className="transition-colors group-hover:scale-110 group-hover:transition-transform">
                      {mod.icon}
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[mod.difficulty] ?? 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                      {mod.difficulty}
                    </span>
                  </div>
                  <h3 className={`text-sm font-semibold mb-1.5 transition-colors ${
                    isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                  }`}>
                    {mod.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed group-hover:text-gray-400 transition-colors">
                    {mod.description}
                  </p>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ backgroundColor: mod.color }}
                    />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* ===== Learning Path (Tab 2) ===== */}
      {activeTab === 'path' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            按以下推荐路径逐步学习，从基础到实战，循序渐进掌握各项安全技能。
            点击每步中的模块卡片可直接跳转到对应实验。
          </p>
          <div className="space-y-3">
            {LEARNING_PATH.map((stage, idx) => (
              <motion.div
                key={stage.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-cyber-green/10 border-2 border-cyber-green/30 flex items-center justify-center flex-shrink-0">
                    <span className="font-orbitron text-sm text-cyber-green">{stage.step}</span>
                  </div>
                  {idx < LEARNING_PATH.length - 1 && (
                    <div className="w-0.5 flex-1 bg-cyber-green/20 mt-1 mb-1" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <h3 className="text-base font-semibold text-white mb-1">{stage.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">{stage.desc}</p>
                  <div className="flex gap-2 flex-wrap">
                    {stage.modules.map(modId => {
                      const mod = LAB_MODULES.find(m => m.id === modId);
                      if (!mod) return null;
                      return (
                        <button
                          key={modId}
                          onClick={() => { setActiveModule(modId); setActiveTab('modules'); }}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition text-xs"
                          style={{
                            borderColor: mod.color + '40',
                            backgroundColor: mod.color + '10',
                            color: mod.color,
                          }}
                        >
                          {mod.icon}
                          <span>{mod.name}</span>
                          <ArrowRight size={12} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ===== Active Module Content ===== */}
      {activeTab === 'modules' && currentModule && (
        <>
          {/* Current Module Header */}
          <div className="flex items-center gap-3 p-4 rounded-xl border"
            style={{
              borderColor: currentModule.color + '30',
              backgroundColor: currentModule.color + '08',
            }}
          >
            <div style={{ color: currentModule.color }}>{currentModule.icon}</div>
            <div>
              <h2 className="text-lg font-bold text-white">{currentModule.name}</h2>
              <p className="text-xs text-gray-400">{currentModule.description}</p>
            </div>
            <span className={`ml-auto text-xs px-2 py-1 rounded-full border ${DIFFICULTY_COLORS[currentModule.difficulty] ?? ''}`}>
              {currentModule.difficulty}
            </span>
          </div>

          {/* Knowledge Bar (compact, always visible) */}
          {currentKnowledge && <ModuleKnowledgeBar knowledge={currentKnowledge} moduleColor={currentModule.color} />}

          {/* Main experiment + Knowledge sidebar */}
          <div className={`grid gap-6 ${showKnowledge && currentKnowledge ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {/* Experiment area */}
            <div className={showKnowledge && currentKnowledge ? 'lg:col-span-2' : ''}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeModule}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderModule()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Knowledge sidebar (toggleable) */}
            {showKnowledge && currentKnowledge && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <KnowledgePanel knowledge={currentKnowledge} moduleColor={currentModule.color} />
              </motion.div>
            )}
          </div>
        </>
      )}

      {/* ===== Getting Started Guide ===== */}
      <div className="bg-cyber-purple/5 border border-cyber-purple/10 rounded-xl p-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
          <BookOpen size={16} className="text-cyber-green" />
          使用指南
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: React.createElement(Target, { size: 18 }), title: '选择实验模块', desc: '在上方模块列表或推荐路径中选择感兴趣的实验，点击即可进入交互界面' },
            { icon: React.createElement(Zap, { size: 18 }), title: '动手实操', desc: '每个模块都是可交互的安全实验，输入payload、观察结果，在实操中理解攻击原理' },
            { icon: React.createElement(Shield, { size: 18 }), title: '学习防御', desc: '每个实验都附带防御建议和安全编码最佳实践，攻击与防御并重' },
            { icon: React.createElement(Bookmark, { size: 18 }), title: '知识面板', desc: '点击「显示知识面板」查看攻击原理、常见向量、防御策略和CISP考点' },
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyber-green/10 border border-cyber-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-cyber-green">{item.icon}</span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-1">{item.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LabEnvironment;
