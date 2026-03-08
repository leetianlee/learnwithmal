import { useState, useMemo } from 'react'

/** Fisher-Yates shuffle (returns a new array) */
function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function OrderingQuestion({ question, onAnswer, feedback }) {
  // Shuffle words once per question
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const shuffled = useMemo(() => shuffleArray(question.words), [question.id])

  const [selectedWords, setSelectedWords] = useState([])
  const [availableWords, setAvailableWords] = useState(shuffled)

  const allPlaced = selectedWords.length === question.words.length

  const handleTapAvailable = (word, index) => {
    if (feedback) return
    setSelectedWords(prev => [...prev, word])
    setAvailableWords(prev => prev.filter((_, i) => i !== index))
  }

  const handleTapSelected = (word, index) => {
    if (feedback) return
    setAvailableWords(prev => [...prev, word])
    setSelectedWords(prev => prev.filter((_, i) => i !== index))
  }

  const handleCheck = () => {
    if (feedback || !allPlaced) return
    const sentence = selectedWords.join(' ')
    onAnswer(sentence)
  }

  // Determine tile styling based on feedback state
  const getSentenceTileStyle = (word, index) => {
    if (!feedback) {
      return {
        bg: 'var(--color-primary-light)',
        border: '2px solid var(--color-primary)',
        color: 'var(--color-primary)',
      }
    }

    // After feedback: highlight correct/incorrect positions
    const correctWords = question.correctAnswer.split(' ')
    if (feedback === 'correct') {
      return {
        bg: 'var(--color-correct-light)',
        border: '2px solid var(--color-correct)',
        color: 'var(--color-correct)',
      }
    }

    // Incorrect: show which words are in the right position
    if (index < correctWords.length && word === correctWords[index]) {
      return {
        bg: 'var(--color-correct-light)',
        border: '2px solid var(--color-correct)',
        color: 'var(--color-correct)',
      }
    }
    return {
      bg: 'var(--color-incorrect-light)',
      border: '2px solid var(--color-incorrect)',
      color: 'var(--color-incorrect)',
    }
  }

  return (
    <div className="w-full">
      {/* Sentence building area */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-[var(--color-text-light)] mb-2 uppercase tracking-wide">
          Your sentence:
        </p>
        <div
          className="min-h-[56px] rounded-2xl p-3 flex flex-wrap gap-2 items-center transition-all"
          style={{
            background: selectedWords.length > 0 ? 'white' : 'var(--color-bg)',
            border: selectedWords.length > 0
              ? '2px dashed var(--color-primary)'
              : '2px dashed var(--color-disabled)',
          }}
        >
          {selectedWords.length === 0 ? (
            <span className="text-sm text-[var(--color-disabled)] font-medium italic px-1">
              Tap the words below in order...
            </span>
          ) : (
            selectedWords.map((word, i) => {
              const style = getSentenceTileStyle(word, i)
              return (
                <button
                  key={`sel-${i}-${word}`}
                  onClick={() => handleTapSelected(word, i)}
                  disabled={!!feedback}
                  className="px-4 py-2 rounded-xl text-base font-bold transition-all active:scale-95"
                  style={{
                    background: style.bg,
                    border: style.border,
                    color: style.color,
                  }}
                >
                  {word}
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Available words */}
      {availableWords.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-[var(--color-text-light)] mb-2 uppercase tracking-wide">
            Available words:
          </p>
          <div className="flex flex-wrap gap-2">
            {availableWords.map((word, i) => (
              <button
                key={`avail-${i}-${word}`}
                onClick={() => handleTapAvailable(word, i)}
                disabled={!!feedback}
                className="px-4 py-2.5 rounded-xl text-base font-bold bg-white transition-all hover:scale-[1.03] active:scale-95"
                style={{
                  border: '2px solid #E0E0E0',
                  color: 'var(--color-text)',
                }}
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Check Answer button — only when all words are placed and no feedback yet */}
      {allPlaced && !feedback && (
        <button
          onClick={handleCheck}
          className="w-full py-3.5 rounded-2xl text-base font-extrabold transition-all active:scale-[0.98] animate-slide-up"
          style={{
            background: 'var(--color-primary)',
            color: 'white',
          }}
        >
          Check Answer
        </button>
      )}
    </div>
  )
}
