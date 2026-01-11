"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { useCartStore, selectTotalItems } from "@/stores/cartStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import { cn } from "@/lib/utils";
import { PremiumMobileNav } from "./mobile-nav";
import { PremiumSearchModal } from "../search/premium-search-modal";
import { LanguageToggler } from "./language-toggler";

export function PremiumHeader() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { shopDetails } = useShopStore();
  const totalItems = useCartStore(selectTotalItems);

  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // Initialize language from localStorage or shop default
  const [langValue, setLangValue] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("locale") ||
        shopDetails?.default_language_code ||
        "en"
      );
    }
    return shopDetails?.default_language_code || "en";
  });

  const baseUrl = shopDetails?.baseUrl || "";
  const shopName = shopDetails?.shop_name || "Shop";
  const shopLogo = shopDetails?.image_url;

  // Handle scroll for sticky header shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Search Modal */}
      {isSearchOpen && (
        <PremiumSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      )}

      {/* Mobile Navigation */}
      <PremiumMobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <header
        className={cn(
          "h-[70px] md:h-[80px] sticky w-full top-0 left-0 bg-white dark:bg-black-18 lg:text-black-1.2 text-white z-[100] flex items-center justify-center shadow-sm transition-shadow duration-150 md:border-b dark:border-b-black-2",
          {
            "shadow-md": scrollY > 20,
          }
        )}
      >
        <div className="relative w-full top-0 left-0 bg-white dark:bg-black-18 lg:text-black-1.2 text-white z-[100] flex items-center justify-center shadow-none transition-shadow duration-150">
          <nav className="container items-center flex">
            <div className="relative flex items-center justify-between w-full">
              {/* Mobile Menu Button */}
              <div
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="font-bold cursor-pointer lg:hidden flex absolute items-center justify-center bg-blue-zatiq/25 rounded-full p-2"
              >
                <Menu size={20} className="text-blue-zatiq" />
              </div>

              {/* Logo and Navigation */}
              <div className="flex items-center justify-center lg:justify-start w-full">
                {shopLogo ? (
                  <Link href={baseUrl || "/"}>
                    <FallbackImage
                      height={60}
                      width={200}
                      alt={shopName}
                      src={shopLogo}
                      className="max-h-[54px] md:max-h-[60px] max-w-[170px] object-contain"
                      style={{ width: "auto", height: "auto" }}
                    />
                  </Link>
                ) : (
                  <Link
                    href={baseUrl || "/"}
                    className="text-[22px] lg:text-[28px] font-bold text-white lg:text-black-1.2 block"
                  >
                    <h1 className="text-black-2 dark:text-gray-100">
                      {shopName}
                    </h1>
                  </Link>
                )}

                {/* Desktop Navigation Links */}
                <div className="lg:flex font-medium pl-[70.5px] items-center text-[#1F2937] gap-[38px] hidden text-[16px] uppercase leading-[20px]">
                  <Link
                    href={`${baseUrl}/products`}
                    className="dark:text-gray-200 hover:text-blue-zatiq transition-colors"
                  >
                    {t("products")}
                  </Link>
                  <Link
                    href={`${baseUrl}/categories`}
                    className="dark:text-gray-200 hover:text-blue-zatiq transition-colors"
                  >
                    {t("categories")}
                  </Link>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-4 justify-self-end absolute right-0">
                {/* Search Button */}
                <button
                  className="cursor-pointer"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  aria-label="Search"
                >
                  <Search className="text-black-1.1 dark:text-gray-200" />
                </button>

                {/* Cart Button */}
                <button
                  onClick={() => router.push(`${baseUrl}/checkout`)}
                  className="items-center justify-center flex p-2 relative bg-blue-zatiq/25 rounded-full cursor-pointer"
                  aria-label="Cart"
                >
                  <ShoppingCart size={20} className="text-blue-zatiq" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 bg-blue-zatiq font-bold text-[10px] rounded-full p-2 text-white w-5 h-5 flex items-center justify-center leading-none">
                      {totalItems}
                    </span>
                  )}
                </button>

                {/* Language Toggler */}
                <LanguageToggler
                  className="hidden lg:flex"
                  langValue={langValue}
                  setLangValue={setLangValue}
                  i18n={i18n}
                />
              </div>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}

export default PremiumHeader;
