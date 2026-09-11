"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { useNamStore } from "./store";

const PALETTE = [
  new THREE.Color("#f5f1e8"),
  new THREE.Color("#d8d0bd"),
  new THREE.Color("#c9a35f"),
  new THREE.Color("#eee7d6"),
];

const PARTICLE_COUNT = 160;

/** Quét 1 icon thư mục + dấu tích vẽ trên canvas offscreen, lấy toạ độ
 * các điểm có alpha > 0 làm điểm đích cho hạt "tụ" lại thành hình. */
function sampleFolderIconPoints(size: number, count: number) {
  const off = document.createElement("canvas");
  off.width = size;
  off.height = size;
  const ctx = off.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "#fff";

  const w = size * 0.74;
  const h = size * 0.56;
  const x0 = (size - w) / 2;
  const y0 = size * 0.32;
  const r = size * 0.05;
  const tabW = w * 0.42;
  const tabH = size * 0.08;

  ctx.beginPath();
  ctx.moveTo(x0 + r, y0 - tabH);
  ctx.lineTo(x0 + tabW, y0 - tabH);
  ctx.lineTo(x0 + tabW + tabH, y0);
  ctx.lineTo(x0 + w - r, y0);
  ctx.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + r);
  ctx.lineTo(x0 + w, y0 + h - r);
  ctx.quadraticCurveTo(x0 + w, y0 + h, x0 + w - r, y0 + h);
  ctx.lineTo(x0 + r, y0 + h);
  ctx.quadraticCurveTo(x0, y0 + h, x0, y0 + h - r);
  ctx.lineTo(x0, y0 - tabH + r);
  ctx.quadraticCurveTo(x0, y0 - tabH, x0 + r, y0 - tabH);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#fff";
  ctx.lineWidth = size * 0.06;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(x0 + w * 0.28, y0 + h * 0.52);
  ctx.lineTo(x0 + w * 0.46, y0 + h * 0.72);
  ctx.lineTo(x0 + w * 0.76, y0 + h * 0.32);
  ctx.stroke();

  const data = ctx.getImageData(0, 0, size, size).data;
  const candidates: { x: number; y: number }[] = [];
  for (let y = 0; y < size; y += 2) {
    for (let x = 0; x < size; x += 2) {
      if (data[(y * size + x) * 4 + 3] > 128) candidates.push({ x, y });
    }
  }
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  const picked: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) picked.push(candidates[i % candidates.length]);
  return picked;
}

function useFolderShape() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    const w = 1.1;
    const h = 0.82;
    const x0 = -w / 2;
    const y0 = -h / 2;
    const r = 0.07;
    const tabW = w * 0.42;
    const tabH = h * 0.16;

    shape.moveTo(x0 + r, y0 + h);
    shape.lineTo(x0 + tabW, y0 + h);
    shape.lineTo(x0 + tabW + tabH, y0 + h - tabH);
    shape.lineTo(x0 + w - r, y0 + h - tabH);
    shape.quadraticCurveTo(x0 + w, y0 + h - tabH, x0 + w, y0 + h - tabH - r);
    shape.lineTo(x0 + w, y0 + r);
    shape.quadraticCurveTo(x0 + w, y0, x0 + w - r, y0);
    shape.lineTo(x0 + r, y0);
    shape.quadraticCurveTo(x0, y0, x0, y0 + r);
    shape.lineTo(x0, y0 + h - r);
    shape.quadraticCurveTo(x0, y0 + h, x0 + r, y0 + h);

    return shape;
  }, []);
}

/**
 * Thư vỡ thành các hạt bay ra rồi tụ lại đúng hình icon thư mục có dấu
 * tích, cuối cùng hiện icon 3D thật (extrude, có độ dày + đổ bóng).
 */
