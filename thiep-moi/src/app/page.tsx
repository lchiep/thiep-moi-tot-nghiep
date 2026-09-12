import AppJourney from "@/components/AppJourney";

// Toàn bộ trải nghiệm được thiết kế cho khung dọc kiểu điện thoại
// (~390-430px). Trên màn hình rộng (desktop), khung 3D vẫn giữ đúng tỉ lệ
// đó — bọc trong một "thẻ" rộng tối đa 480px, canh giữa — thay vì kéo giãn
// full màn hình ngang, vì camera/vị trí 3D được tính theo chiều dọc: kéo
// ngang quá rộng làm lộ cạnh phẳng của mặt sàn đổ bóng (nhìn như một khối
// xám khổng lồ).
export default function Home() {
  return (
    <div className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-[var(--bg-deep)]">
      <div className="relative h-full w-full max-w-[480px] overflow-hidden sm:h-[92dvh] sm:max-h-[900px] sm:rounded-[28px] sm:shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
        <AppJourney />
      </div>
    </div>
  );
}
