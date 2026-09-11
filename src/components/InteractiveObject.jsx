import React, { useRef, useState, useMemo, useEffect } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

function createAuraTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.35, 'rgba(255, 255, 255, 0.85)')
  gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.25)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 128)

  return new THREE.CanvasTexture(canvas)
}

/**
 * InteractiveObject — Master Plan Section W & AD
 * Clean, stable vertical levitation with zero tipping over.
 */
export default function InteractiveObject({
  children,
  onOpen,
  onHover,
  hoverLift = 0.035, // Gentle, elegant vertical lift (no falling)
  disabled = false,
  isOpen = false,
  isDiscovered = false,
  showAura = false,
  auraColor = '#dfb76c',
  auraScale = 1.0,
}) {
  const groupRef = useRef()
  const auraMeshRef = useRef()
  const auraLightRef = useRef()
  const [hovered, setHovered] = useState(false)

  const auraTexture = useMemo(() => (showAura ? createAuraTexture() : null), [showAura])

  const restingOpacity = isDiscovered ? 0.28 : 0.06
  const restingIntensity = isDiscovered ? 0.5 : 0.12

  useEffect(() => {
    if (!showAura || !auraMeshRef.current || !auraLightRef.current) return

    if (hovered) {
      gsap.to(auraMeshRef.current.scale, {
        x: auraScale * 1.45,
        y: auraScale * 1.45,
        duration: 0.35,
        ease: 'power2.out',
      })
      gsap.to(auraMeshRef.current.material, {
        opacity: 0.85,
        duration: 0.3,
        ease: 'power2.out',
      })
      gsap.to(auraLightRef.current, {
        intensity: 1.8,
        duration: 0.3,
      })
    } else {
      gsap.to(auraMeshRef.current.scale, {
        x: auraScale,
        y: auraScale,
        duration: 0.45,
        ease: 'power2.out',
      })
      gsap.to(auraMeshRef.current.material, {
        opacity: restingOpacity,
        duration: 0.4,
        ease: 'power2.out',
      })
      gsap.to(auraLightRef.current, {
        intensity: restingIntensity,
        duration: 0.4,
      })
    }
  }, [hovered, isDiscovered, showAura, auraScale, restingOpacity, restingIntensity])

  const handlePointerOver = (e) => {
    e.stopPropagation()
    if (disabled || isOpen) return
    setHovered(true)
    document.body.style.cursor = 'pointer'
    if (onHover) onHover(true)

    // Lifts straight up smoothly (NO rotation tilt so it never looks like it's falling)
    if (groupRef.current) {
      gsap.to(groupRef.current.position, {
        y: hoverLift,
        duration: 0.35,
        ease: 'power2.out',
      })
    }
  }

  const handlePointerOut = (e) => {
    e.stopPropagation()
    setHovered(false)
    document.body.style.cursor = 'default'
    if (onHover) onHover(false)

    // Glides gently back down to rest firmly in place
    if (groupRef.current && !isOpen) {
      gsap.to(groupRef.current.position, {
        y: 0,
        duration: 0.45,
        ease: 'power2.out',
      })
    }
  }

  const handlePointerDown = (e) => {
    e.stopPropagation()
    if (disabled || isOpen) return

    // Gentle tactile click give
    if (groupRef.current) {
      gsap.to(groupRef.current.position, {
        y: hoverLift * 0.4,
        duration: 0.12,
        ease: 'power1.out',
      })
    }
  }

  const handleClick = (e) => {
    e.stopPropagation()
    if (disabled) return
    if (onOpen) onOpen()
  }

  return (
    <group
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      {/* 3D Aura (shelf only) */}
      {showAura && (
        <>
          <mesh
            ref={auraMeshRef}
            position={[0, 0.15, -0.12]}
            scale={[auraScale, auraScale, auraScale]}
          >
            <planeGeometry args={[0.9, 0.9]} />
            <meshBasicMaterial
              map={auraTexture}
              color={auraColor}
              transparent
              opacity={restingOpacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          <pointLight
            ref={auraLightRef}
            color={auraColor}
            intensity={restingIntensity}
            distance={1.6}
            decay={2}
            position={[0, 0.15, 0.05]}
          />
        </>
      )}

      {/* Keepsake geometry */}
      <group ref={groupRef}>
        {children}
      </group>
    </group>
  )
}