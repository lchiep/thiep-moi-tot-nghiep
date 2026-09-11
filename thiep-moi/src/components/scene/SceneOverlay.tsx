"use client";

import { useSceneStore } from "./store";

export default function SceneOverlay() {
  const phase = useSceneStore((s) => s.phase);

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-x-0 top-10 flex justify-center">
        <span className="text-[11px] uppercase tracking-[0.35em] text-[var(--ink-dim)]">
          Lễ Tốt Nghiệp
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-12 flex justify-center px-6">
        {phase === "idle" && (
          <div className="neu-pill hint-pulse rounded-full px-5 py-2.5 text-sm tracking-wide text-[var(--ink-dim)]">
            Chạm vào ống để mở thư mời
          </div>
        )}
        {phase === "emerged" && (
          <div className="neu-pill hint-pulse rounded-full px-5 py-2.5 text-sm tracking-wide text-[var(--ink-dim)]">
            Chạm vào thư để xem lời mời
          </div>
        )}
      </div>

      {phase === "revealed" && (
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="fade-in-up neu-surface pointer-events-auto w-full max-w-md rounded-3xl px-8 py-10 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
              Trang mời chính thức
            </p>
            <h1 className="mb-2 text-2xl font-semibold text-[var(--ink)]">
              Nội dung thiệp mời sẽ ở đây
            </h1>
            <p className="text-sm leading-relaxed text-[var(--ink-dim)]">
              Đây là placeholder cho trang chính — bước tiếp theo sẽ dựng nội
              dung lời mời, tên trường, ngày giờ và địa điểm ngay tại đây,
              tiếp nối liền mạch từ cảnh mở ống vừa rồi.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
