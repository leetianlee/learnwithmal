/**
 * SpeakerIndicator — shows who is speaking in pronoun questions.
 * Three modes:
 *   "malcolm"  — Malcolm is speaking (teal)
 *   "other"    — Someone else is speaking to Malcolm (purple)
 *   "narrator" — Describing a third person (amber)
 */
export default function SpeakerIndicator({ speaker = 'malcolm', speakerLabel = null }) {
  const configs = {
    malcolm: {
      bg: 'var(--color-primary-light, #E8F6F7)',
      border: 'var(--color-primary, #4AABB3)',
      textColor: 'var(--color-primary, #4AABB3)',
      icon: '🗣️',
      label: 'You (Malcolm) say:',
    },
    other: {
      bg: '#F0E6F6',
      border: '#9B59B6',
      textColor: '#7D3C98',
      icon: '👤',
      label: speakerLabel ? `${speakerLabel} asks you:` : 'Someone asks you:',
    },
    narrator: {
      bg: '#FDF3E4',
      border: '#E8A838',
      textColor: '#B8860B',
      icon: '👀',
      label: 'You are describing someone:',
    },
  }

  const config = configs[speaker] || configs.malcolm

  return (
    <div
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1"
      style={{
        background: config.bg,
        border: `2px solid ${config.border}`,
      }}
    >
      {/* Icon */}
      <span className="text-2xl flex-shrink-0" role="img" aria-hidden="true">
        {config.icon}
      </span>

      {/* Label */}
      <span
        className="text-sm font-bold"
        style={{ color: config.textColor }}
      >
        {config.label}
      </span>

      {/* Direction arrow for "other" — shows speech going toward Malcolm */}
      {speaker === 'other' && (
        <span className="ml-auto flex items-center gap-1 flex-shrink-0">
          <span className="text-xs font-semibold" style={{ color: config.textColor }}>→</span>
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{
              background: 'var(--color-primary-light, #E8F6F7)',
              color: 'var(--color-primary, #4AABB3)',
              border: '2px solid var(--color-primary, #4AABB3)',
            }}
          >
            M
          </span>
        </span>
      )}
    </div>
  )
}
