import { useState, useEffect } from 'react'
import { useHabitStore } from '../../stores/useHabitStore'
import RetroButton from '../ui/RetroButton'

const COLORS = [
  '#D4A957', '#8B5E3C', '#C1440E', '#6B7F5E',
  '#7CAFC4', '#4A7C59', '#E8442E', '#9B59B6'
]

export default function HabitModal({ habit, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily',
    target_days: 7,
    color: '#D4A957',
  })

  const { createHabit, updateHabit, deleteHabit } = useHabitStore()

  useEffect(() => {
    if (habit) {
      setFormData({
        name: habit.name,
        description: habit.description || '',
        frequency: habit.frequency,
        target_days: habit.target_days,
        color: habit.color,
      })
    }
  }, [habit])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const data = {
        ...formData,
        target_days: parseInt(formData.target_days),
      }

      if (habit) {
        await updateHabit(habit.id, data)
      } else {
        await createHabit(data)
      }

      onClose()
    } catch (error) {
      console.error('Error saving habit:', error)
      alert('Error saving habit')
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this habit?')) {
      try {
        await deleteHabit(habit.id)
        onClose()
      } catch (error) {
        console.error('Error deleting habit:', error)
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
          {/* Name */}
          <div>
            <label className="block font-body font-semibold text-camel-charcoal mb-2">
              Habit Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border-2 border-camel-tobacco rounded font-body"
              placeholder="e.g., Morning meditation"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-body font-semibold text-camel-charcoal mb-2">
              Description (optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border-2 border-camel-tobacco rounded font-body"
              rows="2"
              placeholder="What does this habit mean to you?"
            />
          </div>

          {/* Frequency */}
          <div>
            <label className="block font-body font-semibold text-camel-charcoal mb-2">
              Frequency
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              className="w-full px-4 py-2 border-2 border-camel-tobacco rounded font-body"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          {/* Target Days */}
          {formData.frequency === 'weekly' && (
            <div>
              <label className="block font-body font-semibold text-camel-charcoal mb-2">
                Target Days per Week
              </label>
              <input
                type="number"
                min="1"
                max="7"
                value={formData.target_days}
                onChange={(e) => setFormData({ ...formData, target_days: e.target.value })}
                className="w-full px-4 py-2 border-2 border-camel-tobacco rounded font-mono"
              />
            </div>
          )}

          {/* Color */}
          <div>
            <label className="block font-body font-semibold text-camel-charcoal mb-2">
              Color
            </label>
            <div className="flex gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    formData.color === color
                      ? 'border-camel-charcoal scale-110'
                      : 'border-camel-dust'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <RetroButton type="submit" className="flex-1">
              {habit ? 'Update' : 'Create'}
            </RetroButton>
            <RetroButton type="button" variant="secondary" onClick={onClose}>
              Cancel
            </RetroButton>
          </div>

          {habit && (
            <RetroButton
              type="button"
              variant="danger"
              onClick={handleDelete}
              className="w-full"
              size="sm"
            >
              Delete Habit
            </RetroButton>
          )}
        </form>
      </div>
    </div>
  )
}
