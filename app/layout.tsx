import type { Metadata, Viewport } from "next";
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
  Prata,
  Outfit,
  Unbounded,
} from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import I18nProvider from "@/providers/I18nProvider";
import { Toaster } from "react-hot-toast";
import { getShopIdentifier } from "@/lib/utils/shop-identifier";
import { getShopProfileCached } from "@/lib/api/services/shop.service";
import { ShopProvider } from "@/app/providers/shop-provider";
import { AppWrapper } from "@/components/app-wrapper";
import {
  getShopFaviconUrl,
  getShopTitle,
  getShopDescription,
  getShopOgImageUrl,
} from "@/lib/utils/shop-helpers";

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
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  style: "normal",
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

// Theme-specific fonts
const prata = Prata({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-prata",
  display: "swap",
});

const outfit = Outfit({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const unbounded = Unbounded({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-unbounded",
  display: "swap",
});

// Special Gothic is loaded via Google Fonts CDN in globals.css
// No need for next/font definition as it's imported via @import

// Viewport configuration - prevents zoom on mobile inputs
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Generate dynamic metadata based on shop profile
export async function generateMetadata(): Promise<Metadata> {
  // Get shop identifier
  const shopIdentifier = await getShopIdentifier();

  // Try to fetch shop profile for metadata (uses React cache for deduplication)
  let shopProfile = null;
  if (
    shopIdentifier.shop_id ||
    shopIdentifier.domain ||
    shopIdentifier.subdomain
  ) {
    try {
      shopProfile = await getShopProfileCached(shopIdentifier);
    } catch {
      // Fallback to default metadata
    }
  }

  // Generate metadata based on shop profile
  const shopName = shopProfile?.shop_name;
  const title = getShopTitle(shopName);
  const description = getShopDescription(shopName);
  const faviconUrl = getShopFaviconUrl(
    shopProfile?.favicon_url,
    shopProfile?.image_url
  );
  const ogImageUrl = getShopOgImageUrl(shopProfile?.image_url);

  return {
    title: {
      default: title,
      template: `%s | ${shopName || "Zatiq Store"}`,
    },
    description,
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: shopName || "Zatiq Store",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get shop identifier from hostname (including localhost with DEV_SHOP_ID)
  const shopIdentifier = await getShopIdentifier();

  // Fetch shop profile if shop_id, domain, or subdomain is detected
  // Uses React cache for deduplication with generateMetadata
  let shopProfile = null;
  if (
    shopIdentifier.shop_id ||
    shopIdentifier.domain ||
    shopIdentifier.subdomain
  ) {
    try {
      const profile = await getShopProfileCached(shopIdentifier);
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
    <html lang="en" className={`${inter.variable} ${roboto.variable} ${openSans.variable} ${lato.variable} ${poppins.variable} ${montserrat.variable} ${sourceSans.variable} ${nunito.variable} ${raleway.variable} ${workSans.variable} ${playfairDisplay.variable} ${merriweather.variable} ${oswald.variable} ${ptSans.variable} ${ubuntu.variable} ${quicksand.variable} ${dmSans.variable} ${manrope.variable} ${spaceGrotesk.variable} ${lora.variable} ${prata.variable} ${outfit.variable} ${unbounded.variable}`}>
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
