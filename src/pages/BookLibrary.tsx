import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/UI';
import booksData, { bookCategories as defaultBookCategories, BookCategory, Book, getAllBooks, buildCategories } from '../data/books';
import BookReader from './BookReader';
import {
  Search,
  BookOpen,
  Star,
  Users,
  Clock,
  BookMarked,
  TrendingUp,
  ChevronRight,
  Layers,
  Heart,
  BookText,
  LibraryBig,
  Sparkles,
  Clock3,
  ListOrdered,
  Grid3X3,
  Book as BookIcon,
  X,
  Play,
  Award as AwardIcon,
  Flame,
} from 'lucide-react';

// 书籍封面渐变配色方案
const coverGradients = [
  'from-purple-600 via-purple-500 to-indigo-600',
  'from-blue-600 via-cyan-500 to-teal-500',
  'from-rose-600 via-pink-500 to-fuchsia-500',
  'from-amber-500 via-orange-500 to-red-500',
  'from-emerald-500 via-green-500 to-teal-500',
  'from-indigo-600 via-violet-500 to-purple-500',
  'from-cyan-500 via-sky-500 to-blue-500',
  'from-pink-500 via-rose-500 to-red-500',
  'from-lime-500 via-green-500 to-emerald-500',
  'from-sky-600 via-blue-500 to-indigo-500',
  'from-fuchsia-500 via-purple-500 to-violet-500',
  'from-yellow-500 via-amber-500 to-orange-500',
];

const getCoverGradient = (index: number) => coverGradients[index % coverGradients.length];

