import React, { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

/**
 * BeginningScene — Master Plan Section H
 * - Arrival fly-in deceleration (shooting out of the wormhole!)
 * - Dual light drift and collision shockwave
 * - Final camera pull-back into the vast sky
 */
export default function BeginningScene({ onMerged }) {
  const { camera } = useThree()

  const containerRef = useRef()
  const groupRef = useRef()
  const lightARef = useRef()
  const lightBRef = useRef()
  const mergedStarRef = useRef()
  const burstLightRef = useRef()
  const shockwaveRef = useRef()

  const [hasMerged, setHasMerged] = useState(false)
  const [isMerging, setIsMerging] = useState(false)

  // WORMHOLE EXIT FLY-IN: Island zooms smoothly out of deep space on arrival!
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.position,
        { z: -5.5, y: -0.6 },
        { z: 0, y: 0, duration: 1.5, ease: 'power2.out', delay: 0.15 }
      )
      gsap.fromTo(
        containerRef.current.scale,
        { x: 0.25, y: 0.25, z: 0.25 },
        { x: 1.0, y: 1.0, z: 1.0, duration: 1.5, ease: 'power2.out', delay: 0.15 }
      )
    }
  }, [])

  // Floating island idle hover & crystal pulsation
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.position.y = -0.15 + Math.sin(t * 0.8) * 0.03
    }
    if (!hasMerged && !isMerging) {
      if (lightARef.current) lightARef.current.position.y = 0.38 + Math.sin(t * 2) * 0.035
      if (lightBRef.current) lightBRef.current.position.y = 0.38 + Math.cos(t * 2) * 0.035
    }
    if (hasMerged && mergedStarRef.current) {
      mergedStarRef.current.rotation.y += 0.012
      mergedStarRef.current.rotation.z = Math.sin(t * 1.5) * 0.05
      mergedStarRef.current.scale.setScalar(1.0 + Math.sin(t * 2.8) * 0.09)
    }
  })

  const handleBeginMeeting = () => {
    if (isMerging || hasMerged) return
    setIsMerging(true)

    // 1. Deliberate drift across the ancient stone terrace
    gsap.to(lightARef.current.position, {
      x: 0,
      z: 0.05,
      y: 0.42,
      duration: 2.6,
      ease: 'power2.inOut',
    })

    gsap.to(lightBRef.current.position, {
      x: 0,
      z: 0.05,
      y: 0.42,
      duration: 2.6,
      ease: 'power2.inOut',
      onComplete: () => {
        // 2. CONTACT: Star Birth & Shockwave
        setHasMerged(true)
        setIsMerging(false)

        // Cosmic light burst
        if (burstLightRef.current) {
          gsap.fromTo(
            burstLightRef.current,
            { intensity: 0 },
            { intensity: 5.5, duration: 0.45, yoyo: true, repeat: 1, ease: 'power2.out' }
          )
        }

        // Expanding Stardust Shockwave Ring
        if (shockwaveRef.current) {
          gsap.fromTo(
            shockwaveRef.current.scale,
            { x: 0.1, y: 0.1, z: 0.1 },
            { x: 3.8, y: 3.8, z: 3.8, duration: 1.4, ease: 'power2.out' }
          )
          gsap.fromTo(
            shockwaveRef.current.material,
            { opacity: 0.9 },
            { opacity: 0, duration: 1.4, ease: 'power2.out' }
          )
        }

        // 3. FINAL PULL-OUT: Camera pulls back to reveal the vast night sky!
        gsap.to(camera.position, {
          x: 0,
          y: 3.2,
          z: 5.6,
          duration: 3.2,
          ease: 'power2.out',
        })

        if (onMerged) onMerged()
      },
    })
  }

  return (
    <group ref={containerRef} position={[0, 0, 0]}>
      <group ref={groupRef} position={[0, -0.15, 0]}>
        {/* Burst Point Light */}
        <pointLight ref={burstLightRef} color="#ffffff" intensity={0} distance={7} />

        {/* Cosmic Shockwave Ring */}
        <mesh ref={shockwaveRef} position={[0, 0.42, 0.05]} rotation={[-Math.PI / 2, 0, 0]} scale={[0, 0, 0]}>
          <ringGeometry args={[0.6, 0.8, 48]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0} side={THREE.DoubleSide} />
        </mesh>

        {/* ================= ANCIENT FANTASY WORLD SHARD ================= */}
        {/* Lower Shard Base */}
        <RoundedBox args={[3.4, 0.32, 2.2]} radius={0.14} smoothness={4} position={[0, -0.16, 0]}>
          <meshStandardMaterial color="#1c2436" roughness={0.72} metalness={0.06} />
        </RoundedBox>

        {/* Upper Mystic Terrace */}
        <RoundedBox args={[2.4, 0.1, 1.5]} radius={0.07} smoothness={3} position={[0, 0.05, 0]}>
          <meshStandardMaterial color="#1a2b38" roughness={0.8} />
        </RoundedBox>

        {/* Ancient Shrine Arch & Pedestal */}
        <group position={[0, 0.1, -0.45]}>
          <RoundedBox args={[1.6, 0.06, 0.5]} radius={0.02} position={[0, 0.03, 0.2]}>
            <meshStandardMaterial color="#2a364d" roughness={0.7} />
          </RoundedBox>
          <RoundedBox args={[0.2, 0.85, 0.2]} radius={0.03} position={[-0.72, 0.45, 0]}>
            <meshStandardMaterial color="#2d3a52" roughness={0.65} />
          </RoundedBox>
          <RoundedBox args={[0.2, 0.85, 0.2]} radius={0.03} position={[0.72, 0.45, 0]}>
            <meshStandardMaterial color="#2d3a52" roughness={0.65} />
          </RoundedBox>
          <RoundedBox args={[1.75, 0.16, 0.24]} radius={0.04} position={[0, 0.9, 0]}>
            <meshStandardMaterial color="#34435e" roughness={0.65} />
          </RoundedBox>
        </group>

        {/* Glowing Fantasy Crystals */}
        <group position={[-1.15, 0.25, 0.45]} rotation={[0.4, 0.3, 0.2]}>
          <mesh>
            <octahedronGeometry args={[0.13, 0]} />
            <meshStandardMaterial color="#a5b4fc" emissive="#a5b4fc" emissiveIntensity={0.8} />
          </mesh>
          <pointLight color="#a5b4fc" intensity={0.6} distance={1.2} />
        </group>

        <group position={[1.15, 0.22, 0.4]} rotation={[-0.3, 0.4, -0.2]}>
          <mesh>
            <octahedronGeometry args={[0.12, 0]} />
            <meshStandardMaterial color="#dfb76c" emissive="#dfb76c" emissiveIntensity={0.8} />
          </mesh>
          <pointLight color="#dfb76c" intensity={0.6} distance={1.2} />
        </group>

        {/* Shadow */}
        <mesh position={[0, -0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.0, 2.8]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.4} />
        </mesh>

        {/* ================= THE TWO LIGHTS ================= */}
        {!hasMerged && (
          <group onClick={handleBeginMeeting} className="cursor-pointer">
            <group ref={lightARef} position={[-0.9, 0.38, 0.1]}>
              <mesh>
                <sphereGeometry args={[0.075, 24, 24]} />
                <meshStandardMaterial color="#ffffff" emissive="#a5b4fc" emissiveIntensity={2.8} />
              </mesh>
              <pointLight color="#a5b4fc" intensity={1.8} distance={2.0} />
            </group>

            <group ref={lightBRef} position={[0.9, 0.38, 0.1]}>
              <mesh>
                <sphereGeometry args={[0.075, 24, 24]} />
                <meshStandardMaterial color="#ffffff" emissive="#dfb76c" emissiveIntensity={2.8} />
              </mesh>
              <pointLight color="#dfb76c" intensity={1.8} distance={2.0} />
            </group>
          </group>
        )}

        {/* ================= MERGED STAR ================= */}
        {hasMerged && (
          <group ref={mergedStarRef} position={[0, 0.48, 0.05]}>
            <mesh>
              <sphereGeometry args={[0.12, 32, 32]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3.8} />
            </mesh>
            <mesh rotation={[Math.PI / 4, 0, 0]}>
              <octahedronGeometry args={[0.26, 0]} />
              <meshStandardMaterial color="#dfb76c" emissive="#a5b4fc" emissiveIntensity={1.8} transparent opacity={0.75} />
            </mesh>
            <pointLight color="#fff4db" intensity={3.0} distance={4.0} />
          </group>
        )}
      </group>
    </group>
  )
}