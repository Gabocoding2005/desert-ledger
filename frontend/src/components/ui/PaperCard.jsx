import clsx from 'clsx'

export default function PaperCard({ children, className = '', noPadding = false, ...props }) {
  return (
    <div
      className={clsx(
        'burned-card',
        !noPadding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
