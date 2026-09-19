"use client";

import { useEffect, useRef, useState } from "react";
import { GraduationCap, ScrollText, Flower2, Mail, MapPin } from "lucide-react";
import { readGuest } from "@/lib/guestStorage";
import CountdownTimer from "@/components/invitation/CountdownTimer";
import WishesBook from "@/components/invitation/WishesBook";
import RsvpForm from "@/components/invitation/RsvpForm";
import "./invitation.css";

const MAP_QUERY = encodeURIComponent("Hội trường Lễ Tốt Nghiệp, 123 Đường ABC, Quận 1, TP.HCM");

export default function InvitationPage() {
  const [nickname, setNickname] = useState("Bạn");
  const [typedNickname, setTypedNickname] = useState("");
  const [gender, setGender] = useState<"Nam" | "Nữ" | "">("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // One-time read of a client-only external store (localStorage) after
    // mount, so the static/server-rendered default stays hydration-safe.
    const guest = readGuest();
    if (guest.nickname.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNickname(guest.nickname.trim());
    }
    setGender(guest.gender || "Nam");
  }, []);

  useEffect(() => {
    if (typingTimer.current) clearInterval(typingTimer.current);
    // Resets the typed text whenever `nickname` changes so the typewriter
    // restarts from scratch for the newly loaded name.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTypedNickname("");
    let index = 0;

    typingTimer.current = setInterval(() => {
      index += 1;
      setTypedNickname(nickname.slice(0, index));
      if (index >= nickname.length && typingTimer.current) {
        clearInterval(typingTimer.current);
      }
    }, 85);

    return () => {
      if (typingTimer.current) clearInterval(typingTimer.current);
    };
  }, [nickname]);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    let ticking = false;

    const updateScroll = () => {
      const progress = Math.min(node.scrollTop / 220, 1);
      setScrollProgress(progress);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    node.addEventListener("scroll", handleScroll, { passive: true });
    return () => node.removeEventListener("scroll", handleScroll);
  }, []);

  const isNam = gender !== "Nữ";

  const visualPrimaryStyle = {
    transform: `translate3d(${(isNam ? -1 : 1) * scrollProgress * 30}px, ${-scrollProgress * 90}px, 0) rotate(${(isNam ? -1 : 1) * scrollProgress * 16}deg) scale(${1 - scrollProgress * 0.15})`,
    opacity: 1 - scrollProgress,
  };

  const visualSecondaryStyle = {
    transform: `translate3d(${(isNam ? 1 : -1) * scrollProgress * 34}px, ${-scrollProgress * 70}px, 0) rotate(${(isNam ? 1 : -1) * scrollProgress * 14}deg) scale(${1 - scrollProgress * 0.18})`,
    opacity: 1 - scrollProgress,
  };

  return (
    <main className="invitation-page">
      <header className="invite-header">
        <div className="invite-header-glow" />

        <div className="header-title-block">
          <div className="graduation-word">Graduation</div>
          <div className="party-word">Party</div>
        </div>

        <div className="header-nickname">
          Thân mời{" "}
          <span className="typed-name">
            {typedNickname}
            <span className="caret" />
          </span>
        </div>

        <span className="header-visual visual-primary" style={visualPrimaryStyle}>
          {isNam ? <GraduationCap size={64} /> : <Flower2 size={60} />}
        </span>
        <span className="header-visual visual-secondary" style={visualSecondaryStyle}>
          {isNam ? <ScrollText size={54} /> : <Mail size={50} />}
        </span>
      </header>

      <div className="invite-scroll" ref={scrollRef}>
        <article className="invite-card">
          <p className="card-index">01</p>
          <h2 className="card-title">Lời Mời Thân Mật</h2>
          <p className="card-kicker">TRÂN TRỌNG KÍNH MỜI</p>
          <p className="card-body">
            Gửi <strong>{nickname}</strong>, mình rất vui mừng được mời bạn đến chung vui trong
            ngày tốt nghiệp — một cột mốc quan trọng sau bao nỗ lực. Sự hiện diện của bạn sẽ là
            món quà ý nghĩa nhất.
          </p>
          <p className="card-signoff">— Trân trọng —</p>
        </article>

        <article className="invite-card">
          <p className="card-index">02</p>
          <h2 className="card-title">Thời Gian &amp; Địa Điểm</h2>
          <div className="event-detail-row">
            <span className="event-detail-label">Thời gian</span>
            <span>08:00 — 11:30, Thứ Bảy, 15/10/2026</span>
          </div>
          <div className="event-detail-row">
            <span className="event-detail-label">Địa điểm</span>
            <span>Hội trường Lễ Tốt Nghiệp, 123 Đường ABC, Quận 1, TP.HCM</span>
          </div>
          <div className="map-embed">
            <iframe
              title="Bản đồ địa điểm tổ chức"
              src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            className="map-link"
            href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`}
            target="_blank"
            rel="noreferrer"
          >
            <MapPin size={16} /> Xem chỉ đường
          </a>
        </article>

        <article className="invite-card">
          <p className="card-index">03</p>
          <h2 className="card-title">Hướng Dẫn Khách Mời</h2>
          <ul className="guide-list">
            <li>Trang phục lịch sự, khuyến khích tông màu be/vàng đồng để hợp không khí lễ.</li>
            <li>Bãi giữ xe miễn phí ngay cổng chính của hội trường.</li>
            <li>Vui lòng có mặt trước giờ khai mạc 15 phút để ổn định chỗ ngồi.</li>
            <li>Liên hệ hotline 0900 000 000 nếu cần hỗ trợ trong ngày sự kiện.</li>
          </ul>
        </article>

        <article className="invite-card">
          <p className="card-index">04</p>
          <h2 className="card-title">Lịch Trình &amp; Lời Chúc</h2>
          <CountdownTimer />
          <ol className="schedule-list">
            <li>
              <span>08:00</span>Đón khách &amp; ổn định chỗ ngồi
            </li>
            <li>
              <span>08:30</span>Lễ trao bằng tốt nghiệp
            </li>
            <li>
              <span>10:00</span>Phát biểu &amp; chụp ảnh lưu niệm
            </li>
            <li>
              <span>11:00</span>Tiệc nhẹ &amp; giao lưu
            </li>
          </ol>
          <WishesBook defaultName={nickname} />
        </article>

        <article className="invite-card">
          <p className="card-index">05</p>
          <h2 className="card-title">Xác Nhận Tham Dự</h2>
          <p className="card-body">
            Vui lòng cho mình biết bạn có thể đến chung vui trong ngày đặc biệt này không nhé.
          </p>
          <RsvpForm defaultName={nickname} />
        </article>
      </div>
    </main>
  );
}
