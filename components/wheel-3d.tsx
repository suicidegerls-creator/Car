"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, Suspense, useMemo } from "react"
import type { Group, Mesh } from "three"
import * as THREE from "three"
import { Environment, ContactShadows } from "@react-three/drei"

// Mercedes-AMG Multi-Spoke Wheel - 10 двойных спиц (20 лучей)
function AMGWheel() {
  const wheelRef = useRef<Group>(null)
  const elapsedRef = useRef(0)

  // Материалы
  const chromeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.85, 0.85, 0.88),
    metalness: 1,
    roughness: 0.08,
    envMapIntensity: 1.5,
  }), [])

  const darkChromeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.25, 0.25, 0.28),
    metalness: 1,
    roughness: 0.15,
    envMapIntensity: 1.2,
  }), [])

  const anthraciteMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.12, 0.12, 0.14),
    metalness: 0.95,
    roughness: 0.25,
    envMapIntensity: 1,
  }), [])

  const redBrakeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.8, 0.1, 0.1),
    metalness: 0.3,
    roughness: 0.4,
  }), [])

  const blackMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.02, 0.02, 0.02),
    metalness: 0.8,
    roughness: 0.3,
  }), [])

  useFrame((_, delta) => {
    elapsedRef.current += delta
    if (wheelRef.current) {
      wheelRef.current.rotation.z += 0.004
      wheelRef.current.rotation.x = Math.sin(elapsedRef.current * 0.3) * 0.05
      wheelRef.current.rotation.y = Math.cos(elapsedRef.current * 0.2) * 0.03
    }
  })

  const spokeCount = 10
  const spokeAngles = useMemo(() => 
    Array.from({ length: spokeCount }, (_, i) => (i * Math.PI * 2) / spokeCount), 
  [])

  return (
    <group ref={wheelRef} rotation={[Math.PI / 2, 0, 0]}>
      {/* Внешний обод - полированный хром */}
      <mesh material={chromeMaterial}>
        <torusGeometry args={[2.4, 0.18, 32, 128]} />
      </mesh>

      {/* Кромка обода - хром с фаской */}
      <mesh position={[0, 0, 0.15]} material={chromeMaterial}>
        <torusGeometry args={[2.35, 0.08, 16, 128]} />
      </mesh>
      <mesh position={[0, 0, -0.15]} material={chromeMaterial}>
        <torusGeometry args={[2.35, 0.08, 16, 128]} />
      </mesh>

      {/* Основа диска - темный антрацит */}
      <mesh position={[0, 0, 0]} material={anthraciteMaterial}>
        <cylinderGeometry args={[2.25, 2.25, 0.25, 128]} />
      </mesh>

      {/* 10 двойных спиц (20 лучей) в стиле AMG турбина */}
      {spokeAngles.map((angle, i) => (
        <group key={i} rotation={[0, 0, angle]}>
          {/* Основная спица - V-образный профиль */}
          <mesh position={[1.4, 0.08, 0.12]} rotation={[0, 0, -0.05]} material={chromeMaterial}>
            <boxGeometry args={[1.7, 0.14, 0.22]} />
          </mesh>
          <mesh position={[1.4, -0.08, 0.12]} rotation={[0, 0, 0.05]} material={chromeMaterial}>
            <boxGeometry args={[1.7, 0.14, 0.22]} />
          </mesh>

          {/* Грань спицы - темный акцент */}
          <mesh position={[1.4, 0, 0.02]} material={darkChromeMaterial}>
            <boxGeometry args={[1.65, 0.08, 0.12]} />
          </mesh>

          {/* Внешнее расширение спицы у обода */}
          <mesh position={[2.15, 0, 0.1]} material={chromeMaterial}>
            <boxGeometry args={[0.25, 0.35, 0.18]} />
          </mesh>
        </group>
      ))}

      {/* Центральная ступица - многоуровневая */}
      <mesh position={[0, 0, 0.18]} material={darkChromeMaterial}>
        <cylinderGeometry args={[0.65, 0.7, 0.15, 64]} />
      </mesh>

      <mesh position={[0, 0, 0.28]} material={chromeMaterial}>
        <cylinderGeometry args={[0.55, 0.6, 0.08, 64]} />
      </mesh>

      {/* Центральная крышка AMG */}
      <mesh position={[0, 0, 0.35]} material={blackMaterial}>
        <cylinderGeometry args={[0.42, 0.42, 0.06, 64]} />
      </mesh>

      {/* Кольцо вокруг крышки - хром */}
      <mesh position={[0, 0, 0.35]} material={chromeMaterial}>
        <torusGeometry args={[0.42, 0.025, 16, 64]} />
      </mesh>

      {/* AMG звезда (упрощенная) */}
      <mesh position={[0, 0, 0.39]} material={chromeMaterial}>
        <cylinderGeometry args={[0.15, 0.15, 0.02, 3]} />
      </mesh>

      {/* Болты крепления - 5 штук */}
      {[0, 1, 2, 3, 4].map((i) => {
        const boltAngle = (i * Math.PI * 2) / 5
        return (
          <group key={`bolt-${i}`}>
            <mesh
              position={[
                Math.cos(boltAngle) * 0.48,
                Math.sin(boltAngle) * 0.48,
                0.36,
              ]}
              material={chromeMaterial}
            >
              <cylinderGeometry args={[0.055, 0.055, 0.08, 6]} />
            </mesh>
            {/* Шайба */}
            <mesh
              position={[
                Math.cos(boltAngle) * 0.48,
                Math.sin(boltAngle) * 0.48,
                0.32,
              ]}
              material={darkChromeMaterial}
            >
              <cylinderGeometry args={[0.07, 0.07, 0.02, 16]} />
            </mesh>
          </group>
        )
      })}

      {/* Красные тормозные суппорта (видны через спицы) */}
      <mesh position={[0.8, 0, -0.1]} rotation={[0, 0, 0.3]} material={redBrakeMaterial}>
        <boxGeometry args={[0.8, 0.35, 0.2]} />
      </mesh>
      <mesh position={[-0.6, 0.5, -0.1]} rotation={[0, 0, 2.5]} material={redBrakeMaterial}>
        <boxGeometry args={[0.6, 0.3, 0.18]} />
      </mesh>

      {/* Тормозной диск */}
      <mesh position={[0, 0, -0.15]} material={anthraciteMaterial}>
        <cylinderGeometry args={[1.6, 1.6, 0.08, 64]} />
      </mesh>

      {/* Вентиляционные отверстия тормозного диска */}
      {Array.from({ length: 36 }, (_, i) => {
        const ventAngle = (i * Math.PI * 2) / 36
        const radius = 1.2
        return (
          <mesh
            key={`vent-${i}`}
            position={[
              Math.cos(ventAngle) * radius,
              Math.sin(ventAngle) * radius,
              -0.15,
            ]}
            material={blackMaterial}
          >
            <cylinderGeometry args={[0.04, 0.04, 0.1, 8]} />
          </mesh>
        )
      })}

      {/* Внутренние вентиляционные прорези между спицами */}
      {spokeAngles.map((angle, i) => {
        const slotAngle = angle + Math.PI / spokeCount
        return (
          <mesh
            key={`slot-${i}`}
            position={[
              Math.cos(slotAngle) * 1.1,
              Math.sin(slotAngle) * 1.1,
              0.05,
            ]}
            rotation={[0, 0, slotAngle]}
            material={blackMaterial}
          >
            <boxGeometry args={[0.5, 0.15, 0.15]} />
          </mesh>
        )
      })}
    </group>
  )
}

