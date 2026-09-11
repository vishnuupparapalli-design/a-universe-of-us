import React, { useState } from 'react'
import Diorama from './components/Diorama'
import OpeningScene from './scenes/OpeningScene'
import ShelfScene from './scenes/ShelfScene'
import MemoryPanel from './components/MemoryPanel'
import CountdownWidget from './components/CountdownWidget'
import { siteSettings } from './data/settings'
import { letters } from './data/letters'
import { memories } from './data/memories'
import { movies } from './data/movies'
import { useDiscoveryState } from './hooks/useDiscoveryState'

export default function App() {
  const { discoveredCount, discover, isDiscovered, resetDiscovery } = useDiscoveryState()
  
  const [viewMode, setViewMode] = useState('arrival')
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [activeMemory, setActiveMemory] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)

  const openingLetter = letters[0]
  const allContent = [...memories, ...movies]

  const handleOpenEnvelope = () => {
    setIsEnvelopeOpen(true)
    discover(openingLetter.id)
  }

  const handleEnterWorld = () => {
    setIsEnvelopeOpen(false)
    setTransitioning(true)
    setTimeout(() => {
      setViewMode('shelf')
      setTransitioning(false)
    }, 600)
  }

  const handleReturnToOpening = () => {
    setTransitioning(true)
    setTimeout(() => {
      setViewMode('arrival')
      setIsEnvelopeOpen(false)
      setActiveMemory(null)
      setTransitioning(false)
    }, 400)
  }

  const handleSelectShelfObject = (id) => {
    const found = allContent.find((item) => item.id === id)
    if (found) {
      setActiveMemory(found)
      discover(found.id)
    }
  }

  // Find hovered object for dynamic banner
  const hoveredItem = allContent.find((item) => item.id === hoveredId)

  return (
    <div className="relative w-screen h-screen bg-elsewhere-void overflow-hidden text-elsewhere-textPrimary font-sans select-none">
      
      {/* Light Bloom Transition */}
      <div 
        className={`fixed inset-0 z-40 bg-amber-100/10 pointer-events-none transition-opacity duration-700 ${
          transitioning ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Top HUD */}
      <header className="absolute top-0 left-0 right-0 z-20 p-6 md:p-8 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-elsewhere-gold shadow-glow-gold animate-pulse"></span>
          <span className="font-serif text-2xl tracking-wider text-elsewhere-textPrimary">
            {siteSettings.title}
          </span>
          <span className="hidden sm:inline text-[10px] uppercase tracking-widest text-elsewhere-textMuted px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5">
            {viewMode === 'arrival' ? 'Stage 6: Arrival' : 'The Shelf (Living Hub)'}
          </span>
        </div>

        {/* Right HUD */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {viewMode === 'shelf' && (
            <>
              <button
                onClick={handleReturnToOpening}
                className="text-[11px] font-sans text-elsewhere-textMuted hover:text-elsewhere-textPrimary px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                title="Return to the opening letter"
              >
                ✉ Re-read letter
              </button>

              <CountdownWidget isVisible={true} />
            </>
          )}

          <div className="bg-elsewhere-surface/80 backdrop-blur-md border border-elsewhere-border rounded-full px-3.5 py-1.5 shadow-clay-card text-xs flex items-center gap-2">
            <span className="text-elsewhere-gold font-serif">★ {discoveredCount}</span>
            {discoveredCount > 1 && (
              <button
                onClick={resetDiscovery}
                className="text-[10px] text-elsewhere-textMuted hover:text-rose-400 underline transition-colors"
                title="Reset discovery state"
              >
                reset
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main 3D Diorama */}
      <main className="w-full h-full">
        {viewMode === 'arrival' ? (
          <Diorama>
            <OpeningScene
              isOpen={isEnvelopeOpen}
              onOpen={handleOpenEnvelope}
            />
          </Diorama>
        ) : (
          <Diorama>
            <ShelfScene
              onSelectObject={handleSelectShelfObject}
              onHoverObject={setHoveredId}
              isDiscovered={isDiscovered}
            />
          </Diorama>
        )}
      </main>

      {/* Bottom Guidance & Dynamic Shelf Banner */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 pb-6 sm:pb-8 flex flex-col items-center justify-center text-center pointer-events-none">
        {viewMode === 'arrival' ? (
          <>
            <p className="text-sm md:text-base font-serif italic text-elsewhere-textSecondary max-w-md mb-3 pointer-events-auto">
              "One meeting became a memory. Memories became stars. Stars became a little universe."
            </p>

            <div
              onClick={handleOpenEnvelope}
              className="cursor-pointer pointer-events-auto group bg-elsewhere-surface/80 hover:bg-elsewhere-surface hover:border-elsewhere-gold/40 backdrop-blur-md border border-elsewhere-border px-4 py-1.5 rounded-full shadow-clay-btn transition-all flex items-center gap-2 text-xs"
            >
              <span className="text-elsewhere-gold animate-bounce">✉</span>
              <span className="text-elsewhere-textSecondary group-hover:text-elsewhere-textPrimary">
                Click the envelope to read your letter
              </span>
              <span className="text-elsewhere-gold">✦</span>
            </div>
          </>
        ) : (
          <div className="pointer-events-auto transition-all duration-300 bg-elsewhere-surface/90 backdrop-blur-md border border-elsewhere-border px-6 py-2.5 rounded-full shadow-clay-card flex items-center gap-3 max-w-lg mx-4">
            <span className="text-elsewhere-gold text-xs">✦</span>
            <span className="font-serif text-sm text-elsewhere-textPrimary truncate">
              {hoveredItem 
                ? `${hoveredItem.title} — ${hoveredItem.approximateDate || 'Keepsake'}`
                : 'Hover or tap any keepsake to explore'}
            </span>
            <span className="text-elsewhere-gold text-xs">✦</span>
          </div>
        )}
      </footer>

      {/* Opening Letter Panel */}
      <MemoryPanel
        isOpen={isEnvelopeOpen}
        onClose={() => setIsEnvelopeOpen(false)}
        title={openingLetter.title}
        subtitle="Before you begin..."
        text="Everything here was built from what happened between two people who were far apart. We haven't experienced everything yet. That's the point. This world should grow with us."
        date="The Beginning"
        status={openingLetter.status}
        primaryActionLabel="Enter Our World →"
        onPrimaryAction={handleEnterWorld}
      />

      {/* Shelf Memory Panel */}
      {activeMemory && (
        <MemoryPanel
          isOpen={Boolean(activeMemory)}
          onClose={() => setActiveMemory(null)}
          title={activeMemory.title}
          subtitle={activeMemory.approximateDate || activeMemory.chapter}
          text={activeMemory.text}
          date={activeMemory.location || 'Elsewhere'}
          status={activeMemory.status}
        />
      )}
    </div>
  )
}