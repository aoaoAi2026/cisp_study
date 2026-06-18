import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { useLearningStore } from '../../store/learningStore';
import { useUserStore } from '../../store/userStore';
import { api } from '../../api/client';

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const loadFromServer = useLearningStore((s) => s.loadFromServer);
  const initFromStorage = useUserStore((s) => s.initFromStorage);

  useEffect(() => {
    async function init() {
      // 恢复用户登录状态（从 Capacitor Preferences / localStorage）
      await initFromStorage();
      // 加载学习进度
      const token = await api.getToken();
      if (token) {
        await loadFromServer();
      }
    }
    init();
  }, []);

  return (
    <div className="min-h-screen bg-cyber-black grid-bg">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* 主内容区域 */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'fixed inset-0 z-40 lg:relative lg:inset-auto' : ''}`}>
        {/* 移动端遮罩层（当侧边栏打开时） */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* 实际内容 */}
        <div className="min-h-screen lg:ml-64 relative z-10">
          <TopNav />

          <main className="p-3 sm:p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
