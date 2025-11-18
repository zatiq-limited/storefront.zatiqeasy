import React from 'react';

interface Badges2Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

interface FeatureBadgeProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureBadge: React.FC<FeatureBadgeProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3 text-center md:text-left">
      {/* Icon */}
      <div className="shrink-0 w-10 h-10 md:w-12 md:h-12">
        <img src={icon} alt={title} className="w-full h-full object-contain" />
      </div>
      {/* //TODO: Need to change and check the font sizes compare with figma */}
      {/* Text Content */} 
      <div className="flex flex-col min-w-0">
        <h3 className="text-sm md:text-base lg:text-[18px] font-semibold text-gray-900 whitespace-nowrap">{title}</h3>
        <p className="text-xs md:text-sm lg:text-[14px] font-normal text-gray-600 whitespace-nowrap">{description}</p>
      </div>
    </div>
  );
};

export default function Badges2({ settings, blocks, pageData }: Badges2Props) {
  const defaultBadges = [
    {
      icon: "/assets/badge/icon1.png",
      title: "High Quality",
      description: "crafted from top materials"
    },
    {
      icon: "/assets/badge/icon2.png",
      title: "Warrany Protection",
      description: "Over 2 years"
    },
    {
      icon: "/assets/badge/Vector3.png",
      title: "Free Shipping",
      description: "Order over 150 $"
    },
    {
      icon: "/assets/badge/4.png",
      title: "24 / 7 Support",
      description: "Dedicated support"
    }
  ];

  const badges = settings?.badges || defaultBadges;

  return (
    <div className="w-full py-6 md:py-8 px-4 font-poppins">
      <div className="max-w-[1440px] mx-auto md:px-12 lg:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 lg:gap-x-12 gap-y-6 md:gap-y-8">
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
