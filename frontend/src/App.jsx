import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './components/DashboardLayout';
import OCRUpload from './pages/OCRUpload';
import ProfilePage from './pages/ProfilePage';
import Jobs from './pages/Jobs';
import Scholarships from './pages/Scholarships';
import Schemes from './pages/Schemes';
import CareerRoadmap from './pages/CareerRoadmap';
import SkillGap from './pages/SkillGap';
import ResumeBuilder from './pages/ResumeBuilder';
import AIAssistant from './pages/AIAssistant';
import CareerSimulation from './pages/CareerSimulation';
import { AdminPanel } from './pages/StubPages';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--surface2)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                fontSize: '13px',
                fontFamily: 'Inter, sans-serif',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/documents" element={<OCRUpload />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/scholarships" element={<Scholarships />} />
              <Route path="/schemes" element={<Schemes />} />
              <Route path="/career" element={<CareerRoadmap />} />
              <Route path="/skills" element={<SkillGap />} />
              <Route path="/resume" element={<ResumeBuilder />} />
              <Route path="/assistant" element={<AIAssistant />} />
              <Route path="/simulation" element={<CareerSimulation />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
