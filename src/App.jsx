import React, { useState } from 'react'
import Diorama from './components/Diorama'
import OpeningScene from './scenes/OpeningScene'
import MemoryPanel from './components/MemoryPanel'
import { siteSettings, countdownSettings } from './data/settings'
import { letters } from './data/letters'
import { useDiscoveryState } from './hooks/useDiscoveryState'

export default function App() {
  const { discoveredCount, discover, isDiscovered } = useDiscoveryState()
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false)

  // Use the opening letter from our data architecture
  const openingLetter = letters[0]

  const handleOpenEnvelope = () => {
    setIsEnvelopeOpen(true)
    discover(openingLetter.id) // Automatically records discovery state!
  }

  const handleCloseEnvelope = () => {
    setIsEnvelopeOpen(false)
  }

  return (
    <div className="relative w-screen h-screen bg-elsewhere-void overflow-hidden text-elsewhere-textPrimary font-sans select-none">
      {/* 1. Top HUD Overlay */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6 md:p-8 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-elsewhere-gold shadow-glow-gold animate-pulse"></span>
          <span className="font-serif text-2xl tracking-wider text-elsewhere-textPrimary">
            {siteSettings.title}
          </span>
          <span className="hidden sm:inline text-[10px] uppercase tracking-widest text-elsewhere-textMuted px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5">
            Stage 4: Interaction System
          </span>
        </div>

        {/* Discovery & Countdown HUD */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="bg-elsewhere-surface/80 backdrop-blur-md border border-elsewhere-border rounded-xl px-3.5 py-1.5 shadow-clay-card flex items-center gap-3">
            <span className="text-[10px] tracking-widest uppercase text-elsewhere-textMuted font-sans">
              {countdownSettings.title}
            </span>
            <span className="font-serif text-sm text-elsewhere-gold font-semibold">
              --
            </span>
          </div>

          <div className="bg-elsewhere-surface/80 backdrop-blur-md border border-elsewhere-border rounded-full px-3 py-1.5 shadow-clay-card text-xs">
            <span className="text-elsewhere-gold font-serif">★ {discoveredCount}</span>
          </div>
        </div>
      </header>

      {/* 2. The 3D Diorama Stage */}
      <main className="w-full h-full">
        <Diorama>
          <OpeningScene
            isOpen={isEnvelopeOpen}
            onOpen={handleOpenEnvelope}
          />
        </Diorama>
      </main>

      {/* 3. Bottom Atmospheric Guidance */}
      <footer className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-8 flex flex-col items-center justify-center text-center pointer-events-none">
        <p className="text-sm md:text-base font-serif italic text-elsewhere-textSecondary max-w-md mb-3 pointer-events-auto">
          "One meeting became a memory. Memories became stars. Stars became a little universe."
        </p>

        {/* Hover / Click Call-To-Action Pill */}
        <div
          onClick={handleOpenEnvelope}
          className="cursor-pointer pointer-events-auto group bg-elsewhere-surface/80 hover:bg-elsewhere-surface hover:border-elsewhere-gold/40 backdrop-blur-md border border-elsewhere-border px-4 py-1.5 rounded-full shadow-clay-btn transition-all flex items-center gap-2 text-xs"
        >
          <span className="text-elsewhere-gold animate-bounce">✉</span>
          <span className="text-elsewhere-textSecondary group-hover:text-elsewhere-textPrimary">
            {isEnvelopeOpen ? 'Reading letter...' : 'Hover over or click the envelope to open'}
          </span>
          <span className="text-elsewhere-gold">✦</span>
        </div>
      </footer>

      {/* 4. The Tactile Memory Panel (Slides in when opened) */}
      <MemoryPanel
        isOpen={isEnvelopeOpen}
        onClose={handleCloseEnvelope}
        title={openingLetter.title}
        subtitle={openingLetter.subtitle}
        text={openingLetter.text}
        date="The Beginning"
        status={openingLetter.status}
      />
    </div>
  )
}