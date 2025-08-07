// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import "@fontsource/poppins"; // This includes the default weight (400)

export const metadata: Metadata = {
  title: "Shedula",
  description: "Healthcare appointment scheduling app",
  icons: {
    icon: "/favicon.svg",
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover'
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className="bg-white text-[#1A1A1A] font-sans">{children}</body>
    </html>
  );
}
