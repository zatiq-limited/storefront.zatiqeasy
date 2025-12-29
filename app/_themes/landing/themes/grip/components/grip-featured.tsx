"use client";

import { ArrowRight } from "lucide-react";
import { FallbackImage } from "@/components/ui/fallback-image";
import type { ContentInterface } from "@/types/landing-page.types";

interface GripFeaturedProps {
  content: ContentInterface[] | null | undefined;
  onBuyNow?: (link: string | null) => void;
}

interface FeatureSectionProps {
  banner: ContentInterface;
  index: number;
  onBuyNow?: (link: string | null) => void;
}

export function GripFeatured({ content, onBuyNow }: GripFeaturedProps) {
  // Early return if no content
  if (!content || content.length === 0) return null;

  return (
    <div className="mx-auto w-full pb-10 md:pb-16 lg:pb-24 xl:pb-28 space-y-10">
      {content.map((banner, index) => (
        <FeatureSection key={index} banner={banner} index={index} onBuyNow={onBuyNow} />
      ))}
    </div>
  );
}

// Feature Section Component
function FeatureSection({ banner, index, onBuyNow }: FeatureSectionProps) {
  // Determine layout order based on index (alternating layout)
  const isEvenIndex = index % 2 === 0;
  const contentOrder = isEvenIndex ? "lg:order-1" : "lg:order-2";
  const imageOrder = isEvenIndex ? "lg:order-2" : "lg:order-1";

  return (
    <section>
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8 items-center">
          {/* Content Section */}
          <div
            className={`space-y-6 xl:col-span-2 bg-[#F5F7FA] dark:bg-gray-800 rounded-2xl px-6 md:px-10 lg:px-14 py-12 md:py-16 lg:py-20 h-full flex flex-col justify-center ${contentOrder}`}
          >
            <FeatureContent banner={banner} onBuyNow={onBuyNow} />
          </div>

          {/* Image Section */}
          <div className={`relative h-full ${imageOrder}`}>
            <FeatureImage banner={banner} />
          </div>
        </div>
      </div>
    </section>
  );
}

// Feature Content Component
function FeatureContent({ banner, onBuyNow }: { banner: ContentInterface; onBuyNow?: (link: string | null) => void }) {
  return (
    <>
      {/* Title and Subtitle */}
      <FeatureTitle title={banner.title} subtitle={banner.subtitle} />

      {/* Description */}
      {banner.description && (
        <p className="lg:text-lg leading-relaxed text-grip-grey dark:text-gray-300">
          {banner.description}
        </p>
      )}

      {/* Call-to-Action Button */}
      {banner.link && (
        <div className="pt-8">
          <ActionButton
            link={banner.link}
            buttonText={banner.button_text}
            onBuyNow={onBuyNow}
          />
        </div>
      )}
    </>
  );
}

// Feature Title Component
function FeatureTitle({ title, subtitle }: { title?: string | null; subtitle?: string | null }) {
  return (
    <div className="space-y-4">
      {title && (
        <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-grip-black dark:text-white leading-tight">
          {title}
        </h2>
      )}
      {subtitle && (
        <h3 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium text-grip-black dark:text-gray-200">
          {subtitle}
        </h3>
      )}
    </div>
  );
}

// Action Button Component
function ActionButton({
  link,
  buttonText,
  onBuyNow
}: {
  link: string;
  buttonText?: string | null;
  onBuyNow?: (link: string | null) => void;
}) {
  const handleClick = () => {
    if (link === "buy-now") {
      onBuyNow?.(link);
    } else {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
    >
      {buttonText || "Learn More"}
      <ArrowRight className="w-4 h-4" />
    </button>
  );
}

// Feature Image Component
function FeatureImage({ banner }: { banner: ContentInterface }) {
  return (
    <div className="aspect-[1/1] rounded-3xl overflow-hidden shadow-2xl">
      <FallbackImage
        src={banner?.image_url ?? "/images/placeholder.png"}
        alt={banner?.title ?? "Feature image"}
        width={600}
        height={600}
        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
      />
    </div>
  );
}

export default GripFeatured;
