export default function ClockFace({ hours = 12, minutes = 0, size = 200 }) {
  const hourAngle = ((hours % 12) * 30) + (minutes * 0.5) - 90
  const minuteAngle = (minutes * 6) - 90
  const r = size / 2
  const center = r
  const numberRadius = r * 0.72
  const hourHandLength = r * 0.45
  const minuteHandLength = r * 0.65

  const toRad = (deg) => (deg * Math.PI) / 180

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-sm">
      {/* Outer circle */}
      <circle cx={center} cy={center} r={r - 4} fill="white" stroke="#4AABB3" strokeWidth="3" />
      
      {/* Hour markers */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 - 90) * Math.PI / 180
        const x1 = center + (r - 12) * Math.cos(angle)
        const y1 = center + (r - 12) * Math.sin(angle)
        const x2 = center + (r - 22) * Math.cos(angle)
        const y2 = center + (r - 22) * Math.sin(angle)
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#333" strokeWidth={i % 3 === 0 ? 3 : 1.5} strokeLinecap="round" />
        )
      })}

      {/* Numbers */}
      {[...Array(12)].map((_, i) => {
        const num = i === 0 ? 12 : i
        const angle = toRad(i * 30 - 90)
        const x = center + numberRadius * Math.cos(angle)
        const y = center + numberRadius * Math.sin(angle)
        return (
          <text key={num} x={x} y={y} textAnchor="middle" dominantBaseline="central"
            fontSize={size * 0.1} fontWeight="bold" fill="#333" fontFamily="system-ui">
            {num}
          </text>
        )
      })}

      {/* Hour hand */}
      <line
        x1={center} y1={center}
        x2={center + hourHandLength * Math.cos(toRad(hourAngle))}
        y2={center + hourHandLength * Math.sin(toRad(hourAngle))}
        stroke="#333" strokeWidth={4} strokeLinecap="round"
      />

      {/* Minute hand */}
      <line
        x1={center} y1={center}
        x2={center + minuteHandLength * Math.cos(toRad(minuteAngle))}
        y2={center + minuteHandLength * Math.sin(toRad(minuteAngle))}
        stroke="#4AABB3" strokeWidth={3} strokeLinecap="round"
      />

      {/* Center dot */}
      <circle cx={center} cy={center} r={5} fill="#333" />
    </svg>
  )
}
