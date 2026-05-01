import { useState, useEffect } from 'react'
import { api } from './api/client'
import { getCurrentMonthYear } from './utils/dates'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import Habits from './pages/Habits'
import Reports from './pages/Reports'
import Recipes from './pages/Recipes'
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
  const [recipes,       setRecipes]       = useState([])
  const [pendingHabits, setPendingHabits] = useState([])

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

  const loadRecipes = () =>
    api.get('/recipes').then(setRecipes).catch(console.error)

  const loadPendingHabits = async () => {
    const pending = await api.get('/habits/pending-today').catch(() => [])
    setPendingHabits(pending)
    return pending
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

  useEffect(() => {
    loadCategories()
    loadPendingHabits().then((pending) => {
      if (!pending.length) return
      if (!('Notification' in window)) return
      const fire = () => {
        if (Notification.permission === 'granted') {
          new Notification('Desert Ledger 🐫', {
            body: `Tienes ${pending.length} hábito${pending.length > 1 ? 's' : ''} pendiente${pending.length > 1 ? 's' : ''} hoy: ${pending.map(h => h.name).join(', ')}`,
            icon: '/favicon.ico',
          })
        }
      }
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(p => { if (p === 'granted') fire() })
      } else {
        fire()
      }
    })
  }, [])

  useEffect(() => {
    if (page === 'dashboard')    loadDashboard()
    if (page === 'transactions') { loadTransactions(); loadCategories() }
    if (page === 'budgets')      { loadBudgets(); loadTransactions(); loadCategories() }
    if (page === 'habits')       loadHabits()
    if (page === 'recipes')      loadRecipes()
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
    await Promise.all([loadHabits(), loadPendingHabits()])
  }

  const createRecipe = async (data) => {
    await api.post('/recipes', data)
    await loadRecipes()
  }
  const updateRecipe = async (id, data) => {
    await api.put(`/recipes/${id}`, data)
    await loadRecipes()
  }
  const deleteRecipe = async (id) => {
    await api.delete(`/recipes/${id}`)
    await loadRecipes()
  }

  // ── Render ────────────────────────────────────────────────

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard
          summary={summary}
          transactions={transactions}
          habitsSummary={habitsSummary}
          pendingHabits={pendingHabits}
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
      case 'reports':
        return <Reports />
      case 'recipes':
        return <Recipes
          recipes={recipes}
          onCreate={createRecipe}
          onUpdate={updateRecipe}
          onDelete={deleteRecipe}
        />
      case 'settings':
        return <Settings
          categories={categories}
          onCreate={createCategory}
        />
      default:
        return <Dashboard summary={summary} transactions={transactions} habitsSummary={habitsSummary} pendingHabits={pendingHabits} />
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--paper)', overflow: 'hidden' }}>
      <Sidebar currentPage={page} onNavigate={setPage} pendingCount={pendingHabits.length} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar currentPage={page} pendingHabits={pendingHabits} onNavigate={setPage} />
        <main className="tex-grain" style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default App
