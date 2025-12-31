import React from 'react';
import * as LucideIcons from 'lucide-react';

// Icon mapping helper - converts kebab-case to PascalCase and returns the icon component
const getIcon = (iconName, size = 28) => {
  // Handle legacy icon names for backwards compatibility
  const iconNameMap = {
    location: 'map-pin',
    address: 'map-pin',
    map: 'map-pin',
    phone: 'phone-call',
    call: 'phone-call',
    email: 'mail',
    clock: 'clock',
    hours: 'clock',
    time: 'clock',
    chat: 'message-circle',
    message: 'message-circle',
    website: 'globe',
    web: 'globe',
    office: 'building',
    building: 'building',
    support: 'headphones',
    help: 'headphones',
  };

  // Use mapped name if available, otherwise use original
  const mappedName = iconNameMap[iconName] || iconName;

  // Convert kebab-case to PascalCase (e.g., 'credit-card' -> 'CreditCard')
  const pascalCase = mappedName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  // Get the icon component from lucide-react
  const IconComponent = LucideIcons[pascalCase];

  if (IconComponent) {
    return <IconComponent size={size} strokeWidth={1.5} />;
  }

  // Fallback to MapPin icon if not found
  return <LucideIcons.MapPin size={size} strokeWidth={1.5} />;
};

interface ContactBlock {
  id: string;
  type: string;
  settings: {
    icon: string;
    title: string;
    content: string;
    link?: string;
  };
}

interface ContactInfo1Settings {
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  title?: string;
  titleStyle?: string;
  iconBackgroundColor?: string;
  blocks?: ContactBlock[];
  viewMode?: 'desktop' | 'tablet' | 'mobile' | null;
}

interface ContactInfo1Props {
  settings: ContactInfo1Settings;
}

