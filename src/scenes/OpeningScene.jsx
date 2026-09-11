import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Handcrafted Clay Envelope Flap
 * Flat triangular flap that sits right on top of the envelope face.
 */
function EnvelopeFlap() {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    // Triangle pointing down toward the gold wax seal
    s.moveTo(-0.85, 0.55)
    s.lineTo(0.85, 0.55)
    s.lineTo(0, -0.08)
    s.closePath()
    return s
  }, [])

  return (
    <mesh position={[0, 0.046, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <extrudeGeometry
        args={[
          shape,
          {
            depth: 0.014,
            bevelEnabled: true,
            bevelSegments: 3,
            steps: 1,
            bevelSize: 0.012,
            bevelThickness: 0.01,
          },
        ]}
      />
      <meshStandardMaterial
        color="#e8dfd0"
        roughness={0.65}
        metalness={0.02}
      />
    </mesh>
  )
}

/**
 * Opening Scene Diorama
 * Cleanly elevated claymorphic desk, warm ivory envelope, and gold seal.
 */
export default function OpeningScene() {
  const groupRef = useRef()
  const envelopeRef = useRef()
  const lightRef = useRef()

  // Gentle breathing float animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.position.y = -0.1 + Math.sin(t * 1.1) * 0.03
    }
    if (envelopeRef.current) {
      // Very soft organic hover
      envelopeRef.current.position.y = 0.05 + Math.sin(t * 1.5) * 0.008
    }
    if (lightRef.current) {
      // Warm candle-glow flicker
      lightRef.current.intensity = 1.6 + Math.sin(t * 2.2) * 0.2
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      
      {/* 1. Base Floating Desk Slab (Midnight Navy Ceramic) */}
      <RoundedBox
        args={[3.4, 0.22, 2.4]}
        radius={0.14}
        smoothness={4}
        position={[0, -0.11, 0]} // Top of desk sits exactly at y = 0.0
      >
        <meshStandardMaterial
          color="#242c3f"
          roughness={0.7}
          metalness={0.06}
        />
      </RoundedBox>

      {/* 2. Soft Contact Shadow directly on the desk */}
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 1.5]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* 3. Drop Shadow below the floating desk in space */}
      <mesh position={[0, -0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.8, 2.8]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* 4. The Hero Envelope (Rests cleanly ON TOP of the desk) */}
      <group
        ref={envelopeRef}
        position={[0, 0.05, 0]} // Elevated above the desk surface
        rotation={[0, 0.12, 0]} // Gentle horizontal angle (no dipping into the desk)
      >
        {/* Soft, warm candlelight glow directly above the letter */}
        <pointLight
          ref={lightRef}
          color="#ffd699"
          intensity={1.6}
          distance={3.8}
          decay={2}
          position={[0, 0.8, 0.3]}
        />

        {/* Envelope Main Body (Warm Creamy Ivory Parchment) */}
        <RoundedBox
          args={[1.8, 0.08, 1.2]}
          radius={0.035}
          smoothness={4}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial
            color="#f5eedd"
            roughness={0.62}
            metalness={0.02}
          />
        </RoundedBox>

        {/* Folded Triangular Flap */}
        <EnvelopeFlap />

        {/* Wax Seal Button (Reserved Muted Gold #dfb76c) */}
        <group position={[0, 0.055, 0.14]}>
          {/* Main Seal Disc */}
          <mesh>
            <cylinderGeometry args={[0.13, 0.14, 0.035, 32]} />
            <meshStandardMaterial
              color="#dfb76c"
              roughness={0.4}
              metalness={0.22}
              emissive="#dfb76c"
              emissiveIntensity={0.15}
            />
          </mesh>
          {/* Inner Seal Impression Ring */}
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.01, 24]} />
            <meshStandardMaterial
              color="#c79a45"
              roughness={0.5}
              metalness={0.15}
            />
          </mesh>
        </group>

        {/* Handcrafted Keepsake Stamp on the desk corner */}
        <group position={[1.1, -0.03, -0.6]} rotation={[0, -0.4, 0]}>
          <RoundedBox args={[0.36, 0.02, 0.46]} radius={0.015} smoothness={2}>
            <meshStandardMaterial color="#323b52" roughness={0.75} />
          </RoundedBox>
        </group>
      </group>
    </group>
  )
}