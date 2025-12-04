import React, { useRef, useEffect, useState } from "react";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

interface AboutTeam1Settings {
  backgroundColor?: string;
  textColor?: string;
  title?: string;
  subtitle?: string;
  borderRadius?: string;
}

interface AboutTeam1Props {
  settings?: AboutTeam1Settings;
  blocks?: Array<{ settings?: TeamMember } | TeamMember>;
}

const AboutTeam1: React.FC<AboutTeam1Props> = ({
  settings = {},
  blocks = [],
}) => {
  const {
    backgroundColor = "#FFFFFF",
    textColor = "#111827",
    title = "Meet Our Team",
    subtitle = "The talented people behind our success",
    borderRadius = "12px",
  } = settings;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const teamMembers = blocks.map((block) =>
    "settings" in block && block.settings ? block.settings : block
  ) as TeamMember[];

  // Duplicate items for seamless infinite scroll
  const duplicatedMembers = [...teamMembers, ...teamMembers];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || teamMembers.length === 0) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame

    const animate = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += scrollSpeed;

        // Reset position when first set is fully scrolled
        const halfWidth = scrollContainer.scrollWidth / 2;
        if (scrollPosition >= halfWidth) {
          scrollPosition = 0;
        }

        scrollContainer.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPaused, teamMembers.length]);

  if (teamMembers.length === 0) return null;

  return (
    <section
      className="w-full pb-12 sm:pb-16 md:pb-20 lg:pb-24 overflow-hidden"
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4"
            style={{ color: textColor }}
          >
            {title}
          </h2>
          <p
            className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4"
            style={{ color: textColor, opacity: 0.7 }}
          >
            {subtitle}
          </p>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Shadow */}
        <div
          className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 md:w-24 lg:w-32 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to right, ${backgroundColor}, ${backgroundColor}00)`,
          }}
        />

        {/* Right Shadow */}
        <div
          className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 md:w-24 lg:w-32 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to left, ${backgroundColor}, ${backgroundColor}00)`,
          }}
        />

        {/* Scrolling Container */}
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-hidden py-2 sm:py-4 px-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {duplicatedMembers.map((member, index) => (
            <div
              key={index}
              className="shrink-0 w-[220px] sm:w-[260px] md:w-[280px] lg:w-[300px] group"
            >
              <div
                className="bg-white overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full"
                style={{ borderRadius }}
              >
                {/* Image */}
                <div className="relative w-full aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 md:p-5">
                  <h3
                    className="text-base sm:text-lg md:text-xl font-bold mb-0.5 sm:mb-1 truncate"
                    style={{ color: textColor }}
                  >
                    {member.name}
                  </h3>
                  <p
                    className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 truncate"
                    style={{ color: textColor, opacity: 0.6 }}
                  >
                    {member.role}
                  </p>
                  {member.bio && (
                    <p
                      className="text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2"
                      style={{ color: textColor, opacity: 0.7 }}
                    >
                      {member.bio}
                    </p>
                  )}

                  {/* Social Links */}
                  {member.social && (
                    <div className="flex gap-2 sm:gap-3">
                      {member.social.linkedin && (
                        <a
                          href={member.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                      )}
                      {member.social.twitter && (
                        <a
                          href={member.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-900 transition-colors"
                        >
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </a>
                      )}
                      {member.social.email && (
                        <a
                          href={`mailto:${member.social.email}`}
                          className="text-gray-500 hover:text-red-600 transition-colors"
                        >
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutTeam1;
