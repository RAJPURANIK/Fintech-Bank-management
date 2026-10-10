import React, { useState } from 'react';
import { UserPlus, Edit2, Trash2, Search, X, Check, AlertCircle } from 'lucide-react';
import { BankApi } from '../services/api';

export default function CustomersView({ customers, loading, onRefresh, onError, onSuccess }) {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  const openAddModal = () => {
    setIsEditing(false);
    setForm({ id: null, firstName: '', lastName: '', email: '', phone: '', address: '' });
    setModalOpen(true);
  };

  const openEditModal = (cust) => {
    setIsEditing(true);
    setForm({
      id: cust.id,
      firstName: cust.firstName,
      lastName: cust.lastName,
      email: cust.email,
      phone: cust.phone,
      address: cust.address || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditing) {
        await BankApi.updateCustomer(form.id, form);
        onSuccess(`Customer #${form.id} updated successfully!`);
      } else {
        await BankApi.createCustomer(form);
        onSuccess('New customer profile registered successfully!');
      }
      setModalOpen(false);
      onRefresh();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Operation failed';
      onError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete customer: ${name}?`)) return;
    try {
      await BankApi.deleteCustomer(id);
      onSuccess(`Customer ${name} deleted successfully`);
      onRefresh();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete customer';
      onError(msg);
    }
  };

  const filtered = customers.filter(c =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Directory</h1>
          <p className="text-sm text-slate-500">Manage client profiles, contact information, and KYC records</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium shadow-sm transition"
        >
          <UserPlus className="h-4 w-4 text-teal-400" />
          Register Customer
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="h-5 w-5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by full name, email address, or phone number..."
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
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Full Name</th>
                <th className="px-5 py-3">Email Address</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Address</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-700">#{c.id}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-900">
                      {c.firstName} {c.lastName}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{c.email}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-700">{c.phone}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-500 max-w-xs truncate">{c.address || '-'}</td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition"
                        title="Edit Customer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, `${c.firstName} ${c.lastName}`)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition"
                        title="Delete Customer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-400">
                    {loading ? 'Loading customers...' : 'No customer records found.'}
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
              <h2 className="text-base font-semibold text-slate-900">
                {isEditing ? 'Edit Customer Information' : 'Register New Customer'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                    placeholder="e.g. Elena"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                    placeholder="e.g. Vance"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  placeholder="elena.vance@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  placeholder="+1-555-0199"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Residential Address</label>
                <textarea
                  rows="2"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  placeholder="Street, City, Postal Code"
                />
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
                  {isEditing ? 'Save Changes' : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
