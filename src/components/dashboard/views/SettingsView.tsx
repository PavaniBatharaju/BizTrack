import React, { useState } from 'react';
import { useBiz } from '../../../context/BizContext';
import { 
  Settings, 
  Store, 
  Save, 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle2, 
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  FileCheck
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { businessProfile, updateBusinessProfile, resetToSampleData, showToast } = useBiz();

  const [form, setForm] = useState({
    businessName: businessProfile.businessName,
    name: businessProfile.name,
    phone: businessProfile.phone,
    email: businessProfile.email,
    address: businessProfile.address,
    city: businessProfile.city,
    state: businessProfile.state,
    pincode: businessProfile.pincode,
    gstin: businessProfile.gstin,
    financialYear: businessProfile.financialYear,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessProfile(form);
    showToast('Settings Saved', 'Business profile updated successfully', 'success');
  };

  const handleReset = () => {
    if (window.confirm('Reset all transactions, invoices, customers, and data back to default demo state?')) {
      resetToSampleData();
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Settings className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Business Profile & Settings</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure your registered business details, GSTIN, invoice headers, and system preferences.
          </p>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Commercial Business Details
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">These will appear on your generated GST invoices and statements.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Business / Store Name
            </label>
            <div className="relative">
              <Store className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-semibold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Proprietor / Owner Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-semibold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Business Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Registered Address
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              City
            </label>
            <input
              type="text"
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              State & PIN Code
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                required
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              GSTIN / Tax ID
            </label>
            <div className="relative">
              <FileCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={form.gstin}
                onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs font-bold uppercase focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Active Financial Year
            </label>
            <input
              type="text"
              required
              value={form.financialYear}
              onChange={(e) => setForm({ ...form, financialYear: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-semibold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            <Save className="w-4 h-4" /> Save Profile Details
          </button>
        </div>
      </form>

      {/* Danger Zone: Reset Data */}
      <div className="bg-rose-50/60 rounded-3xl border border-rose-200 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <h3 className="text-sm font-bold text-rose-950">Data Reset & Testing</h3>
        </div>
        <p className="text-xs text-rose-800 leading-relaxed">
          Need to test the app from scratch? You can easily reset all transactions, invoices, customers, and supplier balances back to the initial demo state.
        </p>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset to Default Sample Data
        </button>
      </div>
    </div>
  );
};
