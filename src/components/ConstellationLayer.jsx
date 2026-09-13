import React, { useMemo, useState } from 'react'

/**
 * ConstellationLayer — Master Plan Section U
 * - In Background (The Shelf): Quiet, clean stardust in deep space (NO clutter lines across furniture)
 * - In Full Sky (The Sky Between Us): The full constellation map with golden lines, stars, and stories!
 */
export default function ConstellationLayer({
  items = [],
  isDiscovered,
  onSelectStar,
  fullScreen = false,
}) {
  const VIEW_WIDTH = 1000
  const VIEW_HEIGHT = 700

  const [hoveredId, setHoveredId] = useState(null)

  // 1. Ambient Stardust Field (Always visible in deep space)
  const ambientStars = useMemo(() => {
    const stars = []
    for (let i = 0; i < 95; i++) {
      stars.push({
        id: `ambient-${i}`,
        x: Math.random() * VIEW_WIDTH,
        y: Math.random() * VIEW_HEIGHT,
        r: Math.random() * 1.3 + 0.4,
        opacity: Math.random() * 0.45 + 0.15,
      })
    }
    return stars
  }, [])

  // 2. Build Connection Lines (Only shown in full-sky mode)
  const lines = useMemo(() => {
    if (!fullScreen) return []

    const itemMap = new Map(items.map((it) => [it.id, it]))
    const connectionPairs = []

    items.forEach((item) => {
      if (!item.constellationPosition || !item.linkedStars) return

      const x1 = item.constellationPosition.x * VIEW_WIDTH
      const y1 = item.constellationPosition.y * VIEW_HEIGHT

      item.linkedStars.forEach((targetId) => {
        const target = itemMap.get(targetId)
        if (target && target.constellationPosition) {
          const x2 = target.constellationPosition.x * VIEW_WIDTH
          const y2 = target.constellationPosition.y * VIEW_HEIGHT

          const key = [item.id, target.id].sort().join('---')
          if (!connectionPairs.some((p) => p.key === key)) {
            const bothDiscovered = isDiscovered(item.id) && isDiscovered(target.id)
            connectionPairs.push({ key, x1, y1, x2, y2, bothDiscovered })
          }
        }
      })
    })

    return connectionPairs
  }, [items, isDiscovered, fullScreen])

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-700 select-none ${
        fullScreen
          ? 'z-30 opacity-100 pointer-events-auto bg-elsewhere-void/90 backdrop-blur-md'
          : 'z-0 opacity-50 pointer-events-none'
      }`}
    >
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="35%" stopColor="#dfb76c" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#dfb76c" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#dfb76c" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="originGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="40%" stopColor="#a5b4fc" stopOpacity="0.9" />
            <stop offset="80%" stopColor="#a5b4fc" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#a5b4fc" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Stardust Field (Always visible in deep space) */}
        <g className="ambient-stars">
          {ambientStars.map((s) => (
            <circle
              key={s.id}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill="#ffffff"
              opacity={s.opacity}
            />
          ))}
        </g>

        {/* ================= ONLY RENDER MAP LINES & NODES IN FULL SKY VIEW ================= */}
        {fullScreen && (
          <>
            {/* Constellation Connection Lines */}
            <g className="constellation-lines">
              {lines.map((line) => (
                <line
                  key={line.key}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={line.bothDiscovered ? '#dfb76c' : 'rgba(255, 255, 255, 0.12)'}
                  strokeWidth={line.bothDiscovered ? 1.6 : 0.8}
                  strokeDasharray={line.bothDiscovered ? 'none' : '3, 5'}
                />
              ))}
            </g>

            {/* Constellation Star Nodes */}
            <g className="constellation-stars">
              {items.map((item) => {
                if (!item.constellationPosition) return null

                const cx = item.constellationPosition.x * VIEW_WIDTH
                const cy = item.constellationPosition.y * VIEW_HEIGHT
                const discovered = isDiscovered(item.id)
                const isFuture = item.status === 'future'
                const isAnchor = item.id === 'the-beginning'
                const isHovered = hoveredId === item.id

                return (
                  <g
                    key={item.id}
                    className="cursor-pointer"
                    onClick={() => onSelectStar && onSelectStar(item)}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* Generous Hit Box */}
                    <circle cx={cx} cy={cy} r={26} fill="transparent" />

                    {/* Star Glow Halo */}
                    {discovered && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? (isAnchor ? 38 : 28) : (isAnchor ? 28 : 20)}
                        fill={isAnchor ? 'url(#originGlow)' : 'url(#starGlow)'}
                        opacity={isHovered ? 0.95 : 0.7}
                        className="transition-all duration-300"
                      />
                    )}

                    {/* Star Core */}
                    {isFuture ? (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? 7 : 5.5}
                        fill="none"
                        stroke={discovered ? '#fda4af' : 'rgba(253, 164, 175, 0.5)'}
                        strokeWidth={1.5}
                        strokeDasharray="2, 2"
                        className="transition-all duration-300"
                      />
                    ) : (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? (isAnchor ? 7 : 5.5) : (isAnchor ? 5.5 : 4)}
                        fill={
                          discovered
                            ? isAnchor
                              ? '#ffffff'
                              : '#dfb76c'
                            : 'rgba(255, 255, 255, 0.45)'
                        }
                        className="transition-all duration-300"
                      />
                    )}

                    {/* Text Label */}
                    <text
                      x={cx}
                      y={cy > VIEW_HEIGHT * 0.6 ? cy - 14 : cy + 18}
                      textAnchor="middle"
                      className={`font-serif text-[12px] tracking-wide pointer-events-none select-none transition-all duration-300 ${
                        isHovered
                          ? 'fill-elsewhere-gold font-medium scale-105'
                          : 'fill-elsewhere-textSecondary opacity-80'
                      }`}
                    >
                      {item.title} {isFuture && '(Someday)'}
                    </text>
                  </g>
                )
              })}
            </g>
          </>
        )}
      </svg>
    </div>
  )
}