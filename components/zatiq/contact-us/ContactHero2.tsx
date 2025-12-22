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

interface ContactHero2Settings {
  backgroundColor?: string;
  textColor?: string;
  headline?: string;
  image?: string;
  overlayOpacity?: number;
  overlayColor?: string;
  showBreadcrumb?: boolean;
  breadcrumbHomeText?: string;
  breadcrumbCurrentText?: string;
}

interface ContactHero2Props {
  settings?: ContactHero2Settings;
  breadcrumbs?: BreadcrumbItem[];
}

const ContactHero2: React.FC<ContactHero2Props> = ({
  settings = {},
  breadcrumbs = [],
}) => {
  const {
    headline,
    image,
    overlayOpacity = 0.5,
    overlayColor = "#000000",
    showBreadcrumb = true,
    breadcrumbHomeText = "Home",
    breadcrumbCurrentText = "Contact",
  } = settings;

  // Default breadcrumbs when none provided
  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { id: 'breadcrumb_1', type: 'breadcrumb_item', settings: { label: breadcrumbHomeText, link: '/' } },
    { id: 'breadcrumb_2', type: 'breadcrumb_item', settings: { label: breadcrumbCurrentText } },
  ];

  const displayBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : defaultBreadcrumbs;

  // If no headline or image provided, don't render
  if (!headline && !image) return null;

  return (
    <section className="relative w-full">
      {/* Background Image */}
      <div className="relative w-full h-[200px] md:h-[280px] lg:h-[350px]">
        {image && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
        )}

        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity,
          }}
        />

        {/* Breadcrumb - Upper Left */}
        {showBreadcrumb && displayBreadcrumbs.length > 0 && (
          <div className="absolute top-4 md:top-6 left-0 right-0 z-10">
            <nav className="max-w-[1440px] mx-auto px-4 2xl:px-0">
              <ol className="flex items-center gap-1 text-sm text-white/80">
                {displayBreadcrumbs.map((item, index) => (
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
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          {/* Headline */}
          {headline && (
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white text-center">
              {headline}
            </h1>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactHero2;