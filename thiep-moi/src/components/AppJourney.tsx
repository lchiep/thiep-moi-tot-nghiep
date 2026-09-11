"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// Both scenes touch canvas/WebGL at render time, so neither may run during
// SSR. `ssr: false` is only accepted inside a Client Component, hence this
// wrapper (this file itself is already "use client").
const IntroJourney = dynamic(() => import("./intro/IntroJourney"), { ssr: false });
const NamJourney = dynamic(() => import("./nam/NamJourney"), { ssr: false });

/**
 * Điều phối toàn bộ hành trình: màn mở đầu (hook, nền trắng) chạy trước,
 * xong mới bàn giao sang popup + nhánh Nam (nền tối). Khi có nhánh Nữ sẽ
 * rẽ nhánh ở đây theo giới tính đã chọn trong popup.
 */
export default function AppJourney() {
  const [introDone, setIntroDone] = useState(false);

  if (!introDone) {
    return <IntroJourney onComplete={() => setIntroDone(true)} />;
  }
  return <NamJourney />;
}
