import React, { useState, useEffect } from 'react'
import { countdownSettings } from '../data/settings'
import { calculateCountdown } from '../utils/countdown'

/**
 * CountdownWidget — Master Plan Section F2
 * Styled with claymorphic card and clean sans-serif numbers (no Roman numerals).
 * Displays "Someday" mode synced to Hanoi time.
 */
export default function CountdownWidget({ isVisible = true }) {
  const [expanded, setExpanded] = useState(false)
  const hasTargetDate = Boolean(countdownSettings.targetDate)

  const [timeLeft, setTimeLeft] = useState(() => 
    hasTargetDate 
      ? calculateCountdown(countdownSettings.targetDate, countdownSettings.targetTime, countdownSettings.timezone)
      : null
  )

  useEffect(() => {
    if (!hasTargetDate) return

    const timer = setInterval(() => {
      setTimeLeft(calculateCountdown(countdownSettings.targetDate, countdownSettings.targetTime, countdownSettings.timezone))
    }, 1000)

    return () => clearInterval(timer)
  }, [hasTargetDate])

  if (!isVisible) return null

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="cursor-pointer select-none transition-all duration-300 bg-elsewhere-surface/90 hover:bg-elsewhere-surface hover:border-elsewhere-gold/40 backdrop-blur-md border border-elsewhere-border rounded-2xl p-3 sm:px-4 sm:py-2.5 shadow-clay-card"
      title="Click to toggle details"
    >
      <div className="flex items-center gap-3.5">
        <div className="text-right">
          <p className="text-[9px] sm:text-[10px] font-sans tracking-[0.2em] uppercase text-elsewhere-textMuted leading-tight font-medium">
            {countdownSettings.title}
          </p>
          <p className="text-[11px] font-sans text-elsewhere-textSecondary hidden sm:block">
            {hasTargetDate ? 'Every day closer' : 'Hanoi (UTC+7)'}
          </p>
        </div>

        {hasTargetDate && timeLeft ? (
          /* Live Numbers Row (clean sans-serif tabular numbers) */
          <div className="flex items-baseline gap-1.5 sm:gap-2 font-sans tabular-nums">
            <div className="flex items-baseline gap-0.5">
              <span className="text-lg sm:text-xl font-bold text-elsewhere-textPrimary">{timeLeft.days}</span>
              <span className="text-[10px] uppercase font-semibold text-elsewhere-gold">d</span>
            </div>
            <span className="text-xs text-white/30 font-light">:</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-lg sm:text-xl font-bold text-elsewhere-textPrimary">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-[10px] uppercase font-semibold text-elsewhere-gold">h</span>
            </div>
            <span className="text-xs text-white/30 font-light">:</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-lg sm:text-xl font-bold text-elsewhere-textPrimary">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-[10px] uppercase font-semibold text-elsewhere-gold">m</span>
            </div>
          </div>
        ) : (
          /* Someday Promise Mode */
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <span className="font-serif italic text-base sm:text-lg text-elsewhere-gold tracking-wide">
              Someday
            </span>
          </div>
        )}
      </div>

      {/* Expanded Drawer */}
      {expanded && (
        <div className="mt-2.5 pt-2 border-t border-white/10 animate-fadeIn">
          <p className="text-xs font-serif italic text-elsewhere-gold leading-relaxed">
            "{countdownSettings.subtitle}"
          </p>
          <p className="text-[10px] font-sans text-elsewhere-textMuted mt-1">
            Her Time: {countdownSettings.timezone} (Hanoi)
          </p>
        </div>
      )}
    </div>
  )
}