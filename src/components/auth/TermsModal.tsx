import React from 'react';
import { Modal } from '../ui/Modal';
import { ShieldCheck, FileText, Check } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, type }) => {
  const isTerms = type === 'terms';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isTerms ? 'BizTrack Terms of Service' : 'BizTrack Privacy Policy'}
      subtitle={isTerms ? 'Effective as of 2026 • Please review our service agreements.' : 'How we safeguard your financial and business data.'}
      maxWidth="lg"
    >
      <div className="space-y-4 text-xs text-slate-600 leading-relaxed max-h-96 overflow-y-auto pr-1">
        {isTerms ? (
          <>
            <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-indigo-900 font-medium">
              By using BizTrack PRO, you agree to comply with our commercial terms regarding financial ledger tracking, GST reporting, and data privacy.
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">1. Account & Security</h4>
              <p>
                You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account. BizTrack enforces strong password criteria and session timeouts to safeguard your business ledgers.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">2. Financial Data Ownership</h4>
              <p>
                All financial entries, customer records, supplier invoices, and transaction logs entered into BizTrack remain 100% your proprietary property. BizTrack will never sell, lease, or monetize your confidential financial telemetry.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">3. GST Compliance & Invoicing</h4>
              <p>
                BizTrack provides tax calculation aids (CGST, SGST, IGST) and printable invoice generators. Users remain responsible for verifying accuracy against official tax filings.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl text-emerald-900 font-medium">
              We employ bank-grade 256-bit SSL encryption and strict access isolation so that only you can view your business finances.
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">1. Data Encryption</h4>
              <p>
                All incoming transactions, profit calculations, customer receivables, and business credentials are encrypted at rest and in transit using industry-standard protocols.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">2. Information We Collect</h4>
              <p>
                We only collect information essential to powering your business dashboard: your verified name, business name, phone number, email address, and financial records you log.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">3. Zero Third-Party Sharing</h4>
              <p>
                We strictly do not share, sell, or advertise against your proprietary revenue, expense, customer, or supplier database.
              </p>
            </div>
          </>
        )}
      </div>

      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-end">
        <button
          onClick={onClose}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
        >
          I Understand & Close
        </button>
      </div>
    </Modal>
  );
};
