"use client";

import { Canvas } from "@react-three/fiber";
import StampTool3D from "./StampTool3D";
import PaperPlane3D from "./PaperPlane3D";
import ParticleShatter3D from "./ParticleShatter3D";

/**
 * Canvas WebGL 3D duy nhất, sống suốt hành trình Nam — tránh tạo/huỷ
 * context liên tục (từng gây "Context Lost" ở bản ống đựng bằng cũ).
 * Các cảnh con tự ẩn/hiện theo phase trong store.
 */
export default function NamCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.15, 3.4], fov: 34 }}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={["#0b0d12"]} />
      <fog attach="fog" args={["#0b0d12", 4, 9]} />

      <ambientLight intensity={0.8} color="#9aa3b8" />
      <directionalLight
        position={[2.4, 3.2, 2]}
        intensity={2.3}
        color="#fff3dd"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-2.2, 1.2, 2.2]} intensity={0.9} color="#e4c78a" />
      <pointLight position={[0, -1.5, 1.5]} intensity={0.3} color="#5a6bff" />

      <StampTool3D />
      <PaperPlane3D />
      <ParticleShatter3D />
    </Canvas>
  );
}
