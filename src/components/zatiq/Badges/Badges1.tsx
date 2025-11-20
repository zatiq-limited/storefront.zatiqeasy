import React from 'react';
import { Truck, CreditCard, RotateCcw, MessagesSquare, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';

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

interface Badges1Props {
  settings?: {
    backgroundColor?: string;
    columns?: number;
    columnsMobile?: number;
  };
  blocks?: BadgeBlock[];
}

// Icon mapping helper
const getIcon = (iconName: string, size: number = 32): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    'truck': <Truck size={size} strokeWidth={1.5} />,
    'credit-card': <CreditCard size={size} strokeWidth={1.5} />,
    'rotate-ccw': <RotateCcw size={size} strokeWidth={1.5} />,
    'messages-square': <MessagesSquare size={size} strokeWidth={1.5} />,
    'shield-check': <ShieldCheck size={size} strokeWidth={1.5} />,
    'refresh': <RefreshCw size={size} strokeWidth={1.5} />,
    'headphones': <Headphones size={size} strokeWidth={1.5} />,
  };
  return iconMap[iconName] || <Truck size={size} strokeWidth={1.5} />;
};

const FeatureBadge: React.FC<FeatureBadgeProps> = ({ icon, title, description }) => {
  return (
    <div className="flex justify-center items-center gap-3 md:gap-4 w-full">
      {/* Icon Container */}
      <div className="shrink-0 w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center bg-gray-100 rounded-full">
        <div className="w-full h-full flex items-center justify-center scale-[0.65] md:scale-[0.82] lg:scale-100">
          {icon}
        </div>
      </div>
      {/* Text Content */}
      <div className="flex flex-col min-w-0 text-center sm:text-left">
        <h3 className="font-inter font-semibold text-sm md:text-base leading-5 md:leading-6 text-gray-900 line-clamp-2">{title}</h3>
        <p className="font-inter font-normal text-xs md:text-sm leading-[18px] md:leading-[22px] text-[#4E5562] line-clamp-2">{description}</p>
      </div>
    </div>
  );
};

const Badges1: React.FC<Badges1Props> = ({ settings = {}, blocks = [] }) => {
  // Use blocks from props or fallback to default data
  const defaultBadges: BadgeBlock[] = [
    {
      icon: "truck",
      title: "Free Shipping & Returns",
      description: "For all orders over $199.00"
    },
    {
      icon: "credit-card",
      title: "Secure Payment",
      description: "We ensure secure payment"
    },
    {
      icon: "rotate-ccw",
      title: "Money Back Guarantee",
      description: "Returning money 30 days"
    },
    {
      icon: "messages-square",
      title: "24/7 Customer Support",
      description: "Friendly customer support"
    }
  ];

  const badges = blocks.length > 0 ? blocks : defaultBadges;

  return (
    <div className="w-full px-4 pb-8 md:pb-14 font-sans">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center lg:px-[60px]">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
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
    </div>
  );
};

export default Badges1;
