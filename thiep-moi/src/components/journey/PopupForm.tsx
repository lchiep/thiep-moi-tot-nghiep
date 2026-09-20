"use client";

import { FormEvent, useMemo, useState } from "react";
import {
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

export default function PopupForm({
  onSubmit,
}: {
  onSubmit: (data: GuestFormData & { gender: Gender }) => void;
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
      <div className="leaf-shadow leaf-shadow-one" />
      <div className="leaf-shadow leaf-shadow-two" />

      <section className="form-popup">
        <div className="popup-header">
          <div className="header-shine" />
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

          <div className="field">
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

          <div className="field">
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

          <div className="field">
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

          <div className="field">
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

          <div className="field">
            <label>Ngày sinh</label>
            <div className="input-glass">
              <DatePickerField
                value={form.dob}
                onChange={(value) => updateField("dob", value)}
                placeholder="Chọn ngày sinh"
              />
            </div>
          </div>

          <div className="field">
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

          <div className="field">
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
          <div className="drop-highlight" />
        </div>
        <div className="water-drop drop-two">
          <div className="drop-highlight" />
        </div>
        <div className="water-drop drop-three">
          <div className="drop-highlight" />
        </div>
        <div className="water-drop drop-four">
          <div className="drop-highlight" />
        </div>
        <div className="water-drop drop-five">
          <div className="drop-highlight" />
        </div>

        <div className="sparkle sparkle-one">✦</div>
        <div className="sparkle sparkle-two">✦</div>
        <div className="sparkle sparkle-three">✦</div>
      </section>
    </>
  );
}
