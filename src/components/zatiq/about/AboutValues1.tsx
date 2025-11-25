import React from "react";

interface Value {
  icon?: string;
  title: string;
  description: string;
}

interface AboutValues1Settings {
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  title?: string;
  subtitle?: string;
}

interface AboutValues1Props {
  settings?: AboutValues1Settings;
  blocks?: Array<{ settings?: Value } | Value>;
}

const AboutValues1: React.FC<AboutValues1Props> = ({
  settings = {},
  blocks = [],
}) => {
  const {
    backgroundColor = "#FFFFFF",
    textColor = "#111827",
    accentColor = "#2563EB",
    title = "Our Core Values",
    subtitle = "The principles that guide everything we do",
  } = settings;

  // Handle both flat and nested settings structure
  const values = blocks.map((block) =>
    "settings" in block && block.settings ? block.settings : block
  ) as Value[];

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

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Icon */}
              {value.icon && (
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: accentColor, opacity: 0.1 }}
                >
                  <span className="text-3xl">{value.icon}</span>
                </div>
              )}

              {/* Title */}
              <h3
                className="text-xl md:text-2xl font-bold mb-3"
                style={{ color: textColor }}
              >
                {value.title}
              </h3>

              {/* Description */}
              <p
                className="text-base leading-relaxed"
                style={{ color: textColor, opacity: 0.7 }}
              >
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutValues1;
