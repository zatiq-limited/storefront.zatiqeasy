"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Mail, MapPin, Phone } from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import { TrustFeaturesBar } from "../sections/trust-features";
import {
  socialIcons,
  type Sociallinks,
} from "@/components/shared/icons/social-links-svg-icon";

export function SelloraFooter() {
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();

  const shopName = shopDetails?.shop_name || "Shop";
  const shopLogo = shopDetails?.image_url;
  const baseUrl = shopDetails?.baseUrl || "";

  const policyLinks = [
    "about-us",
    "privacy-policy",
    "terms-and-conditions",
    "return-and-cancellation-policy",
  ];

  // Social links like Basic theme
  const socialLinks = Object.entries(shopDetails?.social_links || {}).map(
    ([key, value]) => {
      const Icon = socialIcons[key as keyof Sociallinks];
      if (!value || !Icon || typeof value !== "string") return null;

      const href = value.startsWith("http") ? value : `https://${value}`;
      return (
        <Link
          key={key}
          href={href}
          target="_blank"
          className="text-black hover:text-blue-zatiq transition-colors duration-200"
        >
          <Icon className="w-7 h-7" />
        </Link>
      );
    }
  );

  const hasSocialLinks = socialLinks.some((link) => link !== null);

  return (
    <footer>
      {/* Trust Features Bar */}
      <TrustFeaturesBar />

      {/* Main Footer */}
      <div className="bg-[#ede9e6] dark:bg-[#dad1ca] pt-10 sm:pt-16 pb-6 sm:pb-8">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-12">
            {/* About Section - includes logo and contact info */}
            <div className="space-y-3 sm:space-y-5">
              <h4 className="font-bold text-base text-black">
                {t("about")} {shopName}
              </h4>
              {shopLogo && (
                <FallbackImage
                  height={60}
                  width={200}
                  alt={shopName}
                  src={shopLogo}
                  className="h-12 sm:h-16 w-auto object-contain"
                />
              )}
              {/* Contact Info moved here */}
              <div className="flex flex-col gap-2 text-sm font-normal text-black pt-2">
                {shopDetails?.shop_email && (
                  <Link
                    href={`mailto:${shopDetails.shop_email}`}
                    className="flex items-center gap-2 hover:text-blue-zatiq transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{shopDetails.shop_email}</span>
                  </Link>
                )}
                {shopDetails?.shop_phone && (
                  <Link
                    href={`tel:${shopDetails.shop_phone}`}
                    className="flex items-center gap-2 hover:text-blue-zatiq transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{shopDetails.shop_phone}</span>
                  </Link>
                )}
                {shopDetails?.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <span className="whitespace-pre-line">
                      {shopDetails.address}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3 sm:space-y-5">
              <h4 className="font-bold text-base text-black">
                {t("shop")}
              </h4>
              <div className="flex flex-col gap-1 text-base font-normal text-black">
                <Link
                  href={`${baseUrl}/products`}
                  className="hover:text-blue-zatiq transition-colors"
                >
                  {t("products")}
                </Link>
                <Link
                  href={`${baseUrl}/categories`}
                  className="hover:text-blue-zatiq transition-colors"
                >
                  {t("categories")}
                </Link>
              </div>
            </div>

            {/* Help Links */}
            <div className="space-y-3 sm:space-y-5">
              <h4 className="font-bold text-base text-black">
                {t("help")}
              </h4>
              <div className="flex flex-col gap-1 text-base font-normal text-black">
                {policyLinks.map((slug) => (
                  <Link
                    key={slug}
                    href={`${baseUrl}/${slug}`}
                    className="hover:text-blue-zatiq transition-colors capitalize"
                  >
                    {slug.replace(/-/g, " ")}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Links Section */}
            {hasSocialLinks && (
              <div className="space-y-3 sm:space-y-5">
                <h4 className="font-bold text-base text-black">
                  {t("follow_us")}
                </h4>
                <div className="flex flex-wrap gap-3">{socialLinks}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#ede9e6] dark:bg-[#dad1ca] text-[#6D6D6D] py-4 md:py-6 text-left text-sm font-normal px-4 sm:px-0">
        <div className="container">
          <p className="mb-1">
            &copy; {new Date().getFullYear()} {shopName}.{" "}
            {t("all_rights_reserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default SelloraFooter;
