import React from 'react';
import { Truck, CreditCard, RotateCcw, MessageCircle } from 'lucide-react';

interface Badges3Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

interface FeatureBadgeProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureBadge: React.FC<FeatureBadgeProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4 text-center md:text-left">
      {/* Icon Container - Red Circle */}
      <div className="shrink-0 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full" style={{ backgroundColor: '#E74040' }}>
        <div className="text-white scale-75 md:scale-100">
          {icon}
        </div>
      </div>
      {/* Text Content */}
      <div className="flex flex-col">
        <h3 className="text-sm md:text-base lg:text-[14px] font-semibold text-gray-900">{title}</h3>
        <p className="text-xs md:text-sm lg:text-[14px] text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default function Badges3({ settings, blocks, pageData }: Badges3Props) {
  const defaultBadges = [
    {
      icon: <Truck size={28} />,
      title: "Free Shipping & Return",
      description: "For all orders over $199.00"
    },
    {
      icon: <CreditCard size={28} />,
      title: "Secure Payment",
      description: "We ensure secure payment"
    },
    {
      icon: <RotateCcw size={28} />,
      title: "Money Back Guarantee",
      description: "Returning money 30 days"
    },
    {
      icon: <MessageCircle size={28} />,
      title: "24/7 Support",
      description: "Friendly customer support"
    }
  ];

  const badges = settings?.badges || defaultBadges;

  return (
    <div className="w-full py-6 md:py-8 px-4 font-montserrat">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-[70px]">
          {badges.map((badge: any, index: number) => (
            <FeatureBadge
              key={index}
              icon={badge.icon}
              title={badge.title}
              description={badge.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
