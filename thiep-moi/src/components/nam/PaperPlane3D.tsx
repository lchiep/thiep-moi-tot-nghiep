"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { useNamStore } from "./store";
import { createLetterTexture } from "./textTexture";

const PAPER = "#f8f2e2";
const PAPER_SHADE = "#e6ddc8";

/** Một cánh của máy bay giấy — tam giác phẳng, gập lên theo góc dihedral
 * quanh trục X cục bộ (đường sống máy bay nằm tại z=0 nên bất biến khi
 * xoay quanh X, giống hệt cách gập giấy thật). */
function useWingGeometry(mirror: 1 | -1) {
  return useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array([
      0.52, 0, 0,
      -0.47, 0, mirror * 0.34,
      -0.19, 0, 0,
    ]);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.computeVertexNormals();
    return geo;
  }, [mirror]);
}

export default function PaperPlane3D() {
  const phase = useNamStore((s) => s.phase);
  const setPhase = useNamStore((s) => s.setPhase);
  const guestName = useNamStore((s) => s.guestName);
  const { viewport } = useThree();

  const groupRef = useRef<THREE.Group>(null!);
  const rightWingRef = useRef<THREE.Mesh>(null!);
  const leftWingRef = useRef<THREE.Mesh>(null!);
  const letterRef = useRef<THREE.Mesh>(null!);
  const wingsMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const wingsMatRef2 = useRef<THREE.MeshStandardMaterial>(null!);
  const hasFlownIn = useRef(false);
  const idleT = useRef(0);

  const rightGeo = useWingGeometry(1);
  const leftGeo = useWingGeometry(-1);
  const letterTexture = useMemo(() => createLetterTexture(guestName), [guestName]);

  useEffect(() => {
    if (phase !== "planeIn" || hasFlownIn.current) return;
    hasFlownIn.current = true;

    const g = groupRef.current;
    gsap.set(g.position, { x: viewport.width * 0.85, y: viewport.height * 0.18, z: -0.6 });
    // rotation.x tilts the (horizontal) wing plane toward the camera —
    // without it the plane is viewed almost edge-on and reads as a flat
    // sliver instead of a recognizable airplane silhouette.
    gsap.set(g.rotation, { x: -0.55, y: -0.9, z: 0.25 });
    gsap.set(g.scale, { x: 0.5, y: 0.5, z: 0.5 });
    gsap.set(rightWingRef.current.rotation, { x: -0.55 });
    gsap.set(leftWingRef.current.rotation, { x: 0.55 });
    gsap.set(letterRef.current.scale, { x: 0.001, y: 0.001, z: 0.001 });
    if (wingsMatRef.current) wingsMatRef.current.opacity = 1;
    if (wingsMatRef2.current) wingsMatRef2.current.opacity = 1;

    const tl = gsap.timeline({ onComplete: () => setPhase("letter") });

    // arc flight in
    tl.to(g.position, {
      x: viewport.width * 0.18,
      y: viewport.height * 0.06,
      z: 0.1,
      duration: 0.62,
      ease: "power2.out",
    })
      .to(g.rotation, { x: -0.35, y: -0.2, z: 0.05, duration: 0.62, ease: "power2.out" }, "<")
      .to(g.scale, { x: 0.72, y: 0.72, z: 0.72, duration: 0.62, ease: "power2.out" }, "<")
      .to(g.position, { x: 0, y: 0, z: 0, duration: 0.5, ease: "power3.out" })
      .to(g.rotation, { x: -0.22, y: 0, z: 0, duration: 0.5, ease: "power3.out" }, "<")
      .to(g.scale, { x: 0.85, y: 0.85, z: 0.85, duration: 0.5, ease: "power3.out" }, "<")
      .to({}, { duration: 0.2 })
      // unfold: dihedral flattens, plane levels out to face the camera
      // square-on while the letter face grows in, wings fade
      .to(
        rightWingRef.current.rotation,
        { x: 0, duration: 0.65, ease: "power2.inOut" },
        "unfold"
      )
      .to(leftWingRef.current.rotation, { x: 0, duration: 0.65, ease: "power2.inOut" }, "unfold")
      .to(g.rotation, { x: 0, y: Math.PI * 2, duration: 0.65, ease: "power2.inOut" }, "unfold")
      .to(
        letterRef.current.scale,
        { x: 1, y: 1, z: 1, duration: 0.55, ease: "back.out(1.6)" },
        "unfold+=0.15"
      )
      .to(
        [wingsMatRef.current, wingsMatRef2.current],
        {
          opacity: 0,
          duration: 0.4,
          ease: "power1.in",
          onComplete: () => {
            rightWingRef.current.visible = false;
            leftWingRef.current.visible = false;
          },
        },
        "unfold+=0.25"
      );
  }, [phase, setPhase, viewport]);

  // gentle idle bob once the letter is open, waiting for a tap
  useFrame((_, delta) => {
    if (phase !== "letter" || !groupRef.current) return;
    idleT.current += delta;
    groupRef.current.position.y = Math.sin(idleT.current * 1.1) * 0.04;
    groupRef.current.rotation.z = Math.sin(idleT.current * 0.8) * 0.02;
  });

  if (phase !== "planeIn" && phase !== "letter") return null;

  return (
    <group
      ref={groupRef}
      onClick={() => phase === "letter" && setPhase("shatter")}
      onPointerOver={() => {
        if (phase === "letter" && typeof document !== "undefined") {
          document.body.style.cursor = "pointer";
        }
      }}
      onPointerOut={() => {
        if (typeof document !== "undefined") document.body.style.cursor = "auto";
      }}
    >
      <mesh ref={rightWingRef} geometry={rightGeo} castShadow>
        <meshStandardMaterial
          ref={wingsMatRef}
          color={PAPER}
          emissive="#6b5836"
          emissiveIntensity={0.55}
          roughness={0.65}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
      <mesh ref={leftWingRef} geometry={leftGeo} castShadow>
        <meshStandardMaterial
          ref={wingsMatRef2}
          color={PAPER_SHADE}
          emissive="#5c4f34"
          emissiveIntensity={0.5}
          roughness={0.65}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>

      <mesh ref={letterRef} position={[0, 0, 0.01]}>
        <planeGeometry args={[1.5, 1.31]} />
        <meshStandardMaterial map={letterTexture} roughness={0.75} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
