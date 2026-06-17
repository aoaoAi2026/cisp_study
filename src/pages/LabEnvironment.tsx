import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/UI';
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

export const LabEnvironment: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string>('xss');

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
      <div>
        <h1 className="font-orbitron text-2xl font-bold text-cyber-green">安全实验环境</h1>
        <p className="text-gray-400 mt-1">11个交互式安全实验模块，覆盖Web安全、密码学、网络攻击等领域</p>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {LAB_MODULES.map(mod => (
          <motion.button
            key={mod.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveModule(mod.id)}
            className={`
              p-4 rounded-xl border text-left transition-all
              ${activeModule === mod.id
                ? `${mod.bgColor} ${mod.borderColor} shadow-lg`
                : 'bg-cyber-purple/10 border-cyber-purple/20 hover:bg-cyber-purple/20'
              }
            `}
          >
            <div className="mb-2" style={{ color: activeModule === mod.id ? mod.color : '#888' }}>
              {mod.icon}
            </div>
            <h3 className={`text-sm font-medium mb-1 ${activeModule === mod.id ? 'text-white' : 'text-gray-400'}`}>
              {mod.name}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-2">{mod.description}</p>
          </motion.button>
        ))}
      </div>

      {/* Active Module Content */}
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
  );
};

export default LabEnvironment;
