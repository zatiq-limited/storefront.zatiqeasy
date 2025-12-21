"use client";

import { convertSettingsKeys } from "@/lib/settings-utils";

interface PrivacyHero2Settings {
  backgroundColor?: string;
  textColor?: string;
  headline?: string;
  subheadline?: string;
  description?: string;
  lastUpdated?: string;
  accentColor?: string;
  showBreadcrumb?: boolean;
}

interface PrivacyHero2Props {
  settings?: PrivacyHero2Settings;
}

export default function PrivacyHero2({ settings = {} }: PrivacyHero2Props) {
  const s = convertSettingsKeys(settings as Record<string, unknown>) as PrivacyHero2Settings;

  // If no headline provided, don't render
  if (!s.headline) return null;

  return (
    <section
      className="py-16 md:py-20 lg:py-24"
      style={{ backgroundColor: s.backgroundColor || "#FFFFFF" }}
    >
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        {/* Breadcrumb */}
        {s.showBreadcrumb && (
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              <li>
                <a href="/" className="hover:text-gray-900 transition-colors">
                  Home
                </a>
              </li>
              <li>→</li>
              <li className="text-gray-900" style={{ color: s.textColor || "#111827" }}>
                Privacy Policy
              </li>
            </ol>
          </nav>
        )}

        {/* Content */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          {s.subheadline && (
            <div className="mb-4">
              <span
                className="inline-block px-4 py-2 text-sm font-medium rounded-full"
                style={{
                  backgroundColor: (s.accentColor || "#2563EB") + "20",
                  color: s.accentColor || "#2563EB",
                }}
              >
                {s.subheadline}
              </span>
            </div>
          )}

          {/* Headline */}
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            style={{ color: s.textColor || "#111827" }}
          >
            {s.headline}
          </h1>

          {/* Description */}
          {s.description && (
            <p
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
              style={{ color: s.textColor || "#111827", opacity: 0.8 }}
            >
              {s.description}
            </p>
          )}

          {/* Last Updated */}
          {s.lastUpdated && (
            <p
              className="text-sm text-gray-500"
              style={{ color: s.textColor || "#111827", opacity: 0.6 }}
            >
              Last updated: {s.lastUpdated}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}