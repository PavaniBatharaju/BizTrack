import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, currentUser } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-white">Loading BizTrack Session...</p>
            <p className="text-xs text-slate-400 mt-1">Securing your financial ledgers</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login preserving intended target
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user has not completed onboarding and is not already on onboarding
  if (currentUser && !currentUser.onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
