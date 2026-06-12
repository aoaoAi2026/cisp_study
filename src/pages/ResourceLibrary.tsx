import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FolderOpen,
  BookOpen,
  Star,
  TrendingUp,
  Award,
  Search,
  RefreshCw,
  Clock,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';
import { Resource, categoryNames } from '../types/resource';
import { loadAllResources, getCategories, getStats } from '../data/resourceData';

export const ResourceLibrary: React.FC = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDark(savedTheme !== 'light');
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    if (newIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [allResources, allCategories] = await Promise.all([
        loadAllResources(),
        getCategories(),
      ]);
      setResources(allResources);
      setCategories(allCategories);
      setLoading(false);
    }
    fetchData();
  }, []);

  const stats = getStats(resources);

  const filteredResources = resources.filter(resource => {
    const matchesSearch = (resource.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (resource.summary?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (resource.tags || []).some(tag => (tag?.toLowerCase() || '').includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || resource.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textColorMuted = isDark ? 'text-gray-400' : 'text-gray-600';
  const bgCard = isDark ? 'bg-cyber-purple/40' : 'bg-white';
  const borderColor = isDark ? 'border-cyber-green/10' : 'border-gray-200';
  const inputBg = isDark ? 'bg-cyber-black/50' : 'bg-gray-100';
  const inputText = isDark ? 'text-white' : 'text-gray-900';
  const inputPlaceholder = isDark ? 'placeholder-gray-500' : 'placeholder-gray-400';
  const inputBorder = isDark ? 'border-cyber-green/20' : 'border-gray-300';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-cyber-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`font-orbitron text-2xl font-bold ${isDark ? 'text-cyber-green' : 'text-green-600'}`}>
            网络安全资源库
          </h1>
          <p className={`mt-1 ${textColorMuted}`}>
            涵盖渗透测试、漏洞分析、代码审计、等级保护等多个领域的实战知识库
          </p>
        </div>
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-lg transition-all ${
            isDark
              ? 'bg-cyber-purple/40 text-cyber-green hover:bg-cyber-purple/60'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className={`text-center ${bgCard}`}>
          <FolderOpen size={24} className={`mx-auto mb-2 ${isDark ? 'text-cyber-green' : 'text-green-600'}`} />
          <p className={`text-2xl font-bold ${textColor}`}>{stats.categories}</p>
          <p className={`text-sm ${textColorMuted}`}>分类数量</p>
        </Card>
        <Card className={`text-center ${bgCard}`}>
          <BookOpen size={24} className={`mx-auto mb-2 ${isDark ? 'text-cyber-blue' : 'text-blue-600'}`} />
          <p className={`text-2xl font-bold ${textColor}`}>{stats.total}</p>
          <p className={`text-sm ${textColorMuted}`}>资源总数</p>
        </Card>
        <Card className={`text-center ${bgCard}`}>
          <Star size={24} className={`mx-auto mb-2 ${isDark ? 'text-cyber-green' : 'text-green-600'}`} />
          <p className={`text-2xl font-bold ${textColor}`}>{stats.beginner}</p>
          <p className={`text-sm ${textColorMuted}`}>入门级</p>
        </Card>
        <Card className={`text-center ${bgCard}`}>
          <TrendingUp size={24} className={`mx-auto mb-2 ${isDark ? 'text-cyber-blue' : 'text-blue-600'}`} />
          <p className={`text-2xl font-bold ${textColor}`}>{stats.intermediate}</p>
          <p className={`text-sm ${textColorMuted}`}>进阶级</p>
        </Card>
        <Card className={`text-center ${bgCard}`}>
          <Award size={24} className={`mx-auto mb-2 ${isDark ? 'text-cyber-gold' : 'text-yellow-600'}`} />
          <p className={`text-2xl font-bold ${textColor}`}>{stats.advanced}</p>
          <p className={`text-sm ${textColorMuted}`}>精通级</p>
        </Card>
      </div>

      <Card className={bgCard}>
        <div className="relative">
          <Search size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="搜索资源（支持标题、摘要、标签）"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 ${inputBg} ${inputBorder} rounded-lg ${inputText} ${inputPlaceholder} focus:outline-none focus:border-green-500 transition-colors`}
          />
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDifficulty('all');
              setSearchTerm('');
            }}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 ${isDark ? 'text-gray-400 hover:text-cyber-green' : 'text-gray-500 hover:text-green-600'} transition-colors`}
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === 'all'
                ? (isDark ? 'bg-cyber-green text-cyber-black' : 'bg-green-500 text-white')
                : (isDark ? 'bg-cyber-purple/40 text-gray-300 hover:bg-cyber-green/10' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
            }`}
          >
            全部分类
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? (isDark ? 'bg-cyber-green text-cyber-black' : 'bg-green-500 text-white')
                  : (isDark ? 'bg-cyber-purple/40 text-gray-300 hover:bg-cyber-green/10' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedDifficulty('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedDifficulty === 'all'
                ? (isDark ? 'border-2 border-cyber-green text-cyber-green' : 'border-2 border-green-500 text-green-600')
                : (isDark ? 'bg-cyber-purple/40 text-gray-300' : 'bg-gray-200 text-gray-600')
            }`}
          >
            全部难度
          </button>
          <button
            onClick={() => setSelectedDifficulty('入门')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedDifficulty === '入门'
                ? (isDark ? 'border-2 border-cyber-green text-cyber-green' : 'border-2 border-green-500 text-green-600')
                : (isDark ? 'bg-cyber-purple/40 text-gray-300' : 'bg-gray-200 text-gray-600')
            }`}
          >
            入门
          </button>
          <button
            onClick={() => setSelectedDifficulty('进阶')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedDifficulty === '进阶'
                ? (isDark ? 'border-2 border-cyber-blue text-cyber-blue' : 'border-2 border-blue-500 text-blue-600')
                : (isDark ? 'bg-cyber-purple/40 text-gray-300' : 'bg-gray-200 text-gray-600')
            }`}
          >
            进阶
          </button>
          <button
            onClick={() => setSelectedDifficulty('精通')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedDifficulty === '精通'
                ? (isDark ? 'border-2 border-cyber-gold text-cyber-gold' : 'border-2 border-yellow-500 text-yellow-600')
                : (isDark ? 'bg-cyber-purple/40 text-gray-300' : 'bg-gray-200 text-gray-600')
            }`}
          >
            精通
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className={`text-lg font-medium ${textColor}`}>
          {categoryNames[selectedCategory] || '全部资源'}
        </h2>
        <span className={`text-sm ${textColorMuted}`}>{filteredResources.length} 篇</span>
      </div>

      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredResources.map((resource) => (
          <motion.div key={resource.id} variants={itemVariants}>
            <Card className={`hover:${isDark ? 'border-cyber-green/30' : 'border-green-400'} transition-all ${bgCard} ${borderColor}`}>
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={resource.difficulty === '入门' ? 'green' : resource.difficulty === '进阶' ? 'blue' : 'gold'}>
                      {resource.difficulty}
                    </Badge>
                    <span className={`text-sm ${textColorMuted}`}>{categoryNames[resource.category]}</span>
                  </div>

                  <h3 className={`text-lg font-medium mb-2 hover:${isDark ? 'text-cyber-green' : 'text-green-600'} transition-colors cursor-pointer ${textColor}`}
                      onClick={() => navigate(`/resources/${resource.id}`)}>
                    {resource.title}
                  </h3>

                  <p className={`text-sm mb-3 line-clamp-2 ${textColorMuted}`}>{resource.summary}</p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {resource.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 text-xs rounded ${isDark ? 'bg-cyber-purple/60 text-gray-300' : 'bg-gray-200 text-gray-600'}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className={`flex items-center gap-4 text-sm ${textColorMuted}`}>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {resource.readMinutes} 分钟
                    </span>
                    <span>{resource.author}</span>
                    <span>分类: {categoryNames[resource.category]}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button onClick={() => navigate(`/resources/${resource.id}`)}>
                    阅读全文
                    <ChevronRight size={16} />
                  </Button>
                  <Button variant="outline" size="sm">
                    收藏
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredResources.length === 0 && (
        <div className={`text-center py-12 ${textColorMuted}`}>
          <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
          <p>暂无匹配的资源</p>
        </div>
      )}
    </div>
  );
};

export default ResourceLibrary;
