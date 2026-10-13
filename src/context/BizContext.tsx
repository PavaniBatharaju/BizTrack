import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Transaction, 
  Customer, 
  Supplier, 
  Invoice, 
  BudgetCategoryItem, 
  BusinessProfile,
  SmartInsight,
  FinancialMetrics,
  ActiveTab,
  DateFilterOption,
  ExpenseCategory,
  IncomeCategory,
  PaymentMethod
} from '../types';
import { 
  initialBusinessProfile, 
  initialCustomers, 
  initialSuppliers, 
  initialTransactions, 
  initialInvoices, 
  initialBudgetCategories 
} from '../data/sampleData';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

interface BizContextType {
  // State
  isAuthenticated: boolean;
  businessProfile: BusinessProfile;
  activeTab: ActiveTab;
  dateFilter: DateFilterOption;
  searchQuery: string;
  isSearchModalOpen: boolean;
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  customers: Customer[];
  suppliers: Supplier[];
  invoices: Invoice[];
  budgetCategories: BudgetCategoryItem[];
  metrics: FinancialMetrics;
  insights: SmartInsight[];
  toasts: ToastNotification[];

  // Navigation & UI Actions
  setActiveTab: (tab: ActiveTab) => void;
  setDateFilter: (filter: DateFilterOption) => void;
  setSearchQuery: (query: string) => void;
  setIsSearchModalOpen: (open: boolean) => void;
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Auth Actions
  login: (email?: string, name?: string) => void;
  logout: () => void;
  updateBusinessProfile: (profile: Partial<BusinessProfile>) => void;

