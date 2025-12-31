import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ContactHero2Settings {
  headline?: string;
  image?: string;
  overlayOpacity?: number;
  overlayColor?: string;
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

interface ContactHero2Props {
  settings: ContactHero2Settings;
}

const ContactHero2 = ({ settings }: ContactHero2Props) => {
  const {
    headline = 'Get in Touch',
    image = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&h=600&fit=crop',
    overlayOpacity = 0.5,
    overlayColor = '#000000',
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
      ? 'h-[250px]'
      : showTabletLayout
      ? 'h-[320px]'
      : 'h-[400px]'
    : 'h-[250px] md:h-[320px] lg:h-[400px]';

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

  const headlineTextClass = viewMode
    ? showMobileLayout
      ? 'text-3xl'
      : showTabletLayout
      ? 'text-4xl'
      : 'text-5xl'
    : 'text-3xl md:text-4xl lg:text-5xl';

  return (
    <section className="relative w-full">
      {/* Background Image */}
      <div className={`relative w-full ${heroHeightClass}`}>
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
        <div className={`relative z-10 h-full flex items-center justify-center ${contentPaddingClass}`}>
          {/* Headline */}
          {headline && (
            <h1 className={`${headlineTextClass} font-semibold text-white text-center`}>{headline}</h1>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactHero2;
