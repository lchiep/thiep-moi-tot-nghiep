"use client";

import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
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

// A single natural branch shadow crossing the card's top-right corner,
// with one moderate leaf cluster (not leaves scattered along the whole
// branch -- that read as too dense/dark). Two independent Framer Motion
// loops layer on top of the static SVG: the whole branch sways slowly
// (like a gust moving the branch itself), while just the leaf cluster
// flutters a bit faster and out of phase, so it reads as wind moving
// through real foliage rather than one rigid shape rotating in place.
function BranchShadow() {
  return (
    <svg
      className="branch-shadow-svg"
      viewBox="0 0 190 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <motion.g
        style={{ transformOrigin: "90% 15%" }}
        animate={{ rotate: [-3, 3.5, -3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Pushed down ~55px from the raw path coordinates below so the
            leaf cluster clears the popup header (z-index 5, opaque over
            the card's top ~58px) and lands visibly over the "Họ và
            tên"/"CCCD" fields instead of being hidden behind it. */}
        <g transform="translate(0 55)">
          <path
            className="branch-line"
            d="M175 0 C 150 40, 165 75, 130 115 S 90 190, 105 230 S 80 265, 65 265"
          />
          <path className="branch-twig" d="M140 100 C 122 93, 102 93, 88 103" />
          <motion.g
            style={{ transformOrigin: "148px 55px" }}
            animate={{ rotate: [-2, 2.2, -2] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          >
            <ellipse className="leaf" cx="160" cy="15" rx="15" ry="6.5" transform="rotate(-25 160 15)" />
            <ellipse className="leaf" cx="145" cy="35" rx="13" ry="6" transform="rotate(20 145 35)" />
            <ellipse className="leaf" cx="155" cy="55" rx="14" ry="6.5" transform="rotate(-40 155 55)" />
            <ellipse className="leaf" cx="125" cy="75" rx="15" ry="7" transform="rotate(15 125 75)" />
            <ellipse className="leaf" cx="140" cy="95" rx="12" ry="5.5" transform="rotate(-15 140 95)" />
          </motion.g>
        </g>
      </motion.g>
    </svg>
  );
}

// Soft, wobbly "jelly" water drop (thạch-style) instead of a rigid glass
// bubble: an outer loop drifts + gently breathes in scale (position/size
// only), an inner loop independently morphs the blob's border-radius
// through a few organic shapes, so it looks like it's jiggling rather
// than just sliding around as a fixed circle.
function JellyDrop({
  className,
  floatX,
  floatY,
  duration,
  delay = 0,
  morphDelay = 0,
}: {
  className: string;
  floatX: number[];
  floatY: number[];
  duration: number;
  delay?: number;
  morphDelay?: number;
}) {
  return (
    <motion.div
      className={`water-drop ${className}`}
      animate={{ x: floatX, y: floatY, scale: [1, 1.05, 0.95, 1.02, 1] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <motion.div
        className="drop-shape"
        animate={{
          borderRadius: [
            "48% 52% 55% 45% / 45% 40% 60% 55%",
            "58% 42% 46% 54% / 52% 58% 42% 48%",
            "45% 55% 52% 48% / 48% 45% 55% 52%",
            "48% 52% 55% 45% / 45% 40% 60% 55%",
          ],
        }}
        transition={{
          duration: duration * 0.55,
          repeat: Infinity,
          ease: "easeInOut",
          delay: morphDelay,
        }}
      >
        <div className="drop-highlight" />
      </motion.div>
    </motion.div>
  );
}

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
        <BranchShadow />

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

        <JellyDrop
          className="drop-one"
          floatX={[0, 38, -30, 46, 0]}
          floatY={[0, -46, 32, 40, 0]}
          duration={13}
        />
        <JellyDrop
          className="drop-two"
          floatX={[0, 52, 20, 0]}
          floatY={[0, 34, 70, 0]}
          duration={15}
          delay={0.4}
          morphDelay={0.5}
        />
        <JellyDrop
          className="drop-three"
          floatX={[0, -48, -70, 0]}
          floatY={[0, -58, 10, 0]}
          duration={17}
          delay={0.8}
          morphDelay={1}
        />
        <JellyDrop
          className="drop-four"
          floatX={[0, 40, -24, 0]}
          floatY={[0, -48, -20, 0]}
          duration={11}
          delay={0.2}
          morphDelay={0.3}
        />
        <JellyDrop
          className="drop-five"
          floatX={[0, -34, 30, 0]}
          floatY={[0, 44, 20, 0]}
          duration={9.5}
          delay={0.6}
          morphDelay={0.2}
        />

        <div className="sparkle sparkle-one">✦</div>
        <div className="sparkle sparkle-two">✦</div>
        <div className="sparkle sparkle-three">✦</div>
      </section>
    </>
  );
}
