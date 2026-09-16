import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Line } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import InteractiveObject from '../components/InteractiveObject'

const OBJECT_COORDINATES = {
  'the-beginning': [-1.2, 0.86, 0],
  'our-stories': [0, 0.86, 0],
  'movie-night-01': [1.2, 0.86, 0],
  'hard-days-01': [-1.4, 0.0, 0],
  'two-hundred-three-days': [-0.45, 0.0, 0],
  'distance-thread': [0.5, 0.0, 0],
  'someday-first-photo': [1.45, 0.0, 0],
}

export default function ShelfScene({ onSelectObject, onHoverObject, isDiscovered }) {
  const groupRef = useRef()
  const isPlungingRef = useRef(false)

  // Guaranteed clean reset when returning to shelf
  useEffect(() => {
    if (groupRef.current) {
      gsap.killTweensOf(groupRef.current.position)
      gsap.killTweensOf(groupRef.current.scale)
      groupRef.current.position.set(0, -0.12, 0)
      groupRef.current.scale.set(1, 1, 1)
      isPlungingRef.current = false
    }
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current && !isPlungingRef.current) {
      groupRef.current.position.y = -0.12 + Math.sin(t * 0.9) * 0.02
    }
  })

  // 1. PULL-IN SUCTION INTO THE BEGINNING
  const handleBeginningClick = () => {
    if (isPlungingRef.current || !groupRef.current) return
    isPlungingRef.current = true

    gsap.to(groupRef.current.position, {
      x: 1.6,
      y: -0.5,
      z: 3.2,
      duration: 0.38,
      ease: 'power2.in',
      onComplete: () => onSelectObject('the-beginning'),
    })

    gsap.to(groupRef.current.scale, {
      x: 2.4,
      y: 2.4,
      z: 2.4,
      duration: 0.38,
      ease: 'power2.in',
    })
  }

  // 2. PULL-IN SUCTION INTO OUR STORIES (THE TWO BOOKS!)
  const handleStoriesClick = () => {
    if (isPlungingRef.current || !groupRef.current) return
    isPlungingRef.current = true

    gsap.to(groupRef.current.position, {
      x: 0.0,   // Centered horizontally on the books
      y: -0.55, // Centers vertically
      z: 3.2,   // Zooms straight into the books!
      duration: 0.38,
      ease: 'power2.in',
      onComplete: () => onSelectObject('our-stories'),
    })

    gsap.to(groupRef.current.scale, {
      x: 2.4,
      y: 2.4,
      z: 2.4,
      duration: 0.38,
      ease: 'power2.in',
    })
  }

  // 3. PULL-IN SUCTION INTO MOVIE CORNER PROJECTOR
  const handleProjectorClick = () => {
    if (isPlungingRef.current || !groupRef.current) return
    isPlungingRef.current = true

    gsap.to(groupRef.current.position, {
      x: -1.35,
      y: -0.55,
      z: 3.2,
      duration: 0.38,
      ease: 'power2.in',
      onComplete: () => onSelectObject('movie-night-01'),
    })

    gsap.to(groupRef.current.scale, {
      x: 2.4,
      y: 2.4,
      z: 2.4,
      duration: 0.38,
      ease: 'power2.in',
    })
  }

  // 4. PULL-IN SUCTION INTO 206 DAYS MEDALLION
  const handleMedallionClick = () => {
    if (isPlungingRef.current || !groupRef.current) return
    isPlungingRef.current = true

    gsap.to(groupRef.current.position, {
      x: 0.75,
      y: 0.25,
      z: 3.2,
      duration: 0.38,
      ease: 'power2.in',
      onComplete: () => onSelectObject('two-hundred-three-days'),
    })

    gsap.to(groupRef.current.scale, {
      x: 2.4,
      y: 2.4,
      z: 2.4,
      duration: 0.38,
      ease: 'power2.in',
    })
  }

  const threadLines = useMemo(() => {
    const ids = Object.keys(OBJECT_COORDINATES).filter((id) => isDiscovered(id))
    if (ids.length < 2) return []

    const pairs = []
    for (let i = 0; i < ids.length - 1; i++) {
      pairs.push([OBJECT_COORDINATES[ids[i]], OBJECT_COORDINATES[ids[i + 1]]])
    }
    return pairs
  }, [isDiscovered])

  const isBeginningLit = isDiscovered('the-beginning')
  const isStoriesLit = isDiscovered('our-stories')
  const isMoviesLit = isDiscovered('movie-night-01')
  const isHardDaysLit = isDiscovered('hard-days-01')
  const is203Lit = isDiscovered('two-hundred-three-days')
  const isDistanceLit = isDiscovered('distance-thread')
  const isSomedayLit = isDiscovered('someday-first-photo')

  const handleHover = (id, isHovered) => {
    if (onHoverObject) onHoverObject(isHovered ? id : null)
  }

  return (
    <group ref={groupRef} position={[0, -0.12, 0]} scale={[1, 1, 1]}>
      {/* Floating Shelf Planks */}
      <RoundedBox args={[3.8, 0.08, 1.2]} radius={0.03} smoothness={3} position={[0, 0.65, 0]}>
        <meshStandardMaterial color="#232a3d" roughness={0.75} metalness={0.05} />
      </RoundedBox>

      <RoundedBox args={[4.2, 0.09, 1.4]} radius={0.03} smoothness={3} position={[0, -0.2, 0]}>
        <meshStandardMaterial color="#202638" roughness={0.75} metalness={0.05} />
      </RoundedBox>

      <mesh position={[0, -0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.6, 2.0]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>

      {/* 3D Connecting Threads */}
      {threadLines.map((pair, index) => (
        <Line
          key={index}
          points={pair}
          color="#dfb76c"
          lineWidth={1.2}
          transparent
          opacity={0.45}
        />
      ))}

      {/* 1. The Beginning */}
      <group position={[-1.2, 0.74, 0]}>
        <InteractiveObject
          onOpen={handleBeginningClick}
          onHover={(hovered) => handleHover('the-beginning', hovered)}
          isDiscovered={isBeginningLit}
          showAura={true}
          auraColor="#a5b4fc"
          auraScale={0.85}
        >
          <RoundedBox args={[0.42, 0.08, 0.42]} radius={0.02} position={[0, 0, 0]}>
            <meshStandardMaterial color={isBeginningLit ? '#384466' : '#22293d'} roughness={0.6} />
          </RoundedBox>
          <mesh position={[-0.08, 0.12, 0]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshStandardMaterial color="#a5b4fc" emissive="#a5b4fc" emissiveIntensity={isBeginningLit ? 1.6 : 0.5} />
          </mesh>
          <mesh position={[0.08, 0.12, 0]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshStandardMaterial color="#dfb76c" emissive="#dfb76c" emissiveIntensity={isBeginningLit ? 1.6 : 0.5} />
          </mesh>
        </InteractiveObject>
      </group>

      {/* 2. Our Stories (WITH PULL-IN ZOOM!) */}
      <group position={[0, 0.74, 0]}>
        <InteractiveObject
          onOpen={handleStoriesClick}
          onHover={(hovered) => handleHover('our-stories', hovered)}
          isDiscovered={isStoriesLit}
          showAura={true}
          auraColor="#d97706"
          auraScale={0.95}
        >
          <RoundedBox args={[0.34, 0.44, 0.08]} radius={0.015} position={[-0.08, 0.18, 0]} rotation={[0, 0.1, -0.05]}>
            <meshStandardMaterial color={isStoriesLit ? '#d97706' : '#784d28'} roughness={0.7} />
          </RoundedBox>
          <RoundedBox args={[0.34, 0.42, 0.08]} radius={0.015} position={[0.08, 0.17, 0.02]} rotation={[0, -0.1, 0.05]}>
            <meshStandardMaterial color={isStoriesLit ? '#4f6d9e' : '#2d3c52'} roughness={0.7} />
          </RoundedBox>
        </InteractiveObject>
      </group>

      {/* 3. Movie Corner */}
      <group position={[1.2, 0.74, 0]}>
        <InteractiveObject
          onOpen={handleProjectorClick}
          onHover={(hovered) => handleHover('movie-night-01', hovered)}
          isDiscovered={isMoviesLit}
          showAura={true}
          auraColor="#fcd34d"
          auraScale={1.1}
        >
          <RoundedBox args={[0.42, 0.28, 0.35]} radius={0.03} position={[0, 0.14, 0]}>
            <meshStandardMaterial color={isMoviesLit ? '#3b455e' : '#262d3f'} roughness={0.6} />
          </RoundedBox>
          <mesh position={[0, 0.14, 0.19]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.06, 24]} />
            <meshStandardMaterial color="#dfb76c" roughness={0.3} emissive="#fcd34d" emissiveIntensity={1.3} />
          </mesh>
        </InteractiveObject>
      </group>

      {/* 4. The Hard Days */}
      <group position={[-1.4, -0.11, 0]}>
        <InteractiveObject
          onOpen={() => onSelectObject('hard-days-01')}
          onHover={(hovered) => handleHover('hard-days-01', hovered)}
          isDiscovered={isHardDaysLit}
          showAura={true}
          auraColor="#ffd68a"
          auraScale={0.9}
        >
          <pointLight color="#ffd68a" intensity={isHardDaysLit ? 1.2 : 0.6} distance={1.4} decay={2} position={[0, 0.22, 0.1]} />
          <mesh position={[0, 0.015, 0]}>
            <cylinderGeometry args={[0.22, 0.24, 0.02, 32]} />
            <meshStandardMaterial color="#283145" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.07, 0]} scale={[1.15, 0.7, 0.95]}>
            <sphereGeometry args={[0.16, 28, 20]} />
            <meshStandardMaterial color={isHardDaysLit ? '#455069' : '#333c4f'} roughness={0.65} metalness={0.05} />
          </mesh>
          <mesh position={[0, 0.185, 0]}>
            <sphereGeometry args={[0.042, 16, 16]} />
            <meshStandardMaterial color="#fff0d0" emissive="#ffbe42" emissiveIntensity={isHardDaysLit ? 2.2 : 1.0} />
          </mesh>
          <mesh position={[0, 0.185, 0]}>
            <ringGeometry args={[0.05, 0.08, 24]} />
            <meshBasicMaterial color="#ffbe42" transparent opacity={isHardDaysLit ? 0.35 : 0.15} />
          </mesh>
        </InteractiveObject>
      </group>

      {/* 5. 206 Days Medallion */}
      <group position={[-0.45, -0.11, 0]}>
        <InteractiveObject
          onOpen={handleMedallionClick}
          onHover={(hovered) => handleHover('two-hundred-three-days', hovered)}
          isDiscovered={is203Lit}
          showAura={true}
          auraColor="#dfb76c"
          auraScale={1.1}
        >
          <mesh position={[0, 0.14, 0]} rotation={[0.15, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.19, 0.04, 32]} />
            <meshStandardMaterial color="#dfb76c" roughness={0.4} metalness={0.25} emissive="#dfb76c" emissiveIntensity={is203Lit ? 0.8 : 0.2} />
          </mesh>
          <mesh position={[0, 0.14, 0.025]} rotation={[0.15, 0, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.01, 24]} />
            <meshStandardMaterial color="#fef08a" roughness={0.5} />
          </mesh>
        </InteractiveObject>
      </group>

      {/* 6. Across the Distance */}
      <group position={[0.5, -0.11, 0]}>
        <InteractiveObject
          onOpen={() => onSelectObject('distance-thread')}
          onHover={(hovered) => handleHover('distance-thread', hovered)}
          isDiscovered={isDistanceLit}
          showAura={true}
          auraColor="#38bdf8"
          auraScale={1.25}
        >
          <mesh position={[-0.22, 0.12, 0]}>
            <cylinderGeometry args={[0.025, 0.035, 0.24, 16]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={isDistanceLit ? 1.0 : 0.3} />
          </mesh>
          <mesh position={[0.22, 0.12, 0]}>
            <cylinderGeometry args={[0.025, 0.035, 0.24, 16]} />
            <meshStandardMaterial color="#dfb76c" emissive="#dfb76c" emissiveIntensity={isDistanceLit ? 1.0 : 0.3} />
          </mesh>
          <mesh position={[0, 0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.009, 0.009, 0.44, 12]} />
            <meshStandardMaterial color="#ffffff" emissive="#38bdf8" emissiveIntensity={isDistanceLit ? 1.5 : 0.45} />
          </mesh>
        </InteractiveObject>
      </group>

      {/* 7. Someday */}
      <group position={[1.45, -0.11, 0]}>
        <InteractiveObject
          onOpen={() => onSelectObject('someday-first-photo')}
          onHover={(hovered) => handleHover('someday-first-photo', hovered)}
          isDiscovered={isSomedayLit}
          showAura={true}
          auraColor="#fda4af"
          auraScale={1.05}
        >
          <RoundedBox args={[0.38, 0.46, 0.02]} radius={0.015} position={[0, 0.2, 0]} rotation={[-0.15, -0.15, 0]}>
            <meshStandardMaterial color={isSomedayLit ? '#f5eedd' : '#b0a99c'} roughness={0.8} />
          </RoundedBox>
          <mesh position={[0, 0.22, 0.012]} rotation={[-0.15, -0.15, 0]}>
            <planeGeometry args={[0.3, 0.3]} />
            <meshStandardMaterial color={isSomedayLit ? '#222d42' : '#141a26'} roughness={0.9} />
          </mesh>
        </InteractiveObject>
      </group>
    </group>
  )
}