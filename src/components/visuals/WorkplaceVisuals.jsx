/**
 * WorkplaceVisuals.jsx — Inline SVG illustrations for Workplace Words module.
 * ASD-friendly: simple shapes, calm colors, no visual clutter.
 * Matches the pattern of CurrencyVisuals.jsx, HawkerFood.jsx, ClockFace.jsx.
 */

// ── Hotel Room Items (L1) ──

export function Pillow({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="22" width="64" height="36" rx="18" fill="#E8E4F0" stroke="#B8B0C8" strokeWidth="2" />
      <path d="M24 30 Q40 26 56 30" stroke="#C8C0D8" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M20 40 Q40 36 60 40" stroke="#C8C0D8" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function Towel({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="14" width="48" height="52" rx="4" fill="#D4EAF7" stroke="#8CBDD9" strokeWidth="2" />
      <rect x="16" y="14" width="48" height="14" rx="4" fill="#B8D8EE" stroke="#8CBDD9" strokeWidth="2" />
      <line x1="24" y1="36" x2="56" y2="36" stroke="#A0CCE0" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="44" x2="56" y2="44" stroke="#A0CCE0" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="52" x2="56" y2="52" stroke="#A0CCE0" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function Bedsheet({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="18" width="60" height="44" rx="3" fill="#F0F4E8" stroke="#B8C8A0" strokeWidth="2" />
      <path d="M10 56 Q20 62 30 56 Q40 50 50 56 Q60 62 70 56" stroke="#B8C8A0" strokeWidth="2" fill="none" />
      <line x1="10" y1="30" x2="70" y2="30" stroke="#C8D8B0" strokeWidth="1.5" strokeDasharray="4 3" />
    </svg>
  )
}

export function Hanger({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="16" r="5" stroke="#6B7B8D" strokeWidth="2.5" fill="none" />
      <path d="M40 21 L40 28 L12 52 L68 52 L40 28" stroke="#6B7B8D" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
      <line x1="12" y1="52" x2="68" y2="52" stroke="#6B7B8D" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export function SoapBar({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="28" width="52" height="28" rx="8" fill="#F7E8D4" stroke="#D4B896" strokeWidth="2" />
      <circle cx="28" cy="22" r="4" fill="#E8F4FF" stroke="#A8D0F0" strokeWidth="1.5" />
      <circle cx="40" cy="18" r="3" fill="#E8F4FF" stroke="#A8D0F0" strokeWidth="1.5" />
      <circle cx="50" cy="24" r="3.5" fill="#E8F4FF" stroke="#A8D0F0" strokeWidth="1.5" />
    </svg>
  )
}

// ── Cleaning Tools (L2) ──

export function Mop({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="8" x2="40" y2="48" stroke="#8B7355" strokeWidth="3" strokeLinecap="round" />
      <rect x="22" y="48" width="36" height="12" rx="3" fill="#C8D8C0" stroke="#88A880" strokeWidth="2" />
      <line x1="28" y1="60" x2="28" y2="72" stroke="#88A880" strokeWidth="2" strokeLinecap="round" />
      <line x1="34" y1="60" x2="34" y2="72" stroke="#88A880" strokeWidth="2" strokeLinecap="round" />
      <line x1="40" y1="60" x2="40" y2="72" stroke="#88A880" strokeWidth="2" strokeLinecap="round" />
      <line x1="46" y1="60" x2="46" y2="72" stroke="#88A880" strokeWidth="2" strokeLinecap="round" />
      <line x1="52" y1="60" x2="52" y2="72" stroke="#88A880" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function SprayBottle({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="28" y="30" width="24" height="40" rx="4" fill="#D4E8F7" stroke="#88B0D0" strokeWidth="2" />
      <rect x="32" y="20" width="16" height="12" rx="2" fill="#E0E8F0" stroke="#88B0D0" strokeWidth="2" />
      <path d="M32 24 L18 18 L18 14 L22 14" stroke="#88B0D0" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="14" cy="12" r="2" fill="#C0D8F0" />
      <circle cx="10" cy="10" r="1.5" fill="#C0D8F0" />
    </svg>
  )
}

export function Sponge({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="24" width="56" height="32" rx="6" fill="#F7E88C" stroke="#D4C060" strokeWidth="2" />
      <circle cx="26" cy="36" r="2.5" fill="#E8D470" />
      <circle cx="40" cy="32" r="2" fill="#E8D470" />
      <circle cx="54" cy="38" r="2.5" fill="#E8D470" />
      <circle cx="32" cy="46" r="2" fill="#E8D470" />
      <circle cx="48" cy="44" r="2.5" fill="#E8D470" />
    </svg>
  )
}

export function Gloves({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 68 L24 36 Q24 28 30 24 L30 12 Q30 8 34 8 Q38 8 38 12 L38 22 L38 12 Q38 8 42 8 Q46 8 46 12 L46 20 L46 14 Q46 10 50 10 Q54 10 54 14 L54 24 Q54 22 56 20 Q58 18 60 20 L60 36 Q60 44 56 52 L56 68 Q56 72 48 72 L32 72 Q24 72 24 68 Z" fill="#A8D8E8" stroke="#70B0C8" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

export function TrashBag({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 24 Q24 10 40 10 Q56 10 58 24" stroke="#5A6B5A" strokeWidth="2" fill="none" />
      <path d="M16 24 Q18 70 40 72 Q62 70 64 24 Z" fill="#6B7B6B" stroke="#4A5A4A" strokeWidth="2" />
      <path d="M34 10 Q36 6 40 6 Q44 6 46 10" stroke="#4A5A4A" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M28 30 Q34 40 28 56" stroke="#5A6B5A" strokeWidth="1.5" fill="none" />
      <path d="M52 30 Q46 40 52 56" stroke="#5A6B5A" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

// ── Workplace Signs (L5) ──

export function WetFloorSign({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 8 L66 68 L14 68 Z" fill="#FFD54F" stroke="#F9A825" strokeWidth="2" strokeLinejoin="round" />
      <text x="40" y="50" textAnchor="middle" fill="#E65100" fontSize="24" fontWeight="bold">!</text>
      <circle cx="40" cy="30" r="3" fill="#E65100" />
      <path d="M37 34 L35 46 M43 34 L45 46" stroke="#E65100" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function StaffOnlySign({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="16" width="64" height="48" rx="4" fill="#E53935" stroke="#C62828" strokeWidth="2" />
      <text x="40" y="36" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">STAFF</text>
      <text x="40" y="52" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">ONLY</text>
    </svg>
  )
}

export function DoNotDisturbSign({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="6" width="48" height="68" rx="6" fill="#F5F0E8" stroke="#C8B898" strokeWidth="2" />
      <circle cx="40" cy="12" r="6" fill="none" stroke="#C8B898" strokeWidth="2" />
      <text x="40" y="36" textAnchor="middle" fill="#8B4513" fontSize="7" fontWeight="bold">DO NOT</text>
      <text x="40" y="48" textAnchor="middle" fill="#8B4513" fontSize="7" fontWeight="bold">DISTURB</text>
      <circle cx="40" cy="62" r="5" fill="#E53935" stroke="#C62828" strokeWidth="1.5" />
      <line x1="36" y1="62" x2="44" y2="62" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function EmergencyExitSign({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="16" width="68" height="48" rx="4" fill="#2E7D32" stroke="#1B5E20" strokeWidth="2" />
      {/* Running figure */}
      <circle cx="32" cy="30" r="4" fill="white" />
      <path d="M32 34 L32 48 M32 38 L24 44 M32 38 L40 44 M32 48 L26 58 M32 48 L38 58" stroke="white" strokeWidth="2" strokeLinecap="round" />
      {/* Arrow */}
      <path d="M50 40 L64 40 M58 34 L64 40 L58 46" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function OutOfOrderSign({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="16" width="64" height="48" rx="4" fill="#FFF3E0" stroke="#E65100" strokeWidth="2" />
      <text x="40" y="36" textAnchor="middle" fill="#E65100" fontSize="8" fontWeight="bold">OUT OF</text>
      <text x="40" y="50" textAnchor="middle" fill="#E65100" fontSize="8" fontWeight="bold">ORDER</text>
      <line x1="14" y1="22" x2="66" y2="58" stroke="#E65100" strokeWidth="2" opacity="0.3" />
    </svg>
  )
}

export function NoSmokingSign({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="28" fill="white" stroke="#E53935" strokeWidth="3" />
      {/* Cigarette */}
      <rect x="22" y="36" width="28" height="8" rx="1" fill="#F5F0E8" stroke="#AAA" strokeWidth="1" />
      <rect x="50" y="36" width="8" height="8" rx="1" fill="#FF8A65" stroke="#E65100" strokeWidth="1" />
      {/* Red slash */}
      <line x1="20" y1="60" x2="60" y2="20" stroke="#E53935" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function HousekeepingSign({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="12" width="64" height="56" rx="4" fill="#E3F2FD" stroke="#1565C0" strokeWidth="2" />
      <text x="40" y="32" textAnchor="middle" fill="#1565C0" fontSize="6.5" fontWeight="bold">HOUSEKEEPING</text>
      <text x="40" y="44" textAnchor="middle" fill="#1565C0" fontSize="6.5" fontWeight="bold">IN PROGRESS</text>
      {/* Small broom icon */}
      <line x1="40" y1="50" x2="40" y2="60" stroke="#1565C0" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M34 60 Q37 56 40 60 Q43 56 46 60" stroke="#1565C0" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

// ── Component map for easy lookup ──
export const WORKPLACE_VISUALS = {
  // L1 Hotel items
  pillow: Pillow,
  towel: Towel,
  bedsheet: Bedsheet,
  hanger: Hanger,
  soap: SoapBar,
  // L2 Cleaning tools
  mop: Mop,
  'spray bottle': SprayBottle,
  sponge: Sponge,
  gloves: Gloves,
  'trash bag': TrashBag,
  // L5 Workplace signs
  'wet floor': WetFloorSign,
  'staff only': StaffOnlySign,
  'do not disturb': DoNotDisturbSign,
  'emergency exit': EmergencyExitSign,
  'out of order': OutOfOrderSign,
  'no smoking': NoSmokingSign,
  'housekeeping in progress': HousekeepingSign,
}
