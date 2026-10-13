import React, { useState } from 'react';
import { useBiz } from '../../../context/BizContext';
import { 
  TrendingUp, 
  TrendingDown, 
  IndianRupee, 
  Wallet, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  PlusCircle, 
  FileText, 
  Users, 
  ArrowRight,
  PieChart as PieIcon,
  Calendar,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { formatINR, formatCompactINR, formatDate } from '../../../utils/formatters';
import { monthlyProfitTrendData } from '../../../data/sampleData';

interface DashboardOverviewProps {
  onOpenAddIncome: () => void;
  onOpenAddExpense: () => void;
  onOpenCreateInvoice: () => void;
}

const PIE_COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#64748b'];

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onOpenAddIncome,
  onOpenAddExpense,
  onOpenCreateInvoice,
}) => {
  const { 
    metrics, 
    insights, 
    filteredTransactions, 
    budgetCategories, 
    businessProfile,
    setActiveTab,
    dateFilter,
    setDateFilter
  } = useBiz();

  const [chartViewMode, setChartViewMode] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  // Expense breakdown for Pie Chart
  const expensePieData = budgetCategories
    .filter(b => b.spent > 0)
    .map(b => ({
      name: b.category,
      value: b.spent,
    }));

  const totalExpenseSpent = expensePieData.reduce((sum, item) => sum + item.value, 0);

  // Recent transactions list
  const recentTransactions = filteredTransactions.slice(0, 5);

  return (
    <div className="space-y-6 pb-10">
      {/* Top Banner / Welcome Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-indigo-900/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Live Business Telemetry
            </span>
            <span className="text-xs text-slate-400">FY {businessProfile.financialYear}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Good Morning, {businessProfile.name} 👋
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Here&apos;s your business financial overview for <span className="font-semibold text-white">{businessProfile.businessName}</span>.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenAddIncome}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all"
          >
            <TrendingUp className="w-4 h-4" /> + Add Income
          </button>
          <button
            onClick={onOpenAddExpense}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs border border-slate-700 transition-all"
          >
            <TrendingDown className="w-4 h-4 text-rose-400" /> + Add Expense
          </button>
          <button
            onClick={onOpenCreateInvoice}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs shadow-md transition-all"
          >
            <FileText className="w-4 h-4" /> + Invoice
          </button>
        </div>
      </div>

      {/* 4 Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {formatINR(metrics.totalRevenue)}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +12.5%
              </span>
              <span className="text-[11px] text-slate-400">vs last month</span>
            </div>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Expenses</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {formatINR(metrics.totalExpenses)}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> -4.2%
              </span>
              <span className="text-[11px] text-slate-400">vs last month</span>
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Net Profit</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className={`text-2xl font-black tracking-tight ${metrics.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {formatINR(metrics.netProfit)}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +18.3%
              </span>
              <span className="text-[11px] text-slate-400 font-medium">({metrics.profitMargin}% margin)</span>
            </div>
          </div>
        </div>

        {/* Cash Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cash Balance</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {formatINR(metrics.cashBalance)}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="inline-flex items-center text-xs font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md">
                Net Flow: {formatINR(metrics.netCashFlow)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Business Insights Row */}
      <div className="bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 p-5 rounded-2xl border border-indigo-100/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Smart Business Insights</h3>
          </div>
          <span className="text-[11px] font-semibold text-indigo-600">Auto-Generated from Telemetry</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {insights.map((ins) => (
            <div
              key={ins.id}
              onClick={() => ins.actionTab && setActiveTab(ins.actionTab as any)}
              className="p-3.5 bg-white rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-800 line-clamp-1">{ins.title}</span>
                  {ins.metric && (
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                      ins.type === 'positive' ? 'bg-emerald-100 text-emerald-800' :
                      ins.type === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {ins.metric}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-snug">{ins.message}</p>
              </div>

              {ins.actionText && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-indigo-600 hover:text-indigo-700">
                  <span>{ins.actionText}</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Revenue vs Expense & Profit Trend Chart */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Revenue vs. Expenses vs. Profit</h3>
              <p className="text-xs text-slate-500">Historical performance comparison across periods</p>
            </div>

            <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setChartViewMode('monthly')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  chartViewMode === 'monthly' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setChartViewMode('quarterly')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  chartViewMode === 'quarterly' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Quarterly
              </button>
              <button
                onClick={() => setChartViewMode('yearly')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  chartViewMode === 'yearly' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyProfitTrendData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickFormatter={(val) => formatCompactINR(val)}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [formatINR(Number(value)), name === 'revenue' ? 'Revenue' : name === 'expenses' ? 'Expenses' : 'Net Profit']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="revenue" name="Revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={32} />
                <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={32} />
                <Bar dataKey="profit" name="Net Profit" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Expense Breakdown Pie */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900">Expense Breakdown</h3>
              <span className="text-xs font-semibold text-slate-500">Total: {formatINR(totalExpenseSpent)}</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Category allocation for this period</p>

            <div className="h-48 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {expensePieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [formatINR(Number(val)), 'Spent']}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '10px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total</span>
                <span className="text-sm font-extrabold text-slate-800">{formatCompactINR(totalExpenseSpent)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-4 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
            {expensePieData.map((item, idx) => {
              const pct = totalExpenseSpent > 0 ? Math.round((item.value / totalExpenseSpent) * 100) : 0;
              return (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                    />
                    <span className="font-medium text-slate-700 truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-mono text-[11px]">{pct}%</span>
                    <span className="font-bold text-slate-900">{formatINR(item.value)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Profit Trend Chart & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profit Trend Line Area */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Profit Trajectory</h3>
              <p className="text-xs text-slate-500">Monthly net earnings trend (Jan - Aug)</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              +150% YoY
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyProfitTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => formatCompactINR(v)} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: any) => [formatINR(Number(v)), 'Net Profit']} />
                <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#profitGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Current Month Net Profit:</span>
            <span className="font-extrabold text-emerald-600 text-sm">{formatINR(metrics.netProfit)}</span>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Transactions</h3>
              <p className="text-xs text-slate-500">Latest recorded income, sales, and expenses</p>
            </div>
            <button
              onClick={() => setActiveTab('income')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentTransactions.map((tx) => {
              const isIncome = tx.type === 'income' || tx.type === 'sale';
              return (
                <div key={tx.id} className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isIncome ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">{tx.title}</p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {tx.counterparty} • <span className="text-slate-600 font-medium">{tx.category}</span> • {formatDate(tx.date)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className={`text-xs sm:text-sm font-black ${isIncome ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {isIncome ? '+' : '-'}{formatINR(tx.amount)}
                    </p>
                    <span className="text-[10px] font-medium text-slate-400">{tx.paymentMethod}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
