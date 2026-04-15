import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import PaperCard from '../ui/PaperCard'
import { formatCurrency } from '../../utils/currency'

export default function SpendingChart({ data }) {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-camel-cream p-3 border-2 border-camel-tobacco rounded-sm shadow-lg">
          <p className="font-display font-bold text-camel-charcoal">
            {payload[0].payload.name}
          </p>
          <p className="font-mono text-expense-color">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <PaperCard>
      <h3 className="font-display font-bold text-2xl text-camel-tobacco mb-4 uppercase">
        Spending by Category
      </h3>

      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8D5B7" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#2D2D2D', fontFamily: 'Source Serif 4' }}
            />
            <YAxis
              tick={{ fill: '#2D2D2D', fontFamily: 'DM Mono' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" fill="#C1440E" radius={[4, 4, 0, 0]} />
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
