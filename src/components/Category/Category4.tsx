import React from "react";

interface Category4Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

export default function Category4({ settings, blocks, pageData }: Category4Props) {
  const categories = settings?.categories || [
    {
      name: "Headphones",
      count: "15 Products",
      image: "/assets/category/c-41.png",
    },
    {
      name: "Smart Watches",
      count: "14 Products",
      image: "/assets/category/c-42.png",
    },
    {
      name: "Mobile Phones",
      count: "120 Products",
      image: "/assets/category/c-43.png",
    },
    {
      name: "Earbuds",
      count: "110 Products",
      image: "/assets/category/c-44.png",
    },
    {
      name: "Monitors",
      count: "80 Products",
      image: "/assets/category/c-43.png",
    },
    {
      name: "Laptops",
      count: "75 Products",
      image: "/assets/category/c-42.png",
    },
    {
      name: "Accessories",
      count: "200 Products",
      image: "/assets/category/c-41.png",
    },
  ];

  const maxWidth = settings?.maxWidth || "1440px";
  const bgColor = settings?.bgColor || "#F7F7F7";
  const columns = settings?.columns || "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7";

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6" style={{ maxWidth }}>
      <div className={`grid ${columns} gap-4 sm:gap-6`}>
        {categories.map((category: any, i: number) => (
          <div key={i} className="relative flex flex-col items-center">
            {/* Circle Image Container with light gray background */}
            <div 
              className="relative rounded-full overflow-hidden mb-3 sm:mb-4 w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] lg:w-[180px] lg:h-[180px]" 
              style={{ backgroundColor: category.bgColor || bgColor }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover object-center p-4 sm:p-5 lg:p-6"
              />
            </div>

            {/* Category Name */}
            <h3 className="font-normal text-center text-base sm:text-lg lg:text-xl text-[#181D25] tracking-normal leading-6 sm:leading-7 lg:leading-8">
              {category.name}
            </h3>

            {/* Product Count */}
            <p className="text-center text-sm sm:text-base text-[#666666] tracking-normal leading-5 sm:leading-6 font-normal">
              {category.count}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
