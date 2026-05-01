export default function RetroButton({
  children,
  variant  = 'primary',
  size     = 'md',
  onClick,
  disabled = false,
  className = '',
  type     = 'button',
  style    = {},
  ...props
}) {
  const variants = {
    primary:   { bg: 'var(--ink)',         fg: 'var(--bone)',  bd: 'var(--ink)' },
    secondary: { bg: 'transparent',        fg: 'var(--ink)',   bd: 'var(--ink)' },
    danger:    { bg: 'var(--terracotta)',   fg: 'var(--bone)',  bd: 'var(--terracotta)' },
    success:   { bg: 'var(--olive)',        fg: 'var(--bone)',  bd: 'var(--olive)' },
  }
  const sizes = {
    sm: { px: 10, py: 5,  fz: 11.5 },
    md: { px: 16, py: 9,  fz: 12.5 },
    lg: { px: 22, py: 12, fz: 13.5 },
  }
  const t = variants[variant] || variants.primary
  const s = sizes[size] || sizes.md

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.bd}`,
        padding: `${s.py}px ${s.px}px`,
        fontSize: s.fz,
        fontFamily: 'var(--f-grot)',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        borderRadius: 999,
        whiteSpace: 'nowrap',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'transform 120ms',
        ...style,
      }}
      className={className}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = 'translateY(1px)' }}
      onMouseUp={e => { e.currentTarget.style.transform = '' }}
      onMouseLeave={e => { e.currentTarget.style.transform = '' }}
      {...props}
    >
      {children}
    </button>
  )
}
