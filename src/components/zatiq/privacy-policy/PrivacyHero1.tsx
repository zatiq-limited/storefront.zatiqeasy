import React from "react";

interface PrivacyHero1Settings {
  backgroundColor?: string;
  textColor?: string;
  headline?: string;
  subheadline?: string;
  description?: string;
  image?: string;
  lastUpdated?: string;
}

interface PrivacyHero1Props {
  settings?: PrivacyHero1Settings;
}

const PrivacyHero1: React.FC<PrivacyHero1Props> = ({ settings = {} }) => {
  const {
    backgroundColor = "#F9FAFB",
    textColor = "#111827",
    headline = "Privacy Policy",
    subheadline = "Your Privacy Matters",
    description = "We are committed to protecting your personal information and your right to privacy.",
    image = "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=1200&h=400&fit=crop",
    lastUpdated = "December 1, 2025",
  } = settings;

  return (
    <section className="relative w-full overflow-hidden" style={{ backgroundColor }}>
      {/* Background Image with Overlay */}
      <div className="relative w-full h-[280px] md:h-[320px] lg:h-[360px]">
        <img
          src={image}
          alt={headline}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-[1440px] w-full mx-auto px-4 2xl:px-0">
            {/* Breadcrumb */}
            <nav className="mb-4">
              <ol className="flex items-center gap-2 text-sm text-white/70">
                <li>
                  <a href="/" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </li>
                <li className="text-white">{headline}</li>
              </ol>
            </nav>

            {/* Subheadline */}
            <p className="text-sm md:text-base font-medium text-blue-300 mb-2">
              {subheadline}
            </p>

            {/* Headline */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {headline}
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg max-w-2xl text-white/80 mb-4">
              {description}
            </p>

            {/* Last Updated */}
            <p className="text-sm text-white/60">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyHero1;
