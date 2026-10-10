import React from 'react';
import { Users, CreditCard, DollarSign, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

export default function DashboardView({ summary, loading, onRefresh, setActiveTab }) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val || 0);
  };

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    const d = new Date(isoString);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-slate-500">Real-time ledger overview, customer assets, and system activity</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition"
          >
            <RefreshCw className={`h-4 w-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Customer Count */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Customers</span>
            <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-slate-900">{summary?.customerCount ?? 0}</div>
            <p className="mt-1 text-xs text-slate-500">Active retail & corporate clients</p>
          </div>
        </div>

        {/* Account Count */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Accounts</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-slate-900">{summary?.accountCount ?? 0}</div>
            <p className="mt-1 text-xs text-slate-500">Savings & Current accounts</p>
          </div>
        </div>

        {/* Total Ledger Balance */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Vault Balance</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-slate-900">{formatCurrency(summary?.totalBalance)}</div>
            <p className="mt-1 text-xs text-slate-500">Aggregated customer deposits</p>
          </div>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Immediate Operations</h2>
          <p className="text-sm text-slate-300 mt-0.5">Quickly register new banking clients, open savings accounts, or initiate cashier deposits & withdrawals.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('customers')}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-lg text-sm shadow transition"
          >
            Add Customer
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold rounded-lg text-sm transition"
          >
            Cashier Desk
          </button>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-slate-900">Recent Transactions</h3>
            <p className="text-xs text-slate-500">Latest deposit and withdrawal entries</p>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {summary?.recentTransactions?.length || 0} entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Tx ID</th>
                <th className="px-5 py-3">Account</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Balance After</th>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {summary?.recentTransactions && summary.recentTransactions.length > 0 ? (
                summary.recentTransactions.map((tx) => {
                  const isDeposit = tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-700">#{tx.id}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-900 font-medium">
                        {tx.account?.accountNumber || '-'}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                            isDeposit
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {isDeposit ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                          {tx.type}
                        </span>
                      </td>
                      <td className={`px-5 py-3.5 font-semibold ${isDeposit ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isDeposit ? '+' : '-'}{formatCurrency(tx.amount)}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-700">
                        {formatCurrency(tx.balanceAfter)}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500">
                        {formatDate(tx.timestamp)}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-600 truncate max-w-xs">
                        {tx.description || '-'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400">
                    No transactions recorded yet. Open an account and initiate a deposit to populate records.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
