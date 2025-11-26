import React from "react";

interface ContactHero1Settings {
  backgroundColor?: string;
  textColor?: string;
  headline?: string;
  subheadline?: string;
  description?: string;
  image?: string;
  overlayOpacity?: number;
}

interface ContactHero1Props {
  settings?: ContactHero1Settings;
}

const ContactHero1: React.FC<ContactHero1Props> = ({ settings = {} }) => {
  const {
    backgroundColor = "#F9FAFB",
    textColor = "#111827",
    headline = "Get In Touch",
    subheadline = "Contact Us",
    description = "Have questions or need assistance? We're here to help.",
    image = "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200",
    overlayOpacity = 0.5,
  } = settings;

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor }}
    >
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[450px]">
        <img
          src={image}
          alt={headline}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />

        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-[1440px] mx-auto px-4 text-center">
            <p className="text-sm md:text-base lg:text-lg font-medium text-white/90 mb-4">
              {subheadline}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
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

export default ContactHero1;
