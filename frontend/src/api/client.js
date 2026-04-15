import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Transactions
export const transactionsApi = {
  getAll: (params) => apiClient.get('/transactions', { params }),
  create: (data) => apiClient.post('/transactions', data),
  update: (id, data) => apiClient.put(`/transactions/${id}`, data),
  delete: (id) => apiClient.delete(`/transactions/${id}`),
}

// Categories
export const categoriesApi = {
  getAll: () => apiClient.get('/categories'),
  create: (data) => apiClient.post('/categories', data),
  update: (id, data) => apiClient.put(`/categories/${id}`, data),
  delete: (id) => apiClient.delete(`/categories/${id}`),
}

// Budgets
export const budgetsApi = {
  getAll: (params) => apiClient.get('/budgets', { params }),
  createOrUpdate: (data) => apiClient.post('/budgets', data),
  delete: (id) => apiClient.delete(`/budgets/${id}`),
}

// Habits
export const habitsApi = {
  getAll: () => apiClient.get('/habits'),
  create: (data) => apiClient.post('/habits', data),
  update: (id, data) => apiClient.put(`/habits/${id}`, data),
  delete: (id) => apiClient.delete(`/habits/${id}`),
}

// Habit Logs
export const habitLogsApi = {
  getAll: (habitId, params) => apiClient.get(`/habits/${habitId}/logs`, { params }),
  toggle: (habitId, data) => apiClient.post(`/habits/${habitId}/logs`, data),
}

// Dashboard
export const dashboardApi = {
  getSummary: (params) => apiClient.get('/dashboard/summary', { params }),
  getTrends: () => apiClient.get('/dashboard/trends'),
  getHabits: () => apiClient.get('/dashboard/habits'),
}

export default apiClient
