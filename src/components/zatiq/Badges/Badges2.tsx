import React from 'react';
const icon1 = '/assets/badge/icon1.png';
const icon2 = '/assets/badge/icon2.png';
const icon3 = '/assets/badge/Vector3.png';
const icon4 = '/assets/badge/4.png';

// Component-specific types
interface FeatureBadgeProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureBadge: React.FC<FeatureBadgeProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 text-center md:text-left">
      {/* Icon */}
      <div className="shrink-0 w-10 h-10 md:w-12 md:h-12">
        <img src={icon} alt={title} className="w-full h-full object-contain" />
      </div>
      {/* Text Content */}
      <div className="flex flex-col min-w-0">
        <h3 className="text-sm md:text-base lg:text-[20px] font-medium text-gray-900 whitespace-nowrap">{title}</h3>
        <p className="text-xs md:text-sm lg:text-[20px] font-normal text-gray-600 whitespace-nowrap">{description}</p>
      </div>
    </div>
  );
};

const Badges2: React.FC = () => {
  return (
    <div className="w-full py-6 md:py-8 px-4 font-poppins">
      <div className="max-w-[1440px] mx-auto md:px-12 lg:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 lg:gap-x-12 gap-y-6 md:gap-y-8">
          <FeatureBadge
            icon={icon1}
            title="High Quality"
            description="crafted from top materials"
          />
          <FeatureBadge
            icon={icon2}
            title="Warrany Protection"
            description="Over 2 years"
          />
          <FeatureBadge
            icon={icon3}
            title="Free Shipping"
            description="Order over 150 $"
          />
          <FeatureBadge
            icon={icon4}
            title="24 / 7 Support"
            description="Dedicated support"
          />
        </div>
      </div>
    </div>
  );
};

export default Badges2;
