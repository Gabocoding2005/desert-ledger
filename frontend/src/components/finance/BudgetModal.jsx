import { useState, useEffect } from 'react'
import RetroButton from '../ui/RetroButton'
import { getCurrentMonthYear } from '../../utils/dates'

const inputCls = 'w-full px-4 py-2 border-2 border-camel-tobacco bg-camel-cream font-body text-camel-charcoal outline-none'

export default function BudgetModal({ budget, categories, onSave, onClose }) {
  const [formData, setFormData] = useState({ category_id: '', limit_amount: '' })

  useEffect(() => {
    if (budget) {
      setFormData({ category_id: budget.category_id, limit_amount: budget.limit_amount })
    }
  }, [budget])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { month, year } = getCurrentMonthYear()
      await onSave({
        category_id:  parseInt(formData.category_id),
        limit_amount: parseFloat(formData.limit_amount),
        month,
        year,
      })
    } catch {
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
          <div>
            <label className="block font-body font-semibold text-camel-charcoal mb-2">Category</label>
            <select
              required
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className={inputCls}
              style={{ borderRadius: 'var(--radius-md)' }}
              disabled={!!budget}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-body font-semibold text-camel-charcoal mb-2">Monthly Limit</label>
            <input
              type="number" step="0.01" required placeholder="0.00"
              value={formData.limit_amount}
              onChange={(e) => setFormData({ ...formData, limit_amount: e.target.value })}
              className={inputCls + ' font-mono'}
              style={{ borderRadius: 'var(--radius-md)' }}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <RetroButton type="submit" className="flex-1">
              {budget ? 'Update' : 'Set Budget'}
            </RetroButton>
            <RetroButton type="button" variant="secondary" onClick={onClose}>Cancel</RetroButton>
          </div>
        </form>
      </div>
    </div>
  )
}
