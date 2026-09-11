import type { Metadata } from "next";
import "./globals.css";

// Deliberately using a local/system font stack (see globals.css) instead of
// next/font/google: it self-hosts by fetching at build time, which fails in
// network-restricted build environments. Swap in a real webfont later once
// the visual direction is locked.

export const metadata: Metadata = {
  title: "Thiệp mời tốt nghiệp",
  description: "Trải nghiệm mở thiệp mời tốt nghiệp 3D — nhánh Nam",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--bg-deep)]">
        {children}
      </body>
    </html>
  );
}
