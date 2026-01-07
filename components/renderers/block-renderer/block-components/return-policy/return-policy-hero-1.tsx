"use client";

import { convertSettingsKeys } from "@/lib/settings-utils";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ReturnPolicyHero1Settings {
  backgroundColor?: string;
  textColor?: string;
  headline?: string;
  subheadline?: string;
  description?: string;
  image?: string;
  lastUpdated?: string;
  showBreadcrumb?: boolean;
}

interface ReturnPolicyHero1Props {
  settings?: ReturnPolicyHero1Settings;
}

export default function ReturnPolicyHero1({ settings = {} }: ReturnPolicyHero1Props) {
  const s = convertSettingsKeys(
    settings as Record<string, unknown>
  ) as ReturnPolicyHero1Settings;

  // If no headline provided, don't render
  if (!s.headline) return null;

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image */}
      <div className="relative w-full h-[20vh] sm:h-[35vh]">
        {s.image && (
          <Image
            src={s.image}
            alt={s.headline || "Return and Cancellation Policy"}
            fill
            className="object-cover"
            priority
          />
        )}

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)",
          }}
        />

        {/* Breadcrumb - Upper Left */}
        {s.showBreadcrumb && (
          <div className="absolute top-4 md:top-6 left-0 right-0 z-10">
            <nav className="container px-4 2xl:px-0">
              <ol className="flex items-center gap-1 text-sm text-white/80">
                <li>
                  <Link
                    href="/"
                    className="uppercase tracking-wider text-xs font-medium hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li className="text-white/60">
                  <ChevronRight className="w-3 h-3" />
                </li>
                <li>
                  <span className="uppercase tracking-wider text-xs font-medium text-white">
                    Return Policy
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            {/* Badge */}
            {s.subheadline && (
              <p className="text-xs md:text-sm font-medium text-blue-300 tracking-wider uppercase mb-2">
                {s.subheadline}
              </p>
            )}

            {/* Headline */}
            {s.headline && (
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-4">
                {s.headline}
              </h1>
            )}

            {/* Description */}
            {s.description && (
              <p className="text-sm md:text-base max-w-2xl text-white/80 mb-4">
                {s.description}
              </p>
            )}

            {/* Last Updated */}
            {s.lastUpdated && (
              <p className="text-xs md:text-sm text-white/60">
                Last updated: {s.lastUpdated}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute -bottom-px left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full block"
            preserveAspectRatio="none"
          >
            <path d="M0 60 Q720 20 1440 60 V60 H0 Z" fill="white" />
          </svg>
        </div>
      </div>
    </section>
  );
}
