"use client";

import { FormEvent, useState } from "react";
import { PartyPopper, Frown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        {attendance === "yes" ? (
          <PartyPopper className="rsvp-result-icon yes" size={36} />
        ) : (
          <Frown className="rsvp-result-icon no" size={36} />
        )}
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
          <PartyPopper size={16} />
          Có, tôi sẽ tham dự
        </button>
        <button
          type="button"
          className={attendance === "no" ? "rsvp-option active no" : "rsvp-option no"}
          onClick={() => setAttendance("no")}
        >
          <Frown size={16} />
          Rất tiếc, không thể tham dự
        </button>
      </div>

      {attendance === "yes" && (
        <label className="rsvp-guests">
          Số người đi cùng
          <Select value={String(guests)} onValueChange={(v) => setGuests(Number(v))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      )}

      <button type="submit" className="rsvp-submit" disabled={!attendance}>
        Gửi xác nhận
      </button>
    </form>
  );
}
