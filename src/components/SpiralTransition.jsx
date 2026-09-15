import React, { useEffect, useRef } from 'react'

/**
 * SpiralTransition — Frame-Guaranteed Ocean Blue & Rainbow Vortex
 * Fixed: Uses a guaranteed frame counter so particles NEVER skip or disappear!
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

    // Vibrant Rainbow Starlight Particles
    const rainbowColors = [
      '#ffffff', // White
      '#f87171', // Red
      '#fb923c', // Orange
      '#facc15', // Gold
      '#4ade80', // Green
      '#22d3ee', // Cyan
      '#38bdf8', // Ocean Blue
      '#a855f7', // Purple
      '#f472b6', // Pink
    ]

    const count = width < 768 ? 160 : 260
    const particles = []

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = Math.random() * (maxDist - 30) + 30
      particles.push({
        angle,
        dist,
        speed: Math.random() * 4 + 3,
        rotSpeed: Math.random() * 0.045 + 0.025,
        color: rainbowColors[Math.floor(Math.random() * rainbowColors.length)],
        size: Math.random() * 2.2 + 1.2,
      })
    }

    // GUARANTEED FRAME COUNTER (75 frames = smooth 1.25s, NEVER SKIPS!)
    const TOTAL_FRAMES = 75
    let currentFrame = 0
    let midpointFired = false

    const render = () => {
      currentFrame++
      const progress = Math.min(currentFrame / TOTAL_FRAMES, 1.0)

      // 1. SOLID PURE BLACK BACKGROUND (Zero color bleeding)
      ctx.globalCompositeOperation = 'source-over'
      ctx.shadowBlur = 0
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, width, height)

      // 2. Additive Starlight Glow for Rainbow Particles
      ctx.globalCompositeOperation = 'lighter'

      const suctionRamp = 1.0 + Math.pow(progress, 2.2) * 6.5
      const spinRamp = 1.0 + Math.pow(progress, 2.0) * 5.0

      for (let p of particles) {
        const prevAngle = p.angle
        const prevDist = p.dist

        // Pull inward toward center
        const distRatio = Math.max(0.2, p.dist / maxDist)
        p.dist -= (p.speed / distRatio) * suctionRamp * 0.28
        p.angle += (p.rotSpeed / Math.sqrt(distRatio)) * spinRamp * 0.24

        const prevX = cx + Math.cos(prevAngle) * prevDist
        const prevY = cy + Math.sin(prevAngle) * prevDist

        const x = cx + Math.cos(p.angle) * p.dist
        const y = cy + Math.sin(p.angle) * p.dist

        ctx.beginPath()
        ctx.moveTo(prevX, prevY)
        ctx.lineTo(x, y)
        ctx.strokeStyle = p.color
        ctx.lineWidth = p.size
        ctx.lineCap = 'round'
        ctx.shadowBlur = 8
        ctx.shadowColor = p.color
        ctx.stroke()

        if (p.dist <= 10) {
          p.dist = maxDist * (0.8 + Math.random() * 0.25)
          p.angle = Math.random() * Math.PI * 2
        }
      }

      // 3. CENTER EYE: LOCKED TO PURE OCEAN BLUE
      if (progress > 0.15 && progress < 0.85) {
        const eyeRadius = Math.min(width, height) * 0.16 * Math.min(1.0, (progress - 0.15) / 0.3)
        const eyeGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, eyeRadius)
        eyeGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)')   // White hot center
        eyeGrad.addColorStop(0.35, 'rgba(0, 210, 255, 0.95)') // Bright Ocean Cyan
        eyeGrad.addColorStop(0.7, 'rgba(0, 102, 255, 0.6)')   // Deep Ocean Blue
        eyeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.shadowBlur = 0
        ctx.fillStyle = eyeGrad
        ctx.beginPath()
        ctx.arc(cx, cy, eyeRadius, 0, Math.PI * 2)
        ctx.fill()
      }

      // 4. Midpoint: Switch scene at frame 48 (64% through)
      if (currentFrame >= 48 && !midpointFired) {
        midpointFired = true
        if (callbacksRef.current.onMidpoint) {
          callbacksRef.current.onMidpoint()
        }
      }

      // 5. SOLID WHITE FLASH (Starts at frame 50 to finish into the galaxy)
      if (currentFrame > 50) {
        const whiteProgress = (currentFrame - 50) / 25 // 25 frames for clean flash
        const whiteAlpha = whiteProgress < 0.5
          ? whiteProgress / 0.5 // Ramps up to pure white
          : 1.0 - (whiteProgress - 0.5) / 0.5 // Dissolves into galaxy

        ctx.globalCompositeOperation = 'source-over'
        ctx.shadowBlur = 0
        ctx.fillStyle = `rgba(255, 255, 255, ${whiteAlpha})`
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
      className="fixed inset-0 z-50 pointer-events-none w-full h-full select-none"
    />
  )
}