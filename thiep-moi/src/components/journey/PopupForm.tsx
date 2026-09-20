"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  ArrowLeft,
  User,
  Home as HomeIcon,
  Phone,
  CreditCard,
  Mail,
  Star,
  Pencil,
  X,
  Send,
} from "lucide-react";
import type { Gender } from "@/lib/guestStorage";
import { DatePickerField } from "@/components/ui/date-picker";

export type GuestFormData = {
  fullName: string;
  nickname: string;
  phone: string;
  cccd: string;
  gender: Gender | "";
  email: string;
  dob: string;
  hobbies: string;
  description: string;
};

const initialForm: GuestFormData = {
  fullName: "",
  nickname: "",
  phone: "",
  cccd: "",
  gender: "",
  email: "",
  dob: "",
  hobbies: "",
  description: "",
};

// Cast shadow of a window frame (straight mullions) WITH a tree branch and
// leaves visible just outside it, combined into one shadow shape -- like
// sunlight streaming through a window with a plant right outside. Not a
// photo, pure SVG so it works without an asset. The light drifts very
// slowly; the frame and branch themselves don't move.
function WindowShadow({ className }: { className: string }) {
  return (
    <svg
      className={`window-shadow-svg ${className}`}
      viewBox="0 0 220 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g className="window-shadow-drift">
        {/* window mullions */}
        <rect x="70" y="-30" width="11" height="400" transform="rotate(13 76 170)" />
        <rect x="150" y="-30" width="9" height="400" transform="rotate(13 155 170)" />
        <rect x="-30" y="150" width="280" height="10" transform="rotate(13 110 155)" />
        <rect x="205" y="-30" width="8" height="400" transform="rotate(13 209 170)" opacity="0.7" />

        {/* a branch with leaves reaching across the frame, as if a tree is
            just outside the glass */}
        <path
          d="M188 4 C 150 50, 165 110, 120 160 S 90 250, 100 300"
          stroke="black"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <path
          d="M150 90 C 135 82, 118 80, 104 88"
          stroke="black"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <ellipse cx="175" cy="30" rx="17" ry="7.5" transform="rotate(-30 175 30)" />
        <ellipse cx="160" cy="60" rx="15" ry="7" transform="rotate(15 160 60)" />
        <ellipse cx="130" cy="85" rx="16" ry="7" transform="rotate(-45 130 85)" />
        <ellipse cx="108" cy="90" rx="14" ry="6.5" transform="rotate(20 108 90)" />
        <ellipse cx="128" cy="140" rx="17" ry="7.5" transform="rotate(-20 128 140)" />
        <ellipse cx="95" cy="175" rx="15" ry="7" transform="rotate(35 95 175)" />
        <ellipse cx="112" cy="230" rx="16" ry="7" transform="rotate(-30 112 230)" />
        <ellipse cx="90" cy="270" rx="14" ry="6.5" transform="rotate(10 90 270)" />
      </g>
    </svg>
  );
}

