"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Float, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { QrCode, Scissors } from "lucide-react";

// ── Barber chair geometry composed from primitives ─────────────────────────
function BarberChairModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Very slow base rotation
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.18;
    // Gentle bob
    groupRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.5) * 0.04;
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: "#D5A84C",
    metalness: 0.7,
    roughness: 0.25,
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: "#1a1a1a",
    metalness: 0.2,
    roughness: 0.7,
  });
  const chromeMat = new THREE.MeshStandardMaterial({
    color: "#C0C0C0",
    metalness: 0.95,
    roughness: 0.05,
  });

  return (
    <group ref={groupRef}>
      {/* Seat base / cushion */}
      <RoundedBox args={[1.2, 0.2, 1.0]} radius={0.08} smoothness={4} position={[0, 0, 0]}>
        <primitive object={darkMat.clone()} attach="material" />
      </RoundedBox>

      {/* Seat cushion top */}
      <RoundedBox args={[1.1, 0.1, 0.9]} radius={0.06} smoothness={4} position={[0, 0.14, 0]}>
        <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
      </RoundedBox>

      {/* Backrest */}
      <RoundedBox args={[1.1, 1.4, 0.15]} radius={0.07} smoothness={4} position={[0, 0.82, -0.42]}>
        <primitive object={darkMat.clone()} attach="material" />
      </RoundedBox>

      {/* Backrest cushion */}
      <RoundedBox args={[0.95, 1.2, 0.08]} radius={0.05} smoothness={4} position={[0, 0.82, -0.35]}>
        <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
      </RoundedBox>

      {/* Headrest */}
      <RoundedBox args={[0.7, 0.35, 0.2]} radius={0.07} smoothness={4} position={[0, 1.65, -0.38]}>
        <primitive object={darkMat.clone()} attach="material" />
      </RoundedBox>

      {/* Left armrest */}
      <RoundedBox args={[0.15, 0.12, 0.7]} radius={0.05} smoothness={4} position={[-0.55, 0.25, -0.1]}>
        <primitive object={darkMat.clone()} attach="material" />
      </RoundedBox>

      {/* Right armrest */}
      <RoundedBox args={[0.15, 0.12, 0.7]} radius={0.05} smoothness={4} position={[0.55, 0.25, -0.1]}>
        <primitive object={darkMat.clone()} attach="material" />
      </RoundedBox>

      {/* Left support leg */}
      <mesh position={[-0.42, -0.52, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.9, 16]} />
        <primitive object={chromeMat.clone()} attach="material" />
      </mesh>

      {/* Right support leg */}
      <mesh position={[0.42, -0.52, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.9, 16]} />
        <primitive object={chromeMat.clone()} attach="material" />
      </mesh>

      {/* Center pole */}
      <mesh position={[0, -0.88, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 0.55, 16]} />
        <primitive object={chromeMat.clone()} attach="material" />
      </mesh>

      {/* Base disk */}
      <mesh position={[0, -1.12, 0]}>
        <cylinderGeometry args={[0.55, 0.6, 0.08, 32]} />
        <primitive object={chromeMat.clone()} attach="material" />
      </mesh>

      {/* Footrest */}
      <RoundedBox args={[0.9, 0.06, 0.25]} radius={0.03} smoothness={4} position={[0, -0.15, 0.48]}>
        <primitive object={chromeMat.clone()} attach="material" />
      </RoundedBox>

      {/* Gold accent strip on backrest */}
      <RoundedBox args={[0.95, 0.04, 0.04]} radius={0.02} smoothness={4} position={[0, 1.47, -0.31]}>
        <primitive object={goldMat.clone()} attach="material" />
      </RoundedBox>

      {/* Gold accent strip on seat edge */}
      <RoundedBox args={[1.18, 0.03, 0.03]} radius={0.015} smoothness={4} position={[0, 0.11, 0.5]}>
        <primitive object={goldMat.clone()} attach="material" />
      </RoundedBox>
    </group>
  );
}

