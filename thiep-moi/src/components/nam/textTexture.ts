import * as THREE from "three";

/**
 * Vẽ nội dung thư mời lên canvas 2D rồi dùng làm texture cho mặt phẳng
 * thư trong scene 3D — tránh phụ thuộc font mạng (next/font/google từng
 * lỗi build trong sandbox), dùng font hệ thống nên tiếng Việt có dấu vẫn
 * hiển thị đúng.
 */
export function createLetterTexture(guestName: string): THREE.CanvasTexture {
  const w = 512;
  const h = 448;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "#1c2029");
  grad.addColorStop(1, "#11141b");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(201,163,95,0.5)";
  ctx.lineWidth = 3;
  ctx.strokeRect(18, 18, w - 36, h - 36);

  ctx.textAlign = "center";
  ctx.fillStyle = "#c9a35f";
  ctx.font = "600 20px 'Segoe UI', sans-serif";
  ctx.fillText("T H Ư   M Ờ I", w / 2, 96);

  ctx.fillStyle = "#eef1f6";
  ctx.font = "700 36px 'Segoe UI', sans-serif";
  ctx.fillText("Trân trọng kính mời", w / 2, 158);

  if (guestName) {
    ctx.fillStyle = "#e4c78a";
    ctx.font = "600 28px 'Segoe UI', sans-serif";
    ctx.fillText(guestName, w / 2, 216);
  }

  ctx.fillStyle = "#9aa3b2";
  ctx.font = "400 19px 'Segoe UI', sans-serif";
  ctx.fillText("đến chung vui trong ngày lễ tốt nghiệp", w / 2, 268);

  ctx.fillStyle = "#5a6272";
  ctx.font = "400 15px 'Segoe UI', sans-serif";
  ctx.fillText("chạm vào thư để mở chi tiết", w / 2, h - 36);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
