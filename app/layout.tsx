import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import "@fontsource/poppins"; // This includes the default weight (400)

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shedula',
  description: 'Healthcare appointment scheduling app',
  icons: {
    icon: '/favicon.svg', // Add this SVG to /public
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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
