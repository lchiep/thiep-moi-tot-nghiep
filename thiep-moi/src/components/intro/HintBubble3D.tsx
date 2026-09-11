"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { useIntroStore } from "./introStore";

/**
 * Bong bóng tin nhắn 3D bóng bẩy, gợi ý người dùng chạm vào mũ tốt
 * nghiệp — tham khảo phong cách icon 3D gradient bạn gửi.
 */
export default function HintBubble3D() {
  const phase = useIntroStore((s) => s.phase);
  const groupRef = useRef<THREE.Group>(null!);
  const hasAppeared = useRef(false);
  const idleT = useRef(0);

  useEffect(() => {
    if (phase !== "hint" || hasAppeared.current) return;
    hasAppeared.current = true;

    gsap.set(groupRef.current.scale, { x: 0.001, y: 0.001, z: 0.001 });
    gsap.to(groupRef.current.scale, {
      x: 0.65,
      y: 0.65,
      z: 0.65,
      duration: 0.5,
      delay: 0.15,
      ease: "back.out(2.4)",
    });
  }, [phase]);

  useFrame((_, delta) => {
    if (phase !== "hint" || !groupRef.current) return;
    idleT.current += delta;
    groupRef.current.position.y = 0.62 + Math.sin(idleT.current * 2.4) * 0.05;
  });

  if (phase !== "hint" && phase !== "shatter") return null;

  return (
    <group ref={groupRef} position={[0.28, 0.62, 0.4]} scale={[0.001, 0.001, 0.001]}>
      <mesh castShadow>
        <boxGeometry args={[0.46, 0.32, 0.1]} />
        <meshPhysicalMaterial
          color="#3fc7c2"
          roughness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.1}
          emissive="#1c6e6b"
          emissiveIntensity={0.25}
        />
      </mesh>
      <mesh position={[-0.12, -0.22, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.12, 0.12, 0.08]} />
        <meshPhysicalMaterial
          color="#3fc7c2"
          roughness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive="#1c6e6b"
          emissiveIntensity={0.25}
        />
      </mesh>
      <mesh position={[-0.13, 0.04, 0.052]}>
        <circleGeometry args={[0.035, 16]} />
        <meshBasicMaterial color="#eafffb" />
      </mesh>
      <mesh position={[0, 0.04, 0.052]}>
        <circleGeometry args={[0.035, 16]} />
        <meshBasicMaterial color="#eafffb" />
      </mesh>
      <mesh position={[0.13, 0.04, 0.052]}>
        <circleGeometry args={[0.035, 16]} />
        <meshBasicMaterial color="#eafffb" />
      </mesh>
    </group>
  );
}
