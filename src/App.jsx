import React, { useState } from 'react'
import { siteSettings, countdownSettings } from './data/settings'
import { memories } from './data/memories'
import { movies } from './data/movies'
import { letters } from './data/letters'
import { useDiscoveryState } from './hooks/useDiscoveryState'

export default function App() {
  const { discoveredIds, discoveredCount, discover, isDiscovered, resetDiscovery } = useDiscoveryState()
  const [selectedItem, setSelectedItem] = useState(null)

  // Combine all items to test universal discovery
  const allItems = [...memories, ...movies]

  return (
    <div className="min-h-screen bg-elsewhere-void text-elsewhere-textPrimary p-6 md:p-12 flex flex-col justify-between font-sans selection:bg-elsewhere-gold/20 selection:text-elsewhere-gold">
      {/* Top Bar */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between pb-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-elsewhere-gold shadow-glow-gold animate-pulse"></span>
          <span className="font-serif text-2xl tracking-wider text-elsewhere-textPrimary">{siteSettings.title}</span>
          <span className="text-[11px] uppercase tracking-widest text-elsewhere-textMuted px-2 py-0.5 rounded bg-white/5 border border-white/5">
            Stage 2: Data Architecture
          </span>
        </div>

        {/* Discovery Counter (Subtle world feedback, not gamification) */}
        <div className="flex items-center gap-3 bg-elsewhere-surface/80 border border-elsewhere-border rounded-full px-4 py-1.5 shadow-clay-card">
          <span className="text-xs text-elsewhere-textMuted">Stars Ignited:</span>
          <span className="text-xs font-semibold text-elsewhere-gold font-serif">{discoveredCount} / {allItems.length}</span>
          {discoveredCount > 0 && (
            <button
              onClick={resetDiscovery}
              className="text-[10px] text-elsewhere-textMuted hover:text-rose-400 transition-colors underline ml-1"
              title="Reset discovery state in localStorage"
            >
              reset
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto w-full my-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-elsewhere-textMuted mb-2">
            Living Archive &bull; Data Verification
          </p>
          <h1 className="text-3xl md:text-5xl font-serif font-light text-elsewhere-textPrimary leading-tight mb-4">
            "One meeting became a memory.<br />
            <span className="italic text-elsewhere-gold font-normal">Memories became stars.</span>"
          </h1>
          <p className="text-sm text-elsewhere-textSecondary leading-relaxed">
            Click any entry below to simulate discovering it. Notice how its star lights up and stays remembered in your browser even if you refresh the page.
          </p>
        </div>

        {/* Interactive Memories List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {allItems.map((item) => {
            const discovered = isDiscovered(item.id)
            const isFuture = item.status === 'future'

            return (
              <div
                key={item.id}
                onClick={() => {
                  discover(item.id)
                  setSelectedItem(item)
                }}
                className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 shadow-clay-card flex flex-col justify-between ${
                  discovered
                    ? 'bg-elsewhere-surface border-elsewhere-gold/40 shadow-glow-gold/10'
                    : isFuture
                    ? 'bg-elsewhere-surface/40 border-dashed border-white/15 hover:border-white/30'
                    : 'bg-elsewhere-surface/60 border-elsewhere-border hover:border-elsewhere-borderHover'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-elsewhere-textMuted">
                      {item.chapter}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isFuture && (
                        <span className="text-[10px] uppercase tracking-wider text-elsewhere-dawn bg-elsewhere-dawn/10 px-2 py-0.5 rounded">
                          Future Placeholder
                        </span>
                      )}
                      <span className={`text-sm ${discovered ? 'text-elsewhere-gold' : 'text-white/20'}`}>
                        {discovered ? '★ Lit' : '☆ Unlit'}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-serif text-xl text-elsewhere-textPrimary mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-elsewhere-textSecondary line-clamp-2 leading-relaxed">
                    {item.text}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-elsewhere-textMuted">
                  <span>{item.location || item.approximateDate || 'Elsewhere'}</span>
                  <span>Coords: ({item.constellationPosition?.x}, {item.constellationPosition?.y})</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Letters Section Preview */}
        <div className="border border-white/10 rounded-2xl p-6 bg-elsewhere-surface/30 backdrop-blur-sm">
          <h2 className="font-serif text-xl text-elsewhere-textPrimary mb-4 flex items-center gap-2">
            <span>✉</span> Open-When Letters ({letters.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {letters.map((letter) => (
              <div key={letter.id} className="p-4 rounded-xl bg-white/5 border border-white/5">
                <h4 className="font-serif text-base text-elsewhere-textPrimary mb-1">{letter.title}</h4>
                <p className="text-xs text-elsewhere-gold font-serif italic mb-2">{letter.subtitle}</p>
                <p className="text-xs text-elsewhere-textSecondary leading-relaxed">{letter.text}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full pt-8 border-t border-white/5 text-xs text-elsewhere-textMuted flex flex-col md:flex-row items-center justify-between gap-2">
        <p>{countdownSettings.title} &bull; Target: {countdownSettings.targetDate} ({countdownSettings.timezone})</p>
        <p>Data Layer Verified &bull; Checked into Git</p>
      </footer>
    </div>
  )
}