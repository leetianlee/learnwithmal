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
  { bg: '#E8F6F7', border: '#4AABB3', letter: '#4AABB3' },
  { bg: '#F0E6F6', border: '#9B59B6', letter: '#9B59B6' },
  { bg: '#FDF3E4', border: '#E8A838', letter: '#E8A838' },
  { bg: '#E8F5EB', border: '#6BBF7B', letter: '#6BBF7B' },
]

export default function FillInBlankQuestion({ question, onAnswer, feedback }) {
  const [selected, setSelected] = useState(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const shuffledOptions = useMemo(() => shuffleArray(question.options), [question.id])

  const handleSelect = (option) => {
    if (feedback) return
    setSelected(option)
    onAnswer(option)
  }

  const getOptionStyle = (option, index) => {
    const color = OPTION_COLORS[index % OPTION_COLORS.length]

    if (!feedback) {
      return {
        className: option === selected ? '' : 'hover:scale-[1.01] active:scale-[0.98] cursor-pointer',
        bg: option === selected ? color.bg : 'white',
        border: option === selected ? `2px solid ${color.border}` : `2px solid ${color.border}30`,
        letterBg: option === selected ? color.border : color.bg,
        letterColor: option === selected ? 'white' : color.letter,
      }
    }

    if (option === question.correctAnswer) {
      return {
        className: '',
        bg: 'var(--color-correct-light)',
        border: '2px solid var(--color-correct)',
        letterBg: 'var(--color-correct)',
        letterColor: 'white',
      }
    }

    if (option === selected) {
      return {
        className: '',
        bg: 'var(--color-incorrect-light)',
        border: '2px solid var(--color-incorrect)',
        letterBg: 'var(--color-incorrect)',
        letterColor: 'white',
      }
    }

    return {
      className: 'opacity-40',
      bg: 'white',
      border: '2px solid var(--color-disabled)',
      letterBg: '#f0f0f0',
      letterColor: 'var(--color-disabled)',
    }
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3">
        {shuffledOptions.map((option, i) => {
          const style = getOptionStyle(option, i)
          return (
            <button
              key={`${option}-${i}`}
              onClick={() => handleSelect(option)}
              disabled={!!feedback}
              className={`flex items-center gap-3 py-3.5 px-3 rounded-xl text-base font-semibold transition-all duration-200 ${style.className}`}
              style={{
                background: style.bg,
                border: style.border,
              }}
            >
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0 transition-colors duration-200"
                style={{
                  background: style.letterBg,
                  color: style.letterColor,
                }}
              >
                {OPTION_LETTERS[i]}
              </span>
              <span className="text-left flex-1">{option}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
