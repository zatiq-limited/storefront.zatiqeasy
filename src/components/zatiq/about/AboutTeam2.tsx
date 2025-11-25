import React, { useState } from "react";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio?: string;
  quote?: string;
}

interface AboutTeam2Settings {
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  title?: string;
  subtitle?: string;
}

interface AboutTeam2Props {
  settings?: AboutTeam2Settings;
  blocks?: Array<{ settings?: TeamMember } | TeamMember>;
}

const AboutTeam2: React.FC<AboutTeam2Props> = ({
  settings = {},
  blocks = [],
}) => {
  const {
    backgroundColor = "#F9FAFB",
    textColor = "#111827",
    accentColor = "#2563EB",
    title = "Leadership Team",
    subtitle = "Meet the visionaries driving our mission forward",
  } = settings;

  // Handle both flat and nested settings structure
  const teamMembers = blocks.map((block) =>
    "settings" in block && block.settings ? block.settings : block
  ) as TeamMember[];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + teamMembers.length) % teamMembers.length
    );
  };

  if (teamMembers.length === 0) {
    return null;
  }

  const currentMember = teamMembers[currentIndex];

  return (
    <section
      className="w-full py-12 md:py-16 lg:py-20"
      style={{ backgroundColor }}
    >
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: textColor }}
          >
            {title}
          </h2>
          <p
            className="text-base md:text-lg max-w-2xl mx-auto"
            style={{ color: textColor, opacity: 0.7 }}
          >
            {subtitle}
          </p>
        </div>

        {/* Slider */}
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image */}
            <div className="relative">
              <img
                src={currentMember.image}
                alt={currentMember.name}
                className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover rounded-2xl shadow-xl"
              />
            </div>

            {/* Content */}
            <div>
              <div
                className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6"
                style={{ color: accentColor, opacity: 0.1 }}
              >
                {String(currentIndex + 1).padStart(2, "0")}
              </div>

              <h3
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2"
                style={{ color: textColor }}
              >
                {currentMember.name}
              </h3>

              <p
                className="text-lg md:text-xl font-semibold mb-6"
                style={{ color: accentColor }}
              >
                {currentMember.role}
              </p>

              {currentMember.quote && (
                <blockquote className="mb-6 pl-6 border-l-4" style={{ borderColor: accentColor }}>
                  <p
                    className="text-lg md:text-xl italic"
                    style={{ color: textColor, opacity: 0.8 }}
                  >
                    "{currentMember.quote}"
                  </p>
                </blockquote>
              )}

              {currentMember.bio && (
                <p
                  className="text-base md:text-lg leading-relaxed mb-8"
                  style={{ color: textColor, opacity: 0.7 }}
                >
                  {currentMember.bio}
                </p>
              )}

              {/* Navigation */}
              <div className="flex items-center gap-4">
                <button
                  onClick={prevSlide}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-md hover:shadow-lg transition-shadow"
                  style={{ color: textColor }}
                  aria-label="Previous team member"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <div className="flex gap-2">
                  {teamMembers.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex ? "w-8" : ""
                      }`}
                      style={{
                        backgroundColor:
                          index === currentIndex ? accentColor : "#D1D5DB",
                      }}
                      aria-label={`Go to team member ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-md hover:shadow-lg transition-shadow"
                  style={{ color: textColor }}
                  aria-label="Next team member"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div className="mt-12 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {teamMembers.map((member, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative group ${
                index === currentIndex ? "ring-4" : ""
              } rounded-lg overflow-hidden transition-all`}
              style={{
                ringColor: index === currentIndex ? accentColor : "transparent",
              }}
            >
              <img
                src={member.image}
                alt={member.name}
                className={`w-full h-24 object-cover ${
                  index === currentIndex ? "" : "opacity-60"
                } group-hover:opacity-100 transition-opacity`}
              />
              {index === currentIndex && (
                <div
                  className="absolute inset-0 border-4"
                  style={{ borderColor: accentColor }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutTeam2;
