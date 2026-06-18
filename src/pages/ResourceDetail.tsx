import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Bookmark,
  Share2,
  Sun,
  Moon,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, Badge, Button } from '../components/UI';
import { Resource, categoryNames } from '../types/resource';
import { getResourceById, loadMarkdownContent } from '../data/resourceData';

function MarkdownRenderer({ content, isDark }: { content: string; isDark: boolean }) {
  return (
    <div className={isDark ? 'prose prose-invert max-w-none' : 'prose max-w-none'}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

export const ResourceDetail: React.FC = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const navigate = useNavigate();
  const [resource, setResource] = useState<Resource | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string>('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDark(savedTheme !== 'light');
    try {
      const saved = localStorage.getItem('cisp_favorites');
      if (saved) setFavorites(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

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

  const handleShare = () => {
    if (!resource) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}${window.location.hash}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => showToast('链接已复制到剪贴板'))
      .catch(() => showToast('复制失败'));
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      if (!resourceId) return;

      try {
        const foundResource = await getResourceById(resourceId);
        if (foundResource) {
          setResource(foundResource);
          try {
            const markdownContent = await loadMarkdownContent(foundResource.contentPath);
            setContent(markdownContent);
          } catch {
            setContent(`# 文件不存在\n\n> 资源内容文件 **${foundResource.contentPath}** 未找到。\n\n可能原因：\n- 内容文件尚未上传\n- 文件路径配置错误\n\n请联系管理员补充内容。`);
          }
        } else {
          setResource(null);
        }
      } catch {
        setResource(null);
      }
      setLoading(false);
    }
    fetchData();
  }, [resourceId]);

  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textColorMuted = isDark ? 'text-gray-400' : 'text-gray-600';
  const bgCard = isDark ? 'bg-cyber-purple/40' : 'bg-white';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-cyber-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>资源不存在</p>
        <Button onClick={() => navigate('/resources')} className="mt-4">
          返回资源库
        </Button>
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <Button
          variant="outline"
          onClick={() => navigate('/resources')}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          返回资源库
        </Button>
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className={bgCard}>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={resource.difficulty === '入门' ? 'green' : resource.difficulty === '进阶' ? 'blue' : 'gold'}>
                  {resource.difficulty}
                </Badge>
                <span className={`text-sm ${textColorMuted}`}>{categoryNames[resource.category]}</span>
              </div>

              <h1 className={`text-2xl md:text-3xl font-bold mb-4 ${textColor}`}>
                {resource.title}
              </h1>

              <p className={`mb-4 ${textColorMuted}`}>{resource.summary}</p>

              <div className={`flex flex-wrap items-center gap-4 text-sm ${textColorMuted}`}>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  阅读时间约 {resource.readMinutes} 分钟
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  更新于 {resource.updatedAt}
                </span>
                <span>{resource.author}</span>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {resource.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 text-xs rounded-full ${
                      isDark
                        ? 'bg-cyber-green/10 border border-cyber-green/30 text-cyber-green'
                        : 'bg-green-100 border border-green-300 text-green-700'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant={favorites.has(resource.id) ? 'primary' : 'outline'}
                className="gap-2"
                onClick={() => toggleFavorite(resource.id)}
              >
                <Bookmark size={16} />
                {favorites.has(resource.id) ? '❤️ 已收藏' : '收藏'}
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleShare}>
                <Share2 size={16} />
                分享
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className={bgCard}>
          <MarkdownRenderer content={content} isDark={isDark} />
        </Card>
      </motion.div>
    </div>
  );
};

export default ResourceDetail;