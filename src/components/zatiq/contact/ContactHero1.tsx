import React from "react";

interface ContactHero1Settings {
  backgroundColor?: string;
  textColor?: string;
  headline?: string;
  subheadline?: string;
  description?: string;
  image?: string;
  overlayOpacity?: number;
  accentColor?: string;
}

interface ContactHero1Props {
  settings?: ContactHero1Settings;
}

const ContactHero1: React.FC<ContactHero1Props> = ({ settings = {} }) => {
  const {
    headline,
    subheadline,
    image,
    overlayOpacity = 0.5,
  } = settings;

  // If no headline or image provided, don't render
  if (!headline && !image) return null;

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image */}
      <div className="relative w-full h-[35vh]">
        {image && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
        )}

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgba(0, 0, 0, ${overlayOpacity}) 0%, rgba(0, 0, 0, ${overlayOpacity * 0.7}) 100%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            {/* Badge */}
            {subheadline && (
              <p className="text-xs md:text-sm font-medium text-white/80 tracking-wider uppercase mb-2">
                {subheadline}
              </p>
            )}

            {/* Headline */}
            {headline && (
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
                {headline}
              </h1>
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
            <path
              d="M0 60 Q720 20 1440 60 V60 H0 Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default ContactHero1;
