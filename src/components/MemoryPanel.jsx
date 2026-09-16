import React, { useState, useEffect, useRef } from 'react'
import { siteSettings, countdownSettings } from '../data/settings'
import { getLiveTimeTogether } from '../utils/countdown'

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
      <p className="text-[10px] font-sans tracking-[0.25em] uppercase text-elsewhere-gold mb-1 font-semibold">
        Live Relationship Counter
      </p>

      <h3 className="font-serif text-4xl sm:text-5xl font-light text-elsewhere-textPrimary my-2">
        {liveTime.days} <span className="italic text-elsewhere-gold font-normal">Days</span>
      </h3>

      <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 font-sans tabular-nums text-xs sm:text-sm my-2">
        <div className="flex items-baseline gap-0.5">
          <span className="font-bold text-elsewhere-textPrimary">{liveTime.days}</span>
          <span className="text-[10px] text-elsewhere-gold font-semibold">d</span>
        </div>
        <span className="text-white/20">:</span>
        <div className="flex items-baseline gap-0.5">
          <span className="font-bold text-elsewhere-textPrimary">{String(liveTime.hours).padStart(2, '0')}</span>
          <span className="text-[10px] text-elsewhere-gold font-semibold">h</span>
        </div>
        <span className="text-white/20">:</span>
        <div className="flex items-baseline gap-0.5">
          <span className="font-bold text-elsewhere-textPrimary">{String(liveTime.minutes).padStart(2, '0')}</span>
          <span className="text-[10px] text-elsewhere-gold font-semibold">m</span>
        </div>
        <span className="text-white/20">:</span>
        <div className="flex items-baseline gap-0.5">
          <span className="font-bold text-elsewhere-textPrimary">{String(liveTime.seconds).padStart(2, '0')}</span>
          <span className="text-[10px] text-elsewhere-gold font-semibold">s</span>
        </div>
      </div>

      <p className="text-[11px] font-sans text-elsewhere-textMuted mt-1">
        Since February 22, 2026 &bull; Synced to Hanoi Time
      </p>
    </div>
  )
}

export default function MemoryPanel({
  isOpen,
  onClose,
  title,
  subtitle,
  text,
  date,
  image,
  status = 'past',
  onUploadPhoto,
  primaryActionLabel,
  onPrimaryAction,
}) {
  const fileInputRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const isFuture = status === 'future'
  const isMainDaysCard = title && (title.includes('206 Days') || title.includes('Today — Choosing You Still')) && !title.includes('Day 200') && !title.includes('Day 100') && !title.includes('Day 50') && !title.includes('Day 1 ')

  // Handle choosing photo from phone or computer gallery
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64Url = event.target.result
      if (onUploadPhoto) {
        onUploadPhoto(base64Url)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 select-none">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-elsewhere-void/85 backdrop-blur-md transition-opacity duration-500 animate-fadeIn"
      />

      <div className={`relative w-full max-w-lg bg-elsewhere-surface/95 border rounded-3xl p-6 sm:p-8 shadow-clay-card z-10 animate-slideUp transition-colors duration-500 ${
        isFuture ? 'border-dashed border-rose-300/30' : 'border-elsewhere-border'
      }`}>
        
        {/* Hidden File Input for Phone Gallery / Computer upload */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              isFuture 
                ? 'border border-rose-300 bg-rose-400/20' 
                : 'bg-cyan-400 shadow-glow-star'
            }`}></span>
            <span className="text-[11px] font-sans uppercase tracking-widest text-elsewhere-textMuted font-medium">
              {isFuture ? 'Future Memory — A Promise' : 'Memory from Elsewhere'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-elsewhere-textMuted hover:text-elsewhere-textPrimary hover:bg-white/10 transition-all text-xs"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>

        {/* ================= FUTURE MEMORY: TACTILE EMPTY POLAROID ================= */}
        {isFuture && (
          <div className="my-5 p-4 rounded-2xl bg-white/5 border border-dashed border-white/15 text-center">
            {/* The Polaroid Frame */}
            <div className="mx-auto w-44 sm:w-52 bg-[#f4eee4] p-3 pb-8 rounded-lg shadow-clay-card transform -rotate-1">
              {/* Empty Photo Window */}
              <div className="w-full h-36 sm:h-44 bg-[#141b29] rounded flex flex-col items-center justify-center border border-black/10 text-center p-3">
                <span className="text-2xl text-rose-300/60 mb-2 animate-pulse">○</span>
                <p className="text-[10px] font-sans uppercase tracking-widest text-white/40 font-medium">
                  Reserved For Light
                </p>
                <p className="text-[11px] font-serif italic text-white/60 mt-1">
                  The photo we haven't taken yet
                </p>
              </div>
            </div>

            {/* DIRECT BUTTON: Choose from Phone Gallery or Computer! */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 px-4 py-1.5 rounded-full bg-rose-400/15 hover:bg-rose-400/25 border border-rose-300/30 text-rose-200 text-xs font-sans transition-all flex items-center gap-1.5 mx-auto"
            >
              <span>📷</span>
              <span>Add photo from phone gallery or files</span>
            </button>
          </div>
        )}

        {/* ================= PAST MEMORY: REAL PHOTO ================= */}
        {!isFuture && image && (
          <div className="my-5 p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
            <div className="bg-[#f4eee4] p-3 pb-8 rounded-lg shadow-clay-card max-w-xs w-full">
              <img 
                src={image} 
                alt={title}
                className="w-full h-48 object-cover rounded border border-black/10"
              />
              <p className="text-[11px] font-serif italic text-stone-700 text-center mt-2">
                {date || 'A memory made real'}
              </p>
            </div>

            {/* Change Photo Option */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-[10px] text-elsewhere-textMuted hover:text-white underline transition-colors"
            >
              Change or update photo
            </button>
          </div>
        )}

        {/* Title and Subtitle */}
        <h2 className="font-serif text-2xl sm:text-3xl text-elsewhere-textPrimary mb-1 leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="font-serif italic text-sm text-cyan-300 mb-3">
            {subtitle}
          </p>
        )}

        {/* Live counter rendered only for main Today card */}
        {isMainDaysCard && <DaysTogetherLiveCard />}

        {/* Story Text */}
        <div className="my-4">
          <p className="font-serif text-base sm:text-lg text-elsewhere-textSecondary leading-relaxed whitespace-pre-line font-light">
            {text}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <span className="text-xs font-sans text-elsewhere-textMuted">
            {date || (isFuture ? 'Waiting for someday' : 'From the beginning')}
          </span>

          <div className="flex items-center gap-2">
            {primaryActionLabel ? (
              <button
                onClick={onPrimaryAction}
                className="px-5 py-2 rounded-full bg-cyan-400 hover:bg-cyan-300 text-elsewhere-void font-sans text-xs font-semibold shadow-glow-star transition-all flex items-center gap-1.5"
              >
                <span>{primaryActionLabel}</span>
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-sans font-medium transition-all shadow-clay-btn"
              >
                {isFuture ? 'Keep The Promise' : 'Fold & Put Away'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}