export default function ParticleShatter3D() {
  const phase = useNamStore((s) => s.phase);
  const setPhase = useNamStore((s) => s.setPhase);
  const { viewport } = useThree();

  const pointsRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.PointsMaterial>(null!);
  const iconGroupRef = useRef<THREE.Group>(null!);
  const checkGroupRef = useRef<THREE.Group>(null!);
  const started = useRef(false);
  const idleT = useRef(0);

  const folderShape = useFolderShape();

  const { positions, colors, targets } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const targets = new Float32Array(PARTICLE_COUNT * 3);
    return { positions, colors, targets };
  }, []);

  useEffect(() => {
    if (phase !== "shatter" || started.current) return;
    started.current = true;

    const iconPts = sampleFolderIconPoints(256, PARTICLE_COUNT);
    const iconWorldSize = 1.1;

    const sourceW = Math.min(viewport.width * 0.5, 1.5);
    const sourceH = 1.31;

    const velocities: { vx: number; vy: number; vz: number }[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * sourceW;
      const y = (Math.random() - 0.5) * sourceH;
      const z = (Math.random() - 0.5) * 0.15;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1.3;
      velocities.push({
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        vz: (Math.random() - 0.5) * 0.6,
      });

      const p = iconPts[i];
      targets[i * 3] = ((p.x - 128) / 256) * iconWorldSize;
      targets[i * 3 + 1] = (-(p.y - 128) / 256) * iconWorldSize;
      targets[i * 3 + 2] = (Math.random() - 0.5) * 0.06;

      const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;
    if (materialRef.current) materialRef.current.opacity = 1;
    iconGroupRef.current.scale.set(0.001, 0.001, 0.001);
    checkGroupRef.current.scale.set(0.001, 0.001, 0.001);

    const burstDur = 0.42;
    const convergeDur = 0.95;
    const holdDur = 0.25;

    const state = { t: 0 };
    const geomPositions = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const startPositions = positions.slice();

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => setPhase("revealed"), 450);
      },
    });

    // burst: drift outward with drag + slight gravity, driven by onUpdate
    tl.to(state, {
      t: 1,
      duration: burstDur,
      ease: "power2.out",
      onUpdate: () => {
        const drag = 1 - state.t * 0.5;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const v = velocities[i];
          geomPositions.array[i * 3] =
            startPositions[i * 3] + v.vx * state.t * drag * 0.6;
          geomPositions.array[i * 3 + 1] =
            startPositions[i * 3 + 1] + v.vy * state.t * drag * 0.6 - state.t * 0.15;
          geomPositions.array[i * 3 + 2] =
            startPositions[i * 3 + 2] + v.vz * state.t * drag * 0.6;
        }
        geomPositions.needsUpdate = true;
      },
      onComplete: () => {
        for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
          startPositions[i] = geomPositions.array[i];
        }
      },
    });

    const convergeState = { t: 0 };
    tl.to(convergeState, {
      t: 1,
      duration: convergeDur,
      ease: "power3.out",
      onUpdate: () => {
        const t = convergeState.t;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          geomPositions.array[i * 3] =
            startPositions[i * 3] + (targets[i * 3] - startPositions[i * 3]) * t;
          geomPositions.array[i * 3 + 1] =
            startPositions[i * 3 + 1] +
            (targets[i * 3 + 1] - startPositions[i * 3 + 1]) * t;
          geomPositions.array[i * 3 + 2] =
            startPositions[i * 3 + 2] +
            (targets[i * 3 + 2] - startPositions[i * 3 + 2]) * t;
        }
        geomPositions.needsUpdate = true;
      },
    });

    tl.to({}, { duration: holdDur })
      .to(iconGroupRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.4, ease: "back.out(2)" })
      .to(
        checkGroupRef.current.scale,
        { x: 1, y: 1, z: 1, duration: 0.3, ease: "back.out(2.4)" },
        "-=0.15"
      )
      .to(materialRef.current, { opacity: 0, duration: 0.35, ease: "power1.in" }, "<");
  }, [phase, setPhase, viewport, positions, targets]);

  useFrame((_, delta) => {
    if (phase !== "revealed" || !iconGroupRef.current) return;
    idleT.current += delta;
    iconGroupRef.current.rotation.y = Math.sin(idleT.current * 0.6) * 0.15;
    checkGroupRef.current.rotation.y = iconGroupRef.current.rotation.y;
  });

  if (phase !== "shatter" && phase !== "revealed") return null;

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={materialRef}
          size={0.045}
          vertexColors
          transparent
          opacity={1}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      <group ref={iconGroupRef} scale={[0.001, 0.001, 0.001]}>
        <mesh castShadow>
          <extrudeGeometry args={[folderShape, { depth: 0.08, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 2 }]} />
          <meshStandardMaterial color="#c9a35f" roughness={0.45} metalness={0.2} />
        </mesh>
      </group>

      <group ref={checkGroupRef} scale={[0.001, 0.001, 0.001]} position={[0, -0.02, 0.1]}>
        <mesh position={[-0.08, 0, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <boxGeometry args={[0.22, 0.06, 0.06]} />
          <meshStandardMaterial color="#1a1e27" roughness={0.5} />
        </mesh>
        <mesh position={[0.08, 0.09, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
          <boxGeometry args={[0.34, 0.06, 0.06]} />
          <meshStandardMaterial color="#1a1e27" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}
