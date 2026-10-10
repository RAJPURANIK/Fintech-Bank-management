import React, { useState } from 'react';
import { CreditCard, PlusCircle, Search, X, CheckCircle2, ShieldCheck, Wallet } from 'lucide-react';
import { BankApi } from '../services/api';

export default function AccountsView({ accounts, customers, loading, onRefresh, onError, onSuccess }) {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customerId: '',
    accountType: 'SAVINGS',
    initialDeposit: '100.00',
  });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val || 0);
  };

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleOpenAccount = async (e) => {
    e.preventDefault();
    if (!form.customerId) {
      onError('Please select a customer for the new account');
      return;
    }
    setSubmitting(true);
    try {
      await BankApi.createAccount({
        customerId: Number(form.customerId),
        accountType: form.accountType,
        initialDeposit: parseFloat(form.initialDeposit || 0),
      });
      onSuccess('Account successfully opened and activated!');
      setModalOpen(false);
      onRefresh();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to open account';
      onError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = accounts.filter(a =>
    a.accountNumber.toLowerCase().includes(search.toLowerCase()) ||
    `${a.customer?.firstName} ${a.customer?.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    a.accountType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Deposit Accounts</h1>
          <p className="text-sm text-slate-500">Overview of client savings & current checking facilities</p>
        </div>
        <button
          onClick={() => {
            if (customers.length === 0) {
              onError('Please register at least one customer before creating an account.');
              return;
            }
            setForm({ customerId: customers[0]?.id || '', accountType: 'SAVINGS', initialDeposit: '100.00' });
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium shadow-sm transition"
        >
          <PlusCircle className="h-4 w-4 text-teal-400" />
          Open New Account
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="h-5 w-5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by account number (e.g. FTBK...), customer name, or account type..."
          className="w-full text-sm bg-transparent outline-none placeholder-slate-400"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-xs text-slate-400 hover:text-slate-600">
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Account Number</th>
                <th className="px-5 py-3">Account Holder</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Current Balance</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Created On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-3.5 font-mono text-sm font-semibold text-slate-900">
                      {acc.accountNumber}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-900">
                        {acc.customer ? `${acc.customer.firstName} ${acc.customer.lastName}` : 'Unassigned'}
                      </div>
                      <div className="text-xs text-slate-400">{acc.customer?.email}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          acc.accountType === 'SAVINGS'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : 'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}
                      >
                        {acc.accountType}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900 text-base">
                      {formatCurrency(acc.balance)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        Active
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">{formatDate(acc.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-400">
                    {loading ? 'Loading accounts...' : 'No bank accounts found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-base font-semibold text-slate-900">Open New Bank Account</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleOpenAccount} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Customer *</label>
                <select
                  required
                  value={form.customerId}
                  onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Account Type *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, accountType: 'SAVINGS' })}
                    className={`p-3 rounded-lg border text-left transition ${
                      form.accountType === 'SAVINGS'
                        ? 'border-teal-600 bg-teal-50/50 text-slate-900 ring-1 ring-teal-600'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="text-xs font-bold">SAVINGS</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">High yield, personal</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, accountType: 'CURRENT' })}
                    className={`p-3 rounded-lg border text-left transition ${
                      form.accountType === 'CURRENT'
                        ? 'border-teal-600 bg-teal-50/50 text-slate-900 ring-1 ring-teal-600'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="text-xs font-bold">CURRENT</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Transactional checking</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Opening Deposit ($) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-semibold text-sm">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={form.initialDeposit}
                    onChange={(e) => setForm({ ...form, initialDeposit: e.target.value })}
                    className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                    placeholder="100.00"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Minimum initial deposit is $0.00.</p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-md text-sm text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-medium transition flex items-center gap-1.5"
                >
                  {submitting && <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  Generate Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
