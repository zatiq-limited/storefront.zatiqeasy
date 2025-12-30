"use client";

import { useShopStore } from "@/stores/shopStore";
import { useProductsStore, type Product } from "@/stores/productsStore";
import { GridContainer } from "../../../components/core";
import { LuxuraProductCard } from "../../../components/cards";
import { SectionHeader } from "./section-header";
import { FallbackImage } from "@/components/ui/fallback-image";

interface LuxuraSelectedProductsByCategorySectionProps {
  setSelectedProduct: (product: Product | null) => void;
  navigateProductDetails: (id: number | string) => void;
}

export function LuxuraSelectedProductsByCategorySection({
  setSelectedProduct,
  navigateProductDetails,
}: LuxuraSelectedProductsByCategorySectionProps) {
  const { shopDetails } = useShopStore();
  const allProducts = useProductsStore((state) => state.products);

  // Get selected categories from shop theme
  const selectedCategories = shopDetails?.shop_theme?.selected_categories || [];

  if (selectedCategories.length === 0) {
    return null;
  }

  return (
    <div className="container">
      {selectedCategories.map((category: {
        id: number | string;
        name: string;
        banner_url?: string;
        image_url?: string;
      }, index: number) => {
        // Filter products that belong to this category
        const filteredProducts = allProducts?.filter((product) =>
          product?.categories?.some((cat) => cat?.id === category?.id)
        ) || [];

        if (filteredProducts.length === 0) return null;

        return (
          <div
            className="w-full flex flex-col gap-12 md:gap-15 xl:gap-28 mt-12 md:mt-15 xl:mt-28 first:mt-0"
            key={category.id || index}
          >
            {/* Category Banner */}
            {category?.banner_url && (
              <div>
                <FallbackImage
                  src={category.banner_url}
                  alt={category.name}
                  height={380}
                  width={1300}
                  className="w-full aspect-335/150 md:aspect-1300/380 object-cover rounded-lg md:rounded-none"
                />
              </div>
            )}

            {/* Products Grid */}
            <div>
              <SectionHeader
                text={category?.name}
                link={`/categories/${category?.id}`}
              />
              <GridContainer>
                {filteredProducts.slice(0, 4).map((product) => (
                  <LuxuraProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={() => setSelectedProduct(product)}
                    onNavigate={() => navigateProductDetails(product.id)}
                  />
                ))}
              </GridContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default LuxuraSelectedProductsByCategorySection;
