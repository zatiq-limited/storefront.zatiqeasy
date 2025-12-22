"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, Mail, Phone, Globe, Search, X } from "lucide-react";
import {
  useCartStore,
  useShopStore,
  useProductsStore,
  selectTotalItems,
} from "@/stores";
import { cn } from "@/lib/utils";
import TopbarMessage from "../core/topbar-message";

/**
 * Basic Header Component
 * Migrated from old project design (storefront.zatiqeasy.com)
 */
export function BasicHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get stores
  const { shopDetails } = useShopStore();
  const totalItems = useCartStore(selectTotalItems);
  const { setCurrentPage } = useProductsStore();

  // State
  const [scrollY, setScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState(() => {
    // Initialize search query from URL params
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('search') || '';
    }
    return '';
  });
  const [langValue, setLangValue] = useState(
    shopDetails?.default_language_code || "en"
  );
  const [isLangInitialized, setIsLangInitialized] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize language from localStorage (only runs once on mount)
  if (!isLangInitialized && typeof window !== "undefined") {
    const storedLang = localStorage.getItem("locale");
    if (storedLang && storedLang !== langValue) {
      setLangValue(storedLang);
    }
    setIsLangInitialized(true);
  }

  const handleLanguageChange = () => {
    const newLang = langValue === "en" ? "bn" : "en";
    localStorage.setItem("locale", newLang);
    setLangValue(newLang);
    // TODO: Add i18n.changeLanguage(newLang) when i18n is set up
  };

  // Handle logo click
  const handleLogoClick = () => {
    setCurrentPage(1);
    router.push(shopDetails?.baseUrl || "/");
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Get current URL path (e.g., /merchant/47366/categories/139924)
      const currentPath = window.location.pathname;
      // Create new params preserving existing ones and adding search
      const params = new URLSearchParams(searchParams);
      params.set("search", searchQuery.trim());

      // Build full URL with path and parameters
      const newUrl = `${currentPath}?${params.toString()}`;
      router.push(newUrl);
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery("");

    // Get current URL path (e.g., /merchant/47366/categories/139924)
    const currentPath = window.location.pathname;
    // Update URL to remove search parameter
    const params = new URLSearchParams(searchParams);
    params.delete("search");

    // Build full URL with path and remaining parameters
    const newUrl = params.toString()
      ? `${currentPath}?${params.toString()}`
      : currentPath;
    router.push(newUrl);
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
          <div
            onClick={handleLogoClick}
            className="cursor-pointer flex items-center gap-0 sm:gap-4 shrink-0"
          >
            {shopDetails?.image_url && (
              <Image
                height={60}
                width={60}
                alt={shopDetails.shop_name || "Shop Logo"}
                src={shopDetails.image_url}
                className="max-h-10 md:max-h-12.5 w-auto object-left object-contain transition-all duration-300 hover:opacity-80 hover:scale-105 cursor-pointer"
              />
            )}

            <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white">
              {shopDetails?.shop_name || "Shop"}
            </h1>
          </div>

          {/* Inventory Search (centered, only on md+) */}
          <div className="hidden md:flex flex-1 justify-center w-full max-w-2xl px-4">
            <div className="w-full">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "w-full pl-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-zatiq focus:border-blue-zatiq dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm transition-all",
                    searchQuery ? "pr-20" : "pr-10"
                  )}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-zatiq transition-colors"
                >
                  <Search size={18} />
                </button>
              </form>
            </div>
          </div>

          {/* Language Switch + Cart */}
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
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

      {/* Mobile Search Bar (hidden to match old design - uncomment if needed) */}
      {/* <div className="md:hidden w-full bg-white dark:bg-gray-900 px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-all",
              searchQuery ? "pr-20" : "pr-10"
            )}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600"
          >
            <Search size={18} />
          </button>
        </form>
      </div> */}
    </header>
  );
}

// Export as default
export default BasicHeader;
