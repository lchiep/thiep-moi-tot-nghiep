export type Gender = "Nam" | "Nữ";

export const GUEST_STORAGE_KEYS = {
  name: "graduationName",
  nickname: "graduationNickname",
  gender: "graduationGender",
} as const;

export function saveGuest(name: string, nickname: string, gender: Gender) {
  localStorage.setItem(GUEST_STORAGE_KEYS.name, name);
  localStorage.setItem(GUEST_STORAGE_KEYS.nickname, nickname);
  localStorage.setItem(GUEST_STORAGE_KEYS.gender, gender);
}

export type StoredGuest = {
  name: string;
  nickname: string;
  gender: Gender | "";
};

export function readGuest(): StoredGuest {
  if (typeof window === "undefined") {
    return { name: "", nickname: "", gender: "" };
  }

  return {
    name: localStorage.getItem(GUEST_STORAGE_KEYS.name) ?? "",
    nickname: localStorage.getItem(GUEST_STORAGE_KEYS.nickname) ?? "",
    gender: (localStorage.getItem(GUEST_STORAGE_KEYS.gender) as Gender | null) ?? "",
  };
}
