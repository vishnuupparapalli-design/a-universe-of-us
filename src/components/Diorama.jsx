import React, { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Creates a soft circular particle texture dynamically (no image files needed)
 */
function createCircleTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.3, 'rgba(223, 195, 138, 0.8)')
  gradient.addColorStop(0.7, 'rgba(223, 195, 138, 0.2)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

/**
 * Ambient floating starlight particles (dreamy round motes)
 */
function SoftParticles({ count = 50 }) {
  const pointsRef = useRef()
  const circleTexture = useMemo(() => createCircleTexture(), [])

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 6
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4 + 0.5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6

      spd[i * 3 + 0] = (Math.random() - 0.5) * 0.0015
      spd[i * 3 + 1] = Math.random() * 0.002 + 0.0008
      spd[i * 3 + 2] = (Math.random() - 0.5) * 0.0015
    }
    return [pos, spd]
  }, [count])

  useFrame(() => {
    if (!pointsRef.current) return
    const posAttr = pointsRef.current.geometry.attributes.position
    const array = posAttr.array

    for (let i = 0; i < count; i++) {
      array[i * 3 + 1] += speeds[i * 3 + 1]
      array[i * 3 + 0] += speeds[i * 3 + 0]
      array[i * 3 + 2] += speeds[i * 3 + 2]

      if (array[i * 3 + 1] > 3.2) array[i * 3 + 1] = -1.5
      if (Math.abs(array[i * 3 + 0]) > 3) array[i * 3 + 0] *= -0.9
      if (Math.abs(array[i * 3 + 2]) > 3) array[i * 3 + 2] *= -0.9
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        map={circleTexture}
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

/**
 * Diorama Stage Wrapper
 */
export default function Diorama({ children }) {
  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        camera={{ position: [0, 2.8, 3.6], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        className="w-full h-full"
      >
        <ambientLight color="#182238" intensity={1.1} />

        <directionalLight
          position={[3.5, 5.5, 3.5]}
          intensity={1.6}
          color="#fff5e4"
        />

        <directionalLight
          position={[-3.5, 3, -3]}
          intensity={0.65}
          color="#8595c2"
        />

        <SoftParticles count={50} />

        <Suspense fallback={null}>
          {children}
        </Suspense>

        <OrbitControls
          target={[0, 0.05, 0]}
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 4.2}
          maxAzimuthAngle={Math.PI / 4.5}
          minAzimuthAngle={-Math.PI / 4.5}
          dampingFactor={0.06}
          rotateSpeed={0.65}
        />
      </Canvas>
    </div>
  )
}