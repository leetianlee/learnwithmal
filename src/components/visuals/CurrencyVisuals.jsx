export function Coin({ denomination, size = 70 }) {
  const colors = {
    '5': { bg: '#C9A96E', text: '#5C4A28' },
    '10': { bg: '#C9A96E', text: '#5C4A28' },
    '20': { bg: '#C9A96E', text: '#5C4A28' },
    '50': { bg: '#DAA520', text: '#5C3A00' },
    '100': { bg: '#FFD700', text: '#5C3A00' },
  }
  const c = colors[String(denomination)] || colors['100']
  const label = denomination >= 100 ? `$${denomination / 100}` : `${denomination}¢`
  const r = size / 2

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={r} cy={r} r={r - 2} fill={c.bg} stroke={c.text} strokeWidth="2" />
      <circle cx={r} cy={r} r={r - 6} fill="none" stroke={c.text} strokeWidth="1" opacity="0.3" />
      <text x={r} y={r + 1} textAnchor="middle" dominantBaseline="central"
        fontSize={size * 0.28} fontWeight="bold" fill={c.text} fontFamily="system-ui">
        {label}
      </text>
    </svg>
  )
}

export function Note({ denomination, size = 100 }) {
  const colors = {
    '2': { bg: '#6B3FA0', text: '#FFF' },
    '5': { bg: '#2E7D32', text: '#FFF' },
    '10': { bg: '#D32F2F', text: '#FFF' },
    '50': { bg: '#1565C0', text: '#FFF' },
  }
  const c = colors[String(denomination)] || colors['2']
  const w = size
  const h = size * 0.55

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x="2" y="2" width={w - 4} height={h - 4} rx="4" fill={c.bg} stroke={c.text} strokeWidth="1" opacity="0.9" />
      <rect x="6" y="6" width={w - 12} height={h - 12} rx="2" fill="none" stroke={c.text} strokeWidth="0.5" opacity="0.3" />
      <text x={w / 2} y={h / 2 + 1} textAnchor="middle" dominantBaseline="central"
        fontSize={h * 0.45} fontWeight="bold" fill={c.text} fontFamily="system-ui">
        ${denomination}
      </text>
    </svg>
  )
}

export function CurrencyDisplay({ type, denomination, size }) {
  if (type === 'coin') return <Coin denomination={denomination} size={size} />
  if (type === 'note') return <Note denomination={denomination} size={size} />
  return null
}
