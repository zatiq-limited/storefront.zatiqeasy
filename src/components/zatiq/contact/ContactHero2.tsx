import React from "react";

interface ContactHero2Settings {
  backgroundColor?: string;
  textColor?: string;
  headline?: string;
  subheadline?: string;
  description?: string;
  accentColor?: string;
}

interface ContactHero2Props {
  settings?: ContactHero2Settings;
}

const ContactHero2: React.FC<ContactHero2Props> = ({ settings = {} }) => {
  const {
    backgroundColor = "#FFFFFF",
    textColor = "#111827",
    headline = "Contact Us",
    subheadline = "Get in Touch",
    description = "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    accentColor = "#111827",
  } = settings;

  return (
    <section
      className="w-full pt-12 pb-8 md:pt-16 md:pb-12"
      style={{ backgroundColor }}
    >
      <div className="max-w-[800px] mx-auto px-4 text-center">
        {/* Subheadline */}
        <p
          className="text-sm font-medium uppercase tracking-wider mb-3"
          style={{ color: accentColor }}
        >
          {subheadline}
        </p>

        {/* Headline */}
        <h1
          className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4"
          style={{ color: textColor }}
        >
          {headline}
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  );
};

export default ContactHero2;
