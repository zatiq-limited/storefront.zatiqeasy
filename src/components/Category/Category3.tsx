import React from "react";

interface Category3Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

export default function Category3({ settings, blocks, pageData }: Category3Props) {
  const cards = settings?.cards || [
    {
      label: "Ends Today",
      title: "Elements\nStyle",
      linkText: "Explore Items",
      image: "/assets/category/c-31.png",
    },
    {
      label: "Ends Today",
      title: "Elements\nStyle",
      linkText: "Explore Items",
      image: "/assets/category/c-32.png",
    },
    {
      label: "Your Space",
      title: "Unique Life",
      linkText: "Explore Items",
      image: "/assets/category/c-32.png",
    },
  ];

  const maxWidth = settings?.maxWidth || "1440px";
  const labelColor = settings?.labelColor || "text-[#E77C40]";
  const titleColor = settings?.titleColor || "text-[#252B42]";
  const linkColor = settings?.linkColor || "text-[#252B42]";

  return (
    <div className="font-montserrat w-full mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth }}>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8">
        {cards.map((card: any, i: number) => (
          <div
            key={i}
            className="relative flex-1 min-h-[350px] sm:min-h-[400px] lg:min-h-[434px] overflow-hidden"
          >
            {/* Image Section - Starts 96px from left */}
            <div className="absolute top-0 w-full sm:w-[400px] lg:w-[460px] h-full">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text Content - Positioned on left side of card */}
            <div className="relative min-h-[350px] sm:min-h-[400px] lg:min-h-[434px] flex flex-col justify-center px-6 sm:px-8 lg:px-10 pr-8 z-10">
              {/* Title */}
              <h2
                className={`max-w-32 sm:max-w-36 lg:max-w-40 font-bold mb-2 leading-tight sm:leading-[3rem] lg:leading-12 whitespace-pre-line text-3xl sm:text-4xl lg:text-5xl tracking-[0.2px] ${card.titleColor || titleColor}`}
              >
                {card.title}
              </h2>

              {/* Small Label */}
              <div className="mb-4 sm:mb-5">
                <span
                  className={`font-bold text-xs sm:text-sm tracking-[0.2px] leading-6 ${card.labelColor || labelColor}`}
                >
                  {card.label}
                </span>
              </div>

              {/* Link */}
              <a
                href={card.link || "#"}
                className={`font-bold inline-block hover:opacity-80 transition text-xs sm:text-sm underline leading-6 tracking-[0.2px] ${card.linkColor || linkColor}`}
              >
                {card.linkText}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
