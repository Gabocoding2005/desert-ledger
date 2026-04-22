import { useState } from 'react'
import PaperCard from '../components/ui/PaperCard'
import RetroButton from '../components/ui/RetroButton'
import BudgetCard from '../components/finance/BudgetCard'
import BudgetModal from '../components/finance/BudgetModal'

export default function Budgets({ budgets, categories, transactions, onSaveBudget }) {
  const [showModal,     setShowModal]     = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)

  const spending = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category_id] = (acc[t.category_id] || 0) + t.amount
      return acc
    }, {})

  const handleEdit = (budget) => { setEditingBudget(budget); setShowModal(true) }

  const handleSave = async (data) => {
    await onSaveBudget(data)
    setShowModal(false)
    setEditingBudget(null)
  }

  const expenseCategories = categories.filter((c) => c.type === 'expense')

  return (
    <div className="max-w-6xl mx-auto">
      <PaperCard className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-2xl text-camel-tobacco uppercase">
              Monthly Budgets
            </h3>
            <p className="text-sm text-camel-charcoal font-body mt-1">
              Track your spending limits by category
            </p>
          </div>
          <RetroButton onClick={() => setShowModal(true)}>+ Set Budget</RetroButton>
        </div>
      </PaperCard>

      {budgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              spent={spending[budget.category_id] || 0}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        <PaperCard>
          <div className="py-12 text-center">
            <p className="font-body text-camel-tobacco opacity-50 italic">
              No budgets set for this month. Click "Set Budget" to get started!
            </p>
          </div>
        </PaperCard>
      )}

      {expenseCategories.filter((cat) => !budgets.find((b) => b.category_id === cat.id)).length > 0 && (
        <div className="mt-8">
          <h4 className="font-display font-bold text-lg text-camel-tobacco mb-4">
            Categories without budgets
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {expenseCategories
              .filter((cat) => !budgets.find((b) => b.category_id === cat.id))
              .map((cat) => (
                <div
                  key={cat.id}
                  className="p-3 bg-camel-cream border border-camel-dust text-center font-body text-sm text-camel-charcoal"
                  style={{ borderRadius: 'var(--radius-sm)' }}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <p className="mt-1">{cat.name}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {showModal && (
        <BudgetModal
          budget={editingBudget}
          categories={expenseCategories}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingBudget(null) }}
        />
      )}
    </div>
  )
}