// 阅读进度存储
const getReadingProgress = (): Record<string, { chapter: number; progress: number }> => {
  try {
    const saved = localStorage.getItem('reading_progress');
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const saveReadingProgress = (bookId: string, chapter: number, progress: number) => {
  try {
    const all = getReadingProgress();
    all[bookId] = { chapter, progress };
    localStorage.setItem('reading_progress', JSON.stringify(all));
  } catch {}
};

// 收藏书籍
const getFavorites = (): string[] => {
  try {
    const saved = localStorage.getItem('book_favorites');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const toggleFavorite = (bookId: string): string[] => {
  try {
    const favs = getFavorites();
    const newFavs = favs.includes(bookId)
      ? favs.filter(id => id !== bookId)
      : [...favs, bookId];
    localStorage.setItem('book_favorites', JSON.stringify(newFavs));
    return newFavs;
  } catch {
    return [];
  }
};

export const BookLibrary: React.FC = () => {
  const [books, setBooks] = useState<Book[]>(booksData);
  const [categories, setCategories] = useState<BookCategory[]>(defaultBookCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [viewMode, setViewMode] = useState<'shelf' | 'grid'>('shelf');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [readingProgress, setReadingProgress] = useState<Record<string, { chapter: number; progress: number }>>({});
  const [showBookDetail, setShowBookDetail] = useState<Book | null>(null);

  useEffect(() => {
    setFavorites(getFavorites());
    setReadingProgress(getReadingProgress());
    // 加载 manifest 合并后的动态书籍列表（新笔记自动收录）
    (async () => {
      try {
        const merged = await getAllBooks();
        setBooks(merged);
        setCategories(buildCategories(merged));
      } catch {}
    })();
  }, []);

  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === '全部' || book.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const currentlyReading = books.filter(b => readingProgress[b.id]);
  const favoriteBooks = books.filter(b => favorites.includes(b.id));

  const handleStartReading = (book: Book) => {
    setShowBookDetail(null);
    setSelectedBook(book);
  };

  const handleToggleFavorite = (bookId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(toggleFavorite(bookId));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '入门': return 'bg-emerald-500';
      case '进阶': return 'bg-amber-500';
      case '高级': return 'bg-rose-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case '入门': return 'text-emerald-400';
      case '进阶': return 'text-amber-400';
      case '高级': return 'text-rose-400';
      default: return 'text-gray-400';
    }
  };

  if (selectedBook) {
    return (
      <BookReader
        book={selectedBook}
        onBack={() => setSelectedBook(null)}
        onProgressUpdate={(chapter, progress) => {
          saveReadingProgress(selectedBook.id, chapter, progress);
          setReadingProgress(getReadingProgress());
        }}
      />
    );
  }

  // 书架风格的书籍封面
  const BookCover = ({ book, index, size = 'normal' }: { book: Book; index: number; size?: 'normal' | 'small' | 'large' }) => {
    const gradient = getCoverGradient(index);
    const isFavorite = favorites.includes(book.id);
    const progress = readingProgress[book.id];
    const progressPercent = progress ? Math.round(((progress.chapter) / book.chapters.length) * 100) : 0;

    const sizeClasses = {
      small: 'w-24 h-36',
      normal: 'w-36 h-52',
      large: 'w-48 h-68',
    };

    return (
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        className={`relative ${sizeClasses[size]} cursor-pointer group`}
        onClick={() => setShowBookDetail(book)}
      >
        {/* 书脊阴影效果 */}
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/30 rounded-l-lg" />
        
        {/* 书籍封面 */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-lg shadow-xl overflow-hidden`}>
          {/* 装饰图案 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          {/* 书籍信息 */}
          <div className="absolute inset-0 p-3 flex flex-col justify-between">
            <div>
              <div className={`font-bold text-white ${size === 'small' ? 'text-xs' : size === 'large' ? 'text-lg' : 'text-sm'} leading-tight line-clamp-3`}>
                {book.title}
              </div>
              {size !== 'small' && (
                <div className="text-white/70 text-xs mt-1">{book.author}</div>
              )}
            </div>
            <div>
              {/* 难度标签 */}
              <div className="flex items-center gap-1 mb-2">
                <span className={`w-2 h-2 rounded-full ${getDifficultyColor(book.difficulty)}`} />
                <span className={`text-xs ${getDifficultyText(book.difficulty)}`}>{book.difficulty}</span>
              </div>
              {/* 评分 */}
              {size !== 'small' && (
                <div className="flex items-center gap-1 text-white/80">
                  <Star size={12} className="text-yellow-400" fill="currentColor" />
                  <span className="text-xs">{book.rating}</span>
                </div>
              )}
            </div>
          </div>

          {/* 阅读进度条 */}
          {progress && (
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/30">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}

          {/* 收藏按钮 */}
          <button
            onClick={(e) => handleToggleFavorite(book.id, e)}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/40"
          >
            <Heart
              size={14}
              className={isFavorite ? 'text-rose-500 fill-rose-500' : 'text-white/80'}
            />
          </button>

          {/* 继续阅读标签 */}
          {progress && (
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-yellow-500/90 text-black text-xs font-medium rounded-full flex items-center gap-1">
              <Play size={10} fill="currentColor" />
              继续
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // 书架
  const BookShelf = ({ title, books: shelfBooks, icon: Icon }: { title: string; books: Book[]; icon?: React.ElementType }) => {
    if (shelfBooks.length === 0) return null;

    return (
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {Icon && <Icon size={22} className="text-cyber-purple" />}
            {title}
            <span className="text-sm font-normal text-gray-500 ml-2">({shelfBooks.length}本)</span>
          </h2>
          <button className="text-sm text-cyber-purple hover:underline flex items-center gap-1">
            查看全部 <ChevronRight size={16} />
          </button>
        </div>

        {/* 书架 */}
        <div className="relative">
          {/* 书籍 */}
          <div className="flex gap-5 overflow-x-auto pb-6 px-2">
            {shelfBooks.map((book, i) => (
              <div key={book.id} className="flex-shrink-0">
                <BookCover book={book} index={books.indexOf(book)} />
              </div>
            ))}
          </div>
          
          {/* 书架木板效果 */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-b from-amber-800/40 to-amber-900/60 rounded-b-lg shadow-inner" />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1a] via-[#0d1424] to-[#0a0f1a]">
      {/* 顶部横幅 */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/50 via-indigo-900/50 to-blue-900/50 border-b border-cyber-green/10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyber-purple to-cyber-blue flex items-center justify-center shadow-lg shadow-purple-500/30">
              <LibraryBig size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">网络安全书库</h1>
              <p className="text-gray-400 mt-1">精选 {books.length} 本专业安全书籍，系统学习网安知识</p>
            </div>
          </div>

          {/* 搜索框 */}
          <div className="mt-6 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="搜索书名、作者、关键词..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl focus:outline-none focus:border-cyber-purple/50 text-white placeholder-gray-500 text-lg"
            />
          </div>

          {/* 快捷统计 */}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-sm">
              <BookIcon size={16} className="text-cyber-green" />
              <span className="text-white font-medium">{books.length}</span>
              <span className="text-gray-400">精选书籍</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-sm">
              <Sparkles size={16} className="text-cyber-gold" />
              <span className="text-white font-medium">{favoriteBooks.length}</span>
              <span className="text-gray-400">我的收藏</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-sm">
              <Clock3 size={16} className="text-cyber-blue" />
              <span className="text-white font-medium">{currentlyReading.length}</span>
              <span className="text-gray-400">正在阅读</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-sm">
              <AwardIcon size={16} className="text-rose-400" />
              <span className="text-white font-medium">4.8</span>
              <span className="text-gray-400">平均评分</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 分类导航 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
          {categories.map((cat) => (
            <motion.button
              key={cat.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === cat.name
                  ? 'bg-gradient-to-r from-cyber-purple to-cyber-blue text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              <span className="font-medium text-sm">{cat.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                selectedCategory === cat.name ? 'bg-white/20' : 'bg-black/20'
              }`}>
                {cat.count}
              </span>
            </motion.button>
          ))}

          <div className="flex-1" />

          {/* 视图切换 */}
          <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg">
            <button
              onClick={() => setViewMode('shelf')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'shelf' ? 'bg-cyber-purple/20 text-cyber-purple' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <ListOrdered size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-cyber-purple/20 text-cyber-purple' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Grid3X3 size={18} />
            </button>
          </div>
        </div>

        {/* 搜索结果或分类浏览 */}
        {searchQuery || selectedCategory !== '全部' ? (
          <div>
            <h2 className="text-lg font-bold text-white mb-4">
              {searchQuery ? `搜索结果 (${filteredBooks.length})` : `${selectedCategory} (${filteredBooks.length})`}
            </h2>
            
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {filteredBooks.map((book, i) => (
                  <div key={book.id} className="flex justify-center">
                    <BookCover book={book} index={books.indexOf(book)} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBooks.map((book, i) => {
                  const progress = readingProgress[book.id];
                  const progressPercent = progress ? Math.round(((progress.chapter) / book.chapters.length) * 100) : 0;
                  
                  return (
                    <motion.div
                      key={book.id}
                      whileHover={{ x: 4 }}
                      className="flex gap-4 p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                      onClick={() => setShowBookDetail(book)}
                    >
                      <BookCover book={book} index={books.indexOf(book)} size="small" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white line-clamp-1">{book.title}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{book.author}</p>
                        <p className="text-sm text-gray-400 mt-2 line-clamp-2">{book.description}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(book.difficulty)}/20 ${getDifficultyText(book.difficulty)}`}>
                            {book.difficulty}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Star size={12} className="text-yellow-500" fill="currentColor" />
                            {book.rating}
                          </span>
                          <span className="text-xs text-gray-500">{book.pages}页</span>
                          <span className="text-xs text-gray-500">{book.category}</span>
                        </div>
                        {progress && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-cyber-gold">阅读进度</span>
                              <span className="text-gray-400">{progressPercent}%</span>
                            </div>
                            <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-between items-end">
                        <button
                          onClick={(e) => handleToggleFavorite(book.id, e)}
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <Heart
                            size={20}
                            className={favorites.includes(book.id) ? 'text-rose-500 fill-rose-500' : 'text-gray-500'}
                          />
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartReading(book);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-cyber-purple to-cyber-blue text-white text-sm font-medium rounded-lg shadow-lg shadow-purple-500/20"
                        >
                          {progress ? '继续阅读' : '开始阅读'}
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {filteredBooks.length === 0 && (
              <div className="text-center py-16">
                <BookOpen size={48} className="mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">没有找到相关书籍</p>
                <p className="text-sm text-gray-600 mt-2">换个关键词试试吧</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* 正在阅读 */}
            {currentlyReading.length > 0 && (
              <BookShelf title="继续阅读" books={currentlyReading} icon={Flame} />
            )}

            {/* 我的收藏 */}
            {favoriteBooks.length > 0 && (
              <BookShelf title="我的收藏" books={favoriteBooks} icon={Heart} />
            )}

            {/* 热门推荐 */}
            <BookShelf title="热门推荐" books={books.slice(0, 8)} icon={TrendingUp} />

            {/* 护网专区 */}
            <BookShelf
              title="护网行动专区"
              books={books.filter(b => b.category === '护网红队' || b.category === '护网蓝队')}
              icon={AwardIcon}
            />

            {/* 入门推荐 */}
            <BookShelf
              title="入门必读"
              books={books.filter(b => b.difficulty === '入门')}
              icon={Sparkles}
            />

            {/* 高级进阶 */}
            <BookShelf
              title="高级进阶"
              books={books.filter(b => b.difficulty === '高级')}
              icon={Flame}
            />
          </>
        )}
      </div>

      {/* 书籍详情弹窗 */}
      <AnimatePresence>
        {showBookDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowBookDetail(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative p-8">
                {/* 关闭按钮 */}
                <button
                  onClick={() => setShowBookDetail(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>

                <div className="flex flex-col md:flex-row gap-8">
                  {/* 封面 */}
                  <div className="flex-shrink-0">
                    <BookCover book={showBookDetail} index={books.indexOf(showBookDetail)} size="large" />
                  </div>

                  {/* 信息 */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white">{showBookDetail.title}</h2>
                        <p className="text-gray-400 mt-1">{showBookDetail.author}</p>
                      </div>
                      <button
                        onClick={(e) => handleToggleFavorite(showBookDetail.id, e)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <Heart
                          size={24}
                          className={favorites.includes(showBookDetail.id) ? 'text-rose-500 fill-rose-500' : 'text-gray-400'}
                        />
                      </button>
                    </div>

                    {/* 评分 */}
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-1">
                        <Star size={18} className="text-yellow-500" fill="currentColor" />
                        <span className="text-white font-bold text-lg">{showBookDetail.rating}</span>
                      </div>
                      <span className={`text-sm px-2 py-0.5 rounded-full ${getDifficultyColor(showBookDetail.difficulty)}/20 ${getDifficultyText(showBookDetail.difficulty)}`}>
                        {showBookDetail.difficulty}
                      </span>
                      <span className="text-sm text-gray-500">{showBookDetail.pages}页</span>
                      <span className="text-sm text-gray-500">{showBookDetail.readers.toLocaleString()}人阅读</span>
                    </div>

                    {/* 简介 */}
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-cyber-purple mb-2">内容简介</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{showBookDetail.description}</p>
                    </div>

                    {/* 适用人群 */}
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-cyber-purple mb-2">适合人群</h3>
                      <p className="text-gray-400 text-sm">{showBookDetail.targetAudience}</p>
                    </div>

                    {/* 前置知识 */}
                    {showBookDetail.prerequisites && showBookDetail.prerequisites.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-cyber-purple mb-2">前置知识</h3>
                        <div className="flex flex-wrap gap-2">
                          {showBookDetail.prerequisites.map((p, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-white/5 text-gray-400 rounded">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 标签 */}
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        {showBookDetail.tags.map((tag, i) => (
                          <span key={i} className="text-xs px-3 py-1 bg-cyber-purple/10 text-cyber-purple rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 目录预览 */}
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-cyber-purple mb-3">本书目录（{showBookDetail.chapters.length}章）</h3>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {showBookDetail.chapters.map((ch, i) => (
                          <div key={ch.id} className="flex items-center gap-3 py-1.5 px-3 rounded hover:bg-white/5">
                            <span className="text-xs text-cyber-purple w-8 text-center">{i + 1}</span>
                            <span className="text-sm text-gray-300">{ch.title}</span>
                            <span className="text-xs text-gray-600 ml-auto">{ch.pageCount}页</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 阅读按钮 */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStartReading(showBookDetail)}
                      className="mt-6 w-full py-3 bg-gradient-to-r from-cyber-purple to-cyber-blue text-white font-medium rounded-xl shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
                    >
                      <BookText size={18} />
                      {readingProgress[showBookDetail.id] ? '继续阅读' : '开始阅读'}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookLibrary;
