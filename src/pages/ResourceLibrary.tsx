import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  const listRef = useRef<HTMLDivElement>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<{ key: string; name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [isDark, setIsDark] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string>('');
  const [filterVersion, setFilterVersion] = useState(0);

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
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      const [allResources, allCategories] = await Promise.all([
        loadAllResources(),
        getCategories(),
      ]);
      if (mounted) {
        setResources([...allResources]);
        setCategories([...allCategories]);
        setLoading(false);
      }
    }
    fetchData();
    try {
      const saved = localStorage.getItem('cisp_favorites');
      if (saved && mounted) setFavorites(new Set(JSON.parse(saved)));
    } catch {}
    return () => {
      mounted = false;
    };
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast('已取消收藏');
      } else {
        next.add(id);
        showToast('已加入收藏');
      }
      localStorage.setItem('cisp_favorites', JSON.stringify([...next]));
      return next;
    });
  };

  const stats = getStats();

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const matchesSearch = (resource.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (resource.summary?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (resource.tags || []).some(tag => (tag?.toLowerCase() || '').includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || resource.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [resources, selectedCategory, selectedDifficulty, searchTerm]);

  const handleCategoryChange = (key: string) => {
    setSelectedCategory(key);
    setFilterVersion(v => v + 1);
    const cat = categories.find(c => c.key === key);
    showToast(`已切换到：${cat?.name || key}`);
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDifficultyChange = (key: string) => {
    setSelectedDifficulty(key);
    setFilterVersion(v => v + 1);
  };

  const handleResetFilter = () => {
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSearchTerm('');
    setFilterVersion(v => v + 1);
    showToast('已重置筛选条件');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
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
  const btnSelectedCat = isDark ? 'bg-cyber-green text-cyber-black' : 'bg-green-500 text-white';
  const btnNormalCat = isDark
    ? 'bg-cyber-purple/40 text-gray-300 hover:bg-cyber-green/10 hover:text-cyber-green'
    : 'bg-gray-200 text-gray-700 hover:bg-gray-300';
  const btnSelectedDiff = isDark ? 'border-2 border-cyber-green text-cyber-green' : 'border-2 border-green-500 text-green-600';
  const btnNormalDiff = isDark ? 'bg-cyber-purple/40 text-gray-300' : 'bg-gray-200 text-gray-600';
  const btnSelectedDiffBlue = isDark ? 'border-2 border-cyber-blue text-cyber-blue' : 'border-2 border-blue-500 text-blue-600';
  const btnSelectedDiffGold = isDark ? 'border-2 border-cyber-gold text-cyber-gold' : 'border-2 border-yellow-500 text-yellow-600';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-cyber-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg bg-cyber-green text-cyber-black font-medium shadow-lg shadow-cyber-green/30 animate-pulse">
          {toast}
        </div>
      )}
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
          className={`p-3 rounded-lg transition-all ${isDark ? 'bg-cyber-purple/40 text-cyber-green hover:bg-cyber-purple/60' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
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
          <p className={`text-2xl font-bold ${textColor}`}>{stats.difficulty['入门'] || 0}</p>
          <p className={`text-sm ${textColorMuted}`}>入门级</p>
        </Card>
        <Card className={`text-center ${bgCard}`}>
          <TrendingUp size={24} className={`mx-auto mb-2 ${isDark ? 'text-cyber-blue' : 'text-blue-600'}`} />
          <p className={`text-2xl font-bold ${textColor}`}>{stats.difficulty['进阶'] || 0}</p>
          <p className={`text-sm ${textColorMuted}`}>进阶级</p>
        </Card>
        <Card className={`text-center ${bgCard}`}>
          <Award size={24} className={`mx-auto mb-2 ${isDark ? 'text-cyber-gold' : 'text-yellow-600'}`} />
          <p className={`text-2xl font-bold ${textColor}`}>{stats.difficulty['精通'] || 0}</p>
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
            onClick={handleResetFilter}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 ${isDark ? 'text-gray-400 hover:text-cyber-green' : 'text-gray-500 hover:text-green-600'} transition-colors`}
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === 'all' ? btnSelectedCat : btnNormalCat}`}
          >
            全部分类
          </button>
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => handleCategoryChange(cat.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === cat.key ? btnSelectedCat : btnNormalCat}`}
            >
              {cat.name}
              <span className="ml-1 opacity-70">({cat.count})</span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleDifficultyChange('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedDifficulty === 'all' ? btnSelectedDiff : btnNormalDiff}`}
          >
            全部难度
          </button>
          <button
            onClick={() => handleDifficultyChange('入门')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedDifficulty === '入门' ? btnSelectedDiff : btnNormalDiff}`}
          >
            入门
          </button>
          <button
            onClick={() => handleDifficultyChange('进阶')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedDifficulty === '进阶' ? btnSelectedDiffBlue : btnNormalDiff}`}
          >
            进阶
          </button>
          <button
            onClick={() => handleDifficultyChange('精通')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedDifficulty === '精通' ? btnSelectedDiffGold : btnNormalDiff}`}
          >
            精通
          </button>
        </div>
      </div>

      <div ref={listRef} className="flex items-center justify-between">
        <h2 className={`text-lg font-medium ${textColor}`}>
          {categoryNames[selectedCategory] || '全部资源'}
        </h2>
        <span className={`text-sm ${textColorMuted}`}>{filteredResources.length} 篇</span>
      </div>

      <motion.div
        key={`list-${filterVersion}`}
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredResources.map((resource) => (
          <motion.div key={`${resource.id}-${filterVersion}`} variants={itemVariants}>
            <Card className={`hover:border-cyber-green/30 transition-all ${bgCard} ${borderColor}`}>
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={resource.difficulty === '入门' ? 'green' : resource.difficulty === '进阶' ? 'blue' : 'gold'}>
                      {resource.difficulty}
                    </Badge>
                    <span className={`text-sm ${textColorMuted}`}>{categoryNames[resource.category]}</span>
                  </div>

                  <h3 className={`text-lg font-medium mb-2 hover:text-cyber-green transition-colors cursor-pointer ${textColor}`}
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
                  <Button
                    variant={favorites.has(resource.id) ? 'primary' : 'outline'}
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(resource.id); }}
                  >
                    {favorites.has(resource.id) ? '❤️ 已收藏' : '收藏'}
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
          <Button onClick={handleResetFilter} variant="outline" className="mt-4">
            <RefreshCw size={16} />
            重置筛选
          </Button>
        </div>
      )}
    </div>
  );
};

export default ResourceLibrary;
