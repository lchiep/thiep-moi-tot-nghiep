import * as THREE from "three";

/**
 * Draws a small circular monogram/emblem (graduation-cap glyph + ring of
 * dots, no locale-specific text) onto an offscreen canvas and returns it as
 * a THREE.CanvasTexture. Used on the diploma-tube cap seal — kept
 * text-free so it never depends on a specific font being installed.
 */
export function createEmblemTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const cx = size / 2;
  const cy = size / 2;

  // base
  ctx.fillStyle = "#1a1e27";
  ctx.beginPath();
  ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
  ctx.fill();

  // outer thin ring
  ctx.strokeStyle = "#c9a35f";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, size / 2 - 14, 0, Math.PI * 2);
  ctx.stroke();

  // dotted ring
  const dots = 36;
  for (let i = 0; i < dots; i++) {
    const a = (i / dots) * Math.PI * 2;
    const r = size / 2 - 40;
    ctx.beginPath();
    ctx.fillStyle = "#c9a35f";
    ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 2.6, 0, Math.PI * 2);
    ctx.fill();
  }

  // graduation cap glyph, hand drawn with simple shapes
  ctx.save();
  ctx.translate(cx, cy - 10);
  ctx.fillStyle = "#e4c78a";

  // mortarboard (diamond)
  ctx.beginPath();
  ctx.moveTo(-120, 0);
  ctx.lineTo(0, -46);
  ctx.lineTo(120, 0);
  ctx.lineTo(0, 46);
  ctx.closePath();
  ctx.fill();

  // base band
  ctx.beginPath();
  ctx.ellipse(0, 44, 62, 22, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#c9a35f";
  ctx.fill();

  // button + tassel
  ctx.beginPath();
  ctx.arc(0, -2, 8, 0, Math.PI * 2);
  ctx.fillStyle = "#1a1e27";
  ctx.fill();

  ctx.strokeStyle = "#e4c78a";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, -2);
  ctx.lineTo(58, 34);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(58, 44, 7, 0, Math.PI * 2);
  ctx.fillStyle = "#e4c78a";
  ctx.fill();

  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
