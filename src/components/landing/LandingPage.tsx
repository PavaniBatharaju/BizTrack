import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  FileText, 
  Users, 
  Truck, 
  Calculator, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ChevronDown, 
  Star, 
  Send, 
  PieChart as PieIcon, 
  Play, 
  Check, 
  Store, 
  Building2, 
  Sparkle,
  Zap,
  Globe,
  Award,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { useBiz } from '../../context/BizContext';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/formatters';
import { TermsModal } from '../auth/TermsModal';
import { Navbar } from './Navbar';

interface LandingPageProps {
  onLaunchApp?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { metrics, businessProfile } = useBiz();
  const { isAuthenticated } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | null>(null);

  useEffect(() => {
    if (location.pathname === '/pricing' || location.hash === '#pricing') {
      const el = document.getElementById('pricing');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (location.pathname === '/features' || location.hash === '#features') {
      const el = document.getElementById('features');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (location.pathname === '/solutions' || location.hash === '#how-it-works') {
      const el = document.getElementById('how-it-works');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (location.pathname === '/resources' || location.hash === '#faq') {
      const el = document.getElementById('faq');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (location.pathname === '/' && !location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, location.hash]);

  const handleLaunch = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const faqs = [
    {
      q: 'Is BizTrack compliant with Indian GST laws and invoices?',
      a: 'Yes, BizTrack supports full GST tax invoicing (CGST, SGST, IGST), customizable GSTIN headers, item-wise HSN codes, and instant print/PDF delivery ready for your CA/tax accountant.'
    },
    {
      q: 'How does BizTrack help recover delayed customer payments?',
      a: 'BizTrack automatically categorizes receivables into Pending and Overdue buckets. With one click, you can dispatch personalized payment reminders via WhatsApp, SMS, or Email containing exact pending balance and UPI bank details.'
    },
    {
      q: 'Is my financial data secure and private?',
      a: 'Absolutely. BizTrack uses bank-grade 256-bit SSL encryption. Your data is stored securely and never shared with any third party.'
    },
    {
      q: 'Can I use BizTrack on mobile phones and tablets?',
      a: 'Yes! BizTrack is engineered with modern responsive design. It works seamlessly across smartphones, tablets, laptops, and desktop computers without installing bulky software.'
    },
    {
      q: 'Can I export my reports to Excel or PDF for accounting?',
      a: 'Yes. You can export complete Profit & Loss statements, Cash Flow summaries, Customer ledgers, and Expense reports in Excel (CSV) and print-ready PDF formats instantly.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. Top Announcement Ribbon */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-700 to-purple-800 text-white text-[11px] sm:text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-2">
        <span className="bg-indigo-500/40 text-indigo-200 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
          NEW RELEASE
        </span>
        <span>⚡ Experience the next generation of Smart Business Finance Tracking in India.</span>
        <Link 
          to="/register"
          className="underline font-bold hover:text-indigo-200 transition-colors ml-1"
        >
          Create Free Account →
        </Link>
      </div>

      {/* 2. Sticky Header Navbar with Home Button & Mega Menus */}
      <Navbar />

      {/* 3. Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Smart Business Finance Tracking Made Simple</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Take Full Control of Your <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600">
              Business Profit & Cash Flow
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Track sales, expenses, net profits, customer dues, and supplier payables in one intuitive workspace built specifically for small & growing businesses.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              id="hero-start-trial-button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black rounded-2xl shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-all"
            >
              <span>Start Free Trial — No Card Needed</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={isAuthenticated ? '/dashboard' : '/login'}
              id="hero-explore-demo-button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all"
            >
              <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
              <span>Explore Live Dashboard Demo</span>
            </Link>
          </div>

          {/* Trust points */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> GST Invoicing Ready
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Bank-Grade Security
            </span>
          </div>

          {/* 4. Hero Dashboard Mockup / Interactive Preview */}
          <div id="dashboard-preview" className="mt-14 relative max-w-5xl mx-auto">
            <div className="p-3 bg-slate-900/90 rounded-3xl shadow-2xl border border-slate-800 backdrop-blur-xl">
              {/* Fake Window Controls */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[11px] text-slate-400 font-mono ml-2">app.biztrack.in/dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full">
                    ● Live Telemetry
                  </span>
                </div>
              </div>

              {/* Inside Window Dashboard Preview Card */}
              <div className="p-5 sm:p-7 bg-slate-950 rounded-2xl text-left text-white space-y-6">
                {/* Greeting banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
                  <div>
                    <h3 className="text-xl font-bold text-white">Good Morning, Rahul Sharma 👋</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Sharma Electronics & Retail • Bengaluru</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleLaunch}
                      className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs shadow-xs cursor-pointer"
                    >
                      + Add Income
                    </button>
                    <button 
                      onClick={handleLaunch}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
                    >
                      + New Invoice
                    </button>
                  </div>
                </div>

                {/* 4 Mini Cards in Mockup */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Total Revenue</span>
                    <p className="text-xl font-black text-white mt-1">{formatINR(245000)}</p>
                    <span className="text-[10px] font-bold text-emerald-400">+12.5% vs last month</span>
                  </div>

                  <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Total Expenses</span>
                    <p className="text-xl font-black text-white mt-1">{formatINR(132500)}</p>
                    <span className="text-[10px] font-bold text-emerald-400">-4.2% lower costs</span>
                  </div>

                  <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Net Profit</span>
                    <p className="text-xl font-black text-emerald-400 mt-1">{formatINR(112500)}</p>
                    <span className="text-[10px] font-bold text-emerald-300">46% Net Margin</span>
                  </div>

                  <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Cash Balance</span>
                    <p className="text-xl font-black text-white mt-1">{formatINR(345800)}</p>
                    <span className="text-[10px] text-slate-400">5.8 Months Runway</span>
                  </div>
                </div>

                {/* Insight Bar in preview */}
                <div className="p-3 bg-indigo-950/60 rounded-xl border border-indigo-900/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="text-slate-200">
                      <strong className="text-white">Smart Telemetry:</strong> Net Profit increased by 18% due to higher retail accessory margins.
                    </span>
                  </div>
                  <button
                    onClick={handleLaunch}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 whitespace-nowrap ml-2 cursor-pointer"
                  >
                    Open Live App →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trust & Social Proof Numbers */}
      <section className="py-14 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-indigo-400">50,000+</p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Indian Businesses</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-emerald-400">₹1,200 Cr+</p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Transactions Tracked</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-amber-400">4.9 / 5.0</p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">User Satisfaction Rating</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-cyan-400">99.9%</p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Uptime & Reliability</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Core Features Showcase */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">Enterprise Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight mt-2">
              Everything Your Small Business Needs to Flourish
            </h2>
            <p className="text-sm text-slate-600 mt-3">
              Eliminate paper ledgers, messy spreadsheets, and guesswork with purpose-built financial tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Income Tracking */}
            <div className="p-6 bg-slate-50/70 hover:bg-white rounded-3xl border border-slate-200/80 hover:border-indigo-200 hover:shadow-lg transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Income & Sales Tracking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Record daily cash, UPI, card, and credit sales with custom category tagging and instant receipt generation.
              </p>
            </div>

            {/* Feature 2: Expense & Receipt Management */}
            <div className="p-6 bg-slate-50/70 hover:bg-white rounded-3xl border border-slate-200/80 hover:border-indigo-200 hover:shadow-lg transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <TrendingDown className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Expense & Bill Management</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Log inventory restocks, employee salaries, store rent, and utility bills with digital receipt attachments.
              </p>
            </div>

            {/* Feature 3: Cash Flow Telemetry */}
            <div className="p-6 bg-slate-50/70 hover:bg-white rounded-3xl border border-slate-200/80 hover:border-indigo-200 hover:shadow-lg transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Cash Flow & Liquidity Runway</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Always know your real-time bank balance, monthly burn rate, and projected operating runway.
              </p>
            </div>

            {/* Feature 4: Customer Reminders */}
            <div className="p-6 bg-slate-50/70 hover:bg-white rounded-3xl border border-slate-200/80 hover:border-indigo-200 hover:shadow-lg transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">WhatsApp Payment Reminders</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Collect delayed receivables 3x faster with 1-click WhatsApp and SMS reminders with UPI payment links.
              </p>
            </div>

            {/* Feature 5: Profit Calculator */}
            <div className="p-6 bg-slate-50/70 hover:bg-white rounded-3xl border border-slate-200/80 hover:border-indigo-200 hover:shadow-lg transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Live Profit Calculator</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Simulate gross profit, operating margin, and final take-home earnings on the fly with live slider controls.
              </p>
            </div>

            {/* Feature 6: Predictive Forecast */}
            <div className="p-6 bg-slate-50/70 hover:bg-white rounded-3xl border border-slate-200/80 hover:border-indigo-200 hover:shadow-lg transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Smart Financial Forecasts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Project next month’s expected revenue, expenditure, and net profits based on historical growth trajectory.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">Simplicity First</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight mt-2">
              How BizTrack Transforms Your Business in 4 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Log Daily Transactions',
                desc: 'Quickly record sales, customer payments, supplier purchases, and store bills in seconds.',
              },
              {
                step: '02',
                title: 'Instant Profit Math',
                desc: 'BizTrack automatically calculates your Gross Profit, Net Margin, and Cash Flow in real-time.',
              },
              {
                step: '03',
                title: 'Recover Receivables',
                desc: 'Send WhatsApp payment reminders to overdue customers with exact balance calculations.',
              },
              {
                step: '04',
                title: 'Forecast & Expand',
                desc: 'Use AI projections and monthly category budgets to scale your operations safely.',
              },
            ].map((st) => (
              <div key={st.step} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 relative">
                <span className="text-3xl font-black text-indigo-600 font-mono block">
                  {st.step}
                </span>
                <h3 className="text-base font-bold text-slate-900">{st.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">Transparent Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight mt-2">
              Affordable Plans for Every Business Stage
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Start with our free starter plan and upgrade as your transaction volume multiplies.
            </p>

            {/* Toggle */}
            <div className="mt-6 inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  billingCycle === 'monthly' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'annual' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                <span>Annual Billing</span>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded-full">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Micro Business</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">Starter</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">₹0</span>
                  <span className="text-xs text-slate-500 font-semibold">/ forever free</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Essential bookkeeping for solo shopkeepers.</p>

                <div className="space-y-3 mt-6 pt-6 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Up to 50 transactions / month</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Core Income & Expense tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Customer ledger tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Basic Profit & Loss summary</span>
                  </div>
                </div>
              </div>

              <Link
                to="/register"
                className="w-full text-center py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer block"
              >
                Get Started Free
              </Link>
            </div>

            {/* Growth Plan - Featured */}
            <div className="bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950 text-white p-8 rounded-3xl border-2 border-indigo-500 shadow-xl space-y-6 flex flex-col justify-between relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-3.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
                MOST POPULAR
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Growing SME</span>
                <h3 className="text-2xl font-black text-white mt-1">Growth Pro</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">{billingCycle === 'annual' ? '₹399' : '₹499'}</span>
                  <span className="text-xs text-indigo-300 font-semibold">/ month</span>
                </div>
                <p className="text-xs text-indigo-200 mt-2">Unlimited power for scaling stores & service firms.</p>

                <div className="space-y-3 mt-6 pt-6 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Unlimited</strong> transactions & bills</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>GST Invoices with Print & PDF</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>1-Click WhatsApp Payment Reminders</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Predictive Business Forecasts</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Excel/CSV export & audit statements</span>
                  </div>
                </div>
              </div>

              <Link
                to="/register"
                className="w-full text-center py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl shadow-lg shadow-indigo-600/40 transition-all hover:scale-[1.02] cursor-pointer block"
              >
                Start 14-Day Free Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Multi-Location</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">Business Scale</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">{billingCycle === 'annual' ? '₹799' : '₹999'}</span>
                  <span className="text-xs text-slate-500 font-semibold">/ month</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Comprehensive suite with multi-store support.</p>

                <div className="space-y-3 mt-6 pt-6 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Everything in Growth Pro</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Multi-store branch accounting</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Custom CA Audit Export Packages</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Dedicated account support manager</span>
                  </div>
                </div>
              </div>

              <Link
                to="/register"
                className="w-full text-center py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer block"
              >
                Choose Enterprise
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ Section */}
      <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">Got Questions?</span>
            <h2 className="text-3xl font-black text-slate-950 tracking-tight mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:bg-slate-50/80 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-indigo-600' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Call to Action Banner */}
      <section className="py-16 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Take Control of Your Business Finances?
          </h2>
          <p className="text-sm text-indigo-200 max-w-xl mx-auto">
            Join over 50,000 smart Indian business owners today. Set up in less than 60 seconds with no credit card required.
          </p>
          <div>
            <Link
              to="/register"
              id="cta-launch-workspace-button"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-sm font-black rounded-2xl shadow-xl transition-all hover:scale-105"
            >
              <span>Launch BizTrack Workspace Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-slate-900">
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-white font-extrabold text-base">BizTrack</span>
              </div>
              <p className="text-slate-500 text-xs max-w-sm">
                Smart Business Finance Tracking Made Simple. Built proudly for small businesses, retailers, agencies, and distributors.
              </p>
              <p className="text-[11px] text-slate-600">
                © {new Date().getFullYear()} BizTrack PRO. All rights reserved.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 uppercase text-[10px] tracking-wider mb-3">Product</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#dashboard-preview" className="hover:text-white">Dashboard</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 uppercase text-[10px] tracking-wider mb-3">Solutions</h4>
              <ul className="space-y-2 text-xs">
                <li><span>Retail & Stores</span></li>
                <li><span>Wholesale & Trading</span></li>
                <li><span>Service Agencies</span></li>
                <li><span>Manufacturing</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 uppercase text-[10px] tracking-wider mb-3">Legal & Security</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => setLegalModalType('privacy')}
                    className="hover:text-white cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setLegalModalType('terms')}
                    className="hover:text-white cursor-pointer"
                  >
                    Terms of Service
                  </button>
                </li>
                <li><span>GST Compliance</span></li>
                <li><span>Security Safeguards</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 text-center text-[11px] text-slate-600">
            BizTrack PRO is an independent enterprise SaaS platform designed for comprehensive profit, cash flow, and invoicing management.
          </div>
        </div>
      </footer>

      {legalModalType && (
        <TermsModal
          isOpen={true}
          onClose={() => setLegalModalType(null)}
          type={legalModalType}
        />
      )}
    </div>
  );
};
