import { NextRequest, NextResponse } from "next/server";
import productData from "@/data/api-responses/product.json";
import productsData from "@/data/api-responses/products.json";

// Revalidate every 60 seconds
export const revalidate = 60;

interface RouteParams {
  params: Promise<{ handle: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { handle } = await params;

  // In production, this would fetch from a database
  // For now, we check if handle matches product id or slug
  const productFromList = productsData.data?.products?.find(
    (p) =>
      p.id.toString() === handle ||
      p.name.toLowerCase().replace(/\s+/g, "-") === handle.toLowerCase()
  );

  // Use detailed product data if handle matches, otherwise use from list
  let product = null;

  if (
    handle === "1" ||
    handle === "classic-white-shirt" ||
    handle === productData.data?.product?.id?.toString()
  ) {
    product = productData.data?.product;
  } else if (productFromList) {
    // Create a detailed product from list data
    product = {
      ...productFromList,
      slug: productFromList.name.toLowerCase().replace(/\s+/g, "-"),
      reviews: [],
      related_products: productsData.data?.products
        ?.filter((p) => p.id !== productFromList.id)
        .slice(0, 8),
      theme: {
        id: productFromList.id,
        slug: productFromList.name.toLowerCase().replace(/\s+/g, "-"),
        page_title: `${productFromList.name} | ZatiqEasy`,
        page_description:
          productFromList.description || productFromList.short_description,
        theme_name: "Modern Product",
        theme_data: {
          gallery_layout: "thumbnails_left",
          show_zoom: true,
          show_size_guide: true,
          show_share_buttons: true,
        },
        preview: productFromList.image_url,
      },
    };
  }

  if (!product) {
    return NextResponse.json(
      {
        success: false,
        error: "Product not found",
      },
      {
        status: 404,
        headers: {
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
        },
      }
    );
  }

  return NextResponse.json(
    {
      success: true,
      data: {
        product,
      },
    },
    {
      headers: {
        // Longer cache for individual products
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
      },
    }
  );
}
