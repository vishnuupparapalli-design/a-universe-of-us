import React, { useEffect, useRef } from 'react'

/**
 * SpiralTransition — Silky Smooth Rainbow Starlight Ribbons on Pure Black
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
      '#ffffff',
      '#f87171', // Red
      '#fb923c', // Orange
      '#facc15', // Gold
      '#4ade80', // Green
      '#22d3ee', // Cyan
      '#38bdf8', // Blue
      '#a855f7', // Purple
      '#f472b6', // Pink
    ]

    const count = width < 768 ? 140 : 220
    const particles = []

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = Math.random() * (maxDist - 40) + 40
      particles.push({
        angle,
        dist,
        speed: Math.random() * 4 + 3.5,
        rotSpeed: Math.random() * 0.04 + 0.025,
        color: rainbowColors[Math.floor(Math.random() * rainbowColors.length)],
        size: Math.random() * 2.2 + 1.2,
      })
    }

    const TOTAL_FRAMES = 75
    let currentFrame = 0
    let midpointFired = false

    const render = () => {
      currentFrame++
      const progress = Math.min(currentFrame / TOTAL_FRAMES, 1.0)

      // 1. SOLID PURE BLACK BACKGROUND
      ctx.globalCompositeOperation = 'source-over'
      ctx.shadowBlur = 0
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, width, height)

      // 2. Additive Glow for Smooth Flowing Ribbons
      ctx.globalCompositeOperation = 'lighter'

      const suctionRamp = 1.0 + Math.pow(progress, 2.2) * 6.5
      const spinRamp = 1.0 + Math.pow(progress, 2.0) * 5.0

      for (let p of particles) {
        const distRatio = Math.max(0.18, p.dist / maxDist)

        // Draw a silky smooth curving starlight arc (5 connected curved steps)
        ctx.beginPath()
        const steps = 5
        for (let s = 0; s <= steps; s++) {
          const stepOffset = s / steps
          const arcAngle = p.angle - stepOffset * (p.rotSpeed / Math.sqrt(distRatio)) * spinRamp * 0.9
          const arcDist = p.dist + stepOffset * (p.speed / distRatio) * suctionRamp * 0.85

          const px = cx + Math.cos(arcAngle) * arcDist
          const py = cy + Math.sin(arcAngle) * arcDist

          if (s === 0) {
            ctx.moveTo(px, py)
          } else {
            ctx.lineTo(px, py)
          }
        }

        ctx.strokeStyle = p.color
        ctx.lineWidth = p.size
        ctx.lineCap = 'round'
        ctx.shadowBlur = 10
        ctx.shadowColor = p.color
        ctx.stroke()

        // Move particle forward along the vortex
        p.dist -= (p.speed / distRatio) * suctionRamp * 0.26
        p.angle += (p.rotSpeed / Math.sqrt(distRatio)) * spinRamp * 0.22

        if (p.dist <= 10) {
          p.dist = maxDist * (0.8 + Math.random() * 0.25)
          p.angle = Math.random() * Math.PI * 2
        }
      }

      // 3. CENTER EYE: LOCKED TO OCEAN BLUE
      if (progress > 0.15 && progress < 0.85) {
        const eyeRadius = Math.min(width, height) * 0.16 * Math.min(1.0, (progress - 0.15) / 0.3)
        const eyeGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, eyeRadius)
        eyeGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)')
        eyeGrad.addColorStop(0.35, 'rgba(0, 210, 255, 0.95)')
        eyeGrad.addColorStop(0.7, 'rgba(0, 102, 255, 0.6)')
        eyeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.shadowBlur = 0
        ctx.fillStyle = eyeGrad
        ctx.beginPath()
        ctx.arc(cx, cy, eyeRadius, 0, Math.PI * 2)
        ctx.fill()
      }

      // 4. Midpoint: Swap scene behind white light
      if (currentFrame >= 50 && !midpointFired) {
        midpointFired = true
        if (callbacksRef.current.onMidpoint) {
          callbacksRef.current.onMidpoint()
        }
      }

      // 5. Clean White Flash
      if (currentFrame > 42) {
        const whiteProgress = (currentFrame - 42) / 33
        const whiteAlpha = whiteProgress < 0.4
          ? whiteProgress / 0.4
          : 1.0 - (whiteProgress - 0.4) / 0.6

        ctx.globalCompositeOperation = 'source-over'
        ctx.shadowBlur = 0
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1.0, whiteAlpha)})`
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