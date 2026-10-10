import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import CustomersView from './components/CustomersView';
import AccountsView from './components/AccountsView';
import TransactionsView from './components/TransactionsView';
import DatabaseModal from './components/DatabaseModal';
import { BankApi } from './services/api';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [backendStatus, setBackendStatus] = useState('CHECKING');
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  
  // App data state
  const [summary, setSummary] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Global toasts
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: '' }

  const showSuccess = (msg) => {
    setToast({ type: 'success', message: msg });
    setTimeout(() => setToast(null), 4000);
  };

  const showError = (msg) => {
    setToast({ type: 'error', message: msg });
    setTimeout(() => setToast(null), 5000);
  };

  // Health check
  const checkHealth = async () => {
    try {
      await BankApi.getHealth();
      setBackendStatus('UP');
    } catch (e) {
      setBackendStatus('DOWN');
    }
  };

  // Fetch all core data
  const loadData = async () => {
    setLoading(true);
    try {
      const [sumData, custList, accList] = await Promise.all([
        BankApi.getDashboardSummary().catch(() => null),
        BankApi.getCustomers().catch(() => []),
        BankApi.getAccounts().catch(() => []),
      ]);
      setSummary(sumData);
      setCustomers(custList);
      setAccounts(accList);
      setBackendStatus('UP');
    } catch (err) {
      setBackendStatus('DOWN');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
        onOpenDbModal={() => setIsDbModalOpen(true)}
      />

      {/* Database Schema Modal */}
      <DatabaseModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
      />

      {/* Toast notifications */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border animate-in slide-in-from-bottom-2 duration-200 bg-white">
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
          )}
          <span className="text-sm font-medium text-slate-800">{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-600 ml-2">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            summary={summary}
            loading={loading}
            onRefresh={loadData}
            setActiveTab={setActiveTab}
            onOpenDbModal={() => setIsDbModalOpen(true)}
          />
        )}

        {activeTab === 'customers' && (
          <CustomersView
            customers={customers}
            loading={loading}
            onRefresh={loadData}
            onError={showError}
            onSuccess={showSuccess}
          />
        )}

        {activeTab === 'accounts' && (
          <AccountsView
            accounts={accounts}
            customers={customers}
            loading={loading}
            onRefresh={loadData}
            onError={showError}
            onSuccess={showSuccess}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsView
            accounts={accounts}
            onRefresh={loadData}
            onError={showError}
            onSuccess={showSuccess}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500">
          <div>
            Fintech Bank Management Platform • DevOps Mini Project
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDbModalOpen(true)}
              className="text-teal-700 hover:underline font-semibold"
            >
              Show Schema (bankdb)
            </button>
            <span>•</span>
            <span>Built with Spring Boot 3, React, MySQL, Docker, Prometheus & Grafana</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
