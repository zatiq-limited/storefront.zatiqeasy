"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, ShoppingBag } from "lucide-react";
import { useShopStore } from "@/stores/shopStore";
import { useCartStore } from "@/stores/cartStore";
import { useLandingStore } from "@/stores/landingStore";
import TopbarMessage from "@/components/ui/topbar-message";

export function ArcadiaNavbar() {
  const { shopDetails } = useShopStore();
  const cartProducts = useCartStore((state) => state.products);
  const { pageData } = useLandingStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = Object.keys(cartProducts).length;
  const baseUrl = shopDetails?.baseUrl || "";

  // Get message on top from theme data
  const messageOnTop = pageData?.theme_data?.[0]?.message_on_top;

  return (
    <>
      {/* Message on Top */}
      {messageOnTop && (
        <TopbarMessage
          message={messageOnTop}
          marqueeStyle="py-2"
          textStyle="text-sm font-medium"
        />
      )}

      {/* Navbar */}
      <nav
        className={`sticky ${
          messageOnTop ? "top-0" : "top-0"
        } w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm border-b border-gray-100`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              {shopDetails?.image_url ? (
                <Link href={baseUrl || "/"} className="group flex items-center gap-3">
                  <div className="z-50">
                    <Image
                      height={48}
                      width={48}
                      alt={shopDetails?.shop_name || "Shop"}
                      src={shopDetails.image_url}
                      className="h-10 md:h-12.5 w-auto max-w-50 object-contain cursor-pointer transition-all duration-300 hover:scale-110 hover:rotate-1 rounded-xs shadow-lg dark:shadow-black/20"
                    />
                  </div>
                  <div className="hidden sm:flex flex-col">
                    <span className="font-inter font-bold text-lg text-landing-primary group-hover:text-landing-primary/80 transition-colors">
                      {shopDetails?.shop_name}
                    </span>
                    <span className="text-xs text-gray-500 font-inter">
                      Premium Shopping Experience
                    </span>
                  </div>
                </Link>
              ) : (
                <Link href={baseUrl || "/"} className="group flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="font-inter font-bold text-xl text-landing-primary group-hover:text-landing-primary/80 transition-colors">
                      {shopDetails?.shop_name || "Shop"}
                    </span>
                    <span className="text-xs text-gray-500">
                      Premium Shopping Experience
                    </span>
                  </div>
                </Link>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-8 font-medium">
                <Link
                  href={`${baseUrl}/products`}
                  className="text-gray-600 hover:text-landing-primary transition-colors"
                >
                  Products
                </Link>
                <Link
                  href={`${baseUrl}/categories`}
                  className="text-gray-600 hover:text-landing-primary transition-colors"
                >
                  Categories
                </Link>
                <Link
                  href={`${baseUrl}/about-us`}
                  className="text-gray-600 hover:text-landing-primary transition-colors"
                >
                  About Us
                </Link>

                <Link
                  href={`${baseUrl}/checkout`}
                  className="items-center justify-center flex p-2 relative bg-blue-zatiq/25 rounded-full"
                >
                  <ShoppingCart size={20} className="text-blue-zatiq" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 bg-blue-zatiq font-bold text-[10px] rounded-full p-2 text-white w-5 h-5 flex items-center justify-center leading-none">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sticky inset-x-0 top-16 md:hidden bg-white border-b border-gray-200 shadow-lg z-40">
          <div className="p-4 space-y-4 text-center">
            <Link
              href={`${baseUrl}/products`}
              className="block py-2 text-gray-600 hover:text-landing-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href={`${baseUrl}/categories`}
              className="block py-2 text-gray-600 hover:text-landing-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              href={`${baseUrl}/about-us`}
              className="block py-2 text-gray-600 hover:text-landing-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>

            <Link
              href={`${baseUrl}/checkout`}
              className="w-full flex items-center justify-center gap-2 bg-landing-primary hover:bg-landing-primary/90 text-white px-6 py-3 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="font-medium">Check Out</span>
              {cartCount > 0 && (
                <span className="bg-white text-landing-primary text-xs font-bold rounded-full px-2 py-0.5">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default ArcadiaNavbar;
