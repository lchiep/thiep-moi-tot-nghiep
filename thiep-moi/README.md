# Thiệp mời tốt nghiệp — Màn mở đầu + Nhánh Nam (3D)

Next.js 16 + React Three Fiber (Three.js) + GSAP. Hành trình liền mạch
(không ngắt trang):

## Màn mở đầu (hook, nền trắng)

Nền trắng → chữ "Chào mừng bạn tham gia" hiện lên → mũ + bằng tốt
nghiệp (khối 3D thật, dựng từ primitives, ánh sáng/đổ bóng/ContactShadow
thật) trồi từ dưới lên → bong bóng tin nhắn 3D bóng bẩy hiện ra gợi ý
chạm vào mũ → chạm vào → mũ + bằng xoay tròn rồi vỡ thành các hạt sáng
như sao → màn hình phủ tối dần, bàn giao mượt sang popup (nền tối) của
nhánh Nam.

## Nhánh Nam (nền tối)

1. Popup xin thông tin khách (tên).
2. Cảnh đóng dấu 3D — bàn tay + con dấu (khối 3D dựng từ primitives,
   ánh sáng/đổ bóng thật) đập xuống, để lại dấu mực đỏ "BẠN ĐƯỢC MỜI"
   trên popup.
3. Popup trượt sang trái, biến mất.
4. Máy bay giấy gấp từ thư mời bay vào từ bên phải theo quỹ đạo cong
   3D, rồi "mở ra" (bung góc gập dihedral + xoay) thành thư mời phẳng.
5. Chạm vào thư → thư vỡ thành các hạt (particle points 3D), bay ra rồi
   tụ lại đúng hình icon thư mục có dấu tích (dựng bằng `ExtrudeGeometry`
   thật, có độ dày + đổ bóng).
6. Bàn giao sang trang chính (hiện là placeholder).

Toàn bộ phần "vật lý" của mọi cảnh (mũ tốt nghiệp, con dấu, máy bay
giấy, hạt vỡ, icon thư mục) là WebGL 3D thật — có phối cảnh, ánh sáng,
đổ bóng, xoay — không phải mô phỏng CSS/SVG phẳng. Riêng khung nhập tên
(`PopupForm`) và dấu mực in trên giấy vẫn là DOM/SVG (hợp lý vì đó là
các yếu tố phẳng theo đúng bản chất — form nhập liệu và vết mực trên
giấy).

## Chạy thử

```bash
npm install
npm run dev
```

Mở http://localhost:3000 — thao tác trên di động/màn hình dọc là chuẩn
nhất (thiết kế cho viewport ~390–430px).

## Cấu trúc chính

- `src/components/AppJourney.tsx` — điều phối toàn bộ: chạy
  `intro/IntroJourney` trước, xong mới bàn giao sang `nam/NamJourney`.
  Bọc cả hai bằng `dynamic(..., { ssr:false })` (canvas không được
  chạy lúc SSR).

### `src/components/intro` (màn mở đầu)

- `introStore.ts` — state machine 6 giai đoạn (`blank → welcome → rise
  → hint → shatter → done`), dùng Zustand.
- `IntroCanvas.tsx` — Canvas WebGL nền trắng riêng (tách khỏi
  `NamCanvas` vì tông màu khác hẳn; chỉ mount/unmount một lần nên
  không lặp lại vấn đề "Context Lost" khi tạo/huỷ canvas liên tục).
- `GraduationProps3D.tsx` — mũ + bằng tốt nghiệp 3D, hiệu ứng trồi lên
  (GSAP), xoay/thu nhỏ rồi vỡ thành các hạt sáng (`THREE.Points`) khi
  chạm vào.
- `HintBubble3D.tsx` — bong bóng tin nhắn 3D bóng bẩy (MeshPhysical,
  clearcoat), nhấp nhô nhẹ để gợi ý chạm.
- `IntroJourney.tsx` — kịch bản thời gian (chữ chào mừng → trồi lên →
  chờ chạm), lớp overlay tối phủ dần lúc vỡ hạt để bàn giao mượt sang
  nền tối của nhánh Nam.

### `src/components/nam` (nhánh Nam)

- `store.ts` — state machine 7 giai đoạn (`form → stamping → stamped →
  planeIn → letter → shatter → revealed`), dùng Zustand.
- `NamCanvas.tsx` — Canvas WebGL duy nhất sống suốt hành trình, ánh
  sáng + camera phối cảnh.
- `StampTool3D.tsx` — bàn tay + con dấu 3D, animate bằng GSAP tween
  trực tiếp lên `Object3D` refs (position/rotation).
- `PopupStage.tsx` + `PopupForm.tsx` + `InkStampMark.tsx` — lớp DOM nổi
  trên canvas: form nhập tên, dấu mực SVG canh thời gian khớp lúc con
  dấu 3D chạm giấy.
- `PaperPlane3D.tsx` — máy bay giấy (2 "cánh" tam giác gập theo góc
  dihedral quanh trục X cục bộ) bay vào rồi bung phẳng thành mặt thư có
  texture vẽ từ canvas 2D (`textTexture.ts` — tránh phụ thuộc font
  mạng).
- `ParticleShatter3D.tsx` — `THREE.Points` vỡ ra rồi tụ theo toạ độ lấy
  mẫu từ hình icon thư mục (quét pixel một canvas offscreen), sau đó
  hiện icon 3D thật (`ExtrudeGeometry`) đè lên.
- `NamJourney.tsx` — điều phối theo phase.

## Việc còn lại (chưa làm ở bước này)

- Nhánh Nữ (bó hoa + phong bì) — sẽ làm 3D thật theo cùng kiến trúc.
- Nội dung thật của "trang chính" (tên trường, ngày giờ, địa điểm) đang
  là placeholder trong `nam/NamJourney.tsx`.
- Video tham chiếu đúng cho hiệu ứng hạt vỡ ở nhánh Nam (video đã gửi
  trước đó không khớp nội dung) — đã tự thiết kế timing/kiểu dáng theo
  phán đoán riêng, có thể tinh chỉnh lại khi có video chuẩn.
- Polish hiệu năng/di động thật (mới test bằng Chromium headless +
  software rendering — nên thử trên thiết bị thật, đặc biệt kiểm tra
  khung hình/giây trên máy tầm trung).
- `src/components/scene/*` (bản ống đựng bằng 3D cũ) vẫn còn trong repo
  để tham khảo nhưng không còn được dùng — có thể xoá khi không cần.

## Đẩy lên GitHub

Repo này được khởi tạo bằng `git init` cục bộ (sandbox không có quyền
truy cập GitHub của bạn). Để đẩy lên:

```bash
git remote add origin <URL repo GitHub bạn vừa tạo>
git branch -M main
git push -u origin main
```
