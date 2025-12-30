import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import I18nProvider from "@/providers/I18nProvider";
import { Toaster } from "react-hot-toast";
import { getShopIdentifier } from "@/lib/utils/shop-identifier";
import { shopService } from "@/lib/api/services/shop.service";
import { ShopProvider } from "@/app/providers/shop-provider";
import { AppWrapper } from "@/components/app-wrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zatiq Store",
  description: "Shop the latest fashion trends",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get shop identifier from hostname (including localhost with DEV_SHOP_ID)
  const shopIdentifier = await getShopIdentifier();

  console.log("RootLayout - shopIdentifier:", shopIdentifier);

  // Fetch shop profile if shop_id, domain, or subdomain is detected
  let shopProfile = null;
  if (
    shopIdentifier.shop_id ||
    shopIdentifier.domain ||
    shopIdentifier.subdomain
  ) {
    try {
      shopProfile = await shopService.getProfile(shopIdentifier);
      console.log("RootLayout - shopProfile loaded:", shopProfile?.shop_name);
    } catch (error) {
      console.error("Failed to load shop profile:", error);
    }
  }

  return (
    <html lang="en" className={inter.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <I18nProvider>
            {shopProfile ? (
              <ShopProvider initialShopData={shopProfile}>
                <AppWrapper>{children}</AppWrapper>
              </ShopProvider>
            ) : (
              <AppWrapper>{children}</AppWrapper>
            )}
          </I18nProvider>
        </QueryProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#333",
              color: "#fff",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
