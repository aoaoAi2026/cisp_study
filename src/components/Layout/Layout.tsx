import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { useLearningStore } from '../../store/learningStore';
import { api } from '../../api/client';

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const loadFromServer = useLearningStore((s) => s.loadFromServer);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (api.getToken() && !loaded) {
      loadFromServer().finally(() => setLoaded(true));
    } else {
      setLoaded(true);
    }
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
