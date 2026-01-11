"use client";

import { useAboutUs } from "@/hooks";
import { useAboutUsStore } from "@/stores/aboutUsStore";
import { useShopStore } from "@/stores/shopStore";
import { useShopCustomPages } from "@/hooks/useShopCustomPages";
import BlockRenderer from "@/components/renderers/block-renderer";
import { FallbackImage } from "@/components/ui/fallback-image";
import { PageLoading } from "@/components/shared/page-loading";
import { PageLoader } from "@/components/shared/skeletons/page-skeletons";
import "react-quill/dist/quill.snow.css";

export default function AboutUsPage() {
  const { shopDetails } = useShopStore();
  const { aboutUs } = useAboutUsStore();
  const { isLoading, error } = useAboutUs();

  // Determine theme mode
  const isLegacyTheme = shopDetails?.legacy_theme ?? true;
  const shopId = shopDetails?.id?.toString();

  // Fetch custom pages for legacy themes
  const { data: customPages, isLoading: isCustomPagesLoading } =
    useShopCustomPages(shopId || "", {
      enabled: !!shopId && isLegacyTheme,
    });

  // ========================================
  // STATIC THEME MODE (legacy_theme = true)
  // ========================================
  if (isLegacyTheme) {
    // Loading state
    if (!shopDetails || isCustomPagesLoading) {
      return <PageLoading />;
    }

    const aboutUsContent = customPages?.about_us;

    return (
      <div className="container pt-16 pb-10">
        <div className="flex flex-col gap-3 rounded-xl dark:text-gray-200 py-4">
          {/* Shop Info Card */}
          <div className="flex flex-col md:flex-row gap-3 p-3 pb-6 shadow-md bg-blue-zatiq/10 rounded-2xl md:items-center">
            {/* Shop Logo */}
            <div>
              <FallbackImage
                src={shopDetails?.image_url || "/images/default.webp"}
                className="w-25 h-25 md:w-37.5 md:h-37.5 object-contain"
                alt={shopDetails?.shop_name || "Shop"}
                width={150}
                height={150}
              />
            </div>

            {/* Shop Details */}
            <div className="flex flex-col justify-center dark:text-gray-200 text-black-2">
              {/* Shop Name */}
              <div className="flex gap-2">
                <div className="text-[18px] md:text-[24px] lg:text-[28px] font-bold">
                  {shopDetails?.shop_name || "N/A"}
                </div>
              </div>

              {/* Address */}
              <div className="flex gap-2">
                <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold">
                  Address:
                </div>
                <div className="text-[14px] md:text-[16px] lg:text-[20px] font-normal">
                  {shopDetails?.address || "N/A"}
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-2">
                <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold">
                  Phone:
                </div>
                <div className="text-[14px] md:text-[16px] lg:text-[20px] font-normal">
                  {shopDetails?.shop_phone || "N/A"}
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-2">
                <div className="text-[14px] md:text-[16px] lg:text-[20px] font-bold">
                  Email:
                </div>
                <div className="text-[14px] md:text-[16px] lg:text-[20px] font-normal">
                  {shopDetails?.shop_email || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* About Us Content */}
          {aboutUsContent ? (
            <div
              className="ql-editor dark:text-gray-200 text-black-2 ql-snow px-0!"
              dangerouslySetInnerHTML={{ __html: aboutUsContent }}
            />
          ) : shopDetails?.details ? (
            <div className="dark:text-gray-200 text-black-2 whitespace-pre-wrap">
              {shopDetails.details}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  // ========================================
  // THEME BUILDER MODE (legacy_theme = false)
  // ========================================

  // Show minimal loader while loading
  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <p>Error loading about us page</p>
      </main>
    );
  }

  // Extract sections from aboutUs data
  const pageData = (aboutUs as Record<string, unknown>)?.data || aboutUs || {};
  const sections = (pageData as Record<string, unknown>)?.sections || [];

  return (
    <main className="zatiq-about-us-page">
      {(sections as Array<Record<string, unknown>>).map((section, index) => {
        // Get the first block from each section
        const block = (section.blocks as Array<Record<string, unknown>>)?.[0];
        if (!block || !section.enabled) return null;

        return (
          <BlockRenderer
            key={(section.id as string) || `section-${index}`}
            block={
              block as import("@/components/renderers/block-renderer").Block
            }
            data={(block.data as Record<string, unknown>) || {}}
          />
        );
      })}
    </main>
  );
}
