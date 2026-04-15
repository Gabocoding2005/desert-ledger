import { useState, useEffect } from 'react'
import { useFinanceStore } from '../../stores/useFinanceStore'
import RetroButton from '../ui/RetroButton'
import { getCurrentMonthYear } from '../../utils/dates'

export default function BudgetModal({ budget, categories, onClose }) {
  const [formData, setFormData] = useState({
    category_id: '',
    limit_amount: '',
  })

  const { createOrUpdateBudget } = useFinanceStore()

  useEffect(() => {
    if (budget) {
      setFormData({
        category_id: budget.category_id,
        limit_amount: budget.limit_amount,
      })
    }
  }, [budget])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const { month, year } = getCurrentMonthYear()

      const data = {
        category_id: parseInt(formData.category_id),
        limit_amount: parseFloat(formData.limit_amount),
        month,
        year,
      }

      await createOrUpdateBudget(data)
      onClose()
    } catch (error) {
      console.error('Error saving budget:', error)
      alert('Error saving budget')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-camel-paper burned-card p-8 max-w-md w-full">
        <h3 className="font-display font-bold text-2xl text-camel-tobacco mb-6 uppercase">
          {budget ? 'Edit Budget' : 'Set Budget'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category */}
          <div>
            <label className="block font-body font-semibold text-camel-charcoal mb-2">
              Category
            </label>
            <select
              required
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-4 py-2 border-2 border-camel-tobacco rounded font-body"
              disabled={!!budget}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Limit Amount */}
          <div>
            <label className="block font-body font-semibold text-camel-charcoal mb-2">
              Monthly Limit
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.limit_amount}
              onChange={(e) => setFormData({ ...formData, limit_amount: e.target.value })}
              className="w-full px-4 py-2 border-2 border-camel-tobacco rounded font-mono"
              placeholder="0.00"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <RetroButton type="submit" className="flex-1">
              {budget ? 'Update' : 'Set Budget'}
            </RetroButton>
            <RetroButton type="button" variant="secondary" onClick={onClose}>
              Cancel
            </RetroButton>
          </div>
        </form>
      </div>
    </div>
  )
}
