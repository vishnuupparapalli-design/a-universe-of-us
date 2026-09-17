import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Html } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

/**
 * DistanceScene — Master Plan Section M & N
 * Fixed: Robust, guaranteed-visible 3D glowing starlight thread between Dharmavaram & Near Hanoi!
 */
export default function DistanceScene({ onOpenMemory }) {
  const containerRef = useRef()
  const groupRef = useRef()
  const threadLightRef = useRef()
  const pulseMoteRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Smooth Arrival Fly-In
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.position,
        { z: -3.5, y: -0.3 },
        { z: 0, y: 0.05, duration: 1.2, ease: 'power2.out', delay: 0.1 }
      )
      gsap.fromTo(
        containerRef.current.scale,
        { x: 0.5, y: 0.5, z: 0.5 },
        { x: 1.0, y: 1.0, z: 1.0, duration: 1.2, ease: 'power2.out', delay: 0.1 }
      )
    }
  }, [])

  // Animate a starlight pulse traveling back and forth along the thread!
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.position.y = -0.15 + Math.sin(t * 0.8) * 0.025
    }
    if (threadLightRef.current) {
      threadLightRef.current.intensity = (hovered ? 2.8 : 1.8) + Math.sin(t * 3.5) * 0.25
    }
    if (pulseMoteRef.current) {
      // Light pulse travels back and forth between Dharmavaram (-1.5) and Near Hanoi (+1.5)
      pulseMoteRef.current.position.x = Math.sin(t * 1.5) * 1.45
    }
  })

  return (
    <group ref={containerRef} position={[0, 0.05, 0]}>
      <group ref={groupRef} position={[0, -0.15, 0]}>
        
        {/* Deep Space Navy Atmosphere */}
        <ambientLight color="#091124" intensity={0.9} />
        <pointLight color="#ffffff" intensity={2.5} position={[0, 3, 2]} />

        {/* ================= 1. BEACON A: DHARMAVARAM (LEFT) ================= */}
        <group position={[-1.5, 0, 0]}>
          <RoundedBox args={[1.2, 0.22, 1.2]} radius={0.08} position={[0, 0.1, 0]}>
            <meshStandardMaterial color="#1c2436" roughness={0.7} metalness={0.06} />
          </RoundedBox>

          <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.4, 1.4]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.4} />
          </mesh>

          <mesh position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.04, 0.05, 0.25, 24]} />
            <meshStandardMaterial color="#dfb76c" metalness={0.4} roughness={0.3} />
          </mesh>

          <mesh position={[0, 0.45, 0]}>
            <sphereGeometry args={[0.085, 24, 24]} />
            <meshStandardMaterial color="#ffffff" emissive="#dfb76c" emissiveIntensity={3.2} />
          </mesh>
          <pointLight color="#dfb76c" intensity={2.0} distance={2.5} position={[0, 0.45, 0]} />

          {/* Floating Tag */}
          <Html position={[0, 0.72, 0]} center distanceFactor={4.5} className="select-none z-20">
            <button
              onClick={onOpenMemory}
              className="cursor-pointer px-3 py-1 rounded-full bg-amber-500/25 hover:bg-amber-400 text-amber-200 hover:text-black border border-amber-300/60 text-[10px] font-sans font-semibold whitespace-nowrap shadow-clay-card transition-all transform hover:scale-110 active:scale-95"
            >
              ✦ Dharmavaram
            </button>
          </Html>
        </group>

        {/* ================= 2. BEACON B: NEAR HANOI (RIGHT) ================= */}
        <group position={[1.5, 0, 0]}>
          <RoundedBox args={[1.2, 0.22, 1.2]} radius={0.08} position={[0, 0.1, 0]}>
            <meshStandardMaterial color="#1c2436" roughness={0.7} metalness={0.06} />
          </RoundedBox>

          <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.4, 1.4]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.4} />
          </mesh>

          <mesh position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.04, 0.05, 0.25, 24]} />
            <meshStandardMaterial color="#00f2fe" metalness={0.4} roughness={0.3} />
          </mesh>

          <mesh position={[0, 0.45, 0]}>
            <sphereGeometry args={[0.085, 24, 24]} />
            <meshStandardMaterial color="#ffffff" emissive="#00f2fe" emissiveIntensity={3.2} />
          </mesh>
          <pointLight color="#00f2fe" intensity={2.0} distance={2.5} position={[0, 0.45, 0]} />

          {/* Floating Tag */}
          <Html position={[0, 0.72, 0]} center distanceFactor={4.5} className="select-none z-20">
            <button
              onClick={onOpenMemory}
              className="cursor-pointer px-3 py-1 rounded-full bg-cyan-500/25 hover:bg-cyan-400 text-cyan-200 hover:text-black border border-cyan-300/60 text-[10px] font-sans font-semibold whitespace-nowrap shadow-clay-card transition-all transform hover:scale-110 active:scale-95"
            >
              ✦ Near Hanoi
            </button>
          </Html>
        </group>

        {/* ================= 3. GUARANTEED 3D GLOWING STARLIGHT THREAD ================= */}
        <group
          position={[0, 0.45, 0]}
          onClick={(e) => {
            e.stopPropagation()
            onOpenMemory()
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            document.body.style.cursor = 'pointer'
            setHovered(true)
          }}
          onPointerOut={(e) => {
            e.stopPropagation()
            document.body.style.cursor = 'default'
            setHovered(false)
          }}
        >
          {/* Inner Sharp Starlight Core Cylinder */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.016, 0.016, 3.0, 16]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive={hovered ? '#ffffff' : '#00f2fe'}
              emissiveIntensity={hovered ? 4.5 : 3.0}
            />
          </mesh>

          {/* Outer Soft Neon Halo Cylinder */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 3.0, 16]} />
            <meshBasicMaterial
              color="#38bdf8"
              transparent
              opacity={hovered ? 0.55 : 0.28}
            />
          </mesh>

          {/* Starlight pulse that travels back and forth along the thread! */}
          <mesh ref={pulseMoteRef} position={[0, 0, 0]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={4.0} />
          </mesh>

          {/* Point Light along the thread */}
          <pointLight
            ref={threadLightRef}
            color="#38bdf8"
            intensity={1.8}
            distance={4.0}
            position={[0, 0.05, 0]}
          />

          {/* Center Floating Tag */}
          <Html position={[0, 0.32, 0]} center distanceFactor={4.5} className="select-none z-20">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onOpenMemory()
              }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className={`cursor-pointer px-3 py-1 rounded-full border text-[10px] font-sans font-semibold whitespace-nowrap shadow-clay-card transition-all transform hover:scale-110 active:scale-95 ${
                hovered
                  ? 'bg-cyan-400 text-black border-white scale-110 shadow-glow-star'
                  : 'bg-elsewhere-surface/90 text-cyan-200 border-cyan-300/60 hover:bg-cyan-400 hover:text-black hover:border-white'
              }`}
            >
              ✦ The Thread Between Us
            </button>
          </Html>
        </group>

        {/* ================= 4. GENSHIN MEETING SPARK (PROPERLY LOWERED) ================= */}
        <group position={[0, 1.0, -0.6]} rotation={[0, 0.4, 0]}>
          <mesh>
            <octahedronGeometry args={[0.07, 0]} />
            <meshStandardMaterial color="#ffffff" emissive="#a5b4fc" emissiveIntensity={2.5} />
          </mesh>
          <pointLight color="#a5b4fc" intensity={0.8} distance={1.8} />
          <Html position={[0, 0.16, 0]} center distanceFactor={4.5} className="pointer-events-none select-none">
            <div className="text-[9px] font-serif italic text-white/50 whitespace-nowrap">
              Where we met (Genshin)
            </div>
          </Html>
        </group>

      </group>
    </group>
  )
}