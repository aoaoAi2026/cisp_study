import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Code,
  FileQuestion,
  Award,
  Users,
  User,
  Menu,
  X,
  FileText,
  Target,
  Play,
  Lightbulb,
  Server,
  Shield,
  Globe,
  Brain
} from 'lucide-react';
import { SearchBox } from './SearchBox';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

const navItems = [
  { path: '/', icon: Home, label: '首页仪表盘' },
  { path: '/learning', icon: BookOpen, label: '学习路径' },
  { path: '/cyber-learning', icon: Globe, label: '🛡️ 网络安全学习' },
  { path: '/flashcards', icon: Brain, label: '闪卡复习' },
  { path: '/outline', icon: FileText, label: '考试大纲' },
  { path: '/past-papers', icon: FileQuestion, label: '历年真题' },
  { path: '/mock-exam', icon: Play, label: '模拟考试' },
  { path: '/study-tips', icon: Lightbulb, label: '学习技巧' },
  { path: '/lab', icon: Code, label: '代码实验室' },
  { path: '/lab-environment', icon: Server, label: '实验环境' },
  { path: '/tool-sites', icon: Globe, label: '工具网站' },
  { path: '/quiz', icon: Target, label: '测验中心' },
  { path: '/achievements', icon: Award, label: '成就系统' },
  { path: '/community', icon: Users, label: '社区交流' },
  { path: '/profile', icon: User, label: '个人中心' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onToggle }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-cyber-purple/80 backdrop-blur-xl
          border-r border-cyber-green/10 z-50 transition-transform duration-300
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-cyber-green/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-green to-cyber-blue flex items-center justify-center">
              <span className="text-cyber-black font-bold text-lg">C</span>
            </div>
            <div>
              <h1 className="font-orbitron text-sm font-bold text-cyber-green">
                CISP学习
              </h1>
              <p className="text-xs text-gray-400">零基础入门</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-cyber-green transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Box */}
        <div className="px-4 pt-4">
          <SearchBox />
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive
                  ? 'bg-cyber-green/10 text-cyber-green border border-cyber-green/30'
                  : 'text-gray-400 hover:text-cyber-green hover:bg-cyber-green/5'
                }
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-cyber-green/10">
          <div className="text-xs text-gray-500 text-center">
            <p>CISP学习平台 v1.0</p>
            <p className="mt-1">90天成为安全专家</p>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-30 lg:hidden bg-cyber-purple/80 backdrop-blur-xl p-2 rounded-lg border border-cyber-green/20 text-cyber-green"
        style={{ display: isOpen ? 'none' : 'block' }}
      >
        <Menu size={20} />
      </button>
    </>
  );
};
