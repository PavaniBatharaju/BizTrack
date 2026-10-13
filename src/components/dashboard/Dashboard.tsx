import React, { useState } from 'react';
import { useBiz } from '../../context/BizContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DashboardOverview } from './views/DashboardOverview';
import { IncomeView } from './views/IncomeView';
import { ExpenseView } from './views/ExpenseView';
import { ProfitCalculatorView } from './views/ProfitCalculatorView';
import { CashFlowView } from './views/CashFlowView';
import { CustomersView } from './views/CustomersView';
import { SuppliersView } from './views/SuppliersView';
import { InvoicesView } from './views/InvoicesView';
import { ReportsView } from './views/ReportsView';
import { BudgetView } from './views/BudgetView';
import { ForecastView } from './views/ForecastView';
import { SettingsView } from './views/SettingsView';
import { AddIncomeModal } from './modals/AddIncomeModal';
import { AddExpenseModal } from './modals/AddExpenseModal';
import { CreateInvoiceModal } from './modals/CreateInvoiceModal';
import { GlobalSearchModal } from '../search/GlobalSearchModal';

interface DashboardProps {
  onNavigateLanding: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateLanding }) => {
  const { activeTab } = useBiz();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modal controls
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row font-sans text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigateLanding={onNavigateLanding}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto custom-scrollbar">
        {/* Top Sticky Header */}
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenAddIncome={() => setIsAddIncomeOpen(true)}
          onOpenAddExpense={() => setIsAddExpenseOpen(true)}
          onOpenCreateInvoice={() => setIsCreateInvoiceOpen(true)}
        />

        {/* View Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              onOpenAddIncome={() => setIsAddIncomeOpen(true)}
              onOpenAddExpense={() => setIsAddExpenseOpen(true)}
              onOpenCreateInvoice={() => setIsCreateInvoiceOpen(true)}
            />
          )}

          {(activeTab === 'income' || activeTab === 'sales') && (
            <IncomeView onOpenAddIncome={() => setIsAddIncomeOpen(true)} />
          )}

          {activeTab === 'expenses' && (
            <ExpenseView onOpenAddExpense={() => setIsAddExpenseOpen(true)} />
          )}

          {activeTab === 'customers' && <CustomersView />}

          {(activeTab === 'suppliers' || activeTab === 'purchases') && <SuppliersView />}

          {activeTab === 'invoices' && (
            <InvoicesView onOpenCreateInvoice={() => setIsCreateInvoiceOpen(true)} />
          )}

          {activeTab === 'calculator' && <ProfitCalculatorView />}

          {activeTab === 'cashflow' && <CashFlowView />}

          {activeTab === 'reports' && <ReportsView />}

          {activeTab === 'budget' && <BudgetView />}

          {activeTab === 'forecast' && <ForecastView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Modals */}
      <AddIncomeModal
        isOpen={isAddIncomeOpen}
        onClose={() => setIsAddIncomeOpen(false)}
      />

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
      />

      <CreateInvoiceModal
        isOpen={isCreateInvoiceOpen}
        onClose={() => setIsCreateInvoiceOpen(false)}
      />

      <GlobalSearchModal />
    </div>
  );
};
