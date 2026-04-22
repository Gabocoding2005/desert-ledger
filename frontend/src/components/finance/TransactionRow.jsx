import { formatCurrency } from '../../utils/currency'
import { formatDateShort } from '../../utils/dates'
import clsx from 'clsx'

export default function TransactionRow({ transaction, onEdit, onDelete }) {
  const isIncome = transaction.type === 'income'

  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-camel-dust hover:bg-camel-cream/30 transition-colors group">
      <div className="flex items-center gap-4 flex-1">
        <div className="text-2xl">{transaction.category?.icon || '💰'}</div>

        <div className="flex-1">
          <p className="font-body font-semibold text-camel-charcoal">
            {transaction.description || transaction.category?.name || 'Transaction'}
          </p>
          <p className="text-sm text-camel-tobacco font-body">
            {formatDateShort(transaction.date)} • {transaction.category?.name}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <p className={clsx('font-mono font-bold text-lg mono-number', isIncome ? 'text-income-color' : 'text-expense-color')}>
          {isIncome ? '+' : '−'}{formatCurrency(transaction.amount)}
        </p>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(transaction)}
              className="text-xs px-2 py-1 bg-camel-sand hover:bg-camel-tobacco hover:text-white transition-colors font-body font-semibold"
              style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--camel-tobacco)' }}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(transaction.id)}
              className="text-xs px-2 py-1 bg-camel-rust hover:bg-red-700 text-white transition-colors font-body"
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
