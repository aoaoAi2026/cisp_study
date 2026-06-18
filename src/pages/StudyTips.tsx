import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Lightbulb,
  BookOpen,
  Brain,
  Target,
  Clock,
  Zap,
  CheckCircle,
  Coffee,
  Music,
  DollarSign,
  Smile,
  Dumbbell,
  Moon,
  Eye
} from 'lucide-react';
import { Card, Badge } from '../components/UI';
import { ParticleBackground } from '../components/UI/ParticleBackground';

interface Tip {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  summary: string;
  content: { heading: string; points: string[] }[];
}

const studyTips: Tip[] = [
  {
    id: '1',
    title: '艾宾浩斯遗忘曲线复习法',
    icon: Brain,
    color: '#00ff88',
    summary: '科学安排复习间隔，让记忆更牢固',
    content: [
      {
        heading: '什么是遗忘曲线？',
        points: [
          '德国心理学家艾宾浩斯发现，学习后的遗忘是有规律的：最初遗忘速度最快，之后逐渐减慢',
          '学习 20 分钟后，遗忘约 42%；1 小时后遗忘约 56%；1 天后遗忘约 74%',
          '如果在关键节点及时复习，可大幅降低遗忘率，形成长期记忆'
        ]
      },
      {
        heading: '最佳复习间隔',
        points: [
          '第 1 次：学习结束后 5-10 分钟快速回顾',
          '第 2 次：当天晚上或次日早上',
          '第 3 次：1 周后（第 7 天）',
          '第 4 次：1 个月后（第 30 天）',
          '第 5 次：3-6 个月后（周期性回顾）'
        ]
      },
      {
        heading: 'CISP 学习应用',
        points: [
          '每天学习新知识后，睡前花 10 分钟回顾当天要点',
          '每周日回顾本周所有内容，制作思维导图',
          '每月底进行一次综合测试，检验学习效果',
          '易错题建立错题本，定期重做直到掌握'
        ]
      }
    ]
  },
  {
    id: '2',
    title: '番茄钟工作法',
    icon: Clock,
    color: '#00d4ff',
    summary: '25 分钟专注 + 5 分钟休息，持续高效',
    content: [
      {
        heading: '基本规则',
        points: [
          '每个番茄时间为 25 分钟，专注做一件事',
          '25 分钟结束后，休息 5 分钟',
          '每完成 4 个番茄钟，休息 15-30 分钟',
          '一个番茄钟不可分割，中途被打断则作废重来'
        ]
      },
      {
        heading: 'CISP 学习时间规划',
        points: [
          '每天安排 4-6 个番茄钟学习（2-3 小时）',
          '2 个番茄钟学习新知识，1 个做练习题，1 个回顾总结',
          '利用通勤等碎片时间听音频或看笔记',
          '学习高峰期（通常早晨或晚上）安排最难内容'
        ]
      },
      {
        heading: '常见干扰应对',
        points: [
          '手机静音或放在另一个房间',
          '关闭社交媒体和消息通知',
          '如果突然想起其他事情，写在纸上后立即回到学习',
          '保持充足睡眠，不要在困倦时强行学习'
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'SQ3R 阅读法',
    icon: BookOpen,
    color: '#ffd700',
    summary: '主动阅读五步法：Survey Question Read Recite Review',
    content: [
      {
        heading: 'S - Survey（浏览）',
        points: [
          '快速浏览章节标题、图表、摘要和关键词',
          '了解整体结构和主要内容，建立框架感',
          '用时：5-10 分钟',
          '目的：形成预期，准备接收信息'
        ]
      },
      {
        heading: 'Q - Question（提问）',
        points: [
          '将标题转换为问题："什么是 CIA 三要素？"',
          '思考自己已知道什么，想知道什么',
          '激发好奇心，让阅读更有目标',
          '用时：3-5 分钟'
        ]
      },
      {
        heading: 'R - Read（阅读）',
        points: [
          '带着问题仔细阅读，寻找答案',
          '标记关键词和核心概念',
          '遇到不理解的地方先跳过，读完后再回看',
          '专注主动阅读，不要被动扫读'
        ]
      },
      {
        heading: 'R - Recite（复述）',
        points: [
          '读完一节后，用自己的话复述主要内容',
          '尝试回答之前提出的问题',
          '如果不能复述，回去重读重点',
          '口头或书面复述都可以'
        ]
      },
      {
        heading: 'R - Review（复习）',
        points: [
          '回顾整个章节，翻看标记的要点',
          '在思维导图上记录核心观点',
          '做相关练习题巩固理解',
          '24 小时内复习一次效果最佳'
        ]
      }
    ]
  },
  {
    id: '4',
    title: '费曼学习法',
    icon: Zap,
    color: '#ff6b35',
    summary: '用简单语言讲解复杂概念，检验是否真正理解',
    content: [
      {
        heading: '什么是费曼学习法？',
        points: [
          '由物理学家理查德·费曼提出，核心是"如果你无法简单解释，就没有真正理解"',
          '通过教别人来学习，是最有效的学习方法之一',
          '特别适合理解 CISP 中的概念性知识，如 CIA 三要素、访问控制模型等'
        ]
      },
      {
        heading: '四个步骤',
        points: [
          '1. 选择一个概念，写在纸的顶部',
          '2. 用简单的语言解释这个概念，想象你在教一个完全不懂的人',
          '3. 发现自己卡壳或解释不清的地方，回到资料重新学习',
          '4. 简化语言，使用类比和比喻，让解释更简洁有力'
        ]
      },
      {
        heading: 'CISP 学习应用举例',
        points: [
          '"如何向奶奶解释什么是 PKI？" → 把 PKI 比作身份证系统，CA 是公安局，证书是身份证',
          '"如何用一句话解释 RBAC？" → 你是什么角色，就有什么权限',
          '每周选 3 个核心概念，使用费曼方法解释一遍',
          '可以在学习小组中互相讲解，效果倍增'
        ]
      }
    ]
  },
  {
    id: '5',
    title: '思维导图构建知识体系',
    icon: Target,
    color: '#ff3366',
    summary: '将零散知识点连成网络，构建完整知识体系',
    content: [
      {
        heading: '为什么要用思维导图？',
        points: [
          '符合大脑的网状思维方式，而非线性',
          '帮助建立知识之间的联系，形成体系',
          '可视化知识结构，方便快速回顾',
          'CISP 有 10 个知识域，需要系统化整合'
        ]
      },
      {
        heading: '制作方法',
        points: [
          '中心主题写在中间（如"访问控制"）',
          '向外辐射主要分支：认证技术、授权模型、管理方法等',
          '继续细分具体知识点：密码、生物识别、RBAC、DAC...',
          '使用图标、颜色、符号增强记忆效果',
          '工具推荐：XMind、MindManager、幕布、纸笔手绘'
        ]
      },
      {
        heading: 'CISP 学习建议',
        points: [
          '每个知识域制作一张思维导图',
          '每周学习后更新和完善导图',
          '考前看导图回忆，比逐页翻书效率高 3 倍',
          '用不同颜色标注掌握程度：绿色-熟练、黄色-模糊、红色-薄弱'
        ]
      }
    ]
  },
  {
    id: '6',
    title: '记忆宫殿法',
    icon: Eye,
    color: '#9b59b6',
    summary: '利用空间记忆，高效记住抽象概念和数据',
    content: [
      {
        heading: '原理',
        points: [
          '人类对空间位置的记忆能力远超对抽象信息的记忆',
          '将需要记忆的内容与熟悉的空间（如你的家）联系起来',
          '通过想象在空间中"放置"信息，回忆时"漫步"空间即可提取',
          '古希腊罗马演讲家使用此方法记住长篇演讲内容'
        ]
      },
      {
        heading: '操作步骤',
        points: [
          '1. 选择一个熟悉的空间（你的房间、上班路线）',
          '2. 在脑中确定 10 个具体的位置点（门、床、桌子、窗户...）',
          '3. 将需要记忆的信息与每个位置建立生动的联想',
          '4. 想象自己依次经过每个位置，回忆对应的信息',
          '5. 联想越夸张、越有趣，记忆效果越好'
        ]
      },
      {
        heading: 'CISP 应用',
        points: [
          '记住 ISO 27001、等级保护等核心标准的要点',
          '记住各知识域的权重和主要内容',
          '记住常用端口号（21-FTP, 22-SSH, 80-HTTP, 443-HTTPS...）',
          '记住加密算法分类和典型代表'
        ]
      }
    ]
  },
  {
    id: '7',
    title: '健康学习习惯',
    icon: Dumbbell,
    color: '#1abc9c',
    summary: '身体是学习的本钱，健康习惯提升学习效率',
    content: [
      {
        heading: '运动与学习',
        points: [
          '每天 30 分钟有氧运动（跑步、游泳、骑行），提升大脑供血和认知能力',
          '学习间隙做简单伸展运动，促进血液循环',
          '运动后学习新内容，记忆效果提升约 20%',
          '避免久坐，每小时起身活动 5 分钟'
        ]
      },
      {
        heading: '睡眠与记忆',
        points: [
          '睡眠时大脑会整理和巩固当天的记忆',
          '保证 7-8 小时睡眠，避免熬夜学习',
          '睡前 10 分钟回顾当天要点，醒来后回忆一次',
          '避免睡前使用电子设备，蓝光影响睡眠质量'
        ]
      },
      {
        heading: '营养与大脑',
        points: [
          '早餐必不可少，蛋白质和碳水化合物合理搭配',
          '多吃富含 Omega-3 的食物：三文鱼、核桃、亚麻籽',
          '多喝水，轻度脱水就会影响注意力和记忆力',
          '避免高糖饮食导致的血糖波动和犯困'
        ]
      }
    ]
  },
  {
    id: '8',
    title: '应试技巧',
    icon: CheckCircle,
    color: '#e74c3c',
    summary: '掌握答题方法，让实力充分发挥',
    content: [
      {
        heading: '答题策略',
        points: [
          '快速浏览整张试卷，了解题目分布和难度',
          '先做易题，保证拿到该拿的分数，再攻克难题',
          '注意时间分配，不要在某道题上耗时过长',
          '选择题：先排除明显错误选项，再在剩余选项中判断'
        ]
      },
      {
        heading: '审题技巧',
        points: [
          '仔细阅读题干，注意关键词："不包括"、"错误的是"、"最重要的"等',
          '画出题干中的关键信息，避免因粗心丢分',
          '注意题目中包含的否定词，容易看错',
          '所有选项都要看，不要看到一个正确的就急于选择'
        ]
      },
      {
        heading: '常见陷阱',
        points: [
          '"绝对化选项"要警惕：全部、一定、必须、从不...往往是错误的',
          '"以偏概全"：部分正确不等于整体正确',
          '"正确但无关"：选项本身正确但与题干无关',
          '两个相似选项往往暗示答案就在其中',
          '知识点记忆要准确，模糊不清时容易被干扰项误导'
        ]
      },
      {
        heading: '考试心态',
        points: [
          '考前保持良好作息，不要临时抱佛脚到最后一刻',
          '深呼吸缓解紧张，相信自己的准备',
          '遇到不会的题不慌，先跳过，后面再回来',
          '相信第一直觉，没有充分理由不要轻易修改答案'
        ]
      }
    ]
  },
  {
    id: '9',
    title: '学习计划制定',
    icon: Target,
    color: '#3498db',
    summary: '制定科学计划，让每天的学习都有明确目标',
    content: [
      {
        heading: '目标设定 SMART 原则',
        points: [
          'S - Specific 具体：明确学习什么，不要说"学信息安全"，要说"学完访问控制知识域"',
          'M - Measurable 可衡量：用题目的正确率、完成的章节数衡量',
          'A - Achievable 可达成：目标要现实，不能一天想读完一本书',
          'R - Relevant 相关：与考试内容直接相关',
          'T - Time-bound 有时限：明确完成时间'
        ]
      },
      {
        heading: '90 天学习计划模板',
        points: [
          '第 1-4 周：基础入门，通读教材，建立整体认知',
          '第 5-8 周：分模块深度学习，每个知识域详细学习 + 做题',
          '第 9-11 周：强化练习，做历年真题和模拟考试',
          '第 12 周：查漏补缺，回顾错题，调整状态',
          '根据自己的时间调整节奏，重要的是坚持'
        ]
      },
      {
        heading: '执行与调整',
        points: [
          '每周日花 30 分钟规划下周学习内容',
          '每天学习前花 5 分钟明确当日目标',
          '每周做一次小复盘：学了什么？掌握得如何？下周如何调整？',
          '如果某周进度落后，不要焦虑，重新规划即可',
          '关键是持续行动，每天进步一点点'
        ]
      }
    ]
  },
  {
    id: '10',
    title: '动机与坚持',
    icon: Smile,
    color: '#ff9ff3',
    summary: '保持学习热情，让坚持成为习惯',
    content: [
      {
        heading: '为什么会放弃？',
        points: [
          '目标太大，短期看不到成果，产生挫败感',
          '学习方法不当，越学越困惑',
          '缺乏即时反馈和激励',
          '生活中其他事情分散精力',
          '过度消耗意志力，产生倦怠'
        ]
      },
      {
        heading: '保持动力的方法',
        points: [
          '明确学习 CISP 的初衷：职业发展？知识提升？时常回顾这个动机',
          '将大目标分解为小任务，每次完成都有成就感',
          '使用学习日记记录进度，回看时能看到自己的成长',
          '加入学习社群，和同学一起学，互相鼓励',
          '设置奖励机制：完成阶段目标后给自己一个奖励'
        ]
      },
      {
        heading: '应对学习低谷',
        points: [
          '状态不好时不要硬撑，适当休息后效率更高',
          '换一种学习方式：从看书改为看视频、做题、讨论',
          '回顾最初的目标，找回最初的热情',
          '和考过 CISP 的人交流，获得经验和信心',
          '记住：学习曲线必然有低谷，这是正常的，跨过去就会再上台阶'
        ]
      }
    ]
  }
];

export const StudyTips: React.FC = () => {
  const [activeTip, setActiveTip] = useState<string | null>('1');

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 space-y-6 py-8"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyber-green/10 border border-cyber-green/30 mb-4">
            <Lightbulb className="w-8 h-8 text-cyber-green" />
          </div>
          <h1 className="font-orbitron text-3xl font-bold text-white mb-2">
            学习技巧与方法
          </h1>
          <p className="text-gray-400">掌握科学方法，让学习事半功倍</p>
        </motion.div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {studyTips.map((tip, index) => {
            const Icon = tip.icon;
            const isActive = activeTip === tip.id;
            return (
              <motion.div
                key={tip.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05 * index }}
              >
                <button
                  onClick={() => setActiveTip(isActive ? null : tip.id)}
                  className={`w-full text-left p-5 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-gradient-to-br from-cyber-purple/30 to-cyber-blue/20 border-cyber-green/50 shadow-lg shadow-cyber-green/10'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${tip.color}20`, border: `1px solid ${tip.color}40` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: tip.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg mb-1">{tip.title}</h3>
                      <p className="text-sm text-gray-400">{tip.summary}</p>
                    </div>
                    <Badge variant="blue" className="text-xs">方法 {index + 1}</Badge>
                  </div>

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6 pt-6 border-t border-white/10 space-y-6"
                    >
                      {tip.content.map((section, i) => (
                        <div key={i}>
                          <h4 className="font-bold text-cyber-green mb-3 flex items-center gap-2">
                            <span
                              className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                              style={{ backgroundColor: `${tip.color}30` }}
                            >
                              {i + 1}
                            </span>
                            {section.heading}
                          </h4>
                          <div className="space-y-2 ml-2">
                            {section.points.map((point, j) => (
                              <div key={j} className="flex items-start gap-3 text-sm text-gray-300">
                                <CheckCircle className="w-4 h-4 text-cyber-green flex-shrink-0 mt-0.5" />
                                <span>{point}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Tips Summary */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-cyber-purple/30 to-cyber-green/10 border-cyber-green/30">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyber-yellow" />
              每日学习清单
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-8 h-8 rounded-lg bg-cyber-green/20 flex items-center justify-center">
                    <Coffee className="w-4 h-4 text-cyber-green" />
                  </div>
                  <span>早晨 30 分钟：学习 1-2 个新知识点</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-8 h-8 rounded-lg bg-cyber-blue/20 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-cyber-blue" />
                  </div>
                  <span>白天：做 20-30 道练习题</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-8 h-8 rounded-lg bg-cyber-yellow/20 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-cyber-yellow" />
                  </div>
                  <span>晚上 15 分钟：回顾当天要点</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-8 h-8 rounded-lg bg-cyber-pink/20 flex items-center justify-center">
                    <Music className="w-4 h-4 text-cyber-pink" />
                  </div>
                  <span>碎片时间：收听音频或看笔记</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-8 h-8 rounded-lg bg-purple-400/20 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-purple-400" />
                  </div>
                  <span>每周日：周总结 + 思维导图更新</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-8 h-8 rounded-lg bg-orange-400/20 flex items-center justify-center">
                    <Moon className="w-4 h-4 text-orange-400" />
                  </div>
                  <span>保证 7 小时睡眠，身体是学习的本钱</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Motivation */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center py-8"
        >
          <div className="text-2xl text-gray-400 font-light italic">
            "学习不是为了应付考试，而是为了成为更好的自己。"
          </div>
          <div className="text-sm text-gray-600 mt-2">—— 每一个坚持学习的人</div>
        </motion.div>
      </motion.div>
    </div>
  );
};
