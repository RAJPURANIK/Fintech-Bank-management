import axios from 'axios';

// The baseUrl defaults to relative '/api' which works both locally with Vite proxy and in Docker with Nginx proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const BankApi = {
  // Dashboard
  getDashboardSummary: () => apiClient.get('/dashboard/summary').then(res => res.data),
  getRecentTransactions: (limit = 15) => apiClient.get(`/dashboard/transactions?limit=${limit}`).then(res => res.data),

  // Customers
  getCustomers: () => apiClient.get('/customers').then(res => res.data),
  getCustomerById: (id) => apiClient.get(`/customers/${id}`).then(res => res.data),
  createCustomer: (customer) => apiClient.post('/customers', customer).then(res => res.data),
  updateCustomer: (id, customer) => apiClient.put(`/customers/${id}`, customer).then(res => res.data),
  deleteCustomer: (id) => apiClient.delete(`/customers/${id}`).then(res => res.data),

  // Accounts
  getAccounts: (customerId = null) => {
    const url = customerId ? `/accounts?customerId=${customerId}` : '/accounts';
    return apiClient.get(url).then(res => res.data);
  },
  getAccountById: (id) => apiClient.get(`/accounts/${id}`).then(res => res.data),
  createAccount: (accountData) => apiClient.post('/accounts', accountData).then(res => res.data),
  
  // Banking Operations
  deposit: (accountId, data) => apiClient.post(`/accounts/${accountId}/deposit`, data).then(res => res.data),
  withdraw: (accountId, data) => apiClient.post(`/accounts/${accountId}/withdraw`, data).then(res => res.data),
  getAccountTransactions: (accountId) => apiClient.get(`/accounts/${accountId}/transactions`).then(res => res.data),

  // Health / Monitoring check
  getHealth: () => axios.get('/actuator/health').then(res => res.data),
};

export default apiClient;
