import React, { useState } from 'react';
import { useBiz } from '../../context/BizContext';
import { useAuth } from '../../context/AuthContext';
import { ActiveTab } from '../../types';
import { LogoutModal } from '../auth/LogoutModal';
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Package, 
  Users, 
  Truck, 
  FileText, 
  Calculator, 
  Wallet, 
  BarChart3, 
  PieChart, 
  Sparkles, 
  Settings, 
  LogOut, 
  ChevronRight,
  Store,
  Layers,
  HelpCircle,
  Home
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateLanding: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigateLanding }) => {
  const { activeTab, setActiveTab, businessProfile, invoices, customers } = useBiz();
  const { currentUser, logout } = useAuth();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const overdueInvoicesCount = invoices.filter(i => i.status === 'overdue').length;
  const pendingCustomersCount = customers.filter(c => c.pendingAmount > 0).length;

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

  const menuItems: { id: ActiveTab; label: string; icon: any; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'income', label: 'Income', icon: TrendingUp },
    { id: 'expenses', label: 'Expenses', icon: TrendingDown },
    { id: 'sales', label: 'Sales', icon: ShoppingCart },
    { id: 'purchases', label: 'Purchases', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users, badge: pendingCustomersCount, badgeColor: 'bg-amber-100 text-amber-700' },
    { id: 'suppliers', label: 'Suppliers', icon: Truck },
    { id: 'invoices', label: 'Invoices', icon: FileText, badge: overdueInvoicesCount > 0 ? overdueInvoicesCount : undefined, badgeColor: 'bg-rose-100 text-rose-700' },
    { id: 'calculator', label: 'Profit Calculator', icon: Calculator },
    { id: 'cashflow', label: 'Cash Flow', icon: Wallet },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'budget', label: 'Budget', icon: PieChart },
    { id: 'forecast', label: 'Forecast', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelect = (id: ActiveTab) => {
    setActiveTab(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Logo */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div 
            onClick={onNavigateLanding}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight flex items-center gap-1">
                BizTrack <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-800/60">PRO</span>
              </span>
            </div>
          </div>
        </div>

        {/* Business Selector / Switcher Card */}
        <div className="p-3.5 mx-3 my-2 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Store className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{displayBusiness}</p>
              <p className="text-[10px] text-slate-400 truncate">{businessProfile.city}, {businessProfile.state}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5 custom-scrollbar">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Core Financials
          </div>

          {menuItems.slice(0, 8).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-indigo-500 text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Analytics & Planning
          </div>

          {menuItems.slice(8).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'forecast' && (
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded">
                    Smart
                  </span>
                )}
              </button>
            );
          })}

          {/* Landing Page link */}
          <div className="pt-2 border-t border-slate-800/60 mt-2">
            <button
              onClick={onNavigateLanding}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Home className="w-4 h-4 text-indigo-400" />
                <span>Visit Landing Page</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* User Profile & Logout Bottom Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{displayName}</p>
                <p className="text-[10px] text-slate-500 truncate">{businessProfile.plan} Plan</p>
              </div>
            </div>

            <button
              onClick={() => setShowLogoutModal(true)}
              id="sidebar-logout-button"
              title="Log Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        isLoading={isLoggingOut}
      />
    </>
  );
};
