import React, { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Html } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

function createTicketTexture(title, subTitle, number) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')

  // Warm vintage paper base
  ctx.fillStyle = '#f6eed8'
  ctx.fillRect(0, 0, 512, 256)

  // Outer border
  ctx.strokeStyle = '#54361e'
  ctx.lineWidth = 4
  ctx.strokeRect(12, 12, 488, 232)

  // Inner decorative border
  ctx.lineWidth = 2
  ctx.strokeRect(20, 20, 472, 216)

  // Perforated dashed divider line
  ctx.setLineDash([8, 8])
  ctx.beginPath()
  ctx.moveTo(135, 12)
  ctx.lineTo(135, 244)
  ctx.stroke()

  // Left Stub: Vertical "ADMIT ONE"
  ctx.setLineDash([])
  ctx.fillStyle = '#54361e'
  ctx.font = 'bold 24px system-ui, -apple-system, sans-serif'
  ctx.save()
  ctx.translate(75, 128)
  ctx.rotate(-Math.PI / 2)
  ctx.textAlign = 'center'
  ctx.fillText('ADMIT ONE', 0, 8)
  ctx.restore()

  // Main Body: "CINEMA TICKET"
  ctx.textAlign = 'left'
  ctx.font = '900 34px system-ui, -apple-system, sans-serif'
  ctx.fillText('CINEMA TICKET', 165, 82)

  // Subtitle / Event Name
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = '#8b5a2b'
  ctx.fillText(title, 165, 130)

  // Details & Serial Number
  ctx.font = '16px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = '#7a6858'
  ctx.fillText(subTitle, 165, 172)
  ctx.fillText(number, 165, 205)

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

function VintageTicketMesh({ texture }) {
  const ticketGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    const w = 0.36
    const h = 0.18
    const r = 0.038

    shape.moveTo(-w, -h)
    shape.lineTo(w, -h)
    shape.lineTo(w, -r)
    shape.absarc(w, 0, r, -Math.PI / 2, Math.PI / 2, true)
    shape.lineTo(w, h)
    shape.lineTo(-w, h)
    shape.lineTo(-w, r)
    shape.absarc(-w, 0, r, Math.PI / 2, -Math.PI / 2, true)
    shape.lineTo(-w, -h)

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.012,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.004,
      bevelThickness: 0.004,
    })
  }, [])

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh geometry={ticketGeometry}>
        <meshStandardMaterial color="#f6eed8" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.016]}>
        <planeGeometry args={[0.7, 0.35]} />
        <meshStandardMaterial map={texture} roughness={0.6} />
      </mesh>
    </group>
  )
}

/**
 * MovieScene — Fixed: Stable, Non-Flickering Floating Tickets
 */
