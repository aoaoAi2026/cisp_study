import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/UI';
import { Book, BookChapter } from '../data/books';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TextToSpeechPlayer from '../components/TextToSpeechPlayer';
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  List,
  Star,
  Clock,
  Users,
  BookMarked,
  Menu,
  X,
  BookmarkPlus,
  BookmarkCheck,
  Sun,
  Moon,
  Type,
  Hash,
  ChevronDown,
  Lightbulb,
  Target,
} from 'lucide-react';

interface BookReaderProps {
  book: Book;
  onBack: () => void;
  onProgressUpdate?: (chapter: number, progress: number) => void;
}

const BookReader: React.FC<BookReaderProps> = ({ book, onBack, onProgressUpdate }) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState<'light' | 'dark' | 'sepia'>('dark');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showToc, setShowToc] = useState(false);
  const [chapterContent, setChapterContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // 读取上次阅读进度
  useEffect(() => {
    try {
      const saved = localStorage.getItem('reading_progress');
      if (saved) {
        const all = JSON.parse(saved);
        if (all[book.id]) {
          setCurrentChapterIndex(Math.max(0, all[book.id].chapter - 1));
        }
      }
    } catch {}
  }, [book.id]);

  const currentChapter = book.chapters[currentChapterIndex];

  useEffect(() => {
    const loadChapterContent = async () => {
      if (currentChapter.content) {
        setChapterContent(currentChapter.content);
        return;
      }
      if (book.folder && currentChapter.fileName) {
        setLoading(true);
        try {
          const filePath = `/books_export/books_export/${encodeURIComponent(book.folder)}/${encodeURIComponent(currentChapter.fileName)}`;
          const response = await fetch(filePath);
          if (response.ok) {
            const text = await response.text();
            setChapterContent(text);
          } else {
            setChapterContent('章节内容加载失败，请稍后重试。');
          }
        } catch (error) {
          setChapterContent('章节内容加载失败，请稍后重试。');
        } finally {
          setLoading(false);
        }
      }
    };
    loadChapterContent();
  }, [currentChapterIndex, book.folder, currentChapter.content, currentChapter.fileName]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentChapterIndex]);

  const getThemeStyles = () => {
    switch (theme) {
      case 'light':
        return {
          bg: 'bg-white',
          text: 'text-gray-900',
          secondary: 'text-gray-600',
          border: 'border-gray-200',
          card: 'bg-gray-50',
        };
      case 'sepia':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-900',
          secondary: 'text-amber-700',
          border: 'border-amber-200',
          card: 'bg-amber-100',
        };
      default:
        return {
          bg: 'bg-[#0a0f1a]',
          text: 'text-gray-200',
          secondary: 'text-gray-400',
          border: 'border-cyber-green/20',
          card: 'bg-cyber-purple/10',
        };
    }
  };

  const themeStyles = getThemeStyles();

  const goToChapter = (index: number) => {
    setCurrentChapterIndex(index);
    setShowToc(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onProgressUpdate) {
      onProgressUpdate(index + 1, 0);
    }
  };

  const nextChapter = () => {
    if (currentChapterIndex < book.chapters.length - 1) {
      goToChapter(currentChapterIndex + 1);
    }
  };

  const prevChapter = () => {
    if (currentChapterIndex > 0) {
      goToChapter(currentChapterIndex - 1);
    }
  };

  return (
    <div className={`min-h-screen ${themeStyles.bg} transition-colors duration-300`}>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-cyber-purple to-cyber-blue"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Navigation */}
      <div className={`sticky top-0 z-40 ${themeStyles.bg} border-b ${themeStyles.border} backdrop-blur-xl bg-opacity-90`}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className={`p-2 rounded-lg hover:${themeStyles.card} transition-colors`}
            >
              <ArrowLeft size={20} className={themeStyles.text} />
            </button>
            <div>
              <h2 className={`font-medium ${themeStyles.text} line-clamp-1`}>{book.title}</h2>
              <p className={`text-xs ${themeStyles.secondary}`}>
                第 {currentChapterIndex + 1} / {book.chapters.length} 章
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowToc(!showToc)}
              className={`p-2 rounded-lg hover:${themeStyles.card} transition-colors lg:hidden`}
            >
              <List size={20} className={themeStyles.text} />
            </button>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-lg hover:${themeStyles.card} transition-colors`}
            >
              {isBookmarked ? (
                <BookmarkCheck size={20} className="text-cyber-purple" />
              ) : (
                <BookmarkPlus size={20} className={themeStyles.text} />
              )}
            </button>
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                className={`p-2 rounded-lg hover:${themeStyles.card} transition-colors`}
              >
                <Hash size={16} className={themeStyles.text} />
              </button>
              <button
                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                className={`p-2 rounded-lg hover:${themeStyles.card} transition-colors`}
              >
                <Type size={20} className={themeStyles.text} />
              </button>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => setTheme('dark')}
                className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-cyber-purple/20' : `hover:${themeStyles.card}`}`}
              >
                <Moon size={18} className={theme === 'dark' ? 'text-cyber-purple' : themeStyles.text} />
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`p-2 rounded-lg transition-colors ${theme === 'light' ? 'bg-cyber-purple/20' : `hover:${themeStyles.card}`}`}
              >
                <Sun size={18} className={theme === 'light' ? 'text-cyber-purple' : themeStyles.text} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto flex">
        {/* Desktop Sidebar - Table of Contents */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-20 p-4">
            <div className={`rounded-xl ${themeStyles.card} border ${themeStyles.border} p-4`}>
              <h3 className={`font-medium ${themeStyles.text} mb-3 flex items-center gap-2`}>
                <BookOpen size={18} className="text-cyber-purple" />
                目录
              </h3>
              <div className="space-y-1">
                {book.chapters.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    onClick={() => goToChapter(index)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      currentChapterIndex === index
                        ? 'bg-cyber-purple/20 text-cyber-purple'
                        : `${themeStyles.secondary} hover:bg-cyber-purple/10`
                    }`}
                  >
                    <span className="line-clamp-1">{chapter.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Book Info Card */}
            <div className={`mt-4 rounded-xl ${themeStyles.card} border ${themeStyles.border} p-4`}>
              <h3 className={`font-medium ${themeStyles.text} mb-3 flex items-center gap-2`}>
                <BookMarked size={18} className="text-cyber-blue" />
                书籍信息
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className={themeStyles.secondary}>作者</span>
                  <span className={themeStyles.text}>{book.author}</span>
                </div>
                <div className="flex justify-between">
                  <span className={themeStyles.secondary}>分类</span>
                  <span className={themeStyles.text}>{book.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className={themeStyles.secondary}>页数</span>
                  <span className={themeStyles.text}>{book.pages}页</span>
                </div>
                <div className="flex justify-between">
                  <span className={themeStyles.secondary}>出版</span>
                  <span className={themeStyles.text}>{book.publishYear}年</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={themeStyles.secondary}>评分</span>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-cyber-gold" fill="currentColor" />
                    <span className={themeStyles.text}>{book.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className={themeStyles.secondary}>读者</span>
                  <div className="flex items-center gap-1">
                    <Users size={12} className={themeStyles.secondary} />
                    <span className={themeStyles.text}>{book.readers.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile TOC Drawer */}
        <AnimatePresence>
          {showToc && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setShowToc(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween' }}
                className={`fixed left-0 top-0 bottom-0 w-72 ${themeStyles.bg} border-r ${themeStyles.border} z-50 p-4 overflow-y-auto lg:hidden`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-medium ${themeStyles.text}`}>目录</h3>
                  <button onClick={() => setShowToc(false)}>
                    <X size={20} className={themeStyles.text} />
                  </button>
                </div>
                <div className="space-y-1">
                  {book.chapters.map((chapter, index) => (
                    <button
                      key={chapter.id}
                      onClick={() => goToChapter(index)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        currentChapterIndex === index
                          ? 'bg-cyber-purple/20 text-cyber-purple'
                          : `${themeStyles.secondary} hover:bg-cyber-purple/10`
                      }`}
                    >
                      {chapter.title}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="px-4 py-8 md:px-8">
            {/* Chapter Title */}
            <motion.div
              key={currentChapter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <div className={`inline-block px-3 py-1 rounded-full text-xs ${themeStyles.card} ${themeStyles.secondary} mb-4`}>
                  第 {currentChapterIndex + 1} 章
                </div>
                <h1 className={`text-3xl md:text-4xl font-bold ${themeStyles.text} mb-4`}>
                  {currentChapter.title}
                </h1>
                <div className={`flex items-center gap-4 text-sm ${themeStyles.secondary}`}>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    约 {currentChapter.pageCount} 页
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen size={14} />
                    阅读进度 {Math.round(((currentChapterIndex + 1) / book.chapters.length) * 100)}%
                  </span>
                </div>
              </div>

              {/* Chapter Content */}
              <article
                className={`prose prose-lg max-w-none ${
                  theme === 'dark' ? 'prose-invert' : ''
                }`}
                style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-purple"></div>
                    <span className="ml-3 text-gray-400">加载中...</span>
                  </div>
                ) : chapterContent ? (
                  <>
                    <TextToSpeechPlayer text={chapterContent} isDark={theme === 'dark'} />
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {chapterContent}
                    </ReactMarkdown>
                  </>
                ) : (
                  <div className="text-center py-10 text-gray-400">暂无内容</div>
                )}
              </article>

              {/* Chapter Navigation */}
              <div className="mt-12 pt-8 border-t border-cyber-green/20">
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={prevChapter}
                    disabled={currentChapterIndex === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      currentChapterIndex === 0
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-cyber-purple/20'
                    } ${themeStyles.text}`}
                  >
                    <ChevronLeft size={20} />
                    <span className="hidden sm:inline">上一章</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {book.chapters.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goToChapter(i)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          i === currentChapterIndex
                            ? 'bg-cyber-purple'
                            : 'bg-gray-600 hover:bg-cyber-purple/50'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextChapter}
                    disabled={currentChapterIndex === book.chapters.length - 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      currentChapterIndex === book.chapters.length - 1
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-cyber-purple/20'
                    } ${themeStyles.text}`}
                  >
                    <span className="hidden sm:inline">下一章</span>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Chapter Highlights (for first chapter) */}
              {currentChapterIndex === 0 && book.highlights && (
                <div className="mt-8">
                  <div className={`rounded-xl ${themeStyles.card} border ${themeStyles.border} p-6`}>
                    <h3 className={`font-bold ${themeStyles.text} mb-4 flex items-center gap-2`}>
                      <Lightbulb size={20} className="text-cyber-gold" />
                      本章重点
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {book.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Target size={16} className="text-cyber-purple mt-0.5 flex-shrink-0" />
                          <span className={`text-sm ${themeStyles.secondary}`}>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>

    </div>
  );
};

export default BookReader;