function LoadingSpinner() {
  const meshRef = useRef<Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.03
    }
  })

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[0.5, 0.05, 8, 32, Math.PI * 1.5]} />
      <meshBasicMaterial color="#c9a86c" />
    </mesh>
  )
}

export function Wheel3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        {/* HDR окружение для реалистичных отражений */}
        <Environment preset="studio" />

        {/* Основное освещение */}
        <ambientLight intensity={0.3} />

        {/* Ключевой свет - теплый студийный */}
        <spotLight
          position={[5, 5, 5]}
          angle={0.4}
          penumbra={1}
          intensity={2}
          color="#fffaf0"
          castShadow
        />

        {/* Заполняющий свет - холодный */}
        <spotLight
          position={[-4, 3, 4]}
          angle={0.5}
          penumbra={1}
          intensity={1.2}
          color="#e8f4ff"
        />

        {/* Контровой свет для объема */}
        <spotLight
          position={[0, -4, -3]}
          angle={0.6}
          penumbra={0.8}
          intensity={0.8}
          color="#ffffff"
        />

        {/* Акцентный свет сверху */}
        <pointLight position={[0, 5, 2]} intensity={0.5} color="#ffffff" />

        {/* Боковые акценты для хромовых бликов */}
        <pointLight position={[4, 0, 3]} intensity={0.4} color="#fff5e6" />
        <pointLight position={[-4, 0, 3]} intensity={0.4} color="#e6f0ff" />

        <Suspense fallback={<LoadingSpinner />}>
          <AMGWheel />
        </Suspense>

        {/* Мягкая тень под диском */}
        <ContactShadows
          position={[0, -2.5, 0]}
          opacity={0.4}
          scale={8}
          blur={2.5}
          far={4}
        />
      </Canvas>
    </div>
  )
}
