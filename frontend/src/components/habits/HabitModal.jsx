import { useState, useEffect } from 'react'
import RetroButton from '../ui/RetroButton'

const COLORS = [
  '#D4A957', '#8B5E3C', '#C1440E', '#6B7F5E',
  '#7CAFC4', '#4A7C59', '#E8442E', '#9B59B6',
]

const inputCls = 'w-full px-4 py-2 border-2 border-camel-tobacco bg-camel-cream font-body text-camel-charcoal outline-none'
const inputRadius = { borderRadius: 'var(--radius-md)' }

export default function HabitModal({ habit, onSave, onDelete, onClose }) {
  const [formData, setFormData] = useState({
    name: '', description: '', frequency: 'daily', target_days: 7, color: '#D4A957',
  })

  useEffect(() => {
    if (habit) {
      setFormData({
        name:        habit.name,
        description: habit.description || '',
        frequency:   habit.frequency,
        target_days: habit.target_days,
        color:       habit.color,
      })
    }
  }, [habit])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await onSave({ ...formData, target_days: parseInt(formData.target_days) })
    } catch {
      alert('Error saving habit')
    }
  }

  const handleDelete = async () => {
    if (confirm('Delete this habit?')) {
      try {
        await onDelete(habit.id)
      } catch {
        alert('Error deleting habit')
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-camel-paper burned-card p-8 max-w-md w-full">
        <h3 className="font-display font-bold text-2xl text-camel-tobacco mb-6 uppercase">
          {habit ? 'Edit Habit' : 'New Habit'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-body font-semibold text-camel-charcoal mb-2">Habit Name</label>
            <input
              type="text" required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={inputCls}
              style={inputRadius}
              placeholder="e.g., Morning meditation"
            />
          </div>

          <div>
            <label className="block font-body font-semibold text-camel-charcoal mb-2">Description (optional)</label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={inputCls}
              style={inputRadius}
              placeholder="What does this habit mean to you?"
            />
          </div>

          <div>
            <label className="block font-body font-semibold text-camel-charcoal mb-2">Frequency</label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              className={inputCls}
              style={inputRadius}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          {formData.frequency === 'weekly' && (
            <div>
              <label className="block font-body font-semibold text-camel-charcoal mb-2">Target days per week</label>
              <input
                type="number" min="1" max="7"
                value={formData.target_days}
                onChange={(e) => setFormData({ ...formData, target_days: e.target.value })}
                className={inputCls + ' font-mono'}
                style={inputRadius}
              />
            </div>
          )}

          <div>
            <label className="block font-body font-semibold text-camel-charcoal mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((color) => (
                <button
                  key={color} type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className="w-8 h-8 rounded-full transition-transform"
                  style={{
                    backgroundColor: color,
                    border: `2px solid ${formData.color === color ? 'var(--camel-charcoal)' : 'var(--camel-dust)'}`,
                    transform: formData.color === color ? 'scale(1.15)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <RetroButton type="submit" className="flex-1">
              {habit ? 'Update' : 'Create'}
            </RetroButton>
            <RetroButton type="button" variant="secondary" onClick={onClose}>Cancel</RetroButton>
          </div>

          {habit && onDelete && (
            <RetroButton type="button" variant="danger" onClick={handleDelete} className="w-full" size="sm">
              Delete Habit
            </RetroButton>
          )}
        </form>
      </div>
    </div>
  )
}
