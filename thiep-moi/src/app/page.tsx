import AppJourney from "@/components/AppJourney";

// Màn mở đầu (hook, nền trắng) -> popup + nhánh Nam (nền tối, đã thay
// thế hoàn toàn bản "ống đựng bằng 3D" cũ — xem src/components/scene/*
// để tham khảo lại nếu cần, nhưng không còn dùng).
export default function Home() {
  return (
    <div className="relative h-dvh w-full overflow-hidden">
      <AppJourney />
    </div>
  );
}
