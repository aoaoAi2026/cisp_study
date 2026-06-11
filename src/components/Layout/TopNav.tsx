import React from 'react';
import { useUserStore, useLearningStore } from '../../store';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, LogOut, Settings } from 'lucide-react';

export const TopNav: React.FC = () => {
  const { user, logout } = useUserStore();
  const { completedDays } = useLearningStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user?.name || '访客';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="h-16 bg-cyber-purple/50 backdrop-blur-xl border-b border-cyber-green/10">
      <div className="h-full flex items-center justify-between px-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="搜索知识点、实验..."
              className="w-full bg-cyber-black/50 border border-cyber-green/20 rounded-lg
                         pl-10 pr-4 py-2 text-sm text-gray-300 placeholder-gray-500
                         focus:outline-none focus:border-cyber-green/50 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-400 hover:text-cyber-green transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-cyber-red rounded-full" />
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-cyber-green/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-green to-cyber-blue flex items-center justify-center">
              <span className="text-cyber-black font-bold text-sm">{initial}</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-200">{displayName}</p>
              <p className="text-xs text-gray-500">已学习 {completedDays.length} 天</p>
            </div>

            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={() => navigate('/profile')}
                className="p-2 text-gray-400 hover:text-cyber-green transition-colors"
                title="设置"
              >
                <Settings size={18} />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-cyber-red transition-colors"
                title="退出"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
