import { useState, useEffect } from 'react'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { api } from '../api/client'
import PaperCard from '../components/ui/PaperCard'
import { getMonthName } from '../utils/dates'
import { formatCurrency } from '../utils/currency'

const MONTH_ABR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const tooltipStyle = {
  contentStyle: {
    background: '#FBF4E0',
    border: '1px solid #2A1F14',
    borderRadius: 2,
    fontFamily: 'Familjen Grotesk',
  },
}

export default function Reports() {
  const now = new Date()
  const [month,         setMonth]         = useState(now.getMonth() + 1)
  const [year,          setYear]          = useState(now.getFullYear())
  const [summary,       setSummary]       = useState(null)
  const [trends,        setTrends]        = useState([])
  const [habitsSummary, setHabitsSummary] = useState([])
  const [loading,       setLoading]       = useState(true)
  const [exporting,     setExporting]     = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get('/dashboard/summary', { month, year }).catch(() => null),
      api.get('/dashboard/trends').catch(() => []),
      api.get('/dashboard/habits').catch(() => []),
    ]).then(([sum, tr, hab]) => {
      setSummary(sum)
      setTrends((tr || []).map(t => ({ ...t, label: `${MONTH_ABR[t.month - 1]} ${t.year}` })))
      setHabitsSummary(hab || [])
    }).finally(() => setLoading(false))
  }, [month, year])

  const handleExportObsidian = async () => {
    const vaultPath = localStorage.getItem('obsidian_vault_path')
    if (!vaultPath) {
      alert('Primero configura tu vault de Obsidian en Settings ⚙️')
      return
    }
    setExporting(true)
    try {
      const res = await api.post('/obsidian/export-report', { vault_path: vaultPath, month, year })
      alert(`✅ Exportado a:\n${res.path}`)
    } catch {
      alert('❌ Error al exportar. Verifica que la ruta del vault sea correcta.')
    } finally {
      setExporting(false)
    }
  }

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }
  const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear()

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <PaperCard className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-2xl text-camel-tobacco uppercase">Reporte Mensual</h2>
            <p className="text-sm font-body text-camel-charcoal mt-1">Finanzas y hábitos</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportObsidian}
              disabled={exporting}
              className="retro-button px-3 py-2 text-sm disabled:opacity-40"
              title="Exportar a Obsidian"
            >
              {exporting ? '...' : '🟣 Exportar'}
            </button>
            <button onClick={prevMonth} className="retro-button px-3 py-1 text-sm">←</button>
            <span className="font-display font-bold text-xl text-camel-tobacco min-w-[160px] text-center">
              {getMonthName(month)} {year}
            </span>
            <button
              onClick={nextMonth}
              disabled={isCurrentMonth}
              className="retro-button px-3 py-1 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        </div>
      </PaperCard>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="font-display text-2xl text-camel-tobacco">Cargando...</p>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          {summary && (
            <div className="grid grid-cols-3 gap-6 mb-6">
              {[
                { label: 'Ingresos',  value: summary.income,   color: 'text-income-color' },
                { label: 'Gastos',    value: summary.expenses, color: 'text-expense-color' },
                { label: 'Balance',   value: summary.balance,  color: summary.balance >= 0 ? 'text-income-color' : 'text-expense-color' },
              ].map(({ label, value, color }) => (
                <PaperCard key={label}>
                  <p className="dl-eyebrow mb-2">{label}</p>
                  <p className={`font-display font-black text-4xl mono-number ${color}`}>
                    {formatCurrency(value)}
                  </p>
                </PaperCard>
              ))}
            </div>
          )}

          {/* Trends line chart */}
          {trends.length > 0 && (
            <PaperCard className="mb-6">
              <h3 className="font-display font-bold text-2xl text-camel-tobacco mb-4 uppercase">
                Tendencia de Gastos — Últimos 6 Meses
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={trends} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8D5B7" />
                  <XAxis dataKey="label" tick={{ fill: '#2A1F14', fontFamily: 'Familjen Grotesk', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#8B7150', fontFamily: 'JetBrains Mono', fontSize: 11 }} tickFormatter={v => `$${v}`} />
                  <Tooltip {...tooltipStyle} formatter={v => [formatCurrency(v), 'Gastos']} />
                  <Line
                    type="monotone" dataKey="total"
                    stroke="#C45A2C" strokeWidth={2}
                    dot={{ fill: '#C45A2C', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </PaperCard>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top categories */}
            {summary?.top_categories?.length > 0 && (
              <PaperCard>
                <h3 className="font-display font-bold text-2xl text-camel-tobacco mb-4 uppercase">
                  Top Categorías
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={summary.top_categories} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8D5B7" />
                    <XAxis dataKey="name" tick={{ fill: '#2A1F14', fontFamily: 'Familjen Grotesk', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#8B7150', fontFamily: 'JetBrains Mono', fontSize: 10 }} tickFormatter={v => `$${v}`} />
                    <Tooltip {...tooltipStyle} formatter={v => [formatCurrency(v), 'Gastado']} />
                    <Bar dataKey="total" fill="#C45A2C" radius={0} />
                  </BarChart>
                </ResponsiveContainer>
              </PaperCard>
            )}

            {/* Habit completion */}
            {habitsSummary.length > 0 && (
              <PaperCard>
                <h3 className="font-display font-bold text-2xl text-camel-tobacco mb-4 uppercase">
                  Hábitos del Mes
                </h3>
                <div className="space-y-4">
                  {habitsSummary.map(habit => (
                    <div key={habit.id}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }} />
                          <span className="font-body text-sm text-camel-charcoal">{habit.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {habit.streak > 0 && (
                            <span className="text-xs font-mono text-camel-sand">🔥 {habit.streak}d</span>
                          )}
                          <span className="font-mono text-sm text-camel-tobacco">{habit.completion_rate}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-camel-dust h-2" style={{ borderRadius: 'var(--radius-sm)' }}>
                        <div
                          className="h-2 transition-all duration-500"
                          style={{
                            width: `${habit.completion_rate}%`,
                            backgroundColor: habit.color,
                            borderRadius: 'var(--radius-sm)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </PaperCard>
            )}
          </div>

          {/* Empty state */}
          {summary && summary.income === 0 && summary.expenses === 0 && (
            <PaperCard className="mt-6">
              <div className="py-8 text-center">
                <p className="font-body text-camel-tobacco opacity-50 italic">
                  No hay datos para {getMonthName(month)} {year}.
                </p>
              </div>
            </PaperCard>
          )}
        </>
      )}
    </div>
  )
}
