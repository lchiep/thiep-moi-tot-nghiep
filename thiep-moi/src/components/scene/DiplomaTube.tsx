"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { useSceneStore } from "./store";
import { createEmblemTexture } from "@/lib/emblemTexture";
import { createCurvedPlaneGeometry } from "@/lib/curvedPlane";

const GOLD = "#c9a35f";
const TUBE_DARK = "#1b2029";
const PAPER = "#f2ead9";

export default function DiplomaTube() {
  const phase = useSceneStore((s) => s.phase);
  const setPhase = useSceneStore((s) => s.setPhase);

  const tubeGroup = useRef<THREE.Group>(null!);
  // Everything metal (body/base/rings/cap) lives in its own sub-group so it
  // can sink away and be switched off independently of the paper, which
  // stays a sibling and keeps its world position untouched during zoom.
  const hardwareGroup = useRef<THREE.Group>(null!);
  const bodyMat = useRef<THREE.MeshPhysicalMaterial>(null!);
  const baseMat = useRef<THREE.MeshPhysicalMaterial>(null!);
  const ringTopMat = useRef<THREE.MeshStandardMaterial>(null!);
  const ringBottomMat = useRef<THREE.MeshStandardMaterial>(null!);
  const capGroup = useRef<THREE.Group>(null!);
  const capMat = useRef<THREE.MeshPhysicalMaterial>(null!);
  const emblemMat = useRef<THREE.MeshStandardMaterial>(null!);

  const paperRoll = useRef<THREE.Mesh>(null!);
  const paperRollMat = useRef<THREE.MeshStandardMaterial>(null!);
  const paperFlat = useRef<THREE.Mesh>(null!);
  const paperFlatMat = useRef<THREE.MeshStandardMaterial>(null!);

  const emblemTexture = useMemo(() => createEmblemTexture(), []);
  const paperGeometry = useMemo(
    () => createCurvedPlaneGeometry(1.05, 1.5, 24, 24, 0),
    []
  );

  const hasOpened = useRef(false);
  const idleT = useRef(0);

  // idle bob + slow spin, eases out once the piece has been opened
  useFrame((_, delta) => {
    idleT.current += delta;
    // Only the idle/opening/emerged phases own the group's transform via
    // this per-frame bob+spin. During zooming/revealed, GSAP takes sole
    // ownership of tubeGroup's position/rotation — writing to it here too
    // would fight the tween every frame.
    const settling = phase === "idle" || phase === "opening" || phase === "emerged";
    if (settling && tubeGroup.current) {
      const settle = phase === "idle" ? 1 : 0.15;
      tubeGroup.current.position.y = Math.sin(idleT.current * 1.1) * 0.035 * settle;
      if (phase === "idle") {
        tubeGroup.current.rotation.y += delta * 0.12;
      }
    }
    if (phase === "emerged" && paperFlat.current) {
      paperFlat.current.position.y =
        1.05 + Math.sin(idleT.current * 1.4) * 0.03;
      paperFlat.current.rotation.z = Math.sin(idleT.current * 0.9) * 0.02;
    }
  });

  useEffect(() => {
    if (phase !== "opening" || hasOpened.current) return;
    hasOpened.current = true;

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => {
        // fully retire the rolled-scroll mesh rather than relying on
        // opacity 0 alone — avoids any stray silhouette from a transparent
        // mesh still being depth-tested behind the flat card.
        paperRoll.current.visible = false;
        setPhase("emerged");
      },
    });

    // cap unseats, tilts and swings aside like a lid being lifted off
    tl.to(capGroup.current.position, { y: 1.5, duration: 0.7 }, 0)
      .to(capGroup.current.rotation, { x: -0.55, z: 0.4, duration: 1.0 }, 0.05)
      .to(capGroup.current.position, { x: 0.62, z: 0.18, duration: 1.0 }, 0.15)
      // the rolled scroll rises up out of the tube's mouth
      .to(
        paperRoll.current.position,
        { y: 1.05, duration: 0.55, ease: "power3.out" },
        0.4
      )
      .to(paperRoll.current.rotation, { z: 0.15, duration: 0.55 }, 0.4)
      // crossfade: rolled scroll -> flat unfurled card
      .to(paperRollMat.current, { opacity: 0, duration: 0.3 }, 0.92)
      .to(paperRoll.current.scale, { y: 0.3, duration: 0.3 }, 0.92)
      .fromTo(
        paperFlat.current.scale,
        { x: 0.55, y: 0.4, z: 1 },
        { x: 1, y: 1, z: 1, duration: 0.55, ease: "back.out(1.5)" },
        0.9
      )
      .to(paperFlatMat.current, { opacity: 1, duration: 0.5 }, 0.9)
      .to(paperFlat.current.rotation, { x: -0.1, y: 0, duration: 0.6 }, 0.9);
  }, [phase, setPhase]);

  useEffect(() => {
    if (phase !== "zooming") return;

    // The idle spin can have accumulated many full turns by the time the
    // user opens the tube; collapse to the equivalent angle in [-π, π] so
    // straightening back to 0 always takes the short way round.
    tubeGroup.current.rotation.y = THREE.MathUtils.euclideanModulo(
      tubeGroup.current.rotation.y + Math.PI,
      Math.PI * 2
    ) - Math.PI;

    const tl = gsap.timeline();
    // the metal hardware fades and sinks away — it's a sibling of the
    // paper now, so the paper's own position needs no counter-animation.
    tl.to(
      [
        bodyMat.current,
        baseMat.current,
        capMat.current,
        emblemMat.current,
        ringTopMat.current,
        ringBottomMat.current,
      ],
      { opacity: 0, duration: 0.5, ease: "power1.in" },
      0
    )
      .to(
        hardwareGroup.current.position,
        { y: -0.7, duration: 0.7, ease: "power1.in" },
        0
      )
      .to(
        tubeGroup.current.rotation,
        { y: 0, duration: 0.9, ease: "power2.out" },
        0
      )
      // face the card flat toward the camera for a clean, centred reveal
      .to(
        paperFlat.current.rotation,
        { x: 0, y: 0, z: 0, duration: 0.9, ease: "power2.out" },
        0
      )
      .call(() => {
        hardwareGroup.current.visible = false;
      });
  }, [phase]);

  const openTube = () => {
    if (phase === "idle") setPhase("opening");
  };
  const openPaper = () => {
    if (phase === "emerged") setPhase("zooming");
  };

  return (
    <group ref={tubeGroup} position={[0, 0, 0]}>
    <group ref={hardwareGroup}>
      {/* tube body */}
      <mesh castShadow receiveShadow onClick={openTube} position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.42, 0.46, 1.5, 48, 1, true]} />
        <meshPhysicalMaterial
          ref={bodyMat}
          color={TUBE_DARK}
          metalness={0.75}
          roughness={0.32}
          clearcoat={0.4}
          clearcoatRoughness={0.3}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* tube base cap */}
      <mesh castShadow receiveShadow position={[0, -0.36, 0]} onClick={openTube}>
        <cylinderGeometry args={[0.47, 0.47, 0.1, 48]} />
        <meshPhysicalMaterial
          ref={baseMat}
          color={TUBE_DARK}
          metalness={0.8}
          roughness={0.3}
          transparent
        />
      </mesh>
      {/* gold trim rings */}
      <mesh position={[0, 0.98, 0]} onClick={openTube}>
        <torusGeometry args={[0.435, 0.02, 16, 48]} />
        <meshStandardMaterial
          ref={ringTopMat}
          color={GOLD}
          metalness={1}
          roughness={0.25}
          transparent
        />
      </mesh>
      <mesh position={[0, -0.02, 0]} onClick={openTube}>
        <torusGeometry args={[0.435, 0.015, 16, 48]} />
        <meshStandardMaterial
          ref={ringBottomMat}
          color={GOLD}
          metalness={1}
          roughness={0.25}
          transparent
        />
      </mesh>

      {/* cap group: lifts off and swings aside on open */}
      <group ref={capGroup} position={[0, 1.12, 0]}>
        <mesh castShadow onClick={openTube}>
          <cylinderGeometry args={[0.47, 0.44, 0.26, 48]} />
          <meshPhysicalMaterial
            ref={capMat}
            color={TUBE_DARK}
            metalness={0.75}
            roughness={0.3}
            clearcoat={0.4}
            transparent
          />
        </mesh>
        <mesh position={[0, 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]} onClick={openTube}>
          <circleGeometry args={[0.34, 48]} />
          <meshStandardMaterial
            ref={emblemMat}
            map={emblemTexture}
            metalness={0.4}
            roughness={0.4}
            transparent
          />
        </mesh>
      </group>
    </group>

      {/* rolled invitation scroll, hidden inside the tube until opened */}
      <mesh ref={paperRoll} position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.58, 32, 1, true]} />
        <meshStandardMaterial
          ref={paperRollMat}
          color={PAPER}
          roughness={0.9}
          metalness={0}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* the unfurled flat invitation card */}
      <mesh
        ref={paperFlat}
        geometry={paperGeometry}
        position={[0, 1.05, 0.05]}
        scale={[0.001, 0.001, 1]}
        onClick={openPaper}
      >
        <meshStandardMaterial
          ref={paperFlatMat}
          color={PAPER}
          roughness={0.85}
          metalness={0}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>

    </group>
  );
}
