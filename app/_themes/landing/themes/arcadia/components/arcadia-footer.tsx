"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, ExternalLink, ChevronRight } from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import {
  socialIcons,
  type Sociallinks,
} from "@/components/shared/icons/social-links-svg-icon";

export function ArcadiaFooter() {
  const { shopDetails } = useShopStore();

  const baseUrl = shopDetails?.baseUrl || "";
  const socialLinks = shopDetails?.social_links as Sociallinks | undefined;

  const policyLinks = [
    "about-us",
    "privacy-policy",
    "terms-and-conditions",
    "return-policy",
  ];

  // Get active social links
  const activeSocialLinks = socialLinks
    ? Object.entries(socialLinks).filter(
        ([_, value]) => value && typeof value === "string"
      )
    : [];

  return (
    <footer className="relative overflow-hidden">
      {/* Main footer content */}
      <div className="relative w-full bg-linear-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 pt-10 md:pt-20 pb-10 px-4 sm:px-6 lg:px-8 rounded-t-3xl shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* Company info */}
            <Link href={baseUrl || "/"} className="space-y-4">
              {shopDetails?.image_url ? (
                <Image
                  height={60}
                  width={200}
                  alt={shopDetails.shop_name || "Shop"}
                  src={shopDetails.image_url}
                  className="h-10 md:h-12.5 w-auto max-w-50 object-contain cursor-pointer transition-all duration-300 hover:scale-110 rounded-xs"
                />
              ) : (
                <div className="flex flex-col">
                  <span className="font-bold text-xl text-landing-primary hover:text-landing-primary/80 transition-colors">
                    {shopDetails?.shop_name || "Shop"}
                  </span>
                  <span className="text-xs text-gray-500">
                    Premium Shopping Experience
                  </span>
                </div>
              )}
            </Link>

            {/* Quick links */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg relative inline-block text-gray-900 dark:text-white">
                QUICK LINKS
                <span className="absolute -bottom-1 left-0 w-12 h-1 bg-linear-to-r from-blue-400 to-landing-primary rounded-full" />
              </h4>
              <div className="flex flex-col gap-3 text-sm">
                {policyLinks.map((slug) => (
                  <Link
                    key={slug}
                    href={`${baseUrl}/${slug}`}
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-landing-primary dark:hover:text-landing-primary transition-colors duration-200 group"
                  >
                    <ChevronRight className="w-4 h-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    <span className="capitalize">
                      {slug.replace(/-/g, " ")}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact info */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg relative inline-block text-gray-900 dark:text-white">
                CONTACT US
                <span className="absolute -bottom-1 left-0 w-12 h-1 bg-linear-to-r from-blue-400 to-landing-primary rounded-full" />
              </h4>
              <div className="flex flex-col gap-2 md:gap-4 text-sm text-gray-600 dark:text-gray-300">
                {shopDetails?.address && (
                  <div className="flex items-start gap-3 group">
                    <div className="mt-1 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-landing-primary/20 transition-colors duration-300">
                      <MapPin
                        strokeWidth={2}
                        className="w-5 h-5 text-landing-primary"
                      />
                    </div>
                    <span className="whitespace-pre-line group-hover:text-landing-primary transition-colors duration-300 mt-3">
                      {shopDetails.address}
                    </span>
                  </div>
                )}
                {shopDetails?.shop_phone && (
                  <Link
                    href={`tel:${shopDetails.shop_phone}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-landing-primary/20 transition-colors duration-300">
                      <Phone className="w-5 h-5 text-landing-primary" />
                    </div>
                    <span className="group-hover:text-landing-primary transition-colors duration-300">
                      {shopDetails.shop_phone}
                    </span>
                  </Link>
                )}
                {shopDetails?.shop_email && (
                  <Link
                    href={`mailto:${shopDetails.shop_email}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-landing-primary/20 transition-colors duration-300">
                      <Mail className="w-5 h-5 text-landing-primary" />
                    </div>
                    <span className="group-hover:text-landing-primary transition-colors duration-300">
                      {shopDetails.shop_email}
                    </span>
                  </Link>
                )}
              </div>
            </div>

            {/* Social links */}
            {activeSocialLinks.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-bold text-lg relative inline-block text-gray-900 dark:text-white">
                  FOLLOW US
                  <span className="absolute -bottom-1 left-0 w-12 h-1 bg-linear-to-r from-blue-400 to-landing-primary rounded-full" />
                </h4>
                <div className="flex flex-wrap items-center gap-4">
                  {activeSocialLinks.map(([key, value]) => {
                    const href = (value as string).startsWith("http")
                      ? (value as string)
                      : `https://${value}`;
                    const IconComponent = socialIcons[key as keyof Sociallinks];
                    if (!IconComponent) return null;
                    return (
                      <Link
                        key={key}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                      >
                        <div className="w-12 h-12 flex items-center justify-center bg-linear-to-br from-blue-500 to-landing-primary rounded-xl shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-blue-400/30 hover:rotate-3">
                          <IconComponent className="w-5 h-5" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Copyright section */}
      <div className="relative bg-linear-to-r from-blue-600 to-landing-primary text-white py-8 px-4">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-center md:text-left text-sm md:text-base">
            © {shopDetails?.shop_name || "Shop"} {new Date().getFullYear()}. All
            rights reserved
          </p>
          <Link
            href="https://www.zatiq.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm md:text-base hover:text-landing-primary/80 transition-colors duration-300"
          >
            <span>
              ⚡ Powered by <span className="font-medium">Zatiq Limited</span>
            </span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Decorative wave */}
        <div className="absolute top-0 left-0 w-full h-3 overflow-hidden">
          <div className="w-full h-12 bg-blue-50 dark:bg-gray-800 rounded-b-[100%]" />
        </div>
      </div>
    </footer>
  );
}

export default ArcadiaFooter;
