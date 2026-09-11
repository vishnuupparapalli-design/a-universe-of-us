import React from 'react'
import Diorama from './components/Diorama'
import OpeningScene from './scenes/OpeningScene'
import { siteSettings, countdownSettings } from './data/settings'
import { useDiscoveryState } from './hooks/useDiscoveryState'

export default function App() {
  const { discoveredCount } = useDiscoveryState()

  return (
    <div className="relative w-screen h-screen bg-elsewhere-void overflow-hidden text-elsewhere-textPrimary font-sans">
      {/* 1. Top HUD Overlay */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6 md:p-8 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-elsewhere-gold shadow-glow-gold animate-pulse"></span>
          <span className="font-serif text-2xl tracking-wider text-elsewhere-textPrimary">
            {siteSettings.title}
          </span>
          <span className="hidden sm:inline text-[10px] uppercase tracking-widest text-elsewhere-textMuted px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5">
            Stage 3: First Diorama
          </span>
        </div>

        {/* Countdown & Living Hub preview */}
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
          <OpeningScene />
        </Diorama>
      </main>

      {/* 3. Bottom Atmospheric Guidance (Subtle cues) */}
      <footer className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-8 flex flex-col items-center justify-center text-center pointer-events-none">
        <p className="text-sm md:text-base font-serif italic text-elsewhere-textSecondary max-w-md mb-2 pointer-events-auto">
          "One meeting became a memory. Memories became stars. Stars became a little universe."
        </p>
        
        <div className="flex items-center gap-2 text-[11px] font-sans tracking-wider uppercase text-elsewhere-textMuted pointer-events-auto bg-elsewhere-surface/60 backdrop-blur-sm border border-white/5 px-3 py-1 rounded-full">
          <span>✦</span>
          <span>Click and drag gently to tilt the world</span>
          <span>✦</span>
        </div>
      </footer>
    </div>
  )
}