import React, { useState } from 'react';
import { useBiz } from '../../../context/BizContext';
import { Customer } from '../../../types';
import { 
  Users, 
  Plus, 
  Search, 
  Send, 
  Phone, 
  Mail, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  Download
} from 'lucide-react';
import { formatINR, formatDate, downloadCSV } from '../../../utils/formatters';
import { ReminderModal } from '../modals/ReminderModal';
import { Modal } from '../../ui/Modal';

export const CustomersView: React.FC = () => {
  const { customers, addCustomer, showToast } = useBiz();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCustomerForReminder, setSelectedCustomerForReminder] = useState<Customer | null>(null);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);

  // New Customer Form state
  const [newName, setNewName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newGstin, setNewGstin] = useState('');

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(search.toLowerCase())) ||
      c.phone.includes(search);

    const matchesStatus = 
      selectedStatus === 'All' || 
      (selectedStatus === 'overdue' && c.overdueAmount > 0) ||
      (selectedStatus === 'pending' && c.pendingAmount > 0 && c.overdueAmount === 0) ||
      (selectedStatus === 'cleared' && c.pendingAmount === 0);

    return matchesSearch && matchesStatus;
  });

  const totalSalesAll = customers.reduce((sum, c) => sum + c.totalSales, 0);
  const totalPendingAll = customers.reduce((sum, c) => sum + c.pendingAmount, 0);
  const totalOverdueAll = customers.reduce((sum, c) => sum + c.overdueAmount, 0);
  const pendingCount = customers.filter(c => c.pendingAmount > 0).length;

  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    addCustomer({
      name: newName.trim(),
      company: newCompany.trim() || undefined,
      phone: newPhone.trim(),
      email: newEmail.trim() || undefined,
      address: newAddress.trim() || undefined,
      gstin: newGstin.trim() || undefined,
    });

    setNewName('');
    setNewCompany('');
    setNewPhone('');
    setNewEmail('');
    setNewAddress('');
    setNewGstin('');
    setIsAddCustomerModalOpen(false);
  };

  const handleExportCSV = () => {
    const rows = [
      ['Customer Name', 'Company', 'Phone', 'Email', 'GSTIN', 'Total Sales (INR)', 'Paid (INR)', 'Pending (INR)', 'Overdue (INR)', 'Last Active'],
      ...customers.map(c => [
        c.name,
        c.company || '-',
        c.phone,
        c.email || '-',
        c.gstin || '-',
        c.totalSales,
        c.paidAmount,
        c.pendingAmount,
        c.overdueAmount,
        c.lastTransactionDate,
      ])
    ];
    downloadCSV(`BizTrack_Customer_Receivables_${new Date().toISOString().split('T')[0]}.csv`, rows);
    showToast('Export Complete', 'Customer ledger exported', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Customer Accounts & Receivables</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track client payment histories, pending dues, overdue amounts, and dispatch automated payment reminders.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export Ledger
          </button>
          <button
            onClick={() => setIsAddCustomerModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            <Plus className="w-4 h-4" /> + Add Customer
          </button>
        </div>
      </div>

      {/* Summary Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pending Summary Card */}
        <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50/80 rounded-2xl border border-amber-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Total Pending Dues</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-amber-900 mt-2">
            {formatINR(totalPendingAll)}
          </h3>
          <p className="text-xs font-semibold text-amber-700 mt-1">
            {formatINR(totalPendingAll)} pending from {pendingCount} customer accounts
          </p>
        </div>

        {/* Overdue */}
        <div className="p-5 bg-gradient-to-br from-rose-50 to-red-50/80 rounded-2xl border border-rose-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800">Overdue Payments</span>
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-rose-900 mt-2">
            {formatINR(totalOverdueAll)}
          </h3>
          <p className="text-xs font-semibold text-rose-700 mt-1">
            Action required: Send immediate reminders
          </p>
        </div>

        {/* Total Billed */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Sales Volume</span>
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {formatINR(totalSalesAll)}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Across {customers.length} registered business clients
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by customer name, company, or mobile number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {['All', 'overdue', 'pending', 'cleared'].map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize ${
                selectedStatus === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4 text-right">Total Sales</th>
                <th className="py-3.5 px-4 text-right">Paid</th>
                <th className="py-3.5 px-4 text-right">Pending</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((cust) => {
                const isOverdue = cust.overdueAmount > 0;
                const isPending = cust.pendingAmount > 0;

                return (
                  <tr key={cust.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-100 to-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                          {cust.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{cust.name}</p>
                          {cust.company && (
                            <p className="text-[11px] text-slate-500 font-medium">{cust.company}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                      <p className="font-medium text-slate-800">{cust.phone}</p>
                      {cust.email && <p className="text-[11px] text-slate-400">{cust.email}</p>}
                    </td>

                    <td className="py-4 px-4 text-right font-bold text-slate-900 text-sm whitespace-nowrap">
                      {formatINR(cust.totalSales)}
                    </td>

                    <td className="py-4 px-4 text-right font-bold text-emerald-600 text-sm whitespace-nowrap">
                      {formatINR(cust.paidAmount)}
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      {isPending ? (
                        <div>
                          <span className={`font-black text-sm ${isOverdue ? 'text-rose-600' : 'text-amber-600'}`}>
                            {formatINR(cust.pendingAmount)}
                          </span>
                          {isOverdue && (
                            <p className="text-[10px] text-rose-500 font-semibold uppercase">Overdue</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 font-medium">₹0 (Cleared)</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isOverdue
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : isPending
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {isOverdue ? 'Overdue' : isPending ? 'Pending' : 'Paid in Full'}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      {isPending ? (
                        <button
                          onClick={() => setSelectedCustomerForReminder(cust)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                        >
                          <Send className="w-3 h-3" /> Send Reminder
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Settled
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Reminder Modal */}
      <ReminderModal
        customer={selectedCustomerForReminder}
        isOpen={Boolean(selectedCustomerForReminder)}
        onClose={() => setSelectedCustomerForReminder(null)}
      />

      {/* Add Customer Modal */}
      <Modal
        isOpen={isAddCustomerModalOpen}
        onClose={() => setIsAddCustomerModalOpen(false)}
        title="Add New Customer"
        subtitle="Register a new commercial or retail customer account."
        maxWidth="md"
      >
        <form onSubmit={handleAddCustomerSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Customer Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Mehta"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Company / Store Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Mehta Enterprises"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="client@company.in"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Billing Address
            </label>
            <input
              type="text"
              placeholder="e.g. MG Road, Bengaluru"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Customer GSTIN (Optional)
            </label>
            <input
              type="text"
              placeholder="29ABCDE1234F1Z5"
              value={newGstin}
              onChange={(e) => setNewGstin(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddCustomerModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Save Customer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
