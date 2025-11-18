/**
 * ========================================
 * MOCK PRODUCTS DATA
 * ========================================
 *
 * Backend Developer এর জন্য API Endpoints:
 *
 * GET /api/storefront/v1/products
 * - Query params: page, limit, collection, sort
 * - Returns: Paginated products list
 *
 * GET /api/storefront/v1/products/featured
 * - Returns: Featured products for homepage
 *
 * GET /api/storefront/v1/products/:handle
 * - Returns: Single product details
 *
 * GET /api/storefront/v1/products/recommendations
 * - Query params: productId, limit
 * - Returns: Related products
 */

import type { Product, Collection } from "../lib/types";

export const mockProducts: Product[] = [
  {
    id: "prod_001",
    handle: "classic-white-tshirt",
    title: "Classic White T-Shirt",
    description: "Premium quality cotton t-shirt perfect for everyday wear",
    price: 29.99,
    compareAtPrice: 39.99,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      "https://images.unsplash.com/photo-1622445275463-afa2ab738c34",
    ],
    variants: [
      { id: "var_001_s", title: "Small", price: 29.99, available: true },
      { id: "var_001_m", title: "Medium", price: 29.99, available: true },
      { id: "var_001_l", title: "Large", price: 29.99, available: false },
    ],
    tags: ["new-arrival", "bestseller"],
    vendor: "Zatiq Basics",
    type: "T-Shirts",
  },
  {
    id: "prod_002",
    handle: "denim-jacket-blue",
    title: "Vintage Denim Jacket",
    description: "Classic denim jacket with a vintage wash",
    price: 89.99,
    compareAtPrice: 120.0,
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5",
    ],
    variants: [
      { id: "var_002_s", title: "Small", price: 89.99, available: true },
      { id: "var_002_m", title: "Medium", price: 89.99, available: true },
      { id: "var_002_l", title: "Large", price: 89.99, available: true },
    ],
    tags: ["sale", "outerwear"],
    vendor: "Urban Style",
    type: "Jackets",
  },
  {
    id: "prod_003",
    handle: "black-skinny-jeans",
    title: "Black Skinny Jeans",
    description: "Comfortable stretch denim in classic black",
    price: 69.99,
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
    ],
    variants: [
      { id: "var_003_28", title: "28", price: 69.99, available: true },
      { id: "var_003_30", title: "30", price: 69.99, available: true },
      { id: "var_003_32", title: "32", price: 69.99, available: true },
    ],
    tags: ["bestseller"],
    vendor: "Denim Co",
    type: "Jeans",
  },
  {
    id: "prod_004",
    handle: "floral-summer-dress",
    title: "Floral Summer Dress",
    description: "Light and breezy dress perfect for summer days",
    price: 79.99,
    compareAtPrice: 99.99,
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8",
    ],
    variants: [
      { id: "var_004_xs", title: "XS", price: 79.99, available: true },
      { id: "var_004_s", title: "S", price: 79.99, available: true },
      { id: "var_004_m", title: "M", price: 79.99, available: false },
    ],
    tags: ["new-arrival", "summer"],
    vendor: "Floral Dreams",
    type: "Dresses",
  },
  {
    id: "prod_005",
    handle: "leather-backpack",
    title: "Leather Backpack",
    description: "Handcrafted genuine leather backpack",
    price: 149.99,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3",
    ],
    variants: [
      { id: "var_005_brown", title: "Brown", price: 149.99, available: true },
      { id: "var_005_black", title: "Black", price: 149.99, available: true },
    ],
    tags: ["accessories", "premium"],
    vendor: "Leather Goods Co",
    type: "Bags",
  },
  {
    id: "prod_006",
    handle: "striped-polo-shirt",
    title: "Striped Polo Shirt",
    description: "Classic polo with modern stripe pattern",
    price: 45.99,
    compareAtPrice: 59.99,
    images: [
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d",
      "https://images.unsplash.com/photo-1626497764746-6dc36546b388",
    ],
    variants: [
      { id: "var_006_s", title: "Small", price: 45.99, available: true },
      { id: "var_006_m", title: "Medium", price: 45.99, available: true },
      { id: "var_006_l", title: "Large", price: 45.99, available: true },
    ],
    tags: ["sale", "casual"],
    vendor: "Polo Classics",
    type: "Polos",
  },
  {
    id: "prod_007",
    handle: "sneakers-white",
    title: "White Canvas Sneakers",
    description: "Minimalist white sneakers for everyday style",
    price: 59.99,
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772",
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb",
    ],
    variants: [
      { id: "var_007_8", title: "8", price: 59.99, available: true },
      { id: "var_007_9", title: "9", price: 59.99, available: true },
      { id: "var_007_10", title: "10", price: 59.99, available: false },
    ],
    tags: ["bestseller", "footwear"],
    vendor: "Street Shoes",
    type: "Sneakers",
  },
  {
    id: "prod_008",
    handle: "wool-sweater-navy",
    title: "Navy Wool Sweater",
    description: "Warm and cozy merino wool sweater",
    price: 99.99,
    compareAtPrice: 139.99,
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633",
    ],
    variants: [
      { id: "var_008_s", title: "Small", price: 99.99, available: true },
      { id: "var_008_m", title: "Medium", price: 99.99, available: true },
      { id: "var_008_l", title: "Large", price: 99.99, available: true },
    ],
    tags: ["winter", "premium"],
    vendor: "Wool & Co",
    type: "Sweaters",
  },
];

export const mockCollections: Collection[] = [
  {
    id: "col_001",
    handle: "womens",
    title: "Women's Collection",
    description: "Discover the latest trends in women's fashion",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
    products: mockProducts.filter((p) =>
      ["prod_001", "prod_004"].includes(p.id)
    ),
  },
  {
    id: "col_002",
    handle: "mens",
    title: "Men's Collection",
    description: "Stylish and comfortable clothing for men",
    image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891",
    products: mockProducts.filter((p) =>
      ["prod_002", "prod_003", "prod_006"].includes(p.id)
    ),
  },
  {
    id: "col_003",
    handle: "new-arrivals",
    title: "New Arrivals",
    description: "Check out our latest additions",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    products: mockProducts.filter((p) => p.tags.includes("new-arrival")),
  },
  {
    id: "col_004",
    handle: "sale",
    title: "Sale",
    description: "Amazing deals you don't want to miss",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da",
    products: mockProducts.filter((p) => p.tags.includes("sale")),
  },
];
