import React from "react";

interface Category1Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

export default function Category1({ settings, blocks, pageData }: Category1Props) {
  const cards = settings?.cards || [
    {
      label: "Ends Today",
      title: "Elements Of Style",
      subtitle: "Top Ten Products of the Week",
      image: "/assets/category/c-11.png",
      labelColor: "text-[#E77C40]",
      titleColor: "text-[#252B42]",
      subtitleColor: "text-[#737373]",
      linkColor: "text-[#252B42]",
    },
    {
      label: "Your Space",
      title: "Unique Life",
      subtitle: "Top Ten Products of the Week",
      image: "/assets/category/c-12.png",
      labelColor: "text-[#ECECEC]",
      titleColor: "text-white",
      subtitleColor: "text-white",
      linkColor: "text-white",
    },
    {
      label: "Your Space",
      title: "Unique Life",
      subtitle: "Top Ten Products of the Week",
      image: "/assets/category/c-12.png",
      labelColor: "text-[#ECECEC]",
      titleColor: "text-white",
      subtitleColor: "text-white",
      linkColor: "text-white",
    },
  ];

  const maxWidth = settings?.maxWidth || "1440px";
  const linkText = settings?.linkText || "Explore Items";

  return (
    <div className="font-montserrat w-full mx-auto px-4" style={{ maxWidth }}>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8">
        {cards.map((card: any, i: number) => (
          <div
            key={i}
            className="relative flex-1 h-[280px] lg:h-[300px] overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${card.image})` }}
          >
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black/5"></div>

            {/* Left Content Section */}
            <div className="relative z-10 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 flex flex-col justify-center px-6 sm:px-8 lg:px-9 py-6 h-full">
              {/* Small Label */}
              <div className="mb-3 sm:mb-4 lg:mb-5">
                <span
                  className={`font-bold tracking-[0.2px] leading-6 text-xs sm:text-sm ${card.labelColor}`}
                >
                  {card.label}
                </span>
              </div>

              {/* Title */}
              <h2
                className={`font-bold mb-2 sm:mb-3 leading-7 sm:leading-8 text-xl sm:text-2xl tracking-[0.1px] ${card.titleColor}`}
              >
                {card.title}
              </h2>

              {/* Subtitle */}
              <p
                className={`mb-4 sm:mb-5 text-xs sm:text-sm font-normal leading-5 tracking-[0.2px] ${card.subtitleColor}`}
              >
                {card.subtitle}
              </p>

              {/* Link */}
              <a
                href={card.link || "#"}
                className={`font-bold inline-block hover:opacity-80 transition text-xs sm:text-sm underline leading-6 tracking-[0.2px] ${card.linkColor}`}
              >
                {card.linkText || linkText}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
