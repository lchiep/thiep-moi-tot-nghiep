"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useIntroStore } from "./introStore";
import IntroCanvas from "./IntroCanvas";

/**
 * Màn mở đầu (hook), chạy trước popup chính: nền trắng -> chữ chào mừng
 * -> mũ + bằng tốt nghiệp trồi lên -> bong bóng gợi ý chạm -> vỡ thành
 * sao -> phủ tối dần rồi bàn giao sang popup (nền tối) của trang chính.
 */
export default function IntroJourney({ onComplete }: { onComplete: () => void }) {
  const phase = useIntroStore((s) => s.phase);
  const setPhase = useIntroStore((s) => s.setPhase);

  const overlayRef = useRef<HTMLDivElement>(null!);
  const startedTimers = useRef(false);
  const startedFade = useRef(false);
  const calledComplete = useRef(false);

  // scripted opening beats: blank -> welcome -> rise
  useEffect(() => {
    if (startedTimers.current) return;
    startedTimers.current = true;

    const t1 = setTimeout(() => setPhase("welcome"), 300);
    const t2 = setTimeout(() => setPhase("rise"), 1650);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [setPhase]);

  // dark crossfade begins partway through the star-burst shatter
  useEffect(() => {
    if (phase !== "shatter" || startedFade.current) return;
    startedFade.current = true;
    gsap.to(overlayRef.current, {
      opacity: 1,
      duration: 1.1,
      delay: 0.6,
      ease: "power1.in",
    });
  }, [phase]);

  useEffect(() => {
    if (phase !== "done" || calledComplete.current) return;
    calledComplete.current = true;
    const t = setTimeout(onComplete, 150);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      <div className="absolute inset-0">
        <IntroCanvas />
      </div>

      {(phase === "blank" || phase === "welcome") && (
        <div className="pointer-events-none absolute inset-x-0 top-[18%] flex justify-center px-6 text-center">
          <p
            className={`text-xl font-semibold text-[#1c2029] transition-opacity duration-700 ${
              phase === "welcome" ? "opacity-100" : "opacity-0"
            }`}
          >
            Chào mừng bạn tham gia
          </p>
        </div>
      )}

      {phase === "hint" && (
        <div className="pointer-events-none absolute inset-x-0 bottom-16 flex justify-center px-6 text-center">
          <p className="hint-pulse text-xs uppercase tracking-[0.3em] text-[#6b7280]">
            Chạm vào mũ tốt nghiệp
          </p>
        </div>
      )}

      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0"
        style={{ background: "#0b0d12", opacity: 0 }}
      />
    </div>
  );
}
