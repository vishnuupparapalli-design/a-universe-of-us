import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

/**
 * HardDaysScene — Master Plan Section K
 * Near-dark room, minimal geometry, one small warm candle light.
 * Restraint through values.
 */
export default function HardDaysScene({ onOpenMemory }) {
  const containerRef = useRef()
  const candleLightRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Smooth Arrival
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.position,
        { z: -2.5, y: -0.2 },
        { z: 0, y: 0.05, duration: 1.4, ease: 'power2.out', delay: 0.1 }
      )
    }
  }, [])

  // Gentle, quiet breathing candle flicker
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (candleLightRef.current) {
      candleLightRef.current.intensity = 1.8 + Math.sin(t * 3.5) * 0.12 + Math.cos(t * 7.0) * 0.08
    }
  })

  return (
    <group ref={containerRef} position={[0, 0.05, 0]}>
      {/* Deep, Near-Black Ambient Light (Restraint through values) */}
      <ambientLight color="#080a0f" intensity={0.4} />

      {/* 1. Minimal Dark Floor Slab */}
      <RoundedBox args={[3.6, 0.2, 2.4]} radius={0.1} smoothness={4} position={[0, -0.1, 0]}>
        <meshStandardMaterial color="#0f131a" roughness={0.9} metalness={0.02} />
      </RoundedBox>

      {/* Floor Shadow */}
      <mesh position={[0, -0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.0, 2.8]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.5} />
      </mesh>

      {/* 2. Central Ceramic Resting Dish */}
      <mesh position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.42, 0.46, 0.03, 32]} />
        <meshStandardMaterial color="#181d26" roughness={0.8} />
      </mesh>

      {/* 3. The River Stone & Candle Flame (Clickable!) */}
      <group
        position={[0, 0.08, 0]}
        onClick={(e) => {
          e.stopPropagation()
          if (onOpenMemory) onOpenMemory()
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
        {/* Invisible Hitbox */}
        <mesh position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {/* Smooth Slate River Stone */}
        <mesh position={[0, 0.05, 0]} scale={[1.2, 0.65, 1.0]}>
          <sphereGeometry args={[0.28, 32, 24]} />
          <meshStandardMaterial
            color={hovered ? '#3b4759' : '#273140'}
            roughness={0.7}
            metalness={0.05}
          />
        </mesh>

        {/* The Candle Flame / Ember (One small warm light) */}
        <mesh position={[0, 0.25, 0]}>
          <sphereGeometry args={[0.055, 20, 20]} />
          <meshStandardMaterial
            color="#fff8eb"
            emissive="#ffd68a"
            emissiveIntensity={hovered ? 3.8 : 2.6}
          />
        </mesh>

        {/* Gentle Flame Halo Ring */}
        <mesh position={[0, 0.25, 0]}>
          <ringGeometry args={[0.08, 0.14, 24]} />
          <meshBasicMaterial
            color="#ffbe42"
            transparent
            opacity={hovered ? 0.45 : 0.25}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* The Solitary Warm Light Beam in the dark */}
        <pointLight
          ref={candleLightRef}
          color="#ffd68a"
          intensity={hovered ? 2.5 : 1.8}
          distance={3.8}
          decay={2}
          position={[0, 0.3, 0.05]}
        />
      </group>
    </group>
  )
}