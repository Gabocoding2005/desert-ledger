import { useState, useEffect } from 'react'
import { useFinanceStore } from '../../stores/useFinanceStore'
import RetroButton from '../ui/RetroButton'

export default function TransactionModal({ transaction, categories, onClose }) {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category_id: '',
  })

  const { createTransaction, updateTransaction } = useFinanceStore()

  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount,
        type: transaction.type,
        description: transaction.description || '',
        date: transaction.date,
        category_id: transaction.category_id,
      })
    }
  }, [transaction])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
        category_id: parseInt(formData.category_id),
      }

      if (transaction) {
        await updateTransaction(transaction.id, data)
      } else {
        await createTransaction(data)
      }

      onClose()
    } catch (error) {
      console.error('Error saving transaction:', error)
      alert('Error saving transaction')
    }
  }

  const filteredCategories = categories.filter((c) => c.type === formData.type)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-camel-paper burned-card p-8 max-w-md w-full">
        <h3 className="font-display font-bold text-2xl text-camel-tobacco mb-6 uppercase">
          {transaction ? 'Edit Transaction' : 'New Transaction'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div>
            <label className="block font-body font-semibold text-camel-charcoal mb-2">
              Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="income"
                  checked={formData.type === 'income'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value, category_id: '' })}
                  className="w-4 h-4"
                />
                <span className="font-body">Income</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="expense"
                  checked={formData.type === 'expense'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value, category_id: '' })}
                  className="w-4 h-4"
                />
                <span className="font-body">Expense</span>
              </label>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block font-body font-semibold text-camel-charcoal mb-2">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 border-2 border-camel-tobacco rounded font-mono"
            />
          </div>

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
            >
              <option value="">Select a category</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block font-body font-semibold text-camel-charcoal mb-2">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border-2 border-camel-tobacco rounded font-body"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block font-body font-semibold text-camel-charcoal mb-2">
              Date
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border-2 border-camel-tobacco rounded font-mono"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <RetroButton type="submit" className="flex-1">
              {transaction ? 'Update' : 'Create'}
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
