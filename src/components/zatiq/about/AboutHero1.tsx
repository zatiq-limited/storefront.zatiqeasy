import React from "react";

interface AboutHero1Settings {
  backgroundColor?: string;
  textColor?: string;
  headline?: string;
  subheadline?: string;
  description?: string;
  image?: string;
  overlayOpacity?: number;
}

interface AboutHero1Props {
  settings?: AboutHero1Settings;
}

const AboutHero1: React.FC<AboutHero1Props> = ({ settings = {} }) => {
  const {
    backgroundColor = "#F9FAFB",
    textColor = "#111827",
    headline = "About Our Story",
    subheadline = "Crafting Excellence Since 2010",
    description = "We're passionate about delivering quality products and exceptional service to our customers worldwide.",
    image = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200",
    overlayOpacity = 0.4,
  } = settings;

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Background Image with Overlay */}
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
        <img
          src={image}
          alt={headline}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-[1440px] mx-auto px-4 text-center">
            <p className="text-sm md:text-base lg:text-lg font-medium text-white/90 mb-4">
              {subheadline}
            </p>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              style={{ color: "#FFFFFF" }}
            >
              {headline}
            </h1>
            <p className="text-base md:text-lg lg:text-xl max-w-3xl mx-auto text-white/90">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero1;
