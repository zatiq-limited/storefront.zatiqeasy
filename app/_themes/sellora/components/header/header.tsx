"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Search, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShopStore } from "@/stores/shopStore";
import { useCartStore, selectTotalItems } from "@/stores/cartStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import { cn } from "@/lib/utils";
import { SelloraMobileNav } from "./mobile-nav";
import { SelloraSearchModal } from "../sections/search-modal";
import TopbarMessage from "@/components/ui/topbar-message";
import LanguageToggler from "./language-toggler";

export function SelloraHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { t, i18n } = useTranslation();
  const { shopDetails } = useShopStore();
  const totalItems = useCartStore(selectTotalItems);

  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [langValue, setLangValue] = useState(() => {
    if (typeof window !== "undefined") {
      const storedLocale = localStorage.getItem("locale");
      if (storedLocale) return storedLocale;
    }
    return shopDetails?.default_language_code ?? "en";
  });

  const baseUrl = shopDetails?.baseUrl || "";
  const shopName = shopDetails?.shop_name || "Shop";
  const shopLogo = shopDetails?.image_url;

  // Check if current page is home page or products page (not product details)
  const isHomePage =
    pathname === "/" || pathname === baseUrl || pathname === `${baseUrl}/`;
  const isProductsPage =
    pathname?.includes("/products") && !pathname?.includes("/products/");
  const shouldUseLightText = (isHomePage || isProductsPage) && scrollY <= 20;

  // Handle scroll
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
      <SelloraSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Top marquee section */}
      {shopDetails?.message_on_top && (
        <div className="bg-blue-zatiq">
          <div className="container">
            <TopbarMessage
              message={shopDetails.message_on_top}
              marqueeStyle="py-2 md:py-[11px] md:pt-[13px] text-white"
              textStyle="font-inter text-sm md:text-base font-semibold"
            />
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      <SelloraMobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <header
        className={cn(
          `h-12 md:h-20 w-full ${
            pathname.includes("/single-product") ? "sticky" : "fixed"
          }  top-8.5 sm:top-12 left-0 z-50 flex items-center justify-center transition-all duration-300`,
          {
            "bg-white top-0! shadow-sm": scrollY > 20,
            "bg-white/5 dark:bg-black-18/40 backdrop-blur-sm": scrollY <= 20,
          }
        )}
      >
        <div className="relative w-full top-0 left-0 z-50 flex items-center justify-center transition-all duration-300">
          <nav className="container w-full items-center flex relative">
            <div className="flex items-center justify-between w-full relative">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden flex items-center justify-center rounded-full p-2 transition-all duration-300 hover:bg-blue-zatiq/10 absolute"
              >
                <Menu
                  size={20}
                  className={cn(
                    "transition-colors duration-300 size-4 sm:size-5",
                    {
                      "text-gray-300": shouldUseLightText,
                      "text-gray-800 dark:text-gray-200":
                        !shouldUseLightText && scrollY <= 20,
                      "text-gray-800": scrollY > 20,
                    }
                  )}
                />
              </button>

              {/* Logo */}
              <div className="flex items-center justify-center lg:justify-start w-full">
                <Link href={baseUrl || "/"}>
                  {shopLogo ? (
                    <FallbackImage
                      height={60}
                      width={200}
                      alt={shopName}
                      src={shopLogo}
                      className="max-h-11 md:max-h-14 w-auto object-contain p-1"
                    />
                  ) : (
                    <h1
                      className={cn(
                        "text-[22px] lg:text-[28px] font-bold transition-colors duration-300",
                        {
                          "text-gray-300": shouldUseLightText,
                          "text-gray-800 dark:text-gray-200":
                            !shouldUseLightText,
                        }
                      )}
                    >
                      {shopName}
                    </h1>
                  )}
                </Link>

                {/* Desktop Navigation */}
                <div
                  className={cn(
                    "lg:flex font-semibold items-center justify-center w-full hidden text-base transition-colors duration-300",
                    {
                      "text-gray-300": shouldUseLightText,
                      "text-gray-900 dark:text-gray-200":
                        !shouldUseLightText && scrollY <= 20,
                      "text-gray-900": scrollY > 20,
                    }
                  )}
                >
                  <Link
                    href={`${baseUrl}/products`}
                    className="px-5 hover:text-blue-zatiq transition-colors duration-200"
                  >
                    {t("products")}
                  </Link>
                  <Link
                    href={`${baseUrl}/categories`}
                    className="px-5 hover:text-blue-zatiq transition-colors duration-200"
                  >
                    {t("categories")}
                  </Link>
                  <Link
                    href={`${baseUrl}/about-us`}
                    className="px-5 hover:text-blue-zatiq transition-colors duration-200"
                  >
                    {t("about_us")}
                  </Link>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-4 justify-self-end absolute lg:relative right-0">
                {/* Cart Button */}
                <button
                  onClick={() => router.push(`${baseUrl}/checkout`)}
                  className="items-center relative justify-center flex p-2 rounded-full cursor-pointer hover:bg-blue-zatiq/10 transition-all duration-200"
                >
                  <ShoppingCart
                    size={20}
                    className={cn(
                      "transition-colors duration-300 size-4 sm:size-5",
                      {
                        "text-gray-300": shouldUseLightText,
                        "text-gray-800 dark:text-gray-200":
                          !shouldUseLightText && scrollY <= 20,
                        "text-gray-800": scrollY > 20,
                      }
                    )}
                  />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-zatiq font-bold text-[10px] rounded-full p-1 sm:p-2 text-white w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </button>

                {/* Search Button */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="cursor-pointer p-2 rounded-full hover:bg-blue-zatiq/10 transition-all duration-200"
                >
                  <Search
                    size={20}
                    className={cn(
                      "transition-colors duration-300 size-4 sm:size-5",
                      {
                        "text-gray-300": shouldUseLightText,
                        "text-gray-800 dark:text-gray-200":
                          !shouldUseLightText && scrollY <= 20,
                        "text-gray-800": scrollY > 20,
                      }
                    )}
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

export default SelloraHeader;
