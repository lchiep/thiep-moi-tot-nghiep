"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CallScreen from "@/components/journey/CallScreen";
import PopupForm, { type GuestFormData } from "@/components/journey/PopupForm";
import ApprovalScene, { type ApprovalStage } from "@/components/journey/ApprovalScene";
import { saveGuest, type Gender } from "@/lib/guestStorage";
import "./journey.css";

type Stage = "call" | "form" | ApprovalStage;

export default function Home() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("call");
  const [gender, setGender] = useState<Gender>("Nam");

  const handleSubmit = (data: GuestFormData & { gender: Gender }) => {
    saveGuest(data.fullName, data.nickname, data.gender);
    setGender(data.gender);
    setStage("stamp");

    if (data.gender === "Nữ") {
      window.setTimeout(() => setStage("female-letter"), 1800);
      window.setTimeout(() => setStage("female-flight"), 3000);
      window.setTimeout(() => router.push("/invitation"), 5200);
      return;
    }

    window.setTimeout(() => setStage("transform"), 1800);
    window.setTimeout(() => setStage("flight"), 3300);
    window.setTimeout(() => setStage("landed"), 5900);
  };

  return (
    <main className="graduation-page">
      <div className="scene-background" />
      <div className="scene-vignette" />
      <div className="moving-light light-a" />
      <div className="moving-light light-b" />

      {stage === "call" && <CallScreen onAnswered={() => setStage("form")} />}

      {stage === "form" && <PopupForm onSubmit={handleSubmit} />}

      {stage !== "call" && stage !== "form" && (
        <ApprovalScene
          stage={stage}
          gender={gender}
          onPlaneTap={() => router.push("/invitation")}
        />
      )}
    </main>
  );
}
