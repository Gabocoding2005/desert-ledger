import CamelBadge from '../ui/CamelBadge'
import RetroButton from '../ui/RetroButton'

export default function HabitCard({ habit, logs, streak, onToggle, onEdit }) {
  const today            = new Date().toISOString().split('T')[0]
  const isCompletedToday = logs.some(l => l.date === today && l.completed)

  return (
    <div className="burned-card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }} />
            <h4 className="font-display font-bold text-xl text-camel-charcoal">{habit.name}</h4>
          </div>

          {habit.description && (
            <p className="text-sm text-camel-tobacco font-body mb-3 ml-7">{habit.description}</p>
          )}

          <div className="flex items-center gap-2 ml-7">
            {streak > 0 && (
              <CamelBadge variant="streak" icon="🔥">
                {streak} day{streak !== 1 ? 's' : ''}
              </CamelBadge>
            )}
            <span className="text-xs text-camel-charcoal font-body">
              {habit.frequency === 'daily' ? 'Daily' : `${habit.target_days}×/week`}
            </span>
          </div>
        </div>

        <button
          onClick={() => onEdit(habit)}
          className="text-xs px-3 py-1 bg-camel-cream hover:bg-camel-sand transition-colors font-body ml-2"
          style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--camel-dust)' }}
        >
          Edit
        </button>
      </div>

      <RetroButton
        variant={isCompletedToday ? 'success' : 'primary'}
        size="sm"
        onClick={() => onToggle(habit.id, { date: today })}
        className="w-full"
      >
        {isCompletedToday ? '✓ Completed Today' : 'Mark as Done'}
      </RetroButton>

      {/* Last 7-day mini calendar */}
      <div className="mt-4 flex gap-1 justify-center">
        {Array.from({ length: 7 }).map((_, i) => {
          const d = new Date()
          d.setDate(d.getDate() - (6 - i))
          const dateStr    = d.toISOString().split('T')[0]
          const isComplete = logs.some(l => l.date === dateStr && l.completed)

          return (
            <div
              key={i}
              className="w-6 h-6"
              title={dateStr}
              style={{
                borderRadius: 'var(--radius-sm)',
                border: `2px solid ${isComplete ? 'var(--camel-tobacco)' : 'var(--camel-dust)'}`,
                backgroundColor: isComplete ? 'var(--streak-color)' : 'var(--camel-cream)',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
