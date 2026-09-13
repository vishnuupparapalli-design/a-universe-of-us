import React, { useEffect, useRef } from 'react'

/**
 * SpiralTransition — Robust Ocean Blue Gravitational Vortex
 * Fixed: Auto-resizes to window, solid dark backdrop, guaranteed visible spiral time.
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
    let maxDist = Math.hypot(cx, cy) * 1.1

    // Update dimensions if user resizes or snaps the window!
    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      cx = width / 2
      cy = height / 2
      maxDist = Math.hypot(cx, cy) * 1.1
    }
    window.addEventListener('resize', handleResize)

    // Solid dark space fill on frame 0 to prevent any background bleed-through
    ctx.fillStyle = '#030814'
    ctx.fillRect(0, 0, width, height)

    // Ocean Blue Palette
    const colors = [
      '#ffffff',
      '#00f2fe', // Electric Aquamarine
      '#38bdf8', // Ocean Cyan
      '#0ea5e9', // Azure
      '#2563eb', // Sapphire Blue
      '#2dd4bf', // Seafoam Teal
      '#5eead4', // Light Turquoise
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
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 2.0 + 1.2,
      })
    }

    const startTime = performance.now()
    const DURATION = 1600 // 1.6s smooth duration
    let midpointFired = false

    const render = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / DURATION, 1.0)

      // 1. Deep space trail fade
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = 'rgba(3, 8, 20, 0.28)'
      ctx.fillRect(0, 0, width, height)

      // 2. Additive Starlight Blending
      ctx.globalCompositeOperation = 'lighter'

      // Suction acceleration ramping smoothly
      const suctionRamp = 1.0 + Math.pow(progress, 2.0) * 5.5
      const spinRamp = 1.0 + Math.pow(progress, 1.8) * 4.5

      for (let p of particles) {
        const prevAngle = p.angle
        const prevDist = p.dist

        // Pull inward toward center
        const distRatio = Math.max(0.25, p.dist / maxDist)
        p.dist -= (p.speed / distRatio) * suctionRamp * 0.25
        p.angle += (p.rotSpeed / Math.sqrt(distRatio)) * spinRamp * 0.22

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
        ctx.shadowBlur = 12
        ctx.shadowColor = p.color
        ctx.stroke()

        // Respawn if swallowed into the center
        if (p.dist <= 10) {
          p.dist = maxDist * (0.8 + Math.random() * 0.25)
          p.angle = Math.random() * Math.PI * 2
        }
      }

      // 3. Central Event Horizon Eye
      if (progress > 0.2 && progress < 0.85) {
        const eyeRadius = Math.min(width, height) * 0.16 * Math.min(1.0, (progress - 0.2) / 0.3)
        const eyeGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, eyeRadius)
        eyeGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
        eyeGrad.addColorStop(0.35, 'rgba(0, 242, 254, 0.8)')
        eyeGrad.addColorStop(0.7, 'rgba(37, 99, 235, 0.4)')
        eyeGrad.addColorStop(1, 'rgba(3, 8, 20, 0)')

        ctx.fillStyle = eyeGrad
        ctx.beginPath()
        ctx.arc(cx, cy, eyeRadius, 0, Math.PI * 2)
        ctx.fill()
      }

      // 4. Midpoint: Swap scene at 68% (guaranteeing the user sees the spiral for over 1 full second!)
      if (progress >= 0.68 && !midpointFired) {
        midpointFired = true
        if (callbacksRef.current.onMidpoint) {
          callbacksRef.current.onMidpoint()
        }
      }

      // 5. Pure Celestial White Flash (Starts at 65% so it never cuts the spiral short)
      if (progress > 0.65) {
        const bloomProgress = progress < 0.84
          ? (progress - 0.65) / 0.19 // Quick flash
          : 1.0 - (progress - 0.84) / 0.16 // Smooth dissolve

        ctx.globalCompositeOperation = 'source-over'
        ctx.fillStyle = `rgba(255, 255, 255, ${bloomProgress * 0.98})`
        ctx.fillRect(0, 0, width, height)
      }

      if (progress < 1.0) {
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