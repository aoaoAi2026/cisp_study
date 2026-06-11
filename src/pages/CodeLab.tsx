import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Code,
  Play,
  CheckCircle,
  Clock,
  ChevronRight,
  Lock,
  Zap,
  Shield,
  Database,
  Network,
  Terminal
} from 'lucide-react';
import { useLearningStore, useAchievementStore } from '../store';
import { experiments } from '../data/learningData';
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
};

export const CodeLab: React.FC = () => {
  const navigate = useNavigate();
  const { completedLabs, completeLab } = useLearningStore();
  const { checkAndUnlockBadge } = useAchievementStore();
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null);

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
          通过动手实验深入理解安全概念，所有实验都在安全模拟环境中进行
        </p>
      </div>

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
    </div>
  );
};

export default CodeLab;
