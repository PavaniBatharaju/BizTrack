import React, { useState, useMemo } from 'react';
import { useBiz } from '../../../context/BizContext';
import { 
  TrendingDown, 
  Plus, 
  Search, 
  Download, 
  Trash2, 
  FileCheck, 
  Receipt,
  FileText,
  AlertCircle
} from 'lucide-react';
import { formatINR, formatDate, downloadCSV } from '../../../utils/formatters';

interface ExpenseViewProps {
  onOpenAddExpense: () => void;
}

export const ExpenseView: React.FC<ExpenseViewProps> = ({ onOpenAddExpense }) => {
  const { transactions, deleteTransaction, showToast } = useBiz();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPayment, setSelectedPayment] = useState<string>('All');

  const expenseTransactions = useMemo(() => {
    return transactions.filter(t => t.type === 'expense' || t.type === 'purchase');
  }, [transactions]);

  const filteredExpenses = useMemo(() => {
    return expenseTransactions.filter(t => {
      const matchSearch = 
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.counterparty.toLowerCase().includes(search.toLowerCase()) ||
        (t.invoiceNo && t.invoiceNo.toLowerCase().includes(search.toLowerCase()));

      const matchCategory = selectedCategory === 'All' || t.category === selectedCategory;
      const matchPayment = selectedPayment === 'All' || t.paymentMethod === selectedPayment;

      return matchSearch && matchCategory && matchPayment;
    });
  }, [expenseTransactions, search, selectedCategory, selectedPayment]);

  const totalExpense = filteredExpenses.reduce((sum, t) => sum + t.amount, 0);

  const handleExportCSV = () => {
    const rows = [
      ['Date', 'Vendor / Payee', 'Category', 'Description', 'Payment Method', 'Bill Ref', 'Amount (INR)', 'Receipt Status'],
      ...filteredExpenses.map(t => [
        t.date,
        t.counterparty,
        t.category,
        t.title,
        t.paymentMethod,
        t.invoiceNo || '-',
        t.amount,
        t.receiptUrl ? 'Attached' : 'No Receipt',
      ])
    ];
    downloadCSV(`BizTrack_Expense_Report_${new Date().toISOString().split('T')[0]}.csv`, rows);
    showToast('Export Complete', 'Expense report downloaded as CSV', 'success');
  };

  const categories = ['All', ...Array.from(new Set(expenseTransactions.map(t => t.category)))];
  const paymentMethods = ['All', 'UPI', 'Bank Transfer', 'Cash', 'Card', 'Cheque'];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <TrendingDown className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Expense Management</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track business outflows, manage vendor invoices, bills, payroll, and receipts.
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
            onClick={onOpenAddExpense}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            <Plus className="w-4 h-4" /> + Add Expense
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Outflow</span>
          <h3 className="text-2xl font-black text-rose-600 mt-1">{formatINR(totalExpense)}</h3>
          <p className="text-[11px] text-slate-500 mt-1">{filteredExpenses.length} expense items recorded</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Largest Cost Center</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">Inventory & Restocking</h3>
          <p className="text-[11px] text-slate-500 mt-1">Accounts for 38% of total expenses</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Bills with Receipts</span>
          <h3 className="text-2xl font-black text-indigo-600 mt-1">
            {filteredExpenses.filter(e => e.receiptUrl).length} / {filteredExpenses.length}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Tax-ready digital documentation</p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by vendor, bill no., or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>Category: {cat}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            >
              {paymentMethods.map(pm => (
                <option key={pm} value={pm}>Payment: {pm}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Expense History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Vendor / Payee</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4 text-right">Amount (₹)</th>
                <th className="py-3.5 px-4 text-center">Payment Method</th>
                <th className="py-3.5 px-4 text-center">Receipt</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    <TrendingDown className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700">No expense records found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Click &ldquo;+ Add Expense&rdquo; to log a business expense.</p>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-600 whitespace-nowrap">
                      {formatDate(t.date)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {t.counterparty}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[11px] font-semibold border border-rose-100">
                        {t.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate">
                      {t.title}
                      {t.invoiceNo && (
                        <span className="ml-1.5 text-[10px] text-slate-400 font-mono">({t.invoiceNo})</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-rose-600 text-sm whitespace-nowrap">
                      -{formatINR(t.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium">
                        {t.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {t.receiptUrl ? (
                        <span 
                          onClick={() => showToast('Receipt Viewer', `Viewing attached bill receipt: ${t.receiptUrl}`, 'info')}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold cursor-pointer hover:bg-emerald-100 border border-emerald-200"
                        >
                          <FileCheck className="w-3 h-3" /> Attached
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">None</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
