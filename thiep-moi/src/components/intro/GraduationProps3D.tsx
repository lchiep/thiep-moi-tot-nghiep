"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { useIntroStore } from "./introStore";

const CAP_DARK = "#181a20";
const GOLD = "#c9a35f";
const PAPER = "#f3ecd9";
const PAPER_RIM = "#e0d5b8";

/** Mũ tốt nghiệp: mảnh trên (mortarboard), phần chụp đầu, nút + tua dây. */
function Cap() {
  return (
    <group rotation={[0, Math.PI / 4, 0]}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[1.4, 0.08, 1.4]} />
        <meshStandardMaterial color={CAP_DARK} roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.02, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.46, 0.32, 24]} />
        <meshStandardMaterial color={CAP_DARK} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial color={GOLD} roughness={0.35} metalness={0.5} />
      </mesh>
      {/* tassel string, draped from the button to a corner */}
      <mesh position={[0.32, 0.12, 0.32]} rotation={[0, -Math.PI / 4, Math.PI / 5]} castShadow>
        <cylinderGeometry args={[0.014, 0.014, 0.45, 8]} />
        <meshStandardMaterial color={GOLD} roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[0.52, -0.14, 0.52]} castShadow>
        <coneGeometry args={[0.055, 0.16, 10]} />
        <meshStandardMaterial color={GOLD} roughness={0.4} metalness={0.4} />
      </mesh>
    </group>
  );
}

/** Bằng tốt nghiệp cuộn tròn, buộc ruy băng vàng, đặt chéo phía trước mũ. */
function Diploma() {
  return (
    <group position={[0, -0.55, 0.55]} rotation={[0, 0.5, Math.PI / 2 + 0.08]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 20]} />
        <meshStandardMaterial color={PAPER} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.155, 0.155, 0.03, 20]} />
        <meshStandardMaterial color={PAPER_RIM} roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.155, 0.155, 0.03, 20]} />
        <meshStandardMaterial color={PAPER_RIM} roughness={0.8} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.158, 0.035, 10, 24]} />
        <meshStandardMaterial color={GOLD} roughness={0.35} metalness={0.5} />
      </mesh>
    </group>
  );
}

const STAR_COUNT = 90;

/** Điểm sáng nhỏ (như sao) bắn ra khi mũ/bằng vỡ. */
function StarBurst() {
  const pointsRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.PointsMaterial>(null!);
  const phase = useIntroStore((s) => s.phase);
  const started = useRef(false);

  const positions = useRef(new Float32Array(STAR_COUNT * 3)).current;

  useEffect(() => {
    if (phase !== "shatter" || started.current) return;
    started.current = true;

    const velocities: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 0.8 + Math.random() * 1.6;
      velocities.push({
        x: Math.sin(phi) * Math.cos(theta) * speed,
        y: Math.sin(phi) * Math.sin(theta) * speed,
        z: Math.cos(phi) * speed,
      });
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    if (materialRef.current) materialRef.current.opacity = 0;

    const geomPos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const state = { t: 0 };

    gsap
      .timeline({ delay: 0.5 })
      .to(materialRef.current, { opacity: 1, duration: 0.1 })
      .to(
        state,
        {
          t: 1,
          duration: 0.9,
          ease: "power2.out",
          onUpdate: () => {
            for (let i = 0; i < STAR_COUNT; i++) {
              const v = velocities[i];
              geomPos.array[i * 3] = v.x * state.t;
              geomPos.array[i * 3 + 1] = v.y * state.t;
              geomPos.array[i * 3 + 2] = v.z * state.t;
            }
            geomPos.needsUpdate = true;
          },
        },
        "<"
      )
      .to(materialRef.current, { opacity: 0, duration: 0.4, ease: "power1.in" }, "-=0.3");
  }, [phase, positions]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.06}
        color="#c9a35f"
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Mũ + bằng tốt nghiệp: trồi từ dưới lên, chờ chạm, rồi xoay vỡ thành sao.
 */
export default function GraduationProps3D() {
  const phase = useIntroStore((s) => s.phase);
  const setPhase = useIntroStore((s) => s.setPhase);
  const { viewport } = useThree();

  const groupRef = useRef<THREE.Group>(null!);
  const hasRisen = useRef(false);
  const hasShattered = useRef(false);
  const idleT = useRef(0);

  useEffect(() => {
    if (phase !== "rise" || hasRisen.current) return;
    hasRisen.current = true;

    gsap.set(groupRef.current.position, { x: 0, y: -viewport.height * 0.9, z: 0 });
    gsap.set(groupRef.current.scale, { x: 0.7, y: 0.7, z: 0.7 });

    gsap.to(groupRef.current.position, {
      y: 0.15,
      duration: 0.9,
      ease: "back.out(1.4)",
      onComplete: () => setPhase("hint"),
    });
    gsap.to(groupRef.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.9,
      ease: "back.out(1.4)",
    });
  }, [phase, setPhase, viewport]);

  useEffect(() => {
    if (phase !== "shatter" || hasShattered.current) return;
    hasShattered.current = true;

    const tl = gsap.timeline();
    tl.to(groupRef.current.rotation, {
      y: "+=" + Math.PI * 4,
      duration: 0.9,
      ease: "power2.in",
    })
      .to(
        groupRef.current.scale,
        { x: 0.001, y: 0.001, z: 0.001, duration: 0.45, ease: "power2.in" },
        "-=0.35"
      )
      .to({}, { duration: 0.6 })
      .call(() => setPhase("done"));
  }, [phase, setPhase]);

  useFrame((_, delta) => {
    if (phase !== "hint" || !groupRef.current) return;
    idleT.current += delta;
    groupRef.current.rotation.y = Math.sin(idleT.current * 0.7) * 0.18;
    groupRef.current.position.y = 0.15 + Math.sin(idleT.current * 1.3) * 0.03;
  });

  return (
    <group
      onClick={() => phase === "hint" && setPhase("shatter")}
      onPointerOver={() => {
        if (phase === "hint" && typeof document !== "undefined") {
          document.body.style.cursor = "pointer";
        }
      }}
      onPointerOut={() => {
        if (typeof document !== "undefined") document.body.style.cursor = "auto";
      }}
    >
      <group ref={groupRef} position={[0, -viewport.height * 0.9, 0]} scale={[0.7, 0.7, 0.7]}>
        {/* constant 3/4 tilt so the flat mortarboard top faces the camera
            instead of being viewed near edge-on (which read as a giant,
            barely-recognizable slab — the same lesson as the paper plane
            wings in the Nam branch) */}
        <group rotation={[-0.55, 0, 0]} scale={0.56}>
          <Cap />
          <Diploma />
        </group>
        {/* invisible-but-raycastable, larger hit target so the tap zone is
            forgiving (visible=false would also skip it during raycasting,
            so it stays "visible" with fully transparent material instead) */}
        <mesh>
          <sphereGeometry args={[1.3, 12, 12]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
      <StarBurst />
    </group>
  );
}
