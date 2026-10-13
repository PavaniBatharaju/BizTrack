import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/auth/AuthLayout';
import { TextInput } from '../components/auth/TextInput';
import { AuthButton } from '../components/auth/AuthButton';
import { FormError } from '../components/auth/FormError';
import { Mail, ArrowLeft, CheckCircle2, KeyRound, ArrowRight } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { sendPasswordResetEmail } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(cleanEmail);
      setIsSuccess(true);
    } catch (err) {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-left space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold mb-1">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Account Recovery</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Forgot Your Password?
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Enter your email address and we'll send you a password reset link.
          </p>
        </div>

        {/* Global Error Banner */}
        <FormError message={error} id="forgot-password-error" />

        {isSuccess ? (
          <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="p-4 bg-emerald-50 border border-emerald-200/90 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Reset Link Dispatched</span>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed">
                If an account exists for <strong className="font-bold text-emerald-950">{email}</strong>, a password reset link has been sent to your inbox.
              </p>
            </div>

            {/* Quick direct preview shortcut button to Reset Password page */}
            <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-2">
              <p className="text-xs font-bold text-indigo-950">Development & Testing Fast-Forward:</p>
              <p className="text-[11px] text-slate-600">
                Click below to simulate opening the secure link sent to your email:
              </p>
              <Link
                to="/reset-password"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all"
              >
                <span>Proceed to Reset Password Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>
            <TextInput
              id="forgot-email"
              label="Registered Email Address"
              type="email"
              placeholder="Enter your email address"
              icon={Mail}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              required
              autoComplete="email"
            />

            <div className="pt-2">
              <AuthButton
                id="forgot-submit-button"
                type="submit"
                isLoading={isSubmitting}
                loadingText="Sending reset link..."
              >
                Send Reset Link
              </AuthButton>
            </div>

            <div className="pt-2 border-t border-slate-100 text-center">
              <Link
                to="/login"
                id="link-back-login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};
