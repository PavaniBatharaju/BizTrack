import React from 'react';
import { useBiz } from '../../../context/BizContext';
import { Invoice } from '../../../types';
import { Modal } from '../../ui/Modal';
import { 
  Printer, 
  Send, 
  CheckCircle2, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  IndianRupee 
} from 'lucide-react';
import { formatINR, formatDate } from '../../../utils/formatters';

interface InvoicePreviewModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  invoice,
  isOpen,
  onClose,
}) => {
  const { businessProfile, markInvoicePaid, showToast } = useBiz();

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSend = () => {
    showToast(
      'Invoice Sent',
      `Invoice #${invoice.invoiceNumber} dispatched to ${invoice.customerName} via Email & WhatsApp.`,
      'success'
    );
  };

  const isPaid = invoice.status === 'paid';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Tax Invoice — ${invoice.invoiceNumber}`}
      subtitle={`Created on ${formatDate(invoice.date)}`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Actions bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 no-print">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isPaid
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : invoice.status === 'overdue'
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              Status: {invoice.status}
            </span>
            {invoice.paymentMethod && (
              <span className="text-xs text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                via {invoice.paymentMethod}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isPaid && (
              <button
                onClick={() => {
                  markInvoicePaid(invoice.id);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Mark as Paid
              </button>
            )}

            <button
              onClick={handleSend}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" /> Send to Client
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </button>
          </div>
        </div>

        {/* Formatted Invoice Paper Layout */}
        <div 
          id="printable-invoice" 
          className="p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-800 text-xs leading-normal printable-card"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
                  BT
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {businessProfile.businessName}
                </h2>
              </div>
              <p className="text-slate-500 text-[11px] mb-2">{businessProfile.tagline}</p>
              <div className="text-slate-600 space-y-0.5 text-[11px]">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  {businessProfile.address}, {businessProfile.city}, {businessProfile.state} - {businessProfile.pincode}
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                  {businessProfile.phone}
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                  {businessProfile.email}
                </p>
                <p className="font-mono text-slate-700 font-medium">
                  GSTIN: {businessProfile.gstin}
                </p>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 font-bold uppercase tracking-wider text-xs rounded-md mb-2">
                TAX INVOICE
              </span>
              <p className="text-lg font-black text-slate-900 font-mono">
                #{invoice.invoiceNumber}
              </p>
              <div className="text-slate-600 text-[11px] space-y-0.5 mt-2">
                <p><span className="font-semibold text-slate-700">Invoice Date:</span> {formatDate(invoice.date)}</p>
                <p><span className="font-semibold text-slate-700">Due Date:</span> {formatDate(invoice.dueDate)}</p>
                {invoice.paidDate && (
                  <p className="text-emerald-600 font-semibold">
                    Settled on: {formatDate(invoice.paidDate)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="py-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Billed To (Customer):
              </p>
              <h3 className="text-sm font-bold text-slate-900">{invoice.customerName}</h3>
              {invoice.customerAddress && <p className="text-slate-600 mt-0.5">{invoice.customerAddress}</p>}
              {invoice.customerPhone && <p className="text-slate-600">Phone: {invoice.customerPhone}</p>}
              {invoice.customerEmail && <p className="text-slate-600">Email: {invoice.customerEmail}</p>}
              {invoice.customerGstin && (
                <p className="text-slate-700 font-mono mt-0.5">GSTIN: {invoice.customerGstin}</p>
              )}
            </div>

            <div className="sm:text-right bg-slate-50/60 p-3 rounded-xl border border-slate-100 sm:bg-transparent sm:p-0 sm:border-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Payment Info:
              </p>
              <p className="font-medium text-slate-700">Bank: HDFC Bank Ltd</p>
              <p className="text-slate-600">A/C No: 50200049281728</p>
              <p className="text-slate-600">IFSC: HDFC0001248</p>
              <p className="text-slate-600">UPI ID: sharmatech@okhdfcbank</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="py-5">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider bg-slate-50">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Item & Description</th>
                  <th className="py-2.5 px-3 text-center">HSN</th>
                  <th className="py-2.5 px-3 text-right">Qty</th>
                  <th className="py-2.5 px-3 text-right">Rate</th>
                  <th className="py-2.5 px-3 text-center">GST %</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item, idx) => (
                  <tr key={item.id} className="text-slate-700">
                    <td className="py-3 px-3 text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3 font-medium text-slate-900">{item.description}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-500">{item.hsn || '8504'}</td>
                    <td className="py-3 px-3 text-right">{item.qty}</td>
                    <td className="py-3 px-3 text-right">{formatINR(item.rate)}</td>
                    <td className="py-3 px-3 text-center">{item.taxRate}%</td>
                    <td className="py-3 px-3 text-right font-semibold text-slate-900">
                      {formatINR(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total calculations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
            <div className="text-[11px] text-slate-500 space-y-2">
              {invoice.notes && (
                <div>
                  <span className="font-bold text-slate-700 block">Notes:</span>
                  <p>{invoice.notes}</p>
                </div>
              )}
              {invoice.terms && (
                <div>
                  <span className="font-bold text-slate-700 block">Terms & Conditions:</span>
                  <p>{invoice.terms}</p>
                </div>
              )}
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Amount:</span>
                <span className="font-medium text-slate-900">{formatINR(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Central GST (CGST 9%):</span>
                <span className="font-medium text-slate-900">{formatINR(invoice.taxAmount / 2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>State GST (SGST 9%):</span>
                <span className="font-medium text-slate-900">{formatINR(invoice.taxAmount / 2)}</span>
              </div>
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Discount:</span>
                  <span className="font-medium">-{formatINR(invoice.discountAmount)}</span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-slate-900">
                <span>Grand Total:</span>
                <span className="text-base text-indigo-700">{formatINR(invoice.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Authorized signatory */}
          <div className="pt-10 flex justify-between items-end text-slate-500 text-[11px]">
            <div>
              <p>Thank you for doing business with us!</p>
              <p className="text-[10px] text-slate-400">Generated securely via BizTrack</p>
            </div>
            <div className="text-right">
              <div className="h-10 mb-1 border-b border-slate-300 w-36 ml-auto"></div>
              <p className="font-semibold text-slate-800">For {businessProfile.businessName}</p>
              <p className="text-[10px]">Authorized Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
