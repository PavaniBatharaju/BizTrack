import React, { useState } from 'react';
import { useBiz } from '../../../context/BizContext';
import { 
  Calculator, 
  IndianRupee, 
  Percent, 
  TrendingUp, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle,
  PieChart as PieIcon,
  Sparkles
} from 'lucide-react';
import { formatINR } from '../../../utils/formatters';

export const ProfitCalculatorView: React.FC = () => {
  const { metrics } = useBiz();

  // Inputs
  const [totalSales, setTotalSales] = useState<number>(metrics.totalRevenue || 245000);
  const [cogs, setCogs] = useState<number>(45000); // Cost of Goods
  const [operatingExpenses, setOperatingExpenses] = useState<number>(75000); // Salaries, Rent, Utilities
  const [otherExpenses, setOtherExpenses] = useState<number>(12500); // Taxes, Marketing, Misc

  // Calculations
  const grossProfit = totalSales - cogs;
  const grossMargin = totalSales > 0 ? (grossProfit / totalSales) * 100 : 0;

  const operatingProfit = grossProfit - operatingExpenses;
  const operatingMargin = totalSales > 0 ? (operatingProfit / totalSales) * 100 : 0;

  const netProfit = operatingProfit - otherExpenses;
  const netMargin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;

  const handleResetToCurrent = () => {
    setTotalSales(metrics.totalRevenue || 245000);
    setCogs(45000);
    setOperatingExpenses(75000);
    setOtherExpenses(12500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Calculator className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Profit Calculator & Margin Simulator</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulate your gross, operating, and net profitability metrics with instant mathematical calculation.
          </p>
        </div>

        <button
          onClick={handleResetToCurrent}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-colors self-start"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset to Current Live Numbers
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Card */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Enter Financial Parameters
            </h3>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              Live Interactive
            </span>
          </div>

          {/* Total Sales */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase">
                Total Revenue / Gross Sales (₹)
              </label>
              <span className="text-xs font-bold text-indigo-600">{formatINR(totalSales)}</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <IndianRupee className="w-4 h-4" />
              </div>
              <input
                type="number"
                min="0"
                step="1000"
                value={totalSales}
                onChange={(e) => setTotalSales(Math.max(0, Number(e.target.value)))}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <input
              type="range"
              min="0"
              max="1000000"
              step="5000"
              value={totalSales}
              onChange={(e) => setTotalSales(Number(e.target.value))}
              className="w-full mt-2 accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Cost of Goods Sold */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase">
                Cost of Goods Sold (COGS / Inventory)
              </label>
              <span className="text-xs font-bold text-rose-600">{formatINR(cogs)}</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <IndianRupee className="w-4 h-4" />
              </div>
              <input
                type="number"
                min="0"
                step="1000"
                value={cogs}
                onChange={(e) => setCogs(Math.max(0, Number(e.target.value)))}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <input
              type="range"
              min="0"
              max="500000"
              step="2500"
              value={cogs}
              onChange={(e) => setCogs(Number(e.target.value))}
              className="w-full mt-2 accent-rose-600 cursor-pointer"
            />
          </div>

          {/* Operating Expenses */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase">
                Operating Expenses (Salaries, Rent, Bills)
              </label>
              <span className="text-xs font-bold text-amber-600">{formatINR(operatingExpenses)}</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <IndianRupee className="w-4 h-4" />
              </div>
              <input
                type="number"
                min="0"
                step="1000"
                value={operatingExpenses}
                onChange={(e) => setOperatingExpenses(Math.max(0, Number(e.target.value)))}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <input
              type="range"
              min="0"
              max="400000"
              step="2000"
              value={operatingExpenses}
              onChange={(e) => setOperatingExpenses(Number(e.target.value))}
              className="w-full mt-2 accent-amber-600 cursor-pointer"
            />
          </div>

          {/* Other Expenses */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase">
                Other Expenses (Marketing, Software, Misc)
              </label>
              <span className="text-xs font-bold text-slate-700">{formatINR(otherExpenses)}</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <IndianRupee className="w-4 h-4" />
              </div>
              <input
                type="number"
                min="0"
                step="500"
                value={otherExpenses}
                onChange={(e) => setOtherExpenses(Math.max(0, Number(e.target.value)))}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <input
              type="range"
              min="0"
              max="200000"
              step="1000"
              value={otherExpenses}
              onChange={(e) => setOtherExpenses(Number(e.target.value))}
              className="w-full mt-2 accent-slate-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Right Output & Breakdown Card */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Profit Card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-indigo-900/40 space-y-6">
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-indigo-400">
                Net Profit Outcome
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  {formatINR(netProfit)}
                </h2>
                <span className={`text-sm font-extrabold px-3 py-1 rounded-full ${
                  netMargin >= 20 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                  netMargin >= 10 ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' :
                  'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {netMargin.toFixed(1)}% Net Margin
                </span>
              </div>
            </div>

            {/* 3 Computed Metric Rows */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              {/* Gross Profit */}
              <div className="flex items-center justify-between p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <div>
                  <span className="text-xs font-bold text-slate-200">Gross Profit</span>
                  <p className="text-[10px] text-slate-400">Revenue - COGS</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-400">{formatINR(grossProfit)}</p>
                  <p className="text-[11px] text-slate-400 font-semibold">{grossMargin.toFixed(1)}% margin</p>
                </div>
              </div>

              {/* Operating Profit */}
              <div className="flex items-center justify-between p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <div>
                  <span className="text-xs font-bold text-slate-200">Operating Profit (EBIT)</span>
                  <p className="text-[10px] text-slate-400">Gross Profit - Operating Expenses</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-indigo-300">{formatINR(operatingProfit)}</p>
                  <p className="text-[11px] text-slate-400 font-semibold">{operatingMargin.toFixed(1)}% margin</p>
                </div>
              </div>

              {/* Net Profit */}
              <div className="flex items-center justify-between p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <div>
                  <span className="text-xs font-bold text-slate-200">Net Profit (Final Take-Home)</span>
                  <p className="text-[10px] text-slate-400">Operating Profit - Other Expenses</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-400">{formatINR(netProfit)}</p>
                  <p className="text-[11px] text-slate-400 font-semibold">{netMargin.toFixed(1)}% margin</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Profit Allocation Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Revenue Breakdown Visualization
            </h4>
            
            {/* Visual stacked bar */}
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${Math.min(100, Math.max(0, (cogs / (totalSales || 1)) * 100))}%` }}
                className="bg-rose-500 h-full"
                title={`COGS: ${((cogs / (totalSales || 1)) * 100).toFixed(1)}%`}
              />
              <div
                style={{ width: `${Math.min(100, Math.max(0, (operatingExpenses / (totalSales || 1)) * 100))}%` }}
                className="bg-amber-500 h-full"
                title={`Opex: ${((operatingExpenses / (totalSales || 1)) * 100).toFixed(1)}%`}
              />
              <div
                style={{ width: `${Math.min(100, Math.max(0, (otherExpenses / (totalSales || 1)) * 100))}%` }}
                className="bg-slate-400 h-full"
                title={`Other: ${((otherExpenses / (totalSales || 1)) * 100).toFixed(1)}%`}
              />
              <div
                style={{ width: `${Math.min(100, Math.max(0, (netProfit / (totalSales || 1)) * 100))}%` }}
                className="bg-emerald-500 h-full"
                title={`Net Profit: ${netMargin.toFixed(1)}%`}
              />
            </div>

            <div className="grid grid-cols-4 gap-2 text-[11px] pt-1">
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
                <span>COGS</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                <span>Opex</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0"></span>
                <span>Other</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span>Net Profit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
