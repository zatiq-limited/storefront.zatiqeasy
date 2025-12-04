import React from "react";

interface PrivacyHero2Settings {
  backgroundColor?: string;
  textColor?: string;
  headline?: string;
  subheadline?: string;
  description?: string;
  lastUpdated?: string;
  accentColor?: string;
}

interface PrivacyHero2Props {
  settings?: PrivacyHero2Settings;
}

const PrivacyHero2: React.FC<PrivacyHero2Props> = ({ settings = {} }) => {
  const {
    backgroundColor = "#FFFFFF",
    textColor = "#111827",
    headline = "Privacy Policy",
    subheadline = "Your Privacy Matters",
    description = "We are committed to protecting your personal information and your right to privacy.",
    lastUpdated = "December 1, 2025",
    accentColor = "#2563EB",
  } = settings;

  return (
    <section style={{ backgroundColor }}>
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        {/* Breadcrumb */}
        <nav className="py-2 border-b border-gray-100">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <a href="/" className="hover:text-gray-900 transition-colors">
                Home
              </a>
            </li>
            <li className="text-gray-300">/</li>
            <li className="text-gray-900 font-medium">{headline}</li>
          </ol>
        </nav>

        {/* Header Content */}
        <div className="py-6 md:py-8 lg:py-12">
          <div className="max-w-3xl">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-6"
              style={{ backgroundColor: `${accentColor}10`, color: accentColor }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              {subheadline}
            </div>

            {/* Headline */}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              style={{ color: textColor }}
            >
              {headline}
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              {description}
            </p>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>Last updated: {lastUpdated}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>10 min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyHero2;
