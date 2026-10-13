import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBiz } from '../context/BizContext';
import { AuthLayout } from '../components/auth/AuthLayout';
import { TextInput } from '../components/auth/TextInput';
import { PasswordInput } from '../components/auth/PasswordInput';
import { PasswordStrengthChecker, isPasswordValid } from '../components/auth/PasswordStrengthChecker';
import { AuthButton } from '../components/auth/AuthButton';
import { FormError } from '../components/auth/FormError';
import { TermsModal } from '../components/auth/TermsModal';
import { User as UserIcon, Building2, Mail, Phone, Sparkles } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, currentUser } = useAuth();
  const { showToast, updateBusinessProfile } = useBiz();

  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalType, setModalType] = useState<'terms' | 'privacy' | null>(null);

  // If already authenticated and onboarding completed, redirect
  useEffect(() => {
    if (isAuthenticated) {
      if (currentUser?.onboardingCompleted) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    }

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Please enter your business name.';
    }

    const cleanEmail = formData.email.trim();
    if (!cleanEmail) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    const cleanPhone = formData.phoneNumber.trim();
    if (!cleanPhone) {
      newErrors.phoneNumber = 'Please enter your phone number.';
    } else if (!/^[+0-9\s-]{8,15}$/.test(cleanPhone)) {
      newErrors.phoneNumber = 'Please enter a valid phone number.';
    }

    if (!formData.password) {
      newErrors.password = 'Please create a password.';
    } else if (!isPasswordValid(formData.password)) {
      newErrors.password = 'Password does not meet all strength requirements.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the Terms of Service and Privacy Policy.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await register({
        fullName: formData.fullName,
        businessName: formData.businessName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      });

      if (res.success) {
        // Sync into BizContext
        updateBusinessProfile({
          name: formData.fullName,
          businessName: formData.businessName,
          email: formData.email,
          phone: formData.phoneNumber,
        });

        showToast(
          'Account Created',
          "Account created successfully! Let's set up your business.",
          'success'
        );
        navigate('/onboarding', { replace: true });
      } else {
        setErrors({ form: res.error || 'Failed to create account. Please try again.' });
      }
    } catch (err) {
      setErrors({ form: 'An unexpected error occurred during registration.' });
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
            <Sparkles className="w-3.5 h-3.5" />
            <span>Free 14-Day Pro Trial</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create Your BizTrack Account
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Start managing your business finances in one place.
          </p>
        </div>

        {/* Global Error Banner */}
        <FormError message={errors.form} id="register-form-error" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              id="register-fullname"
              label="Full Name"
              placeholder="Enter your full name"
              icon={UserIcon}
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              error={errors.fullName}
              required
              autoComplete="name"
            />

            <TextInput
              id="register-businessname"
              label="Business Name"
              placeholder="Enter your business name"
              icon={Building2}
              value={formData.businessName}
              onChange={(e) => handleChange('businessName', e.target.value)}
              error={errors.businessName}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              id="register-email"
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
              icon={Mail}
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              required
              autoComplete="email"
            />

            <TextInput
              id="register-phone"
              label="Phone Number"
              type="tel"
              placeholder="Enter your phone number"
              icon={Phone}
              value={formData.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              error={errors.phoneNumber}
              required
              autoComplete="tel"
            />
          </div>

          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PasswordInput
                id="register-password"
                label="Password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                error={errors.password}
                required
                autoComplete="new-password"
              />

              <PasswordInput
                id="register-confirm-password"
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
                required
                autoComplete="new-password"
              />
            </div>

            {/* Dynamic Password Strength Indicator */}
            {formData.password && (
              <PasswordStrengthChecker password={formData.password} />
            )}
          </div>

          {/* Terms and Privacy Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                id="register-terms-agree"
                checked={formData.agreedToTerms}
                onChange={(e) => handleChange('agreedToTerms', e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 mt-0.5 cursor-pointer"
              />
              <span className="text-xs text-slate-600 leading-snug">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => setModalType('terms')}
                  className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
                >
                  Terms of Service
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={() => setModalType('privacy')}
                  className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
                >
                  Privacy Policy
                </button>
              </span>
            </label>
            {errors.agreedToTerms && (
              <p className="text-xs font-semibold text-rose-600 mt-1 pl-6">
                {errors.agreedToTerms}
              </p>
            )}
          </div>

          <div className="pt-2">
            <AuthButton
              id="register-submit-button"
              type="submit"
              isLoading={isSubmitting}
              loadingText="Creating your account..."
            >
              Create Free Account
            </AuthButton>
          </div>
        </form>

        {/* Footer link to Login */}
        <div className="pt-2 border-t border-slate-100 text-center">
          <p className="text-xs font-medium text-slate-600">
            Already have an account?{' '}
            <Link
              to="/login"
              id="link-login"
              className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Terms / Privacy Modal */}
      {modalType && (
        <TermsModal
          isOpen={true}
          onClose={() => setModalType(null)}
          type={modalType}
        />
      )}
    </AuthLayout>
  );
};
