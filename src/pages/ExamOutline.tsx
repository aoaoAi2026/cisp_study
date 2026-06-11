import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Clock,
  FileText,
  Target,
  Zap,
  AlertCircle,
  Shield,
  Lock,
  Gavel,
  Wrench,
  BarChart3
} from 'lucide-react';
import { Card, Badge } from '../components/UI';
import { ParticleBackground } from '../components/UI/ParticleBackground';

const knowledgeDomains = [
  {
    id: 'domain-1',
    title: '信息安全保障',
    weight: '10%',
    description: '信息安全基本概念、保障框架、信息安全管理体系(ISMS)',
    color: '#00ff88',
    icon: Shield,
    topics: [
      '信息安全基本概念与目标（CIA三元组）',
      '信息安全发展阶段与威胁演变',
      '信息安全保障框架（IATF、等保2.0）',
      '信息安全管理体系(ISMS)与PDCA循环',
      'ISO 27000系列标准体系',
      'GB/T 22080/22081标准',
      '信息安全治理与风险管理',
      '纵深防御与分层保护机制'
    ]
  },
  {
    id: 'domain-2',
    title: '信息安全技术',
    weight: '40%',
    description: '网络安全、操作系统安全、应用安全、数据安全、密码学',
    color: '#00d4ff',
    icon: Lock,
    topics: [
      '密码学基础：对称/非对称加密、哈希函数、数字签名',
      '国密算法：SM2/SM3/SM4/SM9',
      'PKI体系与数字证书',
      '网络安全：防火墙、IDS/IPS、VPN、WAF',
      '网络协议安全：TCP/IP、SSL/TLS、DNS/ARP安全',
      '无线网络安全：WPA3、物联网安全',
      '操作系统安全：Windows/Linux加固、权限管理',
      '数据库安全：审计、权限控制、加密',
      '应用安全：OWASP Top 10、SQL注入、XSS、CSRF',
      '移动应用安全：APP加固、隐私合规',
      '数据安全：分类分级、DLP、加密脱敏、API安全',
      '云安全：云等保、容器安全、Serverless安全',
      '工控安全：PLC协议、OPC UA防护'
    ]
  },
  {
    id: 'domain-3',
    title: '信息安全管理',
    weight: '30%',
    description: '安全策略、风险管理、安全运营、应急响应、合规审计',
    color: '#ffd700',
    icon: BarChart3,
    topics: [
      '安全策略制定、实施与审计',
      '风险评估方法：定性/定量分析、FAIR框架',
      '风险处置策略：规避、降低、转移、接受',
      '业务连续性管理(BCM)与灾难恢复(DRP)',
      '安全运营：SOC平台、SIEM、日志分析',
      '应急响应：NIST SP 800-61、六步流程',
      '漏洞管理：扫描-评估-修复-验证',
      '安全监控与事件处置',
      '人员安全管理与安全意识培训',
      '供应链安全与第三方风险管理',
      '零信任架构运营核心原则'
    ]
  },
  {
    id: 'domain-4',
    title: '信息安全法规与标准',
    weight: '10%',
    description: '国内法律法规、国际标准、行业规范、合规审计',
    color: '#ff3366',
    icon: Gavel,
    topics: [
      '《网络安全法》核心条款与义务',
      '《数据安全法》数据分类分级保护',
      '《个人信息保护法》处理规则与权利',
      '《关键信息基础设施安全保护条例》',
      '《密码法》商用密码管理',
      '等级保护2.0：定级-备案-建设-测评-监督',
      'ISO 27001/27002标准',
      'GDPR与数据跨境传输',
      'NIST网络安全框架',
      'PCI-DSS支付卡行业规范',
      '金融行业安全要求',
      '网络安全审查与数据出境安全评估'
    ]
  },
  {
    id: 'domain-5',
    title: '安全工程与运营',
    weight: '10%',
    description: '安全架构设计、SDL、渗透测试、安全评估',
    color: '#9b59b6',
    icon: Wrench,
    topics: [
      '安全架构设计：TOGAF、SABSA方法论',
      '安全开发生命周期(SDL)',
      '威胁建模：STRIDE方法',
      '安全编码规范与代码审计(SAST/DAST)',
      '第三方组件风险管理(SBOM)',
      '渗透测试流程与方法论',
      '漏洞扫描工具：Nessus、OpenVAS',
      '安全评估：基线评估、差距评估、专项评估',
      '测试工具：Kali Linux、Metasploit、Burp Suite',
      '安全测试报告编写',
      'APT攻击特征与防御',
      '红队攻击链构建（Recon→Exploit→Post-exploitation）'
    ]
  }
];

