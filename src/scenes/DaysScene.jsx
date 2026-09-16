import React, { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line, Html } from '@react-three/drei'
import * as THREE from 'three'
import { dayMilestones } from '../data/milestones'

function createStarTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.25, 'rgba(255, 255, 255, 0.95)')
  gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.35)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(canvas)
}

/**
 * DaysScene — Clean Ocean Blue Starlight Galaxy (Nebula Gas Removed)
 */
export default function DaysScene({ currentDays = 206, onSelectMilestone }) {
  const galaxyRef = useRef()
  const coreGlowRef = useRef()
  const starTexture = useMemo(() => createStarTexture(), [])
  const [hoveredDay, setHoveredDay] = useState(null)

  // 1. The 204/206 Main Stars
  const [starPositions, starColors] = useMemo(() => {
    const pos = new Float32Array(currentDays * 3)
    const col = new Float32Array(currentDays * 3)

    const oceanPalette = [
      '#00f2fe', // Aquamarine
      '#38bdf8', // Cyan
      '#0ea5e9', // Blue
      '#3b82f6', // Sapphire
      '#2dd4bf', // Seafoam
      '#ffffff', // White
    ]

    for (let i = 0; i < currentDays; i++) {
      const arm = i % 2
      const t = i / currentDays
      const angle = t * Math.PI * 3.4 + (arm * Math.PI)
      const radius = Math.pow(t, 0.65) * 2.35 + 0.25

      const spread = 0.16 * (1 + t * 0.7)
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * spread
      const z = Math.sin(angle) * radius + (Math.random() - 0.5) * spread
      const y = (Math.random() - 0.5) * 0.14

      pos[i * 3 + 0] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      const colorIndex = Math.min(oceanPalette.length - 1, Math.floor((1 - t) * oceanPalette.length))
      const c = new THREE.Color(oceanPalette[colorIndex])
      col[i * 3 + 0] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return [pos, col]
  }, [currentDays])

  // 2. 1,000 Micro-Stars along the spiral arms
  const [densePositions, denseColors] = useMemo(() => {
    const count = 1000
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    const densePalette = ['#ffffff', '#00f2fe', '#38bdf8', '#2dd4bf', '#60a5fa']

    for (let i = 0; i < count; i++) {
      const arm = i % 2
      const t = i / count
      const angle = t * Math.PI * 3.6 + (arm * Math.PI)
      const radius = Math.pow(t, 0.68) * 2.5 + 0.2

      const spread = 0.22 * (1 + t * 0.8)
      pos[i * 3 + 0] = Math.cos(angle) * radius + (Math.random() - 0.5) * spread
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.16
      pos[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * spread

      const c = new THREE.Color(densePalette[Math.floor(Math.random() * densePalette.length)])
      col[i * 3 + 0] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return [pos, col]
  }, [])

  // 3. Ambient Stardust Field (Deep background stars)
  const [ambientPositions, ambientColors] = useMemo(() => {
    const count = 400
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 8
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4
      pos[i * 3 + 2] = (Math.random() - 0.5) * 7

      const c = new THREE.Color(Math.random() > 0.4 ? '#38bdf8' : '#ffffff')
      col[i * 3 + 0] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return [pos, col]
  }, [])

  // 4. Exact 5 Milestone Coordinates
  const milestones = useMemo(() => [
    { day: 1, label: 'Day 1 • Feb 22', pos: [-2.1, 0.05, -0.7], color: '#00f2fe' },
    { day: 50, label: 'Day 50', pos: [-1.4, 0.05, 0.85], color: '#2dd4bf' },
    { day: 100, label: 'Day 100', pos: [1.3, 0.05, 0.75], color: '#38bdf8' },
    { day: 200, label: 'Day 200', pos: [1.1, 0.05, -0.55], color: '#60a5fa' },
    { day: currentDays, label: `Today (${currentDays})`, pos: [0, 0.08, 0], color: '#ffffff' },
  ], [currentDays])

  // Luminous line connecting directly through each milestone star
  const curvePoints = useMemo(() => [
    [-2.1, 0.05, -0.7], // Day 1
    [-1.4, 0.05, 0.85], // Day 50
    [0.2, 0.06, 1.1],   // Smooth curve along bottom arm
    [1.3, 0.05, 0.75],  // Day 100
    [1.1, 0.05, -0.55], // Day 200
    [0, 0.08, 0],       // Today
  ], [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y = t * 0.025
    }
    if (coreGlowRef.current) {
      coreGlowRef.current.scale.setScalar(1.0 + Math.sin(t * 2.0) * 0.08)
    }
  })

  return (
    <group position={[0, 0, 0]}>
      <pointLight color="#ffffff" intensity={3.5} distance={6} />
      <pointLight color="#00f2fe" intensity={2.0} distance={4} position={[0, 0.3, 0]} />
      <ambientLight color="#061224" intensity={0.9} />

      {/* Ambient background stars */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={400} array={ambientPositions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={400} array={ambientColors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.045} map={starTexture} vertexColors transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>

      {/* Swirling Galaxy Body (Clean Starlight Points Only) */}
      <group ref={galaxyRef}>
        {/* 1,000 Micro-Stars along the spiral arms */}
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={1000} array={densePositions} itemSize={3} />
            <bufferAttribute attach="attributes-color" count={1000} array={denseColors} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial size={0.06} map={starTexture} vertexColors transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>

        {/* The 204/206 Main Stars */}
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={currentDays} array={starPositions} itemSize={3} />
            <bufferAttribute attach="attributes-color" count={currentDays} array={starColors} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial size={0.11} map={starTexture} vertexColors transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
      </group>

      {/* Steady Milestones & Clean Curved Path */}
      <group>
        <Line
          points={curvePoints}
          color="#38bdf8"
          lineWidth={1.6}
          transparent
          opacity={0.65}
        />

        {/* Central Core Star */}
        <group ref={coreGlowRef} position={[0, 0.08, 0]}>
          <mesh>
            <sphereGeometry args={[0.13, 32, 32]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={4.5} />
          </mesh>
          <pointLight color="#00f2fe" intensity={2.2} distance={2.0} />
        </group>

        {/* 5 Milestone Stars with Clean Badges */}
        {milestones.map((m) => {
          const milestoneData = dayMilestones.find((d) => d.day === m.day)
          const isHovered = hoveredDay === m.day
          const isToday = m.day === currentDays

          return (
            <group
              key={`milestone-${m.day}`}
              position={m.pos}
              onPointerOver={(e) => {
                e.stopPropagation()
                document.body.style.cursor = 'pointer'
                setHoveredDay(m.day)
              }}
              onPointerOut={(e) => {
                e.stopPropagation()
                document.body.style.cursor = 'default'
                setHoveredDay(null)
              }}
              onClick={(e) => {
                e.stopPropagation()
                if (onSelectMilestone && milestoneData) {
                  onSelectMilestone(milestoneData)
                }
              }}
            >
              {/* Hitbox */}
              <mesh>
                <sphereGeometry args={[0.24, 16, 16]} />
                <meshBasicMaterial transparent opacity={0} />
              </mesh>

              {/* Glowing Star Core */}
              {!isToday && (
                <mesh scale={isHovered ? 1.4 : 1.0}>
                  <sphereGeometry args={[0.085, 24, 24]} />
                  <meshStandardMaterial color="#ffffff" emissive={m.color} emissiveIntensity={isHovered ? 3.5 : 2.2} />
                </mesh>
              )}

              {/* Radiant Halo */}
              <mesh position={[0, 0, 0]}>
                <circleGeometry args={[isToday ? 0.26 : 0.18, 24]} />
                <meshBasicMaterial color={m.color} transparent opacity={isHovered ? 0.7 : 0.35} side={THREE.DoubleSide} />
              </mesh>

              {/* Clean Steady Badge Tag */}
              <Html
                position={[0, 0.22, 0]}
                center
                distanceFactor={4.5}
                className="pointer-events-none select-none"
              >
                <div
                  className={`px-2 py-0.5 rounded-full border whitespace-nowrap text-[9px] font-sans font-medium tracking-wide ${
                    isHovered
                      ? 'bg-white/30 text-white scale-110 shadow-glow-star'
                      : isToday
                      ? 'bg-cyan-500/25 text-cyan-200 border-cyan-300/60 shadow-clay-card'
                      : 'bg-elsewhere-surface/85 text-white/90 border-white/20'
                  }`}
                  style={{
                    borderColor: isHovered ? '#ffffff' : m.color,
                    boxShadow: isHovered ? `0 0 10px ${m.color}` : 'none',
                  }}
                >
                  ✦ {m.label}
                </div>
              </Html>
            </group>
          )
        })}
      </group>
    </group>
  )
}