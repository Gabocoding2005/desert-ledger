import clsx from 'clsx'

export default function CamelBadge({ children, variant = 'default', icon = null, className = '' }) {
  const variants = {
    default: 'bg-camel-sand    text-camel-charcoal border-camel-tobacco',
    streak:  'bg-streak-color  text-white           border-camel-tobacco',
    income:  'bg-income-color  text-white           border-camel-sage',
    expense: 'bg-expense-color text-white           border-camel-rust',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 border-2',
        'font-display font-bold text-xs uppercase tracking-wider',
        variants[variant],
        className
      )}
      style={{ borderRadius: 'var(--radius-sm)' }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </span>
  )
}
