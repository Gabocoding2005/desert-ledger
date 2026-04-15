import { useState, useEffect } from 'react'
import { useFinanceStore } from '../stores/useFinanceStore'
import PaperCard from '../components/ui/PaperCard'
import RetroButton from '../components/ui/RetroButton'
import TransactionRow from '../components/finance/TransactionRow'
import TransactionModal from '../components/finance/TransactionModal'
import { getCurrentMonthYear } from '../utils/dates'

export default function Transactions() {
  const [showModal, setShowModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [filter, setFilter] = useState({ type: 'all' })

  const {
    transactions,
    categories,
    fetchTransactions,
    fetchCategories,
    deleteTransaction,
  } = useFinanceStore()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { month, year } = getCurrentMonthYear()
    await Promise.all([
      fetchTransactions({ month, year }),
      fetchCategories(),
    ])
  }

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingTransaction(null)
    loadData()
  }

  const filteredTransactions = transactions.filter((t) => {
    if (filter.type === 'all') return true
    return t.type === filter.type
  })

  return (
    <div className="max-w-5xl mx-auto">
      <PaperCard>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3">
            <button
              onClick={() => setFilter({ type: 'all' })}
              className={`px-4 py-2 font-body font-semibold rounded ${
                filter.type === 'all'
                  ? 'bg-camel-sand text-camel-charcoal'
                  : 'bg-camel-cream text-camel-tobacco'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter({ type: 'income' })}
              className={`px-4 py-2 font-body font-semibold rounded ${
                filter.type === 'income'
                  ? 'bg-income-color text-white'
                  : 'bg-camel-cream text-camel-tobacco'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setFilter({ type: 'expense' })}
              className={`px-4 py-2 font-body font-semibold rounded ${
                filter.type === 'expense'
                  ? 'bg-expense-color text-white'
                  : 'bg-camel-cream text-camel-tobacco'
              }`}
            >
              Expenses
            </button>
          </div>

          <RetroButton onClick={() => setShowModal(true)}>
            + New Transaction
          </RetroButton>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length > 0 ? (
          <div className="space-y-1">
            {filteredTransactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="font-body text-camel-tobacco opacity-50 italic">
              No transactions found
            </p>
          </div>
        )}
      </PaperCard>

      {/* Modal */}
      {showModal && (
        <TransactionModal
          transaction={editingTransaction}
          categories={categories}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}
