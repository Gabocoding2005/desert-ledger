import PaperCard from '../ui/PaperCard'
import CamelBadge from '../ui/CamelBadge'

export default function HabitSummaryCard({ habits }) {
  const totalHabits = habits.length
  const completedToday = habits.filter(h => h.streak > 0).length

  return (
    <PaperCard>
      <h3 className="font-display font-bold text-2xl text-camel-tobacco mb-4 uppercase">
        Habits Today
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-body text-camel-charcoal">Completed Today</span>
          <CamelBadge variant="streak" icon="✅">
            {completedToday} / {totalHabits}
          </CamelBadge>
        </div>

        {habits.length > 0 ? (
          <div className="space-y-3 mt-4">
            {habits.slice(0, 3).map((habit) => (
              <div key={habit.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: habit.color }}
                  ></div>
                  <span className="font-body text-sm text-camel-charcoal">
                    {habit.name}
                  </span>
                </div>
                {habit.streak > 0 && (
                  <CamelBadge variant="streak" icon="🔥">
                    {habit.streak} day{habit.streak !== 1 ? 's' : ''}
                  </CamelBadge>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-camel-tobacco opacity-50 text-sm italic font-body mt-4">
            No active habits yet
          </p>
        )}
      </div>
    </PaperCard>
  )
}