const ContactInfo1 = ({ settings }: ContactInfo1Props) => {
  const {
    backgroundColor = '#FFFFFF',
    textColor = '#111827',
    accentColor = '#8B4513',
    title = 'Quick support',
    titleStyle = 'script',
    iconBackgroundColor = '#F5F0EB',
    blocks = [],
    viewMode = null,
  } = settings;
  // Responsive layout detection based on viewMode (preview) or CSS (production)
  const showMobileLayout = viewMode === 'mobile';
  const showTabletLayout = viewMode === 'tablet';
  const showDesktopLayout = viewMode === 'desktop';

  // Default blocks for preview
  const defaultBlocks = [
    {
      id: 'info_1',
      type: 'contact_item',
      settings: {
        icon: 'location',
        title: 'Store Location',
        content: '14 Ringe lane, las vegas, nv, 89156 united states',
      },
    },
    {
      id: 'info_2',
      type: 'contact_item',
      settings: {
        icon: 'phone',
        title: 'Contact Call',
        content: '+00-1234567890',
        link: 'tel:+001234567890',
      },
    },
    {
      id: 'info_3',
      type: 'contact_item',
      settings: {
        icon: 'email',
        title: 'Contact Mail',
        content: 'demo@support.com',
        link: 'mailto:demo@support.com',
      },
    },
  ];

  const displayBlocks = blocks.length > 0 ? blocks : defaultBlocks;

  // Responsive classes with viewMode support
  const sectionPaddingClass = viewMode
    ? showMobileLayout
      ? 'py-12'
      : showTabletLayout
      ? 'py-16'
      : 'py-20'
    : 'py-12 md:py-16 lg:py-20';

  const containerPaddingClass = viewMode
    ? showMobileLayout
      ? 'px-4'
      : showTabletLayout
      ? 'px-4'
      : 'px-4 2xl:px-0'
    : 'px-4 2xl:px-0';

  const titlePaddingClass = viewMode
    ? showMobileLayout
      ? 'pb-10'
      : 'pb-14'
    : 'pb-10 md:pb-14';

  const titleSizeClass = viewMode
    ? titleStyle === 'script'
      ? showMobileLayout
        ? 'text-3xl'
        : 'text-4xl'
      : showMobileLayout
        ? 'text-2xl'
        : showTabletLayout
          ? 'text-3xl'
          : 'text-4xl'
    : titleStyle === 'script'
      ? 'text-3xl md:text-4xl'
      : 'text-2xl md:text-3xl lg:text-4xl';

  const gridGapClass = viewMode
    ? showMobileLayout
      ? 'gap-8'
      : 'gap-12'
    : 'gap-8 md:gap-12';

  const iconSizeClass = viewMode
    ? showMobileLayout
      ? '4rem'
      : '5rem'
    : '5rem';

  const titleTextClass = viewMode
    ? showMobileLayout
      ? 'text-xs'
      : 'text-sm'
    : 'text-sm';

  const contentTextClass = viewMode
    ? showMobileLayout
      ? 'text-sm'
      : 'text-base'
    : 'text-sm md:text-base';

  const getGridClass = () => {
    if (viewMode) {
      if (showMobileLayout) {
        return displayBlocks.length === 1
          ? 'grid-cols-1 max-w-md mx-auto'
          : 'grid-cols-1 max-w-2xl mx-auto';
      }
      if (showTabletLayout) {
        return displayBlocks.length === 1
          ? 'grid-cols-1 max-w-md mx-auto'
          : displayBlocks.length === 2
            ? 'grid-cols-2 max-w-2xl mx-auto'
            : 'grid-cols-2 max-w-5xl mx-auto';
      }
      // Desktop
      return displayBlocks.length === 1
        ? 'grid-cols-1 max-w-md mx-auto'
        : displayBlocks.length === 2
          ? 'grid-cols-2 max-w-2xl mx-auto'
          : displayBlocks.length === 3
            ? 'grid-cols-3 max-w-5xl mx-auto'
            : 'grid-cols-4';
    }

    // Production responsive classes
    return displayBlocks.length === 1
      ? 'grid-cols-1 max-w-md mx-auto'
      : displayBlocks.length === 2
        ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'
        : displayBlocks.length === 3
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
  };

  return (
    <section className={sectionPaddingClass} style={{ backgroundColor }}>
      <div className={`container mx-auto ${containerPaddingClass}`}>
        {/* Title */}
        {title && (
          <h2
            className={`text-center ${titlePaddingClass} ${
              titleStyle === 'script' ? 'font-serif italic' : 'font-bold'
            } ${titleSizeClass}`}
            style={{ color: textColor }}
          >
            {title}
          </h2>
        )}

        {/* Contact Cards - Centered Grid */}
        <div className={`grid ${gridGapClass} ${getGridClass()}`}>
          {displayBlocks.map((item) => (
            <div key={item.id} className="flex flex-col items-center text-center">
              {/* Icon Circle */}
              <div
                className="flex items-center justify-center rounded-full mb-5 shrink-0 overflow-hidden"
                style={{
                  backgroundColor: iconBackgroundColor,
                  color: accentColor,
                  width: iconSizeClass,
                  height: iconSizeClass,
                  minWidth: iconSizeClass,
                  maxWidth: iconSizeClass,
                  minHeight: iconSizeClass,
                  maxHeight: iconSizeClass,
                }}
              >
                {getIcon(item.settings.icon)}
              </div>

              {/* Title */}
              {item.settings.title && (
                <h3
                  className={`${titleTextClass} font-semibold uppercase tracking-wider mb-2`}
                  style={{ color: textColor }}
                >
                  {item.settings.title}
                </h3>
              )}

              {/* Content */}
              {item.settings.link ? (
                <a
                  href={item.settings.link}
                  className={`text-gray-600 hover:underline transition-colors ${contentTextClass}`}
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: (item.settings.content || '').replace(/\n/g, '<br/>'),
                    }}
                  />
                </a>
              ) : (
                <p
                  className={`text-gray-600 ${contentTextClass}`}
                  dangerouslySetInnerHTML={{
                    __html: (item.settings.content || '').replace(/\n/g, '<br/>'),
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactInfo1;
