import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  ChevronDown, 
  TrendingUp, 
  Menu, 
  X, 
  ArrowRight, 
  Calendar,
  Sparkles,
  Zap,
  FileSpreadsheet,
  Receipt,
  Users,
  BarChart3,
  Store,
  Briefcase,
  Layers,
  Factory,
  Calculator,
  BookOpen,
  HelpCircle,
  FileText,
  Percent,
  Compass,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BookDemoModal } from './BookDemoModal';

interface NavbarProps {
  onOpenDemo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'features' | 'solutions' | 'resources' | null>(null);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<'features' | 'solutions' | 'resources' | null>(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on route change or click outside
  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isHomeActive = location.pathname === '/' && (!location.hash || location.hash === '#top');

  const scrollToSection = (sectionId: string) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);

    if (location.pathname !== '/') {
      navigate(`/${sectionId}`);
      setTimeout(() => {
        const el = document.querySelector(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.querySelector(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const featureItems = [
    {
      title: 'Real-time Profit Engine',
      desc: 'Automatic gross & net margin calculations with GST deductions.',
      icon: Zap,
      color: 'text-amber-500 bg-amber-50',
      action: () => scrollToSection('#features'),
    },
    {
      title: 'Smart Invoicing & GST',
      desc: 'Create compliant GST invoices, WhatsApp PDFs, and track payments.',
      icon: Receipt,
      color: 'text-indigo-600 bg-indigo-50',
      action: () => scrollToSection('#features'),
    },
    {
      title: 'Cash Flow & Runway',
      desc: 'Predictive 90-day cash forecasting and reserve alerts.',
      icon: BarChart3,
      color: 'text-emerald-600 bg-emerald-50',
      action: () => scrollToSection('#dashboard-preview'),
    },
    {
      title: 'Customer & Vendor Khata',
      desc: 'Track pending receivables, supplier dues, and send 1-click reminders.',
      icon: Users,
      color: 'text-purple-600 bg-purple-50',
      action: () => scrollToSection('#features'),
    },
    {
      title: 'Financial Statements',
      desc: 'Instant P&L, Balance Sheet, and GST-ready export reports.',
      icon: FileSpreadsheet,
      color: 'text-blue-600 bg-blue-50',
      action: () => scrollToSection('#features'),
    },
    {
      title: 'AI Smart Insights',
      desc: 'Actionable expense reduction recommendations and anomaly detection.',
      icon: Sparkles,
      color: 'text-pink-600 bg-pink-50',
      action: () => scrollToSection('#dashboard-preview'),
    },
  ];

  const solutionItems = [
    {
      title: 'Retail & Storefronts',
      desc: 'Fast billing, counter cash reconciliation, and supplier credit tracking.',
      icon: Store,
      color: 'text-indigo-600 bg-indigo-50',
      action: () => scrollToSection('#how-it-works'),
    },
    {
      title: 'Wholesale & Distributors',
      desc: 'Bulk order invoicing, credit cycles, customer payment aging.',
      icon: Layers,
      color: 'text-emerald-600 bg-emerald-50',
      action: () => scrollToSection('#how-it-works'),
    },
    {
      title: 'Agencies & Freelancers',
      desc: 'Project-based margins, retainer invoices, and expense deductions.',
      icon: Briefcase,
      color: 'text-purple-600 bg-purple-50',
      action: () => scrollToSection('#how-it-works'),
    },
    {
      title: 'Manufacturing & Workshop',
      desc: 'Raw materials costing, job order tracking, and operating overheads.',
      icon: Factory,
      color: 'text-amber-600 bg-amber-50',
      action: () => scrollToSection('#how-it-works'),
    },
  ];

  const resourceItems = [
    {
      title: 'Free GST & Tax Calculator',
      desc: 'Compute CGST, SGST, IGST, and net reverse charge amounts instantly.',
      icon: Calculator,
      color: 'text-blue-600 bg-blue-50',
      action: () => scrollToSection('#faq'),
    },
    {
      title: 'Profit Margin Calculator',
      desc: 'Analyze markup vs margin formulas for optimal product pricing.',
      icon: Percent,
      color: 'text-emerald-600 bg-emerald-50',
      action: () => scrollToSection('#faq'),
    },
    {
      title: 'Business Guides & Blog',
      desc: 'Articles on tax compliance, working capital, and MSME growth in India.',
      icon: BookOpen,
      color: 'text-indigo-600 bg-indigo-50',
      action: () => scrollToSection('#faq'),
    },
    {
      title: 'Invoice Templates',
      desc: 'Download professionally crafted GST-compliant PDF invoice designs.',
      icon: FileText,
      color: 'text-purple-600 bg-purple-50',
      action: () => scrollToSection('#features'),
    },
    {
      title: 'Help Center & FAQs',
      desc: 'Comprehensive step-by-step guides, shortcuts, and support docs.',
      icon: HelpCircle,
      color: 'text-amber-600 bg-amber-50',
      action: () => scrollToSection('#faq'),
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2 md:gap-4">
          
          {/* LEFT SIDE: Logo & Home Button & Main Nav */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 lg:gap-6" ref={dropdownRef}>
            
            {/* BizTrack Logo */}
            <Link 
              to="/" 
              id="navbar-logo"
              onClick={handleHomeClick}
              className="flex items-center gap-2.5 sm:gap-3 group focus:outline-hidden focus:ring-2 focus:ring-indigo-500 rounded-2xl p-1"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white font-black shadow-md shadow-indigo-600/30 transition-transform duration-200 group-hover:scale-105 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-lg sm:text-xl tracking-tight text-slate-950 flex items-center gap-1.5 leading-none">
                  BizTrack
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200/90 px-1.5 py-0.5 rounded">
                    PRO
                  </span>
                </span>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wide hidden xl:block mt-0.5">
                  Smart Business Finance Tracking
                </p>
              </div>
            </Link>

            {/* Navigation Items (Desktop & Tablet) */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 text-xs font-semibold text-slate-600 ml-1 sm:ml-2">
              
              {/* 1. HOME BUTTON (Immediately after Logo, before Features) */}
              <NavLink
                to="/"
                end
                id="navbar-home-link"
                onClick={handleHomeClick}
                className={({ isActive }) => {
                  const active = isActive && isHomeActive;
                  return `flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                    active
                      ? 'text-indigo-600 font-bold bg-indigo-50/90 shadow-2xs ring-1 ring-indigo-200/60'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/80'
                  }`;
                }}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </NavLink>

              {/* 2. FEATURES DROPDOWN */}
              <div className="relative">
                <button
                  type="button"
                  id="nav-dropdown-features"
                  onClick={() => setActiveDropdown(activeDropdown === 'features' ? null : 'features')}
                  onMouseEnter={() => setActiveDropdown('features')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                    activeDropdown === 'features'
                      ? 'text-indigo-600 font-bold bg-indigo-50/80'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/80'
                  }`}
                  aria-expanded={activeDropdown === 'features'}
                >
                  <span>Features</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'features' ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
                </button>

                {/* Features Mega Dropdown */}
                {activeDropdown === 'features' && (
                  <div 
                    onMouseLeave={() => setActiveDropdown(null)}
                    className="absolute left-0 mt-2 w-96 sm:w-[480px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-3 pb-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                        Financial Tracking Capabilities
                      </span>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                        6 Modules
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3">
                      {featureItems.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={idx}
                            onClick={item.action}
                            className="p-2.5 rounded-xl hover:bg-slate-50 hover:border-slate-200 border border-transparent transition-all cursor-pointer group text-left"
                          >
                            <div className="flex items-start gap-2.5">
                              <div className={`w-7 h-7 rounded-lg ${item.color} flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                                  {item.title}
                                </p>
                                <p className="text-[10px] text-slate-500 leading-snug line-clamp-2 mt-0.5">
                                  {item.desc}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/80 -mx-4 -mb-4 p-3 rounded-b-2xl">
                      <span className="text-[11px] text-slate-500 font-medium">Ready to simplify your business finances?</span>
                      <button
                        onClick={() => {
                          setActiveDropdown(null);
                          setIsDemoModalOpen(true);
                        }}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Book 1-on-1 Demo</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. SOLUTIONS DROPDOWN */}
              <div className="relative">
                <button
                  type="button"
                  id="nav-dropdown-solutions"
                  onClick={() => setActiveDropdown(activeDropdown === 'solutions' ? null : 'solutions')}
                  onMouseEnter={() => setActiveDropdown('solutions')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                    activeDropdown === 'solutions'
                      ? 'text-indigo-600 font-bold bg-indigo-50/80'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/80'
                  }`}
                  aria-expanded={activeDropdown === 'solutions'}
                >
                  <span>Solutions</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'solutions' ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
                </button>

                {/* Solutions Dropdown */}
                {activeDropdown === 'solutions' && (
                  <div 
                    onMouseLeave={() => setActiveDropdown(null)}
                    className="absolute left-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-3 pb-2 border-b border-slate-100">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                        Tailored for Your Industry
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-3">
                      {solutionItems.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={idx}
                            onClick={item.action}
                            className="p-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group flex items-start gap-3"
                          >
                            <div className={`w-8 h-8 rounded-xl ${item.color} flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {item.title}
                              </p>
                              <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. RESOURCES DROPDOWN */}
              <div className="relative">
                <button
                  type="button"
                  id="nav-dropdown-resources"
                  onClick={() => setActiveDropdown(activeDropdown === 'resources' ? null : 'resources')}
                  onMouseEnter={() => setActiveDropdown('resources')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                    activeDropdown === 'resources'
                      ? 'text-indigo-600 font-bold bg-indigo-50/80'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/80'
                  }`}
                  aria-expanded={activeDropdown === 'resources'}
                >
                  <span>Resources</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
                </button>

                {/* Resources Dropdown */}
                {activeDropdown === 'resources' && (
                  <div 
                    onMouseLeave={() => setActiveDropdown(null)}
                    className="absolute left-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-3 pb-2 border-b border-slate-100">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                        Tools & Business Knowledge
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-3">
                      {resourceItems.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={idx}
                            onClick={item.action}
                            className="p-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group flex items-start gap-3"
                          >
                            <div className={`w-8 h-8 rounded-xl ${item.color} flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {item.title}
                              </p>
                              <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 5. PRICING LINK */}
              <button
                type="button"
                id="nav-link-pricing"
                onClick={() => scrollToSection('#pricing')}
                className="px-3 py-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100/80 transition-all duration-200 cursor-pointer"
              >
                Pricing
              </button>
            </nav>
          </div>

          {/* RIGHT SIDE: Login | Book Free Demo | Sign Up Free */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-3">
            
            {/* Login */}
            <Link
              to="/login"
              id="navbar-login-button"
              className="text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-100/80 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer"
            >
              Login
            </Link>

            {/* Book Free Demo Button */}
            <button
              type="button"
              id="navbar-book-demo-button"
              onClick={() => setIsDemoModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200/90 text-slate-800 rounded-xl text-xs font-bold border border-slate-200/80 transition-all duration-200 hover:scale-[1.02] cursor-pointer shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>Book Free Demo</span>
            </button>

            {/* Sign Up Free */}
            <Link
              to="/register"
              id="navbar-signup-free-button"
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            >
              <span>Sign Up Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* If Authenticated, also provide quick access to Workspace */}
            {isAuthenticated && (
              <Link
                to="/dashboard"
                id="navbar-dashboard-pill"
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Go to Dashboard</span>
              </Link>
            )}
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDemoModalOpen(true)}
              className="px-2.5 py-1.5 bg-slate-100 text-slate-800 rounded-xl text-[11px] font-bold border border-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <Calendar className="w-3 h-3 text-indigo-600" />
              <span>Demo</span>
            </button>

            <button
              type="button"
              id="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE NAVIGATION DRAWER */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200 text-left">
            
            {/* Mobile Navigation List */}
            <div className="space-y-1">
              
              {/* 1. Mobile Home */}
              <NavLink
                to="/"
                end
                id="mobile-nav-home"
                onClick={handleHomeClick}
                className={({ isActive }) => {
                  const active = isActive && isHomeActive;
                  return `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'bg-indigo-50 text-indigo-600 font-bold border border-indigo-200/60'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`;
                }}
              >
                <Home className="w-4 h-4 text-indigo-600" />
                <span>Home</span>
              </NavLink>

              {/* 2. Mobile Features */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileExpandedSection(mobileExpandedSection === 'features' ? null : 'features')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-slate-500" />
                    <span>Features</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedSection === 'features' ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
                </button>
                {mobileExpandedSection === 'features' && (
                  <div className="pl-9 pr-3 py-1 space-y-1.5 bg-slate-50/80 rounded-xl my-1 border border-slate-100">
                    {featureItems.map((f, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={f.action}
                        className="w-full text-left py-1.5 text-xs text-slate-600 hover:text-indigo-600 font-medium"
                      >
                        {f.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Mobile Solutions */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileExpandedSection(mobileExpandedSection === 'solutions' ? null : 'solutions')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4 text-slate-500" />
                    <span>Solutions</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedSection === 'solutions' ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
                </button>
                {mobileExpandedSection === 'solutions' && (
                  <div className="pl-9 pr-3 py-1 space-y-1.5 bg-slate-50/80 rounded-xl my-1 border border-slate-100">
                    {solutionItems.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={s.action}
                        className="w-full text-left py-1.5 text-xs text-slate-600 hover:text-indigo-600 font-medium"
                      >
                        {s.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Mobile Resources */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileExpandedSection(mobileExpandedSection === 'resources' ? null : 'resources')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-slate-500" />
                    <span>Resources</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedSection === 'resources' ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
                </button>
                {mobileExpandedSection === 'resources' && (
                  <div className="pl-9 pr-3 py-1 space-y-1.5 bg-slate-50/80 rounded-xl my-1 border border-slate-100">
                    {resourceItems.map((r, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={r.action}
                        className="w-full text-left py-1.5 text-xs text-slate-600 hover:text-indigo-600 font-medium"
                      >
                        {r.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. Mobile Pricing */}
              <button
                type="button"
                id="mobile-nav-pricing"
                onClick={() => scrollToSection('#pricing')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors text-left"
              >
                <Percent className="w-4 h-4 text-slate-500" />
                <span>Pricing</span>
              </button>
            </div>

            {/* Mobile Actions: Login | Book Free Demo | Sign Up Free */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsDemoModalOpen(true);
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-slate-200/80"
              >
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Book Free Demo</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  id="mobile-nav-login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-center text-xs font-bold rounded-xl"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  id="mobile-nav-signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-center text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20"
                >
                  Sign Up Free
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Book Free Demo Modal */}
      <BookDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </>
  );
};
