# Thiệp mời tốt nghiệp — Cuộc gọi, Popup, Duyệt, Thư mời

Next.js 16 (App Router) + React + TypeScript + CSS thuần (không dùng
WebGL/3D). Hành trình:

1. **Màn hình cuộc gọi** (`/`, `CallScreen`) — Liquid Glass, slide-to-answer
   kéo được bằng chuột/chạm.
2. **Popup nhập thông tin** (`PopupForm`) — 9 trường bắt buộc (họ tên, biệt
   danh, SĐT, CCCD, giới tính, email, ngày sinh, sở thích, mô tả). Nút GỬI
   THÔNG TIN chỉ sáng xanh khi đủ dữ liệu; Hủy bỏ đỏ.
3. **Đóng dấu phê duyệt** (`ApprovalScene`) — bàn tay + con dấu đóng dấu đỏ
   "BẠN ĐƯỢC DUYỆT" lên tờ giấy.
4. **Rẽ nhánh theo giới tính** (lưu trong `localStorage`):
   - **Nam**: giấy gấp thành máy bay 2 cánh tam giác, bay nhiều keyframe,
     hạ cánh giữa khung hình kèm nảy một nhịp, đung đưa nhẹ và chờ chạm để
     chuyển sang `/invitation`.
   - **Nữ**: con dấu nằm trên phong bì có dấu sáp, phong bì bay uốn lượn
     sang phải rồi tự động chuyển sang `/invitation`.
5. **`/invitation`** — Header 40% cố định (calligraphy "Graduation Party" +
   nickname gõ kiểu typewriter từ `localStorage`, visual mũ+bằng hoặc
   hoa+phong bì tuỳ giới tính) và vùng 60% cuộn nội bộ với
   `scroll-snap-type: y mandatory` chia 5 card: Lời Mời Thân Mật; Thời
   Gian & Địa Điểm (kèm Google Maps); Hướng Dẫn Khách Mời; Lịch Trình &
   Lời Chúc (đếm ngược thời gian thực + sổ lời chúc lưu `localStorage`);
   Xác Nhận Tham Dự (RSVP).

## Chạy thử

```bash
npm install
npm run dev
```

Mở http://localhost:3000 — thao tác trên di động/màn hình dọc là chuẩn
nhất (thiết kế cho viewport ~390–430px).

## Cấu trúc chính

- `src/app/page.tsx` — máy trạng thái điều phối `call → form → stamp →
  transform/female-letter → flight/female-flight → landed`, lưu thông tin
  khách vào `localStorage` và điều hướng sang `/invitation`.
- `src/app/journey.css` — toàn bộ style của màn cuộc gọi, popup, đóng dấu,
  máy bay giấy và phong bì nữ.
- `src/components/journey/` — `CallScreen`, `PopupForm`, `ApprovalScene`.
- `src/app/invitation/page.tsx` + `invitation.css` — trang thư mời 40/60.
- `src/components/invitation/` — `CountdownTimer`, `WishesBook`,
  `RsvpForm` (đều lưu tạm vào `localStorage`, sẵn sàng thay bằng API khi
  có backend thật).
- `src/lib/guestStorage.ts` — helper đọc/ghi `graduationName`,
  `graduationNickname`, `graduationGender` trong `localStorage`.

## Ghi chú kỹ thuật

- Không dùng `next/font/google` (self-host lúc build cần mạng); font
  calligraphy (Great Vibes) và body (Cormorant Garamond/Inter) được nạp
  qua `@import` runtime trong CSS, giống cách trình duyệt của người dùng
  tải font — không phụ thuộc mạng lúc build.
- Cap/diploma (nam) và bouquet/envelope (nữ) ở header `/invitation` dùng
  icon vector (`lucide-react`) thay cho ảnh PNG thật — dễ thay bằng ảnh
  thật trong `public/images/` khi có asset chính thức, chỉ cần đổi phần
  render trong `src/app/invitation/page.tsx`.
- Toàn bộ animation ưu tiên `transform`/`opacity`; scroll listener dùng
  `passive` + `requestAnimationFrame`; có fallback tắt animation khi
  `prefers-reduced-motion: reduce`.

## Việc còn lại trước khi lên production

- Thay icon vector bằng ảnh nền/nhân vật thật nếu có asset thiết kế
  (`public/images/graduation-bg.png`, `graduation-scene.png`,
  `bouquet.png`, ...).
- Nếu có custom font `.woff2` hỗ trợ đầy đủ tiếng Việt cho calligraphy,
  thay `Great Vibes` bằng font đó theo đúng khuyến nghị trong tài liệu
  thiết kế.
- Thay địa chỉ/toạ độ placeholder trong card "Thời Gian & Địa Điểm" bằng
  địa điểm thật.
- Khi có backend, thay các `localStorage` (RSVP, lời chúc, thông tin
  khách) bằng API thật, có validate phía server.
