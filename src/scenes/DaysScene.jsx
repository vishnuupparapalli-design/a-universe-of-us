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

function createNebulaTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.85)')
  gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.3)')
  gradient.addColorStop(0.75, 'rgba(255, 255, 255, 0.08)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(canvas)
}

/**
 * DaysScene — Rock-Solid Ocean Blue Galaxy
 * Fixed: Zero text vibration, zero ghost badges, smooth 60fps rotation.
 */
export default function DaysScene({ currentDays = 204, onSelectMilestone }) {
  const galaxyRef = useRef()
  const coreGlowRef = useRef()
  const starTexture = useMemo(() => createStarTexture(), [])
  const nebulaTexture = useMemo(() => createNebulaTexture(), [])
  const [hoveredDay, setHoveredDay] = useState(null)

  // 1. The 204 Hero Stars (Fitted to camera view)
  const [starPositions, starColors] = useMemo(() => {
    const pos = new Float32Array(currentDays * 3)
    const col = new Float32Array(currentDays * 3)

    const oceanPalette = [
      '#00f2fe',
      '#38bdf8',
      '#0ea5e9',
      '#3b82f6',
      '#1d4ed8',
      '#2dd4bf',
      '#ffffff',
    ]

    for (let i = 0; i < currentDays; i++) {
      const arm = i % 2
      const t = i / currentDays
      const angle = t * Math.PI * 3.6 + (arm * Math.PI)
      const radius = Math.pow(t, 0.62) * 2.3 + 0.2

      const spread = 0.15 * (1 + t * 0.8)
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * spread
      const z = Math.sin(angle) * radius + (Math.random() - 0.5) * spread
      const y = (Math.random() - 0.5) * 0.18 * (1 - t * 0.3)

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

    const densePalette = ['#ffffff', '#00f2fe', '#38bdf8', '#2dd4bf', '#60a5fa', '#93c5fd']

    for (let i = 0; i < count; i++) {
      const arm = i % 2
      const t = i / count
      const angle = t * Math.PI * 3.8 + (arm * Math.PI)
      const radius = Math.pow(t, 0.65) * 2.45 + 0.15

      const spread = 0.22 * (1 + t * 0.9)
      pos[i * 3 + 0] = Math.cos(angle) * radius + (Math.random() - 0.5) * spread
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.22
      pos[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * spread

      const c = new THREE.Color(densePalette[Math.floor(Math.random() * densePalette.length)])
      col[i * 3 + 0] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return [pos, col]
  }, [])

  // 3. Ambient Stardust Field
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

  // 4. Stable Milestone Coordinates (Cleanly positioned across the screen)
  const milestones = useMemo(() => [
    { day: 1, label: 'Day 1 • Feb 22', pos: [-1.85, 0.05, -0.9], color: '#00f2fe' },
    { day: 50, label: 'Day 50', pos: [-1.45, 0.05, 0.85], color: '#2dd4bf' },
    { day: 100, label: 'Day 100', pos: [1.55, 0.05, -0.75], color: '#38bdf8' },
    { day: 200, label: 'Day 200', pos: [1.1, 0.05, 0.6], color: '#60a5fa' },
    { day: 204, label: 'Today (204)', pos: [0, 0.12, 0], color: '#ffffff' },
  ], [])

  const curvePoints = useMemo(() => {
    const rawPoints = milestones.map((m) => new THREE.Vector3(...m.pos))
    const curve = new THREE.CatmullRomCurve3(rawPoints)
    return curve.getPoints(60)
  }, [milestones])

  // Swirl the galaxy stars continuously in the background
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y = t * 0.035
    }
    if (coreGlowRef.current) {
      coreGlowRef.current.scale.setScalar(1.0 + Math.sin(t * 2.2) * 0.08)
    }
  })

  return (
    <group position={[0, 0.05, 0]} rotation={[0.42, 0, 0]}>
      {/* Lighting */}
      <pointLight color="#ffffff" intensity={3.5} distance={5} />
      <pointLight color="#00f2fe" intensity={2.0} distance={3.5} position={[0, 0.2, 0]} />
      <ambientLight color="#061224" intensity={0.9} />

      {/* Ambient background stars */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={400} array={ambientPositions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={400} array={ambientColors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.045} map={starTexture} vertexColors transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>

      {/* ================= 1. THE SWIRLING GALAXY (Stars spin continuously!) ================= */}
      <group ref={galaxyRef}>
        {/* 1,000 Micro-Stars along the spiral arms */}
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={1000} array={densePositions} itemSize={3} />
            <bufferAttribute attach="attributes-color" count={1000} array={denseColors} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial size={0.065} map={starTexture} vertexColors transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>

        {/* The 204 Hero Ocean Stars */}
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={currentDays} array={starPositions} itemSize={3} />
            <bufferAttribute attach="attributes-color" count={currentDays} array={starColors} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial size={0.12} map={starTexture} vertexColors transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
      </group>

      {/* ================= 2. STEADY MILESTONES & LABELS (Zero Vibration!) ================= */}
      <group>
        {/* Luminous Time Path */}
        <Line points={curvePoints} color="#38bdf8" lineWidth={1.4} transparent opacity={0.55} />

        {/* Glowing Center Core */}
        <group ref={coreGlowRef} position={[0, 0.08, 0]}>
          <mesh>
            <sphereGeometry args={[0.13, 32, 32]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={4.5} />
          </mesh>
          <pointLight color="#00f2fe" intensity={2.2} distance={1.8} />
        </group>

        {/* 5 Milestone Stars with Rock-Solid Badges */}
        {milestones.map((m) => {
          const milestoneData = dayMilestones.find((d) => d.day === m.day)
          const isHovered = hoveredDay === m.day
          const isToday = m.day === 204

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
              {/* Invisible Hitbox */}
              <mesh>
                <sphereGeometry args={[0.22, 16, 16]} />
                <meshBasicMaterial transparent opacity={0} />
              </mesh>

              {/* Glowing Star Core */}
              {!isToday && (
                <mesh scale={isHovered ? 1.4 : 1.0}>
                  <sphereGeometry args={[0.08, 24, 24]} />
                  <meshStandardMaterial color="#ffffff" emissive={m.color} emissiveIntensity={isHovered ? 3.5 : 2.0} />
                </mesh>
              )}

              {/* Radiant Halo */}
              <mesh position={[0, 0, 0]}>
                <circleGeometry args={[isToday ? 0.26 : 0.18, 24]} />
                <meshBasicMaterial color={m.color} transparent opacity={isHovered ? 0.7 : 0.3} side={THREE.DoubleSide} />
              </mesh>

              {/* STABLE BADGE (No transition-all fighting Three.js = ZERO VIBRATION!) */}
              <Html
                position={[0, isToday ? 0.2 : 0.18, 0]}
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