import React, { useState } from 'react';
import { useBiz } from '../../../context/BizContext';
import { Modal } from '../../ui/Modal';
import { InvoiceItem, PaymentMethod } from '../../../types';
import { Plus, Trash2, IndianRupee, FileText } from 'lucide-react';
import { formatINR } from '../../../utils/formatters';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ isOpen, onClose }) => {
  const { createInvoice, customers, invoices } = useBiz();

  const nextInvNum = `INV-${new Date().getFullYear()}-${String(invoices.length + 93).padStart(3, '0')}`;

  const [invoiceNumber, setInvoiceNumber] = useState(nextInvNum);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  });

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerGstin, setCustomerGstin] = useState('');
  const [status, setStatus] = useState<'paid' | 'pending'>('pending');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [notes, setNotes] = useState('Thank you for your business. Free on-site support included.');
  const [terms, setTerms] = useState('Payment is due within 15 days of invoice date.');

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 'item-1',
      description: 'Luminous Solar Inverter Combo Unit',
      hsn: '85044090',
      qty: 1,
      rate: 18500,
      taxRate: 18,
      amount: 18500,
    }
  ]);

  const handleCustomerSelect = (name: string) => {
    setCustomerName(name);
    const existing = customers.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      if (existing.phone) setCustomerPhone(existing.phone);
      if (existing.email) setCustomerEmail(existing.email);
      if (existing.address) setCustomerAddress(existing.address);
      if (existing.gstin) setCustomerGstin(existing.gstin);
    }
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, val: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: val };
    
    if (field === 'qty' || field === 'rate') {
      const q = field === 'qty' ? Number(val) : item.qty;
      const r = field === 'rate' ? Number(val) : item.rate;
      item.amount = (q || 0) * (r || 0);
    }
    
    updated[index] = item;
    setItems(updated);
  };

  const addItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        description: '',
        hsn: '8504',
        qty: 1,
        rate: 0,
        taxRate: 18,
        amount: 0,
      }
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  // Calculations
  const subtotal = items.reduce((sum, it) => sum + (it.amount || 0), 0);
  const taxAmount = items.reduce((sum, it) => sum + ((it.amount || 0) * (it.taxRate || 0) / 100), 0);
  const totalAmount = Math.max(0, subtotal + taxAmount - (Number(discountAmount) || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || items.length === 0) return;

    createInvoice({
      invoiceNumber,
      date,
      dueDate,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || undefined,
      customerEmail: customerEmail.trim() || undefined,
      customerAddress: customerAddress.trim() || undefined,
      customerGstin: customerGstin.trim() || undefined,
      items,
      subtotal,
      taxAmount,
      discountAmount: Number(discountAmount) || 0,
      totalAmount,
      notes,
      terms,
      status,
      paymentMethod: status === 'paid' ? paymentMethod : undefined,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Tax Invoice"
      subtitle="Generate a GST-ready invoice for your client with tax calculation."
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Invoice Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50/80 rounded-xl border border-slate-200">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Invoice Number
            </label>
            <input
              type="text"
              required
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Invoice Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Due Date
            </label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Customer Information */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Bill To Customer</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer / Business Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                list="invoice-cust-list"
                required
                placeholder="e.g. Verma Tech Solutions"
                value={customerName}
                onChange={(e) => handleCustomerSelect(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <datalist id="invoice-cust-list">
                {customers.map(c => (
                  <option key={c.id} value={c.name}>{c.company}</option>
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+91 98450 11223"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Billing Address</label>
              <input
                type="text"
                placeholder="e.g. 100ft Road, Indiranagar, Bengaluru"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Customer GSTIN (Optional)</label>
              <input
                type="text"
                placeholder="29ABCDE1234F1Z5"
                value={customerGstin}
                onChange={(e) => setCustomerGstin(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Products & Services</h4>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Row
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-2.5 pl-3">Item Description</th>
                  <th className="p-2.5 w-20">HSN</th>
                  <th className="p-2.5 w-16 text-right">Qty</th>
                  <th className="p-2.5 w-24 text-right">Rate (₹)</th>
                  <th className="p-2.5 w-20 text-center">GST %</th>
                  <th className="p-2.5 w-24 text-right">Amount (₹)</th>
                  <th className="p-2.5 w-10 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="p-2 pl-3">
                      <input
                        type="text"
                        required
                        placeholder="Product / Service description"
                        value={item.description}
                        onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="8504"
                        value={item.hsn || ''}
                        onChange={(e) => handleItemChange(idx, 'hsn', e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-md text-xs font-mono text-center focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="1"
                        required
                        value={item.qty}
                        onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-md text-xs text-right focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        required
                        value={item.rate}
                        onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-md text-xs text-right font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={item.taxRate}
                        onChange={(e) => handleItemChange(idx, 'taxRate', Number(e.target.value))}
                        className="w-full px-1.5 py-1.5 border border-slate-200 rounded-md text-xs text-center focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      >
                        <option value={0}>0%</option>
                        <option value={5}>5%</option>
                        <option value={12}>12%</option>
                        <option value={18}>18%</option>
                        <option value={28}>28%</option>
                      </select>
                    </td>
                    <td className="p-2 text-right font-semibold text-slate-900">
                      {formatINR(item.amount)}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        disabled={items.length <= 1}
                        onClick={() => removeItem(idx)}
                        className="text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice Summary & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Invoice Notes / Warranty Terms</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="pending">Pending Payment</option>
                  <option value="paid">Mark as Paid</option>
                </select>
              </div>

              {status === 'paid' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Taxable Subtotal:</span>
              <span className="font-semibold text-slate-900">{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST Tax Amount (CGST + SGST):</span>
              <span className="font-semibold text-slate-900">+{formatINR(taxAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 pt-1">
              <span>Discount (₹):</span>
              <input
                type="number"
                min="0"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(Number(e.target.value))}
                className="w-24 px-2 py-1 bg-white border border-slate-200 rounded text-right text-xs font-semibold text-rose-600 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div className="border-t border-slate-200 pt-2.5 flex justify-between text-sm font-bold text-slate-900">
              <span>Total Invoice Amount:</span>
              <span className="text-base text-indigo-700">{formatINR(totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Submit */}
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
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <FileText className="w-4 h-4" /> Generate Invoice
          </button>
        </div>
      </form>
    </Modal>
  );
};
