import type { Metadata } from "next";
import "./globals.css";

// Fonts are loaded via runtime @import in each page's own CSS (not
// next/font/google): next/font self-hosts by fetching at build time, which
// fails in network-restricted build environments.

export const metadata: Metadata = {
  title: "Thiệp mời tốt nghiệp",
  description: "Thiệp mời tốt nghiệp tương tác — cuộc gọi, phong bì, và thư mời",
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
