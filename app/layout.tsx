import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
  Roboto,
  Open_Sans,
  Lato,
  Poppins,
  Montserrat,
  Source_Sans_3,
  Nunito,
  Raleway,
  Work_Sans,
  Playfair_Display,
  Merriweather,
  Oswald,
  PT_Sans,
  Ubuntu,
  Quicksand,
  DM_Sans,
  Manrope,
  Space_Grotesk,
  Lora,
} from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import I18nProvider from "@/providers/I18nProvider";
import { Toaster } from "react-hot-toast";
import { getShopIdentifier } from "@/lib/utils/shop-identifier";
import { shopService } from "@/lib/api/services/shop.service";
import { ShopProvider } from "@/app/providers/shop-provider";
import { AppWrapper } from "@/components/app-wrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Google Fonts for theme customization
const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

const openSans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const nunito = Nunito({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const raleway = Raleway({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
});

const workSans = Work_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
});

const merriweather = Merriweather({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: "swap",
});

const oswald = Oswald({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

const ptSans = PT_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-pt-sans",
  display: "swap",
});

const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-ubuntu",
  display: "swap",
});

const quicksand = Quicksand({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

const dmSans = DM_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const manrope = Manrope({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const lora = Lora({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
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

  // Fetch shop profile if shop_id, domain, or subdomain is detected
  let shopProfile = null;
  if (
    shopIdentifier.shop_id ||
    shopIdentifier.domain ||
    shopIdentifier.subdomain
  ) {
    try {
      const profile = await shopService.getProfile(shopIdentifier);
      if (profile) {
        // Set baseUrl: empty for domain/subdomain access (production)
        // This ensures links like /products work correctly
        shopProfile = {
          ...profile,
          baseUrl: "",
        };
      }
    } catch (error) {
      console.error("Failed to load shop profile:", error);
    }
  }

  return (
    <html lang="en" className={`${inter.variable} ${roboto.variable} ${openSans.variable} ${lato.variable} ${poppins.variable} ${montserrat.variable} ${sourceSans.variable} ${nunito.variable} ${raleway.variable} ${workSans.variable} ${playfairDisplay.variable} ${merriweather.variable} ${oswald.variable} ${ptSans.variable} ${ubuntu.variable} ${quicksand.variable} ${dmSans.variable} ${manrope.variable} ${spaceGrotesk.variable} ${lora.variable}`}>
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
