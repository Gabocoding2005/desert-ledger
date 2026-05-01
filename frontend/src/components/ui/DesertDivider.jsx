export default function DesertDivider({ height = 34, className = '' }) {
  return (
    <svg
      viewBox="0 0 400 40"
      width="100%"
      height={height}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
      style={{ display: 'block', margin: '16px 0' }}
    >
      <path d="M0 38 Q200 -12 400 38" stroke="var(--ink)" strokeWidth="1.2" fill="none" />
      <path d="M0 38 Q200 6 400 38" stroke="var(--terracotta)" strokeWidth="1.2" fill="none" />
      <path d="M0 38 Q200 22 400 38" stroke="var(--ochre)" strokeWidth="1.2" fill="none" />
    </svg>
  )
}
