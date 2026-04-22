import { formatCurrency } from '../../utils/currency'
import clsx from 'clsx'

export default function BudgetCard({ budget, spent, onEdit }) {
  const percentage  = budget.limit_amount > 0 ? (spent / budget.limit_amount) * 100 : 0
  const isOverBudget = percentage > 100
  const isWarning    = percentage > 80 && !isOverBudget

  const barColor = isOverBudget ? 'bg-expense-color' : isWarning ? 'bg-camel-rust' : 'bg-income-color'

  return (
    <div className="burned-card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{budget.category?.icon || '💰'}</span>
          <div>
            <h4 className="font-display font-bold text-lg text-camel-charcoal">
              {budget.category?.name || 'Category'}
            </h4>
            <p className="text-sm text-camel-tobacco font-mono mono-number">
              {formatCurrency(spent)} / {formatCurrency(budget.limit_amount)}
            </p>
          </div>
        </div>

        {onEdit && (
          <button
            onClick={() => onEdit(budget)}
            className="text-xs px-3 py-1 bg-camel-sand hover:bg-camel-tobacco hover:text-white transition-colors font-body font-semibold"
            style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--camel-tobacco)' }}
          >
            Edit
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div
        className="relative h-6 bg-camel-cream overflow-hidden border-2 border-camel-tobacco"
        style={{ borderRadius: 'var(--radius-sm)' }}
      >
        <div
          className={clsx('h-full transition-all duration-500', barColor)}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono font-bold text-xs text-camel-charcoal mono-number">
            {percentage.toFixed(0)}%
          </span>
        </div>
      </div>

      {isOverBudget && (
        <p className="text-xs text-expense-color font-body font-semibold mt-2">
          Over budget by {formatCurrency(spent - budget.limit_amount)}
        </p>
      )}
      {isWarning && (
        <p className="text-xs text-camel-rust font-body font-semibold mt-2">
          Warning: {(100 - percentage).toFixed(0)}% remaining
        </p>
      )}
    </div>
  )
}
