"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useCartStore } from '@/stores';
import { useProductsStore } from '@/stores/productsStore';
import { useShopStore } from '@/stores/shopStore';
import {
  ShoppingCart,
  ZoomIn,
  Play,
  Download,
  Share2,
  Heart,
  Star,
  Minus,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductSkeleton } from '../../../../../components/skeletons/product-skeleton';
import { HeightAnimation } from '../../../../../components/animations/height-animation';
// import { RelatedProducts } from '../../../../../components/product/related-products';

/**
 * Product Details Component
 * Shows detailed product information when selected from grid
 */
export function ProductDetails() {
  const { productId } = useParams();

  // Get stores
  const { getProductById, isLoading: inventoryLoading } = useProductsStore();
  const { addProduct } = useCartStore();
  const { shopDetails } = useShopStore();

  // State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isImageLightboxOpen, setIsImageLightboxOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<Record<string, any>>({});

  // Get product
  const product = productId ? getProductById(productId as string) : null;
  const isLoading = inventoryLoading || !product;

  // Currency
  const currency = shopDetails?.currency_code === 'BDT' ? 'Tk' : shopDetails?.currency_code || '$';

  // Reset quantity when product changes
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedImageIndex(0);
      setSelectedVariant({});
    }
  }, [product]);

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;

    addProduct({
      ...product,
      qty: quantity,
      selectedVariants: selectedVariant as any
    } as any);

    // Track analytics if available
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'AddToCart', {
        content_name: product.name,
        content_ids: [product.id],
        content_type: 'product',
        value: product.price,
        currency: shopDetails?.currency_code || 'USD'
      });
    }
  };

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (product?.quantity && newQuantity > product.quantity) return;
    setQuantity(newQuantity);
  };

  // Handle image download
  const handleDownloadImage = async (imageUrl: string, index: number) => {
    // Check if image download is enabled (if property exists in shop settings)
    const shopTheme = shopDetails?.shop_theme as any;
    if (shopTheme?.enable_product_image_download === false) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${product?.name || 'product'}-image-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-500">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <Image
              src={product.images?.[selectedImageIndex] || product.image_url || '/placeholder-product.png'}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />

            {/* Image Overlay Actions */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setIsImageLightboxOpen(true)}
                className="w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors"
              >
                <ZoomIn className="w-5 h-5" />
              </button>

              {product.images?.[selectedImageIndex] && (
                <button
                  onClick={() => handleDownloadImage(product.images![selectedImageIndex], selectedImageIndex)}
                  className="w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
              )}

              <button className="w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>

              <button className="w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Stock Out Overlay */}
            {product.quantity <= 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
                    selectedImageIndex === index
                      ? "border-blue-500 scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title and Price */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-5 h-5",
                      i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                (4.0) · 123 Reviews
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {currency} {product.price.toFixed(2)}
              </span>
              {product.old_price && product.old_price > product.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {currency} {product.old_price.toFixed(2)}
                  </span>
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded">
                    Save {(product.old_price - product.price).toFixed(2)} {currency}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <HeightAnimation>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {product.description || 'No description available for this product.'}
              </p>
            </div>
          </HeightAnimation>

          {/* Product Variants */}
          {product.variant_types && product.variant_types.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Options</h3>
              {product.variant_types.map((variant: any) => (
                <div key={variant.id} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {variant.name}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variant.options?.map((option: any) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedVariant(prev => ({
                          ...prev,
                          [variant.id]: option
                        }))}
                        className={cn(
                          "px-4 py-2 rounded-lg border transition-colors",
                          selectedVariant[variant.id]?.id === option.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "border-gray-300 hover:border-gray-400"
                        )}
                      >
                        {option.value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Quantity:
              </span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-16 text-center font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={product.quantity !== undefined && quantity >= product.quantity}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {product.quantity && (
                <span className="text-sm text-gray-500">
                  {product.quantity} available
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.quantity <= 0}
              className={cn(
                "w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors",
                product.quantity <= 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              )}
            >
              <ShoppingCart size={20} />
              {product.quantity <= 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>

          {/* Additional Info */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-600 dark:text-gray-400">SKU</dt>
                <dd className="font-medium">{product.sku || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-gray-600 dark:text-gray-400">Category</dt>
                <dd className="font-medium">{product.categories?.[0]?.name || 'Uncategorized'}</dd>
              </div>
              <div>
                <dt className="text-gray-600 dark:text-gray-400">Brand</dt>
                <dd className="font-medium">{(product as any).brand_name || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-gray-600 dark:text-gray-400">Shipping</dt>
                <dd className="font-medium">Calculated at checkout</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {/* <div className="mt-16">
        <RelatedProducts productId={String(product.id)} />
      </div> */}

      {/* Image Lightbox Modal */}
      {isImageLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsImageLightboxOpen(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={product.images?.[selectedImageIndex] || product.image_url || '/placeholder-product.png'}
              alt={product.name}
              width={1200}
              height={1200}
              className="max-w-full max-h-[80vh] object-contain"
            />
            <button
              onClick={() => setIsImageLightboxOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <span className="text-white text-2xl">×</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Export as default
export default ProductDetails;