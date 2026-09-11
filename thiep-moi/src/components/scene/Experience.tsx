"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, Sparkles } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import DiplomaTube from "./DiplomaTube";
import { useSceneStore } from "./store";

const BASE_CAMERA = new THREE.Vector3(0, 1.15, 4.6);
const LOOK_TARGET = new THREE.Vector3(0, 1.05, 0);

function CameraRig() {
  const { camera, pointer } = useThree();
  const phase = useSceneStore((s) => s.phase);

  useEffect(() => {
    if (phase !== "zooming") return;
    // The card is ~1.5 units tall; at fov 32 a distance of ~3.3 frames it
    // filling most (not all) of the viewport — enough to feel like a push-in
    // without clipping its edges.
    gsap.to(camera.position, {
      x: 0,
      y: 1.05,
      z: 3.3,
      duration: 1.5,
      ease: "power2.inOut",
      onComplete: () => useSceneStore.getState().setPhase("revealed"),
    });
  }, [phase, camera]);

  useFrame(() => {
    const interactive = phase === "idle" || phase === "opening" || phase === "emerged";
    if (interactive) {
      const px = pointer.x * 0.35;
      const py = pointer.y * 0.18;
      camera.position.x += (BASE_CAMERA.x + px - camera.position.x) * 0.04;
      camera.position.y += (BASE_CAMERA.y + py - camera.position.y) * 0.04;
    }
    // keep the card centred in frame even while GSAP is tweening the
    // camera's own position during the zoom-in.
    camera.lookAt(LOOK_TARGET);
  });

  return null;
}

export default function Experience() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const phase = useSceneStore((s) => s.phase);
  const showGround = phase !== "zooming" && phase !== "revealed";

  return (
    <div ref={canvasRef} className="absolute inset-0">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: BASE_CAMERA.toArray(), fov: 32, near: 0.1, far: 30 }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[2.4, 4, 2.2]}
          intensity={1.5}
          color="#ffdca8"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={1}
          shadow-camera-far={8}
        />
        <directionalLight position={[-3, 2, -2.5]} intensity={0.45} color="#6f9cff" />
        <pointLight position={[0, 1.6, 1.2]} intensity={0.4} color="#e4c78a" distance={4} />

        {/* Procedural (Lightformer-based) environment — no external HDR
            fetch, so metal reflections never depend on network access. */}
        <Environment resolution={256} frames={1}>
          <group rotation={[0, 0.6, 0]}>
            <Lightformer
              intensity={4}
              color="#ffe3b0"
              position={[0, 3, -4]}
              scale={[6, 3, 1]}
            />
            <Lightformer
              intensity={2}
              color="#87a9ff"
              position={[-4, 2, 2]}
              rotation-y={Math.PI / 2}
              scale={[4, 3, 1]}
            />
            <Lightformer
              intensity={2.5}
              color="#ffffff"
              position={[4, 1.5, 2]}
              rotation-y={-Math.PI / 2}
              scale={[4, 3, 1]}
            />
            <Lightformer
              intensity={1.5}
              color="#ffffff"
              position={[0, -3, 2]}
              rotation-x={Math.PI / 2}
              scale={[6, 4, 1]}
            />
          </group>
        </Environment>
        {showGround && (
          <Sparkles
            count={36}
            scale={[3.2, 2.4, 3.2]}
            size={2.2}
            speed={0.22}
            color="#e4c78a"
            opacity={0.32}
          />
        )}

        <DiplomaTube />

        {showGround && (
          <ContactShadows
            position={[0, -0.42, 0]}
            opacity={0.55}
            scale={6}
            blur={2.6}
            far={2}
            color="#000000"
          />
        )}

        <CameraRig />
      </Canvas>
    </div>
  );
}
