"use client";

import { useState } from "react";
import { useNamStore } from "./store";

/**
 * Popup thu thập thông tin khách — nội dung field còn placeholder (chưa
 * chốt), chỉ đủ để demo trọn luồng: nhập tên -> xác nhận -> sang cảnh
 * đóng dấu. `forwardRef`-free: cha (StampScene) đọc vị trí qua id DOM.
 */
export default function PopupForm() {
  const phase = useNamStore((s) => s.phase);
  const setGuestName = useNamStore((s) => s.setGuestName);
  const setPhase = useNamStore((s) => s.setPhase);
  const guestName = useNamStore((s) => s.guestName);
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim()) return;
    setGuestName(value.trim());
    setPhase("stamping");
  };

  // Once stamping starts, the form fields freeze and show the entered
  // name as static text so the stamp visually lands on a "filled" card.
  const frozen = phase !== "form";

  return (
    <div
      id="nam-popup-card"
      className="glass-surface fade-in-up w-[min(88vw,360px)] rounded-3xl px-7 py-8"
    >
      <p className="mb-1 text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
        Xác nhận tham dự
      </p>
      <h2 className="mb-5 text-lg font-semibold text-[var(--ink)]">
        Thông tin khách mời
      </h2>

      <label className="mb-1 block text-xs text-[var(--ink-dim)]">
        Họ và tên
      </label>
      {frozen ? (
        <div className="glass-inset mb-6 rounded-xl px-4 py-3 text-[var(--ink)]">
          {guestName || value}
        </div>
      ) : (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Nhập tên của bạn"
          className="glass-inset mb-6 w-full rounded-xl px-4 py-3 text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)]"
        />
      )}

      {!frozen && (
        <button
          onClick={submit}
          disabled={!value.trim()}
          className="w-full rounded-xl bg-[var(--gold)] px-4 py-3 text-sm font-semibold text-[#1a1e27] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          Xác nhận
        </button>
      )}
    </div>
  );
}
