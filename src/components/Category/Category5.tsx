import React from "react";

interface Category5Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

export default function Category5({ settings, blocks, pageData }: Category5Props) {
  const categories = settings?.categories || [
    {
      name: "Bedroom",
      image: "/assets/category/c-51.png",
    },
    {
      name: "Living room",
      image: "/assets/category/c-52.png",
    },
    {
      name: "Bathroom",
      image: "/assets/category/c-53.png",
    },
    {
      name: "Decoration",
      image: "/assets/category/c-54.png",
    },
    {
      name: "Office",
      image: "/assets/category/c-52.png",
    },
    {
      name: "Kitchen",
      image: "/assets/category/c-51.png",
    },
  ];

  const maxWidth = settings?.maxWidth || "1440px";
  const bgColor = settings?.bgColor || "#F5F5F8";
  const columns = settings?.columns || "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6";

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6" style={{ maxWidth }}>
      <div className={`grid ${columns} gap-4 sm:gap-6`}>
        {categories.map((category: any, i: number) => (
          <div key={i} className="relative flex flex-col items-center">
            {/* Circle Image Container with light background */}
            <div 
              className="relative rounded-full overflow-hidden mb-3 sm:mb-4 w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40" 
              style={{ backgroundColor: category.bgColor || bgColor }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Category Name */}
            <h3 className="font-semibold text-center text-sm sm:text-base text-[#181D25] tracking-normal leading-5 sm:leading-6">
              {category.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
