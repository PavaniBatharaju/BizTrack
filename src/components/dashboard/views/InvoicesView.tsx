import React, { useState } from 'react';
import { useBiz } from '../../../context/BizContext';
import { Invoice } from '../../../types';
import { 
  FileText, 
  Plus, 
  Search, 
  Eye, 
  Trash2, 
  Printer, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Download
} from 'lucide-react';
import { formatINR, formatDate, downloadCSV } from '../../../utils/formatters';
import { InvoicePreviewModal } from '../modals/InvoicePreviewModal';

interface InvoicesViewProps {
  onOpenCreateInvoice: () => void;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({ onOpenCreateInvoice }) => {
  const { invoices, deleteInvoice, showToast } = useBiz();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [selectedInvoiceForPreview, setSelectedInvoiceForPreview] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalInvoiced = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.totalAmount, 0);
  const totalPending = invoices.filter(i => i.status === 'pending' || i.status === 'overdue').reduce((sum, i) => sum + i.totalAmount, 0);

  const handleExportCSV = () => {
    const rows = [
      ['Invoice #', 'Date', 'Due Date', 'Customer', 'Items Count', 'Subtotal', 'Tax (GST)', 'Total Amount (INR)', 'Status'],
      ...invoices.map(i => [
        i.invoiceNumber,
        i.date,
        i.dueDate,
        i.customerName,
        i.items.length,
        i.subtotal,
        i.taxAmount,
        i.totalAmount,
        i.status,
      ])
    ];
    downloadCSV(`BizTrack_Invoices_${new Date().toISOString().split('T')[0]}.csv`, rows);
    showToast('Export Complete', 'Invoice ledger exported to CSV', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">GST Invoices & Billing</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate professional GST-compliant tax invoices, print delivery challans, and track payment receipts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export Excel/CSV
          </button>
          <button
            onClick={onOpenCreateInvoice}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            <Plus className="w-4 h-4" /> + Create Invoice
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Billed</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{formatINR(totalInvoiced)}</h3>
          <p className="text-[11px] text-slate-500 mt-1">{invoices.length} total issued invoices</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Paid Invoices</span>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">{formatINR(totalPaid)}</h3>
          <p className="text-[11px] text-slate-500 mt-1">{invoices.filter(i => i.status === 'paid').length} invoices settled</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending / Overdue</span>
          <h3 className="text-2xl font-black text-amber-600 mt-1">{formatINR(totalPending)}</h3>
          <p className="text-[11px] text-slate-500 mt-1">{invoices.filter(i => i.status !== 'paid').length} invoices awaiting payment</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by invoice number (#INV-...) or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'paid', 'pending', 'overdue'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Issue Date</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4 text-right">Tax (GST)</th>
                <th className="py-3.5 px-4 text-right">Total Amount</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700">No invoices match your criteria</p>
                    <p className="text-xs text-slate-400 mt-0.5">Click &ldquo;+ Create Invoice&rdquo; to create a new GST tax invoice.</p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-indigo-600 whitespace-nowrap">
                      {inv.invoiceNumber}
                    </td>

                    <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {inv.customerName}
                    </td>

                    <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                      {formatDate(inv.date)}
                    </td>

                    <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                      {formatDate(inv.dueDate)}
                    </td>

                    <td className="py-4 px-4 text-right font-medium text-slate-600 whitespace-nowrap">
                      {formatINR(inv.taxAmount)}
                    </td>

                    <td className="py-4 px-4 text-right font-black text-slate-900 text-sm whitespace-nowrap">
                      {formatINR(inv.totalAmount)}
                    </td>

                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        inv.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : inv.status === 'overdue'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {inv.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedInvoiceForPreview(inv)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                          title="Preview & Print"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                        <button
                          onClick={() => deleteInvoice(inv.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Invoice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Preview Modal */}
      <InvoicePreviewModal
        invoice={selectedInvoiceForPreview}
        isOpen={Boolean(selectedInvoiceForPreview)}
        onClose={() => setSelectedInvoiceForPreview(null)}
      />
    </div>
  );
};
