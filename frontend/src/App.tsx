import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { CareerPathsPage } from './pages/CareerPathsPage';
import { SkillsPage } from './pages/SkillsPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { TaskWorkbenchPage } from './pages/TaskWorkbenchPage';
import { ExecutionPage } from './pages/ExecutionPage';
import { FailuresSuccessesPage } from './pages/FailuresSuccessesPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { ReadinessPage } from './pages/ReadinessPage';
import { InterviewPage } from './pages/InterviewPage';
import { ResumePage } from './pages/ResumePage';
import { AdaptationsPage } from './pages/AdaptationsPage';
import { ResearchDemoPage } from './pages/ResearchDemoPage';
import { SettingsPage } from './pages/SettingsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        Initializing Career OS...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="digital-twin" element={<DigitalTwinPage />} />
            <Route path="career-paths" element={<CareerPathsPage />} />
            <Route path="skills" element={<SkillsPage />} />
            <Route path="skill-gaps" element={<SkillGapPage />} />
            <Route path="roadmap" element={<RoadmapPage />} />
            <Route path="tasks" element={<TaskWorkbenchPage />} />
            <Route path="execution" element={<ExecutionPage />} />
            <Route path="intelligence" element={<FailuresSuccessesPage />} />
            <Route path="opportunities" element={<OpportunitiesPage />} />
            <Route path="readiness" element={<ReadinessPage />} />
            <Route path="interviews" element={<InterviewPage />} />
            <Route path="resume" element={<ResumePage />} />
            <Route path="adaptations" element={<AdaptationsPage />} />
            <Route path="research" element={<ResearchDemoPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
