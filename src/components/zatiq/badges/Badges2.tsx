import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface BadgeBlock {
  icon: string;
  title: string;
  description: string;
}

interface Badges2Settings {
  showIcons?: boolean;
  backgroundColor?: string;
  iconColor?: string;
  titleColor?: string;
  descriptionColor?: string;
}

interface Badges2Props {
  settings?: Badges2Settings;
  blocks?: BadgeBlock[];
}

// Icon mapping helper - converts kebab-case to PascalCase and returns the icon component
const getIcon = (iconName: string, size: number = 40): React.ReactNode => {
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

  // Fallback to BadgeCheck icon if not found
  return <LucideIcons.BadgeCheck size={size} strokeWidth={1.5} />;
};

interface FeatureBadgeProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  showIcons: boolean;
  iconColor: string;
  titleColor: string;
  descriptionColor: string;
}

const FeatureBadge: React.FC<FeatureBadgeProps> = ({
  icon,
  title,
  description,
  showIcons,
  iconColor,
  titleColor,
  descriptionColor,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 text-center md:text-left">
      {/* Icon */}
      {showIcons && (
        <div
          className="shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center"
          style={{ color: iconColor }}
        >
          {icon}
        </div>
      )}
      {/* Text Content */}
      <div className="flex flex-col min-w-0">
        <h3
          className="text-sm md:text-base font-medium whitespace-nowrap"
          style={{ color: titleColor }}
        >
          {title}
        </h3>
        <p
          className="text-xs md:text-sm font-normal whitespace-nowrap"
          style={{ color: descriptionColor }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

const Badges2: React.FC<Badges2Props> = ({ settings = {}, blocks = [] }) => {
  const {
    showIcons = true,
    backgroundColor = '#FFFFFF',
    iconColor = '#181D25',
    titleColor = '#111827',
    descriptionColor = '#6B7280',
  } = settings;

  // Default badges if no blocks provided
  const defaultBadges: BadgeBlock[] = [
    {
      icon: 'badge-check',
      title: 'High Quality',
      description: 'crafted from top materials',
    },
    {
      icon: 'shield-check',
      title: 'Warranty Protection',
      description: 'Over 2 years',
    },
    {
      icon: 'truck',
      title: 'Free Shipping',
      description: 'Order over 150 $',
    },
    {
      icon: 'headphones',
      title: '24 / 7 Support',
      description: 'Dedicated support',
    },
  ];

  const badges = blocks.length > 0 ? blocks : defaultBadges;

  return (
    <div className="w-full py-6 md:py-8 px-4 font-poppins" style={{ backgroundColor }}>
      <div className="max-w-[1440px] mx-auto md:px-12 lg:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 lg:gap-x-12 gap-y-6 md:gap-y-8">
          {badges.map((badge, index) => (
            <FeatureBadge
              key={index}
              icon={getIcon(badge.icon)}
              title={badge.title}
              description={badge.description}
              showIcons={showIcons}
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

export default Badges2;
