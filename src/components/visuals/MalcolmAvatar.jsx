/**
 * MalcolmAvatar — cartoon avatar matching the user-provided reference image.
 * Young Asian male, short dark hair, warm skin, blue collared shirt, friendly smile.
 * Supports poses: neutral, happy, thinking, pointing, waving.
 */
export default function MalcolmAvatar({ size = 100, pose = 'neutral' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ── Shirt / Body ── */}
      <path
        d="M30 82 C30 74 40 68 60 68 C80 68 90 74 90 82 L90 110 C90 114 86 118 82 118 L38 118 C34 118 30 114 30 110 Z"
        fill="#4A9EC5"
      />
      {/* Collar */}
      <path d="M50 68 L57 80 L60 76 L63 80 L70 68" fill="#3B8AB0" />
      {/* Collar lines */}
      <path d="M50 68 L57 80" stroke="#347A9E" strokeWidth="0.8" fill="none" />
      <path d="M70 68 L63 80" stroke="#347A9E" strokeWidth="0.8" fill="none" />

      {/* ── Neck ── */}
      <rect x="53" y="62" width="14" height="10" rx="3" fill="#C8956C" />

      {/* ── Head ── */}
      <ellipse cx="60" cy="42" rx="26" ry="28" fill="#D4A574" />

      {/* ── Ears ── */}
      <ellipse cx="34" cy="44" rx="5" ry="7" fill="#D4A574" />
      <ellipse cx="34" cy="44" rx="3" ry="5" fill="#C8956C" />
      <ellipse cx="86" cy="44" rx="5" ry="7" fill="#D4A574" />
      <ellipse cx="86" cy="44" rx="3" ry="5" fill="#C8956C" />

      {/* ── Hair ── */}
      {/* Main hair shape */}
      <path
        d="M34 38 C34 18 42 10 60 10 C78 10 86 18 86 38 L86 30 C86 16 76 8 60 8 C44 8 34 16 34 30 Z"
        fill="#1A1A1A"
      />
      {/* Hair top volume */}
      <path
        d="M36 32 C36 16 44 8 60 7 C76 8 84 16 84 32 C84 22 76 14 60 13 C44 14 36 22 36 32"
        fill="#2D2D2D"
      />
      {/* Side hair left */}
      <path d="M34 30 C33 26 34 20 38 16 C36 22 35 26 34 38 Z" fill="#1A1A1A" />
      {/* Side hair right */}
      <path d="M86 30 C87 26 86 20 82 16 C84 22 85 26 86 38 Z" fill="#1A1A1A" />
      {/* Fringe texture */}
      <path d="M42 18 C46 14 54 12 60 12 C66 12 74 14 78 18 C74 16 66 15 60 15 C54 15 46 16 42 18" fill="#222" />

      {/* ── Eyebrows ── */}
      <path d="M44 32 C46 30 50 30 53 31" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M67 31 C70 30 74 30 76 32" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* ── Eyes ── */}
      {/* Left eye */}
      <ellipse cx="49" cy="38" rx="5" ry="5.5" fill="white" />
      <circle cx="50" cy="38" r="3.2" fill="#2D2D2D" />
      <circle cx="51" cy="37" r="1.2" fill="white" />
      {/* Right eye */}
      <ellipse cx="71" cy="38" rx="5" ry="5.5" fill="white" />
      <circle cx="70" cy="38" r="3.2" fill="#2D2D2D" />
      <circle cx="71" cy="37" r="1.2" fill="white" />

      {/* ── Nose ── */}
      <path d="M58 44 C59 46 61 46 62 44" stroke="#B8845C" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* ── Mouth (pose-dependent) ── */}
      {pose === 'happy' ? (
        <>
          <path d="M50 52 Q60 60 70 52" stroke="#C0705A" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M52 52 Q60 58 68 52" fill="white" />
        </>
      ) : pose === 'thinking' ? (
        <>
          <line x1="54" y1="53" x2="66" y2="53" stroke="#C0705A" strokeWidth="2" strokeLinecap="round" />
          <circle cx="68" cy="52" r="1" fill="#C0705A" />
        </>
      ) : (
        /* neutral / waving / pointing — friendly smile */
        <path d="M52 51 Q60 57 68 51" stroke="#C0705A" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}

      {/* ── Cheek blush ── */}
      <ellipse cx="41" cy="48" rx="5" ry="3" fill="#E8A88A" opacity="0.35" />
      <ellipse cx="79" cy="48" rx="5" ry="3" fill="#E8A88A" opacity="0.35" />

      {/* ── Arms (pose-dependent) ── */}
      {pose === 'pointing' ? (
        <>
          <path d="M30 85 C22 78 15 70 10 60" stroke="#D4A574" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M90 85 C98 72 102 60 100 50" stroke="#D4A574" strokeWidth="6" strokeLinecap="round" fill="none" />
          <circle cx="100" cy="49" r="3.5" fill="#D4A574" />
        </>
      ) : pose === 'waving' ? (
        <>
          <path d="M30 85 C22 90 18 96 16 102" stroke="#D4A574" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M90 85 C100 72 104 58 100 48" stroke="#D4A574" strokeWidth="6" strokeLinecap="round" fill="none" />
          <circle cx="100" cy="47" r="3.5" fill="#D4A574" />
        </>
      ) : (
        <>
          <path d="M30 85 C22 90 18 96 16 104" stroke="#D4A574" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M90 85 C98 90 102 96 104 104" stroke="#D4A574" strokeWidth="6" strokeLinecap="round" fill="none" />
        </>
      )}
    </svg>
  )
}
