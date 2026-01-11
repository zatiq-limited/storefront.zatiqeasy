"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useShopStore } from "@/stores/shopStore";
import { useCartStore, selectTotalItems } from "@/stores/cartStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import { AuroraShoppingCart } from "./aurora-shopping-cart";
import LanguageToggler from "./language-toggler";
import MobileNav from "./mobile-nav";
import SearchModal from "../search/search-modal";
import TopbarMessage from "@/components/ui/topbar-message";

// Custom hook for window scroll position
function useWindowScroll() {
  const [scrollY, setScrollY] = useState(() => {
    if (typeof window !== "undefined") {
      return window.scrollY;
    }
    return 0;
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { y: scrollY };
}

export function AuroraHeader() {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  // Zustand stores
  const { shopDetails, isSearchModalOpen, setSearchModalOpen } = useShopStore();
  const totalProducts = useCartStore(selectTotalItems);

  // Local state
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [langValue, setLangValue] = useState(() => {
    if (typeof window !== "undefined") {
      const storedLocale = localStorage.getItem("locale");
      if (storedLocale) return storedLocale;
    }
    return shopDetails?.default_language_code ?? "en";
  });
  const { y: scrollY } = useWindowScroll();

  const baseUrl = shopDetails?.baseUrl || "";
  const primaryColor =
    shopDetails?.theme_color?.primary_color?.replace(
      /^.{1}.{2}/,
      (match: string) => match.charAt(0) + match.charAt(3)
    ) ?? "#3B82F6";
  const isDark = shopDetails?.shop_theme?.theme_mode === "dark";

  const handleSearchClose = () => {
    setSearchModalOpen(false);
  };

  return (
    <>
      {/* Search Modal */}
      {isSearchModalOpen && (
        <SearchModal isOpen={isSearchModalOpen} onClose={handleSearchClose} />
      )}

      {/* Top marquee section */}
      {shopDetails?.message_on_top && (
        <div className="bg-blue-zatiq">
          <TopbarMessage
            message={shopDetails.message_on_top}
            marqueeStyle="py-2 md:py-[11px] md:pt-[13px] text-white"
            textStyle="font-inter text-sm md:text-base font-semibold"
          />
        </div>
      )}

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={showMobileNav}
        onClose={() => setShowMobileNav(false)}
      />

      {/* Header */}
      <header
        className={cn(
          "h-17.5 md:h-20 sticky w-full top-0 left-0",
          "bg-white dark:bg-black-18 lg:text-black-1.2 text-white z-100",
          "flex items-center justify-center shadow-sm transition-shadow duration-150",
          "md:border-b dark:border-none",
          { "shadow-md": scrollY > 20 }
        )}
      >
        <div className="container relative w-full top-0 left-0 bg-white dark:bg-black-18 lg:text-black-1.2 text-white z-100 flex items-center justify-center shadow-none transition-shadow duration-150">
          <nav className="w-full items-center flex relative">
            <div className="flex items-center justify-between w-full relative">
              {/* Mobile Menu Button */}
              <div
                onClick={() => setShowMobileNav(!showMobileNav)}
                className="font-bold cursor-pointer lg:hidden flex items-center absolute justify-center bg-blue-zatiq/25 rounded-full p-2"
              >
                <Menu size={20} className="text-blue-zatiq" />
              </div>

              {/* Logo & Navigation */}
              <div className="flex items-center justify-center lg:justify-start w-full">
                {shopDetails?.image_url ? (
                  <Link href={baseUrl || "/"}>
                    <FallbackImage
                      height={60}
                      width={200}
                      alt={shopDetails.shop_name || "Shop Logo"}
                      src={shopDetails.image_url}
                      className="max-h-13.5 md:max-h-15 max-w-42.5 object-contain"
                      style={{ width: "auto", height: "auto" }}
                    />
                  </Link>
                ) : (
                  <Link
                    href={baseUrl || "/"}
                    className="text-[22px] lg:text-[28px] font-bold text-white lg:text-black-1.2 block"
                  >
                    <h1 className="text-black-2 dark:text-gray-200">
                      {shopDetails?.shop_name}
                    </h1>
                  </Link>
                )}

                {/* Desktop Navigation Links */}
                <div className="lg:flex font-medium items-center justify-center w-full text-gray-800 dark:text-gray-200 gap-9.5 hidden text-base uppercase leading-5">
                  <Link href={`${baseUrl}/products`}>{t("products")}</Link>
                  <Link href={`${baseUrl}/categories`}>{t("categories")}</Link>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-4 justify-self-end absolute lg:relative right-0">
                {/* Cart Button */}
                <button
                  onClick={() => router.push(`${baseUrl}/checkout`)}
                  className="items-center relative justify-center flex p-2 rounded-full cursor-pointer"
                  aria-label="Go to cart"
                >
                  <AuroraShoppingCart
                    fill={
                      totalProducts > 0
                        ? primaryColor
                        : isDark
                        ? "#E5E7EB"
                        : "#4B5563"
                    }
                  />
                  {totalProducts > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-zatiq font-bold text-[10px] rounded-full p-2 text-white w-5 h-5 flex items-center justify-center">
                      {totalProducts}
                    </span>
                  )}
                </button>

                {/* Search Button */}
                <button
                  className="cursor-pointer"
                  onClick={() => setSearchModalOpen(!isSearchModalOpen)}
                  aria-label="Open search"
                >
                  <Search
                    className="text-black-1.1 dark:text-gray-200"
                    strokeWidth={2}
                  />
                </button>

                {/* Language Toggle */}
                <LanguageToggler
                  langValue={langValue}
                  setLangValue={setLangValue}
                  i18n={i18n}
                  className="hidden lg:flex"
                />
              </div>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}

export default AuroraHeader;