export default function MovieScene({ onSelectTicket }) {
  const containerRef = useRef()
  const groupRef = useRef()
  const lightBeamRef = useRef()

  // Visual refs for smooth levitation
  const ticket1VisualRef = useRef()
  const ticket2VisualRef = useRef()
  const [hoveredTicket, setHoveredTicket] = useState(null)

  const ticket1Texture = useMemo(() => createTicketTexture('FIRST FILM', 'Synchronized Streams', 'NO. 0001'), [])
  const ticket2Texture = useMemo(() => createTicketTexture('MIDNIGHT MOVIES', 'Dharmavaram ↔ Hanoi', 'NO. 0002'), [])

  // Smooth Arrival Fly-In
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.position,
        { z: -3.5, y: -0.4 },
        { z: 0, y: 0.05, duration: 1.2, ease: 'power2.out', delay: 0.1 }
      )
      gsap.fromTo(
        containerRef.current.scale,
        { x: 0.5, y: 0.5, z: 0.5 },
        { x: 1.0, y: 1.0, z: 1.0, duration: 1.2, ease: 'power2.out', delay: 0.1 }
      )
    }
  }, [])

  // Smooth Levitation for Ticket 1 (No hover loop!)
  useEffect(() => {
    if (!ticket1VisualRef.current) return
    if (hoveredTicket === 'first-film') {
      gsap.to(ticket1VisualRef.current.position, { y: 0.14, duration: 0.35, ease: 'power2.out' })
      gsap.to(ticket1VisualRef.current.rotation, { x: -0.16, duration: 0.35, ease: 'power2.out' })
    } else {
      gsap.to(ticket1VisualRef.current.position, { y: 0, duration: 0.45, ease: 'power2.out' })
      gsap.to(ticket1VisualRef.current.rotation, { x: 0, duration: 0.45, ease: 'power2.out' })
    }
  }, [hoveredTicket])

  // Smooth Levitation for Ticket 2 (No hover loop!)
  useEffect(() => {
    if (!ticket2VisualRef.current) return
    if (hoveredTicket === 'midnight-movies') {
      gsap.to(ticket2VisualRef.current.position, { y: 0.14, duration: 0.35, ease: 'power2.out' })
      gsap.to(ticket2VisualRef.current.rotation, { x: -0.16, duration: 0.35, ease: 'power2.out' })
    } else {
      gsap.to(ticket2VisualRef.current.position, { y: 0, duration: 0.45, ease: 'power2.out' })
      gsap.to(ticket2VisualRef.current.rotation, { x: 0, duration: 0.45, ease: 'power2.out' })
    }
  }, [hoveredTicket])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.position.y = -0.15 + Math.sin(t * 0.9) * 0.02
    }
    if (lightBeamRef.current) {
      lightBeamRef.current.intensity = 2.6 + Math.sin(t * 8) * 0.15 + Math.cos(t * 14) * 0.1
    }
  })

  return (
    <group ref={containerRef} position={[0, 0.05, 0]}>
      <group ref={groupRef} position={[0, -0.15, 0]}>
        <ambientLight color="#1a140a" intensity={0.85} />
        <pointLight color="#fcd34d" intensity={1.2} position={[0, 2.5, 2]} />

        {/* ================= 1. FLOOR & RUG ================= */}
        <RoundedBox args={[3.8, 0.24, 2.6]} radius={0.12} smoothness={4} position={[0, -0.12, 0]}>
          <meshStandardMaterial color="#1a1512" roughness={0.8} metalness={0.04} />
        </RoundedBox>

        <RoundedBox args={[2.9, 0.02, 1.9]} radius={0.06} smoothness={3} position={[0, 0.01, 0]}>
          <meshStandardMaterial color="#2a1e16" roughness={0.9} />
        </RoundedBox>

        <mesh position={[0, -0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.2, 3.0]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.4} />
        </mesh>

        {/* ================= 2. PROJECTOR ================= */}
        <group position={[-1.25, 0.1, 0.2]} rotation={[0, 0.45, 0]}>
          <RoundedBox args={[0.45, 0.45, 0.45]} radius={0.03} position={[0, 0.22, 0]}>
            <meshStandardMaterial color="#3d281a" roughness={0.7} />
          </RoundedBox>

          <RoundedBox args={[0.38, 0.26, 0.34]} radius={0.03} position={[0, 0.58, 0]}>
            <meshStandardMaterial color="#262d3a" roughness={0.6} />
          </RoundedBox>

          <mesh position={[-0.08, 0.78, -0.05]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.11, 0.11, 0.03, 24]} />
            <meshStandardMaterial color="#161c28" roughness={0.5} metalness={0.3} />
          </mesh>
          <mesh position={[0.08, 0.78, 0.05]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.11, 0.11, 0.03, 24]} />
            <meshStandardMaterial color="#161c28" roughness={0.5} metalness={0.3} />
          </mesh>

          <mesh position={[0, 0.58, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.05, 24]} />
            <meshStandardMaterial color="#fcd34d" emissive="#fcd34d" emissiveIntensity={3.5} />
          </mesh>

          <pointLight ref={lightBeamRef} color="#fef08a" intensity={2.6} distance={5.0} position={[0, 0.58, 0.3]} />
        </group>

        {/* ================= 3. HANGING SCREEN ================= */}
        <group position={[1.05, 0.75, -0.35]} rotation={[0, -0.35, 0]}>
          <RoundedBox args={[1.6, 1.0, 0.04]} radius={0.02} position={[0, 0, 0]}>
            <meshStandardMaterial color="#1c2230" roughness={0.7} />
          </RoundedBox>

          <mesh position={[0, 0, 0.022]}>
            <planeGeometry args={[1.48, 0.9]} />
            <meshStandardMaterial color="#fffdf7" roughness={0.8} emissive="#fef08a" emissiveIntensity={0.4} />
          </mesh>
        </group>

        {/* ================= 4. WOODEN COFFEE TABLE ================= */}
        <RoundedBox args={[1.7, 0.05, 1.0]} radius={0.02} position={[0.08, 0.04, 0.28]}>
          <meshStandardMaterial color="#382518" roughness={0.7} />
        </RoundedBox>

        {/* ================= 5. TWO STABLE, NON-FLICKERING TICKETS ================= */}

        {/* TICKET 1: First Synchronized Film */}
        <group
          position={[-0.34, 0.105, 0.28]}
          rotation={[0, 0.24, 0]}
          onPointerOver={(e) => {
            e.stopPropagation()
            document.body.style.cursor = 'pointer'
            setHoveredTicket('first-film')
          }}
          onPointerOut={(e) => {
            e.stopPropagation()
            document.body.style.cursor = 'default'
            setHoveredTicket(null)
          }}
          onClick={(e) => {
            e.stopPropagation()
            onSelectTicket('first-film')
          }}
        >
          {/* Stationary Invisible Hitbox (NEVER moves, so hover NEVER breaks!) */}
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[0.85, 0.25, 0.55]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>

          {/* Shadow sitting firmly on the table */}
          <mesh position={[0, -0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.72, 0.38]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.35} />
          </mesh>

          {/* VISUAL TICKET THAT LEVITATES SMOOTHLY */}
          <group ref={ticket1VisualRef}>
            <VintageTicketMesh texture={ticket1Texture} />

            {/* Glowing Golden Aura that flares on hover */}
            <pointLight
              color="#fcd34d"
              intensity={hoveredTicket === 'first-film' ? 2.0 : 0}
              distance={1.6}
              position={[0, 0.08, 0]}
            />
          </group>

          {/* Floating Tag */}
          <Html position={[0, 0.24, 0]} center distanceFactor={4.5} className="select-none z-20 pointer-events-none">
            <div
              className={`px-2.5 py-1 rounded-full border text-[10px] font-sans font-semibold whitespace-nowrap shadow-clay-card transition-all transform ${
                hoveredTicket === 'first-film'
                  ? 'bg-amber-400 text-black border-amber-300 scale-110 shadow-glow-gold'
                  : 'bg-amber-500/35 text-amber-100 border-amber-300/60'
              }`}
            >
              ✦ First Film
            </div>
          </Html>
        </group>

        {/* TICKET 2: Midnight Movies */}
        <group
          position={[0.5, 0.105, 0.28]}
          rotation={[0, -0.24, 0]}
          onPointerOver={(e) => {
            e.stopPropagation()
            document.body.style.cursor = 'pointer'
            setHoveredTicket('midnight-movies')
          }}
          onPointerOut={(e) => {
            e.stopPropagation()
            document.body.style.cursor = 'default'
            setHoveredTicket(null)
          }}
          onClick={(e) => {
            e.stopPropagation()
            onSelectTicket('midnight-movies')
          }}
        >
          {/* Stationary Invisible Hitbox (NEVER moves, so hover NEVER breaks!) */}
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[0.85, 0.25, 0.55]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>

          {/* Shadow sitting firmly on the table */}
          <mesh position={[0, -0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.72, 0.38]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.35} />
          </mesh>

          {/* VISUAL TICKET THAT LEVITATES SMOOTHLY */}
          <group ref={ticket2VisualRef}>
            <VintageTicketMesh texture={ticket2Texture} />

            {/* Glowing Golden Aura that flares on hover */}
            <pointLight
              color="#f59e0b"
              intensity={hoveredTicket === 'midnight-movies' ? 2.0 : 0}
              distance={1.6}
              position={[0, 0.08, 0]}
            />
          </group>

          {/* Floating Tag */}
          <Html position={[0, 0.24, 0]} center distanceFactor={4.5} className="select-none z-20 pointer-events-none">
            <div
              className={`px-2.5 py-1 rounded-full border text-[10px] font-sans font-semibold whitespace-nowrap shadow-clay-card transition-all transform ${
                hoveredTicket === 'midnight-movies'
                  ? 'bg-yellow-400 text-black border-yellow-300 scale-110 shadow-glow-gold'
                  : 'bg-yellow-500/35 text-yellow-100 border-yellow-300/60'
              }`}
            >
              ✦ Midnight Movies
            </div>
          </Html>
        </group>
      </group>
    </group>
  )
}