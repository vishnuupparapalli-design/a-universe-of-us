import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Html } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

/**
 * MovieScene — Accessible Tickets and Clickable Floating Name Tags!
 */
export default function MovieScene({ onSelectTicket }) {
  const containerRef = useRef()
  const groupRef = useRef()
  const lightBeamRef = useRef()

  // Smooth Cinema Arrival Glide!
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

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.position.y = -0.15 + Math.sin(t * 0.9) * 0.02
    }
    if (lightBeamRef.current) {
      lightBeamRef.current.intensity = 2.4 + Math.sin(t * 8) * 0.15 + Math.cos(t * 15) * 0.1
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

        <RoundedBox args={[2.8, 0.02, 1.8]} radius={0.06} smoothness={3} position={[0, 0.01, 0]}>
          <meshStandardMaterial color="#2d1f18" roughness={0.9} />
        </RoundedBox>

        <mesh position={[0, -0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.2, 3.0]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.4} />
        </mesh>

        {/* ================= 2. PROJECTOR & BEAM ================= */}
        <group position={[-1.2, 0.1, 0.3]} rotation={[0, 0.35, 0]}>
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

          {/* Golden Lens */}
          <mesh position={[0, 0.58, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.05, 24]} />
            <meshStandardMaterial color="#fcd34d" emissive="#fcd34d" emissiveIntensity={2.5} />
          </mesh>

          <pointLight ref={lightBeamRef} color="#fef08a" intensity={2.4} distance={4.5} position={[0, 0.58, 0.4]} />

          {/* Clean Light Cone Beam */}
          <mesh position={[0, 0.58, 1.3]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.75, 2.2, 32, 1, true]} />
            <meshBasicMaterial color="#fef08a" transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
        </group>

        {/* ================= 3. HANGING SCREEN ================= */}
        <group position={[1.1, 0.75, -0.4]} rotation={[0, -0.35, 0]}>
          <RoundedBox args={[1.5, 0.95, 0.04]} radius={0.02} position={[0, 0, 0]}>
            <meshStandardMaterial color="#1c2230" roughness={0.7} />
          </RoundedBox>

          <mesh position={[0, 0, 0.022]}>
            <planeGeometry args={[1.38, 0.85]} />
            <meshStandardMaterial color="#fffdf7" roughness={0.8} emissive="#fef08a" emissiveIntensity={0.35} />
          </mesh>
        </group>

        {/* ================= 4. CUSHIONS & TRAY ================= */}
        <mesh position={[0.1, 0.08, 0.35]} scale={[1.2, 0.5, 1.2]}>
          <sphereGeometry args={[0.26, 24, 16]} />
          <meshStandardMaterial color="#c26d3a" roughness={0.85} />
        </mesh>

        <mesh position={[-0.4, 0.07, 0.6]} scale={[1.1, 0.45, 1.1]} rotation={[0, 0.4, 0]}>
          <sphereGeometry args={[0.24, 24, 16]} />
          <meshStandardMaterial color="#2d3c59" roughness={0.85} />
        </mesh>

        {/* Wooden Keepsake Tray */}
        <RoundedBox args={[1.15, 0.04, 0.6]} radius={0.015} position={[0.45, 0.04, 0.2]}>
          <meshStandardMaterial color="#422e20" roughness={0.7} />
        </RoundedBox>

        {/* ================= 5. TWO SEPARATED, DIRECTLY CLICKABLE TICKETS ================= */}
        
        {/* TICKET 1: First Synchronized Film */}
        <group
          position={[0.18, 0.08, 0.2]}
          rotation={[0, 0.12, 0]}
        >
          {/* Clickable Ticket 3D Mesh */}
          <group
            onClick={(e) => {
              e.stopPropagation()
              onSelectTicket('first-film')
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={(e) => {
              e.stopPropagation()
              document.body.style.cursor = 'default'
            }}
          >
            <RoundedBox args={[0.34, 0.02, 0.2]} radius={0.008}>
              <meshStandardMaterial color="#fef08a" roughness={0.5} emissive="#fcd34d" emissiveIntensity={0.35} />
            </RoundedBox>
            <mesh position={[0, 0.012, 0]}>
              <planeGeometry args={[0.3, 0.16]} />
              <meshStandardMaterial color="#fef9c3" roughness={0.4} />
            </mesh>
          </group>

          {/* CLICKABLE FLOATING NAME TAG! */}
          <Html position={[0, 0.18, 0]} center distanceFactor={4.5} className="select-none z-20">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSelectTicket('first-film')
              }}
              className="cursor-pointer px-2.5 py-1 rounded-full bg-amber-500/30 hover:bg-amber-400 text-amber-100 hover:text-black border border-amber-300/60 text-[10px] font-sans font-semibold whitespace-nowrap shadow-clay-card transition-all transform hover:scale-110 active:scale-95"
            >
              ✦ First Film
            </button>
          </Html>
        </group>

        {/* TICKET 2: Midnight Movies */}
        <group
          position={[0.74, 0.08, 0.2]}
          rotation={[0, -0.15, 0]}
        >
          {/* Clickable Ticket 3D Mesh */}
          <group
            onClick={(e) => {
              e.stopPropagation()
              onSelectTicket('midnight-movies')
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={(e) => {
              e.stopPropagation()
              document.body.style.cursor = 'default'
            }}
          >
            <RoundedBox args={[0.34, 0.02, 0.2]} radius={0.008}>
              <meshStandardMaterial color="#fbbf24" roughness={0.5} emissive="#f59e0b" emissiveIntensity={0.35} />
            </RoundedBox>
            <mesh position={[0, 0.012, 0]}>
              <planeGeometry args={[0.3, 0.16]} />
              <meshStandardMaterial color="#fef3c7" roughness={0.4} />
            </mesh>
          </group>

          {/* CLICKABLE FLOATING NAME TAG! */}
          <Html position={[0, 0.18, 0]} center distanceFactor={4.5} className="select-none z-20">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSelectTicket('midnight-movies')
              }}
              className="cursor-pointer px-2.5 py-1 rounded-full bg-yellow-500/30 hover:bg-yellow-400 text-yellow-100 hover:text-black border border-yellow-300/60 text-[10px] font-sans font-semibold whitespace-nowrap shadow-clay-card transition-all transform hover:scale-110 active:scale-95"
            >
              ✦ Midnight Movies
            </button>
          </Html>
        </group>
      </group>
    </group>
  )
}