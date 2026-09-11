import React, { useState } from 'react'
import { WORLD_BIBLE } from './styles/worldBible'

export default function App() {
  const [activeAtmosphere, setActiveAtmosphere] = useState('beginning')
  const current = WORLD_BIBLE.atmospheres[activeAtmosphere]

  return (
    <div 
      className="min-h-screen transition-colors duration-700 p-6 md:p-12 flex flex-col justify-between"
      style={{ backgroundColor: current.ambient }}
    >
      {/* Top Persistent Bar Preview (Countdown + Nav Thread) */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between pb-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-elsewhere-gold shadow-glow-gold animate-pulse"></span>
          <span className="font-serif text-xl tracking-wider text-elsewhere-textPrimary">Elsewhere</span>
          <span className="text-xs font-sans uppercase tracking-widest text-elsewhere-textMuted px-2 py-0.5 rounded bg-white/5">
            Living Archive
          </span>
        </div>

        {/* Persistent Countdown Widget Preview (Section F2) */}
        <div className="bg-elsewhere-surface/80 backdrop-blur-md border border-elsewhere-border rounded-xl px-4 py-2 flex items-center gap-4 shadow-clay-card">
          <div className="text-right">
            <p className="text-[10px] font-sans tracking-widest uppercase text-elsewhere-textMuted">Until We Meet</p>
            <p className="text-xs font-sans text-elsewhere-textSecondary">Target Date Set</p>
          </div>
          <div className="flex items-baseline gap-1.5 font-sans">
            <span className="text-lg font-semibold text-elsewhere-textPrimary">--</span>
            <span className="text-[10px] text-elsewhere-textMuted uppercase">days</span>
          </div>
        </div>
      </header>

      {/* Main Experience Hero Mock */}
      <main className="max-w-4xl mx-auto w-full my-auto py-12 text-center">
        {/* Guiding Metaphor */}
        <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-elsewhere-textMuted font-sans mb-4">
          Visual Design System & Atmosphere Preview
        </p>

        <h1 className="text-4xl md:text-6xl font-serif font-light text-elsewhere-textPrimary mb-6 leading-tight">
          "One meeting became a memory.<br />
          <span className="italic text-elsewhere-gold font-normal">Memories became stars.</span><br />
          Stars became a little universe."
        </h1>

        <p className="text-base md:text-lg text-elsewhere-textSecondary font-sans font-light max-w-xl mx-auto mb-10 leading-relaxed">
          {current.headline}
        </p>

        {/* Tactile Claymorphic Cards Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-12">
          {/* Card 1: Claymorphic Primitive */}
          <div className="bg-elsewhere-surface/90 border border-elsewhere-border rounded-2xl p-6 shadow-clay-card hover:border-elsewhere-borderHover transition-all">
            <div className="w-8 h-8 rounded-lg bg-elsewhere-surfaceLight border border-white/10 flex items-center justify-center mb-4 text-elsewhere-gold">
              ★
            </div>
            <h3 className="font-serif text-lg text-elsewhere-textPrimary mb-1">The First Star</h3>
            <p className="text-xs font-sans text-elsewhere-textSecondary leading-relaxed">
              Born from The Beginning. Every other star in the constellation traces back toward it.
            </p>
          </div>

          {/* Card 2: Living Archive & Future Memory */}
          <div className="bg-elsewhere-surface/90 border border-dashed border-white/20 rounded-2xl p-6 shadow-clay-card">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-elsewhere-dawn">
              ◌
            </div>
            <h3 className="font-serif text-lg text-elsewhere-textPrimary mb-1">An Empty Frame</h3>
            <p className="text-xs font-sans text-elsewhere-textMuted leading-relaxed">
              Not missing content—the photo we haven't taken yet. Ready to flip from future to past.
            </p>
          </div>

          {/* Card 3: Reserved Muted Gold Accent */}
          <div className="bg-elsewhere-surface/90 border border-elsewhere-gold/30 rounded-2xl p-6 shadow-clay-card shadow-glow-gold">
            <div className="w-8 h-8 rounded-lg bg-elsewhere-gold/10 border border-elsewhere-gold/30 flex items-center justify-center mb-4 text-elsewhere-gold">
              ✦
            </div>
            <h3 className="font-serif text-lg text-elsewhere-gold mb-1">201 Days</h3>
            <p className="text-xs font-sans text-elsewhere-textSecondary leading-relaxed">
              Reserved muted gold tone: strictly for special moments, never used as decorative filler.
            </p>
          </div>
        </div>

        {/* Interactive Atmosphere Switcher (Validates Chapter Palettes) */}
        <div className="inline-flex flex-wrap justify-center items-center gap-2 p-1.5 rounded-full bg-elsewhere-surface/60 border border-elsewhere-border backdrop-blur-md">
          {Object.entries(WORLD_BIBLE.atmospheres).map(([key, atm]) => (
            <button
              key={key}
              onClick={() => setActiveAtmosphere(key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-sans transition-all ${
                activeAtmosphere === key
                  ? 'bg-white/15 text-elsewhere-textPrimary shadow-clay-btn'
                  : 'text-elsewhere-textMuted hover:text-elsewhere-textSecondary'
              }`}
            >
              {atm.name}
            </button>
          ))}
        </div>
      </main>

      {/* Footer System Verification */}
      <footer className="max-w-5xl mx-auto w-full pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans text-elsewhere-textMuted">
        <p>Stage 1: Design System & Shared Visual Language</p>
        <div className="flex items-center gap-6">
          <span>Serif: Cormorant Garamond</span>
          <span>Sans: Plus Jakarta Sans</span>
          <span>Tailwind v3.4.17</span>
        </div>
      </footer>
    </div>
  )
}