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
    headline = "Get In Touch",
    subheadline = "Contact Us",
    description = "Have questions or need assistance? We're here to help. Reach out to us and our team will get back to you as soon as possible.",
    accentColor = "#2563EB",
  } = settings;

  return (
    <section className="w-full py-16 md:py-20 lg:py-24" style={{ backgroundColor }}>
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <p
            className="text-sm md:text-base font-semibold uppercase tracking-wider mb-4"
            style={{ color: accentColor }}
          >
            {subheadline}
          </p>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            style={{ color: textColor }}
          >
            {headline}
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600">
            {description}
          </p>
          <div
            className="mt-8 w-24 h-1 mx-auto rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        </div>
      </div>
    </section>
  );
};

export default ContactHero2;
