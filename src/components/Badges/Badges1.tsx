import React from 'react';
import { Truck, CreditCard, RotateCcw, MessageCircle } from 'lucide-react';

interface Badges1Props {
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
      {/* Icon Container */}
      <div className="shrink-0 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-gray-100 rounded-full">
        <div className="scale-75 md:scale-100">
          {icon}
        </div>
      </div>
      {/* Text Content */}
      <div className="flex flex-col">
        <h3 className="text-sm md:text-base lg:text-[16px] font-semibold text-gray-900">{title}</h3>
        <p className="text-xs md:text-sm lg:text-[16px] text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default function Badges1({ settings, blocks, pageData }: Badges1Props) {
  const defaultBadges = [
    {
      icon: <Truck size={32} className="text-gray-900" />,
      title: "Free Shipping & Returns",
      description: "For all orders over $199.00"
    },
    {
      icon: <CreditCard size={32} className="text-gray-900" />,
      title: "Secure Payment",
      description: "We ensure secure payment"
    },
    {
      icon: <RotateCcw size={32} className="text-gray-900" />,
      title: "Money Back Guarantee",
      description: "Returning money 30 days"
    },
    {
      icon: <MessageCircle size={32} className="text-gray-900" />,
      title: "24/7 Customer Support",
      description: "Friendly customer support"
    }
  ];

  const badges = settings?.badges || defaultBadges;

  return (
    <div className="w-full px-4 py-6 md:py-8 font-sans">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center md:px-[60px]">
          <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
    </div>
  );
}
