import React, { useState } from 'react';
import { useBiz } from '../../context/BizContext';
import { useAuth } from '../../context/AuthContext';
import { DateFilterOption } from '../../types';
import { LogoutModal } from '../auth/LogoutModal';
import { 
  Menu, 
  Search, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  FilePlus, 
  Bell, 
  Calendar, 
  Check,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Sparkles,
  Building2
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenAddIncome: () => void;
  onOpenAddExpense: () => void;
  onOpenCreateInvoice: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onOpenAddIncome,
  onOpenAddExpense,
  onOpenCreateInvoice,
}) => {
  const { 
    dateFilter, 
    setDateFilter, 
    setIsSearchModalOpen, 
    insights,
    setActiveTab,
    businessProfile 
  } = useBiz();

  const { currentUser, logout } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const dateFilterOptions: { id: DateFilterOption; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'this_week', label: 'This Week' },
    { id: 'this_month', label: 'This Month' },
    { id: 'this_year', label: 'This Year' },
    { id: 'all', label: 'All Time' },
  ];

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setShowLogoutModal(false);
      window.location.href = '/login';
    } finally {
      setIsLoggingOut(false);
    }
  };

  const displayName = currentUser?.fullName || businessProfile.name;
  const displayBusiness = currentUser?.businessName || businessProfile.businessName;

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search trigger */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-slate-100/80 hover:bg-slate-200/80 text-slate-500 rounded-xl text-xs font-medium border border-slate-200/60 transition-colors w-64 md:w-72 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="flex-1 text-left truncate">Search invoices, clients, expenses...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] text-slate-400 font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Center: Date Range Filter Bar */}
        <div className="hidden md:flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/60">
          {dateFilterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setDateFilter(opt.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                dateFilter === opt.id
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search button */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="sm:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {insights.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Business Alerts</span>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                    {insights.length} Active
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto p-2 space-y-1">
                  {insights.map(ins => (
                    <div
                      key={ins.id}
                      onClick={() => {
                        if (ins.actionTab) setActiveTab(ins.actionTab as any);
                        setShowNotifications(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-800">{ins.title}</span>
                        {ins.metric && (
                          <span className="text-[10px] font-bold text-indigo-600">{ins.metric}</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-snug">{ins.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Action: Add Income */}
          <button
            onClick={onOpenAddIncome}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+ Income</span>
          </button>

          {/* Quick Action: Add Expense */}
          <button
            onClick={onOpenAddExpense}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>+ Expense</span>
          </button>

          {/* Quick Action: New Invoice */}
          <button
            onClick={onOpenCreateInvoice}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+ Invoice</span>
            <span className="sm:hidden">Invoice</span>
          </button>

          {/* User Profile Menu Dropdown */}
          <div className="relative pl-1 border-l border-slate-200">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              id="header-user-menu-button"
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
              aria-label="User Profile Menu"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 text-left">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                  <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3 h-3 text-indigo-500 shrink-0" />
                    <span className="truncate">{displayBusiness}</span>
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold">
                    <Sparkles className="w-3 h-3" />
                    <span>{businessProfile.plan} Plan</span>
                  </div>
                </div>

                <div className="p-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Business Profile & Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowLogoutModal(true);
                    }}
                    id="header-logout-button"
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        isLoading={isLoggingOut}
      />
    </>
  );
};
