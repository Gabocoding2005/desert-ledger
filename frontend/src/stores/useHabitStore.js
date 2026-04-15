import { create } from 'zustand'
import { habitsApi, habitLogsApi } from '../api/client'

export const useHabitStore = create((set, get) => ({
  habits: [],
  habitLogs: {},
  loading: false,
  error: null,

  // Fetch all habits
  fetchHabits: async () => {
    set({ loading: true, error: null })
    try {
      const response = await habitsApi.getAll()
      set({ habits: response.data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  // Create habit
  createHabit: async (data) => {
    try {
      const response = await habitsApi.create(data)
      set({ habits: [...get().habits, response.data] })
      return response.data
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  // Update habit
  updateHabit: async (id, data) => {
    try {
      const response = await habitsApi.update(id, data)
      set({
        habits: get().habits.map((h) => (h.id === id ? response.data : h)),
      })
      return response.data
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  // Delete habit
  deleteHabit: async (id) => {
    try {
      await habitsApi.delete(id)
      set({ habits: get().habits.filter((h) => h.id !== id) })
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  // Fetch logs for a habit
  fetchHabitLogs: async (habitId, params = {}) => {
    try {
      const response = await habitLogsApi.getAll(habitId, params)
      set({
        habitLogs: {
          ...get().habitLogs,
          [habitId]: response.data,
        },
      })
    } catch (error) {
      set({ error: error.message })
    }
  },

  // Toggle habit log
  toggleHabitLog: async (habitId, data) => {
    try {
      await habitLogsApi.toggle(habitId, data)
      // Refresh logs for this habit
      await get().fetchHabitLogs(habitId, {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      })
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },
}))
