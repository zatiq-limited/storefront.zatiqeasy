import React from 'react';
import { BadgeCheck, ShieldCheck, Truck, Headphones, CreditCard, RotateCcw, MessagesSquare, RefreshCw } from 'lucide-react';

// Component-specific types
interface FeatureBadgeProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface BadgeBlock {
  icon: string;
  title: string;
  description: string;
}

interface Badges2Props {
  settings?: {
    backgroundColor?: string;
    columns?: number;
    columnsMobile?: number;
  };
  blocks?: BadgeBlock[];
}

// Icon mapping helper
const getIcon = (iconName: string, size: number = 40): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    'truck': <Truck size={size} strokeWidth={1.5} />,
    'badge-check': <BadgeCheck size={size} strokeWidth={1.5} />,
    'shield-check': <ShieldCheck size={size} strokeWidth={1.5} />,
    'headphones': <Headphones size={size} strokeWidth={1.5} />,
    'credit-card': <CreditCard size={size} strokeWidth={1.5} />,
    'rotate-ccw': <RotateCcw size={size} strokeWidth={1.5} />,
    'messages-square': <MessagesSquare size={size} strokeWidth={1.5} />,
    'refresh': <RefreshCw size={size} strokeWidth={1.5} />,
  };
  return iconMap[iconName] || <BadgeCheck size={size} strokeWidth={1.5} />;
};

const FeatureBadge: React.FC<FeatureBadgeProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
      {/* Icon */}
      <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
        {icon}
      </div>
      {/* Text Content */}
      <div className="flex flex-col min-w-0">
        <h3 className="text-sm md:text-base font-medium text-gray-900 whitespace-nowrap">{title}</h3>
        <p className="text-xs md:text-sm font-normal text-gray-600 whitespace-nowrap">{description}</p>
      </div>
    </div>
  );
};

const Badges2: React.FC<Badges2Props> = ({ settings = {}, blocks = [] }) => {
  // Use blocks from props or fallback to default data
  const defaultBadges: BadgeBlock[] = [
    {
      icon: "badge-check",
      title: "High Quality",
      description: "crafted from top materials"
    },
    {
      icon: "shield-check",
      title: "Warranty Protection",
      description: "Over 2 years"
    },
    {
      icon: "truck",
      title: "Free Shipping",
      description: "Order over 150 $"
    },
    {
      icon: "headphones",
      title: "24 / 7 Support",
      description: "Dedicated support"
    }
  ];

  const badges = blocks.length > 0 ? blocks : defaultBadges;

  return (
    <div className="w-full pb-8 md:pb-14 px-4 font-poppins">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 lg:gap-x-12 gap-y-6 md:gap-y-8">
          {badges.map((badge, index) => (
            <FeatureBadge
              key={index}
              icon={getIcon(badge.icon)}
              title={badge.title}
              description={badge.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Badges2;
