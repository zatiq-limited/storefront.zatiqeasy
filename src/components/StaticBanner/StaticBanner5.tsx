import React from 'react';

interface StaticBanner5Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

export default function StaticBanner5({ settings, blocks, pageData }: StaticBanner5Props) {
  const cards = settings?.cards || [
    {
      name: "John Doe",
      username: "@johndoe",
      avatar: settings?.defaultAvatar || "/assets/avatar/default.png",
      testimonial: "This is an amazing testimonial card that showcases user feedback and reviews.",
      gradient: "from-pink-500 to-orange-500"
    },
    {
      name: "Jane Smith",
      username: "@janesmith",
      avatar: settings?.defaultAvatar || "/assets/avatar/default.png",
      testimonial: "This is an amazing testimonial card that showcases user feedback and reviews.",
      gradient: "from-pink-500 to-orange-500"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-6">
      {cards.map((card: any, i: number) => (
        <div key={i} className="relative bg-white rounded-lg overflow-hidden shadow-lg">
          <div className={`h-48 bg-gradient-to-r ${card.gradient}`}></div>
          <div className="p-6">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-3 overflow-hidden">
                {card.avatar && <img src={card.avatar} alt={card.name} className="w-full h-full object-cover" />}
              </div>
              <div>
                <h4 className="font-bold">{card.name}</h4>
                <p className="text-sm text-gray-600">{card.username}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{card.testimonial}</p>
            <div className="flex gap-2">
              <button className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
                {settings?.followButtonText || "Follow"}
              </button>
              <button className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-50">
                {settings?.messageButtonText || "Message"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
