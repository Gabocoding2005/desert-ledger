import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import Habits from './pages/Habits'
import Settings from './pages/Settings'
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'transactions':
        return <Transactions />
      case 'budgets':
        return <Budgets />
      case 'habits':
        return <Habits />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-camel-paper overflow-hidden">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar currentPage={currentPage} />

        <main className="flex-1 overflow-y-auto p-6 paper-texture">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default App
