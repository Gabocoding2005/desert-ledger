import { formatCurrency } from '../../utils/currency'

export default function BalanceBanner({ balance, income, expenses }) {
  return (
    <div className="stamp-border bg-gradient-to-br from-camel-sand to-camel-tobacco p-8 mb-6">
      <div className="text-center">
        <h3 className="font-display font-black text-5xl md:text-7xl text-camel-charcoal mb-4 mono-number">
          {formatCurrency(balance)}
        </h3>
        <p className="font-display text-xl text-camel-cream uppercase tracking-widest mb-6">
          This Month's Balance
        </p>

        <div className="flex justify-center gap-8">
          <div className="text-center">
            <p className="text-camel-cream text-sm mb-1 font-body">Income</p>
            <p className="font-display font-bold text-2xl text-income-color mono-number">
              ▲ {formatCurrency(income)}
            </p>
          </div>

          <div className="h-16 w-px bg-camel-cream opacity-50"></div>

          <div className="text-center">
            <p className="text-camel-cream text-sm mb-1 font-body">Spent</p>
            <p className="font-display font-bold text-2xl text-expense-color mono-number">
              ▼ {formatCurrency(expenses)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
