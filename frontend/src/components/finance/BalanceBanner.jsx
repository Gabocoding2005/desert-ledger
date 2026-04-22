import { formatCurrency } from '../../utils/currency'

export default function BalanceBanner({ balance, income, expenses }) {
  return (
    <div className="stamp-border p-8 mb-6 bg-gradient-to-br from-camel-sand to-camel-tobacco">
      <div className="text-center">
        <p className="font-display text-sm uppercase tracking-widest text-camel-cream mb-3"
          style={{ letterSpacing: '0.2em' }}>
          This Month's Balance
        </p>
        <h3
          className="mb-6 text-camel-charcoal"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 'clamp(40px, 8vw, 72px)',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.02em',
          }}
        >
          {formatCurrency(balance)}
        </h3>

        <div className="flex justify-center items-center gap-8">
          <div className="text-center">
            <p className="text-xs mb-1 font-body text-camel-cream">Income</p>
            <p className="font-display font-bold text-xl text-income-color mono-number">
              ▲ {formatCurrency(income)}
            </p>
          </div>

          <div className="w-px h-12 bg-camel-cream opacity-40" />

          <div className="text-center">
            <p className="text-xs mb-1 font-body text-camel-cream">Spent</p>
            <p className="font-display font-bold text-xl text-expense-color mono-number">
              ▼ {formatCurrency(expenses)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
