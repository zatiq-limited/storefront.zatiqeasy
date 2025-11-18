import React from "react";

const Category5: React.FC = () => {
  const categories = [
    {
      name: "Bedroom",
      image: "assets/category/c-51.png",
    },
    {
      name: "Living room",
      image: "assets/category/c-52.png",
    },
    {
      name: "Bathroom",
      image: "assets/category/c-53.png",
    },
    {
      name: "Decoration",
      image: "assets/category/c-54.png",
    },
    {
      name: "Office",
      image: "assets/category/c-52.png",
    },
    {
      name: "Kitchen",
      image: "assets/category/c-51.png",
    },
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {categories.map((category, i) => (
          <div key={i} className="relative flex flex-col items-center">
            {/* Circle Image Container with light background */}
            <div className="relative rounded-full overflow-hidden mb-3 sm:mb-4 w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 bg-[#F5F5F8]">
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
};

export default Category5;
