import React from 'react';
import { Landmark, Users, CreditCard, ArrowLeftRight, Activity } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, backendStatus }) {
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
            <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center text-teal-400 shadow">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">Fintech Bank</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-semibold border border-teal-200">Management</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Core Banking Administration</p>
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
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Backend Health Badge */}
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                backendStatus === 'UP'
                  ? 'bg-emerald-500 animate-pulse'
                  : backendStatus === 'CHECKING'
                  ? 'bg-amber-400'
                  : 'bg-rose-500'
              }`}
            />
            <span className="text-slate-600 font-medium">
              API: <strong className={backendStatus === 'UP' ? 'text-emerald-700' : 'text-rose-700'}>{backendStatus}</strong>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
