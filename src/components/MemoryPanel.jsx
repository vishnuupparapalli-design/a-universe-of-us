import React, { useEffect } from 'react'

/**
 * MemoryPanel — Master Plan Section AD & G
 * Tactile overlay for reading letters, memories, and future notes.
 */
export default function MemoryPanel({ isOpen, onClose, title, subtitle, text, date, status }) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const isFuture = status === 'future'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 select-none">
      {/* Soft atmospheric backdrop blur */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-elsewhere-void/80 backdrop-blur-md transition-opacity duration-500 animate-fadeIn"
      />

      {/* The Tactile Card */}
      <div className="relative w-full max-w-lg bg-elsewhere-surface/95 border border-elsewhere-border rounded-3xl p-6 sm:p-8 shadow-clay-card z-10 transition-all duration-500 transform animate-slideUp">
        
        {/* Top Header */}
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
        <h2 className="font-serif text-2xl sm:text-3xl text-elsewhere-textPrimary mb-2 leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="font-serif italic text-sm text-elsewhere-gold mb-4">
            {subtitle}
          </p>
        )}

        {/* Letter Body Text */}
        <div className="my-6">
          <p className="font-serif text-base sm:text-lg text-elsewhere-textSecondary leading-relaxed whitespace-pre-line font-light">
            {text}
          </p>
        </div>

        {/* Bottom Metadata & Close Button */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs font-sans text-elsewhere-textMuted">
            {date || 'From the beginning'}
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-white/10 hover:bg-elsewhere-gold/20 hover:text-elsewhere-gold border border-white/15 text-xs font-sans font-medium transition-all shadow-clay-btn"
          >
            Fold & Put Away
          </button>
        </div>
      </div>
    </div>
  )
}