import React, { useState } from 'react';
import { ArrowDownRight, ArrowUpRight, ShieldAlert, History, Wallet, Search } from 'lucide-react';
import { BankApi } from '../services/api';

export default function TransactionsView({ accounts, onRefresh, onError, onSuccess }) {
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || '');
  const [operationType, setOperationType] = useState('DEPOSIT');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [accountHistory, setAccountHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const selectedAccount = accounts.find(a => String(a.id) === String(selectedAccountId));

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val || 0);
  };

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const loadHistory = async (accId) => {
    if (!accId) return;
    setLoadingHistory(true);
    try {
      const data = await BankApi.getAccountTransactions(accId);
      setAccountHistory(data);
    } catch (err) {
      onError('Failed to fetch account transaction history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleAccountChange = (e) => {
    const accId = e.target.value;
    setSelectedAccountId(accId);
    if (accId) {
      loadHistory(accId);
    } else {
      setAccountHistory([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAccountId) {
      onError('Please select a target bank account');
      return;
    }
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      onError('Please enter a valid amount greater than zero');
      return;
    }

    setSubmitting(true);
    try {
      if (operationType === 'DEPOSIT') {
        await BankApi.deposit(selectedAccountId, {
          amount: val,
          description: description || 'Teller deposit',
        });
        onSuccess(`Successfully deposited ${formatCurrency(val)} into account!`);
      } else {
        await BankApi.withdraw(selectedAccountId, {
          amount: val,
          description: description || 'Cash withdrawal',
        });
        onSuccess(`Successfully withdrawn ${formatCurrency(val)} from account!`);
      }
      setAmount('');
      setDescription('');
      onRefresh();
      loadHistory(selectedAccountId);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Transaction rejected';
      onError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Banking Operations & Cashier Desk</h1>
        <p className="text-sm text-slate-500">Atomic transactional deposits, cash withdrawals, and dedicated account ledger audit</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cashier Operation Card */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Execute Transaction</h2>

          {/* Account Selector */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Account *</label>
              <select
                value={selectedAccountId}
                onChange={handleAccountChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-mono"
              >
                <option value="">-- Choose Account --</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.accountNumber} — {acc.customer?.firstName} {acc.customer?.lastName} (${parseFloat(acc.balance).toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Account Info Box */}
            {selectedAccount && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer:</span>
                  <span className="font-semibold text-slate-900">{selectedAccount.customer?.firstName} {selectedAccount.customer?.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Account Type:</span>
                  <span className="font-semibold text-slate-900">{selectedAccount.accountType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Available Balance:</span>
                  <span className="font-bold text-emerald-600 text-sm">{formatCurrency(selectedAccount.balance)}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              {/* Type Switcher */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Operation Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOperationType('DEPOSIT')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      operationType === 'DEPOSIT'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <ArrowDownRight className="h-4 w-4" />
                    DEPOSIT
                  </button>
                  <button
                    type="button"
                    onClick={() => setOperationType('WITHDRAWAL')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      operationType === 'WITHDRAWAL'
                        ? 'border-rose-600 bg-rose-50 text-rose-800 ring-1 ring-rose-600'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                    WITHDRAWAL
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Amount ($) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-semibold text-sm">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                    placeholder="0.00"
                  />
                </div>
                {operationType === 'WITHDRAWAL' && selectedAccount && (
                  <p className="text-[11px] text-slate-500 mt-1">
                    Max withdrawable: {formatCurrency(selectedAccount.balance)} (Overdraft prevention active)
                  </p>
                )}
              </div>

              {/* Note / Memo */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Memo</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  placeholder="e.g. Counter deposit, Utility bill"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || !selectedAccountId}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold text-white shadow transition flex items-center justify-center gap-2 ${
                  operationType === 'DEPOSIT'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {submitting && <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Confirm {operationType}
              </button>
            </form>
          </div>
        </div>

        {/* Account Ledger Audit History */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="font-semibold text-slate-900">Ledger Statement</h3>
              <p className="text-xs text-slate-500">
                {selectedAccount ? `Transaction log for ${selectedAccount.accountNumber}` : 'Select an account to view transaction history'}
              </p>
            </div>
            {selectedAccountId && (
              <button
                onClick={() => loadHistory(selectedAccountId)}
                className="text-xs text-teal-700 font-semibold hover:underline"
              >
                Refresh Log
              </button>
            )}
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Tx ID</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Balance After</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {accountHistory.length > 0 ? (
                  accountHistory.map((tx) => {
                    const isDeposit = tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN';
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-700">#{tx.id}</td>
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
                        <td className="px-5 py-3.5 font-mono text-xs text-slate-700 font-semibold">
                          {formatCurrency(tx.balanceAfter)}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-500">{formatDate(tx.timestamp)}</td>
                        <td className="px-5 py-3.5 text-xs text-slate-600 max-w-xs truncate">{tx.description || '-'}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-14 text-slate-400">
                      {loadingHistory
                        ? 'Fetching ledger records...'
                        : selectedAccountId
                        ? 'No transactions found for this account.'
                        : 'Please choose an account on the left panel to inspect statement ledger.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
