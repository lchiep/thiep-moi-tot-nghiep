import { create } from "zustand";

/**
 * Nhánh Nam — luồng mới (thay thế hoàn toàn ống đựng bằng cũ):
 *  form      -> popup nhập thông tin khách
 *  stamping  -> bàn tay + con dấu đang đập xuống
 *  stamped   -> dấu đã đóng xong, chờ một nhịp rồi popup trượt trái
 *  planeIn   -> máy bay giấy bay vào và mở thành thư
 *  letter    -> thư đã mở phẳng, chờ người dùng chạm vào
 *  shatter   -> thư vỡ thành hạt, hạt tụ thành icon thư mục
 *  revealed  -> bàn giao sang trang chính (placeholder)
 */
export type NamPhase =
  | "form"
  | "stamping"
  | "stamped"
  | "planeIn"
  | "letter"
  | "shatter"
  | "revealed";

interface NamState {
  phase: NamPhase;
  guestName: string;
  setPhase: (phase: NamPhase) => void;
  setGuestName: (name: string) => void;
}

export const useNamStore = create<NamState>((set) => ({
  phase: "form",
  guestName: "",
  setPhase: (phase) => set({ phase }),
  setGuestName: (guestName) => set({ guestName }),
}));
