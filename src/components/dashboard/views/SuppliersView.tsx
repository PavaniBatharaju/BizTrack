import React, { useState } from 'react';
import { useBiz } from '../../../context/BizContext';
import { Supplier } from '../../../types';
import { 
  Truck, 
  Plus, 
  Search, 
  IndianRupee, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Download 
} from 'lucide-react';
import { formatINR, formatDate, downloadCSV } from '../../../utils/formatters';
import { Modal } from '../../ui/Modal';

export const SuppliersView: React.FC = () => {
  const { suppliers, addSupplier, recordSupplierPayment, showToast } = useBiz();

  const [search, setSearch] = useState('');
  const [selectedSupplierForPayment, setSelectedSupplierForPayment] = useState<Supplier | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);

  // New Supplier Form
  const [newName, setNewName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newGstin, setNewGstin] = useState('');

  const totalPayables = suppliers.reduce((sum, s) => sum + s.pendingAmount, 0);
  const totalPurchases = suppliers.reduce((sum, s) => sum + s.totalPurchases, 0);
  const totalPaid = suppliers.reduce((sum, s) => sum + s.paidAmount, 0);

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.company.toLowerCase().includes(search.toLowerCase()) ||
    s.phone.includes(search)
  );

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierForPayment) return;
    const amt = parseFloat(paymentAmount);
    if (isNaN(amt) || amt <= 0) return;

    recordSupplierPayment(selectedSupplierForPayment.id, amt);
    setPaymentAmount('');
    setSelectedSupplierForPayment(null);
  };

  const handleAddSupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCompany.trim() || !newPhone.trim()) return;

    addSupplier({
      name: newName.trim(),
      company: newCompany.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim() || undefined,
      address: newAddress.trim() || undefined,
      gstin: newGstin.trim() || undefined,
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    });

    setNewName('');
    setNewCompany('');
    setNewPhone('');
    setNewEmail('');
    setNewAddress('');
    setNewGstin('');
    setIsAddSupplierModalOpen(false);
  };

  const handleExportCSV = () => {
    const rows = [
      ['Supplier Name', 'Company', 'Phone', 'GSTIN', 'Total Purchases (INR)', 'Paid (INR)', 'Pending Payable (INR)', 'Due Date', 'Status'],
      ...suppliers.map(s => [
        s.name,
        s.company,
        s.phone,
        s.gstin || '-',
        s.totalPurchases,
        s.paidAmount,
        s.pendingAmount,
        s.dueDate,
        s.status,
      ])
    ];
    downloadCSV(`BizTrack_Supplier_Payables_${new Date().toISOString().split('T')[0]}.csv`, rows);
    showToast('Export Complete', 'Supplier payables list downloaded', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Truck className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Supplier & Vendor Payables</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage wholesale inventory suppliers, track outstanding payables, and record payouts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export Excel/CSV
          </button>
          <button
            onClick={() => setIsAddSupplierModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            <Plus className="w-4 h-4" /> + Add Supplier
          </button>
        </div>
      </div>

      {/* Summary Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Payables */}
        <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50/80 rounded-2xl border border-amber-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Total Payables</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-amber-900 mt-2">
            {formatINR(totalPayables)}
          </h3>
          <p className="text-xs font-semibold text-amber-700 mt-1">
            Total outstanding vendor debt across suppliers
          </p>
        </div>

        {/* Total Purchases */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Purchases</span>
            <Truck className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {formatINR(totalPurchases)}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Wholesale inventory & materials procurement
          </p>
        </div>

        {/* Total Paid */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Paid to Date</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">
            {formatINR(totalPaid)}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Settled via NEFT / RTGS & UPI
          </p>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by supplier name, company or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Supplier & Company</th>
                <th className="py-3.5 px-4">Phone / Contact</th>
                <th className="py-3.5 px-4 text-right">Purchase Amount</th>
                <th className="py-3.5 px-4 text-right">Paid</th>
                <th className="py-3.5 px-4 text-right">Pending Payable</th>
                <th className="py-3.5 px-4 text-center">Due Date</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSuppliers.map((sup) => {
                const hasPending = sup.pendingAmount > 0;
                return (
                  <tr key={sup.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs shrink-0">
                          {sup.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{sup.company}</p>
                          <p className="text-[11px] text-slate-500">{sup.name}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                      <p className="font-medium text-slate-800">{sup.phone}</p>
                      {sup.gstin && <p className="text-[10px] font-mono text-slate-400">GST: {sup.gstin}</p>}
                    </td>

                    <td className="py-4 px-4 text-right font-bold text-slate-900 text-sm whitespace-nowrap">
                      {formatINR(sup.totalPurchases)}
                    </td>

                    <td className="py-4 px-4 text-right font-bold text-emerald-600 text-sm whitespace-nowrap">
                      {formatINR(sup.paidAmount)}
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      {hasPending ? (
                        <span className="font-black text-sm text-amber-600">
                          {formatINR(sup.pendingAmount)}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">₹0 (Paid)</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-center text-slate-600 font-medium whitespace-nowrap">
                      {formatDate(sup.dueDate)}
                    </td>

                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        hasPending
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {hasPending ? 'Pending' : 'Settled'}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      {hasPending ? (
                        <button
                          onClick={() => {
                            setSelectedSupplierForPayment(sup);
                            setPaymentAmount(sup.pendingAmount.toString());
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                        >
                          <CreditCard className="w-3 h-3" /> Record Payment
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

      {/* Record Payment Modal */}
      {selectedSupplierForPayment && (
        <Modal
          isOpen={Boolean(selectedSupplierForPayment)}
          onClose={() => setSelectedSupplierForPayment(null)}
          title={`Record Payment to ${selectedSupplierForPayment.company}`}
          subtitle={`Current pending balance: ${formatINR(selectedSupplierForPayment.pendingAmount)}`}
          maxWidth="md"
        >
          <form onSubmit={handleRecordPaymentSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Payment Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  min="1"
                  max={selectedSupplierForPayment.pendingAmount}
                  step="any"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedSupplierForPayment(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Confirm Payment Payout
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Supplier Modal */}
      <Modal
        isOpen={isAddSupplierModalOpen}
        onClose={() => setIsAddSupplierModalOpen(false)}
        title="Register New Supplier"
        subtitle="Add a wholesale distributor or vendor account."
        maxWidth="md"
      >
        <form onSubmit={handleAddSupplierSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Company / Firm Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Syscon Electronics Pvt Ltd"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Contact Person Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Chandra"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
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
                placeholder="+91 94480 12345"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                GSTIN Number
              </label>
              <input
                type="text"
                placeholder="29ZZZAA1111B1Z0"
                value={newGstin}
                onChange={(e) => setNewGstin(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Supplier Address
            </label>
            <input
              type="text"
              placeholder="e.g. SP Road, Electronic Market, Bengaluru"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddSupplierModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Save Supplier
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
