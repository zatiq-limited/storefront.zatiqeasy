/**
 * ========================================
 * COLLECTION BREADCRUMB 2
 * ========================================
 * Navigation Command Center - Multi-function bar
 * Breadcrumb + Quick Actions + View Controls + Share
 */

import React, { useState } from "react";

interface Collection {
  id: number;
  handle: string;
  title: string;
  category_id?: number;
  product_count?: number;
}

interface CollectionBreadcrumb2Props {
  collection: Collection;
  settings?: {
    showHome?: boolean;
    showCategory?: boolean;
    showProductCount?: boolean;
    backgroundColor?: string;
  };
}

const CollectionBreadcrumb2: React.FC<CollectionBreadcrumb2Props> = ({
  collection,
  settings = {},
}) => {
  const {
    showHome = true,
    showCategory = true,
    showProductCount = true,
    backgroundColor = "#fafafa",
  } = settings;

  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out ${collection.title} on ZatiqEasy`;

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm" style={{ backgroundColor }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 gap-4">

          {/* Left: Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-sm min-w-0 flex-1" aria-label="Breadcrumb">
            {showHome && (
              <>
                <a
                  href="/"
                  className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </a>
                <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}

            {showCategory && (
              <>
                <a
                  href="/collections"
                  className="text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0 hidden sm:inline"
                >
                  Collections
                </a>
                <svg className="w-3 h-3 text-gray-400 flex-shrink-0 hidden sm:inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}

            <span className="font-semibold text-gray-900 truncate">
              {collection.title}
            </span>

            {showProductCount && collection.product_count !== undefined && (
              <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold flex-shrink-0">
                {collection.product_count}
              </span>
            )}
          </nav>

          {/* Right: Quick Actions & Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Quick Filter Indicator */}
            <div className="hidden lg:flex items-center gap-1.5">
              <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                All
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                Sale
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                New
              </button>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-6 bg-gray-300"></div>

            {/* View Grid Toggle */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-0.5">
              <button
                className="p-1.5 rounded hover:bg-white transition-colors"
                aria-label="Grid view 3 columns"
                title="3 columns"
              >
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="3" width="6" height="18" rx="1" />
                  <rect x="9" y="3" width="6" height="18" rx="1" />
                  <rect x="16" y="3" width="6" height="18" rx="1" />
                </svg>
              </button>
              <button
                className="p-1.5 rounded bg-white shadow-sm transition-colors"
                aria-label="Grid view 4 columns"
                title="4 columns"
              >
                <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="3" width="4.5" height="18" rx="1" />
                  <rect x="7" y="3" width="4.5" height="18" rx="1" />
                  <rect x="12" y="3" width="4.5" height="18" rx="1" />
                  <rect x="17" y="3" width="4.5" height="18" rx="1" />
                </svg>
              </button>
            </div>

            {/* Share Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Share collection"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </button>

              {/* Share Dropdown Menu */}
              {showShareMenu && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
                  style={{ animation: "fadeInScale 0.2s ease-out" }}
                >
                  {/* Copy Link */}
                  <button
                    onClick={copyLink}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-gray-700">{copied ? "Copied!" : "Copy Link"}</span>
                  </button>

                  <div className="my-1 border-t border-gray-100"></div>

                  {/* Social Share Options */}
                  <button
                    onClick={() => handleShare("facebook")}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="text-gray-700">Share on Facebook</span>
                  </button>

                  <button
                    onClick={() => handleShare("twitter")}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    <span className="text-gray-700">Share on Twitter</span>
                  </button>

                  <button
                    onClick={() => handleShare("whatsapp")}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span className="text-gray-700">Share on WhatsApp</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default CollectionBreadcrumb2;
