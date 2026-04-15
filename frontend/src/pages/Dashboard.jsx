import { useState, useEffect } from 'react'
import BalanceBanner from '../components/finance/BalanceBanner'
import SpendingChart from '../components/finance/SpendingChart'
import HabitSummaryCard from '../components/habits/HabitSummaryCard'
import TransactionRow from '../components/finance/TransactionRow'
import PaperCard from '../components/ui/PaperCard'
import DesertDivider from '../components/ui/DesertDivider'
import { dashboardApi } from '../api/client'
import { useFinanceStore } from '../stores/useFinanceStore'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [habitsSummary, setHabitsSummary] = useState([])
  const [loading, setLoading] = useState(true)

  const { transactions, fetchTransactions } = useFinanceStore()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const now = new Date()
      const params = { month: now.getMonth() + 1, year: now.getFullYear() }

      const [summaryRes, habitsRes] = await Promise.all([
        dashboardApi.getSummary(params),
        dashboardApi.getHabits(),
      ])

      setSummary(summaryRes.data)
      setHabitsSummary(habitsRes.data)

      // Fetch recent transactions
      await fetchTransactions(params)
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="font-display text-2xl text-camel-tobacco">Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Balance Banner */}
      {summary && (
        <BalanceBanner
          balance={summary.balance}
          income={summary.income}
          expenses={summary.expenses}
        />
      )}

      {/* Charts and Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SpendingChart data={summary?.top_categories || []} />
        <HabitSummaryCard habits={habitsSummary} />
      </div>

      <DesertDivider />

      {/* Recent Transactions */}
      <PaperCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-2xl text-camel-tobacco uppercase">
            Recent Transactions
          </h3>
        </div>

        {transactions && transactions.length > 0 ? (
          <div className="space-y-1">
            {transactions.slice(0, 10).map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="font-body text-camel-tobacco opacity-50 italic">
              No transactions yet. Start tracking your finances!
            </p>
          </div>
        )}
      </PaperCard>
    </div>
  )
}
