import React from "react";

const Category6: React.FC = () => {
  const categories = [
    {
      count: "124 products",
      title: "Only fresh fish to your table",
      linkText: "Shop now",
      image: "assets/category/c-61.png",
    },
    {
      count: "97 products",
      title: "Products for the Easter table",
      linkText: "Shop now",
      image: "assets/category/c-62.png",
    },
    {
      count: "28 products",
      title: "Berries from the garden",
      linkText: "Shop now",
      image: "assets/category/c-63.png",
    },
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {categories.map((category, i) => (
          <div
            key={i}
            className="relative flex-1 min-h-[200px] sm:min-h-[220px] lg:min-h-60 overflow-hidden bg-cover bg-center bg-no-repeat rounded-lg"
            style={{ backgroundImage: `url(${category.image})` }}
          >
            {/* Left Text Section */}
            <div className="relative flex-1 flex flex-col justify-center px-6 sm:px-7 lg:px-8 pr-4 z-10 min-h-[200px] sm:min-h-[220px] lg:min-h-60 max-w-[240px] sm:max-w-[260px] lg:max-w-[280px]">
              {/* Product Count */}
              <p className="mb-2 sm:mb-3 text-[11px] sm:text-xs text-[#4E5562] leading-4 tracking-normal font-normal">
                {category.count}
              </p>

              {/* Title */}
              <h2 className="font-semibold mb-3 sm:mb-4 leading-6 sm:leading-7 text-lg sm:text-xl text-[#181D25] tracking-normal max-w-[160px] sm:max-w-[180px]">
                {category.title}
              </h2>

              {/* Link with Arrow */}
              <a
                href="#"
                className="inline-flex items-center gap-2 hover:opacity-80 transition text-xs sm:text-sm text-[#222934] tracking-normal leading-5 font-medium"
              >
                {category.linkText}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.58687 3.58748C5.81468 3.35967 6.18402 3.35967 6.41183 3.58748L10.4118 7.58748C10.6396 7.81529 10.6396 8.18463 10.4118 8.41244L6.41183 12.4124C6.18402 12.6402 5.81468 12.6402 5.58687 12.4124C5.35906 12.1846 5.35906 11.8153 5.58687 11.5875L9.17439 7.99996L5.58687 4.41244C5.35906 4.18463 5.35906 3.81529 5.58687 3.58748Z"
                    fill="#222934"
                  />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category6;
