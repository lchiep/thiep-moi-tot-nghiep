"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { useNamStore } from "./store";

const NAVY = "#171b24";
const GOLD = "#c9a35f";
const SKIN = "#e3a876";
const HANDLE = "#2b2018";
const WOOD = "#4a3527";
const WOOD_LIGHT = "#5c4632";
const RUBBER = "#7a2a22";
const RUBBER_LIGHT = "#8f3229";

/**
 * Bàn tay + con dấu bằng khối 3D thật (không phải ảnh phẳng) — đập xuống
 * theo trục Y+Z, có độ nảy khi va chạm, rồi rút lên và biến mất.
 */
export default function StampTool3D() {
  const phase = useNamStore((s) => s.phase);
  const setPhase = useNamStore((s) => s.setPhase);
  const { viewport } = useThree();

  const groupRef = useRef<THREE.Group>(null!);
  const hasStamped = useRef(false);

  useEffect(() => {
    if (phase !== "stamping" || hasStamped.current) return;
    hasStamped.current = true;

    const startY = viewport.height * 0.75;
    const restY = 0.02;

    gsap.set(groupRef.current.position, { x: 0, y: startY, z: 0.7 });
    gsap.set(groupRef.current.rotation, { z: -0.18, x: 0.08 });

    const tl = gsap.timeline({ onComplete: () => setPhase("stamped") });

    tl.to(groupRef.current.position, {
      y: restY,
      z: 0,
      duration: 0.42,
      ease: "power3.in",
    })
      .to(groupRef.current.rotation, { z: 0.04, x: 0, duration: 0.42, ease: "power3.in" }, "<")
      .to(groupRef.current.position, { y: restY - 0.05, duration: 0.09, ease: "power1.out" })
      .to({}, { duration: 0.85 })
      .to(groupRef.current.position, {
        y: startY + 0.5,
        z: 0.9,
        duration: 0.5,
        ease: "power2.in",
      })
      .to(groupRef.current.rotation, { z: -0.22, duration: 0.5, ease: "power2.in" }, "<");
  }, [phase, setPhase, viewport]);

  if (phase !== "form" && phase !== "stamping" && phase !== "stamped") return null;

  return (
    <group ref={groupRef} position={[0, viewport.height * 0.75, 0]}>
      <mesh position={[0, 1.12, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.28, 0.32, 12]} />
        <meshStandardMaterial color={NAVY} roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.97, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.03, 12]} />
        <meshStandardMaterial color={GOLD} roughness={0.4} metalness={0.35} />
      </mesh>

      <mesh position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial color={SKIN} roughness={0.85} />
      </mesh>

      <mesh position={[0, 0.48, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.065, 0.55, 10]} />
        <meshStandardMaterial color={HANDLE} roughness={0.6} />
      </mesh>

      <mesh position={[0, 0.13, 0]} castShadow>
        <cylinderGeometry args={[0.27, 0.29, 0.18, 16]} />
        <meshStandardMaterial color={WOOD} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.21, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.03, 16]} />
        <meshStandardMaterial color={WOOD_LIGHT} roughness={0.6} />
      </mesh>

      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.33, 0.31, 0.08, 20]} />
        <meshStandardMaterial color={RUBBER} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.044, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.02, 20]} />
        <meshStandardMaterial color={RUBBER_LIGHT} roughness={0.85} />
      </mesh>
    </group>
  );
}
