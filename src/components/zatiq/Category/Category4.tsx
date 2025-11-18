import React from "react";

const Category4: React.FC = () => {
  const categories = [
    {
      name: "Headphones",
      count: "15 Products",
      image: "assets/category/c-41.png",
    },
    {
      name: "Smart Watches",
      count: "14 Products",
      image: "assets/category/c-42.png",
    },
    {
      name: "Mobile Phones",
      count: "120 Products",
      image: "assets/category/c-43.png",
    },
    {
      name: "Earbuds",
      count: "110 Products",
      image: "assets/category/c-44.png",
    },
    {
      name: "Monitors",
      count: "80 Products",
      image: "assets/category/c-43.png",
    },
    {
      name: "Laptops",
      count: "75 Products",
      image: "assets/category/c-42.png",
    },
    {
      name: "Accessories",
      count: "200 Products",
      image: "assets/category/c-41.png",
    },
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6">
        {categories.map((category, i) => (
          <div key={i} className="relative flex flex-col items-center">
            {/* Circle Image Container with light gray background */}
            <div className="relative rounded-full overflow-hidden mb-3 sm:mb-4 w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] lg:w-[180px] lg:h-[180px] bg-[#F7F7F7]">
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
};

export default Category4;
