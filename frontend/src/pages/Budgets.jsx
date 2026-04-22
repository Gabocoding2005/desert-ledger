import { useState, useEffect } from 'react'
import { useFinanceStore } from '../stores/useFinanceStore'
import PaperCard from '../components/ui/PaperCard'
import RetroButton from '../components/ui/RetroButton'
import BudgetCard from '../components/finance/BudgetCard'
import BudgetModal from '../components/finance/BudgetModal'
import { getCurrentMonthYear } from '../utils/dates'
import { transactionsApi } from '../api/client'

export default function Budgets() {
  const [showModal, setShowModal] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  const [spending, setSpending] = useState({})

  const {
    budgets,
    categories,
    fetchBudgets,
    fetchCategories,
  } = useFinanceStore()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { month, year } = getCurrentMonthYear()

    await Promise.all([
      fetchBudgets({ month, year }),
      fetchCategories(),
    ])

    // Get spending per category
    const txRes = await transactionsApi.getAll({ month, year, type: 'expense' })
    const spendingMap = {}

    txRes.data.forEach((tx) => {
      if (!spendingMap[tx.category_id]) {
        spendingMap[tx.category_id] = 0
      }
      spendingMap[tx.category_id] += tx.amount
    })

    setSpending(spendingMap)
  }

  const handleEdit = (budget) => {
    setEditingBudget(budget)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingBudget(null)
    loadData()
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

          <RetroButton onClick={() => setShowModal(true)}>
            + Set Budget
          </RetroButton>
        </div>
      </PaperCard>

      {/* Budget Cards */}
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

      {/* Categories without budgets */}
      {expenseCategories.filter(
        (cat) => !budgets.find((b) => b.category_id === cat.id)
      ).length > 0 && (
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

      {/* Modal */}
      {showModal && (
        <BudgetModal
          budget={editingBudget}
          categories={expenseCategories}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}
