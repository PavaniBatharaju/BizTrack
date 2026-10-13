import React, { useState } from 'react';
import { useBiz } from '../../../context/BizContext';
import { Modal } from '../../ui/Modal';
import { ExpenseCategory, PaymentMethod } from '../../../types';
import { PlusCircle, IndianRupee, UploadCloud, FileCheck, X } from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Inventory',
  'Rent',
  'Salary',
  'Electricity',
  'Marketing',
  'Transportation',
  'Office',
  'Software',
  'Utilities',
  'Maintenance',
  'Other',
];

const PAYMENT_METHODS: PaymentMethod[] = [
  'UPI',
  'Bank Transfer',
  'Cash',
  'Card',
  'Cheque',
  'Other',
];

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction, suppliers } = useBiz();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('');
  const [vendor, setVendor] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Inventory');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Bank Transfer');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [notes, setNotes] = useState('');
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    addTransaction({
      date,
      type: 'expense',
      title: title.trim() || `${category} Expense - ${vendor || 'General'}`,
      category,
      amount: numAmount,
      paymentMethod,
      counterparty: vendor.trim() || 'General Vendor',
      invoiceNo: invoiceNo.trim() || undefined,
      status: 'completed',
      receiptUrl: receiptFileName ? `receipt_${Date.now()}.pdf` : undefined,
      notes: notes.trim() || undefined,
    });

    // Reset
    setTitle('');
    setVendor('');
    setAmount('');
    setInvoiceNo('');
    setNotes('');
    setReceiptFileName(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Business Expense"
      subtitle="Track outflows, bills, payroll, inventory and operational costs."
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
                placeholder="e.g. 8500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Expense Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {EXPENSE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Vendor / Payee Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              list="vendor-suggestions"
              required
              placeholder="e.g. Syscon Wholesalers or Landlord"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <datalist id="vendor-suggestions">
              {suppliers.map(s => (
                <option key={s.id} value={s.name}>{s.company ? `${s.company} (${s.name})` : s.name}</option>
              ))}
            </datalist>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Description / Item Purchased
          </label>
          <input
            type="text"
            placeholder="e.g. 10x Inverter kits restock or Shop rent August"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Bill / Receipt Reference No.
            </label>
            <input
              type="text"
              placeholder="e.g. BILL-8891"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Receipt Upload Box */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Receipt / Bill Attachment
          </label>
          {receiptFileName ? (
            <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">{receiptFileName}</span>
                <span className="text-slate-500">(Ready to attach)</span>
              </div>
              <button
                type="button"
                onClick={() => setReceiptFileName(null)}
                className="text-emerald-700 hover:text-emerald-900 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-xs font-medium text-slate-600">Click to upload bill image / PDF</span>
              <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, PDF up to 10MB</span>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          )}
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
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Record Expense
          </button>
        </div>
      </form>
    </Modal>
  );
};
