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

export function PremiumHeader() {
  const router = useRouter();
  const { t } = useTranslation();
  const { shopDetails } = useShopStore();
  const totalItems = useCartStore(selectTotalItems);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const baseUrl = shopDetails?.baseUrl || "";
  const shopName = shopDetails?.shop_name || "Shop";
  const shopLogo = shopDetails?.image_url;

  // Handle scroll for sticky header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 bg-white dark:bg-black-18 transition-shadow duration-300",
          isScrolled && "shadow-md"
        )}
      >
        <div className="w-[95%] md:w-[90%] lg:w-[85%] max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link
              href={baseUrl || "/"}
              className="flex items-center gap-2"
            >
              {shopLogo ? (
                <FallbackImage
                  src={shopLogo}
                  alt={shopName}
                  width={40}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {shopName}
                </span>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                href={`${baseUrl}/products`}
                className="text-gray-700 dark:text-gray-200 hover:text-blue-zatiq transition-colors font-medium"
              >
                {t("products")}
              </Link>
              <Link
                href={`${baseUrl}/categories`}
                className="text-gray-700 dark:text-gray-200 hover:text-blue-zatiq transition-colors font-medium"
              >
                {t("categories")}
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search size={22} />
              </button>

              {/* Cart Button */}
              <button
                onClick={() => router.push(`${baseUrl}/checkout`)}
                className="relative p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-zatiq text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <PremiumMobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Search Modal */}
      <PremiumSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}

export default PremiumHeader;
