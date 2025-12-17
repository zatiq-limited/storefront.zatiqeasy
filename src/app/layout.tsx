import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zatiq Store",
  description: "Shop the latest fashion trends",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
