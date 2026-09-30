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
import SomedayScene from './scenes/SomedayScene'
import FinalLetterScene from './scenes/FinalLetterScene'
import MemoryPanel from './components/MemoryPanel'
import CountdownWidget from './components/CountdownWidget'
import ConstellationLayer from './components/ConstellationLayer'
import WarpTransition from './components/WarpTransition'
import Timeline from './components/Timeline'
import AtmosphereController from './components/AtmosphereController'
import { siteSettings, countdownSettings } from './data/settings'
import { letters } from './data/letters'
import { memories } from './data/memories'
import { movies } from './data/movies'
import { finalLetterData } from './data/finalLetter'
import { useDiscoveryState } from './hooks/useDiscoveryState'
import { getLiveTimeTogether } from './utils/countdown'

export default function App() {
  const { discoveredCount, discover, isDiscovered, resetDiscovery } = useDiscoveryState()
  
  const liveTime = getLiveTimeTogether(siteSettings.relationshipStartDate, countdownSettings.timezone)
  const currentDays = liveTime.days

  // ================= UNIVERSAL PERMANENT PHOTO STORAGE =================
  const [savedPhotos, setSavedPhotos] = useState(() => {
    const photos = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('elsewhere_photo_')) {
        const memId = key.replace('elsewhere_photo_', '')
        photos[memId] = localStorage.getItem(key)
      }
    }
    // Backward compatibility for old first photo key
    if (localStorage.getItem('elsewhere_photo_first')) {
      photos['someday-first-photo'] = localStorage.getItem('elsewhere_photo_first')
    }
    return photos
  })

  // Saves any compressed photo permanently to its exact memory ID!
  const handleUploadPhoto = (compressedBase64) => {
    if (!activeMemory) return
    const memId = activeMemory.id

    try {
      localStorage.setItem(`elsewhere_photo_${memId}`, compressedBase64)
      setSavedPhotos((prev) => ({ ...prev, [memId]: compressedBase64 }))
      discover(memId)

      // Immediately transform the open card so the photo appears right away!
      setActiveMemory((prev) => prev ? {
        ...prev,
        status: 'past',
        image: compressedBase64,
        date: 'A memory made real',
      } : null)
    } catch (err) {
      console.warn("Storage error:", err)
    }
  }

  // Check public folder as fallback
  useEffect(() => {
    const commonNames = [
      { id: 'someday-first-photo', path: './photos/first-photo.jpg' },
      { id: 'someday-first-photo', path: './photos/first-photo.png' },
    ]

    commonNames.forEach(({ id, path }) => {
      if (savedPhotos[id]) return
      const img = new Image()
      img.src = path
      img.onload = () => {
        setSavedPhotos((prev) => ({ ...prev, [id]: path }))
      }
    })
  }, [savedPhotos])

  // Dynamically update memories with their saved photos
  const processedMemories = memories.map((m) => {
    const photo = savedPhotos[m.id]
    if (photo) {
      return {
        ...m,
        status: 'past',
        image: photo,
      }
    }
    return m
  })

  const isFinalStarLit = isDiscovered(finalLetterData.id)

  // Experience Views
  const [viewMode, setViewMode] = useState('arrival')
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false)
  const [isFinalEnvelopeOpen, setIsFinalEnvelopeOpen] = useState(false)
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

  const transitionToChapter = (chapterView, memoryId) => {
    setWhiteFlash(true)
    setTimeout(() => {
      setViewMode(chapterView)
      if (memoryId) discover(memoryId)
    }, 450)
    setTimeout(() => setWhiteFlash(false), 650)
  }

  const handleSelectMemory = (id) => {
    // Timeline Rule: Always open the story card directly!
    if (viewMode === 'timeline') {
      const found = allContent.find((item) => item.id === id)
      if (found) {
        setActiveMemory(found)
        discover(found.id)
      }
      return
    }

    // 1. Where It Started
    if (id === 'the-beginning') {
      setIsWarping(true)
      return
    }

    // 2. Days Together Medallion
    if (id === 'two-hundred-three-days') {
      transitionToChapter('days', 'two-hundred-three-days')
      return
    }

    if (id === 'movie-night-01' && viewMode === 'shelf') {
      transitionToChapter('movie', 'movie-night-01')
      return
    }
    if (id === 'our-stories' && viewMode === 'shelf') {
      transitionToChapter('stories', 'our-stories')
      return
    }
    if (id === 'hard-days-01' && viewMode === 'shelf') {
      transitionToChapter('hard-days', 'hard-days-01')
      return
    }
    if (id === 'distance-thread' && viewMode === 'shelf') {
      transitionToChapter('distance', 'distance-thread')
      return
    }
    if (id === 'someday-first-photo' && viewMode === 'shelf') {
      transitionToChapter('someday-room', 'someday-first-photo')
      return
    }

    const found = allContent.find((item) => item.id === id)
    if (found) {
      setActiveMemory(found)
      discover(found.id)
    }
  }

  const handleOpenFinalLetter = () => {
    setIsFinalEnvelopeOpen(true)
    discover(finalLetterData.id)
    setActiveMemory(finalLetterData)
  }

  const hoveredItem = allContent.find((item) => item.id === hoveredId)
  const showCountdown = viewMode !== 'arrival' && viewMode !== 'hard-days' && viewMode !== 'final-letter'
  const isViewingFinalLetter = activeMemory && activeMemory.id === finalLetterData.id

  return (
    <div className="relative w-screen h-screen overflow-hidden text-elsewhere-textPrimary font-sans select-none">
      
      <AtmosphereController viewMode={viewMode} />

      <WarpTransition
        isActive={isWarping}
        onMidpoint={() => setViewMode('beginning')}
        onComplete={() => setIsWarping(false)}
      />

      <div 
        className={`fixed inset-0 z-50 bg-white pointer-events-none transition-opacity duration-150 ease-out ${
          whiteFlash ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {viewMode !== 'arrival' && viewMode !== 'timeline' && (
        <ConstellationLayer
          items={allContent}
          isDiscovered={isDiscovered}
          onSelectStar={(item) => handleSelectMemory(item.id)}
          fullScreen={viewMode === 'sky'}
          finalStarLit={isFinalStarLit}
          onSelectFinalStar={() => setActiveMemory(finalLetterData)}
        />
      )}

      <div 
        className={`fixed inset-0 z-40 bg-cyan-100/10 pointer-events-none transition-opacity duration-500 ${
          transitioning ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Top HUD */}
      <header className="absolute top-0 left-0 right-0 z-30 p-3 sm:p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pointer-events-none">
        <div className="flex items-center justify-between sm:justify-start gap-2.5 pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-elsewhere-gold shadow-glow-gold animate-pulse"></span>
            <span className="font-serif text-xl sm:text-2xl tracking-wider text-elsewhere-textPrimary">
              {siteSettings.title}
            </span>
          </div>

          <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-elsewhere-textMuted px-2 py-0.5 rounded-full bg-white/5 border border-white/5 truncate max-w-[140px] sm:max-w-none">
            {viewMode === 'arrival'
              ? 'Arrival'
              : viewMode === 'beginning'
              ? 'The Beginning'
              : viewMode === 'days'
              ? `${currentDays} Days Galaxy`
              : viewMode === 'movie'
              ? 'Movie Corner'
              : viewMode === 'stories'
              ? 'Our Stories'
              : viewMode === 'hard-days'
              ? 'The Hard Days'
              : viewMode === 'distance'
              ? 'Across Distance'
              : viewMode === 'someday-room'
              ? 'Someday Museum'
              : viewMode === 'final-letter'
              ? 'The Final Letter'
              : viewMode === 'timeline'
              ? 'Timeline'
              : viewMode === 'sky'
              ? 'The Sky'
              : 'The Shelf'}
          </span>
        </div>

        <div className="flex items-center justify-end flex-wrap gap-1.5 sm:gap-2.5 pointer-events-auto">
          {viewMode !== 'arrival' && (
            <>
              <button
                onClick={() => setViewMode(viewMode === 'timeline' ? 'shelf' : 'timeline')}
                className={`text-[11px] sm:text-xs font-sans px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border transition-all flex items-center gap-1 ${
                  viewMode === 'timeline'
                    ? 'bg-cyan-400 text-elsewhere-void border-cyan-400 font-semibold shadow-glow-star'
                    : 'bg-white/5 hover:bg-white/10 text-elsewhere-textSecondary border-white/10'
                }`}
                title="Toggle chronological timeline"
              >
                <span>{viewMode === 'timeline' ? '📚 Shelf' : '📜 Timeline'}</span>
              </button>

              {viewMode !== 'timeline' && (
                viewMode !== 'shelf' && viewMode !== 'sky' ? (
                  <button
                    onClick={handleReturnToShelf}
                    className="text-[11px] sm:text-xs font-sans px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-elsewhere-textPrimary border border-white/10 transition-all flex items-center gap-1 shadow-clay-btn"
                  >
                    <span>📚 Shelf</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setViewMode(viewMode === 'sky' ? 'shelf' : 'sky')}
                    className={`text-[11px] sm:text-xs font-sans px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border transition-all flex items-center gap-1 ${
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

              {viewMode !== 'final-letter' && (
                <button
                  onClick={() => transitionToChapter('final-letter', null)}
                  className="text-[11px] sm:text-xs font-sans px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-amber-400/20 hover:bg-amber-400 text-amber-200 hover:text-black border border-amber-300/60 transition-all flex items-center gap-1 shadow-glow-gold"
                  title="Open the final personal letter"
                >
                  <span>✨ One More Thing...</span>
                </button>
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

          {/* Reset button cleans all saved photos */}
          <div className="bg-elsewhere-surface/80 backdrop-blur-md border border-elsewhere-border rounded-full px-2.5 sm:px-3.5 py-1 sm:py-1.5 shadow-clay-card text-[11px] sm:text-xs flex items-center gap-1.5">
            <span className="text-elsewhere-gold font-serif">★ {discoveredCount}</span>
            {discoveredCount > 1 && (
              <button
                onClick={() => {
                  resetDiscovery()
                  // Clean all photo keys
                  Object.keys(localStorage).forEach((key) => {
                    if (key.startsWith('elsewhere_photo_')) {
                      localStorage.removeItem(key)
                    }
                  })
                  setSavedPhotos({})
                  setActiveMemory(null)
                }}
                className="text-[9px] text-elsewhere-textMuted hover:text-rose-400 underline transition-colors"
                title="Reset discovery and all photos"
              >
                reset
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main 3D Stage */}
      <main className="w-full h-full relative z-10">
        {viewMode === 'arrival' ? (
          <Diorama>
            <OpeningScene isOpen={isEnvelopeOpen} onOpen={handleOpenEnvelope} />
          </Diorama>
        ) : viewMode === 'shelf' ? (
          <Diorama>
            <ShelfScene onSelectObject={handleSelectMemory} onHoverObject={setHoveredId} isDiscovered={isDiscovered} />
          </Diorama>
        ) : viewMode === 'beginning' ? (
          <Diorama>
            <BeginningScene onMerged={() => discover('the-beginning')} />
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
        ) : viewMode === 'someday-room' ? (
          <Diorama>
            <SomedayScene
              hasPhotoFirst={Boolean(savedPhotos['someday-first-photo'])}
              hasPhotoTrip={Boolean(savedPhotos['someday-first-trip'])}
              hasPhotoGift={Boolean(savedPhotos['someday-gift'])}
              onSelectArtifact={(key) => {
                if (key === 'first-photo') {
                  const found = allContent.find((it) => it.id === 'someday-first-photo')
                  if (found) setActiveMemory(found)
                } else if (key === 'first-trip') {
                  const found = allContent.find((it) => it.id === 'someday-first-trip')
                  if (found) setActiveMemory(found)
                } else {
                  const found = allContent.find((it) => it.id === 'someday-gift')
                  if (found) setActiveMemory(found)
                }
              }}
            />
          </Diorama>
        ) : viewMode === 'final-letter' ? (
          <Diorama>
            <FinalLetterScene
              isOpen={isFinalEnvelopeOpen}
              onOpen={handleOpenFinalLetter}
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

      {/* Bottom Guidance */}
      {viewMode !== 'timeline' && (
        <footer className="absolute bottom-0 left-0 right-0 z-30 pb-4 sm:pb-8 flex flex-col items-center justify-center text-center pointer-events-none px-3">
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
            <div className="pointer-events-auto flex flex-col sm:flex-row items-center gap-2.5">
              <div className="bg-elsewhere-surface/90 backdrop-blur-md border border-elsewhere-border px-5 py-2 rounded-full shadow-clay-card flex items-center gap-2">
                <span className="text-elsewhere-star text-xs">✦</span>
                <span className="font-serif text-xs sm:text-sm text-elsewhere-textPrimary">
                  Two people, two screens, one small world between them — Genshin Impact
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
          ) : viewMode === 'final-letter' ? (
            <div className="pointer-events-auto flex flex-col sm:flex-row items-center gap-2.5">
              <div className="bg-elsewhere-surface/90 backdrop-blur-md border border-amber-300/40 px-5 py-2 rounded-full shadow-clay-card flex items-center gap-2">
                <span className="text-amber-300 text-xs">✨</span>
                <span className="font-serif text-xs sm:text-sm text-amber-100">
                  Click the golden envelope to read your personal letter
                </span>
                <span className="text-amber-300 text-xs">✨</span>
              </div>

              <button
                onClick={() => setViewMode('sky')}
                className="px-5 py-2.5 rounded-full bg-elsewhere-gold hover:bg-yellow-300 text-elsewhere-void font-sans text-xs font-semibold shadow-glow-gold transition-all animate-bounce flex items-center gap-1.5"
              >
                <span>🌌 See the Completed Sky →</span>
              </button>
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
          ) : viewMode === 'someday-room' ? (
            <div className="pointer-events-auto bg-elsewhere-surface/90 backdrop-blur-md border border-elsewhere-border px-6 py-2.5 rounded-full shadow-clay-card flex items-center gap-3">
              <span className="text-rose-300 text-xs">✦</span>
              <span className="font-serif text-sm text-elsewhere-textPrimary">
                The Someday Museum — The memories and places we haven't experienced yet
              </span>
              <span className="text-rose-300 text-xs">✦</span>
            </div>
          ) : viewMode === 'sky' ? (
            <div className="pointer-events-auto bg-elsewhere-surface/90 backdrop-blur-md border border-elsewhere-border px-6 py-2.5 rounded-full shadow-clay-card flex items-center gap-3">
              <span className="text-elsewhere-gold text-xs">✦</span>
              <span className="font-serif text-sm text-elsewhere-textPrimary">
                {isFinalStarLit
                  ? 'Our story became a little world — The universe is complete'
                  : 'The Sky Between Us — Click any star to explore memories'}
              </span>
              <span className="text-elsewhere-gold text-xs">✦</span>
            </div>
          ) : (
            <div className="pointer-events-auto transition-all duration-300 bg-elsewhere-surface/90 backdrop-blur-md border border-elsewhere-border px-6 py-2.5 rounded-full shadow-clay-card flex items-center gap-2 max-w-lg mx-3">
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

      {/* Keepsake Story Modal (Universal instant save & card update!) */}
      {activeMemory && (
        <MemoryPanel
          isOpen={Boolean(activeMemory)}
          onClose={() => {
            setActiveMemory(null)
            setIsFinalEnvelopeOpen(false)
          }}
          title={activeMemory.title}
          subtitle={activeMemory.approximateDate || activeMemory.subtitle || activeMemory.chapter}
          text={activeMemory.text}
          date={activeMemory.location || 'Elsewhere'}
          status={activeMemory.status}
          image={activeMemory.image}
          onUploadPhoto={handleUploadPhoto}
          primaryActionLabel={isViewingFinalLetter ? "🌌 See the Completed Sky →" : undefined}
          onPrimaryAction={isViewingFinalLetter ? () => {
            setActiveMemory(null)
            setIsFinalEnvelopeOpen(false)
            setViewMode('sky')
          } : undefined}
        />
      )}
    </div>
  )
}