"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, ExternalLink, ChevronRight } from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import { socialIcons, type Sociallinks } from "@/components/shared/icons/social-links-svg-icon";

export function GripFooter() {
  const { shopDetails } = useShopStore();

  const shopName = shopDetails?.shop_name || "Store";
  const logoUrl = shopDetails?.image_url;
  const baseUrl = shopDetails?.baseUrl || "";
  const address = shopDetails?.address;
  const shopPhone = shopDetails?.shop_phone;
  const shopEmail = shopDetails?.shop_email;
  const socialLinks = shopDetails?.social_links as Sociallinks | undefined;
  const currentYear = new Date().getFullYear();

  const policyLinks = [
    "about-us",
    "privacy-policy",
    "terms-and-conditions",
    "return-policy",
  ];

  // Render social links
  const renderedSocialLinks = socialLinks
    ? Object.entries(socialLinks)
        .map(([key, value]) => {
          const Icon = socialIcons[key as keyof Sociallinks];
          if (!value || !Icon || typeof value !== "string") return null;

          const href = value.startsWith("http") ? value : `https://${value}`;
          return (
            <Link key={key} href={href} target="_blank" className="group">
              <div className="w-12 h-12 flex items-center justify-center bg-linear-to-br from-blue-500 to-landing-primary rounded-xl shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-blue-400/30 hover:rotate-3">
                <Icon className="w-5 h-5" />
              </div>
            </Link>
          );
        })
        .filter(Boolean)
    : [];

  const hasSocialLinks = renderedSocialLinks.length > 0;

  return (
    <footer className="relative overflow-hidden">
      {/* Main footer content */}
      <div className="relative w-full bg-linear-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 pt-10 md:pt-20 pb-10 px-4 sm:px-6 lg:px-8 rounded-t-3xl shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* Company info */}
            {logoUrl ? (
              <Link href={baseUrl || "/"} className="space-y-4">
                <Image
                  height={60}
                  width={200}
                  alt={shopName}
                  src={logoUrl}
                  className="h-10 md:h-12.5 w-auto max-w-50 object-contain cursor-pointer transition-all duration-300 hover:scale-110 hover:rotate-3 rounded-xs shadow-lg dark:shadow-black/20"
                />
              </Link>
            ) : (
              <Link
                href={baseUrl || "/"}
                className="group flex items-center gap-3"
              >
                <div className="flex flex-col">
                  <span className="font-inter font-bold text-xl text-landing-primary group-hover:text-landing-primary/80 transition-colors">
                    {shopName}
                  </span>
                  <span className="text-xs text-gray-500">
                    Premium Shopping Experience
                  </span>
                </div>
              </Link>
            )}

            {/* Quick links */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg relative inline-block text-gray-900 dark:text-white">
                QUICK LINKS
                <span className="absolute -bottom-1 left-0 w-12 h-1 bg-linear-to-r from-blue-400 to-landing-primary rounded-full"></span>
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
                <span className="absolute -bottom-1 left-0 w-12 h-1 bg-linear-to-r from-blue-400 to-landing-primary rounded-full"></span>
              </h4>
              <div className="flex flex-col gap-2 md:gap-4 text-sm text-gray-600 dark:text-gray-300">
                {address && (
                  <div className="flex items-start gap-3 group">
                    <div className="mt-1 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-landing-secondary dark:group-hover:bg-landing-primary/30 transition-colors duration-300">
                      <MapPin
                        strokeWidth={2}
                        className="w-5 h-5 text-landing-primary"
                      />
                    </div>
                    <span className="whitespace-pre-line group-hover:text-landing-primary transition-colors duration-300 mt-3">
                      {address}
                    </span>
                  </div>
                )}
                {shopPhone && (
                  <Link
                    href={`tel:${shopPhone}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-landing-secondary dark:group-hover:bg-landing-primary/30 transition-colors duration-300">
                      <Phone className="w-5 h-5 text-landing-primary" />
                    </div>
                    <span className="group-hover:text-landing-primary transition-colors duration-300">
                      {shopPhone}
                    </span>
                  </Link>
                )}
                {shopEmail && (
                  <Link
                    href={`mailto:${shopEmail}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-landing-secondary dark:group-hover:bg-landing-primary/30 transition-colors duration-300">
                      <Mail className="w-5 h-5 text-landing-primary" />
                    </div>
                    <span className="group-hover:text-landing-primary transition-colors duration-300">
                      {shopEmail}
                    </span>
                  </Link>
                )}
              </div>
            </div>

            {/* Social links */}
            {hasSocialLinks && (
              <div className="space-y-4">
                <h4 className="font-bold text-lg relative inline-block text-gray-900 dark:text-white">
                  FOLLOW US
                  <span className="absolute -bottom-1 left-0 w-12 h-1 bg-linear-to-r from-blue-400 to-landing-primary rounded-full"></span>
                </h4>
                <div className="flex flex-wrap items-center gap-4">
                  {renderedSocialLinks}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Copyright section */}
      <div className="relative bg-linear-to-r from-blue-600 to-landing-primary text-white py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-center md:text-left text-sm md:text-base">
            © {shopName} {currentYear}. All rights reserved
          </p>
          <Link
            href="https://www.zatiq.com/"
            target="_blank"
            className="flex items-center gap-2 text-sm md:text-base hover:text-landing-secondary transition-colors duration-300"
          >
            <span>
              ⚡ Powered by <span className="font-medium">Zatiq Limited</span>
            </span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Decorative wave */}
        <div className="absolute top-0 left-0 w-full h-0 overflow-hidden">
          <div className="w-full h-12 bg-blue-50 dark:bg-gray-800 rounded-b-[100%]"></div>
        </div>
      </div>
    </footer>
  );
}

export default GripFooter;
