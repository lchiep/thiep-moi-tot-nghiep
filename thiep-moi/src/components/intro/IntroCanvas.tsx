"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import GraduationProps3D from "./GraduationProps3D";
import HintBubble3D from "./HintBubble3D";

/**
 * Canvas WebGL nền trắng cho màn mở đầu — tách riêng khỏi NamCanvas (nền
 * tối) vì bối cảnh màu hoàn toàn khác; canvas này chỉ tồn tại một lần rồi
 * unmount hẳn khi bàn giao sang popup, nên không lặp lại vấn đề tạo/huỷ
 * context liên tục từng gặp ở bản cũ.
 */
export default function IntroCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.3, 4.2], fov: 32 }}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={["#ffffff"]} />

      <ambientLight intensity={1.1} color="#ffffff" />
      <directionalLight
        position={[2.6, 3.4, 2.4]}
        intensity={1.4}
        color="#fff8ec"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-2, 1.4, -1.2]} intensity={0.4} color="#c9a35f" />

      <GraduationProps3D />
      <HintBubble3D />

      <ContactShadows position={[0, -0.9, 0]} opacity={0.28} scale={4} blur={2.4} far={1.2} />
    </Canvas>
  );
}
