import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Heart,
  MessageCircle,
  Pin,
  Plus,
  Search,
  BookOpen,
  HelpCircle,
  Share2,
  ThumbsUp,
  Clock
} from 'lucide-react';
import { useCommunityStore, Post } from '../store';
import { Card, Badge, Button } from '../components/UI';

const postTypeIcons: Record<string, any> = {
  note: BookOpen,
  question: HelpCircle,
  share: Share2,
};

const postTypeLabels: Record<string, string> = {
  note: '学习笔记',
  question: '提问',
  share: '经验分享',
};

const postTypeColors: Record<string, string> = {
  note: 'green',
  question: 'blue',
  share: 'gold',
};

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

export const Community: React.FC = () => {
  const { posts, addPost, likePost } = useCommunityStore();
  const [activeTab, setActiveTab] = useState<'all' | 'note' | 'question' | 'share'>('all');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState<'note' | 'question' | 'share'>('note');

  const filteredPosts = activeTab === 'all'
    ? posts
    : posts.filter(p => p.type === activeTab);

  const pinnedPosts = posts.filter(p => p.isPinned);

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    addPost({
      author: '网络安全学员',
      authorId: 'user1',
      title: newPostTitle,
      content: newPostContent,
      type: newPostType,
      isPinned: false,
    });

    setNewPostTitle('');
    setNewPostContent('');
    setNewPostType('note');
    setShowNewPost(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-orbitron text-2xl font-bold text-cyber-green">
            社区交流
          </h1>
          <p className="text-gray-400 mt-1">
            与其他学员交流学习心得，分享经验
          </p>
        </div>
        <Button
          icon={Plus}
          onClick={() => setShowNewPost(true)}
        >
          发布帖子
        </Button>
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowNewPost(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-cyber-purple/90 backdrop-blur-xl rounded-xl p-6 w-full max-w-lg border border-cyber-green/20"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="font-orbitron text-lg text-white mb-4">发布新帖子</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">帖子类型</label>
                <div className="flex gap-2">
                  {(['note', 'question', 'share'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setNewPostType(type)}
                      className={`
                        px-3 py-1.5 rounded-lg text-sm transition-all
                        ${newPostType === type
                          ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/30'
                          : 'bg-cyber-purple/40 text-gray-400 border border-transparent'
                        }
                      `}
                    >
                      {postTypeLabels[type]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">标题</label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={e => setNewPostTitle(e.target.value)}
                  placeholder="输入帖子标题"
                  className="w-full bg-cyber-black/50 border border-cyber-green/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-green/50"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">内容</label>
                <textarea
                  value={newPostContent}
                  onChange={e => setNewPostContent(e.target.value)}
                  placeholder="输入帖子内容"
                  rows={5}
                  className="w-full bg-cyber-black/50 border border-cyber-green/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-green/50 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowNewPost(false)}
                >
                  取消
                </Button>
                <Button onClick={handleCreatePost}>
                  发布
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: '全部' },
          { id: 'note', label: '学习笔记' },
          { id: 'question', label: '提问' },
          { id: 'share', label: '经验分享' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all
              ${activeTab === tab.id
                ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/30'
                : 'text-gray-400 hover:text-white hover:bg-cyber-purple/40'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Pinned Posts */}
      {activeTab === 'all' && pinnedPosts.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-3 mb-6">
            <h3 className="text-sm text-gray-400 flex items-center gap-2">
              <Pin size={14} />
              精华帖
            </h3>
            {pinnedPosts.map(post => (
              <PostCard key={post.id} post={post} onLike={() => likePost(post.id)} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Post List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {filteredPosts.filter(p => !p.isPinned).map(post => (
          <PostCard key={post.id} post={post} onLike={() => likePost(post.id)} />
        ))}
      </motion.div>
    </div>
  );
};

const PostCard: React.FC<{ post: Post; onLike: () => void }> = ({ post, onLike }) => {
  const IconComponent = postTypeIcons[post.type] || BookOpen;
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="hover:border-cyber-green/20 transition-all cursor-pointer">
        <div className="flex gap-4">
          {/* Author Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-green to-cyber-blue flex items-center justify-center flex-shrink-0">
            <span className="text-cyber-black font-bold text-sm">
              {post.author.charAt(0)}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {post.isPinned && <Pin size={12} className="text-cyber-gold" />}
              <Badge variant={postTypeColors[post.type] as any} className="text-xs">
                <IconComponent size={12} />
                {postTypeLabels[post.type]}
              </Badge>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock size={12} />
                {formatDate(post.createdAt)}
              </span>
            </div>

            <h3 className="font-medium text-white mb-1 hover:text-cyber-green transition-colors">
              {post.title}
            </h3>

            <p className="text-sm text-gray-400 line-clamp-2 mb-3">
              {post.content}
            </p>

            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={onLike}
                className="flex items-center gap-1 text-gray-400 hover:text-cyber-red transition-colors"
              >
                <ThumbsUp size={14} />
                {post.likes}
              </button>
              <span className="flex items-center gap-1 text-gray-400">
                <MessageCircle size={14} />
                {post.comments}
              </span>
              <span className="text-gray-500">by {post.author}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default Community;
