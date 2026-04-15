import { useState } from 'react'
import CamelBadge from '../ui/CamelBadge'
import RetroButton from '../ui/RetroButton'

export default function HabitCard({ habit, logs, streak, onToggle, onEdit }) {
  const today = new Date().toISOString().split('T')[0]
  const isCompletedToday = logs.some((log) => log.date === today && log.completed)

  const handleToggle = () => {
    onToggle(habit.id, { date: today })
  }

  return (
    <div className="burned-card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: habit.color }}
            ></div>
            <h4 className="font-display font-bold text-xl text-camel-charcoal">
              {habit.name}
            </h4>
          </div>

          {habit.description && (
            <p className="text-sm text-camel-tobacco font-body mb-3">
              {habit.description}
            </p>
          )}

          <div className="flex items-center gap-2">
            {streak > 0 && (
              <CamelBadge variant="streak" icon="🔥">
                {streak} day{streak !== 1 ? 's' : ''}
              </CamelBadge>
            )}
            <span className="text-xs text-camel-charcoal font-body">
              {habit.frequency === 'daily' ? 'Daily' : `${habit.target_days}x/week`}
            </span>
          </div>
        </div>

        <button
          onClick={() => onEdit(habit)}
          className="text-xs px-3 py-1 bg-camel-cream hover:bg-camel-sand transition-colors rounded font-body"
        >
          Edit
        </button>
      </div>

      {/* Toggle Button */}
      <RetroButton
        variant={isCompletedToday ? 'success' : 'primary'}
        size="sm"
        onClick={handleToggle}
        className="w-full"
      >
        {isCompletedToday ? '✓ Completed Today' : 'Mark as Done'}
      </RetroButton>

      {/* Mini Calendar (last 7 days) */}
      <div className="mt-4 flex gap-1 justify-center">
        {Array.from({ length: 7 }).map((_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (6 - i))
          const dateStr = date.toISOString().split('T')[0]
          const isCompleted = logs.some((log) => log.date === dateStr && log.completed)

          return (
            <div
              key={i}
              className={`w-6 h-6 rounded-sm border-2 ${
                isCompleted
                  ? 'bg-streak-color border-camel-tobacco'
                  : 'bg-camel-cream border-camel-dust'
              }`}
              title={dateStr}
            ></div>
          )
        })}
      </div>
    </div>
  )
}
