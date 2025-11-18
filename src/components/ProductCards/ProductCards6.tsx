import React, { useState } from 'react';

interface ProductCards6Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

const defaultProducts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=282&h=350&fit=crop&q=80',
    title: 'Office Executive chair- Swivel',
    salePrice: '6800.00',
    originalPrice: '7500.00',
    rating: 3,
    reviews: 12
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=282&h=350&fit=crop&q=80',
    title: 'Ergonomic Mesh Office Chair',
    salePrice: '8500.00',
    originalPrice: '9200.00',
    rating: 4,
    reviews: 24
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=282&h=350&fit=crop&q=80',
    title: 'Premium Leather Desk Chair',
    salePrice: '12000.00',
    originalPrice: '13500.00',
    rating: 5,
    reviews: 18
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=282&h=350&fit=crop&q=80',
    title: 'Modern Gaming Chair Pro',
    salePrice: '9500.00',
    originalPrice: '11000.00',
    rating: 4,
    reviews: 31
  }
];

export default function ProductCards6({ settings, blocks, pageData }: ProductCards6Props) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const products = settings?.products || defaultProducts;

  return (
    <div 
      style={{
        width: '1440px',
        margin: '0 auto',
        padding: '40px 0'
      }}
    >
      <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
        {products.map((product: any) => (
          <div 
            key={product.id}
            style={{
              width: '282px',
              height: '450px',
              backgroundColor: 'white',
              borderRadius: '0px',
              overflow: 'hidden',
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 0 0 1px #E5E7EB'
            }}
            className="hover:shadow-lg"
            onMouseEnter={() => setHoveredId(product.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Top - Image Container (350px) */}
            <div 
              style={{
                width: '282px',
                height: '350px',
                position: 'relative',
                backgroundColor: '#F5F5F5'
              }}
            >
              <img 
                src={product.image}
                alt={product.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Bottom - Content Area (100px) */}
            <div style={{ 
              padding: '12px 16px 16px 16px',
              height: '100px',
              display: 'flex', 
              flexDirection: 'column',
              backgroundColor: 'white',
              justifyContent: 'space-between'
            }}>
              {/* Title */}
              <h3 
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#181D25',
                  lineHeight: '20px',
                  marginBottom: '8px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {product.title}
              </h3>

              {/* Prices */}
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <span 
                  style={{
                    fontSize: '14px',
                    fontWeight: 400,
                    color: '#9CA3AF',
                    textDecoration: 'line-through',
                    lineHeight: '20px'
                  }}
                >
                  BDT {product.originalPrice}
                </span>
                <span 
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#181D25',
                    lineHeight: '20px'
                  }}
                >
                  BDT {product.salePrice}
                </span>
              </div>

              {/* Rating and Reviews */}
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                {/* Star Rating */}
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg 
                      key={star}
                      width="16" 
                      height="16" 
                      viewBox="0 0 16 16" 
                      fill={star <= product.rating ? '#FDB022' : '#E5E7EB'}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 0L9.79611 5.52786H15.6085L10.9062 8.94427L12.7023 14.4721L8 11.0557L3.29772 14.4721L5.09383 8.94427L0.391548 5.52786H6.20389L8 0Z" />
                    </svg>
                  ))}
                </div>
                {/* Reviews Count */}
                <span 
                  style={{
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#9CA3AF',
                    lineHeight: '16px'
                  }}
                >
                  {product.reviews} reviews
                </span>
              </div>
            </div>

            {/* Full Card Hover Overlay with Buttons */}
            {hoveredId === product.id && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(128, 128, 128, 0.6)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '0 18px',
                  borderRadius: '0px',
                  zIndex: 5
                }}
              >
                {/* Add to Cart Button */}
                <button
                  style={{
                    width: '100%',
                    height: '48px',
                    border: '1px solid #3B82F6',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#3B82F6',
                    transition: 'all 0.3s',
                    lineHeight: '20px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#EFF6FF'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  Add to Cart
                </button>

                {/* Buy Now Button */}
                <button
                  style={{
                    width: '100%',
                    height: '48px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#3B82F6',
                    transition: 'all 0.3s',
                    lineHeight: '20px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  Buy Now
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
