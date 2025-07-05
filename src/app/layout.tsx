import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luathubs",
  description: "Legal Knowledge For You",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
