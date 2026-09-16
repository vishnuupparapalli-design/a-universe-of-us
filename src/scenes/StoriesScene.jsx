import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Html } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

/**
 * Handcrafted 3D Hardcover Book Model
 * Authentic book anatomy: Leather covers with overhang, cream paper block, rounded spine, and gold emblem!
 */
function SculptedBook({ coverColor, ribbonColor, emblemType = 'star' }) {
  return (
    <group>
      {/* 1. Bottom Leather Cover */}
      <RoundedBox args={[0.72, 0.02, 0.98]} radius={0.015} position={[0, -0.055, 0]}>
        <meshStandardMaterial color={coverColor} roughness={0.65} />
      </RoundedBox>

      {/* 2. Thick Block of Cream Paper Pages (Tucked inside with realistic overhang!) */}
      <RoundedBox args={[0.66, 0.09, 0.92]} radius={0.008} position={[0.015, 0, 0]}>
        <meshStandardMaterial color="#f7f1e6" roughness={0.85} />
      </RoundedBox>

      {/* 3. Top Leather Cover (Overhanging the pages) */}
      <RoundedBox args={[0.72, 0.02, 0.98]} radius={0.015} position={[0, 0.055, 0]}>
        <meshStandardMaterial color={coverColor} roughness={0.65} />
      </RoundedBox>

      {/* 4. Rounded Leather Spine along the left edge */}
      <mesh position={[-0.35, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.065, 0.065, 0.98, 16]} />
        <meshStandardMaterial color={coverColor} roughness={0.6} />
      </mesh>

      {/* Gold Ridge Bands on the spine */}
      <mesh position={[-0.35, 0, -0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.068, 0.068, 0.025, 16]} />
        <meshStandardMaterial color="#dfb76c" metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[-0.35, 0, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.068, 0.068, 0.025, 16]} />
        <meshStandardMaterial color="#dfb76c" metalness={0.4} roughness={0.35} />
      </mesh>

      {/* 5. Embossed Gold Celestial Emblem in center of cover (NO hollow picture frame!) */}
      <group position={[0.02, 0.068, 0]}>
        {/* Outer Gold Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.13, 0.16, 24]} />
          <meshStandardMaterial color="#dfb76c" metalness={0.4} roughness={0.35} emissive="#dfb76c" emissiveIntensity={0.2} />
        </mesh>
        {/* Center Emblem Core */}
        {emblemType === 'star' ? (
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <octahedronGeometry args={[0.08, 0]} />
            <meshStandardMaterial color="#dfb76c" metalness={0.4} roughness={0.35} emissive="#dfb76c" emissiveIntensity={0.25} />
          </mesh>
        ) : (
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.065, 16]} />
            <meshStandardMaterial color="#dfb76c" metalness={0.4} roughness={0.35} emissive="#dfb76c" emissiveIntensity={0.25} />
          </mesh>
        )}
      </group>

      {/* 6. Silk Bookmark Ribbon hanging gracefully from between the pages */}
      <mesh position={[0.05, 0.01, 0.54]} rotation={[0.22, 0, 0]}>
        <boxGeometry args={[0.06, 0.006, 0.22]} />
        <meshStandardMaterial color={ribbonColor} emissive={ribbonColor} emissiveIntensity={0.5} roughness={0.4} />
      </mesh>
    </group>
  )
}

/**
 * StoriesScene — Master Plan Section J
 */
