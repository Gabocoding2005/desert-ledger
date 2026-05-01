export default function PaperCard({ children, className = '', noPadding = false, style = {}, ...props }) {
  return (
    <div
      style={{
        background: 'var(--bone)',
        border: '1px solid var(--ink)',
        padding: noPadding ? 0 : 24,
        position: 'relative',
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  )
}
