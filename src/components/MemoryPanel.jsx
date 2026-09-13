import React, { useState, useEffect } from 'react'
import { siteSettings, countdownSettings } from '../data/settings'
import { getLiveTimeTogether } from '../utils/countdown'

/**
 * Stylish Live Counter Widget rendered specifically inside the Days Together card
 */
function DaysTogetherLiveCard() {
  const [liveTime, setLiveTime] = useState(() => 
    getLiveTimeTogether(siteSettings.relationshipStartDate, countdownSettings.timezone)
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(getLiveTimeTogether(siteSettings.relationshipStartDate, countdownSettings.timezone))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="my-5 p-5 rounded-2xl bg-elsewhere-surface/80 border border-elsewhere-gold/30 shadow-clay-card shadow-glow-gold/10 text-center select-none">
      <p className="text-[10px] font-sans tracking-[0.25em] uppercase text-elsewhere-gold mb-1">
        Live Relationship Counter
      </p>

      {/* Big Headline Count */}
      <h3 className="font-serif text-4xl sm:text-5xl font-light text-elsewhere-textPrimary my-2">
        {liveTime.days} <span className="italic text-elsewhere-gold font-normal">Days</span>
      </h3>

      {/* Live Digital Ticking Bar (Days : Hours : Minutes : Seconds) */}
      <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 font-sans tabular-nums text-xs sm:text-sm my-2">
        <div className="flex items-baseline gap-0.5">
          <span className="font-bold text-elsewhere-textPrimary">{liveTime.days}</span>
          <span className="text-[10px] text-elsewhere-gold">d</span>
        </div>
        <span className="text-white/20">:</span>
        <div className="flex items-baseline gap-0.5">
          <span className="font-bold text-elsewhere-textPrimary">{String(liveTime.hours).padStart(2, '0')}</span>
          <span className="text-[10px] text-elsewhere-gold">h</span>
        </div>
        <span className="text-white/20">:</span>
        <div className="flex items-baseline gap-0.5">
          <span className="font-bold text-elsewhere-textPrimary">{String(liveTime.minutes).padStart(2, '0')}</span>
          <span className="text-[10px] text-elsewhere-gold">m</span>
        </div>
        <span className="text-white/20">:</span>
        <div className="flex items-baseline gap-0.5">
          <span className="font-bold text-elsewhere-gold">{String(liveTime.seconds).padStart(2, '0')}</span>
          <span className="text-[10px] text-elsewhere-gold">s</span>
        </div>
      </div>

      <p className="text-[11px] font-sans text-elsewhere-textMuted mt-1">
        Since February 22, 2026 &bull; Synced to Hanoi Time
      </p>
    </div>
  )
}

/**
 * MemoryPanel Component
 */
export default function MemoryPanel({
  isOpen,
  onClose,
  title,
  subtitle,
  text,
  date,
  status,
  primaryActionLabel,
  onPrimaryAction,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const isFuture = status === 'future'
  // Check if this is the days-together card
  const isDaysTogetherCard = title && title.includes('Days')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 select-none">
      {/* Atmospheric backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-elsewhere-void/85 backdrop-blur-md transition-opacity duration-500 animate-fadeIn"
      />

      {/* Tactile Card */}
      <div className="relative w-full max-w-lg bg-elsewhere-surface/95 border border-elsewhere-border rounded-3xl p-6 sm:p-8 shadow-clay-card z-10 animate-slideUp">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-elsewhere-gold shadow-glow-gold"></span>
            <span className="text-[11px] font-sans uppercase tracking-widest text-elsewhere-textMuted">
              {isFuture ? 'Future Memory' : 'Letter from Elsewhere'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-elsewhere-textMuted hover:text-elsewhere-textPrimary hover:bg-white/10 transition-all text-xs"
            title="Close letter (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Title and Subtitle */}
        <h2 className="font-serif text-2xl sm:text-3xl text-elsewhere-textPrimary mb-1 leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="font-serif italic text-sm text-elsewhere-gold mb-3">
            {subtitle}
          </p>
        )}

        {/* IF THIS IS THE DAYS CARD -> EMBED THE STYLISH LIVE COUNTER! */}
        {isDaysTogetherCard && <DaysTogetherLiveCard />}

        {/* Story Text */}
        <div className="my-4">
          <p className="font-serif text-base sm:text-lg text-elsewhere-textSecondary leading-relaxed whitespace-pre-line font-light">
            {text}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <span className="text-xs font-sans text-elsewhere-textMuted">
            {date || 'From the beginning'}
          </span>

          <div className="flex items-center gap-2">
            {primaryActionLabel ? (
              <button
                onClick={onPrimaryAction}
                className="px-5 py-2 rounded-full bg-elsewhere-gold text-elsewhere-void font-sans text-xs font-semibold hover:bg-yellow-300 transition-all shadow-glow-gold flex items-center gap-1.5"
              >
                <span>{primaryActionLabel}</span>
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-white/10 hover:bg-elsewhere-gold/20 hover:text-elsewhere-gold border border-white/15 text-xs font-sans font-medium transition-all shadow-clay-btn"
              >
                Fold & Put Away
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}