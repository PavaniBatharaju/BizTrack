import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
  message?: string | null;
  id?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ message, id }) => {
  if (!message) return null;

  return (
    <div
      id={id}
      role="alert"
      className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200/80 rounded-xl text-rose-700 text-xs font-semibold leading-relaxed animate-in fade-in zoom-in-95 duration-200"
    >
      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
      <span className="flex-1">{message}</span>
    </div>
  );
};
