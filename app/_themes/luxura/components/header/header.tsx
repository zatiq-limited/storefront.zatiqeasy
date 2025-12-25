"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu, Search, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useShopStore } from "@/stores/shopStore";
import { useCartStore, selectTotalItems } from "@/stores/cartStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import MobileNav from "./mobile-nav";
import { LuxuraSearchModal } from "../search/luxura-search-modal";

// Custom hook for window scroll position
function useWindowScroll() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    setScrollY(window.scrollY);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { y: scrollY };
}

export function LuxuraHeader() {
  const router = useRouter();
  const { t } = useTranslation();

  // Zustand stores
  const { shopDetails, isSearchModalOpen, setSearchModalOpen } = useShopStore();
  const totalProducts = useCartStore(selectTotalItems);

  // Local state
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { y: scrollY } = useWindowScroll();

  const baseUrl = shopDetails?.baseUrl || "";

  return (
    <>
      {/* Search Modal */}
      {isSearchModalOpen && (
        <LuxuraSearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setSearchModalOpen(false)}
          searchText={searchText}
        />
      )}

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={showMobileNav}
        onClose={() => setShowMobileNav(false)}
      />

      {/* Header */}
      <header
        className={cn(
          "h-[70px] md:h-[80px] sticky w-full top-0 left-0",
          "bg-white dark:bg-black-18 lg:text-black-1.2 text-white z-100",
          "flex items-center justify-center shadow-sm transition-shadow duration-150",
          "md:border-b dark:border-b-black-2",
          { "shadow-md": scrollY > 20 }
        )}
      >
        <div className="relative w-[97%] lg:w-[78%] top-0 left-0 bg-white dark:bg-black-18 lg:text-black-1.2 text-white z-100 flex items-center justify-center shadow-none transition-shadow duration-150">
          <nav className="premium-layout-width items-center flex justify-center w-full">
            <div className="w-full flex items-center justify-between">
              {/* Left: Mobile Menu + Logo */}
              <div className="flex items-center gap-2">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setShowMobileNav(!showMobileNav)}
                  className="font-bold cursor-pointer lg:hidden items-center justify-center flex p-4 bg-white dark:bg-black-27 shadow-md rounded-lg"
                  aria-label="Open menu"
                >
                  <Menu size={20} className="text-black-2 dark:text-gray-200" />
                </button>

                {/* Logo */}
                <div>
                  {shopDetails?.image_url ? (
                    <Link href={baseUrl || "/"}>
                      <FallbackImage
                        height={60}
                        width={200}
                        alt={shopDetails.shop_name || "Shop Logo"}
                        src={shopDetails.image_url}
                        className="max-h-[54px] md:max-h-[60px] w-auto max-w-[170px] object-contain"
                      />
                    </Link>
                  ) : (
                    <Link
                      href={baseUrl || "/"}
                      className="text-[22px] lg:text-[28px] font-bold block"
                    >
                      <h1 className="text-black-2 dark:text-gray-100">
                        {shopDetails?.shop_name || "Shop"}
                      </h1>
                    </Link>
                  )}
                </div>
              </div>

              {/* Center: Desktop Search Bar */}
              <div
                onClick={() => setSearchModalOpen(true)}
                className="hidden lg:flex justify-center shadow-md rounded-lg cursor-pointer"
              >
                <input
                  type="text"
                  placeholder={t("search_for_products")}
                  value={searchText}
                  onFocus={() => setSearchModalOpen(true)}
                  readOnly
                  className="w-[500px] h-[55px] bg-white dark:bg-black-18 border border-gray-200 dark:border-gray-700 rounded-l-lg px-4 cursor-pointer"
                />
                <button className="block bg-blue-zatiq rounded-r-lg p-2 px-4 -ml-2">
                  <Search className="text-white" />
                </button>
              </div>

              {/* Right: Search (mobile) + Cart */}
              <div className="flex items-center gap-2 justify-self-end right-0">
                {/* Mobile Search Button */}
                <button
                  className="lg:hidden items-center justify-center flex p-4 relative bg-white dark:bg-black-27 shadow-md rounded-lg"
                  onClick={() => setSearchModalOpen(true)}
                  aria-label="Open search"
                >
                  <Search className="text-black-1.1 dark:text-gray-200" />
                </button>

                {/* Cart Button */}
                <button
                  onClick={() => router.push(`${baseUrl}/checkout`)}
                  className="items-center justify-center flex p-4 relative bg-white dark:bg-black-27 shadow-md rounded-lg cursor-pointer"
                  aria-label="Go to cart"
                >
                  <ShoppingCart
                    size={20}
                    className="text-black-2 dark:text-gray-200"
                  />
                  {totalProducts > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 bg-blue-zatiq font-bold text-[10px] rounded-full p-2 text-white w-5 h-5 flex items-center justify-center leading-none">
                      {totalProducts}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}

export default LuxuraHeader;
