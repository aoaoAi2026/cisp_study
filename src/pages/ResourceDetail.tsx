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
import { Card, Badge, Button } from '../components/UI';
import { Resource, categoryNames } from '../types/resource';
import { getResourceById, loadMarkdownContent } from '../data/resourceData';

function MarkdownRenderer({ content, isDark }: { content: string; isDark: boolean }) {
  const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
  const headingColor = isDark ? 'text-cyber-green' : 'text-green-600';
  const linkColor = isDark ? 'text-cyber-blue' : 'text-blue-600';
  const codeBlockBg = isDark ? 'bg-cyber-black/80' : 'bg-gray-100';
  const codeTextColor = isDark ? 'text-cyber-green' : 'text-green-600';

  const renderMarkdown = () => {
    let html = content;

    html = html.replace(/^### (.*$)/gim, `<h3 class="text-lg font-semibold ${headingColor} mt-6 mb-3">$1</h3>`);
    html = html.replace(/^## (.*$)/gim, `<h2 class="text-xl font-semibold ${headingColor} mt-8 mb-4">$1</h2>`);
    html = html.replace(/^# (.*$)/gim, `<h1 class="text-2xl font-bold ${headingColor} mt-10 mb-6">$1</h1>`);

    html = html.replace(/\*\*(.*?)\*\*/g, `<strong class="text-white font-semibold">$1</strong>`);
    html = html.replace(/\*(.*?)\*/g, `<em class="text-gray-300 italic">$1</em>`);

    html = html.replace(/^> (.*$)/gim, `<blockquote class="border-l-4 ${isDark ? 'border-cyber-green' : 'border-green-500'} pl-4 my-4 text-gray-400 italic">$1</blockquote>`);

    html = html.replace(/^- (.*$)/gim, `<li class="ml-4 ${textColor} list-disc mb-1">$1</li>`);
    html = html.replace(/^\d+\. (.*$)/gim, `<li class="ml-4 ${textColor} list-decimal mb-1">$1</li>`);

    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, `<pre class="code-block ${codeBlockBg}"><code class="${codeTextColor}">$2</code></pre>`);
    html = html.replace(/`([^`]+)`/g, `<code class="px-2 py-1 ${codeBlockBg} rounded ${codeTextColor} text-sm font-mono">$1</code>`);

    html = html.replace(/\|(.+)\|\n\|[-|]+\|\n((?:\|.+\|\n?)+)/g, (match, header, body) => {
      const headerCells = header.split('|').filter(cell => cell.trim());
      const bodyRows = body.trim().split('\n');
      let table = `<table class="w-full border-collapse my-4"><thead><tr>`;
      headerCells.forEach(cell => {
        table += `<th class="border ${isDark ? 'border-cyber-green/30' : 'border-gray-300'} px-4 py-2 text-left ${headingColor}">${cell.trim()}</th>`;
      });
      table += '</tr></thead><tbody>';
      bodyRows.forEach(row => {
        const cells = row.split('|').filter(cell => cell.trim());
        table += '<tr>';
        cells.forEach(cell => {
          table += `<td class="border ${isDark ? 'border-cyber-green/30' : 'border-gray-300'} px-4 py-2 ${textColor}">${cell.trim()}</td>`;
        });
        table += '</tr>';
      });
      table += '</tbody></table>';
      return table;
    });

    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" target="_blank" rel="noopener noreferrer" class="${linkColor} hover:${isDark ? 'text-cyber-green' : 'text-green-600'} underline">$1</a>`);

    html = html.replace(/\n/g, '<br>');

    return html;
  };

  return (
    <div
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: renderMarkdown() }}
    />
  );
}

export const ResourceDetail: React.FC = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const navigate = useNavigate();
  const [resource, setResource] = useState<Resource | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
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
      if (!resourceId) return;

      const foundResource = await getResourceById(resourceId);
      if (foundResource) {
        setResource(foundResource);
        const markdownContent = await loadMarkdownContent(foundResource.contentPath);
        setContent(markdownContent);
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
    <div className="space-y-6">
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
              <Button variant="outline" className="gap-2">
                <Bookmark size={16} />
                收藏
              </Button>
              <Button variant="outline" className="gap-2">
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