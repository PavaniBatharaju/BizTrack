import React, { useState } from 'react';
import { useBiz } from '../../../context/BizContext';
import { 
  BarChart3, 
  Download, 
  Printer, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Users, 
  Truck,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { formatINR, formatDate, downloadCSV } from '../../../utils/formatters';

type ReportType = 'pnl' | 'income' | 'expense' | 'cashflow' | 'customers' | 'suppliers';

export const ReportsView: React.FC = () => {
  const { 
    metrics, 
    transactions, 
    customers, 
    suppliers, 
    businessProfile,
    budgetCategories,
    showToast 
  } = useBiz();

  const [activeReport, setActiveReport] = useState<ReportType>('pnl');

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    if (activeReport === 'pnl') {
      const rows = [
        ['Profit & Loss Statement', businessProfile.businessName, `FY ${businessProfile.financialYear}`],
        ['Metric', 'Amount (INR)'],
        ['Gross Sales / Revenue', metrics.totalRevenue],
        ['Cost of Goods Sold (COGS)', metrics.totalRevenue * 0.2],
        ['Gross Profit', metrics.grossProfit],
        ['Operating Expenses (Opex)', metrics.totalExpenses * 0.8],
        ['Operating Profit (EBIT)', metrics.grossProfit - (metrics.totalExpenses * 0.8)],
        ['Other Overhead & Taxes', metrics.totalExpenses * 0.2],
        ['Net Profit', metrics.netProfit],
        ['Net Profit Margin (%)', `${metrics.profitMargin}%`],
      ];
      downloadCSV(`BizTrack_PnL_${new Date().toISOString().split('T')[0]}.csv`, rows);
    } else if (activeReport === 'income') {
      const rows = [
        ['Date', 'Customer', 'Category', 'Description', 'Payment Method', 'Amount (INR)'],
        ...transactions.filter(t => t.type === 'income' || t.type === 'sale').map(t => [
          t.date, t.counterparty, t.category, t.title, t.paymentMethod, t.amount
        ])
      ];
      downloadCSV(`BizTrack_Income_Statement_${new Date().toISOString().split('T')[0]}.csv`, rows);
    } else if (activeReport === 'expense') {
      const rows = [
        ['Date', 'Vendor', 'Category', 'Description', 'Payment Method', 'Amount (INR)'],
        ...transactions.filter(t => t.type === 'expense' || t.type === 'purchase').map(t => [
          t.date, t.counterparty, t.category, t.title, t.paymentMethod, t.amount
        ])
      ];
      downloadCSV(`BizTrack_Expense_Statement_${new Date().toISOString().split('T')[0]}.csv`, rows);
    } else if (activeReport === 'cashflow') {
      const rows = [
        ['Cash Flow Statement', businessProfile.businessName],
        ['Opening Cash Balance', metrics.openingBalance],
        ['Total Cash Inflows (+)', metrics.moneyIn],
        ['Total Cash Outflows (-)', metrics.moneyOut],
        ['Net Cash Flow', metrics.netCashFlow],
        ['Closing Cash Reserves', metrics.closingBalance],
      ];
      downloadCSV(`BizTrack_CashFlow_${new Date().toISOString().split('T')[0]}.csv`, rows);
    } else if (activeReport === 'customers') {
      const rows = [
        ['Customer Name', 'Phone', 'Total Billed', 'Paid', 'Pending Balance', 'Overdue Amount'],
        ...customers.map(c => [c.name, c.phone, c.totalSales, c.paidAmount, c.pendingAmount, c.overdueAmount])
      ];
      downloadCSV(`BizTrack_Customer_Outstanding_${new Date().toISOString().split('T')[0]}.csv`, rows);
    } else {
      const rows = [
        ['Supplier Firm', 'Contact', 'Phone', 'Purchases', 'Paid', 'Pending Payable', 'Due Date'],
        ...suppliers.map(s => [s.company, s.name, s.phone, s.totalPurchases, s.paidAmount, s.pendingAmount, s.dueDate])
      ];
      downloadCSV(`BizTrack_Supplier_Payables_${new Date().toISOString().split('T')[0]}.csv`, rows);
    }
    showToast('Report Exported', 'Financial report downloaded as CSV', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Financial Reports & Statements</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate formal Profit & Loss statements, Tax summaries, and Auditing reports.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print Statement
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            <Download className="w-4 h-4" /> Download Report (CSV)
          </button>
        </div>
      </div>

      {/* Report Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {[
          { id: 'pnl', label: 'Profit & Loss (P&L)', icon: TrendingUp },
          { id: 'income', label: 'Income Report', icon: FileText },
          { id: 'expense', label: 'Expense Report', icon: TrendingDown },
          { id: 'cashflow', label: 'Cash Flow Statement', icon: Wallet },
          { id: 'customers', label: 'Customer Receivables', icon: Users },
          { id: 'suppliers', label: 'Supplier Payables', icon: Truck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeReport === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveReport(tab.id as ReportType)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Report Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Formal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest font-bold text-indigo-600">Official Financial Record</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
              {activeReport === 'pnl' && 'Statement of Profit and Loss (P&L)'}
              {activeReport === 'income' && 'Consolidated Income & Revenue Statement'}
              {activeReport === 'expense' && 'Detailed Expense & Expenditure Ledger'}
              {activeReport === 'cashflow' && 'Cash Flow & Liquidity Statement'}
              {activeReport === 'customers' && 'Customer Accounts Receivable Aging Report'}
              {activeReport === 'suppliers' && 'Supplier & Trade Payables Summary'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Entity: <span className="font-semibold text-slate-700">{businessProfile.businessName}</span> • GSTIN: {businessProfile.gstin}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Reporting Period</span>
            <span className="text-xs font-bold text-slate-800">FY {businessProfile.financialYear} (Current)</span>
            <p className="text-[10px] text-slate-400 mt-0.5">Generated on {formatDate(new Date().toISOString())}</p>
          </div>
        </div>

        {/* Dynamic Report Content */}
        {activeReport === 'pnl' && (
          <div className="space-y-6">
            {/* Revenue Section */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">1. Revenue / Inflow</h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-slate-100 text-xs">
                  <span className="text-slate-700 font-medium">Gross Sales & Billing Invoices</span>
                  <span className="font-bold text-slate-900">{formatINR(metrics.totalRevenue)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 text-xs text-rose-600">
                  <span className="font-medium">Less: Direct Cost of Goods Sold (COGS estimate)</span>
                  <span className="font-bold">-{formatINR(metrics.totalRevenue * 0.2)}</span>
                </div>
                <div className="flex justify-between py-2.5 bg-indigo-50/60 px-3 rounded-xl text-xs font-bold text-indigo-950">
                  <span>Gross Profit</span>
                  <span className="text-emerald-700 font-extrabold text-sm">{formatINR(metrics.grossProfit)}</span>
                </div>
              </div>
            </div>

            {/* Operating Expenses Section */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">2. Operating Expenses (OPEX)</h3>
              <div className="space-y-2">
                {budgetCategories.map(cat => (
                  <div key={cat.category} className="flex justify-between py-1.5 border-b border-slate-50 text-xs">
                    <span className="text-slate-600">{cat.category}</span>
                    <span className="font-semibold text-slate-800">{formatINR(cat.spent)}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2.5 bg-rose-50/60 px-3 rounded-xl text-xs font-bold text-rose-950">
                  <span>Total Operating Expenditure</span>
                  <span className="text-rose-700 font-extrabold text-sm">-{formatINR(metrics.totalExpenses)}</span>
                </div>
              </div>
            </div>

            {/* Bottom Line Net Profit */}
            <div className="p-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">Bottom Line</span>
                <h4 className="text-xl font-extrabold text-white mt-0.5">Net Profit for the Period</h4>
                <p className="text-xs text-indigo-200 mt-0.5">
                  Calculated as: Total Revenue - Total Expenses ({metrics.profitMargin}% Net Margin)
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-3xl font-black text-emerald-400 tracking-tight">
                  {formatINR(metrics.netProfit)}
                </span>
                <span className="block text-[11px] font-bold text-emerald-300 mt-0.5">
                  Profitable Operations
                </span>
              </div>
            </div>
          </div>
        )}

        {activeReport === 'income' && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.filter(t => t.type === 'income' || t.type === 'sale').map(t => (
                    <tr key={t.id}>
                      <td className="py-2.5 px-3">{formatDate(t.date)}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{t.counterparty}</td>
                      <td className="py-2.5 px-3">{t.category}</td>
                      <td className="py-2.5 px-3 text-slate-600">{t.title}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-600">+{formatINR(t.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeReport === 'expense' && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Vendor</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.filter(t => t.type === 'expense' || t.type === 'purchase').map(t => (
                    <tr key={t.id}>
                      <td className="py-2.5 px-3">{formatDate(t.date)}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{t.counterparty}</td>
                      <td className="py-2.5 px-3">{t.category}</td>
                      <td className="py-2.5 px-3 text-slate-600">{t.title}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-rose-600">-{formatINR(t.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeReport === 'cashflow' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="font-semibold text-slate-700">Opening Liquidity Reserves</span>
                <span className="font-bold text-slate-900">{formatINR(metrics.openingBalance)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200 text-emerald-700">
                <span className="font-semibold">Add: Collections from Customers & Sales</span>
                <span className="font-bold">+{formatINR(metrics.moneyIn)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200 text-rose-700">
                <span className="font-semibold">Less: Operating Bills, Vendor Payouts & Rent</span>
                <span className="font-bold">-{formatINR(metrics.moneyOut)}</span>
              </div>
              <div className="flex justify-between py-2.5 bg-white px-3 rounded-xl font-bold text-slate-900 shadow-xs">
                <span>Net Cash Inflow for Period</span>
                <span className={metrics.netCashFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                  {metrics.netCashFlow >= 0 ? '+' : ''}{formatINR(metrics.netCashFlow)}
                </span>
              </div>
              <div className="flex justify-between py-3 bg-indigo-900 text-white px-4 rounded-xl font-extrabold text-sm">
                <span>Closing Bank & Cash Balance</span>
                <span className="text-emerald-400">{formatINR(metrics.closingBalance)}</span>
              </div>
            </div>
          </div>
        )}

        {activeReport === 'customers' && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b">
                  <tr>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Phone</th>
                    <th className="py-2.5 px-3 text-right">Total Billed</th>
                    <th className="py-2.5 px-3 text-right">Paid</th>
                    <th className="py-2.5 px-3 text-right">Pending</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map(c => (
                    <tr key={c.id}>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{c.name}</td>
                      <td className="py-2.5 px-3 text-slate-500">{c.phone}</td>
                      <td className="py-2.5 px-3 text-right font-medium">{formatINR(c.totalSales)}</td>
                      <td className="py-2.5 px-3 text-right font-medium text-emerald-600">{formatINR(c.paidAmount)}</td>
                      <td className="py-2.5 px-3 text-right font-black text-amber-600">{formatINR(c.pendingAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeReport === 'suppliers' && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b">
                  <tr>
                    <th className="py-2.5 px-3">Company</th>
                    <th className="py-2.5 px-3">Contact</th>
                    <th className="py-2.5 px-3 text-right">Purchases</th>
                    <th className="py-2.5 px-3 text-right">Paid</th>
                    <th className="py-2.5 px-3 text-right">Payable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {suppliers.map(s => (
                    <tr key={s.id}>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{s.company}</td>
                      <td className="py-2.5 px-3 text-slate-500">{s.name} ({s.phone})</td>
                      <td className="py-2.5 px-3 text-right font-medium">{formatINR(s.totalPurchases)}</td>
                      <td className="py-2.5 px-3 text-right font-medium text-emerald-600">{formatINR(s.paidAmount)}</td>
                      <td className="py-2.5 px-3 text-right font-black text-rose-600">{formatINR(s.pendingAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
