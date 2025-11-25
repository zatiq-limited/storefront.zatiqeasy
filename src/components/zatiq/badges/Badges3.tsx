import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface BadgeBlock {
  icon: string;
  title: string;
  description: string;
}

interface Badges3Settings {
  showIcons?: boolean;
  backgroundColor?: string;
  iconBgColor?: string;
  iconColor?: string;
  titleColor?: string;
  descriptionColor?: string;
}

interface Badges3Props {
  settings?: Badges3Settings;
  blocks?: BadgeBlock[];
}

// Icon mapping helper - converts kebab-case to PascalCase and returns the icon component
const getIcon = (iconName: string, size: number = 28): React.ReactNode => {
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
    <div className="flex items-center justify-center gap-3 md:gap-5 w-full">
      {/* Icon Container - Colored Circle */}
      {showIcons && (
        <div
          className="shrink-0 w-12 h-12 md:w-14 md:h-14 lg:w-[61px] lg:h-[61px] flex items-center justify-center rounded-full"
          style={{ backgroundColor: iconBgColor }}
        >
          <div className="scale-75 md:scale-90 lg:scale-100" style={{ color: iconColor }}>
            {icon}
          </div>
        </div>
      )}
      {/* Text Content */}
      <div className="flex flex-col gap-1 md:gap-[5px] min-w-0">
        <h3
          className="font-montserrat font-bold text-xs md:text-sm leading-5 md:leading-6 tracking-[0.2px] line-clamp-2"
          style={{ color: titleColor }}
        >
          {title}
        </h3>
        <p
          className="font-montserrat font-normal text-[10px] md:text-xs leading-3 md:leading-4 tracking-[0.2px] line-clamp-2"
          style={{ color: descriptionColor }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

const Badges3: React.FC<Badges3Props> = ({ settings = {}, blocks = [] }) => {
  const {
    showIcons = true,
    backgroundColor = '#FFFFFF',
    iconBgColor = '#E74040',
    iconColor = '#FFFFFF',
    titleColor = '#111827',
    descriptionColor = '#6B7280',
  } = settings;

  // Default badges if no blocks provided
  const defaultBadges: BadgeBlock[] = [
    {
      icon: 'truck',
      title: 'Free Shipping & Return',
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
      icon: 'headphones',
      title: '24/7 Support',
      description: 'Friendly customer support',
    },
  ];

  const badges = blocks.length > 0 ? blocks : defaultBadges;

  return (
    <div className="w-full py-6 md:py-8 px-4 font-montserrat" style={{ backgroundColor }}>
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-8">
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
  );
};

export default Badges3;
