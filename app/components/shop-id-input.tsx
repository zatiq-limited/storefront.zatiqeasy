"use client";

import { useState } from "react";
import { useShopStore } from "@/stores";
import type { ShopProfile } from "@/types/shop.types";

export function ShopIdInput() {
  const [shopId, setShopId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const setShopDetails = useShopStore((state) => state.setShopDetails);

  const handleGo = async () => {
    if (!shopId.trim()) return;

    setIsLoading(true);

    // Call Next.js API route (not external API directly)
    const response = await fetch("/api/storefront/v1/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shop_id: shopId,
      }),
    });

    const result = await response.json();

    if (result.success && result.data) {
      setShopDetails(result.data as ShopProfile);
      // Force page refresh to trigger layout changes
      window.location.reload();
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Zatiq Store
          </h1>
          <p className="text-gray-600">
            Enter your shop ID to view your storefront
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <label htmlFor="shopId" className="sr-only">
              Shop ID
            </label>
            <input
              id="shopId"
              name="shopId"
              type="text"
              value={shopId}
              onChange={(e) => setShopId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGo()}
              placeholder="Enter Shop ID (e.g., 47366)"
              disabled={isLoading}
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <button
            onClick={handleGo}
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading...
              </>
            ) : (
              "Go to Shop"
            )}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Don't know your shop ID?{" "}
            <a
              href="/merchant/47366"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Try demo shop
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
