import React, { useState, useMemo, useEffect } from 'react';
import { useBiz } from '../../context/BizContext';
import { 
  Search, 
  ArrowRight, 
  Receipt, 
  Users, 
  Truck, 
  FileText, 
  ArrowUpRight, 
  ArrowDownRight,
  X
} from 'lucide-react';
import { formatINR, formatDate } from '../../utils/formatters';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isSearchModalOpen, 
    setIsSearchModalOpen, 
    transactions, 
    customers, 
    suppliers, 
    invoices,
    setActiveTab 
  } = useBiz();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const results = useMemo(() => {
    if (!query.trim()) {
      return {
        transactions: transactions.slice(0, 4),
        customers: customers.slice(0, 3),
        invoices: invoices.slice(0, 3),
      };
    }

    const q = query.toLowerCase();

    const matchedTxs = transactions.filter(t => 
      t.title.toLowerCase().includes(q) ||
      t.counterparty.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.amount.toString().includes(q) ||
      (t.invoiceNo && t.invoiceNo.toLowerCase().includes(q))
    );

    const matchedCusts = customers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.company && c.company.toLowerCase().includes(q)) ||
      c.phone.includes(q)
    );

    const matchedSuppliers = suppliers.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.company.toLowerCase().includes(q) ||
      s.phone.includes(q)
    );

    const matchedInvoices = invoices.filter(inv =>
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.customerName.toLowerCase().includes(q) ||
      inv.totalAmount.toString().includes(q)
    );

    return {
      transactions: matchedTxs,
      customers: matchedCusts,
      suppliers: matchedSuppliers,
      invoices: matchedInvoices,
    };
  }, [query, transactions, customers, suppliers, invoices]);

  const hasResults = 
    (results.transactions?.length || 0) > 0 ||
    (results.customers?.length || 0) > 0 ||
    (results.suppliers?.length || 0) > 0 ||
    (results.invoices?.length || 0) > 0;

  const handleSelect = (tab: any) => {
    setActiveTab(tab);
    setIsSearchModalOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 pt-20">
      <div 
        className="fixed inset-0"
        onClick={() => setIsSearchModalOpen(false)}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search input bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            type="text"
            placeholder="Search transactions, customers, suppliers, invoices, or amounts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full text-slate-900 placeholder:text-slate-400 bg-transparent text-base focus:outline-hidden"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs text-slate-400 bg-slate-200/70 rounded-md font-mono">
            ESC
          </kbd>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5 divide-y divide-slate-100">
          {!hasResults && (
            <div className="text-center py-12 text-slate-500">
              <Search className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="font-medium text-slate-700">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-400 mt-1">Try searching by client name, invoice number, or category.</p>
            </div>
          )}

          {/* Invoices */}
          {results.invoices && results.invoices.length > 0 && (
            <div className="pt-2 first:pt-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-500" /> Invoices
                </span>
                <button 
                  onClick={() => handleSelect('invoices')}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1.5">
                {results.invoices.slice(0, 3).map(inv => (
                  <div
                    key={inv.id}
                    onClick={() => handleSelect('invoices')}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/60 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        INV
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-900">{inv.invoiceNumber} — {inv.customerName}</p>
                        <p className="text-xs text-slate-500">{formatDate(inv.date)} • {inv.items.length} items</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">{formatINR(inv.totalAmount)}</p>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                        inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                        inv.status === 'overdue' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transactions */}
          {results.transactions && results.transactions.length > 0 && (
            <div className="pt-3 first:pt-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-emerald-500" /> Transactions
                </span>
                <button 
                  onClick={() => handleSelect('income')}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1.5">
                {results.transactions.slice(0, 4).map(tx => {
                  const isIncome = tx.type === 'income' || tx.type === 'sale';
                  return (
                    <div
                      key={tx.id}
                      onClick={() => handleSelect(isIncome ? 'income' : 'expenses')}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isIncome ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{tx.title}</p>
                          <p className="text-xs text-slate-500">{tx.counterparty} • {tx.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${isIncome ? 'text-emerald-600' : 'text-slate-800'}`}>
                          {isIncome ? '+' : '-'}{formatINR(tx.amount)}
                        </p>
                        <p className="text-xs text-slate-400">{formatDate(tx.date)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customers */}
          {results.customers && results.customers.length > 0 && (
            <div className="pt-3 first:pt-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-500" /> Customers
                </span>
                <button 
                  onClick={() => handleSelect('customers')}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1.5">
                {results.customers.slice(0, 3).map(c => (
                  <div
                    key={c.id}
                    onClick={() => handleSelect('customers')}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.company || c.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-slate-600">Total Sales: <span className="font-bold text-slate-900">{formatINR(c.totalSales)}</span></p>
                      {c.pendingAmount > 0 ? (
                        <span className="text-xs font-semibold text-rose-600">Pending: {formatINR(c.pendingAmount)}</span>
                      ) : (
                        <span className="text-xs font-medium text-emerald-600">All cleared</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suppliers */}
          {results.suppliers && results.suppliers.length > 0 && (
            <div className="pt-3 first:pt-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-500" /> Suppliers
                </span>
                <button 
                  onClick={() => handleSelect('suppliers')}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1.5">
                {results.suppliers.slice(0, 3).map(s => (
                  <div
                    key={s.id}
                    onClick={() => handleSelect('suppliers')}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-slate-600">Total Purchases: <span className="font-bold text-slate-900">{formatINR(s.totalPurchases)}</span></p>
                      {s.pendingAmount > 0 && (
                        <span className="text-xs font-semibold text-amber-600">Payable: {formatINR(s.pendingAmount)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-3 bg-slate-100/60 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500">
          <span>Quick actions & search for your business</span>
          <div className="flex items-center gap-2">
            <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px]">ESC</kbd> to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
