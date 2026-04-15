import { create } from 'zustand'
import { transactionsApi, categoriesApi, budgetsApi } from '../api/client'

export const useFinanceStore = create((set, get) => ({
  transactions: [],
  categories: [],
  budgets: [],
  loading: false,
  error: null,

  // Fetch all categories
  fetchCategories: async () => {
    set({ loading: true, error: null })
    try {
      const response = await categoriesApi.getAll()
      set({ categories: response.data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  // Fetch transactions
  fetchTransactions: async (params = {}) => {
    set({ loading: true, error: null })
    try {
      const response = await transactionsApi.getAll(params)
      set({ transactions: response.data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  // Create transaction
  createTransaction: async (data) => {
    try {
      const response = await transactionsApi.create(data)
      set({ transactions: [response.data, ...get().transactions] })
      return response.data
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  // Update transaction
  updateTransaction: async (id, data) => {
    try {
      const response = await transactionsApi.update(id, data)
      set({
        transactions: get().transactions.map((t) =>
          t.id === id ? response.data : t
        ),
      })
      return response.data
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  // Delete transaction
  deleteTransaction: async (id) => {
    try {
      await transactionsApi.delete(id)
      set({ transactions: get().transactions.filter((t) => t.id !== id) })
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  // Create category
  createCategory: async (data) => {
    try {
      const response = await categoriesApi.create(data)
      set({ categories: [...get().categories, response.data] })
      return response.data
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  // Fetch budgets
  fetchBudgets: async (params = {}) => {
    set({ loading: true, error: null })
    try {
      const response = await budgetsApi.getAll(params)
      set({ budgets: response.data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  // Create or update budget
  createOrUpdateBudget: async (data) => {
    try {
      const response = await budgetsApi.createOrUpdate(data)
      const existingIndex = get().budgets.findIndex(
        (b) =>
          b.category_id === data.category_id &&
          b.month === data.month &&
          b.year === data.year
      )

      if (existingIndex >= 0) {
        const newBudgets = [...get().budgets]
        newBudgets[existingIndex] = response.data
        set({ budgets: newBudgets })
      } else {
        set({ budgets: [...get().budgets, response.data] })
      }

      return response.data
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },
}))
