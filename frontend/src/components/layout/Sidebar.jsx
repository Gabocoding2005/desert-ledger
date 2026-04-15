import clsx from 'clsx'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏜️' },
  { id: 'transactions', label: 'Transactions', icon: '💰' },
  { id: 'budgets', label: 'Budgets', icon: '📊' },
  { id: 'habits', label: 'Habits', icon: '🔥' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

export default function Sidebar({ currentPage, onNavigate }) {
  return (
    <aside className="w-64 bg-camel-tobacco text-camel-cream flex flex-col border-r-4 border-camel-charcoal">
      {/* Logo */}
      <div className="p-6 border-b-2 border-camel-sand">
        <h1 className="font-display font-black text-3xl text-camel-sand flex items-center gap-2">
          🐫 DESERT
          <br />
          LEDGER
        </h1>
        <p className="text-xs text-camel-dust mt-2 font-body italic">
          Walk a mile in your finances
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={clsx(
              'w-full px-6 py-3 text-left font-body font-semibold flex items-center gap-3 transition-colors border-l-4',
              currentPage === item.id
                ? 'bg-camel-sand text-camel-charcoal border-camel-rust'
                : 'border-transparent hover:bg-camel-sand/20 hover:border-camel-sand'
            )}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-base">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t-2 border-camel-sand text-xs text-camel-dust text-center">
        <p>Built for the long road</p>
        <p className="mt-1">v1.0.0</p>
      </div>
    </aside>
  )
}
