import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code,
  Play,
  CheckCircle,
  Clock,
  ChevronRight,
  ChevronDown,
  Lock,
  Zap,
  Shield,
  Database,
  Network,
  Terminal,
  Package,
  Folder,
  BookOpen,
  AlertTriangle,
  Key,
  Wifi,
  Bug,
  Activity,
  FileCode,
  Cloud,
  Trophy,
  Copy,
  ExternalLink,
  Search,
  Filter,
  Terminal as TerminalIcon,
  Info,
  Lightbulb,
  AlertOctagon,
  Briefcase,
} from 'lucide-react';
import { useLearningStore, useAchievementStore } from '../store';
import { experiments } from '../data/learningData';
import { securityScripts, scriptCategories } from '../data/securityScripts';
import { laws, lawCategories } from '../data/laws';
import { emergencyScenarios, EmergencyScenario } from '../data/emergencyResponse';
import { Card, Badge, Button } from '../components/UI';

const difficultyColors = {
  easy: 'green',
  medium: 'gold',
  hard: 'red',
} as const;

const categoryIcons: Record<string, any> = {
  'sql-injection': Database,
  'xss-demo': Terminal,
  'password-crack': Shield,
  'log-analysis': Network,
  'hash-demo': Lock,
  'encrypt-decrypt': Shield,
  'firewall-rules': Network,
  '信息收集': Search,
  '漏洞检测': Bug,
  '密码攻击': Key,
  '无线安全': Wifi,
  '逆向工程': TerminalIcon,
  '应急响应': Activity,
  '数据包分析': Network,
  '加密解密': Lock,
  'Web安全': Shield,
  '云安全': Cloud,
  'CTF工具': Trophy,
  '隐私保护': Lock,
};

