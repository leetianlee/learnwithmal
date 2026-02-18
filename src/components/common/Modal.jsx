export default function Modal({ isOpen, onClose, children, title }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div 
        className="relative bg-[var(--color-card)] rounded-3xl shadow-lg p-8 max-w-md w-full animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {title && <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  )
}
