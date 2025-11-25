import React from "react";

interface Milestone {
  year: string;
  title: string;
  description: string;
}

interface AboutStory1Settings {
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  title?: string;
  subtitle?: string;
}

interface AboutStory1Props {
  settings?: AboutStory1Settings;
  blocks?: Array<{ settings?: Milestone } | Milestone>;
}

const AboutStory1: React.FC<AboutStory1Props> = ({
  settings = {},
  blocks = [],
}) => {
  const {
    backgroundColor = "#FFFFFF",
    textColor = "#111827",
    accentColor = "#2563EB",
    title = "Our Journey",
    subtitle = "Milestones that shaped our story",
  } = settings;

  // Handle both flat and nested settings structure
  const milestones = blocks.map((block) =>
    "settings" in block && block.settings ? block.settings : block
  ) as Milestone[];

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
            className="text-base md:text-lg"
            style={{ color: textColor, opacity: 0.7 }}
          >
            {subtitle}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line - Hidden on mobile */}
          <div
            className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full"
            style={{ backgroundColor: accentColor, opacity: 0.2 }}
          />

          {/* Timeline Items */}
          <div className="space-y-8 md:space-y-12">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`relative flex flex-col md:flex-row items-start md:items-center ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Content */}
                <div
                  className={`w-full md:w-5/12 ${
                    index % 2 === 0 ? "md:text-right md:pr-8" : "md:pl-8"
                  }`}
                >
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div
                      className="text-2xl md:text-3xl font-bold mb-3"
                      style={{ color: accentColor }}
                    >
                      {milestone.year}
                    </div>
                    <h3
                      className="text-xl md:text-2xl font-semibold mb-2"
                      style={{ color: textColor }}
                    >
                      {milestone.title}
                    </h3>
                    <p
                      className="text-sm md:text-base"
                      style={{ color: textColor, opacity: 0.7 }}
                    >
                      {milestone.description}
                    </p>
                  </div>
                </div>

                {/* Center Dot */}
                <div
                  className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white"
                  style={{ backgroundColor: accentColor }}
                />

                {/* Empty Space for Alignment */}
                <div className="hidden md:block w-5/12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStory1;
