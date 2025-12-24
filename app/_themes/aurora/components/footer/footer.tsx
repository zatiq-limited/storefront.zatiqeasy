"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import { cn } from "@/lib/utils";
import { socialIcons, type Sociallinks } from "@/components/shared/icons/social-links-svg-icon";
import { isSubscribed } from "@/lib/utils/subscription-utils";

interface AuroraFooterProps {
  bgStyle?: string;
}

export function AuroraFooter({ bgStyle }: AuroraFooterProps) {
  const { shopDetails } = useShopStore();

  const {
    shop_name = "",
    address = "",
    shop_phone = "",
    shop_email = "",
    social_links = {},
    baseUrl = "",
    payment_methods = [],
    image_url = "",
  } = shopDetails || {};

  // Policy links
  const policyLinks = [
    "about-us",
    "privacy-policy",
    "terms-and-conditions",
    "return-and-cancellation-policy",
  ];

  // Build social links
  const socialLinkElements = useMemo(() => {
    return Object.entries(social_links || {})
      .map(([key, value]) => {
        const Icon = socialIcons[key as keyof Sociallinks];
        if (!value || !Icon || typeof value !== "string") return null;

        const href = value.startsWith("http") ? value : `https://${value}`;
        return (
          <Link
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm hover:decoration-0"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-blue-zatiq rounded-full transition-all duration-100 hover:scale-105 hover:bg-blue-zatiq">
              <Icon className="w-4 text-white h-4" />
            </div>
          </Link>
        );
      })
      .filter(Boolean);
  }, [social_links]);

  return (
    <footer className={cn(bgStyle)}>
      {/* Main Footer */}
      <div className="w-full shadow-black-1.1 bg-white mt-8 dark:bg-black-27 pt-8 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Logo Section */}
            <div className="p-4 space-y-3">
              {image_url && (
                <Image
                  height={60}
                  width={200}
                  alt={shop_name || "Shop Logo"}
                  src={image_url}
                  className="h-8 md:h-10 w-auto max-w-[200px] object-contain"
                />
              )}
            </div>

            {/* Quick Links */}
            <div className="p-4 space-y-3">
              <h4 className="font-bold text-gray-900 dark:text-white">
                QUICK LINKS
              </h4>
              <div className="w-10 h-0.5 bg-gray-300" />
              <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-white">
                {policyLinks.map((slug) => (
                  <Link
                    key={slug}
                    href={`${baseUrl}/${slug}`}
                    className="hover:text-black capitalize transition-colors"
                  >
                    {slug.replace(/-/g, " ")}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Us */}
            <div className="p-4">
              <div className="space-y-3">
                <h4 className="font-bold text-gray-900 dark:text-white">
                  CONTACT US
                </h4>
                <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-white">
                  {address && (
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-zatiq/10 rounded-lg p-2 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-blue-zatiq" />
                      </div>
                      <span className="whitespace-pre-line text-gray-800 dark:text-white">
                        {address}
                      </span>
                    </div>
                  )}
                  {shop_phone && (
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-zatiq/10 rounded-lg p-2 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-blue-zatiq" />
                      </div>
                      <Link
                        href={`tel:${shop_phone}`}
                        className="px-2 py-1 hover:text-black capitalize transition-colors"
                      >
                        {shop_phone}
                      </Link>
                    </div>
                  )}
                  {shop_email && (
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-zatiq/10 rounded-lg p-2 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-blue-zatiq" />
                      </div>
                      <Link
                        href={`mailto:${shop_email}`}
                        className="px-2 py-1 hover:text-black lowercase transition-colors"
                      >
                        {shop_email}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Follow Us */}
            <div className="p-4">
              {socialLinkElements.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    FOLLOW US
                  </h4>
                  <div className="flex flex-wrap items-center gap-3">
                    {socialLinkElements}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-blue-zatiq text-white py-6 text-center text-sm">
        <p>
          &copy; {shop_name} {new Date().getFullYear()}. All rights reserved
        </p>
        {!isSubscribed(shopDetails) && (
          <Link
            href="https://www.zatiq.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-1 hover:underline"
          >
            Powered by <span className="font-medium">Zatiq Limited</span>
          </Link>
        )}
      </div>
    </footer>
  );
}

export default AuroraFooter;
