"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, Suspense, useState } from "react"
import type { Mesh, Group } from "three"

function Wheel() {
  const wheelRef = useRef<Group>(null)
  const elapsedRef = useRef(0)

  useFrame((_, delta) => {
    elapsedRef.current += delta
    if (wheelRef.current) {
      wheelRef.current.rotation.y += 0.005
      wheelRef.current.rotation.x = Math.sin(elapsedRef.current * 0.3) * 0.1
    }
  })

  return (
      <group ref={wheelRef} position={[0, 0, 0]}>
        {/* Outer rim */}
        <mesh>
          <torusGeometry args={[2, 0.3, 32, 64]} />
          <meshStandardMaterial
            color="#303030"
            metalness={0.95}
            roughness={0.1}
          />
        </mesh>

        {/* Rim lip */}
        <mesh>
          <torusGeometry args={[2.15, 0.08, 16, 64]} />
          <meshStandardMaterial
            color="#e0e0e0"
            metalness={1}
            roughness={0.05}
          />
        </mesh>

        {/* Inner rim lip */}
        <mesh>
          <torusGeometry args={[1.7, 0.05, 16, 64]} />
          <meshStandardMaterial
            color="#808080"
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>

        {/* Center hub */}
        <mesh position={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.6, 0.6, 0.3, 32]} />
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Center cap */}
        <mesh position={[0, 0, 0.26]}>
          <cylinderGeometry args={[0.35, 0.35, 0.05, 32]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.95}
            roughness={0.1}
          />
        </mesh>

        {/* Spokes - 5 spoke design */}
        {[0, 1, 2, 3, 4].map((i) => (
          <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 5]}>
            <mesh position={[1.1, 0, 0.05]} rotation={[0, 0, 0]}>
              <boxGeometry args={[1.4, 0.35, 0.15]} />
              <meshStandardMaterial
                color="#404040"
                metalness={0.9}
                roughness={0.15}
              />
            </mesh>
            {/* Spoke highlight */}
            <mesh position={[1.1, 0, 0.13]} rotation={[0, 0, 0]}>
              <boxGeometry args={[1.3, 0.08, 0.02]} />
              <meshStandardMaterial
                color="#707070"
                metalness={0.95}
                roughness={0.1}
              />
            </mesh>
          </group>
        ))}

        {/* Lug nuts */}
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh
            key={`lug-${i}`}
            position={[
              Math.cos((i * Math.PI * 2) / 5) * 0.45,
              Math.sin((i * Math.PI * 2) / 5) * 0.45,
              0.28,
            ]}
          >
            <cylinderGeometry args={[0.06, 0.06, 0.08, 6]} />
            <meshStandardMaterial
              color="#909090"
              metalness={1}
              roughness={0.1}
            />
          </mesh>
        ))}

        {/* Tire */}
        <mesh>
          <torusGeometry args={[2.7, 0.55, 32, 64]} />
          <meshStandardMaterial
            color="#0a0a0a"
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>

        {/* Tire sidewall text effect (subtle rings) */}
        <mesh>
          <torusGeometry args={[2.9, 0.02, 8, 64]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.2}
            roughness={0.7}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[2.5, 0.02, 8, 64]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.2}
            roughness={0.7}
          />
        </mesh>
      </group>
  )
}

function LoadingSpinner() {
  const meshRef = useRef<Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.02
    }
  })

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[0.5, 0.05, 8, 32]} />
      <meshBasicMaterial color="#ffffff" />
    </mesh>
  )
}

export function Wheel3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >

        {/* Ambient base light */}
        <ambientLight intensity={0.8} />
        
        {/* Main key light - bright white from top right */}
        <spotLight
          position={[6, 6, 6]}
          angle={0.4}
          penumbra={0.8}
          intensity={3}
          castShadow
          color="#ffffff"
        />
        
        {/* Fill light - warm tone from left */}
        <spotLight
          position={[-6, 4, 5]}
          angle={0.5}
          penumbra={1}
          intensity={2}
          color="#fff5e6"
        />
        
        {/* Rim light - creates edge highlights from behind */}
        <spotLight
          position={[0, 0, -8]}
          angle={0.6}
          penumbra={0.5}
          intensity={2}
          color="#e0e0e0"
        />
        
        {/* Bottom accent light - cool blue tone */}
        <pointLight position={[0, -6, 4]} intensity={1.2} color="#4a9eff" />
        
        {/* Top accent light - subtle warm highlight */}
        <pointLight position={[0, 6, 3]} intensity={1} color="#ffd699" />
        
        {/* Side accent lights for metallic reflections */}
        <pointLight position={[8, 0, 2]} intensity={1} color="#ffffff" />
        <pointLight position={[-8, 0, 2]} intensity={1} color="#ffffff" />

        <Suspense fallback={<LoadingSpinner />}>
          <Wheel />
        </Suspense>
      </Canvas>
    </div>
  )
}
