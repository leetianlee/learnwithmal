export default function Button({ children, onClick, variant = 'primary', disabled = false, className = '', size = 'lg' }) {
  const baseClasses = 'rounded-2xl font-semibold transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-base min-h-[40px]',
    md: 'px-5 py-3 text-lg min-h-[48px]',
    lg: 'px-6 py-4 text-xl min-h-[64px]',
  }
  
  const variantClasses = {
    primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] focus:ring-[var(--color-primary)]',
    secondary: 'bg-[var(--color-card)] text-[var(--color-text)] border-2 border-[var(--color-disabled)] hover:border-[var(--color-primary)] focus:ring-[var(--color-primary)]',
    correct: 'bg-[var(--color-correct)] text-white',
    incorrect: 'bg-[var(--color-incorrect)] text-white',
    ghost: 'bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-bg-hover)]',
    disabled: 'bg-[var(--color-disabled)] text-gray-500 cursor-not-allowed',
  }

  const classes = `${baseClasses} ${sizeClasses[size]} ${disabled ? variantClasses.disabled : variantClasses[variant]} ${className}`

  return (
    <button className={classes} onClick={disabled ? undefined : onClick} disabled={disabled}>
      {children}
    </button>
  )
}
