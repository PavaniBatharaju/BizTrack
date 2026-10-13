import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBiz } from '../context/BizContext';
import { AuthLayout } from '../components/auth/AuthLayout';
import { PasswordInput } from '../components/auth/PasswordInput';
import { PasswordStrengthChecker, isPasswordValid } from '../components/auth/PasswordStrengthChecker';
import { AuthButton } from '../components/auth/AuthButton';
import { FormError } from '../components/auth/FormError';
import { ShieldAlert, CheckCircle2, ArrowLeft, Key } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { confirmPasswordReset, resetSentEmail } = useAuth();
  const { showToast } = useBiz();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; form?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: { password?: string; confirmPassword?: string; form?: string } = {};

    if (!password) {
      newErrors.password = 'Please enter a new password.';
    } else if (!isPasswordValid(password)) {
      newErrors.password = 'Password must meet all 4 security criteria.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await confirmPasswordReset(password);
      if (res.success) {
        setIsSuccess(true);
        showToast(
          'Password Reset',
          'Password reset successfully! You can now login with your new password.',
          'success'
        );
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2200);
      } else {
        setErrors({ form: res.error || 'Failed to reset password. Please try again.' });
      }
    } catch (err) {
      setErrors({ form: 'An unexpected error occurred.' });
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
            <Key className="w-3.5 h-3.5" />
            <span>Create New Password</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Reset Your Password
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            {resetSentEmail
              ? `Choose a new strong password for ${resetSentEmail}`
              : 'Choose a new strong password for your BizTrack account.'}
          </p>
        </div>

        {/* Global Error Banner */}
        <FormError message={errors.form} id="reset-password-error" />

        {isSuccess ? (
          <div className="space-y-4 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-left animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Password Updated!</span>
            </div>
            <p className="text-xs text-emerald-700 leading-relaxed">
              Password reset successfully! You can now login with your new password. Redirecting to login page...
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                <span>Login Now</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>
            <PasswordInput
              id="reset-password"
              label="New Password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={errors.password}
              required
              autoComplete="new-password"
            />

            <PasswordInput
              id="reset-confirm-password"
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              error={errors.confirmPassword}
              required
              autoComplete="new-password"
            />

            {/* Live Password Criteria */}
            {password && <PasswordStrengthChecker password={password} />}

            <div className="pt-2">
              <AuthButton
                id="reset-submit-button"
                type="submit"
                isLoading={isSubmitting}
                loadingText="Updating password..."
              >
                Reset Password
              </AuthButton>
            </div>

            <div className="pt-2 border-t border-slate-100 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Cancel and return to Login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};
