"use client";

import { FormEvent, useState } from "react";

const STORAGE_KEY = "graduationRsvp";

type Attendance = "yes" | "no" | "";

export default function RsvpForm({ defaultName }: { defaultName: string }) {
  const [attendance, setAttendance] = useState<Attendance>("");
  const [guests, setGuests] = useState(1);
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!attendance) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ name: defaultName, attendance, guests, at: Date.now() }),
    );
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="rsvp-confirmed">
        <p>
          {attendance === "yes"
            ? "Cảm ơn bạn đã xác nhận tham dự! Hẹn gặp bạn tại buổi lễ."
            : "Cảm ơn bạn đã phản hồi. Rất tiếc vì không thể gặp bạn lần này."}
        </p>
        <button type="button" onClick={() => setConfirmed(false)}>
          Sửa lại phản hồi
        </button>
      </div>
    );
  }

  return (
    <form className="rsvp-form" onSubmit={handleSubmit}>
      <div className="rsvp-options">
        <button
          type="button"
          className={attendance === "yes" ? "rsvp-option active yes" : "rsvp-option yes"}
          onClick={() => setAttendance("yes")}
        >
          Có, tôi sẽ tham dự
        </button>
        <button
          type="button"
          className={attendance === "no" ? "rsvp-option active no" : "rsvp-option no"}
          onClick={() => setAttendance("no")}
        >
          Rất tiếc, không thể tham dự
        </button>
      </div>

      {attendance === "yes" && (
        <label className="rsvp-guests">
          Số người đi cùng
          <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      )}

      <button type="submit" className="rsvp-submit" disabled={!attendance}>
        Gửi xác nhận
      </button>
    </form>
  );
}
