import React, { useEffect, useRef } from 'react'

/**
 * SpiralTransition — Pure Jet-Black Space with Sharp Rainbow Starlight Needles
 * Fixed: Removed shadowBlur fog so the background stays 100% JET BLACK!
 */
export default function SpiralTransition({ isActive, onMidpoint, onComplete }) {
  const canvasRef = useRef(null)
  const callbacksRef = useRef({ onMidpoint, onComplete })
  callbacksRef.current = { onMidpoint, onComplete }

  useEffect(() => {
    if (!isActive) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let cx = width / 2
    let cy = height / 2
    let maxDist = Math.hypot(cx, cy) * 1.15

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      cx = width / 2
      cy = height / 2
      maxDist = Math.hypot(cx, cy) * 1.15
    }
    window.addEventListener('resize', handleResize)

    // Vibrant Rainbow Starlight Palette
    const rainbowColors = [
      '#ffffff', // Starlight White
      '#f87171', // Coral Red
      '#fb923c', // Sunset Orange
      '#facc15', // Radiant Gold
      '#4ade80', // Emerald Green
      '#22d3ee', // Electric Cyan
      '#38bdf8', // Ocean Blue
      '#a855f7', // Royal Violet
      '#f472b6', // Cosmic Pink
    ]

    const count = width < 768 ? 160 : 260
    const particles = []

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = Math.random() * (maxDist - 30) + 30
      particles.push({
        angle,
        dist,
        speed: Math.random() * 5 + 4,
        rotSpeed: Math.random() * 0.05 + 0.03,
        color: rainbowColors[Math.floor(Math.random() * rainbowColors.length)],
        size: Math.random() * 1.8 + 1.0,
      })
    }

    const TOTAL_FRAMES = 75
    let currentFrame = 0
    let midpointFired = false

    const render = () => {
      currentFrame++
      const progress = Math.min(currentFrame / TOTAL_FRAMES, 1.0)

      // 1. PURE 100% JET-BLACK BACKGROUND (No teal tint ever!)
      ctx.globalCompositeOperation = 'source-over'
      ctx.shadowBlur = 0
      ctx.fillStyle = 'rgba(0, 0, 0, 0.38)'
      ctx.fillRect(0, 0, width, height)

      // 2. Additive Starlight Glow for Rainbow Needles
      ctx.globalCompositeOperation = 'lighter'

      const suctionRamp = 1.0 + Math.pow(progress, 2.2) * 6.5
      const spinRamp = 1.0 + Math.pow(progress, 2.0) * 5.0

      for (let p of particles) {
        const distRatio = Math.max(0.18, p.dist / maxDist)

        const prevAngle = p.angle
        const prevDist = p.dist

        // Accelerate inward toward center
        p.dist -= (p.speed / distRatio) * suctionRamp * 0.28
        p.angle += (p.rotSpeed / Math.sqrt(distRatio)) * spinRamp * 0.24

        const prevX = cx + Math.cos(prevAngle) * prevDist
        const prevY = cy + Math.sin(prevAngle) * prevDist

        const x = cx + Math.cos(p.angle) * p.dist
        const y = cy + Math.sin(p.angle) * p.dist

        // Draw crisp, sharp starlight needle (ZERO fuzzy shadow blur fog!)
        ctx.beginPath()
        ctx.moveTo(prevX, prevY)
        ctx.lineTo(x, y)
        ctx.strokeStyle = p.color
        ctx.lineWidth = p.size
        ctx.lineCap = 'round'
        ctx.stroke()

        if (p.dist <= 10) {
          p.dist = maxDist * (0.8 + Math.random() * 0.25)
          p.angle = Math.random() * Math.PI * 2
        }
      }

      // 3. Central Ocean Blue Singularity Eye
      if (progress > 0.15 && progress < 0.85) {
        const eyeRadius = Math.min(width, height) * 0.16 * Math.min(1.0, (progress - 0.15) / 0.3)
        const eyeGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, eyeRadius)
        eyeGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)')
        eyeGrad.addColorStop(0.35, 'rgba(0, 210, 255, 0.95)')
        eyeGrad.addColorStop(0.7, 'rgba(0, 102, 255, 0.6)')
        eyeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.fillStyle = eyeGrad
        ctx.beginPath()
        ctx.arc(cx, cy, eyeRadius, 0, Math.PI * 2)
        ctx.fill()
      }

      // 4. Midpoint: Swap scene at frame 50
      if (currentFrame >= 50 && !midpointFired) {
        midpointFired = true
        if (callbacksRef.current.onMidpoint) {
          callbacksRef.current.onMidpoint()
        }
      }

      // 5. Clean Radiant White Starlight Bloom
      if (currentFrame > 42) {
        const bloomProgress = currentFrame < 54
          ? (currentFrame - 42) / 12
          : 1.0 - (currentFrame - 54) / 18

        const maxRadius = Math.max(width, height) * 1.05
        const bloomGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius)
        bloomGrad.addColorStop(0, `rgba(255, 255, 255, ${bloomProgress * 1.0})`)
        bloomGrad.addColorStop(0.35, `rgba(255, 255, 255, ${bloomProgress * 0.95})`)
        bloomGrad.addColorStop(0.7, `rgba(0, 210, 255, ${bloomProgress * 0.45})`)
        bloomGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.fillStyle = bloomGrad
        ctx.fillRect(0, 0, width, height)
      }

      if (currentFrame < TOTAL_FRAMES) {
        animationFrameId = requestAnimationFrame(render)
      } else {
        if (callbacksRef.current.onComplete) {
          callbacksRef.current.onComplete()
        }
      }
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isActive])

  if (!isActive) return null

  return (
    <canvas
      ref={canvasRef}
      style={{ backgroundColor: '#000000' }}
      className="fixed inset-0 z-50 pointer-events-none w-full h-full select-none"
    />
  )
}