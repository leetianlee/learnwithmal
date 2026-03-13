import { useState, useMemo } from 'react'

const OPTION_LETTERS = ['A', 'B', 'C', 'D']

/** Fisher-Yates shuffle — returns a new array */
function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const OPTION_COLORS = [
  { bg: '#E8F6F7', border: '#4AABB3', letter: '#4AABB3' },
  { bg: '#F0E6F6', border: '#9B59B6', letter: '#9B59B6' },
  { bg: '#FDF3E4', border: '#E8A838', letter: '#E8A838' },
  { bg: '#E8F5EB', border: '#6BBF7B', letter: '#6BBF7B' },
]

export default function MultiSelectQuestion({ question, onAnswer, feedback }) {
  const selectCount = question.selectCount || 2
  const [selected, setSelected] = useState([])

  // Shuffle options once per question
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const options = useMemo(() => shuffleArray(question.options), [question.id])

  const handleSelect = (option) => {
    if (feedback) return
    setSelected(prev => {
      if (prev.includes(option)) {
        // Deselect
        return prev.filter(o => o !== option)
      }
      if (prev.length >= selectCount) {
        // Already at max — do nothing
        return prev
      }
      return [...prev, option]
    })
  }

  const handleCheck = () => {
    if (selected.length !== selectCount || feedback) return
    const sortedSelected = [...selected].sort()
    const sortedCorrect = [...question.correctAnswer].sort()
    const isCorrect = JSON.stringify(sortedSelected) === JSON.stringify(sortedCorrect)
    onAnswer(selected, isCorrect)
  }

  const getOptionStyle = (option, index) => {
    const color = OPTION_COLORS[index % OPTION_COLORS.length]
    const isSelected = selected.includes(option)

    if (!feedback) {
      if (isSelected) {
        return {
          className: 'cursor-pointer',
          bg: color.bg,
          border: `2px solid ${color.border}`,
          letterBg: color.border,
          letterColor: 'white',
          boxShadow: `0 2px 12px ${color.border}30`,
        }
      }
      const atMax = selected.length >= selectCount
      return {
        className: atMax ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01] active:scale-[0.98] cursor-pointer',
        bg: 'white',
        border: `2px solid ${color.border}25`,
        letterBg: color.bg,
        letterColor: color.letter,
        boxShadow: 'none',
      }
    }

    // ── After feedback ──
    const isCorrectOption = question.correctAnswer.includes(option)

    if (isCorrectOption) {
      return {
        className: 'ring-2 ring-[var(--color-correct)] ring-offset-1',
        bg: 'var(--color-correct-light)',
        border: '2px solid var(--color-correct)',
        letterBg: 'var(--color-correct)',
        letterColor: 'white',
        boxShadow: 'none',
      }
    }
    if (isSelected && !isCorrectOption) {
      return {
        className: '',
        bg: 'var(--color-incorrect-light)',
        border: '2px solid var(--color-incorrect)',
        letterBg: 'var(--color-incorrect)',
        letterColor: 'white',
        boxShadow: 'none',
      }
    }
    return {
      className: 'opacity-35',
      bg: 'white',
      border: '2px solid var(--color-disabled)',
      letterBg: '#f0f0f0',
      letterColor: 'var(--color-disabled)',
      boxShadow: 'none',
    }
  }

  const remaining = selectCount - selected.length

  return (
    <div className="w-full">
      {/* Instruction badge */}
      {!feedback && (
        <div className="flex justify-center mb-4">
          <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
            selected.length === selectCount
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
          }`}>
            {selected.length === selectCount
              ? `✓ ${selectCount} selected — tap Check Answer`
              : remaining === selectCount
                ? `Select ${selectCount} answers`
                : `Select ${remaining} more`
            }
          </span>
        </div>
      )}

      {/* Options */}
      <div className="grid grid-cols-1 gap-3 w-full">
        {options.map((option, i) => {
          const style = getOptionStyle(option, i)
          const isDisabledByMax = !feedback && selected.length >= selectCount && !selected.includes(option)
          return (
            <button
              key={`${question.id}-${option}-${i}`}
              onClick={() => handleSelect(option)}
              disabled={!!feedback || isDisabledByMax}
              className={`w-full flex items-center gap-4 py-4 px-5 rounded-2xl text-base font-semibold transition-all duration-200 ${style.className}`}
              style={{
                background: style.bg,
                border: style.border,
                boxShadow: style.boxShadow,
              }}
            >
              {/* Letter badge */}
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0 transition-all duration-200"
                style={{
                  background: style.letterBg,
                  color: style.letterColor,
                }}
              >
                {OPTION_LETTERS[i]}
              </span>
              {/* Option text */}
              <span className="text-left flex-1">{option}</span>
              {/* Selected tick (pre-submit) */}
              {!feedback && selected.includes(option) && (
                <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Check Answer button */}
      {!feedback && (
        <button
          onClick={handleCheck}
          disabled={selected.length !== selectCount}
          className={`w-full mt-4 py-4 rounded-2xl font-extrabold text-base transition-all duration-200 ${
            selected.length === selectCount
              ? 'bg-[var(--color-primary)] text-white shadow-button hover:shadow-button-hover active:scale-[0.98]'
              : 'bg-[var(--color-bg)] text-[var(--color-disabled)] cursor-not-allowed'
          }`}
        >
          {selected.length === selectCount ? 'Check Answer' : `Select ${remaining} more to check`}
        </button>
      )}
    </div>
  )
}
