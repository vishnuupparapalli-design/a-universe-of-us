import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import InteractiveObject from '../components/InteractiveObject'

function FinalEnvelopeFlap({ flapRef }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-0.85, 0.55)
    s.lineTo(0.85, 0.55)
    s.lineTo(0, -0.08)
    s.closePath()
    return s
  }, [])

  return (
    <group ref={flapRef} position={[0, 0.046, -0.45]}>
      <mesh position={[0, 0, 0.45]} rotation={[-Math.PI / 2, 0, 0]}>
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
        <meshStandardMaterial color="#f0e9dc" roughness={0.65} metalness={0.02} />
      </mesh>
    </group>
  )
}

/**
 * FinalLetterScene — The peaceful closing scene
 */
export default function FinalLetterScene({ isOpen, onOpen }) {
  const containerRef = useRef()
  const groupRef = useRef()
  const flapRef = useRef()
  const letterSheetRef = useRef()
  const sealRef = useRef()
  const lightRef = useRef()

  // Arrival Fly-In
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.position,
        { z: -3.5, y: -0.3 },
        { z: 0, y: 0.05, duration: 1.4, ease: 'power2.out', delay: 0.1 }
      )
    }
  }, [])

  // Envelope Open Animation
  useEffect(() => {
    if (!flapRef.current || !letterSheetRef.current || !sealRef.current) return

    if (isOpen) {
      gsap.to(sealRef.current.position, { y: 0.15, duration: 0.35, ease: 'power2.out' })
      gsap.to(flapRef.current.rotation, { x: Math.PI * 0.85, duration: 0.65, ease: 'back.out(1.2)', delay: 0.1 })
      gsap.to(letterSheetRef.current.position, { y: 0.45, z: 0.05, duration: 0.7, ease: 'power2.out', delay: 0.25 })
    } else {
      gsap.to(letterSheetRef.current.position, { y: -0.04, z: 0, duration: 0.45, ease: 'power2.in' })
      gsap.to(flapRef.current.rotation, { x: 0, duration: 0.55, ease: 'power2.out', delay: 0.15 })
      gsap.to(sealRef.current.position, { y: 0.055, duration: 0.35, ease: 'power2.out', delay: 0.3 })
    }
  }, [isOpen])

  // Gentle float
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.position.y = -0.1 + Math.sin(t * 1.1) * 0.025
    }
    if (lightRef.current) {
      lightRef.current.intensity = (isOpen ? 2.4 : 1.8) + Math.sin(t * 2.2) * 0.15
    }
  })

  return (
    <group ref={containerRef} position={[0, 0.05, 0]}>
      <group ref={groupRef} position={[0, -0.1, 0]}>
        
        {/* Soft Golden Halo Light */}
        <ambientLight color="#120e0a" intensity={0.9} />
        <pointLight ref={lightRef} color="#fef08a" intensity={1.8} distance={4.5} position={[0, 1.2, 0.5]} />

        {/* Minimal Dark Display Slab */}
        <RoundedBox args={[3.2, 0.2, 2.2]} radius={0.12} smoothness={4} position={[0, -0.1, 0]}>
          <meshStandardMaterial color="#1a1410" roughness={0.75} metalness={0.05} />
        </RoundedBox>

        {/* Shadow */}
        <mesh position={[0, -0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.6, 2.6]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.4} />
        </mesh>

        {/* The Golden Final Envelope */}
        <group position={[0, 0.05, 0]}>
          <InteractiveObject onOpen={onOpen} isOpen={isOpen} showAura={false}>
            
            {/* Letter Sheet */}
            <group ref={letterSheetRef} position={[0, -0.04, 0]}>
              <RoundedBox args={[1.5, 0.015, 0.95]} radius={0.02} smoothness={2}>
                <meshStandardMaterial color="#ffffff" roughness={0.5} emissive="#fffdf7" emissiveIntensity={0.25} />
              </RoundedBox>
            </group>

            {/* Envelope Main Body */}
            <RoundedBox args={[1.8, 0.08, 1.2]} radius={0.035} smoothness={4} position={[0, 0, 0]}>
              <meshStandardMaterial color="#f7f2e8" roughness={0.6} metalness={0.02} />
            </RoundedBox>

            {/* Flap */}
            <FinalEnvelopeFlap flapRef={flapRef} />

            {/* Pure Gold Wax Seal (#dfb76c) */}
            <group ref={sealRef} position={[0, 0.055, 0.14]}>
              <mesh>
                <cylinderGeometry args={[0.13, 0.14, 0.035, 32]} />
                <meshStandardMaterial color="#dfb76c" roughness={0.35} metalness={0.35} emissive="#dfb76c" emissiveIntensity={0.35} />
              </mesh>
              <mesh position={[0, 0.02, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.01, 24]} />
                <meshStandardMaterial color="#c79a45" roughness={0.45} metalness={0.2} />
              </mesh>
            </group>

          </InteractiveObject>
        </group>

      </group>
    </group>
  )
}