export const ExamOutline: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>('domain-1');
  const [progress, setProgress] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleProgress = (id: string) => {
    const newProgress = new Set(progress);
    if (newProgress.has(id)) {
      newProgress.delete(id);
    } else {
      newProgress.add(id);
    }
    setProgress(newProgress);
  };

  const totalTopics = knowledgeDomains.reduce((acc, d) => acc + d.topics.length, 0);
  const completedTopics = progress.size;
  const progressPercent = (completedTopics / totalTopics) * 100;

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 space-y-6"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center py-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyber-green/10 border border-cyber-green/30 mb-4">
            <BookOpen className="w-8 h-8 text-cyber-green" />
          </div>
          <h1 className="font-orbitron text-3xl font-bold text-white mb-2">
            CISP 考试大纲
          </h1>
          <p className="text-gray-400">2024/2025最新版 · 五大知识域 · 助你系统备考</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="text-center">
            <Target className="w-8 h-8 text-cyber-green mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">5</div>
            <div className="text-sm text-gray-400">知识域</div>
          </Card>
          <Card className="text-center">
            <FileText className="w-8 h-8 text-cyber-blue mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{totalTopics}</div>
            <div className="text-sm text-gray-400">知识点</div>
          </Card>
          <Card className="text-center">
            <Clock className="w-8 h-8 text-cyber-yellow mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">120</div>
            <div className="text-sm text-gray-400">考试分钟</div>
          </Card>
          <Card className="text-center">
            <CheckCircle className="w-8 h-8 text-cyber-pink mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{progressPercent.toFixed(0)}%</div>
            <div className="text-sm text-gray-400">复习进度</div>
          </Card>
        </motion.div>

        {/* Exam Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-cyber-yellow flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-white mb-2">考试信息（2024/2025最新版）</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">考试形式：</span>
                    <span className="text-white">线下机考（闭卷）</span>
                  </div>
                  <div>
                    <span className="text-gray-400">考试时间：</span>
                    <span className="text-white">120分钟</span>
                  </div>
                  <div>
                    <span className="text-gray-400">题目数量：</span>
                    <span className="text-white">100道选择题（含20道多选）</span>
                  </div>
                  <div>
                    <span className="text-gray-400">及格分数：</span>
                    <span className="text-cyber-green">70分</span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  发证机构：中国信息安全测评中心（CNITSEC）| 证书有效期：3年 | 免费补考：2次
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Weight Distribution */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <h3 className="font-bold text-white mb-4">知识域分值分布</h3>
            <div className="space-y-3">
              {knowledgeDomains.map((domain) => (
                <div key={domain.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{domain.title}</span>
                    <span className="text-cyber-green font-medium">{domain.weight}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: domain.weight }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: domain.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Knowledge Domains */}
        <div className="space-y-4">
          {knowledgeDomains.map((domain, index) => {
            const Icon = domain.icon;
            return (
              <motion.div
                key={domain.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="overflow-hidden">
                  <button
                    onClick={() => toggleExpand(domain.id)}
                    className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/5 transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${domain.color}20`, border: `1px solid ${domain.color}40` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: domain.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white">{domain.title}</h3>
                        <Badge variant="blue" className="text-xs">
                          分值 {domain.weight}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{domain.description}</p>
                    </div>
                    {expandedId === domain.id ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {expandedId === domain.id && (
                    <div className="border-t border-white/10">
                      <div className="p-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-3">核心知识点</h4>
                        <div className="grid gap-2">
                          {domain.topics.map((topic, idx) => {
                            const topicId = `${domain.id}-${idx}`;
                            const isCompleted = progress.has(topicId);
                            return (
                              <button
                                key={topicId}
                                onClick={() => toggleProgress(topicId)}
                                className={`
                                  flex items-center gap-3 p-3 rounded-lg text-left transition-all
                                  ${isCompleted
                                    ? 'bg-cyber-green/10 border border-cyber-green/30'
                                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                  }
                                `}
                              >
                                <CheckCircle
                                  className={`w-5 h-5 flex-shrink-0 ${isCompleted ? 'text-cyber-green' : 'text-gray-500'}`}
                                />
                                <span className={isCompleted ? 'text-cyber-green' : 'text-gray-300'}>
                                  {topic}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Tips */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-cyber-purple/50 to-cyber-blue/20 border-cyber-blue/30">
            <div className="flex items-start gap-4">
              <Zap className="w-6 h-6 text-cyber-yellow flex-shrink-0" />
              <div>
                <h3 className="font-bold text-white mb-2">2025备考建议</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• 重点攻克三大核心域：安全工程与运营(25%)、安全运营(25%)、安全管理(20%)，共占70%</li>
                  <li>• 关注2025新增考点：零信任架构运营、数据出境安全评估、关基设施防护</li>
                  <li>• 法律法规重点：《网络安全法》《数据安全法》《个人信息保护法》核心条款</li>
                  <li>• 技术实操：SOC平台日志分析、Splunk操作、云安全架构设计</li>
                  <li>• 渗透测试：红队攻击链构建、Log4j等漏洞绕过检测</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};
