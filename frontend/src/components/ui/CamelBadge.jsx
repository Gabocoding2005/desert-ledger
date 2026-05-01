export default function CamelBadge({ children, variant = 'default', icon = null, className = '', mono = false }) {
  const variants = {
    default: { bg: 'transparent',       fg: 'var(--ink)',   bd: 'var(--ink)' },
    streak:  { bg: 'var(--ochre)',       fg: 'var(--ink)',   bd: 'var(--ink)' },
    income:  { bg: 'var(--olive)',       fg: 'var(--bone)',  bd: 'var(--olive)' },
    expense: { bg: 'var(--terracotta)',  fg: 'var(--bone)',  bd: 'var(--terracotta)' },
  }
  const t = variants[variant] || variants.default

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 10px',
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.bd}`,
        borderRadius: 999,
        fontSize: 11.5,
        fontWeight: 500,
        letterSpacing: mono ? 0 : '0.04em',
        textTransform: mono ? 'none' : 'uppercase',
        whiteSpace: 'nowrap',
        fontFamily: mono ? 'var(--f-mono)' : 'var(--f-grot)',
      }}
      className={className}
    >
      {icon && <span>{icon}</span>}
      {children}
    </span>
  )
}
