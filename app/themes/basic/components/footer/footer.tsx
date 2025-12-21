"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  ChevronRight
} from 'lucide-react';
import { useShopStore } from '@/stores';
import { socialIcons, type Sociallinks } from '@/app/assets/icons/social-links-svg-icon';

/**
 * Basic Footer Component
 * Migrated from old project design
 */
export function BasicFooter() {
  const { shopDetails } = useShopStore();

  const socialLinks = Object.entries(shopDetails?.social_links || {}).map(([key, value]) => {
    const Icon = socialIcons[key as keyof Sociallinks];
    if (!value || !Icon || typeof value !== "string") return null;

    const href = value.startsWith("http") ? value : `https://${value}`;
    return (
      <Link
        key={key}
        href={href}
        target="_blank"
        className="text-gray-700 dark:text-gray-300 hover:text-blue-zatiq transition-colors duration-200"
      >
        <Icon className="w-8 h-8" />
      </Link>
    );
  });

  const policyLinks = [
    "about-us",
    "privacy-policy",
    "terms-and-conditions",
    "return-and-cancellation-policy",
  ];

  // Check if shop is subscribed (simplified version - in old project this checks subscription)
  const isSubscribed = (shopDetails: any) => {
    // This is a placeholder - in the old project this checks against subscription data
    // For now, we'll assume all shops need the "Powered by" link
    return false;
  };

  const baseUrl = shopDetails?.baseUrl || "/";

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-16 pt-12 pb-6 bg-white dark:bg-black-27">
      <div className="max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Company Info */}
          <div className="space-y-4">
            {shopDetails?.image_url && (
              <Link href="/" className="mb-4">
                <Image
                  height={60}
                  width={200}
                  alt={shopDetails?.shop_name || 'Shop'}
                  src={shopDetails.image_url}
                  className="h-[40px] w-auto max-w-[180px] object-contain transition-all duration-300 hover:opacity-80 hover:scale-110 hover:rotate-1 cursor-pointer"
                />
              </Link>
            )}

            <div className="flex space-x-4">{socialLinks}</div>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-medium text-lg mb-5">Policies</h4>
            <div className="flex flex-col gap-3 text-sm">
              {policyLinks.map((slug) => (
                <Link
                  key={slug}
                  href={`${baseUrl}/${slug}`}
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-zatiq dark:hover:text-blue-400 transition-colors duration-200 group"
                >
                  <ChevronRight className="w-4 h-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  <span className="capitalize">{slug.replace(/-/g, " ")}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-medium text-lg mb-5">Contact Us</h4>
            <div className="flex flex-col space-y-3 text-sm text-gray-600 dark:text-gray-300">
              {shopDetails?.shop_email && (
                <Link
                  href={`mailto:${shopDetails.shop_email}`}
                  className="flex items-center space-x-2 hover:text-blue-zatiq transition-colors duration-200"
                >
                  <Mail className="w-4 h-4" />
                  <span>{shopDetails.shop_email}</span>
                </Link>
              )}
              {shopDetails?.shop_phone && (
                <Link
                  href={`tel:${shopDetails.shop_phone}`}
                  className="flex items-center space-x-2 hover:text-blue-zatiq transition-colors duration-200"
                >
                  <Phone className="w-4 h-4" />
                  <span>{shopDetails.shop_phone}</span>
                </Link>
              )}
              {shopDetails?.address && (
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span className="whitespace-pre-line">{shopDetails.address}</span>
                </div>
              )}
              {/* Business hours - commented out like in old project */}
              {/* <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 mt-0.5" />
                <span>10 AM - 6 PM</span>
              </div> */}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            © {new Date().getFullYear()} - Copyright {shopDetails?.shop_name || 'Shop'}
          </p>
          {!isSubscribed(shopDetails) && (
            <Link
              href="https://www.zatiq.com/"
              target="_blank"
              className="block mt-1 hover:text-blue-zatiq transition-colors duration-200"
            >
              ⚡ Powered by <span className="font-medium">Zatiq Limited</span>
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}

// Export as default
export default BasicFooter;