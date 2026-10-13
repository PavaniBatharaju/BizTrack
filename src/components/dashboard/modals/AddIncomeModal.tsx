import React, { useState } from 'react';
import { useBiz } from '../../../context/BizContext';
import { Modal } from '../../ui/Modal';
import { IncomeCategory, PaymentMethod } from '../../../types';
import { PlusCircle, IndianRupee } from 'lucide-react';

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INCOME_CATEGORIES: IncomeCategory[] = [
  'Product Sales',
  'Services',
  'Consulting',
  'Wholesale',
  'Commission',
  'Rental Income',
  'Interest / Investment',
  'Other',
];

const PAYMENT_METHODS: PaymentMethod[] = [
  'UPI',
  'Cash',
  'Bank Transfer',
  'Card',
  'Cheque',
  'Other',
];

export const AddIncomeModal: React.FC<AddIncomeModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction, customers } = useBiz();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('');
  const [customer, setCustomer] = useState('');
  const [category, setCategory] = useState<IncomeCategory>('Product Sales');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    addTransaction({
      date,
      type: 'income',
      title: title.trim() || `Income from ${customer || 'Customer'}`,
      category,
      amount: numAmount,
      paymentMethod,
      counterparty: customer.trim() || 'General Customer',
      invoiceNo: invoiceNo.trim() || undefined,
      status: 'completed',
      notes: notes.trim() || undefined,
    });

    // Reset
    setTitle('');
    setCustomer('');
    setAmount('');
    setInvoiceNo('');
    setNotes('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Business Income"
      subtitle="Log incoming payments, product sales, or service revenues."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Amount (₹) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <IndianRupee className="w-4 h-4" />
              </div>
              <input
                type="number"
                min="1"
                step="any"
                required
                placeholder="e.g. 25000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Customer / Client Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            list="customer-suggestions"
            required
            placeholder="e.g. Verma Tech Solutions or Rajesh"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
          <datalist id="customer-suggestions">
            {customers.map(c => (
              <option key={c.id} value={c.name}>{c.company ? `${c.company} (${c.name})` : c.name}</option>
            ))}
          </datalist>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Description / Item Sold
          </label>
          <input
            type="text"
            placeholder="e.g. Retail Inverter & Battery Pack"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Income Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as IncomeCategory)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {INCOME_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {PAYMENT_METHODS.map(pm => (
                <option key={pm} value={pm}>{pm}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Invoice Reference No. (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. INV-2026-093"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Notes / Remark
            </label>
            <input
              type="text"
              placeholder="e.g. Advance paid, 50% remaining"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Save Income
          </button>
        </div>
      </form>
    </Modal>
  );
};
