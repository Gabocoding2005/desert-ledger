import { getMonthName } from '../../utils/dates'

const PAGE_TITLES = {
  dashboard:    'Dashboard',
  transactions: 'Transactions',
  budgets:      'Budgets',
  habits:       'Habits',
  settings:     'Settings',
}

export default function TopBar({ currentPage }) {
  const now       = new Date()
  const monthName = getMonthName(now.getMonth() + 1)
  const year      = now.getFullYear()
  const dayStr    = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' })
  const title     = PAGE_TITLES[currentPage] || 'Dashboard'

  return (
    <header className="bg-camel-cream px-6 py-4 flex items-center justify-between flex-shrink-0 stamp-border">
      <h2 className="font-display font-black text-3xl text-camel-charcoal uppercase tracking-wide">
        {title}
      </h2>

      <div className="text-right">
        <p className="font-display font-bold text-lg text-camel-tobacco">
          {monthName} {year}
        </p>
        <p className="text-sm text-camel-charcoal font-body">
          {dayStr}
        </p>
      </div>
    </header>
  )
}
