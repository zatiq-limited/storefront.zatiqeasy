"use client";

import { useParams } from "next/navigation";
import { useShopProfile } from "@/hooks";
import { useShopCustomPages } from "@/hooks/useShopCustomPages";
import { useShopStore } from "@/stores/shopStore";
import { FallbackImage } from "@/components/ui/fallback-image";
import { PageLoading } from "@/components/shared/page-loading";
import { ErrorComponent } from "@/components/shared/error-component";
import { useEffect } from "react";
import type { ShopProfile } from "@/types";
import "react-quill/dist/quill.snow.css";

/**
 * Merchant About Us Page
 * Matches old project: themes/basic/modules/shop-pages/about-us.module.tsx
 */
export default function MerchantAboutUsPage() {
  const params = useParams();
  const shopId = params?.shopId as string;
  const { shopDetails, setShopDetails } = useShopStore();

  // Fetch shop profile
  const {
    data: shopProfile,
    isLoading: isProfileLoading,
    error: profileError,
    refetch,
  } = useShopProfile({ shopId });

  // Use store data if available, otherwise use fetched data
  const hasShopData = shopDetails && shopDetails.id === Number(shopId);
  const activeShopData = hasShopData ? shopDetails : shopProfile;

  // Fetch custom pages (about_us content) - use shopId from URL directly
  const { data: customPages, isLoading: isCustomPagesLoading } =
    useShopCustomPages(shopId);

  // Set shop details in store
  useEffect(() => {
    if (shopProfile && !hasShopData) {
      setShopDetails(shopProfile as unknown as ShopProfile);
    }
  }, [shopProfile, hasShopData, setShopDetails]);

  // Loading state
  if (isProfileLoading || isCustomPagesLoading) {
    return <PageLoading />;
  }

  // Error state
  if (profileError) {
    return <ErrorComponent error={profileError.message} retry={refetch} />;
  }

  if (!activeShopData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Shop not found</p>
      </div>
    );
  }

  const aboutUsContent = customPages?.about_us;

  return (
    <div className="container pt-16 pb-10">
      <div className="flex flex-col gap-3 rounded-xl max-w-7xl mx-auto dark:text-gray-200 p-4">
        {/* Shop Info Card */}
        <div className="flex flex-col md:flex-row gap-3 p-3 pb-6 shadow-md bg-blue-zatiq/10 rounded-2xl md:items-center">
          {/* Shop Logo */}
          <div>
            <FallbackImage
              src={activeShopData?.image_url || "/images/default.webp"}
              className="w-25 h-25 md:w-37.5 md:h-37.5 object-contain"
              alt={activeShopData?.shop_name || "Shop"}
              width={150}
              height={150}
            />
          </div>

          {/* Shop Details */}
          <div className="flex flex-col justify-center dark:text-gray-200 text-black-2">
            {/* Shop Name */}
            <div className="flex gap-2">
              <div className="text-[18px] md:text-[24px] lg:text-[28px] font-bold">
                {activeShopData?.shop_name || "N/A"}
              </div>
            </div>

            {/* Address */}
            <div className="flex gap-2">
              <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold">
                Address:
              </div>
              <div className="text-[14px] md:text-[16px] lg:text-[20px] font-normal">
                {activeShopData?.address || "N/A"}
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-2">
              <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold">
                Phone:
              </div>
              <div className="text-[14px] md:text-[16px] lg:text-[20px] font-normal">
                {activeShopData?.shop_phone || "N/A"}
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-2">
              <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold">
                Email:
              </div>
              <div className="text-[14px] md:text-[16px] lg:text-[20px] font-normal">
                {activeShopData?.shop_email || "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* About Us Content */}
        {isCustomPagesLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : aboutUsContent ? (
          <div
            className="ql-editor dark:text-gray-200 text-black-2 ql-snow"
            dangerouslySetInnerHTML={{ __html: aboutUsContent }}
          />
        ) : activeShopData?.details ? (
          <div className="dark:text-gray-200 text-black-2 whitespace-pre-wrap">
            {activeShopData.details}
          </div>
        ) : null}
      </div>
    </div>
  );
}
