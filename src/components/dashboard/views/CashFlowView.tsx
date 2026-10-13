import React from 'react';
import { useBiz } from '../../../context/BizContext';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck,
  CheckCircle2,
  Calendar,
  IndianRupee
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line 
} from 'recharts';
import { formatINR, formatCompactINR } from '../../../utils/formatters';

const cashFlowHistory = [
  { month: 'Apr', moneyIn: 232000, moneyOut: 159000, netFlow: 73000, closingCash: 175000 },
  { month: 'May', moneyIn: 248000, moneyOut: 166000, netFlow: 82000, closingCash: 257000 },
  { month: 'Jun', moneyIn: 239000, moneyOut: 151000, netFlow: 88000, closingCash: 345000 },
  { month: 'Jul', moneyIn: 255000, moneyOut: 158000, netFlow: 97000, closingCash: 442000 },
  { month: 'Aug (MTD)', moneyIn: 245000, moneyOut: 132500, netFlow: 112500, closingCash: 345800 },
];

export const CashFlowView: React.FC = () => {
  const { metrics, businessProfile } = useBiz();

  const isPositiveCashFlow = metrics.netCashFlow >= 0;
  // Estimated monthly burn rate (based on average monthly expenses)
  const monthlyBurn = metrics.totalExpenses || 132500;
  const runwayMonths = monthlyBurn > 0 ? (metrics.closingBalance / monthlyBurn).toFixed(1) : '12+';

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
              <Wallet className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Cash Flow Management</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time tracking of liquidity, money in vs money out, and cash runway projections.
          </p>
        </div>
      </div>

      {/* Warning / Health Alert Banner */}
      {!isPositiveCashFlow ? (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-sm">⚠️ Negative Cash Flow Warning</p>
            <p className="mt-0.5 text-amber-800">
              Your business cash outflows exceeded inflows by {formatINR(Math.abs(metrics.netCashFlow))} this period. 
              Review non-essential overheads and expedite customer receivables.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 text-emerald-900">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-sm">Strong Cash Position</p>
              <p className="text-emerald-800">
                You have approximately <span className="font-bold">{runwayMonths} months</span> of operational runway at current spending rates.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
            Healthy Liquidity
          </span>
        </div>
      )}

      {/* 4 Core Cash Flow Equation Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Opening Balance */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            1. Opening Cash Balance
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-2">
            {formatINR(metrics.openingBalance)}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Starting balance at period start</p>
        </div>

        {/* Money In */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              2. Money In (Inflow)
            </span>
            <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-emerald-600 mt-2">
            +{formatINR(metrics.moneyIn)}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Customer collections & sales</p>
        </div>

        {/* Money Out */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              3. Money Out (Outflow)
            </span>
            <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-rose-600 mt-2">
            -{formatINR(metrics.moneyOut)}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Vendor bills, rent, and payroll</p>
        </div>

        {/* Closing Balance */}
        <div className="p-5 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl border border-indigo-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
              4. Closing Balance
            </span>
            <Wallet className="w-5 h-5 text-indigo-300" />
          </div>
          <h3 className="text-2xl font-black text-white mt-2">
            {formatINR(metrics.closingBalance)}
          </h3>
          <p className="text-[11px] text-indigo-200 mt-1">
            Net Change: {metrics.netCashFlow >= 0 ? '+' : ''}{formatINR(metrics.netCashFlow)}
          </p>
        </div>
      </div>

      {/* Cash Flow Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Money In vs Money Out Bar Chart */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Inflows vs. Outflows Trend</h3>
              <p className="text-xs text-slate-500">Historical monthly comparison</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowHistory} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => formatCompactINR(v)} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: any, name: any) => [formatINR(Number(v)), name === 'moneyIn' ? 'Money In' : 'Money Out']} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="moneyIn" name="Money In" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={28} />
                <Bar dataKey="moneyOut" name="Money Out" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Net Cash Flow & Closing Liquidity Line Chart */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Cash Reserve Accumulation</h3>
              <p className="text-xs text-slate-500">Closing balance trajectory</p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
              Bank Balance: {formatINR(metrics.cashBalance)}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cashFlowHistory} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => formatCompactINR(v)} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: any) => [formatINR(Number(v)), 'Closing Cash']} />
                <Line type="monotone" dataKey="closingCash" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
