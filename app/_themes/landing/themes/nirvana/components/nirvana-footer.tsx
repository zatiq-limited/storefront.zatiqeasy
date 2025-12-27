"use client";

import React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FallbackImage } from "@/components/ui/fallback-image";
import { useShopStore } from "@/stores/shopStore";
import {
  socialIcons,
  type Sociallinks,
} from "@/components/shared/icons/social-links-svg-icon";

export function NirvanaFooter() {
  const { shopDetails } = useShopStore();

  const shopName = shopDetails?.shop_name || "Shop";
  const address = shopDetails?.address;
  const phone = shopDetails?.shop_phone;
  const email = shopDetails?.shop_email;
  const socialLinks = shopDetails?.social_links || {};
  const logoUrl = shopDetails?.image_url;

  const policyLinks = [
    "about-us",
    "privacy-policy",
    "terms-and-conditions",
    "return-policy",
  ];

  const socialLinkElements = Object.entries(socialLinks)
    .map(([key, value]) => {
      const IconComponent = socialIcons[key as keyof Sociallinks];
      if (!value || !IconComponent || typeof value !== "string") return null;

      const href = value.startsWith("http") ? value : `https://${value}`;
      return (
        <Link
          key={key}
          href={href}
          target="_blank"
          className="flex items-center gap-1 text-sm hover:decoration-0"
        >
          <div className="w-10 h-10 flex items-center justify-center bg-landing-primary rounded-full transition-all duration-100 hover:scale-105">
            <IconComponent className="w-4 h-4 text-white" />
          </div>
        </Link>
      );
    })
    .filter(Boolean);

  return (
    <footer>
      <div className="w-full bg-white mt-8 pt-8 pb-8 md:px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto px-4 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-4">
            {/* Logo */}
            <div className="py-4 space-y-3">
              {logoUrl && (
                <FallbackImage
                  height={60}
                  width={200}
                  alt={shopName}
                  src={logoUrl}
                  className="h-8.5 md:h-10 w-auto max-w-50 object-contain"
                />
              )}
            </div>

            {/* Quick Links */}
            <div className="py-4 space-y-3">
              <h4 className="font-bold">QUICK LINKS</h4>
              <div className="w-10 h-0.5 bg-gray-300" />
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                {policyLinks.map((slug) => (
                  <Link
                    key={slug}
                    href={`/${slug}`}
                    className="hover:text-black capitalize"
                  >
                    {slug.replace(/-/g, " ")}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Us */}
            <div className="py-4">
              <div className="space-y-3">
                <h4 className="font-bold">CONTACT US</h4>
                <div className="flex flex-col gap-2 text-sm text-gray-600">
                  {address && (
                    <div className="flex items-start gap-2">
                      <MapPin
                        strokeWidth={2.25}
                        className="w-4 h-4 mt-0.5 shrink-0"
                      />
                      <span className="whitespace-pre-line hover:text-black">
                        {address}
                      </span>
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 shrink-0" />
                      <Link href={`tel:${phone}`} className="hover:text-black">
                        {phone}
                      </Link>
                    </div>
                  )}
                  {email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 shrink-0" />
                      <Link
                        href={`mailto:${email}`}
                        className="hover:text-black"
                      >
                        {email}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="py-4">
              {socialLinkElements.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-bold">FOLLOW US</h4>
                  <div className="flex flex-wrap items-center gap-3">
                    {socialLinkElements}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-landing-primary text-white py-6 text-center text-sm">
        <p>
          &copy; {shopName} {new Date().getFullYear()}. All rights reserved
        </p>
        <Link
          href="https://www.zatiq.com/"
          target="_blank"
          className="block mt-1 hover:underline"
        >
          Powered by <span className="font-medium">Zatiq Limited</span>
        </Link>
      </div>
    </footer>
  );
}

export default NirvanaFooter;
