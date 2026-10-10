import React from 'react';
import { Users, CreditCard, DollarSign, ArrowUpRight, ArrowDownRight, RefreshCw, Database, ShieldCheck, Zap } from 'lucide-react';

export default function DashboardView({ summary, loading, onRefresh, setActiveTab, onOpenDbModal }) {
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
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Executive Dashboard</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
              Live Core Banking
            </span>
          </div>
          <p className="text-sm text-slate-500">Real-time ledger overview, client assets, liquidity reserves, and SQL records</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDbModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-teal-50 border border-teal-200 rounded-lg text-sm font-semibold text-teal-800 hover:bg-teal-100 shadow-sm transition"
          >
            <Database className="h-4 w-4 text-teal-600" />
            Inspect Schema
          </button>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition"
          >
            <RefreshCw className={`h-4 w-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Customer Count */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Customers</span>
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 ring-1 ring-teal-500/10">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{summary?.customerCount ?? 0}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
              <span className="font-semibold text-teal-600">KYC Verified</span> retail & corporate clients
            </div>
          </div>
        </div>

        {/* Account Count */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Accounts</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-500/10">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{summary?.accountCount ?? 0}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
              <span className="font-semibold text-indigo-600">Savings & Current</span> facility accounts
            </div>
          </div>
        </div>

        {/* Total Ledger Balance */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Vault Balance</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/10">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{formatCurrency(summary?.totalBalance)}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
              <span className="font-semibold text-emerald-600">ACID Settled</span> ledger deposits
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action & Presentation Callout Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-xs font-semibold tracking-wide border border-teal-500/30">
              DevOps Mini Project
            </span>
            <span className="text-xs text-slate-300">Spring Boot 3 + MySQL 8.0</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight">Core Banking Administration Console</h2>
          <p className="text-sm text-slate-300">
            Atomic transactions with Java <code className="text-teal-300 bg-white/10 px-1 rounded font-mono">BigDecimal</code> precision, 
            overdraft protection, Docker micro-architecture, and live SQL schema tables.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('customers')}
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-sm shadow-sm transition"
          >
            Add Customer
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold rounded-xl text-sm transition"
          >
            Cashier Desk
          </button>
          <button
            onClick={onOpenDbModal}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 font-semibold rounded-xl text-sm transition flex items-center gap-1.5"
          >
            <Database className="h-4 w-4" />
            SQL Schema
          </button>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900">Recent Transactions</h3>
            <p className="text-xs text-slate-500">Latest deposit and withdrawal entries in MySQL ledger</p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            {summary?.recentTransactions?.length || 0} entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Tx ID</th>
                <th className="px-5 py-3.5">Account</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Balance After</th>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {summary?.recentTransactions && summary.recentTransactions.length > 0 ? (
                summary.recentTransactions.map((tx) => {
                  const isDeposit = tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-5 py-3.5 font-mono text-xs font-bold text-slate-700">#{tx.id}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-900 font-semibold">
                        {tx.account?.accountNumber || '-'}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold ${
                            isDeposit
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {isDeposit ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                          {tx.type}
                        </span>
                      </td>
                      <td className={`px-5 py-3.5 font-bold ${isDeposit ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isDeposit ? '+' : '-'}{formatCurrency(tx.amount)}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-800">
                        {formatCurrency(tx.balanceAfter)}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500">
                        {formatDate(tx.timestamp)}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-600 truncate max-w-xs font-medium">
                        {tx.description || '-'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
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
