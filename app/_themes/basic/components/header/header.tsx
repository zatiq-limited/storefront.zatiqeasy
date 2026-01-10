"use client";

import TopbarMessage from "@/components/ui/topbar-message";
import { cn } from "@/lib/utils";
import {
  selectShopDetails,
  selectTotalItems,
  useCartStore,
  useProductsStore,
  useShopStore,
} from "@/stores";
import { Globe, Mail, Phone, Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BasicSearchModal } from "../search";

/**
 * Basic Header Component
 * Migrated from old project design (storefront.zatiqeasy.com)
 */
export function BasicHeader() {
  const router = useRouter();
  const { i18n } = useTranslation();

  // Get stores
  const shopDetails = useShopStore(selectShopDetails);
  const totalItems = useCartStore(selectTotalItems);
  const { setCurrentPage } = useProductsStore();

  // State
  const [scrollY, setScrollY] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [langValue, setLangValue] = useState(
    shopDetails?.default_language_code || "en"
  );

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize language from localStorage
  useEffect(() => {
    const storedLang = localStorage.getItem("locale");
    const defaultLang = shopDetails?.default_language_code || "en";
    const currentLang = storedLang || defaultLang;

    if (currentLang !== defaultLang) {
      setLangValue(currentLang);
    }

    // Sync i18n with stored language
    if (storedLang && i18n.language !== storedLang) {
      i18n.changeLanguage(storedLang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLanguageChange = () => {
    const newLang = langValue === "en" ? "bn" : "en";
    localStorage.setItem("locale", newLang);
    setLangValue(newLang);
    i18n.changeLanguage(newLang);
  };

  // Handle logo click
  const handleLogoClick = () => {
    setCurrentPage(1);
    router.push(shopDetails?.baseUrl || "/");
  };

  return (
    <header
      className={cn(
        "sticky top-0 left-0 w-full z-50 transition-shadow duration-150 bg-white dark:bg-gray-900 shadow-none mx-auto",
        {
          "shadow-md": scrollY > 20,
        }
      )}
    >
      {/* Top marquee section */}
      {shopDetails?.message_on_top && (
        <div className="bg-blue-zatiq sticky top-0 z-999">
          <div className="container">
            <TopbarMessage
              message={shopDetails.message_on_top}
              marqueeStyle="py-2 md:py-[11px] md:pt-[13px] text-white"
              textStyle="font-inter text-sm md:text-base font-semibold"
            />
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div className="w-full bg-white dark:bg-gray-900 py-2 md:py-3">
        <div className="container flex items-center justify-between gap-4 md:gap-6">
          {/* Logo */}
          {shopDetails?.shop_name && shopDetails?.image_url && (
            <div
              onClick={handleLogoClick}
              className="cursor-pointer flex items-center gap-0 sm:gap-4 shrink-0"
            >
              {shopDetails?.image_url && (
                <Image
                  height={60}
                  width={60}
                  alt={shopDetails.shop_name}
                  src={shopDetails.image_url}
                  className="max-h-10 md:max-h-12.5 w-auto object-left object-contain transition-all duration-300 hover:opacity-80 hover:scale-105 cursor-pointer"
                />
              )}
            </div>
          )}

          {/* Search Button (centered, only on md+) */}
          <div className="hidden md:flex flex-1 justify-center w-full max-w-2xl px-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-400 hover:border-blue-zatiq hover:text-blue-zatiq transition-colors cursor-pointer bg-white dark:bg-gray-800"
            >
              <Search size={18} />
              <span className="text-sm">Search products...</span>
            </button>
          </div>

          {/* Language Switch + Cart */}
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            {/* Mobile Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-blue-zatiq transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Email and Phone (mobile only) */}
            <ul className="md:hidden flex items-center gap-2 md:gap-3">
              {shopDetails?.shop_email && (
                <li className="flex items-center gap-1">
                  <Link
                    href={`mailto:${shopDetails.shop_email}`}
                    className="transition-all duration-100 hover:scale-125 hover:text-gray-600 dark:hover:text-blue-zatiq"
                  >
                    <Mail size={16} className="md:size-4.5 transition-colors" />
                  </Link>
                </li>
              )}
              {shopDetails?.shop_phone && (
                <li className="flex items-center gap-1">
                  <Link
                    href={`tel:${shopDetails.shop_phone}`}
                    className="transition-all duration-100 hover:scale-125 hover:text-gray-600 dark:hover:text-blue-zatiq"
                  >
                    <Phone
                      size={16}
                      className="md:size-4.5 transition-colors"
                    />
                  </Link>
                </li>
              )}
            </ul>

            {/* Language Switch */}
            <div
              onClick={handleLanguageChange}
              className="flex items-center gap-1 cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-zatiq"
            >
              <Globe size={16} className="md:size-4" />
              <span className="text-xs md:text-sm">
                {langValue.toUpperCase()}
              </span>
            </div>

            {/* Cart Icon */}
            <button
              onClick={() =>
                router.push(`${shopDetails?.baseUrl || ""}/checkout`)
              }
              className="relative w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:text-blue-zatiq cursor-pointer transition-colors"
            >
              <ShoppingCart size={20} className="md:size-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] md:text-[10px] font-bold w-3 h-3 md:w-4 md:h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <BasicSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
}

// Export as default
export default BasicHeader;
