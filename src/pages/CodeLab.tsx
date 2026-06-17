import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, AlertTriangle, Terminal as TerminalIcon, Package,
} from 'lucide-react';
import { securityScripts } from '../data/securityScripts';
import { laws } from '../data/laws';
import { emergencyScenarios } from '../data/emergencyResponse';
import { ExperimentTab } from './CodeLab/ExperimentTab';
import { ScriptsTab } from './CodeLab/ScriptsTab';
import { LawsTab } from './CodeLab/LawsTab';
import { EmergencyTab } from './CodeLab/EmergencyTab';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export const CodeLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'experiments' | 'scripts' | 'laws' | 'emergency'>('experiments');

  const tabDefs = [
    { id: 'experiments' as const, Icon: TerminalIcon, label: '代码实验' },
    { id: 'scripts' as const, Icon: Package, label: `脚本仓库 (${securityScripts.length})` },
    { id: 'laws' as const, Icon: BookOpen, label: `法律法规 (${laws.length})` },
    { id: 'emergency' as const, Icon: AlertTriangle, label: `应急处理 (${emergencyScenarios.length})` },
  ];

  const tabDescriptions: Record<string, string> = {
    experiments: '通过动手实验深入理解安全概念，所有实验都在安全模拟环境中进行',
    scripts: '网络安全脚本仓库，提供详细的操作步骤和使用说明',
    laws: '网络安全相关法律法规与等级保护制度知识学习',
    emergency: '网络安全应急处理方案，包含勒索病毒、漏洞利用、系统崩溃等各类安全事件的详细处理流程',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-orbitron text-2xl font-bold text-cyber-green">代码实验室</h1>
        <p className="text-gray-400 mt-1">{tabDescriptions[activeTab]}</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-4 border-b border-cyber-green/20">
        {tabDefs.map(({ id, Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === id ? 'text-cyber-green border-b-2 border-cyber-green' : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon size={18} />
              {label}
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div key={activeTab} variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
        {activeTab === 'experiments' && <ExperimentTab />}
        {activeTab === 'scripts' && <ScriptsTab />}
        {activeTab === 'laws' && <LawsTab />}
        {activeTab === 'emergency' && <EmergencyTab />}
      </motion.div>
    </div>
  );
};

export default CodeLab;
