export function ChickenRice({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      {/* Plate */}
      <ellipse cx="40" cy="55" rx="35" ry="15" fill="#F5F5DC" stroke="#CCC" strokeWidth="1" />
      {/* Rice */}
      <ellipse cx="35" cy="48" rx="18" ry="10" fill="#FFFDE7" />
      {/* Chicken */}
      <ellipse cx="52" cy="42" rx="14" ry="8" fill="#E8A838" />
      <ellipse cx="52" cy="42" rx="10" ry="5" fill="#D4943C" />
      {/* Cucumber */}
      <circle cx="25" cy="50" r="3" fill="#66BB6A" />
      <circle cx="30" cy="52" r="3" fill="#66BB6A" />
    </svg>
  )
}

export function Kopi({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      {/* Cup */}
      <path d="M 25 30 L 28 60 L 52 60 L 55 30 Z" fill="#F5F5DC" stroke="#CCC" strokeWidth="1" />
      {/* Coffee */}
      <path d="M 27 35 L 29 55 L 51 55 L 53 35 Z" fill="#5D4037" />
      {/* Handle */}
      <path d="M 55 35 Q 65 40 60 50 Q 55 52 55 48" fill="none" stroke="#CCC" strokeWidth="2" />
      {/* Steam */}
      <path d="M 35 25 Q 37 20 35 15" fill="none" stroke="#CCC" strokeWidth="1.5" opacity="0.5" />
      <path d="M 42 25 Q 44 18 42 12" fill="none" stroke="#CCC" strokeWidth="1.5" opacity="0.5" />
    </svg>
  )
}

export function NasiLemak({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      {/* Plate */}
      <ellipse cx="40" cy="55" rx="35" ry="15" fill="#F5F5DC" stroke="#CCC" strokeWidth="1" />
      {/* Rice (wrapped) */}
      <path d="M 30 50 Q 40 25 50 50" fill="#FFFDE7" stroke="#66BB6A" strokeWidth="1" />
      {/* Egg */}
      <ellipse cx="55" cy="48" rx="8" ry="6" fill="#FFF9C4" stroke="#FDD835" strokeWidth="1" />
      {/* Sambal */}
      <circle cx="25" cy="50" r="5" fill="#D32F2F" opacity="0.7" />
    </svg>
  )
}

export function Milo({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      {/* Glass */}
      <path d="M 28 20 L 30 65 L 50 65 L 52 20 Z" fill="rgba(255,255,255,0.3)" stroke="#CCC" strokeWidth="1" />
      {/* Drink */}
      <path d="M 29 25 L 31 62 L 49 62 L 51 25 Z" fill="#5D4037" opacity="0.8" />
      {/* Ice */}
      <rect x="34" y="30" width="8" height="6" rx="2" fill="rgba(255,255,255,0.5)" />
      <rect x="37" y="40" width="7" height="5" rx="2" fill="rgba(255,255,255,0.5)" />
    </svg>
  )
}

export const FOOD_COMPONENTS = {
  'chicken-rice': ChickenRice,
  'kopi': Kopi,
  'nasi-lemak': NasiLemak,
  'milo': Milo,
}
