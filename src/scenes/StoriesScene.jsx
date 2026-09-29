import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Html } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

export default function StoriesScene({ onSelectStory }) {
  const containerRef = useRef()
  const groupRef = useRef()
  const lampLightRef = useRef()

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
    if (lampLightRef.current) {
      lampLightRef.current.intensity = 2.2 + Math.sin(t * 3) * 0.12
    }
  })

  return (
    <group ref={containerRef} position={[0, 0.05, 0]}>
      <group ref={groupRef} position={[0, -0.15, 0]}>
        
        {/* Warm Reading Desk Lighting */}
        <ambientLight color="#1f1610" intensity={0.9} />
        <pointLight color="#fff0d0" intensity={1.5} position={[0, 2.8, 1.5]} />

        {/* 1. Base Mahogany Desk Slab */}
        <RoundedBox args={[3.8, 0.24, 2.6]} radius={0.12} smoothness={4} position={[0, -0.12, 0]}>
          <meshStandardMaterial color="#261b14" roughness={0.75} metalness={0.04} />
        </RoundedBox>

        {/* Desk Felt Mat */}
        <RoundedBox args={[3.1, 0.02, 2.0]} radius={0.06} smoothness={3} position={[0, 0.01, 0]}>
          <meshStandardMaterial color="#1a1410" roughness={0.85} />
        </RoundedBox>

        {/* Shadow */}
        <mesh position={[0, -0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.2, 3.0]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.4} />
        </mesh>

        {/* 2. Cozy Desk Lamp (FIXED: Moved inward to x = -1.1 so it sits 100% flat on the mat!) */}
        <group position={[-1.1, 0.02, -0.35]}>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.22, 0.24, 0.035, 32]} />
            <meshStandardMaterial color="#3a2a1d" roughness={0.6} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.85, 16]} />
            <meshStandardMaterial color="#dfb76c" roughness={0.4} metalness={0.3} />
          </mesh>
          <mesh position={[0, 0.85, 0]}>
            <coneGeometry args={[0.32, 0.35, 24, 1, true]} />
            <meshStandardMaterial color="#422f20" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.76, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffd68a" emissiveIntensity={3.0} />
          </mesh>
          <pointLight
            ref={lampLightRef}
            color="#ffd68a"
            intensity={2.2}
            distance={4.5}
            position={[0, 0.72, 0]}
          />
        </group>

        {/* 3. Reading Bookstand */}
        <group position={[0.1, 0.02, 0]} rotation={[-0.48, 0, 0]}>
          <RoundedBox args={[1.85, 1.0, 0.05]} radius={0.02} position={[0, 0.52, 0]}>
            <meshStandardMaterial color="#382519" roughness={0.7} />
          </RoundedBox>

          <RoundedBox args={[1.85, 0.08, 0.24]} radius={0.015} position={[0, 0.04, 0.1]}>
            <meshStandardMaterial color="#2d1c12" roughness={0.75} />
          </RoundedBox>

          {/* Book 1: Her Story (Near Hanoi) */}
          <group position={[-0.42, 0.46, 0.09]} rotation={[0, 0.04, -0.03]}>
            <group
              onClick={(e) => {
                e.stopPropagation()
                onSelectStory('her-story')
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
              <RoundedBox args={[0.62, 0.78, 0.12]} radius={0.02}>
                <meshStandardMaterial color="#22334d" roughness={0.6} />
              </RoundedBox>
              <RoundedBox args={[0.58, 0.74, 0.09]} radius={0.01} position={[0.015, 0, 0]}>
                <meshStandardMaterial color="#f5eee2" roughness={0.8} />
              </RoundedBox>
              <mesh position={[0, -0.42, 0.02]}>
                <boxGeometry args={[0.07, 0.16, 0.01]} />
                <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.5} />
              </mesh>
            </group>

            <Html position={[0, 0.54, 0.05]} center distanceFactor={4.5} className="select-none z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectStory('her-story')
                }}
                className="cursor-pointer px-3 py-1 rounded-full bg-cyan-500/25 hover:bg-cyan-400 text-cyan-200 hover:text-black border border-cyan-300/60 text-[10px] font-sans font-semibold whitespace-nowrap shadow-clay-card transition-all transform hover:scale-110 active:scale-95"
              >
                ✦ Her Story (Near Hanoi)
              </button>
            </Html>
          </group>

          {/* Book 2: My Story (Dharmavaram) */}
          <group position={[0.42, 0.46, 0.09]} rotation={[0, -0.04, 0.03]}>
            <group
              onClick={(e) => {
                e.stopPropagation()
                onSelectStory('my-story')
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
              <RoundedBox args={[0.62, 0.78, 0.12]} radius={0.02}>
                <meshStandardMaterial color="#b45309" roughness={0.6} />
              </RoundedBox>
              <RoundedBox args={[0.58, 0.74, 0.09]} radius={0.01} position={[-0.015, 0, 0]}>
                <meshStandardMaterial color="#f5eee2" roughness={0.8} />
              </RoundedBox>
              <mesh position={[0, -0.42, 0.02]}>
                <boxGeometry args={[0.07, 0.16, 0.01]} />
                <meshStandardMaterial color="#dfb76c" emissive="#dfb76c" emissiveIntensity={0.5} />
              </mesh>
            </group>

            <Html position={[0, 0.54, 0.05]} center distanceFactor={4.5} className="select-none z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectStory('my-story')
                }}
                className="cursor-pointer px-3 py-1 rounded-full bg-amber-500/25 hover:bg-amber-400 text-amber-200 hover:text-black border border-amber-300/60 text-[10px] font-sans font-semibold whitespace-nowrap shadow-clay-card transition-all transform hover:scale-110 active:scale-95"
              >
                ✦ My Story (Dharmavaram)
              </button>
            </Html>
          </group>
        </group>

        {/* Golden Pen */}
        <mesh position={[1.2, 0.03, 0.4]} rotation={[0, 0.3, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.45, 16]} />
          <meshStandardMaterial color="#dfb76c" metalness={0.5} roughness={0.4} />
        </mesh>
      </group>
    </group>
  )
}