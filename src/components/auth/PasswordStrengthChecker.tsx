import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthCheckerProps {
  password: string;
}

export const checkPasswordCriteria = (password: string) => {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };
};

export const isPasswordValid = (password: string): boolean => {
  const criteria = checkPasswordCriteria(password);
  return criteria.minLength && criteria.hasUppercase && criteria.hasLowercase && criteria.hasNumber;
};

export const PasswordStrengthChecker: React.FC<PasswordStrengthCheckerProps> = ({ password }) => {
  const criteria = checkPasswordCriteria(password);

  const requirements = [
    { label: 'At least 8 characters', met: criteria.minLength },
    { label: 'One uppercase letter (A-Z)', met: criteria.hasUppercase },
    { label: 'One lowercase letter (a-z)', met: criteria.hasLowercase },
    { label: 'One number (0-9)', met: criteria.hasNumber },
  ];

  const totalMet = requirements.filter((r) => r.met).length;

  return (
    <div className="space-y-2 p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 text-left">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Password Strength
        </span>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
            totalMet === 4
              ? 'bg-emerald-100 text-emerald-700'
              : totalMet >= 2
              ? 'bg-amber-100 text-amber-700'
              : 'bg-slate-200 text-slate-600'
          }`}
        >
          {totalMet === 4 ? 'Strong' : totalMet >= 2 ? 'Medium' : 'Weak'}
        </span>
      </div>

      {/* Progress meter */}
      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex gap-1">
        <div
          className={`h-full flex-1 rounded-full transition-all duration-300 ${
            totalMet >= 1 ? (totalMet === 4 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-slate-200'
          }`}
        />
        <div
          className={`h-full flex-1 rounded-full transition-all duration-300 ${
            totalMet >= 2 ? (totalMet === 4 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-slate-200'
          }`}
        />
        <div
          className={`h-full flex-1 rounded-full transition-all duration-300 ${
            totalMet >= 3 ? (totalMet === 4 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-slate-200'
          }`}
        />
        <div
          className={`h-full flex-1 rounded-full transition-all duration-300 ${
            totalMet === 4 ? 'bg-emerald-500' : 'bg-slate-200'
          }`}
        />
      </div>

      {/* Requirement List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
        {requirements.map((req, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              req.met ? 'text-emerald-700 font-semibold' : 'text-slate-500'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
                req.met ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-400'
              }`}
            >
              {req.met ? <Check className="w-2.5 h-2.5" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
            </div>
            <span className="text-[11px] leading-tight">{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
