import { create } from "zustand";

/**
 * Màn mở đầu (hook), chạy trước khi vào popup Nam/Nữ:
 *  blank   -> nền trắng trống
 *  welcome -> chữ "Chào mừng bạn tham gia" hiện lên
 *  rise    -> mũ + bằng tốt nghiệp 3D trồi từ dưới lên
 *  hint    -> bong bóng tin nhắn hiện ra, chờ người dùng chạm vào mũ
 *  shatter -> mũ + bằng xoay tròn rồi vỡ thành các hạt sáng như sao
 *  done    -> bàn giao sang popup chính (nền tối)
 */
export type IntroPhase = "blank" | "welcome" | "rise" | "hint" | "shatter" | "done";

interface IntroState {
  phase: IntroPhase;
  setPhase: (phase: IntroPhase) => void;
}

export const useIntroStore = create<IntroState>((set) => ({
  phase: "blank",
  setPhase: (phase) => set({ phase }),
}));
