import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import ThemeLayout from "@/app/_layouts/theme/layout";

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
      <body>
        <QueryProvider>
          <ThemeLayout>{children}</ThemeLayout>
        </QueryProvider>
      </body>
    </html>
  );
}
