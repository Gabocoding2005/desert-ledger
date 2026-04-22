import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import PaperCard from '../ui/PaperCard'
import { formatCurrency } from '../../utils/currency'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="bg-camel-cream p-3 border-2 border-camel-tobacco shadow-lg"
      style={{ borderRadius: 'var(--radius-sm)' }}
    >
      <p className="font-display font-bold text-camel-charcoal">
        {payload[0].payload.name}
      </p>
      <p className="font-mono text-expense-color">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  )
}

export default function SpendingChart({ data }) {
  return (
    <PaperCard>
      <h3 className="font-display font-bold text-2xl text-camel-tobacco mb-4 uppercase">
        Spending by Category
      </h3>

      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8D5B7" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#2D2D2D', fontFamily: 'Source Serif 4', fontSize: 12 }}
            />
            <YAxis
              tick={{ fill: '#2D2D2D', fontFamily: 'DM Mono', fontSize: 11 }}
              tickFormatter={v => `$${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" fill="#C1440E" radius={0} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-64 flex items-center justify-center text-camel-tobacco opacity-50">
          <p className="font-body italic">No spending data yet</p>
        </div>
      )}
    </PaperCard>
  )
}
