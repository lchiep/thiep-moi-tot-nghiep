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

// Cast-shadow silhouette of a branch with leaves (not a photo — pure SVG so
// it works without an asset), swaying gently like it's catching a breeze.
function BranchShadow({ className }: { className: string }) {
  return (
    <svg
      className={`leaf-branch-svg ${className}`}
      viewBox="0 0 220 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g className="leaf-branch-sway">
        <path
          d="M14 10 C 70 70, 40 150, 90 220 S 150 320, 130 335"
          stroke="black"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M55 90 C 40 80, 20 78, 5 88"
          stroke="black"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M78 165 C 100 155, 118 158, 132 172"
          stroke="black"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <ellipse cx="30" cy="55" rx="20" ry="9" transform="rotate(-35 30 55)" />
        <ellipse cx="10" cy="82" rx="17" ry="8" transform="rotate(-10 10 82)" />
        <ellipse cx="60" cy="35" rx="16" ry="7" transform="rotate(20 60 35)" />
        <ellipse cx="45" cy="115" rx="19" ry="8.5" transform="rotate(-55 45 115)" />
        <ellipse cx="100" cy="130" rx="15" ry="7" transform="rotate(30 100 130)" />
        <ellipse cx="125" cy="180" rx="18" ry="8" transform="rotate(-15 125 180)" />
        <ellipse cx="145" cy="165" rx="14" ry="6.5" transform="rotate(40 145 165)" />
        <ellipse cx="110" cy="250" rx="17" ry="7.5" transform="rotate(-40 110 250)" />
        <ellipse cx="145" cy="290" rx="16" ry="7" transform="rotate(15 145 290)" />
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
        <BranchShadow className="leaf-shadow-one" />
        <BranchShadow className="leaf-shadow-two" />

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
