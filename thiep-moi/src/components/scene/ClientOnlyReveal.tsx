"use client";

import dynamic from "next/dynamic";

// The scene touches canvas/WebGL APIs at render time (texture + geometry
// generation), so it must never be executed during SSR. `ssr: false` is
// only accepted inside a Client Component, hence this thin wrapper.
const GraduationReveal = dynamic(() => import("./GraduationReveal"), {
  ssr: false,
});

export default function ClientOnlyReveal() {
  return <GraduationReveal />;
}
