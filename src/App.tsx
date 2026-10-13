import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BizProvider, useBiz } from './context/BizContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LandingPage } from './components/landing/LandingPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { ToastContainer } from './components/ui/Toast';

const DashboardWrapper: React.FC = () => {
  const navigate = useNavigate();
  return <Dashboard onNavigateLanding={() => navigate('/')} />;
};

const AppContent: React.FC = () => {
  const { toasts, removeToast } = useBiz();

  return (
    <div className="min-h-screen bg-slate-900 font-sans antialiased text-slate-900">
      <Routes>
        {/* Public Landing & Marketing */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<LandingPage />} />
        <Route path="/solutions" element={<LandingPage />} />
        <Route path="/resources" element={<LandingPage />} />
        <Route path="/pricing" element={<LandingPage />} />

        {/* Authentication Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Onboarding Flow (Protected) */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        {/* Core Financial Workspace Dashboard (Protected) */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardWrapper />
            </ProtectedRoute>
          }
        />

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Real-time Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BizProvider>
          <AppContent />
        </BizProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