export default function StoriesScene({ onSelectStory }) {
  const containerRef = useRef()
  const groupRef = useRef()
  const lampLightRef = useRef()

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

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.position.y = -0.15 + Math.sin(t * 0.9) * 0.02
    }
    if (lampLightRef.current) {
      lampLightRef.current.intensity = 2.4 + Math.sin(t * 3) * 0.15
    }
  })

  return (
    <group ref={containerRef} position={[0, 0.05, 0]}>
      <group ref={groupRef} position={[0, -0.15, 0]}>
        
        {/* Warm Reading Desk Lighting */}
        <ambientLight color="#1f1610" intensity={0.9} />
        <pointLight color="#fff0d0" intensity={1.6} position={[0, 2.8, 1.5]} />

        {/* 1. Base Mahogany Desk Slab */}
        <RoundedBox args={[3.8, 0.24, 2.6]} radius={0.12} smoothness={4} position={[0, -0.12, 0]}>
          <meshStandardMaterial color="#241912" roughness={0.75} metalness={0.04} />
        </RoundedBox>

        {/* Desk Leather Mat */}
        <RoundedBox args={[3.0, 0.02, 2.0]} radius={0.06} smoothness={3} position={[0, 0.01, 0]}>
          <meshStandardMaterial color="#1a120c" roughness={0.85} />
        </RoundedBox>

        {/* Floor Shadow */}
        <mesh position={[0, -0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.2, 3.0]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.4} />
        </mesh>

        {/* 2. Cozy Desk Lamp */}
        <group position={[-1.35, 0.1, -0.35]}>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.2, 0.22, 0.04, 24]} />
            <meshStandardMaterial color="#3a2a1d" roughness={0.6} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.85, 16]} />
            <meshStandardMaterial color="#dfb76c" roughness={0.35} metalness={0.4} />
          </mesh>
          <mesh position={[0, 0.85, 0]}>
            <coneGeometry args={[0.34, 0.35, 24, 1, true]} />
            <meshStandardMaterial color="#dfb76c" roughness={0.5} emissive="#fcd34d" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0, 0.75, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffd68a" emissiveIntensity={3.5} />
          </mesh>
          <pointLight
            ref={lampLightRef}
            color="#ffd68a"
            intensity={2.4}
            distance={4.5}
            position={[0, 0.7, 0.1]}
          />
        </group>

        {/* 3. Angled Wooden Reading Bookstand */}
        <group position={[0.05, 0.05, 0]} rotation={[-0.2, 0, 0]}>
          <RoundedBox args={[2.0, 0.06, 1.25]} radius={0.02} position={[0, 0.14, 0]}>
            <meshStandardMaterial color="#382518" roughness={0.7} />
          </RoundedBox>
          <RoundedBox args={[2.0, 0.08, 0.08]} radius={0.015} position={[0, 0.2, 0.6]}>
            <meshStandardMaterial color="#2d1c12" roughness={0.7} />
          </RoundedBox>
        </group>

        {/* ================= 4. THE TWO SCULPTED BOOKS ================= */}

        {/* BOOK 1: Her Story (Near Hanoi) — Indigo Leather with Cyan Bookmark */}
        <group
          position={[-0.44, 0.22, 0.05]}
          rotation={[-0.2, 0.04, -0.02]}
        >
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
            <SculptedBook
              coverColor="#1e2e47"
              ribbonColor="#38bdf8"
              emblemType="star"
            />
          </group>

          {/* Clickable Floating Badge Tag */}
          <Html position={[0, 0.22, -0.48]} center distanceFactor={4.5} className="select-none z-20">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSelectStory('her-story')
              }}
              className="cursor-pointer px-2.5 py-1 rounded-full bg-cyan-500/30 hover:bg-cyan-400 text-cyan-100 hover:text-black border border-cyan-300/60 text-[10px] font-sans font-semibold whitespace-nowrap shadow-clay-card transition-all transform hover:scale-110 active:scale-95"
            >
              ✦ Her Story (Near Hanoi)
            </button>
          </Html>
        </group>

        {/* BOOK 2: My Story (Dharmavaram) — Amber Leather with Gold Bookmark */}
        <group
          position={[0.54, 0.22, 0.05]}
          rotation={[-0.2, -0.04, 0.02]}
        >
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
            <SculptedBook
              coverColor="#b45309"
              ribbonColor="#dfb76c"
              emblemType="sun"
            />
          </group>

          {/* Clickable Floating Badge Tag */}
          <Html position={[0, 0.22, -0.48]} center distanceFactor={4.5} className="select-none z-20">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSelectStory('my-story')
              }}
              className="cursor-pointer px-2.5 py-1 rounded-full bg-amber-500/30 hover:bg-amber-400 text-amber-100 hover:text-black border border-amber-300/60 text-[10px] font-sans font-semibold whitespace-nowrap shadow-clay-card transition-all transform hover:scale-110 active:scale-95"
            >
              ✦ My Story (Dharmavaram)
            </button>
          </Html>
        </group>

        {/* Vintage Brass Pen resting on the desk */}
        <mesh position={[1.2, 0.03, 0.35]} rotation={[0, 0.2, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.45, 16]} />
          <meshStandardMaterial color="#dfb76c" metalness={0.6} roughness={0.35} />
        </mesh>
      </group>
    </group>
  )
}