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

// A dense branch-with-leaves shadow crossing the card, matching the
// reference mockup's density (a couple dozen small leaves along one
// flowing branch, not a sparse sprig). The real photo behind the card
// only has a small leaf accent in one corner -- to get this much denser
// look across the card, this is drawn (pure SVG, no image asset needed)
// and layered as a decoration on top of the persisted photo, sitting
// flush inside the card's own box so it can't cause overflow.
function BranchShadow({ className }: { className: string }) {
  return (
    <svg
      className={`branch-shadow-svg ${className}`}
      viewBox="0 0 220 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g className="branch-shadow-sway">
        <path
          d="M185 0 C 160 40, 175 70, 140 110 S 100 190, 120 230 S 90 320, 105 370 S 130 440, 110 490"
          stroke="black"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M150 95 C 132 88, 112 88, 98 98"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M108 260 C 90 254, 72 256, 60 266"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <ellipse cx="170" cy="15" rx="16" ry="7" transform="rotate(-25 170 15)" />
        <ellipse cx="155" cy="35" rx="14" ry="6.5" transform="rotate(20 155 35)" />
        <ellipse cx="165" cy="55" rx="15" ry="7" transform="rotate(-40 165 55)" />
        <ellipse cx="135" cy="75" rx="17" ry="7.5" transform="rotate(15 135 75)" />
        <ellipse cx="150" cy="95" rx="13" ry="6" transform="rotate(-15 150 95)" />
        <ellipse cx="115" cy="115" rx="16" ry="7" transform="rotate(35 115 115)" />
        <ellipse cx="130" cy="140" rx="14" ry="6.5" transform="rotate(-30 130 140)" />
        <ellipse cx="100" cy="160" rx="15" ry="7" transform="rotate(10 100 160)" />
        <ellipse cx="120" cy="185" rx="17" ry="7.5" transform="rotate(-20 120 185)" />
        <ellipse cx="95" cy="205" rx="14" ry="6.5" transform="rotate(30 95 205)" />
        <ellipse cx="115" cy="230" rx="16" ry="7" transform="rotate(-10 115 230)" />
        <ellipse cx="85" cy="250" rx="13" ry="6" transform="rotate(25 85 250)" />
        <ellipse cx="105" cy="275" rx="15" ry="7" transform="rotate(-35 105 275)" />
        <ellipse cx="80" cy="300" rx="14" ry="6.5" transform="rotate(15 80 300)" />
        <ellipse cx="100" cy="325" rx="16" ry="7" transform="rotate(-15 100 325)" />
        <ellipse cx="75" cy="350" rx="13" ry="6" transform="rotate(20 75 350)" />
        <ellipse cx="95" cy="375" rx="15" ry="7" transform="rotate(-25 95 375)" />
        <ellipse cx="110" cy="410" rx="14" ry="6.5" transform="rotate(10 110 410)" />
        <ellipse cx="90" cy="440" rx="13" ry="6" transform="rotate(-20 90 440)" />
        <ellipse cx="105" cy="470" rx="15" ry="7" transform="rotate(15 105 470)" />
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
        <BranchShadow className="branch-shadow-one" />

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
