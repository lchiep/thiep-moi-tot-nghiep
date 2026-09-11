"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useNamStore } from "./store";
import PopupForm from "./PopupForm";
import InkStampMark from "./InkStampMark";

/**
 * Lớp DOM nổi trên canvas 3D: thẻ popup + dấu mực để lại trên giấy (dấu
 * mực là vết phẳng thật trên giấy nên hợp lý khi vẫn là 2D — con dấu và
 * bàn tay bấm xuống mới là khối 3D, nằm trong NamCanvas/StampTool3D).
 * Thời gian hiện dấu được canh khớp với lúc "con dấu" 3D chạm giấy.
 */
export default function PopupStage({ onSlideOutComplete }: { onSlideOutComplete: () => void }) {
  const phase = useNamStore((s) => s.phase);

  const wrapRef = useRef<HTMLDivElement>(null!);
  const inkMarkRef = useRef<HTMLDivElement>(null!);
  const hasRevealed = useRef(false);

  // ink reveals right when the 3D stamp impacts (~0.42s into "stamping")
  useEffect(() => {
    if (phase !== "stamping" || hasRevealed.current) return;
    hasRevealed.current = true;

    const tl = gsap.timeline({ delay: 0.42 });
    tl.fromTo(
      inkMarkRef.current,
      { scale: 0, opacity: 0, rotate: -10 },
      { scale: 1, opacity: 0.9, rotate: -4, duration: 0.32, ease: "back.out(2.2)" }
    ).to(
      wrapRef.current,
      { x: 3, duration: 0.035, yoyo: true, repeat: 7, ease: "none" },
      "<"
    );
  }, [phase]);

  // once stamped, hold briefly then slide the whole popup off to the left
  useEffect(() => {
    if (phase !== "stamped") return;
    const t = setTimeout(() => {
      gsap.to(wrapRef.current, {
        x: "-130%",
        opacity: 0,
        duration: 0.6,
        ease: "power2.in",
        onComplete: onSlideOutComplete,
      });
    }, 900);
    return () => clearTimeout(t);
  }, [phase, onSlideOutComplete]);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div ref={wrapRef} className="relative">
        <PopupForm />
        <div
          ref={inkMarkRef}
          className="pointer-events-none absolute left-1/2 top-[38%] w-28 -translate-x-1/2 -translate-y-1/2"
          style={{ opacity: 0, transform: "scale(0)" }}
        >
          <InkStampMark />
        </div>
      </div>
    </div>
  );
}
