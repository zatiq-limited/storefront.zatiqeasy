/**
 * Collections Hero Component 1
 * Dynamic hero section for collections page
 */

import React from "react";

interface CollectionsHero1Props {
  title?: string;
  subtitle?: string;
  badge?: string;
  backgroundColor?: string;
  textColor?: string;
}

const CollectionsHero1: React.FC<CollectionsHero1Props> = ({
  title = "Discover Your Style",
  subtitle = "Explore our handpicked collections crafted for every occasion and trend",
  badge = "Curated Collections",
  backgroundColor = "#000000",
  textColor = "#ffffff",
}) => {
  return (
    <section
      className="relative text-white py-24 overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`,
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {badge && (
          <div className="inline-block mb-4">
            <span
              className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium uppercase tracking-wider"
              style={{ color: textColor }}
            >
              {badge}
            </span>
          </div>
        )}

        <h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
          style={{ color: textColor }}
        >
          {title}
        </h1>

        <p
          className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed opacity-90"
          style={{ color: textColor }}
        >
          {subtitle}
        </p>
      </div>
    </section>
  );
};

export default CollectionsHero1;
