import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBiz } from '../context/BizContext';
import { BusinessType, OnboardingData } from '../types';
import { Logo } from '../components/auth/Logo';
import { AuthButton } from '../components/auth/AuthButton';
import { TextInput } from '../components/auth/TextInput';
import { 
  Store, 
  Package, 
  Utensils, 
  UserCheck, 
  Wrench, 
  Factory, 
  Globe, 
  Sparkles,
  Check,
  Building2,
  Calendar,
  DollarSign,
  FileCheck
} from 'lucide-react';

const businessTypeOptions: { id: BusinessType; label: string; icon: any; desc: string }[] = [
  { id: 'Retail Shop', label: 'Retail Shop', icon: Store, desc: 'Storefront, supermarket, or boutique' },
  { id: 'Wholesale Business', label: 'Wholesale Business', icon: Package, desc: 'B2B distribution and bulk supply' },
  { id: 'Restaurant', label: 'Restaurant / Cafe', icon: Utensils, desc: 'Food services, bakery, or dining' },
  { id: 'Freelancer', label: 'Freelancer / Creator', icon: UserCheck, desc: 'Solo professional or consultant' },
  { id: 'Service Business', label: 'Service Agency', icon: Wrench, desc: 'Repair, marketing, legal, or IT services' },
  { id: 'Manufacturing', label: 'Manufacturing', icon: Factory, desc: 'Production units and industrial works' },
  { id: 'Online Business', label: 'E-commerce & SaaS', icon: Globe, desc: 'Digital storefronts and tech tools' },
  { id: 'Other', label: 'Other Enterprise', icon: Building2, desc: 'Custom commercial ventures' },
];

const currencies = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee (₹ INR)' },
  { code: 'USD', symbol: '$', label: 'US Dollar ($ USD)' },
  { code: 'EUR', symbol: '€', label: 'Euro (€ EUR)' },
  { code: 'GBP', symbol: '£', label: 'British Pound (£ GBP)' },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham (AED)' },
  { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar (S$)' },
];

