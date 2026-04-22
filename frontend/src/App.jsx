import { useState, useEffect } from 'react'
import { api } from './api/client'
import { getCurrentMonthYear } from './utils/dates'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import Habits from './pages/Habits'
import Settings from './pages/Settings'
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'

function App() {
  const [page, setPage] = useState('dashboard')

  const [categories,    setCategories]    = useState([])
  const [transactions,  setTransactions]  = useState([])
  const [budgets,       setBudgets]       = useState([])
  const [habits,        setHabits]        = useState([])
  const [habitLogs,     setHabitLogs]     = useState({})
  const [summary,       setSummary]       = useState(null)
  const [habitsSummary, setHabitsSummary] = useState([])

  const { month, year } = getCurrentMonthYear()

  // ── Loaders ────────────────────────────────────────────────

  const loadCategories = () =>
    api.get('/categories').then(setCategories).catch(console.error)

  const loadTransactions = () =>
    api.get('/transactions', { month, year }).then(setTransactions).catch(console.error)

  const loadBudgets = () =>
    api.get('/budgets', { month, year }).then(setBudgets).catch(console.error)

  const loadHabits = async () => {
    const h = await api.get('/habits').catch(() => [])
    setHabits(h)
    const logs = {}
    await Promise.all(h.map(async (habit) => {
      logs[habit.id] = await api.get(`/habits/${habit.id}/logs`, { month, year }).catch(() => [])
    }))
    setHabitLogs(logs)
  }

  const loadDashboard = async () => {
    const [sum, habsum, tx] = await Promise.all([
      api.get('/dashboard/summary', { month, year }).catch(() => null),
      api.get('/dashboard/habits').catch(() => []),
      api.get('/transactions', { month, year }).catch(() => []),
    ])
    setSummary(sum)
    setHabitsSummary(habsum)
    setTransactions(tx)
  }

  useEffect(() => { loadCategories() }, [])

  useEffect(() => {
    if (page === 'dashboard')    loadDashboard()
    if (page === 'transactions') { loadTransactions(); loadCategories() }
    if (page === 'budgets')      { loadBudgets(); loadTransactions(); loadCategories() }
    if (page === 'habits')       loadHabits()
    if (page === 'settings')     loadCategories()
  }, [page])

  // ── Actions ───────────────────────────────────────────────

  const createTransaction = async (data) => {
    await api.post('/transactions', data)
    await loadTransactions()
  }
  const updateTransaction = async (id, data) => {
    await api.put(`/transactions/${id}`, data)
    await loadTransactions()
  }
  const deleteTransaction = async (id) => {
    await api.delete(`/transactions/${id}`)
    await loadTransactions()
  }

  const createCategory = async (data) => {
    await api.post('/categories', data)
    await loadCategories()
  }

  const saveBudget = async (data) => {
    await api.post('/budgets', data)
    await loadBudgets()
  }

  const createHabit = async (data) => {
    await api.post('/habits', data)
    await loadHabits()
  }
  const updateHabit = async (id, data) => {
    await api.put(`/habits/${id}`, data)
    await loadHabits()
  }
  const deleteHabit = async (id) => {
    await api.delete(`/habits/${id}`)
    await loadHabits()
  }
  const toggleHabitLog = async (habitId, data) => {
    await api.post(`/habits/${habitId}/logs`, data)
    await loadHabits()
  }

  // ── Render ────────────────────────────────────────────────

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard
          summary={summary}
          transactions={transactions}
          habitsSummary={habitsSummary}
        />
      case 'transactions':
        return <Transactions
          transactions={transactions}
          categories={categories}
          onCreate={createTransaction}
          onUpdate={updateTransaction}
          onDelete={deleteTransaction}
        />
      case 'budgets':
        return <Budgets
          budgets={budgets}
          categories={categories}
          transactions={transactions}
          onSaveBudget={saveBudget}
        />
      case 'habits':
        return <Habits
          habits={habits}
          habitLogs={habitLogs}
          onCreate={createHabit}
          onUpdate={updateHabit}
          onDelete={deleteHabit}
          onToggle={toggleHabitLog}
        />
      case 'settings':
        return <Settings
          categories={categories}
          onCreate={createCategory}
        />
      default:
        return <Dashboard summary={summary} transactions={transactions} habitsSummary={habitsSummary} />
    }
  }

  return (
    <div className="flex h-screen bg-camel-paper overflow-hidden">
      <Sidebar currentPage={page} onNavigate={setPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar currentPage={page} />
        <main className="flex-1 overflow-y-auto p-6 paper-texture">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default App
