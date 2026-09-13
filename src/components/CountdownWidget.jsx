import React, { useState, useEffect } from 'react'
import { siteSettings, countdownSettings } from '../data/settings'
import { getLiveTimeTogether } from '../utils/countdown'

/**
 * CountdownWidget — Keeps your clean design, but adds live ticking days together!
 */
export default function CountdownWidget({ isVisible = true }) {
  const [expanded, setExpanded] = useState(false)
  const [timeTogether, setTimeTogether] = useState(() => 
    getLiveTimeTogether(siteSettings.relationshipStartDate, countdownSettings.timezone)
  )

  // Live tick every second!
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeTogether(getLiveTimeTogether(siteSettings.relationshipStartDate, countdownSettings.timezone))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="cursor-pointer select-none transition-all duration-300 bg-elsewhere-surface/90 hover:bg-elsewhere-surface hover:border-elsewhere-gold/40 backdrop-blur-md border border-elsewhere-border rounded-2xl p-3 sm:px-4 sm:py-2.5 shadow-clay-card"
      title="Click to toggle details"
    >
      <div className="flex items-center gap-3.5">
        {/* Title */}
        <div className="text-right">
          <p className="text-[9px] sm:text-[10px] font-sans tracking-[0.2em] uppercase text-elsewhere-textMuted leading-tight font-medium">
            {countdownSettings.title}
          </p>
          <p className="text-[11px] font-sans text-elsewhere-textSecondary hidden sm:block">
            Hanoi (UTC+7)
          </p>
        </div>

        {/* Live Ticking Counter (Days : Hours : Minutes) */}
        <div className="flex items-baseline gap-1.5 sm:gap-2 font-sans tabular-nums">
          <div className="flex items-baseline gap-0.5">
            <span className="text-lg sm:text-xl font-bold text-elsewhere-textPrimary">
              {timeTogether.days}
            </span>
            <span className="text-[10px] uppercase font-semibold text-elsewhere-gold">d</span>
          </div>

          <span className="text-xs text-white/30 font-light">:</span>

          <div className="flex items-baseline gap-0.5">
            <span className="text-lg sm:text-xl font-bold text-elsewhere-textPrimary">
              {String(timeTogether.hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase font-semibold text-elsewhere-gold">h</span>
          </div>

          <span className="text-xs text-white/30 font-light">:</span>

          <div className="flex items-baseline gap-0.5">
            <span className="text-lg sm:text-xl font-bold text-elsewhere-textPrimary">
              {String(timeTogether.minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase font-semibold text-elsewhere-gold">m</span>
          </div>
        </div>

        {/* Someday Pill (Honoring the meeting promise) */}
        <div className="hidden md:flex items-center px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 ml-1">
          <span className="font-serif italic text-xs text-elsewhere-gold">
            Someday
          </span>
        </div>
      </div>

      {/* Expanded Drawer on Click */}
      {expanded && (
        <div className="mt-2.5 pt-2 border-t border-white/10 animate-fadeIn">
          <p className="text-xs font-serif italic text-elsewhere-gold leading-relaxed">
            "{countdownSettings.subtitle}"
          </p>
          <p className="text-[10px] font-sans text-elsewhere-textMuted mt-1">
            Journey started: February 22, 2026 &bull; Her Time: {countdownSettings.timezone}
          </p>
        </div>
      )}
    </div>
  )
}