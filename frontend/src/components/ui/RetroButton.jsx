import clsx from 'clsx'

export default function RetroButton({
  children,
  variant  = 'primary',
  size     = 'md',
  onClick,
  disabled = false,
  className = '',
  type     = 'button',
  ...props
}) {
  const variants = {
    primary:   'bg-camel-sand   border-camel-tobacco text-camel-charcoal',
    secondary: 'bg-camel-cream  border-camel-tobacco text-camel-charcoal',
    danger:    'bg-camel-rust   border-camel-tobacco text-white',
    success:   'bg-income-color border-camel-tobacco text-white',
  }

  const sizes = {
    sm: 'text-xs  px-3 py-1.5',
    md: 'text-sm  px-4 py-2',
    lg: 'text-base px-6 py-3',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'retro-button font-display font-bold uppercase tracking-wider transition-all',
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
