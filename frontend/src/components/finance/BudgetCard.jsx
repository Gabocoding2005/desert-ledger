import { formatCurrency } from '../../utils/currency'
import clsx from 'clsx'

export default function BudgetCard({ budget, spent, onEdit }) {
  const percentage = (spent / budget.limit_amount) * 100
  const isOverBudget = percentage > 100
  const isWarning = percentage > 80 && percentage <= 100

  const getProgressColor = () => {
    if (isOverBudget) return 'bg-expense-color'
    if (isWarning) return 'bg-camel-rust'
    return 'bg-income-color'
  }

  return (
    <div className="burned-card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{budget.category?.icon || '💰'}</span>
          <div>
            <h4 className="font-display font-bold text-lg text-camel-charcoal">
              {budget.category?.name || 'Category'}
            </h4>
            <p className="text-sm text-camel-tobacco font-body">
              {formatCurrency(spent)} / {formatCurrency(budget.limit_amount)}
            </p>
          </div>
        </div>

        {onEdit && (
          <button
            onClick={() => onEdit(budget)}
            className="text-xs px-3 py-1 bg-camel-sand hover:bg-camel-tobacco hover:text-white transition-colors rounded font-body font-semibold"
          >
            Edit
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative h-6 bg-camel-cream rounded-sm overflow-hidden border-2 border-camel-tobacco">
        <div
          className={clsx(
            'h-full transition-all duration-500',
            getProgressColor()
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono font-bold text-xs text-camel-charcoal">
            {percentage.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Status Message */}
      {isOverBudget && (
        <p className="text-xs text-expense-color font-body font-semibold mt-2">
          Over budget by {formatCurrency(spent - budget.limit_amount)}
        </p>
      )}
      {isWarning && !isOverBudget && (
        <p className="text-xs text-camel-rust font-body font-semibold mt-2">
          Warning: {(100 - percentage).toFixed(0)}% remaining
        </p>
      )}
    </div>
  )
}
