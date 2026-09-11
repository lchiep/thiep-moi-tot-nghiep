"use client";

import Experience from "./Experience";
import SceneOverlay from "./SceneOverlay";

/**
 * Nhánh Nam — cảnh mở ống đựng bằng tốt nghiệp 3D.
 * idle (chạm để mở nắp) -> opening (nắp bật, thư trồi lên & mở ra)
 * -> emerged (chạm vào thư) -> zooming (camera lao vào thư)
 * -> revealed (bàn giao sang nội dung trang chính).
 */
export default function GraduationReveal() {
  return (
    <div
      className="relative h-dvh w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 120% at 50% 18%, #1a1f2b 0%, #0b0d12 58%, #06070a 100%)",
      }}
    >
      <Experience />
      <SceneOverlay />
    </div>
  );
}
