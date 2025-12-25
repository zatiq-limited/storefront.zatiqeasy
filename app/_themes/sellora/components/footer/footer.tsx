"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import { TrustFeaturesBar } from "../sections/trust-features";

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

  return (
    <footer>
      {/* Trust Features Bar */}
      <TrustFeaturesBar />

      {/* Main Footer */}
      <div className="bg-[#ede9e6] dark:bg-[#dad1ca] pt-10 sm:pt-16 pb-6 sm:pb-8">
        <div className="max-w-7xl mx-auto px-4 xl:px-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-12">
            {/* About Section */}
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
            </div>

            {/* Quick Links */}
            <div className="space-y-3 sm:space-y-5">
              <h4 className="font-bold text-base text-black">{t("shop") || "Shop"}</h4>
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
              <h4 className="font-bold text-base text-black">{t("help") || "Help"}</h4>
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

            {/* Contact Section */}
            <div className="space-y-3 sm:space-y-5">
              <h4 className="font-bold text-base text-black">{t("contact_us")}</h4>
              <div className="flex flex-col gap-1 text-base font-normal text-black">
                {shopDetails?.address && <p>{shopDetails.address}</p>}
                {shopDetails?.shop_phone && <p>{shopDetails.shop_phone}</p>}
                {shopDetails?.shop_email && <p>{shopDetails.shop_email}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#ede9e6] dark:bg-[#dad1ca] text-[#6D6D6D] py-4 md:py-6 text-left text-sm font-normal px-4 sm:px-0">
        <div className="max-w-7xl mx-auto">
          <p className="mb-1">
            &copy; {new Date().getFullYear()} {shopName}. {t("all_rights_reserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default SelloraFooter;
