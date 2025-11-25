import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface BadgeBlock {
  icon: string;
  title: string;
  description: string;
}

interface Badges1Settings {
  showIcons?: boolean;
  backgroundColor?: string;
  iconBgColor?: string;
  iconColor?: string;
  titleColor?: string;
  descriptionColor?: string;
}

interface Badges1Props {
  settings?: Badges1Settings;
  blocks?: BadgeBlock[];
}

// Icon mapping helper - converts kebab-case to PascalCase and returns the icon component
const getIcon = (iconName: string, size: number = 32): React.ReactNode => {
  // Convert kebab-case to PascalCase (e.g., 'credit-card' -> 'CreditCard')
  const pascalCase = iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  // Get the icon component from lucide-react
  const IconComponent = (LucideIcons as Record<string, LucideIcon>)[pascalCase];

  if (IconComponent) {
    return <IconComponent size={size} strokeWidth={1.5} />;
  }

  // Fallback to Truck icon if not found
  return <LucideIcons.Truck size={size} strokeWidth={1.5} />;
};

interface FeatureBadgeProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  showIcons: boolean;
  iconBgColor: string;
  iconColor: string;
  titleColor: string;
  descriptionColor: string;
}

const FeatureBadge: React.FC<FeatureBadgeProps> = ({
  icon,
  title,
  description,
  showIcons,
  iconBgColor,
  iconColor,
  titleColor,
  descriptionColor,
}) => {
  return (
    <div className="flex justify-center items-center gap-3 md:gap-4 w-full">
      {/* Icon Container */}
      {showIcons && (
        <div
          className="shrink-0 w-14 h-14 lg:w-[86px] lg:h-[86px] flex items-center justify-center rounded-full"
          style={{ backgroundColor: iconBgColor }}
        >
          <div
            className="w-full h-full flex items-center justify-center scale-[0.65] md:scale-[0.82] lg:scale-100"
            style={{ color: iconColor }}
          >
            {icon}
          </div>
        </div>
      )}
      {/* Text Content */}
      <div className="flex flex-col min-w-0">
        <h3
          className="font-inter font-semibold text-sm md:text-base leading-5 md:leading-6 line-clamp-2"
          style={{ color: titleColor }}
        >
          {title}
        </h3>
        <p
          className="font-inter font-normal text-xs md:text-sm leading-[18px] md:leading-[22px] line-clamp-2"
          style={{ color: descriptionColor }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

const Badges1: React.FC<Badges1Props> = ({ settings = {}, blocks = [] }) => {
  const {
    showIcons = true,
    backgroundColor = '#FFFFFF',
    iconBgColor = '#F5F7FA',
    iconColor = '#181D25',
    titleColor = '#111827',
    descriptionColor = '#4E5562',
  } = settings;

  // Default badges if no blocks provided
  const defaultBadges: BadgeBlock[] = [
    {
      icon: 'truck',
      title: 'Free Shipping & Returns',
      description: 'For all orders over $199.00',
    },
    {
      icon: 'credit-card',
      title: 'Secure Payment',
      description: 'We ensure secure payment',
    },
    {
      icon: 'rotate-ccw',
      title: 'Money Back Guarantee',
      description: 'Returning money 30 days',
    },
    {
      icon: 'messages-square',
      title: '24/7 Customer Support',
      description: 'Friendly customer support',
    },
  ];

  const badges = blocks.length > 0 ? blocks : defaultBadges;

  return (
    <div className="w-full px-4 py-6 md:py-8 font-sans" style={{ backgroundColor }}>
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center md:px-[60px]">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {badges.map((badge, index) => (
              <FeatureBadge
                key={index}
                icon={getIcon(badge.icon)}
                title={badge.title}
                description={badge.description}
                showIcons={showIcons}
                iconBgColor={iconBgColor}
                iconColor={iconColor}
                titleColor={titleColor}
                descriptionColor={descriptionColor}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Badges1;
