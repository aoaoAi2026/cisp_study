import React from 'react';
import { motion } from 'framer-motion';
import { Play, Target } from 'lucide-react';
import { Card } from '../../components/UI';
import { ParticleBackground } from '../../components/UI/ParticleBackground';

interface MockExamWelcomeProps {
  questionCount: number;
  onStart: () => void;
}

export const MockExamWelcome: React.FC<MockExamWelcomeProps> = ({ questionCount, onStart }) => {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex items-center justify-center min-h-[70vh]"
      >
        <Card className="max-w-xl w-full p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center">
            <Target className="w-10 h-10 text-cyber-green" />
          </div>
          <h1 className="font-orbitron text-3xl font-bold text-white mb-4">
            CISP 模拟考试
          </h1>
          <p className="text-gray-400 mb-8">
            全真模拟考试环境，检验你的学习成果
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-cyber-green">{questionCount}</div>
              <div className="text-sm text-gray-400">题目数量</div>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-cyber-blue">30</div>
              <div className="text-sm text-gray-400">考试分钟</div>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-cyber-yellow">70%</div>
              <div className="text-sm text-gray-400">及格线</div>
            </div>
          </div>

          <div className="text-left mb-8 p-4 rounded-lg bg-cyber-purple/20 border border-cyber-purple/30">
            <h3 className="font-bold text-white mb-3">考试须知</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• 考试时间 30 分钟，超时自动交卷</li>
              <li>• 共 {questionCount} 道选择题，随机抽取</li>
              <li>• 答题过程中可随时返回修改答案</li>
              <li>• 每道题只有一个正确答案</li>
              <li>• 达到 70% 正确率为合格</li>
            </ul>
          </div>

          <button
            onClick={onStart}
            className="w-full py-4 rounded-lg bg-cyber-green text-white font-bold text-lg hover:bg-cyber-green/90 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            开始考试
          </button>
        </Card>
      </motion.div>
    </div>
  );
};
