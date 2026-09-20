"use client";

import { useState } from "react";
import type { Gender } from "@/lib/guestStorage";

export type ApprovalStage =
  | "stamp"
  | "transform"
  | "flight"
  | "landed"
  | "female-letter"
  | "female-flight"
  | "female-landed";

export default function ApprovalScene({
  stage,
  gender,
  onOpen,
}: {
  stage: ApprovalStage;
  gender: Gender;
  onOpen: () => void;
}) {
  const [planeClicked, setPlaneClicked] = useState(false);
  const [envelopeClicked, setEnvelopeClicked] = useState(false);

  const handlePlaneClick = () => {
    if (stage !== "landed" || planeClicked) return;
    setPlaneClicked(true);
    window.setTimeout(onOpen, 480);
  };

  const handleEnvelopeClick = () => {
    if (stage !== "female-landed" || envelopeClicked) return;
    setEnvelopeClicked(true);
    window.setTimeout(onOpen, 480);
  };

  const showPaperEnvelope = stage === "stamp" || stage === "transform" || stage === "flight";
  const showFemaleEnvelope =
    stage === "female-letter" || stage === "female-flight" || stage === "female-landed";

  return (
    <section className={`approval-scene stage-${stage}`}>
      {stage === "stamp" && (
        <div className="stamp-animation">
          <div className="hand">
            <div className="hand-arm" />
            <div className="hand-palm">✋</div>
          </div>
          <div className="stamp-object">
            <div className="stamp-handle" />
            <div className="stamp-base">
              <span>BẠN ĐƯỢC DUYỆT</span>
            </div>
          </div>
        </div>
      )}

      {gender === "Nam" && showPaperEnvelope && (
        <div
          className={`approved-paper ${
            stage === "transform" ? "paper-transforming" : ""
          } ${stage === "flight" ? "paper-flying" : ""}`}
        >
          <div className="paper-lines">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} />
            ))}
          </div>
          <div className="approved-stamp">BẠN ĐƯỢC DUYỆT</div>
        </div>
      )}

      {gender === "Nam" &&
        (stage === "transform" || stage === "flight" || stage === "landed") && (
          <button
            className={`paper-plane ${
              stage === "transform" ? "plane-folding" : ""
            } ${stage === "flight" ? "plane-flight" : ""} ${
              stage === "landed" ? "plane-landed" : ""
            } ${planeClicked ? "plane-clicked" : ""}`}
            onClick={handlePlaneClick}
            type="button"
            aria-label="Mở thiệp"
          >
            <span className="plane-top" />
            <span className="plane-left" />
            <span className="plane-right" />
            <span className="plane-center" />
          </button>
        )}

      {gender === "Nam" && stage === "landed" && (
        <>
          <div className="landing-shadow" />
          <div className="touch-hint">CHẠM VÀO MÁY BAY</div>
        </>
      )}

      {gender === "Nữ" && showFemaleEnvelope && (
        <>
          <div className="female-scene-reveal" />

          {stage === "female-letter" && (
            <div className="approval-banner">BẠN ĐƯỢC DUYỆT</div>
          )}

          <button
            type="button"
            aria-label="Mở thiệp"
            disabled={stage !== "female-landed"}
            onClick={handleEnvelopeClick}
            className={`female-envelope ${
              stage === "female-letter" ? "female-letter-stamped" : ""
            } ${stage === "female-flight" ? "female-letter-flying" : ""} ${
              stage === "female-landed" ? "female-letter-landed" : ""
            } ${envelopeClicked ? "envelope-clicked" : ""}`}
          >
            <img src="/images/envelope-card.png" alt="" className="envelope-photo-img" />
          </button>
        </>
      )}

      {gender === "Nữ" && stage === "female-landed" && (
        <div className="touch-hint female-touch-hint">CHẠM VÀO THƯ ĐỂ MỞ</div>
      )}
    </section>
  );
}
