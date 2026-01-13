/**
 * Collection Breadcrumb 1
 * Modern elevated breadcrumb with smooth transitions and enhanced UX
 * Enhanced design matching Astro version
 */

"use client";

import Link from "next/link";
import { convertSettingsKeys } from "@/lib/settings-utils";
import type { CollectionDetails as Collection } from "@/hooks/useCollectionDetails";

interface CollectionBreadcrumb1Props {
  settings?: Record<string, unknown>;
  collection: Collection;
}

interface CollectionBreadcrumb1Settings {
  showHome?: boolean;
  showCollections?: boolean;
  showProductCount?: boolean;
  backgroundColor?: string;
  textColor?: string;
  activeColor?: string;
  separatorColor?: string;
  hoverColor?: string;
  borderRadius?: string;
  shadowSize?: string;
}

export default function CollectionBreadcrumb1({
  settings = {},
  collection,
}: CollectionBreadcrumb1Props) {
  const s = convertSettingsKeys<CollectionBreadcrumb1Settings>(settings);

  const breadcrumbItems = [
    ...(s.showHome
      ? [
          {
            label: "Home",
            href: "/",
            icon: (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            ),
          },
        ]
      : []),
    ...(s.showCollections
      ? [
          {
            label: "Collections",
            href: "/collections",
            icon: (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            ),
          },
        ]
      : []),
  ];

  return (
    <nav
      className="sticky top-0 z-40 backdrop-blur-lg border-b transition-all duration-300"
      style={{
        backgroundColor: s.backgroundColor
          ? `${s.backgroundColor}F0`
          : "#ffffffF0",
        borderColor: s.separatorColor ? `${s.separatorColor}30` : "#e5e7eb30",
        boxShadow:
          s.shadowSize === "none"
            ? "none"
            : s.shadowSize === "sm"
            ? "0 1px 3px rgba(0,0,0,0.05)"
            : s.shadowSize === "lg"
            ? "0 4px 20px rgba(0,0,0,0.08)"
            : "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <div className="container">
        <div className="flex items-center justify-between py-4">
          <ol className="flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base">
            {breadcrumbItems.map((item, index) => (
              <li key={item.href} className="flex items-center">
                <Link
                  href={item.href}
                  className="group flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                  style={{
                    color: s.textColor || "#6b7280",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color =
                      s.hoverColor || s.activeColor || "#111827";
                    e.currentTarget.style.backgroundColor = `${
                      s.activeColor || "#111827"
                    }08`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = s.textColor || "#6b7280";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <span className="transform transition-transform group-hover:scale-110">
                    {item.icon}
                  </span>
                  <span className="font-medium hidden sm:inline">
                    {item.label}
                  </span>
                  <span className="font-medium sm:hidden">
                    {item.label.slice(0, 1)}
                  </span>
                </Link>

                <span
                  className="mx-2 text-sm transform transition-transform duration-200"
                  style={{
                    color: s.separatorColor
                      ? `${s.separatorColor}60`
                      : "#9ca3af60",
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </li>
            ))}

            {/* Current Collection */}
            <li className="flex items-center">
              <div
                className="flex items-center space-x-2 px-3 py-2 rounded-lg min-w-0 max-w-xs sm:max-w-md"
                style={{
                  color: s.activeColor || "#111827",
                  backgroundColor: `${s.activeColor || "#111827"}06`,
                }}
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <span className="font-semibold truncate">
                  {collection.name}
                </span>
              </div>

              {s.showProductCount && collection.product_count && (
                <div
                  className="ml-3 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 animate-fadeIn"
                  style={{
                    backgroundColor: `${s.activeColor || "#111827"}10`,
                    color: s.activeColor || "#111827",
                    border: `1px solid ${s.activeColor || "#111827"}20`,
                  }}
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <span>{collection.product_count}</span>
                </div>
              )}
            </li>
          </ol>

          {/* Scroll Progress Indicator */}
          <div className="hidden md:block">
            <div className="w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-blue-500 to-purple-600 rounded-full transform origin-left transition-transform duration-300 scroll-progress"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .scroll-progress {
          transform-origin: left;
        }
      `}</style>

      <script
        dangerouslySetInnerHTML={{
          __html: `
          window.addEventListener('scroll', () => {
            const scrollProgress = document.querySelector('.scroll-progress');
            if (scrollProgress) {
              const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
              const scrollPosition = window.scrollY;
              const progress = Math.min(scrollPosition / scrollHeight, 1);
              scrollProgress.style.transform = 'scaleX(' + progress + ')';
            }
          });
        `,
        }}
      />
    </nav>
  );
}
