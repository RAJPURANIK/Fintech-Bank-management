import React from 'react';
import { Landmark, Users, CreditCard, ArrowLeftRight, Activity, Database } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, backendStatus, onOpenDbModal }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Landmark },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'accounts', label: 'Accounts', icon: CreditCard },
    { id: 'transactions', label: 'Banking Ops', icon: ArrowLeftRight },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-teal-400 shadow-md ring-1 ring-white/10">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">Fintech Bank</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-semibold border border-teal-200 shadow-xs">Admin</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Core Banking & Ledger System</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex space-x-1 sm:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Database Schema Button & Health Status */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenDbModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold shadow-xs transition"
              title="Inspect MySQL Schema and Query Cheatsheet"
            >
              <Database className="h-3.5 w-3.5 text-teal-600" />
              <span>SQL Schema</span>
            </button>

            <div className="hidden md:flex items-center gap-2 text-xs bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <span
                className={`h-2 w-2 rounded-full ${
                  backendStatus === 'UP'
                    ? 'bg-emerald-500 animate-pulse'
                    : backendStatus === 'CHECKING'
                    ? 'bg-amber-400'
                    : 'bg-rose-500'
                }`}
              />
              <span className="text-slate-600 font-medium">
                System: <strong className={backendStatus === 'UP' ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>{backendStatus}</strong>
              </span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
