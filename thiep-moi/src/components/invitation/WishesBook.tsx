"use client";

import { FormEvent, useEffect, useState } from "react";

type Wish = { name: string; message: string; at: number };

const STORAGE_KEY = "graduationWishes";

export default function WishesBook({ defaultName }: { defaultName: string }) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // One-time read of a client-only external store (localStorage) after
    // mount; the wishes book starts empty on the server/first paint.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setWishes(JSON.parse(raw));
    } catch {
      setWishes([]);
    }
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) return;

    const next = [
      { name: defaultName || "Khách mời", message: message.trim(), at: Date.now() },
      ...wishes,
    ].slice(0, 30);

    setWishes(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setMessage("");
  };

  return (
    <div className="wishes-book">
      <form className="wishes-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="Gửi lời chúc của bạn..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Gửi lời chúc</button>
      </form>

      <div className="wishes-list">
        {wishes.length === 0 && (
          <p className="wishes-empty">Hãy là người đầu tiên gửi lời chúc nhé!</p>
        )}
        {wishes.map((wish) => (
          <div className="wish-item" key={wish.at}>
            <span className="wish-name">{wish.name}</span>
            <p className="wish-message">{wish.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