const financialYearMonths = [
  { value: 'April', label: 'April (Standard for India & UK)' },
  { value: 'January', label: 'January (Calendar Year - US / EU)' },
  { value: 'July', label: 'July (Standard for Australia)' },
  { value: 'October', label: 'October (Q4 Cycle)' },
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, completeOnboarding } = useAuth();
  const { updateBusinessProfile, showToast } = useBiz();

  const [businessType, setBusinessType] = useState<BusinessType>('Retail Shop');
  const [businessCategory, setBusinessCategory] = useState('Electronics & Retail');
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [financialYearStart, setFinancialYearStart] = useState('April');
  const [hasGst, setHasGst] = useState(true);
  const [gstNumber, setGstNumber] = useState('29AABCS1429B1Z8');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!businessCategory.trim()) {
      newErrors.businessCategory = 'Please specify your business category.';
    }

    if (hasGst && !gstNumber.trim()) {
      newErrors.gstNumber = 'Please enter your GST identification number or select No.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const data: OnboardingData = {
        businessType,
        businessCategory: businessCategory.trim(),
        currency: selectedCurrency.code,
        currencySymbol: selectedCurrency.symbol,
        financialYearStart,
        hasGst,
        gstNumber: hasGst ? gstNumber.trim() : '',
      };

      await completeOnboarding(data);

      updateBusinessProfile({
        businessType,
        businessCategory: businessCategory.trim(),
        currency: selectedCurrency.code,
        currencySymbol: selectedCurrency.symbol,
        gstin: hasGst ? gstNumber.trim() : '',
        financialYear: `${financialYearStart} 2026-2027`,
      });

      showToast(
        'Setup Completed',
        `Welcome to BizTrack PRO, ${currentUser?.fullName || 'Partner'}! Your business ledger is ready.`,
        'success'
      );

      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center relative overflow-hidden font-sans">
      {/* Glow */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl w-full mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden text-left">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white border-b border-indigo-900/40">
          <div className="flex items-center justify-between">
            <Logo variant="light" size="sm" clickable={false} />
            <span className="text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full uppercase tracking-wider">
              Step 2 of 2
            </span>
          </div>

          <div className="mt-6 space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Let's Set Up Your Business
            </h1>
            <p className="text-sm text-indigo-200/80">
              Customize BizTrack for {currentUser?.businessName || 'your business'} to optimize cash flow calculations and invoices.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFinish} className="p-6 sm:p-8 space-y-8">
          {/* Section 1: Business Type */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 tracking-wide uppercase">
                Select Your Business Type <span className="text-rose-500 font-bold">*</span>
              </label>
              <span className="text-xs text-slate-500 font-medium">Click to select</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {businessTypeOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = businessType === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setBusinessType(opt.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 text-left flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${isSelected ? 'text-indigo-950' : 'text-slate-900'}`}>
                        {opt.label}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{opt.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Business Category & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <TextInput
              id="onboarding-category"
              label="Business Category / Industry"
              placeholder="e.g., Electronics, Fashion, IT Services, Cafe"
              icon={Sparkles}
              value={businessCategory}
              onChange={(e) => {
                setBusinessCategory(e.target.value);
                if (errors.businessCategory) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.businessCategory;
                    return next;
                  });
                }
              }}
              error={errors.businessCategory}
              helperText="Helps pre-configure your expense and revenue categories"
              required
            />

            <div className="space-y-1.5 text-left">
              <label htmlFor="onboarding-currency" className="block text-xs font-bold text-slate-800 tracking-wide uppercase">
                Base Currency <span className="text-rose-500 font-bold">*</span>
              </label>
              <div className="relative">
                <select
                  id="onboarding-currency"
                  value={selectedCurrency.code}
                  onChange={(e) => {
                    const found = currencies.find((c) => c.code === e.target.value);
                    if (found) setSelectedCurrency(found);
                  }}
                  className="w-full py-2.5 sm:py-3 pl-3.5 pr-8 text-sm font-medium text-slate-900 bg-slate-50/80 border border-slate-200/90 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/25 cursor-pointer"
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[11px] text-slate-500">
                All ledger sums and reports will use this primary currency
              </p>
            </div>
          </div>

          {/* Section 3: Financial Year & GST */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
            <div className="space-y-1.5 text-left">
              <label htmlFor="onboarding-fy" className="block text-xs font-bold text-slate-800 tracking-wide uppercase">
                Financial Year Cycle Start
              </label>
              <select
                id="onboarding-fy"
                value={financialYearStart}
                onChange={(e) => setFinancialYearStart(e.target.value)}
                className="w-full py-2.5 sm:py-3 pl-3.5 pr-8 text-sm font-medium text-slate-900 bg-slate-50/80 border border-slate-200/90 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/25 cursor-pointer"
              >
                {financialYearMonths.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500">
                Used for annual tax summaries and profit growth comparisons
              </p>
            </div>

            <div className="space-y-2 text-left">
              <label className="block text-xs font-bold text-slate-800 tracking-wide uppercase">
                GST / Tax Registered?
              </label>
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gst-radio"
                    checked={hasGst}
                    onChange={() => setHasGst(true)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-700">Yes, Registered</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gst-radio"
                    checked={!hasGst}
                    onChange={() => setHasGst(false)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-700">No / Unregistered</span>
                </label>
              </div>

              {hasGst && (
                <div className="pt-2">
                  <TextInput
                    id="onboarding-gstin"
                    label="GST Identification Number (GSTIN)"
                    placeholder="e.g. 29AABCS1429B1Z8"
                    icon={FileCheck}
                    value={gstNumber}
                    onChange={(e) => {
                      setGstNumber(e.target.value.toUpperCase());
                      if (errors.gstNumber) {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.gstNumber;
                          return next;
                        });
                      }
                    }}
                    error={errors.gstNumber}
                    helperText="Printed on your official business invoices and tax receipts"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100">
            <AuthButton
              id="onboarding-complete-button"
              type="submit"
              isLoading={isSubmitting}
              loadingText="Saving business settings..."
            >
              Complete Setup & Open Dashboard
            </AuthButton>
          </div>
        </form>
      </div>
    </div>
  );
};
