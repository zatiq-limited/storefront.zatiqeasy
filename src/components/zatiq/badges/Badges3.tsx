import React from 'react';
import { Truck, CreditCard, RotateCcw, Headphones, ShieldCheck, BadgeCheck, MessagesSquare, RefreshCw } from 'lucide-react';

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

interface Badges3Props {
  settings?: {
    backgroundColor?: string;
    columns?: number;
    columnsMobile?: number;
  };
  blocks?: BadgeBlock[];
}

// Icon mapping helper
const getIcon = (iconName: string, size: number = 28): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    'truck': <Truck size={size} strokeWidth={1.5} />,
    'credit-card': <CreditCard size={size} strokeWidth={1.5} />,
    'rotate-ccw': <RotateCcw size={size} strokeWidth={1.5} />,
    'headphones': <Headphones size={size} strokeWidth={1.5} />,
    'shield-check': <ShieldCheck size={size} strokeWidth={1.5} />,
    'badge-check': <BadgeCheck size={size} strokeWidth={1.5} />,
    'messages-square': <MessagesSquare size={size} strokeWidth={1.5} />,
    'refresh': <RefreshCw size={size} strokeWidth={1.5} />,
  };
  return iconMap[iconName] || <Truck size={size} strokeWidth={1.5} />;
};

const FeatureBadge: React.FC<FeatureBadgeProps> = ({ icon, title, description }) => {
  return (
    <div className="flex items-center justify-center gap-3 md:gap-5 w-full">
      {/* Icon Container - Red Circle */}
      <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 lg:w-[61px] lg:h-[61px] flex items-center justify-center rounded-full" style={{ backgroundColor: '#E74040' }}>
        <div className="text-white scale-75 md:scale-90 lg:scale-100">
          {icon}
        </div>
      </div>
      {/* Text Content */}
      <div className="flex flex-col gap-1 md:gap-[5px] min-w-0">
        <h3 className="font-montserrat font-bold text-xs md:text-sm leading-5 md:leading-6 tracking-[0.2px] text-gray-900 line-clamp-2">{title}</h3>
        <p className="font-montserrat font-normal text-[10px] md:text-xs leading-3 md:leading-4 tracking-[0.2px] text-gray-600 line-clamp-2">{description}</p>
      </div>
    </div>
  );
};

const Badges3: React.FC<Badges3Props> = ({ settings = {}, blocks = [] }) => {
  // Use blocks from props or fallback to default data
  const defaultBadges: BadgeBlock[] = [
    {
      icon: "truck",
      title: "Free Shipping & Return",
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
      icon: "headphones",
      title: "24/7 Support",
      description: "Friendly customer support"
    }
  ];

  const badges = blocks.length > 0 ? blocks : defaultBadges;

  return (
    <div className="w-full pb-8 md:pb-14 px-4 font-montserrat">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-8">
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

export default Badges3;
