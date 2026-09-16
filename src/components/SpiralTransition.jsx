import React, { useEffect, useRef } from 'react'

/**
 * SpiralTransition — Smooth Curving Rainbow Starlight Vortex on Pure Black
 * - Restored: Silky smooth curving starlight arcs flowing into the vortex
 * - Pure jet-black background (#000000)
 * - Ocean Blue center eye
 * - Clean white starlight flash finish
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
    let visibleRadius = Math.min(width, height) * 0.48

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      cx = width / 2
      cy = height / 2
      visibleRadius = Math.min(width, height) * 0.48
    }
    window.addEventListener('resize', handleResize)

    // Solid pitch-black frame 0 fill
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)

    // Rainbow Palette
    const rainbowColors = [
      '#ffffff', // White
      '#f87171', // Red
      '#fb923c', // Orange
      '#facc15', // Gold
      '#4ade80', // Green
      '#22d3ee', // Cyan
      '#38bdf8', // Blue
      '#a855f7', // Purple
      '#f472b6', // Pink
    ]

    const count = width < 768 ? 160 : 250
    const particles = []

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * (visibleRadius - 40) + 40
      particles.push({
        angle,
        radius,
        speed: Math.random() * 5 + 4,
        rotSpeed: Math.random() * 0.045 + 0.03,
        color: rainbowColors[Math.floor(Math.random() * rainbowColors.length)],
        size: Math.random() * 1.8 + 1.2,
      })
    }

    const startTime = performance.now()
    const DURATION = 1500 // 1.5 seconds
    let midpointFired = false

    const render = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / DURATION, 1.0)

      // 1. SOLID PURE BLACK BACKGROUND
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)'
      ctx.fillRect(0, 0, width, height)

      // 2. Additive Starlight Glow for Rainbow Curves
      ctx.globalCompositeOperation = 'lighter'

      const suctionRamp = 1.0 + Math.pow(progress, 2.0) * 5.5
      const spinRamp = 1.0 + Math.pow(progress, 1.8) * 4.5

      for (let p of particles) {
        // Draw a smooth curving starlight arc (connected curve steps along the spiral)
        ctx.beginPath()
        const steps = 4
        for (let s = 0; s <= steps; s++) {
          const frac = s / steps
          const arcAngle = p.angle - frac * 0.35 * spinRamp
          const arcRadius = p.radius + frac * (p.speed * 4.0 * suctionRamp + 20)

          const px = cx + Math.cos(arcAngle) * arcRadius
          const py = cy + Math.sin(arcAngle) * arcRadius

          if (s === 0) {
            ctx.moveTo(px, py)
          } else {
            ctx.lineTo(px, py)
          }
        }

        ctx.strokeStyle = p.color
        ctx.lineWidth = p.size
        ctx.lineCap = 'round'
        ctx.stroke()

        // Glowing head dot
        const hx = cx + Math.cos(p.angle) * p.radius
        const hy = cy + Math.sin(p.angle) * p.radius
        ctx.beginPath()
        ctx.arc(hx, hy, p.size * 0.9, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.fill()

        // Move inward along spiral
        p.radius -= p.speed * suctionRamp * 0.28
        p.angle += p.rotSpeed * spinRamp * 0.22

        if (p.radius <= 12) {
          p.radius = visibleRadius * (0.85 + Math.random() * 0.15)
          p.angle = Math.random() * Math.PI * 2
        }
      }

      // 3. Central Singularity Eye: Pure Ocean Blue
      if (progress > 0.15 && progress < 0.85) {
        const eyeRadius = Math.min(width, height) * 0.18 * Math.min(1.0, (progress - 0.15) / 0.3)
        const eyeGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, eyeRadius)
        eyeGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)')
        eyeGrad.addColorStop(0.35, 'rgba(0, 242, 254, 0.95)') // Electric Aquamarine
        eyeGrad.addColorStop(0.7, 'rgba(2, 132, 199, 0.6)')   // Ocean Blue
        eyeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.fillStyle = eyeGrad
        ctx.beginPath()
        ctx.arc(cx, cy, eyeRadius, 0, Math.PI * 2)
        ctx.fill()
      }

      // 4. Midpoint: Switch scene behind white flash at 62%
      if (progress >= 0.62 && !midpointFired) {
        midpointFired = true
        if (callbacksRef.current.onMidpoint) {
          callbacksRef.current.onMidpoint()
        }
      }

      // 5. Clean Radiant White Starlight Flash
      if (progress > 0.58) {
        const bloomProgress = progress < 0.8
          ? (progress - 0.58) / 0.22
          : 1.0 - (progress - 0.8) / 0.2

        const maxRadius = Math.max(width, height) * 1.05
        const bloomGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius)
        bloomGrad.addColorStop(0, `rgba(255, 255, 255, ${bloomProgress * 1.0})`)
        bloomGrad.addColorStop(0.35, `rgba(255, 255, 255, ${bloomProgress * 0.95})`)
        bloomGrad.addColorStop(0.7, `rgba(0, 242, 254, ${bloomProgress * 0.45})`)
        bloomGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

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