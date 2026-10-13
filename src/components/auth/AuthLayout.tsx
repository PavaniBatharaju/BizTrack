import React from 'react';
import { Logo } from './Logo';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  PieChart, 
  Zap, 
  Layers,
  ArrowUpRight,
  Sparkles,
  Home,
  ArrowLeft
} from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  heading?: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  heading,
  subtitle,
}) => {
  const benefits = [
    {
      title: 'Track all business income and expenses',
      desc: 'Categorized cash inflows, outflows & invoices in seconds.',
    },
    {
      title: 'Know your profit in real time',
      desc: 'Instant gross & net margins with automatic GST deductions.',
    },
    {
      title: 'Make smarter financial decisions',
      desc: 'Forecast cash reserves, runway, and growth opportunities.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Ambient background glow & radial highlights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      {/* Top Bar with Home navigation */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between pb-4 sm:pb-6 relative z-10">
        <Link
          to="/"
          id="auth-home-link"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80 text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs"
        >
          <Home className="w-3.5 h-3.5 text-indigo-400" />
          <span>Home</span>
        </Link>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
          <span>Need help?</span>
          <Link to="/" className="text-indigo-400 hover:text-indigo-300 transition-colors font-semibold">
            Explore Features →
          </Link>
        </div>
      </div>

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl my-auto">
        {/* Left Side: Rich Branding Section (Desktop / Tablet) */}
        <div className="lg:col-span-5 relative bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 p-8 sm:p-10 lg:p-12 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-indigo-900/40">
          {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 opacity-10 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" 
          />

          {/* Top Logo */}
          <div className="relative z-10">
            <Logo variant="light" size="md" showTagline />
          </div>

          {/* Center Content */}
          <div className="relative z-10 my-8 sm:my-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Smart Business Ledger Platform</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Manage Your Business Finances Smarter.
            </h1>

            <p className="text-sm text-slate-300/90 leading-relaxed">
              Track income, expenses, profit, and business growth from one simple dashboard.
            </p>

            {/* 3 Benefits */}
            <div className="space-y-4 pt-2">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-white tracking-wide">
                      {b.title}
                    </h2>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mini Dashboard Preview Card */}
            <div className="hidden sm:block p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-bold text-slate-200">Live Business Health</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  +24.8% MoM
                </span>
              </div>
              <div className="flex items-baseline justify-between text-white">
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Net Profit Margin</p>
                  <p className="text-lg font-black tracking-tight text-white">38.4%</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-medium">Healthy Runway</p>
                  <p className="text-sm font-bold text-indigo-300">14.2 Months</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Badge */}
          <div className="relative z-10 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Bank-Grade 256-bit Encryption</span>
            </div>
            <span className="text-slate-500">ISO/SOC-2 Ready</span>
          </div>
        </div>

        {/* Right Side: Clean White Form Card */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            {children}
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-xs text-slate-500 mt-6 select-none">
        © {new Date().getFullYear()} BizTrack PRO. All rights reserved. Trusted by over 10,000+ growing enterprises.
      </div>
    </div>
  );
};
