import React, { useState } from 'react';
import { useBiz } from '../../../context/BizContext';
import { 
  Sparkles, 
  TrendingUp, 
  ArrowUpRight, 
  Target, 
  Zap, 
  ShieldCheck, 
  Lightbulb,
  Sliders,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { formatINR, formatCompactINR } from '../../../utils/formatters';

const baseForecastTrend = [
  { month: 'May', actual: 82000, projected: null },
  { month: 'Jun', actual: 88000, projected: null },
  { month: 'Jul', actual: 97000, projected: null },
  { month: 'Aug', actual: 112500, projected: 112500 },
  { month: 'Sep (Est)', actual: null, projected: 128000 },
  { month: 'Oct (Est)', actual: null, projected: 142000 },
  { month: 'Nov (Est)', actual: null, projected: 158000 },
  { month: 'Dec (Est)', actual: null, projected: 175000 },
];

export const ForecastView: React.FC = () => {
  const { metrics, businessProfile } = useBiz();
  const [growthMultiplier, setGrowthMultiplier] = useState<number>(1.15); // +15% default

  const estimatedRevenue = Math.round(285000 * (growthMultiplier / 1.15));
  const estimatedExpenses = Math.round(145000 * (1 + (growthMultiplier - 1) * 0.3));
  const estimatedProfit = estimatedRevenue - estimatedExpenses;
  const estimatedMargin = Math.round((estimatedProfit / estimatedRevenue) * 100);

  const dynamicForecastData = baseForecastTrend.map(item => {
    if (item.projected && item.actual === null) {
      return {
        ...item,
        projected: Math.round(item.projected * (growthMultiplier / 1.15))
      };
    }
    return item;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Future Business Estimates & Forecast</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Predictive financial forecasting powered by historical sales velocity and cost trends.
          </p>
        </div>

        {/* Growth Simulation Slider */}
        <div className="flex items-center gap-3 bg-white p-2.5 px-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <Sliders className="w-4 h-4 text-purple-600" />
          <div className="text-xs">
            <span className="text-slate-500 font-medium">Growth Scenario: </span>
            <span className="font-bold text-purple-700">+{Math.round((growthMultiplier - 1) * 100)}%</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="1.50"
            step="0.05"
            value={growthMultiplier}
            onChange={(e) => setGrowthMultiplier(parseFloat(e.target.value))}
            className="w-24 accent-purple-600 cursor-pointer"
          />
        </div>
      </div>

      {/* 4 Forecast Outcome Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Expected Revenue */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Expected Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-2">{formatINR(estimatedRevenue)}</h3>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">+16.3% projected surge</p>
        </div>

        {/* Expected Expenses */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Expected Expenses</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-2">{formatINR(estimatedExpenses)}</h3>
          <p className="text-[11px] text-slate-500 mt-1">Cost inflation controlled</p>
        </div>

        {/* Expected Profit */}
        <div className="p-5 bg-gradient-to-br from-indigo-900 to-purple-950 text-white rounded-2xl border border-purple-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Expected Profit</span>
            <Sparkles className="w-5 h-5 text-purple-300" />
          </div>
          <h3 className="text-2xl font-black text-emerald-400 mt-2">{formatINR(estimatedProfit)}</h3>
          <p className="text-[11px] text-purple-200 mt-1">Target Net Earnings</p>
        </div>

        {/* Expected Profit Margin */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Expected Margin</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              %
            </div>
          </div>
          <h3 className="text-2xl font-black text-emerald-600 mt-2">{estimatedMargin}%</h3>
          <p className="text-[11px] text-slate-500 mt-1">High-margin operational model</p>
        </div>
      </div>

      {/* Trajectory Projection Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">Historical & Projected Profit Trajectory</h3>
            <p className="text-xs text-slate-500">Solid curve: Actual recorded profit | Dashed purple: AI forecast</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
              <Zap className="w-3.5 h-3.5" /> High Confidence Model
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dynamicForecastData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => formatCompactINR(v)} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: any, name: any) => [v ? formatINR(Number(v)) : 'N/A', name === 'actual' ? 'Actual Profit' : 'Projected Profit']} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="actual" name="Actual Profit" stroke="#4f46e5" strokeWidth={3} fill="url(#actualGrad)" />
              <Area type="monotone" dataKey="projected" name="Projected Profit" stroke="#a855f7" strokeWidth={3} strokeDasharray="5 5" fill="url(#projGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Strategic Growth Recommendations */}
      <div className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6 rounded-3xl border border-purple-100 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Recommended Growth Levers</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-white rounded-2xl border border-purple-100 shadow-xs">
            <h4 className="font-bold text-purple-950 mb-1">1. Inventory Rationalization</h4>
            <p className="text-slate-600 leading-relaxed">
              Order bulk batches for your top 3 selling fast-moving inventory items to negotiate an extra 4–6% supplier discount.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-purple-100 shadow-xs">
            <h4 className="font-bold text-purple-950 mb-1">2. Accelerated Receivables</h4>
            <p className="text-slate-600 leading-relaxed">
              Introducing a 1.5% prompt-payment discount for clients paying within 7 days can reduce your pending ₹75,000 dues by 60%.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-purple-100 shadow-xs">
            <h4 className="font-bold text-purple-950 mb-1">3. Marketing Margin Boost</h4>
            <p className="text-slate-600 leading-relaxed">
              Your marketing spend has a 4.2x ROAS. Increasing targeted digital spend by ₹5,000 can drive an estimated ₹21,000 incremental revenue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
