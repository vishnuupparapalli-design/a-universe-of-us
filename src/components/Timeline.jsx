import React, { useState, useEffect, useRef, useMemo } from 'react'

/**
 * Timeline Component — Master Plan Section O
 * Fixed: Removed timer trap so the starlight orb smoothly glides to each hovered memory!
 */
export default function Timeline({
  isDiscovered,
  onSelectMemory,
  currentDays = 207,
}) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [orbY, setOrbY] = useState(16)
  const rowRefs = useRef([])
  const containerRef = useRef(null)

  // Chronological journey events
  const timelineEvents = useMemo(() => [
    {
      id: "the-beginning",
      dateLabel: "February 22, 2026",
      precision: "Exact Date",
      title: "Where It Started",
      chapter: "the-beginning",
      text: "Two screens lit up in Genshin Impact. The first light that started an entire universe.",
      location: "Genshin Impact",
      status: "past",
      accentColor: "#a5b4fc", // Violet
    },
    {
      id: "our-stories",
      dateLabel: "Early on",
      precision: "Approximate",
      title: "Our Stories",
      chapter: "our-stories",
      text: "I learned your story, and you learned mine. Two books resting side by side across late-night texts.",
      location: "Late night texts",
      status: "past",
      accentColor: "#d97706", // Amber
    },
    {
      id: "movie-night-01",
      dateLabel: "Movie Nights",
      precision: "Shared Ritual",
      title: "Our First Synchronized Film",
      chapter: "movie-corner",
      text: "We weren't in the same room. We still watched the exact same light.",
      location: "Across the screens",
      status: "past",
      accentColor: "#fcd34d", // Projector Gold
    },
    {
      id: "hard-days-01",
      dateLabel: "A difficult week",
      precision: "Quiet Moment",
      title: "A Quiet Night",
      chapter: "the-hard-days",
      text: "Some days were heavy and words were hard to find. We stayed on the line anyway, making sure neither of us was alone.",
      location: "In the quiet",
      status: "past",
      accentColor: "#ffd68a", // Candlelight
    },
    {
      id: "distance-thread",
      dateLabel: "Every night",
      precision: "Daily Reality",
      title: "Across the Distance",
      chapter: "across-the-distance",
      text: "Somewhere between here and there, we built a world of our own. A luminous thread connecting two far-apart lights.",
      location: "New Delhi ↔ Hanoi",
      status: "past",
      accentColor: "#38bdf8", // Ocean Cyan
    },
    {
      id: "two-hundred-three-days",
      dateLabel: "Today",
      precision: "Live Milestone",
      title: `${currentDays} Days of Choosing Each Other`,
      chapter: `${currentDays}-days`,
      text: `${currentDays} days of quiet trust, late-night texts, and choosing each other day by day.`,
      location: "New Delhi ↔ Hanoi",
      status: "past",
      accentColor: "#dfb76c", // Pure Gold
    },
    {
      id: "someday-first-photo",
      dateLabel: "Someday Soon",
      precision: "Promise",
      title: "Our First Photo Together",
      chapter: "someday",
      text: "The photo we haven't taken yet. An empty frame waiting for light.",
      location: "Where we meet",
      status: "future",
      accentColor: "#fda4af", // Dawn Rose
    },
    {
      id: "someday-meeting",
      dateLabel: "When the time comes",
      precision: "The Destination",
      title: "The Day We Finally Meet",
      chapter: "someday",
      text: "When Elsewhere quietly becomes here.",
      location: "In person",
      status: "future",
      isDestination: true,
      accentColor: "#fef08a", // Starlight Gold
    },
  ], [currentDays])

  // Move the traveling starlight orb directly to the hovered row
  const moveToRow = (index) => {
    setActiveIdx(index)
    const rowEl = rowRefs.current[index]
    if (rowEl) {
      setOrbY(rowEl.offsetTop + 16)
    }
  }

  // Set initial position ONCE on page load (No repeating reset timer!)
  useEffect(() => {
    const timer = setTimeout(() => {
      const firstRow = rowRefs.current[0]
      if (firstRow) {
        setOrbY(firstRow.offsetTop + 16)
      }
    }, 100)

    const handleResize = () => {
      const currentRow = rowRefs.current[activeIdx]
      if (currentRow) {
        setOrbY(currentRow.offsetTop + 16)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, []) // Empty brackets [] = Runs once on load, NEVER resets your hover!

  return (
    <div className="w-full h-full overflow-y-auto pt-24 pb-36 px-4 sm:px-6 md:px-12 select-none relative z-10">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center mb-16 animate-fadeIn">
          <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-cyan-300 font-semibold mb-2">
            Chronological Journey
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-elsewhere-textPrimary mb-3">
            The Path We Walked
          </h2>
          <p className="text-xs sm:text-sm font-sans text-elsewhere-textSecondary max-w-md mx-auto leading-relaxed">
            Every moment between us, from the first conversation to the day Elsewhere becomes here.
          </p>
        </div>

        {/* Vertical Flowing Timeline */}
        <div ref={containerRef} className="relative">
          
          {/* 1. GLOWING NEON HALO BEHIND THE LINE */}
          <div className="absolute top-4 bottom-8 left-4 sm:left-1/2 -ml-[3px] w-1.5 bg-gradient-to-b from-cyan-400/40 via-blue-500/30 to-amber-300/40 blur-[4px] pointer-events-none" />

          {/* 2. SHARP CENTRAL STARLIGHT BEAM */}
          <div className="absolute top-4 bottom-8 left-4 sm:left-1/2 -ml-px w-0.5 bg-gradient-to-b from-cyan-300 via-blue-400 to-amber-200 pointer-events-none shadow-[0_0_12px_rgba(56,189,248,0.85)]" />

          {/* 3. THE TRAVELING STARLIGHT ORB (GLIDES SMOOTHLY WITH ZERO TRAPS!) */}
          <div
            className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-6 h-6 pointer-events-none z-20 transition-all duration-500 ease-out"
            style={{ top: `${orbY}px` }}
          >
            {/* Luminous Comet Tail */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-1.5 h-12 bg-gradient-to-b from-transparent to-cyan-300 blur-[1px]" />
            
            {/* Pulsing Starlight Halo */}
            <div className="absolute -inset-1 rounded-full bg-cyan-400/40 animate-ping" />
            
            {/* Glowing White Pearl */}
            <div className="relative w-5 h-5 mx-auto my-0.5 rounded-full bg-white shadow-[0_0_20px_#38bdf8,0_0_35px_#38bdf8] border-2 border-cyan-200" />
          </div>

          {/* 4. The Alternating Memory Cards */}
          <div className="space-y-12">
            {timelineEvents.map((event, idx) => {
              const discovered = isDiscovered(event.id)
              const isFuture = event.status === 'future'
              const isEven = idx % 2 === 0
              const isHovered = activeIdx === idx

              return (
                <div
                  key={event.id}
                  ref={(el) => (rowRefs.current[idx] = el)}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  } group`}
                  onMouseEnter={() => moveToRow(idx)} // GLIDES IMMEDIATELY TO THIS ROW!
                >
                  {/* Anchor Point Node on the Line */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 top-4 w-6 h-6 rounded-full flex items-center justify-center z-10">
                    <div
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        event.isDestination
                          ? 'border-2 border-dashed border-amber-300 bg-amber-400/30'
                          : isFuture
                          ? 'border border-rose-300/60 bg-rose-400/10'
                          : discovered
                          ? 'bg-cyan-400 shadow-glow-star'
                          : 'bg-white/30 border border-white/20'
                      }`}
                    />
                  </div>

                  {/* Spacer for desktop alignment */}
                  <div className="hidden sm:block sm:w-1/2" />

                  {/* TACTILE POP-UP CARD */}
                  <div className={`w-full sm:w-1/2 pl-12 sm:pl-0 ${isEven ? 'sm:pr-10' : 'sm:pl-10'}`}>
                    <div
                      onClick={() => onSelectMemory(event.id)}
                      className={`cursor-pointer rounded-2xl p-5 sm:p-6 transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] shadow-clay-card hover:shadow-2xl border ${
                        event.isDestination
                          ? 'bg-amber-500/10 border-amber-300/30 hover:border-amber-300 shadow-glow-gold/10'
                          : isFuture
                          ? 'bg-white/5 border-dashed border-rose-300/30 hover:border-rose-300'
                          : discovered
                          ? 'bg-elsewhere-surface/90 border-cyan-400/30 hover:border-cyan-400 shadow-glow-star/10'
                          : 'bg-elsewhere-surface/75 border-elsewhere-border hover:border-elsewhere-borderHover'
                      }`}
                      style={{
                        borderColor: isHovered ? event.accentColor : undefined,
                        boxShadow: isHovered
                          ? `0 14px 35px -10px rgba(0,0,0,0.65), 0 0 22px ${event.accentColor}40`
                          : undefined,
                      }}
                    >
                      {/* Top Metadata Row */}
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="text-[10px] font-sans font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5"
                          style={{ color: event.accentColor }}
                        >
                          {event.dateLabel}
                        </span>
                        <span className="text-[10px] font-sans text-elsewhere-textMuted italic">
                          {event.precision}
                        </span>
                      </div>

                      {/* Card Title */}
                      <h3 className="font-serif text-xl sm:text-2xl text-elsewhere-textPrimary mb-2 transition-colors duration-200 group-hover:text-white">
                        {event.title}
                      </h3>

                      {/* Card Story Text */}
                      <p className="text-xs sm:text-sm font-sans text-elsewhere-textSecondary leading-relaxed line-clamp-3">
                        {event.text}
                      </p>

                      {/* Bottom Footer with Moving Arrow */}
                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-sans text-elsewhere-textMuted">
                        <span>📍 {event.location}</span>
                        <span
                          className="flex items-center gap-1 font-medium transition-all duration-200 group-hover:translate-x-1.5"
                          style={{ color: event.accentColor }}
                        >
                          <span>Inspect memory</span>
                          <span>→</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}