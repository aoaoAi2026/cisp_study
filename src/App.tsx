import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout } from "./components/Layout";
import AuthPage from "./pages/AuthPage";
import { api } from "./api/client";
import {
  Dashboard,
  LearningPath,
  DailyLearning,
  CodeLab,
  LabEnvironment,
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
} from "./pages";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  if (!api.getToken()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

function App() {
  const [ready, setReady] = useState(true);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="learning" element={<LearningPath />} />
          <Route path="learning/:dayId" element={<DailyLearning />} />
          <Route path="lab" element={<CodeLab />} />
          <Route path="lab-environment" element={<LabEnvironment />} />
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
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
