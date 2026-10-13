import React, { useState } from 'react';
import { Customer } from '../../../types';
import { Modal } from '../../ui/Modal';
import { useBiz } from '../../../context/BizContext';
import { MessageSquare, Mail, Phone, Send, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../../../utils/formatters';

interface ReminderModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  customer,
  isOpen,
  onClose,
}) => {
  const { businessProfile, showToast } = useBiz();
  const [channel, setChannel] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');

  if (!customer) return null;

  const defaultMessage = `Dear ${customer.name}, this is a gentle reminder from ${businessProfile.businessName} regarding the pending balance of ${formatINR(customer.pendingAmount)}. Kindly arrange for payment at your earliest convenience. UPI / Bank details: HDFC Bank A/C 50200049281728, IFSC HDFC0001248. Thank you!`;

  const [message, setMessage] = useState(defaultMessage);

  const handleSend = () => {
    showToast(
      'Payment Reminder Sent',
      `Reminder successfully delivered to ${customer.name} via ${channel.toUpperCase()}`,
      'success'
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Send Payment Reminder"
      subtitle={`Pending balance: ${formatINR(customer.pendingAmount)}`}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Customer info card */}
        <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs">
          <div>
            <p className="font-bold text-amber-900">{customer.name}</p>
            <p className="text-amber-700">{customer.phone} • {customer.company || 'Direct Client'}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-amber-600 block">Pending Balance</span>
            <span className="text-sm font-black text-rose-600">{formatINR(customer.pendingAmount)}</span>
          </div>
        </div>

        {/* Channel Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
            Select Notification Channel
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setChannel('whatsapp')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                channel === 'whatsapp'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              WhatsApp
            </button>

            <button
              type="button"
              onClick={() => setChannel('sms')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                channel === 'sms'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-800 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Phone className="w-5 h-5 text-indigo-600" />
              SMS
            </button>

            <button
              type="button"
              onClick={() => setChannel('email')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                channel === 'email'
                  ? 'bg-purple-50 border-purple-500 text-purple-800 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Mail className="w-5 h-5 text-purple-600" />
              Email
            </button>
          </div>
        </div>

        {/* Message preview */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Custom Message Preview
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Action */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            <Send className="w-3.5 h-3.5" /> Send Reminder Now
          </button>
        </div>
      </div>
    </Modal>
  );
};
