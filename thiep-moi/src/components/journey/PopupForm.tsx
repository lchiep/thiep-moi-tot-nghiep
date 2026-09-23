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

// A pointed almond/leaf silhouette (not an ellipse -- ellipses read as
// generic blobs/petals, this reads as an actual leaf) centered on its
// own base point so it can be placed + rotated + scaled per instance.
function Leaf({
  cx,
  cy,
  size = 1,
  rotate = 0,
}: {
  cx: number;
  cy: number;
  size?: number;
  rotate?: number;
}) {
  return (
    <path
      className="leaf"
      d="M0 0 C -7 -12 -5 -25 0 -35 C 5 -25 7 -12 0 0 Z"
      transform={`translate(${cx} ${cy}) rotate(${rotate}) scale(${size})`}
    />
  );
}

// A natural branch shadow crossing the card's top-right corner, with a
// full leaf cluster spanning from the top down through the "Họ và
// tên"/CCCD rows -- matching the reference photo's coverage -- then
// thinning to a bare branch lower down. Two independent Framer Motion
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
        {/* Pushed down ~40px from the raw path coordinates below so the
            leaf cluster clears the popup header (z-index 5, opaque over
            the card's top ~58px) and lands visibly over the "Họ và
            tên"/"CCCD" fields instead of being hidden behind it. */}
        <g transform="translate(0 40)">
          <path
            className="branch-line"
            d="M180 -10 C 155 35, 170 70, 132 112 S 92 185, 108 225 S 82 260, 68 260"
          />
          <path className="branch-twig" d="M148 95 C 128 87, 106 88, 90 99" />
          <path className="branch-twig" d="M112 195 C 96 190, 80 192, 68 202" />
          <motion.g
            style={{ transformOrigin: "150px 60px" }}
            animate={{ rotate: [-2.2, 2.4, -2.2] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          >
            <Leaf cx={172} cy={-8} size={1.05} rotate={30} />
            <Leaf cx={158} cy={5} size={0.9} rotate={-20} />
            <Leaf cx={178} cy={18} size={1} rotate={55} />
            <Leaf cx={150} cy={22} size={0.85} rotate={-45} />
            <Leaf cx={165} cy={38} size={1.1} rotate={15} />
            <Leaf cx={135} cy={45} size={0.95} rotate={-60} />
            <Leaf cx={148} cy={62} size={1} rotate={40} />
            <Leaf cx={118} cy={68} size={0.8} rotate={-15} />
            <Leaf cx={128} cy={90} size={0.9} rotate={70} />
            <Leaf cx={100} cy={100} size={0.75} rotate={-35} />
          </motion.g>
          {/* A couple of stray leaves lower down on the otherwise bare
              branch, echoing the reference photo instead of leaving the
              whole lower half completely empty. */}
          <motion.g
            style={{ transformOrigin: "96px 197px" }}
            animate={{ rotate: [1.8, -2, 1.8] }}
            transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          >
            <Leaf cx={96} cy={197} size={0.8} rotate={-25} />
            <Leaf cx={78} cy={210} size={0.65} rotate={40} />
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
