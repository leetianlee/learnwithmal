import { useState, useMemo } from 'react'

const OPTION_LETTERS = ['A', 'B', 'C', 'D']

/** Fisher-Yates shuffle (returns a new array) */
function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const OPTION_COLORS = [
  { bg: '#E8F6F7', border: '#4AABB3', letter: '#4AABB3' },  // teal
  { bg: '#F0E6F6', border: '#9B59B6', letter: '#9B59B6' },  // purple
  { bg: '#FDF3E4', border: '#E8A838', letter: '#E8A838' },  // amber
  { bg: '#E8F5EB', border: '#6BBF7B', letter: '#6BBF7B' },  // green
]

export default function MultipleChoiceQuestion({ question, onAnswer, feedback, showHint }) {
  const [selected, setSelected] = useState(null)

  const handleSelect = (option) => {
    if (feedback) return
    setSelected(option)
    onAnswer(option)
  }

  const getOptionStyle = (option, index) => {
    const color = OPTION_COLORS[index % OPTION_COLORS.length]

    if (!feedback) {
      return {
        className: 'hover:scale-[1.01] active:scale-[0.98] cursor-pointer',
        bg: 'white',
        border: `2px solid ${color.border}25`,
        letterBg: color.bg,
        letterColor: color.letter,
        hoverBorder: color.border,
      }
    }

    if (option === question.correctAnswer) {
      return {
        className: 'ring-2 ring-[var(--color-correct)] ring-offset-1',
        bg: 'var(--color-correct-light)',
        border: '2px solid var(--color-correct)',
        letterBg: 'var(--color-correct)',
        letterColor: 'white',
      }
    }

    if (option === selected && feedback === 'incorrect') {
      return {
        className: '',
        bg: 'var(--color-incorrect-light)',
        border: '2px solid var(--color-incorrect)',
        letterBg: 'var(--color-incorrect)',
        letterColor: 'white',
      }
    }

    return {
      className: 'opacity-35',
      bg: 'white',
      border: '2px solid var(--color-disabled)',
      letterBg: '#f0f0f0',
      letterColor: 'var(--color-disabled)',
    }
  }

  // Shuffle options once per question so the correct answer isn't always B/C
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const options = useMemo(() => shuffleArray(question.options), [question.id])

  return (
    <div className="grid grid-cols-1 gap-3 w-full">
      {options.map((option, i) => {
        const style = getOptionStyle(option, i)
        return (
          <button
            key={`${option}-${i}`}
            onClick={() => handleSelect(option)}
            disabled={!!feedback}
            className={`w-full flex items-center gap-4 py-4 px-5 rounded-2xl text-base font-semibold transition-all duration-200 ${style.className}`}
            style={{
              background: style.bg,
              border: style.border,
            }}
            onMouseEnter={(e) => {
              if (!feedback && style.hoverBorder) {
                e.currentTarget.style.borderColor = style.hoverBorder
                e.currentTarget.style.boxShadow = `0 2px 12px ${style.hoverBorder}20`
              }
            }}
            onMouseLeave={(e) => {
              if (!feedback && style.hoverBorder) {
                const color = OPTION_COLORS[i % OPTION_COLORS.length]
                e.currentTarget.style.borderColor = `${color.border}25`
                e.currentTarget.style.boxShadow = 'none'
              }
            }}
          >
            {/* Letter badge */}
            <span
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0 transition-colors duration-200"
              style={{
                background: style.letterBg,
                color: style.letterColor,
              }}
            >
              {OPTION_LETTERS[i]}
            </span>
            {/* Option text */}
            <span className="text-left flex-1">{option}</span>
          </button>
        )
      })}
    </div>
  )
}
