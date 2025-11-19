import React from "react";

interface Block {
  name?: string;
  title?: string;
  image?: string;
  titleColor?: string;
  url?: string;
}

interface Category5Props {
  blocks?: Block[];
}

const Category5: React.FC<Category5Props> = ({ blocks = [] }) => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-0 lg:px-8 py-6 pb-8 sm:pb-14">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {blocks.map((category, i) => (
          <a
            key={i}
            href={category.url || "#"}
            className="relative flex flex-col items-center hover:opacity-80 transition"
          >
            {/* Circle Image Container with light background */}
            {category.image && (
              <div className="relative rounded-full overflow-hidden mb-3 sm:mb-4 w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 bg-[#F5F5F8]">
                <img
                  src={category.image}
                  alt={category.name || category.title || "Category"}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Category Name */}
            {(category.name || category.title) && (
              <h3
                className="font-semibold text-center text-sm sm:text-base tracking-normal leading-5 sm:leading-6"
                style={{ color: category.titleColor || "#181D25" }}
              >
                {category.name || category.title}
              </h3>
            )}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Category5;
