"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, Suspense, useMemo } from "react"
import type { Group, ShaderMaterial } from "three"
import * as THREE from "three"

// Шейдер для голографического переливающегося эффекта
const iridescenceVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`

const iridescenceFragmentShader = `
  uniform float uTime;
  uniform float uHueShift;
  
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;
  
  vec3 hsl2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
  }
  
  void main() {
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);
    
    // Динамический сдвиг оттенка на основе времени и угла
    float hue = mod(uHueShift + fresnel * 0.3 + vUv.x * 0.1, 1.0);
    
    // Базовый металлический цвет (темный хром)
    vec3 baseColor = vec3(0.15, 0.15, 0.17);
    
    // Голографический цвет
    vec3 iridescent = hsl2rgb(vec3(hue, 0.7, 0.6));
    
    // Смешивание базового цвета с голографическим эффектом
    vec3 finalColor = mix(baseColor, iridescent, fresnel * 0.8);
    
    // Добавляем блики
    float specular = pow(max(dot(reflect(-viewDir, vNormal), vec3(0.5, 0.5, 1.0)), 0.0), 32.0);
    finalColor += vec3(1.0) * specular * 0.5;
    
    // Металлический блеск
    finalColor += baseColor * 0.3;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

function IridescentMaterial({ speed = 0.15 }: { speed?: number }) {
  const materialRef = useRef<ShaderMaterial>(null)
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uHueShift: { value: 0 }
  }), [])
  
  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta
      materialRef.current.uniforms.uHueShift.value += delta * speed
      if (materialRef.current.uniforms.uHueShift.value > 1) {
        materialRef.current.uniforms.uHueShift.value -= 1
      }
    }
  })
  
  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={iridescenceVertexShader}
      fragmentShader={iridescenceFragmentShader}
      uniforms={uniforms}
      side={THREE.DoubleSide}
    />
  )
}

function Wheel() {
  const wheelRef = useRef<Group>(null)
  const elapsedRef = useRef(0)

  useFrame((_, delta) => {
    elapsedRef.current += delta
    if (wheelRef.current) {
      // Плавное вращение
      wheelRef.current.rotation.y += 0.008
      // Легкое покачивание
      wheelRef.current.rotation.x = Math.sin(elapsedRef.current * 0.4) * 0.08
      wheelRef.current.rotation.z = Math.cos(elapsedRef.current * 0.3) * 0.03
    }
  })

  return (
    <group ref={wheelRef} position={[0, 0, 0]}>
      {/* Внешний обод с голографическим эффектом */}
      <mesh>
        <torusGeometry args={[2.2, 0.35, 32, 64]} />
        <IridescentMaterial speed={0.12} />
      </mesh>

      {/* Хромированная кромка обода */}
      <mesh>
        <torusGeometry args={[2.4, 0.1, 16, 64]} />
        <meshStandardMaterial
          color="#c0c0c0"
          metalness={1}
          roughness={0.05}
          envMapIntensity={2}
        />
      </mesh>

      {/* Внутренняя кромка */}
      <mesh>
        <torusGeometry args={[1.85, 0.08, 16, 64]} />
        <IridescentMaterial speed={0.18} />
      </mesh>

      {/* Центральная ступица */}
      <mesh position={[0, 0, 0.12]}>
        <cylinderGeometry args={[0.7, 0.7, 0.35, 32]} />
        <IridescentMaterial speed={0.1} />
      </mesh>

      {/* Центральная крышка с логотипом */}
      <mesh position={[0, 0, 0.32]}>
        <cylinderGeometry args={[0.4, 0.4, 0.08, 32]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
      
      {/* Декоративное кольцо на крышке */}
      <mesh position={[0, 0, 0.37]}>
        <torusGeometry args={[0.3, 0.02, 8, 32]} />
        <IridescentMaterial speed={0.2} />
      </mesh>

      {/* 5 спиц с голографическим эффектом */}
      {[0, 1, 2, 3, 4].map((i) => (
        <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 5]}>
          {/* Основная спица */}
          <mesh position={[1.2, 0, 0.08]} rotation={[0, 0, 0]}>
            <boxGeometry args={[1.5, 0.4, 0.2]} />
            <IridescentMaterial speed={0.15 + i * 0.02} />
          </mesh>
          
          {/* Выступ на спице для объема */}
          <mesh position={[1.2, 0, 0.2]} rotation={[0, 0, 0]}>
            <boxGeometry args={[1.3, 0.15, 0.08]} />
            <meshStandardMaterial
              color="#909090"
              metalness={1}
              roughness={0.08}
            />
          </mesh>
          
          {/* Углубление между спицами */}
          <mesh position={[1.4, 0.35, -0.05]} rotation={[0, 0, Math.PI / 10]}>
            <boxGeometry args={[0.8, 0.25, 0.1]} />
            <meshStandardMaterial
              color="#0a0a0a"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* Болты крепления */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={`lug-${i}`}
          position={[
            Math.cos((i * Math.PI * 2) / 5) * 0.52,
            Math.sin((i * Math.PI * 2) / 5) * 0.52,
            0.36,
          ]}
        >
          <cylinderGeometry args={[0.07, 0.07, 0.12, 6]} />
          <IridescentMaterial speed={0.25} />
        </mesh>
      ))}

      {/* Вентиляционные отверстия */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={`vent-${i}`}
          position={[
            Math.cos((i * Math.PI * 2) / 5 + Math.PI / 5) * 1.5,
            Math.sin((i * Math.PI * 2) / 5 + Math.PI / 5) * 1.5,
            0,
          ]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[0.18, 0.04, 8, 16]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

function LoadingSpinner() {
  const groupRef = useRef<Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.03
    }
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <torusGeometry args={[0.5, 0.05, 8, 32, Math.PI * 1.5]} />
        <meshBasicMaterial color="#c9a86c" />
      </mesh>
    </group>
  )
}

export function Wheel3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        {/* Базовое освещение */}
        <ambientLight intensity={0.4} />
        
        {/* Основной ключевой свет - теплый */}
        <spotLight
          position={[5, 5, 5]}
          angle={0.5}
          penumbra={0.8}
          intensity={2.5}
          color="#fff8f0"
        />
        
        {/* Заполняющий свет - холодный */}
        <spotLight
          position={[-5, 3, 4]}
          angle={0.6}
          penumbra={1}
          intensity={1.5}
          color="#e0f0ff"
        />
        
        {/* Контровой свет */}
        <spotLight
          position={[0, -2, -6]}
          angle={0.7}
          penumbra={0.5}
          intensity={1.5}
          color="#ffffff"
        />
        
        {/* Акцентные точечные источники для бликов */}
        <pointLight position={[3, -3, 3]} intensity={0.8} color="#ffd699" />
        <pointLight position={[-3, 3, 3]} intensity={0.8} color="#99d6ff" />
        <pointLight position={[0, 4, 2]} intensity={0.6} color="#ffffff" />

        <Suspense fallback={<LoadingSpinner />}>
          <Wheel />
        </Suspense>
      </Canvas>
    </div>
  )
}