export const CodeLab: React.FC = () => {
  const navigate = useNavigate();
  const { completedLabs, completeLab } = useLearningStore();
  const { checkAndUnlockBadge } = useAchievementStore();
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'experiments' | 'scripts' | 'laws' | 'emergency'>('experiments');
  const [selectedScript, setSelectedScript] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLaw, setSelectedLaw] = useState<string | null>(null);
  const [selectedLawCategory, setSelectedLawCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lawSearchQuery, setLawSearchQuery] = useState('');
  const [selectedEmergency, setSelectedEmergency] = useState<string | null>(null);
  const [selectedEmergencyCategory, setSelectedEmergencyCategory] = useState<string | null>(null);
  const [emergencySearchQuery, setEmergencySearchQuery] = useState('');
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [expandedScript, setExpandedScript] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleExperimentComplete = (experimentId: string) => {
    if (!completedLabs.includes(experimentId)) {
      completeLab(experimentId);
      checkAndUnlockBadge('first_quiz');

      const completedCount = completedLabs.length + 1;
      if (completedCount >= 5) {
        checkAndUnlockBadge('complete_5_labs');
      }
      if (completedCount >= experiments.length) {
        checkAndUnlockBadge('complete_all_labs');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-orbitron text-2xl font-bold text-cyber-green">
          代码实验室
        </h1>
        <p className="text-gray-400 mt-1">
          {activeTab === 'experiments' ? '通过动手实验深入理解安全概念，所有实验都在安全模拟环境中进行' :
           activeTab === 'scripts' ? '网络安全脚本仓库，提供详细的操作步骤和使用说明' :
           activeTab === 'laws' ? '网络安全相关法律法规与等级保护制度知识学习' :
           '网络安全应急处理方案，包含勒索病毒、漏洞利用、系统崩溃等各类安全事件的详细处理流程'}
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-4 border-b border-cyber-green/20">
        <button
          onClick={() => setActiveTab('experiments')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'experiments'
              ? 'text-cyber-green border-b-2 border-cyber-green'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <TerminalIcon size={18} />
            代码实验
          </div>
        </button>
        <button
          onClick={() => setActiveTab('scripts')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'scripts'
              ? 'text-cyber-green border-b-2 border-cyber-green'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Package size={18} />
            脚本仓库 ({securityScripts.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab('laws')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'laws'
              ? 'text-cyber-green border-b-2 border-cyber-green'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <BookOpen size={18} />
            法律法规 ({laws.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab('emergency')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'emergency'
              ? 'text-cyber-green border-b-2 border-cyber-green'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} />
            应急处理 ({emergencyScenarios.length})
          </div>
        </button>
      </div>

      {activeTab === 'experiments' ? (
        <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <Code size={32} className="mx-auto mb-2 text-cyber-blue" />
          <p className="text-2xl font-bold text-white">{experiments.length}</p>
          <p className="text-sm text-gray-400">实验总数</p>
        </Card>
        <Card className="text-center">
          <CheckCircle size={32} className="mx-auto mb-2 text-cyber-green" />
          <p className="text-2xl font-bold text-white">{completedLabs.length}</p>
          <p className="text-sm text-gray-400">已完成</p>
        </Card>
        <Card className="text-center">
          <Zap size={32} className="mx-auto mb-2 text-cyber-gold" />
          <p className="text-2xl font-bold text-white">
            {Math.round((completedLabs.length / experiments.length) * 100)}%
          </p>
          <p className="text-sm text-gray-400">完成率</p>
        </Card>
      </div>

      {/* Experiment List */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {experiments.map((exp) => {
          const IconComponent = categoryIcons[exp.id] || Terminal;
          const isCompleted = completedLabs.includes(exp.id);

          return (
            <motion.div key={exp.id} variants={itemVariants}>
              <Card
                className={`
                  h-full cursor-pointer group
                  ${isCompleted ? 'border-cyber-green/30' : ''}
                  ${selectedExperiment === exp.id ? 'ring-2 ring-cyber-green/50' : ''}
                `}
                onClick={() => setSelectedExperiment(
                  selectedExperiment === exp.id ? null : exp.id
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`
                      w-14 h-14 rounded-lg flex items-center justify-center
                      ${isCompleted ? 'bg-cyber-green/20' : 'bg-cyber-purple/60'}
                    `}
                  >
                    <IconComponent
                      size={28}
                      className={isCompleted ? 'text-cyber-green' : 'text-gray-300'}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-white group-hover:text-cyber-green transition-colors">
                        {exp.title}
                      </h3>
                      {isCompleted && (
                        <CheckCircle size={16} className="text-cyber-green" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-3">
                      {exp.description}
                    </p>
                    <div className="flex items-center gap-3">
                      <Badge variant={difficultyColors[exp.difficulty]}>
                        {exp.difficulty === 'easy' ? '简单' :
                         exp.difficulty === 'medium' ? '中等' : '困难'}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {exp.instructions.length}个步骤
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {selectedExperiment === exp.id && (
                  <div className="mt-4 pt-4 border-t border-cyber-green/10 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-cyber-green mb-2">
                        实验指导
                      </h4>
                      <ol className="space-y-2">
                        {exp.instructions.map((instruction, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="w-5 h-5 rounded-full bg-cyber-purple/60 flex items-center justify-center text-xs flex-shrink-0">
                              {i + 1}
                            </span>
                            {instruction}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-cyber-green mb-2">
                        初始代码
                      </h4>
                      <pre className="code-block text-xs">
                        <code>{exp.initialCode}</code>
                      </pre>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        size="sm"
                        icon={Play}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExperimentComplete(exp.id);
                        }}
                      >
                        {isCompleted ? '再次完成' : '开始实验'}
                      </Button>
                      {isCompleted && (
                        <Badge variant="green">已完成</Badge>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Info Box */}
      <Card className="bg-cyber-blue/5 border-cyber-blue/20">
        <div className="flex items-start gap-3">
          <Shield size={24} className="text-cyber-blue flex-shrink-0" />
          <div>
            <h3 className="font-medium text-cyber-blue mb-1">安全实验环境</h3>
            <p className="text-sm text-gray-400">
              所有实验都在隔离的虚拟环境中进行，不会对真实系统造成任何影响。
              这些实验仅用于学习目的，帮助你理解安全威胁和防御机制。
            </p>
          </div>
        </div>
      </Card>
        </>
      ) : activeTab === 'scripts' ? (
        <>
          {/* Scripts Repository */}
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="搜索脚本名称、描述或标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-cyber-purple/20 border border-cyber-green/20 rounded-lg focus:outline-none focus:border-cyber-green/50 text-white placeholder-gray-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === null
                    ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/30'
                    : 'bg-cyber-purple/20 text-gray-400 border border-cyber-green/10 hover:text-white'
                }`}
              >
                全部
              </button>
              {scriptCategories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === cat.name
                      ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/30'
                      : 'bg-cyber-purple/20 text-gray-400 border border-cyber-green/10 hover:text-white'
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>
          </div>

          {/* Scripts Grid */}
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
                const ScriptIcon = categoryIcons[script.category] || Terminal;
                return (
                  <motion.div key={script.id} variants={itemVariants}>
                    <Card
                      className={`cursor-pointer group transition-all duration-200 ${
                        selectedScript === script.id ? 'ring-2 ring-cyber-green/50' : ''
                      }`}
                      onClick={() => setSelectedScript(selectedScript === script.id ? null : script.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-lg bg-cyber-purple/60 flex items-center justify-center flex-shrink-0">
                          <ScriptIcon size={28} className="text-gray-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-white group-hover:text-cyber-green transition-colors truncate">
                              {script.name}
                            </h3>
                            <Badge variant={difficultyColors[script.difficulty]}>
                              {script.difficulty === 'easy' ? '入门' : script.difficulty === 'medium' ? '进阶' : '高级'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                            {script.description}
                          </p>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-xs text-cyber-blue">{script.language}</span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-400">{script.subcategory}</span>
                          </div>
                        </div>
                        <ChevronDown
                          size={20}
                          className={`text-gray-400 transition-transform flex-shrink-0 ${
                            selectedScript === script.id ? 'rotate-180' : ''
                          }`}
                        />
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {selectedScript === script.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t border-cyber-green/10 space-y-4">
                              {/* Features */}
                              <div>
                                <h4 className="text-sm font-medium text-cyber-green mb-2 flex items-center gap-2">
                                  <CheckCircle size={14} /> 主要功能
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {script.features.map((feature, i) => (
                                    <span key={i} className="text-xs px-2 py-1 bg-cyber-purple/30 text-gray-300 rounded">
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Requirements & Installation */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium text-cyber-blue mb-2 flex items-center gap-2">
                                    <Info size={14} /> 环境要求
                                  </h4>
                                  <ul className="text-xs text-gray-400 space-y-1">
                                    {script.requirements.map((req, i) => (
                                      <li key={i}>• {req}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-cyber-gold mb-2 flex items-center gap-2">
                                    <TerminalIcon size={14} /> 安装命令
                                  </h4>
                                  <div className="relative">
                                    <code className="text-xs bg-black/30 px-3 py-2 rounded block text-cyber-green break-all">
                                      {script.installation}
                                    </code>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(script.installation);
                                      }}
                                      className="absolute right-2 top-2 text-gray-400 hover:text-white"
                                    >
                                      <Copy size={14} />
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Usage */}
                              <div>
                                <h4 className="text-sm font-medium text-cyber-purple mb-2 flex items-center gap-2">
                                  <TerminalIcon size={14} /> 使用方法
                                </h4>
                                <div className="relative">
                                  <code className="text-xs bg-black/30 px-3 py-2 rounded block text-cyber-green break-all">
                                    {script.usage}
                                  </code>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigator.clipboard.writeText(script.usage);
                                    }}
                                    className="absolute right-2 top-2 text-gray-400 hover:text-white"
                                  >
                                    <Copy size={14} />
                                  </button>
                                </div>
                              </div>

                              {/* Steps */}
                              <div>
                                <h4 className="text-sm font-medium text-cyber-green mb-2 flex items-center gap-2">
                                  <BookOpen size={14} /> 详细操作步骤
                                </h4>
                                <div className="space-y-3">
                                  {script.steps.map((step, i) => (
                                    <div key={i} className="bg-cyber-purple/10 rounded-lg p-3">
                                      <div className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-cyber-green/20 flex items-center justify-center text-xs text-cyber-green flex-shrink-0">
                                          {i + 1}
                                        </span>
                                        <div className="flex-1">
                                          <h5 className="text-sm font-medium text-white mb-1">{step.title}</h5>
                                          <p className="text-xs text-gray-400 mb-2">{step.description}</p>
                                          {step.command && (
                                            <div className="relative">
                                              <code className="text-xs bg-black/30 px-2 py-1 rounded block text-cyber-green break-all">
                                                {step.command}
                                              </code>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  navigator.clipboard.writeText(step.command || '');
                                                }}
                                                className="absolute right-1 top-1 text-gray-400 hover:text-white"
                                              >
                                                <Copy size={12} />
                                              </button>
                                            </div>
                                          )}
                                          {step.note && (
                                            <p className="text-xs text-cyber-gold mt-1">💡 {step.note}</p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Tips */}
                              <div className="bg-cyber-gold/5 border border-cyber-gold/20 rounded-lg p-3">
                                <h4 className="text-sm font-medium text-cyber-gold mb-2 flex items-center gap-2">
                                  <Lightbulb size={14} /> 使用小贴士
                                </h4>
                                <ul className="space-y-1">
                                  {script.tips.map((tip, i) => (
                                    <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                      <span className="text-cyber-gold">•</span>
                                      {tip}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Warnings */}
                              <div className="bg-cyber-red/5 border border-cyber-red/20 rounded-lg p-3">
                                <h4 className="text-sm font-medium text-cyber-red mb-2 flex items-center gap-2">
                                  <AlertOctagon size={14} /> 安全警告
                                </h4>
                                <ul className="space-y-1">
                                  {script.warnings.map((warning, i) => (
                                    <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                      <span className="text-cyber-red">⚠</span>
                                      {warning}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Examples */}
                              {script.examples.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium text-cyber-blue mb-2 flex items-center gap-2">
                                    <FileCode size={14} /> 使用示例
                                  </h4>
                                  <div className="space-y-3">
                                    {script.examples.map((example, i) => (
                                      <div key={i} className="bg-black/20 rounded-lg p-3">
                                        <h5 className="text-xs font-medium text-white mb-2">{example.title}</h5>
                                        <div className="space-y-2">
                                          <div>
                                            <span className="text-xs text-gray-500">输入：</span>
                                            <code className="text-xs text-cyber-green block bg-black/30 px-2 py-1 rounded mt-1 break-all">
                                              {example.input}
                                            </code>
                                          </div>
                                          <div>
                                            <span className="text-xs text-gray-500">输出：</span>
                                            <pre className="text-xs text-gray-300 bg-black/30 px-2 py-1 rounded mt-1 whitespace-pre-wrap">
                                              {example.output}
                                            </pre>
                                          </div>
                                          <div className="text-xs text-gray-400 italic">
                                            💬 {example.explanation}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Tags */}
                              <div className="flex flex-wrap gap-2 pt-2">
                                {script.tags.map((tag, i) => (
                                  <span key={i} className="text-xs px-2 py-1 bg-cyber-purple/30 text-gray-400 rounded-full">
                                    #{tag}
                                  </span>
                                ))}
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

          {/* Info Box */}
          <Card className="bg-cyber-blue/5 border-cyber-blue/20">
            <div className="flex items-start gap-3">
              <Shield size={24} className="text-cyber-blue flex-shrink-0" />
              <div>
                <h3 className="font-medium text-cyber-blue mb-1">脚本使用须知</h3>
                <p className="text-sm text-gray-400">
                  所有脚本仅供学习和授权的安全测试使用。请遵守相关法律法规，不要对未授权的系统使用这些工具。
                  脚本仓库中的工具涵盖信息收集、漏洞检测、密码攻击、逆向工程等多个领域。
                </p>
              </div>
            </div>
          </Card>
        </>
      ) : activeTab === 'laws' ? (
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
              <p className="text-2xl font-bold text-white">
                {lawCategories.length}
              </p>
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
              >
                全部
              </button>
              {lawCategories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedLawCategory(cat.name)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedLawCategory === cat.name
                      ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/30'
                      : 'bg-cyber-purple/20 text-gray-400 border border-cyber-green/10 hover:text-white'
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
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
              .map((law) => {
                return (
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
                            <h3 className="font-medium text-white group-hover:text-cyber-green transition-colors">
                              {law.name}
                            </h3>
                            <Badge variant="blue">
                              {law.level}
                            </Badge>
                            <Badge variant="gold">
                              {law.subcategory}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                            {law.summary}
                          </p>
                          <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500">
                            <span>发布：{law.issueDate}</span>
                            <span>•</span>
                            <span>实施：{law.effectiveDate}</span>
                            <span>•</span>
                            <span>{law.issuingAuthority}</span>
                          </div>
                        </div>
                        <ChevronDown
                          size={20}
                          className={`text-gray-400 transition-transform flex-shrink-0 ${
                            selectedLaw === law.id ? 'rotate-180' : ''
                          }`}
                        />
                      </div>

                      {/* Expanded Law Content */}
                      <AnimatePresence>
                        {selectedLaw === law.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t border-cyber-green/10 space-y-4">
                              {/* Key Provisions */}
                              <div>
                                <h4 className="text-sm font-medium text-cyber-green mb-2 flex items-center gap-2">
                                  <CheckCircle size={14} /> 核心制度与关键规定
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {law.keyProvisions.map((provision, i) => (
                                    <span key={i} className="text-xs px-2 py-1 bg-cyber-purple/30 text-gray-300 rounded">
                                      {provision}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Important Clauses */}
                              {law.importantClauses.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium text-cyber-blue mb-2 flex items-center gap-2">
                                    <FileCode size={14} /> 重点条款解读
                                  </h4>
                                  <div className="space-y-3">
                                    {law.importantClauses.map((clause, i) => (
                                      <div key={i} className="bg-cyber-purple/10 rounded-lg p-3">
                                        <div className="text-xs font-medium text-cyber-green mb-1">
                                          {clause.clause}
                                        </div>
                                        <p className="text-xs text-gray-300 mb-2">
                                          {clause.content}
                                        </p>
                                        <p className="text-xs text-cyber-gold border-l-2 border-cyber-gold/30 pl-2 italic">
                                          💡 {clause.explanation}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Applicable Scope */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium text-cyber-blue mb-2 flex items-center gap-2">
                                    <Info size={14} /> 适用范围
                                  </h4>
                                  <ul className="text-xs text-gray-400 space-y-1">
                                    {law.applicableScope.map((scope, i) => (
                                      <li key={i}>• {scope}</li>
                                    ))}
                                  </ul>
                                </div>
                                {law.penalties.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-medium text-cyber-red mb-2 flex items-center gap-2">
                                      <AlertOctagon size={14} /> 法律责任
                                    </h4>
                                    <ul className="text-xs text-gray-400 space-y-1">
                                      {law.penalties.map((penalty, i) => (
                                        <li key={i}>• {penalty}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>

                              {/* Related Laws */}
                              {law.relatedLaws.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium text-cyber-purple mb-2 flex items-center gap-2">
                                    <ExternalLink size={14} /> 相关法规
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {law.relatedLaws.map((related, i) => (
                                      <span key={i} className="text-xs px-2 py-1 bg-cyber-blue/10 text-cyber-blue rounded-full">
                                        {related}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Tags */}
                              <div className="flex flex-wrap gap-2 pt-2">
                                {law.tags.map((tag, i) => (
                                  <span key={i} className="text-xs px-2 py-1 bg-cyber-purple/30 text-gray-400 rounded-full">
                                    #{tag}
                                  </span>
                                ))}
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
      ) : activeTab === 'emergency' ? (
        <>
          {/* Emergency Response Module */}
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
              <input
                type="text"
                placeholder="搜索应急场景、影响行业或处理步骤..."
                value={emergencySearchQuery}
                onChange={(e) => setEmergencySearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-cyber-purple/20 border border-cyber-green/20 rounded-lg focus:outline-none focus:border-cyber-green/50 text-white placeholder-gray-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedEmergencyCategory(null)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedEmergencyCategory === null
                    ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/30'
                    : 'bg-cyber-purple/20 text-gray-400 border border-cyber-green/10 hover:text-white'
                }`}
              >
                全部
              </button>
              {[...new Set(emergencyScenarios.map(s => s.category))].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedEmergencyCategory(cat)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedEmergencyCategory === cat
                      ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/30'
                      : 'bg-cyber-purple/20 text-gray-400 border border-cyber-green/10 hover:text-white'
                  }`}
                >
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
                    <Card
                      className={`cursor-pointer group transition-all duration-200 ${
                        selectedEmergency === scenario.id ? 'ring-2 ring-cyber-green/50' : ''
                      }`}
                      onClick={() => setSelectedEmergency(selectedEmergency === scenario.id ? null : scenario.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-lg bg-cyber-purple/60 flex items-center justify-center flex-shrink-0">
                          <AlertTriangle size={28} className={scenario.severity === 'critical' ? 'text-cyber-red' : 'text-cyber-gold'} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-medium text-white group-hover:text-cyber-green transition-colors">
                              {scenario.title}
                            </h3>
                            <Badge variant={severityColor}>
                              {scenario.severity === 'critical' ? '严重' : scenario.severity === 'high' ? '高危' : scenario.severity === 'medium' ? '中等' : '一般'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                            {scenario.overview}
                          </p>
                          <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500">
                            <span className="text-cyber-blue">{scenario.category}</span>
                            <span>•</span>
                            <span>影响：{scenario.impact}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {scenario.affectedSectors.slice(0, 3).map((sector, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 bg-cyber-purple/30 text-gray-300 rounded">
                                {sector}
                              </span>
                            ))}
                            {scenario.affectedSectors.length > 3 && (
                              <span className="text-xs px-2 py-0.5 bg-cyber-purple/30 text-gray-400 rounded">
                                +{scenario.affectedSectors.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronDown
                          size={20}
                          className={`text-gray-400 transition-transform flex-shrink-0 ${
                            selectedEmergency === scenario.id ? 'rotate-180' : ''
                          }`}
                        />
                      </div>

                      {/* Expanded Emergency Content */}
                      <AnimatePresence>
                        {selectedEmergency === scenario.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t border-cyber-green/10 space-y-4">
                              {/* Overview */}
                              <div className="bg-cyber-purple/10 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-cyber-green mb-2 flex items-center gap-2">
                                  <Info size={14} /> 事件概述
                                </h4>
                                <p className="text-sm text-gray-300">{scenario.overview}</p>
                              </div>

                              {/* Affected Sectors */}
                              <div>
                                <h4 className="text-sm font-medium text-cyber-blue mb-2 flex items-center gap-2">
                                  <Shield size={14} /> 适用行业
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {scenario.affectedSectors.map((sector, i) => (
                                    <span key={i} className="text-xs px-2 py-1 bg-cyber-blue/10 text-cyber-blue rounded">
                                      {sector}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Impact */}
                              <div>
                                <h4 className="text-sm font-medium text-cyber-red mb-2 flex items-center gap-2">
                                  <AlertOctagon size={14} /> 影响范围
                                </h4>
                                <p className="text-sm text-gray-300">{scenario.impact}</p>
                              </div>

                              {/* Response Phases */}
                              <div>
                                <h4 className="text-sm font-medium text-cyber-purple mb-2 flex items-center gap-2">
                                  <Activity size={14} /> 应急响应阶段
                                </h4>
                                <div className="space-y-3">
                                  {scenario.phases.map((phase, i) => (
                                    <div key={i} className="bg-cyber-purple/10 rounded-lg overflow-hidden">
                                      <div
                                        className="p-3 cursor-pointer flex items-center justify-between"
                                        onClick={() => setExpandedPhase(expandedPhase === `${scenario.id}-${i}` ? null : `${scenario.id}-${i}`)}
                                      >
                                        <div className="flex items-center gap-2">
                                          <span className="w-6 h-6 rounded-full bg-cyber-green/20 flex items-center justify-center text-xs text-cyber-green font-medium">
                                            {i + 1}
                                          </span>
                                          <div>
                                            <h5 className="text-sm font-medium text-white">{phase.phase}</h5>
                                            <p className="text-xs text-gray-500">{phase.duration}</p>
                                          </div>
                                        </div>
                                        <ChevronDown
                                          size={16}
                                          className={`text-gray-400 transition-transform ${expandedPhase === `${scenario.id}-${i}` ? 'rotate-180' : ''}`}
                                        />
                                      </div>
                                      <AnimatePresence>
                                        {expandedPhase === `${scenario.id}-${i}` && (
                                          <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: 'auto' }}
                                            exit={{ height: 0 }}
                                            className="overflow-hidden"
                                          >
                                            <div className="px-3 pb-3 space-y-3">
                                              {phase.actions.map((action, j) => (
                                                <div key={j} className="bg-black/20 rounded-lg p-3">
                                                  <div className="flex items-start gap-2 mb-2">
                                                    <span className="w-5 h-5 rounded-full bg-cyber-blue/20 flex items-center justify-center text-xs text-cyber-blue flex-shrink-0">
                                                      {action.step}
                                                    </span>
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
                                                          <code className="text-xs bg-black/50 px-2 py-1 rounded block text-cyber-green break-all">
                                                            {cmd.command}
                                                          </code>
                                                          {cmd.risk && (
                                                            <p className="text-xs text-cyber-red mt-1">⚠️ {cmd.risk}</p>
                                                          )}
                                                        </div>
                                                      ))}
                                                    </div>
                                                  )}
                                                  {action.responsible && (
                                                    <p className="text-xs text-gray-500 mt-2">
                                                      <span className="text-cyber-gold">负责人：</span>{action.responsible}
                                                    </p>
                                                  )}
                                                  {action.tools && action.tools.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                      {action.tools.map((tool, l) => (
                                                        <span key={l} className="text-xs px-2 py-0.5 bg-cyber-purple/30 text-gray-300 rounded">
                                                          {tool}
                                                        </span>
                                                      ))}
                                                    </div>
                                                  )}
                                                  {action.verification && (
                                                    <p className="text-xs text-cyber-green mt-2">
                                                      ✓ 验证：{action.verification}
                                                    </p>
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
                                  <h4 className="text-sm font-medium text-cyber-gold mb-2 flex items-center gap-2">
                                    <CheckCircle size={14} /> 应急检查清单
                                  </h4>
                                  {scenario.checklists.map((checklist, i) => (
                                    <div key={i} className="mb-3">
                                      <h5 className="text-xs font-medium text-white mb-2">{checklist.section}</h5>
                                      <div className="space-y-1">
                                        {checklist.items.map((item, j) => (
                                          <label key={j} className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer hover:text-white">
                                            <input
                                              type="checkbox"
                                              className="w-4 h-4 rounded border-cyber-green/30 bg-cyber-purple/20 text-cyber-green focus:ring-cyber-green/50"
                                            />
                                            <span className={`${
                                              item.priority === 'critical' ? 'text-cyber-red' :
                                              item.priority === 'high' ? 'text-cyber-gold' : 'text-gray-400'
                                            }`}>
                                              {item.item}
                                            </span>
                                            <Badge variant={
                                              item.priority === 'critical' ? 'red' :
                                              item.priority === 'high' ? 'gold' : 'green'
                                            }>
                                              {item.priority === 'critical' ? '紧急' :
                                               item.priority === 'high' ? '重要' : '一般'}
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
                                  <h4 className="text-sm font-medium text-cyber-purple mb-2 flex items-center gap-2">
                                    <TerminalIcon size={14} /> 应急脚本
                                  </h4>
                                  <div className="space-y-2">
                                    {scenario.scripts.map((script, i) => (
                                      <div key={i} className="bg-cyber-purple/10 rounded-lg overflow-hidden">
                                        <div
                                          className="p-3 cursor-pointer flex items-center justify-between"
                                          onClick={() => setExpandedScript(expandedScript === `${scenario.id}-script-${i}` ? null : `${scenario.id}-script-${i}`)}
                                        >
                                          <div className="flex items-center gap-2">
                                            <Code size={14} className="text-cyber-purple" />
                                            <span className="text-sm text-white">{script.name}</span>
                                            <Badge variant="blue">{script.platform}</Badge>
                                          </div>
                                          <ChevronDown
                                            size={16}
                                            className={`text-gray-400 transition-transform ${expandedScript === `${scenario.id}-script-${i}` ? 'rotate-180' : ''}`}
                                          />
                                        </div>
                                        <AnimatePresence>
                                          {expandedScript === `${scenario.id}-script-${i}` && (
                                            <motion.div
                                              initial={{ height: 0 }}
                                              animate={{ height: 'auto' }}
                                              exit={{ height: 0 }}
                                              className="overflow-hidden"
                                            >
                                              <div className="px-3 pb-3">
                                                <p className="text-xs text-gray-400 mb-2">{script.description}</p>
                                                <div className="relative">
                                                  <pre className="text-xs bg-black/50 px-3 py-2 rounded text-cyber-green overflow-x-auto">
                                                    <code>{script.content}</code>
                                                  </pre>
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      navigator.clipboard.writeText(script.content);
                                                    }}
                                                    className="absolute right-2 top-2 text-gray-400 hover:text-white p-1"
                                                  >
                                                    <Copy size={14} />
                                                  </button>
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
                                  <h4 className="text-sm font-medium text-cyber-blue mb-2 flex items-center gap-2">
                                    <Lightbulb size={14} /> 真实案例
                                  </h4>
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
                                            <li key={k} className="text-xs text-gray-300 flex items-start gap-2">
                                              <span className="text-cyber-red">•</span>
                                              {lesson}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
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
      ) : null}
    </div>
  );
};

export default CodeLab;
