import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * AtmosphereController — Master Plan Section T
 * Acts as a master stage technician. Smoothly transitions the global background
 * color to match the emotional mood of the current chapter.
 */
export default function AtmosphereController({ viewMode }) {
  // Store the current color so we can tween from it
  const currentColorRef = useRef('#06080e')

  useEffect(() => {
    // Define the precise background colors for every chapter
    const atmospheres = {
      'arrival': '#06080e',       // Deep space void
      'shelf': '#06080e',         // Deep space void
      'beginning': '#0b1021',     // Mystic violet-blue
      'days': '#020814',          // Deep ocean abyss
      'movie': '#120d08',         // Dim projector amber
      'stories': '#171008',       // Warm mahogany desk
      'hard-days': '#030408',     // Near-pitch-black
      'distance': '#040a18',      // Deep space navy
      'timeline': '#06080e',      // Clean dark
      'sky': '#04060c',           // Pure celestial darkness
    }

    const targetColor = atmospheres[viewMode] || '#06080e'

    // Only tween if the color is actually changing
    if (targetColor !== currentColorRef.current) {
      // We animate a dummy object and apply the color to the body
      const colorObj = { hex: currentColorRef.current }

      gsap.to(colorObj, {
        hex: targetColor,
        duration: 1.2,
        ease: 'power2.inOut',
        onUpdate: () => {
          document.body.style.backgroundColor = colorObj.hex
        },
        onComplete: () => {
          currentColorRef.current = targetColor
        }
      })
    }
  }, [viewMode])

  // This component doesn't render any visible UI itself
  return null
}