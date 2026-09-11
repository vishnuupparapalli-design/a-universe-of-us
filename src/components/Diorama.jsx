import React, { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Ambient floating starlight particles
 */
function SoftParticles({ count = 50 }) {
  const pointsRef = useRef()

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 6
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4 + 0.5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6

      spd[i * 3 + 0] = (Math.random() - 0.5) * 0.0015
      spd[i * 3 + 1] = Math.random() * 0.0025 + 0.0008
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
        size={0.045}
        color="#dfc89e"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

/**
 * Diorama Stage Wrapper
 * Framed at an intimate 3/4 isometric angle looking down onto the desk.
 */
export default function Diorama({ children }) {
  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        camera={{ position: [0, 2.8, 3.6], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        className="w-full h-full"
      >
        {/* Rich ambient fill so the desk is visible as a ceramic surface */}
        <ambientLight color="#182238" intensity={1.1} />

        {/* Warm key directional light */}
        <directionalLight
          position={[3.5, 5.5, 3.5]}
          intensity={1.6}
          color="#fff5e4"
        />

        {/* Soft violet rim fill light from the back */}
        <directionalLight
          position={[-3.5, 3, -3]}
          intensity={0.65}
          color="#8595c2"
        />

        {/* Floating motes */}
        <SoftParticles count={50} />

        <Suspense fallback={null}>
          {children}
        </Suspense>

        {/* Camera Controls */}
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