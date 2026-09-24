"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Gender } from "@/lib/guestStorage";

// Three.js touches the canvas/WebGL context, which doesn't exist during
// SSR -- load it only in the browser.
const PaperPlane3D = dynamic(() => import("./PaperPlane3D"), { ssr: false });

export type ApprovalStage =
  | "stamp"
  | "transform"
  | "flight"
  | "landed"
  | "female-letter"
  | "female-flight"
  | "female-landed";

// A real paper-dart silhouette (single SVG, not four CSS border-triangles
// glued together) -- a pointed nose, a notched tail, and a center crease
// with the two wings shaded slightly differently to read as folded paper.
function PaperPlaneIcon() {
  return (
    <svg className="plane-icon" viewBox="0 0 220 145" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M218 72 L0 20 L132 72 Z" fill="#faf6ec" />
      <path d="M218 72 L132 72 L0 124 Z" fill="#ddd2b8" />
      <path d="M218 72 L132 72" stroke="rgba(85, 72, 58, 0.35)" strokeWidth="2" />
    </svg>
  );
}

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

      {/* Both genders see the same paper get stamped -- only Nam keeps
          this element around through "transform", while it folds into
          the plane. It used to also render through "flight" with a
          "paper-flying" class that had no matching CSS rule, so the flat
          paper just sat there fully visible, overlapping the plane, for
          the entire ~2.5s flight -- it must be gone by the time the
          plane is actually flying. Nữ's "stamp" stage previously
          rendered the stamp tool over empty background with nothing to
          stamp onto, so it gets the same paper too, just for that one
          stage. */}
      {(gender === "Nam" ? stage === "stamp" || stage === "transform" : stage === "stamp") && (
        <div className={`approved-paper ${stage === "transform" ? "paper-transforming" : ""}`}>
          <div className="paper-lines">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} />
            ))}
          </div>
          <div className="approved-stamp">BẠN ĐƯỢC DUYỆT</div>
        </div>
      )}

      {/* The flat 2D paper folds into a flat plane silhouette here, then
          hands off to a real 3D plane (Three.js) for "flight" and
          "landed" -- genuine banking/depth instead of a flat cutout
          sliding around. The 2D fold fades out just as the 3D canvas
          fades in so the handoff reads as one continuous motion. */}
      {gender === "Nam" && stage === "transform" && (
        <button
          className="paper-plane plane-folding"
          type="button"
          aria-label="Mở thiệp"
          disabled
        >
          <PaperPlaneIcon />
        </button>
      )}

      {gender === "Nam" && (stage === "flight" || stage === "landed") && (
        <PaperPlane3D
          phase={stage === "flight" ? "flight" : "landed"}
          clicked={planeClicked}
          onLandedClick={handlePlaneClick}
        />
      )}

      {/* A real DOM button for the tap target instead of relying on R3F's
          raycasting hit-testing on a thin mesh -- more reliable, and a
          much friendlier touch target on an actual phone besides. It
          sits invisibly over the 3D plane's landing spot. */}
      {gender === "Nam" && stage === "landed" && (
        <button
          type="button"
          className="plane-3d-tap-target"
          aria-label="Mở thiệp"
          onClick={handlePlaneClick}
        />
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
