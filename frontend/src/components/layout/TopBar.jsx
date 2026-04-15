import { getMonthName } from '../../utils/dates'

export default function TopBar({ currentPage }) {
  const now = new Date()
  const monthName = getMonthName(now.getMonth() + 1)
  const year = now.getFullYear()

  const pageTitle = {
    dashboard: 'Dashboard',
    transactions: 'Transactions',
    budgets: 'Budgets',
    habits: 'Habits',
    settings: 'Settings',
  }[currentPage] || 'Dashboard'

  return (
    <header className="bg-camel-cream border-b-4 border-camel-tobacco px-6 py-4 stamp-border">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-black text-3xl text-camel-charcoal uppercase tracking-wide">
          {pageTitle}
        </h2>

        <div className="text-right">
          <p className="font-display font-bold text-lg text-camel-tobacco">
            {monthName} {year}
          </p>
          <p className="text-sm text-camel-charcoal font-body">
            {now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </header>
  )
}