export default function PopupForm({
  onSubmit,
  onBack,
}: {
  onSubmit: (data: GuestFormData & { gender: Gender }) => void;
  onBack: () => void;
}) {
  const [form, setForm] = useState<GuestFormData>(initialForm);

  const isComplete = useMemo(() => {
    return (
      form.fullName.trim() !== "" &&
      form.nickname.trim() !== "" &&
      form.phone.trim() !== "" &&
      form.cccd.trim() !== "" &&
      form.gender !== "" &&
      form.email.trim() !== "" &&
      form.dob !== "" &&
      form.hobbies.trim() !== "" &&
      form.description.trim() !== ""
    );
  }, [form]);

  const updateField = <K extends keyof GuestFormData>(
    field: K,
    value: GuestFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isComplete || form.gender === "") return;
    onSubmit({ ...form, gender: form.gender });
  };

  const handleCancel = () => setForm(initialForm);

  return (
    <>
      <div className="background-light light-one" />
      <div className="background-light light-two" />

      <section className="form-popup">
        <WindowShadow className="window-shadow-one" />
        <WindowShadow className="window-shadow-two" />

        <div className="popup-header">
          <div className="header-shine" />
          <button type="button" className="popup-back-button" onClick={onBack} aria-label="Quay lại">
            <ArrowLeft size={19} />
          </button>
          NHẬP THÔNG TIN CỦA BẠN
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="field-row">
            <div className="field">
              <label>Họ và tên</label>
              <div className="input-glass">
                <span className="field-icon">
                  <User size={19} />
                </span>
                <input
                  type="text"
                  placeholder="Họ và tên"
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label>Biệt danh ở nhà</label>
              <div className="input-glass">
                <span className="field-icon">
                  <HomeIcon size={19} />
                </span>
                <input
                  type="text"
                  placeholder="Biệt danh ở nhà"
                  value={form.nickname}
                  onChange={(e) => updateField("nickname", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="field field-full">
            <label>Số điện thoại</label>
            <div className="input-glass">
              <span className="field-icon">
                <Phone size={19} />
              </span>
              <input
                type="tel"
                placeholder="Số điện thoại"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>
          </div>

          <div className="field field-full">
            <label>CCCD</label>
            <div className="input-glass">
              <span className="field-icon">
                <CreditCard size={19} />
              </span>
              <input
                type="text"
                placeholder="Số CCCD"
                value={form.cccd}
                onChange={(e) => updateField("cccd", e.target.value)}
              />
            </div>
          </div>

          <div className="field field-full">
            <label>Giới tính</label>
            <div className="gender-row">
              <button
                type="button"
                className={form.gender === "Nữ" ? "gender active female" : "gender female"}
                onClick={() => updateField("gender", "Nữ")}
              >
                ♀ Nữ
              </button>
              <button
                type="button"
                className={form.gender === "Nam" ? "gender active male" : "gender male"}
                onClick={() => updateField("gender", "Nam")}
              >
                ♂ Nam
              </button>
            </div>
          </div>

          <div className="field field-full">
            <label>Email</label>
            <div className="input-glass">
              <span className="field-icon">
                <Mail size={19} />
              </span>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>
          </div>

          <div className="field field-full">
            <label>Ngày sinh</label>
            <div className="input-glass">
              <DatePickerField
                value={form.dob}
                onChange={(value) => updateField("dob", value)}
                placeholder="Chọn ngày sinh"
              />
            </div>
          </div>

          <div className="field field-full">
            <label>Sở thích</label>
            <div className="input-glass">
              <span className="field-icon">
                <Star size={19} />
              </span>
              <input
                type="text"
                placeholder="Sở thích"
                value={form.hobbies}
                onChange={(e) => updateField("hobbies", e.target.value)}
              />
            </div>
          </div>

          <div className="field field-full">
            <label>Mô tả bản thân</label>
            <div className="textarea-glass">
              <textarea
                placeholder="Mô tả bản thân"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
              <Pencil className="textarea-icon" size={18} />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={!isComplete}
              className={isComplete ? "submit-button ready" : "submit-button"}
            >
              <Send size={17} />
              GỬI THÔNG TIN
            </button>
            <button
              type="button"
              className={isComplete ? "cancel-button active" : "cancel-button"}
              onClick={handleCancel}
            >
              <X size={17} />
              Hủy bỏ
            </button>
          </div>
        </form>

        <div className="water-drop drop-one">
          <div className="drop-shape">
            <div className="drop-highlight" />
          </div>
        </div>
        <div className="water-drop drop-two">
          <div className="drop-shape">
            <div className="drop-highlight" />
          </div>
        </div>
        <div className="water-drop drop-three">
          <div className="drop-shape">
            <div className="drop-highlight" />
          </div>
        </div>
        <div className="water-drop drop-four">
          <div className="drop-shape">
            <div className="drop-highlight" />
          </div>
        </div>
        <div className="water-drop drop-five">
          <div className="drop-shape">
            <div className="drop-highlight" />
          </div>
        </div>

        <div className="sparkle sparkle-one">✦</div>
        <div className="sparkle sparkle-two">✦</div>
        <div className="sparkle sparkle-three">✦</div>
      </section>
    </>
  );
}
