import React, { useState } from 'react';
import { Database, Table, Copy, Check, Terminal, ExternalLink, Code2 } from 'lucide-react';

export default function DatabaseModal({ isOpen, onClose }) {
  const [copiedQuery, setCopiedQuery] = useState('');

  if (!isOpen) return null;

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedQuery(id);
    setTimeout(() => setCopiedQuery(''), 2000);
  };

  const queries = [
    {
      id: 'cmd_connect',
      title: 'CMD Connect Command',
      desc: 'Run in Command Prompt to connect to MySQL',
      sql: '"C:\\Users\\Parth Mane\\Desktop\\bin\\mysql.exe" -u root -p bankdb'
    },
    {
      id: 'customers',
      title: 'View All Customers',
      desc: 'Shows customer records, contact information and KYC',
      sql: 'SELECT id, first_name, last_name, email, phone, address FROM customers;'
    },
    {
      id: 'accounts',
      title: 'View Bank Accounts',
      desc: 'Shows accounts, account types, balances & holder link',
      sql: 'SELECT a.id, a.account_number, a.account_type, a.balance, CONCAT(c.first_name, " ", c.last_name) AS holder, a.created_at FROM accounts a JOIN customers c ON a.customer_id = c.id;'
    },
    {
      id: 'transactions',
      title: 'View Transaction Audit Ledger',
      desc: 'Shows financial entries, credit/debit types, and balance after',
      sql: 'SELECT t.id, a.account_number, t.type, t.amount, t.balance_after, t.description, t.timestamp FROM transactions t JOIN accounts a ON t.account_id = a.id ORDER BY t.timestamp DESC;'
    },
    {
      id: 'summary',
      title: 'Executive Bank Ledger Aggregation',
      desc: 'Calculates total liquidity and account counts',
      sql: 'SELECT COUNT(DISTINCT c.id) AS total_customers, COUNT(a.id) AS total_accounts, COALESCE(SUM(a.balance), 0) AS vault_total FROM customers c LEFT JOIN accounts a ON c.id = a.customer_id;'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base tracking-tight flex items-center gap-2">
                MySQL Database Schema & Live SQL Viewer
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30">bankdb</span>
              </h3>
              <p className="text-xs text-slate-400">Present live schema tables, constraints, and execute SQL statements during presentation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Quick Info Alert */}
          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200/60 flex items-start gap-3">
            <Terminal className="h-5 w-5 text-teal-700 shrink-0 mt-0.5" />
            <div className="text-xs text-teal-950 space-y-1">
              <p className="font-semibold">How to display your live database in CMD / PowerShell:</p>
              <p className="text-slate-700">Open a terminal and run the connection command below with password <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-teal-200 font-bold">root</code> to query <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-teal-200">bankdb</code> live!</p>
            </div>
          </div>

          {/* Schema Structure overview cards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Table className="h-4 w-4 text-slate-400" />
              Relational Tables Architecture
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-slate-900 text-xs">customers</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">Entity</span>
                </div>
                <p className="text-[11px] text-slate-500">Stores client profiles, emails (UNIQUE), phones, and KYC addresses.</p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-slate-900 text-xs">accounts</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded font-medium">FK Linked</span>
                </div>
                <p className="text-[11px] text-slate-500">Savings & Current accounts with strict DECIMAL(15,2) balance.</p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-slate-900 text-xs">transactions</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded font-medium">Immutable</span>
                </div>
                <p className="text-[11px] text-slate-500">Atomic ledger tracking credits, debits, timestamps and balance after.</p>
              </div>
            </div>
          </div>

          {/* SQL Queries for Presentation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Code2 className="h-4 w-4 text-slate-400" />
              One-Click Presentation SQL Queries
            </h4>

            {queries.map((q) => (
              <div key={q.id} className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-900">{q.title}</span>
                    <span className="text-[11px] text-slate-500 ml-2">— {q.desc}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(q.sql, q.id)}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium transition"
                  >
                    {copiedQuery === q.id ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 text-slate-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 bg-slate-900 overflow-x-auto">
                  <code className="text-xs font-mono text-teal-300 leading-relaxed block whitespace-pre">
                    {q.sql}
                  </code>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex justify-between items-center">
            <div>
              <span className="font-semibold text-slate-900">Schema file location: </span>
              <code className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-teal-700">schema.sql</code> in root directory.
            </div>
            <button
              onClick={() => handleCopy('mysql -u root -p < schema.sql', 'load_schema')}
              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition"
            >
              {copiedQuery === 'load_schema' ? 'Copied command!' : 'Copy Import Command'}
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition"
          >
            Close Schema Viewer
          </button>
        </div>

      </div>
    </div>
  );
}
