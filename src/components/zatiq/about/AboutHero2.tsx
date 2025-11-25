import React from "react";

interface AboutHero2Settings {
  backgroundColor?: string;
  textColor?: string;
  headline?: string;
  subheadline?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  buttonColor?: string;
  image?: string;
  imagePosition?: "left" | "right";
}

interface AboutHero2Props {
  settings?: AboutHero2Settings;
}

const AboutHero2: React.FC<AboutHero2Props> = ({ settings = {} }) => {
  const {
    backgroundColor = "#FFFFFF",
    textColor = "#111827",
    headline = "Building Tomorrow's Solutions Today",
    subheadline = "Our Journey",
    description = "From humble beginnings to becoming a leader in our industry, we've stayed true to our core values of innovation, quality, and customer satisfaction. Our team is dedicated to pushing boundaries and creating experiences that matter.",
    buttonText = "Learn More",
    buttonLink = "#story",
    buttonColor = "#2563EB",
    image = "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800",
    imagePosition = "right",
  } = settings;

  return (
    <section
      className="w-full py-12 md:py-16 lg:py-20"
      style={{ backgroundColor }}
    >
      <div className="max-w-[1440px] mx-auto px-4">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
            imagePosition === "left" ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Text Content */}
          <div
            className={`${imagePosition === "left" ? "lg:order-2" : "lg:order-1"}`}
          >
            <p
              className="text-sm md:text-base font-semibold mb-4"
              style={{ color: buttonColor }}
            >
              {subheadline}
            </p>
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
              style={{ color: textColor }}
            >
              {headline}
            </h1>
            <p
              className="text-base md:text-lg leading-relaxed mb-8"
              style={{ color: textColor, opacity: 0.8 }}
            >
              {description}
            </p>
            {buttonText && buttonLink && (
              <a
                href={buttonLink}
                className="inline-block px-8 py-3 text-white font-semibold rounded-lg transition-all hover:opacity-90"
                style={{ backgroundColor: buttonColor }}
              >
                {buttonText}
              </a>
            )}
          </div>

          {/* Image */}
          <div
            className={`${imagePosition === "left" ? "lg:order-1" : "lg:order-2"}`}
          >
            <img
              src={image}
              alt={headline}
              className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero2;
