import React from "react";

const Category2: React.FC = () => {
  const cards = [
    {
      label: "Ends Today",
      title: "Elements\nStyle",
      linkText: "Explore Items",
      textColor: "text-[#252B42 ]",
      labelColor: "text-[#737373]",
      image: "assets/category/c-21.png",
    },
    {
      label: "Your Space",
      title: "Unique Life",
      linkText: "Explore Items",
      textColor: "text-[#252B42]",
      labelColor: "text-[#737373]",
      image: "assets/category/c-22.png",
    },
  ];

  return (
    <div className="font-montserrat w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row h-[300px] gap-4 sm:gap-6 lg:gap-8">
        {cards.map((card, i) => (
          <div
            key={i}
            className="relative flex-1 overflow-hidden"
          >
            {/* Full Background Image */}
            <img
              src={card.image}
              alt={card.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Content Overlay - Right Aligned */}
            <div className="relative h-full flex flex-col justify-center items-end text-right px-6 sm:px-10 lg:pr-12">
              {/* Small Label */}
              <div className="mb-1 sm:mb-3">
                <span
                  className={`font-bold text-xs sm:text-sm leading-6 tracking-[0.2px] ${card.labelColor}`}
                >
                  {card.label}
                </span>
              </div>

              {/* Title */}
              <h2
                className={`font-bold mb-2 sm:mb-5 leading-7 sm:leading-12 whitespace-pre-line text-2xl sm:text-4xl tracking-[0.2px] ${card.textColor}`}
              >
                {card.title}
              </h2>

              {/* Link */}
              <a
                href="#"
                className={`font-normal inline-block hover:opacity-80 transition text-xs sm:text-sm underline tracking-[0.2px] leading-4 ${card.textColor}`}
              >
                {card.linkText}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category2;
