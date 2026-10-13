import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBiz } from '../context/BizContext';
import { AuthLayout } from '../components/auth/AuthLayout';
import { TextInput } from '../components/auth/TextInput';
import { PasswordInput } from '../components/auth/PasswordInput';
import { AuthButton } from '../components/auth/AuthButton';
import { FormError } from '../components/auth/FormError';
import { Mail, Sparkles, Check } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useBiz();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; form?: string } = {};

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Please enter your password.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must contain at least 8 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await login(email, password, rememberMe);
      if (res.success) {
        showToast('Login Successful', 'Welcome back to BizTrack PRO!', 'success');
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        setErrors({
          form: res.error || 'Invalid email or password. Please try again.',
        });
      }
    } catch (err) {
      setErrors({ form: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrors({});
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-left space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Secure Access</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back 👋
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Login to continue managing your business finances.
          </p>
        </div>

        {/* Global Error Banner */}
        <FormError message={errors.form} id="login-form-error" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>
          <TextInput
            id="login-email"
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            icon={Mail}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={errors.email}
            required
            autoComplete="email"
          />

          <div className="space-y-2">
            <PasswordInput
              id="login-password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={errors.password}
              required
              autoComplete="current-password"
            />

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="login-remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-600">Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                id="link-forgot-password"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <AuthButton
              id="login-submit-button"
              type="submit"
              isLoading={isSubmitting}
              loadingText="Logging in..."
            >
              Login
            </AuthButton>
          </div>
        </form>

        {/* Quick Demo Logins Pill Box for Testing */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-left">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Quick Test Accounts
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('demo@biztrack.in', 'Password@123')}
              className="px-2.5 py-1 text-xs font-medium bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
            >
              demo@biztrack.in
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('pavanibatharaju@gmail.com', 'BizTrack@2026')}
              className="px-2.5 py-1 text-xs font-medium bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
            >
              pavanibatharaju@gmail.com
            </button>
          </div>
        </div>

        {/* Footer link to Register */}
        <div className="pt-2 border-t border-slate-100 text-center">
          <p className="text-xs font-medium text-slate-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              id="link-signup"
              className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};
