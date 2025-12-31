import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ContactHero1Settings {
  headline?: string;
  subheadline?: string;
  image?: string;
  overlayOpacity?: number;
  showBreadcrumb?: boolean;
  breadcrumbs?: Array<{
    id: string;
    type: string;
    settings: {
      label: string;
      link?: string;
    };
  }>;
  viewMode?: 'desktop' | 'tablet' | 'mobile' | null;
}

interface ContactHero1Props {
  settings: ContactHero1Settings;
}

const ContactHero1 = ({ settings }: ContactHero1Props) => {
  const {
    headline = 'Get in Touch',
    subheadline = '',
    image = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&h=600&fit=crop',
    overlayOpacity = 0.5,
    showBreadcrumb = true,
    breadcrumbs = [],
    viewMode = null,
  } = settings;
  // Responsive layout detection based on viewMode (preview) or CSS (production)
  const showMobileLayout = viewMode === 'mobile';
  const showTabletLayout = viewMode === 'tablet';
  const showDesktopLayout = viewMode === 'desktop';

  // Default breadcrumbs for preview
  const defaultBreadcrumbs = [
    { id: 'breadcrumb_1', type: 'breadcrumb_item', settings: { label: 'Home', link: '/' } },
    { id: 'breadcrumb_2', type: 'breadcrumb_item', settings: { label: 'Contact' } },
  ];

  const displayBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : defaultBreadcrumbs;

  // Responsive classes with viewMode support
  const heroHeightClass = viewMode
    ? showMobileLayout
      ? 'h-[200px]'
      : showTabletLayout
      ? 'h-[240px]'
      : 'h-[280px]'
    : 'h-[200px] md:h-[280px]';

  const breadcrumbTopClass = viewMode
    ? showMobileLayout
      ? 'top-4'
      : 'top-6'
    : 'top-4 md:top-6';

  const breadcrumbPaddingClass = viewMode
    ? showMobileLayout
      ? 'px-4'
      : showTabletLayout
      ? 'px-4'
      : 'px-4 2xl:px-0'
    : 'px-4 2xl:px-0';

  const breadcrumbTextClass = viewMode
    ? showMobileLayout
      ? 'text-[10px]'
      : 'text-xs'
    : 'text-xs';

  const breadcrumbIconClass = viewMode
    ? showMobileLayout
      ? 'w-2.5 h-2.5'
      : 'w-3 h-3'
    : 'w-3 h-3';

  const contentPaddingClass = viewMode
    ? 'px-4'
    : 'px-4';

  const subheadlineTextClass = viewMode
    ? showMobileLayout
      ? 'text-xs'
      : 'text-sm'
    : 'text-xs md:text-sm';

  const headlineTextClass = viewMode
    ? showMobileLayout
      ? 'text-2xl'
      : showTabletLayout
      ? 'text-3xl'
      : 'text-4xl'
    : 'text-2xl sm:text-3xl md:text-4xl';

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image */}
      <div className={`relative w-full ${heroHeightClass}`}>
        {image && <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />}

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgba(0, 0, 0, ${overlayOpacity}) 0%, rgba(0, 0, 0, ${
              overlayOpacity * 0.7
            }) 100%)`,
          }}
        />

        {/* Breadcrumb - Upper Left */}
        {showBreadcrumb && displayBreadcrumbs.length > 0 && (
          <div className={`absolute ${breadcrumbTopClass} left-0 right-0 z-10`}>
            <nav className={`container mx-auto ${breadcrumbPaddingClass}`}>
              <ol className={`flex items-center gap-1 ${breadcrumbTextClass} text-white/80`}>
                {displayBreadcrumbs.map((item, index) => (
                  <React.Fragment key={item.id}>
                    {index > 0 && (
                      <li className="text-white/60">
                        <ChevronRight className={breadcrumbIconClass} />
                      </li>
                    )}
                    <li>
                      {item.settings.link ? (
                        <a
                          href={item.settings.link}
                          className={`uppercase tracking-wider ${breadcrumbTextClass} font-medium hover:text-white transition-colors`}
                        >
                          {item.settings.label}
                        </a>
                      ) : (
                        <span className={`uppercase tracking-wider ${breadcrumbTextClass} font-medium text-white`}>
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
          <div className={`max-w-[1200px] mx-auto ${contentPaddingClass} text-center`}>
            {/* Badge */}
            {subheadline && (
              <p className={`${subheadlineTextClass} font-medium text-white/80 tracking-wider uppercase mb-2`}>
                {subheadline}
              </p>
            )}

            {/* Headline */}
            {headline && <h1 className={`${headlineTextClass} font-semibold text-white`}>{headline}</h1>}
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
            <path d="M0 60 Q720 20 1440 60 V60 H0 Z" fill="white" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default ContactHero1;
