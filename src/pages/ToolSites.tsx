import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Search,
  Folder,
  Globe,
  BookOpen,
  Grid3X3,
  Shield,
  Wrench,
  Target
} from 'lucide-react';
import { Card } from '../components/UI';
import { toolSites } from '../data/toolSites';

export const ToolSites: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>(toolSites[0].category);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = toolSites.map(t => t.category);
  const currentSites = toolSites.find(t => t.category === activeCategory)?.sites || [];

  const filteredSites = currentSites.filter(site =>
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSites = toolSites.reduce((sum, t) => sum + t.sites.length, 0);

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      '学习网址': <BookOpen size={18} />,
      '免费靶场': <Grid3X3 size={18} />,
      '等保测评': <Shield size={18} />,
      '渗透靶场': <Target size={18} />,
      '常用工具网站': <Wrench size={18} />,
      '情报搜索引擎': <Search size={18} />
    };
    return iconMap[category] || <Folder size={18} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-lg bg-cyber-green/20 flex items-center justify-center">
            <Globe size={24} className="text-cyber-green" />
          </div>
          <div>
            <h1 className="font-orbitron text-2xl font-bold text-white">
              工具网站导航
            </h1>
            <p className="text-sm text-gray-400">
              网络安全学习资源、靶场、工具和情报搜索引擎汇总
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-purple/30 border border-cyber-green/20">
            <span className="text-cyber-green text-2xl font-bold">{categories.length}</span>
            <span className="text-gray-400 text-sm">分类</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-purple/30 border border-cyber-green/20">
            <span className="text-cyber-green text-2xl font-bold">{totalSites}</span>
            <span className="text-gray-400 text-sm">网站</span>
          </div>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索工具网站..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-cyber-black/50 border border-cyber-green/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-green/50 transition-colors"
            />
          </div>
        </Card>
      </motion.div>

      {/* Category Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const siteCount = toolSites.find(t => t.category === category)?.sites.length || 0;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeCategory === category
                    ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/40'
                    : 'bg-cyber-purple/20 text-gray-400 border border-cyber-green/10 hover:text-white hover:bg-cyber-purple/40'
                }`}
              >
                {getCategoryIcon(category)}
                <span>{category}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyber-black/50 text-gray-400">
                  {siteCount}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Sites Grid */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            {getCategoryIcon(activeCategory)}
            {activeCategory}
            <span className="text-sm text-gray-400 font-normal ml-2">
              ({filteredSites.length} 个网站)
            </span>
          </h2>

          {filteredSites.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Search size={32} className="mx-auto mb-3 opacity-50" />
              <p>未找到相关网站</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSites.map((site, index) => (
                <motion.a
                  key={site.name}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="block p-5 rounded-xl border-2 border-cyber-green/10 bg-cyber-purple/20 hover:bg-cyber-purple/40 hover:border-cyber-green/40 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{site.icon}</span>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-cyber-green transition-colors">
                          {site.name}
                        </h3>
                      </div>
                    </div>
                    <ExternalLink
                      size={16}
                      className="text-gray-400 group-hover:text-cyber-green transition-colors flex-shrink-0 mt-1"
                    />
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed mb-3">
                    {site.description}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-cyber-green/10">
                    <span className="text-xs text-cyber-blue truncate max-w-[200px]">
                      {site.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Quick Links Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 bg-cyber-blue/5 border-cyber-blue/20">
          <h3 className="text-lg font-semibold text-cyber-blue mb-4 flex items-center gap-2">
            <Shield size={20} />
            学习建议
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="flex items-start gap-3">
              <span className="text-cyber-green text-lg">①</span>
              <p>建议从 <span className="text-cyber-green">学习网址</span> 开始，了解网络安全基础概念和最新动态</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-cyber-green text-lg">②</span>
              <p>在 <span className="text-cyber-green">免费靶场</span> 和 <span className="text-cyber-green">渗透靶场</span> 中进行实操练习</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-cyber-green text-lg">③</span>
              <p>使用 <span className="text-cyber-green">常用工具网站</span> 解决日常学习和工作中的技术问题</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-cyber-green text-lg">④</span>
              <p>利用 <span className="text-cyber-green">情报搜索引擎</span> 进行资产发现和安全研究</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ToolSites;
