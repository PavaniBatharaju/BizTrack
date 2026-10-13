import React, { useState, useMemo } from 'react';
import { useBiz } from '../../../context/BizContext';
import { 
  TrendingUp, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  IndianRupee, 
  Calendar, 
  Tag, 
  ArrowUpRight 
} from 'lucide-react';
import { formatINR, formatDate, downloadCSV } from '../../../utils/formatters';

interface IncomeViewProps {
  onOpenAddIncome: () => void;
}

export const IncomeView: React.FC<IncomeViewProps> = ({ onOpenAddIncome }) => {
  const { transactions, deleteTransaction, showToast } = useBiz();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPayment, setSelectedPayment] = useState<string>('All');

  const incomeTransactions = useMemo(() => {
    return transactions.filter(t => t.type === 'income' || t.type === 'sale');
  }, [transactions]);

  const filteredIncome = useMemo(() => {
    return incomeTransactions.filter(t => {
      const matchSearch = 
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.counterparty.toLowerCase().includes(search.toLowerCase()) ||
        (t.invoiceNo && t.invoiceNo.toLowerCase().includes(search.toLowerCase()));

      const matchCategory = selectedCategory === 'All' || t.category === selectedCategory;
      const matchPayment = selectedPayment === 'All' || t.paymentMethod === selectedPayment;

      return matchSearch && matchCategory && matchPayment;
    });
  }, [incomeTransactions, search, selectedCategory, selectedPayment]);

  const totalIncome = filteredIncome.reduce((sum, t) => sum + t.amount, 0);

  const handleExportCSV = () => {
    const rows = [
      ['Date', 'Customer / Counterparty', 'Description', 'Category', 'Payment Method', 'Invoice No', 'Amount (INR)', 'Status'],
      ...filteredIncome.map(t => [
        t.date,
        t.counterparty,
        t.title,
        t.category,
        t.paymentMethod,
        t.invoiceNo || '-',
        t.amount,
        t.status,
      ])
    ];
    downloadCSV(`BizTrack_Income_Report_${new Date().toISOString().split('T')[0]}.csv`, rows);
    showToast('Export Complete', 'Income list exported as CSV spreadsheet', 'success');
  };

  const categories = ['All', ...Array.from(new Set(incomeTransactions.map(t => t.category)))];
  const paymentMethods = ['All', 'UPI', 'Bank Transfer', 'Cash', 'Card', 'Cheque'];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Income Management</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Record, track, and categorize all incoming customer payments and sales revenue.
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
            onClick={onOpenAddIncome}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            <Plus className="w-4 h-4" /> + Add Income
          </button>
        </div>
      </div>

      {/* Summary Stat Box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Filtered Income</span>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">{formatINR(totalIncome)}</h3>
          <p className="text-[11px] text-slate-500 mt-1">{filteredIncome.length} transactions recorded</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Primary Channel</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">UPI & Direct Bank</h3>
          <p className="text-[11px] text-slate-500 mt-1">82% of revenue collected digitally</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Ticket Size</span>
          <h3 className="text-2xl font-black text-indigo-600 mt-1">
            {formatINR(filteredIncome.length > 0 ? totalIncome / filteredIncome.length : 0)}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Per transaction average</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search bar */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by client, invoice, or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>Category: {cat}</option>
              ))}
            </select>
          </div>

          {/* Payment Method Filter */}
          <div>
            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              {paymentMethods.map(pm => (
                <option key={pm} value={pm}>Payment: {pm}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Income Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4 text-right">Amount (₹)</th>
                <th className="py-3.5 px-4 text-center">Payment Method</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIncome.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    <TrendingUp className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700">No income transactions found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Click &ldquo;+ Add Income&rdquo; to log your first sale or payment.</p>
                  </td>
                </tr>
              ) : (
                filteredIncome.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-600 whitespace-nowrap">
                      {formatDate(t.date)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {t.counterparty}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-100">
                        {t.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate">
                      {t.title}
                      {t.invoiceNo && (
                        <span className="ml-1.5 text-[10px] text-slate-400 font-mono">({t.invoiceNo})</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-emerald-600 text-sm whitespace-nowrap">
                      +{formatINR(t.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium">
                        {t.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete transaction"
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
