import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Server,
  Play,
  Square,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  Shield,
  Terminal,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Zap,
  CheckCircle,
  XCircle,
  Copy,
  Check
} from 'lucide-react';
import { api } from '../api/client';
import { Card, Button } from '../components/UI';

interface ContainerInfo {
  id: string;
  name: string;
  description: string;
  port: number;
  url: string;
  dockerImage: string;
  difficulty: string;
  category: string;
  defaultLogin: string;
  features: string[];
  running: boolean;
  status: string;
}

interface LabTool {
  id: string;
  name: string;
  description: string;
  commands: { name: string; cmd: string; description: string }[];
  officialSite: string;
}

export const LabEnvironment: React.FC = () => {
  const [containers, setContainers] = useState<ContainerInfo[]>([]);
  const [tools, setTools] = useState<LabTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'containers' | 'tools'>('containers');
  const [expandedTool, setExpandedTool] = useState<string | null>(null);
  const [expandedContainer, setExpandedContainer] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [labData, toolsData] = await Promise.all([
        api.getLabList(),
        api.getLabTools(),
      ]);
      setContainers(labData.containers || []);
      setTools(toolsData.tools || []);
    } catch (e: any) {
      console.error(e);
      setMessage({ type: 'error', text: e.message || '加载失败' });
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async (containerId: string) => {
    setActionLoading(containerId);
    setMessage(null);
    try {
      const result = await api.startLab(containerId);
      setMessage({ type: result.success ? 'success' : 'error', text: result.message });
      setTimeout(() => loadData(), 2000);
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || '启动失败' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleStop = async (containerId: string) => {
    setActionLoading(containerId);
    setMessage(null);
    try {
      const result = await api.stopLab(containerId);
      setMessage({ type: result.success ? 'success' : 'error', text: result.message });
      setTimeout(() => loadData(), 2000);
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || '停止失败' });
    } finally {
      setActionLoading(null);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCmd(id);
      setTimeout(() => setCopiedCmd(null), 2000);
    });
  };

  const difficultyColor = (d: string) => {
    switch (d) {
      case '简单': return 'text-green-400 bg-green-400/10';
      case '中等': return 'text-yellow-400 bg-yellow-400/10';
      case '困难': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw size={32} className="animate-spin text-cyber-green" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-orbitron text-2xl font-bold text-cyber-green">
          实验环境管理
        </h1>
        <p className="text-gray-400 mt-1">
          部署和管理安全学习靶场环境，掌握主流安全工具使用方法
        </p>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            p-4 rounded-lg border flex items-center gap-3
            ${message.type === 'success'
              ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
            }
          `}
        >
          {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span>{message.text}</span>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <Server size={28} className="mx-auto mb-2 text-cyber-blue" />
          <p className="text-xl font-bold text-white">{containers.length}</p>
          <p className="text-xs text-gray-400">可用靶场</p>
        </Card>
        <Card className="text-center">
          <Play size={28} className="mx-auto mb-2 text-cyber-green" />
          <p className="text-xl font-bold text-white">
            {containers.filter((c) => c.running).length}
          </p>
          <p className="text-xs text-gray-400">运行中</p>
        </Card>
        <Card className="text-center">
          <Terminal size={28} className="mx-auto mb-2 text-cyber-gold" />
          <p className="text-xl font-bold text-white">{tools.length}</p>
          <p className="text-xs text-gray-400">安全工具</p>
        </Card>
        <Card className="text-center">
          <Shield size={28} className="mx-auto mb-2 text-cyber-purple" />
          <p className="text-xl font-bold text-white">
            {containers.reduce((sum, c) => sum + (c.features?.length || 0), 0)}
          </p>
          <p className="text-xs text-gray-400">漏洞类型</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-cyber-green/10">
        <button
          onClick={() => setActiveTab('containers')}
          className={`
            px-6 py-3 font-medium transition-colors border-b-2 -mb-px
            ${activeTab === 'containers'
              ? 'text-cyber-green border-cyber-green'
              : 'text-gray-400 border-transparent hover:text-white'
            }
          `}
        >
          <span className="flex items-center gap-2">
            <Server size={18} />
            Docker靶场
          </span>
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={`
            px-6 py-3 font-medium transition-colors border-b-2 -mb-px
            ${activeTab === 'tools'
              ? 'text-cyber-green border-cyber-green'
              : 'text-gray-400 border-transparent hover:text-white'
            }
          `}
        >
          <span className="flex items-center gap-2">
            <Terminal size={18} />
            安全工具
          </span>
        </button>
      </div>

      {/* Containers Tab */}
      {activeTab === 'containers' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {/* Docker Warning */}
          <Card className="bg-yellow-500/5 border-yellow-500/20">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-yellow-400 font-medium mb-1">环境要求</p>
                <p className="text-gray-400">
                  使用靶场需要先安装 Docker Desktop。启动命令：
                  <code className="mx-2 px-2 py-0.5 bg-cyber-purple/30 rounded text-cyber-green">
                    docker-compose up -d [容器名]
                  </code>
                  首次启动会自动下载镜像，请耐心等待。
                </p>
              </div>
            </div>
          </Card>

          {containers.map((container) => (
            <motion.div key={container.id} variants={itemVariants}>
              <Card
                className={`
                  ${container.running ? 'border-green-500/30' : ''}
                `}
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setExpandedContainer(
                      expandedContainer === container.id ? null : container.id
                    )
                  }
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`
                        w-12 h-12 rounded-lg flex items-center justify-center
                        ${container.running
                          ? 'bg-green-500/20'
                          : 'bg-cyber-purple/60'
                        }
                      `}
                    >
                      <Server
                        size={24}
                        className={container.running ? 'text-green-400' : 'text-gray-300'}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium text-white">{container.name}</h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${difficultyColor(
                            container.difficulty
                          )}`}
                        >
                          {container.difficulty}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            container.running
                              ? 'text-green-400 bg-green-400/10'
                              : 'text-gray-400 bg-gray-400/10'
                          }`}
                        >
                          {container.running ? '运行中' : '已停止'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{container.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {container.running && (
                      <a
                        href={container.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs px-3 py-2 rounded-lg bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30 hover:bg-cyber-blue/30 transition-colors flex items-center gap-1"
                      >
                        <ExternalLink size={14} />
                        访问
                      </a>
                    )}
                    {container.running ? (
                      <Button
                        variant="danger"
                        size="sm"
                        icon={Square}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStop(container.id);
                        }}
                        loading={actionLoading === container.id}
                      >
                        停止
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        icon={Play}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStart(container.id);
                        }}
                        loading={actionLoading === container.id}
                      >
                        启动
                      </Button>
                    )}
                    {expandedContainer === container.id ? (
                      <ChevronDown size={20} className="text-gray-400" />
                    ) : (
                      <ChevronRight size={20} className="text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedContainer === container.id && (
                  <div className="mt-4 pt-4 border-t border-cyber-green/10 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-cyber-green mb-2">
                          基本信息
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">端口</span>
                            <span className="text-gray-300">{container.port}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">访问地址</span>
                            <span className="text-cyber-blue">{container.url}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">分类</span>
                            <span className="text-gray-300">{container.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">默认账号</span>
                            <span className="text-yellow-400">{container.defaultLogin}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Docker镜像</span>
                            <span className="text-gray-300 text-xs">{container.dockerImage}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-cyber-green mb-2">
                          覆盖漏洞类型
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {container.features.map((f) => (
                            <span
                              key={f}
                              className="text-xs px-2 py-1 rounded bg-cyber-purple/30 text-gray-300"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Tools Tab */}
      {activeTab === 'tools' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <Card className="bg-cyber-blue/5 border-cyber-blue/20">
            <div className="flex items-start gap-3">
              <BookOpen size={20} className="text-cyber-blue flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-cyber-blue font-medium mb-1">学习提示</p>
                <p className="text-gray-400">
                  以下是渗透测试和安全审计中常用的工具。点击每个工具可以展开查看详细的使用命令。
                  建议结合上方的靶场环境进行实战练习。
                </p>
              </div>
            </div>
          </Card>

          {tools.map((tool) => (
            <motion.div key={tool.id} variants={itemVariants}>
              <Card>
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setExpandedTool(expandedTool === tool.id ? null : tool.id)
                  }
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-cyber-gold/20 flex items-center justify-center">
                      <Zap size={24} className="text-cyber-gold" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{tool.name}</h3>
                      <p className="text-sm text-gray-400">{tool.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={tool.officialSite}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs px-3 py-2 rounded-lg bg-cyber-purple/30 text-gray-300 border border-cyber-purple/30 hover:bg-cyber-purple/40 transition-colors flex items-center gap-1"
                    >
                      <ExternalLink size={14} />
                      官网
                    </a>
                    {expandedTool === tool.id ? (
                      <ChevronDown size={20} className="text-gray-400" />
                    ) : (
                      <ChevronRight size={20} className="text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedTool === tool.id && (
                  <div className="mt-4 pt-4 border-t border-cyber-green/10">
                    <h4 className="text-sm font-medium text-cyber-green mb-3">
                      常用命令
                    </h4>
                    <div className="space-y-3">
                      {tool.commands.map((cmd, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-cyber-black/50 border border-cyber-green/10"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-white">
                              {cmd.name}
                            </span>
                            <button
                              onClick={() => copyToClipboard(cmd.cmd, `${tool.id}-${idx}`)}
                              className="text-xs text-cyber-green hover:text-white transition-colors flex items-center gap-1"
                            >
                              {copiedCmd === `${tool.id}-${idx}` ? (
                                <>
                                  <Check size={12} /> 已复制
                                </>
                              ) : (
                                <>
                                  <Copy size={12} /> 复制
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="code-block text-xs mb-2">
                            <code className="text-cyber-green">{cmd.cmd}</code>
                          </pre>
                          <p className="text-xs text-gray-400">{cmd.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default LabEnvironment;
