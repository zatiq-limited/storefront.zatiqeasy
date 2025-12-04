import React from "react";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  id: string;
  type: string;
  settings: {
    label?: string;
    link?: string;
  };
}

interface ContactHero1Settings {
  backgroundColor?: string;
  textColor?: string;
  headline?: string;
  subheadline?: string;
  description?: string;
  image?: string;
  overlayOpacity?: number;
  accentColor?: string;
}

interface ContactHero1Props {
  settings?: ContactHero1Settings;
  breadcrumbs?: BreadcrumbItem[];
}

const ContactHero1: React.FC<ContactHero1Props> = ({
  settings = {},
  breadcrumbs = [],
}) => {
  const {
    headline,
    subheadline,
    image,
    overlayOpacity = 0.5,
  } = settings;

  // If no headline or image provided, don't render
  if (!headline && !image) return null;

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image */}
      <div className="relative w-full h-[20vh] sm:h-[35vh]">
        {image && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
        )}

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgba(0, 0, 0, ${overlayOpacity}) 0%, rgba(0, 0, 0, ${overlayOpacity * 0.7}) 100%)`,
          }}
        />

        {/* Breadcrumb - Upper Left */}
        {breadcrumbs.length > 0 && (
          <div className="absolute top-4 md:top-6 left-0 right-0 z-10">
            <nav className="max-w-[1440px] mx-auto px-4 2xl:px-0">
              <ol className="flex items-center gap-1 text-sm text-white/80">
                {breadcrumbs.map((item, index) => (
                  <React.Fragment key={item.id}>
                    {index > 0 && (
                      <li className="text-white/60">
                        <ChevronRight className="w-3 h-3" />
                      </li>
                    )}
                    <li>
                      {item.settings.link ? (
                        <a
                          href={item.settings.link}
                          className="uppercase tracking-wider text-xs font-medium hover:text-white transition-colors"
                        >
                          {item.settings.label}
                        </a>
                      ) : (
                        <span className="uppercase tracking-wider text-xs font-medium text-white">
                          {item.settings.label}
                        </span>
                      )}
                    </li>
                  </React.Fragment>
                ))}
              </ol>
            </nav>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            {/* Badge */}
            {subheadline && (
              <p className="text-xs md:text-sm font-medium text-white/80 tracking-wider uppercase mb-2">
                {subheadline}
              </p>
            )}

            {/* Headline */}
            {headline && (
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
                {headline}
              </h1>
            )}
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute -bottom-px left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full block"
            preserveAspectRatio="none"
          >
            <path
              d="M0 60 Q720 20 1440 60 V60 H0 Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default ContactHero1;
