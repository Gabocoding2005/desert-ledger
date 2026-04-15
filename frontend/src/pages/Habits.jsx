import { useState, useEffect } from 'react'
import { useHabitStore } from '../stores/useHabitStore'
import PaperCard from '../components/ui/PaperCard'
import RetroButton from '../components/ui/RetroButton'
import HabitCard from '../components/habits/HabitCard'
import HabitModal from '../components/habits/HabitModal'
import { getCurrentMonthYear } from '../utils/dates'

export default function Habits() {
  const [showModal, setShowModal] = useState(false)
  const [editingHabit, setEditingHabit] = useState(null)
  const [streaks, setStreaks] = useState({})

  const { habits, habitLogs, fetchHabits, fetchHabitLogs, toggleHabitLog } = useHabitStore()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    await fetchHabits()
  }

  useEffect(() => {
    // Fetch logs for each habit
    if (habits.length > 0) {
      const { month, year } = getCurrentMonthYear()
      habits.forEach(async (habit) => {
        await fetchHabitLogs(habit.id, { month, year })
      })
    }
  }, [habits])

  useEffect(() => {
    // Calculate streaks
    const newStreaks = {}
    habits.forEach((habit) => {
      const logs = habitLogs[habit.id] || []
      let streak = 0
      let checkDate = new Date()

      while (true) {
        const dateStr = checkDate.toISOString().split('T')[0]
        const log = logs.find((l) => l.date === dateStr && l.completed)

        if (log) {
          streak++
          checkDate.setDate(checkDate.getDate() - 1)
        } else {
          break
        }
      }

      newStreaks[habit.id] = streak
    })

    setStreaks(newStreaks)
  }, [habits, habitLogs])

  const handleToggle = async (habitId, data) => {
    await toggleHabitLog(habitId, data)
  }

  const handleEdit = (habit) => {
    setEditingHabit(habit)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingHabit(null)
    loadData()
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

          <RetroButton onClick={() => setShowModal(true)}>
            + New Habit
          </RetroButton>
        </div>
      </PaperCard>

      {/* Habit Cards */}
      {habits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              logs={habitLogs[habit.id] || []}
              streak={streaks[habit.id] || 0}
              onToggle={handleToggle}
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

      {/* Modal */}
      {showModal && (
        <HabitModal habit={editingHabit} onClose={handleCloseModal} />
      )}
    </div>
  )
}
