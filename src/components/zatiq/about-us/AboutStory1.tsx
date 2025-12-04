import React from "react";

interface Milestone {
  year: string;
  title: string;
  description: string;
  image?: string;
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
    subtitle = "The milestones that shaped who we are today",
  } = settings;

  const milestones = blocks.map((block) =>
    "settings" in block && block.settings ? block.settings : block
  ) as Milestone[];

  return (
    <section
      className="w-full py-16 md:py-20 lg:py-28"
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 lg:mb-20">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6"
            style={{ color: textColor }}
          >
            {title}
          </h2>
          <p
            className="text-base md:text-lg lg:text-xl"
            style={{ color: textColor, opacity: 0.6 }}
          >
            {subtitle}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center Line - Desktop */}
          <div
            className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
            style={{ backgroundColor: `${accentColor}20` }}
          />

          {/* Left Line - Mobile/Tablet */}
          <div
            className="lg:hidden absolute left-4 sm:left-6 top-0 bottom-0 w-0.5"
            style={{ backgroundColor: `${accentColor}20` }}
          />

          {/* Timeline Items */}
          <div className="space-y-12 lg:space-y-20">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative">
                {/* Desktop Layout */}
                <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                  {/* Left Side */}
                  <div className={index % 2 === 0 ? "pr-16" : "order-2 pl-16"}>
                    {index % 2 === 0 ? (
                      <ContentBlock
                        milestone={milestone}
                        textColor={textColor}
                        accentColor={accentColor}
                        alignment="right"
                      />
                    ) : (
                      <ImageBlock milestone={milestone} accentColor={accentColor} />
                    )}
                  </div>

                  {/* Center Dot */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div
                      className="w-4 h-4 rounded-full border-4 bg-white"
                      style={{ borderColor: accentColor }}
                    />
                  </div>

                  {/* Right Side */}
                  <div className={index % 2 === 0 ? "pl-16" : "order-1 pr-16"}>
                    {index % 2 === 0 ? (
                      <ImageBlock milestone={milestone} accentColor={accentColor} />
                    ) : (
                      <ContentBlock
                        milestone={milestone}
                        textColor={textColor}
                        accentColor={accentColor}
                        alignment="left"
                      />
                    )}
                  </div>
                </div>

                {/* Mobile/Tablet Layout */}
                <div className="lg:hidden flex">
                  {/* Left Dot */}
                  <div className="relative shrink-0 w-8 sm:w-12">
                    <div
                      className="absolute left-4 sm:left-6 top-2.5 w-3 h-3 rounded-full border-[3px] bg-white -translate-x-1/2"
                      style={{ borderColor: accentColor }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <ContentBlock
                      milestone={milestone}
                      textColor={textColor}
                      accentColor={accentColor}
                      alignment="left"
                    />
                    <div className="mt-5">
                      <ImageBlock milestone={milestone} accentColor={accentColor} mobile />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ContentBlock: React.FC<{
  milestone: Milestone;
  textColor: string;
  accentColor: string;
  alignment: "left" | "right";
}> = ({ milestone, textColor, accentColor, alignment }) => {
  return (
    <div className={alignment === "right" ? "text-right" : "text-left"}>
     
      {/* Title */}
      <h3
        className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3"
        style={{ color: textColor }}
      >
        {milestone.title}
      </h3>

      {/* Description */}
      <p
        className="text-sm sm:text-base lg:text-lg leading-relaxed"
        style={{ color: textColor, opacity: 0.65 }}
      >
        {milestone.description}
      </p>
    </div>
  );
};

const ImageBlock: React.FC<{
  milestone: Milestone;
  accentColor: string;
  mobile?: boolean;
}> = ({ milestone, accentColor, mobile = false }) => {
  const hasImage = milestone.image && milestone.image.trim() !== "";

  return (
    <div
      className={`
        relative rounded-xl overflow-hidden
        ${mobile ? "aspect-video" : "aspect-[4/3]"}
      `}
      style={{ backgroundColor: `${accentColor}08` }}
    >
      {hasImage ? (
        <img
          src={milestone.image}
          alt={milestone.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <svg
            className="w-12 h-12 sm:w-16 sm:h-16"
            style={{ color: `${accentColor}30` }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default AboutStory1;
