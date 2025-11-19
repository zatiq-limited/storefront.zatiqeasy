import React from 'react';

interface StaticBanner5Props {
  image?: string;
  imageMobile?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  textAlignment?: "left" | "center" | "right";
  textColor?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  height?: "small" | "medium" | "large";
}

const StaticBanner5: React.FC<StaticBanner5Props> = () => {
  // This is a testimonial card layout - keeping the original design as a placeholder
  return (
    <div className="grid grid-cols-2 gap-6">
      {[1, 2].map(i => (
        <div key={i} className="relative bg-white rounded-lg overflow-hidden shadow-lg">
          <div className="h-48 bg-gradient-to-r from-pink-500 to-orange-500"></div>
          <div className="p-6">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
              <div>
                <h4 className="font-bold">John Doe</h4>
                <p className="text-sm text-gray-600">@johndoe</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">This is an amazing testimonial card that showcases user feedback and reviews.</p>
            <div className="flex gap-2">
              <button className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700">Follow</button>
              <button className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-50">Message</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StaticBanner5;
