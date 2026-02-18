export default function ProgressDots({ total, current, answers }) {
  return (
    <div className="flex justify-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => {
        let color = 'bg-[var(--color-disabled)]'
        if (i < answers.length) {
          color = answers[i].correct ? 'bg-[var(--color-correct)]' : 'bg-[var(--color-incorrect)]'
        } else if (i === current) {
          color = 'bg-[var(--color-primary)]'
        }
        return (
          <div key={i} className={`w-3 h-3 rounded-full transition-colors duration-300 ${color}`} />
        )
      })}
    </div>
  )
}
