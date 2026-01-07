"use client";

import { convertSettingsKeys } from "@/lib/settings-utils";
import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";

interface TermsHero2Settings {
  backgroundColor?: string;
  textColor?: string;
  headline?: string;
  subheadline?: string;
  description?: string;
  lastUpdated?: string;
  showBreadcrumb?: boolean;
}

interface TermsHero2Props {
  settings?: TermsHero2Settings;
}

export default function TermsHero2({ settings = {} }: TermsHero2Props) {
  const s = convertSettingsKeys(
    settings as Record<string, unknown>
  ) as TermsHero2Settings;

  // If no headline provided, don't render
  if (!s.headline) return null;

  return (
    <section
      className="relative py-16 md:py-20"
      style={{ backgroundColor: s.backgroundColor || "#f8fafc" }}
    >
      <div className="container px-4 2xl:px-0">
        {/* Breadcrumb */}
        {s.showBreadcrumb && (
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li className="text-gray-400">
                <ChevronRight className="w-4 h-4" />
              </li>
              <li>
                <span
                  className="font-medium"
                  style={{ color: s.textColor || "#111827" }}
                >
                  Terms and Conditions
                </span>
              </li>
            </ol>
          </nav>
        )}

        <div className="max-w-3xl">
          {/* Icon */}
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{ backgroundColor: (s.textColor || "#2563EB") + "15" }}
          >
            <FileText
              className="w-8 h-8"
              style={{ color: s.textColor || "#2563EB" }}
            />
          </div>

          {/* Subheadline */}
          {s.subheadline && (
            <p
              className="text-sm font-medium tracking-wider uppercase mb-3"
              style={{ color: (s.textColor || "#2563EB") }}
            >
              {s.subheadline}
            </p>
          )}

          {/* Headline */}
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: s.textColor || "#111827" }}
          >
            {s.headline}
          </h1>

          {/* Description */}
          {s.description && (
            <p
              className="text-lg md:text-xl mb-6"
              style={{ color: (s.textColor || "#111827") + "99" }}
            >
              {s.description}
            </p>
          )}

          {/* Last Updated */}
          {s.lastUpdated && (
            <p
              className="text-sm"
              style={{ color: (s.textColor || "#111827") + "66" }}
            >
              Last updated: {s.lastUpdated}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
