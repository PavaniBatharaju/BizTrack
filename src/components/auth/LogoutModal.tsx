import React from 'react';
import { Modal } from '../ui/Modal';
import { LogOut, AlertTriangle } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Logout?"
      subtitle="Are you sure you want to logout from your BizTrack account?"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="p-3.5 bg-rose-50/80 border border-rose-100 rounded-2xl flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <LogOut className="w-4 h-4" />
          </div>
          <p className="text-xs text-rose-900 leading-relaxed pt-0.5">
            Your active session will be securely cleared. You will need to log back in to access your business ledgers and financial dashboard.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-2"
          >
            {isLoading ? (
              <span>Logging out...</span>
            ) : (
              <>
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
