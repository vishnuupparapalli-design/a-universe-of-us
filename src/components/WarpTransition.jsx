import React, { useEffect, useRef } from 'react'

/**
 * WarpTransition — Cinematic Starlight Wormhole
 * Fixed: Locked with useRef so it NEVER restarts or stutters during scene swaps!
 */
export default function WarpTransition({ isActive, onMidpoint, onComplete }) {
  const canvasRef = useRef(null)

  // Lock callbacks in refs so re-renders NEVER restart the wormhole loop!
  const callbacksRef = useRef({ onMidpoint, onComplete })
  callbacksRef.current = { onMidpoint, onComplete }

  useEffect(() => {
    if (!isActive) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animationFrameId
    const width = (canvas.width = window.innerWidth)
    const height = (canvas.height = window.innerHeight)
    const cx = width / 2
    const cy = height / 2

    const colors = ['#ffffff', '#ffffff', '#dfb76c', '#ffd68a', '#a5b4fc', '#c7d2fe']

    const createStar = (isInitial = false) => {
      const angle = Math.random() * Math.PI * 2
      const dist = isInitial ? Math.random() * (Math.min(width, height) * 0.45) : Math.random() * 25 + 5
      return {
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        angle,
        speed: Math.random() * 14 + 10,
        length: Math.random() * 20 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 2.2 + 1.0,
      }
    }

    const count = width < 768 ? 160 : 280
    const stars = Array.from({ length: count }, () => createStar(true))

    const startTime = performance.now()
    const DURATION = 1400 // Snappy 1.4-second cinematic leap
    let midpointFired = false

    const render = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / DURATION, 1.0)

      // 1. Deep space trails
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = 'rgba(6, 8, 14, 0.32)'
      ctx.fillRect(0, 0, width, height)

      // 2. Additive Starlight Blending
      ctx.globalCompositeOperation = 'lighter'

      const speedMultiplier = 1.0 + progress * 2.5

      for (let s of stars) {
        const currentSpeed = s.speed * speedMultiplier
        s.x += Math.cos(s.angle) * currentSpeed
        s.y += Math.sin(s.angle) * currentSpeed

        const tailLength = Math.min(currentSpeed * 2.6, 160)
        const tailX = s.x - Math.cos(s.angle) * tailLength
        const tailY = s.y - Math.sin(s.angle) * tailLength

        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(s.x, s.y)
        ctx.strokeStyle = s.color
        ctx.lineWidth = s.size
        ctx.lineCap = 'round'
        ctx.stroke()

        // Continuous stream loop
        if (s.x < -100 || s.x > width + 100 || s.y < -100 || s.y > height + 100) {
          const fresh = createStar(false)
          s.x = fresh.x
          s.y = fresh.y
          s.angle = fresh.angle
          s.speed = fresh.speed
          s.length = fresh.length
          s.color = fresh.color
          s.size = fresh.size
        }
      }

      // 3. Midpoint trigger at 58% (Swaps 3D scene invisibly behind the bloom)
      if (progress >= 0.58 && !midpointFired) {
        midpointFired = true
        if (callbacksRef.current.onMidpoint) {
          callbacksRef.current.onMidpoint()
        }
      }

      // 4. Radiant Starlight Bloom (smooth ramp up and soft dissolve)
      if (progress > 0.52) {
        const bloomProgress = progress < 0.75
          ? (progress - 0.52) / 0.23 // Ramp up to peak
          : 1.0 - (progress - 0.75) / 0.25 // Dissolve softly

        const maxRadius = Math.max(width, height) * 0.95
        const bloomGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius)
        bloomGrad.addColorStop(0, `rgba(255, 255, 255, ${bloomProgress * 0.95})`)
        bloomGrad.addColorStop(0.35, `rgba(255, 235, 185, ${bloomProgress * 0.8})`)
        bloomGrad.addColorStop(0.7, `rgba(165, 180, 252, ${bloomProgress * 0.3})`)
        bloomGrad.addColorStop(1, 'rgba(6, 8, 14, 0)')

        ctx.fillStyle = bloomGrad
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
      cancelAnimationFrame(animationFrameId)
    }
  }, [isActive]) // Notice: ONLY isActive in dependencies! Never restarts!

  if (!isActive) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none w-full h-full select-none"
    />
  )
}