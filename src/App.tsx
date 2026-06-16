import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import {
  Dashboard,
  LearningPath,
  DailyLearning,
  CodeLab,
  LabEnvironment,
  CodeRunner,
  QuizCenter,
  Achievements,
  Community,
  Profile,
  ExamOutline,
  PastPapers,
  MockExam,
  StudyTips,
  ToolSites,
  Flashcards,
  CyberLearningMain,
  CyberDailyLearning,
  ResourceLibrary,
  ResourceDetail,
} from "./pages";
import AuthPage from "./pages/AuthPage";
import { useUserStore } from "./store/userStore";
import { useEffect, useState } from "react";

// 受保护的路由组件
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useUserStore((s) => s.user);
  const initFromStorage = useUserStore((s) => s.initFromStorage);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function check() {
      await initFromStorage();
      setChecking(false);
    }
    check();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-cyber-black flex items-center justify-center">
        <div className="text-cyber-green animate-pulse">加载中...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* 登录/注册页面（公开） */}
        <Route path="/auth" element={<AuthPage />} />

        {/* 受保护的页面（需要登录） */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="learning" element={<LearningPath />} />
          <Route path="learning/:dayId" element={<DailyLearning />} />
          <Route path="lab" element={<CodeLab />} />
          <Route path="lab-environment" element={<LabEnvironment />} />
          <Route path="code-runner" element={<CodeRunner />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="cyber-learning" element={<CyberLearningMain />} />
          <Route path="cyber-learning/:planId" element={<CyberDailyLearning />} />
          <Route path="quiz" element={<QuizCenter />} />
          <Route path="outline" element={<ExamOutline />} />
          <Route path="past-papers" element={<PastPapers />} />
          <Route path="mock-exam" element={<MockExam />} />
          <Route path="study-tips" element={<StudyTips />} />
          <Route path="tool-sites" element={<ToolSites />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="community" element={<Community />} />
          <Route path="profile" element={<Profile />} />
          <Route path="resources" element={<ResourceLibrary />} />
          <Route path="resources/:resourceId" element={<ResourceDetail />} />
        </Route>

        {/* 未登录时访问其他路径也重定向到登录页 */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
