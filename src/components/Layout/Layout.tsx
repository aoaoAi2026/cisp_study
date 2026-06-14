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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function init() {
      // 恢复用户登录状态（从 Capacitor Preferences / localStorage）
      await initFromStorage();
      // 加载学习进度
      const token = await api.getToken();
      if (token) {
        await loadFromServer();
      }
      setLoaded(true);
    }
    init();
  }, []);

  return (
    <div className="min-h-screen bg-cyber-black grid-bg">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="lg:ml-64">
        <TopNav />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
