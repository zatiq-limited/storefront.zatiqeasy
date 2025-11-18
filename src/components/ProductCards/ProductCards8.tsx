import React from 'react';

interface ProductCards8Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

const defaultProducts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=298&h=271&fit=crop&q=80',
    category: 'Vegetables',
    title: 'Fresh organic apple 1kg simla marming',
    price: '170.00',
    rating: 3,
    ratingCount: '4.0'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=298&h=271&fit=crop&q=80',
    category: 'Fruits',
    title: 'Premium organic oranges 1kg fresh',
    price: '220.00',
    rating: 4,
    ratingCount: '4.5'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1464454709131-ffd692591ee5?w=298&h=271&fit=crop&q=80',
    category: 'Fruits',
    title: 'Natural strawberry pack 500g organic',
    price: '280.00',
    rating: 5,
    ratingCount: '5.0'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1490885578174-acda8905c2c6?w=298&h=271&fit=crop&q=80',
    category: 'Vegetables',
    title: 'Organic tomatoes bundle 1kg fresh',
    price: '150.00',
    rating: 4,
    ratingCount: '4.3'
  }
];

export default function ProductCards8({ settings, blocks, pageData }: ProductCards8Props) {
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
              width: '298px',
              height: '472px',
              backgroundColor: 'white',
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.3s',
              border: '1px solid #F3F4F6'
            }}
            className="hover:shadow-lg"
          >
            {/* Top - Image Container (271px) */}
            <div 
              style={{
                width: '298px',
                height: '271px',
                position: 'relative',
                backgroundColor: '#FAFAFA'
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

            {/* Bottom - Content Area (201px) */}
            <div style={{ 
              padding: '16px 20px 20px 20px',
              height: '201px',
              display: 'flex', 
              flexDirection: 'column',
              backgroundColor: 'white'
            }}>
              {/* Category */}
              <div 
                style={{
                  fontSize: '12px',
                  color: '#9CA3AF',
                  fontWeight: 400,
                  lineHeight: '16px',
                  marginBottom: '8px'
                }}
              >
                {product.category}
              </div>

              {/* Title */}
              <h3 
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1F2937',
                  lineHeight: '22px',
                  marginBottom: '12px',
                  minHeight: '44px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {product.title}
              </h3>

              {/* Rating */}
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '16px'
              }}>
                {/* Star Rating */}
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg 
                      key={star}
                      width="16" 
                      height="16" 
                      viewBox="0 0 16 16" 
                      fill={star <= product.rating ? '#FFA500' : '#E5E7EB'}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 0L9.79611 5.52786H15.6085L10.9062 8.94427L12.7023 14.4721L8 11.0557L3.29772 14.4721L5.09383 8.94427L0.391548 5.52786H6.20389L8 0Z" />
                    </svg>
                  ))}
                </div>
                {/* Rating Count */}
                <span 
                  style={{
                    fontSize: '14px',
                    fontWeight: 400,
                    color: '#6B7280',
                    lineHeight: '20px'
                  }}
                >
                  ({product.ratingCount})
                </span>
              </div>

              {/* Price and Button Row */}
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                {/* Price */}
                <span 
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#10B981',
                    lineHeight: '28px'
                  }}
                >
                  BDT {product.price}
                </span>

                {/* Add Button */}
                <button
                  style={{
                    width: '80px',
                    height: '40px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: '#EF4444',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#EF4444'}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M2 2H3.33333L3.6 3.33333M4.66667 8.66667H11.3333L14 3.33333H3.6M4.66667 8.66667L3.6 3.33333M4.66667 8.66667L3.13809 10.1953C2.71809 10.6152 3.01554 11.3333 3.60947 11.3333H11.3333M11.3333 11.3333C10.597 11.3333 10 11.9303 10 12.6667C10 13.403 10.597 14 11.3333 14C12.0697 14 12.6667 13.403 12.6667 12.6667C12.6667 11.9303 12.0697 11.3333 11.3333 11.3333ZM6 12.6667C6 13.403 5.40305 14 4.66667 14C3.93029 14 3.33333 13.403 3.33333 12.6667C3.33333 11.9303 3.93029 11.3333 4.66667 11.3333C5.40305 11.3333 6 11.9303 6 12.6667Z" 
                      stroke="white" 
                      strokeWidth="1.33" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
