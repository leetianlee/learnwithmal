export default function Card({ children, className = '', onClick }) {
  return (
    <div 
      className={`bg-[var(--color-card)] rounded-2xl shadow-sm p-6 ${onClick ? 'cursor-pointer hover:shadow-md active:scale-[0.98] transition-all' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
