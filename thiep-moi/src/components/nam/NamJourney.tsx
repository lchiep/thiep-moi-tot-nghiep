"use client";

import { useNamStore } from "./store";
import NamCanvas from "./NamCanvas";
import PopupStage from "./PopupStage";

/**
 * Luồng nhánh Nam, đầy đủ 1 chặng liền mạch (không ngắt trang):
 *   popup -> đóng dấu (3D) -> popup trượt trái -> máy bay giấy 3D bay vào
 *   & mở thành thư -> chạm vào thư -> vỡ thành hạt, tụ lại thành icon thư
 *   mục 3D -> bàn giao sang trang chính.
 *
 * Một canvas WebGL duy nhất (NamCanvas) sống suốt hành trình; popup vẫn
 * là DOM thật (input cần gõ được) nổi lớp trên canvas.
 */
export default function NamJourney() {
  const phase = useNamStore((s) => s.phase);
  const setPhase = useNamStore((s) => s.setPhase);

  const showPopup = phase === "form" || phase === "stamping" || phase === "stamped";

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0">
        <NamCanvas />
      </div>

      {showPopup && (
        <div className="absolute inset-0">
          <PopupStage onSlideOutComplete={() => setPhase("planeIn")} />
        </div>
      )}

      {phase === "letter" && (
        <div className="pointer-events-none absolute inset-x-0 bottom-16 flex justify-center">
          <p className="hint-pulse text-xs uppercase tracking-[0.3em] text-[var(--ink-dim)]">
            Chạm vào thư để mở
          </p>
        </div>
      )}

      {phase === "revealed" && (
        <div className="absolute inset-x-0 bottom-16 flex justify-center px-6 text-center">
          <p className="fade-in-up text-sm text-[var(--ink-dim)]">
            Trang mời chính thức — nội dung sẽ được cập nhật.
          </p>
        </div>
      )}
    </div>
  );
}
