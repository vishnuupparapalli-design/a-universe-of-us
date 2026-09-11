import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'

/**
 * InteractiveObject — Master Plan Section W & AD
 * 
 * Provides consistent physical tactile behavior:
 * - Hover: gentle lift + tilt + cursor pointer
 * - Active/Press: physical downward "give"
 * - Click: triggers onOpen callback
 */
export default function InteractiveObject({
  children,
  onOpen,
  hoverLift = 0.08,
  hoverTilt = 0.05,
  disabled = false,
  isOpen = false,
}) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)

  const handlePointerOver = (e) => {
    e.stopPropagation()
    if (disabled || isOpen) return
    setHovered(true)
    document.body.style.cursor = 'pointer'

    if (groupRef.current) {
      gsap.to(groupRef.current.position, {
        y: hoverLift,
        duration: 0.35,
        ease: 'power2.out',
      })
      gsap.to(groupRef.current.rotation, {
        x: -hoverTilt,
        z: hoverTilt * 0.5,
        duration: 0.35,
        ease: 'power2.out',
      })
    }
  }

  const handlePointerOut = (e) => {
    e.stopPropagation()
    setHovered(false)
    document.body.style.cursor = 'default'

    if (groupRef.current && !isOpen) {
      gsap.to(groupRef.current.position, {
        y: 0,
        duration: 0.45,
        ease: 'power2.out',
      })
      gsap.to(groupRef.current.rotation, {
        x: 0,
        z: 0,
        duration: 0.45,
        ease: 'power2.out',
      })
    }
  }

  const handlePointerDown = (e) => {
    e.stopPropagation()
    if (disabled || isOpen) return

    // Physical compression "give" on press
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
      ref={groupRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      {children}
    </group>
  )
}