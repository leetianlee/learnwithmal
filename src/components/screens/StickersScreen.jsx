import { useNavigate } from 'react-router-dom'
import { useProgress } from '../../context/ProgressContext'
import { computeStickers, GROUP_LABELS, GROUP_ORDER } from '../../data/stickers'

function StickerItem({ sticker }) {
  if (!sticker.earned) {
    return (
      <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[var(--color-bg)] aspect-square">
        <span className="text-3xl grayscale opacity-30">❓</span>
        <span className="text-xs text-[var(--color-disabled)] mt-1 text-center font-semibold leading-tight line-clamp-2">
          {sticker.description}
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white shadow-card aspect-square animate-scale-in">
      <span className="text-4xl">{sticker.sticker}</span>
      <span className="text-xs text-[var(--color-text)] mt-1.5 text-center font-bold leading-tight line-clamp-2">
        {sticker.name}
      </span>
    </div>
  )
}

export default function StickersScreen() {
  const navigate = useNavigate()
  const { progress, sessions } = useProgress()
  const stickers = computeStickers(progress, sessions)

  const earnedCount = stickers.filter(s => s.earned).length
  const totalCount = stickers.length

  // Group stickers
  const grouped = {}
  for (const s of stickers) {
    if (!grouped[s.group]) grouped[s.group] = []
    grouped[s.group].push(s)
  }

  return (
    <div className="min-h-screen flex flex-col p-5 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pt-2">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center text-sm font-bold text-[var(--color-text-light)] hover:bg-[var(--color-bg)] active:scale-95 transition-all flex-shrink-0"
          aria-label="Back to home"
        >
          ←
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-[var(--color-text)]">My Stickers</h1>
        </div>
        <div className="bg-[var(--color-incorrect-light)] px-3 py-1.5 rounded-full flex-shrink-0">
          <span className="text-sm font-extrabold text-[var(--color-incorrect)]">
            {earnedCount} / {totalCount}
          </span>
        </div>
      </div>

      {/* Sticker showcase — big display of earned stickers */}
      {earnedCount > 0 && (
        <div className="bg-white rounded-2xl shadow-card p-5 mb-6">
          <h2 className="text-sm font-extrabold text-[var(--color-text-light)] mb-3 text-center">
            Your Collection
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {stickers
              .filter(s => s.earned)
              .map(s => (
                <span key={s.id} className="text-3xl" title={s.name}>
                  {s.sticker}
                </span>
              ))
            }
          </div>
        </div>
      )}

      {earnedCount === 0 && (
        <div className="bg-white rounded-2xl shadow-card p-6 mb-6 text-center">
          <span className="text-4xl mb-3 block">🎁</span>
          <p className="text-base font-bold text-[var(--color-text)] mb-1">Collect stickers!</p>
          <p className="text-sm text-[var(--color-text-light)]">
            Practice to earn fun stickers. They stay forever!
          </p>
        </div>
      )}

      {/* Groups */}
      {GROUP_ORDER.map(group => {
        const items = grouped[group]
        if (!items || items.length === 0) return null
        const earnedInGroup = items.filter(s => s.earned).length

        return (
          <div key={group} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-extrabold text-[var(--color-text)]">
                {GROUP_LABELS[group]}
              </h2>
              <span className="text-xs font-bold text-[var(--color-text-light)]">
                {earnedInGroup} / {items.length}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {/* Show earned first, then locked */}
              {items
                .sort((a, b) => (b.earned ? 1 : 0) - (a.earned ? 1 : 0))
                .map(s => (
                  <StickerItem key={s.id} sticker={s} />
                ))
              }
            </div>
          </div>
        )
      })}

      {/* Back button */}
      <div className="mt-auto pt-4 pb-4">
        <button
          onClick={() => navigate('/')}
          className="w-full rounded-2xl bg-white shadow-card hover:shadow-card-hover active:scale-[0.98] transition-all p-3 text-center text-sm font-bold text-[var(--color-text-light)]"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}
