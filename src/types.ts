export type TransactionType = 'income' | 'expense' | 'sale' | 'purchase';

export type PaymentMethod = 'Cash' | 'UPI' | 'Bank Transfer' | 'Card' | 'Cheque' | 'Other';

export type TransactionStatus = 'completed' | 'pending' | 'overdue';

export type ExpenseCategory = 
  | 'Inventory'
  | 'Rent'
  | 'Salary'
  | 'Electricity'
  | 'Marketing'
  | 'Transportation'
  | 'Office'
  | 'Software'
  | 'Utilities'
  | 'Maintenance'
  | 'Other';

export type IncomeCategory = 
  | 'Product Sales'
  | 'Services'
  | 'Consulting'
  | 'Wholesale'
  | 'Commission'
  | 'Rental Income'
  | 'Interest / Investment'
  | 'Other';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  title: string;
  category: string;
  amount: number;
  paymentMethod: PaymentMethod;
  counterparty: string; // Customer or Vendor name
  invoiceNo?: string;
  status: TransactionStatus;
  notes?: string;
  receiptUrl?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email?: string;
  address?: string;
  gstin?: string;
  totalSales: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  lastTransactionDate: string;
  status: 'active' | 'pending' | 'overdue';
}

export interface Supplier {
  id: string;
  name: string;
  company: string;
  phone: string;
  email?: string;
  address?: string;
  gstin?: string;
  totalPurchases: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
}

export interface InvoiceItem {
  id: string;
  description: string;
  hsn?: string;
  qty: number;
  rate: number;
  taxRate: number; // percentage e.g. 18 for 18% GST
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  customerGstin?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  notes?: string;
  terms?: string;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  paymentMethod?: PaymentMethod;
  paidDate?: string;
}

export interface BudgetCategoryItem {
  category: ExpenseCategory;
  monthlyBudget: number;
  spent: number;
  icon: string;
  color: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  businessName: string;
  createdAt: string;
  onboardingCompleted: boolean;
  avatarUrl?: string;
}

export type BusinessType = 
  | 'Retail Shop'
  | 'Wholesale Business'
  | 'Restaurant'
  | 'Freelancer'
  | 'Service Business'
  | 'Manufacturing'
  | 'Online Business'
  | 'Other';

export interface OnboardingData {
  businessType: BusinessType;
  businessCategory: string;
  currency: string;
  currencySymbol: string;
  financialYearStart: string;
  hasGst: boolean;
  gstNumber?: string;
}

export interface BusinessProfile {
  name: string;
  businessName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin: string;
  pan?: string;
  currency: string;
  currencySymbol: string;
  financialYear: string;
  businessType?: BusinessType;
  businessCategory?: string;
  plan: 'Free' | 'Professional' | 'Business';
  logoUrl?: string;
}

export interface SmartInsight {
  id: string;
  type: 'positive' | 'warning' | 'info' | 'tip';
  title: string;
  message: string;
  metric?: string;
  change?: string;
  actionText?: string;
  actionTab?: string;
}

export interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  cashBalance: number;
  moneyIn: number;
  moneyOut: number;
  netCashFlow: number;
  openingBalance: number;
  closingBalance: number;
  revenueGrowthPct: number;
  expenseGrowthPct: number;
  profitGrowthPct: number;
  pendingCustomerAmount: number;
  pendingCustomerCount: number;
  totalPayablesAmount: number;
}

export type ActiveTab = 
  | 'dashboard'
  | 'income'
  | 'expenses'
  | 'sales'
  | 'purchases'
  | 'customers'
  | 'suppliers'
  | 'invoices'
  | 'calculator'
  | 'cashflow'
  | 'reports'
  | 'budget'
  | 'forecast'
  | 'settings';

export type DateFilterOption = 'today' | 'this_week' | 'this_month' | 'this_quarter' | 'this_year' | 'all';
