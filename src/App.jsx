import React, { useState, useEffect } from 'react'
import Diorama from './components/Diorama'
import OpeningScene from './scenes/OpeningScene'
import ShelfScene from './scenes/ShelfScene'
import BeginningScene from './scenes/BeginningScene'
import DaysScene from './scenes/DaysScene'
import MovieScene from './scenes/MovieScene'
import StoriesScene from './scenes/StoriesScene'
import HardDaysScene from './scenes/HardDaysScene'
import DistanceScene from './scenes/DistanceScene'
import MemoryPanel from './components/MemoryPanel'
import CountdownWidget from './components/CountdownWidget'
import ConstellationLayer from './components/ConstellationLayer'
import WarpTransition from './components/WarpTransition'
import Timeline from './components/Timeline'
import { siteSettings, countdownSettings } from './data/settings'
import { letters } from './data/letters'
import { memories } from './data/memories'
import { movies } from './data/movies'
import { useDiscoveryState } from './hooks/useDiscoveryState'
import { getLiveTimeTogether } from './utils/countdown'

export default function App() {
  const { discoveredCount, discover, isDiscovered, resetDiscovery } = useDiscoveryState()
  
  const liveTime = getLiveTimeTogether(siteSettings.relationshipStartDate, countdownSettings.timezone)
  const currentDays = liveTime.days

  // ================= SMART PHOTO DETECTOR =================
  const [photoUrl, setPhotoUrl] = useState(() => {
    return localStorage.getItem('elsewhere_first_photo') || null
  })

  const handleUploadPhoto = (base64) => {
    setPhotoUrl(base64)
    localStorage.setItem('elsewhere_first_photo', base64)
    discover('someday-first-photo')

    setActiveMemory((prev) => prev ? {
      ...prev,
      status: 'past',
      image: base64,
      text: 'Our first photograph together. The day Elsewhere finally became here.'
    } : null)
  }

  useEffect(() => {
    if (photoUrl) return

    const commonNames = [
      './photos/first-photo.jpg',
      './photos/first-photo.png',
      './photos/photo.jpg',
      './photos/photo.png',
      './photos/us.jpg',
      './photos/us.png',
    ]

    for (let path of commonNames) {
      const img = new Image()
      img.src = path
      img.onload = () => setPhotoUrl(path)
    }
  }, [photoUrl])

  const processedMemories = memories.map((m) => {
    if (m.id === 'someday-first-photo') {
      const hasPhoto = Boolean(photoUrl)
      return {
        ...m,
        status: hasPhoto ? 'past' : 'future',
        image: photoUrl,
        text: hasPhoto
          ? 'Our first photograph together. The day Elsewhere finally became here.'
          : m.text,
      }
    }
    return m
  })

  // Experience Views: 'arrival' | 'shelf' | 'sky' | 'beginning' | 'days' | 'movie' | 'stories' | 'hard-days' | 'distance' | 'timeline'
  const [viewMode, setViewMode] = useState('arrival')
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [whiteFlash, setWhiteFlash] = useState(false)
  const [isWarping, setIsWarping] = useState(false)
  const [activeMemory, setActiveMemory] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)

  const openingLetter = letters[0]
  const allContent = [...processedMemories, ...movies]

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
      setIsWarping(false)
      setWhiteFlash(false)
      setTransitioning(false)
    }, 400)
  }

  const handleReturnToShelf = () => {
    setIsWarping(false)
    setWhiteFlash(false)
    setViewMode('shelf')
  }

  const handleSelectMemory = (id) => {
    // 1. Where It Started
    if (id === 'the-beginning' && viewMode !== 'beginning') {
      setIsWarping(true)
      return
    }

    // 2. Days Together Medallion
    if (id === 'two-hundred-three-days' && viewMode !== 'days') {
      setWhiteFlash(true)

      setTimeout(() => {
        setViewMode('days')
        discover('two-hundred-three-days')
      }, 280)

      setTimeout(() => {
        setWhiteFlash(false)
      }, 500)
      return
    }

    // 3. Movie Corner Projector
    if (id === 'movie-night-01' && viewMode === 'shelf') {
      setWhiteFlash(true)

      setTimeout(() => {
        setViewMode('movie')
        discover('movie-night-01')
      }, 280)

      setTimeout(() => {
        setWhiteFlash(false)
      }, 500)
      return
    }

    // 4. Our Stories (Two Books)
    if (id === 'our-stories' && viewMode === 'shelf') {
      setWhiteFlash(true)

      setTimeout(() => {
        setViewMode('stories')
        discover('our-stories')
      }, 280)

      setTimeout(() => {
        setWhiteFlash(false)
      }, 500)
      return
    }

    // 5. The Hard Days (Stone with Candle Ember)
    if (id === 'hard-days-01' && viewMode === 'shelf') {
      setWhiteFlash(true)

      setTimeout(() => {
        setViewMode('hard-days')
        discover('hard-days-01')
      }, 280)

      setTimeout(() => {
        setWhiteFlash(false)
      }, 500)
      return
    }

    // 6. Across the Distance (Cyan Thread)
    if (id === 'distance-thread' && viewMode === 'shelf') {
      setWhiteFlash(true)

      setTimeout(() => {
        setViewMode('distance')
        discover('distance-thread')
      }, 280)

      setTimeout(() => {
        setWhiteFlash(false)
      }, 500)
      return
    }

    // 7. Someday destination node
    if (id === 'someday-meeting') {
      setActiveMemory({
        id: 'someday-meeting',
        title: 'The Day We Finally Meet',
        approximateDate: 'When the time comes',
        text: 'The destination of this entire universe. When Elsewhere quietly becomes here.',
        location: 'In person',
        status: 'future',
      })
      return
    }

    // Standard memory modal opener
    const found = allContent.find((item) => item.id === id)
    if (found) {
      setActiveMemory(found)
      discover(found.id)
    }
  }

  const hoveredItem = allContent.find((item) => item.id === hoveredId)
  const showCountdown = viewMode !== 'arrival' && viewMode !== 'hard-days'

  return (
    <div className="relative w-screen h-screen bg-elsewhere-void overflow-hidden text-elsewhere-textPrimary font-sans select-none">
      
      {/* 1. Cinematic Starlight Wormhole Overlay */}
      <WarpTransition
        isActive={isWarping}
        onMidpoint={() => setViewMode('beginning')}
        onComplete={() => setIsWarping(false)}
      />

      {/* 2. Instant Pure White Light Bridge */}
      <div 
        className={`fixed inset-0 z-50 bg-white pointer-events-none transition-opacity duration-200 ease-out ${
          whiteFlash ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 3. Memory Constellation */}
      {viewMode !== 'arrival' && viewMode !== 'timeline' && (
        <ConstellationLayer
          items={allContent}
          isDiscovered={isDiscovered}
          onSelectStar={(item) => handleSelectMemory(item.id)}
          fullScreen={viewMode === 'sky'}
        />
      )}

      {/* 4. Atmospheric Transition Bloom */}
      <div 
        className={`fixed inset-0 z-40 bg-cyan-100/10 pointer-events-none transition-opacity duration-500 ${
          transitioning ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 5. Top HUD Bar */}
      <header className="absolute top-0 left-0 right-0 z-30 p-6 md:p-8 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-elsewhere-gold shadow-glow-gold animate-pulse"></span>
          <span className="font-serif text-2xl tracking-wider text-elsewhere-textPrimary">
            {siteSettings.title}
          </span>
          <span className="hidden sm:inline text-[10px] uppercase tracking-widest text-elsewhere-textMuted px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5">
            {viewMode === 'arrival'
              ? 'Arrival'
              : viewMode === 'beginning'
              ? 'Chapter 1: The Beginning'
              : viewMode === 'days'
              ? `Chapter 2: ${currentDays} Days Galaxy`
              : viewMode === 'movie'
              ? 'Chapter 3: Movie Corner'
              : viewMode === 'stories'
              ? 'Chapter 4: Our Stories'
              : viewMode === 'hard-days'
              ? 'Chapter 5: The Hard Days'
              : viewMode === 'distance'
              ? 'Chapter 6: Across the Distance'
              : viewMode === 'timeline'
              ? 'Storyline: Timeline'
              : viewMode === 'sky'
              ? 'The Sky Between Us'
              : 'The Shelf (Living Hub)'}
          </span>
        </div>

        {/* Right HUD */}
        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
          {viewMode !== 'arrival' && (
            <>
              {/* Timeline Toggle Button */}
              <button
                onClick={() => setViewMode(viewMode === 'timeline' ? 'shelf' : 'timeline')}
                className={`text-xs font-sans px-3.5 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
                  viewMode === 'timeline'
                    ? 'bg-cyan-400 text-elsewhere-void border-cyan-400 font-semibold shadow-glow-star'
                    : 'bg-white/5 hover:bg-white/10 text-elsewhere-textSecondary border-white/10'
                }`}
                title="Toggle chronological timeline"
              >
                <span>{viewMode === 'timeline' ? '📚 Shelf' : '📜 Timeline'}</span>
              </button>

              {/* View Mode Switcher */}
              {viewMode !== 'timeline' && (
                viewMode === 'beginning' || viewMode === 'days' || viewMode === 'movie' || viewMode === 'stories' || viewMode === 'hard-days' || viewMode === 'distance' ? (
                  <button
                    onClick={handleReturnToShelf}
                    className="text-xs font-sans px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-elsewhere-textPrimary border border-white/10 transition-all flex items-center gap-1.5 shadow-clay-btn"
                  >
                    <span>📚 Return to Shelf</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setViewMode(viewMode === 'sky' ? 'shelf' : 'sky')}
                    className={`text-xs font-sans px-3.5 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
                      viewMode === 'sky'
                        ? 'bg-elsewhere-gold text-elsewhere-void border-elsewhere-gold font-semibold shadow-glow-gold'
                        : 'bg-white/5 hover:bg-white/10 text-elsewhere-textSecondary border-white/10'
                    }`}
                    title="Toggle constellation night sky"
                  >
                    <span>{viewMode === 'sky' ? '📚 Shelf' : '🌌 The Sky'}</span>
                  </button>
                )
              )}

              <button
                onClick={handleReturnToOpening}
                className="hidden md:block text-[11px] font-sans text-elsewhere-textMuted hover:text-elsewhere-textPrimary px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                title="Return to opening letter"
              >
                ✉ Re-read letter
              </button>

              <CountdownWidget isVisible={showCountdown} />
            </>
          )}

          {/* Star Counter */}
          <div className="bg-elsewhere-surface/80 backdrop-blur-md border border-elsewhere-border rounded-full px-3.5 py-1.5 shadow-clay-card text-xs flex items-center gap-2">
            <span className="text-elsewhere-gold font-serif">★ {discoveredCount}</span>
            {discoveredCount > 1 && (
              <button
                onClick={() => {
                  resetDiscovery()
                  localStorage.removeItem('elsewhere_first_photo')
                  setPhotoUrl(null)
                  setActiveMemory(null)
                }}
                className="text-[10px] text-elsewhere-textMuted hover:text-rose-400 underline transition-colors"
                title="Reset discovery state and photo"
              >
                reset
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 6. Main Stage View */}
      <main className="w-full h-full relative z-10">
        {viewMode === 'arrival' ? (
          <Diorama>
            <OpeningScene
              isOpen={isEnvelopeOpen}
              onOpen={handleOpenEnvelope}
            />
          </Diorama>
        ) : viewMode === 'shelf' ? (
          <Diorama>
            <ShelfScene
              onSelectObject={handleSelectMemory}
              onHoverObject={setHoveredId}
              isDiscovered={isDiscovered}
            />
          </Diorama>
        ) : viewMode === 'beginning' ? (
          <Diorama>
            <BeginningScene
              onMerged={() => discover('the-beginning')}
            />
          </Diorama>
        ) : viewMode === 'days' ? (
          <Diorama>
            <DaysScene
              currentDays={currentDays}
              onSelectMilestone={(milestone) => {
                setActiveMemory({
                  title: milestone.title,
                  approximateDate: milestone.date,
                  text: milestone.text,
                  location: `${currentDays} Days Galaxy`,
                })
              }}
            />
          </Diorama>
        ) : viewMode === 'movie' ? (
          <Diorama>
            <MovieScene
              onSelectTicket={(ticketKey) => {
                if (ticketKey === 'first-film') {
                  const found = allContent.find((it) => it.id === 'movie-night-01')
                  if (found) {
                    setActiveMemory(found)
                    discover('movie-night-01')
                  }
                } else {
                  const found = allContent.find((it) => it.id === 'midnight-movies')
                  if (found) {
                    setActiveMemory(found)
                    discover('midnight-movies')
                  }
                }
              }}
            />
          </Diorama>
        ) : viewMode === 'stories' ? (
          <Diorama>
            <StoriesScene
              onSelectStory={(storyKey) => {
                if (storyKey === 'her-story') {
                  const found = allContent.find((it) => it.id === 'our-stories')
                  if (found) {
                    setActiveMemory(found)
                    discover('our-stories')
                  }
                } else {
                  const found = allContent.find((it) => it.id === 'my-story')
                  if (found) {
                    setActiveMemory(found)
                    discover('my-story')
                  }
                }
              }}
            />
          </Diorama>
        ) : viewMode === 'hard-days' ? (
          <Diorama>
            <HardDaysScene
              onOpenMemory={() => {
                const found = allContent.find((it) => it.id === 'hard-days-01')
                if (found) {
                  setActiveMemory(found)
                  discover('hard-days-01')
                }
              }}
            />
          </Diorama>
        ) : viewMode === 'distance' ? (
          <Diorama>
            <DistanceScene
              onOpenMemory={() => {
                const found = allContent.find((it) => it.id === 'distance-thread')
                if (found) {
                  setActiveMemory(found)
                  discover('distance-thread')
                }
              }}
            />
          </Diorama>
        ) : viewMode === 'timeline' ? (
          <Timeline
            isDiscovered={isDiscovered}
            onSelectMemory={handleSelectMemory}
            currentDays={currentDays}
          />
        ) : null}
      </main>

      {/* 7. Bottom Guidance */}
      {viewMode !== 'timeline' && (
        <footer className="absolute bottom-0 left-0 right-0 z-30 pb-6 sm:pb-8 flex flex-col items-center justify-center text-center pointer-events-none">
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
          ) : viewMode === 'beginning' ? (
            <div className="pointer-events-auto flex flex-col sm:flex-row items-center gap-3">
              <div className="bg-elsewhere-surface/90 backdrop-blur-md border border-elsewhere-border px-6 py-2.5 rounded-full shadow-clay-card flex items-center gap-2.5">
                <span className="text-elsewhere-star text-xs">✦</span>
                <span className="font-serif text-sm text-elsewhere-textPrimary">
                  {isDiscovered('the-beginning')
                    ? 'Two people, two screens, one small world between them.'
                    : 'Click anywhere on the island to bring the lights together'}
                </span>
                <span className="text-elsewhere-gold text-xs">✦</span>
              </div>

              {isDiscovered('the-beginning') && (
                <button
                  onClick={() => setViewMode('sky')}
                  className="px-5 py-2.5 rounded-full bg-elsewhere-gold hover:bg-yellow-300 text-elsewhere-void font-sans text-xs font-semibold shadow-glow-gold transition-all animate-bounce flex items-center gap-1.5"
                >
                  <span>🌌 See Your Star in the Sky →</span>
                </button>
              )}
            </div>
          ) : viewMode === 'days' ? (
            <div className="pointer-events-auto bg-elsewhere-surface/90 backdrop-blur-md border border-elsewhere-border px-6 py-2.5 rounded-full shadow-clay-card flex items-center gap-3">
              <span className="text-elsewhere-gold text-xs">✦</span>
              <span className="font-serif text-sm text-elsewhere-textPrimary">
                {currentDays} Days Galaxy — Every star is a real day. Click glowing milestone stars to explore memories
              </span>
              <span className="text-elsewhere-gold text-xs">✦</span>
            </div>
          ) : viewMode === 'movie' ? (
            <div className="pointer-events-auto bg-elsewhere-surface/90 backdrop-blur-md border border-elsewhere-border px-6 py-2.5 rounded-full shadow-clay-card flex items-center gap-3">
              <span className="text-elsewhere-gold text-xs">✦</span>
              <span className="font-serif text-sm text-elsewhere-textPrimary">
                Movie Corner — Click either ticket or its name tag to read movie memories
              </span>
              <span className="text-elsewhere-gold text-xs">✦</span>
            </div>
          ) : viewMode === 'stories' ? (
            <div className="pointer-events-auto bg-elsewhere-surface/90 backdrop-blur-md border border-elsewhere-border px-6 py-2.5 rounded-full shadow-clay-card flex items-center gap-3">
              <span className="text-amber-400 text-xs">✦</span>
              <span className="font-serif text-sm text-elsewhere-textPrimary">
                Our Stories — Click either book or its name tag to read about learning each other's worlds
              </span>
              <span className="text-amber-400 text-xs">✦</span>
            </div>
          ) : viewMode === 'hard-days' ? (
            <div className="pointer-events-auto bg-elsewhere-surface/90 backdrop-blur-md border border-elsewhere-border px-6 py-2.5 rounded-full shadow-clay-card flex items-center gap-2.5">
              <span className="text-amber-200 text-xs">🕯</span>
              <span className="font-serif text-sm text-elsewhere-textPrimary">
                The Hard Days — Click the warm candle stone to read
              </span>
              <span className="text-amber-200 text-xs">🕯</span>
            </div>
          ) : viewMode === 'distance' ? (
            <div className="pointer-events-auto bg-elsewhere-surface/90 backdrop-blur-md border border-elsewhere-border px-6 py-2.5 rounded-full shadow-clay-card flex items-center gap-3">
              <span className="text-cyan-300 text-xs">✦</span>
              <span className="font-serif text-sm text-elsewhere-textPrimary">
                Across the Distance — Click either beacon or the thread connecting Dharmavaram & Near Hanoi
              </span>
              <span className="text-cyan-300 text-xs">✦</span>
            </div>
          ) : viewMode === 'sky' ? (
            <div className="pointer-events-auto bg-elsewhere-surface/90 backdrop-blur-md border border-elsewhere-border px-6 py-2.5 rounded-full shadow-clay-card flex items-center gap-3">
              <span className="text-elsewhere-gold text-xs">✦</span>
              <span className="font-serif text-sm text-elsewhere-textPrimary">
                The Sky Between Us — Click any star or hollow ring to explore
              </span>
              <span className="text-elsewhere-gold text-xs">✦</span>
            </div>
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
      )}

      {/* Opening Letter Modal */}
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

      {/* Keepsake Story Modal */}
      {activeMemory && (
        <MemoryPanel
          isOpen={Boolean(activeMemory)}
          onClose={() => setActiveMemory(null)}
          title={activeMemory.title}
          subtitle={activeMemory.approximateDate || activeMemory.chapter}
          text={activeMemory.text}
          date={activeMemory.location || 'Elsewhere'}
          status={activeMemory.status}
          image={activeMemory.image}
          onUploadPhoto={handleUploadPhoto}
        />
      )}
    </div>
  )
}