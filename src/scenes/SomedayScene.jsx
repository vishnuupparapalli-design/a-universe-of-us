import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Html } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

export default function SomedayScene({
  onSelectArtifact,
  hasPhotoFirst = false,
  hasPhotoTrip = false,
  hasPhotoGift = false,
}) {
  const containerRef = useRef()
  const groupRef = useRef()

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

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.position.y = -0.15 + Math.sin(t * 0.8) * 0.02
    }
  })

  return (
    <group ref={containerRef} position={[0, 0.05, 0]}>
      <group ref={groupRef} position={[0, -0.15, 0]}>
        
        {/* Dawn Peach & Rose Gallery Lighting */}
        <ambientLight color="#1a1215" intensity={0.9} />
        <pointLight color="#fda4af" intensity={1.8} distance={5} position={[0, 2.8, 1.5]} />
        <pointLight color="#fef08a" intensity={1.2} distance={4} position={[1.5, 1, 0]} />

        {/* 1. Floor */}
        <RoundedBox args={[3.8, 0.24, 2.6]} radius={0.12} smoothness={4} position={[0, -0.12, 0]}>
          <meshStandardMaterial color="#1a1217" roughness={0.8} />
        </RoundedBox>

        <RoundedBox args={[3.0, 0.02, 1.9]} radius={0.06} smoothness={3} position={[0, 0.01, 0]}>
          <meshStandardMaterial color="#26171d" roughness={0.85} />
        </RoundedBox>

        <mesh position={[0, -0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.2, 3.0]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.4} />
        </mesh>

        {/* ================= ARTIFACT 1: OUR FIRST PHOTO POLAROID ================= */}
        <group position={[-1.15, 0.08, 0.2]} rotation={[0, 0.25, 0]}>
          <RoundedBox args={[0.5, 0.04, 0.45]} radius={0.015} position={[0, 0.02, 0]}>
            <meshStandardMaterial color="#3b252d" roughness={0.7} />
          </RoundedBox>

          <group
            onClick={(e) => {
              e.stopPropagation()
              onSelectArtifact('first-photo')
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={(e) => {
              e.stopPropagation()
              document.body.style.cursor = 'default'
            }}
            position={[0, 0.38, 0]}
            rotation={[-0.15, 0, 0]}
          >
            <RoundedBox args={[0.52, 0.64, 0.025]} radius={0.015}>
              <meshStandardMaterial color="#f5eee4" roughness={0.7} />
            </RoundedBox>

            <mesh position={[0, 0.05, 0.015]}>
              <planeGeometry args={[0.44, 0.44]} />
              <meshStandardMaterial
                color={hasPhotoFirst ? '#ffffff' : '#141b29'}
                roughness={hasPhotoFirst ? 0.4 : 0.9}
                emissive={hasPhotoFirst ? '#ffd68a' : '#fda4af'}
                emissiveIntensity={hasPhotoFirst ? 0.35 : 0.08}
              />
            </mesh>
          </group>

          <Html position={[0, 0.85, 0]} center distanceFactor={4.5} className="select-none z-20">
            <button
              onClick={() => onSelectArtifact('first-photo')}
              className="cursor-pointer px-3 py-1 rounded-full bg-rose-500/25 hover:bg-rose-400 text-rose-200 hover:text-black border border-rose-300/60 text-[10px] font-sans font-semibold whitespace-nowrap shadow-clay-card transition-all transform hover:scale-110 active:scale-95"
            >
              ✦ Our First Photo
            </button>
          </Html>
        </group>

        {/* ================= ARTIFACT 2: BLANK TRIP POSTCARD ================= */}
        <group position={[0.0, 0.08, 0.1]}>
          <RoundedBox args={[0.55, 0.04, 0.45]} radius={0.015} position={[0, 0.02, 0]}>
            <meshStandardMaterial color="#3b252d" roughness={0.7} />
          </RoundedBox>

          <group
            onClick={(e) => {
              e.stopPropagation()
              onSelectArtifact('first-trip')
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={(e) => {
              e.stopPropagation()
              document.body.style.cursor = 'default'
            }}
            position={[0, 0.28, 0]}
            rotation={[-0.2, 0, 0]}
          >
            <RoundedBox args={[0.62, 0.42, 0.015]} radius={0.01}>
              <meshStandardMaterial
                color={hasPhotoTrip ? '#fffdfa' : '#f6eedc'}
                emissive={hasPhotoTrip ? '#ffd68a' : '#000000'}
                emissiveIntensity={hasPhotoTrip ? 0.25 : 0}
                roughness={0.75}
              />
            </RoundedBox>
            <mesh position={[0.22, 0.12, 0.01]}>
              <planeGeometry args={[0.09, 0.11]} />
              <meshStandardMaterial color="#fda4af" />
            </mesh>
          </group>

          <Html position={[0, 0.65, 0]} center distanceFactor={4.5} className="select-none z-20">
            <button
              onClick={() => onSelectArtifact('first-trip')}
              className="cursor-pointer px-3 py-1 rounded-full bg-amber-500/25 hover:bg-amber-400 text-amber-200 hover:text-black border border-amber-300/60 text-[10px] font-sans font-semibold whitespace-nowrap shadow-clay-card transition-all transform hover:scale-110 active:scale-95"
            >
              ✦ Our First Trip
            </button>
          </Html>
        </group>

        {/* ================= ARTIFACT 3: SEALED GIFT BOX ================= */}
        <group position={[1.15, 0.08, 0.2]} rotation={[0, -0.25, 0]}>
          <RoundedBox args={[0.5, 0.04, 0.45]} radius={0.015} position={[0, 0.02, 0]}>
            <meshStandardMaterial color="#3b252d" roughness={0.7} />
          </RoundedBox>

          <group
            onClick={(e) => {
              e.stopPropagation()
              onSelectArtifact('sealed-gift')
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={(e) => {
              e.stopPropagation()
              document.body.style.cursor = 'default'
            }}
            position={[0, 0.22, 0]}
          >
            <RoundedBox args={[0.38, 0.32, 0.38]} radius={0.03}>
              <meshStandardMaterial
                color="#2d1c25"
                roughness={0.65}
                emissive={hasPhotoGift ? '#dfb76c' : '#000000'}
                emissiveIntensity={hasPhotoGift ? 0.3 : 0}
              />
            </RoundedBox>
            <mesh position={[0, 0.01, 0]}>
              <boxGeometry args={[0.06, 0.34, 0.39]} />
              <meshStandardMaterial color="#dfb76c" metalness={0.3} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.01, 0]}>
              <boxGeometry args={[0.39, 0.34, 0.06]} />
              <meshStandardMaterial color="#dfb76c" metalness={0.3} roughness={0.4} />
            </mesh>
          </group>

          <Html position={[0, 0.55, 0]} center distanceFactor={4.5} className="select-none z-20">
            <button
              onClick={() => onSelectArtifact('sealed-gift')}
              className="cursor-pointer px-3 py-1 rounded-full bg-yellow-500/25 hover:bg-yellow-400 text-yellow-200 hover:text-black border border-yellow-300/60 text-[10px] font-sans font-semibold whitespace-nowrap shadow-clay-card transition-all transform hover:scale-110 active:scale-95"
            >
              ✦ First In-Person Gift
            </button>
          </Html>
        </group>

      </group>
    </group>
  )
}