  // Transaction Actions
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Customer Actions
  addCustomer: (customer: Omit<Customer, 'id' | 'totalSales' | 'paidAmount' | 'pendingAmount' | 'overdueAmount' | 'lastTransactionDate' | 'status'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  sendPaymentReminder: (customerId: string) => void;

  // Supplier Actions
  addSupplier: (supplier: Omit<Supplier, 'id' | 'totalPurchases' | 'paidAmount' | 'pendingAmount' | 'status'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  recordSupplierPayment: (supplierId: string, amount: number) => void;

  // Invoice Actions
  createInvoice: (invoice: Omit<Invoice, 'id'>) => string;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  markInvoicePaid: (id: string, paymentMethod?: PaymentMethod) => void;
  deleteInvoice: (id: string) => void;

  // Budget Actions
  updateBudgetLimit: (category: ExpenseCategory, newBudget: number) => void;

  // Data Management
  resetToSampleData: () => void;
  exportJSONData: () => void;
}

const BizContext = createContext<BizContextType | null>(null);

const STORAGE_KEYS = {
  PROFILE: 'biztrack_profile_v1',
  TRANSACTIONS: 'biztrack_transactions_v1',
  CUSTOMERS: 'biztrack_customers_v1',
  SUPPLIERS: 'biztrack_suppliers_v1',
  INVOICES: 'biztrack_invoices_v1',
  BUDGET: 'biztrack_budget_v1',
  AUTH: 'biztrack_auth_v1',
};

export const BizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved ? JSON.parse(saved) : true; // Default logged in for smooth SaaS experience
  });

  // Business Profile
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : initialBusinessProfile;
  });

  // Navigation & UI State
  const [activeTab, setActiveTabState] = useState<ActiveTab>('dashboard');
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('this_month');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Entities
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
    return saved ? JSON.parse(saved) : initialSuppliers;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [budgetCategories, setBudgetCategories] = useState<BudgetCategoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUDGET);
    return saved ? JSON.parse(saved) : initialBudgetCategories;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(businessProfile));
  }, [businessProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budgetCategories));
  }, [budgetCategories]);

  // Toast Helpers
  const showToast = useCallback((title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const setActiveTab = useCallback((tab: ActiveTab) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Filter transactions by date
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return transactions.filter(tx => {
      if (!tx.date) return true;
      const txDate = new Date(tx.date);

      if (dateFilter === 'today') {
        return txDate.toDateString() === now.toDateString();
      }
      if (dateFilter === 'this_week') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        return txDate >= startOfWeek;
      }
      if (dateFilter === 'this_month') {
        return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
      }
      if (dateFilter === 'this_quarter') {
        const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
        return txDate.getFullYear() === currentYear && txDate.getMonth() >= quarterStartMonth;
      }
      if (dateFilter === 'this_year') {
        return txDate.getFullYear() === currentYear;
      }
      return true; // 'all'
    });
  }, [transactions, dateFilter]);

  // Live Financial Metrics calculation
  const metrics: FinancialMetrics = useMemo(() => {
    const incomeTxs = filteredTransactions.filter(t => t.type === 'income' || t.type === 'sale');
    const expenseTxs = filteredTransactions.filter(t => t.type === 'expense' || t.type === 'purchase');

    const totalRevenue = incomeTxs.reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalExpenses = expenseTxs.reduce((sum, t) => sum + (t.amount || 0), 0);

    // COGS = Inventory or Direct purchases
    const cogs = expenseTxs
      .filter(t => t.category === 'Inventory')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const grossProfit = totalRevenue - cogs;
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? Number(((netProfit / totalRevenue) * 100).toFixed(1)) : 0;

    // Cash flow calculation
    const cashInflows = incomeTxs.reduce((sum, t) => sum + (t.amount || 0), 0);
    const cashOutflows = expenseTxs.reduce((sum, t) => sum + (t.amount || 0), 0);
    const netCashFlow = cashInflows - cashOutflows;

    const openingBalance = 233300;
    const closingBalance = openingBalance + netCashFlow;
    const cashBalance = closingBalance;

    // Overdue / pending customer totals
    const pendingCustTotal = customers.reduce((sum, c) => sum + (c.pendingAmount || 0), 0);
    const pendingCustCount = customers.filter(c => (c.pendingAmount || 0) > 0).length;

    // Total supplier payables
    const totalPayables = suppliers.reduce((sum, s) => sum + (s.pendingAmount || 0), 0);

    return {
      totalRevenue,
      totalExpenses,
      grossProfit,
      netProfit,
      profitMargin,
      cashBalance,
      moneyIn: cashInflows,
      moneyOut: cashOutflows,
      netCashFlow,
      openingBalance,
      closingBalance,
      revenueGrowthPct: 12.5,
      expenseGrowthPct: -4.2,
      profitGrowthPct: 18.3,
      pendingCustomerAmount: pendingCustTotal,
      pendingCustomerCount: pendingCustCount,
      totalPayablesAmount: totalPayables,
    };
  }, [filteredTransactions, customers, suppliers]);

  // Update budget actual spending dynamically
  useEffect(() => {
    setBudgetCategories(prev => {
      const categorySpentMap: Record<string, number> = {};
      
      transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
          categorySpentMap[t.category] = (categorySpentMap[t.category] || 0) + t.amount;
        });

      return prev.map(item => ({
        ...item,
        spent: categorySpentMap[item.category] || 0,
      }));
    });
  }, [transactions]);

  // Dynamic Smart Insights Generator
  const insights: SmartInsight[] = useMemo(() => {
    const list: SmartInsight[] = [];

    // Revenue growth insight
    list.push({
      id: 'ins-1',
      type: 'positive',
      title: 'Sales Performance Up',
      message: 'Your sales increased by 18.3% compared with last month across retail & corporate orders.',
      metric: '+18.3%',
      actionText: 'View Sales Report',
      actionTab: 'reports',
    });

    // Overdue customer alert
    if (metrics.pendingCustomerAmount > 0) {
      list.push({
        id: 'ins-2',
        type: 'warning',
        title: 'Pending Customer Receivables',
        message: `You have ₹${metrics.pendingCustomerAmount.toLocaleString('en-IN')} in pending payments from ${metrics.pendingCustomerCount} customer accounts.`,
        metric: `₹${metrics.pendingCustomerAmount.toLocaleString('en-IN')}`,
        actionText: 'Send Reminders',
        actionTab: 'customers',
      });
    }

    // High expense category check
    const topExpense = budgetCategories.find(b => b.spent >= b.monthlyBudget * 0.9);
    if (topExpense) {
      list.push({
        id: 'ins-3',
        type: 'warning',
        title: `${topExpense.category} Budget Alert`,
        message: `${topExpense.category} expenses reached ${Math.round((topExpense.spent / topExpense.monthlyBudget) * 100)}% of your monthly allocation.`,
        metric: `${Math.round((topExpense.spent / topExpense.monthlyBudget) * 100)}%`,
        actionText: 'Review Budget',
        actionTab: 'budget',
      });
    } else {
      list.push({
        id: 'ins-3-normal',
        type: 'info',
        title: 'Healthy Profit Margin',
        message: `Your business maintained a strong ${metrics.profitMargin}% net margin this month.`,
        metric: `${metrics.profitMargin}%`,
        actionText: 'Profit Breakdown',
        actionTab: 'calculator',
      });
    }

    // Highest revenue stream
    list.push({
      id: 'ins-4',
      type: 'tip',
      title: 'Top Revenue Stream',
      message: 'Product Sales represents 78% of your total business revenue this month.',
      metric: 'Product Sales',
      actionText: 'Analyze Stream',
      actionTab: 'reports',
    });

    return list;
  }, [metrics, budgetCategories]);

  // Auth Handlers
  const login = (email = 'rajesh@sharmaelectronics.in', name = 'Rajesh Sharma') => {
    setIsAuthenticated(true);
    setBusinessProfile(prev => ({ ...prev, email, name }));
    showToast('Welcome back!', `Signed in as ${name}`, 'success');
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('Signed Out', 'You have been logged out of BizTrack', 'info');
  };

  const updateBusinessProfile = (profile: Partial<BusinessProfile>) => {
    setBusinessProfile(prev => ({ ...prev, ...profile }));
    showToast('Profile Updated', 'Business settings updated successfully', 'success');
  };

  // Transaction Handlers
  const addTransaction = (tx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };

    setTransactions(prev => [newTx, ...prev]);

    // Update customer total if applicable
    if (tx.counterparty && (tx.type === 'income' || tx.type === 'sale')) {
      setCustomers(prev => prev.map(c => {
        if (c.name.toLowerCase() === tx.counterparty.toLowerCase() || c.company?.toLowerCase() === tx.counterparty.toLowerCase()) {
          return {
            ...c,
            totalSales: c.totalSales + tx.amount,
            paidAmount: c.paidAmount + tx.amount,
            lastTransactionDate: tx.date,
          };
        }
        return c;
      }));
    }

    showToast(
      tx.type === 'income' ? 'Income Added' : 'Expense Recorded',
      `₹${tx.amount.toLocaleString('en-IN')} for ${tx.title} has been logged.`,
      'success'
    );
  };

  const updateTransaction = (id: string, updated: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => (t.id === id ? { ...t, ...updated } : t)));
    showToast('Transaction Updated', 'Changes have been saved', 'success');
  };

  const deleteTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    setTransactions(prev => prev.filter(t => t.id !== id));
    showToast(
      'Transaction Deleted',
      tx ? `Removed "${tx.title}" (${tx.type})` : 'Transaction removed',
      'info'
    );
  };

  // Customer Handlers
  const addCustomer = (custData: Omit<Customer, 'id' | 'totalSales' | 'paidAmount' | 'pendingAmount' | 'overdueAmount' | 'lastTransactionDate' | 'status'>) => {
    const newCustomer: Customer = {
      ...custData,
      id: `cust-${Date.now()}`,
      totalSales: 0,
      paidAmount: 0,
      pendingAmount: 0,
      overdueAmount: 0,
      lastTransactionDate: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    setCustomers(prev => [newCustomer, ...prev]);
    showToast('Customer Added', `${newCustomer.name} added to your client list`, 'success');
  };

  const updateCustomer = (id: string, updated: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => (c.id === id ? { ...c, ...updated } : c)));
    showToast('Customer Updated', 'Client details saved', 'success');
  };

  const sendPaymentReminder = (customerId: string) => {
    const cust = customers.find(c => c.id === customerId);
    if (!cust) return;
    showToast(
      'Reminder Dispatched',
      `Payment reminder SMS & WhatsApp sent to ${cust.name} for ₹${cust.pendingAmount.toLocaleString('en-IN')}`,
      'success'
    );
  };

  // Supplier Handlers
  const addSupplier = (supplierData: Omit<Supplier, 'id' | 'totalPurchases' | 'paidAmount' | 'pendingAmount' | 'status'>) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: `sup-${Date.now()}`,
      totalPurchases: 0,
      paidAmount: 0,
      pendingAmount: 0,
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      status: 'paid',
    };
    setSuppliers(prev => [newSupplier, ...prev]);
    showToast('Supplier Added', `${newSupplier.name} registered`, 'success');
  };

  const updateSupplier = (id: string, updated: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => (s.id === id ? { ...s, ...updated } : s)));
    showToast('Supplier Updated', 'Supplier record updated', 'success');
  };

  const recordSupplierPayment = (supplierId: string, amount: number) => {
    setSuppliers(prev => prev.map(s => {
      if (s.id === supplierId) {
        const newPaid = s.paidAmount + amount;
        const newPending = Math.max(0, s.pendingAmount - amount);
        return {
          ...s,
          paidAmount: newPaid,
          pendingAmount: newPending,
          status: newPending === 0 ? 'paid' : 'pending',
        };
      }
      return s;
    }));

    // Record as expense transaction
    const supplier = suppliers.find(s => s.id === supplierId);
    if (supplier) {
      addTransaction({
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        title: `Supplier Payment to ${supplier.name}`,
        category: 'Inventory',
        amount,
        paymentMethod: 'Bank Transfer',
        counterparty: supplier.name,
        status: 'completed',
        notes: `Paid toward supplier account balance`,
      });
    }

    showToast('Payment Recorded', `Recorded payment of ₹${amount.toLocaleString('en-IN')}`, 'success');
  };

  // Invoice Handlers
  const createInvoice = (invData: Omit<Invoice, 'id'>): string => {
    const newId = `inv-${Date.now()}`;
    const newInvoice: Invoice = {
      ...invData,
      id: newId,
    };
    setInvoices(prev => [newInvoice, ...prev]);

    // If invoice is created as paid, log the income
    if (invData.status === 'paid') {
      addTransaction({
        date: invData.date,
        type: 'income',
        title: `Invoice Payment: ${invData.customerName}`,
        category: 'Product Sales',
        amount: invData.totalAmount,
        paymentMethod: invData.paymentMethod || 'UPI',
        counterparty: invData.customerName,
        invoiceNo: invData.invoiceNumber,
        status: 'completed',
        notes: `Automated entry from invoice ${invData.invoiceNumber}`,
      });
    }

    showToast('Invoice Created', `Invoice #${invData.invoiceNumber} created for ₹${invData.totalAmount.toLocaleString('en-IN')}`, 'success');
    return newId;
  };

  const updateInvoice = (id: string, updated: Partial<Invoice>) => {
    setInvoices(prev => prev.map(inv => (inv.id === id ? { ...inv, ...updated } : inv)));
    showToast('Invoice Updated', 'Invoice details modified', 'success');
  };

  const markInvoicePaid = (id: string, paymentMethod: PaymentMethod = 'UPI') => {
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;

    setInvoices(prev => prev.map(i => {
      if (i.id === id) {
        return {
          ...i,
          status: 'paid',
          paymentMethod,
          paidDate: new Date().toISOString().split('T')[0],
        };
      }
      return i;
    }));

    // Record income transaction
    addTransaction({
      date: new Date().toISOString().split('T')[0],
      type: 'income',
      title: `Invoice Settled: ${inv.customerName}`,
      category: 'Product Sales',
      amount: inv.totalAmount,
      paymentMethod,
      counterparty: inv.customerName,
      invoiceNo: inv.invoiceNumber,
      status: 'completed',
      notes: `Payment for invoice ${inv.invoiceNumber}`,
    });

    showToast('Invoice Settled', `Invoice #${inv.invoiceNumber} marked as Paid`, 'success');
  };

  const deleteInvoice = (id: string) => {
    const inv = invoices.find(i => i.id === id);
    setInvoices(prev => prev.filter(i => i.id !== id));
    showToast('Invoice Removed', inv ? `Deleted ${inv.invoiceNumber}` : 'Invoice deleted', 'info');
  };

  // Budget Limit updater
  const updateBudgetLimit = (category: ExpenseCategory, newBudget: number) => {
    setBudgetCategories(prev => prev.map(item => {
      if (item.category === category) {
        return { ...item, monthlyBudget: newBudget };
      }
      return item;
    }));
    showToast('Budget Updated', `${category} budget set to ₹${newBudget.toLocaleString('en-IN')}`, 'success');
  };

  // Reset to initial demo data
  const resetToSampleData = () => {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.SUPPLIERS);
    localStorage.removeItem(STORAGE_KEYS.INVOICES);
    localStorage.removeItem(STORAGE_KEYS.BUDGET);

    setBusinessProfile(initialBusinessProfile);
    setTransactions(initialTransactions);
    setCustomers(initialCustomers);
    setSuppliers(initialSuppliers);
    setInvoices(initialInvoices);
    setBudgetCategories(initialBudgetCategories);

    showToast('Data Reset', 'Restored realistic sample business records', 'info');
  };

  const exportJSONData = () => {
    const data = {
      profile: businessProfile,
      transactions,
      customers,
      suppliers,
      invoices,
      budgetCategories,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `BizTrack_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Data Exported', 'Full JSON backup downloaded', 'success');
  };

  return (
    <BizContext.Provider
      value={{
        isAuthenticated,
        businessProfile,
        activeTab,
        dateFilter,
        searchQuery,
        isSearchModalOpen,
        transactions,
        filteredTransactions,
        customers,
        suppliers,
        invoices,
        budgetCategories,
        metrics,
        insights,
        toasts,

        setActiveTab,
        setDateFilter,
        setSearchQuery,
        setIsSearchModalOpen,
        showToast,
        removeToast,

        login,
        logout,
        updateBusinessProfile,

        addTransaction,
        updateTransaction,
        deleteTransaction,

        addCustomer,
        updateCustomer,
        sendPaymentReminder,

        addSupplier,
        updateSupplier,
        recordSupplierPayment,

        createInvoice,
        updateInvoice,
        markInvoicePaid,
        deleteInvoice,

        updateBudgetLimit,

        resetToSampleData,
        exportJSONData,
      }}
    >
      {children}
    </BizContext.Provider>
  );
};

export const useBiz = (): BizContextType => {
  const context = useContext(BizContext);
  if (!context) {
    throw new Error('useBiz must be used within a BizProvider');
  }
  return context;
};
