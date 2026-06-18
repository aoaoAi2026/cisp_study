import { HashRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import {
  Dashboard,
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
  OnlineTools,
  CyberLearningMain,
  CyberDailyLearning,
  InterviewLearningMain,
  InterviewDailyLearning,
  ResourceLibrary,
  ResourceDetail,
  QuestionBank,
  QuestionBankTabs,
} from "./pages";
import AuthPage from "./pages/AuthPage";
import { useUserStore } from "./store/userStore";
import { useEffect, useState } from "react";

// 旧 /learning 重定向到 /cyber-learning/cisp
function CispDayRedirect() {
  const { dayId } = useParams<{ dayId: string }>();
  return <Navigate to={`/cyber-learning/cisp/${dayId}`} replace />;
}

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
            <ErrorBoundary>
              <Layout />
            </ErrorBoundary>
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="learning" element={<Navigate to="/cyber-learning" replace />} />
          <Route path="learning/:dayId" element={<CispDayRedirect />} />
          <Route path="lab" element={<CodeLab />} />
          <Route path="lab/code-runner" element={<CodeRunner />} />
          <Route path="lab/environment" element={<LabEnvironment />} />
          <Route path="lab-environment" element={<Navigate to="/lab/environment" replace />} />
          <Route path="code-runner" element={<Navigate to="/lab/code-runner" replace />} />
          <Route path="flashcards" element={<Navigate to="/question-bank/past-papers" replace />} />
          <Route path="cyber-learning" element={<CyberLearningMain />} />
          <Route path="cyber-learning/cisp/:dayId" element={<DailyLearning />} />
          <Route path="cyber-learning/:planId" element={<CyberDailyLearning />} />
          <Route path="interview-learning" element={<InterviewLearningMain />} />
          <Route path="interview-learning/:planId" element={<InterviewDailyLearning />} />
          <Route path="question-bank" element={<QuestionBank />}>
            <Route index element={<QuestionBankTabs />} />
            <Route path="quiz" element={<QuizCenter />} />
            <Route path="past-papers" element={<PastPapers />} />
            <Route path="mock-exam" element={<MockExam />} />
          </Route>
          <Route path="outline" element={<ExamOutline />} />
          <Route path="study-tips" element={<StudyTips />} />
          <Route path="tool-sites" element={<ToolSites />} />
          <Route path="online-tools" element={<OnlineTools />} />
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
