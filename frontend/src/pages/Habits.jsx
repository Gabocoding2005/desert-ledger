import { useState, useEffect } from 'react'
import PaperCard from '../components/ui/PaperCard'
import RetroButton from '../components/ui/RetroButton'
import HabitCard from '../components/habits/HabitCard'
import HabitModal from '../components/habits/HabitModal'

export default function Habits({ habits, habitLogs, onCreate, onUpdate, onDelete, onToggle }) {
  const [showModal,     setShowModal]     = useState(false)
  const [editingHabit,  setEditingHabit]  = useState(null)
  const [streaks,       setStreaks]       = useState({})

  useEffect(() => {
    const s = {}
    habits.forEach((habit) => {
      const logs = habitLogs[habit.id] || []
      let streak = 0
      const d = new Date()
      while (true) {
        const dateStr = d.toISOString().split('T')[0]
        if (logs.find((l) => l.date === dateStr && l.completed)) {
          streak++
          d.setDate(d.getDate() - 1)
        } else {
          break
        }
      }
      s[habit.id] = streak
    })
    setStreaks(s)
  }, [habits, habitLogs])

  const handleEdit = (habit) => { setEditingHabit(habit); setShowModal(true) }

  const handleSave = async (data) => {
    if (editingHabit) await onUpdate(editingHabit.id, data)
    else              await onCreate(data)
    setShowModal(false)
    setEditingHabit(null)
  }

  const handleDelete = async (id) => {
    await onDelete(id)
    setShowModal(false)
    setEditingHabit(null)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <PaperCard className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-2xl text-camel-tobacco uppercase">
              Your Habits
            </h3>
            <p className="text-sm text-camel-charcoal font-body mt-1">
              Build consistency, one day at a time
            </p>
          </div>
          <RetroButton onClick={() => setShowModal(true)}>+ New Habit</RetroButton>
        </div>
      </PaperCard>

      {habits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              logs={habitLogs[habit.id] || []}
              streak={streaks[habit.id] || 0}
              onToggle={onToggle}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        <PaperCard>
          <div className="py-12 text-center">
            <p className="font-body text-camel-tobacco opacity-50 italic">
              No habits yet. Start building better routines today!
            </p>
          </div>
        </PaperCard>
      )}

      {showModal && (
        <HabitModal
          habit={editingHabit}
          onSave={handleSave}
          onDelete={editingHabit ? handleDelete : null}
          onClose={() => { setShowModal(false); setEditingHabit(null) }}
        />
      )}
    </div>
  )
}
