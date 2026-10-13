import React, { useState } from 'react';
import { useBiz } from '../../../context/BizContext';
import { BudgetCategoryItem } from '../../../types';
import { 
  PieChart as PieIcon, 
  AlertTriangle, 
  IndianRupee, 
  Edit2
} from 'lucide-react';
import { formatINR } from '../../../utils/formatters';
import { Modal } from '../../ui/Modal';

export const BudgetView: React.FC = () => {
  const { budgetCategories, updateBudgetLimit } = useBiz();

  const [editingCategory, setEditingCategory] = useState<BudgetCategoryItem | null>(null);
  const [newBudgetLimit, setNewBudgetLimit] = useState('');

  const totalBudget = budgetCategories.reduce((sum, b) => sum + b.monthlyBudget, 0);
  const totalSpent = budgetCategories.reduce((sum, b) => sum + b.spent, 0);
  const remainingBudget = totalBudget - totalSpent;
  const overallUtilization = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    const limit = parseFloat(newBudgetLimit);
    if (isNaN(limit) || limit <= 0) return;

    updateBudgetLimit(editingCategory.category, limit);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <PieIcon className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Budget Management & Spending Limits</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Set expense thresholds for operating categories and monitor real-time spend variance.
          </p>
        </div>
      </div>

      {/* High-level Budget Utilization Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Budgeted */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Monthly Budget</span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{formatINR(totalBudget)}</h3>
          <p className="text-[11px] text-slate-500 mt-1">Across {budgetCategories.length} expenditure categories</p>
        </div>

        {/* Total Spent */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Utilized</span>
          <h3 className="text-2xl sm:text-3xl font-black text-rose-600 mt-1">{formatINR(totalSpent)}</h3>
          <p className="text-[11px] text-slate-500 mt-1">{overallUtilization}% of budget consumed</p>
        </div>

        {/* Remaining Headroom */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Headroom</span>
          <h3 className={`text-2xl sm:text-3xl font-black mt-1 ${remainingBudget >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {formatINR(remainingBudget)}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            {remainingBudget >= 0 ? 'Within approved financial limits' : 'Budget overrun detected'}
          </p>
        </div>
      </div>

      {/* Category Progress Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Category Spending Limits & Variance
          </h3>
          <span className="text-xs font-semibold text-slate-500">Monthly Targets</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgetCategories.map((cat) => {
            const pct = cat.monthlyBudget > 0 ? Math.round((cat.spent / cat.monthlyBudget) * 100) : 0;
            const isExceeded = cat.spent > cat.monthlyBudget;
            const isNearLimit = pct >= 80 && !isExceeded;

            return (
              <div
                key={cat.category}
                className={`p-5 rounded-2xl border transition-all ${
                  isExceeded
                    ? 'bg-rose-50/40 border-rose-200'
                    : isNearLimit
                    ? 'bg-amber-50/40 border-amber-200'
                    : 'bg-slate-50/60 border-slate-200/80 hover:bg-white hover:shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-sm font-bold text-slate-900">{cat.category}</span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Spent: <span className="font-semibold text-slate-800">{formatINR(cat.spent)}</span> of {formatINR(cat.monthlyBudget)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                      isExceeded
                        ? 'bg-rose-100 text-rose-700'
                        : isNearLimit
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {pct}%
                    </span>

                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setNewBudgetLimit(cat.monthlyBudget.toString());
                      }}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
                      title="Edit Budget Limit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3.5 h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, pct)}%` }}
                    className={`h-full transition-all duration-300 ${
                      isExceeded ? 'bg-rose-500' : isNearLimit ? 'bg-amber-500' : 'bg-indigo-600'
                    }`}
                  />
                </div>

                {/* Warning note */}
                <div className="mt-2.5 flex items-center justify-between text-[11px]">
                  {isExceeded ? (
                    <span className="text-rose-600 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Over budget by {formatINR(cat.spent - cat.monthlyBudget)}
                    </span>
                  ) : isNearLimit ? (
                    <span className="text-amber-600 font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Nearing budget ceiling ({formatINR(cat.monthlyBudget - cat.spent)} left)
                    </span>
                  ) : (
                    <span className="text-slate-500">
                      {formatINR(cat.monthlyBudget - cat.spent)} available
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Budget Modal */}
      {editingCategory && (
        <Modal
          isOpen={Boolean(editingCategory)}
          onClose={() => setEditingCategory(null)}
          title={`Update Budget Limit: ${editingCategory.category}`}
          subtitle="Adjust the monthly expense cap for this operational category."
          maxWidth="sm"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                New Monthly Limit (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  min="500"
                  step="500"
                  required
                  value={newBudgetLimit}
                  onChange={(e) => setNewBudgetLimit(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Save Budget
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
