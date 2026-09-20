"use client";

import { useRef, useState } from "react";
import { AlarmClock, MessageCircle, Phone } from "lucide-react";

export default function CallScreen({ onAnswered }: { onAnswered: () => void }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [answered, setAnswered] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);

  const getMaxDrag = () => {
    if (!sliderRef.current) return 0;
    const knobSize = 70;
    return sliderRef.current.offsetWidth - knobSize - 8;
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (answered) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    startX.current = event.clientX;
    currentX.current = dragX;
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || answered) return;
    const delta = event.clientX - startX.current;
    const maxDrag = getMaxDrag();
    const nextX = Math.max(0, Math.min(currentX.current + delta, maxDrag));
    setDragX(nextX);
  };

  const handlePointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    const maxDrag = getMaxDrag();

    if (dragX >= maxDrag * 0.82) {
      setDragX(maxDrag);
      setAnswered(true);
      window.setTimeout(onAnswered, 650);
    } else {
      setDragX(0);
    }
  };

  return (
    <div className="phone-screen">
      <div className="background-image" />
      <div className="dark-overlay" />

      <section className="call-interface">
        <div className="top-actions">
          <button className="glass-action" type="button">
            <span className="icon-circle">
              <AlarmClock size={28} />
            </span>
            <span className="action-label">Nhắc lại</span>
          </button>
          <button className="glass-action" type="button">
            <span className="icon-circle">
              <MessageCircle size={28} />
            </span>
            <span className="action-label">Tin nhắn</span>
          </button>
        </div>

        <div
          ref={sliderRef}
          className={`answer-slider ${dragging ? "is-dragging" : ""} ${
            answered ? "is-answered" : ""
          }`}
        >
          <div className="slider-glow" />
          {!answered && (
            <div
              className="phone-knob"
              style={{ transform: `translateX(${dragX}px)` }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <Phone size={30} />
            </div>
          )}
          <div className="slider-text">
            {answered ? "Đã kết nối" : "Vuốt để xem típ"}
          </div>
          {!answered && <div className="slide-hint">→</div>}
        </div>
      </section>
    </div>
  );
}
