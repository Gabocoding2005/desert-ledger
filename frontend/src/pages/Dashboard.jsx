import BalanceBanner from '../components/finance/BalanceBanner'
import SpendingChart from '../components/finance/SpendingChart'
import HabitSummaryCard from '../components/habits/HabitSummaryCard'
import TransactionRow from '../components/finance/TransactionRow'
import PaperCard from '../components/ui/PaperCard'
import DesertDivider from '../components/ui/DesertDivider'

export default function Dashboard({ summary, transactions, habitsSummary }) {
  if (!summary) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="font-display text-2xl text-camel-tobacco">Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <BalanceBanner
        balance={summary.balance}
        income={summary.income}
        expenses={summary.expenses}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SpendingChart data={summary.top_categories || []} />
        <HabitSummaryCard habits={habitsSummary} />
      </div>

      <DesertDivider />

      <PaperCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-2xl text-camel-tobacco uppercase">
            Recent Transactions
          </h3>
        </div>

        {transactions.length > 0 ? (
          <div className="space-y-1">
            {transactions.slice(0, 10).map((tx) => (
              <TransactionRow key={tx.id} transaction={tx} />
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
