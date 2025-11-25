import React from "react";

interface Value {
  image?: string;
  title: string;
  description: string;
}

interface AboutValues2Settings {
  backgroundColor?: string;
  textColor?: string;
  title?: string;
  subtitle?: string;
}

interface AboutValues2Props {
  settings?: AboutValues2Settings;
  blocks?: Array<{ settings?: Value } | Value>;
}

const AboutValues2: React.FC<AboutValues2Props> = ({
  settings = {},
  blocks = [],
}) => {
  const {
    backgroundColor = "#F9FAFB",
    textColor = "#111827",
    title = "What We Stand For",
    subtitle = "Our commitment to excellence in every aspect",
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

        {/* Values List */}
        <div className="space-y-8 md:space-y-12">
          {values.map((value, index) => (
            <div
              key={index}
              className={`grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-center ${
                index % 2 !== 0 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Image */}
              {value.image && (
                <div
                  className={`lg:col-span-2 ${
                    index % 2 !== 0 ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <img
                    src={value.image}
                    alt={value.title}
                    className="w-full h-[250px] md:h-[300px] object-cover rounded-xl shadow-md"
                  />
                </div>
              )}

              {/* Content */}
              <div
                className={`${
                  value.image ? "lg:col-span-3" : "lg:col-span-5"
                } ${index % 2 !== 0 ? "lg:order-1" : "lg:order-2"}`}
              >
                <div
                  className="text-6xl md:text-7xl font-bold mb-4"
                  style={{ color: textColor, opacity: 0.1 }}
                >
                  0{index + 1}
                </div>
                <h3
                  className="text-2xl md:text-3xl font-bold mb-4"
                  style={{ color: textColor }}
                >
                  {value.title}
                </h3>
                <p
                  className="text-base md:text-lg leading-relaxed"
                  style={{ color: textColor, opacity: 0.7 }}
                >
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutValues2;
