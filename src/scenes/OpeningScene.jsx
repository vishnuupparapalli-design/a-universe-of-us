import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import InteractiveObject from '../components/InteractiveObject'

/**
 * Handcrafted Clay Envelope Flap (Hinged at the top fold)
 */
function EnvelopeFlap({ flapRef }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-0.85, 0.55)
    s.lineTo(0.85, 0.55)
    s.lineTo(0, -0.08)
    s.closePath()
    return s
  }, [])

  return (
    // Pivot group positioned at the top hinge of the envelope
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
        <meshStandardMaterial
          color="#e8dfd0"
          roughness={0.65}
          metalness={0.02}
        />
      </mesh>
    </group>
  )
}

/**
 * Opening Scene Diorama with Physical Open Sequence
 */
export default function OpeningScene({ isOpen, onOpen }) {
  const groupRef = useRef()
  const envelopeRef = useRef()
  const flapRef = useRef()
  const letterSheetRef = useRef()
  const sealRef = useRef()
  const lightRef = useRef()

  // Animate flap opening and letter paper sliding out
  useEffect(() => {
    if (!flapRef.current || !letterSheetRef.current || !sealRef.current) return

    if (isOpen) {
      // 1. Seal pops slightly and fades
      gsap.to(sealRef.current.position, {
        y: 0.15,
        duration: 0.35,
        ease: 'power2.out',
      })

      // 2. Flap folds back 160 degrees like a real envelope
      gsap.to(flapRef.current.rotation, {
        x: Math.PI * 0.85,
        duration: 0.65,
        ease: 'back.out(1.2)',
        delay: 0.1,
      })

      // 3. Glowing letter sheet slides smoothly upward
      gsap.to(letterSheetRef.current.position, {
        y: 0.45,
        z: 0.05,
        duration: 0.7,
        ease: 'power2.out',
        delay: 0.25,
      })
    } else {
      // Letter slides back into envelope
      gsap.to(letterSheetRef.current.position, {
        y: 0.02,
        z: 0,
        duration: 0.45,
        ease: 'power2.in',
      })

      // Flap folds closed
      gsap.to(flapRef.current.rotation, {
        x: 0,
        duration: 0.55,
        ease: 'power2.out',
        delay: 0.15,
      })

      // Seal resets
      gsap.to(sealRef.current.position, {
        y: 0.055,
        duration: 0.35,
        ease: 'power2.out',
        delay: 0.3,
      })
    }
  }, [isOpen])

  // Gentle breathing float animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.position.y = -0.1 + Math.sin(t * 1.1) * 0.025
    }
    if (envelopeRef.current && !isOpen) {
      envelopeRef.current.position.y = 0.05 + Math.sin(t * 1.5) * 0.008
    }
    if (lightRef.current) {
      lightRef.current.intensity = (isOpen ? 2.2 : 1.6) + Math.sin(t * 2.2) * 0.15
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      
      {/* 1. Base Floating Desk Slab */}
      <RoundedBox
        args={[3.4, 0.22, 2.4]}
        radius={0.14}
        smoothness={4}
        position={[0, -0.11, 0]}
      >
        <meshStandardMaterial
          color="#242c3f"
          roughness={0.7}
          metalness={0.06}
        />
      </RoundedBox>

      {/* Desk Shadow */}
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 1.5]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>

      {/* Space Drop Shadow */}
      <mesh position={[0, -0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.8, 2.8]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.45} />
      </mesh>

      {/* 2. The Envelope Group wrapped with InteractiveObject */}
      <group
        ref={envelopeRef}
        position={[0, 0.05, 0]}
        rotation={[0, 0.12, 0]}
      >
        <InteractiveObject onOpen={onOpen} isOpen={isOpen}>
          
          {/* Warm Candlelight Glow */}
          <pointLight
            ref={lightRef}
            color="#ffd699"
            intensity={1.6}
            distance={3.8}
            decay={2}
            position={[0, 0.8, 0.3]}
          />

          {/* Letter Sheet that slides out */}
          <group ref={letterSheetRef} position={[0, 0.02, 0]}>
            <RoundedBox args={[1.5, 0.015, 0.95]} radius={0.02} smoothness={2}>
              <meshStandardMaterial
                color="#ffffff"
                roughness={0.5}
                emissive="#fffae8"
                emissiveIntensity={0.2}
              />
            </RoundedBox>
          </group>

          {/* Envelope Main Body */}
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

          {/* Hinged Opening Flap */}
          <EnvelopeFlap flapRef={flapRef} />

          {/* Wax Seal Button */}
          <group ref={sealRef} position={[0, 0.055, 0.14]}>
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
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.01, 24]} />
              <meshStandardMaterial
                color="#c79a45"
                roughness={0.5}
                metalness={0.15}
              />
            </mesh>
          </group>

          {/* Keepsake Stamp */}
          <group position={[1.1, -0.03, -0.6]} rotation={[0, -0.4, 0]}>
            <RoundedBox args={[0.36, 0.02, 0.46]} radius={0.015} smoothness={2}>
              <meshStandardMaterial color="#323b52" roughness={0.75} />
            </RoundedBox>
          </group>

        </InteractiveObject>
      </group>
    </group>
  )
}