// ── Floating clipper shape ─────────────────────────────────────────────────
function FloatingClipper() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6) * 0.15;
  });

  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
      <group ref={ref} position={[2.1, 0.6, 0.3]}>
        {/* Clipper body */}
        <RoundedBox args={[0.28, 0.58, 0.12]} radius={0.06} smoothness={4}>
          <meshStandardMaterial color="#1a1a1a" metalness={0.4} roughness={0.6} />
        </RoundedBox>
        {/* Clipper blade */}
        <RoundedBox args={[0.26, 0.08, 0.04]} radius={0.02} smoothness={4} position={[0, 0.33, 0]}>
          <meshStandardMaterial color="#C0C0C0" metalness={0.95} roughness={0.05} />
        </RoundedBox>
        {/* Gold stripe */}
        <RoundedBox args={[0.28, 0.025, 0.13]} radius={0.01} smoothness={4} position={[0, 0.1, 0]}>
          <meshStandardMaterial color="#D5A84C" metalness={0.7} roughness={0.2} />
        </RoundedBox>
      </group>
    </Float>
  );
}

// ── Floating QR card ───────────────────────────────────────────────────────
function FloatingQRCard() {
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.8}>
      <group position={[-2.0, 0.2, 0.4]}>
        <RoundedBox args={[0.65, 0.65, 0.04]} radius={0.06} smoothness={4}>
          <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0} />
        </RoundedBox>
        {/* QR pattern suggestion — a grid of small boxes */}
        {[
          [-0.18, 0.18], [0, 0.18], [0.18, 0.18],
          [-0.18, 0], [0, 0], [0.18, 0],
          [-0.18, -0.18], [0, -0.18], [0.18, -0.18],
        ].map(([x, y], i) => (
          <RoundedBox
            key={i}
            args={[0.1, 0.1, 0.02]}
            radius={0.01}
            smoothness={2}
            position={[x, y, 0.03]}
          >
            <meshStandardMaterial color="#080A0F" roughness={0.8} />
          </RoundedBox>
        ))}
      </group>
    </Float>
  );
}

// ── Scene wrapper ──────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-4, 2, -3]} intensity={0.4} color="#D5A84C" />
      <pointLight position={[0, 3, 3]} intensity={0.5} color="#ffffff" />

      <Environment preset="studio" />

      <Suspense fallback={null}>
        <BarberChairModel />
        <FloatingClipper />
        <FloatingQRCard />
      </Suspense>

      <ContactShadows
        position={[0, -1.18, 0]}
        opacity={0.22}
        scale={5}
        blur={2.5}
        far={1.5}
      />
    </>
  );
}

// ── Exported component ─────────────────────────────────────────────────────
export default function BarberChair3D() {
  return (
    <div className="relative h-[400px] w-full md:h-[500px]">
      {/* Floating UI overlay badges */}
      <div className="pointer-events-none absolute left-2 top-6 z-10 rounded-2xl border border-[#D5A84C]/20 bg-[#0E0E1C]/85 px-3 py-2 backdrop-blur-sm">
        <p className="text-[11px] font-black text-[#D5A84C]">24/7</p>
        <p className="text-[10px] text-white/50">Reservas</p>
      </div>
      <div className="pointer-events-none absolute right-2 bottom-10 z-10 rounded-2xl border border-white/[0.08] bg-[#0E0E1C]/85 px-3 py-2 backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          <QrCode size={12} className="text-[#D5A84C]" />
          <p className="text-[11px] font-black text-white">QR listo</p>
        </div>
        <p className="text-[10px] text-white/45">Escanea y reserva</p>
      </div>
      <div className="pointer-events-none absolute right-4 top-6 z-10 rounded-2xl border border-white/[0.08] bg-[#0E0E1C]/85 px-3 py-2 backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          <Scissors size={11} className="text-white/60" />
          <p className="text-[11px] font-black text-white">0% comisión</p>
        </div>
      </div>

      <Canvas
        camera={{ position: [0, 0.8, 4.2], fov: 42 }}
        performance={{ min: 0.5 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
