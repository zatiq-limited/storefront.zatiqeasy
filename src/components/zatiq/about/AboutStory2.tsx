import React from "react";

interface StoryBlock {
  image: string;
  title: string;
  description: string;
}

interface AboutStory2Settings {
  backgroundColor?: string;
  textColor?: string;
  title?: string;
  subtitle?: string;
}

interface AboutStory2Props {
  settings?: AboutStory2Settings;
  blocks?: Array<{ settings?: StoryBlock } | StoryBlock>;
}

const AboutStory2: React.FC<AboutStory2Props> = ({
  settings = {},
  blocks = [],
}) => {
  const {
    backgroundColor = "#F9FAFB",
    textColor = "#111827",
    title = "Our Story",
    subtitle = "The journey that defines us",
  } = settings;

  // Handle both flat and nested settings structure
  const storyBlocks = blocks.map((block) =>
    "settings" in block && block.settings ? block.settings : block
  ) as StoryBlock[];

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

        {/* Story Blocks */}
        <div className="space-y-12 md:space-y-16 lg:space-y-20">
          {storyBlocks.map((block, index) => (
            <div
              key={index}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                index % 2 !== 0 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Image */}
              <div
                className={`${index % 2 !== 0 ? "lg:order-2" : "lg:order-1"}`}
              >
                <img
                  src={block.image}
                  alt={block.title}
                  className="w-full h-[300px] md:h-[400px] object-cover rounded-2xl shadow-lg"
                />
              </div>

              {/* Content */}
              <div
                className={`${index % 2 !== 0 ? "lg:order-1" : "lg:order-2"}`}
              >
                <h3
                  className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4"
                  style={{ color: textColor }}
                >
                  {block.title}
                </h3>
                <p
                  className="text-base md:text-lg leading-relaxed"
                  style={{ color: textColor, opacity: 0.7 }}
                >
                  {block.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutStory2;
